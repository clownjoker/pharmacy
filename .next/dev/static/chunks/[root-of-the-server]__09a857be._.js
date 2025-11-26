(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/theme.js [client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ConfirmModal.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConfirmModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function ConfirmModal({ visible, title, message, confirmText, confirmColor, onConfirm, onCancel }) {
    if (!visible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-sm p-6 text-right bg-white rounded-lg shadow-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "mb-2 text-lg font-semibold text-gray-800",
                    children: title
                }, void 0, false, {
                    fileName: "[project]/components/ConfirmModal.js",
                    lineNumber: 7,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-4 text-sm text-gray-600",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/components/ConfirmModal.js",
                    lineNumber: 8,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_c = ConfirmModal;
var _c;
__turbopack_context__.k.register(_c, "ConfirmModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AuthGuard.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/AuthGuard.js
__turbopack_context__.s([
    "default",
    ()=>AuthGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function AuthGuard({ children, allowedRoles = [], requiredPermissions = [] }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("checking"); // checking | allowed | denied
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthGuard.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                const raw = localStorage.getItem("pharmacy_user");
                if (!raw) {
                    setStatus("denied");
                    router.replace("/");
                    return;
                }
                const user = JSON.parse(raw || "{}");
                const userRole = user.role;
                const userPerms = Array.isArray(user.permissions) ? user.permissions : [];
                // 1) التحقق من الدور
                if (allowedRoles.length && !allowedRoles.includes(userRole)) {
                    setStatus("denied");
                    router.replace("/403");
                    return;
                }
                // 2) التحقق من الصلاحيات
                if (requiredPermissions.length && !requiredPermissions.every({
                    "AuthGuard.useEffect": (p)=>userPerms.includes(p)
                }["AuthGuard.useEffect"])) {
                    setStatus("denied");
                    router.replace("/403");
                    return;
                }
                setStatus("allowed");
            } catch (err) {
                console.error("AuthGuard error:", err);
                setStatus("denied");
                router.replace("/");
            }
        }
    }["AuthGuard.useEffect"], [
        router,
        allowedRoles,
        requiredPermissions
    ]);
    if (status !== "allowed") return null;
    return children;
}
_s(AuthGuard, "qskDtr0ypDootNWjCw1GpFZRjh4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthGuard;
var _c;
__turbopack_context__.k.register(_c, "AuthGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/context/AuthContext.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// context/AuthContext.js
__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])();
function AuthProvider({ children }) {
    _s();
    // مستخدم افتراضي (يمكن تعديله لاحقًا من شاشة الدخول)
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "المدير أحمد",
        role: "admin"
    });
    // التحقق من الصلاحيات
    const hasPermission = (roles)=>roles.includes(user.role);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
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
_s(AuthProvider, "NfsT71ITrYEu/z5EzNbc45v1eF0=");
_c = AuthProvider;
function useAuth() {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
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
_s1(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Header.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/Header.js
__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AuthContext.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function Header() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (!user) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        dir: "rtl",
        className: "flex items-center justify-between p-4 bg-white border-b shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: ()=>router.push("/dashboard"),
                className: "flex items-center gap-2 cursor-pointer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center w-10 h-10 text-xl text-white rounded-lg shadow bg-sky-600",
                        children: "💊"
                    }, void 0, false, {
                        fileName: "[project]/components/Header.js",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-lg font-bold text-gray-800",
                                children: "نظام الصيدلية الذكي"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 28,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setOpen(!open),
                        className: "flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-800",
                                children: user.username
                            }, void 0, false, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 39,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-0 z-50 w-48 mt-2 overflow-hidden bg-white border rounded-lg shadow-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-4 py-2 text-sm text-gray-700 border-b bg-gray-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-semibold",
                                        children: user.username
                                    }, void 0, false, {
                                        fileName: "[project]/components/Header.js",
                                        lineNumber: 46,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/profile",
                                className: "block px-4 py-2 text-sm hover:bg-gray-50",
                                children: "🧑‍⚕️ الملف الشخصي"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(Header, "fcoiiSWuPbRQZrOsRKwWMKWZEWY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Layout.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/theme.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ConfirmModal$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ConfirmModal.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthGuard$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AuthGuard.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
function Layout({ user, title, children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [showLogoutModal, setShowLogoutModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthGuard$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            dir: "rtl",
            className: "flex flex-col min-h-screen bg-gray-50",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "sticky top-0 z-40 w-full bg-white border-b shadow-sm",
                    style: {
                        borderColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].colors.primary}20`
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-between gap-3 px-4 py-3 mx-auto sm:flex-row max-w-7xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center w-10 h-10 text-xl font-bold text-white rounded-md shadow",
                                        style: {
                                            background: __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].colors.primary
                                        },
                                        children: "💊"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Layout.js",
                                        lineNumber: 54,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-lg font-bold text-gray-800",
                                                children: "نظام الصيدلية الذكي"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 61,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "flex flex-wrap justify-center gap-1 sm:gap-2",
                                children: links.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push(item.path),
                                        className: `px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${router.pathname === item.path ? 'text-white shadow-sm' : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'}`,
                                        style: {
                                            backgroundColor: router.pathname === item.path ? __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].colors.primary : 'transparent',
                                            borderColor: router.pathname === item.path ? __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].colors.primary : '#e5e7eb'
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-700",
                                        children: [
                                            "مرحبًا،",
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-sky-700",
                                                children: user?.name || 'مستخدم'
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 95,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowLogoutModal(true),
                                        className: "flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 border rounded-md shadow-sm",
                                        style: {
                                            backgroundColor: 'rgba(239, 68, 68, 0.85)',
                                            borderColor: 'rgba(239, 68, 68, 0.5)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaSignOutAlt"], {
                                                className: "text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 111,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8",
                    children: [
                        title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ConfirmModal$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    visible: showLogoutModal,
                    title: "تأكيد تسجيل الخروج",
                    message: "هل ترغب في تسجيل الخروج من النظام؟",
                    confirmText: "تسجيل الخروج",
                    confirmColor: __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].colors.danger,
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
_s(Layout, "DzOO2eKV1hgpe8rqzJGlaPscy+A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Layout;
var _c;
__turbopack_context__.k.register(_c, "Layout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Modal.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/Modal.js
__turbopack_context__.s([
    "default",
    ()=>Modal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function Modal({ title, children, onClose, onConfirm, confirmText = 'حفظ', cancelText = 'إلغاء', showFooter = true, size = 'md' }) {
    _s();
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl'
    };
    // 🔹 منع التمرير أثناء فتح المودال
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            document.body.classList.add('modal-open');
            return ({
                "Modal.useEffect": ()=>document.body.classList.remove('modal-open')
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4",
        dir: "rtl",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `relative w-full ${sizeClasses[size]} p-6 bg-white rounded-lg shadow-xl border border-gray-100 animate-fadeIn`,
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between pb-2 mb-4 border-b border-gray-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold text-gray-800",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/components/Modal.js",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-h-[70vh] overflow-y-auto text-gray-700",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/Modal.js",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                showFooter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "px-5 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50",
                            children: cancelText
                        }, void 0, false, {
                            fileName: "[project]/components/Modal.js",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this),
                        onConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(Modal, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = Modal;
var _c;
__turbopack_context__.k.register(_c, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/pharmacist.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/pharmacist.js
__turbopack_context__.s([
    "default",
    ()=>PharmacistPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Layout.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Modal.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
// نفس أسلوب الكاشير
const API_BASE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
function PharmacistPage() {
    _s();
    // 🔹 المستخدم الحالي (تقدر تربطه لاحقاً بالـ login كما في الكاشير)
    const [user] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        name: 'الصيدلي محمد',
        role: 'pharmacist',
        id: 2
    });
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const today = new Date();
    // 🔹 تبويبات الشاشة
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('medicines'); // medicines | sales | alerts
    // 🔹 الأدوية
    const [medicines, setMedicines] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [companyFilter, setCompanyFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [stockFilter, setStockFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('all'); // all | low | expired
    // 🔹 البيع من شاشة الصيدلي
    const [showSaleModal, setShowSaleModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saleForm, setSaleForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        medId: '',
        qty: 1,
        price: 0
    });
    // 🔹 مبيعات الصيدلي (تقرير)
    const [sales, setSales] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [dateRange, setDateRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('today'); // today | week | month | all
    // ================== تحميل البيانات من الباك-إند ==================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PharmacistPage.useEffect": ()=>{
            const loadData = {
                "PharmacistPage.useEffect.loadData": async ()=>{
                    try {
                        const [medRes, salesRes] = await Promise.all([
                            fetch(`${API_BASE}/pharmacist/medicines`),
                            fetch(`${API_BASE}/pharmacist/sales`)
                        ]);
                        const medJson = await medRes.json();
                        const salesJson = await salesRes.json();
                        if (!medRes.ok || medJson.success === false) {
                            throw new Error(medJson.message || 'فشل تحميل الأدوية');
                        }
                        if (!salesRes.ok || salesJson.success === false) {
                            throw new Error(salesJson.message || 'فشل تحميل المبيعات');
                        }
                        const meds = Array.isArray(medJson.data || medJson) ? medJson.data || medJson : [];
                        const salesArr = Array.isArray(salesJson.data || salesJson) ? salesJson.data || salesJson : [];
                        setMedicines(meds);
                        setSales(salesArr);
                    } catch (err) {
                        console.error(err);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error('⚠️ فشل الاتصال بسيرفر الصيدلي');
                    }
                }
            }["PharmacistPage.useEffect.loadData"];
            loadData();
        }
    }["PharmacistPage.useEffect"], []);
    // ================== Helpers ==================
    const companies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PharmacistPage.useMemo[companies]": ()=>{
            const set = new Set(medicines.map({
                "PharmacistPage.useMemo[companies]": (m)=>m.company
            }["PharmacistPage.useMemo[companies]"]).filter(Boolean));
            return [
                'all',
                ...Array.from(set)
            ];
        }
    }["PharmacistPage.useMemo[companies]"], [
        medicines
    ]);
    const lowStock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PharmacistPage.useMemo[lowStock]": ()=>medicines.filter({
                "PharmacistPage.useMemo[lowStock]": (m)=>m.quantity <= (m.minQty || 5)
            }["PharmacistPage.useMemo[lowStock]"])
    }["PharmacistPage.useMemo[lowStock]"], [
        medicines
    ]);
    const expired = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PharmacistPage.useMemo[expired]": ()=>medicines.filter({
                "PharmacistPage.useMemo[expired]": (m)=>new Date(m.expiry) < today
            }["PharmacistPage.useMemo[expired]"])
    }["PharmacistPage.useMemo[expired]"], [
        medicines,
        today
    ]);
    const filteredMedicines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PharmacistPage.useMemo[filteredMedicines]": ()=>{
            const s = search.trim().toLowerCase();
            return medicines.filter({
                "PharmacistPage.useMemo[filteredMedicines]": (m)=>{
                    const matchText = m.name.toLowerCase().includes(s) || (m.company || '').toLowerCase().includes(s) || (m.category || '').toLowerCase().includes(s) || (m.sku || '').toLowerCase().includes(s);
                    if (!matchText) return false;
                    const matchCompany = companyFilter === 'all' ? true : m.company === companyFilter;
                    const isLow = m.quantity <= (m.minQty || 5);
                    const isExpired = new Date(m.expiry) < today;
                    const matchStock = stockFilter === 'all' ? true : stockFilter === 'low' ? isLow : isExpired;
                    return matchCompany && matchStock;
                }
            }["PharmacistPage.useMemo[filteredMedicines]"]);
        }
    }["PharmacistPage.useMemo[filteredMedicines]"], [
        medicines,
        search,
        companyFilter,
        stockFilter,
        today
    ]);
    const formatCurrency = (v)=>`${Number(v || 0).toLocaleString('ar-SA')} ر.س`;
    const withinRange = (dateStr)=>{
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const oneDay = 24 * 60 * 60 * 1000;
        const diff = (today - d) / oneDay;
        if (dateRange === 'today') {
            return d.toDateString() === today.toDateString();
        }
        if (dateRange === 'week') {
            return diff >= 0 && diff <= 7;
        }
        if (dateRange === 'month') {
            return diff >= 0 && diff <= 30;
        }
        if (dateRange === 'all') {
            return true;
        }
        return true;
    };
    const filteredSales = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PharmacistPage.useMemo[filteredSales]": ()=>sales.filter({
                "PharmacistPage.useMemo[filteredSales]": (s)=>withinRange(s.date)
            }["PharmacistPage.useMemo[filteredSales]"])
    }["PharmacistPage.useMemo[filteredSales]"], [
        sales,
        dateRange
    ]);
    const totalSalesValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PharmacistPage.useMemo[totalSalesValue]": ()=>filteredSales.reduce({
                "PharmacistPage.useMemo[totalSalesValue]": (sum, s)=>sum + s.qty * s.price
            }["PharmacistPage.useMemo[totalSalesValue]"], 0)
    }["PharmacistPage.useMemo[totalSalesValue]"], [
        filteredSales
    ]);
    // ================== البيع من شاشة الصيدلي ==================
    const openSaleModal = (medId)=>{
        const med = medicines.find((m)=>m.id === medId);
        if (!med) return;
        setSaleForm({
            medId,
            qty: 1,
            price: med.price || 0
        });
        setShowSaleModal(true);
    };
    const submitSale = async ()=>{
        const med = medicines.find((m)=>m.id === Number(saleForm.medId));
        if (!med) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error('⚠️ يرجى اختيار دواء صحيح');
            return;
        }
        const qty = Number(saleForm.qty);
        const price = Number(saleForm.price || med.price);
        if (!qty || qty <= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error('❌ الكمية غير صالحة');
            return;
        }
        if (qty > med.quantity) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error('⚠️ الكمية المطلوبة أكبر من المتاح');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/pharmacist/sale`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    medicine_id: med.id,
                    qty,
                    price,
                    pharmacist_id: user.id || null
                })
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                throw new Error(data.message || 'فشل تسجيل عملية البيع');
            }
            // تحديث المخزون في الواجهة
            if (data.medicine) {
                setMedicines((prev)=>prev.map((m)=>m.id === data.medicine.id ? {
                            ...m,
                            quantity: data.medicine.quantity
                        } : m));
            } else {
                // احتياطاً لو ما رجّع الدواء
                setMedicines((prev)=>prev.map((m)=>m.id === med.id ? {
                            ...m,
                            quantity: m.quantity - qty
                        } : m));
            }
            // إضافة السطر الجديد في جدول المبيعات
            if (data.sale) {
                setSales((prev)=>[
                        data.sale,
                        ...prev
                    ]);
            } else {
                const sale = {
                    id: Date.now(),
                    date: new Date().toISOString().slice(0, 10),
                    name: med.name,
                    qty,
                    price
                };
                setSales((prev)=>[
                        sale,
                        ...prev
                    ]);
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].success(`✅ تم تسجيل بيع ${qty} من ${med.name}`);
            setShowSaleModal(false);
        } catch (err) {
            console.error(err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error(err.message || 'حدث خطأ أثناء تسجيل البيع');
        }
    };
    // ================== طباعة تقرير المبيعات ==================
    const handlePrintReport = ()=>{
        const html = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8" />
          <title>تقرير مبيعات الصيدلي</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
            h2 { color:#0ea5e9; margin-bottom: 8px; }
            p { margin: 4px 0; }
            table { width:100%; border-collapse: collapse; margin-top:10px; }
            th, td { border:1px solid #ddd; padding:6px; text-align:center; font-size: 13px; }
            th { background:#f3f4f6; }
            tfoot td { font-weight:bold; color:#0ea5e9; }
          </style>
        </head>
        <body>
          <h2>💊 تقرير مبيعات الصيدلي</h2>
          <p>النطاق: ${dateRange === 'today' ? 'اليوم' : dateRange === 'week' ? 'آخر 7 أيام' : dateRange === 'month' ? 'آخر 30 يوم' : 'كل المبيعات'}</p>
          <table>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>اسم الدواء</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSales.length ? filteredSales.map((s)=>`
                        <tr>
                          <td>${s.date}</td>
                          <td>${s.name}</td>
                          <td>${s.qty}</td>
                          <td>${formatCurrency(s.price)}</td>
                          <td>${formatCurrency(s.qty * s.price)}</td>
                        </tr>`).join('') : `<tr><td colspan="5">لا توجد مبيعات في هذا النطاق</td></tr>`}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4">إجمالي المبيعات</td>
                <td>${formatCurrency(totalSalesValue)}</td>
              </tr>
            </tfoot>
          </table>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 800);
              }, 300);
            };
          </script>
        </body>
      </html>
    `;
        const w = window.open('', '_blank', 'width=900,height=900');
        if (!w) return;
        w.document.write(html);
        w.document.close();
    };
    // ================== UI ==================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        user: user,
        title: "💊 شاشة الصيدلي",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                dir: "rtl",
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-xl font-bold text-gray-800",
                                        children: [
                                            "👨‍⚕️ مرحبًا، ",
                                            user.name
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 326,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-500",
                                        children: "إدارة الأدوية والمبيعات اليومية من شاشة الصيدلي"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 329,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex overflow-hidden border rounded-full bg-gray-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabButton, {
                                        label: "الأدوية",
                                        active: activeTab === 'medicines',
                                        onClick: ()=>setActiveTab('medicines')
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 335,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabButton, {
                                        label: "مبيعات الصيدلي",
                                        active: activeTab === 'sales',
                                        onClick: ()=>setActiveTab('sales')
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 340,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabButton, {
                                        label: "تنبيهات",
                                        active: activeTab === 'alerts',
                                        onClick: ()=>setActiveTab('alerts')
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 345,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 324,
                        columnNumber: 9
                    }, this),
                    activeTab === 'medicines' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MedicinesTab, {
                        medicines: filteredMedicines,
                        search: search,
                        setSearch: setSearch,
                        companies: companies,
                        companyFilter: companyFilter,
                        setCompanyFilter: setCompanyFilter,
                        stockFilter: stockFilter,
                        setStockFilter: setStockFilter,
                        openSaleModal: openSaleModal,
                        router: router
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 355,
                        columnNumber: 11
                    }, this),
                    activeTab === 'sales' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SalesTab, {
                        dateRange: dateRange,
                        setDateRange: setDateRange,
                        filteredSales: filteredSales,
                        formatCurrency: formatCurrency,
                        totalSalesValue: totalSalesValue,
                        onPrint: handlePrintReport
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 370,
                        columnNumber: 11
                    }, this),
                    activeTab === 'alerts' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertsTab, {
                        lowStock: lowStock,
                        expired: expired
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 381,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/pharmacist.js",
                lineNumber: 322,
                columnNumber: 7
            }, this),
            showSaleModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                title: "🧾 تسجيل بيع من الصيدلي",
                onClose: ()=>setShowSaleModal(false),
                onConfirm: submitSale,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    dir: "rtl",
                    className: "space-y-3 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block mb-1 text-xs text-gray-500",
                                    children: "الدواء"
                                }, void 0, false, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 394,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: saleForm.medId,
                                    onChange: (e)=>setSaleForm((f)=>({
                                                ...f,
                                                medId: Number(e.target.value)
                                            })),
                                    className: "w-full px-3 py-2 border rounded-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "— اختر الدواء —"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 407,
                                            columnNumber: 17
                                        }, this),
                                        medicines.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: m.id,
                                                children: [
                                                    m.name,
                                                    " — المخزون: ",
                                                    m.quantity
                                                ]
                                            }, m.id, true, {
                                                fileName: "[project]/pages/pharmacist.js",
                                                lineNumber: 409,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 397,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/pharmacist.js",
                            lineNumber: 393,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block mb-1 text-xs text-gray-500",
                                            children: "الكمية"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 418,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: "1",
                                            value: saleForm.qty,
                                            onChange: (e)=>setSaleForm((f)=>({
                                                        ...f,
                                                        qty: Number(e.target.value)
                                                    })),
                                            className: "w-full px-3 py-2 border rounded-md",
                                            placeholder: "مثال: 1"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 421,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 417,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block mb-1 text-xs text-gray-500",
                                            children: "السعر للوحدة"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 436,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: "0",
                                            value: saleForm.price,
                                            onChange: (e)=>setSaleForm((f)=>({
                                                        ...f,
                                                        price: Number(e.target.value)
                                                    })),
                                            className: "w-full px-3 py-2 border rounded-md",
                                            placeholder: "مثال: 15"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 439,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 435,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/pharmacist.js",
                            lineNumber: 416,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-2 text-sm text-right text-gray-600",
                            children: [
                                "الإجمالي التقريبي:",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-emerald-700",
                                    children: formatCurrency(Number(saleForm.qty || 0) * Number(saleForm.price || 0))
                                }, void 0, false, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 457,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/pharmacist.js",
                            lineNumber: 455,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/pharmacist.js",
                    lineNumber: 392,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/pharmacist.js",
                lineNumber: 387,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/pharmacist.js",
        lineNumber: 321,
        columnNumber: 5
    }, this);
}
_s(PharmacistPage, "TPoTIWAbGFpteZcLyEsQBQegWx8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PharmacistPage;
// ================== تبويبات و أجزاء UI ==================
function TabButton({ label, active, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: `px-4 py-1.5 text-xs sm:text-sm font-medium transition ${active ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:bg-white/60'}`,
        children: label
    }, void 0, false, {
        fileName: "[project]/pages/pharmacist.js",
        lineNumber: 473,
        columnNumber: 5
    }, this);
}
_c1 = TabButton;
function MedicinesTab({ medicines, search, setSearch, companies, companyFilter, setCompanyFilter, stockFilter, setStockFilter, openSaleModal, router }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-white border rounded-lg shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-3 md:grid-cols-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "🔍 بحث بالاسم / الشركة / التصنيف / الكود",
                            value: search,
                            onChange: (e)=>setSearch(e.target.value),
                            className: "w-full px-3 py-2 text-sm border rounded-md"
                        }, void 0, false, {
                            fileName: "[project]/pages/pharmacist.js",
                            lineNumber: 503,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: companyFilter,
                            onChange: (e)=>setCompanyFilter(e.target.value),
                            className: "w-full px-3 py-2 text-sm border rounded-md",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "all",
                                    children: "كل الشركات"
                                }, void 0, false, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 515,
                                    columnNumber: 13
                                }, this),
                                companies.filter((c)=>c !== 'all').map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: c,
                                        children: c
                                    }, c, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 519,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/pharmacist.js",
                            lineNumber: 510,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: stockFilter,
                            onChange: (e)=>setStockFilter(e.target.value),
                            className: "w-full px-3 py-2 text-sm border rounded-md",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "all",
                                    children: "كل الحالات"
                                }, void 0, false, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 529,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "low",
                                    children: "كمية منخفضة"
                                }, void 0, false, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 530,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "expired",
                                    children: "منتهي الصلاحية"
                                }, void 0, false, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 531,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/pharmacist.js",
                            lineNumber: 524,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "hidden text-xs text-gray-500 sm:inline",
                                    children: "عدد الأدوية:"
                                }, void 0, false, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 535,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "px-3 py-1 text-xs font-semibold rounded-full text-sky-700 bg-sky-50",
                                    children: medicines.length
                                }, void 0, false, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 538,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/pharmacist.js",
                            lineNumber: 534,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/pharmacist.js",
                    lineNumber: 502,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/pharmacist.js",
                lineNumber: 501,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto bg-white border rounded-lg shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-sm text-right min-w-[900px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "text-gray-600 bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الدواء"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 550,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الشركة"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 551,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "التصنيف"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 552,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الكود"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 553,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "السعر"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 554,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الكمية"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 555,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الصلاحية"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 556,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2 text-center",
                                        children: "حالة"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 557,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2 text-center",
                                        children: "إجراءات"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 558,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 549,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/pharmacist.js",
                            lineNumber: 548,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: medicines.length ? medicines.map((m)=>{
                                const isLow = m.quantity <= (m.minQty || 5);
                                const isExpired = new Date(m.expiry) < new Date();
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-t hover:bg-gray-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 font-semibold text-gray-800",
                                            children: m.name
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 568,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 text-gray-700",
                                            children: m.company
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 571,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 text-gray-700",
                                            children: m.category || '-'
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 572,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 text-xs text-gray-500",
                                            children: m.sku || '-'
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 575,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 font-semibold text-emerald-700",
                                            children: [
                                                m.price,
                                                " ر.س"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 578,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: `px-3 py-2 ${isLow ? 'text-red-600 font-semibold' : ''}`,
                                            children: m.quantity
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 581,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 text-xs text-gray-600",
                                            children: m.expiry
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 588,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 text-center",
                                            children: isExpired ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-50 rounded-full",
                                                children: "منتهي الصلاحية"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pharmacist.js",
                                                lineNumber: 593,
                                                columnNumber: 25
                                            }, this) : isLow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex px-2 py-0.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-full",
                                                children: "كمية منخفضة"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pharmacist.js",
                                                lineNumber: 597,
                                                columnNumber: 25
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex px-2 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full",
                                                children: "متوفر"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pharmacist.js",
                                                lineNumber: 601,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 591,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap justify-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>openSaleModal(m.id),
                                                        className: "px-3 py-1 text-xs text-white rounded-md bg-emerald-600 hover:bg-emerald-700",
                                                        children: "💸 بيع"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/pharmacist.js",
                                                        lineNumber: 608,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>router.push(`/inventory?product=${m.id}`),
                                                        className: "px-3 py-1 text-xs text-indigo-700 rounded-md bg-indigo-50 hover:bg-indigo-100",
                                                        children: "📦 المخزون"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/pharmacist.js",
                                                        lineNumber: 614,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/pharmacist.js",
                                                lineNumber: 607,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 606,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, m.id, true, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 567,
                                    columnNumber: 19
                                }, this);
                            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    colSpan: 9,
                                    className: "px-3 py-6 text-sm text-center text-gray-500",
                                    children: "لا توجد نتائج مطابقة"
                                }, void 0, false, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 629,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 628,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/pharmacist.js",
                            lineNumber: 561,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/pharmacist.js",
                    lineNumber: 547,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/pharmacist.js",
                lineNumber: 546,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/pharmacist.js",
        lineNumber: 499,
        columnNumber: 5
    }, this);
}
_c2 = MedicinesTab;
function SalesTab({ dateRange, setDateRange, filteredSales, formatCurrency, totalSalesValue, onPrint }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 text-xs sm:text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setDateRange('today'),
                                className: `px-3 py-1.5 rounded-full border ${dateRange === 'today' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`,
                                children: "اليوم"
                            }, void 0, false, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 657,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setDateRange('week'),
                                className: `px-3 py-1.5 rounded-full border ${dateRange === 'week' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`,
                                children: "آخر 7 أيام"
                            }, void 0, false, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 667,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setDateRange('month'),
                                className: `px-3 py-1.5 rounded-full border ${dateRange === 'month' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`,
                                children: "آخر 30 يوم"
                            }, void 0, false, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 677,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setDateRange('all'),
                                className: `px-3 py-1.5 rounded-full border ${dateRange === 'all' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`,
                                children: "كل المبيعات"
                            }, void 0, false, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 687,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 656,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onPrint,
                        className: "self-start px-4 py-2 text-xs text-white rounded-lg shadow-sm bg-emerald-600 sm:text-sm hover:bg-emerald-700",
                        children: "🖨️ طباعة تقرير المبيعات"
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 699,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/pharmacist.js",
                lineNumber: 655,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto bg-white border rounded-lg shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-sm text-right min-w-[700px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "text-gray-600 bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "التاريخ"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 712,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "اسم الدواء"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 713,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الكمية"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 714,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "السعر"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 715,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الإجمالي"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 716,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 711,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/pharmacist.js",
                            lineNumber: 710,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: filteredSales.length ? filteredSales.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-t hover:bg-gray-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2",
                                            children: s.date
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 723,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2",
                                            children: s.name
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 724,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2",
                                            children: s.qty
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 725,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2",
                                            children: formatCurrency(s.price)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 726,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 font-semibold text-sky-700",
                                            children: formatCurrency(s.qty * s.price)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pharmacist.js",
                                            lineNumber: 727,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, s.id, true, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 722,
                                    columnNumber: 17
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    colSpan: 5,
                                    className: "px-3 py-6 text-sm text-center text-gray-500",
                                    children: "لا توجد مبيعات في هذا النطاق"
                                }, void 0, false, {
                                    fileName: "[project]/pages/pharmacist.js",
                                    lineNumber: 734,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 733,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/pharmacist.js",
                            lineNumber: 719,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/pharmacist.js",
                    lineNumber: 709,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/pharmacist.js",
                lineNumber: 708,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        title: "إجمالي المبيعات",
                        value: formatCurrency(totalSalesValue),
                        color: "text-emerald-600"
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 748,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        title: "عدد العمليات",
                        value: filteredSales.length.toLocaleString('ar-SA'),
                        color: "text-sky-600"
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 753,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        title: "متوسط العملية",
                        value: filteredSales.length ? formatCurrency(totalSalesValue / filteredSales.length) : formatCurrency(0),
                        color: "text-amber-600"
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 758,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/pharmacist.js",
                lineNumber: 747,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/pharmacist.js",
        lineNumber: 653,
        columnNumber: 5
    }, this);
}
_c3 = SalesTab;
function AlertsTab({ lowStock, expired }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-white border rounded-lg shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "flex items-center gap-2 mb-3 text-sm font-semibold text-amber-700",
                        children: "⚠️ أدوية بكمية منخفضة"
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 777,
                        columnNumber: 9
                    }, this),
                    lowStock.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "space-y-2 text-sm",
                        children: lowStock.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center justify-between px-3 py-2 border rounded-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-gray-800",
                                                children: m.name
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pharmacist.js",
                                                lineNumber: 788,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: m.company
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pharmacist.js",
                                                lineNumber: 789,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 787,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-0.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-full",
                                        children: [
                                            "الكمية: ",
                                            m.quantity
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 791,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, m.id, true, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 783,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 781,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500",
                        children: "لا توجد أدوية بكمية منخفضة حاليًا 👌"
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 798,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/pharmacist.js",
                lineNumber: 776,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-white border rounded-lg shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "flex items-center gap-2 mb-3 text-sm font-semibold text-red-700",
                        children: "❌ أدوية منتهية الصلاحية"
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 806,
                        columnNumber: 9
                    }, this),
                    expired.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "space-y-2 text-sm",
                        children: expired.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center justify-between px-3 py-2 border rounded-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-gray-800",
                                                children: m.name
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pharmacist.js",
                                                lineNumber: 817,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: m.company
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pharmacist.js",
                                                lineNumber: 818,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 816,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-50 rounded-full",
                                        children: [
                                            "الصلاحية: ",
                                            m.expiry
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/pharmacist.js",
                                        lineNumber: 820,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, m.id, true, {
                                fileName: "[project]/pages/pharmacist.js",
                                lineNumber: 812,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 810,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500",
                        children: "لا توجد أدوية منتهية حاليًا 👌"
                    }, void 0, false, {
                        fileName: "[project]/pages/pharmacist.js",
                        lineNumber: 827,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/pharmacist.js",
                lineNumber: 805,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/pharmacist.js",
        lineNumber: 774,
        columnNumber: 5
    }, this);
}
_c4 = AlertsTab;
function SummaryCard({ title, value, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 text-center bg-white border rounded-lg shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-500",
                children: title
            }, void 0, false, {
                fileName: "[project]/pages/pharmacist.js",
                lineNumber: 839,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `mt-1 text-xl font-bold sm:text-2xl ${color}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/pages/pharmacist.js",
                lineNumber: 840,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/pharmacist.js",
        lineNumber: 838,
        columnNumber: 5
    }, this);
} // // pages/pharmacist.js
 // import { useMemo, useState } from 'react'
 // import { useRouter } from 'next/router'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import toast from 'react-hot-toast'
 // export default function PharmacistPage() {
 //   // 🔹 المستخدم الحالي
 //   const [user] = useState({ name: 'الصيدلي محمد', role: 'pharmacist' })
 //   // 🔹 تبويب الشاشة: الأدوية | مبيعات | تنبيهات
 //   const [activeTab, setActiveTab] = useState('medicines') // medicines | sales | alerts
 //   // 🔹 الأدوية (بيانات تجريبية)
 //   const [medicines, setMedicines] = useState([
 //     {
 //       id: 1,
 //       name: 'باراسيتامول 500mg',
 //       company: 'GSK',
 //       category: 'مسكنات',
 //       price: 15,
 //       quantity: 10,
 //       minQty: 5,
 //       expiry: '2025-12-10',
 //       sku: 'MED-0001',
 //     },
 //     {
 //       id: 2,
 //       name: 'أموكسيسيلين 250mg',
 //       company: 'Pfizer',
 //       category: 'مضادات حيوية',
 //       price: 25,
 //       quantity: 3,
 //       minQty: 5,
 //       expiry: '2024-06-02',
 //       sku: 'MED-0002',
 //     },
 //     {
 //       id: 3,
 //       name: 'ايبوبروفين 400mg',
 //       company: 'Novartis',
 //       category: 'مسكنات',
 //       price: 18,
 //       quantity: 2,
 //       minQty: 5,
 //       expiry: '2023-12-30',
 //       sku: 'MED-0003',
 //     },
 //     {
 //       id: 4,
 //       name: 'فيتامين د 1000IU',
 //       company: 'GSK',
 //       category: 'فيتامينات',
 //       price: 22,
 //       quantity: 20,
 //       minQty: 5,
 //       expiry: '2026-03-15',
 //       sku: 'MED-0004',
 //     },
 //   ])
 //   const [search, setSearch] = useState('')
 //   const [companyFilter, setCompanyFilter] = useState('all')
 //   const [stockFilter, setStockFilter] = useState('all') // all | low | expired
 //   // 🔹 البيع من شاشة الصيدلي
 //   const [showSaleModal, setShowSaleModal] = useState(false)
 //   const [saleForm, setSaleForm] = useState({ medId: '', qty: 1, price: 0 })
 //   // 🔹 مبيعات الصيدلي (تقرير بسيط)
 //   const [sales, setSales] = useState([
 //     { id: 1, date: '2025-11-17', name: 'باراسيتامول 500mg', qty: 2, price: 15 },
 //     { id: 2, date: '2025-11-17', name: 'فيتامين د 1000IU', qty: 1, price: 22 },
 //     { id: 3, date: '2025-11-16', name: 'أموكسيسيلين 250mg', qty: 1, price: 25 },
 //   ])
 //   const [dateRange, setDateRange] = useState('today') // today | week | month | all
 //   const router = useRouter()
 //   const today = new Date()
 //   // ================== Helpers ==================
 //   const companies = useMemo(() => {
 //     const set = new Set(medicines.map((m) => m.company).filter(Boolean))
 //     return ['all', ...Array.from(set)]
 //   }, [medicines])
 //   const lowStock = useMemo(
 //     () => medicines.filter((m) => m.quantity <= (m.minQty || 5)),
 //     [medicines]
 //   )
 //   const expired = useMemo(
 //     () => medicines.filter((m) => new Date(m.expiry) < today),
 //     [medicines, today]
 //   )
 //   const filteredMedicines = useMemo(() => {
 //     const s = search.trim().toLowerCase()
 //     return medicines.filter((m) => {
 //       const matchText =
 //         m.name.toLowerCase().includes(s) ||
 //         m.company.toLowerCase().includes(s) ||
 //         (m.category || '').toLowerCase().includes(s) ||
 //         (m.sku || '').toLowerCase().includes(s)
 //       if (!matchText) return false
 //       const matchCompany =
 //         companyFilter === 'all' ? true : m.company === companyFilter
 //       const isLow = m.quantity <= (m.minQty || 5)
 //       const isExpired = new Date(m.expiry) < today
 //       const matchStock =
 //         stockFilter === 'all'
 //           ? true
 //           : stockFilter === 'low'
 //           ? isLow
 //           : isExpired
 //       return matchCompany && matchStock
 //     })
 //   }, [medicines, search, companyFilter, stockFilter, today])
 //   const formatCurrency = (v) =>
 //     `${Number(v || 0).toLocaleString('ar-SA')} ر.س`
 //   const withinRange = (dateStr) => {
 //     if (!dateStr) return false
 //     const d = new Date(dateStr)
 //     const oneDay = 24 * 60 * 60 * 1000
 //     const diff = (today - d) / oneDay
 //     if (dateRange === 'today') {
 //       return d.toDateString() === today.toDateString()
 //     }
 //     if (dateRange === 'week') {
 //       return diff >= 0 && diff <= 7
 //     }
 //     if (dateRange === 'month') {
 //       return diff >= 0 && diff <= 30
 //     }
 //     if (dateRange === 'all') {
 //       return true
 //     }
 //     return true
 //   }
 //   const filteredSales = useMemo(
 //     () => sales.filter((s) => withinRange(s.date)),
 //     [sales, dateRange]
 //   )
 //   const totalSalesValue = useMemo(
 //     () => filteredSales.reduce((sum, s) => sum + s.qty * s.price, 0),
 //     [filteredSales]
 //   )
 //   // ================== البيع من شاشة الصيدلي ==================
 //   const openSaleModal = (medId) => {
 //     const med = medicines.find((m) => m.id === medId)
 //     if (!med) return
 //     setSaleForm({
 //       medId,
 //       qty: 1,
 //       price: med.price || 0,
 //     })
 //     setShowSaleModal(true)
 //   }
 //   const submitSale = () => {
 //     const med = medicines.find((m) => m.id === Number(saleForm.medId))
 //     if (!med) {
 //       toast.error('⚠️ يرجى اختيار دواء صحيح')
 //       return
 //     }
 //     const qty = Number(saleForm.qty)
 //     const price = Number(saleForm.price || med.price)
 //     if (!qty || qty <= 0) {
 //       toast.error('❌ الكمية غير صالحة')
 //       return
 //     }
 //     if (qty > med.quantity) {
 //       toast.error('⚠️ الكمية المطلوبة أكبر من المتاح')
 //       return
 //     }
 //     // خصم من المخزون (داخل شاشة الصيدلي فقط الآن)
 //     const updated = medicines.map((m) =>
 //       m.id === med.id ? { ...m, quantity: m.quantity - qty } : m
 //     )
 //     setMedicines(updated)
 //     // إضافة إلى مبيعات الصيدلي (تقرير بسيط)
 //     const sale = {
 //       id: sales.length ? sales[sales.length - 1].id + 1 : 1,
 //       date: new Date().toISOString().slice(0, 10),
 //       name: med.name,
 //       qty,
 //       price,
 //     }
 //     setSales([sale, ...sales])
 //     toast.success(`✅ تم تسجيل بيع ${qty} من ${med.name}`)
 //     setShowSaleModal(false)
 //   }
 //   // ================== طباعة تقرير المبيعات ==================
 //   const handlePrintReport = () => {
 //     const html = `
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <meta charset="utf-8" />
 //           <title>تقرير مبيعات الصيدلي</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
 //             h2 { color:#0ea5e9; margin-bottom: 8px; }
 //             p { margin: 4px 0; }
 //             table { width:100%; border-collapse: collapse; margin-top:10px; }
 //             th, td { border:1px solid #ddd; padding:6px; text-align:center; font-size: 13px; }
 //             th { background:#f3f4f6; }
 //             tfoot td { font-weight:bold; color:#0ea5e9; }
 //           </style>
 //         </head>
 //         <body>
 //           <h2>💊 تقرير مبيعات الصيدلي</h2>
 //           <p>النطاق: ${
 //             dateRange === 'today'
 //               ? 'اليوم'
 //               : dateRange === 'week'
 //               ? 'آخر 7 أيام'
 //               : dateRange === 'month'
 //               ? 'آخر 30 يوم'
 //               : 'كل المبيعات'
 //           }</p>
 //           <table>
 //             <thead>
 //               <tr>
 //                 <th>التاريخ</th>
 //                 <th>اسم الدواء</th>
 //                 <th>الكمية</th>
 //                 <th>السعر</th>
 //                 <th>الإجمالي</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               ${
 //                 filteredSales.length
 //                   ? filteredSales
 //                       .map(
 //                         (s) => `
 //                         <tr>
 //                           <td>${s.date}</td>
 //                           <td>${s.name}</td>
 //                           <td>${s.qty}</td>
 //                           <td>${formatCurrency(s.price)}</td>
 //                           <td>${formatCurrency(s.qty * s.price)}</td>
 //                         </tr>`
 //                       )
 //                       .join('')
 //                   : `<tr><td colspan="5">لا توجد مبيعات في هذا النطاق</td></tr>`
 //               }
 //             </tbody>
 //             <tfoot>
 //               <tr>
 //                 <td colspan="4">إجمالي المبيعات</td>
 //                 <td>${formatCurrency(totalSalesValue)}</td>
 //               </tr>
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
 //     `
 //     const w = window.open('', '_blank', 'width=900,height=900')
 //     if (!w) return
 //     w.document.write(html)
 //     w.document.close()
 //   }
 //   // ================== UI ==================
 //   return (
 //     <Layout user={user} title="💊 شاشة الصيدلي">
 //       <div dir="rtl" className="space-y-6">
 //         {/* العنوان + تبويبات */}
 //         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
 //           <div>
 //             <h1 className="text-xl font-bold text-gray-800">
 //               👨‍⚕️ مرحبًا، {user.name}
 //             </h1>
 //             <p className="text-sm text-gray-500">
 //               إدارة الأدوية والمبيعات اليومية من شاشة الصيدلي
 //             </p>
 //           </div>
 //           <div className="inline-flex overflow-hidden border rounded-full bg-gray-50">
 //             <TabButton
 //               label="الأدوية"
 //               active={activeTab === 'medicines'}
 //               onClick={() => setActiveTab('medicines')}
 //             />
 //             <TabButton
 //               label="مبيعات الصيدلي"
 //               active={activeTab === 'sales'}
 //               onClick={() => setActiveTab('sales')}
 //             />
 //             <TabButton
 //               label="تنبيهات"
 //               active={activeTab === 'alerts'}
 //               onClick={() => setActiveTab('alerts')}
 //             />
 //           </div>
 //         </div>
 //         {/* محتوى التبويب */}
 //         {activeTab === 'medicines' && (
 //           <MedicinesTab
 //             medicines={filteredMedicines}
 //             search={search}
 //             setSearch={setSearch}
 //             companies={companies}
 //             companyFilter={companyFilter}
 //             setCompanyFilter={setCompanyFilter}
 //             stockFilter={stockFilter}
 //             setStockFilter={setStockFilter}
 //             openSaleModal={openSaleModal}
 //             router={router}
 //           />
 //         )}
 //         {activeTab === 'sales' && (
 //           <SalesTab
 //             dateRange={dateRange}
 //             setDateRange={setDateRange}
 //             filteredSales={filteredSales}
 //             formatCurrency={formatCurrency}
 //             totalSalesValue={totalSalesValue}
 //             onPrint={handlePrintReport}
 //           />
 //         )}
 //         {activeTab === 'alerts' && (
 //           <AlertsTab lowStock={lowStock} expired={expired} />
 //         )}
 //       </div>
 //       {/* مودال تسجيل بيع */}
 //       {showSaleModal && (
 //         <Modal
 //           title="🧾 تسجيل بيع من الصيدلي"
 //           onClose={() => setShowSaleModal(false)}
 //           onConfirm={submitSale}
 //         >
 //           <div dir="rtl" className="space-y-3 text-sm">
 //             <div>
 //               <label className="block mb-1 text-xs text-gray-500">
 //                 الدواء
 //               </label>
 //               <select
 //                 value={saleForm.medId}
 //                 onChange={(e) =>
 //                   setSaleForm((f) => ({
 //                     ...f,
 //                     medId: Number(e.target.value),
 //                   }))
 //                 }
 //                 className="w-full px-3 py-2 border rounded-md"
 //               >
 //                 <option value="">— اختر الدواء —</option>
 //                 {medicines.map((m) => (
 //                   <option key={m.id} value={m.id}>
 //                     {m.name} — المخزون: {m.quantity}
 //                   </option>
 //                 ))}
 //               </select>
 //             </div>
 //             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
 //               <div>
 //                 <label className="block mb-1 text-xs text-gray-500">
 //                   الكمية
 //                 </label>
 //                 <input
 //                   type="number"
 //                   min="1"
 //                   value={saleForm.qty}
 //                   onChange={(e) =>
 //                     setSaleForm((f) => ({
 //                       ...f,
 //                       qty: Number(e.target.value),
 //                     }))
 //                   }
 //                   className="w-full px-3 py-2 border rounded-md"
 //                   placeholder="مثال: 1"
 //                 />
 //               </div>
 //               <div>
 //                 <label className="block mb-1 text-xs text-gray-500">
 //                   السعر للوحدة
 //                 </label>
 //                 <input
 //                   type="number"
 //                   min="0"
 //                   value={saleForm.price}
 //                   onChange={(e) =>
 //                     setSaleForm((f) => ({
 //                       ...f,
 //                       price: Number(e.target.value),
 //                     }))
 //                   }
 //                   className="w-full px-3 py-2 border rounded-md"
 //                   placeholder="مثال: 15"
 //                 />
 //               </div>
 //             </div>
 //             <div className="pt-2 text-sm text-right text-gray-600">
 //               الإجمالي التقريبي:{' '}
 //               <span className="font-semibold text-emerald-700">
 //                 {formatCurrency(
 //                   Number(saleForm.qty || 0) * Number(saleForm.price || 0)
 //                 )}
 //               </span>
 //             </div>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // // ================== تبويبات و أجزاء UI ==================
 // function TabButton({ label, active, onClick }) {
 //   return (
 //     <button
 //       onClick={onClick}
 //       className={`px-4 py-1.5 text-xs sm:text-sm font-medium transition ${
 //         active
 //           ? 'bg-white text-sky-600 shadow-sm'
 //           : 'text-gray-500 hover:bg-white/60'
 //       }`}
 //     >
 //       {label}
 //     </button>
 //   )
 // }
 // function MedicinesTab({
 //   medicines,
 //   search,
 //   setSearch,
 //   companies,
 //   companyFilter,
 //   setCompanyFilter,
 //   stockFilter,
 //   setStockFilter,
 //   openSaleModal,
 //   router,
 // }) {
 //   return (
 //     <div className="space-y-4">
 //       {/* شريط الفلاتر */}
 //       <div className="p-4 bg-white border rounded-lg shadow-sm">
 //         <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
 //           <input
 //             type="text"
 //             placeholder="🔍 بحث بالاسم / الشركة / التصنيف / الكود"
 //             value={search}
 //             onChange={(e) => setSearch(e.target.value)}
 //             className="w-full px-3 py-2 text-sm border rounded-md"
 //           />
 //           <select
 //             value={companyFilter}
 //             onChange={(e) => setCompanyFilter(e.target.value)}
 //             className="w-full px-3 py-2 text-sm border rounded-md"
 //           >
 //             <option value="all">كل الشركات</option>
 //             {companies
 //               .filter((c) => c !== 'all')
 //               .map((c) => (
 //                 <option key={c} value={c}>
 //                   {c}
 //                 </option>
 //               ))}
 //           </select>
 //           <select
 //             value={stockFilter}
 //             onChange={(e) => setStockFilter(e.target.value)}
 //             className="w-full px-3 py-2 text-sm border rounded-md"
 //           >
 //             <option value="all">كل الحالات</option>
 //             <option value="low">كمية منخفضة</option>
 //             <option value="expired">منتهي الصلاحية</option>
 //           </select>
 //           <div className="flex items-center justify-end gap-2">
 //             <span className="hidden text-xs text-gray-500 sm:inline">
 //               عدد الأدوية:
 //             </span>
 //             <span className="px-3 py-1 text-xs font-semibold rounded-full text-sky-700 bg-sky-50">
 //               {medicines.length}
 //             </span>
 //           </div>
 //         </div>
 //       </div>
 //       {/* جدول الأدوية */}
 //       <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
 //         <table className="w-full text-sm text-right min-w-[900px]">
 //           <thead className="text-gray-600 bg-gray-50">
 //             <tr>
 //               <th className="px-3 py-2">الدواء</th>
 //               <th className="px-3 py-2">الشركة</th>
 //               <th className="px-3 py-2">التصنيف</th>
 //               <th className="px-3 py-2">الكود</th>
 //               <th className="px-3 py-2">السعر</th>
 //               <th className="px-3 py-2">الكمية</th>
 //               <th className="px-3 py-2">الصلاحية</th>
 //               <th className="px-3 py-2 text-center">حالة</th>
 //               <th className="px-3 py-2 text-center">إجراءات</th>
 //             </tr>
 //           </thead>
 //           <tbody>
 //             {medicines.length ? (
 //               medicines.map((m) => {
 //                 const isLow = m.quantity <= (m.minQty || 5)
 //                 const isExpired = new Date(m.expiry) < new Date()
 //                 return (
 //                   <tr key={m.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2 font-semibold text-gray-800">
 //                       {m.name}
 //                     </td>
 //                     <td className="px-3 py-2 text-gray-700">{m.company}</td>
 //                     <td className="px-3 py-2 text-gray-700">
 //                       {m.category || '-'}
 //                     </td>
 //                     <td className="px-3 py-2 text-xs text-gray-500">
 //                       {m.sku || '-'}
 //                     </td>
 //                     <td className="px-3 py-2 font-semibold text-emerald-700">
 //                       {m.price} ر.س
 //                     </td>
 //                     <td
 //                       className={`px-3 py-2 ${
 //                         isLow ? 'text-red-600 font-semibold' : ''
 //                       }`}
 //                     >
 //                       {m.quantity}
 //                     </td>
 //                     <td className="px-3 py-2 text-xs text-gray-600">
 //                       {m.expiry}
 //                     </td>
 //                     <td className="px-3 py-2 text-center">
 //                       {isExpired ? (
 //                         <span className="inline-flex px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-50 rounded-full">
 //                           منتهي الصلاحية
 //                         </span>
 //                       ) : isLow ? (
 //                         <span className="inline-flex px-2 py-0.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-full">
 //                           كمية منخفضة
 //                         </span>
 //                       ) : (
 //                         <span className="inline-flex px-2 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full">
 //                           متوفر
 //                         </span>
 //                       )}
 //                     </td>
 //                     <td className="px-3 py-2">
 //                       <div className="flex flex-wrap justify-center gap-2">
 //                         <button
 //                           onClick={() => openSaleModal(m.id)}
 //                           className="px-3 py-1 text-xs text-white rounded-md bg-emerald-600 hover:bg-emerald-700"
 //                         >
 //                           💸 بيع
 //                         </button>
 //                         <button
 //                           onClick={() =>
 //                             router.push(`/inventory?product=${m.id}`)
 //                           }
 //                           className="px-3 py-1 text-xs text-indigo-700 rounded-md bg-indigo-50 hover:bg-indigo-100"
 //                         >
 //                           📦 المخزون
 //                         </button>
 //                       </div>
 //                     </td>
 //                   </tr>
 //                 )
 //               })
 //             ) : (
 //               <tr>
 //                 <td
 //                   colSpan={9}
 //                   className="px-3 py-6 text-sm text-center text-gray-500"
 //                 >
 //                   لا توجد نتائج مطابقة
 //                 </td>
 //               </tr>
 //             )}
 //           </tbody>
 //         </table>
 //       </div>
 //     </div>
 //   )
 // }
 // function SalesTab({
 //   dateRange,
 //   setDateRange,
 //   filteredSales,
 //   formatCurrency,
 //   totalSalesValue,
 //   onPrint,
 // }) {
 //   return (
 //     <div className="space-y-4">
 //       {/* فلاتر التاريخ + زر الطباعة */}
 //       <div className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
 //         <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
 //           <button
 //             onClick={() => setDateRange('today')}
 //             className={`px-3 py-1.5 rounded-full border ${
 //               dateRange === 'today'
 //                 ? 'bg-sky-600 text-white border-sky-600'
 //                 : 'bg-white text-gray-600 hover:bg-gray-50'
 //             }`}
 //           >
 //             اليوم
 //           </button>
 //           <button
 //             onClick={() => setDateRange('week')}
 //             className={`px-3 py-1.5 rounded-full border ${
 //               dateRange === 'week'
 //                 ? 'bg-sky-600 text-white border-sky-600'
 //                 : 'bg-white text-gray-600 hover:bg-gray-50'
 //             }`}
 //           >
 //             آخر 7 أيام
 //           </button>
 //           <button
 //             onClick={() => setDateRange('month')}
 //             className={`px-3 py-1.5 rounded-full border ${
 //               dateRange === 'month'
 //                 ? 'bg-sky-600 text-white border-sky-600'
 //                 : 'bg-white text-gray-600 hover:bg-gray-50'
 //             }`}
 //           >
 //             آخر 30 يوم
 //           </button>
 //           <button
 //             onClick={() => setDateRange('all')}
 //             className={`px-3 py-1.5 rounded-full border ${
 //               dateRange === 'all'
 //                 ? 'bg-sky-600 text-white border-sky-600'
 //                 : 'bg-white text-gray-600 hover:bg-gray-50'
 //             }`}
 //           >
 //             كل المبيعات
 //           </button>
 //         </div>
 //         <button
 //           onClick={onPrint}
 //           className="self-start px-4 py-2 text-xs text-white rounded-lg shadow-sm bg-emerald-600 sm:text-sm hover:bg-emerald-700"
 //         >
 //           🖨️ طباعة تقرير المبيعات
 //         </button>
 //       </div>
 //       {/* جدول المبيعات */}
 //       <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
 //         <table className="w-full text-sm text-right min-w-[700px]">
 //           <thead className="text-gray-600 bg-gray-50">
 //             <tr>
 //               <th className="px-3 py-2">التاريخ</th>
 //               <th className="px-3 py-2">اسم الدواء</th>
 //               <th className="px-3 py-2">الكمية</th>
 //               <th className="px-3 py-2">السعر</th>
 //               <th className="px-3 py-2">الإجمالي</th>
 //             </tr>
 //           </thead>
 //           <tbody>
 //             {filteredSales.length ? (
 //               filteredSales.map((s) => (
 //                 <tr key={s.id} className="border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2">{s.date}</td>
 //                   <td className="px-3 py-2">{s.name}</td>
 //                   <td className="px-3 py-2">{s.qty}</td>
 //                   <td className="px-3 py-2">{formatCurrency(s.price)}</td>
 //                   <td className="px-3 py-2 font-semibold text-sky-700">
 //                     {formatCurrency(s.qty * s.price)}
 //                   </td>
 //                 </tr>
 //               ))
 //             ) : (
 //               <tr>
 //                 <td
 //                   colSpan={5}
 //                   className="px-3 py-6 text-sm text-center text-gray-500"
 //                 >
 //                   لا توجد مبيعات في هذا النطاق
 //                 </td>
 //               </tr>
 //             )}
 //           </tbody>
 //         </table>
 //       </div>
 //       {/* ملخص */}
 //       <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
 //         <SummaryCard
 //           title="إجمالي المبيعات"
 //           value={formatCurrency(totalSalesValue)}
 //           color="text-emerald-600"
 //         />
 //         <SummaryCard
 //           title="عدد العمليات"
 //           value={filteredSales.length.toLocaleString('ar-SA')}
 //           color="text-sky-600"
 //         />
 //         <SummaryCard
 //           title="متوسط العملية"
 //           value={
 //             filteredSales.length
 //               ? formatCurrency(totalSalesValue / filteredSales.length)
 //               : formatCurrency(0)
 //           }
 //           color="text-amber-600"
 //         />
 //       </div>
 //     </div>
 //   )
 // }
 // function AlertsTab({ lowStock, expired }) {
 //   return (
 //     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
 //       {/* كمية منخفضة */}
 //       <div className="p-4 bg-white border rounded-lg shadow-sm">
 //         <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-amber-700">
 //           ⚠️ أدوية بكمية منخفضة
 //         </h3>
 //         {lowStock.length ? (
 //           <ul className="space-y-2 text-sm">
 //             {lowStock.map((m) => (
 //               <li
 //                 key={m.id}
 //                 className="flex items-center justify-between px-3 py-2 border rounded-md"
 //               >
 //                 <div>
 //                   <p className="font-semibold text-gray-800">{m.name}</p>
 //                   <p className="text-xs text-gray-500">{m.company}</p>
 //                 </div>
 //                 <span className="px-2 py-0.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-full">
 //                   الكمية: {m.quantity}
 //                 </span>
 //               </li>
 //             ))}
 //           </ul>
 //         ) : (
 //           <p className="text-sm text-gray-500">
 //             لا توجد أدوية بكمية منخفضة حاليًا 👌
 //           </p>
 //         )}
 //       </div>
 //       {/* منتهي الصلاحية */}
 //       <div className="p-4 bg-white border rounded-lg shadow-sm">
 //         <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-red-700">
 //           ❌ أدوية منتهية الصلاحية
 //         </h3>
 //         {expired.length ? (
 //           <ul className="space-y-2 text-sm">
 //             {expired.map((m) => (
 //               <li
 //                 key={m.id}
 //                 className="flex items-center justify-between px-3 py-2 border rounded-md"
 //               >
 //                 <div>
 //                   <p className="font-semibold text-gray-800">{m.name}</p>
 //                   <p className="text-xs text-gray-500">{m.company}</p>
 //                 </div>
 //                 <span className="px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-50 rounded-full">
 //                   الصلاحية: {m.expiry}
 //                 </span>
 //               </li>
 //             ))}
 //           </ul>
 //         ) : (
 //           <p className="text-sm text-gray-500">
 //             لا توجد أدوية منتهية حاليًا 👌
 //           </p>
 //         )}
 //       </div>
 //     </div>
 //   )
 // }
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center bg-white border rounded-lg shadow-sm">
 //       <p className="text-xs text-gray-500">{title}</p>
 //       <p className={`mt-1 text-xl font-bold sm:text-2xl ${color}`}>{value}</p>
 //     </div>
 //   )
 // }
 // // pages/pharmacist.js
 // import { useState, useEffect, useMemo, useRef } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // export default function Pharmacist() {
 //   const [user] = useState({ name: 'الصيدلي محمد', role: 'pharmacist' })
 //   const [medicines, setMedicines] = useState([])
 //   const [search, setSearch] = useState('')
 //   const [adv, setAdv] = useState({ company: '', minQty: '', maxQty: '', minPrice: '', maxPrice: '', expiryBefore: '' })
 //   const [sales, setSales] = useState([])
 //   const [showAddModal, setShowAddModal] = useState(false)
 //   const [showSalesReport, setShowSalesReport] = useState(false)
 //   const reportRef = useRef(null)
 //   const [newMedicine, setNewMedicine] = useState({ name: '', company: '', price: '', quantity: '', expiry: '' })
 //   useEffect(() => {
 //   const token = localStorage.getItem("pharmacy_token")
 //   if (!token) {
 //     router.replace("/")   // redirect to login
 //   }
 // }, [])
 //   useEffect(() => {
 //     const mock = [
 //       { id: 1, name: 'باراسيتامول 500mg', company: 'GSK', price: 15, quantity: 10, expiry: '2025-12-10' },
 //       { id: 2, name: 'أموكسيسيلين 250mg', company: 'Pfizer', price: 25, quantity: 3, expiry: '2024-06-02' },
 //       { id: 3, name: 'ايبوبروفين 400mg', company: 'Novartis', price: 18, quantity: 2, expiry: '2023-12-30' },
 //       { id: 4, name: 'فيتامين د 1000IU', company: 'GSK', price: 22, quantity: 20, expiry: '2026-03-15' },
 //     ]
 //     setMedicines(mock)
 //     setSales([
 //       { id: 1, date: '2025-11-02', name: 'باراسيتامول 500mg', qty: 5, price: 15 },
 //       { id: 2, date: '2025-11-02', name: 'فيتامين سي 1000mg', qty: 2, price: 25 },
 //       { id: 3, date: '2025-11-01', name: 'أموكسيسيلين 250mg', qty: 3, price: 45 },
 //     ])
 //   }, [])
 //   const filtered = useMemo(() => {
 //     return medicines.filter((m) => {
 //       const txt = (m.name + ' ' + m.company).toLowerCase().includes(search.toLowerCase())
 //       if (!txt) return false
 //       if (adv.company && m.company !== adv.company) return false
 //       if (adv.minQty && m.quantity < Number(adv.minQty)) return false
 //       if (adv.maxQty && m.quantity > Number(adv.maxQty)) return false
 //       if (adv.minPrice && m.price < Number(adv.minPrice)) return false
 //       if (adv.maxPrice && m.price > Number(adv.maxPrice)) return false
 //       if (adv.expiryBefore && new Date(m.expiry) > new Date(adv.expiryBefore)) return false
 //       return true
 //     })
 //   }, [medicines, search, adv])
 //   const sell = (m) => {
 //     const qty = Number(prompt(`كمية البيع من "${m.name}"؟`, 1) || 0)
 //     if (!qty || qty < 1) return
 //     if (qty > m.quantity) return toast.error('الكمية غير متاحة')
 //     // خصم من المخزون
 //     setMedicines(prev => prev.map(x => x.id === m.id ? { ...x, quantity: x.quantity - qty } : x))
 //     // إضافة إلى مبيعات الصيدلي
 //     const today = new Date().toISOString().slice(0, 10)
 //     const sale = { id: Date.now(), date: today, name: m.name, qty, price: m.price }
 //     setSales(prev => [sale, ...prev])
 //     toast.success('تم تسجيل عملية البيع')
 //   }
 //   const addMedicine = () => {
 //     const { name, company, price, quantity, expiry } = newMedicine
 //     if (!name || !company || !price || !quantity || !expiry) {
 //       toast.error('أكمل جميع الحقول')
 //       return
 //     }
 //     setMedicines(prev => [{ id: Date.now(), name, company, price: Number(price), quantity: Number(quantity), expiry }, ...prev])
 //     setNewMedicine({ name: '', company: '', price: '', quantity: '', expiry: '' })
 //     setShowAddModal(false)
 //     toast.success('تمت إضافة الدواء')
 //   }
 //   const todayTotal = sales
 //     .filter((s) => s.date === new Date().toISOString().slice(0, 10))
 //     .reduce((sum, s) => sum + s.qty * s.price, 0)
 //   const printReport = () => {
 //     const w = window.open('', '', 'width=900,height=700')
 //     w.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير مبيعات الصيدلي</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
 //             h2 { color: ${theme.colors.primary}; text-align: center; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 15px; }
 //             th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
 //             th { background: #f3f4f6; }
 //           </style>
 //         </head>
 //         <body>${reportRef.current.innerHTML}</body>
 //       </html>
 //     `)
 //     w.document.close(); w.focus(); w.print(); w.close()
 //   }
 //   return (
 //     <Layout user={user} title="لوحة الصيدلي">
 //       <div dir="rtl" className="space-y-6">
 //         {/* شريط التحكم */}
 //         <div className="flex flex-wrap items-center justify-between gap-3">
 //           <input
 //             type="text"
 //             placeholder="🔍 ابحث باسم الدواء أو الشركة..."
 //             value={search}
 //             onChange={(e) => setSearch(e.target.value)}
 //             className="flex-1 input"
 //           />
 //           <div className="flex gap-2">
 //             <button onClick={() => setShowAddModal(true)} className="btn btn-primary">➕ إضافة دواء</button>
 //             <button onClick={() => setShowSalesReport(true)} className="btn btn-secondary">📊 تقرير المبيعات</button>
 //           </div>
 //         </div>
 //         {/* فلترة متقدمة */}
 //         <div className="p-4 card">
 //           <h4 className="mb-3 font-semibold text-gray-700">فلترة متقدمة</h4>
 //           <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
 //             <input className="input" placeholder="الشركة" value={adv.company} onChange={(e) => setAdv({ ...adv, company: e.target.value })} />
 //             <input className="input" placeholder="كمية من" type="number" value={adv.minQty} onChange={(e) => setAdv({ ...adv, minQty: e.target.value })} />
 //             <input className="input" placeholder="كمية إلى" type="number" value={adv.maxQty} onChange={(e) => setAdv({ ...adv, maxQty: e.target.value })} />
 //             <input className="input" placeholder="سعر من" type="number" value={adv.minPrice} onChange={(e) => setAdv({ ...adv, minPrice: e.target.value })} />
 //             <input className="input" placeholder="سعر إلى" type="number" value={adv.maxPrice} onChange={(e) => setAdv({ ...adv, maxPrice: e.target.value })} />
 //             <input className="input" placeholder="تنتهي قبل تاريخ" type="date" value={adv.expiryBefore} onChange={(e) => setAdv({ ...adv, expiryBefore: e.target.value })} />
 //           </div>
 //           <div className="flex justify-end gap-2 mt-3">
 //             <button onClick={() => setAdv({ company: '', minQty: '', maxQty: '', minPrice: '', maxPrice: '', expiryBefore: '' })} className="btn btn-ghost">مسح</button>
 //             <button onClick={() => toast('تم تطبيق الفلاتر 👍')} className="btn btn-primary">تطبيق</button>
 //           </div>
 //         </div>
 //         {/* جدول الأدوية */}
 //         <div className="p-4 card">
 //           <h3 className="mb-3 text-lg font-semibold text-gray-700">قائمة الأدوية</h3>
 //           <table className="w-full text-sm text-right border-t border-gray-100">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">اسم الدواء</th>
 //                 <th className="px-3 py-2">الشركة</th>
 //                 <th className="px-3 py-2">السعر</th>
 //                 <th className="px-3 py-2">الكمية</th>
 //                 <th className="px-3 py-2">الانتهاء</th>
 //                 <th className="px-3 py-2">إجراء</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filtered.map((m) => (
 //                 <tr key={m.id} className="border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2">{m.name}</td>
 //                   <td className="px-3 py-2">{m.company}</td>
 //                   <td className="px-3 py-2">{m.price} ر.س</td>
 //                   <td className={`px-3 py-2 ${m.quantity <= 5 ? 'text-red-600' : 'text-green-700'}`}>{m.quantity}</td>
 //                   <td className={`${new Date(m.expiry) < new Date() ? 'text-red-600' : ''} px-3 py-2`}>{m.expiry}</td>
 //                   <td className="px-3 py-2">
 //                     <button onClick={() => sell(m)} className="px-3 py-1.5 rounded border border-emerald-100 text-emerald-700 hover:bg-emerald-50">بيع</button>
 //                   </td>
 //                 </tr>
 //               ))}
 //               {filtered.length === 0 && (
 //                 <tr><td colSpan="6" className="py-6 text-center text-gray-500">لا توجد نتائج مطابقة</td></tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //       </div>
 //       {/* مودال إضافة دواء */}
 //       {showAddModal && (
 //         <Modal title="إضافة دواء جديد" onClose={() => setShowAddModal(false)}>
 //           <div className="text-right">
 //             <label className="block mb-1 text-sm">اسم الدواء</label>
 //             <input className="mb-2 input" value={newMedicine.name} onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })} />
 //             <label className="block mb-1 text-sm">الشركة</label>
 //             <input className="mb-2 input" value={newMedicine.company} onChange={(e) => setNewMedicine({ ...newMedicine, company: e.target.value })} />
 //             <div className="grid grid-cols-2 gap-3">
 //               <div>
 //                 <label className="block mb-1 text-sm">السعر</label>
 //                 <input className="input" type="number" value={newMedicine.price} onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })} />
 //               </div>
 //               <div>
 //                 <label className="block mb-1 text-sm">الكمية</label>
 //                 <input className="input" type="number" value={newMedicine.quantity} onChange={(e) => setNewMedicine({ ...newMedicine, quantity: e.target.value })} />
 //               </div>
 //             </div>
 //             <label className="block mt-2 mb-1 text-sm">تاريخ الانتهاء</label>
 //             <input className="mb-4 input" type="date" value={newMedicine.expiry} onChange={(e) => setNewMedicine({ ...newMedicine, expiry: e.target.value })} />
 //             <div className="flex justify-end gap-3">
 //               <button onClick={addMedicine} className="btn btn-secondary">حفظ</button>
 //               <button onClick={() => setShowAddModal(false)} className="btn btn-ghost">إلغاء</button>
 //             </div>
 //           </div>
 //         </Modal>
 //       )}
 //       {/* مودال تقرير المبيعات */}
 //       {showSalesReport && (
 //         <Modal title="تقرير مبيعات الصيدلي" onClose={() => setShowSalesReport(false)} width="max-w-3xl">
 //           <div ref={reportRef} className="space-y-2 text-sm text-gray-700">
 //             <h3 className="mb-3 text-lg font-semibold text-center text-sky-700">💊 تقرير المبيعات اليومية</h3>
 //             <table className="w-full text-sm text-right border border-gray-200">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">التاريخ</th>
 //                   <th className="px-3 py-2">اسم الدواء</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {sales.map((s) => (
 //                   <tr key={s.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{s.date}</td>
 //                     <td className="px-3 py-2">{s.name}</td>
 //                     <td className="px-3 py-2">{s.qty}</td>
 //                     <td className="px-3 py-2">{s.price} ر.س</td>
 //                     <td className="px-3 py-2 font-semibold text-sky-700">{(s.qty * s.price).toFixed(2)} ر.س</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //             <div className="mt-4 font-semibold text-center text-green-700">
 //               🧾 إجمالي مبيعات اليوم: {todayTotal.toFixed(2)} ر.س
 //             </div>
 //           </div>
 //           <div className="flex justify-end gap-3 mt-5">
 //             <button onClick={printReport} className="btn btn-secondary">🖨️ طباعة</button>
 //             <button onClick={() => setShowSalesReport(false)} className="btn btn-ghost">إغلاق</button>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // // pages/pharmacist.js
 // import { useEffect, useMemo, useRef, useState } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // export default function Pharmacist() {
 //   const [user] = useState({ name: 'الصيدلي محمد', role: 'pharmacist' })
 //   const [activeTab, setActiveTab] = useState('medicines')
 //   const [medicines, setMedicines] = useState([])
 //   const [search, setSearch] = useState('')
 //   const [companyFilter, setCompanyFilter] = useState('all')
 //   const [stockFilter, setStockFilter] = useState('all')
 //   const [showSaleModal, setShowSaleModal] = useState(false)
 //   const [saleForm, setSaleForm] = useState({ medId: '', qty: 1, price: 0 })
 //   const [sales, setSales] = useState([])
 //   const [dateRange, setDateRange] = useState('today')
 //   const [customFrom, setCustomFrom] = useState('')
 //   const [customTo, setCustomTo] = useState('')
 //   const [showSalesReport, setShowSalesReport] = useState(false)
 //   const printRef = useRef(null)
 //   useEffect(() => {
 //     const mock = [
 //       { id: 1, name: 'باراسيتامول 500mg', company: 'GSK', price: 15, quantity: 10, expiry: '2025-12-10' },
 //       { id: 2, name: 'أموكسيسيلين 250mg', company: 'Pfizer', price: 45, quantity: 3, expiry: '2024-06-02' },
 //       { id: 3, name: 'ايبوبروفين 400mg', company: 'Novartis', price: 30, quantity: 2, expiry: '2023-12-30' },
 //       { id: 4, name: 'فيتامين سي 1000mg', company: 'Roche', price: 25, quantity: 25, expiry: '2026-01-15' },
 //     ]
 //     setMedicines(mock)
 //     setSales([
 //       { id: 1, date: '2025-11-02', name: 'باراسيتامول 500mg', qty: 5, price: 15 },
 //       { id: 2, date: '2025-11-02', name: 'فيتامين سي 1000mg', qty: 2, price: 25 },
 //       { id: 3, date: '2025-11-01', name: 'أموكسيسيلين 250mg', qty: 3, price: 45 },
 //     ])
 //   }, [])
 //   const lowStock = useMemo(() => medicines.filter(m => m.quantity <= 5), [medicines])
 //   const expired = useMemo(() => medicines.filter(m => new Date(m.expiry) < new Date()), [medicines])
 //   const companies = useMemo(() => ['all', ...Array.from(new Set(medicines.map(m => m.company)))], [medicines])
 //   const filteredMedicines = useMemo(() => {
 //     const s = search.trim().toLowerCase()
 //     return medicines.filter(m => {
 //       const matchText = m.name.toLowerCase().includes(s) || m.company.toLowerCase().includes(s)
 //       const matchCompany = companyFilter === 'all' ? true : m.company === companyFilter
 //       const isLow = m.quantity <= 5
 //       const isExpired = new Date(m.expiry) < new Date()
 //       const matchStock =
 //         stockFilter === 'all' ? true : stockFilter === 'low' ? isLow : isExpired
 //       return matchText && matchCompany && matchStock
 //     })
 //   }, [medicines, search, companyFilter, stockFilter])
 //   const openSaleModal = (medId) => {
 //     const med = medicines.find(m => m.id === medId)
 //     setSaleForm({ medId, qty: 1, price: med?.price || 0 })
 //     setShowSaleModal(true)
 //   }
 //   const submitSale = () => {
 //     const med = medicines.find(m => m.id === Number(saleForm.medId))
 //     if (!med) return toast.error('⚠️ يرجى اختيار دواء صالح للبيع')
 //     if (saleForm.qty <= 0) return toast.error('❌ الكمية غير صالحة')
 //     if (saleForm.qty > med.quantity) return toast.error('⚠️ الكمية المطلوبة أكبر من المتاح بالمخزون')
 //     const updated = medicines.map(m =>
 //       m.id === med.id ? { ...m, quantity: m.quantity - Number(saleForm.qty) } : m
 //     )
 //     setMedicines(updated)
 //     const sale = {
 //       id: sales.length + 1,
 //       date: new Date().toISOString().slice(0, 10),
 //       name: med.name,
 //       qty: Number(saleForm.qty),
 //       price: Number(saleForm.price || med.price),
 //     }
 //     setSales([sale, ...sales])
 //     setShowSaleModal(false)
 //     toast.success(`✅ تم تسجيل بيع ${sale.qty} من ${med.name}`)
 //   }
 //   const withinRange = (d) => {
 //     const date = new Date(d)
 //     const today = new Date()
 //     const day = 24 * 60 * 60 * 1000
 //     if (dateRange === 'today') return date.toDateString() === today.toDateString()
 //     if (dateRange === 'week') {
 //       const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
 //       return date >= start && date <= today
 //     }
 //     if (dateRange === 'month') {
 //       const start = new Date(today.getFullYear(), today.getMonth(), 1)
 //       return date >= start && date <= today
 //     }
 //     if (dateRange === 'custom') {
 //       if (!customFrom || !customTo) return true
 //       const from = new Date(customFrom)
 //       const to = new Date(customTo)
 //       to.setHours(23, 59, 59, 999)
 //       return date >= from && date <= to
 //     }
 //     return true
 //   }
 //   const filteredSales = useMemo(
 //     () => sales.filter(s => withinRange(s.date)),
 //     [sales, dateRange, customFrom, customTo]
 //   )
 //   const totalSales = filteredSales.reduce((sum, s) => sum + s.qty * s.price, 0)
 //   const printSales = () => {
 //     if (!printRef.current) return
 //     toast.success('🖨️ جاري تحضير الطباعة...')
 //     const html = printRef.current.innerHTML
 //     const w = window.open('', '', 'width=900,height=700')
 //     w.document.write(`
 //       <html lang="ar" dir="rtl">
 //         <head>
 //           <title>تقرير مبيعات الصيدلي</title>
 //           <meta charset="utf-8"/>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; direction: rtl; margin: 20px; color: #111827; }
 //             header { text-align: center; margin-bottom: 12px; }
 //             h1 { margin: 0 0 2px; font-size: 18px; color: ${theme.colors.primary}; }
 //             .sub { color: #6B7280; font-size: 12px; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 12px; }
 //             th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: center; font-size: 13px; }
 //             th { background: #f9fafb; }
 //             .tot { margin-top: 10px; text-align: left; font-weight: 700; color: #047857; }
 //             @media print { @page { size: A4; margin: 12mm; } }
 //           </style>
 //         </head>
 //         <body>
 //           <header>
 //             <h1>تقرير مبيعات الصيدلي</h1>
 //             <div class="sub">${new Date().toLocaleString('ar-SA')}</div>
 //           </header>
 //           ${html}
 //         </body>
 //       </html>
 //     `)
 //     w.document.close()
 //     w.focus()
 //     w.print()
 //     w.close()
 //   }
 //   const exportCSV = () => {
 //     if (!filteredSales.length) return toast.error('❌ لا توجد بيانات لتصديرها')
 //     const headers = ['التاريخ', 'الدواء', 'الكمية', 'السعر', 'الإجمالي']
 //     const rows = filteredSales.map(s => [
 //       s.date,
 //       s.name,
 //       s.qty,
 //       s.price,
 //       (s.qty * s.price).toFixed(2)
 //     ])
 //     const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
 //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
 //     const url = URL.createObjectURL(blob)
 //     const a = document.createElement('a')
 //     a.href = url
 //     a.download = 'pharmacist-sales.csv'
 //     a.click()
 //     URL.revokeObjectURL(url)
 //     toast.success('📥 تم تصدير التقرير بصيغة CSV')
 //   }
 //   return (
 //     <Layout user={{ name: 'الصيدلي محمد', role: 'pharmacist' }} title="لوحة الصيدلي">
 //       <div dir="rtl" className="space-y-6">
 //         {(lowStock.length > 0 || expired.length > 0) && (
 //           <div className="grid gap-3 sm:grid-cols-2">
 //             {lowStock.length > 0 && (
 //               <div className="p-3 text-sm border rounded-md border-amber-200 bg-amber-50 text-amber-800">
 //                 ⚠️ يوجد <b>{lowStock.length}</b> دواء منخفض المخزون.
 //               </div>
 //             )}
 //             {expired.length > 0 && (
 //               <div className="p-3 text-sm border rounded-md border-rose-200 bg-rose-50 text-rose-800">
 //                 ⛔ يوجد <b>{expired.length}</b> دواء منتهي الصلاحية.
 //               </div>
 //             )}
 //           </div>
 //         )}
 //         {/* Tabs */}
 //         <div className="flex flex-wrap gap-2">
 //           {[
 //             { key: 'medicines', label: '🧾 الأدوية' },
 //             { key: 'sales', label: '💰 المبيعات' },
 //             { key: 'alerts', label: '⚠️ التنبيهات' },
 //           ].map(t => (
 //             <button
 //               key={t.key}
 //               onClick={() => setActiveTab(t.key)}
 //               className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
 //                 activeTab === t.key ? 'text-white' : 'text-gray-600 bg-white'
 //               }`}
 //               style={{
 //                 backgroundColor: activeTab === t.key ? theme.colors.primary : undefined,
 //                 borderColor: activeTab === t.key ? theme.colors.primary : '#e5e7eb',
 //               }}
 //             >
 //               {t.label}
 //             </button>
 //           ))}
 //         </div>
 //         {/* الأدوية */}
 //         {activeTab === 'medicines' && (
 //           <div className="p-4 bg-white border rounded-lg shadow-sm">
 //             <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
 //               <div className="flex flex-1 gap-2">
 //                 <input
 //                   type="text"
 //                   placeholder="🔍 ابحث باسم الدواء أو الشركة..."
 //                   value={search}
 //                   onChange={(e) => setSearch(e.target.value)}
 //                   className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
 //                 />
 //                 <select
 //                   value={companyFilter}
 //                   onChange={(e) => setCompanyFilter(e.target.value)}
 //                   className="px-3 py-2 text-sm border rounded-md"
 //                 >
 //                   {companies.map(c => (
 //                     <option key={c} value={c}>{c === 'all' ? 'كل الشركات' : c}</option>
 //                   ))}
 //                 </select>
 //                 <select
 //                   value={stockFilter}
 //                   onChange={(e) => setStockFilter(e.target.value)}
 //                   className="px-3 py-2 text-sm border rounded-md"
 //                 >
 //                   <option value="all">كل الحالات</option>
 //                   <option value="low">منخفض المخزون</option>
 //                   <option value="expired">منتهي الصلاحية</option>
 //                 </select>
 //               </div>
 //               <button
 //                 onClick={() => setShowSaleModal(true)}
 //                 className="px-4 py-2 text-white rounded-md shadow-sm"
 //                 style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
 //               >
 //                 ➕ تسجيل بيع يدوي
 //               </button>
 //             </div>
 //             <table className="w-full text-sm text-right border-t border-gray-100">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">اسم الدواء</th>
 //                   <th className="px-3 py-2">الشركة</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">الصلاحية</th>
 //                   <th className="px-3 py-2">إجراء</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {filteredMedicines.map((m) => {
 //                   const isLow = m.quantity <= 5
 //                   const isExp = new Date(m.expiry) < new Date()
 //                   return (
 //                     <tr key={m.id} className={`border-t hover:bg-gray-50 ${isLow ? 'bg-amber-50/40' : ''} ${isExp ? 'bg-rose-50/40' : ''}`}>
 //                       <td className="px-3 py-2">{m.name}</td>
 //                       <td className="px-3 py-2">{m.company}</td>
 //                       <td className="px-3 py-2">{m.price} ر.س</td>
 //                       <td className={`px-3 py-2 ${isLow ? 'text-amber-700' : 'text-green-700'}`}>{m.quantity}</td>
 //                       <td className={`${isExp ? 'text-rose-700' : ''} px-3 py-2`}>{m.expiry}</td>
 //                       <td className="px-3 py-2">
 //                         <button
 //                           onClick={() => openSaleModal(m.id)}
 //                           className="px-3 py-1.5 text-sm border rounded-md border-sky-200 text-sky-700 hover:bg-sky-50"
 //                         >
 //                           بيع
 //                         </button>
 //                       </td>
 //                     </tr>
 //                   )
 //                 })}
 //               </tbody>
 //             </table>
 //           </div>
 //         )}
 //         {/* المبيعات */}
 //         {activeTab === 'sales' && (
 //           <div className="p-4 bg-white border rounded-lg shadow-sm">
 //             <div className="flex flex-wrap gap-2 mb-3">
 //               {['today', 'week', 'month', 'custom'].map(r => (
 //                 <button
 //                   key={r}
 //                   onClick={() => setDateRange(r)}
 //                   className={`px-3 py-1.5 rounded-md text-sm border ${dateRange === r ? 'text-white' : 'text-gray-600 bg-white'}`}
 //                   style={{
 //                     backgroundColor: dateRange === r ? theme.colors.primary : undefined,
 //                     borderColor: dateRange === r ? theme.colors.primary : '#e5e7eb'
 //                   }}
 //                 >
 //                   {r === 'today' ? 'اليوم' : r === 'week' ? 'الأسبوع' : r === 'month' ? 'الشهر' : 'مخصص'}
 //                 </button>
 //               ))}
 //               {dateRange === 'custom' && (
 //                 <>
 //                   <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="px-3 py-1.5 border rounded-md" />
 //                   <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="px-3 py-1.5 border rounded-md" />
 //                 </>
 //               )}
 //             </div>
 //             <div ref={printRef}>
 //               <table className="w-full text-sm text-right border-t border-gray-100">
 //                 <thead className="text-gray-600 bg-gray-50">
 //                   <tr>
 //                     <th className="px-3 py-2">التاريخ</th>
 //                     <th className="px-3 py-2">الدواء</th>
 //                     <th className="px-3 py-2">الكمية</th>
 //                     <th className="px-3 py-2">السعر</th>
 //                     <th className="px-3 py-2">الإجمالي</th>
 //                   </tr>
 //                 </thead>
 //                 <tbody>
 //                   {filteredSales.map(s => (
 //                     <tr key={s.id} className="border-t hover:bg-gray-50">
 //                       <td className="px-3 py-2">{s.date}</td>
 //                       <td className="px-3 py-2">{s.name}</td>
 //                       <td className="px-3 py-2">{s.qty}</td>
 //                       <td className="px-3 py-2">{s.price} ر.س</td>
 //                       <td className="px-3 py-2 font-semibold text-sky-700">{(s.qty * s.price).toFixed(2)} ر.س</td>
 //                     </tr>
 //                   ))}
 //                 </tbody>
 //               </table>
 //               <div className="mt-3 font-semibold text-left text-green-700">الإجمالي: {totalSales.toFixed(2)} ر.س</div>
 //             </div>
 //             <div className="flex flex-wrap justify-end gap-2 mt-4">
 //               <button onClick={printSales} className="px-4 py-2 text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700">
 //                 🖨️ طباعة
 //               </button>
 //               <button onClick={exportCSV} className="px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700">
 //                 📥 CSV
 //               </button>
 //             </div>
 //           </div>
 //         )}
 //       </div>
 //       {showSaleModal && (
 //         <Modal title="تسجيل عملية بيع" onClose={() => setShowSaleModal(false)}>
 //           <div className="space-y-3 text-right">
 //             <label className="block text-sm">اختر الدواء</label>
 //             <select
 //               value={saleForm.medId}
 //               onChange={(e) => {
 //                 const id = Number(e.target.value)
 //                 const med = medicines.find(m => m.id === id)
 //                 setSaleForm({ medId: id, qty: 1, price: med?.price || 0 })
 //               }}
 //               className="w-full px-3 py-2 border rounded-md"
 //             >
 //               <option value="">— اختر —</option>
 //               {medicines.map(m => (
 //                 <option key={m.id} value={m.id}>{m.name} — المخزون: {m.quantity}</option>
 //               ))}
 //             </select>
 //             <label className="block text-sm">الكمية</label>
 //             <input
 //               type="number"
 //               min="1"
 //               value={saleForm.qty}
 //               onChange={(e) => setSaleForm({ ...saleForm, qty: Number(e.target.value) })}
 //               className="w-full px-3 py-2 border rounded-md"
 //             />
 //             <label className="block text-sm">السعر</label>
 //             <input
 //               type="number"
 //               min="0"
 //               value={saleForm.price}
 //               onChange={(e) => setSaleForm({ ...saleForm, price: Number(e.target.value) })}
 //               className="w-full px-3 py-2 border rounded-md"
 //             />
 //             <div className="flex justify-end gap-2 pt-2">
 //               <button onClick={submitSale} className="px-4 py-2 text-white rounded-md bg-emerald-600 hover:bg-emerald-700">حفظ</button>
 //               <button onClick={() => setShowSaleModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
 //             </div>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
 // // pages/pharmacist.js
 // import { useEffect, useMemo, useRef, useState } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import theme from '../theme'
 // export default function Pharmacist() {
 //   // ======== الحالة العامة ========
 //   const [user] = useState({ name: 'الصيدلي محمد', role: 'pharmacist' })
 //   const [activeTab, setActiveTab] = useState('medicines') // medicines | sales | alerts
 //   // ======== الأدوية ========
 //   const [medicines, setMedicines] = useState([])
 //   const [search, setSearch] = useState('')
 //   const [companyFilter, setCompanyFilter] = useState('all')
 //   const [stockFilter, setStockFilter] = useState('all') // all | low | expired
 //   // ======== البيع من الصيدلي ========
 //   const [showSaleModal, setShowSaleModal] = useState(false)
 //   const [saleForm, setSaleForm] = useState({ medId: '', qty: 1, price: 0 })
 //   // ======== المبيعات والتقارير ========
 //   const [sales, setSales] = useState([])
 //   const [dateRange, setDateRange] = useState('today') // today | week | month | custom
 //   const [customFrom, setCustomFrom] = useState('')
 //   const [customTo, setCustomTo] = useState('')
 //   const [showSalesReport, setShowSalesReport] = useState(false)
 //   const printRef = useRef(null)
 //   // ======== تهيئة بيانات وهمية ========
 //   useEffect(() => {
 //     const mock = [
 //       { id: 1, name: 'باراسيتامول 500mg', company: 'GSK', price: 15, quantity: 10, expiry: '2025-12-10' },
 //       { id: 2, name: 'أموكسيسيلين 250mg', company: 'Pfizer', price: 45, quantity: 3, expiry: '2024-06-02' },
 //       { id: 3, name: 'ايبوبروفين 400mg', company: 'Novartis', price: 30, quantity: 2, expiry: '2023-12-30' },
 //       { id: 4, name: 'فيتامين سي 1000mg', company: 'Roche', price: 25, quantity: 25, expiry: '2026-01-15' },
 //     ]
 //     setMedicines(mock)
 //     setSales([
 //       { id: 1, date: '2025-11-02', name: 'باراسيتامول 500mg', qty: 5, price: 15 },
 //       { id: 2, date: '2025-11-02', name: 'فيتامين سي 1000mg', qty: 2, price: 25 },
 //       { id: 3, date: '2025-11-01', name: 'أموكسيسيلين 250mg', qty: 3, price: 45 },
 //     ])
 //   }, [])
 //   // ======== تنبيهات ========
 //   const lowStock = useMemo(() => medicines.filter(m => m.quantity <= 5), [medicines])
 //   const expired = useMemo(() => medicines.filter(m => new Date(m.expiry) < new Date()), [medicines])
 //   // ======== فلترة الأدوية (بحث + شركة + حالة) ========
 //   const companies = useMemo(() => ['all', ...Array.from(new Set(medicines.map(m => m.company)))], [medicines])
 //   const filteredMedicines = useMemo(() => {
 //     const s = search.trim().toLowerCase()
 //     return medicines.filter(m => {
 //       const matchesText =
 //         m.name.toLowerCase().includes(s) || m.company.toLowerCase().includes(s)
 //       const matchesCompany = companyFilter === 'all' ? true : m.company === companyFilter
 //       const isLow = m.quantity <= 5
 //       const isExpired = new Date(m.expiry) < new Date()
 //       const matchesStock =
 //         stockFilter === 'all' ? true : stockFilter === 'low' ? isLow : isExpired
 //       return matchesText && matchesCompany && matchesStock
 //     })
 //   }, [medicines, search, companyFilter, stockFilter])
 //   // ======== تسجيل بيع من الصيدلي ========
 //   const openSaleModal = (medId) => {
 //     const med = medicines.find(m => m.id === medId)
 //     setSaleForm({ medId, qty: 1, price: med?.price || 0 })
 //     setShowSaleModal(true)
 //   }
 //   const submitSale = () => {
 //     const med = medicines.find(m => m.id === Number(saleForm.medId))
 //     if (!med) return alert('اختر دواءً صالحًا')
 //     if (saleForm.qty <= 0) return alert('الكمية غير صالحة')
 //     if (saleForm.qty > med.quantity) return alert('الكمية المطلوبة أكبر من المخزون')
 //     // تقليل المخزون
 //     const updated = medicines.map(m =>
 //       m.id === med.id ? { ...m, quantity: m.quantity - Number(saleForm.qty) } : m
 //     )
 //     setMedicines(updated)
 //     // إضافة بيع
 //     const sale = {
 //       id: sales.length + 1,
 //       date: new Date().toISOString().slice(0, 10),
 //       name: med.name,
 //       qty: Number(saleForm.qty),
 //       price: Number(saleForm.price || med.price),
 //     }
 //     setSales([sale, ...sales])
 //     setShowSaleModal(false)
 //   }
 //   // ======== تصفية المبيعات حسب التاريخ ========
 //   const withinRange = (d) => {
 //     const date = new Date(d)
 //     const today = new Date()
 //     const day = 24 * 60 * 60 * 1000
 //     if (dateRange === 'today') {
 //       return date.toDateString() === today.toDateString()
 //     }
 //     if (dateRange === 'week') {
 //       const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
 //       return date >= start && date <= today
 //     }
 //     if (dateRange === 'month') {
 //       const start = new Date(today.getFullYear(), today.getMonth(), 1)
 //       return date >= start && date <= today
 //     }
 //     if (dateRange === 'custom') {
 //       if (!customFrom || !customTo) return true
 //       const from = new Date(customFrom)
 //       const to = new Date(customTo)
 //       // شمل نهاية اليوم
 //       to.setHours(23, 59, 59, 999)
 //       return date >= from && date <= to
 //     }
 //     return true
 //   }
 //   const filteredSales = useMemo(
 //     () => sales.filter(s => withinRange(s.date)),
 //     // eslint-disable-next-line react-hooks/exhaustive-deps
 //     [sales, dateRange, customFrom, customTo]
 //   )
 //   const totalSales = filteredSales.reduce((sum, s) => sum + s.qty * s.price, 0)
 //   // ======== طباعة وتصدير ========
 //   const printSales = () => {
 //     if (!printRef.current) return
 //     const html = printRef.current.innerHTML
 //     const w = window.open('', '', 'width=900,height=700')
 //     w.document.write(`
 //       <html lang="ar" dir="rtl">
 //         <head>
 //           <title>تقرير مبيعات الصيدلي</title>
 //           <meta charset="utf-8"/>
 //           <style>
 //             body { font-family: system-ui, -apple-system, 'Segoe UI', 'Tajawal', sans-serif; direction: rtl; margin: 20px; color: #111827; }
 //             header { text-align: center; margin-bottom: 12px; }
 //             h1 { margin: 0 0 2px; font-size: 18px; color: ${theme.colors.primary}; }
 //             .sub { color: #6B7280; font-size: 12px; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 12px; }
 //             th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: center; font-size: 13px; }
 //             th { background: #f9fafb; }
 //             .tot { margin-top: 10px; text-align: left; font-weight: 700; color: #047857; }
 //             @media print { @page { size: A4; margin: 12mm; } }
 //           </style>
 //         </head>
 //         <body>
 //           <header>
 //             <h1>تقرير مبيعات الصيدلي</h1>
 //             <div class="sub">${new Date().toLocaleString('ar-SA')}</div>
 //           </header>
 //           ${html}
 //         </body>
 //       </html>
 //     `)
 //     w.document.close()
 //     w.focus()
 //     w.print()
 //     w.close()
 //   }
 //   const exportCSV = () => {
 //     if (!filteredSales.length) return alert('لا توجد بيانات لتصديرها')
 //     const headers = ['التاريخ', 'الدواء', 'الكمية', 'السعر', 'الإجمالي']
 //     const rows = filteredSales.map(s => [
 //       s.date,
 //       s.name,
 //       s.qty,
 //       s.price,
 //       (s.qty * s.price).toFixed(2)
 //     ])
 //     const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
 //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
 //     const url = URL.createObjectURL(blob)
 //     const a = document.createElement('a')
 //     a.href = url
 //     a.download = 'pharmacist-sales.csv'
 //     a.click()
 //     URL.revokeObjectURL(url)
 //   }
 //   // ======== واجهة ========
 //   return (
 //     <Layout user={user} title="لوحة الصيدلي">
 //       <div dir="rtl" className="space-y-6">
 //         {/* تنبيهات فورية */}
 //         {(lowStock.length > 0 || expired.length > 0) && (
 //           <div className="grid gap-3 sm:grid-cols-2">
 //             {lowStock.length > 0 && (
 //               <div className="p-3 text-sm border rounded-md border-amber-200 bg-amber-50 text-amber-800">
 //                 ⚠️ يوجد <b>{lowStock.length}</b> دواء منخفض المخزون — راجع إعادة الطلب.
 //               </div>
 //             )}
 //             {expired.length > 0 && (
 //               <div className="p-3 text-sm border rounded-md border-rose-200 bg-rose-50 text-rose-800">
 //                 ⛔ يوجد <b>{expired.length}</b> دواء منتهي الصلاحية — أوقف صرفه فورًا.
 //               </div>
 //             )}
 //           </div>
 //         )}
 //         {/* تبويبات */}
 //         <div className="flex flex-wrap gap-2">
 //           {[
 //             { key: 'medicines', label: '🧾 الأدوية' },
 //             { key: 'sales', label: '💰 المبيعات' },
 //             { key: 'alerts', label: '⚠️ التنبيهات' },
 //           ].map(t => (
 //             <button
 //               key={t.key}
 //               onClick={() => setActiveTab(t.key)}
 //               className={`px-3 py-1.5 rounded-md text-sm font-medium border
 //                 ${activeTab === t.key ? 'text-white' : 'text-gray-600 bg-white'}
 //               `}
 //               style={{
 //                 backgroundColor: activeTab === t.key ? theme.colors.primary : undefined,
 //                 borderColor: activeTab === t.key ? theme.colors.primary : '#e5e7eb'
 //               }}
 //             >
 //               {t.label}
 //             </button>
 //           ))}
 //         </div>
 //         {/* تبويب الأدوية */}
 //         {activeTab === 'medicines' && (
 //           <div className="p-4 bg-white border rounded-lg shadow-sm">
 //             {/* شريط أدوات الأدوية */}
 //             <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
 //               <div className="flex flex-1 gap-2">
 //                 <input
 //                   type="text"
 //                   placeholder="🔍 ابحث باسم الدواء أو الشركة..."
 //                   value={search}
 //                   onChange={(e) => setSearch(e.target.value)}
 //                   className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
 //                 />
 //                 <select
 //                   value={companyFilter}
 //                   onChange={(e) => setCompanyFilter(e.target.value)}
 //                   className="px-3 py-2 text-sm border rounded-md"
 //                 >
 //                   {companies.map(c => (
 //                     <option key={c} value={c}>
 //                       {c === 'all' ? 'كل الشركات' : c}
 //                     </option>
 //                   ))}
 //                 </select>
 //                 <select
 //                   value={stockFilter}
 //                   onChange={(e) => setStockFilter(e.target.value)}
 //                   className="px-3 py-2 text-sm border rounded-md"
 //                 >
 //                   <option value="all">كل الحالات</option>
 //                   <option value="low">منخفض المخزون</option>
 //                   <option value="expired">منتهي الصلاحية</option>
 //                 </select>
 //               </div>
 //               <button
 //                 onClick={() => setShowSaleModal(true)}
 //                 className="px-4 py-2 text-white rounded-md shadow-sm"
 //                 style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
 //               >
 //                 ➕ تسجيل بيع يدوي
 //               </button>
 //             </div>
 //             {/* جدول/بطاقات */}
 //             <div className="hidden sm:block">
 //               <table className="w-full text-sm text-right border-t border-gray-100">
 //                 <thead className="text-gray-600 bg-gray-50">
 //                   <tr>
 //                     <th className="px-3 py-2">اسم الدواء</th>
 //                     <th className="px-3 py-2">الشركة</th>
 //                     <th className="px-3 py-2">السعر</th>
 //                     <th className="px-3 py-2">الكمية</th>
 //                     <th className="px-3 py-2">الصلاحية</th>
 //                     <th className="px-3 py-2">إجراء</th>
 //                   </tr>
 //                 </thead>
 //                 <tbody>
 //                   {filteredMedicines.map((m) => {
 //                     const isLow = m.quantity <= 5
 //                     const isExp = new Date(m.expiry) < new Date()
 //                     return (
 //                       <tr key={m.id} className={`border-t hover:bg-gray-50 ${isLow ? 'bg-amber-50/40' : ''} ${isExp ? 'bg-rose-50/40' : ''}`}>
 //                         <td className="px-3 py-2">{m.name}</td>
 //                         <td className="px-3 py-2">{m.company}</td>
 //                         <td className="px-3 py-2">{m.price} ر.س</td>
 //                         <td className={`px-3 py-2 ${isLow ? 'text-amber-700' : 'text-green-700'}`}>{m.quantity}</td>
 //                         <td className={`${isExp ? 'text-rose-700' : ''} px-3 py-2`}>{m.expiry}</td>
 //                         <td className="px-3 py-2">
 //                           <button
 //                             onClick={() => openSaleModal(m.id)}
 //                             className="px-3 py-1.5 text-sm border rounded-md border-sky-200 text-sky-700 hover:bg-sky-50"
 //                           >
 //                             بيع
 //                           </button>
 //                         </td>
 //                       </tr>
 //                     )
 //                   })}
 //                 </tbody>
 //               </table>
 //             </div>
 //             {/* بطاقات للجوال */}
 //             <div className="grid gap-3 sm:hidden">
 //               {filteredMedicines.map(m => {
 //                 const isLow = m.quantity <= 5
 //                 const isExp = new Date(m.expiry) < new Date()
 //                 return (
 //                   <div key={m.id} className={`p-3 border rounded-lg shadow-sm bg-white ${isLow ? 'bg-amber-50/50' : ''} ${isExp ? 'bg-rose-50/50' : ''}`}>
 //                     <div className="flex items-center justify-between mb-1">
 //                       <div className="font-semibold">{m.name}</div>
 //                       <button
 //                         onClick={() => openSaleModal(m.id)}
 //                         className="px-2.5 py-1 text-xs border rounded-md border-sky-200 text-sky-700"
 //                       >
 //                         بيع
 //                       </button>
 //                     </div>
 //                     <div className="text-xs text-gray-600">الشركة: {m.company}</div>
 //                     <div className="text-xs text-gray-600">السعر: {m.price} ر.س</div>
 //                     <div className={`text-xs ${isLow ? 'text-amber-700' : 'text-green-700'}`}>الكمية: {m.quantity}</div>
 //                     <div className={`text-xs ${isExp ? 'text-rose-700' : 'text-gray-600'}`}>الصلاحية: {m.expiry}</div>
 //                   </div>
 //                 )
 //               })}
 //             </div>
 //           </div>
 //         )}
 //         {/* تبويب المبيعات */}
 //         {activeTab === 'sales' && (
 //           <div className="p-4 bg-white border rounded-lg shadow-sm">
 //             {/* فلاتر التاريخ */}
 //             <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
 //               <div className="flex flex-wrap gap-2">
 //                 {[
 //                   { key: 'today', label: 'اليوم' },
 //                   { key: 'week', label: 'الأسبوع' },
 //                   { key: 'month', label: 'الشهر' },
 //                   { key: 'custom', label: 'مخصص' },
 //                 ].map(b => (
 //                   <button
 //                     key={b.key}
 //                     onClick={() => setDateRange(b.key)}
 //                     className={`px-3 py-1.5 rounded-md text-sm border
 //                       ${dateRange === b.key ? 'text-white' : 'text-gray-600 bg-white'}
 //                     `}
 //                     style={{
 //                       backgroundColor: dateRange === b.key ? theme.colors.primary : undefined,
 //                       borderColor: dateRange === b.key ? theme.colors.primary : '#e5e7eb'
 //                     }}
 //                   >
 //                     {b.label}
 //                   </button>
 //                 ))}
 //               </div>
 //               {dateRange === 'custom' && (
 //                 <div className="flex flex-wrap items-center gap-2">
 //                   <input
 //                     type="date"
 //                     value={customFrom}
 //                     onChange={e => setCustomFrom(e.target.value)}
 //                     className="px-3 py-2 text-sm border rounded-md"
 //                   />
 //                   <span className="text-sm text-gray-500">إلى</span>
 //                   <input
 //                     type="date"
 //                     value={customTo}
 //                     onChange={e => setCustomTo(e.target.value)}
 //                     className="px-3 py-2 text-sm border rounded-md"
 //                   />
 //                 </div>
 //               )}
 //             </div>
 //             {/* جدول المبيعات */}
 //             <div ref={printRef}>
 //               <table className="w-full text-sm text-right border-t border-gray-100">
 //                 <thead className="text-gray-600 bg-gray-50">
 //                   <tr>
 //                     <th className="px-3 py-2">التاريخ</th>
 //                     <th className="px-3 py-2">الدواء</th>
 //                     <th className="px-3 py-2">الكمية</th>
 //                     <th className="px-3 py-2">السعر</th>
 //                     <th className="px-3 py-2">الإجمالي</th>
 //                   </tr>
 //                 </thead>
 //                 <tbody>
 //                   {filteredSales.map(s => (
 //                     <tr key={s.id} className="border-t hover:bg-gray-50">
 //                       <td className="px-3 py-2">{s.date}</td>
 //                       <td className="px-3 py-2">{s.name}</td>
 //                       <td className="px-3 py-2">{s.qty}</td>
 //                       <td className="px-3 py-2">{s.price} ر.س</td>
 //                       <td className="px-3 py-2 font-semibold text-sky-700">{(s.qty * s.price).toFixed(2)} ر.س</td>
 //                     </tr>
 //                   ))}
 //                 </tbody>
 //               </table>
 //               <div className="mt-3 text-left">
 //                 <span className="px-3 py-1 text-sm font-semibold text-green-700 border border-green-200 rounded-md bg-green-50">
 //                   الإجمالي: {totalSales.toFixed(2)} ر.س
 //                 </span>
 //               </div>
 //             </div>
 //             {/* أزرار التقرير */}
 //             <div className="flex flex-wrap justify-end gap-2 mt-4">
 //               <button onClick={() => setShowSalesReport(true)} className="px-4 py-2 text-white rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700">
 //                 معاينة التقرير
 //               </button>
 //               <button onClick={printSales} className="px-4 py-2 text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700">
 //                 🖨️ طباعة
 //               </button>
 //               <button onClick={exportCSV} className="px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700">
 //                 📥 تصدير CSV
 //               </button>
 //             </div>
 //           </div>
 //         )}
 //         {/* تبويب التنبيهات */}
 //         {activeTab === 'alerts' && (
 //           <div className="grid gap-4 sm:grid-cols-2">
 //             <div className="p-4 bg-white border rounded-lg shadow-sm">
 //               <h3 className="mb-2 text-lg font-semibold text-amber-700">منخفض المخزون</h3>
 //               {lowStock.length ? lowStock.map(m => (
 //                 <div key={m.id} className="p-2 mb-1 text-sm border rounded-md bg-amber-50/60 border-amber-200">
 //                   {m.name} — الكمية: <b>{m.quantity}</b>
 //                 </div>
 //               )) : <div className="text-sm text-gray-500">لا يوجد عناصر</div>}
 //             </div>
 //             <div className="p-4 bg-white border rounded-lg shadow-sm">
 //               <h3 className="mb-2 text-lg font-semibold text-rose-700">منتهي الصلاحية</h3>
 //               {expired.length ? expired.map(m => (
 //                 <div key={m.id} className="p-2 mb-1 text-sm border rounded-md bg-rose-50/60 border-rose-200">
 //                   {m.name} — الصلاحية: <b>{m.expiry}</b>
 //                 </div>
 //               )) : <div className="text-sm text-gray-500">لا يوجد عناصر</div>}
 //             </div>
 //           </div>
 //         )}
 //       </div>
 //       {/* مودال تسجيل بيع */}
 //       {showSaleModal && (
 //         <Modal title="تسجيل عملية بيع" onClose={() => setShowSaleModal(false)}>
 //           <div className="space-y-3 text-right">
 //             <label className="block text-sm">اختر الدواء</label>
 //             <select
 //               value={saleForm.medId}
 //               onChange={(e) => {
 //                 const id = Number(e.target.value)
 //                 const med = medicines.find(m => m.id === id)
 //                 setSaleForm({ medId: id, qty: 1, price: med?.price || 0 })
 //               }}
 //               className="w-full px-3 py-2 border rounded-md"
 //             >
 //               <option value="">— اختر —</option>
 //               {medicines.map(m => (
 //                 <option key={m.id} value={m.id}>{m.name} — المخزون: {m.quantity}</option>
 //               ))}
 //             </select>
 //             <label className="block text-sm">الكمية</label>
 //             <input
 //               type="number"
 //               min="1"
 //               value={saleForm.qty}
 //               onChange={(e) => setSaleForm({ ...saleForm, qty: Number(e.target.value) })}
 //               className="w-full px-3 py-2 border rounded-md"
 //             />
 //             <label className="block text-sm">السعر (يمكن تعديله)</label>
 //             <input
 //               type="number"
 //               min="0"
 //               value={saleForm.price}
 //               onChange={(e) => setSaleForm({ ...saleForm, price: Number(e.target.value) })}
 //               className="w-full px-3 py-2 border rounded-md"
 //             />
 //             <div className="flex justify-end gap-2 pt-2">
 //               <button onClick={submitSale} className="px-4 py-2 text-white rounded-md bg-emerald-600 hover:bg-emerald-700">
 //                 حفظ العملية
 //               </button>
 //               <button onClick={() => setShowSaleModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
 //                 إلغاء
 //               </button>
 //             </div>
 //           </div>
 //         </Modal>
 //       )}
 //       {/* مودال معاينة التقرير للطباعة */}
 //       {showSalesReport && (
 //         <Modal title="معاينة تقرير المبيعات" onClose={() => setShowSalesReport(false)}>
 //           <div className="space-y-3 text-sm" ref={printRef}>
 //             <div className="text-center">
 //               <div className="text-lg font-bold" style={{ color: theme.colors.primary }}>تقرير المبيعات</div>
 //               <div className="text-gray-500">{new Date().toLocaleString('ar-SA')}</div>
 //             </div>
 //             <table className="w-full border border-gray-200">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">التاريخ</th>
 //                   <th className="px-3 py-2">الدواء</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {filteredSales.map(s => (
 //                   <tr key={`p-${s.id}`} className="border-t">
 //                     <td className="px-3 py-2">{s.date}</td>
 //                     <td className="px-3 py-2">{s.name}</td>
 //                     <td className="px-3 py-2">{s.qty}</td>
 //                     <td className="px-3 py-2">{s.price} ر.س</td>
 //                     <td className="px-3 py-2">{(s.qty * s.price).toFixed(2)} ر.س</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //             <div className="font-semibold text-left text-green-700">الإجمالي: {totalSales.toFixed(2)} ر.س</div>
 //           </div>
 //           <div className="flex justify-end gap-2 mt-4">
 //             <button onClick={printSales} className="px-4 py-2 text-white rounded-md bg-sky-600 hover:bg-sky-700">
 //               🖨️ طباعة
 //             </button>
 //             <button onClick={exportCSV} className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
 //               📥 CSV
 //             </button>
 //             <button onClick={() => setShowSalesReport(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
 //               إغلاق
 //             </button>
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
 // export default function Pharmacist() {
 //   const [user, setUser] = useState({ name: 'الصيدلي محمد' })
 //   const [medicines, setMedicines] = useState([])
 //   const [lowStock, setLowStock] = useState([])
 //   const [expired, setExpired] = useState([])
 //   const [sales, setSales] = useState([])
 //   const [searchTerm, setSearchTerm] = useState('')
 //   const [showDetailsModal, setShowDetailsModal] = useState(null)
 //   const [showAddModal, setShowAddModal] = useState(false)
 //   const [showSalesReport, setShowSalesReport] = useState(false)
 //   const reportRef = useRef(null)
 //   const [newMedicine, setNewMedicine] = useState({
 //     name: '',
 //     company: '',
 //     price: '',
 //     quantity: '',
 //     expiry: '',
 //   })
 //   useEffect(() => {
 //     const mockMedicines = [
 //       { id: 1, name: 'باراسيتامول 500mg', company: 'GSK', price: 15, quantity: 10, expiry: '2025-12-10' },
 //       { id: 2, name: 'أموكسيسيلين 250mg', company: 'Pfizer', price: 25, quantity: 3, expiry: '2024-06-02' },
 //       { id: 3, name: 'ايبوبروفين 400mg', company: 'Novartis', price: 18, quantity: 2, expiry: '2023-12-30' },
 //     ]
 //     setMedicines(mockMedicines)
 //     const today = new Date()
 //     setLowStock(mockMedicines.filter((m) => m.quantity <= 5))
 //     setExpired(mockMedicines.filter((m) => new Date(m.expiry) < today))
 //     // 🧾 بيانات مبيعات افتراضية (قابلة للتوسع لاحقاً)
 //     setSales([
 //       { id: 1, date: '2025-11-02', name: 'باراسيتامول 500mg', qty: 5, price: 15 },
 //       { id: 2, date: '2025-11-02', name: 'فيتامين سي 1000mg', qty: 2, price: 25 },
 //       { id: 3, date: '2025-11-01', name: 'أموكسيسيلين 250mg', qty: 3, price: 45 },
 //     ])
 //   }, [])
 //   const filteredMedicines = medicines.filter(
 //     (m) =>
 //       m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 //       m.company.toLowerCase().includes(searchTerm.toLowerCase())
 //   )
 //   const totalSalesToday = sales
 //     .filter((s) => s.date === new Date().toISOString().slice(0, 10))
 //     .reduce((sum, s) => sum + s.qty * s.price, 0)
 //   // 🖨️ دالة الطباعة
 //   const handlePrint = () => {
 //     const printWindow = window.open('', '', 'width=850,height=900')
 //     printWindow.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير مبيعات الصيدلي</title>
 //           <style>
 //             body {
 //               font-family: 'Tajawal', sans-serif;
 //               padding: 25px;
 //               direction: rtl;
 //               background-color: #fff;
 //               color: #333;
 //             }
 //             h2 {
 //               text-align: center;
 //               color: #0369a1;
 //               margin-bottom: 10px;
 //             }
 //             table {
 //               width: 100%;
 //               border-collapse: collapse;
 //               margin-top: 15px;
 //             }
 //             th, td {
 //               border: 1px solid #ccc;
 //               padding: 8px;
 //               text-align: center;
 //             }
 //             th {
 //               background: #f1f5f9;
 //               font-weight: bold;
 //             }
 //             tfoot td {
 //               background: #e2e8f0;
 //               font-weight: bold;
 //             }
 //             .footer {
 //               margin-top: 40px;
 //               text-align: center;
 //               color: #555;
 //             }
 //             .signature {
 //               margin-top: 30px;
 //               text-align: left;
 //               font-size: 14px;
 //               color: #444;
 //             }
 //             .logo {
 //               text-align: center;
 //               margin-bottom: 20px;
 //             }
 //             .logo img {
 //               width: 80px;
 //             }
 //           </style>
 //         </head>
 //         <body>
 //           <div class="logo">
 //             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Pharmacy_symbol.svg/512px-Pharmacy_symbol.svg.png" alt="شعار الصيدلية" />
 //             <h2>تقرير مبيعات الصيدلي</h2>
 //           </div>
 //           ${reportRef.current.innerHTML}
 //           <div class="footer">
 //             <p>تم توليد التقرير في ${new Date().toLocaleString('ar-SA')}</p>
 //           </div>
 //           <div class="signature">
 //             <p>توقيع الصيدلي: .....................................</p>
 //           </div>
 //         </body>
 //       </html>
 //     `)
 //     printWindow.document.close()
 //     printWindow.focus()
 //     printWindow.print()
 //     printWindow.close()
 //   }
 //   return (
 //     <Layout user={user} title="لوحة الصيدلي">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 🔹 شريط التحكم */}
 //         <div className="flex flex-wrap items-center justify-between gap-3">
 //           <input
 //             type="text"
 //             placeholder="🔍 ابحث باسم الدواء أو الشركة..."
 //             value={searchTerm}
 //             onChange={(e) => setSearchTerm(e.target.value)}
 //             className="flex-1 px-4 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sky-400"
 //           />
 //           <div className="flex gap-2">
 //             <button
 //               onClick={() => setShowAddModal(true)}
 //               className="px-5 py-2 text-white rounded-md shadow bg-sky-600 hover:bg-sky-700"
 //             >
 //               ➕ إضافة دواء
 //             </button>
 //             <button
 //               onClick={() => setShowSalesReport(true)}
 //               className="px-5 py-2 text-white bg-green-600 rounded-md shadow hover:bg-green-700"
 //             >
 //               📊 تقرير المبيعات
 //             </button>
 //           </div>
 //         </div>
 //         {/* 💊 جدول الأدوية */}
 //         <div className="p-4 bg-white border rounded-lg shadow-sm">
 //           <h3 className="mb-3 text-lg font-semibold text-gray-700">قائمة الأدوية</h3>
 //           <table className="w-full text-sm text-right border-t border-gray-100">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">اسم الدواء</th>
 //                 <th className="px-3 py-2">الشركة</th>
 //                 <th className="px-3 py-2">السعر</th>
 //                 <th className="px-3 py-2">الكمية</th>
 //                 <th className="px-3 py-2">الانتهاء</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filteredMedicines.map((m) => (
 //                 <tr key={m.id} className="border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2">{m.name}</td>
 //                   <td className="px-3 py-2">{m.company}</td>
 //                   <td className="px-3 py-2">{m.price} ر.س</td>
 //                   <td className={`px-3 py-2 ${m.quantity <= 5 ? 'text-red-600' : 'text-green-700'}`}>
 //                     {m.quantity}
 //                   </td>
 //                   <td className={`px-3 py-2 ${new Date(m.expiry) < new Date() ? 'text-red-600' : ''}`}>
 //                     {m.expiry}
 //                   </td>
 //                 </tr>
 //               ))}
 //             </tbody>
 //           </table>
 //         </div>
 //       </div>
 //       {/* 📊 مودال تقرير المبيعات */}
 //       {showSalesReport && (
 //         <Modal title="تقرير مبيعات الصيدلي" onClose={() => setShowSalesReport(false)}>
 //           <div ref={reportRef} className="space-y-2 text-sm text-gray-700">
 //             <h3 className="mb-3 text-lg font-semibold text-center text-sky-700">
 //               💊 تقرير المبيعات اليومية
 //             </h3>
 //             <table className="w-full text-sm text-right border border-gray-200">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">التاريخ</th>
 //                   <th className="px-3 py-2">اسم الدواء</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {sales.map((s) => (
 //                   <tr key={s.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{s.date}</td>
 //                     <td className="px-3 py-2">{s.name}</td>
 //                     <td className="px-3 py-2">{s.qty}</td>
 //                     <td className="px-3 py-2">{s.price} ر.س</td>
 //                     <td className="px-3 py-2 font-semibold text-sky-700">
 //                       {(s.qty * s.price).toFixed(2)} ر.س
 //                     </td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //             <div className="mt-4 font-semibold text-center text-green-700">
 //               🧾 إجمالي مبيعات اليوم: {totalSalesToday.toFixed(2)} ر.س
 //             </div>
 //           </div>
 //           <button
 //             onClick={handlePrint}
 //             className="w-full py-2 mt-4 text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //           >
 //             🖨️ طباعة التقرير
 //           </button>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
_c5 = SummaryCard;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "PharmacistPage");
__turbopack_context__.k.register(_c1, "TabButton");
__turbopack_context__.k.register(_c2, "MedicinesTab");
__turbopack_context__.k.register(_c3, "SalesTab");
__turbopack_context__.k.register(_c4, "AlertsTab");
__turbopack_context__.k.register(_c5, "SummaryCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/pharmacist.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/pharmacist";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/pharmacist.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/pharmacist\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/pharmacist.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__09a857be._.js.map