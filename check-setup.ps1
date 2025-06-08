# ==============================
# CHECK FOR .mjs EXTENSIONS
# ==============================
Write-Host "🔎 Checking for .mjs extensions in 'frontend' folder..." -ForegroundColor Yellow
$mjsFiles = Get-ChildItem -Path .\frontend -Recurse -Filter "*.mjs"

if ($mjsFiles.Count -gt 0) {
    Write-Host "⚠️  Found .mjs files:" -ForegroundColor Red
    $mjsFiles | ForEach-Object { Write-Host "    -> $($_.FullName)" }
    Write-Host "❗  Consider renaming them to .js using:" -ForegroundColor Red
    Write-Host "    Rename-Item -Path <file-path> -NewName <new-file-name>.js"
} else {
    Write-Host "✅ No .mjs files found in frontend."
}

# ==============================
# CHECK FOR .env FILES
# ==============================
Write-Host "`n🔎 Checking for .env files in 'frontend' and 'backend'..." -ForegroundColor Yellow

# Check backend .env
if (Test-Path .\backend\.env) {
    Write-Host "✅ .env found in backend"
} else {
    Write-Host "❌ .env file is missing in backend!" -ForegroundColor Red
    Write-Host "    Use: New-Item -Path .\backend\.env -ItemType 'file'"
}

# Check frontend .env
if (Test-Path .\frontend\.env) {
    Write-Host "✅ .env found in frontend"
} else {
    Write-Host "❌ .env file is missing in frontend!" -ForegroundColor Red

    # Ask if you want to sync it
    $syncEnv = Read-Host "Do you want to sync the backend .env to frontend? (y/n)"
    if ($syncEnv -eq "y" -and (Test-Path .\backend\.env)) {
        Copy-Item -Path .\backend\.env -Destination .\frontend\.env
        Write-Host "✅ .env successfully copied from backend to frontend!" -ForegroundColor Green
    } else {
        Write-Host "❌ Could not sync the .env file. Make sure it exists in the backend." -ForegroundColor Red
    }
}

# ==============================
# CHECK FOR UNCOMMITTED CHANGES
# ==============================
Write-Host "`n🔎 Checking for uncommitted changes..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  You have uncommitted changes:" -ForegroundColor Red
    git status -s
    Write-Host "💡 Consider committing or stashing your changes before running the server."
} else {
    Write-Host "✅ No uncommitted changes."
}

# ==============================
# PROMPT TO START SERVERS
# ==============================
$startServer = Read-Host "`nDo you want to start the servers now? (y/n)"
if ($startServer -eq "y") {
    Write-Host "`n🚀 Starting frontend and backend servers..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "npm run dev --prefix frontend"
    Start-Process powershell -ArgumentList "npm run dev --prefix backend"
} else {
    Write-Host "👍 Okay, you can start them manually when you're ready."
}
