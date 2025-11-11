// services/professionalSettings.js
import api from "@/lib/api";

export const professionalSettingsService = {
  // Récupérer les paramètres professionnels de l'utilisateur
  async getSettings() {
    try {
      const response = await api.get("/professional/settings");
      return response.data.data; // Retourne directement les données
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Créer ou mettre à jour les paramètres professionnels
  async saveSettings(settings) {
    try {
      const response = await api.put("/professional/settings", settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer des paramètres par défaut
  async createDefaultSettings() {
    try {
      const currentYear = new Date().getFullYear();
      const defaultSettings = {
        delaiReponseEmail: 24,
        delaiReponseTelephone: 2,
        delaiReponseUrgence: 4,
        delaiAnnulationGratuit: 48,
        fraisAnnulationPourcent: 15,
        acomptePourcentage: 30,
        montantMinimum: 100,
        horairesLundi: { ouvert: true, debut: "09:00", fin: "18:00" },
        horairesMardi: { ouvert: true, debut: "09:00", fin: "18:00" },
        horairesMercredi: { ouvert: true, debut: "09:00", fin: "18:00" },
        horairesJeudi: { ouvert: true, debut: "09:00", fin: "18:00" },
        horairesVendredi: { ouvert: true, debut: "09:00", fin: "17:00" },
        horairesSamedi: { ouvert: false, debut: "10:00", fin: "16:00" },
        horairesDimanche: { ouvert: false, debut: "", fin: "" },
        joursFermes: [
          { date: `${currentYear}-01-01`, label: "Nouvel An" },
          { date: `${currentYear}-12-25`, label: "Noël" },
        ],
        conditionsAnnulation:
          "Toute annulation intervenant moins de 48 heures avant le rendez-vous pourra être facturée à hauteur de 15% du montant de la prestation.",
        conditionsPaiement:
          "Un acompte de 30% est requis pour confirmer toute réservation. Le solde est dû à la signature du contrat.",
      };

      const response = await api.post(
        "/professional/settings",
        defaultSettings
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
