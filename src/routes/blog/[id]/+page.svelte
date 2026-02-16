<script>
	import { PUBLIC_POCKETBASE_FILE_URL } from '$env/static/public';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { getInitials } from '$lib/helper/stringFunctions';
	/** @type {import('./$types').PageProps} */
	const { data } = $props();
	import { t, getLocale } from '$lib/stores/i18n.svelte';
	const locale = $derived(getLocale());
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon's blog post - {data.post.title}" />
	<title>{data.post.title} - {data.post.expand.author.displayName}</title>
</svelte:head>

<a
	class="mx-2 mt-3 ml-3 btn flex w-min items-center justify-between preset-filled bg-primary-700-300 text-sm md:mt-5 md:ml-5"
	aria-label="back"
	href="/blog"
	><ArrowLeft size={16} />
	<p>{t('common.back')}</p></a
>
<div class="flex w-full flex-col items-center justify-center">
	<div
		class="mt-10 mb-10 flex w-4/5 flex-col items-center justify-center space-y-10 md:w-3/5"
	>
		<!-- Author related -->
		<div class="flex flex-col items-center justify-center space-y-2">
			<Avatar class="inline size-16 rounded-full!">
				<Avatar.Image
					class="size-full object-cover"
					src={`${PUBLIC_POCKETBASE_FILE_URL}/${data.post.expand.author.collectionId}/${data.post.expand.author.id}/${data.post.expand.author.avatar}/`}
					alt="Author's avatar"
				/>
				<Avatar.Fallback>{getInitials(data.post.expand.author.displayName)}</Avatar.Fallback>
			</Avatar>
			<div class="text-xl">{data.post.expand.author.displayName}</div>
		</div>

		<div class="space-y-2">
			<div class="text-center">
				{new Date(data.post.updated).toLocaleDateString(locale ?? 'default', {
					// you can use undefined as first argument
					year: 'numeric',
					month: '2-digit',
					day: '2-digit'
				})}
			</div>
			<h3 class="text-center h3">
				{data.post.title}
			</h3>
		</div>

		<article class="w-full space-y-4 text-justify">
			{@html data.post.content}
		</article>
	</div>
</div>
