// mock/data.js

export const mockUsers = [
  { id: 1, name: "أحمد", role: "admin", username: "admin", password: "1234" },
  { id: 2, name: "محمد", role: "pharmacist", username: "pharma", password: "1234" },
  { id: 3, name: "سارة", role: "cashier", username: "cashier", password: "1234" }
];

export const mockMedicines = [
  { id: 1, name: "باراسيتامول", qty: 120, price: 8, category: "مسكنات" },
  { id: 2, name: "أموكسيسلين", qty: 45, price: 18, category: "مضادات حيوية" },
  { id: 3, name: "بنادول اكسترا", qty: 80, price: 12, category: "مسكنات" }
];

export const mockInventory = [
  { id: 1, name: "شراب حساسية", qty: 24, cost: 5 },
  { id: 2, name: "مرهم حروق", qty: 10, cost: 7 },
];

export const mockSales = [
  { id: 1, user: "محمد", total: 32, items: 3, date: "2025-01-05" },
  { id: 2, user: "سارة", total: 18, items: 1, date: "2025-01-05" },
];

export const mockProfit = [
  { month: "يناير", total: 3200, profit: 1200, growth: 15, user: "أحمد" },
  { month: "فبراير", total: 4100, profit: 1500, growth: 25, user: "محمد" },
  { month: "مارس", total: 3800, profit: 1400, growth: 10, user: "مها" },
];
