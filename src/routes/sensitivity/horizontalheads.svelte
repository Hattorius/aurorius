<script>
	import { sensitivity } from './../../stores/sensitivity.store.js';
    import { get } from 'svelte/store';
	import { initializeGame } from './../../scripts/initializegame.js';


    let canvas;
    let game;
    let error = '';
    let started = false;
    let setHeight = 0;
    const onShoot = (crosshairPlacement, elements) => {
        var hit = false;
        var hitI = 0;
        for (var i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (crosshairPlacement[0] - 15 < element[0] && crosshairPlacement[0] + 15 > element[0] && crosshairPlacement[1] - 15 < element[1] && crosshairPlacement[1] + 15 > element[1]) {
                hit = true;
                hitI = i;
                console.log('hit');
            }
        }

        var closestI;
        var closestOffset = 99999;
        if (!hit) {
            for (var i = 0; i < elements.length; i++) {
                const element = elements[i];
                var xOffset = crosshairPlacement[0] - element[0];
                var yOffset = crosshairPlacement[1] - element[1];
                if (xOffset < 0) xOffset *= -1;
                if (yOffset < 0) yOffset *= -1;
                const offset = (xOffset + yOffset) / 2;
                if (offset < closestOffset) {
                    closestI = i;
                    closestOffset = offset;
                }
            }

            console.log("Overshot by", closestOffset)
        } else {
            elements[hitI] = [game.virtualWidth / 4 + (Math.random() * (game.virtualWidth / 2)), setHeight, 15];
            game.setElements(elements);
            game.createCircles();
        }
    }

    const start = () => {
        started = true;
        game = new initializeGame(canvas);
        if (!game.success) {
            error = 'Your browser does not support WebGL';
            return;
        }
        game.setSensitivity(get(sensitivity));

        game.init(onShoot);
        setHeight = game.virtualHeight / 2 - 7.5;
        game.setElements([
            [game.virtualWidth / 4 + (Math.random() * (game.virtualWidth / 2)), setHeight, 15],
            [game.virtualWidth / 4 + (Math.random() * (game.virtualWidth / 2)), setHeight, 15]
        ]);
        game.createCircles();
    }

</script>

<div>
    <canvas bind:this={canvas}></canvas>
    {#if error != ''}
        <div class="error">
            {error}
        </div>
    {/if}
    {#if !started}
        <div class="error">
            <button on:click={start}>Start</button>
        </div>
    {/if}
    <div class="crosshairholder">
        O
    </div>
</div>

<style>
    div {
        overflow: hidden;
        width: 100%;
        height: 100vh;
    }

    canvas {
        width: 100vw;
        height: 100vh;
        cursor: none;
    }

    div.error {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;

        display: flex;
        align-items: center;
        justify-content: center;

        backdrop-filter: blur(2px);
        font-size: 1.3rem;
    }

    div.crosshairholder {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 40;

        display: flex;
        align-items: center;
        justify-content: center;

        color: #3bc460;
        font-weight: 700;
    }

    button {
        color: #fff;
        border: 0;
        background: rgba(0, 0, 0, 0.9);
        transition: 300ms ease;
        padding: .6rem 2rem;
        font-size: 1rem;
        cursor: pointer;
    }
    button:hover {
        background: rgba(0, 0, 0, 0.8);
    }
</style>