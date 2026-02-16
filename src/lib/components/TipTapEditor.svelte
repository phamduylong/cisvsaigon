<script>
	/** @type {{onContentChange: (content: string) => void, initialContent: string}}*/
	const { onContentChange, initialContent = '' } = $props();
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { StarterKit } from '@tiptap/starter-kit';
	import Image from '@tiptap/extension-image';
	import Highlight from '@tiptap/extension-highlight';
	import Underline from '@tiptap/extension-underline';
	import { Dropcursor } from '@tiptap/extensions';
	import Youtube from '@tiptap/extension-youtube';

	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Link from '@lucide/svelte/icons/link';
	import Strikethrough from '@lucide/svelte/icons/strikethrough';
	import Highlighter from '@lucide/svelte/icons/highlighter';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import YouTube from '@lucide/svelte/icons/youtube';
	import Asterisk from '@lucide/svelte/icons/asterisk';
	import { t, getLocale } from '$lib/stores/i18n.svelte';
	import { Portal, Popover, usePopover, FileUpload } from '@skeletonlabs/skeleton-svelte';
	import { isValidHttpUrl, isUrlFromDomain } from '$lib/helper/stringFunctions';

	const locale = $derived(getLocale());

	const buttons = [
		{
			signature: 'bold',
			icon: Bold,
			triggerFeature() {
				editorState.editor?.commands.toggleBold();
			}
		},
		{
			signature: 'italic',
			icon: Italic,
			triggerFeature() {
				editorState.editor?.commands.toggleItalic();
			}
		},
		{
			signature: 'strike',
			icon: Strikethrough,
			triggerFeature() {
				editorState.editor?.commands.toggleStrike();
			}
		},
		{
			signature: 'highlight',
			icon: Highlighter,
			triggerFeature() {
				editorState.editor?.commands.toggleHighlight();
			}
		},
		{
			signature: 'underline',
			icon: UnderlineIcon,
			triggerFeature() {
				editorState.editor?.commands.toggleUnderline();
			}
		}
	];

	const headings = [
		{ text: t('blog_page.insert_heading'), value: null, class: '', triggerFeature: function () {} },
		// blog post title is h3 so we must start at h4 and down
		{
			text: t('blog_page.large_heading'),
			value: 'h4',
			class: 'h4',
			triggerFeature: function () {
				editorState.editor?.commands.toggleHeading({ level: 4 });
			}
		},
		{
			text: t('blog_page.medium_heading'),
			value: 'h5',
			class: 'h5',
			triggerFeature: function () {
				editorState.editor?.commands.toggleHeading({ level: 5 });
			}
		},
		{
			text: t('blog_page.small_heading'),
			value: 'h6',
			class: 'h6',
			triggerFeature: function () {
				editorState.editor?.commands.toggleHeading({ level: 6 });
			}
		}
	];

	const toolBarBtnClasses = 'btn preset-filled-secondary-500 p-1 rounded-sm h-10 w-8';
	const toolBarBtnActiveClasses = 'preset-filled-secondary-950-50!';

	const id = $props.id();

	const anchorPopover = usePopover({
		id,
		closeOnInteractOutside: true,
		onOpenChange: (details) => {
			if (details.open === false) {
				anchorValidationErr = '';
			}
		}
	});

	const youtubePopover = usePopover({
		id: id + '1',
		closeOnInteractOutside: true,
		onOpenChange: (details) => {
			if (details.open === false) {
				youtubeValidationErr = '';
			}
		}
	});

	const imagePopover = usePopover({
		id: id + '2',
		closeOnInteractOutside: true,
		onOpenChange: (details) => {
			if (details.open === false) {
				imageValidationErr = '';
			}
		}
	});

	let element = $state();
	/**
	 * @typedef {import('@tiptap/core').Editor} Editor
	 */
	/** @type {{editor: Editor | null}}*/
	let editorState = $state({ editor: null });

	let url = $state('');
	let displayText = $state('');
	let anchorValidationErr = $state('');

	let youtubeUrl = $state('');
	let youtubeValidationErr = $state('');

	/** @type {string} */
	let modifiedContent = $derived.by(() => {
		let html = editorState.editor?.getHTML() ?? '';
		if (html) {
			html = html
				.replaceAll('<h4', '<h4 class="h4"')
				.replaceAll('<h5', '<h5 class="h5"')
				.replaceAll('<h6', '<h6 class="h6"')
				.replaceAll('<mark', '<mark class="mark"')
				.replaceAll('<a', '<a class="anchor"')
				.replaceAll('<iframe', '<iframe class="w-full! h-auto! min-h-120!"');
		}
		return html;
	});

	onMount(() => {
		editorState.editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Highlight,
				Underline,
				Image.configure({
					resize: {
						enabled: true,
						alwaysPreserveAspectRatio: true
					}
				}),
				Dropcursor,
				Youtube.configure({
					nocookie: true,
					ccLanguage: locale,
					interfaceLanguage: locale
				})
			],
			onTransaction: ({ editor }) => {
				// Update the state signal to force a re-render
				editorState = { editor };
			},
			onUpdate: () => {
				onContentChange(modifiedContent);
			},
			onCreate: ({ editor }) => {
				if (initialContent) {
					editor.commands.setContent(initialContent);
				}
			}
		});
	});

	onDestroy(() => {
		editorState.editor?.destroy();
	});
