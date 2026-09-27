param([ValidateSet('build','audio','check','snapshot','preview','render','finish','probe')][string]$Action = 'build')
$ErrorActionPreference = 'Stop'
$taskWork = $PSScriptRoot
$taskOutput = Split-Path $taskWork
$taskComp = Join-Path $taskOutput 'composition'
$taskRuntime = Join-Path $taskWork 'runtime/node_modules'
$taskCli = Join-Path $taskRuntime 'hyperframes/bin/hyperframes.mjs'
$taskFfmpeg = Join-Path $taskRuntime 'ffmpeg-static/ffmpeg.exe'
$taskProbe = Join-Path $taskRuntime 'ffprobe-static/bin/win32/x64/ffprobe.exe'
$env:PATH = (Split-Path $taskFfmpeg) + ';' + (Split-Path $taskProbe) + ';' + $env:PATH
$env:DO_NOT_TRACK = '1'
$env:HYPERFRAMES_NO_TELEMETRY = '1'
$env:HYPERFRAMES_SKIP_SKILLS = '1'
switch ($Action) {
 'build' { node (Join-Path $taskWork 'build-video.mjs') }
 'audio' {
   & $taskFfmpeg -y -v error -i (Join-Path $taskComp 'assets/music.mp3') -t 22 -af 'afade=t=in:st=0:d=0.25,afade=t=out:st=20.5:d=1.5' (Join-Path $taskComp 'assets/music-bed.wav')
   $env:PYTHONPATH = Join-Path $taskWork 'python'
   python (Join-Path $taskWork 'hyperframes-skills/hyperframes-creative/scripts/extract-audio-data.py') (Join-Path $taskComp 'assets/music-bed.wav') -o (Join-Path $taskWork 'audio-data.json')
 }
 'check' { node $taskCli check $taskComp --at '0.1,1.6,3.7,4.85,5.2,6.9,8.6,9.1,10.9,12.3,15.5,17.3,18.5,21.9' --snapshots --json > (Join-Path $taskWork 'check.json'); Get-Content (Join-Path $taskWork 'check.json') }
 'snapshot' { node $taskCli snapshot $taskComp --at '1.6,4.85,6.9,8.6,10.9,12.3,15.5,17.3,19.4,21.9' }
 'preview' { node $taskCli preview $taskComp --background --port 3017 }
 'render' { node $taskCli render $taskComp --quality delivery --fps 30 --workers 2 --output (Join-Path $taskWork 'render.mp4') }
 'finish' {
   & $taskFfmpeg -y -v error -ss 6.9 -i (Join-Path $taskWork 'render.mp4') -frames:v 1 -q:v 2 (Join-Path $taskOutput 'brag.jpg')
   & $taskFfmpeg -y -v error -i (Join-Path $taskWork 'render.mp4') -i (Join-Path $taskOutput 'brag.jpg') -filter_complex "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]" -map '[v]' -map '0:a?' -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a copy -movflags +faststart (Join-Path $taskOutput 'brag.mp4')
 }
 'probe' { & $taskProbe -v error -show_format -show_streams -of json (Join-Path $taskOutput 'brag.mp4') }
}
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
