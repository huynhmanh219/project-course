import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import Footer from "./Footer"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
} 
