#Requires -Version 5.1

<#!
Purpose: One-click setup for Stable Diffusion (AUTOMATIC1111 Web UI) on Windows
- Creates a base folder (D:\stable-diffusion by default, falls back to C:) 
- Checks/installs Git (via winget if available)
- Clones AUTOMATIC1111 repo if missing
- (Optional) Sets COMMANDLINE_ARGS for VRAM-saving defaults
- Launches webui-user.bat (first run downloads Python/requirements automatically)

Usage (PowerShell as Administrator recommended):
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  .\setup-a1111.ps1
#>

$ErrorActionPreference = 'Stop'

function Write-Section($msg) {
  Write-Host "`n=== $msg ===" -ForegroundColor Cyan
}

function Get-BasePath {
  if (Test-Path 'D:\') { return 'D:\stable-diffusion' }
  else { return (Join-Path $env:SystemDrive 'stable-diffusion') }
}

function New-FolderIfMissing($path) {
  if (-not (Test-Path $path)) { New-Item -ItemType Directory -Path $path | Out-Null }
}

function Install-GitIfNeeded {
  if (Get-Command git -ErrorAction SilentlyContinue) { return }
  Write-Section 'Git not found. Attempting to install via winget'
  $winget = Get-Command winget -ErrorAction SilentlyContinue
  if (-not $winget) {
    Write-Warning 'winget is not available. Please install Git manually: https://git-scm.com/download/win and re-run this script.'
    throw 'Git missing'
  }
  & winget install -e --id Git.Git --silent --accept-source-agreements --accept-package-agreements
}

function Invoke-CloneIfMissing($repoUrl, $destPath) {
  if (-not (Test-Path $destPath)) {
    Write-Section "Cloning: $repoUrl"
    git clone $repoUrl $destPath
  } else {
    Write-Host "Repo already exists at: $destPath" -ForegroundColor DarkGray
  }
}

function Set-WebuiArgsIfMissing($webuiBat) {
  # Adds VRAM-friendly defaults if COMMANDLINE_ARGS not present
  try {
    $content = Get-Content -Raw -Path $webuiBat
  } catch {
    return
  }
  if ($content -notmatch 'COMMANDLINE_ARGS=') {
    Add-Content -Path $webuiBat -Value "`r`nset COMMANDLINE_ARGS=--xformers --medvram"
    Write-Host 'Added COMMANDLINE_ARGS=--xformers --medvram' -ForegroundColor Green
  } else {
    Write-Host 'COMMANDLINE_ARGS already present. Skipping.' -ForegroundColor DarkGray
  }

  # Pin Torch to a currently available CUDA build (cu124) to avoid 2.1.2 resolution failures
  # You can change versions later if needed. Pairs typically: torch 2.7.1 <-> torchvision 0.22.0
  if ($content -notmatch 'TORCH_COMMAND=') {
    Add-Content -Path $webuiBat -Value "`r`nrem Pin Torch/TorchVision to cu124 wheels (update as needed)"
    Add-Content -Path $webuiBat -Value "set TORCH_COMMAND=pip install torch==2.7.1 torchvision==0.22.0 --index-url https://download.pytorch.org/whl/cu124"
    Write-Host 'Added TORCH_COMMAND to install torch==2.7.1 torchvision==0.22.0 (cu124)' -ForegroundColor Green
  } else {
    Write-Host 'TORCH_COMMAND already present. Skipping.' -ForegroundColor DarkGray
  }
}

try {
  Write-Section 'Stable Diffusion (A1111) setup started'
  $base = Get-BasePath
  New-FolderIfMissing $base
  Write-Host "Base path: $base"

  Install-GitIfNeeded

  $a1111Path = Join-Path $base 'stable-diffusion-webui'
  Invoke-CloneIfMissing 'https://github.com/AUTOMATIC1111/stable-diffusion-webui.git' $a1111Path

  $modelsPath = Join-Path $a1111Path 'models/Stable-diffusion'
  New-FolderIfMissing $modelsPath
  Write-Host "Model folder ready: $modelsPath" -ForegroundColor DarkGray
  Write-Host 'Place a checkpoint (e.g., v1-5-pruned-emaonly.safetensors) in this folder after first launch.' -ForegroundColor Yellow

  $webuiBat = Join-Path $a1111Path 'webui-user.bat'
  Set-WebuiArgsIfMissing $webuiBat

  Write-Section 'Launching AUTOMATIC1111 (first run may take 10+ minutes)'
  Start-Process -FilePath $webuiBat -WorkingDirectory $a1111Path
  Write-Host 'When the console shows Running on local URL, open http://127.0.0.1:7860 in your browser.' -ForegroundColor Green
}
catch {
  Write-Error $_
  exit 1
}
