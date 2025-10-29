import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { prestationsData, prestationTypesByCategory } from "./travauxData";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Camera,
  FileText,
  User,
  Phone,
  Mail,
  Home,
  MapPin,
  Calendar,
  Share2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PhotosModal } from "./TravauxSection";


const TravauxPreview = ({ homeCards }: { homeCards?: boolean }) => {
  const navigate = useNavigate();
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [photosModal, setPhotosModal] = useState({
    isOpen: false,
    prestation: null,
  });
  const [devisModal, setDevisModal] = useState({
    isOpen: false,
    prestation: null,
  });

  // Prendre les 4 premiers travaux toutes catégories confondues
  const allPrestations = Object.values(prestationsData).flat();
  const displayedPrestations = allPrestations.slice(0, 4);

  useEffect(() => {
    const indexes = {};
    displayedPrestations.forEach((prestation) => {
      indexes[prestation.id] = 0;
    });
    setCurrentImageIndexes(indexes);
  }, []);

  const nextImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]: (prev[prestationId] + 1) % totalImages,
    }));
  };

  const prevImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]: (prev[prestationId] - 1 + totalImages) % totalImages,
    }));
  };

  const openPhotosModal = (prestation) => {
    setPhotosModal({ isOpen: true, prestation });
  };

  const openDevisModal = (prestation) => {
    setDevisModal({ isOpen: true, prestation });
  };

  const closePhotosModal = () => {
    setPhotosModal({ isOpen: false, prestation: null });
  };

  const closeDevisModal = () => {
    setDevisModal({ isOpen: false, prestation: null });
  };

  return (
    <section className="container mx-auto -mt-6 px-4 py-8">
      <div className="bg-white shadow-lg px-8 py-5 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nos Travaux
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez un aperçu de nos travaux les plus récents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {displayedPrestations.map((prestation) => {
            const currentImageIndex = currentImageIndexes[prestation.id] || 0;
            const totalImages = prestation.images.length;
            
            // Trouver la catégorie et le type de la prestation
            const category = Object.entries(prestationsData).find(([_, prestations]) =>
                    (prestations as any[]).some((p) => p.id === prestation.id)
            )?.[0];
            const prestationType = prestationTypesByCategory[category]?.find(
              (t) => t.value === prestation.type
            );

            return (
              <Card
                key={prestation.id}
                className={
                  homeCards
                    ? "home-card group cursor-pointer h-full"
                    : "group overflow-hidden border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 rounded-3xl cursor-pointer transform hover:-translate-y-2"
                }
              >
                <div className="relative overflow-hidden">
                  <div className={homeCards ?"h-72 rounded-lg overflow-hidden":"relative h-56 overflow-hidden rounded-t-3xl"}>
                    <img
                      src={prestation.images[currentImageIndex]}
                      alt={prestation.title}
                      className={homeCards ? "h-full w-full" : "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"}
                    />

                    {/* Overlay gradient */}
                    <div 
                    className={homeCards ? "absolute inset-0 rounded-lg bg-gradient-to-t from-black to-transparent opacity-100" :"absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"} />

                    {/* Badge type */}
                    <div 
                    className={homeCards ? "absolute top-1/2 left-1/2 text-sm -translate-x-1/2 -translate-y-1/2 font-extralight font-mono text-white bg-black/50 px-4 py-2 rounded-full":"absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-bold text-gray-800 shadow-lg"}>
                      {prestationType?.label}
                    </div>

                    {/* Navigation images */}
                    {totalImages > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                          onClick={(e) =>
                            prevImage(prestation.id, totalImages, e)
                          }
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                          onClick={(e) =>
                            nextImage(prestation.id, totalImages, e)
                          }
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Indicateur d'images */}
                        <div 
                        className={homeCards ? "hidden":"absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm"}>
                          {currentImageIndex + 1}/{totalImages}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Contenu de la carte */}
                  <div className={homeCards ?"hidden":"p-6"}>
                    {/* Boutons d'action */}
                    <div className="flex gap-2">
                      <Button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-300 hover:shadow-md flex-1"
                        onClick={() => openPhotosModal(prestation)}
                      >
                        <Camera className="h-3.5 w-3.5 mr-1.5" />
                        Photos
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-300 hover:shadow-lg flex-1"
                        onClick={() => openDevisModal(prestation)}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        DEVIS
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

          <Button
            variant="outline"
            className="rounded-2xl border-1 bg-slate-950 border-gray-300 hover:border-blue-500 hover:bg-black text-lg py-4 font-semibold transition-all duration-300 hover:shadow-lg group"
            onClick={() => navigate("/travaux?categorie=interieurs")}
          >
            <span className="text-white text-base font-mono">
              VOIR TOUS NOS TRAVAUX
            </span>
            <ArrowRight className=" h-5 w-5 text-blue-600 group-hover:text-purple-600 transition-transform group-hover:translate-x-1" />
          </Button>

      </div>
    </section>
  );
};

export default TravauxPreview;