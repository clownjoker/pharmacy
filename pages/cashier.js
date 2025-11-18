// pages/cashier.js
import { useState } from "react";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import {
  addSale,
  applySaleToInventory,
  openShift,
  closeShift,
} from "../lib/fakeBackend";

export default function Cashier() {
  const [user] = useState({ name: "محمد الكاشير", role: "cashier" });

  // منتجات تجريبية (تقدر تربطها لاحقًا بصفحة المنتجات/المخزون)
  const PRODUCTS = [
    { id: 1, name: "بانادول", price: 12, barcode: "629111" },
    { id: 2, name: "فيتامين سي", price: 25, barcode: "629222" },
    { id: 3, name: "كحولة طبية", price: 10, barcode: "629333" },
    { id: 4, name: "مسكن ألترا", price: 18, barcode: "629444" },
  ];

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customer, setCustomer] = useState("عميل نقدي");

  const [invoices, setInvoices] = useState([]); // فواتير وهمية محليًا
  const [shiftOpen, setShiftOpen] = useState(false);

  // 🔹 فلترة المنتجات حسب البحث
  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 إضافة منتج للسلة
  const addToCart = (p) => {
    if (!shiftOpen) {
      toast.error("⚠️ يجب فتح شِفت قبل البدء في البيع");
      return;
    }

    const exists = cart.find((c) => c.id === p.id);
    if (exists) {
      setCart(
        cart.map((c) =>
          c.id === p.id ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
  };

  // 🔹 إزالة من السلة
  const removeItem = (id) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  // 🔹 إجمالي السلة
  const subtotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  const total = subtotal - discount + tax;

  const formatDate = (iso) => {
    try {
      return new Date(iso).toISOString().replace("T", " ").slice(0, 16);
    } catch {
      return iso || "";
    }
  };

  // 🔹 فتح شفت
  const handleOpenShift = () => {
    openShift(user.name);
    setShiftOpen(true);
    toast.success("✅ تم فتح الشِفت للكاشير");
  };

  // 🔹 إغلاق شفت
  const handleCloseShift = () => {
    closeShift(user.name);
    setShiftOpen(false);
    toast.success("✅ تم إغلاق الشِفت");
  };

  // 🔹 حفظ الفاتورة وربطها بالمبيعات + المخزون + الشِفت
  const saveInvoice = () => {
    if (!shiftOpen) {
      toast.error("⚠️ افتح شِفت أولاً");
      return;
    }

    if (cart.length === 0) {
      toast.error("لم يتم اختيار أي منتج");
      return;
    }

    const id = Date.now(); // كود فاتورة تجريبي
    const date = new Date().toISOString();

    const invoice = {
      id,
      date,
      customer,
      cashier: user.name,
      payment: paymentMethod,
      type: "sale",
      items: cart.map((it) => ({
        productId: it.id,
        id: it.id,
        name: it.name,
        qty: it.qty,
        price: it.price,
        barcode: it.barcode,
      })),
      discount,
      tax,
      total,
    };

    // 1) حفظ الفاتورة في "المبيعات"
    const saved = addSale(invoice);

    // 2) خصم الكميات من المخزون
    applySaleToInventory(saved);

    // 3) إضافة للسجل المحلي في شاشة الكاشير
    setInvoices((prev) => [...prev, saved]);

    // 4) تصفير السلة
    setCart([]);
    setDiscount(0);
    setTax(0);

    toast.success("🧾 تم حفظ الفاتورة وتحديث المبيعات والمخزون (محليًا)");
  };

  // 🔹 طباعة الفاتورة
  const printInvoice = (inv) => {
    const html = `
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8" />
        <title>فاتورة ${inv.id}</title>
        <style>
          body { font-family: 'Tajawal',sans-serif; padding: 20px; }
          h2 { color:#0ea5e9; margin-bottom: 10px; }
          table { width:100%; border-collapse: collapse; margin-top:10px; }
          th,td { border:1px solid #ddd; padding:6px; text-align:center; }
          th { background:#f3f4f6; }
        </style>
      </head>
      <body>
        <h2>صيدلية المعلم</h2>
        <p>فاتورة رقم: <strong>${inv.id}</strong></p>
        <p>العميل: ${inv.customer}</p>
        <p>الكاشير: ${inv.cashier}</p>
        <p>التاريخ: ${formatDate(inv.date)}</p>

        <table>
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${
              (inv.items || [])
                .map(
                  (it) => `
                  <tr>
                    <td>${it.name}</td>
                    <td>${it.qty}</td>
                    <td>${it.price}</td>
                    <td>${it.qty * it.price}</td>
                  </tr>`
                )
                .join("") || `
                <tr>
                  <td colspan="4">لا توجد أصناف</td>
                </tr>`
            }
          </tbody>
        </table>

        <h3>الإجمالي النهائي: ${inv.total} ر.س</h3>

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

  return (
    <Layout user={user} title="نظام الكاشير">
      <div dir="rtl" className="space-y-6">

        {/* شريط الشِفت */}
        <div className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-600">
              الكاشير الحالي: <span className="font-semibold">{user.name}</span>
            </p>
            <p className="text-xs text-gray-500">
              حالة الشِفت:{" "}
              <span className={shiftOpen ? "text-emerald-600" : "text-red-600"}>
                {shiftOpen ? "مفتوح" : "مغلق"}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleOpenShift}
              className="px-3 py-1.5 text-xs text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
            >
              🟢 فتح شِفت
            </button>
            <button
              onClick={handleCloseShift}
              className="px-3 py-1.5 text-xs text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              🔴 إغلاق شِفت
            </button>
          </div>
        </div>

        {/* الشبكة الرئيسية: السلة + البحث عن منتج */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* السلة */}
          <div className="p-5 bg-white border rounded-lg shadow-sm md:col-span-2">
            <h2 className="mb-4 text-lg font-bold">🧾 السلة</h2>

            {/* بيانات العميل وطريقة الدفع */}
            <div className="grid grid-cols-1 gap-3 mb-4 text-sm md:grid-cols-3">
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="اسم العميل (اختياري)"
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="cash">نقدًا</option>
                <option value="card">بطاقة</option>
                <option value="wallet">محفظة</option>
              </select>
              <div className="text-xs text-gray-500 md:text-right">
                نوع الدفع يؤثر على التقارير لاحقًا فقط (بيانات تجريبية).
              </div>
            </div>

            {cart.length === 0 ? (
              <p className="text-sm text-gray-500">
                لا يوجد منتجات مضافة بعد. اختر منتجًا من القائمة على اليمين.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600 bg-gray-50">
                    <th className="p-2">الصنف</th>
                    <th>الكمية</th>
                    <th>السعر</th>
                    <th>الإجمالي</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="p-2">{it.name}</td>
                      <td>{it.qty}</td>
                      <td>{it.price} ر.س</td>
                      <td>{it.qty * it.price} ر.س</td>
                      <td>
                        <button
                          className="text-xs text-red-500"
                          onClick={() => removeItem(it.id)}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* الإجماليات */}
            <div className="mt-4 space-y-2 text-sm">
              <p>
                المجموع: <strong>{subtotal} ر.س</strong>
              </p>

              <label>خصم</label>
              <input
                type="number"
                className="w-full p-1 border rounded"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              />

              <label>ضريبة</label>
              <input
                type="number"
                className="w-full p-1 border rounded"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value) || 0)}
              />

              <p className="mt-2 text-lg font-bold">
                الإجمالي النهائي:{" "}
                <span className="text-emerald-600">{total} ر.س</span>
              </p>

              <button
                className="w-full py-2 mt-3 text-white rounded bg-emerald-600 hover:bg-emerald-700"
                onClick={saveInvoice}
              >
                💾 حفظ الفاتورة وتحديث النظام
              </button>
            </div>
          </div>

          {/* البحث عن منتج */}
          <div className="p-5 bg-white border rounded-lg shadow-sm">
            <h2 className="text-lg font-bold">🔍 البحث عن منتج</h2>
            <input
              type="text"
              placeholder="اسم المنتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 mt-2 border rounded-md"
            />

            <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  className="w-full p-2 text-right border rounded hover:bg-gray-50"
                  onClick={() => addToCart(p)}
                >
                  {p.name} — {p.price} ر.س
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <p className="text-xs text-gray-400">
                  لا توجد نتائج مطابقة لبحثك.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* سجل الفواتير الأخيرة للكاشير */}
        <div className="p-5 bg-white border rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-bold">🕒 آخر الفواتير (محليًا)</h2>

          {invoices.length === 0 ? (
            <p className="text-sm text-gray-500">لا توجد فواتير بعد.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="text-gray-600 bg-gray-50">
                    <th className="p-2">رقم</th>
                    <th>التاريخ</th>
                    <th>العميل</th>
                    <th>الإجمالي</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-t">
                      <td className="p-2">{inv.id}</td>
                      <td>{formatDate(inv.date)}</td>
                      <td>{inv.customer}</td>
                      <td>{inv.total} ر.س</td>
                      <td>
                        <button
                          className="text-xs text-sky-600"
                          onClick={() => printInvoice(inv)}
                        >
                          طباعة
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}












// // pages/cashier.js
// import { useState } from "react";
// import Layout from "../components/Layout";
// import toast from "react-hot-toast";

// export default function Cashier() {
//   const [user] = useState({ name: "محمد الكاشير", role: "cashier" });

//   // قائمة منتجات وهمية
//   const PRODUCTS = [
//     { id: 1, name: "بانادول", price: 12 },
//     { id: 2, name: "فيتامين سي", price: 25 },
//     { id: 3, name: "كحولة طبية", price: 10 },
//     { id: 4, name: "مسكن ألترا", price: 18 },
//   ];

//   const [search, setSearch] = useState("");
//   const [cart, setCart] = useState([]);
//   const [discount, setDiscount] = useState(0);
//   const [tax, setTax] = useState(0);

//   const [invoices, setInvoices] = useState([]); // فواتير وهمية

//   // البحث
//   const filteredProducts = PRODUCTS.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase())
//   );

//   // إضافة منتج للفاتورة
//   const addToCart = (p) => {
//     const exists = cart.find((c) => c.id === p.id);
//     if (exists) {
//       setCart(
//         cart.map((c) =>
//           c.id === p.id ? { ...c, qty: c.qty + 1 } : c
//         )
//       );
//     } else {
//       setCart([...cart, { ...p, qty: 1 }]);
//     }
//   };

//   // إزالة من السلة
//   const removeItem = (id) => {
//     setCart(cart.filter((c) => c.id !== id));
//   };

//   // حساب الإجمالي
//   const subtotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
//   const total = subtotal - discount + tax;

//   // حفظ الفاتورة
//   const saveInvoice = () => {
//     if (cart.length === 0) return toast.error("لم يتم اختيار أي منتج");

//     const invoice = {
//       id: Date.now(),
//       items: cart,
//       subtotal,
//       discount,
//       tax,
//       total,
//       cashier: user.name,
//       date: new Date().toISOString(),
//     };

//     setInvoices([...invoices, invoice]);
//     setCart([]);
//     setDiscount(0);
//     setTax(0);

//     toast.success("تم حفظ الفاتورة بنجاح (وهمية)");
//   };

//   // الطباعة
//   const printInvoice = (inv) => {
//     const html = `
//       <html dir="rtl">
//       <body>
//         <h2>فاتورة رقم ${inv.id}</h2>
//         <p>الكاشير: ${inv.cashier}</p>

//         <table border="1" width="100%" style="border-collapse: collapse">
//           <thead>
//             <tr>
//               <th>الصنف</th>
//               <th>الكمية</th>
//               <th>السعر</th>
//               <th>الإجمالي</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${inv.items
//               .map(
//                 (it) =>
//                   `<tr>
//                      <td>${it.name}</td>
//                      <td>${it.qty}</td>
//                      <td>${it.price}</td>
//                      <td>${it.qty * it.price}</td>
//                    </tr>`
//               )
//               .join("")}
//           </tbody>
//         </table>

//         <h3>الإجمالي: ${inv.total} ر.س</h3>

//         <script>
//           window.onload = () => window.print()
//         </script>
//       </body>
//       </html>
//     `;

//     const win = window.open("", "_blank", "width=600,height=800");
//     win.document.write(html);
//     win.document.close();
//   };

//   return (
//     <Layout user={user} title="نظام الكاشير">
//       <div dir="rtl" className="grid grid-cols-1 gap-6 md:grid-cols-3">

//         {/* القسم الأيسر — السلة */}
//         <div className="p-5 bg-white border rounded-lg shadow-sm md:col-span-2">
//           <h2 className="mb-4 text-lg font-bold">🧾 السلة</h2>

//           {cart.length === 0 ? (
//             <p className="text-sm text-gray-500">لا يوجد منتجات مضافة</p>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-gray-600 bg-gray-50">
//                   <th className="p-2">الصنف</th>
//                   <th>الكمية</th>
//                   <th>السعر</th>
//                   <th>الإجمالي</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.map((it) => (
//                   <tr key={it.id} className="border-t">
//                     <td className="p-2">{it.name}</td>
//                     <td>{it.qty}</td>
//                     <td>{it.price} ر.س</td>
//                     <td>{it.qty * it.price} ر.س</td>
//                     <td>
//                       <button
//                         className="text-xs text-red-500"
//                         onClick={() => removeItem(it.id)}
//                       >
//                         حذف
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {/* الإجماليات */}
//           <div className="mt-4 space-y-2 text-sm">
//             <p>المجموع: <strong>{subtotal} ر.س</strong></p>

//             <label>خصم</label>
//             <input
//               type="number"
//               className="w-full p-1 border rounded"
//               value={discount}
//               onChange={(e) => setDiscount(Number(e.target.value))}
//             />

//             <label>ضريبة</label>
//             <input
//               type="number"
//               className="w-full p-1 border rounded"
//               value={tax}
//               onChange={(e) => setTax(Number(e.target.value))}
//             />

//             <p className="mt-2 text-lg font-bold">
//               الإجمالي النهائي: <span className="text-emerald-600">{total} ر.س</span>
//             </p>

//             <button
//               className="w-full py-2 mt-3 text-white rounded bg-emerald-600"
//               onClick={saveInvoice}
//             >
//               💾 حفظ الفاتورة
//             </button>
//           </div>
//         </div>

//         {/* القسم الأيمن — البحث والمنتجات */}
//         <div className="p-5 bg-white border rounded-lg shadow-sm">
//           <h2 className="text-lg font-bold">🔍 البحث عن منتج</h2>
//           <input
//             type="text"
//             placeholder="اسم المنتج..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full p-2 mt-2 border rounded"
//           />

//           <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
//             {filteredProducts.map((p) => (
//               <button
//                 key={p.id}
//                 className="w-full p-2 text-right border rounded hover:bg-gray-50"
//                 onClick={() => addToCart(p)}
//               >
//                 {p.name} — {p.price} ر.س
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* سجل آخر الفواتير */}
//       <div className="p-5 mt-8 bg-white border rounded-lg shadow-sm">
//         <h2 className="mb-4 text-lg font-bold">🕒 آخر الفواتير</h2>

//         {invoices.length === 0 ? (
//           <p className="text-sm text-gray-500">لا توجد فواتير</p>
//         ) : (
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="p-2">رقم</th>
//                 <th>التاريخ</th>
//                 <th>الإجمالي</th>
//                 <th>إجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invoices.map((inv) => (
//                 <tr key={inv.id} className="border-t">
//                   <td className="p-2">{inv.id}</td>
//                   <td>{new Date(inv.date).toLocaleString("ar-EG")}</td>
//                   <td>{inv.total} ر.س</td>
//                   <td>
//                     <button
//                       className="text-xs text-sky-600"
//                       onClick={() => printInvoice(inv)}
//                     >
//                       طباعة
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </Layout>
//   );
// }















// // شغال و معتمد + تحسين قراءة الكاشير من التخزين بدون تغيير التصميم
// import { useState, useEffect, useRef } from 'react'
// import { useRouter } from 'next/router'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// const API_BASE = 'http://localhost:5000/api'

// export default function Cashier() {
//   const router = useRouter()

//   // 🔐 المستخدم الحالي (من التخزين)
//   const [user, setUser] = useState({ name: 'كاشير', role: 'cashier' })
//   const [cashierId, setCashierId] = useState(null)

//   // 🧾 حالة الكاشير
//   const [products, setProducts] = useState([])
//   const [cart, setCart] = useState([])
//   const [productId, setProductId] = useState('')
//   const [quantity, setQuantity] = useState(1)
//   const [discount, setDiscount] = useState(0)
//   const [showShiftReport, setShowShiftReport] = useState(false)
//   const [sales, setSales] = useState([])
//   const [shiftStart, setShiftStart] = useState(new Date())

//   // 💸 فاتورة آخر عملية بيع
//   const [lastInvoice, setLastInvoice] = useState(null)
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false)

//   const printRef = useRef(null)

//   // 🔐 حماية الصفحة + تحميل بيانات المستخدم
//   useEffect(() => {
//     const token = typeof window !== 'undefined'
//       ? localStorage.getItem('pharmacy_token')
//       : null
//     const u = typeof window !== 'undefined'
//       ? localStorage.getItem('pharmacy_user')
//       : null

//     if (!token || !u) {
//       router.replace('/')
//       return
//     }

//     try {
//       const parsed = JSON.parse(u)
//       setUser(parsed)

//       // 👇 محاولة ذكية لاستخراج id من أكثر من احتمال
//       let idCandidate =
//         parsed.id ??
//         parsed.user_id ??
//         parsed.userId ??
//         parsed.uid ??
//         (parsed.user && (parsed.user.id || parsed.user.user_id))

//       if (idCandidate) {
//         // نحوله لرقم لو أمكن
//         const numericId = Number(idCandidate)
//         setCashierId(Number.isNaN(numericId) ? idCandidate : numericId)
//       } else {
//         console.warn('لم يتم العثور على id داخل كائن المستخدم المخزن في localStorage', parsed)
//       }
//     } catch (e) {
//       console.error('Invalid user in localStorage', e)
//       router.replace('/')
//     }
//   }, [router])

//   // 📦 تحميل المنتجات من الباك إند
//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/products`)
//         const data = await res.json()

//         if (!res.ok) throw new Error(data.message || 'فشل تحميل المنتجات')

//         // تأكد أنه array
//         setProducts(Array.isArray(data) ? data : [])
//       } catch (err) {
//         console.error(err)
//         toast.error('⚠️ فشل الاتصال بالسيرفر لجلب المنتجات')
//       }
//     }

//     loadProducts()
//   }, [])

//   // ⏱️ بداية الوردية
//   useEffect(() => {
//     setShiftStart(new Date())
//   }, [])

//   // 🛒 إضافة منتج إلى الفاتورة
//   const addToCart = () => {
//     if (!productId) return toast.error('يرجى اختيار منتج')

//     const selected = products.find((p) => p.id === Number(productId))
//     if (!selected) return toast.error('المنتج غير موجود')

//     if (quantity <= 0) return toast.error('الكمية يجب أن تكون 1 أو أكثر')

//     const existing = cart.find((item) => item.id === selected.id)

//     if (existing) {
//       setCart((prev) =>
//         prev.map((item) =>
//           item.id === selected.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         )
//       )
//     } else {
//       setCart((prev) => [
//         ...prev,
//         {
//           id: selected.id,
//           name: selected.name,
//           price: Number(selected.price),
//           quantity,
//         },
//       ])
//     }

//     setProductId('')
//     setQuantity(1)
//     toast.success('✅ تمت الإضافة للفاتورة')
//   }

//   // 🗑️ حذف منتج من الفاتورة
//   const removeItem = (id) => {
//     setCart((prev) => prev.filter((item) => item.id !== id))
//     toast.success('تم حذف المنتج من الفاتورة')
//   }

//   // 🧮 إجماليات
//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   const netTotal = Math.max(0, total - (Number(discount) || 0))

//   // 💰 إتمام عملية البيع (مع حفظها في قاعدة البيانات + استرجاع الفاتورة)
//   const completeSale = async () => {
//     // نتأكد أن عندنا كاشير حقيقي قبل ما نرسل للباك إند
//     const numericCashierId = Number(cashierId)
//     if (!numericCashierId || Number.isNaN(numericCashierId)) {
//       toast.error('لا يوجد كاشير مسجل، أعد الدخول للنظام')
//       return
//     }

//     if (cart.length === 0) return toast.error('لا توجد منتجات في الفاتورة')

//     try {
//       const token =
//         typeof window !== 'undefined'
//           ? localStorage.getItem('pharmacy_token')
//           : null

//       const payload = {
//         cashier_id: numericCashierId, // 👈 متوافق مع الباك إند
//         customer: 'عميل نقدي',
//         payment: 'cash',
//         discount: Number(discount) || 0,
//         items: cart.map((item) => ({
//           product_id: item.id,
//           qty: item.quantity,
//         })),
//       }

//       const res = await fetch(`${API_BASE}/cashier/sale`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: token ? `Bearer ${token}` : '',
//         },
//         body: JSON.stringify(payload),
//       })

//       const data = await res.json()
//       if (!res.ok) {
//         throw new Error(data.message || 'فشل حفظ عملية البيع')
//       }

//       // ✅ تحديث ملخص الوردية
//       setSales((prev) => [
//         ...prev,
//         { id: data.sale.id, total: data.sale.total },
//       ])

//       // 🧾 تخزين آخر فاتورة لعرضها وطباعتها
//       setLastInvoice(data.sale)
//       setShowInvoiceModal(true)

//       // 🧹 تصفير الفاتورة
//       setCart([])
//       setDiscount(0)

//       toast.success('✅ تمت عملية البيع بنجاح')
//     } catch (err) {
//       console.error(err)
//       toast.error(err.message || 'حدث خطأ أثناء عملية البيع')
//     }
//   }

//   // 📊 ملخص الوردية
//   const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0)
//   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0

//   // 🧾 إغلاق الوردية
//   const closeShift = () => {
//     if (sales.length === 0) {
//       toast('لا توجد مبيعات في هذه الوردية', { icon: 'ℹ️' })
//       return
//     }
//     setShowShiftReport(true)
//   }

//   // 🖨️ طباعة تقرير الوردية
//   const handlePrintShiftReport = () => {
//     const w = window.open('', '', 'width=800,height=600')
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير نهاية الوردية</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
//             h2 { color: ${theme.colors.primary}; text-align: center; }
//             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
//             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
//             th { background: #f3f4f6; }
//           </style>
//         </head>
//         <body>${printRef.current.innerHTML}</body>
//       </html>
//     `)
//     w.document.close()
//     w.focus()
//     w.print()
//     w.close()
//   }

//   // 🖨️ طباعة الفاتورة الأخيرة
//   const handlePrintInvoice = () => {
//     if (!lastInvoice) return

//     const items = Array.isArray(lastInvoice.items) ? lastInvoice.items : []

//     const html = `
//       <html dir="rtl" lang="ar">
//         <head>
//           <meta charset="utf-8" />
//           <title>فاتورة ${lastInvoice.invoice_code}</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
//             h2 { color: ${theme.colors.primary}; text-align: center; margin-bottom: 10px; }
//             p { margin: 4px 0; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; font-size: 13px; }
//             th { background: #f3f4f6; }
//             .total { margin-top: 10px; text-align: left; font-weight: bold; }
//           </style>
//         </head>
//         <body>
//           <h2>صيدلية المعلم</h2>
//           <p>فاتورة رقم: <strong>${lastInvoice.invoice_code}</strong></p>
//           <p>التاريخ: ${new Date(lastInvoice.date).toLocaleString('ar-EG')}</p>
//           <p>العميل: ${lastInvoice.customer}</p>
//           <p>الكاشير: ${lastInvoice.cashier_name || ''}</p>
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>الصنف</th>
//                 <th>الكمية</th>
//                 <th>السعر</th>
//                 <th>الإجمالي</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${items
//                 .map(
//                   (it, i) =>
//                     `<tr>
//                       <td>${i + 1}</td>
//                       <td>${it.name}</td>
//                       <td>${it.qty}</td>
//                       <td>${it.price}</td>
//                       <td>${it.qty * it.price}</td>
//                     </tr>`
//                 )
//                 .join('')}
//             </tbody>
//           </table>
//           <p class="total">الإجمالي: ${lastInvoice.total} ر.س</p>
//         </body>
//       </html>
//     `

//     const w = window.open('', '_blank', 'width=800,height=700')
//     w.document.open()
//     w.document.write(html)
//     w.document.close()
//     w.focus()
//     w.print()
//     w.close()
//   }

//   return (
//     <Layout user={user} title="نقطة البيع (الكاشير)">
//       <div dir="rtl" className="space-y-6">
//         {/* 💼 ملخص الوردية */}
//         <div className="p-4 card bg-gradient-to-r from-sky-50 to-blue-50">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-700">
//               💼 ملخص الوردية الحالية
//             </h2>
//             <div className="flex gap-2">
//               <button onClick={closeShift} className="btn btn-primary">
//                 🧾 إغلاق الوردية
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
//             <div>
//               <p className="text-gray-500">الكاشير</p>
//               <p className="font-medium text-gray-900">
//                 {user?.name || '—'}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-500">وقت البدء</p>
//               <p className="font-medium text-gray-900">
//                 {shiftStart.toLocaleTimeString('ar-SA')}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-500">عدد الفواتير</p>
//               <p className="font-medium text-gray-900">
//                 {sales.length}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-500">إجمالي المبيعات</p>
//               <p className="font-medium text-green-700">
//                 {totalSales} ر.س
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-500">متوسط الفاتورة</p>
//               <p className="font-medium text-blue-700">
//                 {avgSale} ر.س
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* 🧾 الفاتورة + إضافة منتجات */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* جدول الفاتورة */}
//           <div className="p-5 card lg:col-span-2">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">
//               المنتجات المضافة
//             </h2>
//             <table className="w-full text-sm text-right border-t border-gray-100">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">المنتج</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                   <th />
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.length > 0 ? (
//                   cart.map((item, i) => (
//                     <tr key={i} className="border-t hover:bg-gray-50">
//                       <td className="px-3 py-2">{item.name}</td>
//                       <td className="px-3 py-2">{item.quantity}</td>
//                       <td className="px-3 py-2">
//                         {item.price} ر.س
//                       </td>
//                       <td className="px-3 py-2 font-semibold text-sky-700">
//                         {item.price * item.quantity} ر.س
//                       </td>
//                       <td
//                         className="px-3 py-2 text-red-500 cursor-pointer"
//                         onClick={() => removeItem(item.id)}
//                       >
//                         ✕
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="5"
//                       className="py-4 text-center text-gray-500"
//                     >
//                       لا توجد منتجات مضافة بعد
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* فورم إضافة منتج */}
//           <div className="p-5 card">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">
//               إضافة منتج
//             </h2>

//             <label className="block mb-2 text-sm text-gray-700">
//               اختر المنتج
//             </label>
//             <select
//               value={productId}
//               onChange={(e) => setProductId(e.target.value)}
//               className="mb-3 select"
//             >
//               <option value="">اختر...</option>
//               {products.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.name} — {p.price} ر.س
//                 </option>
//               ))}
//             </select>

//             <label className="block mb-2 text-sm text-gray-700">
//               الكمية
//             </label>
//             <input
//               type="number"
//               min="1"
//               value={quantity}
//               onChange={(e) =>
//                 setQuantity(Number(e.target.value) || 1)
//               }
//               className="mb-3 input"
//             />

//             <button
//               onClick={addToCart}
//               className="w-full mb-3 btn btn-primary"
//             >
//               ➕ إضافة للفاتورة
//             </button>

//             <label className="block mb-2 text-sm text-gray-700">
//               خصم
//             </label>
//             <input
//               type="number"
//               min="0"
//               value={discount}
//               onChange={(e) =>
//                 setDiscount(Number(e.target.value) || 0)
//               }
//               className="mb-3 input"
//             />

//             <div className="pt-3 text-sm text-gray-600 border-t">
//               <p>
//                 الإجمالي:{' '}
//                 <span className="font-bold text-gray-900">
//                   {total} ر.س
//                 </span>
//               </p>
//               <p>
//                 الخصم:{' '}
//                 <span className="text-red-600">
//                   {Number(discount) || 0} ر.س
//                 </span>
//               </p>
//               <p className="mt-1 text-lg font-semibold text-sky-700">
//                 الإجمالي النهائي: {netTotal} ر.س
//               </p>
//             </div>

//             <button
//               onClick={completeSale}
//               className="w-full mt-4 btn btn-secondary"
//             >
//               💰 إتمام البيع
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 📊 مودال تقرير الوردية */}
//       {showShiftReport && (
//         <Modal
//           title="تقرير نهاية الوردية"
//           onClose={() => setShowShiftReport(false)}
//         >
//           <div
//             ref={printRef}
//             className="space-y-2 text-sm text-right"
//           >
//             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
//               📊 تقرير الوردية الحالية
//             </h3>
//             <p>
//               <strong>الكاشير:</strong>{' '}
//               {user?.name || '—'}
//             </p>
//             <p>
//               <strong>بداية الوردية:</strong>{' '}
//               {shiftStart.toLocaleTimeString('ar-SA')}
//             </p>
//             <p>
//               <strong>نهاية الوردية:</strong>{' '}
//               {new Date().toLocaleTimeString('ar-SA')}
//             </p>
//             <p>
//               <strong>عدد الفواتير:</strong>{' '}
//               {sales.length}
//             </p>
//             <p>
//               <strong>إجمالي المبيعات:</strong>{' '}
//               {totalSales} ر.س
//             </p>
//             <p>
//               <strong>متوسط الفاتورة:</strong>{' '}
//               {avgSale} ر.س
//             </p>
//           </div>
//           <div className="flex justify-end gap-3 mt-5">
//             <button
//               onClick={handlePrintShiftReport}
//               className="btn btn-secondary"
//             >
//               🖨️ طباعة
//             </button>
//             <button
//               onClick={() => setShowShiftReport(false)}
//               className="btn btn-ghost"
//             >
//               إغلاق
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* 🧾 مودال فاتورة آخر عملية بيع */}
//       {showInvoiceModal && lastInvoice && (
//         <Modal
//           title={`فاتورة رقم ${lastInvoice.invoice_code}`}
//           onClose={() => setShowInvoiceModal(false)}
//         >
//           <div className="space-y-2 text-sm text-right">
//             <p>
//               <strong>العميل:</strong>{' '}
//               {lastInvoice.customer}
//             </p>
//             <p>
//               <strong>الكاشير:</strong>{' '}
//               {lastInvoice.cashier_name || '—'}
//             </p>
//             <p>
//               <strong>التاريخ:</strong>{' '}
//               {new Date(
//                 lastInvoice.date
//               ).toLocaleString('ar-EG')}
//             </p>
//             <table className="w-full mt-2 text-xs border">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th>#</th>
//                   <th>الصنف</th>
//                   <th>الكمية</th>
//                   <th>السعر</th>
//                   <th>الإجمالي</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Array.isArray(lastInvoice.items) &&
//                   lastInvoice.items.map((it, i) => (
//                     <tr key={i}>
//                       <td>{i + 1}</td>
//                       <td>{it.name}</td>
//                       <td>{it.qty}</td>
//                       <td>{it.price}</td>
//                       <td>{it.qty * it.price}</td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//             <div className="mt-2 font-semibold text-right text-emerald-700">
//               الإجمالي النهائي: {lastInvoice.total} ر.س
//             </div>
//           </div>
//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               onClick={handlePrintInvoice}
//               className="btn btn-secondary"
//             >
//               🖨️ طباعة الفاتورة
//             </button>
//             <button
//               onClick={() => setShowInvoiceModal(false)}
//               className="btn btn-ghost"
//             >
//               إغلاق
//             </button>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }
















