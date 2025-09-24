import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <Icon name="Calendar" size={24} color="white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">NoteCalendar</h1>
      </div>

      {/* Welcome Text */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Welcome Back
        </h2>
        <p className="text-muted-foreground text-sm">
          Sign in to access your notes and calendar
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;