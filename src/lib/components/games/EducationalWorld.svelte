<script lang="ts">
	import { onMount } from 'svelte';
	import type { WorldTheme, GameLevel, Question } from '$lib/types/gamification';
	import { ChevronLeft, Trophy, Star, Zap } from 'lucide-svelte';

	const { 
		worldTheme = 'ipa',
		levels = [],
		currentLevelIndex = 0,
		onBack = () => {},
		onCompleteLevel = () => {}
	} = $props() as { 
		worldTheme?: WorldTheme;
		levels?: GameLevel[];
		currentLevelIndex?: number;
		onBack?: (event: MouseEvent) => void;
		onCompleteLevel?: (levelId: string, score: number) => void;
	};

	let currentQuestionIndex = $state(0);
	let userAnswers = $state([] as (string | number)[]);
	let showResult = $state(false);
	let score = $state(0);
	let timeLeft = $state(0);
	let timer: number | null = null;
	let isAnswered = $state(false);

	const currentLevel = $derived(levels[currentLevelIndex] || null);
	const currentQuestion = $derived(currentLevel?.questions?.[currentQuestionIndex] || null);

	onMount(() => {
		if (currentQuestion && currentQuestion.timeLimit) {
			startTimer(currentQuestion.timeLimit);
		}
	});

	function startTimer(seconds: number) {
		timeLeft = seconds;
		if (timer) clearInterval(timer);
		timer = setInterval(() => {
			timeLeft--;
			if (timeLeft <= 0) {
				clearInterval(timer!);
				submitAnswer(null);
			}
		}, 1000);
	}

	function selectAnswer(answer: string | number) {
		if (isAnswered) return;
		
		userAnswers[currentQuestionIndex] = answer;
		isAnswered = true;
		
		// Auto submit after a short delay
		setTimeout(() => {
			submitAnswer(answer);
		}, 1000);
	}

	function submitAnswer(answer: string | number | null) {
		if (!currentQuestion) return;
		
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		
		// Calculate score
		let isCorrect = false;
		if (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false') {
			isCorrect = answer === currentQuestion.correctAnswer;
		} else if (currentQuestion.type === 'fill_blank') {
			const userAnswer = String(answer).toLowerCase().trim();
			const correctAnswer = String(currentQuestion.correctAnswer).toLowerCase().trim();
			isCorrect = userAnswer === correctAnswer;
		}
		
		if (isCorrect) {
			// Base points + time bonus
			const timeBonus = currentQuestion.timeLimit ? 
				Math.max(0, timeLeft / currentQuestion.timeLimit) * currentQuestion.points * 0.5 : 0;
			score += currentQuestion.points + Math.round(timeBonus);
		}
		
		showResult = true;
		
		// Move to next question or complete level
		setTimeout(() => {
			if (currentQuestionIndex < (currentLevel?.questions?.length || 0) - 1) {
				currentQuestionIndex++;
				showResult = false;
				isAnswered = false;
				userAnswers = [...userAnswers];
				
				// Start timer for next question
				if (currentQuestion && currentQuestion.timeLimit) {
					startTimer(currentQuestion.timeLimit);
				}
			} else {
				// Complete level
				if (currentLevel) {
					onCompleteLevel(currentLevel.id, score);
				}
			}
		}, 2000);
	}

	function getWorldThemeName(theme: WorldTheme): string {
		switch(theme) {
			case 'ipa': return 'Dunia IPA';
			case 'ips': return 'Dunia IPS';
			case 'matematika': return 'Dunia Matematika';
			case 'bahasa': return 'Dunia Bahasa';
			default: return 'Dunia Pelajaran';
		}
	}

	function getWorldThemeIcon(theme: WorldTheme): string {
		switch(theme) {
			case 'ipa': return '🔬';
			case 'ips': return '🏛️';
			case 'matematika': return '📐';
			case 'bahasa': return '📚';
			default: return '🎓';
		}
	}

	function getWorldThemeColor(theme: WorldTheme): string {
		switch(theme) {
			case 'ipa': return '#8B5CF6';
			case 'ips': return '#F97316';
			case 'matematika': return '#3B82F6';
			case 'bahasa': return '#EF4444';
			default: return '#10B981';
		}
	}

	function getDifficultyColor(difficulty: string): string {
		switch(difficulty) {
			case 'easy': return 'var(--success)';
			case 'medium': return 'var(--warning)';
			case 'hard': return 'var(--error)';
			default: return 'var(--text-secondary)';
		}
	}
