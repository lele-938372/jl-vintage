import { Suspense } from 'react';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#8B6914] border-t-transparent rounded-full animate-spin" /></div>}>
      {children}
    </Suspense>
  );
}
