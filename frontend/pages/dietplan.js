import { useState, useEffect } from 'react';
import { publicFetch } from '../utils/apis';

export default function DietPlan() {
  const handleUpload = async () => {
    console.log("handle function working");
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/diet_plan`, {
        method: "POST",
        });

        if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API Error: ${res.status} - ${errText}`);
        }

        const raw = await res.json();
        const rawText = raw?.data;

        // Remove the ```json ... ``` block wrapper
        const cleaned = rawText.replace(/^```json\s*|\s*```$/g, '');

        let parsedJson;
        try {
          parsedJson = JSON.parse(cleaned);
          console.log("✅ Parsed JSON:", parsedJson);
          console.log("Meals:", parsedJson.meals);
          console.log("Marcos:", parsedJson.macros);
          console.log("Calorie goal:", parsedJson.calorie_goal);
          console.log("Notes:", parsedJson.notes);
          console.log("Tips:", parsedJson.extra_tips);
          console.log("Total:", parsedJson.totals);
          console.log("User Summary:", parsedJson.user_summary);
        } 
        catch (err) {
          console.error("❌ JSON Parse Error:", err);
          console.log("⚠️ Raw cleaned text:", cleaned);
        }

    }
    catch (error) {
      console.log("Error getting video analysis:", error);
    }
  };

  // useEffect(() => {
  //   if (videoFile) {
  //     console.log("Updated video file:", videoFile);
  //   }
  // }, [videoFile]);

  return (
    <div className="p-8">
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Analyze Video
      </button>
    </div>
  );
}