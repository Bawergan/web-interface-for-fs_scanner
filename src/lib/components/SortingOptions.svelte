<script lang="ts">
	import { dbSettings } from '$lib/fileStore';
	const starterSettings = {batchSize: 10};
	dbSettings.set(starterSettings);
</script>

<label>
	Batch size
	<input
		type="number"
		name="batch_size"
		min="1"
		max="50"
		value={starterSettings.batchSize}
		oninput={(event: Event) => {
			const target = event.target as HTMLInputElement;
			dbSettings.set({ batchSize: target.value as unknown as number });
		}}
	/>
</label>
<br />
<input type="datetime-local" name="date" />
-----
<input type="datetime-local" name="date" />
<br />
