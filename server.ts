import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client for server-side use lazily
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey);
    }
  }
  return supabase;
}

let resendClient: Resend | null = null;

function getResend() {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      resendClient = new Resend(key);
    }
  }
  return resendClient;
}

function generateSeoTags(settings: any, url: string, product?: any) {
  if (!settings) {
    return `
    <title>Findara | Your Bridge to Global Trends</title>
    <meta name="title" content="Findara | Your Bridge to Global Trends" />
    <meta name="description" content="A curated gateway to Shein and global fashion trends. Discover my personal favorites and professional fashion picks." />
    `;
  }
  
  const title = product ? `${product.name} | ${settings.companyName || 'Findara'}` : (settings.seoTitle || settings.companyName || 'Findara');
  const description = product ? (product.description || '').substring(0, 160) : (settings.seoDescription || settings.footerDescription || '');
  const image = product ? product.imageUrl : (settings.seoOgImage || settings.companyLogoUrl || '');
  const baseUrl = process.env.APP_URL || 'https://findara.com';
  const canonicalUrl = `${baseUrl}${url}`;
  
  let tags = `
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${canonicalUrl}" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image" content="${image}" />
  `;

  if (settings.gscVerificationId) {
    tags += `\n    <meta name="google-site-verification" content="${settings.gscVerificationId}" />`;
  }

  if (settings.seoEnableCanonicalTags) {
    tags += `\n    <link rel="canonical" href="${canonicalUrl}" />`;
  }

  if (settings.enableSchemaMarkup) {
    let schemaJson;
    if (product) {
      schemaJson = JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.imageUrl,
        "description": product.description,
        "sku": product.id,
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "USD",
          "price": product.price || "0.00",
          "availability": "https://schema.org/InStock"
        }
      });
    } else {
      schemaJson = settings.customSchemaJson || JSON.stringify({
        "@context": "https://schema.org",
        "@type": settings.schemaType || "LocalBusiness",
        "name": settings.localBusinessName || settings.companyName,
        "image": settings.companyLogoUrl,
        "telephone": settings.localBusinessPhone || settings.contactPhone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": settings.localBusinessAddress || settings.address
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "description": settings.localBusinessOpeningHours || settings.contactHoursWeekdays
        }
      });
    }
    tags += `\n    <script type="application/ld+json">\n${schemaJson}\n    </script>`;
  }

  return tags;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Contact API endpoint
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const { name, email, whatsapp, subject, message } = req.body;
      
      const resend = getResend();
      if (!resend) {
        console.warn('RESEND_API_KEY is not set. Skipping email notification.');
        return res.status(200).json({ success: true, message: 'Inquiry saved (email skipped)' });
      }

      const client = getSupabase();
      let adminEmail = 'admin@findara.com'; // Default fallback
      if (client) {
        const { data } = await client.from('settings').select('contactEmail').single();
        if (data && (data as any).contactEmail) {
          adminEmail = (data as any).contactEmail;
        }
      }

      await resend.emails.send({
        from: 'Findara <onboarding@resend.dev>',
        to: adminEmail,
        subject: `New Inquiry: ${subject}`,
        html: `
          <h2>New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });

      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  });

  // Dynamic robots.txt
  app.get('/robots.txt', async (req: Request, res: Response) => {
    try {
      const client = getSupabase();
      let settings: any = null;
      if (client) {
        const { data } = await client.from('settings').select('*').single();
        settings = data;
      }
      const baseUrl = process.env.APP_URL || 'https://findara.com';
      
      let robotsTxt = 'User-agent: *\nAllow: /\n';
      robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\n`;
      
      if (settings?.isMaintenanceMode) {
        robotsTxt = 'User-agent: *\nDisallow: /\n';
      }
      
      res.type('text/plain');
      res.send(robotsTxt);
    } catch (error) {
      res.status(500).send('Error generating robots.txt');
    }
  });

  // Dynamic sitemap.xml
  app.get('/sitemap.xml', async (req: Request, res: Response) => {
    try {
      const client = getSupabase();
      let products: any[] | null = null;
      let categories: any[] | null = null;
      if (client) {
        const { data: p } = await client.from('products').select('id, createdAt');
        const { data: c } = await client.from('categories').select('id');
        products = p;
        categories = c;
      }
      const baseUrl = process.env.APP_URL || 'https://findara.com';
      
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // Static pages
      const staticPages = ['', '/products', '/about', '/contact', '/legal/disclosure', '/legal/privacy', '/legal/terms'];
      staticPages.forEach(page => {
        sitemap += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
      });
      
      // Products
      products?.forEach(product => {
        sitemap += `  <url>\n    <loc>${baseUrl}/product/${product.id}</loc>\n    <lastmod>${new Date(product.createdAt).toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      });

      // Categories
      categories?.forEach(category => {
        sitemap += `  <url>\n    <loc>${baseUrl}/products?category=${category.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      });
      
      sitemap += '</urlset>';
      
      res.type('application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).send('Error generating sitemap.xml');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    app.use(vite.middlewares);
    
    // Inject scripts in dev
    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        
        // Fetch settings for script injection
        const client = getSupabase();
        let settings: any = null;
        let product: any = null;
        if (client) {
          const { data } = await client.from('settings').select('*').single();
          settings = data;
          
          // Check if it's a product page
          const productMatch = url.match(/^\/product\/([a-zA-Z0-9-]+)/);
          if (productMatch && productMatch[1]) {
            const { data: productData } = await client.from('products').select('*').eq('id', productMatch[1]).single();
            if (productData) {
              product = productData;
            }
          }
        }
        if (settings) {
          const headerScripts = (settings.customHeaderScripts || '') + 
            (settings.googleAnalyticsId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${settings.googleAnalyticsId}');</script>` : '');
          
          const footerScripts = settings.customFooterScripts || '';
          
          template = template.replace('</head>', `${headerScripts}</head>`);
          template = template.replace('</body>', `${footerScripts}</body>`);
        }
        
        const seoTags = generateSeoTags(settings, url, product);
        template = template.replace('<!-- SEO_TAGS -->', seoTags);
        
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    
    app.get('*', async (req: Request, res: Response) => {
      try {
        let template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
        
        // Fetch settings for script injection
        const client = getSupabase();
        let settings: any = null;
        let product: any = null;
        if (client) {
          const { data } = await client.from('settings').select('*').single();
          settings = data;
          
          // Check if it's a product page
          const productMatch = req.originalUrl.match(/^\/product\/([a-zA-Z0-9-]+)/);
          if (productMatch && productMatch[1]) {
            const { data: productData } = await client.from('products').select('*').eq('id', productMatch[1]).single();
            if (productData) {
              product = productData;
            }
          }
        }
        if (settings) {
          const headerScripts = (settings.customHeaderScripts || '') + 
            (settings.googleAnalyticsId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${settings.googleAnalyticsId}');</script>` : '');
          
          const footerScripts = settings.customFooterScripts || '';
          
          template = template.replace('</head>', `${headerScripts}</head>`);
          template = template.replace('</body>', `${footerScripts}</body>`);
        }
        
        const seoTags = generateSeoTags(settings, req.originalUrl, product);
        template = template.replace('<!-- SEO_TAGS -->', seoTags);
        
        res.status(200).set({ 'Content-Type': 'text/html' }).send(template);
      } catch (e) {
        res.status(500).send('Error loading template');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