// // شغال و معتمد
// import { useState, useEffect, useRef } from 'react'
// import { useRouter } from 'next/router'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// const API_BASE = 'http://localhost:5000/api'

// export default function Cashier() {
//   const router = useRouter()

//   // 🔐 المستخدم الحالي (من التخزين)
//   const [user, setUser] = useState({ name: 'كاشير', role: 'cashier' })
//   const [cashierId, setCashierId] = useState(null)

//   // 🧾 حالة الكاشير
//   const [products, setProducts] = useState([])
//   const [cart, setCart] = useState([])
//   const [productId, setProductId] = useState('')
//   const [quantity, setQuantity] = useState(1)
//   const [discount, setDiscount] = useState(0)
//   const [showShiftReport, setShowShiftReport] = useState(false)
//   const [sales, setSales] = useState([])
//   const [shiftStart, setShiftStart] = useState(new Date())

//   // 💸 فاتورة آخر عملية بيع
//   const [lastInvoice, setLastInvoice] = useState(null)
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false)

//   const printRef = useRef(null)

//   // 🔐 حماية الصفحة + تحميل بيانات المستخدم
//   useEffect(() => {
//     const token = localStorage.getItem('pharmacy_token')
//     const u = localStorage.getItem('pharmacy_user')

//     if (!token || !u) {
//       router.replace('/')
//       return
//     }

