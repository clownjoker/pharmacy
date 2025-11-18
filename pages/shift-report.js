// pages/shift-report.js
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useState, useMemo } from "react";

// بيانات تجريبية لوردية اليوم
const SAMPLE_SHIFTS = [
  {
    id: 1,
    cashier: "محمد الكاشير",
    openedAt: "2025-11-17 08:00",
    closedAt: "2025-11-17 16:00",
    invoicesCount: 34,
    totalSales: 5820,
    totalReturns: 220,
    cash: 4200,
    card: 1400,
    wallet: 400,
  },
  {
    id: 2,
    cashier: "مها علي",
    openedAt: "2025-11-16 16:00",
    closedAt: "2025-11-16 23:00",
    invoicesCount: 27,
    totalSales: 4300,
    totalReturns: 150,
    cash: 2800,
    card: 1000,
    wallet: 500,
  },
];

const formatCurrency = (v) =>
  `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

export default function ShiftReportPage() {
  const { user } = useAuth();
  const [cashierFilter, setCashierFilter] = useState("all");

  const filtered = useMemo(() => {
    if (cashierFilter === "all") return SAMPLE_SHIFTS;
    return SAMPLE_SHIFTS.filter((s) => s.cashier === cashierFilter);
  }, [cashierFilter]);

  const totals = useMemo(() => {
    const totalSales = filtered.reduce((s, x) => s + x.totalSales, 0);
    const totalReturns = filtered.reduce((s, x) => s + x.totalReturns, 0);
    const net = totalSales - totalReturns;
    return { totalSales, totalReturns, net };
  }, [filtered]);

  const handlePrint = () => {
    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charSet="utf-8" />
          <title>تقرير الشِفت</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 20px; }
            h2 { color:#0ea5e9; margin-bottom: 10px; }
            table { width:100%; border-collapse: collapse; margin-top:10px; }
            th, td { border:1px solid #ddd; padding:6px; text-align:center; }
            th { background:#f3f4f6; }
          </style>
        </head>
        <body>
          <h2>📊 تقرير الشِفت</h2>
          <p>المستخدم الحالي: ${user?.name || "—"}</p>
          <table>
            <thead>
              <tr>
                <th>الكاشير</th>
                <th>بداية الشِفت</th>
                <th>نهاية الشِفت</th>
                <th>عدد الفواتير</th>
                <th>إجمالي المبيعات</th>
                <th>إجمالي المرتجعات</th>
                <th>صافي الشِفت</th>
              </tr>
            </thead>
            <tbody>
              ${filtered
                .map(
                  (s) => `
                <tr>
                  <td>${s.cashier}</td>
                  <td>${s.openedAt}</td>
                  <td>${s.closedAt}</td>
                  <td>${s.invoicesCount}</td>
                  <td>${formatCurrency(s.totalSales)}</td>
                  <td>${formatCurrency(s.totalReturns)}</td>
                  <td>${formatCurrency(s.totalSales - s.totalReturns)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 800);
            };
          </script>
        </body>
      </html>
    `;
    const w = window.open("", "_blank", "width=900,height=900");
    w.document.write(html);
    w.document.close();
  };

  const cashiers = Array.from(new Set(SAMPLE_SHIFTS.map((s) => s.cashier)));

  return (
    <Layout user={user} title="تقرير الشِفت">
      <div dir="rtl" className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            📊 تقرير الشِفت (تجريبي)
          </h1>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-sm text-white rounded-lg bg-sky-600 hover:bg-sky-700"
          >
            🖨️ طباعة التقرير
          </button>
        </div>

        {/* فلاتر بسيطة */}
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block mb-1 text-xs text-gray-500">
                الكاشير
              </label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-md"
                value={cashierFilter}
                onChange={(e) => setCashierFilter(e.target.value)}
              >
                <option value="all">كل الكاشير</option>
                {cashiers.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ملخصات */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Summary
            title="إجمالي المبيعات"
            value={formatCurrency(totals.totalSales)}
            color="text-emerald-600"
          />
          <Summary
            title="إجمالي المرتجعات"
            value={formatCurrency(totals.totalReturns)}
            color="text-red-600"
          />
          <Summary
            title="صافي الشِفت"
            value={formatCurrency(totals.net)}
            color="text-sky-600"
          />
        </div>

        {/* جدول الشِفتات */}
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
          <table className="w-full text-sm text-right min-w-[800px]">
            <thead className="text-xs text-gray-600 bg-gray-50">
              <tr>
                <th className="px-3 py-2">الكاشير</th>
                <th className="px-3 py-2">بداية الشِفت</th>
                <th className="px-3 py-2">نهاية الشِفت</th>
                <th className="px-3 py-2">عدد الفواتير</th>
                <th className="px-3 py-2">مبيعات</th>
                <th className="px-3 py-2">مرتجعات</th>
                <th className="px-3 py-2">الصافي</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{s.cashier}</td>
                  <td className="px-3 py-2">{s.openedAt}</td>
                  <td className="px-3 py-2">{s.closedAt}</td>
                  <td className="px-3 py-2">{s.invoicesCount}</td>
                  <td className="px-3 py-2 font-semibold text-emerald-700">
                    {formatCurrency(s.totalSales)}
                  </td>
                  <td className="px-3 py-2 font-semibold text-red-600">
                    {formatCurrency(s.totalReturns)}
                  </td>
                  <td className="px-3 py-2 font-semibold text-sky-700">
                    {formatCurrency(s.totalSales - s.totalReturns)}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-6 text-sm text-center text-gray-500"
                  >
                    لا توجد بيانات شِفت مطابقة للفلاتر.
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

function Summary({ title, value, color }) {
  return (
    <div className="p-4 text-center bg-white border rounded-lg shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`mt-1 text-xl font-bold sm:text-2xl ${color}`}>{value}</p>
    </div>
  );
}















// // pages/shift-report.js
// import { useMemo, useState } from "react";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import { useAuth } from "../context/AuthContext";
// import { useShift } from "../context/ShiftContext";

// export default function ShiftReportPage() {
//   const { user, hasPermission } = useAuth();
//   const { shifts = [], currentShift } = useShift();

//   const [selectedId, setSelectedId] = useState(
//     currentShift?.id || shifts[0]?.id || null
//   );
//   const [showDetails, setShowDetails] = useState(false);

//   if (!hasPermission(["admin", "cashier"])) {
//     return (
//       <div dir="rtl" className="p-6 text-center text-red-600">
//         ⚠️ ليس لديك صلاحية لعرض تقرير الشِفت.
//       </div>
//     );
//   }

//   const selectedShift =
//     shifts.find((s) => s.id === selectedId) || currentShift || null;

//   // نفترض أن كل شفت يحتوي على مصفوفة فواتير
//   const invoices =
//     (selectedShift &&
//       (selectedShift.invoices || selectedShift.sales || [])) ||
//     [];

//   const stats = useMemo(() => {
//     let salesTotal = 0;
//     let returnsTotal = 0;
//     const payments = {
//       cash: 0,
//       card: 0,
//       wallet: 0,
//     };

//     invoices.forEach((inv) => {
//       const total = Number(inv.total) || 0;
//       const type = inv.type || "sale";
//       const pm = inv.payment || "cash";

//       if (type === "return") {
//         returnsTotal += total;
//       } else {
//         salesTotal += total;
//       }

//       if (payments[pm] !== undefined) {
//         payments[pm] += total;
//       }
//     });

//     const net = salesTotal - returnsTotal;

//     return {
//       salesTotal,
//       returnsTotal,
//       net,
//       payments,
//       count: invoices.length,
//     };
//   }, [invoices]);

//   const formatCurrency = (v) =>
//     `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

