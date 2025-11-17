import { useState } from "react";
import Layout from "../components/Layout";
import { mockMedicines } from "../mock/data";

export default function PharmacistPage() {
  const [user] = useState({ name: "محمد", role: "pharmacist" });
  const [medicines, setMedicines] = useState(mockMedicines);
  const [search, setSearch] = useState("");

  const filtered = medicines.filter(
    (m) =>
      m.name.includes(search) ||
      m.category.includes(search)
  );

  return (
    <Layout user={user} title="💊 إدارة الأدوية">
      <div dir="rtl" className="space-y-6">

        {/* البحث */}
        <input
          type="text"
          placeholder="🔍 بحث عن دواء"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* جدول الأدوية */}
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
          <table className="w-full min-w-[800px] text-sm text-right">
            <thead className="text-gray-600 bg-gray-50">
              <tr>
                <th className="px-3 py-2">اسم الدواء</th>
                <th className="px-3 py-2">الكمية</th>
                <th className="px-3 py-2">السعر</th>
                <th className="px-3 py-2">التصنيف</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 font-semibold">{m.name}</td>
                  <td className="px-3 py-2">{m.qty}</td>
                  <td className="px-3 py-2">{m.price} ر.س</td>
                  <td className="px-3 py-2">{m.category}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </Layout>
  );
}
















// // pages/pharmacist.js
// import { useState, useEffect, useMemo, useRef } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// export default function Pharmacist() {
//   const [user] = useState({ name: 'الصيدلي محمد', role: 'pharmacist' })
//   const [medicines, setMedicines] = useState([])
//   const [search, setSearch] = useState('')
//   const [adv, setAdv] = useState({ company: '', minQty: '', maxQty: '', minPrice: '', maxPrice: '', expiryBefore: '' })
//   const [sales, setSales] = useState([])
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showSalesReport, setShowSalesReport] = useState(false)
//   const reportRef = useRef(null)

//   const [newMedicine, setNewMedicine] = useState({ name: '', company: '', price: '', quantity: '', expiry: '' })

//   useEffect(() => {
//   const token = localStorage.getItem("pharmacy_token")
//   if (!token) {
//     router.replace("/")   // redirect to login
//   }
// }, [])


//   useEffect(() => {
//     const mock = [
//       { id: 1, name: 'باراسيتامول 500mg', company: 'GSK', price: 15, quantity: 10, expiry: '2025-12-10' },
//       { id: 2, name: 'أموكسيسيلين 250mg', company: 'Pfizer', price: 25, quantity: 3, expiry: '2024-06-02' },
//       { id: 3, name: 'ايبوبروفين 400mg', company: 'Novartis', price: 18, quantity: 2, expiry: '2023-12-30' },
//       { id: 4, name: 'فيتامين د 1000IU', company: 'GSK', price: 22, quantity: 20, expiry: '2026-03-15' },
//     ]
//     setMedicines(mock)

//     setSales([
//       { id: 1, date: '2025-11-02', name: 'باراسيتامول 500mg', qty: 5, price: 15 },
//       { id: 2, date: '2025-11-02', name: 'فيتامين سي 1000mg', qty: 2, price: 25 },
//       { id: 3, date: '2025-11-01', name: 'أموكسيسيلين 250mg', qty: 3, price: 45 },
//     ])
//   }, [])

//   const filtered = useMemo(() => {
//     return medicines.filter((m) => {
//       const txt = (m.name + ' ' + m.company).toLowerCase().includes(search.toLowerCase())
//       if (!txt) return false
//       if (adv.company && m.company !== adv.company) return false
//       if (adv.minQty && m.quantity < Number(adv.minQty)) return false
//       if (adv.maxQty && m.quantity > Number(adv.maxQty)) return false
//       if (adv.minPrice && m.price < Number(adv.minPrice)) return false
//       if (adv.maxPrice && m.price > Number(adv.maxPrice)) return false
//       if (adv.expiryBefore && new Date(m.expiry) > new Date(adv.expiryBefore)) return false
//       return true
//     })
//   }, [medicines, search, adv])

//   const sell = (m) => {
//     const qty = Number(prompt(`كمية البيع من "${m.name}"؟`, 1) || 0)
//     if (!qty || qty < 1) return
//     if (qty > m.quantity) return toast.error('الكمية غير متاحة')
//     // خصم من المخزون
//     setMedicines(prev => prev.map(x => x.id === m.id ? { ...x, quantity: x.quantity - qty } : x))
//     // إضافة إلى مبيعات الصيدلي
//     const today = new Date().toISOString().slice(0, 10)
//     const sale = { id: Date.now(), date: today, name: m.name, qty, price: m.price }
//     setSales(prev => [sale, ...prev])
//     toast.success('تم تسجيل عملية البيع')
//   }

//   const addMedicine = () => {
//     const { name, company, price, quantity, expiry } = newMedicine
//     if (!name || !company || !price || !quantity || !expiry) {
//       toast.error('أكمل جميع الحقول')
//       return
//     }
//     setMedicines(prev => [{ id: Date.now(), name, company, price: Number(price), quantity: Number(quantity), expiry }, ...prev])
//     setNewMedicine({ name: '', company: '', price: '', quantity: '', expiry: '' })
//     setShowAddModal(false)
//     toast.success('تمت إضافة الدواء')
//   }

//   const todayTotal = sales
//     .filter((s) => s.date === new Date().toISOString().slice(0, 10))
//     .reduce((sum, s) => sum + s.qty * s.price, 0)

//   const printReport = () => {
//     const w = window.open('', '', 'width=900,height=700')
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير مبيعات الصيدلي</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
//             h2 { color: ${theme.colors.primary}; text-align: center; }
//             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
//             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
//             th { background: #f3f4f6; }
//           </style>
//         </head>
//         <body>${reportRef.current.innerHTML}</body>
//       </html>
//     `)
//     w.document.close(); w.focus(); w.print(); w.close()
//   }

//   return (
//     <Layout user={user} title="لوحة الصيدلي">
//       <div dir="rtl" className="space-y-6">
//         {/* شريط التحكم */}
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <input
//             type="text"
//             placeholder="🔍 ابحث باسم الدواء أو الشركة..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="flex-1 input"
//           />
//           <div className="flex gap-2">
//             <button onClick={() => setShowAddModal(true)} className="btn btn-primary">➕ إضافة دواء</button>
//             <button onClick={() => setShowSalesReport(true)} className="btn btn-secondary">📊 تقرير المبيعات</button>
//           </div>
//         </div>

