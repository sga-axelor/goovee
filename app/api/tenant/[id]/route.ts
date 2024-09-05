import {NextRequest, NextResponse} from 'next/server';
import {Tenant} from '@/types';
import {DEFAULT_TENANT} from '@/constants';

const CHECK_AUTH = false;

/**
 * Todo
 * GET configuration from tenant manager application
 */

const tenants: {[key: string]: Tenant} = [DEFAULT_TENANT].reduce(
  (tenants, id) => ({
    ...tenants,
    [id]: {
      id,
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }),
  {},
);

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {id: string};
  },
) {
  const authHeader = req.headers.get('authorization');

  if (CHECK_AUTH && (!authHeader || !isValidAuthHeader(authHeader))) {
    const response = new NextResponse(
      JSON.stringify({message: 'Unauthorized'}),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      },
    );
    return response;
  }

  const {id} = params;

  const tenant = tenants[id];

  return NextResponse.json(tenant);
}

function isValidAuthHeader(authHeader: string): boolean {
  const [scheme, encodedCredentials] = authHeader.split(' ');

  if (scheme !== 'Basic') {
    return false;
  }

  const credentials = Buffer.from(encodedCredentials, 'base64').toString();
  const [username, password] = credentials.split(':');

  return (
    username === process.env.BASIC_AUTH_USER &&
    password === process.env.BASIC_AUTH_PASS
  );
}
