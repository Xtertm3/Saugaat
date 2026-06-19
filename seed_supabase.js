import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ws from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env.local');
let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.*)/);
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.*)/);
  if (urlMatch) supabaseUrl = urlMatch[1].trim().replace(/['"]/g, '');
  if (keyMatch) supabaseAnonKey = keyMatch[1].trim().replace(/['"]/g, '');
} catch (e) {
  console.log('Note: .env.local file could not be read directly. Trying environment variables...');
  supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found in env or .env.local.');
  console.error('Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  process.exit(1);
}

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .trim()
    .replace(/ +/g, '-');
};

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

const seedCategories = [
  // Home Decor parent
  { name: 'Home Decor', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 1 },
  { name: 'Wall Decor', image_url: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 1 },
  { name: 'Showpieces', image_url: 'https://images.unsplash.com/photo-1572186192734-1779ef884240?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 2 },
  { name: 'Vases & Planters', image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 3 },

  // Idols parent
  { name: 'Idols', image_url: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 2 },
  { name: 'Ganesha Idols', image_url: 'https://images.unsplash.com/photo-1609137144813-2dbe4889bf65?auto=format&fit=crop&q=80&w=800', parent_id: 'idols', sort_order: 1 },
  { name: 'Krishna Idols', image_url: 'https://images.unsplash.com/photo-1561564730-22c60f785bc0?auto=format&fit=crop&q=80&w=800', parent_id: 'idols', sort_order: 2 },

  // Festivals parent
  { name: 'Festivals', image_url: 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 3 },
  { name: 'Diwali', image_url: 'https://images.unsplash.com/photo-1510076857177-74700760b497?auto=format&fit=crop&q=80&w=800', parent_id: 'festivals', sort_order: 1 },
  { name: 'Holi', image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800', parent_id: 'festivals', sort_order: 2 },

  // Toys parent
  { name: 'Toys', image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 4 },
  { name: 'Wooden Toys', image_url: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800', parent_id: 'toys', sort_order: 1 },
  { name: 'Educational Toys', image_url: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=800', parent_id: 'toys', sort_order: 2 },

  // Gift Packs parent
  { name: 'Gift Packs', image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 5 },
  { name: 'Premium Gifts', image_url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', parent_id: 'gift-packs', sort_order: 1 },
  { name: 'Combo Packs', image_url: 'https://images.unsplash.com/photo-1575549594211-8f328cf00a7b?auto=format&fit=crop&q=80&w=800', parent_id: 'gift-packs', sort_order: 2 },

  // Return Gifts parent
  { name: 'Return Gifts', image_url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 6 },
  { name: 'Wedding Favors', image_url: 'https://images.unsplash.com/photo-1602665742701-389671bc40c0?auto=format&fit=crop&q=80&w=800', parent_id: 'return-gifts', sort_order: 1 },
  { name: 'Party Favors', image_url: 'https://images.unsplash.com/photo-1606744837616-a3c61b6bd51a?auto=format&fit=crop&q=80&w=800', parent_id: 'return-gifts', sort_order: 2 },

  // Just Like That parent
  { name: 'Just Like That', image_url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 7 },
  { name: 'Mugs', image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800', parent_id: 'just-like-that', sort_order: 1 },
  { name: 'Spontaneous Gifts', image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800', parent_id: 'just-like-that', sort_order: 2 }
];

const seedProducts = [
  // === HOME DECOR ===
  { name: 'Brass Urli with Diyas', description: 'A stunning brass urli perfect for floating candles and flowers. Handcrafted with traditional techniques by local artisans.', category_id: 'showpieces', price: 1299, original_price: 1599, gst: 18, is_bestseller: true, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Ceramic Vases Trio', description: 'A set of three minimalist ceramic vases with elegant matte textures. Adds clean Nordic charm to any living room.', category_id: 'vases-planters', price: 1899, original_price: 2499, gst: 18, is_bestseller: true, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Terracotta Planters (3pcs)', description: 'Eco-friendly terracotta planters ideal for small indoor plants and succulents. Breathable natural clay.', category_id: 'vases-planters', price: 449, original_price: 649, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800' },
  { name: 'Handwoven Basket Set', description: 'Traditional handwoven seagrass storage baskets. Functional for organization and beautiful as rustic decor. Set of 3 sizes.', category_id: 'showpieces', price: 1299, original_price: 1799, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800' },
  { name: 'Brass Candle Holders (Pair)', description: 'Elegant brass candle holders with solid traditional bases. Perfect for a warm candlelit dining experience.', category_id: 'showpieces', price: 899, original_price: 1199, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Pendant Light Fixture', description: 'Beautiful pendant hanging light with colorful glass mosaic pieces. Creates stunning patterns on walls when lit.', category_id: 'wall-decor', price: 2299, original_price: 2999, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Geometric Metal Wall Art', description: 'Contemporary gold-finished metal wall sculpture with sleek overlapping triangles. Easy mounting.', category_id: 'wall-decor', price: 1599, original_price: 2199, gst: 18, is_bestseller: false, is_trending: true, status: 'active', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800' },
  { name: 'Embroidered Macrame Wall Hanging', description: 'Boho-chic hand-knotted cotton rope wall hanging with colorful geometric embroidery details.', category_id: 'wall-decor', price: 799, original_price: 1099, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800' },
  { name: 'Floral Wooden Carved Panel', description: 'Intricately carved mango wood panel with distressed white finish. Vintage rustic wall statement.', category_id: 'wall-decor', price: 1499, original_price: 1999, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800' },
  { name: 'Luxury Marble Coasters (Set of 6)', description: 'Polished white and grey marble coasters with soft padded bottoms. Keeps surfaces water-ring free in style.', category_id: 'showpieces', price: 699, original_price: 999, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800' },

  // === IDOLS ===
  { name: 'Marble Ganesha Idol', description: 'Beautifully handcrafted pure white marble Ganesha idol with intricate gold painted detailing. Ideal for home temple.', category_id: 'ganesha-idols', price: 1499, original_price: 1999, gst: 18, is_bestseller: true, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800' },
  { name: 'Krishna Flute Statue', description: 'Elegant Krishna playing flute statue made from premium heavy resin. Rich bronze finish.', category_id: 'krishna-idols', price: 799, original_price: 1099, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800' },
  { name: 'Deity Figurine Set', description: 'Set of 5 small brass deity figurines including Ganesha, Lakshmi, Saraswati, Shiva, and Durga.', category_id: 'ganesha-idols', price: 1799, original_price: 2299, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800' },
  { name: 'Brass Dancing Ganesha', description: 'Heavyweight brass idol of Ganesha dancing in joy. Detailed craftsmanship capturing dynamic motion.', category_id: 'ganesha-idols', price: 2499, original_price: 3299, gst: 18, is_bestseller: false, is_trending: true, status: 'active', image: 'https://images.unsplash.com/photo-1608976328321-2f9b8b9a2444?auto=format&fit=crop&q=80&w=800' },
  { name: 'Radha Krishna Love Statue', description: 'Exquisite composite marble statue of Radha and Krishna standing under a tree. Symbol of eternal love.', category_id: 'krishna-idols', price: 1899, original_price: 2499, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1561564730-22c60f785bc0?auto=format&fit=crop&q=80&w=800' },
  { name: 'Terracotta Sitting Ganesha', description: 'Rustic natural clay Ganesha figurine. Hand-molded by rural artisans using traditional firing methods.', category_id: 'ganesha-idols', price: 599, original_price: 799, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1609137144813-2dbe4889bf65?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sandstone Meditating Buddha', description: 'Serene meditating Buddha statue carved in natural textured sandstone. Weatherproof for indoor and outdoor.', category_id: 'idols', price: 1099, original_price: 1499, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1542156822-6924d1a71aba?auto=format&fit=crop&q=80&w=800' },
  { name: 'Silver Plated Laxmi Ganesha Set', description: 'Pure silver plated Ganesha and Lakshmi idols in an elegant presentation acrylic frame. Premium spiritual gift.', category_id: 'ganesha-idols', price: 1299, original_price: 1699, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1606744837616-a3c61b6bd51a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Makrana Marble Bal Gopal', description: 'Adorable infant Krishna (Ladoo Gopal) sculpted in high quality Makrana marble and painted with vibrant colors.', category_id: 'krishna-idols', price: 2999, original_price: 3999, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1561564730-22c60f785bc0?auto=format&fit=crop&q=80&w=800' },
  { name: 'Handcarved Wooden Krishna', description: 'Masterfully carved sandalwood Krishna figurine. Smells divine and showcases spectacular traditional woodwork.', category_id: 'krishna-idols', price: 3499, original_price: 4499, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1608976328321-2f9b8b9a2444?auto=format&fit=crop&q=80&w=800' },

  // === FESTIVALS ===
  { name: 'Diwali Festive Pooja Thali', description: 'Complete Pooja Thali set gold-plated with beautiful kundan border. Includes containers, a bell, and a diya.', category_id: 'diwali', price: 899, original_price: 1299, gst: 18, is_bestseller: true, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800' },
  { name: 'Brass Diyas Set (5pcs)', description: 'Traditional heavy-gauge brass diyas with cotton wick holders. Perfect for festive illumination.', category_id: 'diwali', price: 599, original_price: 799, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Lantern Decoration', description: 'Hexagonal metal hanging lantern with red and orange colored glass windows. Beautiful shadow effects.', category_id: 'diwali', price: 1299, original_price: 1699, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800' },
  { name: 'Festival Fabric Pack', description: 'Assorted pieces of brocade and silk fabrics with gold zari borders. Great for wrapping gifts or crafting decor.', category_id: 'diwali', price: 549, original_price: 799, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800' },
  { name: 'Organic Gulal Gift Box (Set of 4)', description: 'Skin-friendly organic Holi colors made from beetroots, marigold, spinach, and turmeric. Zero chemicals.', category_id: 'holi', price: 499, original_price: 699, gst: 18, is_bestseller: false, is_trending: true, status: 'active', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800' },
  { name: 'Herbal Holi Colors in Pouches', description: 'Soft non-toxic herbal gulal powders packed in eco-friendly handmade paper pouches. 100g each of 4 colors.', category_id: 'holi', price: 299, original_price: 399, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800' },
  { name: 'Handcrafted Clay Diya Set (12pcs)', description: 'Vibrant handpainted clay diyas with colorful clay paints and glitter highlights. Bio-degradable.', category_id: 'diwali', price: 349, original_price: 499, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1510076857177-74700760b497?auto=format&fit=crop&q=80&w=800' },
  { name: 'Toran Door Hanging', description: 'Traditional door banner made of artificial yellow marigolds, green mango leaves, and golden bells.', category_id: 'diwali', price: 699, original_price: 899, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1510076857177-74700760b497?auto=format&fit=crop&q=80&w=800' },
  { name: 'Pichkari and Gulal Combo Set', description: 'Classic metallic water pump shooter accompanied by 2 packs of organic herbal color. Kids festive fun.', category_id: 'holi', price: 799, original_price: 1099, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800' },
  { name: 'Festive Rangoli Stencils Kit', description: 'Set of 6 metal stencils with classic mandala and peacock designs along with 6 color powder squeezy bottles.', category_id: 'diwali', price: 399, original_price: 599, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1510076857177-74700760b497?auto=format&fit=crop&q=80&w=800' },

  // === TOYS ===
  { name: 'Wooden Educational Toy Set', description: 'Eco-friendly wooden balancing blocks and geometry stacking rings. Promotes fine motor skills in toddlers.', category_id: 'educational-toys', price: 599, original_price: 899, gst: 18, is_bestseller: false, is_trending: true, status: 'active', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Puzzle Box Toy', description: 'Handcrafted wooden secret locking puzzle box. A fun brain teaser that requires sliding steps to open.', category_id: 'educational-toys', price: 349, original_price: 549, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Building Blocks Set', description: 'Colorful wooden building block set. Contains 50 pieces of various shapes with water-based non-toxic paint.', category_id: 'wooden-toys', price: 749, original_price: 999, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Handpainted Wooden Peg Dolls', description: 'Set of 6 custom painted wooden peg dolls representing a happy diverse family. Encourages open-ended play.', category_id: 'wooden-toys', price: 499, original_price: 699, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1608460525763-dec1252078b5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Montessori Shape Sorter', description: 'Solid wood cube box with multiple cutout shapes and 10 matching wooden geometry blocks. Classic childhood toy.', category_id: 'educational-toys', price: 899, original_price: 1199, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1545558014-8687977e90a1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Wooden Balancing Cactus Game', description: 'Family multiplayer game where players take turns adding branches to a wooden base cactus without tipping it over.', category_id: 'educational-toys', price: 649, original_price: 849, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=800' },
  { name: 'Forest Animals Wooden Set', description: 'Chunky pine-wood figures of a bear, fox, deer, owl, squirrel, and rabbit. Safe for teething infants.', category_id: 'wooden-toys', price: 999, original_price: 1399, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Wooden Alphabets Puzzle', description: 'A large wooden board with alphabet slots. Lift-out letters reveal colored illustrations underneath.', category_id: 'educational-toys', price: 549, original_price: 749, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=800' },
  { name: 'Classic Wooden Toy Train Set', description: '4-car wooden train with magnetic couplers. Connects smoothly to run on standard flat wooden tracks.', category_id: 'wooden-toys', price: 1299, original_price: 1799, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Handcrafted Wooden Rocking Horse', description: 'Heritage-quality solid teakwood rocking horse. Ergonomic seat handles and smooth curved bottom rails.', category_id: 'wooden-toys', price: 3999, original_price: 4999, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800' },

  // === GIFT PACKS ===
  { name: 'Premium Occasion Gift Pack', description: 'A luxurious curated paperboard gift pack filled with dark chocolates, organic honey, and a scented jar candle.', category_id: 'premium-gifts', price: 2499, original_price: 2999, gst: 18, is_bestseller: false, is_trending: true, status: 'active', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800' },
  { name: 'Surprise Coffee Mug Set', description: 'A spontaneous couple set of 2 dual-tone ceramic mugs accompanied by premium instant filter coffee powder sachets.', category_id: 'combo-packs', price: 499, original_price: 699, gst: 18, is_bestseller: false, is_trending: true, status: 'active', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sweets & Almonds Pack', description: 'Elegant gift box containing premium kaju katli sweets and crispy roasted salted almonds in gold glass jars.', category_id: 'combo-packs', price: 1899, original_price: 2399, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800' },
  { name: 'Luxury Dry Fruits & Diya Hamper', description: 'A cane basket tray carrying 250g each of cashew, pistachio, almond, and walnut, and 2 polished brass oil lamps.', category_id: 'premium-gifts', price: 1599, original_price: 1999, gst: 18, is_bestseller: true, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800' },
  { name: 'Royal Chocolate & Cookie Gift Box', description: 'Handcrafted truffles, almond biscotti, and oatmeal cookies packed in a velvet lined chest box.', category_id: 'combo-packs', price: 999, original_price: 1299, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1575549594211-8f328cf00a7b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Organic Herbal Tea Collection Box', description: 'Assorted collection of chamomile, peppermint, jasmine, and tulsi tea bags in a partitioned wooden box.', category_id: 'combo-packs', price: 899, original_price: 1199, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Wellness & Spa Relaxation Hamper', description: 'Self-care hamper with lavender bath salts, apricot scrub, natural loofah, and a hand-poured soy wax candle.', category_id: 'premium-gifts', price: 2299, original_price: 2999, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800' },
  { name: 'Corporate Desktop Organiser Hamper', description: 'Professional gift set comprising a vegan leather diary, a metal ballpoint pen, and a wooden mobile stand.', category_id: 'premium-gifts', price: 1799, original_price: 2399, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Gourmet Snack & Dip Celebration Pack', description: 'Hamper with pita chips, nacho crisps, roasted garlic hummus jar, and spicy salsa dip. Ready to party.', category_id: 'combo-packs', price: 1299, original_price: 1699, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1575549594211-8f328cf00a7b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Maharaja Gold Gift Hamper', description: 'Ultramodern festive hamper with gold-plated dry fruit bowls, premium saffron pack, and silver coin. Truly royal.', category_id: 'premium-gifts', price: 4999, original_price: 5999, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800' },

  // === RETURN GIFTS ===
  { name: 'Set of 10 Assorted Potlis', description: 'Elegant silk and organza potli bags with gold drawstring tassels, perfect as wedding and baby shower return gifts.', category_id: 'wedding-favors', price: 999, original_price: 1499, gst: 18, is_bestseller: false, is_trending: true, status: 'active', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800' },
  { name: 'Handcrafted Shubh Labh Hangings', description: 'Traditional door side hangings featuring colorful felt base, beads, pom-poms, and brass-finished Shubh-Labh lettering.', category_id: 'wedding-favors', price: 399, original_price: 599, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1606744837616-a3c61b6bd51a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Scented Votive Candles (Set of 6)', description: 'Assorted aromatic votive candles in jasmine, rose, lavender, lemongrass, vanilla, and sandalwood scents.', category_id: 'party-favors', price: 599, original_price: 799, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1606744837616-a3c61b6bd51a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Silver Plated Coin in Velvet Box', description: '10g silver plated coin depicting Ganesha and Lakshmi, safely housed in a rich royal red velvet flip-top box.', category_id: 'wedding-favors', price: 799, original_price: 1099, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1606744837616-a3c61b6bd51a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Miniature Meenakari Boxes (Set of 4)', description: 'Beautiful zinc alloy pill or jewelry boxes decorated with colorful traditional Rajasthani Meenakari paint work.', category_id: 'wedding-favors', price: 899, original_price: 1199, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800' },
  { name: 'Personalized Leather Keyrings (Pack of 5)', description: 'Grained tan leather loop keyrings with strong stainless steel rings. Sleek corporate return gift.', category_id: 'party-favors', price: 699, original_price: 999, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800' },
  { name: 'Assorted Handmade Soap Bars (Set of 4)', description: 'Cold-pressed organic glycerine soaps infused with essential oils of aloe vera, honey-oatmeal, rose, and charcoal.', category_id: 'party-favors', price: 449, original_price: 599, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800' },
  { name: 'Wooden Coasters with Stand (Pack of 4)', description: 'Mango wood coasters with engraved traditional rangoli carvings, complete with a matched holder stand.', category_id: 'party-favors', price: 499, original_price: 699, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800' },
  { name: 'Decorative Kankavati (Sindoor Box)', description: 'Brass shell-shaped container with cover lid used for kumkum or Roli during ceremonies. Elegant return favor.', category_id: 'wedding-favors', price: 299, original_price: 399, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1602665742701-389671bc40c0?auto=format&fit=crop&q=80&w=800' },
  { name: 'Embroidered Silk Clutches (Pack of 3)', description: 'Beautiful envelope style clutches in raw silk fabric with traditional floral embroidery. Great for wedding guests.', category_id: 'wedding-favors', price: 1499, original_price: 1999, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800' },

  // === JUST LIKE THAT ===
  { name: 'Handpainted Ceramic Tea Mug', description: 'Charming ceramic mug painted with cheerful blue pottery daisies. Large comfortable grip handle.', category_id: 'mugs', price: 349, original_price: 499, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800' },
  { name: 'Pastel Ceramic Coffee Mug', description: 'Elegant matte finish mug in blush pink color. Double-walled insulation keeps your coffee hot longer.', category_id: 'mugs', price: 399, original_price: 549, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800' },
  { name: 'Motivational Quotes Mug', description: 'White ceramic mug featuring bold inspire-your-day typographic quotes. Microwave and dishwasher safe.', category_id: 'mugs', price: 299, original_price: 399, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800' },
  { name: 'Handcrafted Leather Notebook', description: 'Saddle leather cover notebook filled with 120 pages of eco-friendly recycled cotton unruled papers. Vintage look.', category_id: 'spontaneous-gifts', price: 449, original_price: 599, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Rose Scented Soy Candle in Jar', description: 'Therapeutic soy wax candle infused with natural damask rose petals oil. Burn time approx 30 hours.', category_id: 'spontaneous-gifts', price: 499, original_price: 699, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Brass Bookmark & Pen Set', description: 'Sleek geometric brass bookmark clip accompanied by a fine-tip luxury black ink gel pen. Gift box included.', category_id: 'spontaneous-gifts', price: 799, original_price: 999, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Pocket Perfume Roll-On Set', description: 'Travel-friendly set of 3 roll-on scents: fresh ocean breeze, citrus wood, and floral amber. Alcohol-free.', category_id: 'spontaneous-gifts', price: 599, original_price: 799, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Minimalist Key Organiser', description: 'Genuine leather sleeve that holds up to 6 keys in a silent stacked layout. No pocket jingling.', category_id: 'spontaneous-gifts', price: 349, original_price: 499, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Ceramic Mug with Wooden Lid', description: 'Sleek speckled white mug complete with a dark walnut wooden lid cover that doubles as a coaster.', category_id: 'mugs', price: 499, original_price: 649, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800' },
  { name: 'Lavender Pillow Mist & Eye Mask', description: 'Soothing lavender essential oil spray for linens paired with a soft padded satin sleep eye mask.', category_id: 'spontaneous-gifts', price: 899, original_price: 1199, gst: 18, is_bestseller: false, is_trending: false, status: 'active', image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800' }
];

async function seedDatabase() {
  try {
    console.log('🧹 Clearing existing product images, products, and categories in Supabase...');
    // Delete existing records to perform a clean seed
    await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('🌱 Seeding parent categories...');
    const slugToUuidMap = {};

    const parents = seedCategories.filter(c => c.parent_id === null);
    for (const parent of parents) {
      const slug = slugify(parent.name);
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: parent.name,
          image_url: parent.image_url,
          parent_id: null,
          sort_order: parent.sort_order,
          description: `${parent.name} Collection`
        }])
        .select('id')
        .single();

      if (error) {
        console.error(`Failed to insert parent category "${parent.name}":`, error.message);
        throw error;
      }

      slugToUuidMap[slug] = data.id;
      console.log(`Parent category "${parent.name}" inserted with UUID:`, data.id);
    }

    console.log('🌱 Seeding subcategories...');
    const children = seedCategories.filter(c => c.parent_id !== null);
    for (const sub of children) {
      const slug = slugify(sub.name);
      const parentSlug = slugify(sub.parent_id);
      const parentUuid = slugToUuidMap[parentSlug];
      if (!parentUuid) {
        throw new Error(`Parent slug "${parentSlug}" not found in map.`);
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: sub.name,
          image_url: sub.image_url,
          parent_id: parentUuid,
          sort_order: sub.sort_order,
          description: `${sub.name} Subcategory`
        }])
        .select('id')
        .single();

      if (error) {
        console.error(`Failed to insert subcategory "${sub.name}":`, error.message);
        throw error;
      }

      slugToUuidMap[slug] = data.id;
      console.log(`Subcategory "${sub.name}" inserted with UUID:`, data.id);
    }

    console.log('🛍️ Seeding products and linking images...');
    let productCount = 0;
    for (const product of seedProducts) {
      const categoryUuid = slugToUuidMap[product.category_id];
      if (!categoryUuid) {
        throw new Error(`Category slug "${product.category_id}" not found in map.`);
      }

      const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

      const { data: insertedProduct, error: productError } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          category_id: categoryUuid,
          price: product.price,
          original_price: product.original_price,
          discount_percentage: discount,
          gst: product.gst || 18,
          is_bestseller: product.is_bestseller || false,
          is_trending: product.is_trending || false,
          status: product.status || 'active'
        }])
        .select('id')
        .single();

      if (productError) {
        console.error(`Failed to insert product "${product.name}":`, productError.message);
        throw productError;
      }

      productCount++;
      console.log(`[${productCount}/70] Product "${product.name}" inserted.`);

      // Insert product images
      const { error: imageError } = await supabase
        .from('product_images')
        .insert([{
          product_id: insertedProduct.id,
          image_url: product.image,
          is_featured: true,
          display_order: 0
        }]);

      if (imageError) {
        console.error(`Failed to insert image for product "${product.name}":`, imageError.message);
        throw imageError;
      }
    }

    console.log('🎉 SUCCESS: Supabase database successfully seeded with all 70 premium dynamic products!');
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
  }
}

seedDatabase();
