import type { EditorApi } from '../../../types';
import { formatPropertyForDisplay } from '../../../utils/properties';

const processInputRules = (editorApi: EditorApi): boolean => {
  const selection = window.getSelection();
  if (!selection || !selection.isCollapsed || selection.rangeCount === 0)
    return false;

  const range = selection.getRangeAt(0);
  const container = range.startContainer;
  if (container.nodeType !== Node.TEXT_NODE) return false;

  const textBeforeCaret =
    container.textContent?.substring(0, range.startOffset) || '';

  // Rule: [[ to open insert menu
  const menuMatch = textBeforeCaret.match(/(\[\[)$/);
  if (menuMatch) {
    const [fullMatch] = menuMatch;
    const offsetToReplace = fullMatch.length;
    range.setStart(container, range.startOffset - offsetToReplace);
    range.deleteContents();

    editorApi.plugins['insert-menu'].open();
    return true;
  }

  // Rule: #tag
  const tagMatch = textBeforeCaret.match(/(#([a-zA-Z0-9_-]+)\s)$/);
  if (tagMatch) {
    const [fullMatch, , tagName] = tagMatch;
    const offsetToReplace = fullMatch.length;
    range.setStart(container, range.startOffset - offsetToReplace);
    range.deleteContents();

    const htmlToInsert = `<span class="widget tag" contenteditable="false" data-tag="${tagName}">#${tagName}</span>&nbsp;`;
    editorApi.insertHtml(htmlToInsert);
    return true;
  }

  // Rule: [key:operator:value]
  const propMatch = textBeforeCaret.match(/(\[([^:\]]+?):([^:\]]+?):([^\]]*?)\]\s)$/);
  if (propMatch) {
    const [fullMatch, , key, operator, valuesStr] = propMatch.map((s) => s || '');
    if (key.trim()) {
      const offsetToReplace = fullMatch.length;
      if (offsetToReplace > range.startOffset) return false;

      range.setStart(container, range.startOffset - offsetToReplace);
      range.deleteContents();

      const k = key.trim();
      const op = operator.trim();
      const values = valuesStr.split(',').map(s => s.trim());

      const htmlToInsert = `<span class="widget property" contenteditable="false" data-key="${k}" data-operator="${op}" data-values='${JSON.stringify(values)}'>${formatPropertyForDisplay(k, op, values)}</span>&nbsp;`;

      editorApi.insertHtml(htmlToInsert);
      return true;
    }
  }
  return false;
};

export const inputRulesPlugin = {
  id: 'input-rules',
  name: 'Input Rules',
  onInput: (event: React.FormEvent<HTMLDivElement>, editorApi: EditorApi) => {
    return processInputRules(editorApi);
  },
};
