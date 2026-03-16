// PersonnelModal.tsx
import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Shield, Lock, Mail, AlertCircle } from 'lucide-react';

// Constantes de couleur basées sur votre palette
const COLORS = {
  logo: "#556B2F",           /* Olive green - logo/accent */
  primary: "#6B8E23",        /* Yellow-green - primary-dark */
  lightBg: "#FFFFFF",        /* White - light-bg */
  separator: "#D3D3D3",      /* Light gray - separator */
  secondaryText: "#8B4513",  /* Saddle brown - secondary-text */
  smallText: "#000000",      /* Black for small text */
};

// Interface pour les données du formulaire (ce qu'on envoie à l'API)
export interface PersonnelFormData {
  name: string;
  email: string;
  role: 'commercial' | 'pro';
  description: string | null;
  password: string;
  idUser: string;
}

// Interface pour la réponse de l'API (ce qu'on reçoit)
interface Personnel {
  id: string;
  name: string;
  email: string;
  role: 'commercial' | 'pro' | 'support';
  description: string;
  createdAt: string;
  updatedAt: string;
  user?: any;
  userId: string;
}

interface PersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonnelFormData) => Promise<void>;
  initialData: Personnel | null;
  currentUser: any;
}

const PersonnelModal: React.FC<PersonnelModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  currentUser
}) => {
  const [formData, setFormData] = useState<PersonnelFormData>({
    name: '',
    email: '',
    role: 'commercial',
    description: '',
    password: '',
    idUser: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Initialiser le formulaire
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role as 'commercial' | 'pro',
        description: initialData.description || '',
        password: '', // Toujours vide en modification
        idUser: initialData.userId
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'commercial',
        description: '',
        password: '', // Vide par défaut
        idUser: currentUser?.id || ''
      });
    }
    setError(null);
    setPasswordError(null);
  }, [initialData, isOpen, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur de mot de passe quand l'utilisateur commence à taper
    if (name === 'password') {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPasswordError(null);

    try {
      console.log('📝 Formulaire soumis avec données:', formData);

      // Validation
      const errors = [];
      
      if (!formData.name?.trim()) errors.push('Le nom est requis');
      if (!formData.email?.trim()) errors.push('L\'email est requis');
      if (!formData.email?.includes('@')) errors.push('Email invalide');
      if (!formData.role) errors.push('Le rôle est requis');
      if (!formData.idUser) errors.push('Utilisateur non trouvé - ID manquant');
      
      // Validation spécifique du mot de passe pour la création
      if (!initialData && !formData.password?.trim()) {
        setPasswordError('Le mot de passe est requis pour la création');
        errors.push('Le mot de passe est requis');
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      // Vérifier que le mot de passe n'est pas vide pour la création
      if (!initialData && !formData.password) {
        throw new Error('Le mot de passe est requis');
      }

      // Nettoyer les données avant envoi
      const dataToSend: PersonnelFormData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        description: formData.description?.trim() || null,
        password: formData.password, // Garder le mot de passe tel quel
        idUser: formData.idUser
      };

      console.log('📦 Données préparées pour envoi:', dataToSend);
      
      await onSubmit(dataToSend);
      onClose();
    } catch (err: any) {
      console.error('❌ Erreur validation:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-2xl rounded-xl shadow-2xl"
          style={{ backgroundColor: COLORS.lightBg }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: COLORS.separator }}>
            <h2 className="text-xl font-semibold" style={{ color: COLORS.secondaryText }}>
              {initialData ? 'Modifier le membre' : 'Ajouter un membre'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" style={{ color: COLORS.logo }} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 rounded-lg flex items-center gap-2" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="whitespace-pre-line">{error}</span>
              </div>
            )}

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.smallText }}>
                Nom complet *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: COLORS.logo }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ 
                    borderColor: COLORS.separator,
                    color: COLORS.smallText
                  }}
                  placeholder="Jean Dupont"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.smallText }}>
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: COLORS.logo }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ 
                    borderColor: COLORS.separator,
                    color: COLORS.smallText
                  }}
                  placeholder="jean.dupont@exemple.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Rôle */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.smallText }}>
                Rôle *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'commercial', label: 'Commercial', icon: Briefcase, color: COLORS.primary },
                  { value: 'pro', label: 'Professionnel', icon: Shield, color: COLORS.logo }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !loading && setFormData(prev => ({ ...prev, role: option.value as 'commercial' | 'pro' }))}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.role === option.value ? 'border-2' : 'border'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ 
                      borderColor: formData.role === option.value ? option.color : COLORS.separator,
                      backgroundColor: formData.role === option.value ? `${option.color}20` : 'white'
                    }}
                    disabled={loading}
                  >
                    <option.icon className="w-5 h-5" style={{ color: option.color }} />
                    <span className="text-sm font-medium" style={{ color: COLORS.smallText }}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.smallText }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                style={{ 
                  borderColor: COLORS.separator,
                  color: COLORS.smallText
                }}
                placeholder="Description du rôle, responsabilités..."
                disabled={loading}
              />
            </div>

            {/* Utilisateur associé */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.smallText }}>
                Utilisateur associé
              </label>
              <div className="p-3 border rounded-lg bg-gray-50" style={{ borderColor: COLORS.separator }}>
                <div className="flex items-center gap-3">
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: COLORS.logo }}>
                      {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-medium" style={{ color: COLORS.smallText }}>
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-sm" style={{ color: COLORS.logo }}>
                      {currentUser?.email} • {currentUser?.companyName || 'Aucune entreprise'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: COLORS.separator }}>
                      ID: {currentUser?.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.smallText }}>
                {initialData ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: COLORS.logo }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:outline-none ${
                    passwordError ? 'border-red-500' : ''
                  }`}
                  style={{ 
                    borderColor: passwordError ? '#DC2626' : COLORS.separator,
                    color: COLORS.smallText
                  }}
                  placeholder={initialData ? "•••••••• (laisser vide pour conserver)" : "••••••••"}
                  required={!initialData}
                  disabled={loading}
                />
              </div>
              {passwordError && (
                <p className="text-sm mt-1" style={{ color: '#DC2626' }}>
                  {passwordError}
                </p>
              )}
              {initialData && (
                <p className="text-xs mt-1" style={{ color: COLORS.logo }}>
                  Laissez vide pour conserver le mot de passe actuel
                </p>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t" style={{ borderColor: COLORS.separator }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              style={{ color: COLORS.logo }}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: COLORS.logo,
                color: 'white'
              }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <span>{initialData ? 'Mettre à jour' : 'Ajouter'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonnelModal;