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
            margin-left: 0.5rem;
            margin-right: 0.5rem;
          }

          .-ml-9 {
            margin-left: -2.25rem;
          }

          .mb-1 {
            margin-bottom: 0.25rem;
          }

          .ml-2 {
            margin-left: 0.5rem;
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

          .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .text-xs {
            font-size: 0.75rem;
            line-height: 1rem;
          }

          .font-semibold {
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="px-4 text-xs mb-1">
          ${title
            ? html`<div class="font-semibold mb-1 -ml-9">${title}</div>`
            : ''}
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
                          ? html`${oldValue}
                              <svg
                                class="mx-2"
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 24 24"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path
                                  d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"></path>
                              </svg>
                              ${value}`
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
