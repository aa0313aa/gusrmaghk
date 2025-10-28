#Requires -Version 5.1

<#!
Purpose: One-click setup for ComfyUI + Stable Video Diffusion (SVD) on Windows
- Creates base folder (D:\stable-diffusion by default)
- Checks/installs Git (via winget if available)
- Clones ComfyUI
- Installs ComfyUI-Manager (for easy node management)
- Prepares a default models\svd folder and opens SVD download page
- Launches ComfyUI

Usage (PowerShell as Administrator recommended):
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  .\setup-comfyui-svd.ps1
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

try {
  Write-Section 'ComfyUI + SVD setup started'
  $base = Get-BasePath
  New-FolderIfMissing $base
  Write-Host "Base path: $base"

  Install-GitIfNeeded

  $comfyPath = Join-Path $base 'ComfyUI'
  Invoke-CloneIfMissing 'https://github.com/comfyanonymous/ComfyUI.git' $comfyPath

  # Manager for easy node installs
  $customNodes = Join-Path $comfyPath 'custom_nodes'
  New-FolderIfMissing $customNodes
  $managerPath = Join-Path $customNodes 'ComfyUI-Manager'
  if (-not (Test-Path $managerPath)) {
    Write-Section 'Installing ComfyUI-Manager'
    git clone https://github.com/ltdrdata/ComfyUI-Manager $managerPath
  } else {
    Write-Host 'ComfyUI-Manager already present.' -ForegroundColor DarkGray
  }

  # Prepare SVD models folder (common convention used by several SVD nodes)
  $svdModels = Join-Path $comfyPath 'models/svd'
  New-FolderIfMissing $svdModels
  Write-Host "SVD model folder: $svdModels" -ForegroundColor DarkGray

  # Open SVD download page for user to fetch models
  Write-Section 'Opening SVD model download page (Hugging Face)'
  Start-Process 'https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt/tree/main'
  Write-Host 'Download svd_xt.safetensors and/or svd.safetensors, then place them into the models\\svd folder.' -ForegroundColor Yellow

  Write-Section 'Launching ComfyUI (first run compiles/installs)'
  $runBat = Join-Path $comfyPath 'run_nvidia_gpu.bat'
  Start-Process -FilePath $runBat -WorkingDirectory $comfyPath
  Write-Host 'When the console shows the URL, open http://127.0.0.1:8188 in your browser.' -ForegroundColor Green
}
catch {
  Write-Error $_
  exit 1
}
