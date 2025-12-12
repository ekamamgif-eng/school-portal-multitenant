# Quick Start Guide for GitHub & Netlify Deployment

Write-Host "School Portal Multi-Tenant - Deployment Setup" -ForegroundColor Cyan
Write-Host ""

# Clean up temporary files
Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
if (Test-Path "sanitizer.js") { Remove-Item "sanitizer.js" }
if (Test-Path "sanitizer_deep.js") { Remove-Item "sanitizer_deep.js" }
if (Test-Path "drizzle.config.ts.backup") { Remove-Item "drizzle.config.ts.backup" }
if (Test-Path "app_backup") { Remove-Item -Recurse -Force "app_backup" }

Write-Host "Cleanup complete" -ForegroundColor Green
Write-Host ""

# Stage all changes
Write-Host "Staging files for commit..." -ForegroundColor Yellow
git add .

Write-Host "Files staged" -ForegroundColor Green
Write-Host ""

# Show status
Write-Host "Current status:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "Ready to commit!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: git commit -m 'feat: multi-tenant school portal with Clerk auth'" -ForegroundColor White
Write-Host "2. Create GitHub repo: https://github.com/new" -ForegroundColor White
Write-Host "   - Name: school-portal-multitenant" -ForegroundColor Gray
Write-Host "3. Run: git remote add origin https://github.com/YOUR_USERNAME/school-portal-multitenant.git" -ForegroundColor White
Write-Host "4. Run: git branch -M main" -ForegroundColor White
Write-Host "5. Run: git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "See DEPLOYMENT.md for full Netlify deployment instructions" -ForegroundColor Cyan
