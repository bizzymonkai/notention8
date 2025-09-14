import React from 'react';
import { useEditor } from '../hooks/useEditor';
import { sanitizeHTML } from '../utils/sanitize';
import type { AppSettings, Note } from '../types';
import { editorPlugins } from './editor/plugins';

export const RichTextEditorV2: React.FC<{
  note: Note;
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  settings: AppSettings;
}> = ({ note, onSave, onDelete, settings }) => {
  const {
    editorRef,
    content,
    viewMode,
    handleInput,
    handleClick,
    handleKeyDown,
    headerComponents,
    toolbarComponents,
    modalComponents,
    popoverComponents,
    editorApi,
  } = useEditor(editorPlugins, note, settings, onSave, onDelete);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // When in code view, we directly update the content state.
    // The content is not sanitized here because it's plain text.
    // It will be sanitized when converting back to rich view.
    editorApi.updateContent(e.target.value);
  };

  return (
    <div className="relative flex flex-col h-full bg-gray-800/50 rounded-lg overflow-hidden">
      {headerComponents.map((Component, index) => (
        <Component key={index} editorApi={editorApi} />
      ))}
      {toolbarComponents.map((Component, index) => (
        <Component key={index} editorApi={editorApi} />
      ))}

      <div className="flex-grow flex flex-col overflow-y-auto note-content relative">
        {viewMode === 'rich' ? (
          <div
            ref={editorRef}
            className="ProseMirror"
            contentEditable={true}
            onInput={handleInput}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            suppressContentEditableWarning={true}
            data-placeholder="Start writing..."
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
          />
        ) : (
          <textarea
            className="w-full h-full p-4 bg-gray-900 text-gray-300 font-mono focus:outline-none resize-none"
            value={content}
            onChange={handleCodeChange}
            placeholder="Enter semantic code..."
          />
        )}
        {/* Popovers should only show in rich view */}
        {viewMode === 'rich' && popoverComponents.map((Popover, index) => (
          <Popover key={index} editorApi={editorApi} />
        ))}
      </div>

      {/* Render all modal components provided by plugins */}
      {modalComponents.map((Modal, index) => (
        <Modal key={index} editorApi={editorApi} />
      ))}

      <div className="flex-shrink-0 p-2 text-xs text-center text-gray-500 border-t border-gray-700/50">
        Last saved: {new Date(note.updatedAt).toLocaleString()}
      </div>
    </div>
  );
};
