import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchResultItem = ({ note, searchQuery, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  const highlightSearchTerms = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text?.split(regex);
    
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <mark key={index} className="bg-accent/30 text-accent-foreground px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getSnippet = (content, query, maxLength = 150) => {
    if (!query || !content) {
      return content?.length > maxLength ? content?.substring(0, maxLength) + '...' : content;
    }

    const lowerContent = content?.toLowerCase();
    const lowerQuery = query?.toLowerCase();
    const queryIndex = lowerContent?.indexOf(lowerQuery);
    
    if (queryIndex === -1) {
      return content?.length > maxLength ? content?.substring(0, maxLength) + '...' : content;
    }

    const start = Math.max(0, queryIndex - 50);
    const end = Math.min(content?.length, queryIndex + query?.length + 100);
    const snippet = content?.substring(start, end);
    
    return (start > 0 ? '...' : '') + snippet + (end < content?.length ? '...' : '');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleEdit = (e) => {
    e?.stopPropagation();
    navigate(`/note-editor?id=${note?.id}`);
  };

  const handleToggleFavorite = (e) => {
    e?.stopPropagation();
    onToggleFavorite(note?.id);
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover-lift"
      onClick={() => setShowPreview(!showPreview)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
            {highlightSearchTerms(note?.title, searchQuery)}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Icon name="Calendar" size={14} className="mr-1" />
              {formatDate(note?.createdAt)}
            </span>
            {note?.modifiedAt !== note?.createdAt && (
              <span className="flex items-center">
                <Icon name="Edit3" size={14} className="mr-1" />
                Modified {formatDate(note?.modifiedAt)}
              </span>
            )}
            {note?.tags && note?.tags?.length > 0 && (
              <span className="flex items-center">
                <Icon name="Tag" size={14} className="mr-1" />
                {note?.tags?.length} tags
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className="h-8 w-8 state-change"
          >
            <Icon 
              name={note?.isFavorite ? "Heart" : "Heart"} 
              size={16} 
              className={note?.isFavorite ? "text-error fill-current" : "text-muted-foreground"}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="h-8 w-8 state-change"
          >
            <Icon name="Edit3" size={16} />
          </Button>
        </div>
      </div>
      {/* Content Snippet */}
      <div className="mb-3">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {highlightSearchTerms(getSnippet(note?.content, searchQuery), searchQuery)}
        </p>
      </div>
      {/* Tags */}
      {note?.tags && note?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note?.tags?.slice(0, 3)?.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground"
            >
              {highlightSearchTerms(tag, searchQuery)}
            </span>
          ))}
          {note?.tags?.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              +{note?.tags?.length - 3} more
            </span>
          )}
        </div>
      )}
      {/* Expanded Preview */}
      {showPreview && (
        <div className="border-t border-border pt-3 mt-3 progressive-disclosure">
          <div className="bg-muted rounded-md p-3">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {highlightSearchTerms(note?.content, searchQuery)}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              {note?.content?.length} characters • {Math.ceil(note?.content?.split(' ')?.length / 200)} min read
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              iconName="ExternalLink"
              iconPosition="right"
              iconSize={14}
            >
              Open Note
            </Button>
          </div>
        </div>
      )}
      {/* Match Relevance Indicator */}
      {searchQuery && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Relevance:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5]?.map((level) => (
                <div
                  key={level}
                  className={`w-2 h-2 rounded-full ${
                    level <= note?.relevanceScore 
                      ? 'bg-primary' :'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {note?.matchCount} matches
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchResultItem;