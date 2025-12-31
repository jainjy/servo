// components/admin/ConseilsAdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { conseilsService } from '@/services/conseilsService';

const ConseilsAdminPanel = () => {
    const [conseils, setConseils] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
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
                resetForm();
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
        setEditingConseil(null);
        setShowForm(false);
    };

    // Éditer un conseil
    const handleEdit = (conseil) => {
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
        setShowForm(true);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Conseils</h1>
                <p className="text-gray-600">Gérez les bons plans et conseils de votre application</p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-sm font-medium text-gray-500">Total Conseils</h3>
                    <p className="text-2xl font-bold text-gray-900">
                        {stats?.totals?.conseils || 0}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-sm font-medium text-gray-500">Catégories</h3>
                    <p className="text-2xl font-bold text-emerald-600">
                        {stats?.categoryStats?.length || 0}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-sm font-medium text-gray-500">En Vedette</h3>
                    <p className="text-2xl font-bold text-amber-600">
                        {stats?.totals?.featured || 0}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-sm font-medium text-gray-500">Vues Total</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {stats?.totals?.views?.toLocaleString() || 0}
                    </p>
                </div>
            </div>

            {/* Bouton Ajouter */}
            <div className="mb-6">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {showForm ? 'Annuler' : 'Ajouter un Conseil'}
                </button>
            </div>

            {/* Formulaire */}
            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-bold mb-4">
                        {editingConseil ? 'Modifier le Conseil' : 'Nouveau Conseil'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Titre *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Catégorie *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Difficulté
                                </label>
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="Débutant">Débutant</option>
                                    <option value="Facile">Facile</option>
                                    <option value="Moyen">Moyen</option>
                                    <option value="Difficile">Difficile</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Durée
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="5 min"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Urgence
                                </label>
                                <select
                                    name="urgency"
                                    value={formData.urgency}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contenu (Points) *
                            </label>
                            <div className="space-y-2">
                                {formData.content.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => updateContentItem(index, e.target.value)}
                                            className="flex-1 px-3 py-2 border rounded-lg"
                                            placeholder={`Point ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeContentItem(index)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addContentItem}
                                className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                + Ajouter un point
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expert
                                </label>
                                <input
                                    type="text"
                                    name="expert"
                                    value={formData.expert}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Localisation
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Couleur
                                </label>
                                <select
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icône SVG (chemin d)
                                </label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="M12 15v2m-6 4h12..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <span className="text-sm">Mettre en vedette</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <span className="text-sm">Actif</span>
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {editingConseil ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Liste des conseils */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Titre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Catégorie
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stats
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {conseils.map((conseil) => (
                                <tr key={conseil.id}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {conseil.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {conseil.expert}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full bg-${conseil.color}-100 text-${conseil.color}-800`}>
                                            {conseil.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {conseil.stats?.views || conseil.views || 0}
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {conseil.stats?.saves || conseil.saves || 0}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <button
                                                onClick={() => toggleFeatured(conseil.id)}
                                                className={`px-2 py-1 text-xs rounded ${conseil.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                                            >
                                                {conseil.isFeatured ? '★ Vedette' : 'Mettre en vedette'}
                                            </button>
                                            <button
                                                onClick={() => toggleActive(conseil.id)}
                                                className={`px-2 py-1 text-xs rounded ${conseil.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                            >
                                                {conseil.isActive ? '✓ Actif' : '× Inactif'}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(conseil)}
                                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                            >
                                                Éditer
                                            </button>
                                            <button
                                                onClick={() => handleDelete(conseil.id)}
                                                className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ConseilsAdminPanel;