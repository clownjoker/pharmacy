import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const [newPass, setNewPass] = useState("");
  const [message, setMessage] = useState("");
  const [loginHistory, setLoginHistory] = useState([]);

  // لو المستخدم لسه ما اتحمّل من الكونتكست
  if (!user) {
    return (
      <Layout user={null} title="الملف الشخصي">
        <div
          dir="rtl"
          className="flex items-center justify-center h-40 text-gray-500"
        >
          ⏳ جاري تحميل بيانات المستخدم…
        </div>
      </Layout>
    );
  }

  const roleLabel =
    user?.role === "admin"
      ? "مدير النظام"
      : user?.role === "pharmacist"
      ? "صيدلي"
      : "كاشير";

  const permsCount = user?.permissions?.length || 0;

  // 📌 تحميل سجل الدخول الخاص بهذا المستخدم فقط
  useEffect(() => {
    if (!user) return;
    const saved = JSON.parse(localStorage.getItem("login_history") || "[]");
    const filtered = saved.filter((h) => h.username === user.username);
    setLoginHistory(filtered);
  }, [user]);

  // 🔐 تغيير كلمة المرور (محاكاة)
  const handleChangePass = () => {
    if (!newPass.trim()) {
      setMessage("❌ أدخل كلمة مرور جديدة");
      return;
    }

    setMessage("✅ كلمة المرور تم تحديثها (محاكاة فقط في الواجهة)");
    setNewPass("");
  };

  return (
    <Layout user={user} title="الملف الشخصي">
      <div dir="rtl" className="max-w-3xl mx-auto space-y-8">
        {/* بطاقة البروفايل الأساسية */}
        <div className="p-6 bg-white border rounded-xl shadow space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20 text-3xl text-white rounded-full shadow bg-sky-600">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {user.username}
              </h1>
              <p className="text-sm text-gray-500">{roleLabel}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4 border-t sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">اسم المستخدم</p>
              <p className="font-semibold text-gray-800">{user.username}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">الدور الوظيفي</p>
              <p className="font-semibold text-gray-800">{roleLabel}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">عدد الصلاحيات</p>
              <p className="font-semibold text-gray-800">{permsCount}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">آخر تسجيل دخول</p>
              <p className="font-semibold text-gray-800">
                {loginHistory[0]?.time || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* تغيير كلمة المرور */}
        <div className="p-6 bg-white border rounded-xl shadow space-y-4">
          <h2 className="text-xl font-bold text-gray-700">
            🔐 تغيير كلمة المرور
          </h2>

          <input
            type="password"
            placeholder="كلمة المرور الجديدة"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          {message && (
            <div className="p-2 text-sm text-center text-white rounded bg-sky-600">
              {message}
            </div>
          )}

          <button
            onClick={handleChangePass}
            className="w-full px-4 py-2 text-white rounded-lg bg-sky-600 hover:bg-sky-700"
          >
            💾 حفظ كلمة المرور
          </button>
        </div>

        {/* سجل آخر تسجيلات الدخول */}
        <div className="p-6 bg-white border rounded-xl shadow space-y-4">
          <h2 className="text-xl font-bold text-gray-700">
            📜 آخر 5 تسجيلات دخول
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right min-w-[320px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">التاريخ</th>
                  <th className="p-2">الجهاز</th>
                </tr>
              </thead>

              <tbody>
                {loginHistory.length ? (
                  loginHistory.map((h, i) => (
                    <tr className="border-t" key={i}>
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">{h.time}</td>
                      <td className="p-2">{h.device}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-4 text-center text-gray-400 text-xs sm:text-sm"
                    >
                      لا توجد بيانات تسجيل دخول محفوظة لهذا المستخدم…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}








// import { useState, useEffect } from "react";
// import Layout from "../components/Layout";
// import AuthGuard from "../components/AuthGuard";
// import toast from "react-hot-toast";

// export default function Profile() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const raw = localStorage.getItem("pharmacy_user");
//     if (raw) setUser(JSON.parse(raw));
//   }, []);

//   const handleSave = () => {
//     localStorage.setItem("pharmacy_user", JSON.stringify(user));
//     toast.success("تم حفظ المعلومات");
//   };

//   if (!user) return null;

//   return (
//     <AuthGuard allowedRoles={["admin", "pharmacist", "cashier"]}>
//       <Layout user={user} title="حسابي">
//         <div className="max-w-lg p-6 mx-auto bg-white border rounded-lg" dir="rtl">
//           <h2 className="mb-4 text-xl font-bold">الملف الشخصي</h2>

//           <label className="block mb-1 text-sm">الاسم</label>
//           <input
//             className="w-full p-2 mb-3 border rounded"
//             value={user.name}
//             onChange={(e) => setUser({ ...user, name: e.target.value })}
//           />

//           <label className="block mb-1 text-sm">اسم المستخدم</label>
//           <input
//             className="w-full p-2 mb-3 border rounded bg-gray-50"
//             value={user.username}
//             disabled
//           />

//           <label className="block mb-1 text-sm">البريد الإلكتروني</label>
//           <input
//             className="w-full p-2 mb-3 border rounded"
//             value={user.email}
//             onChange={(e) => setUser({ ...user, email: e.target.value })}
//           />

//           <button
//             className="w-full px-4 py-2 text-white bg-blue-600 rounded"
//             onClick={handleSave}
//           >
//             💾 حفظ التعديلات
//           </button>
//         </div>
//       </Layout>
//     </AuthGuard>
//   );
// }
