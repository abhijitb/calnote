import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchHeader = ({ onSearchChange, onFilterChange, resultCount }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    sortBy: 'relevance',
    tags: []
  });

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      onSearchChange(searchQuery?.trim());
      navigate(`/search-results?q=${encodeURIComponent(searchQuery?.trim())}`);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
    navigate('/search-results');
  };

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];

  return (
    <div className="bg-background border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="relative max-w-2xl">
            <Input
              type="search"
              placeholder="Search your notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="pl-12 pr-12 h-12 text-lg bg-card border-border focus:bg-background"
            />
            <Icon
              name="Search"
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <Icon name="X" size={16} />
              </Button>
            )}
          </div>
        </form>

        {/* Results Info and Filters Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              {resultCount > 0 ? (
                <>
                  <span className="font-medium text-foreground">{resultCount}</span> results
                  {searchQuery && (
                    <>
                      {" "}for "<span className="font-medium text-foreground">{searchQuery}</span>"
                    </>
                  )}
                </>
              ) : (
                searchQuery ? `No results for "${searchQuery}"` : 'Enter a search term to find notes'
              )}
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            iconName={showFilters ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
          >
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-muted rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date Range
                </label>
                <select
                  value={filters?.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e?.target?.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {dateRangeOptions?.map(option => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sort By
                </label>
                <select
                  value={filters?.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e?.target?.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions?.map(option => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Actions */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({ dateRange: 'all', sortBy: 'relevance', tags: [] });
                    onFilterChange({ dateRange: 'all', sortBy: 'relevance', tags: [] });
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;