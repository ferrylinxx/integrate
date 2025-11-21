#!/bin/bash

# Script para verificar que los tags de Docker existen en Docker Hub
# Uso: ./docker-verify-tags.sh [version]
# Ejemplo: ./docker-verify-tags.sh 2.0.0

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
DOCKER_USERNAME="gabo9803"
IMAGE_NAME="integrate-cubo-test"
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}"

# Función para mostrar uso
show_usage() {
    echo -e "${BLUE}Uso:${NC}"
    echo "  ./docker-verify-tags.sh [version]"
    echo ""
    echo -e "${BLUE}Ejemplos:${NC}"
    echo "  ./docker-verify-tags.sh 2.0.0    # Verificar versión 2.0.0"
    echo "  ./docker-verify-tags.sh 2.1.0    # Verificar versión 2.1.0"
    echo ""
    echo -e "${BLUE}Nota:${NC} La versión debe seguir el formato semántico: X.Y.Z"
}

# Validar argumentos
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Debes especificar una versión${NC}"
    show_usage
    exit 1
fi

VERSION=$1

# Validar formato de versión (X.Y.Z)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}Error: La versión debe seguir el formato semántico X.Y.Z${NC}"
    echo -e "${YELLOW}Ejemplo: 2.0.0, 2.1.0, 3.0.0${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  INTEGRATE 2.0 - Verificación de Tags${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Versión a verificar:${NC} v${VERSION}"
echo -e "${GREEN}Imagen:${NC} ${FULL_IMAGE_NAME}"
echo ""

# Verificación 1: Tags locales
echo -e "${BLUE}[1/4] Verificando tags locales...${NC}"
echo ""

LOCAL_IMAGES=$(docker images ${FULL_IMAGE_NAME} --format "{{.Tag}}" 2>/dev/null)

if [ -z "$LOCAL_IMAGES" ]; then
    echo -e "${YELLOW}⚠️  No se encontraron imágenes locales${NC}"
    echo -e "${YELLOW}    Esto es normal si no has hecho build localmente${NC}"
else
    echo -e "${GREEN}✓ Imágenes locales encontradas:${NC}"
    docker images ${FULL_IMAGE_NAME} --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}"
    echo ""
    
    # Verificar si los tags específicos existen localmente
    if echo "$LOCAL_IMAGES" | grep -q "v${VERSION}"; then
        echo -e "${GREEN}✓ Tag v${VERSION} existe localmente${NC}"
    else
        echo -e "${YELLOW}⚠️  Tag v${VERSION} NO existe localmente${NC}"
    fi
    
    if echo "$LOCAL_IMAGES" | grep -q "latest"; then
        echo -e "${GREEN}✓ Tag latest existe localmente${NC}"
    else
        echo -e "${YELLOW}⚠️  Tag latest NO existe localmente${NC}"
    fi
fi

echo ""

# Verificación 2: Pull del tag versionado
echo -e "${BLUE}[2/4] Verificando tag v${VERSION} en Docker Hub...${NC}"
echo ""

if docker pull ${FULL_IMAGE_NAME}:v${VERSION} >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Tag v${VERSION} existe en Docker Hub y se puede descargar${NC}"
    TAG_VERSION_EXISTS=true
else
    echo -e "${RED}✗ Tag v${VERSION} NO existe en Docker Hub o no se puede descargar${NC}"
    TAG_VERSION_EXISTS=false
fi

echo ""

# Verificación 3: Pull del tag latest
echo -e "${BLUE}[3/4] Verificando tag latest en Docker Hub...${NC}"
echo ""

if docker pull ${FULL_IMAGE_NAME}:latest >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Tag latest existe en Docker Hub y se puede descargar${NC}"
    TAG_LATEST_EXISTS=true
else
    echo -e "${RED}✗ Tag latest NO existe en Docker Hub o no se puede descargar${NC}"
    TAG_LATEST_EXISTS=false
fi

echo ""

# Verificación 4: Comparar Image IDs
echo -e "${BLUE}[4/4] Comparando Image IDs...${NC}"
echo ""

if [ "$TAG_VERSION_EXISTS" = true ] && [ "$TAG_LATEST_EXISTS" = true ]; then
    VERSION_ID=$(docker images ${FULL_IMAGE_NAME}:v${VERSION} --format "{{.ID}}" | head -n 1)
    LATEST_ID=$(docker images ${FULL_IMAGE_NAME}:latest --format "{{.ID}}" | head -n 1)
    
    echo -e "${GREEN}Image ID de v${VERSION}:${NC} ${VERSION_ID}"
    echo -e "${GREEN}Image ID de latest:${NC} ${LATEST_ID}"
    echo ""
    
    if [ "$VERSION_ID" = "$LATEST_ID" ]; then
        echo -e "${GREEN}✓ Ambos tags apuntan a la misma imagen (correcto)${NC}"
    else
        echo -e "${YELLOW}⚠️  Los tags apuntan a imágenes diferentes${NC}"
        echo -e "${YELLOW}    Esto puede indicar que latest no se actualizó correctamente${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No se pueden comparar Image IDs (uno o ambos tags no existen)${NC}"
fi

echo ""

# Resumen final
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Resumen de Verificación${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ "$TAG_VERSION_EXISTS" = true ] && [ "$TAG_LATEST_EXISTS" = true ]; then
    echo -e "${GREEN}✓ ÉXITO: Ambos tags existen y funcionan correctamente${NC}"
    echo ""
    echo -e "${GREEN}Puedes usar cualquiera de estos comandos:${NC}"
    echo "  docker run -p 3000:3000 ${FULL_IMAGE_NAME}:v${VERSION}"
    echo "  docker run -p 3000:3000 ${FULL_IMAGE_NAME}:latest"
    echo ""
    echo -e "${BLUE}Nota:${NC} Si solo ves 'latest' en la UI de Docker Hub, es normal."
    echo "      Ambos tags existen y funcionan, solo que la UI puede mostrar uno."
    exit 0
elif [ "$TAG_VERSION_EXISTS" = true ]; then
    echo -e "${YELLOW}⚠️  ADVERTENCIA: Solo el tag v${VERSION} existe${NC}"
    echo ""
    echo -e "${YELLOW}Solución:${NC}"
    echo "  1. Ejecuta: ./docker-build.sh ${VERSION}"
    echo "  2. Verifica que el script complete sin errores"
    exit 1
elif [ "$TAG_LATEST_EXISTS" = true ]; then
    echo -e "${YELLOW}⚠️  ADVERTENCIA: Solo el tag latest existe${NC}"
    echo ""
    echo -e "${YELLOW}Solución:${NC}"
    echo "  1. Ejecuta: ./docker-build.sh ${VERSION}"
    echo "  2. Verifica que el script complete sin errores"
    exit 1
else
    echo -e "${RED}✗ ERROR: Ninguno de los tags existe en Docker Hub${NC}"
    echo ""
    echo -e "${RED}Solución:${NC}"
    echo "  1. Verifica que estás autenticado: docker login"
    echo "  2. Ejecuta: ./docker-build.sh ${VERSION}"
    echo "  3. Verifica que el script complete sin errores"
    echo "  4. Ejecuta este script nuevamente para verificar"
    exit 1
fi

