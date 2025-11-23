// src/socket.js
import { io } from "socket.io-client";

export const socket = io("http://localhost:3000");
// export const socket = io("https://messageapp-s9bw.onrender.com/");
