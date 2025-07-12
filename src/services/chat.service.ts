import { io, Socket } from 'socket.io-client';
import authService from './auth.service';

export interface ChatMessage {
  id: number;
  course_section_id: number;
  sender_id: number;
  sender_email?: string;
  sender_student_id?: string;
  content: string;
  created_at: string;
}

class ChatService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket) return this.socket;
    const token = authService.getToken();
    this.socket = io(`${import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || 'http://localhost:3000'}/class-chat`, {
      auth: { token: `Bearer ${token}` }
    });
    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
    return this.socket;
  }

  joinRoom(classId: number) {
    const sock = this.connect();
    if (sock.connected) {
      sock.emit('joinRoom', classId);
    } else {
      sock.on('connect', () => sock.emit('joinRoom', classId));
    }
  }

  onMessage(handler: (msg: ChatMessage) => void) {
    this.connect().on('message', handler);
  }

  sendMessage(classId: number, content: string) {
    this.connect().emit('message', { classId, content });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const chatService = new ChatService();
export default chatService; 