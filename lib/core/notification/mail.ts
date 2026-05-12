import {experimental_taintUniqueValue} from 'react';
import nodemailer, {type Transporter} from 'nodemailer';
import type SMTPPool from 'nodemailer/lib/smtp-pool';
import type Mail from 'nodemailer/lib/mailer';

import {NotificationService, type MailNotificationData} from '.';

export class MailNotificationService implements NotificationService {
  private transporter: Transporter;

  private constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  static create(
    transporterConfig?: SMTPPool | SMTPPool.Options | string,
  ): MailNotificationService | null {
    if (
      !transporterConfig &&
      (!process.env.MAIL_HOST ||
        !process.env.MAIL_PORT ||
        !process.env.MAIL_USER ||
        !process.env.MAIL_PASSWORD)
    ) {
      console.log('Email not configured');
      return null;
    }

    const mailUser = process.env.MAIL_USER;
    const mailPassword = process.env.MAIL_PASSWORD;

    if (mailPassword) {
      experimental_taintUniqueValue(
        'Mail password is a server secret. Do not pass to Client Components.',
        process,
        mailPassword,
      );
    }

    const config = {
      pool: true,
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: mailUser,
        pass: mailPassword,
      },
    } satisfies SMTPPool.Options;

    const transporter = transporterConfig
      ? nodemailer.createTransport(transporterConfig)
      : nodemailer.createTransport(config);

    return new MailNotificationService(transporter);
  }

  async notify(data: MailNotificationData): Promise<SMTPPool.SentMessageInfo> {
    if (!data.to) {
      throw new Error('Recipient is required');
    }

    const {to, subject, text, html, attachments, icalEvent} = data;
    const from = process.env.MAIL_EMAIL || process.env.MAIL_USER;

    const mailOptions: Mail.Options = {
      to,
      subject,
      text,
      html,
      from,
      attachments,
      icalEvent,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

export default MailNotificationService;
