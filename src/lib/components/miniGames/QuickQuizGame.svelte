<script lang="ts">
	import { onMount } from 'svelte';
	import { miniGameFunctions } from '$lib/stores/miniGames';
	import type { MiniGame, Question } from '$lib/types';
	import { Trophy, Clock, Zap, Check, X } from 'lucide-svelte';

	export let gameId: string;

	let game: MiniGame | undefined = undefined;
	let questions: Question[] = [];
	let currentQuestionIndex = 0;
	let selectedAnswer: number | null = null;
	let timeElapsed = 0;
	let questionTimeLeft = 0;
	let timer: number;
	let questionTimer: number;
	let score = 0;
	let correctAnswers = 0;
	let isCompleted = false;
	let showResult = false;
	let resultType: 'correct' | 'incorrect' | null = null;
	let answers: (number | null)[] = [];
	let questionStartTime = 0;

	$: currentQuestion = questions[currentQuestionIndex];
	$: isLastQuestion = currentQuestionIndex === questions.length - 1;
	$: progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

	onMount(() => {
		loadGame();
		startTimer();
		return () => {
			if (timer) clearInterval(timer);
			if (questionTimer) clearInterval(questionTimer);
		};
	});

	function loadGame() {
		game = miniGameFunctions.getMiniGameById(gameId);
		if (game?.data && 'questions' in game.data) {
			questions = game.data.questions;
			answers = new Array(questions.length).fill(null);
			startQuestionTimer();
		}
	}

	function startTimer() {
		timer = setInterval(() => {
			timeElapsed++;
		}, 1000);
	}

	function startQuestionTimer() {
		if (!currentQuestion?.timeLimit) return;
		
		questionTimeLeft = currentQuestion.timeLimit;
		questionStartTime = Date.now();
		
		questionTimer = setInterval(() => {
			questionTimeLeft--;
			if (questionTimeLeft <= 0) {
				// Time's up - automatically move to next question
				handleAnswer(null);
			}
		}, 1000);
	}

	function stopQuestionTimer() {
		if (questionTimer) {
			clearInterval(questionTimer);
		}
	}

	function selectAnswer(answerIndex: number) {
		if (showResult || isCompleted) return;
		selectedAnswer = answerIndex;
	}

	function submitAnswer() {
		if (selectedAnswer === null || showResult) return;
		handleAnswer(selectedAnswer);
	}

	function handleAnswer(answerIndex: number | null) {
		stopQuestionTimer();
		
		answers[currentQuestionIndex] = answerIndex;
		
		const isCorrect = answerIndex === currentQuestion.correctAnswer;
		resultType = isCorrect ? 'correct' : 'incorrect';
		
		if (isCorrect) {
			correctAnswers++;
			
			// Calculate points with time bonus
			let points = currentQuestion.basePoints;
			if (currentQuestion.timeLimit && questionStartTime) {
				const timeSpent = (Date.now() - questionStartTime) / 1000;
				const timeBonus = Math.max(0, currentQuestion.timeLimit - timeSpent) / currentQuestion.timeLimit;
				points += Math.round(currentQuestion.basePoints * 0.5 * timeBonus);
			}
			score += points;
		}
		
		showResult = true;
		
		// Auto-advance after showing result
		setTimeout(() => {
			nextQuestion();
		}, 2000);
	}

	function nextQuestion() {
		if (isLastQuestion) {
			completeQuiz();
		} else {
			currentQuestionIndex++;
			selectedAnswer = null;
			showResult = false;
			resultType = null;
			startQuestionTimer();
		}
	}

	function completeQuiz() {
		isCompleted = true;
		clearInterval(timer);
		
		if (game) {
			miniGameFunctions.completeMiniGame(game.id, score, timeElapsed, 0);
		}
	}

	function restartQuiz() {
		currentQuestionIndex = 0;
		selectedAnswer = null;
		timeElapsed = 0;
		score = 0;
		correctAnswers = 0;
		isCompleted = false;
		showResult = false;
		resultType = null;
		answers = new Array(questions.length).fill(null);
		
		startTimer();
		startQuestionTimer();
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function getScorePercentage(): number {
		return questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;
	}

	function getScoreGrade(): string {
		const percentage = getScorePercentage();
		if (percentage >= 90) return 'A';
		if (percentage >= 80) return 'B';
		if (percentage >= 70) return 'C';
		if (percentage >= 60) return 'D';
		return 'F';
	}

	function getTimeBonusDisplay(): number {
		if (!currentQuestion?.timeLimit || !questionStartTime) return 0;
		const timeSpent = (Date.now() - questionStartTime) / 1000;
		const timeBonus = Math.max(0, currentQuestion.timeLimit - timeSpent) / currentQuestion.timeLimit;
		return Math.round(currentQuestion.basePoints * 0.5 * timeBonus);
	}
</script>

<div class="quick-quiz-game">
	{#if game && questions.length > 0}
		{#if !isCompleted}
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
						<span>{score} pts</span>
					</div>
					<div class="stat">
						<Check size={16} />
						<span>{correctAnswers}/{questions.length}</span>
					</div>
				</div>
			</div>

			<!-- Progress Bar -->
			<div class="progress-container">
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progress}%"></div>
				</div>
				<span class="progress-text">Question {currentQuestionIndex + 1} of {questions.length}</span>
			</div>

			<!-- Question Timer -->
			{#if currentQuestion?.timeLimit}
				<div class="question-timer">
					<div class="timer-bar" style="width: {(questionTimeLeft / currentQuestion.timeLimit) * 100}%"></div>
					<div class="timer-info">
						<Zap size={16} />
						<span>{questionTimeLeft}s left</span>
					</div>
				</div>
			{/if}

			<!-- Question -->
			<div class="question-container">
				<div class="question-header">
					<h2>Question {currentQuestionIndex + 1}</h2>
					<span class="question-points">{currentQuestion.basePoints} pts</span>
				</div>
				<p class="question-text">{currentQuestion.question}</p>

				<!-- Answer Options -->
				<div class="answer-options">
					{#each currentQuestion.options || [] as option, index}
						<button
							class="answer-option {selectedAnswer === index ? 'selected' : ''} {showResult ? (index === currentQuestion.correctAnswer ? 'correct' : selectedAnswer === index ? 'incorrect' : '') : ''}"
							on:click={() => selectAnswer(index)}
							disabled={showResult}
						>
							<span class="option-letter">{String.fromCharCode(65 + index)}</span>
							<span class="option-text">{option}</span>
							{#if showResult && index === currentQuestion.correctAnswer}
								<Check size={20} class="result-icon" />
							{:else if showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer}
								<X size={20} class="result-icon" />
							{/if}
						</button>
					{/each}
				</div>

				<!-- Submit Button -->
				{#if !showResult}
					<button
						class="submit-button"
						on:click={submitAnswer}
						disabled={selectedAnswer === null}
					>
						{isLastQuestion ? 'Finish Quiz' : 'Next Question'}
					</button>
				{/if}

				<!-- Result Display -->
				{#if showResult}
					<div class="result-display result-{resultType}">
						<div class="result-icon">
							{#if resultType === 'correct'}
								<Check size={24} />
							{:else}
								<X size={24} />
							{/if}
						</div>
						<div class="result-content">
							<h3>{resultType === 'correct' ? 'Correct!' : 'Incorrect!'}</h3>
							{#if resultType === 'correct'}
								<p>+{currentQuestion.basePoints} points{getTimeBonusDisplay() > 0 ? ` (+${getTimeBonusDisplay()} time bonus)` : ''}</p>
							{:else if selectedAnswer === null}
								<p>Time's up! The correct answer was {String.fromCharCode(65 + Number(currentQuestion.correctAnswer))}.</p>
							{:else}
								<p>The correct answer was {String.fromCharCode(65 + Number(currentQuestion.correctAnswer))}.</p>
							{/if}
							{#if currentQuestion.explanation}
								<p class="explanation">{currentQuestion.explanation}</p>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Quiz Completed -->
			<div class="completion-screen">
				<div class="completion-header">
					<div class="grade-circle grade-{getScoreGrade().toLowerCase()}">
						<span class="grade-letter">{getScoreGrade()}</span>
					</div>
					<h1>Quiz Completed!</h1>
					<p class="completion-subtitle">Great job finishing the quick quiz!</p>
				</div>

				<div class="completion-stats">
					<div class="stat-card">
						<Trophy size={24} />
						<div class="stat-info">
							<span class="stat-value">{score}</span>
							<span class="stat-label">Final Score</span>
						</div>
					</div>
					<div class="stat-card">
						<Check size={24} />
						<div class="stat-info">
							<span class="stat-value">{correctAnswers}/{questions.length}</span>
							<span class="stat-label">Correct Answers</span>
						</div>
					</div>
					<div class="stat-card">
						<Clock size={24} />
						<div class="stat-info">
							<span class="stat-value">{formatTime(timeElapsed)}</span>
							<span class="stat-label">Total Time</span>
						</div>
					</div>
					<div class="stat-card">
						<Zap size={24} />
						<div class="stat-info">
							<span class="stat-value">{getScorePercentage().toFixed(1)}%</span>
							<span class="stat-label">Accuracy</span>
						</div>
					</div>
				</div>

				<div class="completion-actions">
					<button class="restart-button" on:click={restartQuiz}>
						<Zap size={16} />
						Try Again
					</button>
				</div>

				<!-- Answer Review -->
				<div class="answer-review">
					<h3>Answer Review</h3>
					<div class="review-grid">
						{#each questions as question, index}
							<div class="review-item {answers[index] === question.correctAnswer ? 'correct' : 'incorrect'}">
								<div class="review-header">
									<span class="question-number">Q{index + 1}</span>
									<span class="review-result">
										{#if answers[index] === question.correctAnswer}
											<Check size={16} />
										{:else}
											<X size={16} />
										{/if}
									</span>
								</div>
								<p class="review-question">{question.question}</p>
								<div class="review-answers">
									{#if answers[index] !== null}
										<p class="your-answer">
											Your answer: {String.fromCharCode(65 + answers[index])} - {question.options?.[answers[index]]}
										</p>
									{:else}
										<p class="your-answer">No answer (time expired)</p>
									{/if}
									{#if answers[index] !== question.correctAnswer}
										<p class="correct-answer">
											Correct: {String.fromCharCode(65 + Number(question.correctAnswer))} - {question.options?.[Number(question.correctAnswer)]}
										</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	{:else}
		<div class="loading">
			<p>Loading quiz...</p>
		</div>
	{/if}
</div>

<style>
	.quick-quiz-game {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
	}

	.game-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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

	.progress-container {
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
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
		background: #3b82f6;
		transition: width 0.3s ease;
	}

	.progress-text {
		color: #6b7280;
		font-weight: 500;
		font-size: 0.9rem;
	}

	.question-timer {
		position: relative;
		background: #fef3c7;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		overflow: hidden;
	}

	.timer-bar {
		height: 6px;
		background: #f59e0b;
		transition: width 1s linear;
	}

	.timer-info {
		position: absolute;
		top: 50%;
		right: 1rem;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #92400e;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.question-container {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.question-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.question-header h2 {
		margin: 0;
		color: #374151;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.question-points {
		background: #dbeafe;
		color: #1d4ed8;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.question-text {
		font-size: 1.1rem;
		line-height: 1.6;
		color: #374151;
		margin-bottom: 2rem;
	}

	.answer-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.answer-option {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border: 2px solid #e5e7eb;
		border-radius: 10px;
		background: white;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
		position: relative;
	}

	.answer-option:hover:not(:disabled) {
		border-color: #3b82f6;
		background: #f8fafc;
	}

	.answer-option.selected {
		border-color: #3b82f6;
		background: #eff6ff;
	}

	.answer-option.correct {
		border-color: #10b981;
		background: #d1fae5;
	}

	.answer-option.incorrect {
		border-color: #ef4444;
		background: #fee2e2;
	}

	.answer-option:disabled {
		cursor: not-allowed;
	}

	.option-letter {
		width: 32px;
		height: 32px;
		background: #374151;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 0.9rem;
		flex-shrink: 0;
	}

	.option-text {
		flex: 1;
		font-size: 1rem;
		line-height: 1.5;
	}

	.result-icon {
		color: inherit;
		flex-shrink: 0;
	}

	.submit-button {
		width: 100%;
		padding: 1rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.submit-button:hover:not(:disabled) {
		background: #2563eb;
		transform: translateY(-1px);
	}

	.submit-button:disabled {
		background: #d1d5db;
		color: #9ca3af;
		cursor: not-allowed;
		transform: none;
	}

	.result-display {
		margin-top: 2rem;
		padding: 1.5rem;
		border-radius: 10px;
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.result-display.result-correct {
		background: #d1fae5;
		color: #065f46;
	}

	.result-display.result-incorrect {
		background: #fee2e2;
		color: #991b1b;
	}

	.result-display .result-icon {
		flex-shrink: 0;
		margin-top: 0.25rem;
	}

	.result-content h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.result-content p {
		margin: 0 0 0.5rem 0;
	}

	.explanation {
		font-style: italic;
		margin-top: 0.75rem !important;
		padding-top: 0.75rem;
		border-top: 1px solid currentColor;
		opacity: 0.8;
	}

	.completion-screen {
		text-align: center;
	}

	.completion-header {
		margin-bottom: 3rem;
	}

	.grade-circle {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1.5rem;
		border: 4px solid;
	}

	.grade-a { background: #d1fae5; border-color: #10b981; color: #065f46; }
	.grade-b { background: #dbeafe; border-color: #3b82f6; color: #1e40af; }
	.grade-c { background: #fef3c7; border-color: #f59e0b; color: #92400e; }
	.grade-d { background: #fed7aa; border-color: #f97316; color: #9a3412; }
	.grade-f { background: #fee2e2; border-color: #ef4444; color: #991b1b; }

	.grade-letter {
		font-size: 2rem;
		font-weight: 700;
	}

	.completion-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: 700;
		color: #374151;
	}

	.completion-subtitle {
		color: #6b7280;
		font-size: 1.1rem;
	}

	.completion-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.stat-card {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.stat-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #374151;
	}

	.stat-label {
		color: #6b7280;
		font-size: 0.9rem;
	}

	.completion-actions {
		margin-bottom: 3rem;
	}

	.restart-button {
		padding: 1rem 2rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.restart-button:hover {
		background: #2563eb;
		transform: translateY(-1px);
	}

	.answer-review {
		text-align: left;
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.answer-review h3 {
		margin: 0 0 1.5rem 0;
		color: #374151;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.review-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.review-item {
		padding: 1rem;
		border-radius: 8px;
		border-left: 4px solid;
	}

	.review-item.correct {
		background: #f0fdf4;
		border-color: #10b981;
	}

	.review-item.incorrect {
		background: #fef2f2;
		border-color: #ef4444;
	}

	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.question-number {
		font-weight: 600;
		color: #374151;
	}

	.review-question {
		margin: 0 0 0.75rem 0;
		color: #374151;
		font-weight: 500;
	}

	.review-answers {
		font-size: 0.9rem;
	}

	.your-answer, .correct-answer {
		margin: 0.25rem 0;
	}

	.your-answer {
		color: #6b7280;
	}

	.correct-answer {
		color: #059669;
		font-weight: 500;
	}

	.loading {
		text-align: center;
		padding: 4rem;
		color: #6b7280;
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

		.progress-container {
			flex-direction: column;
			gap: 0.5rem;
		}

		.completion-stats {
			grid-template-columns: 1fr;
		}

		.question-header {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}
	}
</style>