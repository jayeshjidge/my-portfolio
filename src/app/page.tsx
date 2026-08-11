import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return (
    <>
      <div className="paper-bg" aria-hidden="true" />
      <div className="paper-marks" aria-hidden="true">
        <span className="m-tl" />
        <span className="m-tr" />
        <span className="m-bl" />
        <span className="m-br" />
      </div>
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
