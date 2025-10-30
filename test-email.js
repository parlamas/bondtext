// Load environment variables first!
require('dotenv').config();

const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('🔧 Testing email configuration...');
  console.log('📧 Email Host:', process.env.EMAIL_HOST);
  console.log('📧 Email User:', process.env.EMAIL_USER);
  console.log('📧 Has Password:', !!process.env.EMAIL_PASSWORD);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    console.log('🔄 Testing SMTP connection to:', process.env.EMAIL_HOST);
    await transporter.verify();
    console.log('✅ SMTP connection successful!');

    console.log('📧 Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from BondText',
      text: 'This is a test email from BondText!',
    });

    console.log('✅ Test email sent successfully!');
    console.log('📨 Message ID:', result.messageId);
    
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
  }
}

testEmail();

