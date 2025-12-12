import type { Material, MaterialSection } from '../types';

// Enhanced Materials with structured sections for Matematika
export const sampleMathMaterials: Material[] = [
  {
    id: 'math-basic-algebra',
    subjectId: 'matematika',
    title: 'Dasar-dasar Aljabar',
    description: 'Memahami konsep dasar aljabar termasuk variabel, konstanta, dan operasi dasar.',
    level: 'basic',
    duration: 15,
    tags: ['aljabar', 'dasar', 'variabel'],
    order: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    thumbnail: '/images/math-algebra-thumb.jpg',
    objectives: [
      'Memahami konsep variabel dan konstanta dalam aljabar',
      'Menguasai operasi dasar aljabar',
      'Mampu menyederhanakan ekspresi aljabar sederhana'
    ],
    summary: 'Pelajaran dasar tentang aljabar yang mencakup variabel, konstanta, dan operasi dasar.',
    downloadable: true,
    bookmarkable: true,
    sections: [
      {
        id: 'intro-algebra',
        title: 'Pengertian Aljabar',
        content: `**Aljabar** adalah cabang matematika yang menggunakan huruf (variabel) untuk mewakili bilangan yang tidak diketahui. 

Aljabar memungkinkan kita untuk:
- Menyelesaikan masalah matematika yang kompleks
- Membuat generalisasi dari pola-pola numerik
- Memodelkan situasi nyata dengan persamaan

## Sejarah Singkat
Aljabar pertama kali dikembangkan oleh matematikawan Arab Al-Khwarizmi pada abad ke-9. Kata "aljabar" berasal dari bahasa Arab "al-jabr" yang berarti "penyatuan bagian-bagian yang terpisah".

## Contoh Sederhana
Misalkan Anda membeli 3 buku dengan harga yang sama, dan total yang dibayar adalah Rp 45.000. Berapa harga satu buku?

Dalam aljabar, kita dapat menuliskannya sebagai: **3x = 45.000**
Di mana x adalah harga satu buku yang ingin kita cari.`,
        type: 'text',
        order: 1,
        studyTip: 'Bayangkan variabel sebagai kotak kosong yang bisa diisi dengan angka apa saja! Ini akan membantu Anda memahami konsep abstrak aljabar.'
      },
      {
        id: 'variables-constants',
        title: 'Variabel dan Konstanta',
        content: `Dalam aljabar, kita mengenal dua jenis simbol penting:

## 📝 Variabel
Variabel adalah simbol (biasanya huruf) yang mewakili bilangan yang belum diketahui atau dapat berubah-ubah.

**Contoh variabel:**
- x, y, z (yang paling umum digunakan)
- a, b, c (untuk koefisien)
- t (untuk waktu)
- v (untuk kecepatan)

## 🔢 Konstanta
Konstanta adalah bilangan yang nilainya tetap dan tidak berubah.

**Jenis-jenis konstanta:**
- **Bilangan bulat:** 1, 2, 3, -5, 0
- **Bilangan pecahan:** 1/2, 3/4, 2.5
- **Konstanta matematika:** π (pi), e (bilangan Euler)

## 💡 Membedakan Variabel dan Konstanta

| Aspek | Variabel | Konstanta |
|-------|----------|----------|
| Nilai | Dapat berubah | Tetap |
| Simbol | Huruf (x, y, z) | Angka (3, 5, π) |
| Fungsi | Mewakili yang tidak diketahui | Memberikan nilai pasti |

**Contoh dalam ekspresi:** 3x + 5
- 3 dan 5 adalah konstanta
- x adalah variabel`,
        type: 'text',
        order: 2,
        media: {
          type: 'image',
          url: '/images/variables-constants.png',
          alt: 'Diagram perbedaan variabel dan konstanta',
          caption: 'Ilustrasi perbedaan antara variabel (x, y, z) dan konstanta (3, 5, π)'
        },
        studyTip: 'Ingat: Variabel seperti wadah kosong yang bisa diisi, konstanta seperti batu yang tidak berubah!'
      },
      {
        id: 'basic-operations',
        title: 'Operasi Dasar Aljabar',
        content: 'Mari pelajari operasi dasar dalam aljabar: penjumlahan, pengurangan, perkalian, dan pembagian.',
        type: 'text',
        order: 3
      },
      {
        id: 'algebra-video',
        title: 'Video Pembelajaran: Aljabar Dasar',
        content: 'Tonton video ini untuk memahami konsep aljabar dengan lebih mudah.',
        type: 'video',
        order: 4,
        media: {
          type: 'video',
          url: '/videos/basic-algebra.mp4',
          thumbnail: '/images/video-algebra-thumb.jpg',
          duration: 300,
          caption: 'Video penjelasan tentang dasar-dasar aljabar (5 menit)'
        }
      },
      {
        id: 'practice-exercise',
        title: 'Latihan Interaktif',
        content: 'Sekarang saatnya berlatih! Kerjakan latihan berikut untuk menguji pemahaman Anda.',
        type: 'interactive',
        order: 5,
        interactive: {
          type: 'quiz',
          data: {
            questions: [
              {
                question: 'Sederhanakan ekspresi berikut: 4x + 3x - x',
                options: ['6x', '7x', '8x', '5x'],
                correct: 0,
                explanation: '4x + 3x - x = (4 + 3 - 1)x = 6x. Ingat, kita hanya dapat menjumlahkan atau mengurangkan suku-suku yang sejenis.'
              },
              {
                question: 'Hasil dari 2x × 3y adalah...',
                options: ['5xy', '6xy', '6x + y', '2x + 3y'],
                correct: 1,
                explanation: '2x × 3y = (2 × 3)(x × y) = 6xy. Kalikan koefisien (angka) dan kalikan variabel secara terpisah.'
              },
              {
                question: 'Manakah yang merupakan konstanta dalam ekspresi 5x + 7?',
                options: ['x', '5x', '7', '5 dan x'],
                correct: 2,
                explanation: 'Konstanta adalah bilangan yang nilainya tetap. Dalam ekspresi 5x + 7, angka 7 adalah konstanta karena nilainya tidak berubah.'
              }
            ]
          }
        }
      }
    ],
    // Legacy content for backward compatibility
    content: `# Dasar-dasar Aljabar

## Pengertian Aljabar
Aljabar adalah cabang matematika yang menggunakan huruf (variabel) untuk mewakili bilangan yang tidak diketahui.

## Variabel dan Konstanta
- **Variabel**: simbol (x, y, z) untuk bilangan yang belum diketahui
- **Konstanta**: bilangan yang nilainya tetap (3, 5, π)

## Operasi Dasar
### Penjumlahan Suku Sejenis
- 3x + 5x = 8x
- 2y² + 4y² = 6y²

### Perkalian Aljabar
- x × x = x²
- 2x × 3y = 6xy
- (x + 2)(x + 3) = x² + 5x + 6

## Latihan
1. Sederhanakan: 4x + 3x - x = 6x
2. Hitung: 2(x + 3) + 5 = 2x + 11`
  },
  {
    id: 'math-linear-equations',
    subjectId: 'matematika',
    title: 'Persamaan Linear',
    description: 'Memahami dan menyelesaikan persamaan linear satu dan dua variabel.',
    level: 'intermediate',
    duration: 20,
    tags: ['persamaan', 'linear', 'sistem'],
    prerequisites: ['math-basic-algebra'],
    order: 2,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    thumbnail: '/images/linear-equations-thumb.jpg',
    objectives: [
      'Memahami konsep persamaan linear',
      'Menyelesaikan persamaan linear satu variabel',
      'Menyelesaikan sistem persamaan linear dua variabel'
    ],
    summary: 'Pelajaran tentang persamaan linear dan cara menyelesaikannya.',
    downloadable: true,
    bookmarkable: true,
    sections: [
      {
        id: 'linear-intro',
        title: 'Pengenalan Persamaan Linear',
        content: 'Persamaan linear adalah persamaan yang memiliki variabel dengan pangkat tertinggi adalah 1.',
        type: 'text',
        order: 1,
        studyTip: 'Persamaan linear selalu membentuk garis lurus ketika digambar dalam grafik!'
      },
      {
        id: 'solving-linear',
        title: 'Menyelesaikan Persamaan Linear',
        content: 'Langkah-langkah menyelesaikan persamaan linear satu variabel.',
        type: 'text',
        order: 2,
        media: {
          type: 'image',
          url: '/images/linear-solving-steps.png',
          alt: 'Langkah-langkah menyelesaikan persamaan linear',
          caption: 'Contoh: 3x + 5 = 14, solusi: x = 3'
        }
      },
      {
        id: 'system-equations',
        title: 'Sistem Persamaan Linear',
        content: 'Menyelesaikan sistem persamaan linear dengan metode eliminasi dan substitusi.',
        type: 'text',
        order: 3
      },
      {
        id: 'linear-calculator',
        title: 'Kalkulator Persamaan Linear',
        content: 'Gunakan kalkulator interaktif untuk membantu menyelesaikan persamaan linear.',
        type: 'interactive',
        order: 4,
        interactive: {
          type: 'calculator',
          data: {
            type: 'linear_equation',
            description: 'Masukkan koefisien persamaan linear ax + b = c'
          }
        }
      }
    ],
    // Legacy content for backward compatibility
    content: `# Persamaan Linear

## Persamaan Linear Satu Variabel
Bentuk: ax + b = c

### Cara Menyelesaikan
1. Isolasi variabel
2. Bagi dengan koefisien

**Contoh**: 3x + 5 = 14
- 3x = 14 - 5 = 9
- x = 9 ÷ 3 = 3

## Sistem Persamaan Linear
**Contoh**: 2x + y = 8 dan x - y = 1
**Metode Eliminasi**: Jumlahkan persamaan
- 3x = 9, maka x = 3
- Substitusi: y = 2

## Aplikasi
Soal cerita tentang harga barang, umur, dll.`
  }
];

