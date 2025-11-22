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
"[project]/lib/fakeBackend.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/fakeBackend.js
// باك إند وهمي بسيط باستخدام localStorage
// يربط: المبيعات + المخزون + الشِفت
__turbopack_context__.s([
    "addSale",
    ()=>addSale,
    "addShiftEventFromInvoice",
    ()=>addShiftEventFromInvoice,
    "applySaleToInventory",
    ()=>applySaleToInventory,
    "closeShift",
    ()=>closeShift,
    "getInventory",
    ()=>getInventory,
    "getSales",
    ()=>getSales,
    "getShiftEventsByCashier",
    ()=>getShiftEventsByCashier,
    "openShift",
    ()=>openShift,
    "saveInventory",
    ()=>saveInventory,
    "saveSales",
    ()=>saveSales,
    "seedInventory",
    ()=>seedInventory
]);
const KEYS = {
    INVENTORY: 'pharmacy_inventory',
    SALES: 'pharmacy_sales',
    SHIFTS: 'pharmacy_shifts'
};
function isBrowser() {
    return ("TURBOPACK compile-time value", "undefined") !== 'undefined' && !!window.localStorage;
}
function read(key, fallback) {
    if (!isBrowser()) return fallback;
    //TURBOPACK unreachable
    ;
}
function write(key, value) {
    if (!isBrowser()) return;
    //TURBOPACK unreachable
    ;
}
function seedInventory(initialProducts = []) {
    if (!isBrowser()) return;
    //TURBOPACK unreachable
    ;
    const existing = undefined;
}
function getInventory() {
    return read(KEYS.INVENTORY, []);
}
function saveInventory(products) {
    write(KEYS.INVENTORY, products || []);
}
function applySaleToInventory(invoice) {
    const items = invoice.items || [];
    if (!items.length) return;
    const inventory = getInventory();
    let changed = false;
    const updated = inventory.map((p)=>{
        const match = items.find((it)=>it.productId === p.id || it.id === p.id || it.barcode && it.barcode === p.barcode);
        if (!match) return p;
        const factor = invoice.type === 'return' ? 1 : -1;
        const newQty = Number(p.qty || 0) + factor * Number(match.qty || 0);
        changed = true;
        return {
            ...p,
            qty: newQty < 0 ? 0 : newQty
        };
    });
    if (changed) {
        saveInventory(updated);
    }
}
function getSales() {
    return read(KEYS.SALES, []);
}
function saveSales(sales) {
    write(KEYS.SALES, sales || []);
}
function addSale(invoice) {
    const sales = getSales();
    const normalized = {
        id: invoice.id,
        date: invoice.date || new Date().toISOString(),
        customer: invoice.customer || 'عميل نقدي',
        cashier: invoice.cashier || 'غير محدد',
        payment: invoice.payment || 'cash',
        type: invoice.type || 'sale',
        items: invoice.items || [],
        discount: Number(invoice.discount || 0),
        tax: Number(invoice.tax || 0),
        total: Number(invoice.total || 0)
    };
    sales.push(normalized);
    saveSales(sales);
    addShiftEventFromInvoice(normalized);
    return normalized;
}
// --------- الشِفت / سجل العمليات ---------
function getShiftEvents() {
    return read(KEYS.SHIFTS, []);
}
function saveShiftEvents(events) {
    write(KEYS.SHIFTS, events || []);
}
function addShiftEventFromInvoice(invoice) {
    const events = getShiftEvents();
    events.push({
        id: `sale-${invoice.id}`,
        type: invoice.type === 'return' ? 'return' : 'sale',
        cashier: invoice.cashier || 'غير محدد',
        date: invoice.date || new Date().toISOString(),
        total: Number(invoice.total || 0)
    });
    saveShiftEvents(events);
}
function openShift(cashierName) {
    const events = getShiftEvents();
    const now = new Date().toISOString();
    events.push({
        id: `open-${cashierName}-${now}`,
        type: 'shift_open',
        cashier: cashierName,
        date: now
    });
    saveShiftEvents(events);
}
function closeShift(cashierName) {
    const events = getShiftEvents();
    const now = new Date().toISOString();
    events.push({
        id: `close-${cashierName}-${now}`,
        type: 'shift_close',
        cashier: cashierName,
        date: now
    });
    saveShiftEvents(events);
}
function getShiftEventsByCashier(cashierName) {
    const events = getShiftEvents();
    if (!cashierName) return events;
    return events.filter((e)=>e.cashier === cashierName);
}
}),
"[project]/pages/sales.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/sales.js
__turbopack_context__.s([
    "default",
    ()=>Sales
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Layout.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Modal.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/react-hot-toast [external] (react-hot-toast, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fakeBackend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/fakeBackend.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
// ======= تنسيق التاريخ الآمن لمنع أخطاء الهيدرشن =======
function SafeDate({ value }) {
    const [formatted, setFormatted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        try {
            const d = new Date(value);
            const f = d.toLocaleString("ar-EG", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
            setFormatted(f);
        } catch  {
            setFormatted(value || "");
        }
    }, [
        value
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
        children: formatted
    }, void 0, false, {
        fileName: "[project]/pages/sales.js",
        lineNumber: 33,
        columnNumber: 10
    }, this);
}
function Sales() {
    const [user] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: "أحمد",
        role: "admin"
    });
    const [sales, setSales] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [cashier, setCashier] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("all");
    const [payment, setPayment] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("all");
    const [saleType, setSaleType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("all"); // بيع / مرتجع / كلهم
    const [dateFrom, setDateFrom] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [dateTo, setDateTo] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [viewInvoice, setViewInvoice] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // تحميل المبيعات من الباك اند الوهمي
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fakeBackend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getSales"])() || [];
        setSales(data);
    }, []);
    const formatCurrency = (v)=>`${Number(v || 0).toLocaleString("ar-SA")} ر.س`;
    // فلترة البيانات
    const filtered = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const q = search.toLowerCase().trim();
        return (sales || []).filter((s)=>{
            const matchSearch = !q || s.id.toString().includes(q) || (s.customer || "").toLowerCase().includes(q);
            const matchCashier = cashier === "all" || s.cashier === cashier;
            const matchPayment = payment === "all" || s.payment === payment;
            const matchType = saleType === "all" || s.type === saleType;
            const matchFrom = !dateFrom || s.date.slice(0, 10) >= dateFrom;
            const matchTo = !dateTo || s.date.slice(0, 10) <= dateTo;
            return matchSearch && matchCashier && matchPayment && matchType && matchFrom && matchTo;
        });
    }, [
        sales,
        search,
        cashier,
        payment,
        saleType,
        dateFrom,
        dateTo
    ]);
    // الإحصائيات
    const totals = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const totalValue = filtered.reduce((sum, s)=>sum + Number(s.total), 0);
        const count = filtered.length;
        const avg = count ? totalValue / count : 0;
        return {
            totalValue,
            count,
            avg
        };
    }, [
        filtered
    ]);
    // عرض الفاتورة
    const handleViewInvoice = (id)=>{
        const inv = sales.find((x)=>x.id === id);
        if (!inv) return __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["default"].error("الفاتورة غير موجودة");
        setViewInvoice(inv);
    };
    // الطباعة
    const handlePrintInvoice = (invoice)=>{
        const html = `
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <title>فاتورة ${invoice.id}</title>
        <style>
          body { font-family: 'Tajawal', sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: center; }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h2>صيدلية المعلم — فاتورة ${invoice.id}</h2>
        <p>العميل: ${invoice.customer}</p>
        <p>الكاشير: ${invoice.cashier}</p>
        <p>التاريخ: ${new Date(invoice.date).toLocaleString("ar-EG")}</p>

        <table>
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((it)=>`<tr>
                      <td>${it.name}</td>
                      <td>${it.qty}</td>
                      <td>${it.price}</td>
                      <td>${it.qty * it.price}</td>
                    </tr>`).join("") || ""}
          </tbody>
        </table>

        <h3>الإجمالي النهائي: ${invoice.total} ر.س</h3>

        <script>
          window.onload = () => {
            window.print();
            setTimeout(() => window.close(), 500);
          };
        </script>
      </body>
      </html>
    `;
        const w = window.open("", "_blank", "width=900,height=900");
        w.document.write(html);
        w.document.close();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        user: user,
        title: "المبيعات",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                dir: "rtl",
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-white border rounded-lg shadow-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-3 md:grid-cols-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "بحث برقم الفاتورة أو اسم العميل",
                                    value: search,
                                    onChange: (e)=>setSearch(e.target.value),
                                    className: "px-3 py-2 text-sm border rounded-md"
                                }, void 0, false, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 179,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                    value: cashier,
                                    onChange: (e)=>setCashier(e.target.value),
                                    className: "px-3 py-2 text-sm border rounded-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "all",
                                            children: "كل الكاشير"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/sales.js",
                                            lineNumber: 192,
                                            columnNumber: 15
                                        }, this),
                                        Array.from(new Set(sales.map((s)=>s.cashier))).map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: c,
                                                children: c
                                            }, c, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 194,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                    value: payment,
                                    onChange: (e)=>setPayment(e.target.value),
                                    className: "px-3 py-2 text-sm border rounded-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "all",
                                            children: "كل طرق الدفع"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/sales.js",
                                            lineNumber: 205,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "cash",
                                            children: "نقدًا"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/sales.js",
                                            lineNumber: 206,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "card",
                                            children: "بطاقة"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/sales.js",
                                            lineNumber: 207,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "wallet",
                                            children: "محفظة"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/sales.js",
                                            lineNumber: 208,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                    value: saleType,
                                    onChange: (e)=>setSaleType(e.target.value),
                                    className: "px-3 py-2 text-sm border rounded-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "all",
                                            children: "الكل"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/sales.js",
                                            lineNumber: 216,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "sale",
                                            children: "فواتير بيع"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/sales.js",
                                            lineNumber: 217,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "return",
                                            children: "مرتجعات"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/sales.js",
                                            lineNumber: 218,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 211,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    value: dateFrom,
                                    onChange: (e)=>setDateFrom(e.target.value),
                                    className: "px-3 py-2 text-sm border rounded-md"
                                }, void 0, false, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 221,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    value: dateTo,
                                    onChange: (e)=>setDateTo(e.target.value),
                                    className: "px-3 py-2 text-sm border rounded-md"
                                }, void 0, false, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 227,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/sales.js",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/sales.js",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "p-4 overflow-x-auto bg-white border rounded-lg shadow-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            className: "w-full text-sm min-w-[880px] text-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    className: "text-gray-600 bg-gray-50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "p-2",
                                                children: "#"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 241,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "رقم الفاتورة"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 242,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "النوع"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 243,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "التاريخ"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 244,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "العميل"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 245,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "الكاشير"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 246,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "الدفع"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 247,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "الإجمالي"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 248,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "إجراءات"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 249,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/sales.js",
                                        lineNumber: 240,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    children: filtered.length ? filtered.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            className: "border-t hover:bg-gray-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "p-2",
                                                    children: i + 1
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 256,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "p-2 text-sky-700",
                                                    children: s.id
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 257,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "p-2",
                                                    children: s.type === "sale" ? "بيع" : "مرتجع"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 258,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "p-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SafeDate, {
                                                        value: s.date
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/sales.js",
                                                        lineNumber: 262,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 261,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "p-2",
                                                    children: s.customer
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 264,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "p-2",
                                                    children: s.cashier
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 265,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "p-2",
                                                    children: s.payment === "cash" ? "نقدًا" : s.payment === "card" ? "بطاقة" : "محفظة"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 266,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "p-2 font-semibold text-emerald-700",
                                                    children: formatCurrency(s.total)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 273,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "p-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleViewInvoice(s.id),
                                                                className: "px-2 py-1 text-xs text-indigo-700 border rounded bg-indigo-50 hover:bg-indigo-100",
                                                                children: "👁️ عرض"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/sales.js",
                                                                lineNumber: 278,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handlePrintInvoice(s),
                                                                className: "px-2 py-1 text-xs border rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                                                                children: "🖨️ طباعة"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/sales.js",
                                                                lineNumber: 284,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/sales.js",
                                                        lineNumber: 277,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 276,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, s.id, true, {
                                            fileName: "[project]/pages/sales.js",
                                            lineNumber: 255,
                                            columnNumber: 19
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            colSpan: "9",
                                            className: "p-6 text-center text-gray-500",
                                            children: "لا توجد بيانات مطابقة"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/sales.js",
                                            lineNumber: 296,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/sales.js",
                                        lineNumber: 295,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 252,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/sales.js",
                            lineNumber: 238,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/sales.js",
                        lineNumber: 237,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Summary, {
                                title: "إجمالي المبيعات",
                                value: formatCurrency(totals.totalValue),
                                color: "text-emerald-600"
                            }, void 0, false, {
                                fileName: "[project]/pages/sales.js",
                                lineNumber: 310,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Summary, {
                                title: "عدد الفواتير",
                                value: totals.count.toLocaleString("ar-SA"),
                                color: "text-sky-600"
                            }, void 0, false, {
                                fileName: "[project]/pages/sales.js",
                                lineNumber: 315,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Summary, {
                                title: "متوسط الفاتورة",
                                value: formatCurrency(totals.avg),
                                color: "text-amber-600"
                            }, void 0, false, {
                                fileName: "[project]/pages/sales.js",
                                lineNumber: 320,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/sales.js",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/sales.js",
                lineNumber: 174,
                columnNumber: 7
            }, this),
            viewInvoice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: `تفاصيل الفاتورة — ${viewInvoice.id}`,
                onClose: ()=>setViewInvoice(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "space-y-2 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                    children: "العميل:"
                                }, void 0, false, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 336,
                                    columnNumber: 15
                                }, this),
                                " ",
                                viewInvoice.customer
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/sales.js",
                            lineNumber: 335,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                    children: "الكاشير:"
                                }, void 0, false, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 339,
                                    columnNumber: 15
                                }, this),
                                " ",
                                viewInvoice.cashier
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/sales.js",
                            lineNumber: 338,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            className: "w-full mt-2 text-xs border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    className: "bg-gray-50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "#"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 345,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "الصنف"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 346,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "الكمية"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 347,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "السعر"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 348,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "الإجمالي"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/sales.js",
                                                lineNumber: 349,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/sales.js",
                                        lineNumber: 344,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 343,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    children: viewInvoice.items.map((it, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: i + 1
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 355,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: it.name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 356,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: it.qty
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 357,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: it.price
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 358,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: it.qty * it.price
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/sales.js",
                                                    lineNumber: 359,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/pages/sales.js",
                                            lineNumber: 354,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/pages/sales.js",
                                    lineNumber: 352,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/sales.js",
                            lineNumber: 342,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mt-3 font-semibold text-end text-emerald-700",
                            children: [
                                "الإجمالي النهائي:",
                                formatCurrency(viewInvoice.total)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/sales.js",
                            lineNumber: 365,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/sales.js",
                    lineNumber: 334,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/sales.js",
                lineNumber: 330,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/sales.js",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
// بطاقة ملخص صغيرة
function Summary({ title, value, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4 text-center bg-white border rounded-lg shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-500",
                children: title
            }, void 0, false, {
                fileName: "[project]/pages/sales.js",
                lineNumber: 380,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: `text-xl font-bold mt-1 ${color}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/pages/sales.js",
                lineNumber: 381,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/sales.js",
        lineNumber: 379,
        columnNumber: 5
    }, this);
} // // pages/sales.js
 // import { useMemo, useState } from "react";
 // import Layout from "../components/Layout";
 // import Modal from "../components/Modal";
 // import toast from "react-hot-toast";
 // import dynamic from "next/dynamic";
 // import { useInventory } from "../context/InventoryContext";
 // import { useShift } from "../context/ShiftContext";
 // // 🔥 SafeDate dynamic — يمنع Hydration mismatch نهائيًا
 // const SafeDate = dynamic(() => import("../components/SafeDate"), {
 //   ssr: false,
 // });
 // export default function Sales() {
 //   const [user] = useState({ name: "أحمد", role: "admin" });
 //   // المخزون
 //   const {
 //     products,
 //     decreaseStockOnSale,
 //     increaseStockOnReturn,
 //     getWarnings,
 //   } = useInventory();
 //   // الشفت
 //   const { activeShift, registerInvoice } = useShift();
 //   // بيانات افتراضية للمبيعات
 //   const [sales, setSales] = useState([
 //     {
 //       id: "INV-1001",
 //       date: new Date().toISOString(),
 //       customer: "عميل نقدي",
 //       cashier: "أحمد",
 //       payment: "cash",
 //       type: "sale",
 //       discount: 0,
 //       tax: 0,
 //       total: 120,
 //       items: [{ productId: 1, name: "باراسيتامول", qty: 2, price: 30 }],
 //     },
 //   ]);
 //   // فلاتر
 //   const [search, setSearch] = useState("");
 //   const [cashier, setCashier] = useState("all");
 //   const [payment, setPayment] = useState("all");
 //   const [dateFrom, setDateFrom] = useState("");
 //   const [dateTo, setDateTo] = useState("");
 //   const [viewInvoice, setViewInvoice] = useState(null);
 //   // مودال إضافة فاتورة
 //   const [showNewInvoice, setShowNewInvoice] = useState(false);
 //   const [invoiceType, setInvoiceType] = useState("sale");
 //   const [invoiceCustomer, setInvoiceCustomer] = useState("عميل نقدي");
 //   const [invoicePayment, setInvoicePayment] = useState("cash");
 //   const [invoiceDiscount, setInvoiceDiscount] = useState(0);
 //   const [invoiceTax, setInvoiceTax] = useState(0);
 //   const [invoiceItems, setInvoiceItems] = useState([]);
 //   const [selectedProductId, setSelectedProductId] = useState("");
 //   const [selectedQty, setSelectedQty] = useState(1);
 //   const formatCurrency = (v) =>
 //     `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;
 //   const computeTotals = (items, discount, tax) => {
 //     const subtotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);
 //     const disc = Number(discount || 0);
 //     const t = Number(tax || 0);
 //     return {
 //       subtotal,
 //       discount: disc,
 //       tax: t,
 //       total: subtotal - disc + t,
 //     };
 //   };
 //   const invoiceTotal = (inv) =>
 //     computeTotals(inv.items || [], inv.discount, inv.tax).total;
 //   const filtered = useMemo(() => {
 //     return sales.filter((s) => {
 //       const q = search.trim().toLowerCase();
 //       const matchesSearch =
 //         !q ||
 //         s.id.toLowerCase().includes(q) ||
 //         s.customer.toLowerCase().includes(q);
 //       const matchesCashier = cashier === "all" || s.cashier === cashier;
 //       const matchesPayment = payment === "all" || s.payment === payment;
 //       const dateStr = s.date?.slice(0, 10);
 //       const betweenFrom = !dateFrom || dateStr >= dateFrom;
 //       const betweenTo = !dateTo || dateStr <= dateTo;
 //       return (
 //         matchesSearch &&
 //         matchesCashier &&
 //         matchesPayment &&
 //         betweenFrom &&
 //         betweenTo
 //       );
 //     });
 //   }, [sales, search, cashier, payment, dateFrom, dateTo]);
 //   const totals = useMemo(() => {
 //     const totalValue = filtered.reduce(
 //       (sum, s) => sum + invoiceTotal(s),
 //       0
 //     );
 //     const count = filtered.length;
 //     return {
 //       totalValue,
 //       count,
 //       avg: count ? totalValue / count : 0,
 //     };
 //   }, [filtered]);
 //   const openNewInvoiceModal = () => {
 //     setShowNewInvoice(true);
 //     setInvoiceItems([]);
 //     setInvoiceCustomer("عميل نقدي");
 //     setInvoicePayment("cash");
 //     setInvoiceDiscount(0);
 //     setInvoiceTax(0);
 //     setInvoiceType("sale");
 //   };
 //   const handleAddItemToInvoice = () => {
 //     if (!selectedProductId) return toast.error("اختر منتج");
 //     const qty = Number(selectedQty || 0);
 //     if (qty <= 0) return toast.error("كمية غير صحيحة");
 //     const product = products.find(
 //       (p) => p.id === Number(selectedProductId)
 //     );
 //     if (!product) return;
 //     // منع بيع كمية أكبر من المتوفر
 //     if (invoiceType === "sale") {
 //       const existingQty =
 //         invoiceItems.find((i) => i.productId === product.id)?.qty || 0;
 //       if (existingQty + qty > product.quantity) {
 //         return toast.error("الكمية المطلوبة أكبر من المتوفر");
 //       }
 //     }
 //     setInvoiceItems((prev) => {
 //       const exists = prev.find((i) => i.productId === product.id);
 //       if (exists) {
 //         return prev.map((i) =>
 //           i.productId === product.id
 //             ? { ...i, qty: i.qty + qty }
 //             : i
 //         );
 //       }
 //       return [
 //         ...prev,
 //         {
 //           productId: product.id,
 //           name: product.name,
 //           qty,
 //           price: product.price,
 //         },
 //       ];
 //     });
 //   };
 //   const saveInvoice = () => {
 //     if (!activeShift) {
 //       return toast.error("❌ يجب فتح شِفت قبل إضافة الفواتير");
 //     }
 //     if (!invoiceItems.length) {
 //       return toast.error("أضف صنفًا واحدًا على الأقل");
 //     }
 //     const totals = computeTotals(
 //       invoiceItems,
 //       invoiceDiscount,
 //       invoiceTax
 //     );
 //     const id = `INV-${String(Date.now()).slice(-6)}`;
 //     const inv = {
 //       id,
 //       date: new Date().toISOString(),
 //       customer: invoiceCustomer,
 //       cashier: user.name,
 //       payment: invoicePayment,
 //       type: invoiceType,
 //       discount: Number(invoiceDiscount),
 //       tax: Number(invoiceTax),
 //       total: totals.total,
 //       items: invoiceItems,
 //     };
 //     // إضافة للواجهة
 //     setSales((prev) => [inv, ...prev]);
 //     // تحديث مخزون
 //     invoiceItems.forEach((it) => {
 //       if (invoiceType === "sale") decreaseStockOnSale(it.productId, it.qty);
 //       else increaseStockOnReturn(it.productId, it.qty);
 //     });
 //     // ربط بالشفت
 //     registerInvoice(inv);
 //     toast.success("✔️ تم حفظ الفاتورة");
 //     setShowNewInvoice(false);
 //   };
 //   const removeItem = (id) => {
 //     setInvoiceItems((prev) =>
 //       prev.filter((i) => i.productId !== id)
 //     );
 //   };
 //   const ActionButtons = ({ invoice }) => (
 //     <div className="flex gap-2">
 //       <button
 //         className="px-2 py-1 text-xs border rounded border-sky-300 text-sky-700"
 //         onClick={() => setViewInvoice(invoice)}
 //       >
 //         👁️ عرض
 //       </button>
 //       <button className="px-2 py-1 text-xs border rounded border-emerald-300 text-emerald-700">
 //         🖨️ طباعة
 //       </button>
 //     </div>
 //   );
 //   return (
 //     <Layout user={user} title="المبيعات">
 //       <div dir="rtl" className="space-y-6">
 //         {/* هيدر */}
 //         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
 //           <h1 className="text-xl font-bold text-gray-800">🧾 المبيعات</h1>
 //           <button
 //             onClick={openNewInvoiceModal}
 //             className="px-4 py-2 text-sm font-semibold text-white rounded bg-emerald-600 hover:bg-emerald-700"
 //           >
 //             ➕ إضافة فاتورة
 //           </button>
 //         </div>
 //         {/* فلاتر */}
 //         <div className="p-4 bg-white border rounded-lg shadow-sm">
 //           <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
 //             <input
 //               className="p-2 border rounded"
 //               placeholder="بحث..."
 //               value={search}
 //               onChange={(e) => setSearch(e.target.value)}
 //             />
 //             <select
 //               className="p-2 border rounded"
 //               value={cashier}
 //               onChange={(e) => setCashier(e.target.value)}
 //             >
 //               <option value="all">كل الكاشير</option>
 //               {[...new Set(sales.map((s) => s.cashier))].map((c) => (
 //                 <option key={c}>{c}</option>
 //               ))}
 //             </select>
 //             <select
 //               className="p-2 border rounded"
 //               value={payment}
 //               onChange={(e) => setPayment(e.target.value)}
 //             >
 //               <option value="all">كل طرق الدفع</option>
 //               <option value="cash">نقدًا</option>
 //               <option value="card">بطاقة</option>
 //               <option value="wallet">محفظة</option>
 //             </select>
 //             <input
 //               type="date"
 //               className="p-2 border rounded"
 //               value={dateFrom}
 //               onChange={(e) => setDateFrom(e.target.value)}
 //             />
 //             <input
 //               type="date"
 //               className="p-2 border rounded"
 //               value={dateTo}
 //               onChange={(e) => setDateTo(e.target.value)}
 //             />
 //           </div>
 //         </div>
 //         {/* جدول */}
 //         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-right text-sm min-w-[900px]">
 //             <thead className="bg-gray-100">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">رقم</th>
 //                 <th className="px-3 py-2">نوع</th>
 //                 <th className="px-3 py-2">التاريخ</th>
 //                 <th className="px-3 py-2">العميل</th>
 //                 <th className="px-3 py-2">الكاشير</th>
 //                 <th className="px-3 py-2">الدفع</th>
 //                 <th className="px-3 py-2">الإجمالي</th>
 //                 <th className="px-3 py-2">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filtered.map((s, i) => (
 //                 <tr key={s.id} className="border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2">{i + 1}</td>
 //                   <td className="px-3 py-2 text-sky-700">{s.id}</td>
 //                   <td className="px-3 py-2">{s.type === "sale" ? "بيع" : "مرتجع"}</td>
 //                   <td className="px-3 py-2">
 //                     <SafeDate value={s.date} />
 //                   </td>
 //                   <td className="px-3 py-2">{s.customer}</td>
 //                   <td className="px-3 py-2">{s.cashier}</td>
 //                   <td className="px-3 py-2">
 //                     {s.payment === "cash"
 //                       ? "نقدًا"
 //                       : s.payment === "card"
 //                       ? "بطاقة"
 //                       : "محفظة"}
 //                   </td>
 //                   <td className="px-3 py-2 font-semibold text-emerald-700">
 //                     {formatCurrency(invoiceTotal(s))}
 //                   </td>
 //                   <td className="px-3 py-2">
 //                     <ActionButtons invoice={s} />
 //                   </td>
 //                 </tr>
 //               ))}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* ملخص */}
 //         <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
 //           <SummaryBox
 //             title="إجمالي المبيعات"
 //             value={formatCurrency(totals.totalValue)}
 //             color="text-emerald-600"
 //           />
 //           <SummaryBox
 //             title="عدد الفواتير"
 //             value={totals.count}
 //             color="text-sky-600"
 //           />
 //           <SummaryBox
 //             title="متوسط الفاتورة"
 //             value={formatCurrency(totals.avg)}
 //             color="text-amber-600"
 //           />
 //         </div>
 //         {/* عرض فاتورة */}
 //         {viewInvoice && (
 //           <Modal
 //             title={`عرض الفاتورة ${viewInvoice.id}`}
 //             onClose={() => setViewInvoice(null)}
 //           >
 //             <div className="space-y-2 text-sm">
 //               <p><strong>العميل:</strong> {viewInvoice.customer}</p>
 //               <p><strong>الكاشير:</strong> {viewInvoice.cashier}</p>
 //             </div>
 //           </Modal>
 //         )}
 //         {/* مودال إضافة فاتورة */}
 //         {showNewInvoice && (
 //           <Modal
 //             title="➕ إضافة فاتورة جديدة"
 //             onClose={() => setShowNewInvoice(false)}
 //             onConfirm={saveInvoice}
 //             confirmLabel="حفظ الفاتورة"
 //           >
 //             <div className="space-y-4 text-sm">
 //               {/* بيانات */}
 //               <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
 //                 <input
 //                   className="p-2 border rounded"
 //                   value={invoiceCustomer}
 //                   onChange={(e) => setInvoiceCustomer(e.target.value)}
 //                 />
 //                 <select
 //                   className="p-2 border rounded"
 //                   value={invoicePayment}
 //                   onChange={(e) => setInvoicePayment(e.target.value)}
 //                 >
 //                   <option value="cash">نقدًا</option>
 //                   <option value="card">بطاقة</option>
 //                   <option value="wallet">محفظة</option>
 //                 </select>
 //                 <select
 //                   className="p-2 border rounded"
 //                   value={invoiceType}
 //                   onChange={(e) => setInvoiceType(e.target.value)}
 //                 >
 //                   <option value="sale">بيع</option>
 //                   <option value="return">مرتجع</option>
 //                 </select>
 //               </div>
 //               {/* اختيار صنف */}
 //               <div className="p-3 space-y-3 border rounded bg-gray-50">
 //                 <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
 //                   <select
 //                     className="p-2 border rounded"
 //                     value={selectedProductId}
 //                     onChange={(e) =>
 //                       setSelectedProductId(e.target.value)
 //                     }
 //                   >
 //                     <option value="">اختر صنفًا</option>
 //                     {products.map((p) => (
 //                       <option key={p.id} value={p.id}>
 //                         {p.name}
 //                       </option>
 //                     ))}
 //                   </select>
 //                   <input
 //                     type="number"
 //                     className="p-2 border rounded"
 //                     min={1}
 //                     value={selectedQty}
 //                     onChange={(e) => setSelectedQty(e.target.value)}
 //                   />
 //                   <button
 //                     onClick={handleAddItemToInvoice}
 //                     className="px-3 py-2 text-white rounded bg-emerald-600 hover:bg-emerald-700"
 //                   >
 //                     ➕ إضافة للسلة
 //                   </button>
 //                 </div>
 //               </div>
 //               {/* سلة */}
 //               <div className="overflow-x-auto border rounded">
 //                 <table className="w-full text-xs min-w-[500px]">
 //                   <thead className="bg-gray-100">
 //                     <tr>
 //                       <th>#</th>
 //                       <th>الصنف</th>
 //                       <th>كمية</th>
 //                       <th>سعر</th>
 //                       <th>إجمالي</th>
 //                       <th>إزالة</th>
 //                     </tr>
 //                   </thead>
 //                   <tbody>
 //                     {invoiceItems.length ? (
 //                       invoiceItems.map((it, i) => (
 //                         <tr key={it.productId} className="border-t">
 //                           <td>{i + 1}</td>
 //                           <td>{it.name}</td>
 //                           <td>{it.qty}</td>
 //                           <td>{formatCurrency(it.price)}</td>
 //                           <td>
 //                             {formatCurrency(it.price * it.qty)}
 //                           </td>
 //                           <td>
 //                             <button
 //                               onClick={() => removeItem(it.productId)}
 //                               className="px-2 py-1 text-red-600 border border-red-300 rounded"
 //                             >
 //                               ✕
 //                             </button>
 //                           </td>
 //                         </tr>
 //                       ))
 //                     ) : (
 //                       <tr>
 //                         <td colSpan="6" className="py-3 text-center">
 //                           لا توجد أصناف…
 //                         </td>
 //                       </tr>
 //                     )}
 //                   </tbody>
 //                 </table>
 //               </div>
 //               {/* إجمالي */}
 //               <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
 //                 <input
 //                   type="number"
 //                   className="p-2 border rounded"
 //                   placeholder="خصم"
 //                   value={invoiceDiscount}
 //                   onChange={(e) => setInvoiceDiscount(e.target.value)}
 //                 />
 //                 <input
 //                   type="number"
 //                   className="p-2 border rounded"
 //                   placeholder="ضريبة"
 //                   value={invoiceTax}
 //                   onChange={(e) => setInvoiceTax(e.target.value)}
 //                 />
 //                 <div className="p-2 text-right border rounded bg-gray-50">
 //                   {(() => {
 //                     const t = computeTotals(
 //                       invoiceItems,
 //                       invoiceDiscount,
 //                       invoiceTax
 //                     );
 //                     return (
 //                       <p>
 //                         <strong>الإجمالي:</strong>{" "}
 //                         {formatCurrency(t.total)}
 //                       </p>
 //                     );
 //                   })()}
 //                 </div>
 //               </div>
 //             </div>
 //           </Modal>
 //         )}
 //       </div>
 //     </Layout>
 //   );
 // }
 // function SummaryBox({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center bg-white border rounded">
 //       <p className="text-xs text-gray-500">{title}</p>
 //       <p className={`text-xl font-bold ${color}`}>{value}</p>
 //     </div>
 //   );
 // }
 // // pages/sales.js
 // import { useMemo, useState } from "react";
 // import Layout from "../components/Layout";
 // import Modal from "../components/Modal";
 // import toast from "react-hot-toast";
 // import { useInventory } from "../context/InventoryContext";
 // /* ===========================
 //    SafeDate Component
 //    يمنع Hydration mismatch نهائيًا
 // =========================== */
 // function SafeDate({ value }) {
 //   if (typeof window === "undefined") return "";
 //   try {
 //     return new Date(value).toLocaleString("ar-EG");
 //   } catch {
 //     return "";
 //   }
 // }
 // export default function Sales() {
 //   // مستخدم افتراضي (يمكن ربطها لاحقًا مع AuthContext)
 //   const [user] = useState({ name: "أحمد", role: "admin" });
 //   const {
 //     products,
 //     decreaseStockOnSale,
 //     increaseStockOnReturn,
 //     getWarnings,
 //   } = useInventory();
 //   const [sales, setSales] = useState([
 //     {
 //       id: "INV-1001",
 //       date: new Date().toISOString(),
 //       customer: "عميل نقدي",
 //       cashier: "أحمد",
 //       payment: "cash",
 //       type: "sale",
 //       discount: 0,
 //       tax: 0,
 //       total: 120,
 //       items: [
 //         { productId: 1, name: "باراسيتامول 500mg", qty: 2, price: 30 },
 //       ],
 //     },
 //   ]);
 //   // فلاتر
 //   const [search, setSearch] = useState("");
 //   const [cashier, setCashier] = useState("all");
 //   const [payment, setPayment] = useState("all");
 //   const [dateFrom, setDateFrom] = useState("");
 //   const [dateTo, setDateTo] = useState("");
 //   // عرض فاتورة
 //   const [viewInvoice, setViewInvoice] = useState(null);
 //   // مودال إضافة فاتورة
 //   const [showNewInvoice, setShowNewInvoice] = useState(false);
 //   const [invoiceType, setInvoiceType] = useState("sale");
 //   const [invoiceCustomer, setInvoiceCustomer] = useState("عميل نقدي");
 //   const [invoicePayment, setInvoicePayment] = useState("cash");
 //   const [invoiceDiscount, setInvoiceDiscount] = useState(0);
 //   const [invoiceTax, setInvoiceTax] = useState(0);
 //   const [invoiceItems, setInvoiceItems] = useState([]);
 //   // اختيار منتج داخل المودال
 //   const [selectedProductId, setSelectedProductId] = useState("");
 //   const [selectedQty, setSelectedQty] = useState(1);
 //   const formatCurrency = (v) =>
 //     `${Number(v || 0).toLocaleString("ar-SA")} ر.س`;
 //   const computeInvoiceTotals = (items, discount, tax) => {
 //     const subtotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);
 //     const disc = Number(discount || 0);
 //     const t = Number(tax || 0);
 //     const total = subtotal - disc + t;
 //     return { subtotal, discount: disc, tax: t, total };
 //   };
 //   const invoiceTotal = (inv) =>
 //     computeInvoiceTotals(inv.items || [], inv.discount, inv.tax).total;
 //   // فلترة المبيعات
 //   const filtered = useMemo(() => {
 //     return sales.filter((s) => {
 //       const q = search.trim().toLowerCase();
 //       const passSearch =
 //         !q ||
 //         s.id.toLowerCase().includes(q) ||
 //         (s.customer || "").toLowerCase().includes(q);
 //       const passCashier = cashier === "all" || s.cashier === cashier;
 //       const passPayment = payment === "all" || s.payment === payment;
 //       const dateStr = s.date?.slice(0, 10) || "";
 //       const passDateFrom = !dateFrom || dateStr >= dateFrom;
 //       const passDateTo = !dateTo || dateStr <= dateTo;
 //       return (
 //         passSearch &&
 //         passCashier &&
 //         passPayment &&
 //         passDateFrom &&
 //         passDateTo
 //       );
 //     });
 //   }, [sales, search, cashier, payment, dateFrom, dateTo]);
 //   const totals = useMemo(() => {
 //     const totalValue = filtered.reduce(
 //       (sum, s) => sum + Number(invoiceTotal(s)),
 //       0
 //     );
 //     const count = filtered.length;
 //     const avg = count ? totalValue / count : 0;
 //     return { totalValue, count, avg };
 //   }, [filtered]);
 //   const handleViewInvoice = (id) => {
 //     const inv = sales.find((s) => s.id === id);
 //     if (!inv) return;
 //     setViewInvoice(inv);
 //   };
 //   // 🖨️ طباعة الفاتورة
 //   const handlePrintInvoice = (invoice) => {
 //     const items = invoice.items || [];
 //     const totals = computeInvoiceTotals(
 //       items,
 //       invoice.discount,
 //       invoice.tax
 //     );
 //     const html = `
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <meta charset="utf-8" />
 //           <title>فاتورة ${invoice.id}</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; padding: 20px; }
 //             h2 { color:#0ea5e9; margin-bottom: 10px; text-align:center; }
 //             table { width:100%; border-collapse: collapse; margin-top:10px; }
 //             th, td { border:1px solid #ddd; padding:6px; text-align:center; font-size:13px; }
 //             th { background:#f3f4f6; }
 //             tfoot td { font-weight:bold; color:#0ea5e9; }
 //             .meta { margin-bottom:10px; font-size:13px; }
 //           </style>
 //         </head>
 //         <body>
 //           <h2>صيدلية المعلم</h2>
 //           <div class="meta">
 //             <p>فاتورة رقم <strong>${invoice.id}</strong></p>
 //             <p>النوع: ${invoice.type === "sale" ? "بيع" : "مرتجع"}</p>
 //             <p>العميل: ${invoice.customer || "عميل نقدي"}</p>
 //             <p>الكاشير: ${invoice.cashier || "—"}</p>
 //             <p>التاريخ: ${new Date(invoice.date).toLocaleString("ar-EG")}</p>
 //             <p>طريقة الدفع: ${
 //               invoice.payment === "cash"
 //                 ? "نقدًا"
 //                 : invoice.payment === "card"
 //                 ? "بطاقة"
 //                 : "محفظة"
 //             }</p>
 //           </div>
 //           <table>
 //             <thead>
 //               <tr>
 //                 <th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               ${
 //                 items.length
 //                   ? items
 //                       .map(
 //                         (it) =>
 //                           `<tr>
 //                             <td>${it.name}</td>
 //                             <td>${it.qty}</td>
 //                             <td>${formatCurrency(it.price)}</td>
 //                             <td>${formatCurrency(it.qty * it.price)}</td>
 //                           </tr>`
 //                       )
 //                       .join("")
 //                   : `<tr><td colspan="4">لا توجد أصناف في هذه الفاتورة</td></tr>`
 //               }
 //             </tbody>
 //             <tfoot>
 //               <tr><td colspan="3">الإجمالي قبل الخصم</td><td>${formatCurrency(
 //                 totals.subtotal
 //               )}</td></tr>
 //               <tr><td colspan="3">الخصم</td><td>${formatCurrency(
 //                 totals.discount
 //               )}</td></tr>
 //               <tr><td colspan="3">الضريبة</td><td>${formatCurrency(
 //                 totals.tax
 //               )}</td></tr>
 //               <tr><td colspan="3">الإجمالي النهائي</td><td>${formatCurrency(
 //                 totals.total
 //               )}</td></tr>
 //             </tfoot>
 //           </table>
 //           <script>
 //             window.onload = () => {
 //               setTimeout(() => {
 //                 window.print();
 //                 setTimeout(() => window.close(), 800);
 //               }, 300);
 //             };
 //           </script>
 //         </body>
 //       </html>
 //     `;
 //     const w = window.open("", "_blank", "width=900,height=900");
 //     w.document.write(html);
 //     w.document.close();
 //   };
 //   // إجراءات الجدول
 //   const ActionButtons = ({ invoice }) => (
 //     <div className="flex flex-wrap justify-center gap-2">
 //       <button
 //         onClick={() => handleViewInvoice(invoice.id)}
 //         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-sky-200 text-sky-700 hover:bg-sky-50"
 //       >
 //         👁️ عرض
 //       </button>
 //       <button
 //         onClick={() => handlePrintInvoice(invoice)}
 //         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
 //       >
 //         🖨️ طباعة
 //       </button>
 //     </div>
 //   );
 //   /* ===========================
 //       Add Item to invoice
 //   ============================ */
 //   const handleAddItemToInvoice = () => {
 //     if (!selectedProductId) {
 //       toast.error("اختر صنفًا أولًا");
 //       return;
 //     }
 //     const qty = Number(selectedQty || 0);
 //     if (qty <= 0) {
 //       toast.error("الكمية يجب أن تكون أكبر من صفر");
 //       return;
 //     }
 //     const product = products.find(
 //       (p) => p.id === Number(selectedProductId)
 //     );
 //     if (!product) {
 //       toast.error("لم يتم العثور على المنتج المحدد");
 //       return;
 //     }
 //     if (invoiceType === "sale") {
 //       const existingQty =
 //         invoiceItems.find((it) => it.productId === product.id)?.qty ||
 //         0;
 //       if (qty + existingQty > product.quantity) {
 //         toast.error("الكمية المطلوبة أكبر من المتوفر");
 //         return;
 //       }
 //     }
 //     setInvoiceItems((prev) => {
 //       const exists = prev.find((it) => it.productId === product.id);
 //       if (exists) {
 //         return prev.map((it) =>
 //           it.productId === product.id
 //             ? { ...it, qty: it.qty + qty }
 //             : it
 //         );
 //       }
 //       return [
 //         ...prev,
 //         {
 //           productId: product.id,
 //           name: product.name,
 //           price: product.price,
 //           qty,
 //         },
 //       ];
 //     });
 //     setSelectedQty(1);
 //   };
 //   const handleRemoveItemFromInvoice = (productId) => {
 //     setInvoiceItems((prev) =>
 //       prev.filter((it) => it.productId !== productId)
 //     );
 //   };
 //   const handleOpenNewInvoice = () => {
 //     setShowNewInvoice(true);
 //     setInvoiceType("sale");
 //     setInvoiceCustomer("عميل نقدي");
 //     setInvoicePayment("cash");
 //     setInvoiceDiscount(0);
 //     setInvoiceTax(0);
 //     setInvoiceItems([]);
 //     setSelectedProductId("");
 //     setSelectedQty(1);
 //   };
 //   const handleSaveInvoice = () => {
 //     if (!invoiceItems.length) {
 //       toast.error("أضف صنفًا واحدًا على الأقل");
 //       return;
 //     }
 //     const totals = computeInvoiceTotals(
 //       invoiceItems,
 //       invoiceDiscount,
 //       invoiceTax
 //     );
 //     const id = `INV-${String(Date.now()).slice(-6)}`;
 //     const newInvoice = {
 //       id,
 //       date: new Date().toISOString(),
 //       customer: invoiceCustomer || "عميل نقدي",
 //       cashier: user.name,
 //       payment: invoicePayment,
 //       type: invoiceType,
 //       discount: Number(invoiceDiscount || 0),
 //       tax: Number(invoiceTax || 0),
 //       total: totals.total,
 //       items: invoiceItems,
 //     };
 //     setSales((prev) => [newInvoice, ...prev]);
 //     invoiceItems.forEach((it) => {
 //       if (invoiceType === "sale") {
 //         decreaseStockOnSale?.(it.productId, it.qty);
 //       } else {
 //         increaseStockOnReturn?.(it.productId, it.qty);
 //       }
 //     });
 //     toast.success("تم حفظ الفاتورة وتحديث المخزون");
 //     setShowNewInvoice(false);
 //   };
 //   const cashiersList = Array.from(
 //     new Set(sales.map((s) => s.cashier).filter(Boolean))
 //   );
 //   const selectedProduct = products.find(
 //     (p) => p.id === Number(selectedProductId)
 //   );
 //   const selectedWarnings = selectedProduct
 //     ? getWarnings(selectedProduct)
 //     : [];
 //   /* ===========================
 //         RETURN UI
 //   ============================ */
 //   return (
 //     <Layout user={user} title="المبيعات">
 //       <div dir="rtl" className="space-y-6">
 //         {/* الهيدر + زر إضافة فاتورة */}
 //         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
 //           <h1 className="text-xl font-bold text-gray-800">🧾 إدارة المبيعات</h1>
 //           <button
 //             onClick={handleOpenNewInvoice}
 //             className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
 //           >
 //             ➕ إضافة فاتورة جديدة
 //           </button>
 //         </div>
 //         {/* الفلاتر */}
 //         <div className="p-4 bg-white border rounded-lg shadow-sm">
 //           <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
 //             <input
 //               type="text"
 //               placeholder="ابحث برقم الفاتورة / العميل"
 //               value={search}
 //               onChange={(e) => setSearch(e.target.value)}
 //               className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
 //             />
 //             <select
 //               value={cashier}
 //               onChange={(e) => setCashier(e.target.value)}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             >
 //               <option value="all">كل الكاشير</option>
 //               {cashiersList.map((c) => (
 //                 <option key={c} value={c}>
 //                   {c}
 //                 </option>
 //               ))}
 //             </select>
 //             <select
 //               value={payment}
 //               onChange={(e) => setPayment(e.target.value)}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             >
 //               <option value="all">كل طرق الدفع</option>
 //               <option value="cash">نقدًا</option>
 //               <option value="card">بطاقة</option>
 //               <option value="wallet">محفظة</option>
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
 //         {/* جدول */}
 //         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right min-w-[880px]">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">رقم الفاتورة</th>
 //                 <th className="px-3 py-2">النوع</th>
 //                 <th className="px-3 py-2">التاريخ</th>
 //                 <th className="px-3 py-2">العميل</th>
 //                 <th className="px-3 py-2">الكاشير</th>
 //                 <th className="px-3 py-2">الدفع</th>
 //                 <th className="px-3 py-2">الإجمالي</th>
 //                 <th className="px-3 py-2">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filtered.length ? (
 //                 filtered.map((s, i) => (
 //                   <tr key={s.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{i + 1}</td>
 //                     <td className="px-3 py-2 font-medium text-sky-700">
 //                       {s.id}
 //                     </td>
 //                     <td className="px-3 py-2">
 //                       {s.type === "sale" ? "بيع" : "مرتجع"}
 //                     </td>
 //                     <td className="px-3 py-2">
 //                       <SafeDate value={s.date} />
 //                     </td>
 //                     <td className="px-3 py-2">{s.customer}</td>
 //                     <td className="px-3 py-2">{s.cashier}</td>
 //                     <td className="px-3 py-2">
 //                       {s.payment === "cash"
 //                         ? "نقدًا"
 //                         : s.payment === "card"
 //                         ? "بطاقة"
 //                         : "محفظة"}
 //                     </td>
 //                     <td className="px-3 py-2 font-semibold text-emerald-700">
 //                       {formatCurrency(invoiceTotal(s))}
 //                     </td>
 //                     <td className="px-3 py-2">
 //                       <ActionButtons invoice={s} />
 //                     </td>
 //                   </tr>
 //                 ))
 //               ) : (
 //                 <tr>
 //                   <td
 //                     colSpan="9"
 //                     className="py-6 text-center text-gray-500"
 //                   >
 //                     لا توجد نتائج
 //                   </td>
 //                 </tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* ملخص */}
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
 //           <Summary
 //             title="إجمالي المبيعات"
 //             value={formatCurrency(totals.totalValue)}
 //             color="text-emerald-600"
 //           />
 //           <Summary
 //             title="عدد الفواتير"
 //             value={totals.count.toLocaleString("ar-SA")}
 //             color="text-sky-600"
 //           />
 //           <Summary
 //             title="متوسط الفاتورة"
 //             value={formatCurrency(totals.avg.toFixed(2))}
 //             color="text-amber-600"
 //           />
 //         </div>
 //       </div>
 //       {/* Modal عرض الفاتورة */}
 //       {viewInvoice && (
 //         <Modal
 //           title={`تفاصيل الفاتورة — ${viewInvoice.id}`}
 //           onClose={() => setViewInvoice(null)}
 //         >
 //           <div className="space-y-2 text-sm" dir="rtl">
 //             <p>
 //               <strong>النوع:</strong>{" "}
 //               {viewInvoice.type === "sale" ? "بيع" : "مرتجع"}
 //             </p>
 //             <p>
 //               <strong>العميل:</strong> {viewInvoice.customer}
 //             </p>
 //             <p>
 //               <strong>الكاشير:</strong> {viewInvoice.cashier}
 //             </p>
 //             <p>
 //               <strong>طريقة الدفع:</strong>{" "}
 //               {viewInvoice.payment === "cash"
 //                 ? "نقدًا"
 //                 : viewInvoice.payment === "card"
 //                 ? "بطاقة"
 //                 : "محفظة"}
 //             </p>
 //             <table className="w-full mt-2 text-xs border">
 //               <thead className="bg-gray-50">
 //                 <tr>
 //                   <th>#</th>
 //                   <th>الصنف</th>
 //                   <th>الكمية</th>
 //                   <th>السعر</th>
 //                   <th>الإجمالي</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {viewInvoice.items?.map((it, i) => (
 //                   <tr key={i}>
 //                     <td>{i + 1}</td>
 //                     <td>{it.name}</td>
 //                     <td>{it.qty}</td>
 //                     <td>{formatCurrency(it.price)}</td>
 //                     <td>{formatCurrency(it.qty * it.price)}</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //             <div className="mt-2 font-semibold text-right text-emerald-700">
 //               الإجمالي النهائي:{" "}
 //               {formatCurrency(invoiceTotal(viewInvoice))}
 //             </div>
 //           </div>
 //         </Modal>
 //       )}
 //       {/* Modal إضافة فاتورة جديدة */}
 //       {showNewInvoice && (
 //         <Modal
 //           title="➕ إضافة فاتورة جديدة"
 //           onClose={() => setShowNewInvoice(false)}
 //           onConfirm={handleSaveInvoice}
 //           confirmLabel="حفظ الفاتورة"
 //         >
 //           <div className="space-y-4 text-sm" dir="rtl">
 //             {/* بيانات أساسية */}
 //             <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
 //               <input
 //                 type="text"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="اسم العميل"
 //                 value={invoiceCustomer}
 //                 onChange={(e) => setInvoiceCustomer(e.target.value)}
 //               />
 //               <select
 //                 className="w-full p-2 border rounded"
 //                 value={invoicePayment}
 //                 onChange={(e) => setInvoicePayment(e.target.value)}
 //               >
 //                 <option value="cash">نقدًا</option>
 //                 <option value="card">بطاقة</option>
 //                 <option value="wallet">محفظة</option>
 //               </select>
 //               <select
 //                 className="w-full p-2 border rounded"
 //                 value={invoiceType}
 //                 onChange={(e) => setInvoiceType(e.target.value)}
 //               >
 //                 <option value="sale">بيع</option>
 //                 <option value="return">مرتجع</option>
 //               </select>
 //             </div>
 //             {/* اختيار صنف */}
 //             <div className="p-3 space-y-3 border rounded-lg bg-gray-50">
 //               <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
 //                 <select
 //                   className="w-full p-2 border rounded"
 //                   value={selectedProductId}
 //                   onChange={(e) =>
 //                     setSelectedProductId(e.target.value)
 //                   }
 //                 >
 //                   <option value="">اختر صنفًا…</option>
 //                   {products.map((p) => (
 //                     <option key={p.id} value={p.id}>
 //                       {p.name}
 //                     </option>
 //                   ))}
 //                 </select>
 //                 <input
 //                   type="number"
 //                   className="w-full p-2 border rounded"
 //                   min={1}
 //                   value={selectedQty}
 //                   onChange={(e) => setSelectedQty(e.target.value)}
 //                   placeholder="الكمية"
 //                 />
 //                 <button
 //                   onClick={handleAddItemToInvoice}
 //                   className="w-full px-3 py-2 text-sm font-semibold text-white rounded bg-emerald-600 hover:bg-emerald-700"
 //                 >
 //                   ➕ إضافة للسلة
 //                 </button>
 //               </div>
 //               {/* معلومات وتحذيرات المنتج */}
 //               {selectedProduct && (
 //                 <div className="space-y-1 text-xs">
 //                   <p>
 //                     <strong>السعر:</strong>{" "}
 //                     {formatCurrency(selectedProduct.price)}
 //                   </p>
 //                   <p>
 //                     <strong>المخزون المتوفر:</strong>{" "}
 //                     {selectedProduct.quantity}
 //                   </p>
 //                   {selectedWarnings.length ? (
 //                     <ul className="pr-4 mt-1 text-red-600 list-disc">
 //                       {selectedWarnings.map((w, i) => (
 //                         <li key={i}>{w}</li>
 //                       ))}
 //                     </ul>
 //                   ) : (
 //                     <p className="mt-1 text-green-700">
 //                       لا توجد تحذيرات على هذا الصنف.
 //                     </p>
 //                   )}
 //                 </div>
 //               )}
 //             </div>
 //             {/* سلة الأصناف */}
 //             <div className="overflow-x-auto border rounded-lg">
 //               <table className="w-full text-xs text-right min-w-[500px]">
 //                 <thead className="bg-gray-100">
 //                   <tr>
 //                     <th className="px-2 py-1">#</th>
 //                     <th className="px-2 py-1">الصنف</th>
 //                     <th className="px-2 py-1">الكمية</th>
 //                     <th className="px-2 py-1">السعر</th>
 //                     <th className="px-2 py-1">الإجمالي</th>
 //                     <th className="px-2 py-1">إزالة</th>
 //                   </tr>
 //                 </thead>
 //                 <tbody>
 //                   {invoiceItems.length ? (
 //                     invoiceItems.map((it, i) => (
 //                       <tr key={it.productId} className="border-t">
 //                         <td className="px-2 py-1">{i + 1}</td>
 //                         <td className="px-2 py-1">{it.name}</td>
 //                         <td className="px-2 py-1">{it.qty}</td>
 //                         <td className="px-2 py-1">
 //                           {formatCurrency(it.price)}
 //                         </td>
 //                         <td className="px-2 py-1">
 //                           {formatCurrency(it.price * it.qty)}
 //                         </td>
 //                         <td className="px-2 py-1 text-center">
 //                           <button
 //                             onClick={() =>
 //                               handleRemoveItemFromInvoice(it.productId)
 //                             }
 //                             className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50"
 //                           >
 //                             ✕
 //                           </button>
 //                         </td>
 //                       </tr>
 //                     ))
 //                   ) : (
 //                     <tr>
 //                       <td
 //                         colSpan="6"
 //                         className="px-2 py-3 text-center text-gray-400"
 //                       >
 //                         لم تتم إضافة أي أصناف بعد…
 //                       </td>
 //                     </tr>
 //                   )}
 //                 </tbody>
 //               </table>
 //             </div>
 //             {/* الخصم + الضريبة + الإجمالي */}
 //             <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="الخصم"
 //                 value={invoiceDiscount}
 //                 onChange={(e) => setInvoiceDiscount(e.target.value)}
 //               />
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="الضريبة"
 //                 value={invoiceTax}
 //                 onChange={(e) => setInvoiceTax(e.target.value)}
 //               />
 //               <div className="p-2 text-sm text-right border rounded bg-gray-50">
 //                 {(() => {
 //                   const totals = computeInvoiceTotals(
 //                     invoiceItems,
 //                     invoiceDiscount,
 //                     invoiceTax
 //                   );
 //                   return (
 //                     <>
 //                       <p>
 //                         <strong>الإجمالي:</strong>{" "}
 //                         {formatCurrency(totals.total)}
 //                       </p>
 //                     </>
 //                   );
 //                 })()}
 //               </div>
 //             </div>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   );
 // }
 // /* ===========================
 //   Summary Box
 // =========================== */
 // function Summary({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
 //       <p className="text-xs text-gray-500">{title}</p>
 //       <p className={`mt-1 text-xl sm:text-2xl font-bold ${color}`}>
 //         {value}
 //       </p>
 //     </div>
 //   );
 // }
 // // pages/sales.js
 // import { useState } from "react";
 // import Layout from "../components/Layout";
 // import toast from "react-hot-toast";
 // import { useInventory } from "../context/InventoryContext";
 // import { useShift } from "../context/ShiftContext";
 // import { useAuth } from "../context/AuthContext";
 // export default function SalesPage() {
 //   const { user, hasPermission } = useAuth();
 //   const {
 //     products,
 //     getProduct,
 //     getWarnings,
 //     decreaseStockOnSale,
 //     increaseStockOnReturn,
 //   } = useInventory();
 //   const { addSaleOperation, addReturnOperation } = useShift();
 //   const [selectedId, setSelectedId] = useState("");
 //   const [qty, setQty] = useState("");
 //   const [cart, setCart] = useState([]);
 //   const [returnId, setReturnId] = useState("");
 //   const [returnQty, setReturnQty] = useState("");
 //   if (!hasPermission(["admin", "cashier"])) {
 //     return (
 //       <div dir="rtl" className="p-6 text-center text-red-600">
 //         ⚠️ ليس لديك صلاحية لدخول شاشة المبيعات.
 //       </div>
 //     );
 //   }
 //   const handleAddToCart = () => {
 //     const id = Number(selectedId);
 //     const q = Number(qty);
 //     if (!id || !q || q <= 0) {
 //       toast.error("الرجاء اختيار المنتج وإدخال كمية صحيحة");
 //       return;
 //     }
 //     const product = getProduct(id);
 //     if (!product) {
 //       toast.error("المنتج غير موجود");
 //       return;
 //     }
 //     if (q > product.quantity) {
 //       toast.error("الكمية المطلوبة أكبر من الكمية المتوفرة في المخزون");
 //       return;
 //     }
 //     const warnings = getWarnings(product);
 //     if (warnings.length) {
 //       const ok = confirm(
 //         `تحذيرات:\n${warnings.join(
 //           "\n"
 //         )}\n\nهل تريد المتابعة في عملية البيع؟`
 //       );
 //       if (!ok) return;
 //     }
 //     decreaseStockOnSale(id, q);
 //     addSaleOperation(product.name, q, product.price);
 //     setCart((prev) => [
 //       ...prev,
 //       {
 //         id: Date.now(),
 //         name: product.name,
 //         qty: q,
 //         price: product.price,
 //         total: product.price * q,
 //       },
 //     ]);
 //     setQty("");
 //     toast.success("تمت إضافة الصنف إلى الفاتورة وخصم الكمية من المخزون");
 //   };
 //   const invoiceTotal = cart.reduce((s, i) => s + i.total, 0);
 //   const printInvoice = () => {
 //     if (!cart.length) {
 //       toast.error("لا توجد أصناف في الفاتورة للطباعة");
 //       return;
 //     }
 //     const w = window.open("", "", "width=400,height=600");
 //     w.document.write(`
 //       <html dir="rtl" lang="ar">
 //       <head>
 //         <title>فاتورة بيع</title>
 //         <style>
 //           body { font-family:'Tajawal',sans-serif; padding:20px; }
 //           h2 { text-align:center; margin-bottom:10px; }
 //           table { width:100%; border-collapse:collapse; font-size:12px; }
 //           th, td { border-bottom:1px solid #ddd; padding:5px; text-align:right; }
 //           th { background:#f5f5f5; }
 //         </style>
 //       </head>
 //       <body>
 //         <h2>فاتورة بيع</h2>
 //         <p>الكاشير: ${user?.name || ""}</p>
 //         <table>
 //           <thead>
 //             <tr>
 //               <th>الصنف</th>
 //               <th>الكمية</th>
 //               <th>السعر</th>
 //               <th>الإجمالي</th>
 //             </tr>
 //           </thead>
 //           <tbody>
 //             ${cart
 //               .map(
 //                 (i) => `
 //               <tr>
 //                 <td>${i.name}</td>
 //                 <td>${i.qty}</td>
 //                 <td>${i.price}</td>
 //                 <td>${i.total}</td>
 //               </tr>
 //             `
 //               )
 //               .join("")}
 //           </tbody>
 //         </table>
 //         <h3 style="margin-top:15px;">الإجمالي: ${invoiceTotal.toFixed(
 //           2
 //         )} ر.س</h3>
 //         <p style="margin-top:20px; text-align:center;">شكرًا لتعاملكم معنا</p>
 //         <script>window.print()</script>
 //       </body>
 //       </html>
 //     `);
 //     w.document.close();
 //   };
 //   const handleReturn = () => {
 //     const id = Number(returnId);
 //     const q = Number(returnQty);
 //     if (!id || !q || q <= 0) {
 //       toast.error("الرجاء اختيار المنتج المرتجع وإدخال كمية صحيحة");
 //       return;
 //     }
 //     const product = getProduct(id);
 //     if (!product) {
 //       toast.error("المنتج غير موجود");
 //       return;
 //     }
 //     increaseStockOnReturn(id, q);
 //     addReturnOperation(product.name, q, product.price);
 //     toast.success("تم تسجيل المرتجع وزيادة المخزون");
 //     setReturnQty("");
 //   };
 //   return (
 //     <Layout user={user} title="المبيعات">
 //       <div dir="rtl" className="space-y-8">
 //         <h1 className="text-xl font-bold text-gray-800">🧾 شاشة المبيعات</h1>
 //         {/* إضافة صنف للفاتورة */}
 //         <section className="p-5 space-y-4 bg-white border shadow rounded-xl">
 //           <h2 className="text-lg font-semibold text-gray-700">
 //             إضافة صنف إلى الفاتورة
 //           </h2>
 //           <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
 //             <div>
 //               <label className="block mb-1 text-xs text-gray-500">
 //                 المنتج
 //               </label>
 //               <select
 //                 className="w-full p-2 text-sm border rounded"
 //                 value={selectedId}
 //                 onChange={(e) => setSelectedId(e.target.value)}
 //               >
 //                 <option value="">اختر المنتج…</option>
 //                 {products.map((p) => (
 //                   <option key={p.id} value={p.id}>
 //                     {p.name} — مخزون: {p.quantity}
 //                   </option>
 //                 ))}
 //               </select>
 //             </div>
 //             <div>
 //               <label className="block mb-1 text-xs text-gray-500">
 //                 الكمية
 //               </label>
 //               <input
 //                 type="number"
 //                 className="w-full p-2 text-sm border rounded"
 //                 placeholder="مثال: 1"
 //                 value={qty}
 //                 onChange={(e) => setQty(e.target.value)}
 //               />
 //             </div>
 //             <div className="flex items-end">
 //               <button
 //                 onClick={handleAddToCart}
 //                 className="w-full py-2 text-sm text-white rounded-lg bg-sky-600 hover:bg-sky-700"
 //               >
 //                 ➕ إضافة للفاتورة وخصم من المخزون
 //               </button>
 //             </div>
 //           </div>
 //         </section>
 //         {/* الفاتورة الحالية */}
 //         <section className="p-5 space-y-4 bg-white border shadow rounded-xl">
 //           <h2 className="text-lg font-semibold text-gray-700">
 //             تفاصيل الفاتورة الحالية
 //           </h2>
 //           <div className="overflow-x-auto">
 //             <table className="w-full text-sm text-right">
 //               <thead className="text-gray-700 bg-gray-50">
 //                 <tr>
 //                   <th className="p-2">الصنف</th>
 //                   <th className="p-2">الكمية</th>
 //                   <th className="p-2">السعر</th>
 //                   <th className="p-2">الإجمالي</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {cart.map((i) => (
 //                   <tr key={i.id} className="border-t">
 //                     <td className="p-2">{i.name}</td>
 //                     <td className="p-2">{i.qty}</td>
 //                     <td className="p-2">{i.price} ر.س</td>
 //                     <td className="p-2">{i.total} ر.س</td>
 //                   </tr>
 //                 ))}
 //                 {!cart.length && (
 //                   <tr>
 //                     <td
 //                       colSpan={4}
 //                       className="p-4 text-center text-gray-400"
 //                     >
 //                       لا توجد أصناف مضافة حتى الآن…
 //                     </td>
 //                   </tr>
 //                 )}
 //               </tbody>
 //             </table>
 //           </div>
 //           <div className="flex flex-col gap-3 mt-3 md:flex-row md:items-center md:justify-between">
 //             <div className="text-lg font-bold">
 //               الإجمالي:{" "}
 //               <span className="text-sky-700">
 //                 {invoiceTotal.toFixed(2)} ر.س
 //               </span>
 //             </div>
 //             <button
 //               onClick={printInvoice}
 //               className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
 //             >
 //               🖨️ طباعة الفاتورة
 //             </button>
 //           </div>
 //         </section>
 //         {/* المرتجعات */}
 //         <section className="p-5 space-y-4 bg-white border shadow rounded-xl">
 //           <h2 className="text-lg font-semibold text-gray-700">
 //             مرتجعات تزيد المخزون
 //           </h2>
 //           <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
 //             <div>
 //               <label className="block mb-1 text-xs text-gray-500">
 //                 المنتج المرتجع
 //               </label>
 //               <select
 //                 className="w-full p-2 text-sm border rounded"
 //                 value={returnId}
 //                 onChange={(e) => setReturnId(e.target.value)}
 //               >
 //                 <option value="">اختر المنتج…</option>
 //                 {products.map((p) => (
 //                   <option key={p.id} value={p.id}>
 //                     {p.name}
 //                   </option>
 //                 ))}
 //               </select>
 //             </div>
 //             <div>
 //               <label className="block mb-1 text-xs text-gray-500">
 //                 الكمية المرتجعة
 //               </label>
 //               <input
 //                 type="number"
 //                 className="w-full p-2 text-sm border rounded"
 //                 placeholder="مثال: 1"
 //                 value={returnQty}
 //                 onChange={(e) => setReturnQty(e.target.value)}
 //               />
 //             </div>
 //             <div className="flex items-end">
 //               <button
 //                 onClick={handleReturn}
 //                 className="w-full py-2 text-sm text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
 //               >
 //                 🔁 تسجيل مرتجع وزيادة المخزون
 //               </button>
 //             </div>
 //           </div>
 //         </section>
 //       </div>
 //     </Layout>
 //   );
 // }
 // // pages/sales.js
 // import { useEffect, useMemo, useRef, useState } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // import {
 //   LineChart,
 //   Line,
 //   XAxis,
 //   YAxis,
 //   Tooltip,
 //   CartesianGrid,
 //   ResponsiveContainer,
 // } from 'recharts'
 // export default function Sales() {
 //   const [user] = useState({ name: 'أحمد', role: 'admin' })
 //   const [sales, setSales] = useState([])
 //   const [loading, setLoading] = useState(true)
 //   const [search, setSearch] = useState('')
 //   const [cashier, setCashier] = useState('all')
 //   const [payment, setPayment] = useState('all')
 //   const [dateFrom, setDateFrom] = useState('')
 //   const [dateTo, setDateTo] = useState('')
 //   const [viewInvoice, setViewInvoice] = useState(null)
 //   const printRef = useRef(null)
 //   const API_URL = 'http://localhost:5000/api/sales'
 // useEffect(() => {
 //   const token = localStorage.getItem("pharmacy_token")
 //   if (!token) {
 //     router.replace("/")   // redirect to login
 //   }
 // }, [])
 //   useEffect(() => {
 //     const fetchSales = async () => {
 //       try {
 //         setLoading(true)
 //         const res = await fetch(API_URL)
 //         const data = await res.json()
 //         if (!res.ok) throw new Error(data.message || 'خطأ في تحميل البيانات')
 //         const formatted = data.map((s) => ({
 //           id: s.invoice_code,
 //           date: s.date,
 //           customer: s.customer,
 //           cashier: s.cashier_name || 'غير محدد',
 //           payment: s.payment,
 //           discount: s.discount,
 //           tax: s.tax,
 //           total: s.total,
 //         }))
 //         setSales(formatted)
 //       } catch (err) {
 //         toast.error('❌ فشل الاتصال بالسيرفر')
 //       } finally {
 //         setLoading(false)
 //       }
 //     }
 //     fetchSales()
 //   }, [])
 //   const formatCurrency = (v) => `${Number(v || 0).toLocaleString('ar-SA')} ر.س`
 //   const invoiceTotal = (inv) =>
 //     (inv.items?.reduce((sum, it) => sum + it.qty * it.price, 0) || Number(inv.total)) || 0
 //   const handleViewInvoice = async (id) => {
 //     try {
 //       const res = await fetch(`${API_URL}/by-code/${id}`)
 //       const data = await res.json()
 //       if (!res.ok) throw new Error(data.message)
 //       setViewInvoice({
 //         id: data.invoice_code,
 //         date: data.date,
 //         customer: data.customer,
 //         cashier: data.cashier_name || '—',
 //         payment: data.payment,
 //         discount: data.discount,
 //         tax: data.tax,
 //         items: data.items.map((it) => ({
 //           name: it.name,
 //           qty: it.qty,
 //           price: it.price,
 //         })),
 //       })
 //     } catch {
 //       toast.error('❌ فشل جلب تفاصيل الفاتورة')
 //     }
 //   }
 //   // ✅ طباعة تعمل على كل المتصفحات
 //   // 🖨️ الطباعة — الإصدار الآمن
 // const handlePrintInvoice = (invoice) => {
 //   const items = invoice.items || []  // ✅ ضمان وجود مصفوفة
 //   const totalValue =
 //     items.length > 0
 //       ? items.reduce((sum, it) => sum + it.qty * it.price, 0)
 //       : Number(invoice.total) || 0
 //   const html = `
 //     <html dir="rtl" lang="ar">
 //       <head>
 //         <meta charset="utf-8" />
 //         <title>فاتورة ${invoice.id}</title>
 //         <style>
 //           body { font-family: 'Tajawal', sans-serif; padding: 20px; }
 //           h2 { color:#0ea5e9; margin-bottom: 10px; }
 //           table { width:100%; border-collapse: collapse; margin-top:10px; }
 //           th, td { border:1px solid #ddd; padding:6px; text-align:center; }
 //           th { background:#f3f4f6; }
 //           tfoot td { font-weight:bold; color:#0ea5e9; }
 //         </style>
 //       </head>
 //       <body>
 //         <h2>صيدلية المعلم</h2>
 //         <p>فاتورة رقم <strong>${invoice.id}</strong></p>
 //         <p>العميل: ${invoice.customer}</p>
 //         <p>الكاشير: ${invoice.cashier}</p>
 //         <p>التاريخ: ${new Date(invoice.date).toLocaleString('ar-EG')}</p>
 //         <table>
 //           <thead>
 //             <tr><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
 //           </thead>
 //           <tbody>
 //             ${
 //               items.length
 //                 ? items
 //                     .map(
 //                       (it) =>
 //                         `<tr><td>${it.name}</td><td>${it.qty}</td><td>${formatCurrency(it.price)}</td><td>${formatCurrency(
 //                           it.qty * it.price
 //                         )}</td></tr>`
 //                     )
 //                     .join('')
 //                 : `<tr><td colspan="4">لا توجد أصناف في هذه الفاتورة</td></tr>`
 //             }
 //           </tbody>
 //           <tfoot>
 //             <tr><td colspan="3">الإجمالي</td><td>${formatCurrency(totalValue)}</td></tr>
 //           </tfoot>
 //         </table>
 //         <script>
 //           window.onload = () => {
 //             setTimeout(() => {
 //               window.print();
 //               setTimeout(() => window.close(), 800);
 //             }, 300);
 //           };
 //         </script>
 //       </body>
 //     </html>`
 //   const w = window.open('', '_blank', 'width=900,height=900')
 //   w.document.write(html)
 //   w.document.close()
 // }
 //   const filtered = useMemo(() => {
 //     return sales.filter((s) => {
 //       const q = search.trim().toLowerCase()
 //       const passSearch =
 //         !q ||
 //         s.id.toLowerCase().includes(q) ||
 //         s.customer.toLowerCase().includes(q)
 //       const passCashier = cashier === 'all' || s.cashier === cashier
 //       const passPayment = payment === 'all' || s.payment === payment
 //       const passDateFrom = !dateFrom || s.date.slice(0, 10) >= dateFrom
 //       const passDateTo = !dateTo || s.date.slice(0, 10) <= dateTo
 //       return passSearch && passCashier && passPayment && passDateFrom && passDateTo
 //     })
 //   }, [sales, search, cashier, payment, dateFrom, dateTo])
 //   const totals = useMemo(() => {
 //     const totalValue = filtered.reduce((sum, s) => sum + Number(s.total), 0)
 //     const count = filtered.length
 //     const avg = count ? totalValue / count : 0
 //     return { totalValue, count, avg }
 //   }, [filtered])
 //   const ActionButtons = ({ invoice }) => (
 //     <div className="flex flex-wrap justify-center gap-2">
 //       <button
 //         onClick={() => handleViewInvoice(invoice.id)}
 //         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-sky-200 text-sky-700 hover:bg-sky-50"
 //       >
 //         👁️ عرض
 //       </button>
 //       <button
 //         onClick={() => handlePrintInvoice(invoice)}
 //         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
 //       >
 //         🖨️ طباعة
 //       </button>
 //     </div>
 //   )
 //   return (
 //     <Layout user={user} title="المبيعات">
 //       <div dir="rtl" className="space-y-6">
 //         {/* الفلاتر والبحث */}
 //         <div className="p-4 bg-white border rounded-lg shadow-sm">
 //           <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
 //             <input
 //               type="text"
 //               placeholder="ابحث برقم الفاتورة / العميل"
 //               value={search}
 //               onChange={(e) => setSearch(e.target.value)}
 //               className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
 //             />
 //             <select value={cashier} onChange={(e) => setCashier(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
 //               <option value="all">كل الكاشير</option>
 //               {Array.from(new Set(sales.map((s) => s.cashier))).map((c) => (
 //                 <option key={c}>{c}</option>
 //               ))}
 //             </select>
 //             <select value={payment} onChange={(e) => setPayment(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
 //               <option value="all">كل طرق الدفع</option>
 //               <option value="cash">نقدًا</option>
 //               <option value="card">بطاقة</option>
 //               <option value="wallet">محفظة</option>
 //             </select>
 //             <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 text-sm border rounded-md" />
 //             <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 text-sm border rounded-md" />
 //           </div>
 //         </div>
 //         {/* الجدول */}
 //         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right min-w-[880px]">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">رقم الفاتورة</th>
 //                 <th className="px-3 py-2">التاريخ</th>
 //                 <th className="px-3 py-2">العميل</th>
 //                 <th className="px-3 py-2">الكاشير</th>
 //                 <th className="px-3 py-2">الدفع</th>
 //                 <th className="px-3 py-2">الإجمالي</th>
 //                 <th className="px-3 py-2">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filtered.length ? (
 //                 filtered.map((s, i) => (
 //                   <tr key={s.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{i + 1}</td>
 //                     <td className="px-3 py-2 font-medium text-sky-700">{s.id}</td>
 //                     <td className="px-3 py-2">{new Date(s.date).toLocaleString('ar-EG')}</td>
 //                     <td className="px-3 py-2">{s.customer}</td>
 //                     <td className="px-3 py-2">{s.cashier}</td>
 //                     <td className="px-3 py-2">
 //                       {s.payment === 'cash' ? 'نقدًا' : s.payment === 'card' ? 'بطاقة' : 'محفظة'}
 //                     </td>
 //                     <td className="px-3 py-2 font-semibold text-emerald-700">
 //                       {formatCurrency(s.total)}
 //                     </td>
 //                     <td className="px-3 py-2">
 //                       <ActionButtons invoice={s} />
 //                     </td>
 //                   </tr>
 //                 ))
 //               ) : (
 //                 <tr><td colSpan="8" className="py-6 text-center text-gray-500">لا توجد نتائج</td></tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* الملخص */}
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
 //           <Summary title="إجمالي المبيعات" value={formatCurrency(totals.totalValue)} color="text-emerald-600" />
 //           <Summary title="عدد الفواتير" value={totals.count.toLocaleString('ar-SA')} color="text-sky-600" />
 //           <Summary title="متوسط الفاتورة" value={formatCurrency(totals.avg.toFixed(2))} color="text-amber-600" />
 //         </div>
 //       </div>
 //       {viewInvoice && (
 //         <Modal title={`تفاصيل الفاتورة — ${viewInvoice.id}`} onClose={() => setViewInvoice(null)}>
 //           <div className="space-y-2 text-sm">
 //             <p><strong>العميل:</strong> {viewInvoice.customer}</p>
 //             <p><strong>الكاشير:</strong> {viewInvoice.cashier}</p>
 //             <table className="w-full mt-2 text-xs border">
 //               <thead className="bg-gray-50">
 //                 <tr><th>#</th><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
 //               </thead>
 //               <tbody>
 //                 {viewInvoice.items.map((it, i) => (
 //                   <tr key={i}>
 //                     <td>{i + 1}</td>
 //                     <td>{it.name}</td>
 //                     <td>{it.qty}</td>
 //                     <td>{it.price}</td>
 //                     <td>{it.qty * it.price}</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //             <div className="mt-2 font-semibold text-right text-emerald-700">
 //               الإجمالي النهائي: {formatCurrency(invoiceTotal(viewInvoice))}
 //             </div>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // function Summary({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
 //       <p className="text-xs text-gray-500">{title}</p>
 //       <p className={`mt-1 text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
 //     </div>
 //   )
 // }
 // // pages/sales.js
 // import { useEffect, useMemo, useRef, useState } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // import {
 //   LineChart,
 //   Line,
 //   XAxis,
 //   YAxis,
 //   Tooltip,
 //   CartesianGrid,
 //   ResponsiveContainer,
 // } from 'recharts'
 // export default function Sales() {
 //   const [user] = useState({ name: 'أحمد', role: 'admin' })
 //   const [sales, setSales] = useState([])
 //   const [loading, setLoading] = useState(true)
 //   const [search, setSearch] = useState('')
 //   const [cashier, setCashier] = useState('all')
 //   const [payment, setPayment] = useState('all')
 //   const [dateFrom, setDateFrom] = useState('')
 //   const [dateTo, setDateTo] = useState('')
 //   const [viewInvoice, setViewInvoice] = useState(null)
 //   const printRef = useRef(null)
 //   const API_URL = 'http://localhost:5000/api/sales'
 //   // 🧾 تحميل بيانات المبيعات من الباك إند
 //   useEffect(() => {
 //     const fetchSales = async () => {
 //       try {
 //         setLoading(true)
 //         const res = await fetch(API_URL)
 //         const data = await res.json()
 //         if (!res.ok) throw new Error(data.message || 'خطأ في تحميل البيانات')
 //         // تحويل البنية القادمة من الباك إند لتناسب الواجهة
 //         const formatted = data.map((s) => ({
 //           id: s.invoice_code,
 //           date: s.date,
 //           customer: s.customer,
 //           cashier: s.cashier_name || 'غير محدد',
 //           payment: s.payment,
 //           discount: s.discount,
 //           tax: s.tax,
 //           total: s.total,
 //         }))
 //         setSales(formatted)
 //       } catch (err) {
 //         console.error(err)
 //         toast.error('❌ فشل الاتصال بالسيرفر')
 //       } finally {
 //         setLoading(false)
 //       }
 //     }
 //     fetchSales()
 //   }, [])
 //   // 🧮 دوال مساعدة
 //   const formatCurrency = (v) => `${Number(v).toLocaleString('ar-SA')} ر.س`
 //   const invoiceTotal = (inv) => inv.total || 0
 //   // 🧠 التحليل الذكي
 //   const smartInsight = useMemo(() => {
 //     if (!sales.length) return ''
 //     const today = new Date().toISOString().slice(0, 10)
 //     const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
 //     const totalByDate = (d) =>
 //       sales
 //         .filter((s) => s.date.slice(0, 10) === d)
 //         .reduce((sum, s) => sum + invoiceTotal(s), 0)
 //     const tToday = totalByDate(today)
 //     const tYesterday = totalByDate(yesterday)
 //     const diff = tYesterday ? (((tToday - tYesterday) / tYesterday) * 100).toFixed(1) : 0
 //     const topCashier = Object.entries(
 //       sales.reduce((acc, s) => {
 //         acc[s.cashier] = (acc[s.cashier] || 0) + invoiceTotal(s)
 //         return acc
 //       }, {})
 //     )
 //       .sort((a, b) => b[1] - a[1])[0]?.[0]
 //     return `📊 أداء اليوم: ${formatCurrency(tToday)} — ${
 //       tYesterday ? `مقابل أمس ${formatCurrency(tYesterday)} (${diff}%)` : 'لا توجد بيانات لأمس'
 //     }. 🏆 أفضل كاشير: ${topCashier || '—'}.`
 //   }, [sales])
 //   // 🗂️ الفلاتر
 //   const filtered = useMemo(() => {
 //     return sales.filter((s) => {
 //       const q = search.trim().toLowerCase()
 //       const passSearch =
 //         !q ||
 //         s.id.toLowerCase().includes(q) ||
 //         s.customer.toLowerCase().includes(q)
 //       const passCashier = cashier === 'all' || s.cashier === cashier
 //       const passPayment = payment === 'all' || s.payment === payment
 //       const passDateFrom = !dateFrom || s.date.slice(0, 10) >= dateFrom
 //       const passDateTo = !dateTo || s.date.slice(0, 10) <= dateTo
 //       return passSearch && passCashier && passPayment && passDateFrom && passDateTo
 //     })
 //   }, [sales, search, cashier, payment, dateFrom, dateTo])
 //   // 🔢 ملخص
 //   const totals = useMemo(() => {
 //     const totalValue = filtered.reduce((sum, s) => sum + invoiceTotal(s), 0)
 //     const count = filtered.length
 //     const avg = count ? totalValue / count : 0
 //     return { totalValue, count, avg }
 //   }, [filtered])
 //   // 📈 بيانات الرسم
 //   const chartData = useMemo(() => {
 //     const map = {}
 //     filtered.forEach((s) => {
 //       const d = s.date.slice(0, 10)
 //       map[d] = (map[d] || 0) + invoiceTotal(s)
 //     })
 //     return Object.entries(map)
 //       .sort((a, b) => (a[0] > b[0] ? 1 : -1))
 //       .map(([date, total]) => ({ date, total }))
 //   }, [filtered])
 //   // 👁️ جلب تفاصيل الفاتورة من الباك إند
 //   const handleViewInvoice = async (id) => {
 //     try {
 //       const res = await fetch(`${API_URL}/${id.replace('INV-', '')}`)
 //       const data = await res.json()
 //       if (!res.ok) throw new Error(data.message)
 //       setViewInvoice({
 //         id: data.invoice_code,
 //         date: data.date,
 //         customer: data.customer,
 //         cashier: data.cashier_name || '—',
 //         payment: data.payment,
 //         discount: data.discount,
 //         tax: data.tax,
 //         items: data.items.map((it) => ({
 //           name: it.name,
 //           qty: it.qty,
 //           price: it.price,
 //         })),
 //       })
 //     } catch (err) {
 //       toast.error('❌ فشل جلب تفاصيل الفاتورة')
 //       console.error(err)
 //     }
 //   }
 //   // 🖨️ الطباعة
 //   const handlePrintInvoice = (invoice) => {
 //     toast.success('🖨️ جارٍ تجهيز الطباعة...')
 //     const html = `
 //       <html dir="rtl" lang="ar">
 //         <head><meta charset="utf-8" /><title>فاتورة ${invoice.id}</title></head>
 //         <body style="font-family: 'Tajawal'; padding: 20px;">
 //           <h2 style="color:#0ea5e9;">صيدلية المعلم</h2>
 //           <p>فاتورة رقم ${invoice.id} — ${new Date(invoice.date).toLocaleString('ar-EG')}</p>
 //           <p>العميل: ${invoice.customer}</p>
 //           <p>الكاشير: ${invoice.cashier}</p>
 //           <table border="1" width="100%" style="border-collapse:collapse;">
 //             <thead><tr><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
 //             <tbody>
 //               ${invoice.items.map(it => `<tr><td>${it.name}</td><td>${it.qty}</td><td>${it.price}</td><td>${it.qty * it.price}</td></tr>`).join('')}
 //             </tbody>
 //           </table>
 //           <h4>الإجمالي: ${invoiceTotal(invoice)} ر.س</h4>
 //           <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),300);}</script>
 //         </body>
 //       </html>`
 //     const w = window.open('', '_blank', 'width=850,height=900')
 //     w.document.open()
 //     w.document.write(html)
 //     w.document.close()
 //   }
 //   const ActionButtons = ({ invoice }) => (
 //     <div className="flex flex-wrap justify-center gap-2">
 //       <button
 //         onClick={() => handleViewInvoice(invoice.id)}
 //         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-sky-200 text-sky-700 hover:bg-sky-50"
 //       >
 //         👁️ عرض
 //       </button>
 //       <button
 //         onClick={() => handlePrintInvoice(invoice)}
 //         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
 //       >
 //         🖨️ طباعة
 //       </button>
 //     </div>
 //   )
 //   if (loading) {
 //     return (
 //       <Layout user={user} title="المبيعات">
 //         <div dir="rtl" className="flex items-center justify-center h-80">
 //           <p className="text-gray-600">جارٍ تحميل البيانات...</p>
 //         </div>
 //       </Layout>
 //     )
 //   }
 //   return (
 //     <Layout user={user} title="المبيعات">
 //       <div dir="rtl" className="space-y-6">
 //         <div className="p-4 text-sm border rounded-lg bg-sky-50/70 border-sky-100 text-sky-800">
 //           {smartInsight}
 //         </div>
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
 //           <Summary title="إجمالي المبيعات" value={formatCurrency(totals.totalValue)} color="text-emerald-600" />
 //           <Summary title="عدد الفواتير" value={totals.count.toLocaleString('ar-SA')} color="text-sky-600" />
 //           <Summary title="متوسط الفاتورة" value={formatCurrency(totals.avg.toFixed(2))} color="text-amber-600" />
 //         </div>
 //         {/* الفلاتر */}
 //         <div className="p-4 bg-white border rounded-lg shadow-sm">
 //           <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
 //             <input
 //               type="text"
 //               placeholder="ابحث برقم الفاتورة / العميل"
 //               value={search}
 //               onChange={(e) => setSearch(e.target.value)}
 //               className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
 //             />
 //             <select value={cashier} onChange={(e) => setCashier(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
 //               <option value="all">كل الكاشير</option>
 //               {Array.from(new Set(sales.map((s) => s.cashier))).map((c) => (
 //                 <option key={c}>{c}</option>
 //               ))}
 //             </select>
 //             <select value={payment} onChange={(e) => setPayment(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
 //               <option value="all">كل طرق الدفع</option>
 //               <option value="cash">نقدًا</option>
 //               <option value="card">بطاقة</option>
 //               <option value="wallet">محفظة</option>
 //             </select>
 //             <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 text-sm border rounded-md" />
 //             <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 text-sm border rounded-md" />
 //           </div>
 //           <div className="flex flex-wrap gap-2 mt-3">
 //             <button
 //               onClick={() => {
 //                 setSearch('')
 //                 setCashier('all')
 //                 setPayment('all')
 //                 setDateFrom('')
 //                 setDateTo('')
 //                 toast.success('تم مسح الفلاتر')
 //               }}
 //               className="px-3 py-1.5 text-sm rounded border border-gray-200 hover:bg-gray-50"
 //             >
 //               مسح الفلاتر
 //             </button>
 //           </div>
 //         </div>
 //         {/* الجدول */}
 //         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right min-w-[880px]">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">رقم الفاتورة</th>
 //                 <th className="px-3 py-2">التاريخ</th>
 //                 <th className="px-3 py-2">العميل</th>
 //                 <th className="px-3 py-2">الكاشير</th>
 //                 <th className="px-3 py-2">الدفع</th>
 //                 <th className="px-3 py-2">الإجمالي</th>
 //                 <th className="px-3 py-2">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filtered.length ? (
 //                 filtered.map((s, i) => (
 //                   <tr key={s.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{i + 1}</td>
 //                     <td className="px-3 py-2 font-medium text-sky-700">{s.id}</td>
 //                     <td className="px-3 py-2">{new Date(s.date).toLocaleString('ar-EG')}</td>
 //                     <td className="px-3 py-2">{s.customer}</td>
 //                     <td className="px-3 py-2">{s.cashier}</td>
 //                     <td className="px-3 py-2">{s.payment === 'cash' ? 'نقدًا' : s.payment === 'card' ? 'بطاقة' : 'محفظة'}</td>
 //                     <td className="px-3 py-2 font-semibold text-emerald-700">{formatCurrency(invoiceTotal(s))}</td>
 //                     <td className="px-3 py-2"><ActionButtons invoice={s} /></td>
 //                   </tr>
 //                 ))
 //               ) : (
 //                 <tr><td colSpan="8" className="py-6 text-center text-gray-500">لا توجد نتائج</td></tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* الرسم البياني */}
 //         <div className="p-4 bg-white border rounded-lg shadow-sm">
 //           <h3 className="mb-3 text-lg font-semibold text-gray-700">📈 المبيعات اليومية</h3>
 //           <ResponsiveContainer width="100%" height={260}>
 //             <LineChart data={chartData}>
 //               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //               <XAxis dataKey="date" />
 //               <YAxis />
 //               <Tooltip />
 //               <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
 //             </LineChart>
 //           </ResponsiveContainer>
 //         </div>
 //         {/* ملخص سريع */}
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
 //           <Summary title="إجمالي النتائج المعروضة" value={formatCurrency(totals.totalValue)} color="text-emerald-600" />
 //           <Summary title="عدد النتائج المعروضة" value={totals.count.toLocaleString('ar-SA')} color="text-sky-600" />
 //           <Summary title="متوسط الفاتورة (للنتائج)" value={formatCurrency(totals.avg.toFixed(2))} color="text-amber-600" />
 //         </div>
 //       </div>
 //       {/* 💬 مودال عرض الفاتورة */}
 //       {viewInvoice && (
 //         <Modal title={`تفاصيل الفاتورة — ${viewInvoice.id}`} onClose={() => setViewInvoice(null)}>
 //           <div ref={printRef} className="space-y-2 text-sm">
 //             <div className="grid grid-cols-2 gap-2">
 //               <p><strong>العميل:</strong> {viewInvoice.customer}</p>
 //               <p><strong>الكاشير:</strong> {viewInvoice.cashier}</p>
 //               <p><strong>طريقة الدفع:</strong> {viewInvoice.payment === 'cash' ? 'نقدًا' : viewInvoice.payment === 'card' ? 'بطاقة' : 'محفظة'}</p>
 //               <p><strong>التاريخ:</strong> {new Date(viewInvoice.date).toLocaleString('ar-EG')}</p>
 //             </div>
 //             <table className="w-full mt-2 text-xs border">
 //               <thead className="bg-gray-50">
 //                 <tr><th>#</th><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
 //               </thead>
 //               <tbody>
 //                 {viewInvoice.items.map((it, i) => (
 //                   <tr key={i}>
 //                     <td>{i + 1}</td>
 //                     <td>{it.name}</td>
 //                     <td>{it.qty}</td>
 //                     <td>{it.price}</td>
 //                     <td>{it.qty * it.price}</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //             <div className="mt-2 font-semibold text-right text-emerald-700">
 //               الإجمالي النهائي: {formatCurrency(invoiceTotal(viewInvoice))}
 //             </div>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // function Summary({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
 //       <p className="text-xs text-gray-500">{title}</p>
 //       <p className={`mt-1 text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
 //     </div>
 //   )
 // }
 // // pages/sales.js
 // import { useEffect, useMemo, useRef, useState } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // import {
 //   LineChart,
 //   Line,
 //   XAxis,
 //   YAxis,
 //   Tooltip,
 //   CartesianGrid,
 //   ResponsiveContainer,
 // } from 'recharts'
 // export default function Sales() {
 //   // 👤 المستخدم الحالي (للـ Layout فقط)
 //   const [user] = useState({ name: 'أحمد', role: 'admin' })
 //   // 🧾 حالة البيانات الأساسية
 //   const [sales, setSales] = useState([])
 //   const [loading, setLoading] = useState(true)
 //   // 🔎 فلاتر
 //   const [search, setSearch] = useState('')
 //   const [cashier, setCashier] = useState('all')
 //   const [payment, setPayment] = useState('all')
 //   const [dateFrom, setDateFrom] = useState('')
 //   const [dateTo, setDateTo] = useState('')
 //   // 👁️ عرض تفاصيل الفاتورة
 //   const [viewInvoice, setViewInvoice] = useState(null)
 //   // 🖨️ مرجع محتوى الطباعة
 //   const printRef = useRef(null)
 //   // 🧪 تحميل بيانات مبدئية (وهمية)
 //   useEffect(() => {
 //     setLoading(true)
 //     const mock = [
 //       {
 //         id: 'INV-1001',
 //         date: '2025-11-02T09:10:00',
 //         customer: 'عميل نقدي',
 //         cashier: 'أحمد',
 //         payment: 'cash', // cash | card | wallet
 //         items: [
 //           { name: 'باراسيتامول 500mg', qty: 2, price: 15 },
 //           { name: 'فيتامين سي 1000mg', qty: 1, price: 25 },
 //         ],
 //         discount: 5,
 //         tax: 0,
 //       },
 //       {
 //         id: 'INV-1002',
 //         date: '2025-11-02T11:35:00',
 //         customer: 'سارة',
 //         cashier: 'منى',
 //         payment: 'card',
 //         items: [{ name: 'أموكسيسيلين 250mg', qty: 1, price: 45 }],
 //         discount: 0,
 //         tax: 0,
 //       },
 //       {
 //         id: 'INV-1003',
 //         date: '2025-11-01T17:20:00',
 //         customer: 'عميل نقدي',
 //         cashier: 'أحمد',
 //         payment: 'wallet',
 //         items: [
 //           { name: 'ايبوبروفين 400mg', qty: 1, price: 30 },
 //           { name: 'فيتامين د', qty: 3, price: 18 },
 //         ],
 //         discount: 0,
 //         tax: 0,
 //       },
 //     ]
 //     setTimeout(() => {
 //       setSales(mock)
 //       setLoading(false)
 //     }, 250)
 //   }, [])
 //   // 🧮 دوال مساعدة
 //   const formatCurrency = (v) => `${Number(v).toLocaleString('ar-SA')} ر.س`
 //   const invoiceTotal = (inv) => {
 //     const sub = inv.items.reduce((s, it) => s + it.qty * it.price, 0)
 //     return sub - (inv.discount || 0) + (inv.tax || 0)
 //   }
 //   // 🧠 التحليل الذكي
 //   const smartInsight = useMemo(() => {
 //     if (!sales.length) return ''
 //     // اجمالي اليوم الحالي مقابل الأمس (كمثال بسيط)
 //     const today = new Date().toISOString().slice(0, 10)
 //     const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
 //     const totalByDate = (d) =>
 //       sales
 //         .filter((s) => s.date.slice(0, 10) === d)
 //         .reduce((sum, s) => sum + invoiceTotal(s), 0)
 //     const tToday = totalByDate(today)
 //     const tYesterday = totalByDate(yesterday)
 //     const diff = tYesterday ? (((tToday - tYesterday) / tYesterday) * 100).toFixed(1) : 0
 //     const topCashier = Object.entries(
 //       sales.reduce((acc, s) => {
 //         acc[s.cashier] = (acc[s.cashier] || 0) + invoiceTotal(s)
 //         return acc
 //       }, {})
 //     )
 //       .sort((a, b) => b[1] - a[1])[0]?.[0]
 //     return `📊 أداء اليوم: ${formatCurrency(tToday)} — ${
 //       tYesterday ? `مقابل أمس ${formatCurrency(tYesterday)} (${diff}%)` : 'لا توجد بيانات لأمس'
 //     }. 🏆 أفضل كاشير: ${topCashier || '—'}.`
 //   }, [sales])
 //   // 🗂️ تطبيق الفلاتر
 //   const filtered = useMemo(() => {
 //     return sales.filter((s) => {
 //       const q = search.trim().toLowerCase()
 //       const passSearch =
 //         !q ||
 //         s.id.toLowerCase().includes(q) ||
 //         s.customer.toLowerCase().includes(q) ||
 //         s.items.some((it) => it.name.toLowerCase().includes(q))
 //       const passCashier = cashier === 'all' || s.cashier === cashier
 //       const passPayment = payment === 'all' || s.payment === payment
 //       const passDateFrom = !dateFrom || s.date.slice(0, 10) >= dateFrom
 //       const passDateTo = !dateTo || s.date.slice(0, 10) <= dateTo
 //       return passSearch && passCashier && passPayment && passDateFrom && passDateTo
 //     })
 //   }, [sales, search, cashier, payment, dateFrom, dateTo])
 //   // 🔢 إحصاءات سريعة
 //   const totals = useMemo(() => {
 //     const totalValue = filtered.reduce((sum, s) => sum + invoiceTotal(s), 0)
 //     const count = filtered.length
 //     const avg = count ? totalValue / count : 0
 //     return { totalValue, count, avg }
 //   }, [filtered])
 //   // 📈 تجهيز بيانات الرسم
 //   const chartData = useMemo(() => {
 //     // تجميع حسب اليوم (YYYY-MM-DD)
 //     const map = {}
 //     filtered.forEach((s) => {
 //       const d = s.date.slice(0, 10)
 //       map[d] = (map[d] || 0) + invoiceTotal(s)
 //     })
 //     return Object.entries(map)
 //       .sort((a, b) => (a[0] > b[0] ? 1 : -1))
 //       .map(([date, total]) => ({ date, total }))
 //   }, [filtered])
 //   // 🖨️ طباعة الفاتورة (مودال أو نافذة مستقلة)
 //   const handlePrintInvoice = (invoice) => {
 //     toast.success('🖨️ جارٍ تجهيز الطباعة...')
 //     const html = `
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <meta charset="utf-8" />
 //           <title>فاتورة ${invoice.id}</title>
 //           <style>
 //             * { box-sizing: border-box; }
 //             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
 //             .header { display: flex; align-items:center; gap: 12px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 12px; }
 //             .logo { width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; font-size: 22px; color:#fff; border-radius:10px; background: ${theme.colors.primary}; }
 //             .title h1 { margin: 0; font-size: 18px; color: #111827; }
 //             .title p { margin: 0; font-size: 12px; color: #6b7280; }
 //             h2 { font-size: 16px; color: #0ea5e9; margin: 14px 0 8px; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 13px; }
 //             th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: center; }
 //             th { background: #f9fafb; }
 //             .totals { margin-top: 10px; text-align: left; }
 //             .totals .line { display:flex; justify-content:space-between; margin: 4px 0; }
 //             .footer { margin-top: 16px; text-align: center; color: #6b7280; font-size: 12px; }
 //           </style>
 //         </head>
 //         <body>
 //           <div class="header">
 //             <div class="logo">💊</div>
 //             <div class="title">
 //               <h1>صيدلية المعلم — Pharmacy Al-Muallem</h1>
 //               <p>فاتورة رقم ${invoice.id} • ${new Date(invoice.date).toLocaleString('ar-EG')}</p>
 //             </div>
 //           </div>
 //           <h2>تفاصيل العميل</h2>
 //           <div style="display:grid; grid-template-columns: repeat(2,1fr); gap:8px; font-size:13px;">
 //             <div><strong>العميل:</strong> ${invoice.customer}</div>
 //             <div><strong>الكاشير:</strong> ${invoice.cashier}</div>
 //             <div><strong>طريقة الدفع:</strong> ${invoice.payment === 'cash' ? 'نقدًا' : invoice.payment === 'card' ? 'بطاقة' : 'محفظة'}</div>
 //             <div><strong>التاريخ:</strong> ${new Date(invoice.date).toLocaleString('ar-EG')}</div>
 //           </div>
 //           <h2>الأصناف</h2>
 //           <table>
 //             <thead>
 //               <tr>
 //                 <th>#</th>
 //                 <th>الصنف</th>
 //                 <th>الكمية</th>
 //                 <th>السعر</th>
 //                 <th>الإجمالي</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               ${invoice.items
 //                 .map(
 //                   (it, i) => `
 //                 <tr>
 //                   <td>${i + 1}</td>
 //                   <td>${it.name}</td>
 //                   <td>${it.qty}</td>
 //                   <td>${Number(it.price).toLocaleString('ar-SA')} ر.س</td>
 //                   <td>${Number(it.qty * it.price).toLocaleString('ar-SA')} ر.س</td>
 //                 </tr>`
 //                 )
 //                 .join('')}
 //             </tbody>
 //           </table>
 //           <div class="totals">
 //             <div class="line"><strong>الإجمالي الفرعي:</strong><span>
 //               ${invoice.items
 //                 .reduce((s, it) => s + it.qty * it.price, 0)
 //                 .toLocaleString('ar-SA')} ر.س</span></div>
 //             <div class="line"><strong>الخصم:</strong><span>${(invoice.discount || 0).toLocaleString(
 //               'ar-SA'
 //             )} ر.س</span></div>
 //             <div class="line"><strong>الضريبة:</strong><span>${(invoice.tax || 0).toLocaleString(
 //               'ar-SA'
 //             )} ر.س</span></div>
 //             <div class="line" style="font-size:15px;"><strong>الإجمالي النهائي:</strong><span>
 //               ${invoiceTotal(invoice).toLocaleString('ar-SA')} ر.س</span></div>
 //           </div>
 //           <div class="footer">شكرًا لتسوقكم من صيدلية المعلم 💙</div>
 //           <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };</script>
 //         </body>
 //       </html>
 //     `
 //     const w = window.open('', '_blank', 'width=850,height=900')
 //     w.document.open()
 //     w.document.write(html)
 //     w.document.close()
 //   }
 //   // 🧾 أزرار الإجراءات (عرض/طباعة)
 //   const ActionButtons = ({ invoice }) => (
 //     <div className="flex flex-wrap justify-center gap-2">
 //       <button
 //         onClick={() => setViewInvoice(invoice)}
 //         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-sky-200 text-sky-700 hover:bg-sky-50"
 //       >
 //         👁️ عرض
 //       </button>
 //       <button
 //         onClick={() => handlePrintInvoice(invoice)}
 //         className="px-2.5 py-1.5 text-xs sm:text-sm rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
 //       >
 //         🖨️ طباعة
 //       </button>
 //     </div>
 //   )
 //   if (loading) {
 //     return (
 //       <Layout user={user} title="المبيعات">
 //         <div dir="rtl" className="flex items-center justify-center h-80">
 //           <p className="text-gray-600">جارٍ تحميل البيانات...</p>
 //         </div>
 //       </Layout>
 //     )
 //   }
 //   return (
 //     <Layout user={user} title="المبيعات">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 🔹 التحليل الذكي */}
 //         <div className="p-4 text-sm border rounded-lg bg-sky-50/70 border-sky-100 text-sky-800">
 //           {smartInsight}
 //         </div>
 //         {/* 🧾 بطاقات ملخص */}
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
 //           <Summary title="إجمالي المبيعات" value={formatCurrency(totals.totalValue)} color="text-emerald-600" />
 //           <Summary title="عدد الفواتير" value={totals.count.toLocaleString('ar-SA')} color="text-sky-600" />
 //           <Summary title="متوسط الفاتورة" value={formatCurrency(totals.avg.toFixed(2))} color="text-amber-600" />
 //         </div>
 //         {/* 🔎 فلاتر متقدمة */}
 //         <div className="p-4 bg-white border rounded-lg shadow-sm">
 //           <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
 //             <input
 //               type="text"
 //               placeholder="ابحث برقم الفاتورة / العميل / اسم الصنف"
 //               value={search}
 //               onChange={(e) => setSearch(e.target.value)}
 //               className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
 //             />
 //             <select
 //               value={cashier}
 //               onChange={(e) => setCashier(e.target.value)}
 //               className="w-full px-3 py-2 text-sm border rounded-md"
 //             >
 //               <option value="all">كل الكاشير</option>
 //               {Array.from(new Set(sales.map((s) => s.cashier))).map((c) => (
 //                 <option key={c} value={c}>{c}</option>
 //               ))}
 //             </select>
 //             <select
 //               value={payment}
 //               onChange={(e) => setPayment(e.target.value)}
 //               className="w-full px-3 py-2 text-sm border rounded-md"
 //             >
 //               <option value="all">كل طرق الدفع</option>
 //               <option value="cash">نقدًا</option>
 //               <option value="card">بطاقة</option>
 //               <option value="wallet">محفظة</option>
 //             </select>
 //             <input
 //               type="date"
 //               value={dateFrom}
 //               onChange={(e) => setDateFrom(e.target.value)}
 //               className="w-full px-3 py-2 text-sm border rounded-md"
 //             />
 //             <input
 //               type="date"
 //               value={dateTo}
 //               onChange={(e) => setDateTo(e.target.value)}
 //               className="w-full px-3 py-2 text-sm border rounded-md"
 //             />
 //           </div>
 //           <div className="flex flex-wrap gap-2 mt-3">
 //             <button
 //               onClick={() => {
 //                 setSearch('')
 //                 setCashier('all')
 //                 setPayment('all')
 //                 setDateFrom('')
 //                 setDateTo('')
 //                 toast.success('تم مسح الفلاتر')
 //               }}
 //               className="px-3 py-1.5 text-sm rounded border border-gray-200 hover:bg-gray-50"
 //             >
 //               مسح الفلاتر
 //             </button>
 //           </div>
 //         </div>
 //         {/* 🧾 جدول المبيعات */}
 //         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right min-w-[880px]">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">رقم الفاتورة</th>
 //                 <th className="px-3 py-2">التاريخ</th>
 //                 <th className="px-3 py-2">العميل</th>
 //                 <th className="px-3 py-2">الكاشير</th>
 //                 <th className="px-3 py-2">الدفع</th>
 //                 <th className="px-3 py-2">الإجمالي</th>
 //                 <th className="px-3 py-2">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filtered.length ? (
 //                 filtered.map((s, idx) => (
 //                   <tr key={s.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{idx + 1}</td>
 //                     <td className="px-3 py-2 font-medium text-sky-700">{s.id}</td>
 //                     <td className="px-3 py-2">
 //                       {new Date(s.date).toLocaleString('ar-EG')}
 //                     </td>
 //                     <td className="px-3 py-2">{s.customer}</td>
 //                     <td className="px-3 py-2">{s.cashier}</td>
 //                     <td className="px-3 py-2">
 //                       {s.payment === 'cash' ? 'نقدًا' : s.payment === 'card' ? 'بطاقة' : 'محفظة'}
 //                     </td>
 //                     <td className="px-3 py-2 font-semibold text-emerald-700">
 //                       {formatCurrency(invoiceTotal(s))}
 //                     </td>
 //                     <td className="px-3 py-2">
 //                       <ActionButtons invoice={s} />
 //                     </td>
 //                   </tr>
 //                 ))
 //               ) : (
 //                 <tr>
 //                   <td className="px-3 py-6 text-center text-gray-500" colSpan="8">
 //                     لا توجد نتائج مطابقة للفلاتر الحالية
 //                   </td>
 //                 </tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* 📈 الرسم البياني اليومي */}
 //         <div className="p-4 bg-white border rounded-lg shadow-sm">
 //           <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات اليومية</h3>
 //           <ResponsiveContainer width="100%" height={260}>
 //             <LineChart data={chartData}>
 //               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //               <XAxis dataKey="date" />
 //               <YAxis />
 //               <Tooltip />
 //               <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
 //             </LineChart>
 //           </ResponsiveContainer>
 //         </div>
 //         {/* 🧮 ملخص سريع أسفل الصفحة */}
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
 //           <Summary title="إجمالي النتائج المعروضة" value={formatCurrency(totals.totalValue)} color="text-emerald-600" />
 //           <Summary title="عدد النتائج المعروضة" value={totals.count.toLocaleString('ar-SA')} color="text-sky-600" />
 //           <Summary title="متوسط الفاتورة (للنتائج)" value={formatCurrency(totals.avg.toFixed(2))} color="text-amber-600" />
 //         </div>
 //       </div>
 //       {/* 💬 مودال عرض الفاتورة */}
 //       {viewInvoice && (
 //         <Modal title={`تفاصيل الفاتورة — ${viewInvoice.id}`} onClose={() => setViewInvoice(null)}>
 //           <div ref={printRef} className="space-y-2 text-sm">
 //             <div className="flex items-center gap-2 pb-2 mb-2 border-b">
 //               <div
 //                 className="flex items-center justify-center text-white rounded-md w-9 h-9"
 //                 style={{ background: theme.colors.primary }}
 //               >
 //                 💊
 //               </div>
 //               <div>
 //                 <p className="text-base font-semibold text-gray-800">صيدلية المعلم — Pharmacy Al-Muallem</p>
 //                 <p className="text-xs text-gray-500">
 //                   فاتورة رقم {viewInvoice.id} • {new Date(viewInvoice.date).toLocaleString('ar-EG')}
 //                 </p>
 //               </div>
 //             </div>
 //             <div className="grid grid-cols-2 gap-2">
 //               <p><strong>العميل:</strong> {viewInvoice.customer}</p>
 //               <p><strong>الكاشير:</strong> {viewInvoice.cashier}</p>
 //               <p><strong>طريقة الدفع:</strong> {viewInvoice.payment === 'cash' ? 'نقدًا' : viewInvoice.payment === 'card' ? 'بطاقة' : 'محفظة'}</p>
 //               <p><strong>التاريخ:</strong> {new Date(viewInvoice.date).toLocaleString('ar-EG')}</p>
 //             </div>
 //             <div className="overflow-x-auto">
 //               <table className="w-full mt-2 text-xs border">
 //                 <thead className="bg-gray-50">
 //                   <tr>
 //                     <th className="px-2 py-1 border">#</th>
 //                     <th className="px-2 py-1 border">الصنف</th>
 //                     <th className="px-2 py-1 border">الكمية</th>
 //                     <th className="px-2 py-1 border">السعر</th>
 //                     <th className="px-2 py-1 border">الإجمالي</th>
 //                   </tr>
 //                 </thead>
 //                 <tbody>
 //                   {viewInvoice.items.map((it, i) => (
 //                     <tr key={i}>
 //                       <td className="px-2 py-1 text-center border">{i + 1}</td>
 //                       <td className="px-2 py-1 border">{it.name}</td>
 //                       <td className="px-2 py-1 text-center border">{it.qty}</td>
 //                       <td className="px-2 py-1 text-center border">{Number(it.price).toLocaleString('ar-SA')} ر.س</td>
 //                       <td className="px-2 py-1 text-center border">{Number(it.qty * it.price).toLocaleString('ar-SA')} ر.س</td>
 //                     </tr>
 //                   ))}
 //                 </tbody>
 //               </table>
 //             </div>
 //             <div className="flex justify-end gap-6 pt-2 text-sm">
 //               <div><strong>الخصم:</strong> {(viewInvoice.discount || 0).toLocaleString('ar-SA')} ر.س</div>
 //               <div><strong>الضريبة:</strong> {(viewInvoice.tax || 0).toLocaleString('ar-SA')} ر.س</div>
 //               <div className="font-semibold text-emerald-700">
 //                 <strong>الإجمالي النهائي:</strong> {invoiceTotal(viewInvoice).toLocaleString('ar-SA')} ر.س
 //               </div>
 //             </div>
 //           </div>
 //           <div className="flex gap-3 mt-4">
 //             <button
 //               onClick={() => handlePrintInvoice(viewInvoice)}
 //               className="w-full py-2 text-white rounded-md bg-emerald-600 hover:bg-emerald-700"
 //             >
 //               🖨️ طباعة
 //             </button>
 //             <button
 //               onClick={() => {
 //                 setViewInvoice(null)
 //                 toast.success('تم إغلاق التفاصيل')
 //               }}
 //               className="w-full py-2 bg-gray-100 rounded-md hover:bg-gray-200"
 //             >
 //               إغلاق
 //             </button>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // /* ===================== مكوّنات مساعدة ===================== */
 // function Summary({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
 //       <p className="text-xs text-gray-500">{title}</p>
 //       <p className={`mt-1 text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
 //     </div>
 //   )
 // }
 // import { useState, useMemo } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // export default function SalesPage() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   // 🧾 بيانات افتراضية للمبيعات
 //   const initialSales = [
 //     {
 //       id: 'INV-001',
 //       date: '2025-11-02',
 //       cashier: 'أحمد',
 //       total: 150,
 //       discount: 10,
 //       payment: 'نقدي',
 //       items: [
 //         { name: 'باراسيتامول 500mg', qty: 2, price: 15 },
 //         { name: 'فيتامين سي 1000mg', qty: 3, price: 25 },
 //       ],
 //     },
 //     {
 //       id: 'INV-002',
 //       date: '2025-11-03',
 //       cashier: 'محمد',
 //       total: 300,
 //       discount: 0,
 //       payment: 'بطاقة',
 //       items: [
 //         { name: 'أموكسيسيلين 250mg', qty: 4, price: 45 },
 //         { name: 'ايبوبروفين 400mg', qty: 2, price: 30 },
 //       ],
 //     },
 //   ]
 //   const [sales, setSales] = useState(initialSales)
 //   const [search, setSearch] = useState('')
 //   const [paymentFilter, setPaymentFilter] = useState('الكل')
 //   const [cashierFilter, setCashierFilter] = useState('الكل')
 //   const [dateFilter, setDateFilter] = useState('')
 //   const [viewSale, setViewSale] = useState(null)
 //   const paymentTypes = ['الكل', 'نقدي', 'بطاقة', 'تحويل']
 //   const cashiers = ['الكل', 'أحمد', 'محمد']
 //   // 🔎 تصفية المبيعات
 //   const filteredSales = useMemo(() => {
 //     return sales.filter((s) => {
 //       const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase())
 //       const matchesPayment = paymentFilter === 'الكل' || s.payment === paymentFilter
 //       const matchesCashier = cashierFilter === 'الكل' || s.cashier === cashierFilter
 //       const matchesDate = !dateFilter || s.date === dateFilter
 //       return matchesSearch && matchesPayment && matchesCashier && matchesDate
 //     })
 //   }, [sales, search, paymentFilter, cashierFilter, dateFilter])
 //   // 📊 إحصائيات
 //   const totalSales = filteredSales.reduce((sum, s) => sum + s.total, 0)
 //   const invoiceCount = filteredSales.length
 //   // 🖨️ طباعة التقرير
 //   const printReport = () => {
 //     const w = window.open('', '', 'width=900,height=600')
 //     w.document.write(`
 //       <html dir="rtl" lang="ar">
 //       <head>
 //         <title>تقرير المبيعات</title>
 //         <style>
 //           body { font-family: 'Tajawal', sans-serif; padding: 20px; }
 //           h1 { text-align: center; color: #0ea5e9; }
 //           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
 //           th, td { border: 1px solid #ccc; padding: 8px; text-align: center; font-size: 13px; }
 //           th { background: #f3f4f6; }
 //         </style>
 //       </head>
 //       <body>
 //         <h1>📊 تقرير المبيعات</h1>
 //         <table>
 //           <thead>
 //             <tr>
 //               <th>#</th>
 //               <th>رقم الفاتورة</th>
 //               <th>التاريخ</th>
 //               <th>الكاشير</th>
 //               <th>طريقة الدفع</th>
 //               <th>الإجمالي</th>
 //             </tr>
 //           </thead>
 //           <tbody>
 //             ${filteredSales.map((s, i) => `
 //               <tr>
 //                 <td>${i + 1}</td>
 //                 <td>${s.id}</td>
 //                 <td>${s.date}</td>
 //                 <td>${s.cashier}</td>
 //                 <td>${s.payment}</td>
 //                 <td>${s.total.toFixed(2)} ر.س</td>
 //               </tr>`).join('')}
 //           </tbody>
 //         </table>
 //       </body></html>
 //     `)
 //     w.document.close()
 //     w.print()
 //   }
 //   return (
 //     <Layout user={user} title="إدارة المبيعات">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 🧮 بطاقات الملخص */}
 //         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
 //           <SummaryCard title="إجمالي المبيعات" value={`${totalSales.toFixed(2)} ر.س`} color="text-green-600" />
 //           <SummaryCard title="عدد الفواتير" value={invoiceCount} color="text-blue-600" />
 //           <SummaryCard title="عدد المستخدمين" value={cashiers.length - 1} color="text-amber-600" />
 //         </div>
 //         {/* 🔍 أدوات الفلترة */}
 //         <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border rounded-lg shadow-sm">
 //           <div className="flex flex-wrap items-center gap-2">
 //             <input
 //               type="text"
 //               placeholder="🔍 بحث برقم الفاتورة..."
 //               value={search}
 //               onChange={(e) => setSearch(e.target.value)}
 //               className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
 //             />
 //             <input
 //               type="date"
 //               value={dateFilter}
 //               onChange={(e) => setDateFilter(e.target.value)}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             />
 //             <select value={cashierFilter} onChange={(e) => setCashierFilter(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
 //               {cashiers.map((c) => <option key={c}>{c}</option>)}
 //             </select>
 //             <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
 //               {paymentTypes.map((p) => <option key={p}>{p}</option>)}
 //             </select>
 //           </div>
 //           <div className="flex gap-2">
 //             <button onClick={printReport} className="px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50">
 //               🖨️ طباعة التقرير
 //             </button>
 //             <button onClick={() => toast.success('📤 تم تصدير التقرير (Excel قادم لاحقاً)')} className="px-4 py-2 text-sm text-white rounded-md shadow" style={{ background: theme.colors.primary }}>
 //               📤 تصدير
 //             </button>
 //           </div>
 //         </div>
 //         {/* 📋 جدول المبيعات */}
 //         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2 text-center">#</th>
 //                 <th className="px-3 py-2">رقم الفاتورة</th>
 //                 <th className="px-3 py-2">التاريخ</th>
 //                 <th className="px-3 py-2">الكاشير</th>
 //                 <th className="px-3 py-2">طريقة الدفع</th>
 //                 <th className="px-3 py-2">الإجمالي</th>
 //                 <th className="px-3 py-2 text-center">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filteredSales.map((s, i) => (
 //                 <tr key={s.id} className="border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
 //                   <td className="px-3 py-2">{s.id}</td>
 //                   <td className="px-3 py-2">{s.date}</td>
 //                   <td className="px-3 py-2">{s.cashier}</td>
 //                   <td className="px-3 py-2">{s.payment}</td>
 //                   <td className="px-3 py-2 font-semibold text-green-700">{s.total.toFixed(2)} ر.س</td>
 //                   <td className="px-3 py-2 text-center">
 //                     <button onClick={() => setViewSale(s)} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">👁️ عرض</button>
 //                   </td>
 //                 </tr>
 //               ))}
 //             </tbody>
 //           </table>
 //         </div>
 //       </div>
 //       {/* 🧾 نافذة عرض الفاتورة */}
 //       {viewSale && (
 //         <Modal title={`🧾 تفاصيل الفاتورة ${viewSale.id}`} onClose={() => setViewSale(null)}>
 //           <div className="space-y-3 text-sm">
 //             <p><strong>التاريخ:</strong> {viewSale.date}</p>
 //             <p><strong>الكاشير:</strong> {viewSale.cashier}</p>
 //             <p><strong>طريقة الدفع:</strong> {viewSale.payment}</p>
 //             <table className="w-full mt-3 text-sm text-right border border-gray-200">
 //               <thead className="bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-1">المنتج</th>
 //                   <th className="px-3 py-1">الكمية</th>
 //                   <th className="px-3 py-1">السعر</th>
 //                   <th className="px-3 py-1">الإجمالي</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {viewSale.items.map((i, idx) => (
 //                   <tr key={idx} className="border-t">
 //                     <td className="px-3 py-1">{i.name}</td>
 //                     <td className="px-3 py-1">{i.qty}</td>
 //                     <td className="px-3 py-1">{i.price} ر.س</td>
 //                     <td className="px-3 py-1">{(i.qty * i.price).toFixed(2)} ر.س</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //             <div className="pt-3 mt-2 text-sm text-gray-700 border-t">
 //               <p>الخصم: <span className="text-red-600">{viewSale.discount} ر.س</span></p>
 //               <p className="font-semibold text-sky-700">الإجمالي النهائي: {(viewSale.total - viewSale.discount).toFixed(2)} ر.س</p>
 //             </div>
 //             <div className="flex justify-end mt-4">
 //               <button onClick={() => window.print()} className="px-4 py-2 text-sm text-white rounded-md" style={{ background: theme.colors.success }}>
 //                 🖨️ طباعة الفاتورة
 //               </button>
 //             </div>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // // 🔹 بطاقة الملخص
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center transition bg-white border rounded-lg shadow-sm hover:shadow-md">
 //       <p className="text-sm text-gray-500">{title}</p>
 //       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4f200a06._.js.map