//   const formatDate = (v) =>
//     v
//       ? new Date(v).toLocaleString("ar-EG", {
//           year: "numeric",
//           month: "2-digit",
//           day: "2-digit",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "—";

//   const handlePrint = () => {
//     if (!selectedShift) return;

//     const html = `
//     <html dir="rtl" lang="ar">
//       <head>
//         <meta charset="utf-8" />
//         <title>تقرير الشفت</title>
//         <style>
//           body { font-family: 'Tajawal', sans-serif; padding: 20px; }
//           h2,h3 { margin: 0 0 8px; }
//           table { width:100%; border-collapse: collapse; margin-top:10px; }
//           th,td { border:1px solid #ddd; padding:6px; text-align:center; }
//           th { background:#f3f4f6; }
//           .summary { margin-top: 10px; }
//         </style>
//       </head>
//       <body>
//         <h2>تقرير الشفت — صيدلية المعلم</h2>
//         <p>الكاشير: <strong>${selectedShift.cashierName ||
//           user?.name ||
//           "—"}</strong></p>
//         <p>بداية الشفت: ${formatDate(selectedShift.openedAt)}</p>
//         <p>نهاية الشفت: ${formatDate(selectedShift.closedAt)}</p>

//         <div class="summary">
//           <p>إجمالي المبيعات: <strong>${formatCurrency(
//             stats.salesTotal
//           )}</strong></p>
//           <p>إجمالي المرتجعات: <strong>${formatCurrency(
//             stats.returnsTotal
//           )}</strong></p>
//           <p>صافي الشفت: <strong>${formatCurrency(stats.net)}</strong></p>
//           <p>نقدًا: ${formatCurrency(
//             stats.payments.cash
//           )} — بطاقة: ${formatCurrency(
//       stats.payments.card
//     )} — محفظة: ${formatCurrency(stats.payments.wallet)}</p>
//         </div>

