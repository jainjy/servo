// components/admin/ConseilsAdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { conseilsService } from '@/services/conseilsService';
import { 
  Plus, 
  Eye, 
  EyeOff, 
  Star, 
  StarOff, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Folder,
  Users,
  Loader2
} from 'lucide-react';

const ConseilsAdminPanel = () => {
    const [conseils, setConseils] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingConseil, setEditingConseil] = useState(null);
    const [stats, setStats] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        category: 'nature',
        difficulty: 'Débutant',
        duration: '5 min',
        description: '',
        content: [''],
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        color: 'emerald',
        urgency: 'Important',
        expert: 'Expert local',
        location: 'Tous les cirques',
        isFeatured: false,
        isActive: true
    });

    // Charger les données
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Charger les conseils
            const conseilsResponse = await conseilsService.getAllConseilsAdmin();
            if (conseilsResponse.success) {
                setConseils(conseilsResponse.data);
            }

            // Charger les catégories
            const categoriesResponse = await conseilsService.getAllCategoriesAdmin();
            if (categoriesResponse.success) {
                setCategories(categoriesResponse.data);
            }

            // Charger les statistiques
            const statsResponse = await conseilsService.getAdminStats();
            if (statsResponse.success) {
                setStats(statsResponse.data);
            }

        } catch (error) {
            console.error('Erreur chargement données admin:', error);
        } finally {
            setLoading(false);
        }
    };

    // Gérer le changement de formulaire
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Ajouter un point de contenu
    const addContentItem = () => {
        setFormData(prev => ({
            ...prev,
            content: [...prev.content, '']
        }));
    };

    // Mettre à jour un point de contenu
    const updateContentItem = (index, value) => {
        const newContent = [...formData.content];
        newContent[index] = value;
        setFormData(prev => ({
            ...prev,
            content: newContent
        }));
    };

    // Supprimer un point de contenu
    const removeContentItem = (index) => {
        const newContent = formData.content.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            content: newContent
        }));
    };

    // Ouvrir le modal d'ajout
    const openAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    // Ouvrir le modal d'édition
    const openEditModal = (conseil) => {
        setEditingConseil(conseil);
        setFormData({
            title: conseil.title,
            category: conseil.category,
            difficulty: conseil.difficulty,
            duration: conseil.duration,
            description: conseil.description,
            content: conseil.content,
            icon: conseil.icon,
            color: conseil.color,
            urgency: conseil.urgency,
            expert: conseil.expert,
            location: conseil.location,
            isFeatured: conseil.isFeatured,
            isActive: conseil.isActive
        });
        setShowEditModal(true);
    };

    // Fermer les modals
    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingConseil(null);
        resetForm();
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Filtrer les points de contenu vides
            const filteredContent = formData.content.filter(item => item.trim() !== '');

            const conseilData = {
                ...formData,
                content: filteredContent
            };

            let response;

            if (editingConseil) {
                // Mettre à jour
                response = await conseilsService.updateConseil(editingConseil.id, conseilData);
            } else {
                // Créer
                response = await conseilsService.createConseil(conseilData);
            }

            if (response.success) {
                alert(response.message);
                closeModals();
                loadData(); // Recharger les données
            } else {
                alert(response.error);
            }
        } catch (error) {
            console.error('Erreur soumission formulaire:', error);
            alert('Erreur lors de la soumission');
        }
    };

    // Réinitialiser le formulaire
    const resetForm = () => {
        setFormData({
            title: '',
            category: 'nature',
            difficulty: 'Débutant',
            duration: '5 min',
            description: '',
            content: [''],
            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            color: 'emerald',
            urgency: 'Important',
            expert: 'Expert local',
            location: 'Tous les cirques',
            isFeatured: false,
            isActive: true
        });
    };

    // Supprimer un conseil
    const handleDelete = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce conseil ?')) {
            return;
        }

        try {
            const response = await conseilsService.deleteConseil(id);
            if (response.success) {
                alert(response.message);
                loadData(); // Recharger les données
            } else {
                alert(response.error);
            }
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert('Erreur lors de la suppression');
        }
    };

    // Basculer le statut "en vedette"
    const toggleFeatured = async (id) => {
        try {
            const response = await conseilsService.toggleFeatured(id);
            if (response.success) {
                alert(response.message);
                loadData(); // Recharger les données
            } else {
                alert(response.error);
            }
        } catch (error) {
            console.error('Erreur toggle featured:', error);
            alert('Erreur lors de la modification');
        }
    };

    // Basculer le statut actif
    const toggleActive = async (id) => {
        try {
            const response = await conseilsService.toggleActive(id);
            if (response.success) {
                alert(response.message);
                loadData(); // Recharger les données
            } else {
                alert(response.error);
            }
        } catch (error) {
            console.error('Erreur toggle active:', error);
            alert('Erreur lors de la modification');
        }
    };

    // Fonction pour obtenir la couleur de la catégorie
    const getCategoryColor = (category) => {
        const colors = {
            nature: 'bg-emerald-100 text-emerald-800',
            shopping: 'bg-blue-100 text-blue-800',
            maison: 'bg-amber-100 text-amber-800',
            cuisine: 'bg-red-100 text-red-800',
            transport: 'bg-cyan-100 text-cyan-800',
            jardin: 'bg-green-100 text-green-800',
            santé: 'bg-pink-100 text-pink-800',
            culture: 'bg-purple-100 text-purple-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-[#6B8E23]" />
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* En-tête */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Conseils</h1>
                <p className="text-[#8B4513]">Gérez les bons plans et conseils de votre application</p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#FFFFFF0] p-5 rounded-xl border border-[#D3D3D3] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Conseils</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats?.totals?.conseils || 0}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-[#556B2F]/10">
                            <Folder className="h-6 w-6 text-[#556B2F]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#FFFFFF0] p-5 rounded-xl border border-[#D3D3D3] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Catégories</p>
                            <p className="text-2xl font-bold text-[#556B2F] mt-1">
                                {stats?.categoryStats?.length || 0}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-[#6B8E23]/10">
                            <Calendar className="h-6 w-6 text-[#6B8E23]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#FFFFFF0] p-5 rounded-xl border border-[#D3D3D3] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">En Vedette</p>
                            <p className="text-2xl font-bold text-[#8B4513] mt-1">
                                {stats?.totals?.featured || 0}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-[#8B4513]/10">
                            <Star className="h-6 w-6 text-[#8B4513]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#FFFFFF0] p-5 rounded-xl border border-[#D3D3D3] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Vues Total</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats?.totals?.views?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bouton Ajouter */}
            <div className="mb-6 flex justify-between items-center">
                <div></div>
                <button
                    onClick={openAddModal}
                    className="bg-[#556B2F] hover:bg-[#6B8E23] text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-colors duration-200"
                >
                    <Plus className="h-5 w-5" />
                    Ajouter un Conseil
                </button>
            </div>

            {/* Liste des conseils */}
            <div className="bg-white rounded-xl border border-[#D3D3D3] shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#D3D3D3]">
                        <thead className="bg-[#FFFFFF0]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Titre
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Catégorie
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Stats
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#D3D3D3]">
                            {conseils.map((conseil) => (
                                <tr key={conseil.id} className="hover:bg-[#FFFFFF0]/50 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${getCategoryColor(conseil.category)}`}>
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={conseil.icon} />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {conseil.title}
                                                </div>
                                                <div className="text-sm text-[#8B4513] mt-1">
                                                    {conseil.expert}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(conseil.category)}`}>
                                            {conseil.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm space-y-1">
                                            <div className="flex items-center text-gray-600">
                                                <Eye className="h-4 w-4 mr-2 text-gray-400" />
                                                {conseil.stats?.views || conseil.views || 0} vues
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Users className="h-4 w-4 mr-2 text-gray-400" />
                                                {conseil.stats?.saves || conseil.saves || 0} sauvegardes
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => toggleFeatured(conseil.id)}
                                                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${conseil.isFeatured 
                                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                            >
                                                {conseil.isFeatured ? (
                                                    <>
                                                        <Star className="h-3.5 w-3.5" />
                                                        En vedette
                                                    </>
                                                ) : (
                                                    <>
                                                        <StarOff className="h-3.5 w-3.5" />
                                                        Vedette
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => toggleActive(conseil.id)}
                                                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${conseil.isActive 
                                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                                            >
                                                {conseil.isActive ? (
                                                    <>
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        Actif
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Inactif
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(conseil)}
                                                className="p-2 bg-[#556B2F]/10 text-[#556B2F] rounded-lg hover:bg-[#556B2F]/20 transition-colors"
                                                title="Éditer"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(conseil.id)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal d'ajout */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/50" onClick={closeModals}></div>
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                            <div className="sticky top-0 bg-[#556B2F] px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Nouveau Conseil</h2>
                                <button
                                    onClick={closeModals}
                                    className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Titre *
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                                required
                                                placeholder="Titre du conseil"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Catégorie *
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            >
                                                <option value="nature">Nature</option>
                                                <option value="shopping">Shopping</option>
                                                <option value="maison">Maison</option>
                                                <option value="cuisine">Cuisine</option>
                                                <option value="transport">Transport</option>
                                                <option value="jardin">Jardin</option>
                                                <option value="santé">Santé</option>
                                                <option value="culture">Culture</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Difficulté
                                            </label>
                                            <select
                                                name="difficulty"
                                                value={formData.difficulty}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            >
                                                <option value="Débutant">Débutant</option>
                                                <option value="Facile">Facile</option>
                                                <option value="Moyen">Moyen</option>
                                                <option value="Difficile">Difficile</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Durée
                                            </label>
                                            <input
                                                type="text"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                                placeholder="5 min"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Urgence
                                            </label>
                                            <select
                                                name="urgency"
                                                value={formData.urgency}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            >
                                                <option value="Important">Important</option>
                                                <option value="Utile">Utile</option>
                                                <option value="Économique">Économique</option>
                                                <option value="Écologique">Écologique</option>
                                                <option value="Pratique">Pratique</option>
                                                <option value="Durable">Durable</option>
                                                <option value="Santé">Santé</option>
                                                <option value="Social">Social</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            rows="3"
                                            required
                                            placeholder="Description du conseil..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contenu (Points) *
                                        </label>
                                        <div className="space-y-3">
                                            {formData.content.map((item, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#556B2F] text-white text-xs">
                                                        {index + 1}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) => updateContentItem(index, e.target.value)}
                                                        className="flex-1 px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                                        placeholder={`Point ${index + 1}`}
                                                    />
                                                    {formData.content.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeContentItem(index)}
                                                            className="flex-shrink-0 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addContentItem}
                                            className="mt-4 px-4 py-2.5 bg-[#6B8E23]/10 text-[#6B8E23] rounded-xl hover:bg-[#6B8E23]/20 flex items-center gap-2 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Ajouter un point
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expert
                                            </label>
                                            <input
                                                type="text"
                                                name="expert"
                                                value={formData.expert}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                                placeholder="Nom de l'expert"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Localisation
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                                placeholder="Localisation du conseil"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Couleur
                                            </label>
                                            <select
                                                name="color"
                                                value={formData.color}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            >
                                                <option value="emerald">Émeraude</option>
                                                <option value="amber">Ambre</option>
                                                <option value="blue">Bleu</option>
                                                <option value="green">Vert</option>
                                                <option value="cyan">Cyan</option>
                                                <option value="lime">Lime</option>
                                                <option value="rose">Rose</option>
                                                <option value="purple">Violet</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Icône SVG
                                            </label>
                                            <input
                                                type="text"
                                                name="icon"
                                                value={formData.icon}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                                placeholder="M12 15v2m-6 4h12..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6 p-4 bg-[#FFFFFF0] rounded-xl">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isFeatured"
                                                checked={formData.isFeatured}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-[#556B2F] border-[#D3D3D3] rounded focus:ring-[#556B2F]"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Mettre en vedette</span>
                                        </label>

                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-[#556B2F] border-[#D3D3D3] rounded focus:ring-[#556B2F]"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Actif</span>
                                        </label>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t border-[#D3D3D3]">
                                        <button
                                            type="button"
                                            onClick={closeModals}
                                            className="px-6 py-3 border border-[#D3D3D3] text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-[#556B2F] text-white rounded-xl hover:bg-[#6B8E23] transition-colors"
                                        >
                                            Créer le Conseil
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'édition */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/50" onClick={closeModals}></div>
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                            <div className="sticky top-0 bg-[#8B4513] px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Modifier le Conseil</h2>
                                <button
                                    onClick={closeModals}
                                    className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Titre *
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Catégorie *
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            >
                                                <option value="nature">Nature</option>
                                                <option value="shopping">Shopping</option>
                                                <option value="maison">Maison</option>
                                                <option value="cuisine">Cuisine</option>
                                                <option value="transport">Transport</option>
                                                <option value="jardin">Jardin</option>
                                                <option value="santé">Santé</option>
                                                <option value="culture">Culture</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Difficulté
                                            </label>
                                            <select
                                                name="difficulty"
                                                value={formData.difficulty}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            >
                                                <option value="Débutant">Débutant</option>
                                                <option value="Facile">Facile</option>
                                                <option value="Moyen">Moyen</option>
                                                <option value="Difficile">Difficile</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Durée
                                            </label>
                                            <input
                                                type="text"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Urgence
                                            </label>
                                            <select
                                                name="urgency"
                                                value={formData.urgency}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            >
                                                <option value="Important">Important</option>
                                                <option value="Utile">Utile</option>
                                                <option value="Économique">Économique</option>
                                                <option value="Écologique">Écologique</option>
                                                <option value="Pratique">Pratique</option>
                                                <option value="Durable">Durable</option>
                                                <option value="Santé">Santé</option>
                                                <option value="Social">Social</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            rows="3"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contenu (Points) *
                                        </label>
                                        <div className="space-y-3">
                                            {formData.content.map((item, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#8B4513] text-white text-xs">
                                                        {index + 1}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) => updateContentItem(index, e.target.value)}
                                                        className="flex-1 px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                                    />
                                                    {formData.content.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeContentItem(index)}
                                                            className="flex-shrink-0 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addContentItem}
                                            className="mt-4 px-4 py-2.5 bg-[#6B8E23]/10 text-[#6B8E23] rounded-xl hover:bg-[#6B8E23]/20 flex items-center gap-2 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Ajouter un point
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expert
                                            </label>
                                            <input
                                                type="text"
                                                name="expert"
                                                value={formData.expert}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Localisation
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Couleur
                                            </label>
                                            <select
                                                name="color"
                                                value={formData.color}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            >
                                                <option value="emerald">Émeraude</option>
                                                <option value="amber">Ambre</option>
                                                <option value="blue">Bleu</option>
                                                <option value="green">Vert</option>
                                                <option value="cyan">Cyan</option>
                                                <option value="lime">Lime</option>
                                                <option value="rose">Rose</option>
                                                <option value="purple">Violet</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Icône SVG
                                            </label>
                                            <input
                                                type="text"
                                                name="icon"
                                                value={formData.icon}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6 p-4 bg-[#FFFFFF0] rounded-xl">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isFeatured"
                                                checked={formData.isFeatured}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-[#556B2F] border-[#D3D3D3] rounded focus:ring-[#556B2F]"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Mettre en vedette</span>
                                        </label>

                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-[#556B2F] border-[#D3D3D3] rounded focus:ring-[#556B2F]"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Actif</span>
                                        </label>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t border-[#D3D3D3]">
                                        <button
                                            type="button"
                                            onClick={closeModals}
                                            className="px-6 py-3 border border-[#D3D3D3] text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-[#8B4513] text-white rounded-xl hover:bg-[#A0522D] transition-colors"
                                        >
                                            Mettre à jour
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConseilsAdminPanel;