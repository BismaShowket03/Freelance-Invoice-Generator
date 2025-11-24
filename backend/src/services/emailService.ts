import nodemailer from 'nodemailer';

interface SendInvoiceEmailParams {
  to: string;
  subject: string;
  html: string;
  attachments: {
    filename: string;
    content: Buffer;
  }[];
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});

export const sendInvoiceEmail = async ({ to, subject, html, attachments }: SendInvoiceEmailParams) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email service is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.');
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || `Freelance CRM <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
};


