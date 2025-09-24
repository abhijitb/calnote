import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import RichTextEditor from './components/RichTextEditor';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import NoteSidebar from './components/NoteSidebar';

const NoteEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get note data from navigation state or create new note
  const existingNote = location?.state?.note;
  const isEditMode = Boolean(existingNote);

  // Note state
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(existingNote?.modifiedAt || null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Note metadata
  const [noteData, setNoteData] = useState({
    id: existingNote?.id || `note-${Date.now()}`,
    title: existingNote?.title || '',
    content: existingNote?.content || '',
    tags: existingNote?.tags || [],
    category: existingNote?.category || '',
    isFavorite: existingNote?.isFavorite || false,
    createdAt: existingNote?.createdAt || new Date()?.toISOString(),
    modifiedAt: existingNote?.modifiedAt || new Date()?.toISOString()
  });

  // Mock data for suggestions
  const availableTags = [
    "work", "personal", "ideas", "meeting", "project", "todo", "important", 
    "research", "notes", "draft", "review", "planning", "brainstorm"
  ];

  const availableCategories = [
    "Work", "Personal", "Projects", "Meetings", "Ideas", "Research", 
    "Planning", "Reviews", "Drafts", "Archive"
  ];

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    setSaveStatus('saving');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Mock save operation
      const updatedNote = {
        ...noteData,
        title,
        content,
        modifiedAt: new Date()?.toISOString()
      };
      
      // In real app, this would be an API call
      console.log('Saving note:', updatedNote);
      
      setNoteData(updatedNote);
      setLastSaved(new Date()?.toISOString());
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
    } catch (error) {
      setSaveStatus('error');
      console.error('Save failed:', error);
    }
  }, [title, content, noteData, hasUnsavedChanges]);

  // Auto-save timer
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(autoSave, 2000); // Auto-save after 2 seconds of inactivity
      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, autoSave]);

  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e?.target?.value);
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
  };

  // Handle content change
  const handleContentChange = (newContent) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
  };

  // Handle word count update
  const handleWordCountChange = (count) => {
    setWordCount(count);
  };

  // Handle note metadata update
  const handleNoteUpdate = (updates) => {
    setNoteData(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
  };

  // Manual save
  const handleSave = async () => {
    await autoSave();
  };

  // Handle cancel/back
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    navigate('/notes-dashboard');
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key?.toLowerCase()) {
          case 's':
            e?.preventDefault();
            handleSave();
            break;
          case 'escape':
            handleCancel();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent accidental navigation away
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e?.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="hover-lift"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="flex items-center gap-2">
              <Icon name="FileText" size={20} className="text-primary" />
              <h1 className="text-lg font-semibold text-foreground">
                {isEditMode ? 'Edit Note' : 'New Note'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              iconName="Settings"
              iconPosition="left"
              iconSize={16}
              className="hidden lg:flex"
            >
              Details
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Icon name="Settings" size={20} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={saveStatus === 'saving'}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              loading={saveStatus === 'saving'}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
              className="floating-action"
            >
              Save
            </Button>
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className="px-4 pb-3">
          <AutoSaveIndicator
            saveStatus={saveStatus}
            lastSaved={lastSaved}
            wordCount={wordCount}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Editor Area */}
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'lg:mr-72' : ''
        }`}>
          <div className="h-full p-4 lg:p-6">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              {/* Title Input */}
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder="Note title..."
                  value={title}
                  onChange={handleTitleChange}
                  className="text-2xl font-semibold border-none bg-transparent px-0 focus:ring-0 placeholder:text-muted-foreground"
                  style={{ fontSize: '24px', lineHeight: '1.2' }}
                />
              </div>

              {/* Rich Text Editor */}
              <div className="flex-1">
                <RichTextEditor
                  content={content}
                  onChange={handleContentChange}
                  onWordCountChange={handleWordCountChange}
                  placeholder="Start writing your note..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <NoteSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          noteData={noteData}
          onUpdateNote={handleNoteUpdate}
          availableTags={availableTags}
          availableCategories={availableCategories}
        />
      </div>

      {/* Mobile Bottom Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/calendar-view')}
            iconName="Calendar"
            iconPosition="left"
            iconSize={16}
          >
            Calendar
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              loading={saveStatus === 'saving'}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default NoteEditor;