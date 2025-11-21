// ============================================
// EXPORTACIONES DEL SISTEMA DE EDICIÓN
// ============================================

// Componentes principales
export { EditorProvider } from './EditorProvider';
export { EditorToolbar } from './EditorToolbar';
export { EditorPanel } from './EditorPanel';

// Componentes de edición visual directa
export { EditableText } from './EditableText';
export { DraggableWrapper } from './DraggableWrapper';
export { ResizableWrapper } from './ResizableWrapper';
export { EditorWrapper } from './EditorWrapper';

// Editores de propiedades
export { TextEditor } from './property-editors/TextEditor';
export { LayoutEditor } from './property-editors/LayoutEditor';
export { CubeEditor } from './property-editors/CubeEditor';
export { ButtonEditor } from './property-editors/ButtonEditor';

// ➕ NUEVO: Sistema de añadir elementos
export { AddElementMenu } from './AddElementMenu';
export { AddElementModal } from './AddElementModal';
export { CustomElementRenderer } from './CustomElementRenderer';
export { CustomElementsPanel } from './CustomElementsPanel';

