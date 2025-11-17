// pages/index.js
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()

    if (!username || !password) {
      alert('⚠️ الرجاء إدخال البيانات كاملة')
      return
    }

    // تحديد الدور تلقائياً حسب اسم المستخدم
    let role = "admin"
    let redirect = "/dashboard"

    if (username.toLowerCase() === "pharma") {
      role = "pharmacist"
      redirect = "/pharmacist"
    }

    if (username.toLowerCase() === "ca") {
      role = "cashier"
      redirect = "/cashier"
    }

    // تخزين المستخدم في localStorage (بدون باك اند)
    const user = { name: username, role }
    localStorage.setItem("pharmacy_user", JSON.stringify(user))
    localStorage.setItem("pharmacy_token", "demo-token")

    // التوجيه
    router.push(redirect)
  }

  return (
    <div
      dir="rtl"
      className="grid min-h-screen px-4 place-items-center bg-gradient-to-br from-sky-100 to-white"
    >
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">

        {/* الشعار */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-3 text-3xl text-white rounded-full shadow-md bg-sky-500">
            💊
          </div>
          <h1 className="text-2xl font-bold text-gray-800">صيدلية المعلّم</h1>
          <p className="mt-1 text-sm text-gray-500">يرجى تسجيل الدخول للمتابعة</p>
        </div>

        {/* النموذج */}
        <form onSubmit={handleLogin} className="space-y-5 text-right">

          {/* اسم المستخدم */}
          <div className="relative">
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            />
            <span className="absolute inset-y-0 flex items-center text-lg text-gray-500 right-3">
              👤
            </span>
          </div>

          {/* كلمة المرور */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            />
            <span className="absolute inset-y-0 flex items-center text-lg text-gray-500 right-3">
              🔒
            </span>

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 flex items-center text-gray-500 left-3 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* زر الدخول */}
          <button
            type="submit"
            className="w-full py-2.5 text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-md transition"
          >
            تسجيل الدخول
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-400">
          © 2025 جميع الحقوق محفوظة — نظام إدارة الصيدلية
        </p>

      </div>
    </div>
  )
}













// import { useState } from 'react'
// import { useRouter } from 'next/router'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function LoginPage() {
//   const router = useRouter()

//   const [form, setForm] = useState({
//     username: '',
//     password: ''
//   })

//   const [loading, setLoading] = useState(false)

// const handleLogin = async () => {
//   if (!form.username || !form.password) {
//     return toast.error('يرجى إدخال اسم المستخدم وكلمة المرور')
//   }

//   try {
//     setLoading(true)

//     const res = await fetch('http://localhost:5000/api/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form)
//     })

//     const data = await res.json()

//     if (!res.ok) {
//       toast.error(data.message || 'فشل تسجيل الدخول')
//       return
//     }

//     // حفظ الجلسة
//     localStorage.setItem('pharmacy_token', data.token)
//     localStorage.setItem('pharmacy_user', JSON.stringify(data.user))

//     toast.success('تم تسجيل الدخول بنجاح ✔️')

//     // 🟦 التوجيه حسب الدور
//     if (data.user.role === 'admin') {
//       router.replace('/dashboard')
//     } 
//     else if (data.user.role === 'cashier') {
//       router.replace('/cashier')
//     } 
//     else if (data.user.role === 'pharmacist') {
//       router.replace('/pharmacist')
//       // router.replace('/inventory')


//     } 
//     else {
//       toast.error("دور المستخدم غير معروف!")
//     }

//   } catch (err) {
//     console.error(err)
//     toast.error('خطأ في الاتصال بالسيرفر')
//   } finally {
//     setLoading(false)
//   }
// }



// //   const handleLogin = async () => {
// //   if (!form.username || !form.password) {
// //     return toast.error('يرجى إدخال اسم المستخدم وكلمة المرور')
// //   }

// //   try {
// //     setLoading(true)

// //     const res = await fetch('http://localhost:5000/api/auth/login', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify(form)
// //     })

// //     const data = await res.json()

// //     if (!res.ok) {
// //       toast.error(data.message || 'فشل تسجيل الدخول')
// //       return
// //     }

// //     // 🟢 إصلاح التخزين
// //     localStorage.setItem('pharmacy_token', data.token)
// //     localStorage.setItem('pharmacy_user', JSON.stringify(data.user))

// //     toast.success('تم تسجيل الدخول بنجاح ✔️')

// //     router.replace('/dashboard')   // → مع منع الرجوع

