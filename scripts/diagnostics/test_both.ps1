Start-Sleep 180
$r = iwr 'http://localhost:5173' -TimeoutSec 5 -UseBasicParsing
'Frontend Status: ' + $r.StatusCode
$r2 = iwr 'http://localhost:8003/api/health' -TimeoutSec 5 -UseBasicParsing
'Backend Status: ' + $r2.StatusCode