//     try {
//       const parsed = JSON.parse(u)
//       setUser(parsed)
//       setCashierId(parsed.id)
//     } catch (e) {
//       console.error('Invalid user in localStorage')
//       router.replace('/')
//     }
//   }, [router])

//   // 📦 تحميل المنتجات من الباك إند
//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/products`);

//         const data = await res.json()
//         if (!res.ok) throw new Error(data.message || 'فشل تحميل المنتجات')
//         setProducts(Array.isArray(data) ? data : [])
//       } catch (err) {
//         console.error(err)
//         toast.error('⚠️ فشل الاتصال بالسيرفر لجلب المنتجات')
//       }
//     }
//     loadProducts()
//   }, [])

//   // ⏱️ بداية الوردية
//   useEffect(() => {
//     setShiftStart(new Date())
//   }, [])

//   // 🛒 إضافة منتج إلى الفاتورة
//   const addToCart = () => {
//     if (!productId) return toast.error('يرجى اختيار منتج')

//     const selected = products.find((p) => p.id === Number(productId))
//     if (!selected) return toast.error('المنتج غير موجود')

//     if (quantity <= 0) return toast.error('الكمية يجب أن تكون 1 أو أكثر')

//     const existing = cart.find((item) => item.id === selected.id)

//     if (existing) {
//       setCart((prev) =>
//         prev.map((item) =>
//           item.id === selected.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         )
//       )
//     } else {
//       setCart((prev) => [
//         ...prev,
//         { id: selected.id, name: selected.name, price: Number(selected.price), quantity },
//       ])
//     }

