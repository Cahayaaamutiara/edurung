<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { HelpCircle, Clock, Lightbulb } from 'lucide-svelte';
  import type { Question } from '$lib/types';

  export let question: Question;
  export let questionNumber: number;
  export let totalQuestions: number;
  export let timeRemaining: number;
  export let showResult = false;
  export let isCorrect = false;
  export let selectedAnswer: number | string | null = null;
  export let availableHints: number = 0;

  const dispatch = createEventDispatcher();

  let fillBlankAnswer = '';
  let hintsShown: string[] = [];

  function handleMultipleChoiceAnswer(index: number) {
    if (showResult) return;
    selectedAnswer = index;
    dispatch('answer', { answer: index, timeSpent: (question.timeLimit || 60) - timeRemaining });
  }

  function handleFillBlankSubmit() {
    if (showResult || !fillBlankAnswer.trim()) return;
    selectedAnswer = fillBlankAnswer.trim();
    dispatch('answer', { answer: fillBlankAnswer.trim(), timeSpent: (question.timeLimit || 60) - timeRemaining });
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && question.type === 'fill_blank') {
      handleFillBlankSubmit();
    }
  }

  function showHint() {
    if (!question.hints || hintsShown.length >= question.hints.length || availableHints <= 0) return;
    
    const nextHint = question.hints[hintsShown.length];
    hintsShown = [...hintsShown, nextHint];
    dispatch('useHint');
  }

  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case 'easy': return 'var(--success)';
      case 'medium': return 'var(--warning)';
      case 'hard': return 'var(--error)';
      default: return 'var(--text-secondary)';
    }
  }

  function getDifficultyLabel(difficulty: string) {
    switch (difficulty) {
      case 'easy': return 'Mudah';
      case 'medium': return 'Sedang';
      case 'hard': return 'Sulit';
      default: return difficulty;
    }
  }
</script>

