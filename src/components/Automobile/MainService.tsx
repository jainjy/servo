// components/automobile/MainServices.tsx

import { mainServices } from "@/data/automobileData";

export default function MainServices() {
  return (
    <section className="py-20 container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">
        Nos Services Principaux
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {mainServices.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group"
          >
            <img
              src={service.image}
              className="h-52 w-full object-cover group-hover:scale-105 transition duration-300"
              alt={service.title}
            />

            <div className="p-6">
              <service.icon 
                className="w-8 h-8 mb-4" 
                style={{ color: '#6B8E23' }}
              />
              <h3 className="text-xl font-semibold mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>

              <ul className="text-sm space-y-1">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2" style={{ color: '#6B8E23' }}>•</span>
                    <span className="text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}