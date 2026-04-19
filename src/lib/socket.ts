import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Returns the shared Socket.io singleton.
 * The connection is lazy — it is only established on the first call.
 * Backend URL is read from VITE_SOCKET_URL (falls back to localhost:3001).
 */
export function getSocket(): Socket {
  if (!socket) {
    const url = (import.meta as any).env?.VITE_SOCKET_URL ?? "http://localhost:3001";
    socket = io(url, {
      transports: ["websocket"],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    });
  }
  return socket;
}
