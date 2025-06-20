import { useState, useEffect } from 'react';
import UploadModal from '../components/uploadModal';
import VideoCard from '../components/videocard';
import { publicFetch } from '../utils/apis';
import { useRouter } from "next/navigation";

// User Auth
import { auth } from "../pages/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Home() {
  // Load User Account Details
  const [user, loading] = useAuthState(auth);

  // Set Current User ID Function
  const [currentUserId, setUserId] = useState(null);
  const [usename, setUsername] = useState(null);

  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    userId: currentUserId,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait until loading is done

    if (!user) {
      console.log("User is not logged in");
      alert("Please login to upload videos");
      router.push('/login');
    } 
    else {
      console.log("User:", user);
      setUserId(user.uid);
      setUsername(user.displayName);
      // Load videos after user is authenticated
      get_Videos();
    }
  }, [user, loading, router]);

  const get_Videos = async () => {
    try {
      setVideosLoading(true);
      const response = await publicFetch.get('/api/images/list');
      console.log("Videos response:", response);
      
      // Handle the response structure from backend
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
      console.error("Error getting videos", err.message);
      alert("Failed to get videos.");
      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpload = (file) => {
    setVideoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Please upload a video file before submitting.");
      return;
    }

    if (!currentUserId) {
      alert("User not logged in.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('id', ''); // Backend overwrites this anyway
    formDataToSend.append('title', formData.title);
    formDataToSend.append('desc', formData.desc);
    formDataToSend.append('userId', currentUserId);
    formDataToSend.append('file', videoFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/upload`, {
        method: "POST",
        body: formDataToSend,
      });
        
      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Raw error response:", errorText);
        throw new Error("Upload failed - see console for details.");
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log("Upload success", data);

        const newVideo = {
          id: data.id,
          title: data.title,
          desc: data.desc,
          url: data.videoLink,
          userId: data.userId
        };

        setVideos([newVideo, ...videos]);
        setFormData({ title: '', desc: '' });
        setVideoFile(null);
        setShowModal(false);
      } else {
        const text = await response.text();
        console.error("Expected JSON but got:", text);
        throw new Error("Upload failed: response not JSON");
      }
    } catch (err) {
      console.error("Upload failed", err.message);
      alert("Failed to upload video.");
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main className="p-4 max-w-5xl mx-auto">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold">🎬 Video Sharing Platform</h1>
          <p className="text-3xl">Learn from the best!</p>
        </div>
        <div className="ml-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Upload Video
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4">Submit Your Video</h2>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
              <p><b>Username: {usename}</b></p>
              <input
                type="text"
                name="title"
                placeholder="Video Title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="desc"
                placeholder="Video Description"
                value={formData.desc}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <UploadModal onUpload={handleUpload} />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Video Display Section */}
      <div className="mt-6">
        {videosLoading ? (
          <div className="text-center">
            <p>Loading videos...</p>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <VideoCard key={video.id || index} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No videos uploaded yet</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to share a video!</p>
          </div>
        )}
      </div>
    </main>
  );
}