import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { BarChart2 } from "lucide-react";

interface GradeCardProps {
  title: string;
  average: string;
  onViewDetails?: () => void;
}

export function GradeCard({ title, average, onViewDetails }: GradeCardProps) {
  return (
    <Card className="p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <BarChart2 className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">Average: {average}</p>
          </div>
        </div>
        <Button
          variant="default" 
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
} 