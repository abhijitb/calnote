import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NoteCard = ({ note, onToggleFavorite, onDelete, onEdit, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);

  const handleCardClick = () => {
    navigate(`/note-editor?id=${note?.id}`);
  };

  const handleActionClick = (e, action) => {
    e?.stopPropagation();
    action();
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text?.length <= maxLength) return text;
    return text?.substring(0, maxLength) + '...';
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-card border border-border rounded-lg p-4 hover-lift cursor-pointer transition-all duration-200 hover:shadow-md"
        onClick={handleCardClick}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {note?.title}
              </h3>
              {note?.isFavorite && (
                <Icon name="Star" size={16} className="text-accent fill-current" />
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
              {truncateText(note?.content, 120)}
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Created: {formatDate(note?.createdAt)}</span>
              <span>Modified: {formatDate(note?.modifiedAt)}</span>
              {note?.tags && note?.tags?.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Icon name="Tag" size={12} />
                  <span>{note?.tags?.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
          <div className={`flex items-center space-x-1 transition-opacity duration-200 ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleActionClick(e, () => onToggleFavorite(note?.id))}
              className="h-8 w-8"
            >
              <Icon 
                name="Star" 
                size={16} 
                className={note?.isFavorite ? 'text-accent fill-current' : 'text-muted-foreground'} 
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleActionClick(e, () => onEdit(note?.id))}
              className="h-8 w-8"
            >
              <Icon name="Edit3" size={16} className="text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleActionClick(e, () => onDelete(note?.id))}
              className="h-8 w-8"
            >
              <Icon name="Trash2" size={16} className="text-error" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-card border border-border rounded-lg p-4 hover-lift cursor-pointer transition-all duration-200 hover:shadow-md group"
      onClick={handleCardClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground truncate flex-1 mr-2">
          {note?.title}
        </h3>
        <div className="flex items-center space-x-1">
          {note?.isFavorite && (
            <Icon name="Star" size={16} className="text-accent fill-current" />
          )}
          <div className={`flex items-center space-x-1 transition-opacity duration-200 ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleActionClick(e, () => onToggleFavorite(note?.id))}
              className="h-7 w-7"
            >
              <Icon 
                name="Star" 
                size={14} 
                className={note?.isFavorite ? 'text-accent fill-current' : 'text-muted-foreground'} 
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleActionClick(e, () => onEdit(note?.id))}
              className="h-7 w-7"
            >
              <Icon name="Edit3" size={14} className="text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleActionClick(e, () => onDelete(note?.id))}
              className="h-7 w-7"
            >
              <Icon name="Trash2" size={14} className="text-error" />
            </Button>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
        {truncateText(note?.content, 100)}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(note?.createdAt)}</span>
        {note?.tags && note?.tags?.length > 0 && (
          <div className="flex items-center space-x-1">
            <Icon name="Tag" size={12} />
            <span className="truncate max-w-20">{note?.tags?.[0]}</span>
            {note?.tags?.length > 1 && <span>+{note?.tags?.length - 1}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;