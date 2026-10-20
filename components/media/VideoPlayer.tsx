"use client";

import { useEffect, useRef, useState } from "react";

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
    function handleKeyboard(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;

      // Don't hijack typing in inputs or keyboard use of buttons.
      if (
        target?.isContentEditable ||
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        tag === "BUTTON"
      ) return;

      const video = videoRef.current;
      const wrapper = wrapperRef.current;
      if (!video || !wrapper) return;

      const key = event.key.toLowerCase();

      if (key === " " || key === "k") {
        event.preventDefault();
        void togglePlayback();
      } else if (key === "arrowleft") {
        event.preventDefault();
        seekBy(-5);
      } else if (key === "arrowright") {
        event.preventDefault();
        seekBy(5);
      } else if (key === "j") {
        event.preventDefault();
        seekBy(-10);
      } else if (key === "l") {
        event.preventDefault();
        seekBy(10);
      } else if (key === "f") {
        event.preventDefault();
        void toggleFullscreen();
      } else if (key === "m") {
        event.preventDefault();
        video.muted = !video.muted;
      } else if (key === "arrowup") {
        event.preventDefault();
        video.volume = Math.min(1, video.volume + 0.1);
        if (video.volume > 0) video.muted = false;
      } else if (key === "arrowdown") {
        event.preventDefault();
        video.volume = Math.max(0, video.volume - 0.1);
      } else if (key === "home") {
        event.preventDefault();
        video.currentTime = 0;
      } else if (key === "end") {
        event.preventDefault();
        if (Number.isFinite(video.duration)) {
          video.currentTime = video.duration;
        }
      } else if (key === "escape" && document.fullscreenElement) {
        void document.exitFullscreen();
      }
    }

    function syncFullscreen() {
      setFullscreen(document.fullscreenElement === wrapperRef.current);
    }

    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener("keydown", handleKeyboard);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  function seekBy(seconds: number) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    video.currentTime = Math.max(
      0,
      Math.min(video.duration, video.currentTime + seconds)
    );
  }

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setMessage("Playback could not start. Use the video controls.");
      }
    } else {
      video.pause();
    }
  }

  function handleVideoTap(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const third = rect.width / 3;

    if (x < third) {
      seekBy(-5);
    } else if (x >= third * 2) {
      seekBy(5);
    } else {
      void togglePlayback();
    }
  }

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
            : "relative overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl"
        }
      >
        <video
          ref={videoRef}
          className={
            fullscreen
              ? "h-full w-full object-contain"
              : "aspect-video w-full bg-black"
          }
          controls
          controlsList="nofullscreen"
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
            setMessage("Video could not be loaded.");
          }}
        >
          <source src={src} type="video/mp4" />
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

        <div
          className="absolute inset-x-0 top-0 bottom-14 z-10 cursor-pointer"
          onClick={handleVideoTap}
          aria-label="Tap left to rewind, middle to play or pause, right to skip"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-400" role="status">
          {message ||
            (ready
              ? `${playing ? "Playing" : "Paused"}: ${title}`
              : "Preparing video…")}
        </p>

        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          className="shrink-0 rounded-lg border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10"
        >
          {fullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
        </button>
      </div>
    </section>
  );
}
