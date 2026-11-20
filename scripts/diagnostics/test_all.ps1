Start-Sleep 2
$urls = @(
    'http://localhost:8003/api/openings/'
    'http://localhost:8003/api/study/root'
    'http://localhost:8003/api/study/folders/2/contents'
    'http://localhost:8003/api/study/folders/breadcrumb/2'
)

foreach ($url in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $url -Headers @{'Origin'='http://localhost:5173'} -TimeoutSec 5 -UseBasicParsing
        "=== $url ==="
        'Status: ' + $r.StatusCode
        'CORS: ' + $r.Headers['access-control-allow-origin'] + ' | Creds: ' + $r.Headers['access-control-allow-credentials'] + ' | Vary: ' + $r.Headers['vary']
        ""
    } catch {
        "=== $url ==="
        'Error: ' + $_.Exception.Message
        if ($_.Response) { 'Response Status: ' + $_.Response.StatusCode }
        ""
    }
}