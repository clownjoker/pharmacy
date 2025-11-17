// pages/users.js
import { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import theme from '../theme'
import toast from 'react-hot-toast'

const ALL_PERMISSIONS = [
  { key: 'view_reports', label: 'عرض التقارير' },
  { key: 'add_sale', label: 'إضافة عملية بيع' },
  { key: 'manage_medicines', label: 'إدارة الأدوية' },
  { key: 'manage_users', label: 'إدارة المستخدمين' },
  { key: 'view_inventory', label: 'عرض المخزون' },
]

const ROLE_LABELS = {
  admin: 'مدير النظام',
  pharmacist: 'صيدلي',
  cashier: 'كاشير',
}

const ROLE_DEFAULT_PERMISSIONS = {
  admin: ALL_PERMISSIONS.map((p) => p.key),
  pharmacist: ['manage_medicines', 'view_inventory', 'add_sale', 'view_reports'],
  cashier: ['add_sale'],
}

const INITIAL_USERS = [
  {
    id: 1,
    name: 'مها علي',
    username: 'admin',
    email: 'admin@pharmacy.com',
    role: 'admin',
    active: true,
    permissions: ROLE_DEFAULT_PERMISSIONS.admin,
  },
  {
    id: 2,
    name: 'أحمد الصيدلي',
    username: 'pharma',
    email: 'pharma@pharmacy.com',
    role: 'pharmacist',
    active: true,
    permissions: ROLE_DEFAULT_PERMISSIONS.pharmacist,
  },
  {
    id: 3,
    name: 'محمد الكاشير',
    username: 'cashier',
    email: 'cashier@pharmacy.com',
    role: 'cashier',
    active: true,
    permissions: ROLE_DEFAULT_PERMISSIONS.cashier,
  },
]

export default function UsersPage() {
  const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
  const [users, setUsers] = useState(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPermModal, setShowPermModal] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'cashier',
    active: true,
  })
  const [selectedUser, setSelectedUser] = useState(null)
  const [permDraft, setPermDraft] = useState([])

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

  const openAddModal = () => {
    setNewUser({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'cashier',
      active: true,
    })
    setShowAddModal(true)
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.username || !newUser.email || !newUser.password) {
      toast.error('⚠️ يرجى إدخال جميع الحقول الأساسية')
      return
    }

    const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1

    const userToAdd = {
      id: nextId,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      active: true,
      permissions: ROLE_DEFAULT_PERMISSIONS[newUser.role] || [],
    }

    setUsers((prev) => [...prev, userToAdd])
    setShowAddModal(false)
    toast.success('تمت إضافة المستخدم بنجاح')
  }

  const toggleActive = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    )
    toast.success('تم تحديث حالة الحساب')
  }

  const deleteUser = (id) => {
    if (!confirm('هل تريد حذف هذا المستخدم؟')) return
    setUsers((prev) => prev.filter((u) => u.id !== id))
    toast.success('تم حذف المستخدم')
  }

  const openPermModal = (u) => {
    setSelectedUser(u)
    setPermDraft(u.permissions || [])
    setShowPermModal(true)
  }

  const togglePermission = (key) => {
    setPermDraft((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    )
  }

  const savePermissions = () => {
    if (!selectedUser) return
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, permissions: permDraft } : u
      )
    )
    setShowPermModal(false)
    toast.success('تم تحديث صلاحيات المستخدم')
  }

  return (
    <Layout user={user} title="إدارة المستخدمين والصلاحيات">
      <div dir="rtl" className="space-y-6">

        {/* البحث + إضافة */}
        <div className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="بحث بالاسم / اسم المستخدم / البريد"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded md:w-1/2"
          />
          <button
            onClick={openAddModal}
            className="px-4 py-2 text-white bg-green-600 rounded"
          >
            إضافة مستخدم
          </button>
        </div>

        {/* جدول */}
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
          <table className="w-full text-sm text-right min-w-[900px]">
            <thead className="text-xs bg-gray-50">
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>المستخدم</th>
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
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
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

        {/* مودال إضافة مستخدم */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md p-6 bg-white rounded" dir="rtl">
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

              <Field label="الدور">
                <select
                  className="w-full p-2 border rounded"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="admin">مدير</option>
                  <option value="pharmacist">صيدلي</option>
                  <option value="cashier">كاشير</option>
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

        {/* مودال الصلاحيات */}
        {showPermModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg p-6 bg-white rounded" dir="rtl">
              <h2 className="mb-3 font-bold">صلاحيات: {selectedUser.name}</h2>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ALL_PERMISSIONS.map((perm) => (
                  <label
                    key={perm.key}
                    className="flex items-center gap-2 p-2 border rounded"
                  >
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

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-xs text-gray-600">{label}</label>
      {children}
    </div>
  )
}



















// import { useState, useEffect } from 'react'
// import Layout from '../components/Layout'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function UsersPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })

//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)

//   // ---- إضافة مستخدم
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [saving, setSaving] = useState(false)
//   const [newUser, setNewUser] = useState({
//     name: '',
//     username: '',
//     email: '',
//     password: '',
//     role: 'cashier',
//   })

//   // ---- صلاحيات
//   const [showPermModal, setShowPermModal] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [permDraft, setPermDraft] = useState([])

//   // ---- فلترة
//   const [search, setSearch] = useState('')

//   // IMPORTANT: عدّل المنفذ إذا سيرفرك مختلف
//   const API = 'http://localhost:5000/api/users'

//   // ================== تحميل المستخدمين ==================
//   const loadUsers = async () => {
//     try {
//       setLoading(true)
//       const res = await fetch(API)
//       if (!res.ok) throw new Error('HTTP ' + res.status)
//       const data = await res.json()
//       setUsers(data)
//     } catch (e) {
//       console.error(e)
//       toast.error('فشل تحميل المستخدمين — تأكد من تشغيل الباك إند و CORS')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//   const token = localStorage.getItem("pharmacy_token")
//   if (!token) {
//     router.replace("/")   // redirect to login
//   }
// }, [])

//   useEffect(() => {
//     loadUsers()
//   }, [])

//   // ================== فتح مودال الإضافة ==================
//   const openAddModal = () => {
//     setNewUser({ name: '', username: '', email: '', password: '', role: 'cashier' })
//     setShowAddModal(true)
//   }

//   // ================== إضافة مستخدم ==================
//   const addUser = async () => {
//     // فاليوديشن بسيطة
//     if (!newUser.name.trim() || !newUser.username.trim() || !newUser.password.trim()) {
//       return toast.error('يرجى تعبئة الاسم واسم المستخدم وكلمة المرور')
//     }
//     try {
//       setSaving(true)
//       const res = await fetch(API, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newUser),
//       })
//       const data = await res.json().catch(() => ({}))
//       if (!res.ok) {
//         throw new Error(data?.message || 'فشل إضافة المستخدم')
//       }
//       toast.success('✅ تم إضافة المستخدم')
//       setShowAddModal(false)
//       await loadUsers()
//     } catch (e) {
//       console.error(e)
//       toast.error(e.message.includes('Failed to fetch') ? 'تعذر الاتصال بالسيرفر' : e.message)
//     } finally {
//       setSaving(false)
//     }
//   }

//   // إدخال بالإنتر داخل أي حقل في المودال
//   const onAddKeyDown = (e) => {
//     if (e.key === 'Enter') addUser()
//   }

//   // ================== تعطيل/تفعيل ==================
//   const toggleActive = async (id) => {
//     try {
//       const res = await fetch(`${API}/${id}/toggle`, { method: 'PATCH' })
//       const data = await res.json().catch(() => ({}))
//       if (!res.ok) throw new Error(data?.message || 'تعذر تحديث الحالة')
//       toast.success(data.active ? '🔓 تم تفعيل المستخدم' : '🔒 تم تعطيل المستخدم')
//       await loadUsers()
//     } catch (e) {
//       console.error(e)
//       toast.error('فشل تحديث الحالة')
//     }
//   }

//   // ================== حذف ==================
//   const deleteUser = async (id) => {
//     if (!confirm('هل تريد حذف هذا المستخدم نهائيًا؟')) return
//     try {
//       const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
//       const data = await res.json().catch(() => ({}))
//       if (!res.ok) throw new Error(data?.message || 'تعذر الحذف')
//       toast.success('🗑️ تم حذف المستخدم')
//       setUsers((prev) => prev.filter((u) => u.id !== id))
//     } catch (e) {
//       console.error(e)
//       toast.error('فشل حذف المستخدم')
//     }
//   }

//   // ================== صلاحيات ==================
//   const allPermissions = [
//     { key: 'view_reports', label: 'عرض التقارير' },
//     { key: 'add_sale', label: 'إضافة عملية بيع' },
//     { key: 'manage_medicines', label: 'إدارة الأدوية' },
//     { key: 'manage_users', label: 'إدارة المستخدمين' },
//     { key: 'view_inventory', label: 'عرض المخزون' },
//   ]

//   const openPermModal = (u) => {
//     setSelectedUser(u)
//     // لو عندك user_permissions جاهزة، استرجعها هنا… مؤقتًا نقرأ من u.permissions إن وجدت
//     setPermDraft(u.permissions || [])
//     setShowPermModal(true)
//   }

//   const savePermissions = async () => {
//     if (!selectedUser) return
//     try {
//       const res = await fetch(`${API}/${selectedUser.id}/permissions`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ permissions: permDraft }),
//       })
//       const data = await res.json().catch(() => ({}))
//       if (!res.ok) throw new Error(data?.message || 'تعذر حفظ الصلاحيات')
//       toast.success('🔐 تم حفظ الصلاحيات')
//       setShowPermModal(false)
//       await loadUsers()
//     } catch (e) {
//       console.error(e)
//       toast.error('فشل حفظ الصلاحيات')
//     }
//   }

//   // ================== فلترة ==================
//   const filtered = users.filter((u) => {
//     const q = search.trim().toLowerCase()
//     return (
//       !q ||
//       u.name?.toLowerCase().includes(q) ||
//       u.username?.toLowerCase().includes(q) ||
//       u.email?.toLowerCase().includes(q)
//     )
//   })

//   // ================== UI ==================
//   if (loading) {
//     return (
//       <Layout user={user} title="👥 إدارة المستخدمين">
//         <div dir="rtl" className="flex items-center justify-center h-80">
//           <p className="text-gray-600">جارٍ تحميل المستخدمين...</p>
//         </div>
//       </Layout>
//     )
//   }

//   return (
//     <Layout user={user} title="👥 إدارة المستخدمين">
//       <div dir="rtl" className="space-y-6">
//         {/* شريط علوي */}
//         <div className="flex flex-col gap-2 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
//           <input
//             type="text"
//             placeholder="🔍 بحث (الاسم/اسم المستخدم/البريد)"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full px-3 py-2 text-sm border rounded-md md:w-1/3"
//           />
//           <button
//             onClick={openAddModal}
//             className="px-4 py-2 text-sm text-white rounded-md shadow"
//             style={{ background: theme.colors.success }}
//           >
//             ➕ إضافة مستخدم
//           </button>
//         </div>

//         {/* جدول */}
//         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right border-t border-gray-100 min-w-[900px]">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">اسم المستخدم</th>
//                 <th className="px-3 py-2">البريد الإلكتروني</th>
//                 <th className="px-3 py-2">الدور</th>
//                 <th className="px-3 py-2">الحالة</th>
//                 <th className="px-3 py-2 text-center">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length ? (
//                 filtered.map((u, i) => (
//                   <tr key={u.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{i + 1}</td>
//                     <td className="px-3 py-2 font-medium text-gray-700">{u.name}</td>
//                     <td className="px-3 py-2">{u.username}</td>
//                     <td className="px-3 py-2">{u.email}</td>
//                     <td className="px-3 py-2">
//                       {u.role === 'admin' ? 'مدير' : u.role === 'pharmacist' ? 'صيدلي' : 'كاشير'}
//                     </td>
//                     <td className="px-3 py-2">
//                       <span
//                         className={`px-2 py-1 text-xs rounded-md ${
//                           u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
//                         }`}
//                       >
//                         {u.active ? 'نشط' : 'معطل'}
//                       </span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <div className="flex flex-wrap justify-center gap-2">
//                         <button
//                           onClick={() => openPermModal(u)}
//                           className="px-3 py-1 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
//                         >
//                           ⚙️ صلاحيات
//                         </button>
//                         <button
//                           onClick={() => toggleActive(u.id)}
//                           className={`px-3 py-1 text-sm rounded-md ${
//                             u.active
//                               ? 'bg-red-100 text-red-600 hover:bg-red-200'
//                               : 'bg-green-100 text-green-600 hover:bg-green-200'
//                           }`}
//                         >
//                           {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
//                         </button>
//                         <button
//                           onClick={() => deleteUser(u.id)}
//                           className="px-3 py-1 text-sm text-red-600 bg-white border rounded-md hover:bg-red-50"
//                         >
//                           🗑️ حذف
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="py-6 text-center text-gray-500">
//                     لا توجد نتائج
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* مودال إضافة مستخدم */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
//             <h2 className="mb-3 text-lg font-bold text-center text-gray-800">➕ إضافة مستخدم جديد</h2>

//             <div className="space-y-3 text-sm" onKeyDown={onAddKeyDown}>
//               <Field label="الاسم الكامل">
//                 <input
//                   type="text"
//                   value={newUser.name}
//                   onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </Field>

//               <Field label="اسم المستخدم">
//                 <input
//                   type="text"
//                   value={newUser.username}
//                   onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </Field>

//               <Field label="البريد الإلكتروني">
//                 <input
//                   type="email"
//                   value={newUser.email}
//                   onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </Field>

//               <Field label="كلمة المرور">
//                 <input
//                   type="password"
//                   value={newUser.password}
//                   onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </Field>

//               <Field label="الدور">
//                 <select
//                   value={newUser.role}
//                   onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 >
//                   <option value="admin">مدير</option>
//                   <option value="pharmacist">صيدلي</option>
//                   <option value="cashier">كاشير</option>
//                 </select>
//               </Field>
//             </div>

//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
//                 disabled={saving}
//               >
//                 إلغاء
//               </button>
//               <button
//                 onClick={addUser}
//                 disabled={saving}
//                 className="px-4 py-2 text-sm text-white rounded-md disabled:opacity-60"
//                 style={{ background: theme.colors.success }}
//               >
//                 {saving ? '...جاري الحفظ' : 'حفظ المستخدم'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* مودال الصلاحيات */}
//       {showPermModal && selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="w-full max-w-lg p-6 space-y-4 bg-white rounded-lg shadow-lg">
//             <h3 className="text-lg font-semibold text-center text-gray-800">
//               🔐 صلاحيات: <span className="text-sky-600">{selectedUser.name}</span>
//             </h3>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               {allPermissions.map((perm) => (
//                 <label key={perm.key} className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={permDraft.includes(perm.key)}
//                     onChange={(e) => {
//                       const checked = e.target.checked
//                       setPermDraft((prev) =>
//                         checked ? [...prev, perm.key] : prev.filter((p) => p !== perm.key)
//                       )
//                     }}
//                   />
//                   <span>{perm.label}</span>
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-end gap-2 pt-3 border-t">
//               <button
//                 onClick={() => setShowPermModal(false)}
//                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
//               >
//                 إلغاء
//               </button>
//               <button
//                 onClick={savePermissions}
//                 className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
//               >
//                 💾 حفظ
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   )
// }

// function Field({ label, children }) {
//   return (
//     <div>
//       <label className="block mb-1 text-gray-600">{label}</label>
//       {children}
//     </div>
//   )
// }






// import { useState, useEffect } from 'react'
// import Layout from '../components/Layout'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function UsersPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [users, setUsers] = useState([])
//   const [search, setSearch] = useState('')
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showPermModal, setShowPermModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [permissions, setPermissions] = useState([])

//   const [newUser, setNewUser] = useState({
//     name: '',
//     username: '',
//     email: '',
//     password: '',
//     role: 'cashier',
//   })

//   const [editUser, setEditUser] = useState({
//     id: null,
//     name: '',
//     email: '',
//     role: '',
//   })

//   const API_URL = 'http://localhost:5000/api/users'
//   const allPermissions = [
//     { key: 'manage_users', label: 'إدارة المستخدمين' },
//     { key: 'manage_medicines', label: 'إدارة الأدوية' },
//     { key: 'view_inventory', label: 'عرض المخزون' },
//     { key: 'add_sale', label: 'إضافة عملية بيع' },
//     { key: 'view_reports', label: 'عرض التقارير' },
//   ]

//   // 📥 تحميل المستخدمين
//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const res = await fetch(API_URL)
//         const data = await res.json()
//         setUsers(data)
//       } catch (err) {
//         toast.error('❌ فشل تحميل المستخدمين')
//       }
//     }
//     loadUsers()
//   }, [])

//   // 🔍 فلترة المستخدمين
//   const filtered = users.filter((u) =>
//     u.name?.toLowerCase().includes(search.toLowerCase())
//   )

//   // ➕ فتح نافذة إضافة
//   const openAddModal = () => {
//     setNewUser({ name: '', username: '', email: '', password: '', role: 'cashier' })
//     setShowAddModal(true)
//   }

//   // 🧩 إضافة مستخدم جديد
//   const addUser = async () => {
//     try {
//       if (!newUser.name || !newUser.username || !newUser.password)
//         return toast.error('يرجى تعبئة الحقول المطلوبة')

//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newUser),
//       })
//       if (!res.ok) throw new Error()

//       toast.success('✅ تم إضافة المستخدم')
//       setShowAddModal(false)
//       const updated = await fetch(API_URL).then((r) => r.json())
//       setUsers(updated)
//     } catch (err) {
//       toast.error('فشل في الإضافة')
//     }
//   }

//   // 🔄 تفعيل / تعطيل
//   const toggleActive = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' })
//       const data = await res.json()
//       setUsers((prev) =>
//         prev.map((u) => (u.id === id ? { ...u, active: data.active } : u))
//       )
//       toast.success(`تم ${data.active ? 'تفعيل' : 'تعطيل'} المستخدم`)
//     } catch {
//       toast.error('تعذر تعديل الحالة')
//     }
//   }

//   // ⚙️ فتح صلاحيات
//   const openPermissionsModal = async (u) => {
//     setSelectedUser(u)
//     try {
//       const res = await fetch(`${API_URL}/${u.id}/permissions`)
//       const data = await res.json()
//       setPermissions(Array.isArray(data) ? data : [])
//       setShowPermModal(true)
//     } catch {
//       toast.error('تعذر تحميل الصلاحيات')
//     }
//   }

//   // 💾 حفظ الصلاحيات
//   const savePermissions = async () => {
//     try {
//       await fetch(`${API_URL}/${selectedUser.id}/permissions`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ permissions }),
//       })
//       toast.success('🔐 تم حفظ الصلاحيات')
//       setShowPermModal(false)
//     } catch {
//       toast.error('فشل في الحفظ')
//     }
//   }

//   // ✏️ فتح نافذة تعديل المستخدم
//   const openEditModal = (u) => {
//     setEditUser({ id: u.id, name: u.name, email: u.email, role: u.role })
//     setShowEditModal(true)
//   }

//   // 💾 حفظ تعديل المستخدم
//   const saveEditUser = async () => {
//     try {
//       if (!editUser.name || !editUser.email)
//         return toast.error('الحقول مطلوبة')

//       const res = await fetch(`${API_URL}/${editUser.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(editUser),
//       })

//       if (!res.ok) throw new Error()

//       toast.success('✏️ تم تحديث بيانات المستخدم')
//       setUsers((prev) =>
//         prev.map((u) => (u.id === editUser.id ? { ...u, ...editUser } : u))
//       )
//       setShowEditModal(false)
//     } catch {
//       toast.error('فشل التعديل')
//     }
//   }

//   // 🗑️ حذف المستخدم
//   const deleteUser = async (id) => {
//     if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return
//     try {
//       const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message)
//       toast.success(data.message)
//       setUsers((prev) => prev.filter((u) => u.id !== id))
//     } catch {
//       toast.error('فشل في حذف المستخدم ❌')
//     }
//   }

//   return (
//     <Layout user={user} title="👥 إدارة المستخدمين">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔹 البحث والأزرار */}
//         <div className="flex flex-col gap-2 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
//           <input
//             type="text"
//             placeholder="🔍 بحث عن مستخدم..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full px-3 py-2 text-sm border rounded-md md:w-1/3"
//           />
//           <button
//             onClick={openAddModal}
//             className="px-4 py-2 text-sm text-white rounded-md shadow"
//             style={{ background: theme.colors.success }}
//           >
//             ➕ إضافة مستخدم
//           </button>
//         </div>

//         {/* 📋 الجدول */}
//         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right border-t border-gray-100">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">اسم المستخدم</th>
//                 <th className="px-3 py-2">البريد الإلكتروني</th>
//                 <th className="px-3 py-2">الدور</th>
//                 <th className="px-3 py-2">الحالة</th>
//                 <th className="px-3 py-2">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((u, i) => (
//                 <tr key={u.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{i + 1}</td>
//                   <td className="px-3 py-2">{u.name}</td>
//                   <td className="px-3 py-2">{u.username}</td>
//                   <td className="px-3 py-2">{u.email}</td>
//                   <td className="px-3 py-2">{u.role}</td>
//                   <td className="px-3 py-2">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-md ${
//                         u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
//                       }`}
//                     >
//                       {u.active ? 'نشط' : 'معطل'}
//                     </span>
//                   </td>
//                   <td className="flex flex-wrap gap-2 px-3 py-2">
//                     <button
//                       onClick={() => openEditModal(u)}
//                       className="px-3 py-1 text-sm text-white rounded-md bg-amber-500 hover:bg-amber-600"
//                     >
//                       ✏️ تعديل
//                     </button>
//                     <button
//                       onClick={() => toggleActive(u.id)}
//                       className={`px-3 py-1 text-sm rounded-md ${
//                         u.active
//                           ? 'bg-red-100 text-red-600 hover:bg-red-200'
//                           : 'bg-green-100 text-green-600 hover:bg-green-200'
//                       }`}
//                     >
//                       {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
//                     </button>
//                     <button
//                       onClick={() => openPermissionsModal(u)}
//                       className="px-3 py-1 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
//                     >
//                       ⚙️ صلاحيات
//                     </button>
//                     <button
//                       onClick={() => deleteUser(u.id)}
//                       className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
//                     >
//                       🗑️ حذف
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {!filtered.length && (
//             <div className="p-6 text-center text-gray-500">لا توجد نتائج</div>
//           )}
//         </div>
//       </div>

//       {/* ✏️ مودال تعديل المستخدم */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
//             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
//               ✏️ تعديل بيانات المستخدم
//             </h3>
//             <div className="space-y-3 text-sm">
//               <input
//                 type="text"
//                 value={editUser.name}
//                 onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-md"
//                 placeholder="الاسم الكامل"
//               />
//               <input
//                 type="email"
//                 value={editUser.email}
//                 onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-md"
//                 placeholder="البريد الإلكتروني"
//               />
//               <select
//                 value={editUser.role}
//                 onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-md"
//               >
//                 <option value="admin">مدير</option>
//                 <option value="pharmacist">صيدلي</option>
//                 <option value="cashier">كاشير</option>
//               </select>
//             </div>
//             <div className="flex justify-end gap-2 pt-3 mt-4 border-t">
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
//               >
//                 إلغاء
//               </button>
//               <button
//                 onClick={saveEditUser}
//                 className="px-4 py-2 text-sm text-white rounded-md bg-amber-500 hover:bg-amber-600"
//               >
//                 💾 حفظ
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ⚙️ مودال الصلاحيات */}
//       {showPermModal && selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
//             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
//               🔐 تعديل صلاحيات المستخدم: {selectedUser.name}
//             </h3>
//             <div className="grid grid-cols-2 gap-3">
//               {allPermissions.map((perm) => (
//                 <label key={perm.key} className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={permissions.includes(perm.key)}
//                     onChange={(e) => {
//                       const checked = e.target.checked
//                       setPermissions((prev) =>
//                         checked
//                           ? [...prev, perm.key]
//                           : prev.filter((p) => p !== perm.key)
//                       )
//                     }}
//                   />
//                   <span>{perm.label}</span>
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-end gap-2 pt-3 mt-4 border-t">
//               <button
//                 onClick={() => setShowPermModal(false)}
//                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
//               >
//                 إلغاء
//               </button>
//               <button
//                 onClick={savePermissions}
//                 className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
//               >
//                 💾 حفظ
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   )
// }











// import { useState, useEffect } from 'react'
// import Layout from '../components/Layout'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function UsersPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)

//   // Add User Modal
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [newUser, setNewUser] = useState({
//     name: '',
//     username: '',
//     email: '',
//     password: '',
//     role: 'cashier',
//   })

//   // Permissions Modal
//   const [showPermModal, setShowPermModal] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [selectedPerms, setSelectedPerms] = useState([])

//   // Search
//   const [search, setSearch] = useState('')

//   const API_URL = 'http://localhost:5000/api/users'
//   const PERMS_LIST = [
//     { key: 'view_reports', label: 'عرض التقارير' },
//     { key: 'add_sale', label: 'إضافة عملية بيع' },
//     { key: 'manage_medicines', label: 'إدارة الأدوية' },
//     { key: 'manage_users', label: 'إدارة المستخدمين' },
//     { key: 'view_inventory', label: 'عرض المخزون' },
//   ]

//   // Load users
//   const loadUsers = async () => {
//     try {
//       setLoading(true)
//       const res = await fetch(API_URL)
//       const data = await res.json()
//       setUsers(Array.isArray(data) ? data : [])
//     } catch (e) {
//       console.error(e)
//       toast.error('فشل في تحميل المستخدمين')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadUsers()
//   }, [])

//   // Open Add User
//   const openAddModal = () => {
//     setNewUser({ name: '', username: '', email: '', password: '', role: 'cashier' })
//     setShowAddModal(true)
//   }

//   // Add User
//   const addUser = async () => {
//     try {
//       if (!newUser.name || !newUser.username || !newUser.password) {
//         return toast.error('يرجى تعبئة الاسم واسم المستخدم وكلمة المرور')
//       }
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newUser),
//       })
//       if (!res.ok) throw new Error('فشل إضافة المستخدم')
//       toast.success('✅ تم إضافة المستخدم')
//       setShowAddModal(false)
//       await loadUsers()
//     } catch (e) {
//       console.error(e)
//       toast.error('حدث خطأ أثناء الإضافة')
//     }
//   }

//   // 🔄 تفعيل / تعطيل المستخدم
// const toggleActive = async (id) => {
//   try {
//     const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' })
//     if (!res.ok) throw new Error('فشل تحديث الحالة')

//     const data = await res.json()
//     setUsers((prev) =>
//       prev.map((u) => (u.id === id ? { ...u, active: data.active } : u))
//     )
//     toast.success(`تم ${data.active ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح ✅`)
//   } catch (err) {
//     console.error(err)
//     toast.error('حدث خطأ أثناء تحديث الحالة ❌')
//   }
// }


//   // Toggle Active
//   // const toggleActive = async (u) => {
//   //   try {
//   //     const next = !u.active
//   //     const res = await fetch(`${API_URL}/${u.id}/active`, {
//   //       method: 'PATCH',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({ active: next }),
//   //     })
//   //     if (!res.ok) throw new Error()
//   //     toast.success(next ? '🔓 تم تفعيل الحساب' : '🔒 تم تعطيل الحساب')
//   //     await loadUsers()
//   //   } catch {
//   //     toast.error('تعذر تعديل حالة الحساب')
//   //   }
//   // }

//   // Delete User

//   // 🗑️ حذف مستخدم
// const deleteUser = async (u) => {
//   try {
//     if (!confirm(`هل تريد حذف المستخدم: ${u.name} ؟`)) return
//     const res = await fetch(`${API_URL}/${u.id}`, { method: 'DELETE' })
//     if (!res.ok) throw new Error()
//     toast.success('🗑️ تم الحذف')
//     await loadUsers()
//   } catch {
//     toast.error('تعذر حذف المستخدم')
//   }
// }


//   // Open Permissions Modal
//   const openPerms = async (u) => {
//     try {
//       setSelectedUser(u)
//       setSelectedPerms([])

//       // نحاول جلب صلاحيات المستخدم من الباك إند (لو متاحة)
//       // متوقع: GET /api/users/:id/permissions -> { permissions: string[] }
//       const res = await fetch(`${API_URL}/${u.id}/permissions`)
//       if (res.ok) {
//         const data = await res.json()
//         setSelectedPerms(Array.isArray(data.permissions) ? data.permissions : [])
//       } else {
//         // لو ما في اندبوينت، نقرأ من خاصية permissions إن وجدت داخل users list
//         setSelectedPerms(Array.isArray(u.permissions) ? u.permissions : [])
//       }
//       setShowPermModal(true)
//     } catch (e) {
//       console.error(e)
//       toast.error('تعذر جلب الصلاحيات')
//     }
//   }

//   // Save Permissions
//   const savePerms = async () => {
//     if (!selectedUser) return
//     try {
//       const res = await fetch(`${API_URL}/${selectedUser.id}/permissions`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ permissions: selectedPerms }),
//       })
//       if (!res.ok) throw new Error()
//       toast.success('🔐 تم حفظ الصلاحيات')
//       setShowPermModal(false)
//       await loadUsers()
//     } catch {
//       toast.error('تعذر حفظ الصلاحيات')
//     }
//   }

//   // Filters
//   const filtered = users.filter((u) =>
//     (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
//     (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
//     (u.email || '').toLowerCase().includes(search.toLowerCase())
//   )

//   return (
//     <Layout user={user} title="👥 إدارة المستخدمين">
//       <div dir="rtl" className="space-y-6">
//         {/* شريط التحكم */}
//         <div className="flex flex-col gap-2 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
//           <input
//             type="text"
//             placeholder="🔍 بحث (الاسم / اسم المستخدم / البريد)"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full px-3 py-2 text-sm border rounded-md md:w-1/3"
//           />
//           <button
//             onClick={openAddModal}
//             className="px-4 py-2 text-sm text-white rounded-md shadow"
//             style={{ background: theme.colors.success }}
//           >
//             ➕ إضافة مستخدم
//           </button>
//         </div>

//         {/* الجدول */}
//         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right border-t border-gray-100 min-w-[980px]">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">اسم المستخدم</th>
//                 <th className="px-3 py-2">البريد الإلكتروني</th>
//                 <th className="px-3 py-2">الدور</th>
//                 <th className="px-3 py-2">الحالة</th>
//                 <th className="px-3 py-2 text-center">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={7}>جارٍ التحميل…</td></tr>
//               ) : filtered.length ? (
//                 filtered.map((u, i) => (
//                   <tr key={u.id} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{i + 1}</td>
//                     <td className="px-3 py-2">{u.name}</td>
//                     <td className="px-3 py-2">{u.username}</td>
//                     <td className="px-3 py-2">{u.email}</td>
//                     <td className="px-3 py-2">{u.role}</td>
//                     <td className="px-3 py-2">
//                       <span
//                         className={`px-2 py-1 text-xs rounded-md ${
//                           u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
//                         }`}
//                       >
//                         {u.active ? 'نشط' : 'معطل'}
//                       </span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <div className="flex flex-wrap justify-center gap-2">
//                         <button
//                           onClick={() => openPerms(u)}
//                           className="px-3 py-1 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
//                           title="تعديل الصلاحيات"
//                         >
//                           ⚙️ صلاحيات
//                         </button>
//                         <button
//                           onClick={() => toggleActive(u)}
//                           className={`px-3 py-1 text-sm rounded-md ${
//                             u.active
//                               ? 'bg-red-100 text-red-600 hover:bg-red-200'
//                               : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
//                           }`}
//                           title={u.active ? 'تعطيل' : 'تفعيل'}
//                         >
//                           {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
//                         </button>
//                         <button
//                           onClick={() => deleteUser(u)}
//                           className="px-3 py-1 text-sm text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50"
//                           title="حذف"
//                         >
//                           🗑️ حذف
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={7}>لا توجد نتائج</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* مودال إضافة مستخدم */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
//             <h2 className="mb-3 text-lg font-bold text-center text-gray-800">➕ إضافة مستخدم جديد</h2>
//             <div className="space-y-3 text-sm">
//               <Field label="الاسم الكامل">
//                 <input
//                   type="text"
//                   value={newUser.name}
//                   onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </Field>
//               <Field label="اسم المستخدم">
//                 <input
//                   type="text"
//                   value={newUser.username}
//                   onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </Field>
//               <Field label="البريد الإلكتروني">
//                 <input
//                   type="email"
//                   value={newUser.email}
//                   onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </Field>
//               <Field label="كلمة المرور">
//                 <input
//                   type="password"
//                   value={newUser.password}
//                   onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </Field>
//               <Field label="الدور">
//                 <select
//                   value={newUser.role}
//                   onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-md"
//                 >
//                   <option value="admin">مدير</option>
//                   <option value="pharmacist">صيدلي</option>
//                   <option value="cashier">كاشير</option>
//                 </select>
//               </Field>
//             </div>

//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
//               >
//                 إلغاء
//               </button>
//               <button
//                 onClick={addUser}
//                 className="px-4 py-2 text-sm text-white rounded-md"
//                 style={{ background: theme.colors.success }}
//               >
//                 حفظ المستخدم
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* مودال الصلاحيات */}
//       {showPermModal && selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
//             <h3 className="mb-2 text-lg font-semibold text-center text-gray-800">
//               🔐 صلاحيات: <span className="text-sky-600">{selectedUser.name}</span>
//             </h3>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               {PERMS_LIST.map((perm) => (
//                 <label key={perm.key} className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedPerms.includes(perm.key)}
//                     onChange={(e) => {
//                       const checked = e.target.checked
//                       setSelectedPerms((prev) =>
//                         checked ? [...prev, perm.key] : prev.filter((p) => p !== perm.key)
//                       )
//                     }}
//                   />
//                   <span>{perm.label}</span>
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() => setShowPermModal(false)}
//                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
//               >
//                 إغلاق
//               </button>
//               <button
//                 onClick={savePerms}
//                 className="px-4 py-2 text-sm text-white rounded-md"
//                 style={{ background: theme.colors.primary }}
//               >
//                 حفظ الصلاحيات
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   )
// }

