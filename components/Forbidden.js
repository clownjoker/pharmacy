export default function Forbidden() {
  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
    >
      <div className="mb-4 text-6xl">🚫</div>
      <h1 className="mb-2 text-2xl font-bold text-red-600">
        ليس لديك صلاحية لعرض هذه الصفحة
      </h1>
      <p className="text-sm text-gray-600">
        الرجاء التواصل مع مدير النظام لتفعيل الصلاحية المطلوبة.
      </p>
    </div>
  );
}
