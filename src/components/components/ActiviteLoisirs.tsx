import React, { useState, useEffect } from 'react';
import {
    ChevronDown, ChevronUp, Camera, Utensils, Palette, Music,
    BookOpen, Users, Clock, MapPin, Award, Star, Sparkles,
    Play, Heart, Share2, Bookmark, Search,
    Bike, SwatchBook, CookingPot,
    Backpack, Shield, Highlighter,
    Mountain, Waves, TreePine, Tent, Compass,
    Map, Trophy, Zap, Sun, Moon, User, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ← CHANGÉ ICI

interface Activity {
    id: string;
    title: string;
    description: string;
    category: {
        id: string;
        name: string;
        icon?: string;
        color?: string;
    };
    icon?: string;
    image: string;
    price?: number;
    duration: string;
    level: string;
    maxParticipants: number;
    minParticipants: number;
    location?: string;
    latitude?: number;
    longitude?: number;
    meetingPoint?: string;
    included: string[];
    requirements: string[];
    highlights: string[];
    featured: boolean;
    rating: number;
    reviewCount: number;
    viewCount: number;
    guide: {
        id: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            avatar?: string;
            phone?: string;
        };
        bio?: string;
        specialties: string[];
        languages: string[];
        experience?: number;
        rating: number;
        reviewCount: number;
    };
    upcomingAvailability?: Array<{
        id: string;
        date: string;
        startTime: string;
        endTime: string;
        availableSlots: number;
        price?: number;
    }>;
    isFavorite?: boolean;
    favoriteCount: number;
    stats: {
        participants: string;
        duration: string;
        level: string;
    };
    features: string[];
    createdAt: string;
    updatedAt: string;
}

interface ActivityCategory {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    count: number;
}

interface CategoryButton {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
}

