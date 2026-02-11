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

	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Link from '@lucide/svelte/icons/link';
	import Strikethrough from '@lucide/svelte/icons/strikethrough';
	import Highlighter from '@lucide/svelte/icons/highlighter';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import XIcon from '@lucide/svelte/icons/x';
	import { t } from '$lib/stores/i18n.svelte';
	import { Dialog, useDialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { isValidHttpUrl } from '$lib/helper/stringFunctions';

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
		},
		{
			signature: 'link',
			icon: Link,
			triggerFeature() {
				if (editorState.editor) {
					const { view, state } = editorState.editor;
					const { from, to } = view.state.selection;
					const selectedText = state.doc.textBetween(from, to, '');
					displayText = selectedText;
					dialog().setOpen(true);
				}
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
	const animation =
		'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0';

	const id = $props.id();
	const dialog = useDialog({
		id,
		closeOnInteractOutside: true,
		closeOnEscape: true
	});

	let element = $state();
	/**
	 * @typedef {import('@tiptap/core').Editor} Editor
	 */
	/** @type {{editor: Editor | null}}*/
	let editorState = $state({ editor: null });

	let url = $state('');
	let displayText = $state('');
	let validationErr = $state('');

	/** @type {string} */
	let modifiedContent = $derived.by(() => {
		let html = editorState.editor?.getHTML() ?? '';
		if (html) {
			html = html
				.replaceAll('<h4', '<h4 class="h4"')
				.replaceAll('<h5', '<h5 class="h5"')
				.replaceAll('<h6', '<h6 class="h6"')
				.replaceAll('<mark', '<mark class="mark"')
				.replaceAll('<a', '<a class="anchor"');
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
				Dropcursor
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
		</div>
	{/if}

	<div bind:this={element}></div>
</div>

<!-- Hidden textarea to submit content with form -->
<textarea name="postContent" class="hidden" value={modifiedContent}></textarea>

<!-- Modal to insert link -->
<Dialog.Provider value={dialog}>
	<Dialog.Trigger id="navigateWarningButton" class="hidden"></Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content
				class="w-full max-w-xl space-y-4 card bg-surface-100-900 p-4 shadow-xl {animation}"
			>
				<header class="flex items-center justify-between">
					<Dialog.Title class="text-lg font-bold">{t('common.leaving_title')}</Dialog.Title>
					<Dialog.CloseTrigger
						class="btn-icon hover:preset-tonal"
						onclick={() => {
							validationErr = '';
						}}
					>
						<XIcon class="size-4" />
					</Dialog.CloseTrigger>
				</header>
				<Dialog.Description class="flex flex-1 flex-wrap space-y-2">
					<div class="mx-auto w-full max-w-md space-y-4">
						<!-- url -->
						<span class="flex justify-center"
							><b class="text-center text-lg text-error-500">{validationErr}</b></span
						>
						<label class="label">
							<span class="label-text">{t('blog_page.url')}</span>
							<input class="input" type="url" placeholder={t('blog_page.url')} bind:value={url} />
						</label>
						<!-- text -->
						<label class="label">
							<span class="label-text">{t('blog_page.url_display_text')}</span>
							<input
								class="input"
								type="text"
								placeholder={t('blog_page.url_display_text')}
								bind:value={displayText}
							/>
						</label>
					</div>
				</Dialog.Description>
				<footer class="flex justify-end gap-2">
					<Dialog.CloseTrigger
						class="btn preset-tonal"
						onclick={() => {
							dialog().setOpen(false);
							validationErr = '';
						}}>{t('common.cancel')}</Dialog.CloseTrigger
					>
					<button
						type="button"
						class="btn preset-filled"
						onclick={() => {
							if (!url) {
								validationErr = t('blog_page.url_is_invalid');
								return;
							}

							if (!isValidHttpUrl(url)) {
								validationErr = t('blog_page.url_is_invalid');
								return;
							}

							if (!displayText) {
								validationErr = t('blog_page.display_text_is_empty');
								return;
							}
							dialog().setOpen(false);
							if (editorState.editor) {
								editorState.editor
									.chain()
									.focus()
									.insertContent(
										`<a href="${url}" target="_self" rel="noopener noreferrer">${displayText}</a>`
									)
									.run();
							}
							validationErr = '';
							url = '';
							displayText = '';
						}}>{t('common.ok')}</button
					>
				</footer>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog.Provider>
