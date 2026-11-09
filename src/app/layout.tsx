import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeQuest — Apprendre à coder",
  description:
    "Plateforme interactive et gamifiée pour apprendre à coder : JavaScript, HTML/CSS, défis, badges et tuteur IA.",
  authors: [{ name: "LEGAGNEUR DÉVELOPPEMENT" }],
  keywords: ["code", "apprendre", "javascript", "html", "css", "programmation", "CodeQuest"],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "CodeQuest — Apprendre à coder",
    description: "Plateforme gamifiée : JavaScript, HTML/CSS, défis, badges. 100% gratuit.",
    type: "website",
    locale: "fr_FR",
    siteName: "CodeQuest",
  },
  twitter: {
    card: "summary",
    title: "CodeQuest — Apprendre à coder",
    description: "Apprends à coder en t'amusant : 9 leçons, XP, badges.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen codequest-bg">
        {children}
      </body>
    </html>
  );
}
