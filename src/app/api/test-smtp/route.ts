// src/app/api/test-smtp/route.ts

import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Test connection
    await transporter.verify();
    console.log('SMTP connection verified');

    // Try sending a test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'horistics@gmail.com', // Send to yourself
      subject: 'SMTP Test from BondText',
      text: 'This is a test email from your BondText application',
      html: '<p>This is a test email from your BondText application</p>',
    });

    return Response.json({ 
      success: true, 
      message: 'SMTP test successful - check your email',
      messageId: info.messageId 
    });
  } catch (error: any) { // Fix: Add type annotation
    console.error('SMTP Error:', error);
    return Response.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
}

