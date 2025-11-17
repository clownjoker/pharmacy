import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import AuthGuard from "../components/AuthGuard";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("pharmacy_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const handleSave = () => {
    localStorage.setItem("pharmacy_user", JSON.stringify(user));
    toast.success("تم حفظ المعلومات");
  };

  if (!user) return null;

  return (
    <AuthGuard allowedRoles={["admin", "pharmacist", "cashier"]}>
      <Layout user={user} title="حسابي">
        <div className="max-w-lg p-6 mx-auto bg-white border rounded-lg" dir="rtl">
          <h2 className="mb-4 text-xl font-bold">الملف الشخصي</h2>

          <label className="block mb-1 text-sm">الاسم</label>
          <input
            className="w-full p-2 mb-3 border rounded"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />

          <label className="block mb-1 text-sm">اسم المستخدم</label>
          <input
            className="w-full p-2 mb-3 border rounded bg-gray-50"
            value={user.username}
            disabled
          />

          <label className="block mb-1 text-sm">البريد الإلكتروني</label>
          <input
            className="w-full p-2 mb-3 border rounded"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <button
            className="w-full px-4 py-2 text-white bg-blue-600 rounded"
            onClick={handleSave}
          >
            💾 حفظ التعديلات
          </button>
        </div>
      </Layout>
    </AuthGuard>
  );
}
