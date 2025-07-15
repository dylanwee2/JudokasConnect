// import React, { useState, useEffect } from "react";
// import { publicFetch } from '../utils/apis'; 
// import Image from 'next/image';
// import Link from 'next/link';

// export default function Resourcehub() {
//     const [exercises, setExercises] = useState([]);

//     useEffect(() => {
//     const get_all_exercises = async () => {
//       try {
//         const exercises_data = await publicFetch.get("/api/exercises/");
//         setExercises(exercises_data);
//         console.log("Fetched exercises:", exercises_data);
//       } 
//       catch (error) {
//         console.error("Error fetching exercises data:", error.message);
//       }
//     };

//     get_all_exercises();
//   }, []); // <- empty dependency array ensures it runs only once

// return (
//     <div className="flex flex-col items-center gap-6 p-6 min-h-screen" style={{ backgroundColor: '#FDF6F0' }}>
//       {exercises.map((exercise, index) => (
//         <Link 
//           key={index}
//           href={`/resourcehub/${exercise.id}`} // Navigate to dynamic route
//           className="w-full max-w-4xl"
//         >
//           <div className="flex flex-col md:flex-row items-center rounded-2xl shadow-lg overflow-hidden w-full cursor-pointer hover:shadow-xl transition-shadow bg-neutral-100"> 
//             <div className="flex flex-col justify-center p-6 flex-grow">
//               <h2 className="text-2xl text-stone-950 font-bold mb-4">{exercise.name}</h2>
//               <div className="flex flex-wrap gap-6 text-gray-700 text-sm">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xl">⏱️</span>
//                   <span>{exercise.duration} minutes</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xl">🔥</span>
//                   <span>{exercise.calories} calories</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xl">🏃‍♂️</span>
//                   <span>Number of exercises: {exercise.num_exercises}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="relative w-full md:w-1/3 aspect-video">
//       <img src={exercise.photoUrl || "/placeholder.png"} alt="My Image" />

//             </div>
//           </div>
//         </Link>
//       ))}

//     </div>
//   );
// }


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