import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useModalOverlay } from '@/hooks/useModalOverlay';

interface ImageViewerProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = Boolean(src);

  useModalOverlay({
    isOpen,
    onClose,
    initialFocusRef: closeButtonRef
  });

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] flex cursor-zoom-out items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={alt ? `图片预览：${alt}` : '图片预览'}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="关闭图片预览"
          >
            <X size={24} />
          </button>

          <motion.img
            layoutId={`image-${src}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            src={src}
            alt={alt || ''}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 500) {
                onClose();
              }
            }}
            className="max-h-[90vh] max-w-full cursor-grab active:cursor-grabbing rounded-lg object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />

          {alt && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-6 left-0 right-0 px-4 text-center font-medium text-white/80"
            >
              {alt}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};