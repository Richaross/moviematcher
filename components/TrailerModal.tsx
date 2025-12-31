'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface TrailerModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoKey: string | null;
}

export default function TrailerModal({ isOpen, onClose, videoKey }: TrailerModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && videoKey && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
                            title="Movie Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
