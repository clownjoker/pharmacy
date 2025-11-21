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
"[project]/context/InventoryContext.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// context/InventoryContext.js
__turbopack_context__.s([
    "InventoryProvider",
    ()=>InventoryProvider,
    "useInventory",
    ()=>useInventory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const InventoryContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])();
function InventoryProvider({ children }) {
    _s();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InventoryContext.Provider, {
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
_s(InventoryProvider, "/WYKqNVjUAgaabEjqAV1vhOWEjM=");
_c = InventoryProvider;
function useInventory() {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(InventoryContext);
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
_s1(useInventory, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "InventoryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/WarningIndicator.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/WarningIndicator.js
__turbopack_context__.s([
    "default",
    ()=>WarningIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function WarningIndicator({ warnings }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (!warnings || warnings.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative inline-block text-right",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen((v)=>!v),
                className: "flex items-center justify-center text-yellow-600 transition bg-yellow-100 rounded-full shadow  w-7 h-7 hover:bg-yellow-200",
                children: "⚠️"
            }, void 0, false, {
                fileName: "[project]/components/WarningIndicator.js",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 z-50 p-3 text-xs bg-white border border-gray-200 rounded-lg shadow-xl  top-8 w-52 animate-fade",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-2 font-semibold text-gray-700",
                        children: "تفاصيل التحذيرات:"
                    }, void 0, false, {
                        fileName: "[project]/components/WarningIndicator.js",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "space-y-1 overflow-y-auto max-h-40",
                        children: warnings.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(WarningIndicator, "xG1TONbKtDWtdOTrXaTAsNhPg/Q=");
_c = WarningIndicator;
var _c;
__turbopack_context__.k.register(_c, "WarningIndicator");
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
"[project]/utils/api.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: "http://127.0.0.1:5000/api"
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/products.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/products.js
__turbopack_context__.s([
    "default",
    ()=>ProductsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Layout.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AuthContext.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$InventoryContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/InventoryContext.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WarningIndicator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/WarningIndicator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Modal.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
function ProductsPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, hasPermission } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { getWarnings, printInventoryReport } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$InventoryContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useInventory"])();
    // المنتجات الآن تأتي من الباك-إند
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // بحث وفلترة وترتيب
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [categoryFilter, setCategoryFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [companyFilter, setCompanyFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [sortByName, setSortByName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("asc");
    const [filterLowStock, setFilterLowStock] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filterNearExpiry, setFilterNearExpiry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filterExpired, setFilterExpired] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // عرض تفاصيل
    const [showDetails, setShowDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedProduct, setSelectedProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // إضافة منتج
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newProduct, setNewProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        sku: "",
        category: "",
        company: "",
        purchasePrice: "",
        price: "",
        quantity: "",
        minQty: 5,
        expiryDate: ""
    });
    // تحميل المنتجات من الباك-إند
    const loadProducts = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error("loadProducts error:", err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("⚠️ خطأ في تحميل المنتجات");
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductsPage.useEffect": ()=>{
            loadProducts();
        }
    }["ProductsPage.useEffect"], []);
    if (!hasPermission([
        "admin",
        "pharmacist"
    ])) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            dir: "rtl",
            className: "flex items-center justify-center min-h-screen p-6 bg-slate-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4 text-sm font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl",
                children: "⚠️ لا يمكنك دخول هذه الصفحة. الرجاء التواصل مع مدير النظام لتحديث صلاحياتك."
            }, void 0, false, {
                fileName: "[project]/pages/products.js",
                lineNumber: 65,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/products.js",
            lineNumber: 64,
            columnNumber: 7
        }, this);
    }
    // الفئات والشركات المتاحة للفلاتر
    const categories = [
        "all",
        ...new Set(products.map((p)=>p.category).filter(Boolean))
    ];
    const companies = [
        "all",
        ...new Set(products.map((p)=>p.company).filter(Boolean))
    ];
    // إحصائيات سريعة للـ Dashboard
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductsPage.useMemo[stats]": ()=>{
            const totalProducts = products.length;
            const totalQty = products.reduce({
                "ProductsPage.useMemo[stats].totalQty": (sum, p)=>sum + (Number(p.quantity) || 0)
            }["ProductsPage.useMemo[stats].totalQty"], 0);
            const stockValue = products.reduce({
                "ProductsPage.useMemo[stats].stockValue": (sum, p)=>sum + (Number(p.price) || 0) * (Number(p.quantity) || 0)
            }["ProductsPage.useMemo[stats].stockValue"], 0);
            return {
                totalProducts,
                totalQty,
                stockValue
            };
        }
    }["ProductsPage.useMemo[stats]"], [
        products
    ]);
    // فلترة المنتجات
    const filteredProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductsPage.useMemo[filteredProducts]": ()=>{
            let result = [
                ...products
            ];
            if (search.trim() !== "") {
                result = result.filter({
                    "ProductsPage.useMemo[filteredProducts]": (p)=>(p.name || "").toLowerCase().includes(search.toLowerCase())
                }["ProductsPage.useMemo[filteredProducts]"]);
            }
            if (categoryFilter !== "all") {
                result = result.filter({
                    "ProductsPage.useMemo[filteredProducts]": (p)=>p.category === categoryFilter
                }["ProductsPage.useMemo[filteredProducts]"]);
            }
            if (companyFilter !== "all") {
                result = result.filter({
                    "ProductsPage.useMemo[filteredProducts]": (p)=>p.company === companyFilter
                }["ProductsPage.useMemo[filteredProducts]"]);
            }
            if (filterLowStock) {
                result = result.filter({
                    "ProductsPage.useMemo[filteredProducts]": (p)=>(p.quantity || 0) <= (p.minQty || 0)
                }["ProductsPage.useMemo[filteredProducts]"]);
            }
            if (filterNearExpiry) {
                result = result.filter({
                    "ProductsPage.useMemo[filteredProducts]": (p)=>{
                        if (!p.expiryDate) return false;
                        const days = (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
                        return days > 0 && days <= 30;
                    }
                }["ProductsPage.useMemo[filteredProducts]"]);
            }
            if (filterExpired) {
                result = result.filter({
                    "ProductsPage.useMemo[filteredProducts]": (p)=>{
                        if (!p.expiryDate) return false;
                        const days = (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
                        return days < 0;
                    }
                }["ProductsPage.useMemo[filteredProducts]"]);
            }
            result.sort({
                "ProductsPage.useMemo[filteredProducts]": (a, b)=>{
                    const aName = a.name || "";
                    const bName = b.name || "";
                    if (sortByName === "asc") return aName.localeCompare(bName);
                    return bName.localeCompare(aName);
                }
            }["ProductsPage.useMemo[filteredProducts]"]);
            return result;
        }
    }["ProductsPage.useMemo[filteredProducts]"], [
        search,
        categoryFilter,
        companyFilter,
        sortByName,
        filterLowStock,
        filterNearExpiry,
        filterExpired,
        products
    ]);
    const openDetails = (p)=>{
        setSelectedProduct(p);
        setShowDetails(true);
    };
    // حذف منتج من الباك-إند
    const deleteProduct = async (id)=>{
        const ok = confirm("هل أنت متأكد من حذف المنتج؟");
        if (!ok) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].delete(`/products/${id}`);
            setProducts((prev)=>prev.filter((p)=>p.id !== id));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].success("تم حذف المنتج");
        } catch (err) {
            console.error("deleteProduct error:", err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("خطأ في حذف المنتج");
        }
    };
    // إضافة منتج جديد للباك-إند
    const handleAddProduct = async ()=>{
        if (!newProduct.name || !newProduct.price) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("الاسم والسعر مطلوبان على الأقل");
            return;
        }
        try {
            const payload = {
                name: newProduct.name,
                sku: newProduct.sku,
                category: newProduct.category,
                company: newProduct.company,
                purchasePrice: Number(newProduct.purchasePrice) || 0,
                price: Number(newProduct.price) || 0,
                quantity: Number(newProduct.quantity) || 0,
                minQty: Number(newProduct.minQty) || 0,
                expiryDate: newProduct.expiryDate || null
            };
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("/products", payload);
            setProducts((prev)=>[
                    ...prev,
                    res.data
                ]);
            setShowAddModal(false);
            setNewProduct({
                name: "",
                sku: "",
                category: "",
                company: "",
                purchasePrice: "",
                price: "",
                quantity: "",
                minQty: 5,
                expiryDate: ""
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].success("تم إضافة المنتج بنجاح");
        } catch (err) {
            console.error("handleAddProduct error:", err);
            const msg = err.response?.data?.message || "فشل إضافة المنتج";
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error(msg);
        }
    };
    const printProducts = ()=>{
        const w = window.open("", "", "width=900,height=700");
        w.document.write(`
      <html dir="rtl" lang="ar">
      <head>
        <title>تقرير المنتجات</title>
        <style>
          body { font-family:'Tajawal',sans-serif; padding:20px; }
          h2 { text-align:center; margin-bottom: 10px; }
          p.info { text-align:center; font-size: 12px; color:#64748b; margin:0; }
          table { width:100%; border-collapse:collapse; margin-top:20px; }
          th, td { border:1px solid #ddd; padding:6px; font-size:12px; text-align:right; }
          th { background:#f1f5f9; }
        </style>
      </head>
      <body>
        <h2>📄 تقرير المنتجات</h2>
        <p class="info">عدد المنتجات: ${products.length} | تم التوليد في: ${new Date().toLocaleString("ar-EG")}</p>
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الكود</th>
              <th>الفئة</th>
              <th>الشركة</th>
              <th>سعر الشراء</th>
              <th>سعر البيع</th>
              <th>الكمية</th>
              <th>ربح/وحدة</th>
              <th>إجمالي الربح</th>
              <th>الصلاحية</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((p)=>{
            const unitProfit = (p.price || 0) - (p.purchasePrice || 0);
            const totalProfit = unitProfit * (p.quantity || 0);
            return `
                  <tr>
                    <td>${p.name || ""}</td>
                    <td>${p.sku || ""}</td>
                    <td>${p.category || ""}</td>
                    <td>${p.company || ""}</td>
                    <td>${p.purchasePrice || 0}</td>
                    <td>${p.price || 0}</td>
                    <td>${p.quantity || 0}</td>
                    <td>${unitProfit.toFixed(2)}</td>
                    <td>${totalProfit.toFixed(2)}</td>
                    <td>${p.expiryDate || ""}</td>
                  </tr>
                `;
        }).join("")}
          </tbody>
        </table>
        <script>window.print()</script>
      </body>
      </html>
    `);
        w.document.close();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        user: user,
        title: "إدارة المنتجات",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            dir: "rtl",
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "flex items-center gap-2 text-2xl font-bold text-slate-800",
                                    children: "💊 إدارة المنتجات"
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 306,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-500",
                                    children: "متابعة مخزون الأدوية، هوامش الربح، وتحذيرات الصلاحية من واجهة واحدة."
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 309,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/products.js",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowAddModal(true),
                                    className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm bg-emerald-600 hover:bg-emerald-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "➕"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 319,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "إضافة منتج"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 320,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 315,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: printProducts,
                                    className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "🖨️"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 327,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "طباعة تقرير"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 328,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 323,
                                    columnNumber: 13
                                }, this),
                                printInventoryReport && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: printInventoryReport,
                                    className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-100 rounded-lg bg-indigo-50 hover:bg-indigo-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "📥"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 336,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "تقرير الجرد (PDF)"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 337,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 332,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/products.js",
                            lineNumber: 314,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/products.js",
                    lineNumber: 304,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-4 md:grid-cols-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                            label: "إجمالي المنتجات",
                            value: stats.totalProducts.toLocaleString("ar-EG"),
                            icon: "📦",
                            color: "bg-sky-50 text-sky-700 border-sky-100"
                        }, void 0, false, {
                            fileName: "[project]/pages/products.js",
                            lineNumber: 345,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                            label: "إجمالي الكمية بالمخزون",
                            value: stats.totalQty.toLocaleString("ar-EG"),
                            icon: "📊",
                            color: "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }, void 0, false, {
                            fileName: "[project]/pages/products.js",
                            lineNumber: 351,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                            label: "قيمة المخزون (تقريبية)",
                            value: `${stats.stockValue.toFixed(2).toLocaleString("en-US")} ر.س`,
                            icon: "💰",
                            color: "bg-amber-50 text-amber-700 border-amber-100"
                        }, void 0, false, {
                            fileName: "[project]/pages/products.js",
                            lineNumber: 357,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/products.js",
                    lineNumber: 344,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 space-y-4 bg-white border shadow-sm rounded-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute text-slate-400 left-3 top-2.5",
                                    children: "🔎"
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 368,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "ابحث عن منتج بالاسم، الكود، أو الشركة…",
                                    className: "w-full p-3 pr-3 text-sm border rounded-xl pl-9 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500",
                                    value: search,
                                    onChange: (e)=>setSearch(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/products.js",
                            lineNumber: 367,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center gap-3 text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-slate-500",
                                            children: "الفئة:"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 380,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "p-2 text-xs border rounded-lg border-slate-200 bg-slate-50",
                                            value: categoryFilter,
                                            onChange: (e)=>setCategoryFilter(e.target.value),
                                            children: categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: cat,
                                                    children: cat === "all" ? "كل الفئات" : cat
                                                }, cat, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 387,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 381,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 379,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-slate-500",
                                            children: "الشركة:"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 395,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "p-2 text-xs border rounded-lg border-slate-200 bg-slate-50",
                                            value: companyFilter,
                                            onChange: (e)=>setCompanyFilter(e.target.value),
                                            children: companies.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: c,
                                                    children: c === "all" ? "كل الشركات" : c
                                                }, c, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 402,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 396,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 394,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-slate-500",
                                            children: "ترتيب:"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 410,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "p-2 text-xs border rounded-lg border-slate-200 bg-slate-50",
                                            value: sortByName,
                                            onChange: (e)=>setSortByName(e.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "asc",
                                                    children: "اسم المنتج (تصاعدي)"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 416,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "desc",
                                                    children: "اسم المنتج (تنازلي)"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 417,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 411,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 409,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-2 mt-2 md:mt-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterChip, {
                                            active: filterLowStock,
                                            onClick: ()=>setFilterLowStock(!filterLowStock),
                                            label: "كمية منخفضة"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 423,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterChip, {
                                            active: filterNearExpiry,
                                            onClick: ()=>setFilterNearExpiry(!filterNearExpiry),
                                            label: "قرب انتهاء الصلاحية"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 428,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterChip, {
                                            active: filterExpired,
                                            onClick: ()=>setFilterExpired(!filterExpired),
                                            label: "منتهي الصلاحية"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 433,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 422,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/products.js",
                            lineNumber: 378,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/products.js",
                    lineNumber: 366,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto bg-white border shadow-sm rounded-2xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-sm text-right min-w-[980px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "text-xs uppercase border-b bg-slate-50 text-slate-500",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium",
                                            children: "الاسم"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 447,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium",
                                            children: "الكود"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 448,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium",
                                            children: "الفئة"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 449,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium",
                                            children: "الشركة"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 450,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium",
                                            children: "سعر الشراء"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 451,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium",
                                            children: "سعر البيع"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 452,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium",
                                            children: "المخزون"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 453,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium",
                                            children: "ربح/وحدة"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 454,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium",
                                            children: "إجمالي الربح"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 455,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium",
                                            children: "الصلاحية"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 456,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium text-center",
                                            children: "تحذيرات"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 457,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 font-medium text-center",
                                            children: "إجراءات"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 458,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 446,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 445,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: [
                                    filteredProducts.map((p)=>{
                                        const warnings = getWarnings(p);
                                        const unitProfit = (p.price || 0) - (p.purchasePrice || 0);
                                        const totalProfit = unitProfit * (p.quantity || 0);
                                        let expiryText = p.expiryDate || "-";
                                        if (warnings.includes("❌ المنتج منتهي الصلاحية!")) {
                                            expiryText = "منتهي";
                                        }
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "transition-colors border-t border-slate-100 even:bg-slate-50/40 hover:bg-slate-100/60",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-3 font-medium text-slate-800",
                                                    children: p.name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 479,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-3 text-slate-600",
                                                    children: p.sku
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 482,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-3 text-slate-600",
                                                    children: p.category
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 483,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-3 text-slate-600",
                                                    children: p.company
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 484,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-3 text-slate-700",
                                                    children: [
                                                        p.purchasePrice || 0,
                                                        " ر.س"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 485,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-3 text-slate-700",
                                                    children: [
                                                        p.price || 0,
                                                        " ر.س"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 488,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: `p-3 ${(p.quantity || 0) <= (p.minQty || 0) ? "text-red-600 font-bold" : "text-slate-800"}`,
                                                    children: p.quantity
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 491,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-3 text-slate-700",
                                                    children: [
                                                        unitProfit.toFixed(2),
                                                        " ر.س"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 500,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-3 text-slate-700",
                                                    children: [
                                                        totalProfit.toFixed(2),
                                                        " ر.س"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 503,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-3 text-slate-700",
                                                    children: expiryText
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 506,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-3 text-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WarningIndicator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        warnings: warnings
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/products.js",
                                                        lineNumber: 509,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 508,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-3 text-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap justify-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>openDetails(p),
                                                                className: "px-3 py-1 text-xs font-medium text-indigo-700 rounded-lg bg-indigo-50 hover:bg-indigo-100",
                                                                children: "🔍 عرض"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/products.js",
                                                                lineNumber: 514,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>router.push(`/inventory?product=${p.id}`),
                                                                className: "px-3 py-1 text-xs font-medium text-blue-700 rounded-lg bg-blue-50 hover:bg-blue-100",
                                                                children: "📦 مخزون"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/products.js",
                                                                lineNumber: 521,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>router.push(`/products/edit/${p.id}`),
                                                                className: "px-3 py-1 text-xs font-medium rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100",
                                                                children: "✏️ تعديل"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/products.js",
                                                                lineNumber: 530,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>deleteProduct(p.id),
                                                                className: "px-3 py-1 text-xs font-medium text-red-700 rounded-lg bg-red-50 hover:bg-red-100",
                                                                children: "🗑️ حذف"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/products.js",
                                                                lineNumber: 539,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/products.js",
                                                        lineNumber: 513,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/products.js",
                                                    lineNumber: 512,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, p.id, true, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 475,
                                            columnNumber: 19
                                        }, this);
                                    }),
                                    !filteredProducts.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 12,
                                            className: "p-6 text-sm text-center text-slate-400",
                                            children: "لا توجد نتائج مطابقة للبحث / الفلاتر الحالية…"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/products.js",
                                            lineNumber: 553,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 552,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 462,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/products.js",
                        lineNumber: 444,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/products.js",
                    lineNumber: 443,
                    columnNumber: 9
                }, this),
                showDetails && selectedProduct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    title: "تفاصيل المنتج",
                    onClose: ()=>setShowDetails(false),
                    onConfirm: ()=>setShowDetails(false),
                    confirmLabel: "إغلاق",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 text-sm",
                        dir: "rtl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "الاسم:"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 571,
                                        columnNumber: 18
                                    }, this),
                                    " ",
                                    selectedProduct.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 571,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "الكود:"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 572,
                                        columnNumber: 18
                                    }, this),
                                    " ",
                                    selectedProduct.sku
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 572,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "الفئة:"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 573,
                                        columnNumber: 18
                                    }, this),
                                    " ",
                                    selectedProduct.category
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 573,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "الشركة:"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 574,
                                        columnNumber: 18
                                    }, this),
                                    " ",
                                    selectedProduct.company
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 574,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "سعر الشراء:"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 575,
                                        columnNumber: 18
                                    }, this),
                                    " ",
                                    selectedProduct.purchasePrice || 0,
                                    " ر.س"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 575,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "سعر البيع:"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 576,
                                        columnNumber: 18
                                    }, this),
                                    " ",
                                    selectedProduct.price || 0,
                                    " ر.س"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 576,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "الكمية:"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 577,
                                        columnNumber: 18
                                    }, this),
                                    " ",
                                    selectedProduct.quantity
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 577,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "الحد الأدنى:"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 578,
                                        columnNumber: 18
                                    }, this),
                                    " ",
                                    selectedProduct.minQty
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 578,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "تاريخ الانتهاء:"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 579,
                                        columnNumber: 18
                                    }, this),
                                    " ",
                                    selectedProduct.expiryDate || "-"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 579,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "التحذيرات:"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 582,
                                        columnNumber: 17
                                    }, this),
                                    getWarnings(selectedProduct).length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "pr-4 mt-1 text-xs text-red-600 list-disc",
                                        children: getWarnings(selectedProduct).map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: w
                                            }, i, false, {
                                                fileName: "[project]/pages/products.js",
                                                lineNumber: 586,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 584,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xs text-emerald-600",
                                        children: "لا توجد تحذيرات على هذا المنتج."
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 590,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/products.js",
                                lineNumber: 581,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/products.js",
                        lineNumber: 570,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/products.js",
                    lineNumber: 564,
                    columnNumber: 11
                }, this),
                showAddModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    title: "إضافة منتج جديد",
                    onClose: ()=>setShowAddModal(false),
                    onConfirm: handleAddProduct,
                    confirmLabel: "إضافة",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-3 text-sm md:grid-cols-2",
                            dir: "rtl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "w-full p-2 border rounded-lg border-slate-200",
                                    placeholder: "اسم المنتج *",
                                    value: newProduct.name,
                                    onChange: (e)=>setNewProduct({
                                            ...newProduct,
                                            name: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 608,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "w-full p-2 border rounded-lg border-slate-200",
                                    placeholder: "الكود SKU",
                                    value: newProduct.sku,
                                    onChange: (e)=>setNewProduct({
                                            ...newProduct,
                                            sku: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 617,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "w-full p-2 border rounded-lg border-slate-200",
                                    placeholder: "الفئة",
                                    value: newProduct.category,
                                    onChange: (e)=>setNewProduct({
                                            ...newProduct,
                                            category: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 626,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "w-full p-2 border rounded-lg border-slate-200",
                                    placeholder: "الشركة",
                                    value: newProduct.company,
                                    onChange: (e)=>setNewProduct({
                                            ...newProduct,
                                            company: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 635,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    className: "w-full p-2 border rounded-lg border-slate-200",
                                    placeholder: "سعر الشراء",
                                    value: newProduct.purchasePrice,
                                    onChange: (e)=>setNewProduct({
                                            ...newProduct,
                                            purchasePrice: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 644,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    className: "w-full p-2 border rounded-lg border-slate-200",
                                    placeholder: "سعر البيع *",
                                    value: newProduct.price,
                                    onChange: (e)=>setNewProduct({
                                            ...newProduct,
                                            price: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 656,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    className: "w-full p-2 border rounded-lg border-slate-200",
                                    placeholder: "الكمية",
                                    value: newProduct.quantity,
                                    onChange: (e)=>setNewProduct({
                                            ...newProduct,
                                            quantity: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 665,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    className: "w-full p-2 border rounded-lg border-slate-200",
                                    placeholder: "الحد الأدنى للتنبيه",
                                    value: newProduct.minQty,
                                    onChange: (e)=>setNewProduct({
                                            ...newProduct,
                                            minQty: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 674,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "md:col-span-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        className: "w-full p-2 border rounded-lg border-slate-200",
                                        value: newProduct.expiryDate,
                                        onChange: (e)=>setNewProduct({
                                                ...newProduct,
                                                expiryDate: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/pages/products.js",
                                        lineNumber: 684,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/products.js",
                                    lineNumber: 683,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/products.js",
                            lineNumber: 607,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-xs text-slate-400",
                            dir: "rtl",
                            children: "الحقول المعلمة بـ * مطلوبة. يمكن تعديل باقي التفاصيل لاحقًا من شاشة تعديل المنتج."
                        }, void 0, false, {
                            fileName: "[project]/pages/products.js",
                            lineNumber: 694,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/products.js",
                    lineNumber: 601,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/products.js",
            lineNumber: 301,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/products.js",
        lineNumber: 300,
        columnNumber: 5
    }, this);
}
_s(ProductsPage, "LzQhYCvpJVD49X2i1avHU9Nc6cc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$InventoryContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useInventory"]
    ];
});
_c = ProductsPage;
// بطاقة إحصائية بسيطة
function StatCard({ label, value, icon, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center justify-between p-4 border rounded-2xl ${color}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-medium text-slate-500",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/pages/products.js",
                        lineNumber: 709,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg font-bold",
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/pages/products.js",
                        lineNumber: 710,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/products.js",
                lineNumber: 708,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center w-10 h-10 text-lg rounded-full bg-white/70",
                children: icon
            }, void 0, false, {
                fileName: "[project]/pages/products.js",
                lineNumber: 712,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/products.js",
        lineNumber: 707,
        columnNumber: 5
    }, this);
}
_c1 = StatCard;
// فلتر كـ "Chip" احترافي
function FilterChip({ active, onClick, label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onClick,
        className: `px-3 py-1 text-xs rounded-full border transition ${active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`,
        children: label
    }, void 0, false, {
        fileName: "[project]/pages/products.js",
        lineNumber: 722,
        columnNumber: 5
    }, this);
} // // pages/products.js
 // import { useState, useMemo } from "react";
 // import { useRouter } from "next/router";
 // import Layout from "../components/Layout";
 // import { useAuth } from "../context/AuthContext";
 // import { useInventory } from "../context/InventoryContext";
 // import WarningIndicator from "../components/WarningIndicator";
 // import Modal from "../components/Modal";
 // export default function ProductsPage() {
 //   const router = useRouter();
 //   const { user, hasPermission } = useAuth();
 //   const {
 //     products,
 //     setProducts,
 //     getWarnings,
 //     printInventoryReport,
 //   } = useInventory();
 //   // بحث وفلترة وترتيب
 //   const [search, setSearch] = useState("");
 //   const [categoryFilter, setCategoryFilter] = useState("all");
 //   const [companyFilter, setCompanyFilter] = useState("all");
 //   const [sortByName, setSortByName] = useState("asc");
 //   const [filterLowStock, setFilterLowStock] = useState(false);
 //   const [filterNearExpiry, setFilterNearExpiry] = useState(false);
 //   const [filterExpired, setFilterExpired] = useState(false);
 //   // عرض تفاصيل
 //   const [showDetails, setShowDetails] = useState(false);
 //   const [selectedProduct, setSelectedProduct] = useState(null);
 //   // إضافة منتج
 //   const [showAddModal, setShowAddModal] = useState(false);
 //   const [newProduct, setNewProduct] = useState({
 //     name: "",
 //     sku: "",
 //     category: "",
 //     company: "",
 //     purchasePrice: "",
 //     price: "",
 //     quantity: "",
 //     minQty: 5,
 //     expiryDate: "",
 //   });
 //   if (!hasPermission(["admin", "pharmacist"])) {
 //     return (
 //       <div dir="rtl" className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
 //         <div className="px-6 py-4 text-sm font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
 //           ⚠️ لا يمكنك دخول هذه الصفحة. الرجاء التواصل مع مدير النظام لتحديث صلاحياتك.
 //         </div>
 //       </div>
 //     );
 //   }
 //   // الفئات والشركات المتاحة للفلاتر
 //   const categories = [
 //     "all",
 //     ...new Set(products.map((p) => p.category).filter(Boolean)),
 //   ];
 //   const companies = [
 //     "all",
 //     ...new Set(products.map((p) => p.company).filter(Boolean)),
 //   ];
 //   // إحصائيات سريعة للـ Dashboard
 //   const stats = useMemo(() => {
 //     const totalProducts = products.length;
 //     const totalQty = products.reduce(
 //       (sum, p) => sum + (Number(p.quantity) || 0),
 //       0
 //     );
 //     const stockValue = products.reduce(
 //       (sum, p) =>
 //         sum +
 //         (Number(p.price) || 0) * (Number(p.quantity) || 0),
 //       0
 //     );
 //     return {
 //       totalProducts,
 //       totalQty,
 //       stockValue,
 //     };
 //   }, [products]);
 //   // فلترة المنتجات
 //   const filteredProducts = useMemo(() => {
 //     let result = [...products];
 //     if (search.trim() !== "") {
 //       result = result.filter((p) =>
 //         p.name.toLowerCase().includes(search.toLowerCase())
 //       );
 //     }
 //     if (categoryFilter !== "all") {
 //       result = result.filter((p) => p.category === categoryFilter);
 //     }
 //     if (companyFilter !== "all") {
 //       result = result.filter((p) => p.company === companyFilter);
 //     }
 //     if (filterLowStock) {
 //       result = result.filter((p) => p.quantity <= p.minQty);
 //     }
 //     if (filterNearExpiry) {
 //       result = result.filter((p) => {
 //         if (!p.expiryDate) return false;
 //         const days =
 //           (new Date(p.expiryDate) - new Date()) /
 //           (1000 * 60 * 60 * 24);
 //         return days > 0 && days <= 30;
 //       });
 //     }
 //     if (filterExpired) {
 //       result = result.filter((p) => {
 //         if (!p.expiryDate) return false;
 //         const days =
 //           (new Date(p.expiryDate) - new Date()) /
 //           (1000 * 60 * 60 * 24);
 //         return days < 0;
 //       });
 //     }
 //     result.sort((a, b) => {
 //       if (sortByName === "asc") return a.name.localeCompare(b.name);
 //       return b.name.localeCompare(a.name);
 //     });
 //     return result;
 //   }, [
 //     search,
 //     categoryFilter,
 //     companyFilter,
 //     sortByName,
 //     filterLowStock,
 //     filterNearExpiry,
 //     filterExpired,
 //     products,
 //   ]);
 //   const openDetails = (p) => {
 //     setSelectedProduct(p);
 //     setShowDetails(true);
 //   };
 //   const deleteProduct = (id) => {
 //     const ok = confirm("هل أنت متأكد من حذف المنتج؟");
 //     if (!ok) return;
 //     setProducts((prev) => prev.filter((p) => p.id !== id));
 //   };
 //   const handleAddProduct = () => {
 //     if (!newProduct.name || !newProduct.price) {
 //       alert("الاسم والسعر مطلوبان على الأقل");
 //       return;
 //     }
 //     const id = Date.now();
 //     setProducts((prev) => [
 //       ...prev,
 //       {
 //         id,
 //         ...newProduct,
 //         purchasePrice: Number(newProduct.purchasePrice) || 0,
 //         price: Number(newProduct.price) || 0,
 //         quantity: Number(newProduct.quantity) || 0,
 //         minQty: Number(newProduct.minQty) || 0,
 //       },
 //     ]);
 //     setShowAddModal(false);
 //     setNewProduct({
 //       name: "",
 //       sku: "",
 //       category: "",
 //       company: "",
 //       purchasePrice: "",
 //       price: "",
 //       quantity: "",
 //       minQty: 5,
 //       expiryDate: "",
 //     });
 //   };
 //   const printProducts = () => {
 //     const w = window.open("", "", "width=900,height=700");
 //     w.document.write(`
 //       <html dir="rtl" lang="ar">
 //       <head>
 //         <title>تقرير المنتجات</title>
 //         <style>
 //           body { font-family:'Tajawal',sans-serif; padding:20px; }
 //           h2 { text-align:center; margin-bottom: 10px; }
 //           p.info { text-align:center; font-size: 12px; color:#64748b; margin:0; }
 //           table { width:100%; border-collapse:collapse; margin-top:20px; }
 //           th, td { border:1px solid #ddd; padding:6px; font-size:12px; text-align:right; }
 //           th { background:#f1f5f9; }
 //         </style>
 //       </head>
 //       <body>
 //         <h2>📄 تقرير المنتجات</h2>
 //         <p class="info">عدد المنتجات: ${products.length} | تم التوليد في: ${new Date().toLocaleString("ar-EG")}</p>
 //         <table>
 //           <thead>
 //             <tr>
 //               <th>الاسم</th>
 //               <th>الكود</th>
 //               <th>الفئة</th>
 //               <th>الشركة</th>
 //               <th>سعر الشراء</th>
 //               <th>سعر البيع</th>
 //               <th>الكمية</th>
 //               <th>ربح/وحدة</th>
 //               <th>إجمالي الربح</th>
 //               <th>الصلاحية</th>
 //             </tr>
 //           </thead>
 //           <tbody>
 //             ${products
 //               .map((p) => {
 //                 const unitProfit =
 //                   (p.price || 0) - (p.purchasePrice || 0);
 //                 const totalProfit = unitProfit * (p.quantity || 0);
 //                 return `
 //                   <tr>
 //                     <td>${p.name}</td>
 //                     <td>${p.sku || ""}</td>
 //                     <td>${p.category || ""}</td>
 //                     <td>${p.company || ""}</td>
 //                     <td>${p.purchasePrice || 0}</td>
 //                     <td>${p.price || 0}</td>
 //                     <td>${p.quantity || 0}</td>
 //                     <td>${unitProfit.toFixed(2)}</td>
 //                     <td>${totalProfit.toFixed(2)}</td>
 //                     <td>${p.expiryDate || ""}</td>
 //                   </tr>
 //                 `;
 //               })
 //               .join("")}
 //           </tbody>
 //         </table>
 //         <script>window.print()</script>
 //       </body>
 //       </html>
 //     `);
 //     w.document.close();
 //   };
 //   return (
 //     <Layout user={user} title="إدارة المنتجات">
 //       <div dir="rtl" className="space-y-6">
 //         {/* رأس الصفحة + الإحصائيات + الأزرار */}
 //         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
 //           <div className="space-y-1">
 //             <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
 //               💊 إدارة المنتجات
 //             </h1>
 //             <p className="text-sm text-slate-500">
 //               متابعة مخزون الأدوية، هوامش الربح، وتحذيرات الصلاحية من واجهة واحدة.
 //             </p>
 //           </div>
 //           <div className="flex flex-wrap gap-2">
 //             <button
 //               onClick={() => setShowAddModal(true)}
 //               className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm bg-emerald-600 hover:bg-emerald-700"
 //             >
 //               <span>➕</span>
 //               <span>إضافة منتج</span>
 //             </button>
 //             <button
 //               onClick={printProducts}
 //               className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
 //             >
 //               <span>🖨️</span>
 //               <span>طباعة تقرير</span>
 //             </button>
 //             {printInventoryReport && (
 //               <button
 //                 onClick={printInventoryReport}
 //                 className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-100 rounded-lg bg-indigo-50 hover:bg-indigo-100"
 //               >
 //                 <span>📥</span>
 //                 <span>تقرير الجرد (PDF)</span>
 //               </button>
 //             )}
 //           </div>
 //         </div>
 //         {/* كروت الإحصائيات */}
 //         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
 //           <StatCard
 //             label="إجمالي المنتجات"
 //             value={stats.totalProducts.toLocaleString("ar-EG")}
 //             icon="📦"
 //             color="bg-sky-50 text-sky-700 border-sky-100"
 //           />
 //           <StatCard
 //             label="إجمالي الكمية بالمخزون"
 //             value={stats.totalQty.toLocaleString("ar-EG")}
 //             icon="📊"
 //             color="bg-emerald-50 text-emerald-700 border-emerald-100"
 //           />
 //           <StatCard
 //             label="قيمة المخزون (تقريبية)"
 //             value={`${stats.stockValue.toFixed(2).toLocaleString("en-US")} ر.س`}
 //             icon="💰"
 //             color="bg-amber-50 text-amber-700 border-amber-100"
 //           />
 //         </div>
 //         {/* الفلاتر والبحث */}
 //         <div className="p-4 space-y-4 bg-white border shadow-sm rounded-2xl">
 //           <div className="relative">
 //             <span className="absolute text-slate-400 left-3 top-2.5">🔎</span>
 //             <input
 //               type="text"
 //               placeholder="ابحث عن منتج بالاسم، الكود، أو الشركة…"
 //               className="w-full p-3 pr-3 text-sm border rounded-xl pl-9 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500"
 //               value={search}
 //               onChange={(e) => setSearch(e.target.value)}
 //             />
 //           </div>
 //           <div className="flex flex-wrap items-center gap-3 text-sm">
 //             <div className="flex flex-wrap items-center gap-2">
 //               <span className="text-xs text-slate-500">الفئة:</span>
 //               <select
 //                 className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
 //                 value={categoryFilter}
 //                 onChange={(e) => setCategoryFilter(e.target.value)}
 //               >
 //                 {categories.map((cat) => (
 //                   <option key={cat} value={cat}>
 //                     {cat === "all" ? "كل الفئات" : cat}
 //                   </option>
 //                 ))}
 //               </select>
 //             </div>
 //             <div className="flex flex-wrap items-center gap-2">
 //               <span className="text-xs text-slate-500">الشركة:</span>
 //               <select
 //                 className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
 //                 value={companyFilter}
 //                 onChange={(e) => setCompanyFilter(e.target.value)}
 //               >
 //                 {companies.map((c) => (
 //                   <option key={c} value={c}>
 //                     {c === "all" ? "كل الشركات" : c}
 //                   </option>
 //                 ))}
 //               </select>
 //             </div>
 //             <div className="flex flex-wrap items-center gap-2">
 //               <span className="text-xs text-slate-500">ترتيب:</span>
 //               <select
 //                 className="p-2 text-xs border rounded-lg border-slate-200 bg-slate-50"
 //                 value={sortByName}
 //                 onChange={(e) => setSortByName(e.target.value)}
 //               >
 //                 <option value="asc">اسم المنتج (تصاعدي)</option>
 //                 <option value="desc">اسم المنتج (تنازلي)</option>
 //               </select>
 //             </div>
 //             {/* فلاتر حالة المخزون والصلاحية */}
 //             <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
 //               <FilterChip
 //                 active={filterLowStock}
 //                 onClick={() => setFilterLowStock(!filterLowStock)}
 //                 label="كمية منخفضة"
 //               />
 //               <FilterChip
 //                 active={filterNearExpiry}
 //                 onClick={() => setFilterNearExpiry(!filterNearExpiry)}
 //                 label="قرب انتهاء الصلاحية"
 //               />
 //               <FilterChip
 //                 active={filterExpired}
 //                 onClick={() => setFilterExpired(!filterExpired)}
 //                 label="منتهي الصلاحية"
 //               />
 //             </div>
 //           </div>
 //         </div>
 //         {/* جدول المنتجات */}
 //         <div className="overflow-x-auto bg-white border shadow-sm rounded-2xl">
 //           <table className="w-full text-sm text-right min-w-[980px]">
 //             <thead className="text-xs uppercase border-b bg-slate-50 text-slate-500">
 //               <tr>
 //                 <th className="p-3 font-medium">الاسم</th>
 //                 <th className="p-3 font-medium">الكود</th>
 //                 <th className="p-3 font-medium">الفئة</th>
 //                 <th className="p-3 font-medium">الشركة</th>
 //                 <th className="p-3 font-medium">سعر الشراء</th>
 //                 <th className="p-3 font-medium">سعر البيع</th>
 //                 <th className="p-3 font-medium">المخزون</th>
 //                 <th className="p-3 font-medium">ربح/وحدة</th>
 //                 <th className="p-3 font-medium">إجمالي الربح</th>
 //                 <th className="p-3 font-medium">الصلاحية</th>
 //                 <th className="p-3 font-medium text-center">تحذيرات</th>
 //                 <th className="p-3 font-medium text-center">إجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filteredProducts.map((p) => {
 //                 const warnings = getWarnings(p);
 //                 const unitProfit =
 //                   (p.price || 0) - (p.purchasePrice || 0);
 //                 const totalProfit = unitProfit * (p.quantity || 0);
 //                 let expiryText = p.expiryDate || "-";
 //                 if (warnings.includes("❌ المنتج منتهي الصلاحية!")) {
 //                   expiryText = "منتهي";
 //                 }
 //                 return (
 //                   <tr
 //                     key={p.id}
 //                     className="transition-colors border-t border-slate-100 even:bg-slate-50/40 hover:bg-slate-100/60"
 //                   >
 //                     <td className="p-3 font-medium text-slate-800">
 //                       {p.name}
 //                     </td>
 //                     <td className="p-3 text-slate-600">{p.sku}</td>
 //                     <td className="p-3 text-slate-600">{p.category}</td>
 //                     <td className="p-3 text-slate-600">{p.company}</td>
 //                     <td className="p-3 text-slate-700">
 //                       {p.purchasePrice || 0} ر.س
 //                     </td>
 //                     <td className="p-3 text-slate-700">
 //                       {p.price || 0} ر.س
 //                     </td>
 //                     <td
 //                       className={`p-3 ${
 //                         p.quantity <= p.minQty
 //                           ? "text-red-600 font-bold"
 //                           : "text-slate-800"
 //                       }`}
 //                     >
 //                       {p.quantity}
 //                     </td>
 //                     <td className="p-3 text-slate-700">
 //                       {unitProfit.toFixed(2)} ر.س
 //                     </td>
 //                     <td className="p-3 text-slate-700">
 //                       {totalProfit.toFixed(2)} ر.س
 //                     </td>
 //                     <td className="p-3 text-slate-700">{expiryText}</td>
 //                     <td className="p-3 text-center">
 //                       <WarningIndicator warnings={warnings} />
 //                     </td>
 //                     <td className="p-3 text-center">
 //                       <div className="flex flex-wrap justify-center gap-1">
 //                         <button
 //                           onClick={() => openDetails(p)}
 //                           className="px-3 py-1 text-xs font-medium text-indigo-700 rounded-lg bg-indigo-50 hover:bg-indigo-100"
 //                         >
 //                           🔍 عرض
 //                         </button>
 //                           <button
 //                             onClick={() =>
 //                               router.push(`/inventory?product=${p.id}`)
 //                             }
 //                             className="px-3 py-1 text-xs font-medium text-blue-700 rounded-lg bg-blue-50 hover:bg-blue-100"
 //                           >
 //                           📦 مخزون
 //                         </button>
 //                         <button
 //                           onClick={() =>
 //                             router.push(`/products/edit/${p.id}`)
 //                           }
 //                           className="px-3 py-1 text-xs font-medium rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100"
 //                         >
 //                           ✏️ تعديل
 //                         </button>
 //                         <button
 //                           onClick={() => deleteProduct(p.id)}
 //                           className="px-3 py-1 text-xs font-medium text-red-700 rounded-lg bg-red-50 hover:bg-red-100"
 //                         >
 //                           🗑️ حذف
 //                         </button>
 //                       </div>
 //                     </td>
 //                   </tr>
 //                 );
 //               })}
 //               {!filteredProducts.length && (
 //                 <tr>
 //                   <td colSpan={12} className="p-6 text-sm text-center text-slate-400">
 //                     لا توجد نتائج مطابقة للبحث / الفلاتر الحالية…
 //                   </td>
 //                 </tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* تفاصيل المنتج */}
 //         {showDetails && selectedProduct && (
 //           <Modal
 //             title="تفاصيل المنتج"
 //             onClose={() => setShowDetails(false)}
 //             onConfirm={() => setShowDetails(false)}
 //             confirmLabel="إغلاق"
 //           >
 //             <div className="space-y-2 text-sm" dir="rtl">
 //               <p><strong>الاسم:</strong> {selectedProduct.name}</p>
 //               <p><strong>الكود:</strong> {selectedProduct.sku}</p>
 //               <p><strong>الفئة:</strong> {selectedProduct.category}</p>
 //               <p><strong>الشركة:</strong> {selectedProduct.company}</p>
 //               <p><strong>سعر الشراء:</strong> {selectedProduct.purchasePrice || 0} ر.س</p>
 //               <p><strong>سعر البيع:</strong> {selectedProduct.price || 0} ر.س</p>
 //               <p><strong>الكمية:</strong> {selectedProduct.quantity}</p>
 //               <p><strong>الحد الأدنى:</strong> {selectedProduct.minQty}</p>
 //               <p><strong>تاريخ الانتهاء:</strong> {selectedProduct.expiryDate || "-"}</p>
 //               <div className="mt-3">
 //                 <strong>التحذيرات:</strong>
 //                 {getWarnings(selectedProduct).length ? (
 //                   <ul className="pr-4 mt-1 text-xs text-red-600 list-disc">
 //                     {getWarnings(selectedProduct).map((w, i) => (
 //                       <li key={i}>{w}</li>
 //                     ))}
 //                   </ul>
 //                 ) : (
 //                   <p className="mt-1 text-xs text-emerald-600">
 //                     لا توجد تحذيرات على هذا المنتج.
 //                   </p>
 //                 )}
 //               </div>
 //             </div>
 //           </Modal>
 //         )}
 //         {/* إضافة منتج */}
 //         {showAddModal && (
 //           <Modal
 //             title="إضافة منتج جديد"
 //             onClose={() => setShowAddModal(false)}
 //             onConfirm={handleAddProduct}
 //             confirmLabel="إضافة"
 //           >
 //             <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2" dir="rtl">
 //               <input
 //                 type="text"
 //                 className="w-full p-2 border rounded-lg border-slate-200"
 //                 placeholder="اسم المنتج *"
 //                 value={newProduct.name}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, name: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="text"
 //                 className="w-full p-2 border rounded-lg border-slate-200"
 //                 placeholder="الكود SKU"
 //                 value={newProduct.sku}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, sku: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="text"
 //                 className="w-full p-2 border rounded-lg border-slate-200"
 //                 placeholder="الفئة"
 //                 value={newProduct.category}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, category: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="text"
 //                 className="w-full p-2 border rounded-lg border-slate-200"
 //                 placeholder="الشركة"
 //                 value={newProduct.company}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, company: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded-lg border-slate-200"
 //                 placeholder="سعر الشراء"
 //                 value={newProduct.purchasePrice}
 //                 onChange={(e) =>
 //                   setNewProduct({
 //                     ...newProduct,
 //                     purchasePrice: e.target.value,
 //                   })
 //                 }
 //               />
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded-lg border-slate-200"
 //                 placeholder="سعر البيع *"
 //                 value={newProduct.price}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, price: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded-lg border-slate-200"
 //                 placeholder="الكمية"
 //                 value={newProduct.quantity}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, quantity: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded-lg border-slate-200"
 //                 placeholder="الحد الأدنى للتنبيه"
 //                 value={newProduct.minQty}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, minQty: e.target.value })
 //                 }
 //               />
 //               <div className="md:col-span-2">
 //                 <input
 //                   type="date"
 //                   className="w-full p-2 border rounded-lg border-slate-200"
 //                   value={newProduct.expiryDate}
 //                   onChange={(e) =>
 //                     setNewProduct({ ...newProduct, expiryDate: e.target.value })
 //                   }
 //                 />
 //               </div>
 //             </div>
 //             <p className="mt-2 text-xs text-slate-400" dir="rtl">
 //               الحقول المعلمة بـ * مطلوبة. يمكن تعديل باقي التفاصيل لاحقًا من شاشة تعديل المنتج.
 //             </p>
 //           </Modal>
 //         )}
 //       </div>
 //     </Layout>
 //   );
 // }
 // // بطاقة إحصائية بسيطة
 // function StatCard({ label, value, icon, color }) {
 //   return (
 //     <div className={`flex items-center justify-between p-4 border rounded-2xl ${color}`}>
 //       <div className="space-y-1">
 //         <p className="text-xs font-medium text-slate-500">{label}</p>
 //         <p className="text-lg font-bold">{value}</p>
 //       </div>
 //       <div className="flex items-center justify-center w-10 h-10 text-lg rounded-full bg-white/70">
 //         {icon}
 //       </div>
 //     </div>
 //   );
 // }
 // // فلتر كـ "Chip" احترافي
 // function FilterChip({ active, onClick, label }) {
 //   return (
 //     <button
 //       type="button"
 //       onClick={onClick}
 //       className={`px-3 py-1 text-xs rounded-full border transition ${
 //         active
 //           ? "bg-emerald-50 text-emerald-700 border-emerald-200"
 //           : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
 //       }`}
 //     >
 //       {label}
 //     </button>
 //   );
 // }
 // // pages/products.js
 // import { useState, useMemo } from "react";
 // import { useRouter } from "next/router";
 // import Layout from "../components/Layout";
 // import { useAuth } from "../context/AuthContext";
 // import { useInventory } from "../context/InventoryContext";
 // import WarningIndicator from "../components/WarningIndicator";
 // import Modal from "../components/Modal";
 // export default function ProductsPage() {
 //   const router = useRouter();
 //   const { user, hasPermission } = useAuth();
 //   const {
 //     products,
 //     setProducts,
 //     getWarnings,
 //     printInventoryReport,
 //   } = useInventory();
 //   // بحث وفلترة وترتيب
 //   const [search, setSearch] = useState("");
 //   const [categoryFilter, setCategoryFilter] = useState("all");
 //   const [companyFilter, setCompanyFilter] = useState("all");
 //   const [sortByName, setSortByName] = useState("asc");
 //   const [filterLowStock, setFilterLowStock] = useState(false);
 //   const [filterNearExpiry, setFilterNearExpiry] = useState(false);
 //   const [filterExpired, setFilterExpired] = useState(false);
 //   // عرض تفاصيل
 //   const [showDetails, setShowDetails] = useState(false);
 //   const [selectedProduct, setSelectedProduct] = useState(null);
 //   // إضافة منتج
 //   const [showAddModal, setShowAddModal] = useState(false);
 //   const [newProduct, setNewProduct] = useState({
 //     name: "",
 //     sku: "",
 //     category: "",
 //     company: "",
 //     purchasePrice: "",
 //     price: "",
 //     quantity: "",
 //     minQty: 5,
 //     expiryDate: "",
 //   });
 //   if (!hasPermission(["admin", "pharmacist"])) {
 //     return (
 //       <div dir="rtl" className="p-6 text-center text-red-600">
 //         ⚠️ لا يمكنك دخول هذه الصفحة.
 //       </div>
 //     );
 //   }
 //   const categories = [
 //     "all",
 //     ...new Set(products.map((p) => p.category).filter(Boolean)),
 //   ];
 //   const companies = [
 //     "all",
 //     ...new Set(products.map((p) => p.company).filter(Boolean)),
 //   ];
 //   const filteredProducts = useMemo(() => {
 //     let result = [...products];
 //     if (search.trim() !== "") {
 //       result = result.filter((p) =>
 //         p.name.toLowerCase().includes(search.toLowerCase())
 //       );
 //     }
 //     if (categoryFilter !== "all") {
 //       result = result.filter((p) => p.category === categoryFilter);
 //     }
 //     if (companyFilter !== "all") {
 //       result = result.filter((p) => p.company === companyFilter);
 //     }
 //     if (filterLowStock) {
 //       result = result.filter((p) => p.quantity <= p.minQty);
 //     }
 //     if (filterNearExpiry) {
 //       result = result.filter((p) => {
 //         if (!p.expiryDate) return false;
 //         const days =
 //           (new Date(p.expiryDate) - new Date()) /
 //           (1000 * 60 * 60 * 24);
 //         return days > 0 && days <= 30;
 //       });
 //     }
 //     if (filterExpired) {
 //       result = result.filter((p) => {
 //         if (!p.expiryDate) return false;
 //         const days =
 //           (new Date(p.expiryDate) - new Date()) /
 //           (1000 * 60 * 60 * 24);
 //         return days < 0;
 //       });
 //     }
 //     result.sort((a, b) => {
 //       if (sortByName === "asc") return a.name.localeCompare(b.name);
 //       return b.name.localeCompare(a.name);
 //     });
 //     return result;
 //   }, [
 //     search,
 //     categoryFilter,
 //     companyFilter,
 //     sortByName,
 //     filterLowStock,
 //     filterNearExpiry,
 //     filterExpired,
 //     products,
 //   ]);
 //   const openDetails = (p) => {
 //     setSelectedProduct(p);
 //     setShowDetails(true);
 //   };
 //   const deleteProduct = (id) => {
 //     const ok = confirm("هل أنت متأكد من حذف المنتج؟");
 //     if (!ok) return;
 //     setProducts((prev) => prev.filter((p) => p.id !== id));
 //   };
 //   const handleAddProduct = () => {
 //     if (!newProduct.name || !newProduct.price) {
 //       alert("الاسم والسعر مطلوبان على الأقل");
 //       return;
 //     }
 //     const id = Date.now();
 //     setProducts((prev) => [
 //       ...prev,
 //       {
 //         id,
 //         ...newProduct,
 //         purchasePrice: Number(newProduct.purchasePrice) || 0,
 //         price: Number(newProduct.price) || 0,
 //         quantity: Number(newProduct.quantity) || 0,
 //         minQty: Number(newProduct.minQty) || 0,
 //       },
 //     ]);
 //     setShowAddModal(false);
 //     setNewProduct({
 //       name: "",
 //       sku: "",
 //       category: "",
 //       company: "",
 //       purchasePrice: "",
 //       price: "",
 //       quantity: "",
 //       minQty: 5,
 //       expiryDate: "",
 //     });
 //   };
 //   const printProducts = () => {
 //     const w = window.open("", "", "width=900,height=700");
 //     w.document.write(`
 //       <html dir="rtl" lang="ar">
 //       <head>
 //         <title>تقرير المنتجات</title>
 //         <style>
 //           body { font-family:'Tajawal',sans-serif; padding:20px; }
 //           h2 { text-align:center; }
 //           table { width:100%; border-collapse:collapse; margin-top:20px; }
 //           th, td { border:1px solid #ddd; padding:6px; font-size:12px; text-align:right; }
 //           th { background:#f1f5f9; }
 //         </style>
 //       </head>
 //       <body>
 //         <h2>📄 تقرير المنتجات</h2>
 //         <table>
 //           <thead>
 //             <tr>
 //               <th>الاسم</th>
 //               <th>الكود</th>
 //               <th>الفئة</th>
 //               <th>الشركة</th>
 //               <th>سعر الشراء</th>
 //               <th>سعر البيع</th>
 //               <th>الكمية</th>
 //               <th>ربح/وحدة</th>
 //               <th>إجمالي الربح</th>
 //               <th>الصلاحية</th>
 //             </tr>
 //           </thead>
 //           <tbody>
 //             ${products
 //               .map((p) => {
 //                 const unitProfit =
 //                   (p.price || 0) - (p.purchasePrice || 0);
 //                 const totalProfit = unitProfit * (p.quantity || 0);
 //                 return `
 //                   <tr>
 //                     <td>${p.name}</td>
 //                     <td>${p.sku}</td>
 //                     <td>${p.category}</td>
 //                     <td>${p.company}</td>
 //                     <td>${p.purchasePrice || 0}</td>
 //                     <td>${p.price || 0}</td>
 //                     <td>${p.quantity || 0}</td>
 //                     <td>${unitProfit.toFixed(2)}</td>
 //                     <td>${totalProfit.toFixed(2)}</td>
 //                     <td>${p.expiryDate || ""}</td>
 //                   </tr>
 //                 `;
 //               })
 //               .join("")}
 //           </tbody>
 //         </table>
 //         <script>window.print()</script>
 //       </body>
 //       </html>
 //     `);
 //     w.document.close();
 //   };
 //   return (
 //     <Layout user={user} title="إدارة المنتجات">
 //       <div dir="rtl" className="space-y-6">
 //         {/* العنوان + الأزرار */}
 //         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
 //           <h1 className="text-xl font-bold text-gray-800">💊 إدارة المنتجات</h1>
 //           <div className="flex flex-wrap gap-2">
 //             <button
 //               onClick={() => setShowAddModal(true)}
 //               className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
 //             >
 //               ➕ إضافة منتج
 //             </button>
 //             <button
 //               onClick={printProducts}
 //               className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
 //             >
 //               🖨️ طباعة المنتجات
 //             </button>
 //           </div>
 //         </div>
 //         {/* الفلاتر والبحث */}
 //         <div className="p-4 space-y-4 bg-white border shadow rounded-xl">
 //           <input
 //             type="text"
 //             placeholder="ابحث عن منتج…"
 //             className="w-full p-3 text-sm border rounded-lg"
 //             value={search}
 //             onChange={(e) => setSearch(e.target.value)}
 //           />
 //           <div className="flex flex-wrap items-center gap-3 text-sm">
 //             <select
 //               className="p-2 border rounded-lg"
 //               value={categoryFilter}
 //               onChange={(e) => setCategoryFilter(e.target.value)}
 //             >
 //               {categories.map((cat) => (
 //                 <option key={cat} value={cat}>
 //                   {cat === "all" ? "كل الفئات" : cat}
 //                 </option>
 //               ))}
 //             </select>
 //             <select
 //               className="p-2 border rounded-lg"
 //               value={companyFilter}
 //               onChange={(e) => setCompanyFilter(e.target.value)}
 //             >
 //               {companies.map((c) => (
 //                 <option key={c} value={c}>
 //                   {c === "all" ? "كل الشركات" : c}
 //                 </option>
 //               ))}
 //             </select>
 //             <select
 //               className="p-2 border rounded-lg"
 //               value={sortByName}
 //               onChange={(e) => setSortByName(e.target.value)}
 //             >
 //               <option value="asc">اسم المنتج (تصاعدي)</option>
 //               <option value="desc">اسم المنتج (تنازلي)</option>
 //             </select>
 //             <label className="flex items-center gap-1">
 //               <input
 //                 type="checkbox"
 //                 checked={filterLowStock}
 //                 onChange={() => setFilterLowStock(!filterLowStock)}
 //               />
 //               <span>كمية منخفضة</span>
 //             </label>
 //             <label className="flex items-center gap-1">
 //               <input
 //                 type="checkbox"
 //                 checked={filterNearExpiry}
 //                 onChange={() => setFilterNearExpiry(!filterNearExpiry)}
 //               />
 //               <span>قرب انتهاء الصلاحية</span>
 //             </label>
 //             <label className="flex items-center gap-1">
 //               <input
 //                 type="checkbox"
 //                 checked={filterExpired}
 //                 onChange={() => setFilterExpired(!filterExpired)}
 //               />
 //               <span>منتهي الصلاحية</span>
 //             </label>
 //           </div>
 //         </div>
 //         {/* جدول المنتجات */}
 //         <div className="overflow-x-auto bg-white border shadow rounded-xl">
 //           <table className="w-full text-sm text-right min-w-[900px]">
 //             <thead className="bg-gray-50">
 //               <tr>
 //                 <th className="p-3">الاسم</th>
 //                 <th className="p-3">الكود</th>
 //                 <th className="p-3">الفئة</th>
 //                 <th className="p-3">الشركة</th>
 //                 <th className="p-3">سعر الشراء</th>
 //                 <th className="p-3">سعر البيع</th>
 //                 <th className="p-3">المخزون</th>
 //                 <th className="p-3">ربح/وحدة</th>
 //                 <th className="p-3">إجمالي الربح</th>
 //                 <th className="p-3">الصلاحية</th>
 //                 <th className="p-3 text-center">تحذيرات</th>
 //                 <th className="p-3 text-center">إجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filteredProducts.map((p) => {
 //                 const warnings = getWarnings(p);
 //                 const unitProfit =
 //                   (p.price || 0) - (p.purchasePrice || 0);
 //                 const totalProfit = unitProfit * (p.quantity || 0);
 //                 let expiryText = p.expiryDate || "-";
 //                 if (
 //                   warnings.includes("❌ المنتج منتهي الصلاحية!")
 //                 ) {
 //                   expiryText = "منتهي";
 //                 }
 //                 return (
 //                   <tr key={p.id} className="border-t hover:bg-gray-50">
 //                     <td className="p-3">{p.name}</td>
 //                     <td className="p-3">{p.sku}</td>
 //                     <td className="p-3">{p.category}</td>
 //                     <td className="p-3">{p.company}</td>
 //                     <td className="p-3">{p.purchasePrice || 0} ر.س</td>
 //                     <td className="p-3">{p.price || 0} ر.س</td>
 //                     <td
 //                       className={`p-3 ${
 //                         p.quantity <= p.minQty
 //                           ? "text-red-600 font-bold"
 //                           : ""
 //                       }`}
 //                     >
 //                       {p.quantity}
 //                     </td>
 //                     <td className="p-3">
 //                       {unitProfit.toFixed(2)} ر.س
 //                     </td>
 //                     <td className="p-3">
 //                       {totalProfit.toFixed(2)} ر.س
 //                     </td>
 //                     <td className="p-3">{expiryText}</td>
 //                     <td className="p-3 text-center">
 //                       <WarningIndicator warnings={warnings} />
 //                     </td>
 //                     <td className="p-3 text-center">
 //                       <div className="flex justify-center gap-2">
 //                         <button
 //                           onClick={() => openDetails(p)}
 //                           className="px-3 py-1 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
 //                         >
 //                           🔍 عرض
 //                         </button>
 //                         <button
 //                           onClick={() =>
 //                             router.push(`/inventory?product=${p.id}`)
 //                           }
 //                           className="px-3 py-1 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700"
 //                         >
 //                           📦 مخزون
 //                         </button>
 //                         <button
 //                           onClick={() =>
 //                             router.push(`/products/edit/${p.id}`)
 //                           }
 //                           className="px-3 py-1 text-xs text-white rounded-lg bg-amber-600 hover:bg-amber-700"
 //                         >
 //                           ✏️ تعديل
 //                         </button>
 //                         <button
 //                           onClick={() => deleteProduct(p.id)}
 //                           className="px-3 py-1 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700"
 //                         >
 //                           🗑️ حذف
 //                         </button>
 //                       </div>
 //                     </td>
 //                   </tr>
 //                 );
 //               })}
 //               {!filteredProducts.length && (
 //                 <tr>
 //                   <td colSpan={12} className="p-4 text-center text-gray-400">
 //                     لا توجد نتائج مطابقة…
 //                   </td>
 //                 </tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* تفاصيل المنتج */}
 //         {showDetails && selectedProduct && (
 //           <Modal
 //             title="تفاصيل المنتج"
 //             onClose={() => setShowDetails(false)}
 //             onConfirm={() => setShowDetails(false)}
 //             confirmLabel="إغلاق"
 //           >
 //             <div className="space-y-2 text-sm" dir="rtl">
 //               <p><strong>الاسم:</strong> {selectedProduct.name}</p>
 //               <p><strong>الكود:</strong> {selectedProduct.sku}</p>
 //               <p><strong>الفئة:</strong> {selectedProduct.category}</p>
 //               <p><strong>الشركة:</strong> {selectedProduct.company}</p>
 //               <p><strong>سعر الشراء:</strong> {selectedProduct.purchasePrice || 0} ر.س</p>
 //               <p><strong>سعر البيع:</strong> {selectedProduct.price || 0} ر.س</p>
 //               <p><strong>الكمية:</strong> {selectedProduct.quantity}</p>
 //               <p><strong>الحد الأدنى:</strong> {selectedProduct.minQty}</p>
 //               <p><strong>تاريخ الانتهاء:</strong> {selectedProduct.expiryDate}</p>
 //               <div className="mt-3">
 //                 <strong>التحذيرات:</strong>
 //                 {getWarnings(selectedProduct).length ? (
 //                   <ul className="pr-4 mt-1 text-xs text-red-600 list-disc">
 //                     {getWarnings(selectedProduct).map((w, i) => (
 //                       <li key={i}>{w}</li>
 //                     ))}
 //                   </ul>
 //                 ) : (
 //                   <p className="mt-1 text-xs text-green-600">
 //                     لا توجد تحذيرات.
 //                   </p>
 //                 )}
 //               </div>
 //             </div>
 //           </Modal>
 //         )}
 //         {/* إضافة منتج */}
 //         {showAddModal && (
 //           <Modal
 //             title="إضافة منتج جديد"
 //             onClose={() => setShowAddModal(false)}
 //             onConfirm={handleAddProduct}
 //             confirmLabel="إضافة"
 //           >
 //             <div className="space-y-3 text-sm" dir="rtl">
 //               <input
 //                 type="text"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="اسم المنتج"
 //                 value={newProduct.name}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, name: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="text"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="الكود SKU"
 //                 value={newProduct.sku}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, sku: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="text"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="الفئة"
 //                 value={newProduct.category}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, category: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="text"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="الشركة"
 //                 value={newProduct.company}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, company: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="سعر الشراء"
 //                 value={newProduct.purchasePrice}
 //                 onChange={(e) =>
 //                   setNewProduct({
 //                     ...newProduct,
 //                     purchasePrice: e.target.value,
 //                   })
 //                 }
 //               />
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="سعر البيع"
 //                 value={newProduct.price}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, price: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="الكمية"
 //                 value={newProduct.quantity}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, quantity: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="number"
 //                 className="w-full p-2 border rounded"
 //                 placeholder="الحد الأدنى"
 //                 value={newProduct.minQty}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, minQty: e.target.value })
 //                 }
 //               />
 //               <input
 //                 type="date"
 //                 className="w-full p-2 border rounded"
 //                 value={newProduct.expiryDate}
 //                 onChange={(e) =>
 //                   setNewProduct({ ...newProduct, expiryDate: e.target.value })
 //                 }
 //               />
 //             </div>
 //           </Modal>
 //         )}
 //       </div>
 //     </Layout>
 //   );
 // }
_c2 = FilterChip;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ProductsPage");
__turbopack_context__.k.register(_c1, "StatCard");
__turbopack_context__.k.register(_c2, "FilterChip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/products.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/products";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/products.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/products\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/products.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__df56fb08._.js.map