import { Home, Wrench, TrendingUp, Package, User2Icon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Home,
    title: "Annonces Immobilières",
    description: "Trouver votre futur logement",
    color: "text-slate-900",
    href: "/immobilier"
  },
  {
    icon: TrendingUp,
    title: "Services professionnels",
    description: "Trouver un professionnel",
    color: "text-slate-900",
    href: "/service"
  },
  {
    icon: Package,
    title: "Décoration & Mobilier",
    description: "Tous les produits pour la maison",
    color: "text-slate-900",
    href: "/produits"
  },
  {
    icon: User2Icon,
    title: "Vivre à la réunion",
    description: "Une douceur de vie tropicale",
    color: "text-slate-900",
    href: "/tourisme"
  },
];

const ServiceCards = () => {
  return (
    <section className="container mx-auto  md:px-8 sm:px-4 lg:px-12 mt-2 lg:-mt-24 relative z-20 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {services.map((service) => (
          <Link to={service.href} key={service.title} className="no-underline">
            <Card
              key={service.title}
              className="
    p-4 sm:p-5 lg:p-6 
    text-center flex flex-col items-center 
    hover:shadow-2xl shadow-lg transition-all duration-500 
    cursor-pointer border border-gray-100 
    bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50
    group relative overflow-hidden
  "
            >
              {/* Effet de fond animé */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icône responsive avec badge */}
              <div className="lg:flex-col flex gap-5 lg:gap-0 w-full justify-center items-center">
              <div className="relative mb-3 sm:mb-4 lg:mb-6">
                <div className={`
      rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 
      flex items-center justify-center 
      transition-all duration-500 group-hover:from-slate-900/20 group-hover:to-primary/10
      group-hover:scale-110 group-hover:rotate-3
      w-12 h-12 sm:w-14 sm:h-14 lg:w-18 lg:h-18 xl:w-20 xl:h-20
      border border-primary/20 
    `}>
                  <service.icon className={`
        transition-transform duration-500
        h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10
        ${service.color}
        group-hover:scale-110
      `} />
                </div>

                
              </div>

              {/* Contenu */}
              <div className="relative z-10 flex-1 w-full">
                <h3 className="
      font-bold text-gray-900 lg:text-center text-start group-hover:text-slate-900 
      transition-colors duration-300
      text-sm sm:text-base lg:text-xl
      mb-2 lg:mb-3
      line-clamp-2
    ">
                  {service.title}
                </h3>

                <p className="
      text-gray-600 leading-relaxed lg:text-center text-start
      text-xs sm:text-sm lg:text-base
      line-clamp-2 sm:line-clamp-3
      opacity-80 group-hover:opacity-100 
      transition-opacity duration-300
    ">
                  {service.description}
                </p>
              </div>
              </div>

              {/* Indicateur hover */}
              <div className="
    absolute bottom-0 left-1/2 transform -translate-x-1/2
    w-0 h-0.5 bg-slate-900 
    group-hover:w-4/5 transition-all duration-500
  "></div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ServiceCards;
