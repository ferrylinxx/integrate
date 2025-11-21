# Script para verificar que los tags de Docker existen en Docker Hub
# Uso: .\docker-verify.ps1 [version]
# Ejemplo: .\docker-verify.ps1 3.0.0

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
Write-Host "  INTEGRATE - Verificación de Tags" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Versión a verificar: $Version" -ForegroundColor Green
Write-Host "Imagen: $FullImageName" -ForegroundColor Green
Write-Host ""

# Verificación 1: Tags locales
Write-Host "[1/3] Verificando tags locales..." -ForegroundColor Cyan
Write-Host ""

$LocalImages = docker images $FullImageName --format "{{.Tag}}" 2>$null

if ([string]::IsNullOrEmpty($LocalImages)) {
    Write-Host "⚠️  No se encontraron imágenes locales" -ForegroundColor Yellow
} else {
    Write-Host "✓ Imágenes locales encontradas:" -ForegroundColor Green
    docker images $FullImageName --format "table {{.Repository}}`t{{.Tag}}`t{{.ID}}`t{{.Size}}"
    Write-Host ""
}

# Verificación 2: Pull del tag versionado
Write-Host "[2/3] Verificando tag $Version en Docker Hub..." -ForegroundColor Cyan
Write-Host ""

$TagVersionExists = $false
try {
    docker pull "${FullImageName}:${Version}" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Tag $Version existe en Docker Hub" -ForegroundColor Green
        $TagVersionExists = $true
    } else {
        Write-Host "✗ Tag $Version NO existe en Docker Hub" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Tag $Version NO existe en Docker Hub" -ForegroundColor Red
}

Write-Host ""

# Verificación 3: Pull del tag latest
Write-Host "[3/3] Verificando tag latest en Docker Hub..." -ForegroundColor Cyan
Write-Host ""

$TagLatestExists = $false
try {
    docker pull "${FullImageName}:latest" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Tag latest existe en Docker Hub" -ForegroundColor Green
        $TagLatestExists = $true
    } else {
        Write-Host "✗ Tag latest NO existe en Docker Hub" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Tag latest NO existe en Docker Hub" -ForegroundColor Red
}

Write-Host ""

# Resumen final
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Resumen de Verificación" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($TagVersionExists -and $TagLatestExists) {
    Write-Host "✓ ÉXITO: Ambos tags existen en Docker Hub" -ForegroundColor Green
    Write-Host ""
    Write-Host "Puedes usar cualquiera de estos comandos:" -ForegroundColor Green
    Write-Host "  docker run -p 3000:3000 ${FullImageName}:${Version}" -ForegroundColor White
    Write-Host "  docker run -p 3000:3000 ${FullImageName}:latest" -ForegroundColor White
    Write-Host ""
    Write-Host "URL de Docker Hub:" -ForegroundColor Cyan
    Write-Host "  https://hub.docker.com/r/${FullImageName}" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host "✗ ERROR: Faltan tags en Docker Hub" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solución:" -ForegroundColor Yellow
    Write-Host "  1. Ejecuta: .\docker-deploy.ps1 $Version" -ForegroundColor White
    Write-Host "  2. Verifica que el script complete sin errores" -ForegroundColor White
    Write-Host ""
    exit 1
}

