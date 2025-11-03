import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Store,
  Palette,
  Truck,
  MapPin,
  Plus,
  Mail,
  Phone,
  Star,
  ExternalLink,
  X,
} from "lucide-react";

const ArtCommerce = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showContactForm, setShowContactForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const categories = [
    {
      id: "all",
      name: "Tous",
      icon: Store,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      id: "peinture",
      name: "Peintures",
      icon: Palette,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      id: "sculpture",
      name: "Sculptures",
      icon: Palette,
      color: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
    {
      id: "artisanat",
      name: "Artisanat",
      icon: Store,
      color: "bg-gradient-to-r from-amber-500 to-orange-500",
    },
    {
      id: "boutique",
      name: "Boutiques",
      icon: Store,
      color: "bg-gradient-to-r from-rose-500 to-red-500",
    },
  ];

  const listings = [
    {
      id: 1,
      title: "Galerie d'Art Tropical",
      category: "peinture",
      location: "Saint-Denis, La Réunion",
      price: "39€/mois",
      image:
        "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      hasWebsite: true,
      delivery: true,
      description:
        "Galerie d'art spécialisée dans les œuvres tropicales et locales. Nous mettons en valeur les artistes réunionnais.",
      contact: {
        phone: "+262 692 123 456",
        email: "contact@galerietropical.re",
      },
      rating: 4.8,
      reviews: 24,
    },
    {
      id: 2,
      title: "Atelier Sculpture Bois",
      category: "sculpture",
      location: "Saint-Pierre, La Réunion",
      price: "39€/mois",
      image:
        "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      hasWebsite: false,
      delivery: true,
      description:
        "Sculptures sur bois authentiques réalisées par des artisans locaux avec des essences de La Réunion.",
      contact: {
        phone: "+262 693 456 789",
        email: "atelier@sculpturebois.re",
      },
      rating: 4.6,
      reviews: 18,
    },
    {
      id: 3,
      title: "Boutique Artisanale Saint-Paul",
      category: "artisanat",
      location: "Saint-Paul, La Réunion",
      price: "39€/mois",
      image:
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      hasWebsite: true,
      delivery: false,
      description:
        "Artisanat local : vannerie, broderie, et créations uniques des artisans réunionnais.",
      contact: {
        phone: "+262 262 456 123",
        email: "artisanat@stpaul.re",
      },
      rating: 4.9,
      reviews: 32,
    },
    {
      id: 4,
      title: "Espace Création Moderne",
      category: "peinture",
      location: "Saint-Gilles, La Réunion",
      price: "39€/mois",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80",
      hasWebsite: true,
      delivery: true,
      description:
        "Œuvres contemporaines et abstraites dans un espace dédié à l'art moderne réunionnais.",
      contact: {
        phone: "+262 693 789 123",
        email: "contact@espacecreation.re",
      },
      rating: 4.7,
      reviews: 19,
    },
    {
      id: 5,
      title: "Galerie Couleurs Locales",
      category: "artisanat",
      location: "Le Tampon, La Réunion",
      price: "39€/mois",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      hasWebsite: false,
      delivery: true,
      description:
        "Artisanat traditionnel aux couleurs vives de l'île de La Réunion.",
      contact: {
        phone: "+262 262 567 890",
        email: "couleurs@local.re",
      },
      rating: 4.5,
      reviews: 27,
    },
    {
      id: 6,
      title: "Atelier Lumière et Forme",
      category: "sculpture",
      location: "Saint-Leu, La Réunion",
      price: "39€/mois",
      image:
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80",
      hasWebsite: true,
      delivery: false,
      description:
        "Sculptures métalliques et installations artistiques jouant avec la lumière tropicale.",
      contact: {
        phone: "+262 692 234 567",
        email: "lumiere@forme.re",
      },
      rating: 4.8,
      reviews: 15,
    },
  ];

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactClick = () => {
    setShowContactForm(true);
  };

  const handleAddCommerce = () => {
    setShowAddForm(true);
  };

  const ContactForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-200 relative">
        {/* Bouton de fermeture */}
        <button
          onClick={() => setShowContactForm(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center pr-8">
          <Mail className="h-5 w-5 mr-2 text-blue-600" />
          Contactez-nous
        </h3>
        <form className="space-y-4">
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">
              Nom
            </label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              rows="4"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Votre message..."
            ></textarea>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowContactForm(false)}
              className="flex-1 bg-gray-200 text-slate-700 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 font-medium shadow-lg"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const AddCommerceForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full border border-gray-200 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Bouton de fermeture */}
        <button
          onClick={() => setShowAddForm(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center pr-8">
          <Plus className="h-5 w-5 mr-2 text-blue-600" />
          Ajouter un commerce
        </h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Nom du commerce *
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                placeholder="Nom de votre commerce"
              />
            </div>
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Catégorie *
              </label>
              <select className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option value="peinture">Peinture</option>
                <option value="sculpture">Sculpture</option>
                <option value="artisanat">Artisanat</option>
                <option value="boutique">Boutique</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">
              Localisation *
            </label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ville, La Réunion"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              rows="3"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Décrivez votre commerce..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="+262 XXX XXX XXX"
              />
            </div>
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="contact@commerce.re"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasWebsite"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="hasWebsite"
              className="text-slate-700 text-sm font-medium"
            >
              Site web disponible
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="delivery"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="delivery"
              className="text-slate-700 text-sm font-medium"
            >
              Livraison disponible
            </label>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-blue-600 text-sm mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
              💡 Votre commerce sera visible après validation manuelle par notre
              équipe
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-200 text-slate-700 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-all duration-200 font-semibold shadow-lg"
              >
                Soumettre pour validation
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section
        className="relative py-24 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 58, 138, 0.8)), url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl">
            Art & Commerces
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-blue-100 font-light">
            Découvrez l'art local et les petites boutiques de La Réunion et
            d'ailleurs
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un commerce, une œuvre d'art..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-2xl border-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    selectedCategory === category.id
                      ? `${category.color} text-white shadow-xl`
                      : "bg-white text-slate-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredListings.map((item) => {
              const category = categories.find(
                (cat) => cat.id === item.category
              );
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group"
                >
                  <div className="h-48 relative overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${item.image})` }}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                    {item.delivery && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1 shadow-lg z-20">
                        <Truck size={12} />
                        Livraison
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      {item.rating} ({item.reviews})
                    </div>
                    <div className="absolute top-3 left-3">
                      <span
                        className={`${
                          category?.color || "bg-blue-500"
                        } text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg`}
                      >
                        {category?.name}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-600 mb-4">
                      <MapPin size={16} className="text-blue-500" />
                      <span className="text-sm">{item.location}</span>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-900 font-bold text-lg">
                        {item.price}
                      </span>
                      {item.hasWebsite && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                          <ExternalLink size={12} />
                          Site web
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/art-commerce/${item.id}`}
                      className="block w-full bg-slate-900 text-white text-center py-3 rounded-xl hover:bg-slate-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl group-hover:shadow-slate-900/25"
                    >
                      Voir les détails
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <div className="text-center py-16">
              <Store size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-500">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 58, 138, 0.9)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Vous êtes commerçant ?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Rejoignez notre plateforme pour seulement{" "}
            <strong className="text-white">39€/mois</strong> et boostez votre
            visibilité
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleAddCommerce}
              className="bg-white text-slate-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold shadow-2xl hover:shadow-3xl flex items-center gap-2 justify-center transform hover:scale-105"
            >
              <Plus size={20} />
              Inscrire mon commerce
            </button>
            <button
              onClick={handleContactClick}
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold flex items-center gap-2 justify-center backdrop-blur-sm"
            >
              <Mail size={20} />
              En savoir plus
            </button>
          </div>
          <p className="text-sm text-blue-200 mt-6 flex items-center justify-center gap-2">
            <Truck size={16} />
            Livraison possible avec nos partenaires de transport
          </p>
        </div>
      </section>

      {/* Modals */}
      {showContactForm && <ContactForm />}
      {showAddForm && <AddCommerceForm />}
    </div>
  );
};

export default ArtCommerce;
