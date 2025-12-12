<script lang="ts">
	import { onMount } from 'svelte';
	import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-svelte';
	import type { Notification } from '$lib/types';

	let { notification, onClose } = $props<{
		notification: Notification;
		onClose: () => void;
	}>();

	let visible = $state(false);

	onMount(() => {
		// Trigger animation
		setTimeout(() => visible = true, 10);
		
		// Auto close after 5 seconds
		const timer = setTimeout(() => {
			handleClose();
		}, 5000);

		return () => clearTimeout(timer);
	});

	function handleClose() {
		visible = false;
		setTimeout(onClose, 300);
	}

	function getIcon(type: string) {
		switch (type) {
			case 'achievement': return CheckCircle;
			case 'level_up': return CheckCircle;
			case 'challenge': return AlertTriangle;
			case 'discussion': return Info;
			default: return Info;
		}
	}

	function getColor(type: string) {
		switch (type) {
			case 'achievement': return '#10B981';
			case 'level_up': return '#F59E0B';
			case 'challenge': return '#EF4444';
			case 'discussion': return '#3B82F6';
			default: return '#6B7280';
		}
	}
</script>

<div 
	class="notification-toast {visible ? 'visible' : ''}"
	style="border-left-color: {getColor(notification.type)}"
>
	<div class="toast-icon" style="color: {getColor(notification.type)}">
		<svelte:component this={getIcon(notification.type)} size={24} />
	</div>
	
	<div class="toast-content">
		<h4 class="toast-title">{notification.title}</h4>
		<p class="toast-message">{notification.message}</p>
	</div>
	
	<button class="toast-close" on:click={handleClose}>
		<X size={20} />
	</button>
</div>

<style>
	.notification-toast {
		position: fixed;
		top: var(--space-4);
		right: var(--space-4);
		background: var(--bg-primary);
		border-radius: var(--radius-xl);
		padding: var(--space-4);
		box-shadow: var(--shadow-xl);
		border: 1px solid var(--border-light);
		border-left-width: 4px;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		max-width: 400px;
		min-width: 300px;
		z-index: var(--z-tooltip);
		transform: translateX(100%);
		opacity: 0;
		transition: all 0.3s ease;
	}

	.notification-toast.visible {
		transform: translateX(0);
		opacity: 1;
	}

	.toast-icon {
		flex-shrink: 0;
	}

	.toast-content {
		flex: 1;
	}

	.toast-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-1) 0;
		color: var(--text-primary);
	}

	.toast-message {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.4;
	}

	.toast-close {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-secondary);
		padding: var(--space-1);
		border-radius: var(--radius-md);
		flex-shrink: 0;
		transition: all 0.2s ease;
	}

	.toast-close:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	@media (max-width: 480px) {
		.notification-toast {
			left: var(--space-4);
			right: var(--space-4);
			min-width: auto;
			max-width: none;
		}
	}
</style>