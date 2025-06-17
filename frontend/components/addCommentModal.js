import React, { useState, useEffect } from "react";
import { auth } from "../pages/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AddCommentModal({
  isOpen,
  onClose,
  onSubmit,
  threadData,
  editingComment = null, // NEW: for edit mode
}) {
  const [content, setContent] = useState("");
  const [user, loading] = useAuthState(auth);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  // Prefill for editing
  useEffect(() => {
    if (editingComment) {
      setContent(editingComment.content);
    } else {
      setContent("");
    }
  }, [editingComment]);

  // Load user
  useEffect(() => {
    if (loading) return;
    if (user) {
      setUserId(user.uid);
      setUsername(user.displayName);
    }
  }, [user, loading]);

  const handleSubmit = () => {
    const commentData = {
      category: threadData.category,
      id: threadData.id,
      title: threadData.title,
      comments: threadData.comments,
      username: username,
      userId: userId,
      content: content.trim(),
      ...(editingComment && { commentId: editingComment.commentId }), // pass ID if editing
    };

    onSubmit(commentData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
        <h2 className="text-xl font-bold mb-4">
          {editingComment ? "✏️ Edit Comment" : "📝 Add Comment"}
        </h2>

        <label>
          <p className="text-gray-700 font-medium">
            <span className="text-gray-500">Username:</span>{" "}
            {username || "Loading..."}
          </p>
        </label>

        <br />

        <label>Comment:</label>
        <textarea
          placeholder="Comment..."
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
            {editingComment ? "Update" : "Post"}
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
