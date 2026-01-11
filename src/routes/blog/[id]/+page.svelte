<script>
	import { PUBLIC_POCKETBASE_FILE_URL } from '$env/static/public';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { getInitials, toDayOfWeek } from '$lib/helper/stringFunctions';
	/** @type {import('./$types').PageProps} */
	const { data } = $props();
</script>

<div class="flex w-full items-center justify-center">
	<div class="my-10 flex max-w-4/5 flex-col items-center justify-center space-y-10 md:max-w-3/5">
		<!-- Author related -->
		<div class="flex flex-col items-center justify-center space-y-2">
			<Avatar class="inline size-16 rounded-full!">
				<Avatar.Image
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
