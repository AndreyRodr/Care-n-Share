import React, { useId } from 'react';

// Marca própria (não é um lockup de círculos sobrepostos): uma folha/broto (a causa que cresce,
// "Care") apoiada por um traço em arco que a sustenta por baixo (a mão que ampara, "Share").
// Uma única forma legível em qualquer tamanho, sem parecer com nenhuma marca existente.
// tone: 'brand' (cores da marca, padrão) | 'mono' (usa currentColor, pra fundos escuros/coloridos)
// rich: versão com gradiente + sombra, pra usos grandes (hero da landing). Em tamanhos pequenos
// (favicon, navbar) o achatado (rich=false) é o certo, senão a marca "suja" e perde legibilidade.
const LogoMark = ({ size = 28, className = '', tone = 'brand', rich = false }) => {
  const uid = useId();
  const leafGradId = `care-leaf-${uid}`;
  const arcGradId = `care-arc-${uid}`;
  const shadowId = `care-shadow-${uid}`;

  const useGradients = rich && tone !== 'mono';
  const arcColor = tone === 'mono' ? 'currentColor' : (useGradients ? `url(#${arcGradId})` : 'var(--cozy-warm)');
  const leafColor = tone === 'mono' ? 'currentColor' : (useGradients ? `url(#${leafGradId})` : 'var(--cozy-accent)');

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} role="img" aria-label="Care n' Share">
      {useGradients && (
        <defs>
          <linearGradient id={leafGradId} x1="14" y1="6" x2="34" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#14a085" />
            <stop offset="1" stopColor="#0b6350" />
          </linearGradient>
          <linearGradient id={arcGradId} x1="9" y1="26" x2="39" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f7b26a" />
            <stop offset="1" stopColor="#e6803a" />
          </linearGradient>
          <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0b6350" floodOpacity="0.35" />
          </filter>
        </defs>
      )}
      <path
        d="M9 26C9 34.5 15.6 40 24 40C32.4 40 39 34.5 39 26"
        stroke={arcColor}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity={tone === 'mono' ? 0.55 : 1}
        filter={rich ? `url(#${shadowId})` : undefined}
      />
      <path
        d="M24 6C30.6 6 34 13.4 34 21C34 28.2 29.8 33.6 24 36C18.2 33.6 14 28.2 14 21C14 13.4 17.4 6 24 6Z"
        fill={leafColor}
        filter={rich ? `url(#${shadowId})` : undefined}
      />
      {rich && tone !== 'mono' && (
        <path
          d="M22 10C19 13 17.5 17 17.5 21.5C17.5 26 19.3 29.6 22 32"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
};

// variant: 'mark' (só o símbolo) | 'horizontal' (símbolo + wordmark lado a lado) | 'stacked' (empilhado)
const Logo = ({ variant = 'mark', size = 28, className = '', tone = 'brand', rich = false }) => {
  if (variant === 'mark') {
    return <LogoMark size={size} className={className} tone={tone} rich={rich} />;
  }
  return (
    <div className={`logo-lockup logo-lockup--${variant} ${rich ? 'logo-lockup--rich' : ''} ${className}`.trim()}>
      <LogoMark size={size} tone={tone} rich={rich} />
      <span className="logo-wordmark">Care n' Share</span>
    </div>
  );
};

export default Logo;
export { LogoMark };
