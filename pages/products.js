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
      <div dir="rtl" className="p-6 text-center text-red-600">
        ⚠️ لا يمكنك دخول هذه الصفحة.
      </div>
    );
  }

  const categories = [
    "all",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const companies = [
    "all",
    ...new Set(products.map((p) => p.company).filter(Boolean)),
  ];

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
          h2 { text-align:center; }
          table { width:100%; border-collapse:collapse; margin-top:20px; }
          th, td { border:1px solid #ddd; padding:6px; font-size:12px; text-align:right; }
          th { background:#f1f5f9; }
        </style>
      </head>
      <body>
        <h2>📄 تقرير المنتجات</h2>
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
                    <td>${p.sku}</td>
                    <td>${p.category}</td>
                    <td>${p.company}</td>
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

        {/* العنوان + الأزرار */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-bold text-gray-800">💊 إدارة المنتجات</h1>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              ➕ إضافة منتج
            </button>

            <button
              onClick={printProducts}
              className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              🖨️ طباعة المنتجات
            </button>
          </div>
        </div>

        {/* الفلاتر والبحث */}
        <div className="p-4 space-y-4 bg-white border shadow rounded-xl">
          <input
            type="text"
            placeholder="ابحث عن منتج…"
            className="w-full p-3 text-sm border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-3 text-sm">

            <select
              className="p-2 border rounded-lg"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "كل الفئات" : cat}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded-lg"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "كل الشركات" : c}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded-lg"
              value={sortByName}
              onChange={(e) => setSortByName(e.target.value)}
            >
              <option value="asc">اسم المنتج (تصاعدي)</option>
              <option value="desc">اسم المنتج (تنازلي)</option>
            </select>

            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={filterLowStock}
                onChange={() => setFilterLowStock(!filterLowStock)}
              />
              <span>كمية منخفضة</span>
            </label>

            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={filterNearExpiry}
                onChange={() => setFilterNearExpiry(!filterNearExpiry)}
              />
              <span>قرب انتهاء الصلاحية</span>
            </label>

            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={filterExpired}
                onChange={() => setFilterExpired(!filterExpired)}
              />
              <span>منتهي الصلاحية</span>
            </label>
          </div>
        </div>

        {/* جدول المنتجات */}
        <div className="overflow-x-auto bg-white border shadow rounded-xl">
          <table className="w-full text-sm text-right min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">الاسم</th>
                <th className="p-3">الكود</th>
                <th className="p-3">الفئة</th>
                <th className="p-3">الشركة</th>
                <th className="p-3">سعر الشراء</th>
                <th className="p-3">سعر البيع</th>
                <th className="p-3">المخزون</th>
                <th className="p-3">ربح/وحدة</th>
                <th className="p-3">إجمالي الربح</th>
                <th className="p-3">الصلاحية</th>
                <th className="p-3 text-center">تحذيرات</th>
                <th className="p-3 text-center">إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => {
                const warnings = getWarnings(p);
                const unitProfit =
                  (p.price || 0) - (p.purchasePrice || 0);
                const totalProfit = unitProfit * (p.quantity || 0);

                let expiryText = p.expiryDate || "-";
                if (
                  warnings.includes("❌ المنتج منتهي الصلاحية!")
                ) {
                  expiryText = "منتهي";
                }

                return (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.sku}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.company}</td>
                    <td className="p-3">{p.purchasePrice || 0} ر.س</td>
                    <td className="p-3">{p.price || 0} ر.س</td>
                    <td
                      className={`p-3 ${
                        p.quantity <= p.minQty
                          ? "text-red-600 font-bold"
                          : ""
                      }`}
                    >
                      {p.quantity}
                    </td>
                    <td className="p-3">
                      {unitProfit.toFixed(2)} ر.س
                    </td>
                    <td className="p-3">
                      {totalProfit.toFixed(2)} ر.س
                    </td>
                    <td className="p-3">{expiryText}</td>

                    <td className="p-3 text-center">
                      <WarningIndicator warnings={warnings} />
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openDetails(p)}
                          className="px-3 py-1 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        >
                          🔍 عرض
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/inventory?product=${p.id}`)
                          }
                          className="px-3 py-1 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          📦 مخزون
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/products/edit/${p.id}`)
                          }
                          className="px-3 py-1 text-xs text-white rounded-lg bg-amber-600 hover:bg-amber-700"
                        >
                          ✏️ تعديل
                        </button>

                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="px-3 py-1 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700"
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
                  <td colSpan={12} className="p-4 text-center text-gray-400">
                    لا توجد نتائج مطابقة…
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
              <p><strong>تاريخ الانتهاء:</strong> {selectedProduct.expiryDate}</p>

              <div className="mt-3">
                <strong>التحذيرات:</strong>
                {getWarnings(selectedProduct).length ? (
                  <ul className="pr-4 mt-1 text-xs text-red-600 list-disc">
                    {getWarnings(selectedProduct).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-green-600">
                    لا توجد تحذيرات.
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
            <div className="space-y-3 text-sm" dir="rtl">
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="اسم المنتج"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="الكود SKU"
                value={newProduct.sku}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sku: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="الفئة"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="الشركة"
                value={newProduct.company}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, company: e.target.value })
                }
              />
              <input
                type="number"
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
                placeholder="سعر البيع"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="الكمية"
                value={newProduct.quantity}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, quantity: e.target.value })
                }
              />
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="الحد الأدنى"
                value={newProduct.minQty}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, minQty: e.target.value })
                }
              />
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newProduct.expiryDate}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, expiryDate: e.target.value })
                }
              />
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}














// // pages/products.js
// import { useMemo, useState } from "react";
// import { useRouter } from "next/router";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import toast, { Toaster } from "react-hot-toast";
// import { useInventory } from "../context/InventoryContext";

// export default function ProductsPage() {
//   const [user] = useState({ name: "المدير أحمد", role: "admin" });
//   const router = useRouter();
//   const {
//     products,
//     setProducts,
//     getWarnings,
//   } = useInventory();

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("الكل");
//   const [sortBy, setSortBy] = useState("name-asc");
//   const [lowStock, setLowStock] = useState(false);
//   const [nearExpiry, setNearExpiry] = useState(false);

//   const [showForm, setShowForm] = useState(false);
//   const [showView, setShowView] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const emptyForm = {
//     name: "",
//     sku: "",
//     category: "",
//     company: "",
//     price: "",
//     quantity: "",
//     minQty: "",
//     expiryDate: "",
//   };
//   const [form, setForm] = useState(emptyForm);

//   const categories = useMemo(
//     () => ["الكل", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
//     [products]
//   );

//   const isNearExpiry = (dateStr, days = 30) => {
//     if (!dateStr) return false;
//     const diff =
//       (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
//     return diff <= days;
//   };

//   const filtered = useMemo(() => {
//     let list = [...products];

//     if (search) {
//       const s = search.toLowerCase();
//       list = list.filter((p) =>
//         [p.name, p.sku, p.company].some((v) =>
//           v?.toLowerCase().includes(s)
//         )
//       );
//     }

//     if (category !== "الكل") {
//       list = list.filter((p) => p.category === category);
//     }

//     if (lowStock) {
//       list = list.filter((p) => p.quantity < (p.minQty ?? 5));
//     }

//     if (nearExpiry) {
//       list = list.filter((p) => isNearExpiry(p.expiryDate));
//     }

//     if (sortBy === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
//     if (sortBy === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));
//     if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
//     if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);

//     return list;
//   }, [products, search, category, lowStock, nearExpiry, sortBy]);

//   const openForm = (product = null) => {
//     if (product) {
//       setEditingId(product.id);
//       setForm({
//         name: product.name || "",
//         sku: product.sku || "",
//         category: product.category || "",
//         company: product.company || "",
//         price: product.price || "",
//         quantity: product.quantity || "",
//         minQty: product.minQty || "",
//         expiryDate: product.expiryDate || "",
//       });
//     } else {
//       setEditingId(null);
//       setForm(emptyForm);
//     }
//     setShowForm(true);
//   };

//   const openView = (product) => {
//     setSelectedProduct(product);
//     setShowView(true);
//   };

//   const saveProduct = () => {
//     if (!form.name.trim() || !form.sku.trim()) {
//       toast.error("الرجاء إدخال اسم المنتج والكود");
//       return;
//     }

//     if (editingId) {
//       setProducts((prev) =>
//         prev.map((p) =>
//           p.id === editingId
//             ? {
//                 ...p,
//                 ...form,
//                 price: Number(form.price) || 0,
//                 quantity: Number(form.quantity) || 0,
//                 minQty: Number(form.minQty) || 0,
//               }
//             : p
//         )
//       );
//       toast.success("تم تحديث المنتج");
//     } else {
//       const newId = Date.now();
//       setProducts((prev) => [
//         ...prev,
//         {
//           id: newId,
//           ...form,
//           price: Number(form.price) || 0,
//           quantity: Number(form.quantity) || 0,
//           minQty: Number(form.minQty) || 0,
//           stockHistory: [],
//         },
//       ]);
//       toast.success("تمت إضافة المنتج");
//     }

//     setShowForm(false);
//   };

//   const deleteProduct = (id) => {
//     if (!confirm("هل تريد حذف هذا المنتج؟")) return;
//     setProducts((prev) => prev.filter((p) => p.id !== id));
//     toast.success("تم حذف المنتج");
//   };

//   const printReport = () => {
//     const w = window.open("", "", "width=900,height=600");
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//       <head><title>تقرير المنتجات</title></head>
//       <body style="font-family: 'Tajawal', sans-serif; padding: 20px;">
//         <h2 style="text-align:center; color:#0ea5e9;">تقرير المنتجات</h2>
//         <table border="1" cellspacing="0" cellpadding="5" width="100%" style="border-collapse:collapse; font-size:13px;">
//           <thead style="background:#f3f4f6;">
//             <tr>
//               <th>#</th>
//               <th>الاسم</th>
//               <th>الكود</th>
//               <th>الفئة</th>
//               <th>الشركة</th>
//               <th>السعر</th>
//               <th>الكمية</th>
//               <th>تاريخ الانتهاء</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${filtered
//               .map(
//                 (p, i) => `
//               <tr>
//                 <td>${i + 1}</td>
//                 <td>${p.name}</td>
//                 <td>${p.sku}</td>
//                 <td>${p.category}</td>
//                 <td>${p.company}</td>
//                 <td>${p.price}</td>
//                 <td>${p.quantity}</td>
//                 <td>${p.expiryDate || ""}</td>
//               </tr>
//             `
//               )
//               .join("")}
//           </tbody>
//         </table>
//       </body>
//       </html>
//     `);
//     w.document.close();
//     w.print();
//   };

//   return (
//     <Layout user={user} title="المنتجات">
//       <Toaster />
//       <div dir="rtl" className="space-y-6">
//         <h1 className="text-2xl font-bold text-gray-800">📦 إدارة المنتجات</h1>

//         {/* الفلاتر */}
//         <div className="grid grid-cols-1 gap-4 p-5 bg-white border shadow-md rounded-xl md:grid-cols-4">
//           <input
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400"
//             placeholder="بحث بالاسم أو الكود أو الشركة…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <select
//             className="px-3 py-2 border rounded-lg"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             {categories.map((c, i) => (
//               <option key={i} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>

//           <select
//             className="px-3 py-2 border rounded-lg"
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//           >
//             <option value="name-asc">الاسم تصاعدي</option>
//             <option value="name-desc">الاسم تنازلي</option>
//             <option value="price-asc">السعر تصاعدي</option>
//             <option value="price-desc">السعر تنازلي</option>
//           </select>

//           <div className="flex items-center gap-4 text-sm">
//             <label className="flex items-center gap-1">
//               <input
//                 type="checkbox"
//                 checked={lowStock}
//                 onChange={() => setLowStock((v) => !v)}
//               />
//               كمية منخفضة
//             </label>
//             <label className="flex items-center gap-1">
//               <input
//                 type="checkbox"
//                 checked={nearExpiry}
//                 onChange={() => setNearExpiry((v) => !v)}
//               />
//               قرب الانتهاء
//             </label>
//           </div>
//         </div>

//         {/* أزرار */}
//         <div className="flex justify-between gap-3">
//           <button
//             className="px-5 py-2 text-white rounded-lg shadow bg-sky-600 hover:bg-sky-700"
//             onClick={() => openForm()}
//           >
//             ➕ إضافة منتج
//           </button>

//           <button
//             className="px-5 py-2 text-white bg-green-600 rounded-lg shadow hover:bg-green-700"
//             onClick={printReport}
//           >
//             🖨️ طباعة التقرير
//           </button>
//         </div>

