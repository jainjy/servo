import { useState } from "react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demandeDevisAPI } from "@/services/demandeDevis";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Home,
  FileText,
  ClipboardList,
  TrendingUp,
  CheckCircle,
  Shield,
  Clock,
  Users,
  Award,
  ArrowRight,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Euro,
} from "lucide-react";

const GestionImmobilier = () => {
  const [activeService, setActiveService] = useState("gestion");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    typeBien: "",
    message: "",
    dateSouhaitee: "",
  });

  const [contactFormData, setContactFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });

  const services = [
    {
      id: "gestion",
      title: "Mise en Gestion de Votre Bien",
      description:
        "Confiez la gestion complète de votre bien immobilier à nos experts",
      icon: Home,
      features: [
        "Recherche et sélection de locataires",
        "Gestion des loyers et charges",
        "Entretien et maintenance",
        "Relation locative complète",
        "Suivi administratif et juridique",
      ],
      price: "À partir de 6% du loyer HT",
      duration: "Engagement 3 ans",
    },
    {
      id: "bail",
      title: "Rédaction de Bail",
      description: "Bail personnalisé et sécurisé conforme à la législation",
      icon: FileText,
      features: [
        "Bail personnalisé selon votre bien",
        "Conforme à la loi ALUR",
        "Clauses spécifiques adaptées",
        "Double exemplaire certifié",
        "Conseils juridiques inclus",
      ],
      price: "190€ TTC",
      duration: "Délai 48h",
    },
    {
      id: "etat-lieux",
      title: "État des Lieux",
      description: "État des lieux détaillé et contradictoire avec photos",
      icon: ClipboardList,
      features: [
        "État des lieux d'entrée et sortie",
        "Photos haute définition",
        "Description détaillée du bien",
        "Signature électronique",
        "Archivage sécurisé 10 ans",
      ],
      price: "150€ TTC",
      duration: "2 heures en moyenne",
    },
    {
      id: "revenu",
      title: "Optimisation Revenu Foncier",
      description: "Maximisez votre rendement et optimisez votre fiscalité",
      icon: TrendingUp,
      features: [
        "Analyse de rentabilité",
        "Optimisation fiscale",
        "Simulation d'investissement",
        "Conseils en défiscalisation",
        "Suivi performance patrimoniale",
      ],
      price: "À partir de 300€",
      duration: "Étude personnalisée",
    },
  ];

  const stats = [
    { number: "500+", label: "Biens gérés" },
    { number: "98%", label: "Taux de satisfaction" },
    { number: "24h", label: "Temps de réponse moyen" },
    { number: "15+", label: "Années d'expérience" },
  ];

  const sujetsContact = [
    "Demande d'information générale",
    "Question sur nos services",
    "Support technique",
    "Réclamation",
    "Partenariat",
    "Autre",
  ];

  const handleServiceClick = (serviceId) => {
    setSelectedService(serviceId);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactInputChange = (e) => {
    setContactFormData({
      ...contactFormData,
      [e.target.name]: e.target.value,
    });
  };

  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug logs
    console.log("État de l'authentification:", {
      user,
      isAuthenticated: Boolean(user),
    });
    console.log("Token stocké:", localStorage.getItem("auth-token"));

    if (!user || !isAuthenticated) {
      console.error("Utilisateur non authentifié:", { user, isAuthenticated });
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour faire une demande de devis",
        variant: "destructive",
      });
      return;
    }

    // Vérifier le token
    const token = localStorage.getItem("auth-token");
    if (!token) {
      console.error("Token manquant");
      toast({
        title: "Erreur de session",
        description: "Votre session a expiré, veuillez vous reconnecter",
        variant: "destructive",
      });
      return;
    }

    try {
      const demandeData = {
        serviceId: parseInt(selectedService), // Assurons-nous que c'est un nombre
        description: formData.message,
        dateSouhaitee: formData.dateSouhaitee ? new Date(formData.dateSouhaitee).toISOString() : null,
        montantHT: 0, // Sera défini par le prestataire
        tva: 20, // Taux par défaut
        conditions: formData.typeBien ? `Type de bien: ${formData.typeBien}\nAdresse: ${formData.adresse}` : undefined,
        clientId: user.id // Important : identifiant du client
      };

      const response = await demandeDevisAPI.creerDemande(demandeData);

      toast({
        title: "Succès",
        description: "Votre demande de devis a été envoyée avec succès !",
        variant: "default",
      });

      setIsModalOpen(false);
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        typeBien: "",
        message: "",
        dateSouhaitee: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi
    console.log("Formulaire contact soumis:", contactFormData);
    alert(
      "Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais."
    );
    setIsContactModalOpen(false);
    setContactFormData({
      nom: "",
      email: "",
      telephone: "",
      sujet: "",
      message: "",
    });
  };

  const currentService = services.find(
    (service) => service.id === activeService
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section Améliorée */}
      <section className="relative py-16 bg-slate-900 overflow-hidden">
        {/* Image de fond avec opacité */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-70"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.8)),url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          }}
        />

        {/* Contenu */}
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center h-40">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Gestion Immobilière{" "}
              <span className=" text-blue-900">Professionnelle</span>
            </h1>
            <p className="text-sm text-slate-200 mb-6 max-w-2xl mx-auto leading-relaxed">
              Des solutions complètes pour propriétaires bailleurs. Confiez-nous
              la gestion de votre patrimoine en toute sérénité. Des solutions
              complètes pour propriétaires bailleurs. Confiez-nous la gestion de
              votre patrimoine en toute sérénité.
            </p>

            <div className="flex flex-wrap gap-3 pt-4 justify-center">
              <Button
                className="bg-blue-950 hover:bg-slate-700 text-white px-6 py-3 text-base rounded-lg transition-all duration-300"
                onClick={() =>
                  document
                    .getElementById("services")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Découvrir nos services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                className="border-white text-black bg-white hover:bg-white hover:text-slate-900 px-6 py-3 text-base rounded-lg transition-all duration-300"
                onClick={() => setIsModalOpen(true)}
              >
                Demander un devis
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white py-8 rounded-lg shadow-sm"
              >
                <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-8 mt-5 rounded-lg bg-white ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Nos Services de Gestion
            </h2>
            <p className="text-md text-slate-600 max-w-2xl mx-auto">
              Une gamme complète de services pour optimiser la gestion de votre
              bien immobilier
            </p>
          </div>

          {/* Service Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {services.map((service) => (
              <Button
                key={service.id}
                variant={activeService === service.id ? "default" : "outline"}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  activeService === service.id
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
                onClick={() => setActiveService(service.id)}
              >
                <service.icon className="h-3 w-3 mr-2" />
                {service.title.split(" ")[0]}
              </Button>
            ))}
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
            {currentService && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Content */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                      <currentService.icon className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {currentService.title}
                      </h3>
                      <p className="text-slate-600 text-sm mt-1">
                        {currentService.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {currentService.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="text-base font-bold text-slate-900">
                        {currentService.price}
                      </div>
                      <div className="text-slate-600 text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentService.duration}
                      </div>
                    </div>
                    <Button
                      className="bg-transparent border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 rounded-lg text-sm px-4 py-2"
                      onClick={() => handleServiceClick(currentService.id)}
                    >
                      Choisir ce service
                    </Button>
                  </div>
                </div>

                {/* Right Column - Visual */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-100 rounded-xl p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                      Garantie Satisfaction
                    </h4>
                    <p className="text-slate-600 text-sm">
                      Service professionnel avec accompagnement personnalisé et
                      suivi rigoureux
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => (
              <Card
                key={service.id}
                className="p-5 border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveService(service.id)}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                  <service.icon className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-xs mb-3">
                  {service.description}
                </p>
                <div className="text-blue-600 font-semibold text-xs">
                  {service.price}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Prêt à optimiser votre patrimoine ?
            </h2>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              Rejoignez les centaines de propriétaires qui nous font confiance
              pour la gestion de leur bien immobilier
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                className="bg-slate-900 hover:border-2 border-slate-900 hover:bg-transparent text-white hover:text-slate-900 px-6 py-3 text-base rounded-lg"
                onClick={() => setIsModalOpen(true)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Demander un audit gratuit
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 px-6 py-3 text-base rounded-lg"
                onClick={() => setIsContactModalOpen(true)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Nous écrire
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Devis */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Demande de Devis</span>
            </DialogTitle>
          </DialogHeader>
          <hr />
          <form onSubmit={handleSubmit} className="space-y-6 p-1">
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Service souhaité *
              </label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center">
                        <service.icon className="h-4 w-4 mr-2" />
                        {service.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nom *
                </label>
                <Input
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Prénom *
                </label>
                <Input
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Téléphone *
                </label>
                <Input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre numéro"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="votre@email.com"
              />
            </div>

            {/* Property Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type de bien
                </label>
                <Select
                  name="typeBien"
                  value={formData.typeBien}
                  onValueChange={(value) =>
                    setFormData({ ...formData, typeBien: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de bien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="maison">Maison</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="local-commercial">
                      Local commercial
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date souhaitée
                </label>
                <Input
                  name="dateSouhaitee"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.dateSouhaitee}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Adresse du bien
              </label>
              <Input
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                placeholder="Adresse complète du bien"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message supplémentaire
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Décrivez votre situation et vos besoins..."
                rows={4}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-blue-700 text-white py-3 rounded-lg text-base font-semibold"
              disabled={!selectedService}
            >
              Envoyer ma demande
            </Button>

            <p className="text-xs text-slate-500 text-center">
              * Champs obligatoires. Nous vous recontacterons dans les 24 heures
              ouvrables.
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Contact - Nous écrire */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-slate-600" />
                Nous écrire
              </span>
            </DialogTitle>
          </DialogHeader>
          <hr />
          <form onSubmit={handleContactSubmit} className="space-y-6 p-1">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nom complet *
                </label>
                <Input
                  name="nom"
                  value={contactFormData.nom}
                  onChange={handleContactInputChange}
                  required
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Téléphone
                </label>
                <Input
                  name="telephone"
                  value={contactFormData.telephone}
                  onChange={handleContactInputChange}
                  placeholder="Votre numéro"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <Input
                name="email"
                type="email"
                value={contactFormData.email}
                onChange={handleContactInputChange}
                required
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sujet *
              </label>
              <Select
                value={contactFormData.sujet}
                onValueChange={(value) =>
                  setContactFormData({ ...contactFormData, sujet: value })
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un sujet" />
                </SelectTrigger>
                <SelectContent>
                  {sujetsContact.map((sujet, index) => (
                    <SelectItem key={index} value={sujet}>
                      {sujet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message *
              </label>
              <Textarea
                name="message"
                value={contactFormData.message}
                onChange={handleContactInputChange}
                placeholder="Décrivez votre demande en détail..."
                rows={6}
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Phone className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    Besoin d'une réponse rapide ?
                  </p>
                  <p className="text-xs text-blue-600">
                    Appelez-nous au{" "}
                    <span className="font-semibold">01 23 45 67 89</span> du
                    lundi au vendredi de 9h à 18h
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-700 text-white py-3 rounded-lg text-base font-semibold"
            >
              <Mail className="h-4 w-4 mr-2" />
              Envoyer mon message
            </Button>

            <p className="text-xs text-slate-500 text-center">
              * Champs obligatoires. Nous vous répondrons dans les plus brefs
              délais.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionImmobilier;
