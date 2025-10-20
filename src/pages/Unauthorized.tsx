import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, Home, ArrowLeft } from "lucide-react";
import { AuthService } from "@/lib/auth";

export default function UnauthorizedPage() {
  const user = AuthService.getCurrentUser();

  const getRedirectPath = () => {
    if (!user) return '/login';
    return AuthService.redirectBasedOnRole();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Accès non autorisé
          </h1>
          <p className="text-muted-foreground mb-6">
            {user
              ? `Vous n'avez pas les permissions nécessaires pour accéder à cette page.`
              : `Vous devez être connecté pour accéder à cette page.`
            }
          </p>

          {user && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Connecté en tant que: <strong>{user.role}</strong>
                {user.companyName && ` - ${user.companyName}`}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="default" onClick={() => window.location.href = getRedirectPath()}>
            <Home className="h-4 w-4 mr-2" />
            {user ? 'Mon Espace' : 'Se connecter'}
          </Button>

          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>

        {user && (
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Si vous pensez que c'est une erreur, contactez le support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
