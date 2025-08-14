import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import EXOBackground from "@/components/EXOBackground";
import NeonRibbon from "@/components/NeonRibbon";
import Gallery from "@/components/Gallery";
import VideoSection from "@/components/VideoSection";

const Index = () => {
  // 3D animation logic for the button and card (remains the same)
  const scrollButtonRef = useRef<HTMLAnchorElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const scrollMouseX = useMotionValue(0);
  const scrollMouseY = useMotionValue(0);
  const cardMouseX = useMotionValue(0);
  const cardMouseY = useMotionValue(0);

  const handleScrollMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent<HTMLAnchorElement>) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    scrollMouseX.set(clientX - left - width / 2);
    scrollMouseY.set(clientY - top - height / 2);
  };
  const handleScrollMouseLeave = () => {
    scrollMouseX.set(0);
    scrollMouseY.set(0);
  };

  const handleCardMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    cardMouseX.set(clientX - left - width / 2);
    cardMouseY.set(clientY - top - height / 2);
  };
  const handleCardMouseLeave = () => {
    cardMouseX.set(0);
    cardMouseY.set(0);
  };

  const springConfig = { stiffness: 150, damping: 20, mass: 0.8 };
  const scrollRotateX = useSpring(useTransform(scrollMouseY, [-20, 20], [-8, 8]), springConfig);
  const scrollRotateY = useSpring(useTransform(scrollMouseX, [-50, 50], [8, -8]), springConfig);
  const cardRotateX = useSpring(useTransform(cardMouseY, [-200, 200], [-8, 8]), springConfig);
  const cardRotateY = useSpring(useTransform(cardMouseX, [-350, 350], [8, -8]), springConfig);

  return (
    <main>
      <EXOBackground />
      {/* --- RESTRUCTURED HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Main Content Wrapper */}
        <div className="container relative z-10 mx-auto px-4 text-center flex-grow flex flex-col items-center justify-center">
          <motion.h1
            // Increased font size and added a text shadow for "pop"
            className="font-display text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight [text-shadow:0_4px_24px_hsl(var(--brand-purple)/0.4)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Happy Birthday Neha Didi ❤️
          </motion.h1>
          <motion.p
            // Added a subtle text shadow here too
            className="mt-4 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto [text-shadow:0_2px_8px_hsl(var(--brand-purple)/0.2)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Neha, you’re my heartbeat and my hero—always my strength, and remember, just like you’ve never let me stand alone, I’ll never let you face this world alone.
          </motion.p>
          
          {/* Button is now wrapped in a simple div for spacing */}
          <div className="mt-12" style={{ perspective: "800px" }}>
             <motion.a
                ref={scrollButtonRef}
                onMouseMove={handleScrollMouseMove}
                onMouseLeave={handleScrollMouseLeave}
                href="#photos"
                style={{ rotateX: scrollRotateX, rotateY: scrollRotateY, transformStyle: "preserve-3d" }}
                className="inline-block rounded-full px-8 py-4 bg-hero text-foreground font-semibold neon-border"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.4, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5, transition: { type: "spring", stiffness: 300 } }}
            >
              Scroll to explore
            </motion.a>
          </div>
        </div>
        
        {/* NeonRibbon is now at the bottom, acting as a footer for the hero section */}
        <div className="relative z-0 w-full mt-auto">
            <NeonRibbon />
        </div>
      </section>

      {/* The rest of your page remains the same */}
      <Gallery />
      <VideoSection />

      <section className="container mx-auto py-16 sm:py-24" style={{ perspective: "1200px" }}>
        <motion.div
          ref={heroCardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{ 
            rotateX: cardRotateX, 
            rotateY: cardRotateY, 
            transformStyle: "preserve-3d",
          }}
          className="glow-card rounded-2xl p-8 sm:p-12 text-center"
          whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
        >
          <h2 style={{ transform: "translateZ(40px)" }} className="font-display text-3xl sm:text-4xl font-extrabold">
            Always My Hero
          </h2>
          <p style={{ transform: "translateZ(30px)" }} className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Thank you for the love, guidance, and endless cheer. May our bond keep shining—purple, pink, and neon bright.
          </p>
        </motion.div>
      </section>
    </main>
  );
};

export default Index;