import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  sprout: 'btn-sprout',
  danger: 'bg-redline text-white font-semibold px-5 py-2.5 rounded-sm text-caption hover:opacity-90 active:scale-[0.97] transition-all duration-150',
};

const sizes = {
  sm: 'px-3 py-1.5 text-caption',
  md: 'px-5 py-2.5 text-caption',
  lg: 'px-6 py-3 text-body',
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
        relative inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-150
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
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
