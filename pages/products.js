// pages/products.js
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useInventory } from "../context/InventoryContext";
import WarningIndicator from "../components/WarningIndicator";
import Modal from "../components/Modal";

export default function ProductsPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const {
    products,
    setProducts,
    getWarnings,
    printInventoryReport,
  } = useInventory();

  // بحث وفلترة وترتيب
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [sortByName, setSortByName] = useState("asc");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [filterNearExpiry, setFilterNearExpiry] = useState(false);
  const [filterExpired, setFilterExpired] = useState(false);

  // عرض تفاصيل
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // إضافة منتج
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    company: "",
    purchasePrice: "",
    price: "",
    quantity: "",
    minQty: 5,
    expiryDate: "",
  });

  if (!hasPermission(["admin", "pharmacist"])) {
    return (
      <div dir="rtl" className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
        <div className="px-6 py-4 text-sm font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
          ⚠️ لا يمكنك دخول هذه الصفحة. الرجاء التواصل مع مدير النظام لتحديث صلاحياتك.
        </div>
      </div>
    );
  }

  // الفئات والشركات المتاحة للفلاتر
  const categories = [
    "all",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const companies = [
    "all",
    ...new Set(products.map((p) => p.company).filter(Boolean)),
  ];

  // إحصائيات سريعة للـ Dashboard
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalQty = products.reduce(
      (sum, p) => sum + (Number(p.quantity) || 0),
      0
    );
    const stockValue = products.reduce(
      (sum, p) =>
        sum +
        (Number(p.price) || 0) * (Number(p.quantity) || 0),
      0
    );

    return {
      totalProducts,
      totalQty,
      stockValue,
    };
  }, [products]);

  // فلترة المنتجات
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim() !== "") {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (companyFilter !== "all") {
      result = result.filter((p) => p.company === companyFilter);
    }

    if (filterLowStock) {
      result = result.filter((p) => p.quantity <= p.minQty);
    }

    if (filterNearExpiry) {
      result = result.filter((p) => {
        if (!p.expiryDate) return false;
        const days =
          (new Date(p.expiryDate) - new Date()) /
          (1000 * 60 * 60 * 24);
        return days > 0 && days <= 30;
      });
    }

    if (filterExpired) {
      result = result.filter((p) => {
        if (!p.expiryDate) return false;
        const days =
          (new Date(p.expiryDate) - new Date()) /
          (1000 * 60 * 60 * 24);
        return days < 0;
      });
    }

    result.sort((a, b) => {
      if (sortByName === "asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return result;
  }, [
    search,
    categoryFilter,
    companyFilter,
    sortByName,
    filterLowStock,
    filterNearExpiry,
    filterExpired,
    products,
  ]);

  const openDetails = (p) => {
    setSelectedProduct(p);
    setShowDetails(true);
  };

  const deleteProduct = (id) => {
    const ok = confirm("هل أنت متأكد من حذف المنتج؟");
    if (!ok) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert("الاسم والسعر مطلوبان على الأقل");
      return;
    }

    const id = Date.now();
    setProducts((prev) => [
      ...prev,
      {
        id,
        ...newProduct,
        purchasePrice: Number(newProduct.purchasePrice) || 0,
        price: Number(newProduct.price) || 0,
        quantity: Number(newProduct.quantity) || 0,
        minQty: Number(newProduct.minQty) || 0,
      },
    ]);

    setShowAddModal(false);
    setNewProduct({
      name: "",
      sku: "",
      category: "",
      company: "",
      purchasePrice: "",
      price: "",
      quantity: "",
      minQty: 5,
      expiryDate: "",
    });
  };

  const printProducts = () => {
    const w = window.open("", "", "width=900,height=700");

    w.document.write(`
      <html dir="rtl" lang="ar">
      <head>
        <title>تقرير المنتجات</title>
        <style>
          body { font-family:'Tajawal',sans-serif; padding:20px; }
          h2 { text-align:center; margin-bottom: 10px; }
          p.info { text-align:center; font-size: 12px; color:#64748b; margin:0; }
          table { width:100%; border-collapse:collapse; margin-top:20px; }
          th, td { border:1px solid #ddd; padding:6px; font-size:12px; text-align:right; }
          th { background:#f1f5f9; }
        </style>
      </head>
      <body>
        <h2>📄 تقرير المنتجات</h2>
        <p class="info">عدد المنتجات: ${products.length} | تم التوليد في: ${new Date().toLocaleString("ar-EG")}</p>
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الكود</th>
              <th>الفئة</th>
              <th>الشركة</th>
              <th>سعر الشراء</th>
              <th>سعر البيع</th>
              <th>الكمية</th>
              <th>ربح/وحدة</th>
              <th>إجمالي الربح</th>
              <th>الصلاحية</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map((p) => {
                const unitProfit =
                  (p.price || 0) - (p.purchasePrice || 0);
                const totalProfit = unitProfit * (p.quantity || 0);
                return `
                  <tr>
                    <td>${p.name}</td>
                    <td>${p.sku || ""}</td>
                    <td>${p.category || ""}</td>
                    <td>${p.company || ""}</td>
                    <td>${p.purchasePrice || 0}</td>
                    <td>${p.price || 0}</td>
                    <td>${p.quantity || 0}</td>
                    <td>${unitProfit.toFixed(2)}</td>
                    <td>${totalProfit.toFixed(2)}</td>
                    <td>${p.expiryDate || ""}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
        <script>window.print()</script>
      </body>
      </html>
    `);

    w.document.close();
  };

  return (
    <Layout user={user} title="إدارة المنتجات">
      <div dir="rtl" className="space-y-6">

        {/* رأس الصفحة + الإحصائيات + الأزرار */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
              💊 إدارة المنتجات
            </h1>
            <p className="text-sm text-slate-500">
              متابعة مخزون الأدوية، هوامش الربح، وتحذيرات الصلاحية من واجهة واحدة.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm bg-emerald-600 hover:bg-emerald-700"
            >
              <span>➕</span>
              <span>إضافة منتج</span>
            </button>

            <button
              onClick={printProducts}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
            >
              <span>🖨️</span>
              <span>طباعة تقرير</span>
            </button>

            {printInventoryReport && (
              <button
                onClick={printInventoryReport}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-100 rounded-lg bg-indigo-50 hover:bg-indigo-100"
              >
                <span>📥</span>
                <span>تقرير الجرد (PDF)</span>
              </button>
            )}
          </div>
        </div>

        {/* كروت الإحصائيات */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="إجمالي المنتجات"
            value={stats.totalProducts.toLocaleString("ar-EG")}
            icon="📦"
            color="bg-sky-50 text-sky-700 border-sky-100"
          />
          <StatCard
            label="إجمالي الكمية بالمخزون"
            value={stats.totalQty.toLocaleString("ar-EG")}
            icon="📊"
            color="bg-emerald-50 text-emerald-700 border-emerald-100"
          />
          <StatCard
            label="قيمة المخزون (تقريبية)"
            value={`${stats.stockValue.toFixed(2).toLocaleString("en-US")} ر.س`}
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
              placeholder="ابحث عن منتج بالاسم، الكود، أو الشركة…"
              className="w-full p-3 pr-3 text-sm border rounded-xl pl-9 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">الفئة:</span>
              <select
                className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "كل الفئات" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">الشركة:</span>
              <select
                className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              >
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "كل الشركات" : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">ترتيب:</span>
              <select
                className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
                value={sortByName}
                onChange={(e) => setSortByName(e.target.value)}
              >
                <option value="asc">اسم المنتج (تصاعدي)</option>
                <option value="desc">اسم المنتج (تنازلي)</option>
              </select>
            </div>

            {/* فلاتر حالة المخزون والصلاحية */}
            <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
              <FilterChip
                active={filterLowStock}
                onClick={() => setFilterLowStock(!filterLowStock)}
                label="كمية منخفضة"
              />
              <FilterChip
                active={filterNearExpiry}
                onClick={() => setFilterNearExpiry(!filterNearExpiry)}
                label="قرب انتهاء الصلاحية"
              />
              <FilterChip
                active={filterExpired}
                onClick={() => setFilterExpired(!filterExpired)}
                label="منتهي الصلاحية"
              />
            </div>
          </div>
        </div>

        {/* جدول المنتجات */}
        <div className="overflow-x-auto bg-white border shadow-sm rounded-2xl">
          <table className="w-full text-sm text-right min-w-[980px]">
            <thead className="text-xs uppercase border-b bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3 font-medium">الاسم</th>
                <th className="p-3 font-medium">الكود</th>
                <th className="p-3 font-medium">الفئة</th>
                <th className="p-3 font-medium">الشركة</th>
                <th className="p-3 font-medium">سعر الشراء</th>
                <th className="p-3 font-medium">سعر البيع</th>
                <th className="p-3 font-medium">المخزون</th>
                <th className="p-3 font-medium">ربح/وحدة</th>
                <th className="p-3 font-medium">إجمالي الربح</th>
                <th className="p-3 font-medium">الصلاحية</th>
                <th className="p-3 font-medium text-center">تحذيرات</th>
                <th className="p-3 font-medium text-center">إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => {
                const warnings = getWarnings(p);
                const unitProfit =
                  (p.price || 0) - (p.purchasePrice || 0);
                const totalProfit = unitProfit * (p.quantity || 0);

                let expiryText = p.expiryDate || "-";
                if (warnings.includes("❌ المنتج منتهي الصلاحية!")) {
                  expiryText = "منتهي";
                }

                return (
                  <tr
                    key={p.id}
                    className="transition-colors border-t border-slate-100 even:bg-slate-50/40 hover:bg-slate-100/60"
                  >
                    <td className="p-3 font-medium text-slate-800">
                      {p.name}
                    </td>
                    <td className="p-3 text-slate-600">{p.sku}</td>
                    <td className="p-3 text-slate-600">{p.category}</td>
                    <td className="p-3 text-slate-600">{p.company}</td>
                    <td className="p-3 text-slate-700">
                      {p.purchasePrice || 0} ر.س
                    </td>
                    <td className="p-3 text-slate-700">
                      {p.price || 0} ر.س
                    </td>
                    <td
                      className={`p-3 ${
                        p.quantity <= p.minQty
                          ? "text-red-600 font-bold"
                          : "text-slate-800"
                      }`}
                    >
                      {p.quantity}
                    </td>
                    <td className="p-3 text-slate-700">
                      {unitProfit.toFixed(2)} ر.س
                    </td>
                    <td className="p-3 text-slate-700">
                      {totalProfit.toFixed(2)} ر.س
                    </td>
                    <td className="p-3 text-slate-700">{expiryText}</td>

                    <td className="p-3 text-center">
                      <WarningIndicator warnings={warnings} />
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        <button
                          onClick={() => openDetails(p)}
                          className="px-3 py-1 text-xs font-medium text-indigo-700 rounded-lg bg-indigo-50 hover:bg-indigo-100"
                        >
                          🔍 عرض
                        </button>

                          <button
                            onClick={() =>
                              router.push(`/inventory?product=${p.id}`)
                            }
                            className="px-3 py-1 text-xs font-medium text-blue-700 rounded-lg bg-blue-50 hover:bg-blue-100"
                          >
                          📦 مخزون
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/products/edit/${p.id}`)
                          }
                          className="px-3 py-1 text-xs font-medium rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100"
                        >
                          ✏️ تعديل
                        </button>

                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="px-3 py-1 text-xs font-medium text-red-700 rounded-lg bg-red-50 hover:bg-red-100"
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!filteredProducts.length && (
                <tr>
                  <td colSpan={12} className="p-6 text-sm text-center text-slate-400">
                    لا توجد نتائج مطابقة للبحث / الفلاتر الحالية…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* تفاصيل المنتج */}
        {showDetails && selectedProduct && (
          <Modal
            title="تفاصيل المنتج"
            onClose={() => setShowDetails(false)}
            onConfirm={() => setShowDetails(false)}
            confirmLabel="إغلاق"
          >
            <div className="space-y-2 text-sm" dir="rtl">
              <p><strong>الاسم:</strong> {selectedProduct.name}</p>
              <p><strong>الكود:</strong> {selectedProduct.sku}</p>
              <p><strong>الفئة:</strong> {selectedProduct.category}</p>
              <p><strong>الشركة:</strong> {selectedProduct.company}</p>
              <p><strong>سعر الشراء:</strong> {selectedProduct.purchasePrice || 0} ر.س</p>
              <p><strong>سعر البيع:</strong> {selectedProduct.price || 0} ر.س</p>
              <p><strong>الكمية:</strong> {selectedProduct.quantity}</p>
              <p><strong>الحد الأدنى:</strong> {selectedProduct.minQty}</p>
              <p><strong>تاريخ الانتهاء:</strong> {selectedProduct.expiryDate || "-"}</p>

              <div className="mt-3">
                <strong>التحذيرات:</strong>
                {getWarnings(selectedProduct).length ? (
                  <ul className="pr-4 mt-1 text-xs text-red-600 list-disc">
                    {getWarnings(selectedProduct).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-emerald-600">
                    لا توجد تحذيرات على هذا المنتج.
                  </p>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* إضافة منتج */}
        {showAddModal && (
          <Modal
            title="إضافة منتج جديد"
            onClose={() => setShowAddModal(false)}
            onConfirm={handleAddProduct}
            confirmLabel="إضافة"
          >
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2" dir="rtl">
              <input
                type="text"
                className="w-full p-2 border rounded-lg border-slate-200"
                placeholder="اسم المنتج *"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full p-2 border rounded-lg border-slate-200"
                placeholder="الكود SKU"
                value={newProduct.sku}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sku: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full p-2 border rounded-lg border-slate-200"
                placeholder="الفئة"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full p-2 border rounded-lg border-slate-200"
                placeholder="الشركة"
                value={newProduct.company}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, company: e.target.value })
                }
              />
              <input
                type="number"
                className="w-full p-2 border rounded-lg border-slate-200"
                placeholder="سعر الشراء"
                value={newProduct.purchasePrice}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    purchasePrice: e.target.value,
                  })
                }
              />
              <input
                type="number"
                className="w-full p-2 border rounded-lg border-slate-200"
                placeholder="سعر البيع *"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
              <input
                type="number"
                className="w-full p-2 border rounded-lg border-slate-200"
                placeholder="الكمية"
                value={newProduct.quantity}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, quantity: e.target.value })
                }
              />
              <input
                type="number"
                className="w-full p-2 border rounded-lg border-slate-200"
                placeholder="الحد الأدنى للتنبيه"
                value={newProduct.minQty}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, minQty: e.target.value })
                }
              />
              <div className="md:col-span-2">
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg border-slate-200"
                  value={newProduct.expiryDate}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, expiryDate: e.target.value })
                  }
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400" dir="rtl">
              الحقول المعلمة بـ * مطلوبة. يمكن تعديل باقي التفاصيل لاحقًا من شاشة تعديل المنتج.
            </p>
          </Modal>
        )}
      </div>
    </Layout>
  );
}

