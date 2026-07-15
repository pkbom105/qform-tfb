// =============================================
// Dual Prisma Client for Local (SQLite) + Online (PostgreSQL)
// =============================================
import { PrismaClient as LocalPrismaClient } from "../prisma/generated/local";
import { PrismaClient as OnlinePrismaClient } from "../prisma/generated/online";

const hasValidOnlineUrl = Boolean(
  process.env.ONLINE_DATABASE_URL &&
    /^postgres(?:ql)?:\/\//i.test(process.env.ONLINE_DATABASE_URL) &&
    process.env.ONLINE_DATABASE_URL.includes("@") &&
    process.env.ONLINE_DATABASE_URL.includes(":")
);

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

const hasOnlineClient = Boolean(
  process.env.ONLINE_DATABASE_URL &&
    /^postgres(?:ql)?:\/\//i.test(process.env.ONLINE_DATABASE_URL) &&
    process.env.ONLINE_DATABASE_URL.includes("@") &&
    process.env.ONLINE_DATABASE_URL.includes(":")
);

export const onlineDb = hasOnlineClient
  ? (globalForOnlinePrisma.onlinePrisma ??
      new OnlinePrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      }))
  : null;

if (process.env.NODE_ENV !== "production" && onlineDb) {
  globalForOnlinePrisma.onlinePrisma = onlineDb;
}

// Default export = local (primary) database
const prisma = localDb;
export default prisma;