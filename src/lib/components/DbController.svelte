<script>
	import { RefreshCcw } from 'lucide-svelte';
	
	async function callDbForUpdate() {
		fetch('http://localhost:5000/api/reload');
	}

</script>

<button onclick={callDbForUpdate}><RefreshCcw /></button>

<style>
	button {
		background-color: white; /* Background color*/
		color: #6c757d; /* Text color */
		border: none; /* No border */
		border-radius: 5px; /* Rounded corners */
		margin: 10px;
		padding: 10px; /* Padding for the button */
		cursor: pointer; /* Pointer cursor on hover */
		transition:
			background-color 0.3s,
			transform 0.2s; /* Smooth transition for hover effects */
	}

	button:hover {
		transform: scale(1.05);
	}

	button:focus {
		outline: none; /* Remove default focus outline */
	}

	button:active {
		transform: scale(0.95); /* Slightly shrink the button when clicked */
	}
</style>
