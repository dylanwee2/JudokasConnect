import { useState, useEffect } from 'react';
import UploadModal from '../components/uploadModal';
import VideoCard from '../components/videocard';
import { publicFetch } from '../utils/apis';
import { useRouter } from "next/navigation";
import { auth } from "../pages/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [currentUserId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', desc: '', userId: currentUserId });
  const [videoFile, setVideoFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      alert("Please login to upload videos");
      router.push('/login');
    } else {
      setUserId(user.uid);
      setUsername(user.displayName);
      get_Videos();
    }
  }, [user, loading, router]);

  const get_Videos = async () => {
    try {
      setVideosLoading(true);
      const response = await publicFetch.get('/api/images/list');
      if (response.images) {
        const videoList = response.images.map(image => ({
          id: image.id,
          title: image.title || 'Untitled Video',
          desc: image.desc || 'No description',
          url: image.url,
          userId: image.userId,
          username: image.username
        }));
        setVideos(videoList);
      } else {
        setVideos([]);
      }
    } catch (err) {
      alert("Failed to get videos.");
      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = (file) => {
    setVideoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !currentUserId) return alert("Please complete the form.");

    const formDataToSend = new FormData();
    formDataToSend.append('id', '');
    formDataToSend.append('title', formData.title);
    formDataToSend.append('desc', formData.desc);
    formDataToSend.append('userId', currentUserId);
    formDataToSend.append('username', username);
    formDataToSend.append('file', videoFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/upload`, {
        method: "POST",
        body: formDataToSend,
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType.includes('application/json')) throw new Error("Upload failed");

      const data = await response.json();
      alert("Upload complete. Please wait before refreshing.");
      const newVideo = {
        id: data.id,
        title: data.title,
        desc: data.desc,
        url: data.videoLink,
        userId: data.userId,
        username: data.username
      };
      setVideos([newVideo, ...videos]);
      setFormData({ title: '', desc: '' });
      setVideoFile(null);
      setShowModal(false);
    } catch (err) {
      alert("Failed to upload video.");
    }
  };

  if (loading) {
    return <main className="p-4 max-w-5xl mx-auto text-center"><p>Loading...</p></main>;
  }

  if (!user) return null;

  return (
    <div className="bg-[hsl(207,50%,90%)] min-h-screen">
      <main className="p-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10 pb-4">
          <div className="text-left">
            <h2 className="text-3xl font-bold pt-8"> Upload and discover insights from fellow Judokas</h2>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#B8D2D8] text-black mt-8 px-6 py-2 rounded-lg shadow hover:shadow-md hover:scale-105 transition"
          >
            + Upload Video
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center">Submit Your Video</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <p className="text-sm font-semibold">Logged in as: <span className="text-blue-700">{username}</span></p>
                <input
                  type="text"
                  name="title"
                  placeholder="Video Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  name="desc"
                  placeholder="Video Description"
                  value={formData.desc}
                  onChange={handleChange}
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <UploadModal onUpload={handleUpload} />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        <section className="mt-10">
          {videosLoading ? (
            <div className="text-center text-gray-500">Loading videos...</div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <div className='bg-gray-100'>
                  <VideoCard key={video.id || index} video={video} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p className="text-lg">No videos uploaded yet.</p>
              <p className="text-sm mt-1">Be the first to share your journey!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}