//         {/* الجدول */}
//         <div className="overflow-x-auto bg-white border shadow-md rounded-xl">
//           <table className="w-full text-sm text-right">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="p-3 text-center">#</th>
//                 <th className="p-3">الاسم</th>
//                 <th className="p-3">الكود</th>
//                 <th className="p-3">الفئة</th>
//                 <th className="p-3">السعر</th>
//                 <th className="p-3">الكمية</th>
//                 <th className="p-3">الانتهاء</th>
//                 <th className="p-3 text-center">إجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((p, i) => {
//                 const warnings = getWarnings(p);
//                 return (
//                   <tr key={p.id} className="transition border-t hover:bg-gray-50">
//                     <td className="p-3 text-center text-gray-400">{i + 1}</td>
//                     <td className="p-3">{p.name}</td>
//                     <td className="p-3">{p.sku}</td>
//                     <td className="p-3">{p.category}</td>
//                     <td className="p-3">{p.price} ر.س</td>
//                     <td
//                       className={`p-3 ${
//                         p.quantity < (p.minQty ?? 5)
//                           ? "text-red-600 font-semibold"
//                           : ""
//                       }`}
//                     >
//                       {p.quantity}
//                     </td>
//                     <td
//                       className={`p-3 ${
//                         isNearExpiry(p.expiryDate) ? "text-amber-600" : ""
//                       }`}
//                     >
//                       {p.expiryDate || ""}
//                     </td>
//                     <td className="p-3 text-center">
//                       <div className="flex flex-wrap justify-center gap-1">
//                         <button
//                           onClick={() => openView(p)}
//                           className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50"
//                         >
//                           👁️ عرض
//                         </button>
//                         <button
//                           onClick={() =>
//                             router.push(`/inventory?product=${p.id}`)
//                           }
//                           className="px-2 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
//                         >
//                           📦 مخزون
//                         </button>
//                         <button
//                           onClick={() => openForm(p)}
//                           className="px-2 py-1 text-sm text-white rounded bg-amber-500 hover:bg-amber-600"
//                         >
//                           ✏️ تعديل
//                         </button>
//                         <button
//                           onClick={() => deleteProduct(p.id)}
//                           className="px-2 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
//                         >
//                           🗑️ حذف
//                         </button>
//                       </div>
//                       {warnings.length > 0 && (
//                         <div className="mt-1 text-xs text-right text-red-600">
//                           {warnings.map((w, idx) => (
//                             <div key={idx}>{w}</div>
//                           ))}
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}

//               {filtered.length === 0 && (
//                 <tr>
//                   <td colSpan={8} className="p-4 text-center text-gray-400">
//                     لا توجد منتجات مطابقة للبحث…
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* مودال عرض المنتج */}
//       {showView && selectedProduct && (
//         <Modal
//           title="عرض تفاصيل المنتج"
//           onClose={() => setShowView(false)}
//         >
//           <div dir="rtl" className="space-y-2 text-sm">
//             <InfoRow title="اسم المنتج" value={selectedProduct.name} />
//             <InfoRow title="الكود" value={selectedProduct.sku} />
//             <InfoRow title="الفئة" value={selectedProduct.category} />
//             <InfoRow title="الشركة" value={selectedProduct.company} />
//             <InfoRow
//               title="السعر"
//               value={`${selectedProduct.price} ر.س`}
//             />
//             <InfoRow
//               title="الكمية"
//               value={selectedProduct.quantity}
//             />
//             <InfoRow
//               title="الحد الأدنى"
//               value={selectedProduct.minQty}
//             />
//             <InfoRow
//               title="تاريخ الانتهاء"
//               value={selectedProduct.expiryDate || ""}
//             />
//             <InfoRow
//               title="التحذيرات"
//               value={
//                 getWarnings(selectedProduct).length
//                   ? getWarnings(selectedProduct).join(" - ")
//                   : "لا توجد تحذيرات"
//               }
//             />
//           </div>
//         </Modal>
//       )}

//       {/* مودال الإضافة / التعديل */}
//       {showForm && (
//         <Modal
//           title={editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
//           onClose={() => setShowForm(false)}
//           onConfirm={saveProduct}
//         >
//           <div dir="rtl" className="space-y-3 text-sm">
//             <FormInput
//               label="اسم المنتج"
//               value={form.name}
//               onChange={(v) => setForm({ ...form, name: v })}
//             />
//             <FormInput
//               label="الكود (SKU)"
//               value={form.sku}
//               onChange={(v) => setForm({ ...form, sku: v })}
//             />
//             <FormInput
//               label="الفئة"
//               value={form.category}
//               onChange={(v) => setForm({ ...form, category: v })}
//             />
//             <FormInput
//               label="الشركة"
//               value={form.company}
//               onChange={(v) => setForm({ ...form, company: v })}
//             />
//             <FormInput
//               label="السعر"
//               type="number"
//               value={form.price}
//               onChange={(v) => setForm({ ...form, price: v })}
//             />
//             <FormInput
//               label="الكمية"
//               type="number"
//               value={form.quantity}
//               onChange={(v) => setForm({ ...form, quantity: v })}
//             />
//             <FormInput
//               label="الحد الأدنى للمخزون"
//               type="number"
//               value={form.minQty}
//               onChange={(v) => setForm({ ...form, minQty: v })}
//             />
//             <FormInput
//               label="تاريخ الانتهاء"
//               type="date"
//               value={form.expiryDate}
//               onChange={(v) => setForm({ ...form, expiryDate: v })}
//             />
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   );
// }

// function InfoRow({ title, value }) {
//   return (
//     <div className="p-2 text-sm border rounded bg-gray-50">
//       <p className="text-xs text-gray-500">{title}</p>
//       <p className="font-semibold">{value}</p>
//     </div>
//   );
// }

// function FormInput({ label, value, onChange, type = "text" }) {
//   return (
//     <div className="space-y-1">
//       <label className="text-xs text-gray-500">{label}</label>
//       <input
//         type={type}
//         className="w-full p-2 text-sm border rounded"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       />
//     </div>
//   );
// }












// import { useEffect, useMemo, useState } from "react";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import toast, { Toaster } from "react-hot-toast";
// import { useRouter } from "next/router";

// export default function ProductsPage() {
//   const [user] = useState({ name: "المدير أحمد", role: "admin" });

//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("الكل");
//   const [sortBy, setSortBy] = useState("name-asc");
//   const [lowStock, setLowStock] = useState(false);
//   const [nearExpiry, setNearExpiry] = useState(false);

//   const [showForm, setShowForm] = useState(false);
//   const [showView, setShowView] = useState(false); // ⭐ مودال العرض
//   const [editingId, setEditingId] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null); // ⭐ المنتج المعروض

//   const emptyForm = {
//     name: "",
//     sku: "",
//     category: "",
//     company: "",
//     price: "",
//     quantity: "",
//     expiryDate: "",
//   };

//   const [form, setForm] = useState(emptyForm);

//   useEffect(() => {
//     setProducts([
//       {
//         id: 1,
//         name: "باراسيتامول 500mg",
//         sku: "PRC500",
//         category: "مسكنات",
//         company: "صيدليات المتحدة",
//         price: 12,
//         quantity: 30,
//         expiryDate: "2025-04-10",
//       },
//       {
//         id: 2,
//         name: "فيتامين سي 1000mg",
//         sku: "VTC1000",
//         category: "فيتامينات",
//         company: "الصحة العالمية",
//         price: 18,
//         quantity: 10,
//         expiryDate: "2024-12-15",
//       },
//       {
//         id: 3,
//         name: "انتي هستامين",
//         sku: "ANTHST",
//         category: "حساسية",
//         company: "هيومن فارما",
//         price: 25,
//         quantity: 5,
//         expiryDate: "2024-11-01",
//       },
//     ]);
//   }, []);

//   const categories = useMemo(
//     () => ["الكل", ...Array.from(new Set(products.map((p) => p.category)))],
//     [products]
//   );

//   const isNearExpiry = (isoDate, days = 30) => {
//     const diff = (new Date(isoDate) - new Date()) / (1000 * 60 * 60 * 24);
//     return diff <= days;
//   };

//   const filtered = useMemo(() => {
//     let list = [...products];

//     if (search) {
//       const s = search.toLowerCase();
//       list = list.filter((p) =>
//         [p.name, p.sku, p.company].some((v) => v?.toLowerCase().includes(s))
//       );
//     }

//     if (category !== "الكل") {
//       list = list.filter((p) => p.category === category);
//     }

//     if (lowStock) list = list.filter((p) => p.quantity < 10);
//     if (nearExpiry) list = list.filter((p) => isNearExpiry(p.expiryDate));

//     if (sortBy === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
//     if (sortBy === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));
//     if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
//     if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);

//     return list;
//   }, [products, search, category, lowStock, nearExpiry, sortBy]);

//   const openForm = (product = null) => {
//     if (product) {
//       setEditingId(product.id);
//       setForm(product);
//     } else {
//       setEditingId(null);
//       setForm(emptyForm);
//     }
//     setShowForm(true);
//   };

//   const openView = (product) => {
//     setSelectedProduct(product);
//     setShowView(true);
//   };

//   const saveProduct = () => {
//     if (!form.name.trim() || !form.sku.trim()) {
//       toast.error("الرجاء إدخال اسم المنتج والكود");
//       return;
//     }

//     if (editingId) {
//       setProducts((prev) =>
//         prev.map((p) => (p.id === editingId ? { ...form, id: editingId } : p))
//       );
//       toast.success("تم تحديث المنتج");
//     } else {
//       const newId = Date.now();
//       setProducts((prev) => [...prev, { ...form, id: newId }]);
//       toast.success("تمت إضافة المنتج");
//     }

//     setShowForm(false);
//   };

//   const deleteProduct = (id) => {
//     if (!confirm("هل أنت متأكد؟")) return;
//     setProducts((prev) => prev.filter((p) => p.id !== id));
//     toast.success("تم حذف المنتج");
//   };

//   return (
//     <Layout user={user} title="المنتجات">
//       <Toaster />
//       <div dir="rtl" className="space-y-6">

//         <h1 className="text-2xl font-bold text-gray-800">📦 إدارة المنتجات</h1>

//         {/* فلاتر */}
//         <div className="grid grid-cols-1 gap-4 p-5 bg-white border shadow-md rounded-xl md:grid-cols-4">

//           <input
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400"
//             placeholder="بحث بالاسم أو الكود…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <select
//             className="px-3 py-2 border rounded-lg"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             {categories.map((c, i) => (
//               <option key={i}>{c}</option>
//             ))}
//           </select>

//           <select
//             className="px-3 py-2 border rounded-lg"
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//           >
//             <option value="name-asc">الاسم تصاعدي</option>
//             <option value="name-desc">الاسم تنازلي</option>
//             <option value="price-asc">السعر تصاعدي</option>
//             <option value="price-desc">السعر تنازلي</option>
//           </select>

//           <div className="flex items-center gap-4">
//             <label className="flex items-center gap-1 text-sm">
//               <input type="checkbox" checked={lowStock} onChange={() => setLowStock(!lowStock)} />
//               كمية منخفضة
//             </label>

//             <label className="flex items-center gap-1 text-sm">
//               <input type="checkbox" checked={nearExpiry} onChange={() => setNearExpiry(!nearExpiry)} />
//               قرب الانتهاء
//             </label>
//           </div>
//         </div>

//         {/* أزرار */}
//         <div className="flex justify-between">
//           <button
//             className="px-5 py-2 text-white rounded-lg shadow bg-sky-600 hover:bg-sky-700"
//             onClick={() => openForm()}
//           >
//             ➕ إضافة منتج
//           </button>

//           <button
//             className="px-5 py-2 text-white bg-green-600 rounded-lg shadow hover:bg-green-700"
//             onClick={() => window.print()}
//           >
//             🖨️ طباعة
//           </button>
//         </div>

//         {/* جدول */}
//         <div className="overflow-x-auto bg-white border shadow-md rounded-xl">
//           <table className="w-full text-sm text-right">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="p-3">الاسم</th>
//                 <th className="p-3">الكود</th>
//                 <th className="p-3">الفئة</th>
//                 <th className="p-3">الشركة</th>
//                 <th className="p-3">السعر</th>
//                 <th className="p-3">الكمية</th>
//                 <th className="p-3">الانتهاء</th>
//                 <th className="p-3">إجراءات</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.map((p) => (
//                 <tr key={p.id} className="transition border-t hover:bg-gray-50">
//                   <td className="p-3">{p.name}</td>
//                   <td className="p-3">{p.sku}</td>
//                   <td className="p-3">{p.category}</td>
//                   <td className="p-3">{p.company}</td>
//                   <td className="p-3">{p.price} ر.س</td>
//                   <td className="p-3">{p.quantity}</td>
//                   <td className="p-3 text-red-600">{p.expiryDate}</td>

//                   <td className="flex gap-2 p-3">
//                     <button
//                       onClick={() => openView(p)}
//                       className="px-3 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//                     >
//                       👁️ عرض
//                     </button>

//                     <button
//                       onClick={() => openForm(p)}
//                       className="px-3 py-1 text-white rounded-lg bg-amber-500 hover:bg-amber-600"
//                     >
//                       ✏️ تعديل
//                     </button>

//                     <button
//                       onClick={() => router.push(`/inventory?product=${p.id}`)}
//                       className="px-3 py-1 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
//                     >
//                       📦 مخزن
//                     </button>


