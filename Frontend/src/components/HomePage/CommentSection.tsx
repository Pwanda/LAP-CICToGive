import { useState } from "react";
import type { ItemComment } from "../../types";
import { useAddComment } from "../../hooks/useAPI";

// Format date to German format: DD.MM.YYYY HH:MM
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface CommentSectionProps {
  itemId: number;
  comments: ItemComment[];
  onAddComment: () => void;
}

export default function CommentSection({
  itemId,
  comments,
  onAddComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const addCommentMutation = useAddComment();

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await addCommentMutation.mutateAsync({
          itemId,
          text: newComment,
        });
        setNewComment("");
        onAddComment(); // Trigger refetch
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };

  return (
    <div className="mt-8">
      <h4 className="font-semibold text-lg mb-4">Kommentare</h4>

      <div className="space-y-4 max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`chat ${comment.author === "Du" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt={`${comment.author} avatar`}
                  src={
                    comment.author === "Du"
                      ? "https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                      : comment.author === "Maria"
                        ? "https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                        : "https://img.daisyui.com/images/profile/demo/user@192.webp"
                  }
                />
              </div>
            </div>
            <div className="chat-header">
              {comment.author}
              <time className="text-xs opacity-50 ml-1">
                {formatDate(comment.date)}
              </time>
            </div>
            <div className="chat-bubble">{comment.text}</div>
            <div className="chat-footer opacity-50">
              {comment.author === "Du" ? "Gesendet" : "Empfangen"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Schreibe einen Kommentar..."
            className="input input-bordered flex-1"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />
          <button
            className="btn btn-primary"
            onClick={handleAddComment}
            disabled={addCommentMutation.isPending}
          >
            {addCommentMutation.isPending ? "Senden..." : "Senden"}
          </button>
        </div>
      </div>
    </div>
  );
}
