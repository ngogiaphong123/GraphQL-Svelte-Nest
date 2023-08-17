<script>
	import Icon from '@iconify/svelte';

	const contactIcons = [
		'logos:facebook',
		'logos:twitter',
		'logos:telegram',
		'skill-icons:instagram',
		'devicon:linkedin'
	];
</script>

<footer class="navbar bg-primary w-full px-4 lg:px-16 py-4 items-center flex flex-col gap-2">
	<div class="flex flex-col w-full">
		<div class="flex md:flex-row flex-col justify-between items-center gap-2">
			<h1 class="uppercase font-bold text-red-800">DarkHorse Team</h1>
			<div class="flex gap-2 cursor-pointer">
				{#each contactIcons as icon}
					<Icon
						{icon}
						class="text-2xl p-2 border w-10 h-10 rounded-lg hover:bg-black/20"
					/>
				{/each}
			</div>
		</div>
	</div>
	<div
		class="flex md:flex-row flex-col justify-between items-center border-t pt-2 w-full md:text-base text-sm"
	>
		<div class="ak-bar-item ak-footer-copyright">
			Hehe
		</div>
		<div class="p-2">
			<ul
				id="menu-footer-navigation"
				class="flex flex-row justify-between items-center gap-4"
			>
				<li class="menu-item relative">
					<a
						href="#"
						on:click={() => {
						}}><span>Hehe</span></a
					>
				</li>
				<li class="menu-item relative">
					<a
						href="#"
						on:click={() => {
						}}><span> Hehe</span></a
					>
				</li>
				<li class="menu-item relative">
					<a
						href="#"
						on:click={() => {
						}}><span>Hehe</span></a
					>
				</li>
				<li class="menu-item relative">
					<a
						href="#"
						on:click={() => {
						}}><span>Hehe</span></a
					>
				</li>
			</ul>
		</div>
	</div>
</footer>

<style>
	.menu-item ::before {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0;
		height: 2px;
		background-color: #53c28a;
		transition: width 0.5s ease-in-out;
	}
	.menu-item:hover ::before {
		width: 100%;
	}
</style>
