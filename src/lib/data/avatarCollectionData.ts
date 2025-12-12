import type { AvatarItem } from '../types/gamification';

// Avatar Collection Items for Edu Ruang Platform

// Hats
export const hatItems: AvatarItem[] = [
  {
    id: 'topi-lab',
    name: 'Topi Lab',
    category: 'hat',
    description: 'Topi khusus untuk Dunia IPA',
    rarity: 'common',
    price: 50,
    isOwned: false,
    isEquipped: false,
    unlockCondition: 'Complete IPA Level 1'
  },
  {
    id: 'topi-petualang',
    name: 'Topi Petualang',
    category: 'hat',
    description: 'Topi untuk para petualang ilmu',
    rarity: 'common',
    price: 75,
    isOwned: false,
    isEquipped: false
  },
  {
    id: 'topi-matematika',
    name: 'Topi Matematika',
    category: 'hat',
    description: 'Topi khusus untuk ahli matematika',
    rarity: 'rare',
    price: 150,
    isOwned: false,
    isEquipped: false,
    unlockCondition: 'Complete Matematika Level 2'
  },
  {
    id: 'mahkota-juara-ipa',
    name: 'Mahkota Juara IPA',
    category: 'hat',
    description: 'Mahkota eksklusif untuk juara IPA',
    rarity: 'exclusive',
    isOwned: false,
    isEquipped: false,
    createdBy: 'teacher'
  },
  {
    id: 'pin-hari-pahlawan',
    name: 'Pin Hari Pahlawan',
    category: 'hat',
    description: 'Pin peringatan Hari Pahlawan',
    rarity: 'exclusive',
    isOwned: false,
    isEquipped: false,
    createdBy: 'teacher'
  }
];

// Clothing
export const clothingItems: AvatarItem[] = [
  {
    id: 'jas-putih',
    name: 'Jas Putih',
    category: 'clothing',
    description: 'Jas laboratorium untuk eksperimen',
    rarity: 'common',
    price: 100,
    isOwned: false,
    isEquipped: false,
    unlockCondition: 'Complete IPA Level 2'
  },
  {
    id: 'seragam-ips',
    name: 'Seragam IPS',
    category: 'clothing',
    description: 'Seragam khusus untuk Dunia IPS',
    rarity: 'common',
    price: 120,
    isOwned: false,
    isEquipped: false
  },
  {
    id: 'baju-bahasa',
    name: 'Baju Bahasa',
    category: 'clothing',
    description: 'Baju khusus untuk ahli bahasa',
    rarity: 'rare',
    price: 200,
    isOwned: false,
    isEquipped: false,
    unlockCondition: 'Complete Bahasa Level 3'
  },
  {
    id: 'seragam-olimpiade-matematika',
    name: 'Seragam Olimpiade Matematika',
    category: 'clothing',
    description: 'Seragam eksklusif peserta olimpiade',
    rarity: 'exclusive',
    isOwned: false,
    isEquipped: false,
    createdBy: 'teacher'
  }
];

// Glasses
export const glassesItems: AvatarItem[] = [
  {
    id: 'kacamata-sains',
    name: 'Kacamata Sains',
    category: 'glasses',
    description: 'Kacamata khusus untuk penggemar sains',
    rarity: 'common',
    price: 80,
    isOwned: false,
    isEquipped: false,
    unlockCondition: 'Complete IPA Level 1'
  },
  {
    id: 'kalung-sejarah',
    name: 'Kalung Sejarah',
    category: 'glasses',
    description: 'Kalung khusus untuk ahli sejarah',
    rarity: 'rare',
    price: 180,
    isOwned: false,
    isEquipped: false,
    unlockCondition: 'Complete IPS Level 2'
  },
  {
    id: 'pena-emas',
    name: 'Pena Emas',
    category: 'glasses',
    description: 'Pena eksklusif untuk penulis hebat',
    rarity: 'exclusive',
    isOwned: false,
    isEquipped: false,
    createdBy: 'teacher'
  }
];

// Shoes
export const shoesItems: AvatarItem[] = [
  {
    id: 'sneakers-ilmu',
    name: 'Sneakers Ilmu',
    category: 'shoes',
    description: 'Sepatu khusus untuk para pencari ilmu',
    rarity: 'common',
    price: 90,
    isOwned: false,
    isEquipped: false
  },
  {
    id: 'sepatu-angka',
    name: 'Sepatu Angka',
    category: 'shoes',
    description: 'Sepatu khusus untuk ahli matematika',
    rarity: 'rare',
    price: 160,
    isOwned: false,
    isEquipped: false,
    unlockCondition: 'Complete Matematika Level 3'
  }
];

// All avatar items combined
export const allAvatarItems: AvatarItem[] = [
  ...hatItems,
  ...clothingItems,
  ...glassesItems,
  ...shoesItems
];

// Utility function to get items by category
export function getItemsByCategory(category: string): AvatarItem[] {
  return allAvatarItems.filter(item => item.category === category);
}

// Utility function to get items by rarity
export function getItemsByRarity(rarity: string): AvatarItem[] {
  return allAvatarItems.filter(item => item.rarity === rarity);
}

// Utility function to get exclusive items
export function getExclusiveItems(): AvatarItem[] {
  return allAvatarItems.filter(item => item.rarity === 'exclusive');
}