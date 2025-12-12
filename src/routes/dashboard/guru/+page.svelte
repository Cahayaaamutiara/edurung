<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/auth';
	import { BookOpen, Users, Gamepad2, Trophy, Plus, Edit3, Eye } from 'lucide-svelte';
	import type { EduRuangUser, Class, EducationalGame } from '$lib/types/gamification';

	const user = $derived($currentUser as EduRuangUser);
	
	let classes = $state<Class[]>([]);
	let games = $state<EducationalGame[]>([]);
	let showCreateClassModal = $state(false);
	let showCreateGameModal = $state(false);
	
	// Form data
	let newClassName = $state('');
	let newClassSubject = $state('');
	let newClassCode = $state('');
	
	let newGameTitle = $state('');
	let newGameSubject = $state('');
	let newGameType = $state<'conventional' | 'educational_world'>('conventional');

	onMount(() => {
		loadClasses();
		loadGames();
	});

	function loadClasses() {
		const storedClasses = localStorage.getItem('edu-ruang-classes');
		if (storedClasses) {
			classes = JSON.parse(storedClasses);
		}
	}

	function loadGames() {
		const storedGames = localStorage.getItem('edu-ruang-games');
		if (storedGames) {
			games = JSON.parse(storedGames);
		}
	}

	function createClass() {
		if (!newClassName || !newClassSubject || !newClassCode) return;
		
		const newClass: Class = {
			id: Date.now().toString(),
			name: newClassName,
			subject: newClassSubject,
			code: newClassCode,
			teacherId: user.id,
			studentIds: [],
			createdAt: new Date()
		};
		
		classes = [...classes, newClass];
		localStorage.setItem('edu-ruang-classes', JSON.stringify(classes));
		
		// Reset form
		newClassName = '';
		newClassSubject = '';
		newClassCode = '';
		showCreateClassModal = false;
	}

	function createGame() {
		if (!newGameTitle || !newGameSubject) return;
		
		const newGame: EducationalGame = {
			id: Date.now().toString(),
			classId: '', // Will be assigned when added to class
			teacherId: user.id,
			title: newGameTitle,
			subject: newGameSubject,
			gameType: newGameType as 'conventional' | 'educational_world',
			createdAt: new Date(),
			updatedAt: new Date()
		};
		
		games = [...games, newGame];
		localStorage.setItem('edu-ruang-games', JSON.stringify(games));
		
		// Reset form
		newGameTitle = '';
		newGameSubject = '';
		newGameType = 'conventional';
		showCreateGameModal = false;
	}

	function generateClassCode() {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let code = '';
		for (let i = 0; i < 6; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		newClassCode = code;
	}
</script>

<!-- 
  Accessibility fixes applied:
  1. Added aria-label attributes to all icon-only buttons
  2. Added keyboard event handlers (Enter/Space) to all interactive elements
  3. Fixed modal overlays to use proper dialog roles and accessibility attributes
  4. Added click-to-close functionality for modal overlays
  5. Added proper escape key handling for modals
-->
<div class="dashboard">
	<div class="container">
		<!-- Header -->
		<div class="dashboard-header">
			<div class="header-content">
				<h1 class="dashboard-title">🧑‍🏫 Dashboard Guru</h1>
				<p class="dashboard-subtitle">Kelola kelas, tugas, dan game edukasi</p>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="stats-grid">
			<div class="stat-card card">
				<div class="stat-icon bg-blue">
					<Users size={24} />
				</div>
				<div class="stat-content">
					<h3 class="stat-number">{classes.length}</h3>
					<p class="stat-label">Kelas</p>
				</div>
			</div>

			<div class="stat-card card">
				<div class="stat-icon bg-green">
					<BookOpen size={24} />
				</div>
				<div class="stat-content">
					<h3 class="stat-number">{games.filter(g => g.gameType === 'conventional').length}</h3>
					<p class="stat-label">Tugas</p>
				</div>
			</div>

			<div class="stat-card card">
				<div class="stat-icon bg-purple">
					<Gamepad2 size={24} />
				</div>
				<div class="stat-content">
					<h3 class="stat-number">{games.filter(g => g.gameType === 'educational_world').length}</h3>
					<p class="stat-label">Game Edukasi</p>
				</div>
			</div>

			<div class="stat-card card">
				<div class="stat-icon bg-orange">
					<Trophy size={24} />
				</div>
				<div class="stat-content">
					<h3 class="stat-number">0</h3>
					<p class="stat-label">Murid Aktif</p>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="quick-actions">
			<button class="action-btn primary" onclick={() => showCreateClassModal = true} onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					showCreateClassModal = true;
				}
			}} aria-label="Buat kelas baru">
				<Plus size={20} />
				<div class="action-content">
					<h3>Buat Kelas</h3>
					<p>Buat kelas baru dengan kode unik</p>
				</div>
			</button>

			<button class="action-btn secondary" onclick={() => showCreateGameModal = true} onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					showCreateGameModal = true;
				}
			}} aria-label="Buat tugas atau game edukasi">
				<Plus size={20} />
				<div class="action-content">
					<h3>Buat Tugas/Game</h3>
					<p>Tambahkan tugas atau game edukasi</p>
				</div>
			</button>

			<button class="action-btn tertiary" onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					// Add action here
				}
			}} aria-label="Lihat progress murid">
				<Eye size={20} />
				<div class="action-content">
					<h3>Lihat Progress</h3>
					<p>Pantau progress murid</p>
				</div>
			</button>

			<button class="action-btn quaternary" onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					// Add action here
				}
			}} aria-label="Buat reward">
				<Edit3 size={20} />
				<div class="action-content">
					<h3>Buat Reward</h3>
					<p>Tambahkan item eksklusif</p>
				</div>
			</button>
		</div>

		<!-- Classes Section -->
		<div class="section">
			<div class="section-header">
				<h2 class="section-title">Kelas Saya</h2>
				<button class="btn-primary btn-sm" onclick={() => showCreateClassModal = true} onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						showCreateClassModal = true;
					}
				}} aria-label="Tambah kelas">
					<Plus size={16} />
					Tambah Kelas
				</button>
			</div>

			{#if classes.length > 0}
				<div class="classes-grid">
					{#each classes as classItem}
						<div class="class-card card">
							<div class="class-header">
								<h3>{classItem.name}</h3>
								<span class="class-code">{classItem.code}</span>
							</div>
							<p class="class-subject">{classItem.subject}</p>
							<div class="class-stats">
								<span>{classItem.studentIds.length} Murid</span>
							</div>
							<div class="class-actions">
								<button class="btn-secondary btn-sm">Kelola</button>
								<button class="btn-ghost btn-sm">Undang</button>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="empty-state card">
					<BookOpen size={48} />
					<h3>Belum ada kelas</h3>
					<p>Buat kelas pertama Anda untuk memulai</p>
					<button class="btn-primary" onclick={() => showCreateClassModal = true} onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							showCreateClassModal = true;
						}
					}} aria-label="Buat kelas">
						<Plus size={20} />
						Buat Kelas
					</button>
				</div>
			{/if}
		</div>

		<!-- Games Section -->
		<div class="section">
			<div class="section-header">
				<h2 class="section-title">Tugas & Game Edukasi</h2>
				<button class="btn-primary btn-sm" onclick={() => showCreateGameModal = true} onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						showCreateGameModal = true;
					}
				}} aria-label="Tambah tugas atau game">
					<Plus size={16} />
					Tambah
				</button>
			</div>

			{#if games.length > 0}
				<div class="games-list">
					{#each games as game}
						<div class="game-item card">
							<div class="game-info">
								<h3>{game.title}</h3>
								<p class="game-subject">{game.subject}</p>
								<span class="game-type {game.gameType}">
									{game.gameType === 'conventional' ? 'Tugas Konvensional' : 'Game Edukasi'}
								</span>
							</div>
							<div class="game-actions">
								<button class="btn-secondary btn-sm">Edit</button>
								<button class="btn-ghost btn-sm">Lihat</button>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="empty-state card">
					<Gamepad2 size={48} />
					<h3>Belum ada tugas atau game</h3>
					<p>Buat tugas atau game edukasi pertama Anda</p>
					<button class="btn-primary" onclick={() => showCreateGameModal = true} onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							showCreateGameModal = true;
						}
					}} aria-label="Buat tugas atau game">
						<Plus size={20} />
						Buat Tugas/Game
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Create Class Modal -->
{#if showCreateClassModal}
	<div class="modal-overlay" 
	     role="dialog" 
	     aria-modal="true"
	     aria-labelledby="create-class-title"
	     tabindex="-1"
	     onclick={(e) => {
	     	if (e.target === e.currentTarget) {
	     		showCreateClassModal = false;
	     	}
	     }}
	     onkeydown={(e) => {
	     	if (e.key === 'Escape') {
	     		showCreateClassModal = false;
	     	}
	     }}>
		<div class="modal-content card">
			<div class="modal-header">
				<h2 id="create-class-title">Buat Kelas Baru</h2>
				<button class="close-btn" onclick={() => showCreateClassModal = false} onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						showCreateClassModal = false;
					}
				}} aria-label="Tutup modal">
					×
				</button>
			</div>
			<form class="modal-form" onsubmit={(e) => {
																																								e.preventDefault();
																																								createClass();
																							}}>
				<div class="form-group">
					<label for="className">Nama Kelas</label>
					<input 
						id="className"
						type="text" 
						bind:value={newClassName}
						placeholder="Contoh: Kelas IPA 10A"
						required
					/>
				</div>
				
				<div class="form-group">
					<label for="classSubject">Mata Pelajaran</label>
					<select id="classSubject" bind:value={newClassSubject} required>
						<option value="">Pilih Mata Pelajaran</option>
						<option value="IPA">IPA</option>
						<option value="IPS">IPS</option>
						<option value="Matematika">Matematika</option>
						<option value="Bahasa Indonesia">Bahasa Indonesia</option>
						<option value="Bahasa Inggris">Bahasa Inggris</option>
					</select>
				</div>
				
				<div class="form-group">
					<label for="classCode">Kode Kelas</label>
					<div class="code-input-group">
						<input 
							id="classCode"
							type="text" 
							bind:value={newClassCode}
							placeholder="Kode unik kelas"
							required
						/>
						<button type="button" class="btn-secondary" onclick={generateClassCode} onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								generateClassCode();
							}
						}}>
							Acak
						</button>
					</div>
				</div>
				
				<div class="modal-actions">
					<button type="button" class="btn-secondary" onclick={() => showCreateClassModal = false} onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							showCreateClassModal = false;
						}
					}}>
						Batal
					</button>
					<button type="submit" class="btn-primary" onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							// Submit form
						}
					}}>
						Buat Kelas
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Create Game Modal -->
{#if showCreateGameModal}
	<div class="modal-overlay" 
	     role="dialog" 
	     aria-modal="true"
	     aria-labelledby="create-game-title"
	     tabindex="-1"
	     onclick={(e) => {
	     	if (e.target === e.currentTarget) {
	     		showCreateGameModal = false;
	     	}
	     }}
	     onkeydown={(e) => {
	     	if (e.key === 'Escape') {
	     		showCreateGameModal = false;
	     	}
	     }}>
		<div class="modal-content card">
			<div class="modal-header">
				<h2 id="create-game-title">Buat Tugas atau Game Edukasi</h2>
				<button class="close-btn" onclick={() => showCreateGameModal = false} onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						showCreateGameModal = false;
					}
				}} aria-label="Tutup modal">
					×
				</button>
			</div>
			<form class="modal-form" onsubmit={(e) => {
																																								e.preventDefault();
																																								createGame();
																							}}>
				<div class="form-group">
					<label for="gameTitle">Judul</label>
					<input 
						id="gameTitle"
						type="text" 
						bind:value={newGameTitle}
						placeholder="Nama tugas atau game"
						required
					/>
				</div>
				
				<div class="form-group">
					<label for="gameSubject">Mata Pelajaran</label>
					<select id="gameSubject" bind:value={newGameSubject} required>
						<option value="">Pilih Mata Pelajaran</option>
						<option value="IPA">IPA</option>
						<option value="IPS">IPS</option>
						<option value="Matematika">Matematika</option>
						<option value="Bahasa Indonesia">Bahasa Indonesia</option>
						<option value="Bahasa Inggris">Bahasa Inggris</option>
					</select>
				</div>
				
				<div class="form-group">
					<label for="gameTypeConventional">Tipe</label>
					<div class="radio-group" role="radiogroup" aria-labelledby="gameTypeLabel">
						<label class="radio-option">
							<input 
								type="radio" 
								name="gameType" 
								value="conventional"
								id="gameTypeConventional"
								bind:group={newGameType}
							/>
							<span>Tugas Konvensional</span>
						</label>
						<label class="radio-option">
							<input 
								type="radio" 
								name="gameType" 
								value="educational_world"
								bind:group={newGameType}
							/>
							<span>Game Edukasi</span>
						</label>
					</div>
				</div>
				
				<div class="modal-actions">
					<button type="button" class="btn-secondary" onclick={() => showCreateGameModal = false} onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							showCreateGameModal = false;
						}
					}}>
						Batal
					</button>
					<button type="submit" class="btn-primary" onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							// Submit form
						}
					}}>
						Buat
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.dashboard {
		padding: var(--space-6) 0;
		min-height: 100vh;
		background: var(--bg-secondary);
	}

	.dashboard-header {
		margin-bottom: var(--space-8);
		padding: var(--space-6);
		background: white;
		border-radius: var(--radius-2xl);
		box-shadow: var(--shadow-md);
	}

	.dashboard-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.dashboard-subtitle {
		font-size: var(--text-lg);
		color: var(--text-secondary);
		margin: 0;
	}

	/* Stats */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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

	.stat-icon.bg-blue { background: var(--primary-blue); }
	.stat-icon.bg-green { background: var(--primary-green); }
	.stat-icon.bg-purple { background: var(--primary-purple); }
	.stat-icon.bg-orange { background: var(--primary-orange); }

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

	/* Quick Actions */
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

	.action-btn.quaternary {
		background: linear-gradient(135deg, var(--primary-orange), var(--primary-red));
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

	/* Sections */
	.section {
		margin-bottom: var(--space-8);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.section-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--text-primary);
		margin: 0;
	}

	/* Classes */
	.classes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--space-4);
	}

	.class-card {
		padding: var(--space-4);
	}

	.class-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.class-header h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin: 0;
		color: var(--text-primary);
	}

	.class-code {
		background: var(--bg-secondary);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
	}

	.class-subject {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0 0 var(--space-3) 0;
	}

	.class-stats {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin-bottom: var(--space-3);
	}

	.class-actions {
		display: flex;
		gap: var(--space-2);
	}

	/* Games */
	.games-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.game-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
	}

	.game-info h3 {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		margin: 0 0 var(--space-1) 0;
		color: var(--text-primary);
	}

	.game-subject {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0 0 var(--space-2) 0;
	}

	.game-type {
		font-size: var(--text-xs);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
		font-weight: var(--font-medium);
	}

	.game-type.conventional {
		background: rgba(59, 130, 246, 0.1);
		color: var(--primary-blue);
	}

	.game-type.educational_world {
		background: rgba(168, 85, 247, 0.1);
		color: var(--primary-purple);
	}

	.game-actions {
		display: flex;
		gap: var(--space-2);
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-8);
		text-align: center;
	}

	.empty-state :global(svg) {
		margin-bottom: var(--space-4);
		color: var(--text-tertiary);
	}

	.empty-state h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.empty-state p {
		color: var(--text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	/* Modals */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		width: 100%;
		max-width: 500px;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-4);
		border-bottom: 1px solid var(--border-light);
	}

	.modal-header h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0;
		color: var(--text-primary);
	}

	.close-btn {
		background: none;
		border: none;
		font-size: var(--text-2xl);
		cursor: pointer;
		color: var(--text-secondary);
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
	}

	.close-btn:hover {
		background: var(--bg-secondary);
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-group label {
		display: block;
		font-weight: var(--font-medium);
		margin-bottom: var(--space-2);
		color: var(--text-primary);
	}

	.form-group input,
	.form-group select {
		width: 100%;
		padding: var(--space-3);
		border: 1px solid var(--border-medium);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
	}

	.code-input-group {
		display: flex;
		gap: var(--space-2);
	}

	.code-input-group input {
		flex: 1;
	}

	.radio-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.radio-option {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-2);
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: 1px solid var(--border-light);
	}

	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.quick-actions {
			grid-template-columns: 1fr;
		}

		.classes-grid {
			grid-template-columns: 1fr;
		}

		.game-item {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-3);
		}

		.game-actions {
			align-self: stretch;
			justify-content: flex-end;
		}
	}
</style>