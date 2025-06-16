import React, { useState, useEffect } from "react";
import { publicFetch } from '../utils/apis';
import { auth } from "../pages/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

import NewThreadModal from "../components/addDiscussionModal";
import EditThreadModal from "../components/editDiscussionModal";
import CommentModal from "../components/commentsModal";

export default function ForumPage() {
  // Load discussion data
  const [threads, setThreads] = useState([]);

  // Set selected thread data
  const [selectedThread, setSelectedThread] = useState(null);

  // Open Modals
  const [addDiscussionModal, setAddDiscussionModalOpen] = useState(false);
  const [editDiscussionModal, setEditDiscussionModalOpen] = useState(false);
  const [commentModal, setCommentModalOpen] = useState(false);

  // Comments
  const [comments, setComments] = useState([
    { id: '1', username: 'dylanwee', text: 'Nice post!' },
    { id: '2', username: 'bob', text: 'I agree with this.' },
  ]);

  // User account data 
  const [user, loading] = useAuthState(auth);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  const get_all_discussions = async () => {
    try {
      const discussions_data = await publicFetch.get(`/api/discussions/`);
      setThreads(discussions_data);
    } 
    catch (error) {
        console.error("Error adding forum:", error.message);
        alert("Failed to add forum.");
    }
  };

  const addForum = async (forumData) => {
    console.log(forumData);
    try {
      await publicFetch.post(`/api/discussions/add_dicussion`, forumData);
      get_all_discussions();
    } 
    catch (error) {
        console.error("Error adding forum:", error.message);
        alert("Failed to add forum.");
    }
  };

  const editForum = async (forumData) => {
    const forumId = forumData.id;
    try {
      await publicFetch.put(`/api/discussions/update_discussion/${forumId}`, forumData);
      get_all_discussions();
    } 
    catch (error) {
        console.error("Error adding forum:", error.message);
        alert("Failed to add forum.");
    }
  };

  const clickForum = async (forumData) => {
    setCommentModalOpen(true);
  };

  const handleAddComment = () => {
    // Add comment logic here
    console.log("add comment");
  };

  const handleEditComment = (comment) => {
    // Edit comment logic here]
    console.log("edit comment");
  };

  const handleDeleteComment = (comment) => {
    // Delete logic here
    console.log("delte comment");
  };


  const clickEditForumButton = async (forumData) => {
    if(user.uid == forumData.userId){
      setEditDiscussionModalOpen(true);
    }
  };

  const deleteForum = async (forumData) => {
    const forumId = forumData.id;
    try {
      await publicFetch.delete(`/api/discussions/delete_discussion/${forumId}`);
      get_all_discussions();
    } 
    catch (error) {
        console.error("Error deleting forum:", error.message);
        alert("Failed to delete forum.");
    }
  };

  useEffect(() => {
    if (loading) return; // wait until loading is done

    if (!user) {
    console.log("User is not logged in");
    }
    else {
    setUserId(user.uid);
    setUsername(user.displayName);
    get_all_discussions();
    }
  }, [user, loading]);


  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">💬 Discussion Forum</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick= {() => {
                setAddDiscussionModalOpen(true);
                }}>
          + New Post
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <select className="w-full sm:w-1/4 px-3 py-2 border rounded-lg shadow-sm focus:outline-none">
          <option>All Categories</option>
          <option>General</option>
          <option>Announcements</option>
          <option>Help</option>
          <option>Off Topic</option>
        </select>
      </div>

      {/* Thread List */}
      <div className="space-y-5">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
            onClick={() => {
              clickForum(thread);
            }}
          >
            {/* Title + Edit/Delete buttons */}
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xl font-semibold hover:text-blue-600 cursor-pointer">
                {thread.title}
              </h2>

              {user.displayName === thread.username && (
                <div className="flex gap-2 items-center ml-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      clickEditForumButton(thread);
                      setSelectedThread(thread);
                    }}
                    className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteForum(thread);
                    }}
                    className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <p className="text-gray-600 mb-2 line-clamp-2">{thread.content}</p>

            {/* Tags + Author */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                  {thread.category}
                </span>
                <span>👤 by {thread.username}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewThreadModal
        isOpen={addDiscussionModal}
        onClose={() => setAddDiscussionModalOpen(false)}
        onSubmit={addForum}
      />

      <CommentModal
        isOpen={commentModal}
        onClose={() => setCommentModalOpen(false)}
        comments={comments}
        currentUser={user}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />

      <EditThreadModal
        isOpen={editDiscussionModal}
        onClose={() => setEditDiscussionModalOpen(false)}
        onSubmit={editForum}
        threaddata={selectedThread}
      />

    </div>
  );
}
