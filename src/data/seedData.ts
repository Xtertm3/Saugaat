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

  // Gift Packs parent
  { name: 'Gift Packs', image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 3 },
  { name: 'Premium Gifts', image_url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', parent_id: 'gift-packs', sort_order: 1 },

  // Return Gifts parent
  { name: 'Return Gifts', image_url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 4 },
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

  // Curtains
  { product_name: 'Botanical Damask Tapestry Valance Curtain', images: ['/curtains/botanical-damask-tapestry.jpg'] },
  { product_name: 'Chevron Jacquard Pelmet Drapes', images: ['/curtains/chevron-jacquard-pelmet.jpg'] },
  { product_name: 'Gilded Silk Sheer & Velvet Drapes', images: ['/curtains/gilded-silk-sheer.jpg'] },
  { product_name: 'Terracotta Floral Brocade Curtains', images: ['/curtains/terracotta-floral-brocade.jpg'] },
  { product_name: 'Imperial Floral Jacquard Valance Drapes', images: ['/curtains/imperial-floral-jacquard.jpg'] }
];
