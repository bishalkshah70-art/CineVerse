import Link from "next/link";
import VideoPlayer from "@/components/media/VideoPlayer";

export default function DemoWatchPage() {
  return (
    <main className="min-h-screen bg-[#08090d] px-5 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-block rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
        >
          ← Back to CineVerse
        </Link>

        <p className="mt-10 text-sm font-bold uppercase tracking-widest text-red-400">
          CineVerse player test
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-5xl">
          Test video playback
        </h1>
        <p className="mt-3 mb-8 max-w-2xl leading-7 text-gray-300">
          This page tests the playback interface. Add a video file that you
          own or are authorized to stream to public/videos/demo.mp4.
        </p>

        <VideoPlayer
          src="/videos/demo.mp4"
          title="CineVerse playback test"
        />

        <p className="mt-6 text-sm text-gray-500">
          If the video file is missing, the player will appear but playback
          will not work yet.
        </p>
      </div>
    </main>
  );
}
