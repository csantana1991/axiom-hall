#!/usr/bin/env python3
"""Turn a spoken seminar script and an MP3 into a chaptered lecture film."""

import json
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

INK = (20, 17, 14)
CREAM = (243, 234, 215)
BRASS = (196, 165, 116)
MIST = (168, 156, 140)
W, H = 1280, 720
SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def wrap(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for word in words:
        trial = word if not cur else f"{cur} {word}"
        if draw.textlength(trial, font=face) <= width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def card(kicker: str, title: str, body: str, formula: str | None, out: Path) -> None:
    img = Image.new("RGB", (W, H), INK)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, W, 6), fill=BRASS)
    draw.text((72, 48), kicker.upper(), font=font(MONO, 22), fill=BRASS)
    title_face = font(SERIF, 54)
    y = 100
    for line in wrap(draw, title, title_face, W - 144)[:3]:
        draw.text((72, y), line, font=title_face, fill=CREAM)
        y += 64
    y += 16
    draw.line((72, y, 280, y), fill=BRASS, width=2)
    y += 28
    body_face = font(SANS, 28)
    for line in wrap(draw, body, body_face, W - 144)[:8]:
        draw.text((72, y), line, font=body_face, fill=CREAM)
        y += 40
    if formula:
        y = min(y + 24, H - 120)
        draw.rectangle((72, y, W - 72, y + 72), outline=BRASS)
        draw.text((92, y + 18), formula[:90], font=font(MONO, 26), fill=BRASS)
    img.save(out, "PNG")


def parse_beats(raw: str) -> list[str]:
    parts = re.split(r"\[\[BEAT\s+(\d+)\]\]", raw)
    if len(parts) < 3:
        text = raw.strip()
        return [text] if text else []
    beats: dict[int, str] = {}
    i = 1
    while i < len(parts):
        beats[int(parts[i])] = parts[i + 1].strip()
        i += 2
    return [beats[k] for k in sorted(beats)]


def spoken_and_offsets(beats: list[str]) -> tuple[str, list[int]]:
    chunks: list[str] = []
    offsets: list[int] = []
    cursor = 0
    for text in beats:
        offsets.append(cursor)
        chunks.append(text.strip())
        cursor += len(text.strip()) + 2
    return "\n\n".join(chunks), offsets


def chapter_times(spoken: str, offsets: list[int], stamp_path: Path, audio_seconds: float) -> list[float]:
    if stamp_path.exists():
        data = json.loads(stamp_path.read_text())
        times = data.get("graph_times") or []
        chars = data.get("graph_chars") or ""
        if isinstance(chars, list):
            chars = "".join(chars)
        duration = float(data.get("duration") or audio_seconds)
        mapped: list[float] = []
        for offset in offsets:
            if times and offset < len(times):
                mapped.append(float(times[offset][0]))
            elif chars and spoken[:offset] and offset <= len(chars):
                mapped.append(duration * offset / max(len(spoken), 1))
            else:
                mapped.append(duration * offset / max(len(spoken), 1))
        mapped[0] = 0.0
        return mapped
    weights = [max(len(b.split()), 1) for b in spoken.split("\n\n")]
    # offsets already mark beats; fall back to word share of the audio
    return []


def probe_duration(path: Path) -> float:
    proc = subprocess.run(
        ["ffmpeg", "-i", str(path), "-f", "null", "-"],
        capture_output=True,
        text=True,
    )
    match = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", proc.stderr)
    if not match:
        raise SystemExit(f"no duration for {path}")
    hours, mins, secs = match.groups()
    return int(hours) * 3600 + int(mins) * 60 + float(secs)


def assemble(lesson_id: str, script: Path, audio: Path, slides: list[dict], out_mp4: Path, out_json: Path) -> None:
    beats = parse_beats(script.read_text())
    if not beats:
        raise SystemExit(f"no beats in {script}")
    spoken, offsets = spoken_and_offsets(beats)
    duration = probe_duration(audio)
    stamp = audio.with_suffix(".timestamps.json")
    if not stamp.exists():
        stamp = Path(str(audio) + ".timestamps.json")
    # voice tool writes '<name>.timestamps.json' beside the mp3: speech.mp3 -> speech.timestamps.json
    alt = audio.parent / f"{audio.stem}.timestamps.json"
    times = chapter_times(spoken, offsets, alt if alt.exists() else stamp, duration)
    if len(times) != len(beats):
        weights = [max(len(b.split()), 1) for b in beats]
        total = sum(weights)
        cursor = 0.0
        times = []
        for weight in weights:
            times.append(cursor)
            cursor += duration * weight / total
    work = out_mp4.parent / f".{lesson_id}-frames"
    work.mkdir(parents=True, exist_ok=True)
    frames: list[Path] = []
    for index, beat in enumerate(beats):
        slide = slides[min(index, len(slides) - 1)] if slides else {}
        first = beat.replace("\n", " ").strip()
        sentence = first.split(". ")[0][:220]
        frame = work / f"{index:02d}.png"
        card(
            slide.get("kicker") or f"{index + 1:02d}",
            slide.get("title") or f"Board {index + 1}",
            sentence,
            slide.get("formula"),
            frame,
        )
        frames.append(frame)
    concat = work / "concat.txt"
    lines = []
    for index, frame in enumerate(frames):
        start = times[index]
        end = times[index + 1] if index + 1 < len(times) else duration
        span = max(end - start, 0.4)
        lines.append(f"file '{frame}'")
        lines.append(f"duration {span:.3f}")
    lines.append(f"file '{frames[-1]}'")
    concat.write_text("\n".join(lines) + "\n")
    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat),
            "-i",
            str(audio),
            "-vf",
            "fps=5,format=yuv420p",
            "-c:v",
            "libx264",
            "-tune",
            "stillimage",
            "-preset",
            "veryfast",
            "-crf",
            "32",
            "-c:a",
            "aac",
            "-b:a",
            "48k",
            "-ac",
            "1",
            "-shortest",
            "-movflags",
            "+faststart",
            str(out_mp4),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    chapters = []
    for index, start in enumerate(times):
        slide = slides[min(index, len(slides) - 1)] if slides else {}
        chapters.append({"t": round(start, 2), "title": slide.get("title") or f"Board {index + 1}"})
    out_json.write_text(json.dumps({"duration": round(duration, 2), "chapters": chapters}))
    print(f"{lesson_id} {duration:.0f}s {out_mp4.stat().st_size / 1e6:.1f}MB")


if __name__ == "__main__":
    lesson_id, script, audio, slides_json, out_mp4, out_json = sys.argv[1:]
    assemble(
        lesson_id,
        Path(script),
        Path(audio),
        json.loads(slides_json),
        Path(out_mp4),
        Path(out_json),
    )
