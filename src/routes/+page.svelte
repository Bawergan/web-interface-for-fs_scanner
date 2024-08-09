<script lang="ts">
	import FileContainer from '$lib/components/FileContainer.svelte';
	type File = {
		name: string;
		blob: Blob;
		imageUrl: string;
	};

	async function fetchMessage(id: number) {
		const response = await fetch('/api/get_file', {
			method: 'POST',
			body: JSON.stringify({ id })
		});
		const data = await response.formData();

		var files: File[] = [];

		const fileIds = data.getAll('file_id');
		if (fileIds == null) {
			return files;
		}
		fileIds.map((id) => {
			const fileNames = data.get(id + 'file_name') as string;
			const fileBlobs = data.get(id + 'file_blob') as Blob;
			const file: File = { name: fileNames, blob: fileBlobs, imageUrl: '' };
			files.push(file);

			if ((id as unknown as number) > maxId) {
				maxId = id as unknown as number;
			}
		});

		return files;
	}

	async function getFiles(id: number) {
		const files = (await fetchMessage(id)) as File[];
		files.forEach((file) => {
			if (file.blob) {
				file.imageUrl = URL.createObjectURL(file.blob);
			}
		});
		return files;
	}
	function updateId(n: number) {
		id = +maxId + +n;
	}

	var maxId = 0;
	var id = -1;
</script>

<h1>Welcome</h1>
{#await getFiles(id)}
	<h1>loading file</h1>
{:then files}
	{#each files as file}
		<FileContainer {...file} />
	{/each}
{/await}

<button on:click={() => updateId(-1)}>Prev</button>
<button on:click={() => updateId(1)}>Next</button>

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
