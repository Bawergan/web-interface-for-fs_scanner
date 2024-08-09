<script lang="ts">
	type File = {
		name: string; // The name of the image
		blob: Blob; // The Blob representation of the image
	};
	import { onMount } from 'svelte';

	let imageUrl = '';
	let name = '';

	async function fetchMessage() {
		const response = await fetch('/api/get_file');
		const data = await response.formData();

		var fileName = data.get('file_name') as string;
		var fileBlob = data.get('file_blob') as Blob;
		const file: File = { name: fileName, blob: fileBlob };
		return file;
	}

	onMount(async () => {
		const file = (await fetchMessage()) as File;
		if (file.blob) {
			imageUrl = URL.createObjectURL(file.blob);
		}
		if (file.name) {
			name = file.name;
		}
	});
</script>

<h1>Welcome</h1>

{#if imageUrl}
	<div class="image-container">
		<!-- svelte-ignore a11y_missing_attribute -->
		<img src={imageUrl} class="responsive-image" />
		<p class="image-caption">{name}</p>
	</div>
{:else}
	<p>Loading image...</p>
{/if}

<style>
	.image-container {
		max-width: 200px;
		border: 1px solid #ccc;
		overflow: hidden;
	}

	.responsive-image {
		width: 100%;
		height: auto;
		display: block;
	}

	.image-caption {
		font-size: 14px;
		color: #555;
		margin-top: 8px;
	}
</style>
