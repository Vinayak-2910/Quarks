import Hero from "@/sections/Hero";
import Manifesto from "@/sections/Manifesto";
import Forces from "@/sections/Forces";
import Collisions from "@/sections/Collisions";
import AboutUs from "@/sections/AboutUs";
import Scale from "@/sections/Scale";
import Proof from "@/sections/Proof";
import About from "@/sections/About";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <main className="select-none">
      <Hero />
      <Manifesto />
      <Forces />
      <Collisions />
      <AboutUs />
      <Scale />
      <Proof />
      <About />
      <Contact />
    </main>
  );
}
