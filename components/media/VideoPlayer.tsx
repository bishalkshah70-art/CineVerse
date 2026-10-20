"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

type VideoPlayerProps = {
  src: string;
  title: string;
  poster?: string;
  captions?: string;
};

export default function VideoPlayer({
  src,
  title,
  poster,
  captions,
}: VideoPlayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [message, setMessage] = useState("Loading video…");
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;
    let cancelled = false;

    setReady(false);
    setPlaying(false);
    setMessage("Loading video…");

    const isHls = /\.m3u8(?:$|[?#])/i.test(src);

    if (!isHls) {
      video.src = src;
      video.load();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari and other browsers with native HLS support.
      video.src = src;
      video.load();
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!cancelled) setMessage("Stream ready. Press play to start.");
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (cancelled || !data.fatal) return;
        setReady(false);
        setMessage(
          data.type === Hls.ErrorTypes.NETWORK_ERROR
            ? "Unable to load the HLS stream. Check the playlist URL, network, and CORS settings."
            : "This HLS stream could not be played. Check its format and encoding."
        );
        hls?.destroy();
        hls = null;
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      // Unsupported HLS is reported through the player's media error handler.
      video.removeAttribute("src");
    }

    return () => {
      cancelled = true;
      hls?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  useEffect(() => {
    function syncFullscreen() {
      setFullscreen(document.fullscreenElement === wrapperRef.current);
    }

    function handleKeyboard(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target?.tagName ?? "")
      ) return;

      const video = videoRef.current;
      if (!video) return;

      const key = event.key.toLowerCase();

      if (key === "k" || key === " ") {
        event.preventDefault();
        if (video.paused) void video.play().catch(() => {
          setMessage("Playback could not start. Check the stream URL.");
        });
        else video.pause();
      } else if (key === "arrowleft" || key === "j") {
        event.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - (key === "j" ? 10 : 5));
      } else if (key === "arrowright" || key === "l") {
        event.preventDefault();
        video.currentTime = Math.min(
          Number.isFinite(video.duration) ? video.duration : video.currentTime + 5,
          video.currentTime + (key === "l" ? 10 : 5)
        );
      } else if (key === "m") {
        video.muted = !video.muted;
      } else if (key === "f") {
        event.preventDefault();
        void toggleFullscreen();
      } else if (key === "escape" && document.fullscreenElement) {
        void document.exitFullscreen();
      }
    }

    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener("keydown", handleKeyboard);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  async function toggleFullscreen() {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await wrapper.requestFullscreen();
      }
    } catch {
      setMessage("Fullscreen is not supported in this browser.");
    }
  }

  return (
    <section className="w-full">
      <div
        ref={wrapperRef}
        className={
          fullscreen
            ? "flex h-screen w-screen items-center justify-center overflow-hidden bg-black"
            : "overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl"
        }
      >
        <video
          ref={videoRef}
          key={src}
          className={
            fullscreen
              ? "h-full w-full object-contain"
              : "aspect-video w-full bg-black"
          }
          controls
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={`Video player: ${title}`}
          onLoadedMetadata={() => {
            setReady(true);
            setMessage("");
          }}
          onCanPlay={() => {
            setReady(true);
            setMessage("");
          }}
          onPlay={() => {
            setPlaying(true);
            setMessage("");
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => {
            setReady(false);
            setMessage("Video could not be loaded. Check the stream URL and server.");
          }}
        >
          {captions ? (
            <track
              src={captions}
              kind="captions"
              srcLang="en"
              label="English captions"
              default
            />
          ) : null}
          Your browser does not support HTML video playback.
        </video>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-400" role="status">
          {message || (ready ? `${playing ? "Playing" : "Paused"}: ${title}` : "Preparing video…")}
        </p>
        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          className="shrink-0 rounded-lg border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10"
        >
          {fullscreen ? "Exit fullscreen" : "Fullscreen"}
        </button>
      </div>
    </section>
  );
}
