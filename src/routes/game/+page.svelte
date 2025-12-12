<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sampleSubjects } from '$lib/data/sampleData';
	import { Trophy, Play, Star, Users } from 'lucide-svelte';
	import type { Subject } from '$lib/types';

	let subjects: Subject[] = [];

	onMount(() => {
		loadSubjects();
	});

	function loadSubjects() {
		const storedSubjects = localStorage.getItem('edu-ruang-subjects');
		if (storedSubjects) {
			subjects = JSON.parse(storedSubjects);
		} else {
			subjects = sampleSubjects;
		}
	}

	function startGame(subjectId: string) {
		goto(`/game/${subjectId}`);
	}

	function viewLeaderboard() {
		goto('/game/leaderboard');
	}
</script>

<div class="game-page">
	<div class="container">
		<!-- Header Section -->
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">🎮 Game Pembelajaran</h1>
				<p class="page-subtitle">Pilih mata pelajaran dan mulai bermain!</p>
			</div>
			<button class="leaderboard-btn btn-secondary" on:click={viewLeaderboard}>
				<Trophy size={20} />
				Papan Skor
			</button>
		</div>

		<!-- Subjects Grid -->
		<div class="subjects-section">
			<h2 class="section-title">Pilih Mata Pelajaran</h2>
			<div class="subjects-grid">
				{#each subjects as subject}
					<div class="subject-card card animate-fade-in" style="border-top: 4px solid {subject.color}">
						<div class="subject-header">
							<div class="subject-icon" style="background: {subject.color}">
								{subject.icon}
							</div>
							<div class="subject-info">
								<h3 class="subject-name">{subject.name}</h3>
								<p class="subject-description">{subject.description}</p>
							</div>
						</div>

						<div class="subject-stats">
							<div class="stat-item">
								<Star size={16} />
								<span>{subject.totalQuestions} Soal</span>
							</div>
							<div class="stat-item">
								<Users size={16} />
								<span>Level 1-3</span>
							</div>
						</div>

						<div class="subject-progress">
							<div class="progress-info">
								<span class="progress-label">Progress</span>
								<span class="progress-value">{subject.completedQuestions}/{subject.totalQuestions}</span>
							</div>
							<div class="progress-bar">
								<div 
									class="progress-fill" 
									style="width: {(subject.completedQuestions / subject.totalQuestions) * 100}%; background: {subject.color}"
								></div>
							</div>
						</div>

						<button 
							class="play-btn btn-primary"
							on:click={() => startGame(subject.id)}
						>
							<Play size={20} />
							Mulai Main
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Quick Tips -->
		<div class="tips-section">
			<h2 class="section-title">💡 Tips Bermain</h2>
			<div class="tips-grid">
				<div class="tip-card card">
					<div class="tip-icon">🎯</div>
					<h3>Jawab dengan Cepat</h3>
					<p>Semakin cepat menjawab, semakin banyak poin yang didapat!</p>
				</div>
				<div class="tip-card card">
					<div class="tip-icon">📚</div>
					<h3>Baca Penjelasan</h3>
					<p>Jangan lupa baca penjelasan setelah menjawab untuk belajar lebih dalam.</p>
				</div>
				<div class="tip-card card">
					<div class="tip-icon">🏆</div>
					<h3>Kumpulkan Poin</h3>
					<p>Kumpulkan poin sebanyak-banyaknya untuk naik level dan bersaing dengan teman!</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.game-page {
		padding: var(--space-6) 0;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-8);
		padding: var(--space-6);
		background: var(--gradient-primary);
		border-radius: var(--radius-2xl);
		color: white;
	}

	.page-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
	}

	.page-subtitle {
		font-size: var(--text-lg);
		margin: 0;
		opacity: 0.9;
	}

	.leaderboard-btn {
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: white;
	}

	.leaderboard-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}

	.section-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-6);
		color: var(--text-primary);
	}

	.subjects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: var(--space-6);
		margin-bottom: var(--space-8);
	}

	.subject-card {
		padding: var(--space-6);
		transition: all 0.3s ease;
	}

	.subject-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-xl);
	}

	.subject-header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.subject-icon {
		width: 60px;
		height: 60px;
		border-radius: var(--radius-xl);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-2xl);
		color: white;
		flex-shrink: 0;
	}

	.subject-name {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.subject-description {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	.subject-stats {
		display: flex;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text-secondary);
		font-size: var(--text-sm);
	}

	.subject-progress {
		margin-bottom: var(--space-5);
	}

	.progress-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
		font-size: var(--text-sm);
	}

	.progress-label {
		color: var(--text-secondary);
		font-weight: var(--font-medium);
	}

	.progress-value {
		color: var(--text-primary);
		font-weight: var(--font-semibold);
	}

	.progress-bar {
		height: 8px;
		background: var(--bg-tertiary);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}

	.play-btn {
		width: 100%;
		background: var(--gradient-primary);
		border: none;
		justify-content: center;
	}

	.play-btn:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.tips-section {
		margin-top: var(--space-8);
	}

	.tips-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-4);
	}

	.tip-card {
		text-align: center;
		padding: var(--space-6);
	}

	.tip-icon {
		font-size: var(--text-4xl);
		margin-bottom: var(--space-3);
	}

	.tip-card h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.tip-card p {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			text-align: center;
			gap: var(--space-4);
		}

		.subjects-grid {
			grid-template-columns: 1fr;
		}

		.tips-grid {
			grid-template-columns: 1fr;
		}
	}
</style>