</script>

<div>
	{#if editorState.editor}
		<div class="my-2 flex flex-wrap space-y-2 space-x-1">
			<select
				name="_"
				class="select w-full md:w-min"
				onchange={(e) => {
					if (e.currentTarget && e.currentTarget.selectedIndex > 0) {
						headings[e.currentTarget.selectedIndex].triggerFeature();
						// reset selection
						e.currentTarget.selectedIndex = 0;
					}
				}}
			>
				{#each headings as heading (heading.value)}
					<option value={heading.value} class={heading.class}>{heading.text}</option>
				{/each}
			</select>
			{#each buttons as button (button.icon)}
				{@const Icon = button.icon}
				<button
					type="button"
					class={toolBarBtnClasses +
						(button.signature && editorState.editor?.isActive(button.signature)
							? ` ${toolBarBtnActiveClasses}`
							: '')}
					onclick={() => {
						button.triggerFeature();
					}}><Icon size={16} /></button
				>
			{/each}

			<!-- Anchor Button and Popover -->
			<Popover.Provider value={anchorPopover}>
				<Popover.Anchor>
					<button
						type="button"
						class={toolBarBtnClasses +
							(editorState.editor?.isActive('link') ? ` ${toolBarBtnActiveClasses}` : '')}
						onclick={() => {
							if (editorState.editor) {
								const { view, state } = editorState.editor;
								const { from, to } = view.state.selection;
								const selectedText = state.doc.textBetween(from, to, '');
								displayText = selectedText;
								anchorPopover().setOpen(true);
							}
						}}><Link size={16} /></button
					>
				</Popover.Anchor>
				<Portal>
					<Popover.Positioner>
						<Popover.Content class="max-w-sm space-y-2 card bg-surface-100-900 p-4 shadow-xl">
							<Popover.Description>
								<div class="mx-auto w-full max-w-md space-y-4">
									<!-- url -->
									<span class="flex justify-center"
										><b class="text-center text-lg text-error-500">{anchorValidationErr}</b></span
									>
									<label class="label">
										<span class="label-text flex"
											>{t('blog_page.url')} <Asterisk size={12} color="red" /></span
										>
										<input
											class="input"
											type="url"
											placeholder="https://example.com"
											bind:value={url}
										/>
									</label>
									<!-- text -->
									<label class="label">
										<span class="label-text flex"
											>{t('blog_page.url_display_text')} <Asterisk size={12} color="red" /></span
										>
										<input
											class="input"
											type="text"
											placeholder={t('blog_page.url_display_text')}
											bind:value={displayText}
										/>
									</label>
									<span class="flex w-full justify-end"
										><button
											type="button"
											class="btn preset-filled bg-primary-700-300 hover:preset-tonal"
											onclick={() => {
												// link is missing
												if (!url) {
													anchorValidationErr = t('blog_page.url_is_empty');
													return;
												}

												// not a valid URL
												if (!isValidHttpUrl(url)) {
													anchorValidationErr = t('blog_page.url_is_invalid');
													return;
												}

												// display text missing
												if (!displayText) {
													anchorValidationErr = t('blog_page.display_text_is_empty');
													return;
												}

												if (editorState.editor) {
													editorState.editor
														.chain()
														.focus()
														.insertContent(
															`<a href="${url}" target="_self" rel="noopener noreferrer">${displayText}</a>`
														)
														.run();
												}
												anchorValidationErr = '';
												url = '';
												displayText = '';
											}}
										>
											{t('common.ok')}</button
										></span
									>
								</div></Popover.Description
							>
							<Popover.Arrow
								class="[--arrow-background:var(--color-surface-100-900)] [--arrow-size:--spacing(2)]"
							>
								<Popover.ArrowTip />
							</Popover.Arrow>
						</Popover.Content>
					</Popover.Positioner>
				</Portal>
			</Popover.Provider>

			<Popover.Provider value={youtubePopover}>
				<Popover.Anchor>
					<button
						type="button"
						class={toolBarBtnClasses +
							(editorState.editor?.isActive('youtube') ? ` ${toolBarBtnActiveClasses}` : '')}
						onclick={() => {
							if (editorState.editor) {
								youtubePopover().setOpen(true);
							}
						}}><YouTube size={16} /></button
					>
				</Popover.Anchor>
				<Portal>
					<Popover.Positioner>
						<Popover.Content class="max-w-sm space-y-2 card bg-surface-100-900 p-4 shadow-xl">
							<Popover.Description>
								<div class="mx-auto w-full max-w-md space-y-4">
									<!-- youtube url -->
									<span class="flex justify-center"
										><b class="text-center text-lg text-error-500">{youtubeValidationErr}</b></span
									>
									<label class="label">
										<span class="label-text flex"
											>{t('blog_page.url')} <Asterisk size={12} color="red" /></span
										>
										<input
											class="input"
											type="url"
											placeholder="https://youtu.be/dQw4w9WgXcQ?si=wAvCZADN60XxFUAF"
											bind:value={youtubeUrl}
										/>
									</label>
									<span class="flex w-full justify-end"
										><button
											type="button"
											class="btn preset-filled bg-primary-700-300 hover:preset-tonal"
											onclick={() => {
												// link is empty
												if (!youtubeUrl) {
													youtubeValidationErr = t('blog_page.url_is_empty');
													return;
												}

												// not a valid http/https url
												if (!isValidHttpUrl(youtubeUrl)) {
													youtubeValidationErr = t('blog_page.url_is_invalid');
													return;
												}

												// not a youtube link
												if (
													!(
														isUrlFromDomain(youtubeUrl, 'youtube.com') ||
														isUrlFromDomain(youtubeUrl, 'youtu.be')
													)
												) {
													youtubeValidationErr = t('blog_page.url_is_not_youtube');
													return;
												}

												if (editorState.editor) {
													editorState.editor?.commands.setYoutubeVideo({
														src: youtubeUrl
													});
												}
												youtubeValidationErr = '';
												youtubeUrl = '';
											}}
										>
											{t('common.ok')}</button
										></span
									>
								</div></Popover.Description
							>
							<Popover.Arrow
								class="[--arrow-background:var(--color-surface-100-900)] [--arrow-size:--spacing(2)]"
							>
								<Popover.ArrowTip />
							</Popover.Arrow>
						</Popover.Content>
					</Popover.Positioner>
				</Portal>
			</Popover.Provider>

		</div>
	{/if}

	<div bind:this={element}></div>
</div>

<!-- Hidden textarea to submit content with form -->
<textarea name="postContent" class="hidden" value={modifiedContent}></textarea>
