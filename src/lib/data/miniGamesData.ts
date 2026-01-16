import type { MiniGame, MiniGameAchievement, CrosswordData, CrosswordClue } from '../types';

// Sample Mini-Games Data
export const sampleMiniGames: MiniGame[] = [
  // Crossword Games
  {
    id: 'crossword-biology-1',
    type: 'crossword',
    subjectId: 'biologi',
    title: 'Sistem Pencernaan',
    description: 'Teka-teki silang tentang organ dan proses pencernaan',
    difficulty: 'easy',
    basePoints: 100,
    timeLimit: 300, // 5 minutes
    data: {
      gridSize: 8,
      clues: [
        {
          id: 'c1',
          direction: 'across',
          clue: 'Organ yang memproduksi enzim pencernaan',
          answer: 'PANKREAS',
          startRow: 1,
          startCol: 1,
          hint: 'Organ di belakang lambung'
        },
        {
          id: 'c2',
          direction: 'down',
          clue: 'Kantong yang menyimpan empedu',
          answer: 'KANTUNG',
          startRow: 0,
          startCol: 3,
          hint: 'Terletak di bawah hati'
        },
        {
          id: 'c3',
          direction: 'across',
          clue: 'Bagian usus yang menyerap air',
          answer: 'KOLON',
          startRow: 4,
          startCol: 2,
          hint: 'Bagian dari usus besar'
        }
      ]
    }
  },

  // Picture Puzzle Games
  {
    id: 'puzzle-geography-1',
    type: 'picture_puzzle',
    subjectId: 'ips',
    title: 'Peta Indonesia',
    description: 'Susun puzzle peta kepulauan Indonesia',
    difficulty: 'medium',
    basePoints: 150,
    timeLimit: 600, // 10 minutes
    data: {
      completeImage: 'https://placehold.co/600x600/10b981/ffffff.png?text=Peta+Indonesia',
      description: 'Peta lengkap kepulauan Indonesia dengan batas provinsi yang jelas',
      pieces: [
        { id: '0', src: '/images/puzzles/piece-0.jpg', correctPosition: 0 },
        { id: '1', src: '/images/puzzles/piece-1.jpg', correctPosition: 1 },
        { id: '2', src: '/images/puzzles/piece-2.jpg', correctPosition: 2 },
        { id: '3', src: '/images/puzzles/piece-3.jpg', correctPosition: 3 },
        { id: '4', src: '/images/puzzles/piece-4.jpg', correctPosition: 4 },
        { id: '5', src: '/images/puzzles/piece-5.jpg', correctPosition: 5 },
        { id: '6', src: '/images/puzzles/piece-6.jpg', correctPosition: 6 },
        { id: '7', src: '/images/puzzles/piece-7.jpg', correctPosition: 7 },
        { id: '8', src: '/images/puzzles/piece-8.jpg', correctPosition: 8 }
      ]
    }
  },

  // Quick Quiz Games
  {
    id: 'quiz-math-rapid',
    type: 'quick_quiz',
    subjectId: 'matematika',
    title: 'Kuis Matematika Kilat',
    description: 'Jawab 10 soal matematika dalam waktu singkat',
    difficulty: 'medium',
    basePoints: 200,
    timeLimit: 300, // 5 minutes
    data: {
      questions: [
        {
          id: 'q1',
          subjectId: 'matematika',
          level: 1,
          question: 'Berapa hasil dari 15 × 8?',
          type: 'multiple_choice',
          options: ['120', '110', '130', '125'],
          correctAnswer: 0,
          explanation: '15 × 8 = 120',
          difficulty: 'easy',
          basePoints: 20,
          timeLimit: 30
        },
        {
          id: 'q2',
          subjectId: 'matematika',
          level: 1,
          question: 'Jika x + 5 = 12, maka x = ?',
          type: 'multiple_choice',
          options: ['6', '7', '8', '9'],
          correctAnswer: 1,
          explanation: 'x = 12 - 5 = 7',
          difficulty: 'easy',
          basePoints: 20,
          timeLimit: 30
        },
        {
          id: 'q3',
          subjectId: 'matematika',
          level: 1,
          question: 'Volume kubus dengan sisi 4 cm adalah?',
          type: 'multiple_choice',
          options: ['64 cm³', '48 cm³', '32 cm³', '16 cm³'],
          correctAnswer: 0,
          explanation: 'Volume = sisi³ = 4³ = 64 cm³',
          difficulty: 'medium',
          basePoints: 20,
          timeLimit: 30
        }
      ]
    }
  },

  // Drag and Drop Games
  {
    id: 'dragdrop-chemistry-1',
    type: 'drag_drop',
    subjectId: 'kimia',
    title: 'Klasifikasi Unsur',
    description: 'Kelompokkan unsur-unsur kimia berdasarkan golongannya',
    difficulty: 'hard',
    basePoints: 250,
    timeLimit: 480, // 8 minutes
    data: {
      instructions: 'Seret unsur-unsur berikut ke golongan yang tepat',
      categories: [
        {
          id: 'alkali',
          name: 'Logam Alkali',
          description: 'Golongan IA dalam tabel periodik'
        },
        {
          id: 'halogen',
          name: 'Halogen',
          description: 'Golongan VIIA dalam tabel periodik'
        },
        {
          id: 'noble',
          name: 'Gas Mulia',
          description: 'Golongan VIIIA dalam tabel periodik'
        }
      ],
      items: [
        {
          id: 'lithium',
          label: 'Li (Lithium)',
          correctCategory: 'alkali'
        },
        {
          id: 'sodium',
          label: 'Na (Sodium)',
          correctCategory: 'alkali'
        },
        {
          id: 'fluorine',
          label: 'F (Fluorine)',
          correctCategory: 'halogen'
        },
        {
          id: 'helium',
          label: 'He (Helium)',
          correctCategory: 'noble'
        },
        {
          id: 'chlorine',
          label: 'Cl (Chlorine)',
          correctCategory: 'halogen'
        },
        {
          id: 'neon',
          label: 'Ne (Neon)',
          correctCategory: 'noble'
        }
      ]
    }
  },

  // History Crossword
  {
    id: 'crossword-history-1',
    type: 'crossword',
    subjectId: 'sejarah',
    title: 'Kemerdekaan Indonesia',
    description: 'Teka-teki silang tentang perjuangan kemerdekaan Indonesia',
    difficulty: 'medium',
    basePoints: 150,
    timeLimit: 450, // 7.5 minutes
    data: {
      width: 10,
      height: 10,
      clues: [
        {
          id: 'h1',
          direction: 'across',
          number: 1,
          clue: 'Proklamator kemerdekaan Indonesia',
          answer: 'SOEKARNO',
          startRow: 2,
          startCol: 1,
          length: 8
        },
        {
          id: 'h2',
          direction: 'down',
          number: 2,
          clue: 'Tanggal proklamasi kemerdekaan',
          answer: 'TUJUHBELAS',
          startRow: 1,
          startCol: 4,
          length: 10
        },
        {
          id: 'h3',
          direction: 'across',
          number: 3,
          clue: 'Organisasi pemuda yang aktif dalam kemerdekaan',
          answer: 'PETA',
          startRow: 6,
          startCol: 3,
          length: 4
        }
      ],
      grid: [],
      solution: []
    }
  },

  // Language Drag-Drop
  {
    id: 'dragdrop-bahasa-1',
    type: 'drag_drop',
    subjectId: 'bahasa-indonesia',
    title: 'Jenis-jenis Kalimat',
    description: 'Kelompokkan kalimat berdasarkan jenisnya',
    difficulty: 'easy',
    basePoints: 120,
    timeLimit: 360, // 6 minutes
    data: {
      instruction: 'Seret kalimat-kalimat berikut ke kategori yang tepat',
      categories: [
        {
          id: 'berita',
          name: 'Kalimat Berita',
          description: 'Kalimat yang menyampaikan informasi',
          acceptedItems: ['berita1', 'berita2']
        },
        {
          id: 'tanya',
          name: 'Kalimat Tanya',
          description: 'Kalimat yang menanyakan sesuatu',
          acceptedItems: ['tanya1', 'tanya2']
        },
        {
          id: 'perintah',
          name: 'Kalimat Perintah',
          description: 'Kalimat yang memerintahkan',
          acceptedItems: ['perintah1', 'perintah2']
        }
      ],
      items: [
        {
          id: 'berita1',
          label: 'Hari ini cuaca sangat cerah.',
          content: 'Hari ini cuaca sangat cerah.',
          type: 'text',
          correctCategory: 'berita',
          categoryId: 'berita'
        },
        {
          id: 'tanya1',
          label: 'Kapan kamu akan datang?',
          content: 'Kapan kamu akan datang?',
          type: 'text',
          correctCategory: 'tanya',
          categoryId: 'tanya'
        },
        {
          id: 'perintah1',
          label: 'Tolong tutup pintu itu!',
          content: 'Tolong tutup pintu itu!',
          type: 'text',
          correctCategory: 'perintah',
          categoryId: 'perintah'
        },
        {
          id: 'berita2',
          label: 'Ayah sedang membaca koran.',
          content: 'Ayah sedang membaca koran.',
          type: 'text',
          correctCategory: 'berita',
          categoryId: 'berita'
        },
        {
          id: 'tanya2',
          label: 'Dimana kamu meletakkan buku itu?',
          content: 'Dimana kamu meletakkan buku itu?',
          type: 'text',
          correctCategory: 'tanya',
          categoryId: 'tanya'
        },
        {
          id: 'perintah2',
          label: 'Jangan lupa mengerjakan PR!',
          content: 'Jangan lupa mengerjakan PR!',
          type: 'text',
          correctCategory: 'perintah',
          categoryId: 'perintah'
        }
      ]
    }
  },

  // Indonesian Geography Drag-Drop Game
  {
    id: 'dragdrop-geography-indonesia',
    type: 'drag_drop',
    subjectId: 'ips',
    title: 'Provinsi Indonesia',
    description: 'Kelompokkan ibu kota provinsi ke provinsi yang tepat',
    difficulty: 'medium',
    basePoints: 200,
    timeLimit: 480, // 8 minutes
    data: {
      instructions: 'Seret ibu kota berikut ke provinsi yang tepat',
      categories: [
        {
          id: 'aceh',
          name: 'Aceh',
          description: 'Provinsi paling barat di Indonesia'
        },
        {
          id: 'sumatera-utara',
          name: 'Sumatera Utara',
          description: 'Provinsi dengan ibu kota Medan'
        },
        {
          id: 'jawa-barat',
          name: 'Jawa Barat',
          description: 'Provinsi dengan ibu kota Bandung'
        },
        {
          id: 'jawa-tengah',
          name: 'Jawa Tengah',
          description: 'Provinsi dengan ibu kota Semarang'
        },
        {
          id: 'jawa-timur',
          name: 'Jawa Timur',
          description: 'Provinsi dengan ibu kota Surabaya'
        },
        {
          id: 'kalimantan-barat',
          name: 'Kalimantan Barat',
          description: 'Provinsi dengan ibu kota Pontianak'
        },
        {
          id: 'sulawesi-selatan',
          name: 'Sulawesi Selatan',
          description: 'Provinsi dengan ibu kota Makassar'
        },
        {
          id: 'papua',
          name: 'Papua',
          description: 'Provinsi paling timur di Indonesia'
        },
        {
          id: 'bali',
          name: 'Bali',
          description: 'Provinsi dengan ibu kota Denpasar'
        },
        {
          id: 'sumatera-selatan',
          name: 'Sumatera Selatan',
          description: 'Provinsi dengan ibu kota Palembang'
        }
      ],
      items: [
        {
          id: 'banda-aceh',
          label: 'Banda Aceh',
          correctCategory: 'aceh'
        },
        {
          id: 'medan',
          label: 'Medan',
          correctCategory: 'sumatera-utara'
        },
        {
          id: 'bandung',
          label: 'Bandung',
          correctCategory: 'jawa-barat'
        },
        {
          id: 'semarang',
          label: 'Semarang',
          correctCategory: 'jawa-tengah'
        },
        {
          id: 'surabaya',
          label: 'Surabaya',
          correctCategory: 'jawa-timur'
        },
        {
          id: 'pontianak',
          label: 'Pontianak',
          correctCategory: 'kalimantan-barat'
        },
        {
          id: 'makassar',
          label: 'Makassar',
          correctCategory: 'sulawesi-selatan'
        },
        {
          id: 'jayapura',
          label: 'Jayapura',
          correctCategory: 'papua'
        },
        {
          id: 'denpasar',
          label: 'Denpasar',
          correctCategory: 'bali'
        },
        {
          id: 'palembang',
          label: 'Palembang',
          correctCategory: 'sumatera-selatan'
        }
      ]
    }
  }
];

