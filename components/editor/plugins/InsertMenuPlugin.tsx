import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { InsertMenu } from '../InsertMenu';
import {
  useInsertMenuItems,
  InsertMenuMode,
} from '../../../hooks/useInsertMenuItems';
import { useOntologyIndex } from '../../../hooks/useOntologyIndex';
import { TemplateEditor } from '../TemplateEditor';
import { formatPropertyForDisplay } from '../../../utils/properties';
import type {
  EditorApi,
  EditorPlugin,
  OntologyNode,
  Property,
} from '../../../types';

type OpenMenuContext = {
  mode: InsertMenuMode;
  selectedValue?: string;
};

const api: {
  open: (
    position?: { top: number; left: number },
    context?: OpenMenuContext
  ) => void;
  close: () => void;
} = {
  open: () => {},
  close: () => {},
};

const InsertMenuProvider: React.FC<{ editorApi: EditorApi }> = ({ editorApi }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const [isTemplateEditorOpen, setTemplateEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<OntologyNode | null>(
    null
  );
  const [context, setContext] = useState<OpenMenuContext>({ mode: 'all' });

  const settings = editorApi.getSettings();
  const { ontology } = settings;
  const indexedOntology = useOntologyIndex(ontology);
  const items = useInsertMenuItems(indexedOntology, context.mode);

  const openMenu = useCallback(
    (pos?: { top: number; left: number }, newContext?: OpenMenuContext) => {
      let newPos = pos;
      if (!newPos) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          newPos = { top: rect.bottom + 8, left: rect.left };
        } else {
          newPos = { top: window.innerHeight / 2, left: window.innerWidth / 2 };
        }
      }
      setPosition(newPos);
      setContext(newContext || { mode: 'all' });
      setMenuOpen(true);
    },
    []
  );

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setPosition(null);
  }, []);

  useEffect(() => {
    api.open = openMenu;
    api.close = closeMenu;

    // Cleanup on unmount
    return () => {
      api.open = () => {};
      api.close = () => {};
    };
  }, [openMenu, closeMenu]);

  if (!isMenuOpen && !isTemplateEditorOpen) {
    return null;
  }

  const handleSelect = (item) => {
    closeMenu();
    let htmlToInsert = '';

    if (item.type === 'tag') {
      const textToInsert = `#${item.label} `;
      editorApi.insertHtml(textToInsert); // Let input rules handle the rest
    } else if (item.type === 'property') {
      const key = item.label;
      const operator = 'is';
      const value = context.selectedValue && context.mode === 'property' ? context.selectedValue : '""';
      const textToInsert = `[${key}:${operator}:${value}] `;
      editorApi.insertHtml(textToInsert); // Let input rules handle the rest
    } else if (item.type === 'template') {
      const template = indexedOntology.allTemplates.find(
        (t) => t.id === item.id.replace('template-', '')
      );
      if (template) {
        setSelectedTemplate(template);
        setTemplateEditorOpen(true);
      }
    }
  };

  const handleTemplateSave = (properties: Property[]) => {
    const textToInsert = properties
      .map((prop) => {
        const { key, operator, values } = prop;
        // Join multiple values with a comma, handle empty values
        const valueStr = values.length > 0 ? values.join(',') : '""';
        return `[${key}:${operator}:${valueStr}]`;
      })
      .join(' ');

    if (textToInsert) {
      editorApi.insertHtml(textToInsert + ' '); // Let input rules handle the rest
    }
    setTemplateEditorOpen(false);
    setSelectedTemplate(null);
  };

  const popoverStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${position?.top}px`,
    left: `${position?.left}px`,
    zIndex: 100,
  };

  return (
    <>
      {isMenuOpen && position && ReactDOM.createPortal(
        <div style={popoverStyle}>
          <InsertMenu items={items} onSelect={handleSelect} onClose={closeMenu} />
        </div>,
        document.body
      )}
      {selectedTemplate && (
        <TemplateEditor
          template={selectedTemplate}
          isOpen={isTemplateEditorOpen}
          onClose={() => setTemplateEditorOpen(false)}
          onSave={handleTemplateSave}
        />
      )}
    </>
  );
};

export const insertMenuPlugin: EditorPlugin = {
  id: 'insert-menu',
  name: 'Insert Menu',
  Popover: InsertMenuProvider,
  api: api,
};
