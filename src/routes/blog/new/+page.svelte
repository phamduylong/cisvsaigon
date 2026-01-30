<script>
	import { PUBLIC_POCKETBASE_FILE_URL } from '$env/static/public';
	import { getInitials } from '$lib/helper/stringFunctions';
	import { browser } from '$app/environment';

	let content = $state('');
	let title = $state('This is a blog title');

	let inPreviewMode = $state(false);
	import TipexEditor from '$lib/components/TipexEditor.svelte';
	import Asterisk from '@lucide/svelte/icons/asterisk';
	import View from '@lucide/svelte/icons/view';
	import Pen from '@lucide/svelte/icons/pen';
	import { Avatar, Switch } from '@skeletonlabs/skeleton-svelte';
	const { data } = $props();
	import DOMPurify from 'isomorphic-dompurify';
	import { t, getLocale } from '$lib/stores/i18n.svelte.js';
	import { onMount } from 'svelte';
	const locale = $derived(getLocale());
	/**@type {{ title: string, content: string }}*/
	let draftPost;

	/** @type {(html: string) => void}*/
	const setPreviewContent = (html) => {
		content = html;
		localStorage.setItem('draft', JSON.stringify({ title, content }));
	};

	// fetch draft content from LS
	onMount(() => {
		draftPost = browser
			? JSON.parse(localStorage.getItem('draft') ?? '')
			: { title: '', content: '' };
		title = draftPost['title'];
		content = draftPost['content'];
	});
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
	<div
		class="flex h-full w-full flex-col justify-center space-y-5 p-5 {inPreviewMode ? 'hidden' : ''}"
	>
		<form
			class="flex w-full flex-col space-y-5 card bg-surface-50-950 p-5"
			method="POST"
			action="/blog?/create"
		>
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
					oninput={() => localStorage.setItem('draft', JSON.stringify({ title, content }))}
				/>
			</label>
			<TipexEditor initialContent={content} onContentChange={setPreviewContent} />
			<div class="flex w-full justify-end">
				<button type="submit" class="btn w-24! preset-filled">{t('common.save')}</button>
			</div>
		</form>
	</div>
	<!-- We cannot use Svelte's conditional rendering because it resets state -->
	<div
		class="flex h-full w-full flex-col justify-center space-y-5 p-5 {inPreviewMode ? '' : 'hidden'}"
	>
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
</div>

<!-- Large view -->
<div class="hidden lg:flex">
	<div class="flex h-full w-1/2 flex-col justify-center space-y-5 p-5">
		<h1 class="text-center h1 lg:block">{t('blog_page.edit')}</h1>
		<form
			class="flex w-full flex-col space-y-5 card bg-surface-50-950 p-5"
			method="POST"
			action="/blog?/create"
		>
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
					oninput={() => localStorage.setItem('draft', JSON.stringify({ title, content }))}
				/>
			</label>
			<TipexEditor initialContent={content} onContentChange={setPreviewContent} />
			<div class="flex w-full justify-end">
				<button type="submit" class="btn w-24! preset-filled">{t('common.save')}</button>
			</div>
		</form>
	</div>
	<hr class="m-2 hr h-screen w-1 preset-filled-primary-900-100" />
	<div class="flex h-full w-1/2 flex-col justify-center space-y-5 p-5">
		<h1 class="text-center h1">{t('blog_page.preview')}</h1>
		<article
			class="min-h-100 space-y-4 card border-2 border-secondary-950-50 bg-surface-50-950 p-5 card-hover"
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
