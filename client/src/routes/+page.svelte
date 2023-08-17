<script lang="ts">
	import { Avatar, Card, GradientButton } from 'flowbite-svelte';
	import { Button, Modal } from 'flowbite-svelte';
	export let data: any;
	let roles = '';
	let isAdmin = false;
	let clickOutsideModal = false;
	if (data.user) {
		roles = data.user.roles.map((role: any) => role).join(', ');
		isAdmin = data.user.roles.includes('admin');
	}
</script>

{#if data.user}
	<div class="flex justify-center w-full">
		<Card padding="sm" class="h-fit">
			<div class="flex flex-col items-center pb-4">
				<Avatar
					size="lg"
					src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-1/324434955_698084685027170_4239885583316627773_n.jpg?stp=c0.0.200.200a_dst-jpg_p200x200&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=XMjXaRwulEsAX9cze_9&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfBlllpSV01WemwP3oJhp6oJv1yZIDF8zhXzMqELOp11Jw&oe=64E16B28"
				/>
				<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
					Username : {data.user.username}
				</h5>
				<span class="text-sm text-gray-500 dark:text-gray-400"
					>Email : {data.user.email}</span
				>
				<span class="text-sm text-gray-500 dark:text-gray-400">Roles : {roles}</span>
				{#if isAdmin}
					<GradientButton
						class="mt-4"
						on:click={() => {
							clickOutsideModal = true;
						}}
						color="purple">View users</GradientButton
					>
				{/if}
			</div>
		</Card>
	</div>
	<Modal title="Users in system" bind:open={clickOutsideModal} autoclose outsideclose>
		{#if data.props.users}
			{#each data.props.users as user}
				<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
					Username : {user.username}
				</h5>
				<span class="text-sm text-gray-500 dark:text-gray-400">Email : {user.email}</span>
			{/each}
		{/if}
		<svelte:fragment slot="footer">
			<Button>OK</Button>
			<Button color="alternative">Close</Button>
		</svelte:fragment>
	</Modal>
{:else}
	<div class="flex w-full justify-center">
		<div>
			<h1>Welcome, guest</h1>
			<p>You are not logged in.</p>
		</div>
	</div>
{/if}