//         {/* فلترة متقدمة */}
//         <div className="p-4 card">
//           <h4 className="mb-3 font-semibold text-gray-700">فلترة متقدمة</h4>
//           <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
//             <input className="input" placeholder="الشركة" value={adv.company} onChange={(e) => setAdv({ ...adv, company: e.target.value })} />
//             <input className="input" placeholder="كمية من" type="number" value={adv.minQty} onChange={(e) => setAdv({ ...adv, minQty: e.target.value })} />
//             <input className="input" placeholder="كمية إلى" type="number" value={adv.maxQty} onChange={(e) => setAdv({ ...adv, maxQty: e.target.value })} />
//             <input className="input" placeholder="سعر من" type="number" value={adv.minPrice} onChange={(e) => setAdv({ ...adv, minPrice: e.target.value })} />
//             <input className="input" placeholder="سعر إلى" type="number" value={adv.maxPrice} onChange={(e) => setAdv({ ...adv, maxPrice: e.target.value })} />
//             <input className="input" placeholder="تنتهي قبل تاريخ" type="date" value={adv.expiryBefore} onChange={(e) => setAdv({ ...adv, expiryBefore: e.target.value })} />
//           </div>
//           <div className="flex justify-end gap-2 mt-3">
//             <button onClick={() => setAdv({ company: '', minQty: '', maxQty: '', minPrice: '', maxPrice: '', expiryBefore: '' })} className="btn btn-ghost">مسح</button>
//             <button onClick={() => toast('تم تطبيق الفلاتر 👍')} className="btn btn-primary">تطبيق</button>
//           </div>
//         </div>

//         {/* جدول الأدوية */}
//         <div className="p-4 card">
//           <h3 className="mb-3 text-lg font-semibold text-gray-700">قائمة الأدوية</h3>
//           <table className="w-full text-sm text-right border-t border-gray-100">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">اسم الدواء</th>
//                 <th className="px-3 py-2">الشركة</th>
//                 <th className="px-3 py-2">السعر</th>
//                 <th className="px-3 py-2">الكمية</th>
//                 <th className="px-3 py-2">الانتهاء</th>
//                 <th className="px-3 py-2">إجراء</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((m) => (
//                 <tr key={m.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{m.name}</td>
//                   <td className="px-3 py-2">{m.company}</td>
//                   <td className="px-3 py-2">{m.price} ر.س</td>
//                   <td className={`px-3 py-2 ${m.quantity <= 5 ? 'text-red-600' : 'text-green-700'}`}>{m.quantity}</td>
//                   <td className={`${new Date(m.expiry) < new Date() ? 'text-red-600' : ''} px-3 py-2`}>{m.expiry}</td>
//                   <td className="px-3 py-2">
//                     <button onClick={() => sell(m)} className="px-3 py-1.5 rounded border border-emerald-100 text-emerald-700 hover:bg-emerald-50">بيع</button>
//                   </td>
//                 </tr>
//               ))}
//               {filtered.length === 0 && (
//                 <tr><td colSpan="6" className="py-6 text-center text-gray-500">لا توجد نتائج مطابقة</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* مودال إضافة دواء */}
//       {showAddModal && (
//         <Modal title="إضافة دواء جديد" onClose={() => setShowAddModal(false)}>
//           <div className="text-right">
//             <label className="block mb-1 text-sm">اسم الدواء</label>
//             <input className="mb-2 input" value={newMedicine.name} onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })} />

//             <label className="block mb-1 text-sm">الشركة</label>
//             <input className="mb-2 input" value={newMedicine.company} onChange={(e) => setNewMedicine({ ...newMedicine, company: e.target.value })} />

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block mb-1 text-sm">السعر</label>
//                 <input className="input" type="number" value={newMedicine.price} onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })} />
//               </div>
//               <div>
//                 <label className="block mb-1 text-sm">الكمية</label>
//                 <input className="input" type="number" value={newMedicine.quantity} onChange={(e) => setNewMedicine({ ...newMedicine, quantity: e.target.value })} />
//               </div>
//             </div>

//             <label className="block mt-2 mb-1 text-sm">تاريخ الانتهاء</label>
//             <input className="mb-4 input" type="date" value={newMedicine.expiry} onChange={(e) => setNewMedicine({ ...newMedicine, expiry: e.target.value })} />

//             <div className="flex justify-end gap-3">
//               <button onClick={addMedicine} className="btn btn-secondary">حفظ</button>
//               <button onClick={() => setShowAddModal(false)} className="btn btn-ghost">إلغاء</button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* مودال تقرير المبيعات */}
//       {showSalesReport && (
//         <Modal title="تقرير مبيعات الصيدلي" onClose={() => setShowSalesReport(false)} width="max-w-3xl">
//           <div ref={reportRef} className="space-y-2 text-sm text-gray-700">
//             <h3 className="mb-3 text-lg font-semibold text-center text-sky-700">💊 تقرير المبيعات اليومية</h3>
//             <table className="w-full text-sm text-right border border-gray-200">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">التاريخ</th>
//                   <th className="px-3 py-2">اسم الدواء</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sales.map((s) => (
//                   <tr key={s.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{s.date}</td>
//                     <td className="px-3 py-2">{s.name}</td>
//                     <td className="px-3 py-2">{s.qty}</td>
//                     <td className="px-3 py-2">{s.price} ر.س</td>
//                     <td className="px-3 py-2 font-semibold text-sky-700">{(s.qty * s.price).toFixed(2)} ر.س</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="mt-4 font-semibold text-center text-green-700">
//               🧾 إجمالي مبيعات اليوم: {todayTotal.toFixed(2)} ر.س
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 mt-5">
//             <button onClick={printReport} className="btn btn-secondary">🖨️ طباعة</button>
//             <button onClick={() => setShowSalesReport(false)} className="btn btn-ghost">إغلاق</button>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }














// // pages/pharmacist.js
// import { useEffect, useMemo, useRef, useState } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// export default function Pharmacist() {
//   const [user] = useState({ name: 'الصيدلي محمد', role: 'pharmacist' })
//   const [activeTab, setActiveTab] = useState('medicines')

//   const [medicines, setMedicines] = useState([])
//   const [search, setSearch] = useState('')
//   const [companyFilter, setCompanyFilter] = useState('all')
//   const [stockFilter, setStockFilter] = useState('all')

//   const [showSaleModal, setShowSaleModal] = useState(false)
//   const [saleForm, setSaleForm] = useState({ medId: '', qty: 1, price: 0 })

//   const [sales, setSales] = useState([])
//   const [dateRange, setDateRange] = useState('today')
//   const [customFrom, setCustomFrom] = useState('')
//   const [customTo, setCustomTo] = useState('')
//   const [showSalesReport, setShowSalesReport] = useState(false)
//   const printRef = useRef(null)

//   useEffect(() => {
//     const mock = [
//       { id: 1, name: 'باراسيتامول 500mg', company: 'GSK', price: 15, quantity: 10, expiry: '2025-12-10' },
//       { id: 2, name: 'أموكسيسيلين 250mg', company: 'Pfizer', price: 45, quantity: 3, expiry: '2024-06-02' },
//       { id: 3, name: 'ايبوبروفين 400mg', company: 'Novartis', price: 30, quantity: 2, expiry: '2023-12-30' },
//       { id: 4, name: 'فيتامين سي 1000mg', company: 'Roche', price: 25, quantity: 25, expiry: '2026-01-15' },
//     ]
//     setMedicines(mock)
//     setSales([
//       { id: 1, date: '2025-11-02', name: 'باراسيتامول 500mg', qty: 5, price: 15 },
//       { id: 2, date: '2025-11-02', name: 'فيتامين سي 1000mg', qty: 2, price: 25 },
//       { id: 3, date: '2025-11-01', name: 'أموكسيسيلين 250mg', qty: 3, price: 45 },
//     ])
//   }, [])

