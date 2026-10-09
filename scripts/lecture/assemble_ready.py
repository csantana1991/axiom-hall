#!/usr/bin/env python3
"""Encode every lecture that already has an MP3."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import assemble

ROOT = Path("/workspace")
src = json.loads((ROOT / "content/source-lessons.json").read_text())
slides = {}
for course in src:
    for lesson in course["lessons"]:
        slides[f"{course['id']}-{lesson['id']}"] = [
            {
                "kicker": slide.get("kicker", ""),
                "title": slide.get("title", ""),
                "formula": slide.get("formula"),
            }
            for slide in lesson["slides"]
        ]

audio_dir = ROOT / "content/lectures/audio"
out_dir = ROOT / "public/lectures"
out_dir.mkdir(parents=True, exist_ok=True)
ready = sorted(audio_dir.glob("*.mp3"))
if not ready:
    raise SystemExit("no mp3 yet")
for audio in ready:
    lesson_id = audio.stem
    script = ROOT / "content/lectures" / f"{lesson_id}.txt"
    if not script.exists():
        print("skip", lesson_id)
        continue
    assemble.assemble(
        lesson_id,
        script,
        audio,
        slides.get(lesson_id, []),
        out_dir / f"{lesson_id}.mp4",
        out_dir / f"{lesson_id}.json",
    )
