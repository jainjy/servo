import ProfessionalCategory from "@/components/ProfessionalCategory";
import CarteBoutton from "../../pages/CarteBoutton";
const Plombier = () => {
  return (
    <>
    <ProfessionalCategory
      category="plombiers"
      title="Tous nos Plombiers"
      description="Des plombiers qualifiés pour toutes vos installations et réparations sanitaires"
      bannerImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200"
    />
     <CarteBoutton 
      size="lg"
      position="bottom-left"
      className="bg-green-500 hover:bg-green-600"
      category="plombiers"
    />
  </>
  );
};

export default Plombier;