(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/SafeDate.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SafeDate
]);
function SafeDate({ value }) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        return new Date(value).toLocaleString("ar-EG");
    } catch  {
        return "";
    }
}
_c = SafeDate;
var _c;
__turbopack_context__.k.register(_c, "SafeDate");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/SafeDate.js [client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/SafeDate.js [client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_SafeDate_629bb44c.js.map