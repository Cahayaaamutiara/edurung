import { writable } from 'svelte/store';
import type { 
  MiniGame, 
  MiniGameSession, 
  WeeklyLeaderboardEntry 
} from '../types';
import { sampleMiniGames } from '$lib/data/miniGamesData';

// Mini-games state
export const availableMiniGames = writable<MiniGame[]>([]);
export const currentMiniGame = writable<MiniGame | null>(null);
export const miniGameStore = writable({
  games: [] as MiniGame[],
  currentSession: null as MiniGameSession | null,
  userStats: {
    totalGamesPlayed: 0,
    totalScore: 0,
    averageScore: 0,
    gamesCompletedThisWeek: 0,
    currentStreak: 0,
    longestStreak: 0,
    favoriteGameType: '',
    achievementsUnlocked: 0
  },
  weeklyLeaderboard: [] as WeeklyLeaderboardEntry[]
});

// Export individual stores for easier access
export const games = writable<MiniGame[]>([]);
export const stats = writable({
  totalGamesPlayed: 0,
  totalScore: 0,
  averageScore: 0,
  gamesCompletedThisWeek: 0,
  currentStreak: 0,
  longestStreak: 0,
  favoriteGameType: '',
  achievementsUnlocked: 0
});

// Mini-games functions
export const miniGameFunctions = {
  /**
   * Get a mini-game by ID
   */
  getMiniGameById: (gameId: string): MiniGame | undefined => {
    // For now, return from sample data
    return sampleMiniGames.find(game => game.id === gameId);
  },

  /**
   * Load mini-games data
   */
  loadMiniGames: () => {
    // Load from localStorage or use sample data
    const storedGames = localStorage.getItem('edu-ruang-mini-games');
    if (storedGames) {
      try {
        const parsed = JSON.parse(storedGames);
        games.set(parsed);
      } catch {
        games.set(sampleMiniGames);
      }
    } else {
      games.set(sampleMiniGames);
      localStorage.setItem('edu-ruang-mini-games', JSON.stringify(sampleMiniGames));
    }
  },

  /**
   * Load user stats
   */
  loadUserStats: () => {
    const storedStats = localStorage.getItem('edu-ruang-minigame-stats');
    if (storedStats) {
      try {
        const parsed = JSON.parse(storedStats);
        stats.set(parsed);
      } catch {
        // Keep default stats
      }
    }
  },

  /**
   * Complete a mini-game
   */
  completeMiniGame: (gameId: string, score: number, timeSpent: number, hintsUsed: number) => {
    // Update stats
    stats.update(currentStats => {
      const newStats = {
        ...currentStats,
        totalGamesPlayed: currentStats.totalGamesPlayed + 1,
        totalScore: currentStats.totalScore + score,
        averageScore: Math.round((currentStats.totalScore + score) / (currentStats.totalGamesPlayed + 1)),
        gamesCompletedThisWeek: currentStats.gamesCompletedThisWeek + 1
      };
      
      // Save to localStorage
      localStorage.setItem('edu-ruang-minigame-stats', JSON.stringify(newStats));
      
      return newStats;
    });

    // Save game session
    const session = {
      gameId,
      score,
      timeSpent,
      hintsUsed,
      completedAt: new Date().toISOString()
    };
    
    const sessions = JSON.parse(localStorage.getItem('edu-ruang-minigame-sessions') || '[]');
    sessions.push(session);
    localStorage.setItem('edu-ruang-minigame-sessions', JSON.stringify(sessions));
  },

  /**
   * Get weekly leaderboard
   */
  getWeeklyLeaderboard: (): WeeklyLeaderboardEntry[] => {
    // Mock leaderboard data for now
    return [
      {
        userId: 'user-1',
        name: 'Ahmad Rizki',
        avatar: 'student-1',
        class: 'XII IPA 1',
        rank: 1,
        totalScore: 1450,
        gamesPlayed: 15,
        averageScore: 97
      },
      {
        userId: 'user-2',
        name: 'Siti Nurhaliza',
        avatar: 'student-2',
        class: 'XII IPA 2', 
        rank: 2,
        totalScore: 1320,
        gamesPlayed: 12,
        averageScore: 110
      },
      {
        userId: 'user-3',
        name: 'Budi Santoso',
        avatar: 'student-3',
        class: 'XII IPS 1',
        rank: 3,
        totalScore: 1280,
        gamesPlayed: 14,
        averageScore: 91
      },
      {
        userId: 'user-4',
        name: 'Diana Putri',
        avatar: 'student-4',
        class: 'XII IPA 1',
        rank: 4,
        totalScore: 1150,
        gamesPlayed: 11,
        averageScore: 105
      },
      {
        userId: 'user-5',
        name: 'Eko Prasetyo',
        avatar: 'student-5',
        class: 'XII IPS 2',
        rank: 5,
        totalScore: 1080,
        gamesPlayed: 13,
        averageScore: 83
      }
    ];
  },

  /**
   * Load weekly leaderboard
   */
  loadWeeklyLeaderboard: () => {
    // For now, just return the mock data
    // In a real app, this would fetch from an API
  }
};

// Initialize data on module load
if (typeof window !== 'undefined') {
  miniGameFunctions.loadMiniGames();
  miniGameFunctions.loadUserStats();
}
