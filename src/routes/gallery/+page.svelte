<script>
	import { env } from '$env/dynamic/public';
	import { innerWidth } from 'svelte/reactivity/window';
	import { t } from '$lib/stores/i18n.svelte';
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

		// set nrOfCols based on screen width
		if (innerWidth.current) {
			if (innerWidth.current >= 1024) {
				nrOfCols = 3;
			} else if (innerWidth.current >= 768) {
				nrOfCols = 2;
			} else {
				nrOfCols = 1;
			}
		}
	});

	/**
	 * Get number of images to be displayed each column. For example if we have 10 images and 3 columns, it would be [[0,1,2,3],[4,5,6],[7,8,9]]
	 * @param cols {Number}
	 * @param total {Number}
	 * @returns {Number[][]}
	 */
	function splitIndices(cols, total) {
		if (!cols || !total) return [];

		const result = [];

		let index = 0;

		for (let col = 0; col < cols; col++) {
			const column = [];

			// how many items should this column get?
			const remainingColumns = cols - col;
			const remainingItems = total - index;

			const size = Math.ceil(remainingItems / remainingColumns);

			for (let i = 0; i < size; i++) {
				column.push(index++);
			}

			result.push(column);
		}

		return result;
	}
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon's Gallery" />
	<title>CISV Saigon - {t('gallery_page.title')}</title>
</svelte:head>

<div class="container mx-auto flex flex-col space-y-16 p-10 lg:space-y-20">
	<h1 class="text-center h1">{t('gallery_page.title')}</h1>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each indicesByColumn as arr (arr)}
			<div class="grid gap-4">
				{#each arr as idx (idx)}
					{#if arr.indexOf(idx) <= 1}
						<enhanced:img
							class="h-full border-4 border-primary-950-50 object-cover"
							src={`${imgLinkPrefix}/${data.images[idx].id}/${data.images[idx].content}`}
							alt={data.images[idx].caption + idx.toString()}
							title={data.images[idx].caption}
							loading="eager"
							fetchpriority="high"
						/>
					{:else}
						<enhanced:img
							class="h-full border-4 border-primary-950-50 object-cover"
							src={`${imgLinkPrefix}/${data.images[idx].id}/${data.images[idx].content}`}
							alt={data.images[idx].caption + idx.toString()}
							title={data.images[idx].caption}
							loading="lazy"
							fetchpriority="auto"
						/>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>
