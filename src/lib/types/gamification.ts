import type { CustomAvatar } from './index';

// Gamification Types for Edu Ruang Platform

// User Roles
export type UserRole = 'guru' | 'murid';

// Enhanced User with Role
export interface EduRuangUser {
  id: string;
  name: string;
  username: string;
  class: string;
  avatar: string;
  points: number;
  level: number;
  joinDate: Date;
  lastActive: Date;
  role: UserRole;
  customAvatar?: CustomAvatar;
  avatarCollection?: AvatarItem[];
  activeAvatar?: ActiveAvatar;
  koinSekolah?: number;
}

// Avatar Collection System
export interface AvatarItem {
  id: string;
  name: string;
  category: 'hat' | 'clothing' | 'glasses' | 'accessory' | 'shoes';
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'exclusive';
  price?: number; // For shop items
  isOwned: boolean;
  isEquipped: boolean;
  unlockCondition?: string; // For items that need to be unlocked
  createdBy?: string; // For teacher-created items
  imageUrl?: string; // For custom images
}

export interface ActiveAvatar {
  hat?: string;
  clothing?: string;
  glasses?: string;
  accessory?: string;
  shoes?: string;
}

// Class System
export interface Class {
  id: string;
  name: string;
  subject: string;
  code: string;
  teacherId: string;
  studentIds: string[];
  createdAt: Date;
}

// Game System
export interface EducationalGame {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  subject: string;
  gameType: 'conventional' | 'educational_world';
  worldTheme?: WorldTheme;
  levels?: GameLevel[];
  createdAt: Date;
  updatedAt: Date;
}

export type WorldTheme = 'ipa' | 'ips' | 'matematika' | 'bahasa';

export interface GameLevel {
  id: string;
  levelNumber: number;
  title: string;
  description: string;
  questions?: Question[];
  challenges?: Challenge[];
  minScoreToPass: number;
  rewardItem?: string; // Avatar item reward
  rewardKoin?: number; // Koin sekolah reward
}

export interface Challenge {
  id: string;
  type: 'quiz' | 'puzzle' | 'matching' | 'drag_drop';
  data: any; // Specific to challenge type
}

// Question for Educational Games
export interface Question {
  id: string;
  levelId: string;
  question: string;
  type: 'multiple_choice' | 'fill_blank' | 'true_false' | 'essay';
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  points: number;
  timeLimit?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Progress Tracking
export interface StudentProgress {
  id: string;
  studentId: string;
  gameId: string;
  currentLevel: number;
  highestScore: number;
  rewardsReceived: string[];
  lastPlayed: Date;
}

// Transactions for Avatar Shop
export interface Transaction {
  id: string;
  userId: string;
  itemId: string;
  transactionType: 'purchase' | 'exchange' | 'gift';
  amount?: number; // For koin transactions
  date: Date;
}

// Leaderboard
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar: string;
  classId: string;
  highestLevel: number;
  totalRewards: number;
  totalKoin: number;
  rank: number;
}