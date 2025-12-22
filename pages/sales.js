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
  const { products: invProducts } = useInventory();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ منتجات من جدول products (من الباك-إند)
  const [dbProducts, setDbProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

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

  // ✅ مصدر المنتجات النهائي: من DB أولًا، وإذا فاضي استخدم InventoryContext كاحتياط
  const products = useMemo(() => {
    const fromDb = Array.isArray(dbProducts) ? dbProducts : [];
    if (fromDb.length) return fromDb;
    const fromInv = Array.isArray(invProducts) ? invProducts : [];
    return fromInv;
  }, [dbProducts, invProducts]);

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

  // تحميل المبيعات + ✅ تحميل المنتجات من جدول products
  useEffect(() => {
    loadSales();
    loadProducts();
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

  // ✅ تحميل المنتجات من الباك-إند
  const loadProducts = async () => {
    try {
      setProductsLoading(true);

      // ✅ غيّر المسار هنا لو API عندك مختلف
      const res = await api.get("/products");

      const list = res.data || [];
      if (!Array.isArray(list)) {
        setDbProducts([]);
        return;
      }

      // تنظيف بسيط + ترتيب
      const cleaned = list
        .filter((p) => p && p.id != null)
        .map((p) => ({
          ...p,
          id: Number(p.id),
          price: p.price != null ? Number(p.price) : 0,
        }))
        .sort((a, b) => (a.name || "").localeCompare(b.name || "ar"));

      setDbProducts(cleaned);
    } catch (err) {
      console.error("loadProducts error:", err);
      // ما نوقف الشغل—نخلي fallback على invProducts
      toast.error("تعذر تحميل المنتجات من قاعدة البيانات");
      setDbProducts([]);
    } finally {
      setProductsLoading(false);
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

      const matchType = typeFilter === "all" || s.sale_type === typeFilter;

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

    const product = (products || []).find((p) => p.id === Number(lineProductId));
    if (!product) {
      toast.error("المنتج غير موجود");
      return;
    }

    const qty = Number(lineQty || 0);
    if (!qty || qty <= 0) {
      toast.error("الكمية غير صحيحة");
      return;
    }

    const price = linePrice !== "" ? Number(linePrice) : Number(product.price || 0);

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
                    <td className="p-3 text-slate-700">{s.customer || "-"}</td>
                    <td className="p-3 text-slate-700">{s.cashier || "-"}</td>
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

                        const prod = (products || []).find(
                          (p) => p.id === Number(v)
                        );
                        if (prod) setLinePrice(prod.price || "");
                      }}
                    >
                      <option value="">
                        {productsLoading
                          ? "جاري تحميل المنتجات…"
                          : "اختر منتجًا…"}
                      </option>

                      {(products || []).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>

                    {/* ملاحظة صغيرة لو فاضي */}
                    {!productsLoading && !(products || []).length && (
                      <p className="mt-1 text-xs text-amber-600">
                        ⚠️ لا توجد منتجات محمّلة. تأكد أن API /products يعمل ويرجع بيانات.
                      </p>
                    )}
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
                            <td className="p-2">{formatCurrency(it.price)}</td>
                            <td className="p-2">
                              {formatCurrency(
                                Number(it.qty || 0) * Number(it.price || 0)
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
                  ? new Date(selectedSale.created_at).toLocaleString("ar-EG")
                  : "-"}
              </p>

              <hr className="my-2" />

              <p className="text-xs font-semibold text-slate-600">العناصر:</p>

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
// import { useRouter } from "next/router";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import toast from "react-hot-toast";
// import api from "../utils/api";
// import { useAuth } from "../context/AuthContext";
// import { useInventory } from "../context/InventoryContext";

// function formatCurrency(v) {
//   return `${Number(v || 0).toLocaleString("ar-SA", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })} ر.س`;
// }

// export default function SalesPage() {
//   const router = useRouter();
//   const { user, hasPermission } = useAuth();
//   const { products } = useInventory();

//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // فلاتر
//   const [search, setSearch] = useState("");
//   const [cashierFilter, setCashierFilter] = useState("all");
//   const [paymentFilter, setPaymentFilter] = useState("all");
//   const [typeFilter, setTypeFilter] = useState("all");

//   // مودالات
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   const [selectedSale, setSelectedSale] = useState(null);
//   const [selectedSaleItems, setSelectedSaleItems] = useState([]);
//   const [detailsLoading, setDetailsLoading] = useState(false);

//   // نموذج إضافة فاتورة
//   const [saleForm, setSaleForm] = useState({
//     customer: "",
//     cashier: "",
//     paymentMethod: "cash",
//     saleType: "sale",
//     discount: 0,
//     tax: 0,
//     items: [],
//   });

//   // نموذج سطر منتج في الفاتورة
//   const [lineProductId, setLineProductId] = useState("");
//   const [lineQty, setLineQty] = useState(1);
//   const [linePrice, setLinePrice] = useState("");

//   // حماية الصلاحيات
//   if (!hasPermission(["admin", "pharmacist", "cashier"])) {
//     return (
//       <Layout>
//         <div
//           dir="rtl"
//           className="flex items-center justify-center min-h-[60vh] bg-slate-50"
//         >
//           <div className="px-6 py-4 text-sm font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
//             ⚠️ لا يمكنك دخول هذه الصفحة. الرجاء التواصل مع مدير النظام لتحديث صلاحياتك.
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   // تحميل المبيعات
//   useEffect(() => {
//     loadSales();
//   }, []);

//   const loadSales = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/sales");
//       setSales(res.data || []);
//     } catch (err) {
//       console.error("loadSales error:", err);
//       toast.error("خطأ في تحميل المبيعات");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // خيارات الكاشير حسب البيانات الموجودة
//   const cashierOptions = useMemo(() => {
//     const set = new Set();
//     (sales || []).forEach((s) => {
//       if (s.cashier) set.add(s.cashier);
//     });
//     return Array.from(set);
//   }, [sales]);

//   // إحصائيات سريعة
//   const stats = useMemo(() => {
//     const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

//     let totalToday = 0;
//     let countToday = 0;
//     let totalAll = 0;

//     (sales || []).forEach((s) => {
//       const dateStr = (s.created_at || "").slice(0, 10);
//       const val = Number(s.total || 0);

//       totalAll += val;
//       if (dateStr === today && s.sale_type === "sale") {
//         totalToday += val;
//         countToday += 1;
//       }
//     });

//     return {
//       totalToday,
//       countToday,
//       totalAll,
//     };
//   }, [sales]);

//   // فلترة المبيعات
//   const filteredSales = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return (sales || []).filter((s) => {
//       const matchSearch =
//         !q ||
//         s.id?.toString().includes(q) ||
//         (s.customer || "").toLowerCase().includes(q);

//       const matchCashier =
//         cashierFilter === "all" || s.cashier === cashierFilter;

//       const matchPayment =
//         paymentFilter === "all" || s.payment_method === paymentFilter;

//       const matchType =
//         typeFilter === "all" || s.sale_type === typeFilter;

//       return matchSearch && matchCashier && matchPayment && matchType;
//     });
//   }, [sales, search, cashierFilter, paymentFilter, typeFilter]);

//   // حساب الإجماليات في النموذج
//   const saleTotals = useMemo(() => {
//     const subtotal = (saleForm.items || []).reduce(
//       (sum, it) => sum + Number(it.qty || 0) * Number(it.price || 0),
//       0
//     );
//     const discount = Number(saleForm.discount || 0);
//     const tax = Number(saleForm.tax || 0);
//     const total = subtotal - discount + tax;
//     return { subtotal, discount, tax, total };
//   }, [saleForm]);

//   // إضافة سطر منتج إلى الفاتورة
//   const handleAddLine = () => {
//     if (!lineProductId) {
//       toast.error("اختر منتجًا أولًا");
//       return;
//     }
//     const product = products.find((p) => p.id === Number(lineProductId));
//     if (!product) {
//       toast.error("المنتج غير موجود");
//       return;
//     }
//     const qty = Number(lineQty || 0);
//     if (!qty || qty <= 0) {
//       toast.error("الكمية غير صحيحة");
//       return;
//     }

//     const price =
//       linePrice !== "" ? Number(linePrice) : Number(product.price || 0);

//     if (!price || price <= 0) {
//       toast.error("سعر البيع غير صحيح");
//       return;
//     }

//     const newItem = {
//       productId: product.id,
//       productName: product.name,
//       qty,
//       price,
//     };

//     setSaleForm((prev) => ({
//       ...prev,
//       items: [...(prev.items || []), newItem],
//     }));

//     setLineProductId("");
//     setLineQty(1);
//     setLinePrice("");
//   };

//   const handleRemoveLine = (idx) => {
//     setSaleForm((prev) => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== idx),
//     }));
//   };

//   // حفظ الفاتورة
//   const handleSaveSale = async () => {
//     if (!(saleForm.items || []).length) {
//       toast.error("أضف منتجًا واحدًا على الأقل للفاتورة");
//       return;
//     }

//     try {
//       const payload = {
//         customer: saleForm.customer || null,
//         cashier: saleForm.cashier || user?.name || null,
//         paymentMethod: saleForm.paymentMethod,
//         saleType: saleForm.saleType,
//         discount: Number(saleForm.discount || 0),
//         tax: Number(saleForm.tax || 0),
//         items: saleForm.items.map((it) => ({
//           productId: it.productId,
//           qty: Number(it.qty || 0),
//           price: Number(it.price || 0),
//         })),
//       };

//       const res = await api.post("/sales", payload);
//       toast.success("تم حفظ الفاتورة بنجاح");

//       // أضفها لقائمة المبيعات
//       setSales((prev) => [res.data, ...prev]);

//       // إعادة تعيين النموذج
//       setSaleForm({
//         customer: "",
//         cashier: "",
//         paymentMethod: "cash",
//         saleType: "sale",
//         discount: 0,
//         tax: 0,
//         items: [],
//       });
//       setShowAddModal(false);
//     } catch (err) {
//       console.error("save sale error:", err);
//       toast.error("فشل حفظ الفاتورة");
//     }
//   };

//   // حذف فاتورة
//   const handleDeleteSale = async (id) => {
//     if (!confirm("هل تريد حذف هذه الفاتورة؟")) return;
//     try {
//       await api.delete(`/sales/${id}`);
//       setSales((prev) => prev.filter((s) => s.id !== id));
//       toast.success("تم حذف الفاتورة");
//     } catch (err) {
//       console.error("delete sale error:", err);
//       toast.error("خطأ في حذف الفاتورة");
//     }
//   };

//   // فتح تفاصيل الفاتورة
//   const openSaleDetails = async (sale) => {
//     setSelectedSale(sale);
//     setShowDetailsModal(true);
//     setSelectedSaleItems([]);
//     setDetailsLoading(true);
//     try {
//       const res = await api.get(`/sales/${sale.id}`);
//       setSelectedSaleItems(res.data.items || []);
//     } catch (err) {
//       console.error("load sale details error:", err);
//       toast.error("خطأ في تحميل تفاصيل الفاتورة");
//     } finally {
//       setDetailsLoading(false);
//     }
//   };

//   return (
//     <Layout user={user} title="إدارة المبيعات">
//       <div dir="rtl" className="space-y-6">
//         {/* رأس الصفحة */}
//         <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
//           <div className="space-y-1">
//             <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
//               🧾 إدارة المبيعات
//             </h1>
//             <p className="text-sm text-slate-500">
//               متابعة فواتير البيع والمرتجعات، وحركة الكاشير، وقيمة المبيعات اليومية.
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm bg-emerald-600 hover:bg-emerald-700"
//             >
//               <span>➕</span>
//               <span>فاتورة جديدة</span>
//             </button>

//             <button
//               onClick={loadSales}
//               className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg shadow-sm text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100"
//             >
//               🔄 تحديث
//             </button>
//           </div>
//         </div>

//         {/* كروت إحصائيات */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//           <StatCard
//             label="إجمالي مبيعات اليوم"
//             value={formatCurrency(stats.totalToday)}
//             icon="📅"
//             color="bg-emerald-50 text-emerald-700 border-emerald-100"
//           />
//           <StatCard
//             label="عدد فواتير اليوم"
//             value={stats.countToday.toLocaleString("ar-SA")}
//             icon="🧮"
//             color="bg-sky-50 text-sky-700 border-sky-100"
//           />
//           <StatCard
//             label="إجمالي مبيعات النظام"
//             value={formatCurrency(stats.totalAll)}
//             icon="💰"
//             color="bg-amber-50 text-amber-700 border-amber-100"
//           />
//         </div>

//         {/* الفلاتر والبحث */}
//         <div className="p-4 space-y-4 bg-white border shadow-sm rounded-2xl">
//           <div className="relative">
//             <span className="absolute text-slate-400 left-3 top-2.5">🔎</span>
//             <input
//               type="text"
//               placeholder="بحث برقم الفاتورة أو اسم العميل…"
//               className="w-full p-3 pr-3 text-sm border rounded-xl pl-9 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           <div className="flex flex-wrap items-center gap-3 text-sm">
//             {/* كاشير */}
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-xs text-slate-500">الكاشير:</span>
//               <select
//                 className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
//                 value={cashierFilter}
//                 onChange={(e) => setCashierFilter(e.target.value)}
//               >
//                 <option value="all">كل الكاشير</option>
//                 {cashierOptions.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* طريقة الدفع */}
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-xs text-slate-500">الدفع:</span>
//               <select
//                 className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
//                 value={paymentFilter}
//                 onChange={(e) => setPaymentFilter(e.target.value)}
//               >
//                 <option value="all">الكل</option>
//                 <option value="cash">نقدًا</option>
//                 <option value="card">بطاقة</option>
//                 <option value="wallet">محفظة</option>
//               </select>
//             </div>

//             {/* نوع الفاتورة */}
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-xs text-slate-500">النوع:</span>
//               <select
//                 className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//               >
//                 <option value="all">الكل</option>
//                 <option value="sale">بيع</option>
//                 <option value="return">مرتجع</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* جدول المبيعات */}
//         <div className="overflow-x-auto bg-white border shadow-sm rounded-2xl">
//           {loading ? (
//             <div className="p-6 text-sm text-center text-slate-500">
//               🔄 جاري تحميل المبيعات…
//             </div>
//           ) : (
//             <table className="w-full text-sm text-right min-w-[900px]">
//               <thead className="text-xs uppercase border-b bg-slate-50 text-slate-500">
//                 <tr>
//                   <th className="p-3 font-medium">#</th>
//                   <th className="p-3 font-medium">التاريخ</th>
//                   <th className="p-3 font-medium">العميل</th>
//                   <th className="p-3 font-medium">الكاشير</th>
//                   <th className="p-3 font-medium">طريقة الدفع</th>
//                   <th className="p-3 font-medium">النوع</th>
//                   <th className="p-3 font-medium">الإجمالي</th>
//                   <th className="p-3 font-medium text-center">إجراءات</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSales.map((s) => (
//                   <tr
//                     key={s.id}
//                     className="transition-colors border-t border-slate-100 even:bg-slate-50/40 hover:bg-slate-100/60"
//                   >
//                     <td className="p-3 text-slate-700">{s.id}</td>
//                     <td className="p-3 text-slate-700">
//                       {s.created_at
//                         ? new Date(s.created_at).toLocaleString("ar-EG")
//                         : "-"}
//                     </td>
//                     <td className="p-3 text-slate-700">
//                       {s.customer || "-"}
//                     </td>
//                     <td className="p-3 text-slate-700">
//                       {s.cashier || "-"}
//                     </td>
//                     <td className="p-3 text-slate-700">
//                       {s.payment_method === "cash"
//                         ? "نقدًا"
//                         : s.payment_method === "card"
//                         ? "بطاقة"
//                         : s.payment_method === "wallet"
//                         ? "محفظة"
//                         : s.payment_method || "-"}
//                     </td>
//                     <td className="p-3 text-slate-700">
//                       <span
//                         className={`px-2 py-0.5 text-xs rounded-full ${
//                           s.sale_type === "sale"
//                             ? "bg-emerald-50 text-emerald-700"
//                             : "bg-amber-50 text-amber-700"
//                         }`}
//                       >
//                         {s.sale_type === "sale" ? "بيع" : "مرتجع"}
//                       </span>
//                     </td>
//                     <td className="p-3 font-semibold text-slate-900">
//                       {formatCurrency(s.total)}
//                     </td>
//                     <td className="p-3 text-center">
//                       <div className="flex flex-wrap justify-center gap-1">
//                         <button
//                           onClick={() => openSaleDetails(s)}
//                           className="px-3 py-1 text-xs font-medium text-indigo-700 rounded-lg bg-indigo-50 hover:bg-indigo-100"
//                         >
//                           🔍 تفاصيل
//                         </button>
//                         <button
//                           onClick={() => handleDeleteSale(s.id)}
//                           className="px-3 py-1 text-xs font-medium text-red-700 rounded-lg bg-red-50 hover:bg-red-100"
//                         >
//                           🗑️ حذف
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//                 {!filteredSales.length && !loading && (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="p-6 text-sm text-center text-slate-400"
//                     >
//                       لا توجد فواتير مطابقة للبحث / الفلاتر الحالية…
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* مودال إضافة فاتورة جديدة */}
//         {showAddModal && (
//           <Modal
//             title="فاتورة جديدة"
//             onClose={() => setShowAddModal(false)}
//             onConfirm={handleSaveSale}
//             confirmLabel="حفظ الفاتورة"
//           >
//             <div className="space-y-4 text-sm" dir="rtl">
//               {/* بيانات عامة */}
//               <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                 <Field label="العميل">
//                   <input
//                     className="w-full p-2 border rounded-lg border-slate-200"
//                     value={saleForm.customer}
//                     onChange={(e) =>
//                       setSaleForm((prev) => ({
//                         ...prev,
//                         customer: e.target.value,
//                       }))
//                     }
//                   />
//                 </Field>
//                 <Field label="الكاشير">
//                   <input
//                     className="w-full p-2 border rounded-lg border-slate-200"
//                     value={saleForm.cashier}
//                     onChange={(e) =>
//                       setSaleForm((prev) => ({
//                         ...prev,
//                         cashier: e.target.value,
//                       }))
//                     }
//                     placeholder={user?.name || ""}
//                   />
//                 </Field>
//                 <Field label="طريقة الدفع">
//                   <select
//                     className="w-full p-2 border rounded-lg border-slate-200"
//                     value={saleForm.paymentMethod}
//                     onChange={(e) =>
//                       setSaleForm((prev) => ({
//                         ...prev,
//                         paymentMethod: e.target.value,
//                       }))
//                     }
//                   >
//                     <option value="cash">نقدًا</option>
//                     <option value="card">بطاقة</option>
//                     <option value="wallet">محفظة</option>
//                   </select>
//                 </Field>
//                 <Field label="نوع الفاتورة">
//                   <select
//                     className="w-full p-2 border rounded-lg border-slate-200"
//                     value={saleForm.saleType}
//                     onChange={(e) =>
//                       setSaleForm((prev) => ({
//                         ...prev,
//                         saleType: e.target.value,
//                       }))
//                     }
//                   >
//                     <option value="sale">بيع</option>
//                     <option value="return">مرتجع</option>
//                   </select>
//                 </Field>
//               </div>

//               {/* سطر إضافة منتج */}
//               <div className="p-3 space-y-2 border rounded-xl border-slate-200 bg-slate-50/60">
//                 <p className="text-xs font-semibold text-slate-600">
//                   إضافة منتج للفاتورة
//                 </p>
//                 <div className="grid items-end grid-cols-1 gap-2 md:grid-cols-4">
//                   <div className="md:col-span-2">
//                     <label className="block mb-1 text-xs text-slate-500">
//                       المنتج
//                     </label>
//                     <select
//                       className="w-full p-2 text-sm border rounded-lg border-slate-200"
//                       value={lineProductId}
//                       onChange={(e) => {
//                         const v = e.target.value;
//                         setLineProductId(v);
//                         const prod = products.find(
//                           (p) => p.id === Number(v)
//                         );
//                         if (prod) setLinePrice(prod.price || "");
//                       }}
//                     >
//                       <option value="">اختر منتجًا…</option>
//                       {products.map((p) => (
//                         <option key={p.id} value={p.id}>
//                           {p.name} ({p.sku})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block mb-1 text-xs text-slate-500">
//                       الكمية
//                     </label>
//                     <input
//                       type="number"
//                       min={1}
//                       className="w-full p-2 border rounded-lg border-slate-200"
//                       value={lineQty}
//                       onChange={(e) => setLineQty(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-1 text-xs text-slate-500">
//                       سعر الوحدة
//                     </label>
//                     <input
//                       type="number"
//                       className="w-full p-2 border rounded-lg border-slate-200"
//                       value={linePrice}
//                       onChange={(e) => setLinePrice(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end">
//                   <button
//                     type="button"
//                     onClick={handleAddLine}
//                     className="px-3 py-1 mt-1 text-xs font-medium text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
//                   >
//                     ➕ إضافة للسلة
//                   </button>
//                 </div>
//               </div>

//               {/* جدول العناصر داخل الفاتورة */}
//               <div className="mt-3">
//                 <p className="mb-2 text-xs font-semibold text-slate-600">
//                   العناصر المضافة:
//                 </p>
//                 {(saleForm.items || []).length ? (
//                   <div className="overflow-x-auto border rounded-lg border-slate-200">
//                     <table className="w-full text-xs text-right">
//                       <thead className="bg-slate-50">
//                         <tr>
//                           <th className="p-2">المنتج</th>
//                           <th className="p-2">الكمية</th>
//                           <th className="p-2">سعر الوحدة</th>
//                           <th className="p-2">الإجمالي</th>
//                           <th className="p-2 text-center">حذف</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {saleForm.items.map((it, i) => (
//                           <tr key={i} className="border-t">
//                             <td className="p-2">{it.productName}</td>
//                             <td className="p-2">{it.qty}</td>
//                             <td className="p-2">
//                               {formatCurrency(it.price)}
//                             </td>
//                             <td className="p-2">
//                               {formatCurrency(
//                                 Number(it.qty || 0) *
//                                   Number(it.price || 0)
//                               )}
//                             </td>
//                             <td className="p-2 text-center">
//                               <button
//                                 type="button"
//                                 onClick={() => handleRemoveLine(i)}
//                                 className="px-2 py-1 text-xs text-red-700 rounded bg-red-50 hover:bg-red-100"
//                               >
//                                 🗑️
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <p className="text-xs text-slate-400">
//                     لم تتم إضافة أي منتج بعد.
//                   </p>
//                 )}
//               </div>

//               {/* الخصم والضريبة والإجماليات */}
//               <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3">
//                 <Field label="الخصم">
//                   <input
//                     type="number"
//                     className="w-full p-2 border rounded-lg border-slate-200"
//                     value={saleForm.discount}
//                     onChange={(e) =>
//                       setSaleForm((prev) => ({
//                         ...prev,
//                         discount: e.target.value,
//                       }))
//                     }
//                   />
//                 </Field>
//                 <Field label="الضريبة">
//                   <input
//                     type="number"
//                     className="w-full p-2 border rounded-lg border-slate-200"
//                     value={saleForm.tax}
//                     onChange={(e) =>
//                       setSaleForm((prev) => ({
//                         ...prev,
//                         tax: e.target.value,
//                       }))
//                     }
//                   />
//                 </Field>
//                 <div className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50">
//                   <p className="flex items-center justify-between">
//                     <span className="text-slate-500">الإجمالي قبل:</span>
//                     <span className="font-semibold">
//                       {formatCurrency(saleTotals.subtotal)}
//                     </span>
//                   </p>
//                   <p className="flex items-center justify-between">
//                     <span className="text-slate-500">الخصم:</span>
//                     <span>{formatCurrency(saleTotals.discount)}</span>
//                   </p>
//                   <p className="flex items-center justify-between">
//                     <span className="text-slate-500">الضريبة:</span>
//                     <span>{formatCurrency(saleTotals.tax)}</span>
//                   </p>
//                   <p className="flex items-center justify-between mt-1 text-emerald-700">
//                     <span className="font-semibold">الإجمالي النهائي:</span>
//                     <span className="font-bold">
//                       {formatCurrency(saleTotals.total)}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </Modal>
//         )}

//         {/* مودال تفاصيل الفاتورة */}
//         {showDetailsModal && selectedSale && (
//           <Modal
//             title={`تفاصيل الفاتورة رقم #${selectedSale.id}`}
//             onClose={() => setShowDetailsModal(false)}
//             onConfirm={() => setShowDetailsModal(false)}
//             confirmLabel="إغلاق"
//           >
//             <div className="space-y-3 text-sm" dir="rtl">
//               <p>
//                 <strong>العميل:</strong> {selectedSale.customer || "-"}
//               </p>
//               <p>
//                 <strong>الكاشير:</strong> {selectedSale.cashier || "-"}
//               </p>
//               <p>
//                 <strong>نوع الفاتورة:</strong>{" "}
//                 {selectedSale.sale_type === "sale" ? "بيع" : "مرتجع"}
//               </p>
//               <p>
//                 <strong>طريقة الدفع:</strong>{" "}
//                 {selectedSale.payment_method === "cash"
//                   ? "نقدًا"
//                   : selectedSale.payment_method === "card"
//                   ? "بطاقة"
//                   : selectedSale.payment_method === "wallet"
//                   ? "محفظة"
//                   : selectedSale.payment_method || "-"}
//               </p>
//               <p>
//                 <strong>التاريخ:</strong>{" "}
//                 {selectedSale.created_at
//                   ? new Date(selectedSale.created_at).toLocaleString(
//                       "ar-EG"
//                     )
//                   : "-"}
//               </p>

//               <hr className="my-2" />

//               <p className="text-xs font-semibold text-slate-600">
//                 العناصر:
//               </p>

//               {detailsLoading ? (
//                 <p className="text-xs text-slate-500">
//                   🔄 جاري تحميل تفاصيل الفاتورة…
//                 </p>
//               ) : (selectedSaleItems || []).length ? (
//                 <div className="overflow-x-auto border rounded-lg border-slate-200">
//                   <table className="w-full text-xs text-right">
//                     <thead className="bg-slate-50">
//                       <tr>
//                         <th className="p-2">المنتج</th>
//                         <th className="p-2">الكمية</th>
//                         <th className="p-2">سعر الوحدة</th>
//                         <th className="p-2">الإجمالي</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedSaleItems.map((it) => (
//                         <tr key={it.id} className="border-t">
//                           <td className="p-2">
//                             {it.product_name || it.productId}
//                           </td>
//                           <td className="p-2">{it.qty}</td>
//                           <td className="p-2">
//                             {formatCurrency(it.unit_price)}
//                           </td>
//                           <td className="p-2">
//                             {formatCurrency(it.total_price)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p className="text-xs text-slate-400">
//                   لا توجد عناصر محفوظة لهذه الفاتورة.
//                 </p>
//               )}

//               <hr className="my-2" />
//               <p className="flex items-center justify-between text-xs">
//                 <span>الإجمالي النهائي:</span>
//                 <span className="font-bold text-emerald-700">
//                   {formatCurrency(selectedSale.total)}
//                 </span>
//               </p>
//             </div>
//           </Modal>
//         )}
//       </div>
//     </Layout>
//   );
// }

// // بطاقة إحصائية
// function StatCard({ label, value, icon, color }) {
//   return (
//     <div
//       className={`flex items-center justify-between p-4 border rounded-2xl ${color}`}
//     >
//       <div className="space-y-1">
//         <p className="text-xs font-medium text-slate-500">{label}</p>
//         <p className="text-lg font-bold">{value}</p>
//       </div>
//       <div className="flex items-center justify-center w-10 h-10 text-lg rounded-full bg-white/70">
//         {icon}
//       </div>
//     </div>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <div>
//       <label className="block mb-1 text-xs text-slate-600">{label}</label>
//       {children}
//     </div>
//   );
// }
