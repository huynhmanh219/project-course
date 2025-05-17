import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

const events = [
  { id: 1, title: "Assignment 1 Due", date: "2024-06-10", description: "Submit your HTML assignment.", color: "bg-blue-100 text-blue-700" },
  { id: 2, title: "Quiz: CSS Basics", date: "2024-06-12", description: "Online quiz on CSS.", color: "bg-green-100 text-green-700" },
  { id: 3, title: "Group Project Meeting", date: "2024-06-15", description: "Meet with your group for project discussion.", color: "bg-purple-100 text-purple-700" },
];

export function Calendar() {
  // Đơn giản chỉ hiển thị danh sách sự kiện, có thể mở rộng thành lưới lịch thật sau
  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="flex items-center gap-3 mb-4">
        <CalendarIcon className="h-7 w-7 text-blue-600" />
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Calendar</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <div key={event.id} className={`rounded-lg shadow p-4 ${event.color} w-full`}>
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-5 w-5" />
              <span className="font-medium">{event.title}</span>
            </div>
            <div className="text-sm mb-1">{event.date}</div>
            <div className="text-xs text-gray-500">{event.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 