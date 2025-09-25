import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import DashboardToolbar from './components/DashboardToolbar';
import NotesGrid from './components/NotesGrid';
import QuickStats from './components/QuickStats';
import { getNotes, saveNotes } from '../../utils/localStorage';

const NotesDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [sortBy, setSortBy] = useState('modifiedAt');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    tags: [],
    dateRange: { start: '', end: '' },
    favorites: false
  });

  // Initialize notes on component mount
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const storedNotes = getNotes();
      setNotes(storedNotes);
      setLoading(false);
    }, 500); // Reduced delay for better UX
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      saveNotes(notes);
    }
  }, [notes, loading]);

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(note =>
        note?.title?.toLowerCase()?.includes(query) ||
        note?.content?.toLowerCase()?.includes(query) ||
        note?.tags?.some(tag => tag?.toLowerCase()?.includes(query))
      );
    }

    // Apply tag filter
    if (filters?.tags?.length > 0) {
      filtered = filtered?.filter(note =>
        filters?.tags?.some(tag => note?.tags?.includes(tag))
      );
    }

    // Apply date range filter
    if (filters?.dateRange?.start || filters?.dateRange?.end) {
      filtered = filtered?.filter(note => {
        const noteDate = new Date(note.createdAt);
        const startDate = filters?.dateRange?.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters?.dateRange?.end ? new Date(filters.dateRange.end) : null;

        if (startDate && noteDate < startDate) return false;
        if (endDate && noteDate > endDate) return false;
        return true;
      });
    }

    // Apply favorites filter
    if (filters?.favorites) {
      filtered = filtered?.filter(note => note?.isFavorite);
    }

    // Sort notes
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a?.title?.localeCompare(b?.title);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'modifiedAt':
          return new Date(b.modifiedAt) - new Date(a.modifiedAt);
        case 'favorites':
          if (a?.isFavorite && !b?.isFavorite) return -1;
          if (!a?.isFavorite && b?.isFavorite) return 1;
          return new Date(b.modifiedAt) - new Date(a.modifiedAt);
        default:
          return new Date(b.modifiedAt) - new Date(a.modifiedAt);
      }
    });

    return filtered;
  }, [notes, searchQuery, filters, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const allTags = new Set();
    
    notes?.forEach(note => {
      note?.tags?.forEach(tag => allTags?.add(tag));
    });

    return {
      totalNotes: notes?.length,
      favoriteNotes: notes?.filter(note => note?.isFavorite)?.length,
      notesThisWeek: notes?.filter(note => new Date(note.createdAt) >= weekAgo)?.length,
      uniqueTags: allTags?.size
    };
  }, [notes]);

  // Event handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleToggleFavorite = (noteId) => {
    setNotes(prev => prev?.map(note =>
      note?.id === noteId ? { ...note, isFavorite: !note?.isFavorite } : note
    ));
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev?.filter(note => note?.id !== noteId));
    }
  };

  const handleEditNote = (noteId) => {
    const noteToEdit = notes.find(note => note.id === noteId);
    if (noteToEdit) {
      navigate('/note-editor', { state: { note: noteToEdit } });
    }
  };

  const handleBulkAction = (action, noteIds) => {
    if (action === 'delete') {
      setNotes(prev => prev?.filter(note => !noteIds?.includes(note?.id)));
    } else if (action === 'favorite') {
      setNotes(prev => prev?.map(note =>
        noteIds?.includes(note?.id) ? { ...note, isFavorite: true } : note
      ));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Notes Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and organize your personal notes with powerful search and filtering capabilities.
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats stats={stats} />

        {/* Dashboard Toolbar */}
        <DashboardToolbar
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          onViewModeChange={handleViewModeChange}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          sortBy={sortBy}
          searchQuery={searchQuery}
          totalNotes={notes?.length}
          filteredNotes={filteredAndSortedNotes?.length}
        />

        {/* Notes Grid */}
        <div className="mt-6">
          <NotesGrid
            notes={filteredAndSortedNotes}
            viewMode={viewMode}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeleteNote}
            onEdit={handleEditNote}
            onBulkAction={handleBulkAction}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
};

export default NotesDashboard;