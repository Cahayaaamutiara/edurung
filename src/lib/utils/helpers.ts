// Date formatting utilities
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  
  return formatDate(date);
}

// Score calculation utilities
export function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}

export function calculateProgress(points: number): number {
  return (points % 100);
}

export function getNextLevelPoints(points: number): number {
  const currentLevel = calculateLevel(points);
  return currentLevel * 100;
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUsername(username: string): boolean {
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

// Random utilities
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Color utilities
export function getSubjectColor(subjectName: string): string {
  const colors = {
    'Matematika': '#3B82F6',
    'Fisika': '#10B981',
    'Kimia': '#F59E0B',
    'Biologi': '#8B5CF6',
    'Bahasa Indonesia': '#EF4444',
    'Bahasa Inggris': '#06B6D4',
    'Sejarah': '#D97706',
    'Geografi': '#84CC16'
  };
  return colors[subjectName as keyof typeof colors] || '#6B7280';
}

// Avatar utilities
export function getAvatarUrl(avatarName: string): string {
  return `/avatars/${avatarName}.svg`;
}

export const availableAvatars = [
  'student-1', 'student-2', 'student-3', 'student-4', 
  'student-5', 'student-6', 'student-7', 'student-8'
];