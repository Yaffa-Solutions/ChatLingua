import { motion } from 'framer-motion';

const COLORS = [
  '#B91C1C', '#D97706', '#EA580C', '#DC2626', '#F59E0B',
  '#C2410C', '#991B1B', '#B45309', '#F97316', '#92400E',
  '#7F1D1D', '#78350F', '#9A3412', '#7C2D12', '#F87171',
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
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const bgColor = getColor(alt);

  return (
    <motion.div
      className={`relative inline-flex ${sizes[size] || sizes.md} ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/10"
        style={{ backgroundColor: bgColor }}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-dark-400 ${
            status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
          }`}
        />
      )}
    </motion.div>
  );
}
