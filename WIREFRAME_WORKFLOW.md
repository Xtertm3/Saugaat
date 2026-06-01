# Saugaat eCommerce - Wireframes & User/Admin Workflows

## 📋 Project Overview
**Saugaat** - Premium gifting & home decor platform with curated hampers and spiritual essentials

---

## 🎯 USER WORKFLOW

### User Flow Diagram
```
┌─────────────────┐
│   Landing Page  │
│   (Home)        │
└────────┬────────┘
         │
         ├──────────────────────────────────────┐
         │                                      │
         ▼                                      ▼
    ┌────────────┐                    ┌─────────────────┐
    │ Browse by  │                    │  Search/Filter  │
    │ Categories │                    │  Products       │
    └────────┬───┘                    └────────┬────────┘
             │                                 │
             └─────────────┬───────────────────┘
                           ▼
                    ┌─────────────────┐
                    │  Product Listing│
                    │  View Items     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Product Details │
                    │ (Image, Price,  │
                    │  Description)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
    ┌────────┐          ┌──────────┐      ┌─────────────┐
    │ Back   │          │Add to    │      │ View/Leave  │
    │to List │          │Cart      │      │ Reviews     │
    └────────┘          └────┬─────┘      └─────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Shopping Cart  │
                    │ (View Items,    │
                    │ Update Qty,     │
                    │ Remove)         │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Checkout      │
                    │                 │
        ┌───────────┼─────────────────┼───────────┐
        │           │                 │           │
        ▼           ▼                 ▼           ▼
   ┌────────┐  ┌─────────┐      ┌──────────┐  ┌─────────┐
   │ Guest  │  │ Sign In │      │ Sign Up  │  │ Register│
   │ Login  │  │ (Existing)     │          │  │         │
   └────────┘  └─────────┘      └──────────┘  └─────────┘
        │           │                 │           │
        └───────────┴─────────────────┴───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Enter Shipping       │
         │ Address &            │
         │ Delivery Details     │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Select Shipping      │
         │ Method/Carrier       │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Enter Billing        │
         │ Address & Payment    │
         │ Method               │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Order Summary        │
         │ (Review & Confirm)   │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Payment Processing   │
         └──────────┬───────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
  ┌──────────────┐      ┌──────────────┐
  │ Order Failed │      │ Order Success│
  │ (Retry)      │      │ Confirmation │
  └──────────────┘      └──────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Order Detail │
                        │ Page +       │
                        │ Email Conf.  │
                        └──────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Track Order  │
                        │ &            │
                        │ My Orders    │
                        └──────────────┘
```

---

## 📱 USER WIREFRAMES

### 1. Home Page
```
┌─────────────────────────────────────┐
│         SAUGAAT HEADER              │
│  Logo    Menu    Search   Cart Login │
├─────────────────────────────────────┤
│                                     │
│     HERO BANNER / CAROUSEL          │
│   "Gifts for Every Occasion"        │
│      [SHOP NOW BUTTON]              │
│                                     │
├─────────────────────────────────────┤
│  SHOP BY CATEGORY SECTION           │
│  ┌──────────┬──────────┬─────────┐ │
│  │  Hampers │Home Decor│Spiritual │ │
│  │ [Image]  │ [Image]  │ [Image]  │ │
│  └──────────┴──────────┴─────────┘ │
│  ┌──────────┬──────────┬─────────┐ │
│  │ Gifting  │Personalized│Seasonal│ │
│  │ [Image]  │ [Image]    │[Image] │ │
│  └──────────┴──────────┴─────────┘ │
├─────────────────────────────────────┤
│  TRENDING NOW SECTION               │
│  ┌─────────────────────────────┐   │
│  │ [Product 1] [Product 2]     │   │
│  │ [Product 3] [Product 4]     │   │
│  │  [View All Products >]      │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│     FEATURES: Free Shipping, Easy   │
│     Returns, Premium Quality        │
├─────────────────────────────────────┤
│            FOOTER                   │
│  Links | Contact | Social | Policy  │
└─────────────────────────────────────┘
```

