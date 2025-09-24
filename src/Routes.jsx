import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import SearchResults from './pages/search-results';
import CalendarView from './pages/calendar-view';
import Login from './pages/login';
import NotesDashboard from './pages/notes-dashboard';
import NoteEditor from './pages/note-editor';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CalendarView />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/calendar-view" element={<CalendarView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notes-dashboard" element={<NotesDashboard />} />
        <Route path="/note-editor" element={<NoteEditor />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
