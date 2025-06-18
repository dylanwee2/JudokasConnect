import { useRef } from 'react';

export default function Upload({ onUpload }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      onUpload({ name: file.name, url: videoURL });
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center">
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
        ref={inputRef}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
      >
        Upload Video
      </button>
    </div>
  );
}