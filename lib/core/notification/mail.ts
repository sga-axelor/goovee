import nodemailer, {type Transporter} from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import {NotificationService} from '.';

const defaultTransporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

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

    const {to, subject, text, html} = data;

    const mailOptions = {
      to,
      subject,
      text,
      html,
    };

    try {
      return this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}

export default MailNotificationService;
