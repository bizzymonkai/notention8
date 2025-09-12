import React from 'react';
import type { Note } from '../../types';
import { TrashIcon, WorldIcon } from '../icons';
import { getTextFromHtml } from '../../utils/nostr';
import { useNoteSemantics } from '../../hooks/useNoteSemantics';

export const NoteListItem: React.FC<{
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}> = ({ note, isSelected, onSelect, onDelete }) => {
  const { isImaginary } = useNoteSemantics(note.content);

  const contentPreview = React.useMemo(() => {
    return getTextFromHtml(note.content) || 'No content';
  }, [note.content]);

  const baseBg = isImaginary ? 'bg-purple-600/10' : 'bg-green-600/10';
  const hoverBg = isImaginary ? 'hover:bg-purple-600/20' : 'hover:bg-green-600/20';
  const selectedBg = isSelected ? (isImaginary ? 'bg-purple-600/40' : 'bg-green-600/40') : '';


  return (
    <div
      onClick={onSelect}
      className={`group flex justify-between items-center p-3 rounded-md cursor-pointer transition-colors ${baseBg} ${hoverBg} ${selectedBg}`}
    >
      <div className="flex-1 overflow-hidden flex items-center gap-3">
        {note.nostrEventId && note.publishedAt && (
          <span
            title={`Published on Nostr at ${new Date(note.publishedAt).toLocaleString()}`}
          >
            <WorldIcon className="h-4 w-4 text-green-400 flex-shrink-0" />
          </span>
        )}
        <div className="flex-1 overflow-hidden">
          <h3
            className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}
          >
            {note.title || 'Untitled Note'}
          </h3>
          <p className="text-sm text-gray-400 truncate">{contentPreview}</p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="ml-2 p-1 text-gray-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-900/50 hover:text-red-400 transition-opacity"
        title="Delete Note"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
