import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const initSocket = () => {
  if (!socket) {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket?.id)
    })

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected")
    })

    socket.on("connect_error", (error) => {
      console.error("🔌 Socket connection error:", error)
    })
  }

  return socket
}

export const getSocket = () => {
  if (!socket) {
    return initSocket()
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
    console.log("🔌 Socket manually disconnected")
  }
}

export const joinOrderRoom = (orderId: string) => {
  const sock = getSocket()
  sock.emit("join-order", orderId)
  console.log(`📦 Joined order room: ${orderId}`)
}

export const leaveOrderRoom = (orderId: string) => {
  const sock = getSocket()
  sock.emit("leave-order", orderId)
  console.log(`📦 Left order room: ${orderId}`)
}

