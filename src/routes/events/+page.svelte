<script>
	import EventCard from '$lib/components/EventCard.svelte';
	let { data } = $props();
	let isLoggedIn = $derived(data.user !== null && data.user !== undefined);
	import { t, locale } from '$lib/stores/i18n';
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon' events" />
	<title>CISV Saigon - {$t('events_page.title')}</title>
</svelte:head>

<div class="container mx-auto flex h-full flex-col items-center justify-center p-4 md:p-10">
	<div class="container grid h-full grid-cols-1 items-start gap-y-5 md:w-5/6 xl:w-3/5">
		<h1 class="my-8 text-center h1 font-serif text-5xl">{$t('events_page.title')}</h1>
		{#each data.events as event (event.id)}
			<EventCard {event} isPlaceHolder={false} {isLoggedIn} />
		{/each}

		{#if data.user}
			<EventCard isPlaceHolder={true} />
		{/if}
	</div>
</div>