//     setProductId('')
//     setQuantity(1)
//     toast.success('✅ تمت الإضافة للفاتورة')
//   }

//   // 🗑️ حذف منتج من الفاتورة
//   const removeItem = (id) => {
//     setCart((prev) => prev.filter((item) => item.id !== id))
//     toast.success('تم حذف المنتج من الفاتورة')
//   }

//   // 🧮 إجماليات
//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   const netTotal = Math.max(0, total - (Number(discount) || 0))

//   // 💰 إتمام عملية البيع (مع حفظها في قاعدة البيانات + استرجاع الفاتورة)
//   const completeSale = async () => {
//     if (!cashierId) return toast.error('لا يوجد كاشير مسجل، أعد الدخول للنظام')
//     if (cart.length === 0) return toast.error('لا توجد منتجات في الفاتورة')

//     try {
//       const token = localStorage.getItem('pharmacy_token')
//       const payload = {
//         cashier_id: cashierId,
//         customer: 'عميل نقدي',
//         payment: 'cash',
//         discount: Number(discount) || 0,
//         items: cart.map((item) => ({
//           product_id: item.id,
//           qty: item.quantity,
//         })),
//       }

//       const res = await fetch(`${API_BASE}/cashier/sale`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: token ? `Bearer ${token}` : '',
//         },
//         body: JSON.stringify(payload),
//       })

//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message || 'فشل حفظ عملية البيع')

//       // ✅ تحديث ملخص الوردية
//       setSales((prev) => [
//         ...prev,
//         { id: data.sale.id, total: data.sale.total },
//       ])

//       // 🧾 تخزين آخر فاتورة لعرضها وطباعتها
//       setLastInvoice(data.sale)
//       setShowInvoiceModal(true)

//       // 🧹 تصفير الفاتورة
//       setCart([])
//       setDiscount(0)

//       toast.success('✅ تمت عملية البيع بنجاح')
//     } catch (err) {
//       console.error(err)
//       toast.error(err.message || 'حدث خطأ أثناء عملية البيع')
//     }
//   }

//   // 📊 ملخص الوردية
//   const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0)
//   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0

//   // 🧾 إغلاق الوردية
//   const closeShift = () => {
//     if (sales.length === 0) {
//       toast('لا توجد مبيعات في هذه الوردية', { icon: 'ℹ️' })
//       return
//     }
//     setShowShiftReport(true)
//   }

//   // 🖨️ طباعة تقرير الوردية
//   const handlePrintShiftReport = () => {
//     const w = window.open('', '', 'width=800,height=600')
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير نهاية الوردية</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
//             h2 { color: ${theme.colors.primary}; text-align: center; }
//             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
//             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
//             th { background: #f3f4f6; }
//           </style>
//         </head>
//         <body>${printRef.current.innerHTML}</body>
//       </html>
//     `)
//     w.document.close()
//     w.focus()
//     w.print()
//     w.close()
//   }

//   // 🖨️ طباعة الفاتورة الأخيرة
//   const handlePrintInvoice = () => {
//     if (!lastInvoice) return

//     const html = `
//       <html dir="rtl" lang="ar">
//         <head>
//           <meta charset="utf-8" />
//           <title>فاتورة ${lastInvoice.invoice_code}</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
//             h2 { color: ${theme.colors.primary}; text-align: center; margin-bottom: 10px; }
//             p { margin: 4px 0; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; font-size: 13px; }
//             th { background: #f3f4f6; }
//             .total { margin-top: 10px; text-align: left; font-weight: bold; }
//           </style>
//         </head>
//         <body>
//           <h2>صيدلية المعلم</h2>
//           <p>فاتورة رقم: <strong>${lastInvoice.invoice_code}</strong></p>
//           <p>التاريخ: ${new Date(lastInvoice.date).toLocaleString('ar-EG')}</p>
//           <p>العميل: ${lastInvoice.customer}</p>
//           <p>الكاشير: ${lastInvoice.cashier_name || ''}</p>
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>الصنف</th>
//                 <th>الكمية</th>
//                 <th>السعر</th>
//                 <th>الإجمالي</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${lastInvoice.items
//                 .map(
//                   (it, i) =>
//                     `<tr>
//                       <td>${i + 1}</td>
//                       <td>${it.name}</td>
//                       <td>${it.qty}</td>
//                       <td>${it.price}</td>
//                       <td>${it.qty * it.price}</td>
//                     </tr>`
//                 )
//                 .join('')}
//             </tbody>
//           </table>
//           <p class="total">الإجمالي: ${lastInvoice.total} ر.س</p>
//         </body>
//       </html>
//     `

//     const w = window.open('', '_blank', 'width=800,height=700')
//     w.document.open()
//     w.document.write(html)
//     w.document.close()
//     w.focus()
//     w.print()
//     w.close()
//   }

//   return (
//     <Layout user={user} title="نقطة البيع (الكاشير)">
//       <div dir="rtl" className="space-y-6">
//         {/* 💼 ملخص الوردية */}
//         <div className="p-4 card bg-gradient-to-r from-sky-50 to-blue-50">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-700">💼 ملخص الوردية الحالية</h2>
//             <div className="flex gap-2">
//               <button onClick={closeShift} className="btn btn-primary">
//                 🧾 إغلاق الوردية
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
//             <div>
//               <p className="text-gray-500">الكاشير</p>
//               <p className="font-medium text-gray-900">{user?.name || '—'}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">وقت البدء</p>
//               <p className="font-medium text-gray-900">
//                 {shiftStart.toLocaleTimeString('ar-SA')}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-500">عدد الفواتير</p>
//               <p className="font-medium text-gray-900">{sales.length}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">إجمالي المبيعات</p>
//               <p className="font-medium text-green-700">{totalSales} ر.س</p>
//             </div>
//             <div>
//               <p className="text-gray-500">متوسط الفاتورة</p>
//               <p className="font-medium text-blue-700">{avgSale} ر.س</p>
//             </div>
//           </div>
//         </div>

//         {/* 🧾 الفاتورة + إضافة منتجات */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* جدول الفاتورة */}
//           <div className="p-5 card lg:col-span-2">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
//             <table className="w-full text-sm text-right border-t border-gray-100">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">المنتج</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                   <th />
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.length > 0 ? (
//                   cart.map((item, i) => (
//                     <tr key={i} className="border-t hover:bg-gray-50">
//                       <td className="px-3 py-2">{item.name}</td>
//                       <td className="px-3 py-2">{item.quantity}</td>
//                       <td className="px-3 py-2">{item.price} ر.س</td>
//                       <td className="px-3 py-2 font-semibold text-sky-700">
//                         {item.price * item.quantity} ر.س
//                       </td>
//                       <td
//                         className="px-3 py-2 text-red-500 cursor-pointer"
//                         onClick={() => removeItem(item.id)}
//                       >
//                         ✕
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="py-4 text-center text-gray-500">
//                       لا توجد منتجات مضافة بعد
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* فورم إضافة منتج */}
//           <div className="p-5 card">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>

//             <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
//             <select
//               value={productId}
//               onChange={(e) => setProductId(e.target.value)}
//               className="mb-3 select"
//             >
//               <option value="">اختر...</option>
//               {products.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.name} — {p.price} ر.س
//                 </option>
//               ))}
//             </select>

//             <label className="block mb-2 text-sm text-gray-700">الكمية</label>
//             <input
//               type="number"
//               min="1"
//               value={quantity}
//               onChange={(e) => setQuantity(Number(e.target.value) || 1)}
//               className="mb-3 input"
//             />

//             <button onClick={addToCart} className="w-full mb-3 btn btn-primary">
//               ➕ إضافة للفاتورة
//             </button>

//             <label className="block mb-2 text-sm text-gray-700">خصم</label>
//             <input
//               type="number"
//               min="0"
//               value={discount}
//               onChange={(e) => setDiscount(Number(e.target.value) || 0)}
//               className="mb-3 input"
//             />

