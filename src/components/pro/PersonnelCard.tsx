// PersonnelCard.tsx
import React from 'react';
import { Edit2, Trash2, Mail, Calendar, User, Briefcase, Shield } from 'lucide-react';

// Constantes de couleur basées sur votre palette
const COLORS = {
  logo: "#556B2F",           /* Olive green - logo/accent */
  primary: "#6B8E23",        /* Yellow-green - primary-dark */
  lightBg: "#FFFFFF",        /* White - light-bg */
  separator: "#D3D3D3",      /* Light gray - separator */
  secondaryText: "#8B4513",  /* Saddle brown - secondary-text */
  smallText: "#000000",      /* Black for small text */
};

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  userType: string;
  avatar?: string;
}

interface Personnel {
  id: string;
  name: string;
  email: string;
  role: 'commercial' | 'pro' | 'support';
  description: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  userId: string;
}

interface PersonnelCardProps {
  personnel: Personnel;
  onEdit: (personnel: Personnel) => void;
  onDelete: (id: string) => void;
  getRoleIcon: (role: string) => React.ReactNode;
  getRoleColor: (role: string) => string;
  getRoleLabel: (role: string) => string;
}

const PersonnelCard: React.FC<PersonnelCardProps> = ({
  personnel,
  onEdit,
  onDelete,
  getRoleIcon,
  getRoleColor,
  getRoleLabel
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserFullName = () => {
    if (personnel.user?.firstName && personnel.user?.lastName) {
      return `${personnel.user.firstName} ${personnel.user.lastName}`;
    }
    return personnel.user?.email || 'Utilisateur inconnu';
  };

  return (
    <div 
      className="rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border"
      style={{ 
        backgroundColor: COLORS.lightBg,
        borderColor: COLORS.separator
      }}
    >
      {/* Header avec rôle */}
      <div className="p-4" style={{ borderBottom: `1px solid ${COLORS.separator}` }}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {/* Avatar avec initiales */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: getRoleColor(personnel.role) }}
            >
              {getInitials(personnel.name)}
            </div>
            <div>
              <h3 className="font-semibold text-lg" style={{ color: COLORS.smallText }}>
                {personnel.name}
              </h3>
              <span 
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${getRoleColor(personnel.role)}20`,
                  color: getRoleColor(personnel.role)
                }}
              >
                {getRoleIcon(personnel.role)}
                {getRoleLabel(personnel.role)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(personnel)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: COLORS.logo }}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(personnel.id)}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              style={{ color: '#DC2626' }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Corps de la carte */}
      <div className="p-4 space-y-3">
        {/* Email */}
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4" style={{ color: COLORS.logo }} />
          <span style={{ color: COLORS.smallText }}>{personnel.email}</span>
        </div>

        {/* Description */}
        {personnel.description && (
          <p className="text-sm" style={{ color: COLORS.logo }}>
            {personnel.description}
          </p>
        )}

        {/* Utilisateur associé */}
        <div className="flex items-center gap-2 text-sm p-2 rounded-lg" style={{ backgroundColor: `${COLORS.separator}30` }}>
          <User className="w-4 h-4" style={{ color: COLORS.primary }} />
          <span className="font-medium" style={{ color: COLORS.smallText }}>Associé à :</span>
          <span style={{ color: COLORS.logo }}>{getUserFullName()}</span>
        </div>

        {/* Informations supplémentaires */}
        <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: COLORS.logo }}>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Créé le {formatDate(personnel.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4" style={{ backgroundColor: '#F9FAFB', borderTop: `1px solid ${COLORS.separator}` }}>
        <div className="flex justify-between items-center text-xs">
          <span style={{ color: COLORS.separator }}>
            ID: {personnel.id.slice(0, 8)}...
          </span>
          <span style={{ color: COLORS.logo }}>
            Mis à jour le {formatDate(personnel.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonnelCard;