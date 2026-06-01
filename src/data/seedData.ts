// Hierarchical category structure with parent + subcategories
export const seedCategories = [
  // Home Decor parent
  { name: 'Home Decor', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 1 },
  { name: 'Wall Decor', image_url: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 1 },
  { name: 'Showpieces', image_url: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 2 },
  { name: 'Vases & Planters', image_url: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 3 },

  // Idols parent
  { name: 'Idols', image_url: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 2 },
  { name: 'Ganesha Idols', image_url: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800', parent_id: 'idols', sort_order: 1 },
  { name: 'Krishna Idols', image_url: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800', parent_id: 'idols', sort_order: 2 },

  // Festivals parent
  { name: 'Festivals', image_url: 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 3 },
  { name: 'Diwali', image_url: 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800', parent_id: 'festivals', sort_order: 1 },
  { name: 'Holi', image_url: 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800', parent_id: 'festivals', sort_order: 2 },

  // Toys parent
  { name: 'Toys', image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 4 },
  { name: 'Wooden Toys', image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800', parent_id: 'toys', sort_order: 1 },
  { name: 'Educational Toys', image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800', parent_id: 'toys', sort_order: 2 },

  // Gift Packs parent
  { name: 'Gift Packs', image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 5 },
  { name: 'Premium Gifts', image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', parent_id: 'gift-packs', sort_order: 1 },
  { name: 'Combo Packs', image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', parent_id: 'gift-packs', sort_order: 2 },

  // Return Gifts parent
  { name: 'Return Gifts', image_url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 6 },
  { name: 'Wedding Favors', image_url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', parent_id: 'return-gifts', sort_order: 1 },
  { name: 'Party Favors', image_url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', parent_id: 'return-gifts', sort_order: 2 },
];

// Product seed data - expanded list for carousel variety
export const seedProducts = [
  // Bestsellers & Featured
  { name: 'Brass Urli with Diyas', description: 'A stunning brass urli perfect for floating candles and flowers. Handcrafted with traditional techniques.', category_id: 'home-decor', price: 1299, original_price: 1599, gst: 18, is_bestseller: true, is_trending: false, status: 'active' },
  { name: 'Marble Ganesha Idol', description: 'Beautifully handcrafted marble Ganesha idol with intricate detailing. Perfect for home puja.', category_id: 'idols', price: 1499, original_price: 1999, gst: 18, is_bestseller: true, is_trending: false, status: 'active' },
  { name: 'Diwali Festive Pooja Thali', description: 'Complete Pooja Thali set perfect for the festive season. Includes all essential items.', category_id: 'festivals', price: 899, original_price: 1299, gst: 18, is_bestseller: true, is_trending: false, status: 'active' },
  { name: 'Ceramic Vases Trio', description: 'A set of three minimalist ceramic vases with elegant patterns. Adds charm to any room.', category_id: 'home-decor', price: 1899, original_price: 2499, gst: 18, is_bestseller: true, is_trending: false, status: 'active' },

  // Trending
  { name: 'Premium Occasion Gift Pack', description: 'A luxurious curated gift pack filled with sweets, dry fruits, and small decor items.', category_id: 'gift-packs', price: 2499, original_price: 2999, gst: 18, is_bestseller: false, is_trending: true, status: 'active' },
  { name: 'Set of 10 Assorted Potlis', description: 'Elegant potli bags, perfect as return gifts for weddings and parties. Premium fabric.', category_id: 'return-gifts', price: 999, original_price: 1499, gst: 18, is_bestseller: false, is_trending: true, status: 'active' },
  { name: 'Wooden Educational Toy Set', description: 'Eco-friendly wooden toys designed to inspire creativity in children. Safety certified.', category_id: 'toys', price: 599, original_price: 899, gst: 18, is_bestseller: false, is_trending: true, status: 'active' },
  { name: 'Surprise Coffee Mug Set', description: 'A spontaneous gift to bring a smile to someone\'s face "just like that". Set of 2.', category_id: 'gift-packs', price: 499, original_price: 699, gst: 18, is_bestseller: false, is_trending: true, status: 'active' },

  // Regular products
  { name: 'Brass Diyas Set (5pcs)', description: 'Traditional brass diyas perfect for Diwali celebrations. Handcrafted by local artisans.', category_id: 'festivals', price: 599, original_price: 799, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
  { name: 'Terracotta Planters (3pcs)', description: 'Eco-friendly terracotta planters ideal for small plants and succulents.', category_id: 'home-decor', price: 449, original_price: 649, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
  { name: 'Krishna Flute Statue', description: 'Beautiful Krishna flute statue made from premium resin. Perfect for home altar.', category_id: 'idols', price: 799, original_price: 1099, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
  { name: 'Handwoven Basket Set', description: 'Traditional handwoven baskets perfect for storage and decor. Set of 3 sizes.', category_id: 'home-decor', price: 1299, original_price: 1799, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
  { name: 'Puzzle Box Toy', description: 'Wooden puzzle box that develops problem-solving skills. Suitable for ages 3+.', category_id: 'toys', price: 349, original_price: 549, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
  { name: 'Sweets & Almonds Pack', description: 'Luxury gift pack with premium sweets and roasted almonds. Perfect for any occasion.', category_id: 'gift-packs', price: 1899, original_price: 2399, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
  { name: 'Lantern Decoration', description: 'Decorative lantern with intricate metal work. Creates beautiful light patterns.', category_id: 'festivals', price: 1299, original_price: 1699, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
  { name: 'Building Blocks Set', description: 'Colorful wooden building blocks that inspire creativity and imagination.', category_id: 'toys', price: 749, original_price: 999, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
  { name: 'Brass Candle Holders (Pair)', description: 'Elegant brass candle holders with traditional design. Perfect for dining table.', category_id: 'home-decor', price: 899, original_price: 1199, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
  { name: 'Festival Fabric Pack', description: 'Assorted colorful fabrics perfect for DIY decorations and crafts.', category_id: 'festivals', price: 549, original_price: 799, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
  { name: 'Deity Figurine Set', description: 'Set of 5 premium deity figurines for your home temple or altar.', category_id: 'idols', price: 1799, original_price: 2299, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
  { name: 'Pendant Light Fixture', description: 'Beautiful pendant light with colorful glass pieces. Creates stunning ambiance.', category_id: 'home-decor', price: 2299, original_price: 2999, gst: 18, is_bestseller: false, is_trending: false, status: 'active' },
];

// Product images seed data
export const seedProductImages = [
  // These will be mapped to products by name
  { product_name: 'Brass Urli with Diyas', images: ['https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Marble Ganesha Idol', images: ['https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Diwali Festive Pooja Thali', images: ['https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Ceramic Vases Trio', images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Premium Occasion Gift Pack', images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Set of 10 Assorted Potlis', images: ['https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Wooden Educational Toy Set', images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Surprise Coffee Mug Set', images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Brass Diyas Set (5pcs)', images: ['https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Terracotta Planters (3pcs)', images: ['https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Krishna Flute Statue', images: ['https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Handwoven Basket Set', images: ['https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Puzzle Box Toy', images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Sweets & Almonds Pack', images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Lantern Decoration', images: ['https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Building Blocks Set', images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Brass Candle Holders (Pair)', images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Festival Fabric Pack', images: ['https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Deity Figurine Set', images: ['https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Pendant Light Fixture', images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'] },
];
