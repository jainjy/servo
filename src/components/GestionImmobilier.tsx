import { useState, useEffect, useRef } from "react";
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
import { motion } from "framer-motion";
import gsap from "gsap";
import AdvertisementPopup from "./AdvertisementPopup";

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

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const ctaRef = useRef(null);

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

  // Animations GSAP
  useEffect(() => {
    // Animation Hero
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Animation Stats avec stagger
    gsap.fromTo(
      ".stat-item",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
      }
    );

    // Animation Services
    gsap.fromTo(
      ".service-card",
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 70%",
        },
      }
    );

    // Animation CTA
    gsap.fromTo(
      ".cta-content",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
        },
      }
    );

    // Animation des titres
    gsap.fromTo(
      ".title-animate",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".title-animate",
          start: "top 85%",
        },
      }
    );
  }, []);

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

    if (!user || !isAuthenticated) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour faire une demande de devis",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("auth-token");
    if (!token) {
      toast({
        title: "Erreur de session",
        description: "Votre session a expiré, veuillez vous reconnecter",
        variant: "destructive",
      });
      return;
    }

    try {
      const demandeData = {
        serviceId: parseInt(selectedService),
        description: formData.message,
        dateSouhaitee: formData.dateSouhaitee ? new Date(formData.dateSouhaitee).toISOString() : null,
        montantHT: 0,
        tva: 20,
        conditions: formData.typeBien ? `Type de bien: ${formData.typeBien}\nAdresse: ${formData.adresse}` : undefined,
        clientId: user.id
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
    // console.log("Formulaire contact soumis:", contactFormData);
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Advertisement Popup - Absolute Position */}
      <div className="absolute top-12 left-4 right-4 z-50">
        <AdvertisementPopup />
      </div>

      {/* Hero Section avec animation */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-16 bg-[#556B2F]  overflow-hidden"
        ref={heroRef}
      >
        {/* Image de fond avec opacité */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center z-0 opacity-70"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8)),url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          }}
        />

        {/* Contenu */}
        <div className="container mx-auto px-4 py-2 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Gestion Immobilière{" "}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-[#6B8E23] inline-block"
              >
                Professionnelle
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-sm text-white mb-6 max-w-2xl mx-auto leading-relaxed opacity-90"
            >
              Des solutions complètes pour propriétaires bailleurs. Confiez-nous
              la gestion de votre patrimoine en toute sérénité.
            </motion.p>

            <motion.div
              variants={staggerChildren}
              initial="initial"
              animate="animate"
              className="flex flex-wrap gap-3 pt-4 justify-center"
            >
              <motion.div variants={fadeInUp}>
                <Button
                  className="bg-[#8B4513] hover:bg-[#6B8E23] text-white px-6 py-3 text-base rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                  onClick={() =>
                    document
                      .getElementById("services")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Découvrir nos services
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Button
                  className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#556B2F] px-6 py-3 text-base rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                  onClick={() => setIsModalOpen(true)}
                >
                  Demander un devis
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-12" ref={statsRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item text-center bg-white py-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#8B4513] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-800 font-medium text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Services Section */}
      <section id="services" className="py-12 bg-gray-50" ref={servicesRef}>
        <div className="container mx-auto px-4">

          <h2 className=" text-2xl text-center md:text-3xl font-bold text-[#8B4513] mb-4">
            Nos Services de Gestion
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une gamme complète de services pour optimiser la gestion de votre
            bien immobilier
          </p>


          {/* Service Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={activeService === service.id ? "default" : "outline"}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${activeService === service.id
                      ? "bg-[#6B8E23] text-white"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  onClick={() => setActiveService(service.id)}
                >
                  <service.icon className="h-3 w-3 mr-2" />
                  {service.title.split(" ")[0]}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Service Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-12 border border-gray-200"
          >
            {currentService && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#6B8E23] bg-opacity-10 rounded-xl flex items-center justify-center mr-3">
                      <currentService.icon className="h-6 w-6 text-[#6B8E23]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#8B4513]">
                        {currentService.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {currentService.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {currentService.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 text-[#6B8E23] mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <div className="text-base font-bold text-[#8B4513]">
                        {currentService.price}
                      </div>
                      <div className="text-gray-600 text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentService.duration}
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className="bg-transparent border-2 border-[#8B4513] hover:bg-[#8B4513] hover:text-white text-[#8B4513] rounded-lg text-sm px-4 py-2 transition-all duration-300"
                        onClick={() => handleServiceClick(currentService.id)}
                      >
                        Choisir ce service
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Right Column - Visual */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-[#6B8E23]/10 to-[#556B2F]/10 rounded-xl p-6 flex items-center justify-center"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-4 border border-gray-200"
                    >
                      <Shield className="h-8 w-8 text-[#6B8E23]" />
                    </motion.div>
                    <h4 className="text-lg font-bold text-[#8B4513] mb-2">
                      Garantie Satisfaction
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Service professionnel avec accompagnement personnalisé et
                      suivi rigoureux
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Additional Services Grid */}
          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className="service-card"
              >
                <Card
                  className="p-5 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-2"
                  onClick={() => setActiveService(service.id)}
                >
                  <div className="w-10 h-10 bg-[#6B8E23] bg-opacity-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#6B8E23] transition-colors">
                    <service.icon className="h-5 w-5 text-[#6B8E23] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#8B4513] text-sm mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3">
                    {service.description}
                  </p>
                  <div className="text-[#6B8E23] font-semibold text-xs">
                    {service.price}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section 
      <motion.section
        ref={ctaRef}
        className="py-16 bg-[#556B2F] rounded-lg mx-4 md:mx-8 lg:mx-16 mb-16"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center cta-content">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Prêt à optimiser votre patrimoine ?
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Rejoignez les centaines de propriétaires qui nous font confiance
              pour la gestion de leur bien immobilier
            </p>
            <motion.div
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              className="flex flex-wrap gap-3 justify-center"
            >
              <motion.div variants={fadeInUp}>
                <Button
                  className="bg-white hover:bg-gray-100 text-[#556B2F] px-6 py-3 text-base rounded-lg transition-all duration-300 hover:scale-105"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Demander un audit gratuit
                </Button>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Button
                  className="border-white bg-[#556B2F] text-white hover:bg-white/10 px-6 py-3 text-base rounded-lg transition-all duration-300 hover:scale-105"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Nous écrire
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      */}

      {/* Modal Devis */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-[#8B4513]">
              <span>Demande de Devis</span>
            </DialogTitle>
          </DialogHeader>
          <hr className="border-gray-200" />
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6 p-1"
          >
            {/* Service Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Service souhaité *
              </label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
                required
              >
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Sélectionnez un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center">
                        <service.icon className="h-4 w-4 mr-2 text-[#6B8E23]" />
                        {service.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <Input
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre nom"
                  className="border-gray-300"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <Input
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre prénom"
                  className="border-gray-300"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <Input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre numéro"
                  className="border-gray-300"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="votre@email.com"
                className="border-gray-300"
              />
            </motion.div>

            {/* Property Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de bien
                </label>
                <Select
                  name="typeBien"
                  value={formData.typeBien}
                  onValueChange={(value) =>
                    setFormData({ ...formData, typeBien: value })
                  }
                >
                  <SelectTrigger className="border-gray-300">
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date souhaitée
                </label>
                <Input
                  name="dateSouhaitee"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.dateSouhaitee}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse du bien
              </label>
              <Input
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                placeholder="Adresse complète du bien"
                className="border-gray-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message supplémentaire
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Décrivez votre situation et vos besoins..."
                rows={4}
                className="border-gray-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                type="submit"
                className="w-full bg-[#6B8E23] hover:bg-[#556B2F] text-white py-3 rounded-lg text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
                disabled={!selectedService}

              >
                Envoyer ma demande
              </Button>
            </motion.div>

            <p className="text-xs text-gray-500 text-center">
              * Champs obligatoires. Nous vous recontacterons dans les 24 heures
              ouvrables.
            </p>
          </motion.form>
        </DialogContent>
      </Dialog>

      {/* Modal Contact - Nous écrire */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-[#8B4513]">
              <span className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-[#6B8E23]" />
                Nous écrire
              </span>
            </DialogTitle>
          </DialogHeader>
          <hr className="border-gray-200" />
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleContactSubmit}
            className="space-y-6 p-1"
          >
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <Input
                  name="nom"
                  value={contactFormData.nom}
                  onChange={handleContactInputChange}
                  required
                  placeholder="Votre nom"
                  className="border-gray-300"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <Input
                  name="telephone"
                  value={contactFormData.telephone}
                  onChange={handleContactInputChange}
                  placeholder="Votre numéro"
                  className="border-gray-300"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <Input
                name="email"
                type="email"
                value={contactFormData.email}
                onChange={handleContactInputChange}
                required
                placeholder="votre@email.com"
                className="border-gray-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet *
              </label>
              <Select
                value={contactFormData.sujet}
                onValueChange={(value) =>
                  setContactFormData({ ...contactFormData, sujet: value })
                }
                required
              >
                <SelectTrigger className="w-full border-gray-300">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <Textarea
                name="message"
                value={contactFormData.message}
                onChange={handleContactInputChange}
                placeholder="Décrivez votre demande en détail..."
                rows={6}
                required
                className="border-gray-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-[#6B8E23] bg-opacity-10 p-4 rounded-lg border border-[#6B8E23] border-opacity-20"
            >
              <div className="flex items-start">
                <Phone className="h-4 w-4 text-[#6B8E23] mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#6B8E23] font-medium">
                    Besoin d'une réponse rapide ?
                  </p>
                  <p className="text-xs text-gray-600">
                    Appelez-nous au{" "}
                    <span className="font-semibold">01 23 45 67 89</span> du
                    lundi au vendredi de 9h à 18h
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                className="w-full bg-[#6B8E23] hover:bg-[#556B2F] text-white py-3 rounded-lg text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
              >
                <Mail className="h-4 w-4 mr-2" />
                Envoyer mon message
              </Button>
            </motion.div>

            <p className="text-xs text-gray-500 text-center">
              * Champs obligatoires. Nous vous répondrons dans les plus brefs
              délais.
            </p>
          </motion.form>
        </DialogContent>
      </Dialog>

       <AdvertisementPopup />
    </div>
  );
};

export default GestionImmobilier;