<script>
	import { page } from '$app/state';
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
	<title>An error has occurred D:</title>
</svelte:head>

<div class="p-10 select-none" role="main">
	<h1 class="my-10 h1">
		{emotes[Math.floor(Math.random() * emotes.length)]}
		Something went wrong...
	</h1>
	<h1 class="my-10 h1">Error: {page.error?.message}</h1>
</div>