//                     <button
//                       onClick={() => deleteProduct(p.id)}
//                       className="px-3 py-1 text-white bg-red-600 rounded-lg hover:bg-red-700"
//                     >
//                       🗑️ حذف
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {filtered.length === 0 && (
//                 <tr>
//                   <td colSpan="8" className="p-4 text-center text-gray-400">
//                     لا توجد منتجات مطابقة للبحث.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//       </div>

//       {/* مودال عرض المنتج */}
//       {showView && selectedProduct && (
//         <Modal title="عرض تفاصيل المنتج" onClose={() => setShowView(false)}>
//           <div dir="rtl" className="space-y-2 text-sm">

//             <InfoRow title="اسم المنتج" value={selectedProduct.name} />
//             <InfoRow title="الكود" value={selectedProduct.sku} />
//             <InfoRow title="الفئة" value={selectedProduct.category} />
//             <InfoRow title="الشركة" value={selectedProduct.company} />
//             <InfoRow title="السعر" value={`${selectedProduct.price} ر.س`} />
//             <InfoRow title="الكمية" value={selectedProduct.quantity} />

//             <InfoRow
//               title="تاريخ الانتهاء"
//               value={selectedProduct.expiryDate}
//             />

//             <InfoRow
//               title="حالة الصلاحية"
//               value={
//                 isNearExpiry(selectedProduct.expiryDate)
//                   ? "⚠️ قريب من الانتهاء"
//                   : "✔️ صالح"
//               }
//             />

//             <InfoRow
//               title="حالة المخزون"
//               value={
//                 selectedProduct.quantity < 10
//                   ? "🔴 منخفض"
//                   : "🟢 كافٍ"
//               }
//             />

//           </div>
//         </Modal>
//       )}

//       {/* مودال الإضافة / التعديل */}
//       {showForm && (
//         <Modal
//           title={editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
//           onClose={() => setShowForm(false)}
//           onConfirm={saveProduct}
//         >
//           <div dir="rtl" className="space-y-3">

//             <FormInput
//               label="اسم المنتج"
//               value={form.name}
//               onChange={(v) => setForm({ ...form, name: v })}
//             />

//             <FormInput
//               label="الكود (SKU)"
//               value={form.sku}
//               onChange={(v) => setForm({ ...form, sku: v })}
//             />

//             <FormInput
//               label="الفئة"
//               value={form.category}
//               onChange={(v) => setForm({ ...form, category: v })}
//             />

//             <FormInput
//               label="الشركة"
//               value={form.company}
//               onChange={(v) => setForm({ ...form, company: v })}
//             />

//             <FormInput
//               label="السعر"
//               type="number"
//               value={form.price}
//               onChange={(v) => setForm({ ...form, price: Number(v) })}
//             />

//             <FormInput
//               label="الكمية"
//               type="number"
//               value={form.quantity}
//               onChange={(v) => setForm({ ...form, quantity: Number(v) })}
//             />

//             <FormInput
//               label="تاريخ الانتهاء"
//               type="date"
//               value={form.expiryDate}
//               onChange={(v) => setForm({ ...form, expiryDate: v })}
//             />
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   );
// }

// // #############################################################
// // مكونات صغيرة
// // #############################################################

// function InfoRow({ title, value }) {
//   return (
//     <div className="p-2 text-sm border rounded bg-gray-50">
//       <p className="text-xs text-gray-500">{title}</p>
//       <p className="font-semibold">{value}</p>
//     </div>
//   );
// }

// function FormInput({ label, value, onChange, type = "text" }) {
//   return (
//     <div className="space-y-1">
//       <label className="text-xs text-gray-500">{label}</label>
//       <input
//         type={type}
//         className="w-full p-2 text-sm border rounded"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       />
//     </div>
//   );
// }


















// import { useEffect, useMemo, useState } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import toast, { Toaster } from 'react-hot-toast'
// import theme from '../theme'

// export default function ProductsPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })

//   const [products, setProducts] = useState([])
//   const [search, setSearch] = useState('')
//   const [category, setCategory] = useState('الكل')
//   const [sortBy, setSortBy] = useState('name-asc')
//   const [lowStock, setLowStock] = useState(false)
//   const [nearExpiry, setNearExpiry] = useState(false)
//   const [showForm, setShowForm] = useState(false)
//   const [viewItem, setViewItem] = useState(null)
//   const [form, setForm] = useState({ id: null, name: '', sku: '', category: '', company: '', price: '', cost: '', qty: '', minQty: '', expiry: '' })
//   const [isEdit, setIsEdit] = useState(false)

//   const apiUrl = 'http://localhost:5000/api/products'

//   // ✅ جلب البيانات من الباك إند
//   const fetchProducts = async (term = '') => {
//     try {
//       const res = await fetch(`${apiUrl}${term ? `?search=${term}` : ''}`)
//       const data = await res.json()
//       console.log("DATA FROM API:", data)
//       setProducts(data)
//     } catch (err) {
//       toast.error('❌ فشل في جلب البيانات من السيرفر')
//       console.error(err)
//     }
//   }

//   useEffect(() => {
//   const token = localStorage.getItem("pharmacy_token")
//   if (!token) {
//     router.replace("/")   // redirect to login
//   }
// }, [])
 
//   useEffect(() => {
//     fetchProducts()
//   }, [])

//   const categories = useMemo(() => ['الكل', ...new Set(products.map(p => p.category))], [products])

//   const isNearExpiry = (isoDate, days = 90) => {
//     if (!isoDate) return false
//     const exp = new Date(isoDate)
//     return (exp - new Date()) / (1000 * 60 * 60 * 24) <= days
//   }

//   const filtered = useMemo(() => {
//     let list = [...products]
//     if (search) list = list.filter(p => [p.name, p.sku, p.company].some(v => v?.toLowerCase().includes(search.toLowerCase())))
//     if (category !== 'الكل') list = list.filter(p => p.category === category)
//     if (lowStock) list = list.filter(p => p.qty <= p.minQty)
//     if (nearExpiry) list = list.filter(p => isNearExpiry(p.expiry))
//     if (sortBy === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name))
//     if (sortBy === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name))
//     if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price)
//     if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)
//     return list
//   }, [products, search, category, lowStock, nearExpiry, sortBy])

//   // ✅ فتح النموذج للإضافة
//   const openAdd = () => {
//     setForm({ id: null, name: '', sku: '', category: '', company: '', price: '', cost: '', qty: '', minQty: '', expiry: '' })
//     setIsEdit(false)
//     setShowForm(true)
//   }

//   // ✅ فتح النموذج للتعديل
//   const openEdit = (p) => {
//     setForm(p)
//     setIsEdit(true)
//     setShowForm(true)
//   }

//   // ✅ حفظ المنتج (إضافة أو تعديل)
//   const saveProduct = async () => {
//     if (!form.name || !form.sku || !form.category) return toast.error('⚠️ أدخل الاسم والكود والفئة')

//     try {
//       const method = isEdit ? 'PUT' : 'POST'
//       const url = isEdit ? `${apiUrl}/${form.id}` : apiUrl

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form)
//       })

//       const data = await res.json()

//       if (!res.ok) throw new Error(data.message || 'خطأ في الحفظ')

//       toast.success(isEdit ? '✏️ تم تعديل المنتج' : '✅ تم إضافة المنتج')
//       setShowForm(false)
//       fetchProducts()
//     } catch (err) {
//       toast.error('❌ فشل في الحفظ')
//       console.error(err)
//     }
//   }

//   // ✅ حذف المنتج
//   const deleteProduct = async (id) => {
//     if (!confirm('هل تريد حذف هذا المنتج؟')) return
//     try {
//       const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message)
//       toast.success(data.message)
//       fetchProducts()
//     } catch (err) {
//       toast.error('❌ فشل في حذف المنتج')
//       console.error(err)
//     }
//   }

//   // ✅ طباعة التقرير
//   const printReport = () => {
//     const w = window.open('', '', 'width=900,height=600')
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//       <head><title>تقرير المنتجات</title></head>
//       <body style="font-family: 'Tajawal'; padding: 20px;">
//         <h2 style="text-align:center; color:#0ea5e9;">تقرير المنتجات</h2>
//         <table border="1" cellspacing="0" cellpadding="5" width="100%" style="border-collapse:collapse;">
//           <thead style="background:#f3f4f6;"><tr>
//             <th>#</th><th>الاسم</th><th>الكود</th><th>الفئة</th><th>الشركة</th>
//             <th>السعر</th><th>الكمية</th><th>الانتهاء</th>
//           </tr></thead>
//           <tbody>
//             ${filtered.map((p, i) => `<tr>
//               <td>${i + 1}</td><td>${p.name}</td><td>${p.sku}</td><td>${p.category}</td><td>${p.company}</td>
//               <td>${p.price}</td><td>${p.qty}</td><td>${p.expiry?.split('T')[0] || ''}</td>
//             </tr>`).join('')}
//           </tbody>
//         </table>
//       </body></html>
//     `)
//     w.print()
//   }

//   return (
//     <Layout user={user} title="إدارة المنتجات">
//       <Toaster position="top-center" />
//       <div dir="rtl" className="space-y-6">

//         {/* الفلاتر */}
//         <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border rounded-lg shadow-sm">
//           <div className="flex flex-wrap items-center gap-2">
//             <input
//               type="text"
//               placeholder="🔍 ابحث بالاسم أو الكود أو الشركة"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value)
//                 fetchProducts(e.target.value)
//               }}
//               className="w-56 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//             />
//             <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               {categories.map((c) => <option key={c}>{c}</option>)}
//             </select>
//             <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               <option value="name-asc">الاسم ⬆️</option>
//               <option value="name-desc">الاسم ⬇️</option>
//               <option value="price-asc">السعر ⬆️</option>
//               <option value="price-desc">السعر ⬇️</option>
//             </select>
//             <label className="flex items-center gap-1 text-sm">
//               <input type="checkbox" checked={lowStock} onChange={(e) => setLowStock(e.target.checked)} /> منخفض المخزون
//             </label>
//             <label className="flex items-center gap-1 text-sm">
//               <input type="checkbox" checked={nearExpiry} onChange={(e) => setNearExpiry(e.target.checked)} /> قرب الانتهاء
//             </label>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={openAdd} className="px-4 py-2 text-sm text-white rounded-md shadow" style={{ background: theme.colors.primary }}>➕ منتج</button>
//             <button onClick={printReport} className="px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50">🖨️ طباعة</button>
//           </div>
//         </div>

//         {/* الجدول */}
//         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2 text-center">#</th>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">الكود</th>
//                 <th className="px-3 py-2">الفئة</th>
//                 <th className="px-3 py-2">السعر</th>
//                 <th className="px-3 py-2">الكمية</th>
//                 <th className="px-3 py-2">الانتهاء</th>
//                 <th className="px-3 py-2 text-center">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((p, i) => (
//                 <tr key={p.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
//                   <td className="px-3 py-2">{p.name}</td>
//                   <td className="px-3 py-2">{p.sku}</td>
//                   <td className="px-3 py-2">{p.category}</td>
//                   <td className="px-3 py-2">{p.price} ر.س</td>
//                   <td className={`px-3 py-2 ${p.qty <= p.minQty ? 'text-red-600 font-semibold' : ''}`}>{p.qty}</td>
//                   <td className={`px-3 py-2 ${isNearExpiry(p.expiry) ? 'text-amber-600' : ''}`}>{p.expiry?.split('T')[0]}</td>
//                   <td className="px-3 py-2 text-center">
//                     <div className="flex justify-center gap-1">
//                       <button onClick={() => setViewItem(p)} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">👁️</button>
//                       <button onClick={() => openEdit(p)} className="px-2 py-1 text-sm text-white rounded hover:opacity-95" style={{ background: theme.colors.secondary }}>✏️</button>
//                       <button onClick={() => deleteProduct(p.id)} className="px-2 py-1 text-sm text-red-600 bg-white border rounded hover:bg-red-50">🗑️</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {filtered.length === 0 && (
//                 <tr>
//                   <td colSpan="8" className="py-3 text-center text-gray-500 border">
//                     لا توجد منتجات
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* نافذة العرض */}
//       {viewItem && (
//         <Modal title="📦 تفاصيل المنتج" onClose={() => setViewItem(null)}>
//           <div className="grid grid-cols-2 gap-3 text-sm">
//             {Object.entries({
//               الاسم: viewItem.name,
//               الكود: viewItem.sku,
//               الفئة: viewItem.category,
//               الشركة: viewItem.company,
//               السعر: `${viewItem.price} ر.س`,
//               التكلفة: `${viewItem.cost} ر.س`,
//               الكمية: viewItem.qty,
//               'الحد الأدنى': viewItem.minQty,
//               الانتهاء: viewItem.expiry?.split('T')[0],
//             }).map(([k, v]) => (
//               <div key={k} className="p-2 border rounded-md bg-gray-50">
//                 <strong>{k}: </strong> {v}
//               </div>
//             ))}
//           </div>
//         </Modal>
//       )}

//       {/* نافذة الإضافة / التعديل */}
//       {showForm && (
//         <Modal title={isEdit ? '✏️ تعديل المنتج' : '➕ إضافة منتج'} onClose={() => setShowForm(false)}>
//           <div className="grid grid-cols-2 gap-3 text-sm">
//             {['name', 'sku', 'category', 'company', 'price', 'cost', 'qty', 'minQty', 'expiry'].map((f) => (
//               <div key={f}>
//                 <label className="block mb-1 text-gray-600">
//                   {{
//                     name: 'الاسم', sku: 'الكود', category: 'الفئة', company: 'الشركة', price: 'السعر',
//                     cost: 'التكلفة', qty: 'الكمية', minQty: 'الحد الأدنى', expiry: 'الانتهاء'
//                   }[f]}
//                 </label>
//                 <input
//                   type={f === 'expiry' ? 'date' : 'text'}
//                   value={form[f] || ''}
//                   onChange={(e) => setForm({ ...form, [f]: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-end gap-3 mt-4">
//             <button onClick={saveProduct} className="px-4 py-2 text-white rounded-md" style={{ background: theme.colors.success }}>حفظ</button>
//             <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">إلغاء</button>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }










// import { useEffect, useMemo, useState } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function ProductsPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })

//   const initialProducts = [
//     { id: 1, name: 'باراسيتامول 500mg', sku: 'PARA-500', category: 'مسكنات', price: 15, cost: 9, qty: 120, minQty: 20, expiry: '2026-02-10', company: 'GSK' },
//     { id: 2, name: 'فيتامين سي 1000mg', sku: 'VITC-1000', category: 'فيتامينات', price: 25, cost: 14, qty: 35, minQty: 10, expiry: '2025-12-15', company: 'NOW' },
//     { id: 3, name: 'أموكسيسيلين 250mg', sku: 'AMOX-250', category: 'مضادات حيوية', price: 45, cost: 28, qty: 9, minQty: 15, expiry: '2025-01-30', company: 'Pfizer' },
//     { id: 4, name: 'ايبوبروفين 400mg', sku: 'IBU-400', category: 'مسكنات', price: 30, cost: 18, qty: 60, minQty: 20, expiry: '2027-04-05', company: 'Novartis' },
//   ]