// بطاقة إحصائية بسيطة
function StatCard({ label, value, icon, color }) {
  return (
    <div className={`flex items-center justify-between p-4 border rounded-2xl ${color}`}>
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

// فلتر كـ "Chip" احترافي
function FilterChip({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-full border transition ${
        active
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}















// // pages/products.js
// import { useState, useMemo } from "react";
// import { useRouter } from "next/router";
// import Layout from "../components/Layout";
// import { useAuth } from "../context/AuthContext";
// import { useInventory } from "../context/InventoryContext";
// import WarningIndicator from "../components/WarningIndicator";
// import Modal from "../components/Modal";

// export default function ProductsPage() {
//   const router = useRouter();
//   const { user, hasPermission } = useAuth();
//   const {
//     products,
//     setProducts,
//     getWarnings,
//     printInventoryReport,
//   } = useInventory();

//   // بحث وفلترة وترتيب
//   const [search, setSearch] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [companyFilter, setCompanyFilter] = useState("all");
//   const [sortByName, setSortByName] = useState("asc");
//   const [filterLowStock, setFilterLowStock] = useState(false);
//   const [filterNearExpiry, setFilterNearExpiry] = useState(false);
//   const [filterExpired, setFilterExpired] = useState(false);

//   // عرض تفاصيل
//   const [showDetails, setShowDetails] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // إضافة منتج
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     sku: "",
//     category: "",
//     company: "",
//     purchasePrice: "",
//     price: "",
//     quantity: "",
//     minQty: 5,
//     expiryDate: "",
//   });

//   if (!hasPermission(["admin", "pharmacist"])) {
//     return (
//       <div dir="rtl" className="p-6 text-center text-red-600">
//         ⚠️ لا يمكنك دخول هذه الصفحة.
//       </div>
//     );
//   }

//   const categories = [
//     "all",
//     ...new Set(products.map((p) => p.category).filter(Boolean)),
//   ];

//   const companies = [
//     "all",
//     ...new Set(products.map((p) => p.company).filter(Boolean)),
//   ];

//   const filteredProducts = useMemo(() => {
//     let result = [...products];

//     if (search.trim() !== "") {
//       result = result.filter((p) =>
//         p.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (categoryFilter !== "all") {
//       result = result.filter((p) => p.category === categoryFilter);
//     }

//     if (companyFilter !== "all") {
//       result = result.filter((p) => p.company === companyFilter);
//     }

//     if (filterLowStock) {
//       result = result.filter((p) => p.quantity <= p.minQty);
//     }

//     if (filterNearExpiry) {
//       result = result.filter((p) => {
//         if (!p.expiryDate) return false;
//         const days =
//           (new Date(p.expiryDate) - new Date()) /
//           (1000 * 60 * 60 * 24);
//         return days > 0 && days <= 30;
//       });
//     }

//     if (filterExpired) {
//       result = result.filter((p) => {
//         if (!p.expiryDate) return false;
//         const days =
//           (new Date(p.expiryDate) - new Date()) /
//           (1000 * 60 * 60 * 24);
//         return days < 0;
//       });
//     }

//     result.sort((a, b) => {
//       if (sortByName === "asc") return a.name.localeCompare(b.name);
//       return b.name.localeCompare(a.name);
//     });

//     return result;
//   }, [
//     search,
//     categoryFilter,
//     companyFilter,
//     sortByName,
//     filterLowStock,
//     filterNearExpiry,
//     filterExpired,
//     products,
//   ]);

//   const openDetails = (p) => {
//     setSelectedProduct(p);
//     setShowDetails(true);
//   };

//   const deleteProduct = (id) => {
//     const ok = confirm("هل أنت متأكد من حذف المنتج؟");
//     if (!ok) return;
//     setProducts((prev) => prev.filter((p) => p.id !== id));
//   };

//   const handleAddProduct = () => {
//     if (!newProduct.name || !newProduct.price) {
//       alert("الاسم والسعر مطلوبان على الأقل");
//       return;
//     }

//     const id = Date.now();
//     setProducts((prev) => [
//       ...prev,
//       {
//         id,
//         ...newProduct,
//         purchasePrice: Number(newProduct.purchasePrice) || 0,
//         price: Number(newProduct.price) || 0,
//         quantity: Number(newProduct.quantity) || 0,
//         minQty: Number(newProduct.minQty) || 0,
//       },
//     ]);

//     setShowAddModal(false);
//     setNewProduct({
//       name: "",
//       sku: "",
//       category: "",
//       company: "",
//       purchasePrice: "",
//       price: "",
//       quantity: "",
//       minQty: 5,
//       expiryDate: "",
//     });
//   };

//   const printProducts = () => {
//     const w = window.open("", "", "width=900,height=700");

//     w.document.write(`
//       <html dir="rtl" lang="ar">
//       <head>
//         <title>تقرير المنتجات</title>
//         <style>
//           body { font-family:'Tajawal',sans-serif; padding:20px; }
//           h2 { text-align:center; }
//           table { width:100%; border-collapse:collapse; margin-top:20px; }
//           th, td { border:1px solid #ddd; padding:6px; font-size:12px; text-align:right; }
//           th { background:#f1f5f9; }
//         </style>
//       </head>
//       <body>
//         <h2>📄 تقرير المنتجات</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>الاسم</th>
//               <th>الكود</th>
//               <th>الفئة</th>
//               <th>الشركة</th>
//               <th>سعر الشراء</th>
//               <th>سعر البيع</th>
//               <th>الكمية</th>
//               <th>ربح/وحدة</th>
//               <th>إجمالي الربح</th>
//               <th>الصلاحية</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${products
//               .map((p) => {
//                 const unitProfit =
//                   (p.price || 0) - (p.purchasePrice || 0);
//                 const totalProfit = unitProfit * (p.quantity || 0);
//                 return `
//                   <tr>
//                     <td>${p.name}</td>
//                     <td>${p.sku}</td>
//                     <td>${p.category}</td>
//                     <td>${p.company}</td>
//                     <td>${p.purchasePrice || 0}</td>
//                     <td>${p.price || 0}</td>
//                     <td>${p.quantity || 0}</td>
//                     <td>${unitProfit.toFixed(2)}</td>
//                     <td>${totalProfit.toFixed(2)}</td>
//                     <td>${p.expiryDate || ""}</td>
//                   </tr>
//                 `;
//               })
//               .join("")}
//           </tbody>
//         </table>
//         <script>window.print()</script>
//       </body>
//       </html>
//     `);

//     w.document.close();
//   };

//   return (
//     <Layout user={user} title="إدارة المنتجات">
//       <div dir="rtl" className="space-y-6">

//         {/* العنوان + الأزرار */}
//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           <h1 className="text-xl font-bold text-gray-800">💊 إدارة المنتجات</h1>

//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
//             >
//               ➕ إضافة منتج
//             </button>

//             <button
//               onClick={printProducts}
//               className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
//             >
//               🖨️ طباعة المنتجات
//             </button>
//           </div>
//         </div>

//         {/* الفلاتر والبحث */}
//         <div className="p-4 space-y-4 bg-white border shadow rounded-xl">
//           <input
//             type="text"
//             placeholder="ابحث عن منتج…"
//             className="w-full p-3 text-sm border rounded-lg"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <div className="flex flex-wrap items-center gap-3 text-sm">

//             <select
//               className="p-2 border rounded-lg"
//               value={categoryFilter}
//               onChange={(e) => setCategoryFilter(e.target.value)}
//             >
//               {categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat === "all" ? "كل الفئات" : cat}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="p-2 border rounded-lg"
//               value={companyFilter}
//               onChange={(e) => setCompanyFilter(e.target.value)}
//             >
//               {companies.map((c) => (
//                 <option key={c} value={c}>
//                   {c === "all" ? "كل الشركات" : c}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="p-2 border rounded-lg"
//               value={sortByName}
//               onChange={(e) => setSortByName(e.target.value)}
//             >
//               <option value="asc">اسم المنتج (تصاعدي)</option>
//               <option value="desc">اسم المنتج (تنازلي)</option>
//             </select>

//             <label className="flex items-center gap-1">
//               <input
//                 type="checkbox"
//                 checked={filterLowStock}
//                 onChange={() => setFilterLowStock(!filterLowStock)}
//               />
//               <span>كمية منخفضة</span>
//             </label>

//             <label className="flex items-center gap-1">
//               <input
//                 type="checkbox"
//                 checked={filterNearExpiry}
//                 onChange={() => setFilterNearExpiry(!filterNearExpiry)}
//               />
//               <span>قرب انتهاء الصلاحية</span>
//             </label>

//             <label className="flex items-center gap-1">
//               <input
//                 type="checkbox"
//                 checked={filterExpired}
//                 onChange={() => setFilterExpired(!filterExpired)}
//               />
//               <span>منتهي الصلاحية</span>
//             </label>
//           </div>
//         </div>

//         {/* جدول المنتجات */}
//         <div className="overflow-x-auto bg-white border shadow rounded-xl">
//           <table className="w-full text-sm text-right min-w-[900px]">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-3">الاسم</th>
//                 <th className="p-3">الكود</th>
//                 <th className="p-3">الفئة</th>
//                 <th className="p-3">الشركة</th>
//                 <th className="p-3">سعر الشراء</th>
//                 <th className="p-3">سعر البيع</th>
//                 <th className="p-3">المخزون</th>
//                 <th className="p-3">ربح/وحدة</th>
//                 <th className="p-3">إجمالي الربح</th>
//                 <th className="p-3">الصلاحية</th>
//                 <th className="p-3 text-center">تحذيرات</th>
//                 <th className="p-3 text-center">إجراءات</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredProducts.map((p) => {
//                 const warnings = getWarnings(p);
//                 const unitProfit =
//                   (p.price || 0) - (p.purchasePrice || 0);
//                 const totalProfit = unitProfit * (p.quantity || 0);

//                 let expiryText = p.expiryDate || "-";
//                 if (
//                   warnings.includes("❌ المنتج منتهي الصلاحية!")
//                 ) {
//                   expiryText = "منتهي";
//                 }

//                 return (
//                   <tr key={p.id} className="border-t hover:bg-gray-50">
//                     <td className="p-3">{p.name}</td>
//                     <td className="p-3">{p.sku}</td>
//                     <td className="p-3">{p.category}</td>
//                     <td className="p-3">{p.company}</td>
//                     <td className="p-3">{p.purchasePrice || 0} ر.س</td>
//                     <td className="p-3">{p.price || 0} ر.س</td>
//                     <td
//                       className={`p-3 ${
//                         p.quantity <= p.minQty
//                           ? "text-red-600 font-bold"
//                           : ""
//                       }`}
//                     >
//                       {p.quantity}
//                     </td>
//                     <td className="p-3">
//                       {unitProfit.toFixed(2)} ر.س
//                     </td>
//                     <td className="p-3">
//                       {totalProfit.toFixed(2)} ر.س
//                     </td>
//                     <td className="p-3">{expiryText}</td>

//                     <td className="p-3 text-center">
//                       <WarningIndicator warnings={warnings} />
//                     </td>

//                     <td className="p-3 text-center">
//                       <div className="flex justify-center gap-2">
//                         <button
//                           onClick={() => openDetails(p)}
//                           className="px-3 py-1 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
//                         >
//                           🔍 عرض
//                         </button>

//                         <button
//                           onClick={() =>
//                             router.push(`/inventory?product=${p.id}`)
//                           }
//                           className="px-3 py-1 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//                         >
//                           📦 مخزون
//                         </button>

//                         <button
//                           onClick={() =>
//                             router.push(`/products/edit/${p.id}`)
//                           }
//                           className="px-3 py-1 text-xs text-white rounded-lg bg-amber-600 hover:bg-amber-700"
//                         >
//                           ✏️ تعديل
//                         </button>

//                         <button
//                           onClick={() => deleteProduct(p.id)}
//                           className="px-3 py-1 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700"
//                         >
//                           🗑️ حذف
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {!filteredProducts.length && (
//                 <tr>
//                   <td colSpan={12} className="p-4 text-center text-gray-400">
//                     لا توجد نتائج مطابقة…
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* تفاصيل المنتج */}
//         {showDetails && selectedProduct && (
//           <Modal
//             title="تفاصيل المنتج"
//             onClose={() => setShowDetails(false)}
//             onConfirm={() => setShowDetails(false)}
//             confirmLabel="إغلاق"
//           >
//             <div className="space-y-2 text-sm" dir="rtl">
//               <p><strong>الاسم:</strong> {selectedProduct.name}</p>
//               <p><strong>الكود:</strong> {selectedProduct.sku}</p>
//               <p><strong>الفئة:</strong> {selectedProduct.category}</p>
//               <p><strong>الشركة:</strong> {selectedProduct.company}</p>
//               <p><strong>سعر الشراء:</strong> {selectedProduct.purchasePrice || 0} ر.س</p>
//               <p><strong>سعر البيع:</strong> {selectedProduct.price || 0} ر.س</p>
//               <p><strong>الكمية:</strong> {selectedProduct.quantity}</p>
//               <p><strong>الحد الأدنى:</strong> {selectedProduct.minQty}</p>
//               <p><strong>تاريخ الانتهاء:</strong> {selectedProduct.expiryDate}</p>

//               <div className="mt-3">
//                 <strong>التحذيرات:</strong>
//                 {getWarnings(selectedProduct).length ? (
//                   <ul className="pr-4 mt-1 text-xs text-red-600 list-disc">
//                     {getWarnings(selectedProduct).map((w, i) => (
//                       <li key={i}>{w}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="mt-1 text-xs text-green-600">
//                     لا توجد تحذيرات.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </Modal>
//         )}

//         {/* إضافة منتج */}
//         {showAddModal && (
//           <Modal
//             title="إضافة منتج جديد"
//             onClose={() => setShowAddModal(false)}
//             onConfirm={handleAddProduct}
//             confirmLabel="إضافة"
//           >
//             <div className="space-y-3 text-sm" dir="rtl">
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded"
//                 placeholder="اسم المنتج"
//                 value={newProduct.name}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, name: e.target.value })
//                 }
//               />
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded"
//                 placeholder="الكود SKU"
//                 value={newProduct.sku}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, sku: e.target.value })
//                 }
//               />
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded"
//                 placeholder="الفئة"
//                 value={newProduct.category}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, category: e.target.value })
//                 }
//               />
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded"
//                 placeholder="الشركة"
//                 value={newProduct.company}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, company: e.target.value })
//                 }
//               />
//               <input
//                 type="number"
//                 className="w-full p-2 border rounded"
//                 placeholder="سعر الشراء"
//                 value={newProduct.purchasePrice}
//                 onChange={(e) =>
//                   setNewProduct({
//                     ...newProduct,
//                     purchasePrice: e.target.value,
//                   })
//                 }
//               />
//               <input
//                 type="number"
//                 className="w-full p-2 border rounded"
//                 placeholder="سعر البيع"
//                 value={newProduct.price}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, price: e.target.value })
//                 }
//               />
//               <input
//                 type="number"
//                 className="w-full p-2 border rounded"
//                 placeholder="الكمية"
//                 value={newProduct.quantity}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, quantity: e.target.value })
//                 }
//               />
//               <input
//                 type="number"
//                 className="w-full p-2 border rounded"
//                 placeholder="الحد الأدنى"
//                 value={newProduct.minQty}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, minQty: e.target.value })
//                 }
//               />
//               <input
//                 type="date"
//                 className="w-full p-2 border rounded"
//                 value={newProduct.expiryDate}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, expiryDate: e.target.value })
//                 }
//               />
//             </div>
//           </Modal>
//         )}
//       </div>
//     </Layout>
//   );
// }
