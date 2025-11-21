import { useEditorStore } from './store';
import { ComponentId } from './types';
import { get, deepMerge } from './utils';

// ============================================
// HOOKS PERSONALIZADOS PARA EL EDITOR
// ============================================

/**
 * Hook para obtener props editables de un componente
 * Merge las props por defecto con la configuración del editor
 */
export function useEditableProps<T extends object>(
  componentId: ComponentId,
  defaultProps: T
): T {
  const isEditorActive = useEditorStore((state) => state.isEditorActive);
  const config = useEditorStore((state) => state.config);
  
  // Si el editor no está activo, usar props por defecto
  if (!isEditorActive) {
    return defaultProps;
  }
  
  // Obtener configuración del componente
  const componentConfig = get(config, `components.${componentId}`);
  
  if (!componentConfig) {
    return defaultProps;
  }
  
  // Merge configuración con props por defecto
  return deepMerge(defaultProps, componentConfig as Partial<T>);
}

/**
 * Hook para hacer un componente seleccionable en el editor
 */
export function useEditable(componentId: ComponentId) {
  const isEditorActive = useEditorStore((state) => state.isEditorActive);
  const selectedComponent = useEditorStore((state) => state.selectedComponent);
  const selectComponent = useEditorStore((state) => state.selectComponent);
  
  const isSelected = selectedComponent === componentId;
  
  const handleClick = (e: React.MouseEvent) => {
    if (!isEditorActive) return;
    
    e.stopPropagation();
    selectComponent(componentId);
  };
  
  const editableProps = {
    onClick: handleClick,
    className: isEditorActive
      ? `editable-component ${isSelected ? 'editable-selected' : 'editable-hover'}`
      : '',
    'data-component-id': componentId,
  };
  
  return {
    isEditorActive,
    isSelected,
    editableProps,
  };
}

/**
 * Hook para obtener estilos editables
 */
export function useEditableStyles(componentId: ComponentId) {
  const config = useEditorStore((state) => state.config);
  
  const basePath = `components.${componentId}`;
  
  return {
    title: get(config, `${basePath}.title`),
    subtitle: get(config, `${basePath}.subtitle`),
    layout: get(config, `${basePath}.layout`),
    cube: get(config, `${basePath}.cube`),
    legend: get(config, `${basePath}.legend`),
    buttons: get(config, `${basePath}.buttons`),
    backButton: get(config, `${basePath}.backButton`),
    cells: get(config, `${basePath}.cells`),
    filters: get(config, `${basePath}.filters`),
    legends: get(config, `${basePath}.legends`),
    separator: get(config, `${basePath}.separator`),
    content: get(config, `${basePath}.content`),
  };
}

