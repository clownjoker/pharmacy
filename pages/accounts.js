// pages/accounts.js
import { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import theme from "../theme";
import api from "../utils/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AccountsPage() {
  const [user] = useState({ name: "المدير أحمد", role: "admin" });

  // 🔹 بيانات العمليات المالية
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  // 🔹 فلاتر
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // 🔹 مودال إضافة عملية
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrans, setNewTrans] = useState({
    userId: "",
    type: "فاتورة بيع",
    direction: "in",
    amount: "",
    date: "",
    description: "",
    category: "مبيعات",
    paymentMethod: "cash",
    refCode: "",
  });

  // تنسيق عملة
  const formatCurrency = (v) =>
    `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

  // 🔄 جلب العمليات من الباك-إند
  const loadTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data || []);
    } catch (err) {
      console.error("loadTransactions error:", err);
      toast.error("خطأ في تحميل العمليات");
    }
  };

  // 🔄 جلب المستخدمين من الباك-إند
  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("loadUsers error:", err);
    }
  };

  // 📌 تشغيل التحميل عند فتح الصفحة
  useEffect(() => {
    loadTransactions();
    loadUsers();
  }, []);

  // 🔍 فلترة العمليات
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const q = search.trim().toLowerCase();

      const passSearch =
        !q ||
        t.refCode?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.userName?.toLowerCase().includes(q);

      const passType = typeFilter === "all" || t.type === typeFilter;
      const passDir =
        directionFilter === "all" || t.direction === directionFilter;

      const passUser =
        userFilter === "all" || t.userId === Number(userFilter);

      const d = t.date?.slice(0, 10) || "";
      const passFrom = !dateFrom || d >= dateFrom;
      const passTo = !dateTo || d <= dateTo;

      return passSearch && passType && passDir && passUser && passFrom && passTo;
    });
  }, [
    transactions,
    search,
    typeFilter,
    directionFilter,
    userFilter,
    dateFrom,
    dateTo,
  ]);

  // 📊 ملخصات
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach((t) => {
      const amount = Number(t.amount) || 0;
      if (t.direction === "in") income += amount;
      else expense += amount;
    });

    const net = income - expense;

    // "اليوم" المنطقي = أحدث تاريخ في كل البيانات (مو بس المفلترة)
    const dates = transactions
      .map((t) => t.date?.slice(0, 10))
      .filter(Boolean);

    const logicalToday = dates.length
      ? dates.sort()[dates.length - 1]
      : null;

    let todayIncome = 0;
    if (logicalToday) {
      transactions.forEach((t) => {
        const amount = Number(t.amount) || 0;
        if (
          t.direction === "in" &&
          t.date?.slice(0, 10) === logicalToday
        ) {
          todayIncome += amount;
        }
      });
    }

    return {
      income,
      expense,
      net,
      todayIncome,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions, transactions]);

  // 📈 خط زمني بسيط
  const chartData = useMemo(() => {
    const map = new Map();
    filteredTransactions.forEach((t) => {
      const day = t.date?.slice(0, 10);
      if (!day) return;
      const sign = t.direction === "in" ? 1 : -1;
      const amount = Number(t.amount) || 0;
      map.set(day, (map.get(day) || 0) + sign * amount);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([date, total]) => ({ date, total }));
  }, [filteredTransactions]);

  // 🖨️ طباعة التقرير الحالي
  const handlePrint = () => {
    const rows = filteredTransactions
      .map(
        (t) => `
      <tr>
        <td>${t.refCode || ""}</td>
        <td>${t.type || ""}</td>
        <td>${t.direction === "in" ? "إيراد" : "مصروف"}</td>
        <td>${t.userName || ""}</td>
        <td>${(t.date || "").replace("T", " ").slice(0, 16)}</td>
        <td>${t.amount}</td>
        <td>${t.category || ""}</td>
        <td>${t.paymentMethod || ""}</td>
      </tr>`
      )
      .join("");

    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8" />
          <title>تقرير الحسابات</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 20px; }
            h2 { color: #0ea5e9; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: center; font-size: 13px; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h2>تقرير الحسابات المالية — صيدلية المعلم</h2>
          <p>إجمالي الإيرادات: <strong>${formatCurrency(
            summary.income
          )}</strong></p>
          <p>إجمالي المصروفات: <strong>${formatCurrency(
            summary.expense
          )}</strong></p>
          <p>صافي الربح: <strong>${formatCurrency(summary.net)}</strong></p>
          <table>
            <thead>
              <tr>
                <th>مرجع</th>
                <th>النوع</th>
                <th>اتجاه</th>
                <th>المستخدم</th>
                <th>التاريخ</th>
                <th>المبلغ</th>
                <th>التصنيف</th>
                <th>طريقة الدفع</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 600);
            };
          </script>
        </body>
      </html>
    `;

    const w = window.open("", "_blank", "width=900,height=900");
    w.document.write(html);
    w.document.close();
  };

  // ➕ إضافة عملية مالية فعلية عبر الباك-إند
  const handleSaveNewTrans = async () => {
  try {
    if (!newTrans.userId || !newTrans.amount || !newTrans.date) {
      toast.error("يرجى إدخال المستخدم والمبلغ والتاريخ");
      return;
    }

    // 🔹 توليد مرجع تلقائي إذا لم يُدخل المستخدم واحداً
    const generatedRef =
      newTrans.refCode && newTrans.refCode.trim() !== ""
        ? newTrans.refCode
        : "TX-" + Date.now();

    const payload = {
      refCode: generatedRef,           // ← التعديل هنا
      type: newTrans.type,
      direction: newTrans.direction,
      amount: Number(newTrans.amount),
      date: newTrans.date,
      userId: Number(newTrans.userId),
      category: newTrans.category || null,
      paymentMethod: newTrans.paymentMethod,
      description: newTrans.description || null,
    };

    await api.post("/transactions", payload);

    toast.success("تم حفظ العملية بنجاح");

    // 🔄 إعادة تحميل من السيرفر
    await loadTransactions();

    // 🔄 إعادة ضبط النموذج
    setShowAddModal(false);
    setNewTrans({
      userId: "",
      type: "فاتورة بيع",
      direction: "in",
      amount: "",
      date: "",
      description: "",
      category: "مبيعات",
      paymentMethod: "cash",
      refCode: "",
    });
  } catch (err) {
    console.error("saveTrans error:", err);
    toast.error("فشل في حفظ العملية");
  }
};

  // const handleSaveNewTrans = async () => {
  //   try {
  //     if (!newTrans.userId || !newTrans.amount || !newTrans.date) {
  //       toast.error("يرجى إدخال المستخدم والمبلغ والتاريخ");
  //       return;
  //     }

  //     const payload = {
  //       refCode: newTrans.refCode || null,
  //       type: newTrans.type,
  //       direction: newTrans.direction,
  //       amount: Number(newTrans.amount),
  //       date: newTrans.date,
  //       userId: Number(newTrans.userId),
  //       category: newTrans.category || null,
  //       paymentMethod: newTrans.paymentMethod,
  //       description: newTrans.description || null,
  //     };

  //     await api.post("/transactions", payload);

  //     toast.success("تم حفظ العملية بنجاح");

  //     // إعادة تحميل من السيرفر لضمان التوافق
  //     await loadTransactions();

  //     setShowAddModal(false);
  //     setNewTrans({
  //       userId: "",
  //       type: "فاتورة بيع",
  //       direction: "in",
  //       amount: "",
  //       date: "",
  //       description: "",
  //       category: "مبيعات",
  //       paymentMethod: "cash",
  //       refCode: "",
  //     });
  //   } catch (err) {
  //     console.error("saveTrans error:", err);
  //     toast.error("فشل في حفظ العملية");
  //   }
  // };

  // تجميع حسب المستخدم (دفتر بسيط)
  const userLedger = useMemo(() => {
    const map = new Map();
    transactions.forEach((t) => {
      if (!t.userId) return;
      if (!map.has(t.userId)) {
        map.set(t.userId, {
          userId: t.userId,
          userName: t.userName || "",
          income: 0,
          expense: 0,
        });
      }
      const row = map.get(t.userId);
      const amount = Number(t.amount) || 0;
      if (t.direction === "in") row.income += amount;
      else row.expense += amount;
    });
    return Array.from(map.values());
  }, [transactions]);

  return (
    <Layout user={user} title="الحسابات المالية">
      <div dir="rtl" className="space-y-6">
        {/* رأس الصفحة */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              💰 الحسابات المالية
            </h1>
            <p className="text-sm text-gray-500">
              متابعة الإيرادات، المصروفات، وصافي الربح مع ارتباط بالمستخدمين والعمليات اليومية.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-sm text-white rounded-md shadow-md"
              style={{ background: theme.colors.success }}
            >
              ➕ إضافة عملية مالية
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm border rounded-md text-sky-700 bg-sky-50 border-sky-300 hover:bg-sky-100"
            >
              🖨️ طباعة التقرير الحالي
            </button>
          </div>
        </div>

        {/* الكروت */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="إجمالي الإيرادات"
            value={formatCurrency(summary.income)}
            color="text-emerald-600"
          />
          <SummaryCard
            title="إجمالي المصروفات"
            value={formatCurrency(summary.expense)}
            color="text-red-600"
          />
          <SummaryCard
            title="صافي الربح"
            value={formatCurrency(summary.net)}
            color={summary.net >= 0 ? "text-sky-600" : "text-red-700"}
          />
          <SummaryCard
            title="عدد العمليات الحالية"
            value={summary.count}
            color="text-purple-600"
          />
        </div>

        {/* الرسم البياني + دفتر المستخدمين */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="p-4 bg-white border rounded-lg shadow-sm lg:col-span-2">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">
              📈 صافي الحركة اليومية (إيراد - مصروف)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={theme.colors.primary}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">
              👥 ملخص حسب المستخدم
            </h2>
            <div className="space-y-2 text-xs">
              {userLedger.length ? (
                userLedger.map((u) => (
                  <div
                    key={u.userId}
                    className="p-2 border rounded-md bg-gray-50/70"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">
                        {u.userName}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        ID: {u.userId}
                      </span>
                    </div>
                    <div className="mt-1 text-[12px]">
                      <div className="flex justify-between">
                        <span>إيرادات</span>
                        <span className="font-semibold text-emerald-700">
                          {formatCurrency(u.income)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>مصروفات</span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(u.expense)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>صافي</span>
                        <span
                          className={`font-bold ${
                            u.income - u.expense >= 0
                              ? "text-sky-600"
                              : "text-red-700"
                          }`}
                        >
                          {formatCurrency(u.income - u.expense)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">
                  لا توجد بيانات لعرض دفتر المستخدمين…
                </p>
              )}
            </div>
          </div>
        </div>

        {/* الفلاتر */}
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            🔍 فلترة العمليات
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
            <input
              type="text"
              placeholder="بحث: مرجع / وصف / مستخدم"
              className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md"
            >
              <option value="all">كل الأنواع</option>
              <option value="فاتورة بيع">فاتورة بيع</option>
              <option value="إيراد آخر">إيراد آخر</option>
              <option value="مصروف مشتريات">مصروف مشتريات</option>
              <option value="مصروف تشغيلي">مصروف تشغيلي</option>
              <option value="مرتجع عميل">مرتجع عميل</option>
            </select>

            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md"
            >
              <option value="all">إيراد + مصروف</option>
              <option value="in">إيرادات فقط</option>
              <option value="out">مصروفات فقط</option>
            </select>

            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md"
            >
              <option value="all">كل المستخدمين</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md"
            />
          </div>
        </div>

        {/* جدول العمليات */}
        <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            📋 العمليات المالية
          </h2>
          <table className="w-full min-w-[980px] text-sm text-right">
            <thead className="text-gray-700 bg-gray-50">
              <tr>
                <th className="px-3 py-2">مرجع</th>
                <th className="px-3 py-2">النوع</th>
                <th className="px-3 py-2">اتجاه</th>
                <th className="px-3 py-2">المستخدم</th>
                <th className="px-3 py-2">التصنيف</th>
                <th className="px-3 py-2">طريقة الدفع</th>
                <th className="px-3 py-2">التاريخ</th>
                <th className="px-3 py-2">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length ? (
                filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="transition border-t hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {t.refCode || "—"}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {t.type}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {t.direction === "in" ? "إيراد" : "مصروف"}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {t.userName || "—"}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {t.category || "—"}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {t.paymentMethod || "—"}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {(t.date || "").replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="px-3 py-2 text-xs font-semibold text-emerald-700 sm:text-sm">
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-5 text-sm text-center text-gray-500"
                  >
                    لا توجد عمليات مطابقة للفلاتر الحالية…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* مودال إضافة عملية */}
        {showAddModal && (
          <Modal
            title="➕ إضافة عملية مالية"
            onClose={() => setShowAddModal(false)}
            onConfirm={handleSaveNewTrans}
            confirmText="حفظ العملية"
            size="md"
          >
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-xs text-gray-600">
                    المستخدم
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm border rounded-md"
                    value={newTrans.userId}
                    onChange={(e) =>
                      setNewTrans((prev) => ({
                        ...prev,
                        userId: e.target.value,
                      }))
                    }
                  >
                    <option value="">اختر المستخدم</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-xs text-gray-600">
                    نوع العملية
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm border rounded-md"
                    value={newTrans.type}
                    onChange={(e) => {
                      const val = e.target.value;
                      let direction = "in";
                      if (
                        val === "مصروف مشتريات" ||
                        val === "مصروف تشغيلي" ||
                        val === "مرتجع عميل"
                      ) {
                        direction = "out";
                      }
                      setNewTrans((prev) => ({
                        ...prev,
                        type: val,
                        direction,
                      }));
                    }}
                  >
                    <option value="فاتورة بيع">فاتورة بيع</option>
                    <option value="إيراد آخر">إيراد آخر</option>
                    <option value="مصروف مشتريات">مصروف مشتريات</option>
                    <option value="مصروف تشغيلي">مصروف تشغيلي</option>
                    <option value="مرتجع عميل">مرتجع عميل</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-xs text-gray-600">
                    المبلغ
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-sm border rounded-md"
                    value={newTrans.amount}
                    onChange={(e) =>
                      setNewTrans((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-600">
                    التاريخ والوقت
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 text-sm border rounded-md"
                    value={newTrans.date}
                    onChange={(e) =>
                      setNewTrans((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-xs text-gray-600">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border rounded-md"
                    placeholder="مثل: مبيعات / مشتريات / إيجار..."
                    value={newTrans.category}
                    onChange={(e) =>
                      setNewTrans((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-600">
                    طريقة الدفع
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm border rounded-md"
                    value={newTrans.paymentMethod}
                    onChange={(e) =>
                      setNewTrans((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                  >
                    <option value="cash">نقداً</option>
                    <option value="card">بطاقة</option>
                    <option value="bank">تحويل بنكي</option>
                    <option value="wallet">محفظة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs text-gray-600">
                  مرجع (اختياري)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border rounded-md"
                  placeholder="مثل: INV-2025-001 أو EXP-PO-01"
                  value={newTrans.refCode}
                  onChange={(e) =>
                    setNewTrans((prev) => ({
                      ...prev,
                      refCode: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-xs text-gray-600">
                  وصف / ملاحظة
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 text-sm border rounded-md"
                  placeholder="وصف مختصر للعملية المالية"
                  value={newTrans.description}
                  onChange={(e) =>
                    setNewTrans((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}

// بطاقة ملخص
function SummaryCard({ title, value, color }) {
  return (
    <div className="p-4 text-center bg-white border rounded-lg shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`mt-1 text-lg sm:text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
















// // pages/accounts.js
// import { useState, useEffect, useMemo } from "react";
// import Layout from "../components/Layout";
// import Modal from "../components/Modal";
// import toast from "react-hot-toast";
// import theme from "../theme";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
// } from "recharts";

// export default function AccountsPage() {
//   const [user] = useState({ name: "المدير أحمد", role: "admin" });

//   // 🔹 بيانات العمليات المالية (تجريبية حالياً)
//   const [transactions, setTransactions] = useState([]);
//   const [users, setUsers] = useState([]);

//   // 🔹 فلاتر
//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [directionFilter, setDirectionFilter] = useState("all");
//   const [userFilter, setUserFilter] = useState("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   // 🔹 مودال إضافة عملية
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newTrans, setNewTrans] = useState({
//     userId: "",
//     type: "فاتورة بيع",
//     direction: "in",
//     amount: "",
//     date: "",
//     description: "",
//     category: "مبيعات",
//     paymentMethod: "cash",
//     refCode: "",
//   });

//   // تنسيق عملة
//   const formatCurrency = (v) =>
//     `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;

//   // 📌 تحميل بيانات تجريبية
//   useEffect(() => {
//   loadTransactions();
//   loadUsers();
// }, []);

// const loadTransactions = async () => {
//   try {
//     const res = await api.get("/transactions");
//     setTransactions(res.data);
//   } catch (err) {
//     console.error(err);
//     toast.error("خطأ في تحميل العمليات");
//   }
// };

// const loadUsers = async () => {
//   try {
//     const res = await api.get("/users");
//     setUsers(res.data);
//   } catch (err) {
//     console.error(err);
//   }
// };

//   // 🔍 فلترة العمليات
//   const filteredTransactions = useMemo(() => {
//     return transactions.filter((t) => {
//       const q = search.trim().toLowerCase();
//       const passSearch =
//         !q ||
//         t.refCode?.toLowerCase().includes(q) ||
//         t.description?.toLowerCase().includes(q) ||
//         t.userName?.toLowerCase().includes(q);

//       const passType = typeFilter === "all" || t.type === typeFilter;
//       const passDir =
//         directionFilter === "all" || t.direction === directionFilter;
//       const passUser = userFilter === "all" || t.userId === userFilter;

//       const d = t.date.slice(0, 10);
//       const passFrom = !dateFrom || d >= dateFrom;
//       const passTo = !dateTo || d <= dateTo;

//       return passSearch && passType && passDir && passUser && passFrom && passTo;
//     });
//   }, [
//     transactions,
//     search,
//     typeFilter,
//     directionFilter,
//     userFilter,
//     dateFrom,
//     dateTo,
//   ]);

//   // 📊 ملخصات
//   const summary = useMemo(() => {
//     let income = 0;
//     let expense = 0;

//     filteredTransactions.forEach((t) => {
//       if (t.direction === "in") income += t.amount || 0;
//       else expense += t.amount || 0;
//     });

//     const net = income - expense;

//     // "اليوم" المنطقي = أحدث تاريخ في البيانات
//     const dates = transactions.map((t) => t.date.slice(0, 10));
//     const logicalToday = dates.length ? dates.sort()[dates.length - 1] : null;

//     let todayIncome = 0;
//     if (logicalToday) {
//       transactions.forEach((t) => {
//         if (t.direction === "in" && t.date.slice(0, 10) === logicalToday) {
//           todayIncome += t.amount || 0;
//         }
//       });
//     }

//     return {
//       income,
//       expense,
//       net,
//       todayIncome,
//       count: filteredTransactions.length,
//     };
//   }, [filteredTransactions, transactions]);

//   // 📈 خط زمني بسيط
//   const chartData = useMemo(() => {
//     const map = new Map();
//     filteredTransactions.forEach((t) => {
//       const day = t.date.slice(0, 10);
//       const sign = t.direction === "in" ? 1 : -1;
//       map.set(day, (map.get(day) || 0) + sign * (t.amount || 0));
//     });
//     return Array.from(map.entries())
//       .sort(([a], [b]) => (a > b ? 1 : -1))
//       .map(([date, total]) => ({ date, total }));
//   }, [filteredTransactions]);

//   // 🖨️ طباعة التقرير الحالي
//   const handlePrint = () => {
//     const rows = filteredTransactions
//       .map(
//         (t) => `
//       <tr>
//         <td>${t.refCode || ""}</td>
//         <td>${t.type}</td>
//         <td>${t.direction === "in" ? "إيراد" : "مصروف"}</td>
//         <td>${t.userName || ""}</td>
//         <td>${t.date.replace("T", " ").slice(0, 16)}</td>
//         <td>${t.amount}</td>
//         <td>${t.category || ""}</td>
//         <td>${t.paymentMethod || ""}</td>
//       </tr>`
//       )
//       .join("");

//     const html = `
//       <html dir="rtl" lang="ar">
//         <head>
//           <meta charset="UTF-8" />
//           <title>تقرير الحسابات</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; padding: 20px; }
//             h2 { color: #0ea5e9; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ddd; padding: 6px; text-align: center; font-size: 13px; }
//             th { background: #f3f4f6; }
//           </style>
//         </head>
//         <body>
//           <h2>تقرير الحسابات المالية — صيدلية المعلم</h2>
//           <p>إجمالي الإيرادات: <strong>${formatCurrency(
//             summary.income
//           )}</strong></p>
//           <p>إجمالي المصروفات: <strong>${formatCurrency(
//             summary.expense
//           )}</strong></p>
//           <p>صافي الربح: <strong>${formatCurrency(summary.net)}</strong></p>
//           <table>
//             <thead>
//               <tr>
//                 <th>مرجع</th>
//                 <th>النوع</th>
//                 <th>اتجاه</th>
//                 <th>المستخدم</th>
//                 <th>التاريخ</th>
//                 <th>المبلغ</th>
//                 <th>التصنيف</th>
//                 <th>طريقة الدفع</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${rows}
//             </tbody>
//           </table>
//           <script>
//             window.onload = () => {
//               window.print();
//               setTimeout(() => window.close(), 600);
//             };
//           </script>
//         </body>
//       </html>
//     `;

//     const w = window.open("", "_blank", "width=900,height=900");
//     w.document.write(html);
//     w.document.close();
//   };

//   // ➕ إضافة عملية مالية جديدة (داخل الواجهة فقط الآن)
//   const handleSaveNewTrans = () => {
//     if (!newTrans.userId || !newTrans.amount || !newTrans.date) {
//       toast.error("يرجى إدخال المستخدم والمبلغ والتاريخ");
//       return;
//     }

//     const userObj = users.find((u) => u.id === newTrans.userId);

//     const trans = {
//       id: `T-${Date.now()}`,
//       refCode: newTrans.refCode || "",
//       type: newTrans.type,
//       direction: newTrans.direction,
//       amount: Number(newTrans.amount),
//       date: newTrans.date,
//       userId: newTrans.userId,
//       userName: userObj?.name || "",
//       category: newTrans.category,
//       paymentMethod: newTrans.paymentMethod,
//       description: newTrans.description,
//     };

//     setTransactions((prev) => [trans, ...prev]);
//     setShowAddModal(false);
//     setNewTrans({
//       userId: "",
//       type: "فاتورة بيع",
//       direction: "in",
//       amount: "",
//       date: "",
//       description: "",
//       category: "مبيعات",
//       paymentMethod: "cash",
//       refCode: "",
//     });

//     toast.success("تم إضافة العملية محلياً (بيانات تجريبية)");
//   };

//   // تجميع حسب المستخدم (دفتر بسيط)
//   const userLedger = useMemo(() => {
//     const map = new Map();
//     transactions.forEach((t) => {
//       if (!t.userId) return;
//       if (!map.has(t.userId)) {
//         map.set(t.userId, {
//           userId: t.userId,
//           userName: t.userName || "",
//           income: 0,
//           expense: 0,
//         });
//       }
//       const row = map.get(t.userId);
//       if (t.direction === "in") row.income += t.amount || 0;
//       else row.expense += t.amount || 0;
//     });
//     return Array.from(map.values());
//   }, [transactions]);

//   return (
//     <Layout user={user} title="الحسابات المالية">
//       <div dir="rtl" className="space-y-6">
//         {/* رأس الصفحة */}
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-xl font-semibold text-gray-800">
//               💰 الحسابات المالية
//             </h1>
//             <p className="text-sm text-gray-500">
//               متابعة الإيرادات، المصروفات، وصافي الربح مع ارتباط بسيط بالمستخدمين
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="px-4 py-2 text-sm text-white rounded-md shadow-md"
//               style={{ background: theme.colors.success }}
//             >
//               ➕ إضافة عملية مالية
//             </button>
//             <button
//               onClick={handlePrint}
//               className="px-4 py-2 text-sm border rounded-md text-sky-700 bg-sky-50 border-sky-300 hover:bg-sky-100"
//             >
//               🖨️ طباعة التقرير الحالي
//             </button>
//           </div>
//         </div>

//         {/* الكروت */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <SummaryCard
//             title="إجمالي الإيرادات"
//             value={formatCurrency(summary.income)}
//             color="text-emerald-600"
//           />
//           <SummaryCard
//             title="إجمالي المصروفات"
//             value={formatCurrency(summary.expense)}
//             color="text-red-600"
//           />
//           <SummaryCard
//             title="صافي الربح"
//             value={formatCurrency(summary.net)}
//             color={
//               summary.net >= 0 ? "text-sky-600" : "text-red-700"
//             }
//           />
//           <SummaryCard
//             title="عدد العمليات الحالية"
//             value={summary.count}
//             color="text-purple-600"
//           />
//         </div>

//         {/* الرسم البياني + دفتر المستخدمين */}
//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
//           <div className="p-4 bg-white border rounded-lg shadow-sm lg:col-span-2">
//             <h2 className="mb-2 text-sm font-semibold text-gray-700">
//               📈 صافي الحركة اليومية (إيراد - مصروف)
//             </h2>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="total"
//                     stroke={theme.colors.primary}
//                     strokeWidth={2}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="p-4 bg-white border rounded-lg shadow-sm">
//             <h2 className="mb-2 text-sm font-semibold text-gray-700">
//               👥 ملخص حسب المستخدم
//             </h2>
//             <div className="space-y-2 text-xs">
//               {userLedger.length ? (
//                 userLedger.map((u) => (
//                   <div
//                     key={u.userId}
//                     className="p-2 border rounded-md bg-gray-50/70"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="font-semibold text-gray-800">
//                         {u.userName}
//                       </span>
//                       <span className="text-[11px] text-gray-500">
//                         {u.userId}
//                       </span>
//                     </div>
//                     <div className="mt-1 text-[12px]">
//                       <div className="flex justify-between">
//                         <span>إيرادات</span>
//                         <span className="font-semibold text-emerald-700">
//                           {formatCurrency(u.income)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>مصروفات</span>
//                         <span className="font-semibold text-red-600">
//                           {formatCurrency(u.expense)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>صافي</span>
//                         <span
//                           className={`font-bold ${
//                             u.income - u.expense >= 0
//                               ? "text-sky-600"
//                               : "text-red-700"
//                           }`}
//                         >
//                           {formatCurrency(u.income - u.expense)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-xs text-gray-500">
//                   لا توجد بيانات لعرض دفتر المستخدمين…
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* الفلاتر */}
//         <div className="p-4 bg-white border rounded-lg shadow-sm">
//           <h2 className="mb-3 text-sm font-semibold text-gray-700">
//             🔍 فلترة العمليات
//           </h2>
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
//             <input
//               type="text"
//               placeholder="بحث: مرجع / وصف / مستخدم"
//               className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />

//             <select
//               value={typeFilter}
//               onChange={(e) => setTypeFilter(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل الأنواع</option>
//               <option value="فاتورة بيع">فاتورة بيع</option>
//               <option value="إيراد آخر">إيراد آخر</option>
//               <option value="مصروف مشتريات">مصروف مشتريات</option>
//               <option value="مصروف تشغيلي">مصروف تشغيلي</option>
//               <option value="مرتجع عميل">مرتجع عميل</option>
//             </select>

//             <select
//               value={directionFilter}
//               onChange={(e) => setDirectionFilter(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">إيراد + مصروف</option>
//               <option value="in">إيرادات فقط</option>
//               <option value="out">مصروفات فقط</option>
//             </select>

//             <select
//               value={userFilter}
//               onChange={(e) => setUserFilter(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل المستخدمين</option>
//               {users.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.name}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="date"
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//             <input
//               type="date"
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//           </div>
//         </div>

//         {/* جدول العمليات */}
//         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <h2 className="mb-3 text-sm font-semibold text-gray-700">
//             📋 العمليات المالية
//           </h2>
//           <table className="w-full min-w-[980px] text-sm text-right">
//             <thead className="text-gray-700 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">مرجع</th>
//                 <th className="px-3 py-2">النوع</th>
//                 <th className="px-3 py-2">اتجاه</th>
//                 <th className="px-3 py-2">المستخدم</th>
//                 <th className="px-3 py-2">التصنيف</th>
//                 <th className="px-3 py-2">طريقة الدفع</th>
//                 <th className="px-3 py-2">التاريخ</th>
//                 <th className="px-3 py-2">المبلغ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTransactions.length ? (
//                 filteredTransactions.map((t) => (
//                   <tr
//                     key={t.id}
//                     className="transition border-t hover:bg-gray-50"
//                   >
//                     <td className="px-3 py-2 text-xs sm:text-sm">
//                       {t.refCode || "—"}
//                     </td>
//                     <td className="px-3 py-2 text-xs sm:text-sm">
//                       {t.type}
//                     </td>
//                     <td className="px-3 py-2 text-xs sm:text-sm">
//                       {t.direction === "in" ? "إيراد" : "مصروف"}
//                     </td>
//                     <td className="px-3 py-2 text-xs sm:text-sm">
//                       {t.userName || "—"}
//                     </td>
//                     <td className="px-3 py-2 text-xs sm:text-sm">
//                       {t.category || "—"}
//                     </td>
//                     <td className="px-3 py-2 text-xs sm:text-sm">
//                       {t.paymentMethod || "—"}
//                     </td>
//                     <td className="px-3 py-2 text-xs sm:text-sm">
//                       {t.date.replace("T", " ").slice(0, 16)}
//                     </td>
//                     <td className="px-3 py-2 text-xs font-semibold text-emerald-700 sm:text-sm">
//                       {formatCurrency(t.amount)}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="py-5 text-sm text-center text-gray-500"
//                   >
//                     لا توجد عمليات مطابقة للفلاتر الحالية…
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* مودال إضافة عملية */}
//         {showAddModal && (
//           <Modal
//             title="➕ إضافة عملية مالية"
//             onClose={() => setShowAddModal(false)}
//             onConfirm={handleSaveNewTrans}
//             confirmText="حفظ العملية"
//             size="md"
//           >
//             <div className="space-y-3 text-sm">
//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 <div>
//                   <label className="block mb-1 text-xs text-gray-600">
//                     المستخدم
//                   </label>
//                   <select
//                     className="w-full px-3 py-2 text-sm border rounded-md"
//                     value={newTrans.userId}
//                     onChange={(e) =>
//                       setNewTrans((prev) => ({
//                         ...prev,
//                         userId: e.target.value,
//                       }))
//                     }
//                   >
//                     <option value="">اختر المستخدم</option>
//                     {users.map((u) => (
//                       <option key={u.id} value={u.id}>
//                         {u.name} — {u.role}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block mb-1 text-xs text-gray-600">
//                     نوع العملية
//                   </label>
//                   <select
//                     className="w-full px-3 py-2 text-sm border rounded-md"
//                     value={newTrans.type}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       let direction = "in";
//                       if (
//                         val === "مصروف مشتريات" ||
//                         val === "مصروف تشغيلي" ||
//                         val === "مرتجع عميل"
//                       ) {
//                         direction = "out";
//                       }
//                       setNewTrans((prev) => ({
//                         ...prev,
//                         type: val,
//                         direction,
//                       }));
//                     }}
//                   >
//                     <option value="فاتورة بيع">فاتورة بيع</option>
//                     <option value="إيراد آخر">إيراد آخر</option>
//                     <option value="مصروف مشتريات">مصروف مشتريات</option>
//                     <option value="مصروف تشغيلي">مصروف تشغيلي</option>
//                     <option value="مرتجع عميل">مرتجع عميل</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 <div>
//                   <label className="block mb-1 text-xs text-gray-600">
//                     المبلغ
//                   </label>
//                   <input
//                     type="number"
//                     className="w-full px-3 py-2 text-sm border rounded-md"
//                     value={newTrans.amount}
//                     onChange={(e) =>
//                       setNewTrans((prev) => ({
//                         ...prev,
//                         amount: e.target.value,
//                       }))
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-1 text-xs text-gray-600">
//                     التاريخ والوقت
//                   </label>
//                   <input
//                     type="datetime-local"
//                     className="w-full px-3 py-2 text-sm border rounded-md"
//                     value={newTrans.date}
//                     onChange={(e) =>
//                       setNewTrans((prev) => ({
//                         ...prev,
//                         date: e.target.value,
//                       }))
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 <div>
//                   <label className="block mb-1 text-xs text-gray-600">
//                     التصنيف
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2 text-sm border rounded-md"
//                     placeholder="مثل: مبيعات / مشتريات / إيجار..."
//                     value={newTrans.category}
//                     onChange={(e) =>
//                       setNewTrans((prev) => ({
//                         ...prev,
//                         category: e.target.value,
//                       }))
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-1 text-xs text-gray-600">
//                     طريقة الدفع
//                   </label>
//                   <select
//                     className="w-full px-3 py-2 text-sm border rounded-md"
//                     value={newTrans.paymentMethod}
//                     onChange={(e) =>
//                       setNewTrans((prev) => ({
//                         ...prev,
//                         paymentMethod: e.target.value,
//                       }))
//                     }
//                   >
//                     <option value="cash">نقداً</option>
//                     <option value="card">بطاقة</option>
//                     <option value="bank">تحويل بنكي</option>
//                     <option value="wallet">محفظة</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block mb-1 text-xs text-gray-600">
//                   مرجع (اختياري)
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 text-sm border rounded-md"
//                   placeholder="مثل: INV-2025-001 أو EXP-PO-01"
//                   value={newTrans.refCode}
//                   onChange={(e) =>
//                     setNewTrans((prev) => ({
//                       ...prev,
//                       refCode: e.target.value,
//                     }))
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 text-xs text-gray-600">
//                   وصف / ملاحظة
//                 </label>
//                 <textarea
//                   rows={3}
//                   className="w-full px-3 py-2 text-sm border rounded-md"
//                   placeholder="وصف مختصر للعملية المالية"
//                   value={newTrans.description}
//                   onChange={(e) =>
//                     setNewTrans((prev) => ({
//                       ...prev,
//                       description: e.target.value,
//                     }))
//                   }
//                 />
//               </div>
//             </div>
//           </Modal>
//         )}
//       </div>
//     </Layout>
//   );
// }

// // بطاقة ملخص
// function SummaryCard({ title, value, color }) {
//   return (
//     <div className="p-4 text-center bg-white border rounded-lg shadow-sm">
//       <p className="text-xs text-gray-500">{title}</p>
//       <p className={`mt-1 text-lg sm:text-xl font-bold ${color}`}>{value}</p>
//     </div>
//   );
// }








// import { useState, useEffect, useRef } from 'react'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import toast from 'react-hot-toast'
// import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts'

// export default function Accounts() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [transactions, setTransactions] = useState([])
//   const [selectedDateRange, setSelectedDateRange] = useState({ from: '', to: '' })
//   const [filterUser, setFilterUser] = useState('all')
//   const printRef = useRef(null)

//   // 🔹 البيانات المبدئية
//   useEffect(() => {
//     setTransactions([
//       { id: 1, date: '2025-11-01', user: 'أحمد', amount: 320, type: 'فاتورة' },
//       { id: 2, date: '2025-11-02', user: 'مها', amount: 450, type: 'مدفوعات' },
//       { id: 3, date: '2025-11-02', user: 'محمد', amount: 220, type: 'فاتورة' },
//       { id: 4, date: '2025-11-03', user: 'أحمد', amount: 500, type: 'مدفوعات' },
//     ])
//   }, [])

//   const handleFilter = () => {
//     toast.success(`✅ تم تطبيق الفلتر من ${selectedDateRange.from || 'بداية الشهر'} إلى ${selectedDateRange.to || 'اليوم'}`)
//   }

//   const handlePrint = () => {
//     const content = printRef.current.innerHTML
//     const printWindow = window.open('', '_blank', 'width=900,height=700')
//     printWindow.document.write(`
//       <html dir="rtl" lang="ar">
//         <head>
//           <title>تقرير الحسابات</title>
//           <style>
//             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
//             th { background: #f5f5f5; }
//             h2 { text-align: center; color: #0ea5e9; }
//           </style>
//         </head>
//         <body>${content}</body>
//       </html>
//     `)
//     printWindow.document.close()
//     printWindow.print()
//   }

//   return (
//     <Layout user={user} title="📊 الحسابات">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔹 شريط الفلاتر */}
//         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             <label className="text-sm text-gray-700">من:</label>
//             <input
//               type="date"
//               value={selectedDateRange.from}
//               onChange={(e) => setSelectedDateRange({ ...selectedDateRange, from: e.target.value })}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//             <label className="text-sm text-gray-700">إلى:</label>
//             <input
//               type="date"
//               value={selectedDateRange.to}
//               onChange={(e) => setSelectedDateRange({ ...selectedDateRange, to: e.target.value })}
//               className="px-3 py-2 text-sm border rounded-md"
//             />
//             <select
//               value={filterUser}
//               onChange={(e) => setFilterUser(e.target.value)}
//               className="px-3 py-2 text-sm border rounded-md"
//             >
//               <option value="all">كل المستخدمين</option>
//               <option value="أحمد">أحمد</option>
//               <option value="محمد">محمد</option>
//               <option value="مها">مها</option>
//             </select>
//             <button
//               onClick={handleFilter}
//               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
//             >
//               🔍 تطبيق الفلتر
//             </button>
//           </div>
//           <button
//             onClick={handlePrint}
//             className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700"
//           >
//             🖨️ طباعة التقرير
//           </button>
//         </div>

//         {/* 🔹 الجدول الرئيسي */}
//         <div className="p-5 bg-white border rounded-lg shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800">📋 تفاصيل الحسابات</h3>

//           <table className="w-full text-sm text-right border-t border-gray-100">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">التاريخ</th>
//                 <th className="px-3 py-2">المستخدم</th>
//                 <th className="px-3 py-2">المبلغ</th>
//                 <th className="px-3 py-2">النوع</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map((transaction, idx) => (
//                 <tr key={transaction.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{idx + 1}</td>
//                   <td className="px-3 py-2">{transaction.date}</td>
//                   <td className="px-3 py-2">{transaction.user}</td>
//                   <td className="px-3 py-2">{transaction.amount} ر.س</td>
//                   <td className="px-3 py-2">{transaction.type}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* 🔹 رسم بياني للتقارير */}
//         <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800">📊 رسم بياني للحسابات</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={transactions}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="amount" stroke={theme.colors.primary} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </Layout>
//   )
// }
