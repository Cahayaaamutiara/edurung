<script lang="ts">
	import { onMount } from "svelte";
	import { currentUser } from "$lib/stores/auth";
	import {
		discussionPosts,
		discussionFunctions,
	} from "$lib/stores/discussion";
	import { sampleSubjects, sampleDiscussions } from "$lib/data/sampleData";
	import { formatRelativeTime } from "$lib/utils/helpers";
	import {
		MessageCircle,
		Plus,
		ThumbsUp,
		ThumbsDown,
		UserCircle2,
		Filter,
		Search,
		Reply,
		Send,
	} from "lucide-svelte";
	import type { DiscussionPost, Subject } from "$lib/types";

	const user = $derived($currentUser);
	const posts = $derived($discussionPosts);

	let showNewPostModal = $state(false);
	let selectedSubject = $state(""); // For filtering
	let newPostSubject = $state(""); // For new post
	let searchQuery = $state("");
	let replyingToPostId = $state<string | null>(null);
	let replyContent = $state("");
	let newPostTitle = $state("");
	let newPostContent = $state("");
	let subjects: Subject[] = $state([]);
	let filteredPosts: DiscussionPost[] = $state([]);

	onMount(() => {
		loadData();
	});

	function loadData() {
		try {
			// Load subjects
			const storedSubjects = localStorage.getItem("edu-ruang-subjects");
			if (storedSubjects) {
				subjects = JSON.parse(storedSubjects);
			} else {
				subjects = sampleSubjects;
				try {
					localStorage.setItem(
						"edu-ruang-subjects",
						JSON.stringify(sampleSubjects),
					);
				} catch (e) {
					console.error("Storage error", e);
				}
			}

			// Initialize discussions if empty
			if ($discussionPosts.length === 0) {
				sampleDiscussions.forEach((post) => {
					discussionFunctions.addPost({
						userId: post.userId,
						userName: post.userName,
						userAvatar: post.userAvatar,
						subjectId: post.subjectId,
						title: post.title,
						content: post.content,
						likes: post.likes,
						dislikes: post.dislikes,
						replies: [],
					});
				});
			}
		} catch (error) {
			console.error("Load data error:", error);
			// Fallback
			if (subjects.length === 0) subjects = sampleSubjects;
		}
	}

	function openNewPostModal() {
		// Reset subject to empty or selected? safe: empty
		newPostSubject = "";
		showNewPostModal = true;
	}

	function closeNewPostModal() {
		showNewPostModal = false;
		newPostTitle = "";
		newPostContent = "";
		newPostSubject = "";
	}

	function createNewPost() {
		if (
			!user ||
			!newPostTitle.trim() ||
			!newPostContent.trim() ||
			!newPostSubject
		) {
			return;
		}

		discussionFunctions.addPost({
			userId: user.id,
			userName: user.name,
			userAvatar: user.avatar,
			subjectId: newPostSubject,
			title: newPostTitle.trim(),
			content: newPostContent.trim(),
			likes: 0,
			dislikes: 0,
			replies: [],
		});

		closeNewPostModal();
	}

	function likePost(postId: string) {
		discussionFunctions.likePost(postId);
	}

	function dislikePost(postId: string) {
		discussionFunctions.dislikePost(postId);
	}

	function toggleReply(postId: string) {
		if (replyingToPostId === postId) {
			replyingToPostId = null;
		} else {
			replyingToPostId = postId;
			replyContent = "";
		}
	}

	function submitReply(postId: string) {
		if (!user || !replyContent.trim()) return;

		discussionFunctions.addReply(postId, {
			userId: user.id,
			userName: user.name,
			userAvatar: user.avatar,
			postId: postId,
			content: replyContent.trim(),
			likes: 0,
			dislikes: 0,
		});

		replyingToPostId = null;
		replyContent = "";
	}

	function getSubjectName(subjectId: string) {
		const subject = subjects.find((s) => s.id === subjectId);
		return subject?.name || "Umum";
	}

	function getSubjectColor(subjectId: string) {
		const subject = subjects.find((s) => s.id === subjectId);
		return subject?.color || "#6B7280";
	}

	// Filter posts based on search and subject
	$effect(() => {
		filteredPosts = posts.filter((post) => {
			const matchesSearch =
				searchQuery === "" ||
				post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.content
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				post.userName.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesSubject =
				selectedSubject === "" || post.subjectId === selectedSubject;

			return matchesSearch && matchesSubject;
		});
	});
