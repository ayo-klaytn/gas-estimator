// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Kaia Gas Simulator</title>
        <meta name="description" content="Real-time gas estimation for Kaia blockchain transactions" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}