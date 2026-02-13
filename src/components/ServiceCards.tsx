import { Home, Wrench, TrendingUp, Package, User2Icon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
 
const services = [
  {
    icon: Home,
    title: "Annonces Immobilières",
    description: "Trouver votre futur logement",
    color: "text-[#556B2F]",
    href: "/immobilier"
  },
  {
    icon: TrendingUp,
    title: "Services professionnels",
    description: "Trouver un professionnel",
    color: "text-[#6B8E23]",
    href: "/service"
  },
  {
    icon: Package,
    title: "Décoration & Mobilier",
    description: "Tous les produits pour la maison",
    color: "text-[#8B4513]",
    href: "/produits"
  },
  {
    icon: User2Icon,
    title: "Explorer et vivre",
    description: "Une douceur de vie tropicale",
    color: "text-[#2F4F4F]",
    href: "/tourisme"
  },
];

const ServiceCards = () => {
  // Animation variants pour les cartes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section className="container mx-auto relative z-20 -mt-12 lg:-mt-20 px-4 font-sans">
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {services.map((service) => (
          <motion.div
            key={service.title}
            variants={itemVariants}
            className="h-full"
          >
            <Link 
              to={service.href} 
              className="no-underline block h-full"
            >
              <Card
                className={`
                  p-3 sm:p-4 lg:p-6
                  rounded-lg lg:rounded-xl
                  flex flex-col items-center justify-center
                  shadow-lg transition-all duration-500 
                  cursor-pointer 
                  border-0 lg:border lg:border-gray-100
                  bg-white/95 backdrop-blur-sm
                  hover:bg-gradient-to-br hover:from-white hover:to-gray-50
                  group relative overflow-hidden
                  h-full
                `}
              >
                {/* Effet de fond animé premium */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#556B2F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Ligne de bordure supérieure animée */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] group-hover:w-full transition-all duration-700 ease-out"></div>

                {/* Contenu - POLICE SANS SERIF */}
                <div className="relative z-10 flex flex-col items-center w-full">
                  {/* Icône avec effet premium */}
                  <div className="relative mb-2 lg:mb-4">
                    <div className={`
                      rounded-xl lg:rounded-2xl 
                      bg-gradient-to-br from-[#556B2F]/10 to-[#6B8E23]/5
                      flex items-center justify-center 
                      transition-all duration-500 
                      group-hover:scale-110 group-hover:rotate-3
                      group-hover:shadow-lg
                      w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16
                    `}>
                      <service.icon className={`
                        transition-all duration-500
                        h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8
                        ${service.color}
                        group-hover:scale-110
                      `} />
                    </div>
                    
                    {/* Badge de premium subtil */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#8B4513] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Titre - SANS SERIF */}
                  <h3 className={`
                    font-sans font-semibold text-center
                    text-gray-900 group-hover:text-[#556B2F]
                    transition-colors duration-300
                    text-xs sm:text-sm lg:text-base
                    mb-1 lg:mb-2
                    line-clamp-2
                    tracking-wide
                  `}>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className={`
                    text-gray-600 text-center leading-relaxed
                    text-xs lg:text-sm
                    line-clamp-2
                    opacity-80 group-hover:opacity-100
                    transition-opacity duration-300
                    hidden lg:block
                    font-sans font-light
                  `}>
                    {service.description}
                  </p>

                  {/* Description mobile */}
                  <p className={`
                    text-gray-600 text-center
                    text-[10px] sm:text-xs
                    line-clamp-2
                    lg:hidden
                    font-sans
                  `}>
                    {service.description}
                  </p>
                </div>

                {/* Indicateur hover moderne */}
                <div className="
                  absolute bottom-0 left-0 right-0
                  h-0.5 bg-gradient-to-r from-[#556B2F] to-[#6B8E23]
                  transform scale-x-0 group-hover:scale-x-100
                  transition-transform duration-700 origin-left
                "></div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ServiceCards;