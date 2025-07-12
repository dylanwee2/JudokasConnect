import React, { useState, useEffect } from "react";
import { publicFetch } from '../utils/apis'; 
import Link from 'next/link';

export default function Resourcehub() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const get_all_exercises = async () => {
      try {
        const exercises_data = await publicFetch.get("/api/exercises/");
        setExercises(exercises_data);
        console.log("Fetched exercises:", exercises_data);
      } catch (error) {
        console.error("Error fetching exercises data:", error.message);
      }
    };

    get_all_exercises();
  }, []);

return (
    
    <div className="bg-[hsl(207,50%,90%)] flex flex-col items-center gap-6 p-6 min-h-screen">
      <div className="text-left">
        <h2 className="text-[hsl(191,30%,60%)] text-3xl font-extrabold"> Types of Exercises</h2>
      </div>
      {exercises.map((exercise, index) => (
        <Link 
          key={index}
          href={`/resourcehub/${exercise.id}`} // Navigate to dynamic route
          className="bg-gray-100 w-full max-w-4xl"
        >
          <div className="bg-gray-100 flex flex-col md:flex-row items-center rounded-2xl shadow-lg overflow-hidden w-full cursor-pointer hover:shadow-xl transition-shadow">
            <div className="flex flex-col justify-center p-6 flex-grow">
              <h2 className="text-2xl font-bold mb-4">{exercise.name}</h2>
              <div className="flex flex-wrap gap-6 text-gray-700 text-sm">
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{exercise.duration} mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔥</span>
                  <span>{exercise.calories} cal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏃‍♂️</span>
                  <span>{exercise.num_exercises} exercises</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}