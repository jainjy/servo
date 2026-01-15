// components/pro/admin-access-modal.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Loader2, KeyRound, AlertCircle, CheckCircle, Mail, Building, User } from "lucide-react";
import EmailApiService from "../../services/emailApi";

const theme = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
};

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  defaultProviderEmail?: string;
}

export function AdminAccessModal({ 
  isOpen, 
  onClose, 
  providerName,
  defaultProviderEmail = ""
}: AdminAccessModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Emails administrateurs pré-définis
  const ADMIN_EMAILS = ["admin@oliplus.re", "direction@oliplus.re"];

  // Obtenir le nom du prestataire connecté
  const getProviderName = () => {
    if (!user) return providerName || "Prestataire";
    
    // Utiliser l'utilisateur connecté (prestataire)
    return user.name || user.fullName || user.username || user.email?.split('@')[0] || providerName || "Prestataire";
  };

  // Obtenir l'email du prestataire connecté
  const getProviderEmail = () => {
    if (!user) return defaultProviderEmail;
    return user.email || defaultProviderEmail;
  };

  // Réinitialiser les champs quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setEmailError("");
      setSuccessMessage("");
      setErrorMessage("");
      setShowSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Envoyer à chaque email administrateur
      const emailPromises = ADMIN_EMAILS.map(email => 
        EmailApiService.sendProviderRgpd({
          email: email, // Email qui recevra la demande
          providerName: getProviderName() // Nom du prestataire
        })
      );

      // Attendre que tous les emails soient envoyés
      const results = await Promise.all(emailPromises);

      // Vérifier si tous les envois ont réussi
      const allSuccess = results.every(result => result.success);
      
      if (allSuccess) {
        const emailsList = ADMIN_EMAILS.join(" et ");
        setSuccessMessage(
          `Demande RGPD envoyée avec succès à ${emailsList}`
        );
        setShowSuccess(true);

        setTimeout(() => {
          onClose();
          setShowSuccess(false);
        }, 3000);
      } else {
        // Collecter les erreurs
        const errors = results
          .filter(result => !result.success)
          .map(result => result.error || "Erreur inconnue")
          .join(", ");
        
        setErrorMessage(`Erreur lors de l'envoi: ${errors}`);
      }
    } catch (err: any) {
      console.error("Erreur détaillée:", err);
      setErrorMessage(
        err?.response?.data?.error || 
        err?.message || 
        "Une erreur est survenue lors de l'envoi des emails"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md" 
        style={{ 
          backgroundColor: theme.lightBg,
          borderColor: theme.separator 
        }}
      >
        <DialogHeader>
          <DialogTitle 
            className="flex items-center gap-2"
            style={{ color: theme.logo }}
          >
            <KeyRound className="h-5 w-5" />
            Demande de confirmation RGPD
          </DialogTitle>
          <DialogDescription style={{ color: theme.secondaryText }}>
            Envoyer une demande de confirmation RGPD aux administrateurs
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {showSuccess && successMessage && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {successMessage}
              </p>
            </div>
          )}

          {errorMessage && !showSuccess && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </p>
            </div>
          )}

          {/* Section Prestataire connecté */}
          <div className="space-y-2">
            <Label 
              className="flex items-center gap-2"
              style={{ color: theme.secondaryText }}
            >
              <Building className="h-4 w-4" />
              Prestataire expéditeur
            </Label>

            <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm font-medium">{getProviderName()}</p>
              {getProviderEmail() && (
                <p className="text-xs text-gray-500">{getProviderEmail()}</p>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Vous envoyez une demande de confirmation RGPD
            </p>
          </div>

          {/* Section Emails administrateurs (pré-définis et en lecture seule) */}
          <div className="space-y-2">
            <Label 
              className="flex items-center gap-2"
              style={{ color: theme.secondaryText }}
            >
              <Mail className="h-4 w-4" />
              Emails des administrateurs *
            </Label>
            
            <div className="space-y-2">
              {ADMIN_EMAILS.map((email, index) => (
                <div key={index} className="relative">
                  <Input
                    type="email"
                    value={email}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                    style={{ 
                      borderColor: theme.separator,
                      color: theme.secondaryText
                    }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Lecture seule
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500">
              La demande sera envoyée simultanément aux deux adresses administratives
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Information importante</p>
                <p className="mt-1">
                  La demande RGPD sera envoyée automatiquement aux deux adresses administratives pré-définies. Vous n'avez pas besoin de saisir d'adresse email.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              style={{ 
                borderColor: theme.separator,
                color: theme.secondaryText
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="gap-2"
              disabled={isLoading}
              style={{ 
                backgroundColor: isLoading ? "#9ca3af" : theme.logo,
                color: "#FFFFFF"
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer la Demande
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}