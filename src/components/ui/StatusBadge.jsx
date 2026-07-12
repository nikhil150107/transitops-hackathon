import React from 'react';

const StatusBadge = ({
  children,
  status, // optional: maps status text directly to variants
  variant = 'slate', // blue, green, yellow, red, slate
  className = '',
  pulse = false,
  ...props
}) => {
  const getBadgeStyle = () => {
    // Auto-map common transit statuses
    const value = (status || children || '').toLowerCase();
    
    if (value === 'on time' || value === 'resolved' || value === 'active' || value === 'available') {
      return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
    }
    if (value === 'delayed' || value === 'in progress' || value === 'warning' || value === 'medium') {
      return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
    }
    if (value === 'sos' || value === 'critical' || value === 'emergency' || value === 'stopped') {
      return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30';
    }
    if (value === 'dispatched' || value === 'scheduled' || value === 'sent') {
      return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30';
    }

    const colorVariants = {
      blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30',
      green: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30',
      yellow: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30',
      red: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30',
      slate: 'bg-slate-50 dark:bg-slate-700/30 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800',
    };

    return colorVariants[variant] || colorVariants.slate;
  };

  const isPulse = pulse || (status || '').toLowerCase() === 'sos' || (children || '').toLowerCase() === 'sos';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all duration-150 relative ${getBadgeStyle()} ${className}`}
      {...props}
    >
      {isPulse && (
        <span className="relative flex h-1.5 w-1.5 mr-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
        </span>
      )}
      {children || status}
    </span>
  );
};

export default StatusBadge;
