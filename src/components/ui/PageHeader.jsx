import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const PageHeader = ({
  title,
  description,
  breadcrumbs = [], // [{ label, path }]
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm mb-6 ${className}`}>
      <div className="space-y-1">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            <Link to="/" className="hover:text-slate-600 dark:hover:text-slate-300">Home</Link>
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                <Icons.ChevronRight className="w-3 h-3 text-slate-350 dark:text-slate-655" />
                {bc.path ? (
                  <Link to={bc.path} className="hover:text-slate-600 dark:hover:text-slate-300">
                    {bc.label}
                  </Link>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">{bc.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal font-semibold mt-0.5">
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex-shrink-0 flex items-center">{action}</div>}
    </div>
  );
};

export default PageHeader;
