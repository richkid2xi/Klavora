import nodemailer from 'nodemailer';
import { getConfig } from '../config';

let transporter: nodemailer.Transporter | null = null;

export function getMailTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const config = getConfig();
  
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
    console.warn('⚠️ SMTP not configured - emails will not be sent');
    return createDevTransporter();
  }

  transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT || 587,
    secure: config.SMTP_PORT === 465,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  return transporter;
}

function createDevTransporter(): nodemailer.Transporter {
  // Development transporter that logs emails
  return nodemailer.createTransport({
    jsonTransport: true,
  });
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  const config = getConfig();

  // If SMTP not configured, log the email instead
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
    console.log('📧 Email (not sent - SMTP not configured):');
    console.log(`   To: ${options.to}`);
    console.log(`   Subject: ${options.subject}`);
    return false;
  }

  try {
    const info = await getMailTransporter().sendMail({
      from: config.EMAIL_FROM || 'noreply@klavora.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log(`✅ Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<void> {
  const config = getConfig();
  const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: email,
    subject: 'Reset your Klavora password',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset your Klavora password</h2>
        <p>You requested a password reset for your Klavora account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #00a3ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #666; font-size: 12px;">
          Klavora Pharmacy Management System
        </p>
      </div>
    `,
    text: `Reset your Klavora password: ${resetUrl}`,
  });
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string,
  pharmacyName: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Welcome to Klavora',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Klavora, ${firstName}!</h2>
        <p>Your pharmacy <strong>${pharmacyName}</strong> has been set up successfully.</p>
        <p>You can now log in to manage your pharmacy inventory.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #666; font-size: 12px;">
          Klavora Pharmacy Management System
        </p>
      </div>
    `,
  });
}

export async function sendLowStockAlert(
  email: string,
  items: { name: string; quantity: number; reorderLevel: number }[]
): Promise<void> {
  const itemsHtml = items
    .map(item => `<li>${item.name}: ${item.quantity} remaining (reorder at ${item.reorderLevel})</li>`)
    .join('');

  await sendEmail({
    to: email,
    subject: 'Low Stock Alert - Klavora',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Low Stock Alert</h2>
        <p>The following items are running low:</p>
        <ul>${itemsHtml}</ul>
        <p>Please restock to avoid stockouts.</p>
      </div>
    `,
  });
}

export async function sendExpiryAlert(
  email: string,
  items: { name: string; batchNumber: string; expiryDate: Date }[]
): Promise<void> {
  const itemsHtml = items
    .map(item => `<li>${item.name} (${item.batchNumber}) - Expires: ${item.expiryDate.toLocaleDateString()}</li>`)
    .join('');

  await sendEmail({
    to: email,
    subject: 'Expiry Alert - Klavora',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Expiry Alert</h2>
        <p>The following items are expiring soon:</p>
        <ul>${itemsHtml}</li>
        <p>Please use these items before they expire.</p>
      </div>
    `,
  });
}