<script>
	import { Avatar, FileUpload } from '@skeletonlabs/skeleton-svelte';
	import { PUBLIC_POCKETBASE_FILE_URL } from '$env/static/public';
	import { getInitials } from '$lib/helper/stringFunctions';
	import { toaster } from '$lib/components/toaster';
	import { t, getLocale } from '$lib/stores/i18n.svelte.js';
	import { heicTo, isHeic } from 'heic-to';
	let { data } = $props();
	let avatarSrc = $derived(`${data.user?.collectionId}/${data.user?.id}/${data.user?.avatar}/`);

	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let displayName = $derived(data.user?.displayName);

	const passwordEntered = $derived(newPassword || confirmPassword);

	const passwordDoNotMatch = $derived(passwordEntered && newPassword !== confirmPassword);

	const displayNameChanged = $derived(displayName !== data.user?.displayName);

	const passwordTooShort = $derived(
		passwordEntered && !passwordDoNotMatch && newPassword.length < 8
	);

	const passwordTooLong = $derived(
		passwordEntered && !passwordDoNotMatch && newPassword.length > 20
	);

	const oldPasswordTooLong = $derived(oldPassword && oldPassword.length > 20);

	const oldPasswordTooShort = $derived(oldPassword && oldPassword.length < 8);

	/**
	 * Returns a promise whether image upload succeeded
	 * @param {{ files: File[]}} details
	 */
	async function uploadAvatar(details) {
		const file = details?.files?.[0];
		if (!file) return null;

		let image = file;

		const originalName = image.name;

		// Check if the file is HEIC/HEIF
		// HEIC is not supported by a lot of browsers so we convert it to JPG
		if (await isHeic(image)) {
			// Convert to JPEG
			const blob = await heicTo({
				blob: file,
				type: 'image/jpeg',
				quality: 0.99
			});
			image = new File([blob], originalName.replaceAll('.heic', '.jpg'));
		}

		const formData = new FormData();
		formData.append('avatar', image);

		const resp = await fetch('/profile?/updateImage', {
			method: 'POST',
			body: formData
		});

		const body = await resp.json();

		if (!resp.ok) {
			throw new Error(JSON.stringify(body.error.message));
		}
		const returnUrl = JSON.parse(body.data)?.[0] ?? null;

		return returnUrl;
	}

	function validateAndSubmitForm() {
		const _form = document.getElementById('updateUserForm');

		if (!(_form instanceof HTMLFormElement)) {
			console.error('form cannot be found');
			return;
		}

		/** @type {HTMLFormElement} */
		const form = _form;

		if (!form) return;

		if (!passwordEntered && displayNameChanged) {
			form.submit();
			return;
		}

		if (passwordEntered && passwordDoNotMatch) {
			toaster.error({
				title: t('profile_page.error_title'),
				description: t('profile_page.password_fields_do_not_match')
			});
			return;
		}

		// Old password missing
		if (passwordEntered && !passwordDoNotMatch && !oldPassword) {
			toaster.error({
				title: t('profile_page.error_title'),
				description: t('profile_page.old_password_is_required')
			});
			return;
		}

		if (passwordTooShort) {
			toaster.error({
				title: t('profile_page.error_title'),
				description: t('profile_page.field_is_too_short', {
					field: t('profile_page.new_password')
				})
			});
			return;
		}

		if (passwordTooLong) {
			toaster.error({
				title: t('profile_page.error_title'),
				description: t('profile_page.field_is_too_long', {
					field: t('profile_page.new_password')
				})
			});
			return;
		}

		if (oldPasswordTooShort) {
			toaster.error({
				title: t('profile_page.error_title'),
				description: t('profile_page.field_is_too_short', {
					field: t('profile_page.old_password')
				})
			});
			return;
		}

		if (oldPasswordTooLong) {
			toaster.error({
				title: t('profile_page.error_title'),
				description: t('profile_page.field_is_too_long', {
					field: t('profile_page.old_password')
				})
			});
			return;
		}

		// form data is good, let's submit.
		form?.submit();
	}
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon's member profile page" />
	<title>CISV Saigon - {data.user.displayName}</title>
</svelte:head>

<div class="container mx-auto flex w-screen place-content-center items-center justify-center p-10">
	<form
		id="updateUserForm"
		action="?/updateUser"
		method="POST"
		class="flex w-md flex-col items-center justify-center space-y-5 card bg-surface-50-950 p-5 md:w-lg md:space-y-10 lg:w-xl lg:p-10"
	>
		<Avatar class="inline size-32 rounded-full">
			<Avatar.Image
				class="size-full object-cover"
				src={`${PUBLIC_POCKETBASE_FILE_URL}/${avatarSrc}`}
				alt="Author's avatar"
			/>
			<Avatar.Fallback>{getInitials(data.user?.displayName)}</Avatar.Fallback>
		</Avatar>
		<FileUpload
			locale={getLocale()}
			maxFileSize={10485760}
			accept="image/*"
			data-sveltekit-reload
			class="w-fit"
			onFileAccept={(details) => {
				toaster.promise(uploadAvatar(details), {
					loading: {
						title: t('profile_page.loading_title'),
						description: t('profile_page.uploading_image')
					},
					success: (newAvatar) => {
						avatarSrc = newAvatar;
						return {
							title: t('profile_page.success_title'),
							description: t('profile_page.avatar_updated')
						};
					},
					error: (err) => ({
						title: t('profile_page.error_title'),
						description: t('profile_page.upload_image_failed', { error: err })
					})
				});
			}}
		>
			<FileUpload.Trigger type="button" class="btn preset-filled bg-primary-700-300 text-sm"
				>{t('profile_page.update_profile_picture')}</FileUpload.Trigger
			>
			<FileUpload.HiddenInput />
		</FileUpload>
		<label class="label">
			<span class="label-text flex">{t('profile_page.display_name')}</span>
			<input class="input" type="text" name="displayName" value={displayName} required />
		</label>

		<label class="label">
			<span class="label-text flex">{t('profile_page.old_password')}</span>
			<input
				class="input"
				type="password"
				name="oldPassword"
				placeholder={t('profile_page.old_password')}
				minlength="8"
				maxlength="20"
				required
				bind:value={oldPassword}
			/>
		</label>

		<label class="label">
			<span class="label-text flex">{t('profile_page.new_password')}</span>
			<input
				class="input"
				type="password"
				name="newPassword"
				placeholder={t('profile_page.new_password')}
				minlength="8"
				maxlength="20"
				required
				bind:value={newPassword}
			/>
		</label>

		<label class="label">
			<span class="label-text flex">{t('profile_page.confirm_password')}</span>
			<input
				class="input"
				type="password"
				name="confirmPassword"
				placeholder={t('profile_page.confirm_password')}
				minlength="8"
				maxlength="20"
				required
				bind:value={confirmPassword}
			/>
		</label>

		<button
			type="button"
			class="btn preset-filled bg-primary-700-300"
			onclick={() => validateAndSubmitForm()}>{t('profile_page.save_button')}</button
		>
	</form>
</div>
