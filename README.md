# apply-bloom (ApplyBloom)

> **Career Tracker & Gamified Growth Platform**  
> Kelola lamaran kerja, pipeline rekrutmen, agenda wawancara & tes teknis, serta bangun kebiasaan melamar kerja yang konsisten dengan kebun virtual interaktif (Bloom Garden).

---

## Fitur Utama

- **Dashboard & Analitik Karir**: Pantau ringkasan total lamaran, tahapan interview, tawaran kerja (*Offers*), tren mingguan, dan status streak harian.
- **My Applications**: Manajemen tabel dan kartu lamaran kerja lengkap dengan filter status, pencarian instan, dan pengurutan gaji/tanggal.
- **Pipeline Kanban Board**: Papan visual drag-and-click antar status (*Wishlist, Applied, Screening, Assessment, Interview, Offer, Rejected*).
- **Agenda & Pengingat**: Pengingat jadwal wawancara, batas waktu tes teknis, dan follow-up email.
- **Bloom Garden (Gamifikasi Karir)**: Kebun karir virtual dengan tanaman interaktif yang bertumbuh seiring XP dan streak harian, serta koleksi lencana pencapaian (*Badges*).
- **Desain Olive Sage & Strawberry Pink**: Estetika modern bernuansa Olive Sage (`#788B4E`), Strawberry Pink (`#F45B88`), kanvas Sage Cream lembut, serta **Dark Mode "Tema Cowo"** (Tactical Gunmetal / Obsidian Forest).

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS v4 & Vanilla CSS Tokens
- **Icons**: Lucide React
- **ORM / Database**: Prisma & MySQL
- **Gamifikasi**: Level, XP System, Streaks & Badge Engine

---

## Cara Menjalankan Secara Lokal

1. **Clone repository**:
   ```bash
   git clone https://github.com/nanaachan12/apply-bloom.git
   cd apply-bloom
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Buat file `.env` di root direktori:
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/apply_bloom"
   JWT_SECRET="your_secret_key"
   ```

4. **Jalankan Migrasi Database**:
   ```bash
   npx prisma migrate dev
   ```

5. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.
