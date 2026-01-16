<script>
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	let imgLinkPrefix = $state('');

	let nrOfCols = $state(1);

	/** @type Number[][]>*/
	let indicesByColumn = $state([]);
	$effect(() => {
		if (data.images.length) {
			indicesByColumn = splitIndices(nrOfCols, data.images.length);
			imgLinkPrefix = `${env.PUBLIC_POCKETBASE_FILE_URL}/${data.images[0].collectionId}`;
		}
	});

	/**
	 * Get number of images to be displayed each column. For example if we have 10 images and 3 columns, it would be [[0,1,2,3],[4,5,6],[7,8,9]]
	 * @param cols {Number}
	 * @param total {Number}
	 * @returns {Number[][]}
	 */
	function splitIndices(cols, total) {
		// Guard clause: nothing to split
		if (cols === 0 || total === 0) {
			return [];
		}

		// This will hold the final result:
		// an array of arrays of indices
		const result = [];

		// Minimum number of items per column
		const baseSizePerColumn = Math.floor(total / cols);

		// Extra items that need to be distributed (one per column, from the start)
		let remainingItems = total % cols;

		// This tracks the current global index
		let currentIndex = 0;

		// Loop over each column
		for (let column = 0; column < cols; column++) {
			// Start with the base size
			let columnSize = baseSizePerColumn;

			// If we still have extra items, add one to this column
			if (remainingItems > 0) {
				columnSize += 1;
				remainingItems -= 1;
			}

			// Create the array for this column
			const columnIndices = [];

			// Fill the column with consecutive indices
			for (let i = 0; i < columnSize; i++) {
				columnIndices.push(currentIndex);
				currentIndex += 1;
			}

			// Add this column to the result
			result.push(columnIndices);
		}

		return result;
	}

	/**
	 * Get number of columns based on Tailwind breakpoints
	 */
	function getNrOfCols() {
		if (!window) return 1;
		if (window.matchMedia('(min-width: 1024px)').matches) {
			// lg breakpoint
			return 3;
		} else if (window.matchMedia('(min-width: 768px)').matches) {
			// md breakpoint
			return 2;
		} else if (window.matchMedia('(min-width: 640px)').matches) {
			// sm breakpoint
			return 1;
		}

		return 1;
	}

	onMount(() => {
		nrOfCols = getNrOfCols();
		window.addEventListener('resize', () => (nrOfCols = getNrOfCols()));

		return () => {
			window.removeEventListener('resize', () => (nrOfCols = getNrOfCols()));
		};
	});
</script>

<div class="container mx-auto flex flex-col space-y-16 p-10 lg:space-y-20">
	<h1 class="text-center h1">Gallery</h1>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each indicesByColumn as arr (arr)}
			<div class="grid gap-4">
				{#each arr as idx (idx)}
					<enhanced:img
						class="h-full border-4 border-primary-950-50 object-cover"
						src={`${imgLinkPrefix}/${data.images[idx].id}/${data.images[idx].content}`}
						alt={data.images[idx].caption}
						title={data.images[idx].caption}
						loading="lazy"
					/>
				{/each}
			</div>
		{/each}
	</div>
</div>
