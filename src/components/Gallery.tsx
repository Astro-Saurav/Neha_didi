import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Lightbox from "./Lightbox";
import MediaItem from "./MediaItem.jsx"; // Ensure the import uses the .jsx extension

// --- Your Media Library ---
// The order here determines the order in the gallery.
const mediaItems = [
  // Add your 16 photos and 4 videos here
  { type: 'image', src: '/media/photos/1.jpeg' },
  { type: 'image', src: '/media/photos/2.jpeg' },
  { type: 'image', src: '/media/photos/3.jpeg' },
  { type: 'image', src: '/media/photos/4.jpeg' },
  { type: 'image', src: '/media/photos/5.jpeg' },
  { type: 'image', src: '/media/photos/6.jpeg' },
  { type: 'image', src: '/media/photos/7.jpeg' },
  { type: 'image', src: '/media/photos/8.jpeg' },
  { type: 'image', src: '/media/photos/9.jpeg' },
  // ... more images
  { type: 'video', src: '/media/video/1.mp4' },
  // ... more videos
];

const Gallery = () => {
  // This memoized calculation adds an 'alt' tag to each media item for accessibility.
  const galleryMedia = useMemo(() => mediaItems.map((item, index) => ({
    ...item,
    alt: `Raksha Bandhan Memory ${index + 1}`,
  })), []);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <section id="photos" className="container mx-auto py-16 sm:py-24">
      <header className="mb-8 sm:mb-12 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          Memories We Treasure
        </motion.h2>
        <p className="mt-2 text-muted-foreground">
            {galleryMedia.length} snapshots of love, laughter, and sibling magic.
        </p>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {galleryMedia.map((media, i) => (
          <MediaItem
            key={media.src}
            media={media}
            index={i}
            onClick={() => { setIndex(i); setOpen(true); }}
          />
        ))}
      </div>

      <Lightbox
        open={open}
        onOpenChange={setOpen}
        startIndex={index}
        // Pass only an array of source strings to the Lightbox
        images={galleryMedia.map(m => m.src)}
      />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        
      </p>
    </section>
  );
};

export default Gallery;