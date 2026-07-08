import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-caption font-medium text-ink">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full rounded-sm border border-stone-line bg-white px-4 py-3 text-body text-ink placeholder-ink-40 outline-none transition-all duration-150 focus:border-marigold focus:ring-2 focus:ring-marigold/20 ${error ? 'border-redline ring-redline/20' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-caption text-redline mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
