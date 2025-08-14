import { useEffect, useState, useRef, useCallback } from "react";
import ReactPlayer from "react-player/youtube";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Music, X, Volume2, VolumeX } from "lucide-react";

// --- Interfaces and Data ---
interface Track {
  artist: string;
  title: string;
  url: string;
}

const tracks: Track[] = [
  { artist: "EXO", title: "Love Shot", url: "https://www.youtube.com/watch?v=pSudEWBAYRE" },
  { artist: "EXO", title: "Monster", url: "https://www.youtube.com/watch?v=KSH-FVVtTf0" },
  { artist: "EXO", title: "Cream Soda", url: "https://www.youtube.com/watch?v=pSudEWBAYRE" },
];

// --- Lyrics Fetching ---
const fetchLyrics = async (artist: string, title: string) => {
  try {
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    if (!response.ok) return "Lyrics not found for this track.";
    const data = await response.json();
    return data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return "Could not load lyrics.";
  }
};

// --- Main Component ---
const MusicPlayer = () => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true); // Autoplay is on by default
  const [muted, setMuted] = useState(true);     // Muted is REQUIRED for autoplay
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const playerRef = useRef<ReactPlayer | null>(null);

  const current = tracks[index];

  // --- 3D Animation Logic ---
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent<HTMLDivElement>) => {
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left - width / 2);
      mouseY.set(clientY - top - height / 2);
  };

  const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
  };
  
  const springConfig = { stiffness: 150, damping: 20, mass: 0.8 };
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [-8, 8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [8, -8]), springConfig);


  // --- Track and Lyrics Control ---
  const next = useCallback(() => setIndex((i) => (i + 1) % tracks.length), []);
  const prev = () => setIndex((i) => (i - 1 + tracks.length) % tracks.length);

  useEffect(() => {
    setLyrics("Loading lyrics...");
    fetchLyrics(current.artist, current.title).then(setLyrics);
  }, [current]);

  // *** FIXED LOGIC FOR PLAY/PAUSE ***
  const handlePlayPause = () => {
    // This function now correctly handles unmuting on first interaction.
    setPlaying(!playing);
    if (muted) {
      setMuted(false);
    }
  };
  
  return (
    <div className="fixed inset-x-3 bottom-3 z-40" style={{ perspective: "1500px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass neon-border rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 justify-between"
        initial={{ y: 40, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className={`eq ${!playing || !muted ? 'playing' : ''}`} aria-hidden>
          <span className="eq-bar" />
          <span className="eq-bar" />
          <span className="eq-bar" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm sm:text-base font-semibold">{current.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {muted ? "Player is muted (click volume icon)" : `By ${current.artist}`}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* *** NEW DEDICATED MUTE/UNMUTE BUTTON *** */}
          <button className="p-2 rounded-full glass neon-border" onClick={() => setMuted(m => !m)} aria-label="Mute/Unmute">
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button className="p-2 rounded-full glass neon-border" onClick={prev} aria-label="Previous track"><SkipBack size={20} /></button>
          <button className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-hero text-foreground font-semibold" onClick={handlePlayPause} aria-label="Play/Pause">
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="p-2 rounded-full glass neon-border" onClick={next} aria-label="Next track"><SkipForward size={20} /></button>
          <button className="p-2 rounded-full glass neon-border" onClick={() => setShowLyrics(s => !s)} aria-label="Show lyrics"><Music size={20} /></button>
        </div>
        <ReactPlayer
          ref={playerRef}
          url={current.url}
          playing={playing}
          muted={muted}
          controls={false}
          width={0}
          height={0}
          style={{ display: 'none' }}
          onEnded={next}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </motion.div>

      {/* Lyrics Display */}
      {showLyrics && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-[120%] left-0 right-0 max-h-64 overflow-y-auto bg-black/70 backdrop-blur-md rounded-lg p-4 text-center"
        >
          <button onClick={() => setShowLyrics(false)} className="absolute top-2 right-2 text-white/50 hover:text-white"><X size={18}/></button>
          <p className="text-sm text-white/90 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: lyrics || "" }} />
        </motion.div>
      )}

      <p className="text-center mt-2 text-xs text-muted-foreground">Streaming from YouTube. Click the volume icon to unmute.</p>
    </div>
  );
};

export default MusicPlayer;