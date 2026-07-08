import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input-field ${error ? 'border-red-500/50 ring-red-500/20' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
