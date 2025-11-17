module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/react-hot-toast [external] (react-hot-toast, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("react-hot-toast");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/react [external] (react, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react", () => require("react"));

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
function AuthProvider({ children }) {
    // مستخدم افتراضي (يمكن تعديله لاحقًا من شاشة الدخول)
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: "المدير أحمد",
        role: "admin"
    });
    // التحقق من الصلاحيات
    const hasPermission = (roles)=>roles.includes(user.role);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            setUser,
            hasPermission
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/AuthContext.js",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
function useAuth() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(AuthContext);
} // import { createContext, useContext, useState } from "react";
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
"[project]/context/InventoryContext.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// context/InventoryContext.js
__turbopack_context__.s([
    "InventoryProvider",
    ()=>InventoryProvider,
    "useInventory",
    ()=>useInventory
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const InventoryContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])();
function InventoryProvider({ children }) {
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([
        {
            id: 1,
            name: "باراسيتامول 500mg",
            sku: "PRC500",
            company: "صيدليات المتحدة",
            category: "مسكنات",
            purchasePrice: 8,
            price: 12,
            quantity: 30,
            minQty: 10,
            expiryDate: "2025-04-10",
            stockHistory: []
        },
        {
            id: 2,
            name: "فيتامين سي 1000mg",
            sku: "VTC1000",
            company: "الصحة العالمية",
            category: "فيتامينات",
            purchasePrice: 12,
            price: 18,
            quantity: 10,
            minQty: 5,
            expiryDate: "2024-12-15",
            stockHistory: []
        },
        {
            id: 3,
            name: "مضاد حساسية",
            sku: "ANTHST",
            company: "هيومن فارما",
            category: "حساسية",
            purchasePrice: 18,
            price: 25,
            quantity: 5,
            minQty: 5,
            expiryDate: "2024-11-01",
            stockHistory: []
        }
    ]);
    const getProduct = (id)=>products.find((p)=>p.id === Number(id));
    const updateStock = (id, qty, type = "in")=>{
        setProducts((prev)=>prev.map((p)=>{
                if (p.id !== id) return p;
                const newQty = type === "in" ? p.quantity + qty : p.quantity - qty;
                return {
                    ...p,
                    quantity: newQty < 0 ? 0 : newQty,
                    stockHistory: [
                        ...p.stockHistory,
                        {
                            type,
                            qty,
                            date: new Date().toLocaleString()
                        }
                    ]
                };
            }));
    };
    const decreaseStockOnSale = (id, qty)=>updateStock(id, qty, "out");
    const increaseStockOnReturn = (id, qty)=>updateStock(id, qty, "in");
    const getWarnings = (p)=>{
        const warnings = [];
        if (!p) return warnings;
        if (p.expiryDate) {
            const daysLeft = (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
            if (daysLeft < 0) warnings.push("❌ المنتج منتهي الصلاحية!");
            else if (daysLeft < 30) warnings.push(`⚠️ المنتج شارف على الانتهاء خلال ${Math.ceil(daysLeft)} يوم`);
        }
        if (p.quantity < (p.minQty || 5)) {
            warnings.push("🔴 المخزون أقل من الحد الأدنى");
        }
        return warnings;
    };
    const printInventoryReport = ()=>{
        const w = window.open("", "", "width=900,height=700");
        w.document.write(`
      <html dir="rtl" lang="ar">
      <head>
        <title>تقرير المخزون</title>
        <style>
          body { font-family: 'Tajawal', sans-serif; padding:20px; }
          h2 { text-align:center; margin-bottom:10px; }
          table { width:100%; border-collapse:collapse; font-size:13px; }
          th, td { border:1px solid #ddd; padding:6px; text-align:right; }
          th { background:#f3f4f6; }
        </style>
      </head>
      <body>
        <h2>📦 تقرير المخزون</h2>
        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الكود</th>
              <th>الفئة</th>
              <th>الشركة</th>
              <th>سعر الشراء</th>
              <th>سعر البيع</th>
              <th>الكمية</th>
              <th>الحد الأدنى</th>
              <th>تاريخ الانتهاء</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((p)=>`
              <tr>
                <td>${p.name}</td>
                <td>${p.sku}</td>
                <td>${p.category}</td>
                <td>${p.company}</td>
                <td>${p.purchasePrice || ""}</td>
                <td>${p.price}</td>
                <td>${p.quantity}</td>
                <td>${p.minQty}</td>
                <td>${p.expiryDate || ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `);
        w.document.close();
        w.print();
    };
    const updateProduct = (id, updates)=>{
        setProducts((prev)=>prev.map((p)=>p.id === Number(id) ? {
                    ...p,
                    ...updates
                } : p));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(InventoryContext.Provider, {
        value: {
            products,
            setProducts,
            getProduct,
            getWarnings,
            updateStock,
            decreaseStockOnSale,
            increaseStockOnReturn,
            printInventoryReport,
            updateProduct
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/InventoryContext.js",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
function useInventory() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(InventoryContext);
} // // context/InventoryContext.js
 // import { createContext, useContext, useState } from "react";
 // const InventoryContext = createContext();
 // export function InventoryProvider({ children }) {
 //   const [products, setProducts] = useState([
 //     {
 //       id: 1,
 //       name: "باراسيتامول 500mg",
 //       sku: "PRC500",
 //       company: "صيدليات المتحدة",
 //       category: "مسكنات",
 //       price: 12,
 //       quantity: 30,
 //       minQty: 10,
 //       expiryDate: "2025-04-10",
 //       stockHistory: [],
 //     },
 //     {
 //       id: 2,
 //       name: "فيتامين سي 1000mg",
 //       sku: "VTC1000",
 //       company: "الصحة العالمية",
 //       category: "فيتامينات",
 //       price: 18,
 //       quantity: 10,
 //       minQty: 5,
 //       expiryDate: "2024-12-15",
 //       stockHistory: [],
 //     },
 //     {
 //       id: 3,
 //       name: "انتي هستامين",
 //       sku: "ANTHST",
 //       company: "هيومن فارما",
 //       category: "حساسية",
 //       price: 25,
 //       quantity: 5,
 //       minQty: 5,
 //       expiryDate: "2024-11-01",
 //       stockHistory: [],
 //     },
 //   ]);
 //   const getProduct = (id) => products.find((p) => p.id === id);
 //   const updateStock = (id, qty, type = "in") => {
 //     setProducts((prev) =>
 //       prev.map((p) => {
 //         if (p.id !== id) return p;
 //         const newQty = type === "in" ? p.quantity + qty : p.quantity - qty;
 //         return {
 //           ...p,
 //           quantity: newQty < 0 ? 0 : newQty,
 //           stockHistory: [
 //             ...p.stockHistory,
 //             {
 //               type,
 //               qty,
 //               date: new Date().toLocaleString(),
 //             },
 //           ],
 //         };
 //       })
 //     );
 //   };
 //   const decreaseStockOnSale = (id, qty) => {
 //     updateStock(id, qty, "out");
 //   };
 //   const increaseStockOnReturn = (id, qty) => {
 //     updateStock(id, qty, "in");
 //   };
 //   const getWarnings = (p) => {
 //     const warnings = [];
 //     if (!p) return warnings;
 //     if (p.expiryDate) {
 //       const daysLeft =
 //         (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
 //       if (daysLeft < 0) {
 //         warnings.push("❌ المنتج منتهي الصلاحية!");
 //       } else if (daysLeft < 30) {
 //         warnings.push(`⚠️ المنتج سينتهي خلال ${Math.ceil(daysLeft)} يوم`);
 //       }
 //     }
 //     if (p.quantity < (p.minQty ?? 5)) {
 //       warnings.push("🔴 المخزون منخفض");
 //     }
 //     return warnings;
 //   };
 //   return (
 //     <InventoryContext.Provider
 //       value={{
 //         products,
 //         setProducts,
 //         getProduct,
 //         updateStock,
 //         decreaseStockOnSale,
 //         increaseStockOnReturn,
 //         getWarnings,
 //       }}
 //     >
 //       {children}
 //     </InventoryContext.Provider>
 //   );
 // }
 // export function useInventory() {
 //   return useContext(InventoryContext);
 // }
}),
"[project]/context/ShiftContext.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// context/ShiftContext.js
__turbopack_context__.s([
    "ShiftProvider",
    ()=>ShiftProvider,
    "useShift",
    ()=>useShift
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const ShiftContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])(null);
const STORAGE_KEY = "pharmacy_shifts_v1";
function loadInitialShifts() {
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
}
function ShiftProvider({ children }) {
    const [shifts, setShifts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    // تحميل من localStorage عند أول تشغيل على المتصفح
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const data = loadInitialShifts();
        setShifts(data);
    }, []);
    // حفظ في localStorage عند التغيير
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        shifts
    ]);
    const currentShift = shifts.find((s)=>!s.closedAt) || null;
    const openShift = (cashier, note = "")=>{
        // لو في شفت مفتوح لا نفتح جديد
        if (currentShift) return currentShift;
        const id = `SH-${String(Date.now()).slice(-6)}`;
        const now = new Date().toISOString();
        const newShift = {
            id,
            cashier,
            openedAt: now,
            closedAt: null,
            openingNote: note || "",
            closingNote: "",
            sales: [],
            totals: {
                totalSales: 0,
                totalCash: 0,
                totalCard: 0,
                totalWallet: 0,
                invoicesCount: 0
            }
        };
        setShifts((prev)=>[
                ...prev,
                newShift
            ]);
        return newShift;
    };
    const closeCurrentShift = (note = "")=>{
        if (!currentShift) return;
        const now = new Date().toISOString();
        setShifts((prev)=>prev.map((s)=>s.id === currentShift.id ? {
                    ...s,
                    closedAt: now,
                    closingNote: note || ""
                } : s));
    };
    const registerSaleInShift = (invoice)=>{
        setShifts((prev)=>{
            const idx = prev.findIndex((s)=>!s.closedAt);
            if (idx === -1) return prev; // لا يوجد شفت مفتوح
            const shift = prev[idx];
            const sign = invoice.type === "return" ? -1 : 1;
            const amount = Number(invoice.total || 0);
            const payment = invoice.payment || "cash";
            const totals = shift.totals || {
                totalSales: 0,
                totalCash: 0,
                totalCard: 0,
                totalWallet: 0,
                invoicesCount: 0
            };
            const updatedTotals = {
                totalSales: totals.totalSales + sign * amount,
                invoicesCount: totals.invoicesCount + 1,
                totalCash: totals.totalCash + (payment === "cash" ? sign * amount : 0),
                totalCard: totals.totalCard + (payment === "card" ? sign * amount : 0),
                totalWallet: totals.totalWallet + (payment === "wallet" ? sign * amount : 0)
            };
            const updatedShift = {
                ...shift,
                totals: updatedTotals,
                sales: [
                    ...shift.sales || [],
                    invoice
                ]
            };
            const copy = [
                ...prev
            ];
            copy[idx] = updatedShift;
            return copy;
        });
    };
    const getShiftById = (id)=>shifts.find((s)=>s.id === id) || null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ShiftContext.Provider, {
        value: {
            shifts,
            currentShift,
            openShift,
            closeCurrentShift,
            registerSaleInShift,
            getShiftById
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/ShiftContext.js",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
function useShift() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(ShiftContext);
    if (!ctx) {
        throw new Error("useShift must be used within a ShiftProvider");
    }
    return ctx;
}
}),
"[project]/pages/_app.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/_app.js
__turbopack_context__.s([
    "default",
    ()=>MyApp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/react-hot-toast [external] (react-hot-toast, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AuthContext.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$InventoryContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/InventoryContext.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ShiftContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/ShiftContext.js [ssr] (ecmascript)");
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
function MyApp({ Component, pageProps }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$InventoryContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["InventoryProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ShiftContext$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ShiftProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hot$2d$toast__$5b$external$5d$__$28$react$2d$hot$2d$toast$2c$__esm_import$29$__["Toaster"], {
                            position: "top-center"
                        }, void 0, false, {
                            fileName: "[project]/pages/_app.js",
                            lineNumber: 14,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
                            ...pageProps
                        }, void 0, false, {
                            fileName: "[project]/pages/_app.js",
                            lineNumber: 15,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/pages/_app.js",
                lineNumber: 12,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/_app.js",
            lineNumber: 11,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/_app.js",
        lineNumber: 10,
        columnNumber: 5
    }, this);
} // // pages/_app.js
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

//# sourceMappingURL=%5Broot-of-the-server%5D__37a2d023._.js.map