// //   } catch (err) {
// //     console.error(err)
// //     toast.error('خطأ في الاتصال بالسيرفر')
// //   } finally {
// //     setLoading(false)
// //   }
// // }


//   return (
//     <div
//       dir="rtl"
//       className="flex items-center justify-center min-h-screen"
//       style={{ background: theme.colors.primary + '15' }}
//     >
//       <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow">
//         <h1 className="mb-4 text-xl font-bold text-center text-gray-700">🔐 تسجيل الدخول</h1>

//         <div className="space-y-3 text-sm">
//           <div>
//             <label className="text-gray-600">اسم المستخدم</label>
//             <input
//               type="text"
//               className="w-full px-3 py-2 mt-1 border rounded-md"
//               value={form.username}
//               onChange={(e) => setForm({ ...form, username: e.target.value })}
//             />
//           </div>

//           <div>
//             <label className="text-gray-600">كلمة المرور</label>
//             <input
//               type="password"
//               className="w-full px-3 py-2 mt-1 border rounded-md"
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//             />
//           </div>

//           <button
//             onClick={handleLogin}
//             disabled={loading}
//             className="w-full py-2 mt-3 text-white rounded-md"
//             style={{ background: theme.colors.primary }}
//           >
//             {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }






// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import axios from 'axios'
// import toast, { Toaster } from 'react-hot-toast'

// export default function LoginPage() {
//   const router = useRouter()
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [checking, setChecking] = useState(true)

//   // ✅ التوجيه الآمن حسب الدور
//   const goToRolePage = (role) => {
//     const route =
//       role === 'pharmacist'
//         ? '/pharmacist'
//         : role === 'cashier'
//         ? '/cashier'
//         : '/dashboard'
//     if (router.pathname !== route) {
//       router.push(route)
//     }
//   }

//   // ✅ تحقق من الجلسة عند فتح الصفحة
//   useEffect(() => {
//     if (typeof window === 'undefined') return

//     const token = localStorage.getItem('pharmacy_token')
//     const rawUser = localStorage.getItem('pharmacy_user')

//     if (token && rawUser) {
//       try {
//         const user = JSON.parse(rawUser)
//         goToRolePage(user.role)
//         return
//       } catch {
//         localStorage.clear()
//       }
//     }
//     setChecking(false)
//   }, [])

//   // ✅ تنفيذ تسجيل الدخول
//   const handleLogin = async (e) => {
//     e.preventDefault()
//     if (!username || !password) return toast.error('يرجى إدخال بيانات صحيحة')

//     try {
//       setLoading(true)
//       const res = await axios.post('http://localhost:5000/api/auth/login', {
//         username,
//         password,
//       })
//       const { token, user } = res.data
//       localStorage.setItem('pharmacy_token', token)
//       localStorage.setItem('pharmacy_user', JSON.stringify(user))
//       toast.success(`مرحبًا ${user.name}`)
//       setTimeout(() => goToRolePage(user.role), 500)
//     } catch (err) {
//       const msg =
//         err.response?.data?.message || 'فشل تسجيل الدخول، تحقق من البيانات'
//       toast.error(msg)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Splash أثناء الفحص
//   if (checking) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center text-gray-500">
//           <div className="w-8 h-8 mx-auto mb-3 border-4 rounded-full border-sky-500 border-t-transparent animate-spin"></div>
//           <p>جارٍ التحقق من الجلسة...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div
//       dir="rtl"
//       className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-blue-100"
//     >
//       <Toaster position="top-center" />
//       <form
//         onSubmit={handleLogin}
//         className="w-full max-w-sm p-6 space-y-4 bg-white border rounded-lg shadow-lg"
//       >
//         <h1 className="text-2xl font-bold text-center text-sky-700">
//           👩‍⚕️ نظام إدارة الصيدلية
//         </h1>
//         <div>
//           <label className="block mb-1 text-sm text-gray-700">اسم المستخدم</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
//           />
//         </div>
//         <div>
//           <label className="block mb-1 text-sm text-gray-700">كلمة المرور</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 mt-2 text-white rounded-md ${
//             loading ? 'bg-sky-300' : 'bg-sky-600 hover:bg-sky-700'
//           }`}
//         >
//           {loading ? 'جارٍ التحقق...' : 'تسجيل الدخول'}
//         </button>
//       </form>
//     </div>
//   )
// }












