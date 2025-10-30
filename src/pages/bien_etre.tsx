import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Données pour la section 1 - Cours à domicile
const services = [
  {
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2120&q=80",
    title: "Yoga & Pilates pour renforcer corps et esprit",
    description: "Pratiques douces alliant postures, respiration et méditation pour équilibrer le corps et l'esprit. Nos instructeurs certifiés adaptent chaque séance à votre niveau et vos objectifs personnels.",
    price: "65€"
  },
  {
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Sport fitness & relaxation personnalisés",
    description: "Programmes sur mesure combinant renforcement musculaire, cardio et techniques de relaxation. Un coaching individuel pour atteindre vos objectifs forme et bien-être.",
    price: "75€"
  },
  {
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Cuisine créole, vegan et étoilée avec nos chefs à domicile",
    description: "Expériences culinaires exclusives où nos chefs étoilés vous initient aux saveurs créoles, à la gastronomie vegan ou aux techniques de haute cuisine dans votre propre cuisine.",
    price: "120€"
  },
];

// Données pour la section 2 - Massages
const massages = [
  {
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Massage de la tête & cuir chevelu revitalisant",
    description: "Technique spécialisée pour libérer les tensions du cuir chevelu, stimuler la circulation et favoriser la pousse des cheveux. Une expérience de relaxation profonde unique.",
    price: "55€"
  },
  {
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    title: "Massage corps complet relaxant ou tonifiant",
    description: "Soin énergisant ou détendant utilisant des huiles essentielles bio. Adapté à vos besoins : récupération sportive, anti-stress ou simple moment de lâcher-prise.",
    price: "90€"
  },
  {
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    title: "Soins capillaires aux huiles naturelles",
    description: "Traitement 100% naturel à base d'huiles végétales pour nourrir, réparer et redonner brillance et vitalité à votre chevelure. Diagnostic personnalisé inclus.",
    price: "70€"
  }
];

// Données pour la section 3 - Visio
const visioServices = [
  {
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Thérapeutes & coachs bien-être",
    description: "Accompagnement personnalisé par des experts certifiés en nutrition, gestion du stress et développement personnel. Suivi régulier et objectifs mesurables.",
    price: "60€"
  },
  {
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2120&q=80",
    title: "Chamans et guérisseurs spirituels",
    description: "Guidance ancestrale pour retrouver l'équilibre intérieur. Séances de soins énergétiques, méditations guidées et conseils spirituels personnalisés.",
    price: "80€"
  },
  {
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1999&q=80",
    title: "Consultations énergétiques et développement personnel",
    description: "Approche holistique combinant travail sur les énergies et techniques de développement personnel pour transformer durablement votre qualité de vie.",
    price: "85€"
  }
];



