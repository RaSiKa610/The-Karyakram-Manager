import './globals.css';
import type { Metadata } from 'next';
import FallingClovers from '@/components/FallingClovers';
import Navbar from '@/components/Navbar';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'The Karyakram Manager',
  description: 'Intelligent event & venue management platform for large-scale sporting events.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <FallingClovers />
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1, paddingTop: '80px' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
