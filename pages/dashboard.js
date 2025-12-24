// pages/dashboard.js
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import theme from "../theme";
import AuthGuard from "../components/AuthGuard";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FaPills,
  FaCashRegister,
  FaChartLine,
  FaMoneyBillWave,
  FaUsers,
  FaClock,
} from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();

  // ✅ المستخدم من مصدر واحد فقط
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("pharmacy_user"))
      : null;

  // بيانات تجريبية
  const [salesData] = useState([
    { month: "يناير", total: 3200 },
    { month: "فبراير", total: 4100 },
    { month: "مارس", total: 3800 },
    { month: "أبريل", total: 5200 },
    { month: "مايو", total: 6100 },
    { month: "يونيو", total: 5700 },
  ]);

  const totalSales = salesData.reduce((s, m) => s + m.total, 0);

  // روابط الوصول السريع
  const quickLinks = [
    {
      title: "المنتجات",
      icon: <FaPills />,
      path: "/products",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "المبيعات",
      icon: <FaCashRegister />,
      path: "/sales",
      color: "from-sky-500 to-blue-600",
    },
    {
      title: "التقارير",
      icon: <FaChartLine />,
      path: "/reports",
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "الحسابات",
      icon: <FaMoneyBillWave />,
      path: "/accounts",
      color: "from-amber-500 to-yellow-600",
    },
    {
      title: "المستخدمون",
      icon: <FaUsers />,
      path: "/users",
      color: "from-teal-500 to-cyan-600",
    },
    {
      title: "الشفت",
      icon: <FaClock />,
      path: "/shifts",
      color: "from-pink-500 to-rose-600",
    },
  ];

  if (!user) return null;

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <Layout user={user} title="لوحة التحكم">
        <div dir="rtl" className="space-y-10">

          {/* 🔵 الوصول السريع */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              الوصول السريع
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => router.push(link.path)}
                  className={`
                    relative flex flex-col items-center justify-center p-5
                    rounded-2xl shadow-md bg-gradient-to-br ${link.color}
                    text-white transition-all duration-200
                    hover:scale-[1.05] hover:shadow-xl
                  `}
                >
                  <div className="relative mb-2 text-4xl">{link.icon}</div>
                  <h3 className="relative text-sm font-semibold">
                    {link.title}
                  </h3>
                </button>
              ))}
            </div>
          </section>

          {/* 🟢 بطاقات الملخص */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="إجمالي المبيعات"
              value={`${totalSales.toLocaleString()} ر.س`}
              color="text-sky-600"
            />
            <SummaryCard
              title="عدد الفواتير"
              value="248"
              color="text-blue-600"
            />
            <SummaryCard
              title="عدد الأدوية"
              value="126"
              color="text-green-600"
            />
            <SummaryCard
              title="عدد المستخدمين"
              value="3"
              color="text-amber-600"
            />
          </div>

          {/* 📈 الرسم البياني */}
          <div className="p-5 bg-white border shadow-lg rounded-xl">
            <h3 className="mb-3 text-lg font-bold text-gray-800">
              المبيعات الشهرية
            </h3>

            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={theme.colors.primary}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}

