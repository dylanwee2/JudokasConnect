import { useEffect, useState } from "react";
import { auth } from "../pages/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [photoUrl, setPhotoUrl] = useState(null);
  
  useEffect(() => {
    if (loading) return; // wait until loading is done

    if (!user) {
      console.log("User is not logged in");
    } else {
      console.log("User:", user);
      const storedPhoto = localStorage.getItem("userPhoto");
      if (storedPhoto) {
      setPhotoUrl(storedPhoto);
    } else {
      setPhotoUrl(null);
    }
    }
  }, [user, loading]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-[#B8D2D8] to-[#E9EFF4] shadow">
      <div className="mx-20">
        <div className="flex justify-between h-16 items-center">

          <div className="flex items-center space-x-8">
            <img src="/judokaslogo.jpg" className="h-8 w-8 rounded-full" />
            <a href="/" className="text-xl font-bold text-black">JudokasConnect</a>
            <div className="hidden md:flex space-x-6">
              <a href="/" className="text-black-600 hover:text-black">Home</a>
              <a href="/events" className="text-black hover:text-black">Training Sessions</a>
              <a href="/discussion" className="text-black hover:text-black">Discussion</a>
              <a href="/video" className="text-black hover:text-black">Video Sharing</a>
              <a href="/resourcehub" className="text-black hover:text-black">Exercises</a>
              <a href="/dietplan" className="text-black hover:text-black">Personalized AI Diet Plan</a>
            </div>
          </div>
        
          <div className="flex items-center space-x-4">
            <a href="/profile">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="h-8 w-8 rounded-full" />
                ) : (
                  <img src="/profile.svg" alt="Default Profile" className="h-8 w-8 rounded-full" />
                )}
            </a>
            {user && (
              <>
                <span className="text-black font-medium">
                  Welcome back, {user.displayName || user.email.split('@')[0]}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-[#B8D2D8] text-black px-3 py-1 rounded hover:bg-orange-600"
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