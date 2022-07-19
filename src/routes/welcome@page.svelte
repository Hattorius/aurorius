<script>
    import { onMount } from "svelte";

    let welcome;

    onMount(() => setInterval(() => {
        welcome.style.transform = 'translateY(0)';
        welcome.style.opacity = 1;
    }, 100));
</script>

<div bind:this={welcome} class="welcome hidden">
    hi
</div>

<style>
    div.welcome {
        padding: 1rem;
        transition: 1s ease;
    }

    div.welcome.hidden {
        opacity: 0;
        transform: translateY(100px);
    }
</style>