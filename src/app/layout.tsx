import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/glass.css";
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
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sacramento&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Prevent theme flash before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
