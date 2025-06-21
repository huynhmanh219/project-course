import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"

// Pages
import { Home } from "./pages/student/Home"
import { Course } from "./pages/student/Course"
import { Calendar } from "./pages/student/Calendar"
import { People } from "./pages/student/People"
import { Login } from "./pages/Login"
import { ChangePassword } from "./pages/ChangePassword"
import TeacherClasses from "./pages/teacher/my-class/Classes"
// import TeacherCreateAssignment from "./pages/teacher/CreateAssignment"
import TeacherManageStudents from "./pages/teacher/my-class/ManageStudent"
import TeacherGradebook from "./pages/teacher/Gradebook"
// import { Settings } from "./pages/settings"
// Admin Pages
import AdminLayout from "./pages/admin";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ClassManagement from "./pages/teacher/class/ClassManagement";
import TeacherCourses from "./pages/teacher/courses/Courses";
import Statistics from "./pages/admin/Statistics";
import TeacherAdd from "./pages/admin/TeacherAdd";
import TeacherEdit from "./pages/admin/TeacherEdit";
import RoleManagement from "./pages/admin/RoleManagement";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import DepartmentAdd from "./pages/admin/DepartmentAdd";
import DepartmentEdit from "./pages/admin/DepartmentEdit";
import StudentAddClass from "./pages/teacher/my-class/StudentAddClass";
import ClassEdit from "./pages/teacher/class/ClassEdit";
import TeacherStudentAdd from "./pages/teacher/studentManagement/TeacherStudentAdd";
import TeacherStudentEdit from "./pages/teacher/studentManagement/TeacherStudentEdit";
import CourseAdd from "./pages/teacher/courses/CourseAdd";
import CourseEdit from "./pages/teacher/courses/CourseEdit";
import TeacherMaterials from "./pages/teacher/material/Materials";
import MaterialAdd from "./pages/teacher/material/MaterialAdd";
import MaterialEdit from "./pages/teacher/material/MaterialEdit";
import StudentJoinClasses from "./pages/student/Classes";
import ClassDetail from "./pages/student/ClassDetail";
import Profile from "./pages/Profile";
import StudentManagement from "./pages/teacher/studentManagement/StudentManagement";
import ClassAdd from "./pages/teacher/class/ClassAdd"
import Courses from "./pages/student/Courses"
import CourseDetail from "./pages/teacher/courses/CourseDetail"
import ChapterManagement from "./pages/teacher/chapter/ChapterManagement"
import ChapterAdd from "./pages/teacher/chapter/ChapterAdd"
import ChapterEdit from "./pages/teacher/chapter/ChapterEdit"
import Lectures from "./pages/teacher/lecture/Lectures"
import LectureAdd from "./pages/teacher/lecture/LectureAdd"
import LectureDetail from "./pages/teacher/lecture/LectureDetail"
import LectureEdit from "./pages/teacher/lecture/LectureEdit"

// Quiz components - Teacher
import QuizManagement from "./pages/teacher/quiz/QuizManagement"
import QuizAdd from "./pages/teacher/quiz/QuizAdd"
import QuizEdit from "./pages/teacher/quiz/QuizEdit"
import QuizDetail from "./pages/teacher/quiz/QuizDetail"
import QuizResults from "./pages/teacher/quiz/QuizResults"
import QuestionAdd from "./pages/teacher/quiz/QuestionAdd"
import QuestionEdit from "./pages/teacher/quiz/QuestionEdit"

// Quiz components - Student  
import QuizList from "./pages/student/quiz/QuizList"
import QuizTaking from "./pages/student/quiz/QuizTaking"
import QuizResult from "./pages/student/quiz/QuizResult"
import QuizHistory from "./pages/student/quiz/QuizHistory"

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
                
                {/* Student Quiz routes */}
                <Route path="/student/quiz" element={<QuizList />} />
                <Route path="/student/quiz/:id/take" element={<QuizTaking />} />
                <Route path="/student/quiz/:id/result" element={<QuizResult />} />
                <Route path="/student/quiz/history" element={<QuizHistory />} />
                
                {/* Teacher routes group */}
                <Route path="/teacher">
                  <Route path="my-classes" element={<ClassManagement />} />
                  {/* <Route path="classes/add" element={<TeacherClassAdd />} />
                  <Route path="classes/edit/:id" element={<TeacherClassEdit />} /> */}
                  <Route path="classes/:id/students" element={<TeacherManageStudents />} />
                  <Route path="students/add" element={<TeacherStudentAdd />} />
                  <Route path="students/edit/:studentId" element={<TeacherStudentEdit />} />
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
                  {/* Chapter management */}
                  <Route path="chapters" element={<ChapterManagement />} />
                  <Route path="chapters/add" element={<ChapterAdd />} />
                  <Route path="chapters/edit/:id" element={<ChapterEdit />} />
                  {/* Lecture management */}
                  <Route path="lectures" element={<Lectures />} />
                  <Route path="lectures/add" element={<LectureAdd />} />
                  <Route path="lectures/:id" element={<LectureDetail />} />
                  <Route path="lectures/edit/:id" element={<LectureEdit />} />
                  
                  {/* Quiz management */}
                  <Route path="quiz" element={<QuizManagement />} />
                  <Route path="quiz/add" element={<QuizAdd />} />
                  <Route path="quiz/:id" element={<QuizDetail />} />
                  <Route path="quiz/:id/edit" element={<QuizEdit />} />
                  <Route path="quiz/:id/results" element={<QuizResults />} />
                  <Route path="quiz/:id/questions/add" element={<QuestionAdd />} />
                  <Route path="quiz/:quizId/questions/:questionId/edit" element={<QuestionEdit />} />
                  
                  {/* Profile */}
                  <Route path="profile" element={<Profile />} />
                  <Route path="change-password" element={<ChangePassword />} />
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
                  
                  {/* Admin Quiz routes (same as teacher) */}
                  <Route path="quiz" element={<QuizManagement />} />
                  <Route path="quiz/add" element={<QuizAdd />} />
                  <Route path="quiz/:id" element={<QuizDetail />} />
                  <Route path="quiz/:id/edit" element={<QuizEdit />} />
                  <Route path="quiz/:id/results" element={<QuizResults />} />
                  <Route path="quiz/:id/questions/add" element={<QuestionAdd />} />
                  <Route path="quiz/:quizId/questions/:questionId/edit" element={<QuestionEdit />} />
                  
                  {/* Profile */}
                  <Route path="profile" element={<Profile />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}