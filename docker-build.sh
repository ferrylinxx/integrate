#!/bin/bash

# Script para construir y subir imagen Docker con versionado
# Uso: ./docker-build.sh [version]
# Ejemplo: ./docker-build.sh 2.0.0

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
    echo "  ./docker-build.sh [version]"
    echo ""
    echo -e "${BLUE}Ejemplos:${NC}"
    echo "  ./docker-build.sh 2.0.0    # Build y push versión 2.0.0"
    echo "  ./docker-build.sh 2.1.0    # Build y push versión 2.1.0"
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
echo -e "${BLUE}  INTEGRATE 2.0 - Docker Build Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Versión:${NC} v${VERSION}"
echo -e "${GREEN}Imagen:${NC} ${FULL_IMAGE_NAME}"
echo ""

# Confirmar antes de continuar
read -p "¿Deseas continuar con el build? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo -e "${YELLOW}Build cancelado${NC}"
    exit 0
fi

# Step 1: Build de la imagen
echo ""
echo -e "${BLUE}[1/3] Construyendo imagen Docker...${NC}"
docker build -t ${FULL_IMAGE_NAME}:v${VERSION} -t ${FULL_IMAGE_NAME}:latest .

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Falló el build de Docker${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completado exitosamente${NC}"

# Step 2: Push de la versión específica
echo ""
echo -e "${BLUE}[2/3] Subiendo imagen con tag v${VERSION}...${NC}"
docker push ${FULL_IMAGE_NAME}:v${VERSION}

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Falló el push de la versión v${VERSION}${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Versión v${VERSION} subida exitosamente${NC}"

# Step 3: Push de latest
echo ""
echo -e "${BLUE}[3/3] Subiendo imagen con tag latest...${NC}"
docker push ${FULL_IMAGE_NAME}:latest

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Falló el push de latest${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Tag latest subido exitosamente${NC}"

# Resumen final
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Build y push completados exitosamente${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Imágenes disponibles en Docker Hub:${NC}"
echo "  • ${FULL_IMAGE_NAME}:v${VERSION}"
echo "  • ${FULL_IMAGE_NAME}:latest"
echo ""
echo -e "${BLUE}Para ejecutar la imagen:${NC}"
echo "  docker run -p 3000:3000 ${FULL_IMAGE_NAME}:v${VERSION}"
echo ""
echo -e "${BLUE}Para actualizar la versión en el archivo:${NC}"
echo "  Edita lib/version.ts y actualiza APP_VERSION a '${VERSION}'"
echo ""

