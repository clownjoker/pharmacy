// pages/403.js
import Layout from "../components/Layout";

export default function ForbiddenPage() {
  // لو حاب تستخدم نفس المستخدم التجريبي
  const user = { name: "زائر النظام", role: "guest" };

  return (
    <Layout user={user} title="🚫 صلاحيات غير كافية">
      <div dir="rtl" className="flex items-center justify-center py-16">
        <div className="max-w-md p-6 text-center bg-white border shadow-sm rounded-xl">
          <h1 className="mb-3 text-3xl font-bold text-red-600">🚫 ممنوع الدخول</h1>
          <p className="mb-4 text-sm text-gray-600">
            لا تمتلك الصلاحيات الكافية للوصول إلى هذه الصفحة.
          </p>
          <p className="mb-6 text-xs text-gray-500">
            الرجاء التواصل مع مدير النظام لإضافة صلاحيات الحساب أو تغيير الدور.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-lg bg-sky-600 hover:bg-sky-700"
          >
            ⬅ العودة للواجهة الرئيسية
          </a>
        </div>
      </div>
    </Layout>
  );
}
