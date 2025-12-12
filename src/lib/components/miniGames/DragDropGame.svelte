<script lang="ts">
	import { onMount } from 'svelte';
	import { miniGameFunctions } from '$lib/stores/miniGames';
	import type { MiniGame, DragDropData, DragDropItem } from '$lib/types';
	import { Trophy, Clock, RotateCw, Check, X, GripVertical } from 'lucide-svelte';

	export let gameId: string;

	let game: MiniGame | undefined = undefined;
	let dragDropData: DragDropData | null = null;
	let items: DragDropItem[] = [];
	let dropZones: { id: string; label: string; items: DragDropItem[] }[] = [];
	let draggedItem: DragDropItem | null = null;
	let timeElapsed = 0;
	let timer: number;
	let isCompleted = false;
	let score = 0;
	let correctPlacements = 0;
	let totalAttempts = 0;

	$: accuracy = totalAttempts > 0 ? (correctPlacements / totalAttempts) * 100 : 0;

	onMount(() => {
		loadGame();
		startTimer();
		return () => {
			if (timer) clearInterval(timer);
		};
	});

	function loadGame() {
		game = miniGameFunctions.getMiniGameById(gameId);
		if (game?.data && 'items' in game.data) {
			dragDropData = game.data as DragDropData;
			initializeGame();
		}
	}

	function initializeGame() {
		if (!dragDropData) return;

		// Initialize items in random order
		items = [...dragDropData.items].sort(() => Math.random() - 0.5);
		
		// Initialize drop zones
		dropZones = dragDropData.categories.map(category => ({
			id: category.id,
			label: category.name,
			items: []
		}));
	}

	function startTimer() {
		timer = setInterval(() => {
			timeElapsed++;
		}, 1000);
	}

	function handleDragStart(event: DragEvent, item: DragDropItem) {
		draggedItem = item;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', item.id);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	function handleDrop(event: DragEvent, targetZoneId: string) {
		event.preventDefault();
		
		if (!draggedItem) return;

		totalAttempts++;
		const isCorrect = draggedItem.correctCategory === targetZoneId;
		
		if (isCorrect) {
			correctPlacements++;
			score += 10; // Base points for correct placement
			
			// Time bonus
			if (timeElapsed < 60) {
				score += 5; // Bonus for quick placement
			}
		}

		// Remove item from items array
		items = items.filter(item => item.id !== draggedItem?.id);
		
		// Add item to target zone
		const targetZone = dropZones.find(zone => zone.id === targetZoneId);
		if (targetZone && draggedItem) {
			targetZone.items = [...targetZone.items, { ...draggedItem, isCorrect }];
		}
		
		dropZones = [...dropZones];
		draggedItem = null;

		checkCompletion();
	}

	function handleDropToItems(event: DragEvent) {
		event.preventDefault();
		
		if (!draggedItem) return;

		// Find the item in drop zones and remove it
		dropZones.forEach(zone => {
			const itemIndex = zone.items.findIndex(item => item.id === draggedItem?.id);
			if (itemIndex !== -1) {
				zone.items.splice(itemIndex, 1);
				// Add back to items array
				if (draggedItem) {
					items = [...items, { ...draggedItem, isCorrect: undefined }];
				}
			}
		});
		
		dropZones = [...dropZones];
		draggedItem = null;
	}

	function checkCompletion() {
		if (items.length === 0) {
			// All items have been placed
			const allCorrect = dropZones.every(zone => 
				zone.items.every(item => item.isCorrect === true)
			);
			
			if (allCorrect) {
				isCompleted = true;
				clearInterval(timer);
				completeGame();
			}
		}
	}

	function completeGame() {
		if (!game) return;

		// Calculate final score with bonuses
		let finalScore = score;
		
		// Accuracy bonus
		if (accuracy >= 90) finalScore += 50;
		else if (accuracy >= 80) finalScore += 30;
		else if (accuracy >= 70) finalScore += 20;
		
		// Time bonus
		if (timeElapsed < 120) finalScore += 30;
		else if (timeElapsed < 180) finalScore += 20;
		else if (timeElapsed < 300) finalScore += 10;

		miniGameFunctions.completeMiniGame(game.id, finalScore, timeElapsed, 0);
	}

	function resetGame() {
		if (confirm('Are you sure you want to reset the game?')) {
			initializeGame();
			timeElapsed = 0;
			isCompleted = false;
			score = 0;
			correctPlacements = 0;
			totalAttempts = 0;
			clearInterval(timer);
			startTimer();
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function getZoneClass(zoneId: string): string {
		const zone = dropZones.find(z => z.id === zoneId);
		if (!zone) return 'drop-zone';
		
		const hasIncorrect = zone.items.some(item => item.isCorrect === false);
		const allCorrect = zone.items.length > 0 && zone.items.every(item => item.isCorrect === true);
		
		return [
			'drop-zone',
			hasIncorrect ? 'has-incorrect' : '',
			allCorrect ? 'all-correct' : ''
		].filter(Boolean).join(' ');
	}

	function getItemClass(item: DragDropItem): string {
		return [
			'drag-item',
			item.isCorrect === true ? 'correct' : '',
			item.isCorrect === false ? 'incorrect' : ''
		].filter(Boolean).join(' ');
	}
</script>

<div class="drag-drop-game">
	{#if game && dragDropData}
		<!-- Game Header -->
		<div class="game-header">
			<div class="game-info">
				<h1>{game.title}</h1>
				<p class="difficulty difficulty-{game.difficulty}">{game.difficulty.toUpperCase()}</p>
				<p class="description">{dragDropData.instructions}</p>
			</div>
			<div class="game-stats">
				<div class="stat">
					<Clock size={16} />
					<span>{formatTime(timeElapsed)}</span>
				</div>
				<div class="stat">
					<Trophy size={16} />
					<span>{score} pts</span>
				</div>
				<div class="stat">
					<Check size={16} />
					<span>{correctPlacements}/{totalAttempts}</span>
				</div>
				{#if totalAttempts > 0}
					<div class="stat">
						<span>{accuracy.toFixed(1)}% accuracy</span>
					</div>
				{/if}
			</div>
		</div>

		{#if isCompleted}
			<div class="completion-popup">
				<div class="completion-content">
					<Check size={48} />
					<h2>Excellent Work!</h2>
					<p>You've successfully categorized all items!</p>
					<div class="final-stats">
						<div>Time: {formatTime(timeElapsed)}</div>
						<div>Accuracy: {accuracy.toFixed(1)}%</div>
						<div>Final Score: {score + (accuracy >= 90 ? 50 : accuracy >= 80 ? 30 : accuracy >= 70 ? 20 : 0) + (timeElapsed < 120 ? 30 : timeElapsed < 180 ? 20 : timeElapsed < 300 ? 10 : 0)}</div>
					</div>
				</div>
			</div>
		{/if}

		<div class="game-content">
			<!-- Items Pool -->
			<div class="items-pool">
				<div class="pool-header">
					<h3>Drag items to the correct categories</h3>
					<button class="reset-button" on:click={resetGame}>
						<RotateCw size={16} />
						Reset
					</button>
				</div>
				
				<div 
					class="items-container"
					on:dragover={handleDragOver}
					on:drop={handleDropToItems}
					role="region"
					aria-label="Items pool - drag items to categories or back here to reorganize"
				>
					{#each items as item}
						<div
							class={getItemClass(item)}
							draggable="true"
							on:dragstart={(e) => handleDragStart(e, item)}
							role="button"
							tabindex="0"
						>
							<GripVertical size={16} class="drag-handle" />
							{#if item.image}
								<img src={item.image} alt={item.label} class="item-image" />
							{/if}
							<span class="item-label">{item.label}</span>
						</div>
					{/each}
					
					{#if items.length === 0}
						<div class="empty-state">
							<p>All items have been categorized!</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Drop Zones -->
			<div class="drop-zones">
				<h3>Categories</h3>
				<div class="zones-grid">
					{#each dropZones as zone}
						<div
							class={getZoneClass(zone.id)}
							on:dragover={handleDragOver}
							on:drop={(e) => handleDrop(e, zone.id)}
							role="region"
							aria-label={`Drop zone for ${zone.label} category`}
						>
							<div class="zone-header">
								<h4>{zone.label}</h4>
								<span class="zone-count">{zone.items.length} items</span>
							</div>
							
							<div class="zone-items">
								{#each zone.items as item}
									<div
										class={getItemClass(item)}
										draggable="true"
										on:dragstart={(e) => handleDragStart(e, item)}
										role="button"
										tabindex="0"
									>
										<GripVertical size={14} class="drag-handle" />
										{#if item.image}
											<img src={item.image} alt={item.label} class="item-image small" />
										{/if}
										<span class="item-label">{item.label}</span>
										{#if item.isCorrect === true}
											<Check size={16} class="status-icon correct" />
										{:else if item.isCorrect === false}
											<X size={16} class="status-icon incorrect" />
										{/if}
									</div>
								{/each}
								
								{#if zone.items.length === 0}
									<div class="zone-placeholder">
										<p>Drop {zone.label.toLowerCase()} items here</p>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Progress Indicator -->
		<div class="progress-section">
			<div class="progress-info">
				<span>Items placed: {totalAttempts > 0 ? correctPlacements : 0} / {dragDropData.items.length}</span>
				<div class="progress-bar">
					<div 
						class="progress-fill" 
						style="width: {(correctPlacements / dragDropData.items.length) * 100}%"
					></div>
				</div>
			</div>
		</div>
	{:else}
		<div class="loading">
			<p>Loading drag and drop game...</p>
		</div>
	{/if}
</div>

<style>
	.drag-drop-game {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
	}

	.game-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
		border-radius: 12px;
		color: white;
	}

	.game-info h1 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.difficulty {
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		margin-bottom: 0.5rem;
		display: inline-block;
	}

	.difficulty-easy { background: #10b981; }
	.difficulty-medium { background: #f59e0b; }
	.difficulty-hard { background: #ef4444; }

	.description {
		margin: 0;
		opacity: 0.9;
		font-size: 0.9rem;
	}

	.game-stats {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		text-align: right;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 500;
		justify-content: flex-end;
	}

	.completion-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.completion-content {
		background: white;
		padding: 2rem;
		border-radius: 16px;
		text-align: center;
		max-width: 400px;
		animation: popIn 0.5s ease-out;
	}

	.completion-content h2 {
		margin: 1rem 0;
		color: #059669;
	}

	.final-stats {
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.game-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.items-pool {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.pool-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.pool-header h3 {
		margin: 0;
		color: #374151;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.reset-button {
		padding: 0.5rem 1rem;
		background: #6b7280;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.8rem;
		cursor: pointer;
		transition: background 0.2s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.reset-button:hover {
		background: #4b5563;
	}

	.items-container {
		min-height: 400px;
		border: 2px dashed #d1d5db;
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.drag-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: #f9fafb;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		cursor: grab;
		transition: all 0.2s ease;
		user-select: none;
	}

	.drag-item:hover {
		background: #f3f4f6;
		border-color: #d1d5db;
		transform: translateY(-1px);
	}

	.drag-item:active {
		cursor: grabbing;
	}

	.drag-item.correct {
		background: #d1fae5;
		border-color: #10b981;
		color: #065f46;
	}

	.drag-item.incorrect {
		background: #fee2e2;
		border-color: #ef4444;
		color: #991b1b;
	}

	.drag-handle {
		color: #9ca3af;
		flex-shrink: 0;
	}

	.item-image {
		width: 40px;
		height: 40px;
		object-fit: cover;
		border-radius: 6px;
		flex-shrink: 0;
	}

	.item-image.small {
		width: 24px;
		height: 24px;
	}

	.item-label {
		flex: 1;
		font-weight: 500;
	}

	.status-icon {
		flex-shrink: 0;
	}

	.status-icon.correct {
		color: #10b981;
	}

	.status-icon.incorrect {
		color: #ef4444;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 200px;
		color: #9ca3af;
		font-style: italic;
	}

	.drop-zones {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.drop-zones h3 {
		margin: 0 0 1.5rem 0;
		color: #374151;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.zones-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.drop-zone {
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		padding: 1rem;
		min-height: 120px;
		transition: all 0.2s ease;
	}

	.drop-zone:hover {
		border-color: #d1d5db;
	}

	.drop-zone.has-incorrect {
		border-color: #fca5a5;
		background: #fef2f2;
	}

	.drop-zone.all-correct {
		border-color: #6ee7b7;
		background: #f0fdf4;
	}

	.zone-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.zone-header h4 {
		margin: 0;
		color: #374151;
		font-size: 1rem;
		font-weight: 600;
	}

	.zone-count {
		color: #6b7280;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.zone-items {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.zone-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60px;
		color: #9ca3af;
		font-style: italic;
		font-size: 0.9rem;
		border: 2px dashed #e5e7eb;
		border-radius: 6px;
	}

	.progress-section {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.progress-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		color: #374151;
		font-weight: 500;
	}

	.progress-bar {
		flex: 1;
		height: 8px;
		background: #e5e7eb;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #8b5cf6;
		transition: width 0.3s ease;
	}

	.loading {
		text-align: center;
		padding: 4rem;
		color: #6b7280;
	}

	@keyframes popIn {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@media (max-width: 1024px) {
		.game-content {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.drop-zones {
			order: -1;
		}
	}

	@media (max-width: 640px) {
		.game-header {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.game-stats {
			flex-direction: row;
			justify-content: center;
			text-align: center;
			flex-wrap: wrap;
		}

		.pool-header {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.progress-info {
			flex-direction: column;
			gap: 0.5rem;
			align-items: stretch;
		}
	}
</style>