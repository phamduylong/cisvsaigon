<script>
	import SquarePlus from '@lucide/svelte/icons/square-plus';
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

	import { t, getLocale } from '$lib/stores/i18n.svelte';

	const deleteFormId = $derived(`deleteBlogPostForm-${post?.id}`);

	const locale = $derived(getLocale());

	const animation =
		'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0';

	function deletePost() {
		const form = /**@type {HTMLFormElement}*/ (document.getElementById(deleteFormId));
		if (form) {
			form.submit();
		}
	}
</script>

<form id={deleteFormId} class="hidden" method="POST" action="/blog/?/delete">
	<input type="hidden" name="id" value={post?.id} />
</form>

<div class="max-h-fit grid-cols-1 space-y-2 card preset-filled-surface-100-900 p-4">
	{#if isPlaceHolder === true}
		<div class="flex flex-col items-center justify-center card p-4">
			<a
				class="btn flex flex-col preset-filled-surface-200-800 p-4 hover:preset-tonal"
				href="/blog/new/"
				rel=""
			>
				<SquarePlus />
				<span>{t('blog_page.add_new_post')}</span>
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
							{processDateString(new Date(post?.updated || ''), locale)}
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
									<Dialog.Title class="text-lg font-bold"
										>{t('blog_page.confirm_delete_blog_post_title')}</Dialog.Title
									>
									<Dialog.CloseTrigger class="btn-icon hover:preset-tonal">
										<XIcon class="size-4" />
									</Dialog.CloseTrigger>
								</header>
								<Dialog.Description>
									{t('blog_page.confirm_delete_blog_post')}
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
												deletePost();
											}}>{t('common.ok')}</button
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
				>{calculateAverageReadingTime(post?.content, locale)}</i
			>
		</div>
	{/if}
</div>