### 2. Product Listing Page
```
┌─────────────────────────────────────┐
│         SAUGAAT HEADER              │
├─────────────────────────────────────┤
│  Category: Hampers / Filters        │
├─────────────────────────────────────┤
│                                     │
│ FILTERS     | PRODUCT GRID          │
│ ─────────────────────────────────── │
│ Price Range │ ┌─────────────────┐  │
│ [₹100-500]  │ │ Product Card 1  │  │
│             │ │ [Image] -10%    │  │
│ Rating      │ │ ₹450 ₹500       │  │
│ ⭐⭐⭐⭐⭐ │ │[Add to Cart]    │  │
│ ⭐⭐⭐⭐   │ └─────────────────┘  │
│             │ ┌─────────────────┐  │
│ Category    │ │ Product Card 2  │  │
│ [Hampers]   │ │ [Image]         │  │
│ [Decor]     │ │ ₹350            │  │
│ [Spiritual] │ │[Add to Cart]    │  │
│             │ └─────────────────┘  │
│ Availability│ ┌─────────────────┐  │
│ [In Stock]  │ │ Product Card 3  │  │
│ [Pre-Order] │ │ [Image]         │  │
│             │ │ ₹600            │  │
│             │ │[Add to Cart]    │  │
│             │ └─────────────────┘  │
│             │ More Products...     │
│             │ [Load More] OR       │
│             │ Pagination: 1 2 3 .. │
│                                     │
└─────────────────────────────────────┘
```

### 3. Product Detail Page
```
┌─────────────────────────────────────────┐
│         SAUGAAT HEADER                  │
├─────────────────────────────────────────┤
│  Breadcrumb: Home > Hampers > Product   │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │              │  │ Product Name    │ │
│  │   [IMAGE]    │  │ ⭐⭐⭐⭐⭐ (42)  │ │
│  │              │  │                 │ │
│  │               │  │ Price: ₹450     │ │
│  │ [Thumbs]      │  │ Save: ₹50       │ │
│  │ [Zoom]        │  │                 │ │
│  │ [360 View]    │  │ Description:    │ │
│  │               │  │ Premium gift    │ │
│  │ Share ⓕ ⓣ    │  │ hamper with...  │ │
│  └──────────────┘  │                 │ │
│                    │ Qty: [1] +- │   │ │
│                    │                 │ │
│                    │ [ADD TO CART]   │ │
│                    │ [BUY NOW]       │ │
│                    │ [WISHLIST] ♡   │ │
│                    │                 │ │
│                    │ SKU: HAM-001    │ │
│                    │ Status: In Stock│ │
│                    │ Delivery: 2-3d  │ │
│                    └─────────────────┘ │
├─────────────────────────────────────────┤
│ TABS: Description | Specifications |   │
│ Reviews | Related Products              │
├─────────────────────────────────────────┤
│ REVIEWS SECTION                         │
│ [Show Reviews] [Write Review]           │
├─────────────────────────────────────────┤
│ RELATED PRODUCTS                        │
│ [Similar Item 1] [Similar Item 2]       │
│ [Similar Item 3] [Similar Item 4]       │
└─────────────────────────────────────────┘
```

### 4. Shopping Cart Page
```
┌─────────────────────────────────────┐
│         SAUGAAT HEADER              │
├─────────────────────────────────────┤
│  Your Shopping Cart (3 items)       │
├─────────────────────────────────────┤
│                                     │
│ ITEM | QTY | PRICE | SUBTOTAL       │
│ ────────────────────────────────    │
│ [IMG] Premium Hamper | 1 | ₹450 |  │
│       [- qty +] [Remove] [Wishlist] │
│                                     │
│ [IMG] Home Candle    | 2 | ₹300 |  │
│       [- qty +] [Remove] [Wishlist] │
│                                     │
│ [IMG] Spiritual Set  | 1 | ₹250 |  │
│       [- qty +] [Remove] [Wishlist] │
│                                     │
├─────────────────────────────────────┤
│ CONTINUE SHOPPING | [Back]          │
├─────────────────────────────────────┤
│                                     │
│              SUBTOTAL  ₹1000        │
│              SHIPPING   ₹0 (Free)   │
│              TAX        ₹0          │
│              ─────────────────      │
│              TOTAL      ₹1000       │
│                                     │
│          [PROCEED TO CHECKOUT]      │
│                                     │
│  Have a code? [Apply Coupon]        │
│                                     │
└─────────────────────────────────────┘
```

