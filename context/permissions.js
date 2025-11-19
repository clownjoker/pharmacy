// جميع الصلاحيات الأساسية
export const ROLE_DEFAULT_PERMISSIONS = {
  admin: [
    "view_dashboard",
    "manage_products",
    "view_inventory",
    "update_inventory",
    "view_sales",
    "add_sale",
    "return_sale",
    "open_shift",
    "close_shift",
    "view_shift_report",
    "manage_users",
    "view_reports",
    "view_accounts",
    "view_activity_log"
  ],

  pharmacist: [
    "manage_products",
    "view_inventory",
    "update_inventory",
    "add_sale",
    "view_sales",
    "view_reports",
    "view_activity_log"
  ],

  cashier: [
    "add_sale",
    "return_sale",
    "open_shift",
    "close_shift",
    "view_sales"
  ]
};

// الصلاحيات المطلوبة لكل صفحة
export const ROUTE_PERMISSIONS = {
  "/dashboard": ["view_dashboard"],

  "/products": ["manage_products"],
  "/inventory": ["view_inventory"],
  "/pharmacist": ["manage_products"],

  "/sales": ["view_sales"],
  "/cashier": ["add_sale"],
  "/shift": ["open_shift"],
  "/shift-report": ["view_shift_report"],
  "/return": ["return_sale"],

  "/accounts": ["view_accounts"],

  "/reports": ["view_reports"],
  "/activity-log": ["view_activity_log"],

  "/users": ["manage_users"]
};
