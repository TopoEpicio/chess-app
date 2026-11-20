try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8003/api/openings/' -Headers @{'Origin'='http://localhost:5173'} -TimeoutSec 5 -UseBasicParsing
    'Status: ' + $r.StatusCode
    $r.Headers
} catch {
    'Error: ' + $_.Exception.Message
    if ($_.Response) {
        'Response Status: ' + $_.Response.StatusCode
        $_.Response.Headers
    }
}