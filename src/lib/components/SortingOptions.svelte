<script lang="ts">
	import { dbSettings } from '$lib/fileStore';
</script>

<label>
	Batch size
	<input
		type="number"
		name="batch_size"
		min="1"
		max="50"
		oninput={(event: Event) => {
			const target = event.target as HTMLInputElement;
			dbSettings.set({ batchSize: target.value as number });
		}}
	/>
</label>
<br />
<input type="datetime-local" name="date" />
-----
<input type="datetime-local" name="date" />
<br />
