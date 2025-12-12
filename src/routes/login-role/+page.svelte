<script lang="ts">
	// Using window.location for navigation to avoid import issues with $app/navigation
	function navigateTo(url: string) {
		window.location.href = url;
	}
	
	// Simple approach to avoid import issues with external libraries
	import { authFunctions } from '$lib/stores/auth';
	import { generateId } from '$lib/utils/helpers';
	import type { EduRuangUser } from '$lib/types/gamification';

	// Standard Svelte reactivity
	let username = '';
	let name = '';
	let class_name = '';
	let role: 'guru' | 'murid' | '' = '';
	let errorMessage = '';
	let isLoading = false;

	function handleLogin() {
		if (isLoading) return;
		
		errorMessage = '';
		
		// Validation
		if (!username.trim() || !name.trim() || !class_name.trim() || !role) {
			errorMessage = 'Semua field harus diisi';
			return;
		}

		isLoading = true;

		// Check if user already exists
		const existingUsers = JSON.parse(localStorage.getItem('edu-ruang-users') || '[]').map((u: any) => ({
			...u,
			// Ensure numeric properties remain numbers after JSON parsing
			points: Number(u.points) || 0,
			level: Number(u.level) || 1,
			koinSekolah: u.koinSekolah !== undefined ? Number(u.koinSekolah) : undefined,
			joinDate: new Date(u.joinDate),
			lastActive: new Date(u.lastActive)
		}));
		const existingUser = existingUsers.find((u: EduRuangUser) => u.username === username);

		if (existingUser) {
			// Login existing user
			existingUser.lastActive = new Date();
			authFunctions.login(existingUser);
		} else {
			// Create new user
			const newUser: EduRuangUser = {
				id: generateId(),
				username: username.trim(),
				name: name.trim(),
				class: class_name.trim(),
				avatar: 'student-1',
				points: 0,
				level: 1,
				joinDate: new Date(),
				lastActive: new Date(),
				role: role as 'guru' | 'murid',
				koinSekolah: 0,
				avatarCollection: []
			};

			// Save to localStorage
			existingUsers.push(newUser);
			localStorage.setItem('edu-ruang-users', JSON.stringify(existingUsers));

			// Login the new user
			authFunctions.login(newUser);
		}

		// Redirect based on role using our simple navigation function
		if (role === 'guru') {
			navigateTo('/dashboard/guru');
		} else {
			navigateTo('/dashboard/murid');
		}
		
		isLoading = false;
	}
</script>

<div class="login-container">
	<div class="login-card card animate-fade-in">
		<div class="login-header text-center mb-6">
			<div class="logo-container mb-4">
				<div class="logo bg-gradient">
					<!-- Using inline SVG instead of Lucide icon to avoid import issues -->
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
						<path d="M9.05 9.05c.92-.92 2.39-.92 3.31 0"/>
						<path d="M15.95 15.95c-.92.92-2.39.92-3.31 0"/>
						<path d="M12 12h.01"/>
					</svg>
				</div>
			</div>
			<h1 class="text-3xl font-bold mb-2">Selamat Datang di Edu Ruang</h1>
			<p class="text-secondary">Platform pembelajaran interaktif berbasis gamifikasi</p>
		</div>

		<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="login-form">
			{#if errorMessage}
				<div class="error-message flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
					<!-- Using inline SVG instead of Lucide icon to avoid import issues -->
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/>
						<line x1="12" y1="8" x2="12" y2="12"/>
						<line x1="12" y1="16" x2="12.01" y2="16"/>
					</svg>
					<span class="text-error">{errorMessage}</span>
				</div>
			{/if}

			<div class="form-group mb-4">
				<label for="username" class="form-label">Username</label>
				<input 
					id="username"
					type="text" 
					bind:value={username}
					placeholder="Masukkan username unik"
					required 
				/>
			</div>

			<div class="form-group mb-4">
				<label for="name" class="form-label">Nama Lengkap</label>
				<input 
					id="name"
					type="text" 
					bind:value={name}
					placeholder="Masukkan nama lengkap"
					required 
				/>
			</div>

			<div class="form-group mb-4">
				<label for="class" class="form-label">Kelas</label>
				<select id="class" bind:value={class_name} required>
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
			</div>

			<div class="form-group mb-6">
				<label for="role" class="form-label">Pilih Peran</label>
				<select id="role" bind:value={role} required>
					<option value="">Pilih Peran</option>
					<option value="guru">🧑‍🏫 Guru</option>
					<option value="murid">👩‍🎓 Murid</option>
				</select>
			</div>

			<button type="submit" class="btn-primary btn-lg w-full" disabled={isLoading || !role}>
				{#if isLoading}
					<div class="spinner"></div>
					Memproses...
				{:else}
					<!-- Using inline SVG instead of Lucide icon to avoid import issues -->
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
						<polyline points="10 17 15 12 10 7"/>
						<line x1="15" y1="12" x2="3" y2="12"/>
					</svg>
					Masuk ke Edu Ruang
				{/if}
			</button>
		</form>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: var(--space-4);
		background: linear-gradient(135deg, #3B82F6, #8B5CF6, #10B981);
	}

	.login-card {
		max-width: 500px;
		width: 100%;
		background: var(--bg-primary);
		border-radius: var(--radius-2xl);
		padding: var(--space-8);
		box-shadow: var(--shadow-xl);
	}

	.logo-container {
		display: flex;
		justify-content: center;
	}

	.logo {
		width: 80px;
		height: 80px;
		border-radius: var(--radius-full);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-lg);
	}

	.form-label {
		display: block;
		font-weight: var(--font-medium);
		margin-bottom: var(--space-2);
		color: var(--text-primary);
	}

	.w-full {
		width: 100%;
	}

	@media (max-width: 480px) {
		.login-card {
			padding: var(--space-6);
			margin: var(--space-4);
		}
	}
</style>