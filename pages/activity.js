// pages/activity.js
import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import AuthGuard from "../components/AuthGuard";

// بيانات تجريبية لسجل النشاط
const MOCK_ACTIVITY = [
  {
    id: 1,
    user: "أحمد (كاشير)",
    role: "cashier",
    action: "إنشاء فاتورة رقم INV-1001",
    type: "sale",
    createdAt: "2025-11-17T08:30:00Z",
  },
  {
    id: 2,
    user: "مها (مدير)",
    role: "admin",
    action: "تعديل صلاحيات المستخدم محمد الكاشير",
    type: "permissions",
    createdAt: "2025-11-17T09:10:00Z",
  },
  {
    id: 3,
    user: "أحمد (صيدلي)",
    role: "pharmacist",
    action: "إضافة دواء جديد: فيتامين C 500mg",
    type: "inventory",
    createdAt: "2025-11-17T09:45:00Z",
  },
  {
    id: 4,
    user: "أحمد (كاشير)",
    role: "cashier",
    action: "مرتجع جزئي للفاتورة INV-1001",
    type: "return",
    createdAt: "2025-11-17T10:20:00Z",
  },
];

function formatDate(value) {
  try {
    return new Date(value).toLocaleString("ar-EG");
  } catch {
    return value;
  }
}

export default function ActivityPage() {
  const [user] = useState({ name: "المدير أحمد", role: "admin" });

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_ACTIVITY.filter((a) => {
      const passSearch =
        !q ||
        a.user.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q);
      const passType = type === "all" || a.type === type;
      const passRole = roleFilter === "all" || a.role === roleFilter;
      return passSearch && passType && passRole;
    });
  }, [search, type, roleFilter]);

  return (
    <AuthGuard
      allowedRoles={["admin"]}
      requiredPermissions={["view_reports"]}
    >
      <Layout user={user} title="📜 سجل نشاط المستخدمين">
        <div dir="rtl" className="space-y-6">
          {/* فلاتر البحث */}
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <input
                type="text"
                placeholder="🔍 بحث باسم المستخدم أو العملية"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md"
              >
                <option value="all">كل العمليات</option>
                <option value="sale">مبيعات</option>
                <option value="return">مرتجعات</option>
                <option value="inventory">مخزون / أدوية</option>
                <option value="permissions">صلاحيات</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md"
              >
                <option value="all">كل الأدوار</option>
                <option value="admin">المدير</option>
                <option value="pharmacist">الصيدلي</option>
                <option value="cashier">الكاشير</option>
              </select>

              <div className="flex items-center justify-end text-xs text-gray-500">
                عدد السجلات:{" "}
                <span className="mr-1 font-semibold text-sky-600">
                  {filtered.length}
                </span>
              </div>
            </div>
          </div>

          {/* جدول النشاط */}
          <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
            <table className="w-full text-sm text-right min-w-[780px]">
              <thead className="text-xs text-gray-600 bg-gray-50">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">المستخدم</th>
                  <th className="px-3 py-2">الدور</th>
                  <th className="px-3 py-2">العملية</th>
                  <th className="px-3 py-2">النوع</th>
                  <th className="px-3 py-2">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((a, i) => (
                    <tr key={a.id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{a.user}</td>
                      <td className="px-3 py-2 text-xs">
                        {a.role === "admin"
                          ? "مدير"
                          : a.role === "pharmacist"
                          ? "صيدلي"
                          : "كاشير"}
                      </td>
                      <td className="px-3 py-2 text-xs">{a.action}</td>
                      <td className="px-3 py-2 text-xs">
                        {a.type === "sale"
                          ? "بيع"
                          : a.type === "return"
                          ? "مرتجع"
                          : a.type === "inventory"
                          ? "مخزون"
                          : "صلاحيات"}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {formatDate(a.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-6 text-sm text-center text-gray-500"
                    >
                      لا توجد سجلات مطابقة للبحث الحالي
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </AuthGuard>
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
