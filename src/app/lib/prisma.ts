import { PrismaClient } from '@prisma/client'

// Prisma v5 — เชื่อมต่อผ่าน DATABASE_URL ใน schema.prisma โดยตรง (ไม่ต้องใช้ adapter)
const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma