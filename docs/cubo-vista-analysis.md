# Análisis Completo del Diseño Figma - Vista Cubo Integrate

## Canvas Principal
- **Nombre:** Desktop - 1
- **Dimensiones:** 1440px × 1033px (ajustado con offset y=-9)
- **Fondo:** Blanco (r=1, g=1, b=1, a=1)

## Estructura de Capas (Orden Z-Index)

### 1. FONDO (Z-Index: 0)
**ID:** 1:21 - "Fons"
- **Tipo:** RECTANGLE con IMAGE fill
- **Posición:** x=0, y=-12
- **Dimensiones:** 1440px × 1035px
- **Imagen:** imageRef `7f468f7b8341e70652c4cd138b279ce46a17d369`
- **URL:** https://s3-alpha-sig.figma.com/img/7f46/8f7b/8341e70652c4cd138b279ce46a17d369...
- **scaleMode:** STRETCH

### 2. VECTOR DECORATIVO SUPERIOR (Z-Index: 1)
**ID:** 1:27 - "Vector"
- **Tipo:** VECTOR con gradiente
- **Posición:** x=647.2, y=43
- **Dimensiones:** 739px × 303px
- **Fill:** Gradiente lineal blanco con transparencia
  - Color 1: rgba(255, 255, 255, 0.15) @ position 0
  - Color 2: rgba(255, 255, 255, 0.05) @ position 1
- **Stroke:** Gradiente lineal blanco
  - Color 1: rgba(255, 255, 255, 0.8) @ position 0
  - Color 2: rgba(255, 255, 255, 0.3) @ position 1
- **strokeWeight:** 0.5px

### 3. GRUPO PRINCIPAL DEL CUBO (Z-Index: 2)
**ID:** 1:213 - "Group 1"
- **Posición:** x=234.9, y=296.9
- **Dimensiones:** 522.66px × 620.6px

#### 3.1. Vector Gradiente Rosa (Fondo del cubo)
**ID:** 1:169
- **Posición:** x=234.9, y=452.04
- **Dimensiones:** 261.29px × 465.45px
- **Fill:** Gradiente lineal complejo (naranja a transparente)
  - Múltiples stops desde rgba(255,255,255,0.2) hasta rgba(240,135,38,1)

#### 3.2. Vector Gradiente Púrpura (Lado del cubo)
**ID:** 1:170
- **Posición:** x=497.19, y=452.04
- **Dimensiones:** 261.46px × 465.45px
- **Fill:** Gradiente lineal (blanco a púrpura)
  - Desde rgba(255,255,255,0.5) hasta rgba(65,39,97,1)

#### 3.3. Vector Principal con Stroke (Contorno del cubo)
**ID:** 1:173
- **Posición:** x=234.9, y=296.89
- **Dimensiones:** 522.66px × 310.3px
- **Fill:** Gradiente lineal (blanco a rosa)
- **Stroke:** Gradiente lineal blanco
  - rgba(255,255,255,0.6) a rgba(255,255,255,0.2)
- **strokeWeight:** 1px

#### 3.4. Imagen QR Code (Centro)
**ID:** 1:181 - "Rectangle"
- **Posición:** x=471, y=524
- **Dimensiones:** 199px × 153px
- **Imagen:** imageRef `30056766a22db22247e72463826e9e09c5fffac5`
- **URL:** https://s3-alpha-sig.figma.com/img/3005/6766/a22db22247e72463826e9e09c5fffac5...

#### 3.5. Imagen Decorativa 2 (Izquierda media)
**ID:** 1:175 - "Rectangle"
- **Posición:** x=249.85, y=490.06
- **Dimensiones:** 112.68px × 83.32px
- **Imagen:** imageRef `bafb5d4025577f2ac2fbeef66edda86172c34926`
- **URL:** https://s3-alpha-sig.figma.com/img/bafb/5d40/25577f2ac2fbeef66edda86172c34926...

#### 3.6. Imagen Decorativa 1 (Izquierda superior)
**ID:** 1:177 - "Rectangle"
- **Posición:** x=242.81, y=381.81
- **Dimensiones:** 178.69px × 102.75px
- **Imagen:** imageRef `1ecb5c4b2d424a1c36b971d51abeca5d5b33854a`
- **URL:** https://s3-alpha-sig.figma.com/img/1ecb/5c4b/2d424a1c36b971d51abeca5d5b33854a...

