<script lang="ts">
  import { goto } from '$app/navigation';
  import { Edit3, Settings, UserCircle2 } from 'lucide-svelte';

  // Component props
  export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'secondary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let fullWidth: boolean = false;
  export let showIcon: boolean = true;
  export let text: string = 'Edit Profil';
  export let disabled: boolean = false;

  // Navigation function
  function handleEditProfile() {
    if (disabled) return;
    goto('/profile/edit');
  }

  // Dynamic classes based on props
  $: buttonClasses = [
    'edit-profile-btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'full-width' : '',
    disabled ? 'disabled' : ''
  ].filter(Boolean).join(' ');
</script>

<button 
  class={buttonClasses}
  on:click={handleEditProfile}
  {disabled}
  type="button"
  aria-label="Edit profil pengguna"
>
  {#if showIcon}
    {#if variant === 'ghost'}
      <Settings size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
    {:else if variant === 'outline'}
      <UserCircle2 size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
    {:else}
      <Edit3 size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
    {/if}
  {/if}
  <span class="button-text">{text}</span>
</button>

<style>
  .edit-profile-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    border: none;
    border-radius: var(--radius-lg);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    white-space: nowrap;
  }

  .edit-profile-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .edit-profile-btn:not(.disabled):hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .edit-profile-btn:not(.disabled):active {
    transform: translateY(0);
  }

  /* Size variants */
  .btn-sm {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
  }

  .btn-md {
    padding: var(--space-3) var(--space-4);
    font-size: var(--text-base);
  }

  .btn-lg {
    padding: var(--space-4) var(--space-6);
    font-size: var(--text-lg);
  }

  /* Style variants */
  .btn-primary {
    background: var(--gradient-primary);
    color: white;
  }

  .btn-primary:not(.disabled):hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
  }

  .btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-medium);
  }

  .btn-secondary:not(.disabled):hover {
    background: var(--bg-primary);
    border-color: var(--primary-blue);
    color: var(--primary-blue);
  }

  .btn-outline {
    background: transparent;
    color: var(--primary-blue);
    border: 2px solid var(--primary-blue);
  }

  .btn-outline:not(.disabled):hover {
    background: var(--primary-blue);
    color: white;
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-secondary);
    border: none;
  }

  .btn-ghost:not(.disabled):hover {
    background: var(--bg-secondary);
    color: var(--primary-blue);
  }

  /* Full width variant */
  .full-width {
    width: 100%;
  }

  .button-text {
    font-weight: inherit;
  }

  /* Focus styles for accessibility */
  .edit-profile-btn:focus-visible {
    outline: 2px solid var(--primary-blue);
    outline-offset: 2px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .btn-lg {
      padding: var(--space-3) var(--space-5);
      font-size: var(--text-base);
    }
    
    .btn-md {
      padding: var(--space-2) var(--space-3);
      font-size: var(--text-sm);
    }
  }
</style>