//   const [products, setProducts] = useState(initialProducts)
//   const [search, setSearch] = useState('')
//   const [category, setCategory] = useState('الكل')
//   const [sortBy, setSortBy] = useState('name-asc')
//   const [lowStock, setLowStock] = useState(false)
//   const [nearExpiry, setNearExpiry] = useState(false)
//   const [showForm, setShowForm] = useState(false)
//   const [viewItem, setViewItem] = useState(null)
//   const [form, setForm] = useState({ id: null, name: '', sku: '', category: '', company: '', price: '', cost: '', qty: '', minQty: '', expiry: '' })
//   const [isEdit, setIsEdit] = useState(false)

//   const categories = useMemo(() => ['الكل', ...new Set(products.map(p => p.category))], [products])

//   const isNearExpiry = (isoDate, days = 90) => {
//     const exp = new Date(isoDate)
//     return (exp - new Date()) / (1000 * 60 * 60 * 24) <= days
//   }

//   const filtered = useMemo(() => {
//     let list = [...products]
//     if (search) list = list.filter(p => [p.name, p.sku, p.company].some(v => v.toLowerCase().includes(search.toLowerCase())))
//     if (category !== 'الكل') list = list.filter(p => p.category === category)
//     if (lowStock) list = list.filter(p => p.qty <= p.minQty)
//     if (nearExpiry) list = list.filter(p => isNearExpiry(p.expiry))
//     if (sortBy === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name))
//     if (sortBy === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name))
//     if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price)
//     if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)
//     return list
//   }, [products, search, category, lowStock, nearExpiry, sortBy])

//   const openAdd = () => {
//     setForm({ id: null, name: '', sku: '', category: '', company: '', price: '', cost: '', qty: '', minQty: '', expiry: '' })
//     setIsEdit(false)
//     setShowForm(true)
//   }

//   const openEdit = (p) => {
//     setForm(p)
//     setIsEdit(true)
//     setShowForm(true)
//   }

//   const saveProduct = () => {
//     if (!form.name || !form.sku || !form.category) return toast.error('⚠️ أدخل الاسم والكود والفئة')
//     if (isEdit) {
//       setProducts(prev => prev.map(p => (p.id === form.id ? form : p)))
//       toast.success('✏️ تم تعديل المنتج')
//     } else {
//       setProducts(prev => [{ ...form, id: Date.now() }, ...prev])
//       toast.success('✅ تم إضافة المنتج')
//     }
//     setShowForm(false)
//   }

//   const deleteProduct = (id) => {
//     if (confirm('هل تريد حذف هذا المنتج؟')) {
//       setProducts(prev => prev.filter(p => p.id !== id))
//       toast.success('🗑️ تم حذف المنتج')
//     }
//   }

//   const printReport = () => {
//     const w = window.open('', '', 'width=900,height=600')
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//       <head><title>تقرير المنتجات</title></head>
//       <body style="font-family: 'Tajawal'; padding: 20px;">
//         <h2 style="text-align:center; color:#0ea5e9;">تقرير المنتجات</h2>
//         <table border="1" cellspacing="0" cellpadding="5" width="100%" style="border-collapse:collapse;">
//           <thead style="background:#f3f4f6;"><tr>
//             <th>#</th><th>الاسم</th><th>الكود</th><th>الفئة</th><th>الشركة</th>
//             <th>السعر</th><th>الكمية</th><th>الانتهاء</th>
//           </tr></thead>
//           <tbody>
//             ${filtered.map((p, i) => `<tr>
//               <td>${i + 1}</td><td>${p.name}</td><td>${p.sku}</td><td>${p.category}</td><td>${p.company}</td>
//               <td>${p.price}</td><td>${p.qty}</td><td>${p.expiry}</td>
//             </tr>`).join('')}
//           </tbody>
//         </table>
//       </body></html>
//     `)
//     w.print()
//   }

//   return (
//     <Layout user={user} title="إدارة المنتجات">
//       <div dir="rtl" className="space-y-6">
//         {/* الفلاتر */}
//         <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border rounded-lg shadow-sm">
//           <div className="flex flex-wrap items-center gap-2">
//             <input type="text" placeholder="🔍 ابحث بالاسم أو الكود أو الشركة"
//               value={search} onChange={(e) => setSearch(e.target.value)}
//               className="w-56 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400" />
//             <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               {categories.map((c) => <option key={c}>{c}</option>)}
//             </select>
//             <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
//               <option value="name-asc">الاسم ⬆️</option>
//               <option value="name-desc">الاسم ⬇️</option>
//               <option value="price-asc">السعر ⬆️</option>
//               <option value="price-desc">السعر ⬇️</option>
//             </select>
//             <label className="flex items-center gap-1 text-sm">
//               <input type="checkbox" checked={lowStock} onChange={(e) => setLowStock(e.target.checked)} /> منخفض المخزون
//             </label>
//             <label className="flex items-center gap-1 text-sm">
//               <input type="checkbox" checked={nearExpiry} onChange={(e) => setNearExpiry(e.target.checked)} /> قرب الانتهاء
//             </label>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={openAdd} className="px-4 py-2 text-sm text-white rounded-md shadow" style={{ background: theme.colors.primary }}>➕ منتج</button>
//             <button onClick={printReport} className="px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50">🖨️ طباعة</button>
//           </div>
//         </div>

//         {/* الجدول */}
//         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2 text-center">#</th>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">الكود</th>
//                 <th className="px-3 py-2">الفئة</th>
//                 <th className="px-3 py-2">السعر</th>
//                 <th className="px-3 py-2">الكمية</th>
//                 <th className="px-3 py-2">الانتهاء</th>
//                 <th className="px-3 py-2 text-center">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((p, i) => (
//                 <tr key={p.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
//                   <td className="px-3 py-2">{p.name}</td>
//                   <td className="px-3 py-2">{p.sku}</td>
//                   <td className="px-3 py-2">{p.category}</td>
//                   <td className="px-3 py-2">{p.price} ر.س</td>
//                   <td className={`px-3 py-2 ${p.qty <= p.minQty ? 'text-red-600 font-semibold' : ''}`}>{p.qty}</td>
//                   <td className={`px-3 py-2 ${isNearExpiry(p.expiry) ? 'text-amber-600' : ''}`}>{p.expiry}</td>
//                   <td className="px-3 py-2 text-center">
//                     <div className="flex justify-center gap-1">
//                       <button onClick={() => setViewItem(p)} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">👁️</button>
//                       <button onClick={() => openEdit(p)} className="px-2 py-1 text-sm text-white rounded hover:opacity-95" style={{ background: theme.colors.secondary }}>✏️</button>
//                       <button onClick={() => deleteProduct(p.id)} className="px-2 py-1 text-sm text-red-600 bg-white border rounded hover:bg-red-50">🗑️</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* نافذة العرض */}
//       {viewItem && (
//         <Modal title="📦 تفاصيل المنتج" onClose={() => setViewItem(null)}>
//           <div className="grid grid-cols-2 gap-3 text-sm">
//             {Object.entries({
//               الاسم: viewItem.name,
//               الكود: viewItem.sku,
//               الفئة: viewItem.category,
//               الشركة: viewItem.company,
//               السعر: `${viewItem.price} ر.س`,
//               التكلفة: `${viewItem.cost} ر.س`,
//               الكمية: viewItem.qty,
//               'الحد الأدنى': viewItem.minQty,
//               الانتهاء: viewItem.expiry,
//             }).map(([k, v]) => (
//               <div key={k} className="p-2 border rounded-md bg-gray-50">
//                 <strong>{k}: </strong> {v}
//               </div>
//             ))}
//           </div>
//         </Modal>
//       )}

//       {/* نافذة الإضافة / التعديل */}
//       {showForm && (
//         <Modal title={isEdit ? '✏️ تعديل المنتج' : '➕ إضافة منتج'} onClose={() => setShowForm(false)}>
//           <div className="grid grid-cols-2 gap-3 text-sm">
//             {['name', 'sku', 'category', 'company', 'price', 'cost', 'qty', 'minQty', 'expiry'].map((f) => (
//               <div key={f}>
//                 <label className="block mb-1 text-gray-600">
//                   {{
//                     name: 'الاسم', sku: 'الكود', category: 'الفئة', company: 'الشركة', price: 'السعر',
//                     cost: 'التكلفة', qty: 'الكمية', minQty: 'الحد الأدنى', expiry: 'الانتهاء'
//                   }[f]}
//                 </label>
//                 <input
//                   type={f === 'expiry' ? 'date' : 'text'}
//                   value={form[f]}
//                   onChange={(e) => setForm({ ...form, [f]: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-end gap-3 mt-4">
//             <button onClick={saveProduct} className="px-4 py-2 text-white rounded-md" style={{ background: theme.colors.success }}>حفظ</button>
//             <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">إلغاء</button>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }


// الفوق قبل api 










// // pages/products.js
// import { useEffect, useMemo, useState, useRef } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function ProductsPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const printRef = useRef(null)

//   const initialProducts = [
//     { id: 1, name: 'باراسيتامول 500mg', sku: 'PARA-500', category: 'مسكنات', price: 15, cost: 9, qty: 120, minQty: 20, expiry: '2026-02-10', company: 'GSK' },
//     { id: 2, name: 'فيتامين سي 1000mg', sku: 'VITC-1000', category: 'فيتامينات', price: 25, cost: 14, qty: 35, minQty: 10, expiry: '2025-12-15', company: 'NOW' },
//     { id: 3, name: 'أموكسيسيلين 250mg', sku: 'AMOX-250', category: 'مضادات حيوية', price: 45, cost: 28, qty: 9, minQty: 15, expiry: '2025-01-30', company: 'Pfizer' },
//     { id: 4, name: 'ايبوبروفين 400mg', sku: 'IBU-400', category: 'مسكنات', price: 30, cost: 18, qty: 60, minQty: 20, expiry: '2027-04-05', company: 'Novartis' },
//   ]

//   const [products, setProducts] = useState([])
//   const [search, setSearch] = useState('')
//   const [category, setCategory] = useState('all')
//   const [sortBy, setSortBy] = useState('name-asc')
//   const [onlyLowStock, setOnlyLowStock] = useState(false)
//   const [onlyNearExpiry, setOnlyNearExpiry] = useState(false)
//   const [viewItem, setViewItem] = useState(null)
//   const [showForm, setShowForm] = useState(false)
//   const [isEdit, setIsEdit] = useState(false)
//   const emptyForm = { id: null, name: '', sku: '', category: '', price: '', cost: '', qty: '', minQty: '', expiry: '', company: '' }
//   const [form, setForm] = useState(emptyForm)

//   useEffect(() => setProducts(initialProducts), [])

//   const categories = useMemo(() => {
//     const set = new Set(products.map(p => p.category).filter(Boolean))
//     return ['الكل', ...Array.from(set)]
//   }, [products])

//   const isNearExpiry = (isoDate, days = 90) => {
//     const exp = new Date(isoDate)
//     return (exp - new Date()) / (1000 * 60 * 60 * 24) <= days
//   }

//   const filtered = useMemo(() => {
//     let list = [...products]
//     const q = search.toLowerCase().trim()
//     if (q) list = list.filter(p => [p.name, p.sku, p.category, p.company].some(v => v.toLowerCase().includes(q)))
//     if (category !== 'all' && category !== 'الكل') list = list.filter(p => p.category === category)
//     if (onlyLowStock) list = list.filter(p => p.qty <= p.minQty)
//     if (onlyNearExpiry) list = list.filter(p => isNearExpiry(p.expiry))
//     return list
//   }, [products, search, category, onlyLowStock, onlyNearExpiry])

//   const openAdd = () => { setForm(emptyForm); setIsEdit(false); setShowForm(true) }
//   const openEdit = (item) => { setForm(item); setIsEdit(true); setShowForm(true) }

//   const saveForm = () => {
//     if (!form.name || !form.sku) return toast.error('⚠️ يرجى إدخال الاسم والكود')
//     if (isEdit) {
//       setProducts(prev => prev.map(p => p.id === form.id ? form : p))
//       toast.success('✏️ تم تعديل المنتج')
//     } else {
//       setProducts(prev => [{ ...form, id: Date.now() }, ...prev])
//       toast.success('✅ تم إضافة المنتج')
//     }
//     setShowForm(false)
//   }

//   const removeItem = (id) => {
//     if (confirm('هل تريد حذف هذا المنتج؟')) {
//       setProducts(prev => prev.filter(p => p.id !== id))
//       toast.success('🗑️ تم حذف المنتج')
//     }
//   }

//   const printReport = () => {
//     const w = window.open('', '', 'width=900,height=600')
//     w.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير المخزون</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px; }
//             h1 { text-align: center; color: #0ea5e9; margin-bottom: 5px; }
//             h3 { text-align: center; color: #444; margin-top: 0; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; font-size: 13px; }
//             th { background: #f3f4f6; }
//           </style>
//         </head>
//         <body>
//           <h1>💊 صيدلية المعلم</h1>
//           <h3>📦 تقرير المخزون الحالي</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th><th>الاسم</th><th>الكود</th><th>الفئة</th><th>الشركة</th>
//                 <th>السعر</th><th>الكمية</th><th>الحد الأدنى</th><th>الانتهاء</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${filtered.map((p, i) => `
//                 <tr>
//                   <td>${i + 1}</td>
//                   <td>${p.name}</td>
//                   <td>${p.sku}</td>
//                   <td>${p.category}</td>
//                   <td>${p.company}</td>
//                   <td>${p.price}</td>
//                   <td>${p.qty}</td>
//                   <td>${p.minQty}</td>
//                   <td>${p.expiry}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `)
//     w.document.close()
//     w.focus()
//     w.print()
//     w.close()
//   }

