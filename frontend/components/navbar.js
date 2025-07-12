import { useState, useEffect } from "react";
import { auth } from "../pages/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (loading) return;
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
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center space-x-4">
            <img src="/judokaslogo.jpg" className="h-8 w-8 rounded-full" alt="Logo" />
            <a href="/" className="text-xl font-bold text-black">JudokasConnect</a>
          </div>

          {/* Full Nav - visible only on xl and above */}
          <div className="hidden xl:flex items-center space-x-6 text-black font-medium">
            <a href="/" className="hover:text-orange-600">Home</a>
            <a href="/events" className="hover:text-orange-600">Training Sessions</a>
            <a href="/discussion" className="hover:text-orange-600">Discussion</a>
            <a href="/video" className="hover:text-orange-600">Video Sharing</a>
            <a href="/resourcehub" className="hover:text-orange-600">Exercises</a>
            <a href="/dietplan" className="hover:text-orange-600">AI Diet Plan</a>
          </div>

          {/* Profile & Logout (always visible on xl) */}
          <div className="hidden xl:flex items-center space-x-4">
            <a href="/profile">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="h-8 w-8 rounded-full" />
                ) : (
                  <img src="/profile.svg" alt="Default Profile" className="h-8 w-8 rounded-full" />
                )}
            </a>
            {user && (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-[#B8D2D8] text-black px-3 py-1 rounded hover:bg-orange-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Hamburger Icon - visible only on xl and below */}
          <div className="xl:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsible Menu for smaller screens */}
        {menuOpen && (
          <div className="xl:hidden mt-2 space-y-2 text-black font-medium">
            <div className="flex flex-col space-y-2">
              <a href="/" className="hover:text-orange-600">Home</a>
              <a href="/events" className="hover:text-orange-600">Training Sessions</a>
              <a href="/discussion" className="hover:text-orange-600">Discussion</a>
              <a href="/video" className="hover:text-orange-600">Video Sharing</a>
              <a href="/resourcehub" className="hover:text-orange-600">Exercises</a>
              <a href="/dietplan" className="hover:text-orange-600">AI Diet Plan</a>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <a href="/profile">
                <img src="/profile.svg" className="h-8 w-8 rounded-full" alt="Profile" />
              </a>
              {user && (
                <>

                  <div className="py-3">
                  <button
                    onClick={handleLogout}
                    className="bg-[#B8D2D8] text-black px-3 py-1 rounded hover:bg-orange-600"
                  >
                    Logout
                  </button>
                </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}