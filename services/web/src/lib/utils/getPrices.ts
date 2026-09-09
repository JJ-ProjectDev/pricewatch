const PRICES = [49, 99, 149, 249, 399, 599, 899, 1299, 1999]
export function getMockPrice(productId: string): number {
  let hash = 0

  for (let i = 0; i < productId.length; i++) {
    hash = hash * 31 + productId.charCodeAt(i)
  }
  const index = Math.abs(hash) % PRICES.length
  return PRICES[index]
}