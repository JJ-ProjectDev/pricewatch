import type { Product } from '../types'
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vertex RX 9080 XT',
    description:
      'A flagship-tier graphics card built for 4K gaming and heavy creative workloads, with 16GB of high-bandwidth memory.',
    imageUrl: 'https://picsum.photos/seed/gpu/800/600',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Nimbus Book Pro 14',
    description:
      'A lightweight laptop with a high-refresh display, all-day battery, and a magnesium chassis.',
    imageUrl: 'https://picsum.photos/seed/laptop/800/600',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Halo Phone S',
    description:
      'A compact flagship phone with a triple-camera system and fast charging.',
    imageUrl: 'https://picsum.photos/seed/phone/800/600',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
]
