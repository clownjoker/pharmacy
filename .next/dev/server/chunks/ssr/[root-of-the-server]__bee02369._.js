module.exports = [
"[project]/pages/users.js [ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

// src/routes/users.js
const express = (()=>{
    const e = new Error("Cannot find module 'express'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const bcrypt = (()=>{
    const e = new Error("Cannot find module 'bcryptjs'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const db = (()=>{
    const e = new Error("Cannot find module '../db'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const router = express.Router();
// 🧩 دالة تربط الصلاحيات مع المستخدمين
async function attachPermissionsToUsers(users) {
    if (!users || !users.length) return users;
    const ids = users.map((u)=>u.id);
    const placeholders = ids.map(()=>'?').join(',');
    const [rows] = await db.query(`SELECT user_id, permission_key 
     FROM user_permissions 
     WHERE user_id IN (${placeholders})`, ids);
    const map = {};
    rows.forEach((row)=>{
        if (!map[row.user_id]) map[row.user_id] = [];
        map[row.user_id].push(row.permission_key);
    });
    return users.map((u)=>({
            ...u,
            permissions: map[u.id] || []
        }));
}
// 🟢 جلب المستخدمين
router.get('/', async (req, res)=>{
    try {
        const [rows] = await db.query('SELECT id, name, username, email, role, active, created_at FROM users ORDER BY id ASC');
        const usersWithPerms = await attachPermissionsToUsers(rows);
        res.json(usersWithPerms);
    } catch (err) {
        console.error('GET /users error:', err);
        res.status(500).json({
            message: 'خطأ في جلب المستخدمين'
        });
    }
});
// ➕ إضافة مستخدم
router.post('/', async (req, res)=>{
    try {
        const { name, username, email, password, role } = req.body;
        if (!name || !username || !password) {
            return res.status(400).json({
                message: 'الحقول الأساسية مطلوبة'
            });
        }
        const safeRole = [
            'admin',
            'pharmacist',
            'cashier'
        ].includes(role) ? role : 'cashier';
        // التأكد من عدم تكرار اسم المستخدم
        const [existing] = await db.query('SELECT id FROM users WHERE username = ? LIMIT 1', [
            username
        ]);
        if (existing.length) {
            return res.status(409).json({
                message: 'اسم المستخدم مستخدم مسبقًا'
            });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        // ملاحظة: نخزن الباسورد المشفّر في عمود "password"
        const [result] = await db.query(`INSERT INTO users (name, username, email, password, role, active)
       VALUES (?,?,?,?,?,1)`, [
            name,
            username,
            email || null,
            passwordHash,
            safeRole
        ]);
        const [rows] = await db.query('SELECT id, name, username, email, role, active, created_at FROM users WHERE id = ?', [
            result.insertId
        ]);
        const [userWithPerms] = await attachPermissionsToUsers(rows);
        res.status(201).json(userWithPerms);
    } catch (err) {
        console.error('POST /users error:', err);
        res.status(500).json({
            message: 'خطأ في إنشاء المستخدم'
        });
    }
});
// 🔄 تفعيل / تعطيل مستخدم
router.patch('/:id/toggle', async (req, res)=>{
    try {
        const userId = parseInt(req.params.id, 10);
        const [rows] = await db.query('SELECT active FROM users WHERE id = ?', [
            userId
        ]);
        if (!rows.length) {
            return res.status(404).json({
                message: 'المستخدم غير موجود'
            });
        }
        const current = rows[0].active ? 1 : 0;
        const next = current ? 0 : 1;
        await db.query('UPDATE users SET active = ? WHERE id = ?', [
            next,
            userId
        ]);
        res.json({
            id: userId,
            active: !!next
        });
    } catch (err) {
        console.error('PATCH /users/:id/toggle error:', err);
        res.status(500).json({
            message: 'خطأ في تحديث حالة المستخدم'
        });
    }
});
// 🗑️ حذف مستخدم
router.delete('/:id', async (req, res)=>{
    try {
        const userId = parseInt(req.params.id, 10);
        await db.query('DELETE FROM user_permissions WHERE user_id = ?', [
            userId
        ]);
        await db.query('DELETE FROM users WHERE id = ?', [
            userId
        ]);
        res.json({
            message: 'تم حذف المستخدم'
        });
    } catch (err) {
        console.error('DELETE /users/:id error:', err);
        res.status(500).json({
            message: 'خطأ في حذف المستخدم'
        });
    }
});
// 📥 جلب صلاحيات مستخدم واحد (اختياري لو احتجته)
router.get('/:id/permissions', async (req, res)=>{
    try {
        const userId = parseInt(req.params.id, 10);
        const [rows] = await db.query('SELECT permission_key FROM user_permissions WHERE user_id = ?', [
            userId
        ]);
        const perms = rows.map((r)=>r.permission_key);
        res.json({
            userId,
            permissions: perms
        });
    } catch (err) {
        console.error('GET /users/:id/permissions error:', err);
        res.status(500).json({
            message: 'خطأ في جلب الصلاحيات'
        });
    }
});
// 💾 حفظ الصلاحيات
router.put('/:id/permissions', async (req, res)=>{
    try {
        const userId = parseInt(req.params.id, 10);
        const { permissions } = req.body;
        if (!Array.isArray(permissions)) {
            return res.status(400).json({
                message: 'صيغة الصلاحيات غير صحيحة'
            });
        }
        // نحذف الصلاحيات القديمة
        await db.query('DELETE FROM user_permissions WHERE user_id = ?', [
            userId
        ]);
        // لو لا توجد صلاحيات جديدة → نرجع بنجاح
        if (!permissions.length) {
            return res.json({
                message: 'تم حفظ الصلاحيات (بدون أي صلاحيات)'
            });
        }
        // نجهز القيم للإدخال المتعدد
        const values = permissions.map((p)=>[
                userId,
                p
            ]);
        const placeholders = values.map(()=>'(?, ?)').join(' ');
        const flat = values.flat();
        await db.query(`INSERT INTO user_permissions (user_id, permission_key) VALUES ${placeholders}`, flat);
        res.json({
            message: 'تم حفظ الصلاحيات'
        });
    } catch (err) {
        console.error('PUT /users/:id/permissions error:', err);
        res.status(500).json({
            message: 'خطأ في حفظ الصلاحيات'
        });
    }
});
module.exports = router; // // pages/users.js
 // import { useMemo, useState,useEffect } from 'react'
 // import Layout from '../components/Layout'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // const ALL_PERMISSIONS = [
 //   { key: 'view_reports', label: 'عرض التقارير' },
 //   { key: 'add_sale', label: 'إضافة عملية بيع' },
 //   { key: 'manage_medicines', label: 'إدارة الأدوية' },
 //   { key: 'manage_users', label: 'إدارة المستخدمين' },
 //   { key: 'view_inventory', label: 'عرض المخزون' },
 // ]
 // const ROLE_LABELS = {
 //   admin: 'مدير النظام',
 //   pharmacist: 'صيدلي',
 //   cashier: 'كاشير',
 // }
 // const ROLE_DEFAULT_PERMISSIONS = {
 //   admin: ALL_PERMISSIONS.map((p) => p.key),
 //   pharmacist: ['manage_medicines', 'view_inventory', 'add_sale', 'view_reports'],
 //   cashier: ['add_sale'],
 // }
 // const loadUsers = async () => {
 //     try {
 //       const res = await api.get("/users");
 //       setUsers(res.data);
 //     } catch (err) {
 //       toast.error("خطأ في تحميل المستخدمين");
 //     }
 //   };
 //   useEffect(() => {
 //     loadUsers();
 //   }, []);
 // export default function UsersPage() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [users, setUsers] = useState([])
 //   const [search, setSearch] = useState('')
 //   const [showAddModal, setShowAddModal] = useState(false)
 //   const [showPermModal, setShowPermModal] = useState(false)
 //   const [newUser, setNewUser] = useState({
 //     name: '',
 //     username: '',
 //     email: '',
 //     password: '',
 //     role: 'cashier',
 //     active: true,
 //   })
 //   const [selectedUser, setSelectedUser] = useState(null)
 //   const [permDraft, setPermDraft] = useState([])
 //   const filteredUsers = useMemo(() => {
 //     const q = search.trim().toLowerCase()
 //     if (!q) return users
 //     return users.filter(
 //       (u) =>
 //         u.name?.toLowerCase().includes(q) ||
 //         u.username?.toLowerCase().includes(q) ||
 //         u.email?.toLowerCase().includes(q)
 //     )
 //   }, [users, search])
 //   const openAddModal = () => {
 //     setNewUser({
 //       name: '',
 //       username: '',
 //       email: '',
 //       password: '',
 //       role: 'cashier',
 //       active: true,
 //     })
 //     setShowAddModal(true)
 //   }
 //   const handleAddUser = async () => {
 //   if (!newUser.name || !newUser.username || !newUser.password) {
 //     toast.error("⚠️ يرجى إدخال جميع الحقول الأساسية");
 //     return;
 //   }
 //   try {
 //     const res = await api.post("/users", newUser);
 //     setUsers(prev => [...prev, res.data]);
 //     setShowAddModal(false);
 //     toast.success("تم إضافة المستخدم");
 //   } catch (err) {
 //     toast.error("فشل إنشاء المستخدم");
 //   }
 // };
 //   const toggleActive = async (id) => {
 //   try {
 //     const res = await api.patch(`/users/${id}/toggle`);
 //     setUsers(prev =>
 //       prev.map(u => u.id === id ? { ...u, active: res.data.active } : u)
 //     );
 //   } catch (err) {
 //     toast.error("خطأ في تغيير الحالة");
 //   }
 // };
 //  const deleteUser = async (id) => {
 //   if (!confirm("هل تريد حذف هذا المستخدم؟")) return;
 //   try {
 //     await api.delete(`/users/${id}`);
 //     setUsers(prev => prev.filter(u => u.id !== id));
 //   } catch (err) {
 //     toast.error("خطأ في الحذف");
 //   }
 // };
 //   const openPermModal = (u) => {
 //     setSelectedUser(u)
 //     setPermDraft(u.permissions || [])
 //     setShowPermModal(true)
 //   }
 //   const togglePermission = (key) => {
 //     setPermDraft((prev) =>
 //       prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
 //     )
 //   }
 //  const savePermissions = async () => {
 //   try {
 //     await api.put(`/users/${selectedUser.id}/permissions`, {
 //       permissions: permDraft,
 //     });
 //     toast.success("✔ تم حفظ الصلاحيات");
 //     loadUsers();
 //     setShowPermModal(false);
 //   } catch (err) {
 //     toast.error("❌ فشل حفظ الصلاحيات");
 //   }
 // };
 //   return (
 //     <Layout user={user} title="إدارة المستخدمين والصلاحيات">
 //       <div dir="rtl" className="space-y-6">
 //         {/* البحث + إضافة */}
 //         <div className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
 //           <input
 //             type="text"
 //             placeholder="بحث بالاسم / اسم المستخدم / البريد"
 //             value={search}
 //             onChange={(e) => setSearch(e.target.value)}
 //             className="w-full p-2 border rounded md:w-1/2"
 //           />
 //           <button
 //             onClick={openAddModal}
 //             className="px-4 py-2 text-white bg-green-600 rounded"
 //           >
 //             إضافة مستخدم
 //           </button>
 //         </div>
 //         {/* جدول */}
 //         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right min-w-[900px]">
 //             <thead className="text-xs bg-gray-50">
 //               <tr>
 //                 <th>#</th>
 //                 <th>الاسم</th>
 //                 <th>المستخدم</th>
 //                 <th>البريد</th>
 //                 <th>الدور</th>
 //                 <th>الحالة</th>
 //                 <th>الصلاحيات</th>
 //                 <th>إجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filteredUsers.map((u, i) => (
 //                 <tr key={u.id} className="border-t hover:bg-gray-50">
 //                   <td className="p-2">{i + 1}</td>
 //                   <td className="p-2">{u.name}</td>
 //                   <td className="p-2">{u.username}</td>
 //                   <td className="p-2">{u.email}</td>
 //                   <td className="p-2">
 //                     <span className="px-3 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
 //                       {ROLE_LABELS[u.role]}
 //                     </span>
 //                   </td>
 //                   <td className="p-2">
 //                     <span
 //                       className={`px-3 py-1 rounded-full text-xs ${
 //                         u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
 //                       }`}
 //                     >
 //                       {u.active ? 'مفعل' : 'موقوف'}
 //                     </span>
 //                   </td>
 //                   <td className="p-2 text-xs">
 //                     {u.permissions.map((p) => (
 //                       <span key={p} className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded mx-1">
 //                         {ALL_PERMISSIONS.find((x) => x.key === p)?.label}
 //                       </span>
 //                     ))}
 //                   </td>
 //                   <td className="flex flex-wrap justify-center gap-2 p-2">
 //                     <button
 //                       onClick={() => openPermModal(u)}
 //                       className="px-3 py-1 text-xs text-indigo-700 rounded bg-indigo-50"
 //                     >
 //                       صلاحيات
 //                     </button>
 //                     <button
 //                       onClick={() => toggleActive(u.id)}
 //                       className="px-3 py-1 text-xs text-yellow-700 rounded bg-yellow-50"
 //                     >
 //                       حالة
 //                     </button>
 //                     <button
 //                       onClick={() => deleteUser(u.id)}
 //                       className="px-3 py-1 text-xs text-red-700 bg-red-100 rounded"
 //                     >
 //                       حذف
 //                     </button>
 //                   </td>
 //                 </tr>
 //               ))}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* مودال إضافة مستخدم */}
 //         {showAddModal && (
 //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
 //             <div className="w-full max-w-md p-6 bg-white rounded" dir="rtl">
 //               <h2 className="mb-3 font-bold">إضافة مستخدم</h2>
 //               <Field label="الاسم الكامل">
 //                 <input
 //                   className="w-full p-2 border rounded"
 //                   value={newUser.name}
 //                   onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
 //                 />
 //               </Field>
 //               <Field label="اسم المستخدم">
 //                 <input
 //                   className="w-full p-2 border rounded"
 //                   value={newUser.username}
 //                   onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
 //                 />
 //               </Field>
 //               <Field label="البريد الإلكتروني">
 //                 <input
 //                   className="w-full p-2 border rounded"
 //                   value={newUser.email}
 //                   onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
 //                 />
 //               </Field>
 //               <Field label="كلمة المرور">
 //                 <input
 //                   type="password"
 //                   className="w-full p-2 border rounded"
 //                   value={newUser.password}
 //                   onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
 //                 />
 //               </Field>
 //               <Field label="الدور">
 //                 <select
 //                   className="w-full p-2 border rounded"
 //                   value={newUser.role}
 //                   onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
 //                 >
 //                   <option value="admin">مدير</option>
 //                   <option value="pharmacist">صيدلي</option>
 //                   <option value="cashier">كاشير</option>
 //                 </select>
 //               </Field>
 //               <div className="flex justify-end gap-2 mt-4">
 //                 <button
 //                   className="px-4 py-2 bg-gray-200 rounded"
 //                   onClick={() => setShowAddModal(false)}
 //                 >
 //                   إلغاء
 //                 </button>
 //                 <button
 //                   className="px-4 py-2 text-white bg-green-600 rounded"
 //                   onClick={handleAddUser}
 //                 >
 //                   حفظ
 //                 </button>
 //               </div>
 //             </div>
 //           </div>
 //         )}
 //         {/* مودال الصلاحيات */}
 //         {showPermModal && selectedUser && (
 //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
 //             <div className="w-full max-w-lg p-6 bg-white rounded" dir="rtl">
 //               <h2 className="mb-3 font-bold">صلاحيات: {selectedUser.name}</h2>
 //               <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
 //                 {ALL_PERMISSIONS.map((perm) => (
 //                   <label
 //                     key={perm.key}
 //                     className="flex items-center gap-2 p-2 border rounded"
 //                   >
 //                     <input
 //                       type="checkbox"
 //                       checked={permDraft.includes(perm.key)}
 //                       onChange={() => togglePermission(perm.key)}
 //                     />
 //                     {perm.label}
 //                   </label>
 //                 ))}
 //               </div>
 //               <div className="flex justify-end gap-2 mt-4">
 //                 <button
 //                   className="px-4 py-2 bg-gray-200 rounded"
 //                   onClick={() => setShowPermModal(false)}
 //                 >
 //                   إلغاء
 //                 </button>
 //                 <button
 //                   className="px-4 py-2 text-white bg-blue-600 rounded"
 //                   onClick={savePermissions}
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
 // function Field({ label, children }) {
 //   return (
 //     <div className="mb-3">
 //       <label className="block mb-1 text-xs text-gray-600">{label}</label>
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
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bee02369._.js.map