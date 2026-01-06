<script lang="ts">
	import { Carousel } from '@skeletonlabs/skeleton-svelte';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	const slides = [
		{ image: 'https://picsum.photos/960/1800' }, // portrait
		{ image: 'https://picsum.photos/1800/960' }, // landscape
		{ image: 'https://picsum.photos/800/1400' }, // portrait
		{ image: 'https://picsum.photos/1600/900' }, // landscape
		{ image: 'https://picsum.photos/1024/768' }, // landscape
		{ image: 'https://picsum.photos/768/1024' }, // portrait
		{ image: 'https://picsum.photos/1200/800' }, // landscape
		{ image: 'https://picsum.photos/900/1600' } // portrait
	];
</script>

<!-- Mobile carousel -->
<div class="container mx-auto flex flex-col space-y-10 p-5 lg:hidden">
	<h1 class="text-center h1">Gallery</h1>
	<Carousel slideCount={slides.length} slidesPerPage={1} spacing="16px" loop>
		<Carousel.Control class="my-5 flex justify-between">
			<Carousel.PrevTrigger class="btn preset-filled">
				<span><ArrowLeft size={16} /></span>
				<span class="hidden md:block">Back</span>
			</Carousel.PrevTrigger>
			<Carousel.NextTrigger class="btn preset-filled">
				<span class="hidden md:block">Next</span>
				<span><ArrowRight size={16} /></span>
			</Carousel.NextTrigger>
		</Carousel.Control>
		<div class="flex flex-col space-y-5">
			<Carousel.ItemGroup>
				{#each slides as slide, i}
					<Carousel.Item index={i} class="flex items-center justify-center card bg-transparent">
						<img src={slide.image} class="h-full! w-full! object-cover" alt="Nothing" />
					</Carousel.Item>
				{/each}
			</Carousel.ItemGroup>
		</div>

		<Carousel.IndicatorGroup>
			<Carousel.Context>
				{#snippet children(carousel)}
					{#each carousel().pageSnapPoints as _, index}
						<Carousel.Indicator {index} />
					{/each}
				{/snippet}
			</Carousel.Context>
		</Carousel.IndicatorGroup>
	</Carousel>
</div>

<!-- Desktop carousel -->
<div class="container mx-auto hidden flex-col space-y-10 p-5 lg:flex">
	<h1 class="text-center h1">Gallery</h1>
	<Carousel slideCount={slides.length} slidesPerPage={3} spacing="16px" loop>
		<Carousel.Control class="my-5 flex justify-between">
			<Carousel.PrevTrigger class="btn preset-filled">
				<span><ArrowLeft size={16} /></span>
				<span class="hidden md:block">Back</span>
			</Carousel.PrevTrigger>
			<Carousel.NextTrigger class="btn preset-filled">
				<span class="hidden md:block">Next</span>
				<span><ArrowRight size={16} /></span>
			</Carousel.NextTrigger>
		</Carousel.Control>
		<div class="flex flex-col space-y-5">
			<Carousel.ItemGroup>
				{#each slides as slide, i}
					<Carousel.Item index={i} class="flex items-center justify-center card bg-transparent">
						<img src={slide.image} class="h-full! w-full! object-cover" alt="Nothing" />
					</Carousel.Item>
				{/each}
			</Carousel.ItemGroup>
		</div>

		<Carousel.IndicatorGroup>
			<Carousel.Context>
				{#snippet children(carousel)}
					{#each carousel().pageSnapPoints as _, index}
						<Carousel.Indicator {index} />
					{/each}
				{/snippet}
			</Carousel.Context>
		</Carousel.IndicatorGroup>
	</Carousel>
</div>
