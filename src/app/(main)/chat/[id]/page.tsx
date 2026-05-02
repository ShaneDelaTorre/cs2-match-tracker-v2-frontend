"use client";
import { useChat } from "@/hooks/useChat";
import { useOwnProfile } from "@/hooks/useProfile";
import { ChatMessage } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

export default function ChatPage() {
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [newMessages, setNewMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { id } = useParams();
  const recipientId = Number(id);
  const { data: history, isLoading } = useChat(recipientId);
  const { data: me } = useOwnProfile();

  const normalizedHistory = useMemo(() => {
    if (!history) return [];
    return history.map((m) => ({
      type: "message",
      message_id: m.id,
      sender_id: m.sender.id,
      body: m.body,
      sent_at: m.sent_at,
    }));
  }, [history]);

  const existingIds = new Set(normalizedHistory.map((m) => m.message_id));
  const filteredNew = newMessages.filter((m) => !existingIds.has(m.message_id));
  const allMessages = [...normalizedHistory, ...filteredNew];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${recipientId}/`);
    ws.current = socket;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "message") {
        setNewMessages((prev) => {
          const exists = prev.some((m) => m.message_id === data.message_id);
          if (exists) return prev;
          return [...prev, data];
        });
      }
    };

    socket.onerror = () => {
      if (socket.readyState === WebSocket.CLOSED) return;
      console.error("WebSocket error");
    };

    return () => {
      socket.close();
    };
  }, [history, recipientId]);

  const handleSend = () => {
    if (!input.trim() || !ws.current) return;
    ws.current.send(JSON.stringify({ body: input }));
    setInput("");
  };

  if (isLoading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Chat</span>
      </div>

      <div className={styles.messageList}>
        {allMessages.length === 0 ? (
          <p className={styles.empty}>No messages yet. Say something!</p>
        ) : (
          allMessages.map((m) => {
            const isMine = m.sender_id === me?.id;
            return (
              <div
                key={m.message_id}
                className={`${styles.messageRow} ${isMine ? styles.mine : styles.theirs}`}
              >
                <div
                  className={`${styles.bubble} ${isMine ? styles.bubbleMine : styles.bubbleTheirs}`}
                >
                  <p className={styles.body}>{m.body}</p>
                  <span className={styles.time}>
                    {new Date(m.sent_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
