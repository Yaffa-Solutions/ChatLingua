import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30',
  secondary: 'glass glass-hover text-gray-100',
  ghost: 'bg-transparent hover:bg-white/[0.06] text-gray-300',
  danger: 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg',
  gradient: 'bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%] animate-gradient text-white shadow-lg',
  premium: 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg shadow-secondary/20 hover:shadow-secondary/40',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-300 overflow-hidden
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.03, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
        </svg>
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
