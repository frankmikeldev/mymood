import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import PublicHeader from "@/components/layout/PublicHeader";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyMood | Track Your Mind, Mood & Mental Health",
  description:
    "MyMood helps you track your emotions and discover personalized wellness tips.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MyMood",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <meta name="theme-color" content="#F5F0E8" />
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MyMood" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
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
      <body className="font-sans antialiased transition-colors duration-300">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-body)]">
            <PublicHeader />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <footer
              className="py-10 text-center text-sm"
              style={{
                backgroundColor: "#EEF2E6",
                borderTop: "1px solid #E2DDD6",
              }}
            >
              <p
                style={{
                  color: "#555555",
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                }}
              >
                © {new Date().getFullYear()} MyMood. All rights reserved.
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}