import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DashboardToolbar = ({ 
  onSearch, 
  onSortChange, 
  onViewModeChange, 
  onFilterChange,
  viewMode,
  sortBy,
  searchQuery,
  totalNotes,
  filteredNotes 
}) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedTags, setSelectedTags] = useState([]);

  const sortOptions = [
    { value: 'createdAt', label: 'Created Date', icon: 'Calendar' },
    { value: 'modifiedAt', label: 'Modified Date', icon: 'Clock' },
    { value: 'title', label: 'Title A-Z', icon: 'AlphabeticalSort' },
    { value: 'favorites', label: 'Favorites First', icon: 'Star' }
  ];

  const availableTags = [
    "Work", "Personal", "Ideas", "Meeting", "Project", "Research", "Todo", "Important"
  ];

  const handleTagToggle = (tag) => {
    const newTags = selectedTags?.includes(tag)
      ? selectedTags?.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onFilterChange({ tags: newTags, dateRange });
  };

  const handleDateRangeChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    onFilterChange({ tags: selectedTags, dateRange: newDateRange });
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setDateRange({ start: '', end: '' });
    onFilterChange({ tags: [], dateRange: { start: '', end: '' } });
  };

  const hasActiveFilters = selectedTags?.length > 0 || dateRange?.start || dateRange?.end;

  return (
    <div className="bg-background border-b border-border">
      {/* Main Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="default"
            onClick={() => navigate('/note-editor')}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            className="floating-action"
          >
            New Note
          </Button>
          
          <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{filteredNotes} of {totalNotes} notes</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                iconName="X"
                iconPosition="left"
                iconSize={14}
                className="text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearch(e?.target?.value)}
              className="pl-10"
            />
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              iconName="Grid3X3"
              className="h-8 w-8 p-0"
            />
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              iconName="List"
              className="h-8 w-8 p-0"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e?.target?.value)}
              className="appearance-none bg-background border border-border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            <Icon
              name="ChevronDown"
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            iconName="Filter"
            iconPosition="left"
            iconSize={16}
            className={hasActiveFilters ? 'color-code-primary' : ''}
          >
            Filters
            {hasActiveFilters && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5">
                {selectedTags?.length + (dateRange?.start || dateRange?.end ? 1 : 0)}
              </span>
            )}
          </Button>
        </div>
      </div>
      {/* Mobile Stats */}
      <div className="lg:hidden px-4 pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filteredNotes} of {totalNotes} notes</span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
              className="text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="border-t border-border bg-muted/30 p-4 animate-slide-down">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Range Filter */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Date Range</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  label="From"
                  value={dateRange?.start}
                  onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
                  className="text-sm"
                />
                <Input
                  type="date"
                  label="To"
                  value={dateRange?.end}
                  onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags?.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTags?.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTagToggle(tag)}
                    className="text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardToolbar;