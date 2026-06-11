// =============================================
// Dual Prisma Client for Local (SQLite) + Online (PostgreSQL)
// =============================================
import { PrismaClient as LocalPrismaClient } from "../prisma/generated/local";
import { PrismaClient as OnlinePrismaClient } from "../prisma/generated/online";

// --- Local SQLite Client (Primary) ---
const globalForLocalPrisma = globalThis as unknown as {
  localPrisma: LocalPrismaClient | undefined;
};

export const localDb =
  globalForLocalPrisma.localPrisma ??
  new LocalPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForLocalPrisma.localPrisma = localDb;
}

// --- Online PostgreSQL Client (Backup/Sync) ---
const globalForOnlinePrisma = globalThis as unknown as {
  onlinePrisma: OnlinePrismaClient | undefined;
};

export const onlineDb =
  globalForOnlinePrisma.onlinePrisma ??
  new OnlinePrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForOnlinePrisma.onlinePrisma = onlineDb;
}

// Default export = local (primary) database
const prisma = localDb;
export default prisma;