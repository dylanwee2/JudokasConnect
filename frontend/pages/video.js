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
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    userId: currentUserId,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    get_Videos();
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
    }
  }, [user, loading]);

  const get_Videos = async () => {
    try {
      const response = await publicFetch.get(`/api/images/list`);
      console.log(response.data);
      setVideos(response.data || []);
    } catch (err) {
      console.error("Error getting videos", err.message);
      alert("Failed to get videos.");
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
        const errorText = await response.text(); // fallback for HTML error page
        console.error("Raw error response:", errorText);
        throw new Error("Upload failed - see console for details.");
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log("Upload success", data);

        const newVideo = {
          title: data.title,
          desc: data.desc,
          url: data.videoLink,
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



  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🎬 VideoShare</h1>

      <div className="text-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Upload Video
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {videos.map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>
    </main>
  );
} 