<div class="question-container">
  <!-- Question Header -->
  <div class="question-header">
    <div class="question-meta">
      <span class="question-number">Soal {questionNumber} dari {totalQuestions}</span>
      <div class="question-info">
        <span class="difficulty-badge" style="color: {getDifficultyColor(question.difficulty)}">
          {getDifficultyLabel(question.difficulty)}
        </span>
        <span class="points-badge">{question.basePoints} Poin</span>
        <span class="level-badge">Level {question.level}</span>
      </div>
    </div>
    
    <div class="timer-container">
      <Clock size={16} />
      <span class="timer {timeRemaining <= 10 ? 'warning' : ''}">{timeRemaining}s</span>
    </div>
  </div>

  <!-- Question Content -->
  <div class="question-content">
    <h2 class="question-text">{question.question}</h2>

    <!-- Multiple Choice Questions -->
    {#if question.type === 'multiple_choice' || question.type === 'true_false'}
      <div class="options-container">
        {#each question.options || [] as option, index}
          <button 
            class="option-btn {selectedAnswer === index ? 'selected' : ''} {showResult ? (index === question.correctAnswer ? 'correct' : selectedAnswer === index ? 'incorrect' : '') : ''}"
            on:click={() => handleMultipleChoiceAnswer(index)}
            disabled={showResult}
          >
            <span class="option-letter">{String.fromCharCode(65 + index)}</span>
            <span class="option-text">{option}</span>
          </button>
        {/each}
      </div>
    {/if}

    <!-- Fill in the Blank Questions -->
    {#if question.type === 'fill_blank'}
      <div class="fill-blank-container">
        <div class="input-group">
          <input 
            type="text" 
            bind:value={fillBlankAnswer}
            on:keypress={handleKeyPress}
            disabled={showResult}
            placeholder="Ketik jawaban Anda..."
            class="fill-blank-input {showResult ? (String(selectedAnswer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim() ? 'correct' : 'incorrect') : ''}"
          />
          {#if !showResult}
            <button 
              class="submit-btn btn-primary"
              on:click={handleFillBlankSubmit}
              disabled={!fillBlankAnswer.trim()}
            >
              Submit
            </button>
          {/if}
        </div>
        
        {#if showResult}
          <div class="answer-feedback">
            <p class="user-answer">
              <strong>Jawaban Anda:</strong> {selectedAnswer || '(tidak dijawab)'}
            </p>
            <p class="correct-answer">
              <strong>Jawaban yang Benar:</strong> {question.correctAnswer}
            </p>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Hints Section -->
    {#if question.hints && question.hints.length > 0 && !showResult}
      <div class="hints-section">
        <button 
          class="hint-btn"
          on:click={showHint}
          disabled={hintsShown.length >= question.hints.length || availableHints <= 0}
        >
          <Lightbulb size={16} />
          Tampilkan Hint ({availableHints} tersisa)
        </button>
        
        {#if hintsShown.length > 0}
          <div class="hints-container">
            {#each hintsShown as hint, index}
              <div class="hint-item">
                <HelpCircle size={14} />
                <span>Hint {index + 1}: {hint}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Result Explanation -->
    {#if showResult}
      <div class="result-container">
        <div class="result-header">
          <div class="result-icon {isCorrect ? 'correct' : 'incorrect'}">
            {isCorrect ? '✓' : '✗'}
          </div>
          <h3 class="result-title">
            {isCorrect ? 'Jawaban Benar!' : 'Jawaban Salah'}
          </h3>
        </div>
        
        <div class="explanation">
          <h4>Penjelasan:</h4>
          <p>{question.explanation}</p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .question-container {
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-light);
  }

  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
    gap: var(--space-3);
  }

  .question-meta {
    flex: 1;
  }

  .question-number {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-2);
    display: block;
  }

  .question-info {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .difficulty-badge,
  .points-badge,
  .level-badge {
    font-size: var(--text-xs);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-md);
    font-weight: var(--font-medium);
    background: var(--bg-secondary);
  }

  .timer-container {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
  }

  .timer {
    font-weight: var(--font-semibold);
    color: var(--text-primary);
  }

  .timer.warning {
    color: var(--error);
    animation: pulse 1s infinite;
  }

  .question-text {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-6);
    line-height: 1.4;
  }

  .options-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .option-btn {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-4);
    border: 2px solid var(--border-light);
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    font-size: var(--text-base);
  }

  .option-btn:hover:not(:disabled) {
    border-color: var(--primary-blue);
    background: var(--bg-primary);
    transform: translateY(-1px);
  }

  .option-btn.selected {
    border-color: var(--primary-blue);
    background: var(--primary-blue);
    color: white;
  }

  .option-btn.correct {
    border-color: var(--success);
    background: var(--success);
    color: white;
  }

  .option-btn.incorrect {
    border-color: var(--error);
    background: var(--error);
    color: white;
  }

  .option-letter {
    font-weight: var(--font-bold);
    font-size: var(--text-lg);
    min-width: 24px;
    text-align: center;
  }

  .option-text {
    flex: 1;
  }

  .fill-blank-container {
    margin-top: var(--space-4);
  }

  .input-group {
    display: flex;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .fill-blank-input {
    flex: 1;
    padding: var(--space-3) var(--space-4);
    border: 2px solid var(--border-medium);
    border-radius: var(--radius-lg);
    font-size: var(--text-base);
    transition: all 0.2s ease;
  }

  .fill-blank-input:focus {
    border-color: var(--primary-blue);
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .fill-blank-input.correct {
    border-color: var(--success);
    background: rgba(16, 185, 129, 0.1);
  }

  .fill-blank-input.incorrect {
    border-color: var(--error);
    background: rgba(239, 68, 68, 0.1);
  }

  .submit-btn {
    padding: var(--space-3) var(--space-6);
    font-size: var(--text-base);
    white-space: nowrap;
  }

  .answer-feedback {
    padding: var(--space-4);
    background: var(--bg-tertiary);
    border-radius: var(--radius-lg);
    margin-top: var(--space-4);
  }

  .user-answer,
  .correct-answer {
    margin: var(--space-2) 0;
    font-size: var(--text-sm);
  }

  .hints-section {
    margin-top: var(--space-6);
    padding-top: var(--space-4);
    border-top: 1px solid var(--border-light);
  }

  .hint-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--bg-secondary);
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-lg);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: var(--space-3);
  }

  .hint-btn:hover:not(:disabled) {
    background: var(--primary-blue);
    color: white;
    border-color: var(--primary-blue);
  }

  .hint-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .hints-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .hint-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    background: rgba(59, 130, 246, 0.1);
    border-radius: var(--radius-lg);
    color: var(--primary-blue);
    font-size: var(--text-sm);
  }

  .result-container {
    margin-top: var(--space-6);
    padding: var(--space-6);
    background: var(--bg-tertiary);
    border-radius: var(--radius-xl);
  }

  .result-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .result-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    color: white;
  }

  .result-icon.correct {
    background: var(--success);
  }

  .result-icon.incorrect {
    background: var(--error);
  }

  .result-title {
    font-size: var(--text-lg);
    margin: 0;
  }

  .explanation h4 {
    margin: 0 0 var(--space-2) 0;
    color: var(--text-primary);
    font-size: var(--text-base);
  }

  .explanation p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @media (max-width: 768px) {
    .question-container {
      padding: var(--space-4);
    }

    .question-header {
      flex-direction: column;
      align-items: stretch;
    }

    .timer-container {
      align-self: center;
    }

    .question-info {
      justify-content: center;
    }

    .input-group {
      flex-direction: column;
    }

    .submit-btn {
      width: 100%;
    }
  }
</style>