<script>
	import main from '$lib/assets/main.jpg';
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon's landing page" />
	<title>CISV Saigon</title>
</svelte:head>

<article class="flex w-full flex-col items-center justify-center">
	<div
		class="my-10 flex max-w-4/5 flex-col space-y-5 text-justify md:max-w-3/5 md:space-y-8 md:text-lg"
	>
		<h2 class="text-center h2">Overview</h2>
		<i class="text-center">We are a group of CISV members based in Saigon, Vietnam.</i>

		<!-- Introduction -->
		<h3 class="w-fit anchor h3 font-bold" id="what-is-cisv">
			<a href="#what-is-cisv">What is CISV?</a>
		</h3>
		<p>
			CISV (Children’s International Summer Villages) is a global peace-education organization
			founded internationally in 1950 by
			<a class="anchor" href="https://cisv.org/about-us/our-story/our-founder/"
				>Dr. Doris Twitchell Allen
			</a> with the idea that children can become ambassadors for a more peaceful world by learning across
			cultures. The first CISV Village programme was held in the U.S. in 1951.
		</p>

		<!-- History -->
		<h3 class="w-fit anchor h3 font-bold" id="our-history">
			<a href="#our-history">Our history</a>
		</h3>
		<p>
			Started as a small branch of <a class="anchor" href="https://vncisv.wordpress.com/"
				>CISV Vietnam</a
			>
			from the mid-to-late 2010s, CISV Saigon has been striving to be a reliable camp organizer, holding
			camps for participants who previously took part in camps in Hanoi - where the CISV Vietnam chapter
			is based. We organized our first Mini-Camp in 2024, where we hosted 64 participants and 2 camps
			for kids of the
			<a class="anchor" href="https://cisv.org/programmes/village/">Village age group</a>. Since
			then, we have organized another Mini-Camp in the summer of 2025 and a New Year Party event at
			the beginning of 2026.
		</p>
		<figure class="flex flex-col items-center justify-center space-y-2">
			<enhanced:img src={main} alt="One of our activities in 2025" />
			<figcaption><i>One of our activities in 2025</i></figcaption>
		</figure>

		<h3 class="w-fit anchor h3 font-bold" id="plans-for-2026">
			<a href="#plans-for-2026">Plans for 2026</a>
		</h3>
		<p>
			For 2026, we plan to organize another Mini-Camp for kids of age group <a
				class="anchor"
				href="https://cisv.org/programmes/village/">Village</a
			>
			(for 10-11 years olds) and
			<a class="anchor" href="https://cisv.org/programmes/youth-meeting/">Youth Meeting</a> (for 12-13
			years olds). Exact time and location will be updated later, but expect it to happen during June
			- July.
		</p>
	</div>
</article>
