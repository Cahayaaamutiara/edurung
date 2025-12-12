import type { CustomAvatar, AvatarAccessory } from '../types';

// Preset Avatars - Enhanced versions
export const presetAvatars = [
  {
    id: 'student-1',
    name: 'Alex si Rajin',
    description: 'Siswa yang selalu semangat belajar',
    icon: '👨‍🎓',
    unlockLevel: 1,
    rarity: 'common' as const
  },
  {
    id: 'student-2', 
    name: 'Bella si Kreatif',
    description: 'Suka seni dan musik',
    icon: '👩‍🎨',
    unlockLevel: 1,
    rarity: 'common' as const
  },
  {
    id: 'student-3',
    name: 'Charlie si Sains',
    description: 'Ahli dalam bidang sains',
    icon: '👨‍🔬',
    unlockLevel: 1,
    rarity: 'common' as const
  },
  {
    id: 'student-4',
    name: 'Diana si Olahraga',
    description: 'Atlet dan siswa berprestasi',
    icon: '🏃‍♀️',
    unlockLevel: 1,
    rarity: 'common' as const
  },
  {
    id: 'student-5',
    name: 'Eddie si Teknologi',
    description: 'Master programmer muda',
    icon: '👨‍💻',
    unlockLevel: 5,
    rarity: 'rare' as const
  },
  {
    id: 'student-6',
    name: 'Fiona si Matematika',
    description: 'Jenius matematika',
    icon: '👩‍🏫',
    unlockLevel: 5,
    rarity: 'rare' as const
  },
  {
    id: 'student-7',
    name: 'George si Leader',
    description: 'Pemimpin dan motivator',
    icon: '👨‍💼',
    unlockLevel: 10,
    rarity: 'epic' as const
  },
  {
    id: 'student-8',
    name: 'Hannah si Genius',
    description: 'Siswa super jenius',
    icon: '👩‍🎓',
    unlockLevel: 15,
    rarity: 'legendary' as const
  },
  {
    id: 'wizard-student',
    name: 'Wizard Pembelajar',
    description: 'Master semua ilmu pengetahuan',
    icon: '🧙‍♂️',
    unlockLevel: 20,
    rarity: 'legendary' as const
  },
  {
    id: 'robot-helper',
    name: 'AI Study Buddy',
    description: 'Asisten belajar robot',
    icon: '🤖',
    unlockLevel: 25,
    rarity: 'legendary' as const
  }
];

// Avatar Accessories
export const avatarAccessories: AvatarAccessory[] = [
  // Hats
  {
    id: 'graduation-cap',
    type: 'hat',
    name: 'Topi Wisuda',
    icon: '🎓',
    unlockLevel: 1,
    isUnlocked: true,
    rarity: 'common'
  },
  {
    id: 'baseball-cap',
    type: 'hat', 
    name: 'Topi Baseball',
    icon: '🧢',
    unlockLevel: 3,
    isUnlocked: false,
    rarity: 'common'
  },
  {
    id: 'crown',
    type: 'hat',
    name: 'Mahkota Raja',
    icon: '👑',
    unlockLevel: 15,
    isUnlocked: false,
    rarity: 'legendary'
  },
  {
    id: 'wizard-hat',
    type: 'hat',
    name: 'Topi Wizard',
    icon: '🎩',
    unlockLevel: 20,
    isUnlocked: false,
    rarity: 'epic'
  },

  // Glasses
  {
    id: 'regular-glasses',
    type: 'glasses',
    name: 'Kacamata Biasa',
    icon: '👓',
    unlockLevel: 1,
    isUnlocked: true,
    rarity: 'common'
  },
  {
    id: 'sunglasses',
    type: 'glasses',
    name: 'Kacamata Hitam',
    icon: '🕶️',
    unlockLevel: 7,
    isUnlocked: false,
    rarity: 'rare'
  },
  {
    id: 'smart-glasses',
    type: 'glasses',
    name: 'Smart Glasses',
    icon: '🤓',
    unlockLevel: 12,
    isUnlocked: false,
    rarity: 'epic'
  },

  // Backgrounds
  {
    id: 'classroom',
    type: 'background',
    name: 'Ruang Kelas',
    icon: '🏫',
    unlockLevel: 1,
    isUnlocked: true,
    rarity: 'common'
  },
  {
    id: 'library',
    type: 'background',
    name: 'Perpustakaan',
    icon: '📚',
    unlockLevel: 5,
    isUnlocked: false,
    rarity: 'rare'
  },
  {
    id: 'space',
    type: 'background',
    name: 'Luar Angkasa',
    icon: '🌌',
    unlockLevel: 18,
    isUnlocked: false,
    rarity: 'epic'
  },
  {
    id: 'laboratory',
    type: 'background', 
    name: 'Laboratorium',
    icon: '🧪',
    unlockLevel: 10,
    isUnlocked: false,
    rarity: 'rare'
  },

  // Pets
  {
    id: 'book-worm',
    type: 'pet',
    name: 'Ulat Buku',
    icon: '🐛',
    unlockLevel: 8,
    isUnlocked: false,
    rarity: 'rare'
  },
  {
    id: 'owl',
    type: 'pet',
    name: 'Burung Hantu Bijak',
    icon: '🦉',
    unlockLevel: 12,
    isUnlocked: false,
    rarity: 'epic'
  },
  {
    id: 'dragon',
    type: 'pet',
    name: 'Naga Pengetahuan',
    icon: '🐉',
    unlockLevel: 25,
    isUnlocked: false,
    rarity: 'legendary'
  }
];

