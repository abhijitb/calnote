import React, { useState } from 'react';
import NoteCard from './NoteCard';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NotesGrid = ({ 
  notes, 
  viewMode, 
  onToggleFavorite, 
  onDelete, 
  onEdit,
  onBulkAction,
  loading = false 
}) => {
  const [selectedNotes, setSelectedNotes] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  const handleSelectNote = (noteId) => {
    const newSelected = new Set(selectedNotes);
    if (newSelected?.has(noteId)) {
      newSelected?.delete(noteId);
    } else {
      newSelected?.add(noteId);
    }
    setSelectedNotes(newSelected);
    setShowBulkActions(newSelected?.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedNotes?.size === notes?.length) {
      setSelectedNotes(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedNotes(new Set(notes.map(note => note.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedNotes?.size} selected notes?`)) {
      onBulkAction('delete', Array.from(selectedNotes));
      setSelectedNotes(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkFavorite = () => {
    onBulkAction('favorite', Array.from(selectedNotes));
    setSelectedNotes(new Set());
    setShowBulkActions(false);
  };

  const clearSelection = () => {
    setSelectedNotes(new Set());
    setShowBulkActions(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Loading notes...</span>
        </div>
      </div>
    );
  }

  if (notes?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="FileText" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No notes found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start creating your first note or adjust your search and filter criteria to find existing notes.
        </p>
        <Button
          variant="default"
          onClick={() => window.location.href = '/note-editor'}
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          Create Your First Note
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="sticky top-0 z-10 bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-foreground">
              {selectedNotes?.size} note{selectedNotes?.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkFavorite}
                iconName="Star"
                iconPosition="left"
                iconSize={14}
              >
                Add to Favorites
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                iconName="Trash2"
                iconPosition="left"
                iconSize={14}
              >
                Delete Selected
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            iconName="X"
            iconSize={16}
          >
            Clear Selection
          </Button>
        </div>
      )}
      {/* Selection Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-sm"
          >
            {selectedNotes?.size === notes?.length ? 'Deselect All' : 'Select All'}
          </Button>
          {selectedNotes?.size > 0 && (
            <span className="text-sm text-muted-foreground">
              ({selectedNotes?.size} selected)
            </span>
          )}
        </div>
      </div>
      {/* Notes Grid/List */}
      <div className={`${
        viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' :'space-y-3'
      }`}>
        {notes?.map((note) => (
          <div key={note?.id} className="relative">
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selectedNotes?.has(note?.id)}
                onChange={() => handleSelectNote(note?.id)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                onClick={(e) => e?.stopPropagation()}
              />
            </div>
            
            {/* Note Card */}
            <div className={selectedNotes?.has(note?.id) ? 'ring-2 ring-primary rounded-lg' : ''}>
              <NoteCard
                note={note}
                viewMode={viewMode}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Load More Button (for pagination if needed) */}
      {notes?.length >= 20 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => {/* Handle load more */}}
            iconName="ChevronDown"
            iconPosition="right"
            iconSize={16}
          >
            Load More Notes
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotesGrid;