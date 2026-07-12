import React from 'react';
import * as Icons from 'lucide-react';

const EmptyState = ({ 
  icon = 'Inbox', 
  title = 'No Records Found', 
  description = 'There are no active records in this view.', 
  actionText, 
  onAction 
}) => {
  const IconComponent = Icons[icon] || Icons.Inbox;

  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700/80 max-w-md mx-auto shadow-sm my-6 transition-all">
      <div className="p-4.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl text-slate-400 dark:text-slate-505 mb-4.5 border border-slate-100 dark:border-slate-800 shadow-inner">
        <IconComponent className="w-9 h-9 stroke-[1.25] text-primary-500/80 dark:text-primary-400/80" />
      </div>
      <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-450 dark:text-slate-400 mt-2 max-w-xs mb-6 leading-relaxed font-semibold">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-primary-500 to-indigo-650 hover:from-primary-600 hover:to-indigo-700 rounded-xl shadow-md shadow-primary-500/10 transition-all duration-150 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