// // pages/index.js
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function Login() {
//   const router = useRouter()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [role, setRole] = useState('admin')
//   const [showPassword, setShowPassword] = useState(false)

//   useEffect(() => {
//     const raw = localStorage.getItem('pharmacy_user')
//     if (raw) {
//       const u = JSON.parse(raw)
//       redirectByRole(u.role)
//     }
//   }, [])

//   const redirectByRole = (r) => {
//     if (r === 'admin') router.push('/dashboard')
//     else if (r === 'pharmacist') router.push('/pharmacist')
//     else if (r === 'cashier') router.push('/cashier')
//     else router.push('/reports')
//   }

//   const onSubmit = (e) => {
//     e.preventDefault()
//     if (!email || !password) {
//       toast.error('يرجى إدخال البريد وكلمة المرور')
//       return
//     }
//     const user = { name: email.split('@')[0] || 'مستخدم', email, role }
//     localStorage.setItem('pharmacy_user', JSON.stringify(user))
//     toast.success('تم تسجيل الدخول بنجاح')
//     redirectByRole(role)
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen px-4">
//       <div className="w-full max-w-md p-6 card">
//         <div className="mb-5 text-center">
//           <div
//             className="flex items-center justify-center w-12 h-12 mx-auto mb-3 text-2xl text-white rounded-md"
//             style={{ backgroundColor: theme.colors.primary }}
//           >
//             💊
//           </div>
//           <h1 className="text-xl font-bold text-gray-900">تسجيل الدخول</h1>
//           <p className="text-sm text-gray-500">اختر الدور وسجل للدخول إلى النظام</p>
//         </div>

//         <form onSubmit={onSubmit} className="space-y-3">
//           <div>
//             <label className="block mb-1 text-sm text-gray-700">البريد الإلكتروني</label>
//             <input
//               type="email"
//               className="input"
//               placeholder="you@mail.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               autoFocus
//             />
//           </div>

//           <div className="relative">
//             <label className="block mb-1 text-sm text-gray-700">كلمة المرور</label>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               className="pr-10 input"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             {/* زر إظهار/إخفاء بمحاذاة اليسار وعموديًا وسط الحقل */}
//             <button
//               type="button"
//               onClick={() => setShowPassword((v) => !v)}
//               className="absolute top-[34px] left-2 h-[38px] px-2 flex items-center justify-center text-gray-500 hover:text-gray-700"
//               aria-label="toggle password"
//             >
//               {showPassword ? '🙈' : '👁️'}
//             </button>
//           </div>

//           <div>
//             <label className="block mb-1 text-sm text-gray-700">الدور</label>
//             <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
//               <option value="admin">👑 مدير</option>
//               <option value="pharmacist">💊 صيدلي</option>
//               <option value="cashier">💵 كاشير</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full mt-4 btn btn-primary"
//             style={{ paddingTop: '10px', paddingBottom: '10px' }}
//           >
//             دخول
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

















// import { useState } from 'react'
// import { useRouter } from 'next/router'

// export default function Login() {
//   const router = useRouter()
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [role, setRole] = useState('pharmacist') // الصيدلي افتراضيًا
//   const [showPassword, setShowPassword] = useState(false)

//   const handleLogin = (e) => {
//     e.preventDefault()

//     if (!username || !password) {
//       alert('⚠️ يرجى إدخال اسم المستخدم وكلمة المرور')
//       return
//     }

//     // ✅ التوجيه حسب الدور
//     switch (role) {
//       case 'pharmacist':
//         router.push('/pharmacist')
//         break
//       case 'cashier':
//         router.push('/cashier')
//         break
//       case 'manager':
//         router.push('/dashboard')
//         break
//       default:
//         alert('دور المستخدم غير معروف')
//     }
//   }

//   return (
//     <div
//       dir="rtl"
//       className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-blue-100"
//     >
//       <div className="w-full max-w-md p-6 bg-white border shadow-lg rounded-2xl">
//         <h1 className="mb-1 text-2xl font-bold text-center text-sky-700">
//           نظام إدارة الصيدلية
//         </h1>
//         <p className="mb-6 text-sm text-center text-gray-500">
//           يرجى تسجيل الدخول للمتابعة
//         </p>

//         <form onSubmit={handleLogin} className="space-y-4">
//           {/* اسم المستخدم */}
//           <div>
//             <label className="block mb-1 text-sm text-gray-600">اسم المستخدم</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-400"
//               placeholder="أدخل اسم المستخدم"
//             />
//           </div>

//           {/* كلمة المرور */}
//           <div className="relative">
//             <label className="block mb-1 text-sm text-gray-600">كلمة المرور</label>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-400"
//               placeholder="••••••••"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute text-gray-500 left-3 top-8 hover:text-sky-600"
//             >
//               {showPassword ? '🙈' : '👁️'}
//             </button>
//           </div>

//           {/* اختيار الدور */}
//           <div>
//             <label className="block mb-1 text-sm text-gray-600">الدور</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-400"
//             >
//               <option value="pharmacist">👨‍⚕️ الصيدلي</option>
//               <option value="cashier">💼 الكاشير</option>
//               <option value="manager">🧑‍💻 المدير</option>
//             </select>
//           </div>

//           {/* زر الدخول */}
//           <button
//             type="submit"
//             className="w-full py-2.5 mt-2 text-white rounded-md shadow-md bg-sky-600 hover:bg-sky-700 transition"
//           >
//             تسجيل الدخول
//           </button>
//         </form>

//         <p className="mt-6 text-xs text-center text-gray-400">
//           © 2025 جميع الحقوق محفوظة — نظام إدارة الصيدلية
//         </p>
//       </div>
//     </div>
//   )
// }











// import { useState } from 'react'
// import { useRouter } from 'next/router'

// export default function Login() {
//   const router = useRouter()
//   const [role, setRole] = useState('manager')
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)

