import React from 'react';
import { useNotes } from '../contexts/NotesContext';
import { useNoteSemantics } from '../../hooks/useNoteSemantics';
import type { Note } from '../../types';

const MarketplaceItem: React.FC<{ note: Note }> = ({ note }) => {
  const semantics = useNoteSemantics(note.content);

  // Extract product info from semantics
  const getProperty = (key: string) => {
    const prop = semantics.properties.find((p) => p.key === key);
    return prop ? prop.values.join(', ') : 'N/A';
  };

  const name = getProperty('name');
  const price = getProperty('price');
  const imageUrl = getProperty('imageURL');

  // Don't render if it's not a product offer
  if (!semantics.tags.includes('offer')) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col gap-4">
      {imageUrl !== 'N/A' && (
        <img src={imageUrl} alt={name} className="w-full h-48 object-cover rounded-md" />
      )}
      <div className="flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-white">{name}</h3>
        <p className="text-gray-400">Price: ${price}</p>
      </div>
    </div>
  );
};

export const MarketplaceView: React.FC = () => {
  const { notes } = useNotes();

  const offerNotes = notes.filter(note => {
    const div = document.createElement('div');
    div.innerHTML = note.content;
    const tags = Array.from(div.querySelectorAll('.tag')).map(
      (el) => el.getAttribute('data-tag') || ''
    );
    return tags.includes('offer');
  });

  if (offerNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <h2 className="text-2xl font-bold text-white mb-3">No offers yet.</h2>
        <p>Create a new note with the #offer and #product tags to list an item.</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offerNotes.map((note) => (
          <MarketplaceItem key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};
