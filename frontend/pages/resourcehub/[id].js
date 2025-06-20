import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { publicFetch } from "../../utils/apis";

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
      <h1 className="text-3xl font-bold mb-4">{exercise.name}</h1>
      <p className="text-gray-700 mb-2">⏱️ {exercise.duration} minutes</p>
      <p className="text-gray-700 mb-4">🔥 {exercise.calories} calories</p>

      <h2 className="text-xl font-semibold mb-2">Exercises Included:</h2>
      <ul className="list-disc pl-6 text-gray-800">
        {exercise.map((ex, idx) => (
          <li key={idx}>{ex}</li>
        ))}
      </ul>
    </div>
  );
}