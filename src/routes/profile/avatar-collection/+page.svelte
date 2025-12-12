<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser, authFunctions } from '$lib/stores/auth';
	import { allAvatarItems, getItemsByCategory, getItemsByRarity, getExclusiveItems } from '$lib/data/avatarCollectionData';
	import type { EduRuangUser, AvatarItem, ActiveAvatar } from '$lib/types/gamification';
	import { User, ShoppingCart, Gift, Star, Zap } from 'lucide-svelte';

	const user = $derived($currentUser as EduRuangUser);
	
	let activeTab = 'items'; // items, showcase, shop, exchange
	let ownedItems: AvatarItem[] = [];
	let shopItems: AvatarItem[] = [];
	let exclusiveItems: AvatarItem[] = [];
	let activeAvatar: ActiveAvatar = {
		hat: undefined,
		clothing: undefined,
		glasses: undefined,
		accessory: undefined,
		shoes: undefined
	};
	
	let showEquipModal = false;
	let selectedItem: AvatarItem | null = null;
	let showPurchaseModal = false;
	let showGiftModal = false;

	onMount(() => {
		loadAvatarData();
	});

	function loadAvatarData() {
		// Initialize user's avatar collection if not exists
		if (user && !user.avatarCollection) {
			authFunctions.updateUser({
				avatarCollection: []
			} as Partial<EduRuangUser>);
		}
		
		// Get owned items
		if (user && user.avatarCollection) {
			ownedItems = user.avatarCollection.filter(item => item.isOwned);
		} else {
			ownedItems = [];
		}
		
		// Get shop items (not owned yet)
		shopItems = allAvatarItems.filter(item => 
			!ownedItems.some(owned => owned.id === item.id) && 
			item.price !== undefined
		);
		
		// Get exclusive items
		exclusiveItems = getExclusiveItems();
		
		// Get active avatar
		if (user && user.activeAvatar) {
			activeAvatar = user.activeAvatar;
		}
	}

	function equipItem(item: AvatarItem) {
		selectedItem = item;
		showEquipModal = true;
	}

	function confirmEquip() {
		if (!selectedItem) return;
		
		// Update active avatar
		const updatedActiveAvatar = { ...activeAvatar };
		
		switch(selectedItem.category) {
			case 'hat':
				updatedActiveAvatar.hat = selectedItem.id;
				break;
			case 'clothing':
				updatedActiveAvatar.clothing = selectedItem.id;
				break;
			case 'glasses':
				updatedActiveAvatar.glasses = selectedItem.id;
				break;
			case 'accessory':
				updatedActiveAvatar.accessory = selectedItem.id;
				break;
			case 'shoes':
				updatedActiveAvatar.shoes = selectedItem.id;
				break;
		}
		
		// Update user
		authFunctions.updateUser({
			activeAvatar: updatedActiveAvatar
		} as Partial<EduRuangUser>);
		
		activeAvatar = updatedActiveAvatar;
		showEquipModal = false;
		selectedItem = null;
	}

	function unequipItem(category: keyof ActiveAvatar) {
		const updatedActiveAvatar = { ...activeAvatar };
		updatedActiveAvatar[category] = undefined;
		
		authFunctions.updateUser({
			activeAvatar: updatedActiveAvatar
		} as Partial<EduRuangUser>);
		
		activeAvatar = updatedActiveAvatar;
	}

	function purchaseItem(item: AvatarItem) {
		if (!user || !item.price) return;
		
		// Check if user has enough coins
		if ((user.koinSekolah || 0) < item.price) {
			alert('Koin sekolah tidak mencukupi!');
			return;
		}
		
		selectedItem = item;
		showPurchaseModal = true;
	}

	function confirmPurchase() {
		if (!selectedItem || !user || !selectedItem.price) return;
		
		// Deduct coins
		const newKoin = (user.koinSekolah || 0) - selectedItem.price;
		
		// Add item to collection
		const updatedCollection = [...(user.avatarCollection || [])];
		const itemIndex = updatedCollection.findIndex(item => item.id === selectedItem!.id);
		
		if (itemIndex >= 0) {
			updatedCollection[itemIndex] = {
				...updatedCollection[itemIndex],
				isOwned: true
			};
		} else {
			updatedCollection.push({
				...selectedItem,
				isOwned: true,
				isEquipped: false
			});
		}
		
		// Update user
		authFunctions.updateUser({
			koinSekolah: newKoin,
			avatarCollection: updatedCollection
		} as Partial<EduRuangUser>);
		
		// Refresh data
		loadAvatarData();
		showPurchaseModal = false;
		selectedItem = null;
	}

	function getRarityColor(rarity: string): string {
		switch(rarity) {
			case 'common': return '#9CA3AF';
			case 'rare': return '#3B82F6';
			case 'epic': return '#8B5CF6';
			case 'legendary': return '#F59E0B';
			case 'exclusive': return '#EF4444';
			default: return '#6B7280';
		}
	}

	function getCategoryIcon(category: string): string {
		switch(category) {
			case 'hat': return '🧢';
			case 'clothing': return '👕';
			case 'glasses': return '🕶️';
			case 'accessory': return '💎';
			case 'shoes': return '👟';
			default: return '🎁';
		}
	}

	function getCategoryName(category: string): string {
		switch(category) {
			case 'hat': return 'Topi';
			case 'clothing': return 'Pakaian';
			case 'glasses': return 'Aksesori';
			case 'accessory': return 'Item Spesial';
			case 'shoes': return 'Sepatu';
			default: return 'Lainnya';
		}
	}
