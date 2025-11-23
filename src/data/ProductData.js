export const categories = [
  {
    id: "women",
    name: "Women",
    slug: "women",
    description: "Explore our curated collection of women's fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    subcategories: ["shirts", "polos", "fashion-items", "dresses"],
  },
  {
    id: "men",
    name: "Men",
    slug: "men",
    description: "Discover timeless men's fashion essentials",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
    subcategories: ["shirts", "polos", "fashion-items", "jackets"],
  },
];

export const subcategories = [
  {
    id: "shirts",
    name: "Shirts",
    slug: "shirts",
    description: "Classic and contemporary shirt designs",
    category: ["women", "men"],
  },
  {
    id: "polos",
    name: "Polos",
    slug: "polos",
    description: "Casual comfort meets style",
    category: ["women", "men"],
  },
  {
    id: "fashion-items",
    name: "Fashion Items",
    slug: "fashion-items",
    description: "Trending fashion pieces",
    category: ["women", "men"],
  },
  {
    id: "dresses",
    name: "Dresses",
    slug: "dresses",
    description: "Elegant dresses for every occasion",
    category: ["women"],
  },
  {
    id: "jackets",
    name: "Jackets",
    slug: "jackets",
    description: "Premium outerwear collection",
    category: ["men"],
  },
];

