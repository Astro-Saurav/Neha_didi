import { motion } from "framer-motion";

const shapes = Array.from({ length: 14 }).map((_, i) => ({
  id: i,
  size: Math.random() * 60 + 20,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  duration: Math.random() * 12 + 12,
  delay: Math.random() * 6,
}));

const EXOBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {shapes.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full blur-md"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, background: "hsl(var(--brand-glow))", opacity: 0.12 }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* Subtle grid glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--brand-purple)/.12),transparent_40%),radial-gradient(circle_at_80%_60%,hsl(var(--brand-pink)/.12),transparent_45%)]" />
    </div>
  );
};

export default EXOBackground;
