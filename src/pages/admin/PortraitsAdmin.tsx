// pages/admin/PortraitsAdmin.jsx
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "../../lib/api";

const PortraitsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [selectedPortrait, setSelectedPortrait] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    generation: "actuels",
    country: "Réunion",
    location: "",
    profession: "",
    description: "",
    story: "",
    shortStory: "",
    quote: "",
    color: "blue",
    featured: false,
    images: [],
    interviewAudioUrl: "",
    interviewDuration: "",
    interviewTopics: [],
    wisdom: [],
    instagramHandle: "",
    facebookHandle: "",
    youtubeHandle: "",
    categories: [],
    tags: [],
    latitude: "",
    longitude: "",
    region: "",
    isActive: true,
  });

  const queryClient = useQueryClient();

  // Récupérer les portraits
  const { data: portraitsData, isLoading } = useQuery({
    queryKey: ["adminPortraits", page, limit, searchTerm],
    queryFn: async () => {
      const response = await api.get("/portraits", {
        params: {
          page,
          limit,
          search: searchTerm || undefined,
          isActive: undefined, // Récupérer tous, même inactifs
        },
      });
      return response.data;
    },
  });

  // Récupérer les statistiques
  const { data: statsData } = useQuery({
    queryKey: ["portraitStats"],
    queryFn: async () => {
      const response = await api.get("/portraits/stats");
      return response.data.data;
    },
  });

  // Mutation pour créer un portrait
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/portraits", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Portrait créé avec succès");
      setIsCreateModalOpen(false);
      resetForm();
      queryClient.invalidateQueries(["adminPortraits"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Erreur lors de la création");
    },
  });

  // Mutation pour mettre à jour un portrait
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/portraits/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Portrait mis à jour avec succès");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries(["adminPortraits"]);
      queryClient.invalidateQueries(["portrait", selectedPortrait?.id]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Erreur lors de la mise à jour"
      );
    },
  });

  // Mutation pour supprimer un portrait
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/portraits/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Portrait supprimé avec succès");
      queryClient.invalidateQueries(["adminPortraits"]);
      queryClient.invalidateQueries(["portraitStats"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Erreur lors de la suppression"
      );
    },
  });

  const portraits = portraitsData?.data || [];
  const pagination = portraitsData?.pagination || {};

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      generation: "actuels",
      country: "Réunion",
      location: "",
      profession: "",
      description: "",
      story: "",
      shortStory: "",
      quote: "",
      color: "blue",
      featured: false,
      images: [],
      interviewAudioUrl: "",
      interviewDuration: "",
      interviewTopics: [],
      wisdom: [],
      instagramHandle: "",
      facebookHandle: "",
      youtubeHandle: "",
      categories: [],
      tags: [],
      latitude: "",
      longitude: "",
      region: "",
      isActive: true,
    });
  };

  const handleEdit = (portrait) => {
    setSelectedPortrait(portrait);
    setFormData({
      name: portrait.name || "",
      age: portrait.age || "",
      generation: portrait.generation || "actuels",
      country: portrait.country || "Réunion",
      location: portrait.location || "",
      profession: portrait.profession || "",
      description: portrait.description || "",
      story: portrait.story || "",
      shortStory: portrait.shortStory || "",
      quote: portrait.quote || "",
      color: portrait.color || "blue",
      featured: portrait.featured || false,
      images: portrait.images || [],
      interviewAudioUrl: portrait.interviewAudioUrl || "",
      interviewDuration: portrait.interviewDuration || "",
      interviewTopics: portrait.interviewTopics || [],
      wisdom: portrait.wisdom || [],
      instagramHandle: portrait.instagramHandle || "",
      facebookHandle: portrait.facebookHandle || "",
      youtubeHandle: portrait.youtubeHandle || "",
      categories: portrait.categories || [],
      tags: portrait.tags || [],
      latitude: portrait.latitude || "",
      longitude: portrait.longitude || "",
      region: portrait.region || "",
      isActive: portrait.isActive !== false,
    });
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce portrait ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (field, value) => {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({
      ...prev,
      [field]: array,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Préparer les données
    const data = {
      ...formData,
      age: parseInt(formData.age),
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      featured: formData.featured === true || formData.featured === "true",
    };

    if (selectedPortrait) {
      updateMutation.mutate({ id: selectedPortrait.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const generations = [
    { value: "anciens", label: "Anciens (70+ ans)" },
    { value: "actuels", label: "Actuels (30-69 ans)" },
    { value: "jeunes", label: "Jeunes (18-29 ans)" },
  ];

  const colors = [
    { value: "amber", label: "Ambre", color: "bg-amber-500" },
    { value: "blue", label: "Bleu", color: "bg-blue-500" },
    { value: "emerald", label: "Émeraude", color: "bg-emerald-500" },
    { value: "green", label: "Vert", color: "bg-green-500" },
    { value: "cyan", label: "Cyan", color: "bg-cyan-500" },
    { value: "purple", label: "Violet", color: "bg-purple-500" },
    { value: "pink", label: "Rose", color: "bg-pink-500" },
    { value: "red", label: "Rouge", color: "bg-red-500" },
  ];

  const categories = [
    "artisanat",
    "agriculture",
    "musique",
    "traditions",
    "pêche",
    "écologie",
    "innovation",
    "art",
    "technologie",
    "sport",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Portraits Locaux
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les portraits des habitants locaux, leurs histoires et leurs
            interviews.
          </p>
        </div>

        {/* Statistiques */}
        {statsData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">
                Total Portraits
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {statsData.totalPortraits}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Vues Total</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {statsData.totalViews}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">
                Partages Total
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {statsData.totalShares}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">
                Écoutes Total
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {statsData.totalListens}
              </p>
            </div>
          </div>
        )}

        {/* Barre d'outils */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un portrait..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Rechercher
                </button>
              </form>
            </div>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nouveau Portrait
            </button>
          </div>
        </div>

        {/* Cartes des portraits */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {portraits.map((portrait) => (
              <div
                key={portrait.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {portrait.images?.[0] ? (
                    <img
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      src={`${portrait.images[0]}?w=400&h=300&fit=crop`}
                      alt={portrait.name}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-gray-600 font-bold text-4xl">
                        {portrait.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {portrait.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      Vedette
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {portrait.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {portrait.age} ans • {portrait.location}
                  </p>

                  <div className="mt-2 mb-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {portrait.profession}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 bg-${portrait.color}-100 text-${portrait.color}-800`}
                    >
                      {portrait.generation}
                    </span>
                  </div>

                  {/* Statistiques */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="text-gray-500 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {portrait.views}
                        </p>
                        <p className="text-gray-500">Vues</p>
                      </div>
                      <div>
                        <div className="text-gray-500 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {portrait._count?.portraitShares || 0}
                        </p>
                        <p className="text-gray-500">Partages</p>
                      </div>
                      <div>
                        <div className="text-gray-500 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {portrait._count?.portraitListens || 0}
                        </p>
                        <p className="text-gray-500">Écoutes</p>
                      </div>
                    </div>
                  </div>

                  {/* Statut */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        portrait.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {portrait.isActive ? "Actif" : "Inactif"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => handleEdit(portrait)}
                    className="w-full px-3 py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Éditer
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`/portraits/${portrait.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 text-sm font-medium bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-center"
                    >
                      Voir
                    </a>
                    <button
                      onClick={() => handleDelete(portrait.id)}
                      className="px-3 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {portraits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun portrait trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'édition/création */}
      {(isEditModalOpen || isCreateModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPortrait
                    ? "Éditer le Portrait"
                    : "Créer un Nouveau Portrait"}
                </h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsCreateModalOpen(false);
                    setSelectedPortrait(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations de base */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Informations de base
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Âge *
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Génération *
                        </label>
                        <select
                          name="generation"
                          value={formData.generation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          {generations.map((gen) => (
                            <option key={gen.value} value={gen.value}>
                              {gen.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profession *
                      </label>
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pays *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Localisation *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Citation *
                      </label>
                      <textarea
                        name="quote"
                        value={formData.quote}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        rows={2}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Configuration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Configuration
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Couleur
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {colors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                color: color.value,
                              }))
                            }
                            className={`h-8 rounded-lg ${
                              formData.color === color.value
                                ? "ring-2 ring-offset-2 ring-emerald-500"
                                : ""
                            }`}
                          >
                            <div
                              className={`w-full h-full rounded-lg ${color.color}`}
                            ></div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="featured"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Portrait vedette
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="isActive"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Actif
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Images (URLs séparées par des virgules)
                      </label>
                      <textarea
                        value={formData.images.join(", ")}
                        onChange={(e) =>
                          handleArrayChange("images", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégories (séparées par des virgules)
                      </label>
                      <input
                        type="text"
                        value={formData.categories.join(", ")}
                        onChange={(e) =>
                          handleArrayChange("categories", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="artisanat, traditions, agriculture"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mots-clés (séparés par des virgules)
                      </label>
                      <input
                        type="text"
                        value={formData.tags.join(", ")}
                        onChange={(e) =>
                          handleArrayChange("tags", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Histoire complète */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Histoire complète *
                  </h3>
                  <textarea
                    name="story"
                    value={formData.story}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={6}
                    required
                  />
                </div>

                {/* Interview */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Interview
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL de l'audio
                        </label>
                        <input
                          type="url"
                          name="interviewAudioUrl"
                          value={formData.interviewAudioUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Durée (format: HH:MM)
                        </label>
                        <input
                          type="text"
                          name="interviewDuration"
                          value={formData.interviewDuration}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="24:15"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sujets abordés (séparés par des virgules)
                        </label>
                        <input
                          type="text"
                          value={formData.interviewTopics.join(", ")}
                          onChange={(e) =>
                            handleArrayChange("interviewTopics", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Traditions, Mémoire, Transmission"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Sagesse
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Citations de sagesse (une par ligne)
                        </label>
                        <textarea
                          value={formData.wisdom.join("\n")}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              wisdom: e.target.value
                                .split("\n")
                                .filter((line) => line.trim()),
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Réseaux sociaux
                        </label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            name="instagramHandle"
                            value={formData.instagramHandle}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Instagram"
                          />
                          <input
                            type="text"
                            name="facebookHandle"
                            value={formData.facebookHandle}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Facebook"
                          />
                          <input
                            type="text"
                            name="youtubeHandle"
                            value={formData.youtubeHandle}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="YouTube"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setIsCreateModalOpen(false);
                      setSelectedPortrait(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={
                      createMutation.isLoading || updateMutation.isLoading
                    }
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createMutation.isLoading || updateMutation.isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {selectedPortrait ? "Mise à jour..." : "Création..."}
                      </span>
                    ) : selectedPortrait ? (
                      "Mettre à jour"
                    ) : (
                      "Créer le portrait"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortraitsAdmin;
