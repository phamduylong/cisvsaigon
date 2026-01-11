<script>
	import BlogPostPreviewCard from '$lib/components/BlogPostPreviewCard.svelte';
	const { data } = $props();
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon's blog page" />
	<title>CISV Saigon - Blog</title>
</svelte:head>

<div class="container mx-auto flex h-full flex-col items-center justify-center p-4 md:p-10">
	<div class="container grid h-full grid-cols-1 items-start gap-y-5 md:w-5/6 xl:w-3/5">
		<h1 class="my-8 text-center h1 font-serif text-5xl">Blog</h1>
		{#each data.posts as post (post.id)}
			<BlogPostPreviewCard {post} isPlaceHolder={false} />
		{/each}

		{#if data.user}
			<BlogPostPreviewCard isPlaceHolder={true} />
		{/if}
	</div>
</div>
