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

	const animation =
		'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0';

	async function deleteEvent() {
		await fetch(`/events/${event?.id}`, {
			method: 'DELETE'
		});
	}
</script>

<div class="max-h-fit grid-cols-1 space-y-2 card preset-filled-surface-100-900 p-4">
	{#if isPlaceHolder}
		<div class="flex flex-col items-center justify-center card p-4">
			<a
				class="btn flex flex-col preset-filled-surface-200-800 p-4 hover:preset-tonal"
				href="/events/new/"
				rel=""
			>
				<SquarePlus />
				<span>Add new event</span>
			</a>
		</div>
	{:else}
		<!-- Title and past event badge -->
		<span class="flex items-center justify-between"
			><div class="flex items-center justify-between space-x-2">
				<h3 class="h3 font-bold">{event?.title}</h3>
				<button type="button" class="chip hidden preset-filled-primary-500 md:block"
					>Past event</button
				>
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
									<Dialog.Title class="text-lg font-bold">Confirm delete?</Dialog.Title>
									<Dialog.CloseTrigger class="btn-icon hover:preset-tonal">
										<XIcon class="size-4" />
									</Dialog.CloseTrigger>
								</header>
								<Dialog.Description>
									Are you sure you want to delete this event? This operation is permanent and cannot
									be reverted!
								</Dialog.Description>
								<footer class="flex justify-end gap-2">
									<Dialog.CloseTrigger class="btn preset-tonal">Cancel</Dialog.CloseTrigger>
									<Dialog.CloseTrigger
										><button
											type="button"
											class="btn preset-filled"
											onclick={async () => {
												await deleteEvent();
												window?.location?.reload();
											}}>OK</button
										></Dialog.CloseTrigger
									>
								</footer>
							</Dialog.Content>
						</Dialog.Positioner>
					</Portal>
				</Dialog>
			{/if}</span
		>
		<button type="button" class="chip preset-filled-primary-500 md:hidden">Past event</button>
		<a
			href={event?.registrationLink}
			rel="external"
			class="flex items-center space-x-2 anchor text-lg font-semibold"
			><Link size={16} />
			<p>Registration link</p></a
		>
		{#if event?.minAge}
			{#if event?.maxAge}
				<span class="flex items-center space-x-2 text-lg"
					><UserSearch size={16} />
					<p>From {event?.minAge} to {event?.maxAge} year-olds</p></span
				>
			{:else}
				<!-- Event has no age cap, only minimum. -->
				<span class="flex items-center space-x-2 text-lg"
					><UserSearch size={16} />
					<p>{event?.minAge}+ year-olds</p></span
				>
			{/if}
		{/if}
		{#if datesAreOnTheSameDay(event?.startDate, event?.endDate)}
			<span class="flex items-center space-x-2 text-lg"
				><Calendar size={16} />
				<p>{processDateString(new Date(event?.startDate))}</p></span
			>
		{:else}
			<span class="flex items-center space-x-2 text-lg"
				><Calendar size={16} />
				<p>
					{processDateString(new Date(event?.startDate))} - {processDateString(
						new Date(event?.endDate)
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
				><p>Show {descriptionOpen ? 'less' : 'more'}</p>
				<UnfoldVertical size={16} /></Collapsible.Trigger
			>
		</Collapsible>
	{/if}
</div>
