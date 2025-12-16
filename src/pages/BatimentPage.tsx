import React, { useState, useMemo } from "react";
import { 
  MapPin, 
  HardHat, 
  Home, 
  Layers, 
  Calendar, 
  Phone, 
  Search, 
  Filter, 
  DollarSign,
  Mail,
  User,
  MessageSquare,
  X,
  ChevronDown,
  Star,
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export interface ServiceItem {
  id: string;
  title: string;
  short: string;
  description: string;
  category: "Génie civil" | "Electricité" | "Plomberie" | "Rénovation" | "Aménagement" | "Autre";
  priceFrom?: number;
  location?: string;
  duration?: string;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  tags?: string[];
}

// Données simulées étendues
const SERVICES: ServiceItem[] = [
  {
    id: "s1",
    title: "Construction de bâtiments résidentiels",
    short: "Maisons individuelles, immeubles résidentiels",
    description: "Conception et construction clef en main : fondations, structure, charpente, finitions. Gestion de A à Z avec respect des normes. Notre équipe d'experts vous accompagne de l'étude de faisabilité à la livraison.",
    category: "Génie civil",
    priceFrom: 150000,
    location: "National",
    duration: "6-24 mois",
    rating: 4.8,
    reviews: 124,
    featured: true,
    tags: ["Fondations", "Structure", "Charpente", "Finitions"]
  },
  {
    id: "s2",
    title: "Installations électriques industrielles",
    short: "Tableaux, câblage et automatisation",
    description: "Installation et maintenance des réseaux électriques, mise en place de tableaux électriques et solutions d'automatisation industrielles. Certification NF C15-100 et conformité aux normes internationales.",
    category: "Electricité",
    priceFrom: 30000,
    location: "Grandes villes",
    duration: "2-8 semaines",
    rating: 4.6,
    reviews: 89,
    tags: ["Tableaux", "Câblage", "Automatisation", "Maintenance"]
  },
  {
    id: "s3",
    title: "Plomberie et assainissement",
    short: "Réseaux d'eau, évacuations, traitement des eaux",
    description: "Pose, entretien et réparation des systèmes de plomberie pour logements et locaux commerciaux. Solutions d'assainissement individuelles et collectives avec garantie décennale.",
    category: "Plomberie",
    priceFrom: 2000,
    location: "Local",
    duration: "1-3 jours",
    rating: 4.9,
    reviews: 156,
    featured: true,
    tags: ["Réseaux eau", "Évacuations", "Assainissement", "Dépannage"]
  },
  {
    id: "s4",
    title: "Rénovation intérieure complète",
    short: "Cuisine, salles de bain, revêtements",
    description: "Rénovations partielles ou totales : design, démolition contrôlée, plomberie, électricité et finitions. Conseil en aménagement et optimisation des espaces.",
    category: "Rénovation",
    priceFrom: 15000,
    location: "National",
    duration: "2-12 semaines",
    rating: 4.7,
    reviews: 203,
    tags: ["Cuisine", "Salle de bain", "Revêtements", "Design"]
  },
  {
    id: "s5",
    title: "Aménagement paysager et extérieur",
    short: "Clôtures, terrasses, voirie légère",
    description: "Aménagement d'espaces extérieurs : dallages, terrasses, clôtures, petits ouvrages de voirie et drainage. Création d'espaces verts et installation de systèmes d'arrosage.",
    category: "Aménagement",
    priceFrom: 5000,
    location: "Local",
    duration: "1-4 semaines",
    rating: 4.5,
    reviews: 78,
    tags: ["Terrasses", "Clôtures", "Paysage", "Voirie"]
  },
  {
    id: "s6",
    title: "Gestion de projet et maîtrise d'œuvre",
    short: "Pilotage, planning et coordination",
    description: "Direction de projet, coordination des corps de métier, suivi qualité et respect des délais et budgets. Interface unique pour tous vos projets de construction.",
    category: "Autre",
    priceFrom: 10000,
    location: "National",
    duration: "Variable",
    rating: 4.9,
    reviews: 67,
    tags: ["Gestion", "Coordination", "Planning", "Qualité"]
  },
  {
    id: "s7",
    title: "Isolation thermique et acoustique",
    short: "Isolation complète bâtiments",
    description: "Solutions d'isolation performantes pour améliorer le confort et réduire les consommations énergétiques. Matériaux écologiques et certifiés.",
    category: "Rénovation",
    priceFrom: 8000,
    location: "National",
    duration: "1-3 semaines",
    rating: 4.4,
    reviews: 92,
    tags: ["Isolation", "Énergie", "Confort", "Écologique"]
  },
  {
    id: "s8",
    title: "Installation panneaux solaires",
    short: "Énergie renouvelable photovoltaïque",
    description: "Installation de systèmes photovoltaïques pour particuliers et professionnels. Étude de rentabilité et aides financières incluses.",
    category: "Electricité",
    priceFrom: 12000,
    location: "Grandes villes",
    duration: "2-4 semaines",
    rating: 4.8,
    reviews: 114,
    featured: true,
    tags: ["Solaire", "Énergie", "Photovoltaïque", "Renouvelable"]
  },
  {
    id: "s9",
    title: "Construction ossature bois",
    short: "Bâtiments écologiques en bois",
    description: "Construction de maisons et bâtiments en ossature bois. Solutions durables et esthétiques avec des matériaux naturels.",
    category: "Génie civil",
    priceFrom: 180000,
    location: "National",
    duration: "4-12 mois",
    rating: 4.7,
    reviews: 56,
    tags: ["Bois", "Écologique", "Durable", "Naturel"]
  }
];

const CATEGORY_ICONS = {
  "Génie civil": Layers,
  "Electricité": HardHat,
  "Plomberie": Home,
  "Rénovation": Home,
  "Aménagement": MapPin,
  "Autre": Calendar,
} as const;

const CATEGORY_COLORS = {
  "Génie civil": "bg-orange-100 text-orange-600 border-orange-200",
  "Electricité": "bg-blue-100 text-blue-600 border-blue-200",
  "Plomberie": "bg-cyan-100 text-cyan-600 border-cyan-200",
  "Rénovation": "bg-emerald-100 text-emerald-600 border-emerald-200",
  "Aménagement": "bg-lime-100 text-lime-600 border-lime-200",
  "Autre": "bg-purple-100 text-purple-600 border-purple-200",
} as const;

// Composant Modal pour les détails
const ServiceModal: React.FC<{
  service: ServiceItem;
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote: (service: ServiceItem) => void;
}> = ({ service, isOpen, onClose, onRequestQuote }) => {
  if (!isOpen) return null;

  const IconComponent = CATEGORY_ICONS[service.category];
  const categoryColor = CATEGORY_COLORS[service.category];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${categoryColor}`}>
                <IconComponent size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{service.title}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                  {service.category}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600">{service.description}</p>
            </div>
            
            <div className="space-y-3">
              {service.priceFrom && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Prix à partir de :</span>
                  <span className="font-bold text-lg text-slate-900">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(service.priceFrom)}
                  </span>
                </div>
              )}
              
              {service.duration && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Durée estimée :</span>
                  <span className="font-medium text-slate-900">{service.duration}</span>
                </div>
              )}
              
              {service.location && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Zone d'intervention :</span>
                  <span className="font-medium text-slate-900">{service.location}</span>
                </div>
              )}
              
              {service.rating && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Note clients :</span>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="font-medium text-slate-900">{service.rating}</span>
                    <span className="text-slate-500 text-sm">({service.reviews} avis)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {service.tags && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Compétences associées</h3>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => onRequestQuote(service)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              Demander un devis
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Modal pour la demande de devis
const QuoteModal: React.FC<{
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ service, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    deadline: "",
    budget: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi
    // console.log("Demande de devis envoyée:", { service, ...formData });
    alert("Votre demande de devis a été envoyée avec succès ! Nous vous recontacterons dans les 24h.");
    onSubmit(formData);
    setFormData({ name: "", email: "", phone: "", message: "", deadline: "", budget: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Demande de devis</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {service && (
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-slate-900 mb-1">{service.title}</h3>
              <p className="text-sm text-slate-600">{service.short}</p>
            </div>
          )}

          <form
  onSubmit={handleSubmit}
  className="space-y-5 max-h-[70vh] overflow-y-auto px-1"
>
  {/* Nom complet */}
  <div className="space-y-1">
    <label className="block text-sm font-medium text-slate-700">
      Nom complet *
    </label>
    <div className="relative">
      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
        placeholder="Votre nom complet"
      />
    </div>
  </div>

  {/* Email */}
  <div className="space-y-1">
    <label className="block text-sm font-medium text-slate-700">
      Email *
    </label>
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
        placeholder="exemple@email.com"
      />
    </div>
  </div>

  {/* Téléphone */}
  <div className="space-y-1">
    <label className="block text-sm font-medium text-slate-700">
      Téléphone *
    </label>
    <div className="relative">
      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="tel"
        required
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
        placeholder="01 23 45 67 89"
      />
    </div>
  </div>

  {/* Délai */}
  <div className="space-y-1">
    <label className="block text-sm font-medium text-slate-700">
      Délai souhaité
    </label>
    <select
      value={formData.deadline}
      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
    >
      <option value="">Sélectionnez un délai</option>
      <option value="urgent">Urgent (sous 1 mois)</option>
      <option value="1-3months">1-3 mois</option>
      <option value="3-6months">3-6 mois</option>
      <option value="flexible">Flexible</option>
    </select>
  </div>

  {/* Budget */}
  <div className="space-y-1">
    <label className="block text-sm font-medium text-slate-700">
      Budget estimé
    </label>
    <div className="relative">
      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text"
        value={formData.budget}
        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
        placeholder="Budget approximatif"
      />
    </div>
  </div>

  {/* Message */}
  <div className="space-y-1">
    <label className="block text-sm font-medium text-slate-700">
      Message supplémentaire
    </label>
    <textarea
      value={formData.message}
      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      rows={4}
      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
      placeholder="Décrivez votre projet..."
    />
  </div>

  {/* Bouton */}
  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition flex items-center justify-center gap-2"
  >
    <CheckCircle size={18} />
    Envoyer la demande
  </button>
</form>

        </div>
      </div>
    </div>
  );
};

export default function ConstructionServicesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Tous");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteService, setQuoteService] = useState<ServiceItem | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const categories = useMemo(() => ["Tous", ...Array.from(new Set(SERVICES.map((s) => s.category)))], []);

  const filtered = useMemo(() => {
    return SERVICES.filter((s) => {
      if (category !== "Tous" && s.category !== category) return false;
      if (minPrice !== "" && s.priceFrom && s.priceFrom < Number(minPrice)) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.short.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    });
  }, [query, category, minPrice]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleServiceDetails = (service: ServiceItem) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleRequestQuote = (service: ServiceItem) => {
    setQuoteService(service);
    setIsQuoteModalOpen(true);
    setIsModalOpen(false);
  };

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  const handleQuoteSubmit = (formData: any) => {
    // Simulation d'envoi à une API
    // console.log("Devis soumis:", { service: quoteService, ...formData });
    // Ici vous ajouteriez l'appel API réel
  };

  const handleContactSubmit = (formData: any) => {
    // console.log("Contact soumis:", formData);
    alert("Votre message a été envoyé ! Nous vous recontacterons rapidement.");
    setShowContactModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-slate-600">Services Professionnels</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Nos Services de <span className="text-blue-600">Construction</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Découvrez notre gamme complète de services de construction, de la conception à la réalisation
          </p>
        </header>

        {/* Search and Filters */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Search Input */}
              <div className="lg:col-span-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rechercher un service
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ex: électricité, rénovation, plomberie..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:col-span-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Catégorie
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Filter */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Prix minimum
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="number"
                    min={0}
                    value={minPrice === "" ? "" : String(minPrice)}
                    onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Prix min"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            {filtered.length} service{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleContactClick}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 transition-colors font-medium"
            >
              <Phone size={18} /> Nous contacter
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {filtered.map((service) => {
            const IconComponent = CATEGORY_ICONS[service.category];
            const categoryColor = CATEGORY_COLORS[service.category];
            
            return (
              <article 
                key={service.id} 
                className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {service.featured && (
                  <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 text-center">
                    Service Populaire
                  </div>
                )}
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${categoryColor} border`}>
                      <IconComponent size={24} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                      {service.category}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 mb-3 font-medium">
                    {service.short}
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Rating */}
                  {service.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400 fill-current" size={16} />
                        <span className="text-sm font-medium text-slate-900">{service.rating}</span>
                      </div>
                      <span className="text-sm text-slate-500">({service.reviews} avis)</span>
                      {service.duration && (
                        <>
                          <span className="text-slate-300">•</span>
                          <div className="flex items-center gap-1 text-slate-500 text-sm">
                            <Clock size={14} />
                            {service.duration}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {service.tags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {service.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {service.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                          +{service.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="font-bold text-slate-900">
                        {service.priceFrom ? `À partir de ${formatPrice(service.priceFrom)}` : "Tarif sur demande"}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                        <MapPin size={14} />
                        {service.location}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleServiceDetails(service)}
                        className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-1"
                      >
                        Détails <ChevronDown size={14} />
                      </button>
                      <button 
                        onClick={() => handleRequestQuote(service)}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium flex items-center gap-1"
                      >
                        Devis <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun service trouvé</h3>
            <p className="text-slate-600 mb-6">
              Aucun service ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
            </p>
            <button 
              onClick={() => { setQuery(""); setCategory("Tous"); setMinPrice(""); }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-slate-200">
          <p className="text-slate-600">
            © {new Date().getFullYear()} ConstructPro • Tous droits réservés
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Des solutions de construction innovantes depuis 2010
          </p>
        </footer>
      </div>

      {/* Modals */}
      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRequestQuote={handleRequestQuote}
      />

      <QuoteModal
        service={quoteService}
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        onSubmit={handleQuoteSubmit}
      />

      {/* Modal de contact général */}
      {showContactModal && (
        <QuoteModal
          service={null}
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          onSubmit={handleContactSubmit}
        />
      )}
    </div>
  );
}