</script>

<div class="avatar-collection">
	<div class="container">
		<!-- Header -->
		<div class="collection-header">
			<div class="header-content">
				<h1 class="collection-title">🎒 Koleksi Avatar Sekolah</h1>
				<p class="collection-subtitle">Kelola item avatar dan tampilkan koleksimu</p>
			</div>
			<div class="coins-info">
				<div class="coins-badge">
					<Zap size={16} />
					{user?.koinSekolah || 0} Koin
				</div>
			</div>
		</div>

		<!-- Tabs -->
		<div class="tabs">
			<button 
				class="tab {activeTab === 'items' ? 'active' : ''}" 
				onclick={() => activeTab = 'items'}
			>
				<User size={20} />
				Item Saya
			</button>
			<button 
				class="tab {activeTab === 'showcase' ? 'active' : ''}" 
				onclick={() => activeTab = 'showcase'}
			>
				<Star size={20} />
				Etalase Sekolah
			</button>
			<button 
				class="tab {activeTab === 'shop' ? 'active' : ''}" 
				onclick={() => activeTab = 'shop'}
			>
				<ShoppingCart size={20} />
				Toko Sekolah
			</button>
			<button 
				class="tab {activeTab === 'exchange' ? 'active' : ''}" 
				onclick={() => activeTab = 'exchange'}
			>
				<Gift size={20} />
				Tukar/Toko
			</button>
		</div>

		<!-- Tab Content -->
		<div class="tab-content">
			<!-- Items Tab -->
			{#if activeTab === 'items'}
				<div class="tab-pane">
					{#if ownedItems.length > 0}
						<div class="categories-grid">
							{#each ['hat', 'clothing', 'glasses', 'accessory', 'shoes'] as category}
								{@const categoryItems = ownedItems.filter(item => item.category === category)}
								{#if categoryItems.length > 0}
									<div class="category-section">
										<div class="category-header">
											<h3>{getCategoryName(category)}</h3>
											<span>{categoryItems.length} item</span>
										</div>
										<div class="items-grid">
											{#each categoryItems as item}
												<div class="item-card card">
													<div class="item-icon" style="color: {getRarityColor(item.rarity)}">
														{getCategoryIcon(item.category)}
													</div>
													<div class="item-info">
														<h4>{item.name}</h4>
														<p>{item.description}</p>
														<span class="item-rarity" style="color: {getRarityColor(item.rarity)}">
															{item.rarity}
														</span>
													</div>
													<div class="item-actions">
														{#if activeAvatar[item.category] === item.id}
															<button class="btn-secondary btn-sm" onclick={() => unequipItem(item.category as keyof ActiveAvatar)}>
																Dilepas
															</button>
														{:else}
															<button class="btn-primary btn-sm" onclick={() => equipItem(item)}>
																Pakai
															</button>
														{/if}
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/if}
							{/each}
						</div>
					{:else}
						<div class="empty-state card">
							<User size={48} />
							<h3>Belum ada item</h3>
							<p>Dapatkan item avatar dengan menyelesaikan level atau membeli di toko</p>
							<button class="btn-primary" onclick={() => activeTab = 'shop'}>
								<ShoppingCart size={20} />
								Kunjungi Toko
							</button>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Showcase Tab -->
			{#if activeTab === 'showcase'}
				<div class="tab-pane">
					<div class="showcase-header">
						<h2>Avatar Aktif</h2>
						<p>Tampilan avatar saat ini</p>
					</div>
					
					<div class="avatar-showcase card">
						<div class="avatar-preview">
							<User size={120} />
						</div>
						<div class="avatar-details">
							<h3>{user?.name || 'Nama Pengguna'}</h3>
							<div class="equipped-items">
								{#each Object.entries(activeAvatar) as [category, itemId]}
									{#if itemId}
										{@const item = ownedItems.find(i => i.id === itemId)}
										{#if item}
											<div class="equipped-item">
												<span class="category">{getCategoryName(category)}:</span>
												<span class="item-name">{item.name}</span>
											</div>
										{/if}
									{/if}
								{/each}
							</div>
						</div>
					</div>
					
					<div class="leaderboard-preview card">
						<h3>Leaderboard Avatar Terbaik</h3>
						<p>Fitur ini akan segera hadir!</p>
					</div>
				</div>
			{/if}

			<!-- Shop Tab -->
			{#if activeTab === 'shop'}
				<div class="tab-pane">
					{#if shopItems.length > 0}
						<div class="shop-header">
							<h2>Toko Sekolah</h2>
							<p>Beli item avatar dengan koin sekolah</p>
						</div>
						
						<div class="items-grid">
							{#each shopItems as item}
								<div class="item-card card">
									<div class="item-icon" style="color: {getRarityColor(item.rarity)}">
										{getCategoryIcon(item.category)}
									</div>
									<div class="item-info">
										<h4>{item.name}</h4>
										<p>{item.description}</p>
										<span class="item-rarity" style="color: {getRarityColor(item.rarity)}">
											{item.rarity}
										</span>
									</div>
									<div class="item-actions">
										<div class="item-price">
											<Zap size={16} />
											{item.price}
										</div>
										<button 
											class="btn-primary btn-sm" 
											onclick={() => purchaseItem(item)}
											disabled={(user?.koinSekolah || 0) < (item.price || 0)}
										>
											Beli
										</button>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="empty-state card">
							<ShoppingCart size={48} />
							<h3>Toko sedang kosong</h3>
							<p>Belum ada item yang tersedia untuk dibeli</p>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Exchange Tab -->
			{#if activeTab === 'exchange'}
				<div class="tab-pane">
					<div class="exchange-header">
						<h2>Tukar Item</h2>
						<p>Fitur ini akan segera hadir!</p>
					</div>
					
					<div class="exchange-info card">
						<h3>Fitur yang akan datang:</h3>
						<ul>
							<li>Tukar item dengan murid lain</li>
							<li>Event toko spesial</li>
							<li>Item langka musiman</li>
							<li>Gift dari guru</li>
						</ul>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Equip Modal -->
{#if showEquipModal && selectedItem}
	<div class="modal-overlay" onclick={() => showEquipModal = false}>
		<div class="modal-content card" onclick={(event) => event.stopPropagation()}>
			<div class="modal-header">
				<h2>Pakai Item</h2>
				<button class="close-btn" onclick={() => showEquipModal = false}>
					×
				</button>
			</div>
			<div class="modal-body">
				<div class="item-preview">
					<div class="item-icon large" style="color: {getRarityColor(selectedItem.rarity)}">
						{getCategoryIcon(selectedItem.category)}
					</div>
					<h3>{selectedItem.name}</h3>
					<p>{selectedItem.description}</p>
				</div>
				<p>Apakah Anda yakin ingin memakai item ini?</p>
			</div>
			<div class="modal-actions">
				<button class="btn-secondary" onclick={() => showEquipModal = false}>
					Batal
				</button>
				<button class="btn-primary" onclick={confirmEquip}>
					Pakai
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Purchase Modal -->
{#if showPurchaseModal && selectedItem}
	<div class="modal-overlay" onclick={() => showPurchaseModal = false}>
		<div class="modal-content card" onclick={(event) => event.stopPropagation()}>
			<div class="modal-header">
				<h2>Beli Item</h2>
				<button class="close-btn" onclick={() => showPurchaseModal = false}>
					×
				</button>
			</div>
			<div class="modal-body">
				<div class="item-preview">
					<div class="item-icon large" style="color: {getRarityColor(selectedItem.rarity)}">
						{getCategoryIcon(selectedItem.category)}
					</div>
					<h3>{selectedItem.name}</h3>
					<p>{selectedItem.description}</p>
				</div>
				<div class="purchase-details">
					<div class="price-info">
						<span>Harga:</span>
						<span class="price">
							<Zap size={16} />
							{selectedItem.price}
						</span>
					</div>
					<div class="coins-info">
						<span>Koin Anda:</span>
						<span class="coins">
							<Zap size={16} />
							{user?.koinSekolah || 0}
						</span>
					</div>
					<div class="coins-after">
						<span>Sisa Koin:</span>
						<span class="coins">
							<Zap size={16} />
							{(user?.koinSekolah || 0) - (selectedItem.price || 0)}
						</span>
					</div>
				</div>
				<p>Apakah Anda yakin ingin membeli item ini?</p>
			</div>
			<div class="modal-actions">
				<button class="btn-secondary" onclick={() => showPurchaseModal = false}>
					Batal
				</button>
				<button class="btn-primary" onclick={confirmPurchase}>
					Beli
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.avatar-collection {
		padding: var(--space-6) 0;
		min-height: 100vh;
		background: var(--bg-secondary);
	}

	.collection-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-6);
		padding: var(--space-6);
		background: white;
		border-radius: var(--radius-2xl);
		box-shadow: var(--shadow-md);
	}

	.collection-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.collection-subtitle {
		font-size: var(--text-lg);
		color: var(--text-secondary);
		margin: 0;
	}

	.coins-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.coins-badge {
		background: var(--gradient-warning);
		color: white;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-full);
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	/* Tabs */
	.tabs {
		display: flex;
		gap: var(--space-1);
		margin-bottom: var(--space-6);
		background: white;
		border-radius: var(--radius-xl);
		padding: var(--space-2);
		box-shadow: var(--shadow-sm);
	}

	.tab {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		border: none;
		background: none;
		border-radius: var(--radius-lg);
		font-weight: var(--font-medium);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--text-secondary);
	}

	.tab:hover {
		background: var(--bg-secondary);
	}

	.tab.active {
		background: var(--primary-blue);
		color: white;
	}

	/* Tab Content */
	.tab-content {
		background: white;
		border-radius: var(--radius-2xl);
		padding: var(--space-6);
		box-shadow: var(--shadow-md);
	}

	.tab-pane {
		min-height: 400px;
	}

	/* Items Grid */
	.items-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
	}

	.item-card {
		display: flex;
		flex-direction: column;
		padding: var(--space-4);
	}

	.item-icon {
		font-size: var(--text-2xl);
		margin-bottom: var(--space-3);
		text-align: center;
	}

	.item-icon.large {
		font-size: var(--text-4xl);
		margin-bottom: var(--space-4);
	}

	.item-info {
		flex: 1;
		margin-bottom: var(--space-3);
	}

	.item-info h4 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-1) 0;
		color: var(--text-primary);
	}

	.item-info p {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0 0 var(--space-2) 0;
		line-height: 1.4;
	}

	.item-rarity {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		text-transform: capitalize;
	}

	.item-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
	}

	.item-price {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-weight: var(--font-semibold);
		color: var(--primary-orange);
	}

	/* Categories */
	.categories-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.category-section {
		margin-bottom: var(--space-4);
	}

	.category-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-2);
		border-bottom: 1px solid var(--border-light);
	}

	.category-header h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin: 0;
		color: var(--text-primary);
	}

	/* Showcase */
	.showcase-header {
		margin-bottom: var(--space-4);
	}

	.showcase-header h2 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.avatar-showcase {
		display: flex;
		gap: var(--space-6);
		margin-bottom: var(--space-6);
		padding: var(--space-6);
	}

	.avatar-preview {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-secondary);
		border-radius: var(--radius-xl);
		padding: var(--space-4);
	}

	.avatar-details {
		flex: 1;
	}

	.avatar-details h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-4) 0;
		color: var(--text-primary);
	}

	.equipped-items {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.equipped-item {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2);
		background: var(--bg-secondary);
		border-radius: var(--radius-md);
	}

	.category {
		font-weight: var(--font-medium);
		color: var(--text-primary);
	}

	.item-name {
		color: var(--text-secondary);
	}

	.leaderboard-preview {
		padding: var(--space-6);
		text-align: center;
	}

	/* Shop */
	.shop-header {
		margin-bottom: var(--space-4);
	}

	.shop-header h2 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	/* Exchange */
	.exchange-header {
		margin-bottom: var(--space-4);
	}

	.exchange-header h2 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.exchange-info {
		padding: var(--space-6);
	}

	.exchange-info h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-3) 0;
		color: var(--text-primary);
	}

	.exchange-info ul {
		padding-left: var(--space-6);
	}

	.exchange-info li {
		margin-bottom: var(--space-2);
		color: var(--text-secondary);
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-8);
		text-align: center;
		min-height: 300px;
	}

	.empty-state svg {
		margin-bottom: var(--space-4);
		color: var(--text-tertiary);
	}

	.empty-state h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.empty-state p {
		color: var(--text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	/* Modals */
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
	}

	.modal-content {
		width: 100%;
		max-width: 500px;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-4);
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
	}

	.modal-body {
		margin-bottom: var(--space-4);
	}

	.item-preview {
		text-align: center;
		margin-bottom: var(--space-4);
	}

	.item-preview h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-2) 0;
		color: var(--text-primary);
	}

	.item-preview p {
		color: var(--text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	.purchase-details {
		background: var(--bg-secondary);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.price-info,
	.coins-info,
	.coins-after {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.price-info:last-child,
	.coins-info:last-child,
	.coins-after:last-child {
		margin-bottom: 0;
	}

	.price,
	.coins {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-weight: var(--font-semibold);
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-2);
		padding-top: var(--space-4);
		border-top: 1px solid var(--border-light);
	}

	@media (max-width: 768px) {
		.collection-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-4);
		}

		.tabs {
			flex-direction: column;
		}

		.avatar-showcase {
			flex-direction: column;
		}

		.items-grid {
			grid-template-columns: 1fr;
		}
	}
</style>