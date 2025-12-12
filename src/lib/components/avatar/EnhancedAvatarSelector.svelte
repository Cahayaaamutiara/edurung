<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ChevronLeft, ChevronRight, Lock, Star, Palette, Sparkles } from 'lucide-svelte';
  import { presetAvatars, avatarAccessories, avatarColors, rarityColors, getUnlockedAvatars, getUnlockedAccessories, getUnlockedColors, getRarityColor } from '$lib/data/avatarData';
  import type { CustomAvatar, AvatarAccessory } from '$lib/types';

  export let userLevel: number = 1;
  export let selectedAvatar: string = 'student-1';
  export let customAvatar: CustomAvatar | null = null;

  const dispatch = createEventDispatcher();

  let currentTab: 'preset' | 'custom' = 'preset';
  let currentAccessoryType: 'hat' | 'glasses' | 'background' | 'pet' = 'hat';
  let currentColorType: 'hair' | 'skin' | 'clothing' = 'hair';

  // Reactive data
  $: unlockedAvatars = getUnlockedAvatars(userLevel);
  $: unlockedAccessories = getUnlockedAccessories(userLevel);
  $: unlockedColors = getUnlockedColors(userLevel, currentColorType);

  // Custom avatar state
  let tempCustomAvatar: CustomAvatar = {
    id: 'temp-' + Date.now(),
    type: 'custom',
    baseAvatar: 'student-1',
    accessories: [],
    colors: {
      hair: '#2C1810',
      skin: '#FDBCB4',
      clothing: '#4169E1'
    },
    unlocked: true
  };

  function selectPresetAvatar(avatarId: string) {
    selectedAvatar = avatarId;
    dispatch('select', { type: 'preset', avatar: avatarId });
  }

  function selectAccessory(accessory: AvatarAccessory) {
    if (!accessory.isUnlocked) return;

    // Remove existing accessory of same type
    tempCustomAvatar.accessories = tempCustomAvatar.accessories.filter(acc => acc.type !== accessory.type);
    
    // Add new accessory
    tempCustomAvatar.accessories = [...tempCustomAvatar.accessories, accessory];
    
    updateCustomAvatar();
  }

  function removeAccessory(accessoryType: string) {
    tempCustomAvatar.accessories = tempCustomAvatar.accessories.filter(acc => acc.type !== accessoryType);
    updateCustomAvatar();
  }

  function selectColor(color: string) {
    tempCustomAvatar.colors = {
      ...tempCustomAvatar.colors,
      [currentColorType]: color
    };
    updateCustomAvatar();
  }

  function updateCustomAvatar() {
    customAvatar = { ...tempCustomAvatar };
    dispatch('select', { type: 'custom', avatar: customAvatar });
  }

  function switchTab(tab: 'preset' | 'custom') {
    currentTab = tab;
    if (tab === 'custom') {
      if (!customAvatar) {
        tempCustomAvatar.baseAvatar = selectedAvatar;
      } else {
        tempCustomAvatar = { ...customAvatar };
      }
    }
  }

  function getAccessoriesByType(type: string) {
    return unlockedAccessories.filter(acc => acc.type === type);
  }

  function hasAccessoryOfType(type: string) {
    return tempCustomAvatar.accessories.some(acc => acc.type === type);
  }

  function getAccessoryOfType(type: string) {
    return tempCustomAvatar.accessories.find(acc => acc.type === type);
  }
</script>

