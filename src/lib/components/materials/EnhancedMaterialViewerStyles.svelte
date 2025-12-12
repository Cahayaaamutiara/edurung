<!-- Enhanced Material Viewer Styles Component -->
<!-- This component provides CSS styles for the enhanced material viewer -->

<style>
  /* Enhanced Material Viewer Styles */

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

  .interactive-container {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    margin-bottom: var(--space-6);
    text-align: center;
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

    .header-controls {
      justify-content: center;
    }
  }

  @media (max-width: 640px) {
    .section-navigation {
      flex-direction: column;
      gap: var(--space-4);
    }

    .nav-info {
      order: -1;
    }

    .highlight-tools {
      width: 90%;
      left: 5%;
      transform: translateY(-50%);
    }
  }
</style>