### 4. TEXTOS PRINCIPALES

#### 4.1. Título Principal
**ID:** 1:122 - "MAPA DE SITUACIÓN DE LAS 6 ÁREAS DE LA ORGANIZACIÓN"
- **Posición:** x=47, y=37
- **Font:** Poppins Regular, 16px
- **Color:** rgba(255, 255, 255, 1)

#### 4.2. Texto "EQUIPO"
**ID:** 1:162
- **Posición:** x=71, y=129
- **Font:** Poppins Regular, 12px
- **Color:** rgba(255, 255, 255, 1)

#### 4.3. Indicador "Eficacia"
**ID:** 1:135
- **Posición:** x=1247, y=199
- **Font:** Poppins Regular, 11px
- **Color:** rgba(255, 255, 255, 1)

### 5. LEYENDA LATERAL IZQUIERDA (Z-Index: 5)

#### 5.1. "EJEMPLAR 100%"
**ID:** 1:197
- **Posición:** x=83.83, y=646.19
- **Font:** Poppins SemiBold (600), 12px
- **Color:** rgba(255, 255, 255, 1)
- **Círculo:** Gradiente rosa
  - rgba(217,29,92,0.2) a rgba(217,29,92,1)

#### 5.2. "SÓLIDO 75%"
**ID:** 1:198
- **Posición:** x=83, y=680
- **Font:** Poppins SemiBold (600), 12px
- **Color:** rgba(255, 255, 255, 1)
- **Círculo:** Gradiente naranja
  - rgba(240,135,38,0.5) a rgba(240,135,38,1)

#### 5.3. "DESARROLLO 50%"
**ID:** 1:200
- **Posición:** x=83, y=715
- **Font:** Poppins SemiBold (600), 12px
- **Color:** rgba(255, 255, 255, 1)
- **Círculo:** Gradiente púrpura
  - rgba(44,36,142,0.5) a rgba(44,36,142,1)

#### 5.4. "CRÍTICO 25%"
**ID:** 1:201
- **Posición:** x=83, y=747
- **Font:** Poppins SemiBold (600), 12px
- **Color:** rgba(255, 255, 255, 1)
- **Círculo:** Gradiente púrpura oscuro
  - rgba(65,39,97,0.5) a rgba(65,39,97,1)

### 6. SECCIÓN DERECHA - VISTA GENERAL Y SUB ÁREAS

#### 6.1. Frame "Vista General"
**ID:** 1:29
- **Posición:** x=670, y=72
- **Dimensiones:** 341px × 255px
- **Contiene:** Cubo 3D con gradientes y líneas de grid

#### 6.2. Textos de Áreas (Derecha)
- **PERSONAS** (x=1290, y=384)
- **RECURSOS** (x=1289, y=415)
- **ESTRATEGIA** (x=1282, y=446)
- **EFICACIA** (x=1298, y=478)
- **ESTRUCTURA** (x=1276, y=510)
- **ORIENTACIÓN A RESULTADOS** (x=1184, y=541)

## Colores Principales

### Gradientes Rosa/Naranja
- **Rosa claro:** rgba(217, 29, 92, 0.2)
- **Rosa intenso:** rgba(217, 29, 92, 1) - #D91D5C
- **Naranja:** rgba(240, 135, 38, 1) - #F08726

### Gradientes Púrpura
- **Púrpura:** rgba(44, 36, 142, 1) - #2C248E
- **Púrpura oscuro:** rgba(65, 39, 97, 1) - #412761

### Blancos con Transparencia
- **Blanco 80%:** rgba(255, 255, 255, 0.8)
- **Blanco 60%:** rgba(255, 255, 255, 0.6)
- **Blanco 20%:** rgba(255, 255, 255, 0.2)

## Notas de Implementación

1. **Responsive:** El diseño debe escalar proporcionalmente desde 1440px
2. **Orden de renderizado:** Seguir el orden de capas del JSON
3. **Gradientes:** Usar especificaciones exactas de gradientStops
4. **Imágenes:** Usar URLs de Figma con configuración en next.config.ts
5. **Tipografía:** Poppins con pesos 400 (Regular) y 600 (SemiBold)

