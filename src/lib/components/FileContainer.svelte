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
	<div class="image-placeholder">
	</div>
{/if}

<style>
	.image-container {
		max-width: 200px; /* Adjust as needed */
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

	.image-placeholder {
		max-width: 200px; /* Match the size of the image */
		height: 150px; /* Set a fixed height for the placeholder */
		background-color: #7e7e7e; /* Light gray background */
		border-radius: 20px; /* Rounded corners */
		border: none;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
