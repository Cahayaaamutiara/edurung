<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { currentUser, authFunctions } from '$lib/stores/auth';
	import { gameFunctions, currentGameSession } from '$lib/stores/game';
	import { notificationFunctions } from '$lib/stores/notifications';
	import { sampleQuestionsBySubject, sampleSubjects } from '$lib/data/sampleData';
	import { shuffleArray, calculateLevel } from '$lib/utils/helpers';
	import { Clock, CheckCircle, XCircle, ArrowRight, Home, RotateCcw } from 'lucide-svelte';
	import EnhancedQuestionCard from '$lib/components/game/EnhancedQuestionCard.svelte';
	import type { Question, Subject } from '$lib/types';

	const subjectId = $derived($page.params.subjectId);
	const user = $derived($currentUser);
	const gameSession = $derived($currentGameSession);

	let currentSubject = $state<Subject | null>(null);
	let questions = $state<Question[]>([]);
	let selectedAnswer = $state<number | string | null>(null);
	let showResult = $state(false);
	let isCorrect = $state(false);
	let timeRemaining = $state(30);
	let timerInterval: number;
	let gameCompleted = $state(false);
	let questionStartTime = $state(0);
	let availableHints = $state(3); // Each player gets 3 hints per game
	let totalScore = $state(0);
	const totalQuestions = 5; // Fixed number of questions per game

	onMount(() => {
		loadGame();
		return () => {
			if (timerInterval) clearInterval(timerInterval);
		};
	});

	function loadGame() {
		// Find subject
		const subjects = JSON.parse(localStorage.getItem('edu-ruang-subjects') || '[]');
		currentSubject = subjects.find((s: Subject) => s.id === subjectId) || sampleSubjects.find(s => s.id === subjectId);
		
		if (!currentSubject) {
			goto('/game');
			return;
		}

		// Load questions for this subject
		const allQuestions = JSON.parse(localStorage.getItem('edu-ruang-questions') || '{}');
		const subjectQuestions = (subjectId && allQuestions[subjectId]) || (subjectId && sampleQuestionsBySubject[subjectId as keyof typeof sampleQuestionsBySubject]) || [];
		
		if (subjectQuestions.length === 0) {
			goto('/game');
			return;
		}

		// Shuffle and select 5 questions
		questions = shuffleArray([...subjectQuestions]).slice(0, 5);
		
		// Start game session
		if (subjectId) {
			gameFunctions.startGame(subjectId, questions);
			if (user) {
				// Update user ID in session
				gameFunctions.answerQuestion(-1); // This will set the userId
			}
		}
		
		startTimer();
	}

	function startTimer() {
		if (!gameSession) return;
		
		const currentQuestion = questions[gameSession.currentQuestionIndex];
		timeRemaining = currentQuestion?.timeLimit || 60;
		questionStartTime = Date.now();
		
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		
		timerInterval = setInterval(() => {
			timeRemaining--;
			if (timeRemaining <= 0) {
				// Time's up, auto-submit with no answer
				const event = new CustomEvent('answer', { 
					detail: { answer: '', timeSpent: currentQuestion?.timeLimit || 60 } 
				}) as unknown as CustomEvent;
				handleAnswer(event);
			}
		}, 1000);
	}

	function handleAnswer(event: CustomEvent) {
		if (showResult) return;
		
		const { answer, timeSpent } = event.detail;
		selectedAnswer = answer;
		
		if (timerInterval) clearInterval(timerInterval);
		
		const currentQuestion = questions[gameSession?.currentQuestionIndex || 0];
		
		// Check if answer is correct based on question type
		if (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false') {
			isCorrect = answer === currentQuestion.correctAnswer;
		} else if (currentQuestion.type === 'fill_blank') {
			const userAnswer = String(answer).toLowerCase().trim();
			const correctAnswer = String(currentQuestion.correctAnswer).toLowerCase().trim();
			isCorrect = userAnswer === correctAnswer;
		}
		
		showResult = true;

		// Update game session with enhanced scoring
		gameFunctions.answerQuestion(answer, timeSpent);
		
		// Update total score
		if (isCorrect) {
			let points = currentQuestion.basePoints;
			// Time bonus calculation
			if (currentQuestion.timeLimit && timeSpent > 0) {
				const timeBonus = Math.max(0, currentQuestion.timeLimit - timeSpent) / currentQuestion.timeLimit;
				points += Math.round(currentQuestion.basePoints * 0.5 * timeBonus);
			}
			totalScore += points;
		}
	}

	function handleUseHint() {
		if (availableHints > 0) {
			availableHints--;
			gameFunctions.useHint();
		}
	}

	function nextQuestion() {
		if (!gameSession) return;
		
		showResult = false;
		selectedAnswer = null;
		
		// Check if game is completed
		if (gameSession.currentQuestionIndex >= questions.length) {
			completeGame();
			return;
		}
		
		startTimer();
	}

	function completeGame() {
		gameCompleted = true;
		if (timerInterval) clearInterval(timerInterval);
		
		// Complete game session
		gameFunctions.completeGame();
		
		// Update user points
		if (user) {
			const newPoints = user.points + totalScore;
			const newLevel = calculateLevel(newPoints);
			authFunctions.updateUser({ points: newPoints, level: newLevel });
			
			// Add notification
			notificationFunctions.addNotification({
				type: 'achievement',
				title: 'Game Selesai!',
				message: `Kamu meraih ${totalScore} poin dalam ${currentSubject?.name}!`,
				data: { score: totalScore, subject: currentSubject?.name }
			});
			
			// Check for level up
			if (newLevel > user.level) {
				notificationFunctions.addNotification({
					type: 'level_up',
					title: 'Level Up!',
					message: `Selamat! Kamu naik ke Level ${newLevel}!`,
					data: { newLevel }
				});
			}
		}
	}

	function playAgain() {
		loadGame();
		gameCompleted = false;
		totalScore = 0;
	}

	function goHome() {
		goto('/');
	}

	function goToSubjects() {
		goto('/game');
	}

	const currentQuestion = $derived(gameSession ? questions[gameSession.currentQuestionIndex] : null);
	const progressPercent = $derived(gameSession ? ((gameSession.currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100 : 0);
</script>