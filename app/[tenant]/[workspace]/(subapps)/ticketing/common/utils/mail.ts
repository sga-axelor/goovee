import type {Track} from '@/lib/core/comments';
import NotificationManager, {NotificationType} from '@/notification';
import {html} from '@/utils/template-string';

import type {UTicket} from '../orm/tickets';

type MailProps = {
  subject: string;
  body: {title?: string; tracks: Track[]};
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

  return mailService.notify({subject, to, html});
}

function generateTrackHTML(body: MailProps['body']) {
  const {title, tracks} = body;

  return html`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title || ''}</title>
        <style>
          .mx-2 {
            margin-left: 8px;
            margin-right: 8px;
          }
          .mx-1 {
            margin-left: 4px;
            margin-right: 4px;
          }
          .mb-1 {
            margin-bottom: 4px;
          }
          .ml-2 {
            margin-left: 8px;
          }
          .px-4 {
            padding-left: 16px;
            padding-right: 16px;
          }
          .flex {
            display: flex;
          }
          .flex-shrink-0 {
            flex-shrink: 0;
          }
          .list-disc {
            list-style-type: disc;
          }
          .items-center {
            align-items: center;
          }
          .text-xs {
            font-size: 12px;
            line-height: 16px;
          }
          .font-semibold {
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="px-4 text-xs mb-1">
          ${title ? html`<div class="font-semibold mb-1">${title}</div>` : ''}
          <ul class="list-disc">
            ${tracks
              .map(({title, oldValue, value}) => {
                if (title === 'comment.note') return '';
                return html`
                  <li class="mb-1">
                    <div class="flex items-center">
                      <span class="font-semibold flex-shrink-0">${title}:</span>
                      <span class="flex items-center ml-2">
                        ${oldValue
                          ? html`<span>${oldValue}</span>
                              <span class="mx-1">&rArr;</span>
                              <span>${value}</span>`
                          : value}
                      </span>
                    </div>
                  </li>
                `;
              })
              .join('')}
          </ul>
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
