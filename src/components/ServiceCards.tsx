import { Home, Wrench, TrendingUp, Package } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Home,
    title: "Acheter",
    description: "Parcourez nos milliers de biens",
    color: "text-primary",
  },
  {
    icon: Wrench,
    title: "Services",
    description: "Trouver un professionnel",
    color: "text-primary",
  },
  {
    icon: TrendingUp,
    title: "Vendre",
    description: "Estimez votre bien",
    color: "text-accent",
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
    <section className="container mx-auto  md:px-8 sm:px-4 lg:px-12 -mt-24 relative z-20 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {services.map((service) => (
          <Card 
            key={service.title}
            className="p-4 text-center hover:shadow-2xl shadow-xl transition-all duration-300 cursor-pointer border-0 bg-card"
          >
            <div className={`mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4`}>
              <service.icon className={`h-8 w-8 ${service.color}`} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ServiceCards;
