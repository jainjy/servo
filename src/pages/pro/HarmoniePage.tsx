import { useState, useEffect } from 'react';
import {
    Clock, TrendingUp, Play, User, MapPin, Star,
    Leaf, Activity, Users, Target, Sparkles, Brain, Sun, Eye,
    Waves, Zap, Dumbbell, ChefHat, Flower2, Scissors, Sprout, Hand,
    Plus
} from 'lucide-react';
import { ServiceCreateDialog } from '../../components/pro/ServiceCreateDialog';
import { toast } from '@/hooks/use-toast';

// Types de données de démonstration
interface Category {
    id: number;
    nom: string;
}

interface Metier {
    id: number;
    nom: string;
}

interface UserData {
    id: number;
    nom: string;
}

interface NewService {
    libelle: string;
    description: string;
    price: number;
    duration: number;
    categoryId: number;
    metierId: number;
    userId: number;
}

const HarmonieApp = () => {
    // === États ===
    const [selectedCourseFilter, setSelectedCourseFilter] = useState("Tous");
    const [selectedPodcastFilter, setSelectedPodcastFilter] = useState("Tous");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [metiers, setMetiers] = useState<Metier[]>([]);
    const [users, setUsers] = useState<UserData[]>([]); // remplir si nécessaire
    const token = localStorage.getItem("auth-token") || "";

    // Récupération depuis localStorage
    useEffect(() => {
        const storedUsers = localStorage.getItem("user-data");
        console.log("Données brutes dans localStorage:", storedUsers);

        if (storedUsers) {
            try {
                const parsedUsers = JSON.parse(storedUsers);

                // Si c'est un objet unique, on le met dans un tableau
                const usersArray = Array.isArray(parsedUsers) ? parsedUsers : [parsedUsers];

                const formattedUsers = usersArray.map((u: any) => ({
                    id: u.id,
                    nom: `${u.firstName} ${u.lastName}`
                }));

                setUsers(formattedUsers);
                console.log("Users chargés depuis localStorage :", formattedUsers);
            } catch (err) {
                console.error("Erreur parsing user-data", err);
            }
        }
    }, []);

    const [categoriesFormateur, setCategoriesFormateur] = useState<Category[]>([]);
    const [categoriesPodcasteur, setCategoriesPodcasteur] = useState<Category[]>([]);

    const [activeCategory, setActiveCategory] = useState<"Formateur" | "Podcasteur" | "Masseur" | "Thérapeute" | null>(null);

    // Récupération des catégories et métiers depuis le backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Token:", token);

                const res = await fetch("http://localhost:3001/api/harmonie/filtre", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Status:", res.status);

                const data = await res.json();
                console.log("Data:", data);

                if (!res.ok) throw new Error("Erreur lors du chargement des filtres");

                // 🔹 Met à jour les catégories Formateur
                setCategoriesFormateur(
                    data.Formateur.map((c: any) => ({
                        id: c.id,
                        nom: c.name,
                    }))
                );

                // 🔹 Met à jour les catégories Podcasteur
                setCategoriesPodcasteur(
                    data.Podcasteur.map((c: any) => ({
                        id: c.id,
                        nom: c.name,
                    }))
                );

                console.log("Formateur:", data.Formateur);
                console.log("Podcasteur:", data.Podcasteur);

            } catch (err) {
                console.error(err);
                toast({
                    title: "Erreur",
                    description: "Impossible de charger les filtres",
                    variant: "destructive",
                });
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        const fetchMetiers = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/harmonie/metiers", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Impossible de charger les métiers");

                const data = await res.json();
                console.log("🟢 Métiers reçus :", data);
                setMetiers(data); // on stocke la liste dans le state
            } catch (err) {
                console.error("❌ Erreur dans fetchMetiers :", err);
                toast({
                    title: "Erreur",
                    description: "Impossible de charger les métiers",
                    variant: "destructive",
                });
            }
        };

        fetchMetiers();
    }, [token]);

    const handleSubmit = async (service: NewService, files: FileList | null) => {
        try {
            const formData = new FormData();
            formData.append("libelle", service.libelle);
            formData.append("description", service.description);
            formData.append("price", service.price.toString());
            formData.append("duration", service.duration.toString());
            formData.append("categoryId", service.categoryId.toString());
            formData.append("metiers", JSON.stringify([service.metierId]));
            formData.append("users", JSON.stringify([service.userId]));

            if (files && files.length > 0) {
                // Upload de toutes les images
                Array.from(files).forEach((file) => formData.append("image", file));
            }

            const res = await fetch("http://localhost:3001/api/harmonie/ajout", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur serveur");
            }

            const result = await res.json();
            toast({ title: "Succès", description: `Le service "${result.name}" a été créé` });
            setIsModalOpen(false);

        } catch (err: any) {
            console.error(err);
            toast({ title: "Erreur", description: err.message, variant: "destructive" });
        }
    };

    const [allServices, setAllServices] = useState([]);
    const [servicesByMetier, setServicesByMetier] = useState({
        Formateur: [],
        Masseur: [],
        Thérapeute: [],
        Podcasteur: []
    });

    useEffect(() => {
        const fetchAllServices = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/harmonie/services", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Erreur serveur");
                setAllServices(data);

                const grouped: Record<string, any[]> = { Formateur: [], Masseur: [], Thérapeute: [], Podcasteur: [] };

                data.forEach(service => {
                    console.log("🔹 Service:", service.libelle); // nom du service
                    service.metiers.forEach((m: any) => {
                        const libelle = m.metier?.libelle; // retirer espaces
                        console.log("   - Métier:", libelle); // métier associé
                        if (libelle && grouped[libelle]) {
                            grouped[libelle].push(service);
                        }
                    });
                });

                console.log("✅ Services groupés par métier:", grouped); // résultat final
                setServicesByMetier(grouped);

            } catch (err) {
                console.error("Erreur fetch services :", err);
            }
        };

        fetchAllServices();
    }, [token]);


    // === Données ===
    const stats = [
        { title: 'Sessions ce mois', value: '24', change: '+12% vs mois dernier', icon: Activity, color: 'bg-blue-50 text-blue-600' },
        { title: 'Prochaine séance', value: 'Yoga Vinyasa', change: 'Demain à 10h00', icon: Clock, color: 'bg-amber-50 text-amber-600' },
        { title: 'Praticiens favoris', value: '8', change: 'Dans votre réseau', icon: Users, color: 'bg-purple-50 text-purple-600' },
        { title: 'Heures investies', value: '36h', change: 'Ce trimestre', icon: Target, color: 'bg-cyan-50 text-cyan-600' }
    ];
    /**
    const courses = [
        { id: 1, title: 'Yoga à domicile', description: 'Séance personnalisée avec professeur certifié. Hatha, Vinyasa, Ashtanga adapté à votre niveau.', icon: Leaf, badge: 'Populaire', duration: '60-90 min', location: 'À domicile', price: 45, category: 'Yoga', color: 'bg-blue-50 text-blue-600', iconColor: 'text-blue-600' },
        { id: 2, title: 'Pilates & Renforcement', description: 'Tonifiez votre corps en douceur avec des exercices ciblés et un suivi personnalisé.', icon: Dumbbell, badge: 'Nouveau', duration: '60 min', location: 'À domicile', price: 50, category: 'Pilates', color: 'bg-pink-50 text-pink-600', iconColor: 'text-pink-600' },
        { id: 3, title: 'Cours de Cuisine', description: 'Cuisine créole authentique, vegan gourmand ou gastronomie étoilée. Apprenez chez vous.', icon: ChefHat, badge: '⭐ Chef', duration: '120 min', location: 'À domicile', price: 80, category: 'Cuisine', color: 'bg-orange-50 text-orange-600', iconColor: 'text-orange-600' }
    ];

    const massages = [
        { id: 4, title: 'Massage Relaxant', description: 'Massage complet du corps pour évacuer le stress et les tensions musculaires.', icon: Hand, badge: 'Détente', duration: '60 min', location: 'À domicile', price: 65, color: 'bg-purple-50 text-purple-600', iconColor: 'text-purple-600' },
        { id: 5, title: 'Massage Ayurvédique', description: 'Technique ancestrale indienne pour rééquilibrer les énergies et purifier le corps.', icon: Flower2, badge: 'Ayurvéda', duration: '90 min', location: 'À domicile', price: 85, color: 'bg-cyan-50 text-cyan-600', iconColor: 'text-cyan-600' },
        { id: 6, title: 'Massage Crânien & Cheveux', description: 'Soin relaxant du cuir chevelu avec huiles naturelles et techniques de massage.', icon: Scissors, badge: 'Soin capillaire', duration: '45 min', location: 'À domicile', price: 40, color: 'bg-yellow-50 text-yellow-600', iconColor: 'text-yellow-600' }
    ];

    const therapies = [
        { id: 7, title: 'Séance Thérapeutique', description: 'Consultation avec thérapeute certifié pour accompagnement émotionnel et mental.', icon: Brain, badge: 'Thérapie', duration: '60 min', location: 'En ligne', price: 55, color: 'bg-indigo-50 text-indigo-600', iconColor: 'text-indigo-600' },
        { id: 8, title: 'Guidance Chamanique', description: 'Voyage intérieur et rééquilibrage énergétique avec praticien chamanique.', icon: Sparkles, badge: 'Énergétique', duration: '90 min', location: 'En ligne', price: 75, color: 'bg-rose-50 text-rose-600', iconColor: 'text-rose-600' },
        { id: 9, title: 'Séance de Guérison', description: 'Accompagnement holistique avec guérisseur pour harmoniser corps et esprit.', icon: Sprout, badge: 'Guérison', duration: '60 min', location: 'En ligne', price: 60, color: 'bg-teal-50 text-teal-600', iconColor: 'text-teal-600' }
    ];

    const podcasts = [
        { id: 1, title: 'Respiration 4-7-8 pour l\'anxiété', author: 'Dr. Sophie Martin', duration: '45 sec', category: 'Bien-être', icon: Waves, gradient: 'from-blue-500 to-blue-700', views: '2.4M', iconColor: 'text-blue-100' },
        { id: 2, title: 'Rituel matinal en 60 secondes', author: 'Mamadou Kéita', duration: '60 sec', category: 'Spiritualité', icon: Sun, gradient: 'from-amber-500 to-orange-600', views: '1.8M', iconColor: 'text-amber-100' },
        { id: 3, title: 'Méditation express au bureau', author: 'Amélie Dubois', duration: '30 sec', category: 'Méditation', icon: Leaf, gradient: 'from-purple-500 to-purple-700', views: '3.2M', iconColor: 'text-purple-100' }
    ];

     */

    const courseFilters = ['Tous', 'Yoga', 'Pilates', 'Sport', 'Cuisine'];
    const podcastFilters = ['Tous', 'Motivation', 'Guérison', 'Spiritualité', 'Méditation'];

    //const filteredCourses = selectedCourseFilter === "Tous" ? courses : courses.filter(c => c.category === selectedCourseFilter);
    //const filteredVideos = selectedPodcastFilter === "Tous" ? podcasts : podcasts.filter(v => v.category === selectedPodcastFilter);

    // === Composants ===
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
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-semibold">{video.duration}</div>
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <span className="inline-block bg-gray-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase">{video.category}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {video.views}
                        </span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-800 mb-3 leading-tight">{video.title}</h4>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span className="flex items-center gap-2"><User className="w-4 h-4" />{video.author}</span>
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
                <div className="text-xs text-blue-600 flex items-center gap-2"><TrendingUp className="w-4 h-4" />{stat.change}</div>
            </div>
        );
    };
    const FilterButtons = ({ filters, selectedFilter, onFilterChange }) => (
        <div className="flex gap-2 mb-5 flex-wrap">
            {filters.map(filter => (
                <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedFilter === filter ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white'
                        }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );


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

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {stats.map((stat, i) => <StatCard key={i} stat={stat} />)}
                </div>

                {/* Courses */}
                <div className="bg-white rounded-xl p-7 mb-8 border border-gray-100 shadow-sm">

                    <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Leaf className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Cours à domicile</h2>
                        </div>

                        <button
                            onClick={() => {
                                setActiveCategory("Formateur");
                                setIsModalOpen(true);
                            }}
                            className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors flex items-center gap-1"
                        >
                            Ajouter
                            <span>+</span>

                        </button>

                    </div>

                    {/* Formateurs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {servicesByMetier.Formateur.map(s => <ServiceCard key={s.id} service={{
                            ...s,
                            title: s.libelle,
                            description: s.description,
                            price: s.price,
                            duration: `${s.duration} min`,
                            location: "À domicile",
                            color: "bg-blue-50 text-blue-600",
                            icon: Leaf,
                            iconColor: "text-blue-600",
                            badge: s.category?.name || "Cours"
                        }} />)}
                    </div>
                </div>

                {/* Massages */}
                <div className="bg-white rounded-xl p-7 mb-8 border border-gray-100 shadow-sm">

                    <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Hand className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Massages à domicile</h2>
                        </div>

                        <button
                            onClick={() => {
                                setActiveCategory("Masseur");
                                setIsModalOpen(true);
                            }}
                            className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors flex items-center gap-1"
                        >
                            Ajouter
                            <span>+</span>

                        </button>

                    </div>
                    {/* Massages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {servicesByMetier.Masseur.map(s => <ServiceCard key={s.id} service={{
                            ...s,
                            title: s.libelle,
                            description: s.description,
                            price: s.price,
                            duration: `${s.duration} min`,
                            location: "À domicile",
                            color: "bg-purple-50 text-purple-600",
                            icon: Hand,
                            iconColor: "text-purple-600",
                            badge: s.category?.name || "Massage"
                        }} />)}
                    </div>
                </div>

                {/* Therapies */}
                <div className="bg-white rounded-xl p-7 mb-8 border border-gray-100 shadow-sm">

                    <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Brain className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Consultations en visio</h2>
                        </div>

                        <button
                            onClick={() => {
                                setActiveCategory("Thérapeute");
                                setIsModalOpen(true);
                            }}
                            className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors flex items-center gap-1"
                        >
                            Ajouter
                            <span>+</span>

                        </button>

                    </div>
                    {/* Thérapeutes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {servicesByMetier['Thérapeute'].map(s => (
                            <ServiceCard key={s.id} service={{
                                ...s,
                                title: s.libelle,
                                description: s.description,
                                price: s.price,
                                duration: `${s.duration} min`,
                                location: "En ligne",
                                color: "bg-indigo-50 text-indigo-600",
                                icon: Brain,
                                iconColor: "text-indigo-600",
                                badge: s.category?.name || "Consultation"
                            }} />
                        ))}
                    </div>
                </div>

                {/* Podcasts */}
                <div className="bg-white rounded-xl p-7 border border-gray-100 shadow-sm">

                    <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Play className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Vidéos Courtes Inspirantes</h2>
                        </div>

                        <button
                            onClick={() => {
                                setActiveCategory("Podcasteur");
                                setIsModalOpen(true);
                            }}
                            className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors flex items-center gap-1"
                        >
                            Ajouter
                            <span>+</span>

                        </button>

                    </div>
                    {/* Podcasteurs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {servicesByMetier['Podcasteur'].map(s => (
                            <ServiceCard key={s.id} service={{
                                ...s,
                                title: s.libelle,
                                description: s.description,
                                price: s.price,
                                duration: `${s.duration} sec`,
                                location: "En ligne",
                                color: "bg-cyan-50 text-cyan-600",
                                icon: Play,
                                iconColor: "text-cyan-600",
                                badge: s.category?.name || "Vidéo"
                            }} />
                        ))}
                    </div>
                </div>

            </div>

            {/* === Modal de création de service === */}
            <ServiceCreateDialog
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categoriesFormateur={activeCategory === "Formateur" ? categoriesFormateur : []}
                categoriesPodcasteur={activeCategory === "Podcasteur" ? categoriesPodcasteur : []}
                metiers={metiers}
                users={users}
                onSubmit={handleSubmit}
                activeCategory={activeCategory}
            />


        </div>
    );
};

export default HarmonieApp;
