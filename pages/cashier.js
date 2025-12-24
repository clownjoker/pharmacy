// pages/cashier.js
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import theme from '../theme';
import toast from 'react-hot-toast';
import AuthGuard from '../components/AuthGuard';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function Cashier() {
  const router = useRouter();

  const [user, setUser] = useState({ name: '', role: '' });
  const [cashierId, setCashierId] = useState(null);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);

  const [shiftSummary, setShiftSummary] = useState({
    invoice_count: 0,
    total_sales: 0,
    avg_sale: 0,
  });

  const [shiftStart, setShiftStart] = useState(new Date());

  const [lastInvoice, setLastInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showShiftReport, setShowShiftReport] = useState(false);

  const printRef = useRef(null);

  // تحميل المستخدم + فتح وردية تلقائيًا
  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('pharmacy_token')
        : null;
    const storedUser =
      typeof window !== 'undefined'
        ? localStorage.getItem('pharmacy_user')
        : null;

    if (!token || !storedUser) {
      router.replace('/');
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      let idCandidate =
        parsed.id ??
        parsed.user_id ??
        parsed.userId ??
        parsed.uid ??
        (parsed.user && (parsed.user.id || parsed.user.user_id));

      if (idCandidate != null) {
        const num = Number(idCandidate);
        const realId = Number.isNaN(num) ? idCandidate : num;
        setCashierId(realId);

        // 🔥 فتح وردية تلقائيًا
        fetch(`${API_BASE}/cashier/start-shift`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cashier_id: realId })
        });

      } else {
        console.warn('لم يتم العثور على id داخل كائن المستخدم', parsed);
      }
    } catch (err) {
      console.error('Invalid user in localStorage', err);
      router.replace('/');
    }
  }, [router]);

  // تحميل المنتجات
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'فشل تحميل المنتجات');
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error('⚠️ فشل الاتصال بالسيرفر لجلب المنتجات');
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    setShiftStart(new Date());
  }, []);
  // 📊 تحميل ملخص الوردية من الباك إند
  useEffect(() => {
    if (!cashierId) return;

    const loadShiftSummary = async () => {
      try {
        const res = await fetch(`${API_BASE}/cashier/shift-summary/${cashierId}`);
        const data = await res.json();

        if (data.success) {
          setShiftSummary({
            invoice_count: data.invoice_count,
            total_sales: data.total_sales,
            avg_sale: data.avg_sale,
          });
        }
      } catch (err) {
        console.error("خطأ في تحميل ملخص الوردية:", err);
      }
    };

    loadShiftSummary();
  }, [cashierId]);

  const addToCart = () => {
    if (!productId) {
      toast.error('يرجى اختيار منتج');
      return;
    }

    const selected = products.find((p) => p.id === Number(productId));
    if (!selected) {
      toast.error('المنتج غير موجود');
      return;
    }

    if (quantity <= 0) {
      toast.error('الكمية يجب أن تكون 1 أو أكثر');
      return;
    }

    setCart((prev) => {
      const exists = prev.find((item) => item.id === selected.id);
      if (exists) {
        return prev.map((item) =>
          item.id === selected.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: selected.id,
          name: selected.name,
          price: Number(selected.price),
          quantity,
        },
      ];
    });

    setProductId('');
    setQuantity(1);
    toast.success('✅ تمت الإضافة للفاتورة');
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success('تم حذف المنتج من الفاتورة');
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const netTotal = Math.max(0, total - (Number(discount) || 0));

  const completeSale = async () => {
    if (cart.length === 0) {
      toast.error("لا توجد منتجات في الفاتورة");
      return;
    }

    try {
      const createInvoice = await fetch(`${API_BASE}/cashier/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: cashierId })
      });

      const invData = await createInvoice.json();
      if (!invData.success) {
        toast.error("فشل إنشاء الفاتورة");
        return;
      }

      const invoice_id = invData.invoice_id;

      for (const item of cart) {
        await fetch(`${API_BASE}/cashier/add-item`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoice_id,
            product_id: item.id,
            qty: item.quantity,
            price: item.price
          })
        });
      }

      const checkout = await fetch(`${API_BASE}/cashier/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id,
          method: "cash"
        })
      });

      const checkoutData = await checkout.json();
      if (!checkoutData.success) {
        toast.error("فشل إنهاء الفاتورة");
        return;
      }

      await fetch(`${API_BASE}/cashier/deduct-stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id })
      });

      setLastInvoice({
        invoice_code: invoice_id,
        total: checkoutData.total,
        items: cart,
        customer: "عميل نقدي",
        cashier_name: user?.name,
        date: new Date()
      });

      setShowInvoiceModal(true);
      setCart([]);
      setDiscount(0);
      toast.success("تمت عملية البيع بنجاح");

      // 🔄 تحديث ملخص الوردية بعد البيع
      try {
        const res = await fetch(`${API_BASE}/cashier/shift-summary/${cashierId}`);
        const data = await res.json();
        if (data.success) {
          setShiftSummary({
            invoice_count: data.invoice_count,
            total_sales: data.total_sales,
            avg_sale: data.avg_sale,
          });
        }
      } catch (err) {
        console.error("خطأ في تحديث ملخص الوردية:", err);
      }

    } catch (err) {
      console.error(err);
      toast.error("خطأ أثناء تنفيذ عملية البيع");
    }
  };
  const totalSales = shiftSummary.total_sales;
  const avgSale = shiftSummary.avg_sale;

  // إغلاق الوردية فعليًا
  const handleCloseShift = async () => {
    try {
      const res = await fetch(`${API_BASE}/cashier/close-shift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cashier_id: cashierId })
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "فشل إغلاق الوردية");
        return;
      }

      toast.success("تم إغلاق الوردية بنجاح");

      setShowShiftReport(true);
      setCart([]);

    } catch (err) {
      console.error(err);
      toast.error("خطأ أثناء إغلاق الوردية");
    }
  };

  // طباعة الوردية
  const handlePrintShiftReport = () => {
    const w = window.open('', '', 'width=800,height=600');
    w.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>تقرير نهاية الوردية</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
            h2 { color: ${theme.colors.primary}; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>${printRef.current.innerHTML}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  // طباعة الفاتورة
  const handlePrintInvoice = () => {
    if (!lastInvoice) return;

    const items = Array.isArray(lastInvoice.items) ? lastInvoice.items : [];

    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8" />
          <title>فاتورة ${lastInvoice.invoice_code}</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
            h2 { color: ${theme.colors.primary}; text-align: center; margin-bottom: 10px; }
            p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: center; font-size: 13px; }
            th { background: #f3f4f6; }
            .total { margin-top: 10px; text-align: left; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>صيدلية المعلم</h2>
          <p>فاتورة رقم: <strong>${lastInvoice.invoice_code}</strong></p>
          <p>التاريخ: ${new Date(lastInvoice.date).toLocaleString('ar-EG')}</p>
          <p>العميل: ${lastInvoice.customer}</p>
          <p>الكاشير: ${lastInvoice.cashier_name || ''}</p>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>الصنف</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (it, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${it.name}</td>
                    <td>${it.qty}</td>
                    <td>${it.price}</td>
                    <td>${it.qty * it.price}</td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>

          <p class="total">الإجمالي النهائي: ${lastInvoice.total} ر.س</p>
        </body>
      </html>
    `;

    const w = window.open('', '_blank', 'width=800,height=700');
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };
  return (
    <AuthGuard allowedRoles={["cashier"]}>
    <Layout title="نقطة البيع (الكاشير)">
      <div dir="rtl" className="space-y-6">
        
        {/* 💼 ملخص الوردية */}
        <div className="p-4 card bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">
              💼 ملخص الوردية الحالية
            </h2>
            <div className="flex gap-2">
              <button onClick={handleCloseShift} className="btn btn-primary">
                🧾 إغلاق الوردية
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
            <div>
              <p className="text-gray-500">الكاشير</p>
              <p className="font-medium text-gray-900">{user?.name || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500">وقت البدء</p>
              <p className="font-medium text-gray-900">
                {shiftStart.toLocaleTimeString('ar-SA')}
              </p>
            </div>
            <div>
              <p className="text-gray-500">عدد الفواتير</p>
              <p className="font-medium text-gray-900">
                {shiftSummary.invoice_count}
              </p>
            </div>
            <div>
              <p className="text-gray-500">إجمالي المبيعات</p>
              <p className="font-medium text-green-700">
                {shiftSummary.total_sales} ر.س
              </p>
            </div>
            <div>
              <p className="text-gray-500">متوسط الفاتورة</p>
              <p className="font-medium text-blue-700">
                {shiftSummary.avg_sale} ر.س
              </p>
            </div>
          </div>
        </div>

        {/* 🧾 الفاتورة + إضافة منتجات */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* جدول الفاتورة */}
          <div className="p-5 card lg:col-span-2">
            <h2 className="mb-3 text-lg font-semibold text-gray-700">
              المنتجات المضافة
            </h2>

            <table className="w-full text-sm text-right border-t border-gray-100">
              <thead className="text-gray-600 bg-gray-50">
                <tr>
                  <th className="px-3 py-2">المنتج</th>
                  <th className="px-3 py-2">الكمية</th>
                  <th className="px-3 py-2">السعر</th>
                  <th className="px-3 py-2">الإجمالي</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 ? (
                  cart.map((item, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2">{item.name}</td>
                      <td className="px-3 py-2">{item.quantity}</td>
                      <td className="px-3 py-2">{item.price} ر.س</td>
                      <td className="px-3 py-2 font-semibold text-sky-700">
                        {item.price * item.quantity} ر.س
                      </td>
                      <td
                        className="px-3 py-2 text-red-500 cursor-pointer"
                        onClick={() => removeItem(item.id)}
                      >
                        ✕
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-4 text-center text-gray-500"
                    >
                      لا توجد منتجات مضافة بعد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* إضافة منتج */}
          <div className="p-5 card">
            <h2 className="mb-3 text-lg font-semibold text-gray-700">
              إضافة منتج
            </h2>

            <label className="block mb-2 text-sm text-gray-700">
              اختر المنتج
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mb-3 select"
            >
              <option value="">اختر...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.price} ر.س
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm text-gray-700">الكمية</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Number(e.target.value) || 1)
              }
              className="mb-3 input"
            />

            <button
              onClick={addToCart}
              className="w-full mb-3 btn btn-primary"
            >
              ➕ إضافة للفاتورة
            </button>

            <label className="block mb-2 text-sm text-gray-700">خصم</label>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) =>
                setDiscount(Number(e.target.value) || 0)
              }
              className="mb-3 input"
            />

            <div className="pt-3 text-sm text-gray-600 border-t">
              <p>
                الإجمالي:{' '}
                <span className="font-bold text-gray-900">
                  {total} ر.س
                </span>
              </p>
              <p>
                الخصم:{' '}
                <span className="text-red-600">
                  {Number(discount) || 0} ر.س
                </span>
              </p>
              <p className="mt-1 text-lg font-semibold text-sky-700">
                الإجمالي النهائي: {netTotal} ر.س
              </p>
            </div>

            <button
              onClick={completeSale}
              className="w-full mt-4 btn btn-secondary"
            >
              💰 إتمام البيع
            </button>
          </div>
        </div>
      </div>

      {/* مودال تقرير الوردية */}
      {showShiftReport && (
        <Modal
          title="تقرير نهاية الوردية"
          onClose={() => setShowShiftReport(false)}
        >
          <div ref={printRef} className="space-y-2 text-sm text-right">
            <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
              📊 تقرير الوردية الحالية
            </h3>
            <p>
              <strong>الكاشير:</strong> {user?.name || '—'}
            </p>
            <p>
              <strong>بداية الوردية:</strong>{' '}
              {shiftStart.toLocaleTimeString('ar-SA')}
            </p>
            <p>
              <strong>عدد الفواتير:</strong> {shiftSummary.invoice_count}
            </p>
            <p>
              <strong>إجمالي المبيعات:</strong> {shiftSummary.total_sales} ر.س
            </p>
            <p>
              <strong>متوسط الفاتورة:</strong> {shiftSummary.avg_sale} ر.س
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={handlePrintShiftReport}
              className="btn btn-secondary"
            >
              🖨️ طباعة
            </button>
            <button
              onClick={() => setShowShiftReport(false)}
              className="btn btn-ghost"
            >
              إغلاق
            </button>
          </div>
        </Modal>
      )}

      {/* مودال الفاتورة */}
      {showInvoiceModal && lastInvoice && (
        <Modal
          title={`فاتورة رقم ${lastInvoice.invoice_code}`}
          onClose={() => setShowInvoiceModal(false)}
        >
          <div className="space-y-2 text-sm text-right">
            <p><strong>العميل:</strong> {lastInvoice.customer}</p>
            <p><strong>الكاشير:</strong> {lastInvoice.cashier_name || '—'}</p>
            <p><strong>التاريخ:</strong> {new Date(lastInvoice.date).toLocaleString('ar-EG')}</p>

            <table className="w-full mt-2 text-xs border">
              <thead className="bg-gray-50">
                <tr>
                  <th>#</th>
                  <th>الصنف</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                  <th>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {lastInvoice.items.map((it, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{it.name}</td>
                    <td>{it.qty}</td>
                    <td>{it.price}</td>
                    <td>{it.qty * it.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-2 font-semibold text-right text-emerald-700">
              الإجمالي النهائي: {lastInvoice.total} ر.س
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={handlePrintInvoice} className="btn btn-secondary">
              🖨️ طباعة الفاتورة
            </button>
            <button onClick={() => setShowInvoiceModal(false)} className="btn btn-ghost">
              إغلاق
            </button>
          </div>
        </Modal>
      )}
    </Layout>
    </AuthGuard>
  );
}



















// // pages/cashier.js
// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/router';
// import Layout from '../components/Layout';
// import Modal from '../components/Modal';
// import theme from '../theme';
// import toast from 'react-hot-toast';

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// export default function Cashier() {
//   const router = useRouter();

//   const [user, setUser] = useState({ name: '', role: '' });
//   const [cashierId, setCashierId] = useState(null);

//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [productId, setProductId] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [discount, setDiscount] = useState(0);

//   const [sales, setSales] = useState([]);
//   const [shiftStart, setShiftStart] = useState(new Date());

//   // 🔥 ملخص الوردية من الباك إند
//   const [shiftSummary, setShiftSummary] = useState({
//     invoice_count: 0,
//     total_sales: 0,
//     avg_sale: 0,
//   });

//   const [lastInvoice, setLastInvoice] = useState(null);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [showShiftReport, setShowShiftReport] = useState(false);

//   const printRef = useRef(null);

//   useEffect(() => {
//     const token =
//       typeof window !== 'undefined'
//         ? localStorage.getItem('pharmacy_token')
//         : null;
//     const storedUser =
//       typeof window !== 'undefined'
//         ? localStorage.getItem('pharmacy_user')
//         : null;

//     if (!token || !storedUser) {
//       router.replace('/');
//       return;
//     }

//     try {
//       const parsed = JSON.parse(storedUser);
//       setUser(parsed);

//       let idCandidate =
//         parsed.id ??
//         parsed.user_id ??
//         parsed.userId ??
//         parsed.uid ??
//         (parsed.user && (parsed.user.id || parsed.user.user_id));

//       if (idCandidate != null) {
//         const num = Number(idCandidate);
//         setCashierId(Number.isNaN(num) ? idCandidate : num);
//       } else {
//         console.warn('لم يتم العثور على id داخل كائن المستخدم', parsed);
//       }
//     } catch (err) {
//       console.error('Invalid user in localStorage', err);
//       router.replace('/');
//     }
//   }, [router]);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/products`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || 'فشل تحميل المنتجات');
//         setProducts(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error(err);
//         toast.error('⚠️ فشل الاتصال بالسيرفر لجلب المنتجات');
//       }
//     };
//     loadProducts();
//   }, []);

//   useEffect(() => {
//     setShiftStart(new Date());
//   }, []);
//   // 📊 تحميل ملخص الوردية
//   useEffect(() => {
//     if (!cashierId) return;

//     const loadShiftSummary = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/cashier/shift-summary/${cashierId}`);
//         const data = await res.json();

//         if (data.success) {
//           setShiftSummary({
//             invoice_count: data.invoice_count,
//             total_sales: data.total_sales,
//             avg_sale: data.avg_sale,
//           });
//         }
//       } catch (err) {
//         console.error("خطأ في تحميل ملخص الوردية:", err);
//       }
//     };

//     loadShiftSummary();
//   }, [cashierId]);

//   const addToCart = () => {
//     if (!productId) {
//       toast.error('يرجى اختيار منتج');
//       return;
//     }

//     const selected = products.find((p) => p.id === Number(productId));
//     if (!selected) {
//       toast.error('المنتج غير موجود');
//       return;
//     }

//     if (quantity <= 0) {
//       toast.error('الكمية يجب أن تكون 1 أو أكثر');
//       return;
//     }

//     setCart((prev) => {
//       const exists = prev.find((item) => item.id === selected.id);
//       if (exists) {
//         return prev.map((item) =>
//           item.id === selected.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       }
//       return [
//         ...prev,
//         {
//           id: selected.id,
//           name: selected.name,
//           price: Number(selected.price),
//           quantity,
//         },
//       ];
//     });

//     setProductId('');
//     setQuantity(1);
//     toast.success('✅ تمت الإضافة للفاتورة');
//   };

//   const removeItem = (id) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//     toast.success('تم حذف المنتج من الفاتورة');
//   };

//   const total = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );
//   const netTotal = Math.max(0, total - (Number(discount) || 0));

//   const completeSale = async () => {
//     if (cart.length === 0) {
//       toast.error("لا توجد منتجات في الفاتورة");
//       return;
//     }

//     try {
//       const createInvoice = await fetch(`${API_BASE}/cashier/new`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id: cashierId })
//       });

//       const invData = await createInvoice.json();
//       if (!invData.success) {
//         toast.error("فشل إنشاء الفاتورة");
//         return;
//       }

//       const invoice_id = invData.invoice_id;

//       for (const item of cart) {
//         await fetch(`${API_BASE}/cashier/add-item`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             invoice_id,
//             product_id: item.id,
//             qty: item.quantity,
//             price: item.price
//           })
//         });
//       }

//       const checkout = await fetch(`${API_BASE}/cashier/checkout`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           invoice_id,
//           method: "cash"
//         })
//       });

//       const checkoutData = await checkout.json();
//       if (!checkoutData.success) {
//         toast.error("فشل إنهاء الفاتورة");
//         return;
//       }

//       await fetch(`${API_BASE}/cashier/deduct-stock`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ invoice_id })
//       });

//       setLastInvoice({
//         invoice_code: invoice_id,
//         total: checkoutData.total,
//         items: cart,
//         customer: "عميل نقدي",
//         cashier_name: user?.name,
//         date: new Date()
//       });

//       setShowInvoiceModal(true);
//       setCart([]);
//       setDiscount(0);
//       toast.success("تمت عملية البيع بنجاح");

//       // 🔄 تحديث ملخص الوردية بعد البيع
//       try {
//         const res = await fetch(`${API_BASE}/cashier/shift-summary/${cashierId}`);
//         const data = await res.json();
//         if (data.success) {
//           setShiftSummary({
//             invoice_count: data.invoice_count,
//             total_sales: data.total_sales,
//             avg_sale: data.avg_sale,
//           });
//         }
//       } catch (err) {
//         console.error("خطأ في تحديث ملخص الوردية:", err);
//       }

//     } catch (err) {
//       console.error(err);
//       toast.error("خطأ أثناء تنفيذ عملية البيع");
//     }
//   };
//   const totalSales = shiftSummary.total_sales;
//   const avgSale = shiftSummary.avg_sale;

//   const closeShift = () => {
//     if (shiftSummary.invoice_count === 0) {
//       toast('لا توجد مبيعات في هذه الوردية', { icon: 'ℹ️' });
//       return;
//     }
//     setShowShiftReport(true);
//   };

//   const handlePrintInvoice = () => {
//   if (!lastInvoice) return;

//   const items = Array.isArray(lastInvoice.items) ? lastInvoice.items : [];

//   const html = `
//     <html dir="rtl" lang="ar">
//       <head>
//         <meta charset="utf-8" />
//         <title>فاتورة ${lastInvoice.invoice_code}</title>
//         <style>
//           body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
//           h2 { color: ${theme.colors.primary}; text-align: center; margin-bottom: 10px; }
//           p { margin: 4px 0; }
//           table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//           th, td { border: 1px solid #ccc; padding: 6px; text-align: center; font-size: 13px; }
//           th { background: #f3f4f6; }
//           .total { margin-top: 10px; text-align: left; font-weight: bold; }
//         </style>
//       </head>
//       <body>
//         <h2>صيدلية المعلم</h2>
//         <p>فاتورة رقم: <strong>${lastInvoice.invoice_code}</strong></p>
//         <p>التاريخ: ${new Date(lastInvoice.date).toLocaleString('ar-EG')}</p>
//         <p>العميل: ${lastInvoice.customer}</p>
//         <p>الكاشير: ${lastInvoice.cashier_name || ''}</p>

//         <table>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>الصنف</th>
//               <th>الكمية</th>
//               <th>السعر</th>
//               <th>الإجمالي</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${items
//               .map(
//                 (it, i) => `
//                 <tr>
//                   <td>${i + 1}</td>
//                   <td>${it.name}</td>
//                   <td>${it.qty}</td>
//                   <td>${it.price}</td>
//                   <td>${it.qty * it.price}</td>
//                 </tr>`
//               )
//               .join('')}
//           </tbody>
//         </table>

//         <p class="total">الإجمالي النهائي: ${lastInvoice.total} ر.س</p>
//       </body>
//     </html>
//   `;

//   const w = window.open('', '_blank', 'width=800,height=700');
//   w.document.open();
//   w.document.write(html);
//   w.document.close();
//   w.focus();
//   w.print();
//   w.close();
// };

// const handleCloseShift = async () => {
//   try {
//     const res = await fetch(`${API_BASE}/cashier/close-shift`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ cashier_id: cashierId })
//     });

//     const data = await res.json();

//     if (!data.success) {
//       toast.error(data.message || "فشل إغلاق الوردية");
//       return;
//     }

//     toast.success("تم إغلاق الوردية بنجاح");

//     // عرض تقرير الوردية
//     setShowShiftReport(true);

//     // منع البيع بعد الإغلاق
//     setCart([]);
//   } catch (err) {
//     console.error(err);
//     toast.error("خطأ أثناء إغلاق الوردية");
//   }
// };


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
//               <button onClick={handleCloseShift} className="btn btn-primary">
//                🧾 إغلاق الوردية
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
//               <p className="font-medium text-gray-900">
//                 {shiftSummary.invoice_count}
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

//             <label className="block mb-2 text-sm text-gray-700">الكمية</label>
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

//             <label className="block mb-2 text-sm text-gray-700">خصم</label>
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
//               <strong>عدد الفواتير:</strong>{' '}
//               {shiftSummary.invoice_count}
//             </p>
//             <p>
//               <strong>إجمالي المبيعات:</strong> {totalSales} ر.س
//             </p>
//             <p>
//               <strong>متوسط الفاتورة:</strong> {avgSale} ر.س
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
//               <strong>العميل:</strong> {lastInvoice.customer}
//             </p>
//             <p>
//               <strong>الكاشير:</strong>{' '}
//               {lastInvoice.cashier_name || '—'}
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
//   );
// }
