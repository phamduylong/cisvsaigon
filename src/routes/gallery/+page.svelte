<script>
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	let imgLinkPrefix = $state('');

	let nrOfCols = $state(2);

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
		if (cols === 0 || total === 0) return [];

		const base = Math.floor(total / cols);
		let remainder = total % cols;
		let idx = 0;

		return Array.from({ length: cols }, () => {
			const size = base + (remainder-- > 0 ? 1 : 0);
			return Array.from({ length: size }, () => idx++);
		});
	}

	/**
	 * Set number of columns based on Tailwind breakpoints
	 */
	function setNrOfCols() {
		if (!window) return;
		if (window.matchMedia('(min-width: 1024px)').matches) {
			// lg breakpoint
			nrOfCols = 3;
		} else if (window.matchMedia('(min-width: 768px)').matches) {
			// md breakpoint
			nrOfCols = 2;
		} else if (window.matchMedia('(min-width: 640px)').matches) {
			// sm breakpoint
			nrOfCols = 1;
		}
	}

	onMount(() => {
		setNrOfCols();
		window.addEventListener('resize', setNrOfCols);
		if (data.images.length) {
			imgLinkPrefix = `${env.PUBLIC_POCKETBASE_FILE_URL}/${data.images[0].collectionId}`;
		}

		return () => {
			window.removeEventListener('resize', setNrOfCols);
		};
	});
</script>

<div class="container mx-auto flex flex-col space-y-16 p-10 lg:space-y-20">
	<h1 class="text-center h1">Gallery</h1>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each indicesByColumn as arr (arr)}
			<div class="grid gap-4">
				{#each arr as idx (idx)}
					<img
						class="h-full border-4 border-primary-950-50"
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
