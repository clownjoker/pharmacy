module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/theme.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const theme = {
    colors: {
        primary: '#0ea5e9',
        secondary: '#10b981',
        danger: '#ef4444',
        success: '#22c55e'
    }
};
const __TURBOPACK__default__export__ = theme;
}),
"[project]/components/ConfirmModal.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConfirmModal
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function ConfirmModal({ visible, title, message, confirmText, confirmColor, onConfirm, onCancel }) {
    if (!visible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "w-full max-w-sm p-6 text-right bg-white rounded-lg shadow-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                    className: "mb-2 text-lg font-semibold text-gray-800",
                    children: title
                }, void 0, false, {
                    fileName: "[project]/components/ConfirmModal.js",
                    lineNumber: 7,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "mb-4 text-sm text-gray-600",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/components/ConfirmModal.js",
                    lineNumber: 8,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: onConfirm,
                            className: "px-4 py-2 text-white rounded-md hover:opacity-90",
                            style: {
                                backgroundColor: confirmColor || '#ef4444'
                            },
                            children: confirmText || 'تأكيد'
                        }, void 0, false, {
                            fileName: "[project]/components/ConfirmModal.js",
                            lineNumber: 11,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            className: "px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300",
                            children: "إلغاء"
                        }, void 0, false, {
                            fileName: "[project]/components/ConfirmModal.js",
                            lineNumber: 18,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ConfirmModal.js",
                    lineNumber: 10,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ConfirmModal.js",
            lineNumber: 6,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ConfirmModal.js",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/AuthGuard.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/AuthGuard.js
__turbopack_context__.s([
    "default",
    ()=>AuthGuard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
;
;
function AuthGuard({ children, allowedRoles = [], requiredPermissions = [] }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("checking"); // checking | allowed | denied
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        router,
        allowedRoles,
        requiredPermissions
    ]);
    if (status !== "allowed") return null;
    return children;
}
}),
"[project]/components/Header.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/Header.js
__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AuthContext.js [ssr] (ecmascript)");
;
;
;
;
;
function Header() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    if (!user) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
        dir: "rtl",
        className: "flex items-center justify-between p-4 bg-white border-b shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                onClick: ()=>router.push("/dashboard"),
                className: "flex items-center gap-2 cursor-pointer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center w-10 h-10 text-xl text-white rounded-lg shadow bg-sky-600",
                        children: "💊"
                    }, void 0, false, {
                        fileName: "[project]/components/Header.js",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                className: "text-lg font-bold text-gray-800",
                                children: "نظام الصيدلية الذكي"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 28,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "-mt-1 text-xs text-gray-500",
                                children: "Pharmacy Management"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Header.js",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Header.js",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setOpen(!open),
                        className: "flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-gray-800",
                                children: user.username
                            }, void 0, false, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 39,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: "👤"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Header.js",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute left-0 z-50 w-48 mt-2 overflow-hidden bg-white border rounded-lg shadow-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "px-4 py-2 text-sm text-gray-700 border-b bg-gray-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "font-semibold",
                                        children: user.username
                                    }, void 0, false, {
                                        fileName: "[project]/components/Header.js",
                                        lineNumber: 46,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: user.role === "admin" ? "👑 مدير النظام" : user.role === "pharmacist" ? "💊 صيدلي" : "💵 كاشير"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Header.js",
                                        lineNumber: 47,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 45,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/profile",
                                className: "block px-4 py-2 text-sm hover:bg-gray-50",
                                children: "🧑‍⚕️ الملف الشخصي"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setOpen(false);
                                    logout();
                                },
                                className: "w-full px-4 py-2 text-sm text-right text-red-600 hover:bg-red-50",
                                children: "🚪 تسجيل الخروج"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Header.js",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Header.js",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Header.js",
        lineNumber: 15,
        columnNumber: 5
    }, this);
} // import { useState, useEffect } from 'react'
 // import { Menu } from 'lucide-react'
 // export default function Header() {
 //   const [user, setUser] = useState(null)
 //   const [menuOpen, setMenuOpen] = useState(false)
 //   useEffect(() => {
 //     const savedUser = localStorage.getItem('pharmacy_user')
 //     if (savedUser) {
 //       setUser(JSON.parse(savedUser))
 //     }
 //   }, [])
 //   const logout = () => {
 //     localStorage.removeItem('pharmacy_token')
 //     localStorage.removeItem('pharmacy_user')
 //     window.location.href = '/'
 //   }
 //   if (!user) return null
 //   return (
 //     <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm" dir="rtl">
 //       <h1 className="text-lg font-bold text-sky-700">💊 نظام إدارة الصيدلية</h1>
 //       <div className="relative">
 //         <button
 //           onClick={() => setMenuOpen(!menuOpen)}
 //           className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
 //         >
 //           <span className="text-gray-800">{user.name}</span>
 //           <Menu className="w-4 h-4 text-gray-600" />
 //         </button>
 //         {menuOpen && (
 //           <div className="absolute left-0 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
 //             <div className="px-4 py-2 text-sm text-gray-700 border-b bg-gray-50">
 //               <p className="font-semibold">{user.name}</p>
 //               <p className="text-xs text-gray-500">
 //                 {user.role === 'admin'
 //                   ? '👑 المدير'
 //                   : user.role === 'pharmacist'
 //                   ? '💊 الصيدلي'
 //                   : '💵 الكاشير'}
 //               </p>
 //             </div>
 //             <button
 //               onClick={logout}
 //               className="w-full px-4 py-2 text-sm text-right text-red-600 hover:bg-red-50"
 //             >
 //               🚪 تسجيل الخروج
 //             </button>
 //           </div>
 //         )}
 //       </div>
 //     </header>
 //   )
 // }
 // import { useRouter } from 'next/router'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // export default function Header({ user }) {
 //   const router = useRouter()
 //   const navConfig = {
 //     admin: [
 //       { name: '🏠 لوحة التحكم', path: '/dashboard' },
 //       { name: '📊 التقارير', path: '/reports' },
 //       { name: '⚙️ الصلاحيات', path: '/permissions' },
 //     ],
 //     pharmacist: [
 //       { name: '💊 الأدوية', path: '/pharmacist' },
 //       { name: '💰 المبيعات', path: '/sales' },
 //       { name: '⚠️ التنبيهات', path: '/alerts' },
 //     ],
 //     cashier: [
 //       { name: '🧾 نقطة البيع', path: '/cashier' },
 //       { name: '📄 تقرير اليوم', path: '/cashierReport' },
 //       { name: '💼 الوردية', path: '/shift' },
 //     ],
 //   }
 //   const role = user?.role || 'pharmacist'
 //   const links = navConfig[role]
 //   // const handleLogout = () => {
 //   //   toast.success('👋 تم تسجيل الخروج بنجاح')
 //   //   setTimeout(() => router.push('/'), 1200)
 //   // }
 //   const handleLogout = () => {
 //   localStorage.removeItem('pharmacy_token')
 //   localStorage.removeItem('pharmacy_user')
 //   window.location.href = '/'
 //     toast.success('👋 تم تسجيل الخروج بنجاح')
 // }
 //   return (
 //     <header
 //       dir="rtl"
 //       className="sticky top-0 z-40 w-full bg-white border-b shadow-sm"
 //       style={{
 //         borderColor: `${theme.colors.primary}20`,
 //       }}
 //     >
 //       <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 mx-auto sm:flex-row max-w-7xl">
 //         {/* شعار */}
 //         <div className="flex items-center gap-2">
 //           <div
 //             className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white rounded-md shadow"
 //             style={{ background: theme.colors.primary }}
 //           >
 //             💊
 //           </div>
 //           <div>
 //             <h1 className="text-lg font-bold text-gray-800">
 //               نظام الصيدلية الذكي
 //             </h1>
 //             <p className="text-xs text-gray-500 -mt-0.5">Pharmacy System</p>
 //           </div>
 //         </div>
 //         {/* روابط التنقل */}
 //         <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
 //           {links.map((item) => {
 //             const active = router.pathname === item.path
 //             return (
 //               <button
 //                 key={item.path}
 //                 onClick={() => router.push(item.path)}
 //                 className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${
 //                   active
 //                     ? 'text-white shadow-sm'
 //                     : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'
 //                 }`}
 //                 style={{
 //                   backgroundColor: active ? theme.colors.primary : 'transparent',
 //                   borderColor: active ? theme.colors.primary : '#e5e7eb',
 //                 }}
 //               >
 //                 {item.name}
 //               </button>
 //             )
 //           })}
 //         </nav>
 //         {/* معلومات المستخدم */}
 //         <div className="flex items-center gap-3">
 //           <div className="text-sm text-gray-700">
 //             مرحبًا، <span className="font-semibold text-sky-700">{user?.name}</span>
 //             <span className="ml-1 text-gray-500">({user?.role})</span>
 //           </div>
 //           <button
 //             onClick={handleLogout}
 //             className="px-3 py-1.5 text-sm text-white rounded-md border shadow-sm hover:opacity-90"
 //             style={{
 //               background: theme.colors.danger,
 //               borderColor: `${theme.colors.danger}80`,
 //             }}
 //           >
 //             تسجيل الخروج
 //           </button>
 //         </div>
 //       </div>
 //     </header>
 //   )
 // }
}),
"[project]/components/Layout.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/theme.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ConfirmModal$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ConfirmModal.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthGuard$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AuthGuard.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header.js [ssr] (ecmascript)");
;
;
;
;
;
;
;
;
function Layout({ user, title, children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [showLogoutModal, setShowLogoutModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const role = user?.role || "pharmacist";
    // روابط ثابتة (Frontend فقط)
    const navConfig = {
        admin: [
            {
                name: '🏠 لوحة التحكم',
                path: '/dashboard'
            },
            {
                name: '💊 الأدوية',
                path: '/pharmacist'
            },
            {
                name: '🧾 نقطة البيع',
                path: '/cashier'
            },
            {
                name: '📦 المخزن',
                path: '/inventory'
            },
            {
                name: '📊 التقارير',
                path: '/reports'
            },
            {
                name: '👥 المستخدمون',
                path: '/users'
            },
            {
                name: '👥 ',
                path: '/profile'
            }
        ],
        pharmacist: [
            {
                name: '💊 الأدوية',
                path: '/pharmacist'
            },
            {
                name: '📦 المخزون',
                path: '/inventory'
            },
            {
                name: '📊 تقارير المبيعات',
                path: '/reports'
            },
            {
                name: '👥 ',
                path: '/profile'
            }
        ],
        cashier: [
            {
                name: '🧾 نقطة البيع',
                path: '/cashier'
            },
            {
                name: '📄 التقرير اليومي',
                path: '/shift'
            },
            {
                name: '👥 ',
                path: '/profile'
            }
        ]
    };
    const links = navConfig[role] || [];
    const handleLogout = ()=>{
        localStorage.removeItem("pharmacy_user");
        router.replace("/");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthGuard$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            dir: "rtl",
            className: "flex flex-col min-h-screen bg-gray-50",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                    className: "sticky top-0 z-40 w-full bg-white border-b shadow-sm",
                    style: {
                        borderColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].colors.primary}20`
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-between gap-3 px-4 py-3 mx-auto sm:flex-row max-w-7xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center w-10 h-10 text-xl font-bold text-white rounded-md shadow",
                                        style: {
                                            background: __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].colors.primary
                                        },
                                        children: "💊"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Layout.js",
                                        lineNumber: 54,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                className: "text-lg font-bold text-gray-800",
                                                children: "نظام الصيدلية الذكي"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 61,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 -mt-0.5",
                                                children: "Pharmacy Management System"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 62,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Layout.js",
                                        lineNumber: 60,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Layout.js",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                                className: "flex flex-wrap justify-center gap-1 sm:gap-2",
                                children: links.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push(item.path),
                                        className: `px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${router.pathname === item.path ? 'text-white shadow-sm' : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'}`,
                                        style: {
                                            backgroundColor: router.pathname === item.path ? __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].colors.primary : 'transparent',
                                            borderColor: router.pathname === item.path ? __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].colors.primary : '#e5e7eb'
                                        },
                                        children: item.name
                                    }, item.path, false, {
                                        fileName: "[project]/components/Layout.js",
                                        lineNumber: 68,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/Layout.js",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-700",
                                        children: [
                                            "مرحبًا،",
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-sky-700",
                                                children: user?.name || 'مستخدم'
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 95,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "ml-1 text-gray-500",
                                                children: [
                                                    "(",
                                                    role === 'admin' ? 'مدير' : role === 'cashier' ? 'كاشير' : 'صيدلي',
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 98,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Layout.js",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowLogoutModal(true),
                                        className: "flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 border rounded-md shadow-sm",
                                        style: {
                                            backgroundColor: 'rgba(239, 68, 68, 0.85)',
                                            borderColor: 'rgba(239, 68, 68, 0.5)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaSignOutAlt"], {
                                                className: "text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 111,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: "تسجيل الخروج"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 112,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Layout.js",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Layout.js",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Layout.js",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Layout.js",
                    lineNumber: 48,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                    className: "flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8",
                    children: [
                        title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: "pb-2 mb-6 text-2xl font-bold text-gray-800 border-b border-gray-200",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/components/Layout.js",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        children
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Layout.js",
                    lineNumber: 118,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                    className: "py-3 mt-auto text-xs text-center text-gray-400 border-t border-gray-100",
                    children: [
                        "© ",
                        new Date().getFullYear(),
                        " نظام إدارة الصيدلية — جميع الحقوق محفوظة"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Layout.js",
                    lineNumber: 127,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ConfirmModal$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    visible: showLogoutModal,
                    title: "تأكيد تسجيل الخروج",
                    message: "هل ترغب في تسجيل الخروج من النظام؟",
                    confirmText: "تسجيل الخروج",
                    confirmColor: __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].colors.danger,
                    onConfirm: handleLogout,
                    onCancel: ()=>setShowLogoutModal(false)
                }, void 0, false, {
                    fileName: "[project]/components/Layout.js",
                    lineNumber: 131,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Layout.js",
            lineNumber: 47,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Layout.js",
        lineNumber: 46,
        columnNumber: 5
    }, this);
} // // components/Layout.js
 // import { useRouter } from 'next/router'
 // import { useEffect, useState } from 'react'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // import ConfirmModal from './ConfirmModal'
 // import { FaSignOutAlt } from 'react-icons/fa'
 // export default function Layout({ user, title, children }) {
 //   const router = useRouter()
 //   const [permissions, setPermissions] = useState([])
 //   const [showLogoutModal, setShowLogoutModal] = useState(false)
 //   useEffect(() => {
 //     const savedPerms = JSON.parse(localStorage.getItem('permissions')) || []
 //     setPermissions(savedPerms)
 //   }, [])
 //   // ✅ صلاحيات المستخدم (مدير أو حسب القائمة)
 //   const hasPermission = (key) => user?.role === 'admin' || permissions.includes(key)
 //   // const handleLogout = () => {
 //   //   localStorage.removeItem('permissions')
 //   //   toast.success('👋 تم تسجيل الخروج بنجاح')
 //   //   router.push('/')
 //   // }
 //   // const handleLogout = () => {
 //   //   // 🧹 تنظيف بيانات المستخدم
 //   //   localStorage.removeItem('pharmacy_user')
 //   //   // Cookies.remove('token')
 //   //   // Cookies.remove('user')
 //   //   toast.success('👋 تم تسجيل الخروج بنجاح')
 //   //   // ⏳ بعد نصف ثانية يرجع إلى صفحة تسجيل الدخول
 //   //   setTimeout(() => {
 //   //     router.push('/')
 //   //   }, 500)
 //   // }
 // //    const handleLogout = () => {
 // //   localStorage.removeItem('pharmacy_token')
 // //   localStorage.removeItem('pharmacy_user')
 // //   window.location.href = '/'
 // //     toast.success('👋 تم تسجيل الخروج بنجاح')
 // // }
 // const handleLogout = () => {
 //   // حذف الجلسة تمامًا
 //   localStorage.removeItem("pharmacy_token")
 //   localStorage.removeItem("pharmacy_user")
 //   // منع الرجوع إلى الخلف
 //   window.history.pushState(null, "", window.location.href)
 //   window.addEventListener("popstate", () => {
 //     window.history.pushState(null, "", window.location.href)
 //   })
 //   // التحويل لصفحة تسجيل الدخول
 //   router.replace("/")
 // }
 //   // 🔹 روابط التنقل حسب الدور
 //   const navConfig = {
 //     admin: [
 //       { name: '🏠 لوحة التحكم', path: '/dashboard', perm: 'view_reports' },
 //       { name: '💊 الأدوية', path: '/pharmacist', perm: 'manage_medicines' },
 //       { name: '🧾 نقطة البيع', path: '/cashier', perm: 'add_sale' },
 //       { name: '📦 المخزن', path: '/inventory', perm: 'view_reports' },
 //       { name: '📊 التقارير', path: '/reports', perm: 'view_reports' },
 //       { name: '👥 المستخدمون', path: '/users', perm: 'manage_users' },
 //     ],
 //     pharmacist: [
 //       { name: '💊 الأدوية', path: '/pharmacist', perm: 'manage_medicines' },
 //       { name: '📦 المخزون', path: '/inventory', perm: 'view_reports' },
 //       { name: '📊 تقارير المبيعات', path: '/reports', perm: 'view_reports' },
 //     ],
 //     cashier: [
 //       { name: '🧾 نقطة البيع', path: '/cashier', perm: 'add_sale' },
 //       { name: '📄 التقرير اليومي', path: '/shift', perm: 'view_reports' },
 //     ],
 //   }
 //   const role = user?.role || 'pharmacist'
 //   const links = navConfig[role] || []
 //   return (
 //     <div dir="rtl" className="flex flex-col min-h-screen bg-gray-50">
 //       {/* 🔹 الهيدر */}
 //       <header
 //         className="sticky top-0 z-40 w-full bg-white border-b shadow-sm"
 //         style={{ borderColor: `${theme.colors.primary}20` }}
 //       >
 //         <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 mx-auto sm:flex-row max-w-7xl">
 //           {/* شعار النظام */}
 //           <div className="flex items-center gap-2">
 //             <div
 //               className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white rounded-md shadow"
 //               style={{ background: theme.colors.primary }}
 //             >
 //               💊
 //             </div>
 //             <div>
 //               <h1 className="text-lg font-bold text-gray-800">نظام الصيدلية الذكي</h1>
 //               <p className="text-xs text-gray-500 -mt-0.5">Pharmacy Management System</p>
 //             </div>
 //           </div>
 //           {/* روابط التنقل */}
 //           <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
 //             {links.map(
 //               (item) =>
 //                 hasPermission(item.perm) && (
 //                   <button
 //                     key={item.path}
 //                     onClick={() => router.push(item.path)}
 //                     className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${
 //                       router.pathname === item.path
 //                         ? 'text-white shadow-sm'
 //                         : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'
 //                     }`}
 //                     style={{
 //                       backgroundColor:
 //                         router.pathname === item.path
 //                           ? theme.colors.primary
 //                           : 'transparent',
 //                       borderColor:
 //                         router.pathname === item.path
 //                           ? theme.colors.primary
 //                           : '#e5e7eb',
 //                     }}
 //                   >
 //                     {item.name}
 //                   </button>
 //                 )
 //             )}
 //           </nav>
 //           {/* المستخدم وتسجيل الخروج */}
 //           <div className="flex items-center gap-3">
 //             <div className="flex items-center gap-2 text-sm text-gray-700">
 //               <span>
 //                 مرحبًا،{' '}
 //                 <span className="font-semibold text-sky-700">{user?.name || 'مستخدم'}</span>{' '}
 //                 <span className="ml-1 text-gray-500">
 //                   ({user?.role === 'admin'
 //                     ? 'مدير'
 //                     : user?.role === 'cashier'
 //                     ? 'كاشير'
 //                     : 'صيدلي'}
 //                   )
 //                 </span>
 //               </span>
 //             </div>
 //            <button
 //   onClick={() => setShowLogoutModal(true)}
 //   className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 border rounded-md shadow-sm"
 //   style={{
 //     backgroundColor: 'rgba(239, 68, 68, 0.85)', // 🔴 أحمر أكثر وضوحًا
 //     borderColor: 'rgba(239, 68, 68, 0.5)',
 //   }}
 //   onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(220, 38, 38, 1)')} // أحمر قوي عند hover
 //   onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.85)')} // يعود للشفاف القوي
 // >
 //   <FaSignOutAlt className="text-lg" />
 //   <span>تسجيل الخروج</span>
 // </button>
 //           </div>
 //         </div>
 //       </header>
 //       {/* المحتوى */}
 //       <main className="flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
 //         {title && (
 //           <h2 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b border-gray-200">
 //             {title}
 //           </h2>
 //         )}
 //         {children}
 //       </main>
 //       {/* الفوتر */}
 //       <footer className="py-3 mt-auto text-xs text-center text-gray-400 border-t border-gray-100">
 //         © {new Date().getFullYear()} نظام إدارة الصيدلية — جميع الحقوق محفوظة
 //       </footer>
 //       {/* نافذة التأكيد */}
 //       <ConfirmModal
 //         visible={showLogoutModal}
 //         title="تأكيد تسجيل الخروج"
 //         message="هل ترغب في تسجيل الخروج من النظام؟"
 //         confirmText="تسجيل الخروج"
 //         confirmColor={theme.colors.danger}
 //         onConfirm={handleLogout}
 //         onCancel={() => setShowLogoutModal(false)}
 //       />
 //     </div>
 //   )
 // }
 // // components/Layout.js
 // import { useEffect, useMemo, useState } from 'react'
 // import { useRouter } from 'next/router'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // export default function Layout({ user: userProp, title, children }) {
 //   const router = useRouter()
 //   const [user, setUser] = useState(userProp || null)
 //   // قراءة المستخدم من localStorage
 //   useEffect(() => {
 //     try {
 //       const raw = localStorage.getItem('pharmacy_user')
 //       if (raw) setUser(JSON.parse(raw))
 //     } catch {
 //       // ignore
 //     }
 //   }, [])
 //   const role = user?.role || 'guest'
 //   // نظام الصلاحيات البسيط
 //   const hasPermission = (perm) => {
 //     const map = {
 //       admin: ['dashboard', 'inventory', 'products', 'sales', 'reports', 'cashier', 'pharmacist', 'users'],
 //       pharmacist: ['pharmacist', 'inventory', 'products', 'reports'],
 //       cashier: ['cashier', 'pos', 'reports'],
 //       guest: [],
 //     }
 //     return map[role]?.includes(perm)
 //   }
 //   const nav = useMemo(() => {
 //     const items = []
 //     if (hasPermission('dashboard')) items.push({ name: 'لوحة المدير', path: '/dashboard' })
 //     if (hasPermission('pharmacist')) items.push({ name: 'لوحة الصيدلي', path: '/pharmacist' })
 //     if (hasPermission('cashier')) items.push({ name: 'الكاشير', path: '/cashier' })
 //     if (hasPermission('reports')) items.push({ name: 'التقارير', path: '/reports' })
 //     return items
 //   }, [role])
 //   const handleLogout = () => {
 //     localStorage.removeItem('pharmacy_user')
 //     toast.success('تم تسجيل الخروج')
 //     router.push('/')
 //   }
 //   return (
 //     <div className="flex flex-col min-h-screen">
 //       {/* Header */}
 //       <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
 //         <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
 //           <div className="flex flex-wrap items-center justify-between gap-3 py-4">
 //             <div className="flex items-center gap-3">
 //               <div
 //                 className="flex items-center justify-center w-10 h-10 text-xl text-white rounded-md shadow-sm"
 //                 style={{ backgroundColor: theme.colors.primary }}
 //               >
 //                 💊
 //               </div>
 //               <div className="leading-tight">
 //                 <div className="text-xl font-bold text-gray-900">نظام إدارة الصيدلية</div>
 //                 <div className="text-xs text-gray-500">إدارة المبيعات والمخزون</div>
 //               </div>
 //             </div>
 //             <div className="flex items-center gap-3">
 //               {nav.map((n) => (
 //                 <button
 //                   key={n.path}
 //                   onClick={() => router.push(n.path)}
 //                   className={`px-3 py-1.5 rounded-md text-sm ${
 //                     router.pathname === n.path
 //                       ? 'text-white shadow-sm'
 //                       : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'
 //                   }`}
 //                   style={{
 //                     backgroundColor: router.pathname === n.path ? theme.colors.primary : 'transparent',
 //                   }}
 //                 >
 //                   {n.name}
 //                 </button>
 //               ))}
 //               <div className="w-px h-6 mx-1 bg-gray-200" />
 //               {user ? (
 //                 <>
 //                   <span className="text-sm text-gray-700">
 //                     مرحباً، {user.name}{' '}
 //                     <span className="text-gray-500">({role === 'admin' ? 'مدير' : role === 'pharmacist' ? 'صيدلي' : role === 'cashier' ? 'كاشير' : 'زائر'})</span>
 //                   </span>
 //                   <button
 //                     onClick={handleLogout}
 //                     className="text-white bg-red-600 btn hover:bg-red-700"
 //                   >
 //                     تسجيل الخروج
 //                   </button>
 //                 </>
 //               ) : (
 //                 <button onClick={() => router.push('/')} className="btn btn-primary">تسجيل الدخول</button>
 //               )}
 //             </div>
 //           </div>
 //         </div>
 //       </header>
 //       {/* Page Title */}
 //       <main className="flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
 //         {title && <h2 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b border-gray-200">{title}</h2>}
 //         {children}
 //       </main>
 //       {/* Footer */}
 //       <footer className="py-3 text-xs text-center text-gray-400 border-t border-gray-100">
 //         © 2025 نظام إدارة الصيدلية — جميع الحقوق محفوظة
 //       </footer>
 //     </div>
 //   )
 // }
 // // components/Layout.js
 // import { useRouter } from 'next/router'
 // import { useEffect, useState } from 'react'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // import ConfirmModal from './ConfirmModal'
 // export default function Layout({ user, title, children }) {
 //   const router = useRouter()
 //   const [permissions, setPermissions] = useState([])
 //   const [showLogoutModal, setShowLogoutModal] = useState(false)
 //   useEffect(() => {
 //     const savedPerms = JSON.parse(localStorage.getItem('permissions')) || []
 //     setPermissions(savedPerms)
 //   }, [])
 //   const hasPermission = (key) => user?.role === 'admin' || permissions.includes(key)
 //   const handleLogout = () => {
 //     localStorage.removeItem('permissions')
 //     toast.success('تم تسجيل الخروج بنجاح')
 //     router.push('/')
 //   }
 //   const navItems = [
 //     { name: 'لوحة التحكم', path: '/dashboard', perm: 'view_reports' },
 //     { name: 'الأدوية', path: '/pharmacist', perm: 'manage_medicines' },
 //     { name: 'نقطة البيع', path: '/cashier', perm: 'add_sale' },
 //     { name: 'التقارير', path: '/reports', perm: 'view_reports' },
 //   ]
 //   return (
 //     <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
 //       <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
 //         <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
 //           <div className="flex flex-wrap items-center justify-between gap-3 py-4">
 //             <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
 //             <div className="flex items-center space-x-4 space-x-reverse">
 //               <span className="text-sm text-gray-700">مرحباً، {user?.name}</span>
 //               <button
 //                 onClick={() => setShowLogoutModal(true)}
 //                 className="px-4 py-1.5 text-sm font-medium text-white rounded-md border border-red-200 shadow-sm hover:opacity-90 transition"
 //                 style={{ backgroundColor: theme.colors.danger }}
 //               >
 //                 تسجيل الخروج
 //               </button>
 //             </div>
 //           </div>
 //           <nav className="flex flex-wrap gap-2 pt-2 pb-3 border-t border-gray-100">
 //             {navItems.map(
 //               (item) =>
 //                 hasPermission(item.perm) && (
 //                   <button
 //                     key={item.path}
 //                     onClick={() => router.push(item.path)}
 //                     className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
 //                       router.pathname === item.path
 //                         ? 'text-white shadow-sm'
 //                         : 'text-gray-600 hover:text-sky-700 hover:bg-sky-50'
 //                     }`}
 //                     style={{
 //                       backgroundColor:
 //                         router.pathname === item.path ? theme.colors.primary : 'transparent',
 //                     }}
 //                   >
 //                     {item.name}
 //                   </button>
 //                 )
 //             )}
 //           </nav>
 //         </div>
 //       </header>
 //       <main className="flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
 //         {children}
 //       </main>
 //       <footer className="py-3 mt-auto text-xs text-center text-gray-400 border-t border-gray-100">
 //         © 2025 نظام إدارة الصيدلية — جميع الحقوق محفوظة
 //       </footer>
 //       <ConfirmModal
 //         visible={showLogoutModal}
 //         title="تأكيد تسجيل الخروج"
 //         message="هل ترغب في تسجيل الخروج من النظام؟"
 //         confirmText="تسجيل الخروج"
 //         confirmColor={theme.colors.danger}
 //         onConfirm={handleLogout}
 //         onCancel={() => setShowLogoutModal(false)}
 //       />
 //     </div>
 //   )
 // }
 // import { useState } from 'react'
 // import { useRouter } from 'next/router'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // export default function Layout({ user, title, children }) {
 //   const router = useRouter()
 //   const [showLogout, setShowLogout] = useState(false)
 //   // 🔸 روابط الهيدر حسب الدور
 //   const navConfig = {
 //     admin: [
 //       { name: '🏠 لوحة التحكم', path: '/dashboard' },
 //       { name: '📊 التقارير', path: '/reports' },
 //       { name: '⚙️ الصلاحيات', path: '/permissions' },
 //     ],
 //     pharmacist: [
 //       { name: '💊 الأدوية', path: '/pharmacist' },
 //       { name: '💰 المبيعات', path: '/sales' },
 //       { name: '⚠️ التنبيهات', path: '/alerts' },
 //     ],
 //     cashier: [
 //       { name: '🧾 نقطة البيع', path: '/cashier' },
 //       { name: '💼 الوردية', path: '/cashierReport' },
 //       { name: '📄 التقرير اليومي', path: '/shift' },
 //     ],
 //   }
 //   // 🔸 الأيقونات التعريفية لكل دور
 //   const roleIcons = {
 //     admin: '👑',
 //     pharmacist: '💊',
 //     cashier: '💵',
 //   }
 //   const role = user?.role || 'pharmacist'
 //   const links = navConfig[role] || []
 //   const icon = roleIcons[role] || '👤'
 //   const handleLogout = () => {
 //     toast.success('👋 تم تسجيل الخروج بنجاح')
 //     setTimeout(() => router.push('/'), 1000)
 //   }
 //   return (
 //     <div dir="rtl" className="flex flex-col min-h-screen bg-gray-50">
 //       {/* 🔹 الهيدر الديناميكي */}
 //       <header
 //         className="sticky top-0 z-40 w-full bg-white border-b shadow-sm"
 //         style={{ borderColor: `${theme.colors.primary}20` }}
 //       >
 //         <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 mx-auto sm:flex-row max-w-7xl">
 //           {/* شعار النظام */}
 //           <div className="flex items-center gap-2">
 //             <div
 //               className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white rounded-md shadow"
 //               style={{ background: theme.colors.primary }}
 //             >
 //               💊
 //             </div>
 //             <div>
 //               <h1 className="text-lg font-bold text-gray-800">نظام الصيدلية الذكي</h1>
 //               <p className="text-xs text-gray-500 -mt-0.5">Pharmacy System</p>
 //             </div>
 //           </div>
 //           {/* روابط التنقل */}
 //           <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
 //             {links.map((item) => {
 //               const active = router.pathname === item.path
 //               return (
 //                 <button
 //                   key={item.path}
 //                   onClick={() => router.push(item.path)}
 //                   className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${
 //                     active
 //                       ? 'text-white shadow-sm'
 //                       : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'
 //                   }`}
 //                   style={{
 //                     backgroundColor: active ? theme.colors.primary : 'transparent',
 //                     borderColor: active ? theme.colors.primary : '#e5e7eb',
 //                   }}
 //                 >
 //                   {item.name}
 //                 </button>
 //               )
 //             })}
 //           </nav>
 //           {/* معلومات المستخدم */}
 //           <div className="flex items-center gap-3">
 //             <div className="flex items-center gap-2 text-sm text-gray-700">
 //               <span className="text-lg">{icon}</span>
 //               <span>
 //                 مرحبًا،{' '}
 //                 <span className="font-semibold text-sky-700">
 //                   {user?.name || 'مستخدم'}
 //                 </span>{' '}
 //                 <span className="ml-1 text-gray-500">
 //                   ({user?.role === 'admin'
 //                     ? 'مدير'
 //                     : user?.role === 'cashier'
 //                     ? 'كاشير'
 //                     : 'صيدلي'}
 //                   )
 //                 </span>
 //               </span>
 //             </div>
 //             <button
 //               onClick={handleLogout}
 //               className="px-3 py-1.5 text-sm text-white rounded-md border shadow-sm hover:opacity-90"
 //               style={{
 //                 background: theme.colors.danger,
 //                 borderColor: `${theme.colors.danger}80`,
 //               }}
 //             >
 //               تسجيل الخروج
 //             </button>
 //           </div>
 //         </div>
 //       </header>
 //       {/* المحتوى */}
 //       <main className="flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
 //         {title && (
 //           <h2 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b border-gray-200">
 //             {title}
 //           </h2>
 //         )}
 //         {children}
 //       </main>
 //       {/* الفوتر */}
 //       <footer className="py-3 mt-auto text-xs text-center text-gray-400 border-t border-gray-100">
 //         © {new Date().getFullYear()} نظام إدارة الصيدلية — جميع الحقوق محفوظة
 //       </footer>
 //     </div>
 //   )
 // }
}),
"[project]/components/Modal.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/Modal.js
__turbopack_context__.s([
    "default",
    ()=>Modal
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function Modal({ title, children, onClose, onConfirm, confirmText = 'حفظ', cancelText = 'إلغاء', showFooter = true, size = 'md' }) {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl'
    };
    // 🔹 منع التمرير أثناء فتح المودال
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        document.body.classList.add('modal-open');
        return ()=>document.body.classList.remove('modal-open');
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4",
        dir: "rtl",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: `relative w-full ${sizeClasses[size]} p-6 bg-white rounded-lg shadow-xl border border-gray-100 animate-fadeIn`,
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between pb-2 mb-4 border-b border-gray-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold text-gray-800",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/components/Modal.js",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-2xl font-bold text-gray-400 transition hover:text-gray-600",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/components/Modal.js",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Modal.js",
                    lineNumber: 38,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "max-h-[70vh] overflow-y-auto text-gray-700",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/Modal.js",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                showFooter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "px-5 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50",
                            children: cancelText
                        }, void 0, false, {
                            fileName: "[project]/components/Modal.js",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this),
                        onConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: onConfirm,
                            className: "px-5 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700",
                            children: confirmText
                        }, void 0, false, {
                            fileName: "[project]/components/Modal.js",
                            lineNumber: 62,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Modal.js",
                    lineNumber: 53,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Modal.js",
            lineNumber: 33,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Modal.js",
        lineNumber: 28,
        columnNumber: 5
    }, this);
} // // components/Modal.js
 // import React from 'react'
 // export default function Modal({
 //   title,
 //   children,
 //   onClose,
 //   onConfirm,
 //   confirmText = 'حفظ',
 //   cancelText = 'إلغاء',
 //   showFooter = true,
 //   size = 'md', // sm | md | lg
 // }) {
 //   const sizeClasses = {
 //     sm: 'max-w-sm',
 //     md: 'max-w-lg',
 //     lg: 'max-w-3xl',
 //   }
 //   return (
 //     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
 //       <div
 //         className={`relative w-full ${sizeClasses[size]} p-6 bg-white rounded-lg shadow-xl animate-fadeIn`}
 //         dir="rtl"
 //       >
 //         {/* رأس النافذة */}
 //         <div className="flex items-center justify-between pb-2 mb-4 border-b">
 //           <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
 //           <button
 //             onClick={onClose}
 //             className="text-2xl font-bold text-gray-400 transition hover:text-gray-600"
 //           >
 //             ×
 //           </button>
 //         </div>
 //         {/* محتوى النافذة */}
 //         <div className="max-h-[70vh] overflow-y-auto text-gray-700">{children}</div>
 //         {/* أزرار التحكم */}
 //         {showFooter && (
 //           <div className="flex justify-end gap-3 pt-3 mt-6 border-t">
 //             <button
 //               onClick={onClose}
 //               className="px-5 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-50"
 //             >
 //               {cancelText}
 //             </button>
 //             {onConfirm && (
 //               <button
 //                 onClick={onConfirm}
 //                 className="px-5 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //               >
 //                 {confirmText}
 //               </button>
 //             )}
 //           </div>
 //         )}
 //       </div>
 //     </div>
 //   )
 // }
}),
"[externals]/axios [external] (axios, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("axios");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/utils/api.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const api = __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].create({
    baseURL: "http://127.0.0.1:5000/api"
});
const __TURBOPACK__default__export__ = api;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/accounts.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/accounts.js
__turbopack_context__.s([
    "default",
    ()=>AccountsPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Layout.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Modal.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/react-hot-toast [external] (react-hot-toast, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/theme.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/LineChart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Line.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
function AccountsPage() {
    const [user] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: "المدير أحمد",
        role: "admin"
    });
    // 🔹 بيانات العمليات المالية
    const [transactions, setTransactions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    // 🔹 فلاتر
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [typeFilter, setTypeFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("all");
    const [directionFilter, setDirectionFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("all");
    const [userFilter, setUserFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("all");
    const [dateFrom, setDateFrom] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [dateTo, setDateTo] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    // 🔹 مودال إضافة عملية
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [newTrans, setNewTrans] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        userId: "",
        type: "فاتورة بيع",
        direction: "in",
        amount: "",
        date: "",
        description: "",
        category: "مبيعات",
        paymentMethod: "cash",
        refCode: ""
    });
    // تنسيق عملة
    const formatCurrency = (v)=>`${Number(v || 0).toLocaleString("ar-SA")} ر.س`;
    // 🔄 جلب العمليات من الباك-إند
    const loadTransactions = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get("/transactions");
            setTransactions(res.data || []);
        } catch (err) {
            console.error("loadTransactions error:", err);
            __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["default"].error("خطأ في تحميل العمليات");
        }
    };
    // 🔄 جلب المستخدمين من الباك-إند
    const loadUsers = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get("/users");
            setUsers(res.data || []);
        } catch (err) {
            console.error("loadUsers error:", err);
        }
    };
    // 📌 تشغيل التحميل عند فتح الصفحة
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        loadTransactions();
        loadUsers();
    }, []);
    // 🔍 فلترة العمليات
    const filteredTransactions = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return transactions.filter((t)=>{
            const q = search.trim().toLowerCase();
            const passSearch = !q || t.refCode?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.userName?.toLowerCase().includes(q);
            const passType = typeFilter === "all" || t.type === typeFilter;
            const passDir = directionFilter === "all" || t.direction === directionFilter;
            const passUser = userFilter === "all" || t.userId === Number(userFilter);
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
        dateTo
    ]);
    // 📊 ملخصات
    const summary = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        let income = 0;
        let expense = 0;
        filteredTransactions.forEach((t)=>{
            const amount = Number(t.amount) || 0;
            if (t.direction === "in") income += amount;
            else expense += amount;
        });
        const net = income - expense;
        // "اليوم" المنطقي = أحدث تاريخ في كل البيانات (مو بس المفلترة)
        const dates = transactions.map((t)=>t.date?.slice(0, 10)).filter(Boolean);
        const logicalToday = dates.length ? dates.sort()[dates.length - 1] : null;
        let todayIncome = 0;
        if (logicalToday) {
            transactions.forEach((t)=>{
                const amount = Number(t.amount) || 0;
                if (t.direction === "in" && t.date?.slice(0, 10) === logicalToday) {
                    todayIncome += amount;
                }
            });
        }
        return {
            income,
            expense,
            net,
            todayIncome,
            count: filteredTransactions.length
        };
    }, [
        filteredTransactions,
        transactions
    ]);
    // 📈 خط زمني بسيط
    const chartData = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const map = new Map();
        filteredTransactions.forEach((t)=>{
            const day = t.date?.slice(0, 10);
            if (!day) return;
            const sign = t.direction === "in" ? 1 : -1;
            const amount = Number(t.amount) || 0;
            map.set(day, (map.get(day) || 0) + sign * amount);
        });
        return Array.from(map.entries()).sort(([a], [b])=>a > b ? 1 : -1).map(([date, total])=>({
                date,
                total
            }));
    }, [
        filteredTransactions
    ]);
    // 🖨️ طباعة التقرير الحالي
    const handlePrint = ()=>{
        const rows = filteredTransactions.map((t)=>`
      <tr>
        <td>${t.refCode || ""}</td>
        <td>${t.type || ""}</td>
        <td>${t.direction === "in" ? "إيراد" : "مصروف"}</td>
        <td>${t.userName || ""}</td>
        <td>${(t.date || "").replace("T", " ").slice(0, 16)}</td>
        <td>${t.amount}</td>
        <td>${t.category || ""}</td>
        <td>${t.paymentMethod || ""}</td>
      </tr>`).join("");
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
          <p>إجمالي الإيرادات: <strong>${formatCurrency(summary.income)}</strong></p>
          <p>إجمالي المصروفات: <strong>${formatCurrency(summary.expense)}</strong></p>
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
    const handleSaveNewTrans = async ()=>{
        try {
            if (!newTrans.userId || !newTrans.amount || !newTrans.date) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["default"].error("يرجى إدخال المستخدم والمبلغ والتاريخ");
                return;
            }
            // 🔹 توليد مرجع تلقائي إذا لم يُدخل المستخدم واحداً
            const generatedRef = newTrans.refCode && newTrans.refCode.trim() !== "" ? newTrans.refCode : "TX-" + Date.now();
            const payload = {
                refCode: generatedRef,
                type: newTrans.type,
                direction: newTrans.direction,
                amount: Number(newTrans.amount),
                date: newTrans.date,
                userId: Number(newTrans.userId),
                category: newTrans.category || null,
                paymentMethod: newTrans.paymentMethod,
                description: newTrans.description || null
            };
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post("/transactions", payload);
            __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["default"].success("تم حفظ العملية بنجاح");
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
                refCode: ""
            });
        } catch (err) {
            console.error("saveTrans error:", err);
            __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["default"].error("فشل في حفظ العملية");
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
    const userLedger = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const map = new Map();
        transactions.forEach((t)=>{
            if (!t.userId) return;
            if (!map.has(t.userId)) {
                map.set(t.userId, {
                    userId: t.userId,
                    userName: t.userName || "",
                    income: 0,
                    expense: 0
                });
            }
            const row = map.get(t.userId);
            const amount = Number(t.amount) || 0;
            if (t.direction === "in") row.income += amount;
            else row.expense += amount;
        });
        return Array.from(map.values());
    }, [
        transactions
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        user: user,
        title: "الحسابات المالية",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            dir: "rtl",
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: "text-xl font-semibold text-gray-800",
                                    children: "💰 الحسابات المالية"
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 366,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500",
                                    children: "متابعة الإيرادات، المصروفات، وصافي الربح مع ارتباط بالمستخدمين والعمليات اليومية."
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 365,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowAddModal(true),
                                    className: "px-4 py-2 text-sm text-white rounded-md shadow-md",
                                    style: {
                                        background: __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].colors.success
                                    },
                                    children: "➕ إضافة عملية مالية"
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 374,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handlePrint,
                                    className: "px-4 py-2 text-sm border rounded-md text-sky-700 bg-sky-50 border-sky-300 hover:bg-sky-100",
                                    children: "🖨️ طباعة التقرير الحالي"
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 381,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 373,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/accounts.js",
                    lineNumber: 364,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SummaryCard, {
                            title: "إجمالي الإيرادات",
                            value: formatCurrency(summary.income),
                            color: "text-emerald-600"
                        }, void 0, false, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 392,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SummaryCard, {
                            title: "إجمالي المصروفات",
                            value: formatCurrency(summary.expense),
                            color: "text-red-600"
                        }, void 0, false, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 397,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SummaryCard, {
                            title: "صافي الربح",
                            value: formatCurrency(summary.net),
                            color: summary.net >= 0 ? "text-sky-600" : "text-red-700"
                        }, void 0, false, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 402,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SummaryCard, {
                            title: "عدد العمليات الحالية",
                            value: summary.count,
                            color: "text-purple-600"
                        }, void 0, false, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 407,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/accounts.js",
                    lineNumber: 391,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-4 bg-white border rounded-lg shadow-sm lg:col-span-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "mb-2 text-sm font-semibold text-gray-700",
                                    children: "📈 صافي الحركة اليومية (إيراد - مصروف)"
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 417,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "h-64",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                        width: "100%",
                                        height: "100%",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["LineChart"], {
                                            data: chartData,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                    strokeDasharray: "3 3"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 423,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                                    dataKey: "date"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 424,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 425,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 426,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Line"], {
                                                    type: "monotone",
                                                    dataKey: "total",
                                                    stroke: __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].colors.primary,
                                                    strokeWidth: 2
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 427,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 422,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 421,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 420,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 416,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-4 bg-white border rounded-lg shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "mb-2 text-sm font-semibold text-gray-700",
                                    children: "👥 ملخص حسب المستخدم"
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 439,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 text-xs",
                                    children: userLedger.length ? userLedger.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "p-2 border rounded-md bg-gray-50/70",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold text-gray-800",
                                                            children: u.userName
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/accounts.js",
                                                            lineNumber: 450,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-[11px] text-gray-500",
                                                            children: [
                                                                "ID: ",
                                                                u.userId
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/accounts.js",
                                                            lineNumber: 453,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 449,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 text-[12px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    children: "إيرادات"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/accounts.js",
                                                                    lineNumber: 459,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-emerald-700",
                                                                    children: formatCurrency(u.income)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/accounts.js",
                                                                    lineNumber: 460,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/accounts.js",
                                                            lineNumber: 458,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    children: "مصروفات"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/accounts.js",
                                                                    lineNumber: 465,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-red-600",
                                                                    children: formatCurrency(u.expense)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/accounts.js",
                                                                    lineNumber: 466,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/accounts.js",
                                                            lineNumber: 464,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    children: "صافي"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/accounts.js",
                                                                    lineNumber: 471,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: `font-bold ${u.income - u.expense >= 0 ? "text-sky-600" : "text-red-700"}`,
                                                                    children: formatCurrency(u.income - u.expense)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/accounts.js",
                                                                    lineNumber: 472,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/accounts.js",
                                                            lineNumber: 470,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 457,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, u.userId, true, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 445,
                                            columnNumber: 19
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: "لا توجد بيانات لعرض دفتر المستخدمين…"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 486,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 442,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 438,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/accounts.js",
                    lineNumber: 415,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-4 bg-white border rounded-lg shadow-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: "mb-3 text-sm font-semibold text-gray-700",
                            children: "🔍 فلترة العمليات"
                        }, void 0, false, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 496,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-3 md:grid-cols-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "بحث: مرجع / وصف / مستخدم",
                                    className: "px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400",
                                    value: search,
                                    onChange: (e)=>setSearch(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 500,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                    value: typeFilter,
                                    onChange: (e)=>setTypeFilter(e.target.value),
                                    className: "px-3 py-2 text-sm border rounded-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "all",
                                            children: "كل الأنواع"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 513,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "فاتورة بيع",
                                            children: "فاتورة بيع"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 514,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "إيراد آخر",
                                            children: "إيراد آخر"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 515,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "مصروف مشتريات",
                                            children: "مصروف مشتريات"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 516,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "مصروف تشغيلي",
                                            children: "مصروف تشغيلي"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 517,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "مرتجع عميل",
                                            children: "مرتجع عميل"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 518,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 508,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                    value: directionFilter,
                                    onChange: (e)=>setDirectionFilter(e.target.value),
                                    className: "px-3 py-2 text-sm border rounded-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "all",
                                            children: "إيراد + مصروف"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 526,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "in",
                                            children: "إيرادات فقط"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 527,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "out",
                                            children: "مصروفات فقط"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 528,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 521,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                    value: userFilter,
                                    onChange: (e)=>setUserFilter(e.target.value),
                                    className: "px-3 py-2 text-sm border rounded-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "all",
                                            children: "كل المستخدمين"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 536,
                                            columnNumber: 15
                                        }, this),
                                        users.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: u.id,
                                                children: u.name
                                            }, u.id, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 538,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 531,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    value: dateFrom,
                                    onChange: (e)=>setDateFrom(e.target.value),
                                    className: "px-3 py-2 text-sm border rounded-md"
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 544,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    value: dateTo,
                                    onChange: (e)=>setDateTo(e.target.value),
                                    className: "px-3 py-2 text-sm border rounded-md"
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 550,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 499,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/accounts.js",
                    lineNumber: 495,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-4 overflow-x-auto bg-white border rounded-lg shadow-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: "mb-3 text-sm font-semibold text-gray-700",
                            children: "📋 العمليات المالية"
                        }, void 0, false, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 561,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            className: "w-full min-w-[980px] text-sm text-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    className: "text-gray-700 bg-gray-50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2",
                                                children: "مرجع"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 567,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2",
                                                children: "النوع"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 568,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2",
                                                children: "اتجاه"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 569,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2",
                                                children: "المستخدم"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 570,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2",
                                                children: "التصنيف"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 571,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2",
                                                children: "طريقة الدفع"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 572,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2",
                                                children: "التاريخ"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 573,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2",
                                                children: "المبلغ"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 574,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 566,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 565,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    children: filteredTransactions.length ? filteredTransactions.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            className: "transition border-t hover:bg-gray-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2 text-xs sm:text-sm",
                                                    children: t.refCode || "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 584,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2 text-xs sm:text-sm",
                                                    children: t.type
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 587,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2 text-xs sm:text-sm",
                                                    children: t.direction === "in" ? "إيراد" : "مصروف"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 590,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2 text-xs sm:text-sm",
                                                    children: t.userName || "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 593,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2 text-xs sm:text-sm",
                                                    children: t.category || "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 596,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2 text-xs sm:text-sm",
                                                    children: t.paymentMethod || "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 599,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2 text-xs sm:text-sm",
                                                    children: (t.date || "").replace("T", " ").slice(0, 16)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 602,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2 text-xs font-semibold text-emerald-700 sm:text-sm",
                                                    children: formatCurrency(t.amount)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/accounts.js",
                                                    lineNumber: 605,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, t.id, true, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 580,
                                            columnNumber: 19
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            colSpan: 8,
                                            className: "py-5 text-sm text-center text-gray-500",
                                            children: "لا توجد عمليات مطابقة للفلاتر الحالية…"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/accounts.js",
                                            lineNumber: 612,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 611,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/accounts.js",
                                    lineNumber: 577,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/accounts.js",
                            lineNumber: 564,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/accounts.js",
                    lineNumber: 560,
                    columnNumber: 9
                }, this),
                showAddModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    title: "➕ إضافة عملية مالية",
                    onClose: ()=>setShowAddModal(false),
                    onConfirm: handleSaveNewTrans,
                    confirmText: "حفظ العملية",
                    size: "md",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "space-y-3 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "block mb-1 text-xs text-gray-600",
                                                children: "المستخدم"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 636,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                className: "w-full px-3 py-2 text-sm border rounded-md",
                                                value: newTrans.userId,
                                                onChange: (e)=>setNewTrans((prev)=>({
                                                            ...prev,
                                                            userId: e.target.value
                                                        })),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "اختر المستخدم"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/accounts.js",
                                                        lineNumber: 649,
                                                        columnNumber: 21
                                                    }, this),
                                                    users.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: u.id,
                                                            children: [
                                                                u.name,
                                                                " — ",
                                                                u.role
                                                            ]
                                                        }, u.id, true, {
                                                            fileName: "[project]/pages/accounts.js",
                                                            lineNumber: 651,
                                                            columnNumber: 23
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 639,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 635,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "block mb-1 text-xs text-gray-600",
                                                children: "نوع العملية"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 659,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                className: "w-full px-3 py-2 text-sm border rounded-md",
                                                value: newTrans.type,
                                                onChange: (e)=>{
                                                    const val = e.target.value;
                                                    let direction = "in";
                                                    if (val === "مصروف مشتريات" || val === "مصروف تشغيلي" || val === "مرتجع عميل") {
                                                        direction = "out";
                                                    }
                                                    setNewTrans((prev)=>({
                                                            ...prev,
                                                            type: val,
                                                            direction
                                                        }));
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "فاتورة بيع",
                                                        children: "فاتورة بيع"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/accounts.js",
                                                        lineNumber: 682,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "إيراد آخر",
                                                        children: "إيراد آخر"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/accounts.js",
                                                        lineNumber: 683,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "مصروف مشتريات",
                                                        children: "مصروف مشتريات"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/accounts.js",
                                                        lineNumber: 684,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "مصروف تشغيلي",
                                                        children: "مصروف تشغيلي"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/accounts.js",
                                                        lineNumber: 685,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "مرتجع عميل",
                                                        children: "مرتجع عميل"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/accounts.js",
                                                        lineNumber: 686,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 662,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 658,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/accounts.js",
                                lineNumber: 634,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "block mb-1 text-xs text-gray-600",
                                                children: "المبلغ"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 693,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                className: "w-full px-3 py-2 text-sm border rounded-md",
                                                value: newTrans.amount,
                                                onChange: (e)=>setNewTrans((prev)=>({
                                                            ...prev,
                                                            amount: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 696,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 692,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "block mb-1 text-xs text-gray-600",
                                                children: "التاريخ والوقت"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 709,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "datetime-local",
                                                className: "w-full px-3 py-2 text-sm border rounded-md",
                                                value: newTrans.date,
                                                onChange: (e)=>setNewTrans((prev)=>({
                                                            ...prev,
                                                            date: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 712,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 708,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/accounts.js",
                                lineNumber: 691,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "block mb-1 text-xs text-gray-600",
                                                children: "التصنيف"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 728,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: "w-full px-3 py-2 text-sm border rounded-md",
                                                placeholder: "مثل: مبيعات / مشتريات / إيجار...",
                                                value: newTrans.category,
                                                onChange: (e)=>setNewTrans((prev)=>({
                                                            ...prev,
                                                            category: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 731,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 727,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "block mb-1 text-xs text-gray-600",
                                                children: "طريقة الدفع"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 745,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                className: "w-full px-3 py-2 text-sm border rounded-md",
                                                value: newTrans.paymentMethod,
                                                onChange: (e)=>setNewTrans((prev)=>({
                                                            ...prev,
                                                            paymentMethod: e.target.value
                                                        })),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "cash",
                                                        children: "نقداً"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/accounts.js",
                                                        lineNumber: 758,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "card",
                                                        children: "بطاقة"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/accounts.js",
                                                        lineNumber: 759,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "bank",
                                                        children: "تحويل بنكي"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/accounts.js",
                                                        lineNumber: 760,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "wallet",
                                                        children: "محفظة"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/accounts.js",
                                                        lineNumber: 761,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/accounts.js",
                                                lineNumber: 748,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 744,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/accounts.js",
                                lineNumber: 726,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block mb-1 text-xs text-gray-600",
                                        children: "مرجع (اختياري)"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 767,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        className: "w-full px-3 py-2 text-sm border rounded-md",
                                        placeholder: "مثل: INV-2025-001 أو EXP-PO-01",
                                        value: newTrans.refCode,
                                        onChange: (e)=>setNewTrans((prev)=>({
                                                    ...prev,
                                                    refCode: e.target.value
                                                }))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 770,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/accounts.js",
                                lineNumber: 766,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block mb-1 text-xs text-gray-600",
                                        children: "وصف / ملاحظة"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 785,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                        rows: 3,
                                        className: "w-full px-3 py-2 text-sm border rounded-md",
                                        placeholder: "وصف مختصر للعملية المالية",
                                        value: newTrans.description,
                                        onChange: (e)=>setNewTrans((prev)=>({
                                                    ...prev,
                                                    description: e.target.value
                                                }))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/accounts.js",
                                        lineNumber: 788,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/accounts.js",
                                lineNumber: 784,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/accounts.js",
                        lineNumber: 633,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/accounts.js",
                    lineNumber: 626,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/accounts.js",
            lineNumber: 362,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/accounts.js",
        lineNumber: 361,
        columnNumber: 5
    }, this);
}
// بطاقة ملخص
function SummaryCard({ title, value, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4 text-center bg-white border rounded-lg shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-500",
                children: title
            }, void 0, false, {
                fileName: "[project]/pages/accounts.js",
                lineNumber: 813,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: `mt-1 text-lg sm:text-xl font-bold ${color}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/pages/accounts.js",
                lineNumber: 814,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/accounts.js",
        lineNumber: 812,
        columnNumber: 5
    }, this);
} // // pages/accounts.js
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__19ecda0f._.js.map