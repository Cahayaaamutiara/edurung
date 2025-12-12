<script lang="ts">
	import { page } from '$app/stores';
	import PicturePuzzleGame from '$lib/components/miniGames/PicturePuzzleGame.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let gameId: string | undefined;

	onMount(() => {
		const paramGameId = $page.params.gameId;
		
		// Validate that the game exists and is a picture puzzle type
		// If not valid, redirect back to mini-games
		if (!paramGameId) {
			goto('/mini-games');
			return;
		}
		
		gameId = paramGameId;
	});
</script>

<svelte:head>
	<title>Picture Puzzle - Edu Ruang</title>
	<meta name="description" content="Solve educational picture puzzles and improve your visual learning" />
</svelte:head>

<div class="picture-puzzle-page">
	{#if gameId}
		<PicturePuzzleGame {gameId} />
	{:else}
		<div class="loading">
			<p>Loading picture puzzle...</p>
		</div>
	{/if}
</div>

<style>
	.picture-puzzle-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
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