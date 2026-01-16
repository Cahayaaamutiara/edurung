// User types
export interface User {
  id: string;
  name: string;
  username: string;
  class: string;
  avatar: string;
  points: number;
  level: number;
  joinDate: Date;
  lastActive: Date;
  customAvatar?: CustomAvatar;
}

export interface CustomAvatar {
  id: string;
  type: 'preset' | 'custom';
  baseAvatar: string;
  accessories: AvatarAccessory[];
  colors: {
    hair: string;
    skin: string;
    clothing: string;
  };
  unlocked: boolean;
}

export interface AvatarAccessory {
  id: string;
  type: 'hat' | 'glasses' | 'background' | 'pet';
  name: string;
  icon: string;
  unlockLevel: number;
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Game types
export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  totalQuestions: number;
  completedQuestions: number;
}

export interface Question {
  id: string;
  subjectId: string;
  level: number;
  question: string;
  type: 'multiple_choice' | 'fill_blank' | 'true_false' | 'essay' | 'crossword' | 'picture_puzzle' | 'drag_drop';
  options?: string[]; // For multiple choice and true/false
  correctAnswer: number | string | string[]; // Index for MC, string for fill_blank, array for drag_drop
  explanation: string;
  basePoints: number; // Changed from 'points' to 'basePoints' to match data structure
  timeLimit?: number; // in seconds
  hints?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  // Mini-game specific properties
  crosswordData?: CrosswordData;
  puzzleImage?: string;
  dragDropItems?: DragDropItem[];
}

export interface GameSession {
  id: string;
  userId: string;
  subjectId: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: (number | string)[]; // Support both numeric indices and string answers
  score: number;
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
  timeSpent: number[]; // Time spent on each question
  hintsUsed: number; // Number of hints used
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: Date;
}

// Discussion types
export interface DiscussionPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  subjectId: string;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  replies: DiscussionReply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscussionReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  postId: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  type: 'achievement' | 'discussion' | 'challenge' | 'level_up';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  level: number;
  achievements: number;
}

// Stats types
export interface UserStats {
  totalGamesPlayed: number;
  averageScore: number;
  bestSubject: string;
  currentStreak: number;
  longestStreak: number;
  totalDiscussions: number;
  totalReplies: number;
  totalLikes: number;
}

// Material types
export interface Material {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  content?: string; // Legacy support for simple text content
  sections?: MaterialSection[]; // New structured content sections
  level: 'basic' | 'intermediate' | 'advanced';
  duration: number; // estimated reading time in minutes
  tags: string[];
  prerequisites?: string[]; // IDs of other materials that should be read first
  createdAt: Date;
  updatedAt: Date;
  order: number; // for ordering materials within a subject
  thumbnail?: string; // Cover image for the material
  objectives?: string[]; // Learning objectives
  summary?: string; // Material summary
  downloadable?: boolean; // Whether the material can be downloaded
  bookmarkable?: boolean; // Whether the material can be bookmarked
}

export interface MaterialSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'formula' | 'example' | 'interactive' | 'quiz' | 'tip';
  order: number;
  media?: MediaContent;
  interactive?: InteractiveContent;
  studyTip?: string;
}

export interface MediaContent {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  alt?: string; // For images
  caption?: string;
  duration?: number; // For videos/audio in seconds
  thumbnail?: string; // For videos
  captionsUrl?: string; // For video accessibility captions
}

export interface InteractiveContent {
  type: 'quiz' | 'exercise' | 'simulation' | 'calculator';
  data: any; // Specific data for each interactive type
}

export interface MaterialProgress {
  materialId: string;
  userId: string;
  isCompleted: boolean;
  timeSpent: number; // in minutes
  lastAccessedAt: Date;
  completedAt?: Date;
  currentSection?: string; // Current section being read
  sectionsCompleted?: string[]; // Array of completed section IDs
  readingProgress?: number; // Percentage of material read (0-100)
  bookmarked?: boolean; // Whether user bookmarked this material
  notes?: string; // User's personal notes
  highlights?: MaterialHighlight[]; // User's highlights
}

