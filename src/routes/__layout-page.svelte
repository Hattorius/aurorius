<script>
	import { goto } from '$app/navigation';
    import { onMount } from "svelte";
    import Menu from "../components/Menu.svelte";

    let content;

    onMount(() => {
        content.style.transform = 'translateY(0)';
        content.style.opacity = 1;
    });

    const goto2 = (url) => {
        content.style.transform = 'translateY(50px)';
        content.style.opacity = 0;
        setTimeout(() => {
            goto(url);
            content.style.transform = 'translateY(0)';
            content.style.opacity = 1;
        }, 300);
    }
</script>

<div class="page">
    <div class="menu">
        <Menu goto={goto2}/>
    </div>
    <div bind:this={content} class="content hidden">
        <slot/>
    </div>
</div>

<style>
    div.page {
        height: 100vh;
        background: #121212;
        position: relative;
        overflow: hidden;
        display: flex;

    }

    div.page > div.menu {
        width: 100%;
        max-width: 260px;
        background: #1c1c1c;
        height: 100vh;
    }

    div.page > div.content {
        color: #fff;
        flex-grow: 1;
        transition: 300ms ease;
        padding: 1rem;
    }

    div.page > div.content.hidden {
        opacity: 0;
        transform: translateY(50px);
    }
</style>