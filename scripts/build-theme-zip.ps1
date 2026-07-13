# Đóng gói theme liora-blog thành zip với dấu / (tương thích WordPress upload).
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = (Resolve-Path "$PSScriptRoot\..\wordpress-theme\liora-blog").Path
$zipPath = (Resolve-Path "$PSScriptRoot\..").Path + "\wordpress-theme.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
Get-ChildItem -Path $root -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($root.Length + 1).Replace('\', '/')
    $entry = $zip.CreateEntry("liora-blog/$rel")
    $entryStream = $entry.Open()
    $fs = [System.IO.File]::OpenRead($_.FullName)
    $fs.CopyTo($entryStream)
    $fs.Close()
    $entryStream.Close()
    Write-Host "  + liora-blog/$rel"
}
$zip.Dispose()

Write-Host ""
Write-Host "Done: $zipPath"
$z = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
Write-Host ("Entries: " + $z.Entries.Count)
$z.Dispose()