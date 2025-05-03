import { PrismaClient } from "@/lib/generated/prisma"

// Предотвращаем создание множества экземпляров PrismaClient в режиме разработки
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma 