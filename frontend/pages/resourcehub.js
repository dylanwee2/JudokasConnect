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
    <div className="flex flex-col items-center gap-6 p-4 md:p-6 bg-[#FDF6F0] min-h-screen">
      {exercises.map((exercise, index) => (
        <Link 
          key={index}
          href={`/resourcehub/${exercise.id}`}
          className="w-full max-w-4xl"
        >
          <div className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden w-full">
            {/* Image Section */}
            <div className="w-full sm:w-1/2 aspect-video">
              <img
                src={exercise.photoUrl || "/placeholder.png"}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Section */}
            <div className="w-full sm:w-1/2 flex flex-col justify-center p-4 sm:p-6 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{exercise.name}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm sm:text-base text-gray-700">
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