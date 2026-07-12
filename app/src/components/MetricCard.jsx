import React from 'react';
import * as Icons from 'lucide-react';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trendValue, 
  trendDirection = 'up', // up, down, neutral
  trendLabel = 'vs last hour',
  color = 'blue', // blue, green, red, yellow, slate
  sparklineData = [10, 15, 8, 12, 18, 25, 20] // mini data points
}) => {
  const IconComponent = Icons[icon] || Icons.TrendingUp;

  const colorStyles = {
    blue: {
      bg: 'bg-primary-50 dark:bg-primary-900/10',
      text: 'text-primary-500 dark:text-primary-400',
      border: 'border-primary-100 dark:border-primary-800/30',
      sparkColor: 'stroke-primary-500 dark:stroke-primary-400',
      fillColor: 'fill-primary-500/10 dark:fill-primary-400/5'
    },
    green: {
      bg: 'bg-accent-50 dark:bg-accent-900/10',
      text: 'text-accent-500 dark:text-accent-400',
      border: 'border-accent-100 dark:border-accent-800/30',
      sparkColor: 'stroke-accent-500 dark:stroke-accent-400',
      fillColor: 'fill-accent-500/10 dark:fill-accent-400/5'
    },
    red: {
      bg: 'bg-rose-50 dark:bg-rose-900/10',
      text: 'text-rose-500 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-800/30',
      sparkColor: 'stroke-rose-500 dark:stroke-rose-400',
      fillColor: 'fill-rose-500/10 dark:fill-rose-400/5'
    },
    yellow: {
      bg: 'bg-amber-50 dark:bg-amber-900/10',
      text: 'text-amber-500 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-800/30',
      sparkColor: 'stroke-amber-500 dark:stroke-amber-400',
      fillColor: 'fill-amber-500/10 dark:fill-amber-400/5'
    },
    slate: {
      bg: 'bg-slate-50 dark:bg-slate-800/50',
      text: 'text-slate-500 dark:text-slate-400',
      border: 'border-slate-100 dark:border-slate-800/50',
      sparkColor: 'stroke-slate-500 dark:stroke-slate-400',
      fillColor: 'fill-slate-500/10 dark:fill-slate-400/5'
    }
  };

  const style = colorStyles[color] || colorStyles.blue;

  // Generate SVG path for sparkline
  const width = 120;
  const height = 40;
  const padding = 2;
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  
  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((val - min) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  });
  
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <div className={`p-6 bg-white dark:bg-slate-800 border ${style.border} rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${style.bg} ${style.text}`}>
          <IconComponent className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      <div className="flex items-end justify-between mt-auto">
        <div className="flex flex-col space-y-1">
          {trendValue && (
            <div className="flex items-center space-x-1.5">
              {trendDirection === 'up' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icons.TrendingUp className="w-3.5 h-3.5 mr-1" />
                  {trendValue}
                </span>
              )}
              {trendDirection === 'down' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Icons.TrendingDown className="w-3.5 h-3.5 mr-1" />
                  {trendValue}
                </span>
              )}
              {trendDirection === 'neutral' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400">
                  <Icons.Minus className="w-3.5 h-3.5 mr-1" />
                  {trendValue}
                </span>
              )}
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {trendLabel}
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Sparkline */}
        <div className="w-[120px] h-[40px] opacity-70 hover:opacity-100 transition-opacity">
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
            <path
              d={areaD}
              className={style.fillColor}
              stroke="none"
            />
            <path
              d={pathD}
              fill="none"
              className={style.sparkColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
