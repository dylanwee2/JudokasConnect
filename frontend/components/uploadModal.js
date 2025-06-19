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
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
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