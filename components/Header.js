import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('pharmacy_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('pharmacy_token')
    localStorage.removeItem('pharmacy_user')
    window.location.href = '/'
  }

  if (!user) return null

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm" dir="rtl">
      <h1 className="text-lg font-bold text-sky-700">💊 نظام إدارة الصيدلية</h1>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <span className="text-gray-800">{user.name}</span>
          <Menu className="w-4 h-4 text-gray-600" />
        </button>

        {menuOpen && (
          <div className="absolute left-0 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="px-4 py-2 text-sm text-gray-700 border-b bg-gray-50">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500">
                {user.role === 'admin'
                  ? '👑 المدير'
                  : user.role === 'pharmacist'
                  ? '💊 الصيدلي'
                  : '💵 الكاشير'}
              </p>
            </div>

            <button
              onClick={logout}
              className="w-full px-4 py-2 text-sm text-right text-red-600 hover:bg-red-50"
            >
              🚪 تسجيل الخروج
            </button>
          </div>
        )}
      </div>
    </header>
  )
}










// import { useRouter } from 'next/router'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// export default function Header({ user }) {
//   const router = useRouter()

//   const navConfig = {
//     admin: [
//       { name: '🏠 لوحة التحكم', path: '/dashboard' },
//       { name: '📊 التقارير', path: '/reports' },
//       { name: '⚙️ الصلاحيات', path: '/permissions' },
//     ],
//     pharmacist: [
//       { name: '💊 الأدوية', path: '/pharmacist' },
//       { name: '💰 المبيعات', path: '/sales' },
//       { name: '⚠️ التنبيهات', path: '/alerts' },
//     ],
//     cashier: [
//       { name: '🧾 نقطة البيع', path: '/cashier' },
//       { name: '📄 تقرير اليوم', path: '/cashierReport' },
//       { name: '💼 الوردية', path: '/shift' },
//     ],
//   }

//   const role = user?.role || 'pharmacist'
//   const links = navConfig[role]

//   // const handleLogout = () => {
//   //   toast.success('👋 تم تسجيل الخروج بنجاح')
//   //   setTimeout(() => router.push('/'), 1200)
//   // }
//   const handleLogout = () => {
//   localStorage.removeItem('pharmacy_token')
//   localStorage.removeItem('pharmacy_user')
//   window.location.href = '/'
//     toast.success('👋 تم تسجيل الخروج بنجاح')

// }

  
//   return (
//     <header
//       dir="rtl"
//       className="sticky top-0 z-40 w-full bg-white border-b shadow-sm"
//       style={{
//         borderColor: `${theme.colors.primary}20`,
//       }}
//     >
//       <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 mx-auto sm:flex-row max-w-7xl">
//         {/* شعار */}
//         <div className="flex items-center gap-2">
//           <div
//             className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white rounded-md shadow"
//             style={{ background: theme.colors.primary }}
//           >
//             💊
//           </div>
//           <div>
//             <h1 className="text-lg font-bold text-gray-800">
//               نظام الصيدلية الذكي
//             </h1>
//             <p className="text-xs text-gray-500 -mt-0.5">Pharmacy System</p>
//           </div>
//         </div>

//         {/* روابط التنقل */}
//         <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
//           {links.map((item) => {
//             const active = router.pathname === item.path
//             return (
//               <button
//                 key={item.path}
//                 onClick={() => router.push(item.path)}
//                 className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${
//                   active
//                     ? 'text-white shadow-sm'
//                     : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'
//                 }`}
//                 style={{
//                   backgroundColor: active ? theme.colors.primary : 'transparent',
//                   borderColor: active ? theme.colors.primary : '#e5e7eb',
//                 }}
//               >
//                 {item.name}
//               </button>
//             )
//           })}
//         </nav>

//         {/* معلومات المستخدم */}
//         <div className="flex items-center gap-3">
//           <div className="text-sm text-gray-700">
//             مرحبًا، <span className="font-semibold text-sky-700">{user?.name}</span>
//             <span className="ml-1 text-gray-500">({user?.role})</span>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="px-3 py-1.5 text-sm text-white rounded-md border shadow-sm hover:opacity-90"
//             style={{
//               background: theme.colors.danger,
//               borderColor: `${theme.colors.danger}80`,
//             }}
//           >
//             تسجيل الخروج
//           </button>
//         </div>
//       </div>
//     </header>
//   )
// }
