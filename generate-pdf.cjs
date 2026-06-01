const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generatePDF() {
  const doc = new PDFDocument({ 
    margin: 50,
    size: 'A4'
  });

  const pdfPath = path.join(__dirname, 'implementation_plan.pdf');
  doc.pipe(fs.createWriteStream(pdfPath));

  // Color Palette
  const primaryColor = '#0b2239'; // Deep Navy
  const secondaryColor = '#cda873'; // Premium Gold
  const accentColor = '#8c2633'; // Deep Crimson
  const textColor = '#2a2a2a';
  const mutedText = '#555555';
  const lightBg = '#fcfbfa';

  // Helper function to draw header/footer on pages
  const drawPageDecorations = () => {
    // Top border accent
    doc.rect(0, 0, 595.28, 15).fill(primaryColor);
    doc.rect(0, 15, 595.28, 4).fill(secondaryColor);

    // Bottom border accent
    doc.rect(0, 822, 595.28, 20).fill(primaryColor);
    
    // Bottom page footer text
    doc.fillColor('#ffffff')
       .fontSize(8)
       .text('SAUGAAT LUXURY GIFTING STUDIO  |  CONFIDENTIAL SPECIFICATION REPORT', 50, 828, { align: 'center', width: 495 });
  };

  // -------------------------------------------------------------
  // PAGE 1: TITLE & COVER PAGE
  // -------------------------------------------------------------
  drawPageDecorations();

  // Decorative Crest / Logo box
  doc.rect(247, 100, 100, 100).fill(primaryColor);
  doc.rect(252, 105, 90, 90).stroke(secondaryColor);
  doc.fillColor(secondaryColor)
     .fontSize(22)
     .font('Times-Roman')
     .text('S', 288, 132);

  doc.fillColor(primaryColor)
     .fontSize(26)
     .font('Helvetica-Bold')
     .text('S A U G A A T', 50, 240, { align: 'center', width: 495 });

  doc.fillColor(secondaryColor)
     .fontSize(14)
     .font('Helvetica-Oblique')
     .text('The Art of Thoughtful Gifting', 50, 275, { align: 'center', width: 495 });

  doc.rect(150, 310, 295, 2).fill(secondaryColor);

  doc.fillColor(textColor)
     .fontSize(16)
     .font('Helvetica-Bold')
     .text('UX IMPLEMENTATION PLAN & SPECIFICATION REPORT', 50, 350, { align: 'center', width: 495 });

  doc.fillColor(mutedText)
     .fontSize(10)
     .font('Helvetica')
     .text('A comprehensive breakdown of the newly implemented luxury interactive features, distinct User/Admin Dashboards, and brand customizers in the Saugaat E-commerce platform.', 80, 385, { align: 'center', width: 435, lineGap: 4 });

  // Metadata Card
  doc.rect(120, 480, 355, 140).fill(lightBg);
  doc.rect(120, 480, 355, 140).stroke('#eaeaea');
  doc.rect(120, 480, 4, 140).fill(secondaryColor);

  doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text('PROJECT METADATA & LOGIN INSTRUCTIONS', 140, 495);
  
  doc.fillColor(textColor).font('Helvetica-Bold').text('Client Test Login (Customer):', 140, 520);
  doc.font('Helvetica').text('Email: ', 140, 535).font('Helvetica-Bold').text('customer@saugaat.com  ', 180, 535).font('Helvetica').text('| Password: ', 310, 535).font('Helvetica-Bold').text('saugaat123', 380, 535);

  doc.fillColor(textColor).font('Helvetica-Bold').text('Client Test Login (Administrator):', 140, 560);
  doc.font('Helvetica').text('Email: ', 140, 575).font('Helvetica-Bold').text('admin@saugaat.com  ', 180, 575).font('Helvetica').text('| Password: ', 310, 575).font('Helvetica-Bold').text('saugaat123', 380, 575);

  doc.fillColor(mutedText).font('Helvetica-Oblique').fontSize(8.5).text('Note: These mock credentials bypass Supabase network checks for local testing efficiency.', 140, 600);

  doc.fillColor(mutedText)
     .fontSize(9.5)
     .font('Helvetica')
     .text('Target Environment: Vercel Production Build', 50, 720, { align: 'center', width: 495 });
  doc.text('Date of Compilation: June 01, 2026', 50, 735, { align: 'center', width: 495 });

  // -------------------------------------------------------------
  // PAGE 2: CUSTOMER DASHBOARD & INTERACTIVE CONCIERGE STUDIO
  // -------------------------------------------------------------
  doc.addPage();
  drawPageDecorations();

  doc.fillColor(primaryColor)
     .fontSize(18)
     .font('Helvetica-Bold')
     .text('1. CUSTOMER DASHBOARD & CONCIERGE STUDIO', 50, 50);

  doc.rect(50, 72, 495, 1).fill(secondaryColor);

  doc.fillColor(textColor)
     .fontSize(10)
     .font('Helvetica')
     .text('The Customer Dashboard has been redesigned to provide a visual, personalized user experience, featuring interactive tooling to custom craft and preview packages before purchasing.', 50, 85, { width: 495, lineGap: 3 });

  // Feature 1: Loyalty Casing
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('A. Loyalty Tier Integration & Experience Point Meter', 50, 140);
  doc.fillColor(textColor).fontSize(9.5).font('Helvetica').text('• Welcomes users with a customized Gold Tier Member badge and XP bar showing points needed for next tier.\n• Dynamic stats grid displaying total orders, wishlist counts, and redeemable gifting coupons.', 60, 155, { width: 475, lineGap: 3 });

  // Feature 2: Hamper Builder
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('B. Feature 1: Build-Your-Own-Hamper Studio', 50, 210);
  doc.fillColor(textColor).fontSize(9.5).font('Helvetica').text('• Fully interactive workshop allowing users to choose luxury box casings (Velvet Box, Gilded Casket, Linen Casing).\n• Live packaging visualizer displays product thumbnails floating inside the selected box as they are added.\n• Real-time budgeting card automatically calculates base casing price, individual items, and total hamper cost.\n• Dynamic validation limits hamper selections to 5 items to guarantee premium casing safety.', 60, 225, { width: 475, lineGap: 3 });

  // Feature 3: Calligraphy Greeting Card Customizer
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('C. Feature 2: Greeting Card Calligraphy Studio', 50, 315);
  doc.fillColor(textColor).fontSize(9.5).font('Helvetica').text('• A custom greeting card workspace with a live 3D-styled preview card (with golden border and wax seal).\n• Supports real-time text input rendering directly inside the greeting card in matching typography.\n• Choice of premium calligraphy scripts (Royal Gold Script, Vedic Serif, and Minimalist Sans).\n• Choice of luxury inks (Liquid Gold, Crimson Red, Royal Navy) with immediate card repaint.', 60, 330, { width: 475, lineGap: 3 });

  // Feature 4: Occasion Gift Registry & Pools
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('D. Feature 3: Occasion Gift Registry & Funding Pools', 50, 420);
  doc.fillColor(textColor).fontSize(9.5).font('Helvetica').text('• Enables users to schedule and publish gift pools for weddings, housewarmings, and festive occasions.\n• Tracks event targets and contributions with a premium gradient-filled funding progress bar.\n• Interactive "Create New Registry" drawer updates the active dashboard registry deck dynamically without page reload.', 60, 435, { width: 475, lineGap: 3 });

  // Order Timeline
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('E. Express Order Status Timeline Tracker', 50, 510);
  doc.fillColor(textColor).fontSize(9.5).font('Helvetica').text('• Frosted glassmorphic panel depicting order updates in a graphical timeline (Ordered -> Processing -> In Transit -> Delivered).\n• Employs a pulsing golden indicator on the active shipment step alongside auto-scrolling log descriptions.', 60, 525, { width: 475, lineGap: 3 });

  // -------------------------------------------------------------
  // PAGE 3: ADMIN DASHBOARD & GLOBAL AI CHATBOT CONCIERGE
  // -------------------------------------------------------------
  doc.addPage();
  drawPageDecorations();

  doc.fillColor(primaryColor)
     .fontSize(18)
     .font('Helvetica-Bold')
     .text('2. ADMIN CONSOLE & GLOBAL AI CHATBOT CONCIERGE', 50, 50);

  doc.rect(50, 72, 495, 1).fill(secondaryColor);

  // Admin console
  doc.fillColor(textColor)
     .fontSize(10)
     .font('Helvetica')
     .text('The Administration Portal offers granular overview dashboards, SVG charts, and interactive marketing controllers to manage active customer voucher campaigns.', 50, 85, { width: 495, lineGap: 3 });

  // Feature 5: Campaign Creator
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('A. Feature 4: Marketing Campaign & Discount Creator', 50, 140);
  doc.fillColor(textColor).fontSize(9.5).font('Helvetica').text('• An admin-exclusive tool for adding discount coupon vouchers and configuring active audience targets.\n• Real-time promo banner mockup generator outputs marketing banners dynamically as details are configured.\n• Supports theme colors (Navy, Ruby, Gold) rendering the voucher code, discount seals, and target tiers.', 60, 155, { width: 475, lineGap: 3 });

  // Admin Analytics
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('B. KPI Metrics & SVG Sales Charts', 50, 230);
  doc.fillColor(textColor).fontSize(9.5).font('Helvetica').text('• High-end analytical cards for Weekly Revenue, active listings, and reviews with custom inline sparklines.\n• Custom weekly revenue line graph drawn using responsive SVG curves and interactive tooltips on hover.\n• Inventory health section displaying real-time stock alert badges (Out of Stock, Low Stock) with restock action buttons.', 60, 245, { width: 475, lineGap: 3 });

  // Global Chatbot
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('C. Feature 5: Global Gifting Curator AI Chatbot Widget (Aditi)', 50, 320);
  doc.fillColor(textColor).fontSize(9.5).font('Helvetica').text('• A global, floating assistant widget featuring glassmorphism layout and custom entrance animations.\n• Preset click-queries simulating typical customer inquiries:\n  - "Track Order #SG-89302" outputs an in-chat delivery tracking card with detailed local shipping logs.\n  - "How to build custom hamper" advises on dashboard builder usage and links directly to the tool.\n  - "Check active promotions" lists codes created in the Admin Dashboard (e.g. FESTIVE20).\n  - "Speak with Gifting Curator" displays an interactive contact lead form directly inside the chat.\n• Custom text submission replies with a luxury concierge responder to handle unmapped inquiries.', 60, 335, { width: 475, lineGap: 3 });

  // Technical Summary
  doc.rect(50, 460, 495, 140).fill(lightBg);
  doc.rect(50, 460, 495, 140).stroke('#eaeaea');
  doc.rect(50, 460, 4, 140).fill(primaryColor);

  doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('VERIFICATION & DEPLOYMENT INSTRUCTIONS', 70, 475);
  doc.fillColor(textColor).fontSize(9.5).font('Helvetica')
     .text('1. Run the local development server:', 70, 500)
     .font('Courier').text('npm run dev', 280, 500)
     .font('Helvetica').text('2. Compile the production package:', 70, 520)
     .font('Courier').text('npm run build', 280, 520)
     .font('Helvetica').text('3. Vercel deployment pipeline:', 70, 540)
     .text('All changes pushed to ', 70, 560).font('Helvetica-Bold').text('main').font('Helvetica').text(' branch will be automatically built and deployed via the GitHub integration.')
     .text('Vercel URL: https://saugaat.vercel.app', 70, 580);

  // Success Seal / Signature
  doc.fillColor(secondaryColor)
     .fontSize(10)
     .font('Helvetica-Bold')
     .text('SAUGAAT LUXURY GIFTING PLATFORM', 50, 700, { align: 'center', width: 495 });
  doc.fillColor(textColor)
     .fontSize(8.5)
     .font('Helvetica')
     .text('Designed, Coded, and Verified by Antigravity Agentic AI', 50, 715, { align: 'center', width: 495 });

  doc.end();
  console.log('PDF Report generated successfully as implementation_plan.pdf');
}

generatePDF();