//         <h3>تفاصيل الفواتير</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>الرقم</th>
//               <th>النوع</th>
//               <th>العميل</th>
//               <th>الوقت</th>
//               <th>الدفع</th>
//               <th>الإجمالي</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${invoices
//               .map(
//                 (inv, i) => `
//               <tr>
//                 <td>${i + 1}</td>
//                 <td>${inv.id || inv.code}</td>
//                 <td>${inv.type === "return" ? "مرتجع" : "بيع"}</td>
//                 <td>${inv.customer || "—"}</td>
//                 <td>${formatDate(inv.date)}</td>
//                 <td>${
//                   inv.payment === "card"
//                     ? "بطاقة"
//                     : inv.payment === "wallet"
//                     ? "محفظة"
//                     : "نقدًا"
//                 }</td>
//                 <td>${formatCurrency(inv.total)}</td>
//               </tr>`
//               )
//               .join("")}
//           </tbody>
//         </table>

//         <script>
//           window.onload = () => {
//             window.print();
//             setTimeout(() => window.close(), 600);
//           };
//         </script>
//       </body>
//     </html>
//     `;

//     const w = window.open("", "_blank", "width=900,height=900");
//     w.document.write(html);
//     w.document.close();
//   };

//   return (
//     <Layout user={user} title="تقرير الشِفت">
//       <div dir="rtl" className="space-y-6">
//         {/* شريط علوي */}
//         <div className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-lg font-bold text-gray-800">
//               🧾 تقرير الشِفت للكاشير
//             </h1>
//             <p className="text-xs text-gray-500">
//               اختر الشِفت لعرض تفاصيل المبيعات والمرتجعات وأداء الكاشير.
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             <select
//               className="px-3 py-2 text-sm border rounded-md"
//               value={selectedId || ""}
//               onChange={(e) => setSelectedId(e.target.value || null)}
//             >
//               {shifts.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.label ||
//                     `شفت #${s.id} — ${formatDate(
//                       s.openedAt
//                     )} — ${s.cashierName || "كاشير"}`}
//                 </option>
//               ))}
//               {!shifts.length && (
//                 <option value="">لا توجد شفتات مسجلة</option>
//               )}
//             </select>

