// pages/reports.js
import { useState, useMemo } from "react";
import Layout from "../components/Layout";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Reports() {
  const [user] = useState({ name: "المدير أحمد", role: "admin" });
  const [activeTab, setActiveTab] = useState("overview");

  /* =====================================================
     🔥 بيانات تجريبية كاملة للمخزون + المبيعات + الشفتات
     ===================================================== */

  const demoProducts = [
    {
      id: "P-1001",
      name: "بانادول",
      price: 18,
      costPrice: 12,
      quantity: 50,
      minQty: 10,
      category: "مسكنات",
      company: "GSK",
      expiryDate: "2025-10-20",
    },
    {
      id: "P-1002",
      name: "فيتامين سي",
      price: 25,
      costPrice: 17,
      quantity: 8,
      minQty: 10,
      category: "فيتامينات",
      company: "Mega",
      expiryDate: "2025-12-05",
    },
    {
      id: "P-1003",
      name: "أوغمنتين",
      price: 44,
      costPrice: 30,
      quantity: 0,
      minQty: 5,
      category: "مضاد حيوي",
      company: "GSK",
      expiryDate: "2024-12-01",
    },
    {
      id: "P-1004",
      name: "بروفين",
      price: 16,
      costPrice: 10,
      quantity: 4,
      minQty: 8,
      category: "مسكنات",
      company: "ADWIA",
      expiryDate: "2025-02-15",
    },
  ];

  const demoInvoices = [
    {
      id: "INV-1001",
      type: "sale",
      customer: "أحمد",
      cashier: "سارة",
      payment: "cash",
      total: 145.5,
      date: "2025-11-17T10:21:10",
    },
    {
      id: "INV-1002",
      type: "sale",
      customer: "محمد",
      cashier: "سارة",
      payment: "card",
      total: 320,
      date: "2025-11-17T11:05:00",
    },
    {
      id: "INV-1003",
      type: "return",
      customer: "إيمان",
      cashier: "أحمد",
      payment: "cash",
      total: 50,
      date: "2025-11-16T18:10:00",
    },
    {
      id: "INV-1004",
      type: "sale",
      customer: "عمرو",
      cashier: "أحمد",
      payment: "wallet",
      total: 260.75,
      date: "2025-10-22T14:00:45",
    },
    {
      id: "INV-1005",
      type: "sale",
      customer: "نادر",
      cashier: "سارة",
      payment: "cash",
      total: 89.9,
      date: "2025-09-10T09:22:33",
    },
  ];

  const demoShifts = [
    {
      id: 1,
      cashier: "سارة",
      openedAt: "2025-11-17T08:00:00",
      closedAt: "2025-11-17T16:00:00",
      totals: {
        totalSales: 465.5,
        totalCash: 145.5,
        totalCard: 320,
        totalWallet: 0,
        invoiceCount: 2,
      },
    },
    {
      id: 2,
      cashier: "أحمد",
      openedAt: "2025-11-16T08:00:00",
      closedAt: "2025-11-16T16:00:00",
      totals: {
        totalSales: 210.75,
        totalCash: 50,
        totalCard: 0,
        totalWallet: 160.75,
        invoiceCount: 2,
      },
    },
  ];

  /* =============================
     🔥 حسابات المبيعات والرسوم
     ============================= */
  const formatCurrency = (v) =>
    `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

  const salesStats = useMemo(() => {
    if (!demoInvoices.length)
      return {
        totalSales: 0,
        count: 0,
        avg: 0,
        todayTotal: 0,
        monthTotal: 0,
      };

    // نعتبر "اليوم" آخر تاريخ موجود في البيانات لضمان ثبات النتائج
    const dates = demoInvoices.map((i) => i.date.slice(0, 10));
    const logicalToday = dates.sort()[dates.length - 1];
    const logicalMonth = logicalToday.slice(0, 7);

    let totalSales = 0;
    let todayTotal = 0;
    let monthTotal = 0;

    demoInvoices.forEach((inv) => {
      const sign = inv.type === "return" ? -1 : 1;
      const val = Number(inv.total || 0) * sign;
      totalSales += val;

      const d = inv.date.slice(0, 10);
      if (d === logicalToday) todayTotal += val;
      if (d.slice(0, 7) === logicalMonth) monthTotal += val;
    });

    const count = demoInvoices.length;
    const avg = count ? totalSales / count : 0;

    return {
      totalSales,
      count,
      avg,
      todayTotal,
      monthTotal,
    };
  }, [demoInvoices]);

  const monthlyChartData = useMemo(() => {
    const map = new Map();
    demoInvoices.forEach((inv) => {
      const key = inv.date.slice(0, 7); // yyyy-mm
      const sign = inv.type === "return" ? -1 : 1;
      map.set(key, (map.get(key) || 0) + inv.total * sign);
    });
    return Array.from(map.entries()).map(([month, total]) => ({
      month,
      total,
    }));
  }, [demoInvoices]);

  /* =============================
     🔥 المخزون والتنبيهات
     ============================= */
  const stockReport = useMemo(() => {
    return demoProducts.map((p) => {
      const cost = p.costPrice || p.price * 0.7;
      return {
        ...p,
        margin: p.price - cost,
      };
    });
  }, [demoProducts]);

  const lowStockProducts = stockReport.filter(
    (p) => p.quantity <= p.minQty
  );

  const expiredProducts = stockReport.filter((p) => {
    if (!p.expiryDate) return false;
    return new Date(p.expiryDate) < new Date();
  });

  const nearExpiryProducts = stockReport.filter((p) => {
    if (!p.expiryDate) return false;
    const exp = new Date(p.expiryDate);
    const now = new Date();
    const limit = new Date();
    limit.setMonth(now.getMonth() + 1);
    return exp >= now && exp <= limit;
  });

  /* =============================
     🔥 الطباعة العامة
     ============================= */
  const openPrintWindow = (title, content) => {
    const html = `
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
          body { font-family: 'Tajawal', sans-serif; padding: 20px;}
          table { width: 100%; border-collapse: collapse; margin-top: 10px;}
          th, td { border: 1px solid #ccc; padding: 6px; text-align: center;}
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        ${content}
        <script>
          window.onload = () => {
            window.print();
            setTimeout(() => window.close(), 600);
          };
        </script>
      </body>
    </html>
    `;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  };

  const printSales = () => {
    const rows = demoInvoices
      .map(
        (i) => `
      <tr>
        <td>${i.id}</td>
        <td>${i.type === "sale" ? "بيع" : "مرتجع"}</td>
        <td>${i.customer}</td>
        <td>${i.cashier}</td>
        <td>${i.payment}</td>
        <td>${i.total}</td>
      </tr>`
      )
      .join("");

    openPrintWindow(
      "تقرير المبيعات",
      `<table>
        <thead><tr><th>رقم</th><th>النوع</th><th>العميل</th><th>الكاشير</th><th>الدفع</th><th>إجمالي</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`
    );
  };

  const printStock = () => {
    const rows = stockReport
      .map(
        (p) => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.quantity}</td>
        <td>${p.minQty}</td>
        <td>${p.expiryDate}</td>
        <td>${p.price}</td>
      </tr>`
      )
      .join("");

    openPrintWindow(
      "تقرير المخزون",
      `<table>
        <thead>
          <tr><th>كود</th><th>اسم</th><th>كمية</th><th>حد أدنى</th><th>انتهاء</th><th>سعر</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`
    );
  };

  /* =====================================================
     💠 التبويبات + التصميم
     ===================================================== */

  return (
    <Layout user={user} title="التقارير">
      <div dir="rtl" className="space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
          <TabButton
            id="overview"
            label="نظرة عامة"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            id="sales"
            label="المبيعات"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            id="stock"
            label="المخزون"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            id="profit"
            label="ربحية المنتجات"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            id="alerts"
            label="التنبيهات"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            id="shifts"
            label="الشفتات"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {activeTab === "overview" && (
          <OverviewTab
            salesStats={salesStats}
            chart={monthlyChartData}
            invoices={demoInvoices}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === "sales" && (
          <SalesTab
            invoices={demoInvoices}
            print={printSales}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === "stock" && (
          <StockTab
            products={stockReport}
            print={printStock}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === "profit" && (
          <ProfitTab products={stockReport} formatCurrency={formatCurrency} />
        )}

        {activeTab === "alerts" && (
          <AlertsTab
            low={lowStockProducts}
            expired={expiredProducts}
            nearExpiry={nearExpiryProducts}
          />
        )}

        {activeTab === "shifts" && <ShiftsTab shifts={demoShifts} />}
      </div>
    </Layout>
  );
}

/* -------------------- Components -------------------- */

function TabButton({ id, label, activeTab, setActiveTab }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-3 py-1.5 text-sm rounded-lg border transition ${
        isActive
          ? "bg-sky-600 text-white border-sky-600"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

/* 🔷 نظرة عامة */
function OverviewTab({ salesStats, chart, invoices, formatCurrency }) {
  return (
    <div className="space-y-5">
      {/* الكروت */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="إجمالي المبيعات"
          value={formatCurrency(salesStats.totalSales)}
          color="text-emerald-600"
        />
        <SummaryCard
          title="عدد الفواتير"
          value={salesStats.count}
          color="text-sky-600"
        />
        <SummaryCard
          title="متوسط الفاتورة"
          value={formatCurrency(salesStats.avg)}
          color="text-amber-600"
        />
        <SummaryCard
          title="مبيعات اليوم (حسب أحدث تاريخ)"
          value={formatCurrency(salesStats.todayTotal)}
          color="text-purple-600"
        />
      </div>

      {/* الرسم البياني */}
      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          📈 المبيعات الشهرية
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#0ea5e9"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* آخر الفواتير */}
      <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">🧾 آخر الفواتير</h2>
        <table className="w-full min-w-[700px] text-sm">
          <thead className="text-gray-700 bg-gray-50">
            <tr>
              <th className="px-3 py-2">رقم</th>
              <th className="px-3 py-2">النوع</th>
              <th className="px-3 py-2">العميل</th>
              <th className="px-3 py-2">الكاشير</th>
              <th className="px-3 py-2">الدفع</th>
              <th className="px-3 py-2">القيمة</th>
            </tr>
          </thead>
          <tbody>
            {invoices.slice(0, 5).map((i) => (
              <tr key={i.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{i.id}</td>
                <td className="px-3 py-2">
                  {i.type === "sale" ? "بيع" : "مرتجع"}
                </td>
                <td className="px-3 py-2">{i.customer}</td>
                <td className="px-3 py-2">{i.cashier}</td>
                <td className="px-3 py-2">{i.payment}</td>
                <td className="px-3 py-2 font-semibold text-emerald-700">
                  {formatCurrency(i.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🔷 المبيعات مع فلترة متقدمة */
function SalesTab({ invoices, print, formatCurrency }) {
  const [search, setSearch] = useState("");
  const [cashier, setCashier] = useState("all");
  const [payment, setPayment] = useState("all");
  const [type, setType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((i) => {
      const passSearch =
        !search ||
        i.id.toLowerCase().includes(search.toLowerCase()) ||
        i.customer.toLowerCase().includes(search.toLowerCase());

      const passCashier = cashier === "all" || i.cashier === cashier;
      const passPayment = payment === "all" || i.payment === payment;
      const passType = type === "all" || i.type === type;

      const d = i.date.slice(0, 10);
      const passDateFrom = !dateFrom || d >= dateFrom;
      const passDateTo = !dateTo || d <= dateTo;

      return (
        passSearch &&
        passCashier &&
        passPayment &&
        passType &&
        passDateFrom &&
        passDateTo
      );
    });
  }, [invoices, search, cashier, payment, type, dateFrom, dateTo]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">🧾 تقرير المبيعات</h2>
        <button
          onClick={print}
          className="px-3 py-1.5 text-sm text-sky-700 bg-sky-50 border border-sky-300 rounded-lg hover:bg-sky-100"
        >
          🖨️ طباعة كل المبيعات
        </button>
      </div>

      {/* فلترة متقدمة */}
      <div className="grid grid-cols-1 gap-3 p-3 bg-white border rounded-lg shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          placeholder="بحث: رقم الفاتورة / العميل"
          className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={cashier}
          onChange={(e) => setCashier(e.target.value)}
          className="px-3 py-2 text-sm border rounded-md"
        >
          <option value="all">كل الكاشير</option>
          {Array.from(new Set(invoices.map((i) => i.cashier))).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="px-3 py-2 text-sm border rounded-md"
        >
          <option value="all">كل طرق الدفع</option>
          <option value="cash">نقداً</option>
          <option value="card">بطاقة</option>
          <option value="wallet">محفظة</option>
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 text-sm border rounded-md"
        >
          <option value="all">بيع + مرتجع</option>
          <option value="sale">بيع فقط</option>
          <option value="return">مرتجع فقط</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 text-sm border rounded-md"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 text-sm border rounded-md"
        />
      </div>

      <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="w-full min-w-[900px] text-sm text-right">
          <thead className="text-gray-700 bg-gray-50">
            <tr>
              <th className="px-3 py-2">رقم</th>
              <th className="px-3 py-2">نوع</th>
              <th className="px-3 py-2">عميل</th>
              <th className="px-3 py-2">كاشير</th>
              <th className="px-3 py-2">دفع</th>
              <th className="px-3 py-2">إجمالي</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((i) => (
              <tr key={i.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{i.id}</td>
                <td className="px-3 py-2">
                  {i.type === "sale" ? "بيع" : "مرتجع"}
                </td>
                <td className="px-3 py-2">{i.customer}</td>
                <td className="px-3 py-2">{i.cashier}</td>
                <td className="px-3 py-2">{i.payment}</td>
                <td className="px-3 py-2 font-semibold text-emerald-700">
                  {formatCurrency(i.total)}
                </td>
              </tr>
            ))}
            {!filteredInvoices.length && (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 text-sm text-center text-gray-500"
                >
                  لا توجد نتائج حسب الفلاتر الحالية…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🔷 المخزون */
function StockTab({ products, print, formatCurrency }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">🏬 تقرير المخزون</h2>
        <button
          onClick={print}
          className="px-3 py-1.5 text-sm text-sky-700 bg-sky-50 border border-sky-300 rounded-lg hover:bg-sky-100"
        >
          🖨️ طباعة تقرير المخزون
        </button>
      </div>

      <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="w-full min-w-[900px] text-sm text-right">
          <thead className="text-gray-700 bg-gray-50">
            <tr>
              <th className="px-3 py-2">كود</th>
              <th className="px-3 py-2">اسم</th>
              <th className="px-3 py-2">التصنيف</th>
              <th className="px-3 py-2">الشركة</th>
              <th className="px-3 py-2">كمية</th>
              <th className="px-3 py-2">حد أدنى</th>
              <th className="px-3 py-2">انتهاء</th>
              <th className="px-3 py-2">سعر</th>
              <th className="px-3 py-2">هامش الربح</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{p.id}</td>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.category}</td>
                <td className="px-3 py-2">{p.company}</td>
                <td className="px-3 py-2">{p.quantity}</td>
                <td className="px-3 py-2">{p.minQty}</td>
                <td className="px-3 py-2">{p.expiryDate}</td>
                <td className="px-3 py-2">{formatCurrency(p.price)}</td>
                <td
                  className={`px-3 py-2 font-semibold ${
                    p.margin > 0 ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {formatCurrency(p.margin)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🔷 ربحية المنتجات */
function ProfitTab({ products, formatCurrency }) {
  const rows = products.map((p) => {
    const totalCost = (p.costPrice || 0) * p.quantity;
    const totalSell = (p.price || 0) * p.quantity;
    const profit = totalSell - totalCost;
    const marginPercent =
      totalSell > 0 ? ((profit / totalSell) * 100).toFixed(1) : "0.0";

    return {
      ...p,
      totalCost,
      totalSell,
      profit,
      marginPercent,
    };
  });

  return (
    <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">
        📊 تقرير ربحية المنتجات
      </h2>

      <table className="w-full min-w-[950px] text-sm text-right">
        <thead className="text-gray-700 bg-gray-50">
          <tr>
            <th className="px-3 py-2">المنتج</th>
            <th className="px-3 py-2">تكلفة الوحدة</th>
            <th className="px-3 py-2">سعر البيع</th>
            <th className="px-3 py-2">الكمية</th>
            <th className="px-3 py-2">إجمالي التكلفة</th>
            <th className="px-3 py-2">إجمالي البيع</th>
            <th className="px-3 py-2">الربح</th>
            <th className="px-3 py-2">نسبة الربحية</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2">{r.name}</td>
              <td className="px-3 py-2">{formatCurrency(r.costPrice)}</td>
              <td className="px-3 py-2">{formatCurrency(r.price)}</td>
              <td className="px-3 py-2">{r.quantity}</td>
              <td className="px-3 py-2">
                {formatCurrency(Number(r.totalCost.toFixed(2)))}
              </td>
              <td className="px-3 py-2">
                {formatCurrency(Number(r.totalSell.toFixed(2)))}
              </td>
              <td
                className={`px-3 py-2 font-semibold ${
                  r.profit >= 0 ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {formatCurrency(Number(r.profit.toFixed(2)))}
              </td>
              <td className="px-3 py-2">{r.marginPercent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* 🔷 التنبيهات */
function AlertsTab({ low, expired, nearExpiry }) {
  return (
    <div className="space-y-6">
      <AlertSection
        title="❌ منتجات منتهية"
        color="text-red-700"
        rows={expired}
        headers={["كود", "اسم", "كمية", "انتهاء"]}
        mapper={(p) => [p.id, p.name, p.quantity, p.expiryDate]}
      />

      <AlertSection
        title="⚠️ تقترب من الانتهاء (خلال شهر)"
        color="text-amber-700"
        rows={nearExpiry}
        headers={["كود", "اسم", "كمية", "انتهاء"]}
        mapper={(p) => [p.id, p.name, p.quantity, p.expiryDate]}
      />

      <AlertSection
        title="📉 كمية منخفضة"
        color="text-orange-700"
        rows={low}
        headers={["كود", "اسم", "كمية", "حد أدنى"]}
        mapper={(p) => [p.id, p.name, p.quantity, p.minQty]}
      />
    </div>
  );
}

function AlertSection({ title, color, rows, headers, mapper }) {
  return (
    <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
      <h2 className={`mb-3 text-lg font-semibold ${color}`}>{title}</h2>
      <table className="w-full min-w-[700px] text-sm text-right">
        <thead className="text-gray-700 bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((p, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                {mapper(p).map((cell, i) => (
                  <td key={i} className="px-3 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="py-4 text-sm text-center text-gray-500"
              >
                لا توجد بيانات لعرضها…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* 🔷 الشفتات */
function ShiftsTab({ shifts }) {
  const formatDate = (value) => {
    if (!value) return "";
    return value.replace("T", " ").slice(0, 16);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">🕒 تقرير الشفتات</h2>
      <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="w-full min-w-[900px] text-sm text-right">
          <thead className="text-gray-700 bg-gray-50">
            <tr>
              <th className="px-3 py-2">رقم</th>
              <th className="px-3 py-2">كاشير</th>
              <th className="px-3 py-2">افتتاح</th>
              <th className="px-3 py-2">إغلاق</th>
              <th className="px-3 py-2">إجمالي</th>
              <th className="px-3 py-2">نقدًا</th>
              <th className="px-3 py-2">بطاقة</th>
              <th className="px-3 py-2">محفظة</th>
              <th className="px-3 py-2">عدد فواتير</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{s.id}</td>
                <td className="px-3 py-2">{s.cashier}</td>
                <td className="px-3 py-2">{formatDate(s.openedAt)}</td>
                <td className="px-3 py-2">
                  {s.closedAt ? formatDate(s.closedAt) : "مفتوح"}
                </td>
                <td className="px-3 py-2">{s.totals.totalSales}</td>
                <td className="px-3 py-2">{s.totals.totalCash}</td>
                <td className="px-3 py-2">{s.totals.totalCard}</td>
                <td className="px-3 py-2">{s.totals.totalWallet}</td>
                <td className="px-3 py-2">{s.totals.invoiceCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🔷 كرت ملخص */
function SummaryCard({ title, value, color }) {
  return (
    <div className="p-4 text-center bg-white border rounded-lg shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}


















// // pages/reports.js
// import { useState, useEffect, useRef } from 'react'
// import { motion } from 'framer-motion'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import toast from 'react-hot-toast'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from 'recharts'

// const API_URL = 'http://localhost:5000/api/reports'

// export default function Reports() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [activeTab, setActiveTab] = useState('summary')
//   const [dateRange, setDateRange] = useState({ from: '', to: '' })
//   const [selectedUser, setSelectedUser] = useState('all')
//   const printRef = useRef(null)

//   const [salesData, setSalesData] = useState([])
//   const [inventoryData, setInventoryData] = useState([])
//   const [profitData, setProfitData] = useState([])
//   const [userStats, setUserStats] = useState([])
//   const [logs, setLogs] = useState([])
//   useEffect(() => {
//   const token = localStorage.getItem("pharmacy_token")
//   if (!token) {
//     router.replace("/")   // redirect to login
//   }
// }, [])

//   // 🔹 تحميل البيانات من الباك إند
//   useEffect(() => {
//     const loadReports = async () => {
//       try {
//         const params = new URLSearchParams()
//         if (dateRange.from) params.append('from', dateRange.from)
//         if (dateRange.to) params.append('to', dateRange.to)
//         if (selectedUser !== 'all') params.append('user', selectedUser)

//         const res = await fetch(`${API_URL}?${params.toString()}`)
//         const data = await res.json()

//         if (!res.ok) throw new Error(data.message || 'خطأ في تحميل التقارير')

//         setSalesData(Array.isArray(data.sales) ? data.sales : [])
//         setInventoryData(Array.isArray(data.inventory) ? data.inventory : [])
//         setProfitData(Array.isArray(data.profit) ? data.profit : [])
//         setUserStats(Array.isArray(data.users) ? data.users : [])
//         setLogs(Array.isArray(data.logs) ? data.logs : [])
//       } catch (err) {
//         console.error(err)
//         toast.error('فشل تحميل بيانات التقارير')
//       }
//     }

//     loadReports()
//   }, [dateRange.from, dateRange.to, selectedUser])

//   // 🔸 الفلترة (فقط رسالة للمستخدم – البيانات نفسها تُعاد تحميلها تلقائيًا من useEffect)
//   const handleFilter = () => {
//     toast.success('✅ تم تطبيق الفلتر على التقارير')
//   }

//   // 🔸 الطباعة
//   const printAllReports = () => {
//     if (!printRef.current) return
//     const content = printRef.current.innerHTML
//     const printWindow = window.open('', '_blank', 'width=900,height=700')
//     printWindow.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير شامل</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
//             th { background: #f5f5f5; }
//             h2 { text-align: center; color: #0ea5e9; }
//           </style>
//         </head>
//         <body>${content}</body>
//       </html>
//     `)
//     printWindow.document.close()
//     printWindow.print()
//   }

//   // 🔹 التبويبات
//   const tabButton = (key, label, icon) => (
//     <button
//       key={key}
//       onClick={() => setActiveTab(key)}
//       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
//         activeTab === key
//           ? 'text-sky-700 border-sky-500 bg-sky-50'
//           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
//       }`}
//     >
//       <span>{icon}</span> {label}
//     </button>
//   )

//   return (
//     <Layout user={user} title="📊 التقارير الشاملة">
//       <div dir="rtl" className="space-y-6">
//         {/* شريط التبويبات */}
//         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
//           {tabButton('summary', 'الملخص العام', '📋')}
//           {tabButton('sales', 'المبيعات', '🧾')}
//           {tabButton('inventory', 'المخزون', '📦')}
//           {tabButton('profit', 'الأرباح', '💰')}
//           {tabButton('users', 'المستخدمين', '👥')}
//           {tabButton('system', 'النظام', '⚙️')}
//         </div>

//         {/* شريط الفلاتر */}
//         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             <label className="text-sm text-gray-700">من:</label>
//             <input
//               type="date"
//               value={dateRange.from}
//               onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//             <label className="text-sm text-gray-700">إلى:</label>
//             <input
//               type="date"
//               value={dateRange.to}
//               onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
//               className="px-3 py-2 text-sm border rounded-md"
//             />

//             <select
//               value={selectedUser}
//               onChange={(e) => setSelectedUser(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">المستخدم: الكل</option>
//               {/* لو حابب نجيب أسماء المستخدمين من الـ API ممكن نعدل هنا لاحقًا */}
//               <option value="أحمد">أحمد</option>
//               <option value="محمد">محمد</option>
//               <option value="مها">مها</option>
//             </select>

//             <button
//               onClick={handleFilter}
//               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
//             >
//               🔍 تطبيق
//             </button>
//           </div>

//           <button
//             onClick={printAllReports}
//             className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700"
//           >
//             🖨️ طباعة الكل
//           </button>
//         </div>

//         {/* المحتوى */}
//         <motion.div
//           ref={printRef}
//           key={activeTab}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.25 }}
//           className="space-y-4"
//         >
//           {activeTab === 'summary' && (
//             <SummaryTab sales={salesData} inventory={inventoryData} profit={profitData} />
//           )}
//           {activeTab === 'sales' && <SalesTab sales={salesData} />}
//           {activeTab === 'inventory' && <InventoryTab inventory={inventoryData} />}
//           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
//           {activeTab === 'users' && <UsersTab userStats={userStats} />}
//           {activeTab === 'system' && <SystemTab logs={logs} />}
//         </motion.div>
//       </div>
//     </Layout>
//   )
// }

// /* ----------------------------------------------------------
//    📋 الملخص العام
// ---------------------------------------------------------- */
// function SummaryTab({ sales, inventory, profit }) {
//   const safeSales = Array.isArray(sales) ? sales : []
//   const safeInventory = Array.isArray(inventory) ? inventory : []
//   const safeProfit = Array.isArray(profit) ? profit : []

//   const totalSales = safeSales.reduce(
//     (s, x) => s + (x.total || (x.qty * x.price) || 0),
//     0
//   )
//   const totalProfit = safeProfit.reduce((t, m) => t + (m.profit || 0), 0)
//   const lowStock = safeInventory.filter((i) => i.low_stock).length

//   return (
//     <div className="p-6 space-y-6 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📋 ملخص الصيدلية العام</h3>
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
//         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600" />
//         <SummaryCard title="المنتجات المنخفضة" value={lowStock} color="text-red-600" />
//         <SummaryCard title="عدد المنتجات" value={safeInventory.length} color="text-amber-600" />
//       </div>

//       <ResponsiveContainer width="100%" height={260}>
//         <BarChart data={safeSales}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="total" fill={theme.colors.primary} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* ----------------------------------------------------------
//    🧾 تقرير المبيعات المفصل
// ---------------------------------------------------------- */
// function SalesTab({ sales }) {
//   const safeSales = Array.isArray(sales) ? sales : []

//   const grouped = safeSales.reduce((acc, row) => {
//     const day = row.date?.slice(0, 10) || 'غير محدد'
//     if (!acc[day]) acc[day] = []
//     acc[day].push(row)
//     return acc
//   }, {})

//   const days = Object.keys(grouped)

//   if (!days.length) {
//     return (
//       <div className="p-6 text-center text-gray-500 bg-white border rounded-lg shadow-sm">
//         لا توجد بيانات مبيعات في الفترة المحددة.
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {days.map((day) => {
//         const list = grouped[day]
//         const total = list.reduce((sum, s) => sum + (s.total || (s.qty * s.price) || 0), 0)
//         const totalQty = list.reduce((sum, s) => sum + (s.qty || 0), 0)
//         const cashiers = [...new Set(list.map((s) => s.cashier_name || s.cashier))].join('، ')

//         return (
//           <div key={day} className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 📅 مبيعات يوم <span className="text-sky-600">{day}</span>
//               </h3>
//             </div>
//             <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//               <SummaryCard title="عدد الفواتير" value={list.length} color="text-blue-600" />
//               <SummaryCard title="إجمالي القطع" value={totalQty} color="text-green-600" />
//               <SummaryCard title="إجمالي اليوم" value={`${total} ر.س`} color="text-sky-600" />
//               <SummaryCard title="الكاشيرين" value={cashiers || '—'} color="text-amber-600" />
//             </div>
//             <table className="w-full text-sm text-right border-t border-gray-100">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">#</th>
//                   <th className="px-3 py-2">رقم الفاتورة</th>
//                   <th className="px-3 py-2">العميل</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                   <th className="px-3 py-2">الكاشير</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {list.map((s, i) => (
//                   <tr key={s.id || i} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{i + 1}</td>
//                     <td className="px-3 py-2">{s.invoice_code}</td>
//                     <td className="px-3 py-2">{s.customer}</td>
//                     <td className="px-3 py-2 font-semibold text-sky-700">
//                       {(s.total || (s.qty * s.price) || 0) + ' ر.س'}
//                     </td>
//                     <td className="px-3 py-2">{s.cashier_name || s.cashier}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// /* ----------------------------------------------------------
//    📦 تقرير المخزون
// ---------------------------------------------------------- */
// function InventoryTab({ inventory }) {
//   const safeInventory = Array.isArray(inventory) ? inventory : []
//   const [sortKey, setSortKey] = useState('name')
//   const [sortDir, setSortDir] = useState('asc')

//   const sortedData = [...safeInventory].sort((a, b) => {
//     if (sortKey === 'qty') {
//       return sortDir === 'asc' ? a.qty - b.qty : b.qty - a.qty
//     } else if (sortKey === 'expiry_date') {
//       return sortDir === 'asc'
//         ? new Date(a.expiry_date) - new Date(b.expiry_date)
//         : new Date(b.expiry_date) - new Date(a.expiry_date)
//     } else {
//       return sortDir === 'asc'
//         ? (a.name || '').localeCompare(b.name || '', 'ar')
//         : (b.name || '').localeCompare(a.name || '', 'ar')
//     }
//   })

//   const headerCell = (label, key) => (
//     <th
//       key={key}
//       onClick={() => {
//         if (sortKey === key) {
//           setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
//         } else {
//           setSortKey(key)
//           setSortDir('asc')
//         }
//       }}
//       className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//     >
//       {label} {sortKey === key ? (sortDir === 'asc' ? '⬆️' : '⬇️') : ''}
//     </th>
//   )

//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center">
//         <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون الحالي</h3>
//         <p className="text-sm text-gray-500">إجمالي الأصناف: {safeInventory.length}</p>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-sm text-right border-t border-gray-100">
//           <thead className="text-gray-600 bg-gray-50">
//             <tr>
//               {headerCell('اسم الدواء', 'name')}
//               {headerCell('الكمية', 'qty')}
//               {headerCell('تاريخ الانتهاء', 'expiry_date')}
//               <th className="px-3 py-2">الحالة</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedData.map((item, idx) => {
//               const isLow = item.low_stock || item.qty <= 3
//               const expiry = item.expiry_date || item.expiry
//               const now = new Date()
//               const expDate = expiry ? new Date(expiry) : null
//               const isExpired = expDate && expDate < now
//               const isNearExpiry =
//                 expDate && expDate - now < 30 * 24 * 60 * 60 * 1000 && expDate > now

//               return (
//                 <tr key={idx} className="transition border-t hover:bg-gray-50">
//                   <td className="px-3 py-2 font-medium text-gray-700">{item.name}</td>
//                   <td
//                     className={`px-3 py-2 ${
//                       isLow ? 'text-red-600 font-semibold' : 'text-green-600'
//                     }`}
//                   >
//                     {item.qty}
//                   </td>
//                   <td
//                     className={`px-3 py-2 ${
//                       isExpired ? 'text-red-600' : isNearExpiry ? 'text-amber-600' : ''
//                     }`}
//                   >
//                     {expiry || '—'}
//                   </td>
//                   <td className="px-3 py-2">
//                     {isExpired
//                       ? '❌ منتهي الصلاحية'
//                       : isLow
//                       ? '⚠️ مخزون منخفض'
//                       : isNearExpiry
//                       ? '⏰ قرب الانتهاء'
//                       : '✅ صالح'}
//                   </td>
//                 </tr>
//               )
//             })}
//             {!sortedData.length && (
//               <tr>
//                 <td colSpan={4} className="py-6 text-center text-gray-500">
//                   لا توجد بيانات مخزون.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// /* ----------------------------------------------------------
//    💰 تقرير الأرباح
// ---------------------------------------------------------- */
// function ProfitTab({ profitData }) {
//   const safeProfit = Array.isArray(profitData) ? profitData : []
//   const [sortKey, setSortKey] = useState('month')
//   const [sortDir, setSortDir] = useState('asc')

//   const sortedData = [...safeProfit].sort((a, b) => {
//     if (sortKey === 'profit') {
//       return sortDir === 'asc' ? a.profit - b.profit : b.profit - a.profit
//     } else {
//       return sortDir === 'asc'
//         ? (a.month || '').localeCompare(b.month || '')
//         : (b.month || '').localeCompare(a.month || '')
//     }
//   })

//   const headerCell = (label, key) => (
//     <th
//       onClick={() => {
//         if (sortKey === key) {
//           setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
//         } else {
//           setSortKey(key)
//           setSortDir('asc')
//         }
//       }}
//       className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//     >
//       {label} {sortKey === key ? (sortDir === 'asc' ? '⬆️' : '⬇️') : ''}
//     </th>
//   )

//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📈 تقرير الأرباح الشهرية</h3>

//       <div className="overflow-x-auto">
//         <table className="w-full text-sm text-right border-t border-gray-100">
//           <thead className="text-gray-600 bg-gray-50">
//             <tr>
//               {headerCell('الشهر', 'month')}
//               {headerCell('الأرباح', 'profit')}
//             </tr>
//           </thead>
//           <tbody>
//             {sortedData.map((item, idx) => (
//               <tr key={idx} className="border-t hover:bg-gray-50">
//                 <td className="px-3 py-2">{item.month}</td>
//                 <td className="px-3 py-2">{item.profit} ر.س</td>
//               </tr>
//             ))}
//             {!sortedData.length && (
//               <tr>
//                 <td colSpan={2} className="py-6 text-center text-gray-500">
//                   لا توجد بيانات أرباح.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={sortedData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* ----------------------------------------------------------
//    👥 المستخدمون
// ---------------------------------------------------------- */
// function UsersTab({ userStats }) {
//   const safeUsers = Array.isArray(userStats) ? userStats : []
//   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#6366F1', '#EC4899']

//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">
//       <h3 className="mb-3 text-lg font-semibold text-gray-800">👥 أداء المستخدمين</h3>

//       <ResponsiveContainer width="100%" height={260}>
//         <PieChart>
//           <Pie
//             data={safeUsers}
//             dataKey="sales"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={90}
//             label
//           >
//             {safeUsers.map((_, i) => (
//               <Cell key={i} fill={COLORS[i % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>

//       <div className="mt-6">
//         <table className="w-full text-sm text-right border-t border-gray-100">
//           <thead className="text-gray-600 bg-gray-50">
//             <tr>
//               <th className="px-3 py-2">#</th>
//               <th className="px-3 py-2">اسم المستخدم</th>
//               <th className="px-3 py-2">إجمالي المبيعات</th>
//             </tr>
//           </thead>
//           <tbody>
//             {safeUsers.map((u, idx) => (
//               <tr key={idx} className="border-t hover:bg-gray-50">
//                 <td className="px-3 py-2">{idx + 1}</td>
//                 <td className="px-3 py-2">{u.name}</td>
//                 <td className="px-3 py-2">{u.sales} ر.س</td>
//               </tr>
//             ))}
//             {!safeUsers.length && (
//               <tr>
//                 <td colSpan={3} className="py-6 text-center text-gray-500">
//                   لا توجد بيانات مستخدمين.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// /* ----------------------------------------------------------
//    ⚙️ سجل النظام
// ---------------------------------------------------------- */
// function SystemTab({ logs }) {
//   const safeLogs = Array.isArray(logs) ? logs : []

//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">
//       <h3 className="mb-3 text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
//       <table className="w-full text-sm text-right border-t border-gray-100">
//         <thead className="text-gray-600 bg-gray-50">
//           <tr>
//             <th className="px-3 py-2">الوقت</th>
//             <th className="px-3 py-2">المستخدم</th>
//             <th className="px-3 py-2">الإجراء</th>
//           </tr>
//         </thead>
//         <tbody>
//           {safeLogs.map((log, idx) => (
//             <tr key={idx} className="border-t hover:bg-gray-50">
//               <td className="px-3 py-2">{log.time}</td>
//               <td className="px-3 py-2">{log.user}</td>
//               <td className="px-3 py-2">{log.action}</td>
//             </tr>
//           ))}
//           {!safeLogs.length && (
//             <tr>
//               <td colSpan={3} className="py-6 text-center text-gray-500">
//                 لا توجد سجلات.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// /* 🧩 بطاقة ملخص صغيرة */
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center transition border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-lg font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }






// import { useState, useEffect, useRef } from 'react'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import toast from 'react-hot-toast'
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//   PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar
// } from 'recharts'
// import { motion } from 'framer-motion'

// export default function Reports() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })

//   const [activeTab, setActiveTab] = useState('summary')
//   const [dateRange, setDateRange] = useState({ from: '', to: '' })
//   const [selectedUser, setSelectedUser] = useState('all')
//   const printRef = useRef(null)

//   // بيانات النظام
//   const [sales, setSales] = useState([])
//   const [inventory, setInventory] = useState([])
//   const [profit, setProfit] = useState([])
//   const [users, setUsers] = useState([])
//   const [logs, setLogs] = useState([])

//   const API = "http://localhost:5000/api/reports"

//   // تحميل البيانات من الباك اند
//   useEffect(() => {
//   loadAllReports()
// }, [])

// const loadAllReports = async () => {
//   try {
//     const base = 'http://localhost:5000/api/reports'

//     const [sales, inventory, profit, users, system] = await Promise.all([
//       fetch(`${base}/sales`).then(r => r.json()),
//       fetch(`${base}/inventory`).then(r => r.json()),
//       fetch(`${base}/profit`).then(r => r.json()),
//       fetch(`${base}/users`).then(r => r.json()),
//       fetch(`${base}/system`).then(r => r.json())
//     ])

//     setSalesData(sales)
//     setInventoryData(inventory)
//     setProfitData(profit)
//     setUserStats(users)
//     setLogs(system)

//   } catch (err) {
//     toast.error('فشل تحميل التقارير')
//     console.log(err)
//   }
// }


//   const handleFilter = () => {
//     toast.success("تم تطبيق الفلتر")
//   }

//   const printAll = () => {
//     const content = printRef.current.innerHTML
//     const w = window.open('', '_blank', 'width=900,height=700')
//     w.document.write(`
//       <html dir="rtl"><body>${content}</body></html>
//     `)
//     w.document.close()
//     w.print()
//   }

//   const tabButton = (key, label, icon) => (
//     <button
//       key={key}
//       onClick={() => setActiveTab(key)}
//       className={`flex items-center gap-2 px-4 py-2 rounded-md border-b-4 text-sm ${
//         activeTab === key
//           ? "border-sky-500 text-sky-700 bg-sky-50"
//           : "border-transparent text-gray-700 hover:bg-gray-100"
//       }`}
//     >
//       {icon} {label}
//     </button>
//   )

//   return (
//     <Layout user={user} title="📊 التقارير الشاملة">
//       <div dir="rtl" className="space-y-6">

//         {/* Tabs */}
//         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
//           {tabButton('summary', 'الملخص العام', '📋')}
//           {tabButton('sales', 'المبيعات', '💰')}
//           {tabButton('inventory', 'المخزون', '📦')}
//           {tabButton('profit', 'الأرباح', '📈')}
//           {tabButton('users', 'المستخدمين', '👥')}
//           {tabButton('system', 'النظام', '⚙️')}
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap justify-between gap-3 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white">
//           <div className="flex flex-wrap items-center gap-2 text-sm">
//             <span>من:</span>
//             <input type="date" className="px-2 py-1 border rounded" onChange={(e)=>setDateRange({...dateRange, from:e.target.value})}/>
//             <span>إلى:</span>
//             <input type="date" className="px-2 py-1 border rounded" onChange={(e)=>setDateRange({...dateRange, to:e.target.value})}/>
//             <span>المستخدم:</span>
//             <select value={selectedUser} onChange={(e)=>setSelectedUser(e.target.value)} className="px-3 py-2 border rounded">
//               <option value="all">الكل</option>
//               {users.map(u => <option key={u.id}>{u.name}</option>)}
//             </select>
//             <button onClick={handleFilter} className="px-3 py-2 text-white rounded bg-sky-600">تطبيق</button>
//           </div>
//           <button onClick={printAll} className="px-3 py-2 text-white rounded bg-amber-600">طباعة الكل</button>
//         </div>

//         {/* Content */}
//         <motion.div ref={printRef} key={activeTab} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}}>
//           {activeTab === "summary" && <SummaryTab sales={sales} inventory={inventory} profit={profit} />}
//           {activeTab === "sales" && <SalesTab sales={sales} />}
//           {activeTab === "inventory" && <InventoryTab inventory={inventory} />}
//           {activeTab === "profit" && <ProfitTab profit={profit} />}
//           {activeTab === "users" && <UsersTab users={users} />}
//           {activeTab === "system" && <SystemTab logs={logs} />}
//         </motion.div>

//       </div>
//     </Layout>
//   )
// }

// /* ----------------------------------------
//    📋 الملخص العام
// ---------------------------------------- */
// function SummaryTab({ sales, inventory, profit }) {

//   const totalSales = sales.reduce((s, x) => s + (x.total || 0), 0)
//   const totalProfit = profit.reduce((s, x) => s + (x.profit || 0), 0)
//   const lowStock = inventory.filter(i => i.low_stock === 1).length

//   return (
//     <div className="p-6 space-y-6 bg-white border rounded-lg shadow-sm">

//       <h3 className="text-lg font-semibold text-gray-700">📋 الملخص العام</h3>

//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600"/>
//         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600"/>
//         <SummaryCard title="المنتجات المنخفضة" value={lowStock} color="text-red-600"/>
//         <SummaryCard title="عدد الأصناف" value={inventory.length} color="text-amber-600"/>
//       </div>

//       <ResponsiveContainer width="100%" height={260}>
//         <BarChart data={sales.map(s => ({ date: s.date, total: s.total }))}>
//           <CartesianGrid strokeDasharray="3 3"/>
//           <XAxis dataKey="date"/>
//           <YAxis/>
//           <Tooltip/>
//           <Bar dataKey="total" fill={theme.colors.primary}/>
//         </BarChart>
//       </ResponsiveContainer>

//     </div>
//   )
// }

// /* ----------------------------------------
//    💰 تقرير المبيعات
// ---------------------------------------- */
// function SalesTab({ sales }) {

//   const grouped = sales.reduce((acc, s) => {
//     if (!acc[s.date]) acc[s.date] = []
//     acc[s.date].push(s)
//     return acc
//   }, {})

//   return (
//     <div className="space-y-6">

//       {Object.keys(grouped).map(day => {
//         const list = grouped[day]
//         const total = list.reduce((a,b)=>a+(b.total||0),0)

//         return (
//           <div key={day} className="p-5 space-y-3 bg-white border rounded-lg shadow-sm">
//             <h3 className="text-lg font-semibold text-gray-700">📅 مبيعات يوم {day}</h3>
//             <div className="font-semibold text-sky-600">إجمالي اليوم: {total} ر.س</div>

//             <table className="w-full text-sm border-t">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th>#</th><th>الكود</th><th>العميل</th><th>الدفع</th><th>المبلغ</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {list.map((s,i)=>(
//                   <tr key={i}>
//                     <td>{i+1}</td>
//                     <td>{s.invoice_code}</td>
//                     <td>{s.customer}</td>
//                     <td>{s.payment}</td>
//                     <td className="text-sky-600">{s.total} ر.س</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )
//       })}

//     </div>
//   )
// }

// /* ----------------------------------------
//    📦 تقرير المخزون
// ---------------------------------------- */
// function InventoryTab({ inventory }) {
//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">
//       <h3 className="mb-3 text-lg font-semibold text-gray-700">📦 تقرير المخزون</h3>

//       <table className="w-full text-sm border-t">
//         <thead className="bg-gray-50">
//           <tr>
//             <th>المنتج</th>
//             <th>الكمية</th>
//             <th>الانتهاء</th>
//             <th>الحالة</th>
//           </tr>
//         </thead>

//         <tbody>
//           {inventory.map((i,idx) => (
//             <tr key={idx} className="border-t">
//               <td>{i.name}</td>
//               <td className={i.low_stock ? "text-red-600 font-semibold" : ""}>{i.qty}</td>
//               <td>{i.expiry}</td>
//               <td>{i.low_stock ? "⚠ مخزون منخفض" : "✔ جيد"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//     </div>
//   )
// }

// /* ----------------------------------------
//    📈 تقرير الأرباح
// ---------------------------------------- */
// function ProfitTab({ profit }) {
//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">
//       <h3 className="mb-3 text-lg font-semibold text-gray-700">📈 تقرير الأرباح</h3>

//       <ResponsiveContainer width="100%" height={260}>
//         <LineChart data={profit}>
//           <CartesianGrid strokeDasharray="3 3"/>
//           <XAxis dataKey="month"/>
//           <YAxis/>
//           <Tooltip/>
//           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2}/>
//         </LineChart>
//       </ResponsiveContainer>

//       <table className="w-full mt-3 text-sm border-t">
//         <thead className="bg-gray-50">
//           <tr><th>الشهر</th><th>الربح</th></tr>
//         </thead>
//         <tbody>
//           {profit.map((p,idx)=>
//             <tr key={idx} className="border-t">
//               <td>{p.month}</td>
//               <td>{p.profit} ر.س</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// /* ----------------------------------------
//    👥 المستخدمين
// ---------------------------------------- */
// function UsersTab({ users }) {
//   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']

//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">

//       <h3 className="mb-3 text-lg font-semibold text-gray-700">👥 أداء المستخدمين</h3>

//       <ResponsiveContainer width="100%" height={260}>
//         <PieChart>
//           <Pie data={users} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
//             {users.map((_,i)=><Cell key={i} fill={COLORS[i%3]}/>)}
//           </Pie>
//           <Tooltip/>
//         </PieChart>
//       </ResponsiveContainer>

//       <table className="w-full mt-3 text-sm border-t">
//         <thead className="bg-gray-50"><tr><th>#</th><th>الاسم</th><th>المبيعات</th></tr></thead>
//         <tbody>
//           {users.map((u,i)=>(
//             <tr key={i} className="border-t">
//               <td>{i+1}</td>
//               <td>{u.name}</td>
//               <td>{u.sales} ر.س</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//     </div>
//   )
// }

// /* ----------------------------------------
//    ⚙️ النظام
// ---------------------------------------- */
// function SystemTab({ logs }) {
//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">
//       <h3 className="mb-3 text-lg font-semibold">⚙ سجل النظام</h3>

//       <table className="w-full text-sm border-t">
//         <thead className="bg-gray-50">
//           <tr>
//             <th>الوقت</th>
//             <th>المستخدم</th>
//             <th>الإجراء</th>
//           </tr>
//         </thead>

//         <tbody>
//           {logs.map((l,i)=>(
//             <tr key={i} className="border-t">
//               <td>{l.time}</td>
//               <td>{l.user}</td>
//               <td>{l.action}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//     </div>
//   )
// }

// /* ----------------------------------------
//    🧩 بطاقة صغيرة
// ---------------------------------------- */
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-lg font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }






// import { useState, useEffect, useRef } from 'react'
// import { motion } from 'framer-motion'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
//   PieChart, Pie, Cell, ResponsiveContainer,
//   BarChart, Bar
// } from 'recharts'

// export default function Reports() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [activeTab, setActiveTab] = useState('summary')
//   const [dateRange, setDateRange] = useState({ from: '', to: '' })
//   const [selectedUser, setSelectedUser] = useState('all')
//   const printRef = useRef(null)

//   // 🔹 بيانات النظام (يتم تحميلها من الباك-إند)
//   const [salesData, setSalesData] = useState([])
//   const [inventoryData, setInventoryData] = useState([])
//   const [profitData, setProfitData] = useState([])
//   const [userStats, setUserStats] = useState([])
//   const [logs, setLogs] = useState([])

//   const API_URL = 'http://localhost:5000/api/reports/overview'

//   // ======================================================
//   // 🔥 تحميل البيانات من الباك-إند
//   // ======================================================
//   useEffect(() => {
//     const loadReports = async () => {
//       try {
//         const res = await fetch(API_URL)
//         const data = await res.json()

//         if (!res.ok) throw new Error(data.message)

//         setSalesData(data.sales || [])
//         setInventoryData(data.inventory || [])
//         setProfitData(data.profit || [])
//         setUserStats(data.userStats || [])
//         setLogs(data.logs || [])

//       } catch (err) {
//         console.error(err)
//         toast.error("فشل تحميل بيانات التقارير")
//       }
//     }

//     loadReports()
//   }, [])

//   // ======================================================
//   // 🔍 الفلاتر
//   // ======================================================
//   const handleFilter = () => {
//     toast.success("تم تطبيق الفلتر (تمثيلي – لم نربطه بعد)")
//   }

//   // ======================================================
//   // 🖨️ طباعة
//   // ======================================================
//   const printAllReports = () => {
//     const content = printRef.current.innerHTML
//     const printWindow = window.open('', '_blank', 'width=900,height=700')

//     printWindow.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>طباعة التقارير</title>
//           <style>
//             body { font-family: 'Tajawal'; padding: 20px; direction: rtl; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ccc; padding: 6px; }
//             th { background: #f0f0f0; }
//             h2 { text-align: center; color: #0ea5e9; }
//           </style>
//         </head>
//         <body>${content}</body>
//       </html>
//     `)

//     printWindow.document.close()
//     printWindow.print()
//   }

//   // ======================================================
//   // 🔘 أزرار التبويبات
//   // ======================================================
//   const tabButton = (key, label, icon) => (
//     <button
//       key={key}
//       onClick={() => setActiveTab(key)}
//       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm border-b-4 transition ${
//         activeTab === key
//           ? 'bg-sky-50 text-sky-700 border-sky-500'
//           : 'border-transparent hover:bg-gray-50 hover:text-sky-700'
//       }`}
//     >
//       {icon} {label}
//     </button>
//   )

//   return (
//     <Layout user={user} title="📊 التقارير الشاملة">
//       <div dir="rtl" className="space-y-6">

//         {/* 📌 التبويبات */}
//         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
//           {tabButton('summary', 'الملخص العام', '📋')}
//           {tabButton('sales', 'المبيعات', '💰')}
//           {tabButton('inventory', 'المخزون', '📦')}
//           {tabButton('profit', 'الأرباح', '📈')}
//           {tabButton('users', 'المستخدمين', '👥')}
//           {tabButton('system', 'النظام', '⚙️')}
//         </div>

//         {/* فلاتر */}
//         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between bg-gradient-to-br from-sky-50 to-white">
//           <div className="flex flex-wrap gap-2">
//             <label>من:</label>
//             <input
//               type="date"
//               className="px-3 py-2 border rounded-md"
//               value={dateRange.from}
//               onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
//             />

//             <label>إلى:</label>
//             <input
//               type="date"
//               className="px-3 py-2 border rounded-md"
//               value={dateRange.to}
//               onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
//             />

//             <select
//               className="px-3 py-2 border rounded-md"
//               value={selectedUser}
//               onChange={(e) => setSelectedUser(e.target.value)}
//             >
//               <option value="all">كل المستخدمين</option>
//               {userStats.map(u => (
//                 <option key={u.name} value={u.name}>{u.name}</option>
//               ))}
//             </select>

//             <button
//               onClick={handleFilter}
//               className="px-4 py-2 text-white rounded-md bg-sky-600 hover:bg-sky-700"
//             >
//               🔍 تطبيق
//             </button>
//           </div>

//           <button
//             onClick={printAllReports}
//             className="px-4 py-2 text-white rounded-md bg-amber-600 hover:bg-amber-700"
//           >
//             🖨️ طباعة
//           </button>
//         </div>

//         {/* المحتوى */}
//         <motion.div ref={printRef} key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

//           {activeTab === 'summary' && (
//             <SummaryTab
//               sales={salesData}
//               profit={profitData}
//               inventory={inventoryData}
//             />
//           )}

//           {activeTab === 'sales' && <SalesTab sales={salesData} />}
//           {activeTab === 'inventory' && <InventoryTab inventory={inventoryData} />}
//           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
//           {activeTab === 'users' && <UsersTab userStats={userStats} />}
//           {activeTab === 'system' && <SystemTab logs={logs} />}

//         </motion.div>

//       </div>
//     </Layout>
//   )
// }

// //
// // --------------------------------------------------
// //  🔽  التبويبات الفرعية — بدون تغيير تصميمك
// // --------------------------------------------------
// //

// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white">
//       <p className="text-sm text-gray-600">{title}</p>
//       <h3 className={`text-xl font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }

// function SummaryTab({ sales, profit, inventory }) {
//   const totalSales = sales.reduce((s, x) => s + x.total, 0)
//   const totalProfit = profit.reduce((s, x) => s + x.profit, 0)
//   const lowStock = inventory.filter(x => x.qty <= 3).length

//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold">📋 الملخص العام</h3>

//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
//         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600" />
//         <SummaryCard title="أدويه منخفضة" value={lowStock} color="text-red-600" />
//         <SummaryCard title="عدد المنتجات" value={inventory.length} color="text-amber-600" />
//       </div>
//     </div>
//   )
// }

// function SalesTab({ sales }) {
//   const grouped = sales.reduce((acc, s) => {
//     if (!acc[s.date]) acc[s.date] = []
//     acc[s.date].push(s)
//     return acc
//   }, {})

//   return (
//     <div className="space-y-6">
//       {Object.keys(grouped).map(day => {
//         const list = grouped[day]
//         const total = list.reduce((sum, x) => sum + x.total, 0)
//         const qty = list.reduce((sum, x) => sum + x.qty, 0)

//         return (
//           <div key={day} className="p-4 bg-white border rounded-lg shadow-sm">
//             <h3 className="font-bold text-sky-700">📅 {day}</h3>

//             <div className="grid grid-cols-2 gap-4 my-3 sm:grid-cols-4">
//               <SummaryCard title="عدد الأصناف" value={list.length} color="text-blue-600" />
//               <SummaryCard title="إجمالي القطع" value={qty} color="text-green-600" />
//               <SummaryCard title="إجمالي اليوم" value={`${total} ر.س`} color="text-sky-600" />
//             </div>

//             <table className="w-full text-sm border-t">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th>المنتج</th>
//                   <th>الكمية</th>
//                   <th>السعر</th>
//                   <th>الإجمالي</th>
//                   <th>الكاشير</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {list.map((s, i) => (
//                   <tr key={i} className="border-t hover:bg-gray-50">
//                     <td>{s.name}</td>
//                     <td>{s.qty}</td>
//                     <td>{s.price}</td>
//                     <td>{s.total}</td>
//                     <td>{s.cashier}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// function InventoryTab({ inventory }) {
//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">
//       <h3 className="mb-3 font-semibold">📦 المخزون</h3>

//       <table className="w-full text-sm border-t">
//         <thead className="bg-gray-50">
//           <tr>
//             <th>الدواء</th>
//             <th>الكمية</th>
//             <th>الانتهاء</th>
//             <th>الحالة</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inventory.map((item, i) => {
//             const expired = new Date(item.expiry) < new Date()

//             return (
//               <tr key={i} className="border-t hover:bg-gray-50">
//                 <td>{item.name}</td>
//                 <td>{item.qty}</td>
//                 <td>{item.expiry}</td>
//                 <td>
//                   {expired ? '❌ منتهي' : item.qty <= 3 ? '⚠️ منخفض' : '✔️ جيد'}
//                 </td>
//               </tr>
//             )
//           })}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// function ProfitTab({ profitData }) {
//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">
//       <h3 className="mb-4 font-semibold">📈 الأرباح</h3>

//       <ResponsiveContainer width="100%" height={260}>
//         <LineChart data={profitData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Line dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// function UsersTab({ userStats }) {
//   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']

//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">
//       <h3 className="font-semibold">👥 أداء المستخدمين</h3>

//       <ResponsiveContainer width="100%" height={260}>
//         <PieChart>
//           <Pie
//             data={userStats}
//             dataKey="sales"
//             nameKey="name"
//             outerRadius={90}
//             label
//           >
//             {userStats.map((_, i) => (
//               <Cell key={i} fill={COLORS[i % 3]} />
//             ))}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>

//       <table className="w-full text-sm border-t">
//         <thead className="bg-gray-50">
//           <tr>
//             <th>المستخدم</th>
//             <th>المبيعات</th>
//           </tr>
//         </thead>
//         <tbody>
//           {userStats.map((u, i) => (
//             <tr key={i} className="border-t hover:bg-gray-50">
//               <td>{u.name}</td>
//               <td>{u.sales} ر.س</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// function SystemTab({ logs }) {
//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">
//       <h3 className="font-semibold">⚙️ سجل النظام</h3>

//       <table className="w-full text-sm border-t">
//         <thead className="bg-gray-50">
//           <tr>
//             <th>الوقت</th>
//             <th>المستخدم</th>
//             <th>الإجراء</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.map((l, i) => (
//             <tr key={i} className="border-t hover:bg-gray-50">
//               <td>{l.time}</td>
//               <td>{l.user}</td>
//               <td>{l.action}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }





// import { useState, useEffect, useRef } from 'react'
// import { motion } from 'framer-motion'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import toast from 'react-hot-toast'
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//   PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar
// } from 'recharts'

// import ProfitReport from '../components/profitReport'

// export default function Reports() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [activeTab, setActiveTab] = useState('summary')
//   const [dateRange, setDateRange] = useState({ from: '', to: '' })
//   const [selectedUser, setSelectedUser] = useState('all')
//   const printRef = useRef(null)

//   const [salesData, setSalesData] = useState([])
//   const [inventoryData, setInventoryData] = useState([])
//   const [profitData, setProfitData] = useState([])
//   const [userStats, setUserStats] = useState([])
//   const [logs, setLogs] = useState([])

//   // 🔹 تحميل البيانات الأولية
//   useEffect(() => {
//     setSalesData([
//       { id: 1, date: '2025-11-01', name: 'باراسيتامول 500mg', qty: 4, price: 15, cashier: 'أحمد' },
//       { id: 2, date: '2025-11-01', name: 'فيتامين سي 1000mg', qty: 2, price: 25, cashier: 'محمد' },
//       { id: 3, date: '2025-11-02', name: 'أموكسيسيلين 250mg', qty: 3, price: 45, cashier: 'أحمد' },
//       { id: 4, date: '2025-11-02', name: 'ايبوبروفين 400mg', qty: 5, price: 30, cashier: 'مها' },
//       { id: 5, date: '2025-11-03', name: 'فيتامين د', qty: 6, price: 20, cashier: 'أحمد' },
//       { id: 6, date: '2025-11-03', name: 'كريم بانثينول', qty: 3, price: 40, cashier: 'محمد' },
//     ])

//     setInventoryData([
//       { name: 'باراسيتامول', qty: 8, expiry: '2025-12-10' },
//       { name: 'أموكسيسيلين', qty: 2, expiry: '2024-06-02' },
//       { name: 'ايبوبروفين', qty: 6, expiry: '2025-08-10' },
//     ])

//     setProfitData([
//       { month: 'أكتوبر', profit: 3200 },
//       { month: 'نوفمبر', profit: 4800 },
//       { month: 'ديسمبر', profit: 5100 },
//     ])

//     setUserStats([
//       { name: 'محمد', sales: 1200 },
//       { name: 'أحمد', sales: 1500 },
//       { name: 'مها', sales: 800 },
//     ])

//     setLogs([
//       { time: '10:15', user: 'أحمد', action: 'تسجيل دخول' },
//       { time: '10:30', user: 'محمد', action: 'إضافة دواء جديد' },
//       { time: '11:10', user: 'مها', action: 'تعديل صلاحيات مستخدم' },
//     ])
//   }, [])

//   // 🔸 الفلترة
//   const handleFilter = () => {
//     toast.success(`✅ تم تطبيق الفلتر من ${dateRange.from || 'بداية الشهر'} إلى ${dateRange.to || 'اليوم'}`)
//   }

//   // 🔸 الطباعة
//   const printAllReports = () => {
//     const content = printRef.current.innerHTML
//     const printWindow = window.open('', '_blank', 'width=900,height=700')
//     printWindow.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير شامل</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
//             th { background: #f5f5f5; }
//             h2 { text-align: center; color: #0ea5e9; }
//           </style>
//         </head>
//         <body>${content}</body>
//       </html>
//     `)
//     printWindow.document.close()
//     printWindow.print()
//   }

//   // 🔹 التبويبات
//   const tabButton = (key, label, icon) => (
//     <button
//       key={key}
//       onClick={() => setActiveTab(key)}
//       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
//         activeTab === key
//           ? 'text-sky-700 border-sky-500 bg-sky-50'
//           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
//       }`}
//     >
//       <span>{icon}</span> {label}
//     </button>
//   )

//   return (
//     <Layout user={user} title="📊 لوحة التقارير الشاملة">
//       <div dir="rtl" className="space-y-6">
//         {/* شريط التبويبات */}
//         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
//           {tabButton('summary', 'الملخص العام', '📋')}
//           {tabButton('sales', 'المبيعات', '💰')}
//           {tabButton('inventory', 'المخزون', '📦')}
//           {tabButton('profit', 'الأرباح', '📈')}
//           {tabButton('users', 'المستخدمين', '👥')}
//           {tabButton('system', 'النظام', '⚙️')}
//         </div>

//         {/* شريط الفلاتر */}
//         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             <label className="text-sm text-gray-700">من:</label>
//             <input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} className="px-3 py-2 text-sm border rounded-md" />
//             <label className="text-sm text-gray-700">إلى:</label>
//             <input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} className="px-3 py-2 text-sm border rounded-md" />

//             <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               <option value="all">كل المستخدمين</option>
//               <option value="أحمد">أحمد</option>
//               <option value="محمد">محمد</option>
//               <option value="مها">مها</option>
//             </select>

//             <button onClick={handleFilter} className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700">
//               🔍 تطبيق الفلتر
//             </button>
//           </div>

//           <button onClick={printAllReports} className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700">
//             🖨️ طباعة الكل
//           </button>
//         </div>

//         {/* المحتوى */}
//         <motion.div ref={printRef} key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
//           {activeTab === 'summary' && <SummaryTab salesData={salesData} inventoryData={inventoryData} profitData={profitData} />}
//           {activeTab === 'sales' && <DetailedSalesReport sales={salesData} />}
//           {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
//           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
//           {activeTab === 'users' && <UsersTab userStats={userStats} />}
//           {activeTab === 'system' && <SystemTab logs={logs} />}
//         </motion.div>
//       </div>
//     </Layout>
//   )
// }

// /* 📋 الملخص العام */
// function SummaryTab({ salesData, inventoryData, profitData }) {
//   const totalSales = salesData.reduce((s, x) => s + x.qty * x.price, 0)
//   const lowStock = inventoryData.filter((x) => x.qty <= 3).length
//   const totalProfit = profitData.reduce((s, x) => s + x.profit, 0)

//   return (
//     <div className="p-6 space-y-6 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📋 ملخص الصيدلية العام</h3>
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
//         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600" />
//         <SummaryCard title="المنتجات المنخفضة" value={lowStock} color="text-red-600" />
//         <SummaryCard title="عدد المنتجات" value={inventoryData.length} color="text-amber-600" />
//       </div>
//       <ResponsiveContainer width="100%" height={260}>
//         <BarChart data={salesData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="qty" fill={theme.colors.primary} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* 💰 تقرير المبيعات المفصل */
// function DetailedSalesReport({ sales }) {
//   const grouped = sales.reduce((acc, s) => {
//     if (!acc[s.date]) acc[s.date] = []
//     acc[s.date].push(s)
//     return acc
//   }, {})

//   return (
//     <div dir="rtl" className="space-y-6">
//       {Object.keys(grouped).map((day) => {
//         const list = grouped[day]
//         const total = list.reduce((sum, s) => sum + s.qty * s.price, 0)
//         const totalQty = list.reduce((sum, s) => sum + s.qty, 0)
//         const cashiers = [...new Set(list.map((s) => s.cashier))].join(', ')

//         return (
//           <div key={day} className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 📅 مبيعات يوم <span className="text-sky-600">{day}</span>
//               </h3>
//             </div>
//             <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//               <SummaryCard title="عدد الأصناف" value={list.length} color="text-blue-600" />
//               <SummaryCard title="إجمالي القطع" value={totalQty} color="text-green-600" />
//               <SummaryCard title="إجمالي اليوم" value={`${total} ر.س`} color="text-sky-600" />
//               <SummaryCard title="الكاشيرين" value={cashiers} color="text-amber-600" />
//             </div>
//             <table className="w-full text-sm text-right border-t border-gray-100">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">#</th>
//                   <th className="px-3 py-2">المنتج</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                   <th className="px-3 py-2">الكاشير</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {list.map((s, i) => (
//                   <tr key={s.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{i + 1}</td>
//                     <td className="px-3 py-2">{s.name}</td>
//                     <td className="px-3 py-2">{s.qty}</td>
//                     <td className="px-3 py-2">{s.price} ر.س</td>
//                     <td className="px-3 py-2 font-semibold text-sky-700">{s.qty * s.price} ر.س</td>
//                     <td className="px-3 py-2">{s.cashier}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// /* 📦 المخزون */
// /* ------------------------ 📦 تقرير المخزون ------------------------ */
// function InventoryTab({ inventoryData }) {
//   const [sortKey, setSortKey] = useState('name')
//   const [sortDir, setSortDir] = useState('asc')

//   // 🔹 ترتيب المخزون حسب العمود المحدد
//   const sortedData = [...inventoryData].sort((a, b) => {
//     if (sortKey === 'qty') {
//       return sortDir === 'asc' ? a.qty - b.qty : b.qty - a.qty
//     } else if (sortKey === 'expiry') {
//       return sortDir === 'asc'
//         ? new Date(a.expiry) - new Date(b.expiry)
//         : new Date(b.expiry) - new Date(a.expiry)
//     } else {
//       return sortDir === 'asc'
//         ? a.name.localeCompare(b.name, 'ar')
//         : b.name.localeCompare(a.name, 'ar')
//     }
//   })

//   // 🔸 عناوين الأعمدة
//   const headerCell = (label, key) => (
//     <th
//       onClick={() => {
//         if (sortKey === key) {
//           setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
//         } else {
//           setSortKey(key)
//           setSortDir('asc')
//         }
//       }}
//       className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//     >
//       {label} {sortKey === key ? (sortDir === 'asc' ? '⬆️' : '⬇️') : ''}
//     </th>
//   )

//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center">
//         <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون الحالي</h3>
//         <p className="text-sm text-gray-500">إجمالي الأصناف: {inventoryData.length}</p>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-sm text-right border-t border-gray-100">
//           <thead className="text-gray-600 bg-gray-50">
//             <tr>
//               {headerCell('اسم الدواء', 'name')}
//               {headerCell('الكمية', 'qty')}
//               {headerCell('تاريخ الانتهاء', 'expiry')}
//               <th className="px-3 py-2">الحالة</th>
//             </tr>
//           </thead>

//           <tbody>
//             {sortedData.map((item, idx) => {
//               const isLow = item.qty <= 3
//               const isExpired = new Date(item.expiry) < new Date()
//               const isNearExpiry = new Date(item.expiry) - new Date() < 30 * 24 * 60 * 60 * 1000 // أقل من 30 يومًا

//               return (
//                 <tr key={idx} className="transition border-t hover:bg-gray-50">
//                   <td className="px-3 py-2 font-medium text-gray-700">{item.name}</td>
//                   <td className={`px-3 py-2 ${isLow ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
//                     {item.qty}
//                   </td>
//                   <td className={`px-3 py-2 ${isExpired ? 'text-red-600' : isNearExpiry ? 'text-amber-600' : ''}`}>
//                     {item.expiry}
//                   </td>
//                   <td className="px-3 py-2">
//                     {isExpired
//                       ? '❌ منتهي الصلاحية'
//                       : isLow
//                       ? '⚠️ مخزون منخفض'
//                       : isNearExpiry
//                       ? '⏰ قرب الانتهاء'
//                       : '✅ صالح'}
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }



// function ProfitTab({ profitData }) {
//   const [sortKey, setSortKey] = useState('month'); // فرز البيانات حسب الشهر أو الأرباح
//   const [sortDir, setSortDir] = useState('asc');  // ترتيب البيانات تصاعدي أو تنازلي

//   // 🔹 ترتيب الأرباح حسب العمود المحدد
//   const sortedData = [...profitData].sort((a, b) => {
//     if (sortKey === 'profit') {
//       return sortDir === 'asc' ? a.profit - b.profit : b.profit - a.profit;
//     } else {
//       return sortDir === 'asc'
//         ? a.month.localeCompare(b.month)  // فرز تصاعدي حسب الشهر
//         : b.month.localeCompare(a.month); // فرز تنازلي حسب الشهر
//     }
//   });

//   // 🔸 عناوين الأعمدة
//   const headerCell = (label, key) => (
//     <th
//       onClick={() => {
//         if (sortKey === key) {
//           setSortDir(sortDir === 'asc' ? 'desc' : 'asc');  // التبديل بين الترتيب التصاعدي والتنازلي
//         } else {
//           setSortKey(key);
//           setSortDir('asc');
//         }
//       }}
//       className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//     >
//       {label} {sortKey === key ? (sortDir === 'asc' ? '⬆️' : '⬇️') : ''}
//     </th>
//   );

//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📈 تقرير الأرباح الشهرية</h3>
      
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm text-right border-t border-gray-100">
//           <thead className="text-gray-600 bg-gray-50">
//             <tr>
//               {headerCell('الشهر', 'month')}
//               {headerCell('الأرباح', 'profit')}
//             </tr>
//           </thead>

//           <tbody>
//             {sortedData.map((item, idx) => (
//               <tr key={idx} className="border-t hover:bg-gray-50">
//                 <td className="px-3 py-2">{item.month}</td>
//                 <td className="px-3 py-2">{item.profit} ر.س</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* عرض الرسم البياني للأرباح الشهرية */}
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={sortedData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }



// /* 👥 المستخدمين */
// function UsersTab({ userStats }) {
//   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']; // ألوان مخصصة للمخطط

//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">
//       <h3 className="mb-3 text-lg font-semibold text-gray-800">👥 أداء المستخدمين</h3>

//       {/* رسم بياني لتمثيل أداء المستخدمين */}
//       <ResponsiveContainer width="100%" height={260}>
//         <PieChart>
//           <Pie
//             data={userStats}
//             dataKey="sales"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={90}
//             label
//           >
//             {userStats.map((_, i) => (
//               <Cell key={i} fill={COLORS[i % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>

//       {/* جدول لأداء المستخدمين */}
//       <div className="mt-6">
//         <table className="w-full text-sm text-right border-t border-gray-100">
//           <thead className="text-gray-600 bg-gray-50">
//             <tr>
//               <th className="px-3 py-2">#</th>
//               <th className="px-3 py-2">اسم المستخدم</th>
//               <th className="px-3 py-2">إجمالي المبيعات</th>
//             </tr>
//           </thead>
//           <tbody>
//             {userStats.map((user, idx) => (
//               <tr key={idx} className="border-t hover:bg-gray-50">
//                 <td className="px-3 py-2">{idx + 1}</td>
//                 <td className="px-3 py-2">{user.name}</td>
//                 <td className="px-3 py-2">{user.sales} ر.س</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


// /* ⚙️ النظام */
// function SystemTab({ logs }) {
//   return (
//     <div className="p-5 bg-white border rounded-lg shadow-sm">
//       <h3 className="mb-3 text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
//       <table className="w-full text-sm text-right border-t border-gray-100">
//         <thead className="text-gray-600 bg-gray-50">
//           <tr>
//             <th className="px-3 py-2">الوقت</th>
//             <th className="px-3 py-2">المستخدم</th>
//             <th className="px-3 py-2">الإجراء</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.map((log, idx) => (
//             <tr key={idx} className="border-t hover:bg-gray-50">
//               <td className="px-3 py-2">{log.time}</td>
//               <td className="px-3 py-2">{log.user}</td>
//               <td className="px-3 py-2">{log.action}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// /* 🧩 بطاقة */
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center transition border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-lg font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }












// import { useState, useEffect, useRef } from 'react'
// import Layout from '../components/Layout'
// import SalesReport from './SalesReport'
// import ProfitReport from './ProfitReport'
// import InventoryReport from './InventoryReport'
// import toast from 'react-hot-toast'

// export default function Reports() {
//   const [activeTab, setActiveTab] = useState('sales')
//   const [salesData, setSalesData] = useState([])
//   const [profitData, setProfitData] = useState([])
//   const [inventoryData, setInventoryData] = useState([])
//   const [dateRange, setDateRange] = useState({ from: '', to: '' })
//   const [selectedUser, setSelectedUser] = useState('all')

//   const printRef = useRef(null)

//   // 🔹 تحميل البيانات الأولية
//   useEffect(() => {
//     setSalesData([
//       { id: 1, date: '2025-11-01', product: 'باراسيتامول', qty: 10, total: 100 },
//       { id: 2, date: '2025-11-02', product: 'أموكسيسيلين', qty: 5, total: 50 },
//     ])

//     setProfitData([
//       { month: 'نوفمبر', revenue: 5000, expenses: 2000, profit: 3000 },
//     ])

//     setInventoryData([
//       { name: 'باراسيتامول', qty: 50, expiry: '2025-12-10' },
//       { name: 'أموكسيسيلين', qty: 30, expiry: '2024-05-15' },
//     ])
//   }, [])

//   // 🔸 الفلترة
//   const handleFilter = () => {
//     toast.success(`✅ تم تطبيق الفلتر من ${dateRange.from || 'بداية الشهر'} إلى ${dateRange.to || 'اليوم'}`)
//   }

//   // 🔸 الطباعة
//   const printAllReports = () => {
//     const content = printRef.current.innerHTML
//     const printWindow = window.open('', '_blank', 'width=900,height=700')
//     printWindow.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير شامل</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
//             th { background: #f5f5f5; }
//             h2 { text-align: center; color: #0ea5e9; }
//           </style>
//         </head>
//         <body>${content}</body>
//       </html>
//     `)
//     printWindow.document.close()
//     printWindow.print()
//   }

//   // 🔹 التبويبات
//   const tabButton = (key, label, icon) => (
//     <button
//       key={key}
//       onClick={() => setActiveTab(key)}
//       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
//         activeTab === key
//           ? 'text-sky-700 border-sky-500 bg-sky-50'
//           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
//       }`}
//     >
//       <span>{icon}</span> {label}
//     </button>
//   )

//   return (
//     <Layout user={{ name: 'المدير أحمد', role: 'admin' }} title="📊 لوحة التقارير الشاملة">
//       <div dir="rtl" className="space-y-6">
//         {/* شريط التبويبات */}
//         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
//           {tabButton('summary', 'الملخص العام', '📋')}
//           {tabButton('sales', 'المبيعات', '💰')}
//           {tabButton('inventory', 'المخزون', '📦')}
//           {tabButton('profit', 'الأرباح', '📈')}
//           {tabButton('users', 'المستخدمين', '👥')}
//           {tabButton('system', 'النظام', '⚙️')}
//         </div>

//         {/* شريط الفلاتر */}
//         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             <label className="text-sm text-gray-700">من:</label>
//             <input
//               type="date"
//               value={dateRange.from}
//               onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//             <label className="text-sm text-gray-700">إلى:</label>
//             <input
//               type="date"
//               value={dateRange.to}
//               onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
//               className="px-3 py-2 text-sm border rounded-md"
//             />

//             <select
//               value={selectedUser}
//               onChange={(e) => setSelectedUser(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل المستخدمين</option>
//               <option value="أحمد">أحمد</option>
//               <option value="محمد">محمد</option>
//               <option value="مها">مها</option>
//             </select>

//             <button
//               onClick={handleFilter}
//               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
//             >
//               🔍 تطبيق الفلتر
//             </button>
//           </div>

//           <button
//             onClick={printAllReports}
//             className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700"
//           >
//             🖨️ طباعة الكل
//           </button>
//         </div>

//         {/* المحتوى */}
//         <motion.div
//           ref={printRef}
//           key={activeTab}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           {activeTab === 'summary' && <SummaryTab salesData={salesData} inventoryData={inventoryData} profitData={profitData} />}
//           {activeTab === 'sales' && <SalesTab salesData={salesData} />}
//           {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
//           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
//           {activeTab === 'users' && <UsersTab userStats={userStats} />}
//           {activeTab === 'system' && <SystemTab logs={logs} />}
//         </motion.div>
//       </div>
//     </Layout>
//   )
// }

// // 📋 الملخص العام
// function SummaryTab({ salesData, inventoryData, profitData }) {
//   const totalSales = salesData.reduce((s, x) => s + x.qty * x.price, 0)
//   const lowStock = inventoryData.filter((x) => x.qty <= 3).length
//   const totalProfit = profitData.reduce((s, x) => s + x.profit, 0)

//   return (
//     <div className="p-6 space-y-6 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📋 ملخص الصيدلية العام</h3>
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
//         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600" />
//         <SummaryCard title="المنتجات المنخفضة" value={lowStock} color="text-red-600" />
//         <SummaryCard title="عدد المنتجات" value={inventoryData.length} color="text-amber-600" />
//       </div>
//       <ResponsiveContainer width="100%" height={260}>
//         <BarChart data={salesData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="qty" fill={theme.colors.primary} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// // 💰 تقرير المبيعات
// function SalesTab({ salesData }) {
//   const totalSales = salesData.reduce((sum, s) => sum + s.total, 0)
//   const avg = (totalSales / salesData.length).toFixed(2)
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">💰 تقرير المبيعات</h3>
//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
//         <SummaryCard title="عدد العمليات" value={salesData.length} color="text-blue-600" />
//         <SummaryCard title="متوسط المبيعات" value={`${avg} ر.س`} color="text-green-600" />
//         <SummaryCard title="أعلى مبيعات" value="أحمد" color="text-amber-600" />
//       </div>

//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={salesData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// // 📦 تقرير المخزون
// function InventoryTab({ inventoryData }) {
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون</h3>
//       <table className="w-full text-sm text-right border-t border-gray-100">
//         <thead className="text-gray-600 bg-gray-50">
//           <tr>
//             <th className="px-3 py-2">اسم الدواء</th>
//             <th className="px-3 py-2">الكمية</th>
//             <th className="px-3 py-2">تاريخ الانتهاء</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inventoryData.map((i, idx) => (
//             <tr key={idx} className="border-t hover:bg-gray-50">
//               <td className="px-3 py-2">{i.name}</td>
//               <td className={`px-3 py-2 ${i.qty <= 3 ? 'text-red-600' : 'text-green-700'}`}>{i.qty}</td>
//               <td className="px-3 py-2">{i.expiry}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// // 📈 تقرير الأرباح
// function ProfitTab({ profitData }) {
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📈 تقرير الأرباح</h3>
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={profitData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// // 👥 تقرير المستخدمين
// function UsersTab({ userStats }) {
//   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="mb-3 text-lg font-semibold text-gray-800">👥 أداء المستخدمين</h3>
//       <ResponsiveContainer width="100%" height={250}>
//         <PieChart>
//           <Pie data={userStats} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
//             {userStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// // ⚙️ سجل النظام
// function SystemTab({ logs }) {
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
//       <table className="w-full text-sm text-right border-t border-gray-100">
//         <thead className="text-gray-600 bg-gray-50">
//           <tr>
//             <th className="px-3 py-2">الوقت</th>
//             <th className="px-3 py-2">المستخدم</th>
//             <th className="px-3 py-2">الإجراء</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.map((log, idx) => (
//             <tr key={idx} className="border-t hover:bg-gray-50">
//               <td className="px-3 py-2">{log.time}</td>
//               <td className="px-3 py-2">{log.user}</td>
//               <td className="px-3 py-2">{log.action}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// // 🧩 بطاقة الملخص
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center transition border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-lg font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }


















// import { useState, useEffect, useRef } from 'react'
// import { motion } from 'framer-motion'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import toast from 'react-hot-toast'
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//   PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar
// } from 'recharts'

// export default function Reports() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [activeTab, setActiveTab] = useState('summary')
//   const [dateRange, setDateRange] = useState({ from: '', to: '' })
//   const [selectedUser, setSelectedUser] = useState('all')
//   const printRef = useRef(null)

//   const [salesData, setSalesData] = useState([])
//   const [inventoryData, setInventoryData] = useState([])
//   const [profitData, setProfitData] = useState([])
//   const [userStats, setUserStats] = useState([])
//   const [logs, setLogs] = useState([])

//   // بيانات أولية
//   useEffect(() => {
//     setSalesData([
//       { id: 1, date: '2025-11-01', name: 'باراسيتامول 500mg', qty: 4, price: 15, cashier: 'أحمد' },
//       { id: 2, date: '2025-11-01', name: 'فيتامين سي 1000mg', qty: 2, price: 25, cashier: 'محمد' },
//       { id: 3, date: '2025-11-02', name: 'أموكسيسيلين 250mg', qty: 3, price: 45, cashier: 'أحمد' },
//       { id: 4, date: '2025-11-02', name: 'ايبوبروفين 400mg', qty: 5, price: 30, cashier: 'مها' },
//       { id: 5, date: '2025-11-03', name: 'فيتامين د', qty: 6, price: 20, cashier: 'أحمد' },
//       { id: 6, date: '2025-11-03', name: 'كريم بانثينول', qty: 3, price: 40, cashier: 'محمد' },
//     ])

//     setInventoryData([
//       { name: 'باراسيتامول', qty: 8, expiry: '2025-12-10' },
//       { name: 'أموكسيسيلين', qty: 2, expiry: '2024-06-02' },
//       { name: 'ايبوبروفين', qty: 6, expiry: '2025-08-10' },
//     ])

//     setProfitData([
//       { month: 'أكتوبر', profit: 3200 },
//       { month: 'نوفمبر', profit: 4800 },
//       { month: 'ديسمبر', profit: 5100 },
//     ])

//     setUserStats([
//       { name: 'محمد', sales: 1200 },
//       { name: 'أحمد', sales: 1500 },
//       { name: 'مها', sales: 800 },
//     ])

//     setLogs([
//       { time: '10:15', user: 'أحمد', action: 'تسجيل دخول' },
//       { time: '10:30', user: 'محمد', action: 'إضافة دواء جديد' },
//       { time: '11:10', user: 'مها', action: 'تعديل صلاحيات مستخدم' },
//     ])
//   }, [])

//   const handleFilter = () => {
//     toast.success(`✅ تم تطبيق الفلتر من ${dateRange.from || 'بداية الشهر'} إلى ${dateRange.to || 'اليوم'}`)
//   }

//   const printAllReports = () => {
//     const content = printRef.current.innerHTML
//     const printWindow = window.open('', '_blank', 'width=900,height=700')
//     printWindow.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير شامل</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
//             th { background: #f5f5f5; }
//             h2 { text-align: center; color: #0ea5e9; }
//           </style>
//         </head>
//         <body>${content}</body>
//       </html>
//     `)
//     printWindow.document.close()
//     printWindow.print()
//   }

//   const tabButton = (key, label, icon) => (
//     <button
//       key={key}
//       onClick={() => setActiveTab(key)}
//       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
//         activeTab === key
//           ? 'text-sky-700 border-sky-500 bg-sky-50'
//           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
//       }`}
//     >
//       <span>{icon}</span> {label}
//     </button>
//   )

//   return (
//     <Layout user={user} title="📊 لوحة التقارير الشاملة">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔹 شريط التبويبات */}
//         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
//           {tabButton('summary', 'الملخص العام', '📋')}
//           {tabButton('sales', 'المبيعات', '💰')}
//           {tabButton('inventory', 'المخزون', '📦')}
//           {tabButton('profit', 'الأرباح', '📈')}
//           {tabButton('users', 'المستخدمين', '👥')}
//           {tabButton('system', 'النظام', '⚙️')}
//         </div>

//         {/* 🔸 شريط الفلاتر + طباعة الكل */}
//         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             <label className="text-sm text-gray-700">من:</label>
//             <input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} className="px-3 py-2 text-sm border rounded-md" />
//             <label className="text-sm text-gray-700">إلى:</label>
//             <input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} className="px-3 py-2 text-sm border rounded-md" />

//             <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               <option value="all">كل المستخدمين</option>
//               <option value="أحمد">أحمد</option>
//               <option value="محمد">محمد</option>
//               <option value="مها">مها</option>
//             </select>

//             <button onClick={handleFilter} className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700">🔍 تطبيق الفلتر</button>
//           </div>

//           <button onClick={printAllReports} className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700">
//             🖨️ طباعة الكل
//           </button>
//         </div>

//         {/* 🔻 المحتوى المتغير حسب التبويب */}
//         <motion.div ref={printRef} key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
//           {activeTab === 'summary' && <SummaryTab salesData={salesData} inventoryData={inventoryData} profitData={profitData} />}
//           {activeTab === 'sales' && <DetailedSalesReport sales={salesData} />}
//           {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
//           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
//           {activeTab === 'users' && <UsersTab userStats={userStats} />}
//           {activeTab === 'system' && <SystemTab logs={logs} />}
//         </motion.div>
//       </div>
//     </Layout>
//   )
// }

// /* 💰 تقرير المبيعات المفصل */
// function DetailedSalesReport({ sales }) {
//   const grouped = sales.reduce((acc, s) => {
//     if (!acc[s.date]) acc[s.date] = []
//     acc[s.date].push(s)
//     return acc
//   }, {})

//   const handlePrintDay = (day) => {
//     const content = document.getElementById(`day-${day}`).innerHTML
//     const printWindow = window.open('', '_blank', 'width=800,height=600')
//     printWindow.document.write(`
//       <html dir="rtl" lang="ar">
//         <head><title>تقرير المبيعات - ${day}</title></head>
//         <body>${content}</body>
//       </html>
//     `)
//     printWindow.document.close()
//     printWindow.print()
//   }

//   return (
//     <div dir="rtl" className="space-y-6">
//       {Object.keys(grouped).map((day) => {
//         const list = grouped[day]
//         const total = list.reduce((sum, s) => sum + s.qty * s.price, 0)
//         const totalQty = list.reduce((sum, s) => sum + s.qty, 0)
//         const cashiers = [...new Set(list.map((s) => s.cashier))].join(', ')

//         return (
//           <div key={day} id={`day-${day}`} className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 📅 مبيعات يوم <span className="text-sky-600">{day}</span>
//               </h3>
//               <button onClick={() => handlePrintDay(day)} className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700">
//                 🖨️ طباعة هذا اليوم
//               </button>
//             </div>

//             <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//               <SummaryCard title="عدد الأصناف" value={list.length} color="text-blue-600" />
//               <SummaryCard title="إجمالي القطع" value={totalQty} color="text-green-600" />
//               <SummaryCard title="إجمالي اليوم" value={`${total} ر.س`} color="text-sky-600" />
//               <SummaryCard title="الكاشيرين" value={cashiers} color="text-amber-600" />
//             </div>

//             <table className="w-full text-sm text-right border-t border-gray-100">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">#</th>
//                   <th className="px-3 py-2">المنتج</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                   <th className="px-3 py-2">الكاشير</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {list.map((s, i) => (
//                   <tr key={s.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{i + 1}</td>
//                     <td className="px-3 py-2">{s.name}</td>
//                     <td className="px-3 py-2">{s.qty}</td>
//                     <td className="px-3 py-2">{s.price} ر.س</td>
//                     <td className="px-3 py-2 font-semibold text-sky-700">{s.qty * s.price} ر.س</td>
//                     <td className="px-3 py-2">{s.cashier}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// /* باقي التبويبات */
// function SummaryTab({ salesData, inventoryData, profitData }) { /* ... */ }
// function InventoryTab({ inventoryData }) { /* ... */ }
// function ProfitTab({ profitData }) { /* ... */ }
// function UsersTab({ userStats }) { /* ... */ }
// function SystemTab({ logs }) { /* ... */ }
// function SummaryCard({ title, value, color }) { /* ... */ }


















// import { useState, useEffect, useRef } from 'react'
// import { motion } from 'framer-motion'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import toast from 'react-hot-toast'
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//   PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar
// } from 'recharts'

// export default function Reports() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [activeTab, setActiveTab] = useState('summary')
//   const [dateRange, setDateRange] = useState({ from: '', to: '' })
//   const [selectedUser, setSelectedUser] = useState('all')

//   const printRef = useRef(null)

//   const [salesData, setSalesData] = useState([])
//   const [inventoryData, setInventoryData] = useState([])
//   const [profitData, setProfitData] = useState([])
//   const [userStats, setUserStats] = useState([])
//   const [logs, setLogs] = useState([])

//   useEffect(() => {
//     setSalesData([
//       { date: '2025-11-01', total: 320, cashier: 'أحمد' },
//       { date: '2025-11-02', total: 410, cashier: 'محمد' },
//       { date: '2025-11-03', total: 380, cashier: 'مها' },
//     ])
//     setInventoryData([
//       { name: 'باراسيتامول', qty: 8, expiry: '2025-12-10' },
//       { name: 'أموكسيسيلين', qty: 2, expiry: '2024-06-02' },
//       { name: 'ايبوبروفين', qty: 6, expiry: '2025-08-10' },
//     ])
//     setProfitData([
//       { month: 'أكتوبر', profit: 3200 },
//       { month: 'نوفمبر', profit: 4800 },
//       { month: 'ديسمبر', profit: 5100 },
//     ])
//     setUserStats([
//       { name: 'محمد', sales: 1200 },
//       { name: 'أحمد', sales: 1500 },
//       { name: 'مها', sales: 800 },
//     ])
//     setLogs([
//       { time: '10:15', user: 'أحمد', action: 'تسجيل دخول' },
//       { time: '10:30', user: 'محمد', action: 'إضافة دواء جديد' },
//       { time: '11:10', user: 'مها', action: 'تعديل صلاحيات مستخدم' },
//     ])
//   }, [])

//   const handleFilter = () => {
//     toast.success(`✅ تم تطبيق الفلتر من ${dateRange.from || 'بداية الشهر'} إلى ${dateRange.to || 'اليوم'}`)
//   }

//   const printCurrentReport = () => {
//     const content = printRef.current.innerHTML
//     const printWindow = window.open('', '_blank', 'width=800,height=600')
//     printWindow.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير ${activeTab}</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
//             th { background: #f5f5f5; }
//             h2 { text-align: center; color: #0ea5e9; }
//           </style>
//         </head>
//         <body>${content}</body>
//       </html>
//     `)
//     printWindow.document.close()
//     printWindow.print()
//   }

//   const tabButton = (key, label, icon) => (
//     <button
//       key={key}
//       onClick={() => setActiveTab(key)}
//       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
//         activeTab === key
//           ? 'text-sky-700 border-sky-500 bg-sky-50'
//           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
//       }`}
//     >
//       <span>{icon}</span> {label}
//     </button>
//   )

//   return (
//     <Layout user={user} title="📊 لوحة التقارير الشاملة">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔹 شريط التبويبات */}
//         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
//           {tabButton('summary', 'الملخص العام', '📋')}
//           {tabButton('sales', 'المبيعات', '💰')}
//           {tabButton('inventory', 'المخزون', '📦')}
//           {tabButton('profit', 'الأرباح', '📈')}
//           {tabButton('users', 'المستخدمين', '👥')}
//           {tabButton('system', 'النظام', '⚙️')}
//         </div>

//         {/* 🔸 شريط الفلاتر */}
//         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             <label className="text-sm text-gray-700">من:</label>
//             <input
//               type="date"
//               value={dateRange.from}
//               onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//             <label className="text-sm text-gray-700">إلى:</label>
//             <input
//               type="date"
//               value={dateRange.to}
//               onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
//               className="px-3 py-2 text-sm border rounded-md"
//             />

//             <select
//               value={selectedUser}
//               onChange={(e) => setSelectedUser(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل المستخدمين</option>
//               <option value="أحمد">أحمد</option>
//               <option value="محمد">محمد</option>
//               <option value="مها">مها</option>
//             </select>

//             <button
//               onClick={handleFilter}
//               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
//             >
//               🔍 تطبيق الفلتر
//             </button>
//           </div>

//           <div className="flex justify-end gap-2">
//             <button onClick={printCurrentReport} className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700">
//               🖨️ طباعة التقرير الحالي
//             </button>
//             <button onClick={() => toast.success('📄 تم تصدير PDF')} className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700">
//               📄 PDF
//             </button>
//             <button onClick={() => toast.success('📊 تم تصدير Excel')} className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">
//               📊 Excel
//             </button>
//           </div>
//         </div>

//         {/* 🔻 المحتوى المتغير حسب التبويب */}
//         <motion.div
//           ref={printRef}
//           key={activeTab}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           {activeTab === 'summary' && <SummaryTab salesData={salesData} inventoryData={inventoryData} profitData={profitData} />}
//           {activeTab === 'sales' && <SalesTab salesData={salesData} />}
//           {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
//           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
//           {activeTab === 'users' && <UsersTab userStats={userStats} />}
//           {activeTab === 'system' && <SystemTab logs={logs} />}
//         </motion.div>
//       </div>
//     </Layout>
//   )
// }

// /* ------------------------ 📋 تبويب الملخص العام ------------------------ */
// function SummaryTab({ salesData, inventoryData, profitData }) {
//   const totalSales = salesData.reduce((s, x) => s + x.total, 0)
//   const lowStock = inventoryData.filter((x) => x.qty <= 3).length
//   const totalProfit = profitData.reduce((s, x) => s + x.profit, 0)

//   return (
//     <div className="p-5 space-y-6 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📋 ملخص الصيدلية</h3>

//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
//         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600" />
//         <SummaryCard title="الأدوية منخفضة" value={lowStock} color="text-red-600" />
//         <SummaryCard title="عدد المنتجات" value={inventoryData.length} color="text-amber-600" />
//       </div>

//       <ResponsiveContainer width="100%" height={250}>
//         <BarChart data={salesData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="total" fill={theme.colors.primary} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* ------------------------ 💰 المبيعات ------------------------ */
// function SalesTab({ salesData }) {
//   const totalSales = salesData.reduce((sum, s) => sum + s.total, 0)
//   const avg = (totalSales / salesData.length).toFixed(2)
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">💰 تقرير المبيعات</h3>
//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
//         <SummaryCard title="عدد العمليات" value={salesData.length} color="text-blue-600" />
//         <SummaryCard title="متوسط المبيعات" value={`${avg} ر.س`} color="text-green-600" />
//         <SummaryCard title="أعلى مبيعات" value="أحمد" color="text-amber-600" />
//       </div>

//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={salesData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* ------------------------ 📦 المخزون ------------------------ */
// function InventoryTab({ inventoryData }) {
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون</h3>
//       <table className="w-full text-sm text-right border-t border-gray-100">
//         <thead className="text-gray-600 bg-gray-50">
//           <tr>
//             <th className="px-3 py-2">اسم الدواء</th>
//             <th className="px-3 py-2">الكمية</th>
//             <th className="px-3 py-2">تاريخ الانتهاء</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inventoryData.map((i, idx) => (
//             <tr key={idx} className="border-t hover:bg-gray-50">
//               <td className="px-3 py-2">{i.name}</td>
//               <td className={`px-3 py-2 ${i.qty <= 3 ? 'text-red-600' : 'text-green-700'}`}>{i.qty}</td>
//               <td className="px-3 py-2">{i.expiry}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// /* ------------------------ 📈 الأرباح ------------------------ */
// function ProfitTab({ profitData }) {
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📈 تقرير الأرباح الشهرية</h3>
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={profitData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* ------------------------ 👥 المستخدمين ------------------------ */
// function UsersTab({ userStats }) {
//   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">👥 أداء المستخدمين</h3>
//       <ResponsiveContainer width="100%" height={250}>
//         <PieChart>
//           <Pie data={userStats} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
//             {userStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* ------------------------ ⚙️ النظام ------------------------ */
// function SystemTab({ logs }) {
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
//       <table className="w-full text-sm text-right border-t border-gray-100">
//         <thead className="text-gray-600 bg-gray-50">
//           <tr>
//             <th className="px-3 py-2">الوقت</th>
//             <th className="px-3 py-2">المستخدم</th>
//             <th className="px-3 py-2">الإجراء</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.map((log, idx) => (
//             <tr key={idx} className="border-t hover:bg-gray-50">
//               <td className="px-3 py-2">{log.time}</td>
//               <td className="px-3 py-2">{log.user}</td>
//               <td className="px-3 py-2">{log.action}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// /* ------------------------ 🧩 بطاقة الملخص ------------------------ */
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center transition border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }














// import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import toast from 'react-hot-toast'
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//   PieChart, Pie, Cell, ResponsiveContainer
// } from 'recharts'

// export default function Reports() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [activeTab, setActiveTab] = useState('sales')
//   const [dateRange, setDateRange] = useState({ from: '', to: '' })
//   const [salesData, setSalesData] = useState([])
//   const [inventoryData, setInventoryData] = useState([])
//   const [profitData, setProfitData] = useState([])
//   const [userStats, setUserStats] = useState([])
//   const [logs, setLogs] = useState([])

//   useEffect(() => {
//     // بيانات افتراضية
//     setSalesData([
//       { date: '2025-11-01', total: 320, cashier: 'أحمد' },
//       { date: '2025-11-02', total: 410, cashier: 'محمد' },
//       { date: '2025-11-03', total: 380, cashier: 'أحمد' },
//     ])
//     setInventoryData([
//       { name: 'باراسيتامول', qty: 8, expiry: '2025-12-10' },
//       { name: 'أموكسيسيلين', qty: 2, expiry: '2024-06-02' },
//     ])
//     setProfitData([
//       { month: 'أكتوبر', profit: 3200 },
//       { month: 'نوفمبر', profit: 4800 },
//       { month: 'ديسمبر', profit: 5100 },
//     ])
//     setUserStats([
//       { name: 'محمد', sales: 1200 },
//       { name: 'أحمد', sales: 1500 },
//       { name: 'مها', sales: 800 },
//     ])
//     setLogs([
//       { time: '10:15', user: 'أحمد', action: 'تسجيل دخول' },
//       { time: '10:30', user: 'محمد', action: 'إضافة دواء جديد' },
//       { time: '11:10', user: 'مها', action: 'تعديل صلاحيات مستخدم' },
//     ])
//   }, [])

//   const tabButton = (key, label, icon) => (
//     <button
//       key={key}
//       onClick={() => setActiveTab(key)}
//       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
//         activeTab === key
//           ? 'text-sky-700 border-sky-500 bg-sky-50'
//           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
//       }`}
//     >
//       <span>{icon}</span> {label}
//     </button>
//   )

//   const handleFilter = () => {
//     toast.success(`✅ تم تطبيق الفلتر من ${dateRange.from || 'بداية الشهر'} إلى ${dateRange.to || 'اليوم'}`)
//   }

//   return (
//     <Layout user={user} title="📊 لوحة التقارير">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔹 شريط التبويبات */}
//         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
//           {tabButton('sales', 'المبيعات', '💰')}
//           {tabButton('inventory', 'المخزون', '📦')}
//           {tabButton('profit', 'الأرباح', '📈')}
//           {tabButton('users', 'المستخدمين', '👥')}
//           {tabButton('system', 'النظام', '⚙️')}
//         </div>

//         {/* 🔸 شريط الفلاتر */}
//         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             <label className="text-sm text-gray-700">من:</label>
//             <input
//               type="date"
//               value={dateRange.from}
//               onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//             <label className="text-sm text-gray-700">إلى:</label>
//             <input
//               type="date"
//               value={dateRange.to}
//               onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//             <button
//               onClick={handleFilter}
//               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
//             >
//               🔍 تطبيق الفلتر
//             </button>
//           </div>

//           <div className="flex justify-end gap-2">
//             <button onClick={() => toast.success('📄 تم تصدير PDF')} className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700">
//               📄 PDF
//             </button>
//             <button onClick={() => toast.success('📊 تم تصدير Excel')} className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">
//               📊 Excel
//             </button>
//           </div>
//         </div>

//         {/* 🔻 محتوى التبويبات */}
//         <motion.div
//           key={activeTab}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           {activeTab === 'sales' && <SalesTab salesData={salesData} />}
//           {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
//           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
//           {activeTab === 'users' && <UsersTab userStats={userStats} />}
//           {activeTab === 'system' && <SystemTab logs={logs} />}
//         </motion.div>
//       </div>
//     </Layout>
//   )
// }

// /* ------------------------ 💰 تبويب المبيعات ------------------------ */
// function SalesTab({ salesData }) {
//   const totalSales = salesData.reduce((sum, s) => sum + s.total, 0)
//   const avg = (totalSales / salesData.length).toFixed(2)
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">💰 تقرير المبيعات</h3>
//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
//         <SummaryCard title="عدد العمليات" value={salesData.length} color="text-blue-600" />
//         <SummaryCard title="متوسط المبيعات" value={`${avg} ر.س`} color="text-green-600" />
//         <SummaryCard title="أعلى مبيعات" value="أحمد" color="text-amber-600" />
//       </div>

//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={salesData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* ------------------------ 📦 تبويب المخزون ------------------------ */
// function InventoryTab({ inventoryData }) {
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون</h3>
//       <table className="w-full text-sm text-right border-t border-gray-100">
//         <thead className="text-gray-600 bg-gray-50">
//           <tr>
//             <th className="px-3 py-2">اسم الدواء</th>
//             <th className="px-3 py-2">الكمية</th>
//             <th className="px-3 py-2">الانتهاء</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inventoryData.map((i, idx) => (
//             <tr key={idx} className="border-t hover:bg-gray-50">
//               <td className="px-3 py-2">{i.name}</td>
//               <td className={`px-3 py-2 ${i.qty <= 3 ? 'text-red-600' : 'text-green-700'}`}>{i.qty}</td>
//               <td className="px-3 py-2">{i.expiry}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// /* ------------------------ 📈 تبويب الأرباح ------------------------ */
// function ProfitTab({ profitData }) {
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📈 تقرير الأرباح الشهرية</h3>
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={profitData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* ------------------------ 👥 تبويب المستخدمين ------------------------ */
// function UsersTab({ userStats }) {
//   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">👥 أداء المستخدمين</h3>
//       <ResponsiveContainer width="100%" height={250}>
//         <PieChart>
//           <Pie data={userStats} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
//             {userStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* ------------------------ ⚙️ تبويب النظام ------------------------ */
// function SystemTab({ logs }) {
//   return (
//     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
//       <table className="w-full text-sm text-right border-t border-gray-100">
//         <thead className="text-gray-600 bg-gray-50">
//           <tr>
//             <th className="px-3 py-2">الوقت</th>
//             <th className="px-3 py-2">المستخدم</th>
//             <th className="px-3 py-2">الإجراء</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.map((log, idx) => (
//             <tr key={idx} className="border-t hover:bg-gray-50">
//               <td className="px-3 py-2">{log.time}</td>
//               <td className="px-3 py-2">{log.user}</td>
//               <td className="px-3 py-2">{log.action}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// /* ------------------------ 🧩 بطاقة الملخص ------------------------ */
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center transition border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }











// import { useState, useEffect } from 'react'
// import Layout from '../components/Layout'
// import toast from 'react-hot-toast'
// import theme from '../theme'
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//   PieChart, Pie, Cell, ResponsiveContainer
// } from 'recharts'

// export default function Reports() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [activeTab, setActiveTab] = useState('sales')
//   const [salesData, setSalesData] = useState([])
//   const [inventoryData, setInventoryData] = useState([])
//   const [profitData, setProfitData] = useState([])
//   const [userStats, setUserStats] = useState([])
//   const [logs, setLogs] = useState([])

//   useEffect(() => {
//     // بيانات افتراضية
//     setSalesData([
//       { date: '2025-11-01', total: 320, cashier: 'أحمد' },
//       { date: '2025-11-02', total: 410, cashier: 'محمد' },
//       { date: '2025-11-03', total: 380, cashier: 'أحمد' },
//     ])

//     setInventoryData([
//       { name: 'باراسيتامول', qty: 8, expiry: '2025-12-10' },
//       { name: 'أموكسيسيلين', qty: 2, expiry: '2024-06-02' },
//     ])

//     setProfitData([
//       { month: 'أكتوبر', profit: 3200 },
//       { month: 'نوفمبر', profit: 4800 },
//       { month: 'ديسمبر', profit: 5100 },
//     ])

//     setUserStats([
//       { name: 'محمد', sales: 1200 },
//       { name: 'أحمد', sales: 1500 },
//       { name: 'مها', sales: 800 },
//     ])

//     setLogs([
//       { time: '10:15', user: 'أحمد', action: 'تسجيل دخول' },
//       { time: '10:30', user: 'محمد', action: 'إضافة دواء جديد' },
//       { time: '11:10', user: 'مها', action: 'تعديل صلاحيات مستخدم' },
//     ])
//   }, [])

//   const tabButton = (key, label, icon) => (
//     <button
//       key={key}
//       onClick={() => setActiveTab(key)}
//       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
//         activeTab === key
//           ? 'text-white shadow-sm'
//           : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'
//       }`}
//       style={{
//         backgroundColor: activeTab === key ? theme.colors.primary : 'transparent',
//       }}
//     >
//       <span>{icon}</span> {label}
//     </button>
//   )

//   return (
//     <Layout user={user} title="📊 التقارير والتحليلات">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔹 تبويبات */}
//         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
//           {tabButton('sales', 'المبيعات', '💰')}
//           {tabButton('inventory', 'المخزون', '📦')}
//           {tabButton('profit', 'الأرباح', '📈')}
//           {tabButton('users', 'المستخدمين', '👥')}
//           {tabButton('system', 'النظام', '⚙️')}
//         </div>

//         {/* محتوى التبويبات */}
//         {activeTab === 'sales' && <SalesTab salesData={salesData} />}
//         {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
//         {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
//         {activeTab === 'users' && <UsersTab userStats={userStats} />}
//         {activeTab === 'system' && <SystemTab logs={logs} />}
//       </div>
//     </Layout>
//   )
// }

// /* ------------------------ 📊 تبويب المبيعات ------------------------ */
// function SalesTab({ salesData }) {
//   const totalSales = salesData.reduce((sum, s) => sum + s.total, 0)
//   const handleExport = (type) => toast.success(`✅ تم تصدير تقرير المبيعات (${type})`)

//   return (
//     <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">💰 تقرير المبيعات</h3>

//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
//         <SummaryCard title="عدد العمليات" value={salesData.length} color="text-blue-600" />
//         <SummaryCard title="عدد الكاشيرين" value={new Set(salesData.map(s => s.cashier)).size} color="text-green-600" />
//         <SummaryCard title="أعلى مبيعات" value="أحمد" color="text-amber-600" />
//       </div>

//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={salesData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>

//       <div className="flex justify-end gap-2">
//         <button onClick={() => handleExport('PDF')} className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700">📄 PDF</button>
//         <button onClick={() => handleExport('Excel')} className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">📊 Excel</button>
//       </div>
//     </div>
//   )
// }

// /* ------------------------ 📦 تبويب المخزون ------------------------ */
// function InventoryTab({ inventoryData }) {
//   const lowStock = inventoryData.filter(i => i.qty <= 3)
//   const expiring = inventoryData.filter(i => new Date(i.expiry) < new Date('2025-07-01'))
//   return (
//     <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون</h3>
//       <SummaryCard title="إجمالي الأصناف" value={inventoryData.length} color="text-sky-600" />
//       <SummaryCard title="منخفض المخزون" value={lowStock.length} color="text-red-600" />
//       <SummaryCard title="قرب الانتهاء" value={expiring.length} color="text-amber-600" />

//       <table className="w-full mt-3 text-sm text-right border-t">
//         <thead className="text-gray-600 bg-gray-50">
//           <tr>
//             <th className="px-3 py-2">اسم الدواء</th>
//             <th className="px-3 py-2">الكمية</th>
//             <th className="px-3 py-2">تاريخ الانتهاء</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inventoryData.map((i, idx) => (
//             <tr key={idx} className="border-t hover:bg-gray-50">
//               <td className="px-3 py-2">{i.name}</td>
//               <td className={`px-3 py-2 ${i.qty <= 3 ? 'text-red-600' : ''}`}>{i.qty}</td>
//               <td className="px-3 py-2">{i.expiry}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// /* ------------------------ 💰 تبويب الأرباح ------------------------ */
// function ProfitTab({ profitData }) {
//   const total = profitData.reduce((sum, p) => sum + p.profit, 0)
//   return (
//     <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">💰 تقرير الأرباح</h3>
//       <SummaryCard title="إجمالي الأرباح" value={`${total} ر.س`} color="text-green-600" />

//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={profitData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* ------------------------ 👥 تبويب المستخدمين ------------------------ */
// function UsersTab({ userStats }) {
//   const totalSales = userStats.reduce((s, u) => s + u.sales, 0)
//   return (
//     <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">👥 تقرير المستخدمين</h3>
//       <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />

//       <ResponsiveContainer width="100%" height={250}>
//         <PieChart>
//           <Pie
//             data={userStats}
//             dataKey="sales"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={80}
//             label
//           >
//             {['#0EA5E9', '#10B981', '#F59E0B'].map((c, i) => <Cell key={i} fill={c} />)}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// /* ------------------------ ⚙️ تبويب النظام ------------------------ */
// function SystemTab({ logs }) {
//   return (
//     <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
//       <table className="w-full text-sm text-right border-t">
//         <thead className="text-gray-600 bg-gray-50">
//           <tr>
//             <th className="px-3 py-2">الوقت</th>
//             <th className="px-3 py-2">المستخدم</th>
//             <th className="px-3 py-2">الإجراء</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.map((log, idx) => (
//             <tr key={idx} className="border-t hover:bg-gray-50">
//               <td className="px-3 py-2">{log.time}</td>
//               <td className="px-3 py-2">{log.user}</td>
//               <td className="px-3 py-2">{log.action}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// /* ------------------------ 🧩 مكون البطاقة ------------------------ */
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center transition bg-white border rounded-lg shadow-sm hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }















// import { useState, useEffect } from 'react'
// import Layout from '../components/Layout'
// import toast from 'react-hot-toast'
// import theme from '../theme'
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//   PieChart, Pie, Cell, ResponsiveContainer
// } from 'recharts'

// export default function Reports() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [reportType, setReportType] = useState('sales')
//   const [dateFrom, setDateFrom] = useState('')
//   const [dateTo, setDateTo] = useState('')
//   const [filterUser, setFilterUser] = useState('all')
//   const [filteredData, setFilteredData] = useState([])
//   const [salesData, setSalesData] = useState([])
//   const [loading, setLoading] = useState(true)

//   // بيانات وهمية
//   useEffect(() => {
//     const dummySales = [
//       { date: '2025-11-01', product: 'باراسيتامول', qty: 5, price: 15, user: 'أحمد' },
//       { date: '2025-11-02', product: 'أموكسيسيلين', qty: 3, price: 25, user: 'محمد' },
//       { date: '2025-11-03', product: 'فيتامين د', qty: 2, price: 40, user: 'أحمد' },
//     ]
//     setSalesData(dummySales)
//     setFilteredData(dummySales)
//     setLoading(false)
//   }, [])

//   const handleFilter = () => {
//     let data = [...salesData]
//     if (filterUser !== 'all') data = data.filter(d => d.user === filterUser)
//     if (dateFrom) data = data.filter(d => d.date >= dateFrom)
//     if (dateTo) data = data.filter(d => d.date <= dateTo)
//     setFilteredData(data)
//     toast.success('✅ تم تطبيق الفلاتر بنجاح')
//   }

//   const handleReset = () => {
//     setReportType('sales')
//     setDateFrom('')
//     setDateTo('')
//     setFilterUser('all')
//     setFilteredData(salesData)
//     toast.success('🔄 تمت إعادة الضبط')
//   }

//   const handleExport = (type) => {
//     toast.success(`📄 تم تصدير التقرير بصيغة ${type}`)
//   }

//   const totalSales = filteredData.reduce((sum, d) => sum + d.price * d.qty, 0)
//   const totalInvoices = filteredData.length
//   const totalItems = filteredData.reduce((sum, d) => sum + d.qty, 0)

//   if (loading) {
//     return (
//       <Layout user={user} title="التقارير والتحليلات">
//         <div className="flex items-center justify-center h-96">
//           <p className="text-gray-600">جاري تحميل البيانات...</p>
//         </div>
//       </Layout>
//     )
//   }

//   return (
//     <Layout user={user} title="التقارير والتحليلات">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔹 فلاتر */}
//         <div className="p-4 space-y-3 bg-white border rounded-lg shadow-sm">
//           <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//             <select
//               value={reportType}
//               onChange={(e) => setReportType(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="sales">تقرير المبيعات</option>
//               <option value="inventory">تقرير المخزون</option>
//               <option value="profit">تقرير الأرباح</option>
//               <option value="cashiers">تقرير الكاشيرين</option>
//             </select>

//             <div className="flex flex-col w-full gap-2 sm:flex-row sm:w-auto">
//               <input
//                 type="date"
//                 value={dateFrom}
//                 onChange={(e) => setDateFrom(e.target.value)}
//                 className="px-3 py-2 text-sm border rounded-md"
//               />
//               <input
//                 type="date"
//                 value={dateTo}
//                 onChange={(e) => setDateTo(e.target.value)}
//                 className="px-3 py-2 text-sm border rounded-md"
//               />
//             </div>

//             <select
//               value={filterUser}
//               onChange={(e) => setFilterUser(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل المستخدمين</option>
//               <option value="أحمد">أحمد</option>
//               <option value="محمد">محمد</option>
//             </select>

//             <div className="flex gap-2">
//               <button
//                 onClick={handleFilter}
//                 className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
//               >
//                 تطبيق الفلاتر
//               </button>
//               <button
//                 onClick={handleReset}
//                 className="px-4 py-2 text-sm text-gray-700 border rounded-md hover:bg-gray-50"
//               >
//                 إعادة الضبط
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* 🔸 بطاقات الملخص */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
//           <SummaryCard title="عدد الفواتير" value={totalInvoices} color="text-blue-600" />
//           <SummaryCard title="عدد الأصناف المباعة" value={totalItems} color="text-green-600" />
//           <SummaryCard title="نسبة الأرباح" value="22%" color="text-amber-600" />
//         </div>

//         {/* 📊 الجدول */}
//         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right min-w-[900px]">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">التاريخ</th>
//                 <th className="px-3 py-2">اسم المنتج</th>
//                 <th className="px-3 py-2">الكمية</th>
//                 <th className="px-3 py-2">السعر</th>
//                 <th className="px-3 py-2">الإجمالي</th>
//                 <th className="px-3 py-2">الكاشير</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.length ? (
//                 filteredData.map((d, i) => (
//                   <tr key={i} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{i + 1}</td>
//                     <td className="px-3 py-2">{d.date}</td>
//                     <td className="px-3 py-2">{d.product}</td>
//                     <td className="px-3 py-2">{d.qty}</td>
//                     <td className="px-3 py-2">{d.price} ر.س</td>
//                     <td className="px-3 py-2 font-semibold text-sky-700">{d.qty * d.price} ر.س</td>
//                     <td className="px-3 py-2">{d.user}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-3 py-4 text-center text-gray-500">
//                     لا توجد بيانات مطابقة للفلاتر الحالية
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* 📈 الرسوم البيانية */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//           <div className="p-5 bg-white border rounded-lg shadow-sm">
//             <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات اليومية</h3>
//             <ResponsiveContainer width="100%" height={260}>
//               <LineChart data={filteredData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey={(d) => d.qty * d.price} stroke={theme.colors.primary} strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="p-5 bg-white border rounded-lg shadow-sm">
//             <h3 className="mb-3 text-lg font-semibold text-gray-700">توزيع المبيعات حسب المستخدم</h3>
//             <ResponsiveContainer width="100%" height={260}>
//               <PieChart>
//                 <Pie
//                   data={[
//                     { name: 'أحمد', value: filteredData.filter(d => d.user === 'أحمد').length },
//                     { name: 'محمد', value: filteredData.filter(d => d.user === 'محمد').length },
//                   ]}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label
//                   dataKey="value"
//                 >
//                   {['#0EA5E9', '#10B981'].map((c, i) => <Cell key={i} fill={c} />)}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* 🧾 أزرار التصدير والطباعة */}
//         <div className="flex flex-wrap justify-end gap-2">
//           <button onClick={() => handleExport('PDF')} className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700">📄 تصدير PDF</button>
//           <button onClick={() => handleExport('Excel')} className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">📊 تصدير Excel</button>
//           <button onClick={() => window.print()} className="px-4 py-2 text-sm text-white rounded-md bg-amber-500 hover:bg-amber-600">🖨️ طباعة</button>
//         </div>
//       </div>
//     </Layout>
//   )
// }

// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center transition-all bg-white border rounded-lg shadow-sm hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }













// // pages/reports.js
// import { useEffect, useState, useMemo } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
//   BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
// } from 'recharts'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// export default function Reports() {
//   const [user] = useState({ name: 'صيدلية المعلم' })
//   const [salesData, setSalesData] = useState([])
//   const [stockData, setStockData] = useState([])
//   const [profitData, setProfitData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [smartInsight, setSmartInsight] = useState('')
//   const [showCashiersReports, setShowCashiersReports] = useState(false)

//   // بيانات ورديات الكاشير (وهمية)
//   const [cashierShifts, setCashierShifts] = useState([])

//   useEffect(() => {
//     const sales = [
//       { date: 'يناير', total: 3200 },
//       { date: 'فبراير', total: 2800 },
//       { date: 'مارس', total: 4500 },
//       { date: 'أبريل', total: 3900 },
//       { date: 'مايو', total: 5200 },
//       { date: 'يونيو', total: 6100 }
//     ]

//     const stock = [
//       { name: 'باراسيتامول', qty: 120, sold: 500 },
//       { name: 'أموكسيسيلين', qty: 80, sold: 350 },
//       { name: 'فيتامين د', qty: 40, sold: 720 },
//       { name: 'ايبوبروفين', qty: 60, sold: 420 },
//       { name: 'فيتامين سي', qty: 25, sold: 650 }
//     ]

//     const profits = [
//       { name: 'مبيعات', value: 78 },
//       { name: 'تكاليف', value: 18 },
//       { name: 'خسائر', value: 4 }
//     ]

//     setSalesData(sales)
//     setStockData(stock)
//     setProfitData(profits)
//     setLoading(false)

//     const last = sales[sales.length - 1].total
//     const prev = sales[sales.length - 2].total
//     const growth = (((last - prev) / prev) * 100).toFixed(1)
//     const topProduct = stock.reduce((max, p) => (p.sold > max.sold ? p : max), stock[0])
//     const lowStock = stock.reduce((min, p) => (p.qty < min.qty ? p : min), stock[0])

//     let insight = ''
//     if (growth > 0) insight += `📈 ارتفعت المبيعات بنسبة ${growth}% مقارنة بالشهر السابق. `
//     else if (growth < 0) insight += `📉 تراجعت المبيعات بنسبة ${Math.abs(growth)}% مقارنة بالشهر السابق. `
//     else insight += `📊 المبيعات حافظت على استقرارها مقارنة بالشهر الماضي. `
//     insight += `🏆 المنتج الأعلى مبيعًا هو "${topProduct.name}" بكمية ${topProduct.sold} وحدة. `
//     insight += `⚠️ المنتج "${lowStock.name}" يقترب من النفاد (المخزون الحالي ${lowStock.qty} وحدة فقط).`
//     setSmartInsight(insight)

//     // ورديات كاشيرين (وهمية)
//     setCashierShifts([
//       { id: 1, cashier: 'أحمد', date: '2025-11-02', invoices: 18, total: 1360, avg: 75.5, start: '09:00', end: '17:00' },
//       { id: 2, cashier: 'مها', date: '2025-11-02', invoices: 12, total: 940, avg: 78.3, start: '13:00', end: '21:00' },
//       { id: 3, cashier: 'سعيد', date: '2025-11-01', invoices: 20, total: 1510, avg: 75.5, start: '09:00', end: '17:00' },
//     ])
//   }, [])

//   const COLORS = ['#00C49F', '#FFBB28', '#FF8042']
//   const totalSales = useMemo(() => salesData.reduce((sum, s) => sum + s.total, 0), [salesData])
//   const totalStock = useMemo(() => stockData.reduce((sum, s) => sum + s.qty, 0), [stockData])
//   const avgProfit = profitData[0]?.value || 0

//   if (loading) {
//     return (
//       <Layout user={user} title="التقارير والتحليلات">
//         <div className="flex items-center justify-center h-96">
//           <p className="text-lg text-gray-600">جاري تحميل البيانات...</p>
//         </div>
//       </Layout>
//     )
//   }

//   return (
//     <Layout user={user} title="التقارير والتحليلات">
//       {/* شريط علوي: عنوان + زر جميع تقارير الكاشيرين */}
//       <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
//         <h3 className="text-lg font-semibold text-gray-800">التقارير</h3>
//         <button onClick={() => setShowCashiersReports(true)} className="btn btn-primary">
//           جميع تقارير الكاشيرين
//         </button>
//       </div>

//       {/* التحليل الذكي */}
//       <div className="p-5 mb-6 text-sm border rounded-lg border-amber-200 bg-amber-50">
//         <p className="font-medium leading-relaxed text-amber-800">{smartInsight}</p>
//       </div>

//       {/* بطاقات */}
//       <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
//         <div className="p-4 card hover:shadow-md">
//           <h3 className="text-sm text-gray-500">إجمالي المبيعات</h3>
//           <p className="mt-1 text-3xl font-bold text-sky-600">{totalSales.toLocaleString()} ر.س</p>
//         </div>
//         <div className="p-4 card hover:shadow-md">
//           <h3 className="text-sm text-gray-500">إجمالي المخزون</h3>
//           <p className="mt-1 text-3xl font-bold text-green-600">{totalStock} وحدة</p>
//         </div>
//         <div className="p-4 card hover:shadow-md">
//           <h3 className="text-sm text-gray-500">نسبة الربح</h3>
//           <p className="mt-1 text-3xl font-bold text-amber-600">{avgProfit}%</p>
//         </div>
//       </div>

//       {/* رسوم */}
//       <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
//         <div className="p-4 card">
//           <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات الشهرية</h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={salesData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="p-4 card">
//           <h3 className="mb-3 text-lg font-semibold text-gray-700">كمية المخزون حسب المنتج</h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={stockData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="qty" fill={theme.colors.secondary} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="p-4 mb-8 card">
//         <h3 className="mb-3 text-lg font-semibold text-gray-700">نسبة الأرباح والخسائر</h3>
//         <div className="flex justify-center">
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={profitData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
//                 {profitData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="flex justify-end gap-3">
//         <button onClick={() => toast('📤 تم تصدير التقرير PDF')} className="btn btn-primary">💾 تصدير PDF</button>
//         <button onClick={() => toast('📊 تم تصدير التقرير Excel')} className="btn btn-secondary">📊 تصدير Excel</button>
//       </div>

//       {/* مودال جميع تقارير الكاشيرين */}
//       {showCashiersReports && (
//         <Modal title="جميع تقارير الكاشيرين (الورديات)" onClose={() => setShowCashiersReports(false)} width="max-w-4xl">
//           <div className="text-right">
//             <table className="w-full text-sm text-right border border-gray-200">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">التاريخ</th>
//                   <th className="px-3 py-2">الكاشير</th>
//                   <th className="px-3 py-2">بداية</th>
//                   <th className="px-3 py-2">نهاية</th>
//                   <th className="px-3 py-2">عدد الفواتير</th>
//                   <th className="px-3 py-2">الإجمالي</th>
//                   <th className="px-3 py-2">المتوسط</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cashierShifts.map((s) => (
//                   <tr key={s.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{s.date}</td>
//                     <td className="px-3 py-2">{s.cashier}</td>
//                     <td className="px-3 py-2">{s.start}</td>
//                     <td className="px-3 py-2">{s.end}</td>
//                     <td className="px-3 py-2">{s.invoices}</td>
//                     <td className="px-3 py-2">{s.total} ر.س</td>
//                     <td className="px-3 py-2">{s.avg}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {cashierShifts.length === 0 && (
//               <div className="py-6 text-center text-gray-500">لا توجد بيانات</div>
//             )}
//           </div>

//           <div className="flex justify-end gap-3 mt-5">
//             <button onClick={() => toast('🖨️ طباعة التقرير')} className="btn btn-secondary">🖨️ طباعة</button>
//             <button onClick={() => setShowCashiersReports(false)} className="btn btn-ghost">إغلاق</button>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }
