<script lang="ts">
	import { page } from '$app/stores';
	import QuickQuizGame from '$lib/components/miniGames/QuickQuizGame.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let gameId: string;

	onMount(() => {
		gameId = $page.params.gameId;
		
		// Validate that the game exists and is a quick quiz type
		// If not valid, redirect back to mini-games
		if (!gameId) {
			goto('/mini-games');
		}
	});
</script>

<svelte:head>
	<title>Quick Quiz - Edu Ruang</title>
	<meta name="description" content="Test your knowledge with our fast-paced educational quizzes" />
</svelte:head>

<div class="quick-quiz-page">
	{#if gameId}
		<QuickQuizGame {gameId} />
	{:else}
		<div class="loading">
			<p>Loading quiz...</p>
		</div>
	{/if}
</div>

<style>
	.quick-quiz-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
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