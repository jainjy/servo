import React, { useEffect, useState } from 'react';
import { Briefcase, Users, TrendingUp, Target, ArrowRight, CheckCircle, Clock, Award, X, User, Mail, Phone, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

interface CreationRepriseProps {
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="bg-[#FFFFF0] rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-[#D3D3D3] group cursor-pointer"
  >
    <div className="flex items-center mb-4">
      <motion.div 
        className="p-2 bg-[#556B2F]/10 rounded-lg text-[#556B2F] mr-4 group-hover:bg-[#556B2F] group-hover:text-white transition-colors duration-300"
        whileHover={{ rotate: 10 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#556B2F] transition-colors duration-300">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    
    <motion.div 
      className="h-1 w-0 bg-[#556B2F] mt-4 rounded-full group-hover:w-full transition-all duration-500"
      initial={false}
    />
  </motion.div>
);

const ModalDemandeVisite = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    nomPrenom: "",
    email: "",
    telephone: "",
    message: "",
    dateSouhaitee: "",
    heureSouhaitee: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({
    dateSouhaitee: false,
    heureSouhaitee: false
  });

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (open && user && isAuthenticated) {
      const nomComplet = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      
      setFormData(prev => ({
        ...prev,
        nomPrenom: nomComplet,
        email: user.email || '',
        telephone: user.phone || user.telephone || user.mobile || '',
      }));
    } else if (open) {
      setFormData({
        nomPrenom: "",
        email: "",
        telephone: "",
        message: "",
        dateSouhaitee: "",
        heureSouhaitee: "",
      });
    }
  }, [open, user, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dateSouhaitee || !formData.heureSouhaitee) {
      setFormErrors({
        dateSouhaitee: !formData.dateSouhaitee,
        heureSouhaitee: !formData.heureSouhaitee
      });
      toast.error("Veuillez sélectionner une date et un créneau horaire.");
      return;
    }

    setFormErrors({ dateSouhaitee: false, heureSouhaitee: false });
    
    if (!isAuthenticated || !user) {
      toast.error('Veuillez vous connecter pour demander un rendez-vous.');
      return;
    }

    setLoadingSubmit(true);
    try {
      const payload = {
        nomComplet: formData.nomPrenom,
        email: formData.email,
        telephone: formData.telephone,
        projetDetails: formData.message,
        dateChoisie: formData.dateSouhaitee,
        heureChoisie: formData.heureSouhaitee,
        userId: user.id
      };

      const response = await api.post('/rendez-vous-entreprise', payload);

      toast.success("Votre demande de rendez-vous a bien été envoyée.");

      setFormData({
        nomPrenom: "",
        email: "",
        telephone: "",
        message: "",
        dateSouhaitee: "",
        heureSouhaitee: "",
      });
      
      onClose();
    } catch (err: any) {
      console.error('Erreur en envoyant la demande de rendez-vous', err);
      
      if (err.response?.status === 400) {
        toast.error(err.response.data.message || 'Données invalides');
      } else if (err.response?.status === 500) {
        toast.error('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        toast.error('Impossible d\'envoyer la demande. Veuillez réessayer.');
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-[#D3D3D3] flex flex-col">
        <div className="bg-[#556B2F] px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-white text-xl font-bold">Demander un rendez-vous</h2>
              <p className="text-white/80 text-sm mt-1">
                Pour la création ou reprise d'entreprise
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium">Vos coordonnées</span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] w-4 h-4" />
                  <input
                    name="nomPrenom"
                    value={formData.nomPrenom}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-[#D3D3D3] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200"
                    placeholder="Nom et Prénom"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] w-4 h-4" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-[#D3D3D3] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200"
                    placeholder="Adresse email"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] w-4 h-4" />
                  <input
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-[#D3D3D3] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200"
                    placeholder="Téléphone"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium">Disponibilités</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] w-4 h-4" />
                  <input
                    name="dateSouhaitee"
                    type="date"
                    value={formData.dateSouhaitee}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className={`w-full bg-gray-50 border ${
                      formErrors.dateSouhaitee ? 'border-red-500' : 'border-[#D3D3D3]'
                    } pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200`}
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] w-4 h-4 z-10" />
                  <select
                    name="heureSouhaitee"
                    value={formData.heureSouhaitee}
                    onChange={handleChange}
                    required
                    className={`w-full bg-gray-50 border ${
                      formErrors.heureSouhaitee ? 'border-red-500' : 'border-[#D3D3D3]'
                    } pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200 appearance-none hover:bg-white`}
                  >
                    <option value="">Sélectionnez un créneau</option>
                    <option value="08:00">Matin : 08h00</option>
                    <option value="10:00">Matin : 10h00</option>
                    <option value="14:00">Après-midi : 14h00</option>
                    <option value="16:00">Après-midi : 16h00</option>
                    <option value="18:00">Soir : 18h00</option>
                  </select>
                </div>
              </div>
              
              {(formErrors.dateSouhaitee || formErrors.heureSouhaitee) && (
                <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  Veuillez sélectionner une date et un créneau horaire pour continuer
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-[#8B4513] font-medium text-sm">
                Détails de votre projet (optionnel)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-[#D3D3D3] p-4 rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200"
                placeholder="Décrivez brièvement votre projet de création ou reprise d'entreprise..."
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#D3D3D3] p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 border border-[#D3D3D3] px-6 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button
              type="submit"
              disabled={loadingSubmit}
              className="flex-1 bg-[#6B8E23] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#556B2F] transition-all duration-200 shadow-lg shadow-[#6B8E23]/25 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Calendar className="w-4 h-4" />
              {loadingSubmit ? 'Envoi...' : 'Demander un rendez-vous'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
const CreationReprise: React.FC<CreationRepriseProps> = ({ className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const services = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Étude de faisabilité",
      description: "Analyse approfondie de votre projet pour valider sa viabilité économique et technique."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Business Plan",
      description: "Élaboration d'un plan d'affaires solide pour convaincre les investisseurs et banques."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Accompagnement juridique",
      description: "Choix de la structure juridique adaptée et formalités de création d'entreprise."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Stratégie de croissance",
      description: "Définition d'une roadmap claire pour le développement et la pérennisation de votre activité."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const backgroundVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 1.5, ease: "easeOut" }
    }
  };

  const AnimatedCounter = ({ value, duration = 2, index = 0 }) => {
    const [count, setCount] = useState(0);
    const [isCounting, setIsCounting] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isCounting) {
            setIsCounting(true);
            
            const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
            let startTimestamp: number | null = null;

            const step = (timestamp: number) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);

              setCount(Math.floor(progress * numericValue));

              if (progress < 1) {
                requestAnimationFrame(step);
              }
            };

            requestAnimationFrame(step);
          }
        },
        { threshold: 0.5 }
      );

      const element = document.getElementById(`counter-${index}`);
      if (element) observer.observe(element);

      return () => {
        if (element) observer.unobserve(element);
      };
    }, [value, duration, index, isCounting]);

    return (
      <span id={`counter-${index}`}>
        {value.includes('%') ? `${count}%` :
          value.includes('+') ? `${count}+` :
            count}
      </span>
    );
  };

  const stats = [
    { number: "95%", label: "Réussite", icon: <CheckCircle className="w-5 h-5" /> },
    { number: "500+", label: "Entreprises accompagnées", icon: <Users className="w-5 h-5" /> },
    { number: "10", label: "Années d'expérience", icon: <Award className="w-5 h-5" /> },
    { number: "24h", label: "Réponse sous", icon: <Clock className="w-5 h-5" /> }
  ];

  const statsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const statItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: { scale: 0.95 }
  };

  const handleOpenModal = () => {
    if (!isAuthenticated || !user) {
      toast.error('Veuillez vous connecter pour prendre rendez-vous.');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <motion.section 
      className={`py-8 mt-16 rounded-lg ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div 
          className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div 
            className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70'
          />
          <img 
            src="https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg" 
            className='h-full object-cover w-full'
            alt="Background" 
          />
        </div>

        <motion.div 
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-100 mb-4"
          >
            Création
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-md text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            Accompagnement personnalisé pour entrepreneurs ambitieux. De l'idée à la réalisation,
            nous vous guidons à chaque étape de votre aventure entrepreneuriale.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              index={index}
            />
          ))}
        </motion.div>

        <motion.div 
          className="bg-[#FFFFF0] rounded-2xl shadow-lg p-8 mb-16 border border-[#D3D3D3]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
        >
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={statsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={statItemVariants}
              >
                <div className="flex justify-center mb-2">
                  <motion.div 
                    className="p-2 bg-[#556B2F]/10 rounded-full text-[#556B2F]"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {stat.icon}
                  </motion.div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-[#8B4513] mb-2">
                  <AnimatedCounter value={stat.number} duration={2} index={index} />
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="text-center"
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-[#556B2F] rounded-2xl p-8 text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à concrétiser votre projet ?
            </h3>
            <p className="text-[#FFFFF0]/80 text-sm mb-6 max-w-2xl mx-auto">
              Prenez rendez-vous pour une consultation gratuite et découvrez comment
              nous pouvons vous aider à réussir votre création ou reprise d'entreprise.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.button 
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={handleOpenModal}
                className="bg-[#FFFFF0] text-[#556B2F] px-8 py-3 rounded-lg font-semibold hover:bg-[#FFFFF0]/90 transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <span>Prendre rendez-vous</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              
            </motion.div>

            <motion.div 
              className="flex justify-center mt-6"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="h-1 w-16 bg-[#FFFFF0]/50 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <ModalDemandeVisite 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.section>
  );
};

export default CreationReprise;
