<script>
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	let checked = $state(false);
	let { classes = '' } = $props();

	$effect(() => {
		const mode = localStorage.getItem('mode') || 'dark';
		checked = mode === 'light';
	});

	/**
	 *
	 * @param {{ checked: boolean }} event
	 */
	const onCheckedChange = (event) => {
		const mode = event.checked ? 'light' : 'dark';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
		checked = event.checked;
	};
</script>

<svelte:head>
	<script>
		document.documentElement.setAttribute('data-mode', localStorage.getItem('mode') || 'dark');
	</script>
</svelte:head>

<Switch {checked} {onCheckedChange} class={classes}>
	<Switch.Control>
		<Switch.Thumb>
			<Switch.Context>
				{#snippet children(switch_)}
					{#if switch_().checked}<Sun class="size-4" />
					{:else}
						<Moon class="size-4" />
					{/if}
				{/snippet}
			</Switch.Context>
		</Switch.Thumb>
	</Switch.Control>
	<Switch.HiddenInput />
</Switch>
