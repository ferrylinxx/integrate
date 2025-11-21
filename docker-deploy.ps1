# Script para construir y subir imagen Docker a Docker Hub
# Uso: .\docker-deploy.ps1 [version]
# Ejemplo: .\docker-deploy.ps1 3.0.0

param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

# Configuración
$DockerUsername = "gabo9803"
$ImageName = "integrate"
$FullImageName = "$DockerUsername/$ImageName"

# Validar formato de versión (X.Y.Z)
if ($Version -notmatch '^\d+\.\d+\.\d+$') {
    Write-Host "Error: La versión debe seguir el formato semántico X.Y.Z" -ForegroundColor Red
    Write-Host "Ejemplo: 3.0.0, 3.1.0, 4.0.0" -ForegroundColor Yellow
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INTEGRATE - Docker Deploy Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Versión: $Version" -ForegroundColor Green
Write-Host "Imagen: $FullImageName" -ForegroundColor Green
Write-Host ""

# Confirmar antes de continuar
$confirmation = Read-Host "¿Deseas continuar con el build y push? (s/n)"
if ($confirmation -ne 's' -and $confirmation -ne 'S' -and $confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-Host "Deploy cancelado" -ForegroundColor Yellow
    exit 0
}

# Step 1: Build de la imagen con ambos tags
Write-Host ""
Write-Host "[1/3] Construyendo imagen Docker..." -ForegroundColor Cyan
Write-Host "Tags: $Version y latest" -ForegroundColor Gray

docker build -t "${FullImageName}:${Version}" -t "${FullImageName}:latest" .

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Error: Falló el build de Docker" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Build completado exitosamente" -ForegroundColor Green

# Step 2: Push del tag versionado
Write-Host ""
Write-Host "[2/3] Subiendo imagen con tag $Version..." -ForegroundColor Cyan

docker push "${FullImageName}:${Version}"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Error: Falló el push del tag $Version" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Tag $Version subido exitosamente" -ForegroundColor Green

# Step 3: Push del tag latest
Write-Host ""
Write-Host "[3/3] Subiendo imagen con tag latest..." -ForegroundColor Cyan

docker push "${FullImageName}:latest"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Error: Falló el push del tag latest" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Tag latest subido exitosamente" -ForegroundColor Green

# Resumen final
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ DEPLOY COMPLETADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Imágenes disponibles en Docker Hub:" -ForegroundColor Green
Write-Host "  • ${FullImageName}:${Version}" -ForegroundColor White
Write-Host "  • ${FullImageName}:latest" -ForegroundColor White
Write-Host ""
Write-Host "Para ejecutar la imagen:" -ForegroundColor Cyan
Write-Host "  docker run -p 3000:3000 ${FullImageName}:${Version}" -ForegroundColor White
Write-Host "  docker run -p 3000:3000 ${FullImageName}:latest" -ForegroundColor White
Write-Host ""
Write-Host "URL de Docker Hub:" -ForegroundColor Cyan
Write-Host "  https://hub.docker.com/r/${FullImageName}" -ForegroundColor White
Write-Host ""

