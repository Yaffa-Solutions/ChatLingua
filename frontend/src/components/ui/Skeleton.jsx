export default function Skeleton({ className = '', variant = 'text' }) {
  const base = 'animate-pulse rounded-lg bg-white/[0.04]';
  const variants = {
    text: 'h-4 w-full',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full',
    title: 'h-6 w-3/4',
    button: 'h-10 w-24',
  };

  return (
    <div className={`relative overflow-hidden ${base} ${variants[variant] || variants.text} ${className}`}>
      <div className="absolute inset-0 shimmer-bg" />
    </div>
  );
}