// /* ============ عناصر مساعدة بسيطة ============ */
// function Field({ label, children }) {
//   return (
//     <div>
//       <label className="block mb-1 text-gray-600">{label}</label>
//       {children}
//     </div>
//   )
// }





// import { useState, useEffect } from 'react'
// import Layout from '../components/Layout'
// import toast from 'react-hot-toast'

// export default function UsersPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [users, setUsers] = useState([])
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [showModal, setShowModal] = useState(false)
//   const [search, setSearch] = useState('')
//   const API_URL = 'http://localhost:5000/api/users'

//   // 🧾 تحميل المستخدمين من الباك-إند
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch(API_URL)
//         const data = await res.json()
//         if (!res.ok) throw new Error(data.message)
//         setUsers(data)
//       } catch (err) {
//         console.error(err)
//         toast.error('فشل تحميل المستخدمين')
//       }
//     }
//     fetchUsers()
//   }, [])

//   // 🔹 جميع الصلاحيات الممكنة
//   const allPermissions = [
//     { key: 'view_reports', label: 'عرض التقارير' },
//     { key: 'add_sale', label: 'إضافة عملية بيع' },
//     { key: 'manage_medicines', label: 'إدارة الأدوية' },
//     { key: 'manage_users', label: 'إدارة المستخدمين' },
//     { key: 'view_inventory', label: 'عرض المخزون' },
//   ]

