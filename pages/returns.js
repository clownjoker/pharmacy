// pages/returns.js
import { useState, useMemo } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

const SAMPLE_SALES = [
  {
    id: "INV-1001",
    date: "2025-11-17 09:10",
    customer: "عبدالله",
    cashier: "محمد الكاشير",
    items: [
      { id: 1, name: "باراسيتامول 500mg", qty: 2, price: 15 },
      { id: 2, name: "فيتامين C 1000mg", qty: 1, price: 25 },
    ],
  },
  {
    id: "INV-1002",
    date: "2025-11-17 09:40",
    customer: "سعيد",
    cashier: "محمد الكاشير",
    items: [{ id: 3, name: "أموكسيسيلين 250mg", qty: 1, price: 45 }],
  },
];

const formatCurrency = (v) =>
  `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

export default function ReturnsPage() {
  const { user } = useAuth();

  const [returns, setReturns] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [returnItems, setReturnItems] = useState([]);

  const openNewReturn = (sale) => {
    setSelectedInvoice(sale);
    setReturnItems(
      sale.items.map((it) => ({
        ...it,
        returnQty: 0,
      }))
    );
    setShowModal(true);
  };

  const handleChangeQty = (id, value) => {
    const n = Number(value);
    setReturnItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              returnQty:
                !n || n < 0
                  ? 0
                  : n > it.qty
                  ? it.qty
                  : n,
            }
          : it
      )
    );
  };

  const handleConfirmReturn = () => {
    const itemsToReturn = returnItems.filter((it) => it.returnQty > 0);
    if (!itemsToReturn.length) {
      alert("اختر كمية مرتجعة لعنصر واحد على الأقل");
      return;
    }

    const totalReturn = itemsToReturn.reduce(
      (s, it) => s + it.returnQty * it.price,
      0
    );

    const newReturn = {
      id: `RET-${returns.length + 1}`,
      originalInvoiceId: selectedInvoice.id,
      date: new Date().toISOString().slice(0, 19).replace("T", " "),
      cashier: user?.name || selectedInvoice.cashier,
      customer: selectedInvoice.customer,
      items: itemsToReturn,
      total: totalReturn,
    };

    setReturns((prev) => [newReturn, ...prev]);
    setShowModal(false);

    // ⚠️ لاحقاً هنا تربط مع المخزون:
    // updateStockFromReturn(newReturn)
    // وتضيف Activity Log من هنا أيضاً
  };

  const filteredReturns = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return returns;
    return returns.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.originalInvoiceId.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q)
    );
  }, [returns, search]);

  return (
    <Layout user={user} title="فواتير المرتجع">
      <div dir="rtl" className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            🔁 فواتير المرتجع (تجريبي)
          </h1>
        </div>

        {/* اختيار فاتورة لعمل مرتجع */}
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            🧾 اختر فاتورة لعمل مرتجع
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right min-w-[700px]">
              <thead className="text-xs text-gray-600 bg-gray-50">
                <tr>
                  <th className="px-3 py-2">رقم الفاتورة</th>
                  <th className="px-3 py-2">العميل</th>
                  <th className="px-3 py-2">الكاشير</th>
                  <th className="px-3 py-2">التاريخ</th>
                  <th className="px-3 py-2">الإجمالي</th>
                  <th className="px-3 py-2 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_SALES.map((s) => {
                  const total = s.items.reduce(
                    (sum, it) => sum + it.qty * it.price,
                    0
                  );
                  return (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-sky-700">
                        {s.id}
                      </td>
                      <td className="px-3 py-2">{s.customer}</td>
                      <td className="px-3 py-2">{s.cashier}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">
                        {s.date}
                      </td>
                      <td className="px-3 py-2 font-semibold text-emerald-700">
                        {formatCurrency(total)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => openNewReturn(s)}
                          className="px-3 py-1 text-xs text-white rounded-md bg-amber-600 hover:bg-amber-700"
                        >
                          🔁 إنشاء مرتجع
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* جدول المرتجعات */}
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex flex-col gap-3 mb-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-gray-700">
              فواتير المرتجع المسجلة
            </h2>
            <input
              type="text"
              placeholder="🔍 بحث برقم المرتجع / الفاتورة / العميل"
              className="w-full px-3 py-2 text-sm border rounded-md sm:w-1/2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right min-w-[800px]">
              <thead className="text-xs text-gray-600 bg-gray-50">
                <tr>
                  <th className="px-3 py-2">رقم المرتجع</th>
                  <th className="px-3 py-2">الفاتورة الأصلية</th>
                  <th className="px-3 py-2">العميل</th>
                  <th className="px-3 py-2">الكاشير</th>
                  <th className="px-3 py-2">التاريخ</th>
                  <th className="px-3 py-2">الإجمالي المرتجع</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-amber-700">
                      {r.id}
                    </td>
                    <td className="px-3 py-2 text-sky-700">
                      {r.originalInvoiceId}
                    </td>
                    <td className="px-3 py-2">{r.customer}</td>
                    <td className="px-3 py-2">{r.cashier}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      {r.date}
                    </td>
                    <td className="px-3 py-2 font-semibold text-red-600">
                      {formatCurrency(r.total)}
                    </td>
                  </tr>
                ))}
                {!filteredReturns.length && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-6 text-sm text-center text-gray-500"
                    >
                      لا توجد فواتير مرتجع حتى الآن.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* مودال إنشاء المرتجع */}
      {showModal && selectedInvoice && (
        <Modal
          title={`إنشاء مرتجع للفاتورة ${selectedInvoice.id}`}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmReturn}
        >
          <div dir="rtl" className="space-y-3 text-sm">
            <p>
              <strong>العميل:</strong> {selectedInvoice.customer}
            </p>
            <p>
              <strong>الكاشير:</strong> {selectedInvoice.cashier}
            </p>
            <p>
              <strong>التاريخ:</strong> {selectedInvoice.date}
            </p>

            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-xs border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-1 border">الصنف</th>
                    <th className="px-2 py-1 border">المباع</th>
                    <th className="px-2 py-1 border">الكمية المرتجعة</th>
                    <th className="px-2 py-1 border">السعر</th>
                    <th className="px-2 py-1 border">إجمالي المرتجع</th>
                  </tr>
                </thead>
                <tbody>
                  {returnItems.map((it) => (
                    <tr key={it.id}>
                      <td className="px-2 py-1 border">{it.name}</td>
                      <td className="px-2 py-1 text-center border">
                        {it.qty}
                      </td>
                      <td className="px-2 py-1 text-center border">
                        <input
                          type="number"
                          className="w-20 px-1 py-0.5 text-xs border rounded"
                          min={0}
                          max={it.qty}
                          value={it.returnQty}
                          onChange={(e) =>
                            handleChangeQty(it.id, e.target.value)
                          }
                        />
                      </td>
                      <td className="px-2 py-1 text-center border">
                        {formatCurrency(it.price)}
                      </td>
                      <td className="px-2 py-1 text-center border">
                        {formatCurrency(it.returnQty * it.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
















// // pages/returns.js
// import { useState } from "react";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import { useAuth } from "../context/AuthContext";

// export default function ReturnsPage() {
//   const { user, hasPermission } = useAuth();

//   const [refInvoice, setRefInvoice] = useState("");
//   const [customer, setCustomer] = useState("");
//   const [items, setItems] = useState([
//     { name: "", qty: 1, price: 0 },
//   ]);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [savedReturn, setSavedReturn] = useState(null);

//   if (!hasPermission(["admin", "cashier", "pharmacist"])) {
//     return (
//       <div dir="rtl" className="p-6 text-center text-red-600">
//         ⚠️ ليس لديك صلاحية لدخول شاشة المرتجعات.
//       </div>
//     );
//   }

//   const handleChangeItem = (index, field, value) => {
//     setItems((prev) =>
//       prev.map((it, i) =>
//         i === index
//           ? {
//               ...it,
//               [field]:
//                 field === "qty" || field === "price"
//                   ? Number(value)
//                   : value,
//             }
//           : it
//       )
//     );
//   };

//   const addRow = () => {
//     setItems((prev) => [...prev, { name: "", qty: 1, price: 0 }]);
//   };

//   const removeRow = (index) => {
//     setItems((prev) => prev.filter((_, i) => i !== index));
//   };

//   const total = items.reduce(
//     (sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0),
//     0
//   );

//   const handleSubmit = () => {
//     // هنا ممكن لاحقًا ربطها مع Fake backend:
//     // addReturnInvoice({ refInvoice, customer, items, total, user })
//     const returnData = {
//       id: `RET-${Date.now()}`,
//       refInvoice,
//       customer,
//       items,
//       total,
//       type: "return",
//       createdBy: user?.name || "مستخدم",
//       createdAt: new Date().toISOString(),
//     };

//     setSavedReturn(returnData);
//     setShowConfirm(true);

//     // مكان مناسب مستقبلاً:
//     // - تحديث المخزون (زيادة الكمية)
//     // - إضافة سجل في Activity Log
//     // - إضافة حركة في المبيعات كمرتجع
//   };

//   const formatCurrency = (v) =>
//     `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

