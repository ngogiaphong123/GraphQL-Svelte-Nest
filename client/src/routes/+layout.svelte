<script lang="ts">
	import '../app.css';
	import Footer from '../lib/components/layout/footer.svelte';
	import Navbar from '../lib/components/layout/navbar.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
</script>

<Navbar user={data.user} />
<div class="flex flex-1">
	<slot />
</div>
<Footer />
