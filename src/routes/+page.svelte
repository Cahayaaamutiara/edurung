<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/auth';
	import { sampleSubjects, initializeSampleData } from '$lib/data/sampleData';
	import { calculateLevel, calculateProgress, formatRelativeTime } from '$lib/utils/helpers';
	import { Trophy, Star, Target, Clock, Gamepad2, MessageCircle, TrendingUp } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const user = $derived($currentUser);
	const userLevel = $derived(user ? calculateLevel(user.points) : 1);
	const levelProgress = $derived(user ? calculateProgress(user.points) : 0);

	let gameHistory = $state<any[]>([]);
	let recentDiscussions = $state<any[]>([]);

	onMount(() => {
		initializeSampleData();
		loadUserData();
	});

	function loadUserData() {
		// Load game history
		const storedHistory = localStorage.getItem('edu-ruang-game-history');
		if (storedHistory) {
			try {
				const parsedHistory = JSON.parse(storedHistory);
				// Convert string dates back to Date objects
				gameHistory = parsedHistory.map((game: any) => ({
					...game,
					startTime: new Date(game.startTime),
					endTime: new Date(game.endTime)
				})).slice(-3); // Last 3 games
			} catch (e) {
				console.error('Error parsing game history:', e);
				localStorage.removeItem('edu-ruang-game-history');
			}
		}

		// Load recent discussions
		const storedDiscussions = localStorage.getItem('edu-ruang-discussions');
		if (storedDiscussions) {
			try {
				const parsedDiscussions = JSON.parse(storedDiscussions);
				// Convert string dates back to Date objects
				recentDiscussions = parsedDiscussions.map((discussion: any) => ({
					...discussion,
					createdAt: new Date(discussion.createdAt),
					updatedAt: new Date(discussion.updatedAt),
					replies: discussion.replies.map((reply: any) => ({
						...reply,
						createdAt: new Date(reply.createdAt)
					}))
				})).slice(0, 2); // First 2 discussions
			} catch (e) {
				console.error('Error parsing discussions:', e);
				localStorage.removeItem('edu-ruang-discussions');
			}
		}
	}

	function navigateToGame() {
		goto('/game');
	}

	function navigateToDiscussion() {
		goto('/discussion');
	}
</script>

