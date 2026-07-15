import HeroCarousel from "@/components/home/HeroCarousel";
import NewArrivals from "@/components/home/NewArrivals";
import CategorySection from "@/components/home/CategorySection";
import StudioGrid from "@/components/home/StudioGrid";
import About from "@/components/home/About";

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <NewArrivals />
      <CategorySection />
      <StudioGrid />
      <About />
    </main>
  );
}
