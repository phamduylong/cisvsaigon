<script>
	import { PUBLIC_POCKETBASE_FILE_URL } from '$env/static/public';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { getInitials, toDayOfWeek } from '$lib/helper/stringFunctions';
	/** @type {import('./$types').PageProps} */
	const { data } = $props();
</script>

<a class="mt-3 ml-3 md:mt-5 md:ml-5 btn preset-filled w-min flex items-center mx-2 text-sm justify-between" aria-label="back" href="/blog"><ArrowLeft size={16} /><p>Back</p></a>
<div class="flex flex-col w-full justify-center items-center">
	<div class="mt-10 mb-10 flex max-w-4/5 flex-col items-center justify-center space-y-10 md:max-w-3/5">
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
				{new Date(data.post.updated).toLocaleString('default', { month: 'short' })}
				{new Date(data.post.updated).getDate()}, {new Date(data.post.updated)
					.getFullYear()
					.toString()
					.substring(2)} ({toDayOfWeek(new Date(data.post.updated).getDay(), true)})
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
