import { Card } from "../ui/card";
import { FileText } from "lucide-react";

interface AssignmentCardProps {
  title: string;
  due: string;
  onView?: () => void;
}

export function AssignmentCard({ title, due, onView }: AssignmentCardProps) {
  return (
    <Card className="p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{due}</p>
          </div>
        </div>
        <button
          className="px-4 py-2 border border-gray-300 rounded text-white hover:text-green-100 hover:bg-gray-100 transition"
          onClick={onView}
        >
          View
        </button>
      </div>
    </Card>
  );
} 