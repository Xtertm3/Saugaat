// Hierarchical category structure with parent + subcategories
export const seedCategories = [
  // Being Well parent (Top Priority)
  { name: 'Being Well', image_url: '/being-well/rose-herbal-tea.jpg', parent_id: null, sort_order: 1 },

  // Home Decor parent
  { name: 'Home Decor', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 2 },
  { name: 'Curtains', image_url: '/curtains/botanical-damask-tapestry.jpg', parent_id: 'home-decor', sort_order: 1 },
  { name: 'Wall Decor', image_url: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 2 },
  { name: 'Showpieces', image_url: 'https://images.unsplash.com/photo-1572186192734-1779ef884240?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 3 },
  { name: 'Vases & Planters', image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 4 },

  // Just Like That parent
  { name: 'Just Like That', image_url: '/tableware/butterfly-wooden-tray.jpg', parent_id: null, sort_order: 3 },
  { name: 'Tableware', image_url: '/tableware/butterfly-wooden-tray.jpg', parent_id: 'just-like-that', sort_order: 1 },

  // Gift Packs parent
  { name: 'Gift Packs', image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 4 },
  { name: 'Premium Gifts', image_url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', parent_id: 'gift-packs', sort_order: 1 },

  // Return Gifts parent
  { name: 'Return Gifts', image_url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 5 },
  { name: 'Wedding Favors', image_url: 'https://images.unsplash.com/photo-1602665742701-389671bc40c0?auto=format&fit=crop&q=80&w=800', parent_id: 'return-gifts', sort_order: 1 }
];

// Product seed data - Clean catalog without generic demo products
export const seedProducts = [
  // === BEING WELL PRODUCTS ===
  {
    name: 'Rose Herbal Tea',
    description: 'Pure herbal wellness in every sip. Crafted with 100% natural damask rose petals, naturally caffeine-free. Promotes glowing skin, natural detox, and deep relaxation. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well',
    price: 235,
    original_price: 299,
    gst: 5,
    is_bestseller: true,
    is_trending: true,
    status: 'active'
  },
  {
    name: 'Immunity Herbal Tea',
    description: 'Formulated to strengthen body defenses with potent traditional herbs and antioxidants. 100% natural, caffeine-free infusion to fight seasonal illness and boost daily vitality. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well',
    price: 230,
    original_price: 280,
    gst: 5,
    is_bestseller: true,
    is_trending: true,
    status: 'active'
  },
  {
    name: 'Tulsi Green Tea',
    description: 'Revitalizing blend of pure holy basil (tulsi) and fine green tea leaves. Rich in protective antioxidants, aids natural weight loss and daily body detox. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well',
    price: 200,
    original_price: 250,
    gst: 5,
    is_bestseller: true,
    is_trending: true,
    status: 'active'
  },
  {
    name: 'Chamomile Herbal Tea',
    description: 'Calming and restorative herbal tea crafted with whole chamomile blossoms. 100% natural, naturally caffeine-free. Supports immunity, relaxes body & mind, and promotes better restful sleep. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well',
    price: 250,
    original_price: 320,
    gst: 5,
    is_bestseller: true,
    is_trending: true,
    status: 'active'
  },
  {
    name: 'Blue Pea Herbal Tea',
    description: 'Exotic butterfly blue pea flower tea rich in vibrant natural anthocyanin antioxidants. 100% natural, caffeine-free infusion for natural body detox, cognitive brain health, and vibrant wellness. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well',
    price: 250,
    original_price: 320,
    gst: 5,
    is_bestseller: true,
    is_trending: true,
    status: 'active'
  },

  // === TABLEWARE (Just Like That) ===
  {
    name: 'Butterfly Azure Wooden Serving Tray Set',
    description: 'Handcrafted luxury wooden serving tray set with vibrant blue butterfly art motif and high-durability moisture resistant lacquer finish.',
    category_id: 'tableware',
    price: 1800,
    original_price: 2200,
    gst: 18,
    is_bestseller: true,
    is_trending: true,
    status: 'active'
  },
  {
    name: 'Peacock Compartment Wooden Snack Platter',
    description: 'Hand-painted 4-section wooden platter featuring traditional Rajasthani peacock tile artwork. Ideal for serving dry fruits, cheese, and appetizers.',
    category_id: 'tableware',
    price: 850,
    original_price: 1100,
    gst: 18,
    is_bestseller: true,
    is_trending: true,
    status: 'active'
  },
  {
    name: 'Art Deco Circular Wooden Platter',
    description: 'Modern circular wooden serving platter with sleek black gloss finish and sunburst ivory geometric art inlay.',
    category_id: 'tableware',
    price: 720,
    original_price: 950,
    gst: 18,
    is_bestseller: true,
    is_trending: false,
    status: 'active'
  },

  // === CURTAINS COLLECTION (Quote-based) ===
  {
    name: 'Botanical Damask Tapestry Valance Curtain',
    description: 'Hand-tailored classical damask valance curtains with ornate pelmet header, thick woven blackout drape lining, and matching tiebacks.',
    category_id: 'curtains',
    price: 0,
    original_price: 0,
    gst: 18,
    is_bestseller: true,
    is_trending: true,
    status: 'active'
  },
  {
    name: 'Chevron Jacquard Pelmet Drapes',
    description: 'Modern luxury herringbone and chevron patterned jacquard drapes with structured scalloped pelmet and custom border trim.',
    category_id: 'curtains',
    price: 0,
    original_price: 0,
    gst: 18,
    is_bestseller: true,
    is_trending: false,
    status: 'active'
  },
  {
    name: 'Gilded Silk Sheer & Velvet Drapes',
    description: 'Opulent cream silk & velvet curtains featuring central lace trim accents, scalloped valance, and sheer inner backdrop.',
    category_id: 'curtains',
    price: 0,
    original_price: 0,
    gst: 18,
    is_bestseller: false,
    is_trending: true,
    status: 'active'
  },
  {
    name: 'Terracotta Floral Brocade Curtains',
    description: 'Rich terracotta floral brocade pelmet curtains with cream blackout side drapes and vintage ornamental tie-backs.',
    category_id: 'curtains',
    price: 0,
    original_price: 0,
    gst: 18,
    is_bestseller: false,
    is_trending: false,
    status: 'active'
  },
  {
    name: 'Imperial Floral Jacquard Valance Drapes',
    description: 'Royal taupe and beige floral jacquard drapes with multi-panel valance header and luxurious heavy drop fabric.',
    category_id: 'curtains',
    price: 0,
    original_price: 0,
    gst: 18,
    is_bestseller: true,
    is_trending: true,
    status: 'active'
  }
];

// Product images seed data mapping products to images
export const seedProductImages = [
  // Being Well
  { product_name: 'Rose Herbal Tea', images: ['/being-well/rose-herbal-tea.jpg'] },
  { product_name: 'Immunity Herbal Tea', images: ['/being-well/immunity-herbal-tea.jpg'] },
  { product_name: 'Tulsi Green Tea', images: ['/being-well/tulsi-green-tea.jpg'] },
  { product_name: 'Chamomile Herbal Tea', images: ['/being-well/chamomile-herbal-tea.jpg'] },
  { product_name: 'Blue Pea Herbal Tea', images: ['/being-well/blue-pea-herbal-tea.jpg'] },

  // Tableware
  { product_name: 'Butterfly Azure Wooden Serving Tray Set', images: ['/tableware/butterfly-wooden-tray.jpg'] },
  { product_name: 'Peacock Compartment Wooden Snack Platter', images: ['/tableware/peacock-wooden-platter.jpg'] },
  { product_name: 'Art Deco Circular Wooden Platter', images: ['/tableware/art-deco-wooden-platter.png'] },

  // Curtains
  { product_name: 'Botanical Damask Tapestry Valance Curtain', images: ['/curtains/botanical-damask-tapestry.jpg'] },
  { product_name: 'Chevron Jacquard Pelmet Drapes', images: ['/curtains/chevron-jacquard-pelmet.jpg'] },
  { product_name: 'Gilded Silk Sheer & Velvet Drapes', images: ['/curtains/gilded-silk-sheer.jpg'] },
  { product_name: 'Terracotta Floral Brocade Curtains', images: ['/curtains/terracotta-floral-brocade.jpg'] },
  { product_name: 'Imperial Floral Jacquard Valance Drapes', images: ['/curtains/imperial-floral-jacquard.jpg'] }
];