// Color palettes for customization
export const avatarColors = {
  hair: [
    { name: 'Hitam', value: '#2C1810', unlockLevel: 1 },
    { name: 'Coklat', value: '#8B4513', unlockLevel: 1 },
    { name: 'Pirang', value: '#FFD700', unlockLevel: 3 },
    { name: 'Merah', value: '#DC143C', unlockLevel: 5 },
    { name: 'Biru', value: '#1E90FF', unlockLevel: 10 },
    { name: 'Ungu', value: '#9370DB', unlockLevel: 15 },
    { name: 'Pink', value: '#FF69B4', unlockLevel: 8 },
    { name: 'Hijau', value: '#32CD32', unlockLevel: 12 }
  ],
  skin: [
    { name: 'Terang', value: '#FDBCB4', unlockLevel: 1 },
    { name: 'Medium', value: '#E8A968', unlockLevel: 1 },
    { name: 'Gelap', value: '#A0522D', unlockLevel: 1 },
    { name: 'Olive', value: '#BDB76B', unlockLevel: 1 },
    { name: 'Robot', value: '#C0C0C0', unlockLevel: 20 },
    { name: 'Alien', value: '#90EE90', unlockLevel: 25 }
  ],
  clothing: [
    { name: 'Biru', value: '#4169E1', unlockLevel: 1 },
    { name: 'Merah', value: '#DC143C', unlockLevel: 1 },
    { name: 'Hijau', value: '#228B22', unlockLevel: 1 },
    { name: 'Ungu', value: '#8A2BE2', unlockLevel: 3 },
    { name: 'Orange', value: '#FF8C00', unlockLevel: 5 },
    { name: 'Pink', value: '#FF1493', unlockLevel: 7 },
    { name: 'Emas', value: '#FFD700', unlockLevel: 15 },
    { name: 'Perak', value: '#C0C0C0', unlockLevel: 12 }
  ]
};

// Rarity colors for UI
export const rarityColors = {
  common: '#9CA3AF',
  rare: '#3B82F6', 
  epic: '#8B5CF6',
  legendary: '#F59E0B'
};

// Achievement-based unlocks
export const avatarAchievements = [
  {
    id: 'first-perfect-score',
    name: 'Skor Sempurna Pertama',
    description: 'Dapatkan skor 100% dalam satu kuis',
    reward: 'sunglasses',
    type: 'accessory'
  },
  {
    id: 'quiz-master',
    name: 'Master Kuis',
    description: 'Selesaikan 50 kuis',
    reward: 'crown',
    type: 'accessory'
  },
  {
    id: 'discussion-hero',
    name: 'Pahlawan Diskusi',
    description: 'Buat 25 post diskusi',
    reward: 'wizard-hat',
    type: 'accessory'
  },
  {
    id: 'knowledge-seeker',
    name: 'Pencari Ilmu',
    description: 'Kumpulkan 10.000 poin',
    reward: 'dragon',
    type: 'pet'
  }
];

// Utility functions
export function getUnlockedAvatars(userLevel: number) {
  return presetAvatars.filter(avatar => avatar.unlockLevel <= userLevel);
}

export function getUnlockedAccessories(userLevel: number) {
  return avatarAccessories.map(accessory => ({
    ...accessory,
    isUnlocked: accessory.unlockLevel <= userLevel
  }));
}

export function getUnlockedColors(userLevel: number, type: keyof typeof avatarColors) {
  return avatarColors[type].filter(color => color.unlockLevel <= userLevel);
}

export function getRarityColor(rarity: keyof typeof rarityColors) {
  return rarityColors[rarity];
}

// Create default avatar for new users
export function createDefaultAvatar(): CustomAvatar {
  return {
    id: 'default-' + Date.now(),
    type: 'preset',
    baseAvatar: 'student-1',
    accessories: [{
      id: 'graduation-cap',
      type: 'hat',
      name: 'Topi Wisuda',
      icon: '🎓',
      unlockLevel: 1,
      isUnlocked: true,
      rarity: 'common'
    }],
    colors: {
      hair: '#2C1810',
      skin: '#FDBCB4', 
      clothing: '#4169E1'
    },
    unlocked: true
  };
}

// Legacy avatar compatibility
export const availableAvatars = presetAvatars.map(avatar => avatar.id);