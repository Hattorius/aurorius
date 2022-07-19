<script>
    import { onMount } from "svelte";
    import Menu from "../components/Menu.svelte";
    import { goto } from '$app/navigation';

    let left;
    let right;
    let logo;
    let menu;

    onMount(() => setTimeout(() => {
        left.style.left = '-50%';
        right.style.right = '-50%';

        setTimeout(() => {
            const rect = logo.getBoundingClientRect();
            logo.style.position = 'absolute';
            logo.style.top = rect.top + 'px';
            logo.style.left = rect.left + 'px';

            setTimeout(() => {
                logo.style.top = '15px';
                logo.style.width = '100%';
                logo.style.maxWidth = '260px';
                logo.style.left = '0px';
                logo.style.fontSize = '2.5rem';
                
                setTimeout(() => {
                    menu.style.left = '0px';
                    setTimeout(() => {
                        logo.style.display = 'none';
                        goto('welcome');
                    }, 300);
                }, 700);
            }, 150);
        }, 1000);
    }, 300));
</script>

<div class="index">
    <div bind:this={logo} class="logo">
        Aurorius
    </div>
    <div bind:this={left} class="half left"></div>
    <div bind:this={right} class="half right"></div>

    <div bind:this={menu} class="menu">
        <Menu/>
    </div>
</div>

<style>
    div.index {
        height: 100vh;
        background: #121212;
        color: #f03232;
        font-weight: 500;
        font-size: 4rem;

        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        position: relative;
    }

    div.index > div.logo {
        max-height: 400px;
        height: 100%;
        transition: 1s ease;
        display: flex;
        justify-content: center;
        z-index: 100;
    }

    div.half {
        position: absolute;
        top: 0;
        bottom: 0;
        background: #121212;
        width: 50vw;

        transition: 1s ease-in;
        z-index: 99999;
    }
    div.half.left {
        left: 0;
    }
    div.half.right {
        right: 0;
    }

    div.index > div.menu { 
        width: 100%;
        max-width: 260px;
        background: #1c1c1c;
        height: 100vh;
        position: absolute;
        left: -260px;
        transition: .3s ease;
    }
</style>