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
"[project]/components/WarningIndicator.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/WarningIndicator.js
__turbopack_context__.s([
    "default",
    ()=>WarningIndicator
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function WarningIndicator({ warnings }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    if (!warnings || warnings.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "relative inline-block text-right",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen((v)=>!v),
                className: "flex items-center justify-center text-yellow-600 transition bg-yellow-100 rounded-full shadow  w-7 h-7 hover:bg-yellow-200",
                children: "⚠️"
            }, void 0, false, {
                fileName: "[project]/components/WarningIndicator.js",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute right-0 z-50 p-3 text-xs bg-white border border-gray-200 rounded-lg shadow-xl  top-8 w-52 animate-fade",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "mb-2 font-semibold text-gray-700",
                        children: "تفاصيل التحذيرات:"
                    }, void 0, false, {
                        fileName: "[project]/components/WarningIndicator.js",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                        className: "space-y-1 overflow-y-auto max-h-40",
                        children: warnings.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                className: "bg-gray-50 border rounded p-1.5 text-[11px]",
                                children: w
                            }, i, false, {
                                fileName: "[project]/components/WarningIndicator.js",
                                lineNumber: 30,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/WarningIndicator.js",
                        lineNumber: 28,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setOpen(false),
                        className: " mt-3 w-full py-1  bg-gray-800 text-white  rounded text-[11px] ",
                        children: "إغلاق"
                    }, void 0, false, {
                        fileName: "[project]/components/WarningIndicator.js",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/WarningIndicator.js",
                lineNumber: 22,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/WarningIndicator.js",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
"[project]/pages/inventory.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/inventory.js
__turbopack_context__.s([
    "default",
    ()=>InventoryPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Layout.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Modal.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AuthContext.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WarningIndicator$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/WarningIndicator.js [ssr] (ecmascript)");
;
;
;
;
;
;
function getWarnings(p) {
    const warnings = [];
    if (p.quantity <= 0) warnings.push("out_of_stock");
    else if (p.quantity <= (p.minQty || 5)) warnings.push("low_stock");
    if (p.expiryDate) {
        const diffDays = (new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays < 0) warnings.push("expired");
        else if (diffDays <= 60) warnings.push("near_expiry");
    }
    return warnings;
}
function InventoryPage() {
    const { user, hasPermission } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [qty, setQty] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [type, setType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("in");
    // -----------------------------------------------------------
    // 🔥 تحميل قائمة المخزون من API
    // -----------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchInventory = async ()=>{
            try {
                const res = await fetch("http://localhost:5000/api/inventory");
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data);
                } else {
                    alert("فشل تحميل بيانات المخزون");
                }
            } catch (err) {
                console.error(err);
                alert("خطأ في الاتصال بالسيرفر");
            } finally{
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);
    // -----------------------------------------------------------
    // 🔄 فتح نافذة تعديل الكمية
    // -----------------------------------------------------------
    const openModal = (p)=>{
        setSelected(p);
        setQty("");
        setType("in");
        setShowModal(true);
    };
    // -----------------------------------------------------------
    // 🧾 إرسال تحديث المخزون إلى API
    // -----------------------------------------------------------
    const handleConfirm = async ()=>{
        const n = Number(qty);
        if (!n || n <= 0) {
            alert("أدخل كمية صحيحة");
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/inventory/${selected.id}/adjust`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type,
                    quantity: n
                })
            });
            const data = await res.json();
            if (!data.success) {
                alert(data.message || "خطأ أثناء تعديل المخزون");
                return;
            }
            // 🔥 تحديث الواجهة
            setProducts((prev)=>prev.map((p)=>p.id === selected.id ? data.data : p));
            setShowModal(false);
        } catch (err) {
            console.error(err);
            alert("خطأ في الاتصال بالسيرفر");
        }
    };
    // -----------------------------------------------------------
    // 🚫 التحقق من الصلاحية
    // -----------------------------------------------------------
    if (!hasPermission([
        "admin",
        "pharmacist"
    ])) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            user: user,
            title: "المخزون",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                dir: "rtl",
                className: "p-6 text-center text-red-600",
                children: "⚠️ ليس لديك صلاحية لدخول شاشة المخزون."
            }, void 0, false, {
                fileName: "[project]/pages/inventory.js",
                lineNumber: 114,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/inventory.js",
            lineNumber: 113,
            columnNumber: 7
        }, this);
    }
    // -----------------------------------------------------------
    // ⏳ تحميل ...
    // -----------------------------------------------------------
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            user: user,
            title: "المخزون",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                dir: "rtl",
                className: "p-6 text-center",
                children: "⏳ جاري تحميل المخزون…"
            }, void 0, false, {
                fileName: "[project]/pages/inventory.js",
                lineNumber: 127,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/inventory.js",
            lineNumber: 126,
            columnNumber: 7
        }, this);
    }
    // -----------------------------------------------------------
    // 🎨 الواجهة
    // -----------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        user: user,
        title: "المخزون",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                dir: "rtl",
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-bold text-gray-800",
                        children: "🏬 إدارة المخزون"
                    }, void 0, false, {
                        fileName: "[project]/pages/inventory.js",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto bg-white border shadow rounded-xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            className: "w-full text-sm text-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    className: "text-gray-700 bg-gray-50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "p-3",
                                                children: "المنتج"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "p-3",
                                                children: "الكود"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 146,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "p-3",
                                                children: "الفئة"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 147,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "p-3",
                                                children: "الكمية"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 148,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "p-3",
                                                children: "الحد الأدنى"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 149,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "p-3",
                                                children: "الصلاحية"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 150,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "p-3 text-center",
                                                children: "تحذيرات"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 151,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "p-3 text-center",
                                                children: "إجراءات"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 152,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventory.js",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventory.js",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    children: [
                                        products.map((p)=>{
                                            const warnings = getWarnings(p);
                                            const daysLeft = p.expiryDate ? (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24) : null;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                className: "border-t hover:bg-gray-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "p-3",
                                                        children: p.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventory.js",
                                                        lineNumber: 166,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "p-3 text-xs text-gray-600",
                                                        children: p.sku
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventory.js",
                                                        lineNumber: 167,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "p-3",
                                                        children: p.category
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventory.js",
                                                        lineNumber: 168,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: `p-3 ${p.quantity <= 0 ? "text-red-700 font-bold" : p.quantity < (p.minQty || 5) ? "text-amber-600 font-semibold" : ""}`,
                                                        children: p.quantity
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventory.js",
                                                        lineNumber: 170,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "p-3",
                                                        children: p.minQty
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventory.js",
                                                        lineNumber: 182,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "p-3 text-xs",
                                                        children: p.expiryDate ? daysLeft < 0 ? "❌ منتهي" : p.expiryDate : "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventory.js",
                                                        lineNumber: 184,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "p-3 text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WarningIndicator$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            warnings: warnings
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/inventory.js",
                                                            lineNumber: 193,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventory.js",
                                                        lineNumber: 192,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "p-3 text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>openModal(p),
                                                            className: "px-3 py-1 text-xs text-white rounded-lg bg-sky-600 hover:bg-sky-700",
                                                            children: "🔄 توريد / خصم"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/inventory.js",
                                                            lineNumber: 197,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventory.js",
                                                        lineNumber: 196,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, p.id, true, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 165,
                                                columnNumber: 19
                                            }, this);
                                        }),
                                        products.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                colSpan: 8,
                                                className: "p-4 text-center text-gray-400",
                                                children: "لا توجد أصناف حالياً…"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 210,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventory.js",
                                            lineNumber: 209,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/inventory.js",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/inventory.js",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventory.js",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            showModal && selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: "تعديل المخزون",
                onClose: ()=>setShowModal(false),
                onConfirm: handleConfirm,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    dir: "rtl",
                    className: "space-y-3 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            children: [
                                "المنتج: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                    children: selected.name
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventory.js",
                                    lineNumber: 228,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 227,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "block mb-1 text-xs text-gray-500",
                                    children: "نوع العملية"
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventory.js",
                                    lineNumber: 232,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                    className: "w-full p-2 border rounded",
                                    value: type,
                                    onChange: (e)=>setType(e.target.value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "in",
                                            children: "➕ توريد"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventory.js",
                                            lineNumber: 240,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "out",
                                            children: "➖ خصم"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventory.js",
                                            lineNumber: 241,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/inventory.js",
                                    lineNumber: 235,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 231,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "block mb-1 text-xs text-gray-500",
                                    children: "الكمية"
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventory.js",
                                    lineNumber: 246,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    className: "w-full p-2 border rounded",
                                    placeholder: "مثال: 10",
                                    value: qty,
                                    onChange: (e)=>setQty(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventory.js",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 245,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/inventory.js",
                    lineNumber: 226,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/inventory.js",
                lineNumber: 221,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/inventory.js",
        lineNumber: 136,
        columnNumber: 5
    }, this);
} // // pages/inventory.js
 // import { useState } from "react";
 // import Layout from "../components/Layout";
 // import Modal from "../components/Modal";
 // import { useAuth } from "../context/AuthContext";
 // import WarningIndicator from "../components/WarningIndicator";
 // // ⚠️ حالياً نستخدم بيانات تجريبية داخل الصفحة نفسها
 // // لاحقاً يمكن نقلها إلى InventoryContext أو API
 // const initialProducts = [
 //   {
 //     id: 1,
 //     name: "باراسيتامول 500mg",
 //     sku: "P-500",
 //     category: "مسكنات",
 //     quantity: 35,
 //     minQty: 10,
 //     expiryDate: "2026-01-15",
 //   },
 //   {
 //     id: 2,
 //     name: "فيتامين C 1000mg",
 //     sku: "VIT-C-1000",
 //     category: "فيتامينات",
 //     quantity: 8,
 //     minQty: 15,
 //     expiryDate: "2025-12-01",
 //   },
 //   {
 //     id: 3,
 //     name: "أموكسيسيلين 250mg",
 //     sku: "AMOX-250",
 //     category: "مضادات حيوية",
 //     quantity: 0,
 //     minQty: 5,
 //     expiryDate: "2024-11-20",
 //   },
 // ];
 // function getWarnings(p) {
 //   const warnings = [];
 //   if (p.quantity <= 0) warnings.push("out_of_stock");
 //   else if (p.quantity <= (p.minQty || 5)) warnings.push("low_stock");
 //   if (p.expiryDate) {
 //     const diffDays =
 //       (new Date(p.expiryDate).getTime() - new Date().getTime()) /
 //       (1000 * 60 * 60 * 24);
 //     if (diffDays < 0) warnings.push("expired");
 //     else if (diffDays <= 60) warnings.push("near_expiry");
 //   }
 //   return warnings;
 // }
 // export default function InventoryPage() {
 //   const { user, hasPermission } = useAuth();
 //   const [products, setProducts] = useState(initialProducts);
 //   const [showModal, setShowModal] = useState(false);
 //   const [selected, setSelected] = useState(null);
 //   const [qty, setQty] = useState("");
 //   const [type, setType] = useState("in");
 //   if (!hasPermission(["admin", "pharmacist"])) {
 //     return (
 //       <Layout user={user} title="المخزون">
 //         <div dir="rtl" className="p-6 text-center text-red-600">
 //           ⚠️ ليس لديك صلاحية لدخول شاشة المخزون.
 //         </div>
 //       </Layout>
 //     );
 //   }
 //   const openModal = (p) => {
 //     setSelected(p);
 //     setQty("");
 //     setType("in");
 //     setShowModal(true);
 //   };
 //   const handleConfirm = () => {
 //     const n = Number(qty);
 //     if (!n || n <= 0) {
 //       alert("أدخل كمية صحيحة");
 //       return;
 //     }
 //     setProducts((prev) =>
 //       prev.map((p) =>
 //         p.id === selected.id
 //           ? {
 //               ...p,
 //               quantity: type === "in" ? p.quantity + n : p.quantity - n,
 //             }
 //           : p
 //       )
 //     );
 //     setShowModal(false);
 //   };
 //   const printInventoryReport = () => {
 //     const html = `
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <meta charSet="utf-8" />
 //           <title>تقرير المخزون</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; padding: 20px; }
 //             h2 { color:#0ea5e9; margin-bottom: 10px; }
 //             table { width:100%; border-collapse: collapse; margin-top:10px; }
 //             th, td { border:1px solid #ddd; padding:6px; text-align:center; }
 //             th { background:#f3f4f6; }
 //           </style>
 //         </head>
 //         <body>
 //           <h2>🏬 تقرير المخزون</h2>
 //           <table>
 //             <thead>
 //               <tr>
 //                 <th>المنتج</th>
 //                 <th>الكود</th>
 //                 <th>الفئة</th>
 //                 <th>الكمية</th>
 //                 <th>الحد الأدنى</th>
 //                 <th>الصلاحية</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               ${products
 //                 .map(
 //                   (p) => `
 //                 <tr>
 //                   <td>${p.name}</td>
 //                   <td>${p.sku}</td>
 //                   <td>${p.category}</td>
 //                   <td>${p.quantity}</td>
 //                   <td>${p.minQty}</td>
 //                   <td>${p.expiryDate || "-"}</td>
 //                 </tr>
 //               `
 //                 )
 //                 .join("")}
 //             </tbody>
 //           </table>
 //           <script>
 //             window.onload = () => {
 //               window.print();
 //               setTimeout(() => window.close(), 800);
 //             };
 //           </script>
 //         </body>
 //       </html>
 //     `;
 //     const w = window.open("", "_blank", "width=900,height=900");
 //     w.document.write(html);
 //     w.document.close();
 //   };
 //   return (
 //     <Layout user={user} title="المخزون">
 //       <div dir="rtl" className="space-y-6">
 //         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
 //           <h1 className="text-xl font-bold text-gray-800">🏬 إدارة المخزون</h1>
 //           <button
 //             onClick={printInventoryReport}
 //             className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
 //           >
 //             🖨️ طباعة تقرير المخزون
 //           </button>
 //         </div>
 //         <div className="overflow-x-auto bg-white border shadow rounded-xl">
 //           <table className="w-full text-sm text-right">
 //             <thead className="text-gray-700 bg-gray-50">
 //               <tr>
 //                 <th className="p-3">المنتج</th>
 //                 <th className="p-3">الكود</th>
 //                 <th className="p-3">الفئة</th>
 //                 <th className="p-3">الكمية</th>
 //                 <th className="p-3">الحد الأدنى</th>
 //                 <th className="p-3">الصلاحية</th>
 //                 <th className="p-3 text-center">تحذيرات</th>
 //                 <th className="p-3 text-center">إجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {products.map((p) => {
 //                 const warnings = getWarnings(p);
 //                 const daysLeft = p.expiryDate
 //                   ? (new Date(p.expiryDate) - new Date()) /
 //                     (1000 * 60 * 60 * 24)
 //                   : null;
 //                 return (
 //                   <tr
 //                     key={p.id}
 //                     className="transition border-t hover:bg-gray-50"
 //                   >
 //                     <td className="p-3">{p.name}</td>
 //                     <td className="p-3 text-xs text-gray-600">{p.sku}</td>
 //                     <td className="p-3">{p.category}</td>
 //                     <td
 //                       className={`p-3 ${
 //                         p.quantity <= 0
 //                           ? "text-red-700 font-bold"
 //                           : p.quantity < (p.minQty || 5)
 //                           ? "text-amber-600 font-semibold"
 //                           : ""
 //                       }`}
 //                     >
 //                       {p.quantity}
 //                     </td>
 //                     <td className="p-3">{p.minQty}</td>
 //                     <td className="p-3 text-xs">
 //                       {p.expiryDate
 //                         ? daysLeft < 0
 //                           ? "❌ منتهي"
 //                           : `${p.expiryDate}`
 //                         : "-"}
 //                     </td>
 //                     <td className="p-3 text-center">
 //                       <WarningIndicator warnings={warnings} />
 //                     </td>
 //                     <td className="p-3 text-center">
 //                       <button
 //                         onClick={() => openModal(p)}
 //                         className="px-3 py-1 text-xs text-white rounded-lg bg-sky-600 hover:bg-sky-700"
 //                       >
 //                         🔄 توريد / خصم
 //                       </button>
 //                     </td>
 //                   </tr>
 //                 );
 //               })}
 //               {products.length === 0 && (
 //                 <tr>
 //                   <td colSpan={8} className="p-4 text-center text-gray-400">
 //                     لا توجد بيانات مخزون حالياً…
 //                   </td>
 //                 </tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //       </div>
 //       {showModal && selected && (
 //         <Modal
 //           title="تعديل المخزون"
 //           onClose={() => setShowModal(false)}
 //           onConfirm={handleConfirm}
 //         >
 //           <div dir="rtl" className="space-y-3 text-sm">
 //             <p>
 //               المنتج: <strong>{selected.name}</strong>
 //             </p>
 //             <div>
 //               <label className="block mb-1 text-xs text-gray-500">
 //                 نوع العملية
 //               </label>
 //               <select
 //                 className="w-full p-2 border rounded"
 //                 value={type}
 //                 onChange={(e) => setType(e.target.value)}
 //               >
 //                 <option value="in">➕ توريد</option>
 //                 <option value="out">➖ خصم</option>
 //               </select>
 //             </div>
 //             <div>
 //               <label className="block mb-1 text-xs text-gray-500">
 //                 الكمية
 //               </label>
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="مثال: 10"
 //                 value={qty}
 //                 onChange={(e) => setQty(e.target.value)}
 //               />
 //             </div>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   );
 // }
 // // pages/inventory.js
 // import { useState } from "react";
 // import Layout from "../components/Layout";
 // import Modal from "../components/Modal";
 // import { useInventory } from "../context/InventoryContext";
 // import { useAuth } from "../context/AuthContext";
 // import WarningIndicator from "../components/WarningIndicator";
 // export default function InventoryPage() {
 //   const { user, hasPermission } = useAuth();
 //   const { products, updateStock, getWarnings, printInventoryReport } =
 //     useInventory();
 //   const [showModal, setShowModal] = useState(false);
 //   const [selected, setSelected] = useState(null);
 //   const [qty, setQty] = useState("");
 //   const [type, setType] = useState("in");
 //   if (!hasPermission(["admin", "pharmacist"])) {
 //     return (
 //       <div dir="rtl" className="p-6 text-center text-red-600">
 //         ⚠️ ليس لديك صلاحية لدخول شاشة المخزون.
 //       </div>
 //     );
 //   }
 //   const openModal = (p) => {
 //     setSelected(p);
 //     setQty("");
 //     setType("in");
 //     setShowModal(true);
 //   };
 //   const handleConfirm = () => {
 //     const n = Number(qty);
 //     if (!n || n <= 0) {
 //       alert("أدخل كمية صحيحة");
 //       return;
 //     }
 //     updateStock(selected.id, n, type);
 //     setShowModal(false);
 //   };
 //   return (
 //     <Layout user={user} title="المخزون">
 //       <div dir="rtl" className="space-y-6">
 //         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
 //           <h1 className="text-xl font-bold text-gray-800">🏬 إدارة المخزون</h1>
 //           <button
 //             onClick={printInventoryReport}
 //             className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
 //           >
 //             🖨️ طباعة تقرير المخزون
 //           </button>
 //         </div>
 //         <div className="overflow-x-auto bg-white border shadow rounded-xl">
 //           <table className="w-full text-sm text-right">
 //             <thead className="text-gray-700 bg-gray-50">
 //               <tr>
 //                 <th className="p-3">المنتج</th>
 //                 <th className="p-3">الكود</th>
 //                 <th className="p-3">الفئة</th>
 //                 <th className="p-3">الكمية</th>
 //                 <th className="p-3">الحد الأدنى</th>
 //                 <th className="p-3">الصلاحية</th>
 //                 <th className="p-3 text-center">تحذيرات</th>
 //                 <th className="p-3 text-center">إجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {products.map((p) => {
 //                 const warnings = getWarnings(p);
 //                 const daysLeft =
 //                   p.expiryDate
 //                     ? (new Date(p.expiryDate) - new Date()) /
 //                       (1000 * 60 * 60 * 24)
 //                     : null;
 //                 return (
 //                   <tr
 //                     key={p.id}
 //                     className="transition border-t hover:bg-gray-50"
 //                   >
 //                     <td className="p-3">{p.name}</td>
 //                     <td className="p-3 text-xs text-gray-600">{p.sku}</td>
 //                     <td className="p-3">{p.category}</td>
 //                     <td
 //                       className={`p-3 ${
 //                         p.quantity < (p.minQty || 5)
 //                           ? "text-red-600 font-semibold"
 //                           : ""
 //                       }`}
 //                     >
 //                       {p.quantity}
 //                     </td>
 //                     <td className="p-3">{p.minQty}</td>
 //                     <td className="p-3 text-xs">
 //                       {p.expiryDate
 //                         ? daysLeft < 0
 //                           ? "❌ منتهي"
 //                           : `${p.expiryDate}`
 //                         : "-"}
 //                     </td>
 //                     <td className="p-3 text-center">
 //                       <WarningIndicator warnings={warnings} />
 //                     </td>
 //                     <td className="p-3 text-center">
 //                       <button
 //                         onClick={() => openModal(p)}
 //                         className="px-3 py-1 text-xs text-white rounded-lg bg-sky-600 hover:bg-sky-700"
 //                       >
 //                         🔄 توريد / خصم
 //                       </button>
 //                     </td>
 //                   </tr>
 //                 );
 //               })}
 //               {products.length === 0 && (
 //                 <tr>
 //                   <td colSpan={8} className="p-4 text-center text-gray-400">
 //                     لا توجد بيانات مخزون حالياً…
 //                   </td>
 //                 </tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //       </div>
 //       {showModal && selected && (
 //         <Modal
 //           title="تعديل المخزون"
 //           onClose={() => setShowModal(false)}
 //           onConfirm={handleConfirm}
 //         >
 //           <div dir="rtl" className="space-y-3 text-sm">
 //             <p>
 //               المنتج: <strong>{selected.name}</strong>
 //             </p>
 //             <div>
 //               <label className="block mb-1 text-xs text-gray-500">
 //                 نوع العملية
 //               </label>
 //               <select
 //                 className="w-full p-2 border rounded"
 //                 value={type}
 //                 onChange={(e) => setType(e.target.value)}
 //               >
 //                 <option value="in">➕ توريد</option>
 //                 <option value="out">➖ خصم</option>
 //               </select>
 //             </div>
 //             <div>
 //               <label className="block mb-1 text-xs text-gray-500">
 //                 الكمية
 //               </label>
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="مثال: 10"
 //                 value={qty}
 //                 onChange={(e) => setQty(e.target.value)}
 //               />
 //             </div>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   );
 // }
 // // pages/inventory.js
 // import { useState } from "react";
 // import Layout from "../components/Layout";
 // import Modal from "../components/Modal";
 // import { useInventory } from "../context/InventoryContext";
 // import { useAuth } from "../context/AuthContext";
 // export default function InventoryPage() {
 //   const { user, hasPermission } = useAuth();
 //   if (!hasPermission(["admin", "pharmacist"])) {
 //     return <div className="p-5 text-center text-red-600">⚠️ غير مسموح لك</div>;
 //   }
 //   const { products, updateStock, getWarnings, printInventoryReport } =
 //     useInventory();
 //   const [showModal, setShowModal] = useState(false);
 //   const [selected, setSelected] = useState(null);
 //   const [qty, setQty] = useState("");
 //   const [type, setType] = useState("in");
 //   const openModal = (p) => {
 //     setSelected(p);
 //     setQty("");
 //     setType("in");
 //     setShowModal(true);
 //   };
 //   return (
 //     <Layout user={user} title="المخزون">
 //       <div className="space-y-6" dir="rtl">
 //         <div className="flex justify-between">
 //           <h1 className="text-xl font-bold">🏬 المخزون</h1>
 //           <button
 //             onClick={printInventoryReport}
 //             className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
 //           >
 //             🖨️ طباعة التقرير
 //           </button>
 //         </div>
 //         <div className="overflow-x-auto bg-white rounded shadow">
 //           <table className="w-full text-sm">
 //             <thead className="bg-gray-50">
 //               <tr>
 //                 <th className="p-3">اسم المنتج</th>
 //                 <th className="p-3">الكمية</th>
 //                 <th className="p-3">الحد الأدنى</th>
 //                 <th className="p-3">الصلاحية</th>
 //                 <th className="p-3">تحذيرات</th>
 //                 <th className="p-3">إجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {products.map((p) => {
 //                 const warnings = getWarnings(p);
 //                 const days =
 //                   (new Date(p.expiryDate) - new Date()) /
 //                   (1000 * 60 * 60 * 24);
 //                 return (
 //                   <tr key={p.id} className="border-t hover:bg-gray-50">
 //                     <td className="p-3">{p.name}</td>
 //                     <td className="p-3">{p.quantity}</td>
 //                     <td className="p-3">{p.minQty}</td>
 //                     <td className="p-3">
 //                       {days < 0
 //                         ? "❌ منتهي"
 //                         : days < 30
 //                         ? `⚠️ ${Math.ceil(days)} يوم`
 //                         : "✔️ صالح"}
 //                     </td>
 //                     <td className="p-3">
 //                       <div className="flex flex-wrap gap-1">
 //                         {warnings.map((w, i) => (
 //                           <span
 //                             key={i}
 //                             className="inline-block px-2 py-1 text-xs text-white bg-red-600 rounded"
 //                           >
 //                             {w}
 //                           </span>
 //                         ))}
 //                       </div>
 //                     </td>
 //                     <td className="p-3">
 //                       <button
 //                         onClick={() => openModal(p)}
 //                         className="px-3 py-1 text-white rounded bg-sky-700"
 //                       >
 //                         تعديل
 //                       </button>
 //                     </td>
 //                   </tr>
 //                 );
 //               })}
 //             </tbody>
 //           </table>
 //         </div>
 //         {showModal && selected && (
 //           <Modal
 //             title="تعديل المخزون"
 //             onClose={() => setShowModal(false)}
 //             onConfirm={() => {
 //               updateStock(selected.id, Number(qty), type);
 //               setShowModal(false);
 //             }}
 //           >
 //             <div className="space-y-3 text-sm">
 //               <p>
 //                 المنتج: <strong>{selected.name}</strong>
 //               </p>
 //               <select
 //                 className="w-full p-2 border rounded"
 //                 value={type}
 //                 onChange={(e) => setType(e.target.value)}
 //               >
 //                 <option value="in">➕ توريد</option>
 //                 <option value="out">➖ خصم</option>
 //               </select>
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="الكمية"
 //                 value={qty}
 //                 onChange={(e) => setQty(e.target.value)}
 //               />
 //             </div>
 //           </Modal>
 //         )}
 //       </div>
 //     </Layout>
 //   );
 // }
 // // pages/inventory.js
 // import { useEffect, useState } from "react";
 // import { useRouter } from "next/router";
 // import Layout from "../components/Layout";
 // import Modal from "../components/Modal";
 // import { useInventory } from "../context/InventoryContext";
 // export default function InventoryPage() {
 //   const router = useRouter();
 //   const { products, updateStock, getWarnings } = useInventory();
 //   const [showModal, setShowModal] = useState(false);
 //   const [selectedProduct, setSelectedProduct] = useState(null);
 //   const [qty, setQty] = useState("");
 //   const [type, setType] = useState("in");
 //   useEffect(() => {
 //     const { product } = router.query;
 //     if (product && products.length) {
 //       const p = products.find((x) => x.id === Number(product));
 //       if (p) openModal(p);
 //     }
 //   }, [router.query, products]);
 //   const openModal = (prod) => {
 //     setSelectedProduct(prod);
 //     setQty("");
 //     setType("in");
 //     setShowModal(true);
 //   };
 //   const handleUpdate = () => {
 //     const n = Number(qty || 0);
 //     if (!n || n <= 0) {
 //       alert("أدخل كمية صحيحة");
 //       return;
 //     }
 //     updateStock(selectedProduct.id, n, type);
 //     setShowModal(false);
 //   };
 //   return (
 //     <Layout title="المخزن">
 //       <div dir="rtl" className="space-y-6">
 //         <h1 className="text-2xl font-bold text-gray-800">🏬 إدارة المخزون</h1>
 //         <div className="overflow-x-auto bg-white border shadow-md rounded-xl">
 //           <table className="w-full text-sm text-right">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="p-3">المنتج</th>
 //                 <th className="p-3">الكمية</th>
 //                 <th className="p-3">الحد الأدنى</th>
 //                 <th className="p-3">الانتهاء</th>
 //                 <th className="p-3">تحذيرات</th>
 //                 <th className="p-3">إجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {products.map((p) => {
 //                 const warnings = getWarnings(p);
 //                 return (
 //                   <tr key={p.id} className="border-t hover:bg-gray-50">
 //                     <td className="p-3">{p.name}</td>
 //                     <td
 //                       className={`p-3 ${
 //                         p.quantity < (p.minQty ?? 5)
 //                           ? "text-red-600 font-semibold"
 //                           : ""
 //                       }`}
 //                     >
 //                       {p.quantity}
 //                     </td>
 //                     <td className="p-3">{p.minQty ?? "-"}</td>
 //                     <td className="p-3 text-red-600">
 //                       {p.expiryDate || ""}
 //                     </td>
 //                     <td className="p-3 text-xs text-red-600">
 //                       {warnings.length
 //                         ? warnings.map((w, i) => <div key={i}>{w}</div>)
 //                         : "لا توجد"}
 //                     </td>
 //                     <td className="p-3">
 //                       <button
 //                         onClick={() => openModal(p)}
 //                         className="px-3 py-1 text-white rounded-lg bg-sky-600 hover:bg-sky-700"
 //                       >
 //                         🔄 توريد / خصم
 //                       </button>
 //                     </td>
 //                   </tr>
 //                 );
 //               })}
 //               {!products.length && (
 //                 <tr>
 //                   <td
 //                     colSpan={6}
 //                     className="p-4 text-center text-gray-400"
 //                   >
 //                     لا توجد بيانات مخزون…
 //                   </td>
 //                 </tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //       </div>
 //       {showModal && selectedProduct && (
 //         <Modal
 //           title="تعديل المخزون"
 //           onClose={() => setShowModal(false)}
 //           onConfirm={handleUpdate}
 //         >
 //           <div dir="rtl" className="space-y-3 text-sm">
 //             <div className="p-2 border rounded bg-gray-50">
 //               المنتج: <strong>{selectedProduct.name}</strong>
 //             </div>
 //             <label className="text-xs text-gray-500">نوع العملية</label>
 //             <select
 //               className="w-full p-2 border rounded"
 //               value={type}
 //               onChange={(e) => setType(e.target.value)}
 //             >
 //               <option value="in">➕ توريد</option>
 //               <option value="out">➖ خصم</option>
 //             </select>
 //             <label className="text-xs text-gray-500">الكمية</label>
 //             <input
 //               type="number"
 //               className="w-full p-2 border rounded"
 //               placeholder="الكمية"
 //               value={qty}
 //               onChange={(e) => setQty(e.target.value)}
 //             />
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   );
 // }
 // // pages/inventory.js
 // import { useEffect, useMemo, useState } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // import {
 //   ResponsiveContainer,
 //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
 //   PieChart, Pie, Cell
 // } from 'recharts'
 // export default function Inventory() {
 //   // ---------- بيانات وهمية أولية ----------
 //   const initialProducts = [
 //     {
 //       id: 1,
 //       name: 'باراسيتامول 500mg',
 //       barcode: '6291234567890',
 //       category: 'مسكنات',
 //       supplier: 'GSK',
 //       purchasePrice: 8,
 //       salePrice: 15,
 //       qty: 32,
 //       minQty: 10,
 //       expiry: '2026-02-15',
 //       notes: ''
 //     },
 //     {
 //       id: 2,
 //       name: 'أموكسيسيلين 250mg',
 //       barcode: '6299876543210',
 //       category: 'مضادات حيوية',
 //       supplier: 'Pfizer',
 //       purchasePrice: 22,
 //       salePrice: 35,
 //       qty: 6,
 //       minQty: 12,
 //       expiry: '2025-12-01',
 //       notes: ''
 //     },
 //     {
 //       id: 3,
 //       name: 'فيتامين سي 1000mg',
 //       barcode: '6291122334455',
 //       category: 'فيتامينات',
 //       supplier: 'Hikma',
 //       purchasePrice: 10,
 //       salePrice: 20,
 //       qty: 120,
 //       minQty: 20,
 //       expiry: '2027-05-10',
 //       notes: ''
 //     },
 //     {
 //       id: 4,
 //       name: 'ايبوبروفين 400mg',
 //       barcode: '6295566778899',
 //       category: 'مسكنات',
 //       supplier: 'Novartis',
 //       purchasePrice: 12,
 //       salePrice: 18,
 //       qty: 4,
 //       minQty: 10,
 //       expiry: '2025-11-20',
 //       notes: ''
 //     },
 //     {
 //       id: 5,
 //       name: 'زنك 25mg',
 //       barcode: '6294433221100',
 //       category: 'فيتامينات',
 //       supplier: 'Jamjoom',
 //       purchasePrice: 9,
 //       salePrice: 16,
 //       qty: 40,
 //       minQty: 10,
 //       expiry: '2025-12-28',
 //       notes: ''
 //     }
 //   ]
 //   // ---------- الحالة العامة ----------
 //   const [products, setProducts] = useState([])
 //   const [loading, setLoading] = useState(true)
 //   // فلاتر وفرز
 //   const [search, setSearch] = useState('')
 //   const [category, setCategory] = useState('all')
 //   const [supplier, setSupplier] = useState('all')
 //   const [status, setStatus] = useState('all') // all | low | expiring | ok
 //   const [sortKey, setSortKey] = useState('name') // name | qty | expiry | salePrice
 //   const [sortDir, setSortDir] = useState('asc') // asc | desc
 //   // مودالات
 //   const [showFormModal, setShowFormModal] = useState(false)
 //   const [editing, setEditing] = useState(null) // null = إضافة / {..} = تعديل
 //   const [form, setForm] = useState({
 //     name: '',
 //     barcode: '',
 //     category: '',
 //     supplier: '',
 //     purchasePrice: '',
 //     salePrice: '',
 //     qty: '',
 //     minQty: '',
 //     expiry: '',
 //     notes: ''
 //   })
 //   const [showViewModal, setShowViewModal] = useState(null) // يحتوي العنصر المعروض
 //   const [showRestockModal, setShowRestockModal] = useState(null) // يحتوي العنصر الجاري توريده
 //   const [restockQty, setRestockQty] = useState(1)
 //   useEffect(() => {
 //   const token = localStorage.getItem("pharmacy_token")
 //   if (!token) {
 //     router.replace("/")   // redirect to login
 //   }
 // }, [])
 //   useEffect(() => {
 //     // محاكاة جلب البيانات
 //     setTimeout(() => {
 //       setProducts(initialProducts)
 //       setLoading(false)
 //     }, 300)
 //   }, [])
 //   // ---------- Utilities ----------
 //   const today = new Date()
 //   const daysDiff = (dateStr) => {
 //     const d = new Date(dateStr)
 //     return Math.ceil((d - today) / (1000 * 60 * 60 * 24))
 //   }
 //   const isExpiringSoon = (dateStr, withinDays = 30) => daysDiff(dateStr) <= withinDays && new Date(dateStr) >= today
 //   const isExpired = (dateStr) => new Date(dateStr) < today
 //   // ---------- ملخصات ----------
 //   const totals = useMemo(() => {
 //     const totalItems = products.length
 //     const totalQty = products.reduce((s, p) => s + Number(p.qty || 0), 0)
 //     const lowCount = products.filter(p => Number(p.qty) <= Number(p.minQty)).length
 //     const expiringCount = products.filter(p => isExpiringSoon(p.expiry, 30) || isExpired(p.expiry)).length
 //     return { totalItems, totalQty, lowCount, expiringCount }
 //   }, [products])
 //   // ---------- فلاتر + فرز ----------
 //   const categoriesList = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))], [products])
 //   const suppliersList  = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.supplier).filter(Boolean)))], [products])
 //   const filtered = useMemo(() => {
 //     let list = [...products]
 //     // بحث بالاسم أو الباركود
 //     if (search.trim()) {
 //       const q = search.toLowerCase()
 //       list = list.filter(p =>
 //         p.name.toLowerCase().includes(q) ||
 //         (p.barcode && p.barcode.toLowerCase().includes(q))
 //       )
 //     }
 //     // فئة
 //     if (category !== 'all') list = list.filter(p => p.category === category)
 //     // مورد
 //     if (supplier !== 'all') list = list.filter(p => p.supplier === supplier)
 //     // الحالة
 //     if (status !== 'all') {
 //       list = list.filter(p => {
 //         const low = Number(p.qty) <= Number(p.minQty)
 //         const expSoon = isExpiringSoon(p.expiry, 30) || isExpired(p.expiry)
 //         if (status === 'low') return low
 //         if (status === 'expiring') return expSoon
 //         if (status === 'ok') return !low && !expSoon
 //         return true
 //       })
 //     }
 //     // الفرز
 //     list.sort((a, b) => {
 //       let va = a[sortKey], vb = b[sortKey]
 //       if (sortKey === 'name' || sortKey === 'category' || sortKey === 'supplier') {
 //         va = (va || '').toString().toLowerCase()
 //         vb = (vb || '').toString().toLowerCase()
 //       } else if (sortKey === 'expiry') {
 //         va = new Date(va).getTime()
 //         vb = new Date(vb).getTime()
 //       } else {
 //         va = Number(va)
 //         vb = Number(vb)
 //       }
 //       if (va < vb) return sortDir === 'asc' ? -1 : 1
 //       if (va > vb) return sortDir === 'asc' ? 1 : -1
 //       return 0
 //     })
 //     return list
 //   }, [products, search, category, supplier, status, sortKey, sortDir])
 //   // ---------- تعامل مع النماذج ----------
 //   const resetForm = () => {
 //     setForm({
 //       name: '',
 //       barcode: '',
 //       category: '',
 //       supplier: '',
 //       purchasePrice: '',
 //       salePrice: '',
 //       qty: '',
 //       minQty: '',
 //       expiry: '',
 //       notes: ''
 //     })
 //   }
 //   const openAdd = () => {
 //     resetForm()
 //     setEditing(null)
 //     setShowFormModal(true)
 //   }
 //   const openEdit = (item) => {
 //     setEditing(item)
 //     setForm({
 //       name: item.name || '',
 //       barcode: item.barcode || '',
 //       category: item.category || '',
 //       supplier: item.supplier || '',
 //       purchasePrice: item.purchasePrice || '',
 //       salePrice: item.salePrice || '',
 //       qty: item.qty || '',
 //       minQty: item.minQty || '',
 //       expiry: item.expiry || '',
 //       notes: item.notes || ''
 //     })
 //     setShowFormModal(true)
 //   }
 //   const openView = (item) => {
 //     setShowViewModal(item)
 //   }
 //   const openRestock = (item) => {
 //     setShowRestockModal(item)
 //     setRestockQty(1)
 //   }
 //   const handleSave = () => {
 //     // تحقق أساسي
 //     const required = ['name', 'category', 'supplier', 'salePrice', 'qty', 'minQty', 'expiry']
 //     for (const k of required) {
 //       if (!form[k] && form[k] !== 0) {
 //         toast.error('⚠️ الرجاء إدخال الحقول المطلوبة')
 //         return
 //       }
 //     }
 //     if (editing) {
 //       // تعديل
 //       setProducts(prev => prev.map(p => p.id === editing.id ? { ...editing, ...form, purchasePrice: Number(form.purchasePrice || 0), salePrice: Number(form.salePrice || 0), qty: Number(form.qty || 0), minQty: Number(form.minQty || 0) } : p))
 //       toast.success('✅ تم تعديل المنتج بنجاح')
 //     } else {
 //       // إضافة
 //       const newItem = {
 //         id: Date.now(),
 //         ...form,
 //         purchasePrice: Number(form.purchasePrice || 0),
 //         salePrice: Number(form.salePrice || 0),
 //         qty: Number(form.qty || 0),
 //         minQty: Number(form.minQty || 0)
 //       }
 //       setProducts(prev => [newItem, ...prev])
 //       toast.success('✅ تم إضافة المنتج بنجاح')
 //     }
 //     setShowFormModal(false)
 //     setEditing(null)
 //     resetForm()
 //   }
 //   const handleDelete = (id) => {
 //     if (!confirm('هل تريد حذف هذا المنتج؟')) return
 //     setProducts(prev => prev.filter(p => p.id !== id))
 //     toast.success('🗑️ تم حذف المنتج')
 //   }
 //   const handleRestock = () => {
 //     const qtyToAdd = Number(restockQty || 0)
 //     if (!qtyToAdd || qtyToAdd <= 0) {
 //       toast.error('أدخل كمية توريد صحيحة')
 //       return
 //     }
 //     setProducts(prev =>
 //       prev.map(p =>
 //         p.id === showRestockModal.id ? { ...p, qty: Number(p.qty) + qtyToAdd } : p
 //       )
 //     )
 //     setShowRestockModal(null)
 //     toast.success('📥 تم إضافة التوريد بنجاح')
 //   }
 //   const headerButton = (label, onClick, color = theme.colors.primary, outline = false) => (
 //     <button
 //       onClick={onClick}
 //       className={`px-4 py-2 text-sm rounded-md shadow-sm border transition active:scale-[.98] ${
 //         outline ? 'bg-white text-gray-700 hover:bg-gray-50' : 'text-white hover:opacity-90'
 //       }`}
 //       style={{
 //         backgroundColor: outline ? 'white' : color,
 //         borderColor: outline ? '#e5e7eb' : `${color}40`
 //       }}
 //     >
 //       {label}
 //     </button>
 //   )
 //   // ---------- بيانات الرسوم ----------
 //   const pieData = useMemo(() => {
 //     const byCat = {}
 //     products.forEach(p => {
 //       byCat[p.category] = (byCat[p.category] || 0) + Number(p.qty || 0)
 //     })
 //     return Object.entries(byCat).map(([name, value]) => ({ name, value }))
 //   }, [products])
 //   const barData = useMemo(() => {
 //     // أعلى 6 أصناف كمّية
 //     const top = [...products]
 //       .sort((a, b) => Number(b.qty) - Number(a.qty))
 //       .slice(0, 6)
 //       .map(p => ({ name: p.name, qty: Number(p.qty) }))
 //     return top
 //   }, [products])
 //   const PIE_COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#14B8A6']
 //   if (loading) {
 //     return (
 //       <Layout user={{ name: 'إدارة المخزون', role: 'admin' }} title="إدارة المخزون">
 //         <div className="flex items-center justify-center h-80">
 //           <p className="text-gray-600">جاري تحميل البيانات...</p>
 //         </div>
 //       </Layout>
 //     )
 //   }
 //   return (
 //     <Layout user={{ name: 'إدارة المخزون', role: 'admin' }} title="إدارة المخزون">
 //       <div dir="rtl" className="space-y-6">
 //         {/* ---------- بطاقات الملخص ---------- */}
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
 //           <SummaryCard title="عدد الأصناف" value={totals.totalItems} color="text-sky-600" />
 //           <SummaryCard title="إجمالي الكميات" value={totals.totalQty} color="text-green-600" />
 //           <SummaryCard title="منخفض المخزون" value={totals.lowCount} color="text-amber-600" />
 //           <SummaryCard title="قرب الانتهاء" value={totals.expiringCount} color="text-red-600" />
 //         </div>
 //         {/* ---------- شريط التحكم ---------- */}
 //         <div className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
 //           {/* فلاتر */}
 // {/* ---------- شريط التحكم والفلاتر ---------- */}
 // <div className="p-4 space-y-3 bg-white border rounded-lg shadow-sm">
 //   {/* 🧭 فلاتر البحث */}
 //   <div className="flex flex-col w-full gap-2 md:flex-row md:items-center md:justify-between">
 //     <div className="flex flex-col w-full md:flex-row md:items-center md:flex-wrap">
 //       <input
 //         value={search}
 //         onChange={(e) => setSearch(e.target.value)}
 //         placeholder="🔍 ابحث بالاسم أو الباركود..."
 //         className="w-full px-3 py-2 text-sm border rounded-md md:max-w-xs focus:ring-2 focus:ring-sky-400"
 //       />
 //       <select
 //         value={category}
 //         onChange={(e) => setCategory(e.target.value)}
 //         className="w-full px-3 py-2 text-sm border rounded-md md:w-auto"
 //       >
 //         {categoriesList.map((c) => (
 //           <option key={c} value={c}>
 //             {c === 'all' ? 'كل الفئات' : c}
 //           </option>
 //         ))}
 //       </select>
 //       <select
 //         value={supplier}
 //         onChange={(e) => setSupplier(e.target.value)}
 //         className="w-full px-3 py-2 text-sm border rounded-md md:w-auto"
 //       >
 //         {suppliersList.map((s) => (
 //           <option key={s} value={s}>
 //             {s === 'all' ? 'كل الموردين' : s}
 //           </option>
 //         ))}
 //       </select>
 //       <select
 //         value={status}
 //         onChange={(e) => setStatus(e.target.value)}
 //         className="w-full px-3 py-2 text-sm border rounded-md md:w-auto"
 //       >
 //         <option value="all">كل الحالات</option>
 //         <option value="low">منخفض المخزون</option>
 //         <option value="expiring">قرب الانتهاء</option>
 //         <option value="ok">صالح</option>
 //       </select>
 //       <div className="flex items-center w-full gap-2 md:w-auto">
 //         <select
 //           value={sortKey}
 //           onChange={(e) => setSortKey(e.target.value)}
 //           className="flex-1 px-3 py-2 text-sm border rounded-md"
 //         >
 //           <option value="name">الاسم</option>
 //           <option value="qty">الكمية</option>
 //           <option value="salePrice">سعر البيع</option>
 //           <option value="expiry">الانتهاء</option>
 //         </select>
 //         <button
 //           onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
 //           className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 whitespace-nowrap"
 //           title="تبديل ترتيب الفرز"
 //         >
 //           {sortDir === 'asc' ? '⬆️ تصاعدي' : '⬇️ تنازلي'}
 //         </button>
 //       </div>
 //     </div>
 //   </div>
 //   {/* 🔘 الأزرار أسفل الفلاتر — متجاوبة */}
 //   <div className="flex flex-wrap justify-start gap-2 pt-2 border-t border-gray-100">
 //     <button
 //       onClick={openAdd}
 //       className="flex items-center gap-1 px-4 py-2 text-sm text-white transition-all rounded-md shadow-sm hover:opacity-90"
 //       style={{ backgroundColor: theme.colors.primary }}
 //     >
 //       ➕ <span>إضافة منتج</span>
 //     </button>
 //     <button
 //       onClick={() => setStatus('low')}
 //       className="px-4 py-2 text-sm transition-all border rounded-md text-amber-700 border-amber-200 hover:bg-amber-50"
 //     >
 //       ⚠️ منخفض المخزون
 //     </button>
 //     <button
 //       onClick={() => setStatus('expiring')}
 //       className="px-4 py-2 text-sm text-red-700 transition-all border border-red-200 rounded-md hover:bg-red-50"
 //     >
 //       ⏰ قرب الانتهاء
 //     </button>
 //     <button
 //       onClick={() => {
 //         setSearch('')
 //         setCategory('all')
 //         setSupplier('all')
 //         setStatus('all')
 //         setSortKey('name')
 //         setSortDir('asc')
 //         toast.success('تمت إعادة التصفية')
 //       }}
 //       className="px-4 py-2 text-sm text-gray-700 transition-all border border-gray-200 rounded-md hover:bg-gray-50"
 //     >
 //       🔄 إعادة ضبط
 //     </button>
 //   </div>
 // </div>
 //         </div>
 //         {/* ---------- جدول المخزون ---------- */}
 //         <div className="p-0 overflow-hidden bg-white border rounded-lg shadow-sm">
 //           <div className="overflow-x-auto">
 //             <table className="w-full text-sm text-right">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">#</th>
 //                   <th className="px-3 py-2">اسم الدواء</th>
 //                   <th className="px-3 py-2">الباركود</th>
 //                   <th className="px-3 py-2">الفئة</th>
 //                   <th className="px-3 py-2">المورد</th>
 //                   <th className="px-3 py-2">سعر الشراء</th>
 //                   <th className="px-3 py-2">سعر البيع</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">الحد الأدنى</th>
 //                   <th className="px-3 py-2">الانتهاء</th>
 //                   <th className="px-3 py-2">الإجراءات</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {filtered.length ? filtered.map((p, idx) => {
 //                   const low = Number(p.qty) <= Number(p.minQty)
 //                   const expSoon = isExpiringSoon(p.expiry, 30)
 //                   const expired = isExpired(p.expiry)
 //                   return (
 //                     <tr key={p.id} className="border-t hover:bg-gray-50">
 //                       <td className="px-3 py-2">{idx + 1}</td>
 //                       <td className="px-3 py-2 font-medium text-gray-800">{p.name}</td>
 //                       <td className="px-3 py-2">{p.barcode || '-'}</td>
 //                       <td className="px-3 py-2">{p.category}</td>
 //                       <td className="px-3 py-2">{p.supplier}</td>
 //                       <td className="px-3 py-2">{Number(p.purchasePrice).toFixed(2)} ر.س</td>
 //                       <td className="px-3 py-2">{Number(p.salePrice).toFixed(2)} ر.س</td>
 //                       <td className={`px-3 py-2 ${low ? 'text-amber-600 font-semibold' : 'text-gray-800'}`}>{p.qty}</td>
 //                       <td className="px-3 py-2">{p.minQty}</td>
 //                       <td className={`px-3 py-2 ${expired ? 'text-red-600 font-semibold' : expSoon ? 'text-amber-600 font-semibold' : ''}`}>
 //                         {p.expiry}
 //                       </td>
 //                       <td className="px-3 py-2">
 //                         <div className="flex flex-wrap gap-1">
 //                           <button
 //                             onClick={() => openView(p)}
 //                             className="px-2 py-1 border rounded text-sky-700 border-sky-100 hover:bg-sky-50"
 //                           >
 //                             عرض
 //                           </button>
 //                           <button
 //                             onClick={() => openEdit(p)}
 //                             className="px-2 py-1 text-indigo-700 border border-indigo-100 rounded hover:bg-indigo-50"
 //                           >
 //                             تعديل
 //                           </button>
 //                           <button
 //                             onClick={() => openRestock(p)}
 //                             className="px-2 py-1 text-green-700 border border-green-100 rounded hover:bg-green-50"
 //                           >
 //                             توريد
 //                           </button>
 //                           <button
 //                             onClick={() => handleDelete(p.id)}
 //                             className="px-2 py-1 text-red-600 border border-red-100 rounded hover:bg-red-50"
 //                           >
 //                             حذف
 //                           </button>
 //                         </div>
 //                       </td>
 //                     </tr>
 //                   )
 //                 }) : (
 //                   <tr>
 //                     <td colSpan="11" className="px-3 py-6 text-center text-gray-500">
 //                       لا توجد نتائج مطابقة للبحث/الفلاتر الحالية
 //                     </td>
 //                   </tr>
 //                 )}
 //               </tbody>
 //             </table>
 //           </div>
 //         </div>
 //         {/* ---------- تنبيهات سريعة ---------- */}
 //         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
 //           <div className="p-4 bg-white border rounded-lg shadow-sm">
 //             <h4 className="mb-2 text-base font-semibold text-gray-700">⚠️ أصناف منخفضة المخزون</h4>
 //             <ul className="space-y-1 text-sm list-disc list-inside">
 //               {products.filter(p => Number(p.qty) <= Number(p.minQty)).slice(0, 8).map(p => (
 //                 <li key={p.id} className="flex items-center justify-between">
 //                   <span>{p.name}</span>
 //                   <button onClick={() => openRestock(p)} className="px-2 py-0.5 text-green-700 border border-green-100 rounded hover:bg-green-50">توريد</button>
 //                 </li>
 //               ))}
 //               {products.filter(p => Number(p.qty) <= Number(p.minQty)).length === 0 && (
 //                 <li className="text-gray-500">لا توجد أصناف منخفضة حاليًا</li>
 //               )}
 //             </ul>
 //           </div>
 //           <div className="p-4 bg-white border rounded-lg shadow-sm">
 //             <h4 className="mb-2 text-base font-semibold text-gray-700">⏰ أصناف قاربت على الانتهاء</h4>
 //             <ul className="space-y-1 text-sm list-disc list-inside">
 //               {products.filter(p => isExpiringSoon(p.expiry, 30) || isExpired(p.expiry)).slice(0, 8).map(p => (
 //                 <li key={p.id} className="flex items-center justify-between">
 //                   <span>{p.name} <span className="text-xs text-gray-500">({p.expiry})</span></span>
 //                   <button onClick={() => openEdit(p)} className="px-2 py-0.5 text-indigo-700 border border-indigo-100 rounded hover:bg-indigo-50">تعديل</button>
 //                 </li>
 //               ))}
 //               {products.filter(p => isExpiringSoon(p.expiry, 30) || isExpired(p.expiry)).length === 0 && (
 //                 <li className="text-gray-500">لا توجد أصناف قريبة الانتهاء</li>
 //               )}
 //             </ul>
 //           </div>
 //         </div>
 //         {/* ---------- رسوم تحليلية ---------- */}
 //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
 //           <div className="p-4 bg-white border rounded-lg shadow-sm">
 //             <h4 className="mb-3 text-base font-semibold text-gray-700">توزيع المخزون حسب الفئة</h4>
 //             <ResponsiveContainer width="100%" height={260}>
 //               <PieChart>
 //                 <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={95} label>
 //                   {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
 //                 </Pie>
 //                 <Tooltip />
 //               </PieChart>
 //             </ResponsiveContainer>
 //           </div>
 //           <div className="p-4 bg-white border rounded-lg shadow-sm">
 //             <h4 className="mb-3 text-base font-semibold text-gray-700">أعلى الأصناف كمّيًا</h4>
 //             <ResponsiveContainer width="100%" height={260}>
 //               <BarChart data={barData}>
 //                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //                 <XAxis dataKey="name" />
 //                 <YAxis />
 //                 <Tooltip />
 //                 <Bar dataKey="qty" fill={theme.colors.secondary} />
 //               </BarChart>
 //             </ResponsiveContainer>
 //           </div>
 //         </div>
 //       </div>
 //       {/* ---------- مودال إضافة/تعديل ---------- */}
 //       {showFormModal && (
 //         <Modal
 //           title={editing ? 'تعديل منتج' : 'إضافة منتج'}
 //           onClose={() => { setShowFormModal(false); setEditing(null); }}
 //         >
 //           <div dir="rtl" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
 //             <TextInput label="اسم الدواء *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
 //             <TextInput label="الباركود" value={form.barcode} onChange={(v) => setForm({ ...form, barcode: v })} />
 //             <TextInput label="الفئة *" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
 //             <TextInput label="المورد *" value={form.supplier} onChange={(v) => setForm({ ...form, supplier: v })} />
 //             <NumberInput label="سعر الشراء" value={form.purchasePrice} onChange={(v) => setForm({ ...form, purchasePrice: v })} />
 //             <NumberInput label="سعر البيع *" value={form.salePrice} onChange={(v) => setForm({ ...form, salePrice: v })} />
 //             <NumberInput label="الكمية *" value={form.qty} onChange={(v) => setForm({ ...form, qty: v })} />
 //             <NumberInput label="الحد الأدنى *" value={form.minQty} onChange={(v) => setForm({ ...form, minQty: v })} />
 //             <TextInput type="date" label="تاريخ الانتهاء *" value={form.expiry} onChange={(v) => setForm({ ...form, expiry: v })} />
 //             <div className="sm:col-span-2">
 //               <TextArea label="ملاحظات" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
 //             </div>
 //           </div>
 //           <div className="flex justify-end gap-3 mt-4">
 //             <button onClick={() => { setShowFormModal(false); setEditing(null); }} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
 //             <button onClick={handleSave} className="px-4 py-2 text-white rounded-md hover:opacity-90" style={{ backgroundColor: theme.colors.primary }}>
 //               حفظ
 //             </button>
 //           </div>
 //         </Modal>
 //       )}
 //       {/* ---------- مودال عرض ---------- */}
 //       {showViewModal && (
 //         <Modal title="عرض المنتج" onClose={() => setShowViewModal(null)}>
 //           <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2" dir="rtl">
 //             <InfoRow label="اسم الدواء" value={showViewModal.name} />
 //             <InfoRow label="الباركود" value={showViewModal.barcode || '-'} />
 //             <InfoRow label="الفئة" value={showViewModal.category} />
 //             <InfoRow label="المورد" value={showViewModal.supplier} />
 //             <InfoRow label="سعر الشراء" value={`${Number(showViewModal.purchasePrice || 0).toFixed(2)} ر.س`} />
 //             <InfoRow label="سعر البيع" value={`${Number(showViewModal.salePrice || 0).toFixed(2)} ر.س`} />
 //             <InfoRow label="الكمية" value={showViewModal.qty} />
 //             <InfoRow label="الحد الأدنى" value={showViewModal.minQty} />
 //             <InfoRow label="تاريخ الانتهاء" value={showViewModal.expiry} />
 //             <div className="sm:col-span-2">
 //               <InfoRow label="ملاحظات" value={showViewModal.notes || '-'} />
 //             </div>
 //           </div>
 //           <div className="flex justify-end gap-3 mt-4">
 //             <button onClick={() => setShowViewModal(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إغلاق</button>
 //             <button onClick={() => { setShowViewModal(null); openEdit(showViewModal); }} className="px-4 py-2 text-white rounded-md hover:opacity-90" style={{ backgroundColor: theme.colors.secondary }}>
 //               تعديل
 //             </button>
 //           </div>
 //         </Modal>
 //       )}
 //       {/* ---------- مودال توريد ---------- */}
 //       {showRestockModal && (
 //         <Modal title={`توريد: ${showRestockModal.name}`} onClose={() => setShowRestockModal(null)}>
 //           <div dir="rtl" className="space-y-3">
 //             <p className="text-sm text-gray-600">الكمية الحالية: <span className="font-semibold text-gray-800">{showRestockModal.qty}</span></p>
 //             <NumberInput label="كمية التوريد" value={restockQty} onChange={setRestockQty} min={1} />
 //           </div>
 //           <div className="flex justify-end gap-3 mt-4">
 //             <button onClick={() => setShowRestockModal(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
 //             <button onClick={handleRestock} className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">حفظ التوريد</button>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // /* ======================= مكونات مساعدة صغيرة ======================= */
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
 //       <p className="text-sm text-gray-500">{title}</p>
 //       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
 // function TextInput({ label, value, onChange, type = 'text' }) {
 //   return (
 //     <div className="flex flex-col">
 //       <label className="mb-1 text-sm text-gray-600">{label}</label>
 //       <input
 //         type={type}
 //         value={value}
 //         onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
 //         className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
 //       />
 //     </div>
 //   )
 // }
 // function NumberInput({ label, value, onChange, min = 0 }) {
 //   return (
 //     <TextInput
 //       label={label}
 //       value={value}
 //       onChange={(v) => onChange(Number(v))}
 //       type="number"
 //       min={min}
 //     />
 //   )
 // }
 // function TextArea({ label, value, onChange }) {
 //   return (
 //     <div className="flex flex-col">
 //       <label className="mb-1 text-sm text-gray-600">{label}</label>
 //       <textarea
 //         value={value}
 //         onChange={(e) => onChange(e.target.value)}
 //         className="px-3 py-2 text-sm border rounded-md min-h-[90px] focus:ring-2 focus:ring-sky-400"
 //       />
 //     </div>
 //   )
 // }
 // function InfoRow({ label, value }) {
 //   return (
 //     <div className="flex items-center justify-between px-3 py-2 rounded bg-gray-50">
 //       <span className="text-gray-600">{label}</span>
 //       <span className="font-medium text-gray-800">{value}</span>
 //     </div>
 //   )
 // }
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__44f38c52._.js.map