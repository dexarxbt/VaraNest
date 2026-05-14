param(
  [string]$WalletName = "varanest"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$nodeDir = Join-Path $root ".tools\node-v22.21.1-win-x64"
$walletCmd = Join-Path $root ".tools\vara-wallet-cli\node_modules\.bin\vara-wallet.cmd"
$walletDir = Join-Path $root ".wallet"

if (-not (Test-Path $walletCmd)) {
  throw "vara-wallet CLI was not found at $walletCmd"
}

New-Item -ItemType Directory -Force -Path $walletDir | Out-Null
$env:Path = "$nodeDir;$env:Path"
$env:VARA_WALLET_DIR = $walletDir
$env:VARA_WS = "wss://rpc.vara.network"

Write-Host ""
Write-Host "VARANEST wallet import" -ForegroundColor Cyan
Write-Host "Paste/type your existing mnemonic in this window only. It will not be written to chat or saved as plaintext." -ForegroundColor Yellow
Write-Host ""

$secureMnemonic = Read-Host "Mnemonic" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureMnemonic)

try {
  $mnemonic = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  if ([string]::IsNullOrWhiteSpace($mnemonic)) {
    throw "Mnemonic cannot be empty."
  }

  & $walletCmd wallet import --name $WalletName --mnemonic $mnemonic
  if ($LASTEXITCODE -ne 0) {
    throw "wallet import failed."
  }

  & $walletCmd wallet default $WalletName
  if ($LASTEXITCODE -ne 0) {
    throw "setting default wallet failed."
  }

  Write-Host ""
  Write-Host "Imported wallet list:" -ForegroundColor Cyan
  & $walletCmd wallet list

  Write-Host ""
  Write-Host "Mainnet balance check:" -ForegroundColor Cyan
  & $walletCmd --network mainnet balance

  Write-Host ""
  Write-Host "STOP HERE: fund this address with VARA, then return to Codex and say 'funded'." -ForegroundColor Green
}
finally {
  if ($bstr -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
  $mnemonic = $null
  $secureMnemonic = $null
}

