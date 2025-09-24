import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  availableTags, 
  isExpanded, 
  onToggleExpanded 
}) => {
  const handleTagToggle = (tag) => {
    const newTags = filters?.tags?.includes(tag)
      ? filters?.tags?.filter(t => t !== tag)
      : [...filters?.tags, tag];
    onFilterChange({ ...filters, tags: newTags });
  };

  const clearAllFilters = () => {
    onFilterChange({
      showFavorites: false,
      tags: [],
      dateRange: 'all'
    });
  };

  const hasActiveFilters = filters?.showFavorites || filters?.tags?.length > 0 || filters?.dateRange !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Filters</h3>
            {hasActiveFilters && (
              <div className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                Active
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleExpanded}
              className="md:hidden"
            >
              <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="p-4 space-y-4">
          {/* Quick Filters */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Quick Filters</h4>
            
            <Checkbox
              label="Show only favorites"
              checked={filters?.showFavorites}
              onChange={(e) => onFilterChange({ ...filters, showFavorites: e?.target?.checked })}
            />
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Date Range</h4>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This week' },
                { value: 'month', label: 'This month' },
                { value: 'quarter', label: 'This quarter' }
              ]?.map((option) => (
                <label key={option?.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dateRange"
                    value={option?.value}
                    checked={filters?.dateRange === option?.value}
                    onChange={(e) => onFilterChange({ ...filters, dateRange: e?.target?.value })}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{option?.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          {availableTags?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Tags</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableTags?.map((tag) => (
                  <Checkbox
                    key={tag}
                    label={tag}
                    checked={filters?.tags?.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {filters?.showFavorites && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                    <Icon name="Star" size={12} />
                    <span>Favorites</span>
                    <button
                      onClick={() => onFilterChange({ ...filters, showFavorites: false })}
                      className="ml-1 hover:bg-accent/30 rounded-full p-0.5"
                    >
                      <Icon name="X" size={10} />
                    </button>
                  </div>
                )}
                
                {filters?.dateRange !== 'all' && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                    <Icon name="Calendar" size={12} />
                    <span>{filters?.dateRange}</span>
                    <button
                      onClick={() => onFilterChange({ ...filters, dateRange: 'all' })}
                      className="ml-1 hover:bg-primary/30 rounded-full p-0.5"
                    >
                      <Icon name="X" size={10} />
                    </button>
                  </div>
                )}
                
                {filters?.tags?.map((tag) => (
                  <div key={tag} className="flex items-center space-x-1 px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">
                    <Icon name="Tag" size={12} />
                    <span>{tag}</span>
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="ml-1 hover:bg-secondary/30 rounded-full p-0.5"
                    >
                      <Icon name="X" size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterControls;