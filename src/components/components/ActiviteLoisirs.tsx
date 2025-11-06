import React, { useState } from 'react';
import {
    ChevronDown, ChevronUp, Camera, Utensils, Palette, Music,
    BookOpen, Users, Clock, MapPin, Award, Star, Sparkles,
    Play, Heart, Share2, Bookmark, Search,
    BookAIcon, Bike, SwatchBook, CookingPot,
    Backpack,
    Shield,
    Highlighter
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
}

const ActivitesLoisirsFAQ: React.FC = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const faqs: FAQItem[] = [
        {
            id: 1,
            question: "Qu'est-ce que nos activités & loisirs ?",
            answer: "Nos activités et loisirs sont conçus pour vous faire découvrir de nouvelles passions et vivre des aventures uniques. Que vous soyez débutant ou expérimenté, nous proposons des expériences variées adaptées à tous les goûts.",
            category: "Général",
            icon: <Highlighter className="w-4 h-4" />,
            image: "https://i.pinimg.com/736x/09/2e/fe/092efe462f2d3718e447d5d0e0c920d4.jpg",
            stats: {
                participants: "Groupes variés",
                duration: "2-8 heures",
                level: "Tous niveaux"
            },
            features: ["Encadrement pro", "Matériel fourni", "Découverte locale", "Ambiance conviviale"]
        },
        {
            id: 2,
            question: "Que comprend une activité typique ?",
            answer: "Chaque activité commence par une présentation et une initiation aux bases. Ensuite, place à la pratique ! Nos animateurs vous accompagnent tout au long de l'expérience pour vous garantir sécurité et plaisir. Chaque session se termine par un moment de partage et de retour d'expérience.",
            category: "Activités",
            icon: <Bike className="w-4 h-4" />,
            image: "https://i.pinimg.com/1200x/35/32/80/353280742f9436371cb969c51d62feb5.jpg",
            stats: {
                participants: "8-12 personnes",
                duration: "3-5 heures",
                level: "Débutant à Intermédiaire"
            },
            features: ["Initiation complète", "Pratique encadrée", "Sécurité assurée", "Souvenirs mémorables"]
        },
        {
            id: 3,
            question: "Qui peut participer à ces activités ?",
            answer: "Nos activités sont accessibles à tous à partir de 12 ans. Aucune expérience préalable n'est nécessaire pour la plupart de nos propositions. Nous adaptons le niveau de difficulté en fonction des participants pour garantir une expérience agréable à chacun.",
            category: "Participation",
            icon: <Users className="w-4 h-4" />,
            image: "https://i.pinimg.com/736x/d3/aa/81/d3aa8108a58d0afa74cbc5cc917b621f.jpg",
            stats: {
                participants: "12 ans et plus",
                duration: "Adaptable",
                level: "Accessible à tous"
            },
            features: ["À partir de 12 ans", "Aucun prérequis", "Niveaux adaptés", "Accueil bienveillant"]
        },
        {
            id: 4,
            question: "Qui sont nos animateurs ?",
            answer: "Nos animateurs sont des passionnés expérimentés, formés aux techniques d'animation et de sécurité. Chaque animateur possède une expertise spécifique dans son domaine et une réelle passion pour le partage et la transmission.",
            category: "Encadrement",
            icon: <Award className="w-4 h-4" />,
            image: "https://i.pinimg.com/736x/c3/7d/bb/c37dbbd5da75fe7a956e189cbf996870.jpg",
            stats: {
                participants: "Petits groupes",
                duration: "Expérience confirmée",
                level: "Animateurs diplômés"
            },
            features: ["Diplômes requis", "Passion communicatrice", "Expertise terrain", "Pédagogie adaptée"]
        },
        {
            id: 5,
            question: "Les activités sont-elles assurées ?",
            answer: "Oui, toutes nos activités sont couvertes par une assurance responsabilité civile professionnelle. De plus, nous respectons strictement les normes de sécurité en vigueur pour chaque type d'activité proposée.",
            category: "Sécurité",
            icon: <Shield className="w-4 h-4" />,
            image: "https://i.pinimg.com/1200x/41/92/dd/4192dd706c513e89390271780c3577ab.jpg",
            stats: {
                participants: "Activités sécurisées",
                duration: "Normes respectées",
                level: "Assurance incluse"
            },
            features: ["Assurance RC", "Normes sécurité", "Équipements vérifiés", "Encadrement qualifié"]
        },
        {
            id: 6,
            question: "Quel équipement est fourni ?",
            answer: "Nous fournissons tout l'équipement technique nécessaire à la pratique de l'activité. Vous n'avez qu'à prévoir une tenue adaptée à l'activité et aux conditions météo. Une liste de recommandations vous est communiquée avant chaque réservation.",
            category: "Équipement",
            icon: <Backpack className="w-4 h-4" />,
            image: "https://i.pinimg.com/736x/5a/3d/ec/5a3dec4079607dc09653197662975eef.jpg",
            stats: {
                participants: "Matériel pro",
                duration: "Tout inclus",
                level: "Qualité garantie"
            },
            features: ["Équipement fourni", "Qualité professionnelle", "Entretien régulier", "Adapté à l'activité"]
        }
    ];

    // Calculer le nombre réel de FAQs par catégorie
    const getCategoryCount = (categoryId: string) => {
        if (categoryId === 'all') return faqs.length;
        const categoryName = categories.find(cat => cat.id === categoryId)?.name;
        return faqs.filter(faq => faq.category === categoryName).length;
    };

    const categories = [
        { id: 'all', name: 'Toutes', icon: <Highlighter className="w-4 h-4" /> },
        { id: 'general', name: 'Général', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'activites', name: 'Activités', icon: <Bike className="w-4 h-4" /> },
        { id: 'participation', name: 'Participation', icon: <Users className="w-4 h-4" /> },
        { id: 'encadrement', name: 'Encadrement', icon: <Award className="w-4 h-4" /> },
        { id: 'securite', name: 'Sécurité', icon: <Shield className="w-4 h-4" /> },
        { id: 'equipement', name: 'Équipement', icon: <Backpack className="w-4 h-4" /> }
    ];

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    // Filter FAQs based on search and category
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

    return (
        <div className="min-h-screen mt-20 text-gray-100">
            {/* Hero Section - Compact, dark, no gradient */}
            <div className="py-12">
                <div className='absolute inset-0 h-72 -z-10 w-full overflow-hidden'>
                    <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
                    <img src="https://i.pinimg.com/736x/dc/1c/63/dc1c635dc718785a7ef7bc2b05a47792.jpg" alt="" />
                </div>
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-2xl md:text-4xl font-bold mb-4">
                        Activités &nbsp;
                        <span className="text-blue-400">& Loisirs</span>
                    </h1>
                    <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Découvertes & aventures - Tout ce que vous devez savoir sur nos activités de loisirs.<br />
                        Des réponses claires, des expériences inoubliables.
                    </p>
                </div>
            </div>

            {/* Search Bar - Compact, dark */}
            <div className="max-w-2xl mx-auto px-4 -mt-4 mb-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher des questions..."
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm text-gray-100 placeholder-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Navigation par Catégories - Compact buttons, dark, square-ish */}
            <div className="px-4 mx-auto mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-md border transition-colors duration-200 font-medium text-xs shadow-sm ${activeCategory === category.id
                                    ? 'bg-slate-700 text-white border-blue-500 shadow-blue-500/25'
                                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-blue-600 hover:text-blue-300 hover:bg-slate-750'
                                }`}
                        >
                            {category.icon}
                            <span>{category.name}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${activeCategory === category.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-slate-700 text-slate-400'
                                }`}>
                                {getCategoryCount(category.id)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Section FAQ avec Images - Smaller cards, dark, sharp edges */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {filteredFaqs.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="bg-slate-800 rounded-lg shadow-sm p-8 max-w-md mx-auto border border-slate-700">
                            <Search className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">Aucune question trouvée</h3>
                            <p className="text-slate-500 text-sm">
                                Essayez d'ajuster vos termes de recherche ou parcourez différentes catégories.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredFaqs.map((faq, index) => (
                            <div
                                key={faq.id}
                                className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                {/* Question - Compact */}
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-750 transition-colors duration-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-blue-400 flex-shrink-0">
                                            {faq.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-semibold text-slate-200">
                                                {faq.question}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="bg-blue-900 text-blue-300 px-2 py-0.5 rounded text-xs font-medium">
                                                    {faq.category}
                                                </span>
                                                <div className="flex items-center gap-3 text-slate-500 text-xs">
                                                    {faq.stats && (
                                                        <>
                                                            <div className="flex items-center gap-1">
                                                                <Users className="w-3 h-3" />
                                                                {faq.stats.participants}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {faq.stats.duration}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Award className="w-3 h-3" />
                                                                {faq.stats.level}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {openFAQ === index ? (
                                        <ChevronUp className="w-4 h-4 text-blue-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-slate-500" />
                                    )}
                                </button>

                                {/* Réponse avec Image - Compact layout */}
                                {openFAQ === index && (
                                    <div className="border-t border-slate-700">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                            {/* Colonne Image - Smaller */}
                                            <div className="space-y-3">
                                                <div className="relative rounded overflow-hidden shadow-sm">
                                                    <img
                                                        src={faq.image}
                                                        alt={faq.question}
                                                        className="w-full h-40 object-cover"
                                                    />
                                                    <div className="absolute bottom-2 left-2">
                                                        <span className="bg-slate-900/80 text-slate-300 px-2 py-0.5 rounded text-xs">
                                                            {faq.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Features - Compact chips */}
                                                {faq.features && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {faq.features.map((feature, idx) => (
                                                            <div key={idx} className="bg-slate-700 text-slate-300 px-2 py-1 text-xs rounded font-medium">
                                                                {feature}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Colonne Texte - Compact */}
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-200 mb-2">
                                                        Informations détaillées
                                                    </h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed">
                                                        {faq.answer}
                                                    </p>
                                                </div>

                                                {/* Actions - Smaller buttons */}
                                                <div className="flex gap-2">
                                                    <button className="flex items-center gap-1 text-slate-400 text-xs px-4 py-1.5 rounded border border-slate-600 hover:bg-slate-750 transition-colors">
                                                        <Bookmark className="w-3 h-3" />
                                                        Sauvegarder
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

            {/* CTA Section - Dark, compact */}
            <div className="bg-slate-800 border-t border-slate-700 m-4 rounded-lg text-slate-100 py-8">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <h2 className="text-xl font-semibold text-slate-200 mb-3">
                        Une question sur nos activités ?
                    </h2>
                    <p className="text-sm text-slate-400 mb-6">
                        Notre équipe est là pour vous conseiller et vous aider à choisir l'aventure qui vous correspond
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button className="bg-slate-700 text-slate-100 px-6 py-2 rounded-md font-medium text-sm hover:bg-slate-600 transition-colors">
                            Nous contacter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivitesLoisirsFAQ;