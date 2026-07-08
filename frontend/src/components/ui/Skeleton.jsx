export default function Skeleton({ className = '', variant = 'text' }) {
  const base = 'animate-pulse rounded-sm bg-stone-line/50';
  const variants = {
    text: 'h-4 w-full',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full',
    title: 'h-6 w-3/4',
    button: 'h-10 w-24',
  };

  return (
    <div className={`${base} ${variants[variant] || variants.text} ${className}`} />
  );
}
