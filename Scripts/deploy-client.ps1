[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[a-z0-9][a-z0-9-]*$')]
  [string]$Client,

  [switch]$Push
)

$ErrorActionPreference = 'Stop'

function Stop-Deployment([string]$Message) {
  throw "Deployment stopped: $Message"
}

function Resolve-Executable([string]$Name, [string[]]$Fallbacks) {
  $command = Get-Command $Name -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  foreach ($candidate in $Fallbacks) {
    if ($candidate -and (Test-Path -LiteralPath $candidate -PathType Leaf)) {
      return $candidate
    }
  }

  Stop-Deployment "required executable '$Name' was not found."
}

function Invoke-Checked([string]$Executable, [string[]]$Arguments, [string]$WorkingDirectory) {
  Write-Host "`n> $([IO.Path]::GetFileName($Executable)) $($Arguments -join ' ')" -ForegroundColor DarkGray
  Push-Location $WorkingDirectory
  try {
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) {
      Stop-Deployment "command failed with exit code $LASTEXITCODE."
    }
  }
  finally {
    Pop-Location
  }
}

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [IO.File]::WriteAllText($Path, $Content, $encoding)
}

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$appsScriptDir = Join-Path $root 'AppsScript'
$profileDir = Join-Path $root "deployments\$Client"
$profilePath = Join-Path $profileDir 'deployment.local.json'
$claspConfigPath = Join-Path $appsScriptDir '.clasp.json'

if (-not (Test-Path -LiteralPath $profilePath -PathType Leaf)) {
  Stop-Deployment "profile '$profilePath' does not exist. Copy deployment.example.json to deployment.local.json and fill it in."
}

try {
  $profile = Get-Content -LiteralPath $profilePath -Raw | ConvertFrom-Json
}
catch {
  Stop-Deployment "profile JSON is invalid: $($_.Exception.Message)"
}

if (-not $profile.clientName -or -not $profile.scriptId -or -not $profile.environment) {
  Stop-Deployment 'clientName, scriptId and environment are required.'
}
if ($profile.environment -ne 'production') {
  Stop-Deployment "environment must be 'production', got '$($profile.environment)'."
}
if ($profile.scriptId -match '^REPLACE_' -or $profile.scriptId.Length -lt 20) {
  Stop-Deployment 'replace the placeholder scriptId with the client Apps Script ID.'
}

$git = Resolve-Executable 'git.exe' @('C:\Program Files\Git\cmd\git.exe')
$node = Resolve-Executable 'node.exe' @()
$clasp = Resolve-Executable 'clasp.cmd' @(
  (Join-Path $env:APPDATA 'npm\clasp.cmd')
)

$gitStatus = & $git -C $root status --porcelain
if ($LASTEXITCODE -ne 0) {
  Stop-Deployment 'Git status could not be read.'
}
if ($gitStatus) {
  Write-Host $gitStatus
  Stop-Deployment 'the repository has uncommitted changes. Commit or stash them before a production push.'
}

Write-Host "`nSmartFlow production deployment" -ForegroundColor Cyan
Write-Host "Client:      $($profile.clientName)"
Write-Host "Profile:     $Client"
Write-Host "Environment: $($profile.environment)"
Write-Host "Script ID:   $($profile.scriptId)"
Write-Host 'Secrets:     Script Properties only (not read by this utility)'

Invoke-Checked $node @('Scripts/validate-project.mjs') $root
Invoke-Checked $node @('Scripts/run-tests.mjs') $root

$hadClaspConfig = Test-Path -LiteralPath $claspConfigPath -PathType Leaf
$previousClaspConfig = if ($hadClaspConfig) { Get-Content -LiteralPath $claspConfigPath -Raw } else { $null }
$temporaryClaspConfig = [ordered]@{
  scriptId = [string]$profile.scriptId
  rootDir = ''
  scriptExtensions = @('.js', '.gs')
  htmlExtensions = @('.html')
  jsonExtensions = @('.json')
  filePushOrder = @()
  skipSubdirectories = $false
} | ConvertTo-Json -Depth 4

try {
  Write-Utf8NoBom $claspConfigPath $temporaryClaspConfig
  Invoke-Checked $clasp @('status') $appsScriptDir
  Invoke-Checked $clasp @('deployments') $appsScriptDir

  if (-not $Push) {
    Write-Host "`nPreflight passed. No files were uploaded." -ForegroundColor Green
    Write-Host ".\Scripts\deploy-client.ps1 -Client $Client -Push"
    exit 0
  }

  $confirmation = Read-Host "Type the profile name '$Client' to push code to $($profile.clientName)"
  if ($confirmation -cne $Client) {
    Stop-Deployment 'confirmation did not match the profile name.'
  }

  Invoke-Checked $clasp @('push') $appsScriptDir
  Write-Host "`nCode upload completed for $($profile.clientName)." -ForegroundColor Green
  Write-Host 'Next: update the production Web App deployment, run required migrations and health check, then perform release regression.'
  Write-Host 'Reinstall Telegram webhooks only when the /exec URL or bot token changed.'
}
finally {
  if ($hadClaspConfig) {
    Write-Utf8NoBom $claspConfigPath $previousClaspConfig
  }
  elseif (Test-Path -LiteralPath $claspConfigPath) {
    Remove-Item -LiteralPath $claspConfigPath -Force
  }
}
