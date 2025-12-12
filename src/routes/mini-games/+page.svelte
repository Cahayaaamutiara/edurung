<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores/auth';
  import { 
    games,
    stats,
    miniGameFunctions 
  } from '$lib/stores/miniGames';
  import { sampleMiniGames } from '$lib/data/miniGamesData';
  import { 
    Puzzle, 
    Crosshair, 
    Timer, 
    Layers, 
    Trophy, 
    Star,
    Clock,
    Target,
    Crown,
    TrendingUp
  } from 'lucide-svelte';
  import type { MiniGame } from '$lib/types';

  const user = $derived($currentUser);
  const gamesData = $derived($games);
  const statsData = $derived($stats);

  let selectedDifficulty = $state<'all' | 'easy' | 'medium' | 'hard'>('all');
  let selectedSubject = $state<string>('all');
  let selectedGameType = $state<'all' | 'crossword' | 'picture_puzzle' | 'quick_quiz' | 'drag_drop'>('all');
  let leaderboardData = $state<any[]>([]);

  const gameTypes = [
    { id: 'crossword' as const, name: 'Teka-teki Silang', icon: Crosshair, description: 'Pecahkan teka-teki kata' },
    { id: 'picture_puzzle' as const, name: 'Puzzle Gambar', icon: Puzzle, description: 'Susun potongan gambar' },
    { id: 'quick_quiz' as const, name: 'Kuis Kilat', icon: Timer, description: 'Jawab soal dengan cepat' },
    { id: 'drag_drop' as const, name: 'Drag & Drop', icon: Layers, description: 'Kelompokkan konsep' }
  ];

  const subjects = [
    { id: 'matematika', name: 'Matematika', icon: '📐', color: '#3B82F6' },
    { id: 'fisika', name: 'Fisika', icon: '⚛️', color: '#10B981' },
    { id: 'kimia', name: 'Kimia', icon: '🧪', color: '#F59E0B' },
    { id: 'biologi', name: 'Biologi', icon: '🧬', color: '#8B5CF6' },
    { id: 'bahasa-indonesia', name: 'Bahasa Indonesia', icon: '📚', color: '#EF4444' },
    { id: 'bahasa-inggris', name: 'Bahasa Inggris', icon: '🌍', color: '#06B6D4' },
    { id: 'sejarah', name: 'Sejarah', icon: '🏛️', color: '#D97706' },
    { id: 'geografi', name: 'Geografi', icon: '🗺️', color: '#84CC16' }
  ];

  // Filter games based on selection
  const filteredGames = $derived(gamesData.filter(game => {
    const matchesDifficulty = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty;
    const matchesSubject = selectedSubject === 'all' || game.subjectId === selectedSubject;
    const matchesType = selectedGameType === 'all' || game.type === selectedGameType;
    return matchesDifficulty && matchesSubject && matchesType;
  }));

  onMount(() => {
    if (!user) {
      goto('/login');
      return;
    }

    // Load mini-games data
    miniGameFunctions.loadMiniGames();
    miniGameFunctions.loadUserStats();
    miniGameFunctions.loadWeeklyLeaderboard();
    
    // Load leaderboard data
    leaderboardData = miniGameFunctions.getWeeklyLeaderboard();
    
    // If no games loaded, use sample data
    if (gamesData.length === 0) {
      games.set(sampleMiniGames);
    }
  });

  function startGame(game: MiniGame) {
    if (!user) return;
    // Convert underscores to hyphens for URL routing
    const gameTypeUrl = game.type.replace(/_/g, '-');
    goto(`/mini-games/${gameTypeUrl}/${game.id}`);
  }

  function getGameTypeIcon(type: string) {
    const gameType = gameTypes.find(gt => gt.id === type);
    return gameType?.icon || Puzzle;
  }

  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  }

  function getSubjectData(subjectId: string) {
    return subjects.find((s: { id: string }) => s.id === subjectId) || { name: 'Unknown', icon: '❓', color: '#6B7280' };
  }
</script>