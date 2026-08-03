$configs=@("architecture","frontend","server","shared","config")
foreach($c in $configs){
  Write-Host "Building $c..."
  repomix -c ".repomix/$c.json"
}
Write-Host "Done."
