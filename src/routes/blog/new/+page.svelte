<script>
	import { PUBLIC_POCKETBASE_FILE_URL } from '$env/static/public';
	import { getInitials } from '$lib/helper/stringFunctions';

	let content = $state('');
	let title = $state('');

	let inPreviewMode = $state(false);
	import TextEditor from '$lib/components/TextEditor.svelte';
	import Asterisk from '@lucide/svelte/icons/asterisk';
	import View from '@lucide/svelte/icons/view';
	import Pen from '@lucide/svelte/icons/pen';
	import { Avatar, Switch } from '@skeletonlabs/skeleton-svelte';
	const { data } = $props();
	import DOMPurify from 'isomorphic-dompurify';
	import { t, getLocale } from '$lib/stores/i18n.svelte.js';
	const locale = $derived(getLocale());
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon's edit page to create new blog post" />
	<title>CISV Saigon - {t('blog_page.add_new_post')}</title>
</svelte:head>

<!-- Small/medium view-->
<div class="flex flex-col lg:hidden">
	<div class="mt-5 flex w-full flex-col justify-center">
		<Switch
			class="justify-center"
			checked={inPreviewMode}
			onCheckedChange={() => (inPreviewMode = !inPreviewMode)}
		>
			<Switch.Control>
				<Switch.Thumb>
					<Switch.Context>
						{#snippet children(switch_)}
							{#if switch_().checked}
								<View class="size-3" />
							{:else}
								<Pen class="size-3" />
							{/if}
						{/snippet}
					</Switch.Context>
				</Switch.Thumb>
			</Switch.Control>
			<Switch.HiddenInput />
		</Switch>
		<p class="text-center text-lg">
			{inPreviewMode ? t('blog_page.preview') : t('blog_page.edit')}
		</p>
	</div>
	{#if !inPreviewMode}
		<div class="flex h-full w-full flex-col justify-center space-y-5 p-5">
			<form class="flex w-full flex-col space-y-5 card bg-surface-50-950 p-5" method="POST">
				<label class="label">
					<span class="label-text flex"
						>{t('blog_page.blog_post_title')} <Asterisk size={12} color="red" /></span
					>
					<input
						bind:value={title}
						class="input"
						type="text"
						name="title"
						placeholder={t('blog_page.blog_post_title_placeholder')}
						required
					/>
				</label>
				<TextEditor classes="min-h-150" name="postContent" bind:value={content} />
				<div class="flex w-full justify-end">
					<button type="submit" class="btn w-24! preset-filled">{t('common.save')}</button>
				</div>
			</form>
		</div>
	{:else}
		<div class="flex h-full w-full flex-col justify-center space-y-5 p-5">
			<article
				class="min-h-fit space-y-4 card border-2 border-secondary-950-50 bg-surface-50-950 p-5 card-hover"
			>
				<!-- Author related information -->
				<div class="flex flex-col items-center justify-center space-y-2">
					<Avatar class="inline size-16 rounded-full!">
						<Avatar.Image
							class="size-full object-cover"
							src={`${PUBLIC_POCKETBASE_FILE_URL}/${data.user?.collectionId}/${data.user?.id}/${data.user?.avatar}`}
							alt="Author's avatar"
						/>
						<Avatar.Fallback>{getInitials(data.user?.displayName || 'U S E R')}</Avatar.Fallback>
					</Avatar>
					<div class="text-xl">{data.user?.displayName}</div>
				</div>

				<div class="space-y-2">
					<div class="text-center">
						{new Date().toLocaleDateString(locale ?? 'default', {
							// you can use undefined as first argument
							year: 'numeric',
							month: '2-digit',
							day: '2-digit'
						})}
					</div>
					<h3 class="text-center h3">
						{title}
					</h3>
				</div>

				<!-- Rendered content-->
				<div class="space-y-4 text-justify">
					{@html DOMPurify.sanitize(content)}
				</div>
			</article>
		</div>
	{/if}
</div>

<!-- Large view -->
<div class="hidden lg:flex">
	<div class="flex h-full w-1/2 flex-col justify-center space-y-5 p-5">
		<h1 class="text-center h1 lg:block">{t('blog_page.edit')}</h1>
		<form class="flex w-full flex-col space-y-5 card bg-surface-50-950 p-5" method="POST">
			<label class="label">
				<span class="label-text flex"
					>{t('blog_page.blog_post_title')} <Asterisk size={12} color="red" /></span
				>
				<input
					bind:value={title}
					class="input"
					type="text"
					name="title"
					placeholder={t('blog_page.blog_post_title_placeholder')}
					required
				/>
			</label>
			<TextEditor classes="lg:min-h-150" name="postContent" bind:value={content} />
			<div class="flex w-full justify-end">
				<button type="submit" class="btn w-24! preset-filled">{t('common.save')}</button>
			</div>
		</form>
	</div>
	<hr class="m-2 hr h-screen w-1 preset-filled-primary-900-100" />
	<div class="flex h-full w-1/2 flex-col justify-center space-y-5 p-5">
		<h1 class="text-center h1">{t('blog_page.preview')}</h1>
		<article
			class="min-h-187 space-y-4 card border-2 border-secondary-950-50 bg-surface-50-950 p-5 card-hover"
		>
			<!-- Author related information -->
			<div class="mb-5 flex w-full flex-col items-center justify-center space-y-2">
				<Avatar>
					<Avatar.Image
						class="size-full object-cover"
						src={`${PUBLIC_POCKETBASE_FILE_URL}/${data.user?.collectionId}/${data.user?.id}/${data.user?.avatar}`}
						alt="Author's avatar"
					/>
					<Avatar.Fallback>{data.user?.displayName}</Avatar.Fallback>
				</Avatar>
				<span class="text-xl">{data.user?.displayName}</span>
			</div>

			<!-- Post title -->
			<div class="space-y-2">
				<div class="text-center">
					{new Date().toLocaleDateString(locale ?? 'default', {
						// you can use undefined as first argument
						year: 'numeric',
						month: '2-digit',
						day: '2-digit'
					})}
				</div>
				<h3 class="text-center h3">
					{title}
				</h3>
			</div>

			<!-- Rendered content-->
			<div class="space-y-4 text-justify">
				{@html DOMPurify.sanitize(content)}
			</div>
		</article>
	</div>
</div>
