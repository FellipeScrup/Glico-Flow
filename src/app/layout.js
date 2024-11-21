import localFont from "next/font/local";
import "./globals.css";
import { Metadata } from 'next'
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata = {
  title: "GlicoFlow",
  description: "Controle sua diabetes",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GlicoFlow",
    startupImage: [
      {
        url: "/splash/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
      }
    ]
  },
  formatDetection: {
    telephone: false
  }
};

export const themeColor = "#4361EE";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="GlicoFlow" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GlicoFlow" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#4361EE" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#4361EE" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/glicoflow-logo-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/glicoflow-logo.png" />
        
        {/* Splash Screens para iOS */}
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-2048-2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
