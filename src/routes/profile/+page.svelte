<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser, authFunctions } from '$lib/stores/auth';
	import { gameHistory } from '$lib/stores/game';
	import { discussionPosts } from '$lib/stores/discussion';
	import { calculateLevel, calculateProgress, formatDate, availableAvatars } from '$lib/utils/helpers';
	import EditProfileButton from '$lib/components/profile/EditProfileButton.svelte';
	import { 
		UserCircle2, Edit3, Trophy, Target, Calendar, TrendingUp,
		Gamepad2, MessageCircle, Star, Award, Save, X
	} from 'lucide-svelte';
	import type { User, GameSession, DiscussionPost } from '$lib/types';

	const user = $derived($currentUser);
	const games = $derived($gameHistory);
	const discussions = $derived($discussionPosts);

	let isEditing = $state(false);
	let editName = $state('');
	let editClass = $state('');
	let editAvatar = $state('');
	let userStats = $state({
		totalGamesPlayed: 0,
		averageScore: 0,
		bestSubject: '',
		currentStreak: 0,
		totalDiscussions: 0,
		totalPoints: 0
	});

	onMount(() => {
		if (user) {
			editName = user.name;
			editClass = user.class;
			editAvatar = user.avatar;
		}
		calculateUserStats();
	});

	function calculateUserStats() {
		if (!user) return;

		// Game statistics
		const userGames = games.filter(game => game.userId === user.id && game.isCompleted);
		userStats.totalGamesPlayed = userGames.length;
		
		if (userGames.length > 0) {
			userStats.averageScore = Math.round(userGames.reduce((sum, game) => sum + game.score, 0) / userGames.length);
			
			// Find best subject (most played)
			const subjectCounts: { [key: string]: number } = {};
			userGames.forEach(game => {
				subjectCounts[game.subjectId] = (subjectCounts[game.subjectId] || 0) + 1;
			});
			
			const bestSubjectId = Object.keys(subjectCounts).reduce((a, b) => 
				subjectCounts[a] > subjectCounts[b] ? a : b, '');
			
			// Map subject ID to name
			const subjectNames: { [key: string]: string } = {
				'matematika': 'Matematika',
				'fisika': 'Fisika',
				'kimia': 'Kimia',
				'biologi': 'Biologi',
				'bahasa-indonesia': 'Bahasa Indonesia',
				'bahasa-inggris': 'Bahasa Inggris'
			};
			
			userStats.bestSubject = subjectNames[bestSubjectId] || 'Belum ada';
		}

		// Discussion statistics
		const userDiscussions = discussions.filter(post => post.userId === user.id);
		userStats.totalDiscussions = userDiscussions.length;

		userStats.totalPoints = user.points;
	}

	function startEditing() {
		isEditing = true;
		editName = user?.name || '';
		editClass = user?.class || '';
		editAvatar = user?.avatar || availableAvatars[0];
	}

	function cancelEditing() {
		isEditing = false;
		if (user) {
			editName = user.name;
			editClass = user.class;
			editAvatar = user.avatar;
		}
	}

	function saveProfile() {
		if (!user || !editName.trim() || !editClass.trim()) return;

		authFunctions.updateUser({
			name: editName.trim(),
			class: editClass.trim(),
			avatar: editAvatar
		});

		isEditing = false;
	}

	function selectAvatar(avatar: string) {
		editAvatar = avatar;
	}

	const levelProgress = $derived(user ? calculateProgress(user.points) : 0);
	const nextLevelPoints = $derived(user ? Math.ceil((user.level * 100) - user.points) : 0);
</script>

