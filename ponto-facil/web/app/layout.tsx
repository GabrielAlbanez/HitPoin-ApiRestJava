"useclient";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { JetBrains_Mono } from "next/font/google";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";


const jetBrains = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />

      <body
        className={clsx(
          "min-h-screen bg-background antialiased",
          jetBrains.className
        )}
      >
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-7xl px-6 flex-grow">
                {children}
              </main>
              <footer className="w-full flex items-center justify-center py-3">
                <span className="text-default-600">Developed by</span>
                <Link
                  isExternal
                  className="flex items-center  m-1 text-current"
                  href="https://github.com/caiobga99"
                  title="nextui.org homepage"
                >
                  <p className="text-primary">CAIO</p>
                </Link>{" "}
                <Link
                  isExternal
                  className="flex items-center  m-1 text-current"
                  href="https://github.com/GabrielAlbanez"
                  title="nextui.org homepage"
                >
                  <p className="text-primary">GABRIEL</p>
                </Link>{" "}
                <Link
                  isExternal
                  className="flex items-center  m-1 text-current"
                  href="https://github.com/caiobga99"
                  title="nextui.org homepage"
                >
                  <p className="text-primary">FERNANDO</p>
                </Link>{" "}
                <Link
                  isExternal
                  className="flex items-center  m-1 text-current"
                  href="https://github.com/caiobga99"
                  title="nextui.org homepage"
                >
                  <p className="text-primary">KAIQUE</p>
                </Link>
              </footer>
            </div>
          </Providers>
      </body>
    </html>
  );
}