### 5. Checkout - Shipping Address
```
┌─────────────────────────────────────┐
│         SAUGAAT HEADER              │
├─────────────────────────────────────┤
│ STEP 1: Shipping | 2: Payment | 3: Confirm
├─────────────────────────────────────┤
│                                     │
│   DELIVERY ADDRESS FORM             │
│                                     │
│   ☐ Use existing address / ● New   │
│                                     │
│   Full Name: [______________]       │
│   Email:     [______________]       │
│   Phone:     [______________]       │
│   Address:   [______________]       │
│   Apt/Flat:  [______________]       │
│   City:      [______________]       │
│   State:     [Dropdown ▼]           │
│   Postal:    [______________]       │
│   Country:   [Dropdown ▼]           │
│                                     │
│   ☐ Make this default address      │
│                                     │
│  [SAVE & CONTINUE]  [BACK]          │
│                                     │
│  ORDER SUMMARY (Right Panel)        │
│  ──────────────────────────────    │
│  Items (3): ₹1000                   │
│  Shipping: [Select Method]          │
│  - Standard: ₹0 (Free)             │
│  - Express: ₹50                    │
│  Total: ₹1000 - ₹1050              │
│                                     │
└─────────────────────────────────────┘
```

### 6. Checkout - Payment
```
┌─────────────────────────────────────┐
│         SAUGAAT HEADER              │
├─────────────────────────────────────┤
│ STEP 1: Shipping | 2: Payment | 3: Confirm
├─────────────────────────────────────┤
│                                     │
│   PAYMENT METHOD                    │
│                                     │
│   ● Credit/Debit Card              │
│   ○ UPI                            │
│   ○ Net Banking                    │
│   ○ Wallet / Digital Wallet        │
│   ○ Cash on Delivery (COD)         │
│                                     │
│   CARD DETAILS (if selected)        │
│   Card Number: [______________]     │
│   Name: [______________]            │
│   MM/YY: [____]  CVV: [___]         │
│                                     │
│   ☐ Save card for future use       │
│   ☐ Billing same as shipping       │
│                                     │
│   [APPLY COUPON]                    │
│   Coupon Code: [______________]     │
│   Discount: -₹100                   │
│                                     │
│  [CONTINUE TO REVIEW]  [BACK]      │
│                                     │
│  ORDER SUMMARY                      │
│  ──────────────────────────────    │
│  Subtotal: ₹1000                    │
│  Shipping: ₹0                       │
│  Discount: -₹100                    │
│  Tax: ₹0                            │
│  ─────────────────────────────     │
│  TOTAL: ₹900                        │
│                                     │
└─────────────────────────────────────┘
```

### 7. Order Confirmation
```
┌─────────────────────────────────────┐
│         SAUGAAT HEADER              │
├─────────────────────────────────────┤
│                                     │
│  ✓ ORDER SUCCESSFULLY PLACED        │
│                                     │
│  ORDER ID: #ORD-2024-050120         │
│  ORDER DATE: 16 May 2024, 2:30 PM   │
│  Email sent to: user@email.com      │
│                                     │
│  Status: Processing ⏳              │
│  Expected Delivery: 18 May 2024     │
│                                     │
│  [TRACK MY ORDER]  [DOWNLOAD INVOICE│
│  [CONTINUE SHOPPING]                │
│                                     │
│  ────────────────────────────────   │
│  ORDER SUMMARY                      │
│  ────────────────────────────────   │
│  Items: 3                           │
│  • Premium Hamper x1     ₹450       │
│  • Home Candle x2         ₹300       │
│  • Spiritual Set x1       ₹250       │
│                                     │
│  Shipping Address:                  │
│  John Doe                           │
│  123 Main St, City - 400001         │
│                                     │
│  Subtotal: ₹1000                    │
│  Shipping: ₹0 (Free)                │
│  Discount: -₹100                    │
│  ─────────────────────────────     │
│  TOTAL PAID: ₹900                   │
│                                     │
│  Payment Method: Debit Card xxxx1234│
│                                     │
└─────────────────────────────────────┘
```

