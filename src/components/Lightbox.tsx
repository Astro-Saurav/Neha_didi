import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";

// --- Helper Function ---
// This function checks the file extension to determine the media type.
const getMediaType = (src: string): 'image' | 'video' => {
  const extension = src.split('.').pop()?.toLowerCase();
  if (extension && ['mp4', 'webm', 'ogg'].includes(extension)) {
    return 'video';
  }
  return 'image';
};

// --- Component Props Interface ---
interface LightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[]; // This prop now handles both image and video URLs
  startIndex?: number;
}

// --- The Updated Lightbox Component ---
const Lightbox = ({ open, onOpenChange, images, startIndex = 0 }: LightboxProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: images.length > 1, // Loop only if there is more than one item
    startIndex: startIndex,
  });

  // When the dialog opens, re-initialize the carousel to the correct starting index.
  useEffect(() => {
    if (open && emblaApi) {
      emblaApi.reInit({ startIndex });
      emblaApi.scrollTo(startIndex, true);
    }
  }, [open, startIndex, emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Keyboard navigation for accessibility.
  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [open, scrollNext, scrollPrev, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen w-screen h-screen p-0 border-0 bg-black/90 flex items-center justify-center">
        <div className="overflow-hidden w-full" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((src, i) => {
              const mediaType = getMediaType(src);
              return (
                <div key={i} className="relative flex-[0_0_100%] h-full flex items-center justify-center">
                  {/* --- CONDITIONAL RENDERING LOGIC --- */}
                  {mediaType === 'image' ? (
                    <motion.img
                      src={src}
                      alt={`Lightbox content ${i + 1}`}
                      className="max-h-[90vh] max-w-[92vw] object-contain rounded-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  ) : (
                    <motion.video
                      src={src}
                      controls
                      autoPlay
                      loop
                      muted // Muting is often necessary for autoplay to work in browsers
                      playsInline
                      className="max-h-[90vh] max-w-[92vw] object-contain rounded-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                    
                    </motion.video>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- UI Controls --- */}
        <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between">
          <button className="glass neon-border px-4 py-2 rounded-md text-sm" onClick={() => onOpenChange(false)}>Close</button>
          {images.length > 1 && (
             <div className="flex gap-2">
                <button className="glass neon-border px-3 py-2 rounded-md text-sm" onClick={scrollPrev}>Prev</button>
                <button className="glass neon-border px-3 py-2 rounded-md text-sm" onClick={scrollNext}>Next</button>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Lightbox;