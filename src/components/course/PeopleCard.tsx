import { Card } from "../ui/card";
import { Users } from "lucide-react";

interface PeopleCardProps {
  name: string;
  role: string;
}

export function PeopleCard({ name, role }: PeopleCardProps) {
  return (
    <Card className="p-4 bg-white">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <Users className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </Card>
  );
} 