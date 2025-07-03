import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import { ProtectedRoute } from "./components/ProtectedRoute"

// Pages
import { Home } from "./pages/student/Home"
import { Course } from "./pages/student/Course"
import { Calendar } from "./pages/student/Calendar"
import { People } from "./pages/student/People"
import { Login } from "./pages/Login"
import { ChangePassword } from "./pages/ChangePassword"
import TeacherClasses from "./pages/teacher/my-class/Classes"
// import TeacherCreateAssignment from "./pages/teacher/CreateAssignment"
import ManageStudent from "./pages/teacher/my-class/ManageStudent"
import TeacherGradebook from "./pages/teacher/Gradebook"
import StudentAddToClass from "./pages/teacher/my-class/StudentAddToClass"
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
import ClassEdit from "./pages/teacher/class/ClassEdit";
import TeacherStudentAdd from "./pages/teacher/studentManagement/TeacherStudentAdd";
import TeacherStudentEdit from "./pages/teacher/studentManagement/TeacherStudentEdit";
import TeacherStudentDetail from "./pages/teacher/studentManagement/TeacherStudentDetail";
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
import LectureRating from "./pages/student/lecture/LectureRating"
import ClassRatingPage from "./pages/student/ClassRating"
import TestRating from "./pages/TestRating"
import TestClassRating from "./pages/TestClassRating"

// Test API page
import TestAPI from "./pages/TestAPI"
import TestQuizRouting from "./pages/TestQuizRouting"

export function App() {
  return (
    <Router>
      <Routes>
        {/* Các trang không cần layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/test-api" element={<TestAPI />} />
        <Route path="/test-quiz-routing" element={<TestQuizRouting />} />
        <Route path="/test-rating" element={<TestRating />} />
        <Route path="/test-class-rating" element={<TestClassRating />} />

        {/* Các trang cần layout và authentication */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* Student routes */}
                  <Route path="/courses" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <Courses />
                    </ProtectedRoute>
                  } />
                  <Route path="/course/:id" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <Course />
                    </ProtectedRoute>
                  } />
                  <Route path="/calendar" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <Calendar />
                    </ProtectedRoute>
                  } />
                  <Route path="/people" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <People />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/classes" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <StudentJoinClasses />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/classes/:id" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <ClassDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/profile" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/change-password" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <ChangePassword />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/lecture/:lectureId/rating" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <LectureRating />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/class/:classId/rating" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <ClassRatingPage />
                    </ProtectedRoute>
                  } />
                
                {/* Student Quiz routes */}
                  <Route path="/student/quiz" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <QuizList />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/quiz/:quizId/take" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <QuizTaking />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/quiz/:quizId/result" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <QuizResult />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/quiz/:quizId/result/:submissionId" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <QuizResult />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/quiz/history" element={
                    <ProtectedRoute requiredRole={['student']}>
                      <QuizHistory />
                    </ProtectedRoute>
                  } />
                
                {/* Teacher routes group */}
                <Route path="/teacher">
                    <Route path="my-classes" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ClassManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="classes/:classId/students" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ManageStudent />
                      </ProtectedRoute>
                    } />
                    <Route path="classes/:classId/add-student" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <StudentAddToClass />
                      </ProtectedRoute>
                    } />
                    <Route path="students" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <StudentManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="students/:studentId" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <TeacherStudentDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="students/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <TeacherStudentAdd />
                      </ProtectedRoute>
                    } />
                    <Route path="students/:studentId/edit" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <TeacherStudentEdit />
                      </ProtectedRoute>
                    } />
                    <Route path="students/edit/:studentId" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <TeacherStudentEdit />
                      </ProtectedRoute>
                    } />
                    <Route path="gradebook" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <TeacherGradebook />
                      </ProtectedRoute>
                    } />
                    <Route path="courses" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <TeacherCourses />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/:id" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <CourseDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <CourseAdd />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/edit/:id" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <CourseEdit />
                      </ProtectedRoute>
                    } />
                    
                    {/* Course-specific Chapter & Lecture routes */}
                    <Route path="courses/:courseId/chapters/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ChapterAdd />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/:courseId/chapters/:chapterId/edit" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ChapterEdit />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/:courseId/chapters/:chapterId/lectures" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <Lectures />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/:courseId/chapters/:chapterId/lectures/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <LectureAdd />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/:courseId/chapters/:chapterId/lectures/:lectureId" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <LectureDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/:courseId/chapters/:chapterId/lectures/:lectureId/edit" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <LectureEdit />
                      </ProtectedRoute>
                    } />
                    
                    {/* Course-specific Chapter routes */}
                    <Route path="courses/:courseId/chapters/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ChapterAdd />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/:courseId/chapters/:chapterId/edit" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ChapterEdit />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/:courseId/chapters/:chapterId/lectures" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <Lectures />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/:courseId/chapters/:chapterId/lectures/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <LectureAdd />
                      </ProtectedRoute>
                    } />
                    <Route path="courses/:courseId/chapters/:chapterId/lectures/:lectureId/edit" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <LectureEdit />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="classes" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <TeacherClasses />
                      </ProtectedRoute>
                    } />
                    <Route path="classes/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <StudentAddToClass />
                      </ProtectedRoute>
                    } />
                    <Route path="my-classes/edit/:id" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ClassEdit />
                      </ProtectedRoute>
                    } />
                    <Route path="my-classes/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ClassAdd />
                      </ProtectedRoute>
                    } />
                  {/* Materials management */}
                    <Route path="materials" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <TeacherMaterials />
                      </ProtectedRoute>
                    } />
                    <Route path="materials/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <MaterialAdd />
                      </ProtectedRoute>
                    } />
                    <Route path="materials/edit/:id" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <MaterialEdit />
                      </ProtectedRoute>
                    } />
                  {/* Chapter management */}
                    <Route path="chapters" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ChapterManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="chapters/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ChapterAdd />
                      </ProtectedRoute>
                    } />
                    <Route path="chapters/edit/:id" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ChapterEdit />
                      </ProtectedRoute>
                    } />
                  {/* Lecture management */}
                    <Route path="lectures" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <Lectures />
                      </ProtectedRoute>
                    } />
                    <Route path="lectures/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <LectureAdd />
                      </ProtectedRoute>
                    } />
                    <Route path="lectures/:id" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <LectureDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="lectures/edit/:id" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <LectureEdit />
                      </ProtectedRoute>
                    } />
                  
                  {/* Quiz management */}
                    <Route path="quiz" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <QuizManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="quiz/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <QuizAdd />
                      </ProtectedRoute>
                    } />
                    <Route path="quiz/:id" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <QuizDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="quiz/:id/edit" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <QuizEdit />
                      </ProtectedRoute>
                    } />
                    <Route path="quiz/:id/results" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <QuizResults />
                      </ProtectedRoute>
                    } />
                    <Route path="quiz/:id/questions/add" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <QuestionAdd />
                      </ProtectedRoute>
                    } />
                    <Route path="quiz/:quizId/questions/:questionId/edit" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <QuestionEdit />
                      </ProtectedRoute>
                    } />
                  
                  {/* Profile */}
                    <Route path="profile" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="change-password" element={
                      <ProtectedRoute requiredRole={['lecturer', 'admin']}>
                        <ChangePassword />
                      </ProtectedRoute>
                    } />
                </Route>
                {/* Admin routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole={['admin']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
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
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}