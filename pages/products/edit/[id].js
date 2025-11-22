// pages/products/edit/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import api from "../../../utils/api";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    sku: "",
    category: "",
    company: "",
    purchasePrice: "",
    price: "",
    quantity: "",
    minQty: "",
    expiryDate: "",
  });

  // Load product
  useEffect(() => {
    if (!id) return;
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("خطأ في تحميل بيانات المنتج");
      router.push("/products");
    }
  };

  const updateProduct = async () => {
    if (!product.name || !product.price) {
      toast.error("اسم المنتج والسعر مطلوبان");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/products/${id}`, {
        name: product.name,
        sku: product.sku,
        category: product.category,
        company: product.company,
        purchasePrice: Number(product.purchasePrice),
        price: Number(product.price),
        quantity: Number(product.quantity),
        minQty: Number(product.minQty),
        expiryDate: product.expiryDate || null,
      });

      toast.success("✔ تم حفظ التعديلات");
      router.push("/products");
    } catch (err) {
      toast.error("فشل تعديل المنتج");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <Layout title="تعديل المنتج">
        <div className="p-6 text-center">جارِ تحميل المنتج…</div>
      </Layout>
    );
  }

  return (
    <Layout title="تعديل المنتج">
      <div dir="rtl" className="max-w-2xl p-6 mx-auto mt-6 bg-white border shadow-sm rounded-xl">

        <h1 className="mb-6 text-2xl font-bold text-slate-800">
          ✏️ تعديل بيانات المنتج
        </h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <Field label="اسم المنتج *">
            <input
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="الكود SKU">
            <input
              value={product.sku}
              onChange={(e) => setProduct({ ...product, sku: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="الفئة">
            <input
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="الشركة">
            <input
              value={product.company}
              onChange={(e) => setProduct({ ...product, company: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="سعر الشراء">
            <input
              type="number"
              value={product.purchasePrice}
              onChange={(e) =>
                setProduct({ ...product, purchasePrice: e.target.value })
              }
              className="input"
            />
          </Field>

          <Field label="سعر البيع *">
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="الكمية">
            <input
              type="number"
              value={product.quantity}
              onChange={(e) =>
                setProduct({ ...product, quantity: e.target.value })
              }
              className="input"
            />
          </Field>

          <Field label="الحد الأدنى للتنبيه">
            <input
              type="number"
              value={product.minQty}
              onChange={(e) =>
                setProduct({ ...product, minQty: e.target.value })
              }
              className="input"
            />
          </Field>

          <Field label="تاريخ انتهاء الصلاحية" full>
            <input
              type="date"
              value={product.expiryDate || ""}
              onChange={(e) =>
                setProduct({ ...product, expiryDate: e.target.value })
              }
              className="input"
            />
          </Field>

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => router.push("/products")}
            className="px-4 py-2 text-sm rounded-lg text-slate-700 bg-slate-200 hover:bg-slate-300"
          >
            إلغاء
          </button>

          <button
            onClick={updateProduct}
            className="px-6 py-2 text-sm text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
            disabled={saving}
          >
            {saving ? "جارٍ الحفظ…" : "حفظ التعديلات"}
          </button>
        </div>
      </div>
    </Layout>
  );
}

/* --------------------- Field Component ---------------------- */
function Field({ label, children, full = false }) {
  return (
    <div className={`flex flex-col ${full ? "md:col-span-2" : ""}`}>
      <label className="mb-1 text-xs text-slate-500">{label}</label>
      {children}
    </div>
  );
}














// // pages/products/edit/[id].js
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import Layout from "../../../components/Layout";
// import { useAuth } from "../../../context/AuthContext";
// import { useInventory } from "../../../context/InventoryContext";

// export default function EditProductPage() {
//   const router = useRouter();
//   const { id } = router.query;

//   const { user, hasPermission } = useAuth();
//   const { getProduct, updateProduct } = useInventory();

//   const [form, setForm] = useState(null);

//   useEffect(() => {
//     if (!id) return;
//     const p = getProduct(id);
//     if (!p) return;
//     setForm({
//       name: p.name || "",
//       sku: p.sku || "",
//       category: p.category || "",
//       company: p.company || "",
//       purchasePrice: p.purchasePrice || 0,
//       price: p.price || 0,
//       quantity: p.quantity || 0,
//       minQty: p.minQty || 0,
//       expiryDate: p.expiryDate || "",
//     });
//   }, [id, getProduct]);

//   if (!hasPermission(["admin", "pharmacist"])) {
//     return (
//       <div dir="rtl" className="p-6 text-center text-red-600">
//         ⚠️ لا يمكنك تعديل المنتجات.
//       </div>
//     );
//   }

//   if (!form) {
//     return (
//       <Layout user={user} title="تعديل منتج">
//         <div dir="rtl" className="p-6 text-center text-gray-500">
//           جاري تحميل بيانات المنتج…
//         </div>
//       </Layout>
//     );
//   }

//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = () => {
//     updateProduct(id, {
//       name: form.name,
//       sku: form.sku,
//       category: form.category,
//       company: form.company,
//       purchasePrice: Number(form.purchasePrice) || 0,
//       price: Number(form.price) || 0,
//       quantity: Number(form.quantity) || 0,
//       minQty: Number(form.minQty) || 0,
//       expiryDate: form.expiryDate,
//     });

//     alert("تم حفظ التعديلات بنجاح");
//     router.push("/products");
//   };

//   const handleCancel = () => {
//     router.push("/products");
//   };

//   return (
//     <Layout user={user} title="تعديل منتج">
//       <div dir="rtl" className="max-w-2xl mx-auto space-y-6">
//         <h1 className="text-xl font-bold text-gray-800">
//           ✏️ تعديل المنتج #{id}
//         </h1>

//         <div className="p-5 space-y-3 text-sm bg-white border shadow rounded-xl">
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             placeholder="اسم المنتج"
//             value={form.name}
//             onChange={(e) => handleChange("name", e.target.value)}
//           />
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             placeholder="الكود SKU"
//             value={form.sku}
//             onChange={(e) => handleChange("sku", e.target.value)}
//           />
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             placeholder="الفئة"
//             value={form.category}
//             onChange={(e) => handleChange("category", e.target.value)}
//           />
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             placeholder="الشركة"
//             value={form.company}
//             onChange={(e) => handleChange("company", e.target.value)}
//           />
//           <input
//             type="number"
//             className="w-full p-2 border rounded"
//             placeholder="سعر الشراء"
//             value={form.purchasePrice}
//             onChange={(e) => handleChange("purchasePrice", e.target.value)}
//           />
//           <input
//             type="number"
//             className="w-full p-2 border rounded"
//             placeholder="سعر البيع"
//             value={form.price}
//             onChange={(e) => handleChange("price", e.target.value)}
//           />
//           <input
//             type="number"
//             className="w-full p-2 border rounded"
//             placeholder="الكمية"
//             value={form.quantity}
//             onChange={(e) => handleChange("quantity", e.target.value)}
//           />
//           <input
//             type="number"
//             className="w-full p-2 border rounded"
//             placeholder="الحد الأدنى"
//             value={form.minQty}
//             onChange={(e) => handleChange("minQty", e.target.value)}
//           />
//           <input
//             type="date"
//             className="w-full p-2 border rounded"
//             value={form.expiryDate}
//             onChange={(e) => handleChange("expiryDate", e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col gap-3 md:flex-row">
//           <button
//             onClick={handleSave}
//             className="flex-1 py-2 text-sm text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
//           >
//             💾 حفظ التعديلات
//           </button>
//           <button
//             onClick={handleCancel}
//             className="flex-1 py-2 text-sm text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
//           >
//             رجوع إلى قائمة المنتجات
//           </button>
//         </div>
//       </div>
//     </Layout>
//   );
// }
