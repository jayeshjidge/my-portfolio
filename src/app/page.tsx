import { Atmosphere } from "@/components/layout/Atmosphere";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { WorkSection } from "@/components/sections/WorkSection";

export default function HomePage() {
  return (
    <>
      <Atmosphere />
      <div className="app">
        <Header />
        <main>
          <Hero />
          <WorkSection />
          <Footer />
        </main>
      </div>
    </>
  );
}