// 🟡 بطاقة الملخص
function SummaryCard({ title, value, color }) {
  return (
    <div className="p-5 transition bg-white border shadow-md rounded-xl hover:shadow-lg">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className={`mt-1 text-2xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}









// // pages/dashboard.js
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Layout from "../components/Layout";
// import theme from "../theme";
// import AuthGuard from "../components/AuthGuard";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// import {
//   FaPills,
//   FaCashRegister,
//   FaChartLine,
//   FaMoneyBillWave,
//   FaUsers,
//   FaClock,
// } from "react-icons/fa";

// export default function Dashboard() {
//   // const [user] = useState({ name: "المدير أحمد", role: "admin" });
//   // const [users, setUser] = useState([]);
//   const [salesData, setSalesData] = useState([]);
//   // const router = useRouter();
//   const [users, setUser] = useState(null);
//   const [ready, setReady] = useState(false);
//   const router = useRouter();

//   // useEffect(() => {
//   //   setUsers([
//   //     { id: 1, name: "محمد الصيدلي", role: "pharmacist" },
//   //     { id: 2, name: "أحمد الكاشير", role: "cashier" },
//   //     { id: 3, name: "مها الإدارية", role: "admin" },
//   //   ]);

//   //   setSalesData([
//   //     { month: "يناير", total: 3200 },
//   //     { month: "فبراير", total: 4100 },
//   //     { month: "مارس", total: 3800 },
//   //     { month: "أبريل", total: 5200 },
//   //     { month: "مايو", total: 6100 },
//   //     { month: "يونيو", total: 5700 },
//   //   ]);
//   // }, []);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userStr = localStorage.getItem("user");

//     if (!token || !userStr) {
//       router.replace("/");
//       return;
//     }

//     try {
//       const parsedUser = JSON.parse(userStr);
//       const role = Number(parsedUser.role_id);

//       if (role !== 1) {
//         router.replace("/");
//         return;
//       }

//       setUser(parsedUser);
//       setReady(true);
//     } catch (err) {
//       console.error("Dashboard auth error:", err);
//       router.replace("/");
//     }
//   }, [router]);

//   // ⛔ لا ترسم الصفحة قبل التأكد
//   if (!ready) return null;



//   const totalSales = salesData.reduce((s, m) => s + m.total, 0);

//   // روابط الوصول السريع — محسّنة بصرياً
//   const quickLinks = [
//     {
//       title: "المنتجات",
//       icon: <FaPills />,
//       path: "/products",
//       color: "from-green-500 to-emerald-600",
//     },
//     {
//       title: "المبيعات",
//       icon: <FaCashRegister />,
//       path: "/sales",
//       color: "from-sky-500 to-blue-600",
//     },
//     {
//       title: "التقارير",
//       icon: <FaChartLine />,
//       path: "/reports",
//       color: "from-purple-500 to-indigo-600",
//     },
//     {
//       title: "الحسابات",
//       icon: <FaMoneyBillWave />,
//       path: "/accounts",
//       color: "from-amber-500 to-yellow-600",
//     },
//     {
//       title: "المستخدمون",
//       icon: <FaUsers />,
//       path: "/users",
//       color: "from-teal-500 to-cyan-600",
//     },
//     {
//       title: "الشفت",
//       icon: <FaClock />,
//       path: "/shifts",
//       color: "from-pink-500 to-rose-600",
//     },
//   ];
// if (!users) return null;

//   return (
//     <AuthGuard allowedRoles={["admin"]}>
//     <Layout user={users}  title="لوحة التحكم">
//       <div dir="rtl" className="space-y-10">

//         {/* 🔵 الوصول السريع — تصميم احترافي */}
//         <section>
//           <h2 className="mb-4 text-2xl font-bold text-gray-800">الوصول السريع</h2>

//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//             {quickLinks.map((link, index) => (
//               <button
//                 key={index}
//                 onClick={() => router.push(link.path)}
//                 className={`
//                   relative flex flex-col items-center justify-center p-5 
//                   rounded-2xl shadow-md bg-gradient-to-br ${link.color}
//                   text-white transition-all duration-200 
//                   hover:scale-[1.05] hover:shadow-xl
//                 `}
//               >
//                 <div className="absolute inset-0 transition bg-black/10 rounded-2xl group-hover:bg-black/20"></div>
//                 <div className="relative mb-2 text-4xl">{link.icon}</div>
//                 <h3 className="relative text-sm font-semibold">{link.title}</h3>
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* 🟢 بطاقات ملخص — تصميم أكثر فخامة */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <SummaryCard
//             title="إجمالي المبيعات"
//             value={`${totalSales.toLocaleString()} ر.س`}
//             color="text-sky-600"
//           />
//           <SummaryCard title="عدد الفواتير" value="248" color="text-blue-600" />
//           <SummaryCard title="عدد الأدوية" value="126" color="text-green-600" />
//           <SummaryCard
//             title="عدد المستخدمين"
//             value={users.length}
//             color="text-amber-600"
//           />
//         </div>

//         {/* 📈 الرسم البياني — احترافي */}
//         <div className="p-5 bg-white border shadow-lg rounded-xl">
//           <h3 className="mb-3 text-lg font-bold text-gray-800">
//             المبيعات الشهرية
//           </h3>

//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={salesData}>
//               <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
//               <XAxis dataKey="month" stroke="#6b7280" />
//               <YAxis stroke="#6b7280" />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="total"
//                 stroke={theme.colors.primary}
//                 strokeWidth={3}
//                 dot={{ r: 5 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* 📝 آخر العمليات + التحليل */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
//           <div className="p-5 bg-white border shadow-lg rounded-xl lg:col-span-2">
//             <h3 className="mb-4 text-lg font-bold text-gray-800">آخر العمليات</h3>
//             <ul className="space-y-3 text-sm">
//               <ActivityCard
//                 icon="💰"
//                 text="تم إنشاء فاتورة بقيمة 245 ر.س بواسطة أحمد."
//               />
//               <ActivityCard
//                 icon="📦"
//                 text="تم تحديث مخزون دواء “فيتامين سي”."
//               />
//               <ActivityCard
//                 icon="📊"
//                 text="تم عرض تقرير المبيعات اليومية."
//               />
//             </ul>
//           </div>

//           {/* التحليل */}
//           <div className="p-5 border border-green-300 shadow-lg rounded-xl bg-gradient-to-br from-green-50 to-green-100">
//             <h3 className="mb-3 text-lg font-bold text-green-800">📈 تحليل الأداء</h3>
//             <p className="text-sm leading-relaxed text-green-700">
//               أداء المبيعات ارتفع بنسبة <strong>+12%</strong> الأسبوع الماضي،  
//               مع زيادة في عدد الطلبات <strong>+8%</strong>.  
//               استمر بتحسين العروض والسرعة لزيادة الأرباح.
//             </p>
//           </div>

//         </div>
//       </div>
//     </Layout>
//     </AuthGuard>
//   );
// }

// // 🟡 بطاقة الملخص
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-5 transition bg-white border shadow-md rounded-xl hover:shadow-lg">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`mt-1 text-2xl font-bold ${color}`}>{value}</h3>
//     </div>
//   );
// }

// // 🟣 بطاقة عملية
// function ActivityCard({ icon, text }) {
//   return (
//     <li className="flex items-center gap-3 p-3 transition border rounded-lg bg-gray-50 hover:bg-gray-100">
//       <span className="text-xl">{icon}</span>
//       <span>{text}</span>
//     </li>
//   );
// }















// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// } from 'recharts'

// export default function Dashboard() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [users, setUsers] = useState([])
//   const [salesData, setSalesData] = useState([])
//   const router = useRouter()


// //   useEffect(() => {
// //   const token = localStorage.getItem("pharmacy_token")
// //   if (!token) {
// //     router.replace("/")   // redirect to login
// //   }
// // }, [])

//   useEffect(() => {
//     setUsers([
//       { id: 1, name: 'محمد الصيدلي', role: 'pharmacist', email: 'pharma@mail.com' },
//       { id: 2, name: 'أحمد الكاشير', role: 'cashier', email: 'cashier@mail.com' },
//       { id: 3, name: 'مها الإدارية', role: 'admin', email: 'admin@mail.com' }
//     ])

//     setSalesData([
//       { month: 'يناير', total: 3200 },
//       { month: 'فبراير', total: 4100 },
//       { month: 'مارس', total: 3800 },
//       { month: 'أبريل', total: 5200 },
//       { month: 'مايو', total: 6100 },
//       { month: 'يونيو', total: 5700 }
//     ])
//   }, [])

//   const totalSales = salesData.reduce((s, m) => s + m.total, 0)

//   // روابط الوصول السريع (بدون react-icons)
//   const quickLinks = [
//     { title: 'المنتجات', icon: '💊', bg: 'from-green-500/70 to-emerald-600/70', path: '/products' },
//     { title: 'المبيعات', icon: '🧾', bg: 'from-sky-500/70 to-blue-600/70', path: '/sales' },
//     { title: 'المخزن', icon: '🏬', bg: 'from-orange-500/70 to-amber-600/70', path: '/inventory' },
//     { title: 'التقارير', icon: '📈', bg: 'from-purple-500/70 to-indigo-600/70', path: '/reports' },
//     { title: 'الحسابات', icon: '💵', bg: 'from-amber-500/70 to-yellow-600/70', path: '/accounts' },
//     { title: 'المستخدمون', icon: '👥', bg: 'from-teal-500/70 to-cyan-600/70', path: '/users' }
//   ]

//   return (
//     <Layout user={user} title="لوحة التحكم الرئيسية">
//       <div dir="rtl" className="space-y-10">

//         {/* الوصول السريع */}
//         <section>
//           <h2 className="mb-5 text-xl font-semibold text-gray-800">الوصول السريع</h2>
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
//             {quickLinks.map((link, i) => (
//               <button
//                 key={i}
//                 onClick={() => router.push(link.path)}
//                 className={`
//                   group relative flex flex-col items-center justify-center
//                   py-4 px-3 rounded-xl text-white shadow-md hover:shadow-xl hover:scale-[1.03]
//                   transition-all duration-200 bg-gradient-to-br ${link.bg}
//                 `}
//               >
//                 <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-25 rounded-xl"></div>
//                 <div className="relative z-10 text-3xl mb-1.5">{link.icon}</div>
//                 <h3 className="relative z-10 text-sm font-semibold tracking-wide">{link.title}</h3>
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* بطاقات الملخص */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <SummaryCard title="إجمالي المبيعات" value={`${totalSales.toLocaleString()} ر.س`} color="text-sky-600" />
//           <SummaryCard title="عدد الفواتير" value="248" color="text-blue-600" />
//           <SummaryCard title="عدد الأدوية" value="126" color="text-green-600" />
//           <SummaryCard title="عدد المستخدمين" value={users.length} color="text-amber-600" />
//         </div>

//         {/* الرسم البياني للمبيعات */}
//         <div className="p-5 bg-white border rounded-lg shadow-sm">
//           <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات الشهرية</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={salesData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* آخر العمليات + ملاحظة تحليلية */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
//             <h3 className="mb-4 text-lg font-semibold text-gray-700">آخر العمليات</h3>
//             <ul className="space-y-2 text-sm text-gray-700">
//               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
//                 💰 تم إنشاء فاتورة بقيمة <span className="font-semibold text-green-700">245 ر.س</span> بواسطة <span className="text-blue-600">أحمد</span>.
//               </li>
//               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
//                 📦 تم تحديث مخزون دواء <span className="font-semibold text-emerald-700">“فيتامين سي”</span>.
//               </li>
//               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
//                 📊 تم عرض تقرير <span className="font-semibold text-purple-600">المبيعات اليومية</span>.
//               </li>
//             </ul>
//           </div>

//           <div className="p-5 border border-green-200 rounded-lg shadow-sm bg-gradient-to-br from-green-50 to-green-100">
//             <h3 className="mb-3 text-lg font-semibold text-green-700">📈 ملاحظة تحليلية</h3>
//             <p className="text-sm leading-relaxed text-green-800">
//               أداء المبيعات في آخر أسبوع ارتفع بنسبة <strong>+12%</strong> مقارنة بالفترة السابقة،
//               مع زيادة في عدد الطلبات بمعدل <strong>8%</strong>.
//             </p>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   )
// }

// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-5 text-center transition bg-white border rounded-lg shadow-sm hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }








// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import Layout from '../components/Layout'
// import toast from 'react-hot-toast'
// import theme from '../theme'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer
// } from 'recharts'
// import {
//   FaPills,
//   FaCashRegister,
//   FaChartLine,
//   FaMoneyBillWave,
//   FaUsers
// } from 'react-icons/fa'

// export default function Dashboard() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [users, setUsers] = useState([])
//   const [salesData, setSalesData] = useState([])
//   const router = useRouter()

//   useEffect(() => {
//     setUsers([
//       { id: 1, name: 'محمد الصيدلي', role: 'pharmacist', email: 'pharma@mail.com' },
//       { id: 2, name: 'أحمد الكاشير', role: 'cashier', email: 'cashier@mail.com' },
//       { id: 3, name: 'مها الإدارية', role: 'admin', email: 'admin@mail.com' }
//     ])

//     setSalesData([
//       { month: 'يناير', total: 3200 },
//       { month: 'فبراير', total: 4100 },
//       { month: 'مارس', total: 3800 },
//       { month: 'أبريل', total: 5200 },
//       { month: 'مايو', total: 6100 },
//       { month: 'يونيو', total: 5700 }
//     ])
//   }, [])

//   const totalSales = salesData.reduce((s, m) => s + m.total, 0)

//   // 🔹 روابط الوصول السريع
//   const quickLinks = [
//     { title: 'المنتجات', icon: <FaPills />, bg: 'bg-gradient-to-br from-green-500 to-emerald-600', path: '/products' },
//     { title: 'المبيعات', icon: <FaCashRegister />, bg: 'bg-gradient-to-br from-sky-500 to-blue-600', path: '/sales' },
//     { title: 'التقارير', icon: <FaChartLine />, bg: 'bg-gradient-to-br from-purple-500 to-indigo-600', path: '/reports' },
//     { title: 'الحسابات', icon: <FaMoneyBillWave />, bg: 'bg-gradient-to-br from-amber-500 to-yellow-600', path: '/accounts' },
//     { title: 'إدارة المستخدمين', icon: <FaUsers />, bg: 'bg-gradient-to-br from-teal-500 to-cyan-600', path: '/users' }
//   ]

//   return (
//     <Layout user={user} title="لوحة التحكم الرئيسية">
//       <div dir="rtl" className="space-y-10">

//         {/* 🔹 الوصول السريع */}
//         <section>
//           <h2 className="mb-5 text-xl font-semibold text-gray-800">الوصول السريع</h2>
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {quickLinks.map((link, i) => (
//               <button
//                 key={i}
//                 onClick={() => router.push(link.path)}
//                 className={`
//                   group relative flex flex-col items-center justify-center 
//                   p-6 rounded-2xl text-white shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-200
//                   ${link.bg}
//                 `}
//               >
//                 <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 rounded-2xl"></div>
//                 <div className="relative z-10 mb-3 text-4xl">{link.icon}</div>
//                 <h3 className="relative z-10 text-lg font-bold tracking-wide">{link.title}</h3>
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* 🧾 بطاقات الملخص */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <SummaryCard title="إجمالي المبيعات" value={`${totalSales.toLocaleString()} ر.س`} color="text-sky-600" />
//           <SummaryCard title="عدد الفواتير" value="248" color="text-blue-600" />
//           <SummaryCard title="عدد الأدوية" value="126" color="text-green-600" />
//           <SummaryCard title="عدد المستخدمين" value={users.length} color="text-amber-600" />
//         </div>

//         {/* 📈 الرسم البياني للمبيعات */}
//         <div className="p-5 bg-white border rounded-lg shadow-sm">
//           <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات الشهرية</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={salesData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* 🧾 آخر العمليات */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* قائمة العمليات */}
//           <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
//             <h3 className="mb-4 text-lg font-semibold text-gray-700">آخر العمليات</h3>
//             <ul className="space-y-2 text-sm text-gray-700">
//               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
//                 💰 تم إنشاء فاتورة جديدة بقيمة <span className="font-semibold text-green-700">245 ر.س</span> بواسطة <span className="text-blue-600">أحمد</span>.
//               </li>
//               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
//                 📦 تم تحديث مخزون دواء <span className="font-semibold text-emerald-700">“فيتامين سي”</span>.
//               </li>
//               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
//                 📊 تم عرض تقرير <span className="font-semibold text-purple-600">المبيعات اليومية</span>.
//               </li>
//             </ul>
//           </div>

//           {/* تنبيه تحليلي */}
//           <div className="p-5 border border-green-200 rounded-lg shadow-sm bg-gradient-to-br from-green-50 to-green-100">
//             <h3 className="mb-3 text-lg font-semibold text-green-700">📈 ملاحظة تحليلية</h3>
//             <p className="text-sm leading-relaxed text-green-800">
//               أداء المبيعات في آخر أسبوع ارتفع بنسبة <strong>+12%</strong> مقارنة بالفترة السابقة،
//               مع زيادة في عدد الطلبات بمعدل <strong>8%</strong>.
//               حافظ على هذا الأداء لتعزيز الأرباح الشهرية.
//             </p>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   )
// }

// // 🧩 بطاقة الملخص
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-5 text-center transition bg-white border rounded-lg shadow-sm hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }










// import { useState, useEffect } from 'react'
// import Layout from '../components/Layout'
// import toast from 'react-hot-toast'
// import theme from '../theme'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer
// } from 'recharts'

// export default function Dashboard() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [users, setUsers] = useState([])
//   const [salesData, setSalesData] = useState([])
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [showPermModal, setShowPermModal] = useState(false)
//   const [newUser, setNewUser] = useState({ name: '', role: '', email: '', permissions: [] })
//   const [editUser, setEditUser] = useState(null)
//   const [permUser, setPermUser] = useState(null)

//   // 🔹 قائمة الصلاحيات
//   const allPermissions = [
//     { key: 'view_sales', label: 'عرض المبيعات' },
//     { key: 'add_sale', label: 'إضافة عملية بيع' },
//     { key: 'manage_medicines', label: 'إدارة الأدوية' },
//     { key: 'manage_users', label: 'إدارة المستخدمين' },
//     { key: 'view_reports', label: 'عرض التقارير' },
//     { key: 'print_reports', label: 'طباعة التقارير' },
//   ]

//   // 🔹 بيانات مبدئية
//   useEffect(() => {
//     setUsers([
//       { id: 1, name: 'محمد الصيدلي', role: 'pharmacist', email: 'pharma@mail.com', permissions: ['manage_medicines', 'view_reports'] },
//       { id: 2, name: 'أحمد الكاشير', role: 'cashier', email: 'cashier@mail.com', permissions: ['add_sale', 'view_sales', 'print_reports'] },
//       { id: 3, name: 'مها الإدارية', role: 'admin', email: 'admin@mail.com', permissions: ['manage_users', 'view_reports', 'print_reports'] },
//     ])

//     setSalesData([
//       { month: 'يناير', total: 3200 },
//       { month: 'فبراير', total: 4100 },
//       { month: 'مارس', total: 3800 },
//       { month: 'أبريل', total: 5200 },
//       { month: 'مايو', total: 6100 },
//       { month: 'يونيو', total: 5700 },
//     ])
//   }, [])

//   const totalSales = salesData.reduce((s, m) => s + m.total, 0)
//   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']

//   // 🟢 إضافة مستخدم
//   const addUser = () => {
//     if (!newUser.name || !newUser.role || !newUser.email) {
//       toast.error('⚠️ يرجى إدخال جميع الحقول')
//       return
//     }
//     setUsers([...users, { id: Date.now(), ...newUser }])
//     setNewUser({ name: '', role: '', email: '', permissions: [] })
//     setShowAddModal(false)
//     toast.success('✅ تم إضافة المستخدم بنجاح')
//   }

//   // ✏️ تعديل مستخدم
//   const openEditModal = (u) => {
//     setEditUser({ ...u })
//     setShowEditModal(true)
//   }
//   const saveEditUser = () => {
//     if (!editUser.name || !editUser.role || !editUser.email) return toast.error('⚠️ يرجى إدخال جميع الحقول')
//     setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)))
//     setShowEditModal(false)
//     toast.success('✅ تم تعديل المستخدم بنجاح')
//   }

//   // 🔐 صلاحيات المستخدم
//   const openPermModal = (u) => {
//     setPermUser({ ...u })
//     setShowPermModal(true)
//   }
//   const togglePermission = (permKey) => {
//     const perms = permUser.permissions.includes(permKey)
//       ? permUser.permissions.filter((p) => p !== permKey)
//       : [...permUser.permissions, permKey]
//     setPermUser({ ...permUser, permissions: perms })
//   }
//   const savePermissions = () => {
//     setUsers(users.map((u) => (u.id === permUser.id ? permUser : u)))
//     setShowPermModal(false)
//     toast.success('🔐 تم تحديث صلاحيات المستخدم')
//   }

//   // ❌ حذف مستخدم
//   const deleteUser = (id) => {
//     if (confirm('هل تريد حذف هذا المستخدم؟')) {
//       setUsers(users.filter((u) => u.id !== id))
//       toast.success('🗑️ تم حذف المستخدم بنجاح')
//     }
//   }

//   return (
//     <Layout user={user} title="لوحة المدير">
//       <div dir="rtl" className="space-y-8">
//         {/* 🧾 الملخص */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <SummaryCard title="إجمالي المبيعات" value={`${totalSales.toLocaleString()} ر.س`} color="text-sky-600" />
//           <SummaryCard title="عدد الفواتير" value="248" color="text-blue-600" />
//           <SummaryCard title="عدد الأدوية" value="126" color="text-green-600" />
//           <SummaryCard title="عدد المستخدمين" value={users.length} color="text-amber-600" />
//         </div>

//         {/* 👥 إدارة المستخدمين */}
//         <div className="p-5 bg-white border rounded-lg shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">إدارة المستخدمين والصلاحيات</h3>
//             <button onClick={() => setShowAddModal(true)} className="px-4 py-2 text-white rounded-md shadow bg-sky-600 hover:bg-sky-700">
//               ➕ مستخدم جديد
//             </button>
//           </div>

//           <table className="w-full text-sm text-right border-t border-gray-100">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">البريد</th>
//                 <th className="px-3 py-2">الدور</th>
//                 <th className="px-3 py-2">الصلاحيات</th>
//                 <th className="px-3 py-2">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((u) => (
//                 <tr key={u.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{u.name}</td>
//                   <td className="px-3 py-2">{u.email}</td>
//                   <td className="px-3 py-2">{u.role === 'admin' ? '👑 مدير' : u.role === 'pharmacist' ? '💊 صيدلي' : '💵 كاشير'}</td>
//                   <td className="px-3 py-2">
//                     {u.permissions.map((p) => (
//                       <span key={p} className="inline-block px-2 py-0.5 m-0.5 bg-sky-50 text-sky-700 rounded">
//                         {allPermissions.find((x) => x.key === p)?.label || p}
//                       </span>
//                     ))}
//                   </td>
//                   <td className="px-3 py-2 space-x-2 space-x-reverse">
//                     <button onClick={() => openEditModal(u)} className="px-3 py-1 text-sm text-blue-600 border border-blue-100 rounded hover:bg-blue-50">
//                       تعديل
//                     </button>
//                     <button onClick={() => openPermModal(u)} className="px-3 py-1 text-sm text-indigo-600 border border-indigo-100 rounded hover:bg-indigo-50">
//                       صلاحيات
//                     </button>
//                     <button onClick={() => deleteUser(u.id)} className="px-3 py-1 text-sm text-red-600 border border-red-100 rounded hover:bg-red-50">
//                       حذف
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* 🟢 مودالات */}
//         {showAddModal && (
//           <UserModal title="➕ إضافة مستخدم جديد" userData={newUser} setUserData={setNewUser} onSave={addUser} onCancel={() => setShowAddModal(false)} />
//         )}
//         {showEditModal && (
//           <UserModal title="✏️ تعديل المستخدم" userData={editUser} setUserData={setEditUser} onSave={saveEditUser} onCancel={() => setShowEditModal(false)} />
//         )}
//         {showPermModal && (
//           <PermissionsModal
//             user={permUser}
//             permissions={allPermissions}
//             togglePermission={togglePermission}
//             onSave={savePermissions}
//             onCancel={() => setShowPermModal(false)}
//           />
//         )}
//       </div>
//     </Layout>
//   )
// }

// // 🧩 بطاقات الملخص
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }

// // 🧩 نافذة المستخدم (إضافة / تعديل)
// function UserModal({ title, userData, setUserData, onSave, onCancel }) {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
//       <div className="w-full max-w-md p-6 text-right bg-white rounded-lg shadow-lg">
//         <h3 className="mb-4 text-lg font-semibold text-gray-700">{title}</h3>
//         <label className="block mb-1 text-sm">الاسم</label>
//         <input value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} className="w-full px-3 py-2 mb-3 border rounded-md" />
//         <label className="block mb-1 text-sm">البريد الإلكتروني</label>
//         <input value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} className="w-full px-3 py-2 mb-3 border rounded-md" />
//         <label className="block mb-1 text-sm">الدور</label>
//         <select value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })} className="w-full px-3 py-2 mb-4 border rounded-md">
//           <option value="">اختر الدور...</option>
//           <option value="admin">👑 مدير</option>
//           <option value="pharmacist">💊 صيدلي</option>
//           <option value="cashier">💵 كاشير</option>
//         </select>
//         <div className="flex justify-end gap-3">
//           <button onClick={onSave} className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">حفظ</button>
//           <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // 🟣 نافذة الصلاحيات
// function PermissionsModal({ user, permissions, togglePermission, onSave, onCancel }) {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
//       <div className="w-full max-w-lg p-6 text-right bg-white rounded-lg shadow-lg">
//         <h3 className="mb-4 text-lg font-semibold text-gray-700">🔐 تعديل صلاحيات {user.name}</h3>
//         <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
//           {permissions.map((p) => (
//             <label key={p.key} className="flex items-center gap-2">
//               <input type="checkbox" checked={user.permissions.includes(p.key)} onChange={() => togglePermission(p.key)} />
//               {p.label}
//             </label>
//           ))}
//         </div>
//         <div className="flex justify-end gap-3">
//           <button onClick={onSave} className="px-4 py-2 text-white rounded-md bg-sky-600 hover:bg-sky-700">حفظ</button>
//           <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
//         </div>
//       </div>
//     </div>
//   )
// }











// import { useState, useEffect } from 'react'
// import Layout from '../components/Layout'
// import toast from 'react-hot-toast'
// import theme from '../theme'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer
// } from 'recharts'

// export default function Dashboard() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [users, setUsers] = useState([])
//   const [salesData, setSalesData] = useState([])
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [newUser, setNewUser] = useState({ name: '', role: '', email: '' })
//   const [editUser, setEditUser] = useState(null)

//   // 🔹 تحميل بيانات افتراضية
//   useEffect(() => {
//     setUsers([
//       { id: 1, name: 'محمد الصيدلي', role: 'pharmacist', email: 'pharma@mail.com' },
//       { id: 2, name: 'أحمد الكاشير', role: 'cashier', email: 'cashier@mail.com' },
//       { id: 3, name: 'مها الإدارية', role: 'admin', email: 'admin@mail.com' },
//     ])

//     setSalesData([
//       { month: 'يناير', total: 3200 },
//       { month: 'فبراير', total: 4100 },
//       { month: 'مارس', total: 3800 },
//       { month: 'أبريل', total: 5200 },
//       { month: 'مايو', total: 6100 },
//       { month: 'يونيو', total: 5700 },
//     ])
//   }, [])

//   const totalSales = salesData.reduce((s, m) => s + m.total, 0)
//   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']

//   // 🟢 إضافة مستخدم جديد
//   const addUser = () => {
//     if (!newUser.name || !newUser.role || !newUser.email) {
//       toast.error('⚠️ يرجى إدخال جميع الحقول')
//       return
//     }
//     setUsers([...users, { id: Date.now(), ...newUser }])
//     setNewUser({ name: '', role: '', email: '' })
//     setShowAddModal(false)
//     toast.success('✅ تم إضافة المستخدم بنجاح')
//   }

//   // 🟡 فتح نافذة تعديل المستخدم
//   const openEditModal = (user) => {
//     setEditUser({ ...user })
//     setShowEditModal(true)
//   }

//   // 🟣 حفظ التعديل
//   const saveEditUser = () => {
//     if (!editUser.name || !editUser.role || !editUser.email) {
//       toast.error('⚠️ يرجى إدخال جميع الحقول')
//       return
//     }
//     setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)))
//     setShowEditModal(false)
//     toast.success('✅ تم تعديل المستخدم بنجاح')
//   }

//   // 🔴 حذف مستخدم
//   const deleteUser = (id) => {
//     if (confirm('هل تريد حذف هذا المستخدم؟')) {
//       setUsers(users.filter((u) => u.id !== id))
//       toast.success('🗑️ تم حذف المستخدم بنجاح')
//     }
//   }

//   return (
//     <Layout user={user} title="لوحة المدير">
//       <div dir="rtl" className="space-y-8">

//         {/* 🧾 ملخص النظام */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
//             <p className="text-sm text-gray-500">إجمالي المبيعات</p>
//             <h3 className="text-2xl font-bold text-sky-600">{totalSales.toLocaleString()} ر.س</h3>
//           </div>
//           <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
//             <p className="text-sm text-gray-500">عدد الفواتير</p>
//             <h3 className="text-2xl font-bold text-blue-600">248</h3>
//           </div>
//           <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
//             <p className="text-sm text-gray-500">عدد الأدوية</p>
//             <h3 className="text-2xl font-bold text-green-600">126</h3>
//           </div>
//           <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
//             <p className="text-sm text-gray-500">عدد المستخدمين</p>
//             <h3 className="text-2xl font-bold text-amber-600">{users.length}</h3>
//           </div>
//         </div>

//         {/* 📈 الرسوم التحليلية */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//           <div className="p-5 bg-white border rounded-lg shadow-sm">
//             <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات الشهرية</h3>
//             <ResponsiveContainer width="100%" height={250}>
//               <LineChart data={salesData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="p-5 bg-white border rounded-lg shadow-sm">
//             <h3 className="mb-3 text-lg font-semibold text-gray-700">توزيع المستخدمين حسب الدور</h3>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={[
//                     { name: 'مديرين', value: users.filter(u => u.role === 'admin').length },
//                     { name: 'صيدليين', value: users.filter(u => u.role === 'pharmacist').length },
//                     { name: 'كاشير', value: users.filter(u => u.role === 'cashier').length },
//                   ]}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label
//                   dataKey="value"
//                 >
//                   {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* 👥 إدارة المستخدمين */}
//         <div className="p-5 bg-white border rounded-lg shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">إدارة المستخدمين</h3>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="px-4 py-2 text-white rounded-md shadow bg-sky-600 hover:bg-sky-700"
//             >
//               ➕ مستخدم جديد
//             </button>
//           </div>

//           <table className="w-full text-sm text-right border-t border-gray-100">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">البريد</th>
//                 <th className="px-3 py-2">الدور</th>
//                 <th className="px-3 py-2">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((u) => (
//                 <tr key={u.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{u.name}</td>
//                   <td className="px-3 py-2">{u.email}</td>
//                   <td className="px-3 py-2">
//                     {u.role === 'admin' ? '👑 مدير' : u.role === 'pharmacist' ? '💊 صيدلي' : '💵 كاشير'}
//                   </td>
//                   <td className="px-3 py-2 space-x-2 space-x-reverse">
//                     <button
//                       onClick={() => openEditModal(u)}
//                       className="px-3 py-1 text-sm text-blue-600 border border-blue-100 rounded hover:bg-blue-50"
//                     >
//                       تعديل
//                     </button>
//                     <button
//                       onClick={() => deleteUser(u.id)}
//                       className="px-3 py-1 text-sm text-red-600 border border-red-100 rounded hover:bg-red-50"
//                     >
//                       حذف
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* 🟢 مودال إضافة مستخدم */}
//         {showAddModal && (
//           <ModalForm
//             title="➕ إضافة مستخدم جديد"
//             userData={newUser}
//             setUserData={setNewUser}
//             onSave={addUser}
//             onCancel={() => setShowAddModal(false)}
//           />
//         )}

//         {/* 🟣 مودال تعديل مستخدم */}
//         {showEditModal && (
//           <ModalForm
//             title="✏️ تعديل المستخدم"
//             userData={editUser}
//             setUserData={setEditUser}
//             onSave={saveEditUser}
//             onCancel={() => setShowEditModal(false)}
//           />
//         )}
//       </div>
//     </Layout>
//   )
// }

// // 🧩 مكون المودال القابل لإعادة الاستخدام
// function ModalForm({ title, userData, setUserData, onSave, onCancel }) {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
//       <div className="w-full max-w-md p-6 text-right bg-white rounded-lg shadow-lg">
//         <h3 className="mb-4 text-lg font-semibold text-gray-700">{title}</h3>

//         <label className="block mb-1 text-sm">الاسم</label>
//         <input
//           value={userData.name}
//           onChange={(e) => setUserData({ ...userData, name: e.target.value })}
//           className="w-full px-3 py-2 mb-3 border rounded-md"
//         />

//         <label className="block mb-1 text-sm">البريد الإلكتروني</label>
//         <input
//           value={userData.email}
//           onChange={(e) => setUserData({ ...userData, email: e.target.value })}
//           className="w-full px-3 py-2 mb-3 border rounded-md"
//         />

//         <label className="block mb-1 text-sm">الدور</label>
//         <select
//           value={userData.role}
//           onChange={(e) => setUserData({ ...userData, role: e.target.value })}
//           className="w-full px-3 py-2 mb-4 border rounded-md"
//         >
//           <option value="">اختر الدور...</option>
//           <option value="admin">👑 مدير</option>
//           <option value="pharmacist">💊 صيدلي</option>
//           <option value="cashier">💵 كاشير</option>
//         </select>

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onSave}
//             className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
//           >
//             حفظ
//           </button>
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
//           >
//             إلغاء
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