//             <div className="pt-3 text-sm text-gray-600 border-t">
//               <p>
//                 الإجمالي:{' '}
//                 <span className="font-bold text-gray-900">{total} ر.س</span>
//               </p>
//               <p>
//                 الخصم:{' '}
//                 <span className="text-red-600">
//                   {Number(discount) || 0} ر.س
//                 </span>
//               </p>
//               <p className="mt-1 text-lg font-semibold text-sky-700">
//                 الإجمالي النهائي: {netTotal} ر.س
//               </p>
//             </div>

//             <button
//               onClick={completeSale}
//               className="w-full mt-4 btn btn-secondary"
//             >
//               💰 إتمام البيع
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 📊 مودال تقرير الوردية */}
//       {showShiftReport && (
//         <Modal title="تقرير نهاية الوردية" onClose={() => setShowShiftReport(false)}>
//           <div ref={printRef} className="space-y-2 text-sm text-right">
//             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
//               📊 تقرير الوردية الحالية
//             </h3>
//             <p>
//               <strong>الكاشير:</strong> {user?.name || '—'}
//             </p>
//             <p>
//               <strong>بداية الوردية:</strong>{' '}
//               {shiftStart.toLocaleTimeString('ar-SA')}
//             </p>
//             <p>
//               <strong>نهاية الوردية:</strong>{' '}
//               {new Date().toLocaleTimeString('ar-SA')}
//             </p>
//             <p>
//               <strong>عدد الفواتير:</strong> {sales.length}
//             </p>
//             <p>
//               <strong>إجمالي المبيعات:</strong> {totalSales} ر.س
//             </p>
//             <p>
//               <strong>متوسط الفاتورة:</strong> {avgSale} ر.س
//             </p>
//           </div>
//           <div className="flex justify-end gap-3 mt-5">
//             <button onClick={handlePrintShiftReport} className="btn btn-secondary">
//               🖨️ طباعة
//             </button>
//             <button onClick={() => setShowShiftReport(false)} className="btn btn-ghost">
//               إغلاق
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* 🧾 مودال فاتورة آخر عملية بيع */}
//       {showInvoiceModal && lastInvoice && (
//         <Modal
//           title={`فاتورة رقم ${lastInvoice.invoice_code}`}
//           onClose={() => setShowInvoiceModal(false)}
//         >
//           <div className="space-y-2 text-sm text-right">
//             <p>
//               <strong>العميل:</strong> {lastInvoice.customer}
//             </p>
//             <p>
//               <strong>الكاشير:</strong> {lastInvoice.cashier_name || '—'}
//             </p>
//             <p>
//               <strong>التاريخ:</strong>{' '}
//               {new Date(lastInvoice.date).toLocaleString('ar-EG')}
//             </p>
//             <table className="w-full mt-2 text-xs border">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th>#</th>
//                   <th>الصنف</th>
//                   <th>الكمية</th>
//                   <th>السعر</th>
//                   <th>الإجمالي</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {lastInvoice.items.map((it, i) => (
//                   <tr key={i}>
//                     <td>{i + 1}</td>
//                     <td>{it.name}</td>
//                     <td>{it.qty}</td>
//                     <td>{it.price}</td>
//                     <td>{it.qty * it.price}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="mt-2 font-semibold text-right text-emerald-700">
//               الإجمالي النهائي: {lastInvoice.total} ر.س
//             </div>
//           </div>
//           <div className="flex justify-end gap-3 mt-4">
//             <button onClick={handlePrintInvoice} className="btn btn-secondary">
//               🖨️ طباعة الفاتورة
//             </button>
//             <button
//               onClick={() => setShowInvoiceModal(false)}
//               className="btn btn-ghost"
//             >
//               إغلاق
//             </button>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }












// // pages/cashier.js
// import { useState, useEffect, useRef } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// export default function Cashier() {
//   const [cart, setCart] = useState([])
//   const [product, setProduct] = useState('')
//   const [quantity, setQuantity] = useState(1)
//   const [discount, setDiscount] = useState(0)
//   const [showShiftReport, setShowShiftReport] = useState(false)
//   const [sales, setSales] = useState([])
//   const [shiftStart, setShiftStart] = useState(new Date())
//   const printRef = useRef(null)

//   const productsList = [
//     { id: 1, name: 'باراسيتامول 500mg', price: 15 },
//     { id: 2, name: 'فيتامين سي 1000mg', price: 25 },
//     { id: 3, name: 'أموكسيسيلين 250mg', price: 45 },
//     { id: 4, name: 'ايبوبروفين 400mg', price: 30 },
//   ]


//   useEffect(() => {
//   const token = localStorage.getItem("pharmacy_token")
//   if (!token) {
//     router.replace("/")   // redirect to login
//   }
// }, [])

//   useEffect(() => { setShiftStart(new Date()) }, [])

//   const addToCart = () => {
//     if (!product) return toast.error('يرجى اختيار منتج')
//     const selected = productsList.find((p) => p.name === product)
//     const existing = cart.find((item) => item.name === product)
//     if (existing) {
//       setCart(cart.map((item) => item.name === product ? { ...item, quantity: item.quantity + quantity } : item))
//     } else {
//       setCart([...cart, { ...selected, quantity }])
//     }
//     setProduct(''); setQuantity(1)
//     toast.success('تمت الإضافة للفاتورة')
//   }

//   const removeItem = (name) => {
//     setCart(cart.filter((item) => item.name !== name))
//     toast.success('تم حذف المنتج من الفاتورة')
//   }

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   const netTotal = Math.max(0, total - discount)

//   const completeSale = () => {
//     if (cart.length === 0) return toast.error('لا توجد منتجات في الفاتورة')
//     const newSale = {
//       id: sales.length + 1,
//       date: new Date().toLocaleTimeString('ar-SA'),
//       total: netTotal,
//       items: [...cart],
//     }
//     setSales([...sales, newSale])
//     setCart([]); setDiscount(0)
//     toast.success('تمت عملية البيع')
//   }

//   const closeShift = () => {
//     if (sales.length === 0) {
//       toast('لا توجد مبيعات في هذه الوردية', { icon: 'ℹ️' })
//       return
//     }
//     setShowShiftReport(true)
//   }

//   const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
//   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0

//   const handlePrintShiftReport = () => {
//     const w = window.open('', '', 'width=800,height=600')
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير نهاية الوردية</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
//             h2 { color: ${theme.colors.primary}; text-align: center; }
//             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
//             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
//             th { background: #f3f4f6; }
//           </style>
//         </head>
//         <body>${printRef.current.innerHTML}</body>
//       </html>
//     `)
//     w.document.close(); w.focus(); w.print(); w.close()
//   }

//   return (
//     <Layout user={{ name: 'كاشير أحمد', role: 'cashier' }} title="نقطة البيع (الكاشير)">
//       <div dir="rtl" className="space-y-6">
//         {/* ملخص الوردية */}
//         <div className="p-4 card bg-gradient-to-r from-sky-50 to-blue-50">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-700">💼 ملخص الوردية الحالية</h2>
//             <div className="flex gap-2">
//               <button onClick={closeShift} className="btn btn-primary">🧾 إغلاق الوردية</button>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
//             <div><p className="text-gray-500">الكاشير</p><p className="font-medium text-gray-900">أحمد</p></div>
//             <div><p className="text-gray-500">وقت البدء</p><p className="font-medium text-gray-900">{shiftStart.toLocaleTimeString('ar-SA')}</p></div>
//             <div><p className="text-gray-500">عدد الفواتير</p><p className="font-medium text-gray-900">{sales.length}</p></div>
//             <div><p className="text-gray-500">إجمالي المبيعات</p><p className="font-medium text-green-700">{totalSales} ر.س</p></div>
//             <div><p className="text-gray-500">متوسط الفاتورة</p><p className="font-medium text-blue-700">{avgSale} ر.س</p></div>
//           </div>
//         </div>

