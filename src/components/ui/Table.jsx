import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Table = ({
  headers = [], // [{ key, label, className }]
  data = [],
  renderRow,
  loading = false,
  emptyMessage = 'No data available in this table view.',
  className = '',
}) => {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
              {headers.map((h, idx) => (
                <th 
                  key={idx} 
                  className={`p-4 font-bold ${typeof h === 'object' ? h.className || '' : ''}`}
                >
                  {typeof h === 'object' ? h.label : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40 text-slate-700 dark:text-slate-300">
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <LoadingSpinner size="md" />
                    <span className="text-slate-400 font-medium">Fetching table records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, idx) => renderRow(row, idx))
            ) : (
              <tr>
                <td colSpan={headers.length} className="p-8 text-center text-slate-400 font-medium">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
