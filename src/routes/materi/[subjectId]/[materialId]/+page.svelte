<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { currentUser } from '$lib/stores/auth';
  import { materialFunctions } from '$lib/stores/materials';
  import { notificationFunctions } from '$lib/stores/notifications';
  import { sampleSubjects } from '$lib/data/sampleData';
  import { 
    ArrowLeft, 
    ArrowRight, 
    Clock, 
    CheckCircle, 
    BookOpen,
    Award,
    Target,
    Hash,
    Download,
    Bookmark,
    BookmarkCheck,
    Menu,
    X,
    FileText,
    Eye,
    PlayCircle,
    Calculator,
    Lightbulb,
    PenTool
  } from 'lucide-svelte';
  import type { Material, Subject, MaterialProgress, MaterialHighlight } from '$lib/types';

  const user = $derived($currentUser);
  const subjectId = $derived($page.params.subjectId || '');
  const materialId = $derived($page.params.materialId || '');
  
  let subject = $state<Subject | undefined>(undefined);
  let material = $state<Material | undefined>(undefined);
  let allSubjectMaterials = $state<Material[]>([]);
  let previousMaterial = $state<Material | undefined>(undefined);
  let nextMaterial = $state<Material | undefined>(undefined);
  let progress = $state<MaterialProgress | undefined>(undefined);
  let isCompleted = $state(false);
  let readingStartTime = $state(0);
  let readingInterval = $state<number | undefined>(undefined);
  let timeSpent = $state(0);
  let showCompletionModal = $state(false);
  
  // Enhanced features
  let currentSectionIndex = $state(0);
  let showTableOfContents = $state(false);
  let showNotes = $state(false);
  let showHighlightTools = $state(false);
  let userNotes = $state('');
  let highlights = $state<MaterialHighlight[]>([]);
  let selectedText = $state('');
  let highlightColor = $state<'yellow' | 'green' | 'blue' | 'pink' | 'purple'>('yellow');
  let isBookmarked = $state(false);
  let sectionStartTime = $state(0);
  let timeSpentOnCurrentSection = $state(0);
  let showStudyTips = $state(true);
  let selectedQuizAnswer = $state<number | null>(null);
  let isLoadingContent = $state(true);
  let contentError = $state<string | null>(null);

  // Reactive values - moved inside functions to avoid runes issues
  function getCurrentSection() {
    return material?.sections?.[currentSectionIndex];
  }
  
  function getHasNextSection() {
    return currentSectionIndex < (material?.sections?.length || 0) - 1;
  }
  
  function getHasPrevSection() {
    return currentSectionIndex > 0;
  }

  onMount(() => {
    if (!user) {
      goto('/login');
      return;
    }

    loadMaterialData();
    setupReadingSession();
    
    // Set loading complete after content is loaded
    setTimeout(() => {
      isLoadingContent = false;
    }, 500);
    
    return () => {
      if (readingInterval) {
        clearInterval(readingInterval);
      }
      document.removeEventListener('mouseup', handleTextSelection);
    };
  });

  onDestroy(() => {
    if (readingInterval) {
      clearInterval(readingInterval);
    }
  });

  function loadMaterialData() {
    // Find subject and material
    subject = sampleSubjects.find(s => s.id === subjectId);
    if (materialId) {
      // Use enhanced material loading with content validation
      material = materialFunctions.getMaterialWithContent(materialId);
    }
    
    if (!subject || !material) {
      goto('/materi');
      return;
    }

    // Validate material content and show loading if needed
    if (!materialFunctions.validateMaterialContent(material)) {
      console.warn('Material content incomplete, using fallback');
    }

    // Get all materials for navigation
    if (subjectId) {
      allSubjectMaterials = materialFunctions.getMaterialsBySubject(subjectId).sort((a, b) => a.order - b.order);
    }
    
    // Find previous and next materials
    const currentIndex = allSubjectMaterials.findIndex(m => m.id === materialId);
    if (currentIndex > 0) {
      previousMaterial = allSubjectMaterials[currentIndex - 1];
    }
    if (currentIndex < allSubjectMaterials.length - 1) {
      nextMaterial = allSubjectMaterials[currentIndex + 1];
    }

    // Check existing progress
    if (materialId && user) {
      progress = materialFunctions.getMaterialProgress(materialId, user.id);
      if (progress) {
        isCompleted = progress.isCompleted;
        isBookmarked = progress.bookmarked || false;
        userNotes = progress.notes || '';
        highlights = progress.highlights || [];
        
        // Find current section based on progress
        if (progress?.currentSection && material?.sections) {
          const sectionIndex = material.sections.findIndex(s => s.id === progress?.currentSection);
          if (sectionIndex >= 0) {
            currentSectionIndex = sectionIndex;
          }
        }
      }
    }
  }

  function setupReadingSession() {
    if (!materialId || !user) return;
    
    // Start reading session
    materialFunctions.startReading(materialId, user.id);
    readingStartTime = Date.now();
    sectionStartTime = Date.now();
    
    // Update time spent every 30 seconds
    readingInterval = setInterval(() => {
      timeSpent = Math.floor((Date.now() - readingStartTime) / 1000 / 60);
      timeSpentOnCurrentSection = Math.floor((Date.now() - sectionStartTime) / 1000 / 60);
      if (timeSpent > 0 && materialId && user) {
        materialFunctions.updateTimeSpent(materialId, user.id, 1);
      }
    }, 30000);

    // Handle text selection for highlighting
    document.addEventListener('mouseup', handleTextSelection);
  }

  function calculateReadingProgress(): number {
    if (!material?.sections) return 0;
    const sectionsCompleted = progress?.sectionsCompleted || [];
    return Math.round((sectionsCompleted.length / material.sections.length) * 100);
  }

  function handleTextSelection() {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      selectedText = selection.toString().trim();
      if (selectedText.length > 0) {
        showHighlightTools = true;
      }
    } else {
      showHighlightTools = false;
      selectedText = '';
    }
  }

  function goBack() {
    goto(`/materi/${subjectId}`);
  }

  function navigateToMaterial(targetMaterialId: string) {
    goto(`/materi/${subjectId}/${targetMaterialId}`);
  }

  function nextSection() {
    if (getHasNextSection()) {
      markSectionAsRead();
      currentSectionIndex++;
      sectionStartTime = Date.now();
      timeSpentOnCurrentSection = 0;
      updateProgress();
    }
  }

  function prevSection() {
    if (getHasPrevSection()) {
      currentSectionIndex--;
      sectionStartTime = Date.now();
      timeSpentOnCurrentSection = 0;
    }
  }

  function goToSection(index: number) {
    if (index >= 0 && index < (material?.sections?.length || 0)) {
      markSectionAsRead();
      currentSectionIndex = index;
      sectionStartTime = Date.now();
      timeSpentOnCurrentSection = 0;
      showTableOfContents = false;
      updateProgress();
    }
  }

  function markSectionAsRead() {
    if (getCurrentSection() && material) {
      const sectionsCompleted = progress?.sectionsCompleted || [];
      const currentSectionId = getCurrentSection()?.id;
      if (currentSectionId && !sectionsCompleted.includes(currentSectionId)) {
        sectionsCompleted.push(currentSectionId);
        updateProgressData({
          sectionsCompleted,
          currentSection: currentSectionId,
          readingProgress: calculateReadingProgress()
        });
      }
    }
  }

  function updateProgress() {
    updateProgressData({
      currentSection: getCurrentSection()?.id,
      readingProgress: calculateReadingProgress(),
      lastAccessedAt: new Date(),
      notes: userNotes,
      highlights,
      bookmarked: isBookmarked
    });
  }

  function updateProgressData(newProgress: Partial<MaterialProgress>) {
    if (user && material) {
      // Update local progress object
      if (progress) {
        progress = { ...progress, ...newProgress };
      } else {
        progress = {
          materialId,
          userId: user.id,
          isCompleted: false,
          timeSpent: 0,
          lastAccessedAt: new Date(),
          ...newProgress
        } as MaterialProgress;
      }
      
      // Update in store
      if (materialId) {
        materialFunctions.startReading(materialId, user.id);
      }
    }
  }

  function toggleBookmark() {
    isBookmarked = !isBookmarked;
    updateProgress();
    
    // Add notification
    if (material) {
      notificationFunctions.addNotification({
        type: 'achievement',
        title: isBookmarked ? 'Materi Di-bookmark!' : 'Bookmark Dihapus',
        message: `"${material.title}" ${isBookmarked ? 'ditambahkan ke' : 'dihapus dari'} bookmark`,
        data: { materialId, subjectId }
      });
    }
  }

  function addHighlight() {
    const currentSection = getCurrentSection();
    if (selectedText && currentSection?.id) {
      const highlight: MaterialHighlight = {
        id: Date.now().toString(),
        sectionId: currentSection.id,
        text: selectedText,
        color: highlightColor,
        createdAt: new Date()
      };
      
      highlights = [...highlights, highlight];
      updateProgress();
      showHighlightTools = false;
      selectedText = '';
      
      // Clear selection
      window.getSelection()?.removeAllRanges();
    }
  }

  function removeHighlight(highlightId: string) {
    highlights = highlights.filter(h => h.id !== highlightId);
    updateProgress();
  }

  function downloadMaterial() {
    if (!material) return;
    
    // Create downloadable content
    let content = `# ${material.title}\n\n`;
    content += `${material.description}\n\n`;
    
    if (material.sections) {
      material.sections.forEach(section => {
        content += `## ${section.title}\n\n`;
        content += `${section.content}\n\n`;
        if (section.studyTip) {
          content += `**Tips Belajar:** ${section.studyTip}\n\n`;
        }
      });
    } else if (material.content) {
      content += material.content;
    }
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${material.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Add notification
    notificationFunctions.addNotification({
      type: 'achievement',
      title: 'Materi Diunduh!',
      message: `"${material.title}" berhasil diunduh`,
      data: { materialId, subjectId }
    });
  }

  function completeMaterial() {
    if (!user || !material) return;
    
    const finalTimeSpent = Math.max(1, Math.floor((Date.now() - readingStartTime) / 1000 / 60));
    materialFunctions.completeMaterial(materialId, user.id, finalTimeSpent);
    isCompleted = true;
    showCompletionModal = true;

    // Add notification
    notificationFunctions.addNotification({
      type: 'achievement',
      title: 'Materi Diselesaikan!',
      message: `Anda telah menyelesaikan "${material.title}"`,
      data: { materialId, subjectId }
    });

    // Auto-hide modal after 3 seconds
    setTimeout(() => {
      showCompletionModal = false;
    }, 3000);
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

  function formatContent(content: string): string {
    if (!content || content.trim() === '') {
      return '<p class="empty-content">📝 Konten sedang disiapkan...</p>';
    }
    
    // Enhanced markdown-like formatting
    let formatted = content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="content-h3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="content-h2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="content-h1">$1</h1>')
      
      // Text formatting
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="content-bold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="content-italic">$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="content-code">$1</code>')
      
      // Lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ordered-item">$1</li>')
      .replace(/^[\-\*] (.*$)/gim, '<li class="unordered-item">$1</li>')
      
      // Mathematical expressions
      .replace(/\$\$([^$]+)\$\$/g, '<div class="math-block">$1</div>')
      .replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>')
      
      // Line breaks and paragraphs
      .replace(/\n\n/gim, '</p><p class="content-paragraph">')
      .replace(/\n/gim, '<br>');
    
    // Wrap lists properly
    formatted = formatted.replace(/(<li class="ordered-item">.*?<\/li>)/gims, '<ol class="content-ol">$1</ol>');
    formatted = formatted.replace(/<\/ol>\s*<ol class="content-ol">/gim, '');
    formatted = formatted.replace(/(<li class="unordered-item">.*?<\/li>)/gims, '<ul class="content-ul">$1</ul>');
    formatted = formatted.replace(/<\/ul>\s*<ul class="content-ul">/gim, '');
    
    // Wrap in paragraph if no block elements
    if (!formatted.includes('<h') && !formatted.includes('<ul') && !formatted.includes('<ol')) {
      formatted = `<p class="content-paragraph">${formatted}</p>`;
    }
    
    return formatted;
  }
</script>

<!-- Rest of the component remains the same as the original -->
{#if material}
  <!-- Enhanced Material Header -->
  <div class="enhanced-material-page">
    <div class="material-header">
      <div class="header-left">
        <button class="back-btn btn-ghost" onclick={goBack} aria-label="Kembali ke daftar materi">
          <ArrowLeft size={20} />
          Kembali
        </button>
        
        <div class="breadcrumb">
          <span class="breadcrumb-item">{subject?.name}</span>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">{material.title}</span>
        </div>
        
        <div class="progress-info">
          <span class="section-counter">
            {currentSectionIndex + 1} dari {material.sections?.length || 1} bagian
          </span>
          <div class="reading-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: {calculateReadingProgress()}%"></div>
            </div>
            <span class="progress-text">{calculateReadingProgress()}%</span>
          </div>
        </div>
      </div>
      
      <div class="header-controls">
        <button 
          class="control-btn"
          class:active={showTableOfContents}
          onclick={() => showTableOfContents = !showTableOfContents}
          title="Daftar Isi"
          aria-label="Tampilkan daftar isi"
        >
          <Menu size={20} />
        </button>
        
        <button 
          class="control-btn"
          class:active={showNotes}
          onclick={() => showNotes = !showNotes}
          title="Catatan"
          aria-label="Tampilkan catatan"
        >
          <FileText size={20} />
        </button>
        
        <button 
          class="control-btn"
          class:active={isBookmarked}
          onclick={toggleBookmark}
          title={isBookmarked ? 'Hapus Bookmark' : 'Tambah Bookmark'}
          aria-label={isBookmarked ? 'Hapus bookmark' : 'Tambah bookmark'}
        >
          {#if isBookmarked}
            <BookmarkCheck size={20} />
          {:else}
            <Bookmark size={20} />
          {/if}
        </button>
        
        {#if material.downloadable}
          <button 
            class="control-btn"
            onclick={downloadMaterial}
            title="Unduh Materi"
            aria-label="Unduh materi"
          >
            <Download size={20} />
          </button>
        {/if}
      </div>
    </div>

    <!-- Enhanced Content Area -->
    <div class="content-area">
      <!-- Table of Contents Sidebar -->
      {#if showTableOfContents && material.sections}
        <div class="sidebar toc-sidebar">
          <div class="sidebar-header">
            <h3>Daftar Isi</h3>
            <button 
              class="close-btn"
              onclick={() => showTableOfContents = false}
              aria-label="Tutup daftar isi"
            >
              <X size={16} />
            </button>
          </div>
          <div class="toc-list">
            {#each material.sections as section, index}
              {@const isCompletedSection = progress?.sectionsCompleted?.includes(section.id) || false}
              {@const isCurrent = index === currentSectionIndex}
              <button 
                class="toc-item"
                class:completed={isCompletedSection}
                class:current={isCurrent}
                onclick={() => goToSection(index)}
              >
                <div class="toc-status">
                  {#if isCompletedSection}
                    <CheckCircle size={16} />
                  {:else if isCurrent}
                    <Eye size={16} />
                  {:else}
                    <div class="toc-dot"></div>
                  {/if}
                </div>
                <div class="toc-content">
                  <span class="toc-title">{section.title}</span>
                  <span class="toc-type">{section.type}</span>
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Main Content -->
      <div class="main-content">
        {#if material.sections && getCurrentSection()}
          {@const currentSection = getCurrentSection()}
          <!-- Section Content Display -->
          <div class="section-content">
            <h2 class="section-title">{currentSection?.title}</h2>
            
            {#if currentSection?.type === 'video' && currentSection.media}
              <div class="video-container">
                <video controls poster={currentSection.media.thumbnail}>
                  <source src={currentSection.media.url} type="video/mp4">
                  {#if currentSection.media.captionsUrl}
                    <track kind="captions" src={currentSection.media.captionsUrl} srclang="id" label="Indonesian">
                  {/if}
                  <track kind="captions" src="/captions/default-captions.vtt" srclang="id" label="Indonesian" default>
                  Browser Anda tidak mendukung video.
                </video>
                {#if currentSection.media.caption}
                  <p class="media-caption">{currentSection.media.caption}</p>
                {/if}
              </div>
            {:else if currentSection?.type === 'image' && currentSection.media}
              <div class="image-container">
                <img 
                  src={currentSection.media.url} 
                  alt={currentSection.media.alt || currentSection.title}
                  class="section-image"
                />
                {#if currentSection.media.caption}
                  <p class="media-caption">{currentSection.media.caption}</p>
                {/if}
              </div>
            {/if}

            <div class="text-content">
              {@html formatContent(currentSection?.content || '')}
            </div>

            {#if currentSection?.studyTip && showStudyTips}
              <div class="study-tip">
                <div class="tip-header">
                  <Lightbulb size={20} />
                  <span>Tips Belajar</span>
                  <button 
                    class="tip-close"
                    onclick={() => showStudyTips = false}
                    aria-label="Tutup tips belajar"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p>{currentSection.studyTip}</p>
              </div>
            {/if}
          </div>

          <!-- Section Navigation -->
          <div class="section-navigation">
            <button 
              class="nav-btn prev-btn"
              disabled={!getHasPrevSection()}
              onclick={prevSection}
              aria-label="Bagian sebelumnya"
            >
              <ArrowLeft size={20} />
              Sebelumnya
            </button>
            
            <div class="nav-info">
              <span class="reading-time">
                <Clock size={16} />
                {timeSpentOnCurrentSection} menit
              </span>
            </div>
            
            {#if getHasNextSection()}
              <button 
                class="nav-btn next-btn"
                onclick={nextSection}
                aria-label="Bagian selanjutnya"
              >
                Selanjutnya
                <ArrowRight size={20} />
              </button>
            {:else}
              <button 
                class="nav-btn complete-btn"
                onclick={completeMaterial}
                aria-label="Tandai materi sebagai selesai"
              >
                <Target size={20} />
                Selesai
              </button>
            {/if}
          </div>
        {:else}
          <!-- Fallback to legacy content display -->
          <div class="material-content card">
            <div class="content-body">
              {@html formatContent(material.content || '')}
            </div>
            
            {#if !isCompleted}
              <div class="completion-section">
                <button class="complete-btn btn-primary btn-lg" onclick={completeMaterial} aria-label="Tandai materi sebagai selesai">
                  <Award size={20} />
                  Tandai Sebagai Selesai
                </button>
                <p class="completion-hint">
                  Klik tombol di atas setelah Anda selesai membaca materi ini
                </p>
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Notes Sidebar -->
      {#if showNotes}
        <div class="sidebar notes-sidebar">
          <div class="sidebar-header">
            <h3>Catatan Pribadi</h3>
            <button 
              class="close-btn"
              onclick={() => showNotes = false}
              aria-label="Tutup catatan"
            >
              <X size={16} />
            </button>
          </div>
          
          <div class="notes-content">
            <textarea 
              bind:value={userNotes}
              placeholder="Tulis catatan Anda di sini..."
              class="notes-input"
              onblur={updateProgress}
            ></textarea>
            
            {#if highlights.length > 0}
              <div class="highlights-section">
                <h4>Highlight</h4>
                <div class="highlights-list">
                  {#each highlights as highlight}
                    <div class="highlight-item color-{highlight.color}">
                      <p class="highlight-text">"{highlight.text}"</p>
                      <div class="highlight-meta">
                        <span class="highlight-section">
                          {material.sections?.find(s => s.id === highlight.sectionId)?.title}
                        </span>
                        <button 
                          class="remove-highlight"
                          onclick={() => removeHighlight(highlight.id)}
                          aria-label="Hapus highlight"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Highlight Tools Popup -->
{#if showHighlightTools && selectedText}
  <div class="highlight-tools">
    <p class="selected-text">"{selectedText}"</p>
    <div class="color-picker">
      {#each ['yellow', 'green', 'blue', 'pink', 'purple'] as color}
        <button 
          class="color-btn color-{color}"
          class:active={highlightColor === color}
          onclick={() => highlightColor = color as typeof highlightColor}
          aria-label="Pilih warna {color}"
        ></button>
      {/each}
    </div>
    <div class="highlight-actions">
      <button class="btn-primary btn-sm" onclick={addHighlight} aria-label="Tambah highlight">
        <PenTool size={16} />
        Highlight
      </button>
      <button 
        class="btn-ghost btn-sm" 
        onclick={() => showHighlightTools = false}
        aria-label="Batalkan highlight"
      >
        Batal
      </button>
    </div>
  </div>
{/if}

<!-- Completion Modal -->
{#if showCompletionModal}
  <div class="modal-overlay" onclick={() => showCompletionModal = false} onkeydown={() => {}} role="dialog" tabindex="0" aria-label="Materi selesai" aria-modal="true">
    <div class="completion-modal card">
      <div class="modal-icon">
        <Award size={48} color="var(--success)" />
      </div>
      <h2 class="modal-title">Selamat! 🎉</h2>
      <p class="modal-message">Anda telah menyelesaikan materi "{material?.title}"</p>
      <div class="modal-actions">
        <button 
          class="btn-primary"
          onclick={() => showCompletionModal = false}
          aria-label="Lanjutkan"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Enhanced styles and remaining functionality -->
<style>
  .enhanced-material-page {
    min-height: 100vh;
    background: var(--bg-secondary);
  }

  .material-header {
    background: white;
    padding: var(--space-6);
    border-bottom: 1px solid var(--border-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-4);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-left {
    flex: 1;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
    padding: var(--space-2) var(--space-3);
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-3);
  }

  .breadcrumb-current {
    color: var(--text-primary);
    font-weight: var(--font-medium);
  }

  .progress-info {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .section-counter {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .reading-progress {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .progress-bar {
    width: 120px;
    height: 6px;
    background: var(--border-light);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary-blue);
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: var(--text-xs);
    color: var(--text-secondary);
    font-weight: var(--font-medium);
  }

  .header-controls {
    display: flex;
    gap: var(--space-2);
  }

  .control-btn {
    width: 40px;
    height: 40px;
    border: 1px solid var(--border-medium);
    background: white;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-secondary);
  }

  .control-btn:hover {
    border-color: var(--primary-blue);
    color: var(--primary-blue);
  }

  .control-btn.active {
    background: var(--primary-blue);
    border-color: var(--primary-blue);
    color: white;
  }

  .content-area {
    display: flex;
    min-height: calc(100vh - 140px);
  }

  .sidebar {
    width: 320px;
    background: white;
    border-right: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
  }

  .notes-sidebar {
    border-right: none;
    border-left: 1px solid var(--border-light);
  }

  .main-content {
    flex: 1;
    padding: var(--space-8);
    max-width: 800px;
    margin: 0 auto;
  }

  .section-content {
    margin-bottom: var(--space-8);
  }

  .section-title {
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    margin: 0 0 var(--space-6) 0;
  }

  .video-container,
  .image-container {
    margin-bottom: var(--space-6);
  }

  .video-container video,
  .image-container img {
    width: 100%;
    border-radius: var(--radius-lg);
  }

  .text-content {
    font-size: var(--text-lg);
    line-height: 1.8;
    color: var(--text-primary);
    margin-bottom: var(--space-6);
  }

  .study-tip {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1));
    border: 1px solid rgba(168, 85, 247, 0.2);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    margin-top: var(--space-6);
  }

  .tip-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
    font-weight: var(--font-semibold);
    color: rgb(168, 85, 247);
  }

  .section-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-6);
    border-top: 1px solid var(--border-light);
  }

  .nav-btn {
    padding: var(--space-3) var(--space-6);
    border: 1px solid var(--border-medium);
    background: white;
    border-radius: var(--radius-lg);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: var(--font-medium);
    transition: all 0.2s ease;
  }

  .nav-btn:hover:not(:disabled) {
    border-color: var(--primary-blue);
    color: var(--primary-blue);
  }

  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .complete-btn {
    background: var(--success);
    color: white;
    border-color: var(--success);
  }

  /* Enhanced styles for highlights and interactions */
  .sidebar-header {
    padding: var(--space-4);
    border-bottom: 1px solid var(--border-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-1);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
  }

  .close-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  .toc-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-2);
  }

  .toc-item {
    width: 100%;
    padding: var(--space-3);
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-1);
    transition: all 0.2s ease;
  }

  .toc-item:hover {
    background: var(--bg-secondary);
  }

  .toc-item.current {
    background: rgba(59, 130, 246, 0.1);
    color: var(--primary-blue);
  }

  .toc-item.completed {
    color: var(--success);
  }

  .toc-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border-medium);
  }

  .toc-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .toc-title {
    font-weight: var(--font-medium);
    font-size: var(--text-sm);
  }

  .toc-type {
    font-size: var(--text-xs);
    color: var(--text-secondary);
    text-transform: capitalize;
  }

  .notes-content {
    flex: 1;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .notes-input {
    flex: 1;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    padding: var(--space-3);
    font-family: inherit;
    font-size: var(--text-base);
    resize: vertical;
    min-height: 120px;
  }

  .highlights-section h4 {
    margin: 0 0 var(--space-3) 0;
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
  }

  .highlights-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .highlight-item {
    padding: var(--space-3);
    border-radius: var(--radius-lg);
    border-left: 4px solid;
  }

  .highlight-item.color-yellow {
    background: rgba(251, 191, 36, 0.1);
    border-left-color: rgb(251, 191, 36);
  }

  .highlight-item.color-green {
    background: rgba(16, 185, 129, 0.1);
    border-left-color: rgb(16, 185, 129);
  }

  .highlight-item.color-blue {
    background: rgba(59, 130, 246, 0.1);
    border-left-color: rgb(59, 130, 246);
  }

  .highlight-item.color-pink {
    background: rgba(236, 72, 153, 0.1);
    border-left-color: rgb(236, 72, 153);
  }

  .highlight-item.color-purple {
    background: rgba(168, 85, 247, 0.1);
    border-left-color: rgb(168, 85, 247);
  }

  .highlight-text {
    margin: 0 0 var(--space-2) 0;
    font-size: var(--text-sm);
    line-height: 1.5;
  }

  .highlight-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .highlight-section {
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }

  .remove-highlight {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    padding: var(--space-1);
    border-radius: var(--radius-sm);
  }

  .remove-highlight:hover {
    background: rgba(239, 68, 68, 0.1);
    color: rgb(239, 68, 68);
  }

  .highlight-tools {
    position: fixed;
    background: white;
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 280px;
  }

  .selected-text {
    margin: 0 0 var(--space-3) 0;
    padding: var(--space-2);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-style: italic;
  }

  .color-picker {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
  }

  .color-btn {
    width: 32px;
    height: 32px;
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .color-btn.active {
    border-color: var(--text-primary);
    transform: scale(1.1);
  }

  .color-btn.color-yellow { background: rgb(251, 191, 36); }
  .color-btn.color-green { background: rgb(16, 185, 129); }
  .color-btn.color-blue { background: rgb(59, 130, 246); }
  .color-btn.color-pink { background: rgb(236, 72, 153); }
  .color-btn.color-purple { background: rgb(168, 85, 247); }

  .highlight-actions {
    display: flex;
    gap: var(--space-2);
    justify-content: flex-end;
  }

  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  .completion-modal {
    padding: var(--space-8);
    max-width: 400px;
    width: 90%;
    text-align: center;
    animation: slideUp 0.3s ease;
  }

  .modal-icon {
    margin-bottom: var(--space-4);
  }

  .modal-title {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    margin: 0 0 var(--space-3) 0;
  }

  .modal-message {
    color: var(--text-secondary);
    margin: 0 0 var(--space-6) 0;
    line-height: 1.5;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (max-width: 1024px) {
    .content-area {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      max-height: 300px;
      order: -1;
    }

    .main-content {
      padding: var(--space-4);
    }

    .material-header {
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-3);
    }
  }
</style>