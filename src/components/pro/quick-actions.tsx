// components/pro/quick-actions.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; // Import du hook useAuth
import { AdminAccessModal } from "./admin-access-modal"; // Import de la modale
import { Plus, Calendar, MessageSquare, FileText, Settings, Users, KeyRound } from "lucide-react";

const theme = {
  logo: "#556B2F",           
  primaryDark: "#6B8E23",   
  lightBg: "#FFFFFF",       
  separator: "#D3D3D3",     
  secondaryText: "#8B4513", 
};

// Données d'actions rapides
const quickActions = [
  {
    name: "Nouvelle annonce",
    description: "Publier un nouveau bien",
    icon: Plus,
    href: "/pro/listings",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    name: "Voir planning",
    description: "Consulter les réservations",
    icon: Calendar,
    href: "/pro/calendar",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Créer un devis",
    description: "Envoyer un devis",
    icon: FileText,
    href: "/pro/billing",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    name: "Paramètres",
    description: "Modifier le profil",
    icon: Settings,
    href: "/pro/settings",
    color: "text-gray-600",
    bgColor: "bg-gray-50"
  },
  {
    name: "Demande d'accès administrateur",
    description: "Demande d'accès au données",
    icon: KeyRound,
    href: "#",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    isModalAction: true // Nouvelle propriété pour identifier l'action modale
  },
];

export function QuickActions() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour gérer l'envoi de la demande
  const handleSendRequest = async (data: { email: string; name: string; message?: string }) => {
    console.log("Demande d'accès administrateur:", data);
    
  
    // Exemple:
    // try {
    //   const response = await api.post("/admin/access-request", {
    //     userId: user?.id,
    //     email: data.email,
    //     name: data.name,
    //     message: data.message,
    //     requestedAt: new Date().toISOString()
    //   });
    //   return response.data;
    // } catch (error) {
    //   throw error;
    // }
    
    // Simulation d'envoi pour l'instant
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Demande envoyée:", data);
        resolve();
      }, 1000);
    });
  };

  // Fonction pour gérer le clic sur une action
  const handleActionClick = (action: any) => {
    if (action.isModalAction) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card 
        className="p-6" 
        style={{ 
          backgroundColor: theme.lightBg,
          borderColor: theme.separator 
        }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold" style={{ color: theme.logo }}>Actions rapides</h3>
          <p className="text-sm" style={{ color: theme.secondaryText }}>Accédez rapidement aux fonctionnalités principales</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            // Si c'est une action qui ouvre une modale
            if (action.isModalAction) {
              return (
                <Button
                  key={action.name}
                  variant="outline"
                  className="w-full h-auto p-4 justify-start transition-colors"
                  style={{
                    borderColor: theme.separator,
                    backgroundColor: theme.lightBg,
                  }}
                  onClick={() => handleActionClick(action)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.primaryDark;
                    e.currentTarget.style.backgroundColor = `${theme.primaryDark}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.separator;
                    e.currentTarget.style.backgroundColor = theme.lightBg;
                  }}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bgColor} mr-3`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium" style={{ color: theme.logo }}>{action.name}</div>
                    <div className="text-xs" style={{ color: theme.secondaryText }}>{action.description}</div>
                  </div>
                </Button>
              );
            }
            
            // Sinon, c'est un lien normal
            return (
              <Link key={action.name} to={action.href}>
                <Button 
                  variant="outline" 
                  className="w-full h-auto p-4 justify-start transition-colors"
                  style={{
                    borderColor: theme.separator, 
                    backgroundColor: theme.lightBg,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.primaryDark;
                    e.currentTarget.style.backgroundColor = `${theme.primaryDark}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.separator;
                    e.currentTarget.style.backgroundColor = theme.lightBg;
                  }}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bgColor} mr-3`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium" style={{ color: theme.logo }}>{action.name}</div>
                    <div className="text-xs" style={{ color: theme.secondaryText }}>{action.description}</div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Modale pour la demande d'accès administrateur */}
      <AdminAccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSendRequest={handleSendRequest}
      />
    </>
  );
}