import { Atmosphere } from "@/components/layout/Atmosphere";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return (
    <>
      <Atmosphere />
      <div className="app">
        <Header />
        <main>
          <Hero />
          <Experience />
          <Footer />
        </main>
      </div>
    </>
  );
}
