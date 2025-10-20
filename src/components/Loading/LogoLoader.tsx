

import { motion } from "framer-motion";

export default function LogoLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        {/* Rotating container */}
        <motion.div
          className="relative w-28 h-28"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          {/* Diamond outline (gradient stroke) */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="servoGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              <linearGradient id="servoFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            {/* outer diamond */}
            <polygon
              points="50,5 95,50 50,95 5,50"
              fill="none"
              stroke="url(#servoGradient)"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>

          {/* Splitting bars that combine back to center */}
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
          >
            {[
              { d: "M20 50 L80 50", axis: "x" }, // horizontal
              { d: "M50 20 L50 80", axis: "y" }, // vertical
              { d: "M30 30 L70 70", axis: "d1" }, // diag1
              { d: "M70 30 L30 70", axis: "d2" }, // diag2
            ].map((line, i) => (
              <motion.path
                key={i}
                d={line.d}
                stroke="url(#servoGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.6 }}
                animate={{ pathLength: [0, 1, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.6, delay: i * 0.15, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}

            {/* Center diamond pieces that fly out and come back */}
            {[0, 1, 2, 3].map((q) => {
              const offsets = [
                { x: 0, y: -14 }, // top
                { x: 14, y: 0 }, // right
                { x: 0, y: 14 }, // bottom
                { x: -14, y: 0 }, // left
              ];
              const o = offsets[q];
              return (
                <motion.polygon
                  key={q}
                  points="50,42 58,50 50,58 42,50"
                  fill="url(#servoFill)"
                  initial={{ translateX: 0, translateY: 0, opacity: 1 }}
                  animate={{
                    translateX: [0, o.x, 0],
                    translateY: [0, o.y, 0],
                    rotate: [0, 90, 180],
                  }}
                  transition={{ duration: 1.8, delay: q * 0.12, repeat: Infinity, ease: "easeInOut" }}
                />
              );
            })}
          </motion.svg>
        </motion.div>

        {/* Sub text */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm font-medium text-gray-700">Chargement de SERVO…</p>
        </motion.div>
      </div>
    </div>
  );
}
