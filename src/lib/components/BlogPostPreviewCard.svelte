<script>
	import SquarePlus from '@lucide/svelte/icons/square-plus';
	import Pen from '@lucide/svelte/icons/pen';
	import Timer from '@lucide/svelte/icons/timer';
	import Trash from '@lucide/svelte/icons/trash';
	import XIcon from '@lucide/svelte/icons/x';
	import { Avatar, Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import {
		processDateString,
		calculateAverageReadingTime,
		getInitials
	} from '$lib/helper/stringFunctions';
	import { PUBLIC_POCKETBASE_FILE_URL } from '$env/static/public';
	/**
	 * @typedef {import('$lib/types/types.js').BlogPostRecord} BlogPostRecord
	 * @typedef {import('$lib/types/types.js').UserRecord} UserRecord
	 */
	/** @type {{
	 *   isPlaceHolder?: boolean,
	 *   post?: (BlogPostRecord & { expand: { author: UserRecord } }) | null,
	 *   isLoggedIn?: boolean
	 * }} */
	let { isPlaceHolder = false, post = null, isLoggedIn = false } = $props();

	const animation =
		'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0';

	async function deletePost() {
		await fetch(`/blog/${post?.id}`, {
			method: 'DELETE'
		});
	}
</script>

<div class="max-h-fit grid-cols-1 space-y-2 card preset-filled-surface-100-900 p-4">
	{#if isPlaceHolder === true}
		<div class="flex flex-col items-center justify-center card p-4">
			<a
				class="btn flex flex-col preset-filled-surface-200-800 p-4 hover:preset-tonal"
				href="/blog/new/"
				rel=""
			>
				<SquarePlus />
				<span>Add new post</span>
			</a>
		</div>
	{:else}
		<!-- Picture and name and delete icon -->
		<div class="flex w-full items-start justify-between space-y-2">
			<div class="flex items-center justify-center space-x-2">
				<Avatar class="inline size-8">
					<Avatar.Image
						class="size-full object-cover"
						src={`${PUBLIC_POCKETBASE_FILE_URL}/${post?.expand.author.collectionId}/${post?.expand.author.id}/${post?.expand.author.avatar}/`}
						alt="Author's avatar"
					/>
					<Avatar.Fallback
						>{getInitials(post?.expand.author.displayName || 'U S E R')}</Avatar.Fallback
					>
				</Avatar>
				<div>
					<span class="font-semibold">{post?.expand.author.displayName}</span>
					<!-- Written and edited info -->
					<div
						class="flex items-center space-x-2 self-end text-sm"
						title="Last edited on {new Date(post?.updated || '').toDateString()} {new Date(
							post?.updated || ''
						).toTimeString()}"
					>
						<p class="inline cursor-default text-sm">
							{processDateString(new Date(post?.updated || ''))}
						</p>
					</div>
				</div>
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
									Are you sure you want to delete this blog post? This operation is permanent and
									cannot be reverted!
								</Dialog.Description>
								<footer class="flex justify-end gap-2">
									<Dialog.CloseTrigger class="btn preset-tonal">Cancel</Dialog.CloseTrigger>
									<Dialog.CloseTrigger
										><button
											type="button"
											class="btn preset-filled"
											onclick={async () => {
												await deletePost();
												window?.location?.reload();
											}}>OK</button
										></Dialog.CloseTrigger
									>
								</footer>
							</Dialog.Content>
						</Dialog.Positioner>
					</Portal>
				</Dialog>
			{/if}
		</div>

		<a href="/blog/{post?.id}"
			><h3 class="my-2 h3 font-bold hover:text-primary-600 md:my-4">
				{post?.title}
			</h3></a
		>

		<div
			class="flex items-center space-x-2 self-end text-sm"
			title="Last edited on {new Date(post?.updated || '').toDateString()} {new Date(
				post?.updated || ''
			).toTimeString()}"
		>
			<Timer size={16} class="inline" /><i class="inline cursor-default"
				>{calculateAverageReadingTime(post?.content)}</i
			>
		</div>
	{/if}
</div>
