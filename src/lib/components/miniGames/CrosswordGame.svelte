<script lang="ts">
	import { onMount } from 'svelte';
	import { miniGameFunctions, currentMiniGame } from '$lib/stores/miniGames';
	import type { MiniGame, CrosswordData, CrosswordClue } from '$lib/types';
	import { Trophy, Clock, Lightbulb, Check, X } from 'lucide-svelte';

	export let gameId: string;

	let game: MiniGame | undefined = undefined;
	let crosswordData: CrosswordData | null = null;
	let grid: (string | null)[][] = [];
	let userAnswers: string[][] = [];
	let selectedClue: CrosswordClue | null = null;
	let selectedCell: { row: number; col: number } | null = null;
	let timeElapsed = 0;
	let timer: number;
	let hintsUsed = 0;
	let isCompleted = false;
	let showHint = false;
	let hintText = '';

	onMount(() => {
		loadGame();
		startTimer();
		return () => {
			if (timer) clearInterval(timer);
		};
	});

	function loadGame() {
		game = miniGameFunctions.getMiniGameById(gameId);
		if (game?.data && 'clues' in game.data) {
			crosswordData = game.data as CrosswordData;
			initializeGrid();
		}
	}

	function initializeGrid() {
		if (!crosswordData) return;

		const { gridSize } = crosswordData;
		if (!gridSize) return;
		
		grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
		userAnswers = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

		// Place words in grid based on clue positions
		crosswordData.clues.forEach(clue => {
			const { startRow, startCol, direction, answer } = clue;
			for (let i = 0; i < answer.length; i++) {
				const row = direction === 'across' ? startRow : startRow + i;
				const col = direction === 'across' ? startCol + i : startCol;
				if (row < gridSize && col < gridSize) {
					grid[row][col] = answer[i].toUpperCase();
				}
			}
		});
	}

	function startTimer() {
		timer = setInterval(() => {
			timeElapsed++;
		}, 1000);
	}

	function selectClue(clue: CrosswordClue) {
		selectedClue = clue;
		selectedCell = { row: clue.startRow, col: clue.startCol };
		showHint = false;
	}

	function selectCell(row: number, col: number) {
		if (grid[row][col] === null) return;
		
		selectedCell = { row, col };
		
		// Find clue that contains this cell
		const clue = crosswordData?.clues.find(c => {
			const { startRow, startCol, direction, answer } = c;
			if (direction === 'across') {
				return row === startRow && col >= startCol && col < startCol + answer.length;
			} else {
				return col === startCol && row >= startRow && row < startRow + answer.length;
			}
		});
		
		if (clue) {
			selectedClue = clue;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (!selectedCell || !selectedClue || isCompleted) return;

		const { row, col } = selectedCell;
		const key = event.key.toUpperCase();

		if (key.match(/[A-Z]/)) {
			userAnswers[row][col] = key;
			moveToNextCell();
			checkCompletion();
		} else if (key === 'BACKSPACE') {
			userAnswers[row][col] = '';
			moveToPrevCell();
		}
	}

	function moveToNextCell() {
		if (!selectedClue || !selectedCell) return;

		const { direction, startRow, startCol, answer } = selectedClue;
		const { row, col } = selectedCell;

		if (direction === 'across') {
			const nextCol = col + 1;
			if (nextCol < startCol + answer.length) {
				selectedCell = { row, col: nextCol };
			}
		} else {
			const nextRow = row + 1;
			if (nextRow < startRow + answer.length) {
				selectedCell = { row: nextRow, col };
			}
		}
	}

	function moveToPrevCell() {
		if (!selectedClue || !selectedCell) return;

		const { direction, startRow, startCol } = selectedClue;
		const { row, col } = selectedCell;

		if (direction === 'across') {
			const prevCol = col - 1;
			if (prevCol >= startCol) {
				selectedCell = { row, col: prevCol };
			}
		} else {
			const prevRow = row - 1;
			if (prevRow >= startRow) {
				selectedCell = { row: prevRow, col };
			}
		}
	}

	function useHint() {
		if (!selectedClue || hintsUsed >= 3) return;

		hintsUsed++;
		hintText = selectedClue.hint || 'No hint available for this clue.';
		showHint = true;

		setTimeout(() => {
			showHint = false;
		}, 5000);
	}

	function checkCompletion() {
		if (!crosswordData) return;

		const allCorrect = crosswordData.clues.every(clue => {
			const { startRow, startCol, direction, answer } = clue;
			for (let i = 0; i < answer.length; i++) {
				const row = direction === 'across' ? startRow : startRow + i;
				const col = direction === 'across' ? startCol + i : startCol;
				if (userAnswers[row][col] !== answer[i].toUpperCase()) {
					return false;
				}
			}
			return true;
		});

		if (allCorrect) {
			isCompleted = true;
			clearInterval(timer);
			completeGame();
		}
	}

	function completeGame() {
		if (!game) return;

		const basePoints = game.basePoints;
		const timeBonus = Math.max(0, 300 - timeElapsed) * 2; // Bonus for completing under 5 minutes
		const hintPenalty = hintsUsed * 10;
		const finalScore = Math.max(basePoints + timeBonus - hintPenalty, 0);

		miniGameFunctions.completeMiniGame(game.id, finalScore, timeElapsed, hintsUsed);
	}

	function getCellClass(row: number, col: number): string {
		const isActive = grid[row][col] !== null;
		const isSelected = selectedCell?.row === row && selectedCell?.col === col;
		const isInSelectedClue = selectedClue && isInClue(row, col, selectedClue);
		const isCorrect = isActive && userAnswers[row][col] === grid[row][col];
		const hasAnswer = isActive && userAnswers[row][col] !== '';

		return [
			'cell',
			isActive ? 'active' : 'inactive',
			isSelected ? 'selected' : '',
			isInSelectedClue ? 'highlighted' : '',
			hasAnswer ? (isCorrect ? 'correct' : 'incorrect') : ''
		].filter(Boolean).join(' ');
	}

	function isInClue(row: number, col: number, clue: CrosswordClue): boolean {
		const { startRow, startCol, direction, answer } = clue;
		if (direction === 'across') {
			return row === startRow && col >= startCol && col < startCol + answer.length;
		} else {
			return col === startCol && row >= startRow && row < startRow + answer.length;
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function handleCellKeydown(event: KeyboardEvent, row: number, col: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectCell(row, col);
		}
	}

	function handleClueKeydown(event: KeyboardEvent, clue: CrosswordClue) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectClue(clue);
		}
	}

	function getClueProgress(clue: CrosswordClue): number {
		const { startRow, startCol, direction, answer } = clue;
		let correct = 0;
		
		for (let i = 0; i < answer.length; i++) {
			const row = direction === 'across' ? startRow : startRow + i;
			const col = direction === 'across' ? startCol + i : startCol;
			if (userAnswers[row][col] === answer[i].toUpperCase()) {
				correct++;
			}
		}
		
		return (correct / answer.length) * 100;
	}
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="crossword-game">
	{#if game && crosswordData}
		<!-- Game Header -->
		<div class="game-header">
			<div class="game-info">
				<h1>{game.title}</h1>
				<p class="difficulty difficulty-{game.difficulty}">{game.difficulty.toUpperCase()}</p>
			</div>
			<div class="game-stats">
				<div class="stat">
					<Clock size={16} />
					<span>{formatTime(timeElapsed)}</span>
				</div>
				<div class="stat">
					<Trophy size={16} />
					<span>{game.basePoints} pts</span>
				</div>
				<div class="stat">
					<Lightbulb size={16} />
					<span>{3 - hintsUsed} hints</span>
				</div>
			</div>
		</div>

		{#if showHint}
			<div class="hint-popup">
				<div class="hint-content">
					<Lightbulb size={20} />
					<p>{hintText}</p>
				</div>
			</div>
		{/if}

		{#if isCompleted}
			<div class="completion-popup">
				<div class="completion-content">
					<Trophy size={48} />
					<h2>Congratulations!</h2>
					<p>You completed the crossword puzzle!</p>
					<div class="final-stats">
						<div>Time: {formatTime(timeElapsed)}</div>
						<div>Hints Used: {hintsUsed}</div>
						<div>Score: {game.basePoints + Math.max(0, 300 - timeElapsed) * 2 - hintsUsed * 10}</div>
					</div>
				</div>
			</div>
		{/if}

		<div class="game-content">
			<!-- Crossword Grid -->
			<div class="crossword-grid">
				{#each grid as row, rowIndex}
					<div class="grid-row">
						{#each row as cell, colIndex}
							<div
								class={getCellClass(rowIndex, colIndex)}
								on:click={() => selectCell(rowIndex, colIndex)}
								on:keydown={(event) => handleCellKeydown(event, rowIndex, colIndex)}
								role="button"
								tabindex={grid[rowIndex][colIndex] !== null ? 0 : -1}
							>
								{#if grid[rowIndex][colIndex] !== null}
									<input
										type="text"
										maxlength="1"
										value={userAnswers[rowIndex][colIndex]}
										readonly
										class="cell-input"
									/>
									{#if crosswordData.clues.some(clue => 
										(clue.direction === 'across' && clue.startRow === rowIndex && clue.startCol === colIndex) ||
										(clue.direction === 'down' && clue.startRow === rowIndex && clue.startCol === colIndex)
									)}
										<span class="clue-number">
											{crosswordData.clues.findIndex(clue => 
												(clue.direction === 'across' && clue.startRow === rowIndex && clue.startCol === colIndex) ||
												(clue.direction === 'down' && clue.startRow === rowIndex && clue.startCol === colIndex)
											) + 1}
										</span>
									{/if}
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>

			<!-- Clues Panel -->
			<div class="clues-panel">
				<div class="clues-section">
					<h3>Across</h3>
					<div class="clues-list">
						{#each crosswordData.clues.filter(c => c.direction === 'across') as clue, index}
							<div
								class="clue-item {selectedClue === clue ? 'selected' : ''}"
								on:click={() => selectClue(clue)}
								on:keydown={(event) => handleClueKeydown(event, clue)}
								role="button"
								tabindex="0"
							>
								<div class="clue-header">
									<span class="clue-number">{index + 1}</span>
									<div class="clue-progress">
										<div class="progress-bar" style="width: {getClueProgress(clue)}%"></div>
									</div>
								</div>
								<p class="clue-text">{clue.clue}</p>
								<span class="clue-length">({clue.answer.length} letters)</span>
							</div>
						{/each}
					</div>
				</div>

				<div class="clues-section">
					<h3>Down</h3>
					<div class="clues-list">
						{#each crosswordData.clues.filter(c => c.direction === 'down') as clue, index}
							<div
								class="clue-item {selectedClue === clue ? 'selected' : ''}"
								on:click={() => selectClue(clue)}
								on:keydown={(event) => handleClueKeydown(event, clue)}
								role="button"
								tabindex="0"
							>
								<div class="clue-header">
									<span class="clue-number">{crosswordData.clues.filter(c => c.direction === 'across').length + index + 1}</span>
									<div class="clue-progress">
										<div class="progress-bar" style="width: {getClueProgress(clue)}%"></div>
									</div>
								</div>
								<p class="clue-text">{clue.clue}</p>
								<span class="clue-length">({clue.answer.length} letters)</span>
							</div>
						{/each}
					</div>
				</div>

				<div class="game-actions">
					<button
						class="hint-button"
						on:click={useHint}
						disabled={!selectedClue || hintsUsed >= 3}
					>
						<Lightbulb size={16} />
						Use Hint ({3 - hintsUsed} left)
					</button>
				</div>
			</div>
		</div>
	{:else}
		<div class="loading">
			<p>Loading crossword puzzle...</p>
		</div>
	{/if}
</div>

<style>
	.crossword-game {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
	}

	.game-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
	}

	.difficulty-easy { background: #10b981; }
	.difficulty-medium { background: #f59e0b; }
	.difficulty-hard { background: #ef4444; }

	.game-stats {
		display: flex;
		gap: 1.5rem;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 500;
	}

	.hint-popup {
		position: fixed;
		top: 20%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		background: #1f2937;
		color: white;
		padding: 1rem 1.5rem;
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
		animation: slideDown 0.3s ease-out;
	}

	.hint-content {
		display: flex;
		align-items: center;
		gap: 0.75rem;
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
		grid-template-columns: 1fr 400px;
		gap: 2rem;
	}

	.crossword-grid {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: #374151;
		padding: 1px;
		border-radius: 8px;
		width: fit-content;
		margin: 0 auto;
	}

	.grid-row {
		display: flex;
		gap: 1px;
	}

	.cell {
		width: 40px;
		height: 40px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 2px;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.cell.inactive {
		background: #374151;
	}

	.cell.active {
		background: white;
		border: 1px solid #d1d5db;
	}

	.cell.selected {
		background: #dbeafe;
		border-color: #3b82f6;
		box-shadow: 0 0 0 2px #3b82f6;
	}

	.cell.highlighted {
		background: #fef3c7;
		border-color: #f59e0b;
	}

	.cell.correct {
		background: #d1fae5;
		border-color: #10b981;
	}

	.cell.incorrect {
		background: #fee2e2;
		border-color: #ef4444;
	}

	.cell-input {
		width: 100%;
		height: 100%;
		border: none;
		background: transparent;
		text-align: center;
		font-size: 1.1rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.clue-number {
		position: absolute;
		top: 2px;
		left: 2px;
		font-size: 0.7rem;
		font-weight: 600;
		color: #6b7280;
	}

	.clues-panel {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		height: fit-content;
	}

	.clues-section {
		margin-bottom: 2rem;
	}

	.clues-section h3 {
		margin: 0 0 1rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #e5e7eb;
		color: #374151;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.clues-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.clue-item {
		padding: 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.clue-item:hover {
		background: #f9fafb;
		border-color: #d1d5db;
	}

	.clue-item.selected {
		background: #eff6ff;
		border-color: #3b82f6;
		box-shadow: 0 0 0 1px #3b82f6;
	}

	.clue-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.clue-header .clue-number {
		position: static;
		background: #374151;
		color: white;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.clue-progress {
		flex: 1;
		height: 4px;
		background: #e5e7eb;
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: #10b981;
		transition: width 0.3s ease;
	}

	.clue-text {
		margin: 0 0 0.25rem 0;
		font-size: 0.9rem;
		line-height: 1.4;
		color: #374151;
	}

	.clue-length {
		font-size: 0.75rem;
		color: #6b7280;
		font-style: italic;
	}

	.game-actions {
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.hint-button {
		width: 100%;
		padding: 0.75rem 1rem;
		background: #f59e0b;
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.hint-button:hover:not(:disabled) {
		background: #d97706;
		transform: translateY(-1px);
	}

	.hint-button:disabled {
		background: #d1d5db;
		color: #9ca3af;
		cursor: not-allowed;
	}

	.loading {
		text-align: center;
		padding: 4rem;
		color: #6b7280;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translate(-50%, -20px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
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

		.clues-panel {
			order: -1;
		}

		.crossword-grid {
			margin: 0;
		}

		.cell {
			width: 35px;
			height: 35px;
		}
	}

	@media (max-width: 640px) {
		.game-header {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.game-stats {
			justify-content: center;
		}

		.cell {
			width: 30px;
			height: 30px;
		}

		.cell-input {
			font-size: 1rem;
		}
	}
</style>