// Sample Materials for Fisika
export const samplePhysicsMaterials: Material[] = [
  {
    id: 'physics-mechanics',
    subjectId: 'fisika',
    title: 'Mekanika Dasar',
    description: 'Memahami konsep gerak, gaya, dan hukum-hukum Newton dalam kehidupan sehari-hari.',
    level: 'basic',
    duration: 20,
    tags: ['mekanika', 'kinematika', 'hukum newton'],
    order: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    thumbnail: '/images/physics-mechanics-thumb.jpg',
    objectives: [
      'Memahami konsep dasar kinematika dan dinamika',
      'Menguasai penerapan hukum-hukum Newton',
      'Mampu menyelesaikan soal gerak dan gaya'
    ],
    summary: 'Pelajaran fundamental tentang gerak dan gaya dalam fisika.',
    downloadable: true,
    bookmarkable: true,
    sections: [
      {
        id: 'kinematika-intro',
        title: 'Pengantar Kinematika',
        content: 'Kinematika adalah cabang fisika yang mempelajari gerak benda tanpa memperhatikan penyebab gerak tersebut. Dalam kehidupan sehari-hari, kita selalu berinteraksi dengan konsep gerak.',
        type: 'text',
        order: 1,
        studyTip: 'Amati gerakan benda di sekitar Anda untuk memahami konsep kecepatan dan percepatan!'
      },
      {
        id: 'besaran-gerak',
        title: 'Besaran-Besaran Gerak',
        content: 'Dalam kinematika, terdapat beberapa besaran penting yang perlu kita pahami: jarak, perpindahan, kecepatan, dan percepatan.',
        type: 'text',
        order: 2,
        media: {
          type: 'image',
          url: '/images/physics-motion-quantities.png',
          alt: 'Ilustrasi besaran gerak',
          caption: 'Perbedaan antara jarak dan perpindahan dalam gerak benda'
        }
      },
      {
        id: 'rumus-glbb',
        title: 'Gerak Lurus Berubah Beraturan (GLBB)',
        content: 'GLBB adalah gerak lurus dengan percepatan konstan. Terdapat tiga persamaan utama dalam GLBB yang sering digunakan untuk menyelesaikan soal.',
        type: 'formula',
        order: 3,
        studyTip: 'Hafalkan ketiga rumus GLBB dan pahami kapan menggunakan masing-masing rumus!'
      },
      {
        id: 'newton-laws-video',
        title: 'Video: Hukum-Hukum Newton',
        content: 'Mari pelajari tiga hukum Newton yang menjelaskan hubungan antara gaya dan gerak benda.',
        type: 'video',
        order: 4,
        media: {
          type: 'video',
          url: '/videos/newton-laws.mp4',
          thumbnail: '/images/newton-laws-thumb.jpg',
          duration: 420,
          caption: 'Penjelasan lengkap tentang hukum-hukum Newton (7 menit)'
        }
      },
      {
        id: 'energy-concepts',
        title: 'Konsep Energi dalam Mekanika',
        content: 'Energi adalah kemampuan untuk melakukan usaha. Dalam mekanika, kita mengenal energi kinetik dan energi potensial.',
        type: 'text',
        order: 5,
        media: {
          type: 'image',
          url: '/images/energy-types.png',
          alt: 'Jenis-jenis energi',
          caption: 'Ilustrasi energi kinetik dan potensial dalam berbagai situasi'
        }
      },
      {
        id: 'mechanics-quiz',
        title: 'Kuis Interaktif: Mekanika',
        content: 'Uji pemahaman Anda tentang konsep mekanika dengan kuis interaktif ini.',
        type: 'interactive',
        order: 6,
        interactive: {
          type: 'quiz',
          data: {
            questions: [
              {
                question: 'Sebuah mobil bergerak dengan kecepatan 60 km/jam. Berapakah kecepatan dalam m/s?',
                options: ['16.67 m/s', '20 m/s', '60 m/s', '216 m/s'],
                correct: 0,
                explanation: '60 km/jam = 60 × (1000/3600) = 16.67 m/s'
              },
              {
                question: 'Hukum Newton yang menyatakan "aksi sama dengan reaksi" adalah?',
                options: ['Hukum I Newton', 'Hukum II Newton', 'Hukum III Newton', 'Hukum Gravitasi'],
                correct: 2,
                explanation: 'Hukum III Newton menyatakan bahwa setiap aksi memiliki reaksi yang sama besar dan berlawanan arah'
              }
            ]
          }
        }
      }
    ],
    // Legacy content for backward compatibility
    content: `# Mekanika Dasar

## Kinematika
### Besaran Gerak
- **Jarak (s)**: panjang lintasan
- **Kecepatan (v)**: v = s/t
- **Percepatan (a)**: a = Δv/t

### Rumus GLBB
- v = v₀ + at
- s = v₀t + ½at²
- v² = v₀² + 2as

## Hukum Newton
1. **Hukum I**: ΣF = 0 (benda diam/GLB)
2. **Hukum II**: ΣF = ma
3. **Hukum III**: Faksi = -Freaksi

## Energi
- **Kinetik**: Ek = ½mv²
- **Potensial**: Ep = mgh
- **Usaha**: W = F × s`
  }
];

