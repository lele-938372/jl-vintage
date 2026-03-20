import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';
import CartProvider from '@/components/CartProvider';
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'JL VINTAGE',
  description: 'Kuratierte Vintage-Kleidung von Leandro & Justin.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <AuthProvider>
          <CartProvider>
            <NavBar />
            <main>{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
