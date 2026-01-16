import ProfessionalCategory from "@/components/ProfessionalCategory";
import CarteBoutton from "../../pages/CarteBoutton";
const Constructeur = () => {
  return (
    <>
    <ProfessionalCategory
      category="constructeurs"
      title="Tous nos Constructeurs"
      description="Trouvez les meilleurs constructeurs, maçons et charpentiers pour vos projets"
      bannerImage="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200"
    />
    <CarteBoutton 
      size="lg"
      position="bottom-left"
      className="bg-green-500 hover:bg-green-600"
      category="constructeurs"
    />
  </>

  );
};

export default Constructeur;