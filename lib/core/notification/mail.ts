import nodemailer from 'nodemailer';
import {NotificationService} from '.';

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export class MailNotificationService implements NotificationService {
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
      return transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}

export default MailNotificationService;
