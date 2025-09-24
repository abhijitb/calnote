import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CredentialsHelper = () => {
  const [isVisible, setIsVisible] = useState(false);

  const mockCredentials = {
    email: 'user@notecalendar.com',
    password: 'password123'
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text)?.then(() => {
      // In a real app, you might show a toast notification
      console.log('Copied to clipboard:', text);
    });
  };

  if (!isVisible) {
    return (
      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(true)}
          iconName="Info"
          iconPosition="left"
          iconSize={16}
        >
          Show Demo Credentials
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">Demo Credentials</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6"
        >
          <Icon name="X" size={14} />
        </Button>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between p-2 bg-background rounded border">
          <span className="text-muted-foreground">Email:</span>
          <div className="flex items-center space-x-2">
            <code className="text-foreground font-mono">{mockCredentials?.email}</code>
            <button
              onClick={() => copyToClipboard(mockCredentials?.email)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="Copy" size={12} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-background rounded border">
          <span className="text-muted-foreground">Password:</span>
          <div className="flex items-center space-x-2">
            <code className="text-foreground font-mono">{mockCredentials?.password}</code>
            <button
              onClick={() => copyToClipboard(mockCredentials?.password)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="Copy" size={12} />
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Use these credentials to access the demo application
      </p>
    </div>
  );
};

export default CredentialsHelper;