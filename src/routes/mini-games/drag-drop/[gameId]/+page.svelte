<script lang="ts">
	import { page } from '$app/stores';
	import DragDropGame from '$lib/components/miniGames/DragDropGame.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let gameId: string;

	onMount(() => {
		gameId = $page.params.gameId;
		
		// Validate that the game exists and is a drag-drop type
		// If not valid, redirect back to mini-games
		if (!gameId) {
			goto('/mini-games');
		}
	});
</script>

<svelte:head>
	<title>Drag & Drop Game - Edu Ruang</title>
	<meta name="description" content="Learn by categorizing and organizing concepts with drag and drop games" />
</svelte:head>

<div class="drag-drop-page">
	{#if gameId}
		<DragDropGame {gameId} />
	{:else}
		<div class="loading">
			<p>Loading drag and drop game...</p>
		</div>
	{/if}
</div>

<style>
	.drag-drop-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
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