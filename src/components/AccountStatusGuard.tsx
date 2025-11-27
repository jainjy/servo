// src/components/AccountStatusGuard.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AccountStatusGuardProps {
  children: React.ReactNode;
}

const AccountStatusGuard = ({ children }: AccountStatusGuardProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user?.status == "inactive") {
      // Si l'utilisateur est inactif, rediriger vers la page de suspension
      // Sauf s'il est déjà sur cette page
      if (location.pathname !== "/account-suspended") {
        navigate("/account-suspended", { replace: true });
      }
    }
  }, [user, isAuthenticated, location.pathname, navigate]);

  // Si l'utilisateur est inactif, ne pas afficher le contenu protégé
  if (isAuthenticated && user?.status === "inactive") {
    return null;
  }

  return <>{children}</>;
};

export default AccountStatusGuard;
