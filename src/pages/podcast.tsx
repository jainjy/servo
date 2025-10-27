import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Headphones, Video, Play, Clock, Calendar, Eye, ArrowLeft, Heart } from "lucide-react";

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

// Composant Modal pour Podcasts et Vidéos
const MediaModal = ({ isOpen, onClose, type, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-500 ease-out animate-slideUp">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {type === 'podcasts' ? 'Nos Podcasts' : 'Nos Vidéos'}
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

          <div className="grid gap-4 max-h-[60vh] overflow-y-auto">
            {data.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-200">
                <div className={`p-3 rounded-lg ${type === 'podcasts' ? 'bg-blue-600' : 'bg-red-600'}`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {type === 'podcasts' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    )}
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-xs lg:text-base text-gray-800">{item.title}</h4>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-xs lg:text-sm  text-blue-800 px-2 py-1 rounded-full">{item.category}</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all duration-300 font-medium">
                  {type === 'podcasts' ? 'Écouter' : 'Regarder'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6 mt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const podcastVideosData = {
  podcasts: [
    {
      id: 1,
      title: "Méditation guidée pour le sommeil",
      duration: "25 min",
      category: "Relaxation",
      date: "15 Mars 2024",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=250&fit=crop",
      description: "Une séance de méditation apaisante pour un sommeil profond et réparateur"
    },
    {
      id: 2,
      title: "Les secrets de la respiration consciente",
      duration: "35 min",
      category: "Pranayama",
      date: "12 Mars 2024",
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=250&fit=crop",
      description: "Découvrez les techniques de respiration pour équilibrer votre énergie"
    },
    {
      id: 3,
      title: "Yoga Nidra pour la régénération",
      duration: "40 min",
      category: "Yoga",
      date: "10 Mars 2024",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
      description: "Un yoga du sommeil pour régénérer le corps et l'esprit en profondeur"
    }
  ],
  videos: [
    {
      id: 1,
      title: "Séquence yoga du matin",
      duration: "20 min",
      category: "Yoga",
      date: "18 Mars 2024",
      views: "15.2K",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
      description: "Réveillez votre corps en douceur avec cette séquence matinale"
    },
    {
      id: 2,
      title: "Routine fitness maison",
      duration: "30 min",
      category: "Fitness",
      date: "16 Mars 2024",
      views: "23.7K",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      description: "Entraînement complet sans matériel pour rester en forme"
    },
    {
      id: 3,
      title: "Techniques de massage auto-détente",
      duration: "15 min",
      category: "Massage",
      date: "14 Mars 2024",
      views: "18.9K",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=250&fit=crop",
      description: "Apprenez à vous masser pour relâcher les tensions du quotidien"
    }
  ]
};

// Composant Carte pour Podcast
const PodcastCard = ({ podcast }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 group">
      <div className="relative">
        <img
          src={podcast.image}
          alt={podcast.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${isPlaying ? 'bg-red-500' : 'bg-blue-600'
              } text-white`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <Play className="w-6 h-6" fill="currentColor" />
            )}
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {podcast.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {podcast.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {podcast.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{podcast.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{podcast.date}</span>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group">
          Écouter maintenant
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Composant Carte pour Vidéo
const VideoCard = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 group">
      <div className="relative">
        <img
          src={video.image}
          alt={video.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${isPlaying ? 'bg-red-500' : 'bg-red-600'
              } text-white`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <Play className="w-6 h-6" fill="currentColor" />
            )}
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {video.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
          {video.duration}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
          {video.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {video.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{video.views} vues</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{video.date}</span>
          </div>
        </div>

        <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group">
          Regarder maintenant
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Proadcast = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('podcasts');

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-4 lg:py-12 px-4 sm:px-6 lg:px-8 mt-20">
      {/* En-tête avec bouton de navigation */}
      <div className="container mx-auto">
        <SlideIn direction="up">
          <div className="text-center mb-12 flex  relative">
            {/* Bouton pour basculer vers le bien-être */}
            <div className=" top-0 -left-8 lg:left-0 absolute">
              <button
                onClick={() => navigate("/bien-etre")}
                className="inline-flex items-center gap-3 animate-accordion-down bg-slate-900 text-white lg:px-6 px-3 py-1 lg:py-3 rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium shadow-lg border border-slate-700 hover:border-slate-600 group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            <div className=" mx-auto max-w-3xl">
              <h1 className="text-xl lg:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Bibliothèque de <span className="text-blue-600">Médias</span>
              </h1>
              <p className="text-sm lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez nos podcasts inspirants et nos vidéos éducatives pour votre bien-être
              </p>
            </div>
          </div>
        </SlideIn>

        {/* Section Podcasts */}
        <section id="podcastaudio" className="mb-16">
          <SlideIn direction="left" delay={300}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <h2 className="text-xl lg:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                  <Headphones className="w-8 h-8 text-blue-600" />
                  Nos Podcasts
                </h2>
                <p className="text-gray-600">
                  Des contenus audio inspirants pour votre développement personnel
                </p>
              </div>
              <button
                onClick={() => openModal('podcasts')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center gap-2"
              >
                <Headphones className="w-5 h-5" />
                Voir tous les podcasts
              </button>
            </div>
          </SlideIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {podcastVideosData.podcasts.map((podcast, index) => (
              <SlideIn key={podcast.id} direction="up" delay={400 + index * 100}>
                <PodcastCard podcast={podcast} />
              </SlideIn>
            ))}
          </div>
        </section>

        {/* Section Vidéos */}
        <section id="video" className="mb-16">
          <SlideIn direction="left" delay={300}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <h2 className="text-xl lg:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                  <Video className="w-8 h-8 text-red-600" />
                  Nos Vidéos
                </h2>
                <p className="text-gray-600">
                  Des tutoriels et séances guidées pour pratiquer où que vous soyez
                </p>
              </div>
              <button
                onClick={() => openModal('videos')}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all duration-300 font-semibold flex items-center gap-2"
              >
                <Video className="w-5 h-5" />
                Voir toutes les vidéos
              </button>
            </div>
          </SlideIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {podcastVideosData.videos.map((video, index) => (
              <SlideIn key={video.id} direction="up" delay={400 + index * 100}>
                <VideoCard video={video} />
              </SlideIn>
            ))}
          </div>
        </section>

        {/* Section Call-to-Action */}
        <SlideIn direction="up" delay={500}>
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mt-16 text-center shadow-lg">
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4">
              Rejoignez notre communauté de bien-être
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Accédez à tous nos contenus premium et transformez votre pratique quotidienne
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => openModal('podcasts')}
                className="bg-blue-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-3 group"
              >
                Explorer les podcasts
                <Headphones className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => navigate("/bien-etre")}
                className="bg-slate-900 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-3 group"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Découvrir nos services
              </button>
            </div>
          </div>
        </SlideIn>
      </div>

      {/* Modal */}
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        data={podcastVideosData[modalType]}
      />

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Proadcast;