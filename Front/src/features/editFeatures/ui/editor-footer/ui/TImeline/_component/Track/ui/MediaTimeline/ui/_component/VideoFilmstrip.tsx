"use client";

import React from "react";

interface VideoFilmstripProps {
  src: string;
  startTime: number;
  endTime: number;
  isResizing?: boolean;
}

const IDEAL_THUMB_PX = 80;
const MAX_THUMBS = 80;

const filmstripCache = new Map<string, string[]>();

export function VideoFilmstrip({ src, startTime, endTime, isResizing }: VideoFilmstripProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const [thumbs, setThumbs] = React.useState<string[]>([]);
  const [failed, setFailed] = React.useState(false);
  const segmentDuration = Math.max(0.001, endTime - startTime);

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setSize({ w: Math.max(0, Math.floor(rect.width)), h: Math.max(1, Math.floor(rect.height)) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const count = React.useMemo(() => {
    if (!size.w) return 0;
    const ideal = Math.ceil(size.w / IDEAL_THUMB_PX);
    return Math.min(Math.max(1, ideal), MAX_THUMBS);
  }, [size.w]);

  const cacheKey = React.useMemo(() => {
    if (!count || !size.h) return "";
    return `${src}|${startTime.toFixed(3)}-${endTime.toFixed(3)}|c=${count}|h=${size.h}`;
  }, [src, startTime, endTime, count, size.h]);

  React.useEffect(() => {
    let aborted = false;
    if (!containerRef.current || !count || !size.h) return;

    if (isResizing) return;

    const run = async () => {
      try {
        if (cacheKey && filmstripCache.has(cacheKey)) {
          if (!aborted) setThumbs(filmstripCache.get(cacheKey)!);
          return;
        }

        const video = document.createElement("video");
        video.src = src;
        video.crossOrigin = "anonymous";
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;

        await new Promise<void>((resolve, reject) => {
          const onLoaded = () => resolve();
          const onError = () => reject(new Error("video load error"));
          video.addEventListener("loadedmetadata", onLoaded, { once: true });
          video.addEventListener("error", onError, { once: true });
        });

        if (aborted) return;

        const times = Array.from({ length: count }, (_, i) => {
          const t = startTime + ((i + 0.5) / count) * segmentDuration;
          return Math.min(endTime - 0.001, Math.max(startTime, t));
        });

        const thumbW = Math.max(1, Math.floor(size.w / count));
        const thumbH = size.h;

        const canvas = document.createElement("canvas");
        canvas.width = thumbW;
        canvas.height = thumbH;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        const results: string[] = [];

        const seekTo = (t: number) =>
          new Promise<void>((resolve) => {
            const onSeeked = () => {
              video.removeEventListener("seeked", onSeeked);
              resolve();
            };
            video.addEventListener("seeked", onSeeked);
            try {
              video.currentTime = t;
            } catch {
              setTimeout(() => (video.currentTime = t), 16);
            }
          });

        const drawCover = () => {
          if (!ctx) return;
          const vw = Math.max(1, video.videoWidth || 1);
          const vh = Math.max(1, video.videoHeight || 1);
          const scale = Math.max(thumbW / vw, thumbH / vh);
          const sw = Math.min(vw, thumbW / scale);
          const sh = Math.min(vh, thumbH / scale);
          const sx = Math.max(0, (vw - sw) / 2);
          const sy = Math.max(0, (vh - sh) / 2);
          ctx.clearRect(0, 0, thumbW, thumbH);
          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, thumbW, thumbH);
        };

        for (let i = 0; i < times.length; i++) {
          if (aborted) return;
          await seekTo(times[i]);
          drawCover();
          const url = canvas.toDataURL("image/jpeg", 0.7);
          results.push(url);
          if (!aborted) setThumbs((prev) => (prev.length === count ? prev : [...prev, url]));
          await new Promise((r) => setTimeout(r, 0));
        }
        if (cacheKey) filmstripCache.set(cacheKey, results);
      } catch {
        if (!aborted) setFailed(true);
      }
    };

    run();

    return () => {
      aborted = true;
    };
  }, [src, startTime, endTime, count, size.h, isResizing, cacheKey, segmentDuration]);

  if (!count || !size.w) {
    return <div ref={containerRef} className="w-full h-full" />;
  }

  if (failed) {
    return (
      <div ref={containerRef} className="w-full h-full">
        <video
          src={src}
          className="w-full h-full object-cover opacity-90"
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          controls={false}
        />
      </div>
    );
  }

  if (thumbs.length === 0 && !isResizing) {
    return <div ref={containerRef} className="w-full h-full bg-black/30" />;
  }

  const itemW = count ? Math.max(1, Math.floor(size.w / count)) : 0;

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <div className="flex h-full">
        {thumbs.map((t, i) => (
          <img
            key={i}
            src={t}
            alt=""
            className="h-full object-cover select-none pointer-events-none"
            draggable={false}
            style={{ width: `${itemW}px` }}
          />
        ))}
      </div>
    </div>
  );
}
