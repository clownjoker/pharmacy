module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/react [external] (react, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react", () => require("react"));

module.exports = mod;
}),
"[project]/context/permissions.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// جميع الصلاحيات الأساسية
__turbopack_context__.s([
    "ROLE_DEFAULT_PERMISSIONS",
    ()=>ROLE_DEFAULT_PERMISSIONS,
    "ROUTE_PERMISSIONS",
    ()=>ROUTE_PERMISSIONS
]);
const ROLE_DEFAULT_PERMISSIONS = {
    admin: [
        "view_dashboard",
        "manage_products",
        "view_inventory",
        "update_inventory",
        "view_sales",
        "add_sale",
        "return_sale",
        "open_shift",
        "close_shift",
        "view_shift_report",
        "manage_users",
        "view_reports",
        "view_accounts",
        "view_activity_log"
    ],
    pharmacist: [
        "manage_products",
        "view_inventory",
        "update_inventory",
        "add_sale",
        "view_sales",
        "view_reports",
        "view_activity_log"
    ],
    cashier: [
        "add_sale",
        "return_sale",
        "open_shift",
        "close_shift",
        "view_sales"
    ]
};
const ROUTE_PERMISSIONS = {
    "/dashboard": [
        "view_dashboard"
    ],
    "/products": [
        "manage_products"
    ],
    "/inventory": [
        "view_inventory"
    ],
    "/pharmacist": [
        "manage_products"
    ],
    "/sales": [
        "view_sales"
    ],
    "/cashier": [
        "add_sale"
    ],
    "/shift": [
        "open_shift"
    ],
    "/shift-report": [
        "view_shift_report"
    ],
    "/return": [
        "return_sale"
    ],
    "/accounts": [
        "view_accounts"
    ],
    "/reports": [
        "view_reports"
    ],
    "/activity-log": [
        "view_activity_log"
    ],
    "/users": [
        "manage_users"
    ]
};
}),
"[project]/context/AuthContext.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$permissions$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/permissions.js [ssr] (ecmascript)");
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])();
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null); // بيانات المستخدم
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true); // تحميل الجلسة
    // تحميل الجلسة من التخزين
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const saved = localStorage.getItem("pharmacy_user");
        if (saved) {
            setUser(JSON.parse(saved));
        }
        setLoading(false);
    }, []);
    // تسجيل الدخول (نسخة تجريبية)
    const login = (username, password)=>{
        const USERS = [
            {
                username: "admin",
                password: "123",
                role: "admin",
                name: "المدير"
            },
            {
                username: "ph",
                password: "123",
                role: "pharmacist",
                name: "الصيدلي"
            },
            {
                username: "ca",
                password: "123",
                role: "cashier",
                name: "الكاشير"
            }
        ];
        const found = USERS.find((u)=>u.username === username && u.password === password);
        if (!found) return null;
        const permList = __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$permissions$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ROLE_DEFAULT_PERMISSIONS"][found.role] || [];
        const u = {
            username: found.username,
            role: found.role,
            name: found.name,
            permissions: permList
        };
        localStorage.setItem("pharmacy_user", JSON.stringify(u));
        setUser(u);
        return u;
    };
    const logout = ()=>{
        localStorage.removeItem("pharmacy_user");
        setUser(null);
    };
    // التحقق من الصلاحيات
    const hasPermission = (perm)=>{
        if (!user) return false;
        if (!user.permissions) return false;
        return user.permissions.includes(perm);
    };
    // التحقق من الصلاحية الخاصة بالصفحة
    const canAccessRoute = (path)=>{
        if (!user) return false;
        const required = __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$permissions$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ROUTE_PERMISSIONS"][path];
        if (!required) return true; // صفحة عامة
        return required.some((perm)=>user.permissions.includes(perm));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            login,
            logout,
            hasPermission,
            canAccessRoute,
            loading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/AuthContext.js",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
const useAuth = ()=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(AuthContext); // // context/AuthContext.js
 // import { createContext, useContext, useState } from "react";
 // const AuthContext = createContext();
 // export function AuthProvider({ children }) {
 //   // مستخدم افتراضي (يمكن تعديله لاحقًا من شاشة الدخول)
 //   const [user, setUser] = useState({
 //     name: "المدير أحمد",
 //     role: "admin", // admin | cashier | pharmacist
 //   });
 //   // التحقق من الصلاحيات
 //   const hasPermission = (roles) => roles.includes(user.role);
 //   return (
 //     <AuthContext.Provider value={{ user, setUser, hasPermission }}>
 //       {children}
 //     </AuthContext.Provider>
 //   );
 // }
 // export function useAuth() {
 //   return useContext(AuthContext);
 // }
 // import { createContext, useContext, useState } from "react";
 // const AuthContext = createContext();
 // export function AuthProvider({ children }) {
 //   const [user, setUser] = useState({
 //     name: "المدير أحمد",
 //     role: "admin", // admin | cashier | pharmacist
 //   });
 //   const hasPermission = (roles) => {
 //     return roles.includes(user.role);
 //   };
 //   return (
 //     <AuthContext.Provider value={{ user, setUser, hasPermission }}>
 //       {children}
 //     </AuthContext.Provider>
 //   );
 // }
 // export const useAuth = () => useContext(AuthContext);
}),
"[externals]/react-hot-toast [external] (react-hot-toast, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("react-hot-toast");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/pages/_app.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>MyApp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AuthContext.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/react-hot-toast [external] (react-hot-toast, esm_import)");
(()=>{
    const e = new Error("Cannot find module '../components/Guard'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function MyApp({ Component, pageProps }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["Toaster"], {
                position: "top-center"
            }, void 0, false, {
                fileName: "[project]/pages/_app.js",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Guard, {
                Component: Component,
                pageProps: pageProps
            }, void 0, false, {
                fileName: "[project]/pages/_app.js",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/_app.js",
        lineNumber: 8,
        columnNumber: 5
    }, this);
} // // pages/_app.js
 // import "../styles/globals.css";
 // import { Toaster } from "react-hot-toast";
 // import { AuthProvider } from "../context/AuthContext";
 // import { InventoryProvider } from "../context/InventoryContext";
 // import { ShiftProvider } from "../context/ShiftContext";
 // export default function MyApp({ Component, pageProps }) {
 //   return (
 //     <AuthProvider>
 //       <InventoryProvider>
 //         <ShiftProvider>
 //           <>
 //             <Toaster position="top-center" />
 //             <Component {...pageProps} />
 //           </>
 //         </ShiftProvider>
 //       </InventoryProvider>
 //     </AuthProvider>
 //   );
 // }
 // // pages/_app.js
 // import "../styles/globals.css";
 // import { useRouter } from "next/router";
 // import AuthGuard from "../components/AuthGuard";
 // import { InventoryProvider } from "../context/InventoryContext";
 // export default function MyApp({ Component, pageProps }) {
 //   const router = useRouter();
 //   const publicRoutes = ["/"]; // صفحة تسجيل الدخول مثلاً
 //   const isPublic = publicRoutes.includes(router.pathname);
 //   if (isPublic) {
 //     return (
 //       <InventoryProvider>
 //         <Component {...pageProps} />
 //       </InventoryProvider>
 //     );
 //   }
 //   return (
 //     <InventoryProvider>
 //       <AuthGuard>
 //         <Component {...pageProps} />
 //       </AuthGuard>
 //     </InventoryProvider>
 //   );
 // }
 // import '../styles/globals.css'
 // import { useRouter } from 'next/router'
 // import AuthGuard from '../components/AuthGuard'
 // export default function MyApp({ Component, pageProps }) {
 //   const router = useRouter()
 //   // المسارات العامة
 //   const publicRoutes = ['/']
 //   const isPublic = publicRoutes.includes(router.pathname)
 //   if (isPublic) {
 //     return <Component {...pageProps} />
 //   }
 //   return (
 //     <AuthGuard>
 //       <Component {...pageProps} />
 //     </AuthGuard>
 //   )
 // }
 // // pages/_app.js
 // import '../styles/globals.css'
 // import { useRouter } from 'next/router'
 // import AuthGuard from '../components/AuthGuard'
 // export default function MyApp({ Component, pageProps }) {
 //   const router = useRouter()
 //   // المسارات المسموح الوصول لها بدون تسجيل دخول
 //   const publicRoutes = ['/']
 //   const isPublic = publicRoutes.includes(router.pathname)
 //   if (isPublic) {
 //     return <Component {...pageProps} />
 //   }
 //   return (
 //     <AuthGuard>
 //       <Component {...pageProps} />
 //     </AuthGuard>
 //   )
 // }
 // // pages/_app.js
 // import '../styles/globals.css'
 // import { Toaster } from 'react-hot-toast'
 // export default function MyApp({ Component, pageProps }) {
 //   return (
 //     <>
 //       {/* ✅ مكوّن التوستر العام */}
 //       <Toaster
 //         position="top-left"
 //         toastOptions={{
 //           duration: 3000,
 //           style: { fontFamily: 'Tajawal, sans-serif', direction: 'rtl' },
 //           success: {
 //             iconTheme: {
 //               primary: '#10B981',
 //               secondary: 'white',
 //             },
 //           },
 //           error: {
 //             iconTheme: {
 //               primary: '#EF4444',
 //               secondary: 'white',
 //             },
 //           },
 //         }}
 //       />
 //       <Component {...pageProps} />
 //     </>
 //   )
 // }
 // // pages/_app.js
 // import '../styles/globals.css' // استيراد تنسيقات Tailwind
 // import { Tajawal } from 'next/font/google'
 // // تحميل الخط من Google
 // const tajawal = Tajawal({
 //   subsets: ['arabic'],
 //   weight: ['400', '500', '700']
 // })
 // export default function MyApp({ Component, pageProps }) {
 //   return (
 //     <div className={tajawal.className}>
 //       <Component {...pageProps} />
 //     </div>
 //   )
 // }
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__66140ede._.js.map