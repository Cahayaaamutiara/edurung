<script lang="ts">
	import { page } from '$app/stores';
	import CrosswordGame from '$lib/components/miniGames/CrosswordGame.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let gameId: string;

	onMount(() => {
		// Type guard to ensure gameId is not undefined
		const id = $page.params.gameId;
		if (!id) {
			goto('/mini-games');
			return;
		}
		
		gameId = id;
		
		// Validate that the game exists and is a crossword type
		// If not valid, redirect back to mini-games
		if (!gameId) {
			goto('/mini-games');
		}
	});
</script>

<svelte:head>
	<title>Crossword Puzzle - Edu Ruang</title>
	<meta name="description" content="Challenge yourself with our educational crossword puzzles" />
</svelte:head>

<div class="crossword-page">
	{#if gameId}
		<CrosswordGame {gameId} />
	{:else}
		<div class="loading">
			<p>Loading crossword puzzle...</p>
		</div>
	{/if}
</div>

<style>
	.crossword-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
		padding: 1rem 0;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50vh;
		color: #6b7280;
		font-size: 1.1rem;
	}
</style>