<script>
	import { Avatar, FileUpload } from '@skeletonlabs/skeleton-svelte';
	import { PUBLIC_POCKETBASE_FILE_URL } from '$env/static/public';
	import { getInitials } from '$lib/helper/stringFunctions';
	import { toaster } from '$lib/components/toaster';
	let { data } = $props();
	let avatarSrc = $state(`${data.user?.collectionId}/${data.user?.id}/${data.user?.avatar}/`);

	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let displayName = $state(data.user?.displayName);

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

		const formData = new FormData();
		formData.append('avatar', file);

		const resp = await fetch('/profile?/updateImage', {
			method: 'POST',
			body: formData
		});

		if (!resp.ok) {
			throw new Error(`Upload failed: ${resp.status}`);
		}

		const body = await resp.json();
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
				title: 'Error',
				description: 'Password fields do not match.'
			});
			return;
		}

		// Old password missing
		if (passwordEntered && !passwordDoNotMatch && !oldPassword) {
			toaster.error({
				title: 'Error',
				description: 'Old password is required.'
			});
			return;
		}

		if (passwordTooShort) {
			toaster.error({
				title: 'Error',
				description: 'Password is too short. Please use at least 8 characters.'
			});
			return;
		}

		if (passwordTooLong) {
			toaster.error({
				title: 'Error',
				description: 'Password is too long. Please use at max 20 characters.'
			});
			return;
		}

		if (oldPasswordTooShort) {
			toaster.error({
				title: 'Error',
				description: 'Old password is too short. Please use at least 8 characters.'
			});
			return;
		}

		if (oldPasswordTooLong) {
			toaster.error({
				title: 'Error',
				description: 'Old password is too long. Please use at max 20 characters.'
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

<div
	class="container mx-auto flex h-[80vh] w-screen place-content-center items-center justify-center p-10"
>
	<form
		id="updateUserForm"
		action="?/updateUser"
		method="POST"
		class="flex w-md flex-col items-center justify-center space-y-5 card bg-surface-50-950 p-5 md:w-lg md:space-y-10 lg:w-xl lg:p-10"
	>
		<Avatar class="inline size-32 rounded-full! border-4 border-surface-950-50">
			<Avatar.Image
				class="size-full object-cover"
				src={`${PUBLIC_POCKETBASE_FILE_URL}/${avatarSrc}`}
				alt="Author's avatar"
			/>
			<Avatar.Fallback>{getInitials(data.user?.displayName)}</Avatar.Fallback>
		</Avatar>
		<FileUpload
			data-sveltekit-reload
			class="w-fit"
			onFileAccept={(details) => {
				toaster.promise(uploadAvatar(details), {
					loading: {
						title: 'Loading...',
						description: 'Uploading image...'
					},
					success: (newAvatar) => {
						avatarSrc = newAvatar;
						return {
							title: 'Success',
							description: 'Your avatar has been updated.'
						};
					},
					error: (err) => ({
						title: 'Error',
						description: `Failed to update avatar. Error: ${err}`
					})
				});
			}}
		>
			<FileUpload.Trigger type="button" class="btn preset-filled text-sm"
				>Change profile picture</FileUpload.Trigger
			>
			<FileUpload.HiddenInput />
		</FileUpload>
		<label class="label">
			<span class="label-text flex">Display name</span>
			<input class="input" type="text" name="displayName" value={displayName} required />
		</label>

		<label class="label">
			<span class="label-text flex">Old password</span>
			<input
				class="input"
				type="password"
				name="oldPassword"
				placeholder="Old password"
				minlength="8"
				maxlength="20"
				required
				bind:value={oldPassword}
			/>
		</label>

		<label class="label">
			<span class="label-text flex">New password</span>
			<input
				class="input"
				type="password"
				name="newPassword"
				placeholder="New password"
				minlength="8"
				maxlength="20"
				required
				bind:value={newPassword}
			/>
		</label>

		<label class="label">
			<span class="label-text flex">Confirm password</span>
			<input
				class="input"
				type="password"
				name="confirmPassword"
				placeholder="Confirm password"
				minlength="8"
				maxlength="20"
				required
				bind:value={confirmPassword}
			/>
		</label>

		<button type="button" class="btn preset-filled" onclick={() => validateAndSubmitForm()}
			>Save</button
		>
	</form>
</div>
