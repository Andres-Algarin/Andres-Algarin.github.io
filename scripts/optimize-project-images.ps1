# Run from any directory. Originals must be JPEG screenshots, without resizing.
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$imageRoot = Join-Path $projectRoot 'public/projects/ferreinver'
$names = @('landing', 'proceso', 'tipos-invernaderos', 'productos-footer', 'contacto', 'ubicacion-footer', 'sobre-nosotros', 'objetivos', 'alcance-footer')
$missing = @($names | Where-Object { -not (Test-Path -LiteralPath (Join-Path $imageRoot "$_.jpeg")) })
if ($missing.Count -gt 0) {
    throw "Faltan las capturas originales JPEG: $($missing -join ', '). Consulta public/projects/ferreinver/README.md."
}
Add-Type -AssemblyName System.Drawing
$manifest = [ordered]@{}
Push-Location $projectRoot
try {
    foreach ($name in $names) {
        $source = Join-Path $imageRoot "$name.jpeg"
        $destination = Join-Path $imageRoot "$name.webp"
        # Lossless WebP, original dimensions, no visual transformations.
        # sharp-cli is cached locally and is not a project dependency.
        & npm exec --cache .npm-cache --yes --package sharp-cli -- sharp --input $source --output $destination --format webp --lossless --effort 6
        if ($LASTEXITCODE -ne 0) { throw "No se pudo optimizar $name" }
        $selected = "$name.webp"
        if ((Get-Item -LiteralPath $destination).Length -ge (Get-Item -LiteralPath $source).Length) {
            # Delete only the generated file at this explicit, checked destination.
            $resolvedRoot = [System.IO.Path]::GetFullPath($imageRoot) + [System.IO.Path]::DirectorySeparatorChar
            if (-not ([System.IO.Path]::GetFullPath($destination).StartsWith($resolvedRoot))) { throw 'Ruta de salida no valida' }
            Remove-Item -LiteralPath $destination
            $selected = "$name.jpeg"
        }
        $bitmap = [System.Drawing.Image]::FromFile($source)
        try {
            $manifest[$name] = @{ file = $selected; width = $bitmap.Width; height = $bitmap.Height }
        } finally { $bitmap.Dispose() }
    }
    $manifest | ConvertTo-Json -Depth 3 | Set-Content -Encoding utf8 (Join-Path $projectRoot 'src/data/project-images.json')
    Get-ChildItem -LiteralPath $imageRoot -File | Where-Object { $_.Extension -in @('.jpeg', '.webp') } | Select-Object Name, Length
} finally {
    Pop-Location
}