//   return (
//     <Layout user={user} title="إدارة المنتجات">
//       <div dir="rtl" className="space-y-6">
        
//         {/* 🔹 شريط الأدوات */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 ابحث بالاسم أو الكود" className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400" />
//             <div className="flex gap-2">
//               <button onClick={openAdd} className="px-4 py-2 text-sm text-white rounded-md" style={{ background: theme.colors.primary }}>➕ منتج</button>
//               <button onClick={printReport} className="px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50">🖨️ طباعة</button>
//             </div>
//           </div>
//         </div>

//         {/* 🧾 الجدول */}
//         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2 text-center">#</th>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">الكود</th>
//                 <th className="px-3 py-2">الفئة</th>
//                 <th className="px-3 py-2">السعر</th>
//                 <th className="px-3 py-2">الكمية</th>
//                 <th className="px-3 py-2">الانتهاء</th>
//                 <th className="px-3 py-2 text-center">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((p, i) => (
//                 <tr key={p.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
//                   <td className="px-3 py-2">{p.name}</td>
//                   <td className="px-3 py-2">{p.sku}</td>
//                   <td className="px-3 py-2">{p.category}</td>
//                   <td className="px-3 py-2">{p.price} ر.س</td>
//                   <td className="px-3 py-2">{p.qty}</td>
//                   <td className={`px-3 py-2 ${isNearExpiry(p.expiry) ? 'text-amber-700' : ''}`}>{p.expiry}</td>
//                   <td className="px-3 py-2 text-center">
//                     <div className="flex justify-center gap-1">
//                       <button onClick={() => setViewItem(p)} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">👁️</button>
//                       <button onClick={() => openEdit(p)} className="px-2 py-1 text-sm text-white rounded hover:opacity-95" style={{ background: theme.colors.secondary }}>✏️</button>
//                       <button onClick={() => removeItem(p.id)} className="px-2 py-1 text-sm text-red-600 bg-white border rounded hover:bg-red-50">🗑️</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Layout>
//   )
// }













// // pages/products.js
// import { useEffect, useMemo, useState } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function ProductsPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })

//   const initialProducts = [
//     { id: 1, name: 'باراسيتامول 500mg', sku: 'PARA-500', category: 'مسكنات', price: 15, cost: 9, qty: 120, minQty: 20, expiry: '2026-02-10', company: 'GSK' },
//     { id: 2, name: 'فيتامين سي 1000mg', sku: 'VITC-1000', category: 'فيتامينات', price: 25, cost: 14, qty: 35, minQty: 10, expiry: '2025-12-15', company: 'NOW' },
//     { id: 3, name: 'أموكسيسيلين 250mg', sku: 'AMOX-250', category: 'مضادات حيوية', price: 45, cost: 28, qty: 9, minQty: 15, expiry: '2025-01-30', company: 'Pfizer' },
//     { id: 4, name: 'ايبوبروفين 400mg', sku: 'IBU-400', category: 'مسكنات', price: 30, cost: 18, qty: 60, minQty: 20, expiry: '2027-04-05', company: 'Novartis' },
//   ]

//   const [products, setProducts] = useState([])
//   const [search, setSearch] = useState('')
//   const [category, setCategory] = useState('all')
//   const [sortBy, setSortBy] = useState('name-asc')
//   const [onlyLowStock, setOnlyLowStock] = useState(false)
//   const [onlyNearExpiry, setOnlyNearExpiry] = useState(false)

//   const emptyForm = { id: null, name: '', sku: '', category: '', price: '', cost: '', qty: '', minQty: '', expiry: '', company: '' }
//   const [form, setForm] = useState(emptyForm)
//   const [viewItem, setViewItem] = useState(null)
//   const [showForm, setShowForm] = useState(false)
//   const [isEdit, setIsEdit] = useState(false)

//   useEffect(() => {
//     setProducts(initialProducts)
//   }, [])

//   const categories = useMemo(() => {
//     const set = new Set(products.map(p => p.category).filter(Boolean))
//     return ['الكل', ...Array.from(set)]
//   }, [products])

//   const isNearExpiry = (isoDate, days = 90) => {
//     if (!isoDate) return false
//     const now = new Date()
//     const exp = new Date(isoDate)
//     const diff = (exp - now) / (1000 * 60 * 60 * 24)
//     return diff <= days
//   }

//   const isLowStock = (p) => Number(p.qty) <= Number(p.minQty || 0)

//   const filtered = useMemo(() => {
//     let list = [...products]
//     const q = search.trim().toLowerCase()
//     if (q) {
//       list = list.filter(p =>
//         [p.name, p.sku, p.company, p.category].some(v => String(v || '').toLowerCase().includes(q))
//       )
//     }
//     if (category !== 'all' && category !== 'الكل') list = list.filter(p => p.category === category)
//     if (onlyLowStock) list = list.filter(isLowStock)
//     if (onlyNearExpiry) list = list.filter(p => isNearExpiry(p.expiry))

//     const [key, dir] = sortBy.split('-')
//     list.sort((a, b) => {
//       const va = key === 'name' || key === 'category' || key === 'company' ? String(a[key] || '') : Number(a[key] || 0)
//       const vb = key === 'name' || key === 'category' || key === 'company' ? String(b[key] || '') : Number(b[key] || 0)
//       if (va < vb) return dir === 'asc' ? -1 : 1
//       if (va > vb) return dir === 'asc' ? 1 : -1
//       return 0
//     })
//     return list
//   }, [products, search, category, onlyLowStock, onlyNearExpiry, sortBy])

//   const openAdd = () => { setIsEdit(false); setForm(emptyForm); setShowForm(true) }
//   const openEdit = (item) => { setIsEdit(true); setForm({ ...item }); setShowForm(true) }

//   const saveForm = () => {
//     if (!form.name || !form.sku || !form.category) return toast.error('⚠️ يرجى إدخال الاسم والكود والفئة')
//     if (!isEdit) {
//       const newItem = { ...form, id: Date.now(), price: +form.price || 0, cost: +form.cost || 0, qty: +form.qty || 0, minQty: +form.minQty || 0 }
//       setProducts(prev => [newItem, ...prev])
//       toast.success('✅ تم إضافة المنتج بنجاح')
//     } else {
//       setProducts(prev => prev.map(p => p.id === form.id ? { ...form, price: +form.price, cost: +form.cost, qty: +form.qty, minQty: +form.minQty } : p))
//       toast.success('✏️ تم تعديل المنتج')
//     }
//     setShowForm(false)
//   }

//   const removeItem = (id) => {
//     if (!confirm('هل تريد حذف هذا المنتج؟')) return
//     setProducts(prev => prev.filter(p => p.id !== id))
//     toast.success('🗑️ تم حذف المنتج')
//   }

//   const exportCSV = () => {
//     const header = ['#','الاسم','الكود','الفئة','الشركة','السعر','الكمية','الحد الأدنى','تاريخ الانتهاء']
//     const rows = filtered.map((p, i) => [i+1, p.name, p.sku, p.category, p.company, p.price, p.qty, p.minQty, p.expiry])
//     const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n')
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `products_${new Date().toISOString().slice(0,10)}.csv`
//     a.click()
//     toast.success('📤 تم تصدير CSV')
//   }

//   return (
//     <Layout user={user} title="إدارة المنتجات">
//       <div dir="rtl" className="space-y-6">

//         {/* 🔹 شريط الأدوات */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <div className="grid items-end grid-cols-1 gap-3 md:grid-cols-6">
//             <div className="md:col-span-2">
//               <label className="block mb-1 text-xs text-gray-500">بحث</label>
//               <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 ابحث بالاسم / الكود ..." className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400" />
//             </div>

//             <div>
//               <label className="block mb-1 text-xs text-gray-500">الفئة</label>
//               <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400">
//                 <option value="all">الكل</option>
//                 {categories.filter(c => c !== 'الكل').map(c => (<option key={c}>{c}</option>))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 text-xs text-gray-500">الفرز</label>
//               <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400">
//                 <option value="name-asc">الاسم (أ-ي)</option>
//                 <option value="price-desc">السعر (تنازلي)</option>
//                 <option value="qty-asc">الكمية (تصاعدي)</option>
//               </select>
//             </div>

//             <div className="flex items-center gap-3">
//               <label className="flex items-center gap-2 text-xs">
//                 <input type="checkbox" checked={onlyLowStock} onChange={(e) => setOnlyLowStock(e.target.checked)} />
//                 منخفض المخزون
//               </label>
//               <label className="flex items-center gap-2 text-xs">
//                 <input type="checkbox" checked={onlyNearExpiry} onChange={(e) => setOnlyNearExpiry(e.target.checked)} />
//                 قرب الانتهاء
//               </label>
//             </div>

//             <div className="flex justify-end gap-2 md:col-span-2">
//               <button onClick={openAdd} className="px-3 py-2 text-sm text-white rounded-md shadow-sm hover:opacity-95" style={{ backgroundColor: theme.colors.primary }}>➕ منتج</button>
//               <button onClick={exportCSV} className="px-3 py-2 text-sm bg-white border rounded-md hover:bg-gray-50">📤 تصدير</button>
//             </div>
//           </div>
//         </div>

//         {/* 🔸 جدول سطح المكتب */}
//         <div className="hidden overflow-x-auto bg-white border rounded-lg shadow-sm md:block">
//           <table className="w-full text-sm text-right">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2 text-center">#</th>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">الكود</th>
//                 <th className="px-3 py-2">الفئة</th>
//                 <th className="px-3 py-2">الشركة</th>
//                 <th className="px-3 py-2">السعر</th>
//                 <th className="px-3 py-2">الكمية</th>
//                 <th className="px-3 py-2">الحد الأدنى</th>
//                 <th className="px-3 py-2">الانتهاء</th>
//                 <th className="px-3 py-2">إجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length ? filtered.map((p, index) => (
//                 <tr key={p.id} className="relative border-t hover:bg-gray-50">
//                   <td className="px-3 py-2 text-center text-gray-400">{index + 1}</td>
//                   <td className="px-3 py-2 font-medium text-gray-800">{p.name}</td>
//                   <td className="px-3 py-2">{p.sku}</td>
//                   <td className="px-3 py-2">{p.category}</td>
//                   <td className="px-3 py-2">{p.company}</td>
//                   <td className="px-3 py-2">{p.price} ر.س</td>
//                   <td className="px-3 py-2">{p.qty}</td>
//                   <td className="px-3 py-2">{p.minQty}</td>
//                   <td className={`px-3 py-2 ${isNearExpiry(p.expiry) ? 'text-amber-700' : ''}`}>{p.expiry}</td>

