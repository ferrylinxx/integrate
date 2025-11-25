# Script para actualizar la versión de INTEGRATE
# Uso: .\update-version.ps1 4.1.0 "Nueva característica 1" "Mejora 2" "Fix 3"

param(
    [Parameter(Mandatory=$true)]
    [string]$Version,
    
    [Parameter(Mandatory=$false)]
    [string[]]$Features = @()
)

# Validar formato de versión
if ($Version -notmatch '^\d+\.\d+\.\d+$') {
    Write-Host "❌ Error: La versión debe seguir el formato X.Y.Z" -ForegroundColor Red
    Write-Host "   Ejemplo: 4.1.0" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🚀 Actualizando INTEGRATE a versión $Version" -ForegroundColor Cyan
Write-Host ""

# Fecha actual
$Date = Get-Date -Format "yyyy-MM-dd"

# 1. Actualizar lib/version.ts
Write-Host "[1/4] Actualizando lib/version.ts..." -ForegroundColor Blue
$versionFile = "lib/version.ts"
$content = Get-Content $versionFile -Raw
$content = $content -replace 'export const APP_VERSION = ".*";', "export const APP_VERSION = `"$Version`";"
$content = $content -replace 'export const APP_VERSION_LABEL = ".*";', "export const APP_VERSION_LABEL = `"v$Version`";"
Set-Content $versionFile $content -NoNewline
Write-Host "   ✓ lib/version.ts actualizado" -ForegroundColor Green

# 2. Actualizar Dockerfile
Write-Host "[2/4] Actualizando Dockerfile..." -ForegroundColor Blue
$dockerFile = "Dockerfile"
$content = Get-Content $dockerFile -Raw
$content = $content -replace '# Versión: .*', "# Versión: $Version"
Set-Content $dockerFile $content -NoNewline
Write-Host "   ✓ Dockerfile actualizado" -ForegroundColor Green

# 3. Actualizar public/version.json
Write-Host "[3/4] Actualizando public/version.json..." -ForegroundColor Blue

# Crear array de features
$featuresJson = @()
if ($Features.Count -gt 0) {
    $featuresJson = $Features
} else {
    $featuresJson = @(
        "Mejoras de rendimiento",
        "Correcciones de bugs",
        "Actualizaciones de seguridad"
    )
}

$versionJson = @{
    version = $Version
    releaseDate = $Date
    releaseNotes = @{
        es = @{
            title = "Nueva versión disponible (v$Version)"
            message = "Actualitza per a les darreres característiques i millores."
            features = $featuresJson
        }
    }
    minVersion = $Version
    updateUrl = "https://github.com/ferrylinxx/integrate/releases/latest"
} | ConvertTo-Json -Depth 10

Set-Content "public/version.json" $versionJson
Write-Host "   ✓ public/version.json actualizado" -ForegroundColor Green

# 4. Mostrar resumen
Write-Host "[4/4] Resumen de cambios:" -ForegroundColor Blue
Write-Host ""
Write-Host "   📦 Versión: $Version" -ForegroundColor White
Write-Host "   📅 Fecha: $Date" -ForegroundColor White
Write-Host "   📝 Características:" -ForegroundColor White
foreach ($feature in $featuresJson) {
    Write-Host "      • $feature" -ForegroundColor Gray
}
Write-Host ""

# Preguntar si hacer commit
Write-Host "¿Deseas hacer commit de estos cambios? (s/n): " -NoNewline -ForegroundColor Yellow
$response = Read-Host

if ($response -eq 's' -or $response -eq 'S' -or $response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "📝 Haciendo commit..." -ForegroundColor Blue
    
    git add lib/version.ts Dockerfile public/version.json
    git commit -m "chore: bump version to $Version"
    
    Write-Host "   ✓ Commit realizado" -ForegroundColor Green
    Write-Host ""
    
    # Preguntar si hacer push
    Write-Host "¿Deseas hacer push a GitHub? (s/n): " -NoNewline -ForegroundColor Yellow
    $pushResponse = Read-Host
    
    if ($pushResponse -eq 's' -or $pushResponse -eq 'S' -or $pushResponse -eq 'y' -or $pushResponse -eq 'Y') {
        Write-Host ""
        Write-Host "🚀 Haciendo push..." -ForegroundColor Blue
        git push origin main
        Write-Host "   ✓ Push realizado" -ForegroundColor Green
        Write-Host ""
        
        # Preguntar si hacer build de Docker
        Write-Host "¿Deseas hacer build y push de Docker? (s/n): " -NoNewline -ForegroundColor Yellow
        $dockerResponse = Read-Host
        
        if ($dockerResponse -eq 's' -or $dockerResponse -eq 'S' -or $dockerResponse -eq 'y' -or $dockerResponse -eq 'Y') {
            Write-Host ""
            Write-Host "🐳 Ejecutando docker-deploy.ps1..." -ForegroundColor Blue
            & .\docker-deploy.ps1 $Version
        }
    }
}

Write-Host ""
Write-Host "✅ ¡Actualización completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Verifica los cambios en GitHub" -ForegroundColor White
Write-Host "   2. Los usuarios verán la notificación automáticamente" -ForegroundColor White
Write-Host "   3. La notificación aparecerá en ~30 minutos o al recargar" -ForegroundColor White
Write-Host ""