<div class="profile-page">
	<div class="container">
		<!-- Profile Header -->
		<div class="profile-header card">
			<div class="profile-info">
				<div class="avatar-section">
					<div class="user-avatar large">
						<UserCircle2 size={80} />
					</div>
					{#if isEditing}
						<div class="avatar-selector">
							<h4>Pilih Avatar:</h4>
							<div class="avatar-grid">
								{#each availableAvatars as avatar}
									<button 
										class="avatar-option {editAvatar === avatar ? 'selected' : ''}"
										onclick={() => selectAvatar(avatar)}
									>
										<UserCircle2 size={24} />
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<div class="user-details">
					{#if isEditing}
						<div class="edit-form">
							<input 
								type="text" 
								bind:value={editName}
								placeholder="Nama lengkap"
								class="edit-input"
							/>
							<select bind:value={editClass} class="edit-select">
								<option value="">Pilih Kelas</option>
								<option value="X IPA 1">X IPA 1</option>
								<option value="X IPA 2">X IPA 2</option>
								<option value="X IPS 1">X IPS 1</option>
								<option value="X IPS 2">X IPS 2</option>
								<option value="XI IPA 1">XI IPA 1</option>
								<option value="XI IPA 2">XI IPA 2</option>
								<option value="XI IPS 1">XI IPS 1</option>
								<option value="XI IPS 2">XI IPS 2</option>
								<option value="XII IPA 1">XII IPA 1</option>
								<option value="XII IPA 2">XII IPA 2</option>
								<option value="XII IPS 1">XII IPS 1</option>
								<option value="XII IPS 2">XII IPS 2</option>
							</select>
							<div class="edit-actions">
								<button class="btn-primary btn-sm" onclick={saveProfile}>
									<Save size={16} />
									Simpan
								</button>
								<button class="btn-secondary btn-sm" onclick={cancelEditing}>
									<X size={16} />
									Batal
								</button>
							</div>
						</div>
					{:else}
						<h1 class="user-name">{user?.name || 'Nama Pengguna'}</h1>
						<p class="user-class">{user?.class || 'Kelas tidak diset'}</p>
						<p class="user-username">@{user?.username || 'username'}</p>
						<div class="user-meta">
							<div class="meta-item">
								<Calendar size={16} />
								<span>Bergabung {user ? formatDate(user.joinDate) : ''}</span>
							</div>
						</div>
					{/if}
				</div>
			</div>

			{#if !isEditing}
				<EditProfileButton 
					variant="secondary" 
					size="md" 
					text="Edit Profil" 
				/>
			{/if}
		</div>

		<!-- Level Progress -->
		<div class="level-section card">
			<div class="level-header">
				<h2>Level & Pencapaian</h2>
				<div class="level-badge">
					Level {user?.level || 1}
				</div>
			</div>
			
			<div class="level-progress">
				<div class="progress-info">
					<span>Progress ke Level {(user?.level || 1) + 1}</span>
					<span>{user?.points || 0} / {((user?.level || 1) + 1) * 100} poin</span>
				</div>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {levelProgress}%"></div>
				</div>
				<p class="progress-text">
					{nextLevelPoints > 0 ? `${nextLevelPoints} poin lagi untuk naik level!` : 'Maksimal level tercapai!'}
				</p>
			</div>
		</div>

		<!-- Statistics Grid -->
		<div class="stats-section">
			<h2 class="section-title">Statistik</h2>
			<div class="stats-grid">
				<div class="stat-card card">
					<div class="stat-icon">
						<Trophy style="color: #F59E0B" size={32} />
					</div>
					<div class="stat-content">
						<h3>{userStats.totalPoints}</h3>
						<p>Total Poin</p>
					</div>
				</div>

				<div class="stat-card card">
					<div class="stat-icon">
						<Gamepad2 style="color: #3B82F6" size={32} />
					</div>
					<div class="stat-content">
						<h3>{userStats.totalGamesPlayed}</h3>
						<p>Game Dimainkan</p>
					</div>
				</div>

				<div class="stat-card card">
					<div class="stat-icon">
						<Target style="color: #10B981" size={32} />
					</div>
					<div class="stat-content">
						<h3>{userStats.averageScore}</h3>
						<p>Rata-rata Skor</p>
					</div>
				</div>

				<div class="stat-card card">
					<div class="stat-icon">
						<MessageCircle style="color: #8B5CF6" size={32} />
					</div>
					<div class="stat-content">
						<h3>{userStats.totalDiscussions}</h3>
						<p>Diskusi Dibuat</p>
					</div>
				</div>

				<div class="stat-card card">
					<div class="stat-icon">
						<Star style="color: #EF4444" size={32} />
					</div>
					<div class="stat-content">
						<h3>{userStats.bestSubject || 'Belum ada'}</h3>
						<p>Mata Pelajaran Favorit</p>
					</div>
				</div>

				<div class="stat-card card">
					<div class="stat-icon">
						<Award style="color: #06B6D4" size={32} />
					</div>
					<div class="stat-content">
						<h3>Level {user?.level || 1}</h3>
						<p>Level Saat Ini</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Activity -->
		{#if games.length > 0}
			<div class="activity-section">
				<h2 class="section-title">Aktivitas Terbaru</h2>
				<div class="activity-list">
					{#each games.slice(-5).reverse() as game}
						<div class="activity-item card">
							<div class="activity-icon">
								<Gamepad2 size={20} style="color: #3B82F6" />
							</div>
							<div class="activity-content">
								<h4>Menyelesaikan kuis</h4>
								<p>Skor: {game.score} poin</p>
								<span class="activity-time">
									{game.endTime ? formatDate(new Date(game.endTime)) : 'Belum selesai'}
								</span>
							</div>
							<div class="activity-score">
								+{game.score}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Achievements (Placeholder) -->
		<div class="achievements-section">
			<h2 class="section-title">Pencapaian</h2>
			<div class="achievements-grid">
				<div class="achievement-card card {user && user.points >= 100 ? 'unlocked' : 'locked'}">
					<div class="achievement-icon">
						<Trophy size={32} />
					</div>
					<div class="achievement-content">
						<h4>Pemula</h4>
						<p>Raih 100 poin pertama</p>
					</div>
				</div>

				<div class="achievement-card card {userStats.totalGamesPlayed >= 5 ? 'unlocked' : 'locked'}">
					<div class="achievement-icon">
						<Gamepad2 size={32} />
					</div>
					<div class="achievement-content">
						<h4>Gamer Aktif</h4>
						<p>Mainkan 5 game</p>
					</div>
				</div>

				<div class="achievement-card card {userStats.totalDiscussions >= 1 ? 'unlocked' : 'locked'}">
					<div class="achievement-icon">
						<MessageCircle size={32} />
					</div>
					<div class="achievement-content">
						<h4>Diskusi Pertama</h4>
						<p>Buat diskusi pertama</p>
					</div>
				</div>

				<div class="achievement-card card {user && user.level >= 5 ? 'unlocked' : 'locked'}">
					<div class="achievement-icon">
						<Star size={32} />
					</div>
					<div class="achievement-content">
						<h4>Level Master</h4>
						<p>Capai Level 5</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.profile-page {
		padding: var(--space-6) 0;
	}

	.profile-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-6);
		padding: var(--space-6);
	}

	.profile-info {
		display: flex;
		gap: var(--space-6);
		align-items: flex-start;
		flex: 1;
	}

	.avatar-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
	}

	.user-avatar.large {
		color: var(--text-secondary);
	}

	.avatar-selector h4 {
		font-size: var(--text-sm);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
		text-align: center;
	}

	.avatar-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-2);
	}

	.avatar-option {
		width: 40px;
		height: 40px;
		border: 2px solid var(--border-light);
		border-radius: var(--radius-lg);
		background: var(--bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--text-secondary);
	}

	.avatar-option:hover {
		border-color: var(--primary-blue);
		background: var(--bg-primary);
	}

	.avatar-option.selected {
		border-color: var(--primary-blue);
		background: rgba(59, 130, 246, 0.1);
		color: var(--primary-blue);
	}

	.user-details {
		flex: 1;
	}

	.user-name {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.user-class {
		font-size: var(--text-lg);
		color: var(--text-secondary);
		margin: 0 0 var(--space-1) 0;
	}

	.user-username {
		font-size: var(--text-base);
		color: var(--text-tertiary);
		margin: 0 0 var(--space-4) 0;
	}

	.user-meta {
		display: flex;
		gap: var(--space-4);
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text-secondary);
		font-size: var(--text-sm);
	}

	.edit-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.edit-input,
	.edit-select {
		padding: var(--space-3);
		border: 1px solid var(--border-medium);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
	}

	.edit-actions {
		display: flex;
		gap: var(--space-2);
	}



	/* Level Section */
	.level-section {
		margin-bottom: var(--space-6);
		padding: var(--space-6);
	}

	.level-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.level-header h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0;
		color: var(--text-primary);
	}

	.level-badge {
		background: var(--gradient-primary);
		color: white;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-lg);
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
	}

	.level-progress {
		background: var(--bg-secondary);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
	}

	.progress-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}

	.progress-bar {
		height: 12px;
		background: var(--bg-primary);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-bottom: var(--space-2);
	}

	.progress-fill {
		height: 100%;
		background: var(--gradient-primary);
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		text-align: center;
		margin: 0;
	}

	/* Statistics */
	.section-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-4);
		color: var(--text-primary);
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
		transition: all 0.2s ease;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.stat-icon {
		flex-shrink: 0;
	}

	.stat-content h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-1) 0;
		color: var(--text-primary);
	}

	.stat-content p {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0;
	}

	/* Activity */
	.activity-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-8);
	}

	.activity-item {
		display: flex;
		align-items: center;
		gap: var(--space-4);
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
		flex-shrink: 0;
	}

	.activity-content {
		flex: 1;
	}

	.activity-content h4 {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		margin: 0 0 var(--space-1) 0;
		color: var(--text-primary);
	}

	.activity-content p {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0;
	}

	.activity-time {
		font-size: var(--text-xs);
		color: var(--text-tertiary);
	}

	.activity-score {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--success);
	}

	/* Achievements */
	.achievements-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-4);
	}

	.achievement-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		transition: all 0.2s ease;
		position: relative;
	}

	.achievement-card.unlocked {
		border-left: 4px solid var(--success);
	}

	.achievement-card.locked {
		opacity: 0.6;
		border-left: 4px solid var(--border-light);
	}

	.achievement-card.unlocked .achievement-icon {
		color: var(--success);
	}

	.achievement-card.locked .achievement-icon {
		color: var(--text-tertiary);
	}

	.achievement-content h4 {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		margin: 0 0 var(--space-1) 0;
		color: var(--text-primary);
	}

	.achievement-content p {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0;
	}

	@media (max-width: 768px) {
		.profile-header {
			flex-direction: column;
			gap: var(--space-4);
		}

		.profile-info {
			flex-direction: column;
			text-align: center;
			width: 100%;
		}

		.edit-actions {
			flex-direction: column;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.achievements-grid {
			grid-template-columns: 1fr;
		}

		.user-meta {
			justify-content: center;
		}
	}
</style>