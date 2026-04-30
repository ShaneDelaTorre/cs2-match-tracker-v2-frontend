"use client";

import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ChatPage() {
  const ws = useRef<WebSocket | null>(null);
  const [newMessages, setNewMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { id } = useParams();
  const recepientId = Number(id);
  const { data: history, isLoading } = useChat(recepientId);
  const normalizedHistory = useMemo(()=>{
    if (!history) return [];
    return history.map( m => ({
        type: "message",
        message_id: m.id,
        sender_id: m.sender.id,
        body: m.body,
        sent_at: m.sent_at,
    }))
  }, [history]);
  const allMessages = [...newMessages, ...normalizedHistory];

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${recepientId}/`);
    ws.current = socket;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "message") {
        setNewMessages((prev) => [...prev, data]);
      }
    };

    socket.onerror = (error) => {
      console.error("Websocket error: ", error);
    };

    return () => {
      socket.close();
    };
  }, [history, recepientId]);

  const handleSend = () => {
    if (!input.trim() || !ws.current) return;

    ws.current.send(JSON.stringify({ body: input }));
    setInput("");
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        {allMessages.map((m) => (
          <div key={m.message_id}>
            <span>{m.sender_id}: </span>
            <span>{m.body}</span>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
