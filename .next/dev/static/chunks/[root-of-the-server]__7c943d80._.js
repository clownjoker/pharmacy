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
;
var _s = __turbopack_context__.k.signature();
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
                                        lineNumber: 51,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-lg font-bold text-gray-800",
                                                children: "نظام الصيدلية الذكي"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Layout.js",
                                                lineNumber: 58,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                        lineNumber: 65,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/Layout.js",
                                lineNumber: 63,
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
                                                lineNumber: 92,
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
                                                lineNumber: 95,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Layout.js",
                                        lineNumber: 90,
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
                                                lineNumber: 108,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "flex-1 w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8",
                    children: [
                        title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
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
"[project]/pages/dashboard.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/dashboard.js
__turbopack_context__.s([
    "default",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Layout.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/theme.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/LineChart.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Line.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
function Dashboard() {
    _s();
    const [user] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "المدير أحمد",
        role: "admin"
    });
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [salesData, setSalesData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            setUsers([
                {
                    id: 1,
                    name: "محمد الصيدلي",
                    role: "pharmacist"
                },
                {
                    id: 2,
                    name: "أحمد الكاشير",
                    role: "cashier"
                },
                {
                    id: 3,
                    name: "مها الإدارية",
                    role: "admin"
                }
            ]);
            setSalesData([
                {
                    month: "يناير",
                    total: 3200
                },
                {
                    month: "فبراير",
                    total: 4100
                },
                {
                    month: "مارس",
                    total: 3800
                },
                {
                    month: "أبريل",
                    total: 5200
                },
                {
                    month: "مايو",
                    total: 6100
                },
                {
                    month: "يونيو",
                    total: 5700
                }
            ]);
        }
    }["Dashboard.useEffect"], []);
    const totalSales = salesData.reduce((s, m)=>s + m.total, 0);
    // روابط الوصول السريع — محسّنة بصرياً
    const quickLinks = [
        {
            title: "المنتجات",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaPills"], {}, void 0, false, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 55,
                columnNumber: 13
            }, this),
            path: "/products",
            color: "from-green-500 to-emerald-600"
        },
        {
            title: "المبيعات",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCashRegister"], {}, void 0, false, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 61,
                columnNumber: 13
            }, this),
            path: "/sales",
            color: "from-sky-500 to-blue-600"
        },
        {
            title: "التقارير",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaChartLine"], {}, void 0, false, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 67,
                columnNumber: 13
            }, this),
            path: "/reports",
            color: "from-purple-500 to-indigo-600"
        },
        {
            title: "الحسابات",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaMoneyBillWave"], {}, void 0, false, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 73,
                columnNumber: 13
            }, this),
            path: "/accounts",
            color: "from-amber-500 to-yellow-600"
        },
        {
            title: "المستخدمون",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaUsers"], {}, void 0, false, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 79,
                columnNumber: 13
            }, this),
            path: "/users",
            color: "from-teal-500 to-cyan-600"
        },
        {
            title: "الشفت",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaClock"], {}, void 0, false, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 85,
                columnNumber: 13
            }, this),
            path: "/shift",
            color: "from-pink-500 to-rose-600"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        user: user,
        title: "لوحة التحكم",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            dir: "rtl",
            className: "space-y-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "mb-4 text-2xl font-bold text-gray-800",
                            children: "الوصول السريع"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard.js",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
                            children: quickLinks.map((link, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push(link.path),
                                    className: `
                  relative flex flex-col items-center justify-center p-5 
                  rounded-2xl shadow-md bg-gradient-to-br ${link.color}
                  text-white transition-all duration-200 
                  hover:scale-[1.05] hover:shadow-xl
                `,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 transition bg-black/10 rounded-2xl group-hover:bg-black/20"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 111,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative mb-2 text-4xl",
                                            children: link.icon
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 112,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "relative text-sm font-semibold",
                                            children: link.title
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 113,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/pages/dashboard.js",
                                    lineNumber: 101,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard.js",
                            lineNumber: 99,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/dashboard.js",
                    lineNumber: 96,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                            title: "إجمالي المبيعات",
                            value: `${totalSales.toLocaleString()} ر.س`,
                            color: "text-sky-600"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard.js",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                            title: "عدد الفواتير",
                            value: "248",
                            color: "text-blue-600"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard.js",
                            lineNumber: 126,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                            title: "عدد الأدوية",
                            value: "126",
                            color: "text-green-600"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard.js",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                            title: "عدد المستخدمين",
                            value: users.length,
                            color: "text-amber-600"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard.js",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/dashboard.js",
                    lineNumber: 120,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-5 bg-white border shadow-lg rounded-xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "mb-3 text-lg font-bold text-gray-800",
                            children: "المبيعات الشهرية"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard.js",
                            lineNumber: 137,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                            width: "100%",
                            height: 260,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__["LineChart"], {
                                data: salesData,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                        strokeDasharray: "4 4",
                                        stroke: "#e5e7eb"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard.js",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                        dataKey: "month",
                                        stroke: "#6b7280"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard.js",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                        stroke: "#6b7280"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard.js",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                        fileName: "[project]/pages/dashboard.js",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Line"], {
                                        type: "monotone",
                                        dataKey: "total",
                                        stroke: __TURBOPACK__imported__module__$5b$project$5d2f$theme$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].colors.primary,
                                        strokeWidth: 3,
                                        dot: {
                                            r: 5
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard.js",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard.js",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard.js",
                            lineNumber: 141,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/dashboard.js",
                    lineNumber: 136,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-5 bg-white border shadow-lg rounded-xl lg:col-span-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "mb-4 text-lg font-bold text-gray-800",
                                    children: "آخر العمليات"
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard.js",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-3 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActivityCard, {
                                            icon: "💰",
                                            text: "تم إنشاء فاتورة بقيمة 245 ر.س بواسطة أحمد."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 164,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActivityCard, {
                                            icon: "📦",
                                            text: "تم تحديث مخزون دواء “فيتامين سي”."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 168,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActivityCard, {
                                            icon: "📊",
                                            text: "تم عرض تقرير المبيعات اليومية."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 172,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard.js",
                                    lineNumber: 163,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/dashboard.js",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-5 border border-green-300 shadow-lg rounded-xl bg-gradient-to-br from-green-50 to-green-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "mb-3 text-lg font-bold text-green-800",
                                    children: "📈 تحليل الأداء"
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard.js",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm leading-relaxed text-green-700",
                                    children: [
                                        "أداء المبيعات ارتفع بنسبة ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "+12%"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 183,
                                            columnNumber: 41
                                        }, this),
                                        " الأسبوع الماضي، مع زيادة في عدد الطلبات ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "+8%"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 184,
                                            columnNumber: 39
                                        }, this),
                                        ". استمر بتحسين العروض والسرعة لزيادة الأرباح."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard.js",
                                    lineNumber: 182,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/dashboard.js",
                            lineNumber: 180,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/dashboard.js",
                    lineNumber: 159,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/dashboard.js",
            lineNumber: 93,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/dashboard.js",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_s(Dashboard, "qJ6pwOCGWbsL8xhFZkdxBwchy9k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Dashboard;
// 🟡 بطاقة الملخص
function SummaryCard({ title, value, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-5 transition bg-white border shadow-md rounded-xl hover:shadow-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500",
                children: title
            }, void 0, false, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: `mt-1 text-2xl font-bold ${color}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 200,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/dashboard.js",
        lineNumber: 198,
        columnNumber: 5
    }, this);
}
_c1 = SummaryCard;
// 🟣 بطاقة عملية
function ActivityCard({ icon, text }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "flex items-center gap-3 p-3 transition border rounded-lg bg-gray-50 hover:bg-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xl",
                children: icon
            }, void 0, false, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 209,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: text
            }, void 0, false, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 210,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/dashboard.js",
        lineNumber: 208,
        columnNumber: 5
    }, this);
} // import { useState, useEffect } from 'react'
 // import { useRouter } from 'next/router'
 // import Layout from '../components/Layout'
 // import theme from '../theme'
 // import {
 //   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
 // } from 'recharts'
 // export default function Dashboard() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [users, setUsers] = useState([])
 //   const [salesData, setSalesData] = useState([])
 //   const router = useRouter()
 // //   useEffect(() => {
 // //   const token = localStorage.getItem("pharmacy_token")
 // //   if (!token) {
 // //     router.replace("/")   // redirect to login
 // //   }
 // // }, [])
 //   useEffect(() => {
 //     setUsers([
 //       { id: 1, name: 'محمد الصيدلي', role: 'pharmacist', email: 'pharma@mail.com' },
 //       { id: 2, name: 'أحمد الكاشير', role: 'cashier', email: 'cashier@mail.com' },
 //       { id: 3, name: 'مها الإدارية', role: 'admin', email: 'admin@mail.com' }
 //     ])
 //     setSalesData([
 //       { month: 'يناير', total: 3200 },
 //       { month: 'فبراير', total: 4100 },
 //       { month: 'مارس', total: 3800 },
 //       { month: 'أبريل', total: 5200 },
 //       { month: 'مايو', total: 6100 },
 //       { month: 'يونيو', total: 5700 }
 //     ])
 //   }, [])
 //   const totalSales = salesData.reduce((s, m) => s + m.total, 0)
 //   // روابط الوصول السريع (بدون react-icons)
 //   const quickLinks = [
 //     { title: 'المنتجات', icon: '💊', bg: 'from-green-500/70 to-emerald-600/70', path: '/products' },
 //     { title: 'المبيعات', icon: '🧾', bg: 'from-sky-500/70 to-blue-600/70', path: '/sales' },
 //     { title: 'المخزن', icon: '🏬', bg: 'from-orange-500/70 to-amber-600/70', path: '/inventory' },
 //     { title: 'التقارير', icon: '📈', bg: 'from-purple-500/70 to-indigo-600/70', path: '/reports' },
 //     { title: 'الحسابات', icon: '💵', bg: 'from-amber-500/70 to-yellow-600/70', path: '/accounts' },
 //     { title: 'المستخدمون', icon: '👥', bg: 'from-teal-500/70 to-cyan-600/70', path: '/users' }
 //   ]
 //   return (
 //     <Layout user={user} title="لوحة التحكم الرئيسية">
 //       <div dir="rtl" className="space-y-10">
 //         {/* الوصول السريع */}
 //         <section>
 //           <h2 className="mb-5 text-xl font-semibold text-gray-800">الوصول السريع</h2>
 //           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
 //             {quickLinks.map((link, i) => (
 //               <button
 //                 key={i}
 //                 onClick={() => router.push(link.path)}
 //                 className={`
 //                   group relative flex flex-col items-center justify-center
 //                   py-4 px-3 rounded-xl text-white shadow-md hover:shadow-xl hover:scale-[1.03]
 //                   transition-all duration-200 bg-gradient-to-br ${link.bg}
 //                 `}
 //               >
 //                 <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-25 rounded-xl"></div>
 //                 <div className="relative z-10 text-3xl mb-1.5">{link.icon}</div>
 //                 <h3 className="relative z-10 text-sm font-semibold tracking-wide">{link.title}</h3>
 //               </button>
 //             ))}
 //           </div>
 //         </section>
 //         {/* بطاقات الملخص */}
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
 //           <SummaryCard title="إجمالي المبيعات" value={`${totalSales.toLocaleString()} ر.س`} color="text-sky-600" />
 //           <SummaryCard title="عدد الفواتير" value="248" color="text-blue-600" />
 //           <SummaryCard title="عدد الأدوية" value="126" color="text-green-600" />
 //           <SummaryCard title="عدد المستخدمين" value={users.length} color="text-amber-600" />
 //         </div>
 //         {/* الرسم البياني للمبيعات */}
 //         <div className="p-5 bg-white border rounded-lg shadow-sm">
 //           <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات الشهرية</h3>
 //           <ResponsiveContainer width="100%" height={250}>
 //             <LineChart data={salesData}>
 //               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //               <XAxis dataKey="month" />
 //               <YAxis />
 //               <Tooltip />
 //               <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
 //             </LineChart>
 //           </ResponsiveContainer>
 //         </div>
 //         {/* آخر العمليات + ملاحظة تحليلية */}
 //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
 //           <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
 //             <h3 className="mb-4 text-lg font-semibold text-gray-700">آخر العمليات</h3>
 //             <ul className="space-y-2 text-sm text-gray-700">
 //               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
 //                 💰 تم إنشاء فاتورة بقيمة <span className="font-semibold text-green-700">245 ر.س</span> بواسطة <span className="text-blue-600">أحمد</span>.
 //               </li>
 //               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
 //                 📦 تم تحديث مخزون دواء <span className="font-semibold text-emerald-700">“فيتامين سي”</span>.
 //               </li>
 //               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
 //                 📊 تم عرض تقرير <span className="font-semibold text-purple-600">المبيعات اليومية</span>.
 //               </li>
 //             </ul>
 //           </div>
 //           <div className="p-5 border border-green-200 rounded-lg shadow-sm bg-gradient-to-br from-green-50 to-green-100">
 //             <h3 className="mb-3 text-lg font-semibold text-green-700">📈 ملاحظة تحليلية</h3>
 //             <p className="text-sm leading-relaxed text-green-800">
 //               أداء المبيعات في آخر أسبوع ارتفع بنسبة <strong>+12%</strong> مقارنة بالفترة السابقة،
 //               مع زيادة في عدد الطلبات بمعدل <strong>8%</strong>.
 //             </p>
 //           </div>
 //         </div>
 //       </div>
 //     </Layout>
 //   )
 // }
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-5 text-center transition bg-white border rounded-lg shadow-sm hover:shadow-md">
 //       <p className="text-sm text-gray-500">{title}</p>
 //       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
 // import { useState, useEffect } from 'react'
 // import { useRouter } from 'next/router'
 // import Layout from '../components/Layout'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // import {
 //   LineChart,
 //   Line,
 //   XAxis,
 //   YAxis,
 //   CartesianGrid,
 //   Tooltip,
 //   ResponsiveContainer
 // } from 'recharts'
 // import {
 //   FaPills,
 //   FaCashRegister,
 //   FaChartLine,
 //   FaMoneyBillWave,
 //   FaUsers
 // } from 'react-icons/fa'
 // export default function Dashboard() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [users, setUsers] = useState([])
 //   const [salesData, setSalesData] = useState([])
 //   const router = useRouter()
 //   useEffect(() => {
 //     setUsers([
 //       { id: 1, name: 'محمد الصيدلي', role: 'pharmacist', email: 'pharma@mail.com' },
 //       { id: 2, name: 'أحمد الكاشير', role: 'cashier', email: 'cashier@mail.com' },
 //       { id: 3, name: 'مها الإدارية', role: 'admin', email: 'admin@mail.com' }
 //     ])
 //     setSalesData([
 //       { month: 'يناير', total: 3200 },
 //       { month: 'فبراير', total: 4100 },
 //       { month: 'مارس', total: 3800 },
 //       { month: 'أبريل', total: 5200 },
 //       { month: 'مايو', total: 6100 },
 //       { month: 'يونيو', total: 5700 }
 //     ])
 //   }, [])
 //   const totalSales = salesData.reduce((s, m) => s + m.total, 0)
 //   // 🔹 روابط الوصول السريع
 //   const quickLinks = [
 //     { title: 'المنتجات', icon: <FaPills />, bg: 'bg-gradient-to-br from-green-500 to-emerald-600', path: '/products' },
 //     { title: 'المبيعات', icon: <FaCashRegister />, bg: 'bg-gradient-to-br from-sky-500 to-blue-600', path: '/sales' },
 //     { title: 'التقارير', icon: <FaChartLine />, bg: 'bg-gradient-to-br from-purple-500 to-indigo-600', path: '/reports' },
 //     { title: 'الحسابات', icon: <FaMoneyBillWave />, bg: 'bg-gradient-to-br from-amber-500 to-yellow-600', path: '/accounts' },
 //     { title: 'إدارة المستخدمين', icon: <FaUsers />, bg: 'bg-gradient-to-br from-teal-500 to-cyan-600', path: '/users' }
 //   ]
 //   return (
 //     <Layout user={user} title="لوحة التحكم الرئيسية">
 //       <div dir="rtl" className="space-y-10">
 //         {/* 🔹 الوصول السريع */}
 //         <section>
 //           <h2 className="mb-5 text-xl font-semibold text-gray-800">الوصول السريع</h2>
 //           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
 //             {quickLinks.map((link, i) => (
 //               <button
 //                 key={i}
 //                 onClick={() => router.push(link.path)}
 //                 className={`
 //                   group relative flex flex-col items-center justify-center 
 //                   p-6 rounded-2xl text-white shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-200
 //                   ${link.bg}
 //                 `}
 //               >
 //                 <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 rounded-2xl"></div>
 //                 <div className="relative z-10 mb-3 text-4xl">{link.icon}</div>
 //                 <h3 className="relative z-10 text-lg font-bold tracking-wide">{link.title}</h3>
 //               </button>
 //             ))}
 //           </div>
 //         </section>
 //         {/* 🧾 بطاقات الملخص */}
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
 //           <SummaryCard title="إجمالي المبيعات" value={`${totalSales.toLocaleString()} ر.س`} color="text-sky-600" />
 //           <SummaryCard title="عدد الفواتير" value="248" color="text-blue-600" />
 //           <SummaryCard title="عدد الأدوية" value="126" color="text-green-600" />
 //           <SummaryCard title="عدد المستخدمين" value={users.length} color="text-amber-600" />
 //         </div>
 //         {/* 📈 الرسم البياني للمبيعات */}
 //         <div className="p-5 bg-white border rounded-lg shadow-sm">
 //           <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات الشهرية</h3>
 //           <ResponsiveContainer width="100%" height={250}>
 //             <LineChart data={salesData}>
 //               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //               <XAxis dataKey="month" />
 //               <YAxis />
 //               <Tooltip />
 //               <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
 //             </LineChart>
 //           </ResponsiveContainer>
 //         </div>
 //         {/* 🧾 آخر العمليات */}
 //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
 //           {/* قائمة العمليات */}
 //           <div className="p-5 bg-white border rounded-lg shadow-sm lg:col-span-2">
 //             <h3 className="mb-4 text-lg font-semibold text-gray-700">آخر العمليات</h3>
 //             <ul className="space-y-2 text-sm text-gray-700">
 //               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
 //                 💰 تم إنشاء فاتورة جديدة بقيمة <span className="font-semibold text-green-700">245 ر.س</span> بواسطة <span className="text-blue-600">أحمد</span>.
 //               </li>
 //               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
 //                 📦 تم تحديث مخزون دواء <span className="font-semibold text-emerald-700">“فيتامين سي”</span>.
 //               </li>
 //               <li className="p-3 transition border border-gray-100 rounded-lg hover:bg-gray-50">
 //                 📊 تم عرض تقرير <span className="font-semibold text-purple-600">المبيعات اليومية</span>.
 //               </li>
 //             </ul>
 //           </div>
 //           {/* تنبيه تحليلي */}
 //           <div className="p-5 border border-green-200 rounded-lg shadow-sm bg-gradient-to-br from-green-50 to-green-100">
 //             <h3 className="mb-3 text-lg font-semibold text-green-700">📈 ملاحظة تحليلية</h3>
 //             <p className="text-sm leading-relaxed text-green-800">
 //               أداء المبيعات في آخر أسبوع ارتفع بنسبة <strong>+12%</strong> مقارنة بالفترة السابقة،
 //               مع زيادة في عدد الطلبات بمعدل <strong>8%</strong>.
 //               حافظ على هذا الأداء لتعزيز الأرباح الشهرية.
 //             </p>
 //           </div>
 //         </div>
 //       </div>
 //     </Layout>
 //   )
 // }
 // // 🧩 بطاقة الملخص
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-5 text-center transition bg-white border rounded-lg shadow-sm hover:shadow-md">
 //       <p className="text-sm text-gray-500">{title}</p>
 //       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
 // import { useState, useEffect } from 'react'
 // import Layout from '../components/Layout'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // import {
 //   LineChart,
 //   Line,
 //   XAxis,
 //   YAxis,
 //   CartesianGrid,
 //   Tooltip,
 //   PieChart,
 //   Pie,
 //   Cell,
 //   ResponsiveContainer
 // } from 'recharts'
 // export default function Dashboard() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [users, setUsers] = useState([])
 //   const [salesData, setSalesData] = useState([])
 //   const [showAddModal, setShowAddModal] = useState(false)
 //   const [showEditModal, setShowEditModal] = useState(false)
 //   const [showPermModal, setShowPermModal] = useState(false)
 //   const [newUser, setNewUser] = useState({ name: '', role: '', email: '', permissions: [] })
 //   const [editUser, setEditUser] = useState(null)
 //   const [permUser, setPermUser] = useState(null)
 //   // 🔹 قائمة الصلاحيات
 //   const allPermissions = [
 //     { key: 'view_sales', label: 'عرض المبيعات' },
 //     { key: 'add_sale', label: 'إضافة عملية بيع' },
 //     { key: 'manage_medicines', label: 'إدارة الأدوية' },
 //     { key: 'manage_users', label: 'إدارة المستخدمين' },
 //     { key: 'view_reports', label: 'عرض التقارير' },
 //     { key: 'print_reports', label: 'طباعة التقارير' },
 //   ]
 //   // 🔹 بيانات مبدئية
 //   useEffect(() => {
 //     setUsers([
 //       { id: 1, name: 'محمد الصيدلي', role: 'pharmacist', email: 'pharma@mail.com', permissions: ['manage_medicines', 'view_reports'] },
 //       { id: 2, name: 'أحمد الكاشير', role: 'cashier', email: 'cashier@mail.com', permissions: ['add_sale', 'view_sales', 'print_reports'] },
 //       { id: 3, name: 'مها الإدارية', role: 'admin', email: 'admin@mail.com', permissions: ['manage_users', 'view_reports', 'print_reports'] },
 //     ])
 //     setSalesData([
 //       { month: 'يناير', total: 3200 },
 //       { month: 'فبراير', total: 4100 },
 //       { month: 'مارس', total: 3800 },
 //       { month: 'أبريل', total: 5200 },
 //       { month: 'مايو', total: 6100 },
 //       { month: 'يونيو', total: 5700 },
 //     ])
 //   }, [])
 //   const totalSales = salesData.reduce((s, m) => s + m.total, 0)
 //   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']
 //   // 🟢 إضافة مستخدم
 //   const addUser = () => {
 //     if (!newUser.name || !newUser.role || !newUser.email) {
 //       toast.error('⚠️ يرجى إدخال جميع الحقول')
 //       return
 //     }
 //     setUsers([...users, { id: Date.now(), ...newUser }])
 //     setNewUser({ name: '', role: '', email: '', permissions: [] })
 //     setShowAddModal(false)
 //     toast.success('✅ تم إضافة المستخدم بنجاح')
 //   }
 //   // ✏️ تعديل مستخدم
 //   const openEditModal = (u) => {
 //     setEditUser({ ...u })
 //     setShowEditModal(true)
 //   }
 //   const saveEditUser = () => {
 //     if (!editUser.name || !editUser.role || !editUser.email) return toast.error('⚠️ يرجى إدخال جميع الحقول')
 //     setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)))
 //     setShowEditModal(false)
 //     toast.success('✅ تم تعديل المستخدم بنجاح')
 //   }
 //   // 🔐 صلاحيات المستخدم
 //   const openPermModal = (u) => {
 //     setPermUser({ ...u })
 //     setShowPermModal(true)
 //   }
 //   const togglePermission = (permKey) => {
 //     const perms = permUser.permissions.includes(permKey)
 //       ? permUser.permissions.filter((p) => p !== permKey)
 //       : [...permUser.permissions, permKey]
 //     setPermUser({ ...permUser, permissions: perms })
 //   }
 //   const savePermissions = () => {
 //     setUsers(users.map((u) => (u.id === permUser.id ? permUser : u)))
 //     setShowPermModal(false)
 //     toast.success('🔐 تم تحديث صلاحيات المستخدم')
 //   }
 //   // ❌ حذف مستخدم
 //   const deleteUser = (id) => {
 //     if (confirm('هل تريد حذف هذا المستخدم؟')) {
 //       setUsers(users.filter((u) => u.id !== id))
 //       toast.success('🗑️ تم حذف المستخدم بنجاح')
 //     }
 //   }
 //   return (
 //     <Layout user={user} title="لوحة المدير">
 //       <div dir="rtl" className="space-y-8">
 //         {/* 🧾 الملخص */}
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
 //           <SummaryCard title="إجمالي المبيعات" value={`${totalSales.toLocaleString()} ر.س`} color="text-sky-600" />
 //           <SummaryCard title="عدد الفواتير" value="248" color="text-blue-600" />
 //           <SummaryCard title="عدد الأدوية" value="126" color="text-green-600" />
 //           <SummaryCard title="عدد المستخدمين" value={users.length} color="text-amber-600" />
 //         </div>
 //         {/* 👥 إدارة المستخدمين */}
 //         <div className="p-5 bg-white border rounded-lg shadow-sm">
 //           <div className="flex items-center justify-between mb-4">
 //             <h3 className="text-lg font-semibold text-gray-700">إدارة المستخدمين والصلاحيات</h3>
 //             <button onClick={() => setShowAddModal(true)} className="px-4 py-2 text-white rounded-md shadow bg-sky-600 hover:bg-sky-700">
 //               ➕ مستخدم جديد
 //             </button>
 //           </div>
 //           <table className="w-full text-sm text-right border-t border-gray-100">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">الاسم</th>
 //                 <th className="px-3 py-2">البريد</th>
 //                 <th className="px-3 py-2">الدور</th>
 //                 <th className="px-3 py-2">الصلاحيات</th>
 //                 <th className="px-3 py-2">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {users.map((u) => (
 //                 <tr key={u.id} className="border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2">{u.name}</td>
 //                   <td className="px-3 py-2">{u.email}</td>
 //                   <td className="px-3 py-2">{u.role === 'admin' ? '👑 مدير' : u.role === 'pharmacist' ? '💊 صيدلي' : '💵 كاشير'}</td>
 //                   <td className="px-3 py-2">
 //                     {u.permissions.map((p) => (
 //                       <span key={p} className="inline-block px-2 py-0.5 m-0.5 bg-sky-50 text-sky-700 rounded">
 //                         {allPermissions.find((x) => x.key === p)?.label || p}
 //                       </span>
 //                     ))}
 //                   </td>
 //                   <td className="px-3 py-2 space-x-2 space-x-reverse">
 //                     <button onClick={() => openEditModal(u)} className="px-3 py-1 text-sm text-blue-600 border border-blue-100 rounded hover:bg-blue-50">
 //                       تعديل
 //                     </button>
 //                     <button onClick={() => openPermModal(u)} className="px-3 py-1 text-sm text-indigo-600 border border-indigo-100 rounded hover:bg-indigo-50">
 //                       صلاحيات
 //                     </button>
 //                     <button onClick={() => deleteUser(u.id)} className="px-3 py-1 text-sm text-red-600 border border-red-100 rounded hover:bg-red-50">
 //                       حذف
 //                     </button>
 //                   </td>
 //                 </tr>
 //               ))}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* 🟢 مودالات */}
 //         {showAddModal && (
 //           <UserModal title="➕ إضافة مستخدم جديد" userData={newUser} setUserData={setNewUser} onSave={addUser} onCancel={() => setShowAddModal(false)} />
 //         )}
 //         {showEditModal && (
 //           <UserModal title="✏️ تعديل المستخدم" userData={editUser} setUserData={setEditUser} onSave={saveEditUser} onCancel={() => setShowEditModal(false)} />
 //         )}
 //         {showPermModal && (
 //           <PermissionsModal
 //             user={permUser}
 //             permissions={allPermissions}
 //             togglePermission={togglePermission}
 //             onSave={savePermissions}
 //             onCancel={() => setShowPermModal(false)}
 //           />
 //         )}
 //       </div>
 //     </Layout>
 //   )
 // }
 // // 🧩 بطاقات الملخص
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
 //       <p className="text-sm text-gray-500">{title}</p>
 //       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
 // // 🧩 نافذة المستخدم (إضافة / تعديل)
 // function UserModal({ title, userData, setUserData, onSave, onCancel }) {
 //   return (
 //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
 //       <div className="w-full max-w-md p-6 text-right bg-white rounded-lg shadow-lg">
 //         <h3 className="mb-4 text-lg font-semibold text-gray-700">{title}</h3>
 //         <label className="block mb-1 text-sm">الاسم</label>
 //         <input value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} className="w-full px-3 py-2 mb-3 border rounded-md" />
 //         <label className="block mb-1 text-sm">البريد الإلكتروني</label>
 //         <input value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} className="w-full px-3 py-2 mb-3 border rounded-md" />
 //         <label className="block mb-1 text-sm">الدور</label>
 //         <select value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })} className="w-full px-3 py-2 mb-4 border rounded-md">
 //           <option value="">اختر الدور...</option>
 //           <option value="admin">👑 مدير</option>
 //           <option value="pharmacist">💊 صيدلي</option>
 //           <option value="cashier">💵 كاشير</option>
 //         </select>
 //         <div className="flex justify-end gap-3">
 //           <button onClick={onSave} className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">حفظ</button>
 //           <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
 //         </div>
 //       </div>
 //     </div>
 //   )
 // }
 // // 🟣 نافذة الصلاحيات
 // function PermissionsModal({ user, permissions, togglePermission, onSave, onCancel }) {
 //   return (
 //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
 //       <div className="w-full max-w-lg p-6 text-right bg-white rounded-lg shadow-lg">
 //         <h3 className="mb-4 text-lg font-semibold text-gray-700">🔐 تعديل صلاحيات {user.name}</h3>
 //         <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
 //           {permissions.map((p) => (
 //             <label key={p.key} className="flex items-center gap-2">
 //               <input type="checkbox" checked={user.permissions.includes(p.key)} onChange={() => togglePermission(p.key)} />
 //               {p.label}
 //             </label>
 //           ))}
 //         </div>
 //         <div className="flex justify-end gap-3">
 //           <button onClick={onSave} className="px-4 py-2 text-white rounded-md bg-sky-600 hover:bg-sky-700">حفظ</button>
 //           <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
 //         </div>
 //       </div>
 //     </div>
 //   )
 // }
 // import { useState, useEffect } from 'react'
 // import Layout from '../components/Layout'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // import {
 //   LineChart,
 //   Line,
 //   XAxis,
 //   YAxis,
 //   CartesianGrid,
 //   Tooltip,
 //   PieChart,
 //   Pie,
 //   Cell,
 //   ResponsiveContainer
 // } from 'recharts'
 // export default function Dashboard() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [users, setUsers] = useState([])
 //   const [salesData, setSalesData] = useState([])
 //   const [showAddModal, setShowAddModal] = useState(false)
 //   const [showEditModal, setShowEditModal] = useState(false)
 //   const [newUser, setNewUser] = useState({ name: '', role: '', email: '' })
 //   const [editUser, setEditUser] = useState(null)
 //   // 🔹 تحميل بيانات افتراضية
 //   useEffect(() => {
 //     setUsers([
 //       { id: 1, name: 'محمد الصيدلي', role: 'pharmacist', email: 'pharma@mail.com' },
 //       { id: 2, name: 'أحمد الكاشير', role: 'cashier', email: 'cashier@mail.com' },
 //       { id: 3, name: 'مها الإدارية', role: 'admin', email: 'admin@mail.com' },
 //     ])
 //     setSalesData([
 //       { month: 'يناير', total: 3200 },
 //       { month: 'فبراير', total: 4100 },
 //       { month: 'مارس', total: 3800 },
 //       { month: 'أبريل', total: 5200 },
 //       { month: 'مايو', total: 6100 },
 //       { month: 'يونيو', total: 5700 },
 //     ])
 //   }, [])
 //   const totalSales = salesData.reduce((s, m) => s + m.total, 0)
 //   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']
 //   // 🟢 إضافة مستخدم جديد
 //   const addUser = () => {
 //     if (!newUser.name || !newUser.role || !newUser.email) {
 //       toast.error('⚠️ يرجى إدخال جميع الحقول')
 //       return
 //     }
 //     setUsers([...users, { id: Date.now(), ...newUser }])
 //     setNewUser({ name: '', role: '', email: '' })
 //     setShowAddModal(false)
 //     toast.success('✅ تم إضافة المستخدم بنجاح')
 //   }
 //   // 🟡 فتح نافذة تعديل المستخدم
 //   const openEditModal = (user) => {
 //     setEditUser({ ...user })
 //     setShowEditModal(true)
 //   }
 //   // 🟣 حفظ التعديل
 //   const saveEditUser = () => {
 //     if (!editUser.name || !editUser.role || !editUser.email) {
 //       toast.error('⚠️ يرجى إدخال جميع الحقول')
 //       return
 //     }
 //     setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)))
 //     setShowEditModal(false)
 //     toast.success('✅ تم تعديل المستخدم بنجاح')
 //   }
 //   // 🔴 حذف مستخدم
 //   const deleteUser = (id) => {
 //     if (confirm('هل تريد حذف هذا المستخدم؟')) {
 //       setUsers(users.filter((u) => u.id !== id))
 //       toast.success('🗑️ تم حذف المستخدم بنجاح')
 //     }
 //   }
 //   return (
 //     <Layout user={user} title="لوحة المدير">
 //       <div dir="rtl" className="space-y-8">
 //         {/* 🧾 ملخص النظام */}
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
 //           <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
 //             <p className="text-sm text-gray-500">إجمالي المبيعات</p>
 //             <h3 className="text-2xl font-bold text-sky-600">{totalSales.toLocaleString()} ر.س</h3>
 //           </div>
 //           <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
 //             <p className="text-sm text-gray-500">عدد الفواتير</p>
 //             <h3 className="text-2xl font-bold text-blue-600">248</h3>
 //           </div>
 //           <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
 //             <p className="text-sm text-gray-500">عدد الأدوية</p>
 //             <h3 className="text-2xl font-bold text-green-600">126</h3>
 //           </div>
 //           <div className="p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md">
 //             <p className="text-sm text-gray-500">عدد المستخدمين</p>
 //             <h3 className="text-2xl font-bold text-amber-600">{users.length}</h3>
 //           </div>
 //         </div>
 //         {/* 📈 الرسوم التحليلية */}
 //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
 //           <div className="p-5 bg-white border rounded-lg shadow-sm">
 //             <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات الشهرية</h3>
 //             <ResponsiveContainer width="100%" height={250}>
 //               <LineChart data={salesData}>
 //                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //                 <XAxis dataKey="month" />
 //                 <YAxis />
 //                 <Tooltip />
 //                 <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
 //               </LineChart>
 //             </ResponsiveContainer>
 //           </div>
 //           <div className="p-5 bg-white border rounded-lg shadow-sm">
 //             <h3 className="mb-3 text-lg font-semibold text-gray-700">توزيع المستخدمين حسب الدور</h3>
 //             <ResponsiveContainer width="100%" height={250}>
 //               <PieChart>
 //                 <Pie
 //                   data={[
 //                     { name: 'مديرين', value: users.filter(u => u.role === 'admin').length },
 //                     { name: 'صيدليين', value: users.filter(u => u.role === 'pharmacist').length },
 //                     { name: 'كاشير', value: users.filter(u => u.role === 'cashier').length },
 //                   ]}
 //                   cx="50%"
 //                   cy="50%"
 //                   outerRadius={80}
 //                   label
 //                   dataKey="value"
 //                 >
 //                   {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
 //                 </Pie>
 //                 <Tooltip />
 //               </PieChart>
 //             </ResponsiveContainer>
 //           </div>
 //         </div>
 //         {/* 👥 إدارة المستخدمين */}
 //         <div className="p-5 bg-white border rounded-lg shadow-sm">
 //           <div className="flex items-center justify-between mb-4">
 //             <h3 className="text-lg font-semibold text-gray-700">إدارة المستخدمين</h3>
 //             <button
 //               onClick={() => setShowAddModal(true)}
 //               className="px-4 py-2 text-white rounded-md shadow bg-sky-600 hover:bg-sky-700"
 //             >
 //               ➕ مستخدم جديد
 //             </button>
 //           </div>
 //           <table className="w-full text-sm text-right border-t border-gray-100">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">الاسم</th>
 //                 <th className="px-3 py-2">البريد</th>
 //                 <th className="px-3 py-2">الدور</th>
 //                 <th className="px-3 py-2">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {users.map((u) => (
 //                 <tr key={u.id} className="border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2">{u.name}</td>
 //                   <td className="px-3 py-2">{u.email}</td>
 //                   <td className="px-3 py-2">
 //                     {u.role === 'admin' ? '👑 مدير' : u.role === 'pharmacist' ? '💊 صيدلي' : '💵 كاشير'}
 //                   </td>
 //                   <td className="px-3 py-2 space-x-2 space-x-reverse">
 //                     <button
 //                       onClick={() => openEditModal(u)}
 //                       className="px-3 py-1 text-sm text-blue-600 border border-blue-100 rounded hover:bg-blue-50"
 //                     >
 //                       تعديل
 //                     </button>
 //                     <button
 //                       onClick={() => deleteUser(u.id)}
 //                       className="px-3 py-1 text-sm text-red-600 border border-red-100 rounded hover:bg-red-50"
 //                     >
 //                       حذف
 //                     </button>
 //                   </td>
 //                 </tr>
 //               ))}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* 🟢 مودال إضافة مستخدم */}
 //         {showAddModal && (
 //           <ModalForm
 //             title="➕ إضافة مستخدم جديد"
 //             userData={newUser}
 //             setUserData={setNewUser}
 //             onSave={addUser}
 //             onCancel={() => setShowAddModal(false)}
 //           />
 //         )}
 //         {/* 🟣 مودال تعديل مستخدم */}
 //         {showEditModal && (
 //           <ModalForm
 //             title="✏️ تعديل المستخدم"
 //             userData={editUser}
 //             setUserData={setEditUser}
 //             onSave={saveEditUser}
 //             onCancel={() => setShowEditModal(false)}
 //           />
 //         )}
 //       </div>
 //     </Layout>
 //   )
 // }
 // // 🧩 مكون المودال القابل لإعادة الاستخدام
 // function ModalForm({ title, userData, setUserData, onSave, onCancel }) {
 //   return (
 //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
 //       <div className="w-full max-w-md p-6 text-right bg-white rounded-lg shadow-lg">
 //         <h3 className="mb-4 text-lg font-semibold text-gray-700">{title}</h3>
 //         <label className="block mb-1 text-sm">الاسم</label>
 //         <input
 //           value={userData.name}
 //           onChange={(e) => setUserData({ ...userData, name: e.target.value })}
 //           className="w-full px-3 py-2 mb-3 border rounded-md"
 //         />
 //         <label className="block mb-1 text-sm">البريد الإلكتروني</label>
 //         <input
 //           value={userData.email}
 //           onChange={(e) => setUserData({ ...userData, email: e.target.value })}
 //           className="w-full px-3 py-2 mb-3 border rounded-md"
 //         />
 //         <label className="block mb-1 text-sm">الدور</label>
 //         <select
 //           value={userData.role}
 //           onChange={(e) => setUserData({ ...userData, role: e.target.value })}
 //           className="w-full px-3 py-2 mb-4 border rounded-md"
 //         >
 //           <option value="">اختر الدور...</option>
 //           <option value="admin">👑 مدير</option>
 //           <option value="pharmacist">💊 صيدلي</option>
 //           <option value="cashier">💵 كاشير</option>
 //         </select>
 //         <div className="flex justify-end gap-3">
 //           <button
 //             onClick={onSave}
 //             className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
 //           >
 //             حفظ
 //           </button>
 //           <button
 //             onClick={onCancel}
 //             className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
 //           >
 //             إلغاء
 //           </button>
 //         </div>
 //       </div>
 //     </div>
 //   )
 // }
_c2 = ActivityCard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Dashboard");
__turbopack_context__.k.register(_c1, "SummaryCard");
__turbopack_context__.k.register(_c2, "ActivityCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/dashboard.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/dashboard";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/dashboard.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/dashboard\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/dashboard.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__7c943d80._.js.map