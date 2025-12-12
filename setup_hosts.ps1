@'
127.0.0.1   local.cursorschool.test
127.0.0.1   demo.local.cursorschool.test
127.0.0.1   smpn1.local.cursorschool.test
127.0.0.1   sdn1.local.cursorschool.test
127.0.0.1   smpn2.local.cursorschool.test
'@ | Out-File -Encoding ASCII -Append "$env:SYSTEMROOT\System32\drivers\etc\hosts"

Write-Output "Hosts file updated! You can now access: http://local.cursorschool.test:3000"
Write-Output "Make sure to run: ipconfig /flushdns"
