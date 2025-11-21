# Script para verificar que los tags de Docker existen en Docker Hub (PowerShell)
# Uso: .\docker-verify-tags.ps1 [version]
# Ejemplo: .\docker-verify-tags.ps1 2.0.0

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
Write-ColorOutput "  INTEGRATE 2.0 - Verificación de Tags" "Blue"
Write-ColorOutput "========================================" "Blue"
Write-Host ""
Write-ColorOutput "Versión a verificar: v$Version" "Green"
Write-ColorOutput "Imagen: $FullImageName" "Green"
Write-Host ""

# Verificación 1: Tags locales
Write-ColorOutput "[1/4] Verificando tags locales..." "Blue"
Write-Host ""

$LocalImages = docker images $FullImageName --format "{{.Tag}}" 2>$null

if ([string]::IsNullOrEmpty($LocalImages)) {
    Write-ColorOutput "⚠️  No se encontraron imágenes locales" "Yellow"
    Write-ColorOutput "    Esto es normal si no has hecho build localmente" "Yellow"
} else {
    Write-ColorOutput "✓ Imágenes locales encontradas:" "Green"
    docker images $FullImageName --format "table {{.Repository}}`t{{.Tag}}`t{{.ID}}`t{{.Size}}"
    Write-Host ""
    
    # Verificar si los tags específicos existen localmente
    if ($LocalImages -match "v$Version") {
        Write-ColorOutput "✓ Tag v$Version existe localmente" "Green"
    } else {
        Write-ColorOutput "⚠️  Tag v$Version NO existe localmente" "Yellow"
    }
    
    if ($LocalImages -match "latest") {
        Write-ColorOutput "✓ Tag latest existe localmente" "Green"
    } else {
        Write-ColorOutput "⚠️  Tag latest NO existe localmente" "Yellow"
    }
}

Write-Host ""

# Verificación 2: Pull del tag versionado
Write-ColorOutput "[2/4] Verificando tag v$Version en Docker Hub..." "Blue"
Write-Host ""

$TagVersionExists = $false
try {
    docker pull "${FullImageName}:v$Version" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✓ Tag v$Version existe en Docker Hub y se puede descargar" "Green"
        $TagVersionExists = $true
    } else {
        Write-ColorOutput "✗ Tag v$Version NO existe en Docker Hub o no se puede descargar" "Red"
    }
} catch {
    Write-ColorOutput "✗ Tag v$Version NO existe en Docker Hub o no se puede descargar" "Red"
}

Write-Host ""

# Verificación 3: Pull del tag latest
Write-ColorOutput "[3/4] Verificando tag latest en Docker Hub..." "Blue"
Write-Host ""

$TagLatestExists = $false
try {
    docker pull "${FullImageName}:latest" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✓ Tag latest existe en Docker Hub y se puede descargar" "Green"
        $TagLatestExists = $true
    } else {
        Write-ColorOutput "✗ Tag latest NO existe en Docker Hub o no se puede descargar" "Red"
    }
} catch {
    Write-ColorOutput "✗ Tag latest NO existe en Docker Hub o no se puede descargar" "Red"
}

Write-Host ""

# Verificación 4: Comparar Image IDs
Write-ColorOutput "[4/4] Comparando Image IDs..." "Blue"
Write-Host ""

if ($TagVersionExists -and $TagLatestExists) {
    $VersionID = (docker images "${FullImageName}:v$Version" --format "{{.ID}}" | Select-Object -First 1)
    $LatestID = (docker images "${FullImageName}:latest" --format "{{.ID}}" | Select-Object -First 1)
    
    Write-ColorOutput "Image ID de v${Version}: $VersionID" "Green"
    Write-ColorOutput "Image ID de latest: $LatestID" "Green"
    Write-Host ""
    
    if ($VersionID -eq $LatestID) {
        Write-ColorOutput "✓ Ambos tags apuntan a la misma imagen (correcto)" "Green"
    } else {
        Write-ColorOutput "⚠️  Los tags apuntan a imágenes diferentes" "Yellow"
        Write-ColorOutput "    Esto puede indicar que latest no se actualizó correctamente" "Yellow"
    }
} else {
    Write-ColorOutput "⚠️  No se pueden comparar Image IDs (uno o ambos tags no existen)" "Yellow"
}

Write-Host ""

# Resumen final
Write-ColorOutput "========================================" "Blue"
Write-ColorOutput "  Resumen de Verificación" "Blue"
Write-ColorOutput "========================================" "Blue"
Write-Host ""

if ($TagVersionExists -and $TagLatestExists) {
    Write-ColorOutput "✓ ÉXITO: Ambos tags existen y funcionan correctamente" "Green"
    Write-Host ""
    Write-ColorOutput "Puedes usar cualquiera de estos comandos:" "Green"
    Write-Host "  docker run -p 3000:3000 ${FullImageName}:v$Version"
    Write-Host "  docker run -p 3000:3000 ${FullImageName}:latest"
    Write-Host ""
    Write-ColorOutput "Nota: Si solo ves 'latest' en la UI de Docker Hub, es normal." "Blue"
    Write-Host "      Ambos tags existen y funcionan, solo que la UI puede mostrar uno."
    exit 0
} elseif ($TagVersionExists) {
    Write-ColorOutput "⚠️  ADVERTENCIA: Solo el tag v$Version existe" "Yellow"
    Write-Host ""
    Write-ColorOutput "Solución:" "Yellow"
    Write-Host "  1. Ejecuta: .\docker-build.ps1 $Version"
    Write-Host "  2. Verifica que el script complete sin errores"
    exit 1
} elseif ($TagLatestExists) {
    Write-ColorOutput "⚠️  ADVERTENCIA: Solo el tag latest existe" "Yellow"
    Write-Host ""
    Write-ColorOutput "Solución:" "Yellow"
    Write-Host "  1. Ejecuta: .\docker-build.ps1 $Version"
    Write-Host "  2. Verifica que el script complete sin errores"
    exit 1
} else {
    Write-ColorOutput "✗ ERROR: Ninguno de los tags existe en Docker Hub" "Red"
    Write-Host ""
    Write-ColorOutput "Solución:" "Red"
    Write-Host "  1. Verifica que estás autenticado: docker login"
    Write-Host "  2. Ejecuta: .\docker-build.ps1 $Version"
    Write-Host "  3. Verifica que el script complete sin errores"
    Write-Host "  4. Ejecuta este script nuevamente para verificar"
    exit 1
}

