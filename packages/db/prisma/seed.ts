import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create test admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@beam.test" },
    update: {},
    create: {
      email: "admin@beam.test",
      fullName: "Test Admin",
    },
  });

  // Create test musician user
  const musician = await prisma.user.upsert({
    where: { email: "musician@test.com" },
    update: {},
    create: {
      email: "musician@test.com",
      fullName: "Test Musician",
    },
  });

  // Create wallets for users
  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      balance: 0,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: musician.id },
    update: {},
    create: {
      userId: musician.id,
      balance: 0,
    },
  });

  console.log("✅ Created test users:");
  console.log(`   Admin: ${admin.email} (${admin.id})`);
  console.log(`   Musician: ${musician.email} (${musician.id})`);
  console.log("\n💡 To use these users in testing:");
  console.log(`   Replace 'temp-user-id' with: ${musician.id}`);
  console.log(`   Or set up Firebase Auth to match these emails`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