<div class="avatar-selector">
  <!-- Tab Navigation -->
  <div class="tab-navigation">
    <button 
      class="tab-btn {currentTab === 'preset' ? 'active' : ''}"
      on:click={() => switchTab('preset')}
    >
      <Star size={16} />
      Avatar Preset
    </button>
    <button 
      class="tab-btn {currentTab === 'custom' ? 'active' : ''}"
      on:click={() => switchTab('custom')}
    >
      <Palette size={16} />
      Kustomisasi
    </button>
  </div>

  {#if currentTab === 'preset'}
    <!-- Preset Avatars -->
    <div class="preset-section">
      <h3>Pilih Avatar</h3>
      <div class="avatar-grid">
        {#each presetAvatars as avatar}
          <button 
            class="avatar-card {selectedAvatar === avatar.id ? 'selected' : ''} {avatar.unlockLevel <= userLevel ? '' : 'locked'}"
            on:click={() => avatar.unlockLevel <= userLevel && selectPresetAvatar(avatar.id)}
            disabled={avatar.unlockLevel > userLevel}
          >
            <div class="avatar-icon" style="border-color: {getRarityColor(avatar.rarity)}">
              {avatar.icon}
            </div>
            <div class="avatar-info">
              <h4>{avatar.name}</h4>
              <p>{avatar.description}</p>
              {#if avatar.unlockLevel > userLevel}
                <div class="unlock-level">
                  <Lock size={12} />
                  Level {avatar.unlockLevel}
                </div>
              {:else}
                <div class="rarity-badge" style="background-color: {getRarityColor(avatar.rarity)}">
                  {avatar.rarity.toUpperCase()}
                </div>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Custom Avatar Creator -->
    <div class="custom-section">
      <!-- Avatar Preview -->
      <div class="avatar-preview">
        <h3>Preview Avatar</h3>
        <div class="preview-container">
          <div class="preview-avatar">
            <!-- Base Avatar -->
            <div class="base-avatar">
              {presetAvatars.find(a => a.id === tempCustomAvatar.baseAvatar)?.icon || '👤'}
            </div>
            
            <!-- Accessories Layer -->
            <div class="accessories-layer">
              {#each tempCustomAvatar.accessories as accessory}
                <span class="accessory accessory-{accessory.type}">{accessory.icon}</span>
              {/each}
            </div>
            
            <!-- Color indicators -->
            <div class="color-indicators">
              <div class="color-dot hair" style="background-color: {tempCustomAvatar.colors.hair}"></div>
              <div class="color-dot skin" style="background-color: {tempCustomAvatar.colors.skin}"></div>
              <div class="color-dot clothing" style="background-color: {tempCustomAvatar.colors.clothing}"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Base Avatar Selection -->
      <div class="base-selection">
        <h4>Pilih Avatar Dasar</h4>
        <div class="base-grid">
          {#each unlockedAvatars as avatar}
            <button 
              class="base-option {tempCustomAvatar.baseAvatar === avatar.id ? 'selected' : ''}"
              on:click={() => tempCustomAvatar.baseAvatar = avatar.id}
            >
              {avatar.icon}
            </button>
          {/each}
        </div>
      </div>

      <!-- Accessories Section -->
      <div class="accessories-section">
        <h4>Aksesoris</h4>
        
        <!-- Accessory Type Tabs -->
        <div class="accessory-tabs">
          <button 
            class="accessory-tab {currentAccessoryType === 'hat' ? 'active' : ''}"
            on:click={() => currentAccessoryType = 'hat'}
          >
            🎩 Topi
          </button>
          <button 
            class="accessory-tab {currentAccessoryType === 'glasses' ? 'active' : ''}"
            on:click={() => currentAccessoryType = 'glasses'}
          >
            👓 Kacamata
          </button>
          <button 
            class="accessory-tab {currentAccessoryType === 'background' ? 'active' : ''}"
            on:click={() => currentAccessoryType = 'background'}
          >
            🌍 Latar
          </button>
          <button 
            class="accessory-tab {currentAccessoryType === 'pet' ? 'active' : ''}"
            on:click={() => currentAccessoryType = 'pet'}
          >
            🐾 Pet
          </button>
        </div>

        <!-- Accessory Grid -->
        <div class="accessory-grid">
          <!-- Remove button -->
          {#if hasAccessoryOfType(currentAccessoryType)}
            <button 
              class="accessory-item remove-btn"
              on:click={() => removeAccessory(currentAccessoryType)}
            >
              <div class="accessory-icon">❌</div>
              <span>Hapus</span>
            </button>
          {/if}

          {#each getAccessoriesByType(currentAccessoryType) as accessory}
            <button 
              class="accessory-item {!accessory.isUnlocked ? 'locked' : ''} {getAccessoryOfType(currentAccessoryType)?.id === accessory.id ? 'selected' : ''}"
              on:click={() => selectAccessory(accessory)}
              disabled={!accessory.isUnlocked}
            >
              <div class="accessory-icon" style="border-color: {getRarityColor(accessory.rarity)}">
                {accessory.icon}
              </div>
              <span class="accessory-name">{accessory.name}</span>
              {#if !accessory.isUnlocked}
                <div class="unlock-info">
                  <Lock size={10} />
                  Lv.{accessory.unlockLevel}
                </div>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Colors Section -->
      <div class="colors-section">
        <h4>Warna</h4>
        
        <!-- Color Type Tabs -->
        <div class="color-tabs">
          <button 
            class="color-tab {currentColorType === 'hair' ? 'active' : ''}"
            on:click={() => currentColorType = 'hair'}
          >
            Rambut
          </button>
          <button 
            class="color-tab {currentColorType === 'skin' ? 'active' : ''}"
            on:click={() => currentColorType = 'skin'}
          >
            Kulit
          </button>
          <button 
            class="color-tab {currentColorType === 'clothing' ? 'active' : ''}"
            on:click={() => currentColorType = 'clothing'}
          >
            Pakaian
          </button>
        </div>

        <!-- Color Grid -->
        <div class="color-grid">
          {#each unlockedColors as color}
            <button 
              class="color-option {tempCustomAvatar.colors[currentColorType] === color.value ? 'selected' : ''}"
              style="background-color: {color.value}"
              on:click={() => selectColor(color.value)}
              title={color.name}
            >
              <span class="color-name">{color.name}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .avatar-selector {
    max-width: 800px;
    margin: 0 auto;
  }

  .tab-navigation {
    display: flex;
    gap: var(--space-1);
    margin-bottom: var(--space-6);
    background: var(--bg-tertiary);
    border-radius: var(--radius-lg);
    padding: var(--space-1);
  }

  .tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: var(--font-medium);
  }

  .tab-btn.active {
    background: var(--bg-primary);
    color: var(--primary-blue);
    box-shadow: var(--shadow-sm);
  }

  .tab-btn:hover:not(.active) {
    background: var(--bg-secondary);
  }

  /* Preset Avatars */
  .preset-section h3 {
    text-align: center;
    margin-bottom: var(--space-6);
    color: var(--text-primary);
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-4);
  }

  .avatar-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-4);
    border: 2px solid var(--border-light);
    border-radius: var(--radius-xl);
    background: var(--bg-primary);
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
  }

  .avatar-card:hover:not(.locked) {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .avatar-card.selected {
    border-color: var(--primary-blue);
    background: rgba(59, 130, 246, 0.1);
  }

  .avatar-card.locked {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .avatar-icon {
    font-size: 3rem;
    margin-bottom: var(--space-3);
    padding: var(--space-3);
    border: 3px solid transparent;
    border-radius: 50%;
    background: var(--bg-secondary);
  }

  .avatar-info h4 {
    margin: 0 0 var(--space-1) 0;
    font-size: var(--text-base);
    color: var(--text-primary);
  }

  .avatar-info p {
    margin: 0 0 var(--space-2) 0;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .unlock-level {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }

  .rarity-badge {
    font-size: var(--text-xs);
    color: white;
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-md);
    font-weight: var(--font-bold);
  }

  /* Custom Avatar Creator */
  .custom-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .avatar-preview {
    text-align: center;
  }

  .avatar-preview h3 {
    margin-bottom: var(--space-4);
    color: var(--text-primary);
  }

  .preview-container {
    display: flex;
    justify-content: center;
    margin-bottom: var(--space-4);
  }

  .preview-avatar {
    position: relative;
    width: 100px;
    height: 100px;
    border: 3px solid var(--primary-blue);
    border-radius: 50%;
    background: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }

  .base-avatar {
    position: relative;
    z-index: 1;
  }

  .accessories-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
  }

  .accessory {
    position: absolute;
    font-size: 1.5rem;
  }

  .accessory-hat { top: -10px; left: 50%; transform: translateX(-50%); }
  .accessory-glasses { top: 30%; left: 50%; transform: translateX(-50%); }
  .accessory-pet { bottom: -10px; right: -10px; font-size: 1rem; }

  .color-indicators {
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--space-1);
  }

  .color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: var(--shadow-sm);
  }

  /* Base Selection */
  .base-selection h4 {
    margin-bottom: var(--space-3);
    color: var(--text-primary);
  }

  .base-grid {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
    justify-content: center;
  }

  .base-option {
    width: 60px;
    height: 60px;
    border: 2px solid var(--border-light);
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    font-size: 2rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .base-option:hover {
    transform: scale(1.05);
  }

  .base-option.selected {
    border-color: var(--primary-blue);
    background: rgba(59, 130, 246, 0.1);
  }

  /* Accessories */
  .accessories-section h4,
  .colors-section h4 {
    margin-bottom: var(--space-3);
    color: var(--text-primary);
  }

  .accessory-tabs,
  .color-tabs {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
    flex-wrap: wrap;
  }

  .accessory-tab,
  .color-tab {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: var(--text-sm);
  }

  .accessory-tab.active,
  .color-tab.active {
    background: var(--primary-blue);
    color: white;
    border-color: var(--primary-blue);
  }

  .accessory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: var(--space-3);
  }

  .accessory-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-3);
    border: 2px solid var(--border-light);
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .accessory-item:hover:not(.locked) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .accessory-item.selected {
    border-color: var(--primary-blue);
    background: rgba(59, 130, 246, 0.1);
  }

  .accessory-item.locked {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .accessory-item.remove-btn {
    border-color: var(--error);
    color: var(--error);
  }

  .accessory-icon {
    font-size: 1.5rem;
    margin-bottom: var(--space-2);
    padding: var(--space-2);
    border: 2px solid transparent;
    border-radius: 50%;
  }

  .accessory-name {
    font-size: var(--text-xs);
    text-align: center;
    font-weight: var(--font-medium);
  }

  .unlock-info {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: 10px;
    color: var(--text-tertiary);
    margin-top: var(--space-1);
  }

  /* Colors */
  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: var(--space-2);
  }

  .color-option {
    width: 60px;
    height: 60px;
    border: 3px solid var(--border-light);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .color-option:hover {
    transform: scale(1.05);
  }

  .color-option.selected {
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 2px var(--primary-blue);
  }

  .color-name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 10px;
    padding: 2px;
    text-align: center;
  }

  @media (max-width: 768px) {
    .avatar-grid {
      grid-template-columns: 1fr;
    }

    .custom-section {
      gap: var(--space-4);
    }

    .accessory-tabs,
    .color-tabs {
      flex-direction: column;
    }

    .base-grid {
      justify-content: flex-start;
    }
  }
</style>