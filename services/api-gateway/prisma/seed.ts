import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const products = [
  // Phones
  {
    name: 'Apple iPhone 15 Pro 128GB',
    description: 'Compact flagship phone with A17 Pro performance, titanium build, and a 48MP main camera.',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
    searchTerm: 'Apple iPhone 15 Pro 128GB',
  },
  {
    name: 'Samsung Galaxy S24 Ultra 256GB',
    description: 'Large-screen Android flagship with Galaxy AI features, S Pen support, and a versatile zoom camera.',
    imageUrl: 'https://images.unsplash.com/photo-1707742239387-4f39a34b76bd',
    searchTerm: 'Samsung Galaxy S24 Ultra 256GB',
  },
  {
    name: 'Google Pixel 8 Pro 128GB',
    description: 'Google Tensor-powered phone with advanced computational photography and a bright OLED display.',
    imageUrl: 'https://images.unsplash.com/photo-1696430019089-cc8f4f1b442d',
    searchTerm: 'Google Pixel 8 Pro 128GB',
  },
  {
    name: 'OnePlus 12 256GB',
    description: 'Fast-charging Android phone with Snapdragon performance, a high-refresh display, and Hasselblad cameras.',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
    searchTerm: 'OnePlus 12 256GB',
  },
  // Laptops
  {
    name: 'Apple MacBook Air 13-inch M3',
    description: 'Lightweight laptop with Apple M3 silicon, all-day battery life, and a high-resolution Liquid Retina display.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    searchTerm: 'Apple MacBook Air 13 M3',
  },
  {
    name: 'Dell XPS 13 Plus',
    description: 'Premium Windows ultrabook with a slim aluminium chassis, edge-to-edge keyboard, and OLED display option.',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
    searchTerm: 'Dell XPS 13 Plus',
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    description: 'Business ultrabook with durable construction, strong keyboard ergonomics, and enterprise-ready security.',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    searchTerm: 'Lenovo ThinkPad X1 Carbon Gen 12',
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'Portable gaming laptop with AMD Ryzen performance, dedicated NVIDIA graphics, and a high-refresh display.',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
    searchTerm: 'ASUS ROG Zephyrus G14',
  },
  // GPUs
  {
    name: 'NVIDIA GeForce RTX 4090',
    description: 'High-end desktop graphics card for 4K gaming, GPU rendering, and AI-accelerated creative workloads.',
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704',
    searchTerm: 'NVIDIA GeForce RTX 4090',
  },
  {
    name: 'NVIDIA GeForce RTX 4070 Super',
    description: 'Efficient upper-midrange GPU designed for high-refresh 1440p gaming and ray tracing workloads.',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7',
    searchTerm: 'NVIDIA GeForce RTX 4070 Super',
  },
  {
    name: 'AMD Radeon RX 7900 XTX',
    description: 'Flagship Radeon graphics card with strong raster performance, large VRAM capacity, and DisplayPort 2.1.',
    imageUrl: 'https://images.unsplash.com/photo-1591405351990-4726e331f141',
    searchTerm: 'AMD Radeon RX 7900 XTX',
  },
  {
    name: 'Intel Arc A770 16GB',
    description: 'Intel desktop GPU with 16GB VRAM, AV1 encoding support, and strong value for modern DirectX 12 games.',
    imageUrl: 'https://images.unsplash.com/photo-1555617778-02518510b9fa',
    searchTerm: 'Intel Arc A770 16GB',
  },
];

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

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {
        description: product.description,
        imageUrl: product.imageUrl,
        searchTerm: product.searchTerm,
      },
      create: product,
    });
  }

  console.log(`✅ ${products.length} products seeded`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
