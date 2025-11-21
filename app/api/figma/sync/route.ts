/**
 * API Route para sincronizar contenido de Figma a Supabase
 * 
 * POST /api/figma/sync
 * Body: { fileKey: string, tableName?: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { createFigmaClient } from "@/lib/figma/client";
import { syncFigmaToSupabase } from "@/lib/figma/sync-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileKey, tableName = "landing_content" } = body;

    if (!fileKey) {
      return NextResponse.json(
        { error: "fileKey es requerido" },
        { status: 400 }
      );
    }

    console.log(`🚀 Iniciando sincronización de Figma...`);
    console.log(`   📁 File Key: ${fileKey}`);
    console.log(`   📊 Tabla: ${tableName}`);

    const figmaClient = createFigmaClient();
    const result = await syncFigmaToSupabase(figmaClient, fileKey, tableName);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Sincronización completada exitosamente",
        data: {
          itemsProcessed: result.itemsProcessed,
          itemsCreated: result.itemsCreated,
          itemsUpdated: result.itemsUpdated,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Sincronización completada con errores",
          data: {
            itemsProcessed: result.itemsProcessed,
            itemsCreated: result.itemsCreated,
            itemsUpdated: result.itemsUpdated,
            errors: result.errors,
          },
        },
        { status: 207 } // Multi-Status
      );
    }
  } catch (error: any) {
    console.error("❌ Error en sincronización:", error);
    return NextResponse.json(
      { error: error.message || "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Endpoint de sincronización de Figma",
    usage: "POST /api/figma/sync con { fileKey: string, tableName?: string }",
  });
}

