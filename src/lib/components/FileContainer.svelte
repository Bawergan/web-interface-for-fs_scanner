<script>
	export let name;
	export let imageUrl;
</script>

{#if imageUrl}
	<div class="image-container">
		<img src={imageUrl} class="responsive-image" alt="Image content: {name}" />
		<p class="image-caption">{name}</p>
	</div>
{:else}
	<div class="image-placeholder">
	</div>
{/if}

<style>
	.image-container {
		display: flex; /* Use flexbox to align items side by side */
		align-items: center; /* Center items vertically */
		border: 1px solid #ccc;
	}

	.responsive-image {
		width: 40px; /* Fixed width */
		height: 40px; /* Fixed height */
		object-fit: contain; /* Ensures the image covers the area without distortion */
		margin-right: 8px; /* Space between image and caption */
	}

	.image-caption {
		font-size: 14px;
		color: #555;
		margin: 0; /* Remove default margin */
	}

	.image-placeholder {
		width: 40px; /* Match the size of the image */
		height: 40px; /* Set a fixed height for the placeholder */
		background-color: #7e7e7e; /* Light gray background */
		border-radius: 20px; /* Rounded corners */
		border: 1px solid #ccc;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
