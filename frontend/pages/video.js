import { useState } from 'react';
import Upload from '../components/upload';
import VideoCard from '../components/videocard';

export default function Home() {
  const [videos, setVideos] = useState([]);

  const handleUpload = (videoData) => {
    setVideos([videoData, ...videos]);
  };

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🎬 VideoShare</h1>
      <Upload onUpload={handleUpload} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {videos.map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>
    </main> 
  );
}