//   // ➕ إضافة مستخدم جديد
//   const addUser = async () => {
//     try {
//       const newUser = {
//         name: `مستخدم ${users.length + 1}`,
//         username: `user${users.length + 1}`,
//         email: `user${users.length + 1}@pharmacy.com`,
//         password: '123456',
//         role: 'cashier',
//       }

//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newUser),
//       })

//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message)

//       toast.success('✅ تم إضافة المستخدم بنجاح')
//       setUsers((prev) => [...prev, { ...newUser, id: data.id, active: 1, permissions: ['add_sale'] }])
//     } catch (err) {
//       toast.error('فشل إضافة المستخدم')
//       console.error(err)
//     }
//   }

//   // 🔒 تفعيل / تعطيل المستخدم
//   const toggleActive = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message)
//       setUsers((prev) =>
//         prev.map((u) => (u.id === id ? { ...u, active: data.active } : u))
//       )
//       toast.success('✅ تم تحديث الحالة')
//     } catch (err) {
//       toast.error('فشل تحديث الحالة')
//       console.error(err)
//     }
//   }

//   // ⚙️ فتح نافذة الصلاحيات
//   const openPermissionsModal = (user) => {
//     setSelectedUser({ ...user })
//     setShowModal(true)
//   }

//   // 💾 حفظ الصلاحيات
//   const savePermissions = async () => {
//     try {
//       const res = await fetch(`${API_URL}/${selectedUser.id}/permissions`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ permissions: selectedUser.permissions }),
//       })
//       if (!res.ok) throw new Error('خطأ في الحفظ')

