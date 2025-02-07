import nodemailer, {type Transporter} from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import {NotificationService} from '.';

const defaultTransporter = nodemailer.createTransport({
  pool: true,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
} as any);

export class MailNotificationService implements NotificationService {
  private transporter: Transporter;
  constructor(
    transporterConfig?: SMTPTransport | SMTPTransport.Options | string,
  ) {
    this.transporter = transporterConfig
      ? nodemailer.createTransport(transporterConfig)
      : defaultTransporter;
  }

  async notify(data: any = {}) {
    if (!data?.to) {
      throw new Error('Recipient is required');
    }

    const {to, subject, text, html, attachments} = data;
    const from = process.env.MAIL_EMAIL || process.env.MAIL_USER;

    const mailOptions = {
      to,
      subject,
      text,
      html,
      from,
      attachments,
    };

    try {
      return this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}

export default MailNotificationService;
