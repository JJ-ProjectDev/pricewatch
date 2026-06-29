import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('Password123!');

  await prisma.user.upsert({
    where: { email: 'testuser@pricewatch.dev' },
    update: {},
    create: {
      email: 'testuser@pricewatch.dev',
      displayName: 'Test User',
      passwordHash,
    },
  });

  console.log('✅ Test user seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  