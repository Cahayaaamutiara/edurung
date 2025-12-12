<script lang="ts">
	let showJoinClassModal = $state(false);
	let classCode = $state('');
	
	function joinClass() {
		// Implementation would go here
		console.log('Joining class with code:', classCode);
		showJoinClassModal = false;
		classCode = '';
	}
</script>

<!-- Join Class Modal -->
{#if showJoinClassModal}
	<div class="modal-overlay" onclick={() => showJoinClassModal = false} onkeydown={(e) => { if (e.key === 'Escape') showJoinClassModal = false; }} role="presentation" tabindex="-1">
		<div class="modal-content card" onclick={(event) => event.stopPropagation()} onkeydown={(e) => { if (e.key === 'Escape') showJoinClassModal = false; }} role="dialog" aria-modal="true" aria-labelledby="join-class-title" tabindex="0">
			<div class="modal-header">
				<h2 id="join-class-title">Gabung ke Kelas</h2>
				<button class="close-btn" onclick={() => showJoinClassModal = false} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { showJoinClassModal = false; e.preventDefault(); }}}>
					×
				</button>
			</div>
			<form class="modal-form" onsubmit={(event) => {
				event.preventDefault();
				joinClass();
			}}>
				<div class="form-group">
					<label for="classCode">Masukkan Kode Kelas</label>
					<input 
						id="classCode"
						type="text" 
						value={classCode}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							if (target) {
								classCode = target.value;
							}
						}}
						onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); joinClass(); }}}
						placeholder="Contoh: ABC123"
						required
						maxlength="6"
						style="text-transform: uppercase;"
					/>
				</div>
				
				<div class="modal-actions">
					<button type="button" class="btn-secondary" onclick={() => showJoinClassModal = false} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showJoinClassModal = false; }}}>
						Batal
					</button>
					<button type="submit" class="btn-primary" onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); joinClass(); }}}>
						Gabung
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}