export interface MaterialHighlight {
  id: string;
  sectionId: string;
  text: string;
  color: 'yellow' | 'green' | 'blue' | 'pink' | 'purple';
  note?: string;
  createdAt: Date;
}

export interface MaterialBookmark {
  id: string;
  materialId: string;
  userId: string;
  title: string;
  section?: string;
  createdAt: Date;
  notes?: string;
}

export interface StudySession {
  id: string;
  userId: string;
  materialId: string;
  startTime: Date;
  endTime?: Date;
  sectionsRead: string[];
  timeSpentPerSection: { [sectionId: string]: number };
  focusScore: number; // 0-100, based on reading behavior
}

// Re-export feature checker types - DISABLED
// Feature checker module has been disabled to simplify the system
// export type { 
//   FeatureDefinition, 
//   FeatureStatus, 
//   FeatureReport, 
//   ComponentRequirement,
//   RouteRequirement,
//   StoreRequirement,
//   Recommendation 
// } from './featureChecker';

// Study modes for enhanced learning experience
export interface StudyMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: {
    highlightingEnabled: boolean;
    notesEnabled: boolean;
    progressTracking: boolean;
    timeTracking: boolean;
    focusMode: boolean;
    autoBookmark: boolean;
  };
}

// Mini-Game Types
export interface MiniGame {
  id: string;
  type: 'crossword' | 'picture_puzzle' | 'quick_quiz' | 'drag_drop';
  subjectId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  basePoints: number;
  timeLimit?: number; // in seconds
  data: CrosswordData | PicturePuzzleData | QuickQuizData | DragDropData;
  // UI display properties
  rating?: number; // Game rating (e.g., 4.5)
  duration?: number; // Estimated play duration in minutes
  thumbnail?: string | null; // Cover image URL
  playedCount?: number; // Number of times the game has been played
}

export interface CrosswordData {
  gridSize?: number; // Optional for backward compatibility
  width?: number; // Added width property for crossword grid
  height?: number; // Added height property for crossword grid
  clues: CrosswordClue[];
  grid?: (string | null)[][]; // Added grid property for crossword state
  solution?: string[][]; // Added solution property for crossword answers
}

export interface CrosswordClue {
  id: string;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
  hint?: string;
  number?: number; // Added number property for crossword clue numbering
  length?: number; // Added length property for crossword grid
}

export interface PicturePuzzleData {
  completeImage: string;
  pieces: PicturePiece[];
  description: string;
}

export interface PicturePiece {
  id: string;
  src: string;
  correctPosition: number;
}

export interface QuickQuizData {
  questions: Question[];
}

export interface DragDropData {
  instructions?: string; // Made instructions optional for backward compatibility
  instruction?: string; // Added instruction property as alternative
  categories: DragDropCategory[];
  items: DragDropItem[];
}

export interface DragDropCategory {
  id: string;
  name: string;
  description?: string;
  acceptedItems?: string[]; // Added acceptedItems for category validation
}

export interface DragDropItem {
  id: string;
  label: string;
  image?: string;
  correctCategory: string;
  isCorrect?: boolean;
  content?: string; // Added content property for text-based drag-drop items
  type?: string; // Added type property to specify item type
  categoryId?: string; // Added categoryId for item categorization
}

export interface MiniGameSession {
  id: string;
  userId: string;
  gameId: string;
  gameType: 'crossword' | 'picture_puzzle' | 'quick_quiz' | 'drag_drop';
  startTime: Date;
  endTime?: Date;
  score: number;
  isCompleted: boolean;
  progress: any; // Game-specific progress data
  hintsUsed: number;
  timeSpent: number;
}

export interface WeeklyLeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  class: string;
  rank: number;
  totalScore: number;
  gamesPlayed: number;
  averageScore: number;
}

export interface MiniGameAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'crossword' | 'picture_puzzle' | 'quick_quiz' | 'drag_drop' | 'general';
  requirement: {
    type: 'score' | 'completion' | 'streak' | 'speed';
    value: number;
  };
  reward: {
    basePoints: number; // Changed from 'points' to 'basePoints' to match data structure
    badge?: string;
    accessory?: string;
  };
}