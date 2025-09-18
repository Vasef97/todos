export function intensifyColor(hex, factor = 2) {
    let c = hex.replace(/^#/, "");
    if (c.length === 3) {
        c = c
            .split("")
            .map(ch => ch + ch)
            .join("");
    }
    const num = parseInt(c, 16);
    let r = ((num >> 16) & 0xff) * factor;
    let g = ((num >> 8) & 0xff) * factor;
    let b = (num & 0xff) * factor;

    r = Math.min(255, Math.round(r));
    g = Math.min(255, Math.round(g));
    b = Math.min(255, Math.round(b));

    return (
        "#" +
        ((1 << 24) | (r << 16) | (g << 8) | b)
            .toString(16)
            .slice(1)
            .toUpperCase()
    );
}
