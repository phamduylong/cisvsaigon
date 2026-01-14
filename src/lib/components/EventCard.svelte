<script lang="ts">
	import { Collapsible } from '@skeletonlabs/skeleton-svelte';
    import UnfoldVertical from '@lucide/svelte/icons/unfold-vertical';
    import Link from '@lucide/svelte/icons/link';
    import Calendar from '@lucide/svelte/icons/calendar';
    import SquarePlus from '@lucide/svelte/icons/square-plus';
    import UserSearch from '@lucide/svelte/icons/user-search';
	import { datesAreOnTheSameDay } from '$lib/helper/dateFunctions';
	import { processDateString } from '$lib/helper/stringFunctions';
	let descriptionOpen = $state(false);
    let { isPlaceHolder = false, event = null } = $props();
</script>

<div class="max-h-fit grid-cols-1 space-y-2 card preset-filled-surface-100-900 p-4">
    {#if isPlaceHolder}
<div class="flex flex-col items-center justify-center card p-4">
			<a
				class="btn flex flex-col preset-filled-surface-200-800 p-4 hover:preset-tonal"
				href="/event/new/"
				rel=""
			>
				<SquarePlus />
				<span>Add new event</span>
			</a>
		</div>
    {:else}
    <span class="flex items-center space-x-2 justify-start"><h3 class="h3 font-bold">{event?.title}</h3><button type="button" class="chip preset-filled-primary-500">Past event</button></span>
    <a href={event?.registrationLink} rel="external" class="anchor flex items-center space-x-2 text-lg font-semibold"><Link size={16} /><p>Registration link</p></a>
    {#if event?.startAge && event?.endAge}
        <span class="flex items-center space-x-2 text-lg"><UserSearch size={16} /><p>From {event?.startAge} to {event?.endAge} year-olds</p></span>
    {/if}
    <span class="flex items-center space-x-2 text-lg"><Calendar size={16} /><p>{processDateString(new Date(event?.startDate))} - {processDateString(new Date(event?.endDate))}</p></span>
    <Collapsible open={descriptionOpen} onOpenChange={(details) => (descriptionOpen = details.open)}>
        <Collapsible.Content class="text-lg text-justify font-bold">
            “{event?.shortDescription}”
        </Collapsible.Content>
        <Collapsible.Trigger class="anchor flex items-center space-x-2"><p>Show {descriptionOpen ? 'less' : 'more'} </p><UnfoldVertical size={16} /></Collapsible.Trigger>
    </Collapsible>
    {/if}
</div>