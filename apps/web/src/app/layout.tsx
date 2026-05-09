import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/layout/Header';

export const metadata: Metadata = {
  title: 'Korea Car Import | Premium Auto Exports to Central Asia',
  description: 'Import premium cars from South Korea to Uzbekistan, Kazakhstan, Russia, and UAE. Direct access to dealer auctions, transparent pricing, and seamless shipping.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