//                   {/* ✅ أزرار الإجراءات */}
//                   <td className="px-3 py-2 text-center">
//                     <div className="flex flex-wrap justify-center gap-1">
//                       <button
//                         type="button"
//                         onClick={(e) => { e.stopPropagation(); setTimeout(() => setViewItem(p), 50) }}
//                         className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50"
//                       >
//                         👁️
//                       </button>
//                       <button
//                         type="button"
//                         onClick={(e) => { e.stopPropagation(); setTimeout(() => openEdit(p), 50) }}
//                         className="px-2 py-1 text-sm text-white rounded hover:opacity-95"
//                         style={{ background: theme.colors.secondary }}
//                       >
//                         ✏️
//                       </button>
//                       <button
//                         type="button"
//                         onClick={(e) => { e.stopPropagation(); removeItem(p.id) }}
//                         className="px-2 py-1 text-sm text-red-600 bg-white border rounded hover:bg-red-50"
//                       >
//                         🗑️
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )) : (
//                 <tr><td colSpan="10" className="py-6 text-center text-gray-500">لا توجد نتائج</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* 🔹 بطاقات الجوال */}
//         <div className="grid grid-cols-1 gap-3 md:hidden">
//           {filtered.map((p, index) => (
//             <div key={p.id} className="relative p-4 bg-white border rounded-lg shadow-sm">
//               <div className="absolute text-xs text-gray-400 top-2 left-2">#{index + 1}</div>
//               <h4 className="text-base font-semibold">{p.name}</h4>
//               <p className="text-xs text-gray-500">{p.sku} • {p.category} • {p.company}</p>
//               <p className="mt-1 text-sm font-semibold text-sky-700">{p.price} ر.س</p>
//               <div className="flex gap-2 mt-3">
//                 <button onClick={() => setViewItem(p)} className="flex-1 py-2 text-sm bg-white border rounded hover:bg-gray-50">👁️ عرض</button>
//                 <button onClick={() => openEdit(p)} className="flex-1 py-2 text-sm text-white rounded hover:opacity-95" style={{ background: theme.colors.secondary }}>✏️ تعديل</button>
//                 <button onClick={() => removeItem(p.id)} className="flex-1 py-2 text-sm text-red-600 bg-white border rounded hover:bg-red-50">🗑️ حذف</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* مودالات */}
//       {viewItem && (
//         <Modal title={`عرض المنتج: ${viewItem.name}`} onClose={() => setViewItem(null)}>
//           <div className="space-y-2 text-sm">
//             <Row label="الكود">{viewItem.sku}</Row>
//             <Row label="الفئة">{viewItem.category}</Row>
//             <Row label="الشركة">{viewItem.company}</Row>
//             <Row label="السعر">{Number(viewItem.price).toFixed(2)} ر.س</Row>
//             <Row label="الكمية">{viewItem.qty}</Row>
//             <Row label="الحد الأدنى">{viewItem.minQty}</Row>
//             <Row label="تاريخ الانتهاء" danger={isNearExpiry(viewItem.expiry)}>{viewItem.expiry}</Row>
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <button onClick={() => { setViewItem(null); openEdit(viewItem) }} className="px-4 py-2 text-sm text-white rounded" style={{ background: theme.colors.secondary }}>✏️ تعديل</button>
//             <button onClick={() => setViewItem(null)} className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200">إغلاق</button>
//           </div>
//         </Modal>
//       )}

//       {showForm && (
//         <Modal title={isEdit ? 'تعديل منتج' : 'إضافة منتج'} onClose={() => setShowForm(false)}>
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//             <Field label="اسم المنتج"><input className="w-full px-3 py-2 border rounded-md" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
//             <Field label="الكود (SKU)"><input className="w-full px-3 py-2 border rounded-md" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></Field>
//             <Field label="الفئة"><input className="w-full px-3 py-2 border rounded-md" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
//             <Field label="الشركة"><input className="w-full px-3 py-2 border rounded-md" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
//             <Field label="السعر"><input type="number" className="w-full px-3 py-2 border rounded-md" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
//             <Field label="الكمية"><input type="number" className="w-full px-3 py-2 border rounded-md" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></Field>
//             <Field label="الحد الأدنى"><input type="number" className="w-full px-3 py-2 border rounded-md" value={form.minQty} onChange={(e) => setForm({ ...form, minQty: e.target.value })} /></Field>
//             <Field label="تاريخ الانتهاء"><input type="date" className="w-full px-3 py-2 border rounded-md" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} /></Field>
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <button onClick={saveForm} className="px-4 py-2 text-sm text-white rounded hover:opacity-95" style={{ background: theme.colors.primary }}>💾 حفظ</button>
//             <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200">إلغاء</button>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }

// // 🧩 مكونات صغيرة
// function Field({ label, children }) {
//   return (
//     <label className="block text-sm">
//       <span className="block mb-1 text-gray-600">{label}</span>
//       {children}
//     </label>
//   )
// }

// function Row({ label, children, danger }) {
//   return (
//     <div className="flex items-center justify-between gap-4">
//       <span className="text-gray-500">{label}</span>
//       <span className={`font-medium ${danger ? 'text-amber-700' : 'text-gray-800'}`}>{children}</span>
//     </div>
//   )
// }










// // pages/products.js
// import { useEffect, useMemo, useState } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function ProductsPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })

//   // ---------- بيانات مبدئية ----------
//   const initialProducts = [
//     { id: 1, name: 'باراسيتامول 500mg', sku: 'PARA-500', category: 'مسكنات', price: 15, cost: 9, qty: 120, minQty: 20, expiry: '2026-02-10', company: 'GSK' },
//     { id: 2, name: 'فيتامين سي 1000mg', sku: 'VITC-1000', category: 'فيتامينات', price: 25, cost: 14, qty: 35, minQty: 10, expiry: '2025-12-15', company: 'NOW' },
//     { id: 3, name: 'أموكسيسيلين 250mg', sku: 'AMOX-250', category: 'مضادات حيوية', price: 45, cost: 28, qty: 9, minQty: 15, expiry: '2025-01-30', company: 'Pfizer' },
//     { id: 4, name: 'ايبوبروفين 400mg', sku: 'IBU-400', category: 'مسكنات', price: 30, cost: 18, qty: 60, minQty: 20, expiry: '2027-04-05', company: 'Novartis' },
//   ]

//   // ---------- الحالة ----------
//   const [products, setProducts] = useState([])
//   const [search, setSearch] = useState('')
//   const [category, setCategory] = useState('all')
//   const [sortBy, setSortBy] = useState('name-asc') // name-asc | price-desc | qty-asc ...
//   const [onlyLowStock, setOnlyLowStock] = useState(false)
//   const [onlyNearExpiry, setOnlyNearExpiry] = useState(false)

//   // نماذج / مودالات
//   const emptyForm = { id: null, name: '', sku: '', category: '', price: '', cost: '', qty: '', minQty: '', expiry: '', company: '' }
//   const [form, setForm] = useState(emptyForm)
//   const [viewItem, setViewItem] = useState(null)
//   const [showForm, setShowForm] = useState(false) // إضافة/تعديل
//   const [isEdit, setIsEdit] = useState(false)

//   useEffect(() => {
//     setProducts(initialProducts)
//   }, [])

//   // ---------- المساعدة ----------
//   const categories = useMemo(() => {
//     const set = new Set(products.map(p => p.category).filter(Boolean))
//     return ['الكل', ...Array.from(set)]
//   }, [products])

//   const isNearExpiry = (isoDate, days = 90) => {
//     if (!isoDate) return false
//     const now = new Date()
//     const exp = new Date(isoDate)
//     const diff = (exp - now) / (1000 * 60 * 60 * 24)
//     return diff <= days
//   }

//   const isLowStock = (p) => Number(p.qty) <= Number(p.minQty || 0)

//   // ---------- الفلترة + الفرز ----------
//   const filtered = useMemo(() => {
//     let list = [...products]

//     // بحث
//     const q = search.trim().toLowerCase()
//     if (q) {
//       list = list.filter(p =>
//         [p.name, p.sku, p.company, p.category].some(v => String(v || '').toLowerCase().includes(q))
//       )
//     }

//     // الفئة
//     if (category !== 'all' && category !== 'الكل') {
//       list = list.filter(p => p.category === category)
//     }

//     // فقط منخفض المخزون
//     if (onlyLowStock) {
//       list = list.filter(isLowStock)
//     }

//     // قرب الانتهاء
//     if (onlyNearExpiry) {
//       list = list.filter(p => isNearExpiry(p.expiry))
//     }

//     // الفرز
//     const [key, dir] = sortBy.split('-') // name-asc / qty-desc / price-asc
//     list.sort((a, b) => {
//       const va = key === 'name' || key === 'category' || key === 'company' ? String(a[key] || '') : Number(a[key] || 0)
//       const vb = key === 'name' || key === 'category' || key === 'company' ? String(b[key] || '') : Number(b[key] || 0)
//       if (va < vb) return dir === 'asc' ? -1 : 1
//       if (va > vb) return dir === 'asc' ? 1 : -1
//       return 0
//     })

//     return list
//   }, [products, search, category, onlyLowStock, onlyNearExpiry, sortBy])

//   // ---------- الإجراءات ----------
//   const openAdd = () => {
//     setIsEdit(false)
//     setForm(emptyForm)
//     setShowForm(true)
//   }

//   const openEdit = (item) => {
//     setIsEdit(true)
//     setForm({ ...item })
//     setShowForm(true)
//   }

//   const saveForm = () => {
//     // تحقق بدائي
//     if (!form.name || !form.sku || !form.category) {
//       toast.error('⚠️ يرجى إدخال الاسم والكود والفئة')
//       return
//     }
//     if (!isEdit) {
//       const newItem = { ...form, id: Date.now(), price: Number(form.price || 0), cost: Number(form.cost || 0), qty: Number(form.qty || 0), minQty: Number(form.minQty || 0) }
//       setProducts(prev => [newItem, ...prev])
//       toast.success('✅ تم إضافة المنتج بنجاح')
//     } else {
//       setProducts(prev => prev.map(p => (p.id === form.id ? { ...form, price: Number(form.price || 0), cost: Number(form.cost || 0), qty: Number(form.qty || 0), minQty: Number(form.minQty || 0) } : p)))
//       toast.success('✏️ تم تعديل المنتج')
//     }
//     setShowForm(false)
//   }

//   const removeItem = (id) => {
//     if (!confirm('هل تريد حذف هذا المنتج؟')) return
//     setProducts(prev => prev.filter(p => p.id !== id))
//     toast.success('🗑️ تم حذف المنتج')
//   }

//   const exportCSV = () => {
//     const headers = ['name,sku,category,company,price,cost,qty,minQty,expiry']
//     const rows = filtered.map(p => [
//       p.name, p.sku, p.category, p.company, p.price, p.cost, p.qty, p.minQty, p.expiry
//     ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
//     const csv = [headers.join(','), ...rows].join('\n')
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `products_${new Date().toISOString().slice(0,10)}.csv`
//     a.click()
//     URL.revokeObjectURL(url)
//     toast.success('📤 تم تصدير CSV')
//   }

//   // ---------- العرض ----------
//   return (
//     <Layout user={user} title="إدارة المنتجات">
//       <div dir="rtl" className="space-y-6">

//         {/* شريط الأدوات */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <div className="grid items-end grid-cols-1 gap-3 md:grid-cols-6">
//             <div className="md:col-span-2">
//               <label className="block mb-1 text-xs text-gray-500">بحث</label>
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="🔍 ابحث بالاسم / الكود / الشركة ..."
//                 className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-1 text-xs text-gray-500">الفئة</label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//               >
//                 <option value="all">الكل</option>
//                 {categories.filter(c => c !== 'الكل').map(c => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 text-xs text-gray-500">الفرز</label>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//               >
//                 <option value="name-asc">الاسم (أ-ي)</option>
//                 <option value="name-desc">الاسم (ي-أ)</option>
//                 <option value="price-asc">السعر (تصاعدي)</option>
//                 <option value="price-desc">السعر (تنازلي)</option>
//                 <option value="qty-asc">الكمية (تصاعدي)</option>
//                 <option value="qty-desc">الكمية (تنازلي)</option>
//                 <option value="expiry-asc">الأقرب انتهاء</option>
//                 <option value="expiry-desc">الأبعد انتهاء</option>
//                 <option value="company-asc">الشركة (أ-ي)</option>
//                 <option value="company-desc">الشركة (ي-أ)</option>
//               </select>
//             </div>

//             <div className="flex items-center gap-3">
//               <label className="flex items-center gap-2 text-xs">
//                 <input type="checkbox" checked={onlyLowStock} onChange={(e) => setOnlyLowStock(e.target.checked)} />
//                 مخزون منخفض
//               </label>
//               <label className="flex items-center gap-2 text-xs">
//                 <input type="checkbox" checked={onlyNearExpiry} onChange={(e) => setOnlyNearExpiry(e.target.checked)} />
//                 قرب انتهاء (≤ 90 يوم)
//               </label>
//             </div>

//             <div className="flex flex-wrap justify-end gap-2 md:col-span-2">
//               <button
//                 onClick={openAdd}
//                 className="px-3 py-2 text-sm text-white rounded-md shadow-sm hover:opacity-95"
//                 style={{ backgroundColor: theme.colors.primary }}
//                 title="إضافة منتج"
//               >
//                 ➕ منتج جديد
//               </button>
//               <button
//                 onClick={exportCSV}
//                 className="px-3 py-2 text-sm bg-white border rounded-md hover:bg-gray-50"
//                 title="تصدير CSV"
//               >
//                 📤 تصدير
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* جدول / بطاقات المنتجات */}
//         <div className="p-0 bg-transparent border-none">
//           {/* سطح مكتب: جدول */}
//           <div className="hidden overflow-x-auto bg-white border rounded-lg shadow-sm md:block">
//             <table className="w-full text-sm text-right">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">الاسم</th>
//                   <th className="px-3 py-2">الكود</th>
//                   <th className="px-3 py-2">الفئة</th>
//                   <th className="px-3 py-2">الشركة</th>
//                   <th className="px-3 py-2">السعر</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">الحد الأدنى</th>
//                   <th className="px-3 py-2">الانتهاء</th>
//                   <th className="px-3 py-2">إجراءات</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.length ? filtered.map((p) => (
//                   <tr key={p.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">
//                       <div className="flex items-center gap-2">
//                         <span className="font-medium text-gray-800">{p.name}</span>
//                         {isLowStock(p) && <span className="px-2 text-xs text-red-700 bg-red-100 rounded">منخفض</span>}
//                         {isNearExpiry(p.expiry) && <span className="px-2 text-xs rounded text-amber-700 bg-amber-100">قرب الانتهاء</span>}
//                       </div>
//                     </td>
//                     <td className="px-3 py-2">{p.sku}</td>
//                     <td className="px-3 py-2">{p.category}</td>
//                     <td className="px-3 py-2">{p.company}</td>
//                     <td className="px-3 py-2">{Number(p.price).toFixed(2)} ر.س</td>
//                     <td className="px-3 py-2">{p.qty}</td>
//                     <td className="px-3 py-2">{p.minQty}</td>
//                     <td className={`px-3 py-2 ${isNearExpiry(p.expiry) ? 'text-amber-700' : ''}`}>{p.expiry}</td>
//                     <td className="px-3 py-2">
//                       <div className="flex gap-2">
//                         <button onClick={() => setViewItem(p)} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">👁️ عرض</button>
//                         <button onClick={() => openEdit(p)} className="px-2 py-1 text-sm text-white rounded hover:opacity-95" style={{ background: theme.colors.secondary }}>✏️ تعديل</button>
//                         <button onClick={() => removeItem(p.id)} className="px-2 py-1 text-sm text-red-600 bg-white border rounded hover:bg-red-50">🗑️ حذف</button>
//                       </div>
//                     </td>
//                   </tr>
//                 )) : (
//                   <tr>
//                     <td colSpan="9" className="py-6 text-center text-gray-500">لا توجد نتائج مطابقة</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* جوال: بطاقات */}
//           <div className="grid grid-cols-1 gap-3 md:hidden">
//             {filtered.length ? filtered.map(p => (
//               <div key={p.id} className="p-4 bg-white border rounded-lg shadow-sm">
//                 <div className="flex items-start justify-between gap-2">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <h4 className="text-base font-semibold text-gray-800">{p.name}</h4>
//                       {isLowStock(p) && <span className="px-2 text-xs text-red-700 bg-red-100 rounded">منخفض</span>}
//                       {isNearExpiry(p.expiry) && <span className="px-2 text-xs rounded text-amber-700 bg-amber-100">قرب الانتهاء</span>}
//                     </div>
//                     <p className="text-xs text-gray-500 mt-0.5">الكود: {p.sku} • {p.category} • {p.company}</p>
//                   </div>
//                   <span className="text-sm font-semibold text-sky-700">{Number(p.price).toFixed(2)} ر.س</span>
//                 </div>

