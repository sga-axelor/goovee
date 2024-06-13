'use client';
import Link from 'next/link';
import { Button } from "@ui/components/button";

export default function NotFound() {
  return (
    <div
      style={{ height: '100vh' }}
      className="flex items-center justify-center">
      <div>
        <h2 className="text-3xl">404 | Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">
          <Button className="rounded-full">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}