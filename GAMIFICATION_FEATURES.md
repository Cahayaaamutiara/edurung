# Edu Ruang - Gamification Features

This document describes the new gamification features added to the Edu Ruang platform.

## New Features Overview

### 1. Role-Based System
- **Teachers (Guru)**: Can create classes, educational games, and manage student progress
- **Students (Murid)**: Can join classes, play educational games, and collect avatar rewards

### 2. Avatar Collection System
Students can collect, equip, and display avatar items including:
- Hats (Topi)
- Clothing (Pakaian)
- Glasses/Accesories (Kacamata/Aksesori)
- Shoes (Sepatu)

### 3. Educational Worlds
Four themed learning worlds:
- 🧪 Dunia IPA (Science)
- 🏛️ Dunia IPS (Social Studies)
- 🔢 Dunia Matematika (Mathematics)
- 📚 Dunia Bahasa (Language)

### 4. Game Levels & Rewards
- Teachers can create levels with questions and challenges
- Students earn points and avatar items by completing levels
- Progress tracking for each student

### 5. Virtual Economy
- Students earn "Koin Sekolah" for completing activities
- Coins can be used to purchase avatar items in the school shop

## File Structure

```
src/
├── lib/
│   ├── components/
│   │   └── games/
│   │       └── EducationalWorld.svelte
│   ├── data/
│   │   └── avatarCollectionData.ts
│   └── types/
│       └── gamification.ts
├── routes/
│   ├── login-role/
│   │   └── +page.svelte
│   ├── dashboard/
│   │   ├── guru/
│   │   │   └── +page.svelte
│   │   └── murid/
│   │       └── +page.svelte
│   └── profile/
│       └── avatar-collection/
│           └── +page.svelte
```

## Key Components

### Login with Role Selection
Path: `/login-role`
Allows users to select their role (Guru or Murid) during registration.

### Teacher Dashboard
Path: `/dashboard/guru`
Features:
- Class management
- Game creation
- Student progress tracking
- Avatar item creation

### Student Dashboard
Path: `/dashboard/murid`
Features:
- Class joining
- Educational world selection
- Game playing
- Avatar collection management

### Avatar Collection
Path: `/profile/avatar-collection`
Features:
- View owned items
- Equip avatar items
- Shop for new items
- Display avatar showcase

## Data Models

### User Roles
```typescript
type UserRole = 'guru' | 'murid';
```

### Avatar Items
```typescript
interface AvatarItem {
  id: string;
  name: string;
  category: 'hat' | 'clothing' | 'glasses' | 'accessory' | 'shoes';
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'exclusive';
  price?: number;
  isOwned: boolean;
  isEquipped: boolean;
}
```

### Educational Games
```typescript
interface EducationalGame {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  subject: string;
  gameType: 'conventional' | 'educational_world';
  worldTheme?: WorldTheme;
  levels?: GameLevel[];
}
```

## Implementation Notes

1. All new features use localStorage for data persistence
2. Role-based routing redirects users to appropriate dashboards
3. Avatar items can be purchased with "Koin Sekolah"
4. Teachers can create exclusive items for special occasions
5. Students can showcase their avatars in the leaderboard

## Future Enhancements

1. Student-to-student item trading
2. Seasonal events and limited-time items
3. Advanced leaderboard with avatar rankings
4. Teacher-created challenges and quests
5. Social features for student collaboration