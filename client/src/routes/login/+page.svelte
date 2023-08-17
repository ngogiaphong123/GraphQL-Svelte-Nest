<script lang="ts">
	import { enhance } from '$app/forms';
	import { GradientButton, Input, Label } from 'flowbite-svelte';
	export let form;

	let errorMessage: any;

	$: {
		if (form?.isSuccessful) {
			window.location.href = '/';
		} else {
			errorMessage = form?.errors[0]?.message;
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
			{#if errorMessage}
				<div class="text-red-500">
					<p>{errorMessage}</p>
				</div>
			{/if}
			<div class="">
				<Label for="email" class="block mb-2">Email:</Label>
				<Input id="email" name="email" size="lg" type="text" placeholder="Email" />
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
