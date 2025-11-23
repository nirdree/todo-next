
// ==================== app/dashboard/layout.js ====================
import Navbar from '@/components/Navbar'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
