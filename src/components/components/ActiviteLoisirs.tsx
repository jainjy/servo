import React, { useState } from 'react';
import {
    ChevronDown, ChevronUp, Camera, Utensils, Palette, Music,
    BookOpen, Users, Clock, MapPin, Award, Star, Sparkles,
    Play, Heart, Share2, Bookmark, Search,
    Bike, SwatchBook, CookingPot,
    Backpack, Shield, Highlighter,
    Mountain, Waves, TreePine, Tent, Compass,
    Map, Trophy, Zap, Sun, Moon
} from 'lucide-react';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    category: string;
    icon: React.ReactNode;
    image: string;
    stats?: {
        participants: string;
        duration: string;
        level: string;
    };
    features?: string[];
    highlight?: string;
}

const ActivitesLoisirsFAQ: React.FC = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const faqs: FAQItem[] = [
        {
            id: 1,
            question: "Quelles activités de plein air proposez-vous ?",
            answer: "Notre agence vous offre un large choix d'activités de plein air adaptées à tous les niveaux : randonnées guidées en montagne, VTT dans les sentiers forestiers, canoë-kayak sur les rivières locales, escalade initiatique, et bien plus. Chaque activité est encadrée par des guides diplômés qui partagent leur passion et leur connaissance du territoire.",
            category: "Plein Air",
            icon: <Mountain className="w-4 h-4" />,
            image: "https://i.pinimg.com/1200x/91/e7/61/91e761120ecac64ef8187e657d49243a.jpg",
            stats: {
                participants: "2-8 personnes",
                duration: "3-8 heures",
                level: "Tous niveaux"
            },
            features: ["Guide diplômé", "Matériel inclus", "Découverte nature", "Photos souvenirs"],
            highlight: "⭐ Activité la plus populaire"
        },
        {
            id: 2,
            question: "Comment se déroule une journée d'aventure ?",
            answer: "Une journée type commence par un briefing sécurité et la distribution du matériel. Ensuite, nous partons pour l'activité principale avec des pauses régulières pour admirer les paysages et prendre des photos. Un pique-nique local est inclus, préparé avec des produits régionaux. La journée se termine par un moment convivial autour d'un goûter typique.",
            category: "Aventure",
            icon: <Compass className="w-4 h-4" />,
            image: "https://i.pinimg.com/1200x/35/32/80/353280742f9436371cb969c51d62feb5.jpg",
            stats: {
                participants: "Petits groupes",
                duration: "Journée complète",
                level: "Accessible à tous"
            },
            features: ["Pique-nique inclus", "Guide photo", "Produits locaux", "Transport compris"]
        },
        {
            id: 3,
            question: "Y a-t-il des activités en soirée ?",
            answer: "Absolument ! Nous proposons des expériences nocturnes magiques : observation des étoiles avec télescope, randonnées au clair de lune, soirées contes autour du feu, et dégustations de produits locaux sous les étoiles. Ces moments créent des souvenirs inoubliables dans une ambiance unique.",
            category: "Nocturne",
            icon: <Moon className="w-4 h-4" />,
            image: "https://i.pinimg.com/736x/d3/aa/81/d3aa8108a58d0afa74cbc5cc917b621f.jpg",
            stats: {
                participants: "4-12 personnes",
                duration: "2-4 heures",
                level: "Familial"
            },
            features: ["Observation étoiles", "Ambiance feutrée", "Dégustation locale", "Moment magique"],
            highlight: "✨ Expérience unique"
        },
        {
            id: 4,
            question: "Proposez-vous des activités aquatiques ?",
            answer: "Oui, nous organisons diverses activités nautiques selon la saison : paddle sur les lacs alpins, baignade dans les gorges, pêche initiatique, et découverte de la faune aquatique. Toutes nos activités respectent l'environnement et sont encadrées par des moniteurs brevetés.",
            category: "Aquatique",
            icon: <Waves className="w-4 h-4" />,
            image: "https://i.pinimg.com/736x/c3/7d/bb/c37dbbd5da75fe7a956e189cbf996870.jpg",
            stats: {
                participants: "4-8 personnes",
                duration: "2-6 heures",
                level: "Débutant accepté"
            },
            features: ["Matériel fourni", "Moniteur breveté", "Sécurité maximale", "Environnement préservé"]
        },
        {
            id: 5,
            question: "Quelles activités en cas de mauvais temps ?",
            answer: "Pas de panique ! Nous avons des solutions alternatives : visite de caves de dégustation, ateliers artisanaux locaux (poterie, fromage), escape game thématisé, ou découverte des musées régionaux. Chaque activité d'intérieur est tout aussi passionnante et authentique.",
            category: "Intérieur",
            icon: <Tent className="w-4 h-4" />,
            image: "https://i.pinimg.com/1200x/41/92/dd/4192dd706c513e89390271780c3577ab.jpg",
            stats: {
                participants: "2-10 personnes",
                duration: "2-5 heures",
                level: "Tous publics"
            },
            features: ["Plan B assuré", "Activités culturelles", "Artisans locaux", "Dégustations incluses"]
        },
        {
            id: 6,
            question: "Proposez-vous des activités familiales ?",
            answer: "Spécialement conçues pour les familles, nos activités mêlent aventure et pédagogie : chasse au trésor nature, initiation à l'orientation, découverte de la faune locale, ateliers créatifs en plein air. Les enfants repartent avec des souvenirs magiques et de nouvelles connaissances !",
            category: "Famille",
            icon: <TreePine className="w-4 h-4" />,
            image: "https://i.pinimg.com/736x/5a/3d/ec/5a3dec4079607dc09653197662975eef.jpg",
            stats: {
                participants: "Familles",
                duration: "2-4 heures",
                level: "Enfants bienvenus"
            },
            features: ["Adapté enfants", "Pédagogie ludique", "Sécurité optimale", "Souvenirs créatifs"],
            highlight: "👨‍👩‍👧‍👦 Parfait en famille"
        },
        {
            id: 7,
            question: "Y a-t-il des défis sportifs ?",
            answer: "Pour les plus sportifs, nous organisons des challenges : trail découverte, via ferrata, descente en rappel, ou parcours aventure dans les arbres. Ces activités demandent une bonne condition physique mais restent accessibles avec notre encadrement professionnel.",
            category: "Sportif",
            icon: <Trophy className="w-4 h-4" />,
            image: "https://i.pinimg.com/736x/8a/3b/d8/8a3bd8d9a5d4e7b4e5a8c6e3f7b2a1e5.jpg",
            stats: {
                participants: "2-6 personnes",
                duration: "4-6 heures",
                level: "Sportif requis"
            },
            features: ["Challenge personnel", "Encadrement expert", "Matériel technique", "Photos action"]
        },
        {
            id: 8,
            question: "Des activités bien-être en nature ?",
            answer: "Détendez-vous avec nos expériences bien-être : yoga en pleine nature, méditation guidée au bord d'un lac, bain de forêt (shinrin-yoku), ou relaxation sonore avec les bruits de la nature. Un véritable ressourcement pour le corps et l'esprit.",
            category: "Bien-être",
            icon: <Zap className="w-4 h-4" />,
            image: "https://i.pinimg.com/736x/9f/8a/dc/9f8adc7a8b5e6c7a3e4f5b8c9a6d7e8f.jpg",
            stats: {
                participants: "2-8 personnes",
                duration: "2-3 heures",
                level: "Débutant bienvenu"
            },
            features: ["Professionnel wellness", "Cadre préservé", "Pratique douce", "Ressourcement garanti"]
        }
    ];

    const getCategoryCount = (categoryId: string) => {
        if (categoryId === 'all') return faqs.length;
        const categoryName = categories.find(cat => cat.id === categoryId)?.name;
        return faqs.filter(faq => faq.category === categoryName).length;
    };

    const categories = [
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

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesCategory = true;
        if (activeCategory !== 'all') {
            const categoryName = categories.find(cat => cat.id === activeCategory)?.name;
            matchesCategory = faq.category === categoryName;
        }

        return matchesSearch && matchesCategory;
    });

    const getCategoryColor = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.color : 'from-gray-500 to-gray-600';
    };

    return (
        <div className="min-h-screen mt-16 text-gray-100 bg-white">
            {/* Hero Section */}
            <div className="relative py-8 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-br from-purple-600/20 to-orange-500/20"></div>
                    <img
                        src="https://i.pinimg.com/736x/fa/05/b9/fa05b9dba51cec6eb5e7441b75d0c153.jpg"
                        className='w-full h-full object-cover'
                        alt=""
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
                    <div className="flex justify-center gap-4 mt-8">
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
                </div>
            </div>

            {/* Navigation par Catégories */}
            <div className="px-4 mx-auto mb-16">
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((category) => (
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

            {/* Section FAQ */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                {filteredFaqs.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-slate-800/50 rounded-2xl shadow-lg p-12 max-w-md mx-auto border-2 border-purple-500/30 backdrop-blur-sm">
                            <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-slate-200 mb-3">Aucune activité trouvée</h3>
                            <p className="text-slate-400 text-lg">
                                Essayez d'autres termes ou explorez nos catégories !
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredFaqs.map((faq, index) => (
                            <div
                                key={faq.id}
                                className="bg-slate-800 border-2 border-purple-500/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-purple-500/40 backdrop-blur-sm"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-8 text-left hover:bg-slate-700/30 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(activeCategory)} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                            {faq.icon}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center gap-4 mb-2">
                                                <h3 className="text-xl font-bold text-white">
                                                    {faq.question}
                                                </h3>
                                                {faq.highlight && (
                                                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                        {faq.highlight}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="bg-slate-700/80 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold border border-purple-500/30">
                                                    {faq.category}
                                                </span>
                                                <div className="flex items-center gap-6 text-slate-400 text-sm">
                                                    {faq.stats && (
                                                        <>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-4 h-4 text-green-400" />
                                                                <span className="font-semibold">{faq.stats.participants}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-orange-400" />
                                                                <span className="font-semibold">{faq.stats.duration}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Award className="w-4 h-4 text-yellow-400" />
                                                                <span className="font-semibold">{faq.stats.level}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {openFAQ === index ? (
                                        <ChevronUp className="w-6 h-6 text-purple-400" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-slate-400" />
                                    )}
                                </button>

                                {openFAQ === index && (
                                    <div className="border-t border-purple-500/20">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                                            <div className="space-y-6">
                                                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                                    <img
                                                        src={faq.image}
                                                        alt={faq.question}
                                                        className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute bottom-4 left-4">
                                                        <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                                                            📍 {faq.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                {faq.features && (
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {faq.features.map((feature, idx) => (
                                                            <div key={idx} className="bg-slate-700/80 text-slate-200 px-4 py-3 rounded-xl text-sm font-medium border border-slate-600 text-center">
                                                                {feature}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                        <Sparkles className="w-5 h-5 text-yellow-400" />
                                                        Détails de l'expérience
                                                    </h4>
                                                    <p className="text-slate-300 text-lg leading-relaxed">
                                                        {faq.answer}
                                                    </p>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button className="flex items-center gap-2 bg-[#9B177E] text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
                                                        <Bookmark className="w-4 h-4" />
                                                        Réserver
                                                    </button>
                                                    <button className="flex items-center gap-2 bg-slate-700/80 text-slate-200 px-6 py-3 rounded-xl font-semibold border border-slate-600 hover:bg-slate-600 transition-all duration-300">
                                                        <Share2 className="w-4 h-4" />
                                                        Partager
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
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
                        <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl">
                             Contacter un guide
                        </button>
                        <button className="bg-slate-800/80 text-slate-200 px-8 py-4 rounded-xl font-bold text-lg border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300">
                             Voir le calendrier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivitesLoisirsFAQ;