import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/discover');
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 scroll-m-0">
        <Image
          src="/landing-bg.png"
          alt="Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
          Find Your Next <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            Favorite Movie
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl font-light drop-shadow-md">
          Swipe through endless possibilities and create your perfect watchlist today.
        </p>

        <Link
          href="/signup"
          className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            Create Account
          </span>
        </Link>
      </div>
    </div>
  );
}
