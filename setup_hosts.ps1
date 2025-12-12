@'
127.0.0.1   local.cursorschool.app
127.0.0.1   demo.local.cursorschool.app
127.0.0.1   smpn1.local.cursorschool.app
127.0.0.1   sdn1.local.cursorschool.app
127.0.0.1   smpn2.local.cursorschool.app
'@ | Out-File -Encoding ASCII -Append "$env:SYSTEMROOT\System32\drivers\etc\hosts"

Write-Output "Local subdomains successfully added! You can now close this Admin window."
