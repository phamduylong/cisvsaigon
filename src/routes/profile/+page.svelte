<script>
	import { Avatar, FileUpload, createToaster, Toast } from '@skeletonlabs/skeleton-svelte';
	import { PUBLIC_POCKETBASE_FILE_URL } from '$env/static/public';
	import { getInitials } from '$lib/helper/stringFunctions';
	let { data } = $props();
	let avatarSrc = $state(`${data.user?.collectionId}/${data.user?.id}/${data.user?.avatar}/`);
	const toaster = createToaster();

    /**
     * 
     * @param {{ files: File[]}} details
     */
	function uploadAvatar(details) {
		return new Promise(async (resolve, reject) => {
			try {
				const file = details?.files?.[0];
				if (!file) return resolve(null);

				const formData = new FormData();
				formData.append('avatar', file);

				const resp = await fetch(`/profile?/updateImage`, {
					method: 'POST',
					body: formData
				});

				if (!resp.ok) {
					throw new Error(`Upload failed: ${resp.status}`);
				}

				const body = await resp.json();
				const returnUrl = JSON.parse(body.data)?.[0] ?? null;

				resolve(returnUrl);
			} catch (err) {
				reject(err);
			}
		});
	}
</script>

<div
	class="container mx-auto flex w-screen place-content-center items-center justify-center p-10 md:mt-10"
>
	<form
		method="POST"
		class="flex w-md flex-col items-center justify-center space-y-5 card bg-surface-50-950 p-5 md:w-lg md:space-y-10 lg:w-xl lg:p-10"
	>
		<Avatar class="inline size-16 rounded-full!">
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
			<input class="input" type="text" name="displayName" value={data.user?.displayName} required />
		</label>

		<label class="label">
			<span class="label-text flex">New password</span>
			<input class="input" type="password" name="newPassword" placeholder="New password" required />
		</label>

		<label class="label">
			<span class="label-text flex">Confirm password</span>
			<input
				class="input"
				type="password"
				name="newPassword"
				placeholder="Confirm password"
				required
			/>
		</label>
	</form>
</div>
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