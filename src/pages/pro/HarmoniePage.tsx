import { useState } from 'react';
import { 
  Clock, 
  TrendingUp, 
  Play, 
  User, 
  MapPin, 
  Star,
  Leaf,
  Activity,
  Users,
  Target,
  Sparkles,
  Brain,
  Sun,
  Eye,
  Waves,
  Zap,
  Dumbbell,
  ChefHat,
  Flower2,
  Scissors,
  Sprout,
  Hand
} from 'lucide-react';

const HarmonieApp = () => {
    const stats = [
        { 
            title: 'Sessions ce mois', 
            value: '24', 
            change: '+12% vs mois dernier', 
            icon: Activity, 
            color: 'bg-blue-50 text-blue-600' 
        },
        { 
            title: 'Prochaine séance', 
            value: 'Yoga Vinyasa', 
            change: 'Demain à 10h00', 
            icon: Clock, 
            color: 'bg-amber-50 text-amber-600' 
        },
        { 
            title: 'Praticiens favoris', 
            value: '8', 
            change: 'Dans votre réseau', 
            icon: Users, 
            color: 'bg-purple-50 text-purple-600' 
        },
        { 
            title: 'Heures investies', 
            value: '36h', 
            change: 'Ce trimestre', 
            icon: Target, 
            color: 'bg-cyan-50 text-cyan-600' 
        }
    ];

    const courses = [
        {
            id: 1,
            title: 'Yoga à domicile',
            description: 'Séance personnalisée avec professeur certifié. Hatha, Vinyasa, Ashtanga adapté à votre niveau.',
            icon: Leaf,
            badge: 'Populaire',
            duration: '60-90 min',
            location: 'À domicile',
            price: 45,
            category: 'Yoga',
            color: 'bg-blue-50 text-blue-600',
            iconColor: 'text-blue-600'
        },
        {
            id: 2,
            title: 'Pilates & Renforcement',
            description: 'Tonifiez votre corps en douceur avec des exercices ciblés et un suivi personnalisé.',
            icon: Dumbbell,
            badge: 'Nouveau',
            duration: '60 min',
            location: 'À domicile',
            price: 50,
            category: 'Pilates',
            color: 'bg-pink-50 text-pink-600',
            iconColor: 'text-pink-600'
        },
        {
            id: 3,
            title: 'Cours de Cuisine',
            description: 'Cuisine créole authentique, vegan gourmand ou gastronomie étoilée. Apprenez chez vous.',
            icon: ChefHat,
            badge: '⭐ Chef',
            duration: '120 min',
            location: 'À domicile',
            price: 80,
            category: 'Cuisine',
            color: 'bg-orange-50 text-orange-600',
            iconColor: 'text-orange-600'
        }
    ];

    const massages = [
        {
            id: 4,
            title: 'Massage Relaxant',
            description: 'Massage complet du corps pour évacuer le stress et les tensions musculaires.',
            icon: Hand,
            badge: 'Détente',
            duration: '60 min',
            location: 'À domicile',
            price: 65,
            color: 'bg-purple-50 text-purple-600',
            iconColor: 'text-purple-600'
        },
        {
            id: 5,
            title: 'Massage Ayurvédique',
            description: 'Technique ancestrale indienne pour rééquilibrer les énergies et purifier le corps.',
            icon: Flower2,
            badge: 'Ayurvéda',
            duration: '90 min',
            location: 'À domicile',
            price: 85,
            color: 'bg-cyan-50 text-cyan-600',
            iconColor: 'text-cyan-600'
        },
        {
            id: 6,
            title: 'Massage Crânien & Cheveux',
            description: 'Soin relaxant du cuir chevelu avec huiles naturelles et techniques de massage.',
            icon: Scissors,
            badge: 'Soin capillaire',
            duration: '45 min',
            location: 'À domicile',
            price: 40,
            color: 'bg-yellow-50 text-yellow-600',
            iconColor: 'text-yellow-600'
        }
    ];

    const therapies = [
        {
            id: 7,
            title: 'Séance Thérapeutique',
            description: 'Consultation avec thérapeute certifié pour accompagnement émotionnel et mental.',
            icon: Brain,
            badge: 'Thérapie',
            duration: '60 min',
            location: 'En ligne',
            price: 55,
            color: 'bg-indigo-50 text-indigo-600',
            iconColor: 'text-indigo-600'
        },
        {
            id: 8,
            title: 'Guidance Chamanique',
            description: 'Voyage intérieur et rééquilibrage énergétique avec praticien chamanique.',
            icon: Sparkles,
            badge: 'Énergétique',
            duration: '90 min',
            location: 'En ligne',
            price: 75,
            color: 'bg-rose-50 text-rose-600',
            iconColor: 'text-rose-600'
        },
        {
            id: 9,
            title: 'Séance de Guérison',
            description: 'Accompagnement holistique avec guérisseur pour harmoniser corps et esprit.',
            icon: Sprout,
            badge: 'Guérison',
            duration: '60 min',
            location: 'En ligne',
            price: 60,
            color: 'bg-teal-50 text-teal-600',
            iconColor: 'text-teal-600'
        }
    ];

    const podcasts = [
        {
            id: 1,
            title: 'Respiration 4-7-8 pour l\'anxiété',
            author: 'Dr. Sophie Martin',
            duration: '45 sec',
            category: 'Bien-être',
            icon: Waves,
            gradient: 'from-blue-500 to-blue-700',
            views: '2.4M',
            iconColor: 'text-blue-100'
        },
        {
            id: 2,
            title: 'Rituel matinal en 60 secondes',
            author: 'Mamadou Kéita',
            duration: '60 sec',
            category: 'Spiritualité',
            icon: Sun,
            gradient: 'from-amber-500 to-orange-600',
            views: '1.8M',
            iconColor: 'text-amber-100'
        },
        {
            id: 3,
            title: 'Méditation express au bureau',
            author: 'Amélie Dubois',
            duration: '30 sec',
            category: 'Méditation',
            icon: Leaf,
            gradient: 'from-purple-500 to-purple-700',
            views: '3.2M',
            iconColor: 'text-purple-100'
        },
        {
            id: 4,
            title: 'Affirmations puissantes du matin',
            author: 'Jean-Marc Lafont',
            duration: '55 sec',
            category: 'Motivation',
            icon: Zap,
            gradient: 'from-pink-500 to-rose-600',
            views: '4.1M',
            iconColor: 'text-pink-100'
        },
        {
            id: 5,
            title: 'Étirement rapide anti-stress',
            author: 'Marie-Claire Dupont',
            duration: '40 sec',
            category: 'Bien-être',
            icon: Activity,
            gradient: 'from-cyan-500 to-blue-600',
            views: '2.9M',
            iconColor: 'text-cyan-100'
        },
        {
            id: 6,
            title: 'Lâcher prise en 3 respirations',
            author: 'Fatou Diallo',
            duration: '35 sec',
            category: 'Guérison',
            icon: Sparkles,
            gradient: 'from-teal-500 to-emerald-600',
            views: '1.5M',
            iconColor: 'text-teal-100'
        }
    ];

    const courseFilters = ['Tous', 'Yoga', 'Pilates', 'Sport', 'Cuisine'];
    const podcastFilters = ['Tous', 'Motivation', 'Guérison', 'Spiritualité', 'Méditation'];

    const ServiceCard = ({ service }) => {
        const IconComponent = service.icon;
        return (
            <div className="bg-white rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center`}>
                            <IconComponent className={`w-7 h-7 ${service.iconColor}`} />
                        </div>
                        <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">
                            {service.badge}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                    <div className="flex flex-wrap gap-3 mb-4">
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="w-3 h-3" /> {service.duration}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="w-3 h-3" /> {service.location}
                        </span>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div>
                            <span className="text-2xl font-bold text-blue-700">{service.price}€</span>
                            <span className="text-sm text-gray-500">/séance</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const VideoCard = ({ video }) => {
        const IconComponent = video.icon;
        return (
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <div className={`relative h-48 bg-gradient-to-br ${video.gradient} flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <IconComponent className={`w-16 h-16 ${video.iconColor}`} />
                    <div className="absolute w-16 h-16 bg-white bg-opacity-95 rounded-full flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Play className="w-6 h-6 ml-1" fill="currentColor" />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-semibold">
                        {video.duration}
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <span className="inline-block bg-gray-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                            {video.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {video.views}
                        </span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-800 mb-3 leading-tight">{video.title}</h4>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {video.author}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const StatCard = ({ stat }) => {
        const IconComponent = stat.icon;
        return (
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-gray-500 uppercase font-semibold tracking-wide">{stat.title}</span>
                    <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6" />
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-xs text-blue-600 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                </div>
            </div>
        );
    };

    const SectionHeader = ({ title, icon: Icon, buttonText = "Voir tout" }) => (
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
            </div>
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors flex items-center gap-1">
                {buttonText} <span>→</span>
            </button>
        </div>
    );

    const FilterButtons = ({ filters, selectedFilter, onFilterChange }) => (
        <div className="flex gap-2 mb-5 flex-wrap">
            {filters.map(filter => (
                <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedFilter === filter 
                            ? 'bg-blue-500 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white'
                    }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );

    const [selectedCourseFilter, setSelectedCourseFilter] = useState("Tous");
    const [selectedPodcastFilter, setSelectedPodcastFilter] = useState("Tous");

    const filteredCourses = selectedCourseFilter === "Tous" 
        ? courses 
        : courses.filter(course => course.category === selectedCourseFilter);

    const filteredVideos = selectedPodcastFilter === 'Tous' 
        ? podcasts 
        : podcasts.filter(video => video.category === selectedPodcastFilter);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                            <Leaf className="w-7 h-7" />
                        </div>
                        <span>Harmonie</span>
                    </h1>
                    <p className="text-gray-600 text-lg">Votre espace bien-être personnalisé - Cours, massages, thérapies et inspiration</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {stats.map((stat, index) => (
                        <StatCard key={index} stat={stat} />
                    ))}
                </div>

                {/* Courses Section */}
                <div className="bg-white rounded-xl p-7 mb-8 border border-gray-100 shadow-sm">
                    <SectionHeader 
                        title="Cours à domicile" 
                        icon={Leaf}
                    />
                    
                    <FilterButtons 
                        filters={courseFilters}
                        selectedFilter={selectedCourseFilter}
                        onFilterChange={setSelectedCourseFilter}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredCourses.map(course => (
                            <ServiceCard key={course.id} service={course} />
                        ))}
                    </div>
                </div>

                {/* Massages Section */}
                <div className="bg-white rounded-xl p-7 mb-8 border border-gray-100 shadow-sm">
                    <SectionHeader 
                        title="Massages à domicile" 
                        icon={Hand}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {massages.map(massage => (
                            <ServiceCard key={massage.id} service={massage} />
                        ))}
                    </div>
                </div>

                {/* Therapies Section */}
                <div className="bg-white rounded-xl p-7 mb-8 border border-gray-100 shadow-sm">
                    <SectionHeader 
                        title="Consultations en visio" 
                        icon={Brain}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {therapies.map(therapy => (
                            <ServiceCard key={therapy.id} service={therapy} />
                        ))}
                    </div>
                </div>

                {/* Podcasts Section */}
                <div className="bg-white rounded-xl p-7 border border-gray-100 shadow-sm">
                    <SectionHeader 
                        title="Vidéos Courtes Inspirantes" 
                        icon={Play}
                    />

                    <FilterButtons 
                        filters={podcastFilters}
                        selectedFilter={selectedPodcastFilter}
                        onFilterChange={setSelectedPodcastFilter}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredVideos.map(video => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HarmonieApp;