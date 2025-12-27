export type UserStatus = "active" | "suspended" | "pending" | "rejected";
export type ViolationType = "policy-violation" | "fraud" | "abuse" | "payment-issue" | "other";
export type RideStatus = "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "assigned" | "in-delivery" | "completed" | "cancelled";

export interface Violation {
  id: string;
  type: ViolationType;
  reason: string;
  date: string;
  resolved: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileType: "regular" | "student" | "worker";
  status: UserStatus;
  wallet: number;
  joinedAt: string;
  lastActive: string;
  violations: Violation[];
  totalRides: number;
  rating: number;
}

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  bike: string;
  status: UserStatus;
  approvedAt?: string;
  violations: Violation[];
  rating: number;
  totalTrips: number;
  earnings: number;
  cancelRate: number;
}

export interface Shop {
  id: number;
  name: string;
  owner: string;
  phone: string;
  category: string;
  status: UserStatus;
  registeredAt: string;
  violations: Violation[];
  productCount: number;
  ordersAccepted: number;
  ordersRejected: number;
  rating: number;
}

export interface Ride {
  id: string;
  customerId: number;
  driverId?: number;
  pickupLocation: string;
  dropoffLocation: string;
  status: RideStatus;
  fare: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  distance: number;
  penalties: number;
}

export interface Order {
  id: string;
  customerId: number;
  shopId: number;
  driverId?: number;
  status: OrderStatus;
  total: number;
  items: string[];
  createdAt: string;
  completedAt?: string;
  penalties: number;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discount: number;
  applicableTo: ("student" | "worker" | "regular")[];
  active: boolean;
  createdAt: string;
  usageCount: number;
}

export interface FareRule {
  baseFare: number;
  perKm: number;
  perMinute: number;
  studentDiscount: number;
  workerDiscount: number;
  gracePeriod: number;
  noShowPenalty: number;
  maxDetourPercentage: number;
}

export interface FinancialData {
  totalUserWallet: number;
  topUpToday: number;
  rideRevenue: number;
  orderRevenue: number;
  refundsToday: number;
  driverPayoutsDue: number;
}

export class AdminController {
  private customers: Customer[] = [];
  private drivers: Driver[] = [];
  private shops: Shop[] = [];
  private rides: Ride[] = [];
  private orders: Order[] = [];
  private promotions: Promotion[] = [];
  private fareRules: FareRule = {
    baseFare: 500,
    perKm: 50,
    perMinute: 10,
    studentDiscount: 15,
    workerDiscount: 10,
    gracePeriod: 5,
    noShowPenalty: 1000,
    maxDetourPercentage: 10,
  };
  private financialData: FinancialData = {
    totalUserWallet: 0,
    topUpToday: 0,
    rideRevenue: 0,
    orderRevenue: 0,
    refundsToday: 0,
    driverPayoutsDue: 0,
  };
  private listeners: Array<(state: any) => void> = [];

  constructor(
    initialCustomers: Customer[] = [],
    initialDrivers: Driver[] = [],
    initialShops: Shop[] = [],
    initialRides: Ride[] = [],
    initialOrders: Order[] = []
  ) {
    this.customers = initialCustomers.slice();
    this.drivers = initialDrivers.slice();
    this.shops = initialShops.slice();
    this.rides = initialRides.slice();
    this.orders = initialOrders.slice();
  }

  getState() {
    return {
      customers: this.customers.slice(),
      drivers: this.drivers.slice(),
      shops: this.shops.slice(),
      rides: this.rides.slice(),
      orders: this.orders.slice(),
      promotions: this.promotions.slice(),
      fareRules: this.fareRules,
      financialData: this.financialData,
    };
  }

  subscribe(fn: (state: any) => void) {
    this.listeners.push(fn);
    fn(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }

  /* ===== CUSTOMER MANAGEMENT ===== */
  getCustomers(filter?: { status?: UserStatus; profileType?: string }) {
    return this.customers.filter((c) => {
      if (filter?.status && c.status !== filter.status) return false;
      if (filter?.profileType && c.profileType !== filter.profileType) return false;
      return true;
    });
  }

  suspendCustomer(id: number, reason: string) {
    this.customers = this.customers.map((c) =>
      c.id === id
        ? {
            ...c,
            status: "suspended",
            violations: [...c.violations, { id: `v-${Date.now()}`, type: "policy-violation", reason, date: new Date().toISOString(), resolved: false }],
          }
        : c
    );
    this.notify();
  }

  unsuspendCustomer(id: number) {
    this.customers = this.customers.map((c) =>
      c.id === id ? { ...c, status: "active" } : c
    );
    this.notify();
  }

  /* ===== DRIVER MANAGEMENT ===== */
  getDrivers(filter?: { status?: UserStatus }) {
    return this.drivers.filter((d) => {
      if (filter?.status && d.status !== filter.status) return false;
      return true;
    });
  }

  approveDriver(id: number) {
    this.drivers = this.drivers.map((d) =>
      d.id === id ? { ...d, status: "active", approvedAt: new Date().toISOString() } : d
    );
    this.notify();
  }

  rejectDriver(id: number, reason: string) {
    this.drivers = this.drivers.map((d) =>
      d.id === id
        ? {
            ...d,
            status: "rejected",
            violations: [...d.violations, { id: `v-${Date.now()}`, type: "other", reason, date: new Date().toISOString(), resolved: false }],
          }
        : d
    );
    this.notify();
  }

  suspendDriver(id: number, reason: string) {
    this.drivers = this.drivers.map((d) =>
      d.id === id
        ? {
            ...d,
            status: "suspended",
            violations: [...d.violations, { id: `v-${Date.now()}`, type: "policy-violation", reason, date: new Date().toISOString(), resolved: false }],
          }
        : d
    );
    this.notify();
  }

  unsuspendDriver(id: number) {
    this.drivers = this.drivers.map((d) =>
      d.id === id ? { ...d, status: "active" } : d
    );
    this.notify();
  }

  /* ===== SHOP MANAGEMENT ===== */
  getShops(filter?: { status?: UserStatus }) {
    return this.shops.filter((s) => {
      if (filter?.status && s.status !== filter.status) return false;
      return true;
    });
  }

  approveShop(id: number) {
    this.shops = this.shops.map((s) =>
      s.id === id ? { ...s, status: "active" } : s
    );
    this.notify();
  }

  rejectShop(id: number, reason: string) {
    this.shops = this.shops.map((s) =>
      s.id === id
        ? {
            ...s,
            status: "rejected",
            violations: [...s.violations, { id: `v-${Date.now()}`, type: "other", reason, date: new Date().toISOString(), resolved: false }],
          }
        : s
    );
    this.notify();
  }

  suspendShop(id: number, reason: string) {
    this.shops = this.shops.map((s) =>
      s.id === id
        ? {
            ...s,
            status: "suspended",
            violations: [...s.violations, { id: `v-${Date.now()}`, type: "policy-violation", reason, date: new Date().toISOString(), resolved: false }],
          }
        : s
    );
    this.notify();
  }

  unsuspendShop(id: number) {
    this.shops = this.shops.map((s) =>
      s.id === id ? { ...s, status: "active" } : s
    );
    this.notify();
  }

  /* ===== RIDE MANAGEMENT ===== */
  getRides(filter?: { status?: RideStatus; driverId?: number }) {
    return this.rides.filter((r) => {
      if (filter?.status && r.status !== filter.status) return false;
      if (filter?.driverId && r.driverId !== filter.driverId) return false;
      return true;
    });
  }

  assignRide(rideId: string, driverId: number) {
    this.rides = this.rides.map((r) =>
      r.id === rideId ? { ...r, driverId, status: "assigned" } : r
    );
    this.notify();
  }

  reassignRide(rideId: string, newDriverId: number) {
    this.assignRide(rideId, newDriverId);
  }

  updateRideStatus(rideId: string, status: RideStatus) {
    this.rides = this.rides.map((r) =>
      r.id === rideId
        ? {
            ...r,
            status,
            startedAt: status === "in-progress" ? new Date().toISOString() : r.startedAt,
            completedAt: status === "completed" ? new Date().toISOString() : r.completedAt,
          }
        : r
    );
    this.notify();
  }

  /* ===== ORDER MANAGEMENT ===== */
  getOrders(filter?: { status?: OrderStatus; shopId?: number }) {
    return this.orders.filter((o) => {
      if (filter?.status && o.status !== filter.status) return false;
      if (filter?.shopId && o.shopId !== filter.shopId) return false;
      return true;
    });
  }

  updateOrderStatus(orderId: string, status: OrderStatus) {
    this.orders = this.orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status,
            completedAt: status === "completed" ? new Date().toISOString() : o.completedAt,
          }
        : o
    );
    this.notify();
  }

  assignOrder(orderId: string, driverId: number) {
    this.orders = this.orders.map((o) =>
      o.id === orderId ? { ...o, driverId, status: "assigned" } : o
    );
    this.notify();
  }

  /* ===== PRICING & PROMOTIONS ===== */
  updateFareRules(rules: Partial<FareRule>) {
    this.fareRules = { ...this.fareRules, ...rules };
    this.notify();
  }

  getFareRules() {
    return this.fareRules;
  }

  addPromotion(promotion: Omit<Promotion, "id" | "createdAt" | "usageCount">) {
    const newPromo: Promotion = {
      ...promotion,
      id: `promo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };
    this.promotions.push(newPromo);
    this.notify();
  }

  updatePromotion(id: string, updates: Partial<Promotion>) {
    this.promotions = this.promotions.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    this.notify();
  }

  deletePromotion(id: string) {
    this.promotions = this.promotions.filter((p) => p.id !== id);
    this.notify();
  }

  getPromotions() {
    return this.promotions;
  }

  /* ===== FINANCIAL DATA ===== */
  updateFinancialData(data: Partial<FinancialData>) {
    this.financialData = { ...this.financialData, ...data };
    this.notify();
  }

  getFinancialData() {
    return this.financialData;
  }

  getDriverEarnings(driverId: number) {
    return this.drivers.find((d) => d.id === driverId)?.earnings || 0;
  }

  calculateDailyMetrics() {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const ridestoday = this.rides.filter((r) => new Date(r.createdAt) >= todayStart).length;
    const ordersToday = this.orders.filter((o) => new Date(o.createdAt) >= todayStart).length;
    const activeDrivers = this.drivers.filter((d) => d.status === "active").length;
    const activeUsers = this.customers.filter((c) => c.status === "active").length;

    return { ridestoday, ordersToday, activeDrivers, activeUsers };
  }
}

/* ===== SINGLETON WITH SAMPLE DATA ===== */
const sampleCustomers: Customer[] = [
  {
    id: 1,
    name: "Alice Mbuh",
    email: "alice@example.com",
    phone: "+237 6XX XXX XXX",
    profileType: "student",
    status: "active",
    wallet: 5000,
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date().toISOString(),
    violations: [],
    totalRides: 12,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Bob Tango",
    email: "bob@example.com",
    phone: "+237 6YY YYY YYY",
    profileType: "worker",
    status: "active",
    wallet: 8000,
    joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date().toISOString(),
    violations: [],
    totalRides: 25,
    rating: 4.9,
  },
];

const sampleDrivers: Driver[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+237 6XX XXX XXX",
    bike: "Yamaha XTZ",
    status: "active",
    approvedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    violations: [],
    rating: 4.7,
    totalTrips: 145,
    earnings: 285000,
    cancelRate: 2,
  },
];

const sampleShops: Shop[] = [
  {
    id: 1,
    name: "Fresh Market",
    owner: "Mr. Njie",
    phone: "+237 6ZZ ZZZ ZZZ",
    category: "Groceries",
    status: "active",
    registeredAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    violations: [],
    productCount: 234,
    ordersAccepted: 189,
    ordersRejected: 5,
    rating: 4.6,
  },
];

const sampleRides: Ride[] = [
  {
    id: "ride-001",
    customerId: 1,
    driverId: 1,
    pickupLocation: "Downtown Mall",
    dropoffLocation: "Airport",
    status: "completed",
    fare: 4500,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1200000).toISOString(),
    distance: 12.5,
    penalties: 0,
  },
];

const sampleOrders: Order[] = [
  {
    id: "order-001",
    customerId: 1,
    shopId: 1,
    driverId: 1,
    status: "completed",
    total: 8500,
    items: ["Bread", "Milk", "Eggs"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    penalties: 0,
  },
];

export const adminController = new AdminController(
  sampleCustomers,
  sampleDrivers,
  sampleShops,
  sampleRides,
  sampleOrders
);

// Initialize financial data with realistic values
adminController.updateFinancialData({
  totalUserWallet: 13000,
  topUpToday: 25000,
  rideRevenue: 185000,
  orderRevenue: 245000,
  refundsToday: 5000,
  driverPayoutsDue: 142500,
});

// Add sample promotions
adminController.addPromotion({
  name: "Student 15% Off",
  description: "Special discount for students",
  discount: 15,
  applicableTo: ["student"],
  active: true,
});

adminController.addPromotion({
  name: "Worker Morning Pass",
  description: "Cheap rides in morning hours",
  discount: 20,
  applicableTo: ["worker"],
  active: true,
});

