param(
  [Parameter(Mandatory = $true)][string]$Python,
  [Parameter(ValueFromRemainingArguments = $true)][string[]]$PythonArgs
)
& $Python @PythonArgs
exit $LASTEXITCODE
