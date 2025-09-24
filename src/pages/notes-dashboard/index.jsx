import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import DashboardToolbar from './components/DashboardToolbar';
import NotesGrid from './components/NotesGrid';
import QuickStats from './components/QuickStats';

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

  // Mock data for notes
  const mockNotes = [
    {
      id: 1,
      title: "Project Planning Meeting Notes",
      content: `Discussed the upcoming product launch timeline and key milestones.\n\nKey Points:\n- Launch date set for Q2 2024\n- Marketing campaign to start 6 weeks prior\n- Beta testing phase begins next month\n- Need to finalize feature set by end of week\n\nAction Items:\n- Schedule follow-up with design team\n- Review budget allocations\n- Prepare user testing scenarios`,
      createdAt: new Date('2024-01-15T10:30:00'),
      modifiedAt: new Date('2024-01-16T14:20:00'),
      isFavorite: true,
      tags: ['Work', 'Meeting', 'Project']
    },
    {
      id: 2,
      title: "Book Ideas & Inspiration",
      content: `Random thoughts and ideas for potential book projects.\n\n"The Art of Digital Minimalism"\n- Exploring how to maintain focus in a hyperconnected world\n- Personal stories of digital detox experiences\n- Practical frameworks for intentional technology use\n\n"Cooking Adventures"\n- Collection of family recipes with stories\n- Seasonal cooking guides\n- Tips for sustainable cooking practices`,
      createdAt: new Date('2024-01-14T16:45:00'),
      modifiedAt: new Date('2024-01-14T16:45:00'),
      isFavorite: false,
      tags: ['Personal', 'Ideas', 'Creative']
    },
    {
      id: 3,
      title: "Weekly Reflection - January",
      content: `Reflecting on the first week of January and setting intentions.\n\nAccomplishments:\n- Completed the React dashboard project\n- Started morning meditation routine\n- Read 2 chapters of "Atomic Habits"\n- Organized home office space\n\nChallenges:\n- Struggled with time management\n- Need to improve work-life balance\n- Should drink more water throughout the day\n\nNext Week Goals:\n- Implement new project management system\n- Schedule regular breaks during work\n- Plan weekend hiking trip`,
      createdAt: new Date('2024-01-13T20:15:00'),
      modifiedAt: new Date('2024-01-15T09:30:00'),
      isFavorite: true,
      tags: ['Personal', 'Reflection', 'Goals']
    },
    {
      id: 4,
      title: "Recipe: Grandmother\'s Apple Pie",
      content: `Traditional apple pie recipe passed down from grandmother.\n\nIngredients:\n- 6-8 Granny Smith apples, peeled and sliced\n- 1 cup granulated sugar\n- 2 tablespoons all-purpose flour\n- 1 teaspoon ground cinnamon\n- 1/4 teaspoon ground nutmeg\n- 2 tablespoons butter, cut into small pieces\n- 2 pie crusts (homemade or store-bought)\n\nInstructions:\n1. Preheat oven to 425°F\n2. Mix apples with sugar, flour, and spices\n3. Place filling in bottom crust\n4. Add butter pieces on top\n5. Cover with top crust and seal edges\n6. Bake for 45-50 minutes until golden brown`,
      createdAt: new Date('2024-01-12T14:20:00'),
      modifiedAt: new Date('2024-01-12T14:20:00'),
      isFavorite: false,
      tags: ['Personal', 'Recipe', 'Family']
    },
    {
      id: 5,
      title: "Client Meeting - Website Redesign",
      content: `Meeting with Johnson & Associates about their website redesign project.\n\nClient Requirements:\n- Modern, professional design\n- Mobile-responsive layout\n- Integration with existing CRM system\n- SEO optimization\n- Content management system\n\nTimeline:\n- Design mockups: 2 weeks\n- Development phase: 4 weeks\n- Testing and revisions: 1 week\n- Launch: End of February\n\nBudget: $15,000\nDeposit: $5,000 (received)\n\nNext Steps:\n- Send project proposal\n- Schedule design review meeting\n- Gather brand assets and content`,
      createdAt: new Date('2024-01-11T11:00:00'),
      modifiedAt: new Date('2024-01-13T16:45:00'),
      isFavorite: true,
      tags: ['Work', 'Client', 'Project']
    },
    {
      id: 6,
      title: "Travel Plans - Summer Vacation",
      content: `Planning summer vacation to Europe - tentative itinerary.\n\nDestinations:\n- Paris, France (3 days)\n  * Visit Louvre Museum\n  * Eiffel Tower at sunset\n  * Seine River cruise\n\n- Rome, Italy (4 days)\n  * Colosseum and Roman Forum\n  * Vatican City tour\n  * Authentic Italian cooking class\n\n- Barcelona, Spain (3 days)\n  * Sagrada Familia\n  * Park Güell\n  * Beach time at Barceloneta\n\nBudget Estimate: $4,500 for two people\nBest time to book: March for better rates\n\nTo Research:\n- Travel insurance options\n- Best neighborhoods to stay in each city\n- Local transportation passes`,
      createdAt: new Date('2024-01-10T19:30:00'),
      modifiedAt: new Date('2024-01-14T12:15:00'),
      isFavorite: false,
      tags: ['Personal', 'Travel', 'Planning']
    },
    {
      id: 7,
      title: "Learning Goals 2024",
      content: `Professional and personal learning objectives for this year.\n\nTechnical Skills:\n- Master React 18 and Next.js 14\n- Learn TypeScript fundamentals\n- Explore AI/ML basics with Python\n- Get AWS certification\n\nPersonal Development:\n- Improve public speaking skills\n- Learn basic Spanish conversation\n- Practice photography techniques\n- Read 24 books this year (2 per month)\n\nHealth & Wellness:\n- Establish consistent exercise routine\n- Learn meditation and mindfulness\n- Improve sleep hygiene\n- Cook more meals at home\n\nProgress Tracking:\n- Monthly review sessions\n- Quarterly goal adjustments\n- Annual reflection and planning`,
      createdAt: new Date('2024-01-09T08:45:00'),
      modifiedAt: new Date('2024-01-09T08:45:00'),
      isFavorite: true,
      tags: ['Personal', 'Goals', 'Learning']
    },
    {
      id: 8,
      title: "Home Improvement Ideas",
      content: `Ideas and plans for improving our home this year.\n\nLiving Room:\n- Replace old sofa with sectional\n- Add floating shelves for books\n- Install smart lighting system\n- Create gallery wall with family photos\n\nKitchen:\n- Update cabinet hardware\n- Install subway tile backsplash\n- Add under-cabinet lighting\n- Organize pantry with clear containers\n\nBedroom:\n- Paint accent wall in calming blue\n- Upgrade to blackout curtains\n- Add reading nook by window\n- Install ceiling fan\n\nBudget: $8,000 total\nPriority: Kitchen updates first\nTimeline: Complete by summer`,
      createdAt: new Date('2024-01-08T15:20:00'),
      modifiedAt: new Date('2024-01-11T10:30:00'),
      isFavorite: false,
      tags: ['Personal', 'Home', 'Planning']
    }
  ];

  // Initialize notes on component mount
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setNotes(mockNotes);
      setLoading(false);
    }, 1000);
  }, []);

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
    navigate(`/note-editor?id=${noteId}`);
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