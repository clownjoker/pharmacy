// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!username || !password) {
    toast.error("يرجى إدخال اسم المستخدم وكلمة المرور");
    return;
  }

  try {
    setLoading(true);

    const res = await api.post("/auth/login", {
      username,
      password,
    });

    console.log("LOGIN RESPONSE:", res.data);

    const { token, user } = res.data;

    // ✅ تحقق أساسي
    if (!token || !user || !user.id || user.role_id == null) {
      throw new Error("بيانات المستخدم غير مكتملة");
    }

    // 🧠 تحويل role_id → role نصي (مهم جدًا)
    let role = "";
    switch (Number(user.role_id)) {
      case 1:
        role = "admin";
        break;
      case 2:
        role = "pharmacist";
        break;
      case 3:
        role = "cashier";
        break;
      default:
        throw new Error("دور المستخدم غير معروف");
    }

    // 💾 تخزين الجلسة (موحّد مع AuthGuard)
    localStorage.setItem("token", token);
    localStorage.setItem(
      "pharmacy_user",
      JSON.stringify({
        id: user.id,
        name: user.name,
        username: user.username,
        role: role,
      })
    );

    // 🚦 توجيه تلقائي حسب الدور
    switch (role) {
      case "admin":
        window.location.replace("/dashboard");
        break;

      case "pharmacist":
        window.location.replace("/pharmacy");
        break;

      case "cashier":
        window.location.replace("/cashier");
        break;
    }

    toast.success(`مرحبًا ${user.name}`);
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    const msg =
      err.response?.data?.message ||
      err.message ||
      "فشل تسجيل الدخول";

    toast.error(msg);
    localStorage.clear();
  } finally {
    setLoading(false);
  }
};


//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!username || !password) {
//       toast.error("يرجى إدخال اسم المستخدم وكلمة المرور");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await api.post("/auth/login", {
//         username,
//         password,
//       });

//       console.log("LOGIN RESPONSE:", res.data);

//       const { token, user } = res.data;

//       // ✅ تحقق بسيط وصحيح (بدون تشدد زائد)
//       if (!token || !user || !user.id || user.role_id == null) {
//         throw new Error("بيانات المستخدم غير مكتملة");
//       }

//       // 💾 تخزين الجلسة
//       localStorage.setItem("token", token);
//       // localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem(
//   "pharmacy_user",
//   JSON.stringify({
//     id: 1,
//     name: "Admin",
//     role: "admin"
//   })
// );


      

//       // 🚦 التوجيه حسب role_id من قاعدة البيانات
//      switch (Number(user.role_id)) {
//   case 1:
//     window.location.href = "/dashboard";
//     break;

//   case 2:
//     window.location.href = "/pharmacist";
//     break;

//   case 3:
//     window.location.href = "/cashier";
//     break;

//   default:
//     toast.error("دور المستخدم غير معروف");
//     localStorage.clear();
// }

//       toast.success(`مرحبًا ${user.name}`);
//     } catch (err) {
//       console.error("LOGIN ERROR:", err);

//       const msg =
//         err.response?.data?.message ||
//         err.message ||
//         "فشل تسجيل الدخول";

