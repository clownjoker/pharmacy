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
"[project]/mock/data.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// mock/data.js
__turbopack_context__.s([
    "mockInventory",
    ()=>mockInventory,
    "mockMedicines",
    ()=>mockMedicines,
    "mockProfit",
    ()=>mockProfit,
    "mockSales",
    ()=>mockSales,
    "mockUsers",
    ()=>mockUsers
]);
const mockUsers = [
    {
        id: 1,
        name: "أحمد",
        role: "admin",
        username: "admin",
        password: "1234"
    },
    {
        id: 2,
        name: "محمد",
        role: "pharmacist",
        username: "pharma",
        password: "1234"
    },
    {
        id: 3,
        name: "سارة",
        role: "cashier",
        username: "cashier",
        password: "1234"
    }
];
const mockMedicines = [
    {
        id: 1,
        name: "باراسيتامول",
        qty: 120,
        price: 8,
        category: "مسكنات"
    },
    {
        id: 2,
        name: "أموكسيسلين",
        qty: 45,
        price: 18,
        category: "مضادات حيوية"
    },
    {
        id: 3,
        name: "بنادول اكسترا",
        qty: 80,
        price: 12,
        category: "مسكنات"
    }
];
const mockInventory = [
    {
        id: 1,
        name: "شراب حساسية",
        qty: 24,
        cost: 5
    },
    {
        id: 2,
        name: "مرهم حروق",
        qty: 10,
        cost: 7
    }
];
const mockSales = [
    {
        id: 1,
        user: "محمد",
        total: 32,
        items: 3,
        date: "2025-01-05"
    },
    {
        id: 2,
        user: "سارة",
        total: 18,
        items: 1,
        date: "2025-01-05"
    }
];
const mockProfit = [
    {
        month: "يناير",
        total: 3200,
        profit: 1200,
        growth: 15,
        user: "أحمد"
    },
    {
        month: "فبراير",
        total: 4100,
        profit: 1500,
        growth: 25,
        user: "محمد"
    },
    {
        month: "مارس",
        total: 3800,
        profit: 1400,
        growth: 10,
        user: "مها"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/users.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UsersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Layout.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Modal.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mock$2f$data$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mock/data.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function UsersPage() {
    _s();
    const [user] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "المدير أحمد",
        role: "admin"
    });
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$mock$2f$data$2e$js__$5b$client$5d$__$28$ecmascript$29$__["mockUsers"]);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        username: "",
        role: "pharmacist"
    });
    const openModal = ()=>{
        setForm({
            name: "",
            username: "",
            role: "pharmacist"
        });
        setModalOpen(true);
    };
    const saveUser = ()=>{
        const newUser = {
            id: users.length + 1,
            ...form
        };
        setUsers([
            ...users,
            newUser
        ]);
        setModalOpen(false);
    };
    const deleteUser = (id)=>{
        setUsers(users.filter((u)=>u.id !== id));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        user: user,
        title: "👥 إدارة المستخدمين",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            dir: "rtl",
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: openModal,
                        className: "px-4 py-2 text-white rounded-md bg-sky-600 hover:bg-sky-700",
                        children: "➕ إضافة مستخدم"
                    }, void 0, false, {
                        fileName: "[project]/pages/users.js",
                        lineNumber: 41,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/users.js",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto bg-white border rounded-lg shadow-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full min-w-[800px] text-sm text-right",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "text-gray-600 bg-gray-50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الاسم"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/users.js",
                                            lineNumber: 53,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "اسم المستخدم"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/users.js",
                                            lineNumber: 54,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "الدور"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/users.js",
                                            lineNumber: 55,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2",
                                            children: "إجراءات"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/users.js",
                                            lineNumber: 56,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/users.js",
                                    lineNumber: 52,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: users.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "border-t hover:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 font-semibold",
                                                children: u.name
                                            }, void 0, false, {
                                                fileName: "[project]/pages/users.js",
                                                lineNumber: 62,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: u.username
                                            }, void 0, false, {
                                                fileName: "[project]/pages/users.js",
                                                lineNumber: 63,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: u.role === "admin" ? "مدير" : u.role === "pharmacist" ? "صيدلي" : "كاشير"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/users.js",
                                                lineNumber: 64,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>deleteUser(u.id),
                                                    className: "px-3 py-1 text-sm text-red-600 rounded-md hover:bg-red-50",
                                                    children: "حذف"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/users.js",
                                                    lineNumber: 72,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/users.js",
                                                lineNumber: 71,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, u.id, true, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 61,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/users.js",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/users.js",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                modalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    title: "إضافة مستخدم",
                    onClose: ()=>setModalOpen(false),
                    onConfirm: saveUser,
                    confirmText: "حفظ",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "الاسم",
                                value: form.name,
                                onChange: (e)=>setForm({
                                        ...form,
                                        name: e.target.value
                                    }),
                                className: "w-full px-3 py-2 border rounded-md"
                            }, void 0, false, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 94,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "اسم المستخدم",
                                value: form.username,
                                onChange: (e)=>setForm({
                                        ...form,
                                        username: e.target.value
                                    }),
                                className: "w-full px-3 py-2 border rounded-md"
                            }, void 0, false, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 102,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: form.role,
                                onChange: (e)=>setForm({
                                        ...form,
                                        role: e.target.value
                                    }),
                                className: "w-full px-3 py-2 border rounded-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "admin",
                                        children: "مدير"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 115,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "pharmacist",
                                        children: "صيدلي"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 116,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "cashier",
                                        children: "كاشير"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/users.js",
                                        lineNumber: 117,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/users.js",
                                lineNumber: 110,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/users.js",
                        lineNumber: 93,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/users.js",
                    lineNumber: 87,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/users.js",
            lineNumber: 38,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/users.js",
        lineNumber: 37,
        columnNumber: 5
    }, this);
} // import { useState, useEffect } from 'react'
 // import Layout from '../components/Layout'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // export default function UsersPage() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [users, setUsers] = useState([])
 //   const [loading, setLoading] = useState(true)
 //   // ---- إضافة مستخدم
 //   const [showAddModal, setShowAddModal] = useState(false)
 //   const [saving, setSaving] = useState(false)
 //   const [newUser, setNewUser] = useState({
 //     name: '',
 //     username: '',
 //     email: '',
 //     password: '',
 //     role: 'cashier',
 //   })
 //   // ---- صلاحيات
 //   const [showPermModal, setShowPermModal] = useState(false)
 //   const [selectedUser, setSelectedUser] = useState(null)
 //   const [permDraft, setPermDraft] = useState([])
 //   // ---- فلترة
 //   const [search, setSearch] = useState('')
 //   // IMPORTANT: عدّل المنفذ إذا سيرفرك مختلف
 //   const API = 'http://localhost:5000/api/users'
 //   // ================== تحميل المستخدمين ==================
 //   const loadUsers = async () => {
 //     try {
 //       setLoading(true)
 //       const res = await fetch(API)
 //       if (!res.ok) throw new Error('HTTP ' + res.status)
 //       const data = await res.json()
 //       setUsers(data)
 //     } catch (e) {
 //       console.error(e)
 //       toast.error('فشل تحميل المستخدمين — تأكد من تشغيل الباك إند و CORS')
 //     } finally {
 //       setLoading(false)
 //     }
 //   }
 //   useEffect(() => {
 //   const token = localStorage.getItem("pharmacy_token")
 //   if (!token) {
 //     router.replace("/")   // redirect to login
 //   }
 // }, [])
 //   useEffect(() => {
 //     loadUsers()
 //   }, [])
 //   // ================== فتح مودال الإضافة ==================
 //   const openAddModal = () => {
 //     setNewUser({ name: '', username: '', email: '', password: '', role: 'cashier' })
 //     setShowAddModal(true)
 //   }
 //   // ================== إضافة مستخدم ==================
 //   const addUser = async () => {
 //     // فاليوديشن بسيطة
 //     if (!newUser.name.trim() || !newUser.username.trim() || !newUser.password.trim()) {
 //       return toast.error('يرجى تعبئة الاسم واسم المستخدم وكلمة المرور')
 //     }
 //     try {
 //       setSaving(true)
 //       const res = await fetch(API, {
 //         method: 'POST',
 //         headers: { 'Content-Type': 'application/json' },
 //         body: JSON.stringify(newUser),
 //       })
 //       const data = await res.json().catch(() => ({}))
 //       if (!res.ok) {
 //         throw new Error(data?.message || 'فشل إضافة المستخدم')
 //       }
 //       toast.success('✅ تم إضافة المستخدم')
 //       setShowAddModal(false)
 //       await loadUsers()
 //     } catch (e) {
 //       console.error(e)
 //       toast.error(e.message.includes('Failed to fetch') ? 'تعذر الاتصال بالسيرفر' : e.message)
 //     } finally {
 //       setSaving(false)
 //     }
 //   }
 //   // إدخال بالإنتر داخل أي حقل في المودال
 //   const onAddKeyDown = (e) => {
 //     if (e.key === 'Enter') addUser()
 //   }
 //   // ================== تعطيل/تفعيل ==================
 //   const toggleActive = async (id) => {
 //     try {
 //       const res = await fetch(`${API}/${id}/toggle`, { method: 'PATCH' })
 //       const data = await res.json().catch(() => ({}))
 //       if (!res.ok) throw new Error(data?.message || 'تعذر تحديث الحالة')
 //       toast.success(data.active ? '🔓 تم تفعيل المستخدم' : '🔒 تم تعطيل المستخدم')
 //       await loadUsers()
 //     } catch (e) {
 //       console.error(e)
 //       toast.error('فشل تحديث الحالة')
 //     }
 //   }
 //   // ================== حذف ==================
 //   const deleteUser = async (id) => {
 //     if (!confirm('هل تريد حذف هذا المستخدم نهائيًا؟')) return
 //     try {
 //       const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
 //       const data = await res.json().catch(() => ({}))
 //       if (!res.ok) throw new Error(data?.message || 'تعذر الحذف')
 //       toast.success('🗑️ تم حذف المستخدم')
 //       setUsers((prev) => prev.filter((u) => u.id !== id))
 //     } catch (e) {
 //       console.error(e)
 //       toast.error('فشل حذف المستخدم')
 //     }
 //   }
 //   // ================== صلاحيات ==================
 //   const allPermissions = [
 //     { key: 'view_reports', label: 'عرض التقارير' },
 //     { key: 'add_sale', label: 'إضافة عملية بيع' },
 //     { key: 'manage_medicines', label: 'إدارة الأدوية' },
 //     { key: 'manage_users', label: 'إدارة المستخدمين' },
 //     { key: 'view_inventory', label: 'عرض المخزون' },
 //   ]
 //   const openPermModal = (u) => {
 //     setSelectedUser(u)
 //     // لو عندك user_permissions جاهزة، استرجعها هنا… مؤقتًا نقرأ من u.permissions إن وجدت
 //     setPermDraft(u.permissions || [])
 //     setShowPermModal(true)
 //   }
 //   const savePermissions = async () => {
 //     if (!selectedUser) return
 //     try {
 //       const res = await fetch(`${API}/${selectedUser.id}/permissions`, {
 //         method: 'PUT',
 //         headers: { 'Content-Type': 'application/json' },
 //         body: JSON.stringify({ permissions: permDraft }),
 //       })
 //       const data = await res.json().catch(() => ({}))
 //       if (!res.ok) throw new Error(data?.message || 'تعذر حفظ الصلاحيات')
 //       toast.success('🔐 تم حفظ الصلاحيات')
 //       setShowPermModal(false)
 //       await loadUsers()
 //     } catch (e) {
 //       console.error(e)
 //       toast.error('فشل حفظ الصلاحيات')
 //     }
 //   }
 //   // ================== فلترة ==================
 //   const filtered = users.filter((u) => {
 //     const q = search.trim().toLowerCase()
 //     return (
 //       !q ||
 //       u.name?.toLowerCase().includes(q) ||
 //       u.username?.toLowerCase().includes(q) ||
 //       u.email?.toLowerCase().includes(q)
 //     )
 //   })
 //   // ================== UI ==================
 //   if (loading) {
 //     return (
 //       <Layout user={user} title="👥 إدارة المستخدمين">
 //         <div dir="rtl" className="flex items-center justify-center h-80">
 //           <p className="text-gray-600">جارٍ تحميل المستخدمين...</p>
 //         </div>
 //       </Layout>
 //     )
 //   }
 //   return (
 //     <Layout user={user} title="👥 إدارة المستخدمين">
 //       <div dir="rtl" className="space-y-6">
 //         {/* شريط علوي */}
 //         <div className="flex flex-col gap-2 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
 //           <input
 //             type="text"
 //             placeholder="🔍 بحث (الاسم/اسم المستخدم/البريد)"
 //             value={search}
 //             onChange={(e) => setSearch(e.target.value)}
 //             className="w-full px-3 py-2 text-sm border rounded-md md:w-1/3"
 //           />
 //           <button
 //             onClick={openAddModal}
 //             className="px-4 py-2 text-sm text-white rounded-md shadow"
 //             style={{ background: theme.colors.success }}
 //           >
 //             ➕ إضافة مستخدم
 //           </button>
 //         </div>
 //         {/* جدول */}
 //         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right border-t border-gray-100 min-w-[900px]">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">الاسم</th>
 //                 <th className="px-3 py-2">اسم المستخدم</th>
 //                 <th className="px-3 py-2">البريد الإلكتروني</th>
 //                 <th className="px-3 py-2">الدور</th>
 //                 <th className="px-3 py-2">الحالة</th>
 //                 <th className="px-3 py-2 text-center">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filtered.length ? (
 //                 filtered.map((u, i) => (
 //                   <tr key={u.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{i + 1}</td>
 //                     <td className="px-3 py-2 font-medium text-gray-700">{u.name}</td>
 //                     <td className="px-3 py-2">{u.username}</td>
 //                     <td className="px-3 py-2">{u.email}</td>
 //                     <td className="px-3 py-2">
 //                       {u.role === 'admin' ? 'مدير' : u.role === 'pharmacist' ? 'صيدلي' : 'كاشير'}
 //                     </td>
 //                     <td className="px-3 py-2">
 //                       <span
 //                         className={`px-2 py-1 text-xs rounded-md ${
 //                           u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
 //                         }`}
 //                       >
 //                         {u.active ? 'نشط' : 'معطل'}
 //                       </span>
 //                     </td>
 //                     <td className="px-3 py-2">
 //                       <div className="flex flex-wrap justify-center gap-2">
 //                         <button
 //                           onClick={() => openPermModal(u)}
 //                           className="px-3 py-1 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //                         >
 //                           ⚙️ صلاحيات
 //                         </button>
 //                         <button
 //                           onClick={() => toggleActive(u.id)}
 //                           className={`px-3 py-1 text-sm rounded-md ${
 //                             u.active
 //                               ? 'bg-red-100 text-red-600 hover:bg-red-200'
 //                               : 'bg-green-100 text-green-600 hover:bg-green-200'
 //                           }`}
 //                         >
 //                           {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
 //                         </button>
 //                         <button
 //                           onClick={() => deleteUser(u.id)}
 //                           className="px-3 py-1 text-sm text-red-600 bg-white border rounded-md hover:bg-red-50"
 //                         >
 //                           🗑️ حذف
 //                         </button>
 //                       </div>
 //                     </td>
 //                   </tr>
 //                 ))
 //               ) : (
 //                 <tr>
 //                   <td colSpan="7" className="py-6 text-center text-gray-500">
 //                     لا توجد نتائج
 //                   </td>
 //                 </tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //       </div>
 //       {/* مودال إضافة مستخدم */}
 //       {showAddModal && (
 //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
 //           <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
 //             <h2 className="mb-3 text-lg font-bold text-center text-gray-800">➕ إضافة مستخدم جديد</h2>
 //             <div className="space-y-3 text-sm" onKeyDown={onAddKeyDown}>
 //               <Field label="الاسم الكامل">
 //                 <input
 //                   type="text"
 //                   value={newUser.name}
 //                   onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
 //                   className="w-full px-3 py-2 border rounded-md"
 //                 />
 //               </Field>
 //               <Field label="اسم المستخدم">
 //                 <input
 //                   type="text"
 //                   value={newUser.username}
 //                   onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
 //                   className="w-full px-3 py-2 border rounded-md"
 //                 />
 //               </Field>
 //               <Field label="البريد الإلكتروني">
 //                 <input
 //                   type="email"
 //                   value={newUser.email}
 //                   onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
 //                   className="w-full px-3 py-2 border rounded-md"
 //                 />
 //               </Field>
 //               <Field label="كلمة المرور">
 //                 <input
 //                   type="password"
 //                   value={newUser.password}
 //                   onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
 //                   className="w-full px-3 py-2 border rounded-md"
 //                 />
 //               </Field>
 //               <Field label="الدور">
 //                 <select
 //                   value={newUser.role}
 //                   onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
 //                   className="w-full px-3 py-2 border rounded-md"
 //                 >
 //                   <option value="admin">مدير</option>
 //                   <option value="pharmacist">صيدلي</option>
 //                   <option value="cashier">كاشير</option>
 //                 </select>
 //               </Field>
 //             </div>
 //             <div className="flex justify-end gap-2 mt-4">
 //               <button
 //                 onClick={() => setShowAddModal(false)}
 //                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
 //                 disabled={saving}
 //               >
 //                 إلغاء
 //               </button>
 //               <button
 //                 onClick={addUser}
 //                 disabled={saving}
 //                 className="px-4 py-2 text-sm text-white rounded-md disabled:opacity-60"
 //                 style={{ background: theme.colors.success }}
 //               >
 //                 {saving ? '...جاري الحفظ' : 'حفظ المستخدم'}
 //               </button>
 //             </div>
 //           </div>
 //         </div>
 //       )}
 //       {/* مودال الصلاحيات */}
 //       {showPermModal && selectedUser && (
 //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
 //           <div className="w-full max-w-lg p-6 space-y-4 bg-white rounded-lg shadow-lg">
 //             <h3 className="text-lg font-semibold text-center text-gray-800">
 //               🔐 صلاحيات: <span className="text-sky-600">{selectedUser.name}</span>
 //             </h3>
 //             <div className="grid grid-cols-2 gap-3 text-sm">
 //               {allPermissions.map((perm) => (
 //                 <label key={perm.key} className="flex items-center gap-2">
 //                   <input
 //                     type="checkbox"
 //                     checked={permDraft.includes(perm.key)}
 //                     onChange={(e) => {
 //                       const checked = e.target.checked
 //                       setPermDraft((prev) =>
 //                         checked ? [...prev, perm.key] : prev.filter((p) => p !== perm.key)
 //                       )
 //                     }}
 //                   />
 //                   <span>{perm.label}</span>
 //                 </label>
 //               ))}
 //             </div>
 //             <div className="flex justify-end gap-2 pt-3 border-t">
 //               <button
 //                 onClick={() => setShowPermModal(false)}
 //                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
 //               >
 //                 إلغاء
 //               </button>
 //               <button
 //                 onClick={savePermissions}
 //                 className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //               >
 //                 💾 حفظ
 //               </button>
 //             </div>
 //           </div>
 //         </div>
 //       )}
 //     </Layout>
 //   )
 // }
 // function Field({ label, children }) {
 //   return (
 //     <div>
 //       <label className="block mb-1 text-gray-600">{label}</label>
 //       {children}
 //     </div>
 //   )
 // }
 // import { useState, useEffect } from 'react'
 // import Layout from '../components/Layout'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // export default function UsersPage() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [users, setUsers] = useState([])
 //   const [search, setSearch] = useState('')
 //   const [selectedUser, setSelectedUser] = useState(null)
 //   const [showAddModal, setShowAddModal] = useState(false)
 //   const [showPermModal, setShowPermModal] = useState(false)
 //   const [showEditModal, setShowEditModal] = useState(false)
 //   const [permissions, setPermissions] = useState([])
 //   const [newUser, setNewUser] = useState({
 //     name: '',
 //     username: '',
 //     email: '',
 //     password: '',
 //     role: 'cashier',
 //   })
 //   const [editUser, setEditUser] = useState({
 //     id: null,
 //     name: '',
 //     email: '',
 //     role: '',
 //   })
 //   const API_URL = 'http://localhost:5000/api/users'
 //   const allPermissions = [
 //     { key: 'manage_users', label: 'إدارة المستخدمين' },
 //     { key: 'manage_medicines', label: 'إدارة الأدوية' },
 //     { key: 'view_inventory', label: 'عرض المخزون' },
 //     { key: 'add_sale', label: 'إضافة عملية بيع' },
 //     { key: 'view_reports', label: 'عرض التقارير' },
 //   ]
 //   // 📥 تحميل المستخدمين
 //   useEffect(() => {
 //     const loadUsers = async () => {
 //       try {
 //         const res = await fetch(API_URL)
 //         const data = await res.json()
 //         setUsers(data)
 //       } catch (err) {
 //         toast.error('❌ فشل تحميل المستخدمين')
 //       }
 //     }
 //     loadUsers()
 //   }, [])
 //   // 🔍 فلترة المستخدمين
 //   const filtered = users.filter((u) =>
 //     u.name?.toLowerCase().includes(search.toLowerCase())
 //   )
 //   // ➕ فتح نافذة إضافة
 //   const openAddModal = () => {
 //     setNewUser({ name: '', username: '', email: '', password: '', role: 'cashier' })
 //     setShowAddModal(true)
 //   }
 //   // 🧩 إضافة مستخدم جديد
 //   const addUser = async () => {
 //     try {
 //       if (!newUser.name || !newUser.username || !newUser.password)
 //         return toast.error('يرجى تعبئة الحقول المطلوبة')
 //       const res = await fetch(API_URL, {
 //         method: 'POST',
 //         headers: { 'Content-Type': 'application/json' },
 //         body: JSON.stringify(newUser),
 //       })
 //       if (!res.ok) throw new Error()
 //       toast.success('✅ تم إضافة المستخدم')
 //       setShowAddModal(false)
 //       const updated = await fetch(API_URL).then((r) => r.json())
 //       setUsers(updated)
 //     } catch (err) {
 //       toast.error('فشل في الإضافة')
 //     }
 //   }
 //   // 🔄 تفعيل / تعطيل
 //   const toggleActive = async (id) => {
 //     try {
 //       const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' })
 //       const data = await res.json()
 //       setUsers((prev) =>
 //         prev.map((u) => (u.id === id ? { ...u, active: data.active } : u))
 //       )
 //       toast.success(`تم ${data.active ? 'تفعيل' : 'تعطيل'} المستخدم`)
 //     } catch {
 //       toast.error('تعذر تعديل الحالة')
 //     }
 //   }
 //   // ⚙️ فتح صلاحيات
 //   const openPermissionsModal = async (u) => {
 //     setSelectedUser(u)
 //     try {
 //       const res = await fetch(`${API_URL}/${u.id}/permissions`)
 //       const data = await res.json()
 //       setPermissions(Array.isArray(data) ? data : [])
 //       setShowPermModal(true)
 //     } catch {
 //       toast.error('تعذر تحميل الصلاحيات')
 //     }
 //   }
 //   // 💾 حفظ الصلاحيات
 //   const savePermissions = async () => {
 //     try {
 //       await fetch(`${API_URL}/${selectedUser.id}/permissions`, {
 //         method: 'PUT',
 //         headers: { 'Content-Type': 'application/json' },
 //         body: JSON.stringify({ permissions }),
 //       })
 //       toast.success('🔐 تم حفظ الصلاحيات')
 //       setShowPermModal(false)
 //     } catch {
 //       toast.error('فشل في الحفظ')
 //     }
 //   }
 //   // ✏️ فتح نافذة تعديل المستخدم
 //   const openEditModal = (u) => {
 //     setEditUser({ id: u.id, name: u.name, email: u.email, role: u.role })
 //     setShowEditModal(true)
 //   }
 //   // 💾 حفظ تعديل المستخدم
 //   const saveEditUser = async () => {
 //     try {
 //       if (!editUser.name || !editUser.email)
 //         return toast.error('الحقول مطلوبة')
 //       const res = await fetch(`${API_URL}/${editUser.id}`, {
 //         method: 'PUT',
 //         headers: { 'Content-Type': 'application/json' },
 //         body: JSON.stringify(editUser),
 //       })
 //       if (!res.ok) throw new Error()
 //       toast.success('✏️ تم تحديث بيانات المستخدم')
 //       setUsers((prev) =>
 //         prev.map((u) => (u.id === editUser.id ? { ...u, ...editUser } : u))
 //       )
 //       setShowEditModal(false)
 //     } catch {
 //       toast.error('فشل التعديل')
 //     }
 //   }
 //   // 🗑️ حذف المستخدم
 //   const deleteUser = async (id) => {
 //     if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return
 //     try {
 //       const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
 //       const data = await res.json()
 //       if (!res.ok) throw new Error(data.message)
 //       toast.success(data.message)
 //       setUsers((prev) => prev.filter((u) => u.id !== id))
 //     } catch {
 //       toast.error('فشل في حذف المستخدم ❌')
 //     }
 //   }
 //   return (
 //     <Layout user={user} title="👥 إدارة المستخدمين">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 🔹 البحث والأزرار */}
 //         <div className="flex flex-col gap-2 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
 //           <input
 //             type="text"
 //             placeholder="🔍 بحث عن مستخدم..."
 //             value={search}
 //             onChange={(e) => setSearch(e.target.value)}
 //             className="w-full px-3 py-2 text-sm border rounded-md md:w-1/3"
 //           />
 //           <button
 //             onClick={openAddModal}
 //             className="px-4 py-2 text-sm text-white rounded-md shadow"
 //             style={{ background: theme.colors.success }}
 //           >
 //             ➕ إضافة مستخدم
 //           </button>
 //         </div>
 //         {/* 📋 الجدول */}
 //         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right border-t border-gray-100">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">الاسم</th>
 //                 <th className="px-3 py-2">اسم المستخدم</th>
 //                 <th className="px-3 py-2">البريد الإلكتروني</th>
 //                 <th className="px-3 py-2">الدور</th>
 //                 <th className="px-3 py-2">الحالة</th>
 //                 <th className="px-3 py-2">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filtered.map((u, i) => (
 //                 <tr key={u.id} className="border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2">{i + 1}</td>
 //                   <td className="px-3 py-2">{u.name}</td>
 //                   <td className="px-3 py-2">{u.username}</td>
 //                   <td className="px-3 py-2">{u.email}</td>
 //                   <td className="px-3 py-2">{u.role}</td>
 //                   <td className="px-3 py-2">
 //                     <span
 //                       className={`px-2 py-1 text-xs rounded-md ${
 //                         u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
 //                       }`}
 //                     >
 //                       {u.active ? 'نشط' : 'معطل'}
 //                     </span>
 //                   </td>
 //                   <td className="flex flex-wrap gap-2 px-3 py-2">
 //                     <button
 //                       onClick={() => openEditModal(u)}
 //                       className="px-3 py-1 text-sm text-white rounded-md bg-amber-500 hover:bg-amber-600"
 //                     >
 //                       ✏️ تعديل
 //                     </button>
 //                     <button
 //                       onClick={() => toggleActive(u.id)}
 //                       className={`px-3 py-1 text-sm rounded-md ${
 //                         u.active
 //                           ? 'bg-red-100 text-red-600 hover:bg-red-200'
 //                           : 'bg-green-100 text-green-600 hover:bg-green-200'
 //                       }`}
 //                     >
 //                       {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
 //                     </button>
 //                     <button
 //                       onClick={() => openPermissionsModal(u)}
 //                       className="px-3 py-1 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //                     >
 //                       ⚙️ صلاحيات
 //                     </button>
 //                     <button
 //                       onClick={() => deleteUser(u.id)}
 //                       className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
 //                     >
 //                       🗑️ حذف
 //                     </button>
 //                   </td>
 //                 </tr>
 //               ))}
 //             </tbody>
 //           </table>
 //           {!filtered.length && (
 //             <div className="p-6 text-center text-gray-500">لا توجد نتائج</div>
 //           )}
 //         </div>
 //       </div>
 //       {/* ✏️ مودال تعديل المستخدم */}
 //       {showEditModal && (
 //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
 //           <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
 //             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
 //               ✏️ تعديل بيانات المستخدم
 //             </h3>
 //             <div className="space-y-3 text-sm">
 //               <input
 //                 type="text"
 //                 value={editUser.name}
 //                 onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
 //                 className="w-full px-3 py-2 border rounded-md"
 //                 placeholder="الاسم الكامل"
 //               />
 //               <input
 //                 type="email"
 //                 value={editUser.email}
 //                 onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
 //                 className="w-full px-3 py-2 border rounded-md"
 //                 placeholder="البريد الإلكتروني"
 //               />
 //               <select
 //                 value={editUser.role}
 //                 onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
 //                 className="w-full px-3 py-2 border rounded-md"
 //               >
 //                 <option value="admin">مدير</option>
 //                 <option value="pharmacist">صيدلي</option>
 //                 <option value="cashier">كاشير</option>
 //               </select>
 //             </div>
 //             <div className="flex justify-end gap-2 pt-3 mt-4 border-t">
 //               <button
 //                 onClick={() => setShowEditModal(false)}
 //                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
 //               >
 //                 إلغاء
 //               </button>
 //               <button
 //                 onClick={saveEditUser}
 //                 className="px-4 py-2 text-sm text-white rounded-md bg-amber-500 hover:bg-amber-600"
 //               >
 //                 💾 حفظ
 //               </button>
 //             </div>
 //           </div>
 //         </div>
 //       )}
 //       {/* ⚙️ مودال الصلاحيات */}
 //       {showPermModal && selectedUser && (
 //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
 //           <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
 //             <h3 className="mb-3 text-lg font-semibold text-center text-gray-800">
 //               🔐 تعديل صلاحيات المستخدم: {selectedUser.name}
 //             </h3>
 //             <div className="grid grid-cols-2 gap-3">
 //               {allPermissions.map((perm) => (
 //                 <label key={perm.key} className="flex items-center gap-2">
 //                   <input
 //                     type="checkbox"
 //                     checked={permissions.includes(perm.key)}
 //                     onChange={(e) => {
 //                       const checked = e.target.checked
 //                       setPermissions((prev) =>
 //                         checked
 //                           ? [...prev, perm.key]
 //                           : prev.filter((p) => p !== perm.key)
 //                       )
 //                     }}
 //                   />
 //                   <span>{perm.label}</span>
 //                 </label>
 //               ))}
 //             </div>
 //             <div className="flex justify-end gap-2 pt-3 mt-4 border-t">
 //               <button
 //                 onClick={() => setShowPermModal(false)}
 //                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
 //               >
 //                 إلغاء
 //               </button>
 //               <button
 //                 onClick={savePermissions}
 //                 className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //               >
 //                 💾 حفظ
 //               </button>
 //             </div>
 //           </div>
 //         </div>
 //       )}
 //     </Layout>
 //   )
 // }
 // import { useState, useEffect } from 'react'
 // import Layout from '../components/Layout'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // export default function UsersPage() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [users, setUsers] = useState([])
 //   const [loading, setLoading] = useState(true)
 //   // Add User Modal
 //   const [showAddModal, setShowAddModal] = useState(false)
 //   const [newUser, setNewUser] = useState({
 //     name: '',
 //     username: '',
 //     email: '',
 //     password: '',
 //     role: 'cashier',
 //   })
 //   // Permissions Modal
 //   const [showPermModal, setShowPermModal] = useState(false)
 //   const [selectedUser, setSelectedUser] = useState(null)
 //   const [selectedPerms, setSelectedPerms] = useState([])
 //   // Search
 //   const [search, setSearch] = useState('')
 //   const API_URL = 'http://localhost:5000/api/users'
 //   const PERMS_LIST = [
 //     { key: 'view_reports', label: 'عرض التقارير' },
 //     { key: 'add_sale', label: 'إضافة عملية بيع' },
 //     { key: 'manage_medicines', label: 'إدارة الأدوية' },
 //     { key: 'manage_users', label: 'إدارة المستخدمين' },
 //     { key: 'view_inventory', label: 'عرض المخزون' },
 //   ]
 //   // Load users
 //   const loadUsers = async () => {
 //     try {
 //       setLoading(true)
 //       const res = await fetch(API_URL)
 //       const data = await res.json()
 //       setUsers(Array.isArray(data) ? data : [])
 //     } catch (e) {
 //       console.error(e)
 //       toast.error('فشل في تحميل المستخدمين')
 //     } finally {
 //       setLoading(false)
 //     }
 //   }
 //   useEffect(() => {
 //     loadUsers()
 //   }, [])
 //   // Open Add User
 //   const openAddModal = () => {
 //     setNewUser({ name: '', username: '', email: '', password: '', role: 'cashier' })
 //     setShowAddModal(true)
 //   }
 //   // Add User
 //   const addUser = async () => {
 //     try {
 //       if (!newUser.name || !newUser.username || !newUser.password) {
 //         return toast.error('يرجى تعبئة الاسم واسم المستخدم وكلمة المرور')
 //       }
 //       const res = await fetch(API_URL, {
 //         method: 'POST',
 //         headers: { 'Content-Type': 'application/json' },
 //         body: JSON.stringify(newUser),
 //       })
 //       if (!res.ok) throw new Error('فشل إضافة المستخدم')
 //       toast.success('✅ تم إضافة المستخدم')
 //       setShowAddModal(false)
 //       await loadUsers()
 //     } catch (e) {
 //       console.error(e)
 //       toast.error('حدث خطأ أثناء الإضافة')
 //     }
 //   }
 //   // 🔄 تفعيل / تعطيل المستخدم
 // const toggleActive = async (id) => {
 //   try {
 //     const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' })
 //     if (!res.ok) throw new Error('فشل تحديث الحالة')
 //     const data = await res.json()
 //     setUsers((prev) =>
 //       prev.map((u) => (u.id === id ? { ...u, active: data.active } : u))
 //     )
 //     toast.success(`تم ${data.active ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح ✅`)
 //   } catch (err) {
 //     console.error(err)
 //     toast.error('حدث خطأ أثناء تحديث الحالة ❌')
 //   }
 // }
 //   // Toggle Active
 //   // const toggleActive = async (u) => {
 //   //   try {
 //   //     const next = !u.active
 //   //     const res = await fetch(`${API_URL}/${u.id}/active`, {
 //   //       method: 'PATCH',
 //   //       headers: { 'Content-Type': 'application/json' },
 //   //       body: JSON.stringify({ active: next }),
 //   //     })
 //   //     if (!res.ok) throw new Error()
 //   //     toast.success(next ? '🔓 تم تفعيل الحساب' : '🔒 تم تعطيل الحساب')
 //   //     await loadUsers()
 //   //   } catch {
 //   //     toast.error('تعذر تعديل حالة الحساب')
 //   //   }
 //   // }
 //   // Delete User
 //   // 🗑️ حذف مستخدم
 // const deleteUser = async (u) => {
 //   try {
 //     if (!confirm(`هل تريد حذف المستخدم: ${u.name} ؟`)) return
 //     const res = await fetch(`${API_URL}/${u.id}`, { method: 'DELETE' })
 //     if (!res.ok) throw new Error()
 //     toast.success('🗑️ تم الحذف')
 //     await loadUsers()
 //   } catch {
 //     toast.error('تعذر حذف المستخدم')
 //   }
 // }
 //   // Open Permissions Modal
 //   const openPerms = async (u) => {
 //     try {
 //       setSelectedUser(u)
 //       setSelectedPerms([])
 //       // نحاول جلب صلاحيات المستخدم من الباك إند (لو متاحة)
 //       // متوقع: GET /api/users/:id/permissions -> { permissions: string[] }
 //       const res = await fetch(`${API_URL}/${u.id}/permissions`)
 //       if (res.ok) {
 //         const data = await res.json()
 //         setSelectedPerms(Array.isArray(data.permissions) ? data.permissions : [])
 //       } else {
 //         // لو ما في اندبوينت، نقرأ من خاصية permissions إن وجدت داخل users list
 //         setSelectedPerms(Array.isArray(u.permissions) ? u.permissions : [])
 //       }
 //       setShowPermModal(true)
 //     } catch (e) {
 //       console.error(e)
 //       toast.error('تعذر جلب الصلاحيات')
 //     }
 //   }
 //   // Save Permissions
 //   const savePerms = async () => {
 //     if (!selectedUser) return
 //     try {
 //       const res = await fetch(`${API_URL}/${selectedUser.id}/permissions`, {
 //         method: 'PUT',
 //         headers: { 'Content-Type': 'application/json' },
 //         body: JSON.stringify({ permissions: selectedPerms }),
 //       })
 //       if (!res.ok) throw new Error()
 //       toast.success('🔐 تم حفظ الصلاحيات')
 //       setShowPermModal(false)
 //       await loadUsers()
 //     } catch {
 //       toast.error('تعذر حفظ الصلاحيات')
 //     }
 //   }
 //   // Filters
 //   const filtered = users.filter((u) =>
 //     (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
 //     (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
 //     (u.email || '').toLowerCase().includes(search.toLowerCase())
 //   )
 //   return (
 //     <Layout user={user} title="👥 إدارة المستخدمين">
 //       <div dir="rtl" className="space-y-6">
 //         {/* شريط التحكم */}
 //         <div className="flex flex-col gap-2 p-4 bg-white border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
 //           <input
 //             type="text"
 //             placeholder="🔍 بحث (الاسم / اسم المستخدم / البريد)"
 //             value={search}
 //             onChange={(e) => setSearch(e.target.value)}
 //             className="w-full px-3 py-2 text-sm border rounded-md md:w-1/3"
 //           />
 //           <button
 //             onClick={openAddModal}
 //             className="px-4 py-2 text-sm text-white rounded-md shadow"
 //             style={{ background: theme.colors.success }}
 //           >
 //             ➕ إضافة مستخدم
 //           </button>
 //         </div>
 //         {/* الجدول */}
 //         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right border-t border-gray-100 min-w-[980px]">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">الاسم</th>
 //                 <th className="px-3 py-2">اسم المستخدم</th>
 //                 <th className="px-3 py-2">البريد الإلكتروني</th>
 //                 <th className="px-3 py-2">الدور</th>
 //                 <th className="px-3 py-2">الحالة</th>
 //                 <th className="px-3 py-2 text-center">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {loading ? (
 //                 <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={7}>جارٍ التحميل…</td></tr>
 //               ) : filtered.length ? (
 //                 filtered.map((u, i) => (
 //                   <tr key={u.id} className="border-t hover:bg-gray-50">
 //                     <td className="px-3 py-2">{i + 1}</td>
 //                     <td className="px-3 py-2">{u.name}</td>
 //                     <td className="px-3 py-2">{u.username}</td>
 //                     <td className="px-3 py-2">{u.email}</td>
 //                     <td className="px-3 py-2">{u.role}</td>
 //                     <td className="px-3 py-2">
 //                       <span
 //                         className={`px-2 py-1 text-xs rounded-md ${
 //                           u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
 //                         }`}
 //                       >
 //                         {u.active ? 'نشط' : 'معطل'}
 //                       </span>
 //                     </td>
 //                     <td className="px-3 py-2">
 //                       <div className="flex flex-wrap justify-center gap-2">
 //                         <button
 //                           onClick={() => openPerms(u)}
 //                           className="px-3 py-1 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //                           title="تعديل الصلاحيات"
 //                         >
 //                           ⚙️ صلاحيات
 //                         </button>
 //                         <button
 //                           onClick={() => toggleActive(u)}
 //                           className={`px-3 py-1 text-sm rounded-md ${
 //                             u.active
 //                               ? 'bg-red-100 text-red-600 hover:bg-red-200'
 //                               : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
 //                           }`}
 //                           title={u.active ? 'تعطيل' : 'تفعيل'}
 //                         >
 //                           {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
 //                         </button>
 //                         <button
 //                           onClick={() => deleteUser(u)}
 //                           className="px-3 py-1 text-sm text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50"
 //                           title="حذف"
 //                         >
 //                           🗑️ حذف
 //                         </button>
 //                       </div>
 //                     </td>
 //                   </tr>
 //                 ))
 //               ) : (
 //                 <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={7}>لا توجد نتائج</td></tr>
 //               )}
 //             </tbody>
 //           </table>
 //         </div>
 //       </div>
 //       {/* مودال إضافة مستخدم */}
 //       {showAddModal && (
 //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
 //           <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
 //             <h2 className="mb-3 text-lg font-bold text-center text-gray-800">➕ إضافة مستخدم جديد</h2>
 //             <div className="space-y-3 text-sm">
 //               <Field label="الاسم الكامل">
 //                 <input
 //                   type="text"
 //                   value={newUser.name}
 //                   onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
 //                   className="w-full px-3 py-2 border rounded-md"
 //                 />
 //               </Field>
 //               <Field label="اسم المستخدم">
 //                 <input
 //                   type="text"
 //                   value={newUser.username}
 //                   onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
 //                   className="w-full px-3 py-2 border rounded-md"
 //                 />
 //               </Field>
 //               <Field label="البريد الإلكتروني">
 //                 <input
 //                   type="email"
 //                   value={newUser.email}
 //                   onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
 //                   className="w-full px-3 py-2 border rounded-md"
 //                 />
 //               </Field>
 //               <Field label="كلمة المرور">
 //                 <input
 //                   type="password"
 //                   value={newUser.password}
 //                   onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
 //                   className="w-full px-3 py-2 border rounded-md"
 //                 />
 //               </Field>
 //               <Field label="الدور">
 //                 <select
 //                   value={newUser.role}
 //                   onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
 //                   className="w-full px-3 py-2 border rounded-md"
 //                 >
 //                   <option value="admin">مدير</option>
 //                   <option value="pharmacist">صيدلي</option>
 //                   <option value="cashier">كاشير</option>
 //                 </select>
 //               </Field>
 //             </div>
 //             <div className="flex justify-end gap-2 mt-4">
 //               <button
 //                 onClick={() => setShowAddModal(false)}
 //                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
 //               >
 //                 إلغاء
 //               </button>
 //               <button
 //                 onClick={addUser}
 //                 className="px-4 py-2 text-sm text-white rounded-md"
 //                 style={{ background: theme.colors.success }}
 //               >
 //                 حفظ المستخدم
 //               </button>
 //             </div>
 //           </div>
 //         </div>
 //       )}
 //       {/* مودال الصلاحيات */}
 //       {showPermModal && selectedUser && (
 //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
 //           <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
 //             <h3 className="mb-2 text-lg font-semibold text-center text-gray-800">
 //               🔐 صلاحيات: <span className="text-sky-600">{selectedUser.name}</span>
 //             </h3>
 //             <div className="grid grid-cols-2 gap-3 text-sm">
 //               {PERMS_LIST.map((perm) => (
 //                 <label key={perm.key} className="flex items-center gap-2">
 //                   <input
 //                     type="checkbox"
 //                     checked={selectedPerms.includes(perm.key)}
 //                     onChange={(e) => {
 //                       const checked = e.target.checked
 //                       setSelectedPerms((prev) =>
 //                         checked ? [...prev, perm.key] : prev.filter((p) => p !== perm.key)
 //                       )
 //                     }}
 //                   />
 //                   <span>{perm.label}</span>
 //                 </label>
 //               ))}
 //             </div>
 //             <div className="flex justify-end gap-2 mt-4">
 //               <button
 //                 onClick={() => setShowPermModal(false)}
 //                 className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
 //               >
 //                 إغلاق
 //               </button>
 //               <button
 //                 onClick={savePerms}
 //                 className="px-4 py-2 text-sm text-white rounded-md"
 //                 style={{ background: theme.colors.primary }}
 //               >
 //                 حفظ الصلاحيات
 //               </button>
 //             </div>
 //           </div>
 //         </div>
 //       )}
 //     </Layout>
 //   )
 // }
 // /* ============ عناصر مساعدة بسيطة ============ */
 // function Field({ label, children }) {
 //   return (
 //     <div>
 //       <label className="block mb-1 text-gray-600">{label}</label>
 //       {children}
 //     </div>
 //   )
 // }
 // import { useState, useEffect } from 'react'
 // import Layout from '../components/Layout'
 // import toast from 'react-hot-toast'
 // export default function UsersPage() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [users, setUsers] = useState([])
 //   const [selectedUser, setSelectedUser] = useState(null)
 //   const [showModal, setShowModal] = useState(false)
 //   const [search, setSearch] = useState('')
 //   const API_URL = 'http://localhost:5000/api/users'
 //   // 🧾 تحميل المستخدمين من الباك-إند
 //   useEffect(() => {
 //     const fetchUsers = async () => {
 //       try {
 //         const res = await fetch(API_URL)
 //         const data = await res.json()
 //         if (!res.ok) throw new Error(data.message)
 //         setUsers(data)
 //       } catch (err) {
 //         console.error(err)
 //         toast.error('فشل تحميل المستخدمين')
 //       }
 //     }
 //     fetchUsers()
 //   }, [])
 //   // 🔹 جميع الصلاحيات الممكنة
 //   const allPermissions = [
 //     { key: 'view_reports', label: 'عرض التقارير' },
 //     { key: 'add_sale', label: 'إضافة عملية بيع' },
 //     { key: 'manage_medicines', label: 'إدارة الأدوية' },
 //     { key: 'manage_users', label: 'إدارة المستخدمين' },
 //     { key: 'view_inventory', label: 'عرض المخزون' },
 //   ]
 //   // ➕ إضافة مستخدم جديد
 //   const addUser = async () => {
 //     try {
 //       const newUser = {
 //         name: `مستخدم ${users.length + 1}`,
 //         username: `user${users.length + 1}`,
 //         email: `user${users.length + 1}@pharmacy.com`,
 //         password: '123456',
 //         role: 'cashier',
 //       }
 //       const res = await fetch(API_URL, {
 //         method: 'POST',
 //         headers: { 'Content-Type': 'application/json' },
 //         body: JSON.stringify(newUser),
 //       })
 //       const data = await res.json()
 //       if (!res.ok) throw new Error(data.message)
 //       toast.success('✅ تم إضافة المستخدم بنجاح')
 //       setUsers((prev) => [...prev, { ...newUser, id: data.id, active: 1, permissions: ['add_sale'] }])
 //     } catch (err) {
 //       toast.error('فشل إضافة المستخدم')
 //       console.error(err)
 //     }
 //   }
 //   // 🔒 تفعيل / تعطيل المستخدم
 //   const toggleActive = async (id) => {
 //     try {
 //       const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' })
 //       const data = await res.json()
 //       if (!res.ok) throw new Error(data.message)
 //       setUsers((prev) =>
 //         prev.map((u) => (u.id === id ? { ...u, active: data.active } : u))
 //       )
 //       toast.success('✅ تم تحديث الحالة')
 //     } catch (err) {
 //       toast.error('فشل تحديث الحالة')
 //       console.error(err)
 //     }
 //   }
 //   // ⚙️ فتح نافذة الصلاحيات
 //   const openPermissionsModal = (user) => {
 //     setSelectedUser({ ...user })
 //     setShowModal(true)
 //   }
 //   // 💾 حفظ الصلاحيات
 //   const savePermissions = async () => {
 //     try {
 //       const res = await fetch(`${API_URL}/${selectedUser.id}/permissions`, {
 //         method: 'PUT',
 //         headers: { 'Content-Type': 'application/json' },
 //         body: JSON.stringify({ permissions: selectedUser.permissions }),
 //       })
 //       if (!res.ok) throw new Error('خطأ في الحفظ')
 //       setUsers((prev) =>
 //         prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
 //       )
 //       toast.success('🔐 تم حفظ الصلاحيات')
 //       setShowModal(false)
 //     } catch (err) {
 //       toast.error('فشل حفظ الصلاحيات')
 //       console.error(err)
 //     }
 //   }
 //   // 🔍 فلترة المستخدمين
 //   const filteredUsers = users.filter((u) =>
 //     u.name.toLowerCase().includes(search.toLowerCase())
 //   )
 //   return (
 //     <Layout user={user} title="👥 إدارة المستخدمين">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 🔹 شريط الأدوات */}
 //         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between bg-gradient-to-br from-sky-50 to-white">
 //           <input
 //             type="text"
 //             value={search}
 //             onChange={(e) => setSearch(e.target.value)}
 //             placeholder="🔍 بحث عن مستخدم..."
 //             className="w-full px-3 py-2 text-sm border rounded-md md:w-1/3"
 //           />
 //           <button
 //             onClick={addUser}
 //             className="px-4 py-2 text-sm text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700"
 //           >
 //             ➕ إضافة مستخدم
 //           </button>
 //         </div>
 //         {/* 🔹 جدول المستخدمين */}
 //         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right border-t border-gray-100">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">الاسم</th>
 //                 <th className="px-3 py-2">الدور</th>
 //                 <th className="px-3 py-2">البريد</th>
 //                 <th className="px-3 py-2">الحالة</th>
 //                 <th className="px-3 py-2">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filteredUsers.map((u, idx) => (
 //                 <tr key={u.id} className="border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2">{idx + 1}</td>
 //                   <td className="px-3 py-2 font-medium text-gray-700">{u.name}</td>
 //                   <td className="px-3 py-2">
 //                     {u.role === 'admin'
 //                       ? 'مدير'
 //                       : u.role === 'pharmacist'
 //                       ? 'صيدلي'
 //                       : 'كاشير'}
 //                   </td>
 //                   <td className="px-3 py-2">{u.email}</td>
 //                   <td className="px-3 py-2">
 //                     <span
 //                       className={`px-2 py-1 text-xs rounded-md ${
 //                         u.active
 //                           ? 'bg-green-100 text-green-700'
 //                           : 'bg-red-100 text-red-600'
 //                       }`}
 //                     >
 //                       {u.active ? 'نشط' : 'معطل'}
 //                     </span>
 //                   </td>
 //                   <td className="flex flex-wrap gap-2 px-3 py-2">
 //                     <button
 //                       onClick={() => openPermissionsModal(u)}
 //                       className="px-3 py-1 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //                     >
 //                       ⚙️ صلاحيات
 //                     </button>
 //                     <button
 //                       onClick={() => toggleActive(u.id)}
 //                       className={`px-3 py-1 text-sm rounded-md ${
 //                         u.active
 //                           ? 'bg-red-100 text-red-600 hover:bg-red-200'
 //                           : 'bg-green-100 text-green-600 hover:bg-green-200'
 //                       }`}
 //                     >
 //                       {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
 //                     </button>
 //                   </td>
 //                 </tr>
 //               ))}
 //             </tbody>
 //           </table>
 //           {filteredUsers.length === 0 && (
 //             <div className="p-6 text-center text-gray-500">لا توجد نتائج مطابقة.</div>
 //           )}
 //         </div>
 //         {/* 🔹 نافذة تعديل الصلاحيات */}
 //         {showModal && selectedUser && (
 //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
 //             <div className="w-full max-w-lg p-6 space-y-4 bg-white rounded-lg shadow-lg">
 //               <h3 className="text-lg font-semibold text-center text-gray-800">
 //                 🔐 تعديل صلاحيات المستخدم:{" "}
 //                 <span className="text-sky-600">{selectedUser.name}</span>
 //               </h3>
 //               <div className="grid grid-cols-2 gap-3">
 //                 {allPermissions.map((perm) => (
 //                   <label key={perm.key} className="flex items-center gap-2">
 //                     <input
 //                       type="checkbox"
 //                       checked={selectedUser.permissions.includes(perm.key)}
 //                       onChange={(e) => {
 //                         const checked = e.target.checked
 //                         setSelectedUser((prev) => ({
 //                           ...prev,
 //                           permissions: checked
 //                             ? [...prev.permissions, perm.key]
 //                             : prev.permissions.filter((p) => p !== perm.key),
 //                         }))
 //                       }}
 //                     />
 //                     <span>{perm.label}</span>
 //                   </label>
 //                 ))}
 //               </div>
 //               <div className="flex justify-end gap-2 pt-3 border-t">
 //                 <button
 //                   onClick={() => setShowModal(false)}
 //                   className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
 //                 >
 //                   إلغاء
 //                 </button>
 //                 <button
 //                   onClick={savePermissions}
 //                   className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //                 >
 //                   💾 حفظ
 //                 </button>
 //               </div>
 //             </div>
 //           </div>
 //         )}
 //       </div>
 //     </Layout>
 //   )
 // }
 // // pages/users.js
 // import { useState, useEffect } from 'react'
 // import Layout from '../components/Layout'
 // import toast from 'react-hot-toast'
 // import theme from '../theme'
 // export default function UsersPage() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [users, setUsers] = useState([])
 //   const [selectedUser, setSelectedUser] = useState(null)
 //   const [showModal, setShowModal] = useState(false)
 //   const [search, setSearch] = useState('')
 //   const API_URL = 'http://localhost:5000/api/users'
 //   // 🧾 تحميل البيانات من الباك إند
 //   useEffect(() => {
 //     fetchUsers()
 //   }, [])
 //   const fetchUsers = async () => {
 //     try {
 //       const res = await fetch(API_URL)
 //       const data = await res.json()
 //       setUsers(data)
 //     } catch (err) {
 //       toast.error('❌ فشل تحميل المستخدمين')
 //     }
 //   }
 //   // ➕ إضافة مستخدم جديد
 //   const addUser = async () => {
 //     try {
 //       const newUser = {
 //         name: 'مستخدم جديد',
 //         username: 'user' + Date.now(),
 //         email: `user${Date.now()}@pharmacy.com`,
 //         password: '123456',
 //         role: 'cashier',
 //       }
 //       const res = await fetch(API_URL, {
 //         method: 'POST',
 //         headers: { 'Content-Type': 'application/json' },
 //         body: JSON.stringify(newUser),
 //       })
 //       if (!res.ok) throw new Error()
 //       toast.success('✅ تم إضافة المستخدم بنجاح')
 //       fetchUsers()
 //     } catch {
 //       toast.error('⚠️ فشل إضافة المستخدم')
 //     }
 //   }
 //   // ⚙️ فتح نافذة تعديل الصلاحيات
 //   const openPermissionsModal = (user) => {
 //     setSelectedUser({ ...user })
 //     setShowModal(true)
 //   }
 //   // 💾 حفظ الصلاحيات
 //   const savePermissions = async () => {
 //     try {
 //       const res = await fetch(`${API_URL}/${selectedUser.id}/permissions`, {
 //         method: 'PUT',
 //         headers: { 'Content-Type': 'application/json' },
 //         body: JSON.stringify({ permissions: selectedUser.permissions }),
 //       })
 //       if (!res.ok) throw new Error()
 //       toast.success('🔐 تم حفظ الصلاحيات بنجاح')
 //       setShowModal(false)
 //       fetchUsers()
 //     } catch {
 //       toast.error('❌ فشل تحديث الصلاحيات')
 //     }
 //   }
 //   // 🔄 تفعيل / تعطيل المستخدم
 //   const toggleActive = async (id) => {
 //     try {
 //       const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' })
 //       if (!res.ok) throw new Error()
 //       toast.success('✅ تم تحديث الحالة')
 //       fetchUsers()
 //     } catch {
 //       toast.error('❌ خطأ في التحديث')
 //     }
 //   }
 //   // الصلاحيات الممكنة
 //   const allPermissions = [
 //     { key: 'view_reports', label: 'عرض التقارير' },
 //     { key: 'add_sale', label: 'إضافة عملية بيع' },
 //     { key: 'manage_medicines', label: 'إدارة الأدوية' },
 //     { key: 'manage_users', label: 'إدارة المستخدمين' },
 //     { key: 'view_inventory', label: 'عرض المخزون' },
 //   ]
 //   const filtered = users.filter((u) =>
 //     u.name.toLowerCase().includes(search.toLowerCase())
 //   )
 //   return (
 //     <Layout user={user} title="👥 إدارة المستخدمين">
 //       <div dir="rtl" className="space-y-6">
 //         {/* البحث + إضافة */}
 //         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm md:flex-row md:justify-between bg-gradient-to-br from-sky-50 to-white">
 //           <input
 //             value={search}
 //             onChange={(e) => setSearch(e.target.value)}
 //             placeholder="🔍 بحث..."
 //             className="px-3 py-2 text-sm border rounded-md md:w-1/3"
 //           />
 //           <button
 //             onClick={addUser}
 //             className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
 //           >
 //             ➕ إضافة مستخدم
 //           </button>
 //         </div>
 //         {/* جدول المستخدمين */}
 //         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">الاسم</th>
 //                 <th className="px-3 py-2">الدور</th>
 //                 <th className="px-3 py-2">البريد الإلكتروني</th>
 //                 <th className="px-3 py-2">الحالة</th>
 //                 <th className="px-3 py-2">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filtered.map((u, i) => (
 //                 <tr key={u.id} className="border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2">{i + 1}</td>
 //                   <td className="px-3 py-2">{u.name}</td>
 //                   <td className="px-3 py-2">
 //                     {u.role === 'admin'
 //                       ? 'مدير'
 //                       : u.role === 'pharmacist'
 //                       ? 'صيدلي'
 //                       : 'كاشير'}
 //                   </td>
 //                   <td className="px-3 py-2">{u.email}</td>
 //                   <td className="px-3 py-2">
 //                     <span
 //                       className={`px-2 py-1 rounded text-xs ${
 //                         u.active
 //                           ? 'bg-green-100 text-green-700'
 //                           : 'bg-red-100 text-red-600'
 //                       }`}
 //                     >
 //                       {u.active ? 'نشط' : 'معطل'}
 //                     </span>
 //                   </td>
 //                   <td className="flex gap-2 px-3 py-2">
 //                     <button
 //                       onClick={() => openPermissionsModal(u)}
 //                       className="px-3 py-1 text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //                     >
 //                       ⚙️ صلاحيات
 //                     </button>
 //                     <button
 //                       onClick={() => toggleActive(u.id)}
 //                       className={`px-3 py-1 rounded-md ${
 //                         u.active
 //                           ? 'bg-red-100 text-red-600 hover:bg-red-200'
 //                           : 'bg-green-100 text-green-600 hover:bg-green-200'
 //                       }`}
 //                     >
 //                       {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
 //                     </button>
 //                   </td>
 //                 </tr>
 //               ))}
 //             </tbody>
 //           </table>
 //         </div>
 //         {/* نافذة الصلاحيات */}
 //         {showModal && selectedUser && (
 //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
 //             <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
 //               <h3 className="mb-4 text-lg font-bold text-center">
 //                 🔐 صلاحيات {selectedUser.name}
 //               </h3>
 //               <div className="grid grid-cols-2 gap-3">
 //                 {allPermissions.map((perm) => (
 //                   <label key={perm.key} className="flex gap-2">
 //                     <input
 //                       type="checkbox"
 //                       checked={selectedUser.permissions?.includes(perm.key)}
 //                       onChange={(e) => {
 //                         const checked = e.target.checked
 //                         setSelectedUser((prev) => ({
 //                           ...prev,
 //                           permissions: checked
 //                             ? [...prev.permissions, perm.key]
 //                             : prev.permissions.filter((p) => p !== perm.key),
 //                         }))
 //                       }}
 //                     />
 //                     {perm.label}
 //                   </label>
 //                 ))}
 //               </div>
 //               <div className="flex justify-end gap-2 mt-5">
 //                 <button
 //                   onClick={() => setShowModal(false)}
 //                   className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
 //                 >
 //                   إلغاء
 //                 </button>
 //                 <button
 //                   onClick={savePermissions}
 //                   className="px-4 py-2 text-white rounded bg-sky-600 hover:bg-sky-700"
 //                 >
 //                   حفظ
 //                 </button>
 //               </div>
 //             </div>
 //           </div>
 //         )}
 //       </div>
 //     </Layout>
 //   )
 // }
 // import { useState, useEffect } from 'react'
 // import Layout from '../components/Layout'
 // import theme from '../theme'
 // import toast from 'react-hot-toast'
 // export default function UsersPage() {
 //   const [user] = useState({ name: 'المدير أحمد', role: 'admin' })
 //   const [users, setUsers] = useState([])
 //   const [selectedUser, setSelectedUser] = useState(null)
 //   const [showModal, setShowModal] = useState(false)
 //   const [search, setSearch] = useState('')
 //   // 🔹 بيانات المستخدمين
 //   useEffect(() => {
 //     setUsers([
 //       {
 //         id: 1,
 //         name: 'أحمد',
 //         role: 'pharmacist',
 //         email: 'ahmed@pharmacy.com',
 //         active: true,
 //         permissions: ['view_reports', 'add_sale', 'manage_medicines'],
 //       },
 //       {
 //         id: 2,
 //         name: 'محمد',
 //         role: 'cashier',
 //         email: 'mohamed@pharmacy.com',
 //         active: true,
 //         permissions: ['add_sale'],
 //       },
 //       {
 //         id: 3,
 //         name: 'مها',
 //         role: 'admin',
 //         email: 'maha@pharmacy.com',
 //         active: true,
 //         permissions: ['view_reports', 'manage_medicines', 'manage_users'],
 //       },
 //     ])
 //   }, [])
 //   // 🔹 الصلاحيات المتاحة
 //   const allPermissions = [
 //     { key: 'view_reports', label: 'عرض التقارير' },
 //     { key: 'add_sale', label: 'إضافة عملية بيع' },
 //     { key: 'manage_medicines', label: 'إدارة الأدوية' },
 //     { key: 'manage_users', label: 'إدارة المستخدمين' },
 //     { key: 'view_inventory', label: 'عرض المخزون' },
 //   ]
 //   // 🔸 تفعيل/تعطيل الحساب
 //   const toggleActive = (id) => {
 //     setUsers((prev) =>
 //       prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
 //     )
 //     toast.success('✅ تم تحديث حالة الحساب بنجاح')
 //   }
 //   // 🔸 فتح نافذة تعديل الصلاحيات
 //   const openPermissionsModal = (user) => {
 //     setSelectedUser({ ...user })
 //     setShowModal(true)
 //   }
 //   // 🔸 حفظ التعديلات
 //   const savePermissions = () => {
 //     setUsers((prev) =>
 //       prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
 //     )
 //     setShowModal(false)
 //     toast.success('🔐 تم حفظ الصلاحيات بنجاح')
 //   }
 //   // 🔸 إضافة مستخدم جديد
 //   const addUser = () => {
 //     const newUser = {
 //       id: Date.now(),
 //       name: 'مستخدم جديد',
 //       role: 'cashier',
 //       email: `user${users.length + 1}@pharmacy.com`,
 //       active: true,
 //       permissions: ['add_sale'],
 //     }
 //     setUsers([...users, newUser])
 //     toast.success('👤 تم إضافة مستخدم جديد')
 //   }
 //   // 🔹 فلترة المستخدمين
 //   const filteredUsers = users.filter((u) =>
 //     u.name.toLowerCase().includes(search.toLowerCase())
 //   )
 //   return (
 //     <Layout user={user} title="👥 إدارة المستخدمين">
 //       <div dir="rtl" className="space-y-6">
 //         {/* 🔹 شريط التحكم */}
 //         <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm md:flex-row md:items-center md:justify-between bg-gradient-to-br from-sky-50 to-white">
 //           <input
 //             type="text"
 //             value={search}
 //             onChange={(e) => setSearch(e.target.value)}
 //             placeholder="🔍 بحث عن مستخدم..."
 //             className="w-full px-3 py-2 text-sm border rounded-md md:w-1/3"
 //           />
 //           <button
 //             onClick={addUser}
 //             className="px-4 py-2 text-sm text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700"
 //           >
 //             ➕ إضافة مستخدم
 //           </button>
 //         </div>
 //         {/* 🔹 جدول المستخدمين */}
 //         <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
 //           <table className="w-full text-sm text-right border-t border-gray-100">
 //             <thead className="text-gray-600 bg-gray-50">
 //               <tr>
 //                 <th className="px-3 py-2">#</th>
 //                 <th className="px-3 py-2">الاسم</th>
 //                 <th className="px-3 py-2">الدور</th>
 //                 <th className="px-3 py-2">البريد الإلكتروني</th>
 //                 <th className="px-3 py-2">الحالة</th>
 //                 <th className="px-3 py-2">الإجراءات</th>
 //               </tr>
 //             </thead>
 //             <tbody>
 //               {filteredUsers.map((u, idx) => (
 //                 <tr key={u.id} className="border-t hover:bg-gray-50">
 //                   <td className="px-3 py-2">{idx + 1}</td>
 //                   <td className="px-3 py-2 font-medium text-gray-700">{u.name}</td>
 //                   <td className="px-3 py-2">{u.role === 'admin' ? 'مدير' : u.role === 'pharmacist' ? 'صيدلي' : 'كاشير'}</td>
 //                   <td className="px-3 py-2 text-gray-600">{u.email}</td>
 //                   <td className="px-3 py-2">
 //                     <span
 //                       className={`px-2 py-1 text-xs rounded-md ${
 //                         u.active
 //                           ? 'bg-green-100 text-green-700'
 //                           : 'bg-red-100 text-red-600'
 //                       }`}
 //                     >
 //                       {u.active ? 'نشط' : 'معطل'}
 //                     </span>
 //                   </td>
 //                   <td className="flex flex-wrap gap-2 px-3 py-2">
 //                     <button
 //                       onClick={() => openPermissionsModal(u)}
 //                       className="px-3 py-1 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //                     >
 //                       ⚙️ صلاحيات
 //                     </button>
 //                     <button
 //                       onClick={() => toggleActive(u.id)}
 //                       className={`px-3 py-1 text-sm rounded-md ${
 //                         u.active
 //                           ? 'bg-red-100 text-red-600 hover:bg-red-200'
 //                           : 'bg-green-100 text-green-600 hover:bg-green-200'
 //                       }`}
 //                     >
 //                       {u.active ? '🔒 تعطيل' : '🔓 تفعيل'}
 //                     </button>
 //                   </td>
 //                 </tr>
 //               ))}
 //             </tbody>
 //           </table>
 //           {filteredUsers.length === 0 && (
 //             <div className="p-6 text-center text-gray-500">لا توجد نتائج مطابقة.</div>
 //           )}
 //         </div>
 //         {/* 🔹 نافذة تعديل الصلاحيات */}
 //         {showModal && selectedUser && (
 //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
 //             <div className="w-full max-w-lg p-6 space-y-4 bg-white rounded-lg shadow-lg">
 //               <h3 className="text-lg font-semibold text-center text-gray-800">
 //                 🔐 تعديل صلاحيات المستخدم: <span className="text-sky-600">{selectedUser.name}</span>
 //               </h3>
 //               <div className="grid grid-cols-2 gap-3">
 //                 {allPermissions.map((perm) => (
 //                   <label key={perm.key} className="flex items-center gap-2">
 //                     <input
 //                       type="checkbox"
 //                       checked={selectedUser.permissions.includes(perm.key)}
 //                       onChange={(e) => {
 //                         const checked = e.target.checked
 //                         setSelectedUser((prev) => ({
 //                           ...prev,
 //                           permissions: checked
 //                             ? [...prev.permissions, perm.key]
 //                             : prev.permissions.filter((p) => p !== perm.key),
 //                         }))
 //                       }}
 //                     />
 //                     <span>{perm.label}</span>
 //                   </label>
 //                 ))}
 //               </div>
 //               <div className="flex justify-end gap-2 pt-3 border-t">
 //                 <button
 //                   onClick={() => setShowModal(false)}
 //                   className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
 //                 >
 //                   إلغاء
 //                 </button>
 //                 <button
 //                   onClick={savePermissions}
 //                   className="px-4 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
 //                 >
 //                   💾 حفظ
 //                 </button>
 //               </div>
 //             </div>
 //           </div>
 //         )}
 //       </div>
 //     </Layout>
 //   )
 // }
_s(UsersPage, "qvVykarVfLWhDWuroN9NAUf36hU=");
_c = UsersPage;
var _c;
__turbopack_context__.k.register(_c, "UsersPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/users.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/users";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/users.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/users\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/users.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f8500986._.js.map