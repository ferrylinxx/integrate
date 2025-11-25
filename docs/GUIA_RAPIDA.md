# 🚀 Guía Rápida - Test de Nivel con CUBO

## Inicio Inmediato

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🎯 Flujo de Prueba

### 1. Página de Inicio
- Ingresa cualquier código de grupo (ej: "GRUPO-A")
- Click en "Empezar test"

### 2. Página de Test
- Responde las 24 preguntas (6 áreas × 4 preguntas)
- Cada pregunta tiene valores del 1 al 4
- La barra de progreso se actualiza automáticamente
- Click en "Guardar" cuando termines

### 3. Modal de Confirmación
- Verifica cuántas preguntas respondiste
- Si faltan preguntas, verás una advertencia
- Click en "Confirmar guardado"

### 4. Página de Resultados
- Verás tu código de participante (8 caracteres)
- **Cubo 3D**: Visualización interactiva 3D (arrastra para rotar, rueda para zoom)
- **Toggle 2D/3D**: Cambia entre vista 3D y 2D con los botones superiores
- **Cubo 2D**: 6 tarjetas con grids 2×2 coloreados (vista alternativa)
- **Tabla**: Vista completa 6×4 con colores
- Click en el botón de copiar para guardar tu código
- Click en "Volver al inicio" para hacer otro test

## 🎨 Ver Ejemplo con Datos Mock

Visita directamente: [http://localhost:3000/resultado/MOCK1234](http://localhost:3000/resultado/MOCK1234)

Esto te mostrará un ejemplo completo sin necesidad de completar el test.

## 🎨 Colores del CUBO

| Valor | Color | Significado |
|-------|-------|-------------|
| 1 | 🔴 Rojo | Nivel bajo |
| 2 | 🟠 Naranja | Nivel medio-bajo |
| 3 | 🟡 Amarillo | Nivel medio-alto |
| 4 | 🟢 Verde | Nivel alto |

## 📁 Archivos Clave para Personalizar

### Cambiar Colores
📄 `lib/constants.ts` → `VALUE_COLORS`

### Cambiar Nombres de Áreas
📄 `lib/constants.ts` → `AREA_NAMES`

### Cambiar Etiquetas de Preguntas
📄 `lib/constants.ts` → `QUESTION_LABELS`

### Cambiar Textos de la UI
- 📄 `app/page.tsx` - Página de inicio
- 📄 `app/test/page.tsx` - Página del test
- 📄 `app/resultado/[code]/page.tsx` - Página de resultados

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Compilar
npm run build

# Producción
npm start

# Linter
npm run lint
```

## 💡 Tips

1. **localStorage**: Los datos se guardan en el navegador. Abre DevTools → Application → Local Storage → `tnc-submissions`

2. **sessionStorage**: El código de grupo se guarda temporalmente. Si recargas `/test` sin código, te redirige al inicio.

3. **Códigos únicos**: Cada vez que guardas, se genera un código aleatorio de 8 caracteres.

4. **Preguntas sin responder**: Se asigna automáticamente el valor 1 (rojo).

5. **Vista 3D**: Requiere WebGL. Si tu navegador no lo soporta, se mostrará automáticamente la vista 2D.

6. **Controles 3D**:
   - Arrastra con el mouse para rotar el cubo
   - Usa la rueda del mouse para hacer zoom
   - Pasa el mouse sobre las caras para ver el nombre del área

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Errores de TypeScript
```bash
# Verifica que todas las dependencias estén instaladas
npm install
```

### La página está en blanco
- Abre la consola del navegador (F12)
- Verifica que no haya errores en la consola
- Asegúrate de que el servidor esté corriendo en el puerto 3000

## 📚 Más Información

Lee el [README.md](./README.md) completo para:
- Estructura detallada del proyecto
- Cómo conectar con un backend
- Documentación de componentes
- Próximos pasos y mejoras

---

**¡Listo para empezar!** 🎉

