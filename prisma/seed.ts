/**
 * Belle Food — Prisma Seed Script
 * Run: npx prisma db seed
 *
 * This seeds development fixture data.
 * Replace with real menu data before launch.
 */

import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Belle Food database...");

  // ── Admin user ──────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("BelleFood@Admin2024!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bellefood.ng" },
    update: {},
    create: {
      email: "admin@bellefood.ng",
      name: "Belle Food Admin",
      role: UserRole.ADMIN,
      passwordHash: adminPassword,
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);
  console.log(`   Password: BelleFood@Admin2024!  ← CHANGE BEFORE LAUNCH`);

  // ── Restaurant settings ─────────────────────────────────────────────────
  await prisma.restaurantSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      restaurantName: "Belle Food",
      // TODO: Replace with real restaurant details before launch
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      openingHours: JSON.stringify([
        { day: "Monday",    openTime: "10:00", closeTime: "22:00", closed: false },
        { day: "Tuesday",   openTime: "10:00", closeTime: "22:00", closed: false },
        { day: "Wednesday", openTime: "10:00", closeTime: "22:00", closed: false },
        { day: "Thursday",  openTime: "10:00", closeTime: "22:00", closed: false },
        { day: "Friday",    openTime: "10:00", closeTime: "23:00", closed: false },
        { day: "Saturday",  openTime: "10:00", closeTime: "23:00", closed: false },
        { day: "Sunday",    openTime: "11:00", closeTime: "21:00", closed: false },
      ]),
      deliveryEnabled: true,
      pickupEnabled: true,
      minimumOrderKobo: 300000, // ₦3,000
      acceptingOrders: true,
      estPrepMinutes: 30,
      estDeliveryMinutes: 45,
    },
  });
  console.log("✅ Restaurant settings seeded");

  // ── Delivery areas ──────────────────────────────────────────────────────
  const deliveryAreas = [
    { name: "Not yet configured", feeKobo: 0, isActive: false, sortOrder: 0 },
  ];
  for (const area of deliveryAreas) {
    await prisma.deliveryArea.upsert({
      where: { name: area.name },
      update: {},
      create: area,
    });
  }
  console.log("✅ Delivery areas seeded (placeholder — configure real areas)");

  // ── Menu categories ─────────────────────────────────────────────────────
  const categories = [
    {
      name: "Rice Dishes",
      slug: "rice-dishes",
      description: "Jollof, fried rice, native rice and more",
      sortOrder: 1,
    },
    {
      name: "Soups & Stews",
      slug: "soups-stews",
      description: "Egusi, ogbono, pepper soup and more",
      sortOrder: 2,
    },
    {
      name: "Swallows",
      slug: "swallows",
      description: "Eba, pounded yam, amala, semo and fufu",
      sortOrder: 3,
    },
    {
      name: "Proteins",
      slug: "proteins",
      description: "Chicken, beef, fish, goatmeat and more",
      sortOrder: 4,
    },
    {
      name: "Grills & BBQ",
      slug: "grills-bbq",
      description: "Suya, peppered chicken, grilled fish",
      sortOrder: 5,
    },
    {
      name: "Small Chops",
      slug: "small-chops",
      description: "Puff puff, spring rolls, samosa and more",
      sortOrder: 6,
    },
    {
      name: "Drinks",
      slug: "drinks",
      description: "Zobo, kunu, soft drinks, water",
      sortOrder: 7,
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`✅ ${categories.length} menu categories seeded`);

  // ── Menu items (development fixtures — replace with real menu & prices) ──
  // IMPORTANT: These are PLACEHOLDER items only.
  // The restaurant owner must confirm names, descriptions, and prices before launch.
  // Prices are in kobo (1 Naira = 100 kobo)
  const menuItems = [
    // Rice Dishes
    {
      name: "Party Jollof Rice",
      slug: "party-jollof-rice",
      description: "Smoky, flavourful Nigerian party jollof rice cooked over firewood with choice of protein.",
      priceKobo: 250000,
      categoryId: categoryMap["rice-dishes"],
      isFeatured: true,
      sortOrder: 1,
      imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=600&q=80",
    },
    {
      name: "Native Jollof Rice",
      slug: "native-jollof-rice",
      description: "Traditional ofada-style rice cooked with palm oil, assorted meats and spices.",
      priceKobo: 270000,
      categoryId: categoryMap["rice-dishes"],
      sortOrder: 2,
      imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80",
    },
    {
      name: "Fried Rice",
      slug: "fried-rice",
      description: "Seasoned long-grain rice stir-fried with mixed vegetables and your choice of protein.",
      priceKobo: 230000,
      categoryId: categoryMap["rice-dishes"],
      sortOrder: 3,
      imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
    },
    // Soups & Stews
    {
      name: "Egusi Soup",
      slug: "egusi-soup",
      description: "Rich melon-seed soup cooked with assorted meats, stockfish and leafy greens.",
      priceKobo: 350000,
      categoryId: categoryMap["soups-stews"],
      isFeatured: true,
      sortOrder: 1,
      imageUrl: "https://images.unsplash.com/photo-1567982847191-a8c83f49e0cc?w=600&q=80",
    },
    {
      name: "Ogbono Soup",
      slug: "ogbono-soup",
      description: "Thick, draw soup made with ground ogbono seeds, vegetables and assorted meat.",
      priceKobo: 350000,
      categoryId: categoryMap["soups-stews"],
      sortOrder: 2,
      imageUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&q=80",
    },
    {
      name: "Pepper Soup",
      slug: "pepper-soup",
      description: "Spicy, aromatic broth with goatmeat or catfish — a Belle Food classic.",
      priceKobo: 280000,
      categoryId: categoryMap["soups-stews"],
      sortOrder: 3,
      imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    },
    // Swallows
    {
      name: "Pounded Yam",
      slug: "pounded-yam",
      description: "Smooth, stretchy pounded yam — best enjoyed with any of our soups.",
      priceKobo: 120000,
      categoryId: categoryMap["swallows"],
      sortOrder: 1,
      imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
    },
    {
      name: "Amala",
      slug: "amala",
      description: "Dark, silky yam flour swallow — perfect with ewedu and gbegiri.",
      priceKobo: 100000,
      categoryId: categoryMap["swallows"],
      sortOrder: 2,
      imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
    },
    // Proteins
    {
      name: "Peppered Chicken",
      slug: "peppered-chicken",
      description: "Tender grilled chicken pieces fried in our signature pepper sauce.",
      priceKobo: 250000,
      categoryId: categoryMap["proteins"],
      isFeatured: true,
      sortOrder: 1,
      imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
    },
    {
      name: "Assorted Meat",
      slug: "assorted-meat",
      description: "A generous portion of beef, shaki, kpomo and ponmo.",
      priceKobo: 200000,
      categoryId: categoryMap["proteins"],
      sortOrder: 2,
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    },
    // Grills & BBQ
    {
      name: "Suya",
      slug: "suya",
      description: "Skewered grilled beef coated in yaji spice blend, served with sliced onions.",
      priceKobo: 200000,
      categoryId: categoryMap["grills-bbq"],
      isFeatured: true,
      sortOrder: 1,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    },
    {
      name: "Grilled Fish",
      slug: "grilled-fish",
      description: "Whole tilapia or catfish marinated and grilled to perfection.",
      priceKobo: 350000,
      categoryId: categoryMap["grills-bbq"],
      sortOrder: 2,
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
    },
    // Small Chops
    {
      name: "Puff Puff",
      slug: "puff-puff",
      description: "Golden, airy Nigerian doughnuts — light, sweet and irresistible.",
      priceKobo: 100000,
      categoryId: categoryMap["small-chops"],
      sortOrder: 1,
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    },
    {
      name: "Small Chops Platter",
      slug: "small-chops-platter",
      description: "A party platter of spring rolls, samosa, puff puff and chicken wings.",
      priceKobo: 350000,
      categoryId: categoryMap["small-chops"],
      isFeatured: true,
      sortOrder: 2,
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    },
    // Drinks
    {
      name: "Zobo Drink",
      slug: "zobo-drink",
      description: "Chilled hibiscus drink infused with ginger and cloves.",
      priceKobo: 80000,
      categoryId: categoryMap["drinks"],
      sortOrder: 1,
      imageUrl: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&q=80",
    },
    {
      name: "Kunu",
      slug: "kunu",
      description: "Refreshing millet-based drink, lightly spiced with ginger.",
      priceKobo: 80000,
      categoryId: categoryMap["drinks"],
      sortOrder: 2,
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    },
    {
      name: "Soft Drinks",
      slug: "soft-drinks",
      description: "Coca-Cola, Fanta, Sprite, Malta — chilled to order.",
      priceKobo: 50000,
      categoryId: categoryMap["drinks"],
      sortOrder: 3,
      imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=80",
    },
  ];

  let itemCount = 0;
  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
    itemCount++;
  }
  console.log(`✅ ${itemCount} menu items seeded`);

  console.log("\n🎉 Seed complete!");
  console.log("\n⚠️  IMPORTANT: Before launch, update the following:");
  console.log("   1. Change admin password (admin@bellefood.ng)");
  console.log("   2. Configure restaurant settings in the admin dashboard");
  console.log("   3. Replace placeholder menu items with real menu and prices");
  console.log("   4. Configure delivery areas and fees");
  console.log("   5. Set PAYSTACK_SECRET_KEY in .env.local");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
