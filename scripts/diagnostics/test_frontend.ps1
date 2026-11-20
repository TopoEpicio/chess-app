$r = iwr 'http://localhost:5173' -TimeoutSec 5 -UseBasicParsing
'Frontend Status: ' + $r.StatusCode