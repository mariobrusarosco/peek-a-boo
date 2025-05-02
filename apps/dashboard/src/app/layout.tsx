import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/domains/ui-system/globals.css";
import "@/domains/ui-system/components/custom-styles.css";
import { ThemeProvider } from "@/domains/ui-system/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Peek-a-boo - Feature Flag Platform",
  description: "Manage feature flags with confidence. Control, test, and deploy features seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