</script>

<div class="discussion-page">
	<div class="container">
		<!-- Header -->
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">💬 Forum Diskusi</h1>
				<p class="page-subtitle">
					Diskusi dan tanya jawab dengan teman-teman
				</p>
			</div>
			<button
				type="button"
				class="new-post-btn btn-primary"
				onclick={openNewPostModal}
				onkeydown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						openNewPostModal();
					}
				}}
			>
				<Plus size={20} />
				Buat Pertanyaan
			</button>
		</div>

		<!-- Filters -->
		<div class="filters-section card">
			<div class="search-container">
				<div class="search-input-container">
					<Search size={20} />
					<input
						type="text"
						placeholder="Cari diskusi..."
						bind:value={searchQuery}
						class="search-input"
					/>
				</div>
			</div>

			<div class="subject-filter">
				<Filter size={20} />
				<select bind:value={selectedSubject} class="subject-select">
					<option value="">Semua Mata Pelajaran</option>
					{#each subjects as subject}
						<option value={subject.id}>{subject.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Discussion Posts -->
		<div class="posts-section">
			{#if filteredPosts.length === 0}
				<div class="empty-state card">
					<MessageCircle size={48} color="#CBD5E1" />
					<h3>Belum Ada Diskusi</h3>
					<p>Jadilah yang pertama untuk memulai diskusi!</p>
					<button
						type="button"
						class="btn-primary"
						onclick={openNewPostModal}
						onkeydown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								openNewPostModal();
							}
						}}
					>
						<Plus size={20} />
						Buat Pertanyaan Pertama
					</button>
				</div>
			{:else}
				<div class="posts-list">
					{#each filteredPosts as post}
						<div class="post-card card animate-fade-in">
							<div class="post-header">
								<div class="author-info">
									<div class="author-avatar">
										<UserCircle2 size={32} />
									</div>
									<div class="author-details">
										<h4>{post.userName}</h4>
										<span class="post-time"
											>{formatRelativeTime(
												post.createdAt,
											)}</span
										>
									</div>
								</div>
								<div
									class="subject-tag"
									style="background: {getSubjectColor(
										post.subjectId,
									)}20; color: {getSubjectColor(
										post.subjectId,
									)}"
								>
									{getSubjectName(post.subjectId)}
								</div>
							</div>

							<div class="post-content">
								<h3 class="post-title">{post.title}</h3>
								<p class="post-text">{post.content}</p>
							</div>

							<div class="post-footer">
								<div class="post-stats">
									<button
										class="vote-btn like-btn"
										onclick={() => likePost(post.id)}
										onkeydown={(e) => {
											if (
												e.key === "Enter" ||
												e.key === " "
											) {
												e.preventDefault();
												likePost(post.id);
											}
										}}
									>
										<ThumbsUp size={16} />
										<span>{post.likes}</span>
									</button>
									<button
										class="vote-btn dislike-btn"
										onclick={() => dislikePost(post.id)}
										onkeydown={(e) => {
											if (
												e.key === "Enter" ||
												e.key === " "
											) {
												e.preventDefault();
												dislikePost(post.id);
											}
										}}
									>
										<ThumbsDown size={16} />
										<span>{post.dislikes}</span>
									</button>
									<button
										class="vote-btn"
										onclick={() => toggleReply(post.id)}
										title="Balas"
									>
										<Reply size={16} />
										<span>Balas</span>
									</button>
									<div class="replies-count">
										<MessageCircle size={16} />
										<span
											>{post.replies.length} balasan</span
										>
									</div>
								</div>
							</div>

							{#if replyingToPostId === post.id}
								<div class="reply-form animate-fade-in">
									<textarea
										bind:value={replyContent}
										class="reply-input"
										placeholder="Tulis balasan Anda..."
										rows="1"
										onkeydown={(e) => {
											if (
												e.key === "Enter" &&
												!e.shiftKey
											) {
												e.preventDefault();
												submitReply(post.id);
											}
										}}
									></textarea>
									<button
										class="btn-primary"
										onclick={() => submitReply(post.id)}
										disabled={!replyContent.trim()}
									>
										<Send size={16} />
									</button>
								</div>
							{/if}

							<!-- Replies -->
							{#if post.replies.length > 0}
								<div class="replies-section">
									<h4 class="replies-title">Balasan:</h4>
									{#each post.replies as reply}
										<div class="reply-item">
											<div class="reply-author">
												<div
													class="author-avatar small"
												>
													<UserCircle2 size={24} />
												</div>
												<div class="author-details">
													<span class="author-name"
														>{reply.userName}</span
													>
													<span class="reply-time"
														>{formatRelativeTime(
															reply.createdAt,
														)}</span
													>
												</div>
											</div>
											<p class="reply-content">
												{reply.content}
											</p>
											<div class="reply-votes">
												<button
													class="vote-btn small"
													onkeydown={(e) => {
														if (
															e.key === "Enter" ||
															e.key === " "
														) {
															e.preventDefault(); /* Add like functionality if needed */
														}
													}}
												>
													<ThumbsUp size={12} />
													<span>{reply.likes}</span>
												</button>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- New Post Modal -->
{#if showNewPostModal}
	<div
		class="modal-overlay"
		onclick={() => {
			closeNewPostModal();
		}}
		role="presentation"
		tabindex="-1"
		onkeydown={(e) => {
			if (e.key === "Escape") closeNewPostModal();
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				closeNewPostModal();
			}
		}}
	>
		<div
			class="modal-content card"
			onclick={(e) => {
				e.stopPropagation();
			}}
			onkeydown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					e.stopPropagation();
				}
			}}
			role="dialog"
			aria-modal="true"
			aria-labelledby="new-post-title"
			tabindex="0"
		>
			<div class="modal-header">
				<h2 id="new-post-title">Buat Pertanyaan Baru</h2>
				<button
					class="close-btn"
					onclick={closeNewPostModal}
					aria-label="Tutup modal"
					onkeydown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							closeNewPostModal();
						}
					}}>×</button
				>
			</div>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					createNewPost();
				}}
				class="new-post-form"
			>
				<div class="form-group">
					<label for="subject">Mata Pelajaran</label>
					<select id="subject" bind:value={newPostSubject} required>
						<option value="">Pilih Mata Pelajaran</option>
						{#each subjects as subject}
							<option value={subject.id}>{subject.name}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="title">Judul Pertanyaan</label>
					<input
						id="title"
						type="text"
						bind:value={newPostTitle}
						placeholder="Masukkan judul pertanyaan..."
						required
					/>
				</div>

				<div class="form-group">
					<label for="content">Detail Pertanyaan</label>
					<textarea
						id="content"
						bind:value={newPostContent}
						placeholder="Jelaskan pertanyaan kamu secara detail..."
						rows="6"
						required
					></textarea>
				</div>

				<div class="form-actions">
					<button
						type="button"
						class="btn-secondary"
						onclick={closeNewPostModal}
						onkeydown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								closeNewPostModal();
							}
						}}
					>
						Batal
					</button>
					<button
						type="submit"
						class="btn-primary"
						onkeydown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								createNewPost();
							}
						}}
					>
						<Plus size={20} />
						Posting
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.discussion-page {
		padding: var(--space-6) 0;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-6);
	}

	.page-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.page-subtitle {
		font-size: var(--text-lg);
		color: var(--text-secondary);
		margin: 0;
	}

	.new-post-btn {
		flex-shrink: 0;
	}

	/* Filters */
	.filters-section {
		display: flex;
		gap: var(--space-4);
		align-items: center;
		padding: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.search-container {
		flex: 1;
	}

	.search-input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input-container :global(svg) {
		position: absolute;
		left: var(--space-3);
		color: var(--text-secondary);
		z-index: 1;
	}

	.search-input {
		width: 100%;
		padding-left: var(--space-10);
		border: 1px solid var(--border-medium);
		border-radius: var(--radius-lg);
	}

	.subject-filter {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text-secondary);
	}

	.subject-select {
		min-width: 200px;
		border: 1px solid var(--border-medium);
		border-radius: var(--radius-lg);
		padding: var(--space-2) var(--space-3);
	}

	/* Posts */
	.posts-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.post-card {
		padding: var(--space-6);
		transition: all 0.2s ease;
	}

	.post-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.post-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.author-info {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.author-avatar {
		color: var(--text-secondary);
	}

	.author-avatar.small {
		color: var(--text-tertiary);
	}

	.author-details h4 {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		margin: 0 0 var(--space-1) 0;
		color: var(--text-primary);
	}

	.author-name {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--text-primary);
	}

	.post-time,
	.reply-time {
		font-size: var(--text-sm);
		color: var(--text-tertiary);
	}

	.subject-tag {
		padding: var(--space-1) var(--space-3);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.post-content {
		margin-bottom: var(--space-4);
	}

	.post-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-3) 0;
		color: var(--text-primary);
	}

	.post-text {
		color: var(--text-secondary);
		line-height: 1.6;
		margin: 0;
	}

	.post-footer {
		border-top: 1px solid var(--border-light);
		padding-top: var(--space-4);
	}

	.post-stats {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.vote-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-secondary);
		font-size: var(--text-sm);
		padding: var(--space-2);
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
	}

	.vote-btn:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.vote-btn.small {
		padding: var(--space-1);
		font-size: var(--text-xs);
	}

	.like-btn:hover {
		color: var(--success);
		background: rgba(16, 185, 129, 0.1);
	}

	.dislike-btn:hover {
		color: var(--error);
		background: rgba(239, 68, 68, 0.1);
	}

	.replies-count {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text-secondary);
		font-size: var(--text-sm);
	}

	/* Replies */
	.replies-section {
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: 1px solid var(--border-light);
		background: var(--bg-secondary);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
	}

	.replies-title {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		margin: 0 0 var(--space-3) 0;
		color: var(--text-primary);
	}

	.reply-item {
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-3);
		border-bottom: 1px solid var(--border-light);
	}

	.reply-item:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}

	.reply-author {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.reply-content {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0 0 var(--space-2) 0;
		line-height: 1.5;
	}

	.reply-votes {
		display: flex;
		gap: var(--space-2);
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--bg-overlay);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		padding: var(--space-4);
	}

	.modal-content {
		width: 100%;
		max-width: 600px;
		max-height: 90vh;
		overflow-y: auto;
		background: var(--bg-primary);
		border-radius: var(--radius-2xl);
		padding: 0;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-6);
		border-bottom: 1px solid var(--border-light);
	}

	.modal-header h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0;
		color: var(--text-primary);
	}

	.close-btn {
		background: none;
		border: none;
		font-size: var(--text-2xl);
		cursor: pointer;
		color: var(--text-secondary);
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
	}

	.close-btn:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.new-post-form {
		padding: var(--space-6);
	}

	.form-group {
		margin-bottom: var(--space-4);
	}

	.form-group label {
		display: block;
		font-weight: var(--font-medium);
		margin-bottom: var(--space-2);
		color: var(--text-primary);
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		width: 100%;
		border: 1px solid var(--border-medium);
		border-radius: var(--radius-lg);
		padding: var(--space-3);
		font-size: var(--text-base);
	}

	.form-group textarea {
		resize: vertical;
		font-family: inherit;
	}

	.form-actions {
		display: flex;
		gap: var(--space-3);
		justify-content: flex-end;
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: var(--space-8);
		color: var(--text-secondary);
	}

	.empty-state h3 {
		margin: var(--space-4) 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.empty-state p {
		margin: 0 0 var(--space-4) 0;
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			gap: var(--space-4);
			text-align: center;
		}

		.filters-section {
			flex-direction: column;
			gap: var(--space-3);
		}

		.subject-select {
			min-width: auto;
			width: 100%;
		}

		.post-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-3);
		}

		.post-stats {
			flex-wrap: wrap;
			gap: var(--space-2);
		}

		.form-actions {
			flex-direction: column;
		}

		.modal-content {
			margin: var(--space-4);
		}
	}
	.reply-form {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: 1px solid var(--border-light);
	}

	.reply-input {
		flex: 1;
		padding: var(--space-3);
		border: 1px solid var(--border-medium);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		resize: vertical;
		min-height: 44px;
		font-family: inherit;
	}

	.reply-input:focus {
		outline: none;
		border-color: var(--primary-blue);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}
</style>
