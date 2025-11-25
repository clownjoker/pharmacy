// pages/shifts.js
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function ShiftsPage() {
  const [loading, setLoading] = useState(true);
  const [currentShift, setCurrentShift] = useState(null);
  const [shifts, setShifts] = useState([]);

  const userId = 1; // لاحقاً اجلبها من AuthContext

  // -----------------------------------------------------
  // 🔥 تحميل بيانات الشفت من API
  // -----------------------------------------------------
  const loadData = async () => {
    try {
      setLoading(true);

      const [cur, list] = await Promise.all([
        api.get("/shifts/current"),
        api.get("/shifts"),
      ]);

      setCurrentShift(cur.data || null);
      setShifts(list.data || []);
    } catch (err) {
      console.error("loadData error:", err);
      toast.error("خطأ في تحميل بيانات الشفت");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -----------------------------------------------------
  // 🟢 بدء شفت جديد
  // -----------------------------------------------------
  const startShift = async () => {
    try {
      await api.post("/shifts/start", { userId });
      toast.success("✅ تم بدء الشفت");
      await loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "تعذر بدء الشفت");
    }
  };

  // -----------------------------------------------------
  // 🔴 إغلاق الشفت
  // -----------------------------------------------------
  const closeShift = async () => {
    try {
      await api.post("/shifts/close", { userId });
      toast.success("🔒 تم إغلاق الشفت");
      await loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "تعذر إغلاق الشفت");
    }
  };

  // -----------------------------------------------------
  // 🎨 واجهة العرض
  // -----------------------------------------------------
  return (
    <Layout title="إدارة الشفتات">
      <div className="p-5 space-y-6" dir="rtl">
        <h1 className="text-2xl font-bold text-slate-800">🕒 إدارة الشفت</h1>

        {/* الشفت الحالي */}
        <div className="p-4 bg-white border shadow-sm rounded-xl">
          <h2 className="mb-3 text-lg font-semibold text-slate-700">
            الشفت الحالي
          </h2>

          {loading ? (
            <p className="text-gray-500">جارٍ التحميل…</p>
          ) : currentShift ? (
            <div className="space-y-2 text-sm">
              <p><strong>وقت الفتح:</strong> {currentShift.open_time}</p>
              <p><strong>بواسطة:</strong> المستخدم #{currentShift.opened_by}</p>
              <p><strong>إجمالي المبيعات:</strong> {currentShift.total_sales} ر.س</p>
              <p><strong>فواتير:</strong> {currentShift.invoices_count}</p>
              <p><strong>نقد:</strong> {currentShift.total_cash}</p>
              <p><strong>بطاقة:</strong> {currentShift.total_card}</p>
              <p><strong>محفظة:</strong> {currentShift.total_wallet}</p>

              <button
                onClick={closeShift}
                className="px-4 py-2 mt-3 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                🔴 إغلاق الشفت
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-gray-500">لا يوجد شفت مفتوح حالياً.</p>
              <button
                onClick={startShift}
                className="px-4 py-2 text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
              >
                🟢 بدء شفت جديد
              </button>
            </div>
          )}
        </div>

        {/* السجل الكامل */}
        <div className="p-4 bg-white border shadow-sm rounded-xl">
          <h2 className="mb-3 text-lg font-semibold text-slate-700">
            📝 السجل الكامل للشفتات
          </h2>

          {loading ? (
            <p className="text-gray-500">جارٍ التحميل…</p>
          ) : (
            <table className="w-full text-sm border">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-2 border">رقم الشفت</th>
                  <th className="p-2 border">فتح</th>
                  <th className="p-2 border">إغلاق</th>
                  <th className="p-2 border">الحالة</th>
                  <th className="p-2 border">المبيعات</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-slate-50">
                    <td className="p-2 border">{s.id}</td>
                    <td className="p-2 border">{s.open_time}</td>
                    <td className="p-2 border">{s.close_time || "---"}</td>
                    <td className="p-2 border">
                      {s.status === "open" ? "🔵 مفتوح" : "⚫ مغلق"}
                    </td>
                    <td className="p-2 border">{s.total_sales} ر.س</td>
                  </tr>
                ))}

                {!shifts.length && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      لا توجد شفتات مسجلة.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}





















// // pages/shifts.js
// import { useState, useEffect } from "react";
// import Layout from "../components/Layout";
// import api from "../utils/api";
// import toast from "react-hot-toast";

// export default function ShiftsPage() {
//   const [loading, setLoading] = useState(true);
//   const [currentShift, setCurrentShift] = useState(null);
//   const [shifts, setShifts] = useState([]);

//   const userId = 1; // 🔹 لاحقاً اجلبها من السياق AuthContext

//   const loadData = async () => {
//     try {
//       setLoading(true);

//       const [cur, list] = await Promise.all([
//         api.get("/api/shifts/current"),
//         api.get("/api/shifts"),
//       ]);

//       setCurrentShift(cur.data || null);
//       setShifts(list.data || []);
//     } catch (err) {
//       console.error("loadData error:", err);
//       toast.error("خطأ في تحميل بيانات الشفت");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const startShift = async () => {
//     try {
//       const res = await api.post("/api/shifts/start", { userId });
//       toast.success("تم بدء الشفت");
//       await loadData();
//     } catch (err) {
//       console.error(err);
//       toast.error("تعذر بدء الشفت");
//     }
//   };

//   const closeShift = async () => {
//     try {
//       const res = await api.post("/api/shifts/close", { userId });
//       toast.success("تم إغلاق الشفت");
//       await loadData();
//     } catch (err) {
//       console.error(err);
//       toast.error("تعذر إغلاق الشفت");
//     }
//   };

//   return (
//     <Layout title="إدارة الشفتات">
//       <div className="p-5 space-y-6" dir="rtl">
//         <h1 className="text-2xl font-bold text-slate-800">🕒 إدارة الشفت</h1>

//         {/* الشفت الحالي */}
//         <div className="p-4 bg-white border shadow-sm rounded-xl">
//           <h2 className="mb-3 text-lg font-semibold text-slate-700">
//             الشفت الحالي
//           </h2>

//           {loading ? (
//             <p className="text-gray-500">جارٍ التحميل…</p>
//           ) : currentShift ? (
//             <div className="space-y-2 text-sm">
//               <p><strong>وقت الفتح:</strong> {currentShift.open_time}</p>
//               <p><strong>بواسطة:</strong> المستخدم #{currentShift.opened_by}</p>
//               <p><strong>إجمالي المبيعات:</strong> {currentShift.total_sales} ر.س</p>
//               <p><strong>فواتير:</strong> {currentShift.invoices_count}</p>
//               <p><strong>نقد:</strong> {currentShift.total_cash}</p>
//               <p><strong>بطاقة:</strong> {currentShift.total_card}</p>
//               <p><strong>محفظة:</strong> {currentShift.total_wallet}</p>

//               <button
//                 onClick={closeShift}
//                 className="px-4 py-2 mt-3 text-white bg-red-600 rounded-lg hover:bg-red-700"
//               >
//                 🔴 إغلاق الشفت
//               </button>
//             </div>
//           ) : (
//             <div>
//               <p className="mb-3 text-gray-500">لا يوجد شفت مفتوح حالياً.</p>
//               <button
//                 onClick={startShift}
//                 className="px-4 py-2 text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
//               >
//                 🟢 بدء شفت جديد
//               </button>
//             </div>
//           )}
//         </div>

//         {/* قائمة الشفتات */}
//         <div className="p-4 bg-white border shadow-sm rounded-xl">
//           <h2 className="mb-3 text-lg font-semibold text-slate-700">
//             📝 السجل الكامل للشفتات
//           </h2>

//           {loading ? (
//             <p className="text-gray-500">جارٍ التحميل…</p>
//           ) : (
//             <table className="w-full text-sm border">
//               <thead className="bg-slate-100 text-slate-600">
//                 <tr>
//                   <th className="p-2 border">رقم الشفت</th>
//                   <th className="p-2 border">فتح</th>
//                   <th className="p-2 border">إغلاق</th>
//                   <th className="p-2 border">الحالة</th>
//                   <th className="p-2 border">المبيعات</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {shifts.map((s) => (
//                   <tr key={s.id} className="border-t hover:bg-slate-50">
//                     <td className="p-2 border">{s.id}</td>
//                     <td className="p-2 border">{s.open_time}</td>
//                     <td className="p-2 border">{s.close_time || "---"}</td>
//                     <td className="p-2 border">
//                       {s.status === "open" ? "🔵 مفتوح" : "⚫ مغلق"}
//                     </td>
//                     <td className="p-2 border">{s.total_sales} ر.س</td>
//                   </tr>
//                 ))}

//                 {!shifts.length && (
//                   <tr>
//                     <td colSpan={5} className="py-4 text-center text-gray-500">
//                       لا توجد شفتات مسجلة.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// }























// // pages/shift.js
// import Layout from "../components/Layout";
// import { useShift } from "../context/ShiftContext";
// import { useAuth } from "../context/AuthContext";

// export default function ShiftPage() {
//   const { user, hasPermission } = useAuth();
//   const { shiftOpen, shiftData, openShift, closeShift } = useShift();

//   if (!hasPermission(["admin", "cashier"])) {
//     return (
//       <div dir="rtl" className="p-6 text-center text-red-600">
//         ⚠️ ليس لديك صلاحية لدخول شاشة الشِّفت.
//       </div>
//     );
//   }

//   const printShiftReport = () => {
//     const w = window.open("", "", "width=900,height=700");

//     const salesTotal = shiftData.totalSales || 0;
//     const returnsTotal = shiftData.totalReturns || 0;
//     const net = salesTotal - returnsTotal;

//     w.document.write(`
//       <html dir="rtl" lang="ar">
//       <head>
//         <title>تقرير الشِّفت</title>
//         <style>
//           body { font-family:'Tajawal',sans-serif; padding:20px; }
//           h1,h2,h3 { text-align:center; margin:5px 0; }
//           table { width:100%; border-collapse:collapse; margin-top:15px; font-size:12px; }
//           th,td { border:1px solid #ddd; padding:6px; text-align:right; }
//           th { background:#f3f4f6; }
//           .summary { margin-top:10px; }
//         </style>
//       </head>
//       <body>
//         <h1>📋 تقرير الشِّفت</h1>
//         <h3>الكاشير: ${user?.name || ""}</h3>
//         <p style="text-align:center;">
//           من: ${shiftData.startTime || "-"}<br/>
//           إلى: ${shiftData.endTime || "لم يُغلق بعد"}
//         </p>

//         <div class="summary">
//           <p>إجمالي المبيعات: <strong>${salesTotal.toFixed(2)} ر.س</strong></p>
//           <p>إجمالي المرتجعات: <strong>${returnsTotal.toFixed(2)} ر.س</strong></p>
//           <p>صافي الشِّفت: <strong>${net.toFixed(2)} ر.س</strong></p>
//         </div>

//         <h3>تفاصيل العمليات</h3>

//         <table>
//           <thead>
//             <tr>
//               <th>النوع</th>
//               <th>الصنف</th>
//               <th>الكمية</th>
//               <th>الإجمالي</th>
//               <th>الوقت</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${
//               shiftData.operations && shiftData.operations.length
//                 ? shiftData.operations
//                     .map(
//                       (op) => `
//               <tr>
//                 <td>${op.type === "sale" ? "💵 بيع" : "🔁 مرتجع"}</td>
//                 <td>${op.productName}</td>
//                 <td>${op.qty}</td>
//                 <td>${op.total}</td>
//                 <td>${op.time}</td>
//               </tr>
//             `
//                     )
//                     .join("")
//                 : `<tr><td colspan="5" style="text-align:center;">لا توجد عمليات مسجلة في هذا الشِّفت.</td></tr>`
//             }
//           </tbody>
//         </table>

//         <script>window.print()</script>
//       </body>
//       </html>
//     `);

//     w.document.close();
//   };

//   return (
//     <Layout user={user} title="الشِّفت">
//       <div dir="rtl" className="space-y-6">
//         <h1 className="text-xl font-bold text-gray-800">🕒 إدارة الشِّفت</h1>

//         {!shiftOpen ? (
//           <div className="p-5 space-y-3 bg-white shadow rounded-xl">
//             <p className="text-sm text-gray-600">
//               لا يوجد شِفت مفتوح حاليًا. يمكنك فتح شِفت جديد لبدء تسجيل المبيعات.
//             </p>
//             <button
//               onClick={openShift}
//               className="px-6 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
//             >
//               🔓 فتح شِفت جديد
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="p-4 space-y-2 text-sm bg-white shadow rounded-xl">
//                 <h2 className="font-semibold text-gray-700">
//                   معلومات الشِّفت
//                 </h2>
//                 <p>
//                   👤 الكاشير: <strong>{user?.name}</strong>
//                 </p>
//                 <p>
//                   🕒 وقت البداية:{" "}
//                   <strong>{shiftData.startTime || "غير محدد"}</strong>
//                 </p>
//                 <p>
//                   🕒 وقت النهاية:{" "}
//                   <strong>{shiftData.endTime || "لم يُغلق بعد"}</strong>
//                 </p>
//               </div>

//               <div className="p-4 space-y-2 text-sm bg-white shadow rounded-xl">
//                 <h2 className="font-semibold text-gray-700">
//                   ملخص مالي
//                 </h2>
//                 <p>
//                   💵 إجمالي المبيعات:{" "}
//                   <strong>
//                     {(shiftData.totalSales || 0).toFixed(2)} ر.س
//                   </strong>
//                 </p>
//                 <p>
//                   🔁 إجمالي المرتجعات:{" "}
//                   <strong>
//                     {(shiftData.totalReturns || 0).toFixed(2)} ر.س
//                   </strong>
//                 </p>
//                 <p>
//                   📌 صافي الشِّفت:{" "}
//                   <strong>
//                     {(
//                       (shiftData.totalSales || 0) -
//                       (shiftData.totalReturns || 0)
//                     ).toFixed(2)}{" "}
//                     ر.س
//                   </strong>
//                 </p>
//               </div>
//             </div>

//             <div className="p-4 space-y-3 text-sm bg-white shadow rounded-xl">
//               <h2 className="font-semibold text-gray-700">
//                 سجل العمليات
//               </h2>

//               {shiftData.operations && shiftData.operations.length ? (
//                 <div className="space-y-2 overflow-y-auto max-h-80">
//                   {shiftData.operations.map((op, idx) => (
//                     <div
//                       key={idx}
//                       className="flex items-center justify-between pb-2 border-b"
//                     >
//                       <div>
//                         <p>
//                           {op.type === "sale" ? "💵 بيع" : "🔁 مرتجع"} —{" "}
//                           <strong>{op.productName}</strong>
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           الكمية: {op.qty} | الإجمالي: {op.total} ر.س
//                         </p>
//                       </div>
//                       <span className="text-xs text-gray-500">
//                         {op.time}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500">
//                   لا توجد عمليات مسجلة في هذا الشِّفت حتى الآن.
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-col gap-3 md:flex-row">
//               <button
//                 onClick={printShiftReport}
//                 className="flex-1 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
//               >
//                 🖨️ طباعة تقرير الشِّفت
//               </button>

//               <button
//                 onClick={closeShift}
//                 className="flex-1 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
//               >
//                 🔒 إغلاق الشِّفت
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </Layout>
//   );
// }

















// // pages/shift.js
// import Layout from "../components/Layout";
// import { useShift } from "../context/ShiftContext";
// import { useAuth } from "../context/AuthContext";

// export default function ShiftPage() {
//   const { user, hasPermission } = useAuth();
//   const { shiftOpen, shiftData, openShift, closeShift } = useShift();

//   if (!hasPermission(["admin", "cashier"])) {
//     return (
//       <div className="p-6 text-center text-red-600" dir="rtl">
//         ⚠️ غير مسموح لك بالدخول إلى شاشة الشِّفت.
//       </div>
//     );
//   }

//   const printShiftReport = () => {
//     const w = window.open("", "", "width=900,height=700");

//     const salesTotal = shiftData.totalSales || 0;
//     const returnsTotal = shiftData.totalReturns || 0;
//     const net = salesTotal - returnsTotal;

//     w.document.write(`
//       <html dir="rtl" lang="ar">
//       <head>
//         <title>تقرير الشِّفت</title>
//         <style>
//           body { font-family: 'Tajawal', sans-serif; padding: 20px; }
//           h1, h2, h3 { text-align: center; margin: 5px 0; }
//           table { width: 100%; border-collapse: collapse; margin-top: 15px; }
//           th, td { border: 1px solid #ddd; padding: 6px; font-size: 13px; }
//           th { background: #f3f4f6; }
//           .summary { margin-top: 15px; font-size: 14px; }
//         </style>
//       </head>
//       <body>
//         <h1>📋 تقرير الشِّفت</h1>
//         <h3>الكاشير: ${user?.name || ""}</h3>
//         <p style="text-align:center;">من: ${shiftData.startTime || "-"}<br/>إلى: ${
//       shiftData.endTime || "لم يُغلق بعد"
//     }</p>

//         <div class="summary">
//           <p>إجمالي المبيعات: <strong>${salesTotal.toFixed(
//             2
//           )} ر.س</strong></p>
//           <p>إجمالي المرتجعات: <strong>${returnsTotal.toFixed(
//             2
//           )} ر.س</strong></p>
//           <p>صافي الشِّفت: <strong>${net.toFixed(2)} ر.س</strong></p>
//         </div>

//         <h3>تفاصيل العمليات</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>النوع</th>
//               <th>الصنف</th>
//               <th>الكمية</th>
//               <th>الإجمالي</th>
//               <th>الوقت</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${
//               shiftData.operations && shiftData.operations.length
//                 ? shiftData.operations
//                     .map(
//                       (op) => `
//                 <tr>
//                   <td>${op.type === "sale" ? "💵 بيع" : "🔁 مرتجع"}</td>
//                   <td>${op.productName}</td>
//                   <td>${op.qty}</td>
//                   <td>${op.total} ر.س</td>
//                   <td>${op.time}</td>
//                 </tr>
//               `
//                     )
//                     .join("")
//                 : `<tr><td colspan="5" style="text-align:center;">لا توجد عمليات مسجلة في هذا الشِّفت.</td></tr>`
//             }
//           </tbody>
//         </table>

//         <script>
//           window.print();
//         </script>
//       </body>
//       </html>
//     `);

//     w.document.close();
//   };

//   return (
//     <Layout user={user} title="الشِّفت">
//       <div className="space-y-6" dir="rtl">
//         <h1 className="text-xl font-bold text-gray-800">🕒 إدارة الشِّفت</h1>

//         {!shiftOpen ? (
//           <div className="p-5 space-y-3 bg-white shadow rounded-xl">
//             <p className="text-sm text-gray-600">
//               لا يوجد شِفت مفتوح حالياً. يمكنك فتح شِفت جديد لبدء تسجيل المبيعات.
//             </p>
//             <button
//               onClick={openShift}
//               className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
//             >
//               🔓 فتح شِفت جديد
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="p-4 space-y-2 text-sm bg-white shadow rounded-xl">
//                 <h2 className="font-semibold text-gray-700">معلومات الشِّفت</h2>
//                 <p>
//                   👤 الكاشير: <strong>{user?.name}</strong>
//                 </p>
//                 <p>
//                   🕒 وقت البداية:{" "}
//                   <strong>{shiftData.startTime || "غير محدد"}</strong>
//                 </p>
//                 <p>
//                   🕒 وقت النهاية:{" "}
//                   <strong>{shiftData.endTime || "لم يُغلق بعد"}</strong>
//                 </p>
//               </div>

//               <div className="p-4 space-y-2 text-sm bg-white shadow rounded-xl">
//                 <h2 className="font-semibold text-gray-700">ملخص مالي</h2>
//                 <p>
//                   💵 إجمالي المبيعات:{" "}
//                   <strong>{(shiftData.totalSales || 0).toFixed(2)} ر.س</strong>
//                 </p>
//                 <p>
//                   🔁 إجمالي المرتجعات:{" "}
//                   <strong>{(shiftData.totalReturns || 0).toFixed(2)} ر.س</strong>
//                 </p>
//                 <p>
//                   📌 صافي الشِّفت:{" "}
//                   <strong>
//                     {(
//                       (shiftData.totalSales || 0) -
//                       (shiftData.totalReturns || 0)
//                     ).toFixed(2)}{" "}
//                     ر.س
//                   </strong>
//                 </p>
//               </div>
//             </div>

//             <div className="p-4 space-y-3 text-sm bg-white shadow rounded-xl">
//               <h2 className="font-semibold text-gray-700">سجل العمليات</h2>

//               {shiftData.operations && shiftData.operations.length ? (
//                 <div className="space-y-2 overflow-y-auto max-h-80">
//                   {shiftData.operations.map((op, idx) => (
//                     <div
//                       key={idx}
//                       className="flex items-center justify-between pb-2 border-b"
//                     >
//                       <div>
//                         <p>
//                           {op.type === "sale" ? "💵 بيع" : "🔁 مرتجع"} —{" "}
//                           <strong>{op.productName}</strong>
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           الكمية: {op.qty} | الإجمالي: {op.total} ر.س
//                         </p>
//                       </div>
//                       <span className="text-xs text-gray-500">{op.time}</span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500">
//                   لا توجد عمليات مسجلة في هذا الشِّفت حتى الآن.
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-col gap-3 md:flex-row">
//               <button
//                 onClick={printShiftReport}
//                 className="flex-1 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
//               >
//                 🖨️ طباعة تقرير الشِّفت
//               </button>

//               <button
//                 onClick={closeShift}
//                 className="flex-1 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
//               >
//                 🔒 إغلاق الشِّفت
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </Layout>
//   );
// }










// // pages/shift.js
// import { useShift } from "../context/ShiftContext";
// import Layout from "../components/Layout";
// import { useAuth } from "../context/AuthContext";

// export default function ShiftPage() {
//   const { user, hasPermission } = useAuth();
//   const { shiftOpen, shiftData, openShift, closeShift } = useShift();

//   if (!hasPermission(["admin", "cashier"])) {
//     return <div className="p-5 text-center text-red-600">غير مسموح لك بالدخول</div>;
//   }

//   return (
//     <Layout user={user} title="الشفت">
//       <div className="space-y-6" dir="rtl">
//         <h1 className="text-xl font-bold">🕒 إدارة الشفت</h1>

//         {!shiftOpen ? (
//           <button
//             onClick={openShift}
//             className="px-6 py-3 text-white bg-green-600 rounded"
//           >
//             🔓 فتح شفت جديد
//           </button>
//         ) : (
//           <>
//             <div className="p-4 bg-white rounded shadow">
//               <p>وقت البداية: {shiftData.startTime}</p>
//               <p>وقت النهاية: {shiftData.endTime || "…"}</p>
//               <p>إجمالي المبيعات: {shiftData.totalSales} ر.س</p>
//               <p>إجمالي المرتجعات: {shiftData.totalReturns} ر.س</p>
//             </div>

//             <h3 className="text-lg font-semibold">سجل العمليات</h3>

//             <div className="p-4 bg-white rounded shadow">
//               {shiftData.operations.map((o, i) => (
//                 <div key={i} className="py-2 text-sm border-b">
//                   <p>
//                     {o.type === "sale" ? "💵 بيع" : "🔁 مرتجع"} — {o.productName}
//                   </p>
//                   <p>الكمية: {o.qty}</p>
//                   <p>الإجمالي: {o.total} ر.س</p>
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={closeShift}
//               className="w-full py-2 text-white bg-red-600 rounded"
//             >
//               🔒 إغلاق الشفت
//             </button>
//           </>
//         )}
//       </div>
//     </Layout>
//   );
// }















// import { useState } from "react";
// import Layout from "../components/Layout";

// export default function ShiftPage() {
//   const [user] = useState({ name: "أحمد", role: "cashier" });

//   // حالة الشفت (مغلق / مفتوح)
//   const [shiftOpen, setShiftOpen] = useState(false);

//   // بيانات الشفت الحالي (Mock)
//   const [shiftData, setShiftData] = useState({
//     startTime: "",
//     endTime: "",
//     openingBalance: 0,
//     closingBalance: 0,
//     salesTotal: 0,
//     operations: [],
//   });

//   // فتح الشفت
//   const openShift = () => {
//     setShiftOpen(true);
//     setShiftData({
//       ...shiftData,
//       startTime: new Date().toLocaleString(),
//       openingBalance: 0,
//       operations: [],
//     });
//   };

//   // إغلاق الشفت
//   const closeShift = () => {
//     setShiftOpen(false);
//     setShiftData({
//       ...shiftData,
//       endTime: new Date().toLocaleString(),
//       closingBalance: shiftData.salesTotal,
//     });
//   };

//   // إضافة عملية داخل الشفت
//   const addOperation = (type, amount, note = "") => {
//     setShiftData({
//       ...shiftData,
//       salesTotal: shiftData.salesTotal + amount,
//       operations: [
//         ...shiftData.operations,
//         {
//           type,
//           amount,
//           note,
//           time: new Date().toLocaleTimeString(),
//         },
//       ],
//     });
//   };

//   return (
//     <Layout user={user} title="إدارة الشفت">
//       <div dir="rtl" className="space-y-8">

//         <h1 className="text-2xl font-bold text-gray-800">🕒 إدارة الشفت</h1>

//         {/* ================= */}
//         {/* شفت مغلق */}
//         {/* ================= */}
//         {!shiftOpen && (
//           <div className="p-8 space-y-4 text-center bg-white border shadow-lg rounded-xl">
//             <h2 className="text-xl font-semibold text-gray-700">الشفت غير مفتوح</h2>
//             <p className="text-sm text-gray-500">اضغط على زر الفتح لبدء العمل.</p>

//             <button
//               onClick={openShift}
//               className="px-6 py-3 text-white transition bg-green-600 shadow-md hover:bg-green-700 rounded-xl"
//             >
//               🚀 فتح الشفت الآن
//             </button>
//           </div>
//         )}

//         {/* ================= */}
//         {/* شفت مفتوح */}
//         {/* ================= */}
//         {shiftOpen && (
//           <div className="space-y-6">

//             {/* معلومات الشفت */}
//             <div className="p-6 bg-white border shadow-lg rounded-xl">
//               <h3 className="mb-3 text-xl font-semibold text-gray-700">
//                 🔓 الشفت مفتوح الآن
//               </h3>

//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <InfoRow label="وقت الفتح" value={shiftData.startTime} />
//                 <InfoRow label="إجمالي المبيعات" value={`${shiftData.salesTotal} ر.س`} />
//               </div>
//             </div>

//             {/* إضافة عملية */}
//             <div className="p-6 space-y-4 bg-white border shadow-lg rounded-xl">
//               <h3 className="text-lg font-semibold text-gray-700">إضافة عملية جديدة</h3>

//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//                 <button
//                   onClick={() => addOperation("عملية بيع", 50)}
//                   className="px-4 py-3 text-white rounded-lg shadow bg-sky-600 hover:bg-sky-700"
//                 >
//                   💵 إضافة بيع +50 ر.س
//                 </button>

//                 <button
//                   onClick={() => addOperation("عملية بيع", 120)}
//                   className="px-4 py-3 text-white rounded-lg shadow bg-sky-600 hover:bg-sky-700"
//                 >
//                   💵 إضافة بيع +120 ر.س
//                 </button>

//                 <button
//                   onClick={() => addOperation("ملاحظة", 0, "دواء مفقود")}
//                   className="px-4 py-3 text-white rounded-lg shadow bg-amber-500 hover:bg-amber-600"
//                 >
//                   ⚠️ إضافة ملاحظة
//                 </button>
//               </div>
//             </div>

//             {/* سجل العمليات */}
//             <div className="p-6 bg-white border shadow-lg rounded-xl">
//               <h3 className="mb-3 text-lg font-semibold text-gray-700">
//                 📝 سجل عمليات الشفت
//               </h3>

//               {shiftData.operations.length === 0 ? (
//                 <p className="py-6 text-sm text-center text-gray-500">
//                   لا توجد عمليات بعد…
//                 </p>
//               ) : (
//                 <ul className="space-y-3">
//                   {shiftData.operations.map((op, i) => (
//                     <li
//                       key={i}
//                       className="p-4 transition border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="font-semibold">{op.type}</p>
//                           {op.note && (
//                             <p className="text-xs text-gray-500">{op.note}</p>
//                           )}
//                         </div>

//                         <div className="text-right">
//                           <p className="text-sm font-bold text-green-700">
//                             {op.amount > 0 ? `+${op.amount} ر.س` : ""}
//                           </p>
//                           <p className="text-xs text-gray-400">{op.time}</p>
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {/* زر إغلاق الشفت */}
//             <div className="text-center">
//               <button
//                 onClick={closeShift}
//                 className="px-8 py-3 text-white transition bg-red-600 shadow-lg rounded-xl hover:bg-red-700"
//               >
//                 🔒 إغلاق الشفت
//               </button>
//             </div>
//           </div>
//         )}

//       </div>
//     </Layout>
//   );
// }


// // عنصر صغير لعرض معلومة
// function InfoRow({ label, value }) {
//   return (
//     <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="mt-1 text-lg font-bold">{value}</p>
//     </div>
//   );
// }
