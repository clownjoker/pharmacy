// context/ShiftContext.js
import { createContext, useContext, useEffect, useState } from "react";

const ShiftContext = createContext(null);
const STORAGE_KEY = "pharmacy_shifts_v1";

function loadInitialShifts() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function ShiftProvider({ children }) {
  const [shifts, setShifts] = useState([]);

  // تحميل من localStorage عند أول تشغيل على المتصفح
  useEffect(() => {
    const data = loadInitialShifts();
    setShifts(data);
  }, []);

  // حفظ في localStorage عند التغيير
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shifts));
    } catch {
      // تجاهل أي خطأ تخزين
    }
  }, [shifts]);

  const currentShift =
    shifts.find((s) => !s.closedAt) || null;

  const openShift = (cashier, note = "") => {
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
        invoicesCount: 0,
      },
    };

    setShifts((prev) => [...prev, newShift]);
    return newShift;
  };

  const closeCurrentShift = (note = "") => {
    if (!currentShift) return;
    const now = new Date().toISOString();
    setShifts((prev) =>
      prev.map((s) =>
        s.id === currentShift.id
          ? { ...s, closedAt: now, closingNote: note || "" }
          : s
      )
    );
  };

  const registerSaleInShift = (invoice) => {
    setShifts((prev) => {
      const idx = prev.findIndex((s) => !s.closedAt);
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
        invoicesCount: 0,
      };

      const updatedTotals = {
        totalSales: totals.totalSales + sign * amount,
        invoicesCount: totals.invoicesCount + 1,
        totalCash:
          totals.totalCash +
          (payment === "cash" ? sign * amount : 0),
        totalCard:
          totals.totalCard +
          (payment === "card" ? sign * amount : 0),
        totalWallet:
          totals.totalWallet +
          (payment === "wallet" ? sign * amount : 0),
      };

      const updatedShift = {
        ...shift,
        totals: updatedTotals,
        sales: [...(shift.sales || []), invoice],
      };

      const copy = [...prev];
      copy[idx] = updatedShift;
      return copy;
    });
  };

  const getShiftById = (id) =>
    shifts.find((s) => s.id === id) || null;

  return (
    <ShiftContext.Provider
      value={{
        shifts,
        currentShift,
        openShift,
        closeCurrentShift,
        registerSaleInShift,
        getShiftById,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
}

export function useShift() {
  const ctx = useContext(ShiftContext);
  if (!ctx) {
    throw new Error("useShift must be used within a ShiftProvider");
  }
  return ctx;
}

