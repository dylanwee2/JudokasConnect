  import Head from "next/head";
  import { useEffect, useState } from 'react';
  import { auth } from "./firebase";
  import { useAuthState } from 'react-firebase-hooks/auth';
  import { useRouter } from "next/navigation";
  import { authFetch } from '../utils/apis';
  import EditUserModal from "../components/editUserModal";   

  export default function Profile() {
      const router = useRouter();
      const [user, loading] = useAuthState(auth);
      const [user_photo, setUserPhoto] = useState(null);
      const [profile, setProfile] = useState(null);
      const [editUserModal, setEditUserModalOpen] = useState(false);
      const [selectedUser, setSelectedUser] = useState(null);
      const [username, setUsername] = useState(null);
      const [userEmail, setUserEmail] = useState(null);

      const editProfile = async (profileData) => {
          try {
              await authFetch.put(`/api/users/update_user/${user.uid}`, profileData);
              setProfile(profileData);
              alert("Profile updated successfully!");
          } catch (error) {
              alert("Failed to update profile.");
          }
          setEditUserModalOpen(false);
      }

      const getProfilePhoto = async () => {
          try {
            const userPhoto = await authFetch.get(`/api/images/${user.uid}`);

            if (userPhoto && userPhoto.video.url) {
              const imageWithTimestamp = `${userPhoto.video.url}?t=${Date.now()}`;
              setUserPhoto(imageWithTimestamp);
              localStorage.setItem("userPhoto", imageWithTimestamp);
              window.dispatchEvent(new Event("profile-photo-updated"));
            }

          } catch (error) {
            setUserPhoto(null);
          }
        }

      const handleUpload = async (file) => {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/profilePhoto/${user.uid}`, {
            method: "POST",
            body: formData, 
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${response.status} - ${errorText}`);
          }
          await getProfilePhoto(); 
        } catch (err) {
          console.error("[UPLOAD ERROR]", err);
          alert("Failed to upload profile photo.");
        }
      };

      const clickEditUserButton = (profileData) => {
          setEditUserModalOpen(true);
          setSelectedUser(profileData);
      }
      
      useEffect(() => {
          if (loading) return;
          if (!user) {
            alert("You are not logged in. Please log in to access your profile.");
            router.push('/login');
          } else {
            setUsername(user.displayName);
            setUserEmail(user.email);
            const fetchProfile = async () => {
              try {
                const data = await authFetch.get(`/api/users/${user.uid}`);
                setProfile(data);
              } catch (err) {
                alert("Failed to load profile data.");
              }
            };
            fetchProfile();
            getProfilePhoto();
          }
        }, [loading, user, router]);

      return (
        <div className="bg-hsl(191, 29%, 78%) min-h-screen pt-10">
          <Head>
            <title>Profile Page</title>
          </Head>

          {/* Main Content */}
          <div className="bg-[hsl(207,50%,90%)] max-w-4xl mx-auto flex flex-col md:flex-row gap-8 p-10 rounded-2xl shadow-lg">
            {/* Left: Avatar and Welcome */}
            <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
              {/* Avatar */}
              {user_photo ? (
                <img
                  src={user_photo}
                  alt="User Avatar"
                  width={112}
                  height={112}
                  className="w-28 h-28 rounded-full mb-4 shadow-lg object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-[#FCEDED] flex items-center justify-center text-[hsl(191,30%,60%)] text-5xl font-bold mb-4 shadow-lg">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </div>
              )}
                <h1 className="text-3xl font-bold text-[hsl(191,30%,60%)] mb-2">
                  Welcome, {username || "User"}
                </h1>
                {/* Profile Picture Upload */}
                <label className="cursor-pointer bg-[#FCEDED] text-[hsl(191,30%,60%)] px-4 py-2 rounded shadow hover:bg-[#FBE3D1] hover:text-[#B8D2D8] mt-2 transition shadow-xl inline-block">
                  <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    await handleUpload(file);
                    }
                  }}
                  />
                  Upload Profile Photo
                </label>
                <button
                  onClick={() => {
              clickEditUserButton(profile);
              }}
              className="bg-[#FCEDED] text-[hsl(191,30%,60%)] px-4 py-2 rounded shadow hover:bg-[#FBE3D1] hover:text-[#B8D2D8] mt-2 transition shadow-xl"
              >
                Edit Profile Data
              </button>
            </div>

            {/* Right: Bio and Quick Stats */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Bio Card */}
              <div className="bg-[#FCEDED] rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl text-[hsl(191,30%,60%)] font-bold mb-4">Bio</h2>
                <p className="text-[#222] leading-relaxed">
                  {profile?.bio || "Please update your profile with a bio."}
                </p>
              </div>
              {/* Quick Stats Card */}
              <div className="bg-[#FCEDED] rounded-xl p-6 shadow-xl">
                <h2 className="text-2xl text-[hsl(191,30%,60%)] font-bold mb-4">Quick Stats</h2>
                <div className="flex items-center mb-2">
                  <span className="inline-flex w-6 h-6 mr-2 bg-[#E9EFF4] rounded-full items-center justify-center">
                    {/* School icon placeholder */}
                    <svg className="w-4 h-4 text-[hsl(191,30%,60%)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L2 7l8 5 8-5-8-5zm0 13a8 8 0 01-8-8h2a6 6 0 0012 0h2a8 8 0 01-8 8z"/>
                    </svg>
                  </span>
                  <span className="text-[#222]">School: {profile?.school || "N/A"}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="inline-flex w-6 h-6 mr-2 bg-[#E9EFF4] rounded-full items-center justify-center">
                    {/* Role icon placeholder */}
                    <svg className="w-4 h-4 text-[hsl(191,30%,60%)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z"/>
                    </svg>
                  </span>
                  <span className="text-[#222]">Role: {profile?.role || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex w-6 h-6 mr-2 bg-[#E9EFF4] rounded-full items-center justify-center">
                    {/* Email icon placeholder */}
                    <svg className="w-4 h-4 text-[hsl(191,30%,60%)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.94 6.94A8 8 0 0110 2a8 8 0 017.06 4.94l-7.06 4.12-7.06-4.12zM2 8.12V16a2 2 0 002 2h12a2 2 0 002-2V8.12l-7.06 4.12a1 1 0 01-1.88 0L2 8.12z"/>
                    </svg>
                  </span>
                  <span className="text-[#222]">Email: {userEmail || ""}</span>
                </div>
              </div>
            </div>
          </div>

          <EditUserModal 
            isOpen={editUserModal} 
            onClose={() => setEditUserModalOpen(false)} 
            onSubmit={editProfile} 
            profiledata={selectedUser}
          />
        </div>
      );
  }
