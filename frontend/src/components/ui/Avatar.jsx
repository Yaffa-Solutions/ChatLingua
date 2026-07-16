import { motion } from 'framer-motion';

const COLORS = [
  '#1D2B3A', '#E0A526', '#3F8F5F', '#C4472F', '#A79C87',
  '#B8830F', '#4C5A68', '#8A94A0', '#DCEDE1',
];

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Avatar({ alt = '', size = 'md', status, className = '' }) {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const bgColor = getColor(alt);
  const isLight = bgColor === '#E0A526' || bgColor === '#DCEDE1' || bgColor === '#8A94A0';

  return (
    <motion.div
      className={`relative inline-flex ${sizes[size] || sizes.md} ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-white/20"
        style={{ backgroundColor: bgColor, color: isLight ? '#1D2B3A' : '#F3F0E6' }}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-paper ${
            status === 'online' ? 'bg-sprout' : status === 'away' ? 'bg-marigold' : 'bg-stone'
          }`}
        />
      )}
    </motion.div>
  );
}
