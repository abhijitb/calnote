import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const NoteSidebar = ({ 
  isOpen, 
  onClose, 
  noteData = {},
  onUpdateNote,
  availableTags = [],
  availableCategories = []
}) => {
  const [tags, setTags] = useState(noteData?.tags || []);
  const [category, setCategory] = useState(noteData?.category || '');
  const [isFavorite, setIsFavorite] = useState(noteData?.isFavorite || false);
  const [newTag, setNewTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const handleAddTag = (tagName) => {
    const trimmedTag = tagName?.trim();
    if (trimmedTag && !tags?.includes(trimmedTag)) {
      const updatedTags = [...tags, trimmedTag];
      setTags(updatedTags);
      onUpdateNote({ tags: updatedTags });
      setNewTag('');
      setShowTagSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags?.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    onUpdateNote({ tags: updatedTags });
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    onUpdateNote({ category: newCategory });
  };

  const handleFavoriteToggle = (checked) => {
    setIsFavorite(checked);
    onUpdateNote({ isFavorite: checked });
  };

  const filteredTagSuggestions = availableTags?.filter(tag => 
    tag?.toLowerCase()?.includes(newTag?.toLowerCase()) && 
    !tags?.includes(tag)
  );

  const filteredCategorySuggestions = availableCategories?.filter(cat =>
    cat?.toLowerCase()?.includes(category?.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-background border-border">
      <div className="p-3 flex-1 overflow-y-auto flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Note Details</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Favorite Toggle */}
        <div className="mb-3">
          <Checkbox
            label="Mark as favorite"
            description="Add to your favorites collection"
            checked={isFavorite}
            onChange={(e) => handleFavoriteToggle(e?.target?.checked)}
          />
        </div>

        {/* Category Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-foreground mb-1">
            Category
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter category..."
              value={category}
              onChange={(e) => handleCategoryChange(e?.target?.value)}
              className="mb-1"
            />
            {category && filteredCategorySuggestions?.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-md shadow-lg z-10 max-h-32 overflow-y-auto">
                {filteredCategorySuggestions?.slice(0, 5)?.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                    onClick={() => handleCategoryChange(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tags Section */}
        <div className="mb-3 flex-1">
          <label className="block text-sm font-medium text-foreground mb-1">
            Tags
          </label>
          
          {/* Existing Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            ))}
          </div>

          {/* Add New Tag */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => {
                setNewTag(e?.target?.value);
                setShowTagSuggestions(e?.target?.value?.length > 0);
              }}
              onKeyPress={(e) => {
                if (e?.key === 'Enter') {
                  e?.preventDefault();
                  handleAddTag(newTag);
                }
              }}
            />
            
            {/* Tag Suggestions */}
            {showTagSuggestions && filteredTagSuggestions?.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-md shadow-lg z-10 max-h-32 overflow-y-auto mt-1">
                {filteredTagSuggestions?.slice(0, 5)?.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                    onClick={() => handleAddTag(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note Metadata */}
        <div className="space-y-2 text-sm text-muted-foreground pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={14} />
            <span>Created: {new Date(noteData.createdAt || Date.now())?.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={14} />
            <span>Modified: {new Date(noteData.modifiedAt || Date.now())?.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="FileText" size={14} />
            <span>ID: {noteData?.id || 'new-note'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteSidebar;