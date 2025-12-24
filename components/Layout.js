import { useRouter } from 'next/router'
import theme from '../theme'
import { useState, useEffect } from 'react'
import ConfirmModal from './ConfirmModal'
import { FaSignOutAlt } from 'react-icons/fa'
import AuthGuard from "../components/AuthGuard";
import Header from './Header'
export default function Layout({ user, title, children }) {
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const role = user?.role || "pharmacist"

  // روابط ثابتة (Frontend فقط)
  const navConfig = {
    admin: [
      { name: '🏠 لوحة التحكم', path: '/dashboard' },
      { name: '💊 الأدوية', path: '/pharmacist' },
      { name: '🧾 نقطة البيع', path: '/cashier' },
      { name: '📦 المخزن', path: '/inventory' },
      { name: '📊 التقارير', path: '/reports' },
      { name: '👥 المستخدمون', path: '/users' },
      { name: '👥 ', path: '/profile' },
    ],
    pharmacist: [
      { name: '💊 الأدوية', path: '/pharmacist' },
      { name: '📦 المخزون', path: '/inventory' },
      { name: '📊 تقارير المبيعات', path: '/reports' },
      { name: '👥 ', path: '/profile' },
    ],
    cashier: [
      { name: '🧾 نقطة البيع', path: '/cashier' },
      { name: '📄 التقرير اليومي', path: '/shift' },
      { name: '👥 ', path: '/profile' },
    ],
  }

  const links = navConfig[role] || []

  const handleLogout = () => {
    localStorage.removeItem("pharmacy_user")
    router.replace("/")
  }

  return (
    // <AuthGuard>
    <div dir="rtl" className="flex flex-col min-h-screen bg-gray-50">
      <header
        className="sticky top-0 z-40 w-full bg-white border-b shadow-sm"
        style={{ borderColor: `${theme.colors.primary}20` }}
      >
        <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 mx-auto sm:flex-row max-w-7xl">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white rounded-md shadow"
              style={{ background: theme.colors.primary }}
            >
              💊
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">نظام الصيدلية الذكي</h1>
              <p className="text-xs text-gray-500 -mt-0.5">Pharmacy Management System</p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {links.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${
                  router.pathname === item.path
                    ? 'text-white shadow-sm'
                    : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'
                }`}
                style={{
                  backgroundColor:
                    router.pathname === item.path
                      ? theme.colors.primary
                      : 'transparent',
                  borderColor:
                    router.pathname === item.path
                      ? theme.colors.primary
                      : '#e5e7eb',
                }}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700">
              مرحبًا،{' '}
              <span className="font-semibold text-sky-700">
                {user?.name || 'مستخدم'}
              </span>
              <span className="ml-1 text-gray-500">
                ({role === 'admin' ? 'مدير' : role === 'cashier' ? 'كاشير' : 'صيدلي'})
              </span>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 border rounded-md shadow-sm"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.85)',
                borderColor: 'rgba(239, 68, 68, 0.5)',
              }}
            >
              <FaSignOutAlt className="text-lg" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {title && (
          <h2 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b border-gray-200">
            {title}
          </h2>
        )}
        {children}
      </main>

      <footer className="py-3 mt-auto text-xs text-center text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} نظام إدارة الصيدلية — جميع الحقوق محفوظة
      </footer>

      <ConfirmModal
        visible={showLogoutModal}
        title="تأكيد تسجيل الخروج"
        message="هل ترغب في تسجيل الخروج من النظام؟"
        confirmText="تسجيل الخروج"
        confirmColor={theme.colors.danger}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
    // </AuthGuard>
  )
}






















// // components/Layout.js
// import { useRouter } from 'next/router'
// import { useEffect, useState } from 'react'
// import toast from 'react-hot-toast'
// import theme from '../theme'
// import ConfirmModal from './ConfirmModal'
// import { FaSignOutAlt } from 'react-icons/fa'

// export default function Layout({ user, title, children }) {
//   const router = useRouter()
//   const [permissions, setPermissions] = useState([])
//   const [showLogoutModal, setShowLogoutModal] = useState(false)

//   useEffect(() => {
//     const savedPerms = JSON.parse(localStorage.getItem('permissions')) || []
//     setPermissions(savedPerms)
//   }, [])

//   // ✅ صلاحيات المستخدم (مدير أو حسب القائمة)
//   const hasPermission = (key) => user?.role === 'admin' || permissions.includes(key)

//   // const handleLogout = () => {
//   //   localStorage.removeItem('permissions')
//   //   toast.success('👋 تم تسجيل الخروج بنجاح')
//   //   router.push('/')
//   // }

//   // const handleLogout = () => {
//   //   // 🧹 تنظيف بيانات المستخدم
//   //   localStorage.removeItem('pharmacy_user')
//   //   // Cookies.remove('token')
//   //   // Cookies.remove('user')

//   //   toast.success('👋 تم تسجيل الخروج بنجاح')

//   //   // ⏳ بعد نصف ثانية يرجع إلى صفحة تسجيل الدخول
//   //   setTimeout(() => {
//   //     router.push('/')
//   //   }, 500)
//   // }

// //    const handleLogout = () => {
// //   localStorage.removeItem('pharmacy_token')
// //   localStorage.removeItem('pharmacy_user')
// //   window.location.href = '/'
// //     toast.success('👋 تم تسجيل الخروج بنجاح')

// // }

// const handleLogout = () => {
//   // حذف الجلسة تمامًا
//   localStorage.removeItem("pharmacy_token")
//   localStorage.removeItem("pharmacy_user")

//   // منع الرجوع إلى الخلف
//   window.history.pushState(null, "", window.location.href)
//   window.addEventListener("popstate", () => {
//     window.history.pushState(null, "", window.location.href)
//   })

//   // التحويل لصفحة تسجيل الدخول
//   router.replace("/")
// }



//   // 🔹 روابط التنقل حسب الدور
//   const navConfig = {
//     admin: [
//       { name: '🏠 لوحة التحكم', path: '/dashboard', perm: 'view_reports' },
//       { name: '💊 الأدوية', path: '/pharmacist', perm: 'manage_medicines' },
//       { name: '🧾 نقطة البيع', path: '/cashier', perm: 'add_sale' },
//       { name: '📦 المخزن', path: '/inventory', perm: 'view_reports' },
//       { name: '📊 التقارير', path: '/reports', perm: 'view_reports' },
//       { name: '👥 المستخدمون', path: '/users', perm: 'manage_users' },
//     ],
//     pharmacist: [
//       { name: '💊 الأدوية', path: '/pharmacist', perm: 'manage_medicines' },
//       { name: '📦 المخزون', path: '/inventory', perm: 'view_reports' },
//       { name: '📊 تقارير المبيعات', path: '/reports', perm: 'view_reports' },
//     ],
//     cashier: [
//       { name: '🧾 نقطة البيع', path: '/cashier', perm: 'add_sale' },
//       { name: '📄 التقرير اليومي', path: '/shift', perm: 'view_reports' },
//     ],
//   }

//   const role = user?.role || 'pharmacist'
//   const links = navConfig[role] || []

//   return (
//     <div dir="rtl" className="flex flex-col min-h-screen bg-gray-50">
//       {/* 🔹 الهيدر */}
//       <header
//         className="sticky top-0 z-40 w-full bg-white border-b shadow-sm"
//         style={{ borderColor: `${theme.colors.primary}20` }}
//       >
//         <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 mx-auto sm:flex-row max-w-7xl">
//           {/* شعار النظام */}
//           <div className="flex items-center gap-2">
//             <div
//               className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white rounded-md shadow"
//               style={{ background: theme.colors.primary }}
//             >
//               💊
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-800">نظام الصيدلية الذكي</h1>
//               <p className="text-xs text-gray-500 -mt-0.5">Pharmacy Management System</p>
//             </div>
//           </div>

//           {/* روابط التنقل */}
//           <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
//             {links.map(
//               (item) =>
//                 hasPermission(item.perm) && (
//                   <button
//                     key={item.path}
//                     onClick={() => router.push(item.path)}
//                     className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${
//                       router.pathname === item.path
//                         ? 'text-white shadow-sm'
//                         : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'
//                     }`}
//                     style={{
//                       backgroundColor:
//                         router.pathname === item.path
//                           ? theme.colors.primary
//                           : 'transparent',
//                       borderColor:
//                         router.pathname === item.path
//                           ? theme.colors.primary
//                           : '#e5e7eb',
//                     }}
//                   >
//                     {item.name}
//                   </button>
//                 )
//             )}
//           </nav>

//           {/* المستخدم وتسجيل الخروج */}
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2 text-sm text-gray-700">
//               <span>
//                 مرحبًا،{' '}
//                 <span className="font-semibold text-sky-700">{user?.name || 'مستخدم'}</span>{' '}
//                 <span className="ml-1 text-gray-500">
//                   ({user?.role === 'admin'
//                     ? 'مدير'
//                     : user?.role === 'cashier'
//                     ? 'كاشير'
//                     : 'صيدلي'}
//                   )
//                 </span>
//               </span>
//             </div>
//            <button
//   onClick={() => setShowLogoutModal(true)}
//   className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 border rounded-md shadow-sm"
//   style={{
//     backgroundColor: 'rgba(239, 68, 68, 0.85)', // 🔴 أحمر أكثر وضوحًا
//     borderColor: 'rgba(239, 68, 68, 0.5)',
//   }}
//   onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(220, 38, 38, 1)')} // أحمر قوي عند hover
//   onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.85)')} // يعود للشفاف القوي
// >
//   <FaSignOutAlt className="text-lg" />
//   <span>تسجيل الخروج</span>
// </button>


//           </div>
//         </div>
//       </header>

//       {/* المحتوى */}
//       <main className="flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
//         {title && (
//           <h2 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b border-gray-200">
//             {title}
//           </h2>
//         )}
//         {children}
//       </main>

//       {/* الفوتر */}
//       <footer className="py-3 mt-auto text-xs text-center text-gray-400 border-t border-gray-100">
//         © {new Date().getFullYear()} نظام إدارة الصيدلية — جميع الحقوق محفوظة
//       </footer>

//       {/* نافذة التأكيد */}
//       <ConfirmModal
//         visible={showLogoutModal}
//         title="تأكيد تسجيل الخروج"
//         message="هل ترغب في تسجيل الخروج من النظام؟"
//         confirmText="تسجيل الخروج"
//         confirmColor={theme.colors.danger}
//         onConfirm={handleLogout}
//         onCancel={() => setShowLogoutModal(false)}
//       />
//     </div>
//   )
// }











// // components/Layout.js
// import { useEffect, useMemo, useState } from 'react'
// import { useRouter } from 'next/router'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// export default function Layout({ user: userProp, title, children }) {
//   const router = useRouter()
//   const [user, setUser] = useState(userProp || null)

//   // قراءة المستخدم من localStorage
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem('pharmacy_user')
//       if (raw) setUser(JSON.parse(raw))
//     } catch {
//       // ignore
//     }
//   }, [])

//   const role = user?.role || 'guest'

//   // نظام الصلاحيات البسيط
//   const hasPermission = (perm) => {
//     const map = {
//       admin: ['dashboard', 'inventory', 'products', 'sales', 'reports', 'cashier', 'pharmacist', 'users'],
//       pharmacist: ['pharmacist', 'inventory', 'products', 'reports'],
//       cashier: ['cashier', 'pos', 'reports'],
//       guest: [],
//     }
//     return map[role]?.includes(perm)
//   }

//   const nav = useMemo(() => {
//     const items = []
//     if (hasPermission('dashboard')) items.push({ name: 'لوحة المدير', path: '/dashboard' })
//     if (hasPermission('pharmacist')) items.push({ name: 'لوحة الصيدلي', path: '/pharmacist' })
//     if (hasPermission('cashier')) items.push({ name: 'الكاشير', path: '/cashier' })
//     if (hasPermission('reports')) items.push({ name: 'التقارير', path: '/reports' })
//     return items
//   }, [role])

//   const handleLogout = () => {
//     localStorage.removeItem('pharmacy_user')
//     toast.success('تم تسجيل الخروج')
//     router.push('/')
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
//         <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           <div className="flex flex-wrap items-center justify-between gap-3 py-4">
//             <div className="flex items-center gap-3">
//               <div
//                 className="flex items-center justify-center w-10 h-10 text-xl text-white rounded-md shadow-sm"
//                 style={{ backgroundColor: theme.colors.primary }}
//               >
//                 💊
//               </div>
//               <div className="leading-tight">
//                 <div className="text-xl font-bold text-gray-900">نظام إدارة الصيدلية</div>
//                 <div className="text-xs text-gray-500">إدارة المبيعات والمخزون</div>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               {nav.map((n) => (
//                 <button
//                   key={n.path}
//                   onClick={() => router.push(n.path)}
//                   className={`px-3 py-1.5 rounded-md text-sm ${
//                     router.pathname === n.path
//                       ? 'text-white shadow-sm'
//                       : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'
//                   }`}
//                   style={{
//                     backgroundColor: router.pathname === n.path ? theme.colors.primary : 'transparent',
//                   }}
//                 >
//                   {n.name}
//                 </button>
//               ))}
//               <div className="w-px h-6 mx-1 bg-gray-200" />
//               {user ? (
//                 <>
//                   <span className="text-sm text-gray-700">
//                     مرحباً، {user.name}{' '}
//                     <span className="text-gray-500">({role === 'admin' ? 'مدير' : role === 'pharmacist' ? 'صيدلي' : role === 'cashier' ? 'كاشير' : 'زائر'})</span>
//                   </span>
//                   <button
//                     onClick={handleLogout}
//                     className="text-white bg-red-600 btn hover:bg-red-700"
//                   >
//                     تسجيل الخروج
//                   </button>
//                 </>
//               ) : (
//                 <button onClick={() => router.push('/')} className="btn btn-primary">تسجيل الدخول</button>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Page Title */}
//       <main className="flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
//         {title && <h2 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b border-gray-200">{title}</h2>}
//         {children}
//       </main>

//       {/* Footer */}
//       <footer className="py-3 text-xs text-center text-gray-400 border-t border-gray-100">
//         © 2025 نظام إدارة الصيدلية — جميع الحقوق محفوظة
//       </footer>
//     </div>
//   )
// }






// // components/Layout.js
// import { useRouter } from 'next/router'
// import { useEffect, useState } from 'react'
// import toast from 'react-hot-toast'
// import theme from '../theme'
// import ConfirmModal from './ConfirmModal'

// export default function Layout({ user, title, children }) {
//   const router = useRouter()
//   const [permissions, setPermissions] = useState([])
//   const [showLogoutModal, setShowLogoutModal] = useState(false)

//   useEffect(() => {
//     const savedPerms = JSON.parse(localStorage.getItem('permissions')) || []
//     setPermissions(savedPerms)
//   }, [])

//   const hasPermission = (key) => user?.role === 'admin' || permissions.includes(key)

//   const handleLogout = () => {
//     localStorage.removeItem('permissions')
//     toast.success('تم تسجيل الخروج بنجاح')
//     router.push('/')
//   }

//   const navItems = [
//     { name: 'لوحة التحكم', path: '/dashboard', perm: 'view_reports' },
//     { name: 'الأدوية', path: '/pharmacist', perm: 'manage_medicines' },
//     { name: 'نقطة البيع', path: '/cashier', perm: 'add_sale' },
//     { name: 'التقارير', path: '/reports', perm: 'view_reports' },
//   ]

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
//       <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
//         <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           <div className="flex flex-wrap items-center justify-between gap-3 py-4">
//             <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

//             <div className="flex items-center space-x-4 space-x-reverse">
//               <span className="text-sm text-gray-700">مرحباً، {user?.name}</span>
//               <button
//                 onClick={() => setShowLogoutModal(true)}
//                 className="px-4 py-1.5 text-sm font-medium text-white rounded-md border border-red-200 shadow-sm hover:opacity-90 transition"
//                 style={{ backgroundColor: theme.colors.danger }}
//               >
//                 تسجيل الخروج
//               </button>
//             </div>
//           </div>

//           <nav className="flex flex-wrap gap-2 pt-2 pb-3 border-t border-gray-100">
//             {navItems.map(
//               (item) =>
//                 hasPermission(item.perm) && (
//                   <button
//                     key={item.path}
//                     onClick={() => router.push(item.path)}
//                     className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
//                       router.pathname === item.path
//                         ? 'text-white shadow-sm'
//                         : 'text-gray-600 hover:text-sky-700 hover:bg-sky-50'
//                     }`}
//                     style={{
//                       backgroundColor:
//                         router.pathname === item.path ? theme.colors.primary : 'transparent',
//                     }}
//                   >
//                     {item.name}
//                   </button>
//                 )
//             )}
//           </nav>
//         </div>
//       </header>

//       <main className="flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
//         {children}
//       </main>

//       <footer className="py-3 mt-auto text-xs text-center text-gray-400 border-t border-gray-100">
//         © 2025 نظام إدارة الصيدلية — جميع الحقوق محفوظة
//       </footer>

//       <ConfirmModal
//         visible={showLogoutModal}
//         title="تأكيد تسجيل الخروج"
//         message="هل ترغب في تسجيل الخروج من النظام؟"
//         confirmText="تسجيل الخروج"
//         confirmColor={theme.colors.danger}
//         onConfirm={handleLogout}
//         onCancel={() => setShowLogoutModal(false)}
//       />
//     </div>
//   )
// }





// import { useState } from 'react'
// import { useRouter } from 'next/router'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function Layout({ user, title, children }) {
//   const router = useRouter()
//   const [showLogout, setShowLogout] = useState(false)

//   // 🔸 روابط الهيدر حسب الدور
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
//       { name: '💼 الوردية', path: '/cashierReport' },
//       { name: '📄 التقرير اليومي', path: '/shift' },
//     ],
//   }

//   // 🔸 الأيقونات التعريفية لكل دور
//   const roleIcons = {
//     admin: '👑',
//     pharmacist: '💊',
//     cashier: '💵',
//   }

//   const role = user?.role || 'pharmacist'
//   const links = navConfig[role] || []
//   const icon = roleIcons[role] || '👤'

//   const handleLogout = () => {
//     toast.success('👋 تم تسجيل الخروج بنجاح')
//     setTimeout(() => router.push('/'), 1000)
//   }

//   return (
//     <div dir="rtl" className="flex flex-col min-h-screen bg-gray-50">
//       {/* 🔹 الهيدر الديناميكي */}
//       <header
//         className="sticky top-0 z-40 w-full bg-white border-b shadow-sm"
//         style={{ borderColor: `${theme.colors.primary}20` }}
//       >
//         <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 mx-auto sm:flex-row max-w-7xl">
//           {/* شعار النظام */}
//           <div className="flex items-center gap-2">
//             <div
//               className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white rounded-md shadow"
//               style={{ background: theme.colors.primary }}
//             >
//               💊
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-800">نظام الصيدلية الذكي</h1>
//               <p className="text-xs text-gray-500 -mt-0.5">Pharmacy System</p>
//             </div>
//           </div>

//           {/* روابط التنقل */}
//           <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
//             {links.map((item) => {
//               const active = router.pathname === item.path
//               return (
//                 <button
//                   key={item.path}
//                   onClick={() => router.push(item.path)}
//                   className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${
//                     active
//                       ? 'text-white shadow-sm'
//                       : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'
//                   }`}
//                   style={{
//                     backgroundColor: active ? theme.colors.primary : 'transparent',
//                     borderColor: active ? theme.colors.primary : '#e5e7eb',
//                   }}
//                 >
//                   {item.name}
//                 </button>
//               )
//             })}
//           </nav>

//           {/* معلومات المستخدم */}
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2 text-sm text-gray-700">
//               <span className="text-lg">{icon}</span>
//               <span>
//                 مرحبًا،{' '}
//                 <span className="font-semibold text-sky-700">
//                   {user?.name || 'مستخدم'}
//                 </span>{' '}
//                 <span className="ml-1 text-gray-500">
//                   ({user?.role === 'admin'
//                     ? 'مدير'
//                     : user?.role === 'cashier'
//                     ? 'كاشير'
//                     : 'صيدلي'}
//                   )
//                 </span>
//               </span>
//             </div>

//             <button
//               onClick={handleLogout}
//               className="px-3 py-1.5 text-sm text-white rounded-md border shadow-sm hover:opacity-90"
//               style={{
//                 background: theme.colors.danger,
//                 borderColor: `${theme.colors.danger}80`,
//               }}
//             >
//               تسجيل الخروج
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* المحتوى */}
//       <main className="flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
//         {title && (
//           <h2 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b border-gray-200">
//             {title}
//           </h2>
//         )}
//         {children}
//       </main>

//       {/* الفوتر */}
//       <footer className="py-3 mt-auto text-xs text-center text-gray-400 border-t border-gray-100">
//         © {new Date().getFullYear()} نظام إدارة الصيدلية — جميع الحقوق محفوظة
//       </footer>
//     </div>
//   )
// }

