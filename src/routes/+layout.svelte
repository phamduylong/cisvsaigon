<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/logo.jpg';
	import { AppBar, Menu, Portal } from '@skeletonlabs/skeleton-svelte';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import Facebook from '@lucide/svelte/icons/facebook';
	import Instagram from '@lucide/svelte/icons/instagram';
	import Mail from '@lucide/svelte/icons/mail';
	import User from '@lucide/svelte/icons/user';
	import BookImage from '@lucide/svelte/icons/book-image';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import PencilLine from '@lucide/svelte/icons/pencil-line';
	import LogOut from '@lucide/svelte/icons/log-out';
	import { goto } from '$app/navigation';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	let { children, data } = $props();

	const links = [
		{
			href: 'https://www.facebook.com/groups/1761170264115434',
			icon: Facebook,
			ariaLabel: 'Join our Facebook group'
		},
		{
			href: 'https://www.instagram.com/cisv.saigon/',
			icon: Instagram,
			ariaLabel: 'Go to our Instagram page'
		},
		{ href: 'mailto:cisvhcm@gmail.com', icon: Mail, ariaLabel: 'Send us an email' }
	];
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="m-0 flex h-full min-h-screen flex-col">
	<!-- App bar -->
	<AppBar>
		<AppBar.Toolbar class="flex">
			<AppBar.Lead class="w-1/3 flex justify-start">
				<a href="/"
					><img src={logo} alt="CISV Logo" class="h-12 w-12 bg-transparent md:h-16 md:w-16" /></a
				>
			</AppBar.Lead>
			<AppBar.Headline  class="w-1/3 flex justify-center">
				<a href="/" class="text-md md:text-xl lg:text-2xl font-bold">CISV SAIGON</a>
			</AppBar.Headline>
			<AppBar.Trail class="space-x-2 md:space-x-5 w-1/3 flex justify-end">
				
				<Menu
					onSelect={(details) => {
						const clickedLink = details.value;
						if (clickedLink.indexOf('logout') > -1) {
							// special case, we need to make a POST req to logout
							// submit the form that's wrapping logout

							const form = /**@type {HTMLFormElement}*/ (document.getElementById('logoutForm'));
							if (form) {
								form.submit();
							}
						} else {
							if (!clickedLink.startsWith('/')) goto(`/${clickedLink}`);
							else goto(clickedLink);
						}
					}}
				>
					<Menu.Trigger class="btn preset-filled bg-primary-700-300 hover:preset-tonal"
						><p class="hidden md:block">Menu</p>
						<MenuIcon size={20} /></Menu.Trigger
					>
					<Portal>
						<Menu.Positioner>
							<Menu.Content>
								<LightSwitch classes="flex justify-between"/>
								<hr class="hr" />
								{#if !data.user}
									<Menu.Item value="/login">
										<Menu.ItemText class="flex items-center space-x-2"
											><User size={16} />
											<p>Login</p></Menu.ItemText
										>
									</Menu.Item>
								{/if}
								<Menu.Item value="/gallery">
									<Menu.ItemText class="flex items-center space-x-2"
										><BookImage size={16} />
										<p>Gallery</p></Menu.ItemText
									>
								</Menu.Item>
								<Menu.Item value="/events">
									<Menu.ItemText class="flex items-center space-x-2"
										><CalendarDays size={16} />
										<p>Events</p></Menu.ItemText
									>
								</Menu.Item>
								<Menu.Item value="/blog">
									<Menu.ItemText class="flex items-center space-x-2"
										><PencilLine size={16} />
										<p>Blog</p></Menu.ItemText
									>
								</Menu.Item>
								{#if data.user}
									<Menu.Item value="/logout">
										<Menu.ItemText class="flex items-center space-x-2">
											<LogOut size={16} />
											<p>Logout</p></Menu.ItemText
										>
									</Menu.Item>
								{/if}
							</Menu.Content>
						</Menu.Positioner>
					</Portal>
				</Menu>
			</AppBar.Trail>
		</AppBar.Toolbar>
	</AppBar>

	<!-- Main page content -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Footer -->
	<div class="flex flex-wrap justify-center space-y-1 p-5 text-center">
		<div class="space-x-1 select-none md:space-x-2" id="contact">
			{#each links as link (link)}
				{@const Icon = link.icon}
				<a
					class="anchor"
					href={link.href}
					target="_blank"
					rel="external"
					aria-label={link.ariaLabel}><Icon size={22} class="inline-block" /></a
				>
			{/each}
		</div>
		<!-- Flex line break -->
		<div class="h-0 basis-full"></div>
		<p class="text-sm">
			&copy; {new Date().getFullYear()}
			CISV Saigon
		</p>
	</div>
</div>

<!-- Hidden form used for logging out -->
<form action="/logout" method="POST" id="logoutForm" class="hidden"></form>
