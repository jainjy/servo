import React, { useEffect, useState } from 'react';
import { Briefcase, Users, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface CreationRepriseProps {
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
    <div className="flex items-center mb-4">
      <div className="p-2 bg-blue-100 rounded-lg text-slate-600 mr-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);


const CreationReprise: React.FC<CreationRepriseProps> = ({ className = '' }) => {
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

  const AnimatedCounter = ({ value, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
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
    }, [value, duration]);

    return (
      <>
        {value.includes('%') ? `${count}%` :
          value.includes('+') ? `${count}+` :
            count}
      </>
    );
  };

  const stats = [
    { number: "95%", label: "Réussite" },
    { number: "500+", label: "Entreprises accompagnées" },
    { number: "10", label: "Années d'expérience" },
    { number: "24h", label: "Réponse sous" }
  ];

  return (
    <section className={` py-8 mt-16 rounded-lg ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête */}
        <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
          <img src="https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg" className='h-full object-cover w-full' alt="" />
        </div>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Création & Reprise
          </h2>
          <p className="text-md text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Accompagnement personnalisé pour entrepreneurs ambitieux. De l'idée à la réalisation,
            nous vous guidons à chaque étape de votre aventure entrepreneuriale.
          </p>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-slate-950 mb-2">
                  <AnimatedCounter value={stat.number} duration={2} />
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-slate-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à concrétiser votre projet ?
            </h3>
            <p className="text-blue-100 text-sm mb-6 max-w-2xl mx-auto">
              Prenez rendez-vous pour une consultation gratuite et découvrez comment
              nous pouvons vous aider à réussir votre création ou reprise d'entreprise.
            </p>
             {/* 
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                Prendre rendez-vous
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-slate-600 transition-colors duration-300">
                Télécharger notre brochure
              </button>
            </div>*/}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreationReprise;