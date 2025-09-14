export type ViewMode = 'rich' | 'code';

export interface EditorState {
  content: string;
  editingWidget: HTMLElement | null;
  viewMode: ViewMode;
}

export type EditorAction =
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_EDITING_WIDGET'; payload: HTMLElement | null }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode };

export const editorReducer = (
  state: EditorState,
  action: EditorAction
): EditorState => {
  switch (action.type) {
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'SET_EDITING_WIDGET':
      return { ...state, editingWidget: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    default:
      return state;
  }
};
