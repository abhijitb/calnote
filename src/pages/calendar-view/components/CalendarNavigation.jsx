import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarNavigation = ({ currentDate, onDateChange, viewMode }) => {
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate?.setMonth(currentDate?.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate?.setDate(currentDate?.getDate() - 7);
    } else if (viewMode === 'year') {
      newDate?.setFullYear(currentDate?.getFullYear() - 1);
    }
    onDateChange(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate?.setMonth(currentDate?.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate?.setDate(currentDate?.getDate() + 7);
    } else if (viewMode === 'year') {
      newDate?.setFullYear(currentDate?.getFullYear() + 1);
    }
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const formatCurrentPeriod = () => {
    if (viewMode === 'year') {
      return currentDate?.getFullYear()?.toString();
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek?.setDate(currentDate?.getDate() - currentDate?.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek?.setDate(startOfWeek?.getDate() + 6);
      
      if (startOfWeek?.getMonth() === endOfWeek?.getMonth()) {
        return `${startOfWeek?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endOfWeek?.getDate()}, ${startOfWeek?.getFullYear()}`;
      } else {
        return `${startOfWeek?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${startOfWeek?.getFullYear()}`;
      }
    } else {
      return currentDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={navigatePrevious}
          className="hover-lift"
        >
          <Icon name="ChevronLeft" size={20} />
        </Button>
        
        <div className="text-xl font-semibold text-foreground min-w-64 text-center">
          {formatCurrentPeriod()}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={navigateNext}
          className="hover-lift"
        >
          <Icon name="ChevronRight" size={20} />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          iconName="Calendar"
          iconPosition="left"
          iconSize={16}
          className="hover-lift"
        >
          Today
        </Button>
      </div>
    </div>
  );
};

export default CalendarNavigation;