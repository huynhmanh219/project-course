import { useState } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Plus, FileText, Users, BarChart2 } from "lucide-react"

export function Course() {
  const [activeTab, setActiveTab] = useState("stream")

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="h-32 bg-blue-500 rounded-lg mb-4"></div>
        <h1 className="text-2xl font-semibold text-gray-800">Web Development</h1>
        <p className="text-gray-600">CS101 - Section A</p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="stream" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="stream" className="text-gray-700 data-[state=active]:text-blue-600">Stream</TabsTrigger>
          <TabsTrigger value="classwork" className="text-gray-700 data-[state=active]:text-green-600">Classwork</TabsTrigger>
          <TabsTrigger value="people" className="text-gray-700 data-[state=active]:text-purple-600">People</TabsTrigger>
          <TabsTrigger value="grades" className="text-gray-700 data-[state=active]:text-orange-600">Grades</TabsTrigger>
        </TabsList>

        {/* Stream Tab */}
        <TabsContent value="stream" className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4 text-white" />
              Create
            </Button>
          </div>
          
          <Card className="p-4 bg-white">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">Welcome to Web Development!</h3>
                  <span className="text-sm text-gray-500">2 days ago</span>
                </div>
                <p className="text-gray-600 mt-2">
                  Welcome everyone to our Web Development course. In this course, we will learn about HTML, CSS, JavaScript, and modern web frameworks.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Classwork Tab */}
        <TabsContent value="classwork" className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4 text-white" />
              Create Assignment
            </Button>
          </div>

          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Assignment 1: HTML Basics</h3>
                  <p className="text-sm text-gray-500">Due Mar 15, 2024</p>
                </div>
              </div>
              <Button variant="outline" className="text-gray-700 hover:text-gray-900">View</Button>
            </div>
          </Card>
        </TabsContent>

        {/* People Tab */}
        <TabsContent value="people" className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4 text-white" />
              Invite People
            </Button>
          </div>

          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">John Doe</h3>
                  <p className="text-sm text-gray-500">Teacher</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-4">
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Assignment 1: HTML Basics</h3>
                  <p className="text-sm text-gray-500">Average: 85%</p>
                </div>
              </div>
              <Button variant="outline" className="text-gray-700 hover:text-gray-900">View Details</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 