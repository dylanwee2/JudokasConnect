import React, { useState, useEffect } from "react";
import { auth } from "../pages/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function EditThreadModal({ isOpen, onClose, onSubmit, threaddata}) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("General");
    const [content, setContent] = useState("");

    const [user, loading] = useAuthState(auth);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);


    const handleSubmit = () => {
        const forumData = {
            comments: threaddata.comments,
            id: threaddata.id,
            username: username,
            userId: userId,
            title: title,
            category: category,
            content: content
        };

        onSubmit(forumData);

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
        }
        
        console.log(threaddata);
        if (isOpen && threaddata) {
            setTitle(threaddata.title || "");
            setCategory(threaddata.category || "General");
            setContent(threaddata.content || "");
        }
    }, [user, loading, threaddata]);
    
    if (!isOpen){
        return null;
    } 

return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">📝 Edit Thread</h2>

        <input
        type="text"
        placeholder="Thread title"
        className="w-full mb-4 px-4 py-2 border rounded-md"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />

        <select
        className="w-full mb-4 px-4 py-2 border rounded-md"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        >
        <option>General</option>
        <option>Help</option>
        <option>Announcements</option>
        <option>Off Topic</option>
        </select>

        <textarea
        placeholder="Content..."
        rows={4}
        className="w-full mb-4 px-4 py-2 border rounded-md"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <div className="flex justify-end gap-2">
        <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
            Cancel
        </button>
        <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
            Save
        </button>
        </div>

        <button
        className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
        onClick={onClose}
        >
        &times;
        </button>
    </div>
    </div>
);
}
