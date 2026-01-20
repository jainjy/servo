import React, { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import ItemModal from './ItemModal';
import ItemCard from './ItemCard';
import { useAuth } from '../../hooks/useAuth';
import api from "../../lib/api";

interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  createdAt?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

const ParapentePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user, getAuthHeaders } = useAuth();

  // Chargement initial depuis l'API
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/parapente');
      if (response.data.success) {
        setItems(response.data.data || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des parapentes:', err);
      setError('Impossible de charger les éléments. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemData: Omit<Item, 'id'>) => {
    try {
      if (!isAuthenticated || !user) {
        alert('Vous devez être connecté pour ajouter un élément');
        return;
      }

      const formData = new FormData();
      formData.append('title', itemData.title);
      formData.append('description', itemData.description);
      formData.append('price', itemData.price.toString());
      formData.append('location', itemData.location);

      // Filtrer les nouvelles images (celles qui sont en base64)
      const newImages = itemData.images.filter(img => img.startsWith('data:'));
      
      // Convertir chaque base64 en File
      for (const [index, base64Image] of newImages.entries()) {
        // Convertir base64 en blob
        const response = await fetch(base64Image);
        const blob = await response.blob();
        
        // Créer un File à partir du blob
        const file = new File([blob], `image-${index}.jpg`, { type: 'image/jpeg' });
        formData.append('image', file);
      }

      const response = await api.post('/parapente', formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        fetchItems(); // Recharger la liste
        return response.data.data;
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      alert('Erreur lors de l\'ajout. Veuillez réessayer.');
      throw err;
    }
  };

  const handleUpdateItem = async (itemData: Omit<Item, 'id'>) => {
    try {
      if (!editingItem || !isAuthenticated || !user) {
        alert('Vous devez être connecté pour modifier un élément');
        return;
      }

      const formData = new FormData();
      formData.append('title', itemData.title);
      formData.append('description', itemData.description);
      formData.append('price', itemData.price.toString());
      formData.append('location', itemData.location);

      // Séparer les images existantes (URLs) des nouvelles images (base64)
      const existingImages = itemData.images.filter(img => !img.startsWith('data:'));
      const newImages = itemData.images.filter(img => img.startsWith('data:'));

      // Convertir les nouvelles images base64 en File
      for (const [index, base64Image] of newImages.entries()) {
        const response = await fetch(base64Image);
        const blob = await response.blob();
        const file = new File([blob], `image-${index}.jpg`, { type: 'image/jpeg' });
        formData.append('image', file);
      }

      const response = await api.put(`/parapente/${editingItem.id}`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        fetchItems(); // Recharger la liste
        return response.data.data;
      }
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      alert('Erreur lors de la modification. Veuillez réessayer.');
      throw err;
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      return;
    }

    try {
      if (!isAuthenticated) {
        alert('Vous devez être connecté pour supprimer un élément');
        return;
      }

      const response = await api.delete(`/parapente/${id}`, {
        headers: getAuthHeaders(),
      });

      if (response.data.success) {
        // Supprimer localement
        setItems(prevItems => prevItems.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur lors de la suppression. Veuillez réessayer.');
    }
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (itemData: Omit<Item, 'id'>) => {
    try {
      if (editingItem) {
        await handleUpdateItem(itemData);
      } else {
        await handleAddItem(itemData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      // Les erreurs sont déjà gérées dans les fonctions
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <header className="sticky top-0 z-40 shadow-sm" style={{ backgroundColor: '#FFFFFF', borderBottomColor: '#D3D3D3' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#556B2F' }}>
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#556B2F' }}>
                  Gestion des Parapentes
                </h1>
                <p className="text-sm" style={{ color: '#8B4513' }}>
                  {loading ? 'Chargement...' : `${items.length} élément${items.length > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  alert('Vous devez être connecté pour ajouter un parapente');
                  return;
                }
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:shadow-md transition-shadow"
              style={{ 
                backgroundColor: '#6B8E23',
                color: 'white'
              }}
            >
              <Plus className="w-5 h-5" />
              Ajouter un parapente
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#556B2F' }}></div>
            <p className="mt-4" style={{ color: '#8B4513' }}>Chargement des parapentes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DC2626' }}>
              <Package className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#8B4513' }}>
              Erreur
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={fetchItems}
              className="px-6 py-3 rounded-lg font-medium"
              style={{ 
                backgroundColor: '#556B2F',
                color: 'white'
              }}
            >
              Réessayer
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6B8E23' }}>
              <Package className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#8B4513' }}>
              Aucun parapente trouvé
            </h2>
            <p className="text-gray-600 mb-8">
              {isAuthenticated ? 'Commencez par ajouter votre premier parapente' : 'Connectez-vous pour ajouter des parapentes'}
            </p>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                style={{ 
                  backgroundColor: '#556B2F',
                  color: 'white'
                }}
              >
                <Plus className="w-5 h-5" />
                Ajouter un parapente
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-8 p-4 rounded-lg border" style={{ borderColor: '#D3D3D3', backgroundColor: '#FFFFFF' }}>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Rechercher un parapente..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                    style={{ 
                      borderColor: '#D3D3D3',
                      backgroundColor: '#FFFFFF',
                      '--tw-ring-color': '#556B2F'
                    } as React.CSSProperties}
                  />
                </div>
                <select 
                  className="p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ 
                    borderColor: '#D3D3D3',
                    backgroundColor: '#FFFFFF',
                    '--tw-ring-color': '#556B2F'
                  } as React.CSSProperties}
                >
                  <option value="">Tous les lieux</option>
                  <option value="Paris">Paris</option>
                  <option value="Lyon">Lyon</option>
                  <option value="Marseille">Marseille</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingItem}
      />
    </div>
  );
};

export default ParapentePage;