import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptySearchState = ({ searchQuery, hasNotes }) => {
  const navigate = useNavigate();

  if (!hasNotes) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="FileText" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            No notes yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Create your first note to start building your personal knowledge base.
          </p>
          <Button
            variant="default"
            onClick={() => navigate('/note-editor')}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            className="floating-action"
          >
            Create Your First Note
          </Button>
        </div>
      </div>
    );
  }

  if (searchQuery) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="SearchX" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            No results found
          </h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any notes matching "<span className="font-medium text-foreground">{searchQuery}</span>". 
            Try adjusting your search terms or browse all notes.
          </p>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/notes-dashboard')}
                iconName="Grid3x3"
                iconPosition="left"
                iconSize={16}
              >
                Browse All Notes
              </Button>
              <Button
                variant="default"
                onClick={() => navigate('/note-editor')}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                className="floating-action"
              >
                Create New Note
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">
          Search your notes
        </h3>
        <p className="text-muted-foreground mb-6">
          Enter keywords, phrases, or tags to find specific notes in your collection.
        </p>
        <div className="bg-muted rounded-lg p-4 text-left">
          <h4 className="text-sm font-medium text-foreground mb-2">Search tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use quotes for exact phrases: "meeting notes"</li>
            <li>• Search by tags: #important #work</li>
            <li>• Use date filters to narrow results</li>
            <li>• Try different keywords if no results</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmptySearchState;