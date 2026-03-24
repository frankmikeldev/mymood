import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PublicHeader from "@/components/layout/PublicHeader";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyMood | Track Your Mind, Mood & Mental Health",
  description:
    "MyMood helps you track your emotions and discover personalized wellness tips.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MyMood",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Theme */}
        <meta name="theme-color" content="#0b0d12" />

        {/* Favicon */}
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />

        {/* Apple PWA */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MyMood" />

        {/* Android PWA */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        {/* Service Worker */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased transition-colors duration-300`}
      >
        <ThemeProvider>
          <div className="flex flex-col min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-body)]">

            {/* Public Navbar */}
            <PublicHeader />

            {/* Main Content */}
            <main className="flex-grow pt-20">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--color-border)] py-10 text-center text-sm bg-[var(--color-bg-card)]">
              <p className="text-[var(--color-text-body)] opacity-50">
                © {new Date().getFullYear()} MyMood. All rights reserved.
              </p>
            </footer>

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}