//       setUsers((prev) =>
//         prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
//       )
//       toast.success('🔐 تم حفظ الصلاحيات')
//       setShowModal(false)
//     } catch (err) {
//       toast.error('فشل حفظ الصلاحيات')
//       console.error(err)
//     }
//   }

//   // 🔍 فلترة المستخدمين
//   const filteredUsers = users.filter((u) =>
//     u.name.toLowerCase().includes(search.toLowerCase())
//   )

//   return (
//     <Layout user={user} title="👥 إدارة المستخدمين">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔹 شريط الأدوات */}
//         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between bg-gradient-to-br from-sky-50 to-white">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="🔍 بحث عن مستخدم..."
//             className="w-full px-3 py-2 text-sm border rounded-md md:w-1/3"
//           />
//           <button
//             onClick={addUser}
//             className="px-4 py-2 text-sm text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700"
//           >
//             ➕ إضافة مستخدم
//           </button>
//         </div>

//         {/* 🔹 جدول المستخدمين */}
//         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right border-t border-gray-100">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">الدور</th>
//                 <th className="px-3 py-2">البريد</th>
//                 <th className="px-3 py-2">الحالة</th>
//                 <th className="px-3 py-2">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((u, idx) => (
//                 <tr key={u.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{idx + 1}</td>
//                   <td className="px-3 py-2 font-medium text-gray-700">{u.name}</td>
//                   <td className="px-3 py-2">
//                     {u.role === 'admin'
//                       ? 'مدير'
//                       : u.role === 'pharmacist'
//                       ? 'صيدلي'
//                       : 'كاشير'}
//                   </td>
//                   <td className="px-3 py-2">{u.email}</td>
//                   <td className="px-3 py-2">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-md ${
//                         u.active
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-red-100 text-red-600'
//                       }`}
//                     >
//                       {u.active ? 'نشط' : 'معطل'}
//                     </span>
//                   </td>
//                   <td className="flex flex-wrap gap-2 px-3 py-2">
//                     <button
//                       onClick={() => openPermissionsModal(u)}
//                       className="px-3 py-1 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
//                     >
//                       ⚙️ صلاحيات
//                     </button>
//                     <button
//                       onClick={() => toggleActive(u.id)}
//                       className={`px-3 py-1 text-sm rounded-md ${
//                         u.active
//                           ? 'bg-red-100 text-red-600 hover:bg-red-200'
//                           : 'bg-green-100 text-green-600 hover:bg-green-200'
//                       }`}
//                     >
//                       {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {filteredUsers.length === 0 && (
//             <div className="p-6 text-center text-gray-500">لا توجد نتائج مطابقة.</div>
//           )}
//         </div>

