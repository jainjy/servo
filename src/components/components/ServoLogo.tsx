import React from 'react';

interface ServoLogoProps {
  size?: number;
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  showTagline?: boolean;
}

const ServoLogo: React.FC<ServoLogoProps> = ({
  size = 120,
  variant = 'full',
  className = '',
  showTagline = false,
}) => {
  const primaryColor = '#556B2F';
  const iconSize = size * 0.4;
  const textSize = size * 0.2;

  // Version SVG de l'icône
  const IconSVG = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      className="flex-shrink-0"
    >
      {/* Cercle extérieur */}
      <circle cx="50" cy="50" r="45" fill={primaryColor} />
      
      {/* Cercle intérieur */}
      <circle cx="50" cy="50" r="30" fill="white" />
      
      {/* Engrenage stylisé */}
      <circle cx="50" cy="50" r="15" fill={primaryColor} />
      
      {/* Croix intérieure (représentant le mouvement servo) */}
      <rect x="47.5" y="30" width="5" height="40" rx="2.5" fill="white" />
      <rect x="30" y="47.5" width="40" height="5" rx="2.5" fill="white" />
      
      {/* Détails d'engrenage */}
      {[0, 45, 90, 135].map((rotation, index) => (
        <rect
          key={index}
          x="47.5"
          y="15"
          width="5"
          height="15"
          rx="2.5"
          fill={primaryColor}
          transform={`rotate(${rotation} 50 50)`}
        />
      ))}
    </svg>
  );

  // Version texte
  const TextOnly = () => (
    <div className="flex flex-col">
      <div 
        className="azonix font-bold tracking-tight"
        style={{ 
          color: primaryColor,
          fontSize: `${textSize}px`,
          lineHeight: 1
        }}
      >
        SERVO
      </div>
      {showTagline && (
        <div 
          className="text-gray-600 font-medium mt-1"
          style={{ fontSize: `${textSize * 0.5}px` }}
        >
          Precision in Motion
        </div>
      )}
    </div>
  );

  // Logo complet
  const FullLogo = () => (
    <div className="flex items-center space-x-4">
      <IconSVG />
      <TextOnly />
    </div>
  );

  // Rendu conditionnel
  const renderVariant = () => {
    switch (variant) {
      case 'icon':
        return <IconSVG />;
      case 'text':
        return <TextOnly />;
      default:
        return <FullLogo />;
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {renderVariant()}
    </div>
  );
};

export default ServoLogo;