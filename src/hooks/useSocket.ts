// src/hooks/useSocket.ts
import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:4000";

export function useSocket(chatId: string | undefined) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SERVER_URL);

    if (chatId) {
      socketRef.current.emit('join-chat', chatId);
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [chatId]);

  return socketRef.current;
}