//         {/* 🔹 نافذة تعديل الصلاحيات */}
//         {showModal && selectedUser && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//             <div className="w-full max-w-lg p-6 space-y-4 bg-white rounded-lg shadow-lg">
//               <h3 className="text-lg font-semibold text-center text-gray-800">
//                 🔐 تعديل صلاحيات المستخدم:{" "}
//                 <span className="text-sky-600">{selectedUser.name}</span>
//               </h3>
//               <div className="grid grid-cols-2 gap-3">
//                 {allPermissions.map((perm) => (
//                   <label key={perm.key} className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedUser.permissions.includes(perm.key)}
//                       onChange={(e) => {
//                         const checked = e.target.checked
//                         setSelectedUser((prev) => ({
//                           ...prev,
//                           permissions: checked
//                             ? [...prev.permissions, perm.key]
//                             : prev.permissions.filter((p) => p !== perm.key),
//                         }))
//                       }}
//                     />
//                     <span>{perm.label}</span>
//                   </label>
//                 ))}
//               </div>
//               <div className="flex justify-end gap-2 pt-3 border-t">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
//                 >
//                   إلغاء
//                 </button>
//                 <button
//                   onClick={savePermissions}
//                   className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
//                 >
//                   💾 حفظ
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   )
// }








// // pages/users.js
// import { useState, useEffect } from 'react'
// import Layout from '../components/Layout'
// import toast from 'react-hot-toast'
// import theme from '../theme'

