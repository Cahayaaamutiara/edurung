<script lang="ts">
	import { onMount } from "svelte";
	import { miniGameFunctions } from "$lib/stores/miniGames";
	import { currentUser } from "$lib/stores/auth";
	import type { MiniGame, PicturePuzzleData } from "$lib/types";
	import { Trophy, Clock, RotateCw, Shuffle, Check } from "lucide-svelte";

	export let gameId: string;

	let game: MiniGame | undefined = undefined;
	let puzzleData: PicturePuzzleData | null = null;
	let pieces: {
		id: number;
		src: string;
		correctPosition: number;
		currentPosition: number;
	}[] = [];
	let draggedPiece: number | null = null;
	let timeElapsed = 0;
	let timer: number;
	let isCompleted = false;
	let movesCount = 0;
	let showPreview = true;
	let previewTimer: number;
	let user = $currentUser;

	onMount(() => {
		loadGame();
		startTimer();
		showPreviewForStart();
		return () => {
			if (timer) clearInterval(timer);
			if (previewTimer) clearTimeout(previewTimer);
		};
	});

	function loadGame() {
		game = miniGameFunctions.getMiniGameById(gameId);
		if (game?.data && "pieces" in game.data) {
			puzzleData = game.data as PicturePuzzleData;
			initializePuzzle();
		}
	}

	function initializePuzzle() {
		if (!puzzleData) return;

		pieces = puzzleData.pieces.map((piece, index) => ({
			id: index,
			src: piece.src,
			correctPosition: piece.correctPosition,
			currentPosition: index,
		}));

		// Shuffle pieces
		shufflePieces();
	}

	function startTimer() {
		timer = setInterval(() => {
			timeElapsed++;
		}, 1000);
	}

	function showPreviewForStart() {
		previewTimer = setTimeout(() => {
			showPreview = false;
		}, 3000);
	}

	function shufflePieces() {
		const shuffled = [...pieces];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i].currentPosition, shuffled[j].currentPosition] = [
				shuffled[j].currentPosition,
				shuffled[i].currentPosition,
			];
		}
		pieces = shuffled;
		movesCount = 0;
	}

	function handleDragStart(event: DragEvent, pieceId: number) {
		draggedPiece = pieceId;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = "move";
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = "move";
		}
	}

	function handleDrop(event: DragEvent, targetPosition: number) {
		event.preventDefault();

		if (draggedPiece === null) return;

		const draggedIndex = pieces.findIndex((p) => p.id === draggedPiece);
		const targetIndex = pieces.findIndex(
			(p) => p.currentPosition === targetPosition,
		);

		if (draggedIndex !== -1 && targetIndex !== -1) {
			// Swap positions
			const temp = pieces[draggedIndex].currentPosition;
			pieces[draggedIndex].currentPosition =
				pieces[targetIndex].currentPosition;
			pieces[targetIndex].currentPosition = temp;

			pieces = [...pieces];
			movesCount++;
			checkCompletion();
		}

		draggedPiece = null;
	}

	function handlePieceClick(pieceId: number) {
		// For mobile/touch support - simple adjacent swap logic
		const clickedPiece = pieces.find((p) => p.id === pieceId);
		if (!clickedPiece) return;

		// Find empty space (if any) or swap with adjacent piece
		const currentPos = clickedPiece.currentPosition;
		const gridSize = Math.sqrt(pieces.length);
		const row = Math.floor(currentPos / gridSize);
		const col = currentPos % gridSize;

		// Check adjacent positions for empty space or clickable piece
		const adjacentPositions = [
			{ row: row - 1, col }, // up
			{ row: row + 1, col }, // down
			{ row, col: col - 1 }, // left
			{ row, col: col + 1 }, // right
		].filter(
			(pos) =>
				pos.row >= 0 &&
				pos.row < gridSize &&
				pos.col >= 0 &&
				pos.col < gridSize,
		);

		// For simplicity, swap with the first valid adjacent piece
		const adjacentPos = adjacentPositions[0];
		if (adjacentPos) {
			const targetPosition = adjacentPos.row * gridSize + adjacentPos.col;
			const targetPiece = pieces.find(
				(p) => p.currentPosition === targetPosition,
			);

			if (targetPiece) {
				// Swap positions
				const temp = clickedPiece.currentPosition;
				clickedPiece.currentPosition = targetPiece.currentPosition;
				targetPiece.currentPosition = temp;

				pieces = [...pieces];
				movesCount++;
				checkCompletion();
			}
		}
	}

	function handleKeyDown(event: KeyboardEvent, callback: () => void) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			callback();
		}
	}

	function handleDropKeyDown(event: KeyboardEvent, position: number) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			// Create a synthetic drop event for keyboard users
			if (draggedPiece !== null) {
				const syntheticEvent = new DragEvent("drop");
				handleDrop(syntheticEvent, position);
			}
		}
	}

	function checkCompletion() {
		const isComplete = pieces.every(
			(piece) => piece.currentPosition === piece.correctPosition,
		);

		if (isComplete) {
			isCompleted = true;
			clearInterval(timer);
			completeGame();
		}
	}

	function completeGame() {
		if (!game) return;

		const basePoints = game.basePoints;
		const timeBonus = Math.max(0, 180 - timeElapsed) * 3; // Bonus for completing under 3 minutes
		const movesPenalty = Math.max(0, movesCount - pieces.length) * 2; // Penalty for excessive moves
		const finalScore = Math.max(basePoints + timeBonus - movesPenalty, 0);

		miniGameFunctions.completeMiniGame(game.id, finalScore, timeElapsed, 0);
	}

	function togglePreview() {
		showPreview = !showPreview;
	}

	function resetPuzzle() {
		if (confirm("Are you sure you want to reset the puzzle?")) {
			shufflePieces();
			timeElapsed = 0;
			isCompleted = false;
			clearInterval(timer);
			startTimer();
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}

	function getPieceAtPosition(position: number) {
		return pieces.find((piece) => piece.currentPosition === position);
	}

	function getPieceBackgroundPosition(correctPosition: number): string {
		const gridSize = Math.sqrt(pieces.length);
		const row = Math.floor(correctPosition / gridSize);
		const col = correctPosition % gridSize;

		const xPct = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
		const yPct = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;

		return `${xPct}% ${yPct}%`;
	}

	function getGridClass(position: number): string {
		const piece = getPieceAtPosition(position);
		const isCorrect = piece && piece.correctPosition === position;

		return [
			"puzzle-slot",
			isCorrect ? "correct" : "",
			draggedPiece !== null ? "drop-zone" : "",
		]
			.filter(Boolean)
			.join(" ");
	}
</script>

<div class="picture-puzzle-game">
	{#if game && puzzleData}
		<!-- Game Header -->
		<div class="game-header">
			<div class="game-info">
				{#if game.id === "puzzle-geography-1"}
					<h1>Susunlah puzzle peta Indonesia berikut ini!</h1>
				{:else}
					<h1>{game.title}</h1>
				{/if}
				<p class="difficulty difficulty-{game.difficulty}">
					{game.difficulty.toUpperCase()}
				</p>
				<p class="description">{puzzleData.description}</p>
			</div>
			<div class="game-header-right">
				{#if user && game.id === "puzzle-geography-1"}
					<div class="player-avatar">
						<span class="avatar-icon">{user.avatar}</span>
						<span class="player-name">{user.name}</span>
					</div>
				{/if}
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
						<RotateCw size={16} />
						<span>{movesCount} moves</span>
					</div>
				</div>
			</div>
		</div>

		{#if isCompleted}
			<div class="completion-popup">
				<div class="completion-content">
					<Check size={48} />
					<h2>Puzzle Completed!</h2>
					{#if game.id === "puzzle-geography-1"}
						<p>Selamat! Kamu berhasil menyusun peta Indonesia 🇮🇩</p>
					{:else}
						<p>Great job solving the picture puzzle!</p>
					{/if}
					{#if user && game.id === "puzzle-geography-1"}
						<div class="avatar-celebration">
							<span class="celebration-avatar">{user.avatar}</span
							>
							<span class="celebration-text"
								>Selamat {user.name}!</span
							>
						</div>
					{/if}
					<div class="final-stats">
						<div>Time: {formatTime(timeElapsed)}</div>
						<div>Moves: {movesCount}</div>
						<div>
							Score: {game.basePoints +
								Math.max(0, 180 - timeElapsed) * 3 -
								Math.max(0, movesCount - pieces.length) * 2}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<div class="game-content">
			<!-- Preview Panel -->
			<div class="preview-panel">
				<div class="preview-header">
					<h3>Reference Image</h3>
					<button class="preview-toggle" on:click={togglePreview}>
						{showPreview ? "Hide" : "Show"} Preview
					</button>
				</div>
				{#if showPreview}
					<div class="preview-image">
						<img
							src={puzzleData.completeImage}
							alt="Complete puzzle reference"
						/>
					</div>
				{/if}

				<div class="game-controls">
					<button class="control-button" on:click={shufflePieces}>
						<Shuffle size={16} />
						Shuffle
					</button>
					<button
						class="control-button secondary"
						on:click={resetPuzzle}
					>
						<RotateCw size={16} />
						Reset
					</button>
				</div>
			</div>

			<!-- Puzzle Grid -->
			<div class="puzzle-container">
				<div
					class="puzzle-grid"
					style="grid-template-columns: repeat({Math.sqrt(
						pieces.length,
					)}, 1fr);"
				>
					{#each Array(pieces.length) as _, position}
						<div
							class={getGridClass(position)}
							on:dragover={handleDragOver}
							on:drop={(e) => handleDrop(e, position)}
							on:keydown={(e) => handleDropKeyDown(e, position)}
							role="button"
							tabindex="0"
						>
							{#each pieces as piece}
								{#if piece.currentPosition === position}
									<div
										class="puzzle-piece {piece.correctPosition ===
										position
											? 'correct-position'
											: ''}"
										draggable="true"
										on:dragstart={(e) =>
											handleDragStart(e, piece.id)}
										on:click={() =>
											handlePieceClick(piece.id)}
										on:keydown={(e) =>
											handleKeyDown(e, () =>
												handlePieceClick(piece.id),
											)}
										role="button"
										tabindex="0"
									>
										<div
											class="piece-image"
											style="
												background-image: url({puzzleData.completeImage});
												background-size: {Math.sqrt(pieces.length) * 100}%;
												background-position: {getPieceBackgroundPosition(piece.correctPosition)};
											"
										></div>
										<div class="piece-number">
											{piece.id + 1}
										</div>
									</div>
								{/if}
							{/each}
						</div>
					{/each}
				</div>

				<div class="puzzle-progress">
					<div class="progress-info">
						<span
							>Progress: {pieces.filter(
								(p) => p.currentPosition === p.correctPosition,
							).length} / {pieces.length}</span
						>
						<div class="progress-bar">
							<div
								class="progress-fill"
								style="width: {(pieces.filter(
									(p) =>
										p.currentPosition === p.correctPosition,
								).length /
									pieces.length) *
									100}%"
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="loading">
			<p>Loading picture puzzle...</p>
		</div>
	{/if}
</div>

<style>
	.picture-puzzle-game {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui,
			sans-serif;
	}

	.game-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		border-radius: 12px;
		color: white;
	}

	.game-header-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 1rem;
	}

	.player-avatar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.2);
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-weight: 500;
	}

	.avatar-icon {
		font-size: 1.5rem;
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

	.difficulty-easy {
		background: #10b981;
	}
	.difficulty-medium {
		background: #f59e0b;
	}
	.difficulty-hard {
		background: #ef4444;
	}

	.description {
		margin: 0;
		opacity: 0.9;
		font-size: 0.9rem;
	}

	.game-stats {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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

	.avatar-celebration {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin: 1rem 0;
		animation: bounce 1s infinite;
	}

	.celebration-avatar {
		font-size: 2rem;
		animation: spin 2s infinite;
	}

	.celebration-text {
		font-weight: 600;
		color: #10b981;
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
		grid-template-columns: 300px 1fr;
		gap: 2rem;
	}

	.preview-panel {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		height: fit-content;
	}

	.preview-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.preview-header h3 {
		margin: 0;
		color: #374151;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.preview-toggle {
		padding: 0.5rem 1rem;
		background: #6b7280;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.8rem;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.preview-toggle:hover {
		background: #4b5563;
	}

	.preview-image {
		margin-bottom: 1.5rem;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.preview-image img {
		width: 100%;
		height: auto;
		display: block;
	}

	.game-controls {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.control-button {
		padding: 0.75rem 1rem;
		background: #3b82f6;
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

	.control-button:hover {
		background: #2563eb;
		transform: translateY(-1px);
	}

	.control-button.secondary {
		background: #6b7280;
	}

	.control-button.secondary:hover {
		background: #4b5563;
	}

	.puzzle-container {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.puzzle-grid {
		display: grid;
		gap: 4px;
		background: #e5e7eb;
		padding: 4px;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		aspect-ratio: 1;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.puzzle-slot {
		background: #f3f4f6;
		border-radius: 4px;
		position: relative;
		aspect-ratio: 1;
		transition: all 0.2s ease;
	}

	.puzzle-slot.drop-zone {
		background: #dbeafe;
		border: 2px dashed #3b82f6;
	}

	.puzzle-slot.correct {
		background: #d1fae5;
		border: 2px solid #10b981;
	}

	.puzzle-piece {
		width: 100%;
		height: 100%;
		position: relative;
		cursor: grab;
		border-radius: 4px;
		overflow: hidden;
		transition: all 0.2s ease;
		border: 2px solid transparent;
	}

	.puzzle-piece:hover {
		transform: scale(1.05);
		z-index: 10;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.puzzle-piece:active {
		cursor: grabbing;
	}

	.puzzle-piece.correct-position {
		border-color: #10b981;
		box-shadow: 0 0 0 1px #10b981;
	}

	.piece-image {
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
	}

	.piece-number {
		position: absolute;
		top: 4px;
		left: 4px;
		background: rgba(0, 0, 0, 0.7);
		color: white;
		font-size: 0.7rem;
		font-weight: 600;
		padding: 2px 6px;
		border-radius: 10px;
		line-height: 1;
	}

	.puzzle-progress {
		border-top: 1px solid #e5e7eb;
		padding-top: 1rem;
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
		background: #10b981;
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

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 1024px) {
		.game-content {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.preview-panel {
			order: -1;
		}

		.game-controls {
			flex-direction: row;
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
		}

		.puzzle-grid {
			max-width: 100%;
		}

		.progress-info {
			flex-direction: column;
			align-items: stretch;
			gap: 0.5rem;
		}
	}
</style>
