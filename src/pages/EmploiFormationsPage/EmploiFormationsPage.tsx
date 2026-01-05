import React, { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Briefcase, GraduationCap } from "lucide-react";
import FormationsSection from "./FormationsSection";
import EmploiSection from "./EmploiSection";
import AlternanceSection from "./AlternanceSection";
import AdvertisementPopup from "@/components/AdvertisementPopup";

const EmploiFormationsPage = () => {
  const [activeSection, setActiveSection] = useState("formations");
  const [loading, setLoading] = useState(false);
  const [researchProgress, setResearchProgress] = useState(50);
  const [cvFile, setCvFile] = useState(null);
  const [motivationLetter, setMotivationLetter] = useState("");
  const [savedItems, setSavedItems] = useState([]);
  const [appliedItems, setAppliedItems] = useState([]);
  const [alertSettings, setAlertSettings] = useState({
    active: false,
    keywords: "",
    frequency: "quotidien",
  });

  // Données communes
  const heroData = {
    formations: {
      title: "Formations & Développement Professionnel",
      description:
        "Trouvez la formation qui correspond à vos ambitions parmi +500 programmes certifiants",
      bgImage: "url('/formation.jpg')",
      icon: BookOpen,
    },
    emploi: {
      title: "Trouvez l'emploi qui vous correspond",
      description:
        "+2 345 offres d'emploi dans tous les secteurs • Recrutement direct et gratuit",
      bgImage: "url('/emploi.jpg')",
      icon: Briefcase,
    },
    alternance: {
      title: "Alternance & Stages",
      description:
        "Lancez votre carrière avec une expérience professionnelle concrète • +850 offres pour étudiants",
      bgImage: "url('/stage.jpg')",
      icon: GraduationCap,
    },
  };

  // Gestion du téléchargement de CV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux (max 5MB)");
        return;
      }
      if (!file.type.includes("pdf") && !file.type.includes("doc")) {
        toast.error("Format non supporté. Utilisez PDF ou DOC");
        return;
      }
      setCvFile(file);
      toast.success("CV téléchargé avec succès");
    }
  };

  // Gestion des favoris
  const toggleSavedItem = (itemId, section) => {
    const itemKey = `${section}-${itemId}`;
    if (savedItems.includes(itemKey)) {
      setSavedItems(savedItems.filter((id) => id !== itemKey));
      toast.success("Retiré des favoris");
    } else {
      setSavedItems([...savedItems, itemKey]);
      toast.success("Ajouté aux favoris");
    }
  };

  // Gestion des candidatures
  const handleApply = (itemId, section, itemTitle) => {
    const itemKey = `${section}-${itemId}`;
    if (!appliedItems.includes(itemKey)) {
      setAppliedItems([...appliedItems, itemKey]);
      setResearchProgress(Math.min(researchProgress + 25, 100));
      toast.success(`Candidature envoyée pour ${itemTitle}`);
    } else {
      toast.info("Vous avez déjà postulé");
    }
  };

  // Téléchargement de guide
  const handleDownloadGuide = (guideType) => {
    toast.info(`Téléchargement du guide ${guideType}...`);
    setTimeout(() => {
      toast.success("Guide téléchargé avec succès");
    }, 1500);
  };

  // Partage
  const handleShare = (item, section) => {
    const shareText = `Découvrez cette ${section === "formations" ? "formation" : "offre"
      } : ${item.title} - ${item.entreprise || item.organisme}`;

    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Lien copié dans le presse-papier");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white mt-16">
      {/* Hero Section */}
      <div className="absolute top-12 left-4 right-4 z-50">
        <AdvertisementPopup />
      </div>

      <div className="fixed w-1/2 bottom-0 right-4 z-50">
        <AdvertisementPopup />
      </div>
      <div
        className="relative text-white py-16 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: heroData[activeSection].bgImage }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] opacity-75"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
              {React.createElement(heroData[activeSection].icon, {
                className: "h-10 w-10",
              })}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {heroData[activeSection].title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {heroData[activeSection].description}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <Tabs
              value={activeSection}
              onValueChange={setActiveSection}
              className="w-full max-w-4xl"
            >
              <TabsList className="grid grid-cols-3 bg-white/20 backdrop-blur-sm">
                <TabsTrigger
                  value="formations"
                  className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Formations
                </TabsTrigger>
                <TabsTrigger
                  value="emploi"
                  className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Offres d'emploi
                </TabsTrigger>
                <TabsTrigger
                  value="alternance"
                  className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Alternance/Stages
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === "formations" && (
          <FormationsSection
            loading={loading}
            savedItems={savedItems}
            appliedItems={appliedItems}
            toggleSavedItem={toggleSavedItem}
            handleApply={handleApply}
            handleShare={handleShare}
            handleDownloadGuide={handleDownloadGuide}
            handleFileUpload={handleFileUpload}
            cvFile={cvFile}
            setCvFile={setCvFile}
            setLoading={setLoading}
          />
        )}
        {activeSection === "emploi" && (
          <EmploiSection
            loading={loading}
            savedItems={savedItems}
            appliedItems={appliedItems}
            toggleSavedItem={toggleSavedItem}
            handleApply={handleApply}
            handleShare={handleShare}
            handleFileUpload={handleFileUpload}
            cvFile={cvFile}
            setCvFile={setCvFile}
            setLoading={setLoading}
            motivationLetter={motivationLetter}
            setMotivationLetter={setMotivationLetter}
            alertSettings={alertSettings}
            setAlertSettings={setAlertSettings}
          />
        )}
        {activeSection === "alternance" && (
          <AlternanceSection
            loading={loading}
            savedItems={savedItems}
            appliedItems={appliedItems}
            toggleSavedItem={toggleSavedItem}
            handleApply={handleApply}
            handleShare={handleShare}
            handleDownloadGuide={handleDownloadGuide}
            setLoading={setLoading}
            researchProgress={researchProgress}
            setResearchProgress={setResearchProgress}
          />
        )}
      </div>
    </div>
  );
};

export default EmploiFormationsPage;