//   const lowStock = useMemo(() => medicines.filter(m => m.quantity <= 5), [medicines])
//   const expired = useMemo(() => medicines.filter(m => new Date(m.expiry) < new Date()), [medicines])

//   const companies = useMemo(() => ['all', ...Array.from(new Set(medicines.map(m => m.company)))], [medicines])

//   const filteredMedicines = useMemo(() => {
//     const s = search.trim().toLowerCase()
//     return medicines.filter(m => {
//       const matchText = m.name.toLowerCase().includes(s) || m.company.toLowerCase().includes(s)
//       const matchCompany = companyFilter === 'all' ? true : m.company === companyFilter
//       const isLow = m.quantity <= 5
//       const isExpired = new Date(m.expiry) < new Date()
//       const matchStock =
//         stockFilter === 'all' ? true : stockFilter === 'low' ? isLow : isExpired
//       return matchText && matchCompany && matchStock
//     })
//   }, [medicines, search, companyFilter, stockFilter])

//   const openSaleModal = (medId) => {
//     const med = medicines.find(m => m.id === medId)
//     setSaleForm({ medId, qty: 1, price: med?.price || 0 })
//     setShowSaleModal(true)
//   }

//   const submitSale = () => {
//     const med = medicines.find(m => m.id === Number(saleForm.medId))
//     if (!med) return toast.error('⚠️ يرجى اختيار دواء صالح للبيع')
//     if (saleForm.qty <= 0) return toast.error('❌ الكمية غير صالحة')
//     if (saleForm.qty > med.quantity) return toast.error('⚠️ الكمية المطلوبة أكبر من المتاح بالمخزون')

//     const updated = medicines.map(m =>
//       m.id === med.id ? { ...m, quantity: m.quantity - Number(saleForm.qty) } : m
//     )
//     setMedicines(updated)

//     const sale = {
//       id: sales.length + 1,
//       date: new Date().toISOString().slice(0, 10),
//       name: med.name,
//       qty: Number(saleForm.qty),
//       price: Number(saleForm.price || med.price),
//     }
//     setSales([sale, ...sales])

//     setShowSaleModal(false)
//     toast.success(`✅ تم تسجيل بيع ${sale.qty} من ${med.name}`)
//   }

//   const withinRange = (d) => {
//     const date = new Date(d)
//     const today = new Date()
//     const day = 24 * 60 * 60 * 1000

//     if (dateRange === 'today') return date.toDateString() === today.toDateString()
//     if (dateRange === 'week') {
//       const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
//       return date >= start && date <= today
//     }
//     if (dateRange === 'month') {
//       const start = new Date(today.getFullYear(), today.getMonth(), 1)
//       return date >= start && date <= today
//     }
//     if (dateRange === 'custom') {
//       if (!customFrom || !customTo) return true
//       const from = new Date(customFrom)
//       const to = new Date(customTo)
//       to.setHours(23, 59, 59, 999)
//       return date >= from && date <= to
//     }
//     return true
//   }

//   const filteredSales = useMemo(
//     () => sales.filter(s => withinRange(s.date)),
//     [sales, dateRange, customFrom, customTo]
//   )

//   const totalSales = filteredSales.reduce((sum, s) => sum + s.qty * s.price, 0)

//   const printSales = () => {
//     if (!printRef.current) return
//     toast.success('🖨️ جاري تحضير الطباعة...')
//     const html = printRef.current.innerHTML
//     const w = window.open('', '', 'width=900,height=700')
//     w.document.write(`
//       <html lang="ar" dir="rtl">
//         <head>
//           <title>تقرير مبيعات الصيدلي</title>
//           <meta charset="utf-8"/>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; direction: rtl; margin: 20px; color: #111827; }
//             header { text-align: center; margin-bottom: 12px; }
//             h1 { margin: 0 0 2px; font-size: 18px; color: ${theme.colors.primary}; }
//             .sub { color: #6B7280; font-size: 12px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 12px; }
//             th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: center; font-size: 13px; }
//             th { background: #f9fafb; }
//             .tot { margin-top: 10px; text-align: left; font-weight: 700; color: #047857; }
//             @media print { @page { size: A4; margin: 12mm; } }
//           </style>
//         </head>
//         <body>
//           <header>
//             <h1>تقرير مبيعات الصيدلي</h1>
//             <div class="sub">${new Date().toLocaleString('ar-SA')}</div>
//           </header>
//           ${html}
//         </body>
//       </html>
//     `)
//     w.document.close()
//     w.focus()
//     w.print()
//     w.close()
//   }

//   const exportCSV = () => {
//     if (!filteredSales.length) return toast.error('❌ لا توجد بيانات لتصديرها')
//     const headers = ['التاريخ', 'الدواء', 'الكمية', 'السعر', 'الإجمالي']
//     const rows = filteredSales.map(s => [
//       s.date,
//       s.name,
//       s.qty,
//       s.price,
//       (s.qty * s.price).toFixed(2)
//     ])
//     const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = 'pharmacist-sales.csv'
//     a.click()
//     URL.revokeObjectURL(url)
//     toast.success('📥 تم تصدير التقرير بصيغة CSV')
//   }

//   return (
//     <Layout user={{ name: 'الصيدلي محمد', role: 'pharmacist' }} title="لوحة الصيدلي">
//       <div dir="rtl" className="space-y-6">
//         {(lowStock.length > 0 || expired.length > 0) && (
//           <div className="grid gap-3 sm:grid-cols-2">
//             {lowStock.length > 0 && (
//               <div className="p-3 text-sm border rounded-md border-amber-200 bg-amber-50 text-amber-800">
//                 ⚠️ يوجد <b>{lowStock.length}</b> دواء منخفض المخزون.
//               </div>
//             )}
//             {expired.length > 0 && (
//               <div className="p-3 text-sm border rounded-md border-rose-200 bg-rose-50 text-rose-800">
//                 ⛔ يوجد <b>{expired.length}</b> دواء منتهي الصلاحية.
//               </div>
//             )}
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="flex flex-wrap gap-2">
//           {[
//             { key: 'medicines', label: '🧾 الأدوية' },
//             { key: 'sales', label: '💰 المبيعات' },
//             { key: 'alerts', label: '⚠️ التنبيهات' },
//           ].map(t => (
//             <button
//               key={t.key}
//               onClick={() => setActiveTab(t.key)}
//               className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
//                 activeTab === t.key ? 'text-white' : 'text-gray-600 bg-white'
//               }`}
//               style={{
//                 backgroundColor: activeTab === t.key ? theme.colors.primary : undefined,
//                 borderColor: activeTab === t.key ? theme.colors.primary : '#e5e7eb',
//               }}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {/* الأدوية */}
//         {activeTab === 'medicines' && (
//           <div className="p-4 bg-white border rounded-lg shadow-sm">
//             <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex flex-1 gap-2">
//                 <input
//                   type="text"
//                   placeholder="🔍 ابحث باسم الدواء أو الشركة..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//                 />
//                 <select
//                   value={companyFilter}
//                   onChange={(e) => setCompanyFilter(e.target.value)}
//                   className="px-3 py-2 text-sm border rounded-md"
//                 >
//                   {companies.map(c => (
//                     <option key={c} value={c}>{c === 'all' ? 'كل الشركات' : c}</option>
//                   ))}
//                 </select>
//                 <select
//                   value={stockFilter}
//                   onChange={(e) => setStockFilter(e.target.value)}
//                   className="px-3 py-2 text-sm border rounded-md"
//                 >
//                   <option value="all">كل الحالات</option>
//                   <option value="low">منخفض المخزون</option>
//                   <option value="expired">منتهي الصلاحية</option>
//                 </select>
//               </div>
//               <button
//                 onClick={() => setShowSaleModal(true)}
//                 className="px-4 py-2 text-white rounded-md shadow-sm"
//                 style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
//               >
//                 ➕ تسجيل بيع يدوي
//               </button>
//             </div>

