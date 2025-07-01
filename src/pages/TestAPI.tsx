import { useState } from 'react'
import { testConnection } from '../services/api'
import { authService } from '../services/auth.service'
import { simpleUserService } from '../services/user.service.simple'
import { simpleCourseService } from '../services/course.service.simple'
import { simpleQuizService } from '../services/quiz.service.simple'
import { simpleMaterialService } from '../services/material.service.simple'

export default function TestAPI() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  
  // Login test states
  const [loginResult, setLoginResult] = useState<any>(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string>('')

  // User management test states
  const [userResult, setUserResult] = useState<any>(null)
  const [userLoading, setUserLoading] = useState(false)
  const [userError, setUserError] = useState<string>('')

  // Course management test states
  const [courseResult, setCourseResult] = useState<any>(null)
  const [courseLoading, setCourseLoading] = useState(false)
  const [courseError, setCourseError] = useState<string>('')

  // Quiz system test states
  const [quizResult, setQuizResult] = useState<any>(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizError, setQuizError] = useState<string>('')

  const handleTestConnection = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    
    try {
      console.log('Testing connection to backend...')
      const data = await testConnection()
      console.log('Backend response:', data)
      setResult(data)
    } catch (err: any) {
      console.error('Connection failed:', err)
      setError(err.message || 'Connection failed')
    } finally {
      setLoading(false)
    }
  }

  const handleTestLogin = async (email: string, password: string, role: string) => {
    setLoginLoading(true)
    setLoginError('')
    setLoginResult(null)
    
    try {
      console.log(`Testing login as ${role}:`, email)
      const data = await authService.login({ email, matKhau: password })
      console.log('Login response:', data)
      setLoginResult(data)
    } catch (err: any) {
      console.error('Login failed:', err)
      setLoginError(err.message || 'Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setLoginResult(null)
      alert('Logged out successfully!')
    } catch (err: any) {
      console.error('Logout error:', err)
    }
  }

  const handleUserTest = async (testType: string, apiCall: () => Promise<any>) => {
    setUserLoading(true)
    setUserError('')
    setUserResult(null)
    
    try {
      console.log(`Testing ${testType}...`)
      const data = await apiCall()
      console.log(`${testType} response:`, data)
      setUserResult({ testType, data })
    } catch (err: any) {
      console.error(`${testType} failed:`, err)
      setUserError(err.message || `${testType} failed`)
    } finally {
      setUserLoading(false)
    }
  }

  const handleCourseTest = async (testType: string, apiCall: () => Promise<any>) => {
    setCourseLoading(true)
    setCourseError('')
    setCourseResult(null)
    
    try {
      console.log(`Testing ${testType}...`)
      const data = await apiCall()
      console.log(`${testType} response:`, data)
      setCourseResult({ testType, data })
    } catch (err: any) {
      console.error(`${testType} failed:`, err)
      setCourseError(err.message || `${testType} failed`)
    } finally {
      setCourseLoading(false)
    }
  }

  const handleQuizTest = async (testType: string, apiCall: () => Promise<any>) => {
    setQuizLoading(true)
    setQuizError('')
    setQuizResult(null)
    
    try {
      console.log(`Testing ${testType}...`)
      const data = await apiCall()
      console.log(`${testType} response:`, data)
      setQuizResult({ testType, data })
    } catch (err: any) {
      console.error(`${testType} failed:`, err)
      setQuizError(err.message || `${testType} failed`)
    } finally {
      setQuizLoading(false)
    }
  }

  const testMaterialsAPI = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    
    try {
      console.log('Testing materials API...')
      
      // Test basic fetch first
      const basicTest = await fetch('http://localhost:3000/api/materials?page=1&size=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('Basic fetch response status:', basicTest.status)
      console.log('Basic fetch response ok:', basicTest.ok)
      
      if (!basicTest.ok) {
        const errorText = await basicTest.text()
        console.log('Basic fetch error:', errorText)
        throw new Error(`HTTP ${basicTest.status}: ${errorText}`)
      }
      
      const basicResult = await basicTest.json()
      console.log('Basic fetch result:', basicResult)
      
      // Test with service
      const serviceResult = await simpleMaterialService.getMaterials({ page: 1, size: 5 })
      console.log('Service result:', serviceResult)
      
      setResult({
        basicFetch: basicResult,
        serviceCall: serviceResult,
        status: 'SUCCESS'
      })
      
    } catch (err: any) {
      console.error('API test error:', err)
      setError(err.message || 'Unknown error')
      setResult({
        error: err.message,
        status: 'ERROR'
      })
    } finally {
      setLoading(false)
    }
  }

  const testServerConnection = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    
    try {
      console.log('Testing server connection...')
      
      const response = await fetch('http://localhost:3000/api', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const text = await response.text()
      
      setResult({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        response: text,
        type: 'SERVER_CONNECTION'
      })
      
    } catch (err: any) {
      console.error('Server connection error:', err)
      setError(err.message || 'Cannot connect to server')
      setResult({
        error: err.message,
        type: 'CONNECTION_ERROR'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔧 API Integration Test</h1>
      
      {/* Connection Test Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. 🌐 Backend Connection Test</h2>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p><strong>Backend URL:</strong> http://localhost:5000</p>
          <p><strong>Health endpoint:</strong> http://localhost:5000/health</p>
        </div>

        <button 
          onClick={handleTestConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 mb-4"
        >
          {loading ? '🔄 Testing...' : '🚀 Test Backend Connection'}
        </button>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            <h3 className="font-bold">❌ Connection Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
            <h3 className="font-bold">✅ Backend Connected!</h3>
            <pre className="bg-white p-2 rounded mt-2 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Authentication Test Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. 🔑 Authentication Test</h2>
        
        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <h3 className="font-bold text-yellow-800 mb-2">Test Accounts (từ backend seeder):</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>Admin:</strong> admin@lms.com / admin123</p>
            <p><strong>Teacher:</strong> lecturer@lms.com / lecturer123</p>
            <p><strong>Student:</strong> student@lms.com / student123</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <button 
            onClick={() => handleTestLogin('admin@lms.com', 'admin123', 'Admin')}
            disabled={loginLoading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
          >
            {loginLoading ? '🔄' : '👨‍💼'} Test Admin Login
          </button>
          
          <button 
            onClick={() => handleTestLogin('lecturer@lms.com', 'lecturer123', 'Teacher')}
            disabled={loginLoading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
          >
            {loginLoading ? '🔄' : '👨‍🏫'} Test Teacher Login
          </button>
          
          <button 
            onClick={() => handleTestLogin('student@lms.com', 'student123', 'Student')}
            disabled={loginLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
          >
            {loginLoading ? '🔄' : '👨‍🎓'} Test Student Login
          </button>
        </div>

        {loginError && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            <h3 className="font-bold">❌ Login Error:</h3>
            <p>{loginError}</p>
            <div className="mt-2 text-sm">
              <p><strong>Check:</strong></p>
              <ul className="list-disc list-inside">
                <li>Backend is running and seeded with test data</li>
                <li>Database contains the test accounts</li>
                <li>Auth API endpoint is working</li>
              </ul>
            </div>
          </div>
        )}

        {loginResult && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">✅ Login Successful!</h3>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </div>
            <div className="mb-2">
              <strong>Token saved to localStorage:</strong> ✅<br/>
              <strong>User data:</strong> {loginResult.user?.email} ({loginResult.user?.role || 'Unknown role'})
            </div>
            <details className="mt-2">
              <summary className="cursor-pointer font-medium">View full response</summary>
              <pre className="bg-white p-2 rounded mt-2 text-sm overflow-auto">
                {JSON.stringify(loginResult, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* User Management Test Section */}
      {loginResult && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. 👥 User Management APIs Test</h2>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-blue-800 mb-2">🔒 Authenticated as: {loginResult.user?.email} ({loginResult.user?.role})</h3>
            <p className="text-blue-700 text-sm">Testing user management endpoints with JWT token...</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <button 
              onClick={() => handleUserTest('Get Teachers', () => simpleUserService.getTeachers())}
              disabled={userLoading}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {userLoading ? '🔄' : '👨‍🏫'} Get Teachers
            </button>
            
            <button 
              onClick={() => handleUserTest('Get Students', () => simpleUserService.getStudents())}
              disabled={userLoading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {userLoading ? '🔄' : '👨‍🎓'} Get Students
            </button>
            
            <button 
              onClick={() => handleUserTest('Get Roles', () => simpleUserService.getRoles())}
              disabled={userLoading}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {userLoading ? '🔄' : '🔑'} Get Roles
            </button>

            <button 
              onClick={() => handleUserTest('Get Teacher #1', () => simpleUserService.getTeacher(1))}
              disabled={userLoading}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {userLoading ? '🔄' : '👤'} Get Teacher #1
            </button>

            <button 
              onClick={() => handleUserTest('Get Student #1', () => simpleUserService.getStudent(1))}
              disabled={userLoading}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {userLoading ? '🔄' : '👤'} Get Student #1
            </button>

            <button 
              onClick={() => handleUserTest('Get Teachers (page 1)', () => simpleUserService.getTeachers({ page: 1, limit: 5 }))}
              disabled={userLoading}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {userLoading ? '🔄' : '📄'} Paginated Teachers
            </button>
          </div>

          {userError && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              <h3 className="font-bold">❌ User API Error:</h3>
              <p>{userError}</p>
              <div className="mt-2 text-sm">
                <p><strong>Common issues:</strong></p>
                <ul className="list-disc list-inside">
                  <li>User role doesn't have permission for this endpoint</li>
                  <li>Database not seeded with user data</li>
                  <li>Backend user APIs not implemented</li>
                  <li>JWT token expired or invalid</li>
                </ul>
              </div>
            </div>
          )}

          {userResult && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
              <h3 className="font-bold">✅ {userResult.testType} Successful!</h3>
              <div className="mt-2">
                <strong>Data count:</strong> {Array.isArray(userResult.data) ? userResult.data.length : 'N/A'}<br/>
                <strong>Response type:</strong> {Array.isArray(userResult.data) ? 'Array' : typeof userResult.data}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">View full response</summary>
                <pre className="bg-white p-2 rounded mt-2 text-sm overflow-auto max-h-96">
                  {JSON.stringify(userResult.data, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Course Management Test Section */}
      {loginResult && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. 📚 Course Management APIs Test</h2>
          
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-green-800 mb-2">📋 Testing Course & Class Management</h3>
            <p className="text-green-700 text-sm">Testing subjects, classes, and enrollment endpoints...</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <button 
              onClick={() => handleCourseTest('Get Courses', () => simpleCourseService.getCourses())}
              disabled={courseLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {courseLoading ? '🔄' : '📖'} Get Courses
            </button>
            
            <button 
              onClick={() => handleCourseTest('Get Classes', () => simpleCourseService.getClasses())}
              disabled={courseLoading}
              className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {courseLoading ? '🔄' : '🏫'} Get Classes
            </button>
            
            <button 
              onClick={() => handleCourseTest('Get Course #1', () => simpleCourseService.getCourse(1))}
              disabled={courseLoading}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {courseLoading ? '🔄' : '📚'} Get Course #1
            </button>

            <button 
              onClick={() => handleCourseTest('Get Class #1', () => simpleCourseService.getClass(1))}
              disabled={courseLoading}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {courseLoading ? '🔄' : '🎓'} Get Class #1
            </button>

            <button 
              onClick={() => handleCourseTest('Get Class #1 Students', () => simpleCourseService.getClassStudents(1))}
              disabled={courseLoading}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {courseLoading ? '🔄' : '👥'} Class Students
            </button>

            <button 
              onClick={() => handleCourseTest('Get Student #1 Classes', () => simpleCourseService.getStudentClasses(1))}
              disabled={courseLoading}
              className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {courseLoading ? '🔄' : '📋'} Student Classes
            </button>
          </div>

          {courseError && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              <h3 className="font-bold">❌ Course API Error:</h3>
              <p>{courseError}</p>
              <div className="mt-2 text-sm">
                <p><strong>Common issues:</strong></p>
                <ul className="list-disc list-inside">
                  <li>User role doesn't have permission for course endpoints</li>
                  <li>Database not seeded with course/class data</li>
                  <li>Backend course APIs not implemented</li>
                  <li>Course/Class ID doesn't exist</li>
                </ul>
              </div>
            </div>
          )}

          {courseResult && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
              <h3 className="font-bold">✅ {courseResult.testType} Successful!</h3>
              <div className="mt-2">
                <strong>Data count:</strong> {Array.isArray(courseResult.data) ? courseResult.data.length : 'N/A'}<br/>
                <strong>Response type:</strong> {Array.isArray(courseResult.data) ? 'Array' : typeof courseResult.data}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">View full response</summary>
                <pre className="bg-white p-2 rounded mt-2 text-sm overflow-auto max-h-96">
                  {JSON.stringify(courseResult.data, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Quiz System Test Section */}
      {loginResult && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. 🎯 Quiz System APIs Test</h2>
          
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-purple-800 mb-2">🎮 Testing Quiz Management & Taking</h3>
            <p className="text-purple-700 text-sm">Testing quiz creation, quiz taking, and results endpoints...</p>
            <div className="mt-2 text-sm text-purple-600">
              <strong>Role permissions:</strong> Teachers can manage quizzes, Students can take quizzes
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <button 
              onClick={() => handleQuizTest('Get Quizzes', () => simpleQuizService.getQuizzes())}
              disabled={quizLoading}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {quizLoading ? '🔄' : '📝'} Get Quizzes
            </button>
            
            <button 
              onClick={() => handleQuizTest('Get Quiz #1', () => simpleQuizService.getQuiz(1))}
              disabled={quizLoading}
              className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {quizLoading ? '🔄' : '📋'} Get Quiz #1
            </button>
            
            <button 
              onClick={() => handleQuizTest('Get Quiz #1 Questions', () => simpleQuizService.getQuizQuestions(1))}
              disabled={quizLoading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {quizLoading ? '🔄' : '❓'} Quiz Questions
            </button>

            {loginResult.user?.role === 'student' && (
              <>
                <button 
                  onClick={() => handleQuizTest('Start Quiz #1', () => simpleQuizService.startQuiz(1))}
                  disabled={quizLoading}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
                >
                  {quizLoading ? '🔄' : '🚀'} Start Quiz #1
                </button>

                <button 
                  onClick={() => handleQuizTest('My Quiz Attempts', () => simpleQuizService.getMyAttempts())}
                  disabled={quizLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
                >
                  {quizLoading ? '🔄' : '📊'} My Attempts
                </button>

                <button 
                  onClick={() => handleQuizTest('Get Attempt #1 Progress', () => simpleQuizService.getQuizProgress(1))}
                  disabled={quizLoading}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
                >
                  {quizLoading ? '🔄' : '📈'} Quiz Progress
                </button>
              </>
            )}

            {(loginResult.user?.role === 'lecturer' || loginResult.user?.role === 'admin') && (
              <>
                <button 
                  onClick={() => handleQuizTest('Create Quiz', () => simpleQuizService.createQuiz({
                    title: 'Test Quiz ' + Date.now(),
                    description: 'Auto-generated test quiz for API testing',
                    subject_id: 1,
                    time_limit: 30,
                    total_points: 10.0,
                    attempts_allowed: 1,
                    show_results: true,
                    status: 'draft'
                  }))}
                  disabled={quizLoading}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
                >
                  {quizLoading ? '🔄' : '➕'} Create Test Quiz
                </button>

                <button 
                  onClick={() => handleQuizTest('Publish Quiz #1', () => simpleQuizService.publishQuiz(1))}
                  disabled={quizLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
                >
                  {quizLoading ? '🔄' : '📤'} Publish Quiz #1
                </button>

                <button 
                  onClick={() => handleQuizTest('Get Quiz #1 Results', () => simpleQuizService.getQuizResults(1))}
                  disabled={quizLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
                >
                  {quizLoading ? '🔄' : '📊'} Quiz Results
                </button>

                <button 
                  onClick={() => handleQuizTest('Get Quiz #1 Statistics', () => simpleQuizService.getQuizStatistics(1))}
                  disabled={quizLoading}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-lg disabled:opacity-50"
                >
                  {quizLoading ? '🔄' : '📈'} Quiz Statistics
                </button>
              </>
            )}
          </div>

          {quizError && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              <h3 className="font-bold">❌ Quiz API Error:</h3>
              <p>{quizError}</p>
              <div className="mt-2 text-sm">
                <p><strong>Common issues:</strong></p>
                <ul className="list-disc list-inside">
                  <li>Role doesn't have permission for quiz endpoints</li>
                  <li>Database not seeded with quiz data</li>
                  <li>Quiz/Attempt ID doesn't exist</li>
                  <li>Backend quiz APIs not implemented</li>
                </ul>
              </div>
            </div>
          )}

          {quizResult && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
              <h3 className="font-bold">✅ {quizResult.testType} Successful!</h3>
              <div className="mt-2">
                <strong>Data count:</strong> {Array.isArray(quizResult.data) ? quizResult.data.length : 'N/A'}<br/>
                <strong>Response type:</strong> {Array.isArray(quizResult.data) ? 'Array' : typeof quizResult.data}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">View full response</summary>
                <pre className="bg-white p-2 rounded mt-2 text-sm overflow-auto max-h-96">
                  {JSON.stringify(quizResult.data, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-2">📋 Integration Progress:</h3>
        <ol className="list-decimal list-inside space-y-1 text-blue-700 text-sm">
          <li>✅ Backend Connection - Working</li>
          <li>✅ Authentication APIs - Working</li>
          <li>✅ User Management APIs - Working</li>
          <li>✅ Course Management APIs - Working</li>
          <li>🔄 Quiz System APIs - Testing...</li>
          <li>📋 Next: Implement real pages</li>
        </ol>
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <h4 className="font-semibold text-blue-900 mb-1">🎉 Next Phase: Real Page Implementation</h4>
          <p className="text-blue-800 text-sm">Once Quiz APIs are tested → implement Login page, Dashboard, and main application pages!</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">API Debug Tool</h2>
        
        <div className="flex gap-4">
          <button
            onClick={testServerConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Server Connection'}
          </button>
          
          <button
            onClick={testMaterialsAPI}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Materials API'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-50 border rounded p-4">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-sm overflow-auto bg-white p-4 rounded border">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Debug Info:</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Backend URL: http://localhost:3000</li>
            <li>• API Base: http://localhost:3000/api</li>
            <li>• Materials endpoint: /api/materials</li>
            <li>• Current time: {new Date().toLocaleString()}</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 