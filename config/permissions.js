module.exports.PERMISSIONS = {
  MENU_READ: 10001,
  MENU_MODIFY: 10002,
  MENU_DELETE: 10003,
  MENU_BULK_READ: 10004,
  ORDER_READ: 20001,
  ORDER_COOK: 20002,
  ORDER_CASHIER: 20003,
  ORDER_DELIVERY: 20004,
  ORDER_MODIFY: 20005
};

module.exports.PERMISSIONS_FULL = [
  { code: 10001, title: "Menu Read", description: "See Specific Menu Items" },
  { code: 10002, title: "Menu Modify", description: "Modify Menu Items" },
  { code: 20001, title: "Order Read", description: "See Orders" },
  { code: 20005, title: "Order Status Modify", description: "Modify Orders Status" },
  { code: 40000, title: "See Permissions", description: "See Others Permissions" },
  { code: 40001, title: "Change Permission", description: "Change Others Permissions" }
];