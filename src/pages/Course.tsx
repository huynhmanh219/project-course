import { useState } from "react"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Plus } from "lucide-react"
import { AnnouncementCard } from "../components/course/AnnouncementCard"
import { AssignmentCard } from "../components/course/AssignmentCard"
import { PeopleCard } from "../components/course/PeopleCard"
import { GradeCard } from "../components/course/GradeCard"

export function Course() {
  const [activeTab, setActiveTab] = useState("stream")

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Course Header */}
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm">
        {/* <div className="h-24 sm:h-32 bg-blue-500 rounded-lg mb-4" /> */}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Web Development</h1>
        <p className="text-gray-600 text-sm sm:text-base">CS101 - Section A</p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="stream" className="space-y-2 sm:space-y-4">
        <TabsList className="bg-white-700 flex flex-wrap gap-2">
          <TabsTrigger value="stream" className="flex-1 min-w-[90px] text-xs sm:text-base text-gray-100 data-[state=active]:text-blue-200">Stream</TabsTrigger>
          <TabsTrigger value="classwork" className="flex-1 min-w-[90px] text-xs sm:text-base text-gray-100 data-[state=active]:text-green-200">Classwork</TabsTrigger>
          <TabsTrigger value="people" className="flex-1 min-w-[90px] text-xs sm:text-base text-gray-100 data-[state=active]:text-purple-200">People</TabsTrigger>
          <TabsTrigger value="grades" className="flex-1 min-w-[90px] text-xs sm:text-base text-gray-100 data-[state=active]:text-orange-200">Grades</TabsTrigger>
        </TabsList>

        {/* Stream Tab */}
        <TabsContent value="stream" className="space-y-3 sm:space-y-4">
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-6 py-2 text-xs sm:text-base">
              <Plus className="mr-2 h-4 w-4 text-white" />
              Create
            </Button>
          </div>
          <AnnouncementCard
            title="Welcome to Web Development!"
            content="Welcome everyone to our Web Development course. In this course, we will learn about HTML, CSS, JavaScript, and modern web frameworks."
            time="2 days ago"
            author="Teacher John"
          />
        </TabsContent>

        {/* Classwork Tab */}
        <TabsContent value="classwork" className="space-y-3 sm:space-y-4">
          <div className="flex justify-end">
            <Button className="bg-white-600 hover:bg-green-700 px-3 sm:px-6 py-2 text-xs sm:text-base">
              <Plus className="mr-2 h-4 w-4 text-white" />
              Create Assignment
            </Button>
          </div>
          <AssignmentCard
            title="Assignment 1: HTML Basics"
            due="Due Mar 15, 2024"
            onView={() => {}}
          />
        </TabsContent>

        {/* People Tab */}
        <TabsContent value="people" className="space-y-3 sm:space-y-4">
          <div className="flex justify-end">
            <Button className="bg-purple-600 hover:bg-purple-700 px-3 sm:px-6 py-2 text-xs sm:text-base">
              <Plus className="mr-2 h-4 w-4 text-white" />
              Invite People
            </Button>
          </div>
          <PeopleCard name="John Doe" role="Teacher" />
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-3 sm:space-y-4">
          <GradeCard
            title="Assignment 1: HTML Basics"
            average="85%"
            onViewDetails={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 