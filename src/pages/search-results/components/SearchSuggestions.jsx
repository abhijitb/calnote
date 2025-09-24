import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchSuggestions = ({ suggestions, onSuggestionClick, searchQuery }) => {
  if (!suggestions || suggestions?.length === 0) return null;

  const suggestionTypes = {
    recent: { icon: 'Clock', label: 'Recent searches' },
    popular: { icon: 'TrendingUp', label: 'Popular searches' },
    related: { icon: 'Link', label: 'Related terms' },
    tags: { icon: 'Tag', label: 'Tags' }
  };

  const groupedSuggestions = suggestions?.reduce((acc, suggestion) => {
    const type = suggestion?.type || 'related';
    if (!acc?.[type]) acc[type] = [];
    acc?.[type]?.push(suggestion);
    return acc;
  }, {});

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center mb-3">
        <Icon name="Lightbulb" size={16} className="mr-2 text-accent" />
        <h3 className="text-sm font-medium text-foreground">
          {searchQuery ? 'Related suggestions' : 'Search suggestions'}
        </h3>
      </div>
      <div className="space-y-4">
        {Object.entries(groupedSuggestions)?.map(([type, items]) => (
          <div key={type}>
            <div className="flex items-center mb-2">
              <Icon 
                name={suggestionTypes?.[type]?.icon || 'Search'} 
                size={14} 
                className="mr-2 text-muted-foreground" 
              />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {suggestionTypes?.[type]?.label || 'Suggestions'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {items?.slice(0, 6)?.map((suggestion, index) => (
                <Button
                  key={`${type}-${index}`}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick(suggestion?.query)}
                  className="text-xs h-8 px-3 hover:bg-accent/10 hover:border-accent/30"
                >
                  {suggestion?.query}
                  {suggestion?.count && (
                    <span className="ml-2 text-muted-foreground">
                      ({suggestion?.count})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {searchQuery && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Try searching for specific terms or phrases
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSuggestionClick('')}
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={14}
              className="text-xs"
            >
              Clear search
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;