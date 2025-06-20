import { useEffect } from "react";
import { auth } from "../pages/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  
  useEffect(() => {
    if (loading) return; // wait until loading is done

    if (!user) {
      console.log("User is not logged in");
    } else {
      console.log("User:", user);
    }
  }, [user, loading]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="mx-20">
        <div className="flex justify-between h-16 items-center">

          <div className="flex items-center space-x-8">
            <img src="/judokaslogo.jpg" className="h-8 w-8 rounded-full" />
            <a href="/" className="text-xl font-bold text-gray-800">JudokasConnect</a>
            <div className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
              <a href="/events" className="text-gray-600 hover:text-blue-600">Training Sessions</a>
              <a href="/discussion" className="text-gray-600 hover:text-blue-600">Discussion</a>
              <a href="/video" className="text-gray-600 hover:text-blue-600">Video Sharing</a>
              <a href="/resourcehub" className="text-gray-600 hover:text-blue-600">Resource Hub</a>
            </div>
          </div>
        
          <div className="flex items-center space-x-4">
            <a href="/profile">
                <img src="/profile.svg" className="h-8 w-8 rounded-full" alt="Profile" />
            </a>
            {user && (
              <>
                <span className="text-gray-800 font-medium">
                  Welcome back, {user.displayName || user.email.split('@')[0]}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}