import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const DebugEditor: React.FC = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Please try typing here...</p>',
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-full',
      },
    },
  });

  return (
    <div className="flex flex-col h-full bg-gray-800/50 rounded-lg">
      <EditorContent editor={editor} />
    </div>
  );
};
