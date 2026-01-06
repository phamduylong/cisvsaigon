<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { CircleUserRound, Mail, Instagram, Facebook } from '@lucide/svelte';
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div>
	<AppBar>
		<AppBar.Toolbar class="flex justify-between">
			<AppBar.Headline>
				<p class="text-2xl">CISV Saigon</p>
			</AppBar.Headline>
			<AppBar.Trail>
				<span class="">
					<button type="button" class="btn bg-primary-700 hover:preset-tonal"
						><p class="hidden md:block">Login</p>
						<CircleUserRound /></button
					>
				</span>
			</AppBar.Trail>
		</AppBar.Toolbar>
	</AppBar>
	{@render children()}
	<div
		class="absolute bottom-0 left-1/2 my-5 flex -translate-x-1/2 flex-wrap justify-center space-y-1 text-center"
	>
		<div class="select-none" id="contact">
			<a
				class="anchor"
				href="https://www.facebook.com/groups/1761170264115434"
				target="_blank"
				rel="external"
				aria-label="Join our Facebook group"><Facebook class="inline-block h-5 w-5 md:h-6" /></a
			>

			<a
				class="anchor"
				href="https://www.instagram.com/cisv.saigon/"
				target="_blank"
				rel="external"
				aria-label="Go to our Instagram page"
				><Instagram class="inline-block h-5 w-5 md:h-6 md:w-6" /></a
			>

			<a
				class="anchor"
				href="mailto:cisvhcm@gmail.com"
				target="_blank"
				rel="external"
				aria-label="Send us an email"><Mail class="inline-block h-5 w-5 md:h-6 md:w-6" /></a
			>
		</div>
		<!-- Flex line break -->
		<div class="h-0 basis-full"></div>
		<p class="text-sm">
			&copy; {new Date().getFullYear()}
			CISV Saigon
		</p>
	</div>
</div>
