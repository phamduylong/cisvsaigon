<script lang="ts">
	import { Collapsible, Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import UnfoldVertical from '@lucide/svelte/icons/unfold-vertical';
	import Link from '@lucide/svelte/icons/link';
	import Calendar from '@lucide/svelte/icons/calendar';
	import SquarePlus from '@lucide/svelte/icons/square-plus';
	import UserSearch from '@lucide/svelte/icons/user-search';
	import Trash from '@lucide/svelte/icons/trash';
	import XIcon from '@lucide/svelte/icons/x';
	import { datesAreOnTheSameDay } from '$lib/helper/dateFunctions';
	import { processDateString } from '$lib/helper/stringFunctions';
	let descriptionOpen = $state(false);
	let { isPlaceHolder = false, event = null, isLoggedIn = false } = $props();
	import { t, getLocale } from '$lib/stores/i18n.svelte';
	const locale = $derived(getLocale());
	const animation =
		'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0';

	let deleteFormId = $derived(`deleteForm-${event?.id}`);

	function deleteEvent() {
		const form = /**@type {HTMLFormElement}*/ (document.getElementById(deleteFormId));

		if (form) {
			form.submit();
		}
	}
</script>

<form id={deleteFormId} class="hidden" method="POST" action="/events/?/delete">
	<input name="id" type="hidden" value={event?.id} />
</form>

<div class="max-h-fit grid-cols-1 space-y-2 card preset-filled-surface-100-900 p-4">
	{#if isPlaceHolder}
		<div class="flex flex-col items-center justify-center card p-4">
			<a
				class="btn flex flex-col preset-filled-surface-200-800 p-4 hover:preset-tonal"
				href="/events/new/"
				rel=""
			>
				<SquarePlus />
				<span>{t('events_page.add_new_event')}</span>
			</a>
		</div>
	{:else}
		<!-- Title and past event badge -->
		<span class="flex items-center justify-between"
			><div class="flex items-center justify-between space-x-2">
				<h3 class="h3 font-bold">{event?.title}</h3>
				{#if event?.finished}
					<button type="button" class="chip hidden preset-filled-primary-500 md:block"
						>{t('events_page.past_event')}</button
					>
				{/if}
			</div>
			{#if isLoggedIn}
				<!-- Confirm delete dialog -->
				<Dialog>
					<Dialog.Trigger
						><button
							><Trash
								class="btn h-6 w-6 rounded-sm p-1 card-hover hover:preset-tonal"
								size={16}
							/></button
						></Dialog.Trigger
					>
					<Portal>
						<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
						<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
							<Dialog.Content
								class="w-full max-w-xl space-y-4 card bg-surface-100-900 p-4 shadow-xl {animation}"
							>
								<header class="flex items-center justify-between">
									<Dialog.Title class="text-lg font-bold"
										>{t('events_page.confirm_delete_event_title')}</Dialog.Title
									>
									<Dialog.CloseTrigger class="btn-icon hover:preset-tonal">
										<XIcon class="size-4" />
									</Dialog.CloseTrigger>
								</header>
								<Dialog.Description>
									{t('events_page.confirm_delete_event')}
								</Dialog.Description>
								<footer class="flex justify-end gap-2">
									<Dialog.CloseTrigger class="btn preset-tonal"
										>{t('common.cancel')}</Dialog.CloseTrigger
									>
									<Dialog.CloseTrigger
										><button
											type="button"
											class="btn preset-filled"
											onclick={() => {
												deleteEvent();
											}}>{t('common.ok')}</button
										></Dialog.CloseTrigger
									>
								</footer>
							</Dialog.Content>
						</Dialog.Positioner>
					</Portal>
				</Dialog>
			{/if}</span
		>
		{#if event?.finished}
			<button type="button" class="chip preset-filled-primary-500 md:hidden"
				>{t('events_page.past_event')}</button
			>
		{/if}
		<a
			href={event?.registrationLink}
			rel="external"
			class="flex items-center space-x-2 anchor text-lg font-semibold {event?.finished
				? 'hidden'
				: ''}"
			><Link size={16} />
			<p>{t('events_page.registration_link')}</p></a
		>
		{#if event?.minAge}
			{#if event?.maxAge}
				<span class="flex items-center space-x-2 text-lg"
					><UserSearch size={16} />
					<p>
						{t('events_page.from_age_to_age', { minAge: event?.minAge, maxAge: event?.maxAge })}
					</p></span
				>
			{:else}
				<!-- Event has no age cap, only minimum. -->
				<span class="flex items-center space-x-2 text-lg"
					><UserSearch size={16} />
					<p>{t('events_page.min_age', { minAge: event?.minAge })}</p></span
				>
			{/if}
		{/if}
		{#if datesAreOnTheSameDay(event?.startDate, event?.endDate)}
			<span class="flex items-center space-x-2 text-lg"
				><Calendar size={16} />
				<p>{processDateString(new Date(event?.startDate), locale)}</p></span
			>
		{:else}
			<span class="flex items-center space-x-2 text-lg"
				><Calendar size={16} />
				<p>
					{processDateString(new Date(event?.startDate), locale)} - {processDateString(
						new Date(event?.endDate),
						locale
					)}
				</p></span
			>
		{/if}
		<Collapsible
			open={descriptionOpen}
			onOpenChange={(details) => (descriptionOpen = details.open)}
		>
			<Collapsible.Content class="text-justify text-lg font-bold">
				“{event?.shortDescription}”
			</Collapsible.Content>
			<Collapsible.Trigger class="flex items-center space-x-2 anchor"
				><p>{descriptionOpen ? t('events_page.show_less') : t('events_page.show_more')}</p>
				<UnfoldVertical size={16} /></Collapsible.Trigger
			>
		</Collapsible>
	{/if}
</div>
