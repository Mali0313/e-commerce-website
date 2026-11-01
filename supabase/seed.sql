-- BazaarHub Seed Data

-- 1. STORE SETTINGS
INSERT INTO public.settings (store_name, tagline, support_email, support_phone, whatsapp_number, standard_shipping_rate, free_shipping_threshold, announcement_bar)
VALUES (
    'BazaarHub',
    'Your Everyday Bazaar, Online',
    'support@bazaarhub.pk',
    '+92 300 1234567',
    '923001234567',
    250.00,
    5000.00,
    '🎉 Free delivery across Pakistan on all orders over Rs. 5,000! Standard shipping Rs. 250.'
) ON CONFLICT DO NOTHING;

-- 2. PAYMENT SETTINGS
INSERT INTO public.payment_settings (method_key, method_title, account_title, account_number, bank_name, instructions, is_active, display_order)
VALUES 
(
    'bank_transfer',
    'Bank Account Transfer',
    'BazaarHub Online Store',
    'PK36MEZN0001000102938475',
    'Meezan Bank (Islamic Banking)',
    'Transfer via your bank app (Meezan, HBL, UBL, Alfalah, etc.) to the IBAN above. After completing transfer, enter your Transaction ID (TID) and upload the receipt screenshot.',
    true,
    1
),
(
    'easypaisa',
    'Easypaisa Mobile Wallet',
    'BazaarHub Official',
    '0300-1234567',
    'Telenor Microfinance Bank',
    'Send payment via Easypaisa App or *786# to mobile number 0300-1234567. Copy the 11-digit Trx ID from your SMS/app receipt and upload the screenshot.',
    true,
    2
),
(
    'jazzcash',
    'JazzCash Mobile Wallet',
    'BazaarHub Official',
    '0301-9876543',
    'Mobilink Microfinance Bank',
    'Send payment via JazzCash App or *786# to mobile number 0301-9876543. Copy the TID from your confirmation SMS and upload the transaction screenshot.',
    true,
    3
) ON CONFLICT (method_key) DO UPDATE 
SET account_title = EXCLUDED.account_title,
    account_number = EXCLUDED.account_number,
    bank_name = EXCLUDED.bank_name;

-- 3. COUPONS
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_amount, max_discount, is_active)
VALUES 
('WELCOME10', 'percentage', 10.00, 1500.00, 500.00, true),
('BAZAAR500', 'fixed', 500.00, 4000.00, 500.00, true),
('FREESHIP', 'fixed', 250.00, 2000.00, 250.00, true)
ON CONFLICT (code) DO NOTHING;

