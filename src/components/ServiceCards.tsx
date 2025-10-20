import { Home, Wrench, TrendingUp, Package, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Home,
    title: "Acheter ou Louer",
    description: "Tout est réuni pour vous simplifier la vie.",
    color: "text-primary",
  },
  {
    icon: Wrench,
    title: "Services",
    description: "Agents immobiliers, électriciens, plombiers et architectes.",
    color: "text-primary",
  },
  {
    icon: Globe,
    title: "Découvrir",
    description: "Hôtels, gîtes et activités touristiques.",
    color: "text-primary",
  },
  {
    icon: Package,
    title: "Produits",
    description: "Tous les produits pour la maison",
    color: "text-primary",
  },
];

const ServiceCards = () => {
  return (
    <section className="container mx-auto px-4 lg:-mt-14 -mt-24 relative z-20 mb-0">
      <div className="place-items-center bg-white w-full lg:w-3/4 h-72 md:h-36 lg:h-36 mx-auto rounded-xl shadow-xl px-6 pt-2 lg:px-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1">
        {services.map((service, index) => (
          <div
            key={service.title}
            className={` flex flex-col h-32 items-start flex-1 min-w-[140px] max-w-[180px] p-2 cursor-pointer
          ${index !== services.length - 1 ? 'border-r border-gray-300 md:border-r' : ''}
          border-r-0`}
          >
            <div className={`w-12  h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-1`}>
              <service.icon className={`h-5 w-5 ${service.color}`} />
            </div>
            <h3 className="text-sm font-semibold ">{service.title}</h3>
            <p className="text-xs text-muted-foreground text-start">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceCards;
