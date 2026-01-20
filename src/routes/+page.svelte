<script>
	import main from '$lib/assets/main.jpg';
	import { t } from '$lib/stores/i18n';
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon's landing page" />
	<title>CISV Saigon</title>
</svelte:head>

<article class="flex w-full flex-col items-center justify-center">
	<div
		class="my-10 flex max-w-4/5 flex-col space-y-5 text-justify md:max-w-3/5 md:space-y-8 md:text-lg"
	>
		<h2 class="text-center h2">{$t('landing_page.title')}</h2>
		<i class="text-center">{$t('landing_page.intro')}</i>

		<!-- Introduction -->
		<h3 class="w-fit anchor h3 font-bold" id="what-is-cisv">
			<a href="#what-is-cisv">{$t('landing_page.what_is_cisv')}</a>
		</h3>
		<p>
			{$t('landing_page.what_is_cisv.prefix')}
			<a class="anchor" href="https://cisv.org/about-us/our-story/our-founder/">
				{$t('landing_page.what_is_cisv.founder')}
			</a>
			{$t('landing_page.what_is_cisv.suffix')}
		</p>

		<!-- History -->
		<h3 class="w-fit anchor h3 font-bold" id="our-history">
			<a href="#our-history">Our history</a>
		</h3>
		<p>
			{$t('landing_page.history_description.prefix')}
			<a class="anchor" href="https://vncisv.wordpress.com/">
				{$t('landing_page.history_description.cisv_vietnam')}
			</a>
			{$t('landing_page.history_description.middle')}
			<a class="anchor" href="https://cisv.org/programmes/village/">
				{$t('landing_page.history_description.village_age_group')}
			</a>.
			{$t('landing_page.history_description.suffix')}
		</p>
		<figure class="flex flex-col items-center justify-center space-y-2">
			<enhanced:img src={main} alt="One of our activities in 2025" />
			<figcaption><i>{$t('landing_page.activity_2025_image_caption')}</i></figcaption>
		</figure>

		<h3 class="w-fit anchor h3 font-bold" id="plans-for-2026">
			<a href="#plans-for-2026">{$t('landing_page.plans_for_2026')}</a>
		</h3>
		<p>
			{$t('landing_page.plans_for_2026.prefix')}
			<a class="anchor" href="https://cisv.org/programmes/village/">
				{$t('landing_page.plans_for_2026.village')}
			</a>
			{$t('landing_page.plans_for_2026.village_age')}
			<a class="anchor" href="https://cisv.org/programmes/youth-meeting/">
				{$t('landing_page.plans_for_2026.youth_meeting')}
			</a>
			{$t('landing_page.plans_for_2026.youth_meeting_age')}
			{$t('landing_page.plans_for_2026.suffix')}
		</p>
	</div>
</article>
