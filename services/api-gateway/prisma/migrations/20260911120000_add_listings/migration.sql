-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "retailer" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "listings_productId_idx" ON "listings"("productId");

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
