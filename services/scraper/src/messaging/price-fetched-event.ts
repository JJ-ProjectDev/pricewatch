export interface PriceFetchedEvent {
  productId: string;
  price: number;
  retailer: string;
  url: string;
  fetchedAt: string;
}
