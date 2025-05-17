import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ClassCard } from "../../components/home/ClassCard"

export function Home() {
  const navigate = useNavigate();
  // Mock data cho các lớp học
  const classes = [
    {
      id: "1",
      title: "Web Development",
      description: "CS101 - Section A",
      teacher: "John Doe",
      studentsCount: 30,
      color: "bg-blue-500"
    },
    {
      id: "2",
      title: "Data Structures",
      description: "CS201 - Section B",
      teacher: "Jane Smith",
      studentsCount: 28,
      color: "bg-green-500"
    },
    {
      id: "3",
      title: "Database Systems",
      description: "CS301 - Section C",
      teacher: "Alice Brown",
      studentsCount: 32,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome back!</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Join class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div key={cls.id}>
            <div className={`h-24 ${cls.color} rounded-lg mb-4`}></div>
            <ClassCard
              id={cls.id}
              title={cls.title}
              description={cls.description}
              teacher={cls.teacher}
              studentsCount={cls.studentsCount}
              onClick={() => navigate(`/course/${cls.id}`)}
            />
          </div>
        ))}
      </div>

      {/* Upcoming Work */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Work</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Assignment 1</h3>
                <p className="text-sm text-gray-500">Web Development - Due in 2 days</p>
              </div>
              <Button variant="default">View</Button>
            </div>
          </div>

          <div className="p-4 border rounded">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Quiz 2</h3>
                <p className="text-sm text-gray-500">Data Structures - Due in 3 days</p>
              </div>
              <Button variant="default">View</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}