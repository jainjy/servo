import React, { useState } from "react";
import { ListingsTable } from "@/components/admin/listings/listings-table";
import { ListingsStats } from "@/components/admin/listings/listings-stats";
import { ListingModal } from "@/components/admin/listings/listing-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Palette de couleurs du thème
const colors = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFF0",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
  primaryLight: "#8FBC8F",
  secondaryLight: "#A0522D",
  cardBg: "#FFFFFF",
  textPrimary: "#2C3E50",
  textSecondary: "#5D6D7E",
  success: "#27AE60",
  warning: "#F39C12",
  error: "#E74C3C",
  accentGold: "#D4AF37",
  gradient1: "linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)",
  gradient2: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
  gradient3: "linear-gradient(135deg, #6B8E23 0%, #27AE60 100%)",
  oliveHover: "#5D801F",
  oliveLight: "#8FBC8F20",
};

const ListingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold tracking-tight"
            style={{ color: colors.primaryDark }}
          >
            Annonces immobilières
          </h1>
          <p style={{ color: colors.textSecondary }}>
            Gérer toutes les annonces de la plateforme
          </p>
        </div>
      </div>
      <ListingsStats />
      <ListingsTable />
    </div>
  );
};

export default ListingsPage;