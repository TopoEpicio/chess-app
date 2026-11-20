$urls = @(
    'http://localhost:8003/api/study/folders/2/contents'
    'http://localhost:8003/api/study/folders/breadcrumb/2'
)

foreach ($url in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $url -Headers @{'Origin'='http://localhost:5173'} -TimeoutSec 5 -UseBasicParsing
        "=== $url ==="
        'Status: ' + $r.StatusCode
        $r.Headers | Where-Object Key -like "access-control*"
        '---'
        $r.Content
        ""
    } catch {
        "=== $url ==="
        'Error: ' + $_.Exception.Message
        if ($_.Response) {
            'Response Status: ' + $_.Response.StatusCode
            $_.Response.Content
        }
        ""
    }
}