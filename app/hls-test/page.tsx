import VideoPlayer from "../../components/media/VideoPlayer";

export default function HLSTestPage() {
  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <h1 className="mb-6 text-2xl font-bold">
        CineVerse HLS Test
      </h1>

      <VideoPlayer
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        title="HLS Test Stream"
      />
    </main>
  );
}
