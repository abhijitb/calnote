/**
 * localStorage utility functions for notes management
 */

const NOTES_STORAGE_KEY = 'calnote_notes';
const DEFAULT_NOTES = [
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

/**
 * Get all notes from localStorage or return default notes if localStorage is empty
 * @returns {Array} Array of note objects
 */
export const getNotes = () => {
  try {
    const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (storedNotes) {
      const parsedNotes = JSON.parse(storedNotes);
      // Convert date strings back to Date objects
      return parsedNotes.map(note => ({
        ...note,
        createdAt: new Date(note.createdAt),
        modifiedAt: new Date(note.modifiedAt)
      }));
    }
    return DEFAULT_NOTES;
  } catch (error) {
    console.error('Error reading notes from localStorage:', error);
    return DEFAULT_NOTES;
  }
};

/**
 * Save all notes to localStorage
 * @param {Array} notes - Array of note objects to save
 */
export const saveNotes = (notes) => {
  try {
    // Convert Date objects to strings for JSON serialization
    const notesToSave = notes.map(note => ({
      ...note,
      createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : note.createdAt,
      modifiedAt: note.modifiedAt instanceof Date ? note.modifiedAt.toISOString() : note.modifiedAt
    }));
    
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesToSave));
  } catch (error) {
    console.error('Error saving notes to localStorage:', error);
  }
};

/**
 * Add a new note to localStorage
 * @param {Object} note - Note object to add
 */
export const addNote = (note) => {
  const notes = getNotes();
  const newNote = {
    ...note,
    createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : note.createdAt,
    modifiedAt: note.modifiedAt instanceof Date ? note.modifiedAt.toISOString() : note.modifiedAt
  };
  notes.push(newNote);
  saveNotes(notes);
};

/**
 * Update an existing note in localStorage
 * @param {Object} updatedNote - Updated note object
 */
export const updateNote = (updatedNote) => {
  const notes = getNotes();
  const index = notes.findIndex(note => note.id === updatedNote.id);
  if (index !== -1) {
    const noteToUpdate = {
      ...updatedNote,
      createdAt: updatedNote.createdAt instanceof Date ? updatedNote.createdAt.toISOString() : updatedNote.createdAt,
      modifiedAt: updatedNote.modifiedAt instanceof Date ? updatedNote.modifiedAt.toISOString() : updatedNote.modifiedAt
    };
    notes[index] = noteToUpdate;
    saveNotes(notes);
  }
};

/**
 * Delete a note from localStorage
 * @param {number|string} noteId - ID of the note to delete
 */
export const deleteNote = (noteId) => {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== noteId);
  saveNotes(filteredNotes);
};

/**
 * Get a specific note by ID
 * @param {number|string} noteId - ID of the note to retrieve
 * @returns {Object|null} Note object or null if not found
 */
export const getNoteById = (noteId) => {
  const notes = getNotes();
  const note = notes.find(note => note.id === noteId);
  if (note) {
    return {
      ...note,
      createdAt: new Date(note.createdAt),
      modifiedAt: new Date(note.modifiedAt)
    };
  }
  return null;
};

/**
 * Clear all notes from localStorage (resets to default)
 */
export const clearNotes = () => {
  try {
    localStorage.removeItem(NOTES_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing notes from localStorage:', error);
  }
};