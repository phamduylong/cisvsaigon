<script>
	import Asterisk from '@lucide/svelte/icons/asterisk';
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	let noAgeLimit = $state(false);
</script>

<svelte:head>
	<meta name="description" content="CISV Saigon's form to create new events" />
	<title>CISV Saigon - Events - Create new event</title>
</svelte:head>

<div
	class="container mx-auto flex w-screen place-content-center items-center justify-center p-10 md:mt-10"
>
	<form
		method="POST"
		class="flex w-md flex-col justify-center space-y-5 card bg-surface-50-950 p-5 md:w-lg md:space-y-10 lg:w-xl lg:p-10"
	>
		<h1 class="mb-15 text-center h1">Add new event</h1>
		<fieldset class="space-y-6">
			<!-- Title -->
			<label class="label">
				<span class="label-text flex">Title<Asterisk size={12} color="red" /></span>
				<input class="input" type="text" placeholder="Title of the event" name="title" required />
			</label>

			<!-- Event dates -->
			<span class="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
				<!-- Start date -->
				<label class="label">
					<span class="label-text flex">Start date<Asterisk size={12} color="red" /></span>
					<input
						class="input"
						type="datetime-local"
						name="startDate"
						value={new Date().toISOString().slice(0, 16)}
						required
					/>
				</label>
				<!-- End date -->
				<label class="label">
					<span class="label-text flex">End date<Asterisk size={12} color="red" /></span>
					<input
						class="input"
						type="datetime-local"
						name="endDate"
						value={new Date().toISOString().slice(0, 16)}
						required
					/>
				</label>
			</span>

			<!-- Registration link -->
			<label class="label">
				<span class="label-text flex">Registration link<Asterisk size={12} color="red" /></span>
				<input
					class="input"
					type="url"
					placeholder="Link to the register form"
					name="registrationLink"
					required
				/>
			</label>

			<!-- Age range -->
			<span class="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
				<label class="label">
					<span class="label-text flex"
						>Min. age {#if !noAgeLimit}
							<Asterisk size={12} color="red" />
						{/if}</span
					>
					<input class="input" type="number" name="minAge" min="0" required disabled={noAgeLimit} />
				</label>
				<!-- End date -->
				<label class="label">
					<span class="label-text flex">Max. age </span>
					<input class="input" type="number" name="maxAge" min="0" disabled={noAgeLimit} />
				</label>
			</span>

			<div class="flex flex-col items-center justify-start">
				<Switch checked={noAgeLimit} onCheckedChange={(details) => (noAgeLimit = details.checked)}>
					<Switch.Control>
						<Switch.Thumb />
					</Switch.Control>
					<Switch.Label>No age limit</Switch.Label>
					<Switch.HiddenInput />
				</Switch>
			</div>

			<!-- Description -->
			<label class="label">
				<span class="label-text flex">Short description<Asterisk size={12} color="red" /></span>
				<textarea
					class="textarea rounded-container"
					name="shortDescription"
					rows="4"
					placeholder="Short description of what is the event about?"
					required
				></textarea>
			</label>
		</fieldset>
		<fieldset class="flex justify-center">
			<!-- Button -->
			<button type="submit" class="btn preset-filled bg-primary-700-300">Submit</button>
		</fieldset>
	</form>
</div>
