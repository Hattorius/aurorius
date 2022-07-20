import { browser } from "$app/env";
import { writable } from "svelte/store";

export const sessions = writable({});

if (browser) {
    const sessionsValue = localStorage.getItem('sessions');
    if (sessionsValue != null) {
        sessions.set(JSON.parse(sessionsValue));
    } else {
        sessions.set({
            horizontalheads: []
        });
    }

    sessions.subscribe((sessionsValue) => {
        localStorage.setItem('sessions', JSON.stringify(sessionsValue));
    });
}