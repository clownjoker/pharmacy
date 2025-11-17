// context/InventoryContext.js
import { createContext, useContext, useState } from "react";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "باراسيتامول 500mg",
      sku: "PRC500",
      company: "صيدليات المتحدة",
      category: "مسكنات",
      purchasePrice: 8,     // سعر الشراء
      price: 12,            // سعر البيع
      quantity: 30,
      minQty: 10,
      expiryDate: "2025-04-10",
      stockHistory: [],
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
      stockHistory: [],
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
      stockHistory: [],
    },
  ]);

  const getProduct = (id) =>
    products.find((p) => p.id === Number(id));

  const updateStock = (id, qty, type = "in") => {
    setProducts((prev) =>
      prev.map((p) => {
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
              date: new Date().toLocaleString(),
            },
          ],
        };
      })
    );
  };

  const decreaseStockOnSale = (id, qty) => updateStock(id, qty, "out");
  const increaseStockOnReturn = (id, qty) => updateStock(id, qty, "in");

  const getWarnings = (p) => {
    const warnings = [];
    if (!p) return warnings;

    if (p.expiryDate) {
      const daysLeft =
        (new Date(p.expiryDate) - new Date()) /
        (1000 * 60 * 60 * 24);

      if (daysLeft < 0) warnings.push("❌ المنتج منتهي الصلاحية!");
      else if (daysLeft < 30)
        warnings.push(
          `⚠️ المنتج شارف على الانتهاء خلال ${Math.ceil(daysLeft)} يوم`
        );
    }

    if (p.quantity < (p.minQty || 5)) {
      warnings.push("🔴 المخزون أقل من الحد الأدنى");
    }

    return warnings;
  };

  const printInventoryReport = () => {
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
            ${products
              .map(
                (p) => `
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
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `);

    w.document.close();
    w.print();
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === Number(id) ? { ...p, ...updates } : p))
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        setProducts,
        getProduct,
        getWarnings,
        updateStock,
        decreaseStockOnSale,
        increaseStockOnReturn,
        printInventoryReport,
        updateProduct,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}













// // context/InventoryContext.js
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