//             <table className="w-full text-sm text-right border-t border-gray-100">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">اسم الدواء</th>
//                   <th className="px-3 py-2">الشركة</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">الصلاحية</th>
//                   <th className="px-3 py-2">إجراء</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredMedicines.map((m) => {
//                   const isLow = m.quantity <= 5
//                   const isExp = new Date(m.expiry) < new Date()
//                   return (
//                     <tr key={m.id} className={`border-t hover:bg-gray-50 ${isLow ? 'bg-amber-50/40' : ''} ${isExp ? 'bg-rose-50/40' : ''}`}>
//                       <td className="px-3 py-2">{m.name}</td>
//                       <td className="px-3 py-2">{m.company}</td>
//                       <td className="px-3 py-2">{m.price} ر.س</td>
//                       <td className={`px-3 py-2 ${isLow ? 'text-amber-700' : 'text-green-700'}`}>{m.quantity}</td>
//                       <td className={`${isExp ? 'text-rose-700' : ''} px-3 py-2`}>{m.expiry}</td>
//                       <td className="px-3 py-2">
//                         <button
//                           onClick={() => openSaleModal(m.id)}
//                           className="px-3 py-1.5 text-sm border rounded-md border-sky-200 text-sky-700 hover:bg-sky-50"
//                         >
//                           بيع
//                         </button>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* المبيعات */}
//         {activeTab === 'sales' && (
//           <div className="p-4 bg-white border rounded-lg shadow-sm">
//             <div className="flex flex-wrap gap-2 mb-3">
//               {['today', 'week', 'month', 'custom'].map(r => (
//                 <button
//                   key={r}
//                   onClick={() => setDateRange(r)}
//                   className={`px-3 py-1.5 rounded-md text-sm border ${dateRange === r ? 'text-white' : 'text-gray-600 bg-white'}`}
//                   style={{
//                     backgroundColor: dateRange === r ? theme.colors.primary : undefined,
//                     borderColor: dateRange === r ? theme.colors.primary : '#e5e7eb'
//                   }}
//                 >
//                   {r === 'today' ? 'اليوم' : r === 'week' ? 'الأسبوع' : r === 'month' ? 'الشهر' : 'مخصص'}
//                 </button>
//               ))}
//               {dateRange === 'custom' && (
//                 <>
//                   <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="px-3 py-1.5 border rounded-md" />
//                   <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="px-3 py-1.5 border rounded-md" />
//                 </>
//               )}
//             </div>

//             <div ref={printRef}>
//               <table className="w-full text-sm text-right border-t border-gray-100">
//                 <thead className="text-gray-600 bg-gray-50">
//                   <tr>
//                     <th className="px-3 py-2">التاريخ</th>
//                     <th className="px-3 py-2">الدواء</th>
//                     <th className="px-3 py-2">الكمية</th>
//                     <th className="px-3 py-2">السعر</th>
//                     <th className="px-3 py-2">الإجمالي</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredSales.map(s => (
//                     <tr key={s.id} className="border-t hover:bg-gray-50">
//                       <td className="px-3 py-2">{s.date}</td>
//                       <td className="px-3 py-2">{s.name}</td>
//                       <td className="px-3 py-2">{s.qty}</td>
//                       <td className="px-3 py-2">{s.price} ر.س</td>
//                       <td className="px-3 py-2 font-semibold text-sky-700">{(s.qty * s.price).toFixed(2)} ر.س</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="mt-3 font-semibold text-left text-green-700">الإجمالي: {totalSales.toFixed(2)} ر.س</div>
//             </div>

