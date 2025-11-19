module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[project]/context/AuthContext.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// context/AuthContext.js
__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])();
const AuthProvider = ({ children })=>{
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    // 📌 Fake Users (سيتم استبدالهم لاحقاً بالباك اند)
    const fakeUsers = [
        {
            username: "admin",
            password: "123",
            role: "admin",
            permissions: [
                "view_dashboard",
                "manage_users",
                "manage_medicines",
                "view_sales",
                "add_sale",
                "view_inventory",
                "view_reports",
                "print_reports",
                "shift_manage"
            ]
        },
        {
            username: "ph",
            password: "123",
            role: "pharmacist",
            permissions: [
                "manage_medicines",
                "view_inventory",
                "add_sale",
                "view_sales"
            ]
        },
        {
            username: "ca",
            password: "123",
            role: "cashier",
            permissions: [
                "add_sale",
                "view_sales",
                "shift_manage"
            ]
        }
    ];
    // ✔ تحميل الجلسة من localStorage
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const saved = localStorage.getItem("pharm_user");
        if (saved) {
            setUser(JSON.parse(saved));
        }
        setLoading(false);
    }, []);
    // ✔ تسجيل الدخول
    const login = (username, password)=>{
        const found = fakeUsers.find((u)=>u.username === username && u.password === password);
        if (!found) return {
            success: false,
            message: "بيانات الدخول غير صحيحة"
        };
        const loggedUser = {
            username: found.username,
            role: found.role,
            permissions: found.permissions
        };
        localStorage.setItem("pharm_user", JSON.stringify(loggedUser));
        setUser(loggedUser);
        return {
            success: true
        };
    };
    // ✔ تسجيل الخروج
    const logout = ()=>{
        localStorage.removeItem("pharm_user");
        setUser(null);
    };
    // ✔ فحص صلاحية معينة
    const hasPermission = (perm)=>{
        if (!user || !user.permissions) return false;
        return user.permissions.includes(perm);
    };
    // ✔ فحص صفحة حسب مسارها
    const routePermissions = {
        "/dashboard": [
            "view_dashboard"
        ],
        "/users": [
            "manage_users"
        ],
        "/products": [
            "manage_medicines",
            "view_inventory"
        ],
        "/inventory": [
            "view_inventory"
        ],
        "/sales": [
            "add_sale",
            "view_sales"
        ],
        "/reports": [
            "view_reports"
        ],
        "/accounts": [
            "manage_accounts"
        ],
        "/shift": [
            "shift_manage"
        ]
    };
    const canAccessRoute = (path)=>{
        const required = routePermissions[path];
        if (!required) return true; // صفحة عامة أو لا تحتاج صلاحيات
        if (!user?.permissions) return false;
        return required.some((perm)=>user.permissions.includes(perm));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            login,
            logout,
            hasPermission,
            canAccessRoute
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/AuthContext.js",
        lineNumber: 110,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
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
"[project]/components/Guard.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Guard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AuthContext.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
;
function Guard({ Component, pageProps }) {
    const { user, loading, canAccessRoute } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (loading) return;
        const path = router.pathname;
        const publicRoutes = [
            "/",
            "/403"
        ];
        if (publicRoutes.includes(path)) return;
        if (!user) {
            router.replace("/");
            return;
        }
        if (!canAccessRoute(path)) {
            router.replace("/403");
            return;
        }
    }, [
        loading,
        router.pathname,
        user
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            dir: "rtl",
            className: "flex items-center justify-center h-screen",
            children: "جاري التحقق من الجلسة..."
        }, void 0, false, {
            fileName: "[project]/components/Guard.js",
            lineNumber: 30,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
        ...pageProps
    }, void 0, false, {
        fileName: "[project]/components/Guard.js",
        lineNumber: 36,
        columnNumber: 10
    }, this);
}
}),
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
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Guard$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Guard.js [ssr] (ecmascript)");
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Guard$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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

//# sourceMappingURL=%5Broot-of-the-server%5D__925fbd0f._.js.map