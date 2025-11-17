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
;
var _s = __turbopack_context__.k.signature();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-lg font-bold text-gray-800",
                                            children: "نظام الصيدلية الذكي"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Layout.js",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 -mt-0.5",
                                            children: "Pharmacy Management System"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Layout.js",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Layout.js",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Layout.js",
                            lineNumber: 48,
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
                                    lineNumber: 63,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/Layout.js",
                            lineNumber: 61,
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
                                            lineNumber: 90,
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
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Layout.js",
                                    lineNumber: 88,
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
                                            lineNumber: 106,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "تسجيل الخروج"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Layout.js",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Layout.js",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Layout.js",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Layout.js",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Layout.js",
                lineNumber: 43,
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
                        lineNumber: 115,
                        columnNumber: 11
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/components/Layout.js",
                lineNumber: 113,
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
                lineNumber: 122,
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
                lineNumber: 126,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Layout.js",
        lineNumber: 42,
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
_s(InventoryProvider, "y7iUO8FXDvPmOcBiW2djTwKwTYo=");
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
"[project]/context/ShiftContext.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// context/ShiftContext.js
__turbopack_context__.s([
    "ShiftProvider",
    ()=>ShiftProvider,
    "useShift",
    ()=>useShift
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const ShiftContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const STORAGE_KEY = "pharmacy_shifts_v1";
function loadInitialShifts() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch  {
        return [];
    }
}
function ShiftProvider({ children }) {
    _s();
    const [shifts, setShifts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // تحميل من localStorage عند أول تشغيل على المتصفح
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShiftProvider.useEffect": ()=>{
            const data = loadInitialShifts();
            setShifts(data);
        }
    }["ShiftProvider.useEffect"], []);
    // حفظ في localStorage عند التغيير
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShiftProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(shifts));
            } catch  {
            // تجاهل أي خطأ تخزين
            }
        }
    }["ShiftProvider.useEffect"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShiftContext.Provider, {
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
_s(ShiftProvider, "okRaxGhXPQUoOgI22W2sJKxfyt0=");
_c = ShiftProvider;
function useShift() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(ShiftContext);
    if (!ctx) {
        throw new Error("useShift must be used within a ShiftProvider");
    }
    return ctx;
}
_s1(useShift, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "ShiftProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/reports.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/reports.js
__turbopack_context__.s([
    "default",
    ()=>Reports
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Layout.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$InventoryContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/InventoryContext.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ShiftContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/ShiftContext.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/LineChart.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Line.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
// استخدام SafeDate مع dynamic لمنع مشاكل الـ Hydration
const SafeDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/components/SafeDate.js [client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/components/SafeDate.js [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = SafeDate;
function Reports() {
    _s();
    const [user] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "أحمد",
        role: "admin"
    });
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("overview");
    const { products } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$InventoryContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useInventory"])();
    const { shifts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ShiftContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useShift"])();
    // جميع الفواتير من الشفتات (مصدر الحقيقة للمبيعات)
    const allInvoices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Reports.useMemo[allInvoices]": ()=>shifts.flatMap({
                "Reports.useMemo[allInvoices]": (s)=>(s.invoices || []).map({
                        "Reports.useMemo[allInvoices]": (inv)=>({
                                ...inv,
                                shiftId: s.id
                            })
                    }["Reports.useMemo[allInvoices]"])
            }["Reports.useMemo[allInvoices]"])
    }["Reports.useMemo[allInvoices]"], [
        shifts
    ]);
    const formatCurrency = (v)=>`${Number(v || 0).toLocaleString("ar-SA")} ر.س`;
    // 🔹 إجماليات عامة
    const salesStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Reports.useMemo[salesStats]": ()=>{
            if (!allInvoices.length) return {
                totalSales: 0,
                count: 0,
                avg: 0,
                todayTotal: 0,
                monthTotal: 0
            };
            const todayStr = new Date().toISOString().slice(0, 10);
            const thisMonth = todayStr.slice(0, 7); // yyyy-mm
            let totalSales = 0;
            let todayTotal = 0;
            let monthTotal = 0;
            allInvoices.forEach({
                "Reports.useMemo[salesStats]": (inv)=>{
                    const sign = inv.type === "return" ? -1 : 1;
                    const val = Number(inv.total || 0) * sign;
                    totalSales += val;
                    const dateStr = inv.date?.slice(0, 10) || "";
                    if (dateStr === todayStr) todayTotal += val;
                    if (dateStr.slice(0, 7) === thisMonth) monthTotal += val;
                }
            }["Reports.useMemo[salesStats]"]);
            const count = allInvoices.length;
            const avg = count ? totalSales / count : 0;
            return {
                totalSales,
                count,
                avg,
                todayTotal,
                monthTotal
            };
        }
    }["Reports.useMemo[salesStats]"], [
        allInvoices
    ]);
    // 🔹 بيانات الرسم البياني الشهري للمبيعات
    const monthlyChartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Reports.useMemo[monthlyChartData]": ()=>{
            const map = new Map(); // key: yyyy-mm, value: total
            allInvoices.forEach({
                "Reports.useMemo[monthlyChartData]": (inv)=>{
                    const dateStr = inv.date?.slice(0, 7); // yyyy-mm
                    if (!dateStr) return;
                    const sign = inv.type === "return" ? -1 : 1;
                    const val = Number(inv.total || 0) * sign;
                    map.set(dateStr, (map.get(dateStr) || 0) + val);
                }
            }["Reports.useMemo[monthlyChartData]"]);
            const arr = Array.from(map.entries()).sort({
                "Reports.useMemo[monthlyChartData].arr": ([a], [b])=>a > b ? 1 : -1
            }["Reports.useMemo[monthlyChartData].arr"]).map({
                "Reports.useMemo[monthlyChartData].arr": ([month, total])=>({
                        month,
                        total
                    })
            }["Reports.useMemo[monthlyChartData].arr"]);
            return arr;
        }
    }["Reports.useMemo[monthlyChartData]"], [
        allInvoices
    ]);
    // 🔹 تقرير المخزون + الربحية البسيطة لكل منتج
    const stockReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Reports.useMemo[stockReport]": ()=>{
            return products.map({
                "Reports.useMemo[stockReport]": (p)=>{
                    // نفترض أن margin = سعر البيع - costPrice إن وجد
                    const cost = p.costPrice ?? p.purchasePrice ?? (p.price ? p.price * 0.7 : 0);
                    const selling = Number(p.price || 0);
                    const margin = selling - cost;
                    return {
                        id: p.id,
                        name: p.name,
                        category: p.category || "غير مصنف",
                        company: p.company || "غير محدد",
                        quantity: p.quantity || 0,
                        minQty: p.minQty || 0,
                        expiryDate: p.expiryDate || null,
                        price: selling,
                        cost,
                        margin
                    };
                }
            }["Reports.useMemo[stockReport]"]);
        }
    }["Reports.useMemo[stockReport]"], [
        products
    ]);
    const lowStockProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Reports.useMemo[lowStockProducts]": ()=>stockReport.filter({
                "Reports.useMemo[lowStockProducts]": (p)=>p.minQty && p.quantity <= p.minQty
            }["Reports.useMemo[lowStockProducts]"])
    }["Reports.useMemo[lowStockProducts]"], [
        stockReport
    ]);
    const expiredProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Reports.useMemo[expiredProducts]": ()=>{
            const today = new Date().toISOString().slice(0, 10);
            return stockReport.filter({
                "Reports.useMemo[expiredProducts]": (p)=>{
                    if (!p.expiryDate) return false;
                    const expStr = String(p.expiryDate).slice(0, 10);
                    return expStr < today;
                }
            }["Reports.useMemo[expiredProducts]"]);
        }
    }["Reports.useMemo[expiredProducts]"], [
        stockReport
    ]);
    const nearExpiryProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Reports.useMemo[nearExpiryProducts]": ()=>{
            const today = new Date();
            const threshold = new Date();
            threshold.setMonth(threshold.getMonth() + 1); // خلال شهر
            const todayStr = today.toISOString().slice(0, 10);
            const thStr = threshold.toISOString().slice(0, 10);
            return stockReport.filter({
                "Reports.useMemo[nearExpiryProducts]": (p)=>{
                    if (!p.expiryDate) return false;
                    const expStr = String(p.expiryDate).slice(0, 10);
                    return expStr >= todayStr && expStr <= thStr;
                }
            }["Reports.useMemo[nearExpiryProducts]"]);
        }
    }["Reports.useMemo[nearExpiryProducts]"], [
        stockReport
    ]);
    // 🔹 طباعة عامة
    const openPrintWindow = (title, contentHtml)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const html = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 20px; }
            h2 { color:#0ea5e9; margin-bottom: 10px; text-align:center; }
            table { width:100%; border-collapse: collapse; margin-top:10px; }
            th, td { border:1px solid #ddd; padding:6px; text-align:center; font-size:13px; }
            th { background:#f3f4f6; }
          </style>
        </head>
        <body>
          <h2>${title}</h2>
          ${contentHtml}
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
        const w = window.open("", "_blank", "width=900,height=900");
        if (!w) return;
        w.document.write(html);
        w.document.close();
    };
    const printStockReport = ()=>{
        const rows = stockReport.map((p)=>`
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${p.company}</td>
          <td>${p.quantity}</td>
          <td>${p.minQty}</td>
          <td>${p.expiryDate || "—"}</td>
          <td>${p.price}</td>
        </tr>
      `).join("");
        const table = `
      <table>
        <thead>
          <tr>
            <th>الكود</th>
            <th>الاسم</th>
            <th>التصنيف</th>
            <th>الشركة</th>
            <th>المخزون</th>
            <th>الحد الأدنى</th>
            <th>تاريخ الانتهاء</th>
            <th>سعر البيع</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
        openPrintWindow("تقرير المخزون", table);
    };
    const printLowStock = ()=>{
        const rows = lowStockProducts.map((p)=>`
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${p.company}</td>
          <td>${p.quantity}</td>
          <td>${p.minQty}</td>
        </tr>
      `).join("");
        const table = `
      <table>
        <thead>
          <tr>
            <th>الكود</th>
            <th>الاسم</th>
            <th>التصنيف</th>
            <th>الشركة</th>
            <th>الكمية الحالية</th>
            <th>الحد الأدنى</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
        openPrintWindow("تقرير الأصناف ذات الكمية المنخفضة", table);
    };
    const printSalesSummary = ()=>{
        const rows = allInvoices.map((inv)=>`
        <tr>
          <td>${inv.id}</td>
          <td>${inv.type === "sale" ? "بيع" : "مرتجع"}</td>
          <td>${inv.customer}</td>
          <td>${inv.cashier}</td>
          <td>${inv.payment}</td>
          <td>${inv.total}</td>
        </tr>
      `).join("");
        const table = `
      <table>
        <thead>
          <tr>
            <th>رقم الفاتورة</th>
            <th>النوع</th>
            <th>العميل</th>
            <th>الكاشير</th>
            <th>طريقة الدفع</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
        openPrintWindow("تقرير المبيعات", table);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        user: user,
        title: "التقارير",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            dir: "rtl",
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabButton, {
                            id: "overview",
                            label: "نظرة عامة",
                            activeTab: activeTab,
                            setActiveTab: setActiveTab
                        }, void 0, false, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 314,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabButton, {
                            id: "sales",
                            label: "تقرير المبيعات",
                            activeTab: activeTab,
                            setActiveTab: setActiveTab
                        }, void 0, false, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 320,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabButton, {
                            id: "stock",
                            label: "تقرير المخزون",
                            activeTab: activeTab,
                            setActiveTab: setActiveTab
                        }, void 0, false, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 326,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabButton, {
                            id: "alerts",
                            label: "تنبيهات المخزون",
                            activeTab: activeTab,
                            setActiveTab: setActiveTab
                        }, void 0, false, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 332,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabButton, {
                            id: "shifts",
                            label: "تقرير الشفتات",
                            activeTab: activeTab,
                            setActiveTab: setActiveTab
                        }, void 0, false, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 338,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/reports.js",
                    lineNumber: 313,
                    columnNumber: 9
                }, this),
                activeTab === "overview" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OverviewTab, {
                    salesStats: salesStats,
                    monthlyChartData: monthlyChartData,
                    formatCurrency: formatCurrency,
                    allInvoices: allInvoices
                }, void 0, false, {
                    fileName: "[project]/pages/reports.js",
                    lineNumber: 348,
                    columnNumber: 11
                }, this),
                activeTab === "sales" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SalesTab, {
                    allInvoices: allInvoices,
                    formatCurrency: formatCurrency,
                    printSalesSummary: printSalesSummary
                }, void 0, false, {
                    fileName: "[project]/pages/reports.js",
                    lineNumber: 357,
                    columnNumber: 11
                }, this),
                activeTab === "stock" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StockTab, {
                    stockReport: stockReport,
                    printStockReport: printStockReport,
                    formatCurrency: formatCurrency
                }, void 0, false, {
                    fileName: "[project]/pages/reports.js",
                    lineNumber: 365,
                    columnNumber: 11
                }, this),
                activeTab === "alerts" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertsTab, {
                    lowStockProducts: lowStockProducts,
                    expiredProducts: expiredProducts,
                    nearExpiryProducts: nearExpiryProducts,
                    printLowStock: printLowStock
                }, void 0, false, {
                    fileName: "[project]/pages/reports.js",
                    lineNumber: 373,
                    columnNumber: 11
                }, this),
                activeTab === "shifts" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShiftsTab, {
                    shifts: shifts,
                    formatCurrency: formatCurrency
                }, void 0, false, {
                    fileName: "[project]/pages/reports.js",
                    lineNumber: 382,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/reports.js",
            lineNumber: 311,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/reports.js",
        lineNumber: 310,
        columnNumber: 5
    }, this);
}
_s(Reports, "8hvGk+D1GwoESK55yVcbxMrHT0c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$InventoryContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useInventory"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ShiftContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useShift"]
    ];
});
_c1 = Reports;
/* ------------------ Components ------------------ */ function TabButton({ id, label, activeTab, setActiveTab }) {
    const isActive = activeTab === id;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: ()=>setActiveTab(id),
        className: `px-3 py-1.5 text-sm rounded-lg border transition ${isActive ? "bg-sky-600 text-white border-sky-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`,
        children: label
    }, void 0, false, {
        fileName: "[project]/pages/reports.js",
        lineNumber: 394,
        columnNumber: 5
    }, this);
}
_c2 = TabButton;
/* 🔹 تبويب نظرة عامة */ function OverviewTab({ salesStats, monthlyChartData, formatCurrency, allInvoices }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        title: "إجمالي المبيعات",
                        value: formatCurrency(salesStats.totalSales),
                        color: "text-emerald-600"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 413,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        title: "عدد الفواتير",
                        value: salesStats.count.toLocaleString("ar-SA"),
                        color: "text-sky-600"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 418,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        title: "متوسط قيمة الفاتورة",
                        value: formatCurrency(salesStats.avg),
                        color: "text-amber-600"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 423,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        title: "مبيعات اليوم",
                        value: formatCurrency(salesStats.todayTotal),
                        color: "text-purple-600"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 428,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 412,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-white border rounded-lg shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col justify-between gap-2 mb-3 sm:flex-row sm:items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold text-gray-800",
                            children: "📈 المبيعات الشهرية (صافي بيع - مرتجع)"
                        }, void 0, false, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 438,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 437,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-64",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                            width: "100%",
                            height: "100%",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__["LineChart"], {
                                data: monthlyChartData,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                        strokeDasharray: "3 3"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 445,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                        dataKey: "month"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 446,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 447,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 448,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Line"], {
                                        type: "monotone",
                                        dataKey: "total",
                                        stroke: "#0ea5e9",
                                        strokeWidth: 2
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 449,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 444,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 443,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 442,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 436,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 overflow-x-auto bg-white border rounded-lg shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-3 text-lg font-semibold text-gray-800",
                        children: "آخر الفواتير"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 462,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-sm text-right min-w-[780px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "text-gray-600 bg-gray-50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "رقم الفاتورة"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 468,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "النوع"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 469,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "العميل"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 470,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الكاشير"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 471,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "طريقة الدفع"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 472,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "القيمة"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 473,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/reports.js",
                                    lineNumber: 467,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 466,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: [
                                    allInvoices.slice(0, 10).map((inv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-t hover:bg-gray-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2 text-sky-700",
                                                    children: inv.id
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 479,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: inv.type === "sale" ? "بيع" : "مرتجع"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 480,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: inv.customer
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 483,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: inv.cashier
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 484,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: inv.payment === "cash" ? "نقدًا" : inv.payment === "card" ? "بطاقة" : "محفظة"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 485,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2 font-semibold text-emerald-700",
                                                    children: formatCurrency(inv.total)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 492,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, inv.id, true, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 478,
                                            columnNumber: 15
                                        }, this)),
                                    !allInvoices.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: "6",
                                            className: "py-4 text-center text-gray-500",
                                            children: "لا توجد فواتير بعد…"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 499,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 498,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 476,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 465,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 461,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/reports.js",
        lineNumber: 410,
        columnNumber: 5
    }, this);
}
_c3 = OverviewTab;
/* 🔹 تبويب المبيعات */ function SalesTab({ allInvoices, formatCurrency, printSalesSummary }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold text-gray-800",
                        children: "🧾 تقرير المبيعات التفصيلي"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 516,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: printSalesSummary,
                        className: "px-3 py-1.5 text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100",
                        children: "🖨️ طباعة تقرير المبيعات"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 519,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 515,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 overflow-x-auto bg-white border rounded-lg shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-sm text-right min-w-[900px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "text-gray-600 bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "رقم الفاتورة"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 531,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "النوع"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 532,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "العميل"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 533,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الكاشير"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 534,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "طريقة الدفع"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 535,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "القيمة"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 536,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 530,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 529,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: [
                                allInvoices.map((inv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "border-t hover:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 text-sky-700",
                                                children: inv.id
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 542,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: inv.type === "sale" ? "بيع" : "مرتجع"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 543,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: inv.customer
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 546,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: inv.cashier
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 547,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: inv.payment === "cash" ? "نقدًا" : inv.payment === "card" ? "بطاقة" : "محفظة"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 548,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 font-semibold text-emerald-700",
                                                children: formatCurrency(inv.total)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 555,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, inv.id, true, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 541,
                                        columnNumber: 15
                                    }, this)),
                                !allInvoices.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: "6",
                                        className: "py-4 text-center text-gray-500",
                                        children: "لا توجد بيانات مبيعات بعد…"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 562,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/reports.js",
                                    lineNumber: 561,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 539,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/reports.js",
                    lineNumber: 528,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 527,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/reports.js",
        lineNumber: 514,
        columnNumber: 5
    }, this);
}
_c4 = SalesTab;
/* 🔹 تبويب المخزون */ function StockTab({ stockReport, printStockReport, formatCurrency }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold text-gray-800",
                        children: "🏬 تقرير المخزون"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 579,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: printStockReport,
                        className: "px-3 py-1.5 text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100",
                        children: "🖨️ طباعة تقرير المخزون"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 582,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 578,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 overflow-x-auto bg-white border rounded-lg shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-sm text-right min-w-[900px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "text-gray-600 bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الكود"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 594,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الاسم"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 595,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "التصنيف"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 596,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الشركة"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 597,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "المخزون"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 598,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الحد الأدنى"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 599,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "سعر البيع"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 600,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "هامش الربح"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 601,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 593,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 592,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: [
                                stockReport.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "border-t hover:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: p.id
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 607,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: p.name
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 608,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: p.category
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 609,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: p.company
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 610,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: p.quantity
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 611,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: p.minQty
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 612,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: formatCurrency(p.price)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 613,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: `px-3 py-2 font-semibold ${p.margin > 0 ? "text-emerald-700" : "text-red-600"}`,
                                                children: formatCurrency(p.margin)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 616,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, p.id, true, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 606,
                                        columnNumber: 15
                                    }, this)),
                                !stockReport.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: "8",
                                        className: "py-4 text-center text-gray-500",
                                        children: "لا توجد بيانات مخزون…"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 627,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/reports.js",
                                    lineNumber: 626,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 604,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/reports.js",
                    lineNumber: 591,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 590,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/reports.js",
        lineNumber: 577,
        columnNumber: 5
    }, this);
}
_c5 = StockTab;
/* 🔹 تبويب التنبيهات */ function AlertsTab({ lowStockProducts, expiredProducts, nearExpiryProducts, printLowStock }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: printLowStock,
                    className: "px-3 py-1.5 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100",
                    children: "🖨️ طباعة تقرير الكمية المنخفضة"
                }, void 0, false, {
                    fileName: "[project]/pages/reports.js",
                    lineNumber: 650,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 649,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 overflow-x-auto bg-white border rounded-lg shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-2 text-lg font-semibold text-red-700",
                        children: "❌ منتجات منتهية الصلاحية"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 660,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-sm text-right min-w-[700px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "text-red-800 bg-red-50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الكود"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 666,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الاسم"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 667,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الكمية"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 668,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "تاريخ الانتهاء"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 669,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/reports.js",
                                    lineNumber: 665,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 664,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: [
                                    expiredProducts.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-t hover:bg-red-50/40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.id
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 675,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 676,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.quantity
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 677,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.expiryDate
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 678,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, p.id, true, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 674,
                                            columnNumber: 15
                                        }, this)),
                                    !expiredProducts.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: "4",
                                            className: "py-4 text-center text-gray-500",
                                            children: "لا توجد أصناف منتهية الصلاحية 👌"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 683,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 682,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 672,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 663,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 659,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 overflow-x-auto bg-white border rounded-lg shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-2 text-lg font-semibold text-amber-700",
                        children: "⚠️ منتجات تقترب من انتهاء الصلاحية (خلال شهر)"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 694,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-sm text-right min-w-[700px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "bg-amber-50 text-amber-800",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الكود"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 700,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الاسم"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 701,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الكمية"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 702,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "تاريخ الانتهاء"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 703,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/reports.js",
                                    lineNumber: 699,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 698,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: [
                                    nearExpiryProducts.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-t hover:bg-amber-50/40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.id
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 709,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 710,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.quantity
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 711,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.expiryDate
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 712,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, p.id, true, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 708,
                                            columnNumber: 15
                                        }, this)),
                                    !nearExpiryProducts.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: "4",
                                            className: "py-4 text-center text-gray-500",
                                            children: "لا توجد أصناف قريبة الانتهاء 👌"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 717,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 716,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 706,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 697,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 693,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 overflow-x-auto bg-white border rounded-lg shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-2 text-lg font-semibold text-orange-700",
                        children: "📉 منتجات ذات كمية منخفضة"
                    }, void 0, false, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 728,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-sm text-right min-w-[700px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "text-orange-800 bg-orange-50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الكود"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 734,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الاسم"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 735,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الكمية الحالية"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 736,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الحد الأدنى"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 737,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/reports.js",
                                    lineNumber: 733,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 732,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: [
                                    lowStockProducts.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-t hover:bg-orange-50/40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.id
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 743,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 744,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.quantity
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 745,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-2",
                                                    children: p.minQty
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 746,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, p.id, true, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 742,
                                            columnNumber: 15
                                        }, this)),
                                    !lowStockProducts.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: "4",
                                            className: "py-4 text-center text-gray-500",
                                            children: "لا توجد أصناف ذات كمية منخفضة 👌"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reports.js",
                                            lineNumber: 751,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 750,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 740,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/reports.js",
                        lineNumber: 731,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 727,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/reports.js",
        lineNumber: 647,
        columnNumber: 5
    }, this);
}
_c6 = AlertsTab;
/* 🔹 تبويب الشفتات */ function ShiftsTab({ shifts, formatCurrency }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-lg font-semibold text-gray-800",
                children: "🕒 تقرير الشفتات"
            }, void 0, false, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 767,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 overflow-x-auto bg-white border rounded-lg shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-sm text-right min-w-[900px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "text-gray-600 bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "رقم الشفت"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 774,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "الكاشير"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 775,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "وقت الفتح"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 776,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "وقت الإغلاق"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 777,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "إجمالي المبيعات"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 778,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "نقدًا"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 779,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "بطاقة"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 780,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "محفظة"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 781,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "عدد الفواتير"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 782,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/reports.js",
                                lineNumber: 773,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 772,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: [
                                shifts.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "border-t hover:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: s.id
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 788,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: s.cashier
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 789,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SafeDate, {
                                                    value: s.openedAt
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 791,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 790,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: s.closedAt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SafeDate, {
                                                    value: s.closedAt
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/reports.js",
                                                    lineNumber: 795,
                                                    columnNumber: 21
                                                }, this) : "مفتوح"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 793,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: formatCurrency(s.totals.totalSales)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 800,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: formatCurrency(s.totals.totalCash)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 803,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: formatCurrency(s.totals.totalCard)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 806,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: formatCurrency(s.totals.totalWallet)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 809,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: s.totals.invoiceCount
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reports.js",
                                                lineNumber: 812,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, s.id, true, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 787,
                                        columnNumber: 15
                                    }, this)),
                                !shifts.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: "9",
                                        className: "py-4 text-center text-gray-500",
                                        children: "لا توجد شفتات مسجلة بعد…"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reports.js",
                                        lineNumber: 819,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/reports.js",
                                    lineNumber: 818,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/reports.js",
                            lineNumber: 785,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/reports.js",
                    lineNumber: 771,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 770,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/reports.js",
        lineNumber: 766,
        columnNumber: 5
    }, this);
}
_c7 = ShiftsTab;
/* 🔹 كرت ملخص */ function SummaryCard({ title, value, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 text-center bg-white border rounded-lg shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-500",
                children: title
            }, void 0, false, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 835,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `mt-1 text-xl font-bold ${color}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/pages/reports.js",
                lineNumber: 836,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/reports.js",
        lineNumber: 834,
        columnNumber: 5
    }, this);
} // // pages/reports.js
 // import { useState, useEffect, useRef } from 'react'
 // import { motion } from 'framer-motion'
 // import Layout from '../components/Layout'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
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
 //   ResponsiveContainer,
 //   BarChart,
 //   Bar,
 // } from 'recharts'
 // const API_URL = 'http://localhost:5000/api/reports'
 // export default function Reports() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [activeTab, setActiveTab] = useState('summary')
 //   const [dateRange, setDateRange] = useState({ from: '', to: '' })
 //   const [selectedUser, setSelectedUser] = useState('all')
 //   const printRef = useRef(null)
 //   const [salesData, setSalesData] = useState([])
 //   const [inventoryData, setInventoryData] = useState([])
 //   const [profitData, setProfitData] = useState([])
 //   const [userStats, setUserStats] = useState([])
 //   const [logs, setLogs] = useState([])
 //   useEffect(() => {
 //   const token = localStorage.getItem("pharmacy_token")
 //   if (!token) {
 //     router.replace("/")   // redirect to login
 //   }
 // }, [])
 //   // 🔹 تحميل البيانات من الباك إند
 //   useEffect(() => {
 //     const loadReports = async () => {
 //       try {
 //         const params = new URLSearchParams()
 //         if (dateRange.from) params.append('from', dateRange.from)
 //         if (dateRange.to) params.append('to', dateRange.to)
 //         if (selectedUser !== 'all') params.append('user', selectedUser)
 //         const res = await fetch(`${API_URL}?${params.toString()}`)
 //         const data = await res.json()
 //         if (!res.ok) throw new Error(data.message || 'خطأ في تحميل التقارير')
 //         setSalesData(Array.isArray(data.sales) ? data.sales : [])
 //         setInventoryData(Array.isArray(data.inventory) ? data.inventory : [])
 //         setProfitData(Array.isArray(data.profit) ? data.profit : [])
 //         setUserStats(Array.isArray(data.users) ? data.users : [])
 //         setLogs(Array.isArray(data.logs) ? data.logs : [])
 //       } catch (err) {
 //         console.error(err)
 //         toast.error('فشل تحميل بيانات التقارير')
 //       }
 //     }
 //     loadReports()
 //   }, [dateRange.from, dateRange.to, selectedUser])
 //   // 🔸 الفلترة (فقط رسالة للمستخدم – البيانات نفسها تُعاد تحميلها تلقائيًا من useEffect)
 //   const handleFilter = () => {
 //     toast.success('✅ تم تطبيق الفلتر على التقارير')
 //   }
 //   // 🔸 الطباعة
 //   const printAllReports = () => {
 //     if (!printRef.current) return
 //     const content = printRef.current.innerHTML
 //     const printWindow = window.open('', '_blank', 'width=900,height=700')
 //     printWindow.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير شامل</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
 //             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
 //             th { background: #f5f5f5; }
 //             h2 { text-align: center; color: #0ea5e9; }
 //           </style>
 //         </head>
 //         <body>${content}</body>
 //       </html>
 //     `)
 //     printWindow.document.close()
 //     printWindow.print()
 //   }
 //   // 🔹 التبويبات
 //   const tabButton = (key, label, icon) => (
 //     <button
 //       key={key}
 //       onClick={() => setActiveTab(key)}
 //       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
 //         activeTab === key
 //           ? 'text-sky-700 border-sky-500 bg-sky-50'
 //           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
 //       }`}
 //     >
 //       <span>{icon}</span> {label}
 //     </button>
 //   )
 //   return (
 //     <Layout user={user} title="📊 التقارير الشاملة">
 //       <div dir="rtl" className="space-y-6">
 //         {/* شريط التبويبات */}
 //         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
 //           {tabButton('summary', 'الملخص العام', '📋')}
 //           {tabButton('sales', 'المبيعات', '🧾')}
 //           {tabButton('inventory', 'المخزون', '📦')}
 //           {tabButton('profit', 'الأرباح', '💰')}
 //           {tabButton('users', 'المستخدمين', '👥')}
 //           {tabButton('system', 'النظام', '⚙️')}
 //         </div>
 //         {/* شريط الفلاتر */}
 //         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
 //           <div className="flex flex-wrap items-center gap-2">
 //             <label className="text-sm text-gray-700">من:</label>
 //             <input
 //               type="date"
 //               value={dateRange.from}
 //               onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             />
 //             <label className="text-sm text-gray-700">إلى:</label>
 //             <input
 //               type="date"
 //               value={dateRange.to}
 //               onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             />
 //             <select
 //               value={selectedUser}
 //               onChange={(e) => setSelectedUser(e.target.value)}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             >
 //               <option value="all">المستخدم: الكل</option>
 //               {/* لو حابب نجيب أسماء المستخدمين من الـ API ممكن نعدل هنا لاحقًا */}
 //               <option value="أحمد">أحمد</option>
 //               <option value="محمد">محمد</option>
 //               <option value="مها">مها</option>
 //             </select>
 //             <button
 //               onClick={handleFilter}
 //               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
 //             >
 //               🔍 تطبيق
 //             </button>
 //           </div>
 //           <button
 //             onClick={printAllReports}
 //             className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700"
 //           >
 //             🖨️ طباعة الكل
 //           </button>
 //         </div>
 //         {/* المحتوى */}
 //         <motion.div
 //           ref={printRef}
 //           key={activeTab}
 //           initial={{ opacity: 0 }}
 //           animate={{ opacity: 1 }}
 //           transition={{ duration: 0.25 }}
 //           className="space-y-4"
 //         >
 //           {activeTab === 'summary' && (
 //             <SummaryTab sales={salesData} inventory={inventoryData} profit={profitData} />
 //           )}
 //           {activeTab === 'sales' && <SalesTab sales={salesData} />}
 //           {activeTab === 'inventory' && <InventoryTab inventory={inventoryData} />}
 //           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
 //           {activeTab === 'users' && <UsersTab userStats={userStats} />}
 //           {activeTab === 'system' && <SystemTab logs={logs} />}
 //         </motion.div>
 //       </div>
 //     </Layout>
 //   )
 // }
 // /* ----------------------------------------------------------
 //    📋 الملخص العام
 // ---------------------------------------------------------- */
 // function SummaryTab({ sales, inventory, profit }) {
 //   const safeSales = Array.isArray(sales) ? sales : []
 //   const safeInventory = Array.isArray(inventory) ? inventory : []
 //   const safeProfit = Array.isArray(profit) ? profit : []
 //   const totalSales = safeSales.reduce(
 //     (s, x) => s + (x.total || (x.qty * x.price) || 0),
 //     0
 //   )
 //   const totalProfit = safeProfit.reduce((t, m) => t + (m.profit || 0), 0)
 //   const lowStock = safeInventory.filter((i) => i.low_stock).length
 //   return (
 //     <div className="p-6 space-y-6 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📋 ملخص الصيدلية العام</h3>
 //       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
 //         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
 //         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600" />
 //         <SummaryCard title="المنتجات المنخفضة" value={lowStock} color="text-red-600" />
 //         <SummaryCard title="عدد المنتجات" value={safeInventory.length} color="text-amber-600" />
 //       </div>
 //       <ResponsiveContainer width="100%" height={260}>
 //         <BarChart data={safeSales}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="date" />
 //           <YAxis />
 //           <Tooltip />
 //           <Bar dataKey="total" fill={theme.colors.primary} />
 //         </BarChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ----------------------------------------------------------
 //    🧾 تقرير المبيعات المفصل
 // ---------------------------------------------------------- */
 // function SalesTab({ sales }) {
 //   const safeSales = Array.isArray(sales) ? sales : []
 //   const grouped = safeSales.reduce((acc, row) => {
 //     const day = row.date?.slice(0, 10) || 'غير محدد'
 //     if (!acc[day]) acc[day] = []
 //     acc[day].push(row)
 //     return acc
 //   }, {})
 //   const days = Object.keys(grouped)
 //   if (!days.length) {
 //     return (
 //       <div className="p-6 text-center text-gray-500 bg-white border rounded-lg shadow-sm">
 //         لا توجد بيانات مبيعات في الفترة المحددة.
 //       </div>
 //     )
 //   }
 //   return (
 //     <div className="space-y-6">
 //       {days.map((day) => {
 //         const list = grouped[day]
 //         const total = list.reduce((sum, s) => sum + (s.total || (s.qty * s.price) || 0), 0)
 //         const totalQty = list.reduce((sum, s) => sum + (s.qty || 0), 0)
 //         const cashiers = [...new Set(list.map((s) => s.cashier_name || s.cashier))].join('، ')
 //         return (
 //           <div key={day} className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //             <div className="flex flex-col md:flex-row md:justify-between md:items-center">
 //               <h3 className="text-lg font-semibold text-gray-800">
 //                 📅 مبيعات يوم <span className="text-sky-600">{day}</span>
 //               </h3>
 //             </div>
 //             <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
 //               <SummaryCard title="عدد الفواتير" value={list.length} color="text-blue-600" />
 //               <SummaryCard title="إجمالي القطع" value={totalQty} color="text-green-600" />
 //               <SummaryCard title="إجمالي اليوم" value={`${total} ر.س`} color="text-sky-600" />
 //               <SummaryCard title="الكاشيرين" value={cashiers || '—'} color="text-amber-600" />
 //             </div>
 //             <table className="w-full text-sm text-right border-t border-gray-100">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">#</th>
 //                   <th className="px-3 py-2">رقم الفاتورة</th>
 //                   <th className="px-3 py-2">العميل</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                   <th className="px-3 py-2">الكاشير</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {list.map((s, i) => (
 //                   <tr key={s.id || i} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{i + 1}</td>
 //                     <td className="px-3 py-2">{s.invoice_code}</td>
 //                     <td className="px-3 py-2">{s.customer}</td>
 //                     <td className="px-3 py-2 font-semibold text-sky-700">
 //                       {(s.total || (s.qty * s.price) || 0) + ' ر.س'}
 //                     </td>
 //                     <td className="px-3 py-2">{s.cashier_name || s.cashier}</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //           </div>
 //         )
 //       })}
 //     </div>
 //   )
 // }
 // /* ----------------------------------------------------------
 //    📦 تقرير المخزون
 // ---------------------------------------------------------- */
 // function InventoryTab({ inventory }) {
 //   const safeInventory = Array.isArray(inventory) ? inventory : []
 //   const [sortKey, setSortKey] = useState('name')
 //   const [sortDir, setSortDir] = useState('asc')
 //   const sortedData = [...safeInventory].sort((a, b) => {
 //     if (sortKey === 'qty') {
 //       return sortDir === 'asc' ? a.qty - b.qty : b.qty - a.qty
 //     } else if (sortKey === 'expiry_date') {
 //       return sortDir === 'asc'
 //         ? new Date(a.expiry_date) - new Date(b.expiry_date)
 //         : new Date(b.expiry_date) - new Date(a.expiry_date)
 //     } else {
 //       return sortDir === 'asc'
 //         ? (a.name || '').localeCompare(b.name || '', 'ar')
 //         : (b.name || '').localeCompare(a.name || '', 'ar')
 //     }
 //   })
 //   const headerCell = (label, key) => (
 //     <th
 //       key={key}
 //       onClick={() => {
 //         if (sortKey === key) {
 //           setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
 //         } else {
 //           setSortKey(key)
 //           setSortDir('asc')
 //         }
 //       }}
 //       className="px-3 py-2 cursor-pointer hover:bg-gray-100"
 //     >
 //       {label} {sortKey === key ? (sortDir === 'asc' ? '⬆️' : '⬇️') : ''}
 //     </th>
 //   )
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <div className="flex flex-col md:flex-row md:justify-between md:items-center">
 //         <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون الحالي</h3>
 //         <p className="text-sm text-gray-500">إجمالي الأصناف: {safeInventory.length}</p>
 //       </div>
 //       <div className="overflow-x-auto">
 //         <table className="w-full text-sm text-right border-t border-gray-100">
 //           <thead className="text-gray-600 bg-gray-50">
 //             <tr>
 //               {headerCell('اسم الدواء', 'name')}
 //               {headerCell('الكمية', 'qty')}
 //               {headerCell('تاريخ الانتهاء', 'expiry_date')}
 //               <th className="px-3 py-2">الحالة</th>
 //             </tr>
 //           </thead>
 //           <tbody>
 //             {sortedData.map((item, idx) => {
 //               const isLow = item.low_stock || item.qty <= 3
 //               const expiry = item.expiry_date || item.expiry
 //               const now = new Date()
 //               const expDate = expiry ? new Date(expiry) : null
 //               const isExpired = expDate && expDate < now
 //               const isNearExpiry =
 //                 expDate && expDate - now < 30 * 24 * 60 * 60 * 1000 && expDate > now
 //               return (
 //                 <tr key={idx} className="transition border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2 font-medium text-gray-700">{item.name}</td>
 //                   <td
 //                     className={`px-3 py-2 ${
 //                       isLow ? 'text-red-600 font-semibold' : 'text-green-600'
 //                     }`}
 //                   >
 //                     {item.qty}
 //                   </td>
 //                   <td
 //                     className={`px-3 py-2 ${
 //                       isExpired ? 'text-red-600' : isNearExpiry ? 'text-amber-600' : ''
 //                     }`}
 //                   >
 //                     {expiry || '—'}
 //                   </td>
 //                   <td className="px-3 py-2">
 //                     {isExpired
 //                       ? '❌ منتهي الصلاحية'
 //                       : isLow
 //                       ? '⚠️ مخزون منخفض'
 //                       : isNearExpiry
 //                       ? '⏰ قرب الانتهاء'
 //                       : '✅ صالح'}
 //                   </td>
 //                 </tr>
 //               )
 //             })}
 //             {!sortedData.length && (
 //               <tr>
 //                 <td colSpan={4} className="py-6 text-center text-gray-500">
 //                   لا توجد بيانات مخزون.
 //                 </td>
 //               </tr>
 //             )}
 //           </tbody>
 //         </table>
 //       </div>
 //     </div>
 //   )
 // }
 // /* ----------------------------------------------------------
 //    💰 تقرير الأرباح
 // ---------------------------------------------------------- */
 // function ProfitTab({ profitData }) {
 //   const safeProfit = Array.isArray(profitData) ? profitData : []
 //   const [sortKey, setSortKey] = useState('month')
 //   const [sortDir, setSortDir] = useState('asc')
 //   const sortedData = [...safeProfit].sort((a, b) => {
 //     if (sortKey === 'profit') {
 //       return sortDir === 'asc' ? a.profit - b.profit : b.profit - a.profit
 //     } else {
 //       return sortDir === 'asc'
 //         ? (a.month || '').localeCompare(b.month || '')
 //         : (b.month || '').localeCompare(a.month || '')
 //     }
 //   })
 //   const headerCell = (label, key) => (
 //     <th
 //       onClick={() => {
 //         if (sortKey === key) {
 //           setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
 //         } else {
 //           setSortKey(key)
 //           setSortDir('asc')
 //         }
 //       }}
 //       className="px-3 py-2 cursor-pointer hover:bg-gray-100"
 //     >
 //       {label} {sortKey === key ? (sortDir === 'asc' ? '⬆️' : '⬇️') : ''}
 //     </th>
 //   )
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📈 تقرير الأرباح الشهرية</h3>
 //       <div className="overflow-x-auto">
 //         <table className="w-full text-sm text-right border-t border-gray-100">
 //           <thead className="text-gray-600 bg-gray-50">
 //             <tr>
 //               {headerCell('الشهر', 'month')}
 //               {headerCell('الأرباح', 'profit')}
 //             </tr>
 //           </thead>
 //           <tbody>
 //             {sortedData.map((item, idx) => (
 //               <tr key={idx} className="border-t hover:bg-gray-50">
 //                 <td className="px-3 py-2">{item.month}</td>
 //                 <td className="px-3 py-2">{item.profit} ر.س</td>
 //               </tr>
 //             ))}
 //             {!sortedData.length && (
 //               <tr>
 //                 <td colSpan={2} className="py-6 text-center text-gray-500">
 //                   لا توجد بيانات أرباح.
 //                 </td>
 //               </tr>
 //             )}
 //           </tbody>
 //         </table>
 //       </div>
 //       <ResponsiveContainer width="100%" height={300}>
 //         <LineChart data={sortedData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="month" />
 //           <YAxis />
 //           <Tooltip />
 //           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
 //         </LineChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ----------------------------------------------------------
 //    👥 المستخدمون
 // ---------------------------------------------------------- */
 // function UsersTab({ userStats }) {
 //   const safeUsers = Array.isArray(userStats) ? userStats : []
 //   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#6366F1', '#EC4899']
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="mb-3 text-lg font-semibold text-gray-800">👥 أداء المستخدمين</h3>
 //       <ResponsiveContainer width="100%" height={260}>
 //         <PieChart>
 //           <Pie
 //             data={safeUsers}
 //             dataKey="sales"
 //             nameKey="name"
 //             cx="50%"
 //             cy="50%"
 //             outerRadius={90}
 //             label
 //           >
 //             {safeUsers.map((_, i) => (
 //               <Cell key={i} fill={COLORS[i % COLORS.length]} />
 //             ))}
 //           </Pie>
 //           <Tooltip />
 //         </PieChart>
 //       </ResponsiveContainer>
 //       <div className="mt-6">
 //         <table className="w-full text-sm text-right border-t border-gray-100">
 //           <thead className="text-gray-600 bg-gray-50">
 //             <tr>
 //               <th className="px-3 py-2">#</th>
 //               <th className="px-3 py-2">اسم المستخدم</th>
 //               <th className="px-3 py-2">إجمالي المبيعات</th>
 //             </tr>
 //           </thead>
 //           <tbody>
 //             {safeUsers.map((u, idx) => (
 //               <tr key={idx} className="border-t hover:bg-gray-50">
 //                 <td className="px-3 py-2">{idx + 1}</td>
 //                 <td className="px-3 py-2">{u.name}</td>
 //                 <td className="px-3 py-2">{u.sales} ر.س</td>
 //               </tr>
 //             ))}
 //             {!safeUsers.length && (
 //               <tr>
 //                 <td colSpan={3} className="py-6 text-center text-gray-500">
 //                   لا توجد بيانات مستخدمين.
 //                 </td>
 //               </tr>
 //             )}
 //           </tbody>
 //         </table>
 //       </div>
 //     </div>
 //   )
 // }
 // /* ----------------------------------------------------------
 //    ⚙️ سجل النظام
 // ---------------------------------------------------------- */
 // function SystemTab({ logs }) {
 //   const safeLogs = Array.isArray(logs) ? logs : []
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="mb-3 text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
 //       <table className="w-full text-sm text-right border-t border-gray-100">
 //         <thead className="text-gray-600 bg-gray-50">
 //           <tr>
 //             <th className="px-3 py-2">الوقت</th>
 //             <th className="px-3 py-2">المستخدم</th>
 //             <th className="px-3 py-2">الإجراء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {safeLogs.map((log, idx) => (
 //             <tr key={idx} className="border-t hover:bg-gray-50">
 //               <td className="px-3 py-2">{log.time}</td>
 //               <td className="px-3 py-2">{log.user}</td>
 //               <td className="px-3 py-2">{log.action}</td>
 //             </tr>
 //           ))}
 //           {!safeLogs.length && (
 //             <tr>
 //               <td colSpan={3} className="py-6 text-center text-gray-500">
 //                 لا توجد سجلات.
 //               </td>
 //             </tr>
 //           )}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* 🧩 بطاقة ملخص صغيرة */
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center transition border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white hover:shadow-md">
 //       <p className="text-sm text-gray-500">{title}</p>
 //       <h3 className={`text-lg font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
 // import { useState, useEffect, useRef } from 'react'
 // import Layout from '../components/Layout'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // import {
 //   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
 //   PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar
 // } from 'recharts'
 // import { motion } from 'framer-motion'
 // export default function Reports() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [activeTab, setActiveTab] = useState('summary')
 //   const [dateRange, setDateRange] = useState({ from: '', to: '' })
 //   const [selectedUser, setSelectedUser] = useState('all')
 //   const printRef = useRef(null)
 //   // بيانات النظام
 //   const [sales, setSales] = useState([])
 //   const [inventory, setInventory] = useState([])
 //   const [profit, setProfit] = useState([])
 //   const [users, setUsers] = useState([])
 //   const [logs, setLogs] = useState([])
 //   const API = "http://localhost:5000/api/reports"
 //   // تحميل البيانات من الباك اند
 //   useEffect(() => {
 //   loadAllReports()
 // }, [])
 // const loadAllReports = async () => {
 //   try {
 //     const base = 'http://localhost:5000/api/reports'
 //     const [sales, inventory, profit, users, system] = await Promise.all([
 //       fetch(`${base}/sales`).then(r => r.json()),
 //       fetch(`${base}/inventory`).then(r => r.json()),
 //       fetch(`${base}/profit`).then(r => r.json()),
 //       fetch(`${base}/users`).then(r => r.json()),
 //       fetch(`${base}/system`).then(r => r.json())
 //     ])
 //     setSalesData(sales)
 //     setInventoryData(inventory)
 //     setProfitData(profit)
 //     setUserStats(users)
 //     setLogs(system)
 //   } catch (err) {
 //     toast.error('فشل تحميل التقارير')
 //     console.log(err)
 //   }
 // }
 //   const handleFilter = () => {
 //     toast.success("تم تطبيق الفلتر")
 //   }
 //   const printAll = () => {
 //     const content = printRef.current.innerHTML
 //     const w = window.open('', '_blank', 'width=900,height=700')
 //     w.document.write(`
 //       <html dir="rtl"><body>${content}</body></html>
 //     `)
 //     w.document.close()
 //     w.print()
 //   }
 //   const tabButton = (key, label, icon) => (
 //     <button
 //       key={key}
 //       onClick={() => setActiveTab(key)}
 //       className={`flex items-center gap-2 px-4 py-2 rounded-md border-b-4 text-sm ${
 //         activeTab === key
 //           ? "border-sky-500 text-sky-700 bg-sky-50"
 //           : "border-transparent text-gray-700 hover:bg-gray-100"
 //       }`}
 //     >
 //       {icon} {label}
 //     </button>
 //   )
 //   return (
 //     <Layout user={user} title="📊 التقارير الشاملة">
 //       <div dir="rtl" className="space-y-6">
 //         {/* Tabs */}
 //         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
 //           {tabButton('summary', 'الملخص العام', '📋')}
 //           {tabButton('sales', 'المبيعات', '💰')}
 //           {tabButton('inventory', 'المخزون', '📦')}
 //           {tabButton('profit', 'الأرباح', '📈')}
 //           {tabButton('users', 'المستخدمين', '👥')}
 //           {tabButton('system', 'النظام', '⚙️')}
 //         </div>
 //         {/* Filters */}
 //         <div className="flex flex-wrap justify-between gap-3 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white">
 //           <div className="flex flex-wrap items-center gap-2 text-sm">
 //             <span>من:</span>
 //             <input type="date" className="px-2 py-1 border rounded" onChange={(e)=>setDateRange({...dateRange, from:e.target.value})}/>
 //             <span>إلى:</span>
 //             <input type="date" className="px-2 py-1 border rounded" onChange={(e)=>setDateRange({...dateRange, to:e.target.value})}/>
 //             <span>المستخدم:</span>
 //             <select value={selectedUser} onChange={(e)=>setSelectedUser(e.target.value)} className="px-3 py-2 border rounded">
 //               <option value="all">الكل</option>
 //               {users.map(u => <option key={u.id}>{u.name}</option>)}
 //             </select>
 //             <button onClick={handleFilter} className="px-3 py-2 text-white rounded bg-sky-600">تطبيق</button>
 //           </div>
 //           <button onClick={printAll} className="px-3 py-2 text-white rounded bg-amber-600">طباعة الكل</button>
 //         </div>
 //         {/* Content */}
 //         <motion.div ref={printRef} key={activeTab} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}}>
 //           {activeTab === "summary" && <SummaryTab sales={sales} inventory={inventory} profit={profit} />}
 //           {activeTab === "sales" && <SalesTab sales={sales} />}
 //           {activeTab === "inventory" && <InventoryTab inventory={inventory} />}
 //           {activeTab === "profit" && <ProfitTab profit={profit} />}
 //           {activeTab === "users" && <UsersTab users={users} />}
 //           {activeTab === "system" && <SystemTab logs={logs} />}
 //         </motion.div>
 //       </div>
 //     </Layout>
 //   )
 // }
 // /* ----------------------------------------
 //    📋 الملخص العام
 // ---------------------------------------- */
 // function SummaryTab({ sales, inventory, profit }) {
 //   const totalSales = sales.reduce((s, x) => s + (x.total || 0), 0)
 //   const totalProfit = profit.reduce((s, x) => s + (x.profit || 0), 0)
 //   const lowStock = inventory.filter(i => i.low_stock === 1).length
 //   return (
 //     <div className="p-6 space-y-6 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-700">📋 الملخص العام</h3>
 //       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
 //         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600"/>
 //         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600"/>
 //         <SummaryCard title="المنتجات المنخفضة" value={lowStock} color="text-red-600"/>
 //         <SummaryCard title="عدد الأصناف" value={inventory.length} color="text-amber-600"/>
 //       </div>
 //       <ResponsiveContainer width="100%" height={260}>
 //         <BarChart data={sales.map(s => ({ date: s.date, total: s.total }))}>
 //           <CartesianGrid strokeDasharray="3 3"/>
 //           <XAxis dataKey="date"/>
 //           <YAxis/>
 //           <Tooltip/>
 //           <Bar dataKey="total" fill={theme.colors.primary}/>
 //         </BarChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ----------------------------------------
 //    💰 تقرير المبيعات
 // ---------------------------------------- */
 // function SalesTab({ sales }) {
 //   const grouped = sales.reduce((acc, s) => {
 //     if (!acc[s.date]) acc[s.date] = []
 //     acc[s.date].push(s)
 //     return acc
 //   }, {})
 //   return (
 //     <div className="space-y-6">
 //       {Object.keys(grouped).map(day => {
 //         const list = grouped[day]
 //         const total = list.reduce((a,b)=>a+(b.total||0),0)
 //         return (
 //           <div key={day} className="p-5 space-y-3 bg-white border rounded-lg shadow-sm">
 //             <h3 className="text-lg font-semibold text-gray-700">📅 مبيعات يوم {day}</h3>
 //             <div className="font-semibold text-sky-600">إجمالي اليوم: {total} ر.س</div>
 //             <table className="w-full text-sm border-t">
 //               <thead className="bg-gray-50">
 //                 <tr>
 //                   <th>#</th><th>الكود</th><th>العميل</th><th>الدفع</th><th>المبلغ</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {list.map((s,i)=>(
 //                   <tr key={i}>
 //                     <td>{i+1}</td>
 //                     <td>{s.invoice_code}</td>
 //                     <td>{s.customer}</td>
 //                     <td>{s.payment}</td>
 //                     <td className="text-sky-600">{s.total} ر.س</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //           </div>
 //         )
 //       })}
 //     </div>
 //   )
 // }
 // /* ----------------------------------------
 //    📦 تقرير المخزون
 // ---------------------------------------- */
 // function InventoryTab({ inventory }) {
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="mb-3 text-lg font-semibold text-gray-700">📦 تقرير المخزون</h3>
 //       <table className="w-full text-sm border-t">
 //         <thead className="bg-gray-50">
 //           <tr>
 //             <th>المنتج</th>
 //             <th>الكمية</th>
 //             <th>الانتهاء</th>
 //             <th>الحالة</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {inventory.map((i,idx) => (
 //             <tr key={idx} className="border-t">
 //               <td>{i.name}</td>
 //               <td className={i.low_stock ? "text-red-600 font-semibold" : ""}>{i.qty}</td>
 //               <td>{i.expiry}</td>
 //               <td>{i.low_stock ? "⚠ مخزون منخفض" : "✔ جيد"}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* ----------------------------------------
 //    📈 تقرير الأرباح
 // ---------------------------------------- */
 // function ProfitTab({ profit }) {
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="mb-3 text-lg font-semibold text-gray-700">📈 تقرير الأرباح</h3>
 //       <ResponsiveContainer width="100%" height={260}>
 //         <LineChart data={profit}>
 //           <CartesianGrid strokeDasharray="3 3"/>
 //           <XAxis dataKey="month"/>
 //           <YAxis/>
 //           <Tooltip/>
 //           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2}/>
 //         </LineChart>
 //       </ResponsiveContainer>
 //       <table className="w-full mt-3 text-sm border-t">
 //         <thead className="bg-gray-50">
 //           <tr><th>الشهر</th><th>الربح</th></tr>
 //         </thead>
 //         <tbody>
 //           {profit.map((p,idx)=>
 //             <tr key={idx} className="border-t">
 //               <td>{p.month}</td>
 //               <td>{p.profit} ر.س</td>
 //             </tr>
 //           )}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* ----------------------------------------
 //    👥 المستخدمين
 // ---------------------------------------- */
 // function UsersTab({ users }) {
 //   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="mb-3 text-lg font-semibold text-gray-700">👥 أداء المستخدمين</h3>
 //       <ResponsiveContainer width="100%" height={260}>
 //         <PieChart>
 //           <Pie data={users} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
 //             {users.map((_,i)=><Cell key={i} fill={COLORS[i%3]}/>)}
 //           </Pie>
 //           <Tooltip/>
 //         </PieChart>
 //       </ResponsiveContainer>
 //       <table className="w-full mt-3 text-sm border-t">
 //         <thead className="bg-gray-50"><tr><th>#</th><th>الاسم</th><th>المبيعات</th></tr></thead>
 //         <tbody>
 //           {users.map((u,i)=>(
 //             <tr key={i} className="border-t">
 //               <td>{i+1}</td>
 //               <td>{u.name}</td>
 //               <td>{u.sales} ر.س</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* ----------------------------------------
 //    ⚙️ النظام
 // ---------------------------------------- */
 // function SystemTab({ logs }) {
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="mb-3 text-lg font-semibold">⚙ سجل النظام</h3>
 //       <table className="w-full text-sm border-t">
 //         <thead className="bg-gray-50">
 //           <tr>
 //             <th>الوقت</th>
 //             <th>المستخدم</th>
 //             <th>الإجراء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {logs.map((l,i)=>(
 //             <tr key={i} className="border-t">
 //               <td>{l.time}</td>
 //               <td>{l.user}</td>
 //               <td>{l.action}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* ----------------------------------------
 //    🧩 بطاقة صغيرة
 // ---------------------------------------- */
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white">
 //       <p className="text-sm text-gray-500">{title}</p>
 //       <h3 className={`text-lg font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
 // import { useState, useEffect, useRef } from 'react'
 // import { motion } from 'framer-motion'
 // import Layout from '../components/Layout'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // import {
 //   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
 //   PieChart, Pie, Cell, ResponsiveContainer,
 //   BarChart, Bar
 // } from 'recharts'
 // export default function Reports() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [activeTab, setActiveTab] = useState('summary')
 //   const [dateRange, setDateRange] = useState({ from: '', to: '' })
 //   const [selectedUser, setSelectedUser] = useState('all')
 //   const printRef = useRef(null)
 //   // 🔹 بيانات النظام (يتم تحميلها من الباك-إند)
 //   const [salesData, setSalesData] = useState([])
 //   const [inventoryData, setInventoryData] = useState([])
 //   const [profitData, setProfitData] = useState([])
 //   const [userStats, setUserStats] = useState([])
 //   const [logs, setLogs] = useState([])
 //   const API_URL = 'http://localhost:5000/api/reports/overview'
 //   // ======================================================
 //   // 🔥 تحميل البيانات من الباك-إند
 //   // ======================================================
 //   useEffect(() => {
 //     const loadReports = async () => {
 //       try {
 //         const res = await fetch(API_URL)
 //         const data = await res.json()
 //         if (!res.ok) throw new Error(data.message)
 //         setSalesData(data.sales || [])
 //         setInventoryData(data.inventory || [])
 //         setProfitData(data.profit || [])
 //         setUserStats(data.userStats || [])
 //         setLogs(data.logs || [])
 //       } catch (err) {
 //         console.error(err)
 //         toast.error("فشل تحميل بيانات التقارير")
 //       }
 //     }
 //     loadReports()
 //   }, [])
 //   // ======================================================
 //   // 🔍 الفلاتر
 //   // ======================================================
 //   const handleFilter = () => {
 //     toast.success("تم تطبيق الفلتر (تمثيلي – لم نربطه بعد)")
 //   }
 //   // ======================================================
 //   // 🖨️ طباعة
 //   // ======================================================
 //   const printAllReports = () => {
 //     const content = printRef.current.innerHTML
 //     const printWindow = window.open('', '_blank', 'width=900,height=700')
 //     printWindow.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>طباعة التقارير</title>
 //           <style>
 //             body { font-family: 'Tajawal'; padding: 20px; direction: rtl; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
 //             th, td { border: 1px solid #ccc; padding: 6px; }
 //             th { background: #f0f0f0; }
 //             h2 { text-align: center; color: #0ea5e9; }
 //           </style>
 //         </head>
 //         <body>${content}</body>
 //       </html>
 //     `)
 //     printWindow.document.close()
 //     printWindow.print()
 //   }
 //   // ======================================================
 //   // 🔘 أزرار التبويبات
 //   // ======================================================
 //   const tabButton = (key, label, icon) => (
 //     <button
 //       key={key}
 //       onClick={() => setActiveTab(key)}
 //       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm border-b-4 transition ${
 //         activeTab === key
 //           ? 'bg-sky-50 text-sky-700 border-sky-500'
 //           : 'border-transparent hover:bg-gray-50 hover:text-sky-700'
 //       }`}
 //     >
 //       {icon} {label}
 //     </button>
 //   )
 //   return (
 //     <Layout user={user} title="📊 التقارير الشاملة">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 📌 التبويبات */}
 //         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
 //           {tabButton('summary', 'الملخص العام', '📋')}
 //           {tabButton('sales', 'المبيعات', '💰')}
 //           {tabButton('inventory', 'المخزون', '📦')}
 //           {tabButton('profit', 'الأرباح', '📈')}
 //           {tabButton('users', 'المستخدمين', '👥')}
 //           {tabButton('system', 'النظام', '⚙️')}
 //         </div>
 //         {/* فلاتر */}
 //         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between bg-gradient-to-br from-sky-50 to-white">
 //           <div className="flex flex-wrap gap-2">
 //             <label>من:</label>
 //             <input
 //               type="date"
 //               className="px-3 py-2 border rounded-md"
 //               value={dateRange.from}
 //               onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
 //             />
 //             <label>إلى:</label>
 //             <input
 //               type="date"
 //               className="px-3 py-2 border rounded-md"
 //               value={dateRange.to}
 //               onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
 //             />
 //             <select
 //               className="px-3 py-2 border rounded-md"
 //               value={selectedUser}
 //               onChange={(e) => setSelectedUser(e.target.value)}
 //             >
 //               <option value="all">كل المستخدمين</option>
 //               {userStats.map(u => (
 //                 <option key={u.name} value={u.name}>{u.name}</option>
 //               ))}
 //             </select>
 //             <button
 //               onClick={handleFilter}
 //               className="px-4 py-2 text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //             >
 //               🔍 تطبيق
 //             </button>
 //           </div>
 //           <button
 //             onClick={printAllReports}
 //             className="px-4 py-2 text-white rounded-md bg-amber-600 hover:bg-amber-700"
 //           >
 //             🖨️ طباعة
 //           </button>
 //         </div>
 //         {/* المحتوى */}
 //         <motion.div ref={printRef} key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 //           {activeTab === 'summary' && (
 //             <SummaryTab
 //               sales={salesData}
 //               profit={profitData}
 //               inventory={inventoryData}
 //             />
 //           )}
 //           {activeTab === 'sales' && <SalesTab sales={salesData} />}
 //           {activeTab === 'inventory' && <InventoryTab inventory={inventoryData} />}
 //           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
 //           {activeTab === 'users' && <UsersTab userStats={userStats} />}
 //           {activeTab === 'system' && <SystemTab logs={logs} />}
 //         </motion.div>
 //       </div>
 //     </Layout>
 //   )
 // }
 // //
 // // --------------------------------------------------
 // //  🔽  التبويبات الفرعية — بدون تغيير تصميمك
 // // --------------------------------------------------
 // //
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white">
 //       <p className="text-sm text-gray-600">{title}</p>
 //       <h3 className={`text-xl font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
 // function SummaryTab({ sales, profit, inventory }) {
 //   const totalSales = sales.reduce((s, x) => s + x.total, 0)
 //   const totalProfit = profit.reduce((s, x) => s + x.profit, 0)
 //   const lowStock = inventory.filter(x => x.qty <= 3).length
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold">📋 الملخص العام</h3>
 //       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
 //         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
 //         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600" />
 //         <SummaryCard title="أدويه منخفضة" value={lowStock} color="text-red-600" />
 //         <SummaryCard title="عدد المنتجات" value={inventory.length} color="text-amber-600" />
 //       </div>
 //     </div>
 //   )
 // }
 // function SalesTab({ sales }) {
 //   const grouped = sales.reduce((acc, s) => {
 //     if (!acc[s.date]) acc[s.date] = []
 //     acc[s.date].push(s)
 //     return acc
 //   }, {})
 //   return (
 //     <div className="space-y-6">
 //       {Object.keys(grouped).map(day => {
 //         const list = grouped[day]
 //         const total = list.reduce((sum, x) => sum + x.total, 0)
 //         const qty = list.reduce((sum, x) => sum + x.qty, 0)
 //         return (
 //           <div key={day} className="p-4 bg-white border rounded-lg shadow-sm">
 //             <h3 className="font-bold text-sky-700">📅 {day}</h3>
 //             <div className="grid grid-cols-2 gap-4 my-3 sm:grid-cols-4">
 //               <SummaryCard title="عدد الأصناف" value={list.length} color="text-blue-600" />
 //               <SummaryCard title="إجمالي القطع" value={qty} color="text-green-600" />
 //               <SummaryCard title="إجمالي اليوم" value={`${total} ر.س`} color="text-sky-600" />
 //             </div>
 //             <table className="w-full text-sm border-t">
 //               <thead className="bg-gray-50">
 //                 <tr>
 //                   <th>المنتج</th>
 //                   <th>الكمية</th>
 //                   <th>السعر</th>
 //                   <th>الإجمالي</th>
 //                   <th>الكاشير</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {list.map((s, i) => (
 //                   <tr key={i} className="border-t hover:bg-gray-50">
 //                     <td>{s.name}</td>
 //                     <td>{s.qty}</td>
 //                     <td>{s.price}</td>
 //                     <td>{s.total}</td>
 //                     <td>{s.cashier}</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //           </div>
 //         )
 //       })}
 //     </div>
 //   )
 // }
 // function InventoryTab({ inventory }) {
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="mb-3 font-semibold">📦 المخزون</h3>
 //       <table className="w-full text-sm border-t">
 //         <thead className="bg-gray-50">
 //           <tr>
 //             <th>الدواء</th>
 //             <th>الكمية</th>
 //             <th>الانتهاء</th>
 //             <th>الحالة</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {inventory.map((item, i) => {
 //             const expired = new Date(item.expiry) < new Date()
 //             return (
 //               <tr key={i} className="border-t hover:bg-gray-50">
 //                 <td>{item.name}</td>
 //                 <td>{item.qty}</td>
 //                 <td>{item.expiry}</td>
 //                 <td>
 //                   {expired ? '❌ منتهي' : item.qty <= 3 ? '⚠️ منخفض' : '✔️ جيد'}
 //                 </td>
 //               </tr>
 //             )
 //           })}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // function ProfitTab({ profitData }) {
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="mb-4 font-semibold">📈 الأرباح</h3>
 //       <ResponsiveContainer width="100%" height={260}>
 //         <LineChart data={profitData}>
 //           <CartesianGrid strokeDasharray="3 3" />
 //           <XAxis dataKey="month" />
 //           <YAxis />
 //           <Tooltip />
 //           <Line dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
 //         </LineChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // function UsersTab({ userStats }) {
 //   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="font-semibold">👥 أداء المستخدمين</h3>
 //       <ResponsiveContainer width="100%" height={260}>
 //         <PieChart>
 //           <Pie
 //             data={userStats}
 //             dataKey="sales"
 //             nameKey="name"
 //             outerRadius={90}
 //             label
 //           >
 //             {userStats.map((_, i) => (
 //               <Cell key={i} fill={COLORS[i % 3]} />
 //             ))}
 //           </Pie>
 //           <Tooltip />
 //         </PieChart>
 //       </ResponsiveContainer>
 //       <table className="w-full text-sm border-t">
 //         <thead className="bg-gray-50">
 //           <tr>
 //             <th>المستخدم</th>
 //             <th>المبيعات</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {userStats.map((u, i) => (
 //             <tr key={i} className="border-t hover:bg-gray-50">
 //               <td>{u.name}</td>
 //               <td>{u.sales} ر.س</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // function SystemTab({ logs }) {
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="font-semibold">⚙️ سجل النظام</h3>
 //       <table className="w-full text-sm border-t">
 //         <thead className="bg-gray-50">
 //           <tr>
 //             <th>الوقت</th>
 //             <th>المستخدم</th>
 //             <th>الإجراء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {logs.map((l, i) => (
 //             <tr key={i} className="border-t hover:bg-gray-50">
 //               <td>{l.time}</td>
 //               <td>{l.user}</td>
 //               <td>{l.action}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // import { useState, useEffect, useRef } from 'react'
 // import { motion } from 'framer-motion'
 // import Layout from '../components/Layout'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // import {
 //   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
 //   PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar
 // } from 'recharts'
 // import ProfitReport from '../components/profitReport'
 // export default function Reports() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [activeTab, setActiveTab] = useState('summary')
 //   const [dateRange, setDateRange] = useState({ from: '', to: '' })
 //   const [selectedUser, setSelectedUser] = useState('all')
 //   const printRef = useRef(null)
 //   const [salesData, setSalesData] = useState([])
 //   const [inventoryData, setInventoryData] = useState([])
 //   const [profitData, setProfitData] = useState([])
 //   const [userStats, setUserStats] = useState([])
 //   const [logs, setLogs] = useState([])
 //   // 🔹 تحميل البيانات الأولية
 //   useEffect(() => {
 //     setSalesData([
 //       { id: 1, date: '2025-11-01', name: 'باراسيتامول 500mg', qty: 4, price: 15, cashier: 'أحمد' },
 //       { id: 2, date: '2025-11-01', name: 'فيتامين سي 1000mg', qty: 2, price: 25, cashier: 'محمد' },
 //       { id: 3, date: '2025-11-02', name: 'أموكسيسيلين 250mg', qty: 3, price: 45, cashier: 'أحمد' },
 //       { id: 4, date: '2025-11-02', name: 'ايبوبروفين 400mg', qty: 5, price: 30, cashier: 'مها' },
 //       { id: 5, date: '2025-11-03', name: 'فيتامين د', qty: 6, price: 20, cashier: 'أحمد' },
 //       { id: 6, date: '2025-11-03', name: 'كريم بانثينول', qty: 3, price: 40, cashier: 'محمد' },
 //     ])
 //     setInventoryData([
 //       { name: 'باراسيتامول', qty: 8, expiry: '2025-12-10' },
 //       { name: 'أموكسيسيلين', qty: 2, expiry: '2024-06-02' },
 //       { name: 'ايبوبروفين', qty: 6, expiry: '2025-08-10' },
 //     ])
 //     setProfitData([
 //       { month: 'أكتوبر', profit: 3200 },
 //       { month: 'نوفمبر', profit: 4800 },
 //       { month: 'ديسمبر', profit: 5100 },
 //     ])
 //     setUserStats([
 //       { name: 'محمد', sales: 1200 },
 //       { name: 'أحمد', sales: 1500 },
 //       { name: 'مها', sales: 800 },
 //     ])
 //     setLogs([
 //       { time: '10:15', user: 'أحمد', action: 'تسجيل دخول' },
 //       { time: '10:30', user: 'محمد', action: 'إضافة دواء جديد' },
 //       { time: '11:10', user: 'مها', action: 'تعديل صلاحيات مستخدم' },
 //     ])
 //   }, [])
 //   // 🔸 الفلترة
 //   const handleFilter = () => {
 //     toast.success(`✅ تم تطبيق الفلتر من ${dateRange.from || 'بداية الشهر'} إلى ${dateRange.to || 'اليوم'}`)
 //   }
 //   // 🔸 الطباعة
 //   const printAllReports = () => {
 //     const content = printRef.current.innerHTML
 //     const printWindow = window.open('', '_blank', 'width=900,height=700')
 //     printWindow.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير شامل</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
 //             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
 //             th { background: #f5f5f5; }
 //             h2 { text-align: center; color: #0ea5e9; }
 //           </style>
 //         </head>
 //         <body>${content}</body>
 //       </html>
 //     `)
 //     printWindow.document.close()
 //     printWindow.print()
 //   }
 //   // 🔹 التبويبات
 //   const tabButton = (key, label, icon) => (
 //     <button
 //       key={key}
 //       onClick={() => setActiveTab(key)}
 //       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
 //         activeTab === key
 //           ? 'text-sky-700 border-sky-500 bg-sky-50'
 //           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
 //       }`}
 //     >
 //       <span>{icon}</span> {label}
 //     </button>
 //   )
 //   return (
 //     <Layout user={user} title="📊 لوحة التقارير الشاملة">
 //       <div dir="rtl" className="space-y-6">
 //         {/* شريط التبويبات */}
 //         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
 //           {tabButton('summary', 'الملخص العام', '📋')}
 //           {tabButton('sales', 'المبيعات', '💰')}
 //           {tabButton('inventory', 'المخزون', '📦')}
 //           {tabButton('profit', 'الأرباح', '📈')}
 //           {tabButton('users', 'المستخدمين', '👥')}
 //           {tabButton('system', 'النظام', '⚙️')}
 //         </div>
 //         {/* شريط الفلاتر */}
 //         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
 //           <div className="flex flex-wrap items-center gap-2">
 //             <label className="text-sm text-gray-700">من:</label>
 //             <input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} className="px-3 py-2 text-sm border rounded-md" />
 //             <label className="text-sm text-gray-700">إلى:</label>
 //             <input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} className="px-3 py-2 text-sm border rounded-md" />
 //             <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
 //               <option value="all">كل المستخدمين</option>
 //               <option value="أحمد">أحمد</option>
 //               <option value="محمد">محمد</option>
 //               <option value="مها">مها</option>
 //             </select>
 //             <button onClick={handleFilter} className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700">
 //               🔍 تطبيق الفلتر
 //             </button>
 //           </div>
 //           <button onClick={printAllReports} className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700">
 //             🖨️ طباعة الكل
 //           </button>
 //         </div>
 //         {/* المحتوى */}
 //         <motion.div ref={printRef} key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
 //           {activeTab === 'summary' && <SummaryTab salesData={salesData} inventoryData={inventoryData} profitData={profitData} />}
 //           {activeTab === 'sales' && <DetailedSalesReport sales={salesData} />}
 //           {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
 //           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
 //           {activeTab === 'users' && <UsersTab userStats={userStats} />}
 //           {activeTab === 'system' && <SystemTab logs={logs} />}
 //         </motion.div>
 //       </div>
 //     </Layout>
 //   )
 // }
 // /* 📋 الملخص العام */
 // function SummaryTab({ salesData, inventoryData, profitData }) {
 //   const totalSales = salesData.reduce((s, x) => s + x.qty * x.price, 0)
 //   const lowStock = inventoryData.filter((x) => x.qty <= 3).length
 //   const totalProfit = profitData.reduce((s, x) => s + x.profit, 0)
 //   return (
 //     <div className="p-6 space-y-6 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📋 ملخص الصيدلية العام</h3>
 //       <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
 //         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
 //         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600" />
 //         <SummaryCard title="المنتجات المنخفضة" value={lowStock} color="text-red-600" />
 //         <SummaryCard title="عدد المنتجات" value={inventoryData.length} color="text-amber-600" />
 //       </div>
 //       <ResponsiveContainer width="100%" height={260}>
 //         <BarChart data={salesData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="date" />
 //           <YAxis />
 //           <Tooltip />
 //           <Bar dataKey="qty" fill={theme.colors.primary} />
 //         </BarChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* 💰 تقرير المبيعات المفصل */
 // function DetailedSalesReport({ sales }) {
 //   const grouped = sales.reduce((acc, s) => {
 //     if (!acc[s.date]) acc[s.date] = []
 //     acc[s.date].push(s)
 //     return acc
 //   }, {})
 //   return (
 //     <div dir="rtl" className="space-y-6">
 //       {Object.keys(grouped).map((day) => {
 //         const list = grouped[day]
 //         const total = list.reduce((sum, s) => sum + s.qty * s.price, 0)
 //         const totalQty = list.reduce((sum, s) => sum + s.qty, 0)
 //         const cashiers = [...new Set(list.map((s) => s.cashier))].join(', ')
 //         return (
 //           <div key={day} className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //             <div className="flex flex-col md:flex-row md:justify-between md:items-center">
 //               <h3 className="text-lg font-semibold text-gray-800">
 //                 📅 مبيعات يوم <span className="text-sky-600">{day}</span>
 //               </h3>
 //             </div>
 //             <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
 //               <SummaryCard title="عدد الأصناف" value={list.length} color="text-blue-600" />
 //               <SummaryCard title="إجمالي القطع" value={totalQty} color="text-green-600" />
 //               <SummaryCard title="إجمالي اليوم" value={`${total} ر.س`} color="text-sky-600" />
 //               <SummaryCard title="الكاشيرين" value={cashiers} color="text-amber-600" />
 //             </div>
 //             <table className="w-full text-sm text-right border-t border-gray-100">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">#</th>
 //                   <th className="px-3 py-2">المنتج</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                   <th className="px-3 py-2">الكاشير</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {list.map((s, i) => (
 //                   <tr key={s.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{i + 1}</td>
 //                     <td className="px-3 py-2">{s.name}</td>
 //                     <td className="px-3 py-2">{s.qty}</td>
 //                     <td className="px-3 py-2">{s.price} ر.س</td>
 //                     <td className="px-3 py-2 font-semibold text-sky-700">{s.qty * s.price} ر.س</td>
 //                     <td className="px-3 py-2">{s.cashier}</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //           </div>
 //         )
 //       })}
 //     </div>
 //   )
 // }
 // /* 📦 المخزون */
 // /* ------------------------ 📦 تقرير المخزون ------------------------ */
 // function InventoryTab({ inventoryData }) {
 //   const [sortKey, setSortKey] = useState('name')
 //   const [sortDir, setSortDir] = useState('asc')
 //   // 🔹 ترتيب المخزون حسب العمود المحدد
 //   const sortedData = [...inventoryData].sort((a, b) => {
 //     if (sortKey === 'qty') {
 //       return sortDir === 'asc' ? a.qty - b.qty : b.qty - a.qty
 //     } else if (sortKey === 'expiry') {
 //       return sortDir === 'asc'
 //         ? new Date(a.expiry) - new Date(b.expiry)
 //         : new Date(b.expiry) - new Date(a.expiry)
 //     } else {
 //       return sortDir === 'asc'
 //         ? a.name.localeCompare(b.name, 'ar')
 //         : b.name.localeCompare(a.name, 'ar')
 //     }
 //   })
 //   // 🔸 عناوين الأعمدة
 //   const headerCell = (label, key) => (
 //     <th
 //       onClick={() => {
 //         if (sortKey === key) {
 //           setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
 //         } else {
 //           setSortKey(key)
 //           setSortDir('asc')
 //         }
 //       }}
 //       className="px-3 py-2 cursor-pointer hover:bg-gray-100"
 //     >
 //       {label} {sortKey === key ? (sortDir === 'asc' ? '⬆️' : '⬇️') : ''}
 //     </th>
 //   )
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <div className="flex flex-col md:flex-row md:justify-between md:items-center">
 //         <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون الحالي</h3>
 //         <p className="text-sm text-gray-500">إجمالي الأصناف: {inventoryData.length}</p>
 //       </div>
 //       <div className="overflow-x-auto">
 //         <table className="w-full text-sm text-right border-t border-gray-100">
 //           <thead className="text-gray-600 bg-gray-50">
 //             <tr>
 //               {headerCell('اسم الدواء', 'name')}
 //               {headerCell('الكمية', 'qty')}
 //               {headerCell('تاريخ الانتهاء', 'expiry')}
 //               <th className="px-3 py-2">الحالة</th>
 //             </tr>
 //           </thead>
 //           <tbody>
 //             {sortedData.map((item, idx) => {
 //               const isLow = item.qty <= 3
 //               const isExpired = new Date(item.expiry) < new Date()
 //               const isNearExpiry = new Date(item.expiry) - new Date() < 30 * 24 * 60 * 60 * 1000 // أقل من 30 يومًا
 //               return (
 //                 <tr key={idx} className="transition border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2 font-medium text-gray-700">{item.name}</td>
 //                   <td className={`px-3 py-2 ${isLow ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
 //                     {item.qty}
 //                   </td>
 //                   <td className={`px-3 py-2 ${isExpired ? 'text-red-600' : isNearExpiry ? 'text-amber-600' : ''}`}>
 //                     {item.expiry}
 //                   </td>
 //                   <td className="px-3 py-2">
 //                     {isExpired
 //                       ? '❌ منتهي الصلاحية'
 //                       : isLow
 //                       ? '⚠️ مخزون منخفض'
 //                       : isNearExpiry
 //                       ? '⏰ قرب الانتهاء'
 //                       : '✅ صالح'}
 //                   </td>
 //                 </tr>
 //               )
 //             })}
 //           </tbody>
 //         </table>
 //       </div>
 //     </div>
 //   )
 // }
 // function ProfitTab({ profitData }) {
 //   const [sortKey, setSortKey] = useState('month'); // فرز البيانات حسب الشهر أو الأرباح
 //   const [sortDir, setSortDir] = useState('asc');  // ترتيب البيانات تصاعدي أو تنازلي
 //   // 🔹 ترتيب الأرباح حسب العمود المحدد
 //   const sortedData = [...profitData].sort((a, b) => {
 //     if (sortKey === 'profit') {
 //       return sortDir === 'asc' ? a.profit - b.profit : b.profit - a.profit;
 //     } else {
 //       return sortDir === 'asc'
 //         ? a.month.localeCompare(b.month)  // فرز تصاعدي حسب الشهر
 //         : b.month.localeCompare(a.month); // فرز تنازلي حسب الشهر
 //     }
 //   });
 //   // 🔸 عناوين الأعمدة
 //   const headerCell = (label, key) => (
 //     <th
 //       onClick={() => {
 //         if (sortKey === key) {
 //           setSortDir(sortDir === 'asc' ? 'desc' : 'asc');  // التبديل بين الترتيب التصاعدي والتنازلي
 //         } else {
 //           setSortKey(key);
 //           setSortDir('asc');
 //         }
 //       }}
 //       className="px-3 py-2 cursor-pointer hover:bg-gray-100"
 //     >
 //       {label} {sortKey === key ? (sortDir === 'asc' ? '⬆️' : '⬇️') : ''}
 //     </th>
 //   );
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📈 تقرير الأرباح الشهرية</h3>
 //       <div className="overflow-x-auto">
 //         <table className="w-full text-sm text-right border-t border-gray-100">
 //           <thead className="text-gray-600 bg-gray-50">
 //             <tr>
 //               {headerCell('الشهر', 'month')}
 //               {headerCell('الأرباح', 'profit')}
 //             </tr>
 //           </thead>
 //           <tbody>
 //             {sortedData.map((item, idx) => (
 //               <tr key={idx} className="border-t hover:bg-gray-50">
 //                 <td className="px-3 py-2">{item.month}</td>
 //                 <td className="px-3 py-2">{item.profit} ر.س</td>
 //               </tr>
 //             ))}
 //           </tbody>
 //         </table>
 //       </div>
 //       {/* عرض الرسم البياني للأرباح الشهرية */}
 //       <ResponsiveContainer width="100%" height={300}>
 //         <LineChart data={sortedData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="month" />
 //           <YAxis />
 //           <Tooltip />
 //           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
 //         </LineChart>
 //       </ResponsiveContainer>
 //     </div>
 //   );
 // }
 // /* 👥 المستخدمين */
 // function UsersTab({ userStats }) {
 //   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']; // ألوان مخصصة للمخطط
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="mb-3 text-lg font-semibold text-gray-800">👥 أداء المستخدمين</h3>
 //       {/* رسم بياني لتمثيل أداء المستخدمين */}
 //       <ResponsiveContainer width="100%" height={260}>
 //         <PieChart>
 //           <Pie
 //             data={userStats}
 //             dataKey="sales"
 //             nameKey="name"
 //             cx="50%"
 //             cy="50%"
 //             outerRadius={90}
 //             label
 //           >
 //             {userStats.map((_, i) => (
 //               <Cell key={i} fill={COLORS[i % COLORS.length]} />
 //             ))}
 //           </Pie>
 //           <Tooltip />
 //         </PieChart>
 //       </ResponsiveContainer>
 //       {/* جدول لأداء المستخدمين */}
 //       <div className="mt-6">
 //         <table className="w-full text-sm text-right border-t border-gray-100">
 //           <thead className="text-gray-600 bg-gray-50">
 //             <tr>
 //               <th className="px-3 py-2">#</th>
 //               <th className="px-3 py-2">اسم المستخدم</th>
 //               <th className="px-3 py-2">إجمالي المبيعات</th>
 //             </tr>
 //           </thead>
 //           <tbody>
 //             {userStats.map((user, idx) => (
 //               <tr key={idx} className="border-t hover:bg-gray-50">
 //                 <td className="px-3 py-2">{idx + 1}</td>
 //                 <td className="px-3 py-2">{user.name}</td>
 //                 <td className="px-3 py-2">{user.sales} ر.س</td>
 //               </tr>
 //             ))}
 //           </tbody>
 //         </table>
 //       </div>
 //     </div>
 //   );
 // }
 // /* ⚙️ النظام */
 // function SystemTab({ logs }) {
 //   return (
 //     <div className="p-5 bg-white border rounded-lg shadow-sm">
 //       <h3 className="mb-3 text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
 //       <table className="w-full text-sm text-right border-t border-gray-100">
 //         <thead className="text-gray-600 bg-gray-50">
 //           <tr>
 //             <th className="px-3 py-2">الوقت</th>
 //             <th className="px-3 py-2">المستخدم</th>
 //             <th className="px-3 py-2">الإجراء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {logs.map((log, idx) => (
 //             <tr key={idx} className="border-t hover:bg-gray-50">
 //               <td className="px-3 py-2">{log.time}</td>
 //               <td className="px-3 py-2">{log.user}</td>
 //               <td className="px-3 py-2">{log.action}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* 🧩 بطاقة */
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center transition border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white hover:shadow-md">
 //       <p className="text-sm text-gray-500">{title}</p>
 //       <h3 className={`text-lg font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
 // import { useState, useEffect, useRef } from 'react'
 // import Layout from '../components/Layout'
 // import SalesReport from './SalesReport'
 // import ProfitReport from './ProfitReport'
 // import InventoryReport from './InventoryReport'
 // import toast from 'react-hot-toast'
 // export default function Reports() {
 //   const [activeTab, setActiveTab] = useState('sales')
 //   const [salesData, setSalesData] = useState([])
 //   const [profitData, setProfitData] = useState([])
 //   const [inventoryData, setInventoryData] = useState([])
 //   const [dateRange, setDateRange] = useState({ from: '', to: '' })
 //   const [selectedUser, setSelectedUser] = useState('all')
 //   const printRef = useRef(null)
 //   // 🔹 تحميل البيانات الأولية
 //   useEffect(() => {
 //     setSalesData([
 //       { id: 1, date: '2025-11-01', product: 'باراسيتامول', qty: 10, total: 100 },
 //       { id: 2, date: '2025-11-02', product: 'أموكسيسيلين', qty: 5, total: 50 },
 //     ])
 //     setProfitData([
 //       { month: 'نوفمبر', revenue: 5000, expenses: 2000, profit: 3000 },
 //     ])
 //     setInventoryData([
 //       { name: 'باراسيتامول', qty: 50, expiry: '2025-12-10' },
 //       { name: 'أموكسيسيلين', qty: 30, expiry: '2024-05-15' },
 //     ])
 //   }, [])
 //   // 🔸 الفلترة
 //   const handleFilter = () => {
 //     toast.success(`✅ تم تطبيق الفلتر من ${dateRange.from || 'بداية الشهر'} إلى ${dateRange.to || 'اليوم'}`)
 //   }
 //   // 🔸 الطباعة
 //   const printAllReports = () => {
 //     const content = printRef.current.innerHTML
 //     const printWindow = window.open('', '_blank', 'width=900,height=700')
 //     printWindow.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير شامل</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
 //             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
 //             th { background: #f5f5f5; }
 //             h2 { text-align: center; color: #0ea5e9; }
 //           </style>
 //         </head>
 //         <body>${content}</body>
 //       </html>
 //     `)
 //     printWindow.document.close()
 //     printWindow.print()
 //   }
 //   // 🔹 التبويبات
 //   const tabButton = (key, label, icon) => (
 //     <button
 //       key={key}
 //       onClick={() => setActiveTab(key)}
 //       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
 //         activeTab === key
 //           ? 'text-sky-700 border-sky-500 bg-sky-50'
 //           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
 //       }`}
 //     >
 //       <span>{icon}</span> {label}
 //     </button>
 //   )
 //   return (
 //     <Layout user={{ name: 'المدير أحمد', role: 'admin' }} title="📊 لوحة التقارير الشاملة">
 //       <div dir="rtl" className="space-y-6">
 //         {/* شريط التبويبات */}
 //         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
 //           {tabButton('summary', 'الملخص العام', '📋')}
 //           {tabButton('sales', 'المبيعات', '💰')}
 //           {tabButton('inventory', 'المخزون', '📦')}
 //           {tabButton('profit', 'الأرباح', '📈')}
 //           {tabButton('users', 'المستخدمين', '👥')}
 //           {tabButton('system', 'النظام', '⚙️')}
 //         </div>
 //         {/* شريط الفلاتر */}
 //         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
 //           <div className="flex flex-wrap items-center gap-2">
 //             <label className="text-sm text-gray-700">من:</label>
 //             <input
 //               type="date"
 //               value={dateRange.from}
 //               onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             />
 //             <label className="text-sm text-gray-700">إلى:</label>
 //             <input
 //               type="date"
 //               value={dateRange.to}
 //               onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             />
 //             <select
 //               value={selectedUser}
 //               onChange={(e) => setSelectedUser(e.target.value)}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             >
 //               <option value="all">كل المستخدمين</option>
 //               <option value="أحمد">أحمد</option>
 //               <option value="محمد">محمد</option>
 //               <option value="مها">مها</option>
 //             </select>
 //             <button
 //               onClick={handleFilter}
 //               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
 //             >
 //               🔍 تطبيق الفلتر
 //             </button>
 //           </div>
 //           <button
 //             onClick={printAllReports}
 //             className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700"
 //           >
 //             🖨️ طباعة الكل
 //           </button>
 //         </div>
 //         {/* المحتوى */}
 //         <motion.div
 //           ref={printRef}
 //           key={activeTab}
 //           initial={{ opacity: 0 }}
 //           animate={{ opacity: 1 }}
 //           transition={{ duration: 0.3 }}
 //         >
 //           {activeTab === 'summary' && <SummaryTab salesData={salesData} inventoryData={inventoryData} profitData={profitData} />}
 //           {activeTab === 'sales' && <SalesTab salesData={salesData} />}
 //           {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
 //           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
 //           {activeTab === 'users' && <UsersTab userStats={userStats} />}
 //           {activeTab === 'system' && <SystemTab logs={logs} />}
 //         </motion.div>
 //       </div>
 //     </Layout>
 //   )
 // }
 // // 📋 الملخص العام
 // function SummaryTab({ salesData, inventoryData, profitData }) {
 //   const totalSales = salesData.reduce((s, x) => s + x.qty * x.price, 0)
 //   const lowStock = inventoryData.filter((x) => x.qty <= 3).length
 //   const totalProfit = profitData.reduce((s, x) => s + x.profit, 0)
 //   return (
 //     <div className="p-6 space-y-6 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📋 ملخص الصيدلية العام</h3>
 //       <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
 //         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
 //         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600" />
 //         <SummaryCard title="المنتجات المنخفضة" value={lowStock} color="text-red-600" />
 //         <SummaryCard title="عدد المنتجات" value={inventoryData.length} color="text-amber-600" />
 //       </div>
 //       <ResponsiveContainer width="100%" height={260}>
 //         <BarChart data={salesData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="date" />
 //           <YAxis />
 //           <Tooltip />
 //           <Bar dataKey="qty" fill={theme.colors.primary} />
 //         </BarChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // // 💰 تقرير المبيعات
 // function SalesTab({ salesData }) {
 //   const totalSales = salesData.reduce((sum, s) => sum + s.total, 0)
 //   const avg = (totalSales / salesData.length).toFixed(2)
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">💰 تقرير المبيعات</h3>
 //       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
 //         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
 //         <SummaryCard title="عدد العمليات" value={salesData.length} color="text-blue-600" />
 //         <SummaryCard title="متوسط المبيعات" value={`${avg} ر.س`} color="text-green-600" />
 //         <SummaryCard title="أعلى مبيعات" value="أحمد" color="text-amber-600" />
 //       </div>
 //       <ResponsiveContainer width="100%" height={250}>
 //         <LineChart data={salesData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="date" />
 //           <YAxis />
 //           <Tooltip />
 //           <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
 //         </LineChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // // 📦 تقرير المخزون
 // function InventoryTab({ inventoryData }) {
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون</h3>
 //       <table className="w-full text-sm text-right border-t border-gray-100">
 //         <thead className="text-gray-600 bg-gray-50">
 //           <tr>
 //             <th className="px-3 py-2">اسم الدواء</th>
 //             <th className="px-3 py-2">الكمية</th>
 //             <th className="px-3 py-2">تاريخ الانتهاء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {inventoryData.map((i, idx) => (
 //             <tr key={idx} className="border-t hover:bg-gray-50">
 //               <td className="px-3 py-2">{i.name}</td>
 //               <td className={`px-3 py-2 ${i.qty <= 3 ? 'text-red-600' : 'text-green-700'}`}>{i.qty}</td>
 //               <td className="px-3 py-2">{i.expiry}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // // 📈 تقرير الأرباح
 // function ProfitTab({ profitData }) {
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📈 تقرير الأرباح</h3>
 //       <ResponsiveContainer width="100%" height={250}>
 //         <LineChart data={profitData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="month" />
 //           <YAxis />
 //           <Tooltip />
 //           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
 //         </LineChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // // 👥 تقرير المستخدمين
 // function UsersTab({ userStats }) {
 //   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="mb-3 text-lg font-semibold text-gray-800">👥 أداء المستخدمين</h3>
 //       <ResponsiveContainer width="100%" height={250}>
 //         <PieChart>
 //           <Pie data={userStats} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
 //             {userStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
 //           </Pie>
 //           <Tooltip />
 //         </PieChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // // ⚙️ سجل النظام
 // function SystemTab({ logs }) {
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
 //       <table className="w-full text-sm text-right border-t border-gray-100">
 //         <thead className="text-gray-600 bg-gray-50">
 //           <tr>
 //             <th className="px-3 py-2">الوقت</th>
 //             <th className="px-3 py-2">المستخدم</th>
 //             <th className="px-3 py-2">الإجراء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {logs.map((log, idx) => (
 //             <tr key={idx} className="border-t hover:bg-gray-50">
 //               <td className="px-3 py-2">{log.time}</td>
 //               <td className="px-3 py-2">{log.user}</td>
 //               <td className="px-3 py-2">{log.action}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // // 🧩 بطاقة الملخص
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center transition border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white hover:shadow-md">
 //       <p className="text-sm text-gray-500">{title}</p>
 //       <h3 className={`text-lg font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
 // import { useState, useEffect, useRef } from 'react'
 // import { motion } from 'framer-motion'
 // import Layout from '../components/Layout'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // import {
 //   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
 //   PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar
 // } from 'recharts'
 // export default function Reports() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [activeTab, setActiveTab] = useState('summary')
 //   const [dateRange, setDateRange] = useState({ from: '', to: '' })
 //   const [selectedUser, setSelectedUser] = useState('all')
 //   const printRef = useRef(null)
 //   const [salesData, setSalesData] = useState([])
 //   const [inventoryData, setInventoryData] = useState([])
 //   const [profitData, setProfitData] = useState([])
 //   const [userStats, setUserStats] = useState([])
 //   const [logs, setLogs] = useState([])
 //   // بيانات أولية
 //   useEffect(() => {
 //     setSalesData([
 //       { id: 1, date: '2025-11-01', name: 'باراسيتامول 500mg', qty: 4, price: 15, cashier: 'أحمد' },
 //       { id: 2, date: '2025-11-01', name: 'فيتامين سي 1000mg', qty: 2, price: 25, cashier: 'محمد' },
 //       { id: 3, date: '2025-11-02', name: 'أموكسيسيلين 250mg', qty: 3, price: 45, cashier: 'أحمد' },
 //       { id: 4, date: '2025-11-02', name: 'ايبوبروفين 400mg', qty: 5, price: 30, cashier: 'مها' },
 //       { id: 5, date: '2025-11-03', name: 'فيتامين د', qty: 6, price: 20, cashier: 'أحمد' },
 //       { id: 6, date: '2025-11-03', name: 'كريم بانثينول', qty: 3, price: 40, cashier: 'محمد' },
 //     ])
 //     setInventoryData([
 //       { name: 'باراسيتامول', qty: 8, expiry: '2025-12-10' },
 //       { name: 'أموكسيسيلين', qty: 2, expiry: '2024-06-02' },
 //       { name: 'ايبوبروفين', qty: 6, expiry: '2025-08-10' },
 //     ])
 //     setProfitData([
 //       { month: 'أكتوبر', profit: 3200 },
 //       { month: 'نوفمبر', profit: 4800 },
 //       { month: 'ديسمبر', profit: 5100 },
 //     ])
 //     setUserStats([
 //       { name: 'محمد', sales: 1200 },
 //       { name: 'أحمد', sales: 1500 },
 //       { name: 'مها', sales: 800 },
 //     ])
 //     setLogs([
 //       { time: '10:15', user: 'أحمد', action: 'تسجيل دخول' },
 //       { time: '10:30', user: 'محمد', action: 'إضافة دواء جديد' },
 //       { time: '11:10', user: 'مها', action: 'تعديل صلاحيات مستخدم' },
 //     ])
 //   }, [])
 //   const handleFilter = () => {
 //     toast.success(`✅ تم تطبيق الفلتر من ${dateRange.from || 'بداية الشهر'} إلى ${dateRange.to || 'اليوم'}`)
 //   }
 //   const printAllReports = () => {
 //     const content = printRef.current.innerHTML
 //     const printWindow = window.open('', '_blank', 'width=900,height=700')
 //     printWindow.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير شامل</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
 //             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
 //             th { background: #f5f5f5; }
 //             h2 { text-align: center; color: #0ea5e9; }
 //           </style>
 //         </head>
 //         <body>${content}</body>
 //       </html>
 //     `)
 //     printWindow.document.close()
 //     printWindow.print()
 //   }
 //   const tabButton = (key, label, icon) => (
 //     <button
 //       key={key}
 //       onClick={() => setActiveTab(key)}
 //       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
 //         activeTab === key
 //           ? 'text-sky-700 border-sky-500 bg-sky-50'
 //           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
 //       }`}
 //     >
 //       <span>{icon}</span> {label}
 //     </button>
 //   )
 //   return (
 //     <Layout user={user} title="📊 لوحة التقارير الشاملة">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 🔹 شريط التبويبات */}
 //         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
 //           {tabButton('summary', 'الملخص العام', '📋')}
 //           {tabButton('sales', 'المبيعات', '💰')}
 //           {tabButton('inventory', 'المخزون', '📦')}
 //           {tabButton('profit', 'الأرباح', '📈')}
 //           {tabButton('users', 'المستخدمين', '👥')}
 //           {tabButton('system', 'النظام', '⚙️')}
 //         </div>
 //         {/* 🔸 شريط الفلاتر + طباعة الكل */}
 //         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
 //           <div className="flex flex-wrap items-center gap-2">
 //             <label className="text-sm text-gray-700">من:</label>
 //             <input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} className="px-3 py-2 text-sm border rounded-md" />
 //             <label className="text-sm text-gray-700">إلى:</label>
 //             <input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} className="px-3 py-2 text-sm border rounded-md" />
 //             <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="px-3 py-2 text-sm border rounded-md">
 //               <option value="all">كل المستخدمين</option>
 //               <option value="أحمد">أحمد</option>
 //               <option value="محمد">محمد</option>
 //               <option value="مها">مها</option>
 //             </select>
 //             <button onClick={handleFilter} className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700">🔍 تطبيق الفلتر</button>
 //           </div>
 //           <button onClick={printAllReports} className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700">
 //             🖨️ طباعة الكل
 //           </button>
 //         </div>
 //         {/* 🔻 المحتوى المتغير حسب التبويب */}
 //         <motion.div ref={printRef} key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
 //           {activeTab === 'summary' && <SummaryTab salesData={salesData} inventoryData={inventoryData} profitData={profitData} />}
 //           {activeTab === 'sales' && <DetailedSalesReport sales={salesData} />}
 //           {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
 //           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
 //           {activeTab === 'users' && <UsersTab userStats={userStats} />}
 //           {activeTab === 'system' && <SystemTab logs={logs} />}
 //         </motion.div>
 //       </div>
 //     </Layout>
 //   )
 // }
 // /* 💰 تقرير المبيعات المفصل */
 // function DetailedSalesReport({ sales }) {
 //   const grouped = sales.reduce((acc, s) => {
 //     if (!acc[s.date]) acc[s.date] = []
 //     acc[s.date].push(s)
 //     return acc
 //   }, {})
 //   const handlePrintDay = (day) => {
 //     const content = document.getElementById(`day-${day}`).innerHTML
 //     const printWindow = window.open('', '_blank', 'width=800,height=600')
 //     printWindow.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head><title>تقرير المبيعات - ${day}</title></head>
 //         <body>${content}</body>
 //       </html>
 //     `)
 //     printWindow.document.close()
 //     printWindow.print()
 //   }
 //   return (
 //     <div dir="rtl" className="space-y-6">
 //       {Object.keys(grouped).map((day) => {
 //         const list = grouped[day]
 //         const total = list.reduce((sum, s) => sum + s.qty * s.price, 0)
 //         const totalQty = list.reduce((sum, s) => sum + s.qty, 0)
 //         const cashiers = [...new Set(list.map((s) => s.cashier))].join(', ')
 //         return (
 //           <div key={day} id={`day-${day}`} className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //             <div className="flex flex-col md:flex-row md:justify-between md:items-center">
 //               <h3 className="text-lg font-semibold text-gray-800">
 //                 📅 مبيعات يوم <span className="text-sky-600">{day}</span>
 //               </h3>
 //               <button onClick={() => handlePrintDay(day)} className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700">
 //                 🖨️ طباعة هذا اليوم
 //               </button>
 //             </div>
 //             <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
 //               <SummaryCard title="عدد الأصناف" value={list.length} color="text-blue-600" />
 //               <SummaryCard title="إجمالي القطع" value={totalQty} color="text-green-600" />
 //               <SummaryCard title="إجمالي اليوم" value={`${total} ر.س`} color="text-sky-600" />
 //               <SummaryCard title="الكاشيرين" value={cashiers} color="text-amber-600" />
 //             </div>
 //             <table className="w-full text-sm text-right border-t border-gray-100">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">#</th>
 //                   <th className="px-3 py-2">المنتج</th>
 //                   <th className="px-3 py-2">الكمية</th>
 //                   <th className="px-3 py-2">السعر</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                   <th className="px-3 py-2">الكاشير</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {list.map((s, i) => (
 //                   <tr key={s.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{i + 1}</td>
 //                     <td className="px-3 py-2">{s.name}</td>
 //                     <td className="px-3 py-2">{s.qty}</td>
 //                     <td className="px-3 py-2">{s.price} ر.س</td>
 //                     <td className="px-3 py-2 font-semibold text-sky-700">{s.qty * s.price} ر.س</td>
 //                     <td className="px-3 py-2">{s.cashier}</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //           </div>
 //         )
 //       })}
 //     </div>
 //   )
 // }
 // /* باقي التبويبات */
 // function SummaryTab({ salesData, inventoryData, profitData }) { /* ... */ }
 // function InventoryTab({ inventoryData }) { /* ... */ }
 // function ProfitTab({ profitData }) { /* ... */ }
 // function UsersTab({ userStats }) { /* ... */ }
 // function SystemTab({ logs }) { /* ... */ }
 // function SummaryCard({ title, value, color }) { /* ... */ }
 // import { useState, useEffect, useRef } from 'react'
 // import { motion } from 'framer-motion'
 // import Layout from '../components/Layout'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // import {
 //   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
 //   PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar
 // } from 'recharts'
 // export default function Reports() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [activeTab, setActiveTab] = useState('summary')
 //   const [dateRange, setDateRange] = useState({ from: '', to: '' })
 //   const [selectedUser, setSelectedUser] = useState('all')
 //   const printRef = useRef(null)
 //   const [salesData, setSalesData] = useState([])
 //   const [inventoryData, setInventoryData] = useState([])
 //   const [profitData, setProfitData] = useState([])
 //   const [userStats, setUserStats] = useState([])
 //   const [logs, setLogs] = useState([])
 //   useEffect(() => {
 //     setSalesData([
 //       { date: '2025-11-01', total: 320, cashier: 'أحمد' },
 //       { date: '2025-11-02', total: 410, cashier: 'محمد' },
 //       { date: '2025-11-03', total: 380, cashier: 'مها' },
 //     ])
 //     setInventoryData([
 //       { name: 'باراسيتامول', qty: 8, expiry: '2025-12-10' },
 //       { name: 'أموكسيسيلين', qty: 2, expiry: '2024-06-02' },
 //       { name: 'ايبوبروفين', qty: 6, expiry: '2025-08-10' },
 //     ])
 //     setProfitData([
 //       { month: 'أكتوبر', profit: 3200 },
 //       { month: 'نوفمبر', profit: 4800 },
 //       { month: 'ديسمبر', profit: 5100 },
 //     ])
 //     setUserStats([
 //       { name: 'محمد', sales: 1200 },
 //       { name: 'أحمد', sales: 1500 },
 //       { name: 'مها', sales: 800 },
 //     ])
 //     setLogs([
 //       { time: '10:15', user: 'أحمد', action: 'تسجيل دخول' },
 //       { time: '10:30', user: 'محمد', action: 'إضافة دواء جديد' },
 //       { time: '11:10', user: 'مها', action: 'تعديل صلاحيات مستخدم' },
 //     ])
 //   }, [])
 //   const handleFilter = () => {
 //     toast.success(`✅ تم تطبيق الفلتر من ${dateRange.from || 'بداية الشهر'} إلى ${dateRange.to || 'اليوم'}`)
 //   }
 //   const printCurrentReport = () => {
 //     const content = printRef.current.innerHTML
 //     const printWindow = window.open('', '_blank', 'width=800,height=600')
 //     printWindow.document.write(`
 //       <html dir="rtl" lang="ar">
 //         <head>
 //           <title>تقرير ${activeTab}</title>
 //           <style>
 //             body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
 //             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
 //             th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
 //             th { background: #f5f5f5; }
 //             h2 { text-align: center; color: #0ea5e9; }
 //           </style>
 //         </head>
 //         <body>${content}</body>
 //       </html>
 //     `)
 //     printWindow.document.close()
 //     printWindow.print()
 //   }
 //   const tabButton = (key, label, icon) => (
 //     <button
 //       key={key}
 //       onClick={() => setActiveTab(key)}
 //       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
 //         activeTab === key
 //           ? 'text-sky-700 border-sky-500 bg-sky-50'
 //           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
 //       }`}
 //     >
 //       <span>{icon}</span> {label}
 //     </button>
 //   )
 //   return (
 //     <Layout user={user} title="📊 لوحة التقارير الشاملة">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 🔹 شريط التبويبات */}
 //         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
 //           {tabButton('summary', 'الملخص العام', '📋')}
 //           {tabButton('sales', 'المبيعات', '💰')}
 //           {tabButton('inventory', 'المخزون', '📦')}
 //           {tabButton('profit', 'الأرباح', '📈')}
 //           {tabButton('users', 'المستخدمين', '👥')}
 //           {tabButton('system', 'النظام', '⚙️')}
 //         </div>
 //         {/* 🔸 شريط الفلاتر */}
 //         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
 //           <div className="flex flex-wrap items-center gap-2">
 //             <label className="text-sm text-gray-700">من:</label>
 //             <input
 //               type="date"
 //               value={dateRange.from}
 //               onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             />
 //             <label className="text-sm text-gray-700">إلى:</label>
 //             <input
 //               type="date"
 //               value={dateRange.to}
 //               onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             />
 //             <select
 //               value={selectedUser}
 //               onChange={(e) => setSelectedUser(e.target.value)}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             >
 //               <option value="all">كل المستخدمين</option>
 //               <option value="أحمد">أحمد</option>
 //               <option value="محمد">محمد</option>
 //               <option value="مها">مها</option>
 //             </select>
 //             <button
 //               onClick={handleFilter}
 //               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
 //             >
 //               🔍 تطبيق الفلتر
 //             </button>
 //           </div>
 //           <div className="flex justify-end gap-2">
 //             <button onClick={printCurrentReport} className="px-4 py-2 text-sm text-white rounded-md bg-amber-600 hover:bg-amber-700">
 //               🖨️ طباعة التقرير الحالي
 //             </button>
 //             <button onClick={() => toast.success('📄 تم تصدير PDF')} className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700">
 //               📄 PDF
 //             </button>
 //             <button onClick={() => toast.success('📊 تم تصدير Excel')} className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">
 //               📊 Excel
 //             </button>
 //           </div>
 //         </div>
 //         {/* 🔻 المحتوى المتغير حسب التبويب */}
 //         <motion.div
 //           ref={printRef}
 //           key={activeTab}
 //           initial={{ opacity: 0 }}
 //           animate={{ opacity: 1 }}
 //           transition={{ duration: 0.3 }}
 //         >
 //           {activeTab === 'summary' && <SummaryTab salesData={salesData} inventoryData={inventoryData} profitData={profitData} />}
 //           {activeTab === 'sales' && <SalesTab salesData={salesData} />}
 //           {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
 //           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
 //           {activeTab === 'users' && <UsersTab userStats={userStats} />}
 //           {activeTab === 'system' && <SystemTab logs={logs} />}
 //         </motion.div>
 //       </div>
 //     </Layout>
 //   )
 // }
 // /* ------------------------ 📋 تبويب الملخص العام ------------------------ */
 // function SummaryTab({ salesData, inventoryData, profitData }) {
 //   const totalSales = salesData.reduce((s, x) => s + x.total, 0)
 //   const lowStock = inventoryData.filter((x) => x.qty <= 3).length
 //   const totalProfit = profitData.reduce((s, x) => s + x.profit, 0)
 //   return (
 //     <div className="p-5 space-y-6 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📋 ملخص الصيدلية</h3>
 //       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
 //         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
 //         <SummaryCard title="إجمالي الأرباح" value={`${totalProfit} ر.س`} color="text-green-600" />
 //         <SummaryCard title="الأدوية منخفضة" value={lowStock} color="text-red-600" />
 //         <SummaryCard title="عدد المنتجات" value={inventoryData.length} color="text-amber-600" />
 //       </div>
 //       <ResponsiveContainer width="100%" height={250}>
 //         <BarChart data={salesData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="date" />
 //           <YAxis />
 //           <Tooltip />
 //           <Bar dataKey="total" fill={theme.colors.primary} />
 //         </BarChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ------------------------ 💰 المبيعات ------------------------ */
 // function SalesTab({ salesData }) {
 //   const totalSales = salesData.reduce((sum, s) => sum + s.total, 0)
 //   const avg = (totalSales / salesData.length).toFixed(2)
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">💰 تقرير المبيعات</h3>
 //       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
 //         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
 //         <SummaryCard title="عدد العمليات" value={salesData.length} color="text-blue-600" />
 //         <SummaryCard title="متوسط المبيعات" value={`${avg} ر.س`} color="text-green-600" />
 //         <SummaryCard title="أعلى مبيعات" value="أحمد" color="text-amber-600" />
 //       </div>
 //       <ResponsiveContainer width="100%" height={250}>
 //         <LineChart data={salesData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="date" />
 //           <YAxis />
 //           <Tooltip />
 //           <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
 //         </LineChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ------------------------ 📦 المخزون ------------------------ */
 // function InventoryTab({ inventoryData }) {
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون</h3>
 //       <table className="w-full text-sm text-right border-t border-gray-100">
 //         <thead className="text-gray-600 bg-gray-50">
 //           <tr>
 //             <th className="px-3 py-2">اسم الدواء</th>
 //             <th className="px-3 py-2">الكمية</th>
 //             <th className="px-3 py-2">تاريخ الانتهاء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {inventoryData.map((i, idx) => (
 //             <tr key={idx} className="border-t hover:bg-gray-50">
 //               <td className="px-3 py-2">{i.name}</td>
 //               <td className={`px-3 py-2 ${i.qty <= 3 ? 'text-red-600' : 'text-green-700'}`}>{i.qty}</td>
 //               <td className="px-3 py-2">{i.expiry}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* ------------------------ 📈 الأرباح ------------------------ */
 // function ProfitTab({ profitData }) {
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📈 تقرير الأرباح الشهرية</h3>
 //       <ResponsiveContainer width="100%" height={250}>
 //         <LineChart data={profitData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="month" />
 //           <YAxis />
 //           <Tooltip />
 //           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
 //         </LineChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ------------------------ 👥 المستخدمين ------------------------ */
 // function UsersTab({ userStats }) {
 //   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">👥 أداء المستخدمين</h3>
 //       <ResponsiveContainer width="100%" height={250}>
 //         <PieChart>
 //           <Pie data={userStats} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
 //             {userStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
 //           </Pie>
 //           <Tooltip />
 //         </PieChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ------------------------ ⚙️ النظام ------------------------ */
 // function SystemTab({ logs }) {
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
 //       <table className="w-full text-sm text-right border-t border-gray-100">
 //         <thead className="text-gray-600 bg-gray-50">
 //           <tr>
 //             <th className="px-3 py-2">الوقت</th>
 //             <th className="px-3 py-2">المستخدم</th>
 //             <th className="px-3 py-2">الإجراء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {logs.map((log, idx) => (
 //             <tr key={idx} className="border-t hover:bg-gray-50">
 //               <td className="px-3 py-2">{log.time}</td>
 //               <td className="px-3 py-2">{log.user}</td>
 //               <td className="px-3 py-2">{log.action}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* ------------------------ 🧩 بطاقة الملخص ------------------------ */
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center transition border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white hover:shadow-md">
 //       <p className="text-sm text-gray-500">{title}</p>
 //       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
 // import { useState, useEffect } from 'react'
 // import { motion } from 'framer-motion'
 // import Layout from '../components/Layout'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // import {
 //   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
 //   PieChart, Pie, Cell, ResponsiveContainer
 // } from 'recharts'
 // export default function Reports() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [activeTab, setActiveTab] = useState('sales')
 //   const [dateRange, setDateRange] = useState({ from: '', to: '' })
 //   const [salesData, setSalesData] = useState([])
 //   const [inventoryData, setInventoryData] = useState([])
 //   const [profitData, setProfitData] = useState([])
 //   const [userStats, setUserStats] = useState([])
 //   const [logs, setLogs] = useState([])
 //   useEffect(() => {
 //     // بيانات افتراضية
 //     setSalesData([
 //       { date: '2025-11-01', total: 320, cashier: 'أحمد' },
 //       { date: '2025-11-02', total: 410, cashier: 'محمد' },
 //       { date: '2025-11-03', total: 380, cashier: 'أحمد' },
 //     ])
 //     setInventoryData([
 //       { name: 'باراسيتامول', qty: 8, expiry: '2025-12-10' },
 //       { name: 'أموكسيسيلين', qty: 2, expiry: '2024-06-02' },
 //     ])
 //     setProfitData([
 //       { month: 'أكتوبر', profit: 3200 },
 //       { month: 'نوفمبر', profit: 4800 },
 //       { month: 'ديسمبر', profit: 5100 },
 //     ])
 //     setUserStats([
 //       { name: 'محمد', sales: 1200 },
 //       { name: 'أحمد', sales: 1500 },
 //       { name: 'مها', sales: 800 },
 //     ])
 //     setLogs([
 //       { time: '10:15', user: 'أحمد', action: 'تسجيل دخول' },
 //       { time: '10:30', user: 'محمد', action: 'إضافة دواء جديد' },
 //       { time: '11:10', user: 'مها', action: 'تعديل صلاحيات مستخدم' },
 //     ])
 //   }, [])
 //   const tabButton = (key, label, icon) => (
 //     <button
 //       key={key}
 //       onClick={() => setActiveTab(key)}
 //       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border-b-4 ${
 //         activeTab === key
 //           ? 'text-sky-700 border-sky-500 bg-sky-50'
 //           : 'text-gray-700 border-transparent hover:text-sky-700 hover:bg-gray-50'
 //       }`}
 //     >
 //       <span>{icon}</span> {label}
 //     </button>
 //   )
 //   const handleFilter = () => {
 //     toast.success(`✅ تم تطبيق الفلتر من ${dateRange.from || 'بداية الشهر'} إلى ${dateRange.to || 'اليوم'}`)
 //   }
 //   return (
 //     <Layout user={user} title="📊 لوحة التقارير">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 🔹 شريط التبويبات */}
 //         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
 //           {tabButton('sales', 'المبيعات', '💰')}
 //           {tabButton('inventory', 'المخزون', '📦')}
 //           {tabButton('profit', 'الأرباح', '📈')}
 //           {tabButton('users', 'المستخدمين', '👥')}
 //           {tabButton('system', 'النظام', '⚙️')}
 //         </div>
 //         {/* 🔸 شريط الفلاتر */}
 //         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white md:flex-row md:items-center md:justify-between">
 //           <div className="flex flex-wrap items-center gap-2">
 //             <label className="text-sm text-gray-700">من:</label>
 //             <input
 //               type="date"
 //               value={dateRange.from}
 //               onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             />
 //             <label className="text-sm text-gray-700">إلى:</label>
 //             <input
 //               type="date"
 //               value={dateRange.to}
 //               onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             />
 //             <button
 //               onClick={handleFilter}
 //               className="px-4 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
 //             >
 //               🔍 تطبيق الفلتر
 //             </button>
 //           </div>
 //           <div className="flex justify-end gap-2">
 //             <button onClick={() => toast.success('📄 تم تصدير PDF')} className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700">
 //               📄 PDF
 //             </button>
 //             <button onClick={() => toast.success('📊 تم تصدير Excel')} className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">
 //               📊 Excel
 //             </button>
 //           </div>
 //         </div>
 //         {/* 🔻 محتوى التبويبات */}
 //         <motion.div
 //           key={activeTab}
 //           initial={{ opacity: 0 }}
 //           animate={{ opacity: 1 }}
 //           transition={{ duration: 0.3 }}
 //         >
 //           {activeTab === 'sales' && <SalesTab salesData={salesData} />}
 //           {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
 //           {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
 //           {activeTab === 'users' && <UsersTab userStats={userStats} />}
 //           {activeTab === 'system' && <SystemTab logs={logs} />}
 //         </motion.div>
 //       </div>
 //     </Layout>
 //   )
 // }
 // /* ------------------------ 💰 تبويب المبيعات ------------------------ */
 // function SalesTab({ salesData }) {
 //   const totalSales = salesData.reduce((sum, s) => sum + s.total, 0)
 //   const avg = (totalSales / salesData.length).toFixed(2)
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">💰 تقرير المبيعات</h3>
 //       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
 //         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
 //         <SummaryCard title="عدد العمليات" value={salesData.length} color="text-blue-600" />
 //         <SummaryCard title="متوسط المبيعات" value={`${avg} ر.س`} color="text-green-600" />
 //         <SummaryCard title="أعلى مبيعات" value="أحمد" color="text-amber-600" />
 //       </div>
 //       <ResponsiveContainer width="100%" height={250}>
 //         <LineChart data={salesData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="date" />
 //           <YAxis />
 //           <Tooltip />
 //           <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
 //         </LineChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ------------------------ 📦 تبويب المخزون ------------------------ */
 // function InventoryTab({ inventoryData }) {
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون</h3>
 //       <table className="w-full text-sm text-right border-t border-gray-100">
 //         <thead className="text-gray-600 bg-gray-50">
 //           <tr>
 //             <th className="px-3 py-2">اسم الدواء</th>
 //             <th className="px-3 py-2">الكمية</th>
 //             <th className="px-3 py-2">الانتهاء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {inventoryData.map((i, idx) => (
 //             <tr key={idx} className="border-t hover:bg-gray-50">
 //               <td className="px-3 py-2">{i.name}</td>
 //               <td className={`px-3 py-2 ${i.qty <= 3 ? 'text-red-600' : 'text-green-700'}`}>{i.qty}</td>
 //               <td className="px-3 py-2">{i.expiry}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* ------------------------ 📈 تبويب الأرباح ------------------------ */
 // function ProfitTab({ profitData }) {
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📈 تقرير الأرباح الشهرية</h3>
 //       <ResponsiveContainer width="100%" height={250}>
 //         <LineChart data={profitData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="month" />
 //           <YAxis />
 //           <Tooltip />
 //           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
 //         </LineChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ------------------------ 👥 تبويب المستخدمين ------------------------ */
 // function UsersTab({ userStats }) {
 //   const COLORS = ['#0EA5E9', '#10B981', '#F59E0B']
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">👥 أداء المستخدمين</h3>
 //       <ResponsiveContainer width="100%" height={250}>
 //         <PieChart>
 //           <Pie data={userStats} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
 //             {userStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
 //           </Pie>
 //           <Tooltip />
 //         </PieChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ------------------------ ⚙️ تبويب النظام ------------------------ */
 // function SystemTab({ logs }) {
 //   return (
 //     <div className="p-5 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
 //       <table className="w-full text-sm text-right border-t border-gray-100">
 //         <thead className="text-gray-600 bg-gray-50">
 //           <tr>
 //             <th className="px-3 py-2">الوقت</th>
 //             <th className="px-3 py-2">المستخدم</th>
 //             <th className="px-3 py-2">الإجراء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {logs.map((log, idx) => (
 //             <tr key={idx} className="border-t hover:bg-gray-50">
 //               <td className="px-3 py-2">{log.time}</td>
 //               <td className="px-3 py-2">{log.user}</td>
 //               <td className="px-3 py-2">{log.action}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* ------------------------ 🧩 بطاقة الملخص ------------------------ */
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center transition border rounded-lg shadow-sm bg-gradient-to-br from-sky-50 to-white hover:shadow-md">
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
 //   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
 //   PieChart, Pie, Cell, ResponsiveContainer
 // } from 'recharts'
 // export default function Reports() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [activeTab, setActiveTab] = useState('sales')
 //   const [salesData, setSalesData] = useState([])
 //   const [inventoryData, setInventoryData] = useState([])
 //   const [profitData, setProfitData] = useState([])
 //   const [userStats, setUserStats] = useState([])
 //   const [logs, setLogs] = useState([])
 //   useEffect(() => {
 //     // بيانات افتراضية
 //     setSalesData([
 //       { date: '2025-11-01', total: 320, cashier: 'أحمد' },
 //       { date: '2025-11-02', total: 410, cashier: 'محمد' },
 //       { date: '2025-11-03', total: 380, cashier: 'أحمد' },
 //     ])
 //     setInventoryData([
 //       { name: 'باراسيتامول', qty: 8, expiry: '2025-12-10' },
 //       { name: 'أموكسيسيلين', qty: 2, expiry: '2024-06-02' },
 //     ])
 //     setProfitData([
 //       { month: 'أكتوبر', profit: 3200 },
 //       { month: 'نوفمبر', profit: 4800 },
 //       { month: 'ديسمبر', profit: 5100 },
 //     ])
 //     setUserStats([
 //       { name: 'محمد', sales: 1200 },
 //       { name: 'أحمد', sales: 1500 },
 //       { name: 'مها', sales: 800 },
 //     ])
 //     setLogs([
 //       { time: '10:15', user: 'أحمد', action: 'تسجيل دخول' },
 //       { time: '10:30', user: 'محمد', action: 'إضافة دواء جديد' },
 //       { time: '11:10', user: 'مها', action: 'تعديل صلاحيات مستخدم' },
 //     ])
 //   }, [])
 //   const tabButton = (key, label, icon) => (
 //     <button
 //       key={key}
 //       onClick={() => setActiveTab(key)}
 //       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
 //         activeTab === key
 //           ? 'text-white shadow-sm'
 //           : 'text-gray-700 hover:text-sky-700 hover:bg-sky-50'
 //       }`}
 //       style={{
 //         backgroundColor: activeTab === key ? theme.colors.primary : 'transparent',
 //       }}
 //     >
 //       <span>{icon}</span> {label}
 //     </button>
 //   )
 //   return (
 //     <Layout user={user} title="📊 التقارير والتحليلات">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 🔹 تبويبات */}
 //         <div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg shadow-sm">
 //           {tabButton('sales', 'المبيعات', '💰')}
 //           {tabButton('inventory', 'المخزون', '📦')}
 //           {tabButton('profit', 'الأرباح', '📈')}
 //           {tabButton('users', 'المستخدمين', '👥')}
 //           {tabButton('system', 'النظام', '⚙️')}
 //         </div>
 //         {/* محتوى التبويبات */}
 //         {activeTab === 'sales' && <SalesTab salesData={salesData} />}
 //         {activeTab === 'inventory' && <InventoryTab inventoryData={inventoryData} />}
 //         {activeTab === 'profit' && <ProfitTab profitData={profitData} />}
 //         {activeTab === 'users' && <UsersTab userStats={userStats} />}
 //         {activeTab === 'system' && <SystemTab logs={logs} />}
 //       </div>
 //     </Layout>
 //   )
 // }
 // /* ------------------------ 📊 تبويب المبيعات ------------------------ */
 // function SalesTab({ salesData }) {
 //   const totalSales = salesData.reduce((sum, s) => sum + s.total, 0)
 //   const handleExport = (type) => toast.success(`✅ تم تصدير تقرير المبيعات (${type})`)
 //   return (
 //     <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">💰 تقرير المبيعات</h3>
 //       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
 //         <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
 //         <SummaryCard title="عدد العمليات" value={salesData.length} color="text-blue-600" />
 //         <SummaryCard title="عدد الكاشيرين" value={new Set(salesData.map(s => s.cashier)).size} color="text-green-600" />
 //         <SummaryCard title="أعلى مبيعات" value="أحمد" color="text-amber-600" />
 //       </div>
 //       <ResponsiveContainer width="100%" height={250}>
 //         <LineChart data={salesData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="date" />
 //           <YAxis />
 //           <Tooltip />
 //           <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
 //         </LineChart>
 //       </ResponsiveContainer>
 //       <div className="flex justify-end gap-2">
 //         <button onClick={() => handleExport('PDF')} className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700">📄 PDF</button>
 //         <button onClick={() => handleExport('Excel')} className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">📊 Excel</button>
 //       </div>
 //     </div>
 //   )
 // }
 // /* ------------------------ 📦 تبويب المخزون ------------------------ */
 // function InventoryTab({ inventoryData }) {
 //   const lowStock = inventoryData.filter(i => i.qty <= 3)
 //   const expiring = inventoryData.filter(i => new Date(i.expiry) < new Date('2025-07-01'))
 //   return (
 //     <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">📦 تقرير المخزون</h3>
 //       <SummaryCard title="إجمالي الأصناف" value={inventoryData.length} color="text-sky-600" />
 //       <SummaryCard title="منخفض المخزون" value={lowStock.length} color="text-red-600" />
 //       <SummaryCard title="قرب الانتهاء" value={expiring.length} color="text-amber-600" />
 //       <table className="w-full mt-3 text-sm text-right border-t">
 //         <thead className="text-gray-600 bg-gray-50">
 //           <tr>
 //             <th className="px-3 py-2">اسم الدواء</th>
 //             <th className="px-3 py-2">الكمية</th>
 //             <th className="px-3 py-2">تاريخ الانتهاء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {inventoryData.map((i, idx) => (
 //             <tr key={idx} className="border-t hover:bg-gray-50">
 //               <td className="px-3 py-2">{i.name}</td>
 //               <td className={`px-3 py-2 ${i.qty <= 3 ? 'text-red-600' : ''}`}>{i.qty}</td>
 //               <td className="px-3 py-2">{i.expiry}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* ------------------------ 💰 تبويب الأرباح ------------------------ */
 // function ProfitTab({ profitData }) {
 //   const total = profitData.reduce((sum, p) => sum + p.profit, 0)
 //   return (
 //     <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">💰 تقرير الأرباح</h3>
 //       <SummaryCard title="إجمالي الأرباح" value={`${total} ر.س`} color="text-green-600" />
 //       <ResponsiveContainer width="100%" height={250}>
 //         <LineChart data={profitData}>
 //           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //           <XAxis dataKey="month" />
 //           <YAxis />
 //           <Tooltip />
 //           <Line type="monotone" dataKey="profit" stroke={theme.colors.primary} strokeWidth={2} />
 //         </LineChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ------------------------ 👥 تبويب المستخدمين ------------------------ */
 // function UsersTab({ userStats }) {
 //   const totalSales = userStats.reduce((s, u) => s + u.sales, 0)
 //   return (
 //     <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">👥 تقرير المستخدمين</h3>
 //       <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
 //       <ResponsiveContainer width="100%" height={250}>
 //         <PieChart>
 //           <Pie
 //             data={userStats}
 //             dataKey="sales"
 //             nameKey="name"
 //             cx="50%"
 //             cy="50%"
 //             outerRadius={80}
 //             label
 //           >
 //             {['#0EA5E9', '#10B981', '#F59E0B'].map((c, i) => <Cell key={i} fill={c} />)}
 //           </Pie>
 //           <Tooltip />
 //         </PieChart>
 //       </ResponsiveContainer>
 //     </div>
 //   )
 // }
 // /* ------------------------ ⚙️ تبويب النظام ------------------------ */
 // function SystemTab({ logs }) {
 //   return (
 //     <div className="p-4 space-y-4 bg-white border rounded-lg shadow-sm">
 //       <h3 className="text-lg font-semibold text-gray-800">⚙️ سجل النظام</h3>
 //       <table className="w-full text-sm text-right border-t">
 //         <thead className="text-gray-600 bg-gray-50">
 //           <tr>
 //             <th className="px-3 py-2">الوقت</th>
 //             <th className="px-3 py-2">المستخدم</th>
 //             <th className="px-3 py-2">الإجراء</th>
 //           </tr>
 //         </thead>
 //         <tbody>
 //           {logs.map((log, idx) => (
 //             <tr key={idx} className="border-t hover:bg-gray-50">
 //               <td className="px-3 py-2">{log.time}</td>
 //               <td className="px-3 py-2">{log.user}</td>
 //               <td className="px-3 py-2">{log.action}</td>
 //             </tr>
 //           ))}
 //         </tbody>
 //       </table>
 //     </div>
 //   )
 // }
 // /* ------------------------ 🧩 مكون البطاقة ------------------------ */
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center transition bg-white border rounded-lg shadow-sm hover:shadow-md">
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
 //   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
 //   PieChart, Pie, Cell, ResponsiveContainer
 // } from 'recharts'
 // export default function Reports() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [reportType, setReportType] = useState('sales')
 //   const [dateFrom, setDateFrom] = useState('')
 //   const [dateTo, setDateTo] = useState('')
 //   const [filterUser, setFilterUser] = useState('all')
 //   const [filteredData, setFilteredData] = useState([])
 //   const [salesData, setSalesData] = useState([])
 //   const [loading, setLoading] = useState(true)
 //   // بيانات وهمية
 //   useEffect(() => {
 //     const dummySales = [
 //       { date: '2025-11-01', product: 'باراسيتامول', qty: 5, price: 15, user: 'أحمد' },
 //       { date: '2025-11-02', product: 'أموكسيسيلين', qty: 3, price: 25, user: 'محمد' },
 //       { date: '2025-11-03', product: 'فيتامين د', qty: 2, price: 40, user: 'أحمد' },
 //     ]
 //     setSalesData(dummySales)
 //     setFilteredData(dummySales)
 //     setLoading(false)
 //   }, [])
 //   const handleFilter = () => {
 //     let data = [...salesData]
 //     if (filterUser !== 'all') data = data.filter(d => d.user === filterUser)
 //     if (dateFrom) data = data.filter(d => d.date >= dateFrom)
 //     if (dateTo) data = data.filter(d => d.date <= dateTo)
 //     setFilteredData(data)
 //     toast.success('✅ تم تطبيق الفلاتر بنجاح')
 //   }
 //   const handleReset = () => {
 //     setReportType('sales')
 //     setDateFrom('')
 //     setDateTo('')
 //     setFilterUser('all')
 //     setFilteredData(salesData)
 //     toast.success('🔄 تمت إعادة الضبط')
 //   }
 //   const handleExport = (type) => {
 //     toast.success(`📄 تم تصدير التقرير بصيغة ${type}`)
 //   }
 //   const totalSales = filteredData.reduce((sum, d) => sum + d.price * d.qty, 0)
 //   const totalInvoices = filteredData.length
 //   const totalItems = filteredData.reduce((sum, d) => sum + d.qty, 0)
 //   if (loading) {
 //     return (
 //       <Layout user={user} title="التقارير والتحليلات">
 //         <div className="flex items-center justify-center h-96">
 //           <p className="text-gray-600">جاري تحميل البيانات...</p>
 //         </div>
 //       </Layout>
 //     )
 //   }
 //   return (
 //     <Layout user={user} title="التقارير والتحليلات">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 🔹 فلاتر */}
 //         <div className="p-4 space-y-3 bg-white border rounded-lg shadow-sm">
 //           <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
 //             <select
 //               value={reportType}
 //               onChange={(e) => setReportType(e.target.value)}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             >
 //               <option value="sales">تقرير المبيعات</option>
 //               <option value="inventory">تقرير المخزون</option>
 //               <option value="profit">تقرير الأرباح</option>
 //               <option value="cashiers">تقرير الكاشيرين</option>
 //             </select>
 //             <div className="flex flex-col w-full gap-2 sm:flex-row sm:w-auto">
 //               <input
 //                 type="date"
 //                 value={dateFrom}
 //                 onChange={(e) => setDateFrom(e.target.value)}
 //                 className="px-3 py-2 text-sm border rounded-md"
 //               />
 //               <input
 //                 type="date"
 //                 value={dateTo}
 //                 onChange={(e) => setDateTo(e.target.value)}
 //                 className="px-3 py-2 text-sm border rounded-md"
 //               />
 //             </div>
 //             <select
 //               value={filterUser}
 //               onChange={(e) => setFilterUser(e.target.value)}
 //               className="px-3 py-2 text-sm border rounded-md"
 //             >
 //               <option value="all">كل المستخدمين</option>
 //               <option value="أحمد">أحمد</option>
 //               <option value="محمد">محمد</option>
 //             </select>
 //             <div className="flex gap-2">
 //               <button
 //                 onClick={handleFilter}
 //                 className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //               >
 //                 تطبيق الفلاتر
 //               </button>
 //               <button
 //                 onClick={handleReset}
 //                 className="px-4 py-2 text-sm text-gray-700 border rounded-md hover:bg-gray-50"
 //               >
 //                 إعادة الضبط
 //               </button>
 //             </div>
 //           </div>
 //         </div>
 //         {/* 🔸 بطاقات الملخص */}
 //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
 //           <SummaryCard title="إجمالي المبيعات" value={`${totalSales} ر.س`} color="text-sky-600" />
 //           <SummaryCard title="عدد الفواتير" value={totalInvoices} color="text-blue-600" />
 //           <SummaryCard title="عدد الأصناف المباعة" value={totalItems} color="text-green-600" />
 //           <SummaryCard title="نسبة الأرباح" value="22%" color="text-amber-600" />
 //         </div>
 //         {/* 📊 الجدول */}
 //         <div className="p-4 overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right min-w-[900px]">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">التاريخ</th>
 //                 <th className="px-3 py-2">اسم المنتج</th>
 //                 <th className="px-3 py-2">الكمية</th>
 //                 <th className="px-3 py-2">السعر</th>
 //                 <th className="px-3 py-2">الإجمالي</th>
 //                 <th className="px-3 py-2">الكاشير</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filteredData.length ? (
 //                 filteredData.map((d, i) => (
 //                   <tr key={i} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{i + 1}</td>
 //                     <td className="px-3 py-2">{d.date}</td>
 //                     <td className="px-3 py-2">{d.product}</td>
 //                     <td className="px-3 py-2">{d.qty}</td>
 //                     <td className="px-3 py-2">{d.price} ر.س</td>
 //                     <td className="px-3 py-2 font-semibold text-sky-700">{d.qty * d.price} ر.س</td>
 //                     <td className="px-3 py-2">{d.user}</td>
 //                   </tr>
 //                 ))
 //               ) : (
 //                 <tr>
 //                   <td colSpan="7" className="px-3 py-4 text-center text-gray-500">
 //                     لا توجد بيانات مطابقة للفلاتر الحالية
 //                   </td>
 //                 </tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* 📈 الرسوم البيانية */}
 //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
 //           <div className="p-5 bg-white border rounded-lg shadow-sm">
 //             <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات اليومية</h3>
 //             <ResponsiveContainer width="100%" height={260}>
 //               <LineChart data={filteredData}>
 //                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //                 <XAxis dataKey="date" />
 //                 <YAxis />
 //                 <Tooltip />
 //                 <Line type="monotone" dataKey={(d) => d.qty * d.price} stroke={theme.colors.primary} strokeWidth={2} />
 //               </LineChart>
 //             </ResponsiveContainer>
 //           </div>
 //           <div className="p-5 bg-white border rounded-lg shadow-sm">
 //             <h3 className="mb-3 text-lg font-semibold text-gray-700">توزيع المبيعات حسب المستخدم</h3>
 //             <ResponsiveContainer width="100%" height={260}>
 //               <PieChart>
 //                 <Pie
 //                   data={[
 //                     { name: 'أحمد', value: filteredData.filter(d => d.user === 'أحمد').length },
 //                     { name: 'محمد', value: filteredData.filter(d => d.user === 'محمد').length },
 //                   ]}
 //                   cx="50%"
 //                   cy="50%"
 //                   outerRadius={80}
 //                   label
 //                   dataKey="value"
 //                 >
 //                   {['#0EA5E9', '#10B981'].map((c, i) => <Cell key={i} fill={c} />)}
 //                 </Pie>
 //                 <Tooltip />
 //               </PieChart>
 //             </ResponsiveContainer>
 //           </div>
 //         </div>
 //         {/* 🧾 أزرار التصدير والطباعة */}
 //         <div className="flex flex-wrap justify-end gap-2">
 //           <button onClick={() => handleExport('PDF')} className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700">📄 تصدير PDF</button>
 //           <button onClick={() => handleExport('Excel')} className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">📊 تصدير Excel</button>
 //           <button onClick={() => window.print()} className="px-4 py-2 text-sm text-white rounded-md bg-amber-500 hover:bg-amber-600">🖨️ طباعة</button>
 //         </div>
 //       </div>
 //     </Layout>
 //   )
 // }
 // function SummaryCard({ title, value, color }) {
 //   return (
 //     <div className="p-4 text-center transition-all bg-white border rounded-lg shadow-sm hover:shadow-md">
 //       <p className="text-sm text-gray-500">{title}</p>
 //       <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
 //     </div>
 //   )
 // }
 // // pages/reports.js
 // import { useEffect, useState, useMemo } from 'react'
 // import Layout from '../components/Layout'
 // import Modal from '../components/Modal'
 // import {
 //   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
 //   BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
 // } from 'recharts'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // export default function Reports() {
 //   const [user] = useState({ name: 'صيدلية المعلم' })
 //   const [salesData, setSalesData] = useState([])
 //   const [stockData, setStockData] = useState([])
 //   const [profitData, setProfitData] = useState([])
 //   const [loading, setLoading] = useState(true)
 //   const [smartInsight, setSmartInsight] = useState('')
 //   const [showCashiersReports, setShowCashiersReports] = useState(false)
 //   // بيانات ورديات الكاشير (وهمية)
 //   const [cashierShifts, setCashierShifts] = useState([])
 //   useEffect(() => {
 //     const sales = [
 //       { date: 'يناير', total: 3200 },
 //       { date: 'فبراير', total: 2800 },
 //       { date: 'مارس', total: 4500 },
 //       { date: 'أبريل', total: 3900 },
 //       { date: 'مايو', total: 5200 },
 //       { date: 'يونيو', total: 6100 }
 //     ]
 //     const stock = [
 //       { name: 'باراسيتامول', qty: 120, sold: 500 },
 //       { name: 'أموكسيسيلين', qty: 80, sold: 350 },
 //       { name: 'فيتامين د', qty: 40, sold: 720 },
 //       { name: 'ايبوبروفين', qty: 60, sold: 420 },
 //       { name: 'فيتامين سي', qty: 25, sold: 650 }
 //     ]
 //     const profits = [
 //       { name: 'مبيعات', value: 78 },
 //       { name: 'تكاليف', value: 18 },
 //       { name: 'خسائر', value: 4 }
 //     ]
 //     setSalesData(sales)
 //     setStockData(stock)
 //     setProfitData(profits)
 //     setLoading(false)
 //     const last = sales[sales.length - 1].total
 //     const prev = sales[sales.length - 2].total
 //     const growth = (((last - prev) / prev) * 100).toFixed(1)
 //     const topProduct = stock.reduce((max, p) => (p.sold > max.sold ? p : max), stock[0])
 //     const lowStock = stock.reduce((min, p) => (p.qty < min.qty ? p : min), stock[0])
 //     let insight = ''
 //     if (growth > 0) insight += `📈 ارتفعت المبيعات بنسبة ${growth}% مقارنة بالشهر السابق. `
 //     else if (growth < 0) insight += `📉 تراجعت المبيعات بنسبة ${Math.abs(growth)}% مقارنة بالشهر السابق. `
 //     else insight += `📊 المبيعات حافظت على استقرارها مقارنة بالشهر الماضي. `
 //     insight += `🏆 المنتج الأعلى مبيعًا هو "${topProduct.name}" بكمية ${topProduct.sold} وحدة. `
 //     insight += `⚠️ المنتج "${lowStock.name}" يقترب من النفاد (المخزون الحالي ${lowStock.qty} وحدة فقط).`
 //     setSmartInsight(insight)
 //     // ورديات كاشيرين (وهمية)
 //     setCashierShifts([
 //       { id: 1, cashier: 'أحمد', date: '2025-11-02', invoices: 18, total: 1360, avg: 75.5, start: '09:00', end: '17:00' },
 //       { id: 2, cashier: 'مها', date: '2025-11-02', invoices: 12, total: 940, avg: 78.3, start: '13:00', end: '21:00' },
 //       { id: 3, cashier: 'سعيد', date: '2025-11-01', invoices: 20, total: 1510, avg: 75.5, start: '09:00', end: '17:00' },
 //     ])
 //   }, [])
 //   const COLORS = ['#00C49F', '#FFBB28', '#FF8042']
 //   const totalSales = useMemo(() => salesData.reduce((sum, s) => sum + s.total, 0), [salesData])
 //   const totalStock = useMemo(() => stockData.reduce((sum, s) => sum + s.qty, 0), [stockData])
 //   const avgProfit = profitData[0]?.value || 0
 //   if (loading) {
 //     return (
 //       <Layout user={user} title="التقارير والتحليلات">
 //         <div className="flex items-center justify-center h-96">
 //           <p className="text-lg text-gray-600">جاري تحميل البيانات...</p>
 //         </div>
 //       </Layout>
 //     )
 //   }
 //   return (
 //     <Layout user={user} title="التقارير والتحليلات">
 //       {/* شريط علوي: عنوان + زر جميع تقارير الكاشيرين */}
 //       <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
 //         <h3 className="text-lg font-semibold text-gray-800">التقارير</h3>
 //         <button onClick={() => setShowCashiersReports(true)} className="btn btn-primary">
 //           جميع تقارير الكاشيرين
 //         </button>
 //       </div>
 //       {/* التحليل الذكي */}
 //       <div className="p-5 mb-6 text-sm border rounded-lg border-amber-200 bg-amber-50">
 //         <p className="font-medium leading-relaxed text-amber-800">{smartInsight}</p>
 //       </div>
 //       {/* بطاقات */}
 //       <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
 //         <div className="p-4 card hover:shadow-md">
 //           <h3 className="text-sm text-gray-500">إجمالي المبيعات</h3>
 //           <p className="mt-1 text-3xl font-bold text-sky-600">{totalSales.toLocaleString()} ر.س</p>
 //         </div>
 //         <div className="p-4 card hover:shadow-md">
 //           <h3 className="text-sm text-gray-500">إجمالي المخزون</h3>
 //           <p className="mt-1 text-3xl font-bold text-green-600">{totalStock} وحدة</p>
 //         </div>
 //         <div className="p-4 card hover:shadow-md">
 //           <h3 className="text-sm text-gray-500">نسبة الربح</h3>
 //           <p className="mt-1 text-3xl font-bold text-amber-600">{avgProfit}%</p>
 //         </div>
 //       </div>
 //       {/* رسوم */}
 //       <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
 //         <div className="p-4 card">
 //           <h3 className="mb-3 text-lg font-semibold text-gray-700">المبيعات الشهرية</h3>
 //           <ResponsiveContainer width="100%" height={260}>
 //             <LineChart data={salesData}>
 //               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //               <XAxis dataKey="date" />
 //               <YAxis />
 //               <Tooltip />
 //               <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={2} />
 //             </LineChart>
 //           </ResponsiveContainer>
 //         </div>
 //         <div className="p-4 card">
 //           <h3 className="mb-3 text-lg font-semibold text-gray-700">كمية المخزون حسب المنتج</h3>
 //           <ResponsiveContainer width="100%" height={260}>
 //             <BarChart data={stockData}>
 //               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
 //               <XAxis dataKey="name" />
 //               <YAxis />
 //               <Tooltip />
 //               <Bar dataKey="qty" fill={theme.colors.secondary} />
 //             </BarChart>
 //           </ResponsiveContainer>
 //         </div>
 //       </div>
 //       <div className="p-4 mb-8 card">
 //         <h3 className="mb-3 text-lg font-semibold text-gray-700">نسبة الأرباح والخسائر</h3>
 //         <div className="flex justify-center">
 //           <ResponsiveContainer width="100%" height={300}>
 //             <PieChart>
 //               <Pie data={profitData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
 //                 {profitData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
 //               </Pie>
 //               <Tooltip />
 //             </PieChart>
 //           </ResponsiveContainer>
 //         </div>
 //       </div>
 //       <div className="flex justify-end gap-3">
 //         <button onClick={() => toast('📤 تم تصدير التقرير PDF')} className="btn btn-primary">💾 تصدير PDF</button>
 //         <button onClick={() => toast('📊 تم تصدير التقرير Excel')} className="btn btn-secondary">📊 تصدير Excel</button>
 //       </div>
 //       {/* مودال جميع تقارير الكاشيرين */}
 //       {showCashiersReports && (
 //         <Modal title="جميع تقارير الكاشيرين (الورديات)" onClose={() => setShowCashiersReports(false)} width="max-w-4xl">
 //           <div className="text-right">
 //             <table className="w-full text-sm text-right border border-gray-200">
 //               <thead className="text-gray-600 bg-gray-50">
 //                 <tr>
 //                   <th className="px-3 py-2">التاريخ</th>
 //                   <th className="px-3 py-2">الكاشير</th>
 //                   <th className="px-3 py-2">بداية</th>
 //                   <th className="px-3 py-2">نهاية</th>
 //                   <th className="px-3 py-2">عدد الفواتير</th>
 //                   <th className="px-3 py-2">الإجمالي</th>
 //                   <th className="px-3 py-2">المتوسط</th>
 //                 </tr>
 //               </thead>
 //               <tbody>
 //                 {cashierShifts.map((s) => (
 //                   <tr key={s.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{s.date}</td>
 //                     <td className="px-3 py-2">{s.cashier}</td>
 //                     <td className="px-3 py-2">{s.start}</td>
 //                     <td className="px-3 py-2">{s.end}</td>
 //                     <td className="px-3 py-2">{s.invoices}</td>
 //                     <td className="px-3 py-2">{s.total} ر.س</td>
 //                     <td className="px-3 py-2">{s.avg}</td>
 //                   </tr>
 //                 ))}
 //               </tbody>
 //             </table>
 //             {cashierShifts.length === 0 && (
 //               <div className="py-6 text-center text-gray-500">لا توجد بيانات</div>
 //             )}
 //           </div>
 //           <div className="flex justify-end gap-3 mt-5">
 //             <button onClick={() => toast('🖨️ طباعة التقرير')} className="btn btn-secondary">🖨️ طباعة</button>
 //             <button onClick={() => setShowCashiersReports(false)} className="btn btn-ghost">إغلاق</button>
 //           </div>
 //         </Modal>
 //       )}
 //     </Layout>
 //   )
 // }
_c8 = SummaryCard;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "SafeDate");
__turbopack_context__.k.register(_c1, "Reports");
__turbopack_context__.k.register(_c2, "TabButton");
__turbopack_context__.k.register(_c3, "OverviewTab");
__turbopack_context__.k.register(_c4, "SalesTab");
__turbopack_context__.k.register(_c5, "StockTab");
__turbopack_context__.k.register(_c6, "AlertsTab");
__turbopack_context__.k.register(_c7, "ShiftsTab");
__turbopack_context__.k.register(_c8, "SummaryCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/reports.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/reports";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/reports.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/reports\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/reports.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__e416d757._.js.map