import React, { useRef, useEffect, useState } from 'react';
import EditorToolbar from './EditorToolbar';

const RichTextEditor = ({ 
  content = '', 
  onChange, 
  onWordCountChange,
  placeholder = "Start writing your note..." 
}) => {
  const editorRef = useRef(null);
  const [formatStates, setFormatStates] = useState({});
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (editorRef?.current && content !== editorRef?.current?.innerHTML) {
      editorRef.current.innerHTML = content;
      updateWordCount();
    }
  }, [content]);

  const updateWordCount = () => {
    if (editorRef?.current && onWordCountChange) {
      const text = editorRef?.current?.innerText || '';
      const wordCount = text?.trim() ? text?.trim()?.split(/\s+/)?.length : 0;
      onWordCountChange(wordCount);
    }
  };

  const updateFormatStates = () => {
    setFormatStates({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      bulletList: document.queryCommandState('insertUnorderedList'),
      numberedList: document.queryCommandState('insertOrderedList')
    });
    
    setCanUndo(document.queryCommandEnabled('undo'));
    setCanRedo(document.queryCommandEnabled('redo'));
  };

  const handleInput = () => {
    if (onChange && editorRef?.current) {
      onChange(editorRef?.current?.innerHTML);
    }
    updateWordCount();
    updateFormatStates();
  };

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e?.ctrlKey || e?.metaKey) {
      switch (e?.key?.toLowerCase()) {
        case 'b':
          e?.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e?.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e?.preventDefault();
          executeCommand('underline');
          break;
        case 'z':
          if (e?.shiftKey) {
            e?.preventDefault();
            executeCommand('redo');
          } else {
            e?.preventDefault();
            executeCommand('undo');
          }
          break;
        case 'y':
          e?.preventDefault();
          executeCommand('redo');
          break;
      }
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef?.current?.focus();
    handleInput();
    updateFormatStates();
  };

  const handleSelectionChange = () => {
    updateFormatStates();
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="mb-4">
        <EditorToolbar
          onBold={() => executeCommand('bold')}
          onItalic={() => executeCommand('italic')}
          onUnderline={() => executeCommand('underline')}
          onBulletList={() => executeCommand('insertUnorderedList')}
          onNumberedList={() => executeCommand('insertOrderedList')}
          onUndo={() => executeCommand('undo')}
          onRedo={() => executeCommand('redo')}
          canUndo={canUndo}
          canRedo={canRedo}
          formatStates={formatStates}
        />
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <div
          ref={editorRef}
          contentEditable
          className="w-full h-full min-h-[400px] p-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-foreground leading-relaxed"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            lineHeight: '1.6'
          }}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          display: block; /* Ensure it takes up space */
        }
        
        [contenteditable] strong,
        [contenteditable] b {
          font-weight: 600;
        }
        
        [contenteditable] em,
        [contenteditable] i {
          font-style: italic;
        }
        
        [contenteditable] u {
          text-decoration: underline;
        }
        
        [contenteditable] ul {
          list-style-type: disc;
          margin-left: 20px;
          margin-bottom: 10px;
        }
        
        [contenteditable] ol {
          list-style-type: decimal;
          margin-left: 20px;
          margin-bottom: 10px;
        }
        
        [contenteditable] li {
          margin-bottom: 5px;
        }
        
        [contenteditable] p {
          margin-bottom: 10px;
        }
        
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;