import React, { useState } from 'react';
import { auditAPI } from '../lib/api'; // Importez l'API d'audit

// Interface pour les props
interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAudit: (audit: any) => void;
}

// Interface pour les données du formulaire
interface AuditFormData {
  titre: string;
  description: string;
  type: string;
  responsable: string;
  statut: string;
}

const DemandeAudit: React.FC<AuditModalProps> = ({ isOpen, onClose, onAddAudit }) => {
  const [formData, setFormData] = useState<AuditFormData>({
    titre: '',
    description: '',
    type: '',
    responsable: '',
    statut: 'en cours'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Types d'audit disponibles
  const auditTypes: string[] = [
    'Audit Patrimonial',
    'Audit Financier',
    'Audit Immobilier',
    'Audit Fiscal',
    'Audit Successoral',
    'Audit Locatif',
    'Audit de Gestion',
    'Audit Technique'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation des champs obligatoires
      if (!formData.titre.trim() || !formData.type.trim() || !formData.responsable.trim()) {
        setError('Les champs titre, type et responsable sont obligatoires.');
        setLoading(false);
        return;
      }

      // Utilisation de l'API d'audit
      const response = await auditAPI.createAudit(formData);

      if (response.data.success) {
        onAddAudit(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Erreur lors de la création de l\'audit');
      }
    } catch (err: any) {
      console.error('Erreur création audit:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Erreur lors de la création de l\'audit'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (): void => {
    setFormData({
      titre: '',
      description: '',
      type: '',
      responsable: '',
      statut: 'en cours'
    });
    setError('');
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Demande d'Audit</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Titre */}
          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de l'audit *
            </label>
            <input
              type="text"
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Ex: Audit patrimonial complet"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Type d'audit */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type d'audit *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="">Sélectionnez un type</option>
              {auditTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Responsable */}
          <div>
            <label htmlFor="responsable" className="block text-sm font-medium text-gray-700 mb-1">
              Responsable souhaité *
            </label>
            <input
              type="text"
              id="responsable"
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
              placeholder="Ex: Expert en patrimoine"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Décrivez votre besoin en détail..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">Informations importantes</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Notre équipe vous contactera sous 48h</li>
              <li>• Préparation des documents demandée</li>
              <li>• Devis personnalisé sans engagement</li>
              <li>• Confidentialité garantie</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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