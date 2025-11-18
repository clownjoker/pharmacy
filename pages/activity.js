// pages/activity.js
import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const MOCK_LOGS = [
  {
    id: 1,
    type: "sale",
    user: "أحمد الكاشير",
    message: "إصدار فاتورة بيع رقم INV-1001",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    type: "return",
    user: "أحمد الكاشير",
    message: "إضافة مرتجع على الفاتورة INV-0999",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    type: "stock",
    user: "مها الصيدلانية",
    message: "توريد 50 حبة من دواء بانادول",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    type: "shift",
    user: "أحمد الكاشير",
    message: "إغلاق شفت رقم 3",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    type: "user",
    user: "المدير أحمد",
    message: "إضافة مستخدم جديد (كاشير محمد)",
    createdAt: new Date().toISOString(),
  },
];

const TYPE_LABEL = {
  sale: "بيع",
  return: "مرتجع",
  stock: "مخزون",
  shift: "شفت",
  user: "مستخدم",
  system: "نظام",
};

export default function ActivityLogPage() {
  const { user, hasPermission } = useAuth();
  const [logs] = useState(MOCK_LOGS);
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");

  if (!hasPermission(["admin"])) {
    return (
      <div dir="rtl" className="p-6 text-center text-red-600">
        ⚠️ هذه الشاشة مخصصة للمدير فقط.
      </div>
    );
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((l) => {
      const byType = type === "all" || l.type === type;
      const bySearch =
        !q ||
        l.message.toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q);
      return byType && bySearch;
    });
  }, [logs, type, search]);

  const formatDate = (v) =>
    new Date(v).toLocaleString("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Layout user={user} title="📜 سجل النشاط">
      <div dir="rtl" className="space-y-6">
        {/* شريط الفلترة */}
        <div className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              سجل نشاط النظام
            </h1>
            <p className="text-xs text-gray-500">
              متابعة جميع العمليات: مبيعات، مرتجعات، مخزون، شفتات، مستخدمين…
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="بحث في الرسالة أو باسم المستخدم"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md"
            >
              <option value="all">كل الأنواع</option>
              <option value="sale">مبيعات</option>
              <option value="return">مرتجعات</option>
              <option value="stock">مخزون</option>
              <option value="shift">شفتات</option>
              <option value="user">مستخدمين</option>
              <option value="system">نظام</option>
            </select>
          </div>
        </div>

        {/* الجدول */}
        <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
          <table className="w-full text-sm text-right min-w-[800px]">
            <thead className="text-gray-600 bg-gray-50">
              <tr>
                <th className="p-2">#</th>
                <th>النوع</th>
                <th>الوصف</th>
                <th>المستخدم</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((l, i) => (
                  <tr key={l.id || i} className="border-t hover:bg-gray-50">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-sky-50 text-sky-700">
                        {TYPE_LABEL[l.type] || l.type}
                      </span>
                    </td>
                    <td className="p-2 text-gray-800">{l.message}</td>
                    <td className="p-2 text-gray-600">{l.user}</td>
                    <td className="p-2 text-gray-600">
                      {formatDate(l.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-6 text-center text-gray-500"
                  >
                    لا توجد سجلات مطابقة للحالي.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}


















// import { useState, useEffect } from 'react'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// export default function ActivityLogPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [logs, setLogs] = useState([])
//   const [search, setSearch] = useState('')
//   const [loading, setLoading] = useState(true)

//   const API_URL = 'http://localhost:5000/api/logs'


//   useEffect(() => {
//   const token = localStorage.getItem("pharmacy_token")
//   if (!token) {
//     router.replace("/")   // redirect to login
//   }
// }, [])

//   // 📥 تحميل السجلات من الباك إند
//   useEffect(() => {
//     const loadLogs = async () => {
//       try {
//         const res = await fetch(API_URL)
//         const data = await res.json()
//         if (!res.ok) throw new Error()
//         setLogs(data)
//       } catch (err) {
//         toast.error('❌ فشل تحميل السجلات')
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadLogs()
//   }, [])

//   // 🔍 فلترة السجلات
//   const filtered = logs.filter(
//     (log) =>
//       log.action.toLowerCase().includes(search.toLowerCase()) ||
//       log.details.toLowerCase().includes(search.toLowerCase()) ||
//       (log.username && log.username.toLowerCase().includes(search.toLowerCase()))
//   )

//   if (loading) {
//     return (
//       <Layout user={user} title="📜 سجل الأنشطة">
//         <div dir="rtl" className="flex items-center justify-center h-80">
//           <p className="text-gray-600">جارٍ تحميل السجلات...</p>
//         </div>
//       </Layout>
//     )
//   }

//   return (
//     <Layout user={user} title="📜 سجل الأنشطة">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔍 البحث */}
//         <div className="flex flex-col gap-2 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
//           <input
//             type="text"
//             placeholder="🔍 بحث في السجلات (المستخدم / العملية / التفاصيل)"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full px-3 py-2 text-sm border rounded-md md:w-1/2"
//           />
//         </div>

//         {/* 📋 جدول السجلات */}
//         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right border-t border-gray-100 min-w-[900px]">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">المستخدم</th>
//                 <th className="px-3 py-2">العملية</th>
//                 <th className="px-3 py-2">التفاصيل</th>
//                 <th className="px-3 py-2">عنوان IP</th>
//                 <th className="px-3 py-2">التاريخ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length ? (
//                 filtered.map((log, i) => (
//                   <tr key={log.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{i + 1}</td>
//                     <td className="px-3 py-2 font-medium text-gray-700">
//                       {log.username || '—'}
//                     </td>
//                     <td className="px-3 py-2 text-sky-700">{log.action}</td>
//                     <td className="px-3 py-2 text-gray-600">{log.details}</td>
//                     <td className="px-3 py-2 text-gray-500">{log.ip_address}</td>
//                     <td className="px-3 py-2 text-gray-600">
//                       {new Date(log.created_at).toLocaleString('ar-EG')}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="6"
//                     className="py-6 text-center text-gray-500"
//                   >
//                     لا توجد نتائج مطابقة
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Layout>
//   )
// }
