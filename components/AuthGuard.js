// components/AuthGuard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AuthGuard({
  children,
  allowedRoles = [],
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const raw = localStorage.getItem("pharmacy_user");
      if (!raw) {
        router.replace("/");
        return;
      }

      const user = JSON.parse(raw);

      if (
        allowedRoles.length &&
        !allowedRoles.includes(user.role)
      ) {
        router.replace("/403");
        return;
      }

      setAllowed(true);
    } catch (e) {
      router.replace("/");
    }
  }, [router, allowedRoles]);

  // ⛔ مهم جدًا
  if (!mounted || !allowed) return null;

  return children;
}










// export default function AuthGuard({ children, allowedRoles = [] }) {
//   if (typeof window === "undefined") return null;

//   const userStr = localStorage.getItem("pharmacy_user");
//   if (!userStr) {
//     return <div>NO USER</div>;
//   }

//   const user = JSON.parse(userStr);

//   // 🔒 لو لم تُحدَّد أدوار → اسمح للجميع
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     return <div>ROLE NOT ALLOWED</div>;
//   }

//   return children;
// }













// // components/AuthGuard.js
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";

// /**
//  * props:
//  *  - allowedRoles: ['admin','cashier', ...]
//  *  - requiredPermissions: ['view_reports','add_sale', ...]
//  *
//  * يعتمد على وجود كائن "pharmacy_user" في localStorage بالشكل:
//  * {
//  *   id, name, username, email,
//  *   role: 'admin' | 'pharmacist' | 'cashier',
//  *   permissions: ['view_reports','add_sale', ...]
//  * }
//  */
// export default function AuthGuard({
//   children,
//   allowedRoles = [],
//   requiredPermissions = [],
// }) {
//   const router = useRouter();
//   const [status, setStatus] = useState("checking"); // checking | allowed | denied

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     try {
//       const raw = localStorage.getItem("pharmacy_user");
//       if (!raw) {
//         setStatus("denied");
//         router.replace("/");
//         return;
//       }

//       const user = JSON.parse(raw || "{}");
//       const userRole = user.role;
//       const userPerms = Array.isArray(user.permissions) ? user.permissions : [];

//       // 1) التحقق من الدور
//       if (allowedRoles.length && !allowedRoles.includes(userRole)) {
//         setStatus("denied");
//         router.replace("/403");
//         return;
//       }

//       // 2) التحقق من الصلاحيات
//       if (
//         requiredPermissions.length &&
//         !requiredPermissions.every((p) => userPerms.includes(p))
//       ) {
//         setStatus("denied");
//         router.replace("/403");
//         return;
//       }

//       setStatus("allowed");
//     } catch (err) {
//       console.error("AuthGuard error:", err);
//       setStatus("denied");
//       router.replace("/");
//     }
//   }, [router, allowedRoles, requiredPermissions]);

//   if (status !== "allowed") return null;
//   return children;
// }
