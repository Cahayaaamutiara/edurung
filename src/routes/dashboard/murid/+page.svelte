<script lang="ts">
	import { onMount } from "svelte";
	import { currentUser } from "$lib/stores/auth";
	import { sampleSubjects } from "$lib/data/sampleData";
	import { calculateLevel, calculateProgress } from "$lib/utils/helpers";
	import {
		BookOpen,
		Gamepad2,
		Trophy,
		Star,
		Clock,
		TrendingUp,
		Target,
		Plus,
		UserCircle2,
	} from "lucide-svelte";
	import { goto } from "$app/navigation";

	const user = $derived($currentUser);
	const userLevel = $derived(user ? calculateLevel(user.points) : 1);
	const levelProgress = $derived(user ? calculateProgress(user.points) : 0);

	let showJoinClassModal = $state(false);
	let classCode = $state("");

	function joinClass() {
		console.log("Joining class with code:", classCode);
		showJoinClassModal = false;
		classCode = "";
	}

	function navigateTo(path: string) {
		goto(path);
	}
</script>

<div class="dashboard-murid">
	<div class="container">
		<!-- Welcome Header -->
		<div class="welcome-header card animate-fade-in">
			<div class="welcome-text">
				<h1>Halo, {user?.name || "Siswa"}! 👋</h1>
				<p>Siap untuk petualangan belajar hari ini?</p>
			</div>
			<div class="level-card">
				<div class="level-info">
					<span class="level-label">Level {userLevel}</span>
					<span class="points-label">{user?.points || 0} Poin</span>
				</div>
				<div class="progress-container">
					<div
						class="progress-bar"
						style="width: {levelProgress}%"
					></div>
				</div>
			</div>
		</div>

		<!-- Quick Stats -->
		<div class="stats-grid">
			<div class="stat-card card">
				<div class="stat-icon bg-blue">
					<BookOpen size={24} />
				</div>
				<div class="stat-info">
					<h3>Materi</h3>
					<p>Belum ada progres</p>
				</div>
			</div>

			<div class="stat-card card">
				<div class="stat-icon bg-green">
					<Gamepad2 size={24} />
				</div>
				<div class="stat-info">
					<h3>Game</h3>
					<p>Mainkan sekarang</p>
				</div>
			</div>

			<div class="stat-card card">
				<div class="stat-icon bg-orange">
					<Trophy size={24} />
				</div>
				<div class="stat-info">
					<h3>Rank</h3>
					<p>Lihat Leaderboard</p>
				</div>
			</div>

			<div
				class="stat-card card clickable"
				onclick={() => (showJoinClassModal = true)}
				onkeydown={(e) =>
					e.key === "Enter" && (showJoinClassModal = true)}
				role="button"
				tabindex="0"
			>
				<div class="stat-icon bg-purple">
					<Plus size={24} />
				</div>
				<div class="stat-info">
					<h3>Gabung Kelas</h3>
					<p>Masukkan kode</p>
				</div>
			</div>
		</div>

		<!-- Main Content Grid -->
		<div class="content-grid">
			<!-- Subject Section -->
			<div class="section-column">
				<div class="section-header">
					<h2>📚 Mata Pelajaran</h2>
					<button
						class="view-all"
						onclick={() => navigateTo("/materi")}
						>Lihat Semua</button
					>
				</div>
				<div class="subject-list">
					{#each sampleSubjects.slice(0, 3) as subject}
						<div
							class="subject-item card clickable"
							onclick={() => navigateTo(`/materi/${subject.id}`)}
							onkeydown={(e) =>
								e.key === "Enter" &&
								navigateTo(`/materi/${subject.id}`)}
							role="button"
							tabindex="0"
						>
							<div
								class="subject-icon"
								style="background: {subject.color}20; color: {subject.color}"
							>
								{subject.icon}
							</div>
							<div class="subject-details">
								<h3>{subject.name}</h3>
								<p>{subject.totalQuestions} Topik</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Activities Section -->
			<div class="section-column">
				<div class="section-header">
					<h2>🎯 Aktivitas Seru</h2>
				</div>
				<div class="activities-list">
					<div
						class="activity-card card clickable"
						onclick={() => navigateTo("/mini-games")}
						onkeydown={(e) =>
							e.key === "Enter" && navigateTo("/mini-games")}
						role="button"
						tabindex="0"
					>
						<div class="activity-image mini-games">
							<Gamepad2 size={32} />
						</div>
						<div class="activity-content">
							<h3>Mini Games</h3>
							<p>Mainkan game edukasi seru</p>
						</div>
					</div>

					<div
						class="activity-card card clickable"
						onclick={() => navigateTo("/game")}
						onkeydown={(e) =>
							e.key === "Enter" && navigateTo("/game")}
						role="button"
						tabindex="0"
					>
						<div class="activity-image quiz">
							<Target size={32} />
						</div>
						<div class="activity-content">
							<h3>Kuis Harian</h3>
							<p>Tantang dirimu setiap hari</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Join Class Modal -->
{#if showJoinClassModal}
	<div
		class="modal-overlay"
		onclick={() => (showJoinClassModal = false)}
		onkeydown={(e) => {
			if (e.key === "Escape") showJoinClassModal = false;
		}}
		role="presentation"
		tabindex="-1"
	>
		<div
			class="modal-content card"
			onclick={(event) => event.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === "Escape") showJoinClassModal = false;
			}}
			role="dialog"
			aria-modal="true"
			aria-labelledby="join-class-title"
			tabindex="0"
		>
			<div class="modal-header">
				<h2 id="join-class-title">Gabung ke Kelas</h2>
				<button
					class="close-btn"
					onclick={() => (showJoinClassModal = false)}
					aria-label="Close modal">×</button
				>
			</div>
			<form
				class="modal-form"
				onsubmit={(event) => {
					event.preventDefault();
					joinClass();
				}}
			>
				<div class="form-group">
					<label for="classCode">Masukkan Kode Kelas</label>
					<input
						id="classCode"
						type="text"
						bind:value={classCode}
						placeholder="Contoh: ABC123"
						required
						maxlength="6"
						style="text-transform: uppercase;"
					/>
				</div>

				<div class="modal-actions">
					<button
						type="button"
						class="btn-secondary"
						onclick={() => (showJoinClassModal = false)}
					>
						Batal
					</button>
					<button type="submit" class="btn-primary"> Gabung </button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.dashboard-murid {
		padding: var(--space-6) 0;
		min-height: 100vh;
	}

	.welcome-header {
		background: var(--gradient-primary);
		color: white;
		padding: var(--space-6);
		border-radius: var(--radius-2xl);
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-8);
	}

	.welcome-text h1 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
	}

	.welcome-text p {
		margin: 0;
		opacity: 0.9;
	}

	.level-card {
		background: rgba(255, 255, 255, 0.2);
		padding: var(--space-4);
		border-radius: var(--radius-xl);
		width: 200px;
		backdrop-filter: blur(8px);
	}

	.level-info {
		display: flex;
		justify-content: space-between;
		margin-bottom: var(--space-2);
		font-weight: var(--font-bold);
		font-size: var(--text-sm);
	}

	.progress-container {
		height: 8px;
		background: rgba(0, 0, 0, 0.2);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: white;
		border-radius: var(--radius-full);
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

	.stat-card.clickable {
		cursor: pointer;
		transition: transform 0.2s;
	}

	.stat-card.clickable:hover {
		transform: translateY(-2px);
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

	.bg-blue {
		background: var(--primary-blue);
	}
	.bg-green {
		background: var(--primary-green);
	}
	.bg-orange {
		background: var(--primary-orange);
	}
	.bg-purple {
		background: var(--primary-purple);
	}

	.stat-info h3 {
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		margin: 0;
		color: var(--text-primary);
	}

	.stat-info p {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-6);
	}

	.section-column {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.section-header h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		margin: 0;
		color: var(--text-primary);
	}

	.view-all {
		color: var(--primary-blue);
		background: none;
		border: none;
		cursor: pointer;
		font-weight: var(--font-medium);
	}

	.subject-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.subject-item {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		cursor: pointer;
		transition: transform 0.2s;
	}

	.subject-item:hover {
		transform: translateX(4px);
	}

	.subject-icon {
		width: 40px;
		height: 40px;
		border-radius: var(--radius-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-xl);
	}

	.subject-details h3 {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		margin: 0;
		color: var(--text-primary);
	}

	.subject-details p {
		font-size: var(--text-xs);
		color: var(--text-secondary);
		margin: 0;
	}

	.activities-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
	}

	.activity-card {
		padding: var(--space-4);
		cursor: pointer;
		transition: transform 0.2s;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
	}

	.activity-card:hover {
		transform: translateY(-4px);
	}

	.activity-image {
		width: 64px;
		height: 64px;
		border-radius: var(--radius-xl);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		margin-bottom: var(--space-2);
	}

	.activity-image.mini-games {
		background: var(--gradient-primary);
	}
	.activity-image.quiz {
		background: var(--gradient-success);
	}

	.activity-content h3 {
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		margin: 0;
		color: var(--text-primary);
	}

	.activity-content p {
		font-size: var(--text-xs);
		color: var(--text-secondary);
		margin: 0;
	}

	@media (max-width: 768px) {
		.welcome-header {
			flex-direction: column;
			text-align: center;
			gap: var(--space-4);
		}

		.content-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		width: 100%;
		max-width: 400px;
		padding: var(--space-6);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.modal-header h2 {
		margin: 0;
		font-size: var(--text-xl);
	}

	.close-btn {
		background: none;
		border: none;
		font-size: var(--text-2xl);
		cursor: pointer;
	}

	.form-group {
		margin-bottom: var(--space-4);
	}

	.form-group label {
		display: block;
		margin-bottom: var(--space-2);
		font-weight: var(--font-medium);
	}

	.form-group input {
		width: 100%;
		padding: var(--space-3);
		border: 1px solid var(--border-medium);
		border-radius: var(--radius-lg);
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-2);
	}
</style>
