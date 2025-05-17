import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"

// Pages
import { Home } from "./pages/student/Home"
import { Course } from "./pages/student/Course"
import { Calendar } from "./pages/student/Calendar"
import { People } from "./pages/student/People"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { TeacherClasses } from "./pages/teacher/Classes"
import { TeacherCreateAssignment } from "./pages/teacher/CreateAssignment"
import { TeacherManageStudents } from "./pages/teacher/ManageStudent"
import { TeacherGradebook } from "./pages/teacher/Gradebook"
// import { Settings } from "./pages/settings"

export function App() {
  return (
    <Router>
      <Routes>
        {/* Các trang không cần layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Các trang cần layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* tạo :id  động để điều hướng lớp học */}
                <Route path="/course" element={<Course />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/people" element={<People />} />
                {/* Teacher routes */}
                <Route path="/teacher/classes" element={<TeacherClasses />} />
                <Route path="/teacher/create-assignment" element={<TeacherCreateAssignment />} />
                <Route path="/teacher/manage-students" element={<TeacherManageStudents />} />
                <Route path="/teacher/gradebook" element={<TeacherGradebook />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}