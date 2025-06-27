"use client";

import { useState } from "react";
import { authApi } from "@/services/api";

interface Comment {
  text: string;
  date: Date;
  username: string;
  avatarUrl?: string;
}

function getAvatarUrl(username: string) {
  // Simple avatar generator using dicebear (or use your own logic)
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundType=gradientLinear&fontSize=38`;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length === 0) return;
    const user = authApi.getCurrentUser();
    const username = user?.username || "Anonym";
    const avatarUrl = getAvatarUrl(username);
    setComments([
      { text: input.trim(), date: new Date(), username, avatarUrl },
      ...comments,
    ]);
    setInput("");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-lg font-bold mb-4 text-black">Kommentare</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Schreibe einen Kommentar..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-black"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Absenden
        </button>
      </form>
      <div className="space-y-2">
        {comments.length === 0 && (
          <div className="text-gray-500">Noch keine Kommentare.</div>
        )}
        {comments.map((c, i) => (
          <div
            key={i}
            className="border-b border-gray-100 pb-2 flex items-start gap-3"
          >
            <img
              src={c.avatarUrl}
              alt={c.username}
              className="h-8 w-8 rounded-full border border-gray-200 mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black">{c.username}</span>
                <span className="text-xs text-gray-400">
                  {c.date.toLocaleString("de-AT")}
                </span>
              </div>
              <div className="text-black">{c.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
