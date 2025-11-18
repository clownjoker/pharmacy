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
"[project]/pages/inventory.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/inventory.js
__turbopack_context__.s([
    "default",
    ()=>Inventory
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
function Inventory() {
    const [user] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: "أحمد",
        role: "admin"
    });
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("all");
    const [brand, setBrand] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("all");
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("all");
    const [editProduct, setEditProduct] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fakeBackend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getInventory"])();
        setProducts(data || []);
    }, []);
    const today = new Date().toISOString().slice(0, 10);
    // تصنيف حالة المنتج
    const getStatus = (p)=>{
        if (!p.expiry) return "ok";
        const diff = (new Date(p.expiry) - new Date(today)) / (1000 * 60 * 60 * 24);
        if (diff < 0) return "expired"; // منتهي
        if (diff <= 20) return "near-expire"; // قريب منتهى
        if (p.qty <= p.minQty) return "low"; // كمية منخفضة
        return "ok";
    };
    // الفلاتر
    const filtered = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return (products || []).filter((p)=>{
            const q = search.toLowerCase().trim();
            const bySearch = !q || p.name.toLowerCase().includes(q) || p.barcode?.toLowerCase().includes(q);
            const byCategory = category === "all" || p.category === category;
            const byBrand = brand === "all" || p.brand === brand;
            const byStatus = status === "all" || getStatus(p) === status;
            return bySearch && byCategory && byBrand && byStatus;
        });
    }, [
        products,
        search,
        category,
        brand,
        status
    ]);
    const categories = [
        ...new Set(products.map((p)=>p.category))
    ];
    const brands = [
        ...new Set(products.map((p)=>p.brand))
    ];
    // تعديل المنتج
    const saveEdit = ()=>{
        const updated = products.map((p)=>p.id === editProduct.id ? editProduct : p);
        setProducts(updated);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fakeBackend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["saveInventory"])(updated);
        __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["default"].success("تم تحديث بيانات المنتج");
        setEditProduct(null);
    };
    // لون الحالة
    const statusColor = {
        ok: "text-emerald-600",
        low: "text-yellow-600",
        "near-expire": "text-orange-500",
        expired: "text-red-600"
    };
    // نص الحالة
    const statusText = {
        ok: "سليم",
        low: "كمية منخفضة",
        "near-expire": "قرب الانتهاء",
        expired: "منتهي"
    };
    // طباعة تقرير المخزون
    const printInventory = ()=>{
        const html = `
    <html dir="rtl">
    <head>
      <meta charset="utf-8" />
      <title>تقرير المخزون</title>
      <style>
        body { font-family: 'Tajawal', sans-serif; padding: 20px; }
        table { width:100%; border-collapse: collapse; margin-top:10px; }
        th,td { border:1px solid #ddd; padding:6px; text-align:center; }
        th { background:#f3f4f6; }
      </style>
    </head>
    <body>
      <h2>تقرير المخزون</h2>
      <table>
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الشركة</th>
            <th>الكمية</th>
            <th>حد التنبيه</th>
            <th>الفئة</th>
            <th>تاريخ الانتهاء</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map((p)=>`<tr>
                  <td>${p.name}</td>
                  <td>${p.brand}</td>
                  <td>${p.qty}</td>
                  <td>${p.minQty}</td>
                  <td>${p.category}</td>
                  <td>${p.expiry || "-"}</td>
                  <td>${statusText[getStatus(p)]}</td>
                </tr>`).join("")}
        </tbody>
      </table>

      <script>
        window.onload = () => window.print()
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
        title: "المخزون",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                dir: "rtl",
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-3 p-4 bg-white border rounded-lg shadow-sm md:grid-cols-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "بحث باسم المنتج أو الباركود",
                                className: "px-3 py-2 border rounded-md",
                                value: search,
                                onChange: (e)=>setSearch(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/pages/inventory.js",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: category,
                                onChange: (e)=>setCategory(e.target.value),
                                className: "px-3 py-2 border rounded-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "كل الفئات"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventory.js",
                                        lineNumber: 172,
                                        columnNumber: 13
                                    }, this),
                                    categories.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: c,
                                            children: c
                                        }, i, false, {
                                            fileName: "[project]/pages/inventory.js",
                                            lineNumber: 174,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventory.js",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: brand,
                                onChange: (e)=>setBrand(e.target.value),
                                className: "px-3 py-2 border rounded-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "كل الشركات"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventory.js",
                                        lineNumber: 183,
                                        columnNumber: 13
                                    }, this),
                                    brands.map((b, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: b,
                                            children: b
                                        }, i, false, {
                                            fileName: "[project]/pages/inventory.js",
                                            lineNumber: 185,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventory.js",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: status,
                                onChange: (e)=>setStatus(e.target.value),
                                className: "px-3 py-2 border rounded-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "كل الحالات"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventory.js",
                                        lineNumber: 194,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "ok",
                                        children: "سليم"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventory.js",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "low",
                                        children: "كمية منخفضة"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventory.js",
                                        lineNumber: 196,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "near-expire",
                                        children: "قرب الانتهاء"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventory.js",
                                        lineNumber: 197,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "expired",
                                        children: "منتهي"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventory.js",
                                        lineNumber: 198,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventory.js",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: printInventory,
                                className: "px-3 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700",
                                children: "🖨️ طباعة التقرير"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventory.js",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventory.js",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "p-4 overflow-x-auto bg-white border rounded-lg shadow-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            className: "w-full text-sm min-w-[900px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    className: "text-gray-600 bg-gray-50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "p-2",
                                                children: "الصنف"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 215,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "الشركة"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 216,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "الكمية"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 217,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "حد التنبيه"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 218,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "الفئة"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 219,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "تاريخ الانتهاء"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 220,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "الحالة"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 221,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "إجراءات"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventory.js",
                                                lineNumber: 222,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventory.js",
                                        lineNumber: 214,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventory.js",
                                    lineNumber: 213,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    children: filtered.length ? filtered.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            className: "border-t hover:bg-gray-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "p-2 font-semibold",
                                                    children: p.name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventory.js",
                                                    lineNumber: 230,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: p.brand
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventory.js",
                                                    lineNumber: 231,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: p.qty
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventory.js",
                                                    lineNumber: 232,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: p.minQty
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventory.js",
                                                    lineNumber: 233,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: p.category
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventory.js",
                                                    lineNumber: 234,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: p.expiry || "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventory.js",
                                                    lineNumber: 235,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: statusColor[getStatus(p)],
                                                    children: statusText[getStatus(p)]
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventory.js",
                                                    lineNumber: 236,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setEditProduct(p),
                                                        className: "px-2 py-1 text-xs text-indigo-700 border rounded bg-indigo-50 hover:bg-indigo-100",
                                                        children: "✏️ تعديل"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventory.js",
                                                        lineNumber: 240,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventory.js",
                                                    lineNumber: 239,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, p.id, true, {
                                            fileName: "[project]/pages/inventory.js",
                                            lineNumber: 229,
                                            columnNumber: 19
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-4 text-center text-gray-500",
                                            colSpan: "8",
                                            children: "لا توجد نتائج مطابقة"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventory.js",
                                            lineNumber: 251,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventory.js",
                                        lineNumber: 250,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventory.js",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/inventory.js",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventory.js",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            editProduct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: `تعديل المنتج — ${editProduct.name}`,
                onClose: ()=>setEditProduct(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "space-y-3 text-sm",
                    dir: "rtl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                            children: "الاسم"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 272,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            className: "w-full p-2 border rounded",
                            value: editProduct.name,
                            onChange: (e)=>setEditProduct({
                                    ...editProduct,
                                    name: e.target.value
                                })
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                            children: "الكمية"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 281,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            type: "number",
                            className: "w-full p-2 border rounded",
                            value: editProduct.qty,
                            onChange: (e)=>setEditProduct({
                                    ...editProduct,
                                    qty: Number(e.target.value)
                                })
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 282,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                            children: "حد التنبيه"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 291,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            type: "number",
                            className: "w-full p-2 border rounded",
                            value: editProduct.minQty,
                            onChange: (e)=>setEditProduct({
                                    ...editProduct,
                                    minQty: Number(e.target.value)
                                })
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 292,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                            children: "الشركة"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 301,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            className: "w-full p-2 border rounded",
                            value: editProduct.brand,
                            onChange: (e)=>setEditProduct({
                                    ...editProduct,
                                    brand: e.target.value
                                })
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 302,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                            children: "الفئة"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 310,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            className: "w-full p-2 border rounded",
                            value: editProduct.category,
                            onChange: (e)=>setEditProduct({
                                    ...editProduct,
                                    category: e.target.value
                                })
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 311,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                            children: "تاريخ الانتهاء"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 319,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            type: "date",
                            className: "w-full p-2 border rounded",
                            value: editProduct.expiry,
                            onChange: (e)=>setEditProduct({
                                    ...editProduct,
                                    expiry: e.target.value
                                })
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 320,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: saveEdit,
                            className: "w-full py-2 mt-2 text-white bg-indigo-600 rounded hover:bg-indigo-700",
                            children: "💾 حفظ التعديلات"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventory.js",
                            lineNumber: 329,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/inventory.js",
                    lineNumber: 270,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/inventory.js",
                lineNumber: 266,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/inventory.js",
        lineNumber: 153,
        columnNumber: 5
    }, this);
} // // pages/inventory.js
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c53000d4._.js.map