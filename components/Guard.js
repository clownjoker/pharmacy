import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Guard({ Component, pageProps }) {
  const { user, loading, canAccessRoute } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const path = router.pathname;

    const publicRoutes = ["/", "/403"];
    if (publicRoutes.includes(path)) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (!canAccessRoute(path)) {
      router.replace("/403");
      return;
    }
  }, [loading, router.pathname, user]);

  if (loading) {
    return (
      <div dir="rtl" className="flex items-center justify-center h-screen">
        جاري التحقق من الجلسة...
      </div>
    );
  }

  return <Component {...pageProps} />;
}
