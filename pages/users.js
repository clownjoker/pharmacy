// pages/users.js
import { useMemo, useState, useEffect } from 'react'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import axios from 'axios'

// API
const api = axios.create({
  baseURL: "http://localhost:5000/api",
})

const ALL_PERMISSIONS = [
  { key: 'view_reports', label: 'عرض التقارير' },
  { key: 'add_sale', label: 'إضافة عملية بيع' },
  { key: 'manage_medicines', label: 'إدارة الأدوية' },
  { key: 'manage_users', label: 'إدارة المستخدمين' },
  { key: 'view_inventory', label: 'عرض المخزون' },
]

const ROLE_LABELS = {
  1: 'مدير النظام',
  2: 'صيدلي',
  3: 'كاشير',
}

export default function UsersPage() {

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPermModal, setShowPermModal] = useState(false)

  // 🟢 نموذج إضافة مستخدم جديد
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role_id: 3,   // القيمة الافتراضية = كاشير
    active: true,
  })

  const [selectedUser, setSelectedUser] = useState(null)
  const [permDraft, setPermDraft] = useState([])

  // ⚡ تحميل المستخدمين
  const loadUsers = async () => {
    try {
      const res = await api.get("/users")
      setUsers(res.data)
    } catch (err) {
      toast.error("خطأ في تحميل المستخدمين")
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // 🔍 فلترة
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    )
  }, [users, search])

  // ➕ إضافة مستخدم
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.username || !newUser.password) {
      toast.error("⚠️ يرجى إدخال جميع الحقول الأساسية")
      return
    }

    try {
      const res = await api.post("/users", newUser)
      setUsers(prev => [...prev, res.data])
      setShowAddModal(false)
      toast.success("تم إضافة المستخدم")
    } catch (err) {
      toast.error("فشل إنشاء المستخدم")
    }
  }

  // 🔄 تفعيل / تعطيل
  const toggleActive = async (id) => {
    try {
      const res = await api.patch(`/users/${id}/toggle`)
      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, active: res.data.active } : u)
      )
      toast.success("تم تحديث الحالة")
    } catch (err) {
      toast.error("خطأ في تغيير الحالة")
    }
  }

  // 🗑️ حذف
  const deleteUser = async (id) => {
    if (!confirm("هل تريد حذف هذا المستخدم؟")) return

    try {
      await api.delete(`/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success("تم الحذف")
    } catch (err) {
      toast.error("خطأ في الحذف")
    }
  }

  // ⚙️ فتح نافذة الصلاحيات
  const openPermModal = (u) => {
    setSelectedUser(u)
    setPermDraft(u.permissions || [])
    setShowPermModal(true)
  }

  // تبديل الصلاحيات
  const togglePermission = (perm) => {
    setPermDraft(prev =>
      prev.includes(perm)
        ? prev.filter(p => p !== perm)
        : [...prev, perm]
    )
  }

  // 💾 حفظ الصلاحيات
  const savePermissions = async () => {
    try {
      await api.put(`/users/${selectedUser.id}/permissions`, {
        permissions: permDraft,
      })

      toast.success("✔ تم حفظ الصلاحيات")
      loadUsers()
      setShowPermModal(false)
    } catch (err) {
      toast.error("❌ فشل حفظ الصلاحيات")
    }
  }

  return (
    <Layout title="إدارة المستخدمين والصلاحيات">
      <div dir="rtl" className="space-y-6">

        {/* 🔍 البحث + إضافة */}
        <div className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="بحث بالاسم / اسم المستخدم / البريد"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded md:w-1/2"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-white bg-green-600 rounded"
          >
            إضافة مستخدم
          </button>
        </div>

        {/* 🧾 جدول المستخدمين */}
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
          <table className="w-full text-sm text-right min-w-[900px]">
            <thead className="text-xs bg-gray-50">
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>اسم المستخدم</th>
                <th>البريد</th>
                <th>الدور</th>
                <th>الحالة</th>
                <th>الصلاحيات</th>
                <th>إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u, i) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.username}</td>
                  <td className="p-2">{u.email}</td>

                  <td className="p-2">
                    <span className="px-3 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
                      {ROLE_LABELS[u.role_id]}
                    </span>
                  </td>

                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        u.active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {u.active ? 'مفعل' : 'موقوف'}
                    </span>
                  </td>

                  <td className="p-2 text-xs">
                    {u.permissions.map((p) => (
                      <span key={p} className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded mx-1">
                        {ALL_PERMISSIONS.find((x) => x.key === p)?.label}
                      </span>
                    ))}
                  </td>

                  <td className="flex flex-wrap justify-center gap-2 p-2">
                    <button
                      onClick={() => openPermModal(u)}
                      className="px-3 py-1 text-xs text-indigo-700 rounded bg-indigo-50"
                    >
                      صلاحيات
                    </button>

                    <button
                      onClick={() => toggleActive(u.id)}
                      className="px-3 py-1 text-xs text-yellow-700 rounded bg-yellow-50"
                    >
                      حالة
                    </button>

                    <button
                      onClick={() => deleteUser(u.id)}
                      className="px-3 py-1 text-xs text-red-700 bg-red-100 rounded"
                    >
                      حذف
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🟢 مودال إضافة مستخدم */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md p-6 bg-white rounded">

              <h2 className="mb-3 font-bold">إضافة مستخدم</h2>

              <Field label="الاسم الكامل">
                <input
                  className="w-full p-2 border rounded"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </Field>

              <Field label="اسم المستخدم">
                <input
                  className="w-full p-2 border rounded"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </Field>

              <Field label="البريد الإلكتروني">
                <input
                  className="w-full p-2 border rounded"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </Field>

              <Field label="كلمة المرور">
                <input
                  type="password"
                  className="w-full p-2 border rounded"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </Field>

              {/* 🔥 الدور (Role → Role_ID) */}
              <Field label="الدور">
                <select
                  className="w-full p-2 border rounded"
                  value={newUser.role_id}
                  onChange={(e) => setNewUser({ ...newUser, role_id: Number(e.target.value) })}
                >
                  <option value={1}>مدير النظام</option>
                  <option value={2}>صيدلي</option>
                  <option value={3}>كاشير</option>
                </select>
              </Field>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setShowAddModal(false)}
                >
                  إلغاء
                </button>

                <button
                  className="px-4 py-2 text-white bg-green-600 rounded"
                  onClick={handleAddUser}
                >
                  حفظ
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 🔵 مودال الصلاحيات */}
        {showPermModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg p-6 bg-white rounded">

              <h2 className="mb-3 font-bold">
                صلاحيات: {selectedUser.name}
              </h2>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ALL_PERMISSIONS.map((perm) => (
                  <label key={perm.key} className="flex items-center gap-2 p-2 border rounded">
                    <input
                      type="checkbox"
                      checked={permDraft.includes(perm.key)}
                      onChange={() => togglePermission(perm.key)}
                    />
                    {perm.label}
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setShowPermModal(false)}
                >
                  إلغاء
                </button>

                <button
                  className="px-4 py-2 text-white bg-blue-600 rounded"
                  onClick={savePermissions}
                >
                  حفظ
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}


// عنصر الحقول
function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-xs text-gray-600">{label}</label>
      {children}
    </div>
  )
}
