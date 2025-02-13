import { Prisma } from '@prisma/client'

export function convertPrismaProduct<T extends { price: Prisma.Decimal }>(
  product: T
): Omit<T, 'price'> & { price: number } {
  return {
    ...product,
    price: Number(product.price),
  }
}

export function convertPrismaProducts<T extends { price: Prisma.Decimal }>(
  products: T[]
): Array<Omit<T, 'price'> & { price: number }> {
  return products.map(convertPrismaProduct)
} 