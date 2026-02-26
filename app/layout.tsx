import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyMood | Track Your Mind, Mood & Mental Health",
  description:
    "MyMood helps you track your emotions, manage anxiety, depression, and stress, and discover personalized wellness tips for a calmer, balanced mind every day.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased transition-colors duration-300`}
      >
        <ThemeProvider>
          <div className="flex flex-col min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-body)]">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <footer className="border-t border-[var(--color-border)] py-10 text-center text-sm text-[var(--color-text-body)] bg-[var(--color-bg-card)]">
              <div className="space-y-3">
                <div className="flex flex-wrap justify-center gap-4 font-medium text-[var(--color-text-header)]">
                  <a
                    href="/terms"
                    className="hover:text-[var(--color-accent)] transition-colors"
                  >
                    Terms of Service
                  </a>
                  <span>|</span>
                  <a
                    href="/privacy"
                    className="hover:text-[var(--color-accent)] transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <span>|</span>
                  <a
                    href="/credits"
                    className="hover:text-[var(--color-accent)] transition-colors"
                  >
                    Credits
                  </a>
                </div>

                <p className="opacity-80">
                  Copyright © {new Date().getFullYear()} Mood Tracker Web Media,
                  LLC
                </p>
                <p className="uppercase tracking-wide font-semibold text-xs opacity-70">
                  ALL RIGHTS RESERVED.
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
