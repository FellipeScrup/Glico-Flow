import localFont from "next/font/local";
import "./globals.css";
import { Metadata } from 'next'
import { ThemeProvider } from '@/contexts/ThemeContext';
import './sw-register';

export const metadata = {
  title: 'GlicoFlow',
  description: 'Controle sua diabetes',
  manifest: '/manifest.json',
  themeColor: '#4361EE',
  appleWebApp: {
    capable: 'yes',
    statusBarStyle: 'default',
    title: 'GlicoFlow'
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="application-name" content="GlicoFlow" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#4361EE" />
        <meta name="msapplication-TileColor" content="#4361EE" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png" />
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
