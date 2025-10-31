import React, { useState, useEffect } from 'react';
import { financementAPI } from "@/lib/api";


interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Partenaire {
  id: number;
  nom: string;
}

interface Assurance {
  id: number;
  nom: string;
}

interface FinancementDemande {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
  type: string;
  montant: number | null;
  duree: number | null;
  estimation: number | null;
  partenaireId: number | null;
  assuranceId: number | null;
  userId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  partenaire: Partenaire | null;
  assurance: Assurance | null;
  user: User | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface Filters {
  status: string;
  type: string;
}

const FinancementDemandes: React.FC = () => {
  const [demandes, setDemandes] = useState<FinancementDemande[]>([]);
  const [selectedDemande, setSelectedDemande] = useState<FinancementDemande | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [filters, setFilters] = useState<Filters>({
    status: '',
    type: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDemandes = async (page: number = 1): Promise<void> => {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: pagination.itemsPerPage,
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type })
      };

      const response = await financementAPI.getAllDemandes(params);
      const data = response.data;
      
      setDemandes(data.demandes);
      setPagination(data.pagination);
    } catch (error: any) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.error || 'Erreur lors du chargement des demandes';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, [filters]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 5000);
  };

  const handleStatusChange = async (demandeId: string, newStatus: string): Promise<void> => {
    try {
      await financementAPI.updateDemandeStatus(demandeId, newStatus);
      await fetchDemandes(pagination.currentPage);
      showNotification('Statut mis à jour avec succès', 'success');
    } catch (error: any) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.error || 'Erreur lors de la mise à jour du statut';
      showNotification(errorMessage, 'error');
    }
  };

  const handleDelete = async (demandeId: string): Promise<void> => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      return;
    }

    try {
      await financementAPI.deleteDemande(demandeId);
      await fetchDemandes(pagination.currentPage);
      showNotification('Demande supprimée avec succès', 'success');
    } catch (error: any) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.error || 'Erreur lors de la suppression';
      showNotification(errorMessage, 'error');
    }
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      pending: '#ff9800',
      approved: '#4caf50',
      rejected: '#f44336',
      processing: '#2196f3'
    };
    return colors[status as keyof typeof colors] || '#666';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (page: number): void => {
    fetchDemandes(page);
  };

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const viewDetails = (demande: FinancementDemande): void => {
    setSelectedDemande(demande);
    setDetailOpen(true);
  };

  const closeDetails = (): void => {
    setDetailOpen(false);
    setSelectedDemande(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestion des Demandes de Financement</h1>

      {/* Notification */}
      {notification.show && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: notification.type === 'success' ? '#4caf50' : '#f44336',
          color: 'white'
        }}>
          {notification.message}
        </div>
      )}

      {/* Filtres */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        marginBottom: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0 }}>Filtres</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Statut</label>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                minWidth: '120px'
              }}
            >
              <option value="">Tous</option>
              <option value="pending">En attente</option>
              <option value="processing">En traitement</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Type</label>
            <select 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                minWidth: '120px'
              }}
            >
              <option value="">Tous</option>
              <option value="contact">Contact</option>
              <option value="financement">Financement</option>
              <option value="assurance">Assurance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nom</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Téléphone</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Type</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Montant</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Partenaire</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Statut</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ padding: '40px', textAlign: 'center' }}>
                  <div>Chargement des demandes...</div>
                </td>
              </tr>
            ) : demandes.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  Aucune demande trouvée
                </td>
              </tr>
            ) : (
              demandes.map((demande) => (
                <tr key={demande.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{formatDate(demande.createdAt)}</td>
                  <td style={{ padding: '12px' }}>
                    {demande.nom}
                    {demande.user && (
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {demande.user.firstName} {demande.user.lastName}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>{demande.email}</td>
                  <td style={{ padding: '12px' }}>{demande.telephone}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      border: '1px solid #2196f3',
                      color: '#2196f3',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {demande.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {demande.montant ? `${demande.montant} €` : 'N/A'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {demande.partenaire?.nom || 'Aucun'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: getStatusColor(demande.status),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {demande.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button 
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        onClick={() => viewDetails(demande)}
                      >
                        Détails
                      </button>
                      
                      <select
                        value={demande.status}
                        onChange={(e) => handleStatusChange(demande.id, e.target.value)}
                        style={{
                          padding: '6px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          fontSize: '12px'
                        }}
                      >
                        <option value="pending">En attente</option>
                        <option value="processing">En traitement</option>
                        <option value="approved">Approuvé</option>
                        <option value="rejected">Rejeté</option>
                      </select>

                      <button 
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #f44336',
                          borderRadius: '4px',
                          backgroundColor: 'white',
                          color: '#f44336',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        onClick={() => handleDelete(demande.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '8px' }}>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              padding: '8px 12px',
              border: page === pagination.currentPage ? '1px solid #2196f3' : '1px solid #ddd',
              backgroundColor: page === pagination.currentPage ? '#2196f3' : 'white',
              color: page === pagination.currentPage ? 'white' : '#333',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Modal de détail */}
      {detailOpen && selectedDemande && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Détail de la demande</h2>
              <button 
                onClick={closeDetails}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Informations personnelles</h3>
              <p><strong>Nom:</strong> {selectedDemande.nom}</p>
              <p><strong>Email:</strong> {selectedDemande.email}</p>
              <p><strong>Téléphone:</strong> {selectedDemande.telephone}</p>
              {selectedDemande.user && (
                <>
                  <p><strong>Utilisateur enregistré:</strong> {selectedDemande.user.firstName} {selectedDemande.user.lastName}</p>
                  <p><strong>Email utilisateur:</strong> {selectedDemande.user.email}</p>
                </>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Détails de la demande</h3>
              <p><strong>Type:</strong> {selectedDemande.type}</p>
              <p><strong>Montant:</strong> {selectedDemande.montant || 'N/A'}</p>
              <p><strong>Durée:</strong> {selectedDemande.duree || 'N/A'}</p>
              <p><strong>Estimation:</strong> {selectedDemande.estimation || 'N/A'}</p>
              <p><strong>Partenaire:</strong> {selectedDemande.partenaire?.nom || 'Aucun'}</p>
              <p><strong>Assurance:</strong> {selectedDemande.assurance?.nom || 'Aucune'}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Message</h3>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                {selectedDemande.message}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '10px' }}>Dates</h3>
              <p><strong>Créée le:</strong> {formatDate(selectedDemande.createdAt)}</p>
              <p><strong>Modifiée le:</strong> {formatDate(selectedDemande.updatedAt)}</p>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button 
                onClick={closeDetails}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancementDemandes;