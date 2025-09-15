import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Note } from '../types';
import { TiptapToolbar } from './TiptapToolbar';
import { sanitizeHTML } from '../utils/sanitize';

const SAVE_DEBOUNCE_MS = 1000;

const formatHtmlForDisplay = (html: string) => {
  if (!html) return '';
  // Add a newline before any block-level tag
  const blockTags = ['p', 'h1', 'h2', 'h3', 'hr', 'ul', 'ol', 'li', 'blockquote', 'pre'];
  const regex = new RegExp(`(<(?:${blockTags.join('|')})[^>]*>)`, 'g');
  return html.replace(regex, '\n$1').trim();
};

interface TiptapEditorProps {
  content: string;
  onChange: (updatedContent: string) => void;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const [viewMode, setViewMode] = useState<'rich' | 'code'>('rich');

  const editor = useEditor({
    extensions: [StarterKit],
    content: sanitizeHTML(content),
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-full',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Effect to update editor content when the parent's content changes,
  // but only if it's different from the editor's current state.
  // This is necessary for the initial load and for syncing after a save.
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(sanitizeHTML(content), false);
    }
  }, [content, editor]);

  // The `key` prop on this component in EditorManager.tsx handles re-mounting
  // with fresh state when the note ID changes. This is the correct way to handle
  // switching notes.

  const toggleViewMode = () => {
    setViewMode(viewMode === 'rich' ? 'code' : 'rich');
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Remove the display-only newlines before updating the state
    const rawHtml = e.target.value.replace(/\n/g, '');
    onChange(rawHtml);
  };

  return (
    <div className="flex flex-col h-full">
      <TiptapToolbar editor={editor} viewMode={viewMode} toggleViewMode={toggleViewMode} />
      <div className="flex-grow overflow-y-auto">
        {viewMode === 'rich' ? (
          <EditorContent editor={editor} />
        ) : (
          <textarea
            className="w-full h-full p-4 bg-gray-900 text-gray-300 font-mono focus:outline-none resize-none"
            value={formatHtmlForDisplay(content)}
            onChange={handleCodeChange}
            placeholder="Enter HTML..."
          />
        )}
      </div>
    </div>
  );
};
