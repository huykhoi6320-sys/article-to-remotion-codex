#!/usr/bin/env python3
"""Generate an optional narrated MP3 from reviewed narration.txt using edge-tts."""
import argparse
import asyncio
from pathlib import Path
import edge_tts

async def main():
    p=argparse.ArgumentParser()
    p.add_argument('--text', default='narration.txt')
    p.add_argument('--out', default='public/voice.mp3')
    p.add_argument('--voice', default='vi-VN-NamMinhNeural')
    args=p.parse_args()
    text=Path(args.text).read_text(encoding='utf-8')
    Path(args.out).parent.mkdir(parents=True,exist_ok=True)
    await edge_tts.Communicate(text,args.voice).save(args.out)
    print(f'Audio saved: {args.out}. Add "voiceover": "voice.mp3" to video.json.')

if __name__=='__main__': asyncio.run(main())
