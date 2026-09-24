// Hierarchical category structure with parent + subcategories
export const seedCategories = [
  { name: 'Being Well', image_url: '/being-well/rose-herbal-tea.jpg', parent_id: null, sort_order: 1 },

  { name: 'Home Decor', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 2 },
  { name: 'Curtains', image_url: '/curtains/botanical-damask-tapestry.jpg', parent_id: 'home-decor', sort_order: 1 },
  { name: 'Cushions', image_url: '/cushions/ginkgo-silk-cushion.jpg', parent_id: 'home-decor', sort_order: 2 },
  { name: 'Wall Decor', image_url: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 3 },
  { name: 'Showpieces', image_url: 'https://images.unsplash.com/photo-1572186192734-1779ef884240?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 4 },
  { name: 'Vases & Planters', image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 5 },

  { name: 'Just Like That', image_url: '/tableware/butterfly-wooden-tray.jpg', parent_id: null, sort_order: 3 },
  { name: 'Tableware', image_url: '/tableware/butterfly-wooden-tray.jpg', parent_id: 'just-like-that', sort_order: 1 },

  { name: 'Gift Packs', image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 4 },
  { name: 'Premium Gifts', image_url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', parent_id: 'gift-packs', sort_order: 1 },

  { name: 'Return Gifts', image_url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 5 },
  { name: 'Wedding Favors', image_url: 'https://images.unsplash.com/photo-1602665742701-389671bc40c0?auto=format&fit=crop&q=80&w=800', parent_id: 'return-gifts', sort_order: 1 },
];

export const seedProducts = [
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
    description: 'Soothing chamomile blossoms for restful evenings. Naturally caffeine-free. Net Wt.: 50g.',
    category_id: 'being-well', price: 190, original_price: 240, gst: 5, is_bestseller: false, is_trending: false, status: 'active',
  },
  {
    name: 'Blue Pea Herbal Tea',
    description: 'Vibrant blue pea flower tea for natural body detox, cognitive health, and vibrant wellness. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well', price: 225, original_price: 280, gst: 5, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Butterfly Azure Wooden Serving Tray Set',
    description: 'Handcrafted luxury wooden serving tray set with vibrant blue butterfly art motif and high-durability moisture resistant lacquer finish.',
    category_id: 'tableware', price: 1800, original_price: 2200, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Peacock Compartment Wooden Snack Platter',
    description: 'Hand-painted 4-section wooden platter featuring traditional Rajasthani peacock tile artwork. Ideal for serving dry fruits, cheese, and appetizers.',
    category_id: 'tableware', price: 850, original_price: 1100, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Art Deco Circular Wooden Platter',
    description: 'Modern circular wooden serving platter with sleek black gloss finish and sunburst ivory geometric art inlay.',
    category_id: 'tableware', price: 720, original_price: 950, gst: 18, is_bestseller: true, is_trending: false, status: 'active',
  },
  {
    name: 'Ginkgo Silk Cushion',
    description: 'Luxurious silk-feel cushion featuring elegant ginkgo leaf motif. Soft fill, hidden zip. 45x45 cm.',
    category_id: 'cushions', price: 1299, original_price: 1699, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Mandala Pair Cushions',
    description: 'Matching pair of mandala-pattern cushions in rich jewel tones. Perfect for sofas and daybeds. Set of 2.',
    category_id: 'cushions', price: 1899, original_price: 2499, gst: 18, is_bestseller: true, is_trending: false, status: 'active',
  },
  {
    name: 'Metallic Vine Brocade Cushion',
    description: 'Opulent brocade cushion with metallic vine embroidery. Statement piece for formal living spaces.',
    category_id: 'cushions', price: 1499, original_price: 1999, gst: 18, is_bestseller: false, is_trending: true, status: 'active',
  },
  {
    name: 'Paisley Jacquard Cushion',
    description: 'Classic paisley jacquard weave cushion in warm earth tones. Durable and timeless.',
    category_id: 'cushions', price: 1199, original_price: 1599, gst: 18, is_bestseller: false, is_trending: false, status: 'active',
  },
  {
    name: 'Botanical Damask Tapestry Cushion',
    description: 'Tapestry-style cushion with botanical damask pattern. Coordinates with matching curtains.',
    category_id: 'cushions', price: 1399, original_price: 1799, gst: 18, is_bestseller: true, is_trending: false, status: 'active',
  },
  {
    name: 'Botanical Damask Tapestry Valance Curtain',
    description: 'Hand-tailored classical damask valance curtains with ornate pelmet header, thick woven blackout drape lining, and matching tiebacks. Request a quote for custom sizing.',
    category_id: 'curtains', price: 0, original_price: 0, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
  {
    name: 'Chevron Jacquard Pelmet Drapes',
    description: 'Modern luxury herringbone and chevron patterned jacquard drapes with structured scalloped pelmet and custom border trim. Request a quote for custom sizing.',
    category_id: 'curtains', price: 0, original_price: 0, gst: 18, is_bestseller: true, is_trending: false, status: 'active',
  },
  {
    name: 'Gilded Silk Sheer & Velvet Drapes',
    description: 'Opulent cream silk & velvet curtains featuring central lace trim accents, scalloped valance, and sheer inner backdrop. Request a quote for custom sizing.',
    category_id: 'curtains', price: 0, original_price: 0, gst: 18, is_bestseller: false, is_trending: true, status: 'active',
  },
  {
    name: 'Terracotta Floral Brocade Curtains',
    description: 'Warm terracotta floral brocade curtains with rich texture and traditional Indian motif. Request a quote for custom sizing.',
    category_id: 'curtains', price: 0, original_price: 0, gst: 18, is_bestseller: true, is_trending: false, status: 'active',
  },
  {
    name: 'Imperial Floral Jacquard Valance Drapes',
    description: 'Royal taupe and beige floral jacquard drapes with multi-panel valance header and luxurious heavy drop fabric. Request a quote for custom sizing.',
    category_id: 'curtains', price: 0, original_price: 0, gst: 18, is_bestseller: true, is_trending: true, status: 'active',
  },
];

export const seedProductImages = [
  { product_name: 'Rose Herbal Tea', images: ['/being-well/rose-herbal-tea.jpg'] },
  { product_name: 'Immunity Herbal Tea', images: ['/being-well/immunity-herbal-tea.jpg'] },
  { product_name: 'Tulsi Green Tea', images: ['/being-well/tulsi-green-tea.jpg'] },
  { product_name: 'Chamomile Herbal Tea', images: ['/being-well/chamomile-herbal-tea.jpg'] },
  { product_name: 'Blue Pea Herbal Tea', images: ['/being-well/blue-pea-herbal-tea.jpg'] },
  { product_name: 'Butterfly Azure Wooden Serving Tray Set', images: ['/tableware/butterfly-wooden-tray.jpg'] },
  { product_name: 'Peacock Compartment Wooden Snack Platter', images: ['/tableware/peacock-wooden-platter.jpg'] },
  { product_name: 'Art Deco Circular Wooden Platter', images: ['/tableware/art-deco-wooden-platter.png'] },
  { product_name: 'Ginkgo Silk Cushion', images: ['/cushions/ginkgo-silk-cushion.jpg'] },
  { product_name: 'Mandala Pair Cushions', images: ['/cushions/mandala-pair-cushions.jpg'] },
  { product_name: 'Metallic Vine Brocade Cushion', images: ['/cushions/metallic-vine-brocade.jpg'] },
  { product_name: 'Paisley Jacquard Cushion', images: ['/cushions/paisley-jacquard-cushion.jpg'] },
  { product_name: 'Botanical Damask Tapestry Cushion', images: ['/cushions/botanical-damask-tapestry.jpg'] },
  { product_name: 'Botanical Damask Tapestry Valance Curtain', images: ['/curtains/botanical-damask-tapestry.jpg'] },
  { product_name: 'Chevron Jacquard Pelmet Drapes', images: ['/curtains/chevron-jacquard-pelmet.jpg'] },
  { product_name: 'Gilded Silk Sheer & Velvet Drapes', images: ['/curtains/gilded-silk-sheer.jpg'] },
  { product_name: 'Terracotta Floral Brocade Curtains', images: ['/curtains/terracotta-floral-brocade.jpg'] },
  { product_name: 'Imperial Floral Jacquard Valance Drapes', images: ['/curtains/imperial-floral-jacquard.jpg'] },
];
