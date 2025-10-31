import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

// ==================== Animation SlideIn ====================
const SlideIn = ({ children, direction = "left", delay = 0 }) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isInView
          ? "opacity-100 translate-x-0 translate-y-0"
          : direction === "left"
          ? "opacity-0 -translate-x-10"
          : direction === "right"
          ? "opacity-0 translate-x-10"
          : "opacity-0 translate-y-10"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ==================== SVG Icons ====================
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const VideoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ==================== Formulaire Rendez-vous ====================
const AppointmentForm = ({ isOpen, onClose, service }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Rendez-vous confirmé ! Nous vous contacterons rapidement.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-out animate-slideUp">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Prendre rendez-vous - {service?.title}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "email", "phone", "date", "time"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field === "name"
                    ? "Nom complet *"
                    : field === "email"
                    ? "Email *"
                    : field === "phone"
                    ? "Téléphone"
                    : field === "date"
                    ? "Date *"
                    : "Heure *"}
                </label>
                <input
                  type={field === "email" ? "email" : field === "phone" ? "tel" : field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={["name", "email", "date", "time"].includes(field)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold shadow-lg hover:scale-105"
              >
                Confirmer le rendez-vous
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==================== Carte Service ====================
const ServiceCard = ({ service, index, reverse = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const truncate = (text, max = 120) =>
    text.length > max ? text.substring(0, max) + "..." : text;

  const isLong = service.description?.length > 120;

  return (
    <>
      <div
        className={`relative flex flex-col lg:flex-row ${
          reverse ? "lg:flex-row-reverse" : ""
        } items-center gap-6 lg:gap-8 p-6 lg:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-400 hover:scale-[1.01] group cursor-pointer border border-gray-200 mb-6 overflow-hidden`}
      >
        {/* Image */}
        <div className="flex-shrink-0 relative overflow-hidden rounded-2xl w-full lg:w-2/5 z-10">
          <div className="w-full h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl" />
        </div>

        {/* Contenu */}
        <div className="flex-1 w-full lg:w-3/5 z-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 pr-4">
              {service.title}
            </h3>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold text-white bg-slate-900 px-4 py-2 rounded-lg shadow-lg text-center">
                {service.price}
              </span>
              {service.duration && (
                <span className="text-sm text-gray-600 mt-1 text-center">
                  ⏱️ {service.duration} min
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            {!showDetails && isLong ? (
              <p className="text-gray-600 leading-relaxed line-clamp-2">
                {truncate(service.description)}
              </p>
            ) : (
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all duration-300 font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              <CalendarIcon />
              Rendez-vous
            </button>
            {isLong && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                <InfoIcon />
                {showDetails ? "Voir moins" : "En savoir plus"}
              </button>
            )}
          </div>
        </div>
      </div>
      <AppointmentForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        service={service}
      />
    </>
  );
};

// ==================== Composant principal ====================
const BienEtre = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const section2Ref = useRef(null);

  const scrollToSection2 = () =>
    section2Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });

  const goToSection = (id) => navigate(`/podcasts#${id}`);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/bienetre");
        if (res.data.success) setServices(res.data.data);
      } catch (e) {
        console.error("Erreur chargement BienEtre:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="font-poppins text-gray-800 min-h-screen">
      {/* Hero */}
      <section
        className="relative h-96 py-20 lg:py-32 text-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.8),rgba(30,58,138,0.6)),url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1999&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 to-slate-900/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <SlideIn direction="up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
              Bien-Être & Équilibre
            </h1>
          </SlideIn>
          <SlideIn direction="up" delay={200}>
            <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto mb-8 drop-shadow-lg">
              Découvrez nos expériences holistiques à domicile, en visio ou en compagnie de nos experts certifiés.
            </p>
          </SlideIn>
          <SlideIn direction="up" delay={400}>
            <button
              onClick={scrollToSection2}
              className="bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-2xl font-semibold text-lg flex items-center justify-center gap-2 mx-auto"
            >
              <InfoIcon />
              Commencer mon voyage
            </button>
          </SlideIn>
        </div>
      </section>

      {/* Contenu */}
      <div ref={section2Ref} className="bg-gray-50 p-4 sm:p-6 lg:p-10">
        {loading ? (
          <p className="text-center py-10 text-gray-600">Chargement...</p>
        ) : (
          <>
            {["Thérapeute ou Masseur", "Yoga", "Podcaste"].map((cat) => {
              const filtered = services.filter(
                (s) => s.category_name === cat
              );
              if (!filtered.length) return null;
              return (
                <section key={cat} className="mb-16 lg:mb-20">
                  <SlideIn direction="left">
                    <div className="mb-8 lg:mb-12">
                      <h2 className="text-2xl lg:text-3xl mb-4 font-bold text-slate-900 text-left">
                        {cat}
                      </h2>
                      <div className="space-y-6">
                        {filtered.map((s, i) => (
                          <ServiceCard
                            key={s.id}
                            service={{
                              title: s.title,
                              description: s.description,
                              price: `${s.price}€`,
                              image:
                                s.images?.[0] ||
                                "https://placehold.co/600x400",
                              duration: s.duration,
                            }}
                            index={i}
                            reverse={i % 2 !== 0}
                          />
                        ))}
                      </div>
                    </div>
                  </SlideIn>
                </section>
              );
            })}
          </>
        )}

        {/* Section podcasts */}
        <section className="mb-16 lg:mb-20">
          <SlideIn direction="up">
            <div
              className="bg-white rounded-2xl p-6 lg:p-10 shadow-2xl border border-gray-200 relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.9),rgba(255,255,255,0.9)),url('https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=2070&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-white/80 rounded-2xl"></div>
              <div className="relative z-10">
                <h2 className="text-2xl lg:text-3xl mb-4 lg:mb-6 font-bold text-slate-900">
                  Podcasts & Vidéos Inspirantes
                </h2>
                <p className="text-gray-700 mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed max-w-3xl">
                  Visionnez nos entretiens exclusifs avec des personnalités inspirantes et découvrez leurs parcours de vie.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <button
                    onClick={() => goToSection("podcastaudio")}
                    className="bg-blue-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center gap-3"
                  >
                    <PlayIcon />
                    Voir nos podcasts
                  </button>
                  <button
                    onClick={() => goToSection("video")}
                    className="bg-slate-900 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center gap-3"
                  >
                    <VideoIcon />
                    Découvrir les vidéos
                  </button>
                </div>
              </div>
            </div>
          </SlideIn>
        </section>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BienEtre;