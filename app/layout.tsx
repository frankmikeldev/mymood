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
  manifest: "/manifest.json",
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
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MyMood" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
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
              <p>© {new Date().getFullYear()} MyMood. All rights reserved.</p>
            </footer>

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}