### 8. User Account / My Orders
```
┌─────────────────────────────────────┐
│         SAUGAAT HEADER              │
├─────────────────────────────────────┤
│  Welcome, John Doe!                 │
│  [Profile] [Orders] [Wishlist]      │
│  [Saved Addresses] [Settings]       │
├─────────────────────────────────────┤
│                                     │
│  MY ORDERS                          │
│  ──────────────────────────────    │
│  ┌────────────────────────────────┐│
│  │ ORDER #ORD-2024-050120          ││
│  │ Date: 16 May 2024  |Status: Out ││
│  │ for Delivery  | Total: ₹900    ││
│  │ Items: 3 Products               ││
│  │ [VIEW DETAILS] [TRACK] [RETURN] ││
│  └────────────────────────────────┘│
│  ┌────────────────────────────────┐│
│  │ ORDER #ORD-2024-050105          ││
│  │ Date: 10 May 2024  |Status:     ││
│  │ Delivered | Total: ₹750        ││
│  │ Items: 2 Products               ││
│  │ [VIEW DETAILS] [REORDER]        ││
│  └────────────────────────────────┘│
│  ┌────────────────────────────────┐│
│  │ ORDER #ORD-2024-050001          ││
│  │ Date: 05 May 2024  |Status:     ││
│  │ Delivered | Total: ₹1200       ││
│  │ Items: 4 Products               ││
│  │ [VIEW DETAILS]                  ││
│  └────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

---

## 👨‍💼 ADMIN WORKFLOW

### Admin Flow Diagram
```
┌──────────────────┐
│  Admin Dashboard │
│   (Login)        │
└────────┬─────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌─────────┐  ┌──────────┐
│Auth/2FA │  │Main Dash │
└────┬────┘  └─────┬────┘
     │             │
     └─────┬───────┘
           │
    ┌──────┴───────────────────────────────┐
    │                                      │
    ▼                                      ▼
┌──────────────┐                    ┌──────────────┐
│ PRODUCTS     │                    │ ORDERS       │
│              │                    │              │
│ • View All   │                    │ • View Orders│
│ • Add New    │                    │ • Process    │
│ • Edit       │                    │ • Cancel/Ret │
│ • Delete     │                    │ • Generate   │
│ • Inventory  │                    │   Invoice    │
│ • Categories │                    │ • Update     │
│              │                    │   Status     │
└──────────────┘                    └──────────────┘
                │
                ├─────────────────────────┐
                │                         │
                ▼                         ▼
         ┌──────────────┐         ┌──────────────┐
         │ CUSTOMERS    │         │ ANALYTICS    │
         │              │         │              │
         │ • View       │         │ • Sales      │
         │ • Edit       │         │ • Orders     │
         │ • Delete     │         │ • Revenue    │
         │ • Orders     │         │ • Top Prod.  │
         │ • Messages   │         │ • Visitors   │
         │ • Segments   │         │ • Trends     │
         └──────────────┘         └──────────────┘
                │
                └─────────┬───────────────┐
                          ▼               ▼
                   ┌─────────────┐   ┌─────────────┐
                   │ SETTINGS    │   │ MARKETING   │
                   │             │   │             │
                   │ • General   │   │ • Campaigns │
                   │ • Payment   │   │ • Coupons   │
                   │ • Shipping  │   │ • Promotions│
                   │ • Email     │   │ • Email     │
                   │ • Security  │   │ • SMS       │
                   │ • Users     │   │ • Analytics │
                   │   & Roles   │   │             │
                   └─────────────┘   └─────────────┘