//                 <div className="grid grid-cols-3 gap-3 mt-3 text-center">
//                   <div className="p-2 rounded bg-gray-50">
//                     <div className="text-[11px] text-gray-500">الكمية</div>
//                     <div className="text-sm font-semibold">{p.qty}</div>
//                   </div>
//                   <div className="p-2 rounded bg-gray-50">
//                     <div className="text-[11px] text-gray-500">الحد الأدنى</div>
//                     <div className="text-sm font-semibold">{p.minQty}</div>
//                   </div>
//                   <div className="p-2 rounded bg-gray-50">
//                     <div className="text-[11px] text-gray-500">الإنتهاء</div>
//                     <div className={`text-sm font-semibold ${isNearExpiry(p.expiry) ? 'text-amber-700' : ''}`}>{p.expiry}</div>
//                   </div>
//                 </div>

//                 <div className="flex gap-2 mt-3">
//                   <button onClick={() => setViewItem(p)} className="flex-1 py-2 text-sm bg-white border rounded hover:bg-gray-50">👁️ عرض</button>
//                   <button onClick={() => openEdit(p)} className="flex-1 py-2 text-sm text-white rounded hover:opacity-95" style={{ background: theme.colors.secondary }}>✏️ تعديل</button>
//                   <button onClick={() => removeItem(p.id)} className="flex-1 py-2 text-sm text-red-600 bg-white border rounded hover:bg-red-50">🗑️ حذف</button>
//                 </div>
//               </div>
//             )) : (
//               <div className="p-6 text-center text-gray-500 bg-white border rounded-lg shadow-sm">لا توجد نتائج مطابقة</div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* مودال العرض */}
//       {viewItem && (
//         <Modal title={`عرض المنتج: ${viewItem.name}`} onClose={() => setViewItem(null)}>
//           <div className="space-y-2 text-sm">
//             <Row label="الكود">{viewItem.sku}</Row>
//             <Row label="الفئة">{viewItem.category}</Row>
//             <Row label="الشركة">{viewItem.company}</Row>
//             <Row label="السعر">{Number(viewItem.price).toFixed(2)} ر.س</Row>
//             <Row label="التكلفة">{Number(viewItem.cost).toFixed(2)} ر.س</Row>
//             <Row label="الكمية">{viewItem.qty}</Row>
//             <Row label="الحد الأدنى">{viewItem.minQty}</Row>
//             <Row label="تاريخ الانتهاء" danger={isNearExpiry(viewItem.expiry)}>{viewItem.expiry}</Row>
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <button onClick={() => { setViewItem(null); openEdit(viewItem) }} className="px-4 py-2 text-sm text-white rounded" style={{ background: theme.colors.secondary }}>✏️ تعديل</button>
//             <button onClick={() => setViewItem(null)} className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200">إغلاق</button>
//           </div>
//         </Modal>
//       )}

//       {/* مودال إضافة/تعديل */}
//       {showForm && (
//         <Modal title={isEdit ? 'تعديل منتج' : 'إضافة منتج'} onClose={() => setShowForm(false)}>
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//             <Field label="اسم المنتج">
//               <input className="w-full px-3 py-2 border rounded-md" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//             </Field>
//             <Field label="الكود (SKU)">
//               <input className="w-full px-3 py-2 border rounded-md" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
//             </Field>
//             <Field label="الفئة">
//               <input className="w-full px-3 py-2 border rounded-md" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="مثال: مسكنات / فيتامينات" />
//             </Field>
//             <Field label="الشركة">
//               <input className="w-full px-3 py-2 border rounded-md" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
//             </Field>
//             <Field label="السعر">
//               <input type="number" className="w-full px-3 py-2 border rounded-md" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
//             </Field>
//             <Field label="التكلفة">
//               <input type="number" className="w-full px-3 py-2 border rounded-md" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
//             </Field>
//             <Field label="الكمية">
//               <input type="number" className="w-full px-3 py-2 border rounded-md" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
//             </Field>
//             <Field label="الحد الأدنى">
//               <input type="number" className="w-full px-3 py-2 border rounded-md" value={form.minQty} onChange={(e) => setForm({ ...form, minQty: e.target.value })} />
//             </Field>
//             <Field label="تاريخ الانتهاء">
//               <input type="date" className="w-full px-3 py-2 border rounded-md" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
//             </Field>
//           </div>

//           <div className="flex justify-between mt-5">
//             <div className="text-xs text-gray-500">
//               {isLowStock(form) && <span className="px-2 py-1 mr-1 text-red-700 bg-red-100 rounded">⚠️ مخزون منخفض</span>}
//               {isNearExpiry(form.expiry) && <span className="px-2 py-1 rounded text-amber-700 bg-amber-100">⏳ قرب الانتهاء</span>}
//             </div>
//             <div className="flex gap-2">
//               <button onClick={saveForm} className="px-4 py-2 text-white rounded hover:opacity-95" style={{ background: theme.colors.primary }}>حفظ</button>
//               <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">إلغاء</button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }

// // عناصر صغيرة قابلة لإعادة الاستخدام
// function Field({ label, children }) {
//   return (
//     <label className="block text-sm">
//       <span className="block mb-1 text-gray-600">{label}</span>
//       {children}
//     </label>
//   )
// }

// function Row({ label, children, danger }) {
//   return (
//     <div className="flex items-center justify-between gap-4">
//       <span className="text-gray-500">{label}</span>
//       <span className={`font-medium ${danger ? 'text-amber-700' : 'text-gray-800'}`}>{children}</span>
//     </div>
//   )
// }














// // pages/products.js
// import { useEffect, useMemo, useState } from 'react'
// import Layout from '../components/Layout'
// import Modal from '../components/Modal'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// const CATEGORIES = ['مسكنات', 'مضادّات حيوية', 'فيتامينات', 'مراهم', 'شراب أطفال', 'أخرى']

// function isExpired(dateStr) {
//   if (!dateStr) return false
//   const d = new Date(dateStr)
//   const today = new Date()
//   d.setHours(0,0,0,0)
//   today.setHours(0,0,0,0)
//   return d < today
// }

// function willExpireSoon(dateStr, days = 30) {
//   if (!dateStr) return false
//   const d = new Date(dateStr)
//   const today = new Date()
//   const limit = new Date()
//   limit.setDate(today.getDate() + days)
//   d.setHours(0,0,0,0)
//   limit.setHours(0,0,0,0)
//   return d >= today && d <= limit
// }

// function toCSV(rows) {
//   const header = [
//     'الباركود',
//     'الاسم التجاري',
//     'الاسم العلمي',
//     'الشركة',
//     'الفئة',
//     'سعر الشراء',
//     'سعر البيع',
//     'الكمية',
//     'حد إعادة الطلب',
//     'تاريخ الانتهاء',
//   ]
//   const lines = rows.map(r => [
//     r.barcode,
//     r.tradeName,
//     r.scientificName,
//     r.manufacturer,
//     r.category,
//     r.buyPrice,
//     r.sellPrice,
//     r.qty,
//     r.reorderLevel,
//     r.expiry,
//   ].map(v => `"${(v ?? '').toString().replace(/"/g,'""')}"`).join(','))
//   return [header.join(','), ...lines].join('\n')
// }

// export default function Products() {
//   const [user] = useState({ name: 'صيدلية المعلم', role: 'pharmacist' })

//   // بيانات مبدئية
//   const [products, setProducts] = useState([])
//   useEffect(() => {
//     const seed = [
//       {
//         id: 1,
//         barcode: '6291001000011',
//         tradeName: 'باراسيتامول 500mg',
//         scientificName: 'Paracetamol',
//         manufacturer: 'GSK',
//         category: 'مسكنات',
//         buyPrice: 8,
//         sellPrice: 15,
//         qty: 24,
//         reorderLevel: 10,
//         expiry: '2026-02-10',
//         location: 'رف A1',
//       },
//       {
//         id: 2,
//         barcode: '6291001000028',
//         tradeName: 'أموكسيسيلين 250mg',
//         scientificName: 'Amoxicillin',
//         manufacturer: 'Pfizer',
//         category: 'مضادّات حيوية',
//         buyPrice: 28,
//         sellPrice: 45,
//         qty: 6,
//         reorderLevel: 12,
//         expiry: '2025-11-20',
//         location: 'رف B2',
//       },
//       {
//         id: 3,
//         barcode: '6291001000035',
//         tradeName: 'فيتامين سي 1000mg',
//         scientificName: 'Vitamin C',
//         manufacturer: 'NOW',
//         category: 'فيتامينات',
//         buyPrice: 14,
//         sellPrice: 25,
//         qty: 2,
//         reorderLevel: 8,
//         expiry: '2025-12-05',
//         location: 'رف C3',
//       },
//       {
//         id: 4,
//         barcode: '6291001000042',
//         tradeName: 'ايبوبروفين 400mg',
//         scientificName: 'Ibuprofen',
//         manufacturer: 'Novartis',
//         category: 'مسكنات',
//         buyPrice: 18,
//         sellPrice: 30,
//         qty: 40,
//         reorderLevel: 15,
//         expiry: '2027-03-01',
//         location: 'رف A2',
//       },
//     ]
//     setProducts(seed)
//   }, [])

//   // فلترة متقدمة
//   const [search, setSearch] = useState('')
//   const [category, setCategory] = useState('')
//   const [stockState, setStockState] = useState('all') // all | low | ok
//   const [expiryState, setExpiryState] = useState('all') // all | expired | soon
//   const [expiryFrom, setExpiryFrom] = useState('')
//   const [expiryTo, setExpiryTo] = useState('')

//   const filtered = useMemo(() => {
//     return products.filter(p => {
//       const q = search.trim().toLowerCase()
//       const matchText = !q || [
//         p.tradeName, p.scientificName, p.manufacturer, p.barcode, p.category, p.location
//       ].some(v => (v || '').toLowerCase().includes(q))

//       const matchCat = !category || p.category === category

//       const low = p.qty <= (p.reorderLevel ?? 0)
//       const matchStock =
//         stockState === 'all' ? true :
//         stockState === 'low' ? low :
//         !low

//       const expired = isExpired(p.expiry)
//       const soon = willExpireSoon(p.expiry, 30)
//       const matchExpiryFlag =
//         expiryState === 'all' ? true :
//         expiryState === 'expired' ? expired :
//         expiryState === 'soon' ? soon : true

//       const inRange =
//         (!expiryFrom || new Date(p.expiry) >= new Date(expiryFrom)) &&
//         (!expiryTo || new Date(p.expiry) <= new Date(expiryTo))

//       return matchText && matchCat && matchStock && matchExpiryFlag && inRange
//     })
//   }, [products, search, category, stockState, expiryState, expiryFrom, expiryTo])

//   // عرض/إضافة/تعديل/حذف
//   const emptyForm = {
//     barcode: '',
//     tradeName: '',
//     scientificName: '',
//     manufacturer: '',
//     category: '',
//     buyPrice: '',
//     sellPrice: '',
//     qty: '',
//     reorderLevel: '',
//     expiry: '',
//     location: '',
//   }
//   const [showView, setShowView] = useState(null)        // كائن المنتج أو null
//   const [showForm, setShowForm] = useState(false)
//   const [editItem, setEditItem] = useState(null)
//   const [form, setForm] = useState(emptyForm)

//   const openAdd = () => {
//     setEditItem(null)
//     setForm(emptyForm)
//     setShowForm(true)
//   }

//   const openEdit = (item) => {
//     setEditItem(item)
//     setForm({
//       barcode: item.barcode || '',
//       tradeName: item.tradeName || '',
//       scientificName: item.scientificName || '',
//       manufacturer: item.manufacturer || '',
//       category: item.category || '',
//       buyPrice: item.buyPrice ?? '',
//       sellPrice: item.sellPrice ?? '',
//       qty: item.qty ?? '',
//       reorderLevel: item.reorderLevel ?? '',
//       expiry: item.expiry || '',
//       location: item.location || '',
//     })
//     setShowForm(true)
//   }

//   const saveForm = () => {
//     // تحقّق أساسي
//     if (!form.tradeName || !form.sellPrice || !form.qty) {
//       toast.error('⚠️ يرجى إدخال اسم المنتج وسعر البيع والكمية')
//       return
//     }
//     // تحويلات أرقام
//     const payload = {
//       ...form,
//       buyPrice: Number(form.buyPrice) || 0,
//       sellPrice: Number(form.sellPrice) || 0,
//       qty: Number(form.qty) || 0,
//       reorderLevel: Number(form.reorderLevel) || 0,
//     }

//     if (editItem) {
//       setProducts(prev => prev.map(p => p.id === editItem.id ? { ...p, ...payload } : p))
//       toast.success('✅ تم تحديث المنتج بنجاح')
//     } else {
//       const id = Date.now()
//       setProducts(prev => [{ id, ...payload }, ...prev])
//       toast.success('✅ تم إضافة المنتج بنجاح')
//     }
//     setShowForm(false)
//     setEditItem(null)
//     setForm(emptyForm)
//   }

