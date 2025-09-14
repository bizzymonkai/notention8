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
  const handleSave = (updatedContent: string) => {
    onSave({
      ...note,
      content: updatedContent,
    });
  };

  return (
    <TiptapEditor
      key={note.id} // Ensure editor remounts when note changes
      note={note}
      onSave={handleSave}
    />
  );
};
