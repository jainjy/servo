// services/profileCompletionService.ts
import { api } from "@/lib/axios";

export interface CompletionDetail {
  label: string;
  description: string;
  weight: number;
  isComplete: boolean;
  missingAction: string | null;
}

export interface ProfileCompletion {
  total: number;
  completed: number;
  percentage: number;
  details: Record<string, CompletionDetail>;
  recommendations: string[];
}

export interface CompletionStats {
  percentage: number;
  completed: number;
  total: number;
  color: string;
  label: string;
  recommendations: string[];
  missingItems: string[];
}

class ProfileCompletionService {
  // Calculer les stats de complétion à partir des données utilisateur
  calculateCompletionFromUserData(userData: any): CompletionStats {
    let completed = 0;
    let total = 100; // Score sur 100
    
    const criteria = [
      { name: 'avatar', check: () => !!userData.avatar, weight: 10 },
      { name: 'firstName', check: () => !!userData.firstName && userData.firstName.trim().length > 0, weight: 5 },
      { name: 'lastName', check: () => !!userData.lastName && userData.lastName.trim().length > 0, weight: 5 },
      { name: 'phone', check: () => !!userData.phone && userData.phone.trim().length > 0, weight: 10 },
      { name: 'email', check: () => !!userData.email, weight: 5 },
      { name: 'address', check: () => !!userData.address && !!userData.city, weight: 10 },
      { name: 'zipCode', check: () => !!userData.zipCode && userData.zipCode.trim().length > 0, weight: 5 },
      { name: 'city', check: () => !!userData.city && userData.city.trim().length > 0, weight: 5 },
      { name: 'companyName', check: () => !!userData.companyName || !!userData.commercialName, weight: 10 },
      { name: 'siret', check: () => !!userData.siret && userData.siret.trim().length > 0, weight: 5 },
      { name: 'latitude', check: () => !!userData.latitude && !!userData.longitude, weight: 5 },
      { name: 'metiers', check: () => userData.metiers && userData.metiers.length > 0, weight: 10 },
      { name: 'services', check: () => userData.services && userData.services.length >= 3, weight: 15 }
    ];

    criteria.forEach(criterion => {
      if (criterion.check()) {
        completed += criterion.weight;
      }
    });

    const percentage = Math.round((completed / total) * 100);
    
    const recommendations = this.generateRecommendations(criteria, userData);
    const missingItems = this.getMissingItems(criteria, userData);

    return {
      percentage,
      completed,
      total,
      color: this.getCompletionColor(percentage),
      label: this.getCompletionLabel(percentage),
      recommendations,
      missingItems
    };
  }

  private getCompletionColor(percentage: number): string {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  }

  private getCompletionLabel(percentage: number): string {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Bon";
    if (percentage >= 40) return "Moyen";
    return "À améliorer";
  }

  private generateRecommendations(criteria: any[], userData: any): string[] {
    const missing = criteria.filter(c => !c.check());
    return missing.map(c => {
      switch(c.name) {
        case 'avatar': return "Ajouter une photo de profil professionnelle";
        case 'firstName': return "Compléter votre prénom";
        case 'lastName': return "Compléter votre nom";
        case 'phone': return "Ajouter votre numéro de téléphone";
        case 'address': return "Compléter votre adresse complète";
        case 'zipCode': return "Ajouter votre code postal";
        case 'city': return "Indiquer votre ville";
        case 'companyName': return "Renseigner le nom de votre entreprise";
        case 'siret': return "Renseigner votre numéro SIRET";
        case 'latitude': return "Définir votre position géographique";
        case 'metiers': return "Sélectionner au moins un métier";
        case 'services': return "Ajouter au moins 3 services";
        default: return "Compléter vos informations";
      }
    }).slice(0, 5); // Limiter à 5 recommandations
  }

  private getMissingItems(criteria: any[], userData: any): string[] {
    return criteria
      .filter(c => !c.check())
      .map(c => {
        switch(c.name) {
          case 'avatar': return "Photo de profil";
          case 'firstName': return "Prénom";
          case 'lastName': return "Nom";
          case 'phone': return "Téléphone";
          case 'address': return "Adresse";
          case 'zipCode': return "Code postal";
          case 'city': return "Ville";
          case 'companyName': return "Nom d'entreprise";
          case 'siret': return "SIRET";
          case 'latitude': return "Position GPS";
          case 'metiers': return "Métiers";
          case 'services': return "Services (minimum 3)";
          default: return "Informations";
        }
      });
  }
}

export default new ProfileCompletionService();