//             <div className="flex flex-wrap justify-end gap-2 mt-4">
//               <button onClick={printSales} className="px-4 py-2 text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700">
//                 🖨️ طباعة
//               </button>
//               <button onClick={exportCSV} className="px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700">
//                 📥 CSV
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {showSaleModal && (
//         <Modal title="تسجيل عملية بيع" onClose={() => setShowSaleModal(false)}>
//           <div className="space-y-3 text-right">
//             <label className="block text-sm">اختر الدواء</label>
//             <select
//               value={saleForm.medId}
//               onChange={(e) => {
//                 const id = Number(e.target.value)
//                 const med = medicines.find(m => m.id === id)
//                 setSaleForm({ medId: id, qty: 1, price: med?.price || 0 })
//               }}
//               className="w-full px-3 py-2 border rounded-md"
//             >
//               <option value="">— اختر —</option>
//               {medicines.map(m => (
//                 <option key={m.id} value={m.id}>{m.name} — المخزون: {m.quantity}</option>
//               ))}
//             </select>

//             <label className="block text-sm">الكمية</label>
//             <input
//               type="number"
//               min="1"
//               value={saleForm.qty}
//               onChange={(e) => setSaleForm({ ...saleForm, qty: Number(e.target.value) })}
//               className="w-full px-3 py-2 border rounded-md"
//             />

//             <label className="block text-sm">السعر</label>
//             <input
//               type="number"
//               min="0"
//               value={saleForm.price}
//               onChange={(e) => setSaleForm({ ...saleForm, price: Number(e.target.value) })}
//               className="w-full px-3 py-2 border rounded-md"
//             />

//             <div className="flex justify-end gap-2 pt-2">
//               <button onClick={submitSale} className="px-4 py-2 text-white rounded-md bg-emerald-600 hover:bg-emerald-700">حفظ</button>
//               <button onClick={() => setShowSaleModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }














// // pages/pharmacist.js
// import { useEffect, useMemo, useRef, useState } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import theme from '../theme'

// export default function Pharmacist() {
//   // ======== الحالة العامة ========
//   const [user] = useState({ name: 'الصيدلي محمد', role: 'pharmacist' })
//   const [activeTab, setActiveTab] = useState('medicines') // medicines | sales | alerts

//   // ======== الأدوية ========
//   const [medicines, setMedicines] = useState([])
//   const [search, setSearch] = useState('')
//   const [companyFilter, setCompanyFilter] = useState('all')
//   const [stockFilter, setStockFilter] = useState('all') // all | low | expired

//   // ======== البيع من الصيدلي ========
//   const [showSaleModal, setShowSaleModal] = useState(false)
//   const [saleForm, setSaleForm] = useState({ medId: '', qty: 1, price: 0 })

//   // ======== المبيعات والتقارير ========
//   const [sales, setSales] = useState([])
//   const [dateRange, setDateRange] = useState('today') // today | week | month | custom
//   const [customFrom, setCustomFrom] = useState('')
//   const [customTo, setCustomTo] = useState('')
//   const [showSalesReport, setShowSalesReport] = useState(false)
//   const printRef = useRef(null)

//   // ======== تهيئة بيانات وهمية ========
//   useEffect(() => {
//     const mock = [
//       { id: 1, name: 'باراسيتامول 500mg', company: 'GSK', price: 15, quantity: 10, expiry: '2025-12-10' },
//       { id: 2, name: 'أموكسيسيلين 250mg', company: 'Pfizer', price: 45, quantity: 3, expiry: '2024-06-02' },
//       { id: 3, name: 'ايبوبروفين 400mg', company: 'Novartis', price: 30, quantity: 2, expiry: '2023-12-30' },
//       { id: 4, name: 'فيتامين سي 1000mg', company: 'Roche', price: 25, quantity: 25, expiry: '2026-01-15' },
//     ]
//     setMedicines(mock)

//     setSales([
//       { id: 1, date: '2025-11-02', name: 'باراسيتامول 500mg', qty: 5, price: 15 },
//       { id: 2, date: '2025-11-02', name: 'فيتامين سي 1000mg', qty: 2, price: 25 },
//       { id: 3, date: '2025-11-01', name: 'أموكسيسيلين 250mg', qty: 3, price: 45 },
//     ])
//   }, [])

//   // ======== تنبيهات ========
//   const lowStock = useMemo(() => medicines.filter(m => m.quantity <= 5), [medicines])
//   const expired = useMemo(() => medicines.filter(m => new Date(m.expiry) < new Date()), [medicines])

//   // ======== فلترة الأدوية (بحث + شركة + حالة) ========
//   const companies = useMemo(() => ['all', ...Array.from(new Set(medicines.map(m => m.company)))], [medicines])

//   const filteredMedicines = useMemo(() => {
//     const s = search.trim().toLowerCase()
//     return medicines.filter(m => {
//       const matchesText =
//         m.name.toLowerCase().includes(s) || m.company.toLowerCase().includes(s)

//       const matchesCompany = companyFilter === 'all' ? true : m.company === companyFilter

//       const isLow = m.quantity <= 5
//       const isExpired = new Date(m.expiry) < new Date()
//       const matchesStock =
//         stockFilter === 'all' ? true : stockFilter === 'low' ? isLow : isExpired

//       return matchesText && matchesCompany && matchesStock
//     })
//   }, [medicines, search, companyFilter, stockFilter])

//   // ======== تسجيل بيع من الصيدلي ========
//   const openSaleModal = (medId) => {
//     const med = medicines.find(m => m.id === medId)
//     setSaleForm({ medId, qty: 1, price: med?.price || 0 })
//     setShowSaleModal(true)
//   }

//   const submitSale = () => {
//     const med = medicines.find(m => m.id === Number(saleForm.medId))
//     if (!med) return alert('اختر دواءً صالحًا')
//     if (saleForm.qty <= 0) return alert('الكمية غير صالحة')
//     if (saleForm.qty > med.quantity) return alert('الكمية المطلوبة أكبر من المخزون')

//     // تقليل المخزون
//     const updated = medicines.map(m =>
//       m.id === med.id ? { ...m, quantity: m.quantity - Number(saleForm.qty) } : m
//     )
//     setMedicines(updated)

//     // إضافة بيع
//     const sale = {
//       id: sales.length + 1,
//       date: new Date().toISOString().slice(0, 10),
//       name: med.name,
//       qty: Number(saleForm.qty),
//       price: Number(saleForm.price || med.price),
//     }
//     setSales([sale, ...sales])

//     setShowSaleModal(false)
//   }

//   // ======== تصفية المبيعات حسب التاريخ ========
//   const withinRange = (d) => {
//     const date = new Date(d)
//     const today = new Date()
//     const day = 24 * 60 * 60 * 1000

//     if (dateRange === 'today') {
//       return date.toDateString() === today.toDateString()
//     }
//     if (dateRange === 'week') {
//       const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
//       return date >= start && date <= today
//     }
//     if (dateRange === 'month') {
//       const start = new Date(today.getFullYear(), today.getMonth(), 1)
//       return date >= start && date <= today
//     }
//     if (dateRange === 'custom') {
//       if (!customFrom || !customTo) return true
//       const from = new Date(customFrom)
//       const to = new Date(customTo)
//       // شمل نهاية اليوم
//       to.setHours(23, 59, 59, 999)
//       return date >= from && date <= to
//     }
//     return true
//   }

//   const filteredSales = useMemo(
//     () => sales.filter(s => withinRange(s.date)),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [sales, dateRange, customFrom, customTo]
//   )

//   const totalSales = filteredSales.reduce((sum, s) => sum + s.qty * s.price, 0)

//   // ======== طباعة وتصدير ========
//   const printSales = () => {
//     if (!printRef.current) return
//     const html = printRef.current.innerHTML
//     const w = window.open('', '', 'width=900,height=700')
//     w.document.write(`
//       <html lang="ar" dir="rtl">
//         <head>
//           <title>تقرير مبيعات الصيدلي</title>
//           <meta charset="utf-8"/>
//           <style>
//             body { font-family: system-ui, -apple-system, 'Segoe UI', 'Tajawal', sans-serif; direction: rtl; margin: 20px; color: #111827; }
//             header { text-align: center; margin-bottom: 12px; }
//             h1 { margin: 0 0 2px; font-size: 18px; color: ${theme.colors.primary}; }
//             .sub { color: #6B7280; font-size: 12px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 12px; }
//             th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: center; font-size: 13px; }
//             th { background: #f9fafb; }
//             .tot { margin-top: 10px; text-align: left; font-weight: 700; color: #047857; }
//             @media print { @page { size: A4; margin: 12mm; } }
//           </style>
//         </head>
//         <body>
//           <header>
//             <h1>تقرير مبيعات الصيدلي</h1>
//             <div class="sub">${new Date().toLocaleString('ar-SA')}</div>
//           </header>
//           ${html}
//         </body>
//       </html>
//     `)
//     w.document.close()
//     w.focus()
//     w.print()
//     w.close()
//   }

//   const exportCSV = () => {
//     if (!filteredSales.length) return alert('لا توجد بيانات لتصديرها')
//     const headers = ['التاريخ', 'الدواء', 'الكمية', 'السعر', 'الإجمالي']
//     const rows = filteredSales.map(s => [
//       s.date,
//       s.name,
//       s.qty,
//       s.price,
//       (s.qty * s.price).toFixed(2)
//     ])
//     const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = 'pharmacist-sales.csv'
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   // ======== واجهة ========
//   return (
//     <Layout user={user} title="لوحة الصيدلي">
//       <div dir="rtl" className="space-y-6">
//         {/* تنبيهات فورية */}
//         {(lowStock.length > 0 || expired.length > 0) && (
//           <div className="grid gap-3 sm:grid-cols-2">
//             {lowStock.length > 0 && (
//               <div className="p-3 text-sm border rounded-md border-amber-200 bg-amber-50 text-amber-800">
//                 ⚠️ يوجد <b>{lowStock.length}</b> دواء منخفض المخزون — راجع إعادة الطلب.
//               </div>
//             )}
//             {expired.length > 0 && (
//               <div className="p-3 text-sm border rounded-md border-rose-200 bg-rose-50 text-rose-800">
//                 ⛔ يوجد <b>{expired.length}</b> دواء منتهي الصلاحية — أوقف صرفه فورًا.
//               </div>
//             )}
//           </div>
//         )}

//         {/* تبويبات */}
//         <div className="flex flex-wrap gap-2">
//           {[
//             { key: 'medicines', label: '🧾 الأدوية' },
//             { key: 'sales', label: '💰 المبيعات' },
//             { key: 'alerts', label: '⚠️ التنبيهات' },
//           ].map(t => (
//             <button
//               key={t.key}
//               onClick={() => setActiveTab(t.key)}
//               className={`px-3 py-1.5 rounded-md text-sm font-medium border
//                 ${activeTab === t.key ? 'text-white' : 'text-gray-600 bg-white'}
//               `}
//               style={{
//                 backgroundColor: activeTab === t.key ? theme.colors.primary : undefined,
//                 borderColor: activeTab === t.key ? theme.colors.primary : '#e5e7eb'
//               }}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {/* تبويب الأدوية */}
//         {activeTab === 'medicines' && (
//           <div className="p-4 bg-white border rounded-lg shadow-sm">
//             {/* شريط أدوات الأدوية */}
//             <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex flex-1 gap-2">
//                 <input
//                   type="text"
//                   placeholder="🔍 ابحث باسم الدواء أو الشركة..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//                 />
//                 <select
//                   value={companyFilter}
//                   onChange={(e) => setCompanyFilter(e.target.value)}
//                   className="px-3 py-2 text-sm border rounded-md"
//                 >
//                   {companies.map(c => (
//                     <option key={c} value={c}>
//                       {c === 'all' ? 'كل الشركات' : c}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   value={stockFilter}
//                   onChange={(e) => setStockFilter(e.target.value)}
//                   className="px-3 py-2 text-sm border rounded-md"
//                 >
//                   <option value="all">كل الحالات</option>
//                   <option value="low">منخفض المخزون</option>
//                   <option value="expired">منتهي الصلاحية</option>
//                 </select>
//               </div>

//               <button
//                 onClick={() => setShowSaleModal(true)}
//                 className="px-4 py-2 text-white rounded-md shadow-sm"
//                 style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
//               >
//                 ➕ تسجيل بيع يدوي
//               </button>
//             </div>

//             {/* جدول/بطاقات */}
//             <div className="hidden sm:block">
//               <table className="w-full text-sm text-right border-t border-gray-100">
//                 <thead className="text-gray-600 bg-gray-50">
//                   <tr>
//                     <th className="px-3 py-2">اسم الدواء</th>
//                     <th className="px-3 py-2">الشركة</th>
//                     <th className="px-3 py-2">السعر</th>
//                     <th className="px-3 py-2">الكمية</th>
//                     <th className="px-3 py-2">الصلاحية</th>
//                     <th className="px-3 py-2">إجراء</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredMedicines.map((m) => {
//                     const isLow = m.quantity <= 5
//                     const isExp = new Date(m.expiry) < new Date()
//                     return (
//                       <tr key={m.id} className={`border-t hover:bg-gray-50 ${isLow ? 'bg-amber-50/40' : ''} ${isExp ? 'bg-rose-50/40' : ''}`}>
//                         <td className="px-3 py-2">{m.name}</td>
//                         <td className="px-3 py-2">{m.company}</td>
//                         <td className="px-3 py-2">{m.price} ر.س</td>
//                         <td className={`px-3 py-2 ${isLow ? 'text-amber-700' : 'text-green-700'}`}>{m.quantity}</td>
//                         <td className={`${isExp ? 'text-rose-700' : ''} px-3 py-2`}>{m.expiry}</td>
//                         <td className="px-3 py-2">
//                           <button
//                             onClick={() => openSaleModal(m.id)}
//                             className="px-3 py-1.5 text-sm border rounded-md border-sky-200 text-sky-700 hover:bg-sky-50"
//                           >
//                             بيع
//                           </button>
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* بطاقات للجوال */}
//             <div className="grid gap-3 sm:hidden">
//               {filteredMedicines.map(m => {
//                 const isLow = m.quantity <= 5
//                 const isExp = new Date(m.expiry) < new Date()
//                 return (
//                   <div key={m.id} className={`p-3 border rounded-lg shadow-sm bg-white ${isLow ? 'bg-amber-50/50' : ''} ${isExp ? 'bg-rose-50/50' : ''}`}>
//                     <div className="flex items-center justify-between mb-1">
//                       <div className="font-semibold">{m.name}</div>
//                       <button
//                         onClick={() => openSaleModal(m.id)}
//                         className="px-2.5 py-1 text-xs border rounded-md border-sky-200 text-sky-700"
//                       >
//                         بيع
//                       </button>
//                     </div>
//                     <div className="text-xs text-gray-600">الشركة: {m.company}</div>
//                     <div className="text-xs text-gray-600">السعر: {m.price} ر.س</div>
//                     <div className={`text-xs ${isLow ? 'text-amber-700' : 'text-green-700'}`}>الكمية: {m.quantity}</div>
//                     <div className={`text-xs ${isExp ? 'text-rose-700' : 'text-gray-600'}`}>الصلاحية: {m.expiry}</div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         )}

//         {/* تبويب المبيعات */}
//         {activeTab === 'sales' && (
//           <div className="p-4 bg-white border rounded-lg shadow-sm">
//             {/* فلاتر التاريخ */}
//             <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex flex-wrap gap-2">
//                 {[
//                   { key: 'today', label: 'اليوم' },
//                   { key: 'week', label: 'الأسبوع' },
//                   { key: 'month', label: 'الشهر' },
//                   { key: 'custom', label: 'مخصص' },
//                 ].map(b => (
//                   <button
//                     key={b.key}
//                     onClick={() => setDateRange(b.key)}
//                     className={`px-3 py-1.5 rounded-md text-sm border
//                       ${dateRange === b.key ? 'text-white' : 'text-gray-600 bg-white'}
//                     `}
//                     style={{
//                       backgroundColor: dateRange === b.key ? theme.colors.primary : undefined,
//                       borderColor: dateRange === b.key ? theme.colors.primary : '#e5e7eb'
//                     }}
//                   >
//                     {b.label}
//                   </button>
//                 ))}
//               </div>

//               {dateRange === 'custom' && (
//                 <div className="flex flex-wrap items-center gap-2">
//                   <input
//                     type="date"
//                     value={customFrom}
//                     onChange={e => setCustomFrom(e.target.value)}
//                     className="px-3 py-2 text-sm border rounded-md"
//                   />
//                   <span className="text-sm text-gray-500">إلى</span>
//                   <input
//                     type="date"
//                     value={customTo}
//                     onChange={e => setCustomTo(e.target.value)}
//                     className="px-3 py-2 text-sm border rounded-md"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* جدول المبيعات */}
//             <div ref={printRef}>
//               <table className="w-full text-sm text-right border-t border-gray-100">
//                 <thead className="text-gray-600 bg-gray-50">
//                   <tr>
//                     <th className="px-3 py-2">التاريخ</th>
//                     <th className="px-3 py-2">الدواء</th>
//                     <th className="px-3 py-2">الكمية</th>
//                     <th className="px-3 py-2">السعر</th>
//                     <th className="px-3 py-2">الإجمالي</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredSales.map(s => (
//                     <tr key={s.id} className="border-t hover:bg-gray-50">
//                       <td className="px-3 py-2">{s.date}</td>
//                       <td className="px-3 py-2">{s.name}</td>
//                       <td className="px-3 py-2">{s.qty}</td>
//                       <td className="px-3 py-2">{s.price} ر.س</td>
//                       <td className="px-3 py-2 font-semibold text-sky-700">{(s.qty * s.price).toFixed(2)} ر.س</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="mt-3 text-left">
//                 <span className="px-3 py-1 text-sm font-semibold text-green-700 border border-green-200 rounded-md bg-green-50">
//                   الإجمالي: {totalSales.toFixed(2)} ر.س
//                 </span>
//               </div>
//             </div>

//             {/* أزرار التقرير */}
//             <div className="flex flex-wrap justify-end gap-2 mt-4">
//               <button onClick={() => setShowSalesReport(true)} className="px-4 py-2 text-white rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700">
//                 معاينة التقرير
//               </button>
//               <button onClick={printSales} className="px-4 py-2 text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700">
//                 🖨️ طباعة
//               </button>
//               <button onClick={exportCSV} className="px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700">
//                 📥 تصدير CSV
//               </button>
//             </div>
//           </div>
//         )}

//         {/* تبويب التنبيهات */}
//         {activeTab === 'alerts' && (
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div className="p-4 bg-white border rounded-lg shadow-sm">
//               <h3 className="mb-2 text-lg font-semibold text-amber-700">منخفض المخزون</h3>
//               {lowStock.length ? lowStock.map(m => (
//                 <div key={m.id} className="p-2 mb-1 text-sm border rounded-md bg-amber-50/60 border-amber-200">
//                   {m.name} — الكمية: <b>{m.quantity}</b>
//                 </div>
//               )) : <div className="text-sm text-gray-500">لا يوجد عناصر</div>}
//             </div>
//             <div className="p-4 bg-white border rounded-lg shadow-sm">
//               <h3 className="mb-2 text-lg font-semibold text-rose-700">منتهي الصلاحية</h3>
//               {expired.length ? expired.map(m => (
//                 <div key={m.id} className="p-2 mb-1 text-sm border rounded-md bg-rose-50/60 border-rose-200">
//                   {m.name} — الصلاحية: <b>{m.expiry}</b>
//                 </div>
//               )) : <div className="text-sm text-gray-500">لا يوجد عناصر</div>}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* مودال تسجيل بيع */}
//       {showSaleModal && (
//         <Modal title="تسجيل عملية بيع" onClose={() => setShowSaleModal(false)}>
//           <div className="space-y-3 text-right">
//             <label className="block text-sm">اختر الدواء</label>
//             <select
//               value={saleForm.medId}
//               onChange={(e) => {
//                 const id = Number(e.target.value)
//                 const med = medicines.find(m => m.id === id)
//                 setSaleForm({ medId: id, qty: 1, price: med?.price || 0 })
//               }}
//               className="w-full px-3 py-2 border rounded-md"
//             >
//               <option value="">— اختر —</option>
//               {medicines.map(m => (
//                 <option key={m.id} value={m.id}>{m.name} — المخزون: {m.quantity}</option>
//               ))}
//             </select>

//             <label className="block text-sm">الكمية</label>
//             <input
//               type="number"
//               min="1"
//               value={saleForm.qty}
//               onChange={(e) => setSaleForm({ ...saleForm, qty: Number(e.target.value) })}
//               className="w-full px-3 py-2 border rounded-md"
//             />

//             <label className="block text-sm">السعر (يمكن تعديله)</label>
//             <input
//               type="number"
//               min="0"
//               value={saleForm.price}
//               onChange={(e) => setSaleForm({ ...saleForm, price: Number(e.target.value) })}
//               className="w-full px-3 py-2 border rounded-md"
//             />

//             <div className="flex justify-end gap-2 pt-2">
//               <button onClick={submitSale} className="px-4 py-2 text-white rounded-md bg-emerald-600 hover:bg-emerald-700">
//                 حفظ العملية
//               </button>
//               <button onClick={() => setShowSaleModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
//                 إلغاء
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* مودال معاينة التقرير للطباعة */}
//       {showSalesReport && (
//         <Modal title="معاينة تقرير المبيعات" onClose={() => setShowSalesReport(false)}>
//           <div className="space-y-3 text-sm" ref={printRef}>
//             <div className="text-center">
//               <div className="text-lg font-bold" style={{ color: theme.colors.primary }}>تقرير المبيعات</div>
//               <div className="text-gray-500">{new Date().toLocaleString('ar-SA')}</div>
//             </div>
//             <table className="w-full border border-gray-200">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">التاريخ</th>
//                   <th className="px-3 py-2">الدواء</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSales.map(s => (
//                   <tr key={`p-${s.id}`} className="border-t">
//                     <td className="px-3 py-2">{s.date}</td>
//                     <td className="px-3 py-2">{s.name}</td>
//                     <td className="px-3 py-2">{s.qty}</td>
//                     <td className="px-3 py-2">{s.price} ر.س</td>
//                     <td className="px-3 py-2">{(s.qty * s.price).toFixed(2)} ر.س</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="font-semibold text-left text-green-700">الإجمالي: {totalSales.toFixed(2)} ر.س</div>
//           </div>

