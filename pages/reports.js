import { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
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
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [salesRes, stockRes, alertsRes] = await Promise.all([
        api.get("/reports/sales"),
        api.get("/reports/stock"),
        api.get("/reports/alerts"),
      ]);

      // 🔥 إصلاح مشكلة double array
      const cleanSales = Array.isArray(salesRes.data[0])
        ? salesRes.data[0]
        : salesRes.data;

      const cleanStock = Array.isArray(stockRes.data[0])
        ? stockRes.data[0]
        : stockRes.data;

      const cleanAlerts = Array.isArray(alertsRes.data[0])
        ? alertsRes.data[0]
        : alertsRes.data;

      setInvoices(cleanSales);
      setProducts(cleanStock);
      setAlerts(cleanAlerts);
    } catch (err) {
      console.error("loadData error:", err);
      setError("فشل تحميل بيانات التقرير");
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (v) =>
    `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

  /* ----------------- المتغيرات بعد جلب الداتا ----------------- */

  const salesStats = useMemo(() => {
    if (!invoices.length)
      return {
        totalSales: 0,
        count: 0,
        avg: 0,
        todayTotal: 0,
        monthTotal: 0,
      };

    const dates = invoices
      .filter((i) => i.date)
      .map((i) => i.date.slice(0, 10));

    if (!dates.length)
      return {
        totalSales: 0,
        count: 0,
        avg: 0,
        todayTotal: 0,
        monthTotal: 0,
      };

    const today = dates.sort()[dates.length - 1];
    const thisMonth = today.slice(0, 7);

    let totalSales = 0;
    let todayTotal = 0;
    let monthTotal = 0;

    invoices.forEach((inv) => {
      if (!inv.total) return;

      const val = Number(inv.total);
      const d = inv.date?.slice(0, 10);

      totalSales += val;
      if (d === today) todayTotal += val;
      if (d?.slice(0, 7) === thisMonth) monthTotal += val;
    });

    return {
      totalSales,
      count: invoices.length,
      avg: invoices.length ? totalSales / invoices.length : 0,
      todayTotal,
      monthTotal,
    };
  }, [invoices]);

  const monthlyChartData = useMemo(() => {
    const map = new Map();

    invoices.forEach((inv) => {
      if (!inv.date) return;

      const key = inv.date.slice(0, 7);
      map.set(key, (map.get(key) || 0) + Number(inv.total || 0));
    });

    return Array.from(map.entries()).map(([month, total]) => ({
      month,
      total,
    }));
  }, [invoices]);

  const lowStock = products.filter((p) => Number(p.quantity) <= Number(p.min_qty));
  const expiredStock = products.filter(
    (p) => p.expiryDate && new Date(p.expiryDate) < new Date()
  );

  const nearExpiry = products.filter((p) => {
    if (!p.expiryDate) return false;
    const exp = new Date(p.expiryDate);
    const now = new Date();
    const limit = new Date();
    limit.setMonth(now.getMonth() + 1);
    return exp >= now && exp <= limit;
  });

  return (
    <Layout title="التقارير">
      <div dir="rtl" className="space-y-6">
        <div className="flex gap-2 p-2 bg-white border rounded-lg shadow-sm">
          <Tab id="overview" label="نظرة عامة" active={activeTab} setActive={setActiveTab} />
          <Tab id="sales" label="المبيعات" active={activeTab} setActive={setActiveTab} />
          <Tab id="stock" label="المخزون" active={activeTab} setActive={setActiveTab} />
          <Tab id="profit" label="ربحية المنتجات" active={activeTab} setActive={setActiveTab} />
          <Tab id="alerts" label="التنبيهات" active={activeTab} setActive={setActiveTab} />
        </div>

        {loading && <p className="p-4 text-center">⏳ جاري التحميل...</p>}
        {error && (
          <div className="p-3 text-center text-red-700 border border-red-200 rounded-md bg-red-50">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === "overview" && (
              <OverviewTab
                salesStats={salesStats}
                chart={monthlyChartData}
                invoices={invoices}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === "sales" && (
              <SalesTab
                invoices={invoices}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === "stock" && (
              <StockTab
                products={products}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === "profit" && (
              <ProfitTab
                products={products}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === "alerts" && (
              <AlertsTab
                low={lowStock}
                expired={expiredStock}
                nearExpiry={nearExpiry}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

/* -------------- Components ---------------- */

function Tab({ id, label, active, setActive }) {
  const isActive = id === active;
  return (
    <button
      onClick={() => setActive(id)}
      className={`px-3 py-1.5 text-sm rounded-lg border ${
        isActive ? "bg-sky-600 text-white border-sky-600" : "bg-white"
      }`}
    >
      {label}
    </button>
  );
}

/* --------- باقي التبويبات كما في نسختك (نفس التصميم) --------- */

function OverviewTab({ salesStats, chart, invoices, formatCurrency }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="إجمالي المبيعات" value={formatCurrency(salesStats.totalSales)} />
        <Card title="عدد الفواتير" value={salesStats.count} />
        <Card title="متوسط الفاتورة" value={formatCurrency(salesStats.avg)} />
        <Card title="مبيعات اليوم" value={formatCurrency(salesStats.todayTotal)} />
      </div>

      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">📈 المبيعات الشهرية</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">🧾 آخر الفواتير</h2>
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>رقم</Th>
              <Th>نوع</Th>
              <Th>عميل</Th>
              <Th>كاشير</Th>
              <Th>دفع</Th>
              <Th>قيمة</Th>
            </tr>
          </thead>
          <tbody>
            {invoices.slice(0, 5).map((i) => (
              <tr key={i.id} className="border-t hover:bg-gray-50">
                <Td>{i.id}</Td>
                <Td>{i.type}</Td>
                <Td>{i.customer}</Td>
                <Td>{i.cashier}</Td>
                <Td>{i.payment}</Td>
                <Td className="font-bold text-emerald-700">{formatCurrency(i.total)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
/* ============================================================
   🔵 1) SalesTab — تقرير المبيعات
============================================================ */
function SalesTab({ invoices, formatCurrency }) {
  if (!Array.isArray(invoices)) invoices = [];

  return (
    <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">🧾 تقرير المبيعات</h2>

      <table className="w-full min-w-[900px] text-sm text-right">
        <thead className="text-gray-700 bg-gray-50">
          <tr>
            <Th>رقم</Th>
            <Th>عميل</Th>
            <Th>كاشير</Th>
            <Th>نوع</Th>
            <Th>الدفع</Th>
            <Th>الإجمالي</Th>
            <Th>التاريخ</Th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((i) => (
            <tr key={i.id} className="border-t hover:bg-gray-50">
              <Td>{i.id}</Td>
              <Td>{i.customer}</Td>
              <Td>{i.cashier}</Td>
              <Td>{i.type}</Td>
              <Td>{i.payment}</Td>
              <Td className="font-bold text-emerald-700">
                {formatCurrency(i.total)}
              </Td>
              <Td>{i.date?.replace("T", " ").slice(0, 16)}</Td>
            </tr>
          ))}
          {!invoices.length && (
            <tr>
              <td colSpan={7} className="py-4 text-center text-gray-500">
                لا توجد فواتير بعد…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   🔵 2) StockTab — تقرير المخزون
============================================================ */
function StockTab({ products, formatCurrency }) {
  if (!Array.isArray(products)) products = [];

  return (
    <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">🏬 تقرير المخزون</h2>

      <table className="w-full min-w-[900px] text-sm text-right">
        <thead className="bg-gray-50">
          <tr>
            <Th>كود</Th>
            <Th>اسم</Th>
            <Th>الشركة</Th>
            <Th>الكمية</Th>
            <Th>الحد الأدنى</Th>
            <Th>تاريخ الانتهاء</Th>
            <Th>السعر</Th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <Td>{p.id}</Td>
              <Td>{p.name}</Td>
              <Td>{p.company}</Td>
              <Td>{p.quantity}</Td>
              <Td>{p.min_qty}</Td>
              <Td>{p.expiryDate}</Td>
              <Td>{formatCurrency(p.price)}</Td>
            </tr>
          ))}

          {!products.length && (
            <tr>
              <td colSpan={7} className="py-4 text-center text-gray-500">
                لا توجد منتجات حالياً…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   🔵 3) ProfitTab — تقرير ربحية المنتجات
============================================================ */
function ProfitTab({ products, formatCurrency }) {
  if (!Array.isArray(products)) products = [];

  const rows = products.map((p) => {
    const totalCost = Number(p.cost_price || 0) * Number(p.quantity);
    const totalSell = Number(p.price || 0) * Number(p.quantity);
    const profit = totalSell - totalCost;
    return {
      ...p,
      totalCost,
      totalSell,
      profit,
      marginPercent: totalSell ? ((profit / totalSell) * 100).toFixed(1) : "0.0",
    };
  });

  return (
    <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">📊 ربحية المنتجات</h2>

      <table className="w-full min-w-[950px] text-sm text-right">
        <thead className="bg-gray-50">
          <tr>
            <Th>اسم</Th>
            <Th>تكلفة الوحدة</Th>
            <Th>سعر البيع</Th>
            <Th>الكمية</Th>
            <Th>إجمالي التكلفة</Th>
            <Th>إجمالي البيع</Th>
            <Th>الربح</Th>
            <Th>الربحية %</Th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <Td>{r.name}</Td>
              <Td>{formatCurrency(r.cost_price)}</Td>
              <Td>{formatCurrency(r.price)}</Td>
              <Td>{r.quantity}</Td>
              <Td>{formatCurrency(r.totalCost)}</Td>
              <Td>{formatCurrency(r.totalSell)}</Td>
              <Td className={r.profit >= 0 ? "text-emerald-700" : "text-red-600"}>
                {formatCurrency(r.profit)}
              </Td>
              <Td>{r.marginPercent}%</Td>
            </tr>
          ))}

          {!rows.length && (
            <tr>
              <td colSpan={8} className="py-4 text-center text-gray-500">
                لا توجد بيانات…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   🔵 4) AlertsTab — التنبيهات
============================================================ */
function AlertsTab({ low, expired, nearExpiry }) {
  return (
    <div className="space-y-6">
      <AlertSection
        title="❌ منتهية"
        color="text-red-700"
        rows={expired}
        headers={["اسم", "كمية", "انتهاء"]}
        mapper={(p) => [p.name, p.quantity, p.expiryDate]}
      />

      <AlertSection
        title="⚠️ قرب الانتهاء"
        color="text-amber-700"
        rows={nearExpiry}
        headers={["اسم", "كمية", "انتهاء"]}
        mapper={(p) => [p.name, p.quantity, p.expiryDate]}
      />

      <AlertSection
        title="📉 كمية منخفضة"
        color="text-orange-700"
        rows={low}
        headers={["اسم", "كمية", "حد أدنى"]}
        mapper={(p) => [p.name, p.quantity, p.min_qty]}
      />
    </div>
  );
}

function AlertSection({ title, color, rows, headers, mapper }) {
  return (
    <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
      <h2 className={`mb-3 text-lg font-semibold ${color}`}>{title}</h2>
      <table className="w-full min-w-[700px] text-sm text-right">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((p, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                {mapper(p).map((val, x) => (
                  <Td key={x}>{val}</Td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="py-4 text-center text-gray-500">
                لا توجد بيانات…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}



const Th = ({ children }) => <th className="px-3 py-2">{children}</th>;
const Td = ({ children }) => <td className="px-3 py-2">{children}</td>;
const Card = ({ title, value }) => (
  <div className="p-4 text-center bg-white border rounded-lg shadow-sm">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);
