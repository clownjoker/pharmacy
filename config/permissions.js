// config/permissions.js

// 🔹 كل الصلاحيات الممكنة في النظام (STANDARD PRO)
export const ALL_PERMISSIONS = [
  // عامة
  { key: 'view_dashboard', label: 'عرض لوحة التحكم' },

  // المبيعات و الكاشير
  { key: 'add_sale', label: 'إضافة عملية بيع (كاشير)' },
  { key: 'view_sales', label: 'عرض المبيعات' },
  { key: 'manage_returns', label: 'إدارة المرتجعات' },

  // الأدوية و المخزون
  { key: 'manage_medicines', label: 'إدارة الأدوية' },
  { key: 'view_inventory', label: 'عرض المخزون' },
  { key: 'adjust_inventory', label: 'توريد/خصم من المخزون' },

  // الحسابات و التقارير
  { key: 'view_accounts', label: 'عرض حسابات و تقارير المبيعات' },
  { key: 'view_reports', label: 'عرض التقارير العامة' },
  { key: 'view_shift_report', label: 'تقرير الشِفت' },

  // الشفتات
  { key: 'open_shift', label: 'فتح شفت' },
  { key: 'close_shift', label: 'إغلاق شفت' },

  // سجلات النشاط
  { key: 'view_activity_log', label: 'عرض سجل النشاط' },

  // المستخدمين
  { key: 'manage_users', label: 'إدارة المستخدمين والصلاحيات' },
];

// 🔹 أدوار النظام
export const ROLE_LABELS = {
  admin: 'مدير النظام',
  pharmacist: 'صيدلي',
  cashier: 'كاشير',
};

// 🔹 الصلاحيات الافتراضية لكل دور
export const ROLE_DEFAULT_PERMISSIONS = {
  admin: ALL_PERMISSIONS.map((p) => p.key),

  pharmacist: [
    'view_dashboard',
    'add_sale',
    'view_sales',
    'manage_returns',
    'manage_medicines',
    'view_inventory',
    'adjust_inventory',
    'view_reports',
    'view_shift_report',
    'view_activity_log',
  ],

  cashier: [
    'view_dashboard',
    'add_sale',
    'view_sales',
    'manage_returns',
    'open_shift',
    'close_shift',
    'view_shift_report',
  ],
};

// 🔹 ربط كل صفحة (route) بالصلاحيات / الأدوار المطلوبة
// ملاحظة: لو الصفحة ما موجودة عندك تجاهلها أو عدّل الأسماء حسب ملفاتك
export const PAGE_ACCESS_RULES = {
  '/dashboard': { roles: ['admin', 'pharmacist', 'cashier'] },

  '/cashier': { permissions: ['add_sale'] },
  '/sales': { permissions: ['view_sales'] },

  '/inventory': { permissions: ['view_inventory'] },
  '/pharmacist': { permissions: ['manage_medicines'] },

  '/accounts': { permissions: ['view_accounts'] },
  '/reports': { permissions: ['view_reports'] },

  '/shift': { permissions: ['open_shift', 'close_shift'] },
  '/shift-report': { permissions: ['view_shift_report'] },

  '/activity-log': { permissions: ['view_activity_log'] },

  '/users': { permissions: ['manage_users'] },

  // صفحات عامة لا تحتاج صلاحيات
  '/403': { public: true },
  '/': { public: true },
};
