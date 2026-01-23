<script>
	import { onMount } from 'svelte';
	let {
		classes,
		value = $bindable(),
		name = 'editor',
		onContentChange = null,
		onToolBarButtonClick = null
	} = $props();
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Link from '@lucide/svelte/icons/link';
	import Image from '@lucide/svelte/icons/image';
	import Strikethrough from '@lucide/svelte/icons/strikethrough';
	import Code from '@lucide/svelte/icons/code';
	import List from '@lucide/svelte/icons/list';
	import ListOrdered from '@lucide/svelte/icons/list-ordered';
	import TextWrap from '@lucide/svelte/icons/text-wrap';
	import { t } from '$lib/stores/i18n.svelte';

	const toolBarBtnClasses = 'btn preset-filled-secondary-50-950 p-1 rounded-sm card-hover h-9 w-6';

	const buttons = [
		{ icon: Bold, codeToInsert: '<b>Bold text</b>' },
		{ icon: Italic, codeToInsert: '<i>Italic text</i>' },
		{ icon: Strikethrough, codeToInsert: '<s>Strikethrough text</s>' },
		{ icon: Code, codeToInsert: '<code class="code">Text in code block</code>' },

		{
			icon: Link,
			codeToInsert: '<a class="anchor" href="https://example.com">Example link text</a>'
		},
		// { icon: Image, codeToInsert: '<img src="" alt="Description text for image" />' },

		{
			icon: List,
			codeToInsert:
				'\n<ul class="list-inside list-disc space-y-2">\n  <li>Item1</li>\n<li>Item 2</li></ul>'
		},
		{
			icon: ListOrdered,
			codeToInsert:
				'\n<ol class="list-inside list-decimal space-y-2">\n  <li>Item1</li>\n<li>Item 2</li>\n</ol>'
		},
		{ icon: TextWrap, codeToInsert: '<br>\n' }
	];

	const headings = [
		{ text: t('blog_page.insert_heading'), value: null },
		{ text: 'Heading 1', value: 'h1', class: 'h1', codeToInsert: '<h1 class="h1">Heading 1</h1>' },
		{ text: 'Heading 2', value: 'h2', class: 'h2', codeToInsert: '<h2 class="h2">Heading 2</h2>' },
		{ text: 'Heading 3', value: 'h3', class: 'h3', codeToInsert: '<h3 class="h3">Heading 3</h3>' },
		{ text: 'Heading 4', value: 'h4', class: 'h4', codeToInsert: '<h4 class="h4">Heading 4</h4>' },
		{ text: 'Heading 5', value: 'h5', class: 'h5', codeToInsert: '<h5 class="h5">Heading 5</h5>' },
		{ text: 'Heading 6', value: 'h6', class: 'h6', codeToInsert: '<h6 class="h6">Heading 6</h6>' }
	];

	/** @type {HTMLTextAreaElement | null} */
	let el = $state(null);

	/**
	 *
	 * @param {string} newText
	 */
	function typeInTextarea(newText) {
		const [start, end] = [el?.selectionStart, el?.selectionEnd];
		// I highly doubt it will ever be 0
		el?.setRangeText(newText, start ?? 0, end ?? 0, 'end');
		// a hack to get svelte reactivity going
		value = el?.value;
	}

	onMount(() => {
		el = /** @type {HTMLTextAreaElement} */ (document.getElementById('editor')) ?? null;
	});
</script>

<div>
	<div class="mb-2 flex h-8 flex-wrap space-y-1 space-x-1">
		<select
			name="_"
			class="select w-min"
			onchange={(e) => {
				if (e.currentTarget && e.currentTarget.selectedIndex > 0) {
					typeInTextarea(headings[e.currentTarget.selectedIndex].codeToInsert ?? '');
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
			{@const code = button.codeToInsert}
			<button
				type="button"
				class={toolBarBtnClasses}
				onclick={() => {
					typeInTextarea(code);
					if (onToolBarButtonClick) onToolBarButtonClick();
				}}><Icon size={16} /></button
			>
		{/each}
	</div>
	<!-- Buttons might overflow so smaller views must account for that with a margin top -->
	<textarea
		id="editor"
		bind:value
		class="mt-4 textarea p-4 max-[500px]:mt-14 {classes}"
		rows="20"
		onchange={onContentChange}
		required
		{name}
	></textarea>
</div>
