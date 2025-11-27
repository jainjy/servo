// src/hooks/useAccountStatus.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useAccountStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.status === "inactive") {
      navigate("/account-suspended");
    }
  }, [user, navigate]);

  return {
    isActive: user?.status !== "inactive",
    status: user?.status,
  };
};
