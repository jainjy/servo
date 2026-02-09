// hooks/useProfileCompletion.ts
import { useState, useEffect } from 'react';
import profileCompletionService, { CompletionStats } from '@/services/profileCompletionService';

export const useProfileCompletion = (userData?: any) => {
  const [completion, setCompletion] = useState<CompletionStats | null>(null);

  const calculateCompletion = (data: any) => {
    if (!data) return null;
    return profileCompletionService.calculateCompletionFromUserData(data);
  };

  const refresh = () => {
    if (userData) {
      const newCompletion = calculateCompletion(userData);
      setCompletion(newCompletion);
    }
  };

  // Initialiser avec les données utilisateur
  useEffect(() => {
    if (userData) {
      const initialCompletion = calculateCompletion(userData);
      setCompletion(initialCompletion);
    }
  }, [userData]);

  return {
    completion,
    refresh
  };
};