# Article → Remotion Video (Codex)

Paste one public news URL into ChatGPT Codex; it turns the article into a 9:16 Vietnamese short video via Remotion. This template includes a draft extractor, Remotion composition, optional Vietnamese voice, and instructions for Codex. **Fact checking and rewriting are required before publishing**.

## Setup

Prerequisites: Node.js 20+, Python 3.10+, Chrome/Chromium dependencies for Remotion, network access to fetch article; FFmpeg/browser may be downloaded by Remotion.

```bash
npm install
python3 -m pip install -r requirements.txt
npm run render:demo
```

## One article → one video

```bash
python3 scripts/article_to_video.py 'https://example.com/your-article' --output video.json
# Codex edits video.json after reading/verifying article
npm run studio
npm run render
```

Optional voice:

```bash
# First write reviewed narration.txt
python3 scripts/voice.py
# Add "voiceover": "voice.mp3" to video.json
npm run render
```

`video.json` is the Remotion props file: `title`, `source`, `sourceUrl`, and array `scenes`. Each scene has `headline`, `body`, `durationSeconds`, and optional `kicker`, `image` (image relative to public/ or an allowed HTTPS URL). `voiceover` and `music` are paths relative to `public/`. Synchronize voice to scene timings manually or let Codex align them.

## Use with Codex in ChatGPT

1. Create a GitHub repository and upload these files to the repository root (or push with Git).
2. Open Codex in ChatGPT, connect/select the repository, grant the environment required network permissions.
3. Paste this prompt (replace URL):

> Read AGENTS.md. Take this article: https://example.com/your-article. Fact-check against the original, write a Vietnamese ~75-second 9:16 news video in editorial dark style, male narration, professional pacing. Use Remotion, install its official skill if possible, render an MP4, review it, and commit the source changes. Provide out/news-video.mp4 if the runtime supports artifacts; otherwise explain how to render/download it.

Codex/ChatGPT may produce code without a binary artifact if its environment cannot render video. GitHub is not a video hosting platform: large MP4 files should be treated as artifacts, not routinely committed.

## Notes

- Article sources may block extraction or restrict republishing of text/images.
- The extractor generates an **unverified draft**, not a trustworthy automatic summary; Codex must edit it.
- Do not rely on GitHub Actions for audio/video generation without addressing secrets, browser dependencies and build-minute costs.
- Keep 4.x Remotion packages on matching versions (`npx remotion versions`); see https://www.remotion.dev/docs/ and https://www.remotiondocs.com/docs/cli/render.
