<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { currentUser } from "$lib/stores/auth";
  import { games, stats, miniGameFunctions } from "$lib/stores/miniGames";
  import { sampleMiniGames } from "$lib/data/miniGamesData";
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
    TrendingUp,
  } from "lucide-svelte";
  import type { MiniGame } from "$lib/types";

  const user = $derived($currentUser);
  const gamesData = $derived($games);
  const statsData = $derived($stats);

  let selectedDifficulty = $state<"all" | "easy" | "medium" | "hard">("all");
  let selectedSubject = $state<string>("all");
  let selectedGameType = $state<
    "all" | "crossword" | "picture_puzzle" | "quick_quiz" | "drag_drop"
  >("all");
  let leaderboardData = $state<any[]>([]);

  const gameTypes = [
    {
      id: "crossword" as const,
      name: "Teka-teki Silang",
      icon: Crosshair,
      description: "Pecahkan teka-teki kata",
    },
    {
      id: "picture_puzzle" as const,
      name: "Puzzle Gambar",
      icon: Puzzle,
      description: "Susun potongan gambar",
    },
    {
      id: "quick_quiz" as const,
      name: "Kuis Kilat",
      icon: Timer,
      description: "Jawab soal dengan cepat",
    },
    {
      id: "drag_drop" as const,
      name: "Drag & Drop",
      icon: Layers,
      description: "Kelompokkan konsep",
    },
  ];

  const subjects = [
    { id: "matematika", name: "Matematika", icon: "📐", color: "#3B82F6" },
    { id: "fisika", name: "Fisika", icon: "⚛️", color: "#10B981" },
    { id: "kimia", name: "Kimia", icon: "🧪", color: "#F59E0B" },
    { id: "biologi", name: "Biologi", icon: "🧬", color: "#8B5CF6" },
    {
      id: "bahasa-indonesia",
      name: "Bahasa Indonesia",
      icon: "📚",
      color: "#EF4444",
    },
    {
      id: "bahasa-inggris",
      name: "Bahasa Inggris",
      icon: "🌍",
      color: "#06B6D4",
    },
    { id: "sejarah", name: "Sejarah", icon: "🏛️", color: "#D97706" },
    { id: "geografi", name: "Geografi", icon: "🗺️", color: "#84CC16" },
  ];

  // Filter games based on selection
  const filteredGames = $derived(
    gamesData.filter((game) => {
      const matchesDifficulty =
        selectedDifficulty === "all" || game.difficulty === selectedDifficulty;
      const matchesSubject =
        selectedSubject === "all" || game.subjectId === selectedSubject;
      const matchesType =
        selectedGameType === "all" || game.type === selectedGameType;
      return matchesDifficulty && matchesSubject && matchesType;
    }),
  );

  onMount(() => {
    if (!user) {
      goto("/login");
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
    const gameTypeUrl = game.type.replace(/_/g, "-");
    goto(`/mini-games/${gameTypeUrl}/${game.id}`);
  }

  function getGameTypeIcon(type: string) {
    const gameType = gameTypes.find((gt) => gt.id === type);
    return gameType?.icon || Puzzle;
  }

  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case "easy":
        return "#10B981";
      case "medium":
        return "#F59E0B";
      case "hard":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  }

  function getSubjectData(subjectId: string) {
    return (
      subjects.find((s: { id: string }) => s.id === subjectId) || {
        name: "Unknown",
        icon: "❓",
        color: "#6B7280",
      }
    );
  }
</script>

<div class="mini-games-page">
  <div class="container">
    <!-- Header -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">Mini Games Seru! 🎮</h1>
        <p class="page-subtitle">
          Main sambil belajar dengan koleksi game edukasi kami
        </p>
      </div>

      <div class="stats-badge">
        <div class="stat-item">
          <Trophy size={18} class="text-yellow-400" />
          <span>Skor: {user?.points || 0}</span>
        </div>
        <div class="stat-item">
          <Crown size={18} class="text-purple-400" />
          <span>Rank: 5</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <!-- Game Type Filter -->
      <div class="filter-group">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="filter-label">Tipe Game</label>
        <div class="filter-options">
          <button
            class="filter-chip {selectedGameType === 'all' ? 'active' : ''}"
            onclick={() => (selectedGameType = "all")}
          >
            Semua
          </button>
          {#each gameTypes as type}
            <button
              class="filter-chip {selectedGameType === type.id ? 'active' : ''}"
              onclick={() => (selectedGameType = type.id)}
            >
              {type.name}
            </button>
          {/each}
        </div>
      </div>

      <!-- Subject Filter -->
      <div class="filter-group">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="filter-label">Mata Pelajaran</label>
        <select bind:value={selectedSubject} class="filter-select">
          <option value="all">Semua Pelajaran</option>
          {#each subjects as subject}
            <option value={subject.id}>{subject.icon} {subject.name}</option>
          {/each}
        </select>
      </div>

      <!-- Difficulty Filter -->
      <div class="filter-group">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="filter-label">Tingkat Kesulitan</label>
        <div class="difficulty-options">
          {#each ["all", "easy", "medium", "hard"] as diff}
            <button
              class="difficulty-btn {diff} {selectedDifficulty === diff
                ? 'active'
                : ''}"
              onclick={() => (selectedDifficulty = diff as any)}
            >
              {#if diff === "all"}
                Semua
              {:else}
                {diff === "easy"
                  ? "Mudah"
                  : diff === "medium"
                    ? "Sedang"
                    : "Sulit"}
              {/if}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Games Grid -->
    <div class="games-grid">
      {#each filteredGames as game (game.id)}
        <div class="game-card card animate-scale-in">
          <div class="game-image">
            {#if game.thumbnail}
              <img src={game.thumbnail} alt={game.title} />
            {:else}
              <div
                class="placeholder-image"
                style="background: {getSubjectData(game.subjectId).color}20"
              >
                <!-- svelte-ignore element_invalid_self_closing_tag -->
                <component
                  this={getGameTypeIcon(game.type)}
                  size={48}
                  color={getSubjectData(game.subjectId).color}
                />
              </div>
            {/if}
            <div class="difficulty-badge {game.difficulty}">
              {game.difficulty === "easy"
                ? "Mudah"
                : game.difficulty === "medium"
                  ? "Sedang"
                  : "Sulit"}
            </div>
          </div>

          <div class="game-content">
            <div class="game-header">
              <span
                class="subject-tag"
                style="background: {getSubjectData(game.subjectId)
                  .color}20; color: {getSubjectData(game.subjectId).color}"
              >
                {getSubjectData(game.subjectId).icon}
                {getSubjectData(game.subjectId).name}
              </span>
              <div class="rating">
                <Star size={14} class="fill-yellow-400 text-yellow-400" />
                <span>{game.rating}</span>
              </div>
            </div>

            <h3 class="game-title">{game.title}</h3>
            <p class="game-description">{game.description}</p>

            <div class="game-footer">
              <div class="game-meta">
                <span class="meta-item">
                  <Clock size={14} />
                  {game.duration}m
                </span>
                <span class="meta-item">
                  <TrendingUp size={14} />
                  {game.playedCount}x
                </span>
              </div>
              <button class="play-btn" onclick={() => startGame(game)}>
                Main
              </button>
            </div>
          </div>
        </div>
      {/each}

      {#if filteredGames.length === 0}
        <div class="empty-state">
          <Puzzle size={64} class="text-gray-300 mb-4" />
          <h3>Tidak ada game ditemukan</h3>
          <p>Coba ubah filter pencarianmu</p>
          <button
            class="reset-btn"
            onclick={() => {
              selectedDifficulty = "all";
              selectedSubject = "all";
              selectedGameType = "all";
            }}>Reset Filter</button
          >
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .mini-games-page {
    padding-bottom: var(--space-8);
  }

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-6);
    background: var(--gradient-primary);
    padding: var(--space-6);
    border-radius: var(--radius-2xl);
    color: white;
  }

  .page-title {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    margin: 0 0 var(--space-2) 0;
  }

  .page-subtitle {
    margin: 0;
    opacity: 0.9;
  }

  .stats-badge {
    display: flex;
    gap: var(--space-3);
    background: rgba(255, 255, 255, 0.2);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-xl);
    backdrop-filter: blur(8px);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: var(--font-medium);
    font-size: var(--text-sm);
  }

  .filters-section {
    background: var(--bg-card);
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-light);
    margin-bottom: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .filter-label {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-secondary);
  }

  .filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .filter-chip {
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    border: 1px solid var(--border-light);
    background: var(--bg-primary);
    color: var(--text-secondary);
    font-size: var(--text-sm);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-chip:hover {
    background: var(--bg-secondary);
  }

  .filter-chip.active {
    background: var(--primary-blue);
    color: white;
    border-color: var(--primary-blue);
  }

  .filter-select {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-light);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: var(--text-sm);
  }

  .difficulty-options {
    display: flex;
    gap: var(--space-2);
    background: var(--bg-secondary);
    padding: var(--space-1);
    border-radius: var(--radius-lg);
    width: fit-content;
  }

  .difficulty-btn {
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-md);
    border: none;
    background: none;
    color: var(--text-secondary);
    font-size: var(--text-xs);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .difficulty-btn.active {
    background: white;
    box-shadow: var(--shadow-sm);
    color: var(--text-primary);
    font-weight: var(--font-medium);
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-4);
  }

  .game-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    transition: transform 0.2s ease;
  }

  .game-card:hover {
    transform: translateY(-4px);
  }

  .game-image {
    position: relative;
    aspect-ratio: 16/9;
    background: var(--bg-secondary);
  }

  .placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .difficulty-badge {
    position: absolute;
    top: var(--space-2);
    right: var(--space-2);
    padding: 2px 8px;
    border-radius: var(--radius-full);
    font-size: 10px;
    font-weight: var(--font-bold);
    color: white;
    text-transform: uppercase;
  }

  .difficulty-badge.easy {
    background: var(--success);
  }
  .difficulty-badge.medium {
    background: var(--warning);
  }
  .difficulty-badge.hard {
    background: var(--error);
  }

  .game-content {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
  }

  .subject-tag {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: var(--radius-md);
    font-weight: var(--font-medium);
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: var(--text-xs);
    font-weight: var(--font-bold);
    color: var(--text-secondary);
  }

  .game-title {
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    margin: 0 0 var(--space-2) 0;
    color: var(--text-primary);
  }

  .game-description {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin: 0 0 var(--space-4) 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .game-footer {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .game-meta {
    display: flex;
    gap: var(--space-3);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }

  .play-btn {
    padding: var(--space-2) var(--space-4);
    background: var(--primary-blue);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .play-btn:hover {
    background: var(--primary-blue-dark);
  }

  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-12);
    text-align: center;
    background: var(--bg-card);
    border-radius: var(--radius-xl);
    border: 1px dashed var(--border-light);
  }

  .empty-state h3 {
    margin: 0 0 var(--space-2) 0;
    color: var(--text-primary);
  }

  .empty-state p {
    margin: 0 0 var(--space-4) 0;
    color: var(--text-secondary);
  }

  .reset-btn {
    padding: var(--space-2) var(--space-4);
    border: 1px solid var(--border-light);
    background: white;
    border-radius: var(--radius-lg);
    cursor: pointer;
    font-size: var(--text-sm);
  }

  @media (max-width: 768px) {
    .header-section {
      flex-direction: column;
      gap: var(--space-4);
      text-align: center;
    }

    .header-content {
      width: 100%;
    }

    .stats-badge {
      width: 100%;
      justify-content: center;
    }

    .filters-section {
      padding: var(--space-3);
    }

    .filter-options {
      overflow-x: auto;
      padding-bottom: var(--space-2);
      flex-wrap: nowrap;
    }
  }
</style>
