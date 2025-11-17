// components/AuthGuard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * allowedRoles: ['admin','cashier',...]
 * requiredPermissions: ['view_reports','add_sale',...]
 */
export default function AuthGuard({
  children,
  allowedRoles = [],
  requiredPermissions = [],
}) {
  const router = useRouter();
  const [status, setStatus] = useState("checking"); // checking | allowed | denied

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem("pharmacy_user");
      if (!raw) {
        setStatus("denied");
        router.replace("/");
        return;
      }

      const user = JSON.parse(raw || "{}");
      const userRole = user.role;
      const userPerms = Array.isArray(user.permissions) ? user.permissions : [];

      // 1) التحقق من الدور
      if (allowedRoles.length && !allowedRoles.includes(userRole)) {
        setStatus("denied");
        router.replace("/403");
        return;
      }

      // 2) التحقق من الصلاحيات
      if (
        requiredPermissions.length &&
        !requiredPermissions.every((p) => userPerms.includes(p))
      ) {
        setStatus("denied");
        router.replace("/403");
        return;
      }

      setStatus("allowed");
    } catch (err) {
      console.error("AuthGuard error:", err);
      setStatus("denied");
      router.replace("/");
    }
  }, [router, allowedRoles, requiredPermissions]);

  if (status !== "allowed") return null;
  return children;
}
