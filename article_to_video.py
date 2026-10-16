#!/usr/bin/env python3
"""Fetch an article and build an *unreviewed* video draft. Not a fact-checker."""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlsplit
import requests
import trafilatura


def clip(text, cap):
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:cap].rsplit(' ', 1)[0] if len(text) > cap else text


def main():
    p = argparse.ArgumentParser()
    p.add_argument('url', help='Public HTTPS article URL')
    p.add_argument('--output', default='video.json')
    args = p.parse_args()
    parsed = urlsplit(args.url)
    if parsed.scheme != 'https' or not parsed.hostname:
        p.error('Only public HTTPS URLs are supported')
    r = requests.get(args.url, timeout=25, headers={'User-Agent':'Mozilla/5.0 (compatible; ArticleVideoDraft/1.0)'})
    r.raise_for_status()
    extracted = trafilatura.bare_extraction(r.text, url=args.url, with_metadata=True)
    if not extracted or not extracted.get('text'):
        raise SystemExit('Could not extract article: try another public URL or provide text to Codex manually.')
    raw = extracted['text']
    lines = [clip(x, 215) for x in re.split(r'(?<=[.!?。])\s+|\n+', raw) if len(x.strip()) > 60]
    if not lines:
        raise SystemExit('Article too short for an automatic draft')
    title = clip(extracted.get('title') or 'Điểm tin', 100)
    chunks = lines[:5]
    scenes = [{'headline': title, 'body':'Tóm tắt từ bài báo gốc. Nội dung cần được Codex biên tập và kiểm chứng.', 'durationSeconds':8, 'kicker':'TIN NỔI BẬT'}]
    for i, line in enumerate(chunks):
        scenes.append({'headline': f'Điểm chính {i+1}', 'body':clip(line, 190), 'durationSeconds':10, 'kicker':'THÔNG TIN TỪ BÀI BÁO'})
    scenes.append({'headline':'Nguồn và bối cảnh', 'body':f'Đọc bài gốc tại {parsed.hostname} để xem đầy đủ thông tin.', 'durationSeconds':7, 'kicker':'THAM KHẢO'})
    payload = {'title':title, 'source':parsed.hostname, 'sourceUrl':args.url, 'scenes':scenes}
    Path(args.output).write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Draft created: {args.output} ({len(scenes)} scenes). Review facts and rewrite before publishing.')

if __name__ == '__main__': main()
