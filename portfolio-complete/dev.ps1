# dev.ps1 — starts the Next.js dev server, resolving Node 22 automatically
# Run from the Kiro terminal: .\dev.ps1
# Or via npm:                 npm run dev:win

$ErrorActionPreference = "Stop"

# ── 1. Find a working node.exe / npm.cmd ─────────────────────────────────────
function Get-RegStr($hive, $key, $name) {
    try { return (Get-ItemProperty "${hive}:\$key" -ErrorAction Stop).$name }
    catch { return $null }
}

$sysEnvKey = "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"

# Collect candidate bin directories in priority order
$symlink    = Get-RegStr "HKLM" $sysEnvKey "NVM_SYMLINK"   # e.g. C:\nvm4w\nodejs
$nvmHome    = Get-RegStr "HKLM" $sysEnvKey "NVM_HOME"      # e.g. C:\Users\Admin\AppData\Local\nvm
if (-not $nvmHome) { $nvmHome = $env:NVM_HOME }

$candidates = [System.Collections.Generic.List[string]]@()

# Highest priority: the nvm active symlink (system-wide, set by `nvm use`)
if ($symlink) { $candidates.Add($symlink) }

# Next: scan nvm folder for v22.* sub-dirs (may be access-denied, caught below)
if ($nvmHome) {
    try {
        $dirs = Get-ChildItem -Path $nvmHome -Directory -Filter "v22.*" -ErrorAction Stop |
                Sort-Object Name -Descending
        foreach ($d in $dirs) { $candidates.Add($d.FullName) }
    } catch { <# access denied — skip #> }
}

# Standard Node.js installer path
$candidates.Add("C:\Program Files\nodejs")

# Common per-user nvm locations for the current user
foreach ($base in @("$env:LOCALAPPDATA\nvm", "$env:APPDATA\nvm")) {
    if ($base) {
        try {
            $dirs = Get-ChildItem -Path $base -Directory -Filter "v22.*" -ErrorAction Stop |
                    Sort-Object Name -Descending
            foreach ($d in $dirs) { $candidates.Add($d.FullName) }
        } catch { <# skip #> }
    }
}

# ── 2. Pick the first candidate where node.exe actually resolves ──────────────
$nodeBin = $null
foreach ($c in $candidates) {
    if (-not $c) { continue }
    try {
        if (Test-Path "$c\node.exe" -ErrorAction Stop) {
            # Quick version check — must be Node 22
            $ver = & "$c\node.exe" --version 2>&1
            if ($ver -match "^v22\.") { $nodeBin = $c; break }
            # If the symlink points to a different version, keep looking
        }
    } catch { <# access denied or not found — try next #> }
}

if (-not $nodeBin) {
    Write-Host ""
    Write-Host "  ERROR: Node 22 is not accessible to the current user." -ForegroundColor Red
    Write-Host ""
    Write-Host "  The nvm installation belongs to a different Windows account (Admin)." -ForegroundColor Yellow
    Write-Host "  To fix this, do ONE of the following:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Option A — Install Node.js 22 directly for this user account:" -ForegroundColor Cyan
    Write-Host "    1. Download the installer from https://nodejs.org/en/download" -ForegroundColor White
    Write-Host "    2. Choose the LTS or Current 22.x Windows installer" -ForegroundColor White
    Write-Host "    3. Install with default settings (adds to PATH for all users)" -ForegroundColor White
    Write-Host "    4. Open a new terminal and run:  .\dev.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "  Option B — Run as Admin (uses existing nvm installation):" -ForegroundColor Cyan
    Write-Host "    1. Search 'cmd' in Start Menu → Right-click → Run as Administrator" -ForegroundColor White
    Write-Host "    2. cd `"$PSScriptRoot`"" -ForegroundColor White
    Write-Host "    3. nvm use 22 && npm run dev" -ForegroundColor White
    Write-Host ""
    exit 1
}

# ── 3. Inject the resolved node bin into PATH for this process ────────────────
$env:PATH = "$nodeBin;$env:PATH"
$nodePath  = "$nodeBin\node.exe"
$npmPath   = "$nodeBin\npm.cmd"
$nodeVer   = & "$nodePath" --version 2>&1
$npmVer    = & "$npmPath"  --version 2>&1

Write-Host ""
Write-Host "  node $nodeVer   ($nodeBin)" -ForegroundColor Green
Write-Host "  npm  v$npmVer" -ForegroundColor Green
Write-Host ""

# ── 4. Move to project root ───────────────────────────────────────────────────
Set-Location $PSScriptRoot

# ── 5. Install dependencies if node_modules is missing ───────────────────────
if (-not (Test-Path "$PSScriptRoot\node_modules")) {
    Write-Host "  node_modules not found — running npm install ..." -ForegroundColor Yellow
    & "$npmPath" install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  npm install failed." -ForegroundColor Red; exit 1
    }
    Write-Host ""
}

# ── 6. Start the dev server ───────────────────────────────────────────────────
Write-Host "  Starting Next.js dev server ..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  Public site:  http://localhost:3000"       -ForegroundColor White
Write-Host "  Admin panel:  http://localhost:3000/admin/login" -ForegroundColor White
Write-Host ""
Write-Host "  Admin credentials (local mode, no Supabase required):" -ForegroundColor White
Write-Host "    Email:    admin@portfolio.local"  -ForegroundColor DarkCyan
Write-Host "    Password: Admin@1234"             -ForegroundColor DarkCyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop."  -ForegroundColor DarkGray
Write-Host ""

& "$npmPath" run dev