//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

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
          <h1 className="text-2xl font-bold text-gray-800">
            صيدلية المعلّم
          </h1>
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
            disabled={loading}
            className={`w-full py-2.5 text-white rounded-md shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-400">
          © 2025 جميع الحقوق محفوظة — نظام إدارة الصيدلية
        </p>
      </div>
    </div>
  );
}

















// // pages/index.js
// import { useState } from "react";
// import { useRouter } from "next/router";
// import toast from "react-hot-toast";
// import api from "../utils/api";

// export default function LoginPage() {
//   const router = useRouter();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!username || !password) {
//       toast.error("يرجى إدخال اسم المستخدم وكلمة المرور");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await api.post("/auth/login", {
//         username,
//         password,
//       });

//       const { token, user } = res.data || {};

//       // 🛑 حماية صارمة
//      if (
//   !token ||
//   !user ||
//   typeof user.role === "undefined" ||
//   !user.id
// ) {
//   throw new Error("بيانات المستخدم غير مكتملة");
// }


//       // 💾 تخزين الجلسة
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       toast.success(`مرحبًا ${user.name}`);

//       // 🚦 التوجيه حسب الدور (من DB)
//      switch (user.role) {
//   case 1:
//     router.push("/dashboard");
//     break;

//   case 2:
//     router.push("/pharmacist");
//     break;

//   case 3:
//     router.push("/cashier");
//     break;

//   default:
//     toast.error("دور المستخدم غير معروف");
//     localStorage.clear();
// }

//     } catch (err) {
//       console.error("login error:", err);

//       const msg =
//         err.response?.data?.message ||
//         err.message ||
//         "فشل تسجيل الدخول";

//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };
// return (
//   <div
//     dir="rtl"
//     className="grid min-h-screen px-4 place-items-center bg-gradient-to-br from-sky-100 to-white"
//   >
//     <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
//       {/* الشعار */}
//       <div className="flex flex-col items-center mb-6 text-center">
//         <div className="flex items-center justify-center w-16 h-16 mb-3 text-3xl text-white rounded-full shadow-md bg-sky-500">
//           💊
//         </div>
//         <h1 className="text-2xl font-bold text-gray-800">
//           صيدلية المعلّم
//         </h1>
//         <p className="mt-1 text-sm text-gray-500">
//           يرجى تسجيل الدخول للمتابعة
//         </p>
//       </div>

//       {/* النموذج */}
//       <form onSubmit={handleLogin} className="space-y-5 text-right">
//         {/* اسم المستخدم */}
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="اسم المستخدم"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
//           />
//           <span className="absolute inset-y-0 flex items-center text-lg text-gray-500 right-3">
//             👤
//           </span>
//         </div>

//         {/* كلمة المرور */}
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="كلمة المرور"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
//           />
//           <span className="absolute inset-y-0 flex items-center text-lg text-gray-500 right-3">
//             🔒
//           </span>

//           <button
//             type="button"
//             onClick={() => setShowPassword((v) => !v)}
//             className="absolute inset-y-0 flex items-center text-gray-500 left-3 hover:text-gray-700"
//           >
//             {showPassword ? "🙈" : "👁️"}
//           </button>
//         </div>

//         {/* زر الدخول */}
//         <button
//           type="submit"
//           className="w-full py-2.5 text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-md transition"
//         >
//           تسجيل الدخول
//         </button>
//       </form>

//       <p className="mt-6 text-xs text-center text-gray-400">
//         © 2025 جميع الحقوق محفوظة — نظام إدارة الصيدلية
//       </p>
//     </div>
//   </div>
// );

//   // return (
//   //   <div
//   //     dir="rtl"
//   //     className="flex items-center justify-center min-h-screen bg-gray-100"
//   //   >
//   //     <form
//   //       onSubmit={handleLogin}
//   //       className="w-full max-w-sm p-6 bg-white rounded-lg shadow"
//   //     >
//   //       <h1 className="mb-4 text-lg font-bold text-center text-gray-800">
//   //         تسجيل الدخول
//   //       </h1>

//   //       <div className="mb-3">
//   //         <label className="block mb-1 text-xs text-gray-600">
//   //           اسم المستخدم
//   //         </label>
//   //         <input
//   //           type="text"
//   //           className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-sky-400"
//   //           value={username}
//   //           onChange={(e) => setUsername(e.target.value)}
//   //           autoFocus
//   //         />
//   //       </div>

//   //       <div className="mb-4">
//   //         <label className="block mb-1 text-xs text-gray-600">
//   //           كلمة المرور
//   //         </label>
//   //         <input
//   //           type="password"
//   //           className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-sky-400"
//   //           value={password}
//   //           onChange={(e) => setPassword(e.target.value)}
//   //         />
//   //       </div>

//   //       <button
//   //         type="submit"
//   //         disabled={loading}
//   //         className={`w-full py-2 text-sm text-white rounded ${
//   //           loading
//   //             ? "bg-gray-400 cursor-not-allowed"
//   //             : "bg-sky-600 hover:bg-sky-700"
//   //         }`}
//   //       >
//   //         {loading ? "جاري التحقق..." : "دخول"}
//   //       </button>
//   //     </form>
//   //   </div>
//   // );
// }











// // pages/index.js
// import { useState } from "react";
// import { useRouter } from "next/router";

// export default function Login() {
//   const router = useRouter();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);




//   const handleLogin = (e) => {
//     e.preventDefault();

//     if (!username || !password) {
//       alert("⚠️ الرجاء إدخال البيانات كاملة");
//       return;
//     }

//     // ----------------------------
//     // 1️⃣ تحديد الدور تلقائيًا
//     // ----------------------------
//     let role = "admin";
//     let redirect = "/dashboard";

//     const u = username.toLowerCase();

//     if (u === "ph") {
//       role = "pharmacist";
//       redirect = "/pharmacist";
//     }

//     if (u === "ca") {
//       role = "cashier";
//       redirect = "/cashier";
//     }

//     // ----------------------------
//     // 2️⃣ الصلاحيات حسب الدور
//     // ----------------------------
//     let permissions = [];

//     if (role === "admin") {
//       permissions = [
//         "manage_users",
//         "manage_medicines",
//         "add_sale",
//         "view_reports",
//         "view_inventory",
//       ];
//     }

//     if (role === "pharmacist") {
//       permissions = ["manage_medicines", "add_sale", "view_inventory"];
//     }

//     if (role === "cashier") {
//       permissions = ["add_sale"];
//     }

//     // ----------------------------
//     // 3️⃣ تخزين بيانات المستخدم
//     // ----------------------------
//     const user = {
//       username,
//       name: username,
//       role,
//       permissions,
//     };

//     localStorage.setItem("pharmacy_user", JSON.stringify(user));
//     localStorage.setItem("pharmacy_token", "demo-token");

//     // ----------------------------
//     // 4️⃣ إضافة سجل دخول — آخر 5 فقط
//     // ----------------------------
//     try {
//       const raw = localStorage.getItem("login_history") || "[]";
//       const list = JSON.parse(raw);

//       list.unshift({
//         username,
//         time: new Date().toLocaleString("ar-EG"),
//         status: "نجاح",
//       });

//       localStorage.setItem("login_history", JSON.stringify(list.slice(0, 5)));
//     } catch (err) {
//       console.error("History error:", err);
//     }

//     // ----------------------------
//     // 5️⃣ التوجيه
//     // ----------------------------
//     router.push(redirect);
//   };

  // return (
  //   <div
  //     dir="rtl"
  //     className="grid min-h-screen px-4 place-items-center bg-gradient-to-br from-sky-100 to-white"
  //   >
  //     <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
  //       {/* الشعار */}
  //       <div className="flex flex-col items-center mb-6 text-center">
  //         <div className="flex items-center justify-center w-16 h-16 mb-3 text-3xl text-white rounded-full shadow-md bg-sky-500">
  //           💊
  //         </div>
  //         <h1 className="text-2xl font-bold text-gray-800">صيدلية المعلّم</h1>
  //         <p className="mt-1 text-sm text-gray-500">
  //           يرجى تسجيل الدخول للمتابعة
  //         </p>
  //       </div>

  //       {/* النموذج */}
  //       <form onSubmit={handleLogin} className="space-y-5 text-right">
  //         {/* اسم المستخدم */}
  //         <div className="relative">
  //           <input
  //             type="text"
  //             placeholder="اسم المستخدم"
  //             value={username}
  //             onChange={(e) => setUsername(e.target.value)}
  //             className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
  //           />
  //           <span className="absolute inset-y-0 flex items-center text-lg text-gray-500 right-3">
  //             👤
  //           </span>
  //         </div>

  //         {/* كلمة المرور */}
  //         <div className="relative">
  //           <input
  //             type={showPassword ? "text" : "password"}
  //             placeholder="كلمة المرور"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
  //           />
  //           <span className="absolute inset-y-0 flex items-center text-lg text-gray-500 right-3">
  //             🔒
  //           </span>

  //           <button
  //             type="button"
  //             onClick={() => setShowPassword((v) => !v)}
  //             className="absolute inset-y-0 flex items-center text-gray-500 left-3 hover:text-gray-700"
  //           >
  //             {showPassword ? "🙈" : "👁️"}
  //           </button>
  //         </div>

  //         {/* زر الدخول */}
  //         <button
  //           type="submit"
  //           className="w-full py-2.5 text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-md transition"
  //         >
  //           تسجيل الدخول
  //         </button>
  //       </form>

  //       <p className="mt-6 text-xs text-center text-gray-400">
  //         © 2025 جميع الحقوق محفوظة — نظام إدارة الصيدلية
  //       </p>
  //     </div>
  //   </div>
  // );
// }
