import { Suspense } from 'react';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategorySection from '@/components/home/CategorySection';
import NewArrivals from '@/components/home/NewArrivals';
import StudioGrid from '@/components/home/StudioGrid';
import About from '@/components/home/About';
import WhatsAppFAB from '@/components/WhatsAppFAB';

export const revalidate = 60; // Revalidate home page every 60 seconds

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <CategorySection />
      <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading latest arrivals...</div>}>
        <NewArrivals />
      </Suspense>
      <StudioGrid />
      <About />
      <WhatsAppFAB />
    </>
  );
}
