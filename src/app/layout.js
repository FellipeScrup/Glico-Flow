import localFont from "next/font/local";
import "./globals.css";
import { Metadata } from 'next'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "GlicoFlow",
  description: "Controle sua diabetes",
  manifest: "/manifest.json",
  themeColor: "#4361EE",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GlicoFlow",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="GlicoFlow" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GlicoFlow" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#4361EE" />

        {/* Ícone para iOS e Android */}
        <link rel="apple-touch-icon" href="/glicoflow-logo.png" />
        <link rel="icon" type="image/png" href="/glicoflow-logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
