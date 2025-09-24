import React from 'react';
import Icon from '../../../components/AppIcon';

const AutoSaveIndicator = ({ 
  saveStatus = 'saved', 
  lastSaved = null,
  wordCount = 0 
}) => {
  const getStatusConfig = () => {
    switch (saveStatus) {
      case 'saving':
        return {
          icon: 'Loader2',
          text: 'Saving...',
          className: 'text-warning animate-spin',
          bgColor: 'bg-warning/10'
        };
      case 'saved':
        return {
          icon: 'Check',
          text: 'Saved',
          className: 'text-success',
          bgColor: 'bg-success/10'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          text: 'Save failed',
          className: 'text-error',
          bgColor: 'bg-error/10'
        };
      case 'unsaved':
        return {
          icon: 'Clock',
          text: 'Unsaved changes',
          className: 'text-warning',
          bgColor: 'bg-warning/10'
        };
      default:
        return {
          icon: 'FileText',
          text: 'Ready',
          className: 'text-muted-foreground',
          bgColor: 'bg-muted'
        };
    }
  };

  const config = getStatusConfig();
  
  const formatLastSaved = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const saved = new Date(timestamp);
    const diffInMinutes = Math.floor((now - saved) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return saved?.toLocaleDateString();
  };

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config?.bgColor}`}>
        <Icon 
          name={config?.icon} 
          size={14} 
          className={config?.className}
        />
        <span className={config?.className}>
          {config?.text}
        </span>
        {lastSaved && saveStatus === 'saved' && (
          <span className="text-xs opacity-75">
            {formatLastSaved(lastSaved)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs">
          {wordCount?.toLocaleString()} words
        </span>
      </div>
    </div>
  );
};

export default AutoSaveIndicator;