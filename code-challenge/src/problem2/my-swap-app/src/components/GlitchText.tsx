/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  children: React.ReactNode;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = '',
}) => {
  const inlineStyles: React.CSSProperties = {
    ['--after-duration' as any]: `${speed * 3}s`,
    ['--before-duration' as any]: `${speed * 2}s`,
    ['--after-shadow' as any]: enableShadows ? '-5px 0 red' : 'none',
    ['--before-shadow' as any]: enableShadows ? '5px 0 cyan' : 'none',
  };

  const hoverClass = enableOnHover ? 'enable-on-hover' : '';

  return (
    <div
      className={`glitch ${hoverClass} ${className}`} 
      style={inlineStyles}
      data-text={children as string}
    >
      {children}
    </div>
  );
};

export default GlitchText;
