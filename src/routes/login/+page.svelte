<script lang="ts">
	import { goto } from "$app/navigation";
	import { authFunctions } from "$lib/stores/auth";
	import {
		validateUsername,
		generateId,
		availableAvatars,
	} from "$lib/utils/helpers";
	import {
		UserCircle2,
		LogIn,
		AlertCircle,
		School,
		GraduationCap,
	} from "lucide-svelte";
	import type { EduRuangUser } from "$lib/types/gamification";

	let username = "";
	let name = "";
	let class_name = "";
	let selectedAvatar = availableAvatars[0];
	let selectedRole: "murid" | "guru" = "murid";
	let errorMessage = "";
	let isLoading = false;

	function handleLogin() {
		if (isLoading) return;

		errorMessage = "";

		// Validation
		if (!username.trim() || !name.trim() || !class_name.trim()) {
			errorMessage = "Semua field harus diisi";
			return;
		}

		if (!validateUsername(username)) {
			errorMessage =
				"Username harus 3-20 karakter dan hanya boleh mengandung huruf, angka, dan underscore";
			return;
		}

		isLoading = true;

		// Check if user already exists
		const existingUsers = JSON.parse(
			localStorage.getItem("edu-ruang-users") || "[]",
		);
		const existingUser = existingUsers.find(
			(u: EduRuangUser) => u.username === username,
		);

		if (existingUser) {
			// Login existing user
			existingUser.lastActive = new Date();
			// Ensure the existing user has the required role property
			if (!existingUser.role) {
				existingUser.role = selectedRole; // Update role if missing
			}
			authFunctions.login(existingUser);
		} else {
			// Create new user
			const newUser: EduRuangUser = {
				id: generateId(),
				username: username.trim(),
				name: name.trim(),
				class: class_name.trim(),
				avatar: selectedAvatar,
				points: 0,
				level: 1,
				joinDate: new Date(),
				lastActive: new Date(),
				role: selectedRole,
			};

			// Save to localStorage
			existingUsers.push(newUser);
			localStorage.setItem(
				"edu-ruang-users",
				JSON.stringify(existingUsers),
			);

			// Login the new user
			authFunctions.login(newUser);

			// Check role and redirect
			if (newUser.role === "guru") {
				goto("/dashboard/guru");
			} else if (newUser.role === "murid") {
				goto("/dashboard/murid");
			} else {
				goto("/");
			}
		}

		if (existingUser) {
			if (existingUser.role === "guru") {
				goto("/dashboard/guru");
			} else if (existingUser.role === "murid") {
				goto("/dashboard/murid");
			} else {
				goto("/");
			}
		}

		isLoading = false;
	}

	function handleAvatarSelect(avatar: string) {
		selectedAvatar = avatar;
	}
</script>

<div class="login-container">
	<div class="login-card card animate-fade-in">
		<div class="login-header text-center mb-6">
			<div class="logo-container mb-4">
				<div class="logo bg-gradient">
					<UserCircle2 size={48} color="white" />
				</div>
			</div>
			<h1 class="text-3xl font-bold mb-2">Selamat Datang di Edu Ruang</h1>
			<p class="text-secondary">
				Platform pembelajaran interaktif untuk siswa SMA
			</p>
		</div>

		<form
			onsubmit={(event) => {
				event.preventDefault();
				handleLogin();
			}}
			class="login-form"
		>
			{#if errorMessage}
				<div
					class="error-message flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-4"
				>
					<AlertCircle size={20} color="#EF4444" />
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
				<label for="role" class="form-label">Masuk Sebagai</label>
				<div class="role-selector">
					<button
						type="button"
						class="role-option {selectedRole === 'murid'
							? 'selected'
							: ''}"
						onclick={() => (selectedRole = "murid")}
					>
						<GraduationCap size={24} />
						<span>Murid</span>
					</button>
					<button
						type="button"
						class="role-option {selectedRole === 'guru'
							? 'selected'
							: ''}"
						onclick={() => (selectedRole = "guru")}
					>
						<School size={24} />
						<span>Guru</span>
					</button>
				</div>
			</div>

			<div class="form-group mb-6">
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
				<span class="form-label">Pilih Avatar</span>
				<div class="avatar-grid">
					{#each availableAvatars as avatar}
						<button
							type="button"
							class="avatar-option {selectedAvatar === avatar
								? 'selected'
								: ''}"
							onclick={() => handleAvatarSelect(avatar)}
						>
							<div class="avatar-placeholder">
								<UserCircle2 size={32} />
							</div>
							<span class="avatar-name">{avatar}</span>
						</button>
					{/each}
				</div>
			</div>

			<button
				type="submit"
				class="btn-primary btn-lg w-full"
				disabled={isLoading}
			>
				{#if isLoading}
					<div class="spinner"></div>
					Memproses...
				{:else}
					<LogIn size={20} />
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
		background: linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981);
	}

	.login-card {
		max-width: 480px;
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

	.role-selector {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
	}

	.role-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-4);
		border: 2px solid var(--border-light);
		border-radius: var(--radius-lg);
		background: var(--bg-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
		gap: var(--space-2);
		color: var(--text-secondary);
	}

	.role-option:hover {
		border-color: var(--primary-blue);
		background: var(--bg-primary);
	}

	.role-option.selected {
		border-color: var(--primary-blue);
		background: rgba(59, 130, 246, 0.1);
		color: var(--primary-blue);
		font-weight: var(--font-medium);
	}

	.avatar-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-3);
		margin-top: var(--space-3);
	}

	.avatar-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-3);
		border: 2px solid var(--border-light);
		border-radius: var(--radius-lg);
		background: var(--bg-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		gap: var(--space-2);
	}

	.avatar-option:hover {
		border-color: var(--primary-blue);
		box-shadow: var(--shadow-md);
	}

	.avatar-option.selected {
		border-color: var(--primary-blue);
		background: rgba(59, 130, 246, 0.1);
		box-shadow: var(--shadow-md);
	}

	.avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: var(--radius-full);
		background: var(--bg-secondary);
		color: var(--text-secondary);
	}

	.avatar-name {
		font-size: var(--text-xs);
		color: var(--text-secondary);
		text-align: center;
	}

	.w-full {
		width: 100%;
	}

	@media (max-width: 480px) {
		.login-card {
			padding: var(--space-6);
			margin: var(--space-4);
		}

		.avatar-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
