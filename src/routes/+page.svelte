<script>
	export let data;
    const image = Image
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelt.dev</a> to read the documentation</p>

<img src="/mnt/c/Users/sergey/Pictures/temp/08.png" alt="as" />

<ul>
	{#each data.summaries as { path, imageData }}
		<li>{path}</li>
		<img src={imageData} alt="as" />
	{/each}
</ul>
