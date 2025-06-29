import Head from "next/head";
import { useEffect, useState } from 'react';
import styles from "../styles/Home.module.css";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/navigation";
import { authFetch } from '../utils/apis';
import EditUserModal from "../components/editUserModal";   
import { publicFetch } from '../utils/apis';


export default function Profile() {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const [profile, setProfile] = useState(null);

    const [editUserModal, setEditUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);


    const editProfile = async (profileData) => {
        try {
            await authFetch.put(`/api/users/update_user/${user.uid}`, profileData); // Assuming backend has this endpoint

            setProfile(profileData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error.message);
            alert("Failed to update profile.");
        }
        setEditUserModalOpen(false);
    }

    const clickEditUserButton = (profileData) => {
        setEditUserModalOpen(true);
        console.log(profileData);
    }
    
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
            <div className="flex items-center justify-between pl-10 pr-10"> 
              <h1 className="text-2xl font-bold mr-6">
                Welcome, {profile.name || user.email}
              </h1>
              <div>
              <button
                onClick={() => {
                  clickEditUserButton(profile);
                  setSelectedUser(profile)
                }}
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
          </div>
         

            {/* Description */}
        <div className="m-10">
          <div className="bg-gray-700 rounded-xl p-4">
            <p className="text-gray-300 leading-relaxed">
              {profile.bio || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </p>
          </div>
        </div>
        
         {/* Content Sections */}
        <div className="m-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Stats */}
              <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl text-white font-bold"><u>Quick Stats</u></h2>
                <div className="flex items-center pt-3">
                  <img src="/school_logo.png" alt="School Logo" className="w-7 h-7 mb-4 mr-2"/>
                  <p className="text-white mb-2 flex items-center">School: {profile.school}</p>
                </div>
                <div className="flex items-center pt-3">
                  <img src="/role_logo.png" alt="Role Logo" className="w-7 h-7 mb-4 mr-2"/>
                  <p className="text-white mb-2 flex items-center">Role: {profile.role}</p>
                </div>
                <div className="flex items-center pt-3">
                  <img src="/email_logo.png" alt="Email Logo" className="w-7 h-7 mb-4 mr-2"/>
                  <p className="text-white mb-2 flex items-center">Email: {user.email}</p>
                </div>
                
                
              </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="mt-10 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Logout
          </button>
        </div>
          
      </div>  
      )}

      <EditUserModal 
        isOpen={editUserModal} 
        onClose={() => setEditUserModalOpen(false)} 
        onSubmit={editProfile} 
        profiledata={selectedUser}>
      </EditUserModal>
    </div>

  );
}


