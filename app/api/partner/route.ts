import {manager} from '@/tenant';
import {NextResponse} from 'next/server';

export async function GET() {
  const client = await manager.getClient('d');

  const count = await client.aOSPartner.count({
    where: {
      isContact: true,
      mainPartner: {
        id: 1,
      },
      contactWorkspaceConfigSet: {
        isAdmin: true,
        portalWorkspace: {
          url: 'http://localhost:3001/d/france',
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json({
    count,
  });
}