// Composant d'animation personnalisé
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
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
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
              : direction === "up"
                ? "opacity-0 translate-y-10"
                : "opacity-0 translate-y-10"
        }
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Composant formulaire de rendez-vous
const AppointmentForm = ({ isOpen, onClose, service }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis:", formData);
    toast.info("Rendez-vous confirmé ! Nous vous contacterons rapidement.");
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
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Informations supplémentaires..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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

// Composant de carte réutilisable
const ServiceCard = ({ service, index, reverse = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fonction pour tronquer le texte
  const truncateDescription = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const isDescriptionLong = service.description.length > 120;

  return (
    <>
      <div className={`relative flex flex-col lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''} items-center gap-6 lg:gap-8 p-6 lg:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-400 hover:scale-[1.01] group cursor-pointer border border-gray-200 mb-6 overflow-hidden`}>

        {/* Image avec effet de zoom */}
        <div className="flex-shrink-0 relative overflow-hidden rounded-2xl w-full lg:w-2/5 z-10">
          <div className="w-full h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl transition-opacity duration-300 group-hover:opacity-0" />
        </div>

        {/* Contenu texte */}
        <div className="flex-1 w-full lg:w-3/5 z-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 pr-4">
              {service.title}
            </h3>
            <span className="text-lg lg:text-xl font-bold text-white bg-slate-900 px-4 py-2 rounded-lg shadow-lg min-w-20 text-center self-start transform group-hover:scale-105 transition-transform duration-300">
              {service.price}
            </span>
          </div>

          <div className="mb-6">
            {!showDetails && isDescriptionLong ? (
              <p className="text-gray-600 leading-relaxed line-clamp-2">
                {truncateDescription(service.description)}
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
              className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 z-20 relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Rendez-vous
            </button>

            {isDescriptionLong && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium flex items-center justify-center gap-2 z-20 relative"
              >
                {showDetails ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Voir moins
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    En savoir plus
                  </>
                )}
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




const BienEtre = () => {
  const navigate = useNavigate();

  const goToSection = (sectionId: string) => {
    navigate(`/podcasts#${sectionId}`);
  };

  /****** */

  const section2Ref = useRef(null);

  const scrollToSection2 = () => {
    section2Ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };


  /****** */

  return (
    <div className="font-poppins text-gray-800 min-h-screen">
      {/* Hero Section avec Background Image */}
      <section
        className="relative h-96 py-20 lg:py-32 text-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 58, 138, 0.6)), url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1999&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
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
            <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed px-4 mb-8 drop-shadow-lg">
              Découvrez nos expériences holistiques à domicile, en visio ou en compagnie de nos experts certifiés.
            </p>
          </SlideIn>
          <SlideIn direction="up" delay={400}>
            <button
              onClick={scrollToSection2}
              className="bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-2xl font-semibold text-lg">

              Commencer mon voyage
            </button>
          </SlideIn>
        </div>
      </section>

      {/* Contenu principal avec background */}
      <div ref={section2Ref} className="bg-gray-50 p-4 sm:p-6 lg:p-10">

        {/* --- SECTION 1 --- Cours à domicile */}
        <section className="mb-16 lg:mb-20">
          <SlideIn direction="left">
            <div className="mb-8 lg:mb-12">
              <h2 className="text-2xl lg:text-3xl mb-4 font-bold text-slate-900 text-left">
                Cours à domicile
              </h2>
              <p className="text-gray-700 mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed text-left max-w-3xl">
                Des séances personnalisées dans le confort de votre maison. Nos experts se déplacent chez vous avec tout le matériel nécessaire pour des cours sur mesure adaptés à vos objectifs et votre emploi du temps.
              </p>

              <div className="space-y-6">
                {services.map((service, index) => (
                  <ServiceCard
                    key={index}
                    service={service}
                    index={index}
                    reverse={index % 2 !== 0}
                  />
                ))}
              </div>
            </div>
          </SlideIn>
        </section>

        {/* --- SECTION 2 --- Massages à domicile */}
        <section className="mb-16 lg:mb-20">
          <SlideIn direction="right">
            <div className="mb-8 lg:mb-12">
              <h2 className="text-2xl lg:text-3xl mb-4 font-bold text-slate-900 text-left">
                Massages à domicile
              </h2>
              <p className="text-gray-700 mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed text-left max-w-3xl">
                Transformez votre espace en véritable spa avec nos thérapeutes certifiés. Installation professionnelle, huiles essentielles bio et ambiance relaxante pour une expérience sensorielle complète sans vous déplacer.
              </p>
              <div className="space-y-6">
                {massages.map((service, index) => (
                  <ServiceCard
                    key={index}
                    service={service}
                    index={index}
                    reverse={index % 2 === 0}
                  />
                ))}
              </div>
            </div>
          </SlideIn>
        </section>

        {/* --- SECTION 3 --- Consultation en visio */}
        <section className="mb-16 lg:mb-20">
          <SlideIn direction="left">
            <div className="mb-8 lg:mb-12">
              <h2 className="text-2xl lg:text-3xl mb-4 font-bold text-slate-900 text-left">
                Consultation en visio
              </h2>
              <p className="text-gray-700 mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed text-left max-w-3xl">
                Accédez à l'expertise où que vous soyez. Nos consultations à distance maintiennent la qualité d'un accompagnement personnalisé avec une flexibilité totale. Idéal pour un suivi régulier ou des conseils ponctuels.
              </p>
              <div className="space-y-6">
                {visioServices.map((service, index) => (
                  <ServiceCard
                    key={index}
                    service={service}
                    index={index}
                    reverse={index % 2 !== 0}
                  />
                ))}
              </div>
            </div>
          </SlideIn>
        </section>

        {/* --- SECTION 4 --- Podcasts & Vidéos */}
        <section className="mb-16 lg:mb-20">
          <SlideIn direction="up">
            <div
              className="bg-white rounded-2xl p-6 lg:p-10 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.01] border border-gray-200 relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay pour meilleure lisibilité */}
              <div className="absolute inset-0 bg-white/80 rounded-2xl"></div>

              <div className="relative z-10">
                <h2 className="text-2xl lg:text-3xl mb-4 lg:mb-6 font-bold text-slate-900">
                  Podcasts & Vidéos Inspirantes
                </h2>
                <p className="text-gray-700 mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed max-w-3xl">
                  Visionnez nos entretiens exclusifs avec des personnalités inspirantes et découvrez leurs parcours de vie.
                  Un projet mené en collaboration avec notre agence de communication partenaire.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <button
                    onClick={() => goToSection("podcastaudio")}
                    className="bg-blue-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-3 group z-20 relative"
                  >
                    Voir nos podcasts
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => goToSection("video")}
                    className="bg-slate-900 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-3 group z-20 relative"
                  >
                    Découvrir les vidéos
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </SlideIn>
        </section>

      </div>

      {/* Styles pour l'animation du formulaire */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
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