```

---

## 📊 ADMIN WIREFRAMES

### 1. Admin Dashboard (Home)
```
┌─────────────────────────────────────────────────┐
│  SAUGAAT ADMIN PANEL                            │
│  Logo    [Profile ▼] [Notifications] [Logout]   │
├─────────────────────────────────────────────────┤
│                                                 │
│ SIDEBAR                 MAIN CONTENT            │
│ ────────────            ───────────────        │
│ · Dashboard             Welcome Back, Admin!    │
│ · Products              Today's Report:         │
│ · Orders                                        │
│ · Customers             ┌──────┬───────┬──────┐│
│ · Analytics             │Orders │Revenue│Users││
│ · Marketing             │ 24    │₹12.5K │ 42  ││
│ · Settings              │ ↑8%   │ ↑12% │↑5% ││
│ · Reports              └──────┴───────┴──────┘│
│ · Content Mgmt          │                      │
│ · Support Tickets       │ RECENT ORDERS        │
│                         │                      │
│                         │ #ORD-001 John Doe    │
│                         │ Status: Processing   │
│                         │ ₹900 | 16 May        │
│                         │                      │
│                         │ #ORD-002 Jane Smith  │
│                         │ Status: Shipped      │
│                         │ ₹1200 | 15 May       │
│                         │                      │
│                         │ CHART: Sales Trend   │
│                         │ [Line Chart Area]    │
│                         │ May 1 - May 16       │
│                         │                      │
└─────────────────────────────────────────────────┘
```

### 2. Products Management
```
┌─────────────────────────────────────────────────┐
│  SAUGAAT ADMIN > PRODUCTS                       │
├─────────────────────────────────────────────────┤
│  [+NEW PRODUCT] [BULK IMPORT] [EXPORT]          │
│  Search: [_________]  Filter: Category [▼]     │
│  Status: [All ▼] Price: [₹0 - ₹999 ▼]         │
├─────────────────────────────────────────────────┤
│                                                 │
│ ID | Product Name | Category | Price | Stock   │
│ ─────────────────────────────────────────     │
│ 1  │ Premium Hamper │ Hampers │ ₹450  │ 45    │
│    │ [Edit] [Delete] [View]                   │
│ 2  │ Scented Candle │ Decor   │ ₹150  │ 120   │
│    │ [Edit] [Delete] [View]                   │
│ 3  │ Spiritual Set  │ Spirit. │ ₹250  │ 30    │
│    │ [Edit] [Delete] [View]                   │
│ 4  │ Gift Box       │ Hampers │ ₹600  │ 0     │
│    │ [Edit] [Delete] [View]                   │
│ ... [More items]                              │
│                                                 │
│ Pagination: 1 2 3 ... [Next]                   │
│ Showing 1-10 of 156 products                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 3. Add/Edit Product
```
┌─────────────────────────────────────────────────┐
│  SAUGAAT ADMIN > ADD NEW PRODUCT                │
├─────────────────────────────────────────────────┤
│                                                 │
│ BASIC INFORMATION                               │
│ ──────────────────────────────                 │
│ Product Name: [___________________] *          │
│ SKU: [_____________]  *  [Auto-Generate]      │
│ Category: [Hampers ▼]  *                      │
│ Subcategory: [______] *                       │
│ Description:                                   │
│ [________________________________________]     │
│ [________________________________________]     │
│                                                 │
│ PRICING & INVENTORY                             │
│ ────────────────────                           │
│ Cost Price: ₹[___]  Sale Price: ₹[___]  *    │
│ Discount: [__]% OR ₹[__]                      │
│ Stock Quantity: [___] *                       │
│ Track Inventory: ☑                            │
│ Low Stock Alert: ☑ Notify at [__] units      │
│                                                 │
│ IMAGES                                          │
│ ──────                                         │
│ [Upload Featured Image] ┌─────┐               │
│                         │     │               │
│                         └─────┘               │
│ [Add Gallery Images] [Image 1] [Image 2]      │
│                                                 │
│ ATTRIBUTES & VARIANTS                           │
│ ───────────────────────                        │
│ Size: [Small] [Medium] [Large]                │
│ Color: [Red] [Blue] [Green]                   │
│ [Add Variant]                                  │
│                                                 │
│ SEO OPTIMIZATION                                │
│ ─────────────────────                         │
│ Meta Title: [__________]                      │
│ Meta Desc: [__________]                       │
│ Keywords: [__________]                        │
│                                                 │
│ Status: ☑ Active  ☐ Draft  ☐ Hidden          │
│                                                 │
│ [SAVE PRODUCT] [PREVIEW] [CANCEL]             │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4. Orders Management
```
┌─────────────────────────────────────────────────┐
│  SAUGAAT ADMIN > ORDERS                         │
├─────────────────────────────────────────────────┤
│  Search: [_________]  Status: [All ▼]          │
│  Date: [From] [To]  Payment: [All ▼]          │
│  Sort: [Newest ▼]                             │
├─────────────────────────────────────────────────┤
│                                                 │
│ ORDER  │ CUSTOMER │ ITEMS │ TOTAL │ STATUS    │
│ ───────┼──────────┼───────┼───────┼──────     │
│ #001   │ J. Doe   │ 3     │ ₹900  │ Processing│
│        │ [Details] [Print] [Action ▼]         │
│ #002   │ J. Smith │ 2     │ ₹1200 │ Shipped  │
│        │ [Details] [Print] [Action ▼]         │
│ #003   │ A. Kumar │ 1     │ ₹450  │ Delivered│
│        │ [Details] [Print] [Action ▼]         │
│ #004   │ M. Shah  │ 4     │ ₹1500 │ Pending  │
│        │ [Details] [Print] [Action ▼]         │
│ ... [More orders]                             │
│                                                 │
│ Pagination: 1 2 3 ... [Next]                   │
│ Showing 1-10 of 156 orders                     │
│                                                 │
│ BULK ACTIONS:                                   │
│ [☑ Mark as Shipped] [☑ Mark as Delivered]    │
│ [☑ Print Labels] [☑ Send Email]              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 5. Order Details
```
┌─────────────────────────────────────────────────┐
│  SAUGAAT ADMIN > ORDER #ORD-001                │
├─────────────────────────────────────────────────┤
│                                                 │
│ ORDER INFORMATION                               │
│ ────────────────────                           │
│ Order ID: ORD-001  Date: 16 May 2024           │
│ Status: [Processing ▼]  Payment: Paid          │
│ Customer: John Doe (ID: CUST-123)              │
│                                                 │
│ CUSTOMER DETAILS                                │
│ ─────────────────                              │
│ Name: John Doe                                  │
│ Email: john@email.com                          │
│ Phone: +91-9876543210                          │
│ Billing Address: [Same as Shipping]            │
│ Shipping Address:                              │
│ 123 Main St, Mumbai - 400001                   │
│                                                 │
│ ORDER ITEMS                                     │
│ ────────────                                   │
│ ┌────────────┬─────┬──────┬────┐              │
│ │ Product    │ Qty │ Price│ Sub│              │
│ ├────────────┼─────┼──────┼────┤              │
│ │Premium Ham │ 1   │ ₹450 │ ₹450│             │
│ │Home Candle │ 2   │ ₹150 │ ₹300│             │
│ │Spiritual   │ 1   │ ₹250 │ ₹250│             │
│ └────────────┴─────┴──────┴────┘              │
│                                                 │
│ PRICING SUMMARY                                 │
│ ────────────────────                           │
│ Subtotal:        ₹1000                         │
│ Shipping:        ₹0 (Free)                     │
│ Tax:             ₹0                            │
│ Discount:        -₹100 (Coupon: MAY100)        │
│ ─────────────────────────────────             │
│ TOTAL:           ₹900                          │
│                                                 │
│ PAYMENT DETAILS                                 │
│ ────────────────                               │
│ Method: Debit Card                             │
│ Card: xxxx-xxxx-xxxx-1234                      │
│ Transaction ID: TXN-2024-0501                  │
│ Status: Completed                              │
│                                                 │
│ SHIPPING INFORMATION                            │
│ ────────────────────                           │
│ Carrier: [Select ▼]  Tracking: [_______]      │
│ Estimated Delivery: 18 May 2024                │
│ [PRINT SHIPPING LABEL]                         │
│ [SEND SHIPPING NOTIFICATION]                   │
│                                                 │
│ TIMELINE                                        │
│ ────────                                       │
│ ✓ Order Placed: 16 May, 02:30 PM              │
│ ○ Payment Confirmed: 16 May, 02:31 PM         │
│ ○ Order Processing: ---                        │
│ ○ Shipped: ---                                 │
│ ○ Out for Delivery: ---                        │
│ ○ Delivered: ---                               │
│                                                 │
│ ACTIONS                                         │
│ ───────                                        │
│ [UPDATE STATUS] [SEND EMAIL] [REFUND]         │
│ [ADD NOTE] [PRINT INVOICE] [BACK]             │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 6. Analytics Dashboard
```
┌─────────────────────────────────────────────────┐
│  SAUGAAT ADMIN > ANALYTICS                      │
├─────────────────────────────────────────────────┤
│  Date Range: [16 May - 30 May] [▼] [Apply]    │
│                                                 │
│  KPI CARDS                                      │
│  ┌────────┬────────┬────────┬─────────┐        │
│  │ Total  │ Average│ Unique │Conversion│       │
│  │ Orders │ Order  │ Visitors│  Rate   │       │
│  │  156   │ ₹925   │  1,240  │  12.5%  │       │
│  │ ↑32%   │ ↑8%    │ ↑18%    │ ↓2%     │       │
│  └────────┴────────┴────────┴─────────┘        │
│                                                 │
│  SALES TREND (LINE CHART)                       │
│  ┌──────────────────────────────────┐           │
│  │       []  []                      │           │
│  │   []  []  []  []  []             │           │
│  │ []  []  []  []  []  []           │           │
│  │ May 1 .. May 15                  │           │
│  └──────────────────────────────────┘           │
│                                                 │
│  TOP PRODUCTS (BAR CHART)                       │
│  ┌──────────────────────┐                       │
│  │ Premium Hamper   ███ 45 units                │
│  │ Scented Candle   ██ 35 units                 │
│  │ Spiritual Set    ██ 28 units                 │
│  │ Gift Box         █ 20 units                  │
│  └──────────────────────┘                       │
│                                                 │
│  REVENUE BY CATEGORY (PIE CHART)                │
│  ┌──────────────────────┐                       │
│  │  ◐ Hampers: 45%      │                       │
│  │  ◑ Decor: 30%        │                       │
│  │  ◑ Spiritual: 25%    │                       │
│  └──────────────────────┘                       │
│                                                 │
│  RECENT ORDERS TABLE                            │
│  Order│Customer│Amount│ Status  │  Date        │
│  ─────┼────────┼──────┼─────────┼─────────     │
│  001  │ J. Doe │ ₹900 │ Shipped │ 16 May       │
│  002  │J. Smith│₹1200 │Delivered│ 15 May       │
│  ..                                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 7. Customer Management
```
┌─────────────────────────────────────────────────┐
│  SAUGAAT ADMIN > CUSTOMERS                      │
├─────────────────────────────────────────────────┤
│  Search: [_________]  Status: [All ▼]          │
│  Join Date: [From] [To]  Segment: [All ▼]    │
├─────────────────────────────────────────────────┤
│                                                 │
│ ID  │ NAME    │ EMAIL         │ ORDERS │ SPENT │
│ ────┼─────────┼───────────────┼────────┼──────│
│ 001 │ J. Doe  │ john@em.com   │ 3      │ ₹2500│
│     │ [View Profile] [Edit] [Message]         │
│ 002 │ J. Smith│ jane@em.com   │ 2      │ ₹1800│
│     │ [View Profile] [Edit] [Message]         │
│ 003 │ A. Kumar│ amit@em.com   │ 1      │ ₹450 │
│     │ [View Profile] [Edit] [Message]         │
│ ... [More customers]                          │
│                                                 │
│ Showing 1-10 of 342 customers                  │
│ Pagination: 1 2 3 ... [Next]                   │
│                                                 │
│ BULK ACTIONS:                                   │
│ [☑ Send Email] [☑ Add to Segment]             │
│ [☑ Export List]                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 8. Settings/Configuration
```
┌─────────────────────────────────────────────────┐
│  SAUGAAT ADMIN > SETTINGS                       │
├─────────────────────────────────────────────────┤
│  [General] [Payment] [Shipping] [Email] [Users] │
├─────────────────────────────────────────────────┤
│                                                 │
│ GENERAL SETTINGS                                │
│ ──────────────────────                         │
│ Store Name: [Saugaat]                          │
│ Store URL: [saugaat.com]                       │
│ Support Email: [support@saugaat.com]           │
│ Support Phone: [+91-9876543210]                │
│ Currency: [INR ▼]                             │
│ Timezone: [IST (UTC+5:30) ▼]                  │
│ Language: [English ▼]                         │
│ Items per Page: [20 ▼]                        │
│                                                 │
│ PAYMENT SETTINGS                                │
│ ──────────────────                             │
│ ☑ Credit/Debit Card (Stripe)                  │
│ ☑ UPI (Razorpay)                              │
│ ☑ Net Banking                                 │
│ ☑ Wallet / Digital Wallet                     │
│ ☑ Cash on Delivery                            │
│                                                 │
│ Razorpay Key ID: [_____________] *            │
│ Razorpay Secret: [_____________] *            │
│                                                 │
│ SHIPPING METHODS                                │
│ ─────────────────                              │
│ ☑ Standard Shipping                           │
│   Base Cost: ₹0 (Free threshold: ₹500)        │
│ ☑ Express Shipping                            │
│   Base Cost: ₹50                              │
│ ☑ International Shipping                      │
│   Enabled for: [Select Countries]             │
│                                                 │
│ TAX CONFIGURATION                               │
│ ──────────────────                             │
│ Tax Rate: [0]% OR [ ] GST Enabled             │
│                                                 │
│ [SAVE SETTINGS] [RESET] [CANCEL]              │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔑 KEY USER FLOWS SUMMARY

