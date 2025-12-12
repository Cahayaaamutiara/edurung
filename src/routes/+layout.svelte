<script lang="ts">
	import '../app.css';
	import TopHeader from '$lib/components/layout/TopHeader.svelte';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';
	import NotificationManager from '$lib/components/ui/NotificationManager.svelte';
	import { page } from '$app/stores';

	let { children } = $props();
	
	const isLoginPage = $derived($page.url.pathname === '/login' || $page.url.pathname === '/login-role');
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

{#if !isLoginPage}
	<TopHeader />
	<main class="main-content">
		{@render children?.()}
	</main>
	<BottomNav />
	<NotificationManager />
{:else}
	{@render children?.()}
{/if}

<style>
	.main-content {
		padding-top: 80px;
		padding-bottom: 90px;
		min-height: 100vh;
		background: var(--bg-secondary);
	}

	@media (max-width: 768px) {
		.main-content {
			padding-top: 70px;
			padding-bottom: 80px;
		}
	}
</style>
