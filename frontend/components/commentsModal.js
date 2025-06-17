// CommentModal.js
import { useEffect, useState } from "react";
import AddCommentModal from "../components/addCommentModal";

export default function CommentModal({
  isOpen,
  onClose,
  comments = [],
  currentUser,
  threadData,
  onAddComment,
  onEditComment,
  onDeleteComment
}) {
  if (!isOpen) return null;

  const [addCommentModalOpen, setAddCommentModalOpen] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const [editingComment, setEditingComment] = useState(null);

  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

  useEffect(() => {
    if (threadData?.comments?.length > 0) {
      setLocalComments(threadData.comments);
    } else if (comments.length > 0) {
      setLocalComments(comments);
    } else {
      setLocalComments([]);
    }
  }, [comments, threadData]);

  const onAddCommentFunction = (commentData) => {
    let updatedComments;

    if (editingComment) {
      // Edit mode
      updatedComments = localComments.map(c => {
        if (c.startsWith(editingComment.id + " ")) {
          return `${editingComment.id} ${editingComment.userId} ${editingComment.username} ${commentData.content}`;
        }
        return c;
      });
    } else {
      // Add mode
      const commentId = generateId();
      const commentDetails = `${commentId} ${commentData.userId} ${commentData.username} ${commentData.content}`;
      updatedComments = [...(threadData.comments || []), commentDetails];
    }

    const updatedThreadData = {
      ...threadData,
      comments: updatedComments,
    };

    if (editingComment) {
      onEditComment(updatedThreadData);
    } else {
      onAddComment(updatedThreadData);
    }

    setLocalComments(updatedComments);
    setEditingComment(null);
    setAddCommentModalOpen(false);
    onClose();
  };

  const onEditCommentFunction = (commentId) => {
    const commentStr = localComments.find(c => c.startsWith(commentId + " "));
    if (!commentStr) {
      alert("Comment not found");
      return;
    }

    const parts = commentStr.split(" ");
    const [id, userId, username, ...rest] = parts;
    const content = rest.join(" ");

    setEditingComment({ id, userId, username, content });
    setAddCommentModalOpen(true);
  };

  const onDeleteCommentFunction = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const updatedComments = localComments.filter(c => !c.startsWith(commentId + " "));

    const updatedThreadData = {
      ...threadData,
      comments: updatedComments,
    };

    onDeleteComment(updatedThreadData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 space-y-6 relative">
        <h2 className="text-2xl font-semibold">Comments</h2>

        {localComments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {localComments.map((commentStr) => {
              const parts = commentStr.split(" ");
              const commentId = parts[0];
              const userId = parts[1];
              const username = parts[2];
              const content = parts.slice(3).join(" ");
              const isOwner = currentUser?.uid === userId;

              return (
                <div key={commentId} className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700 font-medium">{username}</span>

                    {isOwner && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditCommentFunction(commentId)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteCommentFunction(commentId)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-800 text-sm">{content}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => setAddCommentModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Comment
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <AddCommentModal
        isOpen={addCommentModalOpen}
        onClose={() => {
          setAddCommentModalOpen(false);
          setEditingComment(null);
        }}
        onSubmit={onAddCommentFunction}
        threadData={threadData}
        editingComment={editingComment}
      />
    </div>
  );
} // End of CommentModal
