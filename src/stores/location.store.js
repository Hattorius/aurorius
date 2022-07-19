import { browser } from "$app/env";
import { writable } from "svelte/store";

export const location = writable();

setInterval(() => {
    if (browser) {
        location.set(window.location.pathname);
    }
}, 100);