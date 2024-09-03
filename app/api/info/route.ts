import {NextResponse} from 'next/server';
import goovee from '@/package.json';

export function GET() {
  return NextResponse.json({
    name: 'Goovee',
    version: goovee?.version,
    date: new Date().toISOString(),
  });
}
