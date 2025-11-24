// T-Shirts
import hivePropertyShirt from '../assets/images/HivePoloWhite-Collection.jpeg';
import journeyShirt from '../assets/images/HivePoloWhite-Collection.jpeg';
import hivePropertyBlackShirt from '../assets/images/HivePoloBlack-Collection.jpeg';

// Tanks/Vests
import hiveAngelsVestBlack from '../assets/images/HiveAngelWhite-Collection.jpeg';
import hiveAngelsVestWhite from '../assets/images/HiveAngelBlack-Collection.jpeg';

// Polos
import hiveFestPolo from '../assets/images/HivePoloWhite-Collection.jpeg';

// Caps
import hiveCapBlack from "../assets/images/HiveCap-Collection.jpeg";
import hiveCapNavy from "../assets/images/HiveCap-Collection.jpeg";
import hiveCapDarkBlue from "../assets/images/HiveCap-Collection.jpeg";
import hiveCapLightBlue from "../assets/images/HiveCap-Collection.jpeg";

// Hoodies
import hiveHoodieGrey from "../assets/images/HiveHoodie-Collection.jpeg";
import hiveHoodieCream from "../assets/images/HiveHoodie2-Collection.jpeg";
import hiveHoodieBurgundy from "../assets/images/HiveHoodie-Collection.jpeg";
import hiveHoodieBlack from "../assets/images/HiveHoodie2-Collection.jpeg";

// Female Jumpsuits
import hiveFemaleJumpsuitCream from "../assets/images/HiveFemaleCream-Collection.png";
import hiveFemaleJumpsuitBlue from "../assets/images/HiveFemaleBlue-Collection.png";
import hiveFemaleJumpsuitBlack from "../assets/images/HiveFemaleBlack-Collection.png"

export const categories = [
  {
    id: "women",
    name: "Women",
    slug: "women",
    description: "Explore our curated collection of women's fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    subcategories: ["shirts", "polos", "hoodies", "caps", "tanks", "jumpsuits"],
  },
  {
    id: "men",
    name: "Men",
    slug: "men",
    description: "Discover timeless men's fashion essentials",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
    subcategories: ["shirts", "polos", "hoodies", "caps"],
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
    id: "hoodies",
    name: "Hoodies",
    slug: "hoodies",
    description: "Comfortable hoodies for everyday wear",
    category: ["women", "men"],
  },
  {
    id: "caps",
    name: "Caps",
    slug: "caps",
    description: "Stylish caps and headwear",
    category: ["women", "men"],
  },
  {
    id: "tanks",
    name: "Tanks",
    slug: "tanks",
    description: "Tank tops and vests",
    category: ["women", "men"],
  },
  {
    id: "jumpsuits",
    name: "Jumpsuits",
    slug: "jumpsuits",
    description: "Stylish jumpsuits for women",
    category: ["women"],
  },
];

