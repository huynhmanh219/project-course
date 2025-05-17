import { Card } from "../ui/card";
import { Users } from "lucide-react";

interface AnnouncementCardProps {
  title: string;
  content: string;
  time: string;
  author?: string;
}

export function AnnouncementCard({ title, content, time, author }: AnnouncementCardProps) {
  return (
    <Card className="p-4 bg-white">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">{title}</h3>
            <span className="text-sm text-gray-500">{time}</span>
          </div>
          <p className="text-gray-600 mt-2">{content}</p>
          {author && <p className="text-xs text-gray-400 mt-1">By {author}</p>}
        </div>
      </div>
    </Card>
  );
} 