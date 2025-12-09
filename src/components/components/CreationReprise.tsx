import React, { useEffect, useState } from 'react';
import { Briefcase, Users, TrendingUp, Target, ArrowRight, CheckCircle, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

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
    
    {/* Ligne décorative */}
    <motion.div 
      className="h-1 w-0 bg-[#556B2F] mt-4 rounded-full group-hover:w-full transition-all duration-500"
      initial={false}
    />
  </motion.div>
);

const CreationReprise: React.FC<CreationRepriseProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
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

  // Animation pour la section d'en-tête
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

  // Animation pour le background
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

  // Animation pour les statistiques
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

  // Animation pour le CTA
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

  // Animation pour le bouton CTA
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.2,
        yoyo: Infinity
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.section 
      className={`py-8 mt-16 rounded-lg ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête avec animation */}
        <motion.div 
          className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'
          variants={backgroundVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'
            animate={{
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.img 
            src="https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg" 
            className='h-full object-cover w-full'
            alt="Background" 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
          />
        </motion.div>

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
            Création & Reprise
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-md text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            Accompagnement personnalisé pour entrepreneurs ambitieux. De l'idée à la réalisation,
            nous vous guidons à chaque étape de votre aventure entrepreneuriale.
          </motion.p>
        </motion.div>

        {/* Services avec animation */}
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

        {/* Statistiques avec animation */}
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

        {/* CTA avec animation */}
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
            
            {/* Boutons CTA animés */}
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
                className="bg-[#FFFFF0] text-[#556B2F] px-8 py-3 rounded-lg font-semibold hover:bg-[#FFFFF0]/90 transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <span>Prendre rendez-vous</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <motion.button 
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="border-2 border-[#FFFFF0] text-[#FFFFF0] px-8 py-3 rounded-lg font-semibold hover:bg-[#FFFFF0] hover:text-[#556B2F] transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <span>Télécharger notre brochure</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Élément décoratif animé */}
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
    </motion.section>
  );
};

export default CreationReprise;