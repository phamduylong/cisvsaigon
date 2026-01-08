<script>
	import { Asterisk } from '@lucide/svelte';
</script>

<main
	class="container mx-auto flex h-[80vh] w-screen place-content-center items-center justify-center p-10"
>
	<form
		class="flex w-md flex-col justify-center space-y-10 card border-2 border-secondary-950-50 bg-surface-50-950 p-5 md:w-lg lg:p-10"
	>
		<h1 class="mb-10 text-center h1">Login</h1>
		<span class="flex space-x-2 justify-center items-center"><CircleAlert size={20} /><p class="text-error-950-50 text-md">Intended for Staffies only</p></span>
		<fieldset class="space-y-4">
			<!-- Input -->
			<label class="label">
				<span class="label-text flex">Username <Asterisk size={12} color="red" /></span>
				<input class="input" type="text" placeholder="Username" name="Username" required />
			</label>
			<!-- Input -->
			<label class="label">
				<span class="label-text flex">Password <Asterisk size={12} color="red" /></span>
				<input class="input" type="password" placeholder="Password" name="Password" required />
			</label>
		</fieldset>
		<fieldset class="flex justify-center">
			<!-- Button -->
			<button type="submit" class="btn preset-filled bg-primary-700-300">Submit</button>
		</fieldset>
	</form>
</main>
