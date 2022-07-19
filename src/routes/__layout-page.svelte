<script>
    import Menu from "../components/Menu.svelte";

</script>

<div class="page">
    <div class="menu">
        <Menu/>
    </div>
    <div class="content">
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
    }
</style>