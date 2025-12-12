<script lang="ts">
	import { onMount } from 'svelte';
	import { miniGameStore, miniGameFunctions } from '$lib/stores/miniGames';
	import type { WeeklyLeaderboardEntry } from '$lib/types';
	import { Trophy, Medal, Star, Clock, Target, TrendingUp } from 'lucide-svelte';

	let weeklyLeaderboard: WeeklyLeaderboardEntry[] = [];
	let currentUserRank: number | null = null;
	let weeklyStats = {
		gamesPlayed: 0,
		totalScore: 0,
		averageScore: 0,
		bestGame: '',
		totalTime: 0
	};

	onMount(() => {
		loadLeaderboard();
		loadUserStats();
	});

	function loadLeaderboard() {
		weeklyLeaderboard = miniGameFunctions.getWeeklyLeaderboard();
		
		// Find current user's rank (mock for now)
		const currentUserId = 'user-1'; // This should come from auth store
		const userEntry = weeklyLeaderboard.find(entry => entry.userId === currentUserId);
		currentUserRank = userEntry?.rank || null;
	}

	function loadUserStats() {
		// Mock stats - this should come from the store
		weeklyStats = {
			gamesPlayed: 12,
			totalScore: 1250,
			averageScore: 104,
			bestGame: 'Biology Picture Puzzle',
			totalTime: 1800 // 30 minutes in seconds
		};
	}

	function getRankIcon(rank: number) {
		if (rank === 1) return Trophy;
		if (rank === 2) return Medal;
		if (rank === 3) return Medal;
		return Star;
	}

	function getRankColor(rank: number): string {
		if (rank === 1) return '#ffd700'; // Gold
		if (rank === 2) return '#c0c0c0'; // Silver
		if (rank === 3) return '#cd7f32'; // Bronze
		return '#6b7280'; // Gray
	}

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		
		if (hours > 0) {
			return `${hours}h ${minutes}m ${secs}s`;
		} else if (minutes > 0) {
			return `${minutes}m ${secs}s`;
		} else {
			return `${secs}s`;
		}
	}

	function getWeekRange(): string {
		const now = new Date();
		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - now.getDay());
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);

		const options: Intl.DateTimeFormatOptions = { 
			month: 'short', 
			day: 'numeric' 
		};
		
		return `${startOfWeek.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString('en-US', options)}`;
	}

	function getProgressPercentage(score: number, maxScore: number = 2000): number {
		return Math.min((score / maxScore) * 100, 100);
	}
</script>

<svelte:head>
	<title>Weekly Leaderboard - Mini Games - Edu Ruang</title>
	<meta name="description" content="See how you rank against other students in our weekly mini-games leaderboard" />
</svelte:head>

