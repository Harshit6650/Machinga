$port = 3000
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$mime = @{
    '.html' = 'text/html'
    '.css'  = 'text/css'
    '.js'   = 'application/javascript'
    '.mp4'  = 'video/mp4'
    '.webp' = 'image/webp'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host ""
Write-Host "  Machinga dev server running at http://localhost:$port" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host ""

# Open Chrome automatically
Start-Process "chrome" "http://localhost:$port" -ErrorAction SilentlyContinue
Start-Process "msedge" "http://localhost:$port" -ErrorAction SilentlyContinue

try {
    while ($listener.IsListening) {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        $urlPath = $req.Url.LocalPath
        if ($urlPath -eq '/') { $urlPath = '/index.html' }

        $filePath = Join-Path $root ($urlPath.TrimStart('/').Replace('/', '\'))

        if (Test-Path $filePath -PathType Leaf) {
            $ext  = [System.IO.Path]::GetExtension($filePath).ToLower()
            $ct   = if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)

            # Support Range requests for video streaming
            $rangeHeader = $req.Headers['Range']
            if ($rangeHeader -and $ct -eq 'video/mp4') {
                $total = $bytes.Length
                $range = $rangeHeader -replace 'bytes=', ''
                $parts = $range -split '-'
                $start = [int64]$parts[0]
                $end   = if ($parts[1]) { [int64]$parts[1] } else { $total - 1 }
                $length = $end - $start + 1

                $res.StatusCode = 206
                $res.ContentType = $ct
                $res.Headers.Add('Content-Range', "bytes $start-$end/$total")
                $res.Headers.Add('Accept-Ranges', 'bytes')
                $res.ContentLength64 = $length
                $res.OutputStream.Write($bytes, [int]$start, [int]$length)
            } else {
                $res.StatusCode = 200
                $res.ContentType = $ct
                $res.Headers.Add('Accept-Ranges', 'bytes')
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $res.ContentLength64 = $msg.Length
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }

        $res.OutputStream.Close()
    }
} finally {
    $listener.Stop()
}
