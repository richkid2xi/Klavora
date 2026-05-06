import React from 'react';

interface MaterialIconProps {
  icon: string;
  className?: string;
  fill?: boolean;
  weight?: number;
  grade?: number;
  opsz?: number;
  style?: React.CSSProperties;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({ 
  icon, 
  className = '', 
  fill = false, 
  weight = 400, 
  grade = 0, 
  opsz = 24,
  style 
}) => {
  return (
    <span 
      className={`material-symbols-rounded ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`,
        fontSize: opsz,
        ...style
      }}
    >
      {icon}
    </span>
  );
};
