import {NextResponse} from 'next/server';
import goovee from '@/package.json';
import {manager} from '@/tenant';

export function GET() {
  return NextResponse.json({
    name: 'Goovee',
    version: goovee?.version,
    date: new Date().toISOString(),
    tenancy: manager.getType(),
  });
}