const ActivitesLoisirsFAQ: React.FC = () => {
    const navigate = useNavigate(); // ← CHANGÉ ICI (useNavigate au lieu de useRouter)
    const [openActivity, setOpenActivity] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [activities, setActivities] = useState<Activity[]>([]);
    const [categories, setCategories] = useState<ActivityCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Catégories statiques pour l'UI (basées sur vos données originales)
    const categoryButtons: CategoryButton[] = [
        { id: 'all', name: 'Toutes', icon: <Compass className="w-4 h-4" />, color: 'from-purple-500 to-pink-500' },
        { id: 'plein-air', name: 'Plein Air', icon: <Mountain className="w-4 h-4" />, color: 'from-green-500 to-emerald-500' },
        { id: 'aventure', name: 'Aventure', icon: <Compass className="w-4 h-4" />, color: 'from-orange-500 to-red-500' },
        { id: 'nocturne', name: 'Nocturne', icon: <Moon className="w-4 h-4" />, color: 'from-blue-500 to-indigo-500' },
        { id: 'aquatique', name: 'Aquatique', icon: <Waves className="w-4 h-4" />, color: 'from-cyan-500 to-blue-500' },
        { id: 'interieur', name: 'Intérieur', icon: <Tent className="w-4 h-4" />, color: 'from-yellow-500 to-orange-500' },
        { id: 'famille', name: 'Famille', icon: <TreePine className="w-4 h-4" />, color: 'from-pink-500 to-rose-500' },
        { id: 'sportif', name: 'Sportif', icon: <Trophy className="w-4 h-4" />, color: 'from-red-500 to-pink-500' },
        { id: 'bien-etre', name: 'Bien-être', icon: <Zap className="w-4 h-4" />, color: 'from-teal-500 to-green-500' }
    ];

    // Récupérer l'utilisateur connecté
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                
                const response = await fetch('/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    
                    // Récupérer les favoris de l'utilisateur
                    const favoritesResponse = await fetch('/api/activity-actions/favorites', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (favoritesResponse.ok) {
                        const favoritesData = await favoritesResponse.json();
                        const favoriteIds = new Set<string>(favoritesData.data?.map((a: Activity) => a.id) || []);
                        setFavorites(favoriteIds);
                    }
                }
            } catch (error) {
                console.error('Erreur récupération utilisateur:', error);
            }
        };

        fetchUser();
    }, []);

    // Récupérer les activités
    const fetchActivities = async () => {
        try {
            setLoading(true);
            
            let url = '/api/activities?status=active';
            if (activeCategory !== 'all') {
                url += `&category=${activeCategory}`;
            }
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des activités');
            }
            
            const data = await response.json();
            setActivities(data.data || []);
        } catch (error: any) {
            setError(error.message);
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [activeCategory, searchTerm]);

    // Récupérer les catégories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/activities/categories');
                
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.data || []);
                }
            } catch (error) {
                console.error('Erreur récupération catégories:', error);
            }
        };

        fetchCategories();
    }, []);

    const toggleActivity = (id: string) => {
        setOpenActivity(openActivity === id ? null : id);
    };

    const handleFavorite = async (activityId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login?redirect=/activites'); // ← CHANGÉ ICI
                return;
            }

            const response = await fetch('/api/activity-actions/favorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ activityId })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Mettre à jour l'état local
                setActivities(prev => prev.map(activity => {
                    if (activity.id === activityId) {
                        return {
                            ...activity,
                            isFavorite: data.action === 'added',
                            favoriteCount: data.action === 'added' 
                                ? activity.favoriteCount + 1 
                                : activity.favoriteCount - 1
                        };
                    }
                    return activity;
                }));

                // Mettre à jour les favoris
                if (data.action === 'added') {
                    setFavorites(prev => {
                        const newSet = new Set(prev);
                        newSet.add(activityId);
                        return newSet;
                    });
                } else {
                    setFavorites(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(activityId);
                        return newSet;
                    });
                }
            }
        } catch (error) {
            console.error('Erreur favorite:', error);
        }
    };

    const handleShare = async (activity: Activity) => {
        const shareUrl = `${window.location.origin}/activites/${activity.id}`;
        const shareText = `Découvrez cette activité : ${activity.title}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: activity.title,
                    text: shareText,
                    url: shareUrl,
                });
                
                // Enregistrer le partage
                await recordShare(activity.id, 'web_share');
            } catch (error) {
                console.log('Erreur de partage:', error);
            }
        } else {
            // Fallback pour Facebook
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
            
            // Enregistrer le partage
            await recordShare(activity.id, 'facebook');
        }
    };

    const recordShare = async (activityId: string, platform: string) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch('/api/activity-actions/share', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        activityId,
                        platform,
                        sharedWith: null
                    })
                });
            }
        } catch (error) {
            console.error('Erreur enregistrement partage:', error);
        }
    };

    const handleBook = (activity: Activity) => {
        if (!user) {
            navigate('/login?redirect=/activites'); // ← CHANGÉ ICI
            return;
        }
        
        if (activity.upcomingAvailability && activity.upcomingAvailability.length > 0) {
            navigate(`/booking/${activity.id}`); // ← CHANGÉ ICI
        } else {
            // Aucune disponibilité, contacter le guide
            navigate(`/contact-guide/${activity.guide.id}?activity=${activity.id}`); // ← CHANGÉ ICI
        }
    };

    const handleContactGuide = (guideId: string, activityId?: string) => {
        navigate(`/contact-guide/${guideId}${activityId ? `?activity=${activityId}` : ''}`); // ← CHANGÉ ICI
    };

    const handleViewCalendar = (activityId: string) => {
        navigate(`/activites/${activityId}/calendar`); // ← CHANGÉ ICI
    };

    const getCategoryCount = (categoryId: string) => {
        if (categoryId === 'all') return activities.length;
        
        // Mapping des IDs de catégories UI vers IDs de catégories API
        const categoryMap: Record<string, string> = {
            'plein-air': 'plein-air',
            'bien-etre': 'bien-etre'
        };
        
        const apiCategoryId = categoryMap[categoryId] || categoryId;
        const category = categories.find(cat => cat.id === apiCategoryId);
        return category?.count || 0;
    };

    const getCategoryColor = (categoryId: string) => {
        const category = categoryButtons.find(cat => cat.id === categoryId);
        return category ? category.color : 'from-gray-500 to-gray-600';
    };

    const getCategoryIcon = (categoryName: string) => {
        switch (categoryName.toLowerCase()) {
            case 'plein air':
            case 'plein-air':
                return <Mountain className="w-4 h-4" />;
            case 'aventure':
                return <Compass className="w-4 h-4" />;
            case 'nocturne':
                return <Moon className="w-4 h-4" />;
            case 'aquatique':
                return <Waves className="w-4 h-4" />;
            case 'intérieur':
            case 'interieur':
                return <Tent className="w-4 h-4" />;
            case 'famille':
                return <TreePine className="w-4 h-4" />;
            case 'sportif':
                return <Trophy className="w-4 h-4" />;
            case 'bien-être':
            case 'bien-etre':
                return <Zap className="w-4 h-4" />;
            default:
                return <Compass className="w-4 h-4" />;
        }
    };

    const formatPrice = (price?: number) => {
        if (!price) return 'Sur devis';
        return `${price}€/personne`;
    };

    const formatRating = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '⭐';
        }
        if (hasHalfStar) {
            stars += '⭐';
        }
        return stars;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    };

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (activity.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Fonction pour extraire les features des données de l'activité
    const extractFeatures = (activity: Activity): string[] => {
        const features: string[] = [];
        
        // Ajouter les éléments inclus
        if (activity.included && activity.included.length > 0) {
            features.push(...activity.included.slice(0, 4));
        }
        
        // Ajouter les highlights
        if (activity.highlights && activity.highlights.length > 0 && features.length < 4) {
            const remaining = 4 - features.length;
            features.push(...activity.highlights.slice(0, remaining));
        }
        
        // Si pas assez de features, ajouter des valeurs par défaut
        if (features.length < 4) {
            const defaultFeatures = ['Guide diplômé', 'Matériel inclus', 'Sécurité garantie', 'Photos souvenirs'];
            for (let i = features.length; i < 4 && i < defaultFeatures.length; i++) {
                features.push(defaultFeatures[i]);
            }
        }
        
        return features.slice(0, 4);
    };

    // Fonction pour générer les stats à partir des données
    const generateStats = (activity: Activity) => {
        return {
            participants: `${activity.minParticipants}-${activity.maxParticipants} personnes`,
            duration: activity.duration,
            level: activity.level
        };
    };

    // Ajouter ces deux fonctions pour le guide et les disponibilités
    const getGuideSpecialties = (guide: Activity['guide']) => {
        return guide.specialties.join(', ') || 'Guide polyvalent';
    };

    const formatTimeRange = (startTime: string, endTime: string) => {
        return `${startTime} - ${endTime}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen mt-16 flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Chargement des activités...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen mt-16 flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md">
                        <h3 className="text-lg font-bold">Erreur</h3>
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-16 text-gray-100 bg-white">
            {/* Hero Section */}
            <div className="relative py-8 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-br from-purple-600/20 to-orange-500/20"></div>
                    <img
                        src="https://i.pinimg.com/736x/fa/05/b9/fa05b9dba51cec6eb5e7441b75d0c153.jpg"
                        className='w-full h-full object-cover'
                        alt="Activités en pleine nature"
                    />
                </div>
                <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-white bg-clip-text text-transparent">
                        Activités & Loisirs
                    </h1>
                    <p className="text-md text-slate-200 max-w-3xl mx-auto leading-relaxed">
                        Découvrez nos activités touristiques uniques - Des expériences inoubliables
                        <span className="text-orange-400 font-semibold"> en pleine nature</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300 group">
                            <div className="p-2 rounded-xl bg-yellow-400/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                <Star className="w-4 h-4 text-yellow-400" />
                            </div>
                            <span className="text-sm text-white font-medium">100% encadrement pro</span>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300 group">
                            <div className="p-2 rounded-xl bg-green-400/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                <Shield className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="text-sm text-white font-medium">Sécurité garantie</span>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300 group">
                            <div className="p-2 rounded-xl bg-purple-400/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className="text-sm text-white font-medium">Souvenirs magiques</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl -mt-5 mx-auto px-4 mb-12">
                <div className="relative">
                    <div className="absolute z-40 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-purple-900" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher une activité, un loisir..."
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-purple-500 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-lg text-slate-900 placeholder-slate-400 backdrop-blur-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation par Catégories */}
            <div className="px-4 mx-auto mb-16">
                <div className="flex flex-wrap justify-center gap-3">
                    {categoryButtons.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 font-semibold text-sm shadow-lg hover:scale-105 ${activeCategory === category.id
                                ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-purple-500/25`
                                : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-purple-400 backdrop-blur-sm'
                                }`}
                        >
                            {category.icon}
                            <span>{category.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeCategory === category.id
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-700 text-slate-400'
                                }`}>
                                {getCategoryCount(category.id)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Section Activités */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                {filteredActivities.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-slate-800/50 rounded-2xl shadow-lg p-12 max-w-md mx-auto border-2 border-purple-500/30 backdrop-blur-sm">
                            <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-slate-200 mb-3">
                                {searchTerm ? 'Aucun résultat' : 'Aucune activité disponible'}
                            </h3>
                            <p className="text-slate-400 text-lg">
                                {searchTerm 
                                    ? `Aucun résultat pour "${searchTerm}"`
                                    : "Essayez d'autres termes ou explorez nos catégories !"
                                }
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setActiveCategory('all');
                                        fetchActivities();
                                    }}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                                >
                                    Voir toutes les activités
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredActivities.map((activity) => {
                            const activityFeatures = extractFeatures(activity);
                            const activityStats = generateStats(activity);
                            const isFavorite = favorites.has(activity.id) || activity.isFavorite;
                            
                            return (
                                <div
                                    key={activity.id}
                                    className="bg-slate-800 border-2 border-purple-500/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-purple-500/40 backdrop-blur-sm"
                                >
                                    <button
                                        onClick={() => toggleActivity(activity.id)}
                                        className="w-full flex items-center justify-between p-8 text-left hover:bg-slate-700/30 transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(activeCategory)} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                                {getCategoryIcon(activity.category.name)}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <h3 className="text-xl font-bold text-white">
                                                        {activity.title}
                                                    </h3>
                                                    {activity.featured && (
                                                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                            ⭐ Populaire
                                                        </span>
                                                    )}
                                                    {activity.rating >= 4.5 && (
                                                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                            ✨ Excellence
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="bg-slate-700/80 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold border border-purple-500/30">
                                                        {activity.category.name}
                                                    </span>
                                                    <div className="flex items-center gap-6 text-slate-400 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-green-400" />
                                                            <span className="font-semibold">{activityStats.participants}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-orange-400" />
                                                            <span className="font-semibold">{activityStats.duration}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Award className="w-4 h-4 text-yellow-400" />
                                                            <span className="font-semibold">{activityStats.level}</span>
                                                        </div>
                                                        {activity.price && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-green-400">
                                                                    {formatPrice(activity.price)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {openActivity === activity.id ? (
                                            <ChevronUp className="w-6 h-6 text-purple-400" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6 text-slate-400" />
                                        )}
                                    </button>

                                    {openActivity === activity.id && (
                                        <div className="border-t border-purple-500/20">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                                                <div className="space-y-6">
                                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                                        <img
                                                            src={activity.image}
                                                            alt={activity.title}
                                                            className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <div className="absolute top-4 right-4">
                                                            <button
                                                                onClick={() => handleFavorite(activity.id)}
                                                                className={`p-2 rounded-full ${isFavorite 
                                                                    ? 'bg-red-500 text-white' 
                                                                    : 'bg-black/60 text-white hover:bg-black/80'
                                                                } transition-all duration-300`}
                                                            >
                                                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                                            </button>
                                                        </div>
                                                        <div className="absolute bottom-4 left-4 flex gap-2">
                                                            <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                                                                📍 {activity.category.name}
                                                            </span>
                                                            {activity.location && (
                                                                <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" /> {activity.location}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {activityFeatures.length > 0 && (
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {activityFeatures.map((feature, idx) => (
                                                                <div key={idx} className="bg-slate-700/80 text-slate-200 px-4 py-3 rounded-xl text-sm font-medium border border-slate-600 text-center">
                                                                    {feature}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Guide Info */}
                                                    <div className="bg-slate-700/50 rounded-xl p-4">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            {activity.guide.user.avatar ? (
                                                                <img 
                                                                    src={activity.guide.user.avatar} 
                                                                    alt={`${activity.guide.user.firstName} ${activity.guide.user.lastName}`}
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                                                    <User className="w-5 h-5 text-white" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h4 className="font-bold text-white">
                                                                    {activity.guide.user.firstName} {activity.guide.user.lastName}
                                                                </h4>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-yellow-400">
                                                                        {formatRating(activity.guide.rating)}
                                                                    </span>
                                                                    <span className="text-slate-300 text-sm">
                                                                        ({activity.guide.reviewCount} avis)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {activity.guide.bio && (
                                                            <p className="text-slate-300 text-sm">{activity.guide.bio}</p>
                                                        )}
                                                        {activity.guide.specialties.length > 0 && (
                                                            <div className="mt-2">
                                                                <span className="text-purple-300 text-sm font-medium">
                                                                    Spécialités : {getGuideSpecialties(activity.guide)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                            <Sparkles className="w-5 h-5 text-yellow-400" />
                                                            Détails de l'expérience
                                                        </h4>
                                                        <p className="text-slate-300 text-lg leading-relaxed">
                                                            {activity.description}
                                                        </p>
                                                    </div>

                                                    {activity.upcomingAvailability && activity.upcomingAvailability.length > 0 && (
                                                        <div>
                                                            <h4 className="text-lg font-bold text-white mb-3">
                                                                Prochaines disponibilités
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {activity.upcomingAvailability.slice(0, 3).map((slot, idx) => (
                                                                    <div key={idx} className="bg-slate-700/50 rounded-lg p-3 flex justify-between items-center">
                                                                        <div>
                                                                            <div className="text-white font-medium">
                                                                                {formatDate(slot.date)}
                                                                            </div>
                                                                            <div className="text-slate-300 text-sm">
                                                                                {formatTimeRange(slot.startTime, slot.endTime)}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div className="text-green-400 font-bold">
                                                                                {slot.availableSlots} place(s)
                                                                            </div>
                                                                            {slot.price && (
                                                                                <div className="text-slate-300 text-sm">
                                                                                    {slot.price}€/pers
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-3 pt-4">
                                                        <button 
                                                            onClick={() => handleBook(activity)}
                                                            className="flex items-center gap-2 bg-[#9B177E] text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg flex-1 justify-center"
                                                        >
                                                            <Bookmark className="w-4 h-4" />
                                                            Réserver
                                                        </button>
                                                        <button 
                                                            onClick={() => handleShare(activity)}
                                                            className="flex items-center gap-2 bg-slate-700/80 text-slate-200 px-6 py-3 rounded-xl font-semibold border border-slate-600 hover:bg-slate-600 transition-all duration-300"
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                            Partager
                                                        </button>
                                                        {activity.upcomingAvailability && activity.upcomingAvailability.length > 3 && (
                                                            <button 
                                                                onClick={() => handleViewCalendar(activity.id)}
                                                                className="flex items-center gap-2 bg-slate-700/80 text-slate-200 px-6 py-3 rounded-xl font-semibold border border-slate-600 hover:bg-slate-600 transition-all duration-300"
                                                            >
                                                                <Calendar className="w-4 h-4" />
                                                                Plus de dates
                                                            </button>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => handleContactGuide(activity.guide.id, activity.id)}
                                                        className="w-full text-center text-purple-400 hover:text-purple-300 text-sm pt-2 transition-colors"
                                                    >
                                                        Contacter le guide pour plus d'informations
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <div className="bg-[#9B177E] border-y border-purple-500/30 mx-4 rounded-2xl text-white py-16 mb-8 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Prêt pour l'aventure ?
                    </h2>
                    <p className="text-md text-slate-300 mb-8 max-w-2xl mx-auto">
                        Rejoignez-nous pour des expériences uniques et créez des souvenirs inoubliables
                        dans les plus beaux paysages de notre région
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => {
                                if (user) {
                                    // Si l'utilisateur est connecté et est un professional
                                    if (user.role === 'professional') {
                                        navigate('/guide/dashboard'); // ← CHANGÉ ICI
                                    } else {
                                        navigate('/become-guide'); // ← CHANGÉ ICI
                                    }
                                } else {
                                    navigate('/login?redirect=/become-guide'); // ← CHANGÉ ICI
                                }
                            }}
                            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl"
                        >
                            {user?.role === 'professional' ? 'Tableau de bord guide' : 'Devenir guide'}
                        </button>
                        <button 
                            onClick={() => navigate('/activites/calendar')} // ← CHANGÉ ICI
                            className="bg-slate-800/80 text-slate-200 px-8 py-4 rounded-xl font-bold text-lg border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300"
                        >
                            Voir le calendrier complet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivitesLoisirsFAQ;