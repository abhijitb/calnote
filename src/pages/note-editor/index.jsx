import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import RichTextEditor from './components/RichTextEditor';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import NoteSidebar from './components/NoteSidebar';
import { getNotes, addNote, updateNote, getNoteById } from '../../utils/localStorage';

const NoteEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get note data from navigation state or query parameter
  const existingNote = location?.state?.note || null;
  const urlParams = new URLSearchParams(location.search);
  const noteIdFromUrl = urlParams.get('id');
  
  // Determine if we're in edit mode
  const isEditMode = Boolean(existingNote || noteIdFromUrl);

  // Note state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [initialNoteLoaded, setInitialNoteLoaded] = useState(false);

  // Note metadata
  const [noteData, setNoteData] = useState({
    id: null, // Initialize with null, will be set when loading note data
    title: '',
    content: '',
    tags: [],
    category: '',
    isFavorite: false,
    createdAt: new Date(),
    modifiedAt: new Date()
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

  // Load note data on component mount
  useEffect(() => {
    const loadNoteData = () => {
      let noteToLoad = null;
      
      // First check if note data is passed via state
      if (existingNote) {
        noteToLoad = existingNote;
      } 
      // Then check if we have an ID in the URL
      else if (noteIdFromUrl) {
        noteToLoad = getNoteById(noteIdFromUrl);
      }
      
      if (noteToLoad) {
        setTitle(noteToLoad.title || '');
        setContent(noteToLoad.content || '');
        setLastSaved(noteToLoad.modifiedAt || new Date());
        
        setNoteData({
          id: noteToLoad.id,
          title: noteToLoad.title || '',
          content: noteToLoad.content || '',
          tags: noteToLoad.tags || [],
          category: noteToLoad.category || '',
          isFavorite: noteToLoad.isFavorite || false,
          createdAt: noteToLoad.createdAt || new Date(),
          modifiedAt: noteToLoad.modifiedAt || new Date()
        });
      } else {
        // For new notes, generate a new ID
        setNoteData(prev => ({
          ...prev,
          id: `note-${Date.now()}`
        }));
      }
      
      setInitialNoteLoaded(true);
    };
    
    loadNoteData();
  }, [existingNote, noteIdFromUrl]);

  // Handle note update from sidebar
  const handleNoteUpdate = (updatedFields) => {
    setNoteData(prev => ({
      ...prev,
      ...updatedFields,
      modifiedAt: new Date()
    }));
    setHasUnsavedChanges(true);
    
    // If title or content was updated, also update the main state
    if (updatedFields.title !== undefined) {
      setTitle(updatedFields.title);
    }
    if (updatedFields.content !== undefined) {
      setContent(updatedFields.content);
    }
  };

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    setSaveStatus('saving');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Create updated note object
      const updatedNote = {
        ...noteData,
        title,
        content,
        modifiedAt: new Date()
      };
      
      // Save to localStorage
      if (isEditMode && noteData.id) {
        updateNote(updatedNote);
      } else {
        addNote(updatedNote);
      }
      
      setNoteData(updatedNote);
      setLastSaved(new Date());
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
    } catch (error) {
      setSaveStatus('error');
      console.error('Save failed:', error);
    }
  }, [title, content, noteData, hasUnsavedChanges, isEditMode]);

  // Manual save and redirect
  const handleSave = async () => {
    await autoSave();
    // Redirect to notes dashboard after successful save
    navigate('/notes-dashboard');
  };

  // Handle cancel/back
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    navigate('/notes-dashboard');
  };

  // Handle title change
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setHasUnsavedChanges(true);
    
    // Update noteData with new title
    setNoteData(prev => ({
      ...prev,
      title: newTitle
    }));
  };

  // Handle content change
  const handleContentChange = (newContent) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
    
    // Update noteData with new content
    setNoteData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  // Handle word count change
  const handleWordCountChange = (count) => {
    setWordCount(count);
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

  // Don't render until note data is loaded
  if (!initialNoteLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Loading note...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
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
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Editor Area */}
        <div className="flex-1 transition-all duration-300">
          <div className="h-full p-4 lg:p-6">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              {/* Title Input */}
              <div className="mb-3">
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
              <div className="flex-1 min-h-0">
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

        {/* Sidebar - on the right side */}
        <div className="w-full lg:w-96 lg:h-full bg-background border-t lg:border-t-0 lg:border-l border-border">
          <NoteSidebar
            isOpen={true}
            onClose={() => {}} // No-op since sidebar is always open
            noteData={noteData}
            onUpdateNote={handleNoteUpdate}
            availableTags={availableTags}
            availableCategories={availableCategories}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;