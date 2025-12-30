import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useCandidatures = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Postuler à une offre
  const postuler = useCallback(async (
    offreId: number,
    offreType: 'formation' | 'emploi' | 'alternance',
    titreOffre: string,
    donnees: {
      messageMotivation?: string;
      cvUrl?: string;
      lettreMotivationUrl?: string;
      nomCandidat?: string;
      emailCandidat?: string;
      telephoneCandidat?: string;
      documents?: any;
    }
  ) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token'); // Ou votre token d'auth
      
      const response = await fetch('http://localhost:3000/api/candidatures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          offreId,
          offreType,
          titreOffre,
          ...donnees
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la candidature');
      }

      toast.success('Candidature envoyée avec succès !');
      return { success: true, data: data.candidature };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les candidatures de l'utilisateur
  const getMesCandidatures = useCallback(async (
    filters?: { type?: string; statut?: string }
  ) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.statut) params.append('statut', filters.statut);

      const response = await fetch(`http://localhost:3000/api/candidatures?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération');
      }

      return { success: true, candidatures: data.candidatures };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(message);
      return { success: false, error: message, candidatures: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    postuler,
    getMesCandidatures
  };
};