import type {Track} from '@/lib/core/comments';
import NotificationManager, {NotificationType} from '@/notification';
import {html} from '@/utils/template-string';

import type {UTicket} from '../orm/tickets';

type MailProps = {
  subject: string;
  body: {
    title?: string;
    tracks: Track[];
    ticketName: string;
    projectName: string;
  };
  reciepients: string[];
};

export async function sendTrackMail(props: MailProps): Promise<void> {
  const {subject, body, reciepients: to} = props;
  const mailService = NotificationManager.getService(NotificationType.mail);
  if (!mailService) {
    console.error('Mail service is not available.');
    return;
  }
  const html = generateTrackHTML(body);
  mailService.notify({subject, to, html});
}

function generateTrackHTML(body: MailProps['body']) {
  const {title, tracks, projectName, ticketName} = body;

  return html`
<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body>
        <!--NOTE: yahoo mail doesn't support <style> tag in head  -->
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e2e8f0;
          }
          .header {
            background: #1c1f55;
            color: #ffffff;
            padding: 16px;
            text-align: center;
            border-bottom: 1px solid #0056b3;
          }
          .header h1 {
            font-size: 20px;
            font-weight: 600;
            margin: 0;
          }
          .project-ticket {
            padding: 16px;
            background: #f0f4f8;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
          }
          .project-ticket span {
            font-weight: 600;
          }
          .project-ticket .project {
            color: #2c5fc3;
          }
          .project-ticket .ticket {
            color: #38a169;
          }
          .content {
            padding: 16px;
          }
          .track-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .track-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
            color: #4a5568;
          }
          .track-item.last-child {
            border-bottom: none;
          }
          .track-title {
            font-weight: 600;
            color: #2d3748;
          }
          .track-value {
            color: #38a169;
            font-weight: 600;
            margin-left: auto;
          }
          .track-old-value {
            color: #e53e3e;
            text-decoration: line-through;
            margin-right: 6px;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            padding: 12px;
            font-size: 12px;
            color: #718096;
            background: #f0f4f8;
            border-top: 1px solid #e2e8f0;
          }
        </style>
        <div class="container">
          <!-- Header Section -->
          <div class="header">
            <h1>${title}</h1>
          </div>

          <!-- Project & Ticket Section -->
          <div class="project-ticket">
            <span class="project">${projectName}</span> •
            <span class="ticket">${ticketName}</span>
          </div>

          <!-- Content Section -->
          <div class="content">
            <ul class="track-list">
              ${tracks
                .map(({title, oldValue, value}, index) => {
                  if (title === 'comment.note') return '';
                  return `
              <li class="track-item ${index === tracks.length - 1 ? 'last-child' : ''}">
                <span class="track-title">${title}</span>
                <span class="track-value">
                  ${oldValue ? `<span class="track-old-value">${oldValue}</span>&rArr;` : ''}
                  ${value}
                </span>
              </li>
            `;
                })
                .join('')}
            </ul>
          </div>

          <!-- Footer Section -->
          <div class="footer">
            This is an automated message. Please do not reply directly to this
            email.
          </div>
        </div>
      </body>
    </html>
  `.trim();
}

export function getMailRecipients({
  newTicket,
  oldTicket,
  exclude = [],
}: {
  newTicket: UTicket;
  oldTicket?: UTicket;
  exclude?: string[];
}): string[] {
  const reciepients = new Set(
    [
      newTicket.createdByContact?.emailAddress?.address,
      newTicket.managedByContact?.emailAddress?.address,
      oldTicket?.managedByContact?.emailAddress?.address, // send email to old managedByContact
    ].filter(email => email && !exclude.includes(email)),
  ) as Set<string>;
  return Array.from(reciepients);
}
