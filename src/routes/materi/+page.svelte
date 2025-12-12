<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores/auth';
  import { materialFunctions } from '$lib/stores/materials';
  import materiData from '$lib/materi.json';
  import { BookOpen, Clock, CheckCircle, TrendingUp, ArrowRight } from 'lucide-svelte';
  import type { Subject } from '$lib/types';

  const user = $derived($currentUser);
  
  let subjectProgress: Record<string, { completed: number; total: number; percentage: number }> = {};
  let sampleSubjects = $state([] as Subject[]);

  onMount(() => {
    if (!user) {
      goto('/login');
      return;
    }
    
    // Load subjects from JSON data
    sampleSubjects = materiData as Subject[];
    
    // Calculate progress for each subject
    sampleSubjects.forEach(subject => {
      subjectProgress[subject.id] = materialFunctions.getSubjectProgress(subject.id, user.id);
    });
  });

  function navigateToSubject(subjectId: string) {
    goto(`/materi/${subjectId}`);
  }

  function getProgressColor(percentage: number): string {
    if (percentage >= 80) return 'var(--success)';
    if (percentage >= 50) return 'var(--primary-blue)';
    if (percentage >= 20) return 'var(--warning)';
    return 'var(--text-secondary)';
  }
</script>

<svelte:head>
  <title>Materi Pembelajaran - Edu Ruang</title>
</svelte:head>

<div class="materials-page">
  <div class="container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <BookOpen size={32} />
          Materi Pembelajaran
        </h1>
        <p class="page-subtitle">
          Pelajari konsep-konsep penting dari berbagai mata pelajaran
        </p>
      </div>
      
      {#if user}
        <div class="user-stats">
          <div class="stat-item">
            <TrendingUp size={20} />
            <span>Level {user.level}</span>
          </div>
          <div class="stat-item">
            <CheckCircle size={20} />
            <span>{user.points} Poin</span>
          </div>
        </div>
      {/if}
    </div>

    <!-- Subjects Grid -->
    <div class="subjects-grid">
      {#each sampleSubjects as subject (subject.id)}
        {@const progress = subjectProgress[subject.id]}
        <div class="subject-card card" onclick={() => navigateToSubject(subject.id)} onkeydown={(e: KeyboardEvent) => {if (e.key === 'Enter' || e.key === ' ') navigateToSubject(subject.id);}} role="button" tabindex="0">
          <div class="subject-header">
            <div class="subject-icon" style="background-color: {subject.color}">
              {subject.icon}
            </div>
            <div class="subject-info">
              <h3 class="subject-name">{subject.name}</h3>
              <p class="subject-description">{subject.description}</p>
            </div>
          </div>

          {#if progress}
            <div class="progress-section">
              <div class="progress-info">
                <span class="progress-text">
                  {progress.completed} dari {progress.total} materi
                </span>
                <span class="progress-percentage" style="color: {getProgressColor(progress.percentage)}">
                  {progress.percentage}%
                </span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  style="width: {progress.percentage}%; background-color: {getProgressColor(progress.percentage)}"
                ></div>
              </div>
            </div>
          {:else}
            <div class="progress-section">
              <div class="progress-info">
                <span class="progress-text">Belum ada progress</span>
                <span class="progress-percentage">0%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
              </div>
            </div>
          {/if}

          <div class="card-action">
            <span class="action-text">Mulai Belajar</span>
            <ArrowRight size={20} />
          </div>
        </div>
      {/each}
    </div>

    <!-- Study Tips -->
    <div class="study-tips card">
      <h2 class="tips-title">
        <Clock size={24} />
        Tips Belajar Efektif
      </h2>
      <div class="tips-grid">
        <div class="tip-item">
          <h4>📚 Baca dengan Teliti</h4>
          <p>Luangkan waktu untuk memahami setiap konsep dengan baik</p>
        </div>
        <div class="tip-item">
          <h4>✍️ Buat Catatan</h4>
          <p>Catat poin-poin penting saat membaca materi</p>
        </div>
        <div class="tip-item">
          <h4>🔄 Ulangi Pembelajaran</h4>
          <p>Kembali ke materi yang sudah dipelajari untuk memperkuat pemahaman</p>
        </div>
        <div class="tip-item">
          <h4>🎯 Kerjakan Latihan</h4>
          <p>Praktikkan dengan mengerjakan soal-soal latihan</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .materials-page {
    min-height: 100vh;
    background: var(--bg-secondary);
    padding: var(--space-6) 0;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-8);
    gap: var(--space-4);
  }

  .header-content {
    flex: 1;
  }

  .page-title {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    margin: 0 0 var(--space-2) 0;
  }

  .page-subtitle {
    color: var(--text-secondary);
    font-size: var(--text-lg);
    margin: 0;
  }

  .user-stats {
    display: flex;
    gap: var(--space-4);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    color: var(--text-secondary);
    font-weight: var(--font-medium);
    box-shadow: var(--shadow-sm);
  }

  .subjects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-6);
    margin-bottom: var(--space-10);
  }

  .subject-card {
    padding: var(--space-6);
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid var(--border-light);
  }

  .subject-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-blue);
  }

  .subject-header {
    display: flex;
    gap: var(--space-4);
    margin-bottom: var(--space-5);
  }

  .subject-icon {
    width: 60px;
    height: 60px;
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-2xl);
    color: white;
    flex-shrink: 0;
  }

  .subject-info {
    flex: 1;
  }

  .subject-name {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0 0 var(--space-2) 0;
  }

  .subject-description {
    color: var(--text-secondary);
    font-size: var(--text-sm);
    margin: 0;
    line-height: 1.5;
  }

  .progress-section {
    margin-bottom: var(--space-4);
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
  }

  .progress-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .progress-percentage {
    font-weight: var(--font-semibold);
    font-size: var(--text-sm);
  }

  .progress-bar {
    height: 6px;
    background: var(--border-light);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.3s ease;
    border-radius: var(--radius-full);
  }

  .card-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-3);
    border-top: 1px solid var(--border-light);
    color: var(--primary-blue);
    font-weight: var(--font-medium);
  }

  .action-text {
    font-size: var(--text-sm);
  }

  .study-tips {
    padding: var(--space-8);
  }

  .tips-title {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0 0 var(--space-6) 0;
  }

  .tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-6);
  }

  .tip-item h4 {
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0 0 var(--space-2) 0;
  }

  .tip-item p {
    color: var(--text-secondary);
    font-size: var(--text-sm);
    margin: 0;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .materials-page {
      padding: var(--space-4) 0;
    }

    .page-header {
      flex-direction: column;
      gap: var(--space-4);
    }

    .subjects-grid {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    .subject-header {
      flex-direction: column;
      text-align: center;
    }

    .subject-icon {
      align-self: center;
    }

    .tips-grid {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    .study-tips {
      padding: var(--space-6);
    }
  }
</style>