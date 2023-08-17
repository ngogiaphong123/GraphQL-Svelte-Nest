<script>
	import { enhance } from '$app/forms';
	import { GradientButton, Input, Label } from 'flowbite-svelte';
	export let form;

	$: {
		if (form?.isSuccessful) {
			window.location.href = '/';
		} else {
			console.log(form);
		}
	}
</script>

<section class="flex text-white justify-center w-full h-full">
	<div class="w-panel rounded-3xl shadow-md shadow-zinc-400 my-6 border bg-white">
		{#if form}
			{#if form.errors}
				<div class="w-full p-6 flex justify-evenly flex-col items-center xl:gap-6 gap-4">
					<div class="text-red-500">
						{#each form.errors as error}
							<p>{error.message}</p>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
		<form
			class="w-full p-6 flex justify-evenly flex-col items-center xl:gap-6 gap-4"
			action="?/register"
			method="post"
			use:enhance={() => {
				return async ({ update }) => {
					await update({ reset: false });
				};
			}}
		>
			<div class="">
				<Label for="email" class="block mb-2">Email:</Label>
				<Input id="email" name="email" size="lg" type="text" placeholder="Email" />
			</div>
			<div class="">
				<Label for="username" class="block mb-2">Username:</Label>
				<Input id="username" name="username" size="lg" type="text" placeholder="Username" />
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
			<GradientButton type="submit">Register</GradientButton>
		</form>
	</div>
</section>
