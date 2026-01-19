<script>
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import vi from '$lib/assets/vi.svg';
    import en from '$lib/assets/en.svg';
	let checked = $state(false);
	let { classes = '' } = $props();
	import { locale } from "$lib/stores/i18n";

	$effect(() => {
		const lang = localStorage.getItem('lang') || 'vi';
		checked = lang === 'en';
		$locale = lang;
	});

	/**
	 *
	 * @param {{ checked: boolean }} event
	 */
	const onCheckedChange = (event) => {
		const lang = event.checked ? 'en' : 'vi';
		document.documentElement.setAttribute('lang', lang);
		localStorage.setItem('lang', lang);
		checked = event.checked;
		$locale = lang;
	};
</script>

<svelte:head>
	<script>
		document.documentElement.setAttribute('lang', localStorage.getItem('lang') || 'vi');
	</script>
</svelte:head>

<Switch {checked} {onCheckedChange} class={classes}>
	<Switch.Control>
		<Switch.Thumb>
			<Switch.Context>
				{#snippet children(switch_)}
					{#if switch_().checked}<enhanced:img src={en} class="size-4" />
					{:else}
					<enhanced:img src={vi} class="size-4" />
					{/if}
				{/snippet}
			</Switch.Context>
		</Switch.Thumb>
	</Switch.Control>
	<Switch.HiddenInput />
</Switch>
