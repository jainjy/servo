import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Award,
  MapPin,
  Building,
  Heart,
  Share2,
  Zap,
  GraduationCap,
  BookOpen,
  Code,
  TrendingUp,
  Clock,
  Calendar,
  ChevronRight,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const AlternanceSection = ({
  loading,
  savedItems,
  appliedItems,
  toggleSavedItem,
  handleApply,
  handleShare,
  handleDownloadGuide,
  setLoading,
  researchProgress,
  setResearchProgress,
}) => {
  const [offres, setOffres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("tous");
  const [selectedNiveau, setSelectedNiveau] = useState("tous");
  const [selectedDuree, setSelectedDuree] = useState("tous");
  const [activeTab, setActiveTab] = useState("alternance");

  const types = [
    {
      id: "alternance",
      label: "Alternance",
      icon: Zap,
      description: "Contrat pro ou apprentissage",
    },
    {
      id: "stage",
      label: "Stage",
      icon: GraduationCap,
      description: "Stage conventionné",
    },
    {
      id: "apprentissage",
      label: "Apprentissage",
      icon: BookOpen,
      description: "Contrat d'apprentissage",
    },
  ];

  const niveaux = [
    { id: "bac", label: "BAC", color: "bg-blue-100 text-blue-800" },
    { id: "bac+2", label: "BAC+2", color: "bg-green-100 text-green-800" },
    { id: "bac+3", label: "BAC+3/4", color: "bg-yellow-100 text-yellow-800" },
    { id: "bac+5", label: "BAC+5", color: "bg-purple-100 text-purple-800" },
  ];

  const offresList = [
    {
      id: 1,
      title: "Développeur Web Alternance",
      entreprise: "DigitalFuture SA",
      type: "alternance",
      niveau: "bac+3",
      duree: "12+",
      location: "Paris (75)",
      date: "Début Septembre 2024",
      remuneration: "70-85% SMIC",
      description:
        "Alternance en développement web full stack pour un BAC+3/4.",
      missions: [
        "Développement frontend React",
        "API REST avec Node.js",
        "Tests et déploiement",
        "Participation aux réunions d'équipe",
      ],
      competences: [
        "HTML/CSS",
        "JavaScript",
        "React",
        "Git",
        "TypeScript",
        "Node.js",
      ],
      avantages: [
        "Formation financée",
        "Salaire + primes",
        "Ticket resto",
        "Télétravail partiel",
      ],
      icon: Code,
      urgent: true,
      remote: "hybride",
    },
    {
      id: 2,
      title: "Stage Marketing Digital",
      entreprise: "BrandBoost Agency",
      type: "stage",
      niveau: "bac+5",
      duree: "5-6",
      location: "Lyon (69)",
      date: "Mars à Août 2024",
      remuneration: "Gratification légale",
      description:
        "Stage en marketing digital avec gestion de campagnes sociales.",
      missions: [
        "Gestion réseaux sociaux",
        "Analyse de données",
        "Création de contenus",
        "Reporting mensuel",
      ],
      competences: [
        "SEO",
        "Google Analytics",
        "Réseaux sociaux",
        "Copywriting",
        "Canva",
        "Excel",
      ],
      avantages: [
        "Indemnités",
        "Formation interne",
        "Possibilité CDI",
        "Matériel fourni",
      ],
      icon: TrendingUp,
      urgent: false,
      remote: true,
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOffres(offresList);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOffres = offres.filter((offre) => {
    const matchesSearch =
      offre.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "tous" || offre.type === selectedType;
    const matchesNiveau =
      selectedNiveau === "tous" || offre.niveau === selectedNiveau;

    const matchesTab =
      (activeTab === "alternance" &&
        (offre.type === "alternance" || offre.type === "apprentissage")) ||
      (activeTab === "stage" && offre.type === "stage") ||
      (activeTab === "sauvegardees" &&
        savedItems.includes(`alternance-${offre.id}`));

    return matchesSearch && matchesType && matchesNiveau && matchesTab;
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      toast.info(`Recherche d'alternance/stage pour "${searchTerm}"`);
    }
  };

  const handleResetFilters = () => {
    setSelectedType("tous");
    setSelectedNiveau("tous");
    setSelectedDuree("tous");
    setSearchTerm("");
    setActiveTab("alternance");
    toast.success("Filtres réinitialisés");
  };

  const handleOpenEvents = () => {
    toast.info("Ouverture du calendrier des événements...");
  };

  const statsData = [
    { label: "Offres actives", value: "856", icon: Briefcase },
    { label: "Alternances", value: "312", icon: GraduationCap },
    { label: "Taux d'embauche", value: "78%", icon: Award },
    { label: "Entreprises partenaires", value: "124", icon: Building },
  ];

  return (
    <>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="bg-white/40 border-white/60 text-[#556B2F]"
          >
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher un stage, une alternance, un métier..."
            className="pl-12 py-7 text-lg rounded-xl border-0 shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            className="absolute right-2 top-2 bg-[#8B4513] hover:bg-[#6B3410] text-white px-8"
            onClick={handleSearch}
          >
            Rechercher
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-[#D3D3D3]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type */}
              <div>
                <h3 className="font-semibold mb-3 text-[#8B4513]">Type</h3>
                <div className="space-y-3">
                  {types.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.id}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedType === type.id
                            ? "bg-[#556B2F]/10 border border-[#556B2F]"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedType(type.id)}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            selectedType === type.id
                              ? "bg-[#556B2F] text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{type.label}</span>
                            {selectedType === type.id && (
                              <div className="w-2 h-2 rounded-full bg-[#556B2F]"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-[#D3D3D3]" />

              {/* Niveau d'étude */}
              <div>
                <h3 className="font-semibold mb-3 text-[#8B4513]">
                  Niveau d'étude
                </h3>
                <div className="space-y-2">
                  {niveaux.map((niveau) => (
                    <div
                      key={niveau.id}
                      className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer"
                      onClick={() => setSelectedNiveau(niveau.id)}
                    >
                      <Checkbox
                        checked={selectedNiveau === niveau.id}
                        onCheckedChange={() => setSelectedNiveau(niveau.id)}
                      />
                      <Badge className={niveau.color}>{niveau.label}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F] hover:text-white transition-colors"
                onClick={handleResetFilters}
              >
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>

          {/* Guide Étudiant */}
          <Card className="mt-4 border-[#556B2F]">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 text-[#8B4513] flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Guide étudiant
              </h3>
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-[#556B2F]/10"
                  onClick={() => handleDownloadGuide("CV étudiant")}
                >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Rédiger un CV étudiant
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-[#556B2F]/10"
                  onClick={() => handleDownloadGuide("Lettre de motivation")}
                >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Lettre de motivation type
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-[#556B2F]/10"
                  onClick={() => handleDownloadGuide("Préparation entretien")}
                >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Préparer un entretien
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Progress Steps */}
          <Card className="mb-6 border-[#D3D3D3]">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-[#8B4513] mb-2">
                  Votre recherche en 4 étapes
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                        researchProgress >= 25
                          ? "bg-[#556B2F] text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      1
                    </div>
                    <div className="text-xs">Profil</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                        researchProgress >= 50
                          ? "bg-[#6B8E23] text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      2
                    </div>
                    <div className="text-xs">Recherche</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                        researchProgress >= 75
                          ? "bg-[#556B2F] text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      3
                    </div>
                    <div className="text-xs">Candidature</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                        researchProgress >= 100
                          ? "bg-[#6B8E23] text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      4
                    </div>
                    <div className="text-xs">Entretien</div>
                  </div>
                </div>
                <Progress value={researchProgress} className="mt-2" />
                <p className="text-xs text-gray-500 mt-2">
                  Progression : {researchProgress}% complété
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Offres List */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="alternance">Alternances</TabsTrigger>
              <TabsTrigger value="stage">Stages</TabsTrigger>
              <TabsTrigger value="sauvegardees">
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    savedItems.filter((id) => id.startsWith("alternance-"))
                      .length > 0
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
                Favoris (
                {savedItems.filter((id) => id.startsWith("alternance-")).length}
                )
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="border-[#D3D3D3] animate-pulse">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredOffres.length > 0 ? (
                filteredOffres.map((offre) => {
                  const OffreIcon = offre.icon;
                  const isApplied = appliedItems.includes(
                    `alternance-${offre.id}`
                  );
                  const isSaved = savedItems.includes(
                    `alternance-${offre.id}`
                  );

                  return (
                    <Card
                      key={offre.id}
                      className={`border-[#D3D3D3] hover:shadow-lg transition-shadow duration-300 ${
                        isApplied ? "border-green-500 bg-green-50/30" : ""
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Logo */}
                          <div className="flex-shrink-0">
                            <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-[#556B2F] to-[#6B8E23] flex items-center justify-center text-white">
                              <OffreIcon className="h-8 w-8" />
                              {isApplied && (
                                <div className="absolute -top-1 -right-1">
                                  <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Détails */}
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  {offre.urgent && (
                                    <Badge className="bg-red-100 text-red-800 border-red-200">
                                      <Zap className="h-3 w-3 mr-1" />
                                      Urgent
                                    </Badge>
                                  )}
                                  <Badge className="bg-[#556B2F] text-white">
                                    {
                                      types.find((t) => t.id === offre.type)
                                        ?.label
                                    }
                                  </Badge>
                                  <Badge
                                    className={
                                      niveaux.find(
                                        (n) => n.id === offre.niveau
                                      )?.color
                                    }
                                  >
                                    {
                                      niveaux.find(
                                        (n) => n.id === offre.niveau
                                      )?.label
                                    }
                                  </Badge>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {offre.title}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                  <Building className="h-4 w-4" />
                                  <span className="font-medium">
                                    {offre.entreprise}
                                  </span>
                                  <MapPin className="h-4 w-4 ml-2" />
                                  <span>{offre.location}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-[#8B4513] mb-1">
                                  {offre.remuneration}
                                </div>
                                <p className="text-sm text-gray-500">
                                  {offre.date}
                                </p>
                              </div>
                            </div>

                            <p className="text-gray-700 mb-3 line-clamp-2">
                              {offre.description}
                            </p>

                            <div className="mb-4">
                              <h4 className="font-semibold text-[#556B2F] mb-2">
                                Missions :
                              </h4>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {offre.missions
                                  .slice(0, 3)
                                  .map((mission, idx) => (
                                    <li key={idx}>{mission}</li>
                                  ))}
                              </ul>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="flex flex-wrap gap-2">
                                {offre.competences
                                  .slice(0, 4)
                                  .map((comp, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="bg-gray-100"
                                    >
                                      {comp}
                                    </Badge>
                                  ))}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    toggleSavedItem(offre.id, "alternance")
                                  }
                                  className={`border-gray-300 ${
                                    isSaved
                                      ? "text-red-500 border-red-300 bg-red-50"
                                      : ""
                                  }`}
                                >
                                  <Heart
                                    className={`h-4 w-4 mr-1 ${
                                      isSaved ? "fill-red-500" : ""
                                    }`}
                                  />
                                  Favoris
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-300"
                                  onClick={() =>
                                    handleShare(offre, "alternance")
                                  }
                                >
                                  <Share2 className="h-4 w-4 mr-1" />
                                  Partager
                                </Button>
                                <Button
                                  size="sm"
                                  className={`${
                                    isApplied
                                      ? "bg-green-600 hover:bg-green-700"
                                      : "bg-[#8B4513] hover:bg-[#6B3410]"
                                  } text-white`}
                                  onClick={() =>
                                    handleApply(
                                      offre.id,
                                      "alternance",
                                      offre.title
                                    )
                                  }
                                >
                                  {isApplied ? "✓ Postulé" : "Postuler"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className="border-[#D3D3D3]">
                  <CardContent className="pt-12 pb-12 text-center">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Aucune offre ne correspond à vos critères
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Essayez de modifier vos critères de recherche
                    </p>
                    <Button variant="outline" onClick={handleResetFilters}>
                      Voir toutes les offres
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Resources Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-[#556B2F]">
              <CardHeader>
                <CardTitle className="text-[#8B4513]">
                  Ressources étudiants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleDownloadGuide("Guide alternance")}
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Guide de l'alternance</h4>
                      <p className="text-sm text-gray-500">
                        Tout savoir sur les contrats et droits
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleDownloadGuide("Calendrier 2024")}
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Calendrier 2024</h4>
                      <p className="text-sm text-gray-500">
                        Dates clés pour vos recherches
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#6B8E23] bg-gradient-to-br from-[#556B2F]/5 to-[#6B8E23]/5">
              <CardHeader>
                <CardTitle className="text-[#8B4513]">
                  Événements à venir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#556B2F] pl-4 py-2">
                    <div className="text-sm text-gray-500">15 Mars 2024</div>
                    <h4 className="font-medium">Forum Alternance Paris</h4>
                    <p className="text-sm text-gray-600">
                      Rencontrez 50+ entreprises
                    </p>
                  </div>
                  <div className="border-l-4 border-[#6B8E23] pl-4 py-2">
                    <div className="text-sm text-gray-500">22 Mars 2024</div>
                    <h4 className="font-medium">
                      Webinar : CV étudiant parfait
                    </h4>
                    <p className="text-sm text-gray-600">
                      Conseils d'un recruteur
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full mt-4 bg-[#556B2F] hover:bg-[#6B8E23] text-white"
                  onClick={handleOpenEvents}
                >
                  Voir tous les événements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlternanceSection;