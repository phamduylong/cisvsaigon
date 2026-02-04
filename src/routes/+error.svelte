<script>
	import Home from '@lucide/svelte/icons/home';
	import { page } from '$app/state';
	import { t } from '$lib/stores/i18n.svelte';
	const emotes = [
		'＞﹏＜',
		'(っ °Д °;)っ',
		'(;´༎ຶД༎ຶ`)',
		'⊙﹏⊙∥',
		'(´。＿。｀)',
		'(；′⌒`)',
		'(。﹏。*)',
		'o(TヘTo)',
		'.·´¯`(>▂<)´¯`·.',
		'(⊙x⊙;)',
		'ಠ_ರೃ',
		'o((⊙﹏⊙))o',
		'.Σ(っ °Д °;)っ',
		'_(:з)∠)_',
		'<@_@>'
	];
</script>

<svelte:head>
	<title>{t('common.something_went_wrong')} D:</title>
</svelte:head>

<div class="p-10 select-none" role="main">
	<h1 class="my-10 h1">
		{emotes[Math.floor(Math.random() * emotes.length)]}
		{t('common.something_went_wrong')}
	</h1>
	<h1 class="my-10 h1">{page.error?.message}</h1>
	<a href="/" class="btn flex w-min items-center preset-filled bg-primary-700-300"
		>{t('common.back')} <Home size={16} /></a
	>
</div>
