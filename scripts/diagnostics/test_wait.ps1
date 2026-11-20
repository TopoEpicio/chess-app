Start-Sleep 15
$r = Invoke-WebRequest -Uri 'http://localhost:8003/api/openings/' -Headers @{'Origin'='http://localhost:5173'} -TimeoutSec 5 -UseBasicParsing
'Status: ' + $r.StatusCode
$r.Headers | Where-Object Key -like 'access-control*'