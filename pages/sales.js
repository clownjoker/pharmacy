// pages/sales.js
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useInventory } from "../context/InventoryContext";

function formatCurrency(v) {
  return `${Number(v || 0).toLocaleString("ar-SA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ر.س`;
}

export default function SalesPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const { products } = useInventory();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // فلاتر
  const [search, setSearch] = useState("");
  const [cashierFilter, setCashierFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // مودالات
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedSaleItems, setSelectedSaleItems] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // نموذج إضافة فاتورة
  const [saleForm, setSaleForm] = useState({
    customer: "",
    cashier: "",
    paymentMethod: "cash",
    saleType: "sale",
    discount: 0,
    tax: 0,
    items: [],
  });

  // نموذج سطر منتج في الفاتورة
  const [lineProductId, setLineProductId] = useState("");
  const [lineQty, setLineQty] = useState(1);
  const [linePrice, setLinePrice] = useState("");

  // حماية الصلاحيات
  if (!hasPermission(["admin", "pharmacist", "cashier"])) {
    return (
      <Layout>
        <div
          dir="rtl"
          className="flex items-center justify-center min-h-[60vh] bg-slate-50"
        >
          <div className="px-6 py-4 text-sm font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
            ⚠️ لا يمكنك دخول هذه الصفحة. الرجاء التواصل مع مدير النظام لتحديث صلاحياتك.
          </div>
        </div>
      </Layout>
    );
  }

  // تحميل المبيعات
  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const res = await api.get("/sales");
      setSales(res.data || []);
    } catch (err) {
      console.error("loadSales error:", err);
      toast.error("خطأ في تحميل المبيعات");
    } finally {
      setLoading(false);
    }
  };

  // خيارات الكاشير حسب البيانات الموجودة
  const cashierOptions = useMemo(() => {
    const set = new Set();
    (sales || []).forEach((s) => {
      if (s.cashier) set.add(s.cashier);
    });
    return Array.from(set);
  }, [sales]);

  // إحصائيات سريعة
  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

    let totalToday = 0;
    let countToday = 0;
    let totalAll = 0;

    (sales || []).forEach((s) => {
      const dateStr = (s.created_at || "").slice(0, 10);
      const val = Number(s.total || 0);

      totalAll += val;
      if (dateStr === today && s.sale_type === "sale") {
        totalToday += val;
        countToday += 1;
      }
    });

    return {
      totalToday,
      countToday,
      totalAll,
    };
  }, [sales]);

  // فلترة المبيعات
  const filteredSales = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (sales || []).filter((s) => {
      const matchSearch =
        !q ||
        s.id?.toString().includes(q) ||
        (s.customer || "").toLowerCase().includes(q);

      const matchCashier =
        cashierFilter === "all" || s.cashier === cashierFilter;

      const matchPayment =
        paymentFilter === "all" || s.payment_method === paymentFilter;

      const matchType =
        typeFilter === "all" || s.sale_type === typeFilter;

      return matchSearch && matchCashier && matchPayment && matchType;
    });
  }, [sales, search, cashierFilter, paymentFilter, typeFilter]);

  // حساب الإجماليات في النموذج
  const saleTotals = useMemo(() => {
    const subtotal = (saleForm.items || []).reduce(
      (sum, it) => sum + Number(it.qty || 0) * Number(it.price || 0),
      0
    );
    const discount = Number(saleForm.discount || 0);
    const tax = Number(saleForm.tax || 0);
    const total = subtotal - discount + tax;
    return { subtotal, discount, tax, total };
  }, [saleForm]);

  // إضافة سطر منتج إلى الفاتورة
  const handleAddLine = () => {
    if (!lineProductId) {
      toast.error("اختر منتجًا أولًا");
      return;
    }
    const product = products.find((p) => p.id === Number(lineProductId));
    if (!product) {
      toast.error("المنتج غير موجود");
      return;
    }
    const qty = Number(lineQty || 0);
    if (!qty || qty <= 0) {
      toast.error("الكمية غير صحيحة");
      return;
    }

    const price =
      linePrice !== "" ? Number(linePrice) : Number(product.price || 0);

    if (!price || price <= 0) {
      toast.error("سعر البيع غير صحيح");
      return;
    }

    const newItem = {
      productId: product.id,
      productName: product.name,
      qty,
      price,
    };

    setSaleForm((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));

    setLineProductId("");
    setLineQty(1);
    setLinePrice("");
  };

  const handleRemoveLine = (idx) => {
    setSaleForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  // حفظ الفاتورة
  const handleSaveSale = async () => {
    if (!(saleForm.items || []).length) {
      toast.error("أضف منتجًا واحدًا على الأقل للفاتورة");
      return;
    }

    try {
      const payload = {
        customer: saleForm.customer || null,
        cashier: saleForm.cashier || user?.name || null,
        paymentMethod: saleForm.paymentMethod,
        saleType: saleForm.saleType,
        discount: Number(saleForm.discount || 0),
        tax: Number(saleForm.tax || 0),
        items: saleForm.items.map((it) => ({
          productId: it.productId,
          qty: Number(it.qty || 0),
          price: Number(it.price || 0),
        })),
      };

      const res = await api.post("/sales", payload);
      toast.success("تم حفظ الفاتورة بنجاح");

      // أضفها لقائمة المبيعات
      setSales((prev) => [res.data, ...prev]);

      // إعادة تعيين النموذج
      setSaleForm({
        customer: "",
        cashier: "",
        paymentMethod: "cash",
        saleType: "sale",
        discount: 0,
        tax: 0,
        items: [],
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("save sale error:", err);
      toast.error("فشل حفظ الفاتورة");
    }
  };

  // حذف فاتورة
  const handleDeleteSale = async (id) => {
    if (!confirm("هل تريد حذف هذه الفاتورة؟")) return;
    try {
      await api.delete(`/sales/${id}`);
      setSales((prev) => prev.filter((s) => s.id !== id));
      toast.success("تم حذف الفاتورة");
    } catch (err) {
      console.error("delete sale error:", err);
      toast.error("خطأ في حذف الفاتورة");
    }
  };

  // فتح تفاصيل الفاتورة
  const openSaleDetails = async (sale) => {
    setSelectedSale(sale);
    setShowDetailsModal(true);
    setSelectedSaleItems([]);
    setDetailsLoading(true);
    try {
      const res = await api.get(`/sales/${sale.id}`);
      setSelectedSaleItems(res.data.items || []);
    } catch (err) {
      console.error("load sale details error:", err);
      toast.error("خطأ في تحميل تفاصيل الفاتورة");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <Layout user={user} title="إدارة المبيعات">
      <div dir="rtl" className="space-y-6">
        {/* رأس الصفحة */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
              🧾 إدارة المبيعات
            </h1>
            <p className="text-sm text-slate-500">
              متابعة فواتير البيع والمرتجعات، وحركة الكاشير، وقيمة المبيعات اليومية.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm bg-emerald-600 hover:bg-emerald-700"
            >
              <span>➕</span>
              <span>فاتورة جديدة</span>
            </button>

            <button
              onClick={loadSales}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg shadow-sm text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100"
            >
              🔄 تحديث
            </button>
          </div>
        </div>

        {/* كروت إحصائيات */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="إجمالي مبيعات اليوم"
            value={formatCurrency(stats.totalToday)}
            icon="📅"
            color="bg-emerald-50 text-emerald-700 border-emerald-100"
          />
          <StatCard
            label="عدد فواتير اليوم"
            value={stats.countToday.toLocaleString("ar-SA")}
            icon="🧮"
            color="bg-sky-50 text-sky-700 border-sky-100"
          />
          <StatCard
            label="إجمالي مبيعات النظام"
            value={formatCurrency(stats.totalAll)}
            icon="💰"
            color="bg-amber-50 text-amber-700 border-amber-100"
          />
        </div>

        {/* الفلاتر والبحث */}
        <div className="p-4 space-y-4 bg-white border shadow-sm rounded-2xl">
          <div className="relative">
            <span className="absolute text-slate-400 left-3 top-2.5">🔎</span>
            <input
              type="text"
              placeholder="بحث برقم الفاتورة أو اسم العميل…"
              className="w-full p-3 pr-3 text-sm border rounded-xl pl-9 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* كاشير */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">الكاشير:</span>
              <select
                className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
                value={cashierFilter}
                onChange={(e) => setCashierFilter(e.target.value)}
              >
                <option value="all">كل الكاشير</option>
                {cashierOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* طريقة الدفع */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">الدفع:</span>
              <select
                className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">الكل</option>
                <option value="cash">نقدًا</option>
                <option value="card">بطاقة</option>
                <option value="wallet">محفظة</option>
              </select>
            </div>

            {/* نوع الفاتورة */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">النوع:</span>
              <select
                className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">الكل</option>
                <option value="sale">بيع</option>
                <option value="return">مرتجع</option>
              </select>
            </div>
          </div>
        </div>

        {/* جدول المبيعات */}
        <div className="overflow-x-auto bg-white border shadow-sm rounded-2xl">
          {loading ? (
            <div className="p-6 text-sm text-center text-slate-500">
              🔄 جاري تحميل المبيعات…
            </div>
          ) : (
            <table className="w-full text-sm text-right min-w-[900px]">
              <thead className="text-xs uppercase border-b bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3 font-medium">#</th>
                  <th className="p-3 font-medium">التاريخ</th>
                  <th className="p-3 font-medium">العميل</th>
                  <th className="p-3 font-medium">الكاشير</th>
                  <th className="p-3 font-medium">طريقة الدفع</th>
                  <th className="p-3 font-medium">النوع</th>
                  <th className="p-3 font-medium">الإجمالي</th>
                  <th className="p-3 font-medium text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((s) => (
                  <tr
                    key={s.id}
                    className="transition-colors border-t border-slate-100 even:bg-slate-50/40 hover:bg-slate-100/60"
                  >
                    <td className="p-3 text-slate-700">{s.id}</td>
                    <td className="p-3 text-slate-700">
                      {s.created_at
                        ? new Date(s.created_at).toLocaleString("ar-EG")
                        : "-"}
                    </td>
                    <td className="p-3 text-slate-700">
                      {s.customer || "-"}
                    </td>
                    <td className="p-3 text-slate-700">
                      {s.cashier || "-"}
                    </td>
                    <td className="p-3 text-slate-700">
                      {s.payment_method === "cash"
                        ? "نقدًا"
                        : s.payment_method === "card"
                        ? "بطاقة"
                        : s.payment_method === "wallet"
                        ? "محفظة"
                        : s.payment_method || "-"}
                    </td>
                    <td className="p-3 text-slate-700">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          s.sale_type === "sale"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {s.sale_type === "sale" ? "بيع" : "مرتجع"}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-900">
                      {formatCurrency(s.total)}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        <button
                          onClick={() => openSaleDetails(s)}
                          className="px-3 py-1 text-xs font-medium text-indigo-700 rounded-lg bg-indigo-50 hover:bg-indigo-100"
                        >
                          🔍 تفاصيل
                        </button>
                        <button
                          onClick={() => handleDeleteSale(s.id)}
                          className="px-3 py-1 text-xs font-medium text-red-700 rounded-lg bg-red-50 hover:bg-red-100"
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!filteredSales.length && !loading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-6 text-sm text-center text-slate-400"
                    >
                      لا توجد فواتير مطابقة للبحث / الفلاتر الحالية…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* مودال إضافة فاتورة جديدة */}
        {showAddModal && (
          <Modal
            title="فاتورة جديدة"
            onClose={() => setShowAddModal(false)}
            onConfirm={handleSaveSale}
            confirmLabel="حفظ الفاتورة"
          >
            <div className="space-y-4 text-sm" dir="rtl">
              {/* بيانات عامة */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Field label="العميل">
                  <input
                    className="w-full p-2 border rounded-lg border-slate-200"
                    value={saleForm.customer}
                    onChange={(e) =>
                      setSaleForm((prev) => ({
                        ...prev,
                        customer: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="الكاشير">
                  <input
                    className="w-full p-2 border rounded-lg border-slate-200"
                    value={saleForm.cashier}
                    onChange={(e) =>
                      setSaleForm((prev) => ({
                        ...prev,
                        cashier: e.target.value,
                      }))
                    }
                    placeholder={user?.name || ""}
                  />
                </Field>
                <Field label="طريقة الدفع">
                  <select
                    className="w-full p-2 border rounded-lg border-slate-200"
                    value={saleForm.paymentMethod}
                    onChange={(e) =>
                      setSaleForm((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                  >
                    <option value="cash">نقدًا</option>
                    <option value="card">بطاقة</option>
                    <option value="wallet">محفظة</option>
                  </select>
                </Field>
                <Field label="نوع الفاتورة">
                  <select
                    className="w-full p-2 border rounded-lg border-slate-200"
                    value={saleForm.saleType}
                    onChange={(e) =>
                      setSaleForm((prev) => ({
                        ...prev,
                        saleType: e.target.value,
                      }))
                    }
                  >
                    <option value="sale">بيع</option>
                    <option value="return">مرتجع</option>
                  </select>
                </Field>
              </div>

              {/* سطر إضافة منتج */}
              <div className="p-3 space-y-2 border rounded-xl border-slate-200 bg-slate-50/60">
                <p className="text-xs font-semibold text-slate-600">
                  إضافة منتج للفاتورة
                </p>
                <div className="grid items-end grid-cols-1 gap-2 md:grid-cols-4">
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-xs text-slate-500">
                      المنتج
                    </label>
                    <select
                      className="w-full p-2 text-sm border rounded-lg border-slate-200"
                      value={lineProductId}
                      onChange={(e) => {
                        const v = e.target.value;
                        setLineProductId(v);
                        const prod = products.find(
                          (p) => p.id === Number(v)
                        );
                        if (prod) setLinePrice(prod.price || "");
                      }}
                    >
                      <option value="">اختر منتجًا…</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-slate-500">
                      الكمية
                    </label>
                    <input
                      type="number"
                      min={1}
                      className="w-full p-2 border rounded-lg border-slate-200"
                      value={lineQty}
                      onChange={(e) => setLineQty(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-slate-500">
                      سعر الوحدة
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg border-slate-200"
                      value={linePrice}
                      onChange={(e) => setLinePrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="px-3 py-1 mt-1 text-xs font-medium text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
                  >
                    ➕ إضافة للسلة
                  </button>
                </div>
              </div>

              {/* جدول العناصر داخل الفاتورة */}
              <div className="mt-3">
                <p className="mb-2 text-xs font-semibold text-slate-600">
                  العناصر المضافة:
                </p>
                {(saleForm.items || []).length ? (
                  <div className="overflow-x-auto border rounded-lg border-slate-200">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="p-2">المنتج</th>
                          <th className="p-2">الكمية</th>
                          <th className="p-2">سعر الوحدة</th>
                          <th className="p-2">الإجمالي</th>
                          <th className="p-2 text-center">حذف</th>
                        </tr>
                      </thead>
                      <tbody>
                        {saleForm.items.map((it, i) => (
                          <tr key={i} className="border-t">
                            <td className="p-2">{it.productName}</td>
                            <td className="p-2">{it.qty}</td>
                            <td className="p-2">
                              {formatCurrency(it.price)}
                            </td>
                            <td className="p-2">
                              {formatCurrency(
                                Number(it.qty || 0) *
                                  Number(it.price || 0)
                              )}
                            </td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveLine(i)}
                                className="px-2 py-1 text-xs text-red-700 rounded bg-red-50 hover:bg-red-100"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    لم تتم إضافة أي منتج بعد.
                  </p>
                )}
              </div>

              {/* الخصم والضريبة والإجماليات */}
              <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3">
                <Field label="الخصم">
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg border-slate-200"
                    value={saleForm.discount}
                    onChange={(e) =>
                      setSaleForm((prev) => ({
                        ...prev,
                        discount: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="الضريبة">
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg border-slate-200"
                    value={saleForm.tax}
                    onChange={(e) =>
                      setSaleForm((prev) => ({
                        ...prev,
                        tax: e.target.value,
                      }))
                    }
                  />
                </Field>
                <div className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50">
                  <p className="flex items-center justify-between">
                    <span className="text-slate-500">الإجمالي قبل:</span>
                    <span className="font-semibold">
                      {formatCurrency(saleTotals.subtotal)}
                    </span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-slate-500">الخصم:</span>
                    <span>{formatCurrency(saleTotals.discount)}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-slate-500">الضريبة:</span>
                    <span>{formatCurrency(saleTotals.tax)}</span>
                  </p>
                  <p className="flex items-center justify-between mt-1 text-emerald-700">
                    <span className="font-semibold">الإجمالي النهائي:</span>
                    <span className="font-bold">
                      {formatCurrency(saleTotals.total)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* مودال تفاصيل الفاتورة */}
        {showDetailsModal && selectedSale && (
          <Modal
            title={`تفاصيل الفاتورة رقم #${selectedSale.id}`}
            onClose={() => setShowDetailsModal(false)}
            onConfirm={() => setShowDetailsModal(false)}
            confirmLabel="إغلاق"
          >
            <div className="space-y-3 text-sm" dir="rtl">
              <p>
                <strong>العميل:</strong> {selectedSale.customer || "-"}
              </p>
              <p>
                <strong>الكاشير:</strong> {selectedSale.cashier || "-"}
              </p>
              <p>
                <strong>نوع الفاتورة:</strong>{" "}
                {selectedSale.sale_type === "sale" ? "بيع" : "مرتجع"}
              </p>
              <p>
                <strong>طريقة الدفع:</strong>{" "}
                {selectedSale.payment_method === "cash"
                  ? "نقدًا"
                  : selectedSale.payment_method === "card"
                  ? "بطاقة"
                  : selectedSale.payment_method === "wallet"
                  ? "محفظة"
                  : selectedSale.payment_method || "-"}
              </p>
              <p>
                <strong>التاريخ:</strong>{" "}
                {selectedSale.created_at
                  ? new Date(selectedSale.created_at).toLocaleString(
                      "ar-EG"
                    )
                  : "-"}
              </p>

              <hr className="my-2" />

              <p className="text-xs font-semibold text-slate-600">
                العناصر:
              </p>

              {detailsLoading ? (
                <p className="text-xs text-slate-500">
                  🔄 جاري تحميل تفاصيل الفاتورة…
                </p>
              ) : (selectedSaleItems || []).length ? (
                <div className="overflow-x-auto border rounded-lg border-slate-200">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-2">المنتج</th>
                        <th className="p-2">الكمية</th>
                        <th className="p-2">سعر الوحدة</th>
                        <th className="p-2">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSaleItems.map((it) => (
                        <tr key={it.id} className="border-t">
                          <td className="p-2">
                            {it.product_name || it.productId}
                          </td>
                          <td className="p-2">{it.qty}</td>
                          <td className="p-2">
                            {formatCurrency(it.unit_price)}
                          </td>
                          <td className="p-2">
                            {formatCurrency(it.total_price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  لا توجد عناصر محفوظة لهذه الفاتورة.
                </p>
              )}

              <hr className="my-2" />
              <p className="flex items-center justify-between text-xs">
                <span>الإجمالي النهائي:</span>
                <span className="font-bold text-emerald-700">
                  {formatCurrency(selectedSale.total)}
                </span>
              </p>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}

// بطاقة إحصائية
function StatCard({ label, value, icon, color }) {
  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-2xl ${color}`}
    >
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
      <div className="flex items-center justify-center w-10 h-10 text-lg rounded-full bg-white/70">
        {icon}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block mb-1 text-xs text-slate-600">{label}</label>
      {children}
    </div>
  );
}




















// // pages/sales.js
// import { useEffect, useMemo, useState } from "react";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import toast from "react-hot-toast";

// import {
//   getSales,
//   addSale,
//   applySaleToInventory,
// } from "../lib/fakeBackend";

// // ======= تنسيق التاريخ الآمن لمنع أخطاء الهيدرشن =======
// function SafeDate({ value }) {
//   const [formatted, setFormatted] = useState("");

//   useEffect(() => {
//     try {
//       const d = new Date(value);
//       const f = d.toLocaleString("ar-EG", {
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//       setFormatted(f);
//     } catch {
//       setFormatted(value || "");
//     }
//   }, [value]);

//   return <span>{formatted}</span>;
// }

// export default function Sales() {
//   const [user] = useState({ name: "أحمد", role: "admin" });

//   const [sales, setSales] = useState([]);
//   const [search, setSearch] = useState("");
//   const [cashier, setCashier] = useState("all");
//   const [payment, setPayment] = useState("all");
//   const [saleType, setSaleType] = useState("all"); // بيع / مرتجع / كلهم
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   const [viewInvoice, setViewInvoice] = useState(null);

//   // تحميل المبيعات من الباك اند الوهمي
//   useEffect(() => {
//     const data = getSales() || [];
//     setSales(data);
//   }, []);

//   const formatCurrency = (v) =>
//     `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

//   // فلترة البيانات
//   const filtered = useMemo(() => {
//     const q = search.toLowerCase().trim();

//     return (sales || []).filter((s) => {
//       const matchSearch =
//         !q ||
//         s.id.toString().includes(q) ||
//         (s.customer || "").toLowerCase().includes(q);

//       const matchCashier =
//         cashier === "all" || s.cashier === cashier;

//       const matchPayment =
//         payment === "all" || s.payment === payment;

//       const matchType =
//         saleType === "all" || s.type === saleType;

//       const matchFrom = !dateFrom || s.date.slice(0, 10) >= dateFrom;
//       const matchTo = !dateTo || s.date.slice(0, 10) <= dateTo;

//       return (
//         matchSearch &&
//         matchCashier &&
//         matchPayment &&
//         matchType &&
//         matchFrom &&
//         matchTo
//       );
//     });
//   }, [sales, search, cashier, payment, saleType, dateFrom, dateTo]);

//   // الإحصائيات
//   const totals = useMemo(() => {
//     const totalValue = filtered.reduce(
//       (sum, s) => sum + Number(s.total),
//       0
//     );
//     const count = filtered.length;
//     const avg = count ? totalValue / count : 0;
//     return { totalValue, count, avg };
//   }, [filtered]);

//   // عرض الفاتورة
//   const handleViewInvoice = (id) => {
//     const inv = sales.find((x) => x.id === id);
//     if (!inv) return toast.error("الفاتورة غير موجودة");
//     setViewInvoice(inv);
//   };

//   // الطباعة
//   const handlePrintInvoice = (invoice) => {
//     const html = `
//       <html dir="rtl" lang="ar">
//       <head>
//         <meta charset="UTF-8" />
//         <title>فاتورة ${invoice.id}</title>
//         <style>
//           body { font-family: 'Tajawal', sans-serif; padding: 20px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//           th, td { border: 1px solid #ddd; padding: 6px; text-align: center; }
//           th { background: #f3f4f6; }
//         </style>
//       </head>
//       <body>
//         <h2>صيدلية المعلم — فاتورة ${invoice.id}</h2>
//         <p>العميل: ${invoice.customer}</p>
//         <p>الكاشير: ${invoice.cashier}</p>
//         <p>التاريخ: ${new Date(invoice.date).toLocaleString("ar-EG")}</p>

//         <table>
//           <thead>
//             <tr>
//               <th>الصنف</th>
//               <th>الكمية</th>
//               <th>السعر</th>
//               <th>الإجمالي</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${
//               invoice.items
//                 .map(
//                   (it) =>
//                     `<tr>
//                       <td>${it.name}</td>
//                       <td>${it.qty}</td>
//                       <td>${it.price}</td>
//                       <td>${it.qty * it.price}</td>
//                     </tr>`
//                 )
//                 .join("") || ""
//             }
//           </tbody>
//         </table>

//         <h3>الإجمالي النهائي: ${invoice.total} ر.س</h3>

//         <script>
//           window.onload = () => {
//             window.print();
//             setTimeout(() => window.close(), 500);
//           };
//         </script>
//       </body>
//       </html>
//     `;

//     const w = window.open("", "_blank", "width=900,height=900");
//     w.document.write(html);
//     w.document.close();
//   };

//   return (
//     <Layout user={user} title="المبيعات">
//       <div dir="rtl" className="space-y-6">

//         {/* فلاتر البحث */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
//             <input
//               type="text"
//               placeholder="بحث برقم الفاتورة أو اسم العميل"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             />

//             <select
//               value={cashier}
//               onChange={(e) => setCashier(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل الكاشير</option>
//               {Array.from(new Set(sales.map((s) => s.cashier))).map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={payment}
//               onChange={(e) => setPayment(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل طرق الدفع</option>
//               <option value="cash">نقدًا</option>
//               <option value="card">بطاقة</option>
//               <option value="wallet">محفظة</option>
//             </select>

//             <select
//               value={saleType}
//               onChange={(e) => setSaleType(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">الكل</option>
//               <option value="sale">فواتير بيع</option>
//               <option value="return">مرتجعات</option>
//             </select>

//             <input
//               type="date"
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//             <input
//               type="date"
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//           </div>
//         </div>

//         {/* جدول المبيعات */}
//         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm min-w-[880px] text-right">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="p-2">#</th>
//                 <th>رقم الفاتورة</th>
//                 <th>النوع</th>
//                 <th>التاريخ</th>
//                 <th>العميل</th>
//                 <th>الكاشير</th>
//                 <th>الدفع</th>
//                 <th>الإجمالي</th>
//                 <th>إجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length ? (
//                 filtered.map((s, i) => (
//                   <tr key={s.id} className="border-t hover:bg-gray-50">
//                     <td className="p-2">{i + 1}</td>
//                     <td className="p-2 text-sky-700">{s.id}</td>
//                     <td className="p-2">
//                       {s.type === "sale" ? "بيع" : "مرتجع"}
//                     </td>
//                     <td className="p-2">
//                       <SafeDate value={s.date} />
//                     </td>
//                     <td className="p-2">{s.customer}</td>
//                     <td className="p-2">{s.cashier}</td>
//                     <td className="p-2">
//                       {s.payment === "cash"
//                         ? "نقدًا"
//                         : s.payment === "card"
//                         ? "بطاقة"
//                         : "محفظة"}
//                     </td>
//                     <td className="p-2 font-semibold text-emerald-700">
//                       {formatCurrency(s.total)}
//                     </td>
//                     <td className="p-2">
//                       <div className="flex flex-wrap gap-2">
//                         <button
//                           onClick={() => handleViewInvoice(s.id)}
//                           className="px-2 py-1 text-xs text-indigo-700 border rounded bg-indigo-50 hover:bg-indigo-100"
//                         >
//                           👁️ عرض
//                         </button>
//                         <button
//                           onClick={() => handlePrintInvoice(s)}
//                           className="px-2 py-1 text-xs border rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
//                         >
//                           🖨️ طباعة
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="9"
//                     className="p-6 text-center text-gray-500"
//                   >
//                     لا توجد بيانات مطابقة
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* الملخص */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <Summary
//             title="إجمالي المبيعات"
//             value={formatCurrency(totals.totalValue)}
//             color="text-emerald-600"
//           />
//           <Summary
//             title="عدد الفواتير"
//             value={totals.count.toLocaleString("ar-SA")}
//             color="text-sky-600"
//           />
//           <Summary
//             title="متوسط الفاتورة"
//             value={formatCurrency(totals.avg)}
//             color="text-amber-600"
//           />
//         </div>
//       </div>

//       {/* مودال تفاصيل الفاتورة */}
//       {viewInvoice && (
//         <Modal
//           title={`تفاصيل الفاتورة — ${viewInvoice.id}`}
//           onClose={() => setViewInvoice(null)}
//         >
//           <div className="space-y-2 text-sm">
//             <p>
//               <strong>العميل:</strong> {viewInvoice.customer}
//             </p>
//             <p>
//               <strong>الكاشير:</strong> {viewInvoice.cashier}
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
//                 {viewInvoice.items.map((it, i) => (
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

//             <div className="mt-3 font-semibold text-end text-emerald-700">
//               الإجمالي النهائي:
//               {formatCurrency(viewInvoice.total)}
//             </div>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   );
// }

// // بطاقة ملخص صغيرة
// function Summary({ title, value, color }) {
//   return (
//     <div className="p-4 text-center bg-white border rounded-lg shadow-sm">
//       <p className="text-xs text-gray-500">{title}</p>
//       <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
//     </div>
//   );
// }



















// // pages/sales.js
// import { useMemo, useState } from "react";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import toast from "react-hot-toast";

// import dynamic from "next/dynamic";
// import { useInventory } from "../context/InventoryContext";
// import { useShift } from "../context/ShiftContext";

// // 🔥 SafeDate dynamic — يمنع Hydration mismatch نهائيًا
// const SafeDate = dynamic(() => import("../components/SafeDate"), {
//   ssr: false,
// });

// export default function Sales() {
//   const [user] = useState({ name: "أحمد", role: "admin" });

//   // المخزون
//   const {
//     products,
//     decreaseStockOnSale,
//     increaseStockOnReturn,
//     getWarnings,
//   } = useInventory();

//   // الشفت
//   const { activeShift, registerInvoice } = useShift();

//   // بيانات افتراضية للمبيعات
//   const [sales, setSales] = useState([
//     {
//       id: "INV-1001",
//       date: new Date().toISOString(),
//       customer: "عميل نقدي",
//       cashier: "أحمد",
//       payment: "cash",
//       type: "sale",
//       discount: 0,
//       tax: 0,
//       total: 120,
//       items: [{ productId: 1, name: "باراسيتامول", qty: 2, price: 30 }],
//     },
//   ]);

//   // فلاتر
//   const [search, setSearch] = useState("");
//   const [cashier, setCashier] = useState("all");
//   const [payment, setPayment] = useState("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   const [viewInvoice, setViewInvoice] = useState(null);

//   // مودال إضافة فاتورة
//   const [showNewInvoice, setShowNewInvoice] = useState(false);
//   const [invoiceType, setInvoiceType] = useState("sale");
//   const [invoiceCustomer, setInvoiceCustomer] = useState("عميل نقدي");
//   const [invoicePayment, setInvoicePayment] = useState("cash");
//   const [invoiceDiscount, setInvoiceDiscount] = useState(0);
//   const [invoiceTax, setInvoiceTax] = useState(0);
//   const [invoiceItems, setInvoiceItems] = useState([]);

//   const [selectedProductId, setSelectedProductId] = useState("");
//   const [selectedQty, setSelectedQty] = useState(1);

//   const formatCurrency = (v) =>
//     `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

//   const computeTotals = (items, discount, tax) => {
//     const subtotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);
//     const disc = Number(discount || 0);
//     const t = Number(tax || 0);
//     return {
//       subtotal,
//       discount: disc,
//       tax: t,
//       total: subtotal - disc + t,
//     };
//   };

//   const invoiceTotal = (inv) =>
//     computeTotals(inv.items || [], inv.discount, inv.tax).total;

//   const filtered = useMemo(() => {
//     return sales.filter((s) => {
//       const q = search.trim().toLowerCase();
//       const matchesSearch =
//         !q ||
//         s.id.toLowerCase().includes(q) ||
//         s.customer.toLowerCase().includes(q);

//       const matchesCashier = cashier === "all" || s.cashier === cashier;
//       const matchesPayment = payment === "all" || s.payment === payment;

//       const dateStr = s.date?.slice(0, 10);
//       const betweenFrom = !dateFrom || dateStr >= dateFrom;
//       const betweenTo = !dateTo || dateStr <= dateTo;

//       return (
//         matchesSearch &&
//         matchesCashier &&
//         matchesPayment &&
//         betweenFrom &&
//         betweenTo
//       );
//     });
//   }, [sales, search, cashier, payment, dateFrom, dateTo]);

//   const totals = useMemo(() => {
//     const totalValue = filtered.reduce(
//       (sum, s) => sum + invoiceTotal(s),
//       0
//     );
//     const count = filtered.length;
//     return {
//       totalValue,
//       count,
//       avg: count ? totalValue / count : 0,
//     };
//   }, [filtered]);

//   const openNewInvoiceModal = () => {
//     setShowNewInvoice(true);
//     setInvoiceItems([]);
//     setInvoiceCustomer("عميل نقدي");
//     setInvoicePayment("cash");
//     setInvoiceDiscount(0);
//     setInvoiceTax(0);
//     setInvoiceType("sale");
//   };

//   const handleAddItemToInvoice = () => {
//     if (!selectedProductId) return toast.error("اختر منتج");

//     const qty = Number(selectedQty || 0);
//     if (qty <= 0) return toast.error("كمية غير صحيحة");

//     const product = products.find(
//       (p) => p.id === Number(selectedProductId)
//     );
//     if (!product) return;

//     // منع بيع كمية أكبر من المتوفر
//     if (invoiceType === "sale") {
//       const existingQty =
//         invoiceItems.find((i) => i.productId === product.id)?.qty || 0;
//       if (existingQty + qty > product.quantity) {
//         return toast.error("الكمية المطلوبة أكبر من المتوفر");
//       }
//     }

//     setInvoiceItems((prev) => {
//       const exists = prev.find((i) => i.productId === product.id);
//       if (exists) {
//         return prev.map((i) =>
//           i.productId === product.id
//             ? { ...i, qty: i.qty + qty }
//             : i
//         );
//       }
//       return [
//         ...prev,
//         {
//           productId: product.id,
//           name: product.name,
//           qty,
//           price: product.price,
//         },
//       ];
//     });
//   };

//   const saveInvoice = () => {
//     if (!activeShift) {
//       return toast.error("❌ يجب فتح شِفت قبل إضافة الفواتير");
//     }

//     if (!invoiceItems.length) {
//       return toast.error("أضف صنفًا واحدًا على الأقل");
//     }

//     const totals = computeTotals(
//       invoiceItems,
//       invoiceDiscount,
//       invoiceTax
//     );

//     const id = `INV-${String(Date.now()).slice(-6)}`;

//     const inv = {
//       id,
//       date: new Date().toISOString(),
//       customer: invoiceCustomer,
//       cashier: user.name,
//       payment: invoicePayment,
//       type: invoiceType,
//       discount: Number(invoiceDiscount),
//       tax: Number(invoiceTax),
//       total: totals.total,
//       items: invoiceItems,
//     };

//     // إضافة للواجهة
//     setSales((prev) => [inv, ...prev]);

//     // تحديث مخزون
//     invoiceItems.forEach((it) => {
//       if (invoiceType === "sale") decreaseStockOnSale(it.productId, it.qty);
//       else increaseStockOnReturn(it.productId, it.qty);
//     });

//     // ربط بالشفت
//     registerInvoice(inv);

//     toast.success("✔️ تم حفظ الفاتورة");
//     setShowNewInvoice(false);
//   };

//   const removeItem = (id) => {
//     setInvoiceItems((prev) =>
//       prev.filter((i) => i.productId !== id)
//     );
//   };

//   const ActionButtons = ({ invoice }) => (
//     <div className="flex gap-2">
//       <button
//         className="px-2 py-1 text-xs border rounded border-sky-300 text-sky-700"
//         onClick={() => setViewInvoice(invoice)}
//       >
//         👁️ عرض
//       </button>
//       <button className="px-2 py-1 text-xs border rounded border-emerald-300 text-emerald-700">
//         🖨️ طباعة
//       </button>
//     </div>
//   );

//   return (
//     <Layout user={user} title="المبيعات">
//       <div dir="rtl" className="space-y-6">

//         {/* هيدر */}
//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           <h1 className="text-xl font-bold text-gray-800">🧾 المبيعات</h1>

//           <button
//             onClick={openNewInvoiceModal}
//             className="px-4 py-2 text-sm font-semibold text-white rounded bg-emerald-600 hover:bg-emerald-700"
//           >
//             ➕ إضافة فاتورة
//           </button>
//         </div>

//         {/* فلاتر */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-5">

//             <input
//               className="p-2 border rounded"
//               placeholder="بحث..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />

//             <select
//               className="p-2 border rounded"
//               value={cashier}
//               onChange={(e) => setCashier(e.target.value)}
//             >
//               <option value="all">كل الكاشير</option>
//               {[...new Set(sales.map((s) => s.cashier))].map((c) => (
//                 <option key={c}>{c}</option>
//               ))}
//             </select>

//             <select
//               className="p-2 border rounded"
//               value={payment}
//               onChange={(e) => setPayment(e.target.value)}
//             >
//               <option value="all">كل طرق الدفع</option>
//               <option value="cash">نقدًا</option>
//               <option value="card">بطاقة</option>
//               <option value="wallet">محفظة</option>
//             </select>

//             <input
//               type="date"
//               className="p-2 border rounded"
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//             />

//             <input
//               type="date"
//               className="p-2 border rounded"
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* جدول */}
//         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-right text-sm min-w-[900px]">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">رقم</th>
//                 <th className="px-3 py-2">نوع</th>
//                 <th className="px-3 py-2">التاريخ</th>
//                 <th className="px-3 py-2">العميل</th>
//                 <th className="px-3 py-2">الكاشير</th>
//                 <th className="px-3 py-2">الدفع</th>
//                 <th className="px-3 py-2">الإجمالي</th>
//                 <th className="px-3 py-2">الإجراءات</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.map((s, i) => (
//                 <tr key={s.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{i + 1}</td>
//                   <td className="px-3 py-2 text-sky-700">{s.id}</td>
//                   <td className="px-3 py-2">{s.type === "sale" ? "بيع" : "مرتجع"}</td>
//                   <td className="px-3 py-2">
//                     <SafeDate value={s.date} />
//                   </td>
//                   <td className="px-3 py-2">{s.customer}</td>
//                   <td className="px-3 py-2">{s.cashier}</td>
//                   <td className="px-3 py-2">
//                     {s.payment === "cash"
//                       ? "نقدًا"
//                       : s.payment === "card"
//                       ? "بطاقة"
//                       : "محفظة"}
//                   </td>
//                   <td className="px-3 py-2 font-semibold text-emerald-700">
//                     {formatCurrency(invoiceTotal(s))}
//                   </td>
//                   <td className="px-3 py-2">
//                     <ActionButtons invoice={s} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* ملخص */}
//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//           <SummaryBox
//             title="إجمالي المبيعات"
//             value={formatCurrency(totals.totalValue)}
//             color="text-emerald-600"
//           />
//           <SummaryBox
//             title="عدد الفواتير"
//             value={totals.count}
//             color="text-sky-600"
//           />
//           <SummaryBox
//             title="متوسط الفاتورة"
//             value={formatCurrency(totals.avg)}
//             color="text-amber-600"
//           />
//         </div>

//         {/* عرض فاتورة */}
//         {viewInvoice && (
//           <Modal
//             title={`عرض الفاتورة ${viewInvoice.id}`}
//             onClose={() => setViewInvoice(null)}
//           >
//             <div className="space-y-2 text-sm">
//               <p><strong>العميل:</strong> {viewInvoice.customer}</p>
//               <p><strong>الكاشير:</strong> {viewInvoice.cashier}</p>
//             </div>
//           </Modal>
//         )}

//         {/* مودال إضافة فاتورة */}
//         {showNewInvoice && (
//           <Modal
//             title="➕ إضافة فاتورة جديدة"
//             onClose={() => setShowNewInvoice(false)}
//             onConfirm={saveInvoice}
//             confirmLabel="حفظ الفاتورة"
//           >
//             <div className="space-y-4 text-sm">

//               {/* بيانات */}
//               <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
//                 <input
//                   className="p-2 border rounded"
//                   value={invoiceCustomer}
//                   onChange={(e) => setInvoiceCustomer(e.target.value)}
//                 />

//                 <select
//                   className="p-2 border rounded"
//                   value={invoicePayment}
//                   onChange={(e) => setInvoicePayment(e.target.value)}
//                 >
//                   <option value="cash">نقدًا</option>
//                   <option value="card">بطاقة</option>
//                   <option value="wallet">محفظة</option>
//                 </select>

//                 <select
//                   className="p-2 border rounded"
//                   value={invoiceType}
//                   onChange={(e) => setInvoiceType(e.target.value)}
//                 >
//                   <option value="sale">بيع</option>
//                   <option value="return">مرتجع</option>
//                 </select>
//               </div>

//               {/* اختيار صنف */}
//               <div className="p-3 space-y-3 border rounded bg-gray-50">
//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
//                   <select
//                     className="p-2 border rounded"
//                     value={selectedProductId}
//                     onChange={(e) =>
//                       setSelectedProductId(e.target.value)
//                     }
//                   >
//                     <option value="">اختر صنفًا</option>
//                     {products.map((p) => (
//                       <option key={p.id} value={p.id}>
//                         {p.name}
//                       </option>
//                     ))}
//                   </select>

//                   <input
//                     type="number"
//                     className="p-2 border rounded"
//                     min={1}
//                     value={selectedQty}
//                     onChange={(e) => setSelectedQty(e.target.value)}
//                   />

//                   <button
//                     onClick={handleAddItemToInvoice}
//                     className="px-3 py-2 text-white rounded bg-emerald-600 hover:bg-emerald-700"
//                   >
//                     ➕ إضافة للسلة
//                   </button>
//                 </div>
//               </div>

//               {/* سلة */}
//               <div className="overflow-x-auto border rounded">
//                 <table className="w-full text-xs min-w-[500px]">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th>#</th>
//                       <th>الصنف</th>
//                       <th>كمية</th>
//                       <th>سعر</th>
//                       <th>إجمالي</th>
//                       <th>إزالة</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {invoiceItems.length ? (
//                       invoiceItems.map((it, i) => (
//                         <tr key={it.productId} className="border-t">
//                           <td>{i + 1}</td>
//                           <td>{it.name}</td>
//                           <td>{it.qty}</td>
//                           <td>{formatCurrency(it.price)}</td>
//                           <td>
//                             {formatCurrency(it.price * it.qty)}
//                           </td>
//                           <td>
//                             <button
//                               onClick={() => removeItem(it.productId)}
//                               className="px-2 py-1 text-red-600 border border-red-300 rounded"
//                             >
//                               ✕
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="6" className="py-3 text-center">
//                           لا توجد أصناف…
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* إجمالي */}
//               <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
//                 <input
//                   type="number"
//                   className="p-2 border rounded"
//                   placeholder="خصم"
//                   value={invoiceDiscount}
//                   onChange={(e) => setInvoiceDiscount(e.target.value)}
//                 />

//                 <input
//                   type="number"
//                   className="p-2 border rounded"
//                   placeholder="ضريبة"
//                   value={invoiceTax}
//                   onChange={(e) => setInvoiceTax(e.target.value)}
//                 />

//                 <div className="p-2 text-right border rounded bg-gray-50">
//                   {(() => {
//                     const t = computeTotals(
//                       invoiceItems,
//                       invoiceDiscount,
//                       invoiceTax
//                     );
//                     return (
//                       <p>
//                         <strong>الإجمالي:</strong>{" "}
//                         {formatCurrency(t.total)}
//                       </p>
//                     );
//                   })()}
//                 </div>
//               </div>
//             </div>
//           </Modal>
//         )}
//       </div>
//     </Layout>
//   );
// }

// function SummaryBox({ title, value, color }) {
//   return (
//     <div className="p-4 text-center bg-white border rounded">
//       <p className="text-xs text-gray-500">{title}</p>
//       <p className={`text-xl font-bold ${color}`}>{value}</p>
//     </div>
//   );
// }












// // pages/sales.js
// import { useMemo, useState } from "react";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import toast from "react-hot-toast";
// import { useInventory } from "../context/InventoryContext";

// /* ===========================
//    SafeDate Component
//    يمنع Hydration mismatch نهائيًا
// =========================== */
// function SafeDate({ value }) {
//   if (typeof window === "undefined") return "";
//   try {
//     return new Date(value).toLocaleString("ar-EG");
//   } catch {
//     return "";
//   }
// }

// export default function Sales() {
//   // مستخدم افتراضي (يمكن ربطها لاحقًا مع AuthContext)
//   const [user] = useState({ name: "أحمد", role: "admin" });

//   const {
//     products,
//     decreaseStockOnSale,
//     increaseStockOnReturn,
//     getWarnings,
//   } = useInventory();

//   const [sales, setSales] = useState([
//     {
//       id: "INV-1001",
//       date: new Date().toISOString(),
//       customer: "عميل نقدي",
//       cashier: "أحمد",
//       payment: "cash",
//       type: "sale",
//       discount: 0,
//       tax: 0,
//       total: 120,
//       items: [
//         { productId: 1, name: "باراسيتامول 500mg", qty: 2, price: 30 },
//       ],
//     },
//   ]);

//   // فلاتر
//   const [search, setSearch] = useState("");
//   const [cashier, setCashier] = useState("all");
//   const [payment, setPayment] = useState("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   // عرض فاتورة
//   const [viewInvoice, setViewInvoice] = useState(null);

//   // مودال إضافة فاتورة
//   const [showNewInvoice, setShowNewInvoice] = useState(false);
//   const [invoiceType, setInvoiceType] = useState("sale");
//   const [invoiceCustomer, setInvoiceCustomer] = useState("عميل نقدي");
//   const [invoicePayment, setInvoicePayment] = useState("cash");
//   const [invoiceDiscount, setInvoiceDiscount] = useState(0);
//   const [invoiceTax, setInvoiceTax] = useState(0);
//   const [invoiceItems, setInvoiceItems] = useState([]);

//   // اختيار منتج داخل المودال
//   const [selectedProductId, setSelectedProductId] = useState("");
//   const [selectedQty, setSelectedQty] = useState(1);

//   const formatCurrency = (v) =>
//     `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

//   const computeInvoiceTotals = (items, discount, tax) => {
//     const subtotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);
//     const disc = Number(discount || 0);
//     const t = Number(tax || 0);
//     const total = subtotal - disc + t;
//     return { subtotal, discount: disc, tax: t, total };
//   };

//   const invoiceTotal = (inv) =>
//     computeInvoiceTotals(inv.items || [], inv.discount, inv.tax).total;

//   // فلترة المبيعات
//   const filtered = useMemo(() => {
//     return sales.filter((s) => {
//       const q = search.trim().toLowerCase();
//       const passSearch =
//         !q ||
//         s.id.toLowerCase().includes(q) ||
//         (s.customer || "").toLowerCase().includes(q);
//       const passCashier = cashier === "all" || s.cashier === cashier;
//       const passPayment = payment === "all" || s.payment === payment;

//       const dateStr = s.date?.slice(0, 10) || "";
//       const passDateFrom = !dateFrom || dateStr >= dateFrom;
//       const passDateTo = !dateTo || dateStr <= dateTo;

//       return (
//         passSearch &&
//         passCashier &&
//         passPayment &&
//         passDateFrom &&
//         passDateTo
//       );
//     });
//   }, [sales, search, cashier, payment, dateFrom, dateTo]);

//   const totals = useMemo(() => {
//     const totalValue = filtered.reduce(
//       (sum, s) => sum + Number(invoiceTotal(s)),
//       0
//     );
//     const count = filtered.length;
//     const avg = count ? totalValue / count : 0;
//     return { totalValue, count, avg };
//   }, [filtered]);

//   const handleViewInvoice = (id) => {
//     const inv = sales.find((s) => s.id === id);
//     if (!inv) return;
//     setViewInvoice(inv);
//   };

//   // 🖨️ طباعة الفاتورة
//   const handlePrintInvoice = (invoice) => {
//     const items = invoice.items || [];
//     const totals = computeInvoiceTotals(
//       items,
//       invoice.discount,
//       invoice.tax
//     );

//     const html = `
//       <html dir="rtl" lang="ar">
//         <head>
//           <meta charset="utf-8" />
//           <title>فاتورة ${invoice.id}</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; padding: 20px; }
//             h2 { color:#0ea5e9; margin-bottom: 10px; text-align:center; }
//             table { width:100%; border-collapse: collapse; margin-top:10px; }
//             th, td { border:1px solid #ddd; padding:6px; text-align:center; font-size:13px; }
//             th { background:#f3f4f6; }
//             tfoot td { font-weight:bold; color:#0ea5e9; }
//             .meta { margin-bottom:10px; font-size:13px; }
//           </style>
//         </head>
//         <body>
//           <h2>صيدلية المعلم</h2>
//           <div class="meta">
//             <p>فاتورة رقم <strong>${invoice.id}</strong></p>
//             <p>النوع: ${invoice.type === "sale" ? "بيع" : "مرتجع"}</p>
//             <p>العميل: ${invoice.customer || "عميل نقدي"}</p>
//             <p>الكاشير: ${invoice.cashier || "—"}</p>
//             <p>التاريخ: ${new Date(invoice.date).toLocaleString("ar-EG")}</p>
//             <p>طريقة الدفع: ${
//               invoice.payment === "cash"
//                 ? "نقدًا"
//                 : invoice.payment === "card"
//                 ? "بطاقة"
//                 : "محفظة"
//             }</p>
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${
//                 items.length
//                   ? items
//                       .map(
//                         (it) =>
//                           `<tr>
//                             <td>${it.name}</td>
//                             <td>${it.qty}</td>
//                             <td>${formatCurrency(it.price)}</td>
//                             <td>${formatCurrency(it.qty * it.price)}</td>
//                           </tr>`
//                       )
//                       .join("")
//                   : `<tr><td colspan="4">لا توجد أصناف في هذه الفاتورة</td></tr>`
//               }
//             </tbody>
//             <tfoot>
//               <tr><td colspan="3">الإجمالي قبل الخصم</td><td>${formatCurrency(
//                 totals.subtotal
//               )}</td></tr>
//               <tr><td colspan="3">الخصم</td><td>${formatCurrency(
//                 totals.discount
//               )}</td></tr>
//               <tr><td colspan="3">الضريبة</td><td>${formatCurrency(
//                 totals.tax
//               )}</td></tr>
//               <tr><td colspan="3">الإجمالي النهائي</td><td>${formatCurrency(
//                 totals.total
//               )}</td></tr>
//             </tfoot>
//           </table>
//           <script>
//             window.onload = () => {
//               setTimeout(() => {
//                 window.print();
//                 setTimeout(() => window.close(), 800);
//               }, 300);
//             };
//           </script>
//         </body>
//       </html>
//     `;

//     const w = window.open("", "_blank", "width=900,height=900");
//     w.document.write(html);
//     w.document.close();
//   };

//   // إجراءات الجدول
//   const ActionButtons = ({ invoice }) => (
//     <div className="flex flex-wrap justify-center gap-2">
//       <button
//         onClick={() => handleViewInvoice(invoice.id)}
//         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-sky-200 text-sky-700 hover:bg-sky-50"
//       >
//         👁️ عرض
//       </button>
//       <button
//         onClick={() => handlePrintInvoice(invoice)}
//         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
//       >
//         🖨️ طباعة
//       </button>
//     </div>
//   );

//   /* ===========================
//       Add Item to invoice
//   ============================ */
//   const handleAddItemToInvoice = () => {
//     if (!selectedProductId) {
//       toast.error("اختر صنفًا أولًا");
//       return;
//     }
//     const qty = Number(selectedQty || 0);
//     if (qty <= 0) {
//       toast.error("الكمية يجب أن تكون أكبر من صفر");
//       return;
//     }

//     const product = products.find(
//       (p) => p.id === Number(selectedProductId)
//     );
//     if (!product) {
//       toast.error("لم يتم العثور على المنتج المحدد");
//       return;
//     }

//     if (invoiceType === "sale") {
//       const existingQty =
//         invoiceItems.find((it) => it.productId === product.id)?.qty ||
//         0;
//       if (qty + existingQty > product.quantity) {
//         toast.error("الكمية المطلوبة أكبر من المتوفر");
//         return;
//       }
//     }

//     setInvoiceItems((prev) => {
//       const exists = prev.find((it) => it.productId === product.id);
//       if (exists) {
//         return prev.map((it) =>
//           it.productId === product.id
//             ? { ...it, qty: it.qty + qty }
//             : it
//         );
//       }
//       return [
//         ...prev,
//         {
//           productId: product.id,
//           name: product.name,
//           price: product.price,
//           qty,
//         },
//       ];
//     });

//     setSelectedQty(1);
//   };

//   const handleRemoveItemFromInvoice = (productId) => {
//     setInvoiceItems((prev) =>
//       prev.filter((it) => it.productId !== productId)
//     );
//   };

//   const handleOpenNewInvoice = () => {
//     setShowNewInvoice(true);
//     setInvoiceType("sale");
//     setInvoiceCustomer("عميل نقدي");
//     setInvoicePayment("cash");
//     setInvoiceDiscount(0);
//     setInvoiceTax(0);
//     setInvoiceItems([]);
//     setSelectedProductId("");
//     setSelectedQty(1);
//   };

//   const handleSaveInvoice = () => {
//     if (!invoiceItems.length) {
//       toast.error("أضف صنفًا واحدًا على الأقل");
//       return;
//     }

//     const totals = computeInvoiceTotals(
//       invoiceItems,
//       invoiceDiscount,
//       invoiceTax
//     );

//     const id = `INV-${String(Date.now()).slice(-6)}`;

//     const newInvoice = {
//       id,
//       date: new Date().toISOString(),
//       customer: invoiceCustomer || "عميل نقدي",
//       cashier: user.name,
//       payment: invoicePayment,
//       type: invoiceType,
//       discount: Number(invoiceDiscount || 0),
//       tax: Number(invoiceTax || 0),
//       total: totals.total,
//       items: invoiceItems,
//     };

//     setSales((prev) => [newInvoice, ...prev]);

//     invoiceItems.forEach((it) => {
//       if (invoiceType === "sale") {
//         decreaseStockOnSale?.(it.productId, it.qty);
//       } else {
//         increaseStockOnReturn?.(it.productId, it.qty);
//       }
//     });

//     toast.success("تم حفظ الفاتورة وتحديث المخزون");
//     setShowNewInvoice(false);
//   };

//   const cashiersList = Array.from(
//     new Set(sales.map((s) => s.cashier).filter(Boolean))
//   );

//   const selectedProduct = products.find(
//     (p) => p.id === Number(selectedProductId)
//   );
//   const selectedWarnings = selectedProduct
//     ? getWarnings(selectedProduct)
//     : [];

//   /* ===========================
//         RETURN UI
//   ============================ */
//   return (
//     <Layout user={user} title="المبيعات">
//       <div dir="rtl" className="space-y-6">
//         {/* الهيدر + زر إضافة فاتورة */}
//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           <h1 className="text-xl font-bold text-gray-800">🧾 إدارة المبيعات</h1>

//           <button
//             onClick={handleOpenNewInvoice}
//             className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
//           >
//             ➕ إضافة فاتورة جديدة
//           </button>
//         </div>

//         {/* الفلاتر */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
//             <input
//               type="text"
//               placeholder="ابحث برقم الفاتورة / العميل"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//             />

//             <select
//               value={cashier}
//               onChange={(e) => setCashier(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل الكاشير</option>
//               {cashiersList.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={payment}
//               onChange={(e) => setPayment(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل طرق الدفع</option>
//               <option value="cash">نقدًا</option>
//               <option value="card">بطاقة</option>
//               <option value="wallet">محفظة</option>
//             </select>

//             <input
//               type="date"
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             />

//             <input
//               type="date"
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//           </div>
//         </div>

//         {/* جدول */}
//         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right min-w-[880px]">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">رقم الفاتورة</th>
//                 <th className="px-3 py-2">النوع</th>
//                 <th className="px-3 py-2">التاريخ</th>
//                 <th className="px-3 py-2">العميل</th>
//                 <th className="px-3 py-2">الكاشير</th>
//                 <th className="px-3 py-2">الدفع</th>
//                 <th className="px-3 py-2">الإجمالي</th>
//                 <th className="px-3 py-2">الإجراءات</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.length ? (
//                 filtered.map((s, i) => (
//                   <tr key={s.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{i + 1}</td>

//                     <td className="px-3 py-2 font-medium text-sky-700">
//                       {s.id}
//                     </td>

//                     <td className="px-3 py-2">
//                       {s.type === "sale" ? "بيع" : "مرتجع"}
//                     </td>

//                     <td className="px-3 py-2">
//                       <SafeDate value={s.date} />
//                     </td>

//                     <td className="px-3 py-2">{s.customer}</td>
//                     <td className="px-3 py-2">{s.cashier}</td>

//                     <td className="px-3 py-2">
//                       {s.payment === "cash"
//                         ? "نقدًا"
//                         : s.payment === "card"
//                         ? "بطاقة"
//                         : "محفظة"}
//                     </td>

//                     <td className="px-3 py-2 font-semibold text-emerald-700">
//                       {formatCurrency(invoiceTotal(s))}
//                     </td>

//                     <td className="px-3 py-2">
//                       <ActionButtons invoice={s} />
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="9"
//                     className="py-6 text-center text-gray-500"
//                   >
//                     لا توجد نتائج
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* ملخص */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <Summary
//             title="إجمالي المبيعات"
//             value={formatCurrency(totals.totalValue)}
//             color="text-emerald-600"
//           />
//           <Summary
//             title="عدد الفواتير"
//             value={totals.count.toLocaleString("ar-SA")}
//             color="text-sky-600"
//           />
//           <Summary
//             title="متوسط الفاتورة"
//             value={formatCurrency(totals.avg.toFixed(2))}
//             color="text-amber-600"
//           />
//         </div>
//       </div>

//       {/* Modal عرض الفاتورة */}
//       {viewInvoice && (
//         <Modal
//           title={`تفاصيل الفاتورة — ${viewInvoice.id}`}
//           onClose={() => setViewInvoice(null)}
//         >
//           <div className="space-y-2 text-sm" dir="rtl">
//             <p>
//               <strong>النوع:</strong>{" "}
//               {viewInvoice.type === "sale" ? "بيع" : "مرتجع"}
//             </p>
//             <p>
//               <strong>العميل:</strong> {viewInvoice.customer}
//             </p>
//             <p>
//               <strong>الكاشير:</strong> {viewInvoice.cashier}
//             </p>
//             <p>
//               <strong>طريقة الدفع:</strong>{" "}
//               {viewInvoice.payment === "cash"
//                 ? "نقدًا"
//                 : viewInvoice.payment === "card"
//                 ? "بطاقة"
//                 : "محفظة"}
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
//                 {viewInvoice.items?.map((it, i) => (
//                   <tr key={i}>
//                     <td>{i + 1}</td>
//                     <td>{it.name}</td>
//                     <td>{it.qty}</td>
//                     <td>{formatCurrency(it.price)}</td>
//                     <td>{formatCurrency(it.qty * it.price)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="mt-2 font-semibold text-right text-emerald-700">
//               الإجمالي النهائي:{" "}
//               {formatCurrency(invoiceTotal(viewInvoice))}
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Modal إضافة فاتورة جديدة */}
//       {showNewInvoice && (
//         <Modal
//           title="➕ إضافة فاتورة جديدة"
//           onClose={() => setShowNewInvoice(false)}
//           onConfirm={handleSaveInvoice}
//           confirmLabel="حفظ الفاتورة"
//         >
//           <div className="space-y-4 text-sm" dir="rtl">
//             {/* بيانات أساسية */}
//             <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded"
//                 placeholder="اسم العميل"
//                 value={invoiceCustomer}
//                 onChange={(e) => setInvoiceCustomer(e.target.value)}
//               />

//               <select
//                 className="w-full p-2 border rounded"
//                 value={invoicePayment}
//                 onChange={(e) => setInvoicePayment(e.target.value)}
//               >
//                 <option value="cash">نقدًا</option>
//                 <option value="card">بطاقة</option>
//                 <option value="wallet">محفظة</option>
//               </select>

//               <select
//                 className="w-full p-2 border rounded"
//                 value={invoiceType}
//                 onChange={(e) => setInvoiceType(e.target.value)}
//               >
//                 <option value="sale">بيع</option>
//                 <option value="return">مرتجع</option>
//               </select>
//             </div>

//             {/* اختيار صنف */}
//             <div className="p-3 space-y-3 border rounded-lg bg-gray-50">
//               <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
//                 <select
//                   className="w-full p-2 border rounded"
//                   value={selectedProductId}
//                   onChange={(e) =>
//                     setSelectedProductId(e.target.value)
//                   }
//                 >
//                   <option value="">اختر صنفًا…</option>
//                   {products.map((p) => (
//                     <option key={p.id} value={p.id}>
//                       {p.name}
//                     </option>
//                   ))}
//                 </select>

//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   min={1}
//                   value={selectedQty}
//                   onChange={(e) => setSelectedQty(e.target.value)}
//                   placeholder="الكمية"
//                 />

//                 <button
//                   onClick={handleAddItemToInvoice}
//                   className="w-full px-3 py-2 text-sm font-semibold text-white rounded bg-emerald-600 hover:bg-emerald-700"
//                 >
//                   ➕ إضافة للسلة
//                 </button>
//               </div>

//               {/* معلومات وتحذيرات المنتج */}
//               {selectedProduct && (
//                 <div className="space-y-1 text-xs">
//                   <p>
//                     <strong>السعر:</strong>{" "}
//                     {formatCurrency(selectedProduct.price)}
//                   </p>
//                   <p>
//                     <strong>المخزون المتوفر:</strong>{" "}
//                     {selectedProduct.quantity}
//                   </p>
//                   {selectedWarnings.length ? (
//                     <ul className="pr-4 mt-1 text-red-600 list-disc">
//                       {selectedWarnings.map((w, i) => (
//                         <li key={i}>{w}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="mt-1 text-green-700">
//                       لا توجد تحذيرات على هذا الصنف.
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* سلة الأصناف */}
//             <div className="overflow-x-auto border rounded-lg">
//               <table className="w-full text-xs text-right min-w-[500px]">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-2 py-1">#</th>
//                     <th className="px-2 py-1">الصنف</th>
//                     <th className="px-2 py-1">الكمية</th>
//                     <th className="px-2 py-1">السعر</th>
//                     <th className="px-2 py-1">الإجمالي</th>
//                     <th className="px-2 py-1">إزالة</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {invoiceItems.length ? (
//                     invoiceItems.map((it, i) => (
//                       <tr key={it.productId} className="border-t">
//                         <td className="px-2 py-1">{i + 1}</td>
//                         <td className="px-2 py-1">{it.name}</td>
//                         <td className="px-2 py-1">{it.qty}</td>
//                         <td className="px-2 py-1">
//                           {formatCurrency(it.price)}
//                         </td>
//                         <td className="px-2 py-1">
//                           {formatCurrency(it.price * it.qty)}
//                         </td>
//                         <td className="px-2 py-1 text-center">
//                           <button
//                             onClick={() =>
//                               handleRemoveItemFromInvoice(it.productId)
//                             }
//                             className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50"
//                           >
//                             ✕
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="6"
//                         className="px-2 py-3 text-center text-gray-400"
//                       >
//                         لم تتم إضافة أي أصناف بعد…
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* الخصم + الضريبة + الإجمالي */}
//             <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
//               <input
//                 type="number"
//                 className="w-full p-2 border rounded"
//                 placeholder="الخصم"
//                 value={invoiceDiscount}
//                 onChange={(e) => setInvoiceDiscount(e.target.value)}
//               />

//               <input
//                 type="number"
//                 className="w-full p-2 border rounded"
//                 placeholder="الضريبة"
//                 value={invoiceTax}
//                 onChange={(e) => setInvoiceTax(e.target.value)}
//               />

//               <div className="p-2 text-sm text-right border rounded bg-gray-50">
//                 {(() => {
//                   const totals = computeInvoiceTotals(
//                     invoiceItems,
//                     invoiceDiscount,
//                     invoiceTax
//                   );
//                   return (
//                     <>
//                       <p>
//                         <strong>الإجمالي:</strong>{" "}
//                         {formatCurrency(totals.total)}
//                       </p>
//                     </>
//                   );
//                 })()}
//               </div>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   );
// }

// /* ===========================
//   Summary Box
// =========================== */
// function Summary({ title, value, color }) {
//   return (
//     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
//       <p className="text-xs text-gray-500">{title}</p>
//       <p className={`mt-1 text-xl sm:text-2xl font-bold ${color}`}>
//         {value}
//       </p>
//     </div>
//   );
// }















// // pages/sales.js
// import { useState } from "react";
// import Layout from "../components/Layout";
// import toast from "react-hot-toast";
// import { useInventory } from "../context/InventoryContext";
// import { useShift } from "../context/ShiftContext";
// import { useAuth } from "../context/AuthContext";

// export default function SalesPage() {
//   const { user, hasPermission } = useAuth();
//   const {
//     products,
//     getProduct,
//     getWarnings,
//     decreaseStockOnSale,
//     increaseStockOnReturn,
//   } = useInventory();
//   const { addSaleOperation, addReturnOperation } = useShift();

//   const [selectedId, setSelectedId] = useState("");
//   const [qty, setQty] = useState("");
//   const [cart, setCart] = useState([]);

//   const [returnId, setReturnId] = useState("");
//   const [returnQty, setReturnQty] = useState("");

//   if (!hasPermission(["admin", "cashier"])) {
//     return (
//       <div dir="rtl" className="p-6 text-center text-red-600">
//         ⚠️ ليس لديك صلاحية لدخول شاشة المبيعات.
//       </div>
//     );
//   }

//   const handleAddToCart = () => {
//     const id = Number(selectedId);
//     const q = Number(qty);

//     if (!id || !q || q <= 0) {
//       toast.error("الرجاء اختيار المنتج وإدخال كمية صحيحة");
//       return;
//     }

//     const product = getProduct(id);
//     if (!product) {
//       toast.error("المنتج غير موجود");
//       return;
//     }

//     if (q > product.quantity) {
//       toast.error("الكمية المطلوبة أكبر من الكمية المتوفرة في المخزون");
//       return;
//     }

//     const warnings = getWarnings(product);
//     if (warnings.length) {
//       const ok = confirm(
//         `تحذيرات:\n${warnings.join(
//           "\n"
//         )}\n\nهل تريد المتابعة في عملية البيع؟`
//       );
//       if (!ok) return;
//     }

//     decreaseStockOnSale(id, q);
//     addSaleOperation(product.name, q, product.price);

//     setCart((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         name: product.name,
//         qty: q,
//         price: product.price,
//         total: product.price * q,
//       },
//     ]);

//     setQty("");
//     toast.success("تمت إضافة الصنف إلى الفاتورة وخصم الكمية من المخزون");
//   };

//   const invoiceTotal = cart.reduce((s, i) => s + i.total, 0);

//   const printInvoice = () => {
//     if (!cart.length) {
//       toast.error("لا توجد أصناف في الفاتورة للطباعة");
//       return;
//     }

//     const w = window.open("", "", "width=400,height=600");

//     w.document.write(`
//       <html dir="rtl" lang="ar">
//       <head>
//         <title>فاتورة بيع</title>
//         <style>
//           body { font-family:'Tajawal',sans-serif; padding:20px; }
//           h2 { text-align:center; margin-bottom:10px; }
//           table { width:100%; border-collapse:collapse; font-size:12px; }
//           th, td { border-bottom:1px solid #ddd; padding:5px; text-align:right; }
//           th { background:#f5f5f5; }
//         </style>
//       </head>
//       <body>
//         <h2>فاتورة بيع</h2>
//         <p>الكاشير: ${user?.name || ""}</p>

//         <table>
//           <thead>
//             <tr>
//               <th>الصنف</th>
//               <th>الكمية</th>
//               <th>السعر</th>
//               <th>الإجمالي</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${cart
//               .map(
//                 (i) => `
//               <tr>
//                 <td>${i.name}</td>
//                 <td>${i.qty}</td>
//                 <td>${i.price}</td>
//                 <td>${i.total}</td>
//               </tr>
//             `
//               )
//               .join("")}
//           </tbody>
//         </table>

//         <h3 style="margin-top:15px;">الإجمالي: ${invoiceTotal.toFixed(
//           2
//         )} ر.س</h3>

//         <p style="margin-top:20px; text-align:center;">شكرًا لتعاملكم معنا</p>

//         <script>window.print()</script>
//       </body>
//       </html>
//     `);

//     w.document.close();
//   };

//   const handleReturn = () => {
//     const id = Number(returnId);
//     const q = Number(returnQty);

//     if (!id || !q || q <= 0) {
//       toast.error("الرجاء اختيار المنتج المرتجع وإدخال كمية صحيحة");
//       return;
//     }

//     const product = getProduct(id);
//     if (!product) {
//       toast.error("المنتج غير موجود");
//       return;
//     }

//     increaseStockOnReturn(id, q);
//     addReturnOperation(product.name, q, product.price);
//     toast.success("تم تسجيل المرتجع وزيادة المخزون");
//     setReturnQty("");
//   };

//   return (
//     <Layout user={user} title="المبيعات">
//       <div dir="rtl" className="space-y-8">
//         <h1 className="text-xl font-bold text-gray-800">🧾 شاشة المبيعات</h1>

//         {/* إضافة صنف للفاتورة */}
//         <section className="p-5 space-y-4 bg-white border shadow rounded-xl">
//           <h2 className="text-lg font-semibold text-gray-700">
//             إضافة صنف إلى الفاتورة
//           </h2>

//           <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//             <div>
//               <label className="block mb-1 text-xs text-gray-500">
//                 المنتج
//               </label>
//               <select
//                 className="w-full p-2 text-sm border rounded"
//                 value={selectedId}
//                 onChange={(e) => setSelectedId(e.target.value)}
//               >
//                 <option value="">اختر المنتج…</option>
//                 {products.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.name} — مخزون: {p.quantity}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 text-xs text-gray-500">
//                 الكمية
//               </label>
//               <input
//                 type="number"
//                 className="w-full p-2 text-sm border rounded"
//                 placeholder="مثال: 1"
//                 value={qty}
//                 onChange={(e) => setQty(e.target.value)}
//               />
//             </div>

//             <div className="flex items-end">
//               <button
//                 onClick={handleAddToCart}
//                 className="w-full py-2 text-sm text-white rounded-lg bg-sky-600 hover:bg-sky-700"
//               >
//                 ➕ إضافة للفاتورة وخصم من المخزون
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* الفاتورة الحالية */}
//         <section className="p-5 space-y-4 bg-white border shadow rounded-xl">
//           <h2 className="text-lg font-semibold text-gray-700">
//             تفاصيل الفاتورة الحالية
//           </h2>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-right">
//               <thead className="text-gray-700 bg-gray-50">
//                 <tr>
//                   <th className="p-2">الصنف</th>
//                   <th className="p-2">الكمية</th>
//                   <th className="p-2">السعر</th>
//                   <th className="p-2">الإجمالي</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.map((i) => (
//                   <tr key={i.id} className="border-t">
//                     <td className="p-2">{i.name}</td>
//                     <td className="p-2">{i.qty}</td>
//                     <td className="p-2">{i.price} ر.س</td>
//                     <td className="p-2">{i.total} ر.س</td>
//                   </tr>
//                 ))}

//                 {!cart.length && (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="p-4 text-center text-gray-400"
//                     >
//                       لا توجد أصناف مضافة حتى الآن…
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex flex-col gap-3 mt-3 md:flex-row md:items-center md:justify-between">
//             <div className="text-lg font-bold">
//               الإجمالي:{" "}
//               <span className="text-sky-700">
//                 {invoiceTotal.toFixed(2)} ر.س
//               </span>
//             </div>

//             <button
//               onClick={printInvoice}
//               className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
//             >
//               🖨️ طباعة الفاتورة
//             </button>
//           </div>
//         </section>

//         {/* المرتجعات */}
//         <section className="p-5 space-y-4 bg-white border shadow rounded-xl">
//           <h2 className="text-lg font-semibold text-gray-700">
//             مرتجعات تزيد المخزون
//           </h2>

//           <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//             <div>
//               <label className="block mb-1 text-xs text-gray-500">
//                 المنتج المرتجع
//               </label>
//               <select
//                 className="w-full p-2 text-sm border rounded"
//                 value={returnId}
//                 onChange={(e) => setReturnId(e.target.value)}
//               >
//                 <option value="">اختر المنتج…</option>
//                 {products.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 text-xs text-gray-500">
//                 الكمية المرتجعة
//               </label>
//               <input
//                 type="number"
//                 className="w-full p-2 text-sm border rounded"
//                 placeholder="مثال: 1"
//                 value={returnQty}
//                 onChange={(e) => setReturnQty(e.target.value)}
//               />
//             </div>

//             <div className="flex items-end">
//               <button
//                 onClick={handleReturn}
//                 className="w-full py-2 text-sm text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
//               >
//                 🔁 تسجيل مرتجع وزيادة المخزون
//               </button>
//             </div>
//           </div>
//         </section>
//       </div>
//     </Layout>
//   );
// }



















// // pages/sales.js
// import { useEffect, useMemo, useRef, useState } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import toast from 'react-hot-toast'
// import theme from '../theme'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from 'recharts'

// export default function Sales() {
//   const [user] = useState({ name: 'أحمد', role: 'admin' })
//   const [sales, setSales] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [cashier, setCashier] = useState('all')
//   const [payment, setPayment] = useState('all')
//   const [dateFrom, setDateFrom] = useState('')
//   const [dateTo, setDateTo] = useState('')
//   const [viewInvoice, setViewInvoice] = useState(null)
//   const printRef = useRef(null)

//   const API_URL = 'http://localhost:5000/api/sales'
// useEffect(() => {
//   const token = localStorage.getItem("pharmacy_token")
//   if (!token) {
//     router.replace("/")   // redirect to login
//   }
// }, [])

//   useEffect(() => {
//     const fetchSales = async () => {
//       try {
//         setLoading(true)
//         const res = await fetch(API_URL)
//         const data = await res.json()
//         if (!res.ok) throw new Error(data.message || 'خطأ في تحميل البيانات')
//         const formatted = data.map((s) => ({
//           id: s.invoice_code,
//           date: s.date,
//           customer: s.customer,
//           cashier: s.cashier_name || 'غير محدد',
//           payment: s.payment,
//           discount: s.discount,
//           tax: s.tax,
//           total: s.total,
//         }))
//         setSales(formatted)
//       } catch (err) {
//         toast.error('❌ فشل الاتصال بالسيرفر')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchSales()
//   }, [])

//   const formatCurrency = (v) => `${Number(v || 0).toLocaleString('ar-SA')} ر.س`
//   const invoiceTotal = (inv) =>
//     (inv.items?.reduce((sum, it) => sum + it.qty * it.price, 0) || Number(inv.total)) || 0

//   const handleViewInvoice = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}/by-code/${id}`)
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message)
//       setViewInvoice({
//         id: data.invoice_code,
//         date: data.date,
//         customer: data.customer,
//         cashier: data.cashier_name || '—',
//         payment: data.payment,
//         discount: data.discount,
//         tax: data.tax,
//         items: data.items.map((it) => ({
//           name: it.name,
//           qty: it.qty,
//           price: it.price,
//         })),
//       })
//     } catch {
//       toast.error('❌ فشل جلب تفاصيل الفاتورة')
//     }
//   }

//   // ✅ طباعة تعمل على كل المتصفحات
//   // 🖨️ الطباعة — الإصدار الآمن
// const handlePrintInvoice = (invoice) => {
//   const items = invoice.items || []  // ✅ ضمان وجود مصفوفة
//   const totalValue =
//     items.length > 0
//       ? items.reduce((sum, it) => sum + it.qty * it.price, 0)
//       : Number(invoice.total) || 0

//   const html = `
//     <html dir="rtl" lang="ar">
//       <head>
//         <meta charset="utf-8" />
//         <title>فاتورة ${invoice.id}</title>
//         <style>
//           body { font-family: 'Tajawal', sans-serif; padding: 20px; }
//           h2 { color:#0ea5e9; margin-bottom: 10px; }
//           table { width:100%; border-collapse: collapse; margin-top:10px; }
//           th, td { border:1px solid #ddd; padding:6px; text-align:center; }
//           th { background:#f3f4f6; }
//           tfoot td { font-weight:bold; color:#0ea5e9; }
//         </style>
//       </head>
//       <body>
//         <h2>صيدلية المعلم</h2>
//         <p>فاتورة رقم <strong>${invoice.id}</strong></p>
//         <p>العميل: ${invoice.customer}</p>
//         <p>الكاشير: ${invoice.cashier}</p>
//         <p>التاريخ: ${new Date(invoice.date).toLocaleString('ar-EG')}</p>
//         <table>
//           <thead>
//             <tr><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
//           </thead>
//           <tbody>
//             ${
//               items.length
//                 ? items
//                     .map(
//                       (it) =>
//                         `<tr><td>${it.name}</td><td>${it.qty}</td><td>${formatCurrency(it.price)}</td><td>${formatCurrency(
//                           it.qty * it.price
//                         )}</td></tr>`
//                     )
//                     .join('')
//                 : `<tr><td colspan="4">لا توجد أصناف في هذه الفاتورة</td></tr>`
//             }
//           </tbody>
//           <tfoot>
//             <tr><td colspan="3">الإجمالي</td><td>${formatCurrency(totalValue)}</td></tr>
//           </tfoot>
//         </table>
//         <script>
//           window.onload = () => {
//             setTimeout(() => {
//               window.print();
//               setTimeout(() => window.close(), 800);
//             }, 300);
//           };
//         </script>
//       </body>
//     </html>`

//   const w = window.open('', '_blank', 'width=900,height=900')
//   w.document.write(html)
//   w.document.close()
// }


//   const filtered = useMemo(() => {
//     return sales.filter((s) => {
//       const q = search.trim().toLowerCase()
//       const passSearch =
//         !q ||
//         s.id.toLowerCase().includes(q) ||
//         s.customer.toLowerCase().includes(q)
//       const passCashier = cashier === 'all' || s.cashier === cashier
//       const passPayment = payment === 'all' || s.payment === payment
//       const passDateFrom = !dateFrom || s.date.slice(0, 10) >= dateFrom
//       const passDateTo = !dateTo || s.date.slice(0, 10) <= dateTo
//       return passSearch && passCashier && passPayment && passDateFrom && passDateTo
//     })
//   }, [sales, search, cashier, payment, dateFrom, dateTo])

//   const totals = useMemo(() => {
//     const totalValue = filtered.reduce((sum, s) => sum + Number(s.total), 0)
//     const count = filtered.length
//     const avg = count ? totalValue / count : 0
//     return { totalValue, count, avg }
//   }, [filtered])

//   const ActionButtons = ({ invoice }) => (
//     <div className="flex flex-wrap justify-center gap-2">
//       <button
//         onClick={() => handleViewInvoice(invoice.id)}
//         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-sky-200 text-sky-700 hover:bg-sky-50"
//       >
//         👁️ عرض
//       </button>
//       <button
//         onClick={() => handlePrintInvoice(invoice)}
//         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
//       >
//         🖨️ طباعة
//       </button>
//     </div>
//   )

//   return (
//     <Layout user={user} title="المبيعات">
//       <div dir="rtl" className="space-y-6">
//         {/* الفلاتر والبحث */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
//             <input
//               type="text"
//               placeholder="ابحث برقم الفاتورة / العميل"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//             />
//             <select value={cashier} onChange={(e) => setCashier(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               <option value="all">كل الكاشير</option>
//               {Array.from(new Set(sales.map((s) => s.cashier))).map((c) => (
//                 <option key={c}>{c}</option>
//               ))}
//             </select>
//             <select value={payment} onChange={(e) => setPayment(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               <option value="all">كل طرق الدفع</option>
//               <option value="cash">نقدًا</option>
//               <option value="card">بطاقة</option>
//               <option value="wallet">محفظة</option>
//             </select>
//             <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 text-sm border rounded-md" />
//             <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 text-sm border rounded-md" />
//           </div>
//         </div>

//         {/* الجدول */}
//         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right min-w-[880px]">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">رقم الفاتورة</th>
//                 <th className="px-3 py-2">التاريخ</th>
//                 <th className="px-3 py-2">العميل</th>
//                 <th className="px-3 py-2">الكاشير</th>
//                 <th className="px-3 py-2">الدفع</th>
//                 <th className="px-3 py-2">الإجمالي</th>
//                 <th className="px-3 py-2">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length ? (
//                 filtered.map((s, i) => (
//                   <tr key={s.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{i + 1}</td>
//                     <td className="px-3 py-2 font-medium text-sky-700">{s.id}</td>
//                     <td className="px-3 py-2">{new Date(s.date).toLocaleString('ar-EG')}</td>
//                     <td className="px-3 py-2">{s.customer}</td>
//                     <td className="px-3 py-2">{s.cashier}</td>
//                     <td className="px-3 py-2">
//                       {s.payment === 'cash' ? 'نقدًا' : s.payment === 'card' ? 'بطاقة' : 'محفظة'}
//                     </td>
//                     <td className="px-3 py-2 font-semibold text-emerald-700">
//                       {formatCurrency(s.total)}
//                     </td>
//                     <td className="px-3 py-2">
//                       <ActionButtons invoice={s} />
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr><td colSpan="8" className="py-6 text-center text-gray-500">لا توجد نتائج</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* الملخص */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <Summary title="إجمالي المبيعات" value={formatCurrency(totals.totalValue)} color="text-emerald-600" />
//           <Summary title="عدد الفواتير" value={totals.count.toLocaleString('ar-SA')} color="text-sky-600" />
//           <Summary title="متوسط الفاتورة" value={formatCurrency(totals.avg.toFixed(2))} color="text-amber-600" />
//         </div>
//       </div>

//       {viewInvoice && (
//         <Modal title={`تفاصيل الفاتورة — ${viewInvoice.id}`} onClose={() => setViewInvoice(null)}>
//           <div className="space-y-2 text-sm">
//             <p><strong>العميل:</strong> {viewInvoice.customer}</p>
//             <p><strong>الكاشير:</strong> {viewInvoice.cashier}</p>
//             <table className="w-full mt-2 text-xs border">
//               <thead className="bg-gray-50">
//                 <tr><th>#</th><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
//               </thead>
//               <tbody>
//                 {viewInvoice.items.map((it, i) => (
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
//               الإجمالي النهائي: {formatCurrency(invoiceTotal(viewInvoice))}
//             </div>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }

// function Summary({ title, value, color }) {
//   return (
//     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
//       <p className="text-xs text-gray-500">{title}</p>
//       <p className={`mt-1 text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
//     </div>
//   )
// }












// // pages/sales.js
// import { useEffect, useMemo, useRef, useState } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import toast from 'react-hot-toast'
// import theme from '../theme'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from 'recharts'

// export default function Sales() {
//   const [user] = useState({ name: 'أحمد', role: 'admin' })
//   const [sales, setSales] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [cashier, setCashier] = useState('all')
//   const [payment, setPayment] = useState('all')
//   const [dateFrom, setDateFrom] = useState('')
//   const [dateTo, setDateTo] = useState('')
//   const [viewInvoice, setViewInvoice] = useState(null)
//   const printRef = useRef(null)

//   const API_URL = 'http://localhost:5000/api/sales'

//   // 🧾 تحميل بيانات المبيعات من الباك إند
//   useEffect(() => {
//     const fetchSales = async () => {
//       try {
//         setLoading(true)
//         const res = await fetch(API_URL)
//         const data = await res.json()
//         if (!res.ok) throw new Error(data.message || 'خطأ في تحميل البيانات')
//         // تحويل البنية القادمة من الباك إند لتناسب الواجهة
//         const formatted = data.map((s) => ({
//           id: s.invoice_code,
//           date: s.date,
//           customer: s.customer,
//           cashier: s.cashier_name || 'غير محدد',
//           payment: s.payment,
//           discount: s.discount,
//           tax: s.tax,
//           total: s.total,
//         }))
//         setSales(formatted)
//       } catch (err) {
//         console.error(err)
//         toast.error('❌ فشل الاتصال بالسيرفر')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchSales()
//   }, [])

//   // 🧮 دوال مساعدة
//   const formatCurrency = (v) => `${Number(v).toLocaleString('ar-SA')} ر.س`
//   const invoiceTotal = (inv) => inv.total || 0

//   // 🧠 التحليل الذكي
//   const smartInsight = useMemo(() => {
//     if (!sales.length) return ''
//     const today = new Date().toISOString().slice(0, 10)
//     const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

//     const totalByDate = (d) =>
//       sales
//         .filter((s) => s.date.slice(0, 10) === d)
//         .reduce((sum, s) => sum + invoiceTotal(s), 0)

//     const tToday = totalByDate(today)
//     const tYesterday = totalByDate(yesterday)
//     const diff = tYesterday ? (((tToday - tYesterday) / tYesterday) * 100).toFixed(1) : 0

//     const topCashier = Object.entries(
//       sales.reduce((acc, s) => {
//         acc[s.cashier] = (acc[s.cashier] || 0) + invoiceTotal(s)
//         return acc
//       }, {})
//     )
//       .sort((a, b) => b[1] - a[1])[0]?.[0]

//     return `📊 أداء اليوم: ${formatCurrency(tToday)} — ${
//       tYesterday ? `مقابل أمس ${formatCurrency(tYesterday)} (${diff}%)` : 'لا توجد بيانات لأمس'
//     }. 🏆 أفضل كاشير: ${topCashier || '—'}.`
//   }, [sales])

//   // 🗂️ الفلاتر
//   const filtered = useMemo(() => {
//     return sales.filter((s) => {
//       const q = search.trim().toLowerCase()
//       const passSearch =
//         !q ||
//         s.id.toLowerCase().includes(q) ||
//         s.customer.toLowerCase().includes(q)
//       const passCashier = cashier === 'all' || s.cashier === cashier
//       const passPayment = payment === 'all' || s.payment === payment
//       const passDateFrom = !dateFrom || s.date.slice(0, 10) >= dateFrom
//       const passDateTo = !dateTo || s.date.slice(0, 10) <= dateTo
//       return passSearch && passCashier && passPayment && passDateFrom && passDateTo
//     })
//   }, [sales, search, cashier, payment, dateFrom, dateTo])

//   // 🔢 ملخص
//   const totals = useMemo(() => {
//     const totalValue = filtered.reduce((sum, s) => sum + invoiceTotal(s), 0)
//     const count = filtered.length
//     const avg = count ? totalValue / count : 0
//     return { totalValue, count, avg }
//   }, [filtered])

//   // 📈 بيانات الرسم
//   const chartData = useMemo(() => {
//     const map = {}
//     filtered.forEach((s) => {
//       const d = s.date.slice(0, 10)
//       map[d] = (map[d] || 0) + invoiceTotal(s)
//     })
//     return Object.entries(map)
//       .sort((a, b) => (a[0] > b[0] ? 1 : -1))
//       .map(([date, total]) => ({ date, total }))
//   }, [filtered])

//   // 👁️ جلب تفاصيل الفاتورة من الباك إند
//   const handleViewInvoice = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}/${id.replace('INV-', '')}`)
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message)
//       setViewInvoice({
//         id: data.invoice_code,
//         date: data.date,
//         customer: data.customer,
//         cashier: data.cashier_name || '—',
//         payment: data.payment,
//         discount: data.discount,
//         tax: data.tax,
//         items: data.items.map((it) => ({
//           name: it.name,
//           qty: it.qty,
//           price: it.price,
//         })),
//       })
//     } catch (err) {
//       toast.error('❌ فشل جلب تفاصيل الفاتورة')
//       console.error(err)
//     }
//   }

//   // 🖨️ الطباعة
//   const handlePrintInvoice = (invoice) => {
//     toast.success('🖨️ جارٍ تجهيز الطباعة...')
//     const html = `
//       <html dir="rtl" lang="ar">
//         <head><meta charset="utf-8" /><title>فاتورة ${invoice.id}</title></head>
//         <body style="font-family: 'Tajawal'; padding: 20px;">
//           <h2 style="color:#0ea5e9;">صيدلية المعلم</h2>
//           <p>فاتورة رقم ${invoice.id} — ${new Date(invoice.date).toLocaleString('ar-EG')}</p>
//           <p>العميل: ${invoice.customer}</p>
//           <p>الكاشير: ${invoice.cashier}</p>
//           <table border="1" width="100%" style="border-collapse:collapse;">
//             <thead><tr><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
//             <tbody>
//               ${invoice.items.map(it => `<tr><td>${it.name}</td><td>${it.qty}</td><td>${it.price}</td><td>${it.qty * it.price}</td></tr>`).join('')}
//             </tbody>
//           </table>
//           <h4>الإجمالي: ${invoiceTotal(invoice)} ر.س</h4>
//           <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),300);}</script>
//         </body>
//       </html>`
//     const w = window.open('', '_blank', 'width=850,height=900')
//     w.document.open()
//     w.document.write(html)
//     w.document.close()
//   }

//   const ActionButtons = ({ invoice }) => (
//     <div className="flex flex-wrap justify-center gap-2">
//       <button
//         onClick={() => handleViewInvoice(invoice.id)}
//         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-sky-200 text-sky-700 hover:bg-sky-50"
//       >
//         👁️ عرض
//       </button>
//       <button
//         onClick={() => handlePrintInvoice(invoice)}
//         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
//       >
//         🖨️ طباعة
//       </button>
//     </div>
//   )

//   if (loading) {
//     return (
//       <Layout user={user} title="المبيعات">
//         <div dir="rtl" className="flex items-center justify-center h-80">
//           <p className="text-gray-600">جارٍ تحميل البيانات...</p>
//         </div>
//       </Layout>
//     )
//   }

//   return (
//     <Layout user={user} title="المبيعات">
//       <div dir="rtl" className="space-y-6">
//         <div className="p-4 text-sm border rounded-lg bg-sky-50/70 border-sky-100 text-sky-800">
//           {smartInsight}
//         </div>

//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <Summary title="إجمالي المبيعات" value={formatCurrency(totals.totalValue)} color="text-emerald-600" />
//           <Summary title="عدد الفواتير" value={totals.count.toLocaleString('ar-SA')} color="text-sky-600" />
//           <Summary title="متوسط الفاتورة" value={formatCurrency(totals.avg.toFixed(2))} color="text-amber-600" />
//         </div>

//         {/* الفلاتر */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
//             <input
//               type="text"
//               placeholder="ابحث برقم الفاتورة / العميل"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//             />
//             <select value={cashier} onChange={(e) => setCashier(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               <option value="all">كل الكاشير</option>
//               {Array.from(new Set(sales.map((s) => s.cashier))).map((c) => (
//                 <option key={c}>{c}</option>
//               ))}
//             </select>
//             <select value={payment} onChange={(e) => setPayment(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               <option value="all">كل طرق الدفع</option>
//               <option value="cash">نقدًا</option>
//               <option value="card">بطاقة</option>
//               <option value="wallet">محفظة</option>
//             </select>
//             <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 text-sm border rounded-md" />
//             <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 text-sm border rounded-md" />
//           </div>
//           <div className="flex flex-wrap gap-2 mt-3">
//             <button
//               onClick={() => {
//                 setSearch('')
//                 setCashier('all')
//                 setPayment('all')
//                 setDateFrom('')
//                 setDateTo('')
//                 toast.success('تم مسح الفلاتر')
//               }}
//               className="px-3 py-1.5 text-sm rounded border border-gray-200 hover:bg-gray-50"
//             >
//               مسح الفلاتر
//             </button>
//           </div>
//         </div>

//         {/* الجدول */}
//         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right min-w-[880px]">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">رقم الفاتورة</th>
//                 <th className="px-3 py-2">التاريخ</th>
//                 <th className="px-3 py-2">العميل</th>
//                 <th className="px-3 py-2">الكاشير</th>
//                 <th className="px-3 py-2">الدفع</th>
//                 <th className="px-3 py-2">الإجمالي</th>
//                 <th className="px-3 py-2">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length ? (
//                 filtered.map((s, i) => (
//                   <tr key={s.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{i + 1}</td>
//                     <td className="px-3 py-2 font-medium text-sky-700">{s.id}</td>
//                     <td className="px-3 py-2">{new Date(s.date).toLocaleString('ar-EG')}</td>
//                     <td className="px-3 py-2">{s.customer}</td>
//                     <td className="px-3 py-2">{s.cashier}</td>
//                     <td className="px-3 py-2">{s.payment === 'cash' ? 'نقدًا' : s.payment === 'card' ? 'بطاقة' : 'محفظة'}</td>
//                     <td className="px-3 py-2 font-semibold text-emerald-700">{formatCurrency(invoiceTotal(s))}</td>
//                     <td className="px-3 py-2"><ActionButtons invoice={s} /></td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr><td colSpan="8" className="py-6 text-center text-gray-500">لا توجد نتائج</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* الرسم البياني */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <h3 className="mb-3 text-lg font-semibold text-gray-700">📈 المبيعات اليومية</h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* ملخص سريع */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <Summary title="إجمالي النتائج المعروضة" value={formatCurrency(totals.totalValue)} color="text-emerald-600" />
//           <Summary title="عدد النتائج المعروضة" value={totals.count.toLocaleString('ar-SA')} color="text-sky-600" />
//           <Summary title="متوسط الفاتورة (للنتائج)" value={formatCurrency(totals.avg.toFixed(2))} color="text-amber-600" />
//         </div>
//       </div>

//       {/* 💬 مودال عرض الفاتورة */}
//       {viewInvoice && (
//         <Modal title={`تفاصيل الفاتورة — ${viewInvoice.id}`} onClose={() => setViewInvoice(null)}>
//           <div ref={printRef} className="space-y-2 text-sm">
//             <div className="grid grid-cols-2 gap-2">
//               <p><strong>العميل:</strong> {viewInvoice.customer}</p>
//               <p><strong>الكاشير:</strong> {viewInvoice.cashier}</p>
//               <p><strong>طريقة الدفع:</strong> {viewInvoice.payment === 'cash' ? 'نقدًا' : viewInvoice.payment === 'card' ? 'بطاقة' : 'محفظة'}</p>
//               <p><strong>التاريخ:</strong> {new Date(viewInvoice.date).toLocaleString('ar-EG')}</p>
//             </div>
//             <table className="w-full mt-2 text-xs border">
//               <thead className="bg-gray-50">
//                 <tr><th>#</th><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
//               </thead>
//               <tbody>
//                 {viewInvoice.items.map((it, i) => (
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
//               الإجمالي النهائي: {formatCurrency(invoiceTotal(viewInvoice))}
//             </div>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }

// function Summary({ title, value, color }) {
//   return (
//     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
//       <p className="text-xs text-gray-500">{title}</p>
//       <p className={`mt-1 text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
//     </div>
//   )
// }





// // pages/sales.js
// import { useEffect, useMemo, useRef, useState } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import toast from 'react-hot-toast'
// import theme from '../theme'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from 'recharts'

// export default function Sales() {
//   // 👤 المستخدم الحالي (للـ Layout فقط)
//   const [user] = useState({ name: 'أحمد', role: 'admin' })

//   // 🧾 حالة البيانات الأساسية
//   const [sales, setSales] = useState([])
//   const [loading, setLoading] = useState(true)

//   // 🔎 فلاتر
//   const [search, setSearch] = useState('')
//   const [cashier, setCashier] = useState('all')
//   const [payment, setPayment] = useState('all')
//   const [dateFrom, setDateFrom] = useState('')
//   const [dateTo, setDateTo] = useState('')

//   // 👁️ عرض تفاصيل الفاتورة
//   const [viewInvoice, setViewInvoice] = useState(null)

//   // 🖨️ مرجع محتوى الطباعة
//   const printRef = useRef(null)

//   // 🧪 تحميل بيانات مبدئية (وهمية)
//   useEffect(() => {
//     setLoading(true)
//     const mock = [
//       {
//         id: 'INV-1001',
//         date: '2025-11-02T09:10:00',
//         customer: 'عميل نقدي',
//         cashier: 'أحمد',
//         payment: 'cash', // cash | card | wallet
//         items: [
//           { name: 'باراسيتامول 500mg', qty: 2, price: 15 },
//           { name: 'فيتامين سي 1000mg', qty: 1, price: 25 },
//         ],
//         discount: 5,
//         tax: 0,
//       },
//       {
//         id: 'INV-1002',
//         date: '2025-11-02T11:35:00',
//         customer: 'سارة',
//         cashier: 'منى',
//         payment: 'card',
//         items: [{ name: 'أموكسيسيلين 250mg', qty: 1, price: 45 }],
//         discount: 0,
//         tax: 0,
//       },
//       {
//         id: 'INV-1003',
//         date: '2025-11-01T17:20:00',
//         customer: 'عميل نقدي',
//         cashier: 'أحمد',
//         payment: 'wallet',
//         items: [
//           { name: 'ايبوبروفين 400mg', qty: 1, price: 30 },
//           { name: 'فيتامين د', qty: 3, price: 18 },
//         ],
//         discount: 0,
//         tax: 0,
//       },
//     ]
//     setTimeout(() => {
//       setSales(mock)
//       setLoading(false)
//     }, 250)
//   }, [])

//   // 🧮 دوال مساعدة
//   const formatCurrency = (v) => `${Number(v).toLocaleString('ar-SA')} ر.س`
//   const invoiceTotal = (inv) => {
//     const sub = inv.items.reduce((s, it) => s + it.qty * it.price, 0)
//     return sub - (inv.discount || 0) + (inv.tax || 0)
//   }

//   // 🧠 التحليل الذكي
//   const smartInsight = useMemo(() => {
//     if (!sales.length) return ''
//     // اجمالي اليوم الحالي مقابل الأمس (كمثال بسيط)
//     const today = new Date().toISOString().slice(0, 10)
//     const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

//     const totalByDate = (d) =>
//       sales
//         .filter((s) => s.date.slice(0, 10) === d)
//         .reduce((sum, s) => sum + invoiceTotal(s), 0)

//     const tToday = totalByDate(today)
//     const tYesterday = totalByDate(yesterday)
//     const diff = tYesterday ? (((tToday - tYesterday) / tYesterday) * 100).toFixed(1) : 0

//     const topCashier = Object.entries(
//       sales.reduce((acc, s) => {
//         acc[s.cashier] = (acc[s.cashier] || 0) + invoiceTotal(s)
//         return acc
//       }, {})
//     )
//       .sort((a, b) => b[1] - a[1])[0]?.[0]

//     return `📊 أداء اليوم: ${formatCurrency(tToday)} — ${
//       tYesterday ? `مقابل أمس ${formatCurrency(tYesterday)} (${diff}%)` : 'لا توجد بيانات لأمس'
//     }. 🏆 أفضل كاشير: ${topCashier || '—'}.`
//   }, [sales])

//   // 🗂️ تطبيق الفلاتر
//   const filtered = useMemo(() => {
//     return sales.filter((s) => {
//       const q = search.trim().toLowerCase()
//       const passSearch =
//         !q ||
//         s.id.toLowerCase().includes(q) ||
//         s.customer.toLowerCase().includes(q) ||
//         s.items.some((it) => it.name.toLowerCase().includes(q))
//       const passCashier = cashier === 'all' || s.cashier === cashier
//       const passPayment = payment === 'all' || s.payment === payment
//       const passDateFrom = !dateFrom || s.date.slice(0, 10) >= dateFrom
//       const passDateTo = !dateTo || s.date.slice(0, 10) <= dateTo
//       return passSearch && passCashier && passPayment && passDateFrom && passDateTo
//     })
//   }, [sales, search, cashier, payment, dateFrom, dateTo])

//   // 🔢 إحصاءات سريعة
//   const totals = useMemo(() => {
//     const totalValue = filtered.reduce((sum, s) => sum + invoiceTotal(s), 0)
//     const count = filtered.length
//     const avg = count ? totalValue / count : 0
//     return { totalValue, count, avg }
//   }, [filtered])

//   // 📈 تجهيز بيانات الرسم
//   const chartData = useMemo(() => {
//     // تجميع حسب اليوم (YYYY-MM-DD)
//     const map = {}
//     filtered.forEach((s) => {
//       const d = s.date.slice(0, 10)
//       map[d] = (map[d] || 0) + invoiceTotal(s)
//     })
//     return Object.entries(map)
//       .sort((a, b) => (a[0] > b[0] ? 1 : -1))
//       .map(([date, total]) => ({ date, total }))
//   }, [filtered])

//   // 🖨️ طباعة الفاتورة (مودال أو نافذة مستقلة)
//   const handlePrintInvoice = (invoice) => {
//     toast.success('🖨️ جارٍ تجهيز الطباعة...')
//     const html = `
//       <html dir="rtl" lang="ar">
//         <head>
//           <meta charset="utf-8" />
//           <title>فاتورة ${invoice.id}</title>
//           <style>
//             * { box-sizing: border-box; }
//             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
//             .header { display: flex; align-items:center; gap: 12px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 12px; }
//             .logo { width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; font-size: 22px; color:#fff; border-radius:10px; background: ${theme.colors.primary}; }
//             .title h1 { margin: 0; font-size: 18px; color: #111827; }
//             .title p { margin: 0; font-size: 12px; color: #6b7280; }
//             h2 { font-size: 16px; color: #0ea5e9; margin: 14px 0 8px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 13px; }
//             th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: center; }
//             th { background: #f9fafb; }
//             .totals { margin-top: 10px; text-align: left; }
//             .totals .line { display:flex; justify-content:space-between; margin: 4px 0; }
//             .footer { margin-top: 16px; text-align: center; color: #6b7280; font-size: 12px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <div class="logo">💊</div>
//             <div class="title">
//               <h1>صيدلية المعلم — Pharmacy Al-Muallem</h1>
//               <p>فاتورة رقم ${invoice.id} • ${new Date(invoice.date).toLocaleString('ar-EG')}</p>
//             </div>
//           </div>

//           <h2>تفاصيل العميل</h2>
//           <div style="display:grid; grid-template-columns: repeat(2,1fr); gap:8px; font-size:13px;">
//             <div><strong>العميل:</strong> ${invoice.customer}</div>
//             <div><strong>الكاشير:</strong> ${invoice.cashier}</div>
//             <div><strong>طريقة الدفع:</strong> ${invoice.payment === 'cash' ? 'نقدًا' : invoice.payment === 'card' ? 'بطاقة' : 'محفظة'}</div>
//             <div><strong>التاريخ:</strong> ${new Date(invoice.date).toLocaleString('ar-EG')}</div>
//           </div>

//           <h2>الأصناف</h2>
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
//               ${invoice.items
//                 .map(
//                   (it, i) => `
//                 <tr>
//                   <td>${i + 1}</td>
//                   <td>${it.name}</td>
//                   <td>${it.qty}</td>
//                   <td>${Number(it.price).toLocaleString('ar-SA')} ر.س</td>
//                   <td>${Number(it.qty * it.price).toLocaleString('ar-SA')} ر.س</td>
//                 </tr>`
//                 )
//                 .join('')}
//             </tbody>
//           </table>

//           <div class="totals">
//             <div class="line"><strong>الإجمالي الفرعي:</strong><span>
//               ${invoice.items
//                 .reduce((s, it) => s + it.qty * it.price, 0)
//                 .toLocaleString('ar-SA')} ر.س</span></div>
//             <div class="line"><strong>الخصم:</strong><span>${(invoice.discount || 0).toLocaleString(
//               'ar-SA'
//             )} ر.س</span></div>
//             <div class="line"><strong>الضريبة:</strong><span>${(invoice.tax || 0).toLocaleString(
//               'ar-SA'
//             )} ر.س</span></div>
//             <div class="line" style="font-size:15px;"><strong>الإجمالي النهائي:</strong><span>
//               ${invoiceTotal(invoice).toLocaleString('ar-SA')} ر.س</span></div>
//           </div>

//           <div class="footer">شكرًا لتسوقكم من صيدلية المعلم 💙</div>
//           <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };</script>
//         </body>
//       </html>
//     `
//     const w = window.open('', '_blank', 'width=850,height=900')
//     w.document.open()
//     w.document.write(html)
//     w.document.close()
//   }

//   // 🧾 أزرار الإجراءات (عرض/طباعة)
//   const ActionButtons = ({ invoice }) => (
//     <div className="flex flex-wrap justify-center gap-2">
//       <button
//         onClick={() => setViewInvoice(invoice)}
//         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-sky-200 text-sky-700 hover:bg-sky-50"
//       >
//         👁️ عرض
//       </button>
//       <button
//         onClick={() => handlePrintInvoice(invoice)}
//         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
//       >
//         🖨️ طباعة
//       </button>
//     </div>
//   )

//   if (loading) {
//     return (
//       <Layout user={user} title="المبيعات">
//         <div dir="rtl" className="flex items-center justify-center h-80">
//           <p className="text-gray-600">جارٍ تحميل البيانات...</p>
//         </div>
//       </Layout>
//     )
//   }

//   return (
//     <Layout user={user} title="المبيعات">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔹 التحليل الذكي */}
//         <div className="p-4 text-sm border rounded-lg bg-sky-50/70 border-sky-100 text-sky-800">
//           {smartInsight}
//         </div>

//         {/* 🧾 بطاقات ملخص */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <Summary title="إجمالي المبيعات" value={formatCurrency(totals.totalValue)} color="text-emerald-600" />
//           <Summary title="عدد الفواتير" value={totals.count.toLocaleString('ar-SA')} color="text-sky-600" />
//           <Summary title="متوسط الفاتورة" value={formatCurrency(totals.avg.toFixed(2))} color="text-amber-600" />
//         </div>

//         {/* 🔎 فلاتر متقدمة */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
//             <input
//               type="text"
//               placeholder="ابحث برقم الفاتورة / العميل / اسم الصنف"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//             />
//             <select
//               value={cashier}
//               onChange={(e) => setCashier(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل الكاشير</option>
//               {Array.from(new Set(sales.map((s) => s.cashier))).map((c) => (
//                 <option key={c} value={c}>{c}</option>
//               ))}
//             </select>
//             <select
//               value={payment}
//               onChange={(e) => setPayment(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل طرق الدفع</option>
//               <option value="cash">نقدًا</option>
//               <option value="card">بطاقة</option>
//               <option value="wallet">محفظة</option>
//             </select>
//             <input
//               type="date"
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md"
//             />
//             <input
//               type="date"
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md"
//             />
//           </div>
//           <div className="flex flex-wrap gap-2 mt-3">
//             <button
//               onClick={() => {
//                 setSearch('')
//                 setCashier('all')
//                 setPayment('all')
//                 setDateFrom('')
//                 setDateTo('')
//                 toast.success('تم مسح الفلاتر')
//               }}
//               className="px-3 py-1.5 text-sm rounded border border-gray-200 hover:bg-gray-50"
//             >
//               مسح الفلاتر
//             </button>
//           </div>
//         </div>

//         {/* 🧾 جدول المبيعات */}
//         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right min-w-[880px]">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">رقم الفاتورة</th>
//                 <th className="px-3 py-2">التاريخ</th>
//                 <th className="px-3 py-2">العميل</th>
//                 <th className="px-3 py-2">الكاشير</th>
//                 <th className="px-3 py-2">الدفع</th>
//                 <th className="px-3 py-2">الإجمالي</th>
//                 <th className="px-3 py-2">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length ? (
//                 filtered.map((s, idx) => (
//                   <tr key={s.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{idx + 1}</td>
//                     <td className="px-3 py-2 font-medium text-sky-700">{s.id}</td>
//                     <td className="px-3 py-2">
//                       {new Date(s.date).toLocaleString('ar-EG')}
//                     </td>
//                     <td className="px-3 py-2">{s.customer}</td>
//                     <td className="px-3 py-2">{s.cashier}</td>
//                     <td className="px-3 py-2">
//                       {s.payment === 'cash' ? 'نقدًا' : s.payment === 'card' ? 'بطاقة' : 'محفظة'}
//                     </td>
//                     <td className="px-3 py-2 font-semibold text-emerald-700">
//                       {formatCurrency(invoiceTotal(s))}
//                     </td>
//                     <td className="px-3 py-2">
//                       <ActionButtons invoice={s} />
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="px-3 py-6 text-center text-gray-500" colSpan="8">
//                     لا توجد نتائج مطابقة للفلاتر الحالية
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
        
//         {/* 📈 الرسم البياني اليومي */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات اليومية</h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

        

//         {/* 🧮 ملخص سريع أسفل الصفحة */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <Summary title="إجمالي النتائج المعروضة" value={formatCurrency(totals.totalValue)} color="text-emerald-600" />
//           <Summary title="عدد النتائج المعروضة" value={totals.count.toLocaleString('ar-SA')} color="text-sky-600" />
//           <Summary title="متوسط الفاتورة (للنتائج)" value={formatCurrency(totals.avg.toFixed(2))} color="text-amber-600" />
//         </div>
//       </div>

//       {/* 💬 مودال عرض الفاتورة */}
//       {viewInvoice && (
//         <Modal title={`تفاصيل الفاتورة — ${viewInvoice.id}`} onClose={() => setViewInvoice(null)}>
//           <div ref={printRef} className="space-y-2 text-sm">
//             <div className="flex items-center gap-2 pb-2 mb-2 border-b">
//               <div
//                 className="flex items-center justify-center text-white rounded-md w-9 h-9"
//                 style={{ background: theme.colors.primary }}
//               >
//                 💊
//               </div>
//               <div>
//                 <p className="text-base font-semibold text-gray-800">صيدلية المعلم — Pharmacy Al-Muallem</p>
//                 <p className="text-xs text-gray-500">
//                   فاتورة رقم {viewInvoice.id} • {new Date(viewInvoice.date).toLocaleString('ar-EG')}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-2">
//               <p><strong>العميل:</strong> {viewInvoice.customer}</p>
//               <p><strong>الكاشير:</strong> {viewInvoice.cashier}</p>
//               <p><strong>طريقة الدفع:</strong> {viewInvoice.payment === 'cash' ? 'نقدًا' : viewInvoice.payment === 'card' ? 'بطاقة' : 'محفظة'}</p>
//               <p><strong>التاريخ:</strong> {new Date(viewInvoice.date).toLocaleString('ar-EG')}</p>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full mt-2 text-xs border">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-2 py-1 border">#</th>
//                     <th className="px-2 py-1 border">الصنف</th>
//                     <th className="px-2 py-1 border">الكمية</th>
//                     <th className="px-2 py-1 border">السعر</th>
//                     <th className="px-2 py-1 border">الإجمالي</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {viewInvoice.items.map((it, i) => (
//                     <tr key={i}>
//                       <td className="px-2 py-1 text-center border">{i + 1}</td>
//                       <td className="px-2 py-1 border">{it.name}</td>
//                       <td className="px-2 py-1 text-center border">{it.qty}</td>
//                       <td className="px-2 py-1 text-center border">{Number(it.price).toLocaleString('ar-SA')} ر.س</td>
//                       <td className="px-2 py-1 text-center border">{Number(it.qty * it.price).toLocaleString('ar-SA')} ر.س</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex justify-end gap-6 pt-2 text-sm">
//               <div><strong>الخصم:</strong> {(viewInvoice.discount || 0).toLocaleString('ar-SA')} ر.س</div>
//               <div><strong>الضريبة:</strong> {(viewInvoice.tax || 0).toLocaleString('ar-SA')} ر.س</div>
//               <div className="font-semibold text-emerald-700">
//                 <strong>الإجمالي النهائي:</strong> {invoiceTotal(viewInvoice).toLocaleString('ar-SA')} ر.س
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3 mt-4">
//             <button
//               onClick={() => handlePrintInvoice(viewInvoice)}
//               className="w-full py-2 text-white rounded-md bg-emerald-600 hover:bg-emerald-700"
//             >
//               🖨️ طباعة
//             </button>
//             <button
//               onClick={() => {
//                 setViewInvoice(null)
//                 toast.success('تم إغلاق التفاصيل')
//               }}
//               className="w-full py-2 bg-gray-100 rounded-md hover:bg-gray-200"
//             >
//               إغلاق
//             </button>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }

// /* ===================== مكوّنات مساعدة ===================== */

// function Summary({ title, value, color }) {
//   return (
//     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
//       <p className="text-xs text-gray-500">{title}</p>
//       <p className={`mt-1 text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
//     </div>
//   )
// }
















// import { useState, useMemo } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function SalesPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })

//   // 🧾 بيانات افتراضية للمبيعات
//   const initialSales = [
//     {
//       id: 'INV-001',
//       date: '2025-11-02',
//       cashier: 'أحمد',
//       total: 150,
//       discount: 10,
//       payment: 'نقدي',
//       items: [
//         { name: 'باراسيتامول 500mg', qty: 2, price: 15 },
//         { name: 'فيتامين سي 1000mg', qty: 3, price: 25 },
//       ],
//     },
//     {
//       id: 'INV-002',
//       date: '2025-11-03',
//       cashier: 'محمد',
//       total: 300,
//       discount: 0,
//       payment: 'بطاقة',
//       items: [
//         { name: 'أموكسيسيلين 250mg', qty: 4, price: 45 },
//         { name: 'ايبوبروفين 400mg', qty: 2, price: 30 },
//       ],
//     },
//   ]

//   const [sales, setSales] = useState(initialSales)
//   const [search, setSearch] = useState('')
//   const [paymentFilter, setPaymentFilter] = useState('الكل')
//   const [cashierFilter, setCashierFilter] = useState('الكل')
//   const [dateFilter, setDateFilter] = useState('')
//   const [viewSale, setViewSale] = useState(null)

//   const paymentTypes = ['الكل', 'نقدي', 'بطاقة', 'تحويل']
//   const cashiers = ['الكل', 'أحمد', 'محمد']

//   // 🔎 تصفية المبيعات
//   const filteredSales = useMemo(() => {
//     return sales.filter((s) => {
//       const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase())
//       const matchesPayment = paymentFilter === 'الكل' || s.payment === paymentFilter
//       const matchesCashier = cashierFilter === 'الكل' || s.cashier === cashierFilter
//       const matchesDate = !dateFilter || s.date === dateFilter
//       return matchesSearch && matchesPayment && matchesCashier && matchesDate
//     })
//   }, [sales, search, paymentFilter, cashierFilter, dateFilter])

//   // 📊 إحصائيات
//   const totalSales = filteredSales.reduce((sum, s) => sum + s.total, 0)
//   const invoiceCount = filteredSales.length

//   // 🖨️ طباعة التقرير
//   const printReport = () => {
//     const w = window.open('', '', 'width=900,height=600')
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//       <head>
//         <title>تقرير المبيعات</title>
//         <style>
//           body { font-family: 'Tajawal', sans-serif; padding: 20px; }
//           h1 { text-align: center; color: #0ea5e9; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th, td { border: 1px solid #ccc; padding: 8px; text-align: center; font-size: 13px; }
//           th { background: #f3f4f6; }
//         </style>
//       </head>
//       <body>
//         <h1>📊 تقرير المبيعات</h1>
//         <table>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>رقم الفاتورة</th>
//               <th>التاريخ</th>
//               <th>الكاشير</th>
//               <th>طريقة الدفع</th>
//               <th>الإجمالي</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${filteredSales.map((s, i) => `
//               <tr>
//                 <td>${i + 1}</td>
//                 <td>${s.id}</td>
//                 <td>${s.date}</td>
//                 <td>${s.cashier}</td>
//                 <td>${s.payment}</td>
//                 <td>${s.total.toFixed(2)} ر.س</td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </body></html>
//     `)
//     w.document.close()
//     w.print()
//   }

//   return (
//     <Layout user={user} title="إدارة المبيعات">
//       <div dir="rtl" className="space-y-6">
//         {/* 🧮 بطاقات الملخص */}
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//           <SummaryCard title="إجمالي المبيعات" value={`${totalSales.toFixed(2)} ر.س`} color="text-green-600" />
//           <SummaryCard title="عدد الفواتير" value={invoiceCount} color="text-blue-600" />
//           <SummaryCard title="عدد المستخدمين" value={cashiers.length - 1} color="text-amber-600" />
//         </div>

//         {/* 🔍 أدوات الفلترة */}
//         <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border rounded-lg shadow-sm">
//           <div className="flex flex-wrap items-center gap-2">
//             <input
//               type="text"
//               placeholder="🔍 بحث برقم الفاتورة..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//             />
//             <input
//               type="date"
//               value={dateFilter}
//               onChange={(e) => setDateFilter(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//             <select value={cashierFilter} onChange={(e) => setCashierFilter(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               {cashiers.map((c) => <option key={c}>{c}</option>)}
//             </select>
//             <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               {paymentTypes.map((p) => <option key={p}>{p}</option>)}
//             </select>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={printReport} className="px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50">
//               🖨️ طباعة التقرير
//             </button>
//             <button onClick={() => toast.success('📤 تم تصدير التقرير (Excel قادم لاحقاً)')} className="px-4 py-2 text-sm text-white rounded-md shadow" style={{ background: theme.colors.primary }}>
//               📤 تصدير
//             </button>
//           </div>
//         </div>

//         {/* 📋 جدول المبيعات */}
//         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2 text-center">#</th>
//                 <th className="px-3 py-2">رقم الفاتورة</th>
//                 <th className="px-3 py-2">التاريخ</th>
//                 <th className="px-3 py-2">الكاشير</th>
//                 <th className="px-3 py-2">طريقة الدفع</th>
//                 <th className="px-3 py-2">الإجمالي</th>
//                 <th className="px-3 py-2 text-center">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSales.map((s, i) => (
//                 <tr key={s.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
//                   <td className="px-3 py-2">{s.id}</td>
//                   <td className="px-3 py-2">{s.date}</td>
//                   <td className="px-3 py-2">{s.cashier}</td>
//                   <td className="px-3 py-2">{s.payment}</td>
//                   <td className="px-3 py-2 font-semibold text-green-700">{s.total.toFixed(2)} ر.س</td>
//                   <td className="px-3 py-2 text-center">
//                     <button onClick={() => setViewSale(s)} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">👁️ عرض</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* 🧾 نافذة عرض الفاتورة */}
//       {viewSale && (
//         <Modal title={`🧾 تفاصيل الفاتورة ${viewSale.id}`} onClose={() => setViewSale(null)}>
//           <div className="space-y-3 text-sm">
//             <p><strong>التاريخ:</strong> {viewSale.date}</p>
//             <p><strong>الكاشير:</strong> {viewSale.cashier}</p>
//             <p><strong>طريقة الدفع:</strong> {viewSale.payment}</p>

//             <table className="w-full mt-3 text-sm text-right border border-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-1">المنتج</th>
//                   <th className="px-3 py-1">الكمية</th>
//                   <th className="px-3 py-1">السعر</th>
//                   <th className="px-3 py-1">الإجمالي</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {viewSale.items.map((i, idx) => (
//                   <tr key={idx} className="border-t">
//                     <td className="px-3 py-1">{i.name}</td>
//                     <td className="px-3 py-1">{i.qty}</td>
//                     <td className="px-3 py-1">{i.price} ر.س</td>
//                     <td className="px-3 py-1">{(i.qty * i.price).toFixed(2)} ر.س</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="pt-3 mt-2 text-sm text-gray-700 border-t">
//               <p>الخصم: <span className="text-red-600">{viewSale.discount} ر.س</span></p>
//               <p className="font-semibold text-sky-700">الإجمالي النهائي: {(viewSale.total - viewSale.discount).toFixed(2)} ر.س</p>
//             </div>

//             <div className="flex justify-end mt-4">
//               <button onClick={() => window.print()} className="px-4 py-2 text-sm text-white rounded-md" style={{ background: theme.colors.success }}>
//                 🖨️ طباعة الفاتورة
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }

// // 🔹 بطاقة الملخص
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center transition bg-white border rounded-lg shadow-sm hover:shadow-md">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
//     </div>
//   )
// }
