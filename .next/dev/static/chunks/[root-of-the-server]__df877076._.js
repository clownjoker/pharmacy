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
"[project]/pages/cashier.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/cashier.js
__turbopack_context__.s([
    "default",
    ()=>Cashier
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Layout.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function Cashier() {
    _s();
    const [user] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "محمد الكاشير",
        role: "cashier"
    });
    // قائمة منتجات وهمية
    const PRODUCTS = [
        {
            id: 1,
            name: "بانادول",
            price: 12
        },
        {
            id: 2,
            name: "فيتامين سي",
            price: 25
        },
        {
            id: 3,
            name: "كحولة طبية",
            price: 10
        },
        {
            id: 4,
            name: "مسكن ألترا",
            price: 18
        }
    ];
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [cart, setCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [discount, setDiscount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [tax, setTax] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [invoices, setInvoices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]); // فواتير وهمية
    // البحث
    const filteredProducts = PRODUCTS.filter((p)=>p.name.toLowerCase().includes(search.toLowerCase()));
    // إضافة منتج للفاتورة
    const addToCart = (p)=>{
        const exists = cart.find((c)=>c.id === p.id);
        if (exists) {
            setCart(cart.map((c)=>c.id === p.id ? {
                    ...c,
                    qty: c.qty + 1
                } : c));
        } else {
            setCart([
                ...cart,
                {
                    ...p,
                    qty: 1
                }
            ]);
        }
    };
    // إزالة من السلة
    const removeItem = (id)=>{
        setCart(cart.filter((c)=>c.id !== id));
    };
    // حساب الإجمالي
    const subtotal = cart.reduce((sum, it)=>sum + it.price * it.qty, 0);
    const total = subtotal - discount + tax;
    // حفظ الفاتورة
    const saveInvoice = ()=>{
        if (cart.length === 0) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("لم يتم اختيار أي منتج");
        const invoice = {
            id: Date.now(),
            items: cart,
            subtotal,
            discount,
            tax,
            total,
            cashier: user.name,
            date: new Date().toISOString()
        };
        setInvoices([
            ...invoices,
            invoice
        ]);
        setCart([]);
        setDiscount(0);
        setTax(0);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].success("تم حفظ الفاتورة بنجاح (وهمية)");
    };
    // الطباعة
    const printInvoice = (inv)=>{
        const html = `
      <html dir="rtl">
      <body>
        <h2>فاتورة رقم ${inv.id}</h2>
        <p>الكاشير: ${inv.cashier}</p>

        <table border="1" width="100%" style="border-collapse: collapse">
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items.map((it)=>`<tr>
                     <td>${it.name}</td>
                     <td>${it.qty}</td>
                     <td>${it.price}</td>
                     <td>${it.qty * it.price}</td>
                   </tr>`).join("")}
          </tbody>
        </table>

        <h3>الإجمالي: ${inv.total} ر.س</h3>

        <script>
          window.onload = () => window.print()
        </script>
      </body>
      </html>
    `;
        const win = window.open("", "_blank", "width=600,height=800");
        win.document.write(html);
        win.document.close();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        user: user,
        title: "نظام الكاشير",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                dir: "rtl",
                className: "grid grid-cols-1 gap-6 md:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-5 bg-white border rounded-lg shadow-sm md:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "mb-4 text-lg font-bold",
                                children: "🧾 السلة"
                            }, void 0, false, {
                                fileName: "[project]/pages/cashier.js",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            cart.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500",
                                children: "لا يوجد منتجات مضافة"
                            }, void 0, false, {
                                fileName: "[project]/pages/cashier.js",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "text-gray-600 bg-gray-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "p-2",
                                                    children: "الصنف"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 135,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "الكمية"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 136,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "السعر"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 137,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "الإجمالي"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 138,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {}, void 0, false, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 139,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/cashier.js",
                                            lineNumber: 134,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: cart.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "border-t",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-2",
                                                        children: it.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/cashier.js",
                                                        lineNumber: 145,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: it.qty
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/cashier.js",
                                                        lineNumber: 146,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: [
                                                            it.price,
                                                            " ر.س"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/cashier.js",
                                                        lineNumber: 147,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: [
                                                            it.qty * it.price,
                                                            " ر.س"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/cashier.js",
                                                        lineNumber: 148,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "text-xs text-red-500",
                                                            onClick: ()=>removeItem(it.id),
                                                            children: "حذف"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/cashier.js",
                                                            lineNumber: 150,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/cashier.js",
                                                        lineNumber: 149,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, it.id, true, {
                                                fileName: "[project]/pages/cashier.js",
                                                lineNumber: 144,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/cashier.js",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 space-y-2 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "المجموع: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    subtotal,
                                                    " ر.س"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/cashier.js",
                                                lineNumber: 165,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: "خصم"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 167,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        className: "w-full p-1 border rounded",
                                        value: discount,
                                        onChange: (e)=>setDiscount(Number(e.target.value))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 168,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: "ضريبة"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 175,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        className: "w-full p-1 border rounded",
                                        value: tax,
                                        onChange: (e)=>setTax(Number(e.target.value))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 176,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-lg font-bold",
                                        children: [
                                            "الإجمالي النهائي: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-emerald-600",
                                                children: [
                                                    total,
                                                    " ر.س"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/cashier.js",
                                                lineNumber: 184,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 183,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "w-full py-2 mt-3 text-white rounded bg-emerald-600",
                                        onClick: saveInvoice,
                                        children: "💾 حفظ الفاتورة"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/cashier.js",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/cashier.js",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-5 bg-white border rounded-lg shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold",
                                children: "🔍 البحث عن منتج"
                            }, void 0, false, {
                                fileName: "[project]/pages/cashier.js",
                                lineNumber: 198,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "اسم المنتج...",
                                value: search,
                                onChange: (e)=>setSearch(e.target.value),
                                className: "w-full p-2 mt-2 border rounded"
                            }, void 0, false, {
                                fileName: "[project]/pages/cashier.js",
                                lineNumber: 199,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 space-y-2 max-h-[300px] overflow-y-auto",
                                children: filteredProducts.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "w-full p-2 text-right border rounded hover:bg-gray-50",
                                        onClick: ()=>addToCart(p),
                                        children: [
                                            p.name,
                                            " — ",
                                            p.price,
                                            " ر.س"
                                        ]
                                    }, p.id, true, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 209,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/cashier.js",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/cashier.js",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/cashier.js",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-5 mt-8 bg-white border rounded-lg shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-4 text-lg font-bold",
                        children: "🕒 آخر الفواتير"
                    }, void 0, false, {
                        fileName: "[project]/pages/cashier.js",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    invoices.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500",
                        children: "لا توجد فواتير"
                    }, void 0, false, {
                        fileName: "[project]/pages/cashier.js",
                        lineNumber: 226,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "bg-gray-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-2",
                                            children: "رقم"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/cashier.js",
                                            lineNumber: 231,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "التاريخ"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/cashier.js",
                                            lineNumber: 232,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "الإجمالي"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/cashier.js",
                                            lineNumber: 233,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "إجراءات"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/cashier.js",
                                            lineNumber: 234,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/cashier.js",
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/cashier.js",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: invoices.map((inv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "border-t",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "p-2",
                                                children: inv.id
                                            }, void 0, false, {
                                                fileName: "[project]/pages/cashier.js",
                                                lineNumber: 240,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: new Date(inv.date).toLocaleString("ar-EG")
                                            }, void 0, false, {
                                                fileName: "[project]/pages/cashier.js",
                                                lineNumber: 241,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: [
                                                    inv.total,
                                                    " ر.س"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/cashier.js",
                                                lineNumber: 242,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "text-xs text-sky-600",
                                                    onClick: ()=>printInvoice(inv),
                                                    children: "طباعة"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/cashier.js",
                                                    lineNumber: 244,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/cashier.js",
                                                lineNumber: 243,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, inv.id, true, {
                                        fileName: "[project]/pages/cashier.js",
                                        lineNumber: 239,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/cashier.js",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/cashier.js",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/cashier.js",
                lineNumber: 222,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/cashier.js",
        lineNumber: 122,
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
_s(Cashier, "x0Q0O1l0cQjUHCWBQReODJxTfkM=");
_c = Cashier;
var _c;
__turbopack_context__.k.register(_c, "Cashier");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/cashier.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/cashier";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/cashier.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/cashier\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/cashier.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__df877076._.js.map