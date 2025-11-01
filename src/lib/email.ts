//src/lib/email.ts

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,  // Changed
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),  // Changed
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,  // Changed
    pass: process.env.EMAIL_SERVER_PASSWORD,  // Changed
  },
});

export async function sendVerificationEmail(email: string, token: string, userType: 'customer' | 'restaurant' = 'restaurant') {
  const verificationUrl = userType === 'customer' 
    ? `${process.env.NEXTAUTH_URL}/customer/verify-email?token=${token}`
    : `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  const subject = userType === 'customer' 
    ? 'Verify your BondText Customer Account'
    : 'Verify your BondText Restaurant Account';

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: subject,
    html: `
      <div>
        <h2>Welcome to BondText!</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        ">Verify Email</a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string, userType: 'customer' | 'restaurant' = 'restaurant') {
  const resetUrl = userType === 'customer'
    ? `${process.env.NEXTAUTH_URL}/customer/reset-password?token=${token}`
    : `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  const subject = userType === 'customer'
    ? 'Reset your BondText Customer Password'
    : 'Reset your BondText Restaurant Password';

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: subject,
    html: `
      <div>
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        ">Reset Password</a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
}

