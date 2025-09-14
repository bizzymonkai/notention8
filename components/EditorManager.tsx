import React from 'react';
import type { AppSettings, Note } from '../types';
import { TiptapEditor } from './TiptapEditor';

interface EditorManagerProps {
  note: Note;
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  settings: AppSettings;
}

export const EditorManager: React.FC<EditorManagerProps> = ({
  note,
  onSave,
  onDelete,
  settings,
}) => {
  const handleContentSave = (updatedContent: string) => {
    onSave({
      ...note,
      content: updatedContent,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSave({
      ...note,
      title: e.target.value,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-2 border-b border-gray-700/50">
        <input
          type="text"
          value={note.title || ''}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="w-full bg-transparent text-white text-lg font-bold focus:outline-none placeholder-gray-500"
        />
      </div>
      <TiptapEditor
        key={note.id} // Ensure editor remounts when note changes
        note={note}
        onSave={handleContentSave}
      />
    </div>
  );
};
