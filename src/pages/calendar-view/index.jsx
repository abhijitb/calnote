import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CalendarGrid from './components/CalendarGrid';
import CalendarNavigation from './components/CalendarNavigation';
import NotesPanel from './components/NotesPanel.jsx';
import ProductivityMetrics from './components/ProductivityMetrics';
import FilterControls from './components/FilterControls';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CalendarView = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNotesPanel, setShowNotesPanel] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('month');
  const [filters, setFilters] = useState({
    showFavorites: false,
    tags: [],
    dateRange: 'all'
  });

  // Mock notes data
  const notesData = [
    {
      id: 1,
      title: "Project Planning Meeting Notes",
      content: `Discussed the upcoming product launch timeline and key milestones.\n\nKey Points:\n- Launch date set for Q2 2024\n- Marketing campaign to begin in March\n- Beta testing phase starts next month\n- Need to finalize feature specifications by end of week`,
      createdDate: "2024-01-15",
      createdTime: "09:30 AM",
      modifiedDate: "2024-01-15",
      tags: ["work", "planning", "meetings"],
      isFavorite: true
    },
    {
      id: 2,
      title: "Daily Reflection",
      content: `Today was productive. Completed the quarterly report and had a great team meeting.\n\nAccomplishments:\n- Finished Q4 analysis\n- Presented findings to stakeholders\n- Received positive feedback on recommendations\n\nTomorrow's priorities:\n- Follow up on action items\n- Schedule client calls`,
      createdDate: "2024-01-15",
      createdTime: "06:45 PM",
      modifiedDate: "2024-01-15",
      tags: ["personal", "reflection"],
      isFavorite: false
    },
    {
      id: 3,
      title: "Book Ideas - Chapter 3",
      content: `Brainstorming session for the third chapter of my novel.\n\nPlot developments:\n- Character arc progression\n- Introduction of conflict\n- Setting descriptions for the mountain scene\n- Dialogue improvements needed\n\nResearch needed:\n- Mountain climbing terminology\n- Weather patterns in the region`,
      createdDate: "2024-01-16",
      createdTime: "11:15 AM",
      modifiedDate: "2024-01-16",
      tags: ["creative", "writing", "book"],
      isFavorite: true
    },
    {
      id: 4,
      title: "Grocery List & Meal Planning",
      content: `Weekly meal prep and shopping list.\n\nMeals for this week:\n- Monday: Chicken stir-fry\n- Tuesday: Pasta with marinara\n- Wednesday: Grilled salmon\n- Thursday: Vegetarian curry\n- Friday: Pizza night\n\nGrocery items:\n- Chicken breast\n- Bell peppers\n- Pasta\n- Salmon fillets\n- Coconut milk`,
      createdDate: "2024-01-17",
      createdTime: "08:20 AM",
      modifiedDate: "2024-01-17",
      tags: ["personal", "food", "planning"],
      isFavorite: false
    },
    {
      id: 5,
      title: "Learning Goals 2024",
      content: `Setting learning objectives for the year.\n\nTechnical Skills:\n- Master React 18 features\n- Learn TypeScript fundamentals\n- Explore cloud architecture\n- Get AWS certification\n\nSoft Skills:\n- Improve public speaking\n- Leadership training\n- Time management techniques\n\nPersonal:\n- Learn Spanish basics\n- Photography course\n- Cooking classes`,
      createdDate: "2024-01-18",
      createdTime: "07:00 PM",
      modifiedDate: "2024-01-18",
      tags: ["goals", "learning", "development"],
      isFavorite: true
    },
    {
      id: 6,
      title: "Client Feedback Summary",
      content: `Compilation of feedback from recent client presentations.\n\nPositive feedback:\n- Clear communication\n- Thorough analysis\n- Actionable recommendations\n- Professional delivery\n\nAreas for improvement:\n- More visual aids needed\n- Shorter executive summary\n- Include more case studies\n- Better time management during Q&A`,
      createdDate: "2024-01-19",
      createdTime: "02:30 PM",
      modifiedDate: "2024-01-19",
      tags: ["work", "feedback", "improvement"],
      isFavorite: false
    },
    {
      id: 7,
      title: "Weekend Adventure Ideas",
      content: `Planning outdoor activities for the upcoming weekend.\n\nOptions to consider:\n- Hiking trail at Blue Ridge Mountains\n- Kayaking at Lake Harmony\n- Cycling through Central Park\n- Rock climbing at local gym\n- Photography walk downtown\n\nWeather forecast looks good for Saturday morning activities.`,
      createdDate: "2024-01-20",
      createdTime: "12:45 PM",
      modifiedDate: "2024-01-20",
      tags: ["personal", "adventure", "weekend"],
      isFavorite: true
    },
    {
      id: 8,
      title: "Investment Research Notes",
      content: `Research on potential investment opportunities.\n\nTech Stocks Analysis:\n- Growth potential in AI sector\n- Market volatility considerations\n- Diversification strategies\n- Risk assessment completed\n\nNext steps:\n- Consult with financial advisor\n- Review portfolio allocation\n- Set investment timeline`,
      createdDate: "2024-01-21",
      createdTime: "04:15 PM",
      modifiedDate: "2024-01-21",
      tags: ["finance", "investment", "research"],
      isFavorite: false
    }
  ];

  // Get available tags from notes
  const availableTags = [...new Set(notesData.flatMap(note => note.tags || []))];

  // Filter notes based on current filters
  const getFilteredNotes = () => {
    let filtered = [...notesData];

    if (filters?.showFavorites) {
      filtered = filtered?.filter(note => note?.isFavorite);
    }

    if (filters?.tags?.length > 0) {
      filtered = filtered?.filter(note => 
        note?.tags && note?.tags?.some(tag => filters?.tags?.includes(tag))
      );
    }

    if (filters?.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (filters?.dateRange) {
        case 'today':
          filterDate?.setHours(0, 0, 0, 0);
          filtered = filtered?.filter(note => {
            const noteDate = new Date(note.createdDate);
            return noteDate >= filterDate;
          });
          break;
        case 'week':
          filterDate?.setDate(now?.getDate() - now?.getDay());
          filterDate?.setHours(0, 0, 0, 0);
          filtered = filtered?.filter(note => {
            const noteDate = new Date(note.createdDate);
            return noteDate >= filterDate;
          });
          break;
        case 'month':
          filterDate?.setDate(1);
          filterDate?.setHours(0, 0, 0, 0);
          filtered = filtered?.filter(note => {
            const noteDate = new Date(note.createdDate);
            return noteDate >= filterDate;
          });
          break;
        case 'quarter':
          const quarter = Math.floor(now?.getMonth() / 3);
          filterDate?.setMonth(quarter * 3, 1);
          filterDate?.setHours(0, 0, 0, 0);
          filtered = filtered?.filter(note => {
            const noteDate = new Date(note.createdDate);
            return noteDate >= filterDate;
          });
          break;
      }
    }

    return filtered;
  };

  const filteredNotes = getFilteredNotes();

  // Get notes for selected date
  const getNotesForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate?.toISOString()?.split('T')?.[0];
    return filteredNotes?.filter(note => note?.createdDate === dateStr);
  };

  const selectedDateNotes = getNotesForSelectedDate();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowNotesPanel(true);
  };

  const handleCloseNotesPanel = () => {
    setShowNotesPanel(false);
    setSelectedDate(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.target?.tagName === 'INPUT' || e?.target?.tagName === 'TEXTAREA') return;

      switch (e?.key) {
        case 'ArrowLeft':
          e?.preventDefault();
          setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (viewMode === 'month') {
              newDate?.setMonth(prev?.getMonth() - 1);
            } else if (viewMode === 'week') {
              newDate?.setDate(prev?.getDate() - 7);
            } else if (viewMode === 'year') {
              newDate?.setFullYear(prev?.getFullYear() - 1);
            }
            return newDate;
          });
          break;
        case 'ArrowRight':
          e?.preventDefault();
          setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (viewMode === 'month') {
              newDate?.setMonth(prev?.getMonth() + 1);
            } else if (viewMode === 'week') {
              newDate?.setDate(prev?.getDate() + 7);
            } else if (viewMode === 'year') {
              newDate?.setFullYear(prev?.getFullYear() + 1);
            }
            return newDate;
          });
          break;
        case 't':
          e?.preventDefault();
          setCurrentDate(new Date());
          break;
        case 'Escape':
          if (showNotesPanel) {
            handleCloseNotesPanel();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode, showNotesPanel]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar View</h1>
            <p className="text-muted-foreground mt-1">
              Visualize your note-taking patterns and access notes by date
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              iconName="Filter"
              iconPosition="left"
              iconSize={16}
              className="lg:hidden"
            >
              Filters
            </Button>
            
            <Button
              variant="default"
              onClick={() => navigate('/note-editor')}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              className="floating-action"
            >
              New Note
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters & Metrics */}
          <div className="lg:col-span-1 space-y-6">
            <FilterControls
              filters={filters}
              onFilterChange={setFilters}
              availableTags={availableTags}
              isExpanded={showFilters}
              onToggleExpanded={() => setShowFilters(!showFilters)}
            />
            
            <div className="hidden lg:block">
              <ProductivityMetrics 
                notesData={filteredNotes} 
                currentDate={currentDate} 
              />
            </div>
          </div>

          {/* Main Calendar Area */}
          <div className={`${showNotesPanel ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
            <CalendarNavigation
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              viewMode={viewMode}
            />
            
            <CalendarGrid
              currentDate={currentDate}
              onDateSelect={handleDateSelect}
              notesData={filteredNotes}
              selectedDate={selectedDate}
            />

            {/* Mobile Metrics */}
            <div className="lg:hidden">
              <ProductivityMetrics 
                notesData={filteredNotes} 
                currentDate={currentDate} 
              />
            </div>
          </div>

          {/* Right Sidebar - Notes Panel */}
          {showNotesPanel && (
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <NotesPanel
                  selectedDate={selectedDate}
                  notes={selectedDateNotes}
                  onClose={handleCloseNotesPanel}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Notes Panel Overlay */}
        {showNotesPanel && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="w-full max-h-[80vh] bg-background rounded-t-xl">
              <NotesPanel
                selectedDate={selectedDate}
                notes={selectedDateNotes}
                onClose={handleCloseNotesPanel}
              />
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="mt-8 p-4 bg-muted/30 border border-border rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Keyboard" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Keyboard Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div><kbd className="px-1 py-0.5 bg-muted rounded">←</kbd> Previous period</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded">→</kbd> Next period</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded">T</kbd> Go to today</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> Close panel</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;