-- 4. CATEGORIES
-- Fashion (Parent)
INSERT INTO public.categories (id, name, slug, description, image_url, parent_id, is_featured, display_order)
VALUES 
('c0000000-0000-0000-0000-000000000001', 'Fashion', 'fashion', 'Trendy eastern and western apparel for Pakistani families', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80', NULL, true, 1),
('c0000000-0000-0000-0000-000000000002', 'Men Fashion', 'men-fashion', 'Kurtas, shirts, trousers, and accessories for men', 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80', 'c0000000-0000-0000-0000-000000000001', false, 2),
('c0000000-0000-0000-0000-000000000003', 'Women Fashion', 'women-fashion', 'Stitched lawn, pret, kurtis, shawls, and modest wear', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80', 'c0000000-0000-0000-0000-000000000001', false, 3),
('c0000000-0000-0000-0000-000000000004', 'Kids Clothing', 'kids-clothing', 'Comfortable cotton suits and outfits for boys and girls', 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&auto=format&fit=crop&q=80', 'c0000000-0000-0000-0000-000000000001', false, 4),

-- Home & Kitchen
('c0000000-0000-0000-0000-000000000005', 'Home & Kitchen', 'home-kitchen', 'Cookware, dining sets, organizers, and home comfort essentials', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80', NULL, true, 5),

-- Mobile Accessories
('c0000000-0000-0000-0000-000000000006', 'Mobile Accessories', 'mobile-accessories', 'Fast chargers, power banks, earbuds, and premium cases', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80', NULL, true, 6),
('c0000000-0000-0000-0000-000000000007', 'Earbuds & Audio', 'earbuds-audio', 'Wireless Bluetooth earbuds, neckbands, and speakers', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', 'c0000000-0000-0000-0000-000000000006', false, 7),
('c0000000-0000-0000-0000-000000000008', 'Chargers & Power Banks', 'chargers-powerbanks', 'Fast USB-C adapters, PD power banks, braided cables', 'https://images.unsplash.com/photo-1609592424361-b54131551ee7?w=600&auto=format&fit=crop&q=80', 'c0000000-0000-0000-0000-000000000006', false, 8),

-- Beauty & Personal Care
('c0000000-0000-0000-0000-000000000009', 'Beauty & Personal Care', 'beauty-personal-care', 'Skincare serums, organic hair oils, perfumes, and grooming kits', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80', NULL, true, 9)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    image_url = EXCLUDED.image_url;

-- 5. SAMPLE PRODUCTS (20 REALISTIC PAKISTANI PRODUCTS)
INSERT INTO public.products (id, title, slug, description, price, compare_at_price, cost_price, sku, category_id, stock_quantity, is_active, is_featured, rating, reviews_count)
VALUES
-- 1. Fashion - Men Kurta
(
    'p0000000-0000-0000-0000-000000000001',
    'Premium Egyptian Cotton Men Kurta',
    'premium-egyptian-cotton-men-kurta',
    'Crafted from 100% pure breathable Egyptian cotton, this classic Pakistani kurta features subtle ban-collar embroidery and mother-of-pearl buttons. Ideal for Friday prayers, festive Eid occasions, and casual gatherings.',
    2499.00,
    3499.00,
    1400.00,
    'MK-EGY-01',
    'c0000000-0000-0000-0000-000000000002',
    45,
    true,
    true,
    4.9,
    18
),
-- 2. Fashion - Women 2-Piece Lawn Suit
(
    'p0000000-0000-0000-0000-000000000002',
    'Floral Stitched 2-Piece Digital Lawn Suit',
    'floral-stitched-2-piece-digital-lawn-suit',
    'Stitched digital printed premium lawn shirt paired with tailored cigarette pants. Vibrant summer color palette tailored for Pakistani weather, pre-shrunk fabric to prevent color fading.',
    3250.00,
    4500.00,
    1950.00,
    'WL-DIG-02',
    'c0000000-0000-0000-0000-000000000003',
    38,
    true,
    true,
    4.8,
    24
),
-- 3. Fashion - Men Polo
(
    'p0000000-0000-0000-0000-000000000003',
    'Classic Pique Cotton Polo Shirt',
    'classic-pique-cotton-polo-shirt',
    'Heavyweight 220 GSM breathable pique cotton polo shirt. Ribbed collar and cuffs with double needle stitching, perfect for everyday office wear or weekend outings.',
    1699.00,
    2200.00,
    900.00,
    'MP-PIQ-03',
    'c0000000-0000-0000-0000-000000000002',
    60,
    true,
    false,
    4.7,
    12
),
-- 4. Fashion - Women Silk Shawl
(
    'p0000000-0000-0000-0000-000000000004',
    'Artisanal Kashmiri Embroidery Jacquard Shawl',
    'artisanal-kashmiri-embroidery-jacquard-shawl',
    'Luxurious soft touch jacquard winter wrap featuring intricate Kashmiri tilla border work. Adds elegance to any formal or festive ensemble.',
    3890.00,
    5500.00,
    2200.00,
    'WS-KSH-04',
    'c0000000-0000-0000-0000-000000000003',
    25,
    true,
    true,
    4.9,
    15
),
-- 5. Fashion - Kids Shalwar Kameez
(
    'p0000000-0000-0000-0000-000000000005',
    'Boys Festive Wash & Wear Shalwar Kameez',
    'boys-festive-wash-and-wear-shalwar-kameez',
    'Wrinkle-resistant soft blended fabric for active kids. Features neat cuff tailoring, lightweight finish, and comfortable waistband.',
    1850.00,
    2400.00,
    950.00,
    'KC-BY-05',
    'c0000000-0000-0000-0000-000000000004',
    40,
    true,
    false,
    4.6,
    9
),
-- 6. Mobile - Wireless Earbuds
(
    'p0000000-0000-0000-0000-000000000006',
    'AirWave Pro Wireless ANC Earbuds',
    'airwave-pro-wireless-anc-earbuds',
    'Featuring Active Noise Cancellation, 36-hour total battery life with Type-C fast charging case, deep bass boost, and quad mic ENC for crystal clear phone calls.',
    3999.00,
    5999.00,
    2400.00,
    'MA-AWP-06',
    'c0000000-0000-0000-0000-000000000007',
    52,
    true,
    true,
    4.8,
    35
),
-- 7. Mobile - 20,000mAh Power Bank
(
    'p0000000-0000-0000-0000-000000000007',
    'VoltBoost 20000mAh 22.5W Fast Power Bank',
    'voltboost-20000mah-22-5w-fast-power-bank',
    'High capacity portable battery pack equipped with dual USB-A and USB-C Power Delivery. Charges an iPhone 15 or Samsung Galaxy up to 50% in just 30 minutes.',
    3450.00,
    4800.00,
    2100.00,
    'MA-VLT-07',
    'c0000000-0000-0000-0000-000000000008',
    35,
    true,
    true,
    4.9,
    42
),
-- 8. Mobile - 65W GaN Fast Charger
(
    'p0000000-0000-0000-0000-000000000008',
    'TurboCharge 65W GaN Dual Port Charger',
    'turbocharge-65w-gan-dual-port-charger',
    'Ultra-compact Gallium Nitride (GaN) wall adapter capable of charging laptops, tablets, and smartphones simultaneously with temperature guard safety.',
    2850.00,
    3800.00,
    1600.00,
    'MA-GAN-08',
    'c0000000-0000-0000-0000-000000000008',
    28,
    true,
    false,
    4.7,
    19
),
-- 9. Mobile - Shockproof Clear Armor Case
(
    'p0000000-0000-0000-0000-000000000009',
    'MagShield Military Grade Shockproof Case',
    'magshield-military-grade-shockproof-case',
    'Anti-yellowing acrylic backplate with shock-absorbing TPU bumpers, built-in strong magnetic ring for magnetic accessories and car mounts.',
    999.00,
    1500.00,
    450.00,
    'MA-MAG-09',
    'c0000000-0000-0000-0000-000000000006',
    80,
    true,
    false,
    4.6,
    14
),
-- 10. Home - Granite Non-Stick Cookware Set
(
    'p0000000-0000-0000-0000-000000000010',
    'Royal 4-Piece Granite Non-Stick Pan & Kadai Set',
    'royal-4-piece-granite-non-stick-pan-set',
    '5-layer German granite non-stick coating suitable for gas and induction stoves. Includes frying pan, karahi with tempered glass lid, and tawa.',
    5990.00,
    8500.00,
    3800.00,
    'HK-GRN-10',
    'c0000000-0000-0000-0000-000000000005',
    18,
    true,
    true,
    4.9,
    27
),
-- 11. Home - Electric Kettle
(
    'p0000000-0000-0000-0000-000000000011',
    'QuickBoil 1.8L Stainless Steel Electric Kettle',
    'quickboil-1-8l-stainless-steel-electric-kettle',
    'Food-grade 304 stainless steel interior with auto shut-off and boil-dry safety protection. Boils water in under 4 minutes for morning chai.',
    2150.00,
    2999.00,
    1300.00,
    'HK-KET-11',
    'c0000000-0000-0000-0000-000000000005',
    32,
    true,
    false,
    4.8,
    31
),
-- 12. Home - Airtight Spice Jars Set
(
    'p0000000-0000-0000-0000-000000000012',
    'Rotating Bamboo 12-Piece Glass Spice Organizer',
    'rotating-bamboo-12-piece-glass-spice-organizer',
    'Keep your Pakistani masalas fresh and organized. Comes with 12 borosilicate jars, moisture-proof lids, and pre-printed Urdu/English spice labels.',
    2750.00,
    3600.00,
    1600.00,
    'HK-SPC-12',
    'c0000000-0000-0000-0000-000000000005',
    22,
    true,
    false,
    4.7,
    16
),
-- 13. Home - Orthopedic Memory Foam Pillow
(
    'p0000000-0000-0000-0000-000000000013',
    'Ergonomic Contour Memory Foam Pillow',
    'ergonomic-contour-memory-foam-pillow',
    'Designed for therapeutic cervical spine alignment and neck relief. Comes with a removable, washable cooling bamboo cover.',
    2299.00,
    3200.00,
    1300.00,
    'HK-PLW-13',
    'c0000000-0000-0000-0000-000000000005',
    29,
    true,
    false,
    4.8,
    20
),
-- 14. Beauty - Vitamin C Brightening Serum
(
    'p0000000-0000-0000-0000-000000000014',
    'GlowRadiance 10% Vitamin C + Ferulic Acid Serum',
    'glowradiance-10-vitamin-c-ferulic-acid-serum',
    'Formulated specifically to combat hyperpigmentation, sun spots, and dull skin under intense sun exposure. Dermatologist tested, paraben-free.',
    1450.00,
    1950.00,
    750.00,
    'BP-VTC-14',
    'c0000000-0000-0000-0000-000000000009',
    65,
    true,
    true,
    4.9,
    48
),
-- 15. Beauty - Organic Cold Pressed Hair Oil
(
    'p0000000-0000-0000-0000-000000000015',
    'KeshVeda 7-Herb Herbal Hair Growth Oil 200ml',
    'keshveda-7-herb-herbal-hair-growth-oil',
    'Infused with Amla, Shikakai, Bhringraj, Methi, and cold-pressed Castor oil. Nourishes roots, prevents premature graying, and reduces hair fall.',
    1199.00,
    1650.00,
    550.00,
    'BP-OIL-15',
    'c0000000-0000-0000-0000-000000000009',
    50,
    true,
    true,
    4.8,
    33
),
-- 16. Beauty - Matte Velvet Lipstick
(
    'p0000000-0000-0000-0000-000000000016',
    'Velvet Touch Long-Wear Matte Lipstick',
    'velvet-touch-long-wear-matte-lipstick',
    '12-hour transfer-proof lightweight formula enriched with Vitamin E and shea butter. Flattering nude and berry shades tailored for South Asian skin tones.',
    899.00,
    1250.00,
    400.00,
    'BP-LIP-16',
    'c0000000-0000-0000-0000-000000000009',
    75,
    true,
    false,
    4.7,
    22
),
-- 17. Fashion - Men Leather Wallet
(
    'p0000000-0000-0000-0000-000000000017',
    'Handcrafted Full Grain Leather Bi-Fold Wallet',
    'handcrafted-full-grain-leather-bi-fold-wallet',
    'Crafted from genuine cowhide leather with RFID blocking protection, 8 card slots, dual currency compartments, and a flip ID window.',
    1590.00,
    2299.00,
    800.00,
    'MK-WLT-17',
    'c0000000-0000-0000-0000-000000000002',
    42,
    true,
    false,
    4.8,
    17
),
-- 18. Mobile - Braided 100W 3-in-1 Charging Cable
(
    'p0000000-0000-0000-0000-000000000018',
    'Heavy-Duty 3-in-1 Braided Fast Cable 1.5M',
    'heavy-duty-3-in-1-braided-fast-cable',
    'Single high-strength nylon cable featuring Type-C, Lightning, and Micro-USB connectors with an aluminum alloy shell and zinc bend relief.',
    699.00,
    1100.00,
    300.00,
    'MA-CBL-18',
    'c0000000-0000-0000-0000-000000000008',
    110,
    true,
    false,
    4.6,
    25
),
-- 19. Home - LED Rechargeable Emergency Desk Lamp
(
    'p0000000-0000-0000-0000-000000000019',
    'BrightLite Touch Dimmable Rechargeable Study Lamp',
    'brightlite-touch-dimmable-rechargeable-study-lamp',
    'Built-in 3000mAh battery provides up to 8 hours of backup during loadshedding. 3 color temperatures with smooth touch dimming and flexible gooseneck.',
    1750.00,
    2400.00,
    900.00,
    'HK-LMP-19',
    'c0000000-0000-0000-0000-000000000005',
    36,
    true,
    false,
    4.7,
    14
),
-- 20. Beauty - Charcoal Cleansing Face Wash
(
    'p0000000-0000-0000-0000-000000000020',
    'Deep Clean Activated Charcoal Oil-Control Face Wash',
    'deep-clean-activated-charcoal-face-wash',
    'Formulated to eliminate pollution, excess sebum, and blackheads. Features salicylic acid and tea tree oil for acne-prone skin in city environments.',
    799.00,
    1099.00,
    350.00,
    'BP-WSH-20',
    'c0000000-0000-0000-0000-000000000009',
    55,
    true,
    false,
    4.8,
    29
)
ON CONFLICT (slug) DO UPDATE
SET price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 6. PRODUCT VARIANTS (SIZES / COLORS)
INSERT INTO public.product_variants (product_id, title, sku, price, compare_at_price, stock_quantity, size, color)
VALUES
-- Men Kurta
('p0000000-0000-0000-0000-000000000001', 'Small / Off-White', 'MK-EGY-S-WHT', 2499.00, 3499.00, 10, 'Small', 'Off-White'),
('p0000000-0000-0000-0000-000000000001', 'Medium / Off-White', 'MK-EGY-M-WHT', 2499.00, 3499.00, 15, 'Medium', 'Off-White'),
('p0000000-0000-0000-0000-000000000001', 'Large / Off-White', 'MK-EGY-L-WHT', 2499.00, 3499.00, 12, 'Large', 'Off-White'),
('p0000000-0000-0000-0000-000000000001', 'Medium / Navy Blue', 'MK-EGY-M-NVY', 2499.00, 3499.00, 8, 'Medium', 'Navy Blue'),

-- Women 2-Piece Lawn
('p0000000-0000-0000-0000-000000000002', 'Small / Emerald Green', 'WL-DIG-S-GRN', 3250.00, 4500.00, 12, 'Small', 'Emerald Green'),
('p0000000-0000-0000-0000-000000000002', 'Medium / Emerald Green', 'WL-DIG-M-GRN', 3250.00, 4500.00, 16, 'Medium', 'Emerald Green'),
('p0000000-0000-0000-0000-000000000002', 'Large / Emerald Green', 'WL-DIG-L-GRN', 3250.00, 4500.00, 10, 'Large', 'Emerald Green'),

-- Men Polo
('p0000000-0000-0000-0000-000000000003', 'Medium / Forest Green', 'MP-PIQ-M-GRN', 1699.00, 2200.00, 20, 'Medium', 'Forest Green'),
('p0000000-0000-0000-0000-000000000003', 'Large / Forest Green', 'MP-PIQ-L-GRN', 1699.00, 2200.00, 20, 'Large', 'Forest Green'),
('p0000000-0000-0000-0000-000000000003', 'Medium / Charcoal Black', 'MP-PIQ-M-BLK', 1699.00, 2200.00, 20, 'Medium', 'Charcoal Black'),

-- Earbuds
('p0000000-0000-0000-0000-000000000006', 'Glossy White', 'MA-AWP-WHT', 3999.00, 5999.00, 30, NULL, 'Glossy White'),
('p0000000-0000-0000-0000-000000000006', 'Midnight Matte Black', 'MA-AWP-BLK', 3999.00, 5999.00, 22, NULL, 'Matte Black'),

-- Power Bank
('p0000000-0000-0000-0000-000000000007', 'Titanium Black', 'MA-VLT-BLK', 3450.00, 4800.00, 20, NULL, 'Titanium Black'),
('p0000000-0000-0000-0000-000000000007', 'Glacier White', 'MA-VLT-WHT', 3450.00, 4800.00, 15, NULL, 'Glacier White')
ON CONFLICT DO NOTHING;

-- 7. PRODUCT IMAGES
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
VALUES
('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80', 'Men Egyptian Cotton Kurta Front', 1, true),
('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', 'Men Kurta Fabric Detail', 2, false),

('p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80', 'Digital Lawn 2-Piece Suit', 1, true),
('p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', 'Lawn Print Close Up', 2, false),

('p0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop&q=80', 'Classic Pique Polo Shirt', 1, true),

('p0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80', 'Kashmiri Jacquard Shawl', 1, true),

('p0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80', 'Boys Shalwar Kameez', 1, true),

('p0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', 'AirWave Pro Wireless Earbuds', 1, true),
('p0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80', 'Earbuds Charging Case', 2, false),

('p0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1609592424361-b54131551ee7?w=800&auto=format&fit=crop&q=80', 'VoltBoost 20000mAh Power Bank', 1, true),

('p0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80', '65W GaN Dual Port Charger', 1, true),

('p0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80', 'Shockproof Armor Case', 1, true),

('p0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1584990347449-399a9a3ba0b6?w=800&auto=format&fit=crop&q=80', 'Granite Non-Stick Cookware Set', 1, true),

('p0000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop&q=80', 'Electric Kettle Stainless Steel', 1, true),

('p0000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80', 'Rotating Spice Jars Organizer', 1, true),

('p0000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', 'Memory Foam Contour Pillow', 1, true),

('p0000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80', 'Vitamin C Brightening Serum', 1, true),

('p0000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1608248597359-509e5e783778?w=800&auto=format&fit=crop&q=80', 'Herbal Hair Growth Oil', 1, true),

('p0000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80', 'Velvet Matte Lipstick', 1, true),

('p0000000-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', 'Handcrafted Leather Wallet', 1, true),

('p0000000-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=800&auto=format&fit=crop&q=80', 'Braided 3-in-1 Fast Cable', 1, true),

('p0000000-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', 'LED Rechargeable Study Lamp', 1, true),

('p0000000-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', 'Charcoal Deep Cleansing Face Wash', 1, true)
ON CONFLICT DO NOTHING;
