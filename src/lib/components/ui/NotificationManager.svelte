<script lang="ts">
	import { notifications, notificationFunctions } from '$lib/stores/notifications';
	import NotificationToast from './NotificationToast.svelte';
	import type { Notification } from '$lib/types';

	const notificationList = $derived($notifications);

	function handleCloseNotification(notification: Notification) {
		notificationFunctions.clearNotification(notification.id);
	}
</script>

<!-- Render active notifications -->
{#each notificationList.slice(0, 3) as notification, index}
	<div style="top: {80 + index * 100}px;">
		<NotificationToast 
			{notification} 
			onClose={() => handleCloseNotification(notification)}
		/>
	</div>
{/each}

<style>
	div {
		position: fixed;
		right: 0;
		z-index: var(--z-tooltip);
	}
</style>