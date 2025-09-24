import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const CalendarGrid = ({ currentDate, onDateSelect, notesData, selectedDate }) => {
  const [viewMode, setViewMode] = useState('month'); // month, week, year

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)?.getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)?.getDay();
  };

  const getNotesForDate = (date) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return notesData?.filter(note => note?.createdDate === dateStr);
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Day headers
    const dayHeaders = dayNames?.map(day => (
      <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-b border-border">
        {day}
      </div>
    ));

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days?.push(
        <div key={`empty-${i}`} className="p-2 h-24 border border-border bg-muted/30"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateNotes = getNotesForDate(date);
      const isSelected = selectedDate && 
        selectedDate?.getDate() === day && 
        selectedDate?.getMonth() === currentDate?.getMonth() &&
        selectedDate?.getFullYear() === currentDate?.getFullYear();
      const isToday = new Date()?.toDateString() === date?.toDateString();

      days?.push(
        <div
          key={day}
          onClick={() => onDateSelect(date)}
          className={`p-2 h-24 border border-border cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
            isSelected ? 'bg-primary/10 border-primary' : 'bg-background'
          } ${isToday ? 'ring-2 ring-accent' : ''}`}
        >
          <div className="flex flex-col h-full">
            <div className={`text-sm font-medium mb-1 ${
              isToday ? 'text-accent font-semibold' : 'text-foreground'
            }`}>
              {day}
            </div>
            {dateNotes?.length > 0 && (
              <div className="flex-1 flex flex-col space-y-1">
                {dateNotes?.slice(0, 2)?.map((note, index) => (
                  <div
                    key={index}
                    className="text-xs p-1 bg-primary/20 text-primary rounded truncate"
                    title={note?.title}
                  >
                    {note?.title}
                  </div>
                ))}
                {dateNotes?.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{dateNotes?.length - 2} more
                  </div>
                )}
              </div>
            )}
            {dateNotes?.length > 0 && (
              <div className="flex justify-end mt-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
        {dayHeaders}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek?.setDate(currentDate?.getDate() - currentDate?.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date?.setDate(startOfWeek?.getDate() + i);
      weekDays?.push(date);
    }

    return (
      <div className="grid grid-cols-7 gap-4">
        {weekDays?.map((date, index) => {
          const dateNotes = getNotesForDate(date);
          const isSelected = selectedDate && selectedDate?.toDateString() === date?.toDateString();
          const isToday = new Date()?.toDateString() === date?.toDateString();

          return (
            <div
              key={index}
              onClick={() => onDateSelect(date)}
              className={`p-4 border border-border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                isSelected ? 'bg-primary/10 border-primary' : 'bg-background'
              } ${isToday ? 'ring-2 ring-accent' : ''}`}
            >
              <div className="text-center mb-3">
                <div className="text-sm text-muted-foreground">
                  {date?.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold ${
                  isToday ? 'text-accent' : 'text-foreground'
                }`}>
                  {date?.getDate()}
                </div>
              </div>
              <div className="space-y-1">
                {dateNotes?.slice(0, 3)?.map((note, noteIndex) => (
                  <div
                    key={noteIndex}
                    className="text-xs p-2 bg-primary/20 text-primary rounded truncate"
                    title={note?.title}
                  >
                    {note?.title}
                  </div>
                ))}
                {dateNotes?.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dateNotes?.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderYearView = () => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(currentDate.getFullYear(), month, 1);
      const monthNotes = notesData?.filter(note => {
        const noteDate = new Date(note.createdDate);
        return noteDate?.getFullYear() === currentDate?.getFullYear() && 
               noteDate?.getMonth() === month;
      });

      months?.push(
        <div
          key={month}
          onClick={() => {
            const newDate = new Date(currentDate.getFullYear(), month, 1);
            onDateSelect(newDate);
            setViewMode('month');
          }}
          className="p-4 border border-border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 bg-background"
        >
          <div className="text-center">
            <div className="text-sm font-medium text-foreground mb-2">
              {monthDate?.toLocaleDateString('en-US', { month: 'long' })}
            </div>
            <div className="text-2xl font-bold text-primary">
              {monthNotes?.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {monthNotes?.length === 1 ? 'note' : 'notes'}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {months}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="min-h-96">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'year' && renderYearView()}
      </div>
    </div>
  );
};

export default CalendarGrid;