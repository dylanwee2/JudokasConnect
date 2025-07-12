import React, { useState, useEffect } from "react";
import { auth } from "../pages/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function EditUserModal({ isOpen, onClose, onSubmit, profiledata}) {
    const [bio, setBio] = useState("");
    const [school, setSchool] = useState("");
    const [role, setRole] = useState("");

    const [user, loading] = useAuthState(auth);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);

    const handleSubmit = () => {
        const userData = {
            uid: user.uid,
            email: email,
            username: username,
            bio: bio,
            school: school,
            role: role,
            userId: userId
        };
        console.log(userData)
        onSubmit(userData);

        onClose();
    };

    useEffect(() => {
        if (loading) return; // wait until loading is done

        if (!user) {
        console.log("User is not logged in");
        }
        else {
            setUserId(user.uid);
            setUsername(user.displayName);
            setEmail(user.email);
            
        }

        if (isOpen && profiledata) {
            setSchool(profiledata.school || "");
            setBio(profiledata.bio || "");
            setRole(profiledata.role || "");
        }
}, [user, loading, profiledata]);

    if (!isOpen){
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-4">📝 Edit User</h2>
                {/* Input fields */}
                <input
                    type="text"
                    placeholder="bio"
                    className="w-full mb-4 px-4 py-2 border rounded-md"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="School"
                    className="w-full mb-4 px-4 py-2 border rounded-md"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Role"
                    className="w-full mb-4 px-4 py-2 border rounded-md"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />
                
                {/* Buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-[#B8D2D8] px-4 py-2 rounded-md hover:bg-[#97BBC3]"
                    >
                        Save
                    </button>
                </div> 
            </div>
        </div>
        
)    
}