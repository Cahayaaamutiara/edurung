# Edu Ruang - Platform Pembelajaran Interaktif

**Edu Ruang** adalah aplikasi edukasi yang menggabungkan keseruan pembelajaran berbasis game dengan komunitas diskusi interaktif untuk siswa SMA.

## 🎯 Fitur Utama

### 🎮 Game Pembelajaran Interaktif
- **Multi-Subject Learning**: Modul pelajaran untuk Matematika, Fisika, Kimia, Biologi, Bahasa Indonesia, dan Bahasa Inggris
- **Level-based Questions**: Soal dengan tingkat kesulitan bertingkat (Level 1-3)
- **Real-time Scoring**: Sistem poin dengan bonus waktu
- **Progress Tracking**: Pelacakan kemajuan belajar per mata pelajaran
- **Gamification**: Level sistem, poin, dan achievement badges

### 💬 Komunitas Diskusi Interaktif
- **Subject-based Forums**: Forum diskusi per mata pelajaran
- **Real-time Interactions**: Sistem like/dislike dan komentar
- **Search & Filter**: Pencarian diskusi berdasarkan topik dan mata pelajaran
- **User Engagement**: Sistem voting dan interaksi komunitas

### 👤 Profil Pengguna Lengkap
- **User Dashboard**: Statistik personal dan pencapaian
- **Avatar Customization**: Pilihan avatar yang dapat disesuaikan
- **Achievement System**: Sistem pencapaian dan badge
- **Progress Tracking**: Riwayat aktivitas dan statistik belajar

### 🏆 Sistem Leaderboard
- **Competitive Learning**: Papan peringkat dengan sistem poin
- **Achievement Recognition**: Penghargaan untuk pencapaian tertinggi
- **Community Rankings**: Ranking berdasarkan kontribusi komunitas

## 🚀 Teknologi

- **Frontend**: SvelteKit 5 dengan TypeScript
- **Styling**: CSS Custom Properties dengan desain responsif
- **State Management**: Svelte Stores dengan reactive programming
- **Data Storage**: LocalStorage untuk persistensi data lokal
- **Icons**: Lucide Svelte untuk ikon modern
- **Animation**: CSS transitions dan transforms

## 🎨 Desain UI/UX

- **Modern Design**: Tampilan segar dengan skema warna cerah (biru, hijau, orange)
- **Responsive Layout**: Optimized untuk desktop dan mobile
- **Bottom Navigation**: Tab bar dengan akses mudah ke fitur utama
- **Smooth Animations**: Transisi halus dan feedback visual
- **Gamification Elements**: Progress bars, badges, dan achievement systems

## 📱 Struktur Aplikasi

### Halaman Utama
- **Dashboard**: Ringkasan pencapaian dan akses cepat
- **Game**: Pilihan mata pelajaran dan quiz interaktif
- **Discussion**: Forum diskusi dan tanya jawab
- **Profile**: Statistik personal dan pengaturan
- **Leaderboard**: Ranking dan kompetisi

### Komponen Utama
- **Authentication**: Sistem login/register dengan LocalStorage
- **Game Engine**: Quiz system dengan timer dan scoring
- **Discussion System**: Forum dengan voting dan replies
- **Notification System**: Real-time notifications dan badges
- **Profile Management**: User settings dan statistics

## 🛠️ Instalasi dan Setup

### Prerequisites
- Node.js (v18 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open aplikasi**
   Buka browser dan navigasi ke `http://localhost:5173`

### Build untuk Production

```bash
npm run build
npm run preview
```

## 🎮 Cara Menggunakan

### 1. Registrasi/Login
- Masukkan username, nama lengkap, dan kelas
- Pilih avatar yang diinginkan
- Sistem akan otomatis membuat atau login user

### 2. Bermain Game
- Pilih mata pelajaran di halaman Game
- Mulai quiz dengan 5 soal random
- Jawab pertanyaan dalam batas waktu
- Dapatkan poin berdasarkan kecepatan dan ketepatan

### 3. Berpartisipasi dalam Diskusi
- Buat pertanyaan baru atau reply diskusi existing
- Gunakan sistem voting untuk menilai kontribusi
- Filter diskusi berdasarkan mata pelajaran

### 4. Tracking Progress
- Monitor statistik di halaman Profile
- Lihat ranking di Leaderboard
- Unlock achievements berdasarkan aktivitas

---

**Edu Ruang** - Belajar Seru, Diskusi Pintar! 🚀📚
