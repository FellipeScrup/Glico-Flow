import localFont from "next/font/local";
import "./globals.css";
import { Metadata } from 'next'
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata = {
  title: 'GlicoFlow',
  description: 'Controle sua diabetes',
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: 'no',
    viewportFit: 'cover',
    height: 'device-height'
  },
  appleWebApp: {
    capable: 'yes',
    statusBarStyle: 'default',
    title: 'GlicoFlow'
  }
};

export const themeColor = "#4361EE";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  minimumScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#4361EE" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  );
}
