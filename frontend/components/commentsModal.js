import { useState } from "react";
import AddCommentModal from "../components/addCommentModal";

export default function CommentModal({
  isOpen,
  onClose,
  comments,
  currentUser,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) {
  if (!isOpen) return null;

  const [addCommentModalOpen, setAddCommentModalOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 space-y-6 relative">
        <h2 className="text-2xl font-semibold">Comments</h2>

        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700 font-medium">{comment.username}</span>

                  {currentUser?.displayName === comment.username && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditComment(comment)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteComment(comment)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-800 text-sm">{comment.text}</p>
              </div>
            ))}
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

      {/* Add Comment Modal */}
      <AddCommentModal
        isOpen={addCommentModalOpen}
        onClose={() => setAddCommentModalOpen(false)}
        onSubmit={onAddComment}
      />
    </div>
  );
}