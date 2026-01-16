<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { currentUser, authFunctions } from "$lib/stores/auth";
  import { notificationFunctions } from "$lib/stores/notifications";
  import { availableAvatars } from "$lib/utils/helpers";
  import {
    UserCircle2,
    Save,
    ArrowLeft,
    Camera,
    GraduationCap,
    Mail,
    Calendar,
  } from "lucide-svelte";
  import type { User } from "$lib/types";

  const user = $derived($currentUser);

  // Form state
  let editForm = {
    name: "",
    class: "",
    avatar: "",
    username: "",
  };

  let isLoading = false;
  let formErrors: Record<string, string> = {};

  let fileInput: HTMLInputElement;

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Limit size to 2MB
      if (file.size > 2 * 1024 * 1024) {
        notificationFunctions.addNotification({
          type: "challenge",
          title: "File Terlalu Besar",
          message: "Maksimal ukuran file adalah 2MB",
          data: null,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          editForm.avatar = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function triggerFileUpload() {
    fileInput.click();
  }

  // Class options for the select dropdown
  const classOptions = [
    "X IPA 1",
    "X IPA 2",
    "X IPS 1",
    "X IPS 2",
    "XI IPA 1",
    "XI IPA 2",
    "XI IPS 1",
    "XI IPS 2",
    "XII IPA 1",
    "XII IPA 2",
    "XII IPS 1",
    "XII IPS 2",
  ];

  onMount(() => {
    // Redirect if not logged in
    if (!user) {
      goto("/login");
      return;
    }

    // Initialize form with current user data
    editForm = {
      name: user.name || "",
      class: user.class || "",
      avatar: user.avatar || availableAvatars[0],
      username: user.username || "",
    };
  });

  function validateForm(): boolean {
    formErrors = {};

    if (!editForm.name.trim()) {
      formErrors.name = "Nama tidak boleh kosong";
    } else if (editForm.name.trim().length < 2) {
      formErrors.name = "Nama minimal 2 karakter";
    }

    if (!editForm.class) {
      formErrors.class = "Silakan pilih kelas";
    }

    if (!editForm.username.trim()) {
      formErrors.username = "Username tidak boleh kosong";
    } else if (editForm.username.trim().length < 3) {
      formErrors.username = "Username minimal 3 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(editForm.username.trim())) {
      formErrors.username =
        "Username hanya boleh mengandung huruf, angka, dan underscore";
    }

    return Object.keys(formErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;

    isLoading = true;

    try {
      // Update user profile
      await authFunctions.updateUser({
        name: editForm.name.trim(),
        class: editForm.class,
        avatar: editForm.avatar,
        username: editForm.username.trim(),
      });

      // Show success notification
      notificationFunctions.addNotification({
        type: "achievement",
        title: "Profil Berhasil Diperbarui",
        message: "Perubahan profil Anda telah disimpan.",
        data: null,
      });

      // Redirect back to profile page
      goto("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      notificationFunctions.addNotification({
        type: "challenge",
        title: "Gagal Memperbarui Profil",
        message:
          "Terjadi kesalahan saat menyimpan perubahan. Silakan coba lagi.",
        data: null,
      });
    } finally {
      isLoading = false;
    }
  }

  function handleCancel() {
    goto("/profile");
  }

  function selectAvatar(avatar: string) {
    editForm.avatar = avatar;
  }
</script>

<svelte:head>
  <title>Edit Profil - Edu Ruang</title>
</svelte:head>

<div class="edit-profile-page">
  <div class="container">
    <!-- Header -->
    <div class="page-header">
      <button class="back-btn btn-ghost" onclick={handleCancel}>
        <ArrowLeft size={20} />
        Kembali
      </button>
      <h1 class="page-title">Edit Profil</h1>
      <div></div>
      <!-- Spacer for flex layout -->
    </div>

    <!-- Edit Form -->
    <div class="edit-form-container card">
      <div class="form-section">
        <!-- Avatar Selection -->
        <div class="avatar-section">
          <h3 class="section-title">
            <Camera size={20} />
            Foto Profil
          </h3>
          <div class="current-avatar">
            <div class="user-avatar extra-large">
              {#if editForm.avatar && editForm.avatar.startsWith("data:")}
                <img
                  src={editForm.avatar}
                  alt="Avatar Preview"
                  class="avatar-image-preview"
                />
              {:else}
                <UserCircle2 size={100} />
              {/if}
            </div>

            <div
              class="upload-actions"
              style="margin-bottom: 1rem; display: flex; justify-content: center;"
            >
              <input
                type="file"
                bind:this={fileInput}
                hidden
                accept="image/*"
                onchange={handleFileSelect}
              />
              <button
                class="btn-secondary btn-sm"
                onclick={triggerFileUpload}
                type="button"
                style="display: flex; align-items: center; gap: 0.5rem;"
              >
                <Camera size={16} />
                Ambil Foto / Galeri
              </button>
            </div>

            <p class="avatar-hint">Atau pilih avatar dari koleksi</p>
          </div>

          <div class="avatar-grid">
            {#each availableAvatars as avatar}
              <button
                class="avatar-option {editForm.avatar === avatar
                  ? 'selected'
                  : ''}"
                onclick={() => selectAvatar(avatar)}
                type="button"
              >
                <UserCircle2 size={32} />
              </button>
            {/each}
          </div>
        </div>

        <!-- Personal Information -->
        <div class="info-section">
          <h3 class="section-title">
            <UserCircle2 size={20} />
            Informasi Pribadi
          </h3>

          <div class="form-group">
            <label for="name" class="form-label">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              bind:value={editForm.name}
              placeholder="Masukkan nama lengkap"
              class="form-input {formErrors.name ? 'error' : ''}"
              disabled={isLoading}
            />
            {#if formErrors.name}
              <span class="error-message">{formErrors.name}</span>
            {/if}
          </div>

          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input
              id="username"
              type="text"
              bind:value={editForm.username}
              placeholder="Masukkan username"
              class="form-input {formErrors.username ? 'error' : ''}"
              disabled={isLoading}
            />
            {#if formErrors.username}
              <span class="error-message">{formErrors.username}</span>
            {/if}
            <span class="input-hint"
              >Username akan digunakan sebagai identitas unik Anda</span
            >
          </div>
        </div>

        <!-- Academic Information -->
        <div class="academic-section">
          <h3 class="section-title">
            <GraduationCap size={20} />
            Informasi Akademik
          </h3>

          <div class="form-group">
            <label for="class" class="form-label">Kelas</label>
            <select
              id="class"
              bind:value={editForm.class}
              class="form-select {formErrors.class ? 'error' : ''}"
              disabled={isLoading}
            >
              <option value="">Pilih Kelas</option>
              {#each classOptions as classOption}
                <option value={classOption}>{classOption}</option>
              {/each}
            </select>
            {#if formErrors.class}
              <span class="error-message">{formErrors.class}</span>
            {/if}
          </div>
        </div>

        <!-- Profile Summary -->
        {#if user}
          <div class="summary-section">
            <h3 class="section-title">
              <Calendar size={20} />
              Ringkasan Profil
            </h3>
            <div class="summary-card">
              <div class="summary-item">
                <span class="summary-label">Level Saat Ini:</span>
                <span class="summary-value">{user.level}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Poin:</span>
                <span class="summary-value">{user.points}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Bergabung Sejak:</span>
                <span class="summary-value"
                  >{new Date(user.joinDate).toLocaleDateString("id-ID")}</span
                >
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <button
          class="btn-secondary btn-lg"
          onclick={handleCancel}
          disabled={isLoading}
          type="button"
        >
          Batal
        </button>
        <button
          class="btn-primary btn-lg"
          onclick={handleSave}
          disabled={isLoading}
          type="button"
        >
          {#if isLoading}
            <div class="loading-spinner"></div>
            Menyimpan...
          {:else}
            <Save size={20} />
            Simpan Perubahan
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .edit-profile-page {
    min-height: 100vh;
    background: var(--bg-secondary);
    padding: var(--space-6) 0;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-8);
    padding: 0 var(--space-4);
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    color: var(--text-secondary);
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    color: var(--primary-blue);
    background: var(--bg-primary);
  }

  .page-title {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    margin: 0;
  }

  .edit-form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: var(--space-8);
  }

  .form-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-2);
    border-bottom: 2px solid var(--border-light);
  }

  /* Avatar Section */
  .avatar-section {
    text-align: center;
  }

  .current-avatar {
    margin-bottom: var(--space-6);
  }

  .user-avatar.extra-large {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto var(--space-3);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  .avatar-image-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-hint {
    color: var(--text-secondary);
    font-size: var(--text-sm);
    margin: 0;
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: var(--space-3);
    max-width: 400px;
    margin: 0 auto;
  }

  .avatar-option {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid var(--border-light);
    background: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-secondary);
  }

  .avatar-option:hover {
    border-color: var(--primary-blue);
    background: var(--bg-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .avatar-option.selected {
    border-color: var(--primary-blue);
    background: var(--primary-blue);
    color: white;
    box-shadow: var(--shadow-lg);
  }

  /* Form Elements */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .form-label {
    font-weight: var(--font-medium);
    color: var(--text-primary);
    font-size: var(--text-sm);
  }

  .form-input,
  .form-select {
    padding: var(--space-3) var(--space-4);
    border: 2px solid var(--border-medium);
    border-radius: var(--radius-lg);
    background: var(--bg-primary);
    font-size: var(--text-base);
    color: var(--text-primary);
    transition: all 0.2s ease;
  }

  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-input.error,
  .form-select.error {
    border-color: var(--error);
  }

  .form-input:disabled,
  .form-select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    color: var(--error);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
  }

  .input-hint {
    color: var(--text-secondary);
    font-size: var(--text-xs);
  }

  /* Summary Section */
  .summary-card {
    background: var(--bg-tertiary);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-light);
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--border-light);
  }

  .summary-item:last-child {
    border-bottom: none;
  }

  .summary-label {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .summary-value {
    font-weight: var(--font-semibold);
    color: var(--text-primary);
  }

  /* Action Buttons */
  .form-actions {
    display: flex;
    gap: var(--space-4);
    margin-top: var(--space-8);
    padding-top: var(--space-6);
    border-top: 1px solid var(--border-light);
  }

  .btn-lg {
    flex: 1;
    padding: var(--space-4) var(--space-6);
    font-size: var(--text-base);
    font-weight: var(--font-medium);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .edit-profile-page {
      padding: var(--space-4) 0;
    }

    .edit-form-container {
      margin: 0 var(--space-4);
      padding: var(--space-6);
    }

    .avatar-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    .form-actions {
      flex-direction: column;
    }

    .page-header {
      margin-bottom: var(--space-6);
    }

    .page-title {
      font-size: var(--text-xl);
    }
  }

  @media (max-width: 480px) {
    .avatar-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .avatar-option {
      width: 50px;
      height: 50px;
    }

    .user-avatar.extra-large {
      width: 100px;
      height: 100px;
    }
  }
</style>