//   const removeItem = (id) => {
//     if (!confirm('هل تريد حذف هذا المنتج؟')) return
//     setProducts(prev => prev.filter(p => p.id !== id))
//     toast.success('🗑️ تم حذف المنتج')
//   }

//   // تصدير CSV
//   const exportCSV = () => {
//     try {
//       const csv = toCSV(filtered)
//       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = `products_${new Date().toISOString().slice(0,10)}.csv`
//       a.click()
//       URL.revokeObjectURL(url)
//       toast.success('📤 تم تصدير CSV بنجاح')
//     } catch (e) {
//       toast.error('❌ فشل تصدير CSV')
//     }
//   }

//   const rowBadge = (p) => {
//     if (isExpired(p.expiry)) {
//       return <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-white bg-red-600 rounded">منتهي</span>
//     }
//     if (willExpireSoon(p.expiry, 30)) {
//       return <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-amber-800 bg-amber-100 rounded">قرب الانتهاء</span>
//     }
//     if (p.qty <= (p.reorderLevel ?? 0)) {
//       return <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-orange-800 bg-orange-100 rounded">نقص مخزون</span>
//     }
//     return null
//   }

//   return (
//     <Layout user={user} title="إدارة المنتجات">
//       <div dir="rtl" className="space-y-6">
//         {/* شريط تحكم علوي */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <div className="flex flex-col gap-3 lg:items-end lg:flex-row">
//             <input
//               dir="rtl"
//               type="text"
//               placeholder="🔍 ابحث بالاسم/العلمي/الشركة/الباركود..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//             />

//             <div className="flex flex-wrap gap-2">
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="px-3 py-2 text-sm border rounded-md"
//               >
//                 <option value="">كل الفئات</option>
//                 {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>

//               <select
//                 value={stockState}
//                 onChange={(e) => setStockState(e.target.value)}
//                 className="px-3 py-2 text-sm border rounded-md"
//               >
//                 <option value="all">كل المخزون</option>
//                 <option value="low">نقص مخزون</option>
//                 <option value="ok">مخزون كافٍ</option>
//               </select>

//               <select
//                 value={expiryState}
//                 onChange={(e) => setExpiryState(e.target.value)}
//                 className="px-3 py-2 text-sm border rounded-md"
//               >
//                 <option value="all">كل الصلاحيات</option>
//                 <option value="expired">منتهٍ</option>
//                 <option value="soon">قرب الانتهاء (30 يوم)</option>
//               </select>

//               <input
//                 type="date"
//                 value={expiryFrom}
//                 onChange={(e) => setExpiryFrom(e.target.value)}
//                 className="px-3 py-2 text-sm border rounded-md"
//                 title="من تاريخ صلاحية"
//               />
//               <input
//                 type="date"
//                 value={expiryTo}
//                 onChange={(e) => setExpiryTo(e.target.value)}
//                 className="px-3 py-2 text-sm border rounded-md"
//                 title="إلى تاريخ صلاحية"
//               />
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2 mt-3">
//             <button
//               onClick={openAdd}
//               className="px-4 py-2 text-sm text-white rounded-md shadow-sm hover:opacity-95"
//               style={{ background: theme.colors.primary }}
//             >
//               ➕ منتج جديد
//             </button>
//             <button
//               onClick={exportCSV}
//               className="px-4 py-2 text-sm text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700"
//             >
//               📤 تصدير CSV
//             </button>
//           </div>
//         </div>

//         {/* جدول المنتجات */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-lg font-semibold text-gray-700">قائمة المنتجات</h3>
//             <span className="text-sm text-gray-500">الإجمالي: {filtered.length}</span>
//           </div>

//           <div className="w-full overflow-x-auto">
//             <table className="w-full text-sm text-right border-t border-gray-100 min-w-[900px]">
//               <thead className="text-gray-600 bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2">#</th>
//                   <th className="px-3 py-2">الاسم التجاري</th>
//                   <th className="px-3 py-2">العلمي</th>
//                   <th className="px-3 py-2">الشركة</th>
//                   <th className="px-3 py-2">الفئة</th>
//                   <th className="px-3 py-2">الباركود</th>
//                   <th className="px-3 py-2">شراء</th>
//                   <th className="px-3 py-2">بيع</th>
//                   <th className="px-3 py-2">الكمية</th>
//                   <th className="px-3 py-2">حد الطلب</th>
//                   <th className="px-3 py-2">الصلاحية</th>
//                   <th className="px-3 py-2">الموقع</th>
//                   <th className="px-3 py-2">الحالة</th>
//                   <th className="px-3 py-2">إجراءات</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.length ? (
//                   filtered.map((p, idx) => {
//                     const expired = isExpired(p.expiry)
//                     const soon = willExpireSoon(p.expiry, 30)
//                     const low = p.qty <= (p.reorderLevel ?? 0)
//                     return (
//                       <tr key={p.id} className="border-t hover:bg-gray-50">
//                         <td className="px-3 py-2">{idx + 1}</td>
//                         <td className="px-3 py-2 font-medium">{p.tradeName}</td>
//                         <td className="px-3 py-2">{p.scientificName}</td>
//                         <td className="px-3 py-2">{p.manufacturer}</td>
//                         <td className="px-3 py-2">{p.category}</td>
//                         <td className="px-3 py-2">{p.barcode}</td>
//                         <td className="px-3 py-2">{p.buyPrice} ر.س</td>
//                         <td className="px-3 py-2">{p.sellPrice} ر.س</td>
//                         <td className={`px-3 py-2 ${low ? 'text-orange-700 font-semibold' : 'text-gray-700'}`}>{p.qty}</td>
//                         <td className="px-3 py-2">{p.reorderLevel}</td>
//                         <td className={`px-3 py-2 ${expired ? 'text-red-600 font-semibold' : soon ? 'text-amber-700 font-semibold' : ''}`}>
//                           {p.expiry}
//                         </td>
//                         <td className="px-3 py-2">{p.location}</td>
//                         <td className="px-3 py-2">{rowBadge(p)}</td>
//                         <td className="px-3 py-2 space-x-2 space-x-reverse">
//                           <button
//                             onClick={() => setShowView(p)}
//                             className="px-3 py-1.5 border border-sky-100 text-sky-700 rounded hover:bg-sky-50"
//                           >
//                             عرض
//                           </button>
//                           <button
//                             onClick={() => openEdit(p)}
//                             className="px-3 py-1.5 border border-amber-200 text-amber-700 rounded hover:bg-amber-50"
//                           >
//                             تعديل
//                           </button>
//                           <button
//                             onClick={() => removeItem(p.id)}
//                             className="px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50"
//                           >
//                             حذف
//                           </button>
//                         </td>
//                       </tr>
//                     )
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="14" className="py-6 text-center text-gray-500">لا توجد بيانات مطابقة لمرشّحات البحث.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* مودال عرض التفاصيل */}
//       {showView && (
//         <Modal title={`تفاصيل: ${showView.tradeName}`} onClose={() => setShowView(null)}>
//           <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
//             <Info label="الاسم التجاري" value={showView.tradeName} />
//             <Info label="الاسم العلمي" value={showView.scientificName} />
//             <Info label="الشركة" value={showView.manufacturer} />
//             <Info label="الفئة" value={showView.category} />
//             <Info label="الباركود" value={showView.barcode} />
//             <Info label="سعر الشراء" value={`${showView.buyPrice} ر.س`} />
//             <Info label="سعر البيع" value={`${showView.sellPrice} ر.س`} />
//             <Info label="الكمية" value={showView.qty} />
//             <Info label="حد الطلب" value={showView.reorderLevel} />
//             <Info label="تاريخ الانتهاء" value={showView.expiry} highlight={
//               isExpired(showView.expiry) ? 'text-red-600' : willExpireSoon(showView.expiry) ? 'text-amber-700' : ''
//             }/>
//             <Info label="الموقع" value={showView.location} />
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => { setShowView(null); openEdit(showView) }}
//               className="px-4 py-2 text-sm border rounded bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
//             >
//               تعديل
//             </button>
//             <button
//               onClick={() => setShowView(null)}
//               className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
//             >
//               إغلاق
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* مودال إضافة/تعديل */}
//       {showForm && (
//         <Modal title={editItem ? 'تعديل منتج' : 'إضافة منتج'} onClose={() => { setShowForm(false); setEditItem(null) }}>
//           <div dir="rtl" className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
//             <Field label="الاسم التجاري">
//               <input value={form.tradeName} onChange={e => setForm({ ...form, tradeName: e.target.value })} className="w-full px-3 py-2 border rounded" />
//             </Field>
//             <Field label="الاسم العلمي">
//               <input value={form.scientificName} onChange={e => setForm({ ...form, scientificName: e.target.value })} className="w-full px-3 py-2 border rounded" />
//             </Field>
//             <Field label="الشركة المصنعة">
//               <input value={form.manufacturer} onChange={e => setForm({ ...form, manufacturer: e.target.value })} className="w-full px-3 py-2 border rounded" />
//             </Field>
//             <Field label="الفئة">
//               <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded">
//                 <option value="">اختر...</option>
//                 {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </Field>
//             <Field label="الباركود">
//               <input value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} className="w-full px-3 py-2 border rounded" />
//             </Field>
//             <Field label="سعر الشراء">
//               <input type="number" value={form.buyPrice} onChange={e => setForm({ ...form, buyPrice: e.target.value })} className="w-full px-3 py-2 border rounded" />
//             </Field>
//             <Field label="سعر البيع">
//               <input type="number" value={form.sellPrice} onChange={e => setForm({ ...form, sellPrice: e.target.value })} className="w-full px-3 py-2 border rounded" />
//             </Field>
//             <Field label="الكمية">
//               <input type="number" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} className="w-full px-3 py-2 border rounded" />
//             </Field>
//             <Field label="حد إعادة الطلب">
//               <input type="number" value={form.reorderLevel} onChange={e => setForm({ ...form, reorderLevel: e.target.value })} className="w-full px-3 py-2 border rounded" />
//             </Field>
//             <Field label="تاريخ الانتهاء">
//               <input type="date" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} className="w-full px-3 py-2 border rounded" />
//             </Field>
//             <Field label="الموقع (رف/خزانة)">
//               <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border rounded" />
//             </Field>
//           </div>

//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               onClick={saveForm}
//               className="px-4 py-2 text-white rounded shadow-sm hover:opacity-95"
//               style={{ background: theme.colors.primary }}
//             >
//               حفظ
//             </button>
//             <button
//               onClick={() => { setShowForm(false); setEditItem(null) }}
//               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//             >
//               إلغاء
//             </button>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   )
// }

// function Info({ label, value, highlight = '' }) {
//   return (
//     <div>
//       <p className="text-gray-500">{label}</p>
//       <p className={`font-medium text-gray-800 ${highlight}`}>{value || '—'}</p>
//     </div>
//   )
// }

// function Field({ label, children }) {
//   return (
//     <label className="block">
//       <span className="block mb-1 text-gray-700">{label}</span>
//       {children}
//     </label>
//   )
// }












// // import Layout from '../components/Layout'
// // import { useState } from 'react'
// // import toast from 'react-hot-toast'

// // export default function Products() {
// //   const [products, setProducts] = useState([
// //     { id: 1, name: 'باراسيتامول 500mg', price: 15, stock: 50 },
// //     { id: 2, name: 'أموكسيسيلين 250mg', price: 25, stock: 30 },
// //   ])
// //   const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' })

// //   const addProduct = () => {
// //     if (!newProduct.name || !newProduct.price) return toast.error('يرجى إدخال اسم وسعر المنتج')
// //     setProducts([...products, { id: Date.now(), ...newProduct }])
// //     setNewProduct({ name: '', price: '', stock: '' })
// //     toast.success('✅ تمت إضافة المنتج بنجاح')
// //   }

// //   return (
// //     <Layout user={{ name: 'المدير أحمد' }} title="إدارة المنتجات">
// //       <div dir="rtl" className="space-y-6">
// //         <div className="p-6 bg-white border rounded-lg shadow-sm">
// //           <h3 className="mb-4 text-lg font-semibold text-gray-700">قائمة المنتجات</h3>
// //           <table className="w-full text-sm text-right border-t border-gray-100">
// //             <thead className="text-gray-600 bg-gray-50">
// //               <tr>
// //                 <th className="px-3 py-2">الاسم</th>
// //                 <th className="px-3 py-2">السعر</th>
// //                 <th className="px-3 py-2">الكمية</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {products.map((p) => (
// //                 <tr key={p.id} className="border-t hover:bg-gray-50">
// //                   <td className="px-3 py-2">{p.name}</td>
// //                   <td className="px-3 py-2 font-semibold text-green-700">{p.price} ر.س</td>
// //                   <td className="px-3 py-2">{p.stock}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         <div className="p-6 bg-white border rounded-lg shadow-sm">
// //           <h3 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج جديد</h3>
// //           <input
// //             className="w-full p-2 mb-2 border rounded"
// //             placeholder="اسم المنتج"
// //             value={newProduct.name}
// //             onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
// //           />
// //           <input
// //             className="w-full p-2 mb-2 border rounded"
// //             placeholder="السعر"
// //             type="number"
// //             value={newProduct.price}
// //             onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
// //           />
// //           <input
// //             className="w-full p-2 mb-2 border rounded"
// //             placeholder="الكمية"
// //             type="number"
// //             value={newProduct.stock}
// //             onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
// //           />
// //           <button
// //             onClick={addProduct}
// //             className="w-full py-2 mt-2 text-white bg-green-600 rounded-md hover:bg-green-700"
// //           >
// //             💾 حفظ المنتج
// //           </button>
// //         </div>
// //       </div>
// //     </Layout>
// //   )
// // }
