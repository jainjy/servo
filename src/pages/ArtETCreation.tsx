import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  User,
  Store, 
  Camera, 
  Hammer, 
  Brush, 
  Search,
  X,
  Send,
  Mail,
  Phone
} from 'lucide-react';

// Import des composants
import ArtisanatPage from './ArtEtCreation/ArtisanatPage';
import MarketplaceCreateurs from './ArtEtCreation/MarketplaceCreateurs';
import PeinturePage from './ArtEtCreation/PeinturePage';
import PhotographiePage from './ArtEtCreation/PhotographiePage';
import SculpturePage from './ArtEtCreation/SculpturePage';
import { toast } from 'sonner'; // Ajoutez cette importation si vous utilisez sonner

// Hook useAuth (à adapter selon votre implémentation)
import { useAuth } from '@/hooks/useAuth'; // Ou créez votre propre hook

const ArtEtCreation = () => {
  const [activeTab, setActiveTab] = useState('photographie');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    subject: '',
    recipientName: ''
  });

  const { user, isAuthenticated } = useAuth(); // Utilisation du hook d'authentification

  const tabs = [
    { id: 'photographie', label: 'Photographie', icon: <Camera size={18} /> },
    { id: 'sculpture', label: 'Sculpture', icon: <Hammer size={18} /> },
    { id: 'peinture', label: 'Peinture', icon: <Palette size={18} /> },
    { id: 'artisanat', label: 'Artisanat', icon: <Brush size={18} /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Store size={18} /> },
  ];

  const backgroundImages = {
    artisanat:
      'https://i.pinimg.com/1200x/d0/3f/70/d03f70718ec218e0432c26ff587e3bf8.jpg',
    marketplace:
      'https://i.pinimg.com/1200x/03/e2/e4/03e2e413bf4d666133600ff2eef90bb7.jpg',
    peinture:
      'https://i.pinimg.com/1200x/3d/08/6f/3d086f097c43d22c6b074b375aed88d2.jpg',
    photographie:
      'https://i.pinimg.com/1200x/c9/87/c4/c987c4c4f4be701a27f5cdf35c078cda.jpg',
    sculpture:
      'https://i.pinimg.com/736x/52/ba/77/52ba77a48638da2e6e4a9f0f32fb31b5.jpg',
  };

  const titles = {
    artisanat: {
      main: 'Art & Création',
      subtitle:
        'Des artisans passionnés, des créations uniques, un savoir-faire à préserver',
    },
    marketplace: {
      main: 'Marketplace Créateurs',
      subtitle:
        'Des pièces uniques, des histoires authentiques, des créateurs indépendants',
    },
    peinture: {
      main: "L'univers de la peinture",
      subtitle:
        "Des artistes contemporains aux techniques traditionnelles",
    },
    photographie: {
      main: 'Trouvez le photographe idéal',
      subtitle:
        'Des professionnels pour capturer vos moments précieux',
    },
    sculpture: {
      main: "L'art de la sculpture",
      subtitle:
        'Des œuvres uniques façonnées par des sculpteurs talentueux',
    },
  };

  const placeholders = {
    artisanat: 'Rechercher un artisan, une spécialité...',
    marketplace: 'Rechercher un créateur, un produit...',
    peinture: 'Rechercher un artiste, un style...',
    photographie: 'Rechercher un photographe...',
    sculpture: 'Rechercher un sculpteur...',
  };

  const handleContactClick = (subject = '', recipientName = '') => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour contacter un créateur.');
      return;
    }
    
    setContactData({
      subject,
      recipientName
    });
    setShowContactForm(true);
  };

  const handleCloseContactForm = () => {
    setShowContactForm(false);
    setContactData({
      subject: '',
      recipientName: ''
    });
  };

  const getActiveComponent = () => {
    const commonProps = {
      searchQuery,
      onContactClick: handleContactClick
    };

    switch (activeTab) {
      case 'photographie':
        return <PhotographiePage {...commonProps} />;
      case 'sculpture':
        return <SculpturePage {...commonProps} />;
      case 'peinture':
        return <PeinturePage {...commonProps} />;
      case 'artisanat':
        return <ArtisanatPage {...commonProps} />;
      case 'marketplace':
        return <MarketplaceCreateurs {...commonProps} />;
      default:
              return <PhotographiePage {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-white mt-12">
      {/* HERO */}
      <div
        className="relative pt-20 pb-10 px-4"
        style={{
          backgroundImage: `url('${backgroundImages[activeTab]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '320px',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {titles[activeTab].main}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            {titles[activeTab].subtitle}
          </p>

          {/* SEARCH */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2"
                color="#8B4513"
                size={20}
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholders[activeTab]}
                className="w-full pl-10 pr-28 py-4 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#D3D3D3' }}
              />
              <button
                className="absolute right-2 top-2 px-4 py-2 rounded-md text-white font-medium"
                style={{ backgroundColor: '#556B2F' }}
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ONGLET PILULE */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-2 rounded-full
                    text-sm font-medium transition-all duration-300
                    whitespace-nowrap
                    ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                  style={{
                    backgroundColor: isActive ? '#556B2F' : 'transparent',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {getActiveComponent()}
      </div>

      {/* MODAL DE CONTACT - Intégré directement */}
      {showContactForm && (
        <ContactFormModal
          contactData={contactData}
          onClose={handleCloseContactForm}
          user={user}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};

// Composant modal intégré avec pré-remplissage automatique
const ContactFormModal = ({ contactData, onClose, user, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    prenom: '',
    email: '',
    phone: '',
    message: ''
  });

  // Pré-remplir automatiquement avec les données de l'utilisateur connecté
  useEffect(() => {
    if (user && isAuthenticated) {
      // Séparer le nom complet si nécessaire
      let firstName = user.firstName || '';
      let lastName = user.lastName || '';
      
      // Si vous avez un champ fullName, vous pouvez le diviser
      if (!firstName && !lastName && user.fullName) {
        const nameParts = user.fullName.trim().split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      setFormData(prev => ({
        ...prev,
        name: lastName,
        prenom: firstName,
        email: user.email || '',
        phone: user.phone || user.telephone || user.mobile || ''
      }));
    } else {
      // Réinitialiser si l'utilisateur n'est pas connecté
      setFormData({
        name: '',
        prenom: '',
        email: '',
        phone: '',
        message: ''
      });
    }
  }, [user, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour envoyer un message.');
      return;
    }

    // Ajouter les infos de contact au message
    const completeData = {
      ...formData,
      contactSubject: contactData.subject || 'Demande de contact',
      contactRecipient: contactData.recipientName || 'Équipe Art & Création'
    };
    
    console.log('Form submitted:', completeData);
    // Ici vous pouvez ajouter la logique d'envoi vers votre API
    // Exemple: api.post('/messages/contact', completeData);
    
    toast.success('Message envoyé avec succès!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh] my-auto">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center"
       style={{ borderColor: '#D3D3D3', backgroundColor: '#556B2F' }}>
          <div>
            <h2 className="text-xl font-bold text-white">
              Contacter {contactData.recipientName || 'le créateur'}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {contactData.subject || 'Demande de contact'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Form */}
         <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
           <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block mb-2 font-medium text-[#8B4513]">
                Nom
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  style={{ 
                    borderColor: '#D3D3D3',
                    backgroundColor: isAuthenticated ? '#F9FAFB' : '#FFFFFF'
                  }}
                  placeholder="Votre nom"
                  disabled={isAuthenticated && user?.lastName}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User size={18} style={{ color: '#8B4513' }} />
                </div>
              </div>
              {isAuthenticated && user?.lastName && (
                <p className="text-xs text-gray-500 mt-1">Pré-rempli depuis votre profil</p>
              )}
            </div>

            {/* Prénom */}
            <div>
              <label htmlFor="prenom" className="block mb-2 font-medium text-[#8B4513]">
                Prénom
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  style={{ 
                    borderColor: '#D3D3D3',
                    backgroundColor: isAuthenticated ? '#F9FAFB' : '#FFFFFF'
                  }}  
                  placeholder="Votre prénom"
                  disabled={isAuthenticated && user?.firstName}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User size={18} style={{ color: '#8B4513' }} />
                </div>
              </div>
              {isAuthenticated && user?.firstName && (
                <p className="text-xs text-gray-500 mt-1">Pré-rempli depuis votre profil</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-[#8B4513]">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  style={{ 
                    borderColor: '#D3D3D3',
                    backgroundColor: isAuthenticated ? '#F9FAFB' : '#FFFFFF'
                  }}
                  placeholder="votre@email.com"
                  disabled={isAuthenticated && user?.email}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Mail size={18} style={{ color: '#8B4513' }} />
                </div>
              </div>
              {isAuthenticated && user?.email && (
                <p className="text-xs text-gray-500 mt-1">Pré-rempli depuis votre profil</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block mb-2 font-medium text-[#8B4513]">
                Téléphone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  style={{ 
                    borderColor: '#D3D3D3',
                    backgroundColor: isAuthenticated ? '#F9FAFB' : '#FFFFFF'
                  }}
                  placeholder="0260023020"
                  disabled={isAuthenticated && (user?.phone || user?.telephone || user?.mobile)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Phone size={18} style={{ color: '#8B4513' }} />
                </div>
              </div>
              {isAuthenticated && (user?.phone || user?.telephone || user?.mobile) && (
                <p className="text-xs text-gray-500 mt-1">Pré-rempli depuis votre profil</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 font-medium text-[#8B4513]">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
              style={{ 
                borderColor: '#D3D3D3',
                backgroundColor: '#FFFFFF'
              }}
              placeholder={`Votre message à ${contactData.recipientName || 'notre équipe'}...`}
            />
          </div>

          {/* Info connexion */}
          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                💡 <strong>Astuce :</strong> Connectez-vous pour pré-remplir automatiquement vos informations de contact.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-50 transition-colors"
              style={{ 
                borderColor: '#556B2F',
                color: '#556B2F'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg text-white font-medium flex items-center hover:bg-[#5A7A1F] transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#6B8E23' }}
              disabled={!isAuthenticated}
            >
              <Send size={18} className="mr-2" />
              {isAuthenticated ? 'Envoyer le message' : 'Connectez-vous pour envoyer'}
            </button>
          </div>
        </form>
       </div>
      </div>
    </div>
  );
};

export default ArtEtCreation;