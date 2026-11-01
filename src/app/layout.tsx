import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#ea580c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'BazaarHub - Pakistan Everyday Lifestyle Bazaar & Mall',
    template: '%s | BazaarHub Pakistan',
  },
  description:
    'Affordable everyday lifestyle shopping in Pakistan. Men & Women fashion, streetwear, kitchen appliances, fast chargers, earbuds, and organic beauty products with express delivery across Karachi, Lahore, Islamabad and nationwide.',
  keywords: [
    'Pakistan online shopping',
    'BazaarHub',
    'online bazaar Pakistan',
    'streetwear Pakistan',
    'men kurtas online',
    'lawn suits Pakistan',
    'wireless earbuds Karachi',
    'kitchen accessories Lahore',
    'cash on delivery Pakistan',
    'easypaisa jazzcash online shopping',
  ],
  authors: [{ name: 'BazaarHub Team' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: '/',
    siteName: 'BazaarHub Pakistan',
    title: 'BazaarHub - Your Everyday Bazaar, Online',
    description:
      'Explore affordable everyday lifestyle products across Pakistan with manual bank & wallet payment verification and swift nationwide delivery.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'BazaarHub Online Store Pakistan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BazaarHub - Your Everyday Bazaar, Online',
    description: 'Affordable everyday lifestyle shopping in Pakistan.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${plusJakartaSans.variable}`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 font-sans antialiased selection:bg-orange-100 selection:text-orange-950">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <BottomNav />
          <WhatsAppButton />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
