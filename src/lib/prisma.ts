import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ 
  connectionString,
  connectionTimeoutMillis: 5000, // รอสาย 5 วินาทีถ้ายังไม่ติดให้ Timeout
  // หาก VPS ไม่ได้ตั้งค่า SSL ไว้ (ซึ่งปกติ Docker เริ่มต้นไม่ได้ตั้ง)
  // บางครั้งต้องระบุเพื่อไม่ให้มันพยายามต่อแบบ SSL
  ssl: false 
})

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma