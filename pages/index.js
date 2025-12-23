// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", {
      username,
      password,
    });

    // ✅ البيانات كما يرجعها الباك
    const user = res.data;

    // تخزين المستخدم
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role_id", user.role_id);

    toast.success("تم تسجيل الدخول بنجاح");

    router.push("/dashboard");
  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
        "اسم المستخدم أو كلمة المرور غير صحيحة"
    );
  }
};


//   const handleLogin = async (e) => {
//   e.preventDefault();

//   if (!username || !password) {
//     alert("⚠️ الرجاء إدخال البيانات كاملة");
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:5000/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, password }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       alert(data.message || "خطأ في تسجيل الدخول");
//       return;
//     }

//     localStorage.setItem("pharmacy_token", data.token);
//     localStorage.setItem("pharmacy_user", JSON.stringify(data.user));

//     // التوجيه حسب الدور من الباك اند
//     const redirectMap = {
//       admin: "/dashboard",
//       pharmacist: "/pharmacist",
//       cashier: "/cashier",
//     };

//     router.push(redirectMap[data.user.role] || "/dashboard");
//   } catch (err) {
//     console.error(err);
//     alert("فشل الاتصال بالسيرفر");
//   }
// };















  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   if (!username || !password) {
  //     alert("⚠️ الرجاء إدخال البيانات كاملة");
  //     return;
  //   }

  //   // ----------------------------
  //   // 1️⃣ تحديد الدور تلقائيًا
  //   // ----------------------------
  //   let role = "admin";
  //   let redirect = "/dashboard";

  //   const u = username.toLowerCase();

  //   if (u === "ph") {
  //     role = "pharmacist";
  //     redirect = "/pharmacist";
  //   }

  //   if (u === "ca") {
  //     role = "cashier";
  //     redirect = "/cashier";
  //   }

  //   // ----------------------------
  //   // 2️⃣ الصلاحيات حسب الدور
  //   // ----------------------------
  //   let permissions = [];

  //   if (role === "admin") {
  //     permissions = [
  //       "manage_users",
  //       "manage_medicines",
  //       "add_sale",
  //       "view_reports",
  //       "view_inventory",
  //     ];
  //   }

  //   if (role === "pharmacist") {
  //     permissions = ["manage_medicines", "add_sale", "view_inventory"];
  //   }

  //   if (role === "cashier") {
  //     permissions = ["add_sale"];
  //   }

  //   // ----------------------------
  //   // 3️⃣ تخزين بيانات المستخدم
  //   // ----------------------------
  //   const user = {
  //     username,
  //     name: username,
  //     role,
  //     permissions,
  //   };

  //   localStorage.setItem("pharmacy_user", JSON.stringify(user));
  //   localStorage.setItem("pharmacy_token", "demo-token");

  //   // ----------------------------
  //   // 4️⃣ إضافة سجل دخول — آخر 5 فقط
  //   // ----------------------------
  //   try {
  //     const raw = localStorage.getItem("login_history") || "[]";
  //     const list = JSON.parse(raw);

  //     list.unshift({
  //       username,
  //       time: new Date().toLocaleString("ar-EG"),
  //       status: "نجاح",
  //     });

  //     localStorage.setItem("login_history", JSON.stringify(list.slice(0, 5)));
  //   } catch (err) {
  //     console.error("History error:", err);
  //   }

  //   // ----------------------------
  //   // 5️⃣ التوجيه
  //   // ----------------------------
  //   router.push(redirect);
  // };

  return (
    <div
      dir="rtl"
      className="grid min-h-screen px-4 place-items-center bg-gradient-to-br from-sky-100 to-white"
    >
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        {/* الشعار */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-3 text-3xl text-white rounded-full shadow-md bg-sky-500">
            💊
          </div>
          <h1 className="text-2xl font-bold text-gray-800">صيدلية المعلّم</h1>
          <p className="mt-1 text-sm text-gray-500">
            يرجى تسجيل الدخول للمتابعة
          </p>
        </div>

        {/* النموذج */}
        <form onSubmit={handleLogin} className="space-y-5 text-right">
          {/* اسم المستخدم */}
          <div className="relative">
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            />
            <span className="absolute inset-y-0 flex items-center text-lg text-gray-500 right-3">
              👤
            </span>
          </div>

          {/* كلمة المرور */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            />
            <span className="absolute inset-y-0 flex items-center text-lg text-gray-500 right-3">
              🔒
            </span>

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 flex items-center text-gray-500 left-3 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* زر الدخول */}
          <button
            type="submit"
            className="w-full py-2.5 text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-md transition"
          >
            تسجيل الدخول
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-400">
          © 2025 جميع الحقوق محفوظة — نظام إدارة الصيدلية
        </p>
      </div>
    </div>
  );
}
