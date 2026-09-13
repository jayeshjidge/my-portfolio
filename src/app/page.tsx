import Header from "@/components/sections/Layout/Header";
import Footer from "@/components/sections/Layout/Footer";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero/Hero";
import Lab from "@/components/sections/Lab";
import Contact from "@/components/sections/Contact";
import Whiteboard from "@/components/sections/Whiteboard/Whiteboard";

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
          <Lab />
          <Contact />
          {/* <Whiteboard /> */}
          {/* <Footer /> */}
        </main>
      </div>
    </>
  );
}