| User Type | Main Journey | Key Pages | Actions |
|-----------|--------------|-----------|---------|
| **Guest User** | Browse → Product View → Cart → Checkout | Home, Category, Product, Cart | Add to cart, Sign up during checkout |
| **Registered User** | Login → Browse → Cart → Order → Track | All above + My Account | Same + save preferences |
| **Repeat Customer** | Quick reorder → Checkout | All above | Save addresses, one-click checkout |
| **Admin** | Dashboard → Manage Products/Orders → Analytics | Dashboard, Products, Orders, Analytics | Create, edit, delete, ship orders |

---

## 💡 KEY FEATURES TO IMPLEMENT

### User Side:
- ✅ Product Browse & Search
- ✅ Shopping Cart Management
- ✅ User Registration/Login (via Supabase)
- ⏳ Order Checkout (Payment integration needed)
- ⏳ Order Tracking
- ⏳ Wishlist
- ⏳ User Profile & Account Management
- ⏳ Reviews & Ratings

### Admin Side:
- ⏳ Admin Dashboard & Analytics
- ⏳ Product Management (CRUD)
- ⏳ Order Management
- ⏳ Customer Management
- ⏳ Payment & Shipping Configuration
- ⏳ Inventory Management
- ⏳ Promotional Tools (Coupons, Discounts)
- ⏳ Email Notifications

---

## 📱 RESPONSIVE DESIGN NOTES

- **Mobile**: Stack all content vertically, hamburger menu, bottom nav for main sections
- **Tablet**: 2-column for products, collapsible sidebar
- **Desktop**: Full navigation, product grids, sidebar navigation

---

## 🎨 DESIGN SYSTEM

**Colors**:
- Primary: Elegant Gold/Burgundy (luxury feel)
- Background: Cream/Off-white
- Accent: Warm terracotta
- Text: Dark gray/charcoal

**Typography**:
- Headings: Serif (elegant)
- Body: Sans-serif (readable)

**Components**:
- Cards with subtle shadows
- Smooth animations (Framer Motion ✓)
- Consistent spacing & padding
