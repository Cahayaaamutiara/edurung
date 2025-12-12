<script lang="ts">
	import { currentUser, authFunctions } from '$lib/stores/auth';
	import { unreadCount } from '$lib/stores/notifications';
	import { Bell, LogOut, UserCircle2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import EduRuangLogo from '../EduRuangLogo.svelte';

	const user = $derived($currentUser);
	const notificationCount = $derived($unreadCount);

	function handleLogout() {
		authFunctions.logout();
		goto('/login');
	}

	function handleNotifications() {
		// Navigate to notifications or toggle dropdown
		console.log('Show notifications');
	}

	function handleLogoClick() {
		goto('/');
	}
</script>

<header class="top-header">
	<div class="header-container">
		<div class="header-left">
			<button class="logo-button" onclick={handleLogoClick}>
				<EduRuangLogo variant="horizontal" size={48} />
			</button>
		</div>

		<div class="header-right">
			{#if user}
				<button class="notification-btn" onclick={handleNotifications}>
					<Bell size={20} />
					{#if notificationCount > 0}
						<div class="notification-badge">{notificationCount}</div>
					{/if}
				</button>

				<div class="user-info">
					<div class="user-avatar">
						<UserCircle2 size={32} />
					</div>
					<div class="user-details">
						<span class="user-name">{user.name}</span>
						<span class="user-class">{user.class}</span>
					</div>
				</div>

				<button class="logout-btn" onclick={handleLogout} title="Logout">
					<LogOut size={20} />
				</button>
			{/if}
		</div>
	</div>
</header>

<style>
	.top-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border-light);
		box-shadow: var(--shadow-sm);
		z-index: var(--z-sticky);
	}

	.header-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-4);
		max-width: 1200px;
		margin: 0 auto;
	}

	.header-left {
		display: flex;
		align-items: center;
	}

	.logo-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		border-radius: var(--radius-lg);
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
	}

	.logo-button:hover {
		transform: scale(1.02);
		filter: brightness(1.1);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.notification-btn {
		position: relative;
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		padding: var(--space-2);
		border-radius: var(--radius-lg);
		transition: all 0.2s ease;
	}

	.notification-btn:hover {
		background: var(--bg-secondary);
		color: var(--primary-blue);
	}

	.notification-badge {
		position: absolute;
		top: 2px;
		right: 2px;
		background: var(--error);
		color: var(--text-inverse);
		font-size: 10px;
		font-weight: var(--font-bold);
		border-radius: var(--radius-full);
		min-width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.user-avatar {
		color: var(--text-secondary);
	}

	.user-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.user-name {
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
		color: var(--text-primary);
	}

	.user-class {
		font-size: var(--text-xs);
		color: var(--text-secondary);
	}

	.logout-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		padding: var(--space-2);
		border-radius: var(--radius-lg);
		transition: all 0.2s ease;
	}

	.logout-btn:hover {
		background: var(--bg-secondary);
		color: var(--error);
	}

	@media (max-width: 768px) {
		.header-container {
			padding: var(--space-3);
		}

		.user-details {
			display: none;
		}

		.header-right {
			gap: var(--space-2);
		}
	}
</style>