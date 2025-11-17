// pages/inventory.js
import { useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import WarningIndicator from "../components/WarningIndicator";

export default function InventoryPage() {
  const { user, hasPermission } = useAuth();
  const { products, updateStock, getWarnings, printInventoryReport } =
    useInventory();

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [type, setType] = useState("in");

  if (!hasPermission(["admin", "pharmacist"])) {
    return (
      <div dir="rtl" className="p-6 text-center text-red-600">
        ⚠️ ليس لديك صلاحية لدخول شاشة المخزون.
      </div>
    );
  }

  const openModal = (p) => {
    setSelected(p);
    setQty("");
    setType("in");
    setShowModal(true);
  };

  const handleConfirm = () => {
    const n = Number(qty);
    if (!n || n <= 0) {
      alert("أدخل كمية صحيحة");
      return;
    }
    updateStock(selected.id, n, type);
    setShowModal(false);
  };

  return (
    <Layout user={user} title="المخزون">
      <div dir="rtl" className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-gray-800">🏬 إدارة المخزون</h1>

          <button
            onClick={printInventoryReport}
            className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            🖨️ طباعة تقرير المخزون
          </button>
        </div>

        <div className="overflow-x-auto bg-white border shadow rounded-xl">
          <table className="w-full text-sm text-right">
            <thead className="text-gray-700 bg-gray-50">
              <tr>
                <th className="p-3">المنتج</th>
                <th className="p-3">الكود</th>
                <th className="p-3">الفئة</th>
                <th className="p-3">الكمية</th>
                <th className="p-3">الحد الأدنى</th>
                <th className="p-3">الصلاحية</th>
                <th className="p-3 text-center">تحذيرات</th>
                <th className="p-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const warnings = getWarnings(p);
                const daysLeft =
                  p.expiryDate
                    ? (new Date(p.expiryDate) - new Date()) /
                      (1000 * 60 * 60 * 24)
                    : null;

                return (
                  <tr
                    key={p.id}
                    className="transition border-t hover:bg-gray-50"
                  >
                    <td className="p-3">{p.name}</td>
                    <td className="p-3 text-xs text-gray-600">{p.sku}</td>
                    <td className="p-3">{p.category}</td>
                    <td
                      className={`p-3 ${
                        p.quantity < (p.minQty || 5)
                          ? "text-red-600 font-semibold"
                          : ""
                      }`}
                    >
                      {p.quantity}
                    </td>
                    <td className="p-3">{p.minQty}</td>
                    <td className="p-3 text-xs">
                      {p.expiryDate
                        ? daysLeft < 0
                          ? "❌ منتهي"
                          : `${p.expiryDate}`
                        : "-"}
                    </td>
                    <td className="p-3 text-center">
                      <WarningIndicator warnings={warnings} />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => openModal(p)}
                        className="px-3 py-1 text-xs text-white rounded-lg bg-sky-600 hover:bg-sky-700"
                      >
                        🔄 توريد / خصم
                      </button>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-400">
                    لا توجد بيانات مخزون حالياً…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selected && (
        <Modal
          title="تعديل المخزون"
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        >
          <div dir="rtl" className="space-y-3 text-sm">
            <p>
              المنتج: <strong>{selected.name}</strong>
            </p>

            <div>
              <label className="block mb-1 text-xs text-gray-500">
                نوع العملية
              </label>
              <select
                className="w-full p-2 border rounded"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="in">➕ توريد</option>
                <option value="out">➖ خصم</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs text-gray-500">
                الكمية
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="مثال: 10"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}





// // pages/inventory.js
// import { useState } from "react";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import { useInventory } from "../context/InventoryContext";
// import { useAuth } from "../context/AuthContext";

// export default function InventoryPage() {
//   const { user, hasPermission } = useAuth();

//   if (!hasPermission(["admin", "pharmacist"])) {
//     return <div className="p-5 text-center text-red-600">⚠️ غير مسموح لك</div>;
//   }

//   const { products, updateStock, getWarnings, printInventoryReport } =
//     useInventory();

//   const [showModal, setShowModal] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [qty, setQty] = useState("");
//   const [type, setType] = useState("in");

//   const openModal = (p) => {
//     setSelected(p);
//     setQty("");
//     setType("in");
//     setShowModal(true);
//   };

//   return (
//     <Layout user={user} title="المخزون">
//       <div className="space-y-6" dir="rtl">
//         <div className="flex justify-between">
//           <h1 className="text-xl font-bold">🏬 المخزون</h1>

//           <button
//             onClick={printInventoryReport}
//             className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
//           >
//             🖨️ طباعة التقرير
//           </button>
//         </div>

//         <div className="overflow-x-auto bg-white rounded shadow">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-3">اسم المنتج</th>
//                 <th className="p-3">الكمية</th>
//                 <th className="p-3">الحد الأدنى</th>
//                 <th className="p-3">الصلاحية</th>
//                 <th className="p-3">تحذيرات</th>
//                 <th className="p-3">إجراءات</th>
//               </tr>
//             </thead>

//             <tbody>
//               {products.map((p) => {
//                 const warnings = getWarnings(p);
//                 const days =
//                   (new Date(p.expiryDate) - new Date()) /
//                   (1000 * 60 * 60 * 24);

//                 return (
//                   <tr key={p.id} className="border-t hover:bg-gray-50">
//                     <td className="p-3">{p.name}</td>

//                     <td className="p-3">{p.quantity}</td>

//                     <td className="p-3">{p.minQty}</td>

//                     <td className="p-3">
//                       {days < 0
//                         ? "❌ منتهي"
//                         : days < 30
//                         ? `⚠️ ${Math.ceil(days)} يوم`
//                         : "✔️ صالح"}
//                     </td>

//                     <td className="p-3">
//                       <div className="flex flex-wrap gap-1">
//                         {warnings.map((w, i) => (
//                           <span
//                             key={i}
//                             className="inline-block px-2 py-1 text-xs text-white bg-red-600 rounded"
//                           >
//                             {w}
//                           </span>
//                         ))}
//                       </div>
//                     </td>

//                     <td className="p-3">
//                       <button
//                         onClick={() => openModal(p)}
//                         className="px-3 py-1 text-white rounded bg-sky-700"
//                       >
//                         تعديل
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {showModal && selected && (
//           <Modal
//             title="تعديل المخزون"
//             onClose={() => setShowModal(false)}
//             onConfirm={() => {
//               updateStock(selected.id, Number(qty), type);
//               setShowModal(false);
//             }}
//           >
//             <div className="space-y-3 text-sm">
//               <p>
//                 المنتج: <strong>{selected.name}</strong>
//               </p>

//               <select
//                 className="w-full p-2 border rounded"
//                 value={type}
//                 onChange={(e) => setType(e.target.value)}
//               >
//                 <option value="in">➕ توريد</option>
//                 <option value="out">➖ خصم</option>
//               </select>

//               <input
//                 type="number"
//                 className="w-full p-2 border rounded"
//                 placeholder="الكمية"
//                 value={qty}
//                 onChange={(e) => setQty(e.target.value)}
//               />
//             </div>
//           </Modal>
//         )}
//       </div>
//     </Layout>
//   );
// }















// // pages/inventory.js
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import { useInventory } from "../context/InventoryContext";

// export default function InventoryPage() {
//   const router = useRouter();
//   const { products, updateStock, getWarnings } = useInventory();

//   const [showModal, setShowModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [qty, setQty] = useState("");
//   const [type, setType] = useState("in");

//   useEffect(() => {
//     const { product } = router.query;
//     if (product && products.length) {
//       const p = products.find((x) => x.id === Number(product));
//       if (p) openModal(p);
//     }
//   }, [router.query, products]);

//   const openModal = (prod) => {
//     setSelectedProduct(prod);
//     setQty("");
//     setType("in");
//     setShowModal(true);
//   };

//   const handleUpdate = () => {
//     const n = Number(qty || 0);
//     if (!n || n <= 0) {
//       alert("أدخل كمية صحيحة");
//       return;
//     }
//     updateStock(selectedProduct.id, n, type);
//     setShowModal(false);
//   };

//   return (
//     <Layout title="المخزن">
//       <div dir="rtl" className="space-y-6">
//         <h1 className="text-2xl font-bold text-gray-800">🏬 إدارة المخزون</h1>

//         <div className="overflow-x-auto bg-white border shadow-md rounded-xl">
//           <table className="w-full text-sm text-right">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="p-3">المنتج</th>
//                 <th className="p-3">الكمية</th>
//                 <th className="p-3">الحد الأدنى</th>
//                 <th className="p-3">الانتهاء</th>
//                 <th className="p-3">تحذيرات</th>
//                 <th className="p-3">إجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((p) => {
//                 const warnings = getWarnings(p);
//                 return (
//                   <tr key={p.id} className="border-t hover:bg-gray-50">
//                     <td className="p-3">{p.name}</td>
//                     <td
//                       className={`p-3 ${
//                         p.quantity < (p.minQty ?? 5)
//                           ? "text-red-600 font-semibold"
//                           : ""
//                       }`}
//                     >
//                       {p.quantity}
//                     </td>
//                     <td className="p-3">{p.minQty ?? "-"}</td>
//                     <td className="p-3 text-red-600">
//                       {p.expiryDate || ""}
//                     </td>
//                     <td className="p-3 text-xs text-red-600">
//                       {warnings.length
//                         ? warnings.map((w, i) => <div key={i}>{w}</div>)
//                         : "لا توجد"}
//                     </td>
//                     <td className="p-3">
//                       <button
//                         onClick={() => openModal(p)}
//                         className="px-3 py-1 text-white rounded-lg bg-sky-600 hover:bg-sky-700"
//                       >
//                         🔄 توريد / خصم
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {!products.length && (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="p-4 text-center text-gray-400"
//                   >
//                     لا توجد بيانات مخزون…
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showModal && selectedProduct && (
//         <Modal
//           title="تعديل المخزون"
//           onClose={() => setShowModal(false)}
//           onConfirm={handleUpdate}
//         >
//           <div dir="rtl" className="space-y-3 text-sm">
//             <div className="p-2 border rounded bg-gray-50">
//               المنتج: <strong>{selectedProduct.name}</strong>
//             </div>

//             <label className="text-xs text-gray-500">نوع العملية</label>
//             <select
//               className="w-full p-2 border rounded"
//               value={type}
//               onChange={(e) => setType(e.target.value)}
//             >
//               <option value="in">➕ توريد</option>
//               <option value="out">➖ خصم</option>
//             </select>

//             <label className="text-xs text-gray-500">الكمية</label>
//             <input
//               type="number"
//               className="w-full p-2 border rounded"
//               placeholder="الكمية"
//               value={qty}
//               onChange={(e) => setQty(e.target.value)}
//             />
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   );
// }


















// // pages/inventory.js
// import { useEffect, useMemo, useState } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import toast from 'react-hot-toast'
// import theme from '../theme'
// import {
//   ResponsiveContainer,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
//   PieChart, Pie, Cell
// } from 'recharts'

// export default function Inventory() {
//   // ---------- بيانات وهمية أولية ----------
//   const initialProducts = [
//     {
//       id: 1,
//       name: 'باراسيتامول 500mg',
//       barcode: '6291234567890',
//       category: 'مسكنات',
//       supplier: 'GSK',
//       purchasePrice: 8,
//       salePrice: 15,
//       qty: 32,
//       minQty: 10,
//       expiry: '2026-02-15',
//       notes: ''
//     },
//     {
//       id: 2,
//       name: 'أموكسيسيلين 250mg',
//       barcode: '6299876543210',
//       category: 'مضادات حيوية',
//       supplier: 'Pfizer',
//       purchasePrice: 22,
//       salePrice: 35,
//       qty: 6,
//       minQty: 12,
//       expiry: '2025-12-01',
//       notes: ''
//     },
//     {
//       id: 3,
//       name: 'فيتامين سي 1000mg',
//       barcode: '6291122334455',
//       category: 'فيتامينات',
//       supplier: 'Hikma',
//       purchasePrice: 10,
//       salePrice: 20,
//       qty: 120,
//       minQty: 20,
//       expiry: '2027-05-10',
//       notes: ''
//     },
//     {
//       id: 4,
//       name: 'ايبوبروفين 400mg',
//       barcode: '6295566778899',
//       category: 'مسكنات',
//       supplier: 'Novartis',
//       purchasePrice: 12,
//       salePrice: 18,
//       qty: 4,
//       minQty: 10,
//       expiry: '2025-11-20',
//       notes: ''
//     },
//     {
//       id: 5,
//       name: 'زنك 25mg',
//       barcode: '6294433221100',
//       category: 'فيتامينات',
//       supplier: 'Jamjoom',
//       purchasePrice: 9,
//       salePrice: 16,
//       qty: 40,
//       minQty: 10,
//       expiry: '2025-12-28',
//       notes: ''
//     }
//   ]

//   // ---------- الحالة العامة ----------
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)

//   // فلاتر وفرز
//   const [search, setSearch] = useState('')
//   const [category, setCategory] = useState('all')
//   const [supplier, setSupplier] = useState('all')
//   const [status, setStatus] = useState('all') // all | low | expiring | ok
//   const [sortKey, setSortKey] = useState('name') // name | qty | expiry | salePrice
//   const [sortDir, setSortDir] = useState('asc') // asc | desc

//   // مودالات
//   const [showFormModal, setShowFormModal] = useState(false)
//   const [editing, setEditing] = useState(null) // null = إضافة / {..} = تعديل
//   const [form, setForm] = useState({
//     name: '',
//     barcode: '',
//     category: '',
//     supplier: '',
//     purchasePrice: '',
//     salePrice: '',
//     qty: '',
//     minQty: '',
//     expiry: '',
//     notes: ''
//   })

//   const [showViewModal, setShowViewModal] = useState(null) // يحتوي العنصر المعروض
//   const [showRestockModal, setShowRestockModal] = useState(null) // يحتوي العنصر الجاري توريده
//   const [restockQty, setRestockQty] = useState(1)



//   useEffect(() => {
//   const token = localStorage.getItem("pharmacy_token")
//   if (!token) {
//     router.replace("/")   // redirect to login
//   }
// }, [])


//   useEffect(() => {
//     // محاكاة جلب البيانات
//     setTimeout(() => {
//       setProducts(initialProducts)
//       setLoading(false)
//     }, 300)
//   }, [])

//   // ---------- Utilities ----------
//   const today = new Date()
//   const daysDiff = (dateStr) => {
//     const d = new Date(dateStr)
//     return Math.ceil((d - today) / (1000 * 60 * 60 * 24))
//   }
//   const isExpiringSoon = (dateStr, withinDays = 30) => daysDiff(dateStr) <= withinDays && new Date(dateStr) >= today
//   const isExpired = (dateStr) => new Date(dateStr) < today

//   // ---------- ملخصات ----------
//   const totals = useMemo(() => {
//     const totalItems = products.length
//     const totalQty = products.reduce((s, p) => s + Number(p.qty || 0), 0)
//     const lowCount = products.filter(p => Number(p.qty) <= Number(p.minQty)).length
//     const expiringCount = products.filter(p => isExpiringSoon(p.expiry, 30) || isExpired(p.expiry)).length
//     return { totalItems, totalQty, lowCount, expiringCount }
//   }, [products])

//   // ---------- فلاتر + فرز ----------
//   const categoriesList = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))], [products])
//   const suppliersList  = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.supplier).filter(Boolean)))], [products])

//   const filtered = useMemo(() => {
//     let list = [...products]

//     // بحث بالاسم أو الباركود
//     if (search.trim()) {
//       const q = search.toLowerCase()
//       list = list.filter(p =>
//         p.name.toLowerCase().includes(q) ||
//         (p.barcode && p.barcode.toLowerCase().includes(q))
//       )
//     }

//     // فئة
//     if (category !== 'all') list = list.filter(p => p.category === category)

//     // مورد
//     if (supplier !== 'all') list = list.filter(p => p.supplier === supplier)

//     // الحالة
//     if (status !== 'all') {
//       list = list.filter(p => {
//         const low = Number(p.qty) <= Number(p.minQty)
//         const expSoon = isExpiringSoon(p.expiry, 30) || isExpired(p.expiry)
//         if (status === 'low') return low
//         if (status === 'expiring') return expSoon
//         if (status === 'ok') return !low && !expSoon
//         return true
//       })
//     }

//     // الفرز
//     list.sort((a, b) => {
//       let va = a[sortKey], vb = b[sortKey]
//       if (sortKey === 'name' || sortKey === 'category' || sortKey === 'supplier') {
//         va = (va || '').toString().toLowerCase()
//         vb = (vb || '').toString().toLowerCase()
//       } else if (sortKey === 'expiry') {
//         va = new Date(va).getTime()
//         vb = new Date(vb).getTime()
//       } else {
//         va = Number(va)
//         vb = Number(vb)
//       }
//       if (va < vb) return sortDir === 'asc' ? -1 : 1
//       if (va > vb) return sortDir === 'asc' ? 1 : -1
//       return 0
//     })

//     return list
//   }, [products, search, category, supplier, status, sortKey, sortDir])

//   // ---------- تعامل مع النماذج ----------
//   const resetForm = () => {
//     setForm({
//       name: '',
//       barcode: '',
//       category: '',
//       supplier: '',
//       purchasePrice: '',
//       salePrice: '',
//       qty: '',
//       minQty: '',
//       expiry: '',
//       notes: ''
//     })
//   }

//   const openAdd = () => {
//     resetForm()
//     setEditing(null)
//     setShowFormModal(true)
//   }

//   const openEdit = (item) => {
//     setEditing(item)
//     setForm({
//       name: item.name || '',
//       barcode: item.barcode || '',
//       category: item.category || '',
//       supplier: item.supplier || '',
//       purchasePrice: item.purchasePrice || '',
//       salePrice: item.salePrice || '',
//       qty: item.qty || '',
//       minQty: item.minQty || '',
//       expiry: item.expiry || '',
//       notes: item.notes || ''
//     })
//     setShowFormModal(true)
//   }

//   const openView = (item) => {
//     setShowViewModal(item)
//   }

//   const openRestock = (item) => {
//     setShowRestockModal(item)
//     setRestockQty(1)
//   }

//   const handleSave = () => {
//     // تحقق أساسي
//     const required = ['name', 'category', 'supplier', 'salePrice', 'qty', 'minQty', 'expiry']
//     for (const k of required) {
//       if (!form[k] && form[k] !== 0) {
//         toast.error('⚠️ الرجاء إدخال الحقول المطلوبة')
//         return
//       }
//     }
//     if (editing) {
//       // تعديل
//       setProducts(prev => prev.map(p => p.id === editing.id ? { ...editing, ...form, purchasePrice: Number(form.purchasePrice || 0), salePrice: Number(form.salePrice || 0), qty: Number(form.qty || 0), minQty: Number(form.minQty || 0) } : p))
//       toast.success('✅ تم تعديل المنتج بنجاح')
//     } else {
//       // إضافة
//       const newItem = {
//         id: Date.now(),
//         ...form,
//         purchasePrice: Number(form.purchasePrice || 0),
//         salePrice: Number(form.salePrice || 0),
//         qty: Number(form.qty || 0),
//         minQty: Number(form.minQty || 0)
//       }
//       setProducts(prev => [newItem, ...prev])
//       toast.success('✅ تم إضافة المنتج بنجاح')
//     }
//     setShowFormModal(false)
//     setEditing(null)
//     resetForm()
//   }

//   const handleDelete = (id) => {
//     if (!confirm('هل تريد حذف هذا المنتج؟')) return
//     setProducts(prev => prev.filter(p => p.id !== id))
//     toast.success('🗑️ تم حذف المنتج')
//   }

//   const handleRestock = () => {
//     const qtyToAdd = Number(restockQty || 0)
//     if (!qtyToAdd || qtyToAdd <= 0) {
//       toast.error('أدخل كمية توريد صحيحة')
//       return
//     }
//     setProducts(prev =>
//       prev.map(p =>
//         p.id === showRestockModal.id ? { ...p, qty: Number(p.qty) + qtyToAdd } : p
//       )
//     )
//     setShowRestockModal(null)
//     toast.success('📥 تم إضافة التوريد بنجاح')
//   }

//   const headerButton = (label, onClick, color = theme.colors.primary, outline = false) => (
//     <button
//       onClick={onClick}
//       className={`px-4 py-2 text-sm rounded-md shadow-sm border transition active:scale-[.98] ${
//         outline ? 'bg-white text-gray-700 hover:bg-gray-50' : 'text-white hover:opacity-90'
//       }`}
//       style={{
//         backgroundColor: outline ? 'white' : color,
//         borderColor: outline ? '#e5e7eb' : `${color}40`
//       }}
//     >
//       {label}
//     </button>
//   )

//   // ---------- بيانات الرسوم ----------
//   const pieData = useMemo(() => {
//     const byCat = {}
//     products.forEach(p => {
//       byCat[p.category] = (byCat[p.category] || 0) + Number(p.qty || 0)
//     })
//     return Object.entries(byCat).map(([name, value]) => ({ name, value }))
//   }, [products])

//   const barData = useMemo(() => {
//     // أعلى 6 أصناف كمّية
//     const top = [...products]
//       .sort((a, b) => Number(b.qty) - Number(a.qty))
//       .slice(0, 6)
//       .map(p => ({ name: p.name, qty: Number(p.qty) }))
//     return top
//   }, [products])

//   const PIE_COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#14B8A6']

//   if (loading) {
//     return (
//       <Layout user={{ name: 'إدارة المخزون', role: 'admin' }} title="إدارة المخزون">
//         <div className="flex items-center justify-center h-80">
//           <p className="text-gray-600">جاري تحميل البيانات...</p>
//         </div>
//       </Layout>
//     )
//   }

//   return (
//     <Layout user={{ name: 'إدارة المخزون', role: 'admin' }} title="إدارة المخزون">
//       <div dir="rtl" className="space-y-6">
//         {/* ---------- بطاقات الملخص ---------- */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <SummaryCard title="عدد الأصناف" value={totals.totalItems} color="text-sky-600" />
//           <SummaryCard title="إجمالي الكميات" value={totals.totalQty} color="text-green-600" />
//           <SummaryCard title="منخفض المخزون" value={totals.lowCount} color="text-amber-600" />
//           <SummaryCard title="قرب الانتهاء" value={totals.expiringCount} color="text-red-600" />
//         </div>

//         {/* ---------- شريط التحكم ---------- */}
//         <div className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
//           {/* فلاتر */}
// {/* ---------- شريط التحكم والفلاتر ---------- */}
// <div className="p-4 space-y-3 bg-white border rounded-lg shadow-sm">
//   {/* 🧭 فلاتر البحث */}
//   <div className="flex flex-col w-full gap-2 md:flex-row md:items-center md:justify-between">
//     <div className="flex flex-col w-full md:flex-row md:items-center md:flex-wrap">
//       <input
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="🔍 ابحث بالاسم أو الباركود..."
//         className="w-full px-3 py-2 text-sm border rounded-md md:max-w-xs focus:ring-2 focus:ring-sky-400"
//       />

//       <select
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         className="w-full px-3 py-2 text-sm border rounded-md md:w-auto"
//       >
//         {categoriesList.map((c) => (
//           <option key={c} value={c}>
//             {c === 'all' ? 'كل الفئات' : c}
//           </option>
//         ))}
//       </select>

//       <select
//         value={supplier}
//         onChange={(e) => setSupplier(e.target.value)}
//         className="w-full px-3 py-2 text-sm border rounded-md md:w-auto"
//       >
//         {suppliersList.map((s) => (
//           <option key={s} value={s}>
//             {s === 'all' ? 'كل الموردين' : s}
//           </option>
//         ))}
//       </select>

//       <select
//         value={status}
//         onChange={(e) => setStatus(e.target.value)}
//         className="w-full px-3 py-2 text-sm border rounded-md md:w-auto"
//       >
//         <option value="all">كل الحالات</option>
//         <option value="low">منخفض المخزون</option>
//         <option value="expiring">قرب الانتهاء</option>
//         <option value="ok">صالح</option>
//       </select>

//       <div className="flex items-center w-full gap-2 md:w-auto">
//         <select
//           value={sortKey}
//           onChange={(e) => setSortKey(e.target.value)}
//           className="flex-1 px-3 py-2 text-sm border rounded-md"
//         >
//           <option value="name">الاسم</option>
//           <option value="qty">الكمية</option>
//           <option value="salePrice">سعر البيع</option>
//           <option value="expiry">الانتهاء</option>
//         </select>
//         <button
//           onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
//           className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 whitespace-nowrap"
//           title="تبديل ترتيب الفرز"
//         >
//           {sortDir === 'asc' ? '⬆️ تصاعدي' : '⬇️ تنازلي'}
//         </button>
//       </div>
//     </div>
//   </div>

//   {/* 🔘 الأزرار أسفل الفلاتر — متجاوبة */}
//   <div className="flex flex-wrap justify-start gap-2 pt-2 border-t border-gray-100">
//     <button
//       onClick={openAdd}
//       className="flex items-center gap-1 px-4 py-2 text-sm text-white transition-all rounded-md shadow-sm hover:opacity-90"
//       style={{ backgroundColor: theme.colors.primary }}
//     >
//       ➕ <span>إضافة منتج</span>
//     </button>

//     <button
//       onClick={() => setStatus('low')}
//       className="px-4 py-2 text-sm transition-all border rounded-md text-amber-700 border-amber-200 hover:bg-amber-50"
//     >
//       ⚠️ منخفض المخزون
//     </button>

//     <button
//       onClick={() => setStatus('expiring')}
//       className="px-4 py-2 text-sm text-red-700 transition-all border border-red-200 rounded-md hover:bg-red-50"
//     >
//       ⏰ قرب الانتهاء
//     </button>

//     <button
//       onClick={() => {
//         setSearch('')
//         setCategory('all')
//         setSupplier('all')
//         setStatus('all')
//         setSortKey('name')
//         setSortDir('asc')
//         toast.success('تمت إعادة التصفية')
//       }}
//       className="px-4 py-2 text-sm text-gray-700 transition-all border border-gray-200 rounded-md hover:bg-gray-50"
//     >
//       🔄 إعادة ضبط
//     </button>
//   </div>
// </div>


          
//         </div>

//         {/* ---------- جدول المخزون ---------- */}
//         <div className="p-0 overflow-hidden bg-white border rounded-lg shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-right">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">#</th>
//                   <th className="px-3 py-2">اسم الدواء</th>
//                   <th className="px-3 py-2">الباركود</th>
//                   <th className="px-3 py-2">الفئة</th>
//                   <th className="px-3 py-2">المورد</th>
//                   <th className="px-3 py-2">سعر الشراء</th>
//                   <th className="px-3 py-2">سعر البيع</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">الحد الأدنى</th>
//                   <th className="px-3 py-2">الانتهاء</th>
//                   <th className="px-3 py-2">الإجراءات</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.length ? filtered.map((p, idx) => {
//                   const low = Number(p.qty) <= Number(p.minQty)
//                   const expSoon = isExpiringSoon(p.expiry, 30)
//                   const expired = isExpired(p.expiry)
//                   return (
//                     <tr key={p.id} className="border-t hover:bg-gray-50">
//                       <td className="px-3 py-2">{idx + 1}</td>
//                       <td className="px-3 py-2 font-medium text-gray-800">{p.name}</td>
//                       <td className="px-3 py-2">{p.barcode || '-'}</td>
//                       <td className="px-3 py-2">{p.category}</td>
//                       <td className="px-3 py-2">{p.supplier}</td>
//                       <td className="px-3 py-2">{Number(p.purchasePrice).toFixed(2)} ر.س</td>
//                       <td className="px-3 py-2">{Number(p.salePrice).toFixed(2)} ر.س</td>
//                       <td className={`px-3 py-2 ${low ? 'text-amber-600 font-semibold' : 'text-gray-800'}`}>{p.qty}</td>
//                       <td className="px-3 py-2">{p.minQty}</td>
//                       <td className={`px-3 py-2 ${expired ? 'text-red-600 font-semibold' : expSoon ? 'text-amber-600 font-semibold' : ''}`}>
//                         {p.expiry}
//                       </td>
//                       <td className="px-3 py-2">
//                         <div className="flex flex-wrap gap-1">
//                           <button
//                             onClick={() => openView(p)}
//                             className="px-2 py-1 border rounded text-sky-700 border-sky-100 hover:bg-sky-50"
//                           >
//                             عرض
//                           </button>
//                           <button
//                             onClick={() => openEdit(p)}
//                             className="px-2 py-1 text-indigo-700 border border-indigo-100 rounded hover:bg-indigo-50"
//                           >
//                             تعديل
//                           </button>
//                           <button
//                             onClick={() => openRestock(p)}
//                             className="px-2 py-1 text-green-700 border border-green-100 rounded hover:bg-green-50"
//                           >
//                             توريد
//                           </button>
//                           <button
//                             onClick={() => handleDelete(p.id)}
//                             className="px-2 py-1 text-red-600 border border-red-100 rounded hover:bg-red-50"
//                           >
//                             حذف
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 }) : (
//                   <tr>
//                     <td colSpan="11" className="px-3 py-6 text-center text-gray-500">
//                       لا توجد نتائج مطابقة للبحث/الفلاتر الحالية
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* ---------- تنبيهات سريعة ---------- */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <div className="p-4 bg-white border rounded-lg shadow-sm">
//             <h4 className="mb-2 text-base font-semibold text-gray-700">⚠️ أصناف منخفضة المخزون</h4>
//             <ul className="space-y-1 text-sm list-disc list-inside">
//               {products.filter(p => Number(p.qty) <= Number(p.minQty)).slice(0, 8).map(p => (
//                 <li key={p.id} className="flex items-center justify-between">
//                   <span>{p.name}</span>
//                   <button onClick={() => openRestock(p)} className="px-2 py-0.5 text-green-700 border border-green-100 rounded hover:bg-green-50">توريد</button>
//                 </li>
//               ))}
//               {products.filter(p => Number(p.qty) <= Number(p.minQty)).length === 0 && (
//                 <li className="text-gray-500">لا توجد أصناف منخفضة حاليًا</li>
//               )}
//             </ul>
//           </div>

//           <div className="p-4 bg-white border rounded-lg shadow-sm">
//             <h4 className="mb-2 text-base font-semibold text-gray-700">⏰ أصناف قاربت على الانتهاء</h4>
//             <ul className="space-y-1 text-sm list-disc list-inside">
//               {products.filter(p => isExpiringSoon(p.expiry, 30) || isExpired(p.expiry)).slice(0, 8).map(p => (
//                 <li key={p.id} className="flex items-center justify-between">
//                   <span>{p.name} <span className="text-xs text-gray-500">({p.expiry})</span></span>
//                   <button onClick={() => openEdit(p)} className="px-2 py-0.5 text-indigo-700 border border-indigo-100 rounded hover:bg-indigo-50">تعديل</button>
//                 </li>
//               ))}
//               {products.filter(p => isExpiringSoon(p.expiry, 30) || isExpired(p.expiry)).length === 0 && (
//                 <li className="text-gray-500">لا توجد أصناف قريبة الانتهاء</li>
//               )}
//             </ul>
//           </div>
//         </div>

//         {/* ---------- رسوم تحليلية ---------- */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//           <div className="p-4 bg-white border rounded-lg shadow-sm">
//             <h4 className="mb-3 text-base font-semibold text-gray-700">توزيع المخزون حسب الفئة</h4>
//             <ResponsiveContainer width="100%" height={260}>
//               <PieChart>
//                 <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={95} label>
//                   {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="p-4 bg-white border rounded-lg shadow-sm">
//             <h4 className="mb-3 text-base font-semibold text-gray-700">أعلى الأصناف كمّيًا</h4>
//             <ResponsiveContainer width="100%" height={260}>
//               <BarChart data={barData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="qty" fill={theme.colors.secondary} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* ---------- مودال إضافة/تعديل ---------- */}
//       {showFormModal && (
//         <Modal
//           title={editing ? 'تعديل منتج' : 'إضافة منتج'}
//           onClose={() => { setShowFormModal(false); setEditing(null); }}
//         >
//           <div dir="rtl" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//             <TextInput label="اسم الدواء *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
//             <TextInput label="الباركود" value={form.barcode} onChange={(v) => setForm({ ...form, barcode: v })} />
//             <TextInput label="الفئة *" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
//             <TextInput label="المورد *" value={form.supplier} onChange={(v) => setForm({ ...form, supplier: v })} />
//             <NumberInput label="سعر الشراء" value={form.purchasePrice} onChange={(v) => setForm({ ...form, purchasePrice: v })} />
//             <NumberInput label="سعر البيع *" value={form.salePrice} onChange={(v) => setForm({ ...form, salePrice: v })} />
//             <NumberInput label="الكمية *" value={form.qty} onChange={(v) => setForm({ ...form, qty: v })} />
//             <NumberInput label="الحد الأدنى *" value={form.minQty} onChange={(v) => setForm({ ...form, minQty: v })} />
//             <TextInput type="date" label="تاريخ الانتهاء *" value={form.expiry} onChange={(v) => setForm({ ...form, expiry: v })} />
//             <div className="sm:col-span-2">
//               <TextArea label="ملاحظات" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 mt-4">
//             <button onClick={() => { setShowFormModal(false); setEditing(null); }} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
//             <button onClick={handleSave} className="px-4 py-2 text-white rounded-md hover:opacity-90" style={{ backgroundColor: theme.colors.primary }}>
//               حفظ
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* ---------- مودال عرض ---------- */}
//       {showViewModal && (
//         <Modal title="عرض المنتج" onClose={() => setShowViewModal(null)}>
//           <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2" dir="rtl">
//             <InfoRow label="اسم الدواء" value={showViewModal.name} />
//             <InfoRow label="الباركود" value={showViewModal.barcode || '-'} />
//             <InfoRow label="الفئة" value={showViewModal.category} />
//             <InfoRow label="المورد" value={showViewModal.supplier} />
//             <InfoRow label="سعر الشراء" value={`${Number(showViewModal.purchasePrice || 0).toFixed(2)} ر.س`} />
//             <InfoRow label="سعر البيع" value={`${Number(showViewModal.salePrice || 0).toFixed(2)} ر.س`} />
//             <InfoRow label="الكمية" value={showViewModal.qty} />
//             <InfoRow label="الحد الأدنى" value={showViewModal.minQty} />
//             <InfoRow label="تاريخ الانتهاء" value={showViewModal.expiry} />
//             <div className="sm:col-span-2">
//               <InfoRow label="ملاحظات" value={showViewModal.notes || '-'} />
//             </div>
//           </div>
//           <div className="flex justify-end gap-3 mt-4">
//             <button onClick={() => setShowViewModal(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إغلاق</button>
//             <button onClick={() => { setShowViewModal(null); openEdit(showViewModal); }} className="px-4 py-2 text-white rounded-md hover:opacity-90" style={{ backgroundColor: theme.colors.secondary }}>
//               تعديل
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* ---------- مودال توريد ---------- */}
//       {showRestockModal && (
//         <Modal title={`توريد: ${showRestockModal.name}`} onClose={() => setShowRestockModal(null)}>
//           <div dir="rtl" className="space-y-3">
//             <p className="text-sm text-gray-600">الكمية الحالية: <span className="font-semibold text-gray-800">{showRestockModal.qty}</span></p>
//             <NumberInput label="كمية التوريد" value={restockQty} onChange={setRestockQty} min={1} />
//           </div>
//           <div className="flex justify-end gap-3 mt-4">
//             <button onClick={() => setShowRestockModal(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
//             <button onClick={handleRestock} className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">حفظ التوريد</button>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }

// /* ======================= مكونات مساعدة صغيرة ======================= */

// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }

// function TextInput({ label, value, onChange, type = 'text' }) {
//   return (
//     <div className="flex flex-col">
//       <label className="mb-1 text-sm text-gray-600">{label}</label>
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
//         className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//       />
//     </div>
//   )
// }

// function NumberInput({ label, value, onChange, min = 0 }) {
//   return (
//     <TextInput
//       label={label}
//       value={value}
//       onChange={(v) => onChange(Number(v))}
//       type="number"
//       min={min}
//     />
//   )
// }

// function TextArea({ label, value, onChange }) {
//   return (
//     <div className="flex flex-col">
//       <label className="mb-1 text-sm text-gray-600">{label}</label>
//       <textarea
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="px-3 py-2 text-sm border rounded-md min-h-[90px] focus:ring-2 focus:ring-sky-400"
//       />
//     </div>
//   )
// }

// function InfoRow({ label, value }) {
//   return (
//     <div className="flex items-center justify-between px-3 py-2 rounded bg-gray-50">
//       <span className="text-gray-600">{label}</span>
//       <span className="font-medium text-gray-800">{value}</span>
//     </div>
//   )
// }
