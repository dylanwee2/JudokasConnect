import Head from "next/head";
import { useEffect, useState } from 'react';
import styles from "../styles/Home.module.css";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/navigation";
import { authFetch } from '../utils/apis';



function Profile() {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const [profile, setProfile] = useState(null);
    
    useEffect(() => {
        if (loading) return; // wait until loading is done

        if (!user) {
          console.log("User is not logged in");
          alert("You are not logged in. Please log in to access your profile.");
          router.push('/login');
        } 
        else {
          const fetchProfile = async () => {
            try {
              const data = await authFetch.get(`/api/users/${user.uid}`); // Assuming backend has this endpoint
              setProfile(data);
            } 
            catch (err) {
              console.error("Error fetching profile:", err.message);
              alert("Failed to load profile data.");
            }
          };

          fetchProfile();
        }
      }, [loading, user, router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };


  return (
    <div className="bg-gray-200 h-150 mx-50 mt-10">
      <Head>
        <title>Profile Page</title>
      </Head>

      {!profile ? (
        <p>Loading profile...</p>
      ) : (
        <div>
          <div className="w-full ml-10 pt-5 bold inline">
            <h1 className="pl-10 text-2xl font-bold">Welcome, {profile.name || user.email}</h1>

            <div className="pr-10 flex justify-end">
              <button
                onClick={handleLogout}
                className="bg-orange-500 text-white px-4 py-2 mr-5 rounded hover:bg-orange-600"
              >
                Edit
              </button>
              <button
                onClick={handleLogout}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Add Friend
              </button>
            </div>
            
          </div>

          <div>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
