import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import MainLayout from '@/components/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Movie Matchmaker',
  description: 'Find your next favorite movie.',
};

import { createClient } from '@/utils/supabase/server';

// ... imports

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar user={user} />
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
