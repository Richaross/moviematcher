import { motion, MotionValue } from 'framer-motion';

interface MovieCardOverlayProps {
    yepOpacity: MotionValue<number>;
    nopeOpacity: MotionValue<number>;
}

export default function MovieCardOverlay({ yepOpacity, nopeOpacity }: MovieCardOverlayProps) {
    return (
        <>
            <motion.div
                style={{ opacity: yepOpacity }}
                className="absolute top-8 left-8 border-4 border-green-500 rounded-lg px-4 py-2 rotate-[-15deg] z-20 pointer-events-none"
            >
                <span className="text-4xl font-black text-green-500 uppercase tracking-widest">
                    LIKE
                </span>
            </motion.div>

            <motion.div
                style={{ opacity: nopeOpacity }}
                className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg] z-20 pointer-events-none"
            >
                <span className="text-4xl font-black text-red-500 uppercase tracking-widest">
                    NOPE
                </span>
            </motion.div>
        </>
    );
}