//           <div className="flex justify-end gap-2 mt-4">
//             <button onClick={printSales} className="px-4 py-2 text-white rounded-md bg-sky-600 hover:bg-sky-700">
//               🖨️ طباعة
//             </button>
//             <button onClick={exportCSV} className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
//               📥 CSV
//             </button>
//             <button onClick={() => setShowSalesReport(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
//               إغلاق
//             </button>
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

// export default function Pharmacist() {
//   const [user, setUser] = useState({ name: 'الصيدلي محمد' })
//   const [medicines, setMedicines] = useState([])
//   const [lowStock, setLowStock] = useState([])
//   const [expired, setExpired] = useState([])
//   const [sales, setSales] = useState([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [showDetailsModal, setShowDetailsModal] = useState(null)
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showSalesReport, setShowSalesReport] = useState(false)
//   const reportRef = useRef(null)

//   const [newMedicine, setNewMedicine] = useState({
//     name: '',
//     company: '',
//     price: '',
//     quantity: '',
//     expiry: '',
//   })

//   useEffect(() => {
//     const mockMedicines = [
//       { id: 1, name: 'باراسيتامول 500mg', company: 'GSK', price: 15, quantity: 10, expiry: '2025-12-10' },
//       { id: 2, name: 'أموكسيسيلين 250mg', company: 'Pfizer', price: 25, quantity: 3, expiry: '2024-06-02' },
//       { id: 3, name: 'ايبوبروفين 400mg', company: 'Novartis', price: 18, quantity: 2, expiry: '2023-12-30' },
//     ]
//     setMedicines(mockMedicines)
//     const today = new Date()
//     setLowStock(mockMedicines.filter((m) => m.quantity <= 5))
//     setExpired(mockMedicines.filter((m) => new Date(m.expiry) < today))

