// ArtCreationProductCreator.tsx
import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';

interface ArtProduct {
  id: number;
  title: string;
  type: 'tableau' | 'sculpture' | 'photographie' | 'digital';
  status: 'publié' | 'en attente' | 'archivé' | 'vendu';
  category: string;
  price: number;
  artist: string;
  creationDate: string;
}

const ArtCreationProduct: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');
  const [typeFilter, setTypeFilter] = useState<string>('tous');
  
  // Données d'exemple
  const artProducts: ArtProduct[] = [
    { id: 1, title: 'Aurore boréale', type: 'tableau', status: 'publié', category: 'Abstrait', price: 2500, artist: 'Marie Dubois', creationDate: '2024-03-15' },
    { id: 9, title: 'Instantanés urbains', type: 'photographie', status: 'vendu', category: 'Street', price: 600, artist: 'Marc Photo', creationDate: '2024-02-14' },
    { id: 10, title: 'Formes organiques', type: 'sculpture', status: 'archivé', category: 'Contemporain', price: 3800, artist: 'Élise Création', creationDate: '2023-12-05' },
  ];

  const filteredProducts = artProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'tous' || product.status === statusFilter;
    const matchesType = typeFilter === 'tous' || product.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: artProducts.length,
    published: artProducts.filter(p => p.status === 'publié').length,
    pending: artProducts.filter(p => p.status === 'en attente').length,
    archived: artProducts.filter(p => p.status === 'archivé').length,
    sold: artProducts.filter(p => p.status === 'vendu').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publié': return 'bg-green-100 text-green-800';
      case 'en attente': return 'bg-yellow-100 text-yellow-800';
      case 'archivé': return 'bg-gray-100 text-gray-800';
      case 'vendu': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tableau': return '🖼️';
      case 'sculpture': return '🗿';
      case 'photographie': return '📸';
      case 'digital': return '💻';
      default: return '🎨';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Créations Artistiques</h1>
        <p className="text-gray-600">Gérez vos œuvres d'art et suivez leurs performances</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-gray-600">Total œuvres</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          <div className="text-green-600">Publiées</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-yellow-600">En attente</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
          <div className="text-gray-600">Archivées</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
          <div className="text-blue-600">Vendues</div>
        </div>
      </div>

      <div className="border-t pt-6">
        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une œuvre..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="tous">Tous les statuts</option>
              <option value="publié">Publié</option>
              <option value="en attente">En attente</option>
              <option value="archivé">Archivé</option>
              <option value="vendu">Vendu</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="tous">Tous les types</option>
              <option value="tableau">Tableau</option>
              <option value="sculpture">Sculpture</option>
              <option value="photographie">Photographie</option>
              <option value="digital">Digital</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              Nouvelle œuvre
            </button>
          </div>
        </div>

        {/* Liste des œuvres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{getTypeIcon(product.type)}</span>
                    <h3 className="font-semibold text-gray-800">{product.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Artiste: {product.artist}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
              </div>
              
              <div className="text-sm text-gray-700 mb-3">
                <div className="flex justify-between mb-1">
                  <span>Type:</span>
                  <span className="font-medium">{product.type}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Catégorie:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prix:</span>
                  <span className="font-medium text-blue-600">{product.price.toLocaleString()} €</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 flex justify-between items-center">
                <span>Créée le: {new Date(product.creationDate).toLocaleDateString('fr-FR')}</span>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir détails
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Légende des statuts */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Légende des statuts:</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Publié - Œuvre visible en galerie</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600">En attente - En cours de validation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-sm text-gray-600">Archivé - Non visible publiquement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Vendu - Transaction complétée</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtCreationProduct;