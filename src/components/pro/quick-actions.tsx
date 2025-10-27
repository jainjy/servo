// components/pro/quick-actions.tsx
import React from "react";
// Remplacement du Link de Next.js par le Link de React Router DOM
import { Link } from "react-router-dom"; 
// Assurez-vous que les composants Shadcn UI Card et Button sont disponibles
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Imports d'icônes Lucide
import { Plus, Calendar, MessageSquare, FileText, Settings, Users } from "lucide-react";

// Données d'actions rapides (Inchangées)
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
];

export function QuickActions() {
    return (
        <Card className="p-6 bg-card border-border">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Actions rapides</h3>
                <p className="text-sm text-muted-foreground">Accédez rapidement aux fonctionnalités principales</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quickActions.map((action) => (
                    // Remplacement de <Link href={...}> par <Link to={...}>
                    <Link key={action.name} to={action.href}>
                        <Button 
                            variant="outline" 
                            className="w-full h-auto p-4 justify-start hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bgColor} mr-3`}>
                                <action.icon className={`h-5 w-5 ${action.color}`} />
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-foreground">{action.name}</div>
                                <div className="text-xs text-muted-foreground">{action.description}</div>
                            </div>
                        </Button>
                    </Link>
                ))}
            </div>
        </Card>
    );
}