// Sample Materials for other subjects
export const sampleBiologyMaterials: Material[] = [
  {
    id: 'biology-cell-structure',
    subjectId: 'biologi',
    title: 'Struktur dan Fungsi Sel',
    description: 'Mempelajari komponen sel dan fungsinya.',
    content: `# Struktur dan Fungsi Sel

## Jenis Sel
- **Prokariotik**: tanpa membran inti (bakteri)
- **Eukariotik**: ada membran inti (hewan, tumbuhan)

## Organel Penting
- **Nukleus**: mengontrol aktivitas sel
- **Mitokondria**: menghasilkan energi (ATP)
- **Ribosom**: sintesis protein
- **Kloroplas**: fotosintesis (tumbuhan)

## Transpor Membran
- **Difusi**: dari konsentrasi tinggi ke rendah
- **Osmosis**: difusi air
- **Transpor aktif**: butuh energi ATP`,
    level: 'basic',
    duration: 18,
    tags: ['sel', 'organel', 'transpor'],
    order: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const sampleIndonesianMaterials: Material[] = [
  {
    id: 'indonesian-grammar',
    subjectId: 'bahasa-indonesia',
    title: 'Tata Bahasa Indonesia',
    description: 'Mempelajari kaidah tata bahasa Indonesia.',
    content: `# Tata Bahasa Indonesia

## Kelas Kata
- **Nomina**: kata benda (meja, buku)
- **Verba**: kata kerja (menulis, berlari)
- **Adjektiva**: kata sifat (tinggi, pintar)

## Struktur Kalimat
**Pola**: S + P + O + K
Contoh: Adik (S) membaca (P) buku (O) di perpustakaan (K)

## Jenis Kalimat
- **Tunggal**: satu pola S-P
- **Majemuk**: lebih dari satu pola S-P

## Ejaan
- Huruf kapital untuk nama, awal kalimat
- Tanda baca: titik (.), koma (,), tanya (?), seru (!)`,
    level: 'basic',
    duration: 15,
    tags: ['tata bahasa', 'kelas kata', 'kalimat'],
    order: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Sample Materials for IPS (Ilmu Pengetahuan Sosial)
export const sampleIPSMaterials: Material[] = [
  {
    id: 'ips-geografi-indonesia',
    subjectId: 'ips',
    title: 'Geografi Indonesia',
    description: 'Memahami letak geografis, batas-batas, dan karakteristik wilayah Indonesia',
    level: 'basic',
    duration: 20,
    tags: ['geografi', 'indonesia', 'wilayah'],
    order: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    thumbnail: '/images/materials/ips-geografi-thumb.jpg',
    objectives: [
      'Memahami letak astronomis dan geografis Indonesia',
      'Mengenal batas-batas wilayah Indonesia',
      'Memahami karakteristik iklim di Indonesia'
    ],
    summary: 'Materi tentang geografi Indonesia, mencakup letak astronomis, geografis, dan batas-batas wilayah.',
    downloadable: true,
    bookmarkable: true,
    sections: [
      {
        id: 'geografi-intro',
        title: 'Pengantar Geografi Indonesia',
        content: `**Geografi Indonesia** adalah ilmu yang mempelajari tentang letak, luas, bentuk, dan karakteristik wilayah Indonesia. Indonesia merupakan negara kepulauan terbesar di dunia dengan lebih dari 17.000 pulau.

## Letak Astronomis Indonesia
Indonesia terletak di antara:
- **Garis Lintang**: 6° LU - 11° LS
- **Garis Bujur**: 95° BT - 141° BT

## Letak Geografis Indonesia
Indonesia terletak:
- Di antara dua benua: Asia dan Australia
- Di antara dua samudra: Pasifik dan Hindia
- Di jalur pegunungan sirkum Pasifik

## Luas Wilayah
Luas wilayah Indonesia sekitar **1.904.569 km²** dengan garis pantai sepanjang ±54.716 km.

## Kondisi Iklim
Indonesia memiliki iklim tropis dengan dua musim utama:
- **Musim Hujan**: Oktober - April
- **Musim Kemarau**: Mei - September`,
        type: 'text',
        order: 1,
        studyTip: 'Gunakan peta untuk memahami letak geografis Indonesia agar lebih mudah diingat!'
      },
      {
        id: 'batas-wilayah',
        title: 'Batas-batas Wilayah Indonesia',
        content: `Indonesia memiliki batas wilayah darat dan laut dengan negara tetangga:

## Batas Darat
- **Malaysia**: Pulau Sebatik dan Pulau Tarakan (Kalimantan)
- **Papua Nugini**: Pulau New Guinea bagian barat (Papua)
- **Timor Leste**: Pulau Timor bagian barat (Nusa Tenggara Timur)

## Batas Laut
- **Singapura**: Selat Johor dan Selat Singapura
- **Malaysia**: Selat Malaka, Laut China Selatan
- **Filipina**: Laut Sulawesi, Laut Filipina
- **Australia**: Laut Arafura, Selat Torres
- **Thailand**: Teluk Thailand

## Zona Ekonomi Eksklusif (ZEE)
Indonesia memiliki ZEE selebar 200 mil laut dari garis dasar pantai sesuai UNCLOS 1982.`,
        type: 'text',
        order: 2,
        media: {
          type: 'image',
          url: '/images/materials/indonesia-map.png',
          alt: 'Peta batas wilayah Indonesia',
          caption: 'Peta menunjukkan batas wilayah darat dan laut Indonesia'
        },
        studyTip: 'Ingat bahwa batas laut lebih panjang daripada batas darat karena Indonesia adalah negara kepulauan!'
      },
      {
        id: 'iklim-indonesia',
        title: 'Iklim dan Keadaan Alam Indonesia',
        content: `Indonesia memiliki keanekaragaman iklim dan keadaan alam yang tinggi karena faktor geografisnya.

## Jenis Iklim
- **Iklim Tropis**: Suhu rata-rata 25-27°C sepanjang tahun
- **Iklim Muson**: Dipengaruhi oleh perbedaan tekanan udara antara benua Asia dan Australia

## Faktor yang Mempengaruhi Iklim
1. **Letak Lintang**: Indonesia dilalui garis khatulistiwa
2. **Ketinggian Tempat**: Semakin tinggi semakin sejuk
3. **Jarak dari Laut**: Wilayah pesisir lebih lembab
4. **Angin Muson**: Muson barat (hujan) dan muson timur (kering)

## Pembagian Waktu
Indonesia memiliki tiga zona waktu:
- **WIB**: Waktu Indonesia Barat (UTC+7)
- **WITA**: Waktu Indonesia Tengah (UTC+8)
- **WIT**: Waktu Indonesia Timur (UTC+9)`,
        type: 'text',
        order: 3
      },
      {
        id: 'latihan-geografi',
        title: 'Latihan Interaktif',
        content: 'Uji pemahaman Anda tentang geografi Indonesia dengan latihan berikut.',
        type: 'interactive',
        order: 4,
        interactive: {
          type: 'quiz',
          data: {
            questions: [
              {
                question: 'Berapa luas wilayah Indonesia?',
                options: ['1.200.000 km²', '1.904.569 km²', '2.100.000 km²', '900.000 km²'],
                correct: 1,
                explanation: 'Luas wilayah Indonesia sekitar 1.904.569 km².'
              },
              {
                question: 'Negara mana yang tidak berbatasan darat dengan Indonesia?',
                options: ['Malaysia', 'Papua Nugini', 'Timor Leste', 'Singapura'],
                correct: 3,
                explanation: 'Singapura berbatasan laut dengan Indonesia, bukan batas darat.'
              },
              {
                question: 'Berapa jumlah zona waktu di Indonesia?',
                options: ['2', '3', '4', '5'],
                correct: 1,
                explanation: 'Indonesia memiliki 3 zona waktu: WIB, WITA, dan WIT.'
              }
            ]
          }
        }
      }
    ],
    content: `# Geografi Indonesia

## Letak Astronomis
- Garis Lintang: 6° LU - 11° LS
- Garis Bujur: 95° BT - 141° BT

## Letak Geografis
- Di antara dua benua: Asia dan Australia
- Di antara dua samudra: Pasifik dan Hindia

## Batas Wilayah
- Darat: Malaysia, Papua Nugini, Timor Leste
- Laut: Singapura, Malaysia, Filipina, Australia, Thailand

## Iklim
- Iklim Tropis dengan suhu 25-27°C
- Dua musim: hujan (Oktober-April) dan kemarau (Mei-September)

## Zona Waktu
- WIB (UTC+7)
- WITA (UTC+8)
- WIT (UTC+9)`
  },
  {
    id: 'ips-sejarah-indonesia',
    subjectId: 'ips',
    title: 'Sejarah Indonesia',
    description: 'Mempelajari sejarah perkembangan bangsa Indonesia dari masa ke masa',
    level: 'intermediate',
    duration: 25,
    tags: ['sejarah', 'indonesia', 'kemerdekaan'],
    prerequisites: ['ips-geografi-indonesia'],
    order: 2,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    thumbnail: '/images/materials/ips-sejarah-thumb.jpg',
    objectives: [
      'Memahami masa prasejarah hingga kerajaan-kerajaan di Indonesia',
      'Mengenal sejarah kolonialisme dan imperialisme di Indonesia',
      'Memahami perjuangan kemerdekaan Indonesia'
    ],
    summary: 'Materi tentang sejarah Indonesia dari masa prasejarah hingga kemerdekaan.',
    downloadable: true,
    bookmarkable: true,
    sections: [
      {
        id: 'sejarah-pra',
        title: 'Masa Prasejarah Indonesia',
        content: `**Masa Prasejarah** adalah periode sebelum adanya tulisan. Di Indonesia, masa prasejarah dibagi menjadi tiga zaman:

## Zaman Batu (Paleolitikum, Mesolitikum, Neolitikum)
### Paleolitikum (Zaman Batu Tua)
- Manusia purba menggunakan alat dari batu yang masih kasar
- Contoh: Pithecanthropus Erectus (Manusia Jawa)

### Mesolitikum (Zaman Batu Tengah)
- Alat batu sudah diasah
- Mulai ada kehidupan berkelompok
- Contoh: Homo Sapiens

### Neolitikum (Zaman Batu Muda)
- Alat batu diasah halus
- Mulai bercocok tanam dan beternak
- Contoh: Abris Sous Roche (gua-gua berpictogram)

## Zaman Logam (Perunggu dan Besi)
### Zaman Perunggu
- Menggunakan alat dari perunggu (campuran tembaga dan timah)
- Contoh: Nekara, Moko, Kapak Corong

### Zaman Besi
- Menggunakan alat dari besi
- Teknologi lebih maju
- Contoh: Kapak persegi, Cangkul`,
        type: 'text',
        order: 1,
        studyTip: 'Gunakan garis waktu untuk memahami perkembangan zaman di Indonesia!'
      },
      {
        id: 'kerajaan-nusantara',
        title: 'Kerajaan-Kerajaan Nusantara',
        content: `Indonesia memiliki sejarah panjang tentang kerajaan-kerajaan yang pernah berkembang di Nusantara.

## Kerajaan Awal
- **Sriwijaya** (abad 7-13 M): Berpusat di Palembang, menguasai jalur perdagangan Malaka
- **Mataram Kuno** (abad 8-10 M): Berpusat di Jawa Tengah, meninggalkan prasasti dan candi
- **Kediri** (abad 11-12 M): Melanjutkan kejayaan Mataram Kuno

## Kerajaan Hindu-Buddha Terbesar
- **Majapahit** (abad 13-15 M): Kerajaan terbesar di Nusantara, mencapai puncak kejayaan di bawah Hayam Wuruk dan Gajah Mada

## Kerajaan Islam
- **Demak** (abad 15-16 M): Kerajaan Islam pertama di Jawa
- **Aceh** (abad 16-17 M): Kerajaan maritim yang kuat di ujung barat Indonesia
- **Mataram Islam** (abad 16-18 M): Kerajaan besar di Jawa yang memperluas pengaruh Islam

## Faktor Kemajuan Kerajaan
1. Letak strategis di jalur perdagangan internasional
2. Kekuatan militer yang baik
3. Kebijakan pemerintahan yang bijaksana
4. Kemajuan teknologi pertanian dan perdagangan`,
        type: 'text',
        order: 2,
        media: {
          type: 'image',
          url: '/images/materials/kerajaan-indonesia.png',
          alt: 'Peta kerajaan-kerajaan Nusantara',
          caption: 'Peta penyebaran kerajaan-kerajaan di Nusantara'
        }
      },
      {
        id: 'kolonialisme',
        title: 'Kolonialisme dan Imperialisme',
        content: `Kolonialisme adalah kebijakan suatu negara untuk menguasai negara lain secara politik, ekonomi, dan budaya.

## Kedatangan Bangsa Eropa
- **Portugis** (1511): Menguasai Malaka, mendirikan benteng di Maluku
- **Belanda** (1602): Membentuk VOC, menguasai sebagian besar Nusantara
- **Inggris** (1811-1816): Singkat menguasai Indonesia, dibawah Thomas Stamford Raffles
- **Jepang** (1942-1945): Menginvasi Indonesia, memperkenalkan sistem romusha

## VOC (Vereenigde Oostindische Compagnie)
- Didirikan tahun 1602
- Tujuan: monopoli perdagangan rempah-rempah
- Kebijakan: tanam paksa, cultuurstelsel
- Berakhir tahun 1799 karena bangkrut

## Hindia Belanda
- Setelah VOC bubar, pemerintah Belanda langsung menguasai
- Kebijakan: tanam paksa, pelayaran haji, sistem pemerintahan pribumi
- Perlawanan: Pangeran Diponegoro, Imam Bonjol, Pattimura

## Jepang di Indonesia
- Slogan: "Asia untuk orang Asia"
- Kebijakan: romusha, seikerei, bahasa Jepang
- Perlawanan: PETA, Heiho, Barisan Pelopor`,
        type: 'text',
        order: 3
      },
      {
        id: 'kemerdekaan',
        title: 'Perjuangan Kemerdekaan',
        content: `Perjuangan kemerdekaan Indonesia adalah proses panjang untuk memperoleh kemerdekaan dari penjajahan.

## Faktor Pemicu Kebangkitan Nasional
1. Masuknya ide liberalisme dan nasionalisme dari Eropa
2. Diskriminasi terhadap pribumi oleh pemerintah kolonial
3. Pendidikan Barat yang membuka wawasan bangsa

## Organisasi Pergerakan Nasional
- **Budi Utomo** (1908): Organisasi pertama, berbasis kebudayaan
- **Sarekat Islam** (1911): Organisasi perdagangan muslim
- **Indische Partij** (1912): Partai pertama dengan tujuan kemerdekaan
- **Perhimpunan Indonesia** (1925): Organisasi di Belanda

## Partai Nasional Indonesia
- **Partai Nasional Indonesia** (1927): Didirikan oleh Soekarno
- Tujuan: kemerdekaan Indonesia
- Kebijakan: non-kooperatif terhadap pemerintah kolonial

## Proklamasi Kemerdekaan
- **Tanggal**: 17 Agustus 1945
- **Tokoh**: Soekarno, Mohammad Hatta, Soepomo
- **Dokumen**: Teks Proklamasi yang ditulis oleh Soekarno
- **Makna**: Indonesia merdeka dari penjajahan

## Diplomasi Internasional
- **Konferensi Meja Bundar** (1949): Penyerahan kedaulatan oleh Belanda
- **PBB**: Indonesia menjadi anggota PBB pada tahun 1950`,
        type: 'text',
        order: 4
      },
      {
        id: 'latihan-sejarah',
        title: 'Latihan Interaktif',
        content: 'Uji pemahaman Anda tentang sejarah Indonesia dengan latihan berikut.',
        type: 'interactive',
        order: 5,
        interactive: {
          type: 'quiz',
          data: {
            questions: [
              {
                question: 'Apa nama kerajaan terbesar di Nusantara?',
                options: ['Majapahit', 'Sriwijaya', 'Mataram', 'Demak'],
                correct: 0,
                explanation: 'Majapahit adalah kerajaan terbesar di Nusantara yang mencapai puncak kejayaan di bawah Hayam Wuruk.'
              },
              {
                question: 'Tahun berapa VOC didirikan?',
                options: ['1511', '1602', '1799', '1800'],
                correct: 1,
                explanation: 'VOC (Vereenigde Oostindische Compagnie) didirikan pada tahun 1602.'
              },
              {
                question: 'Apa slogan yang digunakan Jepang saat menginvasi Indonesia?',
                options: ['Asia untuk orang Asia', 'Indonesia Merdeka', 'Jepang Memerintah', 'Bersatu Kita Teguh'],
                correct: 0,
                explanation: 'Jepang menggunakan slogan "Asia untuk orang Asia" saat menginvasi Indonesia.'
              }
            ]
          }
        }
      }
    ],
    content: `# Sejarah Indonesia

## Masa Prasejarah
- Zaman Batu (Paleolitikum, Mesolitikum, Neolitikum)
- Zaman Logam (Perunggu, Besi)

## Kerajaan-Kerajaan Nusantara
- Sriwijaya, Majapahit, Mataram Kuno
- Demak, Aceh, Mataram Islam

## Kolonialisme
- Portugis (1511), VOC (1602-1799)
- Hindia Belanda, Jepang (1942-1945)

## Perjuangan Kemerdekaan
- Budi Utomo (1908), Sarekat Islam (1911)
- PNI (1927), Proklamasi (17 Agustus 1945)
- KMB (1949)`
  }
];

// Sample Materials for Science (IPA)
export const sampleScienceMaterials: Material[] = [
  {
    id: 'ipa-ekosistem',
    subjectId: 'ipa',
    title: 'Ekosistem dan Interaksi Makhluk Hidup',
    description: 'Memahami komponen ekosistem dan interaksi antar makhluk hidup',
    level: 'basic',
    duration: 20,
    tags: ['ekosistem', 'interaksi', 'rantai makanan'],
    order: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    thumbnail: '/images/materials/ipa-ekosistem-thumb.jpg',
    objectives: [
      'Mengidentifikasi komponen biotik dan abiotik dalam ekosistem',
      'Memahami rantai makanan dan jaring-jaring makanan',
      'Menganalisis hubungan simbiosis antar makhluk hidup'
    ],
    summary: 'Materi tentang ekosistem, komponen-komponennya, dan interaksi antar makhluk hidup.',
    downloadable: true,
    bookmarkable: true,
    sections: [
      {
        id: 'ekosistem-intro',
        title: 'Pengantar Ekosistem',
        content: `**Ekosistem** adalah suatu sistem yang terbentuk oleh hubungan timbal balik antara makhluk hidup dengan lingkungannya. Dalam ekosistem terjadi interaksi yang saling mempengaruhi antara komponen biotik (makhluk hidup) dan komponen abiotik (makhluk tidak hidup).

## Komponen Ekosistem
### Komponen Biotik
Komponen biotik terdiri dari semua makhluk hidup dalam ekosistem:
- **Produsen**: Tumbuhan hijau yang membuat makanan sendiri (autotrof)
- **Konsumen**: Makhluk hidup yang memakan produsen atau konsumen lain
- **Dekomposer**: Organisme yang menguraikan sisa makhluk hidup (bakteri, jamur)

### Komponen Abiotik
Komponen abiotik terdiri dari semua benda mati yang mempengaruhi kehidupan:
- **Suhu**
- **Cahaya matahari**
- **Air**
- **Udara**
- **Tanah**
- **Mineral**

## Habitat dan Niche
- **Habitat**: Tempat tinggal makhluk hidup
- **Niche**: Peran dan posisi makhluk hidup dalam ekosistem`,
        type: 'text',
        order: 1,
        studyTip: 'Gunakan diagram untuk memahami hubungan antara komponen biotik dan abiotik!'
      },
      {
        id: 'rantai-makanan',
        title: 'Rantai Makanan dan Jaring-jaring Makanan',
        content: `Dalam ekosistem, energi mengalir dari satu organisme ke organisme lain melalui proses makan dan dimakan yang disebut **rantai makanan**.

## Rantai Makanan
Rantai makanan adalah urutan pemindahan energi dari produsen ke konsumen.
Contoh:
**Rumput → Kelinci → Ular → Elang**
- Rumput (produsen)
- Kelinci (konsumen tingkat I)
- Ular (konsumen tingkat II)
- Elang (konsumen tingkat III)

## Jaring-jaring Makanan
Jaring-jaring makanan adalah kumpulan beberapa rantai makanan yang saling berhubungan.

## Piramida Ekologi
Piramida ekologi menunjukkan jumlah energi, biomassa, atau jumlah individu pada setiap tingkat trofik:
1. **Piramida Energi**: Selalu tegak
2. **Piramida Biomassa**: Biasanya tegak
3. **Piramida Jumlah**: Bisa tegak atau terbalik`,
        type: 'text',
        order: 2,
        media: {
          type: 'image',
          url: '/images/materials/food-chain.png',
          alt: 'Contoh rantai makanan',
          caption: 'Rantai makanan: Rumput → Kelinci → Ular → Elang'
        }
      },
      {
        id: 'simbiosis',
        title: 'Hubungan Simbiosis',
        content: `**Simbiosis** adalah hubungan khas antara dua organisme yang berbeda jenis yang hidup bersama dalam waktu yang lama.

## Jenis-jenis Simbiosis
1. **Mutualisme**: Hubungan yang saling menguntungkan
   - Contoh: Lebah dengan bunga (lebah dapat madu, bunga dibantu penyerbukan)

2. **Parasitisme**: Hubungan yang menguntungkan salah satu pihak dan merugikan pihak lain
   - Contoh: Benalu dengan pohon inang (benalu untung, pohon rugi)

3. **Komensalisme**: Hubungan yang menguntungkan salah satu pihak dan tidak merugikan pihak lain
   - Contoh: Ikan hiu dengan ikan remora (remora dapat makanan, hiu tidak terpengaruh)`,
        type: 'text',
        order: 3
      },
      {
        id: 'latihan-ekosistem',
        title: 'Latihan Interaktif',
        content: 'Uji pemahaman Anda tentang ekosistem dengan latihan berikut.',
        type: 'interactive',
        order: 4,
        interactive: {
          type: 'quiz',
          data: {
            questions: [
              {
                question: 'Apa yang dimaksud dengan produsen dalam ekosistem?',
                options: ['Makhluk hidup yang memakan tumbuhan', 'Tumbuhan hijau yang membuat makanan sendiri', 'Makhluk hidup yang memakan daging', 'Makhluk hidup yang menguraikan sisa makhluk hidup'],
                correct: 1,
                explanation: 'Produsen adalah tumbuhan hijau yang membuat makanan sendiri melalui fotosintesis.'
              },
              {
                question: 'Manakah yang merupakan contoh simbiosis mutualisme?',
                options: ['Benalu dengan pohon mangga', 'Ikan hiu dengan ikan remora', 'Lebah dengan bunga', 'Cacing dengan manusia'],
                correct: 2,
                explanation: 'Lebah dengan bunga adalah contoh simbiosis mutualisme karena saling menguntungkan.'
              },
              {
                question: 'Apa yang terjadi pada piramida energi?',
                options: ['Selalu terbalik', 'Selalu tegak', 'Bisa tegak atau terbalik', 'Tidak beraturan'],
                correct: 1,
                explanation: 'Piramida energi selalu tegak karena energi berkurang pada setiap tingkat trofik.'
              }
            ]
          }
        }
      }
    ],
    content: `# Ekosistem dan Interaksi Makhluk Hidup

## Komponen Ekosistem
### Biotik
- Produsen: Tumbuhan hijau
- Konsumen: Herbivora, karnivora, omnivora
- Dekomposer: Bakteri, jamur

### Abiotik
- Suhu, cahaya, air, udara, tanah

## Rantai Makanan
Produsen → Konsumen I → Konsumen II → Konsumen III

## Simbiosis
- Mutualisme: saling menguntungkan
- Parasitisme: satu untung, satu rugi
- Komensalisme: satu untung, satu tidak terpengaruh`
  },
  {
    id: 'ipa-gaya',
    subjectId: 'ipa',
    title: 'Gaya dan Gerak',
    description: 'Memahami konsep gaya, jenis-jenis gaya, dan pengaruhnya terhadap gerak benda',
    level: 'intermediate',
    duration: 25,
    tags: ['gaya', 'gerak', 'hukum newton'],
    prerequisites: ['ipa-ekosistem'],
    order: 2,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    thumbnail: '/images/materials/ipa-gaya-thumb.jpg',
    objectives: [
      'Mengidentifikasi jenis-jenis gaya dalam kehidupan sehari-hari',
      'Memahami hukum-hukum Newton tentang gerak',
      'Menganalisis pengaruh gaya terhadap gerak benda'
    ],
    summary: 'Materi tentang gaya, jenis-jenisnya, dan pengaruhnya terhadap gerak benda.',
    downloadable: true,
    bookmarkable: true,
    sections: [
      {
        id: 'gaya-intro',
        title: 'Pengantar Gaya',
        content: `**Gaya** adalah dorongan atau tarikan yang dapat menyebabkan benda bergerak, berhenti, berubah arah, atau berubah bentuk.

## Satuan Gaya
Satuan gaya dalam SI adalah **Newton (N)**.

## Jenis-jenis Gaya
1. **Gaya Otot**: Gaya yang dihasilkan oleh otot manusia atau hewan
2. **Gaya Mesin**: Gaya yang dihasilkan oleh mesin
3. **Gaya Magnet**: Gaya yang dihasilkan oleh magnet
4. **Gaya Listrik**: Gaya yang dihasilkan oleh benda bermuatan listrik
5. **Gaya Gravitasi**: Gaya tarik bumi terhadap benda
6. **Gaya Gesek**: Gaya yang melawan gerak benda

## Pengaruh Gaya terhadap Benda
- Mengubah keadaan diam menjadi bergerak
- Mengubah keadaan bergerak menjadi diam
- Mengubah arah gerak benda
- Mengubah bentuk benda`,
        type: 'text',
        order: 1,
        studyTip: 'Amati berbagai gaya dalam kehidupan sehari-hari untuk memahami konsep ini!'
      },
      {
        id: 'hukum-newton',
        title: 'Hukum-hukum Newton',
        content: `Isaac Newton merumuskan tiga hukum tentang gerak yang dikenal sebagai Hukum Newton.

## Hukum I Newton (Hukum Kelembaman)
"Jika resultan gaya yang bekerja pada benda sama dengan nol, maka benda yang diam akan tetap diam dan benda yang bergerak akan tetap bergerak lurus beraturan."

**Rumus**: ΣF = 0

## Hukum II Newton
"Percepatan yang dihasilkan oleh suatu gaya yang bekerja pada suatu benda berbanding lurus dengan gaya tersebut dan berbanding terbalik dengan massa benda."

**Rumus**: F = m × a

## Hukum III Newton (Hukum Aksi-Reaksi)
"Jika suatu benda mengerjakan gaya pada benda lain, maka benda kedua akan mengerjakan gaya pada benda pertama yang sama besar tetapi berlawanan arah."

**Rumus**: Faksi = -Freaksi`,
        type: 'text',
        order: 2,
        media: {
          type: 'image',
          url: '/images/materials/newton-laws.png',
          alt: 'Ilustrasi Hukum-hukum Newton',
          caption: 'Ilustrasi Hukum I, II, dan III Newton'
        }
      },
      {
        id: 'gaya-gesek',
        title: 'Gaya Gesek',
        content: `**Gaya gesek** adalah gaya yang melawan gerak suatu benda. Gaya gesek terjadi ketika dua permukaan saling bersentuhan.

## Jenis Gaya Gesek
1. **Gaya Gesek Statis**: Gaya gesek yang bekerja pada benda diam
2. **Gaya Gesek Kinetis**: Gaya gesek yang bekerja pada benda bergerak

## Faktor yang Mempengaruhi Gaya Gesek
- Kekasaran permukaan
- Gaya normal (gaya yang tegak lurus permukaan)

## Keuntungan dan Kerugian Gaya Gesek
### Keuntungan:
- Memungkinkan kita berjalan tanpa terpeleset
- Rem kendaraan dapat berfungsi

### Kerugian:
- Menyebabkan aus pada benda
- Menghasilkan panas yang tidak diinginkan`,
        type: 'text',
        order: 3
      },
      {
        id: 'latihan-gaya',
        title: 'Latihan Interaktif',
        content: 'Uji pemahaman Anda tentang gaya dan gerak dengan latihan berikut.',
        type: 'interactive',
        order: 4,
        interactive: {
          type: 'quiz',
          data: {
            questions: [
              {
                question: 'Apa satuan gaya dalam SI?',
                options: ['Joule', 'Watt', 'Newton', 'Pascal'],
                correct: 2,
                explanation: 'Satuan gaya dalam SI adalah Newton (N).'
              },
              {
                question: 'Hukum Newton mana yang menyatakan "aksi = reaksi"?',
                options: ['Hukum I Newton', 'Hukum II Newton', 'Hukum III Newton', 'Hukum Gravitasi'],
                correct: 2,
                explanation: 'Hukum III Newton menyatakan bahwa setiap aksi memiliki reaksi yang sama besar dan berlawanan arah.'
              },
              {
                question: 'Apa yang dimaksud dengan gaya gesek statis?',
                options: ['Gaya gesek pada benda bergerak', 'Gaya gesek pada benda diam', 'Gaya gesek maksimum', 'Gaya gesek minimum'],
                correct: 1,
                explanation: 'Gaya gesek statis adalah gaya gesek yang bekerja pada benda dalam keadaan diam.'
              }
            ]
          }
        }
      }
    ],
    content: `# Gaya dan Gerak

## Jenis Gaya
- Gaya otot, mesin, magnet, listrik, gravitasi, gesek

## Hukum Newton
I. Kelembaman: ΣF = 0
II. F = m × a
III. Aksi = -Reaksi

## Gaya Gesek
- Statis (benda diam)
- Kinetis (benda bergerak)`
  }
];

// Sample Materials for English (Bahasa Inggris)
export const sampleEnglishMaterials: Material[] = [
  {
    id: 'english-tenses',
    subjectId: 'bahasa-inggris',
    title: 'English Tenses',
    description: 'Understanding the basic English tenses: Present, Past, and Future',
    level: 'basic',
    duration: 20,
    tags: ['tenses', 'grammar', 'verbs'],
    order: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    thumbnail: '/images/materials/english-tenses-thumb.jpg',
    objectives: [
      'Identify the three main English tenses',
      'Understand the structure of simple tenses',
      'Use tenses correctly in sentences'
    ],
    summary: 'Learn about the basic English tenses: Present Simple, Past Simple, and Future Simple.',
    downloadable: true,
    bookmarkable: true,
    sections: [
      {
        id: 'tenses-intro',
        title: 'Introduction to English Tenses',
        content: `**Tenses** in English show the time of an action or state. There are three main tenses:
1. **Present Tense** - for actions happening now
2. **Past Tense** - for actions that happened before
3. **Future Tense** - for actions that will happen

Each tense has four forms:
- **Simple**
- **Continuous**
- **Perfect**
- **Perfect Continuous**

In this lesson, we'll focus on the **Simple** forms.`,
        type: 'text',
        order: 1,
        studyTip: 'Practice forming sentences in different tenses to reinforce your understanding!'
      },
      {
        id: 'present-simple',
        title: 'Present Simple Tense',
        content: `**Present Simple** is used for:
- Habits or routines
- General truths or facts
- Scheduled events

## Structure:
**Positive**: Subject + Verb (base form) + Object
**Negative**: Subject + do/does + not + Verb (base form) + Object
**Question**: Do/Does + Subject + Verb (base form) + Object?

## Examples:
- I **go** to school every day. (habit)
- The sun **rises** in the east. (fact)
- She **does not like** coffee.
- **Do** you **speak** English?`,
        type: 'text',
        order: 2,
        media: {
          type: 'image',
          url: '/images/materials/present-simple.png',
          alt: 'Present Simple Tense examples',
          caption: 'Examples of Present Simple Tense usage'
        }
      },
      {
        id: 'past-simple',
        title: 'Past Simple Tense',
        content: `**Past Simple** is used for:
- Completed actions in the past
- Past habits
- Past states

## Structure:
**Positive**: Subject + Verb (past form) + Object
**Negative**: Subject + did + not + Verb (base form) + Object
**Question**: Did + Subject + Verb (base form) + Object?

## Examples:
- I **visited** my grandmother yesterday.
- She **did not go** to the party.
- **Did** you **watch** the movie?

## Regular vs Irregular Verbs:
- **Regular**: add -ed (walk → walked)
- **Irregular**: different forms (go → went, eat → ate)`,
        type: 'text',
        order: 3
      },
      {
        id: 'future-simple',
        title: 'Future Simple Tense',
        content: `**Future Simple** is used for:
- Actions that will happen
- Predictions
- Spontaneous decisions

## Structure:
**Positive**: Subject + will + Verb (base form) + Object
**Negative**: Subject + will + not + Verb (base form) + Object
**Question**: Will + Subject + Verb (base form) + Object?

## Examples:
- I **will call** you tomorrow.
- It **will rain** this afternoon.
- She **will not attend** the meeting.
- **Will** you **help** me?

## Contractions:
- will not = won't
- I will = I'll
- You will = You'll`,
        type: 'text',
        order: 4
      },
      {
        id: 'tenses-exercise',
        title: 'Practice Exercise',
        content: 'Test your understanding of English tenses with the following exercise.',
        type: 'interactive',
        order: 5,
        interactive: {
          type: 'quiz',
          data: {
            questions: [
              {
                question: 'Which tense is used for habits or routines?',
                options: ['Past Simple', 'Present Simple', 'Future Simple', 'Present Continuous'],
                correct: 1,
                explanation: 'Present Simple is used for habits or routines.'
              },
              {
                question: 'What is the past form of "go"?',
                options: ['goed', 'went', 'goes', 'going'],
                correct: 1,
                explanation: '"Go" is an irregular verb. Its past form is "went".'
              },
              {
                question: 'How do you form a negative sentence in Future Simple?',
                options: ['Subject + not + will + verb', 'Subject + will + not + verb', 'Subject + do + not + will + verb', 'Subject + will + verb + not'],
                correct: 1,
                explanation: 'Negative Future Simple: Subject + will + not + verb (base form).'
              }
            ]
          }
        }
      }
    ],
    content: `# English Tenses

## Present Simple
- I/You/We/They + verb
- He/She/It + verb+s/es

## Past Simple
- Regular: verb + ed
- Irregular: different forms

## Future Simple
- will + verb (base form)`
  },
  {
    id: 'english-reading',
    subjectId: 'bahasa-inggris',
    title: 'Reading Comprehension',
    description: 'Develop reading skills and comprehension strategies',
    level: 'intermediate',
    duration: 25,
    tags: ['reading', 'comprehension', 'vocabulary'],
    prerequisites: ['english-tenses'],
    order: 2,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    thumbnail: '/images/materials/english-reading-thumb.jpg',
    objectives: [
      'Apply reading strategies to understand texts',
      'Identify main ideas and supporting details',
      'Expand vocabulary through context clues'
    ],
    summary: 'Improve reading comprehension skills through various strategies and practice.',
    downloadable: true,
    bookmarkable: true,
    sections: [
      {
        id: 'reading-strategies',
        title: 'Reading Strategies',
        content: `Effective reading involves using specific strategies to understand and retain information.

## Before Reading
- **Preview**: Skim the text to get an overview
- **Set Purpose**: Know why you're reading
- **Activate Prior Knowledge**: Think about what you already know

## During Reading
- **Monitor Comprehension**: Check if you understand
- **Ask Questions**: Who, what, when, where, why, how
- **Make Connections**: Text-to-self, text-to-world, text-to-text
- **Visualize**: Create mental images
- **Infer**: Read between the lines

## After Reading
- **Summarize**: Retell main points in your own words
- **Reflect**: Think about what you learned
- **Respond**: Share your thoughts and opinions`,
        type: 'text',
        order: 1,
        studyTip: 'Practice these strategies with different types of texts to improve your reading skills!'
      },
      {
        id: 'main-ideas',
        title: 'Main Ideas and Details',
        content: `Understanding the main idea and supporting details is crucial for reading comprehension.

## Main Idea
The **main idea** is what the text is mostly about. It's the most important point the author wants to convey.

## Supporting Details
**Supporting details** are facts, examples, and explanations that develop the main idea.

## Topic vs Main Idea
- **Topic**: What the paragraph is about (usually one word or phrase)
- **Main Idea**: What the author says about the topic (a complete sentence)

## Finding the Main Idea
1. Look for repeated words or ideas
2. Check the first and last sentences
3. Ask: "What is this paragraph mostly about?"
4. Look for signal words: "most importantly", "the main point", "in conclusion"`,
        type: 'text',
        order: 2,
        media: {
          type: 'image',
          url: '/images/materials/main-idea.png',
          alt: 'Main Idea and Supporting Details',
          caption: 'Diagram showing main idea with supporting details'
        }
      },
      {
        id: 'context-clues',
        title: 'Using Context Clues',
        content: `**Context clues** are hints in a text that help readers understand the meaning of unfamiliar words.

## Types of Context Clues
1. **Definition/Explanation**: The meaning is directly stated
   - *Photosynthesis, the process by which plants make food, requires sunlight.*

2. **Synonym**: A similar word is provided
   - *The old mansion was enormous, a huge house with many rooms.*

3. **Antonym/Opposite**: The opposite meaning is given
   - *Unlike his brother who was always punctual, John was often tardy.*

4. **Example**: Specific examples clarify the meaning
   - *Arachnids, such as spiders and scorpions, have eight legs.*

5. **General Sense**: The overall meaning of the sentence helps
   - *After the exhausting hike, we were famished and ate everything in sight.*`,
        type: 'text',
        order: 3
      },
      {
        id: 'reading-exercise',
        title: 'Reading Practice',
        content: 'Read the following passage and answer the questions to test your comprehension.',
        type: 'interactive',
        order: 4,
        interactive: {
          type: 'quiz',
          data: {
            questions: [
              {
                question: 'What should you do before reading a text?',
                options: ['Summarize the main points', 'Preview and set purpose', 'Ask questions about details', 'Look up unfamiliar words'],
                correct: 1,
                explanation: 'Before reading, you should preview the text and set a purpose for reading.'
              },
              {
                question: 'What is the difference between topic and main idea?',
                options: ['Topic is longer than main idea', 'Main idea is one word, topic is a sentence', 'Topic is what text is about, main idea is what author says about topic', 'There is no difference'],
                correct: 2,
                explanation: 'Topic is what the paragraph is about, while main idea is what the author says about the topic.'
              },
              {
                question: 'Which context clue type provides a similar word?',
                options: ['Definition', 'Synonym', 'Antonym', 'Example'],
                correct: 1,
                explanation: 'Synonym context clues provide a similar word to help understand meaning.'
              }
            ]
          }
        }
      }
    ],
    content: `# Reading Comprehension

## Strategies
- Preview, set purpose, activate prior knowledge
- Monitor comprehension, ask questions, make connections
- Summarize, reflect, respond

## Main Idea vs Details
- Main idea: most important point
- Details: facts that support main idea

## Context Clues
- Definition, synonym, antonym, example, general sense`
  }
];

// Combine all materials by subject
export const sampleMaterialsBySubject = {
  'matematika': sampleMathMaterials,
  'fisika': samplePhysicsMaterials,
  'biologi': sampleBiologyMaterials,
  'bahasa-indonesia': sampleIndonesianMaterials,
  'kimia': [],
  'bahasa-inggris': sampleEnglishMaterials,
  'ips': sampleIPSMaterials,
  'ipa': sampleScienceMaterials
};

// Utility functions
export const getAllMaterials = (): Material[] => {
  return Object.values(sampleMaterialsBySubject).flat();
};

export const getMaterialsBySubject = (subjectId: string): Material[] => {
  return sampleMaterialsBySubject[subjectId as keyof typeof sampleMaterialsBySubject] || [];
};

export const getMaterialById = (materialId: string): Material | undefined => {
  const allMaterials = getAllMaterials();
  return allMaterials.find(material => material.id === materialId);
};