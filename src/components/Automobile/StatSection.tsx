// components/automobile/StatsSection.tsx

import { Users, Wrench, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, value: "2500+", label: "Clients satisfaits" },
  { icon: Wrench, value: "15+", label: "Années d'expérience" },
  { icon: Award, value: "98%", label: "Taux de satisfaction" },
  { icon: Clock, value: "24/7", label: "Assistance" },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative inline-block">
                  <Icon 
                    className="w-10 h-10 mb-4 transition-transform duration-300 group-hover:scale-110" 
                    style={{ color: '#6B8E23' }} 
                  />
                  <div 
                    className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ backgroundColor: '#6B8E23' }}
                  />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}