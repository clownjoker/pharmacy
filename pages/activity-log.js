// pages/activity-log.js
import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const SAMPLE_ACTIVITY = [
  {
    id: 1,
    time: "2025-11-17 09:15",
    user: "محمد الكاشير",
    action: "إضافة فاتورة بيع رقم INV-1001",
    type: "sale",
  },
  {
    id: 2,
    time: "2025-11-17 09:18",
    user: "محمد الكاشير",
    action: "مرتجع جزئي للفاتورة INV-1001",
    type: "return",
  },
  {
    id: 3,
    time: "2025-11-17 10:05",
    user: "أحمد الصيدلي",
    action: "توريد 50 حبة من باراسيتامول 500mg",
    type: "stock_in",
  },
  {
    id: 4,
    time: "2025-11-17 12:20",
    user: "أحمد الصيدلي",
    action: "خصم 10 حبات من أموكسيسيلين 250mg",
    type: "stock_out",
  },
];

export default function ActivityLogPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const users = Array.from(new Set(SAMPLE_ACTIVITY.map((a) => a.user)));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SAMPLE_ACTIVITY.filter((a) => {
      const matchSearch =
        !q ||
        a.action.toLowerCase().includes(q) ||
        a.user.toLowerCase().includes(q);
      const matchType = typeFilter === "all" || a.type === typeFilter;
      const matchUser = userFilter === "all" || a.user === userFilter;
      return matchSearch && matchType && matchUser;
    });
  }, [search, typeFilter, userFilter]);

  return (
    <Layout user={user} title="سجل النشاط">
      <div dir="rtl" className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            📝 سجل نشاط النظام (تجريبي)
          </h1>
        </div>

        {/* فلاتر */}
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              type="text"
              placeholder="🔍 بحث بالنشاط أو اسم المستخدم"
              className="w-full px-3 py-2 text-sm border rounded-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div>
              <label className="block mb-1 text-xs text-gray-500">
                نوع العملية
              </label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">كل الأنواع</option>
                <option value="sale">بيع</option>
                <option value="return">مرتجع</option>
                <option value="stock_in">توريد للمخزون</option>
                <option value="stock_out">خصم من المخزون</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-500">
                المستخدم
              </label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-md"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <option value="all">كل المستخدمين</option>
                {users.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* الجدول */}
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
          <table className="w-full text-sm text-right min-w-[800px]">
            <thead className="text-xs text-gray-600 bg-gray-50">
              <tr>
                <th className="px-3 py-2">الوقت</th>
                <th className="px-3 py-2">المستخدم</th>
                <th className="px-3 py-2">نوع العملية</th>
                <th className="px-3 py-2">الوصف</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 text-xs text-gray-500">
                    {a.time}
                  </td>
                  <td className="px-3 py-2">{a.user}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                        a.type === "sale"
                          ? "bg-emerald-50 text-emerald-700"
                          : a.type === "return"
                          ? "bg-red-50 text-red-600"
                          : a.type === "stock_in"
                          ? "bg-sky-50 text-sky-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {a.type === "sale"
                        ? "بيع"
                        : a.type === "return"
                        ? "مرتجع"
                        : a.type === "stock_in"
                        ? "توريد مخزون"
                        : "خصم مخزون"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-700">{a.action}</td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-6 text-sm text-center text-gray-500"
                  >
                    لا توجد سجلات مطابقة للفلاتر الحالية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
