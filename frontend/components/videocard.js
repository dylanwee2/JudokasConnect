export default function VideoCard({ video }) {
  return (
    <div className="rounded-xl shadow-md border p-4">
      <video src={video.url} controls className="w-full rounded-lg" />
      <p className="mt-2 text-sm font-semibold truncate">{video.name}</p>
    </div>
  );
}