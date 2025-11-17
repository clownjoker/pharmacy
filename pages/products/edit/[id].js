// pages/products/edit/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { useAuth } from "../../../context/AuthContext";
import { useInventory } from "../../../context/InventoryContext";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const { user, hasPermission } = useAuth();
  const { getProduct, updateProduct } = useInventory();

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!id) return;
    const p = getProduct(id);
    if (!p) return;
    setForm({
      name: p.name || "",
      sku: p.sku || "",
      category: p.category || "",
      company: p.company || "",
      purchasePrice: p.purchasePrice || 0,
      price: p.price || 0,
      quantity: p.quantity || 0,
      minQty: p.minQty || 0,
      expiryDate: p.expiryDate || "",
    });
  }, [id, getProduct]);

  if (!hasPermission(["admin", "pharmacist"])) {
    return (
      <div dir="rtl" className="p-6 text-center text-red-600">
        ⚠️ لا يمكنك تعديل المنتجات.
      </div>
    );
  }

  if (!form) {
    return (
      <Layout user={user} title="تعديل منتج">
        <div dir="rtl" className="p-6 text-center text-gray-500">
          جاري تحميل بيانات المنتج…
        </div>
      </Layout>
    );
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProduct(id, {
      name: form.name,
      sku: form.sku,
      category: form.category,
      company: form.company,
      purchasePrice: Number(form.purchasePrice) || 0,
      price: Number(form.price) || 0,
      quantity: Number(form.quantity) || 0,
      minQty: Number(form.minQty) || 0,
      expiryDate: form.expiryDate,
    });

    alert("تم حفظ التعديلات بنجاح");
    router.push("/products");
  };

  const handleCancel = () => {
    router.push("/products");
  };

  return (
    <Layout user={user} title="تعديل منتج">
      <div dir="rtl" className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-xl font-bold text-gray-800">
          ✏️ تعديل المنتج #{id}
        </h1>

        <div className="p-5 space-y-3 text-sm bg-white border shadow rounded-xl">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="اسم المنتج"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="الكود SKU"
            value={form.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="الفئة"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="الشركة"
            value={form.company}
            onChange={(e) => handleChange("company", e.target.value)}
          />
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="سعر الشراء"
            value={form.purchasePrice}
            onChange={(e) => handleChange("purchasePrice", e.target.value)}
          />
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="سعر البيع"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="الكمية"
            value={form.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="الحد الأدنى"
            value={form.minQty}
            onChange={(e) => handleChange("minQty", e.target.value)}
          />
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={form.expiryDate}
            onChange={(e) => handleChange("expiryDate", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <button
            onClick={handleSave}
            className="flex-1 py-2 text-sm text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
          >
            💾 حفظ التعديلات
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 py-2 text-sm text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            رجوع إلى قائمة المنتجات
          </button>
        </div>
      </div>
    </Layout>
  );
}
