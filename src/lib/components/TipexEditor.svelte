<script>
	import { Tipex } from '@friendofsvelte/tipex';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Link from '@lucide/svelte/icons/link';
	import Strikethrough from '@lucide/svelte/icons/strikethrough';
	import Code from '@lucide/svelte/icons/code';
	import List from '@lucide/svelte/icons/list';
	import ListOrdered from '@lucide/svelte/icons/list-ordered';
	import XIcon from '@lucide/svelte/icons/x';
	import { t } from '$lib/stores/i18n.svelte';
	import { Dialog, useDialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { isValidHttpUrl } from '$lib/helper/stringFunctions';

	/** @type {{onContentChange: (content: string) => void}}*/
	const { onContentChange } = $props();

	const toolBarBtnClasses = 'btn preset-filled-secondary-50-950 p-1 rounded-sm card-hover h-9 w-6';
	const animation =
		'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0';

	/** @type {TipexEditor | undefined}*/
	let editor = $state(undefined);

	/** @type {string} */
	let modifiedContent = $derived.by(() => {
		let html = editor?.getHTML();
		if (html) {
			html = html
				.replaceAll('<h4', '<h4 class="h4"')
				.replaceAll('<h5', '<h5 class="h5"')
				.replaceAll('<h6', '<h6 class="h6"')
				.replaceAll('<code', '<code class="code"')
				.replaceAll('<a', '<a class="anchor"')
				.replaceAll('<ul', '<ul class="list-inside list-disc space-y-2"')
				.replaceAll('<ol', '<ol class="list-inside list-decimal space-y-2"');
		}
		return html;
	});

	$effect(() => {
		onContentChange(modifiedContent);
	});

	let url = $state('');
	let displayText = $state('');
	let validationErr = $state('');

	const buttons = [
		{
			icon: Bold,
			triggerFeature: function () {
				editor?.commands.toggleBold();
			}
		},
		{
			icon: Italic,
			triggerFeature: function () {
				editor?.commands.toggleItalic();
			}
		},
		{
			icon: Strikethrough,
			triggerFeature: function () {
				editor?.commands.toggleStrike();
			}
		},
		{
			icon: Code,
			triggerFeature: function () {
				editor?.commands.toggleCode();
			}
		},

		{
			icon: Link,
			triggerFeature: function () {
				dialog().setOpen(true);
			}
		},

		{
			icon: List,
			triggerFeature: function () {
				editor?.commands.toggleBulletList();
			}
		},
		{
			icon: ListOrdered,
			triggerFeature: function () {
				editor?.commands.toggleOrderedList();
			}
		}
	];

	const headings = [
		{ text: t('blog_page.insert_heading'), value: null, class: '', triggerFeature: function () {} },
		// blog post title is h3 so we must start at h4 and down
		{
			text: 'Large heading',
			value: 'h4',
			class: 'h4',
			triggerFeature: function () {
				editor?.commands.toggleHeading({ level: 4 });
			}
		},
		{
			text: 'Medium heading',
			value: 'h5',
			class: 'h5',
			triggerFeature: function () {
				editor?.commands.toggleHeading({ level: 5 });
			}
		},
		{
			text: 'Small heading',
			value: 'h6',
			class: 'h6',
			triggerFeature: function () {
				editor?.commands.toggleHeading({ level: 6 });
			}
		}
	];

	const id = $props.id();
	const dialog = useDialog({
		id,
		closeOnInteractOutside: true,
		closeOnEscape: true
	});
</script>

<Tipex class="mt-0! w-full" bind:tipex={editor}>
	{#snippet controlComponent()}
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
					class={toolBarBtnClasses}
					onclick={() => {
						button.triggerFeature();
					}}><Icon size={16} /></button
				>
			{/each}
		</div>
	{/snippet}
</Tipex>

<textarea name="postContent" class="hidden" value={modifiedContent}></textarea>

<!-- Insert link dialog -->
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
							<span class="label-text">URL</span>
							<input class="input" type="url" placeholder="URL" bind:value={url} />
						</label>
						<!-- text -->
						<label class="label">
							<span class="label-text">Display text</span>
							<input
								class="input"
								type="text"
								placeholder="Display text"
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
								validationErr = 'URL must not be empty';
								return;
							}

							if (!isValidHttpUrl(url)) {
								validationErr = 'URL is invalid';
								return;
							}

							if (!displayText) {
								validationErr = 'Display text must not be empty';
								return;
							}
							dialog().setOpen(false);
							editor
								.chain()
								.focus()
								.insertContent(
									`<a href="${url}" target="_blank" rel="noopener noreferrer">${displayText}</a>`
								)
								.run();
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
