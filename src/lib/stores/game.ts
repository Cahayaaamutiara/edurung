import { writable } from 'svelte/store';
import type { GameSession, Subject, Question } from '../types';

// Game state
export const currentGameSession = writable<GameSession | null>(null);
export const subjects = writable<Subject[]>([]);
export const gameHistory = writable<GameSession[]>([]);

// Game functions
export const gameFunctions = {
  startGame: (subjectId: string, questions: Question[]) => {
    const session: GameSession = {
      id: Date.now().toString(),
      userId: '', // Will be set when starting
      subjectId,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      startTime: new Date(),
      isCompleted: false,
      timeSpent: [],
      hintsUsed: 0
    };
    currentGameSession.set(session);
  },

  answerQuestion: (answer: number | string, timeSpent: number = 0) => {
    currentGameSession.update(session => {
      if (!session) return session;
      
      const currentQuestion = session.questions[session.currentQuestionIndex];
      let isCorrect = false;
      
      // Check answer based on question type
      if (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false') {
        isCorrect = answer === currentQuestion.correctAnswer;
      } else if (currentQuestion.type === 'fill_blank') {
        // Case-insensitive comparison for fill-in-the-blank
        const userAnswer = String(answer).toLowerCase().trim();
        const correctAnswer = String(currentQuestion.correctAnswer).toLowerCase().trim();
        isCorrect = userAnswer === correctAnswer;
      }
      
      // Calculate points with time bonus
      let points = 0;
      if (isCorrect) {
        points = currentQuestion.basePoints;
        
        // Time bonus: faster answers get more points
        if (currentQuestion.timeLimit && timeSpent > 0) {
          const timeBonus = Math.max(0, currentQuestion.timeLimit - timeSpent) / currentQuestion.timeLimit;
          points += Math.round(currentQuestion.basePoints * 0.5 * timeBonus); // Up to 50% bonus
        }
      }
      
      return {
        ...session,
        answers: [...session.answers, answer],
        score: session.score + points,
        timeSpent: [...session.timeSpent, timeSpent],
        currentQuestionIndex: session.currentQuestionIndex + 1
      };
    });
  },

  useHint: () => {
    currentGameSession.update(session => {
      if (!session) return session;
      
      return {
        ...session,
        hintsUsed: session.hintsUsed + 1
      };
    });
  },

  completeGame: () => {
    currentGameSession.update(session => {
      if (!session) return session;
      
      const completedSession = {
        ...session,
        endTime: new Date(),
        isCompleted: true
      };

      // Save to history
      gameHistory.update(history => [...history, completedSession]);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        const existingHistory = JSON.parse(localStorage.getItem('edu-ruang-game-history') || '[]');
        existingHistory.push(completedSession);
        localStorage.setItem('edu-ruang-game-history', JSON.stringify(existingHistory));
      }

      return completedSession;
    });
  },

  resetGame: () => {
    currentGameSession.set(null);
  }
};

// Initialize game history from localStorage
if (typeof window !== 'undefined') {
  const storedHistory = localStorage.getItem('edu-ruang-game-history');
  if (storedHistory) {
    try {
      gameHistory.set(JSON.parse(storedHistory));
    } catch (e) {
      localStorage.removeItem('edu-ruang-game-history');
    }
  }
}