// Sample Achievements for Mini-Games
export const sampleMiniGameAchievements: MiniGameAchievement[] = [
  {
    id: 'crossword-master',
    title: 'Master Teka-teki Silang',
    description: 'Selesaikan 10 teka-teki silang',
    icon: '🧩',
    type: 'crossword',
    requirement: {
      type: 'completion',
      value: 10
    },
    reward: {
      basePoints: 500,
      badge: 'crossword-expert',
      accessory: 'thinking-cap'
    }
  },
  {
    id: 'puzzle-speedster',
    title: 'Ahli Puzzle Cepat',
    description: 'Selesaikan puzzle gambar dalam waktu kurang dari 3 menit',
    icon: '⚡',
    type: 'picture_puzzle',
    requirement: {
      type: 'speed',
      value: 180 // 3 minutes in seconds
    },
    reward: {
      basePoints: 300,
      badge: 'speed-puzzle',
      accessory: 'lightning-glasses'
    }
  },
  {
    id: 'quiz-machine',
    title: 'Mesin Kuis',
    description: 'Jawab 100 soal kuis kilat dengan benar',
    icon: '🎯',
    type: 'quick_quiz',
    requirement: {
      type: 'completion',
      value: 100
    },
    reward: {
      basePoints: 1000,
      badge: 'quiz-legend',
      accessory: 'golden-glasses'
    }
  },
  {
    id: 'dragdrop-genius',
    title: 'Genius Drag & Drop',
    description: 'Raih skor sempurna dalam 5 permainan drag & drop',
    icon: '🎮',
    type: 'drag_drop',
    requirement: {
      type: 'score',
      value: 250 // Perfect score for drag-drop games
    },
    reward: {
      basePoints: 750,
      badge: 'perfect-organizer',
      accessory: 'organizer-badge'
    }
  },
  {
    id: 'weekly-champion',
    title: 'Juara Mingguan',
    description: 'Raih posisi #1 di leaderboard mingguan',
    icon: '👑',
    type: 'general',
    requirement: {
      type: 'completion',
      value: 1
    },
    reward: {
      basePoints: 1500,
      badge: 'weekly-crown',
      accessory: 'champion-crown'
    }
  },
  {
    id: 'streak-master',
    title: 'Master Beruntun',
    description: 'Menangkan 7 mini-game berturut-turut',
    icon: '🔥',
    type: 'general',
    requirement: {
      type: 'streak',
      value: 7
    },
    reward: {
      basePoints: 800,
      badge: 'fire-streak',
      accessory: 'flame-aura'
    }
  }
];

