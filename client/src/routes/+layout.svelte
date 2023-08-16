<script lang="ts">
	import '../app.css';
	import Navbar from '../lib/components/layout/navbar.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
</script>

<Navbar user={data.user} />
<div class="min-h-screen">
	<slot />
</div>
