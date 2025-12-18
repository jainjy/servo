import React from 'react';
import logoImage from '/logo.jpeg';

interface ServoLogoProps {
  size?: number;
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  showTagline?: boolean;
}

const ServoLogo: React.FC<ServoLogoProps> = ({
  size = 130,
  variant = 'full',
  className = '',
  showTagline = false,
}) => {
  const primaryColor = '#556B2F';
  const secondaryColor = "#8B4513";
  const iconSize = size * 0.4;
  const textSize = size * 0.2;

  // Image logo au lieu du SVG
  const IconSVG = () => (
    <img
      src={logoImage}
      alt="OLIPLUSLogo"
      width={iconSize}
      height={iconSize}
      className="flex-shrink-0 rounded-full"
    />
  );

  // Version texte
  const TextOnly = () => (
    <div className="flex flex-col">
      <div 
        className="azonix lg:block hidden font-bold tracking-tight"
        style={{ 
          color: secondaryColor,
          fontSize: `${textSize}px`,
          lineHeight: 1
        }}
      >
        OLIPLUS
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