// Utility function to initialize mini-games data in localStorage
export function initializeMiniGamesData() {
  if (typeof window === 'undefined') return;

  // Initialize mini-games if not exists
  const existingGames = localStorage.getItem('edu-ruang-mini-games');
  if (!existingGames) {
    localStorage.setItem('edu-ruang-mini-games', JSON.stringify(sampleMiniGames));
  }

  // Initialize achievements if not exists
  const existingAchievements = localStorage.getItem('edu-ruang-minigame-achievements');
  if (!existingAchievements) {
    localStorage.setItem('edu-ruang-minigame-achievements', JSON.stringify(sampleMiniGameAchievements));
  }
}

// Generate crossword grid and solution
export function generateCrosswordGrid(data: CrosswordData): { grid: (string | null)[][], solution: string[][] } {
  const { width, height, clues } = data;
  const gridHeight = height || 10;
  const gridWidth = width || 10;
  const grid: (string | null)[][] = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(null));
  const solution: string[][] = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(''));

  clues.forEach((clue: CrosswordClue) => {
    const { answer, startRow, startCol, direction } = clue;

    for (let i = 0; i < answer.length; i++) {
      const row = direction === 'across' ? startRow : startRow + i;
      const col = direction === 'across' ? startCol + i : startCol;

      if (row < gridHeight && col < gridWidth) {
        solution[row][col] = answer[i];
        grid[row][col] = ''; // Empty cell for player input
      }
    }
  });

  return { grid, solution };
}

// Generate puzzle pieces for picture puzzle
export function generatePuzzlePieces(rows: number, cols: number): any[] {
  const pieces = [];
  const pieceWidth = 100 / cols;
  const pieceHeight = 100 / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        id: `piece-${row}-${col}`,
        correctPosition: { row, col },
        imageSection: {
          x: col * pieceWidth,
          y: row * pieceHeight,
          width: pieceWidth,
          height: pieceHeight
        }
      });
    }
  }

  // Shuffle pieces
  return pieces.sort(() => Math.random() - 0.5);
}