import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { publicFetch } from '../../utils/apis';
import { auth } from "../firebase"; // adjust if needed
import { useAuthState } from 'react-firebase-hooks/auth';

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;

  const [user, loadingAuth] = useAuthState(auth);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        const res = await publicFetch.get(`/api/images/${id}`);
        setVideo(res.video);
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await publicFetch.delete(`/api/images/${id}`);
      router.push("/video"); // Redirect to homepage
    } catch (error) {
      console.error("Delete failed", error.message);
      alert("Failed to delete video.");
    }
  };

  if (loading || loadingAuth) {
    return (
      <main className="p-4 max-w-3xl mx-auto text-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!video) {
    return (
      <main className="p-4 max-w-3xl mx-auto text-center">
        <p className="text-red-500">Video not found.</p>
      </main>
    );
  }

  const isOwner = user && user.uid === video.userId;

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <video controls className="w-full rounded mb-4" preload="metadata">
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="mb-2 text-gray-700">{video.desc}</p>
      <p className="text-sm text-gray-500">Uploaded by @{video.username}</p>

      {isOwner && (
        <div className="mt-6 text-right">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Video
          </button>
        </div>
      )}
    </main>
  );
}
