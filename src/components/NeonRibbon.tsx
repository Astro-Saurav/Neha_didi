import { motion } from "framer-motion";

const NeonRibbon = () => {
  return (
    <motion.div
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2 top-28 w-[92vw] max-w-5xl h-16 rounded-full neon-border glass"
      style={{ backgroundImage: "var(--gradient-primary)" }}
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

export default NeonRibbon;
