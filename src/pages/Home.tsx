import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Plus } from "lucide-react"

export function Home() {
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
        {/* Class Cards */}
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="h-24 bg-blue-500 rounded-lg mb-4"></div>
          <h3 className="font-medium">Web Development</h3>
          <p className="text-sm text-gray-500">CS101 - Section A</p>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="h-24 bg-green-500 rounded-lg mb-4"></div>
          <h3 className="font-medium">Data Structures</h3>
          <p className="text-sm text-gray-500">CS201 - Section B</p>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="h-24 bg-purple-500 rounded-lg mb-4"></div>
          <h3 className="font-medium">Database Systems</h3>
          <p className="text-sm text-gray-500">CS301 - Section C</p>
        </Card>
      </div>

      {/* Upcoming Work */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Work</h2>
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Assignment 1</h3>
                <p className="text-sm text-gray-500">Web Development - Due in 2 days</p>
              </div>
              <Button variant="outline">View</Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Quiz 2</h3>
                <p className="text-sm text-gray-500">Data Structures - Due in 3 days</p>
              </div>
              <Button variant="outline">View</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}