//             <button
//               onClick={handlePrint}
//               className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
//             >
//               🖨️ طباعة تقرير الشفت
//             </button>

//             {selectedShift && (
//               <button
//                 onClick={() => setShowDetails(true)}
//                 className="px-4 py-2 text-sm text-indigo-700 rounded-md bg-indigo-50 hover:bg-indigo-100"
//               >
//                 📋 تفاصيل الشفت
//               </button>
//             )}
//           </div>
//         </div>

//         {/* بطاقات ملخص الشفت */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <SummaryCard
//             title="إجمالي المبيعات"
//             value={formatCurrency(stats.salesTotal)}
//             color="text-emerald-600"
//           />
//           <SummaryCard
//             title="إجمالي المرتجعات"
//             value={formatCurrency(stats.returnsTotal)}
//             color="text-red-600"
//           />
//           <SummaryCard
//             title="صافي الشفت"
//             value={formatCurrency(stats.net)}
//             color="text-sky-600"
//           />
//         </div>

//         {/* جدول فواتير الشفت */}
//         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right min-w-[900px]">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="p-2">#</th>
//                 <th>الرقم</th>
//                 <th>النوع</th>
//                 <th>العميل</th>
//                 <th>التاريخ</th>
//                 <th>الدفع</th>
//                 <th>الإجمالي</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invoices.length ? (
//                 invoices.map((inv, i) => (
//                   <tr key={inv.id || i} className="border-t hover:bg-gray-50">
//                     <td className="p-2">{i + 1}</td>
//                     <td className="p-2 text-sky-700">
//                       {inv.id || inv.code || "—"}
//                     </td>
//                     <td className="p-2">
//                       {inv.type === "return" ? "مرتجع" : "بيع"}
//                     </td>
//                     <td className="p-2">{inv.customer || "—"}</td>
//                     <td className="p-2">{formatDate(inv.date)}</td>
//                     <td className="p-2">
//                       {inv.payment === "card"
//                         ? "بطاقة"
//                         : inv.payment === "wallet"
//                         ? "محفظة"
//                         : "نقدًا"}
//                     </td>
//                     <td className="p-2 font-semibold text-emerald-700">
//                       {formatCurrency(inv.total)}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="py-6 text-center text-gray-500">
//                     لا توجد فواتير مسجلة لهذا الشفت.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* مودال تفاصيل الشفت */}
//       {showDetails && selectedShift && (
//         <Modal
//           title="تفاصيل الشِفت"
//           onClose={() => setShowDetails(false)}
//         >
//           <div dir="rtl" className="space-y-2 text-sm">
//             <p>
//               <strong>الكاشير:</strong>{" "}
//               {selectedShift.cashierName || user?.name || "—"}
//             </p>
//             <p>
//               <strong>بداية الشفت:</strong>{" "}
//               {formatDate(selectedShift.openedAt)}
//             </p>
//             <p>
//               <strong>نهاية الشفت:</strong>{" "}
//               {formatDate(selectedShift.closedAt)}
//             </p>
//             <p>
//               <strong>عدد الفواتير:</strong> {stats.count}
//             </p>
//             <p>
//               <strong>نقدًا:</strong>{" "}
//               {formatCurrency(stats.payments.cash)}
//             </p>
//             <p>
//               <strong>بطاقة:</strong>{" "}
//               {formatCurrency(stats.payments.card)}
//             </p>
//             <p>
//               <strong>محفظة:</strong>{" "}
//               {formatCurrency(stats.payments.wallet)}
//             </p>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   );
// }

// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center bg-white border rounded-lg shadow-sm">
//       <p className="text-xs text-gray-500">{title}</p>
//       <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
//     </div>
//   );
// }
