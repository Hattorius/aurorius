<script>
    export let height = '';
</script>

<div style="height: {height};">
    <slot/>
</div>

<style>
    div {
        background: #1c1c1c;
        padding: 1rem;
        border-radius: 11px;
    }
</style>