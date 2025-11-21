# Script para construir y subir imagen Docker con versionado (PowerShell)
# Uso: .\docker-build.ps1 [version]
# Ejemplo: .\docker-build.ps1 2.0.0

param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

# Configuración
$DockerUsername = "gabo9803"
$ImageName = "integrate-cubo-test"
$FullImageName = "$DockerUsername/$ImageName"

# Función para mostrar mensajes con colores
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Validar formato de versión (X.Y.Z)
if ($Version -notmatch '^\d+\.\d+\.\d+$') {
    Write-ColorOutput "Error: La versión debe seguir el formato semántico X.Y.Z" "Red"
    Write-ColorOutput "Ejemplo: 2.0.0, 2.1.0, 3.0.0" "Yellow"
    exit 1
}

Write-ColorOutput "========================================" "Blue"
Write-ColorOutput "  INTEGRATE 2.0 - Docker Build Script" "Blue"
Write-ColorOutput "========================================" "Blue"
Write-Host ""
Write-ColorOutput "Versión: $Version" "Green"
Write-ColorOutput "Imagen: $FullImageName" "Green"
Write-Host ""

# Confirmar antes de continuar
$confirmation = Read-Host "¿Deseas continuar con el build? (s/n)"
if ($confirmation -ne 's' -and $confirmation -ne 'S' -and $confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-ColorOutput "Build cancelado" "Yellow"
    exit 0
}

# Step 1: Build de la imagen
Write-Host ""
Write-ColorOutput "[1/3] Construyendo imagen Docker..." "Blue"
docker build -t "${FullImageName}:$Version" -t "${FullImageName}:latest" .

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Error: Falló el build de Docker" "Red"
    exit 1
}

Write-ColorOutput "✓ Build completado exitosamente" "Green"

# Step 2: Push de la versión específica
Write-Host ""
Write-ColorOutput "[2/3] Subiendo imagen con tag $Version..." "Blue"
docker push "${FullImageName}:$Version"

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Error: Falló el push de la versión $Version" "Red"
    exit 1
}

Write-ColorOutput "✓ Versión $Version subida exitosamente" "Green"

# Step 3: Push de latest
Write-Host ""
Write-ColorOutput "[3/3] Subiendo imagen con tag latest..." "Blue"
docker push "${FullImageName}:latest"

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Error: Falló el push de latest" "Red"
    exit 1
}

Write-ColorOutput "✓ Tag latest subido exitosamente" "Green"

# Resumen final
Write-Host ""
Write-ColorOutput "========================================" "Blue"
Write-ColorOutput "✓ Build y push completados exitosamente" "Green"
Write-ColorOutput "========================================" "Blue"
Write-Host ""
Write-ColorOutput "Imágenes disponibles en Docker Hub:" "Green"
Write-Host "  • ${FullImageName}:$Version"
Write-Host "  • ${FullImageName}:latest"
Write-Host ""
Write-ColorOutput "Para ejecutar la imagen:" "Blue"
Write-Host "  docker run -p 3000:3000 ${FullImageName}:$Version"
Write-Host ""
Write-ColorOutput "Para actualizar la versión en el archivo:" "Blue"
Write-Host "  Edita lib/version.ts y actualiza APP_VERSION a '$Version'"
Write-Host ""

