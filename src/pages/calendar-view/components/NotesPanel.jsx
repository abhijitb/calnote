import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotesPanel = ({ selectedDate, notes, onClose }) => {
  const navigate = useNavigate();

  if (!selectedDate) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Select a Date</p>
          <p className="text-sm">Click on any date in the calendar to view notes created on that day</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleEditNote = (noteId) => {
    // Find the note in the notes array
    const noteToEdit = notes.find(note => note.id === noteId);
    if (noteToEdit) {
      navigate('/note-editor', { state: { note: noteToEdit } });
    }
  };

  const handleCreateNote = () => {
    const dateStr = selectedDate?.toISOString()?.split('T')?.[0];
    // For creating a new note, we can pass the date as state
    navigate('/note-editor', { state: { date: dateStr } });
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {formatDate(selectedDate)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {notes?.length} {notes?.length === 1 ? 'note' : 'notes'} found
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {notes?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-medium text-foreground mb-2">No Notes Found</p>
            <p className="text-sm text-muted-foreground mb-4">
              You haven't created any notes on this date yet.
            </p>
            <Button
              variant="default"
              onClick={handleCreateNote}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              className="floating-action"
            >
              Create Note
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {notes?.map((note) => (
              <div
                key={note?.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer hover-lift"
                onClick={() => handleEditNote(note?.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground truncate flex-1 mr-2">
                    {note?.title}
                  </h4>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Icon name="Clock" size={12} />
                    <span>{note?.createdTime}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {note?.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {note?.tags && note?.tags?.length > 0 && (
                      <div className="flex items-center space-x-1">
                        {note?.tags?.slice(0, 2)?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {note?.tags?.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{note?.tags?.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {note?.isFavorite && (
                      <Icon name="Star" size={14} className="text-accent fill-current" />
                    )}
                    <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Actions */}
      {notes?.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleCreateNote}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            fullWidth
            className="hover-lift"
          >
            Add New Note
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotesPanel;