<script>
	import Asterisk from '@lucide/svelte/icons/asterisk';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import { t } from '$lib/stores/i18n.svelte';
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon's login page" />
	<title>CISV Saigon - {t('login_form.title')}</title>
</svelte:head>

<!-- Careful since this 80vh might overflow. Fine for now -->
<div
	class="container mx-auto flex h-[80vh] w-screen place-content-center items-center justify-center p-10"
>
	<form
		method="POST"
		class="flex w-md flex-col justify-center space-y-5 card border-2 border-secondary-950-50 bg-surface-50-950 p-5 md:w-lg md:space-y-10 lg:w-xl lg:p-10"
	>
		<h1 class="mb-5 text-center h1">{t('login_form.title')}</h1>
		<span class="flex items-center justify-center space-x-2"
			><CircleAlert size={20} />
			<p class="text-md text-error-950-50">{t('login_form.staff_only_remark')}</p></span
		>
		<fieldset class="space-y-4">
			<!-- Input -->
			<label class="label">
				<span class="label-text flex"
					>{t('login_form.email')} <Asterisk size={12} color="red" /></span
				>
				<input
					class="input"
					type="email"
					placeholder={t('login_form.email')}
					name="email"
					required
				/>
			</label>
			<!-- Input -->
			<label class="label">
				<span class="label-text flex"
					>{t('login_form.password')} <Asterisk size={12} color="red" /></span
				>
				<input
					class="input"
					type="password"
					placeholder={t('login_form.password')}
					name="password"
					required
				/>
			</label>
		</fieldset>
		<fieldset class="flex justify-center">
			<!-- Button -->
			<button type="submit" class="btn preset-filled bg-primary-700-300"
				>{t('login_form.submit')}</button
			>
		</fieldset>
	</form>
</div>
