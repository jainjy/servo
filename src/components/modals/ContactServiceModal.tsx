// components/modals/ContactServiceModal.jsx
import React, { useState } from "react";
import {
  X,
  Send,
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const ContactServiceModal = ({
  isOpen,
  onClose,
  service = null,
  professional = null,
  messageType = "service",
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    senderName: user ? `${user.firstName} ${user.lastName}` : "",
    senderEmail: user?.email || "",
    senderPhone: user?.phone || "",
    subject: service
      ? `Demande de renseignements: ${service.libelle}`
      : "Nouvelle demande",
    message: "",
    messageType,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/contact-messages", {
        ...formData,
        recipientId: professional?.id,
        serviceId: service?.id,
        userId: user?.id,
      });

      if (response.data.success) {
        toast({
          title: "Message envoyé !",
          description: "Votre message a été envoyé au professionnel.",
          variant: "default",
        });

        // Réinitialiser le formulaire
        setFormData({
          senderName: user ? `${user.firstName} ${user.lastName}` : "",
          senderEmail: user?.email || "",
          senderPhone: user?.phone || "",
          subject: service
            ? `Demande de renseignements: ${service.libelle}`
            : "Nouvelle demande",
          message: "",
          messageType,
        });

        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Contacter{" "}
              {professional?.companyName ||
                professional?.firstName ||
                "le professionnel"}
            </h2>
            {service && (
              <p className="text-sm text-gray-600 mt-1">
                À propos de : {service.libelle}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nom complet */}
          <div className="space-y-2">
            <Label htmlFor="senderName">
              <User className="inline h-4 w-4 mr-2" />
              Nom complet
            </Label>
            <Input
              id="senderName"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              placeholder="Votre nom et prénom"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="senderEmail">
              <Mail className="inline h-4 w-4 mr-2" />
              Email
            </Label>
            <Input
              id="senderEmail"
              name="senderEmail"
              type="email"
              value={formData.senderEmail}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
            />
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="senderPhone">
              <Phone className="inline h-4 w-4 mr-2" />
              Téléphone
            </Label>
            <Input
              id="senderPhone"
              name="senderPhone"
              type="tel"
              value={formData.senderPhone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
            />
          </div>

          {/* Sujet */}
          <div className="space-y-2">
            <Label htmlFor="subject">Sujet</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Objet de votre message"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">
              <MessageSquare className="inline h-4 w-4 mr-2" />
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={`Bonjour, je suis intéressé(e) par votre service${
                service ? ` "${service.libelle}"` : ""
              }. Pouvez-vous me renseigner sur :`}
              rows={6}
              required
            />
            <p className="text-xs text-gray-500">
              Décrivez votre projet, votre budget estimé, vos délais...
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Envoi en cours...
                </div>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer
                </>
              )}
            </Button>
          </div>

          {/* Informations de contact du professionnel */}
          {professional && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-2">
                Contact du professionnel
              </h4>
              <div className="space-y-2 text-sm">
                {professional.companyName && (
                  <p className="text-gray-700">
                    <span className="font-medium">Entreprise :</span>{" "}
                    {professional.companyName}
                  </p>
                )}
                {professional.email && (
                  <p className="text-gray-700">
                    <span className="font-medium">Email :</span>{" "}
                    {professional.email}
                  </p>
                )}
                {professional.phone && (
                  <p className="text-gray-700">
                    <span className="font-medium">Téléphone :</span>{" "}
                    {professional.phone}
                  </p>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactServiceModal;