<div class="leaderboard-page">
	<div class="page-header">
		<div class="header-content">
			<div class="header-info">
				<h1>Weekly Leaderboard</h1>
				<p class="week-range">{getWeekRange()}</p>
				<p class="description">Compete with your classmates and climb the rankings!</p>
			</div>
			<div class="header-stats">
				{#if currentUserRank}
					<div class="user-rank">
						<div class="rank-badge">
							<span class="rank-number">#{currentUserRank}</span>
							<span class="rank-label">Your Rank</span>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="leaderboard-content">
		<!-- User Stats Overview -->
		<div class="stats-section">
			<h2>Your Weekly Performance</h2>
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-icon">
						<Target size={24} />
					</div>
					<div class="stat-info">
						<span class="stat-value">{weeklyStats.gamesPlayed}</span>
						<span class="stat-label">Games Played</span>
					</div>
				</div>
				<div class="stat-card">
					<div class="stat-icon">
						<Trophy size={24} />
					</div>
					<div class="stat-info">
						<span class="stat-value">{weeklyStats.totalScore}</span>
						<span class="stat-label">Total Score</span>
					</div>
				</div>
				<div class="stat-card">
					<div class="stat-icon">
						<TrendingUp size={24} />
					</div>
					<div class="stat-info">
						<span class="stat-value">{weeklyStats.averageScore}</span>
						<span class="stat-label">Average Score</span>
					</div>
				</div>
				<div class="stat-card">
					<div class="stat-icon">
						<Clock size={24} />
					</div>
					<div class="stat-info">
						<span class="stat-value">{formatTime(weeklyStats.totalTime)}</span>
						<span class="stat-label">Time Played</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Leaderboard Rankings -->
		<div class="rankings-section">
			<h2>Top Players This Week</h2>
			<div class="leaderboard-table">
				<div class="table-header">
					<span>Rank</span>
					<span>Player</span>
					<span>Score</span>
					<span>Games</span>
					<span>Average</span>
				</div>
				
				{#each weeklyLeaderboard as entry, index}
					<div class="table-row {entry.rank <= 3 ? 'top-three' : ''} {currentUserRank === entry.rank ? 'current-user' : ''}">
						<div class="rank-cell">
							<div class="rank-icon" style="color: {getRankColor(entry.rank)}">
								<svelte:component this={getRankIcon(entry.rank)} size={20} />
							</div>
							<span class="rank-number">#{entry.rank}</span>
						</div>
						
						<div class="player-cell">
							<div class="player-avatar">
								<img src={entry.avatar || '/default-avatar.png'} alt={entry.name} />
							</div>
							<div class="player-info">
								<span class="player-name">{entry.name}</span>
								<span class="player-class">{entry.class}</span>
							</div>
						</div>
						
						<div class="score-cell">
							<span class="score-value">{entry.totalScore}</span>
							<div class="score-progress">
								<div 
									class="progress-bar" 
									style="width: {getProgressPercentage(entry.totalScore)}%"
								></div>
							</div>
						</div>
						
						<div class="games-cell">
							<span>{entry.gamesPlayed}</span>
						</div>
						
						<div class="average-cell">
							<span>{entry.averageScore}</span>
						</div>
					</div>
				{/each}
				
				{#if weeklyLeaderboard.length === 0}
					<div class="empty-state">
						<div class="empty-icon">
							<Trophy size={48} />
						</div>
						<h3>No Rankings Yet</h3>
						<p>Be the first to play mini-games this week!</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Achievement Badges -->
		<div class="achievements-section">
			<h2>Weekly Achievements</h2>
			<div class="achievements-grid">
				<div class="achievement-card">
					<div class="achievement-icon gold">
						<Trophy size={24} />
					</div>
					<div class="achievement-info">
						<h3>Speed Demon</h3>
						<p>Complete 3 quick quizzes under 30 seconds each</p>
						<span class="achievement-reward">+50 bonus points</span>
					</div>
				</div>
				
				<div class="achievement-card">
					<div class="achievement-icon silver">
						<Star size={24} />
					</div>
					<div class="achievement-info">
						<h3>Puzzle Master</h3>
						<p>Solve 5 picture puzzles with 90%+ accuracy</p>
						<span class="achievement-reward">+40 bonus points</span>
					</div>
				</div>
				
				<div class="achievement-card">
					<div class="achievement-icon bronze">
						<Medal size={24} />
					</div>
					<div class="achievement-info">
						<h3>Word Wizard</h3>
						<p>Complete 2 crossword puzzles without hints</p>
						<span class="achievement-reward">+30 bonus points</span>
					</div>
				</div>
				
				<div class="achievement-card">
					<div class="achievement-icon">
						<Target size={24} />
					</div>
					<div class="achievement-info">
						<h3>Consistent Player</h3>
						<p>Play mini-games for 5 consecutive days</p>
						<span class="achievement-reward">+25 bonus points</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.leaderboard-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
	}

	.page-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 16px;
		padding: 2rem;
		margin-bottom: 2rem;
		color: white;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header-info h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: 700;
	}

	.week-range {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
		opacity: 0.9;
		font-weight: 500;
	}

	.description {
		margin: 0;
		opacity: 0.8;
		font-size: 1rem;
	}

	.user-rank {
		text-align: right;
	}

	.rank-badge {
		background: rgba(255, 255, 255, 0.2);
		padding: 1rem 1.5rem;
		border-radius: 12px;
		backdrop-filter: blur(10px);
	}

	.rank-number {
		display: block;
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.rank-label {
		font-size: 0.9rem;
		opacity: 0.9;
	}

	.leaderboard-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.stats-section, .rankings-section, .achievements-section {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.stats-section h2, .rankings-section h2, .achievements-section h2 {
		margin: 0 0 1.5rem 0;
		color: #374151;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: #f8fafc;
		border-radius: 10px;
		border: 1px solid #e2e8f0;
	}

	.stat-icon {
		color: #3b82f6;
	}

	.stat-info {
		display: flex;
		flex-direction: column;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #374151;
	}

	.stat-label {
		color: #6b7280;
		font-size: 0.9rem;
	}

	.leaderboard-table {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.table-header {
		display: grid;
		grid-template-columns: 100px 1fr 120px 80px 80px;
		gap: 1rem;
		padding: 1rem;
		font-weight: 600;
		color: #6b7280;
		border-bottom: 2px solid #e5e7eb;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.table-row {
		display: grid;
		grid-template-columns: 100px 1fr 120px 80px 80px;
		gap: 1rem;
		align-items: center;
		padding: 1rem;
		border-radius: 8px;
		transition: all 0.2s ease;
		border: 1px solid transparent;
	}

	.table-row:hover {
		background: #f8fafc;
	}

	.table-row.top-three {
		background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
		border-color: #f59e0b;
	}

	.table-row.current-user {
		background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
		border-color: #3b82f6;
		box-shadow: 0 0 0 1px #3b82f6;
	}

	.rank-cell {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.rank-number {
		font-weight: 600;
		color: #374151;
	}

	.player-cell {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.player-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
		border: 2px solid #e5e7eb;
	}

	.player-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.player-info {
		display: flex;
		flex-direction: column;
	}

	.player-name {
		font-weight: 500;
		color: #374151;
		font-size: 0.95rem;
	}

	.player-class {
		color: #6b7280;
		font-size: 0.8rem;
	}

	.score-cell {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.score-value {
		font-weight: 600;
		color: #374151;
	}

	.score-progress {
		height: 4px;
		background: #e5e7eb;
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: #3b82f6;
		transition: width 0.3s ease;
	}

	.games-cell, .average-cell {
		font-weight: 500;
		color: #6b7280;
		text-align: center;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: #6b7280;
	}

	.empty-icon {
		margin-bottom: 1rem;
		opacity: 0.5;
	}

	.empty-state h3 {
		margin: 0 0 0.5rem 0;
		color: #374151;
	}

	.achievements-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.achievement-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		transition: all 0.2s ease;
	}

	.achievement-card:hover {
		border-color: #d1d5db;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.achievement-icon {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f3f4f6;
		color: #6b7280;
		flex-shrink: 0;
	}

	.achievement-icon.gold {
		background: #fef3c7;
		color: #d97706;
	}

	.achievement-icon.silver {
		background: #f1f5f9;
		color: #64748b;
	}

	.achievement-icon.bronze {
		background: #fed7aa;
		color: #ea580c;
	}

	.achievement-info h3 {
		margin: 0 0 0.25rem 0;
		color: #374151;
		font-size: 1rem;
		font-weight: 600;
	}

	.achievement-info p {
		margin: 0 0 0.5rem 0;
		color: #6b7280;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.achievement-reward {
		color: #059669;
		font-weight: 500;
		font-size: 0.85rem;
	}

	@media (max-width: 1024px) {
		.header-content {
			flex-direction: column;
			gap: 1.5rem;
			text-align: center;
		}

		.table-header, .table-row {
			grid-template-columns: 80px 1fr 100px 60px 60px;
			font-size: 0.85rem;
		}

		.achievements-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}

		.table-header, .table-row {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.player-cell {
			justify-self: start;
		}

		.score-cell, .games-cell, .average-cell {
			justify-self: center;
		}
	}
</style>