// export default function UsersPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [users, setUsers] = useState([])
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [showModal, setShowModal] = useState(false)
//   const [search, setSearch] = useState('')

//   const API_URL = 'http://localhost:5000/api/users'

//   // 🧾 تحميل البيانات من الباك إند
//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   const fetchUsers = async () => {
//     try {
//       const res = await fetch(API_URL)
//       const data = await res.json()
//       setUsers(data)
//     } catch (err) {
//       toast.error('❌ فشل تحميل المستخدمين')
//     }
//   }

//   // ➕ إضافة مستخدم جديد
//   const addUser = async () => {
//     try {
//       const newUser = {
//         name: 'مستخدم جديد',
//         username: 'user' + Date.now(),
//         email: `user${Date.now()}@pharmacy.com`,
//         password: '123456',
//         role: 'cashier',
//       }
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newUser),
//       })
//       if (!res.ok) throw new Error()
//       toast.success('✅ تم إضافة المستخدم بنجاح')
//       fetchUsers()
//     } catch {
//       toast.error('⚠️ فشل إضافة المستخدم')
//     }
//   }

//   // ⚙️ فتح نافذة تعديل الصلاحيات
//   const openPermissionsModal = (user) => {
//     setSelectedUser({ ...user })
//     setShowModal(true)
//   }

