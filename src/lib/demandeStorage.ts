// Service de stockage local pour les demandes immobilier
const STORAGE_KEY = 'demandes_immobilier';

export interface DemandeImmobilier {
  id: number;
  serviceId: string;
  createdById: string;
  propertyId: string;
  contactNom: string;
  contactPrenom: string;
  contactEmail: string;
  contactTel: string;
  description: string;
  lieuAdresse: string;
  dateSouhaitee: string;
  heureSouhaitee: string;
  statut: 'en attente' | 'validée' | 'refusée' | 'archivée';
  nombreArtisans: number;
  optionAssurance: boolean;
  property?: {
    id: number;
    title: string;
    address: string;
    images: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Récupérer toutes les demandes
export const getDemandes = (): DemandeImmobilier[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lecture demandes:', error);
    return [];
  }
};

// Récupérer les demandes d'un utilisateur
export const getDemandesByUser = (userId: string): DemandeImmobilier[] => {
  const demandes = getDemandes();
  return demandes.filter(d => d.createdById === userId);
};

// Récupérer toutes les demandes (pour admin)
export const getAllDemandes = (): DemandeImmobilier[] => {
  return getDemandes();
};

// Créer une nouvelle demande
export const createDemande = (demandeData: Omit<DemandeImmobilier, 'id' | 'createdAt' | 'updatedAt'>): DemandeImmobilier => {
  const demandes = getDemandes();
  
  // Générer un ID unique
  const newId = demandes.length > 0 ? Math.max(...demandes.map(d => d.id)) + 1 : 1;
  
  const nouvelleDemande: DemandeImmobilier = {
    ...demandeData,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const nouvellesDemandes = [...demandes, nouvelleDemande];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesDemandes));
  
  return nouvelleDemande;
};

// Mettre à jour le statut d'une demande
export const updateDemandeStatut = (id: number, statut: DemandeImmobilier['statut']): DemandeImmobilier | null => {
  const demandes = getDemandes();
  const index = demandes.findIndex(d => d.id === id);
  
  if (index === -1) return null;
  
  const demandeMiseAJour = {
    ...demandes[index],
    statut,
    updatedAt: new Date().toISOString()
  };
  
  demandes[index] = demandeMiseAJour;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demandes));
  
  return demandeMiseAJour;
};

// Supprimer une demande
export const deleteDemande = (id: number): boolean => {
  const demandes = getDemandes();
  const nouvellesDemandes = demandes.filter(d => d.id !== id);
  
  if (nouvellesDemandes.length === demandes.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesDemandes));
  return true;
};

// Initialiser avec des données d'exemple
export const initDemoData = () => {
  const existing = getDemandes();
  if (existing.length > 0) return;
  
  const demoDemandes: DemandeImmobilier[] = [
    {
      id: 1,
      serviceId: '10',
      createdById: 'demo-user-1',
      propertyId: '1',
      contactNom: 'Dupont',
      contactPrenom: 'Jean',
      contactEmail: 'jean.dupont@email.com',
      contactTel: '0123456789',
      description: 'Postulation pour logement intermédiaire: Appartement T3 Neuf - Éco-quartier (1). Très intéressé par ce logement.',
      lieuAdresse: 'Lyon, 69007',
      dateSouhaitee: '2024-12-15',
      heureSouhaitee: '14:30',
      statut: 'en attente',
      nombreArtisans: 0,
      optionAssurance: false,
      property: {
        id: 1,
        title: 'Appartement T3 Neuf - Éco-quartier',
        address: 'Lyon, 69007',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400']
      },
      createdAt: new Date('2024-01-10').toISOString(),
      updatedAt: new Date('2024-01-10').toISOString()
    },
    {
      id: 2,
      serviceId: '10',
      createdById: 'demo-user-2',
      propertyId: '3',
      contactNom: 'Martin',
      contactPrenom: 'Sophie',
      contactEmail: 'sophie.martin@email.com',
      contactTel: '0678901234',
      description: 'Postulation pour logement intermédiaire: Appartement standing - Quartier durable (3). Parfait pour ma famille.',
      lieuAdresse: 'Bordeaux, 33000',
      dateSouhaitee: '2024-12-20',
      heureSouhaitee: '10:00',
      statut: 'validée',
      nombreArtisans: 0,
      optionAssurance: false,
      property: {
        id: 3,
        title: 'Appartement standing - Quartier durable',
        address: 'Bordeaux, 33000',
        images: ['https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400']
      },
      createdAt: new Date('2024-01-08').toISOString(),
      updatedAt: new Date('2024-01-09').toISOString()
    }
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoDemandes));
};