//   return (
//     <Layout user={user} title="مرتجعات المبيعات">
//       <div dir="rtl" className="space-y-6">
//         {/* الهيدر */}
//         <div className="flex flex-col gap-2 p-4 bg-white border rounded-lg shadow-sm sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-lg font-bold text-gray-800">
//               🔄 إنشاء مرتجع مبيعات
//             </h1>
//             <p className="text-xs text-gray-500">
//               استخدم هذه الشاشة لتسجيل مرتجع مرتبط بفاتورة سابقة أو مستقل.
//             </p>
//           </div>
//         </div>

//         {/* نموذج المرتجع */}
//         <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm">
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//             <div>
//               <label className="block mb-1 text-xs text-gray-500">
//                 رقم الفاتورة الأصلية (اختياري)
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 text-sm border rounded-md"
//                 placeholder="مثال: INV-1001"
//                 value={refInvoice}
//                 onChange={(e) => setRefInvoice(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="block mb-1 text-xs text-gray-500">
//                 اسم العميل (اختياري)
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 text-sm border rounded-md"
//                 placeholder="العميل"
//                 value={customer}
//                 onChange={(e) => setCustomer(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="block mb-1 text-xs text-gray-500">
//                 المستخدم المسؤول
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 text-sm border rounded-md bg-gray-50"
//                 value={user?.name || "—"}
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* الأصناف */}
//           <div className="mt-4">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-sm font-semibold text-gray-700">
//                 الأصناف المرجعة
//               </h2>
//               <button
//                 onClick={addRow}
//                 className="px-3 py-1 text-xs text-white rounded-md bg-emerald-600 hover:bg-emerald-700"
//               >
//                 ➕ إضافة صنف
//               </button>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-sm text-right min-w-[700px]">
//                 <thead className="text-gray-600 bg-gray-50">
//                   <tr>
//                     <th className="p-2">الصنف</th>
//                     <th className="p-2">الكمية</th>
//                     <th className="p-2">السعر</th>
//                     <th className="p-2">الإجمالي</th>
//                     <th className="p-2 text-center">حذف</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {items.map((it, i) => (
//                     <tr key={i} className="border-t">
//                       <td className="p-2">
//                         <input
//                           type="text"
//                           className="w-full px-2 py-1 text-xs border rounded-md"
//                           placeholder="اسم الدواء"
//                           value={it.name}
//                           onChange={(e) =>
//                             handleChangeItem(i, "name", e.target.value)
//                           }
//                         />
//                       </td>
//                       <td className="p-2">
//                         <input
//                           type="number"
//                           className="w-full px-2 py-1 text-xs border rounded-md"
//                           value={it.qty}
//                           onChange={(e) =>
//                             handleChangeItem(i, "qty", e.target.value)
//                           }
//                           min={1}
//                         />
//                       </td>
//                       <td className="p-2">
//                         <input
//                           type="number"
//                           className="w-full px-2 py-1 text-xs border rounded-md"
//                           value={it.price}
//                           onChange={(e) =>
//                             handleChangeItem(i, "price", e.target.value)
//                           }
//                           min={0}
//                         />
//                       </td>
//                       <td className="p-2 font-semibold text-emerald-700">
//                         {formatCurrency(
//                           (Number(it.qty) || 0) * (Number(it.price) || 0)
//                         )}
//                       </td>
//                       <td className="p-2 text-center">
//                         <button
//                           onClick={() => removeRow(i)}
//                           className="px-2 py-1 text-xs text-red-600 border border-red-100 rounded-md bg-red-50 hover:bg-red-100"
//                         >
//                           🗑️
//                         </button>
//                       </td>
//                     </tr>
//                   ))}

