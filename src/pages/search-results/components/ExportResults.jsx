import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportResults = ({ results, searchQuery, onExport }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await onExport(results, format, searchQuery);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    { value: 'json', label: 'JSON', icon: 'FileCode', description: 'Structured data format' },
    { value: 'csv', label: 'CSV', icon: 'FileSpreadsheet', description: 'Spreadsheet format' },
    { value: 'txt', label: 'Text', icon: 'FileText', description: 'Plain text format' },
    { value: 'md', label: 'Markdown', icon: 'FileType', description: 'Markdown format' }
  ];

  if (!results || results?.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon name="Download" size={16} className="mr-2 text-accent" />
          <h3 className="text-sm font-medium text-foreground">
            Export Search Results
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {results?.length} notes
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {exportOptions?.map((option) => (
          <Button
            key={option?.value}
            variant="outline"
            size="sm"
            onClick={() => handleExport(option?.value)}
            disabled={isExporting}
            className="flex flex-col items-center p-3 h-auto hover:bg-accent/5"
          >
            <Icon 
              name={option?.icon} 
              size={20} 
              className="mb-2 text-muted-foreground" 
            />
            <span className="text-xs font-medium">{option?.label}</span>
            <span className="text-xs text-muted-foreground text-center">
              {option?.description}
            </span>
          </Button>
        ))}
      </div>
      {searchQuery && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Results for: "<span className="font-medium text-foreground">{searchQuery}</span>"
            </span>
            <span>
              Exported on {new Date()?.toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
      {isExporting && (
        <div className="mt-4 flex items-center justify-center py-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="animate-spin">
              <Icon name="Loader2" size={16} />
            </div>
            <span>Preparing export...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportResults;