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
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 max-w-lg mx-auto shadow-sm my-6">
      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-full text-slate-400 dark:text-slate-500 mb-4">
        <IconComponent className="w-10 h-10 stroke-[1.5]" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6 leading-relaxed font-semibold">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-lg shadow-sm hover:shadow transition-all duration-200"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
