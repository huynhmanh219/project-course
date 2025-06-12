import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"

// Pages
import { Home } from "./pages/student/Home"
import { Course } from "./pages/student/Course"
import { Calendar } from "./pages/student/Calendar"
import { People } from "./pages/student/People"
import { Login } from "./pages/Login"
import { ChangePassword } from "./pages/ChangePassword"
import TeacherClasses from "./pages/teacher/Classes"
// import TeacherCreateAssignment from "./pages/teacher/CreateAssignment"
import TeacherManageStudents from "./pages/teacher/ManageStudent"
import TeacherGradebook from "./pages/teacher/Gradebook"
// import { Settings } from "./pages/settings"
// Admin Pages
import AdminLayout from "./pages/admin";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ClassManagement from "./pages/teacher/ClassManagement";
import TeacherCourses from "./pages/teacher/Courses";
import Statistics from "./pages/admin/Statistics";
import TeacherAdd from "./pages/admin/TeacherAdd";
import TeacherEdit from "./pages/admin/TeacherEdit";
import RoleManagement from "./pages/admin/RoleManagement";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import DepartmentAdd from "./pages/admin/DepartmentAdd";
import DepartmentEdit from "./pages/admin/DepartmentEdit";
import StudentAddClass from "./pages/teacher/StudentAddClass";
import ClassEdit from "./pages/teacher/ClassEdit";
import TeacherStudentAdd from "./pages/teacher/TeacherStudentAdd";
import TeacherStudentEdit from "./pages/teacher/TeacherStudentEdit";
import CourseAdd from "./pages/teacher/CourseAdd";
import CourseEdit from "./pages/teacher/CourseEdit";
import TeacherMaterials from "./pages/teacher/Materials";
import MaterialAdd from "./pages/teacher/MaterialAdd";
import MaterialEdit from "./pages/teacher/MaterialEdit";
import StudentJoinClasses from "./pages/student/Classes";
import ClassDetail from "./pages/student/ClassDetail";
import Profile from "./pages/student/Profile";
import StudentManagement from "./pages/teacher/StudentManagement";
import ClassAdd from "./pages/teacher/ClassAdd"
import Courses from "./pages/student/Courses"
import CourseDetail from "./pages/teacher/CourseDetail"

export function App() {
  return (
    <Router>
      <Routes>
        {/* Các trang không cần layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Các trang cần layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* Student routes */}
                <Route path="/courses" element={<Courses />} />
                <Route path="/course/:id" element={<Course />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/people" element={<People />} />
                <Route path="/student/classes" element={<StudentJoinClasses />} />
                <Route path="/student/classes/:id" element={<ClassDetail />} />
                <Route path="/student/profile" element={<Profile />} />
                <Route path="/student/change-password" element={<ChangePassword />} />
                {/* Teacher routes group */}
                <Route path="/teacher">
                  <Route path="my-classes" element={<ClassManagement />} />
                  {/* <Route path="classes/add" element={<TeacherClassAdd />} />
                  <Route path="classes/edit/:id" element={<TeacherClassEdit />} /> */}
                  <Route path="classes/:id/students" element={<TeacherManageStudents />} />
                  <Route path="classes/students/add" element={<TeacherStudentAdd />} />
                  <Route path="classes/:id/students/edit/:studentId" element={<TeacherStudentEdit />} />
                  <Route path="gradebook" element={<TeacherGradebook />} />
                  <Route path="courses" element={<TeacherCourses />} />
                  <Route path="courses/:id" element={<CourseDetail />} />
                  <Route path="courses/add" element={<CourseAdd />} />
                  <Route path="courses/edit/:id" element={<CourseEdit />} />
                  <Route path="classes" element={<TeacherClasses />} />
                  <Route path="classes/add" element={<StudentAddClass />} />
                  <Route path="my-classes/edit/:id" element={<ClassEdit />} />
                  <Route path="my-classes/add" element={<ClassAdd />} />
                  {/* Materials management */}
                  <Route path="materials" element={<TeacherMaterials />} />
                  <Route path="materials/add" element={<MaterialAdd />} />
                  <Route path="materials/edit/:id" element={<MaterialEdit />} />
                  <Route path="students" element={<StudentManagement />} />
                </Route>
                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<UserManagement />} />

                  <Route path="courses" element={<TeacherCourses />} />
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="teachers/add" element={<TeacherAdd />} />
                  <Route path="teachers/edit/:id" element={<TeacherEdit />} />
                  <Route path="roles" element={<RoleManagement />} />
                  <Route path="departments" element={<DepartmentManagement />} />
                  <Route path="departments/add" element={<DepartmentAdd />} />
                  <Route path="departments/edit/:id" element={<DepartmentEdit />} />
                </Route>
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}