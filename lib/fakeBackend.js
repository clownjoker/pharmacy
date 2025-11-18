// lib/fakeBackend.js
// باك إند وهمي بسيط باستخدام localStorage
// يربط: المبيعات + المخزون + الشِفت

const KEYS = {
  INVENTORY: 'pharmacy_inventory',
  SALES: 'pharmacy_sales',
  SHIFTS: 'pharmacy_shifts',
}

function isBrowser() {
  return typeof window !== 'undefined' && !!window.localStorage
}

function read(key, fallback) {
  if (!isBrowser()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // تجاهل الأخطاء (مثلاً امتلاء المساحة)
  }
}

// --------- المخزون ---------
export function seedInventory(initialProducts = []) {
  if (!isBrowser()) return
  const existing = window.localStorage.getItem(KEYS.INVENTORY)
  if (!existing && initialProducts.length) {
    write(KEYS.INVENTORY, initialProducts)
  }
}

export function getInventory() {
  return read(KEYS.INVENTORY, [])
}

export function saveInventory(products) {
  write(KEYS.INVENTORY, products || [])
}

// خصم/إرجاع الكمية حسب نوع العملية
export function applySaleToInventory(invoice) {
  const items = invoice.items || []
  if (!items.length) return

  const inventory = getInventory()
  let changed = false

  const updated = inventory.map((p) => {
    const match = items.find(
      (it) =>
        it.productId === p.id ||
        it.id === p.id ||
        (it.barcode && it.barcode === p.barcode)
    )
    if (!match) return p

    const factor = invoice.type === 'return' ? 1 : -1
    const newQty =
      Number(p.qty || 0) + factor * Number(match.qty || 0)

    changed = true
    return {
      ...p,
      qty: newQty < 0 ? 0 : newQty,
    }
  })

  if (changed) {
    saveInventory(updated)
  }
}

// --------- المبيعات (Sales) ---------
export function getSales() {
  return read(KEYS.SALES, [])
}

export function saveSales(sales) {
  write(KEYS.SALES, sales || [])
}

export function addSale(invoice) {
  const sales = getSales()

  const normalized = {
    id: invoice.id,
    date: invoice.date || new Date().toISOString(),
    customer: invoice.customer || 'عميل نقدي',
    cashier: invoice.cashier || 'غير محدد',
    payment: invoice.payment || 'cash', // cash | card | wallet ..
    type: invoice.type || 'sale', // sale | return
    items: invoice.items || [],
    discount: Number(invoice.discount || 0),
    tax: Number(invoice.tax || 0),
    total: Number(invoice.total || 0),
  }

  sales.push(normalized)
  saveSales(sales)
  addShiftEventFromInvoice(normalized)
  return normalized
}

// --------- الشِفت / سجل العمليات ---------
function getShiftEvents() {
  return read(KEYS.SHIFTS, [])
}

function saveShiftEvents(events) {
  write(KEYS.SHIFTS, events || [])
}

export function addShiftEventFromInvoice(invoice) {
  const events = getShiftEvents()
  events.push({
    id: `sale-${invoice.id}`,
    type: invoice.type === 'return' ? 'return' : 'sale',
    cashier: invoice.cashier || 'غير محدد',
    date: invoice.date || new Date().toISOString(),
    total: Number(invoice.total || 0),
  })
  saveShiftEvents(events)
}

export function openShift(cashierName) {
  const events = getShiftEvents()
  const now = new Date().toISOString()
  events.push({
    id: `open-${cashierName}-${now}`,
    type: 'shift_open',
    cashier: cashierName,
    date: now,
  })
  saveShiftEvents(events)
}

export function closeShift(cashierName) {
  const events = getShiftEvents()
  const now = new Date().toISOString()
  events.push({
    id: `close-${cashierName}-${now}`,
    type: 'shift_close',
    cashier: cashierName,
    date: now,
  })
  saveShiftEvents(events)
}

export function getShiftEventsByCashier(cashierName) {
  const events = getShiftEvents()
  if (!cashierName) return events
  return events.filter((e) => e.cashier === cashierName)
}
