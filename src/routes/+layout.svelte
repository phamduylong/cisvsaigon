<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import { AppBar, Menu, Portal } from '@skeletonlabs/skeleton-svelte';
	import { Toast } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/components/toaster';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import Facebook from '@lucide/svelte/icons/facebook';
	import Instagram from '@lucide/svelte/icons/instagram';
	import Mail from '@lucide/svelte/icons/mail';
	import User from '@lucide/svelte/icons/user';
	import BookImage from '@lucide/svelte/icons/book-image';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import PencilLine from '@lucide/svelte/icons/pencil-line';
	import LogOut from '@lucide/svelte/icons/log-out';
	import UserLock from '@lucide/svelte/icons/user-lock';
	import { goto } from '$app/navigation';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	let { children, data } = $props();

	const footerLinks = [
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

	const staticMenuLinks = [
		{
			href: '/gallery',
			text: 'Gallery',
			icon: BookImage
		},
		{
			href: '/events',
			text: 'Events',
			icon: CalendarDays
		},
		{
			href: '/blog',
			text: 'Blog',
			icon: PencilLine
		}
	];
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon" />
	<title>CISV Saigon</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="m-0 flex h-full min-h-screen flex-col">
	<!-- App bar -->
	<AppBar>
		<AppBar.Toolbar class="flex">
			<AppBar.Lead class="flex w-1/3 justify-start">
				<a href="/" title="CISV Vietnam Logo"
					><enhanced:img
						src={favicon}
						alt="CISV Logo"
						class="h-12 bg-transparent md:h-16"
						fetchpriority="high"
					/></a
				>
			</AppBar.Lead>
			<AppBar.Headline class="flex w-1/3 justify-center">
				<a href="/" class="text-md font-bold md:text-xl lg:text-2xl">CISV SAIGON</a>
			</AppBar.Headline>
			<AppBar.Trail class="flex w-1/3 justify-end space-x-2 md:space-x-5">
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
					<Menu.Trigger
						aria-label="menu"
						class="btn preset-filled bg-primary-700-300 hover:preset-tonal"
						><p class="hidden md:block">Menu</p>
						<MenuIcon size={20} /></Menu.Trigger
					>
					<Portal>
						<Menu.Positioner>
							<Menu.Content>
								<span class="flex items-center justify-between"
									><p class="block text-xs leading-[text-xs] font-medium no-underline">Mode</p>
									<LightSwitch /></span
								>

								<hr class="hr" />
								{#if !data.user}
									<Menu.Item value="/login">
										<Menu.ItemText class="flex items-center space-x-2"
											><UserLock size={16} />
											<p>Login</p></Menu.ItemText
										>
									</Menu.Item>
								{:else}
									<Menu.Item value="/profile">
										<Menu.ItemText class="flex items-center space-x-2">
											<User size={16} />
											<p>Profile</p>
										</Menu.ItemText>
									</Menu.Item>
								{/if}
								{#each staticMenuLinks as sml (sml.text)}
									{@const Icon = sml.icon}
									<Menu.Item value={sml.href}>
										<Menu.ItemText class="flex items-center space-x-2"
											><Icon size={16} />
											<p>{sml.text}</p></Menu.ItemText
										>
									</Menu.Item>
								{/each}
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
			{#each footerLinks as link (link)}
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

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>
