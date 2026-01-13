import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const usePublicFormations = () => {
  const [formations, setFormations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  // Récupérer les formations publiques
  const fetchFormations = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
    
      const queryParams = new URLSearchParams();
      
      // Paramètres de filtrage
      queryParams.append('status', params.status || 'active');
      queryParams.append('page', params.page || 1);
      queryParams.append('limit', params.limit || 50);
      
      // Filtres optionnels
      if (params.search) queryParams.append('search', params.search);
      if (params.category && params.category !== 'tous') queryParams.append('category', params.category);
      if (params.format && params.format !== 'tous') queryParams.append('format', params.format);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params.isCertified === true) queryParams.append('isCertified', 'true');
      if (params.isFinanced === true) queryParams.append('isFinanced', 'true');
      if (params.isOnline === true) queryParams.append('isOnline', 'true');
      
      // 🌟 CORRECTION IMPORTANTE : Utilisez l'URL correcte
      // Essayez d'abord sans /public
      let url = `${API_URL}/formations?${queryParams.toString()}`;
     
      const response = await axios.get(url, {
        timeout: 10000,
        // Ajoutez des headers pour éviter les problèmes CORS
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
     
      
      if (response.data.success) {
        setFormations(response.data.data || []);
        setPagination(response.data.pagination || {
          page: params.page || 1,
          limit: params.limit || 50,
          total: response.data.data?.length || 0,
          pages: 1
        });
      } else {
        throw new Error(response.data.message || 'Erreur inconnue');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ usePublicFormations - Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config?.url
      });
      
      let errorMessage = 'Erreur lors du chargement des formations';
      
      if (error.response) {
        // Si erreur 400, essayez avec /public
        if (error.response.status === 400 || error.response.status === 404) {
         
          try {
            // Essayez avec l'URL alternative
            const altUrl = `${API_URL}/formations/public?${queryParams.toString()}`;
          
            const altResponse = await axios.get(altUrl, {
              timeout: 5000,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            
            if (altResponse.data.success) {
             
              setFormations(altResponse.data.data || []);
              setPagination(altResponse.data.pagination || {
                page: params.page || 1,
                limit: params.limit || 50,
                total: altResponse.data.data?.length || 0,
                pages: 1
              });
              return altResponse.data;
            }
          } catch (altError) {
            // console.log('❌ Route alternative échouée aussi');
          }
        }
        
        errorMessage = error.response.data?.error || 
                      error.response.data?.message || 
                      `Erreur ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      }
      
      setError(errorMessage);
      
      // En mode développement, utiliser des données fictives
      if (process.env.NODE_ENV === 'development') {
    
        const mockFormations = [
          {
            id: 1,
            title: 'Développeur Web Full Stack',
            description: 'Formation complète pour devenir développeur full stack avec projets concrets',
            category: 'Informatique & Numérique',
            format: '100% en ligne',
            duration: '6 mois',
            price: 2990,
            maxParticipants: 25,
            currentParticipants: 15,
            certification: 'RNCP niveau 6',
            startDate: '2024-01-15T00:00:00.000Z',
            endDate: '2024-07-15T00:00:00.000Z',
            location: '100% en ligne',
            requirements: 'Bonne maîtrise de l\'ordinateur, logique algorithmique',
            program: ['HTML/CSS avancé', 'JavaScript moderne', 'React & Node.js', 'Bases de données'],
            status: 'active',
            isCertified: true,
            isFinanced: true,
            isOnline: true,
            rating: 4.8,
            reviews: 124,
            views: 1000,
            applications: 50,
            createdAt: '2023-12-01T00:00:00.000Z',
            updatedAt: '2023-12-01T00:00:00.000Z',
            organisme: 'OpenClassrooms'
          },
          {
            id: 2,
            title: 'Gestion de Projet Agile',
            description: 'Maîtrisez les méthodologies Agile et Scrum',
            category: 'Management & Leadership',
            format: 'Hybride',
            duration: '3 mois',
            price: 1850,
            maxParticipants: 18,
            currentParticipants: 12,
            certification: 'Certificat CNAM',
            startDate: '2024-02-20T00:00:00.000Z',
            endDate: '2024-05-20T00:00:00.000Z',
            location: 'Paris + Distanciel',
            requirements: 'Expérience en gestion de projet recommandée',
            program: ['Introduction Agile', 'Méthodologie Scrum', 'Ateliers pratiques'],
            status: 'active',
            isCertified: true,
            isFinanced: true,
            isOnline: false,
            rating: 4.6,
            reviews: 89,
            views: 800,
            applications: 35,
            createdAt: '2023-12-01T00:00:00.000Z',
            updatedAt: '2023-12-01T00:00:00.000Z',
            organisme: 'CNAM'
          },
          {
            id: 3,
            title: 'CAP Électricien',
            description: 'Formation complète avec stages en entreprise',
            category: 'Bâtiment & Construction',
            format: 'Présentiel',
            duration: '12 mois',
            price: 4500,
            maxParticipants: 15,
            currentParticipants: 10,
            certification: 'Diplôme d\'État',
            startDate: '2024-01-10T00:00:00.000Z',
            endDate: '2025-01-10T00:00:00.000Z',
            location: 'Lyon',
            requirements: 'Niveau 3ème minimum',
            program: ['Électricité bâtiment', 'Normes sécurité', 'Installations électriques'],
            status: 'active',
            isCertified: true,
            isFinanced: true,
            isOnline: false,
            rating: 4.9,
            reviews: 156,
            views: 1200,
            applications: 40,
            createdAt: '2023-12-01T00:00:00.000Z',
            updatedAt: '2023-12-01T00:00:00.000Z',
            organisme: 'AFPA'
          }
        ];
        
        // Filtrer selon les paramètres
        let filteredMock = mockFormations.filter(f => f.status === (params.status || 'active'));
        
        if (params.category && params.category !== 'tous') {
          filteredMock = filteredMock.filter(f => f.category === params.category);
        }
        
        if (params.format && params.format !== 'tous') {
          filteredMock = filteredMock.filter(f => f.format === params.format);
        }
        
        setFormations(filteredMock);
        setPagination({
          page: params.page || 1,
          limit: params.limit || 50,
          total: filteredMock.length,
          pages: Math.ceil(filteredMock.length / (params.limit || 50))
        });
      }
      
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Postuler à une formation
  const applyToFormation = useCallback(async (formationId, applicationData) => {
    try {
  
      // Récupérer le token
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        throw new Error('Veuillez vous connecter pour postuler');
      }
      
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Essayez d'abord sans /public
      let url = `${API_URL}/formations/${formationId}/apply`;
      
      const response = await axios.post(
        url,
        applicationData,
        { headers }
      );
      
      // console.log('✅ usePublicFormations - Postulation réussie:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ usePublicFormations - Erreur postulation:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Veuillez vous connecter pour postuler');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Erreur lors de la postulation');
    }
  }, []);

  return {
    formations,
    isLoading,
    error,
    pagination,
    fetchFormations,
    applyToFormation
  };
};