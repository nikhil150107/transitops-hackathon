import React, { useEffect } from 'react';
import * as Icons from 'lucide-react';

const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md', // sm, md, lg
  className = ''
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-350"
        onClick={onClose}
      ></div>

      {/* Modal Dialog Box */}
      <div 
        className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl z-10 w-full ${sizes[size]} p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150 relative ${className}`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-650 transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mt-5 flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