//                   {!items.length && (
//                     <tr>
//                       <td
//                         colSpan="5"
//                         className="py-4 text-center text-gray-500"
//                       >
//                         لا توجد أصناف في هذا المرتجع.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* الملخص + حفظ */}
//           <div className="flex flex-col items-end gap-3 mt-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="text-sm text-gray-600">
//               <p>
//                 <span className="font-semibold text-gray-800">
//                   إجمالي المرتجع:
//                 </span>{" "}
//                 <span className="font-bold text-red-600">
//                   {formatCurrency(total)}
//                 </span>
//               </p>
//             </div>

//             <button
//               onClick={handleSubmit}
//               className="px-5 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
//               disabled={!items.length || !total}
//             >
//               💾 حفظ المرتجع
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* مودال تأكيد بعد الحفظ */}
//       {showConfirm && savedReturn && (
//         <Modal
//           title="تم حفظ المرتجع"
//           onClose={() => setShowConfirm(false)}
//         >
//           <div dir="rtl" className="space-y-2 text-sm">
//             <p>
//               تم تسجيل مرتجع برقم:{" "}
//               <strong>{savedReturn.id}</strong>
//             </p>
//             {savedReturn.refInvoice && (
//               <p>
//                 مرتبط بالفاتورة:{" "}
//                 <strong>{savedReturn.refInvoice}</strong>
//               </p>
//             )}
//             <p>
//               إجمالي المرتجع:{" "}
//               <strong className="text-red-600">
//                 {formatCurrency(savedReturn.total)}
//               </strong>
//             </p>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   );
// }
