<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import {
		Navbar,
		NavBrand,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider,
		GradientButton
	} from 'flowbite-svelte';
	export let user: any;
	const logout = async () => {
		await fetch('/api/logout', {
			method: 'POST'
		});
		invalidateAll();
		window.location.href = '/';
	};
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<img
			src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png"
			class="mr-3 h-6 sm:h-9"
			alt="Flowbite Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
			>Instagram</span
		>
	</NavBrand>
	{#if user}
		<div class="flex items-center md:order-2">
			<Avatar
				id="avatar-menu"
				src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-1/324434955_698084685027170_4239885583316627773_n.jpg?stp=c0.0.200.200a_dst-jpg_p200x200&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=XMjXaRwulEsAX9cze_9&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfBlllpSV01WemwP3oJhp6oJv1yZIDF8zhXzMqELOp11Jw&oe=64E16B28"
			/>
			<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
		</div>
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownHeader>
				<span class="block text-sm">{user.username}</span>
				<span class="block truncate text-sm font-medium">{user.email}</span>
			</DropdownHeader>
			<DropdownDivider />
			<DropdownItem on:click={logout}>Sign out</DropdownItem>
		</Dropdown>
	{:else}
		<div class="flex items-center md:order-2 gap-4">
			<GradientButton
				on:click={() => {
					goto('/login');
				}}
				color="purple">Login</GradientButton
			>
			<GradientButton
				on:click={() => {
					goto('/register');
				}}
				color="purple">Register</GradientButton
			>
		</div>
	{/if}
</Navbar>
