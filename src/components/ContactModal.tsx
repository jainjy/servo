// components/ContactModal.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, X, User, Phone, Mail, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: {
    id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    commercialName?: string;
    metiers: Array<{
      metier: {
        id: number;
        libelle: string;
      };
    }>;
  };
}

export const ContactModal = ({
  isOpen,
  onClose,
  professional,
}: ContactModalProps) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        nom: user.lastName || "",
        prenom: user.firstName || "",
        email: user.email || "",
        telephone: "",
        message: "",
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const contactData = {
        senderName: `${formData.nom} ${formData.prenom}`.trim(),
        senderEmail: formData.email,
        senderPhone: formData.telephone,
        subject: `Contact depuis le profil de ${professional.firstName} ${professional.lastName}`,
        message: formData.message,
        recipientId: professional.id,
        userId: user?.id,
        messageType: "professional",
      };

      const response = await api.post("/contact-messages", contactData);

      if (response.status === 201) {
        toast.success("Votre message a été envoyé avec succès !");
        onClose();
      }
    } catch (error) {
      console.error("Erreur envoi message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête du modal */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Contacter {professional.firstName}
              </h2>
              <p className="text-gray-600 text-sm">
                {professional.commercialName || professional.companyName}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nom et Prénom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Nom *
              </label>
              <Input
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Prénom *
              </label>
              <Input
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Votre prénom"
                required
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email et Téléphone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email *
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Téléphone
              </label>
              <Input
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="06 12 34 56 78"
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre message *
            </label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={`Bonjour ${
                professional.firstName
              }, je souhaiterais vous contacter concernant vos services en ${professional.metiers
                .map((m) => m.metier.libelle)
                .join(", ")}...`}
              rows={4}
              required
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          {/* Informations professionnel */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Professionnel contacté
            </h3>
            <p className="text-gray-800 text-sm">
              {professional.firstName} {professional.lastName}
            </p>
            <p className="text-gray-600 text-xs">
              Spécialisé en{" "}
              {professional.metiers.map((m) => m.metier.libelle).join(", ")}
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              className="flex-1 bg-slate-900 hover:bg-slate-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <MessageCircle className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
