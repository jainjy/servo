// src/components/admin/MetierForm.jsx (updated)
import { useState, useEffect } from "react";
import serviceService from "../../services/serviceService";

const MetierForm = ({
  metier,
  onSubmit,
  onCancel,
  loading = false,
  isOpen = false,
}) => {
  const [libelle, setLibelle] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError("");
        const data = await serviceService.getAllServices();
        setServices(data);
      } catch (err) {
        setServicesError(
          err.message || "Erreur lors du chargement des services"
        );
      } finally {
        setServicesLoading(false);
      }
    };

    loadServices();
  }, []);

  useEffect(() => {
    if (metier) {
      setLibelle(metier.libelle);
      setSelectedServiceIds(metier.services.map((s) => s.id));
    } else {
      setLibelle("");
      setSelectedServiceIds([]);
    }
    setErrors({});
    setTouched(false);
  }, [metier, isOpen]);

  const validateField = (value) => {
    const newErrors = {};

    if (!value.trim()) {
      newErrors.libelle = "Le libellé est requis";
    } else if (value.length < 2) {
      newErrors.libelle = "Le libellé doit contenir au moins 2 caractères";
    } else if (value.length > 100) {
      newErrors.libelle = "Le libellé ne doit pas dépasser 100 caractères";
    }
    return newErrors.libelle;
  };

  const validateForm = () => {
    const newErrors = {};
    const libelleError = validateField(libelle);
    if (libelleError) {
      newErrors.libelle = libelleError;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    if (!validateForm()) {
      return;
    }
    onSubmit({ libelle: libelle.trim(), serviceIds: selectedServiceIds });
  };

  const handleLibelleChange = (e) => {
    const value = e.target.value;
    setLibelle(value);

    if (touched) {
      const error = validateField(value);
      setErrors((prev) => ({
        ...prev,
        libelle: error,
      }));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const error = validateField(libelle);
    setErrors((prev) => ({
      ...prev,
      libelle: error,
    }));
  };

  const handleServiceChange = (e) => {
    const options = Array.from(e.target.options);
    const selectedIds = options
      .filter((option) => option.selected)
      .map((option) => parseInt(option.value));
    setSelectedServiceIds(selectedIds);
  };

  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto">
        {/* En-tête du modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {metier ? "Modifier le métier" : "Ajouter un nouveau métier"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {metier
                ? "Modifiez les informations du métier"
                : "Remplissez les informations pour créer un nouveau métier"}
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
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
        {/* Corps du modal */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="libelle"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Libellé du métier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="libelle"
                value={libelle}
                onChange={handleLibelleChange}
                onBlur={handleBlur}
                placeholder="Ex: Développeur web, Designer UX, etc."
                disabled={loading}
                className={`
                  w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${
                    errors.libelle
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }
                  ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
                  transition-colors duration-200
                `}
                autoFocus
              />
              {errors.libelle && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.libelle}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {libelle.length}/100 caractères
              </p>
            </div>
            {/* Indicateur de validation en temps réel */}
            {libelle.length > 0 && !errors.libelle && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Format valide
              </div>
            )}
            <div>
              <label
                htmlFor="services"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Services associés
              </label>
              {servicesLoading ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="animate-spin h-5 w-5"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Chargement des services...
                </div>
              ) : servicesError ? (
                <p className="text-sm text-red-600">{servicesError}</p>
              ) : (
                <select
                  id="services"
                  multiple
                  value={selectedServiceIds}
                  onChange={handleServiceChange}
                  disabled={loading || servicesLoading}
                  className={`
                    w-full h-32 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${
                      loading || servicesLoading
                        ? "bg-gray-100 cursor-not-allowed"
                        : "border-gray-300"
                    }
                    transition-colors duration-200
                  `}
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.libelle} (ID: {service.id})
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Sélectionnez plusieurs services en maintenant Ctrl/Cmd.{" "}
                {selectedServiceIds.length} sélectionné(s).
              </p>
            </div>
          </div>
          {/* Pied du modal */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !libelle.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Traitement...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={metier ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}
                    />
                  </svg>
                  {metier ? "Mettre à jour" : "Créer le métier"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MetierForm;
