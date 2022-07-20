<script>
	import { sensitivity } from './../stores/sensitivity.store.js';
    import { get } from "svelte/store";
    import Card from "../components/Card.svelte";

    let newSensitivity = get(sensitivity);
    let game = 0;
</script>

<div class="sensitivity">
    <div class="left">
        <Card>
            <h1>Current sensitivity</h1>
            <input bind:value={newSensitivity} type="number" step="0.01" min="0.01" max="10" on:change={() => {
                if (newSensitivity * 100 < 1) {
                    newSensitivity = 0.01;
                } else if (newSensitivity > 10) {
                    newSensitivity = 10;
                }

                sensitivity.set(newSensitivity);
            }}>
        </Card>

        <Card>
            <h1 style="margin-bottom: 1rem;">Games</h1>

            <div class="game" on:click={() => game = 1}>
                Horizontal Heads
            </div>
        </Card>
    </div>
    <div class="grow">
        {#if game != 0}
            <Card>
                <h1 style="margin-bottom: 1rem;">
                    {#if game == 1}
                    Horizontal Heads
                    {/if}
                </h1>

                <div class="btn_holder">
                    <button>Start</button>
                </div>
            </Card>
        {/if}
    </div>
</div>

<style>
    div.sensitivity {
        display: flex;
        gap: 1rem;
    }

    div.sensitivity > div.left {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 450px;
        gap: 1rem;
    }
    .grow {
        flex-grow: 1;
    }

    h1 {
        margin: 0;
        font-weight: 500;
        font-size: 1.4rem;
    }

    input[type="number"] {
        width: 100%;
        text-align: center;
        border: 0;
        background: rgba(255, 255, 255, 0.03);
        color: #fff;
        font-size: 2rem;
        margin-top: 1rem;
    }

    div.game {
        width: 100%;
        transition: 300ms ease;
        padding-left: 2rem;
        padding-top: .4rem;
        padding-bottom: .4rem;
        font-size: 1.1rem;
        cursor: pointer;
    }
    div.game:hover {
        background: rgba(255, 255, 255, 0.03);
    }

    div.btn_holder {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
    }

    button {
        color: #fff;
        border: 0;
        background: rgba(255, 255, 255, 0.03);
        transition: 300ms ease;
        padding: .6rem 2rem;
        font-size: 1rem;
        cursor: pointer;
    }
    button:hover {
        background: rgba(255, 255, 255, 0.07);
    }
</style>