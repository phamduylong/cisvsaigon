<script>
	import PocketBase from 'pocketbase';

	const pb = new PocketBase('https://longph.pockethost.io/');
	import { onMount } from 'svelte';



	/**
	 * @typedef {{ image: string, alt: string }} Slide
	 */

	/** @type {Slide[]} */
	const slides = $state([]);

	onMount(async () => {
				/**
		 * @typedef {{ content: string, caption: string, collectionId: string, id: string }} ImageRecord
		 */

		/** @type {ImageRecord[]} */
		const records = await pb.collection('images').getFullList();
		for(let i = 0; i < records.length; ++i) {
			slides.push({
				image: `https://longph.pockethost.io/api/files/${records[i].collectionId}/${records[i].id}/${records[i].content}`,
				alt: records[i].caption
			})
		}
	});
</script>

<div class="container mx-auto flex flex-col space-y-16 lg:space-y-20 p-10">
	<h1 class="text-center h1">Gallery</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-4">
		<!-- Column 1 -->
		<div class="grid gap-4">
			<img class="h-auto max-w-full rounded-base" src={slides[0]?.image} alt={slides[0]?.alt} />
			<img class="h-auto max-w-full rounded-base" src={slides[1]?.image} alt={slides[1]?.alt} />
			<img class="h-auto max-w-full rounded-base" src={slides[2]?.image} alt={slides[2]?.alt} />
		</div>

		<!-- Column 2 -->
		<div class="grid gap-4">
			<img class="h-auto max-w-full rounded-base" src={slides[3]?.image} alt={slides[3]?.alt} />
			<img class="h-auto max-w-full rounded-base" src={slides[4]?.image} alt={slides[4]?.alt} />
			<img class="h-auto max-w-full rounded-base" src={slides[5]?.image} alt={slides[5]?.alt} />
		</div>

		<!-- Column 3 -->
		<div class="grid gap-4">
			<img class="h-auto max-w-full rounded-base" src={slides[6]?.image} alt={slides[6]?.alt} />
			<img class="h-auto max-w-full rounded-base" src={slides[7]?.image} alt={slides[7]?.alt} />
			<img class="h-auto max-w-full rounded-base" src={slides[8]?.image} alt={slides[8]?.alt} />
		</div>

		<!-- Column 4 -->
		<div class="grid gap-4">
			<img class="h-auto max-w-full rounded-base" src={slides[9]?.image} alt={slides[9]?.alt} />
			<img class="h-auto max-w-full rounded-base" src={slides[10]?.image} alt={slides[10]?.alt} />
			<img class="h-auto max-w-full rounded-base" src={slides[11]?.image} alt={slides[11]?.alt} />
		</div>
	</div>
</div>
