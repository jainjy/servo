// components/automobile/HeroSection.tsx

import { motion } from "framer-motion";
import { Calendar, Phone } from "lucide-react";

interface Props {
  onBook: () => void;
}

export default function HeroSection({ onBook }: Props) {
  return (
    <section className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 h-full flex items-center container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white max-w-2xl"
        >
          <h1 className="text-5xl font-bold mb-6">
            Entretien & Réparation Automobile
          </h1>

          <div className="flex gap-4">
            {/*<button
              onClick={onBook}
              className="px-6 py-3 text-white rounded-xl flex items-center gap-2"
              style={{ backgroundColor: '#6B8E23' }}
            >
              <Phone className="w-5 h-5" />
              +262 692 66 77 55
            </button>*/}

            <button className="px-6 py-3 border border-white text-white rounded-xl flex items-center gap-2">
              <Phone className="w-5 h-5" />
              +262 692 66 77 55
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}