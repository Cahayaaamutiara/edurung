<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/auth';
	import { Trophy, Medal, Crown, Star, UserCircle2, ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { User } from '$lib/types';

	const user = $derived($currentUser);

	let allUsers: User[] = [];
	let leaderboard: User[] = [];
	let currentUserRank = 0;

	onMount(() => {
		loadLeaderboard();
	});

	function loadLeaderboard() {
		// Get all users from localStorage
		const storedUsers = localStorage.getItem('edu-ruang-users');
		if (storedUsers) {
			allUsers = JSON.parse(storedUsers);
		}

		// Add current user if not in list
		if (user && !allUsers.find(u => u.id === user.id)) {
			allUsers.push(user);
		}

		// Sort by points (descending) and create leaderboard
		leaderboard = [...allUsers]
			.sort((a, b) => b.points - a.points)
			.map((user, index) => ({ ...user, rank: index + 1 }));

		// Find current user rank
		if (user) {
			const userInLeaderboard = leaderboard.find(u => u.id === user.id);
			currentUserRank = userInLeaderboard?.rank || 0;
		}
	}

	function goBack() {
		goto('/game');
	}

	function getRankIcon(rank: number) {
		switch (rank) {
			case 1: return Crown;
			case 2: return Trophy;
			case 3: return Medal;
			default: return Star;
		}
	}

	function getRankColor(rank: number) {
		switch (rank) {
			case 1: return '#FFD700'; // Gold
			case 2: return '#C0C0C0'; // Silver
			case 3: return '#CD7F32'; // Bronze
			default: return '#6B7280'; // Gray
		}
	}

	function formatLastActive(date: Date) {
		const now = new Date();
		const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
		
		if (diffInHours < 1) return 'Baru saja online';
		if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
		const diffInDays = Math.floor(diffInHours / 24);
		return `${diffInDays} hari yang lalu`;
	}
</script>

<div class="leaderboard-page">
	<div class="container">
		<!-- Header -->
		<div class="page-header">
			<button class="back-btn btn-secondary" on:click={goBack}>
				<ArrowLeft size={20} />
				Kembali
			</button>
			<div class="header-content">
				<h1 class="page-title">🏆 Papan Skor</h1>
				<p class="page-subtitle">Lihat ranking siswa terbaik</p>
			</div>
		</div>

		<!-- Top 3 Podium -->
		{#if leaderboard.length >= 3}
			<div class="podium-section">
				<div class="podium-container">
					<!-- 2nd Place -->
					<div class="podium-item second-place">
						<div class="podium-user">
							<div class="user-avatar">
								<UserCircle2 size={40} />
							</div>
							<div class="user-info">
								<h3>{leaderboard[1].name}</h3>
								<p>{leaderboard[1].class}</p>
								<div class="user-points">{leaderboard[1].points} poin</div>
							</div>
						</div>
						<div class="podium-base second">
							<div class="rank-icon" style="color: {getRankColor(2)}">
								<svelte:component this={getRankIcon(2)} size={24} />
							</div>
							<div class="rank-number">2</div>
						</div>
					</div>

					<!-- 1st Place -->
					<div class="podium-item first-place">
						<div class="podium-user">
							<div class="user-avatar champion">
								<UserCircle2 size={48} />
							</div>
							<div class="user-info">
								<h3>{leaderboard[0].name}</h3>
								<p>{leaderboard[0].class}</p>
								<div class="user-points">{leaderboard[0].points} poin</div>
							</div>
						</div>
						<div class="podium-base first">
							<div class="rank-icon" style="color: {getRankColor(1)}">
								<svelte:component this={getRankIcon(1)} size={32} />
							</div>
							<div class="rank-number">1</div>
						</div>
					</div>

					<!-- 3rd Place -->
					<div class="podium-item third-place">
						<div class="podium-user">
							<div class="user-avatar">
								<UserCircle2 size={40} />
							</div>
							<div class="user-info">
								<h3>{leaderboard[2].name}</h3>
								<p>{leaderboard[2].class}</p>
								<div class="user-points">{leaderboard[2].points} poin</div>
							</div>
						</div>
						<div class="podium-base third">
							<div class="rank-icon" style="color: {getRankColor(3)}">
								<svelte:component this={getRankIcon(3)} size={24} />
							</div>
							<div class="rank-number">3</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Current User Position (if not in top 3) -->
		{#if user && currentUserRank > 3}
			<div class="current-user-section">
				<h2 class="section-title">Posisi Kamu</h2>
				<div class="user-rank-card card">
					<div class="rank-position">#{currentUserRank}</div>
					<div class="user-info">
						<div class="user-avatar">
							<UserCircle2 size={40} />
						</div>
						<div class="user-details">
							<h3>{user.name}</h3>
							<p>{user.class}</p>
						</div>
					</div>
					<div class="user-stats">
						<div class="stat-item">
							<span class="stat-value">{user.points}</span>
							<span class="stat-label">Poin</span>
						</div>
						<div class="stat-item">
							<span class="stat-value">{user.level}</span>
							<span class="stat-label">Level</span>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Full Leaderboard -->
		<div class="leaderboard-section">
			<h2 class="section-title">Ranking Lengkap</h2>
			<div class="leaderboard-list">
				{#each leaderboard as userItem, index}
					<div class="leaderboard-item card {user && userItem.id === user.id ? 'current-user' : ''}">
						<div class="rank-position">
							<div class="rank-icon" style="color: {getRankColor(userItem.rank)}">
								<svelte:component this={getRankIcon(userItem.rank)} size={20} />
							</div>
							<span class="rank-number">#{userItem.rank}</span>
						</div>

						<div class="user-info">
							<div class="user-avatar">
								<UserCircle2 size={32} />
							</div>
							<div class="user-details">
								<h4>{userItem.name}</h4>
								<p>{userItem.class}</p>
								<span class="last-active">{formatLastActive(userItem.lastActive)}</span>
							</div>
						</div>

						<div class="user-stats">
							<div class="stat-item">
								<span class="stat-value">{userItem.points}</span>
								<span class="stat-label">Poin</span>
							</div>
							<div class="stat-item">
								<span class="stat-value">Lv.{userItem.level}</span>
								<span class="stat-label">Level</span>
							</div>
						</div>
					</div>
				{/each}

				{#if leaderboard.length === 0}
					<div class="empty-state">
						<Trophy size={48} color="#CBD5E1" />
						<h3>Belum Ada Data</h3>
						<p>Mulai bermain untuk melihat papan skor!</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.leaderboard-page {
		padding: var(--space-6) 0;
	}

	.page-header {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	.header-content {
		flex: 1;
	}

	.page-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.page-subtitle {
		font-size: var(--text-lg);
		color: var(--text-secondary);
		margin: 0;
	}

	.back-btn {
		flex-shrink: 0;
	}

	/* Podium Styles */
	.podium-section {
		margin-bottom: var(--space-8);
	}

	.podium-container {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		gap: var(--space-4);
		max-width: 600px;
		margin: 0 auto;
	}

	.podium-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.podium-user {
		background: var(--bg-primary);
		border-radius: var(--radius-xl);
		padding: var(--space-4);
		box-shadow: var(--shadow-lg);
		text-align: center;
		margin-bottom: var(--space-2);
		min-width: 140px;
	}

	.first-place .podium-user {
		transform: scale(1.1);
		background: var(--gradient-primary);
		color: white;
	}

	.user-avatar {
		display: flex;
		justify-content: center;
		margin-bottom: var(--space-2);
		color: var(--text-secondary);
	}

	.user-avatar.champion {
		color: #FFD700;
	}

	.first-place .user-avatar {
		color: white;
	}

	.podium-user h3 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-1) 0;
	}

	.podium-user p {
		font-size: var(--text-sm);
		margin: 0 0 var(--space-2) 0;
		opacity: 0.8;
	}

	.user-points {
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		color: var(--primary-blue);
	}

	.first-place .user-points {
		color: white;
	}

	.podium-base {
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100px;
		color: white;
		font-weight: var(--font-bold);
	}

	.podium-base.first {
		height: 80px;
		background: linear-gradient(135deg, #FFD700, #FFA500);
	}

	.podium-base.second {
		height: 60px;
		background: linear-gradient(135deg, #C0C0C0, #A0A0A0);
	}

	.podium-base.third {
		height: 40px;
		background: linear-gradient(135deg, #CD7F32, #B8860B);
	}

	.rank-icon {
		margin-bottom: var(--space-1);
	}

	.rank-number {
		font-size: var(--text-lg);
	}

	/* Current User Section */
	.current-user-section {
		margin-bottom: var(--space-8);
	}

	.section-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-4);
		color: var(--text-primary);
	}

	.user-rank-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--gradient-primary);
		color: white;
		border: none;
	}

	.user-rank-card .rank-position {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		min-width: 60px;
		text-align: center;
	}

	.user-rank-card .user-info {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex: 1;
	}

	.user-rank-card .user-details h3 {
		margin: 0 0 var(--space-1) 0;
		font-weight: var(--font-semibold);
	}

	.user-rank-card .user-details p {
		margin: 0;
		opacity: 0.9;
		font-size: var(--text-sm);
	}

	.user-rank-card .user-stats {
		display: flex;
		gap: var(--space-4);
	}

	/* Leaderboard List */
	.leaderboard-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.leaderboard-item {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		transition: all 0.2s ease;
	}

	.leaderboard-item:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.leaderboard-item.current-user {
		border: 2px solid var(--primary-blue);
		background: rgba(59, 130, 246, 0.05);
	}

	.leaderboard-item .rank-position {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-width: 80px;
		font-weight: var(--font-semibold);
	}

	.leaderboard-item .user-info {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex: 1;
	}

	.leaderboard-item .user-details h4 {
		margin: 0 0 var(--space-1) 0;
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--text-primary);
	}

	.leaderboard-item .user-details p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}

	.last-active {
		font-size: var(--text-xs);
		color: var(--text-tertiary);
	}

	.user-stats {
		display: flex;
		gap: var(--space-4);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.stat-value {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--primary-blue);
		line-height: 1;
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--text-secondary);
		margin-top: var(--space-1);
	}

	.user-rank-card .stat-value {
		color: white;
	}

	.user-rank-card .stat-label {
		color: rgba(255, 255, 255, 0.8);
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: var(--space-8);
		color: var(--text-secondary);
	}

	.empty-state h3 {
		margin: var(--space-4) 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.empty-state p {
		margin: 0;
	}

	@media (max-width: 768px) {
		.podium-container {
			flex-direction: column;
			align-items: center;
		}

		.podium-item {
			width: 100%;
			max-width: 300px;
		}

		.first-place {
			order: -1;
		}

		.podium-user {
			min-width: auto;
			width: 100%;
		}

		.user-stats {
			gap: var(--space-2);
		}

		.leaderboard-item {
			padding: var(--space-3);
		}

		.page-header {
			flex-direction: column;
			text-align: center;
			gap: var(--space-2);
		}
	}
</style>