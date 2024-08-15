<script lang="ts">
	import FileContainer from '$lib/components/FileContainer.svelte';
	import type { FileCustom } from '$lib/fileStore';
	import { files, getDbStat, dbSettings, currentMinId } from '$lib/fileStore';
	import { onMount } from 'svelte';

	let filesVal: Promise<FileCustom[]> = Promise.resolve([]);
	let batchSize = 0;
	onMount(async () => {
		await getDbStat();
		files.init();
		files.subscribe((v) => {
			filesVal = v as Promise<FileCustom[]>;
		});
		dbSettings.subscribe((v) => {
			batchSize = v.batchSize;
		});
	});
</script>

{#await filesVal}
	{@const empties = Array(batchSize)}
	{#each empties as e}
		<FileContainer name={null} imageUrl={null} />
	{/each}
{:then f}
	{currentMinId.set(f.length > 0 ? Math.min(...f.map((file) => file.id)) : 0)}
	{@const empties = () => {
		if (batchSize >= f.length) {
			return Array(batchSize - f.length);
		} else {
			return Array(0);
		}
	}}
	{#each f as file}
		<FileContainer {...file} />
	{/each}
	{#each empties() as _}
		<FileContainer name={null} imageUrl={null} />
	{/each}
{/await}

<button on:click={files.prev}>Prev</button>
<button on:click={files.next}>Next</button>

<style>
	button {
		background-color: #6c757d; /* Neutral gray background */
		color: white; /* Text color */
		border: none; /* No border */
		border-radius: 5px; /* Rounded corners */
		padding: 10px 20px; /* Padding for the button */
		font-size: 16px; /* Font size */
		cursor: pointer; /* Pointer cursor on hover */
		transition:
			background-color 0.3s,
			transform 0.2s; /* Smooth transition for hover effects */
	}

	button:hover {
		background-color: #5a6268; /* Darker gray on hover */
	}

	button:focus {
		outline: none; /* Remove default focus outline */
	}

	button:active {
		transform: scale(0.95); /* Slightly shrink the button when clicked */
	}
</style>