export const products = [
  // Women's Shirts
  {
    id: "ws001",
    name: "Classic White Button-Down Shirt",
    slug: "classic-white-button-down",
    category: "women",
    subcategory: "shirts",
    price: 89.99,
    salePrice: null,
    currency: "USD",
    inStock: true,
    stockCount: 45,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
      "https://images.unsplash.com/photo-1624206112918-f140f087f9d5",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Ivory", "Light Blue"],
    description:
      "A timeless wardrobe essential crafted from premium cotton. Perfect for both professional and casual settings.",
    features: [
      "100% Premium Cotton",
      "Wrinkle-resistant",
      "Tailored fit",
      "Machine washable",
    ],
    rating: 4.8,
    reviews: 127,
    tags: ["bestseller", "new-arrival", "classic"],
    material: "100% Cotton",
    care: "Machine wash cold, tumble dry low",
    madeIn: "Italy",
  },
  {
    id: "ws002",
    name: "Silk Blend Relaxed Fit Shirt",
    slug: "silk-blend-relaxed-shirt",
    category: "women",
    subcategory: "shirts",
    price: 129.99,
    salePrice: 99.99,
    currency: "USD",
    inStock: true,
    stockCount: 28,
    images: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Cream", "Rose", "Navy", "Black"],
    description:
      "Luxurious silk blend shirt with a relaxed silhouette for effortless elegance.",
    features: [
      "60% Silk 40% Cotton",
      "Relaxed fit",
      "French seams",
      "Dry clean recommended",
    ],
    rating: 4.9,
    reviews: 89,
    tags: ["sale", "luxury", "trending"],
    material: "60% Silk, 40% Cotton",
    care: "Dry clean only",
    madeIn: "France",
  },

  // Women's Polos
  {
    id: "wp001",
    name: "Cotton Pique Polo",
    slug: "cotton-pique-polo",
    category: "women",
    subcategory: "polos",
    price: 69.99,
    salePrice: null,
    currency: "USD",
    inStock: true,
    stockCount: 62,
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
      "https://images.unsplash.com/photo-1618354691792-d1d42acfd860",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Navy", "Pink", "Mint Green"],
    description:
      "Classic polo shirt in breathable cotton pique. Perfect for casual weekends.",
    features: [
      "100% Cotton Pique",
      "Ribbed collar",
      "Two-button placket",
      "Straight hem",
    ],
    rating: 4.6,
    reviews: 94,
    tags: ["casual", "bestseller"],
    material: "100% Cotton",
    care: "Machine wash cold",
    madeIn: "Portugal",
  },

  // Women's Fashion Items
  {
    id: "wf001",
    name: "Oversized Knit Cardigan",
    slug: "oversized-knit-cardigan",
    category: "women",
    subcategory: "fashion-items",
    price: 149.99,
    salePrice: null,
    currency: "USD",
    inStock: true,
    stockCount: 35,
    images: [
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Beige", "Charcoal", "Cream"],
    description:
      "Cozy oversized cardigan perfect for layering. Crafted from soft merino wool blend.",
    features: [
      "70% Merino Wool 30% Cashmere",
      "Oversized fit",
      "Drop shoulder",
      "Patch pockets",
    ],
    rating: 4.7,
    reviews: 56,
    tags: ["new-arrival", "trending", "cozy"],
    material: "70% Merino Wool, 30% Cashmere",
    care: "Hand wash cold, lay flat to dry",
    madeIn: "Scotland",
  },
  {
    id: "wf002",
    name: "Leather Belt with Gold Buckle",
    slug: "leather-belt-gold-buckle",
    category: "women",
    subcategory: "fashion-items",
    price: 79.99,
    salePrice: 59.99,
    currency: "USD",
    inStock: true,
    stockCount: 78,
    images: ["https://images.unsplash.com/photo-1624222247344-550fb60583c2"],
    sizes: ["S", "M", "L"],
    colors: ["Black", "Tan", "Brown"],
    description:
      "Premium leather belt with statement gold buckle. Versatile accessory for any outfit.",
    features: [
      "Full-grain leather",
      "Gold-plated buckle",
      "Adjustable",
      "Gift box included",
    ],
    rating: 4.8,
    reviews: 143,
    tags: ["sale", "accessory"],
    material: "Full-grain Leather",
    care: "Wipe clean with damp cloth",
    madeIn: "Italy",
  },

  // Women's Dresses
  {
    id: "wd001",
    name: "Midi Wrap Dress",
    slug: "midi-wrap-dress",
    category: "women",
    subcategory: "dresses",
    price: 159.99,
    salePrice: null,
    currency: "USD",
    inStock: true,
    stockCount: 41,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral Print", "Navy", "Burgundy"],
    description:
      "Elegant wrap dress with flattering silhouette. Perfect for day to evening wear.",
    features: [
      "Viscose blend",
      "Adjustable wrap tie",
      "V-neckline",
      "Midi length",
    ],
    rating: 4.9,
    reviews: 112,
    tags: ["bestseller", "elegant", "versatile"],
    material: "95% Viscose, 5% Elastane",
    care: "Machine wash cold, hang dry",
    madeIn: "India",
  },
  {
    id: "wd002",
    name: "Linen Maxi Dress",
    slug: "linen-maxi-dress",
    category: "women",
    subcategory: "dresses",
    price: 189.99,
    salePrice: 149.99,
    currency: "USD",
    inStock: true,
    stockCount: 23,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Natural", "Sage Green"],
    description:
      "Breezy linen maxi dress perfect for summer. Effortlessly chic and comfortable.",
    features: [
      "100% European Linen",
      "Maxi length",
      "Side pockets",
      "Adjustable straps",
    ],
    rating: 4.7,
    reviews: 87,
    tags: ["sale", "summer", "linen"],
    material: "100% Linen",
    care: "Machine wash cold, tumble dry low",
    madeIn: "Lithuania",
  },

  // Men's Shirts
  {
    id: "ms001",
    name: "Oxford Button-Down Shirt",
    slug: "oxford-button-down-shirt",
    category: "men",
    subcategory: "shirts",
    price: 79.99,
    salePrice: null,
    currency: "USD",
    inStock: true,
    stockCount: 68,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pink", "Navy"],
    description:
      "Classic Oxford cloth button-down. A versatile staple for any wardrobe.",
    features: [
      "100% Cotton Oxford",
      "Button-down collar",
      "Chest pocket",
      "Regular fit",
    ],
    rating: 4.8,
    reviews: 203,
    tags: ["bestseller", "classic", "essential"],
    material: "100% Cotton",
    care: "Machine wash warm",
    madeIn: "USA",
  },
  {
    id: "ms002",
    name: "Slim Fit Dress Shirt",
    slug: "slim-fit-dress-shirt",
    category: "men",
    subcategory: "shirts",
    price: 99.99,
    salePrice: 79.99,
    currency: "USD",
    inStock: true,
    stockCount: 52,
    images: [
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Charcoal", "Navy"],
    description:
      "Modern slim fit dress shirt with stretch fabric for all-day comfort.",
    features: [
      "Cotton stretch blend",
      "Slim fit",
      "Spread collar",
      "Wrinkle-resistant",
    ],
    rating: 4.7,
    reviews: 156,
    tags: ["sale", "modern", "professional"],
    material: "97% Cotton, 3% Elastane",
    care: "Machine wash cold",
    madeIn: "Italy",
  },

  // Men's Polos
  {
    id: "mp001",
    name: "Classic Pique Polo",
    slug: "classic-pique-polo",
    category: "men",
    subcategory: "polos",
    price: 69.99,
    salePrice: null,
    currency: "USD",
    inStock: true,
    stockCount: 95,
    images: [
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
      "https://images.unsplash.com/photo-1621976360623-004223992275",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "White", "Forest Green", "Burgundy"],
    description:
      "Timeless polo shirt in premium cotton pique. Essential for smart casual wear.",
    features: [
      "100% Cotton Pique",
      "Three-button placket",
      "Ribbed cuffs",
      "Regular fit",
    ],
    rating: 4.6,
    reviews: 178,
    tags: ["bestseller", "classic"],
    material: "100% Cotton",
    care: "Machine wash cold",
    madeIn: "Portugal",
  },
  {
    id: "mp002",
    name: "Performance Golf Polo",
    slug: "performance-golf-polo",
    category: "men",
    subcategory: "polos",
    price: 89.99,
    salePrice: 69.99,
    currency: "USD",
    inStock: true,
    stockCount: 44,
    images: ["https://images.unsplash.com/photo-1598032895397-d3a7dc320fdd"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Sky Blue", "Coral"],
    description:
      "Technical polo with moisture-wicking fabric. Perfect for active lifestyles.",
    features: [
      "Moisture-wicking",
      "UV protection",
      "Stretch fabric",
      "Athletic fit",
    ],
    rating: 4.8,
    reviews: 92,
    tags: ["sale", "performance", "athletic"],
    material: "88% Polyester, 12% Spandex",
    care: "Machine wash cold, tumble dry low",
    madeIn: "Vietnam",
  },

  // Men's Fashion Items
  {
    id: "mf001",
    name: "Leather Bifold Wallet",
    slug: "leather-bifold-wallet",
    category: "men",
    subcategory: "fashion-items",
    price: 89.99,
    salePrice: null,
    currency: "USD",
    inStock: true,
    stockCount: 112,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93"],
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"],
    description:
      "Premium leather wallet with RFID protection. Sleek and functional design.",
    features: [
      "Full-grain leather",
      "RFID blocking",
      "8 card slots",
      "Gift box included",
    ],
    rating: 4.9,
    reviews: 267,
    tags: ["bestseller", "gift", "leather"],
    material: "Full-grain Leather",
    care: "Wipe clean with leather conditioner",
    madeIn: "Italy",
  },
  {
    id: "mf002",
    name: "Merino Wool Scarf",
    slug: "merino-wool-scarf",
    category: "men",
    subcategory: "fashion-items",
    price: 79.99,
    salePrice: 59.99,
    currency: "USD",
    inStock: true,
    stockCount: 38,
    images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9"],
    sizes: ["One Size"],
    colors: ["Navy", "Grey", "Camel", "Charcoal"],
    description: "Luxurious merino wool scarf. Soft, warm, and timeless.",
    features: [
      "100% Merino Wool",
      "Extra soft",
      "Versatile styling",
      "Gift ready",
    ],
    rating: 4.7,
    reviews: 73,
    tags: ["sale", "winter", "luxury"],
    material: "100% Merino Wool",
    care: "Hand wash cold, lay flat to dry",
    madeIn: "Scotland",
  },

  // Men's Jackets
  {
    id: "mj001",
    name: "Leather Bomber Jacket",
    slug: "leather-bomber-jacket",
    category: "men",
    subcategory: "jackets",
    price: 499.99,
    salePrice: null,
    currency: "USD",
    inStock: true,
    stockCount: 18,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Brown"],
    description:
      "Classic leather bomber jacket with premium construction. A true investment piece.",
    features: [
      "Genuine leather",
      "Quilted lining",
      "Ribbed cuffs",
      "Side pockets",
    ],
    rating: 4.9,
    reviews: 84,
    tags: ["luxury", "leather", "investment"],
    material: "Genuine Leather",
    care: "Professional leather cleaning",
    madeIn: "Italy",
  },
  {
    id: "mj002",
    name: "Quilted Field Jacket",
    slug: "quilted-field-jacket",
    category: "men",
    subcategory: "jackets",
    price: 249.99,
    salePrice: 199.99,
    currency: "USD",
    inStock: true,
    stockCount: 32,
    images: [
      "https://images.unsplash.com/photo-1578932750355-5eb30ece487a",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Olive", "Navy", "Black"],
    description:
      "Versatile quilted jacket with classic field jacket styling. Perfect for transitional weather.",
    features: [
      "Diamond quilting",
      "Water-resistant",
      "Multiple pockets",
      "Regular fit",
    ],
    rating: 4.7,
    reviews: 126,
    tags: ["sale", "versatile", "outerwear"],
    material: "Nylon shell, Polyester fill",
    care: "Machine wash cold, tumble dry low",
    madeIn: "China",
  },
  {
    id: "mj003",
    name: "Wool Blend Peacoat",
    slug: "wool-blend-peacoat",
    category: "men",
    subcategory: "jackets",
    price: 349.99,
    salePrice: null,
    currency: "USD",
    inStock: true,
    stockCount: 27,
    images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Charcoal", "Camel"],
    description:
      "Classic double-breasted peacoat in premium wool blend. Timeless sophistication.",
    features: [
      "80% Wool 20% Polyester",
      "Double-breasted",
      "Side pockets",
      "Lined interior",
    ],
    rating: 4.8,
    reviews: 98,
    tags: ["classic", "formal", "winter"],
    material: "80% Wool, 20% Polyester",
    care: "Dry clean only",
    madeIn: "Italy",
  },
];

// Utility functions
export const getProductsByCategory = (categorySlug) => {
  return products.filter((product) => product.category === categorySlug);
};

export const getProductsBySubcategory = (subcategorySlug) => {
  return products.filter((product) => product.subcategory === subcategorySlug);
};

export const getProductById = (productId) => {
  return products.find((product) => product.id === productId);
};

export const getProductBySlug = (slug) => {
  return products.find((product) => product.slug === slug);
};

export const getFeaturedProducts = () => {
  return products
    .filter((product) => product.tags.includes("bestseller"))
    .slice(0, 8);
};

export const getSaleProducts = () => {
  return products.filter((product) => product.salePrice !== null);
};

export const getNewArrivals = () => {
  return products
    .filter((product) => product.tags.includes("new-arrival"))
    .slice(0, 8);
};

export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tags.some((tag) => tag.includes(lowerQuery))
  );
};

export default {
  categories,
  subcategories,
  products,
  getProductsByCategory,
  getProductsBySubcategory,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getSaleProducts,
  getNewArrivals,
  searchProducts,
};
