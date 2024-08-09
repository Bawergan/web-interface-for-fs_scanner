<script>
    export let name;
    export let imageUrl;
</script>


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