export const products = [
  // T-Shirts
  {
    id: "ts001",
    name: "Hive Property T-Shirt White",
    slug: "hive-property-tshirt-white",
    category: "men",
    subcategory: "shirts",
    price: 140000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 50,
    images: [hivePropertyShirt],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White"],
    description:
      "Classic Hive branded t-shirt with signature property logo featuring automotive heritage design.",
    features: [
      "100% Premium Cotton",
      "Screen printed design",
      "Regular fit",
      "Machine washable",
    ],
    rating: 4.8,
    reviews: 124,
    tags: ["bestseller", "signature", "new-arrival"],
    material: "100% Cotton",
    care: "Machine wash cold, tumble dry low",
    madeIn: "USA",
  },
  {
    id: "ts002",
    name: "Journey Of A Thousand Miles T-Shirt",
    slug: "journey-thousand-miles-tshirt",
    category: "men",
    subcategory: "shirts",
    price: 140000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 35,
    images: [journeyShirt],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White"],
    description:
      "Inspirational t-shirt featuring vintage car graphics with the motivational quote 'Journey of a thousand miles begins with a step'.",
    features: [
      "100% Premium Cotton",
      "Vintage graphic print",
      "Soft feel fabric",
      "Crew neck design",
    ],
    rating: 4.7,
    reviews: 89,
    tags: ["trending", "graphic", "inspirational"],
    material: "100% Cotton",
    care: "Machine wash cold, tumble dry low",
    madeIn: "USA",
  },
  {
    id: "ts003",
    name: "Hive Property T-Shirt Black",
    slug: "hive-property-tshirt-black",
    category: "men",
    subcategory: "shirts",
    price: 140000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 42,
    images: [hivePropertyBlackShirt],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    description:
      "Classic Hive property t-shirt in sleek black with gold accent logo and automotive branding.",
    features: [
      "100% Premium Cotton",
      "Gold foil print",
      "Regular fit",
      "Durable construction",
    ],
    rating: 4.9,
    reviews: 156,
    tags: ["sale", "bestseller", "signature"],
    material: "100% Cotton",
    care: "Machine wash cold, tumble dry low",
    madeIn: "USA",
  },

  // Tank Tops / Vests
  {
    id: "tk001",
    name: "Hive Angels Vest Black",
    slug: "hive-angels-vest-black",
    category: "men",
    subcategory: "tanks",
    price: 100000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 45,
    images: [hiveAngelsVestBlack],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    description:
      "Limited edition Hive vest featuring renaissance angel artwork with playing card design and 'Alive' branding.",
    features: [
      "100% Cotton",
      "Sleeveless design",
      "Artistic print",
      "Limited edition",
    ],
    rating: 4.8,
    reviews: 72,
    tags: ["limited-edition", "artistic", "bestseller"],
    material: "100% Cotton",
    care: "Machine wash cold, hang dry",
    madeIn: "USA",
  },
  {
    id: "tk002",
    name: "Hive Angels Vest White",
    slug: "hive-angels-vest-white",
    category: "women",
    subcategory: "tanks",
    price: 100000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 38,
    images: [hiveAngelsVestWhite],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White"],
    description:
      "Limited edition Hive vest in white featuring renaissance angel artwork with playing card design.",
    features: [
      "100% Cotton",
      "Sleeveless design",
      "Artistic print",
      "Limited edition",
    ],
    rating: 4.7,
    reviews: 65,
    tags: ["limited-edition", "artistic", "new-arrival"],
    material: "100% Cotton",
    care: "Machine wash cold, hang dry",
    madeIn: "USA",
  },

  // Polos
  {
    id: "pl001",
    name: "HiveFest Original Polo",
    slug: "hivefest-original-polo",
    category: "men",
    subcategory: "polos",
    price: 120000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 55,
    images: [hiveFestPolo],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White"],
    description:
      "Classic polo shirt featuring HiveFest branding with vintage crest design and embroidered bee logo.",
    features: [
      "Cotton pique fabric",
      "Embroidered logos",
      "Contrast collar",
      "Three-button placket",
    ],
    rating: 4.9,
    reviews: 143,
    tags: ["bestseller", "classic", "premium"],
    material: "100% Cotton Pique",
    care: "Machine wash cold",
    madeIn: "Portugal",
  },

  // Caps
  {
    id: "cp001",
    name: "Hive Cap Black Denim",
    slug: "hive-cap-black-denim",
    category: "men",
    subcategory: "caps",
    price: 80000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 68,
    images: [hiveCapBlack],
    sizes: ["One Size"],
    colors: ["Black Denim"],
    description:
      "Premium denim cap with leather brim and embroidered Hive logo. Adjustable strap for perfect fit.",
    features: [
      "Denim construction",
      "Leather brim",
      "Embroidered logo",
      "Adjustable strap",
    ],
    rating: 4.8,
    reviews: 94,
    tags: ["bestseller", "premium"],
    material: "Denim, Leather",
    care: "Spot clean only",
    madeIn: "China",
  },
  {
    id: "cp002",
    name: "Hive Cap Navy Denim",
    slug: "hive-cap-navy-denim",
    category: "men",
    subcategory: "caps",
    price: 80000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 52,
    images: [hiveCapNavy],
    sizes: ["One Size"],
    colors: ["Navy Denim"],
    description:
      "Navy denim cap with premium leather brim and signature Hive embroidered logo.",
    features: [
      "Denim construction",
      "Leather brim",
      "Embroidered logo",
      "Adjustable strap",
    ],
    rating: 4.7,
    reviews: 78,
    tags: ["sale", "premium"],
    material: "Denim, Leather",
    care: "Spot clean only",
    madeIn: "China",
  },
  {
    id: "cp003",
    name: "Hive Cap Dark Blue Denim",
    slug: "hive-cap-darkblue-denim",
    category: "women",
    subcategory: "caps",
    price: 80000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 44,
    images: [hiveCapDarkBlue],
    sizes: ["One Size"],
    colors: ["Dark Blue Denim"],
    description:
      "Dark blue denim cap with leather brim, perfect for casual everyday style.",
    features: [
      "Denim construction",
      "Leather brim",
      "Embroidered logo",
      "Adjustable strap",
    ],
    rating: 4.6,
    reviews: 61,
    tags: ["new-arrival"],
    material: "Denim, Leather",
    care: "Spot clean only",
    madeIn: "China",
  },
  {
    id: "cp004",
    name: "Hive Cap Light Blue Denim",
    slug: "hive-cap-lightblue-denim",
    category: "women",
    subcategory: "caps",
    price: 80000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 39,
    images: [hiveCapLightBlue],
    sizes: ["One Size"],
    colors: ["Light Blue Denim"],
    description:
      "Light blue denim cap with premium leather brim for a fresh summer look.",
    features: [
      "Denim construction",
      "Leather brim",
      "Embroidered logo",
      "Adjustable strap",
    ],
    rating: 4.7,
    reviews: 55,
    tags: ["summer", "trending"],
    material: "Denim, Leather",
    care: "Spot clean only",
    madeIn: "China",
  },

  // Hoodies
  {
    id: "hd001",
    name: "Hive Privilege Hoodie Grey",
    slug: "hive-privilege-hoodie-grey",
    category: "men",
    subcategory: "hoodies",
    price: 170000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 48,
    images: [hiveHoodieGrey],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey"],
    description:
      "Premium hoodie with front Hive script logo and back graphic featuring automotive artwork and motivational quote.",
    features: [
      "80% Cotton 20% Polyester",
      "Zip-up design",
      "Kangaroo pocket",
      "Ribbed cuffs and hem",
    ],
    rating: 4.9,
    reviews: 187,
    tags: ["bestseller", "premium", "comfort"],
    material: "80% Cotton, 20% Polyester",
    care: "Machine wash cold, tumble dry low",
    madeIn: "USA",
  },
  {
    id: "hd002",
    name: "Hive Privilege Hoodie Cream",
    slug: "hive-privilege-hoodie-cream",
    category: "women",
    subcategory: "hoodies",
    price: 170000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 41,
    images: [hiveHoodieCream],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream"],
    description:
      "Cream colored premium hoodie with signature Hive branding and back graphic design.",
    features: [
      "80% Cotton 20% Polyester",
      "Pullover style",
      "Kangaroo pocket",
      "Soft fleece interior",
    ],
    rating: 4.8,
    reviews: 134,
    tags: ["premium", "comfort", "new-arrival"],
    material: "80% Cotton, 20% Polyester",
    care: "Machine wash cold, tumble dry low",
    madeIn: "USA",
  },
  {
    id: "hd003",
    name: "Hive Privilege Hoodie Burgundy",
    slug: "hive-privilege-hoodie-burgundy",
    category: "men",
    subcategory: "hoodies",
    price: 170000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 36,
    images: [hiveHoodieBurgundy],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Burgundy"],
    description:
      "Bold burgundy hoodie featuring Hive script logo and back automotive graphic with motivational text.",
    features: [
      "80% Cotton 20% Polyester",
      "Pullover style",
      "Kangaroo pocket",
      "Soft fleece interior",
    ],
    rating: 4.7,
    reviews: 112,
    tags: ["sale", "premium", "trending"],
    material: "80% Cotton, 20% Polyester",
    care: "Machine wash cold, tumble dry low",
    madeIn: "USA",
  },
  {
    id: "hd004",
    name: "Hive Privilege Hoodie Black",
    slug: "hive-privilege-hoodie-black",
    category: "men",
    subcategory: "hoodies",
    price: 170000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 62,
    images: [hiveHoodieBlack],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    description:
      "Classic black hoodie with white Hive script logo and detailed back graphic featuring automotive artwork.",
    features: [
      "80% Cotton 20% Polyester",
      "Pullover style",
      "Kangaroo pocket",
      "Soft fleece interior",
    ],
    rating: 4.9,
    reviews: 203,
    tags: ["bestseller", "premium", "classic"],
    material: "80% Cotton, 20% Polyester",
    care: "Machine wash cold, tumble dry low",
    madeIn: "USA",
  },

  // Female Jumpsuits
  {
    id: "js001",
    name: "Hive Jumpsuit Cream",
    slug: "hive-jumpsuit-cream",
    category: "women",
    subcategory: "jumpsuits",
    price: 150000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 35,
    images: [hiveFemaleJumpsuitCream],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream"],
    description:
      "Elegant cream jumpsuit featuring a sleek silhouette. Perfect for casual outings or dressed-up occasions.",
    features: [
      "Premium cotton blend",
      "Comfortable fit",
      "Adjustable waist",
      "Breathable fabric",
    ],
    rating: 4.8,
    reviews: 92,
    tags: ["bestseller", "jumpsuits", "new-arrival"],
    material: "95% Cotton, 5% Elastane",
    care: "Machine wash cold, hang dry",
    madeIn: "Vietnam",
  },
  {
    id: "js002",
    name: "Hive Jumpsuit Blue",
    slug: "hive-jumpsuit-blue",
    category: "women",
    subcategory: "jumpsuits",
    price: 150000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 28,
    images: [hiveFemaleJumpsuitBlue],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blue"],
    description:
      "Stylish blue jumpsuit designed for comfort and versatility. A wardrobe essential for the modern woman.",
    features: [
      "Premium cotton blend",
      "Comfortable fit",
      "Adjustable waist",
      "Breathable fabric",
    ],
    rating: 4.9,
    reviews: 108,
    tags: ["bestseller", "jumpsuits", "trending"],
    material: "95% Cotton, 5% Elastane",
    care: "Machine wash cold, hang dry",
    madeIn: "Vietnam",
  },
  {
    id: "js003",
    name: "Hive Jumpsuit Black",
    slug: "hive-jumpsuit-black",
    category: "women",
    subcategory: "jumpsuits",
    price: 150000.00,
    salePrice: null,
    currency: "NGN",
    inStock: true,
    stockCount: 42,
    images: [hiveFemaleJumpsuitBlack],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    description:
      "Classic black jumpsuit that effortlessly combines style and comfort. A timeless piece for any wardrobe.",
    features: [
      "Premium cotton blend",
      "Comfortable fit",
      "Adjustable waist",
      "Breathable fabric",
    ],
    rating: 4.9,
    reviews: 156,
    tags: ["bestseller", "jumpsuits", "classic"],
    material: "95% Cotton, 5% Elastane",
    care: "Machine wash cold, hang dry",
    madeIn: "Vietnam",
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