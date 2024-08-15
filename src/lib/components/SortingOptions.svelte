<script lang="ts">
	import { dbSettings } from '$lib/fileStore';
	const starterSettings = { batchSize: 10, format: '' };
	dbSettings.set(starterSettings);
</script>

<br />
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
			dbSettings.update(
				(v) => (v = { batchSize: target.value as unknown as number, format: v.format })
			);
		}}
	/>
</label>
<br />
<label>
	Format
	<input
		type="text"
		name="format"
		oninput={(event: Event) => {
			const target = event.target as HTMLInputElement;
			dbSettings.update((v) => (v = { batchSize: v.batchSize, format: target.value }));
		}}
	/>
</label>
<br />
<input type="datetime-local" name="date" />
-----
<input type="datetime-local" name="date" />
<br />