//         {/* الأقسام */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* الفاتورة */}
//           <div className="p-5 card lg:col-span-2">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
//             <table className="w-full text-sm text-right border-t border-gray-100">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">المنتج</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                   <th />
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.length > 0 ? cart.map((item, i) => (
//                   <tr key={i} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{item.name}</td>
//                     <td className="px-3 py-2">{item.quantity}</td>
//                     <td className="px-3 py-2">{item.price} ر.س</td>
//                     <td className="px-3 py-2 font-semibold text-sky-700">{item.price * item.quantity} ر.س</td>
//                     <td className="px-3 py-2 text-red-500 cursor-pointer" onClick={() => removeItem(item.name)}>✕</td>
//                   </tr>
//                 )) : (
//                   <tr><td colSpan="5" className="py-4 text-center text-gray-500">لا توجد منتجات مضافة بعد</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* إضافة منتج */}
//           <div className="p-5 card">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>
//             <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
//             <select value={product} onChange={(e) => setProduct(e.target.value)} className="mb-3 select">
//               <option value="">اختر...</option>
//               {productsList.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
//             </select>

//             <label className="block mb-2 text-sm text-gray-700">الكمية</label>
//             <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="mb-3 input" />

//             <button onClick={addToCart} className="w-full mb-3 btn btn-primary">➕ إضافة للفاتورة</button>

//             <label className="block mb-2 text-sm text-gray-700">خصم</label>
//             <input type="number" min="0" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="mb-3 input" />

//             <div className="pt-3 text-sm text-gray-600 border-t">
//               <p>الإجمالي: <span className="font-bold text-gray-900">{total} ر.س</span></p>
//               <p>الخصم: <span className="text-red-600">{discount} ر.س</span></p>
//               <p className="mt-1 text-lg font-semibold text-sky-700">الإجمالي النهائي: {netTotal} ر.س</p>
//             </div>

//             <button onClick={completeSale} className="w-full mt-4 btn btn-secondary">💰 إتمام البيع</button>
//           </div>
//         </div>
//       </div>

//       {/* مودال تقرير نهاية الوردية */}
//       {showShiftReport && (
//         <Modal title="تقرير نهاية الوردية" onClose={() => setShowShiftReport(false)}>
//           <div ref={printRef} className="space-y-2 text-sm text-right">
//             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">📊 تقرير الوردية الحالية</h3>
//             <p><strong>الكاشير:</strong> أحمد</p>
//             <p><strong>بداية الوردية:</strong> {shiftStart.toLocaleTimeString('ar-SA')}</p>
//             <p><strong>نهاية الوردية:</strong> {new Date().toLocaleTimeString('ar-SA')}</p>
//             <p><strong>عدد الفواتير:</strong> {sales.length}</p>
//             <p><strong>إجمالي المبيعات:</strong> {totalSales} ر.س</p>
//             <p><strong>متوسط الفاتورة:</strong> {avgSale} ر.س</p>
//           </div>
//           <div className="flex justify-end gap-3 mt-5">
//             <button onClick={handlePrintShiftReport} className="btn btn-secondary">🖨️ طباعة</button>
//             <button onClick={() => setShowShiftReport(false)} className="btn btn-ghost">إغلاق</button>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }













// import { useState, useEffect, useRef } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// export default function Cashier() {
//   const [cart, setCart] = useState([])
//   const [product, setProduct] = useState('')
//   const [quantity, setQuantity] = useState(1)
//   const [discount, setDiscount] = useState(0)
//   const [showInvoice, setShowInvoice] = useState(false)
//   const [showShiftReport, setShowShiftReport] = useState(false)
//   const [sales, setSales] = useState([])
//   const [shiftStart, setShiftStart] = useState(new Date())
//   const printRef = useRef(null)

//   const productsList = [
//     { id: 1, name: 'باراسيتامول 500mg', price: 15 },
//     { id: 2, name: 'فيتامين سي 1000mg', price: 25 },
//     { id: 3, name: 'أموكسيسيلين 250mg', price: 45 },
//     { id: 4, name: 'ايبوبروفين 400mg', price: 30 },
//   ]

//   useEffect(() => {
//     setShiftStart(new Date())
//   }, [])

//   const addToCart = () => {
//     if (!product) return toast.error('⚠️ يرجى اختيار منتج')

//     const selected = productsList.find((p) => p.name === product)
//     const existing = cart.find((item) => item.name === product)

//     if (existing) {
//       setCart(
//         cart.map((item) =>
//           item.name === product
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         )
//       )
//       toast.success('🔁 تم تحديث الكمية في الفاتورة')
//     } else {
//       setCart([...cart, { ...selected, quantity }])
//       toast.success('🧾 تم إضافة المنتج إلى الفاتورة')
//     }

//     setProduct('')
//     setQuantity(1)
//   }

//   const removeItem = (name) => {
//     setCart(cart.filter((item) => item.name !== name))
//     toast('🗑️ تم حذف المنتج من الفاتورة', { icon: '❌' })
//   }

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   const netTotal = total - discount

//   const completeSale = () => {
//     if (cart.length === 0) return toast.error('⚠️ لا توجد منتجات في الفاتورة')

//     const newSale = {
//       id: sales.length + 1,
//       date: new Date().toLocaleTimeString('ar-SA'),
//       total: netTotal,
//       items: [...cart],
//     }

//     setSales([...sales, newSale])
//     setCart([])
//     setDiscount(0)
//     setShowInvoice(true)
//     toast.success('✅ تم إتمام عملية البيع بنجاح')
//   }

//   const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
//   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0

//   const handlePrintShiftReport = () => {
//     toast.success('🖨️ جاري تحضير تقرير نهاية الوردية...')
//     const w = window.open('', '', 'width=800,height=600')
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير نهاية الوردية</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
//             h2 { color: #0ea5e9; text-align: center; }
//             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
//             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
//             th { background: #f3f4f6; }
//           </style>
//         </head>
//         <body>${printRef.current.innerHTML}</body>
//       </html>
//     `)
//     w.document.close()
//     w.focus()
//     w.print()
//     w.close()
//   }

//   return (
//     <Layout user={{ name: 'الصيدلي محمد', role: 'cashier' }} title="نقطة البيع (الكاشير)">
//       <div dir="rtl" className="space-y-6">
//         {/* 💼 ملخص الوردية */}
//         <div className="p-4 border rounded-lg shadow-sm bg-gradient-to-r from-sky-50 to-blue-50">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-700">
//               💼 ملخص الوردية الحالية
//             </h2>
//             <button
//               onClick={() => setShowShiftReport(true)}
//               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
//             >
//               🧾 تقرير نهاية الوردية
//             </button>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
//             <div>
//               <p className="text-gray-500">الكاشير</p>
//               <p className="font-medium text-gray-900">أحمد</p>
//             </div>
//             <div>
//               <p className="text-gray-500">وقت البدء</p>
//               <p className="font-medium text-gray-900">
//                 {shiftStart.toLocaleTimeString('ar-SA')}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-500">عدد الفواتير</p>
//               <p className="font-medium text-gray-900">{sales.length}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">إجمالي المبيعات</p>
//               <p className="font-medium text-green-700">{totalSales} ر.س</p>
//             </div>
//             <div>
//               <p className="text-gray-500">متوسط الفاتورة</p>
//               <p className="font-medium text-blue-700">{avgSale} ر.س</p>
//             </div>
//           </div>
//         </div>

//         {/* ⚙️ الأقسام */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* الفاتورة */}
//           <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
//             <table className="w-full text-sm text-right border-t border-gray-100">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">المنتج</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.length > 0 ? (
//                   cart.map((item, i) => (
//                     <tr key={i} className="border-t hover:bg-gray-50">
//                       <td className="px-3 py-2">{item.name}</td>
//                       <td className="px-3 py-2">{item.quantity}</td>
//                       <td className="px-3 py-2">{item.price} ر.س</td>
//                       <td className="px-3 py-2 font-semibold text-sky-700">
//                         {item.price * item.quantity} ر.س
//                       </td>
//                       <td
//                         className="py-2 text-red-500 cursor-pointer"
//                         onClick={() => removeItem(item.name)}
//                       >
//                         ✕
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="py-4 text-center text-gray-500">
//                       لا توجد منتجات مضافة بعد
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* إضافة منتج */}
//           <div className="p-5 bg-white border rounded-lg shadow-sm">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>

//             <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
//             <select
//               value={product}
//               onChange={(e) => setProduct(e.target.value)}
//               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
//             >
//               <option value="">اختر...</option>
//               {productsList.map((p) => (
//                 <option key={p.id} value={p.name}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>

//             <label className="block mb-2 text-sm text-gray-700">الكمية</label>
//             <input
//               type="number"
//               value={quantity}
//               min="1"
//               onChange={(e) => setQuantity(Number(e.target.value))}
//               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
//             />

//             <button
//               onClick={addToCart}
//               className="w-full py-2 mb-3 text-white rounded-md shadow bg-sky-500 hover:bg-sky-600"
//             >
//               ➕ إضافة للفاتورة
//             </button>

//             <label className="block mb-2 text-sm text-gray-700">خصم</label>
//             <input
//               type="number"
//               value={discount}
//               min="0"
//               onChange={(e) => setDiscount(Number(e.target.value))}
//               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
//             />

//             <div className="pt-3 text-sm text-gray-600 border-t">
//               <p>
//                 الإجمالي: <span className="font-bold text-gray-900">{total} ر.س</span>
//               </p>
//               <p>
//                 الخصم: <span className="text-red-600">{discount} ر.س</span>
//               </p>
//               <p className="mt-1 text-lg font-semibold text-sky-700">
//                 الإجمالي النهائي: {netTotal} ر.س
//               </p>
//             </div>

//             <button
//               onClick={completeSale}
//               className="w-full mt-4 py-2.5 text-white rounded-md shadow-md bg-green-600 hover:bg-green-700"
//             >
//               💰 إتمام البيع وطباعة الفاتورة
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* نافذة تقرير نهاية الوردية */}
//       {showShiftReport && (
//         <Modal title="تقرير نهاية الوردية" onClose={() => setShowShiftReport(false)}>
//           <div ref={printRef} className="space-y-2 text-sm text-right">
//             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
//               📊 تقرير الوردية الحالية
//             </h3>
//             <p><strong>الكاشير:</strong> أحمد</p>
//             <p><strong>بداية الوردية:</strong> {shiftStart.toLocaleTimeString('ar-SA')}</p>
//             <p><strong>نهاية الوردية:</strong> {new Date().toLocaleTimeString('ar-SA')}</p>
//             <p><strong>عدد الفواتير:</strong> {sales.length}</p>
//             <p><strong>إجمالي المبيعات:</strong> {totalSales} ر.س</p>
//             <p><strong>متوسط الفاتورة:</strong> {avgSale} ر.س</p>
//           </div>
//           <button
//             onClick={handlePrintShiftReport}
//             className="w-full py-2 mt-4 text-white bg-green-600 rounded-md hover:bg-green-700"
//           >
//             🖨️ طباعة التقرير
//           </button>
//         </Modal>
//       )}
//     </Layout>
//   )
// }














// import { useState, useEffect, useRef } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import theme from '../theme'
// import toast from 'react-hot-toast'


// export default function Cashier() {
//   const [cart, setCart] = useState([])
//   const [product, setProduct] = useState('')
//   const [quantity, setQuantity] = useState(1)
//   const [discount, setDiscount] = useState(0)
//   const [showInvoice, setShowInvoice] = useState(false)
//   const [showShiftReport, setShowShiftReport] = useState(false)
//   const [showDailyReport, setShowDailyReport] = useState(false)
//   const [sales, setSales] = useState([])
//   const [shiftStart, setShiftStart] = useState(new Date())
//   const [shiftEnd, setShiftEnd] = useState(null)
//   const printRef = useRef(null)

//   const productsList = [
//     { id: 1, name: 'باراسيتامول 500mg', price: 15 },
//     { id: 2, name: 'فيتامين سي 1000mg', price: 25 },
//     { id: 3, name: 'أموكسيسيلين 250mg', price: 45 },
//     { id: 4, name: 'ايبوبروفين 400mg', price: 30 },
//   ]

//   useEffect(() => {
//     setShiftStart(new Date())
//   }, [])

//   const addToCart = () => {
//     if (!product) return alert('يرجى اختيار منتج')
//     const selected = productsList.find((p) => p.name === product)
//     const existing = cart.find((item) => item.name === product)
//     if (existing) {
//       setCart(
//         cart.map((item) =>
//           item.name === product
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         )
//       )
//     } else {
//       setCart([...cart, { ...selected, quantity }])
//     }
//     setProduct('')
//     setQuantity(1)
//   }

//   const removeItem = (name) => {
//     setCart(cart.filter((item) => item.name !== name))
//   }

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   const netTotal = total - discount

//   const completeSale = () => {
//     if (cart.length === 0) return alert('لا توجد منتجات في الفاتورة')

//     const newSale = {
//       id: sales.length + 1,
//       date: new Date().toLocaleTimeString('ar-SA'),
//       total: netTotal,
//       items: [...cart],
//     }

//     setSales([...sales, newSale])
//     setCart([])
//     setDiscount(0)
//     setShowInvoice(true)
//   }

//   const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
//   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0

//   const handlePrintShiftReport = () => {
//     const w = window.open('', '', 'width=800,height=600')
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير نهاية الوردية</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
//             h2 { color: #0ea5e9; text-align: center; }
//             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
//             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
//             th { background: #f3f4f6; }
//           </style>
//         </head>
//         <body>${printRef.current.innerHTML}</body>
//       </html>
//     `)
//     w.document.close()
//     w.focus()
//     w.print()
//     w.close()
//   }

//   const handleCloseShift = () => {
//     setShiftEnd(new Date())
//     alert('✅ تم إغلاق الوردية بنجاح!')
//   }

