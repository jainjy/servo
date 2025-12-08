import React, { useState } from 'react';
import { auditAPI } from '../lib/api';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAudit: (audit: any) => void;
}

interface AuditFormData {
  titre: string;
  description: string;
  type: string;
  responsable: string;
  statut: string;
}

const DemandeAudit: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  onAddAudit,
}) => {
  const [formData, setFormData] = useState<AuditFormData>({
    titre: '',
    description: '',
    type: '',
    responsable: '',
    statut: 'en cours',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const auditTypes: string[] = [
    'Audit Patrimonial',
    'Audit Financier',
    'Audit Immobilier',
    'Audit Fiscal',
    'Audit Successoral',
    'Audit Locatif',
    'Audit de Gestion',
    'Audit Technique',
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const resetForm = (): void => {
    setFormData({
      titre: '',
      description: '',
      type: '',
      responsable: '',
      statut: 'en cours',
    });
    setError('');
  };

  const handleClose = (): void => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.titre.trim() || !formData.type.trim() || !formData.responsable.trim()) {
      setError('Les champs titre, type et responsable sont obligatoires.');
      setLoading(false);
      return;
    }

    try {
      const response = await auditAPI.createAudit(formData);

      if (response.data.success) {
        onAddAudit(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(
          response.data.message ||
            "Erreur lors de la création de l'audit",
        );
      }
    } catch (err: any) {
      console.error('Erreur création audit:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Erreur lors de la création de l'audit",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-[#D3D3D3]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D3D3D3] bg-gradient-to-r from-[#556B2F] to-[#6B8E23] text-white">
          <div>
            <h2 className="text-lg font-semibold">Demande d&apos;audit</h2>
            <p className="text-xs md:text-sm text-white/80">
              Obtenez une analyse personnalisée de votre situation.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 hover:bg-white/20 transition-colors disabled:opacity-50"
            disabled={loading}
            aria-label="Fermer la modale"
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
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
              <svg
                className="w-5 h-5 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Titre */}
          <div>
            <label
              htmlFor="titre"
              className="block text-sm font-medium text-[#8B4513] mb-1"
            >
              Titre de l&apos;audit *
            </label>
            <input
              type="text"
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Ex : Audit patrimonial complet"
              className="w-full rounded-md border border-[#D3D3D3] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Type d'audit */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-[#8B4513] mb-1"
            >
              Type d&apos;audit *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-md border border-[#D3D3D3] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent bg-white"
              required
              disabled={loading}
            >
              <option value="">Sélectionnez un type</option>
              {auditTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Responsable */}
          <div>
            <label
              htmlFor="responsable"
              className="block text-sm font-medium text-[#8B4513] mb-1"
            >
              Responsable souhaité *
            </label>
            <input
              type="text"
              id="responsable"
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
              placeholder="Ex : Expert en patrimoine"
              className="w-full rounded-md border border-[#D3D3D3] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#8B4513] mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Décrivez votre besoin en détail..."
              className="w-full rounded-md border border-[#D3D3D3] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>

          {/* Informations supplémentaires */}
          <div className="rounded-md border border-[#D3D3D3] bg-[#F8FAF5] p-4">
            <h4 className="text-sm font-semibold text-[#556B2F] mb-1">
              Informations importantes
            </h4>
            <ul className="text-xs text-[#555555] space-y-1">
              <li>• Notre équipe vous contactera sous 48h.</li>
              <li>• Préparation des documents recommandée.</li>
              <li>• Devis personnalisé sans engagement.</li>
              <li>• Confidentialité strictement garantie.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-md border border-[#D3D3D3] px-4 py-2 text-sm text-[#556B2F] hover:bg-[#F7F7F7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-[#556B2F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#465524] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
                  Envoi...
                </>
              ) : (
                'Soumettre la demande'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemandeAudit;