//   // 💾 حفظ الصلاحيات
//   const savePermissions = async () => {
//     try {
//       const res = await fetch(`${API_URL}/${selectedUser.id}/permissions`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ permissions: selectedUser.permissions }),
//       })
//       if (!res.ok) throw new Error()
//       toast.success('🔐 تم حفظ الصلاحيات بنجاح')
//       setShowModal(false)
//       fetchUsers()
//     } catch {
//       toast.error('❌ فشل تحديث الصلاحيات')
//     }
//   }

//   // 🔄 تفعيل / تعطيل المستخدم
//   const toggleActive = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' })
//       if (!res.ok) throw new Error()
//       toast.success('✅ تم تحديث الحالة')
//       fetchUsers()
//     } catch {
//       toast.error('❌ خطأ في التحديث')
//     }
//   }

//   // الصلاحيات الممكنة
//   const allPermissions = [
//     { key: 'view_reports', label: 'عرض التقارير' },
//     { key: 'add_sale', label: 'إضافة عملية بيع' },
//     { key: 'manage_medicines', label: 'إدارة الأدوية' },
//     { key: 'manage_users', label: 'إدارة المستخدمين' },
//     { key: 'view_inventory', label: 'عرض المخزون' },
//   ]

//   const filtered = users.filter((u) =>
//     u.name.toLowerCase().includes(search.toLowerCase())
//   )

//   return (
//     <Layout user={user} title="👥 إدارة المستخدمين">
//       <div dir="rtl" className="space-y-6">
//         {/* البحث + إضافة */}
//         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm md:flex-row md:justify-between bg-gradient-to-br from-sky-50 to-white">
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="🔍 بحث..."
//             className="px-3 py-2 text-sm border rounded-md md:w-1/3"
//           />
//           <button
//             onClick={addUser}
//             className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
//           >
//             ➕ إضافة مستخدم
//           </button>
//         </div>

//         {/* جدول المستخدمين */}
//         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">الدور</th>
//                 <th className="px-3 py-2">البريد الإلكتروني</th>
//                 <th className="px-3 py-2">الحالة</th>
//                 <th className="px-3 py-2">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((u, i) => (
//                 <tr key={u.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{i + 1}</td>
//                   <td className="px-3 py-2">{u.name}</td>
//                   <td className="px-3 py-2">
//                     {u.role === 'admin'
//                       ? 'مدير'
//                       : u.role === 'pharmacist'
//                       ? 'صيدلي'
//                       : 'كاشير'}
//                   </td>
//                   <td className="px-3 py-2">{u.email}</td>
//                   <td className="px-3 py-2">
//                     <span
//                       className={`px-2 py-1 rounded text-xs ${
//                         u.active
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-red-100 text-red-600'
//                       }`}
//                     >
//                       {u.active ? 'نشط' : 'معطل'}
//                     </span>
//                   </td>
//                   <td className="flex gap-2 px-3 py-2">
//                     <button
//                       onClick={() => openPermissionsModal(u)}
//                       className="px-3 py-1 text-white rounded-md bg-sky-600 hover:bg-sky-700"
//                     >
//                       ⚙️ صلاحيات
//                     </button>
//                     <button
//                       onClick={() => toggleActive(u.id)}
//                       className={`px-3 py-1 rounded-md ${
//                         u.active
//                           ? 'bg-red-100 text-red-600 hover:bg-red-200'
//                           : 'bg-green-100 text-green-600 hover:bg-green-200'
//                       }`}
//                     >
//                       {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* نافذة الصلاحيات */}
//         {showModal && selectedUser && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//             <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
//               <h3 className="mb-4 text-lg font-bold text-center">
//                 🔐 صلاحيات {selectedUser.name}
//               </h3>
//               <div className="grid grid-cols-2 gap-3">
//                 {allPermissions.map((perm) => (
//                   <label key={perm.key} className="flex gap-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedUser.permissions?.includes(perm.key)}
//                       onChange={(e) => {
//                         const checked = e.target.checked
//                         setSelectedUser((prev) => ({
//                           ...prev,
//                           permissions: checked
//                             ? [...prev.permissions, perm.key]
//                             : prev.permissions.filter((p) => p !== perm.key),
//                         }))
//                       }}
//                     />
//                     {perm.label}
//                   </label>
//                 ))}
//               </div>
//               <div className="flex justify-end gap-2 mt-5">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//                 >
//                   إلغاء
//                 </button>
//                 <button
//                   onClick={savePermissions}
//                   className="px-4 py-2 text-white rounded bg-sky-600 hover:bg-sky-700"
//                 >
//                   حفظ
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   )
// }







