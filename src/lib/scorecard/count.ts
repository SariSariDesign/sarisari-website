const WORDS = ["zero", "one", "two", "three", "four", "five"];

/** "one".."five" for small counts (reads better in copy), digits above. */
export const countWord = (n: number) => WORDS[n] ?? String(n);
