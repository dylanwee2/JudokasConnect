import { useState, useEffect } from 'react';
import { publicFetch } from '../utils/apis';

import { auth } from "../pages/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function DietPlan() {
  const [hasPersonalData, setHasPersonalData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [personalData, setPersonalData] = useState({
    currentWeight: '',
    currentBMI: '',
    targetWeight: '',
    targetBMI: '',
    goal: '',
    age: '',
    height: '',
    activityLevel: '',
    dietaryRestrictions: ''
  });

  const [user, loading] = useAuthState(auth);
  const [userId, setUserId] = useState(null);

  const checkPersonalData = async (userId) => {
    try {
      const response = await publicFetch.get(`/api/diet_plan/get_user_diet_plan/${userId}`);

      if (!response) {
        setHasPersonalData(false);
      } else {
        setHasPersonalData(true);
        setDietPlan(response);  // Also set diet plan here if needed
      }

    } catch (error) {
      console.error('Error checking personal data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPersonalData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setHasPersonalData(true);
      const diet_plan = await generateDietPlan();
      diet_plan["userId"] = userId;

      // Submit personal data to your backend
      const response = await publicFetch.post(`/api/diet_plan/add_diet_plan`, diet_plan);
    } catch (error) {
      console.error('Error submitting personal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDietPlan = async () => {
    setIsLoading(true);
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

      try {
        const parsedJson = JSON.parse(cleaned);
        console.log("✅ Diet plan loaded:", parsedJson);
        const diet_plan = {
          calorie_goal: parsedJson.calorie_goal,
          user_summary: parsedJson.user_summary,
          macros: parsedJson.macros,
          meals: parsedJson.meals,
          totals: parsedJson.totals,
          extra_tips: parsedJson.extra_tips,
          notes: parsedJson.notes
        }
        setDietPlan(diet_plan);

        return diet_plan;
      } catch (err) {
        console.error("❌ JSON Parse Error:", err);
      }
    } catch (error) {
      console.error("Error generating diet plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

    // Check if user has personal data on component mount
  useEffect(() => {
    if (loading || !user) return;

    if (!user) {
      console.log("User not logged in");
    } else {
      setUserId(user.uid);
    }

    checkPersonalData(user.uid);
  }, [user, loading]);

  // Personal Data Collection UI
  if (!hasPersonalData) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
              <span className="text-2xl font-bold">👤</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's Personalize Your Diet Plan</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              To create the perfect nutrition plan for you, we need some basic information about your goals and current stats.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Stats Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="text-blue-600 mr-2">⚖️</span>
                    Current Stats
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (kg)</label>
                    <input
                      type="number"
                      name="currentWeight"
                      value={personalData.currentWeight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 70"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={personalData.height}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 175"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={personalData.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 25"
                      required
                    />
                  </div>
                </div>

                {/* Goals Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="text-green-600 mr-2">🎯</span>
                    Your Goals
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Weight (kg)</label>
                    <input
                      type="number"
                      name="targetWeight"
                      value={personalData.targetWeight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 65"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Goal</label>
                    <select
                      name="goal"
                      value={personalData.goal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select your goal</option>
                      <option value="lose_weight">Lose Weight</option>
                      <option value="gain_muscle">Gain Muscle</option>
                      <option value="maintain">Maintain Weight</option>
                      <option value="lose_weight_gain_muscle">Lose Weight & Gain Muscle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                    <select
                      name="activityLevel"
                      value={personalData.activityLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select activity level</option>
                      <option value="sedentary">Sedentary (little/no exercise)</option>
                      <option value="light">Lightly active (1-3 days/week)</option>
                      <option value="moderate">Moderately active (3-5 days/week)</option>
                      <option value="very">Very active (6-7 days/week)</option>
                      <option value="extremely">Extremely active (2x/day)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions (Optional)</label>
                <textarea
                  name="dietaryRestrictions"
                  value={personalData.dietaryRestrictions}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., vegetarian, gluten-free, allergies..."
                  rows="3"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmitPersonalData}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Your Plan...
                  </>
                ) : (
                  <>
                    <span className="mr-2">👨‍🍳</span>
                    Create My Diet Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Diet Plan Display UI
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Diet Plan</h1>
          <p className="text-gray-600">Tailored nutrition to help you reach your goals</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your personalized diet plan...</p>
            </div>
          </div>
        ) : dietPlan ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  <div>
                    <p className="text-sm text-gray-600">Daily Calories</p>
                    <p className="text-2xl font-bold text-gray-900">{dietPlan.calorie_goal}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💪</span>
                  <div>
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-2xl font-bold text-gray-900">{dietPlan.macros.protein}g</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🌾</span>
                  <div>
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p className="text-2xl font-bold text-gray-900">{dietPlan.macros.carbs}g</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🥑</span>
                  <div>
                    <p className="text-sm text-gray-600">Fat</p>
                    <p className="text-2xl font-bold text-gray-900">{dietPlan.macros.fat}g</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <span className="text-blue-600 mr-2 text-xl">ℹ️</span>
                <h2 className="text-xl font-semibold text-gray-900">Plan Overview</h2>
              </div>
              <p className="text-gray-700">{dietPlan.user_summary}</p>
            </div>

            {/* Meals */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <span className="text-green-600 mr-2 text-xl">🍽️</span>
                <h2 className="text-xl font-semibold text-gray-900">Daily Meals</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {dietPlan.meals.map((meal, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-1">🕐</span>
                        {meal.time}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {meal.items.map((food, foodIndex) => (
                        <div key={foodIndex} className="flex items-center text-sm text-gray-700">
                          <span className="text-green-500 mr-2">✅</span>
                          {food}
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-600 font-medium">
                      {meal.calories} calories
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips and Notes */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Extra Tips</h3>
                <p className="text-gray-700">{dietPlan.extra_tips}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Important Notes</h3>
                <p className="text-gray-700">{dietPlan.notes}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <button
                onClick={() => setHasPersonalData(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Update Personal Data
              </button>
              <button
                onClick={generateDietPlan}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Generate New Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-4">No diet plan generated yet.</p>
            <button
              onClick={generateDietPlan}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Diet Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}