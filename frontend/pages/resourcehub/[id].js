import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { publicFetch } from "../../utils/apis";

const convertToEmbedUrl = (url) => {
  if (!url) return "";

  try {
    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop().split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("watch?v=")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("/shorts/")) {
      const videoId = url.split("/shorts/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  } catch (e) {
    console.error("Invalid video URL:", url);
    return "";
  }
};

export default function ExerciseDetail() {  
  const router = useRouter();
  const { id } = router.query;
  const [exercise, setExercise] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchExercise = async () => {
      try {
        const data = await publicFetch.get(`/api/exercises/${id}`);
        console.log("Fetched exercise data:", data);
        setExercise(data);
      } catch (error) {
        console.error("Failed to fetch exercise:", error);
      }
    };

    fetchExercise();
  }, [id]);

  if (!exercise) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-6">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-3xl font-bold">{exercise.name}</h1>
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline text-sm"
      >
        ← Back
      </button>
    </div>
      <p className="text-gray-700 mb-2">⏱️ {exercise.duration} minutes</p>
      <p className="text-gray-700 mb-4">🔥 {exercise.calories} calories</p>

      <h2 className="text-xl font-semibold mb-2">Exercises Included:</h2>
      <ul className="list-disc pl-6 text-gray-800">
        {exercise.list_exercises.map((ex, idx) => (
          <li key={idx}>{ex.name}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Exercise Demos:</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {exercise.list_exercises.map((ex, idx) => (
          <div key={idx} className="aspect-video w-full">
            <p className="font-medium mb-2">{ex.name}</p>
            {ex.videoUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={convertToEmbedUrl(ex.videoUrl)}
                title={ex.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            ) : (
              <p className="text-sm text-gray-500">No video available.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}