import {Poppins as FontSans} from 'next/font/google';
import type {Metadata} from 'next';

// ---- CORE IMPORTS ---- //
import {findThemeOptions} from '@/orm/theme';

// ---- LOCAL IMPORTS ---- //
import Theme from './theme';
import Locale from './locale';
import AuthContext from './auth-context';
import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Goovee',
    default: 'Portal | Goovee',
  },
  description: 'Next generation portal by Axelor',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeOptions = await findThemeOptions();

  return (
    <Theme options={themeOptions}>
      <html lang="en">
        <body className={fontSans.className}>
          <AuthContext>
            <Locale>{children}</Locale>
          </AuthContext>
        </body>
      </html>
    </Theme>
  );
}
