import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/glass.css";
import "@/styles/paper.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jayesh Jidge — Software Development Engineer",
  description:
    "Jayesh Jidge — Software Development Engineer. A glassmorphism portfolio.",
  openGraph: {
    title: "Jayesh Jidge — Software Development Engineer",
    description: "Building scalable web experiences that feel effortless.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sacramento&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
