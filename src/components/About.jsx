// About.jsx
import React, { useState } from "react";
import CardSwap, { Card } from "../Cardswap";

const cardsData = [
  {
    title: "Our Vision",
    content:
      "We aim to build elegant and scalable digital solutions that transform businesses and empower users worldwide.",
  },
  {
    title: "Our Mission",
    content:
      "Deliver cutting-edge technology, seamless user experiences, and foster innovation in every project we undertake.",
  },
  {
    title: "Our Values",
    content:
      "Creativity, integrity, collaboration, and excellence are at the core of everything we do.",
  },
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
        <span className="text-cyan-400">Our Team</span>
      </h1>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="bg-[#0a0a0a]/50 p-8 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-500">
            <h2 className="text-3xl font-semibold mb-4 text-cyan-400">
              {cardsData[activeIndex].title}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {cardsData[activeIndex].content}
            </p>
          </div>
        </div>

        {/* Right Card Swap */}
        <div className="flex-1 relative w-full max-w-md h-[400px]">
          <CardSwap
            width={300}
            height={400}
            cardDistance={60}
            verticalDistance={70}
            skewAmount={6}
            delay={4000}
            onCardClick={(i) => setActiveIndex(i)}
            onCardSwap={(i) => setActiveIndex(i)}
          >
            {cardsData.map((card, i) => (
              <Card
                key={i}
                style={{
                  background: "#0a0a0a/80",
                  border: "1px solid #fff",
                  willChange: "transform, opacity",
                  transform: "translateZ(0)",
                }}
              >
                <div className="flex flex-col justify-center items-center h-full p-6">
                  <h3 className="text-xl font-bold mb-2 text-cyan-400">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-300 text-center">{card.content}</p>
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </div>
  );
};

export default About;
