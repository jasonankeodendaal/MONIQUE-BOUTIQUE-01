import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, whatsapp, subject, message } = req.body;
    
    let adminEmail = process.env.ADMIN_EMAIL || 'admin@findara.com'; // Default fallback
    const { data } = await supabase.from('settings').select('contactEmail').single();
    if (data && (data as any).contactEmail) {
      adminEmail = (data as any).contactEmail;
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
  } catch (error: any) {
    console.error('Error sending email:', {
      email: req.body.email,
      subject: req.body.subject,
      error: error.message
    });
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}
