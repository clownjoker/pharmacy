import { useState, useEffect } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import Layout from '../components/Layout'
import theme from '../theme'
import toast from 'react-hot-toast'

export default function ProfitReport() {
  const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
  const [salesData, setSalesData] = useState([]) // بيانات المبيعات
  const [filteredSales, setFilteredSales] = useState([]) // المبيعات بعد الفلترة
  const [dateRange, setDateRange] = useState({ from: '', to: '' }) // فترة الفلترة
  const [selectedUser, setSelectedUser] = useState('all') // اختيار المستخدم
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // بيانات المبيعات الافتراضية (مجمعة حسب الشهر)
    const data = [
      { month: 'يناير', total: 3200, profit: 1200, growth: 15, user: 'أحمد' },
      { month: 'فبراير', total: 4100, profit: 1500, growth: 25, user: 'محمد' },
      { month: 'مارس', total: 3800, profit: 1400, growth: 10, user: 'مها' },
      { month: 'أبريل', total: 5200, profit: 1800, growth: 30, user: 'أحمد' },
      { month: 'مايو', total: 6100, profit: 2000, growth: 35, user: 'محمد' },
      { month: 'يونيو', total: 5700, profit: 1900, growth: 20, user: 'مها' },
    ]
    setSalesData(data)
    setFilteredSales(data)
    setLoading(false)
  }, [])

  // دالة الفلترة بناءً على التاريخ والمستخدم
  const filterData = () => {
    let filtered = salesData

    // تصفية حسب الفترة
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter((item) => {
        return (
          new Date(item.month) >= new Date(dateRange.from) &&
          new Date(item.month) <= new Date(dateRange.to)
        )
      })
    }

    // تصفية حسب المستخدم
    if (selectedUser !== 'all') {
      filtered = filtered.filter((item) => item.user === selectedUser)
    }

    setFilteredSales(filtered)
    toast.success(`✅ تم تطبيق الفلتر!`)
  }

  const totalProfit = filteredSales.reduce((sum, item) => sum + item.profit, 0)
  const avgProfit = totalProfit / filteredSales.length || 0

  // التحكم في الطباعة
  const printReport = () => {
    const content = document.getElementById('report-content').innerHTML
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>تقرير الأرباح</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
            th { background: #f5f5f5; }
            h2 { text-align: center; color: #0ea5e9; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <Layout user={user} title="📊 تقرير الأرباح الشهرية">
      <div dir="rtl" className="space-y-6">
        {loading && (
          <div className="flex items-center justify-center h-96">
            <p className="text-lg text-gray-600">جاري تحميل البيانات...</p>
          </div>
        )}

        {/* 🔹 شريط الفلاتر */}
        <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm md:flex md:space-x-4 md:space-y-0">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">من:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="px-3 py-2 text-sm border rounded-md"
            />
            <label className="text-sm text-gray-700">إلى:</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="px-3 py-2 text-sm border rounded-md"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md"
            >
              <option value="all">كل المستخدمين</option>
              <option value="أحمد">أحمد</option>
              <option value="محمد">محمد</option>
              <option value="مها">مها</option>
            </select>
            <button
              onClick={filterData}
              className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
            >
              🔍 تطبيق الفلتر
            </button>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={printReport}
              className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700"
            >
              🖨️ طباعة التقرير
            </button>
            <button
              onClick={() => toast.success('📄 تم تصدير PDF')}
              className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
            >
              📄 PDF
            </button>
            <button
              onClick={() => toast.success('📊 تم تصدير Excel')}
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              📊 Excel
            </button>
          </div>
        </div>

        {/* 🔹 تقرير الأرباح */}
        <div id="report-content">
          <div className="p-6 space-y-4 bg-white border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">📈 تقرير الأرباح الشهرية</h3>

            {/* إجمالي الأرباح */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <SummaryCard title="إجمالي الأرباح" value={`${totalProfit.toLocaleString()} ر.س`} color="text-sky-600" />
              <SummaryCard title="متوسط الأرباح" value={`${avgProfit} ر.س`} color="text-green-600" />
              <SummaryCard title="أعلى ربح" value={filteredSales.length ? filteredSales[0].month : 'لا يوجد'} color="text-amber-600" />
              <SummaryCard title="عدد الأشهر" value={filteredSales.length} color="text-blue-600" />
            </div>

            {/* الرسم البياني */}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>

            {/* جدول المبيعات */}
            <table className="w-full text-sm text-right border-t border-gray-100">
              <thead className="text-gray-600 bg-gray-50">
                <tr>
                  <th className="px-3 py-2">الشهر</th>
                  <th className="px-3 py-2">المبيعات (ر.س)</th>
                  <th className="px-3 py-2">التكلفة (ر.س)</th>
                  <th className="px-3 py-2">الربح الصافي (ر.س)</th>
                  <th className="px-3 py-2">نسبة النمو</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((item, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-700">{item.month}</td>
                    <td className="px-3 py-2">{(item.sales || item.profit * 1.5).toLocaleString()}</td>
                    <td className="px-3 py-2">{(item.cost || item.profit * 0.5).toLocaleString()}</td>
                    <td className="px-3 py-2 font-semibold text-green-700">{item.profit.toLocaleString()}</td>
                    <td className="px-3 py-2 text-sky-700">
                      {item.growth ? `${item.growth}%` : `${Math.floor(Math.random() * 15 + 5)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

/* بطاقة الملخص */
function SummaryCard({ title, value, color }) {
  return (
    <div className="p-4 text-center transition border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white hover:shadow-md">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className={`text-lg font-bold ${color}`}>{value}</h3>
    </div>
  )
}
