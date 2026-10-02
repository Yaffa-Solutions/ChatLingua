import React from 'react';

export function LogoMark({ className = 'w-8 h-8', variant = 'colored' }) {
  // Dual speech bubble bridge symbol (Chat + Lingua)
  // Left bubble: Marigold, Right bubble: Sprout, overlapping to represent two languages exchanging dialogue
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Primary Left Dialogue Bubble (Marigold / Ink) */}
      <path
        d="M12.5 5C7.25329 5 3 8.80558 3 13.5C3 16.0379 4.24921 18.293 6.2207 19.8281L5.5 24L10.25 22.25C10.9785 22.4141 11.7285 22.5 12.5 22.5C17.7467 22.5 22 18.6944 22 14C22 9.30558 17.7467 5 12.5 5Z"
        fill={variant === 'mono-white' ? '#FFFFFF' : '#E0A526'}
        className="transition-colors"
      />
      {/* Secondary Right Dialogue Bubble (Sprout Green) */}
      <path
        d="M19.5 9.5C14.8056 9.5 11 12.8579 11 17C11 17.5147 11.0588 18.0163 11.1711 18.5C11.5843 18.5 12.0396 18.5 12.5 18.5C15.6582 18.5 18.4419 16.9208 20.1289 14.5029C20.6698 14.7705 21.2828 14.9219 21.9219 14.9219C22.6105 14.9219 23.2673 14.7479 23.8398 14.4414L27 16.5L26.3125 13.2969C27.971 11.9688 29 10.0547 29 7.92188C29 3.82285 24.7467 0.5 19.5 0.5"
        fill={variant === 'mono-white' ? '#FFFFFF' : '#3F8F5F'}
        opacity={variant === 'colored' ? 0.92 : 1}
        className="transition-colors"
      />
      {/* Central Dialogue Spark */}
      <circle
        cx="12.5"
        cy="13.75"
        r="2"
        fill={variant === 'mono-white' ? '#1D2B3A' : '#1D2B3A'}
      />
    </svg>
  );
}

export default function Logo({
  size = 'md',
  showText = true,
  variant = 'colored',
  className = '',
}) {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-base' },
    md: { icon: 'w-8 h-8', text: 'text-lg' },
    lg: { icon: 'w-10 h-10', text: 'text-xl' },
    xl: { icon: 'w-12 h-12', text: 'text-2xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <div className="flex-shrink-0 transition-transform group-hover:scale-105">
        <LogoMark className={currentSize.icon} variant={variant} />
      </div>
      {showText && (
        <span
          className={`font-display font-semibold tracking-tight text-ink ${currentSize.text}`}
        >
          Chat<span className="text-marigold-deep font-bold">Lingua</span>
        </span>
      )}
    </div>
  );
}
