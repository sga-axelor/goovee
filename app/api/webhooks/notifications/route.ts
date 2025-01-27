import {NextResponse} from 'next/server';

import {manager} from '@/tenant';
import {findPreferences} from '@/orm/notification';
import NotificationManager, {NotificationType} from '@/notification';
import {getTranslation} from '@/locale/server';
import {transformLocale} from '@/locale/utils';
import type {PortalApp} from '@/types';

async function findAppByCode({
  code,
  tenantId,
}: {
  code: string;
  tenantId: string;
}) {
  const client = await manager.getClient(tenantId);

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

function getCredentials(request: Request) {
  const header = request.headers.get('authorization');

  if (!header?.startsWith('Basic ')) return null;

  try {
    const value = header.split(' ')[1];
    const credentials = Buffer.from(value, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (!(username && password)) return null;

    return {username, password};
  } catch (err) {
    return null;
  }
}

function response(data: any, status: number) {
  return NextResponse.json(data, {status});
}

const BATCH_SIZE = 10;

async function processBatch(
  data: any[],
  action: (data: string) => Promise<void>,
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

async function sendMail({
  user,
  tenantId,
  mail,
  app,
}: {
  user: any;
  tenantId: string;
  mail?: {subject?: string; body?: string};
  app: PortalApp;
}) {
  const mailService = NotificationManager.getService(NotificationType.mail);

  mailService?.notify({
    to: user.email,
    subject:
      mail?.subject ||
      (await getTranslation(
        {locale: user.locale, tenant: tenantId},
        '{0} - Notifications from Goovee',
        app.name,
      )),
    content:
      mail?.body ||
      (await getTranslation(
        {locale: user.locale, tenant: tenantId},
        'You have received new notification from Goovee {0}',
        app.name,
      )),
  });
}

async function sendNotifications(data: {
  tenantId: string;
  workspaceUrl: string;
  code: string;
  record: {id: string};
  mail?: {
    subject?: string;
    body?: string;
  };
}) {
  const {tenantId, workspaceUrl, code, record, mail} = data;

  try {
    const client = await manager.getClient(tenantId);

    const users = await client.aOSPartner
      .find({select: {emailAddress: true, localization: true}})
      .then(users =>
        users.map(u => ({
          id: u.id,
          email: u.emailAddress?.address,
          locale: transformLocale(u.localization?.code),
        })),
      );

    const subscribers: any = [];

    const checkSubscription = async (user: any) => {
      const preference = await findPreferences({
        user: user as any,
        tenantId,
        code,
        url: workspaceUrl,
      });

      const isSubscribed =
        preference &&
        preference.activateNotification &&
        preference.subscriptions.find(
          (s: any) => Number(s.id) === Number(record.id),
        )?.activateNotification;

      if (isSubscribed) {
        subscribers.push(user);
      }
    };

    const app: any = await findAppByCode({code, tenantId});

    processBatch(users, checkSubscription).then(() =>
      processBatch(subscribers, user => sendMail({user, tenantId, mail, app})),
    );
  } catch (err) {}
}

const FIVE_MINUTES_MS = 5 * 60 * 1000;

function isValidTimestamp(timestamp: number) {
  const current = Date.now();
  return Number(current) - Number(timestamp) < FIVE_MINUTES_MS;
}

export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload) {
    return response('Payload is required', 400);
  }

  const {tenantId, workspaceUrl, code, record, timestamp} = payload;

  if (!(tenantId && workspaceUrl && code && record?.id && timestamp)) {
    return response(
      'Tenant, workspace code, record and timestamp is required',
      400,
    );
  }

  const validTimestamp = isValidTimestamp(timestamp);

  if (!validTimestamp) {
    return response('Invalid timestamp', 400);
  }

  const credentials = getCredentials(request);

  if (!credentials) {
    return response('Unauthorized', 401);
  }

  const tenant = await manager.getConfig(tenantId);

  if (!tenant) {
    return response('Invalid Tenant', 400);
  }

  if (
    !(
      tenant.aos?.auth?.username === credentials.username &&
      tenant.aos?.auth?.password === credentials.password
    )
  ) {
    return response('Unauthorized', 401);
  }

  sendNotifications(payload);

  return response('Success', 200);
}
