import React from 'react';
import * as Icons from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, success, danger, outline, ghost
  size = 'md', // xs, sm, md, lg
  loading = false,
  disabled = false,
  onClick,
  iconLeft,
  iconRight,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-500/10 hover:shadow-lg focus:ring-primary-500/30',
    secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-slate-500/30',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 hover:shadow-lg focus:ring-emerald-500/30',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 hover:shadow-lg focus:ring-rose-500/30',
    outline: 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 focus:ring-slate-500/30',
    ghost: 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 focus:ring-slate-500/10',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-[10px] space-x-1',
    sm: 'px-3.5 py-1.5 text-xs space-x-1.5',
    md: 'px-5 py-2.5 text-xs space-x-2',
    lg: 'px-6 py-3 text-sm space-x-2.5',
  };

  const IconL = iconLeft && Icons[iconLeft] ? Icons[iconLeft] : null;
  const IconR = iconRight && Icons[iconRight] ? Icons[iconRight] : null;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <Icons.Loader className="w-4 h-4 animate-spin flex-shrink-0" />
      )}
      {!loading && IconL && <IconL className="w-4 h-4 flex-shrink-0" />}
      <span>{children}</span>
      {!loading && IconR && <IconR className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
};

export default Button;
