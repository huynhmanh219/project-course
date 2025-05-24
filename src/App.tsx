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
// Admin Pages
import AdminLayout from "./pages/admin";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ClassManagement from "./pages/admin/ClassManagement";
import CourseManagement from "./pages/admin/CourseManagement";
import Statistics from "./pages/admin/Statistics";

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
                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="classes" element={<ClassManagement />} />
                  <Route path="courses" element={<CourseManagement />} />
                  <Route path="statistics" element={<Statistics />} />
                </Route>
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}