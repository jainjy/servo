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

// Palette
const COLORS = {
  logo: "#556B2F",           // logo / accent
  primaryDark: "#6B8E23",    // éléments principaux
  lightBg: "#F5F7F0",        // fond de page (corrigé, pas #FFFFFF0)
  separator: "#D3D3D3",      // bordures
  secondaryText: "#8B4513",  // titres secondaires
  textMain: "#1F2933",
  mutedText: "#6B7280",
  danger: "#C0392B"
};

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const colors: Record<string, string> = {
      pending: COLORS.secondaryText,
      processing: COLORS.primaryDark,
      approved: "#2E8B57",
      rejected: COLORS.danger
    };
    return colors[status] || COLORS.mutedText;
  };

  const getStatusText = (status: string): string => {
    const texts: Record<string, string> = {
      pending: 'En attente',
      processing: 'En traitement',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
    <div style={{ padding: '24px', backgroundColor: COLORS.lightBg, minHeight: '100vh' }}>
      {/* Notification */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '16px 20px',
          backgroundColor: notification.type === 'success' ? COLORS.primaryDark : COLORS.danger,
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
        backgroundColor: '#FFFFFF',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        border: `1px solid ${COLORS.separator}`,
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: COLORS.logo,
            marginBottom: '8px'
          }}>
            Demandes de financement
          </h1>
          <div style={{
            fontSize: '14px',
            color: COLORS.mutedText,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>Gestion de toutes les demandes clients</span>
            <span style={{
              backgroundColor: COLORS.primaryDark,
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
        {[
          { label: 'Total', value: stats.total, color: COLORS.textMain },
          { label: 'En attente', value: stats.pending, color: COLORS.secondaryText },
          { label: 'En traitement', value: stats.processing, color: COLORS.primaryDark },
          { label: 'Traitées', value: stats.approved + stats.rejected, color: '#2E8B57' }
        ].map((card) => (
          <div key={card.label} style={{
            backgroundColor: '#FFFFFF',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            border: `1px solid ${COLORS.separator}`
          }}>
            <div style={{ fontSize: '14px', color: COLORS.mutedText, marginBottom: '8px' }}>{card.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Barre de recherche et filtres */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: `1px solid ${COLORS.separator}`,
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
                border: `1px solid ${COLORS.separator}`,
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.primaryDark;
                e.target.style.boxShadow = `0 0 0 1px ${COLORS.primaryDark}33`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.separator;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Filtres */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              style={{
                padding: '12px 16px',
                border: `1px solid ${COLORS.separator}`,
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                outline: 'none',
                minWidth: '160px',
                color: COLORS.textMain
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
                border: `1px solid ${COLORS.separator}`,
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                outline: 'none',
                minWidth: '140px',
                color: COLORS.textMain
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
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: `1px solid ${COLORS.separator}`,
        overflow: 'hidden'
      }}>
        {/* En-tête du tableau */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${COLORS.separator}`,
          backgroundColor: '#F9FAF6'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: COLORS.logo,
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
              <tr style={{ backgroundColor: '#F4F5ED' }}>
                {['Client', 'Contact', 'Type', 'Montant', 'Date', 'Statut', 'Actions'].map((col) => (
                  <th key={col} style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    borderBottom: `1px solid ${COLORS.separator}`,
                    fontSize: '13px',
                    fontWeight: '600',
                    color: COLORS.secondaryText,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase'
                  }}>
                    {col}
                  </th>
                ))}
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
                      <div style={{ color: COLORS.mutedText, fontSize: '14px' }}>
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
                    color: COLORS.mutedText,
                    fontSize: '14px'
                  }}>
                    Aucune demande trouvée
                  </td>
                </tr>
              ) : (
                filteredDemandes.map((demande) => (
                  <tr
                    key={demande.id}
                    style={{
                      borderBottom: `1px solid ${COLORS.separator}`,
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAF6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: '600', color: COLORS.textMain, fontSize: '14px' }}>
                        {demande.nom}
                      </div>
                      {demande.user && (
                        <div style={{ fontSize: '12px', color: COLORS.mutedText, marginTop: '4px' }}>
                          {demande.user.firstName} {demande.user.lastName}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ color: COLORS.primaryDark, fontSize: '14px', fontWeight: '500' }}>{demande.email}</div>
                      <div style={{ fontSize: '12px', color: COLORS.mutedText, marginTop: '4px' }}>
                        {demande.telephone}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: '#F0F4E6',
                        color: COLORS.primaryDark,
                        fontSize: '12px',
                        fontWeight: '600',
                        border: `1px solid ${COLORS.primaryDark}33`
                      }}>
                        {demande.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#2E8B57', fontWeight: '600', fontSize: '14px' }}>
                      {demande.montant ? `${demande.montant} €` : 'N/A'}
                    </td>
                    <td style={{ padding: '16px 20px', color: COLORS.mutedText, fontSize: '14px' }}>
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
                        {/* Bouton Voir */}
                        <button
                          onClick={() => viewDetails(demande)}
                          style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: COLORS.logo,
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            width: '100%',
                            textAlign: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.primaryDark;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.logo;
                          }}
                        >
                          Voir
                        </button>

                        {/* Sélecteur de statut */}
                        <select
                          value={demande.status}
                          onChange={(e) => handleStatusChange(demande.id, e.target.value)}
                          style={{
                            padding: '6px 8px',
                            border: `1px solid ${COLORS.separator}`,
                            borderRadius: '4px',
                            fontSize: '11px',
                            backgroundColor: 'white',
                            outline: 'none',
                            width: '100%',
                            cursor: 'pointer',
                            color: COLORS.textMain
                          }}
                        >
                          <option value="pending">En attente</option>
                          <option value="processing">En traitement</option>
                          <option value="approved">Approuvé</option>
                          <option value="rejected">Rejeté</option>
                        </select>

                        {/* Bouton Supprimer */}
                        <button
                          onClick={() => handleDelete(demande.id)}
                          style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: COLORS.danger,
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            width: '100%',
                            textAlign: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#922B21';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.danger;
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

      {/* Modal de détail */}
      {detailOpen && selectedDemande && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: `1px solid ${COLORS.separator}`
          }}>
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: COLORS.logo }}>
                  Détails de la demande
                </h2>
                <button
                  onClick={closeDetails}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: COLORS.mutedText
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: COLORS.secondaryText,
                  marginBottom: '12px'
                }}>
                  Informations client
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: COLORS.mutedText, marginBottom: '4px' }}>Nom</div>
                    <div style={{ fontSize: '14px', color: COLORS.textMain, fontWeight: '500' }}>{selectedDemande.nom}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: COLORS.mutedText, marginBottom: '4px' }}>Email</div>
                    <div style={{ fontSize: '14px', color: COLORS.primaryDark }}>{selectedDemande.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: COLORS.mutedText, marginBottom: '4px' }}>Téléphone</div>
                    <div style={{ fontSize: '14px', color: COLORS.textMain }}>{selectedDemande.telephone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: COLORS.mutedText, marginBottom: '4px' }}>Type</div>
                    <div style={{ fontSize: '14px', color: COLORS.textMain }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#F0F4E6',
                        color: COLORS.primaryDark,
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
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: COLORS.secondaryText,
                    marginBottom: '12px'
                  }}>
                    Message
                  </h3>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#F9FAF6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: COLORS.textMain,
                    lineHeight: '1.5',
                    border: `1px solid ${COLORS.separator}`
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
                    border: `1px solid ${COLORS.separator}`,
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: COLORS.textMain,
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

      {/* Pagination simple (si besoin) */}
      {pagination.totalPages > 1 && (
        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px'
        }}>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: `1px solid ${page === pagination.currentPage ? COLORS.primaryDark : COLORS.separator}`,
                backgroundColor: page === pagination.currentPage ? COLORS.primaryDark : 'white',
                color: page === pagination.currentPage ? 'white' : COLORS.textMain,
                fontSize: '12px',
                cursor: 'pointer',
                minWidth: '32px'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinancementDemandes;
