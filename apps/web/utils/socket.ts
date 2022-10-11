import { io } from "socket.io-client";

const SOCKET_BASE_URL = "http://localhost:5000";

export const socket = io(SOCKET_BASE_URL);
