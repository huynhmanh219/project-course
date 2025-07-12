import React, { useEffect, useState, useRef } from 'react';
import chatService, { type ChatMessage } from '../services/chat.service';
import { API_BASE_URL } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface ClassChatProps {
  classId: number;
}

const ClassChat: React.FC<ClassChatProps> = ({ classId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // join room
    chatService.joinRoom(classId);

    // load history via REST
    fetch(`${API_BASE_URL.replace(/\/api$/, '')}/api/classes/${classId}/chat?limit=50`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(res => {
        if (res.status === 'success') setMessages(res.data);
      });

    // listen realtime
    chatService.onMessage(msg => {
      if (msg.course_section_id === classId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      chatService.disconnect();
    };
  }, [classId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    chatService.sendMessage(classId, input.trim());
    setInput('');
  };

  return (
    <div className="border rounded-xl flex flex-col h-96 bg-white shadow">
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className="mb-2">
            <span className="font-semibold mr-2 text-sm text-blue-600">{msg.sender_student_id || msg.sender_email || msg.sender_id}</span>
            <span className="text-sm">{msg.content}</span>
          </div>
        ))}
        <div ref={endRef} />
      </ScrollArea>
      <div className="p-2 border-t flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Nhập tin nhắn..." className="flex-1" onKeyDown={e => { if (e.key === 'Enter') handleSend(); }} />
        <Button onClick={handleSend}>Gửi</Button>
      </div>
    </div>
  );
};

export default ClassChat; 