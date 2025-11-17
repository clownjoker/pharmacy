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
            }
        ]
    };
    const links = navConfig[role] || [];
    const handleLogout = ()=>{
        localStorage.removeItem("pharmacy_user");
        router.replace("/");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                            className: "text-lg font-bold text-gray-800",
                                            children: "نظام الصيدلية الذكي"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Layout.js",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 -mt-0.5",
                                            children: "Pharmacy Management System"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Layout.js",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Layout.js",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Layout.js",
                            lineNumber: 48,
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
                                    lineNumber: 63,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/Layout.js",
                            lineNumber: 61,
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
                                            lineNumber: 90,
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
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Layout.js",
                                    lineNumber: 88,
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
                                            lineNumber: 106,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            children: "تسجيل الخروج"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Layout.js",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Layout.js",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Layout.js",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Layout.js",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Layout.js",
                lineNumber: 43,
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
                        lineNumber: 115,
                        columnNumber: 11
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/components/Layout.js",
                lineNumber: 113,
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
                lineNumber: 122,
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
                lineNumber: 126,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Layout.js",
        lineNumber: 42,
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
"[project]/mock/data.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// mock/data.js
__turbopack_context__.s([
    "mockInventory",
    ()=>mockInventory,
    "mockMedicines",
    ()=>mockMedicines,
    "mockProfit",
    ()=>mockProfit,
    "mockSales",
    ()=>mockSales,
    "mockUsers",
    ()=>mockUsers
]);
const mockUsers = [
    {
        id: 1,
        name: "أحمد",
        role: "admin",
        username: "admin",
        password: "1234"
    },
    {
        id: 2,
        name: "محمد",
        role: "pharmacist",
        username: "pharma",
        password: "1234"
    },
    {
        id: 3,
        name: "سارة",
        role: "cashier",
        username: "cashier",
        password: "1234"
    }
];
const mockMedicines = [
    {
        id: 1,
        name: "باراسيتامول",
        qty: 120,
        price: 8,
        category: "مسكنات"
    },
    {
        id: 2,
        name: "أموكسيسلين",
        qty: 45,
        price: 18,
        category: "مضادات حيوية"
    },
    {
        id: 3,
        name: "بنادول اكسترا",
        qty: 80,
        price: 12,
        category: "مسكنات"
    }
];
const mockInventory = [
    {
        id: 1,
        name: "شراب حساسية",
        qty: 24,
        cost: 5
    },
    {
        id: 2,
        name: "مرهم حروق",
        qty: 10,
        cost: 7
    }
];
const mockSales = [
    {
        id: 1,
        user: "محمد",
        total: 32,
        items: 3,
        date: "2025-01-05"
    },
    {
        id: 2,
        user: "سارة",
        total: 18,
        items: 1,
        date: "2025-01-05"
    }
];
const mockProfit = [
    {
        month: "يناير",
        total: 3200,
        profit: 1200,
        growth: 15,
        user: "أحمد"
    },
    {
        month: "فبراير",
        total: 4100,
        profit: 1500,
        growth: 25,
        user: "محمد"
    },
    {
        month: "مارس",
        total: 3800,
        profit: 1400,
        growth: 10,
        user: "مها"
    }
];
}),
"[project]/pages/cashier.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CashierPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Layout.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mock$2f$data$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mock/data.js [ssr] (ecmascript)");
;
;
;
;
function CashierPage() {
    const [user] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: "سارة",
        role: "cashier"
    });
    const [products] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$mock$2f$data$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["mockMedicines"]);
    const [cart, setCart] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const addToCart = (item)=>{
        setCart([
            ...cart,
            item
        ]);
    };
    const removeItem = (index)=>{
        const updated = [
            ...cart
        ];
        updated.splice(index, 1);
        setCart(updated);
    };
    const total = cart.reduce((sum, item)=>sum + item.price, 0);
    const filtered = products.filter((p)=>p.name.includes(search) || p.category.includes(search));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        user: user,
        title: "🧾 نقطة البيع",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            dir: "rtl",
            className: "grid grid-cols-1 gap-6 md:grid-cols-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "🔍 بحث عن منتج",
                            value: search,
                            onChange: (e)=>setSearch(e.target.value),
                            className: "w-full px-3 py-2 mb-4 border rounded-md"
                        }, void 0, false, {
                            fileName: "[project]/pages/cashier.js",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-white border rounded-lg shadow-sm overflow-auto max-h-[500px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                className: "w-full text-sm text-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                        className: "text-gray-600 bg-gray-50",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2",
                                                    children: "الاسم"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 48,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2",
                                                    children: "السعر"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 49,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2",
                                                    children: "إضافة"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 50,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/cashier.js",
                                            lineNumber: 47,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 46,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                        children: filtered.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                className: "border-t hover:bg-gray-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2",
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/cashier.js",
                                                        lineNumber: 57,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2",
                                                        children: [
                                                            item.price,
                                                            " ر.س"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/cashier.js",
                                                        lineNumber: 58,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>addToCart(item),
                                                            className: "px-3 py-1 text-white rounded-md bg-sky-600 hover:bg-sky-700",
                                                            children: "➕"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/cashier.js",
                                                            lineNumber: 60,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/cashier.js",
                                                        lineNumber: 59,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item.id, true, {
                                                fileName: "[project]/pages/cashier.js",
                                                lineNumber: 56,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/cashier.js",
                                lineNumber: 45,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/cashier.js",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/cashier.js",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-4 bg-white border rounded-lg shadow-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                            className: "mb-4 text-lg font-semibold",
                            children: "🛒 السلة"
                        }, void 0, false, {
                            fileName: "[project]/pages/cashier.js",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this),
                        cart.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-gray-500",
                            children: "لا توجد عناصر مضافة"
                        }, void 0, false, {
                            fileName: "[project]/pages/cashier.js",
                            lineNumber: 80,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            className: "w-full text-sm text-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    className: "bg-gray-50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2",
                                                children: "الصنف"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/cashier.js",
                                                lineNumber: 85,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2",
                                                children: "السعر"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/cashier.js",
                                                lineNumber: 86,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2",
                                                children: "حذف"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/cashier.js",
                                                lineNumber: 87,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 84,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/cashier.js",
                                    lineNumber: 83,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    children: cart.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            className: "border-t hover:bg-gray-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: item.name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 93,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: [
                                                        item.price,
                                                        " ر.س"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 94,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>removeItem(index),
                                                        className: "px-3 py-1 text-red-600 rounded-md hover:bg-red-50",
                                                        children: "🗑️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/cashier.js",
                                                        lineNumber: 96,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 95,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/pages/cashier.js",
                                            lineNumber: 92,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/pages/cashier.js",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/cashier.js",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex justify-between pt-3 mt-4 text-lg font-semibold border-t",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    children: "الإجمالي:"
                                }, void 0, false, {
                                    fileName: "[project]/pages/cashier.js",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    children: [
                                        total,
                                        " ر.س"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/cashier.js",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/cashier.js",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>alert("✔️ تمت عملية البيع (Mock فقط)"),
                            className: "w-full py-2 mt-4 text-white bg-green-600 rounded-md hover:bg-green-700",
                            children: "✔️ تأكيد البيع"
                        }, void 0, false, {
                            fileName: "[project]/pages/cashier.js",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/cashier.js",
                    lineNumber: 76,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/cashier.js",
            lineNumber: 32,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/cashier.js",
        lineNumber: 31,
        columnNumber: 5
    }, this);
} // // شغال و معتمد + تحسين قراءة الكاشير من التخزين بدون تغيير التصميم
 // import { useState, useEffect, useRef } from 'react'
 // import { useRouter } from 'next/router'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // const API_BASE = 'http://localhost:5000/api'
 // export default function Cashier() {
 //   const router = useRouter()
 //   // 🔐 المستخدم الحالي (من التخزين)
 //   const [user, setUser] = useState({ name: 'كاشير', role: 'cashier' })
 //   const [cashierId, setCashierId] = useState(null)
 //   // 🧾 حالة الكاشير
 //   const [products, setProducts] = useState([])
 //   const [cart, setCart] = useState([])
 //   const [productId, setProductId] = useState('')
 //   const [quantity, setQuantity] = useState(1)
 //   const [discount, setDiscount] = useState(0)
 //   const [showShiftReport, setShowShiftReport] = useState(false)
 //   const [sales, setSales] = useState([])
 //   const [shiftStart, setShiftStart] = useState(new Date())
 //   // 💸 فاتورة آخر عملية بيع
 //   const [lastInvoice, setLastInvoice] = useState(null)
 //   const [showInvoiceModal, setShowInvoiceModal] = useState(false)
 //   const printRef = useRef(null)
 //   // 🔐 حماية الصفحة + تحميل بيانات المستخدم
 //   useEffect(() => {
 //     const token = typeof window !== 'undefined'
 //       ? localStorage.getItem('pharmacy_token')
 //       : null
 //     const u = typeof window !== 'undefined'
 //       ? localStorage.getItem('pharmacy_user')
 //       : null
 //     if (!token || !u) {
 //       router.replace('/')
 //       return
 //     }
 //     try {
 //       const parsed = JSON.parse(u)
 //       setUser(parsed)
 //       // 👇 محاولة ذكية لاستخراج id من أكثر من احتمال
 //       let idCandidate =
 //         parsed.id ??
 //         parsed.user_id ??
 //         parsed.userId ??
 //         parsed.uid ??
 //         (parsed.user && (parsed.user.id || parsed.user.user_id))
 //       if (idCandidate) {
 //         // نحوله لرقم لو أمكن
 //         const numericId = Number(idCandidate)
 //         setCashierId(Number.isNaN(numericId) ? idCandidate : numericId)
 //       } else {
 //         console.warn('لم يتم العثور على id داخل كائن المستخدم المخزن في localStorage', parsed)
 //       }
 //     } catch (e) {
 //       console.error('Invalid user in localStorage', e)
 //       router.replace('/')
 //     }
 //   }, [router])
 //   // 📦 تحميل المنتجات من الباك إند
 //   useEffect(() => {
 //     const loadProducts = async () => {
 //       try {
 //         const res = await fetch(`${API_BASE}/products`)
 //         const data = await res.json()
 //         if (!res.ok) throw new Error(data.message || 'فشل تحميل المنتجات')
 //         // تأكد أنه array
 //         setProducts(Array.isArray(data) ? data : [])
 //       } catch (err) {
 //         console.error(err)
 //         toast.error('⚠️ فشل الاتصال بالسيرفر لجلب المنتجات')
 //       }
 //     }
 //     loadProducts()
 //   }, [])
 //   // ⏱️ بداية الوردية
 //   useEffect(() => {
 //     setShiftStart(new Date())
 //   }, [])
 //   // 🛒 إضافة منتج إلى الفاتورة
 //   const addToCart = () => {
 //     if (!productId) return toast.error('يرجى اختيار منتج')
 //     const selected = products.find((p) => p.id === Number(productId))
 //     if (!selected) return toast.error('المنتج غير موجود')
 //     if (quantity <= 0) return toast.error('الكمية يجب أن تكون 1 أو أكثر')
 //     const existing = cart.find((item) => item.id === selected.id)
 //     if (existing) {
 //       setCart((prev) =>
 //         prev.map((item) =>
 //           item.id === selected.id
 //             ? { ...item, quantity: item.quantity + quantity }
 //             : item
 //         )
 //       )
 //     } else {
 //       setCart((prev) => [
 //         ...prev,
 //         {
 //           id: selected.id,
 //           name: selected.name,
 //           price: Number(selected.price),
 //           quantity,
 //         },
 //       ])
 //     }
 //     setProductId('')
 //     setQuantity(1)
 //     toast.success('✅ تمت الإضافة للفاتورة')
 //   }
 //   // 🗑️ حذف منتج من الفاتورة
 //   const removeItem = (id) => {
 //     setCart((prev) => prev.filter((item) => item.id !== id))
 //     toast.success('تم حذف المنتج من الفاتورة')
 //   }
 //   // 🧮 إجماليات
 //   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
 //   const netTotal = Math.max(0, total - (Number(discount) || 0))
 //   // 💰 إتمام عملية البيع (مع حفظها في قاعدة البيانات + استرجاع الفاتورة)
 //   const completeSale = async () => {
 //     // نتأكد أن عندنا كاشير حقيقي قبل ما نرسل للباك إند
 //     const numericCashierId = Number(cashierId)
 //     if (!numericCashierId || Number.isNaN(numericCashierId)) {
 //       toast.error('لا يوجد كاشير مسجل، أعد الدخول للنظام')
 //       return
 //     }
 //     if (cart.length === 0) return toast.error('لا توجد منتجات في الفاتورة')
 //     try {
 //       const token =
 //         typeof window !== 'undefined'
 //           ? localStorage.getItem('pharmacy_token')
 //           : null
 //       const payload = {
 //         cashier_id: numericCashierId, // 👈 متوافق مع الباك إند
 //         customer: 'عميل نقدي',
 //         payment: 'cash',
 //         discount: Number(discount) || 0,
 //         items: cart.map((item) => ({
 //           product_id: item.id,
 //           qty: item.quantity,
 //         })),
 //       }
 //       const res = await fetch(`${API_BASE}/cashier/sale`, {
 //         method: 'POST',
 //         headers: {
 //           'Content-Type': 'application/json',
 //           Authorization: token ? `Bearer ${token}` : '',
 //         },
 //         body: JSON.stringify(payload),
 //       })
 //       const data = await res.json()
 //       if (!res.ok) {
 //         throw new Error(data.message || 'فشل حفظ عملية البيع')
 //       }
 //       // ✅ تحديث ملخص الوردية
 //       setSales((prev) => [
 //         ...prev,
 //         { id: data.sale.id, total: data.sale.total },
 //       ])
 //       // 🧾 تخزين آخر فاتورة لعرضها وطباعتها
 //       setLastInvoice(data.sale)
 //       setShowInvoiceModal(true)
 //       // 🧹 تصفير الفاتورة
 //       setCart([])
 //       setDiscount(0)
 //       toast.success('✅ تمت عملية البيع بنجاح')
 //     } catch (err) {
 //       console.error(err)
 //       toast.error(err.message || 'حدث خطأ أثناء عملية البيع')
 //     }
 //   }
 //   // 📊 ملخص الوردية
 //   const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0)
 //   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0
 //   // 🧾 إغلاق الوردية
 //   const closeShift = () => {
 //     if (sales.length === 0) {
 //       toast('لا توجد مبيعات في هذه الوردية', { icon: 'ℹ️' })
 //       return
 //     }
 //     setShowShiftReport(true)
 //   }
 //   // 🖨️ طباعة تقرير الوردية
 //   const handlePrintShiftReport = () => {
 //     const w = window.open('', '', 'width=800,height=600')
 //     w.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير نهاية الوردية</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
 //             h2 { color: ${theme.colors.primary}; text-align: center; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
 //             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
 //             th { background: #f3f4f6; }
 //           </style>
 //         </head>
 //         <body>${printRef.current.innerHTML}</body>
 //       </html>
 //     `)
 //     w.document.close()
 //     w.focus()
 //     w.print()
 //     w.close()
 //   }
 //   // 🖨️ طباعة الفاتورة الأخيرة
 //   const handlePrintInvoice = () => {
 //     if (!lastInvoice) return
 //     const items = Array.isArray(lastInvoice.items) ? lastInvoice.items : []
 //     const html = `
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <meta charset="utf-8" />
 //           <title>فاتورة ${lastInvoice.invoice_code}</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
 //             h2 { color: ${theme.colors.primary}; text-align: center; margin-bottom: 10px; }
 //             p { margin: 4px 0; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
 //             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; font-size: 13px; }
 //             th { background: #f3f4f6; }
 //             .total { margin-top: 10px; text-align: left; font-weight: bold; }
 //           </style>
 //         </head>
 //         <body>
 //           <h2>صيدلية المعلم</h2>
 //           <p>فاتورة رقم: <strong>${lastInvoice.invoice_code}</strong></p>
 //           <p>التاريخ: ${new Date(lastInvoice.date).toLocaleString('ar-EG')}</p>
 //           <p>العميل: ${lastInvoice.customer}</p>
 //           <p>الكاشير: ${lastInvoice.cashier_name || ''}</p>
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
 //               ${items
 //                 .map(
 //                   (it, i) =>
 //                     `<tr>
 //                       <td>${i + 1}</td>
 //                       <td>${it.name}</td>
 //                       <td>${it.qty}</td>
 //                       <td>${it.price}</td>
 //                       <td>${it.qty * it.price}</td>
 //                     </tr>`
 //                 )
 //                 .join('')}
 //             </tbody>
 //           </table>
 //           <p class="total">الإجمالي: ${lastInvoice.total} ر.س</p>
 //         </body>
 //       </html>
 //     `
 //     const w = window.open('', '_blank', 'width=800,height=700')
 //     w.document.open()
 //     w.document.write(html)
 //     w.document.close()
 //     w.focus()
 //     w.print()
 //     w.close()
 //   }
 //   return (
 //     <Layout user={user} title="نقطة البيع (الكاشير)">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 💼 ملخص الوردية */}
 //         <div className="p-4 card bg-gradient-to-r from-sky-50 to-blue-50">
 //           <div className="flex items-center justify-between">
 //             <h2 className="text-lg font-semibold text-gray-700">
 //               💼 ملخص الوردية الحالية
 //             </h2>
 //             <div className="flex gap-2">
 //               <button onClick={closeShift} className="btn btn-primary">
 //                 🧾 إغلاق الوردية
 //               </button>
 //             </div>
 //           </div>
 //           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
 //             <div>
 //               <p className="text-gray-500">الكاشير</p>
 //               <p className="font-medium text-gray-900">
 //                 {user?.name || '—'}
 //               </p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">وقت البدء</p>
 //               <p className="font-medium text-gray-900">
 //                 {shiftStart.toLocaleTimeString('ar-SA')}
 //               </p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">عدد الفواتير</p>
 //               <p className="font-medium text-gray-900">
 //                 {sales.length}
 //               </p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">إجمالي المبيعات</p>
 //               <p className="font-medium text-green-700">
 //                 {totalSales} ر.س
 //               </p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">متوسط الفاتورة</p>
 //               <p className="font-medium text-blue-700">
 //                 {avgSale} ر.س
 //               </p>
 //             </div>
 //           </div>
 //         </div>
 //         {/* 🧾 الفاتورة + إضافة منتجات */}
 //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
 //           {/* جدول الفاتورة */}
 //           <div className="p-5 card lg:col-span-2">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">
 //               المنتجات المضافة
 //             </h2>
 //             <table className="w-full text-sm text-right border-t border-gray-100">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">المنتج</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                   <th />
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {cart.length > 0 ? (
 //                   cart.map((item, i) => (
 //                     <tr key={i} className="border-t hover:bg-gray-50">
 //                       <td className="px-3 py-2">{item.name}</td>
 //                       <td className="px-3 py-2">{item.quantity}</td>
 //                       <td className="px-3 py-2">
 //                         {item.price} ر.س
 //                       </td>
 //                       <td className="px-3 py-2 font-semibold text-sky-700">
 //                         {item.price * item.quantity} ر.س
 //                       </td>
 //                       <td
 //                         className="px-3 py-2 text-red-500 cursor-pointer"
 //                         onClick={() => removeItem(item.id)}
 //                       >
 //                         ✕
 //                       </td>
 //                     </tr>
 //                   ))
 //                 ) : (
 //                   <tr>
 //                     <td
 //                       colSpan="5"
 //                       className="py-4 text-center text-gray-500"
 //                     >
 //                       لا توجد منتجات مضافة بعد
 //                     </td>
 //                   </tr>
 //                 )}
 //               </tbody>
 //             </table>
 //           </div>
 //           {/* فورم إضافة منتج */}
 //           <div className="p-5 card">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">
 //               إضافة منتج
 //             </h2>
 //             <label className="block mb-2 text-sm text-gray-700">
 //               اختر المنتج
 //             </label>
 //             <select
 //               value={productId}
 //               onChange={(e) => setProductId(e.target.value)}
 //               className="mb-3 select"
 //             >
 //               <option value="">اختر...</option>
 //               {products.map((p) => (
 //                 <option key={p.id} value={p.id}>
 //                   {p.name} — {p.price} ر.س
 //                 </option>
 //               ))}
 //             </select>
 //             <label className="block mb-2 text-sm text-gray-700">
 //               الكمية
 //             </label>
 //             <input
 //               type="number"
 //               min="1"
 //               value={quantity}
 //               onChange={(e) =>
 //                 setQuantity(Number(e.target.value) || 1)
 //               }
 //               className="mb-3 input"
 //             />
 //             <button
 //               onClick={addToCart}
 //               className="w-full mb-3 btn btn-primary"
 //             >
 //               ➕ إضافة للفاتورة
 //             </button>
 //             <label className="block mb-2 text-sm text-gray-700">
 //               خصم
 //             </label>
 //             <input
 //               type="number"
 //               min="0"
 //               value={discount}
 //               onChange={(e) =>
 //                 setDiscount(Number(e.target.value) || 0)
 //               }
 //               className="mb-3 input"
 //             />
 //             <div className="pt-3 text-sm text-gray-600 border-t">
 //               <p>
 //                 الإجمالي:{' '}
 //                 <span className="font-bold text-gray-900">
 //                   {total} ر.س
 //                 </span>
 //               </p>
 //               <p>
 //                 الخصم:{' '}
 //                 <span className="text-red-600">
 //                   {Number(discount) || 0} ر.س
 //                 </span>
 //               </p>
 //               <p className="mt-1 text-lg font-semibold text-sky-700">
 //                 الإجمالي النهائي: {netTotal} ر.س
 //               </p>
 //             </div>
 //             <button
 //               onClick={completeSale}
 //               className="w-full mt-4 btn btn-secondary"
 //             >
 //               💰 إتمام البيع
 //             </button>
 //           </div>
 //         </div>
 //       </div>
 //       {/* 📊 مودال تقرير الوردية */}
 //       {showShiftReport && (
 //         <Modal
 //           title="تقرير نهاية الوردية"
 //           onClose={() => setShowShiftReport(false)}
 //         >
 //           <div
 //             ref={printRef}
 //             className="space-y-2 text-sm text-right"
 //           >
 //             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
 //               📊 تقرير الوردية الحالية
 //             </h3>
 //             <p>
 //               <strong>الكاشير:</strong>{' '}
 //               {user?.name || '—'}
 //             </p>
 //             <p>
 //               <strong>بداية الوردية:</strong>{' '}
 //               {shiftStart.toLocaleTimeString('ar-SA')}
 //             </p>
 //             <p>
 //               <strong>نهاية الوردية:</strong>{' '}
 //               {new Date().toLocaleTimeString('ar-SA')}
 //             </p>
 //             <p>
 //               <strong>عدد الفواتير:</strong>{' '}
 //               {sales.length}
 //             </p>
 //             <p>
 //               <strong>إجمالي المبيعات:</strong>{' '}
 //               {totalSales} ر.س
 //             </p>
 //             <p>
 //               <strong>متوسط الفاتورة:</strong>{' '}
 //               {avgSale} ر.س
 //             </p>
 //           </div>
 //           <div className="flex justify-end gap-3 mt-5">
 //             <button
 //               onClick={handlePrintShiftReport}
 //               className="btn btn-secondary"
 //             >
 //               🖨️ طباعة
 //             </button>
 //             <button
 //               onClick={() => setShowShiftReport(false)}
 //               className="btn btn-ghost"
 //             >
 //               إغلاق
 //             </button>
 //           </div>
 //         </Modal>
 //       )}
 //       {/* 🧾 مودال فاتورة آخر عملية بيع */}
 //       {showInvoiceModal && lastInvoice && (
 //         <Modal
 //           title={`فاتورة رقم ${lastInvoice.invoice_code}`}
 //           onClose={() => setShowInvoiceModal(false)}
 //         >
 //           <div className="space-y-2 text-sm text-right">
 //             <p>
 //               <strong>العميل:</strong>{' '}
 //               {lastInvoice.customer}
 //             </p>
 //             <p>
 //               <strong>الكاشير:</strong>{' '}
 //               {lastInvoice.cashier_name || '—'}
 //             </p>
 //             <p>
 //               <strong>التاريخ:</strong>{' '}
 //               {new Date(
 //                 lastInvoice.date
 //               ).toLocaleString('ar-EG')}
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
 //                 {Array.isArray(lastInvoice.items) &&
 //                   lastInvoice.items.map((it, i) => (
 //                     <tr key={i}>
 //                       <td>{i + 1}</td>
 //                       <td>{it.name}</td>
 //                       <td>{it.qty}</td>
 //                       <td>{it.price}</td>
 //                       <td>{it.qty * it.price}</td>
 //                     </tr>
 //                   ))}
 //               </tbody>
 //             </table>
 //             <div className="mt-2 font-semibold text-right text-emerald-700">
 //               الإجمالي النهائي: {lastInvoice.total} ر.س
 //             </div>
 //           </div>
 //           <div className="flex justify-end gap-3 mt-4">
 //             <button
 //               onClick={handlePrintInvoice}
 //               className="btn btn-secondary"
 //             >
 //               🖨️ طباعة الفاتورة
 //             </button>
 //             <button
 //               onClick={() => setShowInvoiceModal(false)}
 //               className="btn btn-ghost"
 //             >
 //               إغلاق
 //             </button>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // // شغال و معتمد
 // import { useState, useEffect, useRef } from 'react'
 // import { useRouter } from 'next/router'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // const API_BASE = 'http://localhost:5000/api'
 // export default function Cashier() {
 //   const router = useRouter()
 //   // 🔐 المستخدم الحالي (من التخزين)
 //   const [user, setUser] = useState({ name: 'كاشير', role: 'cashier' })
 //   const [cashierId, setCashierId] = useState(null)
 //   // 🧾 حالة الكاشير
 //   const [products, setProducts] = useState([])
 //   const [cart, setCart] = useState([])
 //   const [productId, setProductId] = useState('')
 //   const [quantity, setQuantity] = useState(1)
 //   const [discount, setDiscount] = useState(0)
 //   const [showShiftReport, setShowShiftReport] = useState(false)
 //   const [sales, setSales] = useState([])
 //   const [shiftStart, setShiftStart] = useState(new Date())
 //   // 💸 فاتورة آخر عملية بيع
 //   const [lastInvoice, setLastInvoice] = useState(null)
 //   const [showInvoiceModal, setShowInvoiceModal] = useState(false)
 //   const printRef = useRef(null)
 //   // 🔐 حماية الصفحة + تحميل بيانات المستخدم
 //   useEffect(() => {
 //     const token = localStorage.getItem('pharmacy_token')
 //     const u = localStorage.getItem('pharmacy_user')
 //     if (!token || !u) {
 //       router.replace('/')
 //       return
 //     }
 //     try {
 //       const parsed = JSON.parse(u)
 //       setUser(parsed)
 //       setCashierId(parsed.id)
 //     } catch (e) {
 //       console.error('Invalid user in localStorage')
 //       router.replace('/')
 //     }
 //   }, [router])
 //   // 📦 تحميل المنتجات من الباك إند
 //   useEffect(() => {
 //     const loadProducts = async () => {
 //       try {
 //         const res = await fetch(`${API_BASE}/products`);
 //         const data = await res.json()
 //         if (!res.ok) throw new Error(data.message || 'فشل تحميل المنتجات')
 //         setProducts(Array.isArray(data) ? data : [])
 //       } catch (err) {
 //         console.error(err)
 //         toast.error('⚠️ فشل الاتصال بالسيرفر لجلب المنتجات')
 //       }
 //     }
 //     loadProducts()
 //   }, [])
 //   // ⏱️ بداية الوردية
 //   useEffect(() => {
 //     setShiftStart(new Date())
 //   }, [])
 //   // 🛒 إضافة منتج إلى الفاتورة
 //   const addToCart = () => {
 //     if (!productId) return toast.error('يرجى اختيار منتج')
 //     const selected = products.find((p) => p.id === Number(productId))
 //     if (!selected) return toast.error('المنتج غير موجود')
 //     if (quantity <= 0) return toast.error('الكمية يجب أن تكون 1 أو أكثر')
 //     const existing = cart.find((item) => item.id === selected.id)
 //     if (existing) {
 //       setCart((prev) =>
 //         prev.map((item) =>
 //           item.id === selected.id
 //             ? { ...item, quantity: item.quantity + quantity }
 //             : item
 //         )
 //       )
 //     } else {
 //       setCart((prev) => [
 //         ...prev,
 //         { id: selected.id, name: selected.name, price: Number(selected.price), quantity },
 //       ])
 //     }
 //     setProductId('')
 //     setQuantity(1)
 //     toast.success('✅ تمت الإضافة للفاتورة')
 //   }
 //   // 🗑️ حذف منتج من الفاتورة
 //   const removeItem = (id) => {
 //     setCart((prev) => prev.filter((item) => item.id !== id))
 //     toast.success('تم حذف المنتج من الفاتورة')
 //   }
 //   // 🧮 إجماليات
 //   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
 //   const netTotal = Math.max(0, total - (Number(discount) || 0))
 //   // 💰 إتمام عملية البيع (مع حفظها في قاعدة البيانات + استرجاع الفاتورة)
 //   const completeSale = async () => {
 //     if (!cashierId) return toast.error('لا يوجد كاشير مسجل، أعد الدخول للنظام')
 //     if (cart.length === 0) return toast.error('لا توجد منتجات في الفاتورة')
 //     try {
 //       const token = localStorage.getItem('pharmacy_token')
 //       const payload = {
 //         cashier_id: cashierId,
 //         customer: 'عميل نقدي',
 //         payment: 'cash',
 //         discount: Number(discount) || 0,
 //         items: cart.map((item) => ({
 //           product_id: item.id,
 //           qty: item.quantity,
 //         })),
 //       }
 //       const res = await fetch(`${API_BASE}/cashier/sale`, {
 //         method: 'POST',
 //         headers: {
 //           'Content-Type': 'application/json',
 //           Authorization: token ? `Bearer ${token}` : '',
 //         },
 //         body: JSON.stringify(payload),
 //       })
 //       const data = await res.json()
 //       if (!res.ok) throw new Error(data.message || 'فشل حفظ عملية البيع')
 //       // ✅ تحديث ملخص الوردية
 //       setSales((prev) => [
 //         ...prev,
 //         { id: data.sale.id, total: data.sale.total },
 //       ])
 //       // 🧾 تخزين آخر فاتورة لعرضها وطباعتها
 //       setLastInvoice(data.sale)
 //       setShowInvoiceModal(true)
 //       // 🧹 تصفير الفاتورة
 //       setCart([])
 //       setDiscount(0)
 //       toast.success('✅ تمت عملية البيع بنجاح')
 //     } catch (err) {
 //       console.error(err)
 //       toast.error(err.message || 'حدث خطأ أثناء عملية البيع')
 //     }
 //   }
 //   // 📊 ملخص الوردية
 //   const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0)
 //   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0
 //   // 🧾 إغلاق الوردية
 //   const closeShift = () => {
 //     if (sales.length === 0) {
 //       toast('لا توجد مبيعات في هذه الوردية', { icon: 'ℹ️' })
 //       return
 //     }
 //     setShowShiftReport(true)
 //   }
 //   // 🖨️ طباعة تقرير الوردية
 //   const handlePrintShiftReport = () => {
 //     const w = window.open('', '', 'width=800,height=600')
 //     w.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير نهاية الوردية</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
 //             h2 { color: ${theme.colors.primary}; text-align: center; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
 //             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
 //             th { background: #f3f4f6; }
 //           </style>
 //         </head>
 //         <body>${printRef.current.innerHTML}</body>
 //       </html>
 //     `)
 //     w.document.close()
 //     w.focus()
 //     w.print()
 //     w.close()
 //   }
 //   // 🖨️ طباعة الفاتورة الأخيرة
 //   const handlePrintInvoice = () => {
 //     if (!lastInvoice) return
 //     const html = `
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <meta charset="utf-8" />
 //           <title>فاتورة ${lastInvoice.invoice_code}</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
 //             h2 { color: ${theme.colors.primary}; text-align: center; margin-bottom: 10px; }
 //             p { margin: 4px 0; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
 //             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; font-size: 13px; }
 //             th { background: #f3f4f6; }
 //             .total { margin-top: 10px; text-align: left; font-weight: bold; }
 //           </style>
 //         </head>
 //         <body>
 //           <h2>صيدلية المعلم</h2>
 //           <p>فاتورة رقم: <strong>${lastInvoice.invoice_code}</strong></p>
 //           <p>التاريخ: ${new Date(lastInvoice.date).toLocaleString('ar-EG')}</p>
 //           <p>العميل: ${lastInvoice.customer}</p>
 //           <p>الكاشير: ${lastInvoice.cashier_name || ''}</p>
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
 //               ${lastInvoice.items
 //                 .map(
 //                   (it, i) =>
 //                     `<tr>
 //                       <td>${i + 1}</td>
 //                       <td>${it.name}</td>
 //                       <td>${it.qty}</td>
 //                       <td>${it.price}</td>
 //                       <td>${it.qty * it.price}</td>
 //                     </tr>`
 //                 )
 //                 .join('')}
 //             </tbody>
 //           </table>
 //           <p class="total">الإجمالي: ${lastInvoice.total} ر.س</p>
 //         </body>
 //       </html>
 //     `
 //     const w = window.open('', '_blank', 'width=800,height=700')
 //     w.document.open()
 //     w.document.write(html)
 //     w.document.close()
 //     w.focus()
 //     w.print()
 //     w.close()
 //   }
 //   return (
 //     <Layout user={user} title="نقطة البيع (الكاشير)">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 💼 ملخص الوردية */}
 //         <div className="p-4 card bg-gradient-to-r from-sky-50 to-blue-50">
 //           <div className="flex items-center justify-between">
 //             <h2 className="text-lg font-semibold text-gray-700">💼 ملخص الوردية الحالية</h2>
 //             <div className="flex gap-2">
 //               <button onClick={closeShift} className="btn btn-primary">
 //                 🧾 إغلاق الوردية
 //               </button>
 //             </div>
 //           </div>
 //           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
 //             <div>
 //               <p className="text-gray-500">الكاشير</p>
 //               <p className="font-medium text-gray-900">{user?.name || '—'}</p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">وقت البدء</p>
 //               <p className="font-medium text-gray-900">
 //                 {shiftStart.toLocaleTimeString('ar-SA')}
 //               </p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">عدد الفواتير</p>
 //               <p className="font-medium text-gray-900">{sales.length}</p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">إجمالي المبيعات</p>
 //               <p className="font-medium text-green-700">{totalSales} ر.س</p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">متوسط الفاتورة</p>
 //               <p className="font-medium text-blue-700">{avgSale} ر.س</p>
 //             </div>
 //           </div>
 //         </div>
 //         {/* 🧾 الفاتورة + إضافة منتجات */}
 //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
 //           {/* جدول الفاتورة */}
 //           <div className="p-5 card lg:col-span-2">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
 //             <table className="w-full text-sm text-right border-t border-gray-100">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">المنتج</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                   <th />
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {cart.length > 0 ? (
 //                   cart.map((item, i) => (
 //                     <tr key={i} className="border-t hover:bg-gray-50">
 //                       <td className="px-3 py-2">{item.name}</td>
 //                       <td className="px-3 py-2">{item.quantity}</td>
 //                       <td className="px-3 py-2">{item.price} ر.س</td>
 //                       <td className="px-3 py-2 font-semibold text-sky-700">
 //                         {item.price * item.quantity} ر.س
 //                       </td>
 //                       <td
 //                         className="px-3 py-2 text-red-500 cursor-pointer"
 //                         onClick={() => removeItem(item.id)}
 //                       >
 //                         ✕
 //                       </td>
 //                     </tr>
 //                   ))
 //                 ) : (
 //                   <tr>
 //                     <td colSpan="5" className="py-4 text-center text-gray-500">
 //                       لا توجد منتجات مضافة بعد
 //                     </td>
 //                   </tr>
 //                 )}
 //               </tbody>
 //             </table>
 //           </div>
 //           {/* فورم إضافة منتج */}
 //           <div className="p-5 card">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>
 //             <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
 //             <select
 //               value={productId}
 //               onChange={(e) => setProductId(e.target.value)}
 //               className="mb-3 select"
 //             >
 //               <option value="">اختر...</option>
 //               {products.map((p) => (
 //                 <option key={p.id} value={p.id}>
 //                   {p.name} — {p.price} ر.س
 //                 </option>
 //               ))}
 //             </select>
 //             <label className="block mb-2 text-sm text-gray-700">الكمية</label>
 //             <input
 //               type="number"
 //               min="1"
 //               value={quantity}
 //               onChange={(e) => setQuantity(Number(e.target.value) || 1)}
 //               className="mb-3 input"
 //             />
 //             <button onClick={addToCart} className="w-full mb-3 btn btn-primary">
 //               ➕ إضافة للفاتورة
 //             </button>
 //             <label className="block mb-2 text-sm text-gray-700">خصم</label>
 //             <input
 //               type="number"
 //               min="0"
 //               value={discount}
 //               onChange={(e) => setDiscount(Number(e.target.value) || 0)}
 //               className="mb-3 input"
 //             />
 //             <div className="pt-3 text-sm text-gray-600 border-t">
 //               <p>
 //                 الإجمالي:{' '}
 //                 <span className="font-bold text-gray-900">{total} ر.س</span>
 //               </p>
 //               <p>
 //                 الخصم:{' '}
 //                 <span className="text-red-600">
 //                   {Number(discount) || 0} ر.س
 //                 </span>
 //               </p>
 //               <p className="mt-1 text-lg font-semibold text-sky-700">
 //                 الإجمالي النهائي: {netTotal} ر.س
 //               </p>
 //             </div>
 //             <button
 //               onClick={completeSale}
 //               className="w-full mt-4 btn btn-secondary"
 //             >
 //               💰 إتمام البيع
 //             </button>
 //           </div>
 //         </div>
 //       </div>
 //       {/* 📊 مودال تقرير الوردية */}
 //       {showShiftReport && (
 //         <Modal title="تقرير نهاية الوردية" onClose={() => setShowShiftReport(false)}>
 //           <div ref={printRef} className="space-y-2 text-sm text-right">
 //             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
 //               📊 تقرير الوردية الحالية
 //             </h3>
 //             <p>
 //               <strong>الكاشير:</strong> {user?.name || '—'}
 //             </p>
 //             <p>
 //               <strong>بداية الوردية:</strong>{' '}
 //               {shiftStart.toLocaleTimeString('ar-SA')}
 //             </p>
 //             <p>
 //               <strong>نهاية الوردية:</strong>{' '}
 //               {new Date().toLocaleTimeString('ar-SA')}
 //             </p>
 //             <p>
 //               <strong>عدد الفواتير:</strong> {sales.length}
 //             </p>
 //             <p>
 //               <strong>إجمالي المبيعات:</strong> {totalSales} ر.س
 //             </p>
 //             <p>
 //               <strong>متوسط الفاتورة:</strong> {avgSale} ر.س
 //             </p>
 //           </div>
 //           <div className="flex justify-end gap-3 mt-5">
 //             <button onClick={handlePrintShiftReport} className="btn btn-secondary">
 //               🖨️ طباعة
 //             </button>
 //             <button onClick={() => setShowShiftReport(false)} className="btn btn-ghost">
 //               إغلاق
 //             </button>
 //           </div>
 //         </Modal>
 //       )}
 //       {/* 🧾 مودال فاتورة آخر عملية بيع */}
 //       {showInvoiceModal && lastInvoice && (
 //         <Modal
 //           title={`فاتورة رقم ${lastInvoice.invoice_code}`}
 //           onClose={() => setShowInvoiceModal(false)}
 //         >
 //           <div className="space-y-2 text-sm text-right">
 //             <p>
 //               <strong>العميل:</strong> {lastInvoice.customer}
 //             </p>
 //             <p>
 //               <strong>الكاشير:</strong> {lastInvoice.cashier_name || '—'}
 //             </p>
 //             <p>
 //               <strong>التاريخ:</strong>{' '}
 //               {new Date(lastInvoice.date).toLocaleString('ar-EG')}
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
 //                 {lastInvoice.items.map((it, i) => (
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
 //               الإجمالي النهائي: {lastInvoice.total} ر.س
 //             </div>
 //           </div>
 //           <div className="flex justify-end gap-3 mt-4">
 //             <button onClick={handlePrintInvoice} className="btn btn-secondary">
 //               🖨️ طباعة الفاتورة
 //             </button>
 //             <button
 //               onClick={() => setShowInvoiceModal(false)}
 //               className="btn btn-ghost"
 //             >
 //               إغلاق
 //             </button>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // // pages/cashier.js
 // import { useState, useEffect, useRef } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // export default function Cashier() {
 //   const [cart, setCart] = useState([])
 //   const [product, setProduct] = useState('')
 //   const [quantity, setQuantity] = useState(1)
 //   const [discount, setDiscount] = useState(0)
 //   const [showShiftReport, setShowShiftReport] = useState(false)
 //   const [sales, setSales] = useState([])
 //   const [shiftStart, setShiftStart] = useState(new Date())
 //   const printRef = useRef(null)
 //   const productsList = [
 //     { id: 1, name: 'باراسيتامول 500mg', price: 15 },
 //     { id: 2, name: 'فيتامين سي 1000mg', price: 25 },
 //     { id: 3, name: 'أموكسيسيلين 250mg', price: 45 },
 //     { id: 4, name: 'ايبوبروفين 400mg', price: 30 },
 //   ]
 //   useEffect(() => {
 //   const token = localStorage.getItem("pharmacy_token")
 //   if (!token) {
 //     router.replace("/")   // redirect to login
 //   }
 // }, [])
 //   useEffect(() => { setShiftStart(new Date()) }, [])
 //   const addToCart = () => {
 //     if (!product) return toast.error('يرجى اختيار منتج')
 //     const selected = productsList.find((p) => p.name === product)
 //     const existing = cart.find((item) => item.name === product)
 //     if (existing) {
 //       setCart(cart.map((item) => item.name === product ? { ...item, quantity: item.quantity + quantity } : item))
 //     } else {
 //       setCart([...cart, { ...selected, quantity }])
 //     }
 //     setProduct(''); setQuantity(1)
 //     toast.success('تمت الإضافة للفاتورة')
 //   }
 //   const removeItem = (name) => {
 //     setCart(cart.filter((item) => item.name !== name))
 //     toast.success('تم حذف المنتج من الفاتورة')
 //   }
 //   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
 //   const netTotal = Math.max(0, total - discount)
 //   const completeSale = () => {
 //     if (cart.length === 0) return toast.error('لا توجد منتجات في الفاتورة')
 //     const newSale = {
 //       id: sales.length + 1,
 //       date: new Date().toLocaleTimeString('ar-SA'),
 //       total: netTotal,
 //       items: [...cart],
 //     }
 //     setSales([...sales, newSale])
 //     setCart([]); setDiscount(0)
 //     toast.success('تمت عملية البيع')
 //   }
 //   const closeShift = () => {
 //     if (sales.length === 0) {
 //       toast('لا توجد مبيعات في هذه الوردية', { icon: 'ℹ️' })
 //       return
 //     }
 //     setShowShiftReport(true)
 //   }
 //   const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
 //   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0
 //   const handlePrintShiftReport = () => {
 //     const w = window.open('', '', 'width=800,height=600')
 //     w.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير نهاية الوردية</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
 //             h2 { color: ${theme.colors.primary}; text-align: center; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
 //             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
 //             th { background: #f3f4f6; }
 //           </style>
 //         </head>
 //         <body>${printRef.current.innerHTML}</body>
 //       </html>
 //     `)
 //     w.document.close(); w.focus(); w.print(); w.close()
 //   }
 //   return (
 //     <Layout user={{ name: 'كاشير أحمد', role: 'cashier' }} title="نقطة البيع (الكاشير)">
 //       <div dir="rtl" className="space-y-6">
 //         {/* ملخص الوردية */}
 //         <div className="p-4 card bg-gradient-to-r from-sky-50 to-blue-50">
 //           <div className="flex items-center justify-between">
 //             <h2 className="text-lg font-semibold text-gray-700">💼 ملخص الوردية الحالية</h2>
 //             <div className="flex gap-2">
 //               <button onClick={closeShift} className="btn btn-primary">🧾 إغلاق الوردية</button>
 //             </div>
 //           </div>
 //           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
 //             <div><p className="text-gray-500">الكاشير</p><p className="font-medium text-gray-900">أحمد</p></div>
 //             <div><p className="text-gray-500">وقت البدء</p><p className="font-medium text-gray-900">{shiftStart.toLocaleTimeString('ar-SA')}</p></div>
 //             <div><p className="text-gray-500">عدد الفواتير</p><p className="font-medium text-gray-900">{sales.length}</p></div>
 //             <div><p className="text-gray-500">إجمالي المبيعات</p><p className="font-medium text-green-700">{totalSales} ر.س</p></div>
 //             <div><p className="text-gray-500">متوسط الفاتورة</p><p className="font-medium text-blue-700">{avgSale} ر.س</p></div>
 //           </div>
 //         </div>
 //         {/* الأقسام */}
 //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
 //           {/* الفاتورة */}
 //           <div className="p-5 card lg:col-span-2">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
 //             <table className="w-full text-sm text-right border-t border-gray-100">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">المنتج</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                   <th />
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {cart.length > 0 ? cart.map((item, i) => (
 //                   <tr key={i} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{item.name}</td>
 //                     <td className="px-3 py-2">{item.quantity}</td>
 //                     <td className="px-3 py-2">{item.price} ر.س</td>
 //                     <td className="px-3 py-2 font-semibold text-sky-700">{item.price * item.quantity} ر.س</td>
 //                     <td className="px-3 py-2 text-red-500 cursor-pointer" onClick={() => removeItem(item.name)}>✕</td>
 //                   </tr>
 //                 )) : (
 //                   <tr><td colSpan="5" className="py-4 text-center text-gray-500">لا توجد منتجات مضافة بعد</td></tr>
 //                 )}
 //               </tbody>
 //             </table>
 //           </div>
 //           {/* إضافة منتج */}
 //           <div className="p-5 card">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>
 //             <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
 //             <select value={product} onChange={(e) => setProduct(e.target.value)} className="mb-3 select">
 //               <option value="">اختر...</option>
 //               {productsList.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
 //             </select>
 //             <label className="block mb-2 text-sm text-gray-700">الكمية</label>
 //             <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="mb-3 input" />
 //             <button onClick={addToCart} className="w-full mb-3 btn btn-primary">➕ إضافة للفاتورة</button>
 //             <label className="block mb-2 text-sm text-gray-700">خصم</label>
 //             <input type="number" min="0" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="mb-3 input" />
 //             <div className="pt-3 text-sm text-gray-600 border-t">
 //               <p>الإجمالي: <span className="font-bold text-gray-900">{total} ر.س</span></p>
 //               <p>الخصم: <span className="text-red-600">{discount} ر.س</span></p>
 //               <p className="mt-1 text-lg font-semibold text-sky-700">الإجمالي النهائي: {netTotal} ر.س</p>
 //             </div>
 //             <button onClick={completeSale} className="w-full mt-4 btn btn-secondary">💰 إتمام البيع</button>
 //           </div>
 //         </div>
 //       </div>
 //       {/* مودال تقرير نهاية الوردية */}
 //       {showShiftReport && (
 //         <Modal title="تقرير نهاية الوردية" onClose={() => setShowShiftReport(false)}>
 //           <div ref={printRef} className="space-y-2 text-sm text-right">
 //             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">📊 تقرير الوردية الحالية</h3>
 //             <p><strong>الكاشير:</strong> أحمد</p>
 //             <p><strong>بداية الوردية:</strong> {shiftStart.toLocaleTimeString('ar-SA')}</p>
 //             <p><strong>نهاية الوردية:</strong> {new Date().toLocaleTimeString('ar-SA')}</p>
 //             <p><strong>عدد الفواتير:</strong> {sales.length}</p>
 //             <p><strong>إجمالي المبيعات:</strong> {totalSales} ر.س</p>
 //             <p><strong>متوسط الفاتورة:</strong> {avgSale} ر.س</p>
 //           </div>
 //           <div className="flex justify-end gap-3 mt-5">
 //             <button onClick={handlePrintShiftReport} className="btn btn-secondary">🖨️ طباعة</button>
 //             <button onClick={() => setShowShiftReport(false)} className="btn btn-ghost">إغلاق</button>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // import { useState, useEffect, useRef } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // export default function Cashier() {
 //   const [cart, setCart] = useState([])
 //   const [product, setProduct] = useState('')
 //   const [quantity, setQuantity] = useState(1)
 //   const [discount, setDiscount] = useState(0)
 //   const [showInvoice, setShowInvoice] = useState(false)
 //   const [showShiftReport, setShowShiftReport] = useState(false)
 //   const [sales, setSales] = useState([])
 //   const [shiftStart, setShiftStart] = useState(new Date())
 //   const printRef = useRef(null)
 //   const productsList = [
 //     { id: 1, name: 'باراسيتامول 500mg', price: 15 },
 //     { id: 2, name: 'فيتامين سي 1000mg', price: 25 },
 //     { id: 3, name: 'أموكسيسيلين 250mg', price: 45 },
 //     { id: 4, name: 'ايبوبروفين 400mg', price: 30 },
 //   ]
 //   useEffect(() => {
 //     setShiftStart(new Date())
 //   }, [])
 //   const addToCart = () => {
 //     if (!product) return toast.error('⚠️ يرجى اختيار منتج')
 //     const selected = productsList.find((p) => p.name === product)
 //     const existing = cart.find((item) => item.name === product)
 //     if (existing) {
 //       setCart(
 //         cart.map((item) =>
 //           item.name === product
 //             ? { ...item, quantity: item.quantity + quantity }
 //             : item
 //         )
 //       )
 //       toast.success('🔁 تم تحديث الكمية في الفاتورة')
 //     } else {
 //       setCart([...cart, { ...selected, quantity }])
 //       toast.success('🧾 تم إضافة المنتج إلى الفاتورة')
 //     }
 //     setProduct('')
 //     setQuantity(1)
 //   }
 //   const removeItem = (name) => {
 //     setCart(cart.filter((item) => item.name !== name))
 //     toast('🗑️ تم حذف المنتج من الفاتورة', { icon: '❌' })
 //   }
 //   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
 //   const netTotal = total - discount
 //   const completeSale = () => {
 //     if (cart.length === 0) return toast.error('⚠️ لا توجد منتجات في الفاتورة')
 //     const newSale = {
 //       id: sales.length + 1,
 //       date: new Date().toLocaleTimeString('ar-SA'),
 //       total: netTotal,
 //       items: [...cart],
 //     }
 //     setSales([...sales, newSale])
 //     setCart([])
 //     setDiscount(0)
 //     setShowInvoice(true)
 //     toast.success('✅ تم إتمام عملية البيع بنجاح')
 //   }
 //   const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
 //   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0
 //   const handlePrintShiftReport = () => {
 //     toast.success('🖨️ جاري تحضير تقرير نهاية الوردية...')
 //     const w = window.open('', '', 'width=800,height=600')
 //     w.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير نهاية الوردية</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
 //             h2 { color: #0ea5e9; text-align: center; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
 //             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
 //             th { background: #f3f4f6; }
 //           </style>
 //         </head>
 //         <body>${printRef.current.innerHTML}</body>
 //       </html>
 //     `)
 //     w.document.close()
 //     w.focus()
 //     w.print()
 //     w.close()
 //   }
 //   return (
 //     <Layout user={{ name: 'الصيدلي محمد', role: 'cashier' }} title="نقطة البيع (الكاشير)">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 💼 ملخص الوردية */}
 //         <div className="p-4 border rounded-lg shadow-sm bg-gradient-to-r from-sky-50 to-blue-50">
 //           <div className="flex items-center justify-between">
 //             <h2 className="text-lg font-semibold text-gray-700">
 //               💼 ملخص الوردية الحالية
 //             </h2>
 //             <button
 //               onClick={() => setShowShiftReport(true)}
 //               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
 //             >
 //               🧾 تقرير نهاية الوردية
 //             </button>
 //           </div>
 //           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
 //             <div>
 //               <p className="text-gray-500">الكاشير</p>
 //               <p className="font-medium text-gray-900">أحمد</p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">وقت البدء</p>
 //               <p className="font-medium text-gray-900">
 //                 {shiftStart.toLocaleTimeString('ar-SA')}
 //               </p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">عدد الفواتير</p>
 //               <p className="font-medium text-gray-900">{sales.length}</p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">إجمالي المبيعات</p>
 //               <p className="font-medium text-green-700">{totalSales} ر.س</p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">متوسط الفاتورة</p>
 //               <p className="font-medium text-blue-700">{avgSale} ر.س</p>
 //             </div>
 //           </div>
 //         </div>
 //         {/* ⚙️ الأقسام */}
 //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
 //           {/* الفاتورة */}
 //           <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
 //             <table className="w-full text-sm text-right border-t border-gray-100">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">المنتج</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                   <th></th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {cart.length > 0 ? (
 //                   cart.map((item, i) => (
 //                     <tr key={i} className="border-t hover:bg-gray-50">
 //                       <td className="px-3 py-2">{item.name}</td>
 //                       <td className="px-3 py-2">{item.quantity}</td>
 //                       <td className="px-3 py-2">{item.price} ر.س</td>
 //                       <td className="px-3 py-2 font-semibold text-sky-700">
 //                         {item.price * item.quantity} ر.س
 //                       </td>
 //                       <td
 //                         className="py-2 text-red-500 cursor-pointer"
 //                         onClick={() => removeItem(item.name)}
 //                       >
 //                         ✕
 //                       </td>
 //                     </tr>
 //                   ))
 //                 ) : (
 //                   <tr>
 //                     <td colSpan="5" className="py-4 text-center text-gray-500">
 //                       لا توجد منتجات مضافة بعد
 //                     </td>
 //                   </tr>
 //                 )}
 //               </tbody>
 //             </table>
 //           </div>
 //           {/* إضافة منتج */}
 //           <div className="p-5 bg-white border rounded-lg shadow-sm">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>
 //             <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
 //             <select
 //               value={product}
 //               onChange={(e) => setProduct(e.target.value)}
 //               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
 //             >
 //               <option value="">اختر...</option>
 //               {productsList.map((p) => (
 //                 <option key={p.id} value={p.name}>
 //                   {p.name}
 //                 </option>
 //               ))}
 //             </select>
 //             <label className="block mb-2 text-sm text-gray-700">الكمية</label>
 //             <input
 //               type="number"
 //               value={quantity}
 //               min="1"
 //               onChange={(e) => setQuantity(Number(e.target.value))}
 //               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
 //             />
 //             <button
 //               onClick={addToCart}
 //               className="w-full py-2 mb-3 text-white rounded-md shadow bg-sky-500 hover:bg-sky-600"
 //             >
 //               ➕ إضافة للفاتورة
 //             </button>
 //             <label className="block mb-2 text-sm text-gray-700">خصم</label>
 //             <input
 //               type="number"
 //               value={discount}
 //               min="0"
 //               onChange={(e) => setDiscount(Number(e.target.value))}
 //               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
 //             />
 //             <div className="pt-3 text-sm text-gray-600 border-t">
 //               <p>
 //                 الإجمالي: <span className="font-bold text-gray-900">{total} ر.س</span>
 //               </p>
 //               <p>
 //                 الخصم: <span className="text-red-600">{discount} ر.س</span>
 //               </p>
 //               <p className="mt-1 text-lg font-semibold text-sky-700">
 //                 الإجمالي النهائي: {netTotal} ر.س
 //               </p>
 //             </div>
 //             <button
 //               onClick={completeSale}
 //               className="w-full mt-4 py-2.5 text-white rounded-md shadow-md bg-green-600 hover:bg-green-700"
 //             >
 //               💰 إتمام البيع وطباعة الفاتورة
 //             </button>
 //           </div>
 //         </div>
 //       </div>
 //       {/* نافذة تقرير نهاية الوردية */}
 //       {showShiftReport && (
 //         <Modal title="تقرير نهاية الوردية" onClose={() => setShowShiftReport(false)}>
 //           <div ref={printRef} className="space-y-2 text-sm text-right">
 //             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
 //               📊 تقرير الوردية الحالية
 //             </h3>
 //             <p><strong>الكاشير:</strong> أحمد</p>
 //             <p><strong>بداية الوردية:</strong> {shiftStart.toLocaleTimeString('ar-SA')}</p>
 //             <p><strong>نهاية الوردية:</strong> {new Date().toLocaleTimeString('ar-SA')}</p>
 //             <p><strong>عدد الفواتير:</strong> {sales.length}</p>
 //             <p><strong>إجمالي المبيعات:</strong> {totalSales} ر.س</p>
 //             <p><strong>متوسط الفاتورة:</strong> {avgSale} ر.س</p>
 //           </div>
 //           <button
 //             onClick={handlePrintShiftReport}
 //             className="w-full py-2 mt-4 text-white bg-green-600 rounded-md hover:bg-green-700"
 //           >
 //             🖨️ طباعة التقرير
 //           </button>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // import { useState, useEffect, useRef } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // export default function Cashier() {
 //   const [cart, setCart] = useState([])
 //   const [product, setProduct] = useState('')
 //   const [quantity, setQuantity] = useState(1)
 //   const [discount, setDiscount] = useState(0)
 //   const [showInvoice, setShowInvoice] = useState(false)
 //   const [showShiftReport, setShowShiftReport] = useState(false)
 //   const [showDailyReport, setShowDailyReport] = useState(false)
 //   const [sales, setSales] = useState([])
 //   const [shiftStart, setShiftStart] = useState(new Date())
 //   const [shiftEnd, setShiftEnd] = useState(null)
 //   const printRef = useRef(null)
 //   const productsList = [
 //     { id: 1, name: 'باراسيتامول 500mg', price: 15 },
 //     { id: 2, name: 'فيتامين سي 1000mg', price: 25 },
 //     { id: 3, name: 'أموكسيسيلين 250mg', price: 45 },
 //     { id: 4, name: 'ايبوبروفين 400mg', price: 30 },
 //   ]
 //   useEffect(() => {
 //     setShiftStart(new Date())
 //   }, [])
 //   const addToCart = () => {
 //     if (!product) return alert('يرجى اختيار منتج')
 //     const selected = productsList.find((p) => p.name === product)
 //     const existing = cart.find((item) => item.name === product)
 //     if (existing) {
 //       setCart(
 //         cart.map((item) =>
 //           item.name === product
 //             ? { ...item, quantity: item.quantity + quantity }
 //             : item
 //         )
 //       )
 //     } else {
 //       setCart([...cart, { ...selected, quantity }])
 //     }
 //     setProduct('')
 //     setQuantity(1)
 //   }
 //   const removeItem = (name) => {
 //     setCart(cart.filter((item) => item.name !== name))
 //   }
 //   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
 //   const netTotal = total - discount
 //   const completeSale = () => {
 //     if (cart.length === 0) return alert('لا توجد منتجات في الفاتورة')
 //     const newSale = {
 //       id: sales.length + 1,
 //       date: new Date().toLocaleTimeString('ar-SA'),
 //       total: netTotal,
 //       items: [...cart],
 //     }
 //     setSales([...sales, newSale])
 //     setCart([])
 //     setDiscount(0)
 //     setShowInvoice(true)
 //   }
 //   const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
 //   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0
 //   const handlePrintShiftReport = () => {
 //     const w = window.open('', '', 'width=800,height=600')
 //     w.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير نهاية الوردية</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
 //             h2 { color: #0ea5e9; text-align: center; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
 //             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
 //             th { background: #f3f4f6; }
 //           </style>
 //         </head>
 //         <body>${printRef.current.innerHTML}</body>
 //       </html>
 //     `)
 //     w.document.close()
 //     w.focus()
 //     w.print()
 //     w.close()
 //   }
 //   const handleCloseShift = () => {
 //     setShiftEnd(new Date())
 //     alert('✅ تم إغلاق الوردية بنجاح!')
 //   }
 //   return (
 //     <Layout user={{ name: 'كاشير أحمد' }} title="نقطة البيع (الكاشير)">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 💼 ملخص الوردية */}
 //         <div className="p-4 border rounded-lg shadow-sm bg-gradient-to-r from-sky-50 to-blue-50">
 //           <div className="flex flex-wrap items-center justify-between gap-3">
 //             <h2 className="text-lg font-semibold text-gray-700">
 //               💼 ملخص الوردية الحالية
 //             </h2>
 //             <div className="flex flex-wrap gap-2">
 //               <button
 //                 onClick={() => setShowDailyReport(true)}
 //                 className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700"
 //               >
 //                 📊 التقرير اليومي
 //               </button>
 //               <button
 //                 onClick={() => setShowShiftReport(true)}
 //                 className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
 //               >
 //                 🧾 تقرير نهاية الوردية
 //               </button>
 //               <button
 //                 onClick={handleCloseShift}
 //                 className="px-4 py-2 text-sm text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700"
 //               >
 //                 🔒 إغلاق الوردية
 //               </button>
 //             </div>
 //           </div>
 //           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
 //             <div>
 //               <p className="text-gray-500">الكاشير</p>
 //               <p className="font-medium text-gray-900">أحمد</p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">وقت البدء</p>
 //               <p className="font-medium text-gray-900">
 //                 {shiftStart.toLocaleTimeString('ar-SA')}
 //               </p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">وقت الإغلاق</p>
 //               <p className="font-medium text-gray-900">
 //                 {shiftEnd ? shiftEnd.toLocaleTimeString('ar-SA') : '—'}
 //               </p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">عدد الفواتير</p>
 //               <p className="font-medium text-gray-900">{sales.length}</p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">إجمالي المبيعات</p>
 //               <p className="font-medium text-green-700">{totalSales} ر.س</p>
 //             </div>
 //           </div>
 //         </div>
 //         {/* ⚙️ الأقسام */}
 //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
 //           {/* الفاتورة */}
 //           <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
 //             <table className="w-full text-sm text-right border-t border-gray-100">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">المنتج</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                   <th></th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {cart.length > 0 ? (
 //                   cart.map((item, i) => (
 //                     <tr key={i} className="border-t hover:bg-gray-50">
 //                       <td className="px-3 py-2">{item.name}</td>
 //                       <td className="px-3 py-2">{item.quantity}</td>
 //                       <td className="px-3 py-2">{item.price} ر.س</td>
 //                       <td className="px-3 py-2 font-semibold text-sky-700">
 //                         {item.price * item.quantity} ر.س
 //                       </td>
 //                       <td
 //                         className="py-2 text-red-500 cursor-pointer"
 //                         onClick={() => removeItem(item.name)}
 //                       >
 //                         ✕
 //                       </td>
 //                     </tr>
 //                   ))
 //                 ) : (
 //                   <tr>
 //                     <td colSpan="5" className="py-4 text-center text-gray-500">
 //                       لا توجد منتجات مضافة بعد
 //                     </td>
 //                   </tr>
 //                 )}
 //               </tbody>
 //             </table>
 //           </div>
 //           {/* إضافة منتج */}
 //           <div className="p-5 bg-white border rounded-lg shadow-sm">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>
 //             <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
 //             <select
 //               value={product}
 //               onChange={(e) => setProduct(e.target.value)}
 //               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
 //             >
 //               <option value="">اختر...</option>
 //               {productsList.map((p) => (
 //                 <option key={p.id} value={p.name}>
 //                   {p.name}
 //                 </option>
 //               ))}
 //             </select>
 //             <label className="block mb-2 text-sm text-gray-700">الكمية</label>
 //             <input
 //               type="number"
 //               value={quantity}
 //               min="1"
 //               onChange={(e) => setQuantity(Number(e.target.value))}
 //               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
 //             />
 //             <button
 //               onClick={addToCart}
 //               className="w-full py-2 mb-3 text-white rounded-md shadow bg-sky-500 hover:bg-sky-600"
 //             >
 //               ➕ إضافة للفاتورة
 //             </button>
 //             <label className="block mb-2 text-sm text-gray-700">خصم</label>
 //             <input
 //               type="number"
 //               value={discount}
 //               min="0"
 //               onChange={(e) => setDiscount(Number(e.target.value))}
 //               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
 //             />
 //             <div className="pt-3 text-sm text-gray-600 border-t">
 //               <p>
 //                 الإجمالي: <span className="font-bold text-gray-900">{total} ر.س</span>
 //               </p>
 //               <p>
 //                 الخصم: <span className="text-red-600">{discount} ر.س</span>
 //               </p>
 //               <p className="mt-1 text-lg font-semibold text-sky-700">
 //                 الإجمالي النهائي: {netTotal} ر.س
 //               </p>
 //             </div>
 //             <button
 //               onClick={completeSale}
 //               className="w-full mt-4 py-2.5 text-white rounded-md shadow-md bg-green-600 hover:bg-green-700"
 //             >
 //               💰 إتمام البيع وطباعة الفاتورة
 //             </button>
 //           </div>
 //         </div>
 //       </div>
 //       {/* نافذة تقرير نهاية الوردية */}
 //       {showShiftReport && (
 //         <Modal title="تقرير نهاية الوردية" onClose={() => setShowShiftReport(false)}>
 //           <div ref={printRef} className="space-y-2 text-sm text-right">
 //             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
 //               📊 تقرير الوردية الحالية
 //             </h3>
 //             <p><strong>الكاشير:</strong> أحمد</p>
 //             <p><strong>بداية الوردية:</strong> {shiftStart.toLocaleTimeString('ar-SA')}</p>
 //             <p><strong>نهاية الوردية:</strong> {shiftEnd ? shiftEnd.toLocaleTimeString('ar-SA') : new Date().toLocaleTimeString('ar-SA')}</p>
 //             <p><strong>عدد الفواتير:</strong> {sales.length}</p>
 //             <p><strong>إجمالي المبيعات:</strong> {totalSales} ر.س</p>
 //             <p><strong>متوسط الفاتورة:</strong> {avgSale} ر.س</p>
 //           </div>
 //           <button
 //             onClick={handlePrintShiftReport}
 //             className="w-full py-2 mt-4 text-white bg-green-600 rounded-md hover:bg-green-700"
 //           >
 //             🖨️ طباعة التقرير
 //           </button>
 //         </Modal>
 //       )}
 //       {/* نافذة التقرير اليومي */}
 //       {showDailyReport && (
 //         <Modal title="📊 التقرير اليومي" onClose={() => setShowDailyReport(false)}>
 //           <div className="space-y-2 text-sm text-gray-700">
 //             <p><strong>عدد الفواتير:</strong> {sales.length}</p>
 //             <p><strong>إجمالي المبيعات:</strong> {totalSales} ر.س</p>
 //             <p><strong>متوسط الفاتورة:</strong> {avgSale} ر.س</p>
 //             <p><strong>أكثر منتج مبيعًا:</strong> {sales.length ? sales[sales.length - 1].items[0].name : '—'}</p>
 //             <p><strong>تاريخ اليوم:</strong> {new Date().toLocaleDateString('ar-SA')}</p>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // import { useState, useEffect, useRef } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import theme from '../theme'
 // export default function Cashier() {
 //   const [cart, setCart] = useState([])
 //   const [product, setProduct] = useState('')
 //   const [quantity, setQuantity] = useState(1)
 //   const [discount, setDiscount] = useState(0)
 //   const [showInvoice, setShowInvoice] = useState(false)
 //   const [showShiftReport, setShowShiftReport] = useState(false)
 //   const [sales, setSales] = useState([])
 //   const [shiftStart, setShiftStart] = useState(new Date())
 //   const printRef = useRef(null)
 //   const productsList = [
 //     { id: 1, name: 'باراسيتامول 500mg', price: 15 },
 //     { id: 2, name: 'فيتامين سي 1000mg', price: 25 },
 //     { id: 3, name: 'أموكسيسيلين 250mg', price: 45 },
 //     { id: 4, name: 'ايبوبروفين 400mg', price: 30 },
 //   ]
 //   useEffect(() => {
 //     setShiftStart(new Date())
 //   }, [])
 //   const addToCart = () => {
 //     if (!product) return alert('يرجى اختيار منتج')
 //     const selected = productsList.find((p) => p.name === product)
 //     const existing = cart.find((item) => item.name === product)
 //     if (existing) {
 //       setCart(
 //         cart.map((item) =>
 //           item.name === product
 //             ? { ...item, quantity: item.quantity + quantity }
 //             : item
 //         )
 //       )
 //     } else {
 //       setCart([...cart, { ...selected, quantity }])
 //     }
 //     setProduct('')
 //     setQuantity(1)
 //   }
 //   const removeItem = (name) => {
 //     setCart(cart.filter((item) => item.name !== name))
 //   }
 //   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
 //   const netTotal = total - discount
 //   const completeSale = () => {
 //     if (cart.length === 0) return alert('لا توجد منتجات في الفاتورة')
 //     const newSale = {
 //       id: sales.length + 1,
 //       date: new Date().toLocaleTimeString('ar-SA'),
 //       total: netTotal,
 //       items: [...cart],
 //     }
 //     setSales([...sales, newSale])
 //     setCart([])
 //     setDiscount(0)
 //     setShowInvoice(true)
 //   }
 //   const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
 //   const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0
 //   const handlePrintShiftReport = () => {
 //     const w = window.open('', '', 'width=800,height=600')
 //     w.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير نهاية الوردية</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
 //             h2 { color: #0ea5e9; text-align: center; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
 //             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
 //             th { background: #f3f4f6; }
 //           </style>
 //         </head>
 //         <body>${printRef.current.innerHTML}</body>
 //       </html>
 //     `)
 //     w.document.close()
 //     w.focus()
 //     w.print()
 //     w.close()
 //   }
 //   return (
 //     <Layout user={{ name: 'كاشير أحمد' }} title="نقطة البيع (الكاشير)">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 💼 ملخص الوردية */}
 //         <div className="p-4 border rounded-lg shadow-sm bg-gradient-to-r from-sky-50 to-blue-50">
 //           <div className="flex items-center justify-between">
 //             <h2 className="text-lg font-semibold text-gray-700">
 //               💼 ملخص الوردية الحالية
 //             </h2>
 //             <button
 //               onClick={() => setShowShiftReport(true)}
 //               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
 //             >
 //               🧾 تقرير نهاية الوردية
 //             </button>
 //           </div>
 //           <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-700 md:grid-cols-5">
 //             <div>
 //               <p className="text-gray-500">الكاشير</p>
 //               <p className="font-medium text-gray-900">أحمد</p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">وقت البدء</p>
 //               <p className="font-medium text-gray-900">
 //                 {shiftStart.toLocaleTimeString('ar-SA')}
 //               </p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">عدد الفواتير</p>
 //               <p className="font-medium text-gray-900">{sales.length}</p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">إجمالي المبيعات</p>
 //               <p className="font-medium text-green-700">{totalSales} ر.س</p>
 //             </div>
 //             <div>
 //               <p className="text-gray-500">متوسط الفاتورة</p>
 //               <p className="font-medium text-blue-700">{avgSale} ر.س</p>
 //             </div>
 //           </div>
 //         </div>
 //         {/* ⚙️ الأقسام */}
 //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
 //           {/* الفاتورة */}
 //           <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
 //             <table className="w-full text-sm text-right border-t border-gray-100">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">المنتج</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                   <th></th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {cart.length > 0 ? (
 //                   cart.map((item, i) => (
 //                     <tr key={i} className="border-t hover:bg-gray-50">
 //                       <td className="px-3 py-2">{item.name}</td>
 //                       <td className="px-3 py-2">{item.quantity}</td>
 //                       <td className="px-3 py-2">{item.price} ر.س</td>
 //                       <td className="px-3 py-2 font-semibold text-sky-700">
 //                         {item.price * item.quantity} ر.س
 //                       </td>
 //                       <td
 //                         className="py-2 text-red-500 cursor-pointer"
 //                         onClick={() => removeItem(item.name)}
 //                       >
 //                         ✕
 //                       </td>
 //                     </tr>
 //                   ))
 //                 ) : (
 //                   <tr>
 //                     <td colSpan="5" className="py-4 text-center text-gray-500">
 //                       لا توجد منتجات مضافة بعد
 //                     </td>
 //                   </tr>
 //                 )}
 //               </tbody>
 //             </table>
 //           </div>
 //           {/* إضافة منتج */}
 //           <div className="p-5 bg-white border rounded-lg shadow-sm">
 //             <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>
 //             <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
 //             <select
 //               value={product}
 //               onChange={(e) => setProduct(e.target.value)}
 //               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
 //             >
 //               <option value="">اختر...</option>
 //               {productsList.map((p) => (
 //                 <option key={p.id} value={p.name}>
 //                   {p.name}
 //                 </option>
 //               ))}
 //             </select>
 //             <label className="block mb-2 text-sm text-gray-700">الكمية</label>
 //             <input
 //               type="number"
 //               value={quantity}
 //               min="1"
 //               onChange={(e) => setQuantity(Number(e.target.value))}
 //               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
 //             />
 //             <button
 //               onClick={addToCart}
 //               className="w-full py-2 mb-3 text-white rounded-md shadow bg-sky-500 hover:bg-sky-600"
 //             >
 //               ➕ إضافة للفاتورة
 //             </button>
 //             <label className="block mb-2 text-sm text-gray-700">خصم</label>
 //             <input
 //               type="number"
 //               value={discount}
 //               min="0"
 //               onChange={(e) => setDiscount(Number(e.target.value))}
 //               className="w-full px-3 py-2 mb-3 text-right border rounded-md focus:ring-2 focus:ring-sky-400"
 //             />
 //             <div className="pt-3 text-sm text-gray-600 border-t">
 //               <p>
 //                 الإجمالي: <span className="font-bold text-gray-900">{total} ر.س</span>
 //               </p>
 //               <p>
 //                 الخصم: <span className="text-red-600">{discount} ر.س</span>
 //               </p>
 //               <p className="mt-1 text-lg font-semibold text-sky-700">
 //                 الإجمالي النهائي: {netTotal} ر.س
 //               </p>
 //             </div>
 //             <button
 //               onClick={completeSale}
 //               className="w-full mt-4 py-2.5 text-white rounded-md shadow-md bg-green-600 hover:bg-green-700"
 //             >
 //               💰 إتمام البيع وطباعة الفاتورة
 //             </button>
 //           </div>
 //         </div>
 //       </div>
 //       {/* نافذة تقرير نهاية الوردية */}
 //       {showShiftReport && (
 //         <Modal title="تقرير نهاية الوردية" onClose={() => setShowShiftReport(false)}>
 //           <div ref={printRef} className="space-y-2 text-sm text-right">
 //             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
 //               📊 تقرير الوردية الحالية
 //             </h3>
 //             <p><strong>الكاشير:</strong> أحمد</p>
 //             <p><strong>بداية الوردية:</strong> {shiftStart.toLocaleTimeString('ar-SA')}</p>
 //             <p><strong>نهاية الوردية:</strong> {new Date().toLocaleTimeString('ar-SA')}</p>
 //             <p><strong>عدد الفواتير:</strong> {sales.length}</p>
 //             <p><strong>إجمالي المبيعات:</strong> {totalSales} ر.س</p>
 //             <p><strong>متوسط الفاتورة:</strong> {avgSale} ر.س</p>
 //           </div>
 //           <button
 //             onClick={handlePrintShiftReport}
 //             className="w-full py-2 mt-4 text-white bg-green-600 rounded-md hover:bg-green-700"
 //           >
 //             🖨️ طباعة التقرير
 //           </button>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // import { useState } from 'react'
 // import Layout from '../components/Layout'
 // import theme from '../theme'
 // import Modal from '../components/Modal'
 // export default function Cashier() {
 //   const [cart, setCart] = useState([])
 //   const [product, setProduct] = useState('')
 //   const [quantity, setQuantity] = useState(1)
 //   const [discount, setDiscount] = useState(0)
 //   const [showInvoice, setShowInvoice] = useState(false)
 //   const [shiftActive, setShiftActive] = useState(false)
 //   const [shiftSummary, setShiftSummary] = useState({
 //     totalSales: 0,
 //     invoiceCount: 0,
 //     cash: 0,
 //     card: 0,
 //     transfer: 0
 //   })
 //   // بيانات المنتجات
 //   const productsList = [
 //     { id: 1, name: 'باراسيتامول 500mg', price: 15 },
 //     { id: 2, name: 'فيتامين سي 1000mg', price: 25 },
 //     { id: 3, name: 'أموكسيسيلين 250mg', price: 45 },
 //     { id: 4, name: 'ايبوبروفين 400mg', price: 30 },
 //   ]
 //   const addToCart = () => {
 //     if (!product) return alert('يرجى اختيار منتج')
 //     const selected = productsList.find((p) => p.name === product)
 //     const existing = cart.find((item) => item.name === product)
 //     if (existing) {
 //       setCart(
 //         cart.map((item) =>
 //           item.name === product
 //             ? { ...item, quantity: item.quantity + quantity }
 //             : item
 //         )
 //       )
 //     } else {
 //       setCart([...cart, { ...selected, quantity }])
 //     }
 //     setProduct('')
 //     setQuantity(1)
 //   }
 //   const removeItem = (name) => {
 //     setCart(cart.filter((item) => item.name !== name))
 //   }
 //   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
 //   const netTotal = total - discount
 //   const completeSale = () => {
 //     if (cart.length === 0) return alert('لا توجد منتجات في الفاتورة')
 //     // تحديث ملخص الوردية
 //     if (shiftActive) {
 //       setShiftSummary(prev => ({
 //         ...prev,
 //         totalSales: prev.totalSales + netTotal,
 //         invoiceCount: prev.invoiceCount + 1,
 //         cash: prev.cash + netTotal
 //       }))
 //     }
 //     setShowInvoice(true)
 //   }
 //   const startShift = () => {
 //     setShiftActive(true)
 //     setShiftSummary({
 //       totalSales: 0,
 //       invoiceCount: 0,
 //       cash: 0,
 //       card: 0,
 //       transfer: 0
 //     })
 //   }
 //   const endShift = () => {
 //     alert(
 //       `💼 تم إنهاء الوردية\n\nإجمالي المبيعات: ${shiftSummary.totalSales} ر.س\nعدد الفواتير: ${shiftSummary.invoiceCount}`
 //     )
 //     setShiftActive(false)
 //   }
 //   return (
 //     <Layout user={{ name: 'الكاشير أحمد' }} title="نقطة البيع (الكاشير)">
 //       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
 //         {/* الفاتورة */}
 //         <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
 //           <h2 className="mb-3 text-lg font-semibold text-gray-700">المنتجات المضافة</h2>
 //           <table className="w-full text-sm text-right border-t border-gray-100">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">المنتج</th>
 //                 <th className="px-3 py-2">الكمية</th>
 //                 <th className="px-3 py-2">السعر</th>
 //                 <th className="px-3 py-2">الإجمالي</th>
 //                 <th></th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {cart.length > 0 ? (
 //                 cart.map((item, i) => (
 //                   <tr key={i} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{item.name}</td>
 //                     <td className="px-3 py-2">{item.quantity}</td>
 //                     <td className="px-3 py-2">{item.price} ر.س</td>
 //                     <td className="px-3 py-2 font-semibold text-sky-700">
 //                       {item.price * item.quantity} ر.س
 //                     </td>
 //                     <td
 //                       className="py-2 text-red-500 cursor-pointer"
 //                       onClick={() => removeItem(item.name)}
 //                     >
 //                       ✕
 //                     </td>
 //                   </tr>
 //                 ))
 //               ) : (
 //                 <tr>
 //                   <td colSpan="5" className="py-4 text-center text-gray-500">
 //                     لا توجد منتجات مضافة بعد
 //                   </td>
 //                 </tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* إضافة منتج */}
 //         <div className="p-5 bg-white border rounded-lg shadow-sm">
 //           <h2 className="mb-3 text-lg font-semibold text-gray-700">إضافة منتج</h2>
 //           <label className="block mb-2 text-sm text-gray-700">اختر المنتج</label>
 //           <select
 //             value={product}
 //             onChange={(e) => setProduct(e.target.value)}
 //             className="w-full px-3 py-2 mb-3 border rounded-md focus:ring-2 focus:ring-sky-400"
 //           >
 //             <option value="">اختر...</option>
 //             {productsList.map((p) => (
 //               <option key={p.id} value={p.name}>{p.name}</option>
 //             ))}
 //           </select>
 //           <label className="block mb-2 text-sm text-gray-700">الكمية</label>
 //           <input
 //             type="number"
 //             value={quantity}
 //             min="1"
 //             onChange={(e) => setQuantity(Number(e.target.value))}
 //             className="w-full px-3 py-2 mb-3 border rounded-md focus:ring-2 focus:ring-sky-400"
 //           />
 //           <button
 //             onClick={addToCart}
 //             className="w-full py-2 mb-3 text-white rounded-md shadow bg-sky-500 hover:bg-sky-600"
 //           >
 //             ➕ إضافة للفاتورة
 //           </button>
 //           <label className="block mb-2 text-sm text-gray-700">خصم</label>
 //           <input
 //             type="number"
 //             value={discount}
 //             min="0"
 //             onChange={(e) => setDiscount(Number(e.target.value))}
 //             className="w-full px-3 py-2 mb-3 border rounded-md focus:ring-2 focus:ring-sky-400"
 //           />
 //           <div className="pt-3 text-sm text-gray-600 border-t">
 //             <p>الإجمالي: <span className="font-bold text-gray-900">{total} ر.س</span></p>
 //             <p>الخصم: <span className="text-red-600">{discount} ر.س</span></p>
 //             <p className="mt-1 text-lg font-semibold text-sky-700">
 //               الإجمالي النهائي: {netTotal} ر.س
 //             </p>
 //           </div>
 //           <button
 //             onClick={completeSale}
 //             className="w-full mt-4 py-2.5 text-white rounded-md shadow-md bg-green-600 hover:bg-green-700"
 //           >
 //             💰 إتمام البيع وطباعة الفاتورة
 //           </button>
 //         </div>
 //       </div>
 //       {/* قسم الوردية */}
 //       <div className="p-5 mt-6 bg-white border rounded-lg shadow-sm">
 //         <div className="flex items-center justify-between mb-3">
 //           <h2 className="text-lg font-semibold text-gray-700">ملخص الوردية</h2>
 //           {!shiftActive ? (
 //             <button
 //               onClick={startShift}
 //               className="px-4 py-1.5 text-white bg-sky-500 rounded-md hover:bg-sky-600"
 //             >
 //               ▶️ بدء وردية
 //             </button>
 //           ) : (
 //             <button
 //               onClick={endShift}
 //               className="px-4 py-1.5 text-white bg-red-500 rounded-md hover:bg-red-600"
 //             >
 //               ⏹️ إنهاء الوردية
 //             </button>
 //           )}
 //         </div>
 //         <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 md:grid-cols-4">
 //           <div>
 //             <p>💵 إجمالي المبيعات:</p>
 //             <p className="font-semibold text-gray-900">{shiftSummary.totalSales} ر.س</p>
 //           </div>
 //           <div>
 //             <p>🧾 عدد الفواتير:</p>
 //             <p className="font-semibold text-gray-900">{shiftSummary.invoiceCount}</p>
 //           </div>
 //           <div>
 //             <p>💰 نقدًا:</p>
 //             <p className="font-semibold text-green-700">{shiftSummary.cash} ر.س</p>
 //           </div>
 //           <div>
 //             <p>💳 بطاقة:</p>
 //             <p className="font-semibold text-blue-700">{shiftSummary.card} ر.س</p>
 //           </div>
 //         </div>
 //       </div>
 //       {/* نافذة الفاتورة */}
 //       {showInvoice && (
 //         <Modal title="تفاصيل الفاتورة" onClose={() => setShowInvoice(false)}>
 //           <div className="space-y-2 text-sm text-right">
 //             <p><strong>عدد المنتجات:</strong> {cart.length}</p>
 //             <p><strong>إجمالي الفاتورة:</strong> {netTotal} ر.س</p>
 //             <p><strong>طريقة الدفع:</strong> نقدًا</p>
 //           </div>
 //           <button
 //             onClick={() => setShowInvoice(false)}
 //             className="w-full py-2 mt-4 text-white rounded-md bg-sky-500 hover:bg-sky-600"
 //           >
 //             إغلاق
 //           </button>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4d134408._.js.map