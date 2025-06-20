export default function VideoCard({ video }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded p-4 shadow-md hover:bg-gray-100 transition-all duration-200"
    >
      <h2 className="font-bold text-lg mb-2">{video.title}</h2>
      <video
        width="100%"
        className="rounded"
        preload="metadata"
        // Remove controls so it doesn't play in card
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="mt-2 text-sm text-gray-600">@{video.username}</p>
    </a>
  );
}
