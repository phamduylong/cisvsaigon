<script>
	import { onMount } from 'svelte';

	let randNr = Date.now().toString();
	randNr = randNr[randNr.length - 1];

	/**
	 * @typedef {{ image: string }} Slide
	 */

	/** @type {Slide[]} */
	const slides = $state([]);

	onMount(async () => {
		const res = await fetch(`https://picsum.photos/v2/list?page=${randNr}`);

		/** @type {{ download_url: string }[]} */
		const json = await res.json();

		for (let i = 0; i < 30 && i < json.length; i++) {
			slides.push({ image: json[i].download_url });
		}
	});
</script>

<div class="container mx-auto flex flex-col space-y-16 lg:space-y-20 p-10">
	<h1 class="text-center h1">Gallery</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-4">
		<!-- Column 1 -->
		<div class="grid gap-4">
			<img class="h-auto max-w-full rounded-base" src={slides[0]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[1]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[2]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[3]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[4]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[5]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[6]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[7]?.image} alt="" />
		</div>

		<!-- Column 2 -->
		<div class="grid gap-4">
			<img class="h-auto max-w-full rounded-base" src={slides[8]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[9]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[10]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[11]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[12]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[13]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[14]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[15]?.image} alt="" />
		</div>

		<!-- Column 3 -->
		<div class="grid gap-4">
			<img class="h-auto max-w-full rounded-base" src={slides[16]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[17]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[18]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[19]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[20]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[21]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[22]?.image} alt="" />
		</div>

		<!-- Column 4 -->
		<div class="grid gap-4">
			<img class="h-auto max-w-full rounded-base" src={slides[23]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[24]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[25]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[26]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[27]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[28]?.image} alt="" />
			<img class="h-auto max-w-full rounded-base" src={slides[29]?.image} alt="" />
		</div>
	</div>
</div>
