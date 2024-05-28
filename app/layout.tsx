import Script from "next/script";

// ---- CORE IMPORTS ---- //
import { findThemeOptions } from "@/orm/theme";

// ---- LOCAL IMPORTS ---- //
import Theme from "./theme";
import Locale from "./locale";
import AuthContext from "./auth-context";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Customer Portal",
  description: "Next generation portal by Axelor",
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
        <body>
          <AuthContext>
            <Locale>{children}</Locale>
          </AuthContext>
          <Script src="/js/vendors/clamp.min.js" strategy="beforeInteractive" />
        </body>
      </html>
    </Theme>
  );
}