// import { useState, useEffect } from 'react'
// import Layout from '../components/Layout'
// import theme from '../theme'
// import toast from 'react-hot-toast'

// export default function UsersPage() {
//   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
//   const [users, setUsers] = useState([])
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [showModal, setShowModal] = useState(false)
//   const [search, setSearch] = useState('')

//   // 🔹 بيانات المستخدمين
//   useEffect(() => {
//     setUsers([
//       {
//         id: 1,
//         name: 'أحمد',
//         role: 'pharmacist',
//         email: 'ahmed@pharmacy.com',
//         active: true,
//         permissions: ['view_reports', 'add_sale', 'manage_medicines'],
//       },
//       {
//         id: 2,
//         name: 'محمد',
//         role: 'cashier',
//         email: 'mohamed@pharmacy.com',
//         active: true,
//         permissions: ['add_sale'],
//       },
//       {
//         id: 3,
//         name: 'مها',
//         role: 'admin',
//         email: 'maha@pharmacy.com',
//         active: true,
//         permissions: ['view_reports', 'manage_medicines', 'manage_users'],
//       },
//     ])
//   }, [])

//   // 🔹 الصلاحيات المتاحة
//   const allPermissions = [
//     { key: 'view_reports', label: 'عرض التقارير' },
//     { key: 'add_sale', label: 'إضافة عملية بيع' },
//     { key: 'manage_medicines', label: 'إدارة الأدوية' },
//     { key: 'manage_users', label: 'إدارة المستخدمين' },
//     { key: 'view_inventory', label: 'عرض المخزون' },
//   ]

//   // 🔸 تفعيل/تعطيل الحساب
//   const toggleActive = (id) => {
//     setUsers((prev) =>
//       prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
//     )
//     toast.success('✅ تم تحديث حالة الحساب بنجاح')
//   }

//   // 🔸 فتح نافذة تعديل الصلاحيات
//   const openPermissionsModal = (user) => {
//     setSelectedUser({ ...user })
//     setShowModal(true)
//   }

//   // 🔸 حفظ التعديلات
//   const savePermissions = () => {
//     setUsers((prev) =>
//       prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
//     )
//     setShowModal(false)
//     toast.success('🔐 تم حفظ الصلاحيات بنجاح')
//   }

//   // 🔸 إضافة مستخدم جديد
//   const addUser = () => {
//     const newUser = {
//       id: Date.now(),
//       name: 'مستخدم جديد',
//       role: 'cashier',
//       email: `user${users.length + 1}@pharmacy.com`,
//       active: true,
//       permissions: ['add_sale'],
//     }
//     setUsers([...users, newUser])
//     toast.success('👤 تم إضافة مستخدم جديد')
//   }

//   // 🔹 فلترة المستخدمين
//   const filteredUsers = users.filter((u) =>
//     u.name.toLowerCase().includes(search.toLowerCase())
//   )

//   return (
//     <Layout user={user} title="👥 إدارة المستخدمين">
//       <div dir="rtl" className="space-y-6">
//         {/* 🔹 شريط التحكم */}
//         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between bg-gradient-to-br from-sky-50 to-white">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="🔍 بحث عن مستخدم..."
//             className="w-full px-3 py-2 text-sm border rounded-md md:w-1/3"
//           />
//           <button
//             onClick={addUser}
//             className="px-4 py-2 text-sm text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700"
//           >
//             ➕ إضافة مستخدم
//           </button>
//         </div>

//         {/* 🔹 جدول المستخدمين */}
//         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//           <table className="w-full text-sm text-right border-t border-gray-100">
//             <thead className="text-gray-600 bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2">#</th>
//                 <th className="px-3 py-2">الاسم</th>
//                 <th className="px-3 py-2">الدور</th>
//                 <th className="px-3 py-2">البريد الإلكتروني</th>
//                 <th className="px-3 py-2">الحالة</th>
//                 <th className="px-3 py-2">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((u, idx) => (
//                 <tr key={u.id} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{idx + 1}</td>
//                   <td className="px-3 py-2 font-medium text-gray-700">{u.name}</td>
//                   <td className="px-3 py-2">{u.role === 'admin' ? 'مدير' : u.role === 'pharmacist' ? 'صيدلي' : 'كاشير'}</td>
//                   <td className="px-3 py-2 text-gray-600">{u.email}</td>
//                   <td className="px-3 py-2">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-md ${
//                         u.active
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-red-100 text-red-600'
//                       }`}
//                     >
//                       {u.active ? 'نشط' : 'معطل'}
//                     </span>
//                   </td>
//                   <td className="flex flex-wrap gap-2 px-3 py-2">
//                     <button
//                       onClick={() => openPermissionsModal(u)}
//                       className="px-3 py-1 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
//                     >
//                       ⚙️ صلاحيات
//                     </button>
//                     <button
//                       onClick={() => toggleActive(u.id)}
//                       className={`px-3 py-1 text-sm rounded-md ${
//                         u.active
//                           ? 'bg-red-100 text-red-600 hover:bg-red-200'
//                           : 'bg-green-100 text-green-600 hover:bg-green-200'
//                       }`}
//                     >
//                       {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredUsers.length === 0 && (
//             <div className="p-6 text-center text-gray-500">لا توجد نتائج مطابقة.</div>
//           )}
//         </div>

//         {/* 🔹 نافذة تعديل الصلاحيات */}
//         {showModal && selectedUser && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//             <div className="w-full max-w-lg p-6 space-y-4 bg-white rounded-lg shadow-lg">
//               <h3 className="text-lg font-semibold text-center text-gray-800">
//                 🔐 تعديل صلاحيات المستخدم: <span className="text-sky-600">{selectedUser.name}</span>
//               </h3>
//               <div className="grid grid-cols-2 gap-3">
//                 {allPermissions.map((perm) => (
//                   <label key={perm.key} className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedUser.permissions.includes(perm.key)}
//                       onChange={(e) => {
//                         const checked = e.target.checked
//                         setSelectedUser((prev) => ({
//                           ...prev,
//                           permissions: checked
//                             ? [...prev.permissions, perm.key]
//                             : prev.permissions.filter((p) => p !== perm.key),
//                         }))
//                       }}
//                     />
//                     <span>{perm.label}</span>
//                   </label>
//                 ))}
//               </div>
//               <div className="flex justify-end gap-2 pt-3 border-t">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
//                 >
//                   إلغاء
//                 </button>
//                 <button
//                   onClick={savePermissions}
//                   className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
//                 >
//                   💾 حفظ
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   )
// }
