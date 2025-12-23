import { useEffect, useRef } from "react";

export const useNotificationSocket = (onNewNotification: (data: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  const connect = () => {
    const wsUrl =
      (process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/^http/, "ws") ?? "") +
      "/ws-notification";

    console.log("🔗 Connecting to WebSocket:", wsUrl);

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => console.log("✅ WebSocket connected");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("🔔 New notification:", data);
        onNewNotification(data);
      } catch (e) {
        console.error("❌ Invalid WebSocket message:", e);
      }
    };

    socket.onerror = (error) => console.error("⚠️ WebSocket error:", error);

    socket.onclose = (e) => {
      console.warn("🔌 WebSocket closed:", e.reason);
      setTimeout(connect, 5000); // ✅ hook ichida chaqirilmaydi, oddiy funksiya chaqiriladi
    };
  };

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.close();
    };
  }, [onNewNotification]);
};
