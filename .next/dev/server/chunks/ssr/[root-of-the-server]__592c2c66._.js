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
                                        lineNumber: 51,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                className: "text-lg font-bold text-gray-800",
                                                children: "نظام الصيدلية الذكي"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 58,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 -mt-0.5",
                                                children: "Pharmacy Management System"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 59,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Layout.js",
                                        lineNumber: 57,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Layout.js",
                                lineNumber: 50,
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
                                        lineNumber: 65,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/Layout.js",
                                lineNumber: 63,
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
                                                lineNumber: 92,
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
                                                lineNumber: 95,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Layout.js",
                                        lineNumber: 90,
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
                                                lineNumber: 108,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: "تسجيل الخروج"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 109,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Layout.js",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Layout.js",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Layout.js",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Layout.js",
                    lineNumber: 45,
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
                            lineNumber: 117,
                            columnNumber: 11
                        }, this),
                        children
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Layout.js",
                    lineNumber: 115,
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
                    lineNumber: 124,
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
                    lineNumber: 128,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Layout.js",
            lineNumber: 44,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Layout.js",
        lineNumber: 43,
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
"[project]/pages/users.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/users.js
__turbopack_context__.s([
    "ALL_PERMISSIONS",
    ()=>ALL_PERMISSIONS,
    "default",
    ()=>UsersPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Layout.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/theme.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/react-hot-toast [external] (react-hot-toast, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthGuard$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AuthGuard.js [ssr] (ecmascript)");
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
const ALL_PERMISSIONS = [
    // تقارير
    {
        key: "view_reports",
        label: "عرض كل التقارير"
    },
    {
        key: "report_sales",
        label: "تقرير المبيعات"
    },
    {
        key: "report_profit",
        label: "تقرير الربحية"
    },
    {
        key: "report_inventory",
        label: "تقرير المخزون"
    },
    {
        key: "report_shift",
        label: "تقرير الشِفت"
    },
    {
        key: "print_reports",
        label: "طباعة التقارير"
    },
    // مبيعات
    {
        key: "add_sale",
        label: "إضافة عملية بيع"
    },
    {
        key: "return_sale",
        label: "إنشاء مرتجع"
    },
    {
        key: "view_sales",
        label: "عرض المبيعات"
    },
    {
        key: "print_invoice",
        label: "طباعة الفاتورة"
    },
    {
        key: "edit_invoice",
        label: "تعديل الفاتورة"
    },
    {
        key: "delete_invoice",
        label: "حذف الفاتورة"
    },
    // منتجات
    {
        key: "view_products",
        label: "عرض المنتجات"
    },
    {
        key: "add_product",
        label: "إضافة منتج"
    },
    {
        key: "edit_product",
        label: "تعديل منتج"
    },
    {
        key: "delete_product",
        label: "حذف منتج"
    },
    {
        key: "manage_categories",
        label: "إدارة التصنيفات"
    },
    {
        key: "manage_brands",
        label: "إدارة الشركات المنتجة"
    },
    {
        key: "manage_medicines",
        label: "إدارة الأدوية"
    },
    // مخزون
    {
        key: "view_inventory",
        label: "عرض المخزون"
    },
    {
        key: "adjust_inventory",
        label: "تعديل المخزون يدويًا"
    },
    {
        key: "add_stock",
        label: "إضافة كمية للمخزون"
    },
    {
        key: "remove_stock",
        label: "خصم كمية من المخزون"
    },
    {
        key: "view_expired",
        label: "عرض المنتهي الصلاحية"
    },
    {
        key: "view_near_expire",
        label: "عرض القريب من الانتهاء"
    },
    {
        key: "print_inventory_report",
        label: "طباعة تقرير المخزون"
    },
    // حسابات
    {
        key: "view_accounts",
        label: "عرض الحسابات"
    },
    {
        key: "add_income",
        label: "إضافة إيراد"
    },
    {
        key: "add_expense",
        label: "إضافة مصروف"
    },
    {
        key: "view_financial_summary",
        label: "عرض الملخص المالي"
    },
    {
        key: "manage_safe",
        label: "إدارة الخزنة"
    },
    {
        key: "manage_bank",
        label: "إدارة الحساب البنكي"
    },
    // مستخدمين / نظام
    {
        key: "manage_users",
        label: "إدارة المستخدمين"
    },
    {
        key: "manage_roles",
        label: "إدارة الأدوار"
    },
    {
        key: "manage_permissions",
        label: "إدارة الصلاحيات"
    },
    {
        key: "view_activity",
        label: "عرض سجل النشاط"
    }
];
const ROLE_LABELS = {
    admin: "مدير النظام",
    pharmacist: "صيدلي",
    cashier: "كاشير"
};
// 🔹 الصلاحيات الافتراضية لكل دور
const ROLE_DEFAULT_PERMISSIONS = {
    admin: ALL_PERMISSIONS.map((p)=>p.key),
    pharmacist: [
        "view_products",
        "add_product",
        "edit_product",
        "manage_medicines",
        "view_inventory",
        "add_stock",
        "remove_stock",
        "view_near_expire",
        "view_expired",
        "print_inventory_report",
        "add_sale",
        "view_sales",
        "print_invoice",
        "view_reports",
        "report_sales",
        "report_inventory",
        "report_profit"
    ],
    cashier: [
        "add_sale",
        "return_sale",
        "view_sales",
        "print_invoice",
        "report_shift"
    ]
};
// 🔹 بيانات تجريبية للمستخدمين
const INITIAL_USERS = [
    {
        id: 1,
        name: "مها علي",
        username: "admin",
        email: "admin@pharmacy.com",
        role: "admin",
        active: true,
        permissions: ROLE_DEFAULT_PERMISSIONS.admin
    },
    {
        id: 2,
        name: "أحمد الصيدلي",
        username: "pharma",
        email: "pharma@pharmacy.com",
        role: "pharmacist",
        active: true,
        permissions: ROLE_DEFAULT_PERMISSIONS.pharmacist
    },
    {
        id: 3,
        name: "محمد الكاشير",
        username: "cashier",
        email: "cashier@pharmacy.com",
        role: "cashier",
        active: true,
        permissions: ROLE_DEFAULT_PERMISSIONS.cashier
    }
];
function UsersPage() {
    const [user] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: "المدير أحمد",
        role: "admin"
    });
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(INITIAL_USERS);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showPermModal, setShowPermModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [newUser, setNewUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "cashier",
        active: true
    });
    const [selectedUser, setSelectedUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [permDraft, setPermDraft] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const filteredUsers = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u)=>u.name?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }, [
        users,
        search
    ]);
    const openAddModal = ()=>{
        setNewUser({
            name: "",
            username: "",
            email: "",
            password: "",
            role: "cashier",
            active: true
        });
        setShowAddModal(true);
    };
    const handleAddUser = ()=>{
        if (!newUser.name || !newUser.username || !newUser.email || !newUser.password) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["default"].error("⚠️ يرجى إدخال جميع الحقول الأساسية");
            return;
        }
        const nextId = users.length ? Math.max(...users.map((u)=>u.id)) + 1 : 1;
        const userToAdd = {
            id: nextId,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            active: true,
            permissions: ROLE_DEFAULT_PERMISSIONS[newUser.role] || []
        };
        setUsers((prev)=>[
                ...prev,
                userToAdd
            ]);
        setShowAddModal(false);
        __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["default"].success("✅ تم إضافة المستخدم (بيانات تجريبية)");
    };
    const toggleActive = (id)=>{
        setUsers((prev)=>prev.map((u)=>u.id === id ? {
                    ...u,
                    active: !u.active
                } : u));
        __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["default"].success("🔁 تم تحديث حالة الحساب");
    };
    const deleteUser = (id)=>{
        if (!confirm("هل تريد حذف هذا المستخدم نهائيًا؟")) return;
        setUsers((prev)=>prev.filter((u)=>u.id !== id));
        __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["default"].success("🗑️ تم حذف المستخدم");
    };
    const openPermModal = (u)=>{
        setSelectedUser(u);
        setPermDraft(u.permissions || []);
        setShowPermModal(true);
    };
    const togglePermission = (key)=>{
        setPermDraft((prev)=>prev.includes(key) ? prev.filter((p)=>p !== key) : [
                ...prev,
                key
            ]);
    };
    const savePermissions = ()=>{
        if (!selectedUser) return;
        setUsers((prev)=>prev.map((u)=>u.id === selectedUser.id ? {
                    ...u,
                    permissions: permDraft
                } : u));
        setShowPermModal(false);
        __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["default"].success("🔐 تم تحديث صلاحيات المستخدم");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthGuard$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        allowedRoles: [
            "admin"
        ],
        requiredPermissions: [
            "manage_users",
            "manage_permissions"
        ],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            user: user,
            title: "👥 إدارة المستخدمين والصلاحيات",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    dir: "rtl",
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "🔍 بحث بالاسم / اسم المستخدم / البريد",
                                    value: search,
                                    onChange: (e)=>setSearch(e.target.value),
                                    className: "w-full px-3 py-2 text-sm border rounded-md md:w-1/2"
                                }, void 0, false, {
                                    fileName: "[project]/pages/users.js",
                                    lineNumber: 244,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: openAddModal,
                                    className: "px-4 py-2 text-sm text-white rounded-md shadow",
                                    style: {
                                        background: __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].colors.success
                                    },
                                    children: "➕ إضافة مستخدم"
                                }, void 0, false, {
                                    fileName: "[project]/pages/users.js",
                                    lineNumber: 251,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/users.js",
                            lineNumber: 243,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto bg-white border rounded-lg shadow-sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                className: "w-full text-sm text-right min-w-[900px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                        className: "text-xs text-gray-600 bg-gray-50",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2",
                                                    children: "#"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 265,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2",
                                                    children: "الاسم"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 266,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2",
                                                    children: "اسم المستخدم"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 267,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2",
                                                    children: "البريد"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 268,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2",
                                                    children: "الدور"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 269,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2",
                                                    children: "الحالة"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 270,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2",
                                                    children: "الصلاحيات الأساسية"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 271,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2",
                                                    children: "إجراءات"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 272,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/users.js",
                                            lineNumber: 264,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 263,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                        children: filteredUsers.length ? filteredUsers.map((u, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                className: "border-t hover:bg-gray-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2",
                                                        children: i + 1
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/users.js",
                                                        lineNumber: 279,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2 font-medium text-gray-800",
                                                        children: u.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/users.js",
                                                        lineNumber: 280,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2 text-gray-700",
                                                        children: u.username
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/users.js",
                                                        lineNumber: 283,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2 text-gray-600",
                                                        children: u.email
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/users.js",
                                                        lineNumber: 284,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: `inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${u.role === "admin" ? "bg-purple-100 text-purple-700" : u.role === "pharmacist" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`,
                                                            children: ROLE_LABELS[u.role] || u.role
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/users.js",
                                                            lineNumber: 286,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/users.js",
                                                        lineNumber: 285,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: `inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${u.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`,
                                                            children: u.active ? "مفعل" : "موقوف"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/users.js",
                                                            lineNumber: 299,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/users.js",
                                                        lineNumber: 298,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-1 text-[11px]",
                                                            children: [
                                                                (u.permissions || []).slice(0, 3).map((p)=>{
                                                                    const perm = ALL_PERMISSIONS.find((x)=>x.key === p);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "px-2 py-0.5 rounded-full bg-sky-50 text-sky-700",
                                                                        children: perm?.label || p
                                                                    }, p, false, {
                                                                        fileName: "[project]/pages/users.js",
                                                                        lineNumber: 316,
                                                                        columnNumber: 31
                                                                    }, this);
                                                                }),
                                                                u.permissions && u.permissions.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "px-2 py-0.5 rounded-full bg-gray-100 text-gray-500",
                                                                    children: [
                                                                        "+",
                                                                        u.permissions.length - 3,
                                                                        " أخرى"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/users.js",
                                                                    lineNumber: 325,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/users.js",
                                                            lineNumber: 310,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/users.js",
                                                        lineNumber: 309,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap justify-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>openPermModal(u),
                                                                    className: "px-3 py-1 text-xs text-indigo-700 rounded-md bg-indigo-50 hover:bg-indigo-100",
                                                                    children: "🔐 الصلاحيات"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/users.js",
                                                                    lineNumber: 333,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>toggleActive(u.id),
                                                                    className: `px-3 py-1 text-xs rounded-md ${u.active ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`,
                                                                    children: u.active ? "🔒 تعطيل" : "🔓 تفعيل"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/users.js",
                                                                    lineNumber: 339,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>deleteUser(u.id),
                                                                    className: "px-3 py-1 text-xs text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50",
                                                                    children: "🗑️ حذف"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/users.js",
                                                                    lineNumber: 349,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/users.js",
                                                            lineNumber: 332,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/users.js",
                                                        lineNumber: 331,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, u.id, true, {
                                                fileName: "[project]/pages/users.js",
                                                lineNumber: 278,
                                                columnNumber: 21
                                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                colSpan: 8,
                                                className: "px-3 py-6 text-sm text-center text-gray-500",
                                                children: "لا توجد نتائج"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/users.js",
                                                lineNumber: 361,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/users.js",
                                            lineNumber: 360,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 275,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 262,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/users.js",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/users.js",
                    lineNumber: 241,
                    columnNumber: 9
                }, this),
                showAddModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-md p-6 bg-white rounded-lg shadow-lg",
                        dir: "rtl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "mb-4 text-lg font-bold text-center text-gray-800",
                                children: "➕ إضافة مستخدم جديد"
                            }, void 0, false, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 381,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "space-y-3 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Field, {
                                        label: "الاسم الكامل",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: newUser.name,
                                            onChange: (e)=>setNewUser({
                                                    ...newUser,
                                                    name: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border rounded-md"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/users.js",
                                            lineNumber: 387,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 386,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Field, {
                                        label: "اسم المستخدم",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: newUser.username,
                                            onChange: (e)=>setNewUser({
                                                    ...newUser,
                                                    username: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border rounded-md"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/users.js",
                                            lineNumber: 398,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 397,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Field, {
                                        label: "البريد الإلكتروني",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "email",
                                            value: newUser.email,
                                            onChange: (e)=>setNewUser({
                                                    ...newUser,
                                                    email: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border rounded-md"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/users.js",
                                            lineNumber: 409,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 408,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Field, {
                                        label: "كلمة المرور",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "password",
                                            value: newUser.password,
                                            onChange: (e)=>setNewUser({
                                                    ...newUser,
                                                    password: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border rounded-md"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/users.js",
                                            lineNumber: 420,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 419,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Field, {
                                        label: "الدور",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                            value: newUser.role,
                                            onChange: (e)=>setNewUser({
                                                    ...newUser,
                                                    role: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border rounded-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: "admin",
                                                    children: "مدير"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 438,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: "pharmacist",
                                                    children: "صيدلي"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 439,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: "cashier",
                                                    children: "كاشير"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 440,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/users.js",
                                            lineNumber: 431,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 430,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 385,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-2 mt-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowAddModal(false),
                                        className: "px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200",
                                        children: "إلغاء"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 446,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: handleAddUser,
                                        className: "px-4 py-2 text-sm text-white rounded-md shadow",
                                        style: {
                                            background: __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].colors.primary
                                        },
                                        children: "💾 حفظ"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 452,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 445,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/users.js",
                        lineNumber: 377,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/users.js",
                    lineNumber: 376,
                    columnNumber: 11
                }, this),
                showPermModal && selectedUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-lg p-6 bg-white rounded-lg shadow-lg",
                        dir: "rtl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "mb-2 text-lg font-bold text-gray-800",
                                children: [
                                    "🔐 صلاحيات المستخدم: ",
                                    selectedUser.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 471,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "mb-4 text-xs text-gray-500",
                                children: [
                                    "الدور الحالي:",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                        children: ROLE_LABELS[selectedUser.role]
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 476,
                                        columnNumber: 17
                                    }, this),
                                    " — يمكنك تخصيص الصلاحيات يدويًا حسب الحاجة."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 474,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 max-h-[320px] overflow-auto",
                                children: ALL_PERMISSIONS.map((perm)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 px-2 py-1 border rounded-md cursor-pointer hover:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: permDraft.includes(perm.key),
                                                onChange: ()=>togglePermission(perm.key)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/users.js",
                                                lineNumber: 486,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: perm.label
                                            }, void 0, false, {
                                                fileName: "[project]/pages/users.js",
                                                lineNumber: 491,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, perm.key, true, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 482,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 480,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-2 mt-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowPermModal(false),
                                        className: "px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200",
                                        children: "إلغاء"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 497,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: savePermissions,
                                        className: "px-4 py-2 text-sm text-white rounded-md shadow",
                                        style: {
                                            background: __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].colors.primary
                                        },
                                        children: "💾 حفظ الصلاحيات"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 503,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 496,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/users.js",
                        lineNumber: 467,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/users.js",
                    lineNumber: 466,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/users.js",
            lineNumber: 240,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/users.js",
        lineNumber: 236,
        columnNumber: 5
    }, this);
}
function Field({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                className: "block mb-1 text-xs font-semibold text-gray-600",
                children: label
            }, void 0, false, {
                fileName: "[project]/pages/users.js",
                lineNumber: 522,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/pages/users.js",
        lineNumber: 521,
        columnNumber: 5
    }, this);
} // import { useState, useEffect } from 'react'
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__592c2c66._.js.map