# DNS Cutover Checklist — sarisari.design (Webflow → Vercel)

To run together in a follow-up session. **Nothing here happens automatically.**

## Pre-flight (before touching DNS)

- [ ] Copy deck reviewed and ⚠️ items signed off (`content/copy-deck.md`)
- [ ] Webfont licenses purchased (PP Editorial Old, Neue Montreal, Supply → Pangram Pangram), `.woff2` files dropped in `public/fonts/` with the exact names in `globals.css`
- [ ] Real assets placed (or consciously shipping placeholders — see `docs/asset-inventory.md`)
- [ ] Contact email confirmed (`hello@sarisari.design` is a guess) + LinkedIn/Instagram URLs in `src/content/site.ts`
- [ ] Terms/Privacy legal copy added (current pages are stubs)
- [ ] Analytics decision: live site runs Intellimize; new site ships with none — add Vercel Analytics or GA4 if wanted
- [ ] `vercel deploy --prod` on the `sari-sari-website` project and verify production URL

## Cutover

- [ ] Add `sarisari.design` + `www.sarisari.design` as domains on the Vercel `sari-sari-website` project (Vercel shows required records)
- [ ] At the DNS host (currently Cloudflare per response headers): point apex A/CNAME and `www` CNAME to Vercel (`cname.vercel-dns.com`), drop the Webflow records
- [ ] If Cloudflare proxying stays on, set SSL mode Full (strict)
- [ ] Verify https://www.sarisari.design serves the new site; apex redirects to www (or vice versa — pick one in Vercel)

## Post-cutover

- [ ] Old URLs 308 correctly in production: `/services` `/portfolio` `/pricing` → anchors; `/kenchan-ramen-case-study` → `/work/kenchan-ramen`
- [ ] Update the short.gy link `website-cs-kr-bundle` target to the new URL (it currently points at the Webflow page)
- [ ] Calendly link works from all four CTAs
- [ ] Confirm the link-preview (OG) card renders when the URL is shared (Slack/iMessage/LinkedIn)
- [ ] Keep the Webflow site unpublished-but-paid for ~30 days as rollback, then cancel
- [ ] Google Search Console: re-verify property, submit sitemap
