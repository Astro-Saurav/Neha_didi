import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Play, PictureInPicture } from "lucide-react"; // Using lucide-react for icons

const MediaItem = ({ media, index, onClick }) => {
  const ref = useRef(null);
  const videoRef = useRef(null);

  // 3D Tilt Effect Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) / 25;
    const y = (clientY - top - height / 2) / 25;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springConfig = { stiffness: 350, damping: 25, mass: 0.7 };
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [-7, 7]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [7, -7]), springConfig);

  // Picture-in-Picture Logic
  const handlePip = async (e) => {
    e.stopPropagation(); // Prevent Lightbox from opening
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    }
    try {
      if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error("PiP request failed:", error);
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: "800px",
      }}
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: (index % 10) * 0.03 }}
    >
      <motion.button
        key={media.src}
        className="group relative aspect-square w-full overflow-hidden rounded-lg neon-border"
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transform: "translateZ(30px)", // Lifts the card slightly for a better 3D effect
        }}
        whileHover={{
            y: -4,
            transition: { duration: 0.5, ...springConfig }
        }}
      >
        {media.type === 'image' ? (
          <img
            src={media.src}
            alt={media.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { (e.currentTarget).src = "/placeholder.svg"; }}
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={media.src}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            >
              
            </video>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Play className="text-white h-12 w-12" />
            </div>
            <button
                onClick={handlePip}
                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/80 transition-all z-10 opacity-0 group-hover:opacity-100"
                aria-label="Play in Picture-in-Picture"
                title="Play in Picture-in-Picture"
            >
                <PictureInPicture size={18} />
            </button>
          </>
        )}
        <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: "inset 0 0 60px hsl(var(--brand-purple)/.3)" }}
        />
      </motion.button>
    </motion.div>
  );
};

export default MediaItem;