//     // 🧾 بيانات مبيعات افتراضية (قابلة للتوسع لاحقاً)
//     setSales([
//       { id: 1, date: '2025-11-02', name: 'باراسيتامول 500mg', qty: 5, price: 15 },
//       { id: 2, date: '2025-11-02', name: 'فيتامين سي 1000mg', qty: 2, price: 25 },
//       { id: 3, date: '2025-11-01', name: 'أموكسيسيلين 250mg', qty: 3, price: 45 },
//     ])
//   }, [])

//   const filteredMedicines = medicines.filter(
//     (m) =>
//       m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       m.company.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const totalSalesToday = sales
//     .filter((s) => s.date === new Date().toISOString().slice(0, 10))
//     .reduce((sum, s) => sum + s.qty * s.price, 0)

//   // 🖨️ دالة الطباعة
//   const handlePrint = () => {
//     const printWindow = window.open('', '', 'width=850,height=900')
//     printWindow.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير مبيعات الصيدلي</title>
//           <style>
//             body {
//               font-family: 'Tajawal', sans-serif;
//               padding: 25px;
//               direction: rtl;
//               background-color: #fff;
//               color: #333;
//             }
//             h2 {
//               text-align: center;
//               color: #0369a1;
//               margin-bottom: 10px;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 15px;
//             }
//             th, td {
//               border: 1px solid #ccc;
//               padding: 8px;
//               text-align: center;
//             }
//             th {
//               background: #f1f5f9;
//               font-weight: bold;
//             }
//             tfoot td {
//               background: #e2e8f0;
//               font-weight: bold;
//             }
//             .footer {
//               margin-top: 40px;
//               text-align: center;
//               color: #555;
//             }
//             .signature {
//               margin-top: 30px;
//               text-align: left;
//               font-size: 14px;
//               color: #444;
//             }
//             .logo {
//               text-align: center;
//               margin-bottom: 20px;
//             }
//             .logo img {
//               width: 80px;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="logo">
//             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Pharmacy_symbol.svg/512px-Pharmacy_symbol.svg.png" alt="شعار الصيدلية" />
//             <h2>تقرير مبيعات الصيدلي</h2>
//           </div>
//           ${reportRef.current.innerHTML}
//           <div class="footer">
//             <p>تم توليد التقرير في ${new Date().toLocaleString('ar-SA')}</p>
//           </div>
//           <div class="signature">
//             <p>توقيع الصيدلي: .....................................</p>
//           </div>
//         </body>
//       </html>
//     `)
//     printWindow.document.close()
//     printWindow.focus()
//     printWindow.print()
//     printWindow.close()
//   }