//   const handleLogin = (e) => {
//     e.preventDefault()
//     if (!username || !password) {
//       alert('الرجاء إدخال اسم المستخدم وكلمة المرور')
//       return
//     }

//     if (role === 'manager') router.push('/dashboard')
//     else if (role === 'pharmacist') router.push('/inventory')
//     else if (role === 'cashier') router.push('/cashier')
//   }

//   return (
//     <div
//       dir="rtl"
//       className="grid min-h-screen px-4 place-items-center bg-gradient-to-br from-sky-100 to-white"
//     >
//       <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
//         {/* الشعار والعنوان */}
//         <div className="flex flex-col items-center mb-6 text-center">
//           <div className="flex items-center justify-center w-16 h-16 mb-3 text-3xl text-white rounded-full shadow-md bg-sky-500">
//             💊
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800">صيدلية المعلّم</h1>
//           <p className="mt-1 text-sm text-gray-500">يرجى تسجيل الدخول للمتابعة</p>
//         </div>

//         {/* اختيار نوع المستخدم */}
//         <div className="mb-4 text-right">
//           <label className="block mb-1 text-sm font-medium text-gray-700">
//             اختر نوع المستخدم
//           </label>
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="w-full px-3 py-2 text-right border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
//           >
//             <option value="manager">👨‍💼 المدير</option>
//             <option value="pharmacist">💊 الصيدلي</option>
//             <option value="cashier">💵 الكاشير</option>
//           </select>
//         </div>

//         {/* اسم المستخدم */}
//         <div className="mb-4 text-right">
//           <label className="block mb-1 text-sm font-medium text-gray-700">
//             اسم المستخدم
//           </label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full px-3 py-2 text-right border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
//             placeholder="أدخل اسم المستخدم"
//           />
//         </div>

//         {/* كلمة المرور */}
//        <div className="relative mb-6 text-right">
//   <label className="block mb-1 text-sm font-medium text-gray-700">
//     كلمة المرور
//   </label>
//   <input
//     type={showPassword ? 'text' : 'password'}
//     value={password}
//     onChange={(e) => setPassword(e.target.value)}
//     className="w-full px-3 py-2 pr-10 text-right border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
//     placeholder="••••••••"
//   />
//   <button
//     type="button"
//     onClick={() => setShowPassword(!showPassword)}
//     className="absolute flex items-center justify-center text-gray-500 -translate-y-1/2 left-3 top-1/2 hover:text-sky-500"
//     tabIndex={-1}
//   >
//     {showPassword ? '🙈' : '👁️'}
//   </button>
// </div>


//         {/* زر تسجيل الدخول */}
//         <button
//           onClick={handleLogin}
//           className="w-full py-2.5 text-white font-semibold rounded-md shadow-md transition bg-sky-500 hover:bg-sky-600"
//         >
//           تسجيل الدخول
//         </button>

//         {/* الفوتر */}
//         <p className="mt-6 text-xs text-center text-gray-400">
//           © 2025 صيدلية المعلّم – جميع الحقوق محفوظة
//         </p>
//       </div>
//     </div>
//   )
// }
