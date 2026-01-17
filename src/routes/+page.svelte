<script>
	import main from '$lib/assets/main.jpg';
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon's landing page" />
	<title>CISV Saigon</title>
</svelte:head>

<enhanced:img src={main} alt="CISV Circle" class="p-5 blur-xs filter" fetchpriority="high" />
