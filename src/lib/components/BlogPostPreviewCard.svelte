<script>
	import SquarePlus from '@lucide/svelte/icons/square-plus';
	import Pen from '@lucide/svelte/icons/pen';
	import Timer from '@lucide/svelte/icons/timer';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { PUBLIC_POCKETBASE_FILE_URL } from '$env/static/public';
	/**
	 * @typedef {import('$lib/types/types.js').BlogPostRecord} BlogPostRecord
	 * @typedef {import('$lib/types/types.js').UserRecord} UserRecord
	 */
	/** @type {(BlogPostRecord & { expand: { author: UserRecord } })[]} */
	let { isPlaceHolder = true, post = null } = $props();
	/**
	 * Process date string to human readable format
	 * Shows day, month and year if the year is not the current year
	 * @param date {Date}
	 */
	function processDateString(date) {
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		let displayYear = false;
		const newDate = new Date();

		if (
			newDate.getFullYear() - year > 1 ||
			(newDate.getFullYear() - year <= 1 &&
				(newDate.getMonth() > month || (newDate.getMonth() === month && newDate.getDate() < day)))
		) {
			displayYear = true;
		}
		return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()} ${displayYear ? date.getFullYear() : ''}`;
	}

	/**
	 * Calculate the average reading time for the blog post.
	 * @param {string} postContent
	 */
	function calculateAverageReadingTime(postContent) {
		if (!postContent) return 'Nothing to read';
		let nrOfWords = postContent.split(' ').length;
		const readingTimeInMinutes = nrOfWords / 250;
		if (readingTimeInMinutes < 0.5) {
			return 'Less than a minute read';
		} else {
			const roundedTime = Math.round(readingTimeInMinutes);
			if (roundedTime === 1) {
				return '1 minute read';
			} else {
				return `${roundedTime} minutes read`;
			}
		}
	}
</script>

<div class="max-h-fit grid-cols-1 space-y-2 card preset-filled-surface-100-900 p-4">
	{#if isPlaceHolder === true}
		<div class="flex flex-col items-center justify-center card preset-filled-surface-200-800 p-4">
			<a class="btn flex flex-col preset-filled-surface-200-800 p-4" href="/blog/new/" rel="">
				<SquarePlus />
				<span>Add new post</span>
			</a>
		</div>
	{:else}
		<!-- Picture and name -->
		<div class="flex w-fit items-center space-x-2">
			<Avatar class="inline size-8">
				<Avatar.Image
					src={`${PUBLIC_POCKETBASE_FILE_URL}/${post.expand.author.collectionId}/${post.expand.author.id}/${post.expand.author.avatar}/`}
					alt="Author's avatar"
				/>
				<Avatar.Fallback>LT</Avatar.Fallback>
			</Avatar>
			<span>{post.expand.author.displayName}</span>
		</div>

		<a href="/blog/post/{post.id}"
			><h3 class="my-2 h3 font-bold hover:text-primary-600 md:my-4">
				{post.title}
			</h3></a
		>

		<div class="flex items-center justify-between">
			<div
				class="mx-1 flex items-center space-x-2 self-end text-sm md:mx-2"
				title="Last edited on {new Date(post.updated).toDateString()} {new Date(
					post.updated
				).toTimeString()}"
			>
				<Timer size={16} class="inline" /><i class="inline cursor-default"
					>{calculateAverageReadingTime(post.content)}</i
				>
			</div>
			<!-- Written and edited info -->
			<div
				class="mx-1 flex items-center space-x-2 self-end text-sm md:mx-2"
				title="Last edited on {new Date(post.updated).toDateString()} {new Date(
					post.updated
				).toTimeString()}"
			>
				<Pen size={16} class="inline" /><i class="inline cursor-default"
					>{processDateString(new Date(post.updated))}</i
				>
			</div>
		</div>
	{/if}
</div>