</script>

<div class="educational-world">
	<!-- Header -->
	<div class="world-header" style="background: {getWorldThemeColor(worldTheme)}">
		<button class="back-btn" onclick={onBack}>
			<ChevronLeft size={24} />
		</button>
		<div class="world-info">
			<div class="world-icon">
				{getWorldThemeIcon(worldTheme)}
			</div>
			<div class="world-details">
				<h1>{getWorldThemeName(worldTheme)}</h1>
				{#if currentLevel}
					<p>Level {currentLevel.levelNumber}: {currentLevel.title}</p>
				{/if}
			</div>
		</div>
		<div class="world-stats">
			<div class="stat">
				<Star size={16} />
				{score}
			</div>
			{#if timeLeft > 0}
				<div class="stat timer">
					<Zap size={16} />
					{timeLeft}s
				</div>
			{/if}
		</div>
	</div>

	<!-- Level Progress -->
	{#if currentLevel}
		<div class="level-progress">
			<div class="progress-bar">
				<div 
					class="progress-fill" 
					style="width: {(currentQuestionIndex / (currentLevel.questions?.length || 1)) * 100}%"
				></div>
			</div>
			<div class="progress-text">
				Soal {currentQuestionIndex + 1} dari {currentLevel.questions?.length || 1}
			</div>
		</div>

		<!-- Question Area -->
		{#if currentQuestion && !showResult}
			<div class="question-area card">
				<div class="question-header">
					<span class="question-type">{currentQuestion.type.replace('_', ' ')}</span>
					{#if currentQuestion.difficulty}
						<span 
							class="question-difficulty" 
							style="color: {getDifficultyColor(currentQuestion.difficulty)}"
						>
							{currentQuestion.difficulty}
						</span>
					{/if}
				</div>
				<h2 class="question-text">{currentQuestion.question}</h2>
				
				{#if currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false'}
					<div class="options-grid">
						{#each currentQuestion.options || [] as option, i}
							<button 
								class="option-btn {userAnswers[currentQuestionIndex] === i ? 'selected' : ''}"
								onclick={() => selectAnswer(i)}
								disabled={isAnswered}
							>
								<span class="option-label">{String.fromCharCode(65 + i)}</span>
								<span class="option-text">{option}</span>
							</button>
						{/each}
					</div>
				{:else if currentQuestion.type === 'fill_blank'}
					<div class="fill-blank">
						<input 
							type="text" 
							bind:value={userAnswers[currentQuestionIndex]} 
							placeholder="Masukkan jawaban Anda"
							disabled={isAnswered}
							onkeyup={(e: KeyboardEvent) => {
								if (e.key === 'Enter') {
									selectAnswer(userAnswers[currentQuestionIndex]);
								}
							}}
						/>
						<button 
							class="btn-primary" 
							onclick={() => selectAnswer(userAnswers[currentQuestionIndex])}
							disabled={isAnswered || !userAnswers[currentQuestionIndex]}
						>
							Jawab
						</button>
					</div>
				{/if}
			</div>
		{:else if showResult}
			<div class="result-area card">
				{#if currentQuestion}
					{#if userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer}
						<div class="result-icon correct">
							✅
						</div>
						<h2>Jawaban Benar!</h2>
						<p>+{currentQuestion.points} poin</p>
					{:else}
						<div class="result-icon incorrect">
							❌
						</div>
						<h2>Jawaban Salah</h2>
						<p>Jawaban yang benar: {currentQuestion.options?.[currentQuestion.correctAnswer as number] || currentQuestion.correctAnswer}</p>
					{/if}
					<div class="explanation">
						<h3>Penjelasan:</h3>
						<p>{currentQuestion.explanation}</p>
					</div>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="empty-state card">
			<Trophy size={48} />
			<h2>Level tidak ditemukan</h2>
			<p>Silakan pilih level yang tersedia</p>
			<button class="btn-primary" onclick={onBack}>
				Kembali
			</button>
		</div>
	{/if}
</div>

<style>
	.educational-world {
		min-height: 100vh;
		background: var(--bg-secondary);
		padding-top: 80px;
	}

	.world-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-4);
		color: white;
		z-index: 100;
		box-shadow: var(--shadow-md);
	}

	.back-btn {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		padding: var(--space-2);
		border-radius: var(--radius-md);
	}

	.back-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.world-info {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex: 1;
		justify-content: center;
	}

	.world-icon {
		font-size: var(--text-2xl);
	}

	.world-details h1 {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-1) 0;
	}

	.world-details p {
		font-size: var(--text-sm);
		margin: 0;
		opacity: 0.9;
	}

	.world-stats {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.stat {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-weight: var(--font-semibold);
	}

	.stat.timer {
		background: rgba(255, 255, 255, 0.2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
	}

	/* Level Progress */
	.level-progress {
		padding: var(--space-4);
		background: white;
	}

	.progress-bar {
		height: 8px;
		background: var(--bg-tertiary);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-bottom: var(--space-2);
	}

	.progress-fill {
		height: 100%;
		background: var(--gradient-primary);
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		text-align: center;
	}

	/* Question Area */
	.question-area {
		margin: var(--space-4);
		padding: var(--space-6);
	}

	.question-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.question-type {
		background: var(--bg-secondary);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
	}

	.question-difficulty {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		text-transform: uppercase;
	}

	.question-text {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-6) 0;
		color: var(--text-primary);
		line-height: 1.4;
	}

	/* Options */
	.options-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-3);
	}

	.option-btn {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		border: 2px solid var(--border-light);
		border-radius: var(--radius-lg);
		background: var(--bg-primary);
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.option-btn:hover:not(:disabled) {
		border-color: var(--primary-blue);
		background: rgba(59, 130, 246, 0.05);
	}

	.option-btn.selected {
		border-color: var(--primary-blue);
		background: rgba(59, 130, 246, 0.1);
	}

	.option-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.option-label {
		width: 32px;
		height: 32px;
		border-radius: var(--radius-full);
		background: var(--bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: var(--font-semibold);
		flex-shrink: 0;
	}

	.option-text {
		flex: 1;
	}

	/* Fill Blank */
	.fill-blank {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.fill-blank input {
		padding: var(--space-4);
		font-size: var(--text-lg);
	}

	/* Result Area */
	.result-area {
		margin: var(--space-4);
		padding: var(--space-6);
		text-align: center;
	}

	.result-icon {
		font-size: var(--text-4xl);
		margin-bottom: var(--space-4);
	}

	.result-icon.correct {
		color: var(--success);
	}

	.result-icon.incorrect {
		color: var(--error);
	}

	.result-area h2 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.result-area p {
		font-size: var(--text-lg);
		color: var(--text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	.explanation {
		background: var(--bg-secondary);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		text-align: left;
	}

	.explanation h3 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.explanation p {
		font-size: var(--text-sm);
		margin: 0;
		line-height: 1.5;
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-8);
		margin: var(--space-4);
		text-align: center;
		min-height: 400px;
	}

	.empty-state :global(svg) {
		margin-bottom: var(--space-4);
		color: var(--text-tertiary);
	}

	.empty-state h2 {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.empty-state p {
		color: var(--text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	@media (max-width: 768px) {
		.options-grid {
			grid-template-columns: 1fr;
		}

		.world-info {
			flex-direction: column;
			gap: var(--space-1);
		}

		.world-details h1 {
			font-size: var(--text-base);
		}

		.world-details p {
			font-size: var(--text-xs);
		}

		.world-stats {
			gap: var(--space-2);
		}
	}
</style>