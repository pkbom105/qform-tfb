                                                  
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# ติดตั้งแพ็กเกจที่จำเป็นสำหรับ Prisma บน Alpine Linux (ป้องกันข้อผิดพลาด OpenSSL / Libssl)
RUN apk add --no-cache openssl libc6-compat

# คัดลอกไฟล์จัดการ Package
COPY package*.json ./

# คัดลอกโฟลเดอร์ prisma เข้ามาก่อน เพื่อให้สคริปต์ postinstall (prisma generate) มีไฟล์ใช้งาน
COPY prisma ./prisma/

# ติดตั้ง Dependencies ทั้งหมด (จะรัน prisma generate ไปในตัว)
RUN npm install

# คัดลอกซอร์สโค้ดที่เหลือทั้งหมดเข้าตู้
COPY . .

# สั่ง Build โปรเจกต์ Next.js (จะได้โฟลเดอร์ .next/standalone)
RUN npm run build


# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# ติดตั้ง openssl ใน Stage รันด้วย เพื่อให้ Prisma Client คุยกับฐานข้อมูลได้
RUN apk add --no-cache openssl

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# คัดลอกเฉพาะไฟล์ที่จำเป็นจาก Stage builder เพื่อให้ตู้มีขนาดเล็กที่สุด
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# สร้างโฟลเดอร์สำหรับรองรับไฟล์อัปโหลดและตั้งสิทธิ์ให้เขียนไฟล์ได้
RUN mkdir -p public/uploads /home/qform/uploads && chmod 777 public/uploads /home/qform/uploads

EXPOSE 3000

CMD ["node", "server.js"]