//   return (
//     <Layout user={{ name: 'كاشير أحمد' }} title="نقطة البيع (الكاشير)">
//       <div dir="rtl" className="space-y-6">
//         {/* 💼 ملخص الوردية */}
//         <div className="p-4 border rounded-lg shadow-sm bg-gradient-to-r from-sky-50 to-blue-50">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <h2 className="text-lg font-semibold text-gray-700">
//               💼 ملخص الوردية الحالية
//             </h2>
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => setShowDailyReport(true)}
//                 className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700"
//               >
//                 📊 التقرير اليومي
//               </button>
//               <button
//                 onClick={() => setShowShiftReport(true)}
//                 className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
//               >
//                 🧾 تقرير نهاية الوردية
//               </button>
//               <button
//                 onClick={handleCloseShift}
//                 className="px-4 py-2 text-sm text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700"
//               >
//                 🔒 إغلاق الوردية
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
//             <div>
//               <p className="text-gray-500">الكاشير</p>
//               <p className="font-medium text-gray-900">أحمد</p>
//             </div>
//             <div>
//               <p className="text-gray-500">وقت البدء</p>
//               <p className="font-medium text-gray-900">
//                 {shiftStart.toLocaleTimeString('ar-SA')}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-500">وقت الإغلاق</p>
//               <p className="font-medium text-gray-900">
//                 {shiftEnd ? shiftEnd.toLocaleTimeString('ar-SA') : '—'}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-500">عدد الفواتير</p>
//               <p className="font-medium text-gray-900">{sales.length}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">إجمالي المبيعات</p>
//               <p className="font-medium text-green-700">{totalSales} ر.س</p>
//             </div>
//           </div>
//         </div>

//         {/* ⚙️ الأقسام */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* الفاتورة */}
//           <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
//             <table className="w-full text-sm text-right border-t border-gray-100">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">المنتج</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.length > 0 ? (
//                   cart.map((item, i) => (
//                     <tr key={i} className="border-t hover:bg-gray-50">
//                       <td className="px-3 py-2">{item.name}</td>
//                       <td className="px-3 py-2">{item.quantity}</td>
//                       <td className="px-3 py-2">{item.price} ر.س</td>
//                       <td className="px-3 py-2 font-semibold text-sky-700">
//                         {item.price * item.quantity} ر.س
//                       </td>
//                       <td
//                         className="py-2 text-red-500 cursor-pointer"
//                         onClick={() => removeItem(item.name)}
//                       >
//                         ✕
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="py-4 text-center text-gray-500">
//                       لا توجد منتجات مضافة بعد
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* إضافة منتج */}
//           <div className="p-5 bg-white border rounded-lg shadow-sm">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>

//             <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
//             <select
//               value={product}
//               onChange={(e) => setProduct(e.target.value)}
//               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
//             >
//               <option value="">اختر...</option>
//               {productsList.map((p) => (
//                 <option key={p.id} value={p.name}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>

//             <label className="block mb-2 text-sm text-gray-700">الكمية</label>
//             <input
//               type="number"
//               value={quantity}
//               min="1"
//               onChange={(e) => setQuantity(Number(e.target.value))}
//               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
//             />

//             <button
//               onClick={addToCart}
//               className="w-full py-2 mb-3 text-white rounded-md shadow bg-sky-500 hover:bg-sky-600"
//             >
//               ➕ إضافة للفاتورة
//             </button>

//             <label className="block mb-2 text-sm text-gray-700">خصم</label>
//             <input
//               type="number"
//               value={discount}
//               min="0"
//               onChange={(e) => setDiscount(Number(e.target.value))}
//               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
//             />

//             <div className="pt-3 text-sm text-gray-600 border-t">
//               <p>
//                 الإجمالي: <span className="font-bold text-gray-900">{total} ر.س</span>
//               </p>
//               <p>
//                 الخصم: <span className="text-red-600">{discount} ر.س</span>
//               </p>
//               <p className="mt-1 text-lg font-semibold text-sky-700">
//                 الإجمالي النهائي: {netTotal} ر.س
//               </p>
//             </div>

//             <button
//               onClick={completeSale}
//               className="w-full mt-4 py-2.5 text-white rounded-md shadow-md bg-green-600 hover:bg-green-700"
//             >
//               💰 إتمام البيع وطباعة الفاتورة
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* نافذة تقرير نهاية الوردية */}
//       {showShiftReport && (
//         <Modal title="تقرير نهاية الوردية" onClose={() => setShowShiftReport(false)}>
//           <div ref={printRef} className="space-y-2 text-sm text-right">
//             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
//               📊 تقرير الوردية الحالية
//             </h3>
//             <p><strong>الكاشير:</strong> أحمد</p>
//             <p><strong>بداية الوردية:</strong> {shiftStart.toLocaleTimeString('ar-SA')}</p>
//             <p><strong>نهاية الوردية:</strong> {shiftEnd ? shiftEnd.toLocaleTimeString('ar-SA') : new Date().toLocaleTimeString('ar-SA')}</p>
//             <p><strong>عدد الفواتير:</strong> {sales.length}</p>
//             <p><strong>إجمالي المبيعات:</strong> {totalSales} ر.س</p>
//             <p><strong>متوسط الفاتورة:</strong> {avgSale} ر.س</p>
//           </div>
//           <button
//             onClick={handlePrintShiftReport}
//             className="w-full py-2 mt-4 text-white bg-green-600 rounded-md hover:bg-green-700"
//           >
//             🖨️ طباعة التقرير
//           </button>
//         </Modal>
//       )}

//       {/* نافذة التقرير اليومي */}
//       {showDailyReport && (
//         <Modal title="📊 التقرير اليومي" onClose={() => setShowDailyReport(false)}>
//           <div className="space-y-2 text-sm text-gray-700">
//             <p><strong>عدد الفواتير:</strong> {sales.length}</p>
//             <p><strong>إجمالي المبيعات:</strong> {totalSales} ر.س</p>
//             <p><strong>متوسط الفاتورة:</strong> {avgSale} ر.س</p>
//             <p><strong>أكثر منتج مبيعًا:</strong> {sales.length ? sales[sales.length - 1].items[0].name : '—'}</p>
//             <p><strong>تاريخ اليوم:</strong> {new Date().toLocaleDateString('ar-SA')}</p>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }










// import { useState, useEffect, useRef } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import theme from '../theme'

// export default function Cashier() {
//   const [cart, setCart] = useState([])
//   const [product, setProduct] = useState('')
//   const [quantity, setQuantity] = useState(1)
//   const [discount, setDiscount] = useState(0)
//   const [showInvoice, setShowInvoice] = useState(false)
//   const [showShiftReport, setShowShiftReport] = useState(false)
//   const [sales, setSales] = useState([])
//   const [shiftStart, setShiftStart] = useState(new Date())
//   const printRef = useRef(null)

//   const productsList = [
//     { id: 1, name: 'باراسيتامول 500mg', price: 15 },
//     { id: 2, name: 'فيتامين سي 1000mg', price: 25 },
//     { id: 3, name: 'أموكسيسيلين 250mg', price: 45 },
//     { id: 4, name: 'ايبوبروفين 400mg', price: 30 },
//   ]

//   useEffect(() => {
//     setShiftStart(new Date())
//   }, [])

//   const addToCart = () => {
//     if (!product) return alert('يرجى اختيار منتج')
//     const selected = productsList.find((p) => p.name === product)
//     const existing = cart.find((item) => item.name === product)
//     if (existing) {
//       setCart(
//         cart.map((item) =>
//           item.name === product
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         )
//       )
//     } else {
//       setCart([...cart, { ...selected, quantity }])
//     }
//     setProduct('')
//     setQuantity(1)
//   }

//   const removeItem = (name) => {
//     setCart(cart.filter((item) => item.name !== name))
//   }

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   const netTotal = total - discount

//   const completeSale = () => {
//     if (cart.length === 0) return alert('لا توجد منتجات في الفاتورة')

//     const newSale = {
//       id: sales.length + 1,
//       date: new Date().toLocaleTimeString('ar-SA'),
//       total: netTotal,
//       items: [...cart],
//     }

//     setSales([...sales, newSale])
//     setCart([])
//     setDiscount(0)
//     setShowInvoice(true)
//   }

//   const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
//   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0

//   const handlePrintShiftReport = () => {
//     const w = window.open('', '', 'width=800,height=600')
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير نهاية الوردية</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
//             h2 { color: #0ea5e9; text-align: center; }
//             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
//             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
//             th { background: #f3f4f6; }
//           </style>
//         </head>
//         <body>${printRef.current.innerHTML}</body>
//       </html>
//     `)
//     w.document.close()
//     w.focus()
//     w.print()
//     w.close()
//   }

//   return (
//     <Layout user={{ name: 'كاشير أحمد' }} title="نقطة البيع (الكاشير)">
//       <div dir="rtl" className="space-y-6">
//         {/* 💼 ملخص الوردية */}
//         <div className="p-4 border rounded-lg shadow-sm bg-gradient-to-r from-sky-50 to-blue-50">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-700">
//               💼 ملخص الوردية الحالية
//             </h2>
//             <button
//               onClick={() => setShowShiftReport(true)}
//               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
//             >
//               🧾 تقرير نهاية الوردية
//             </button>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
//             <div>
//               <p className="text-gray-500">الكاشير</p>
//               <p className="font-medium text-gray-900">أحمد</p>
//             </div>
//             <div>
//               <p className="text-gray-500">وقت البدء</p>
//               <p className="font-medium text-gray-900">
//                 {shiftStart.toLocaleTimeString('ar-SA')}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-500">عدد الفواتير</p>
//               <p className="font-medium text-gray-900">{sales.length}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">إجمالي المبيعات</p>
//               <p className="font-medium text-green-700">{totalSales} ر.س</p>
//             </div>
//             <div>
//               <p className="text-gray-500">متوسط الفاتورة</p>
//               <p className="font-medium text-blue-700">{avgSale} ر.س</p>
//             </div>
//           </div>
//         </div>

//         {/* ⚙️ الأقسام */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* الفاتورة */}
//           <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
//             <table className="w-full text-sm text-right border-t border-gray-100">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">المنتج</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.length > 0 ? (
//                   cart.map((item, i) => (
//                     <tr key={i} className="border-t hover:bg-gray-50">
//                       <td className="px-3 py-2">{item.name}</td>
//                       <td className="px-3 py-2">{item.quantity}</td>
//                       <td className="px-3 py-2">{item.price} ر.س</td>
//                       <td className="px-3 py-2 font-semibold text-sky-700">
//                         {item.price * item.quantity} ر.س
//                       </td>
//                       <td
//                         className="py-2 text-red-500 cursor-pointer"
//                         onClick={() => removeItem(item.name)}
//                       >
//                         ✕
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="py-4 text-center text-gray-500">
//                       لا توجد منتجات مضافة بعد
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* إضافة منتج */}
//           <div className="p-5 bg-white border rounded-lg shadow-sm">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>

//             <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
//             <select
//               value={product}
//               onChange={(e) => setProduct(e.target.value)}
//               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
//             >
//               <option value="">اختر...</option>
//               {productsList.map((p) => (
//                 <option key={p.id} value={p.name}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>

//             <label className="block mb-2 text-sm text-gray-700">الكمية</label>
//             <input
//               type="number"
//               value={quantity}
//               min="1"
//               onChange={(e) => setQuantity(Number(e.target.value))}
//               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
//             />

//             <button
//               onClick={addToCart}
//               className="w-full py-2 mb-3 text-white rounded-md shadow bg-sky-500 hover:bg-sky-600"
//             >
//               ➕ إضافة للفاتورة
//             </button>

//             <label className="block mb-2 text-sm text-gray-700">خصم</label>
//             <input
//               type="number"
//               value={discount}
//               min="0"
//               onChange={(e) => setDiscount(Number(e.target.value))}
//               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
//             />

//             <div className="pt-3 text-sm text-gray-600 border-t">
//               <p>
//                 الإجمالي: <span className="font-bold text-gray-900">{total} ر.س</span>
//               </p>
//               <p>
//                 الخصم: <span className="text-red-600">{discount} ر.س</span>
//               </p>
//               <p className="mt-1 text-lg font-semibold text-sky-700">
//                 الإجمالي النهائي: {netTotal} ر.س
//               </p>
//             </div>

//             <button
//               onClick={completeSale}
//               className="w-full mt-4 py-2.5 text-white rounded-md shadow-md bg-green-600 hover:bg-green-700"
//             >
//               💰 إتمام البيع وطباعة الفاتورة
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* نافذة تقرير نهاية الوردية */}
//       {showShiftReport && (
//         <Modal title="تقرير نهاية الوردية" onClose={() => setShowShiftReport(false)}>
//           <div ref={printRef} className="space-y-2 text-sm text-right">
//             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
//               📊 تقرير الوردية الحالية
//             </h3>
//             <p><strong>الكاشير:</strong> أحمد</p>
//             <p><strong>بداية الوردية:</strong> {shiftStart.toLocaleTimeString('ar-SA')}</p>
//             <p><strong>نهاية الوردية:</strong> {new Date().toLocaleTimeString('ar-SA')}</p>
//             <p><strong>عدد الفواتير:</strong> {sales.length}</p>
//             <p><strong>إجمالي المبيعات:</strong> {totalSales} ر.س</p>
//             <p><strong>متوسط الفاتورة:</strong> {avgSale} ر.س</p>
//           </div>
//           <button
//             onClick={handlePrintShiftReport}
//             className="w-full py-2 mt-4 text-white bg-green-600 rounded-md hover:bg-green-700"
//           >
//             🖨️ طباعة التقرير
//           </button>
//         </Modal>
//       )}
//     </Layout>
//   )
// }



// import { useState } from 'react'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import Modal from '../components/Modal'

// export default function Cashier() {
//   const [cart, setCart] = useState([])
//   const [product, setProduct] = useState('')
//   const [quantity, setQuantity] = useState(1)
//   const [discount, setDiscount] = useState(0)
//   const [showInvoice, setShowInvoice] = useState(false)
//   const [shiftActive, setShiftActive] = useState(false)
//   const [shiftSummary, setShiftSummary] = useState({
//     totalSales: 0,
//     invoiceCount: 0,
//     cash: 0,
//     card: 0,
//     transfer: 0
//   })

//   // بيانات المنتجات
//   const productsList = [
//     { id: 1, name: 'باراسيتامول 500mg', price: 15 },
//     { id: 2, name: 'فيتامين سي 1000mg', price: 25 },
//     { id: 3, name: 'أموكسيسيلين 250mg', price: 45 },
//     { id: 4, name: 'ايبوبروفين 400mg', price: 30 },
//   ]

//   const addToCart = () => {
//     if (!product) return alert('يرجى اختيار منتج')
//     const selected = productsList.find((p) => p.name === product)
//     const existing = cart.find((item) => item.name === product)
//     if (existing) {
//       setCart(
//         cart.map((item) =>
//           item.name === product
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         )
//       )
//     } else {
//       setCart([...cart, { ...selected, quantity }])
//     }
//     setProduct('')
//     setQuantity(1)
//   }

//   const removeItem = (name) => {
//     setCart(cart.filter((item) => item.name !== name))
//   }

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   const netTotal = total - discount

//   const completeSale = () => {
//     if (cart.length === 0) return alert('لا توجد منتجات في الفاتورة')

//     // تحديث ملخص الوردية
//     if (shiftActive) {
//       setShiftSummary(prev => ({
//         ...prev,
//         totalSales: prev.totalSales + netTotal,
//         invoiceCount: prev.invoiceCount + 1,
//         cash: prev.cash + netTotal
//       }))
//     }

//     setShowInvoice(true)
//   }

//   const startShift = () => {
//     setShiftActive(true)
//     setShiftSummary({
//       totalSales: 0,
//       invoiceCount: 0,
//       cash: 0,
//       card: 0,
//       transfer: 0
//     })
//   }

//   const endShift = () => {
//     alert(
//       `💼 تم إنهاء الوردية\n\nإجمالي المبيعات: ${shiftSummary.totalSales} ر.س\nعدد الفواتير: ${shiftSummary.invoiceCount}`
//     )
//     setShiftActive(false)
//   }

//   return (
//     <Layout user={{ name: 'الكاشير أحمد' }} title="نقطة البيع (الكاشير)">
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* الفاتورة */}
//         <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
//           <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
//           <table className="w-full text-sm text-right border-t border-gray-100">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">المنتج</th>
//                 <th className="px-3 py-2">الكمية</th>
//                 <th className="px-3 py-2">السعر</th>
//                 <th className="px-3 py-2">الإجمالي</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {cart.length > 0 ? (
//                 cart.map((item, i) => (
//                   <tr key={i} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{item.name}</td>
//                     <td className="px-3 py-2">{item.quantity}</td>
//                     <td className="px-3 py-2">{item.price} ر.س</td>
//                     <td className="px-3 py-2 font-semibold text-sky-700">
//                       {item.price * item.quantity} ر.س
//                     </td>
//                     <td
//                       className="py-2 text-red-500 cursor-pointer"
//                       onClick={() => removeItem(item.name)}
//                     >
//                       ✕
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="py-4 text-center text-gray-500">
//                     لا توجد منتجات مضافة بعد
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* إضافة منتج */}
//         <div className="p-5 bg-white border rounded-lg shadow-sm">
//           <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>

//           <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
//           <select
//             value={product}
//             onChange={(e) => setProduct(e.target.value)}
//             className="w-full px-3 py-2 mb-3 border rounded-md focus:ring-2 focus:ring-sky-400"
//           >
//             <option value="">اختر...</option>
//             {productsList.map((p) => (
//               <option key={p.id} value={p.name}>{p.name}</option>
//             ))}
//           </select>

//           <label className="block mb-2 text-sm text-gray-700">الكمية</label>
//           <input
//             type="number"
//             value={quantity}
//             min="1"
//             onChange={(e) => setQuantity(Number(e.target.value))}
//             className="w-full px-3 py-2 mb-3 border rounded-md focus:ring-2 focus:ring-sky-400"
//           />

//           <button
//             onClick={addToCart}
//             className="w-full py-2 mb-3 text-white rounded-md shadow bg-sky-500 hover:bg-sky-600"
//           >
//             ➕ إضافة للفاتورة
//           </button>

//           <label className="block mb-2 text-sm text-gray-700">خصم</label>
//           <input
//             type="number"
//             value={discount}
//             min="0"
//             onChange={(e) => setDiscount(Number(e.target.value))}
//             className="w-full px-3 py-2 mb-3 border rounded-md focus:ring-2 focus:ring-sky-400"
//           />

//           <div className="pt-3 text-sm text-gray-600 border-t">
//             <p>الإجمالي: <span className="font-bold text-gray-900">{total} ر.س</span></p>
//             <p>الخصم: <span className="text-red-600">{discount} ر.س</span></p>
//             <p className="mt-1 text-lg font-semibold text-sky-700">
//               الإجمالي النهائي: {netTotal} ر.س
//             </p>
//           </div>

//           <button
//             onClick={completeSale}
//             className="w-full mt-4 py-2.5 text-white rounded-md shadow-md bg-green-600 hover:bg-green-700"
//           >
//             💰 إتمام البيع وطباعة الفاتورة
//           </button>
//         </div>
//       </div>

//       {/* قسم الوردية */}
//       <div className="p-5 mt-6 bg-white border rounded-lg shadow-sm">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="text-lg font-semibold text-gray-700">ملخص الوردية</h2>
//           {!shiftActive ? (
//             <button
//               onClick={startShift}
//               className="px-4 py-1.5 text-white bg-sky-500 rounded-md hover:bg-sky-600"
//             >
//               ▶️ بدء وردية
//             </button>
//           ) : (
//             <button
//               onClick={endShift}
//               className="px-4 py-1.5 text-white bg-red-500 rounded-md hover:bg-red-600"
//             >
//               ⏹️ إنهاء الوردية
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 md:grid-cols-4">
//           <div>
//             <p>💵 إجمالي المبيعات:</p>
//             <p className="font-semibold text-gray-900">{shiftSummary.totalSales} ر.س</p>
//           </div>
//           <div>
//             <p>🧾 عدد الفواتير:</p>
//             <p className="font-semibold text-gray-900">{shiftSummary.invoiceCount}</p>
//           </div>
//           <div>
//             <p>💰 نقدًا:</p>
//             <p className="font-semibold text-green-700">{shiftSummary.cash} ر.س</p>
//           </div>
//           <div>
//             <p>💳 بطاقة:</p>
//             <p className="font-semibold text-blue-700">{shiftSummary.card} ر.س</p>
//           </div>
//         </div>
//       </div>

//       {/* نافذة الفاتورة */}
//       {showInvoice && (
//         <Modal title="تفاصيل الفاتورة" onClose={() => setShowInvoice(false)}>
//           <div className="space-y-2 text-sm text-right">
//             <p><strong>عدد المنتجات:</strong> {cart.length}</p>
//             <p><strong>إجمالي الفاتورة:</strong> {netTotal} ر.س</p>
//             <p><strong>طريقة الدفع:</strong> نقدًا</p>
//           </div>
//           <button
//             onClick={() => setShowInvoice(false)}
//             className="w-full py-2 mt-4 text-white rounded-md bg-sky-500 hover:bg-sky-600"
//           >
//             إغلاق
//           </button>
//         </Modal>
//       )}
//     </Layout>
//   )
// }
