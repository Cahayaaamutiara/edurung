<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { currentUser } from '$lib/stores/auth';
  import { materialFunctions } from '$lib/stores/materials';
  import { sampleSubjects } from '$lib/data/sampleData';
  import { 
    BookOpen, 
    Clock, 
    CheckCircle, 
    ArrowLeft, 
    Star, 
    TrendingUp,
    PlayCircle,
    Award,
    Target
  } from 'lucide-svelte';
  import type { Material, Subject } from '$lib/types';

  const user = $derived($currentUser);
  const subjectId = $derived($page.params.subjectId);
  
  let subject = $state<Subject | undefined>(undefined);
  let materials = $state<Material[]>([]);  // ✅ Fixed: Using $state() for reactivity
  let subjectProgress = $state({ completed: 0, total: 0, percentage: 0 });
  let nextRecommended = $state<Material | null>(null);

  onMount(() => {
    if (!user) {
      goto('/login');
      return;
    }

    // Check if subjectId is available and assert it's a string
    if (!subjectId) {
      goto('/materi');
      return;
    }
    
    // TypeScript assertion - we know subjectId is string after the check above
    const currentSubjectId = subjectId as string;

    // Find subject
    subject = sampleSubjects.find(s => s.id === currentSubjectId);
    if (!subject) {
      goto('/materi');
      return;
    }

    // Get materials for this subject
    materials = materialFunctions.getMaterialsBySubject(currentSubjectId);
    
    // Get progress
    const progress = materialFunctions.getSubjectProgress(currentSubjectId, user.id);
    subjectProgress.completed = progress.completed;
    subjectProgress.total = progress.total;
    subjectProgress.percentage = progress.percentage;
    
    // Get next recommended material
    nextRecommended = materialFunctions.getNextRecommendedMaterial(currentSubjectId, user.id);
  });

  function navigateToMaterial(materialId: string) {
    if (subjectId) {
      goto(`/materi/${subjectId}/${materialId}`);
    }
  }

  function goBack() {
    goto('/materi');
  }

  function getLevelIcon(level: string): string {
    switch (level) {
      case 'basic': return '🌱';
      case 'intermediate': return '🌿';
      case 'advanced': return '🌳';
      default: return '📚';
    }
  }

  function getLevelText(level: string): string {
    switch (level) {
      case 'basic': return 'Dasar';
      case 'intermediate': return 'Menengah';
      case 'advanced': return 'Lanjutan';
      default: return level;
    }
  }

  function getLevelColor(level: string): string {
    switch (level) {
      case 'basic': return 'var(--success)';
      case 'intermediate': return 'var(--warning)';
      case 'advanced': return 'var(--error)';
      default: return 'var(--text-secondary)';
    }
  }

  function isMaterialCompleted(materialId: string): boolean {
    const progress = materialFunctions.getMaterialProgress(materialId, user?.id || '');
    return progress?.isCompleted || false;
  }

  function canAccessMaterial(material: Material): boolean {
    if (!material.prerequisites) return true;
    
    return material.prerequisites.every(prereqId => 
      isMaterialCompleted(prereqId)
    );
  }
</script>

<svelte:head>
  <title>{subject?.name || 'Materi'} - Edu Ruang</title>
</svelte:head>

