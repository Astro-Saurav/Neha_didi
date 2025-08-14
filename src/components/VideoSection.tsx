import { useState } from "react";
import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "framer-motion";

const videos = [
  "https://www.youtube.com/watch?v=Lo2qQmj0_h4", // EXO - Love Shot
  "https://www.youtube.com/watch?v=KSH-FVVtTf0", // EXO - Monster
  "https://www.youtube.com/watch?v=I3dezFzsNss", // EXO - Growl
  "https://www.youtube.com/watch?v=yWfsla_Uh80", // EXO - Call Me Baby
  "https://www.youtube.com/watch?v=TI0DGvqKZTI", // EXO - Overdose
  "https://www.youtube.com/watch?v=IdssuxDdqKk", // EXO - Ko Ko Bop
  "https://www.youtube.com/watch?v=iwd8N6K-sLk", // EXO - Tempo
  "https://www.youtube.com/watch?v=pSudEWBAYRE"  // EXO - Cream Soda
];

const VideoCard = ({ url, index = 0, onOpen }: { url: string; index?: number; onOpen: (url: string) => void }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl neon-border glass"
      whileHover={{ scale: 1.03, y: -4 }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 220, damping: 22, delay: (index % 6) * 0.06 }}
    >
      <div className="relative aspect-video">
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          muted
          volume={0}
          loop
          controls={false}
          config={{ youtube: { playerVars: { playsinline: 1, modestbranding: 1, rel: 0, controls: 0 } } }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
      </div>
      <button
        className="absolute inset-0"
        onMouseEnter={() => setPlaying(true)}
        onMouseLeave={() => setPlaying(false)}
        onClick={() => onOpen(url)}
        aria-label="Open video"
      />
    </motion.div>
  );
};

const VideoSection = () => {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section id="videos" className="container mx-auto py-16 sm:py-24">
      <header className="mb-8 sm:mb-12 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          Cinematic Moments
        </motion.h2>
        <motion.p
          className="mt-2 text-muted-foreground"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          
        </motion.p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((v, i) => (
          <VideoCard key={v} url={v} index={i} onOpen={setActive} />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.div className="absolute inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
              <motion.div
                className="relative w-full max-w-5xl neon-border glass rounded-2xl overflow-hidden"
                initial={{ scale: 0.96, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                style={{ boxShadow: "0 0 50px hsl(var(--brand-purple)/0.35)" }}
              >
                <div className="relative aspect-video">
                  <ReactPlayer url={active} width="100%" height="100%" playing controls />
                  <button className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-md bg-hero text-foreground neon-border hover-scale" onClick={() => setActive(null)} aria-label="Close video">
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoSection;