//   return (
//     <Layout user={user} title="لوحة الصيدلي">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔹 شريط التحكم */}
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <input
//             type="text"
//             placeholder="🔍 ابحث باسم الدواء أو الشركة..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="flex-1 px-4 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//           />
//           <div className="flex gap-2">
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="px-5 py-2 text-white rounded-md shadow bg-sky-600 hover:bg-sky-700"
//             >
//               ➕ إضافة دواء
//             </button>
//             <button
//               onClick={() => setShowSalesReport(true)}
//               className="px-5 py-2 text-white bg-green-600 rounded-md shadow hover:bg-green-700"
//             >
//               📊 تقرير المبيعات
//             </button>
//           </div>
//         </div>

//         {/* 💊 جدول الأدوية */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <h3 className="mb-3 text-lg font-semibold text-gray-700">قائمة الأدوية</h3>
//           <table className="w-full text-sm text-right border-t border-gray-100">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">اسم الدواء</th>
//                 <th className="px-3 py-2">الشركة</th>
//                 <th className="px-3 py-2">السعر</th>
//                 <th className="px-3 py-2">الكمية</th>
//                 <th className="px-3 py-2">الانتهاء</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredMedicines.map((m) => (
//                 <tr key={m.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{m.name}</td>
//                   <td className="px-3 py-2">{m.company}</td>
//                   <td className="px-3 py-2">{m.price} ر.س</td>
//                   <td className={`px-3 py-2 ${m.quantity <= 5 ? 'text-red-600' : 'text-green-700'}`}>
//                     {m.quantity}
//                   </td>
//                   <td className={`px-3 py-2 ${new Date(m.expiry) < new Date() ? 'text-red-600' : ''}`}>
//                     {m.expiry}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* 📊 مودال تقرير المبيعات */}
//       {showSalesReport && (
//         <Modal title="تقرير مبيعات الصيدلي" onClose={() => setShowSalesReport(false)}>
//           <div ref={reportRef} className="space-y-2 text-sm text-gray-700">
//             <h3 className="mb-3 text-lg font-semibold text-center text-sky-700">
//               💊 تقرير المبيعات اليومية
//             </h3>
//             <table className="w-full text-sm text-right border border-gray-200">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">التاريخ</th>
//                   <th className="px-3 py-2">اسم الدواء</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sales.map((s) => (
//                   <tr key={s.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{s.date}</td>
//                     <td className="px-3 py-2">{s.name}</td>
//                     <td className="px-3 py-2">{s.qty}</td>
//                     <td className="px-3 py-2">{s.price} ر.س</td>
//                     <td className="px-3 py-2 font-semibold text-sky-700">
//                       {(s.qty * s.price).toFixed(2)} ر.س
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="mt-4 font-semibold text-center text-green-700">
//               🧾 إجمالي مبيعات اليوم: {totalSalesToday.toFixed(2)} ر.س
//             </div>
//           </div>

//           <button
//             onClick={handlePrint}
//             className="w-full py-2 mt-4 text-white rounded-md bg-sky-600 hover:bg-sky-700"
//           >
//             🖨️ طباعة التقرير
//           </button>
//         </Modal>
//       )}
//     </Layout>
//   )
// }
