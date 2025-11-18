import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  Filter,
  Folder,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Building,
  Users,
  Eye,
  MoreVertical
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  category: 'legal' | 'fiscal' | 'social' | 'administratif';
  type: string;
  size: string;
  lastModified: Date;
  status: 'valid' | 'expired' | 'pending';
  downloadUrl: string;
}

const PlansAdministratifs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const documents: Document[] = [
    {
      id: '1',
      title: 'Statuts de la société',
      category: 'legal',
      type: 'PDF',
      size: '2.4 MB',
      lastModified: new Date('2024-01-15'),
      status: 'valid',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Déclaration fiscale 2023',
      category: 'fiscal',
      type: 'PDF',
      size: '1.8 MB',
      lastModified: new Date('2024-02-20'),
      status: 'pending',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'Registre du personnel',
      category: 'social',
      type: 'Excel',
      size: '3.2 MB',
      lastModified: new Date('2024-01-08'),
      status: 'valid',
      downloadUrl: '#'
    },
    {
      id: '4',
      title: 'Contrat de bail commercial',
      category: 'legal',
      type: 'PDF',
      size: '4.1 MB',
      lastModified: new Date('2023-11-30'),
      status: 'expired',
      downloadUrl: '#'
    },
    {
      id: '5',
      title: 'Plan de continuité d\'activité',
      category: 'administratif',
      type: 'Word',
      size: '2.7 MB',
      lastModified: new Date('2024-03-01'),
      status: 'valid',
      downloadUrl: '#'
    },
    {
      id: '6',
      title: 'Attestation URSSAF',
      category: 'social',
      type: 'PDF',
      size: '1.1 MB',
      lastModified: new Date('2024-02-28'),
      status: 'valid',
      downloadUrl: '#'
    }
  ];

  const categories = [
    { value: 'all', label: 'Tous les documents', icon: Folder },
    { value: 'legal', label: 'Juridique', icon: Shield },
    { value: 'fiscal', label: 'Fiscal', icon: Building },
    { value: 'social', label: 'Social', icon: Users },
    { value: 'administratif', label: 'Administratif', icon: FileText }
  ];

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'valid', label: 'Valide' },
    { value: 'expired', label: 'Expiré' },
    { value: 'pending', label: 'En attente' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryConfig = categories.find(cat => cat.value === category);
    const IconComponent = categoryConfig?.icon || Folder;
    return <IconComponent className="w-5 h-5" />;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plans & Administratifs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Documents administratifs simplifiés - Accédez à tous vos documents essentiels en un seul endroit
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Recherche */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un document..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 lg:flex-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 lg:flex-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton de changement de vue */}
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>{viewMode === 'grid' ? 'Vue liste' : 'Vue grille'}</span>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total documents', value: documents.length, color: 'bg-blue-500' },
            { label: 'Documents valides', value: documents.filter(d => d.status === 'valid').length, color: 'bg-green-500' },
            { label: 'En attente', value: documents.filter(d => d.status === 'pending').length, color: 'bg-yellow-500' },
            { label: 'Expirés', value: documents.filter(d => d.status === 'expired').length, color: 'bg-red-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Contenu principal */}
        {viewMode === 'grid' ? (
          /* Vue Grille */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(document.category)}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {document.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{document.type}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{document.size}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Statut</span>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                      {getStatusIcon(document.status)}
                      {statuses.find(s => s.value === document.status)?.label}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dernière modification</span>
                    <span className="text-sm text-gray-900">
                      {document.lastModified.toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                      Voir
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Vue Liste */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière modification
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getCategoryIcon(document.category)}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {document.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {document.type} • {document.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {categories.find(cat => cat.value === document.category)?.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                        {getStatusIcon(document.status)}
                        {statuses.find(s => s.value === document.status)?.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.lastModified.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Message si aucun résultat */}
        {filteredDocuments.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun document trouvé
            </h3>
            <p className="text-gray-600">
              Aucun document ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansAdministratifs;