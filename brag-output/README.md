# Portfolio launch video

- `brag.mp4` — 22 seconds, 1080×1920, 30 fps, H.264 video + AAC audio.
- `brag.jpg` — settled poster frame, also baked into the first video frame.
- `share-copy.txt` — ready-to-use caption.
- `composition/` — editable Hyperframes project.
- `work/` — source extraction, rendering tools, reference material, and intermediate files.

The film uses the portfolio's Terminal and CodeCard component markup, local fonts, original colors, and project data. Command entry is a deterministic animation of the real `whoami` behavior. Project summaries are abbreviated for mobile readability. No years-of-experience figures or project performance claims are included.

## Rebuild locally

Run from the portfolio root in PowerShell:

```powershell
./brag-output/work/video-tools.ps1 build
./brag-output/work/video-tools.ps1 audio
./brag-output/work/video-tools.ps1 build
./brag-output/work/video-tools.ps1 check
./brag-output/work/video-tools.ps1 preview
./brag-output/work/video-tools.ps1 render
./brag-output/work/video-tools.ps1 finish
./brag-output/work/video-tools.ps1 probe
```

The script sets process-local paths for FFmpeg/FFprobe and disables Hyperframes telemetry. Dependencies are isolated in `work/runtime/`; the website's dependencies and source are unchanged. The browser-based checks may take several minutes because motion assertions sweep 300 timeline samples.

## Source credits

- Portfolio design and content: Mohit Gujarati, local project.
- Workflow: [Brag](https://github.com/latent-spaces/brag), MIT, copyright 2026 Shunit Haviv Hakimi; original license retained under `work/brag-main/LICENSE`.
- Renderer: [Hyperframes](https://github.com/heygen-com/hyperframes), version 0.8.78. Terminal animation pattern adapted from the `code-terminal-run` catalog component.
- Music: “Happy Beats / Business Moves Vol. 12” by [ende.app](https://ende.app/en), supplied with Brag; original source notes retained in `work/brag-main/skills/brag/assets/music/README.md`.
- Typing SFX: unicae_games, Keyboard Soundpack #1, CC0, supplied with Brag.
- Soft landing SFX: [Kenney](https://kenney.nl/), supplied with Brag.
- Fonts: the portfolio's Inter Tight, JetBrains Mono, and Instrument Serif.

No content was published or sent to a video-generation service. Rendering is local.
