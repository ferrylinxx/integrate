// ============================================
// TIPOS DEL SISTEMA DE EDICIÓN VISUAL
// ============================================

export interface EditorConfig {
  version: string;
  createdAt: string;
  updatedAt: string;

  // Configuración global
  global: GlobalConfig;

  // Configuración por componente
  components: {
    mapaDeSituacion: MapaDeSituacionConfig;
    vistaGeneral: VistaGeneralConfig;
    vistaArea: VistaAreaConfig;
    panelInferior: PanelInferiorConfig;
  };

  // ➕ NUEVO: Elementos personalizados añadidos por el usuario
  customElements?: CustomElement[];
}

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

export interface GlobalConfig {
  fontFamily: string;
  backgroundColor: string;
  primaryColor: string;
}

// ============================================
// CONFIGURACIONES POR COMPONENTE
// ============================================

export interface MapaDeSituacionConfig {
  title: TextConfig;
  subtitle: TextConfig;
  layout: LayoutConfig;
  cube: CubeConfig;
  legend: LegendConfig;
  buttons: ButtonConfig;
}

export interface VistaGeneralConfig {
  title: TextConfig;
  layout: LayoutConfig;
  cells: CellConfig;
  filters: FilterConfig;
  legends: LegendsConfig;
}

export interface VistaAreaConfig {
  title: TextConfig;
  layout: LayoutConfig;
  cells: CellConfig;
  backButton: ButtonConfig;
}

export interface PanelInferiorConfig {
  layout: LayoutConfig;
  separator: SeparatorConfig;
  content: ContentConfig;
}

// ============================================
// SUB-CONFIGURACIONES
// ============================================

export interface TextConfig {
  content: string;
  fontFamily?: string; // ➕ NUEVO
  fontSize: string;
  fontWeight: number;
  color: string;
  opacity: number;
  letterSpacing?: string;
  lineHeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify'; // ➕ NUEVO
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'; // ➕ NUEVO
}

export interface LayoutConfig {
  padding: string;
  paddingTop?: string; // ➕ NUEVO: Padding individual
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  gap: string;
  margin?: string;
  marginTop?: string; // ➕ NUEVO: Margin individual
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  position?: PositionConfig;
  size?: SizeConfig;
  alignContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'; // ➕ NUEVO
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'; // ➕ NUEVO
}

export interface PositionConfig {
  x: number;
  y: number;
}

export interface SizeConfig {
  width: number;
  height: number;
}

export interface CubeConfig {
  size: number;
  perspective: number;
  borderWidth: string;
  borderColor: string;
  faceOpacity: number;
  // ➕ NUEVO: Controles avanzados del cubo
  rotationX?: number; // Rotación en eje X (grados)
  rotationY?: number; // Rotación en eje Y (grados)
  rotationZ?: number; // Rotación en eje Z (grados)
  animationSpeed?: number; // 0 = estático, 1-10 = velocidad
  enableAnimation?: boolean; // Activar/desactivar animación
  enableShadows?: boolean; // Activar/desactivar sombras
}

export interface LegendConfig {
  ballSize: string;
  fontSize: string;
  gap: string;
  gradientAngle: number;
  ballOpacity?: number; // ➕ NUEVO: Opacidad de las bolas (0.5-1.0)
}

export interface ButtonConfig {
  borderRadius: string;
  padding: string;
  paddingX?: string; // ➕ NUEVO: Padding horizontal
  paddingY?: string; // ➕ NUEVO: Padding vertical
  fontSize: string;
  fontWeight: number;
  backgroundColor?: string; // ➕ NUEVO
  textColor?: string; // ➕ NUEVO
  borderWidth?: string; // ➕ NUEVO
  borderColor?: string; // ➕ NUEVO
  glassEffect: GradientConfig;
  glassOpacity?: number; // ➕ NUEVO: Opacidad del efecto glass (0-1)
  boxShadow?: BoxShadowConfig; // ➕ NUEVO
}

export interface CellConfig {
  size: number;
  borderWidth: string;
  borderRadius: string;
  gap: string;
  // ➕ NUEVO: Controles avanzados de celdas
  gradientOpacity?: number; // Opacidad de gradientes (0.3-1.0)
  hoverIntensity?: number; // Intensidad del efecto hover (0-1)
  enableHoverAnimation?: boolean; // Activar/desactivar animaciones hover
}

export interface FilterConfig {
  buttonHeight: string;
  buttonPadding: string;
  gap: string;
}

export interface LegendsConfig {
  ballSize: string;
  fontSize: string;
  gap: string;
  ballOpacity?: number; // ➕ NUEVO: Opacidad de las bolas (0.5-1.0)
}

export interface SeparatorConfig {
  height: string;
  gradient: GradientConfig;
}

export interface ContentConfig {
  fontSize: string;
  lineHeight: string;
  columnGap: string;
}

export interface GradientConfig {
  angle: number;
  stops: GradientStop[];
}

export interface GradientStop {
  color: string;
  position: number; // 0-100
  opacity?: number; // ➕ NUEVO: Opacidad de cada parada (0-1)
}

// ➕ NUEVO: Configuración de sombra
export interface BoxShadowConfig {
  x: number; // Desplazamiento horizontal
  y: number; // Desplazamiento vertical
  blur: number; // Desenfoque
  spread: number; // Expansión
  color: string; // Color de la sombra
  opacity: number; // Opacidad (0-1)
}

// ============================================
// TIPOS DEL STORE
// ============================================

export interface EditorStore {
  // Estado
  isEditorActive: boolean;
  selectedComponent: ComponentId | null;
  selectedElement: string | null;
  config: EditorConfig;
  history: EditorConfig[];
  historyIndex: number;
  isDirty: boolean;
  
  // Acciones
  toggleEditor: () => void;
  selectComponent: (id: ComponentId | null) => void;
  selectElement: (id: string | null) => void;
  updateConfig: (path: string, value: any) => void;
  undo: () => void;
  redo: () => void;
  resetToDefault: () => void;
  saveConfig: () => Promise<void>;
  loadConfig: (userId: string) => Promise<void>;
  exportConfig: () => string;
  importConfig: (json: string) => void;
}

export type ComponentId = 
  | 'mapaDeSituacion'
  | 'vistaGeneral'
  | 'vistaArea'
  | 'panelInferior';

// ============================================
// TIPOS DE PROPIEDADES EDITABLES
// ============================================

export type EditableProperty = 
  | 'text'
  | 'color'
  | 'gradient'
  | 'spacing'
  | 'size'
  | 'opacity'
  | 'border'
  | 'font';

export interface PropertyEditorProps {
  path: string;
  label: string;
  type: EditableProperty;
}

// ============================================
// ELEMENTOS PERSONALIZADOS
// ============================================

export interface CustomElement {
  id: string; // UUID único
  type: 'text' | 'image' | 'video' | 'button' | 'html' | 'shape' | 'icon' | 'chart' | 'table';
  subtype?: string; // h1, h2, h3, paragraph, rectangle, circle, etc.
  content: any; // Contenido específico del tipo
  layout: {
    position: { x: number; y: number };
    size?: { width: number; height: number };
  };
  styles: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: number;
    color?: string;
    backgroundColor?: string;
    borderRadius?: string;
    opacity?: number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    [key: string]: any; // Estilos adicionales específicos del tipo
  };
  visible?: boolean; // Toggle visible/oculto
  locked?: boolean; // Toggle bloqueado/desbloqueado
  createdAt: string;
  updatedAt: string;
}
