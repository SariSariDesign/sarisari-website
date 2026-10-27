/** Offsite hrefs open in a new tab (Calendly, the diagnostic app). */
export const isExternal = (href: string) => /^https?:\/\//.test(href);
