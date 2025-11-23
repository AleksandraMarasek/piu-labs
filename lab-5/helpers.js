export function randomHsl() {
    const h = Math.floor(Math.random() * 360);
    const s = 55 + Math.floor(Math.random() * 20);
    const l = 65 + Math.floor(Math.random() * 10);
    return `hsl(${h} ${s}% ${l}%)`;
}

export function uid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID)
        return crypto.randomUUID();
    return 'id-' + Math.random().toString(36).slice(2, 9);
}
