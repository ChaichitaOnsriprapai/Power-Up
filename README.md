## วิธีการเปิดและทดลองใช้งานเว็บไซต์ (Getting Started)

คุณสามารถเลือกเปิดใช้งานและทดลองใช้งานเว็บไซต์ **Power-Up Portfolio** ได้ 2 วิธีดังนี้:

---

### วิธีที่ 1: เปิดใช้งานผ่านออนไลน์ (GitHub Pages) *[แนะนำ]*
สามารถเข้าใช้งานเว็บไซต์ผ่านเว็บเบราว์เซอร์ได้ทันทีโดยไม่ต้องติดตั้งโปรแกรมเพิ่มเติม:
**URL เว็บไซต์:** [https://ChaichitaOnsriprapai.github.io/Power-Up/]
(https://ChaichitaOnsriprapai.github.io/Power-Up/)

---

### วิธีที่ 2: เปิดใช้งานบนเครื่องคอมพิวเตอร์ (Local Machine)

#### **ตัวเลือก 2.1: เปิดด้วยเบราว์เซอร์โดยตรง (Direct Open)**
1. ดาวน์โหลดซอร์สโค้ด (ZIP) จาก GitHub Repository หรือ `git clone` ลงมาที่เครื่อง
2. เข้าไปที่โฟลเดอร์โปรเจกต์
3. ดับเบิลคลิกเปิดไฟล์ `index.html` ผ่านเว็บเบราว์เซอร์ (เช่น Google Chrome, Microsoft Edge หรือ Safari)

#### **ตัวเลือก 2.2: เปิดผ่าน Local Server (เช่น VS Code Live Server)**
1. เปิดโฟลเดอร์โปรเจกต์ด้วยโปรแกรม **Visual Studio Code**
2. ติดตั้ง Extension ที่ชื่อว่า **Live Server** (โดย Ritwick Dey)
3. คลิกขวาที่ไฟล์ `index.html` แล้วเลือก **"Open with Live Server"**
4. เว็บไซต์จะเปิดขึ้นมาอัตโนมัติที่ที่อยู่ `http://127.0.0.1:5500`

---

### ขั้นตอนการทดลองใช้งาน (Testing Steps)

เพื่อทดสอบการทำงานของระบบ ให้ปฏิบัติตามขั้นตอนดังนี้:
1. **สร้างโปรไฟล์ (Create Profile):** กรอกชื่อในฟอร์ม *Create Profile* แล้วกดปุ่ม **Create Profile**
2. **เลือกโปรไฟล์ (Select Profile):** คลิกเลือกโปรไฟล์ที่สร้างขึ้นมาเพื่อเริ่มต้นจัดการข้อมูล (จะปรากฏสถานะ `Active`)
3. **เพิ่มผลงาน (Add an Item):** กรอกรายละเอียดผลงานในฟอร์ม *Add an Item* (ต้องระบุ Title, Type, Date, Role, Description และ Evidence URL ที่ขึ้นต้นด้วย `http://` หรือ `https://`) จากนั้นกด **Save Item**
4. **ตรวจสอบการแสดงผล (Portfolio Listing):** ผลงานจะถูกนำมาแสดงผลในส่วน **Your Portfolio** ด้านล่างทันที