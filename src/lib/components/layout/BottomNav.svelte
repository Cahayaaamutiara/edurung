<script lang="ts">
	import { page } from '$app/stores';
	import { unreadCount } from '$lib/stores/notifications';
	import { Home, Gamepad2, MessageCircle, User, BookOpen, Puzzle } from 'lucide-svelte';

	const currentPath = $derived($page.url.pathname);
	const notificationCount = $derived($unreadCount);

	const navItems = [
		{ path: '/', icon: Home, label: 'Beranda' },
		{ path: '/materi', icon: BookOpen, label: 'Materi' },
		{ path: '/game', icon: Gamepad2, label: 'Game' },
		{ path: '/mini-games', icon: Puzzle, label: 'Mini Games' },
		{ path: '/discussion', icon: MessageCircle, label: 'Diskusi' },
		{ path: '/profile', icon: User, label: 'Profil' }
	];
</script>

<nav class="bottom-nav">
	<div class="nav-container">
		{#each navItems as item}
			<a 
				href={item.path} 
				class="nav-item {currentPath === item.path ? 'active' : ''}"
				aria-label={item.label}
			>
				<div class="nav-icon">
					{@render item.icon({ size: 24 })}
					{#if item.path === '/discussion' && notificationCount > 0}
						<div class="notification-badge">{notificationCount}</div>
					{/if}
				</div>
				<span class="nav-label">{item.label}</span>
			</a>
		{/each}
	</div>
</nav>

<style>
	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--bg-primary);
		border-top: 1px solid var(--border-light);
		box-shadow: var(--shadow-lg);
		z-index: var(--z-fixed);
	}

	.nav-container {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: var(--space-2) var(--space-4);
		max-width: 600px;
		margin: 0 auto;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2);
		border-radius: var(--radius-lg);
		color: var(--text-secondary);
		text-decoration: none;
		transition: all 0.2s ease;
		min-width: 60px;
	}

	.nav-item:hover {
		color: var(--primary-blue);
		background: rgba(59, 130, 246, 0.1);
		transform: translateY(-2px);
	}

	.nav-item.active {
		color: var(--primary-blue);
		background: rgba(59, 130, 246, 0.1);
	}

	.nav-icon {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		text-align: center;
	}

	.notification-badge {
		position: absolute;
		top: -6px;
		right: -6px;
		background: var(--error);
		color: var(--text-inverse);
		font-size: 10px;
		font-weight: var(--font-bold);
		border-radius: var(--radius-full);
		min-width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: bounce 0.6s ease-in-out;
	}

	@media (max-width: 480px) {
		.nav-container {
			padding: var(--space-1) var(--space-2);
		}

		.nav-item {
			min-width: 50px;
			padding: var(--space-1);
		}

		.nav-label {
			font-size: 10px;
		}
	}
</style>