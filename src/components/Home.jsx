import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import Threads from "../Threads";
import About from "./About";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const scrollRef = useRef(null);

  const [opacities, setOpacities] = useState({
    heading: 1,
    paragraph: 1,
    scroll: 1,
  });

  useEffect(() => {
    const handleScroll = () => {
      const navbarHeight = 80; // adjust if navbar height changes
      const fadeDistance = 300;

      const calcOpacity = (element) => {
        const rect = element.getBoundingClientRect();
        const distanceFromNavbar = rect.top - navbarHeight;
        return Math.max(0, Math.min(1, distanceFromNavbar / fadeDistance));
      };

      setOpacities({
        heading: calcOpacity(headingRef.current),
        paragraph: calcOpacity(paragraphRef.current),
        scroll: calcOpacity(scrollRef.current),
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // trigger on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-[#0a0a0a]"></div>
      <div className="fixed inset-0 z-0">
        <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-12 sm:top-8 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-6xl flex items-center justify-between px-4 sm:px-6 py-3 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/10 z-50 text-white">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
          ElevateTech
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4 md:space-x-8">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <li
              key={item}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm sm:text-base"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <ul className="absolute top-full left-0 w-full mt-3 flex flex-col bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 space-y-3 md:hidden text-sm sm:text-base">
            {["Home", "About", "Services", "Contact"].map((item) => (
              <li
                key={item}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer text-center py-2"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col justify-center items-center h-screen text-center text-white px-4 sm:px-6 pt-32 sm:pt-36">
        <h1
          ref={headingRef}
          style={{ opacity: opacities.heading, transition: "opacity 0.3s" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
        >
          Welcome to <span className="text-cyan-400">Elevate Tech</span>
        </h1>

        <p
          ref={paragraphRef}
          style={{ opacity: opacities.paragraph, transition: "opacity 0.3s" }}
          className="text-base sm:text-lg md:text-xl text-gray-100 max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
        >
          Building elegant digital experiences through innovation and design.
        </p>

        <div
          ref={scrollRef}
          style={{ opacity: opacities.scroll, transition: "opacity 0.3s" }}
          className="absolute bottom-8 sm:bottom-10 flex flex-col items-center animate-bounce"
        >
          <div className="w-5 sm:w-6 h-5 sm:h-6 border-b-2 border-r-2 border-white transform rotate-45 mb-2"></div>
          <span className="text-gray-300 text-xs sm:text-sm">Scroll Down</span>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 px-4 sm:px-6">
        <About />
      </section>
    </div>
  );
};

export default Home;
