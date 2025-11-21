/**
 * Cliente para la API de Figma
 * Permite sincronizar contenido desde archivos de Figma a Supabase
 */

const FIGMA_API_BASE = "https://api.figma.com/v1";

export interface FigmaTextNode {
  id: string;
  name: string;
  type: string;
  characters?: string;
  children?: FigmaTextNode[];
}

export interface FigmaFile {
  name: string;
  lastModified: string;
  document: FigmaTextNode;
}

export interface FigmaContentMapping {
  nodeId: string;
  nodeName: string;
  category: string;
  sectionName: string;
  fieldName: string;
  fieldLabel: string;
  isHtml: boolean;
}

/**
 * Cliente de Figma API
 */
export class FigmaClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Obtiene información del archivo de Figma
   */
  async getFile(fileKey: string): Promise<FigmaFile> {
    const response = await fetch(`${FIGMA_API_BASE}/files/${fileKey}`, {
      headers: {
        "X-Figma-Token": this.accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Obtiene todos los nodos de texto de un archivo
   */
  async getTextNodes(fileKey: string): Promise<FigmaTextNode[]> {
    const file = await this.getFile(fileKey);
    const textNodes: FigmaTextNode[] = [];

    const traverse = (node: FigmaTextNode) => {
      if (node.type === "TEXT" && node.characters) {
        textNodes.push(node);
      }
      if (node.children) {
        node.children.forEach(traverse);
      }
    };

    traverse(file.document);
    return textNodes;
  }

  /**
   * Extrae contenido basado en un mapeo de nombres de nodos
   * Convención de nombres en Figma: "category/section_name/field_name"
   */
  extractContentFromNodes(
    nodes: FigmaTextNode[]
  ): Array<{
    category: string;
    sectionName: string;
    fieldName: string;
    fieldLabel: string;
    content: string;
    isHtml: boolean;
  }> {
    const content: Array<{
      category: string;
      sectionName: string;
      fieldName: string;
      fieldLabel: string;
      content: string;
      isHtml: boolean;
    }> = [];

    for (const node of nodes) {
      // Parsear el nombre del nodo según la convención
      // Formato esperado: "category/section_name/field_name" o "category/section_name/field_name [HTML]"
      const parts = node.name.split("/");
      
      if (parts.length >= 3) {
        const category = parts[0].trim();
        const sectionName = parts[1].trim();
        let fieldName = parts[2].trim();
        let isHtml = false;

        // Detectar si es HTML
        if (fieldName.includes("[HTML]")) {
          isHtml = true;
          fieldName = fieldName.replace("[HTML]", "").trim();
        }

        content.push({
          category,
          sectionName,
          fieldName,
          fieldLabel: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
          content: node.characters || "",
          isHtml,
        });
      }
    }

    return content;
  }

  /**
   * Sincroniza contenido de Figma a un formato compatible con Supabase
   */
  async syncContent(fileKey: string) {
    const textNodes = await this.getTextNodes(fileKey);
    return this.extractContentFromNodes(textNodes);
  }
}

/**
 * Crea una instancia del cliente de Figma
 */
export function createFigmaClient(): FigmaClient {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  
  if (!token) {
    throw new Error("FIGMA_ACCESS_TOKEN no está configurado en las variables de entorno");
  }

  return new FigmaClient(token);
}

