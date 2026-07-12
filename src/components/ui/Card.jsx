import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  accentColor, // blue, green, red, yellow, slate
  noPadding = false,
  ...props
}) => {
  const accentStyles = {
    blue: 'border-l-4 border-l-primary-500',
    green: 'border-l-4 border-l-emerald-500',
    red: 'border-l-4 border-l-rose-500',
    yellow: 'border-l-4 border-l-amber-500',
    slate: 'border-l-4 border-l-slate-400',
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm transition-all duration-200 hover:shadow-md ${
        accentColor ? accentStyles[accentColor] : ''
      } ${className}`}
      {...props}
    >
      {/* Card Header */}
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/10">
          <div>
            {title && <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm tracking-tight">{title}</h3>}
            {subtitle && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-semibold">{subtitle}</p>}
          </div>
          {headerAction && <div className="flex items-center">{headerAction}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/20 dark:bg-slate-900/10 text-xs">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
