import crypto from 'crypto';
import sanitizeHtml from 'sanitize-html';
import {NextResponse} from 'next/server';

import {manager} from '@/tenant';
import type {Client} from '@/goovee/.generated/client';
import {findPreferences} from '@/orm/notification';
import NotificationManager, {NotificationType} from '@/notification';
import {getTranslation} from '@/locale/server';
import type {App as PortalApp} from '@/orm/workspace';
import {notifyUser} from '@/pwa/utils';
import {NotificationTag} from '@/pwa/tags';

async function findAppByCode({code, client}: {code: string; client: Client}) {
  return client.aOSPortalApp.findOne({
    where: {
      code,
    },
    select: {
      name: true,
      code: true,
    },
  });
}

function isValidSignature(
  body: string,
  signature: string,
  secret: string,
): boolean {
  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
  } catch {
    return false;
  }
}

function response(data: any, status: number) {
  return NextResponse.json(data, {status});
}

const BATCH_SIZE = 10;

async function processBatch(
  data: any[],
  action: (data: any) => Promise<void>,
  batchSize: number = BATCH_SIZE,
): Promise<void> {
  const chunks = chunkArray(data, batchSize);

  for (const chunk of chunks) {
    await Promise.allSettled(chunk.map(data => action(data)));
  }
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function notificationTemplate({user, tenantId, app, entity}: any) {
  return `<!DOCTYPE html>
    <html>
    <head>
        <title>${await getTranslation(
          {locale: user.locale, tenant: tenantId},
          '{0} - Notifications from Goovee',
          app.name,
        )}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f9f9f9;
                margin: 0;
                padding: 20px;
            }
            .container {
                text-align: center;
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                margin-bottom: 20px;
            }
            .link {
                display: inline-block;
                color: #58d59d !important;
                text-decoration: none;
                font-size: 16px;
            }
            .footer {
                font-size: 14px;
                color: #666666;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${await getTranslation(
                  {locale: user.locale, tenant: tenantId},
                  `You have received new notification from Goovee {0}`,
                  app.name,
                )}
                </h1>
            </div>
            <a href="${entity?.route}" target="_blank" class="link">
              ${entity?.route}
            </a>
            <div class="footer">
                <p>Best regards,<br>The Goovee Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

async function sendMail({
  user,
  tenantId,
  mail,
  app,
  entity,
}: {
  user: any;
  tenantId: string;
  mail?: {subject?: string; body?: string};
  entity: {id: string; version: number; route: string};
  app: PortalApp;
}) {
  const mailService = NotificationManager.getService(NotificationType.mail);

  const html =
    mail?.body || (await notificationTemplate({user, tenantId, app, entity}));

  mailService?.notify({
    to: user.email,
    subject:
      mail?.subject ||
      (await getTranslation(
        {locale: user.locale, tenant: tenantId},
        '{0} - Notifications from Goovee',
        app.name || '',
      )),
    html: sanitizeHtml(html),
  });
}

async function sendSystemNotification({
  user,
  tenantId,
  mail,
  app,
  entity,
  workspace,
  client,
}: {
  user: any;
  tenantId: string;
  mail?: {subject?: string; body?: string};
  entity: {id: string; version: number; route: string};
  app: PortalApp;
  workspace: {
    id: string;
    name: string;
    url: string;
  };
  client: any;
}) {
  notifyUser({
    userId: user.id,
    tenantId,
    workspaceURL: workspace.url,
    client,
    payload: {
      title:
        mail?.subject ||
        (await getTranslation(
          {locale: user.locale, tenant: tenantId},
          '{0} - Notifications from Goovee',
          app.name || '',
        )),
      url: entity.route,
      tag: app.name
        ? NotificationTag.system(app.name, workspace.id)
        : undefined,
    },
  });
}

async function sendNotifications(data: {
  tenantId: string;
  workspace: {
    id: string;
    name: string;
    url: string;
  };
  code: string;
  record: {id: string};
  mail?: {
    subject?: string;
    body?: string;
  };
  client: Client;
}) {
  const {tenantId, workspace, code, record, mail, client} = data;

  try {
    const users = await client.aOSPartner
      .find({
        select: {
          id: true,
          emailAddress: {address: true},
          localization: {code: true},
        },
      })
      .then(users =>
        users.map(u => ({
          id: u.id,
          email: u.emailAddress?.address,
          locale: u.localization?.code,
        })),
      );

    const subscribers: any = [];

    const checkSubscription = async (user: any) => {
      const preference = await findPreferences({
        user: user as any,
        client,
        code,
        url: workspace.url,
      });

      if (!preference?.activateNotification) return;

      const entity = preference.subscriptions.find(
        (s: any) => Number(s.id) === Number(record.id),
      );

      const isSubscribed = entity?.activateNotification;

      if (isSubscribed) {
        subscribers.push({user, entity});
      }
    };

    const app: any = await findAppByCode({code, client});

    processBatch(users, checkSubscription).then(() =>
      processBatch(
        subscribers,
        async ({user, entity}: {user: any; entity: any}) => {
          sendMail({user, tenantId, mail, entity, app});
          sendSystemNotification({
            user,
            tenantId,
            mail,
            entity,
            app,
            workspace,
            client,
          });
        },
      ),
    );
  } catch (err) {}
}

const FIVE_MINUTES_MS = 5 * 60 * 1000;

function isValidTimestamp(timestamp: number) {
  const current = Date.now();
  const ts = Number(timestamp);
  return ts <= current && current - ts < FIVE_MINUTES_MS;
}

export async function POST(request: Request) {
  const body = await request.text();

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return response('Payload is required', 400);
  }

  const {tenantId, workspaceUrl, code, record, timestamp} = payload;

  if (!(tenantId && workspaceUrl && code && record?.id && timestamp)) {
    return response(
      'Tenant, workspace code, record and timestamp is required',
      400,
    );
  }

  if (!isValidTimestamp(timestamp)) {
    return response('Invalid timestamp', 400);
  }

  const signature = request.headers.get('x-signature');

  if (!signature) {
    return response('Unauthorized', 401);
  }

  const tenant = await manager.getTenant(tenantId);
  if (!tenant) {
    return response('Unauthorized', 401);
  }
  const {client} = tenant;

  const secret = tenant.config.aos.webhookSecret;

  if (!secret || !isValidSignature(body, signature, secret)) {
    return response('Unauthorized', 401);
  }

  const workspace = await client.aOSPortalWorkspace.findOne({
    where: {url: workspaceUrl},
    select: {id: true, name: true, url: true},
  });

  if (!workspace) {
    return response('Invalid Workspace', 401);
  }

  sendNotifications({...payload, workspace, client});

  return response('Success', 200);
}
