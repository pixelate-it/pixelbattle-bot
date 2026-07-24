/** Lowercase, strip punctuation, collapse whitespace. */
function normalize(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/** Character-bigram set of a normalized string. */
function bigrams(text: string): Set<string> {
    const clean = normalize(text).replace(/\s/g, "");
    const set = new Set<string>();
    for (let i = 0; i < clean.length - 1; i++) {
        set.add(clean.slice(i, i + 2));
    }
    return set;
}

/**
 * Sørensen–Dice coefficient over character bigrams — a dependency-free
 * similarity score in [0, 1] that is tolerant of typos and word order.
 */
export function similarity(a: string, b: string): number {
    const first = bigrams(a);
    const second = bigrams(b);
    if (first.size === 0 || second.size === 0) return 0;

    let overlap = 0;
    for (const gram of first) {
        if (second.has(gram)) overlap++;
    }

    return (2 * overlap) / (first.size + second.size);
}
