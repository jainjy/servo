// components/protected-route.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import  AuthService  from '@/services/authService'; 

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  redirectTo?: string;
}

interface AuthState {
  isLoading: boolean;
  isAuthorized: boolean | null;
  error: string | null;
}


export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthorized: null,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuthorization = async () => {
      try {
        // 1. Vérification de base de l'authentification
        if (!AuthService.isAuthenticated()) {
          const currentPath = encodeURIComponent(location.pathname + location.search);
          navigate(`${redirectTo}?redirect=${currentPath}`);
          return;
        }

        // 2. Vérification de l'utilisateur
        const user = AuthService.getCurrentUser();
        if (!user) {
          throw new Error('User not found');
        }

        // 3. Vérification du rôle
        if (requiredRole && !AuthService.hasRole(requiredRole)) {
          throw new Error('Unauthorized role');
        }

        // 4. Vérification de l'accès à la page
        if (!AuthService.canAccess(location.pathname)) {
          throw new Error('Page access denied');
        }

        // 5. Vérification KYC pour les professionnels
        if (user.role === 'professional') {
          const requiresKYC = ['/pro/bookings', '/pro/services', '/pro/listings']
            .some(path => location.pathname.startsWith(path));
          
          if (requiresKYC && ['pending', 'unverified'].includes(user.kycStatus)) {
            navigate('/pro/kyc-verification');
            return;
          }
        }

        if (isMounted) {
          setAuthState({
            isLoading: false,
            isAuthorized: true,
            error: null
          });
        }

      } catch (error) {
        if (isMounted) {
          setAuthState({
            isLoading: false,
            isAuthorized: false,
            error: error.message
          });
        }

        // Gestion des erreurs spécifiques
        switch(error.message) {
          case 'User not found':
          case 'Token expired':
            AuthService.logout();
            navigate(`${redirectTo}?error=session_expired`);
            break;
          case 'Unauthorized role':
            navigate('/unauthorized');
            break;
          case 'Page access denied':
            navigate(AuthService.getRoleBasedRedirect());
            break;
          default:
            navigate(`${redirectTo}?error=unknown`);
        }
      }
    };

    checkAuthorization();

    return () => {
      isMounted = false;
    };
  }, [navigate, location.pathname, requiredRole, redirectTo]);

  // Affichage des états
  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  if (authState.error) {
    return null; // La redirection est gérée dans le useEffect
  }

  if (!authState.isAuthorized) {
    return null; // La redirection est gérée dans le useEffect
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}

export function ProRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['admin', 'professional']}>
      {children}
    </ProtectedRoute>
  );
}
export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['admin', 'professional', 'user']}>
      {children}
    </ProtectedRoute>
  );
}

export function PublicRoute({ 
  children, 
  redirectIfAuthenticated = true 
}: { 
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (redirectIfAuthenticated && AuthService.isAuthenticated()) {
      const user = AuthService.getCurrentUser();
      if (user) {
        const redirectPath = AuthService.getRoleBasedRedirect();
        // Éviter la boucle de redirection
        if (pathname !== redirectPath) {
          navigate(redirectPath);
          return; // Arrêter l'exécution pour que le chargement reste affiché
        }
      }
    }
    setIsChecking(false);
  }, [navigate, pathname, redirectIfAuthenticated]);

  // Afficher un loader pendant la vérification/redirection
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}