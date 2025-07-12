import { useRef, useState } from 'react';

export default function UploadModal({ onUpload }) {
  const inputRef = useRef(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file); // send the real file to parent
      setPreviewURL(URL.createObjectURL(file)); // create preview URL
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center bg-white/30">
      
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
        ref={inputRef}
      />

      {!previewURL ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-[#B8D2D8] px-4 py-2 rounded-md hover:bg-[#97BBC3]"
        >
          Attach Video
        </button>
      ) : (
        <video
          src={previewURL}
          controls
          className="w-full max-h-64 rounded"
        />
      )}
    </div>
  );
}