<div class="subject-materials-page">
  <div class="container">
    <!-- Header -->
    <div class="page-header">
      <button class="back-btn btn-ghost" onclick={goBack}>
        <ArrowLeft size={20} />
        Kembali
      </button>
      
      {#if subject}
        <div class="subject-header">
          <div class="subject-icon" style="background-color: {subject.color}">
            {subject.icon}
          </div>
          <div class="subject-info">
            <h1 class="subject-title">{subject.name}</h1>
            <p class="subject-description">{subject.description}</p>
          </div>
        </div>
      {/if}
    </div>

    <!-- Progress Overview -->
    {#if subject}
      <div class="progress-overview card">
        <div class="progress-stats">
          <div class="stat-item">
            <div class="stat-icon completed">
              <CheckCircle size={24} />
            </div>
            <div class="stat-content">
              <span class="stat-value">{subjectProgress.completed}</span>
              <span class="stat-label">Materi Selesai</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon total">
              <BookOpen size={24} />
            </div>
            <div class="stat-content">
              <span class="stat-value">{subjectProgress.total}</span>
              <span class="stat-label">Total Materi</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon progress">
              <TrendingUp size={24} />
            </div>
            <div class="stat-content">
              <span class="stat-value">{subjectProgress.percentage}%</span>
              <span class="stat-label">Progress</span>
            </div>
          </div>
        </div>
        
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              style="width: {subjectProgress.percentage}%"
            ></div>
          </div>
          <span class="progress-text">
            {subjectProgress.completed} dari {subjectProgress.total} materi telah diselesaikan
          </span>
        </div>
      </div>
    {/if}

    <!-- Next Recommended -->
    {#if nextRecommended}
      <div class="recommended-section">
        <h2 class="section-title">
          <Target size={24} />
          Materi Selanjutnya
        </h2>
        
        <div class="recommended-card card" onclick={() => nextRecommended && navigateToMaterial(nextRecommended.id)} onkeydown={(e: KeyboardEvent) => {if (e.key === 'Enter' || e.key === ' ') {nextRecommended && navigateToMaterial(nextRecommended.id);}}} role="button" tabindex="0">
          <div class="recommended-content">
            <div class="material-badge recommended">
              <Star size={16} />
              Disarankan
            </div>
            <h3 class="material-title">{nextRecommended.title}</h3>
            <p class="material-description">{nextRecommended.description}</p>
            <div class="material-meta">
              <span class="level-badge" style="color: {getLevelColor(nextRecommended.level)}">
                {getLevelIcon(nextRecommended.level)} {getLevelText(nextRecommended.level)}
              </span>
              <span class="duration">
                <Clock size={16} />
                {nextRecommended.duration} menit
              </span>
            </div>
          </div>
          <div class="recommended-action">
            <PlayCircle size={32} color="var(--primary-blue)" />
          </div>
        </div>
      </div>
    {/if}

    <!-- Materials List -->
    <div class="materials-section">
      <h2 class="section-title">
        <BookOpen size={24} />
        Semua Materi
      </h2>
      
      <div class="materials-list">
        {#each materials.sort((a, b) => a.order - b.order) as material (material.id)}
          {@const isCompleted = isMaterialCompleted(material.id)}
          {@const canAccess = canAccessMaterial(material)}
          
          <div 
            class="material-card card {isCompleted ? 'completed' : ''} {!canAccess ? 'locked' : ''}"
            class:clickable={canAccess}
            onclick={() => canAccess && navigateToMaterial(material.id)}
            onkeydown={(e: KeyboardEvent) => {if (e.key === 'Enter' || e.key === ' ') {canAccess && navigateToMaterial(material.id);}}}
            role="button"
            tabindex="0"
          >
            <div class="material-header">
              <div class="material-status">
                {#if isCompleted}
                  <CheckCircle size={24} color="var(--success)" />
                {:else if canAccess}
                  <PlayCircle size={24} color="var(--primary-blue)" />
                {:else}
                  <div class="lock-icon">🔒</div>
                {/if}
              </div>
              
              <div class="material-info">
                <h3 class="material-title">{material.title}</h3>
                <p class="material-description">{material.description}</p>
                
                <div class="material-meta">
                  <span class="level-badge" style="color: {getLevelColor(material.level)}">
                    {getLevelIcon(material.level)} {getLevelText(material.level)}
                  </span>
                  <span class="duration">
                    <Clock size={16} />
                    {material.duration} menit
                  </span>
                  {#if material.tags && material.tags.length > 0}
                    <div class="tags">
                      {#each material.tags.slice(0, 2) as tag}
                        <span class="tag">{tag}</span>
                      {/each}
                    </div>
                  {/if}
                </div>
                
                {#if !canAccess && material.prerequisites}
                  <div class="prerequisites-warning">
                    <span class="warning-text">
                      Selesaikan materi prasyarat terlebih dahulu
                    </span>
                  </div>
                {/if}
              </div>
            </div>
            
            {#if isCompleted}
              <div class="completion-badge">
                <Award size={16} />
                Selesai
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .subject-materials-page {
    min-height: 100vh;
    background: var(--bg-secondary);
    padding: var(--space-6) 0;
  }

  .page-header {
    margin-bottom: var(--space-8);
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
    padding: var(--space-2) var(--space-3);
  }

  .subject-header {
    display: flex;
    gap: var(--space-4);
    align-items: center;
  }

  .subject-icon {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-2xl);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-4xl);
    color: white;
    box-shadow: var(--shadow-lg);
    flex-shrink: 0;
  }

  .subject-title {
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    margin: 0 0 var(--space-2) 0;
  }

  .subject-description {
    color: var(--text-secondary);
    font-size: var(--text-lg);
    margin: 0;
  }

  .progress-overview {
    padding: var(--space-6);
    margin-bottom: var(--space-8);
  }

  .progress-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .stat-icon.completed { background: var(--success); }
  .stat-icon.total { background: var(--primary-blue); }
  .stat-icon.progress { background: var(--warning); }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
  }

  .stat-label {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .progress-bar-container {
    text-align: center;
  }

  .progress-bar {
    height: 8px;
    background: var(--border-light);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: var(--space-2);
  }

  .progress-fill {
    height: 100%;
    background: var(--primary-blue);
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-6);
  }

  .recommended-section {
    margin-bottom: var(--space-8);
  }

  .recommended-card {
    display: flex;
    align-items: center;
    padding: var(--space-6);
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid var(--primary-blue);
    background: rgba(59, 130, 246, 0.05);
  }

  .recommended-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  .recommended-content {
    flex: 1;
  }

  .material-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-md);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    margin-bottom: var(--space-2);
  }

  .material-badge.recommended {
    background: var(--primary-blue);
    color: white;
  }

  .materials-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .material-card {
    padding: var(--space-6);
    transition: all 0.2s ease;
  }

  .material-card.clickable {
    cursor: pointer;
  }

  .material-card.clickable:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-blue);
  }

  .material-card.completed {
    background: rgba(16, 185, 129, 0.05);
    border-color: var(--success);
  }

  .material-card.locked {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .material-header {
    display: flex;
    gap: var(--space-4);
    align-items: flex-start;
  }

  .material-status {
    flex-shrink: 0;
  }

  .lock-icon {
    font-size: var(--text-xl);
    opacity: 0.5;
  }

  .material-info {
    flex: 1;
  }

  .material-title {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0 0 var(--space-2) 0;
  }

  .material-description {
    color: var(--text-secondary);
    margin: 0 0 var(--space-3) 0;
    line-height: 1.5;
  }

  .material-meta {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .level-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
  }

  .duration {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .tags {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .tag {
    padding: var(--space-1) var(--space-2);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }

  .prerequisites-warning {
    margin-top: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: rgba(239, 68, 68, 0.1);
    border-radius: var(--radius-md);
    border-left: 3px solid var(--error);
  }

  .warning-text {
    font-size: var(--text-sm);
    color: var(--error);
    font-weight: var(--font-medium);
  }

  .completion-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-3);
    background: var(--success);
    color: white;
    border-radius: var(--radius-lg);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    margin-top: var(--space-3);
  }

  @media (max-width: 768px) {
    .subject-materials-page {
      padding: var(--space-4) 0;
    }

    .subject-header {
      flex-direction: column;
      text-align: center;
    }

    .subject-icon {
      width: 64px;
      height: 64px;
      font-size: var(--text-3xl);
    }

    .subject-title {
      font-size: var(--text-2xl);
    }

    .progress-stats {
      grid-template-columns: 1fr;
      gap: var(--space-3);
    }

    .recommended-card {
      flex-direction: column;
      text-align: center;
      gap: var(--space-4);
    }

    .material-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .material-meta {
      justify-content: center;
    }
  }
</style>