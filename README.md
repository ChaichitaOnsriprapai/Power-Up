# CS100 | Power Up! Portfolio System (Final System & Demo)

ระบบบันทึกและจัดการผลงาน (Portfolio) พร้อมฟังก์ชันแลกเปลี่ยนผลงานกิจกรรม Challenge ในรูปแบบ JSON โดยมี Server-side Storage บน **AWS EC2** และรองรับการเข้าถึงข้ามอุปกรณ์

---

## สถาปัตยกรรมของระบบ (System Architecture)

- **Frontend:** HTML5, CSS3, JavaScript (ES6+ Asynchronous `fetch()`)
- **Backend API:** PHP (REST-like endpoints: `api/portfolios.php`, `api/items.php`, `api/storage.php`)
- **Data Persistence:** Server-side JSON Storage 
  - บน AWS EC2: จัดเก็บที่ `/var/www/data/portfolios.json` (นอก Web Root เพื่อความปลอดภัย)
  - บน Local: จัดเก็บที่ `local-data/portfolios.json`

---

## วิธีการเปิดและทดลองใช้งานเว็บไซต์ (Getting Started)

### วิธีที่ 1: เข้าใช้งานผ่าน AWS EC2 (Production) *[แนะนำ]*
สามารถเข้าใช้งานระบบจริงที่โฮสต์อยู่บนคลาวด์ได้ทันทีจากทุกอุปกรณ์:
- **URL เว็บไซต์:** `http://54.160.240.48/`

---

### วิธีที่ 2: เปิดใช้งานบนเครื่องคอมพิวเตอร์ (Local Development)
เนื่องจากระบบมี Backend เป็น PHP จึงต้องรันผ่าน PHP Built-in Web Server:

1. ตรวจสอบว่าในเครื่องมีการติดตั้ง **PHP** (เวอร์ชัน 8.x ขึ้นไป)
2. เปิด Terminal ในโฟลเดอร์โปรเจกต์
3. รันคำสั่งเริ่มต้นเซิร์ฟเวอร์:
   ```bash
   php -S localhost:8000
   ```
4. เปิดเว็บเบราว์เซอร์ไปที่: `http://localhost:8000`

---

## ขั้นตอนการติดตั้งบน AWS EC2 (Deployment Guide)

1. **สร้างและตั้งค่า EC2 Instance:**
   - ใช้ Ubuntu Server 24.04/22.04 LTS (Instance Type: `t3.micro`)
   - ตั้งค่า Security Group: เปิด **Inbound Rules** สำหรับ **SSH (Port 22)** และ **HTTP (Port 80)** จาก `0.0.0.0/0`
2. **ติดตั้ง Apache Web Server และ PHP:**
   ```bash
   sudo apt update
   sudo apt install apache2 php libapache2-mod-php -y
   sudo systemctl restart apache2
   ```
3. **เตรียมไดเรกทอรีสำหรับเก็บข้อมูล (Private Storage):**
   ```bash
   sudo mkdir -p /var/www/data
   sudo chown -R www-data:www-data /var/www/data
   sudo chmod -R 775 /var/www/data
   ```
4. **Deploy ไฟล์โปรเจกต์:**
   ```bash
   sudo rm -rf /var/www/html/*
   git clone https://github.com/ChaichitaOnsriprapai/Power-Up.git
   sudo cp -r Power-Up/* /var/www/html/
   ```

---

## คู่มือและขั้นตอนการทดสอบระบบ (Testing & Verification)

### 1. การจัดการ Profile และ Portfolio
- **สร้าง Profile:** กรอกชื่อในฟอร์ม *Create Profile* แล้วกดปุ่มเพื่อบันทึกข้อมูลขึ้น Server
- **เลือก Profile:** คลิกที่ชื่อ Profile ในแถบด้านบนเพื่อเลือกโปรไฟล์ที่ต้องการจัดการ (แสดงสถานะ `Active`)
- **เพิ่ม Item:** กรอกข้อมูลผลงานในฟอร์ม *Add an Item* ข้อมูลจะถูกตรวจสอบทั้งฝั่ง Frontend และ Server ก่อนบันทึกลงไฟล์ JSON

### 2. การแลกเปลี่ยนผลงาน Challenge (Portfolio Item JSON Exchange)
- **Import Item จากเพื่อน:** ไปที่เมนู Import วาง JSON ของผลงานที่ได้จาก Challenge ของกลุ่มอื่น แล้วกด Import ข้อมูลจะถูกตรวจสอบ Schema, ป้องกัน ID ซ้ำ และเพิ่มเข้าใน Profile ปัจจุบันทันที
- **Export Item / Portfolio:** 
  - กดปุ่ม Copy JSON ที่การ์ดผลงาน เพื่อนำ JSON ไปมอบให้เพื่อนที่มาทำ Challenge ของเรา
  - หรือกดปุ่ม Export Portfolio เพื่อคัดลอก JSON ทั้งหมดนำไปบันทึกเป็น `my-portfolio.json` ส่งเป็นหลักฐานรายบุคคล

### 3. การทดสอบความคงอยู่ของข้อมูล (Data Persistence & Cross-Device)
- **Cross-device:** บันทึกข้อมูลจากคอมพิวเตอร์ แล้วเปิด URL จากโทรศัพท์มือถือ จะพบข้อมูลชุดเดียวกัน
- **Server Persistence:** ข้อมูลใน `/var/www/data/portfolios.json` ยังคงอยู่ครบถ้วนแม้ทำการ Restart Apache (`sudo systemctl restart apache2`) หรือ Reboot เครื่อง EC2
