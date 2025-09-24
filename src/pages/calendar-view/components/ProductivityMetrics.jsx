import React from 'react';
import Icon from '../../../components/AppIcon';

const ProductivityMetrics = ({ notesData, currentDate }) => {
  const calculateMetrics = () => {
    const now = new Date();
    const currentMonth = currentDate?.getMonth();
    const currentYear = currentDate?.getFullYear();
    
    // Filter notes for current month
    const monthNotes = notesData?.filter(note => {
      const noteDate = new Date(note.createdDate);
      return noteDate?.getMonth() === currentMonth && noteDate?.getFullYear() === currentYear;
    });

    // Calculate daily averages
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0)?.getDate();
    const notesPerDay = monthNotes?.length / daysInMonth;

    // Find most active day
    const dayCount = {};
    monthNotes?.forEach(note => {
      const day = new Date(note.createdDate)?.getDate();
      dayCount[day] = (dayCount?.[day] || 0) + 1;
    });
    
    const mostActiveDay = Object.keys(dayCount)?.reduce((a, b) => 
      dayCount?.[a] > dayCount?.[b] ? a : b, Object.keys(dayCount)?.[0]
    );

    // Calculate streak
    const sortedDates = [...new Set(notesData.map(note => note.createdDate))]?.sort()?.reverse();
    let currentStreak = 0;
    let checkDate = new Date();
    
    for (let i = 0; i < sortedDates?.length; i++) {
      const noteDate = new Date(sortedDates[i]);
      const diffTime = Math.abs(checkDate - noteDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1 || (i > 0 && diffDays <= 2)) {
        currentStreak++;
        checkDate = noteDate;
      } else {
        break;
      }
    }

    // Weekly comparison
    const thisWeek = notesData?.filter(note => {
      const noteDate = new Date(note.createdDate);
      const weekStart = new Date(now);
      weekStart?.setDate(now?.getDate() - now?.getDay());
      return noteDate >= weekStart;
    })?.length;

    const lastWeek = notesData?.filter(note => {
      const noteDate = new Date(note.createdDate);
      const lastWeekStart = new Date(now);
      lastWeekStart?.setDate(now?.getDate() - now?.getDay() - 7);
      const lastWeekEnd = new Date(now);
      lastWeekEnd?.setDate(now?.getDate() - now?.getDay() - 1);
      return noteDate >= lastWeekStart && noteDate <= lastWeekEnd;
    })?.length;

    const weeklyChange = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

    return {
      totalNotes: monthNotes?.length,
      notesPerDay: notesPerDay?.toFixed(1),
      mostActiveDay: mostActiveDay || 'N/A',
      currentStreak,
      weeklyChange: weeklyChange?.toFixed(0),
      thisWeek,
      lastWeek
    };
  };

  const metrics = calculateMetrics();

  const MetricCard = ({ icon, title, value, subtitle, trend }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover-lift">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 text-xs ${
            trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-muted-foreground'
          }`}>
            <Icon 
              name={trend > 0 ? 'TrendingUp' : trend < 0 ? 'TrendingDown' : 'Minus'} 
              size={12} 
            />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Productivity Metrics</h3>
        <div className="text-sm text-muted-foreground">
          {currentDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          icon="FileText"
          title="Total Notes"
          value={metrics?.totalNotes}
          subtitle="This month"
        />
        
        <MetricCard
          icon="BarChart3"
          title="Daily Average"
          value={metrics?.notesPerDay}
          subtitle="Notes per day"
        />
        
        <MetricCard
          icon="Calendar"
          title="Most Active"
          value={metrics?.mostActiveDay !== 'N/A' ? `${metrics?.mostActiveDay}th` : 'N/A'}
          subtitle="Day of month"
        />
        
        <MetricCard
          icon="Flame"
          title="Current Streak"
          value={metrics?.currentStreak}
          subtitle={metrics?.currentStreak === 1 ? 'day' : 'days'}
        />
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-foreground">Weekly Comparison</h4>
          <div className={`flex items-center space-x-1 text-xs ${
            metrics?.weeklyChange > 0 ? 'text-success' : 
            metrics?.weeklyChange < 0 ? 'text-error' : 'text-muted-foreground'
          }`}>
            <Icon 
              name={metrics?.weeklyChange > 0 ? 'TrendingUp' : 
                    metrics?.weeklyChange < 0 ? 'TrendingDown' : 'Minus'} 
              size={12} 
            />
            <span>{Math.abs(metrics?.weeklyChange)}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">{metrics?.thisWeek}</div>
            <div className="text-xs text-muted-foreground">This week</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-muted-foreground">{metrics?.lastWeek}</div>
            <div className="text-xs text-muted-foreground">Last week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityMetrics;