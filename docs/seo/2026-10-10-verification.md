# Search property verification — 2026-10-10

Purpose: enable native Google and Microsoft measurement and keyword research for
https://www.yikat.tech/ using the business owner's emre@yikat.tech account.

- Google Search Console URL-prefix property: public HTML verification tag read
  from the native ownership dialog. Preserve the existing verification token.
- Bing Webmaster Tools: public msvalidate.01 tag read from the native verification
  panel. Both native properties are now verified on the published website.
- This first release changes only public verification metadata. It does not
  activate ads, grant mailbox access, change DNS, or claim the site is indexed.
- Google Ads planning access was verified separately with Turkish language and
  Turkey, Istanbul and Bakirkoy geographic filters. No ad resources created.

PR #14 merged at `22cc30a349fcf564bfd13fed70ffe0e7fcae1950`.
GitHub's Vercel deployment 6987857613 reports production success at that SHA.
Normal https://www.yikat.tech/ serves both public verification tags. Google
confirmed URL-prefix ownership and Bing opened native Keyword Research.
The separate Google domain property is not verified; do not conflate the two.
