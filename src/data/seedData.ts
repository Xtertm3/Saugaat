// Hierarchical category structure with parent + subcategories
export const seedCategories = [
  { name: 'Being Well', image_url: '/being-well/rose-herbal-tea.jpg', parent_id: null, sort_order: 1 },

  { name: 'Home Decor', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 2 },
  { name: 'Bed Sheets', image_url: '/products/rassrang-bedsheet-combo-4pack.jpg', parent_id: 'home-decor', sort_order: 1 },
  { name: 'Curtains', image_url: '/curtains/botanical-damask-tapestry.jpg', parent_id: 'home-decor', sort_order: 2 },
  { name: 'Cushions', image_url: '/cushions/ginkgo-silk-cushion.jpg', parent_id: 'home-decor', sort_order: 3 },
  { name: 'Wall Decor', image_url: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 4 },
  { name: 'Showpieces', image_url: 'https://images.unsplash.com/photo-1572186192734-1779ef884240?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 5 },
  { name: 'Vases & Planters', image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 6 },

  { name: 'Just Like That', image_url: '/tableware/butterfly-wooden-tray.jpg', parent_id: null, sort_order: 3 },
  { name: 'Tableware', image_url: '/tableware/butterfly-wooden-tray.jpg', parent_id: 'just-like-that', sort_order: 1 },

  { name: 'Gift Packs', image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 4 },
  { name: 'Premium Gifts', image_url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', parent_id: 'gift-packs', sort_order: 1 },

  { name: 'Return Gifts', image_url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 5 },
  { name: 'Wedding Favors', image_url: 'https://images.unsplash.com/photo-1602665742701-389671bc40c0?auto=format&fit=crop&q=80&w=800', parent_id: 'return-gifts', sort_order: 1 },
];

export const seedProducts = [
  // === HERO FLASH SALE BED SHEETS ===
  {
    name: 'Rassrang Luxury Double Bedsheet Combo (Set of 4)',
    description: '⚡ GET 4 AT THE PRICE OF 2 FLASH SALE! Premium cotton-feel double bed sheets featuring vibrant assorted colours and intricate floral & geometric prints. Soft, breathable, and comfortable against the skin. Perfect fit for larger double beds. (MRP of 1 Bed Sheet: ₹1,499. Regular 4-Pack MRP: ₹5,996 — Flash Sale Price: ₹2,998 for 4 Bedsheets!). Key Features: Assorted Colours & Prints | Double Bed Sheet | Cotton Feel Fabric. Order Now Hotline: 8368229705.',
    category_id: 'bed-sheets',
    price: 2998,
    original_price: 5996,
    gst: 12,
    is_bestseller: true,
    is_trending: true,
    status: 'active'
  },

  // === BEING WELL PRODUCTS ===
  {
    name: 'Rose Herbal Tea',
    description: 'Pure herbal wellness in every sip. Crafted with 100% natural damask rose petals, naturally caffeine-free. Promotes glowing skin, natural detox, and deep relaxation. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well', price: 195, original_price: 250, gst: 5, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Immunity Herbal Tea',
    description: 'A powerful blend of tulsi, ginger, and spices formulated to support natural immunity. 100% natural, caffeine-free. Net Wt.: 50g.',
    category_id: 'being-well', price: 210, original_price: 260, gst: 5, is_bestseller: true, is_trending: false, status: 'active',
  },
  {
    name: 'Tulsi Green Tea',
    description: 'Classic tulsi green tea for daily calm and clarity. Antioxidant-rich, lightly caffeinated. Net Wt.: 50g.',
    category_id: 'being-well', price: 185, original_price: 230, gst: 5, is_bestseller: false, is_trending: true, status: 'active',
  },
  {
    name: 'Chamomile Herbal Tea',
    description: 'Soothing chamomile blossoms for restful evenings and gentle digestion. Naturally caffeine-free. Net Wt.: 50g.',
    category_id: 'being-well', price: 225, original_price: 280, gst: 5, is_bestseller: false, is_trending: false, status: 'active',
  },
  {
    name: 'Blue Pea Herbal Tea',
    description: 'Vibrant blue butterfly pea tea, rich in antioxidants. Transforms colour with lemon juice. Net Wt.: 50g.',
    category_id: 'being-well', price: 240, original_price: 299, gst: 5, is_bestseller: true, is_trending: true, status: 'active',
  },

  // === CUSHIONS COLLECTION ===
  {
    name: 'Ginkgo Silk Cushion Cover',
    description: 'Golden ginkgo leaf motif embroidered on rich teal silk. Adds instant elegance to your living space. Size: 16x16 inches.',
    category_id: 'cushions', price: 699, original_price: 899, gst: 12, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Mandala Pair Cushions',
    description: 'Set of 2 printed velvet cushion covers featuring intricate mandala art in jewel tones. Size: 16x16 inches.',
    category_id: 'cushions', price: 1199, original_price: 1499, gst: 12, is_bestseller: true, is_trending: false, status: 'active',
  },
  {
    name: 'Metallic Vine Brocade Cushion',
    description: 'Luxury brocade cushion cover with subtle metallic thread weaving. Perfect accent piece. Size: 18x18 inches.',
    category_id: 'cushions', price: 799, original_price: 999, gst: 12, is_bestseller: false, is_trending: true, status: 'active',
  },
  {
    name: 'Paisley Jacquard Cushion',
    description: 'Classic paisley jacquard pattern in warm earth tones. Durable, hidden zipper closure. Size: 16x16 inches.',
    category_id: 'cushions', price: 599, original_price: 749, gst: 12, is_bestseller: false, is_trending: false, status: 'active',
  },
  {
    name: 'Botanical Damask Tapestry Cushion',
    description: 'Rich tapestry cushion cover matching our botanical damask collection. Size: 16x16 inches.',
    category_id: 'cushions', price: 749, original_price: 899, gst: 12, is_bestseller: true, is_trending: true, status: 'active',
  },

  // === TABLEWARE (Just Like That) ===
  {
    name: 'Butterfly Azure Wooden Serving Tray Set',
    description: 'Handcrafted luxury wooden serving tray set with vibrant blue butterfly art motif and moisture-resistant lacquer finish.',
    category_id: 'tableware', price: 1800, original_price: 2200, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Peacock Compartment Wooden Snack Platter',
    description: 'Hand-painted 4-section wooden platter featuring traditional Rajasthani peacock tile artwork.',
    category_id: 'tableware', price: 850, original_price: 1100, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Art Deco Circular Wooden Platter',
    description: 'Modern circular wooden serving platter with sleek black gloss finish and sunburst ivory art inlay.',
    category_id: 'tableware', price: 720, original_price: 950, gst: 18, is_bestseller: false, is_trending: false, status: 'active',
  },

  // === CURTAINS COLLECTION (Quote-based) ===
  {
    name: 'Botanical Damask Tapestry Valance Curtain',
    description: 'Hand-tailored classical damask valance curtains with ornate pelmet header and thick blackout drape lining.',
    category_id: 'curtains', price: 0, original_price: 0, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Chevron Jacquard Pelmet Drapes',
    description: 'Modern luxury herringbone jacquard drapes with structured scalloped pelmet and custom border trim.',
    category_id: 'curtains', price: 0, original_price: 0, gst: 18, is_bestseller: true, is_trending: false, status: 'active',
  },
  {
    name: 'Gilded Silk Sheer & Velvet Drapes',
    description: 'Opulent cream silk & velvet curtains featuring central lace trim accents and scalloped valance.',
    category_id: 'curtains', price: 0, original_price: 0, gst: 18, is_bestseller: false, is_trending: true, status: 'active',
  },
  {
    name: 'Terracotta Floral Brocade Curtains',
    description: 'Rich terracotta floral brocade pelmet curtains with cream blackout side drapes.',
    category_id: 'curtains', price: 0, original_price: 0, gst: 18, is_bestseller: false, is_trending: false, status: 'active',
  },
  {
    name: 'Imperial Floral Jacquard Valance Drapes',
    description: 'Royal taupe and beige floral jacquard drapes with multi-panel valance header.',
    category_id: 'curtains', price: 0, original_price: 0, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },

  // === GIFT PACKS & RETURN GIFTS ===
  {
    name: 'Premium Assorted Dry Fruits Hamper',
    description: 'Luxurious gift hamper containing almonds, cashews, raisins, and walnuts in handcrafted velvet potlis.',
    category_id: 'premium-gifts', price: 1499, original_price: 1899, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Herbal Wellness Gift Box',
    description: 'Curated wellness gift box with rose, tulsi, and chamomile herbal teas. Thoughtful gift for health-conscious friends and family.',
    category_id: 'premium-gifts', price: 799, original_price: 999, gst: 5, is_bestseller: true, is_trending: false, status: 'active',
  },
  {
    name: 'Personalized Return Gift Potli Set',
    description: 'Handcrafted fabric potlis with festive fillings. Perfect as wedding and celebration return gifts. Set of 10.',
    category_id: 'wedding-favors', price: 999, original_price: 1299, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Miniature Meenakari Favor Boxes',
    description: 'Vibrant meenakari keepsake boxes ideal for wedding favors and housewarming return gifts. Set of 4.',
    category_id: 'wedding-favors', price: 649, original_price: 849, gst: 18, is_bestseller: true, is_trending: false, status: 'active',
  },
  {
    name: 'Scented Soy Candle Favor Pack',
    description: 'Softly scented soy candles in elegant jars. A warm thank-you gift for guests. Pack of 6.',
    category_id: 'wedding-favors', price: 749, original_price: 949, gst: 18, is_bestseller: false, is_trending: true, status: 'active',
  },

  // === CURATED ACCESSORIES & BEDDING ===
  {
    name: 'Genuine Leather Laptop Bag',
    description: 'Executive handcrafted genuine leather laptop bag with multiple zip compartments, padded sleeve for up to 15.6" laptops, and detachable shoulder strap.',
    category_id: 'gift-packs', price: 3999, original_price: 4300, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Pure Copper Water Bottle (1000ml)',
    description: 'Traditional jointless pure copper water bottle (1000ml) for daily health, immunity boosting, and natural ayurvedic water storage.',
    category_id: 'being-well', price: 699, original_price: 1000, gst: 5, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Handcrafted Canvas Sling Bag',
    description: 'Chic woven handcrafted canvas sling bag with rich leather trim, magnetic closure, and adjustable shoulder strap.',
    category_id: 'return-gifts', price: 899, original_price: 1299, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Sling Bag Blue',
    description: 'Compact stylish navy blue sling bag with durable water-resistant fabric and dual zipper utility compartments.',
    category_id: 'return-gifts', price: 550, original_price: 699, gst: 18, is_bestseller: true, is_trending: false, status: 'active',
  },
  {
    name: 'Leather Sling Bag',
    description: 'Premium vintage tan leather crossbody sling bag with handcrafted brass hardware and multiple pocket organizers.',
    category_id: 'return-gifts', price: 899, original_price: 1000, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Premium Leather Laptop Sleeve',
    description: 'Slim lightweight protective genuine leather laptop sleeve carrying case with dedicated charger and phone slots.',
    category_id: 'gift-packs', price: 999, original_price: 1200, gst: 18, is_bestseller: false, is_trending: true, status: 'active',
  },
  {
    name: 'Floral Bed Sheets',
    description: 'Luxury Homes collection 100% pure cotton double bed sheet set with vibrant floral prints and 2 pillow covers.',
    category_id: 'home-decor', price: 749, original_price: 800, gst: 12, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Thermo Steel Water Bottle',
    description: 'Double-walled vacuum insulated stainless steel thermo bottle (750ml) keeps liquids hot or cold for up to 24 hours.',
    category_id: 'just-like-that', price: 399, original_price: 450, gst: 18, is_bestseller: true, is_trending: false, status: 'active',
  }
];

export const seedProductImages = [
  { product_name: 'Rassrang Luxury Double Bedsheet Combo (Set of 4)', images: ['/products/rassrang-bedsheet-combo-4pack.jpg'] },
  { product_name: 'Rose Herbal Tea', images: ['/being-well/rose-herbal-tea.jpg'] },
  { product_name: 'Immunity Herbal Tea', images: ['/being-well/immunity-herbal-tea.jpg'] },
  { product_name: 'Tulsi Green Tea', images: ['/being-well/tulsi-green-tea.jpg'] },
  { product_name: 'Chamomile Herbal Tea', images: ['/being-well/chamomile-herbal-tea.jpg'] },
  { product_name: 'Blue Pea Herbal Tea', images: ['/being-well/blue-pea-herbal-tea.jpg'] },
  { product_name: 'Butterfly Azure Wooden Serving Tray Set', images: ['/tableware/butterfly-wooden-tray.jpg'] },
  { product_name: 'Peacock Compartment Wooden Snack Platter', images: ['/tableware/peacock-wooden-platter.jpg'] },
  { product_name: 'Art Deco Circular Wooden Platter', images: ['/tableware/art-deco-wooden-platter.png'] },
  { product_name: 'Ginkgo Silk Cushion Cover', images: ['/cushions/ginkgo-silk-cushion.jpg'] },
  { product_name: 'Mandala Pair Cushions', images: ['/cushions/mandala-pair-cushions.jpg'] },
  { product_name: 'Metallic Vine Brocade Cushion', images: ['/cushions/metallic-vine-brocade.jpg'] },
  { product_name: 'Paisley Jacquard Cushion', images: ['/cushions/paisley-jacquard-cushion.jpg'] },
  { product_name: 'Botanical Damask Tapestry Cushion', images: ['/cushions/botanical-damask-tapestry.jpg'] },
  { product_name: 'Botanical Damask Tapestry Valance Curtain', images: ['/curtains/botanical-damask-tapestry.jpg'] },
  { product_name: 'Chevron Jacquard Pelmet Drapes', images: ['/curtains/chevron-jacquard-pelmet.jpg'] },
  { product_name: 'Gilded Silk Sheer & Velvet Drapes', images: ['/curtains/gilded-silk-sheer.jpg'] },
  { product_name: 'Terracotta Floral Brocade Curtains', images: ['/curtains/terracotta-floral-brocade.jpg'] },
  { product_name: 'Imperial Floral Jacquard Valance Drapes', images: ['/curtains/imperial-floral-jacquard.jpg'] },
  { product_name: 'Genuine Leather Laptop Bag', images: ['/products/genuine-leather-laptop-bag.jpg'] },
  { product_name: 'Pure Copper Water Bottle (1000ml)', images: ['/products/pure-copper-water-bottle.jpg'] },
  { product_name: 'Handcrafted Canvas Sling Bag', images: ['/products/handcrafted-canvas-sling-bag.jpg'] },
  { product_name: 'Sling Bag Blue', images: ['/products/sling-bag-blue.jpg'] },
  { product_name: 'Leather Sling Bag', images: ['/products/leather-sling-bag.jpg'] },
  { product_name: 'Premium Leather Laptop Sleeve', images: ['/products/premium-leather-laptop-sleeve.jpg'] },
  { product_name: 'Floral Bed Sheets', images: ['/products/floral-bed-sheets.jpg'] },
  { product_name: 'Thermo Steel Water Bottle', images: ['/products/thermo-steel-water-bottle.jpg'] },
  { product_name: 'Premium Assorted Dry Fruits Hamper', images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Herbal Wellness Gift Box', images: ['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Personalized Return Gift Potli Set', images: ['https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Miniature Meenakari Favor Boxes', images: ['https://images.unsplash.com/photo-1602665742701-389671bc40c0?auto=format&fit=crop&q=80&w=800'] },
  { product_name: 'Scented Soy Candle Favor Pack', images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800'] },
];
