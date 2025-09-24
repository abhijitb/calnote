import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SearchHeader from './components/SearchHeader';
import SearchResultItem from './components/SearchResultItem';
import SearchSuggestions from './components/SearchSuggestions';
import EmptySearchState from './components/EmptySearchState';
import ExportResults from './components/ExportResults';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    sortBy: 'relevance',
    tags: []
  });
  const [showExportPanel, setShowExportPanel] = useState(false);

  // Mock notes data with search relevance
  const mockNotes = [
    {
      id: 1,
      title: "Project Planning Meeting Notes",
      content: `Discussed the upcoming product launch timeline and key milestones.\n\nKey points covered:\n- Marketing strategy needs to be finalized by next week\n- Development team requires additional resources\n- Budget allocation for Q4 campaigns\n- User testing feedback integration\n\nAction items:\n1. Schedule follow-up with marketing team\n2. Review resource requirements\n3. Prepare budget presentation`,
      createdAt: "2024-09-23T10:30:00Z",
      modifiedAt: "2024-09-23T15:45:00Z",
      tags: ["work", "planning", "meetings", "project"],
      isFavorite: true,
      relevanceScore: 5,
      matchCount: 8
    },
    {
      id: 2,
      title: "Daily Reflection - September 22",
      content: `Today was productive despite the challenges. Managed to complete the quarterly report and had a great brainstorming session with the team.\n\nGrateful for:\n- Supportive colleagues\n- Clear weather for the morning walk\n- Progress on personal projects\n\nTomorrow's priorities:\n- Client presentation preparation\n- Code review for the new feature\n- Gym session in the evening`,
      createdAt: "2024-09-22T20:15:00Z",
      modifiedAt: "2024-09-22T20:15:00Z",
      tags: ["personal", "reflection", "gratitude"],
      isFavorite: false,
      relevanceScore: 3,
      matchCount: 4
    },
    {
      id: 3,
      title: "Recipe Ideas for Weekend",
      content: `Planning to try some new recipes this weekend. Found some interesting options:\n\n1. Mediterranean quinoa salad with roasted vegetables\n2. Homemade pizza with fresh basil and mozzarella\n3. Chocolate chip cookies (the classic recipe from grandma)\n4. Thai green curry with coconut milk\n\nShopping list:\n- Quinoa, bell peppers, zucchini\n- Pizza dough ingredients\n- Dark chocolate chips\n- Thai curry paste, coconut milk`,
      createdAt: "2024-09-21T16:20:00Z",
      modifiedAt: "2024-09-23T09:10:00Z",
      tags: ["cooking", "recipes", "weekend", "food"],
      isFavorite: true,
      relevanceScore: 2,
      matchCount: 2
    },
    {
      id: 4,
      title: "Book Notes: The Lean Startup",
      content: `Key concepts from Eric Ries' "The Lean Startup":\n\n• Build-Measure-Learn feedback loop\n• Minimum Viable Product (MVP) approach\n• Validated learning through experiments\n• Innovation accounting metrics\n• Pivot vs. persevere decisions\n\nPractical applications:\n- Start with core assumptions\n- Test hypotheses quickly\n- Focus on actionable metrics\n- Embrace failure as learning\n\nQuotes to remember:\n"The only way to win is to learn faster than anyone else."`,
      createdAt: "2024-09-20T14:45:00Z",
      modifiedAt: "2024-09-20T14:45:00Z",
      tags: ["books", "startup", "business", "learning"],
      isFavorite: false,
      relevanceScore: 4,
      matchCount: 6
    },
    {
      id: 5,
      title: "Travel Itinerary - Tokyo Trip",
      content: `Planning the upcoming Tokyo trip for next month:\n\nDay 1: Arrival & Shibuya\n- Land at Narita Airport\n- Check into hotel in Shibuya\n- Explore Shibuya Crossing\n- Dinner at local ramen shop\n\nDay 2: Traditional Tokyo\n- Visit Senso-ji Temple in Asakusa\n- Explore Ueno Park and museums\n- Traditional tea ceremony experience\n\nDay 3: Modern Tokyo\n- Tokyo Skytree observation\n- Shopping in Harajuku\n- Robot Restaurant show\n\nMust-try foods:\n- Authentic sushi at Tsukiji\n- Ramen in Shibuya\n- Tempura in Ginza`,
      createdAt: "2024-09-19T11:30:00Z",
      modifiedAt: "2024-09-22T08:20:00Z",
      tags: ["travel", "tokyo", "japan", "itinerary"],
      isFavorite: true,
      relevanceScore: 1,
      matchCount: 1
    },
    {
      id: 6,
      title: "Workout Routine - Upper Body",
      content: `Upper body workout routine for strength building:\n\nWarm-up (10 minutes):\n- Arm circles\n- Shoulder rolls\n- Light cardio\n\nMain workout:\n1. Push-ups: 3 sets of 12-15 reps\n2. Pull-ups: 3 sets of 8-10 reps\n3. Dumbbell bench press: 3 sets of 10 reps\n4. Bent-over rows: 3 sets of 12 reps\n5. Shoulder press: 3 sets of 10 reps\n6. Tricep dips: 3 sets of 12 reps\n\nCool-down:\n- Stretching routine\n- Focus on chest, shoulders, arms\n\nNotes: Increase weight gradually, maintain proper form`,
      createdAt: "2024-09-18T07:15:00Z",
      modifiedAt: "2024-09-18T07:15:00Z",
      tags: ["fitness", "workout", "health", "strength"],
      isFavorite: false,
      relevanceScore: 2,
      matchCount: 3
    }
  ];

  // Mock search suggestions
  const mockSuggestions = [
    { query: "meeting notes", type: "recent", count: 12 },
    { query: "project planning", type: "recent", count: 8 },
    { query: "daily reflection", type: "recent", count: 15 },
    { query: "recipe ideas", type: "popular", count: 6 },
    { query: "book notes", type: "popular", count: 9 },
    { query: "workout routine", type: "related", count: 4 },
    { query: "travel planning", type: "related", count: 7 },
    { query: "#work", type: "tags", count: 23 },
    { query: "#personal", type: "tags", count: 18 },
    { query: "#learning", type: "tags", count: 11 }
  ];

  // Filter and search logic
  const filteredResults = useMemo(() => {
    let results = [...mockNotes];

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      results = results?.filter(note => 
        note?.title?.toLowerCase()?.includes(query) ||
        note?.content?.toLowerCase()?.includes(query) ||
        note?.tags?.some(tag => tag?.toLowerCase()?.includes(query))
      );

      // Update relevance scores based on search
      results = results?.map(note => {
        const titleMatches = (note?.title?.toLowerCase()?.match(new RegExp(query, 'g')) || [])?.length;
        const contentMatches = (note?.content?.toLowerCase()?.match(new RegExp(query, 'g')) || [])?.length;
        const tagMatches = note?.tags?.filter(tag => tag?.toLowerCase()?.includes(query))?.length;
        
        return {
          ...note,
          relevanceScore: Math.min(5, titleMatches * 3 + contentMatches + tagMatches * 2),
          matchCount: titleMatches + contentMatches + tagMatches
        };
      });
    }

    // Apply date range filter
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters?.dateRange) {
        case 'today':
          filterDate?.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate?.setDate(now?.getDate() - 7);
          break;
        case 'month':
          filterDate?.setMonth(now?.getMonth() - 1);
          break;
        case 'year':
          filterDate?.setFullYear(now?.getFullYear() - 1);
          break;
      }
      
      results = results?.filter(note => new Date(note.createdAt) >= filterDate);
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'relevance':
        results?.sort((a, b) => (b?.relevanceScore || 0) - (a?.relevanceScore || 0));
        break;
      case 'date-desc':
        results?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'date-asc':
        results?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'alphabetical':
        results?.sort((a, b) => a?.title?.localeCompare(b?.title));
        break;
    }

    return results;
  }, [searchQuery, filters]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    if (suggestion) {
      navigate(`/search-results?q=${encodeURIComponent(suggestion)}`);
    } else {
      navigate('/search-results');
    }
  };

  const handleToggleFavorite = (noteId) => {
    // In a real app, this would update the backend
    console.log('Toggle favorite for note:', noteId);
  };

  const handleExport = async (results, format, query) => {
    // Mock export functionality
    const exportData = {
      searchQuery: query,
      exportDate: new Date()?.toISOString(),
      totalResults: results?.length,
      results: results?.map(note => ({
        id: note?.id,
        title: note?.title,
        content: note?.content,
        createdAt: note?.createdAt,
        modifiedAt: note?.modifiedAt,
        tags: note?.tags,
        isFavorite: note?.isFavorite
      }))
    };

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-results-${Date.now()}.${format}`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Update search query from URL params
  useEffect(() => {
    const queryParam = searchParams?.get('q');
    if (queryParam && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <SearchHeader
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          resultCount={filteredResults?.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Suggestions */}
            {(!searchQuery || filteredResults?.length === 0) && (
              <SearchSuggestions
                suggestions={mockSuggestions}
                onSuggestionClick={handleSuggestionClick}
                searchQuery={searchQuery}
              />
            )}

            {/* Results or Empty State */}
            {filteredResults?.length > 0 ? (
              <div className="space-y-4">
                {/* Results Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/notes-dashboard')}
                      iconName="ArrowLeft"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExportPanel(!showExportPanel)}
                    iconName="Download"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Export Results
                  </Button>
                </div>

                {/* Export Panel */}
                {showExportPanel && (
                  <ExportResults
                    results={filteredResults}
                    searchQuery={searchQuery}
                    onExport={handleExport}
                  />
                )}

                {/* Search Results */}
                <div className="space-y-4">
                  {filteredResults?.map((note) => (
                    <SearchResultItem
                      key={note?.id}
                      note={note}
                      searchQuery={searchQuery}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>

                {/* Load More (if needed) */}
                {filteredResults?.length >= 10 && (
                  <div className="text-center py-8">
                    <Button
                      variant="outline"
                      onClick={() => {/* Load more logic */}}
                      iconName="ChevronDown"
                      iconPosition="right"
                      iconSize={16}
                    >
                      Load More Results
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <EmptySearchState 
                searchQuery={searchQuery} 
                hasNotes={mockNotes?.length > 0} 
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/note-editor')}
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                    fullWidth
                  >
                    New Note
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/calendar-view')}
                    iconName="Calendar"
                    iconPosition="left"
                    iconSize={16}
                    fullWidth
                  >
                    Calendar View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/notes-dashboard')}
                    iconName="Grid3x3"
                    iconPosition="left"
                    iconSize={16}
                    fullWidth
                  >
                    All Notes
                  </Button>
                </div>
              </div>

              {/* Search Tips */}
              {searchQuery && filteredResults?.length === 0 && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Icon name="HelpCircle" size={16} className="mr-2 text-accent" />
                    <h3 className="text-sm font-medium text-foreground">
                      Search Tips
                    </h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Try different keywords</li>
                    <li>• Check for typos</li>
                    <li>• Use broader terms</li>
                    <li>• Search by tags: #work</li>
                    <li>• Use quotes for exact phrases</li>
                  </ul>
                </div>
              )}

              {/* Recent Searches */}
              {mockSuggestions?.filter(s => s?.type === 'recent')?.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">
                    Recent Searches
                  </h3>
                  <div className="space-y-2">
                    {mockSuggestions?.filter(s => s?.type === 'recent')?.slice(0, 5)?.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion?.query)}
                          className="flex items-center justify-between w-full text-left p-2 rounded-md hover:bg-muted transition-colors"
                        >
                          <span className="text-sm text-foreground">
                            {suggestion?.query}
                          </span>
                          <Icon name="Clock" size={12} className="text-muted-foreground" />
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchResults;