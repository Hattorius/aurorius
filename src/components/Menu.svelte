<script>
	import { location } from './../stores/location.store.js';
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';

    let logo;

    let welcome;
    let finder;
    let training;

    onMount(() => {
        if (window.location.pathname == "/") {
            logo.style.visibility = 'hidden';
        }
        
        setTimeout(() => {
            if (window.location.pathname == "/") {
                logo.style.visibility = 'visible';
            }
        }, 2450)

        location.subscribe(path => {
            if (path == "/welcome") {
                welcome.style.borderRight = '1px solid #fff;'
            }
        });
    });
</script>

<div>
    <div bind:this={logo} class="logo">
        Aurorius
    </div>
    
    <ul>
        <li bind:this={welcome}><Icon icon="mdi:hand-wave" /> Welcome</li>
        <li bind:this={finder}><Icon icon="mdi:mouse-move-vertical" /> Sensitivity finder</li>
        <li bind:this={training}><Icon icon="et:scope" /> Training</li>
    </ul>
</div>

<style>
    div.logo {
        display: flex;
        justify-content: center;
        font-size: 2.5rem;
        padding-top: 15px;
        padding-bottom: 1rem;
        color: #f03232;
    }

    ul {
        font-size: 1.2rem;
        list-style: none;
        color: #fff;
        padding-top: 1rem;
        padding-left: 0;
    }

    li {
        display: flex;
        align-items: center;
        gap: 5px;
        padding-left: 2rem;
        padding-top: .6rem;
        padding-bottom: .6rem;
    }
</style>