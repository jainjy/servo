import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import ClientReservations from "./ClientReservations";
import OwnerReservations from "./OwnerReservations";

const GestionLocationSaisonniere = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // console.log("🚀 GestionLocationSaisonniere wrapper mounted");
    // console.log("👤 User info:", {
    //   isAuthenticated,
    //   userRole: user?.role,
    //   userId: user?.id,
    //   userEmail: user?.email
    // });

    if (isAuthenticated && user) {
      // Vérifier si l'utilisateur est propriétaire
      const ownerRoles = ["professional", "artisan", "pro", "owner", "landlord"];
      const userIsOwner = ownerRoles.includes(user.role || "");
      
      // console.log(`🏷️ User role: ${user.role}, isOwner: ${userIsOwner}`);
      
      setIsOwner(userIsOwner);
    }
    
    setLoading(false);
    
    return () => {
      // console.log("🧹 GestionLocationSaisonniere wrapper cleanup");
    };
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    // console.log("🔒 User not authenticated, showing loading");
    return <LoadingSpinner text="Vérification de l'authentification..." />;
  }

  if (loading) {
    // console.log("⏳ Determining user type...");
    return <LoadingSpinner text="Chargement de votre interface..." />;
  }

  // console.log(`🎯 Rendering appropriate view for ${isOwner ? 'owner' : 'client'}`);

  return isOwner ? <OwnerReservations /> : <ClientReservations />;
};

export default GestionLocationSaisonniere;