<script>
	import { enhance } from '$app/forms';
	import { GradientButton, Input, Label } from 'flowbite-svelte';
	export let form;

	$: {
		if (form?.isSuccessful) {
			window.location.href = '/';
		}
	}
</script>

<section class="flex text-white justify-center w-full h-full">
	<div class="w-panel rounded-3xl shadow-md shadow-zinc-400 my-6 border bg-white">
		<form
			class="w-full p-6 flex justify-evenly flex-col items-center xl:gap-6 gap-4"
			action="?/login"
			method="post"
			use:enhance={() => {
				return async ({ update }) => {
					await update({ reset: false });
				};
			}}
		>
			<div class="">
				<Label for="email" class="block mb-2">Email:</Label>
				<Input id="email" name="email" size="lg" type="email" placeholder="Email" />
			</div>
			<div class="">
				<Label for="password" class="block mb-2">Password:</Label>
				<Input
					name="password"
					size="lg"
					type="password"
					id="password"
					placeholder="Password"
				/>
			</div>
			<GradientButton type="submit">Login</GradientButton>
		</form>
	</div>
</section>
