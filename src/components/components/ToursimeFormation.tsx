import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, Camera, Utensils, Palette, Music,
  BookOpen, Users, Clock, MapPin, Award, Star, Sparkles,
  Play, Heart, Share2, Bookmark, Search,
  BookAIcon,
  Plus,
  Minus
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

const FormationsFAQElegant: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Qu'est-ce que nos formations ?",
      answer: "Nos formations sont des programmes éducatifs spécialisés dans les métiers manuels et l'artisanat local. Nous proposons des programmes d'éducation formelle et des formations pratiques adaptées à tous les profils.",
      category: "Général",
      icon: <BookOpen className="w-6 h-6" />,
      image: "https://i.pinimg.com/736x/ba/fe/c4/bafec470227d663764fea23ed017265a.jpg",
      stats: {
        participants: "Taille variable",
        duration: "Programmes flexibles",
        level: "Tous niveaux"
      },
      features: ["Formation professionnelle", "Pratique intensive", "Instructeurs experts", "Certification"]
    },
    {
      id: 2,
      question: "Que puis-je attendre d'un de nos cours ?",
      answer: "Nos cours combinent connaissances théoriques et pratique intensive. Vous apprendrez les techniques fondamentales, travaillerez avec des outils professionnels et créerez vos propres projets sous guidance experte.",
      category: "Cours",
      icon: <Users className="w-6 h-6" />,
      image: "https://i.pinimg.com/736x/78/6e/5b/786e5b9e62c879d99649ae44830edee5.jpg",
      stats: {
        participants: "8-15 personnes",
        duration: "2-6 heures",
        level: "Débutant à Avancé"
      },
      features: ["Formation aux outils", "Projets pratiques", "Instruction sécurité", "Création à emporter"]
    },
    {
      id: 3,
      question: "Qui peut s'inscrire à nos formations ?",
      answer: "Nos formations sont ouvertes à tous, quel que soit le niveau d'expérience. Nous accueillons les débutants complets, les amateurs souhaitant améliorer leurs compétences et les professionnels cherchant une formation avancée. L'âge minimum requis est de 16 ans.",
      category: "Inscription",
      icon: <Award className="w-6 h-6" />,
      image: "https://i.pinimg.com/1200x/1d/6c/f2/1d6cf229ce62b2d379f0e0e998513406.jpg",
      stats: {
        participants: "Tous bienvenus",
        duration: "Options variées",
        level: "Aucune expérience requise"
      },
      features: ["16 ans et plus", "Tous niveaux", "Planning flexible", "Adapté aux débutants"]
    },
    {
      id: 4,
      question: "Quelle est l'expérience de nos formateurs ?",
      answer: "Nos formateurs sont des artisans experts avec au minimum 10 ans d'expérience professionnelle. Chaque formateur est non seulement compétent dans son domaine mais aussi formé aux méthodologies d'enseignement pour assurer un transfert de connaissances efficace.",
      category: "Instructeurs",
      icon: <Users className="w-6 h-6" />,
      image: "https://i.pinimg.com/736x/e0/73/ad/e073adcff9e524e5383a321a5b756b7e.jpg",
      stats: {
        participants: "Petits groupes",
        duration: "Années d'expérience",
        level: "Niveau expert"
      },
      features: ["10+ ans d'expérience", "Certifié enseignement", "Professionnels du secteur", "Mentors patients"]
    },
    {
      id: 5,
      question: "Nos formations sont-elles accréditées ?",
      answer: "Oui, nos formations sont entièrement accréditées par les organismes professionnels du secteur. Nos programmes de certification sont reconnus dans toute l'industrie et peuvent être utilisés pour le développement professionnel et l'avancement de carrière.",
      category: "Certification",
      icon: <Award className="w-6 h-6" />,
      image: "https://i.pinimg.com/736x/d0/fa/87/d0fa879e7157e3f19b9e9a45728729f0.jpg",
      stats: {
        participants: "Programmes certifiés",
        duration: "Formations accréditées",
        level: "Standard professionnel"
      },
      features: ["Entièrement accrédité", "Reconnaissance industrielle", "Avancement carrière", "Certification professionnelle"]
    },
    {
      id: 6,
      question: "Quels outils et matériaux sont fournis ?",
      answer: "Nous fournissons tous les outils, équipements et matériaux nécessaires pour chaque formation. Cela inclut l'équipement de sécurité, les outils spécialisés et les matériaux de qualité. Les participants n'ont besoin que d'apporter leur enthousiasme et leur volonté d'apprendre.",
      category: "Ressources",
      icon: <Palette className="w-6 h-6" />,
      image: "https://i.pinimg.com/736x/43/5b/d4/435bd425b8945b78d7e45a276fa808db.jpg",
      stats: {
        participants: "Entièrement équipé",
        duration: "Tout inclus",
        level: "Outils professionnels"
      },
      features: ["Tous outils fournis", "Matériaux qualité", "Équipement sécurité", "Aucun coût supplémentaire"]
    }
  ];

  // Calculer le nombre réel de FAQs par catégorie
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return faqs.length;
    const categoryName = categories.find(cat => cat.id === categoryId)?.name;
    return faqs.filter(faq => faq.category === categoryName).length;
  };

  const categories = [
    { id: 'all', name: 'Toutes', icon: <BookAIcon className="w-5 h-5" /> },
    { id: 'general', name: 'Général', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'cours', name: 'Cours', icon: <Users className="w-5 h-5" /> },
    { id: 'inscription', name: 'Inscription', icon: <Award className="w-5 h-5" /> },
    { id: 'instructeurs', name: 'Formateurs', icon: <Users className="w-5 h-5" /> },
    { id: 'certification', name: 'Certification', icon: <Award className="w-5 h-5" /> },
    { id: 'ressources', name: 'Ressources', icon: <Palette className="w-5 h-5" /> }
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
    <div className="min-h-screen bg-gradient-to-br to-blue-50/30">
      {/* Hero Section */}
      
      <div className="h-72  text-white py-20">
        <div className='absolute inset-0 h-72 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
            <img src="https://i.pinimg.com/1200x/91/01/6a/91016ac95b54c8a72d47945497fc1ddc.jpg" alt="" />
        </div>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="pt-5 text-2xl md:text-4xl font-bold mb-6">
            Questions &&nbsp;
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Réponses sur nos Formations
            </span>
          </h1>

          <p className="text-sm text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Tout ce que vous devez savoir sur nos formations, cours et ateliers locaux.<br />
            Des réponses claires, des visuels inspirants.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher des questions..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation par Catégories */}
      <div className=" px-2 mx-auto">
        <div className="grid grid-cols-3 lg:grid-cols-7 justify-center gap-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center justify-around gap-2 px-4 py-3 rounded-xl border transition-all duration-300 font-semibold ${activeCategory === category.id
                  ? 'bg-slate-900 text-white border-slate-600 shadow-lg'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:shadow-lg hover:text-blue-600'
                }`}
            >
              {category.icon}
              <span className='text-xs'>{category.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${activeCategory === category.id
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600'
                }`}>
                {getCategoryCount(category.id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section FAQ avec Images */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-3xl shadow-lg p-12 max-w-2xl mx-auto">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-700 mb-2">Aucune question trouvée</h3>
              <p className="text-slate-500">
                Essayez d'ajuster vos termes de recherche ou parcourez différentes catégories.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            {filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-100 overflow-hidden"
              >
                {/* Question - Toujours visible */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between px-8 py-5 text-left hover:bg-slate-100 transition-colors duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      {faq.icon}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <h3 className="text-xl pb-2 font-bold text-slate-700">
                        {faq.question}
                      </h3>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-semibold">
                          {faq.category}
                        </span>
                        <div className="flex items-center gap-4 text-slate-500 text-[10px]">
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
                    <Minus className="w-6 h-6 text-blue-500 flex-shrink-0 ml-4" />
                  ) : (
                    <Plus className="w-6 h-6 text-slate-400 flex-shrink-0 ml-4" />
                  )}
                </button>

                {/* Réponse avec Image - Visible quand ouvert */}
                {openFAQ === index && (
                  <div className="border-t border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                      {/* Colonne Image */}
                      <div className="space-y-4">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg">
                          <img
                            src={faq.image}
                            alt={faq.question}
                            className="w-full h-64  object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                          <div className="absolute bottom-4 left-4 text-white">
                            <span className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                              {faq.category}
                            </span>
                          </div>
                        </div>

                        {/* Features */}
                        {faq.features && (
                          <div className="grid grid-cols-2 gap-1">
                            {faq.features.map((feature, idx) => (
                              <div key={idx} className="bg-slate-900 gap-2 text-slate-100 font-bold py-1 flex items-center justify-center text-[10px] rounded-lg w-11/12">
                                {feature}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Colonne Texte */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-3">
                            Informations détaillées
                          </h4>
                          <p className="text-slate-700 leading-relaxed text-md text-justify">
                            {faq.answer}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                          <button className="flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                            <Bookmark className="w-4 h-4" />
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

      {/* CTA Section */}
      <div className="bg-white shadow-lg m-4 rounded-lg text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl text-slate-900 font-bold mb-4">
            Une question spécifique ?
          </h2>
          <p className="text-sm text-slate-800 mb-8 max-w-2xl mx-auto">
            Notre équipe est là pour vous aider à choisir la formation qui vous correspond
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-700 transition-colors">
              Nous contacter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationsFAQElegant;