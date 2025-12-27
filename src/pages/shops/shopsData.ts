export type ShopCategory = "Food" | "Groceries" | "Pharmacy" | "Stationery" | "Electronics";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
}

export interface Shop {
  id: string;
  name: string;
  logo: string;
  category: ShopCategory;
  distance: string;
  zone: string;
  status: "open" | "closed";
  closingTime?: string;
  rating: number;
  products: Product[];
}

export interface CartItem {
  productId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
}

// Mock Shops Data
export const shops: Shop[] = [
  {
    id: "shop-1",
    name: "Fresh Market",
    logo: "🛒",
    category: "Groceries",
    distance: "0.5 km",
    zone: "Zone 1",
    status: "open",
    closingTime: "22:00",
    rating: 4.5,
    products: [
      {
        id: "prod-1",
        name: "Rice (2kg)",
        price: 3500,
        category: "Staples",
        image: "🍚",
        description: "Premium long-grain rice",
      },
      {
        id: "prod-2",
        name: "Oil (1L)",
        price: 2800,
        category: "Cooking",
        image: "🫒",
      },
      {
        id: "prod-3",
        name: "Sugar (1kg)",
        price: 2200,
        category: "Staples",
        image: "🍯",
      },
      {
        id: "prod-4",
        name: "Flour (2kg)",
        price: 1800,
        category: "Staples",
        image: "🌾",
      },
      {
        id: "prod-5",
        name: "Eggs (12pcs)",
        price: 3200,
        category: "Dairy",
        image: "🥚",
      },
      {
        id: "prod-6",
        name: "Milk (1L)",
        price: 1500,
        category: "Dairy",
        image: "🥛",
      },
      {
        id: "prod-7",
        name: "Tomatoes (3kg)",
        price: 2500,
        category: "Vegetables",
        image: "🍅",
      },
      {
        id: "prod-8",
        name: "Onions (2kg)",
        price: 1800,
        category: "Vegetables",
        image: "🧅",
      },
    ],
  },
  {
    id: "shop-2",
    name: "Pharma Care",
    logo: "💊",
    category: "Pharmacy",
    distance: "0.8 km",
    zone: "Zone 1",
    status: "open",
    closingTime: "20:00",
    rating: 4.8,
    products: [
      {
        id: "prod-9",
        name: "Paracetamol 500mg",
        price: 1200,
        category: "Pain Relief",
        image: "💊",
      },
      {
        id: "prod-10",
        name: "Cough Syrup (200ml)",
        price: 2500,
        category: "Cough",
        image: "🧴",
      },
      {
        id: "prod-11",
        name: "Antiseptic (500ml)",
        price: 1800,
        category: "First Aid",
        image: "🧴",
      },
      {
        id: "prod-12",
        name: "Vitamins (30 tabs)",
        price: 4500,
        category: "Supplements",
        image: "💊",
      },
    ],
  },
  {
    id: "shop-3",
    name: "Food Hub",
    logo: "🍕",
    category: "Food",
    distance: "1.2 km",
    zone: "Zone 1",
    status: "open",
    closingTime: "23:00",
    rating: 4.3,
    products: [
      {
        id: "prod-13",
        name: "Chicken Sandwich",
        price: 4500,
        category: "Sandwiches",
        image: "🥪",
      },
      {
        id: "prod-14",
        name: "Fries (Large)",
        price: 2000,
        category: "Snacks",
        image: "🍟",
      },
      {
        id: "prod-15",
        name: "Coca Cola (330ml)",
        price: 1500,
        category: "Drinks",
        image: "🥤",
      },
      {
        id: "prod-16",
        name: "Beef Burger",
        price: 5500,
        category: "Burgers",
        image: "🍔",
      },
      {
        id: "prod-17",
        name: "Spicy Wings (6pcs)",
        price: 6000,
        category: "Main",
        image: "🍗",
      },
    ],
  },
  {
    id: "shop-4",
    name: "Office Pro",
    logo: "📝",
    category: "Stationery",
    distance: "0.3 km",
    zone: "Zone 1",
    status: "open",
    closingTime: "18:00",
    rating: 4.2,
    products: [
      {
        id: "prod-18",
        name: "A4 Paper (500 sheets)",
        price: 3500,
        category: "Paper",
        image: "📄",
      },
      {
        id: "prod-19",
        name: "Pen Set (12 colors)",
        price: 2200,
        category: "Writing",
        image: "✏️",
      },
      {
        id: "prod-20",
        name: "Notebook (100 pages)",
        price: 1800,
        category: "Books",
        image: "📓",
      },
      {
        id: "prod-21",
        name: "Stapler",
        price: 2500,
        category: "Office",
        image: "📎",
      },
    ],
  },
  {
    id: "shop-5",
    name: "Tech Store",
    logo: "🔌",
    category: "Electronics",
    distance: "2.0 km",
    zone: "Zone 2",
    status: "closed",
    closingTime: "17:00",
    rating: 4.6,
    products: [
      {
        id: "prod-22",
        name: "Phone Charger",
        price: 3500,
        category: "Charging",
        image: "🔌",
      },
      {
        id: "prod-23",
        name: "USB Cable",
        price: 1500,
        category: "Cables",
        image: "🔌",
      },
      {
        id: "prod-24",
        name: "Power Bank (10000mAh)",
        price: 8500,
        category: "Power",
        image: "🔋",
      },
      {
        id: "prod-25",
        name: "Screen Protector",
        price: 2000,
        category: "Protection",
        image: "🛡️",
      },
    ],
  },
];

export const categories: ShopCategory[] = [
  "Food",
  "Groceries",
  "Pharmacy",
  "Stationery",
  "Electronics",
];
