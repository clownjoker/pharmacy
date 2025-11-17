// pages/shifts.js
import { useState } from "react";
import Layout from "../components/Layout";
import { useShift } from "../context/ShiftContext";

/* SafeDate بسيط لعرض التواريخ */
function SafeDate({ value }) {
  if (typeof window === "undefined") return "";
  try {
    return new Date(value).toLocaleString("ar-EG");
  } catch {
    return "";
  }
}

export default function ShiftsPage() {
  const [user] = useState({ name: "أحمد", role: "admin" });
  const {
    shifts,
    currentShift,
    openShift,
    closeCurrentShift,
  } = useShift();

  const [openingNote, setOpeningNote] = useState("");
  const [closingNote, setClosingNote] = useState("");

  const handleOpenShift = () => {
    openShift(user.name, openingNote);
    setOpeningNote("");
  };

  const handleCloseShift = () => {
    closeCurrentShift(closingNote);
    setClosingNote("");
  };

  const formatCurrency = (v) =>
    `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

  const handlePrintShift = (shift) => {
    const t = shift.totals || {};
    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8" />
          <title>تقرير الشفت ${shift.id}</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 20px; }
            h2 { color:#0ea5e9; margin-bottom: 10px; text-align:center; }
            table { width:100%; border-collapse: collapse; margin-top:10px; }
            th, td { border:1px solid #ddd; padding:6px; text-align:center; font-size:13px; }
            th { background:#f3f4f6; }
          </style>
        </head>
        <body>
          <h2>صيدلية المعلم</h2>
          <p>تقرير الشفت: <strong>${shift.id}</strong></p>
          <p>الكاشير: ${shift.cashier}</p>
          <p>بداية الشفت: ${new Date(shift.openedAt).toLocaleString("ar-EG")}</p>
          <p>نهاية الشفت: ${
            shift.closedAt
              ? new Date(shift.closedAt).toLocaleString("ar-EG")
              : "— لم يُغلق بعد"
          }</p>
          <h3>الملخّص المالي</h3>
          <table>
            <tbody>
              <tr><th>إجمالي المبيعات</th><td>${formatCurrency(
                t.totalSales
              )}</td></tr>
              <tr><th>عدد الفواتير</th><td>${
                t.invoicesCount || 0
              }</td></tr>
              <tr><th>نقدًا</th><td>${formatCurrency(
                t.totalCash
              )}</td></tr>
              <tr><th>بطاقة</th><td>${formatCurrency(
                t.totalCard
              )}</td></tr>
              <tr><th>محفظة</th><td>${formatCurrency(
                t.totalWallet
              )}</td></tr>
            </tbody>
          </table>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 800);
              }, 300);
            };
          </script>
        </body>
      </html>
    `;
    const w = window.open("", "_blank", "width=900,height=900");
    w.document.write(html);
    w.document.close();
  };

  return (
    <Layout user={user} title="الشِّفتات">
      <div dir="rtl" className="space-y-6">
        <h1 className="text-xl font-bold text-gray-800">
          ⏱️ إدارة الشِّفتات
        </h1>

        {/* حالة الشفت الحالي */}
        <div className="p-4 space-y-3 bg-white border rounded-lg shadow-sm">
          {currentShift ? (
            <>
              <p className="text-sm text-emerald-700">
                شفت مفتوح حاليًا — رقم{" "}
                <span className="font-semibold">
                  {currentShift.id}
                </span>{" "}
                — الكاشير:{" "}
                <span className="font-semibold">
                  {currentShift.cashier}
                </span>
              </p>
              <p className="text-xs text-gray-600">
                بداية الشفت:{" "}
                <SafeDate value={currentShift.openedAt} />
              </p>

              <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-4">
                <InfoBox
                  label="إجمالي المبيعات"
                  value={formatCurrency(
                    currentShift.totals?.totalSales || 0
                  )}
                />
                <InfoBox
                  label="عدد الفواتير"
                  value={currentShift.totals?.invoicesCount || 0}
                />
                <InfoBox
                  label="نقدًا"
                  value={formatCurrency(
                    currentShift.totals?.totalCash || 0
                  )}
                />
                <InfoBox
                  label="بطاقة + محفظة"
                  value={formatCurrency(
                    (currentShift.totals?.totalCard || 0) +
                      (currentShift.totals?.totalWallet || 0)
                  )}
                />
              </div>

              <div className="flex flex-col gap-3 mt-4 md:flex-row">
                <input
                  type="text"
                  className="flex-1 p-2 text-sm border rounded"
                  placeholder="ملاحظة إغلاق الشفت (اختياري)"
                  value={closingNote}
                  onChange={(e) => setClosingNote(e.target.value)}
                />
                <button
                  onClick={handleCloseShift}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                >
                  ⛔ إغلاق الشفت
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-red-600">
                لا يوجد شفت مفتوح حاليًا.
              </p>
              <div className="flex flex-col gap-3 mt-2 md:flex-row">
                <input
                  type="text"
                  className="flex-1 p-2 text-sm border rounded"
                  placeholder="ملاحظة بداية الشفت (اختياري)"
                  value={openingNote}
                  onChange={(e) => setOpeningNote(e.target.value)}
                />
                <button
                  onClick={handleOpenShift}
                  className="px-4 py-2 text-sm font-semibold text-white rounded bg-emerald-600 hover:bg-emerald-700"
                >
                  ✅ فتح شفت جديد
                </button>
              </div>
            </>
          )}
        </div>

        {/* جدول الشفتات */}
        <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            سجل الشفتات
          </h2>
          <table className="w-full text-sm text-right min-w-[880px]">
            <thead className="text-gray-600 bg-gray-50">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">رقم الشفت</th>
                <th className="px-3 py-2">الكاشير</th>
                <th className="px-3 py-2">البداية</th>
                <th className="px-3 py-2">النهاية</th>
                <th className="px-3 py-2">إجمالي المبيعات</th>
                <th className="px-3 py-2">عدد الفواتير</th>
                <th className="px-3 py-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {shifts.length ? (
                shifts
                  .slice()
                  .reverse()
                  .map((s, idx) => {
                    const t = s.totals || {};
                    return (
                      <tr
                        key={s.id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-3 py-2">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2 font-medium text-sky-700">
                          {s.id}
                        </td>
                        <td className="px-3 py-2">
                          {s.cashier}
                        </td>
                        <td className="px-3 py-2">
                          <SafeDate value={s.openedAt} />
                        </td>
                        <td className="px-3 py-2">
                          {s.closedAt ? (
                            <SafeDate value={s.closedAt} />
                          ) : (
                            <span className="text-xs text-emerald-700">
                              مفتوح
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 font-semibold text-emerald-700">
                          {formatCurrency(t.totalSales || 0)}
                        </td>
                        <td className="px-3 py-2">
                          {t.invoicesCount || 0}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => handlePrintShift(s)}
                            className="px-3 py-1 text-xs border rounded border-sky-200 text-sky-700 hover:bg-sky-50"
                          >
                            🖨️ طباعة التقرير
                          </button>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="py-6 text-center text-gray-500"
                  >
                    لا توجد شفتات مسجلة.
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

function InfoBox({ label, value }) {
  return (
    <div className="p-3 text-center border rounded bg-gray-50">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}













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