<div class="dashboard">
	<div class="container">
		<!-- Welcome Section -->
		<div class="welcome-section card animate-fade-in">
			<div class="welcome-content">
				<h1 class="welcome-title">Selamat Datang, {user?.name || 'Siswa'}! 👋</h1>
				<p class="welcome-subtitle">Siap untuk belajar dan bermain hari ini?</p>
			</div>
			<div class="level-badge">
				<div class="level-info">
					<span class="level-text">Level {userLevel}</span>
					<span class="points-text">{user?.points || 0} Poin</span>
				</div>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {levelProgress}%"></div>
				</div>
			</div>
		</div>

		<!-- Quick Stats -->
		<div class="stats-grid">
			<div class="stat-card card animate-slide-up">
				<div class="stat-icon trophy">
					<Trophy size={24} />
				</div>
				<div class="stat-content">
					<h3 class="stat-number">{gameHistory.length}</h3>
					<p class="stat-label">Game Dimainkan</p>
				</div>
			</div>

			<div class="stat-card card animate-slide-up" style="animation-delay: 0.1s">
				<div class="stat-icon star">
					<Star size={24} />
				</div>
				<div class="stat-content">
					<h3 class="stat-number">{user?.points || 0}</h3>
					<p class="stat-label">Total Poin</p>
				</div>
			</div>

			<div class="stat-card card animate-slide-up" style="animation-delay: 0.2s">
				<div class="stat-icon target">
					<Target size={24} />
				</div>
				<div class="stat-content">
					<h3 class="stat-number">{userLevel}</h3>
					<p class="stat-label">Level Saat Ini</p>
				</div>
			</div>

			<div class="stat-card card animate-slide-up" style="animation-delay: 0.3s">
				<div class="stat-icon trending">
					<TrendingUp size={24} />
				</div>
				<div class="stat-content">
					<h3 class="stat-number">{recentDiscussions.length}</h3>
					<p class="stat-label">Diskusi Aktif</p>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="quick-actions">
			<button class="action-btn primary" onclick={navigateToGame}>
				<Gamepad2 size={24} />
				<div class="action-content">
					<h3>Mulai Game</h3>
					<p>Pilih mata pelajaran dan mulai bermain</p>
				</div>
			</button>

			<button class="action-btn secondary" onclick={navigateToDiscussion}>
				<MessageCircle size={24} />
				<div class="action-content">
					<h3>Gabung Diskusi</h3>
					<p>Diskusi dengan teman-teman</p>
				</div>
			</button>

			<button class="action-btn tertiary" onclick={() => goto('/logo')}>
				<Star size={24} />
				<div class="action-content">
					<h3>Logo Showcase</h3>
					<p>Lihat desain logo Edu Ruang</p>
				</div>
			</button>

				<!-- Commented out - Feature Checker has been disabled -->
			<!-- <button class="action-btn quaternary" onclick={() => goto('/admin')}>
				<Target size={24} />
				<div class="action-content">
					<h3>Feature Checker</h3>
					<p>Analisis kelengkapan fitur aplikasi</p>
				</div>
			</button> -->

			<button class="action-btn primary" onclick={() => goto('/materi')}>
				<Star size={24} />
				<div class="action-content">
					<h3>Materi Pembelajaran</h3>
					<p>Pelajari konsep-konsep penting</p>
				</div>
			</button>
		</div>

		<!-- Recent Activity -->
		{#if gameHistory.length > 0}
			<div class="activity-section">
				<h2 class="section-title flex items-center gap-2">
					<Clock size={20} />
					Aktivitas Terbaru
				</h2>
				<div class="activity-list">
					{#each gameHistory as game}
						<div class="activity-item card">
							<div class="activity-icon">
								<Gamepad2 size={20} />
							</div>
							<div class="activity-content">
								<h4>Game Selesai</h4>
								<p>Skor: {game.score} poin</p>
								<span class="activity-time">{formatRelativeTime(new Date(game.endTime))}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Popular Subjects -->
		<div class="subjects-section">
			<h2 class="section-title">Mata Pelajaran Populer</h2>
			<div class="subjects-grid">
				{#each sampleSubjects.slice(0, 4) as subject}
					<div class="subject-card card" style="border-left: 4px solid {subject.color}">
						<div class="subject-info">
							<div class="subject-icon">{subject.icon}</div>
							<div class="subject-details">
								<h3>{subject.name}</h3>
								<p>{subject.totalQuestions} soal tersedia</p>
							</div>
						</div>
						<button class="subject-btn btn-sm btn-primary" onclick={() => goto(`/game/${subject.id}`)}>Mulai</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.dashboard {
		padding: var(--space-6) 0;
	}

	.welcome-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-8);
		background: var(--gradient-primary);
		color: var(--text-inverse);
		border: none;
	}

	.welcome-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--space-2);
	}

	.welcome-subtitle {
		font-size: var(--text-lg);
		opacity: 0.9;
		margin: 0;
	}

	.level-badge {
		text-align: right;
	}

	.level-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		margin-bottom: var(--space-2);
	}

	.level-text {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
	}

	.points-text {
		font-size: var(--text-sm);
		opacity: 0.8;
	}

	.progress-bar {
		width: 120px;
		height: 8px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: rgba(255, 255, 255, 0.8);
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
	}

	.stat-icon {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-xl);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}

	.stat-icon.trophy { background: var(--primary-orange); }
	.stat-icon.star { background: var(--primary-blue); }
	.stat-icon.target { background: var(--primary-green); }
	.stat-icon.trending { background: var(--primary-purple); }

	.stat-number {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0;
	}

	.quick-actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-6);
		border-radius: var(--radius-xl);
		border: none;
		font-size: var(--text-base);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.action-btn.primary {
		background: var(--gradient-primary);
		color: white;
	}

	.action-btn.secondary {
		background: var(--gradient-success);
		color: white;
	}

	.action-btn.tertiary {
		background: linear-gradient(135deg, var(--primary-purple), var(--primary-cyan));
		color: white;
	}

	.action-btn:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.action-content h3 {
		margin: 0 0 var(--space-1) 0;
		font-weight: var(--font-semibold);
	}

	.action-content p {
		margin: 0;
		opacity: 0.9;
		font-size: var(--text-sm);
	}

	.section-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-4);
		color: var(--text-primary);
	}

	.activity-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.activity-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
	}

	.activity-icon {
		width: 40px;
		height: 40px;
		border-radius: var(--radius-lg);
		background: var(--bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--primary-blue);
	}

	.activity-content h4 {
		margin: 0 0 var(--space-1) 0;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.activity-content p {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--text-secondary);
	}

	.activity-time {
		font-size: var(--text-xs);
		color: var(--text-tertiary);
	}

	.subjects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-4);
	}

	.subject-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
	}

	.subject-info {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.subject-icon {
		font-size: var(--text-2xl);
	}

	.subject-details h3 {
		margin: 0 0 var(--space-1) 0;
		font-size: var(--text-base);
		font-weight: var(--font-medium);
	}

	.subject-details p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}

	.activity-section, .subjects-section {
		margin-bottom: var(--space-8);
	}

	@media (max-width: 768px) {
		.welcome-section {
			flex-direction: column;
			text-align: center;
			gap: var(--space-4);
		}

		.level-badge {
			text-align: center;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.quick-actions {
			grid-template-columns: 1fr;
		}

		.subjects-grid {
			grid-template-columns: 1fr;
		}
	}
</style>