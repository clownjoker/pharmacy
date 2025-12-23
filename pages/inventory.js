// pages/inventory.js
import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function InventoryPage() {
  const { user, hasPermission } = useAuth();

  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products"); // products | movements

  // صلاحيات
  if (!hasPermission(["admin", "pharmacist"])) {
    return (
      <Layout user={user} title="المخزن">
        <div className="p-6 text-center text-red-600">
          لا تملك صلاحية الوصول إلى المخزن
        </div>
      </Layout>
    );
  }

  // تحميل البيانات
  useEffect(() => {
    loadInventory();
    loadMovements();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await api.get("/inventory");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("فشل تحميل بيانات المخزن");
    } finally {
      setLoading(false);
    }
  };

  const loadMovements = async () => {
    try {
      const res = await api.get("/inventory/movements");
      setMovements(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // منتجات منخفضة المخزون
  const lowStock = useMemo(() => {
    return products.filter(
      (p) => Number(p.quantity || 0) <= Number(p.min_qty || 0)
    );
  }, [products]);

  return (
    <Layout user={user} title="إدارة المخزن">
      <div dir="rtl" className="space-y-6">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between">
          {/* <h1 className="text-2xl font-bold">📦 إدارة المخزن</h1> */}

          <div className="flex gap-2">
            <button
              onClick={() => setTab("products")}
              className={`px-4 py-2 text-sm rounded-lg ${
                tab === "products"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              المنتجات
            </button>
            <button
              onClick={() => setTab("movements")}
              className={`px-4 py-2 text-sm rounded-lg ${
                tab === "movements"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              حركة المخزون
            </button>
          </div>
        </div>

        {/* تحذير نقص المخزون */}
        {lowStock.length > 0 && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-xl">
            <p className="mb-2 text-sm font-semibold text-red-700">
              ⚠️ منتجات قاربت على النفاد:
            </p>
            <ul className="pr-6 text-sm text-red-600 list-disc">
              {lowStock.map((p) => (
                <li key={p.id}>
                  {p.name} — الكمية: {p.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* محتوى التبويب */}
        {loading ? (
          <div className="text-sm text-center text-slate-500">
            جاري التحميل…
          </div>
        ) : tab === "products" ? (
          /* جدول المنتجات */
          <div className="overflow-x-auto bg-white border rounded-2xl">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">المنتج</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">الكمية</th>
                  <th className="p-3">الحد الأدنى</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const isLow =
                    Number(p.quantity) <= Number(p.min_qty);
                  return (
                    <tr
                      key={p.id}
                      className={`border-t ${
                        isLow ? "bg-red-50" : ""
                      }`}
                    >
                      <td className="p-3">{p.id}</td>
                      <td className="p-3">{p.name}</td>
                      <td className="p-3">{p.sku}</td>
                      <td className="p-3 font-semibold">
                        {p.quantity}
                      </td>
                      <td className="p-3">{p.min_qty}</td>
                      <td className="p-3">
                        {isLow ? (
                          <span className="font-semibold text-red-600">
                            منخفض
                          </span>
                        ) : (
                          <span className="text-emerald-600">
                            طبيعي
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* جدول حركة المخزون */
          <div className="overflow-x-auto bg-white border rounded-2xl">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">المنتج</th>
                  <th className="p-3">النوع</th>
                  <th className="p-3">التغير</th>
                  <th className="p-3">المصدر</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="p-3">
                      {new Date(m.created_at).toLocaleString(
                        "ar-EG"
                      )}
                    </td>
                    <td className="p-3">{m.product_name}</td>
                    <td className="p-3">{m.type}</td>
                    <td
                      className={`p-3 font-semibold ${
                        m.qty_change < 0
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {m.qty_change}
                    </td>
                    <td className="p-3">{m.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}










// // pages/inventory.js
// import { useState, useEffect } from "react";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import { useAuth } from "../context/AuthContext";
// import WarningIndicator from "../components/WarningIndicator";

// function getWarnings(p) {
//   const warnings = [];
//   if (p.quantity <= 0) warnings.push("out_of_stock");
//   else if (p.quantity <= (p.minQty || 5)) warnings.push("low_stock");

//   if (p.expiryDate) {
//     const diffDays =
//       (new Date(p.expiryDate).getTime() - new Date().getTime()) /
//       (1000 * 60 * 60 * 24);
//     if (diffDays < 0) warnings.push("expired");
//     else if (diffDays <= 60) warnings.push("near_expiry");
//   }
//   return warnings;
// }

// export default function InventoryPage() {
//   const { user, hasPermission } = useAuth();

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [showModal, setShowModal] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [qty, setQty] = useState("");
//   const [type, setType] = useState("in");

//   // -----------------------------------------------------------
//   // 🔥 تحميل قائمة المخزون من API
//   // -----------------------------------------------------------
//   useEffect(() => {
//     const fetchInventory = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/inventory");
//         const data = await res.json();

//         if (data.success) {
//           setProducts(data.data);
//         } else {
//           alert("فشل تحميل بيانات المخزون");
//         }
//       } catch (err) {
//         console.error(err);
//         alert("خطأ في الاتصال بالسيرفر");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInventory();
//   }, []);

//   // -----------------------------------------------------------
//   // 🔄 فتح نافذة تعديل الكمية
//   // -----------------------------------------------------------
//   const openModal = (p) => {
//     setSelected(p);
//     setQty("");
//     setType("in");
//     setShowModal(true);
//   };

//   // -----------------------------------------------------------
//   // 🧾 إرسال تحديث المخزون إلى API
//   // -----------------------------------------------------------
//   const handleConfirm = async () => {
//     const n = Number(qty);
//     if (!n || n <= 0) {
//       alert("أدخل كمية صحيحة");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/inventory/${selected.id}/adjust`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ type, quantity: n }),
//         }
//       );

//       const data = await res.json();

//       if (!data.success) {
//         alert(data.message || "خطأ أثناء تعديل المخزون");
//         return;
//       }

//       // 🔥 تحديث الواجهة
//       setProducts((prev) =>
//         prev.map((p) => (p.id === selected.id ? data.data : p))
//       );

//       setShowModal(false);
//     } catch (err) {
//       console.error(err);
//       alert("خطأ في الاتصال بالسيرفر");
//     }
//   };

//   // -----------------------------------------------------------
//   // 🚫 التحقق من الصلاحية
//   // -----------------------------------------------------------
//   if (!hasPermission(["admin", "pharmacist"])) {
//     return (
//       <Layout user={user} title="المخزون">
//         <div dir="rtl" className="p-6 text-center text-red-600">
//           ⚠️ ليس لديك صلاحية لدخول شاشة المخزون.
//         </div>
//       </Layout>
//     );
//   }

//   // -----------------------------------------------------------
//   // ⏳ تحميل ...
//   // -----------------------------------------------------------
//   if (loading) {
//     return (
//       <Layout user={user} title="المخزون">
//         <div dir="rtl" className="p-6 text-center">⏳ جاري تحميل المخزون…</div>
//       </Layout>
//     );
//   }

//   // -----------------------------------------------------------
//   // 🎨 الواجهة
//   // -----------------------------------------------------------
//   return (
//     <Layout user={user} title="المخزون">
//       <div dir="rtl" className="space-y-6">
        
//         <h1 className="text-xl font-bold text-gray-800">🏬 إدارة المخزون</h1>

//         <div className="overflow-x-auto bg-white border shadow rounded-xl">
//           <table className="w-full text-sm text-right">
//             <thead className="text-gray-700 bg-gray-50">
//               <tr>
//                 <th className="p-3">المنتج</th>
//                 <th className="p-3">الكود</th>
//                 <th className="p-3">الفئة</th>
//                 <th className="p-3">الكمية</th>
//                 <th className="p-3">الحد الأدنى</th>
//                 <th className="p-3">الصلاحية</th>
//                 <th className="p-3 text-center">تحذيرات</th>
//                 <th className="p-3 text-center">إجراءات</th>
//               </tr>
//             </thead>

//             <tbody>
//               {products.map((p) => {
//                 const warnings = getWarnings(p);
//                 const daysLeft = p.expiryDate
//                   ? (new Date(p.expiryDate) - new Date()) /
//                     (1000 * 60 * 60 * 24)
//                   : null;

//                 return (
//                   <tr key={p.id} className="border-t hover:bg-gray-50">
//                     <td className="p-3">{p.name}</td>
//                     <td className="p-3 text-xs text-gray-600">{p.sku}</td>
//                     <td className="p-3">{p.category}</td>

//                     <td
//                       className={`p-3 ${
//                         p.quantity <= 0
//                           ? "text-red-700 font-bold"
//                           : p.quantity < (p.minQty || 5)
//                           ? "text-amber-600 font-semibold"
//                           : ""
//                       }`}
//                     >
//                       {p.quantity}
//                     </td>

//                     <td className="p-3">{p.minQty}</td>

//                     <td className="p-3 text-xs">
//                       {p.expiryDate
//                         ? daysLeft < 0
//                           ? "❌ منتهي"
//                           : p.expiryDate
//                         : "-"}
//                     </td>

//                     <td className="p-3 text-center">
//                       <WarningIndicator warnings={warnings} />
//                     </td>

//                     <td className="p-3 text-center">
//                       <button
//                         onClick={() => openModal(p)}
//                         className="px-3 py-1 text-xs text-white rounded-lg bg-sky-600 hover:bg-sky-700"
//                       >
//                         🔄 توريد / خصم
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {products.length === 0 && (
//                 <tr>
//                   <td colSpan={8} className="p-4 text-center text-gray-400">
//                     لا توجد أصناف حالياً…
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showModal && selected && (
//         <Modal
//           title="تعديل المخزون"
//           onClose={() => setShowModal(false)}
//           onConfirm={handleConfirm}
//         >
//           <div dir="rtl" className="space-y-3 text-sm">
//             <p>
//               المنتج: <strong>{selected.name}</strong>
//             </p>

//             <div>
//               <label className="block mb-1 text-xs text-gray-500">
//                 نوع العملية
//               </label>
//               <select
//                 className="w-full p-2 border rounded"
//                 value={type}
//                 onChange={(e) => setType(e.target.value)}
//               >
//                 <option value="in">➕ توريد</option>
//                 <option value="out">➖ خصم</option>
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 text-xs text-gray-500">
//                 الكمية
//               </label>
//               <input
//                 type="number"
//                 className="w-full p-2 border rounded"
//                 placeholder="مثال: 10"
//                 value={qty}
//                 onChange={(e) => setQty(e.target.value)}
//               />
//             </div>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   );
// }
