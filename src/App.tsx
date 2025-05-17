import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"

// Pages
import { Home } from "./pages/Home"
import { Course } from "./pages/Course"
// import { Calendar } from "./pages/calendar"
// import { People } from "./pages/people"
// import { Settings } from "./pages/settings"

export function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course" element={<Course />} />
          {/* <Route path="/calendar" element={<Calendar />} /> */}
          {/* <Route path="/people" element={<People />} /> */}
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </Layout>
    </Router>
  )
}