import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Note } from '../types';
import { TiptapToolbar } from './TiptapToolbar';

const SAVE_DEBOUNCE_MS = 1000;

interface TiptapEditorProps {
  note: Note;
  onSave: (updatedContent: string) => void;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ note, onSave }) => {
  const [viewMode, setViewMode] = useState<'rich' | 'code'>('rich');
  const [currentContent, setCurrentContent] = useState(note.content);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-full',
      },
    },
    onUpdate: ({ editor }) => {
      setCurrentContent(editor.getHTML());
    },
  });

  // Debounced save effect
  useEffect(() => {
    // Don't save on initial mount or if content is unchanged
    if (currentContent === note.content) {
      return;
    }

    const handler = setTimeout(() => {
      onSave(currentContent);
    }, SAVE_DEBOUNCE_MS);

    return () => {
      clearTimeout(handler);
    };
  }, [currentContent, onSave, note.content]);

  // Ensure editor content is updated if the note prop changes
  useEffect(() => {
    if (!editor) return;

    const isOutOfSync = editor.getHTML() !== note.content;
    if (isOutOfSync) {
      editor.commands.setContent(note.content, false);
      // Also update our local content state to prevent an unnecessary save trigger
      setCurrentContent(note.content);
    }
  }, [note, editor]);

  const toggleViewMode = () => {
    if (!editor) return;

    if (viewMode === 'rich') {
      // Switching to code view. The `currentContent` is already up-to-date
      // from the `onUpdate` handler or the initial state.
      setViewMode('code');
    } else {
      // Switching to rich view, update editor from our local state
      editor.commands.setContent(currentContent, false);
      setViewMode('rich');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentContent(e.target.value);
    // The debounced save effect will handle saving.
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
            value={currentContent}
            onChange={handleCodeChange}
            placeholder="Enter HTML..."
          />
        )}
      </div>
    </div>
  );
};
