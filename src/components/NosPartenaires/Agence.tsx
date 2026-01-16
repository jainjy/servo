import ProfessionalCategory from "@/components/ProfessionalCategory";
import CarteBoutton from "../../pages/CarteBoutton";
const Agence = () => {
return (
  <>
    <ProfessionalCategory
      category="agences"
      title="Tous nos Agences"
      description="Découvrez l'ensemble de notre réseau d'agences immobilières et professionnelles"
      bannerImage="https://i.pinimg.com/1200x/dd/79/fc/dd79fc2ab5b5d1da2508125a66687c82.jpg"
    />
    <CarteBoutton 
      size="lg"
      position="bottom-left"
      className="bg-green-600 hover:bg-green-600"
      category="agences"
    />
  </>
);
};

export default Agence;