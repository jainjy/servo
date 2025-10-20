import React, { useState, useEffect } from "react";
import services from '@/lib/services';
import Header from '@/components/layout/Header';

export default function DevisContent() {
  // Initialise les paramètres de recherche depuis l'URL uniquement côté client
  const [serviceId, setServiceId] = useState<number>(1);
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    // Lire les paramètres de l'URL search
    const params = new URLSearchParams(window.location.search);
    const sid = Number(params.get('serviceId') || '1');
    const idx = Number(params.get('imgIndex') || '0');
    setServiceId(sid);
    setImgIndex(idx);
    setCurrent(idx);
  }, []);

  const service = services.find((s) => s.id === serviceId) || services[0];

  const prev = () => setCurrent((c) => (c - 1 + service.images.length) % service.images.length);
  const next = () => setCurrent((c) => (c + 1) % service.images.length);

  return (
    <>
  
      <div className="container mx-auto p-6 max-w-6xl bg-white rounded-lg">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
          Demande de devis
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h2 className="font-semibold text-xl mb-6 text-gray-800">Vos informations</h2>
              <form onSubmit={(e) => { e.preventDefault(); alert('Devis envoyé (demo)'); }}>
                <div className="flex flex-col gap-4">
                  <input
                    name="name"
                    placeholder="Votre nom"
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                  />
                  <input
                    name="phone"
                    placeholder="Téléphone"
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="Détails"
                    rows={5}
                    className="border border-gray-300 rounded-lg px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  <button
                    type="submit"
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition"
                  >
                    Envoyer la demande
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Galerie images avec navigation */}
          <div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <button
                  onClick={prev}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  aria-label="Image précédente"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  aria-label="Image suivante"
                >
                  ›
                </button>
              </div>
              <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-md">
                {/* Remplacement simple sans next/image */}
                <img
                  src={service.images[current].src}
                  alt={service.images[current].title}
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg w-full h-full"
                />
              </div>
              <p className="mt-3 text-sm text-center text-gray-600 select-none">
                {service.images[current].title} ({current + 1}/{service.images.length})
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
