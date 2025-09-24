import React from 'react';
import Button from '../../../components/ui/Button';


const EditorToolbar = ({ 
  onBold, 
  onItalic, 
  onUnderline, 
  onBulletList, 
  onNumberedList,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  formatStates = {}
}) => {
  const toolbarItems = [
    {
      id: 'undo',
      icon: 'Undo',
      label: 'Undo',
      onClick: onUndo,
      disabled: !canUndo,
      shortcut: 'Ctrl+Z'
    },
    {
      id: 'redo',
      icon: 'Redo',
      label: 'Redo',
      onClick: onRedo,
      disabled: !canRedo,
      shortcut: 'Ctrl+Y'
    },
    { id: 'divider1', type: 'divider' },
    {
      id: 'bold',
      icon: 'Bold',
      label: 'Bold',
      onClick: onBold,
      active: formatStates?.bold,
      shortcut: 'Ctrl+B'
    },
    {
      id: 'italic',
      icon: 'Italic',
      label: 'Italic',
      onClick: onItalic,
      active: formatStates?.italic,
      shortcut: 'Ctrl+I'
    },
    {
      id: 'underline',
      icon: 'Underline',
      label: 'Underline',
      onClick: onUnderline,
      active: formatStates?.underline,
      shortcut: 'Ctrl+U'
    },
    { id: 'divider2', type: 'divider' },
    {
      id: 'bulletList',
      icon: 'List',
      label: 'Bullet List',
      onClick: onBulletList,
      active: formatStates?.bulletList
    },
    {
      id: 'numberedList',
      icon: 'ListOrdered',
      label: 'Numbered List',
      onClick: onNumberedList,
      active: formatStates?.numberedList
    }
  ];

  return (
    <div className="flex items-center gap-1 p-2 bg-card border border-border rounded-lg shadow-sm">
      {toolbarItems?.map((item) => {
        if (item?.type === 'divider') {
          return (
            <div 
              key={item?.id} 
              className="w-px h-6 bg-border mx-1" 
            />
          );
        }

        return (
          <Button
            key={item?.id}
            variant={item?.active ? 'default' : 'ghost'}
            size="sm"
            onClick={item?.onClick}
            disabled={item?.disabled}
            iconName={item?.icon}
            iconSize={16}
            className={`h-8 w-8 p-0 hover-lift ${
              item?.active ? 'bg-primary text-primary-foreground' : ''
            }`}
            title={`${item?.label} ${item?.shortcut ? `(${item?.shortcut})` : ''}`}
          />
        );
      })}
    </div>
  );
};

export default EditorToolbar;