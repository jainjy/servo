import React, { useState, useEffect } from 'react';
import { financementAPI } from '../../lib/api';

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

interface Stats {
  total: number;
  pending: number;
  processing: number;
  approved: number;
  rejected: number;
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    processing: 0,
    approved: 0,
    rejected: 0
  });

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

      // Calcul des statistiques
      calculateStats(data.demandes);
    } catch (error: any) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.error || 'Erreur lors du chargement des demandes';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (demandesList: FinancementDemande[]) => {
    const newStats: Stats = {
      total: demandesList.length,
      pending: demandesList.filter(d => d.status === 'pending').length,
      processing: demandesList.filter(d => d.status === 'processing').length,
      approved: demandesList.filter(d => d.status === 'approved').length,
      rejected: demandesList.filter(d => d.status === 'rejected').length
    };
    setStats(newStats);
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
      pending: '#f59e0b',
      processing: '#3b82f6',
      approved: '#10b981',
      rejected: '#ef4444'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getStatusText = (status: string): string => {
    const texts = {
      pending: 'En attente',
      processing: 'En traitement',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string): string => {
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

  const filteredDemandes = demandes.filter(demande =>
    demande.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.telephone.includes(searchTerm)
  );

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Notification */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '16px 20px',
          backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {notification.type === 'success' ? '✓' : '✗'} {notification.message}
        </div>
      )}

      {/* En-tête principal */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '8px'
          }}>
            Demandes de financement
          </h1>
          <div style={{
            fontSize: '14px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>Gestion de toutes les demandes clients</span>
            <span style={{
              backgroundColor: '#3498db',
              color: 'white',
              borderRadius: '12px',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {stats.total} demande{stats.total !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Total</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>{stats.total}</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>En attente</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>{stats.pending}</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>En traitement</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>{stats.processing}</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Traitées</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{stats.approved + stats.rejected}</div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Barre de recherche */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Filtres */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                outline: 'none',
                minWidth: '160px'
              }}
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="processing">En traitement</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                outline: 'none',
                minWidth: '140px'
              }}
            >
              <option value="">Tous types</option>
              <option value="contact">Contact</option>
              <option value="simulation">Simulation</option>
              <option value="financement">Financement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des demandes */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {/* En-tête du tableau */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50',
            margin: 0
          }}>
            Liste des demandes ({filteredDemandes.length})
          </h3>
        </div>

        {/* Corps du tableau */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '1000px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569'
                }}>Client</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569'
                }}>Contact</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569'
                }}>Type</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569'
                }}>Montant</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569'
                }}>Date</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569'
                }}>Statut</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <img src="/loading.gif" alt="" className='w-24 h-24' />
                      <div style={{ color: '#64748b', fontSize: '14px' }}>
                        Chargement des demandes...
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filteredDemandes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{
                    padding: '48px',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '14px'
                  }}>
                    Aucune demande trouvée
                  </td>
                </tr>
              ) : (
                filteredDemandes.map((demande) => (
                  <tr key={demande.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.2s'
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                        {demande.nom}
                      </div>
                      {demande.user && (
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          {demande.user.firstName} {demande.user.lastName}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ color: '#3498db', fontSize: '14px', fontWeight: '500' }}>{demande.email}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        {demande.telephone}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: '#e8f4fd',
                        color: '#2980b9',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: '1px solid #d6eaf8'
                      }}>
                        {demande.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#27ae60', fontWeight: '600', fontSize: '14px' }}>
                      {demande.montant ? `${demande.montant} €` : 'N/A'}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#7f8c8d', fontSize: '14px' }}>
                      {formatDate(demande.createdAt)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        color: getStatusColor(demande.status),
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block',
                        textAlign: 'center'
                      }}>
                        {getStatusText(demande.status)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', minWidth: '120px' }}>
                        {/* Bouton Voir - en haut */}
                        <button
                          onClick={() => viewDetails(demande)}
                          style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            width: '100%',
                            textAlign: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2980b9';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3498db';
                          }}
                        >
                          Voir
                        </button>

                        {/* Sélecteur de statut - au milieu */}
                        <select
                          value={demande.status}
                          onChange={(e) => handleStatusChange(demande.id, e.target.value)}
                          style={{
                            padding: '6px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '11px',
                            backgroundColor: 'white',
                            outline: 'none',
                            width: '100%',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">En attente</option>
                          <option value="processing">En traitement</option>
                          <option value="approved">Approuvé</option>
                          <option value="rejected">Rejeté</option>
                        </select>

                        {/* Bouton Supprimer - en bas */}
                        <button
                          onClick={() => handleDelete(demande.id)}
                          style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            width: '100%',
                            textAlign: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#c0392b';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#e74c3c';
                          }}
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
      </div>

      {/* Styles pour l'animation de chargement */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Modal de détail (conservé de votre code original) */}
      {detailOpen && selectedDemande && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          {/* Votre modal de détail existant */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            {/* Contenu du modal */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50' }}>
                  Détails de la demande
                </h2>
                <button
                  onClick={closeDetails}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#7f8c8d'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '12px' }}>
                  Informations client
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '4px' }}>Nom</div>
                    <div style={{ fontSize: '14px', color: '#2c3e50', fontWeight: '500' }}>{selectedDemande.nom}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '4px' }}>Email</div>
                    <div style={{ fontSize: '14px', color: '#3498db' }}>{selectedDemande.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '4px' }}>Téléphone</div>
                    <div style={{ fontSize: '14px', color: '#2c3e50' }}>{selectedDemande.telephone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '4px' }}>Type</div>
                    <div style={{ fontSize: '14px', color: '#2c3e50' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#e8f4fd',
                        color: '#2980b9',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {selectedDemande.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedDemande.message && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '12px' }}>
                    Message
                  </h3>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#2c3e50',
                    lineHeight: '1.5'
                  }}>
                    {selectedDemande.message}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={closeDetails}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancementDemandes;