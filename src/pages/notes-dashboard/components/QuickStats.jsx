import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Notes',
      value: stats?.totalNotes,
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Favorites',
      value: stats?.favoriteNotes,
      icon: 'Star',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'This Week',
      value: stats?.notesThisWeek,
      icon: 'Calendar',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Tags Used',
      value: stats?.uniqueTags,
      icon: 'Tag',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems?.map((item, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-4 hover-lift transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${item?.bgColor} flex items-center justify-center`}>
              <Icon name={item?.icon} size={20} className={item?.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{item?.value}</p>
              <p className="text-sm text-muted-foreground">{item?.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;