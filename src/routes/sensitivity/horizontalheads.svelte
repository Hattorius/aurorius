<script>
	import { calc } from './../../scripts/calc.js';
	import { sessions } from './../../stores/sessions.store.js';
	import { sensitivity } from './../../stores/sensitivity.store.js';
    import { get } from 'svelte/store';
	import { initializeGame } from './../../scripts/initializegame.js';

    const calculateNewSensitivity = () => {
        const prevSessions = get(sessions);
        console.log(prevSessions['horizontalheads']);
        var numbers = [];
        var varianceTimeTillDamages = [];
        for (var i = 0; i < prevSessions['horizontalheads'].length; i++) {
            const session = prevSessions['horizontalheads'][i];
            for (var j = 0; j < session.hits - session.misses; j++) {
                numbers.push(session.sensitivity);
            }
            varianceTimeTillDamages.push(session.varianceTimeTillDamage);
        }
        var positiveZScores = [];
        var zScores = calc.zScores(numbers);
        console.log(zScores);
        const max = calc.max(numbers);
        const min = calc.max(varianceTimeTillDamages) * -2;
        console.log(min);
        for (var i = 0; i < zScores.length; i++) {
            if (zScores[i] > min && zScores[i] < max) {
                positiveZScores.push(zScores[i]);
            }
        }
        return (calc.median(positiveZScores) + calc.average(positiveZScores)) / 2;
    }

    const sessionSample = {
        scoreHistory: [],
        hits: 0,
        misses: 0,
        missOffsets: [],
        hitTimeTillDamage: [],
        missTimeTillDamage: [],
        averageMissOffset: 0,
        medianMissOffset: 0,
        averageTimeTillDamage: 0,
        medianTimeTillDamage: 0,
        varianceTimeTillDamage: 0,
        varianceMissOffset: 0,
        standardDeviationTimeTillDamage: 0,
        standardDeviationMissOffset: 0,
        meanAbsoluteDeviationTimeTillDamage: 0,
        meanAbsoluteDeviationMissOffset: 0,
        zScoresTimeTillDamage: [],
        zScoresMissOffset: [],
        sensitivity: 0
    };
    var session = sessionSample;
    let score = 0;
    let timeLeft = 0;
    let canvas;
    let game;
    let error = '';
    let started = false;
    let setHeight = 0;
    let damagePrev = 0;
    let startTime = 0;
    const onShoot = (crosshairPlacement, elements) => {
        var hit = false;
        var hitI = 0;
        for (var i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (crosshairPlacement[0] - 15 < element[0] && crosshairPlacement[0] + 15 > element[0] && crosshairPlacement[1] - 15 < element[1] && crosshairPlacement[1] + 15 > element[1]) {
                hit = true;
                hitI = i;
                console.log('hit');
                session.hits += 1;
            }
        }

        var closestI;
        var closestOffset = 99999;
        const newDamagePrev = Math.floor((new Date()).getTime() / 10);
        const timeTillDamage = (newDamagePrev - damagePrev) / 100;
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

            score -= closestOffset * (timeTillDamage + 1);
            console.log("missed by", closestOffset)
            session.missOffsets.push(closestOffset)
            session.misses += 1;
            session.missTimeTillDamage.push(timeTillDamage);
        } else {
            console.log(timeTillDamage);
            score += timeTillDamage * 100;

            elements[hitI] = [game.virtualWidth / 4 + (Math.random() * (game.virtualWidth / 2.5)), setHeight, 15];
            game.setElements(elements);
            game.createCircles();
            damagePrev = newDamagePrev;
            session.hitTimeTillDamage.push(timeTillDamage);
        }

        score = Math.floor(score);
        session.scoreHistory.push(score);
    }

    const start = () => {
        //started = true;
        game = new initializeGame(canvas);
        if (!game.success) {
            error = 'Your browser does not support WebGL';
            return;
        }

        switch(get(sessions)['horizontalheads'].length) {
            case 0:
                game.setSensitivity(get(sensitivity));
                break;
            case 1:
                game.setSensitivity(get(sensitivity) / 4);
                break;
            case 2:
                game.setSensitivity(get(sensitivity) * 4);
                break;
            default:
                const sens = calculateNewSensitivity();
                console.log("Calculated sens:", sens);
                game.setSensitivity(sens);
                break;
        }
        return;

        game.init(onShoot);
        setHeight = game.virtualHeight / 2 - 7.5;
        game.setElements([
            [game.virtualWidth / 4 + (Math.random() * (game.virtualWidth / 2.5)), setHeight, 15],
            [game.virtualWidth / 4 + (Math.random() * (game.virtualWidth / 2.5)), setHeight, 15]
        ]);
        game.createCircles();

        damagePrev = Math.floor((new Date()).getTime() / 10);
        startTime = (new Date()).getTime();
        timeLeft = 30;

        console.log("Sensitivity set:", game.sensitivity);

        const intervalId = setInterval(() => {
            const currentTime = (new Date()).getTime();
            if (currentTime / 1000 > startTime / 1000 + 30) {
                clearInterval(intervalId);
                timeLeft = 0;
                game.stop();

                session.averageMissOffset = session.missOffsets.reduce((a, b) => a + b, 0) / session.misses;
                session.medianMissOffset = calc.median(session.missOffsets);
                session.averageTimeTillDamage = session.hitTimeTillDamage.reduce((a, b) => a + b, 0) / session.hits;
                session.medianTimeTillDamage = calc.median(session.hitTimeTillDamage);

                session.varianceTimeTillDamage = calc.variance(session.hitTimeTillDamage);
                session.varianceMissOffset = calc.variance(session.missOffsets);
                session.standardDeviationTimeTillDamage = calc.standardDeviation(session.hitTimeTillDamage);
                session.standardDeviationMissOffset = calc.standardDeviation(session.missOffsets);
                session.meanAbsoluteDeviationTimeTillDamage = calc.meanAbsoluteDeviation(session.hitTimeTillDamage);
                session.meanAbsoluteDeviationMissOffset = calc.meanAbsoluteDeviation(session.missOffsets);
                session.zScoresMissOffset = calc.zScores(session.hitTimeTillDamage);
                session.zScoresTimeTillDamage = calc.zScores(session.missOffsets);

                session.sensitivity = game.sensitivity;

                const localSessions = get(sessions);
                localSessions['horizontalheads'].push(session);
                sessions.set(localSessions);

                session = sessionSample;
                setTimeout(() => window.location.reload(), 2000);
            }
            timeLeft = Math.floor(300 - Math.floor(currentTime / 100 - startTime / 100)) / 10;
        }, 50);
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

    <div class="stats">
        <h1>{timeLeft.toString()}s</h1>
        <h3>Score: {score}</h3>
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

    div.stats {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;

        text-align: center;
    }
    div.stats > h1 {
        font-weight: 500;
        margin: 0;

    }
    div.stats> h3 {
        font-weight: 400;
        margin: 0;
    }
</style>