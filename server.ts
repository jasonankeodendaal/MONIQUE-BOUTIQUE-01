import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client for server-side use
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Dynamic robots.txt
  app.get('/robots.txt', async (req: Request, res: Response) => {
    try {
      const { data: settings } = await supabase.from('site_settings').select('*').single();
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
      const { data: products } = await supabase.from('products').select('id, createdAt');
      const { data: categories } = await supabase.from('categories').select('id');
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
        const { data: settings } = await supabase.from('site_settings').select('*').single();
        if (settings) {
          const headerScripts = (settings.customHeaderScripts || '') + 
            (settings.googleAnalyticsId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${settings.googleAnalyticsId}');</script>` : '') +
            (settings.gscVerificationId ? `<meta name="google-site-verification" content="${settings.gscVerificationId}" />` : '');
          
          const footerScripts = settings.customFooterScripts || '';
          
          template = template.replace('</head>', `${headerScripts}</head>`);
          template = template.replace('</body>', `${footerScripts}</body>`);
        }
        
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
        const { data: settings } = await supabase.from('site_settings').select('*').single();
        if (settings) {
          const headerScripts = (settings.customHeaderScripts || '') + 
            (settings.googleAnalyticsId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${settings.googleAnalyticsId}');</script>` : '') +
            (settings.gscVerificationId ? `<meta name="google-site-verification" content="${settings.gscVerificationId}" />` : '');
          
          const footerScripts = settings.customFooterScripts || '';
          
          template = template.replace('</head>', `${headerScripts}</head>`);
          template = template.replace('</body>', `${footerScripts}</body>`);
        }
        
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
