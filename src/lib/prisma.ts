// =============================================
// Single Prisma Client for PostgreSQL
// =============================================
import { PrismaClient } from "../prisma/generated/online";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// For backward compatibility with existing imports
export const localDb = prisma;
export const onlineDb = null;

export default prisma;